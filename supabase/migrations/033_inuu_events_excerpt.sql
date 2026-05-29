-- Short text for event cards in lists (full text stays in description)

alter table public.events
  add column if not exists excerpt text;

comment on column public.events.excerpt is
  'Short teaser for list cards; description holds full text on detail page';
