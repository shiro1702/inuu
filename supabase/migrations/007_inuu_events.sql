-- City events / afisha

create table if not exists public.event_categories (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references public.cities(id) on delete cascade,
  slug text not null,
  name text not null,
  parent_id uuid references public.event_categories(id) on delete set null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (city_id, slug)
);

create index if not exists idx_event_categories_city_sort
  on public.event_categories (city_id, sort_order);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references public.cities(id) on delete cascade,
  shop_id uuid references public.shops(id) on delete set null,
  venue_id uuid references public.venues(id) on delete set null,
  festival_id uuid references public.festivals(id) on delete set null,
  category_id uuid references public.event_categories(id) on delete set null,
  slug text not null,
  title text not null,
  description text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  capacity integer check (capacity is null or capacity > 0),
  price integer not null default 0 check (price >= 0),
  currency text not null default 'RUB',
  cover_media_url text,
  is_promoted boolean not null default false,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (city_id, slug)
);

create index if not exists idx_events_city_starts on public.events (city_id, starts_at) where is_published = true;
create index if not exists idx_events_venue on public.events (venue_id, starts_at);
create index if not exists idx_events_shop on public.events (shop_id);
create index if not exists idx_events_festival on public.events (festival_id);

drop trigger if exists trg_events_updated_at on public.events;
create trigger trg_events_updated_at
before update on public.events
for each row execute function public.set_current_timestamp_updated_at();
