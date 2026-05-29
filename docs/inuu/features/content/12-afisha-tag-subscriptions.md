# Подписка на теги афиши (Mini App + бот)

**Статус:** MVP UI и API сохранения интересов — в коде; рассылка по триггеру — см. [06-bot-digest-subscriptions.md](./06-bot-digest-subscriptions.md).  
**Связанные экраны:** `/[city_slug]/events`, `/subscribe` в боте, `/start` пресеты.

---

## Зачем

Пользователь на афише уже **сам собрал интересный фильтр** (теги + даты). Это сильный сигнал intent: «хочу такие события, но не обязательно каждый день листать сайт».

Кнопка **«Получать подборку в боте»** переводит этот intent в явную подписку:

1. Сохраняет выбранные `interest_tags` в профиле города.
2. В Mini App дополнительно включает тему **`events`** в `city_subscriptions` для канала Telegram/MAX.
3. Дальше бот шлёт **персональные пуши**, когда выходит событие с пересечением тегов.

Фильтр на странице и подписка используют **один словарь** `city_content_tags` / `events.source_metadata.topic_tags`.

---

## UX на странице «Афиша»

### Фильтр тегов (реализовано)

| Поведение | Детали |
|-----------|--------|
| Мультивыбор | Несколько тегов одновременно |
| Логика выдачи | **ИЛИ** — событие подходит, если у него есть **хотя бы один** из выбранных тегов |
| Toggle | Повторный клик **снимает** тег |
| Сброс | Chip **«Все»** снимает все теги сразу |
| Иконка | Справа в chip: `+` неактивен, `+` повёрнут на 45° (= ×) активен |
| URL | `?tag=food&tag=culture` — shareable ссылка на фильтр |

Фильтр по датам (`from` / `to`, пресеты «Сегодня» / «Завтра» / «На неделе») **не входит в подписку** — только теги. Даты влияют на просмотр «здесь и сейчас», подписка — на будущие пуши.

### Кнопка подписки (реализовано)

| Условие | UI |
|---------|-----|
| Нет активных тегов | Кнопка **скрыта** |
| Есть активные теги | Кнопка **«Получать подборку в боте»** |
| Уже подписан на этот набор | **«Вы подписаны на эти теги»** (disabled) |
| Не авторизован | Redirect → `/login?redirect=…` (или initData в Mini App) |

После успешного сохранения — короткое сообщение под кнопкой.

---

## Авторизация

| Контекст | Как считаем «авторизован» | Куда пишем |
|----------|---------------------------|------------|
| **Telegram Mini App** | Валидный `initData` в заголовках `x-messenger-init-data` | `profiles` по `telegram_id`, канал `telegram` |
| **MAX Mini App** | То же, канал MAX | `profiles` по `max_user_id`, канал `max` |
| **Веб** | Supabase session (`useSupabaseUser`) | только `user_city_preferences` (пуши после привязки бота) |

Если пользователь на **вебе** без Telegram: интересы сохраняются, но `city_subscriptions` не создаётся — в ответе API текст «откройте афишу в Telegram-боте INUU».

---

## API (реализовано)

### `GET /api/cities/[slug]/subscriptions/tags?tag=food&tag=culture`

Проверка состояния для активных фильтров.

```json
{
  "ok": true,
  "authenticated": true,
  "interestTags": ["food", "culture", "family"],
  "hasEventsTopic": true,
  "subscribedToSelection": true,
  "messengerLinked": true,
  "channel": "telegram"
}
```

`subscribedToSelection = true`, если **все** выбранные в URL теги уже есть в `interest_tags`.

### `POST /api/cities/[slug]/subscriptions/tags`

```json
{ "tags": ["food", "culture"] }
```

**Эффект:**

1. `user_city_preferences.interest_tags` ← union с уже сохранёнными тегами (не затирает старые).
2. Если есть messenger initData → upsert `city_subscriptions` (`topic_slug = events`, `channel = telegram|max`).
3. `notify_channels.telegram|max = true` в preferences.

Идемпотентно: повторный POST с теми же тегами не ломает данные.

