-- Editorial carousel / story draft metadata (wave 3d)

alter table public.editorial_posts
  add column if not exists metadata jsonb not null default '{}'::jsonb;

comment on column public.editorial_posts.metadata is
  'carousel slides JSON, story_draft, etc. (see docs/inuu/features/content/35-html-carousel-video-studio.md)';
