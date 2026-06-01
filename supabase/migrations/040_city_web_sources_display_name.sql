alter table public.city_web_sources
  add column if not exists display_name text;

comment on column public.city_web_sources.display_name is
  'Человекочитаемое название источника (канал, площадка) для UI и теневой org';
