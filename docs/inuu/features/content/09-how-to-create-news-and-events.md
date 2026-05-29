# Как создавать новости и события (AI + модерация)

Практическая инструкция для команды: как пользоваться уже реализованным backend-функционалом.

---

## Подготовка

Заполнить env:

```env
NUXT_GROQ_API_KEY=...
NUXT_GROQ_MODEL=llama-3.3-70b-versatile
SUPABASE_URL=...
SUPABASE_SECRET_KEY=...
```

Применить миграции Supabase (включая `023_inuu_ai_parse_logs.sql`).

---

## Режим 1: распарсить контент без сохранения

Endpoint:

- `POST /api/ai/parse-event`

Когда использовать:

- проверка качества extraction,
- настройка промптов,
- ручная валидация структуры до запуска ingestion.

Пример:

```bash
curl -X POST http://localhost:3000/api/ai/parse-event \
  -H "content-type: application/json" \
  -d '{
    "rawText":"15 июня в 19:00 гончарный мастер-класс...",
    "sourceKind":"telegram_parse",
    "sourceUrl":"https://t.me/example/123",
    "sourceExternalId":"example_123",
    "citySlug":"ulan-ude",
    "timezone":"Asia/Irkutsk"
  }'
```

Что возвращает:

- `parseKind` — `single` | `digest`
- `eventsCount` — число распознанных событий
- `digest` — метаданные периода (для digest)
- `result` — первое событие (backward compat)
- `events` — массив всех событий
- `enrichedUrls` — URL, по которым подтянут текст страницы
- `attempts`, `model`, `latencyMs`

Пример digest-текста:

```
Афиша недели в Улан-Удэ:
1. Джаз на крыше — 15 июня 19:00, Art-kvartal
2. Детский спектакль — 16 июня 11:00, театр
```

---

## Режим 2: ingestion в очередь модерации

Endpoint:

- `POST /api/ingest/content/submit`

Когда использовать:

- реальная загрузка анонсов (бот/парсер),
- автоматическое определение статуса модерации,
- (опционально) запись в `content_submissions`.

Пример:

```bash
curl -X POST http://localhost:3000/api/ingest/content/submit \
  -H "content-type: application/json" \
  -d '{
    "rawText":"15 июня в 19:00 гончарный мастер-класс...",
    "sourceKind":"telegram_parse",
    "sourceUrl":"https://t.me/example/123",
    "sourceExternalId":"example_123",
    "citySlug":"ulan-ude",
    "timezone":"Asia/Irkutsk",
    "persist": true
  }'
```

Что делает endpoint:

1. Валидирует payload по Zod.
2. Парсит текст через Groq.
3. Ищет дубли среди `events` (по `title + date`).
4. Ставит `moderationStatus`:
   - `pending`
   - `needs_revision`
5. При `persist=true` пытается писать в `content_submissions`.
6. Пишет лог в `ai_parse_logs`.

При digest (`parseKind=digest`) дополнительно:

- `batchId` — id parent-заявки
- `items[]` — per-event submission ids и dedupe
- В moderation chat — **batch card** (см. [11-digest-parsing-and-curated-picks.md](./11-digest-parsing-and-curated-picks.md))

Сообщения **только со ссылкой** (без 10 символов текста) принимаются, если URL валиден — контент подтягивается URL enricher на API.

---

## Как “создавать новости”

Текущий AI ingestion ориентирован на унифицированный content payload и event-like extraction.

Для новостей в текущей реализации:

1. Передавать `sourceKind` и текст новости через parse/ingest.
2. В payload использовать `event_kind = news` (заполняется парсером).
3. После модерации конвертировать approved запись в `editorial_posts` (отдельным обработчиком публикации).

Примечание: автоматический publish из `content_submissions` в `editorial_posts` пока не включен в этот релиз.

---

## Где смотреть логи качества

### Сырые логи

- Таблица `public.ai_parse_logs`

### Dashboard API

- `GET /api/dashboard/ai/parse-logs`
- `GET /api/dashboard/ai/parse-logs-stats`

Фильтры:

- `status`
- `source_kind`
- `city_slug`
- `date_from`
- `date_to`

---

## Частые проблемы

1. `NUXT_GROQ_API_KEY is not configured`  
   Нет ключа в env.

2. `Persist skipped: ... content_submissions insert failed`  
   В БД нет нужной схемы/колонок для `content_submissions`.

3. Низкий `confidence` и `needs_revision`  
   В исходном тексте нет даты/места/цены, нужно улучшить качество источника или добавить hint.

---

## Связанные документы

- [08-event-sourcing-and-moderation-pipeline.md](./08-event-sourcing-and-moderation-pipeline.md)
- [04-telegram-bot-content-moderation.md](./04-telegram-bot-content-moderation.md)
- [03-recommended-mvp.md](./03-recommended-mvp.md)
- [implementation/03-ai-ingest-and-global-dashboards.md](../../implementation/03-ai-ingest-and-global-dashboards.md)
