-- B2B feature modules for INUU partners

create table if not exists public.feature_catalog (
  code text primary key,
  name text not null,
  billing_type text not null check (billing_type in ('monthly', 'weekly', 'usage', 'hybrid')),
  price integer not null default 0,
  currency text not null default 'RUB',
  dependencies jsonb not null default '[]'::jsonb,
  status text not null default 'available' check (status in ('available', 'beta', 'request_only')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.shop_feature_subscriptions (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references public.shops(id) on delete cascade,
  feature_code text not null references public.feature_catalog(code) on delete cascade,
  enabled boolean not null default true,
  source text not null default 'manual'
    check (source in ('manual', 'trial', 'billing', 'system', 'seed')),
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (shop_id, feature_code)
);

create index if not exists idx_shop_feature_subscriptions_shop_enabled
  on public.shop_feature_subscriptions (shop_id, enabled);

insert into public.feature_catalog (code, name, billing_type, price, dependencies, status)
values
  ('inuu_city_listing', 'Карточка в городе', 'monthly', 0, '[]'::jsonb, 'available'),
  ('inuu_events', 'Афиша и билеты', 'monthly', 0, '["inuu_city_listing"]'::jsonb, 'available'),
  ('inuu_beauty_booking', 'Онлайн-запись', 'monthly', 1490, '["inuu_city_listing"]'::jsonb, 'available'),
  ('inuu_editorial_stories', 'Stories и подборки', 'monthly', 0, '["inuu_city_listing"]'::jsonb, 'available'),
  ('inuu_reputation', 'Отзывы и репутация', 'monthly', 990, '["inuu_city_listing"]'::jsonb, 'available'),
  ('inuu_tourism_leads', 'Лиды на отдых', 'usage', 0, '["inuu_city_listing"]'::jsonb, 'beta'),
  ('inuu_ads', 'Рекламные размещения', 'hybrid', 0, '["inuu_city_listing"]'::jsonb, 'available')
on conflict (code) do update
set
  name = excluded.name,
  billing_type = excluded.billing_type,
  price = excluded.price,
  dependencies = excluded.dependencies,
  status = excluded.status;
