-- Carousel Editor SaaS: shareable projects (wave 4a)

create table if not exists public.generated_carousels (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  city_id uuid references public.cities(id) on delete set null,
  title text not null default 'Новая карусель',
  project_type text not null default 'carousel',
  theme_id text not null default 'minimal-ios',
  aspect text not null default '4:5',
  settings jsonb not null default '{}'::jsonb,
  slides jsonb not null default '[]'::jsonb
);

create index if not exists idx_generated_carousels_city_created
  on public.generated_carousels (city_id, created_at desc);

create index if not exists idx_generated_carousels_created_by
  on public.generated_carousels (created_by, created_at desc);

comment on table public.generated_carousels is
  'Carousel Editor projects — share link / persist (docs/inuu/features/content/38-carousel-editor-saas.md)';

alter table public.generated_carousels enable row level security;

drop policy if exists generated_carousels_service on public.generated_carousels;
create policy generated_carousels_service on public.generated_carousels for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
