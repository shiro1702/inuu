# Омниканал: Share, deep links, воронка канал → Mini App

**Источник:** брейншторм [01.06.2026](../../../fix/brainstorm/01.06.2026.md) (01.06 08:27 – 08:36).

**База:** [21-mini-app-and-web-wireframes.md](./21-mini-app-and-web-wireframes.md), [07-notifications-channels.md](../../07-notifications-channels.md).

**Платформы:** Telegram Mini App, мессенджер **MAX**, веб (SSR).

---

## Deep linking

| Среда | URL |
|-------|-----|
| Telegram | `https://t.me/{bot}/app?startapp=event_{id}` |
| MAX | `{max_deeplink_scheme}/app?startapp=event_{id}` (уточнить по API MAX) |
| Web | `https://{city}.inuu.ru/events/{slugOrId}` |

При старте TMA: читать `Telegram.WebApp.initDataUnsafe.start_param` → `navigateTo(/events/{id})`.

---

## Composables (Nuxt)

### `useAppEnv()`

Определяет один раз:

- `telegram` — `window.Telegram?.WebApp`
- `max` — детект по документации MAX WebApp
- `web` — fallback

### `useShare(event)`

| `env` | Поведение |
|-------|-----------|
| `telegram` | `Telegram.WebApp.openTelegramLink` с текстом + `t.me/.../app?startapp=...` |
| `max` | Нативный share MAX или clipboard |
| `web` | `navigator.share({ title, text, url })` → fallback `clipboard.writeText` |

UI: одна кнопка **«Поделиться»** — среда прозрачна для пользователя.

---

## Страницы Mini App (клиент)

| Route | Содержание |
|-------|------------|
| `/` | Лента, фильтры-таблетки, карточки |
| `/events/[id]` | Постер, описание, CTA, Share, внешний билет |
| `/favorites` | localStorage или `user_id` из initData |

См. wireframes [21](./21-mini-app-and-web-wireframes.md).

---

## Воронка: канал Telegram / MAX

Mini App привязан к боту, но **запускается из канала**:

| Способ | Пример |
|--------|--------|
| Прямая ссылка в тексте | `t.me/{bot}/app` |
| Inline-кнопка под постом | `reply_markup` → `url: t.me/{bot}/app` |
| Диплинк на событие | `.../app?startapp=event_777` + кнопка «Смотреть / Купить» |

Автопостинг дайджеста: кнопка «Открыть полную афишу» → TMA; анонс одного события → `startapp=event_{id}` ([14](./14-digests-curated-admin-smm.md)).

```json
{
  "inline_keyboard": [[
    { "text": "🗓 Открыть в приложении", "url": "https://t.me/InuuBot/app?startapp=event_123" }
  ]]
}
```

---

## Экосистема (замкнутая петля)

```
Парсеры → модерация → events → пост в канал + кнопка TMA
  → пользователь → Share → друг → deep link → TMA
```

---

## Связанные документы

- [15-event-detail-series-venues.md](./15-event-detail-series-venues.md) — «Позвать друга»
- [verticals/events-and-venues.md](../../verticals/events-and-venues.md)
