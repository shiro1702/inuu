"""Telethon event handlers and ingest queue."""

from __future__ import annotations

import asyncio
import logging
from dataclasses import dataclass, field, replace
from typing import Any

from telethon import TelegramClient, events
from telethon.sessions import StringSession

from config import Config
from ingest_client import IngestClient
from normalizer import message_to_ingest_payload
from models import TelegramSource
from sources import fetch_active_sources, update_last_seen_message_id

logger = logging.getLogger(__name__)


@dataclass
class WorkerState:
    sources_by_key: dict[str, TelegramSource] = field(default_factory=dict)
    source_ids: set[str] = field(default_factory=set)
    initialized_peers: set[str] = field(default_factory=set)


@dataclass
class QueueItem:
    message: Any
    source: TelegramSource
    force: bool = False


class TelegramUserbotWorker:
    def __init__(self, config: Config) -> None:
        self._config = config
        self._ingest = IngestClient(config)
        self._state = WorkerState()
        self._queue: asyncio.Queue[QueueItem | None] = asyncio.Queue()
        self._client = TelegramClient(
            StringSession(config.telegram_session_string),
            config.telegram_api_id,
            config.telegram_api_hash,
        )

    async def reload_sources(self) -> None:
        sources = fetch_active_sources(self._config)
        self._state.sources_by_key = {s.source_key.lower().lstrip("@"): s for s in sources}
        self._state.source_ids = {s.id for s in sources}
        logger.info("Loaded %s active realtime source(s)", len(sources))
        for s in sources:
            logger.debug("  - %s (%s)", s.source_key, s.city_slug)

    def _resolve_source(self, message: Any) -> TelegramSource | None:
        chat = getattr(message, "chat", None)
        if chat is None:
            return None

        candidates: list[str] = []
        username = getattr(chat, "username", None)
        if username:
            candidates.append(str(username).lower().lstrip("@"))
        chat_id = getattr(chat, "id", None)
        if chat_id is not None:
            candidates.append(str(chat_id))

        for key in candidates:
            source = self._state.sources_by_key.get(key)
            if source:
                return source
        return None

    async def _bootstrap_peer(self, source: TelegramSource) -> None:
        if source.id in self._state.initialized_peers:
            return

        entity = await self._client.get_entity(source.source_key)
        if source.last_seen_message_id is None:
            latest_id = 0
            async for msg in self._client.iter_messages(entity, limit=1):
                latest_id = int(msg.id)
            if latest_id > 0:
                update_last_seen_message_id(self._config, source.id, latest_id)
                source = replace(source, last_seen_message_id=latest_id)
                self._state.sources_by_key[source.source_key.lower().lstrip("@")] = source
                logger.info(
                    "First connect %s: set last_seen_message_id=%s (skip history)",
                    source.source_key,
                    latest_id,
                )
        self._state.initialized_peers.add(source.id)

    async def _should_process(self, message: Any, source: TelegramSource, *, force: bool) -> bool:
        if force:
            return True

        message_id = int(getattr(message, "id", 0) or 0)
        last_seen = source.last_seen_message_id
        if last_seen is not None and message_id <= last_seen:
            logger.debug(
                "Skip old message %s:%s (last_seen=%s)",
                source.source_key,
                message_id,
                last_seen,
            )
            return False
        return True

    async def _enqueue_message(
        self,
        message: Any,
        *,
        force: bool = False,
    ) -> None:
        source = self._resolve_source(message)
        if not source:
            return

        if not await self._should_process(message, source, force=force):
            return

        await self._queue.put(QueueItem(message=message, source=source, force=force))

    async def _consumer(self) -> None:
        while True:
            item = await self._queue.get()
            if item is None:
                self._queue.task_done()
                break
            try:
                await self._process_item(item)
            except Exception:
                logger.exception(
                    "Failed to process message from %s",
                    item.source.source_key,
                )
            finally:
                self._queue.task_done()

    async def _process_item(self, item: QueueItem) -> None:
        payload = message_to_ingest_payload(item.message, item.source)
        if payload is None:
            logger.debug("Skip empty/non-ingestible message from %s", item.source.source_key)
            message_id = int(getattr(item.message, "id", 0) or 0)
            if message_id > 0:
                update_last_seen_message_id(self._config, item.source.id, message_id)
            return

        await self._ingest.submit(payload)
        message_id = int(getattr(item.message, "id", 0) or 0)
        if message_id > 0:
            update_last_seen_message_id(self._config, item.source.id, message_id)
            updated = replace(item.source, last_seen_message_id=message_id)
            key = updated.source_key.lower().lstrip("@")
            self._state.sources_by_key[key] = updated

    def _peer_filter(self) -> list[Any]:
        peers: list[Any] = []
        for source in self._state.sources_by_key.values():
            key = source.source_key.lstrip("@")
            if key.lstrip("-").isdigit():
                peers.append(int(key))
            else:
                peers.append(key)
        return peers

    async def _register_handlers(self) -> None:
        peers = self._peer_filter()
        if not peers:
            logger.warning("No active sources — message handlers not registered")
            return

        @self._client.on(events.NewMessage(chats=peers))
        async def on_new_message(event: events.NewMessage.Event) -> None:
            await self._enqueue_message(event.message)

        @self._client.on(events.MessageEdited(chats=peers))
        async def on_edited_message(event: events.MessageEdited.Event) -> None:
            await self._enqueue_message(event.message, force=True)

    async def _sources_reload_loop(self) -> None:
        while True:
            await asyncio.sleep(self._config.sources_reload_sec)
            try:
                await self.reload_sources()
            except Exception:
                logger.exception("Failed to reload sources")

    async def _bootstrap_all_peers(self) -> None:
        for source in list(self._state.sources_by_key.values()):
            try:
                await self._bootstrap_peer(source)
            except Exception:
                logger.exception("Failed to bootstrap peer %s", source.source_key)

    async def run_backfill(
        self,
        *,
        source_key: str | None = None,
        limit: int = 50,
    ) -> None:
        """Обход последних постов канала — для афиш, опубликованных до запуска воркера."""
        await self.reload_sources()
        if not self._state.sources_by_key:
            raise SystemExit(
                "Нет активных источников. Включите is_active=true в city_telegram_sources."
            )

        if source_key:
            key = source_key.lower().lstrip("@")
            source = self._state.sources_by_key.get(key)
            if not source:
                raise SystemExit(f"Источник {source_key!r} не найден среди активных.")
            targets = [source]
        else:
            targets = list(self._state.sources_by_key.values())

        consumer = asyncio.create_task(self._consumer())
        total = 0
        try:
            async with self._client:
                for source in targets:
                    entity = await self._client.get_entity(source.source_key)
                    logger.info(
                        "Backfill %s: последние %s постов",
                        source.source_key,
                        limit,
                    )
                    async for message in self._client.iter_messages(entity, limit=limit):
                        await self._queue.put(
                            QueueItem(message=message, source=source, force=True)
                        )
                        total += 1
                await self._queue.join()
        finally:
            await self._queue.put(None)
            await consumer

        logger.info("Backfill завершён: поставлено в очередь %s постов", total)

    async def run_smoke_replay(self) -> None:
        if not self._config.smoke_source_key or not self._config.smoke_message_id:
            raise SystemExit("Set SMOKE_SOURCE_KEY and SMOKE_MESSAGE_ID for smoke replay")

        await self.reload_sources()
        key = self._config.smoke_source_key.lower().lstrip("@")
        source = self._state.sources_by_key.get(key)
        if not source:
            raise SystemExit(
                f"Smoke source {self._config.smoke_source_key!r} not found among active sources. "
                "Enable is_active=true in city_telegram_sources."
            )

        entity = await self._client.get_entity(source.source_key)
        message = await self._client.get_messages(entity, ids=self._config.smoke_message_id)
        if not message:
            raise SystemExit(
                f"Message {self._config.smoke_message_id} not found in {source.source_key}"
            )

        consumer = asyncio.create_task(self._consumer())
        await self._queue.put(QueueItem(message=message, source=source, force=True))
        await self._queue.join()
        await self._queue.put(None)
        await consumer

    async def run(self) -> None:
        await self.reload_sources()
        if not self._state.sources_by_key:
            logger.warning(
                "No active sources in city_telegram_sources. "
                "Enable is_active=true for at least one row, then restart."
            )

        consumer_task = asyncio.create_task(self._consumer())
        reload_task = asyncio.create_task(self._sources_reload_loop())

        async with self._client:
            await self._bootstrap_all_peers()
            await self._register_handlers()
            logger.info("Userbot listening for new/edited messages…")
            await self._client.run_until_disconnected()

        reload_task.cancel()
        await self._queue.put(None)
        await consumer_task
