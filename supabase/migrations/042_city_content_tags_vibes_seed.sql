-- TASK-013: master vibe/tag taxonomy + tag_group column

alter table public.city_content_tags
  add column if not exists tag_group text not null default 'legacy';

insert into public.city_content_tags (city_id, slug, name, sort_order, tag_group)
select c.id, v.slug, v.name, v.sort_order, v.tag_group
from public.cities c
cross join (
  values
    ('food', '🍽️ Еда', 10, 'legacy'),
    ('culture', '🎭 Культура', 20, 'legacy'),
    ('family', '👨‍👩‍👧 Семья', 30, 'legacy'),
    ('nightlife', '🌙 Ночная жизнь', 40, 'legacy'),
    ('sport', '⚽ Спорт', 50, 'legacy'),
    ('beauty', '💅 Красота', 60, 'legacy'),
    ('tourism', '🧳 Туризм', 70, 'legacy'),
    ('city', '🏙️ Город', 80, 'legacy'),
    ('chill', '🛋️ Чилл / уютно', 100, 'vibes'),
    ('lampovo', '☕ Лампово', 101, 'vibes'),
    ('zen', '🧘‍♀️ Дзен / релакс', 102, 'vibes'),
    ('drive', '🪩 Разнос / драйв', 103, 'vibes'),
    ('loud', '🔊 Громко', 104, 'vibes'),
    ('active', '⚡ Актив', 105, 'vibes'),
    ('aesthetic', '📸 Инстаграмно', 106, 'vibes'),
    ('romance', '🕯️ Романтика', 107, 'vibes'),
    ('premium', '🎩 Премиум', 108, 'vibes'),
    ('underground', '⛓️ Андеграунд', 109, 'vibes'),
    ('speakeasy', '🤫 Спикизи / секретно', 110, 'vibes'),
    ('retro', '📼 Ретро / ностальгия', 111, 'vibes'),
    ('smart', '🧠 Культурно / умно', 112, 'vibes'),
    ('trash-fun', '🤪 Трэш / кринж', 113, 'vibes'),
    ('date', '🥂 На свидание', 200, 'audience'),
    ('friends', '👯‍♀️ С друзьями', 201, 'audience'),
    ('solo', '🎧 Одиночкам', 202, 'audience'),
    ('kids', '🧸 С детьми', 203, 'audience'),
    ('dog-friendly', '🐶 Дог-френдли', 204, 'audience'),
    ('networking', '👔 Нетворкинг', 205, 'audience'),
    ('free', '🤑 Бесплатно', 300, 'utility'),
    ('discount', '💸 Скидка / акция', 301, 'utility'),
    ('open-air', '🌳 Опен-эйр', 302, 'utility'),
    ('late-night', '🌙 Ночью (23:00+)', 303, 'utility'),
    ('new-venue', '🌟 Новое место', 304, 'utility'),
    ('invite-only', '👑 Закрытое / FC', 305, 'utility'),
    ('live-music', '🎸 Живая музыка', 400, 'format'),
    ('dj-set', '🎧 Диджей-сет', 401, 'format'),
    ('karaoke', '🎤 Караоке', 402, 'format'),
    ('open-mic', '🤡 Открытый микрофон', 403, 'format'),
    ('workshop', '🗣️ Мастер-класс / лекция', 404, 'format'),
    ('board-games', '🎲 Настолки / игры', 405, 'format'),
    ('cinema-bar', '🍿 Кинопоказ (не кинотеатр)', 406, 'format'),
    ('market', '🛍️ Маркет / ярмарка', 407, 'format'),
    ('cocktails', '🍹 Коктейли', 500, 'gastro'),
    ('craft-beer', '🍺 Крафт / пиво', 501, 'gastro'),
    ('wine', '🍷 Вино', 502, 'gastro'),
    ('brunch', '🍳 Завтраки / бранч', 503, 'gastro'),
    ('vegan', '🥑 Веган / ЗОЖ', 504, 'gastro'),
    ('street-food', '🍔 Стритфуд', 505, 'gastro'),
    ('grill', '🥩 Мясо / гриль', 506, 'gastro'),
    ('desserts', '🍰 Десерты / выпечка', 507, 'gastro'),
    ('fmt-place', '📍 Место', 600, 'content-format'),
    ('fmt-event', '📅 Событие', 601, 'content-format'),
    ('fmt-collection', '📚 Подборка', 602, 'content-format'),
    ('fmt-video', '📹 Видео-обзор', 603, 'content-format'),
    ('fmt-news', '⚡ Новость', 604, 'content-format'),
    ('fmt-giveaway', '🎁 Розыгрыш', 605, 'content-format')
) as v(slug, name, sort_order, tag_group)
where c.is_active = true
on conflict (city_id, slug) do update
set
  name = excluded.name,
  sort_order = excluded.sort_order,
  tag_group = excluded.tag_group;
