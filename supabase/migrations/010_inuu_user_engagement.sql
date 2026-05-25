-- Favorites, bot subscriptions, city preferences

create table if not exists public.user_city_preferences (
  user_id uuid not null references public.profiles(id) on delete cascade,
  city_id uuid not null references public.cities(id) on delete cascade,
  interest_tags text[] not null default '{}',
  notify_channels jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, city_id)
);

create table if not exists public.user_favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  city_id uuid not null references public.cities(id) on delete cascade,
  entity_type public.inuu_entity_type not null,
  entity_id uuid not null,
  created_at timestamptz not null default now(),
  unique (user_id, city_id, entity_type, entity_id)
);

create index if not exists idx_user_favorites_user_city on public.user_favorites (user_id, city_id);

create table if not exists public.city_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  city_id uuid not null references public.cities(id) on delete cascade,
  channel text not null check (channel in ('telegram', 'max')),
  topic_slug text not null default 'digest',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (user_id, city_id, channel, topic_slug)
);

create index if not exists idx_city_subscriptions_city_topic
  on public.city_subscriptions (city_id, topic_slug);
