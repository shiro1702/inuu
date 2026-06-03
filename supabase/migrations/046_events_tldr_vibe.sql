-- TASK-005: TL;DR + vibe emoji на карточках событий

alter table public.events
  add column if not exists tldr text,
  add column if not exists vibe_emoji text;

comment on column public.events.tldr is
  'Короткий pitch для карточки (1–2 предложения), из Groq sanitize';
comment on column public.events.vibe_emoji is
  'До 3 emoji вайба для карточки (напр. 🎭🔥🍸)';
