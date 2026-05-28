# Telegram-источники без доступа бота

Как собирать контент из каналов/чатов, куда нельзя добавить бота, и безопасно подавать его в текущий AI ingestion pipeline.

---

## Проблема

Telegram Bot API читает только те чаты/каналы, где бот состоит и имеет нужные права.

Если источник закрыт для ботов, стандартный flow `bot -> webhook -> parse` не работает.

---

## Рабочая модель

Использовать **userbot ingestion worker** (Telethon/Pyrogram) под обычным Telegram-аккаунтом, у которого есть доступ к нужным источникам.

Схема:

1. Userbot слушает новые посты в списке источников.
2. Нормализует сообщение.
3. Отправляет в `POST /api/ingest/content/submit`.
4. Далее работает текущий pipeline:
   - Groq extraction
   - dedupe
   - status (`pending` / `needs_revision`)
   - очередь модерации.

---

## Что уже есть в проекте

Из коробки уже готово:

- `POST /api/ingest/content/submit`
- `POST /api/ai/parse-event`
- `GET /api/dashboard/ai/parse-logs`
- `GET /api/dashboard/ai/parse-logs-stats`
- Queue actions в dashboard (`content_submissions`)

То есть для источников без бота нужно добавить только ingestion-воркер и список источников.

---

## Минимальные требования к payload

Для каждого поста из userbot:

```json
{
  "rawText": "...",
  "sourceKind": "telegram_parse",
  "sourceUrl": "https://t.me/channel/123",
  "sourceExternalId": "channel:123",
  "citySlug": "ulan-ude",
  "timezone": "Asia/Irkutsk",
  "persist": true
}
```

Рекомендации:

- `sourceExternalId` делать детерминированным (`channel_id:message_id`) для антидублей.
- Всегда передавать `sourceUrl`, если она доступна.

---

## Хранение источников (рекомендуемо)

Создать таблицу `city_telegram_sources`:

- `id`
- `city_id`
- `source_key` (username/peer id)
- `source_type` (`channel` / `group`)
- `is_active`
- `notes`
- `created_at`

Опционально:

- `last_seen_message_id`
- `ingest_mode` (`realtime` / `batch`)

---

## Контур запуска воркера

### Вариант A (MVP)

- отдельный python-сервис (Telethon),
- long-poll / events,
- deploy как worker/cron.

### Вариант B

- периодический batch-проход (каждые N минут),
- удобно для маленького объема и простого контроля.

---

## Ошибки и устойчивость

Обязательно:

1. Retry с backoff на сетевых ошибках.
2. Идемпотентность по `sourceExternalId`.
3. Лимит частоты ingest-запросов.
4. Логи в существующую `ai_parse_logs` + отдельный worker-log.

---

## Юридика и правила платформы

Перед подключением источника подтвердить:

- есть право использовать/републиковать контент;
- не нарушаются условия автора/канала;
- соблюдаются локальные требования к данным и контенту.

Для спорных источников:

- режим “только в модерацию” (без автопубликации),
- обязательная ручная проверка менеджером.

---

## Операционный сценарий (для команды)

1. Добавить источник в список города.
2. Проверить, что userbot имеет доступ к источнику.
3. Запустить тест ingest одного поста.
4. Проверить:
   - запись в queue,
   - `moderationStatus`,
   - логи в `ai_parse_logs`.
5. Включить источник в боевой режим.

---

## Когда использовать userbot, а когда нет

Использовать userbot:

- когда бот не может быть добавлен в источник;
- когда источник критичен для наполнения.

Не использовать userbot:

- если можно подключить официальный bot-flow (он проще и надежнее);
- если условия источника запрещают такой сбор.

---

## Связанные документы

- [09-how-to-create-news-and-events.md](./09-how-to-create-news-and-events.md)
- [08-event-sourcing-and-moderation-pipeline.md](./08-event-sourcing-and-moderation-pipeline.md)
- [04-telegram-bot-content-moderation.md](./04-telegram-bot-content-moderation.md)
- [implementation/04-dashboard-pages-ai-and-city-ops.md](../../implementation/04-dashboard-pages-ai-and-city-ops.md)
