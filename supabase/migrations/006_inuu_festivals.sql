-- Large city events / festival zones

create table if not exists public.festivals (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references public.cities(id) on delete cascade,
  slug text not null,
  name text not null,
  description text,
  pulse_stats jsonb not null default '{}'::jsonb,
  schedule jsonb not null default '[]'::jsonb,
  public_banner_lead_days integer not null default 35 check (public_banner_lead_days >= 0),
  starts_at timestamptz,
  ends_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (city_id, slug)
);

create index if not exists idx_festivals_active_window
  on public.festivals (city_id, is_active, starts_at, ends_at);

drop trigger if exists trg_festivals_updated_at on public.festivals;
create trigger trg_festivals_updated_at
before update on public.festivals
for each row execute function public.set_current_timestamp_updated_at();
