-- Seed: Улан-Удэ + базовые категории афиши

insert into public.cities (name, slug, timezone, editorial_name, is_active)
values ('Улан-Удэ', 'ulan-ude', 'Asia/Irkutsk', 'INUU Улан-Удэ', true)
on conflict (slug) do update
set
  name = excluded.name,
  timezone = excluded.timezone,
  editorial_name = excluded.editorial_name,
  is_active = excluded.is_active;

insert into public.event_categories (city_id, slug, name, sort_order)
select c.id, v.slug, v.name, v.sort_order
from public.cities c
cross join (
  values
    ('concerts', 'Концерты', 10),
    ('parties', 'Вечеринки', 20),
    ('masterclass', 'Мастер-классы', 30),
    ('exhibitions', 'Выставки', 40),
    ('kids', 'Детям', 50),
    ('outdoor', 'На природе', 60)
) as v(slug, name, sort_order)
where c.slug = 'ulan-ude'
on conflict (city_id, slug) do update
set name = excluded.name, sort_order = excluded.sort_order;

-- Platform editorial organization (optional dashboard)
insert into public.shops (city_id, slug, name, org_type, is_active)
select c.id, 'inuu-editorial', 'INUU Редакция', 'editorial', true
from public.cities c
where c.slug = 'ulan-ude'
on conflict (city_id, slug) do update
set name = excluded.name, org_type = excluded.org_type, is_active = excluded.is_active;

insert into public.shop_feature_subscriptions (shop_id, feature_code, enabled, source)
select s.id, f.code, true, 'seed'
from public.shops s
cross join public.feature_catalog f
where s.slug = 'inuu-editorial'
  and f.code in ('inuu_city_listing', 'inuu_events', 'inuu_editorial_stories', 'inuu_reputation')
on conflict (shop_id, feature_code) do update set enabled = true;

-- Demo venues & events for city home MVP
insert into public.venues (city_id, slug, title, description, address, lat, lng, is_published, is_active, vibe_tags, editorial_quote)
select c.id, v.slug, v.title, v.description, v.address, v.lat, v.lng, true, true, v.vibe_tags, v.quote
from public.cities c
cross join (
  values
    ('art-kvartal', 'Арт-квартал', 'Галерея и кофе в центре', 'ул. Ленина, 24', 51.8344::float8, 107.5846::float8, array['art','coffee']::text[], 'Уютное место для вечера'),
    ('baikal-view', 'Baikal View', 'Панорамная терраса', 'пос. Сокол, 1', 51.8700::float8, 107.6300::float8, array['view','food']::text[], 'Лучший вид на закат')
) as v(slug, title, description, address, lat, lng, vibe_tags, quote)
where c.slug = 'ulan-ude'
on conflict (city_id, slug) do update
set title = excluded.title, description = excluded.description, is_published = true, is_active = true;

insert into public.events (city_id, slug, title, description, starts_at, ends_at, price, currency, is_published, is_promoted, cover_media_url)
select c.id, e.slug, e.title, e.description, e.starts_at, e.ends_at, e.price, 'RUB', true, e.promoted, null
from public.cities c
cross join (
  values
    ('jazz-evening', 'Джазовый вечер', 'Живая музыка и бар', (now() + interval '3 days')::timestamptz, (now() + interval '3 days' + interval '4 hours')::timestamptz, 800, true),
    ('kids-workshop', 'Мастер-класс для детей', 'Творческая студия', (now() + interval '5 days')::timestamptz, (now() + interval '5 days' + interval '2 hours')::timestamptz, 0, false)
) as e(slug, title, description, starts_at, ends_at, price, promoted)
where c.slug = 'ulan-ude'
on conflict (city_id, slug) do update
set title = excluded.title, starts_at = excluded.starts_at, is_published = true;

insert into public.curated_lists (city_id, slug, title, description, is_published, sort_order)
select c.id, 'weekend', 'Куда сходить в выходные', 'Подборка редакции INUU', true, 1
from public.cities c
where c.slug = 'ulan-ude'
on conflict (city_id, slug) do update set title = excluded.title, is_published = true;

insert into public.story_campaigns (city_id, shop_id, author_type, title, preview_url, placement, is_active)
select c.id, s.id, 'editorial', 'INUU Улан-Удэ',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80',
  'top_bar', true
from public.cities c
join public.shops s on s.city_id = c.id and s.slug = 'inuu-editorial'
where c.slug = 'ulan-ude'
  and not exists (
    select 1 from public.story_campaigns sc
    where sc.city_id = c.id and sc.placement = 'top_bar' and sc.title = 'INUU Улан-Удэ'
  );

-- Слайды подключаются в 020_inuu_seed_city_stories_slides.sql (идемпотентно)
