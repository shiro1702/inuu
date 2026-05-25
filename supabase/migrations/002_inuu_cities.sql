-- Cities (multi-tenant top level)

create table if not exists public.cities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  timezone text not null default 'Asia/Irkutsk',
  editorial_name text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_cities_is_active on public.cities (is_active);

drop trigger if exists trg_cities_updated_at on public.cities;
create trigger trg_cities_updated_at
before update on public.cities
for each row execute function public.set_current_timestamp_updated_at();

create or replace function public.resolve_default_city_id()
returns uuid
language sql
stable
as $$
  select c.id
  from public.cities c
  where c.slug = 'ulan-ude' and c.is_active = true
  limit 1
$$;
