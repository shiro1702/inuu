-- TASK-008: parsing_strategy / parsing_rules on web sources + scraping_alerts

alter table public.city_web_sources
  add column if not exists parsing_strategy jsonb,
  add column if not exists parsing_rules jsonb,
  add column if not exists rules_validated_at timestamptz;

comment on column public.city_web_sources.parsing_strategy is
  'Cached Groq classifier: page_type, list_link_pattern, confidence, classified_at';
comment on column public.city_web_sources.parsing_rules is
  'Cheerio CSS selectors for fast-lane extraction';
comment on column public.city_web_sources.rules_validated_at is
  'Last successful fast-lane parse';

create table if not exists public.scraping_alerts (
  id uuid primary key default gen_random_uuid(),
  web_source_id uuid not null references public.city_web_sources(id) on delete cascade,
  url text not null,
  reason text not null,
  snapshot text,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  constraint scraping_alerts_snapshot_len check (
    snapshot is null or char_length(snapshot) <= 2000
  )
);

create index if not exists idx_scraping_alerts_source_open
  on public.scraping_alerts (web_source_id, resolved_at)
  where resolved_at is null;

comment on table public.scraping_alerts is
  'Web crawl failures: unknown page type, rules_failed, empty_page, etc.';

alter table public.scraping_alerts enable row level security;
