-- Omnichannel notification log

create table if not exists public.notification_events (
  id uuid primary key default gen_random_uuid(),
  notification_key text not null unique,
  event_type text not null,
  channel text not null check (channel in ('telegram', 'max', 'email')),
  shop_id uuid references public.shops(id) on delete cascade,
  city_id uuid references public.cities(id) on delete set null,
  venue_id uuid references public.venues(id) on delete set null,
  booking_id uuid references public.bookings(id) on delete set null,
  conversation_id text,
  delivery_status text not null default 'pending'
    check (delivery_status in ('pending', 'sent', 'failed', 'skipped')),
  attempt_count integer not null default 0,
  last_error text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_notification_events_shop_created
  on public.notification_events (shop_id, created_at desc);

create index if not exists idx_notification_events_status
  on public.notification_events (delivery_status, updated_at desc);

create index if not exists idx_notification_events_city
  on public.notification_events (city_id, created_at desc);
