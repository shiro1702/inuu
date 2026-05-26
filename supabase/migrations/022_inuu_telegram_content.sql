-- Telegram export format: weekly afisha digests (album) + poster cards as events

do $$ begin
  create type public.inuu_editorial_post_type as enum (
    'news',
    'review',
    'guide',
    'announcement',
    'afisha_digest'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.inuu_editorial_media_type as enum ('photo', 'video');
exception when duplicate_object then null;
end $$;

alter table public.editorial_posts
  add column if not exists post_type public.inuu_editorial_post_type not null default 'news',
  add column if not exists excerpt text,
  add column if not exists source_channel text,
  add column if not exists source_telegram_message_id bigint,
  add column if not exists source_metadata jsonb not null default '{}'::jsonb;

create unique index if not exists idx_editorial_posts_city_tg_message
  on public.editorial_posts (city_id, source_telegram_message_id)
  where source_telegram_message_id is not null;

create table if not exists public.editorial_post_media (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.editorial_posts(id) on delete cascade,
  sort_order integer not null default 0,
  media_type public.inuu_editorial_media_type not null,
  media_url text not null,
  thumb_url text,
  source_path text,
  source_telegram_message_id bigint,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_editorial_post_media_post_sort
  on public.editorial_post_media (post_id, sort_order);

create unique index if not exists idx_editorial_post_media_post_source_path
  on public.editorial_post_media (post_id, source_path)
  where source_path is not null;

alter table public.events
  add column if not exists source_channel text,
  add column if not exists source_telegram_message_id bigint,
  add column if not exists editorial_post_id uuid references public.editorial_posts(id) on delete set null,
  add column if not exists source_metadata jsonb not null default '{}'::jsonb;

create unique index if not exists idx_events_city_tg_message
  on public.events (city_id, source_telegram_message_id)
  where source_telegram_message_id is not null;

alter table public.curated_lists
  add column if not exists source_channel text,
  add column if not exists source_telegram_message_id bigint,
  add column if not exists source_metadata jsonb not null default '{}'::jsonb;

create unique index if not exists idx_curated_lists_city_tg_message
  on public.curated_lists (city_id, source_telegram_message_id)
  where source_telegram_message_id is not null;

-- Public bucket for city editorial / afisha imports
insert into storage.buckets (id, name, public)
values ('city-editorial-media', 'city-editorial-media', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists city_editorial_media_public_read on storage.objects;
create policy city_editorial_media_public_read
  on storage.objects for select
  using (bucket_id = 'city-editorial-media');

-- Writes: service_role only (import script); no public insert policy

alter table public.editorial_post_media enable row level security;

drop policy if exists editorial_post_media_public_read on public.editorial_post_media;
create policy editorial_post_media_public_read on public.editorial_post_media
for select
using (
  exists (
    select 1 from public.editorial_posts p
    where p.id = post_id and p.is_published = true
  )
);
