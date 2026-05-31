"""Load whitelisted Telegram sources from Supabase."""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

import httpx

from config import Config
from models import TelegramSource


def _headers(config: Config) -> dict[str, str]:
    return {
        "apikey": config.supabase_secret_key,
        "Authorization": f"Bearer {config.supabase_secret_key}",
        "Content-Type": "application/json",
    }


def fetch_active_sources(config: Config) -> list[TelegramSource]:
    params = {
        "select": "id,city_id,source_key,source_type,last_seen_message_id,ingest_mode,cities!inner(slug,timezone)",
        "is_active": "eq.true",
        "ingest_mode": "eq.realtime",
    }
    url = f"{config.supabase_url}/rest/v1/city_telegram_sources"
    with httpx.Client(timeout=30.0) as client:
        res = client.get(url, headers=_headers(config), params=params)
        res.raise_for_status()
        rows: list[dict[str, Any]] = res.json()

    sources: list[TelegramSource] = []
    for row in rows:
        city = row.get("cities") or {}
        sources.append(
            TelegramSource(
                id=str(row["id"]),
                city_id=str(row["city_id"]),
                city_slug=str(city.get("slug") or ""),
                city_timezone=str(city.get("timezone") or "Asia/Irkutsk"),
                source_key=str(row["source_key"]),
                source_type=str(row.get("source_type") or "channel"),
                last_seen_message_id=(
                    int(row["last_seen_message_id"])
                    if row.get("last_seen_message_id") is not None
                    else None
                ),
                ingest_mode=str(row.get("ingest_mode") or "realtime"),
            )
        )
    return sources


def update_last_seen_message_id(
    config: Config,
    source_id: str,
    message_id: int,
) -> None:
    url = f"{config.supabase_url}/rest/v1/city_telegram_sources"
    params = {"id": f"eq.{source_id}"}
    body = {
        "last_seen_message_id": message_id,
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }
    headers = _headers(config)
    headers["Prefer"] = "return=minimal"
    with httpx.Client(timeout=30.0) as client:
        res = client.patch(url, headers=headers, params=params, json=body)
        res.raise_for_status()
