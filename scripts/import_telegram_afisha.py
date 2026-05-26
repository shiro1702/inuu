#!/usr/bin/env python3
"""
Import Telegram HTML export (docs/data/messages.html) into INUU Supabase.

Creates per weekly album:
  - editorial_posts (afisha_digest)
  - editorial_post_media (gallery)
  - curated_lists (week picker)
  - events (one per photo poster; videos only in gallery)

Usage:
  python3 scripts/import_telegram_afisha.py
  python3 scripts/import_telegram_afisha.py --dry-run
  python3 scripts/import_telegram_afisha.py --static-only   # copy to public/, no Supabase writes

Env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SECRET_KEY
"""

from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import sys
import uuid
from datetime import datetime, timedelta, timezone
from html import unescape
from pathlib import Path

import requests

ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "docs" / "data"
HTML_PATH = DATA_DIR / "messages.html"
PUBLIC_AFISHA = ROOT / "public" / "content" / "afisha" / "telegram"
BUCKET = "city-editorial-media"
SOURCE_CHANNEL = "in.ulanude"
CITY_SLUG = "ulan-ude"
EDITORIAL_SHOP_SLUG = "inuu-editorial"


def load_env() -> None:
    env_path = ROOT / ".env"
    if not env_path.exists():
        return
    for line in env_path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, val = line.partition("=")
        os.environ.setdefault(key.strip(), val.strip().strip('"').strip("'"))


def parse_albums(html: str) -> list[dict]:
    parts = re.split(r'(<div class="message[^"]*" id="message[^"]+">)', html)
    current_date: str | None = None
    albums: list[dict] = []
    current: dict | None = None

    def extract_media(block: str) -> list[dict]:
        items: list[dict] = []
        for m in re.finditer(r'href="(photos/[^"]+\.jpg)"', block):
            p = m.group(1)
            if "_thumb" not in p:
                items.append({"type": "photo", "path": p})
        for m in re.finditer(r'href="(video_files/[^"]+)"', block):
            p = m.group(1)
            if "_thumb" not in p and p.lower().endswith((".mov", ".mp4", ".webm")):
                items.append({"type": "video", "path": p})
        return items

    def extract_text(block: str) -> str | None:
        m = re.search(r'<div class="text">\s*(.*?)\s*</div>', block, re.S)
        if not m:
            return None
        t = unescape(re.sub(r"<br\s*/?>", "\n", m.group(1)))
        t = re.sub(r"<[^>]+>", "", t).strip()
        return t or None

    for i in range(1, len(parts), 2):
        header = parts[i]
        body = parts[i + 1] if i + 1 < len(parts) else ""
        if "message service" in header:
            m = re.search(r"<div class=\"body details\">\s*([^<]+)", body)
            if m:
                current_date = m.group(1).strip()
            continue
        is_joined = "joined" in header
        mid = re.search(r'id="(message\d+)"', header)
        if not mid:
            continue
        message_id = mid.group(1)
        tm = re.search(r'title="([^"]+)"', body)
        ts = tm.group(1) if tm else None
        media = extract_media(body)
        text = extract_text(body)
        tg_num = int(re.sub(r"\D", "", message_id) or "0")
        if not is_joined:
            current = {
                "id": message_id,
                "telegram_message_id": tg_num,
                "service_date": current_date,
                "telegram_ts": ts,
                "caption": text,
                "media": media,
            }
            albums.append(current)
        elif current:
            current["media"].extend(media)

    return albums


def parse_telegram_ts(ts: str | None) -> datetime | None:
    if not ts:
        return None
    m = re.match(
        r"(\d{2})\.(\d{2})\.(\d{4})\s+(\d{2}):(\d{2}):(\d{2})\s+UTC([+-]\d{2}):(\d{2})",
        ts,
    )
    if not m:
        return None
    d, mo, y, h, mi, s, zh, zm = m.groups()
    offset = timezone(timedelta(hours=int(zh), minutes=int(zm) * (1 if zh.startswith("+") else -1)))
    # fix sign for minutes
    sign = 1 if zh.startswith("+") else -1
    offset = timezone(timedelta(hours=int(zh), minutes=sign * int(zm)))
    return datetime(int(y), int(mo), int(d), int(h), int(mi), int(s), tzinfo=offset)


def digest_slug(published: datetime) -> str:
    return f"afisha-digest-{published.strftime('%Y-%m-%d')}"


def poster_slug(source_path: str) -> str:
    base = Path(source_path).stem
    safe = re.sub(r"[^a-zA-Z0-9]+", "-", base).strip("-").lower()
    return f"afisha-poster-{safe}"[:80]


def supabase_headers() -> dict[str, str]:
    key = os.environ.get("SUPABASE_SECRET_KEY") or os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
    if not key:
        raise SystemExit("Missing SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SECRET_KEY")
    return {
        "apikey": key,
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates,return=representation",
    }


