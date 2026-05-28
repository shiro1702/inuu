alter table public.cities
  add column if not exists content_ops_settings jsonb not null default '{}'::jsonb;
