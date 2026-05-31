"""HTTP client for POST /api/ingest/content/submit with retry and rate limiting."""

from __future__ import annotations

import asyncio
import logging
import time
from typing import Any

import httpx

from config import Config

logger = logging.getLogger(__name__)


class IngestClient:
    def __init__(self, config: Config) -> None:
        self._config = config
        self._last_request_at = 0.0
        self._lock = asyncio.Lock()

    def _headers(self) -> dict[str, str]:
        headers = {"Content-Type": "application/json"}
        if self._config.ingest_secret:
            headers["x-ingest-secret"] = self._config.ingest_secret
        return headers

    async def _rate_limit(self) -> None:
        delay_ms = max(0, self._config.ingest_rate_limit_ms)
        if delay_ms <= 0:
            return
        async with self._lock:
            now = time.monotonic()
            elapsed_ms = (now - self._last_request_at) * 1000
            wait_ms = delay_ms - elapsed_ms
            if wait_ms > 0:
                await asyncio.sleep(wait_ms / 1000)
            self._last_request_at = time.monotonic()

    async def submit(self, payload: dict[str, Any]) -> dict[str, Any]:
        url = f"{self._config.ingest_api_url}/api/ingest/content/submit"
        max_attempts = 5
        backoff = 1.0

        for attempt in range(1, max_attempts + 1):
            await self._rate_limit()
            try:
                async with httpx.AsyncClient(timeout=120.0) as client:
                    res = await client.post(url, headers=self._headers(), json=payload)
            except (httpx.TimeoutException, httpx.NetworkError) as err:
                if attempt >= max_attempts:
                    raise
                logger.warning("Ingest network error (attempt %s/%s): %s", attempt, max_attempts, err)
                await asyncio.sleep(backoff)
                backoff = min(backoff * 2, 30.0)
                continue

            if res.status_code in (429, 500, 502, 503, 504):
                if attempt >= max_attempts:
                    res.raise_for_status()
                logger.warning(
                    "Ingest HTTP %s (attempt %s/%s), retrying…",
                    res.status_code,
                    attempt,
                    max_attempts,
                )
                await asyncio.sleep(backoff)
                backoff = min(backoff * 2, 30.0)
                continue

            if res.status_code >= 400:
                body = res.text[:500]
                raise RuntimeError(f"Ingest failed HTTP {res.status_code}: {body}")

            data = res.json()
            warning = (data.get("persisted") or {}).get("warning")
            if warning:
                logger.info("Ingest idempotent skip: %s", warning)
            else:
                logger.info(
                    "Ingest ok: events=%s moderation=%s submission=%s",
                    data.get("eventsCount"),
                    data.get("moderationStatus"),
                    (data.get("persisted") or {}).get("id"),
                )
            return data

        raise RuntimeError("Ingest failed after retries")
