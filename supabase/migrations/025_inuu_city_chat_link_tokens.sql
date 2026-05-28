create table if not exists public.city_chat_link_tokens (
  token uuid primary key default gen_random_uuid(),
  city_id uuid not null references public.cities(id) on delete cascade,
  channel text not null check (channel in ('telegram', 'max')),
  target text not null check (target in ('manager', 'moderation', 'parser_source')),
  created_by uuid references auth.users(id) on delete set null,
  expires_at timestamptz not null,
  used_at timestamptz,
  bound_chat_id text,
  created_at timestamptz not null default now()
);

create index if not exists idx_city_chat_link_tokens_city_channel_target
  on public.city_chat_link_tokens (city_id, channel, target);

create index if not exists idx_city_chat_link_tokens_expires
  on public.city_chat_link_tokens (expires_at);
