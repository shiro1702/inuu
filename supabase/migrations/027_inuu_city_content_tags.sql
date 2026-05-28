-- Per-city content tags for events/news + editorial posts

create table if not exists public.city_content_tags (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references public.cities(id) on delete cascade,
  slug text not null,
  name text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (city_id, slug)
);

create index if not exists idx_city_content_tags_city_sort
  on public.city_content_tags (city_id, sort_order, name);

alter table public.editorial_posts
  add column if not exists topic_tags text[] not null default '{}';

alter table public.editorial_posts
  add column if not exists category_slug text;

alter table public.city_content_tags enable row level security;

drop policy if exists city_content_tags_public_read on public.city_content_tags;
create policy city_content_tags_public_read on public.city_content_tags
  for select using (true);

-- Seed default tags for active cities (matches legacy EVENT_PARSE_TAGS)
insert into public.city_content_tags (city_id, slug, name, sort_order)
select c.id, v.slug, v.name, v.sort_order
from public.cities c
cross join (
  values
    ('food', 'Еда', 10),
    ('culture', 'Культура', 20),
    ('family', 'Семья', 30),
    ('nightlife', 'Ночная жизнь', 40),
    ('sport', 'Спорт', 50),
    ('beauty', 'Красота', 60),
    ('tourism', 'Туризм', 70),
    ('city', 'Город', 80)
) as v(slug, name, sort_order)
where c.is_active = true
on conflict (city_id, slug) do update
set name = excluded.name, sort_order = excluded.sort_order;
