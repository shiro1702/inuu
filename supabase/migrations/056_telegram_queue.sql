-- Telegram outbound queue for carousel albums (wave 4d)

create table if not exists public.telegram_queue (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  status text not null default 'pending',
  bot_kind text not null default 'moderation',
  chat_id text not null,
  payload jsonb not null default '{}'::jsonb,
  attempts int not null default 0,
  last_error text,
  sent_at timestamptz
);

create index if not exists idx_telegram_queue_status on public.telegram_queue (status, created_at);

alter table public.telegram_queue enable row level security;

drop policy if exists telegram_queue_service on public.telegram_queue;
create policy telegram_queue_service on public.telegram_queue for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
