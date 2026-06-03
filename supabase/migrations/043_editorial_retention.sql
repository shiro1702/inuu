-- Editorial retention: body_json, read later, scroll depth

alter table public.editorial_posts
  add column if not exists excerpt text,
  add column if not exists body_json jsonb,
  add column if not exists is_sponsored boolean not null default false,
  add column if not exists read_later_count int not null default 0;

create index if not exists idx_editorial_posts_body_json_gin
  on public.editorial_posts using gin (body_json jsonb_path_ops)
  where body_json is not null;

create table if not exists public.user_saved_editorial (
  user_id uuid not null references auth.users(id) on delete cascade,
  editorial_post_id uuid not null references public.editorial_posts(id) on delete cascade,
  saved_at timestamptz not null default now(),
  read_status text not null default 'saved'
    check (read_status in ('saved', 'reading', 'done')),
  primary key (user_id, editorial_post_id)
);

create index if not exists idx_user_saved_editorial_user_saved
  on public.user_saved_editorial (user_id, saved_at desc);

create table if not exists public.editorial_scroll_events (
  id uuid primary key default gen_random_uuid(),
  editorial_post_id uuid not null references public.editorial_posts(id) on delete cascade,
  city_id uuid not null references public.cities(id) on delete cascade,
  depth_percent smallint not null check (depth_percent in (50, 100)),
  user_id uuid references auth.users(id) on delete set null,
  session_key text,
  created_at timestamptz not null default now()
);

create index if not exists idx_editorial_scroll_post_depth
  on public.editorial_scroll_events (editorial_post_id, depth_percent, created_at desc);

alter table public.user_saved_editorial enable row level security;
alter table public.editorial_scroll_events enable row level security;

drop policy if exists user_saved_editorial_self on public.user_saved_editorial;
create policy user_saved_editorial_self on public.user_saved_editorial
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists editorial_scroll_events_service on public.editorial_scroll_events;
create policy editorial_scroll_events_service on public.editorial_scroll_events
  for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

drop policy if exists editorial_scroll_events_anon_insert on public.editorial_scroll_events;
create policy editorial_scroll_events_anon_insert on public.editorial_scroll_events
  for insert with check (true);
