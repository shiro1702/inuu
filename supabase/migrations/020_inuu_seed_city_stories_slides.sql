-- Seed: слайды для городских сторис (без слайдов кампании не показываются на главной)

-- 1) Слайды для кампании из 019_inuu_seed_ulan_ude.sql
insert into public.story_slides (campaign_id, sort_order, media_url, duration_seconds, action_type, action_payload)
select sc.id, v.sort_order, v.media_url, v.duration_seconds, v.action_type, v.action_payload::jsonb
from public.story_campaigns sc
join public.cities c on c.id = sc.city_id
cross join (
  values
    (
      0,
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=900&q=80',
      6,
      'none',
      '{"title":"INUU Улан-Удэ","text":"Афиша, места и подборки — всё в одном городском гиде."}'
    ),
    (
      1,
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=80',
      6,
      'open_event',
      '{"eventSlug":"jazz-evening","buttonLabel":"Джазовый вечер"}'
    ),
    (
      2,
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=900&q=80',
      5,
      'open_venue',
      '{"venueSlug":"art-kvartal","buttonLabel":"Арт-квартал"}'
    )
) as v(sort_order, media_url, duration_seconds, action_type, action_payload)
where c.slug = 'ulan-ude'
  and sc.title = 'INUU Улан-Удэ'
  and sc.placement = 'top_bar'
  and not exists (
    select 1 from public.story_slides ss where ss.campaign_id = sc.id
  );

update public.story_campaigns sc
set preview_url = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80'
from public.cities c
where sc.city_id = c.id
  and c.slug = 'ulan-ude'
  and sc.title = 'INUU Улан-Удэ'
  and sc.preview_url is null;

-- 2) Дополнительные кампании для ленты на главной
insert into public.story_campaigns (city_id, shop_id, author_type, title, preview_url, placement, is_active)
select c.id, s.id, 'editorial', v.title, v.preview_url, v.placement, true
from public.cities c
join public.shops s on s.city_id = c.id and s.slug = 'inuu-editorial'
cross join (
  values
    (
      'Джаз на этой неделе',
      'https://images.unsplash.com/photo-1415201364774-f6f0ff26a1d0?auto=format&fit=crop&w=400&q=80',
      'top_bar'
    ),
    (
      'Baikal View',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400&q=80',
      'home_hero'
    ),
    (
      'Куда с детьми',
      'https://images.unsplash.com/photo-1503454537845-7317a7f6b373?auto=format&fit=crop&w=400&q=80',
      'top_bar'
    )
) as v(title, preview_url, placement)
where c.slug = 'ulan-ude'
  and not exists (
    select 1
    from public.story_campaigns sc
    where sc.city_id = c.id and sc.title = v.title
  );

-- Слайды: «Джаз на этой неделе»
insert into public.story_slides (campaign_id, sort_order, media_url, duration_seconds, action_type, action_payload)
select sc.id, v.sort_order, v.media_url, v.duration_seconds, v.action_type, v.action_payload::jsonb
from public.story_campaigns sc
join public.cities c on c.id = sc.city_id
cross join (
  values
    (
      0,
      'https://images.unsplash.com/photo-1415201364774-f6f0ff26a1d0?auto=format&fit=crop&w=900&q=80',
      5,
      'none',
      '{"title":"Джазовый вечер","text":"Живая музыка и бар — в эту пятницу."}'
    ),
    (
      1,
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=900&q=80',
      6,
      'open_event',
      '{"eventSlug":"jazz-evening","buttonLabel":"Записаться на афишу"}'
    )
) as v(sort_order, media_url, duration_seconds, action_type, action_payload)
where c.slug = 'ulan-ude'
  and sc.title = 'Джаз на этой неделе'
  and not exists (select 1 from public.story_slides ss where ss.campaign_id = sc.id);

-- Слайды: «Baikal View»
insert into public.story_slides (campaign_id, sort_order, media_url, duration_seconds, action_type, action_payload)
select sc.id, v.sort_order, v.media_url, v.duration_seconds, v.action_type, v.action_payload::jsonb
from public.story_campaigns sc
join public.cities c on c.id = sc.city_id
cross join (
  values
    (
      0,
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=80',
      6,
      'none',
      '{"title":"Панорамная терраса","text":"Лучший вид на закат у Байкала."}'
    ),
    (
      1,
      'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=900&q=80',
      5,
      'open_venue',
      '{"venueSlug":"baikal-view","buttonLabel":"Открыть место"}'
    )
) as v(sort_order, media_url, duration_seconds, action_type, action_payload)
where c.slug = 'ulan-ude'
  and sc.title = 'Baikal View'
  and not exists (select 1 from public.story_slides ss where ss.campaign_id = sc.id);

-- Слайды: «Куда с детьми»
insert into public.story_slides (campaign_id, sort_order, media_url, duration_seconds, action_type, action_payload)
select sc.id, v.sort_order, v.media_url, v.duration_seconds, v.action_type, v.action_payload::jsonb
from public.story_campaigns sc
join public.cities c on c.id = sc.city_id
cross join (
  values
    (
      0,
      'https://images.unsplash.com/photo-1503454537845-7317a7f6b373?auto=format&fit=crop&w=900&q=80',
      5,
      'none',
      '{"title":"Мастер-класс для детей","text":"Творческая студия в субботу — бесплатно."}'
    ),
    (
      1,
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80',
      6,
      'open_event',
      '{"eventSlug":"kids-workshop","buttonLabel":"Событие для детей"}'
    )
) as v(sort_order, media_url, duration_seconds, action_type, action_payload)
where c.slug = 'ulan-ude'
  and sc.title = 'Куда с детьми'
  and not exists (select 1 from public.story_slides ss where ss.campaign_id = sc.id);