---

## Данные

| Таблица / поле | Роль |
|----------------|------|
| `city_content_tags` | Справочник chip'ов на афише |
| `events.source_metadata.topic_tags` | Теги конкретного события |
| `user_city_preferences.interest_tags` | Явные интересы пользователя в городе |
| `city_subscriptions` (`topic_slug = events`) | Opt-in на пуши по афише |
| `city_subscriptions.metadata.source` | `'afisha_tag_filter'` — откуда пришла подписка |

Миграции: `010_inuu_user_engagement.sql`, `027_inuu_city_content_tags.sql`.

---

## Связь с ботом и рассылками

### Два входа в одну модель

```text
┌─────────────────────┐     ┌──────────────────────┐
│  Афиша (Mini App)   │     │  /subscribe в боте   │
│  фильтр + кнопка    │     │  чипы + темы         │
└──────────┬──────────┘     └──────────┬───────────┘
           │                           │
           └───────────┬───────────────┘
                       ▼
         user_city_preferences.interest_tags
         city_subscriptions (events | digest | news)
                       │
                       ▼
              resolveCityTopicSubscribers()
                       │
                       ▼
              Telegram / MAX push
```

Пользователь может:

- включить теги в боте через `/subscribe`;
- добавить теги с афиши (union, не replace);
- снять теги только в боте или будущем экране «Мои подписки» (R2).

### Когда слать пуш по афише

Триггер (фаза R1, см. [06-bot-digest-subscriptions.md](./06-bot-digest-subscriptions.md)):

| Событие | `eventType` | Аудитория |
|---------|-------------|-----------|
| Опубликовано новое `event` | `EVENT_PUBLISHED` (новый) | `city_subscriptions.topic_slug = events` **и** пересечение `interest_tags` ∩ `event.topic_tags` |
| Еженедельный дайджest | `EVENT_DIGEST` | `digest` или `events` + фильтр тегов |
| Подборка с events | `CURATED_LIST_PUBLISHED` | по `curated_lists.topic_tags` |

**Правило фильтра (как на афише):**

- если у пользователя `interest_tags = []` → все события по теме `events` (широкая подписка);
- если `interest_tags = [food, culture]` → событие проходит, если `event.topic_tags` содержит **хотя бы один** из них (**ИЛИ**).

Это совпадает с логикой фильтра на `/events?tag=food&tag=culture`.

### Шаблон сообщения в боте (черновик)

```text
📍 Улан-Удэ • INUU

🎭 Новое для вас: {event.title}
{formatted_date} · {venue_or_org}
Теги: #Еда #Культура

{excerpt — 1 строка}

[Открыть]  [Настроить подписки]
```

- **Открыть** → `/{city_slug}/events/{slug}` (WebApp).
- **Настроить** → `inuu:sub:menu` или deep link `/subscribe`.

Для серии (`series_slug`) в пуш идёт **ближайшая сессия**, в тексте «+ ещё N дат» — как на карточке афиши.

---

## Mini App: сценарии

### A. Пользователь уже в Telegram

1. Открывает афишу из бота / menu button.
2. Выбирает `#Еда` + `#Культура` (chips с +/×).
3. Жмёт «Получать подборку в боте».
4. Toast: «Подписка сохранена…».
5. При публикации подходящего события — push в **этот же чат**.

### B. Пользователь на вебе, не залогинен

1. Выбирает теги → видит кнопку.
2. Жмёт → `/login?redirect=/ulan-ude/events?tag=food&tag=culture`.
3. После входа возвращается на афишу, жмёт снова → сохранение в `interest_tags`.
4. Текст: «откройте в Telegram-боте для пушей».

### C. Пользователь настроил в боте, потом фильтрует на сайте

- Бот: `interest_tags = [family]`.
- Афиша: добавляет `food` → POST делает union → `[family, food]`.
- Старые подписки не сбрасываются.

---

## Бот: синхронизация с `/subscribe`

