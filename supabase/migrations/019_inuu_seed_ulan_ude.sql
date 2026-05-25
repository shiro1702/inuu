-- Seed: Улан-Удэ + базовые категории афиши

insert into public.cities (name, slug, timezone, editorial_name, is_active)
values ('Улан-Удэ', 'ulan-ude', 'Asia/Irkutsk', 'INUU Улан-Удэ', true)
on conflict (slug) do update
set
  name = excluded.name,
  timezone = excluded.timezone,
  editorial_name = excluded.editorial_name,
  is_active = excluded.is_active;

insert into public.event_categories (city_id, slug, name, sort_order)
select c.id, v.slug, v.name, v.sort_order
from public.cities c
cross join (
  values
    ('concerts', 'Концерты', 10),
    ('parties', 'Вечеринки', 20),
    ('masterclass', 'Мастер-классы', 30),
    ('exhibitions', 'Выставки', 40),
    ('kids', 'Детям', 50),
    ('outdoor', 'На природе', 60)
) as v(slug, name, sort_order)
where c.slug = 'ulan-ude'
on conflict (city_id, slug) do update
set name = excluded.name, sort_order = excluded.sort_order;

-- Platform editorial organization (optional dashboard)
insert into public.shops (city_id, slug, name, org_type, is_active)
select c.id, 'inuu-editorial', 'INUU Редакция', 'editorial', true
from public.cities c
where c.slug = 'ulan-ude'
on conflict (city_id, slug) do update
set name = excluded.name, org_type = excluded.org_type, is_active = excluded.is_active;

insert into public.shop_feature_subscriptions (shop_id, feature_code, enabled, source)
select s.id, f.code, true, 'seed'
from public.shops s
cross join public.feature_catalog f
where s.slug = 'inuu-editorial'
  and f.code in ('inuu_city_listing', 'inuu_events', 'inuu_editorial_stories', 'inuu_reputation')
on conflict (shop_id, feature_code) do update set enabled = true;
