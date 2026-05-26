# Telegram-бот: приём новостей/событий и модерация заявок

**Бот:** один `@inuu_bot` для всего INUU (контент, auth, уведомления).

**Статус:** решения по MVP **согласованы** (см. [ADR](#adr-принятые-решения)). Код — в плане `implementation/02-refactor-existing.md`.

---

## ADR: принятые решения

| # | Вопрос | Решение |
|---|--------|---------|
| 1 | Сколько ботов | **Один** `@inuu_bot` |
| 2 | Чат модерации | **Группа редакции**, `chat_id` хранится в БД после привязки (как у ресторанов — токен + команда в группе) |
| 3 | Кто жмёт «Принять» | **Любой участник этой группы** (не whitelist `telegram_id`). Обязательно **логировать**, кто нажал |
| 4 | Отклонение | **Кнопки с готовыми причинами** + опционально **свободный комментарий** менеджера |

---

## Что уже есть в коде

| Компонент | Где | Зачем нам |
|-----------|-----|-----------|
| Webhook Telegram | `server/api/webhook.post.ts` | `message`, `callback_query` |
| Привязка бота к группе | `telegram_chat_link_tokens` + webhook `/bind…` | Тот же flow для чата редакции |
| Модерация UGC | `server/utils/festivalUgcModeration.ts` | Сообщение + `inline_keyboard` + callbacks |
| Профили | `profiles.telegram_id` | Связь модератора с аккаунтом (если есть) |

Новый код: **`server/utils/inuuContentBot.ts`** + тонкий роутинг `inuu:sub:*` в webhook.

---

## Привязка чата модерации (город)

По аналогии с `restaurants.manager_group_chat_id`:

1. В dashboard города / shop `inuu-editorial` — «Сгенерировать ссылку привязки чата».
2. Токен в `telegram_chat_link_tokens` с типом **`city_editorial_moderation`** + `city_id`.
3. Админ группы открывает deep link или вводит `/bind_<token>` **в группе** (как для ресторана).
4. Webhook проверяет `getChatMember` → `administrator` | `creator`.
5. Сохраняет `cities.editorial_moderation_chat_id = chat.id`.

**Миграция (план):**

```sql
alter table public.cities
  add column if not exists editorial_moderation_chat_id text;
```

Fallback на MVP: env `NUXT_INUU_EDITORIAL_MODERATION_CHAT_ID` только если колонка пуста (Улан-Удэ).

---

## Два режима в одном боте

### 1. Редакция — быстрый ввод (без очереди)

- `/news`, `/event` — FSM → сразу `editorial_posts` / `events` с `is_published = true`.
- Доступ: участники **того же** чата модерации **или** отдельная команда только из лички с проверкой `getChatMember` (опционально ужесточить позже).

### 2. Партнёр — заявка (`/submit`)

- FSM → `content_submissions.status = pending`.
- Сообщение в `cities.editorial_moderation_chat_id` с кнопками модерации.

---

## Схема данных

```sql
create type public.content_submission_kind as enum ('event', 'news');
create type public.content_submission_status as enum (
  'draft', 'pending', 'approved', 'rejected', 'needs_revision'
);

create type public.content_reject_reason_code as enum (
  'incomplete_data',   -- Неполные данные
  'duplicate',         -- Дубликат / уже публиковали
  'off_topic',         -- Не подходит формату / рубрике
  'spam',              -- Спам / скрытая реклама
  'other'              -- Другое (нужен комментарий)
);

create table public.content_submissions (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references public.cities(id) on delete cascade,
  kind public.content_submission_kind not null,
  status public.content_submission_status not null default 'draft',
  submitted_by_user_id uuid references auth.users(id) on delete set null,
  submitted_by_telegram_id bigint,
  payload jsonb not null default '{}',
  published_entity_type public.inuu_entity_type,
  published_entity_id uuid,
  moderation_chat_id text not null,
  moderation_message_id bigint,
  -- аудит модерации (обязательно заполнять при approve/reject)
  reviewed_by_telegram_id bigint,
  reviewed_by_username text,
  reviewed_by_user_id uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  reject_reason_code public.content_reject_reason_code,
  reject_comment text,              -- свободный текст менеджера
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

Индекс: `(city_id, status)` where `status = 'pending'`.

---

## Проверка права модерировать

Не whitelist. Алгоритм `assertCanModerateInEditorialChat`:

1. `String(query.message.chat.id) === submission.moderation_chat_id` (кнопка только из карточки заявки в нужном чате).
2. `getChatMember(moderation_chat_id, callback.from.id)` → status ∈ `creator`, `administrator`, `member` (не `left`, `kicked`).
3. Заявка в статусе `pending` (или `needs_revision` для повторной отправки партнёром).

При успехе — записать `reviewed_by_telegram_id`, `reviewed_by_username`, `reviewed_by_user_id` (lookup `profiles` по `telegram_id`).

---

## UX: карточка заявки в группе

```
📋 Заявка #a1b2 · Мастер-класс
Город: Улан-Удэ
От: @partner (tg: 123456)
────────────────
МК «Гончарный круг»
15.06.2026 14:00 · Арт-квартал
1200 ₽ · 12 мест
────────────────
[фото]
Описание: ...

[ ✅ Опубликовать ]  [ ✏️ На доработку ]
[ ❌ Отклонить ]
```

После публикации — `editMessageReplyMarkup` убрать кнопки, дописать строку:

`✅ Опубликовано @editor_name · 26.05.2026 15:40`

---

## Callback-протокол

| callback_data | Действие |
|---------------|----------|
| `inuu:sub:approve:{id}` | approve → insert event/post |
| `inuu:sub:revise:{id}` | `needs_revision` + сообщение автору |
| `inuu:sub:reject:{id}` | **второй ряд кнопок** — причины (см. ниже) |
| `inuu:sub:rej:{id}:{code}` | reject с кодом; если `other` → ждём комментарий |
| `inuu:sub:rej_cancel:{id}` | вернуть исходную клавиатуру |

Префикс `inuu:sub:` не пересекается с `ugc:`, `order`, review tokens.

---

## Отклонение: причины + комментарий

### Шаг 1 — нажали «❌ Отклонить»

Заменить клавиатуру:

```
Выберите причину:

[ Неполные данные ]     → rej:{id}:incomplete_data
[ Дубликат ]            → rej:{id}:duplicate
[ Не наш формат ]       → rej:{id}:off_topic
[ Спам / реклама ]      → rej:{id}:spam
[ Другое + комментарий ] → rej:{id}:other
[ ← Назад ]
```

### Шаг 2a — пресет (не `other`)

- Сразу `status = rejected`, записать `reject_reason_code`, `reviewed_*`.
- Уведомление автору с **человекочитаемым** текстом причины.
- Обновить карточку в группе: `❌ Отклонено @mod · причина: …`

### Шаг 2b — «Другое»

- `status` остаётся `pending` (или флаг `awaiting_reject_comment` в payload).
- Бот в группе: «Ответьте **реплаем** на это сообщение с комментарием для автора (или /skip)».
- Следующее сообщение от **того же** `telegram_id`, что нажал «Другое», reply на карточку → `reject_comment` + `reject_reason_code = other` + reject.

### Опционально для любой причины

После выбора пресета бот может спросить: «Добавить комментарий?» `[ Да ]` `[ Нет, отправить ]` — если «Да», тот же reply-flow.

**Текст автору (пример):**

```
Заявка не опубликована.
Причина: Неполные данные.
Комментарий редактора: Укажите точный адрес и время окончания.
Вы можете исправить и снова: /submit
```

---

## Публикация после approve

| kind | Действие |
|------|----------|
| `event` | `INSERT events`, `category_id` из `payload.category_slug`, `is_published = true` |
| `news` | `INSERT editorial_posts`, `is_published = true`, `published_at = now()` |

Идемпотентность: если `published_entity_id` уже есть — только `answerCallbackQuery` «Уже опубликовано».

Фото: `getFile` → Storage → `cover_media_url`.

---

## Безопасность

1. Проверка членства в группе через `getChatMember`, не доверие только `callback.from.id`.
2. `moderation_chat_id` только из `cities` после bind, не из пользовательского ввода.
3. Лимит pending-заявок с одного `telegram_id` / сутки.
4. `/submit` — только с привязанным `profiles` (или invite-only позже).

---

## Оценка разработки

| Блок | Оценка |
|------|--------|
| Миграции: `content_submissions`, `cities.editorial_moderation_chat_id`, bind token type | 1 д |
| Bind чата редакции (копия restaurant flow) | 1 д |
| FSM `/submit` | 2–3 д |
| Модерация + reject presets + reply comment | 2 д |
| `/news`, `/event` для редакции | 1–2 д |
| Фото → Storage | 1 д |
| **Итого** | **~1.5 нед** |

---

## Env (опционально)

```env
# Fallback, если cities.editorial_moderation_chat_id не задан (Улан-Удэ)
NUXT_INUU_EDITORIAL_MODERATION_CHAT_ID=
```

Основной источник — **колонка в `cities`** после привязки в dashboard.

---

## Связанные документы

- [03-recommended-mvp.md](./03-recommended-mvp.md) — фаза 1b
- [01-news-editorial-options.md](./01-news-editorial-options.md) — вариант E
- [TELEGRAM_AUTH_VIA_BOT_RU.md](../../../features/TELEGRAM_AUTH_VIA_BOT_RU.md)
- Привязка чатов: `server/api/webhook.post.ts` (bind token), dashboard `telegram-chat-link-token.post.ts`
