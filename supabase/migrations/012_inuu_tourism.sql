-- Baikal / tourism listings and tender leads

create table if not exists public.tourism_listings (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references public.cities(id) on delete cascade,
  shop_id uuid references public.shops(id) on delete set null,
  slug text not null,
  title text not null,
  location_name text,
  description text,
  vibe_tags text[] not null default '{}',
  price_from integer check (price_from is null or price_from >= 0),
  photos jsonb not null default '[]'::jsonb,
  contact_phone text,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (city_id, slug)
);

create index if not exists idx_tourism_listings_city_published
  on public.tourism_listings (city_id) where is_published = true;

create table if not exists public.tourism_leads (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references public.cities(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  date_from date not null,
  date_to date not null,
  guests_count integer not null check (guests_count > 0),
  budget integer check (budget is null or budget >= 0),
  wishes_text text,
  status text not null default 'new'
    check (status in ('new', 'assigned', 'contacted', 'closed', 'cancelled')),
  assigned_shop_id uuid references public.shops(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (date_to >= date_from)
);

create index if not exists idx_tourism_leads_city_status on public.tourism_leads (city_id, status);
