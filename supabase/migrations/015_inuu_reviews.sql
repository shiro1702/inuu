-- Polymorphic reviews (venues, events, providers, tourism)

create table if not exists public.entity_reviews (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references public.cities(id) on delete cascade,
  shop_id uuid references public.shops(id) on delete set null,
  booking_id uuid references public.bookings(id) on delete set null,
  profile_id uuid references public.profiles(id) on delete set null,
  entity_type public.inuu_entity_type not null,
  entity_id uuid not null,
  customer_telegram_id bigint,
  customer_max_user_id text,
  rating smallint not null check (rating between 1 and 5),
  comment text,
  media_urls jsonb not null default '[]'::jsonb,
  status text not null default 'new'
    check (status in ('new', 'moderation', 'published', 'rejected', 'resolved')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists uq_entity_reviews_booking
  on public.entity_reviews (booking_id) where booking_id is not null;

create index if not exists idx_entity_reviews_entity_published
  on public.entity_reviews (entity_type, entity_id, published_at desc)
  where status = 'published';

create index if not exists idx_entity_reviews_city_status
  on public.entity_reviews (city_id, status, created_at desc);

create table if not exists public.entity_review_events (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references public.entity_reviews(id) on delete cascade,
  action text not null
    check (action in ('created', 'publish', 'reject', 'resolve', 'reopen', 'edit')),
  action_payload jsonb not null default '{}'::jsonb,
  actor_user_id text,
  created_at timestamptz not null default now()
);

create index if not exists idx_entity_review_events_review
  on public.entity_review_events (review_id, created_at desc);
