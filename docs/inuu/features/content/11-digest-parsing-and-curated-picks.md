# Digest-парсинг, ссылки и подборки «главное недели/месяца»

**Статус:** реализовано (MVP).

Главная спека фичи: multi-event digest из одного Telegram-поста, обогащение текста по URL, автоматические и ручные подборки в `curated_lists`.

---

## Сценарии

| Сценарий | Вход | Результат |
|----------|------|-----------|
| Один анонс | Текст / пересылка с одним событием | `parse_kind=single` → 1 заявка в модерации |
| Афиша недели | Список из нескольких мероприятий | `parse_kind=digest` → batch + N item-заявок |
| Только ссылка | URL в чате парсера | URL enricher → Groq → событие(я) |
| Главное недели | `/pick week` в чате модерации | Inline-выбор → `curated_lists` slug `week-YYYY-wNN` |
| Авто-подборка | «Одобрить все» на digest-пакете | N events + items в подборке периода |

---

## Схема парсинга

```json
{
  "parse_kind": "single|digest",
  "digest": {
    "title": "Афиша недели",
    "period": "week|month|null",
    "period_start": "2026-05-26",
    "period_end": "2026-06-01"
  },
  "events": [ "EventParseResult × 1..20" ]
}
```

Правила Groq ([`server/utils/ai/groqEventParser.ts`](../../../server/utils/ai/groqEventParser.ts)):

- **Одно мероприятие, несколько дат** → `single`, все даты в `recurrence.dates`
- **Разные мероприятия в одном посте** → `digest`, каждый пункт в `events[]`
- Эвристика `detectPreferDigest()` — ключевые слова и ≥3 строк с датами

---

## Batch в `content_submissions`

Миграция: [`034_content_submission_batches.sql`](../../../supabase/migrations/034_content_submission_batches.sql)

| batch_role | kind | payload |
|------------|------|---------|
| `batch` | `event_digest` | `{ parse_kind, digest, events[], source }` |
| `item` | `event` | один `EventParseResult` + `digest_context` |
| — | `event` | одиночный анонс (как раньше) |

Idempotency:

- parent: `source_external_id` = `{chat}:{message_id}`
- item: `{parentExternalId}#item-{index}`

---

## URL enricher

[`server/utils/contentUrlEnricher.ts`](../../../server/utils/contentUrlEnricher.ts)

- Извлекает до 3 URL из текста
- Fetch HTML (timeout 8s) или Firecrawl при `FIRECRAWL_API_KEY`
- `t.me/...` не fetch — URL передаётся LLM как есть
- Контекст: блоки `--- LINK: url --- ... --- END LINK ---` + исходный текст

---

## Модерация в Telegram

| Тип | Карточка | Callbacks |
|-----|----------|-----------|
| single | Обычная заявка | `inuu:sub:*` |
| digest | Пакет со списком событий | `inuu:digest:approve_all:{id}`, `split`, `reject` |

**Одобрить все:** публикует все pending items → создаёт/обновляет `curated_list` периода.

**По одному:** отправляет отдельные карточки `inuu:sub:*` на каждый item.

---

## Подборки (`curated_lists`)

[`server/utils/curatedListPeriod.ts`](../../../server/utils/curatedListPeriod.ts)

| Период | Slug | Пример title |
|--------|------|--------------|
| неделя | `week-2026-w22` | Главное недели 26 мая – 1 июня |
| месяц | `month-2026-05` | Главное мая 2026 |

### Команды (чат модерации / manager)

| Команда | Действие |
|---------|----------|
| `/pick week` | Inline-список событий недели → toggle в подборку |
| `/pick month` | То же для месяца |
| `/pick list week` | Показать текущую подборку |
| Reply + `/pick` | Добавить опубликованное событие из карточки в подборку недели |

Callbacks: `inuu:pick:toggle:{eventId}:{period}`, `inuu:pick:publish:{period}`.

---

## API

### Parse only

```bash
curl -X POST http://localhost:3000/api/ai/parse-event \
  -H "content-type: application/json" \
  -d '{
    "rawText": "Афиша недели:\n1. Концерт — 15 июня 19:00\n2. Выставка — 16 июня",
    "sourceKind": "telegram_parse",
    "citySlug": "ulan-ude"
  }'
```

Ответ: `parseKind`, `eventsCount`, `digest`, `events[]`, `enrichedUrls`.

### Ingest + persist

```bash
curl -X POST http://localhost:3000/api/ingest/content/submit \
  -H "content-type: application/json" \
  -d '{
    "rawText": "...",
    "sourceKind": "telegram_parse",
    "sourceExternalId": "channel:123",
    "citySlug": "ulan-ude",
    "persist": true
  }'
```

Ответ: `batchId`, `items[]`, `parseKind`, `eventsCount`.

---

## UAT-чеклист (редакция)

1. Переслать digest-пост в parser chat → бот: «Распознано N событий» → batch-карточка в moderation chat.
2. «Одобрить все» → N событий на сайте + подборка `/lists/week-...`.
3. Отправить только ссылку на афишу → enricher подтянул текст → события в очереди.
4. `/pick week` → выбрать событие → появилось в подборке.
5. Reply `/pick` на опубликованную карточку → событие в подборке недели.

---

## Связанные документы

- [08-event-sourcing-and-moderation-pipeline.md](./08-event-sourcing-and-moderation-pipeline.md)
- [04-telegram-bot-content-moderation.md](./04-telegram-bot-content-moderation.md)
- [09-how-to-create-news-and-events.md](./09-how-to-create-news-and-events.md)
- [06-bot-digest-subscriptions.md](./06-bot-digest-subscriptions.md) — рассылка подписчикам (R2: `list:week-...`)