| Действие в боте | callback | Эффект на афише |
|-----------------|----------|-----------------|
| Toggle тег `food` | `inuu:sub:toggle:tag:food` | Chip `#Еда` при GET subscriptions будет active |
| Toggle тему «Афиша» | `inuu:sub:toggle:events` | `hasEventsTopic` |
| Opt-out маркетинга | `inuu:sub:optout:marketing` | Пуши по тегам **не слать** (транзакционные — да) |

Экран `/subscribe` и кнопка на афише должны показывать **одно и то же состояние** — источник правды: `user_city_preferences` + `city_subscriptions`.

---

## Ограничения и анти-спам

| Правило | Значение MVP |
|---------|--------------|
| Cooldown на маркетинговый push | ≥ 1 push / 24 ч / user / city (см. `06-bot-digest-subscriptions`) |
| `marketing_opt_out` | Не слать EVENT_PUBLISHED / digest, даже если теги совпали |
| Пустые `topic_tags` у event | Слать всем подписчикам `events` **без** уточнения по тегам |
| Дубликат серии | Один push на `series_slug` в окне 7 дней (R2) |

---

## Фазы

| Фаза | Что |
|------|-----|
| **R1a (сейчас)** | Фильтр OR на афише; кнопка подписки; API GET/POST tags; запись в `user_city_preferences` + `city_subscriptions` из Mini App |
| **R1b** | Webhook бота: `inuu:sub:toggle:tag:*`; `/subscribe` читает те же таблицы |
| **R1c** | `dispatchNotificationEvent(EVENT_PUBLISHED)` при publish event |
| **R2** | Экран «Мои подписки» в Mini App; отписка с афиши; напоминания по избранным событиям |
| **R3** | Персональный блок в weekly digest по поведению + явным тегам |

---

## Открытые вопросы

1. **Снимать теги с афиши?** MVP — только добавление (union). Отписка — через бота / R2 профиль.
2. **Подписываться на фильтр «теги + даты»?** Пока нет — только теги; date filter ephemeral.
3. **Авто-предложение подписки** после 3‑го клика по тегам без кнопки? A/B позже.
4. **Email-дубль** подборки? Нет в MVP ([07-notifications-channels.md](../../07-notifications-channels.md)).

---

## ADR

| # | Решение |
|---|---------|
| 1 | Фильтр афиши и пуш-фильтр — **одна семантика ИЛИ** по `topic_tags` |
| 2 | POST подписки — **merge** тегов, не replace |
| 3 | Кнопка видна **только при ≥1 активном теге** |
| 4 | Веб без бота — сохраняем интересы, пуши после входа через Telegram |
| 5 | Тема `events` включается автоматически при подписке из Mini App |
| 6 | Даты фильтра **не** персистятся в подписке |

---

## Файлы в репозитории

| Файл | Назначение |
|------|------------|
| `pages/[city_slug]/events/index.vue` | UI фильтров + кнопка |
| `server/api/cities/[slug]/subscriptions/tags.get.ts` | Статус подписки |
| `server/api/cities/[slug]/subscriptions/tags.post.ts` | Сохранение |
| `server/utils/cityTagSubscriptions.ts` | Бизнес-логика |
| `server/utils/customerProfile.ts` | `ensureCustomerProfileRow` — создаёт `profiles`, если web-login без строки |
| `utils/eventListDisplay.ts` | OR-фильтр, parse query |
| [06-bot-digest-subscriptions.md](./06-bot-digest-subscriptions.md) | Общая модель рассылок |

---

## Troubleshooting

| Симптом | Причина | Решение |
|---------|---------|---------|
| `500 Failed to save preferences` | Нет строки в `profiles` для `auth.users.id` (web-login без auto-provision) | `ensureCustomerProfileRow` перед insert в `user_city_preferences` |
| Подписка сохранилась, пушей нет | Нет `city_subscriptions` (`topic_slug=events`) — пользователь на вебе без Telegram | Открыть афишу в Mini App или `/subscribe` в боте |
| `401 Unauthorized` | Нет Supabase session и нет initData | Redirect на `/login?redirect=…` |
| Теги не фильтруют | У события пустой `source_metadata.topic_tags` | Проставить теги при модерации / publish |
