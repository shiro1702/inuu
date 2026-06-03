"""Normalize Telegram messages into INUU ingest payloads."""

from __future__ import annotations

import re
from typing import Any

from models import TelegramSource

URL_RE = re.compile(r"https?://[^\s<>\"')\]]+", re.IGNORECASE)


def extract_message_text(message: Any) -> str:
    parts: list[str] = []
    text = getattr(message, "message", None) or getattr(message, "text", None)
    if isinstance(text, str) and text.strip():
        parts.append(text.strip())
    caption = getattr(message, "caption", None)
    if isinstance(caption, str) and caption.strip():
        parts.append(caption.strip())
    return "\n".join(parts).strip()


def has_ingestible_content(raw_text: str) -> bool:
    if len(raw_text.strip()) >= 10:
        return True
    return bool(URL_RE.search(raw_text))


def build_source_meta(message: Any) -> tuple[str | None, str]:
    chat = getattr(message, "chat", None) or getattr(message, "peer_id", None)
    message_id = int(getattr(message, "id", 0) or getattr(message, "message_id", 0) or 0)

    chat_id: int | str | None = None
    username: str | None = None

    if chat is not None:
        chat_id = getattr(chat, "id", None)
        username = getattr(chat, "username", None)
        if username:
            username = str(username).lstrip("@")

    if chat_id is None:
        peer = getattr(message, "peer_id", None)
        if peer is not None:
            channel_id = getattr(peer, "channel_id", None)
            chat_id = getattr(peer, "chat_id", None) or channel_id

    if chat_id is None:
        raise ValueError("Cannot resolve chat_id for message")

    source_external_id = f"{chat_id}:{message_id}"
    source_url = f"https://t.me/{username}/{message_id}" if username and message_id else None
    return source_url, source_external_id


def message_to_ingest_payload(message: Any, source: TelegramSource) -> dict[str, Any] | None:
    raw_text = extract_message_text(message)
    if not has_ingestible_content(raw_text):
        return None

    source_url, source_external_id = build_source_meta(message)

    return {
        "rawText": raw_text,
        "sourceKind": "telegram_parse",
        "sourceIntake": "telegram_channel",
        "sourceUrl": source_url,
        "sourceExternalId": source_external_id,
        "citySlug": source.city_slug,
        "timezone": source.city_timezone,
        "persist": True,
    }
