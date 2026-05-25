# Backend TODO: омниканал INUU (Web + Telegram / MAX Mini App)

Задачи для Nitro/Nuxt, чтобы витрина города и Mini App работали на **одном бэкенде**: auth, bookings, подписки, уведомления.

Канон: [../inuu/07-notifications-channels.md](../inuu/07-notifications-channels.md), [../platform/OMNICHANNEL_MULTITENANT_PLAN_RU.md](../platform/OMNICHANNEL_MULTITENANT_PLAN_RU.md).

Auth: [../features/TELEGRAM_AUTH_VIA_BOT_RU.md](../features/TELEGRAM_AUTH_VIA_BOT_RU.md).

---

## Статус (ориентир)

| Блок | Состояние |
|------|-----------|
| `useTelegram.ts` (TG + MAX) | Реализовано |
| Telegram Login + `link-telegram` | Реализовано |
| `webhook.post.ts` / `webhook-max.post.ts` | Реализовано, расширить под INUU |
| `booking.post.ts` | **Сделать** (вместо food `order.post`) |
| `city_subscriptions`, digest | **Сделать** |

---

## 1. `useTelegram` и UI-режим

**Цели**

- Детект Telegram / MAX WebApp (`isTelegram`, `isMax`).
- В TMA — без лишней шапки сайта; на web — полный layout INUU.
- `MainButton` для CTA «Записаться» / «Купить билет», не корзина блюд.

**Задачи**

- [ ] В `app.vue` / layout: `isTelegram || isMax` → скрыть web header/footer.
- [ ] MainButton на страницах booking/checkout: текст и handler под сценарий INUU.
- [ ] Deep link Mini App → `/{city_slug}` (афиша), не `/{tenant}/cart`.

---

## 2. Авторизация (Web + TMA)

См. [TELEGRAM_AUTH_VIA_BOT_RU.md](../features/TELEGRAM_AUTH_VIA_BOT_RU.md).

**INUU**

- [ ] После login / link — `default_city_id`, интересы в `profiles`.
- [ ] Оформление booking: TMA — `initData`; web — Supabase + `profiles.telegram_id` / `max_user_id`.
- [ ] Страницы: `login`, `link-telegram`, `link-max`, `profile` (записи, избранное, подписки).

---

## 3. Bookings API (вместо `order.post`)

**Цели**

- `POST /api/booking` (или `bookings.post.ts`): событие, услуга, слот, оплата.
- Уведомления: `BOOKING_*` через `dispatchNotificationEvent`.

**Контракт (черновик)**

```jsonc
{
  "cityId": "uuid",
  "organizationId": "uuid",
  "bookingType": "event | beauty | confectioner | lead",
  "eventId": "uuid?",
  "serviceId": "uuid?",
  "slotAt": "ISO",
  "quantity": 1,
  "initData": "..." // TMA
}
```

**Задачи**

- [ ] Валидация слота и цены на сервере (Supabase).
- [ ] Создание `bookings` + payment metadata (ЮKassa).
- [ ] Пуш организатору + клиенту (TG/MAX).
- [ ] Webhook callback для статусов booking (аналог food kanban — упрощённо).

Legacy `order.post` — [../archive/ORDER_SYSTEM.md](../archive/ORDER_SYSTEM.md), к удалению.

---

## 4. Webhooks: подписки и «Мои записи»

**Цели**

- `/start` → город по умолчанию + кнопка WebApp INUU.
- `/subscribe`, `/my`, callback `subscribe:event:{id}`.
- Таблица `city_subscriptions`.

**Задачи**

- [ ] Команды и inline-кнопки в `webhook.post.ts` / `webhook-max.post.ts`.
- [ ] Digest событий (cron или scheduled): `EVENT_DIGEST`.
- [ ] Паритет MAX.

Тестирование: [../runbooks/TELEGRAM_TESTING_RU.md](../runbooks/TELEGRAM_TESTING_RU.md).

---

## 5. Разделение Web / Mini App при booking

| Канал | Поведение |
|-------|-----------|
| Web | Login / link Telegram → checkout booking |
| TMA | `initData` + MainButton → `POST /api/booking` |
| MAX | То же, что TMA |

Без сценария «корзина блюд» и `startapp` cart token (legacy: [../archive/TELEGRAM_STATELESS_BRIDGE.md](../archive/TELEGRAM_STATELESS_BRIDGE.md)).

---

## 6. Безопасность и тесты

- Не доверять ценам с клиента; пересчёт на сервере.
- Секреты только в env: `NUXT_BOT_TOKEN`, MAX tokens, `NUXT_SESSION_SECRET`.
- Ручные сценарии: booking E2E, digest, link-telegram.
- Опционально: тесты hash для `/api/auth/telegram`, валидация `initData`.

---

## Связанные документы

- [../inuu/implementation/02-refactor-existing.md](../inuu/implementation/02-refactor-existing.md) — рефакторинг модулей
- [../runbooks/TELEGRAM_VERCEL_RELAY_RUNBOOK_RU.md](../runbooks/TELEGRAM_VERCEL_RELAY_RUNBOOK_RU.md)
