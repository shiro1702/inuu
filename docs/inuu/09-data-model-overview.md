# Обзор модели данных

ER-уровень для **Supabase (PostgreSQL)**. Все бизнес-таблицы INUU содержат **`city_id`**. RLS на публичный read и owner write.

**Миграции:** `supabase/migrations/001_inuu_*` … `019_inuu_seed_ulan_ude.sql` — см. [supabase/README.md](../../supabase/README.md). Legacy PocketMenu: `supabase/migrations_legacy/`.

Ниже — **целевая модель** (сверять с SQL-файлами).

---

## Ядро платформы

```
cities
  id, name, slug, timezone, is_active

profiles                    -- уже в репо (telegram_id, max_user_id, …)
  id, ...

user_city_preferences
  user_id, city_id, interest_tags[], notify_channels

user_favorites
  user_id, city_id, entity_type, entity_id

city_subscriptions          -- подписки INUU (бот)
  id, user_id, city_id, channel, topic_slug, created_at
```

---

## Места и события

```
venues
  id, city_id, slug, title, description, address, lat, lng,
  phone, vibe_tags[], rating_avg, editorial_quote, instagram_url

events
  id, city_id, venue_id?, organizer_id, slug, title,
  starts_at, ends_at, capacity, price, category_id,
  cover_media_id, is_promoted,
  organization_id?, source_kind?, source_url?, source_external_id?,
  editorial_score?

event_bookings  (или общая bookings с type=event)
  id, event_id, user_id, status, paid_amount, qr_token

categories
  id, city_id?, slug, name, parent_id, sort_order

event_series (опционально, фаза 2+)
  id, city_id, slug, title, organization_id?, venue_id?,
  recurrence_rule, timezone

event_sessions (опционально, фаза 2+)
  id, series_id, starts_at, ends_at, capacity, price, status
```

---

## Beauty

```
organizations  (салон / сеть)
  id, city_id, name, slug, type=beauty_salon

providers  (мастер)
  id, organization_id?, city_id, name, bio, rating_avg,
  can_work_multiple_venues

provider_venue  (мастер ↔ салоны)
  provider_id, venue_id

services
  id, provider_id, name, duration_min, price

schedules / slots
  id, provider_id, venue_id?, starts_at, ends_at, is_available

bookings  (type=beauty)
  id, user_id, provider_id, service_id, slot_id,
  status, payment_id, waitlist_position?

waitlist_entries
  id, user_id, provider_id, desired_date_from, desired_date_to,
  notified_at, expires_at

hot_slots
  id, provider_id, service_id, starts_at,
  price, discount_price, expires_at
```

---

## Кондитеры

```
providers  (type=confectioner)
  ...

confectioner_products  (готовая продукция)
  id, provider_id, title, category, tags[],
  pack_sizes[], stock_qty, photo_ids[]

confectioner_custom_options
  id, provider_id, option_type (filling|decor), name, price_delta

orders  (type=confectioner)
  id, provider_id, user_id, order_kind (custom|stock),
  pickup_at, delivery_mode, reference_media_id,
  comment, status, paid_amount, payout_status

provider_balances
  provider_id, balance, pending_payout
```

---

## Туризм

```
tourism_listings  (турбаза, глэмпинг)
  id, city_id, slug, title, location_name,
  vibe_tags[], price_from, photos, contact_phone

tourism_leads  (тендер)
  id, city_id, user_id, date_from, date_to,
  guests_count, budget, wishes_text, status,
  assigned_partner_id?
```

---

## Контент и реклама

```
editorial_posts  (новости)
  id, city_id, title, body, published_at, author_id

curated_lists  (подборки)
  id, city_id, slug, title, items[] (polymorphic refs)

content_submissions (очередь модерации)
  id, city_id, kind, status, payload,
  source_kind, source_url, source_external_id,
  editorial_score, reviewed_by_telegram_id, reviewed_at

stories
  id, city_id, author_type (editorial|venue|provider),
  author_id, media_id, link_url, expires_at

ad_campaigns
  id, city_id, advertiser_id, placement, creative_media_id,
  starts_at, ends_at, budget, impressions, clicks

reviews
  id, city_id, user_id, entity_type, entity_id,
  rating, text, photos[], is_approved
```

---

## Платежи

```
payments
  id, booking_id|order_id, provider external_id (yookassa),
  amount, status, refunded_at

payouts
  id, provider_id, amount, period, status
```

---

## Индексы (рекомендации)

- `(city_id, slug)` unique на публичных сущностях.
- `(city_id, starts_at)` на events.
- `(city_id, source_external_id)` unique partial where source_external_id is not null.
- `(provider_id, starts_at)` на slots.
- `(user_id, city_id)` на favorites.

---

## Полиморфизм «Избранное» и «Отзывы»

`entity_type` enum:

`venue | event | provider | tourism_listing | product | curated_list`

Единый паттерн снижает число таблиц на MVP.
