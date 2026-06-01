-- TASK-007: link TG ingest sources to organizations (shadow or claimed)

alter table public.city_telegram_sources
  add column if not exists organization_id uuid references public.shops(id) on delete set null;

create index if not exists idx_city_telegram_sources_org
  on public.city_telegram_sources (organization_id)
  where organization_id is not null;

comment on column public.city_telegram_sources.organization_id is
  'Optional org binding for parsed events from this channel';
