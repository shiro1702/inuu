-- Places on the city map

create table if not exists public.venues (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references public.cities(id) on delete cascade,
  shop_id uuid references public.shops(id) on delete set null,
  slug text not null,
  title text not null,
  description text,
  address text,
  lat double precision,
  lng double precision,
  phone text,
  instagram_url text,
  vibe_tags text[] not null default '{}',
  rating_avg numeric(3,2) not null default 0 check (rating_avg >= 0 and rating_avg <= 5),
  editorial_quote text,
  cover_media_url text,
  is_published boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (city_id, slug)
);

create index if not exists idx_venues_city_published on public.venues (city_id, is_published) where is_active = true;
create index if not exists idx_venues_shop on public.venues (shop_id);
create index if not exists idx_venues_geo on public.venues (city_id, lat, lng) where lat is not null and lng is not null;

drop trigger if exists trg_venues_updated_at on public.venues;
create trigger trg_venues_updated_at
before update on public.venues
for each row execute function public.set_current_timestamp_updated_at();
