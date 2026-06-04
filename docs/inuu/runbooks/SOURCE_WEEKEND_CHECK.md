# Weekend source health check (краткий ops)

Полная документация: [WAVE_3B_TASK-021-weekend-source-check.md](./WAVE_3B_TASK-021-weekend-source-check.md) · индекс 3b: [WAVE_3B_README.md](./WAVE_3B_README.md)

**Cron:** `POST /api/cron/source-weekend-check` (Vercel: **четверг 06:00 UTC** ≈ 14:00 Иркутск)

**Auth:** header `x-cron-secret` = `NUXT_CRON_WEB_SOURCES_SECRET`

| Среда | Cron URL | Dashboard |
|-------|----------|-----------|
| Прод | `https://inuu.ru/api/cron/source-weekend-check` | [inuu.ru/dashboard/content-ai](https://inuu.ru/dashboard/content-ai) |
| Локально | `http://localhost:3000/api/cron/source-weekend-check` | [localhost:3000/dashboard/content-ai](http://localhost:3000/dashboard/content-ai) |

## Что делает

1. Берёт **опубликованные** события на **ближайшие выходные** (сб/вс) в каждом активном городе.
2. Re-fetch `source_metadata.source_url` (без dedupe crawl).
3. Создаёт open `scraping_alerts` при:
   - `source_404` / `source_empty` (HTTP 404/410 или ≥400)
   - `source_cancelled_on_site` (ключевые слова отмены/sold out на странице)
4. Шлёт короткое сообщение в **manager chat** (Telegram).

## Когда смотреть dashboard

- **Чт–пт** после cron: [Dashboard → Источники парсинга](http://localhost:3000/dashboard/content-ai) → блок «Алерты парсинга».
- Resolve после ручной проверки или после отмены события в базе ([TASK-020](./WAVE_3B_TASK-020-event-status.md)).

## Ручной запуск

```bash
# локально
curl -X POST "http://localhost:3000/api/cron/source-weekend-check" \
  -H "x-cron-secret: $NUXT_CRON_WEB_SOURCES_SECRET"

# прод
curl -X POST "https://inuu.ru/api/cron/source-weekend-check" \
  -H "x-cron-secret: $NUXT_CRON_WEB_SOURCES_SECRET"
```

## Действия по alert

| reason | Действие |
|--------|----------|
| `source_404` | Проверить URL, при отмене — «Отменить в базе» / approve cancellation |
| `source_cancelled_on_site` | Сверить с постом канала, обновить `event_status` |
| `source_empty` | Временный сбой или блокировка — повторить позже |
