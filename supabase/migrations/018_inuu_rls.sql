-- Row Level Security (INUU)

alter table public.cities enable row level security;
alter table public.shops enable row level security;
alter table public.shop_members enable row level security;
alter table public.profiles enable row level security;
alter table public.auth_tokens enable row level security;
alter table public.auth_bridge_sessions enable row level security;
alter table public.venues enable row level security;
alter table public.festivals enable row level security;
alter table public.event_categories enable row level security;
alter table public.events enable row level security;
alter table public.bookings enable row level security;
alter table public.providers enable row level security;
alter table public.services enable row level security;
alter table public.schedule_slots enable row level security;
alter table public.user_favorites enable row level security;
alter table public.user_city_preferences enable row level security;
alter table public.city_subscriptions enable row level security;
alter table public.editorial_posts enable row level security;
alter table public.curated_lists enable row level security;
alter table public.curated_list_items enable row level security;
alter table public.tourism_listings enable row level security;
alter table public.tourism_leads enable row level security;
alter table public.story_campaigns enable row level security;
alter table public.story_slides enable row level security;
alter table public.story_views enable row level security;
alter table public.notification_events enable row level security;
alter table public.entity_reviews enable row level security;
alter table public.booking_payment_intents enable row level security;

-- Public read: active cities
drop policy if exists cities_public_read on public.cities;
create policy cities_public_read on public.cities for select using (is_active = true);

-- Public read: published catalog
drop policy if exists venues_public_read on public.venues;
create policy venues_public_read on public.venues for select using (is_published = true and is_active = true);

drop policy if exists events_public_read on public.events;
create policy events_public_read on public.events for select using (is_published = true);

drop policy if exists festivals_public_read on public.festivals;
create policy festivals_public_read on public.festivals for select using (is_active = true);

drop policy if exists event_categories_public_read on public.event_categories;
create policy event_categories_public_read on public.event_categories for select using (true);

drop policy if exists providers_public_read on public.providers;
create policy providers_public_read on public.providers for select using (is_published = true and is_active = true);

drop policy if exists services_public_read on public.services;
create policy services_public_read on public.services for select
using (
  exists (
    select 1 from public.providers p
    where p.id = services.provider_id and p.is_published = true and p.is_active = true
  )
);

drop policy if exists tourism_listings_public_read on public.tourism_listings;
create policy tourism_listings_public_read on public.tourism_listings for select using (is_published = true);

drop policy if exists editorial_posts_public_read on public.editorial_posts;
create policy editorial_posts_public_read on public.editorial_posts for select using (is_published = true);

drop policy if exists curated_lists_public_read on public.curated_lists;
create policy curated_lists_public_read on public.curated_lists for select using (is_published = true);

drop policy if exists curated_list_items_public_read on public.curated_list_items;
create policy curated_list_items_public_read on public.curated_list_items for select
using (exists (select 1 from public.curated_lists l where l.id = list_id and l.is_published = true));

drop policy if exists story_campaigns_public_read on public.story_campaigns;
create policy story_campaigns_public_read on public.story_campaigns for select using (is_active = true);

drop policy if exists story_slides_public_read on public.story_slides;
create policy story_slides_public_read on public.story_slides for select
using (exists (select 1 from public.story_campaigns c where c.id = campaign_id and c.is_active = true));

drop policy if exists schedule_slots_public_read on public.schedule_slots;
create policy schedule_slots_public_read on public.schedule_slots for select using (is_available = true);

drop policy if exists story_views_auth_insert on public.story_views;
create policy story_views_auth_insert on public.story_views for insert with check (auth.uid() is not null);

drop policy if exists feature_catalog_public_read on public.feature_catalog;
create policy feature_catalog_public_read on public.feature_catalog for select using (true);

-- Profiles: own row
drop policy if exists profiles_self_all on public.profiles;
create policy profiles_self_all on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);

-- Favorites / preferences / subscriptions: own row
drop policy if exists user_favorites_self on public.user_favorites;
create policy user_favorites_self on public.user_favorites for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists user_city_preferences_self on public.user_city_preferences;
create policy user_city_preferences_self on public.user_city_preferences for all
using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists city_subscriptions_self on public.city_subscriptions;
create policy city_subscriptions_self on public.city_subscriptions for all
using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Bookings: customer sees own
drop policy if exists bookings_customer_read on public.bookings;
create policy bookings_customer_read on public.bookings for select using (auth.uid() = user_id);

drop policy if exists bookings_customer_insert on public.bookings;
create policy bookings_customer_insert on public.bookings for insert with check (auth.uid() = user_id);

-- Partner: shop members manage tenant data
drop policy if exists shops_member_read on public.shops;
create policy shops_member_read on public.shops for select using (public.is_shop_member(id));

drop policy if exists shops_member_write on public.shops;
create policy shops_member_write on public.shops for update using (public.is_shop_member(id));

drop policy if exists shop_members_self_read on public.shop_members;
create policy shop_members_self_read on public.shop_members for select
using (user_id = auth.uid() or public.is_shop_member(shop_id));

drop policy if exists venues_partner_all on public.venues;
create policy venues_partner_all on public.venues for all
using (shop_id is not null and public.is_shop_member(shop_id))
with check (shop_id is not null and public.is_shop_member(shop_id));

drop policy if exists events_partner_all on public.events;
create policy events_partner_all on public.events for all
using (shop_id is not null and public.is_shop_member(shop_id))
with check (shop_id is not null and public.is_shop_member(shop_id));

drop policy if exists bookings_partner_read on public.bookings;
create policy bookings_partner_read on public.bookings for select
using (shop_id is not null and public.is_shop_member(shop_id));

drop policy if exists bookings_partner_update on public.bookings;
create policy bookings_partner_update on public.bookings for update
using (shop_id is not null and public.is_shop_member(shop_id));

-- Service role for tokens / webhooks
drop policy if exists auth_tokens_service on public.auth_tokens;
create policy auth_tokens_service on public.auth_tokens for all
using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

drop policy if exists auth_bridge_service on public.auth_bridge_sessions;
create policy auth_bridge_service on public.auth_bridge_sessions for all
using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

drop policy if exists notification_events_service on public.notification_events;
create policy notification_events_service on public.notification_events for all
using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

drop policy if exists payment_webhook_service on public.payment_webhook_events;
create policy payment_webhook_service on public.payment_webhook_events for all
using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
