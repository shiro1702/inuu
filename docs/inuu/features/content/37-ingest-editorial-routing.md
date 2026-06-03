# Ingest → editorial: политика и маршруты публикации

**Задачи:** [TASK-016](../../tracker/ACTIVE_TASKS.md) (спека) · [TASK-017](../../tracker/ACTIVE_TASKS.md) (venue announcements, код)

**Связь:** [01-news-editorial-options.md](./01-news-editorial-options.md), [16-parsing-pipeline-extensions.md](./16-parsing-pipeline-extensions.md), [17-ingest-sources-context.md](./17-ingest-sources-context.md), [30-manager-chat-place-editorial.md](./30-manager-chat-place-editorial.md), [33-editorial-articles-longreads-retention.md](./33-editorial-articles-longreads-retention.md)

---

## Решение (кратко)

| Канал | Что тянем автоматически | Куда публикуем |
|-------|-------------------------|----------------|
| `city_telegram_sources` + userbot | **Афиша** (даты, билеты, digest) | `events` (+ `content_submissions` `event` / `event_digest`) |
| `city_web_sources` + web cron | То же | `events` |
| Редакция (dashboard, manager chat, multiplier) | Новости, гиды, обзоры, stories | `editorial_posts`, `story_campaigns` |
| Ingest (фаза 2, TASK-017) | **Только** анонсы заведения без даты события | `editorial_posts` + привязка к `venue` |

**Не делаем:** массовый парсинг городских новостей и лонгридов из whitelist-источников — другой tone of voice, дубли с афишей, перегруз модерации.

---

## Что такое «новость» в INUU

По [01-news-editorial-options.md](./01-news-editorial-options.md) новость — **редакционный** материал портала или материал о месте, а не зеркало чужого TG/SMI.

Ingest-источники (`telegram_parse`, `web_cron`) заточены под **event extraction** (`POST /api/ingest/content/submit` → `runContentIngest` → `groqEventParser`).

---

## Маршрутизация по типу поста

| Содержание поста в источнике | Пайплайн | Сущность | `post_type` / kind | Витрина |
|------------------------------|----------|----------|-------------------|---------|
| Анонс с датой/временем | Event ingest | `events` | — | `/events/[slug]` |
| Афиша недели (список) | Event digest | `events` × N, batch | — | афиша + опц. `curated_lists` |
| Отмена / перенос / sold out | Event ingest + `post_type` ([16](./16-parsing-pipeline-extensions.md), **не** editorial) | правка `events` | — | карточка события + плашка |
| «Открылись», меню, режим **конкретного venue** | TASK-017: venue editorial ingest | `editorial_posts` | `announcement` | venue + `/guides/[slug]` |
| Городская новость, гид, интервью | **Не** ingest | `editorial_posts` | `news` / `guide` | `/guides`, блок «Журнал» |
| `afisha_digest` (альбом TG) | Разовый импорт / редакция | `editorial_posts` | `afisha_digest` | guides, не смешивать с `news` |

---

## Где показывать editorial

| Поверхность | Материалы |
|-------------|-----------|
| Главная города — «Журнал» | `post_type` ∈ `news`, `guide`, … · `shop_id` = `inuu-editorial` |
| `/[city]/guides`, `/[city]/guides/[slug]` | Все опубликованные `editorial_posts` |
| Страница venue | `linked_entity_type = venue` · API `.../venues/[slug]/editorial` |
| Stories | Анонс при publish (ручно / multiplier), TTL отдельно от статьи |

### Привязки в БД

**A) Редакция портала**

- `shop_id` → editorial shop (`inuu-editorial`)
- `linked_entity_type` = null

**B) Контент организации / места**

- `linked_entity_type` = `venue` | `shop`
- `linked_entity_id` заполнен

---

## Legacy в коде (не целевой основной путь)

`groqEventParser` может вернуть `event_kind: news`. При approve [contentSubmissionPublish.ts](../../../server/utils/contentSubmissionPublish.ts) создаёт упрощённую строку в `editorial_posts` **без** `body_json` и без venue-link.

**Политика:** не расширять этот путь; новые фичи — через editorial parser (manager chat) или TASK-017 с явным `linked_entity_*`.

---

## TASK-017 (venue announcements) — scope реализации

1. Флаг на источнике: только `city_telegram_sources` с `organization_id` (имя поля уточнить в миграции: `allow_venue_editorial`).
2. Классификация: пост без будущих дат в `recurrence.dates` + сигналы «открытие/меню/режим» → editorial submission, не `event`.
3. Модерация: карточка без строки «📅 …» (как в [30](./30-manager-chat-place-editorial.md)).
4. Publish: `post_type: announcement`, `linked_entity_id` → venue org.
5. Дедуп: тот же `source_external_id` не создаёт и `events`, и editorial.

**Out of scope TASK-017:** web cron, городские новости, longread, автопубликация без модерации.

---

## Порядок внедрения

1. **TASK-016** — эта спека + строки в [FEATURE_MATRIX.md](../../tracker/FEATURE_MATRIX.md) ✅  
2. **TASK-004** — наполнение афиши из источников (приоритет очереди)  
3. **`post_type` cancellation/update** — [16](./16-parsing-pipeline-extensions.md)  
4. **TASK-017** — venue announcements из привязанных TG-каналов  

---

## Связанные документы

- [09-how-to-create-news-and-events.md](./09-how-to-create-news-and-events.md)  
- [10-telegram-sources-without-bot-access.md](./10-telegram-sources-without-bot-access.md)  
- [34-groq-editorial-content-multiplier.md](./34-groq-editorial-content-multiplier.md)
