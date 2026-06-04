-- Обзор Baikal View: убрать stock-фото с подписью «Вид с террасы», показать place_embed места

update public.editorial_posts ep
set
  body_json = jsonb_build_array(
    jsonb_build_object(
      'type', 'paragraph',
      'text', 'Панорамная терраса с видом на закат — лучшее время для визита после 19:00.'
    ),
    jsonb_build_object('type', 'place_embed', 'venue_id', v.id)
  ),
  cover_media_url = coalesce(v.cover_media_url, ep.cover_media_url)
from public.cities c
join public.venues v on v.city_id = c.id and v.slug = 'baikal-view'
where ep.city_id = c.id
  and c.slug = 'ulan-ude'
  and ep.slug = 'baikal-view-review';
