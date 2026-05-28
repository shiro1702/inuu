-- Link approved submissions to published entities

alter table public.content_submissions
  add column if not exists published_entity_type text,
  add column if not exists published_entity_id uuid;

create index if not exists idx_content_submissions_published_entity
  on public.content_submissions (published_entity_type, published_entity_id)
  where published_entity_id is not null;
