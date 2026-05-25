# Наследие кодовой базы incity-new

INUU строится **в этом репозитории** на **Nuxt 3 + Supabase**. Ниже — что из текущего кода **оставить**, **переделать** или **вывести** (см. [implementation/01-cleanup-unused.md](./implementation/01-cleanup-unused.md)).

Стек: [11-tech-stack.md](./11-tech-stack.md).

---

## Соответствие сущностей

| Legacy (таблицы / код) | INUU |
|------------------------|------|
| `cities` + `[city_slug]` | То же |
| `shops` | `organizations` (салон, организатор, кондитер) |
| `restaurants` | `venues`, точки мастеров |
| `orders` | `bookings`, билеты (новые записи) |
| `pages/[city_slug]/index` | Афиша + категории + stories |
| `festivals` | Крупные события / фестивальные зоны |
| `dashboard/stories` | Stories редакции и бизнеса |
| `profiles` + webhooks | Клиент, подписки, рассылки |

---

## Оставить как есть (или с минимальными правками)

### Инфраструктура

- `cities`, middleware редиректа, `pages/[city_slug]/`
- Supabase client, RLS, миграции
- `nuxt.config.ts`, `@nuxtjs/supabase`, Pinia, Tailwind

### Telegram + MAX + Mini App

| Файл | Назначение |
|------|------------|
| `composables/useTelegram.ts` | TG + MAX WebApp, initData |
| `server/api/webhook.post.ts` | Telegram |
| `server/api/webhook-max.post.ts` | MAX |
| `/api/auth/telegram` | Login на сайте |

### Уведомления

- `server/utils/notifications.ts`, `notification_events`
- [OMNICHANNEL_MULTITENANT_PLAN_RU.md](../platform/OMNICHANNEL_MULTITENANT_PLAN_RU.md)

Типы INUU: `EVENT_DIGEST`, `WAITLIST_SLOT`, `BOOKING_*`.

### Витрина агрегатора

- `pages/[city_slug]/index.vue` — переделать контент
- [AGGREGATOR_UX_FEATURES_RU.md](../features/AGGREGATOR_UX_FEATURES_RU.md) — избранное, mood-чипы

### Stories, отзывы, платежи, legal

- `dashboard/stories/*`
- Reviews (`047_*`), `dashboard/reviews.vue`
- [PAYMENTS_RU_YOOKASSA_TBANK.md](../payments/PAYMENTS_RU_YOOKASSA_TBANK.md)
- `pages/[city_slug]/legal/*`

### Фестивали и SaaS

- `festivals`, `festival/[festival_slug]`
- `shop_feature_subscriptions` — модули B2B под INUU (не `core_qr_menu`)

---

## Адаптировать

| Legacy | INUU |
|--------|------|
| `order.post.ts` | `booking.post.ts`, билеты |
| `checkout.vue` | Checkout записи / оплаты |
| `client-orders` | `client-bookings` |
| `restaurant_favorites` | `user_favorites` (polymorphic) |
| Kitchen kanban | Календарь слотов партнёра |

Кондитеры: [verticals/confectioners.md](./verticals/confectioners.md).

---

## Добавить

- `events`, `venues`, `bookings`, `hot_slots`, `waitlist_entries`
- `city_subscriptions`, `editorial_posts`, `curated_lists`
- `tourism_leads`, `ad_campaigns`
- Nitro routes по доменам INUU

---

## Не использовать (удалить из продукта)

- Меню, модификаторы, iiko, Quick Resto
- Кухня-kanban, service calls, доставка/zones
- Мульти-shop cart

---

## Порядок работ

1. Миграции INUU-таблиц + seed Улан-Удэ  
2. Главная: events/venues  
3. Favorites API  
4. Подписки в webhook + `city_subscriptions`  
5. `booking.post` + оплата  
6. Stories + отзывы на bookings  

Подписки и Mini App — расширение существующих webhooks.
