# Переделка существующего функционала под INUU

План адаптации кода **incity-new** (Nuxt + Supabase) под городской агрегатор. Новые модули — в отдельных таблицах и `pages`; ниже — что **менять**, а не писать с нуля.

См. также: [10-existing-codebase.md](../10-existing-codebase.md), [09-data-model-overview.md](../09-data-model-overview.md), [01-cleanup-unused.md](./01-cleanup-unused.md).

---

## A. Фундамент (фаза 0–1)

### A.1. `cities`

**Файлы:** `supabase/migrations/NNN_inuu_cities_extend.sql`, `server/api/cities.get.ts`

| Было | Стало |
|------|--------|
| Город под ресторанный каталог | Метаданные INUU: `timezone`, `editorial_name`, брендинг |
| — | Убрать `aggregator_mode` / food-флаги, если были |

**Composable:** `composables/useCity.ts` — `city_slug`, `city_id`, название для SEO.

---

### A.2. Middleware и конфиг

| Файл | Переделка |
|------|-----------|
| `middleware/redirect-city.global.ts` | Без изменений логики |
| `nuxt.config.ts` | `public.defaultCitySlug`, `public.brandName: 'INUU'` |
| `server/middleware/tenant.ts` | Tenant = `organization_id` (+ `venue_id` где нужно) |

---

## B. Главная города (витрина)

### B.1. `pages/[city_slug]/index.vue`

**Сейчас (legacy):** лента ресторанов, доставка/самовывоз, повтор заказа еды.

**Цель INUU** (см. [AGGREGATOR_UX_FEATURES_RU.md](../../features/AGGREGATOR_UX_FEATURES_RU.md)):

| Блок | Источник данных | Действие |
|------|-----------------|----------|
| Stories | `stories.get.ts` | `city_id` + `author_type`: editorial \| business |
| Повтор | `client-bookings.get.ts` | Последние 3 записи |
| Подборки | новое API | `curated_lists` |
| Афиша | новое | `events` where `starts_at >= now()` |
| Venues | новое | `venues` |
| Горящие окошки | новое | `hot_slots` |

**API:**

```
GET /api/cities/[slug]/home
  → { stories, curatedLists, events, hotSlots, venues }
```

Один Nitro handler + Supabase joins, кэш 30–60 с.

---

### B.2. `composables/useStories.ts`

| Было | Стало |
|------|--------|
| Stories shop/restaurant promo | + `author_type`: editorial, venue, organization |
| — | `city_slug` обязателен |

---

### B.3. Карта и фильтры

| Компонент | Переделка |
|-----------|-----------|
| `useGeocodedMarkers.ts` | `venues` + `events` с координатами |
| Mood-чипы | `venue_tags` / `entity_tags` |
| Поиск | `events`, `venues`, `providers` |

---

## C. Авторизация и профиль

| Файл | INUU |
|------|------|
| `useTelegram.ts`, `auth/*` | Без изменений ядра |
| `login`, `link-telegram`, `link-max` | Тексты «войти в INUU» |
| `profile.vue` | Записи, билеты, избранное, подписки |

**profiles:** `interest_tags`, `notify_channels`, `default_city_id`.

---

## D. Избранное

1. Миграция `user_favorites`
2. `GET/POST/DELETE /api/client/favorites`
3. Сердце на карточке event/venue
4. `[city_slug]/favorites.vue`

Паттерн: `resolveCustomerProfileId` из legacy `client-orders.get.ts`.

---

## E. Записи и билеты (вместо order)

### E.1. `booking.post.ts` (новый)

| Legacy order | booking |
|--------------|---------|
| `shop_id`, `restaurant_id` | `organization_id`, `venue_id?`, `provider_id?` |
| `items[]` | `service_id` / `event_id` + slot |
| fulfillment delivery/pickup | `booking_type`: beauty \| event \| confectioner \| lead |

Переиспользовать: `notifications.ts`, `customerProfile`, валидация initData.

Не переносить: `loadTenantProductsForOrder`, `orderLinePricing.ts`.

---

### E.2. Checkout и история

