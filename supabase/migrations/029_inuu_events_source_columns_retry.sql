-- Ensure events source tracking columns exist (migration 022 may be missing on remote)

alter table public.events
  add column if not exists source_channel text,
  add column if not exists source_telegram_message_id bigint,
  add column if not exists source_metadata jsonb not null default '{}'::jsonb;

create unique index if not exists idx_events_city_tg_message
  on public.events (city_id, source_telegram_message_id)
  where source_telegram_message_id is not null;
