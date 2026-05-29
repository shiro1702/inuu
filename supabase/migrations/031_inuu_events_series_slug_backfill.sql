-- Link already-published events with the same title in one city (legacy duplicates)

update public.events e
set series_slug = g.series_slug
from (
  select
    city_id,
    lower(trim(title)) as title_key,
    'legacy-' || substr(md5(city_id::text || lower(trim(title))), 1, 16) as series_slug
  from public.events
  where is_published = true
    and series_slug is null
  group by city_id, lower(trim(title))
  having count(*) > 1
) g
where e.city_id = g.city_id
  and lower(trim(e.title)) = g.title_key
  and e.is_published = true
  and e.series_slug is null;