| Legacy | INUU |
|--------|------|
| `[tenant_slug]/checkout.vue` | `[city_slug]/bookings/checkout.vue` |
| `client-orders.get.ts` | `client-bookings.get.ts` |
| `[city_slug]/orders.vue` | `[city_slug]/bookings.vue` |

---

## F. Омниканал

**notifications.ts:** `BOOKING_*`, `WAITLIST_SLOT_AVAILABLE`, `EVENT_DIGEST`, `HOT_SLOT_PUBLISHED`.

**webhooks:** `/start`, `/subscribe`, `/my`, `city_subscriptions`.

**Mini App:** кнопка WebApp → `/{city_slug}`.

---

## G. Dashboard партнёра

Термины: [TERMS.md](../../reference/TERMS.md) — точка, записи, услуги.

| Раздел | Переделка |
|--------|-----------|
| `dashboard/branches` | CRUD `venues`, providers; без menu/kitchen/zones |
| `dashboard/orders` | Bookings, статусы, без kitchen kanban |
| `dashboard/stories` | editorial / organization, CTA на event |
| `dashboard/reviews` | `booking_id`, entity types venue/event |

---

## H. Платежи

`yookassa` metadata: `booking_id`, `payment_kind: booking_deposit`.

B2B: `shop_feature_subscriptions` под модули INUU (афиша, реклама, лиды).

---

## I. Фестивали и события

`festivals` — крупные зоны; обычные МК → `events`.

Переиспользовать UGC/moderation из `verticals/festival/`.

---

## J. Platform admin

`platform/cities.vue` — slug, active, timezone (без food mode).

`platform/restaurants.vue` → venues / organizations.

---

## K. Новые страницы

```
pages/[city_slug]/
  events/index.vue, events/[slug].vue
  venues/index.vue, venues/[slug].vue
  beauty/index.vue, beauty/[slug].vue
  favorites.vue
  bookings/index.vue, bookings/checkout.vue
  map.vue
  guides/[slug].vue
```

---

## L. Миграции Supabase (порядок)

1. Расширение `cities` (timezone, editorial)
2. `venues`, `events`, `event_categories`
3. `organizations` / `shops.org_type`
4. `providers`, `services`, `schedule_slots`
5. `bookings`, `booking_payments`
6. `user_favorites`, `city_subscriptions`
7. `curated_lists`, `editorial_posts`
8. `hot_slots`, `waitlist_entries`
9. `tourism_*`
10. RLS по `city_id`

---

## M. Приоритеты

| ID | Задача | Оценка |
|----|--------|--------|
| R1 | Расширение cities + useCity | 1–2 д |
| R2 | Главная: events + stories | 1 нед |
| R3 | favorites | 3–5 д |
| R4 | booking + checkout | 1–2 нед |
| R5 | webhooks subscribe | 1 нед |
| R6 | dashboard bookings | 1 нед |
| R7 | venues + map | 1 нед |
| R8 | notifications BOOKING_* | 3 д |
| R9 | beauty + hot_slots | 2 нед |
| R10 | tourism leads | 1 нед |
| R11 | **TG-бот контент:** `content_submissions`, bind `cities.editorial_moderation_chat_id`, `/submit` + модерация в группе | ~1.5 нед |
| R12 | TG-бот: `/news`, `/event` для редакции | 1–2 д |

Спека: [features/content/04-telegram-bot-content-moderation.md](../features/content/04-telegram-bot-content-moderation.md).

**R11 — принятые решения:** один `@inuu_bot`; модератор = любой участник группы (`getChatMember`); аудит `reviewed_by_telegram_id`; отклонение — preset-кнопки + reply-комментарий.

---

## N. Готовность

- [ ] Главная Улан-Удэ: афиша, venues, stories
- [ ] Запись/билет end-to-end
- [ ] TG/MAX: вход, мои записи, digest
- [ ] Dashboard без меню/кухни

---

## O. Не рефакторить — заменить

| Legacy | Решение |
|--------|---------|
| cart → order | Удалить; только `booking` |
| iiko/QR | Удалить ([01-cleanup](./01-cleanup-unused.md)) |
| checkout monolith | Новая `bookings/checkout.vue` |

Копировать паттерны auth/notify/payments, не логику меню.
