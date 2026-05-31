"""Unit tests for message normalization (no network)."""

from __future__ import annotations

import sys
import unittest
from pathlib import Path
from types import SimpleNamespace

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from normalizer import build_source_meta, extract_message_text, has_ingestible_content, message_to_ingest_payload
from models import TelegramSource


def _source() -> TelegramSource:
    return TelegramSource(
        id="00000000-0000-0000-0000-000000000001",
        city_id="00000000-0000-0000-0000-000000000002",
        city_slug="ulan-ude",
        city_timezone="Asia/Irkutsk",
        source_key="standup_uu",
        source_type="channel",
        last_seen_message_id=None,
        ingest_mode="realtime",
    )


class NormalizerTests(unittest.TestCase):
    def test_extract_text_and_caption(self) -> None:
        msg = SimpleNamespace(message="Афиша", caption="15 июня 19:00", id=42)
        self.assertEqual(extract_message_text(msg), "Афиша\n15 июня 19:00")

    def test_has_ingestible_content(self) -> None:
        self.assertFalse(has_ingestible_content("short"))
        self.assertTrue(has_ingestible_content("15 июня в 19:00 — концерт в клубе"))
        self.assertTrue(has_ingestible_content("see https://example.com/event"))

    def test_build_source_meta_with_username(self) -> None:
        msg = SimpleNamespace(
            id=123,
            chat=SimpleNamespace(id=-1001234567890, username="standup_uu"),
        )
        url, ext_id = build_source_meta(msg)
        self.assertEqual(url, "https://t.me/standup_uu/123")
        self.assertEqual(ext_id, "-1001234567890:123")

    def test_message_to_payload(self) -> None:
        msg = SimpleNamespace(
            id=99,
            message="15 июня в 19:00 — стендап-вечер, билеты на входе",
            caption=None,
            chat=SimpleNamespace(id=-100111, username="standup_uu"),
        )
        payload = message_to_ingest_payload(msg, _source())
        assert payload is not None
        self.assertEqual(payload["sourceKind"], "telegram_parse")
        self.assertEqual(payload["sourceExternalId"], "-100111:99")
        self.assertEqual(payload["citySlug"], "ulan-ude")
        self.assertTrue(payload["persist"])

    def test_skip_empty_message(self) -> None:
        msg = SimpleNamespace(id=1, message="", caption=None, chat=SimpleNamespace(id=-100111, username="x"))
        self.assertIsNone(message_to_ingest_payload(msg, _source()))


if __name__ == "__main__":
    unittest.main()
