-- Beauty: providers, services, slots, waitlist, hot slots

create table if not exists public.providers (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references public.cities(id) on delete cascade,
  shop_id uuid references public.shops(id) on delete set null,
  slug text not null,
  name text not null,
  bio text,
  provider_kind text not null default 'beauty'
    check (provider_kind in ('beauty', 'confectioner')),
  rating_avg numeric(3,2) not null default 0 check (rating_avg >= 0 and rating_avg <= 5),
  can_work_multiple_venues boolean not null default false,
  is_published boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (city_id, slug)
);

create index if not exists idx_providers_city_kind on public.providers (city_id, provider_kind) where is_active = true;

alter table public.bookings
  add constraint bookings_provider_id_fkey
  foreign key (provider_id) references public.providers(id) on delete set null;

create table if not exists public.provider_venues (
  provider_id uuid not null references public.providers(id) on delete cascade,
  venue_id uuid not null references public.venues(id) on delete cascade,
  primary key (provider_id, venue_id)
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references public.providers(id) on delete cascade,
  name text not null,
  duration_min integer not null check (duration_min > 0),
  price integer not null default 0 check (price >= 0),
  currency text not null default 'RUB',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_services_provider on public.services (provider_id) where is_active = true;

alter table public.bookings
  add constraint bookings_service_id_fkey
  foreign key (service_id) references public.services(id) on delete set null;

create table if not exists public.schedule_slots (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references public.providers(id) on delete cascade,
  venue_id uuid references public.venues(id) on delete set null,
  service_id uuid references public.services(id) on delete set null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  is_available boolean not null default true,
  booking_id uuid references public.bookings(id) on delete set null,
  created_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create index if not exists idx_schedule_slots_provider_time
  on public.schedule_slots (provider_id, starts_at) where is_available = true;

alter table public.bookings
  add constraint bookings_slot_id_fkey
  foreign key (slot_id) references public.schedule_slots(id) on delete set null;

create table if not exists public.waitlist_entries (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references public.cities(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  provider_id uuid not null references public.providers(id) on delete cascade,
  service_id uuid references public.services(id) on delete set null,
  desired_date_from date not null,
  desired_date_to date not null,
  notified_at timestamptz,
  expires_at timestamptz,
  status text not null default 'active' check (status in ('active', 'fulfilled', 'expired', 'cancelled')),
  created_at timestamptz not null default now(),
  check (desired_date_to >= desired_date_from)
);

create index if not exists idx_waitlist_provider_active
  on public.waitlist_entries (provider_id, status) where status = 'active';

create table if not exists public.hot_slots (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references public.cities(id) on delete cascade,
  provider_id uuid not null references public.providers(id) on delete cascade,
  service_id uuid not null references public.services(id) on delete cascade,
  slot_id uuid references public.schedule_slots(id) on delete set null,
  starts_at timestamptz not null,
  price integer not null check (price >= 0),
  discount_price integer not null check (discount_price >= 0),
  expires_at timestamptz not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_hot_slots_city_active
  on public.hot_slots (city_id, expires_at) where is_active = true;
