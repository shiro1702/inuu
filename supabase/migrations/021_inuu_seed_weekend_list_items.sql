-- Seed items for «Куда сходить в выходные» (Улан-Удэ)

insert into public.curated_list_items (list_id, entity_type, entity_id, sort_order, note)
select l.id, 'venue', v.id, row.sort_order, row.note
from public.curated_lists l
join public.cities c on c.id = l.city_id and c.slug = 'ulan-ude'
join public.venues v on v.city_id = c.id
cross join (
  values
    ('art-kvartal', 10, 'Вечер в центре'),
    ('baikal-view', 20, 'На закат')
) as row(venue_slug, sort_order, note)
where l.slug = 'weekend' and v.slug = row.venue_slug
on conflict (list_id, entity_type, entity_id) do update
set sort_order = excluded.sort_order, note = excluded.note;

insert into public.curated_list_items (list_id, entity_type, entity_id, sort_order, note)
select l.id, 'event', e.id, 30, 'На выходные'
from public.curated_lists l
join public.cities c on c.id = l.city_id and c.slug = 'ulan-ude'
join public.events e on e.city_id = c.id and e.slug = 'jazz-evening'
where l.slug = 'weekend'
on conflict (list_id, entity_type, entity_id) do update
set sort_order = excluded.sort_order, note = excluded.note;
