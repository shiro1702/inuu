-- Customer profiles + Telegram / MAX link tokens

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  telegram_id bigint unique,
  max_user_id text unique,
  max_chat_id text,
  max_conversation_id text,
  vk_user_id text unique,
  default_city_id uuid references public.cities(id) on delete set null,
  interest_tags text[] not null default '{}',
  notify_channels jsonb not null default '{"telegram":true,"max":false,"email":false}'::jsonb,
  gender text check (gender is null or gender in ('male', 'female', 'other')),
  birth_date date,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_profiles_default_city on public.profiles (default_city_id);
create index if not exists idx_profiles_telegram on public.profiles (telegram_id) where telegram_id is not null;

drop trigger if exists set_timestamp_on_profiles on public.profiles;
create trigger set_timestamp_on_profiles
before update on public.profiles
for each row execute function public.set_current_timestamp_updated_at();

create table if not exists public.auth_tokens (
  token uuid primary key default gen_random_uuid(),
  telegram_id bigint,
  channel text not null default 'telegram' check (channel in ('telegram', 'max')),
  bridge_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '15 minutes')
);

create index if not exists idx_auth_tokens_expires on public.auth_tokens (expires_at desc);

create table if not exists public.auth_bridge_sessions (
  id uuid primary key default gen_random_uuid(),
  bridge_key text not null unique,
  shop_id text not null,
  scope_key text,
  payload jsonb not null default '{}'::jsonb,
  expires_at timestamptz not null default (now() + interval '30 minutes'),
  created_at timestamptz not null default now()
);

create index if not exists idx_auth_bridge_sessions_expires on public.auth_bridge_sessions (expires_at desc);
