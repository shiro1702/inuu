# Уведомления и омниканал

## Каналы

| Канал | Назначение | Приоритет MVP |
|-------|------------|---------------|
| **Telegram-бот** | Auth, билеты, напоминания, подписки, лиды | Высокий |
| **MAX-бот** | То же для аудитории без стабильного TG | Высокий |
| **Email** | Подтверждение, резерв | Средний |
| **SMS** | Напоминание 24/2 ч | Низкий |
| **Push (PWA)** | Retention | Фаза 3 |

Один бот на платформу; контекст в payload. Webhooks: `server/api/webhook.post.ts`, `webhook-max.post.ts`.

---

## Обязательный контекст сообщения

Каждое уведомление (см. [OMNICHANNEL_MULTITENANT_PLAN_RU.md](../platform/OMNICHANNEL_MULTITENANT_PLAN_RU.md)):

```
city_name • brand_name • venue/branch • #booking_id
```

Отправка: **`dispatchNotificationEvent`** в `server/utils/notifications.ts`, лог в `notification_events`.

---

## Типы событий (notification_key)

| Ключ | Получатель | Триггер |
|------|------------|---------|
| `BOOKING_CREATED` | Партнёр | Новая запись |
| `BOOKING_CONFIRMED` | Клиент | Подтверждение |
| `BOOKING_REMINDER_24H` | Клиент | За 24 ч |
| `BOOKING_REMINDER_2H` | Клиент | За 2 ч |
| `WAITLIST_SLOT_AVAILABLE` | Клиент | Освободился слот |
| `HOT_SLOT_PUBLISHED` | Подписчики | Горящее окно |
| `EVENT_TICKET` | Клиент | QR билета |
| `EVENT_DIGEST` | Подписчики города | Дайджест афиши |
| `FAVORITE_VENUE_NEW_EVENT` | Клиент | Событие в избранном venue |
| `TENDER_BAIKAL_LEAD` | Партнёры | Заявка на отдых |

Idempotency: `notification_key` + `entity_id` + `user_id`.

---

## Подписки и рассылки (INUU)

### Таблица (новая)

```sql
city_subscriptions (
  id, user_id, city_id,
  channel,           -- telegram | max
  topic_slug,        -- events | beauty | tours | event:{uuid}
  created_at
)
```

### Сценарии бота

1. `/start` — привязка к `profiles`, выбор интересов (inline keyboard).
2. `/subscribe` — topic или конкретное событие.
3. `/my` — билеты и записи (аналог «мои заказы»).
4. Дайджест — cron / `pg_cron` → batch `dispatchNotificationEvent` с cooldown в `profiles.metadata`.

### Mini App

- Меню WebApp → `NUXT_APP_URL/{city_slug}`.
- Auth через `initData` (`useTelegram.ts`).

---

## Email

- Nitro route или внешний SMTP/Resend после booking.
- Не дублировать массовые рассылки email на MVP — приоритет TG/MAX.

---

## Ограничения среды (Улан-Удэ)

- TG может требовать VPN — дублировать критичное в MAX и email.
- Runbooks: [TELEGRAM_VERCEL_RELAY_RUNBOOK_RU.md](../runbooks/TELEGRAM_VERCEL_RELAY_RUNBOOK_RU.md).

---

## Техническая реализация

| Компонент | Путь в репо |
|-----------|-------------|
| Dispatch | `server/utils/notifications.ts` |
| TG webhook | `server/api/webhook.post.ts` |
| MAX webhook | `server/api/webhook-max.post.ts` |
| Тест из дашборда | `server/api/dashboard/integrations/notifications/test.post.ts` |
| initData заказа/записи | `server/api/order.post.ts` → позже `booking.post.ts` |

Расширение: новые `eventType` в `NotificationEvent` без второго стека уведомлений.
