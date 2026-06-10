-- User carousel templates (wave 4c)

create table if not exists public.user_templates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  city_id uuid references public.cities(id) on delete set null,
  name text not null,
  preview_url text,
  theme_id text not null default 'minimal-ios',
  project_type text not null default 'carousel',
  layout_config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_user_templates_user on public.user_templates (user_id, created_at desc);

alter table public.user_templates enable row level security;

drop policy if exists user_templates_service on public.user_templates;
create policy user_templates_service on public.user_templates for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
