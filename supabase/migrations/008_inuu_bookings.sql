-- Unified bookings (events, beauty, confectioner, leads)

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references public.cities(id) on delete restrict,
  shop_id uuid references public.shops(id) on delete set null,
  booking_type public.inuu_booking_type not null,
  status public.inuu_booking_status not null default 'pending',
  user_id uuid references public.profiles(id) on delete set null,
  customer_telegram_id bigint,
  customer_max_user_id text,
  event_id uuid references public.events(id) on delete set null,
  venue_id uuid references public.venues(id) on delete set null,
  provider_id uuid,
  service_id uuid,
  slot_id uuid,
  quantity integer not null default 1 check (quantity > 0),
  subtotal integer not null default 0 check (subtotal >= 0),
  total integer not null default 0 check (total >= 0),
  currency text not null default 'RUB',
  payment_status text not null default 'unpaid'
    check (payment_status in ('unpaid', 'pending', 'paid', 'failed', 'canceled', 'refunded')),
  payment_provider text,
  payment_id text,
  paid_at timestamptz,
  qr_token text unique,
  contact_phone text,
  contact_name text,
  comment text,
  metadata jsonb not null default '{}'::jsonb,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_bookings_city_created on public.bookings (city_id, created_at desc);
create index if not exists idx_bookings_user on public.bookings (user_id, created_at desc);
create index if not exists idx_bookings_shop_status on public.bookings (shop_id, status);
create index if not exists idx_bookings_event on public.bookings (event_id);
create index if not exists idx_bookings_provider on public.bookings (provider_id);

drop trigger if exists trg_bookings_updated_at on public.bookings;
create trigger trg_bookings_updated_at
before update on public.bookings
for each row execute function public.set_current_timestamp_updated_at();

create or replace function public.ensure_booking_city_id()
returns trigger
language plpgsql
as $$
declare
  resolved_city uuid;
begin
  if new.city_id is not null then
    return new;
  end if;

  if new.event_id is not null then
    select e.city_id into resolved_city from public.events e where e.id = new.event_id;
  elsif new.venue_id is not null then
    select v.city_id into resolved_city from public.venues v where v.id = new.venue_id;
  elsif new.shop_id is not null then
    select s.city_id into resolved_city from public.shops s where s.id = new.shop_id;
  end if;

  if resolved_city is null then
    resolved_city := public.resolve_default_city_id();
  end if;

  if resolved_city is null then
    raise exception 'Cannot resolve city_id for booking';
  end if;

  new.city_id := resolved_city;
  return new;
end;
$$;

drop trigger if exists trg_ensure_booking_city_id on public.bookings;
create trigger trg_ensure_booking_city_id
before insert or update on public.bookings
for each row execute function public.ensure_booking_city_id();
