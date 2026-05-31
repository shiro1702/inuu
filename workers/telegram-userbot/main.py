#!/usr/bin/env python3
"""Telegram userbot ingestion worker for INUU."""

from __future__ import annotations

import argparse
import asyncio
import logging
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from config import Config, load_config
from worker import TelegramUserbotWorker


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="INUU Telegram userbot → ingest worker")
    parser.add_argument(
        "--smoke-message-id",
        type=int,
        default=None,
        help="Replay a single message id (requires --smoke-source-key or SMOKE_SOURCE_KEY)",
    )
    parser.add_argument(
        "--smoke-source-key",
        type=str,
        default=None,
        help="Source @username for smoke replay",
    )
    parser.add_argument(
        "--backfill",
        action="store_true",
        help="Обход последних постов канала (афиша до запуска воркера)",
    )
    parser.add_argument(
        "--backfill-source",
        type=str,
        default=None,
        help="@username одного канала для backfill (иначе — все активные)",
    )
    parser.add_argument(
        "--backfill-limit",
        type=int,
        default=50,
        help="Сколько последних постов читать на канал (default: 50)",
    )
    parser.add_argument(
        "-v",
        "--verbose",
        action="store_true",
        help="Debug logging",
    )
    return parser.parse_args()


def apply_smoke_overrides(config: Config, args: argparse.Namespace) -> Config:
    smoke_key = args.smoke_source_key or config.smoke_source_key
    smoke_id = args.smoke_message_id if args.smoke_message_id is not None else config.smoke_message_id
    if smoke_key or smoke_id is not None:
        from dataclasses import replace

        return replace(
            config,
            smoke_source_key=smoke_key,
            smoke_message_id=smoke_id,
        )
    return config


async def main_async() -> None:
    args = parse_args()
    logging.basicConfig(
        level=logging.DEBUG if args.verbose else logging.INFO,
        format="%(asctime)s %(levelname)s %(name)s: %(message)s",
    )

    config = apply_smoke_overrides(load_config(), args)
    worker = TelegramUserbotWorker(config)

    if config.smoke_source_key and config.smoke_message_id:
        async with worker._client:
            await worker.run_smoke_replay()
        return

    if args.backfill:
        await worker.run_backfill(
            source_key=args.backfill_source,
            limit=max(1, args.backfill_limit),
        )
        return

    await worker.run()


def main() -> None:
    try:
        asyncio.run(main_async())
    except KeyboardInterrupt:
        print("\nStopped.")


if __name__ == "__main__":
    main()
