-- TASK-001/002: context_type on TG sources + web crawl sources

alter table public.city_telegram_sources
  add column if not exists context_type text
    check (context_type in ('club', 'theater', 'standup', 'library', 'museum', 'cinema', 'general'));

comment on column public.city_telegram_sources.context_type is
  'Venue context for Groq system prompt (theater, club, standup, …)';

update public.city_telegram_sources
set context_type = case source_key
  when 'standup_uu' then 'standup'
  when 'baikalteatr' then 'theater'
  else 'general'
end
where context_type is null;

alter table public.city_telegram_sources
  alter column context_type set default 'general';

update public.city_telegram_sources
set context_type = 'general'
where context_type is null;

-- Web sources for cron crawl (TASK-002)
create table if not exists public.city_web_sources (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references public.cities(id) on delete cascade,
  url text not null,
  context_type text not null default 'general'
    check (context_type in ('club', 'theater', 'standup', 'library', 'museum', 'cinema', 'general')),
  organization_id uuid references public.shops(id) on delete set null,
  cron_enabled boolean not null default false,
  is_active boolean not null default true,
  last_crawled_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (city_id, url)
);

create index if not exists idx_city_web_sources_city_cron
  on public.city_web_sources (city_id, cron_enabled, is_active);

comment on table public.city_web_sources is
  'Whitelisted web pages for cron → POST /api/ingest/content/submit (sourceKind=web_cron)';

drop trigger if exists trg_city_web_sources_updated_at on public.city_web_sources;
create trigger trg_city_web_sources_updated_at
before update on public.city_web_sources
for each row execute function public.set_current_timestamp_updated_at();

alter table public.city_web_sources enable row level security;

-- Placeholder seed: inactive until team replaces URLs
insert into public.city_web_sources (city_id, url, context_type, cron_enabled, is_active, notes)
select c.id, v.url, v.context_type, false, false, v.notes
from public.cities c
cross join (
  values
    ('https://example-theater.local/afisha', 'theater', 'заменить URL — театр Улан-Удэ'),
    ('https://example-club.local/events', 'club', 'заменить URL — клуб Улан-Удэ'),
    ('https://example-museum.local/exhibitions', 'museum', 'заменить URL — музей Улан-Удэ')
) as v(url, context_type, notes)
where c.slug = 'ulan-ude'
on conflict (city_id, url) do update
set
  context_type = excluded.context_type,
  notes = excluded.notes;
