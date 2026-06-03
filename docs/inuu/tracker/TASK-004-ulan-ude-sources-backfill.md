# TASK-004 · Каталог источников Улан-Удэ + backfill

**Волна:** 3a · **Статус:** done (03.06.2026)

## Что в коде

- Миграция `045_wave3a_ulan_ude_ingest_sources.sql`: 18 TG-каналов, 6 web (`t.me/s/…`), 2 `cron_enabled`, smoke seed ≥15 `events`.
- Dashboard: `DashboardIngestSourcesPanel` (TASK-007).

## Верификация prod (03.06.2026)

| Проверка | Результат |
|----------|-----------|
| TG-источники `ulan-ude` | 19 (≥12) |
| Web-источники | 12 (≥4), ≥2 с `cron_enabled` |
| Опубликованные `events` | 44 (≥15) |
| Колонки `tldr` / `vibe_emoji` (046) | есть |

## Перед backfill (ongoing ops)

1. Миграции `045`, `046` — в репо; на prod применены.
2. Dev: `NUXT_WEB_CLASSIFIER_ENABLED=true`.
3. Userbot: аккаунт подписан на каналы с `is_active = true` (`kuda_poiti_uu`, `harats_uu`, `standup_uu`, `in.ulanude`).
4. Юридический чеклист: [10-telegram-sources-without-bot-access.md](../features/content/10-telegram-sources-without-bot-access.md).

## Web cron smoke

```bash
# Требует NUXT_CRON_WEB_SOURCES_SECRET + заголовок x-cron-secret
curl -X POST "http://127.0.0.1:3000/api/cron/web-sources-crawl" \
  -H "x-cron-secret: $NUXT_CRON_WEB_SOURCES_SECRET"
```

Проверить `scraping_alerts` и `content_submissions` в dashboard.

## Userbot backfill

```bash
cd workers/telegram-userbot && source .venv/bin/activate
python main.py --backfill --backfill-source kuda_poiti_uu --backfill-limit 80
python main.py --backfill --backfill-source harats_uu --backfill-limit 50
python main.py   # realtime
```

## Критерии готовности

- [x] ≥12 TG + ≥4 web в `city_*_sources` для `ulan-ude`
- [x] ≥15 опубликованных событий на витрине (seed + ingest)
- [x] ≥2 web URL с `cron_enabled` (фактически 5 на prod)
- [ ] Backfill хотя бы 2 активных TG без flood — **post-close ops** (рекомендуется, не блокирует закрытие каталога)

## Повторная верификация (03.06.2026, закрытие 3a)

| Проверка | Результат |
|----------|-----------|
| TG `ulan-ude` | 19 |
| Web | 12, `cron_enabled` active: 5 |
| Published `events` | 44 |
| `tldr` / `vibe_emoji` на витрине | 1+ событие (напр. Comedy night) |
