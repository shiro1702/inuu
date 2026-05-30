# Конвейер наполнения: бот + парсер + AI + модерация

Документ фиксирует рабочий контур быстрого наполнения афиши, согласованный из брейнштормов `28.05.2026.md` и `30.05.2026.md` (индекс: [fix/brainstorm/30.05.2026.md](../../../fix/brainstorm/30.05.2026.md)), приведённый к архитектуре `Nuxt 3 + Supabase + Telegram Mini App`.

Расширения (userbot, пре-фильтр, `post_type`, vision): **[16-parsing-pipeline-extensions.md](./16-parsing-pipeline-extensions.md)**. Источники и web-cron: **[17-ingest-sources-context.md](./17-ingest-sources-context.md)**.

---

## Цель

Собрать единый pipeline, где:

1. События попадают из двух источников: пользовательский бот и автоматический парсер.
2. Оба источника проходят единый AI-экстрактор в нормализованный JSON.
3. Менеджер модерирует в Telegram-чате, может отранжировать, отклонить или поправить.
4. После approve событие публикуется в `events` и становится доступно для сортировки/подписок по тегам.

---

## Inbound-источники

| Источник | Канал | Статус в MVP |
|----------|-------|--------------|
| `bot_submit` | Партнер/пользователь отправляет текст/ссылку/медиа в `@inuu_bot` | Да |
| `telegram_parse` | Скрипт читает список whitelisted TG-каналов и формирует черновики | Да (ограниченный список источников) |
| `manual_editor` | Ручной ввод редактором (`/event` или dashboard) | Да |

Важно: Instagram и внешние агрегаторные шлюзы не блокируют MVP-конвейер, подключаются позже отдельными интеграциями.

---

## Нормализованный payload (до публикации)

Минимальный JSON для `content_submissions.payload`:

```json
{
  "title": "Гончарный мастер-класс",
  "description": "Короткий анонс",
  "city_slug": "ulan-ude",
  "venue": {
    "name": "Арт-квартал",
    "address": "ул. Ленина, 15"
  },
  "organization": {
    "name": "Студия Глина"
  },
  "source": {
    "kind": "telegram_parse",
    "url": "https://t.me/example/123",
    "external_id": "tme_example_123"
  },
  "event_kind": "event",
  "category_slug": "masterclass",
  "is_free": false,
  "price_from": 1500,
  "capacity": 12,
  "registration_url": "https://...",
  "topic_tags": ["culture", "family"],
  "recurrence": {
    "rule": "none",
    "dates": ["2026-06-15T11:00:00+08:00"]
  }
}
```

Правила:

- AI не должен придумывать факты; неизвестное поле = `null`.
- `topic_tags` максимум 5 штук из словаря редакции.
- `source.url` обязателен для не-ручных источников.
- `registration_url` может вести на внешний источник, пока не включена внутренняя покупка.

---

## Модерация в Telegram

Базовый UX карточки заявки:

1. Кнопки решения: `✅ Одобрить`, `✏️ На доработку`, `❌ Отклонить`.
2. Редакторский ранг интереса: `⭐ 1..5` (используется как внутренний приоритет ленты).
3. Кнопка `🛠 Редактировать` открывает Mini App форму на конкретной заявке.

Обязательные действия перед approve:

- Проверить/поправить `topic_tags`.
- Проверить `source.url`.
- Проверить `registration_url` (внутренняя или внешняя запись).

---

## Редактирование менеджером

Редактирование не делаем reply-командами в чат.

Решение для MVP:

- Inline кнопка `🛠 Редактировать` -> Telegram Mini App (`/dashboard/content-submissions/:id/edit`).
- Форма редактирует `payload` и пишет audit-след (`edited_by`, `edited_at`).
- После сохранения карточка в чате обновляется (`editMessageCaption`/`editMessageText`).

---

## Публикация и целевые сущности

После approve:

1. Создается/связывается `organization` (если определена).
2. Создается/связывается `venue` (если определен адрес/место).
3. Создается `event` со ссылкой на source и тегами.
4. Если событие повторяющееся, создаются сессии (`event_sessions`) или N событий по fallback-стратегии.

### Ветка digest (реализовано)

Подробно: [11-digest-parsing-and-curated-picks.md](./11-digest-parsing-and-curated-picks.md).

- Parent `kind=event_digest`, `batch_role=batch`; items `batch_role=item`
- Модерация: batch card → `approve_all` | `split` | `reject`
- После `approve_all` — N events + auto `curated_lists` (`week-...` / `month-...`)

Принцип MVP:

- На старте допускается fallback `N events` для повторов.
- Целевая модель на рост: `event_series` + `event_sessions`.

---

## Ранжирование и использование оценки менеджера

Поле `editorial_score` (1..5) живет в `content_submissions` и копируется в `events.editorial_score` при публикации.

Использование:

- Блок "Выбор редакции" = `editorial_score >= 4`.
- В общей выдаче score влияет на сортировку, но не заменяет бизнес-правила (`is_promoted`, дата, релевантность тегам).

---

## Требования к данным "на вырост"

Нужно заложить уже в MVP:

- `topic_tags` для фильтрации и подписок.
- `source.kind/source.url/source.external_id` для дедупликации и аналитики каналов.
- `organization_id` и `venue_id` в событии для будущих страниц "Организация" и "Место".
- Флаг повторяемости (`recurrence`) + дата-сессии.

---

## Anti-dup и качество

Перед созданием новой заявки:

1. Проверка по `source.external_id` (если есть).
2. Fuzzy check по `title + date + venue`.
3. При потенциальном дубле — статус `needs_revision` и пометка для менеджера.

SLA качества:

- Время от входящего события до решения: < 30 минут в рабочее время.
- Доля заявок с полным набором полей (`venue`, `tags`, `source.url`): >= 80%.

---

## Скоуп MVP и после MVP

### MVP

- Прием событий ботом.
- Ограниченный парсер TG-каналов.
- AI extraction в JSON.
- Модерация + рейтинг + ручная правка через Mini App.
- Публикация в `events` с тегами и ссылкой на источник.

### После MVP

- Instagram Graph API ingestion.
- Полная модель recurring (`event_series` + `event_sessions`).
- Авто-переиспользование организаций/площадок по confidence-матчингу.
- Авто-broadcast подписчикам по тегам сразу после approve.

---

## Связанные документы

- [03-recommended-mvp.md](./03-recommended-mvp.md)
- [04-telegram-bot-content-moderation.md](./04-telegram-bot-content-moderation.md)
- [06-bot-digest-subscriptions.md](./06-bot-digest-subscriptions.md)
- [09-data-model-overview.md](../../09-data-model-overview.md)
- [07-notifications-channels.md](../../07-notifications-channels.md)
