-- B2B organizations (table name `shops` for code compatibility)

create table if not exists public.shops (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references public.cities(id) on delete restrict,
  slug text not null,
  name text not null,
  org_type public.inuu_org_type not null default 'venue_operator',
  telegram_bot_token text,
  telegram_bot_id bigint unique,
  manager_chat_id text,
  channel_policy jsonb not null default '{"primary":"telegram","secondary":"max","maxEnabled":false}'::jsonb,
  integration_keys jsonb not null default '{}'::jsonb,
  ui_settings jsonb not null default '{}'::jsonb,
  legal_name text,
  inn text,
  ogrn text,
  yookassa_shop_id text,
  yookassa_secret_key text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (city_id, slug)
);

create index if not exists idx_shops_city_id on public.shops (city_id);
create index if not exists idx_shops_city_active on public.shops (city_id, is_active);
create index if not exists idx_shops_org_type on public.shops (org_type);

drop trigger if exists trg_shops_updated_at on public.shops;
create trigger trg_shops_updated_at
before update on public.shops
for each row execute function public.set_current_timestamp_updated_at();

create table if not exists public.shop_members (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references public.shops(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'staff'
    check (role in ('owner', 'admin', 'staff', 'editor')),
  created_at timestamptz not null default now(),
  unique (shop_id, user_id)
);

create index if not exists idx_shop_members_user on public.shop_members (user_id);

create table if not exists public.organization_style_settings (
  shop_id uuid primary key references public.shops(id) on delete cascade,
  config jsonb not null default '{}'::jsonb,
  prev_config jsonb,
  audit_log jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.platform_operation_settings (
  id smallint primary key default 1,
  settings jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint platform_operation_settings_singleton check (id = 1)
);

insert into public.platform_operation_settings (id)
values (1)
on conflict (id) do nothing;

create or replace function public.current_shop_id()
returns uuid
language sql
stable
as $$
  select nullif(auth.jwt() ->> 'shop_id', '')::uuid
$$;

create or replace function public.is_shop_member(p_shop_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.shop_members m
    where m.shop_id = p_shop_id
      and m.user_id = auth.uid()
  )
$$;
