#!/usr/bin/env python3
"""Create Telethon StringSession for TELEGRAM_SESSION_STRING."""

from __future__ import annotations

import asyncio
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from config import load_telegram_api_credentials
from telethon import TelegramClient
from telethon.errors import ApiIdInvalidError
from telethon.sessions import StringSession


def _mask_api_id(api_id: int) -> str:
    s = str(api_id)
    if len(s) <= 4:
        return "***"
    return f"{s[:2]}***{s[-2:]}"


def _print_api_id_help() -> None:
    print(
        """
Ошибка: Telegram отклонил api_id / api_hash.

Это НЕ токен @BotFather (NUXT_BOT_TOKEN). Нужна отдельная приложение-user API:

  1. Откройте https://my.telegram.org/apps (войдите тем же номером, что для userbot)
  2. Создайте приложение (любое имя)
  3. Скопируйте App api_id (число) и App api_hash (32 символа) в .env:

     TELEGRAM_API_ID=12345678
     TELEGRAM_API_HASH=abcdef1234567890abcdef1234567890

  4. Удобнее положить их в workers/telegram-userbot/.env
     (перекрывает корневой .env)

  5. api_id и api_hash должны быть из одной и той же записи на my.telegram.org
""".strip()
    )


async def main() -> None:
    api_id, api_hash = load_telegram_api_credentials()
    worker_env = ROOT / ".env"
    root_env = ROOT.parent.parent / ".env"
    print(f"Используем TELEGRAM_API_ID={_mask_api_id(api_id)}")
    print(f"  workers/.env: {'есть' if worker_env.exists() else 'нет'}")
    print(f"  корневой .env: {'есть' if root_env.exists() else 'нет'}")
    print()

    client = TelegramClient(
        StringSession(),
        api_id,
        api_hash,
    )
    try:
        async with client:
            session = client.session.save()
    except ApiIdInvalidError:
        _print_api_id_help()
        raise SystemExit(1) from None

    print("\nДобавьте в workers/telegram-userbot/.env (или корневой .env):\n")
    print(f"TELEGRAM_SESSION_STRING={session}\n")


if __name__ == "__main__":
    asyncio.run(main())
