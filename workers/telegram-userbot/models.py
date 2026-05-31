"""Shared datatypes for the userbot worker."""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class TelegramSource:
    id: str
    city_id: str
    city_slug: str
    city_timezone: str
    source_key: str
    source_type: str
    last_seen_message_id: int | None
    ingest_mode: str
