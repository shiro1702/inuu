"""Environment configuration for the Telegram userbot worker."""

from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path

from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parent


def _require(name: str) -> str:
    value = os.environ.get(name, "").strip()
    if not value:
        raise SystemExit(f"Missing required env: {name}")
    return value


def _int(name: str, default: int) -> int:
    raw = os.environ.get(name, "").strip()
    if not raw:
        return default
    try:
        return int(raw)
    except ValueError:
        raise SystemExit(f"Invalid integer env {name}={raw!r}")


@dataclass(frozen=True)
class Config:
    telegram_api_id: int
    telegram_api_hash: str
    telegram_session_string: str
    supabase_url: str
    supabase_secret_key: str
    ingest_api_url: str
    ingest_secret: str
    ingest_rate_limit_ms: int
    sources_reload_sec: int
    smoke_source_key: str | None
    smoke_message_id: int | None


def load_config() -> Config:
    load_dotenv(ROOT / ".env")
    load_dotenv(ROOT.parent.parent / ".env")

    smoke_key = os.environ.get("SMOKE_SOURCE_KEY", "").strip() or None
    smoke_id_raw = os.environ.get("SMOKE_MESSAGE_ID", "").strip()
    smoke_message_id = int(smoke_id_raw) if smoke_id_raw else None

    return Config(
        telegram_api_id=int(_require("TELEGRAM_API_ID")),
        telegram_api_hash=_require("TELEGRAM_API_HASH"),
        telegram_session_string=_require("TELEGRAM_SESSION_STRING"),
        supabase_url=_require("SUPABASE_URL").rstrip("/"),
        supabase_secret_key=(
            os.environ.get("SUPABASE_SECRET_KEY", "").strip()
            or os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "").strip()
            or _require("SUPABASE_SECRET_KEY")
        ),
        ingest_api_url=_require("INGEST_API_URL").rstrip("/"),
        ingest_secret=os.environ.get("INGEST_SECRET", "").strip(),
        ingest_rate_limit_ms=_int("INGEST_RATE_LIMIT_MS", 1000),
        sources_reload_sec=_int("SOURCES_RELOAD_SEC", 120),
        smoke_source_key=smoke_key,
        smoke_message_id=smoke_message_id,
    )
