-- Content moderation queue (AI ingest + TG parser source)

create table if not exists public.content_submissions (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references public.cities(id) on delete cascade,
  kind text not null default 'event',
  status text not null default 'pending',
  payload jsonb not null default '{}'::jsonb,
  source_kind text,
  source_url text,
  source_external_id text,
  editorial_score smallint check (editorial_score is null or editorial_score between 1 and 5),
  reject_reason_code text,
  reject_comment text,
  moderation_chat_id text,
  moderation_message_id bigint,
  submitted_by_telegram_id bigint,
  reviewed_by_telegram_id bigint,
  reviewed_by_username text,
  reviewed_by_user_id uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_content_submissions_city_status_created
  on public.content_submissions (city_id, status, created_at desc);

create unique index if not exists idx_content_submissions_city_source_external
  on public.content_submissions (city_id, source_external_id)
  where source_external_id is not null and source_external_id <> '';

alter table public.content_submissions enable row level security;
