-- Manager chat: editorial place reviews + story submissions

do $$
begin
  if exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'public' and t.typname = 'inuu_editorial_post_type'
  ) then
    alter type public.inuu_editorial_post_type add value if not exists 'venue_post';
  else
    create type public.inuu_editorial_post_type as enum (
      'news',
      'review',
      'guide',
      'announcement',
      'afisha_digest',
      'venue_post'
    );
  end if;
exception
  when duplicate_object then null;
end $$;

alter table public.editorial_posts
  add column if not exists linked_entity_type public.inuu_entity_type,
  add column if not exists linked_entity_id uuid,
  add column if not exists video_url text,
  add column if not exists media_urls jsonb not null default '[]'::jsonb,
  add column if not exists publication_date date;

create index if not exists idx_editorial_posts_linked_entity
  on public.editorial_posts (linked_entity_type, linked_entity_id)
  where linked_entity_id is not null and is_published = true;

comment on column public.content_submissions.kind is
  'event | news | venue_review | venue_post | story';
