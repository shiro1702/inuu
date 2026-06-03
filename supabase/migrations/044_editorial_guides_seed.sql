-- Smoke seed: editorial guides for Улан-Удэ (TASK-014)

-- Prerequisites if migrations 022/027/041/043 were not applied on this database
do $$
begin
  if not exists (
    select 1 from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'public' and t.typname = 'inuu_editorial_post_type'
  ) then
    create type public.inuu_editorial_post_type as enum (
      'news',
      'review',
      'guide',
      'announcement',
      'afisha_digest'
    );
  end if;
exception
  when duplicate_object then null;
end $$;

alter table public.editorial_posts
  add column if not exists post_type public.inuu_editorial_post_type not null default 'news',
  add column if not exists excerpt text,
  add column if not exists topic_tags text[] not null default '{}',
  add column if not exists category_slug text,
  add column if not exists body_json jsonb,
  add column if not exists linked_entity_type public.inuu_entity_type,
  add column if not exists linked_entity_id uuid;

insert into public.editorial_posts (
  city_id,
  shop_id,
  slug,
  title,
  body,
  body_json,
  excerpt,
  cover_media_url,
  post_type,
  topic_tags,
  linked_entity_type,
  linked_entity_id,
  is_published,
  published_at
)
select
  c.id,
  s.id,
  'weekend-journal-news',
  'Что открыть в эти выходные',
  'Сводка от редакции: новые вечерние форматы, детские мастер-классы и террасы с видом. Сохраните материал — вернётесь к нему в субботу утром.',
  jsonb_build_array(
    jsonb_build_object('type', 'paragraph', 'text', 'Сводка от редакции: новые вечерние форматы, детские мастер-классы и террасы с видом.'),
    jsonb_build_object('type', 'paragraph', 'text', 'Сохраните материал — вернётесь к нему в субботу утром.')
  ),
  'Главное на ближайшие выходные в одном материале.',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
  'news'::public.inuu_editorial_post_type,
  array['culture','family']::text[],
  null,
  null,
  true,
  now()
from public.cities c
join public.shops s on s.city_id = c.id and s.slug = 'inuu-editorial'
where c.slug = 'ulan-ude'
on conflict (city_id, slug) do update
set title = excluded.title, body = excluded.body, body_json = excluded.body_json, is_published = true;

insert into public.editorial_posts (
  city_id, shop_id, slug, title, body, body_json, excerpt, cover_media_url,
  post_type, topic_tags, linked_entity_type, linked_entity_id, is_published, published_at
)
select
  c.id,
  s.id,
  'baikal-view-review',
  'Закат на Baikal View',
  'Панорамная терраса с видом на закат — лучшее время для визита после 19:00.',
  jsonb_build_array(
    jsonb_build_object('type', 'paragraph', 'text', 'Панорамная терраса с видом на закат — лучшее время для визита после 19:00.'),
    jsonb_build_object(
      'type', 'image',
      'url', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
      'caption', 'Вид с террасы'
    )
  ),
  'Обзор террасы Baikal View.',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
  'review'::public.inuu_editorial_post_type,
  array['tourism','food']::text[],
  'venue'::public.inuu_entity_type,
  v.id,
  true,
  now() - interval '1 day'
from public.cities c
join public.shops s on s.city_id = c.id and s.slug = 'inuu-editorial'
join public.venues v on v.city_id = c.id and v.slug = 'baikal-view'
where c.slug = 'ulan-ude'
on conflict (city_id, slug) do update
set title = excluded.title, body_json = excluded.body_json, linked_entity_id = excluded.linked_entity_id, is_published = true;

insert into public.editorial_posts (
  city_id, shop_id, slug, title, body, body_json, excerpt, cover_media_url,
  post_type, topic_tags, linked_entity_type, linked_entity_id, is_published, published_at
)
select
  c.id,
  s.id,
  'bar-crawl-intro',
  'Барный кроул: 4 места в центре',
  'Короткий маршрут по вечерним барам и кофейням — начните с Арт-квартала и двигайтесь к набережной.',
  jsonb_build_array(
    jsonb_build_object('type', 'paragraph', 'text', 'Короткий маршрут по вечерним барам и кофейням — начните с Арт-квартала и двигайтесь к набережной.'),
    jsonb_build_object('type', 'place_embed', 'venue_id', v.id)
  ),
  'Четыре остановки для тёплого вечера в Улан-Удэ.',
  'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80',
  'guide'::public.inuu_editorial_post_type,
  array['nightlife','food']::text[],
  'venue'::public.inuu_entity_type,
  v.id,
  true,
  now() - interval '2 days'
from public.cities c
join public.shops s on s.city_id = c.id and s.slug = 'inuu-editorial'
join public.venues v on v.city_id = c.id and v.slug = 'art-kvartal'
where c.slug = 'ulan-ude'
on conflict (city_id, slug) do update
set title = excluded.title, body_json = excluded.body_json, linked_entity_id = excluded.linked_entity_id, is_published = true;
