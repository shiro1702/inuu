-- Carousel preset background images (wave 4b)

create table if not exists public.carousel_preset_images (
  id uuid primary key default gen_random_uuid(),
  city_id uuid references public.cities(id) on delete set null,
  folder text not null,
  storage_path text not null,
  tags text[] not null default '{}',
  vibe_slugs text[] not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists idx_carousel_preset_images_city
  on public.carousel_preset_images (city_id);

create index if not exists idx_carousel_preset_images_tags
  on public.carousel_preset_images using gin (tags);

alter table public.carousel_preset_images enable row level security;

drop policy if exists carousel_preset_images_service on public.carousel_preset_images;
create policy carousel_preset_images_service on public.carousel_preset_images for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

drop policy if exists carousel_preset_images_public_read on public.carousel_preset_images;
create policy carousel_preset_images_public_read on public.carousel_preset_images for select
  using (true);
