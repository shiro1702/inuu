# Manager chat: обзоры мест, посты и stories

**Статус:** реализовано в коде (TASK-011).

**Связь:** [04-telegram-bot-content-moderation.md](./04-telegram-bot-content-moderation.md), [05-bot-news-dialog-script.md](./05-bot-news-dialog-script.md), [25-groq-event-extraction-prompt.md](./25-groq-event-extraction-prompt.md).

---

## Назначение

Редакция создаёт **недатированный** контент (только `published_at` / `publication_date` материала) через **manager chat** города:

- обзоры и посты о **местах** (venue), в т.ч. с **видео**;
- **stories** (кампания + слайды).

Обязательна привязка к **организации** (`shops`). Если org не найдена — кнопка «Создать организацию» (теневой профиль).

---

## Привязка чата

`POST /api/dashboard/manager/cities/[slug]/chat-link-token` с `target: "manager"` → `/bindcity <token>` в группе.

Поле: `cities.content_ops_settings.telegram.manager_chat_id`.

---

## Команды

| Команда | Тип контента | `content_submissions.kind` |
|---------|--------------|----------------------------|
| `/review`, `/place` | Обзор места | `venue_review` |
| `/post` | Пост о месте / новость | `venue_post` |
| `/story` | Story-кампания | `story` |

Без команды: если есть **video** → обзор; иначе inline-выбор типа.

---

## Поток

1. Сообщение (текст / фото / видео) в manager chat.
2. `POST /api/ai/parse-editorial` (или внутренний вызов Groq) — **без** дат события.
3. Превью-карточка в **том же** чате (`status=draft`).
4. Кнопки: `✅ В модерацию` | `➕ Создать организацию` | `❌ Отмена`.
5. «В модерацию» → `status=pending` + карточка в **moderation chat** (как события).
6. Approve → публикация в `editorial_posts` или `story_campaigns`.

---

## JSON parse (editorial)

| Поле | Описание |
|------|----------|
| `content_type` | `venue_review` \| `venue_post` \| `news` \| `story` |
| `post_type` | `review` \| `announcement` \| `news` |
| `title`, `description_short`, `description_full` | Текст |
| `publication_date` | `YYYY-MM-DD` или null |
| `venue` | `{ name, id? }` |
| `organization` | `{ name, id? }` — **id обязателен** перед модерацией |
| `video_url`, `cover_media_url`, `media_urls[]` | Медиа |
| `story` | `{ title, slides[] }` для kind=story |
| `topic_tags`, `confidence`, `missing_fields` | Как у events |

Промпт: `publication_date` + `current_date` ([25](./25-groq-event-extraction-prompt.md)), без `recurrence.dates`.

---

## Callbacks (manager chat)

| Callback | Действие |
|----------|----------|
| `inuu:mgr:moderate:{submissionId}` | draft → pending + notify moderation |
| `inuu:mgr:cancel:{submissionId}` | удалить draft |
| `inuu:mgr:org:create:{submissionId}` | `resolveOrCreateShadowOrg` |
| `inuu:mgr:org:pick:{submissionId}:{shopId}` | привязать org |

---

## Публикация

| kind / content_type | Таблица |
|---------------------|---------|
| `venue_review`, `venue_post`, `news` | `editorial_posts` + `linked_entity_*` → venue |
| `story` | `story_campaigns` + `story_slides` |

Stories менеджера: `valid_from=now()`, `valid_until=null`, `is_active=true` (без авто-TTL 24ч).

---

## API витрины

`GET /api/cities/[slug]/venues/[venueSlug]/editorial` — опубликованные обзоры/посты места.

---

## Проверка (manual)

1. Привязать manager chat.
2. Видео + текст обзора без org → «Создать организацию» → «В модерацию» → approve в moderation chat.
3. `/story` + 2 фото → approve → stories на главной города.
4. В карточке модерации **нет** строки «📅 15.06 19:00» для editorial/story.
