#!/usr/bin/env python3
"""Create Telethon StringSession for TELEGRAM_SESSION_STRING."""

from __future__ import annotations

import asyncio
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from config import load_config
from telethon import TelegramClient
from telethon.sessions import StringSession


async def main() -> None:
    config = load_config()
    client = TelegramClient(
        StringSession(),
        config.telegram_api_id,
        config.telegram_api_hash,
    )
    async with client:
        session = client.session.save()
    print("\nAdd to workers/telegram-userbot/.env:\n")
    print(f"TELEGRAM_SESSION_STRING={session}\n")


if __name__ == "__main__":
    asyncio.run(main())
