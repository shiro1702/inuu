# Волна 3b — документация и проверка

Закрытые задачи: **TASK-019**, **TASK-020**, **TASK-021** (архив в [ACTIVE_TASKS.md](../tracker/ACTIVE_TASKS.md)).

| Документ | Фича | Матрица |
|----------|------|---------|
| [WAVE_3B_TASK-019-webp-groq.md](./WAVE_3B_TASK-019-webp-groq.md) | WebP афиш + Groq cascade 429 | §4 |
| [WAVE_3B_TASK-020-event-status.md](./WAVE_3B_TASK-020-event-status.md) | Отмена / sold out / перенос на витрине | §2, §4 |
| [WAVE_3B_TASK-021-weekend-source-check.md](./WAVE_3B_TASK-021-weekend-source-check.md) | AI-чек источников перед выходными | §4 |

См. также: [SOURCE_WEEKEND_CHECK.md](./SOURCE_WEEKEND_CHECK.md) (краткий ops-runbook cron).

---

## Базовые URL для тестов

Город по умолчанию в dev: **`ulan-ude`** (`NUXT_DEFAULT_CITY_SLUG`).

| Среда | База |
|-------|------|
| **Прод** | `https://inuu.ru` |
| **Локально** | `http://localhost:3000` |

Подставьте `{BASE}` и `{CITY}` (`ulan-ude`) в таблицу ниже.

---

## Страницы витрины (пользователь)

| Что проверяем | Прод | Локально |
|---------------|------|----------|
| Главная города | [inuu.ru/ulan-ude](https://inuu.ru/ulan-ude) | [localhost:3000/ulan-ude](http://localhost:3000/ulan-ude) |
| Афиша (лента) | […/events](https://inuu.ru/ulan-ude/events) | […/events](http://localhost:3000/ulan-ude/events) |
| Карточка события | […/events/{slug}](https://inuu.ru/ulan-ude/events) — подставить `slug` | […/events/{slug}](http://localhost:3000/ulan-ude/events) |
| Организатор | […/organizations/{slug}](https://inuu.ru/ulan-ude/organizations) | […/organizations/{slug}](http://localhost:3000/ulan-ude/organizations) |
| Площадка | […/venues/{slug}](https://inuu.ru/ulan-ude/venues) | […/venues/{slug}](http://localhost:3000/ulan-ude/venues) |

**Пример события (если есть в БД):** замените `{slug}` на реальный из афиши или API.

---

## Dashboard и модерация (менеджер)

| Что | Прод | Локально |
|-----|------|----------|
| Контент AI + источники + тест парсера | [dashboard/content-ai](https://inuu.ru/dashboard/content-ai) | [dashboard/content-ai](http://localhost:3000/dashboard/content-ai) |
| Редактирование submission (Mini App) | [content-submission/edit/{id}](https://inuu.ru/content-submission/edit) | [content-submission/edit/{id}](http://localhost:3000/content-submission/edit) |
| Модерация (web, если включена) | [moderation/content-submission/{id}](https://inuu.ru/moderation/content-submission) | [moderation/…](http://localhost:3000/moderation/content-submission) |

**Telegram:** карточки модерации приходят в **moderation chat** (настраивается на `content-ai` → «Настройки TG/MAX»). Кнопки 🔗 / ✅ / ⛔ — см. [TASK-020](./WAVE_3B_TASK-020-event-status.md).

---

## API (curl / автотесты)

| Endpoint | Назначение |
|----------|------------|
| `POST /api/ingest/content/submit` | Ingest (Groq, WebP, post_type) |
| `POST /api/ai/parse-event` | Парсинг без persist (песочница на content-ai) |
| `GET /api/cities/{slug}/events` | Лента + `event_status` |
| `GET /api/cities/{slug}/events/{eventSlug}` | Детальная + CTA |
| `POST /api/cron/source-weekend-check` | Weekend health check |
| `GET /api/dashboard/manager/cities/{slug}/ingest-sources/scraping-alerts` | Алерты в dashboard |

Локально: `http://localhost:3000/api/…` · Прод: `https://inuu.ru/api/…`

---

## Миграции (обязательно перед проверкой)

| Файл | Что добавляет |
|------|----------------|
| [047_events_lifecycle_status.sql](../../supabase/migrations/047_events_lifecycle_status.sql) | `events.event_status`, … |
| [048_scraping_alerts_event_id.sql](../../supabase/migrations/048_scraping_alerts_event_id.sql) | `scraping_alerts.event_id`, nullable `web_source_id` |

```bash
# пример: Supabase CLI
supabase db push
# или применить SQL вручную в SQL Editor
```

---

## Smoke-чеклист волны 3b (15 мин)

1. **019** — ingest с картинкой → в БД `cover_media_url` на Supabase storage, расширение `.webp` (см. [TASK-019](./WAVE_3B_TASK-019-webp-groq.md)).
2. **019** — при симуляции 429 Groq → ответ ingest с `parseDegraded: true`, запись в `ai_parse_logs`, не HTTP 500.
3. **020** — пост «отмена» → модерация → 🔗 привязка → approve → плашка «Отменено» на [афише](http://localhost:3000/ulan-ude/events) и детальной, CTA скрыт.
4. **020** — пост «sold out» → бейдж **Sold out** на карточке.
5. **021** — cron weekend-check → alert в [content-ai](http://localhost:3000/dashboard/content-ai) → (опц.) сообщение в manager TG.

---

## Связанные спеки

- [24-mvp-launch-checklist-ulan-ude.md](../features/content/24-mvp-launch-checklist-ulan-ude.md)
- [16-parsing-pipeline-extensions.md](../features/content/16-parsing-pipeline-extensions.md)
- [32-stable-cover-media-pipeline.md](../features/content/32-stable-cover-media-pipeline.md)
- [FEATURE_MATRIX.md](../tracker/FEATURE_MATRIX.md) — статусы `[x]` для строк 3b
