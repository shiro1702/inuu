-- Editorial + curated lists

create table if not exists public.editorial_posts (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references public.cities(id) on delete cascade,
  shop_id uuid references public.shops(id) on delete set null,
  author_user_id uuid references auth.users(id) on delete set null,
  slug text not null,
  title text not null,
  body text not null,
  cover_media_url text,
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (city_id, slug)
);

create index if not exists idx_editorial_posts_city_published
  on public.editorial_posts (city_id, published_at desc) where is_published = true;

create table if not exists public.curated_lists (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references public.cities(id) on delete cascade,
  shop_id uuid references public.shops(id) on delete set null,
  slug text not null,
  title text not null,
  description text,
  is_published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (city_id, slug)
);

create table if not exists public.curated_list_items (
  id uuid primary key default gen_random_uuid(),
  list_id uuid not null references public.curated_lists(id) on delete cascade,
  entity_type public.inuu_entity_type not null,
  entity_id uuid not null,
  sort_order integer not null default 0,
  note text,
  unique (list_id, entity_type, entity_id)
);

create index if not exists idx_curated_list_items_list_sort
  on public.curated_list_items (list_id, sort_order);
