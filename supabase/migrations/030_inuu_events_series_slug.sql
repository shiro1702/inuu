-- Group multiple date slots of the same event (MVP: shared series_slug)

alter table public.events
  add column if not exists series_slug text;

create index if not exists idx_events_city_series_starts
  on public.events (city_id, series_slug, starts_at)
  where series_slug is not null and is_published = true;

comment on column public.events.series_slug is
  'Shared slug for multi-date events; one row per starts_at, same series_slug';
