-- topic_tags on curated lists (wave 3c / TASK-022)

alter table public.curated_lists
  add column if not exists topic_tags text[] not null default '{}';

create index if not exists idx_curated_lists_topic_tags
  on public.curated_lists using gin (topic_tags);
