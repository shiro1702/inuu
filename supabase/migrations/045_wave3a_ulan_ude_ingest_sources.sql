-- TASK-004 (волна 3a): каталог ingest-источников Улан-Удэ + smoke web cron
-- TG: 12–20 каналов (часть active после проверки @ и подписки userbot)
-- Web: t.me/s/ зеркала + 2 cron_enabled для classifier/rules smoke

-- Деактивировать placeholder URL из 036
update public.city_web_sources w
set is_active = false, cron_enabled = false, notes = coalesce(w.notes, '') || ' [archived: placeholder]'
from public.cities c
where w.city_id = c.id
  and c.slug = 'ulan-ude'
  and w.url like 'https://example-%';

-- Telegram sources
insert into public.city_telegram_sources (
  city_id, source_key, source_type, is_active, notes, ingest_mode, context_type
)
select c.id, v.source_key, v.source_type, v.is_active, v.notes, 'realtime', v.context_type
from public.cities c
cross join (
  values
    ('kuda_poiti_uu', 'channel', true, 'Городская афиша (публичный)', 'general'),
    ('harats_uu', 'channel', true, 'Бар / вечеринки — пример из брейншторма 01.06', 'club'),
    ('standup_uu', 'channel', true, 'Стендап Улан-Удэ', 'standup'),
    ('in.ulanude', 'channel', true, 'Редакционная афиша INUU', 'general'),
    ('baikalteatr', 'channel', false, 'Бурятский театр — проверить @username', 'theater'),
    ('artkvartal03', 'channel', false, 'Арт-квартал — проверить @username', 'general'),
    ('ulanudeafisha', 'channel', false, 'Городская афиша — заменить на актуальный канал', 'general'),
    ('burdrama', 'channel', false, 'Театр драмы — проверить @', 'theater'),
    ('kultura03', 'channel', false, 'Культура Бурятии — проверить @', 'museum'),
    ('uu_nightlife', 'channel', false, 'Клубы / nightlife — проверить @', 'club'),
    ('uu_kids_events', 'channel', false, 'Детские события — проверить @', 'general'),
    ('openmic_uu', 'channel', false, 'Open mic — проверить @', 'standup'),
    ('uu_cinema', 'channel', false, 'Кино / показы — проверить @', 'cinema'),
    ('uu_library', 'channel', false, 'Библиотеки / лекции — проверить @', 'library'),
    ('baikal_fest', 'channel', false, 'Фестивали — проверить @', 'general'),
    ('muzei_uu', 'channel', false, 'Музеи — проверить @', 'museum'),
    ('comedy_uu', 'channel', false, 'Юмор / комедия — проверить @', 'standup'),
    ('uu_weekend', 'channel', false, 'Подборки выходных — проверить @', 'general')
) as v(source_key, source_type, is_active, notes, context_type)
where c.slug = 'ulan-ude'
on conflict (city_id, source_key) do update
set
  source_type = excluded.source_type,
  is_active = excluded.is_active,
  notes = excluded.notes,
  context_type = excluded.context_type,
  ingest_mode = excluded.ingest_mode;

-- Web sources (t.me/s HTML — см. 27-ingest-workers)
insert into public.city_web_sources (
  city_id, url, display_name, context_type, cron_enabled, is_active, notes
)
select c.id, v.url, v.display_name, v.context_type, v.cron_enabled, v.is_active, v.notes
from public.cities c
cross join (
  values
    ('https://t.me/s/kuda_poiti_uu', 'Куда пойти УУ (t.me/s)', 'general', true, true, 'Smoke cron + classifier (TASK-004)'),
    ('https://t.me/s/harats_uu', 'Harats (t.me/s)', 'club', true, true, 'Smoke cron (TASK-004)'),
    ('https://t.me/s/standup_uu', 'Стендап УУ (t.me/s)', 'standup', false, true, 'Включить cron после smoke'),
    ('https://t.me/s/in.ulanude', 'INUU афиша (t.me/s)', 'general', false, true, null),
    ('https://t.me/s/kultura03', 'Культура 03 (t.me/s)', 'museum', false, false, 'Проверить slug канала'),
    ('https://t.me/s/baikalteatr', 'Театр (t.me/s)', 'theater', false, false, 'Проверить slug канала')
) as v(url, display_name, context_type, cron_enabled, is_active, notes)
where c.slug = 'ulan-ude'
on conflict (city_id, url) do update
set
  display_name = excluded.display_name,
  context_type = excluded.context_type,
  cron_enabled = excluded.cron_enabled,
  is_active = excluded.is_active,
  notes = excluded.notes;

-- Smoke: ≥15 опубликованных событий на витрине (дополнение к 019)
insert into public.events (
  city_id, slug, title, description, excerpt, starts_at, ends_at, price, currency, is_published, is_promoted
)
select c.id, e.slug, e.title, e.description, e.excerpt, e.starts_at, e.ends_at, e.price, 'RUB', true, e.promoted
from public.cities c
cross join (
  values
    ('standup-friday-1', 'Стендап: открытый микрофон', 'Вечер юмора в баре', 'Короткий анонс для карточки', (now() + interval '4 days')::timestamptz, null::timestamptz, 500, false),
    ('quiz-saturday', 'Квиз «Знатоки УУ»', 'Командная игра', 'Квиз в субботу', (now() + interval '5 days')::timestamptz, null::timestamptz, 400, false),
    ('theater-premiere', 'Премьера спектакля', 'Драматический театр', 'Театральная премьера', (now() + interval '7 days')::timestamptz, null::timestamptz, 900, true),
    ('kids-art-studio', 'Мастер-класс для детей', 'Рисование и глина', 'Детям 6–12 лет', (now() + interval '8 days')::timestamptz, null::timestamptz, 0, false),
    ('live-jazz-2', 'Джаз на террасе', 'Живая музыка', 'Вечер джаза', (now() + interval '10 days')::timestamptz, null::timestamptz, 700, false),
    ('cinema-night', 'Кинопоказ в баре', 'Фильм + обсуждение', 'Кино с комментарием', (now() + interval '11 days')::timestamptz, null::timestamptz, 350, false),
    ('lecture-museum', 'Лекция в музее', 'История Бурятии', 'Публичная лекция', (now() + interval '12 days')::timestamptz, null::timestamptz, 0, false),
    ('open-air-market', 'Ярмарка ремёсел', 'Уличный маркет', 'На свежем воздухе', (now() + interval '14 days')::timestamptz, null::timestamptz, 0, false),
    ('poetry-evening', 'Поэтический вечер', 'Читки и музыка', 'Акустика', (now() + interval '16 days')::timestamptz, null::timestamptz, 300, false),
    ('dance-party', 'Вечеринка: house night', 'DJ set', 'Танцы до утра', (now() + interval '18 days')::timestamptz, null::timestamptz, 600, true),
    ('board-games', 'Настольные игры', 'Клуб настолок', 'Вход свободный', (now() + interval '20 days')::timestamptz, null::timestamptz, 200, false),
    ('photo-walk', 'Фотовылазка', 'Городской маршрут', 'С гидом', (now() + interval '22 days')::timestamptz, null::timestamptz, 0, false),
    ('comedy-show', 'Comedy night', 'Стендап-шоу', 'Несколько комиков', (now() + interval '25 days')::timestamptz, null::timestamptz, 800, true)
) as e(slug, title, description, excerpt, starts_at, ends_at, price, promoted)
where c.slug = 'ulan-ude'
on conflict (city_id, slug) do update
set
  title = excluded.title,
  description = excluded.description,
  excerpt = excluded.excerpt,
  starts_at = excluded.starts_at,
  is_published = true;
