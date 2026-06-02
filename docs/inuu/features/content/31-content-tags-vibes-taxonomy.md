# Теги и вайбы: единая таксономия контента

**Источник:** брейншторм [02.05.2026](../../../fix/brainstorm/02.05.2026.md) (диалог 01–02.06.2026).  
**Связано:** [12-afisha-tag-subscriptions.md](./12-afisha-tag-subscriptions.md), [16-parsing-pipeline-extensions.md](./16-parsing-pipeline-extensions.md), [25-groq-event-extraction-prompt.md](./25-groq-event-extraction-prompt.md), [verticals/events-and-venues.md](../../verticals/events-and-venues.md).

---

## Модель (категории ≠ теги)

| Слой | Вопрос | Хранение | Сколько |
|------|--------|----------|---------|
| **Категория** | «Что это?» | `event_categories.slug` → `events.category_slug` | **1** (редко 2) |
| **Теги / вайбы** | «Как там?», «для кого?», «на каких условиях?» | `city_content_tags` + `events.source_metadata.topic_tags`, `editorial_posts.topic_tags`, `curated_lists` (расширить) | **1–5** |

Технически **вайбы — подмножество тегов** в одном массиве `topic_tags` / словаре `city_content_tags`. В UI не разделяем «тег» и «вайб» — только chip с эмодзи.

Groq: «выбери **одну** категорию из списка категорий и **до пяти** тегов из мастер-списка».

---

## Мастер-список тегов (seed + промпт Groq)

`slug` — латиница для БД и URL `/tag/[slug]`; `name` — отображение **с эмодзи** в UI.

### 1. Вайбы и атмосфера

| slug | name |
|------|------|
| `chill` | 🛋️ Чилл / уютно |
| `lampovo` | ☕ Лампово |
| `zen` | 🧘‍♀️ Дзен / релакс |
| `drive` | 🪩 Разнос / драйв |
| `loud` | 🔊 Громко |
| `active` | ⚡ Актив |
| `aesthetic` | 📸 Инстаграмно |
| `romance` | 🕯️ Романтика |
| `premium` | 🎩 Премиум |
| `underground` | ⛓️ Андеграунд |
| `speakeasy` | 🤫 Спикизи / секретно |
| `retro` | 📼 Ретро / ностальгия |
| `smart` | 🧠 Культурно / умно |
| `trash-fun` | 🤪 Трэш / кринж |

### 2. Аудитория

| slug | name |
|------|------|
| `date` | 🥂 На свидание |
| `friends` | 👯‍♀️ С друзьями |
| `solo` | 🎧 Одиночкам |
| `kids` | 🧸 С детьми |
| `dog-friendly` | 🐶 Дог-френдли |
| `networking` | 👔 Нетворкинг |

### 3. Утилитарные

| slug | name |
|------|------|
| `free` | 🤑 Бесплатно |
| `discount` | 💸 Скидка / акция |
| `open-air` | 🌳 Опен-эйр |
| `late-night` | 🌙 Ночью (23:00+) |
| `new-venue` | 🌟 Новое место |
| `invite-only` | 👑 Закрытое / FC |

### 4. Уточнение формата (на площадке)

| slug | name |
|------|------|
| `live-music` | 🎸 Живая музыка |
| `dj-set` | 🎧 Диджей-сет |
| `karaoke` | 🎤 Караоке |
| `open-mic` | 🤡 Открытый микрофон |
| `workshop` | 🗣️ Мастер-класс / лекция |
| `board-games` | 🎲 Настолки / игры |
| `cinema-bar` | 🍿 Кинопоказ (не кинотеатр) |
| `market` | 🛍️ Маркет / ярмарка |

### 5. Гастрономия (места и food-обзоры)

| slug | name |
|------|------|
| `cocktails` | 🍹 Коктейли |
| `craft-beer` | 🍺 Крафт / пиво |
| `wine` | 🍷 Вино |
| `brunch` | 🍳 Завтраки / бранч |
| `vegan` | 🥑 Веган / ЗОЖ |
| `street-food` | 🍔 Стритфуд |
| `grill` | 🥩 Мясо / гриль |
| `desserts` | 🍰 Десерты / выпечка |

### 6. Теги формата контента (для смешанной ленты)

Не путать с категорией события. Один на карточку + вайбы.

| slug | name |
|------|------|
| `fmt-place` | 📍 Место |
| `fmt-event` | 📅 Событие |
| `fmt-collection` | 📚 Подборка |
| `fmt-video` | 📹 Видео-обзор |
| `fmt-news` | ⚡ Новость |
| `fmt-giveaway` | 🎁 Розыгрыш |

### 7. Legacy / тематика (оставить из seed 027)

Сохраняем для обратной совместимости подписок и парсера:

`food`, `culture`, `family`, `nightlife`, `sport`, `beauty`, `tourism`, `city`

Новые вайбы **дополняют**, не заменяют legacy до миграции подписок.

---

## Где вешать теги

| Сущность | Поле | Groq при создании |
|----------|------|-------------------|
| `events` | `source_metadata.topic_tags` | parse-event / санитар |
| `editorial_posts` | `topic_tags` | manager chat, dashboard |
| `curated_lists` | `topic_tags` (добавить) | cron дайджест + `/pick` |
| `story_campaigns` / slides | `topic_tags` на кампании | manager «сториз» |
| `venues` | `vibe_tags` (отдельное поле, синхрон с тегами — опционально) | обзор места |

**Цель:** фильтр [ 🕯️ Романтика ] показывает события, места, подборки, видео и новости с этим тегом.

---

## UI

- Горизонтальный скролл **быстрых фильтров** под stories (вайбы + утилита; не все 50 сразу — топ по городу + персонализация).
- Chip: `name` из БД уже с эмодзи; fallback — словарь Nuxt по `slug`.
- Категории — крупная навигация (нижнее меню / плашки), теги — эмоциональный слой сверху.

---

## Реализация (волна)

1. Миграция seed `city_content_tags` для Улан-Удэ (группы `sort_order`: вайбы 100+, аудитория 200+, …).
2. `EVENT_PARSE_TAGS` / `eventParsePrompt` — мастер-список slug'ов, `resolveParsedTaxonomy` не отбрасывает новые slug'и.
3. Groq: категория + до 5 тегов; `new_tags` на модерацию — только если slug вне whitelist (как в [16](./16-parsing-pipeline-extensions.md)).
4. Публичная лента: OR-фильтр по `topic_tags` на events + editorial + lists (этап 2).
5. Dashboard: группы тегов, emoji в `name`, CRUD.

**Out of scope этой спеки:** рилс-лента TikTok, сезонные CSS-темы, last-minute deals — см. матрицу §11–13.

---

## Критерии готовности MVP таксономии

- [ ] В БД ≥40 тегов из мастер-списка для активного города.
- [ ] Groq возвращает только slug из whitelist (или `new_tags` в moderation).
- [ ] Афиша: фильтр по новым тегам работает (`?tag=romance`).
- [ ] Документ в промпте и runbook менеджера синхронизированы.