def sb_base() -> str:
    url = os.environ.get("SUPABASE_URL", "").rstrip("/")
    if not url:
        raise SystemExit("Missing SUPABASE_URL")
    return url


def sb_get(path: str, params: dict | None = None) -> list | dict:
    r = requests.get(f"{sb_base()}/rest/v1/{path}", headers=supabase_headers(), params=params or {}, timeout=60)
    r.raise_for_status()
    return r.json()


def sb_upsert(table: str, rows: list[dict], on_conflict: str) -> list[dict]:
    headers = supabase_headers()
    headers["Prefer"] = f"resolution=merge-duplicates,return=representation"
    r = requests.post(
        f"{sb_base()}/rest/v1/{table}",
        headers=headers,
        params={"on_conflict": on_conflict},
        data=json.dumps(rows),
        timeout=120,
    )
    if r.status_code >= 400:
        raise RuntimeError(f"Upsert {table} failed: {r.status_code} {r.text[:500]}")
    return r.json() if r.text else []


def schema_has_telegram_columns() -> bool:
    r = requests.get(
        f"{sb_base()}/rest/v1/editorial_posts",
        headers=supabase_headers(),
        params={"select": "excerpt,post_type", "limit": 1},
        timeout=30,
    )
    return r.status_code == 200


def upload_storage(city_id: str, rel_path: str, local_file: Path) -> str:
    key = os.environ.get("SUPABASE_SECRET_KEY") or os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
    object_path = f"{city_id}/telegram/{rel_path.replace('/', '-')}"
    mime = "video/quicktime" if local_file.suffix.lower() == ".mov" else "image/jpeg"
    with local_file.open("rb") as f:
        r = requests.post(
            f"{sb_base()}/storage/v1/object/{BUCKET}/{object_path}",
            headers={
                "apikey": key,
                "Authorization": f"Bearer {key}",
                "Content-Type": mime,
                "x-upsert": "true",
            },
            data=f.read(),
            timeout=180,
        )
    if r.status_code >= 400:
        raise RuntimeError(f"Storage upload failed: {r.status_code} {r.text[:300]}")
    return f"{sb_base()}/storage/v1/object/public/{BUCKET}/{object_path}"


def copy_static(rel_path: str, local_file: Path) -> str:
    dest = PUBLIC_AFISHA / rel_path.replace("/", "__")
    dest.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(local_file, dest)
    return f"/content/afisha/telegram/{dest.name}"


