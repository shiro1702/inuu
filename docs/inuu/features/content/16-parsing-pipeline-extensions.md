# Расширения конвейера парсинга

**Источник:** брейншторм [30.05.2026](../../../fix/brainstorm/30.05.2026.md).

**База:** [08-event-sourcing-and-moderation-pipeline.md](./08-event-sourcing-and-moderation-pipeline.md), [10-telegram-sources-without-bot-access.md](./10-telegram-sources-without-bot-access.md).

---

## Два клиента Telegram

| Роль | Технология | Задача |
|------|------------|--------|
| Userbot «слухач» | Telethon/Pyrogram | Подписка на whitelisted каналы → `POST /api/ingest/content/submit` |
| Официальный бот | Bot API | Модерация, Mini App, approve с ⭐1–5 |

---

## Цепочка обработки

```
Пост → [опц. пре-фильтр regex/ключевые слова] → Groq/Vision → dedupe → pending → чат менеджеров
```

### 1. Пре-фильтр (локально, без LLM)

Ключевые слова: билет, вход, афиша, **отмена**, перенос, sold out…  
+ regex дат/цен.

~70% мусора отсекается до API. Не заменяет LLM — только экономит токены.

### 2. Один промпт вместо двух шагов

Поле `is_event: false` **или** полный JSON события — не два запроса.

### 3. `post_type` (намерение)

| `post_type` | Действие бэкенда |
|-------------|------------------|
| `new_event` | Черновик / модерация |
| `cancellation` | Поиск события по source + date + title fuzzy → alert-карточка |
| `update` | Перенос / sold-out |
| `trash` | ignore |

Модератор: **«Отменить в базе»** / игнор.

### 4. Теги и категории

- Groq: 1 категория + 1–5 тегов из словаря БД (подставляется в system prompt).
- Редактирование тегов — **только Mini App**, не inline multi-select ([04](./04-telegram-bot-content-moderation.md)).

Approve с рангом: кнопки **«Одобрить (5⭐)»** — один callback (rank + status).

### 5. Vision: текст ↔ афиша

| Модель | Когда | Ориентир стоимости |
|--------|-------|---------------------|
| Groq (Llama) | Только текст | $0 free tier |
| GPT-4o-mini | Пост с картинкой, cross-check | ~$0.15 / 1000 постов |
| Gemini 1.5 Flash | Альтернатива vision | free tier лимиты |

JSON блок:

```json
{
  "conflict_alert": {
    "has_conflict": true,
    "details": "в тексте 15.11, на афише 16.11"
  }
}
```

По умолчанию при конфликте — доверять **тексту поста**, но подсветить менеджеру.

---

## Омниканал (транспорт до Groq)

| Источник | Подготовка |
|----------|------------|
| URL | fetch + extract text (`og:image`) → тот же промпт |
| VK | Service token, `wall.get` — без userbot |
| TG forward / userbot | `rawText` + `file_id` медиа |

---

## Медиа

- Скачать cover → Storage; слушать `message_edited` для правок поста.
- Userbot: очередь, без параллельного flood.

---

## Связанные документы

- [15-event-detail-series-venues.md](./15-event-detail-series-venues.md) — schedule JSON
- [17-ingest-sources-context.md](./17-ingest-sources-context.md) — web cron, sources
- [implementation/03-ai-ingest-and-global-dashboards.md](../../implementation/03-ai-ingest-and-global-dashboards.md)
