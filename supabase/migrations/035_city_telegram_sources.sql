-- Whitelisted Telegram channels/groups for userbot ingestion (TASK-000)

create table if not exists public.city_telegram_sources (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references public.cities(id) on delete cascade,
  source_key text not null,
  source_type text not null default 'channel'
    check (source_type in ('channel', 'group')),
  is_active boolean not null default true,
  notes text,
  last_seen_message_id bigint,
  ingest_mode text not null default 'realtime'
    check (ingest_mode in ('realtime', 'batch')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (city_id, source_key)
);

create index if not exists idx_city_telegram_sources_city_active
  on public.city_telegram_sources (city_id, is_active);

comment on table public.city_telegram_sources is
  'Whitelisted TG sources for Telethon userbot → POST /api/ingest/content/submit';
comment on column public.city_telegram_sources.source_key is
  'Public @username (without @) or numeric peer id (-100...)';
comment on column public.city_telegram_sources.last_seen_message_id is
  'Last processed message id; used to skip channel history on first connect';

alter table public.city_telegram_sources enable row level security;

-- Seed: Улан-Удэ (inactive until team verifies access and legal)
insert into public.city_telegram_sources (city_id, source_key, source_type, is_active, notes, ingest_mode)
select c.id, v.source_key, v.source_type, false, v.notes, 'realtime'
from public.cities c
cross join (
  values
    ('in.ulanude', 'channel', 'Редакционная афиша INUU'),
    ('standup_uu', 'channel', 'Стендап Улан-Удэ (пример из брейншторма)'),
    ('baikalteatr', 'channel', 'Бурятский театр драмы — проверить @username'),
    ('artkvartal03', 'channel', 'Арт-квартал / культурные события — проверить @username'),
    ('ulan_ude_afisha', 'channel', 'Городская афиша — заменить на актуальный канал')
) as v(source_key, source_type, notes)
where c.slug = 'ulan-ude'
on conflict (city_id, source_key) do update
set
  source_type = excluded.source_type,
  notes = excluded.notes;