def main() -> None:
    load_env()
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--static-only", action="store_true", help="Only copy files to public/; skip Supabase")
    parser.add_argument(
        "--absolute-urls",
        action="store_true",
        help="Prefix media URLs with NUXT_APP_URL (default: site-relative /content/...)",
    )
    args = parser.parse_args()

    if not HTML_PATH.exists():
        raise SystemExit(f"Missing {HTML_PATH}")

    albums = parse_albums(HTML_PATH.read_text(encoding="utf-8"))
    print(f"Parsed {len(albums)} weekly digests, {sum(len(a['media']) for a in albums)} media items")

    if args.dry_run:
        print(json.dumps(albums, ensure_ascii=False, indent=2))
        return

    use_supabase = not args.static_only
    city_id: str | None = None
    shop_id: str | None = None
    app_url = os.environ.get("NUXT_APP_URL", "").rstrip("/")
    full_schema = False

    if use_supabase:
        cities = sb_get("cities", {"slug": f"eq.{CITY_SLUG}", "select": "id,slug"})
        if not cities:
            raise SystemExit(f"City {CITY_SLUG} not found — run migrations/seed first")
        city_id = cities[0]["id"]
        shops = sb_get(
            "shops",
            {"city_id": f"eq.{city_id}", "slug": f"eq.{EDITORIAL_SHOP_SLUG}", "select": "id"},
        )
        shop_id = shops[0]["id"] if shops else None
        full_schema = schema_has_telegram_columns()
        if not full_schema:
            print(
                "Note: migration 022 not applied — using legacy columns only. "
                "Run supabase/migrations/022_inuu_telegram_content.sql in SQL Editor, then re-import.",
                file=sys.stderr,
            )

    for album in albums:
        published = parse_telegram_ts(album.get("telegram_ts")) or datetime.now(timezone.utc)
        slug = digest_slug(published)
        title = f"Афиша — {published.strftime('%d.%m.%Y')}"
        excerpt = (album.get("caption") or "").split("\n")[0][:200]

        media_urls: list[dict] = []
        for idx, item in enumerate(album["media"]):
            rel = item["path"]
            local = DATA_DIR / rel
            if not local.exists():
                print(f"  skip missing file: {rel}", file=sys.stderr)
                continue
            if args.static_only:
                url = copy_static(rel, local)
            else:
                assert city_id
                try:
                    url = upload_storage(city_id, rel, local)
                except Exception as e:
                    print(f"  storage failed {rel}, fallback static: {e}", file=sys.stderr)
                    url = copy_static(rel, local)
            # Relative paths work on any deployment; set NUXT_APP_URL only with --absolute-urls
            if app_url and getattr(args, "absolute_urls", False):
                url = f"{app_url}{url}" if url.startswith("/") else url
            media_urls.append({**item, "url": url, "sort_order": idx})

        if args.static_only:
            print(f"[static] {slug}: {len(media_urls)} files")
            continue

        assert city_id
        gallery_meta = {
            "telegram_message_id": album["id"],
            "service_date": album.get("service_date"),
            "telegram_ts": album.get("telegram_ts"),
            "gallery": [
                {"type": m["type"], "url": m["url"], "path": m["path"], "sort_order": m["sort_order"]}
                for m in media_urls
            ],
        }
        body = (album.get("caption") or title) + "\n\n<!-- inuu-telegram-gallery\n" + json.dumps(
            gallery_meta, ensure_ascii=False
        ) + "\n-->"

        post_row: dict = {
            "city_id": city_id,
            "shop_id": shop_id,
            "slug": slug,
            "title": title,
            "body": body,
            "cover_media_url": media_urls[0]["url"] if media_urls else None,
            "is_published": True,
            "published_at": published.isoformat(),
        }
        if full_schema:
            post_row.update(
                {
                    "excerpt": excerpt,
                    "post_type": "afisha_digest",
                    "source_channel": SOURCE_CHANNEL,
                    "source_telegram_message_id": album["telegram_message_id"],
                    "source_metadata": gallery_meta,
                }
            )

        posts = sb_upsert("editorial_posts", [post_row], "city_id,slug")
        post_id = posts[0]["id"]

        if full_schema:
            media_rows = []
            for m in media_urls:
                media_rows.append(
                    {
                        "post_id": post_id,
                        "sort_order": m["sort_order"],
                        "media_type": m["type"],
                        "media_url": m["url"],
                        "source_path": m["path"],
                        "source_telegram_message_id": album["telegram_message_id"],
                    }
                )
            if media_rows:
                sb_upsert("editorial_post_media", media_rows, "post_id,source_path")

        list_slug = f"afisha-week-{published.strftime('%Y-%m-%d')}"
        list_row: dict = {
            "city_id": city_id,
            "shop_id": shop_id,
            "slug": list_slug,
            "title": title,
            "description": excerpt,
            "is_published": True,
            "sort_order": int(published.strftime("%Y%m%d")),
        }
        if full_schema:
            list_row["source_channel"] = SOURCE_CHANNEL
            list_row["source_telegram_message_id"] = album["telegram_message_id"]

        lists = sb_upsert("curated_lists", [list_row], "city_id,slug")
        list_id = lists[0]["id"]

        event_rows = []
        list_items = []
        photo_idx = 0
        for m in media_urls:
            if m["type"] != "photo":
                continue
            photo_idx += 1
            starts = published + timedelta(days=min(photo_idx, 6))
            e_slug = poster_slug(m["path"])
            tg_suffix = re.search(r"photo_(\d+)", m["path"])
            tg_id = int(tg_suffix.group(1)) if tg_suffix else album["telegram_message_id"] * 1000 + photo_idx
            row: dict = {
                "city_id": city_id,
                "slug": e_slug,
                "title": f"Событие из афиши ({published.strftime('%d.%m')}, №{photo_idx})",
                "description": excerpt,
                "starts_at": starts.isoformat(),
                "ends_at": (starts + timedelta(hours=3)).isoformat(),
                "price": 0,
                "currency": "RUB",
                "cover_media_url": m["url"],
                "is_published": True,
                "is_promoted": photo_idx == 1,
            }
            if full_schema:
                row.update(
                    {
                        "source_channel": SOURCE_CHANNEL,
                        "source_telegram_message_id": tg_id,
                        "editorial_post_id": post_id,
                        "source_metadata": {"source_path": m["path"], "digest_slug": slug},
                    }
                )
            event_rows.append(row)

        if event_rows:
            events = sb_upsert("events", event_rows, "city_id,slug")
            for sort_i, ev in enumerate(events):
                list_items.append(
                    {
                        "list_id": list_id,
                        "entity_type": "event",
                        "entity_id": ev["id"],
                        "sort_order": (sort_i + 1) * 10,
                        "note": "Из Telegram-афиши",
                    }
                )
            if list_items:
                sb_upsert("curated_list_items", list_items, "list_id,entity_type,entity_id")

        print(f"OK {slug}: post + {len(media_urls)} media + {len(event_rows)} events")


if __name__ == "__main__":
    main()
