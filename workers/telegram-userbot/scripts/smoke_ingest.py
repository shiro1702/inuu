#!/usr/bin/env python3
"""One-shot ingest POST smoke test (no Telethon)."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

import httpx

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from config import load_config


def main() -> None:
    parser = argparse.ArgumentParser(description="Smoke POST to /api/ingest/content/submit")
    parser.add_argument("--message-id", type=int, default=999001)
    parser.add_argument("--source-key", default="smoke_test_channel")
    parser.add_argument(
        "--raw-text",
        default="15 июня в 19:00 — тестовый анонс userbot smoke. Билеты: https://example.com",
    )
    args = parser.parse_args()

    config = load_config()
    headers = {"Content-Type": "application/json"}
    if config.ingest_secret:
        headers["x-ingest-secret"] = config.ingest_secret

    payload = {
        "rawText": args.raw_text,
        "sourceKind": "telegram_parse",
        "sourceUrl": f"https://t.me/{args.source_key.lstrip('@')}/{args.message_id}",
        "sourceExternalId": f"smoke:{args.source_key}:{args.message_id}",
        "citySlug": "ulan-ude",
        "timezone": "Asia/Irkutsk",
        "persist": True,
    }

    url = f"{config.ingest_api_url}/api/ingest/content/submit"
    res = httpx.post(url, headers=headers, json=payload, timeout=120.0)
    print(f"HTTP {res.status_code}")
    try:
        print(json.dumps(res.json(), ensure_ascii=False, indent=2))
    except Exception:
        print(res.text)
    res.raise_for_status()


if __name__ == "__main__":
    main()
