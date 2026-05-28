create table if not exists public.ai_parse_logs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  source_kind text not null,
  source_url text,
  source_external_id text,
  city_slug text,
  model text not null,
  status text not null, -- success | failed | persisted | persist_failed
  latency_ms integer,
  prompt_tokens integer,
  completion_tokens integer,
  total_tokens integer,
  confidence numeric(4,3),
  missing_fields_count integer,
  parse_attempts integer not null default 1,
  error_message text,
  payload jsonb not null default '{}'::jsonb
);

create index if not exists idx_ai_parse_logs_created_at
  on public.ai_parse_logs (created_at desc);

create index if not exists idx_ai_parse_logs_source
  on public.ai_parse_logs (source_kind, source_external_id);
