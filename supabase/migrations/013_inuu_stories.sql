-- Stories (city + organization scoped)

create table if not exists public.story_campaigns (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references public.cities(id) on delete cascade,
  shop_id uuid references public.shops(id) on delete cascade,
  author_type public.inuu_story_author_type not null default 'editorial',
  title text not null,
  preview_url text,
  placement text not null check (placement in ('top_bar', 'catalog_grid', 'home_hero')),
  link_url text,
  is_active boolean not null default true,
  valid_from timestamptz,
  valid_until timestamptz,
  targeting jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_story_campaigns_city_active
  on public.story_campaigns (city_id, is_active, placement);

create table if not exists public.story_slides (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.story_campaigns(id) on delete cascade,
  sort_order integer not null default 0,
  media_url text not null,
  duration_seconds integer not null default 5 check (duration_seconds between 1 and 120),
  action_type text not null default 'open_url'
    check (action_type in ('open_url', 'open_event', 'open_venue', 'none')),
  action_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_story_slides_campaign_sort on public.story_slides (campaign_id, sort_order);

create table if not exists public.story_views (
  id uuid primary key default gen_random_uuid(),
  slide_id uuid not null references public.story_slides(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  viewed_at timestamptz not null default now()
);

create index if not exists idx_story_views_slide on public.story_views (slide_id, viewed_at desc);
