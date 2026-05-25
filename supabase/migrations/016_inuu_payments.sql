-- Booking payments (YooKassa / T-Bank)

create table if not exists public.booking_payment_intents (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  shop_id uuid references public.shops(id) on delete set null,
  provider text not null,
  provider_payment_id text not null,
  amount integer not null check (amount >= 0),
  currency text not null default 'RUB',
  status text not null default 'created'
    check (status in ('created', 'pending', 'succeeded', 'canceled', 'failed')),
  idempotence_key text not null,
  confirmation_url text,
  raw_response jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider, provider_payment_id)
);

create index if not exists idx_booking_payment_intents_booking
  on public.booking_payment_intents (booking_id);

create table if not exists public.payment_webhook_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  event_id text not null,
  provider_payment_id text,
  payload jsonb not null default '{}'::jsonb,
  processed boolean not null default false,
  created_at timestamptz not null default now(),
  processed_at timestamptz,
  unique (provider, event_id)
);

create table if not exists public.provider_payouts (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references public.providers(id) on delete cascade,
  amount integer not null check (amount >= 0),
  currency text not null default 'RUB',
  period_start date,
  period_end date,
  status text not null default 'pending'
    check (status in ('pending', 'processing', 'paid', 'failed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_provider_payouts_provider on public.provider_payouts (provider_id, created_at desc);
