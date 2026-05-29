-- Digest batches: one parent submission + N item submissions per Telegram message

alter table public.content_submissions
  add column if not exists batch_id uuid references public.content_submissions(id) on delete cascade,
  add column if not exists batch_role text check (batch_role is null or batch_role in ('batch', 'item')),
  add column if not exists batch_index smallint;

create index if not exists idx_content_submissions_batch
  on public.content_submissions (batch_id, batch_index)
  where batch_id is not null;

comment on column public.content_submissions.batch_id is
  'Parent submission id for digest items; null on batch parent row';
comment on column public.content_submissions.batch_role is
  'batch = digest parent; item = single event within digest';
comment on column public.content_submissions.batch_index is
  'Order of event within digest batch (0-based)';
