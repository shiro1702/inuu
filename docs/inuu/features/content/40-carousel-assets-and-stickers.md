# Carousel Assets — шрифты, стикеры, пресеты

**Источник:** брейншторм [10.06.2026](../../../fix/brainstorm/10.06.2026.md).

**Связь:** [38-carousel-editor-saas.md](./38-carousel-editor-saas.md) · [39-carousel-canvas-architecture.md](./39-carousel-canvas-architecture.md) · [35-html-carousel-video-studio.md](./35-html-carousel-video-studio.md)

**Статус:** спека · волны **4b–4c**.

---

## Шрифтовые пары

### Уже в шаблонах (Tailwind / system stack)

| Template ID | Заголовок | Акценты | Фон |
|-------------|-----------|---------|-----|
| `minimal-ios`, `photo-card` | sans `font-bold` | — | vibe gradient |
| `editorial-bold` | `font-serif` bold | — | `#f4efe6` |
| `city-poster` | sans `font-black uppercase` | бейдж «Афиша» | vibe + white frame |
| `stockholm-calm` | sans `font-light` | `font-mono` «Issue» | `#F4F0EA` |
| `kyoto-tea` | `font-serif` light | `font-mono` «Zen spaces» | `#FAF9F6` |
| `parisian-atelier` | `font-serif` | `font-mono` «l'art de vivre» | `#FFFDF9` |
| `event-digest` | sans black uppercase | emoji pin + purple date badge | black overlay |

### План (волна 4c+, Google Fonts кириллица)

| Pack ID (план) | Заголовок | Текст | Вайб |
|----------------|-----------|-------|------|
| `cozy_aesthetic` | Cormorant Garamond | Montserrat / Onest | Кофейни, вино |
| `urban_brutal` | Unbounded / Bebas Neue | JetBrains Mono | Клубы, техно |
| `soft_minimal` | Manrope Bold | Inter | Семья, гастро |
| `classic_media` | Lora Bold | PT Sans | Подборки |

Подключение: `@nuxtjs/google-fonts` или self-host woff2 — **пока не подключено**, используется Tailwind `font-serif` / `font-sans` / `font-mono`.

---

## Storage: медиатека пресетов

```
carousel-presets/
  cities/       # виды города, архитектура, ночь
  vibes/
    romantic/
    party/
    family/
  places/
    restaurants/
    parks/
    malls/
```

Метаданные в таблице `carousel_preset_images`:

```sql
create table carousel_preset_images (
  id uuid primary key default gen_random_uuid(),
  city_id uuid references cities(id), -- null = глобальный
  folder text not null,
  storage_path text not null,
  tags text[] default '{}',
  vibe_slugs text[] default '{}'
);
```

UI: при выборе vibe «romantic» — 5 фонов из `presets/vibes/romantic`.

---

## Таблица стикеров

```sql
create table stickers (
  id uuid primary key default gen_random_uuid(),
  category text not null, -- navigation | ui | decor | thematic | emoji
  name text not null,
  description text,        -- для Groq matcher
  tags text[] default '{}',
  image_url text not null,
  is_vector boolean default false,
  accent_recolorable boolean default true,
  sort_order int default 0
);
```

### Категории UI

| category | Назначение | Примеры |
|----------|------------|---------|
| `navigation` | Листай дальше | стрелки, SWIPE, рука |
| `ui` | Бейджи | NEW, FREE, SOLD OUT, 18+ |
| `decor` | Тренд-декор | sparkles, washi tape, neon glow |
| `thematic` | Ниши | вино, винил, палитра, pin |
| `emoji` | Стилизованные | огонь, сердце, thumbs up |

---

## Каталог MVP (18 нейтральных стикеров)

Безликие иконки; **акцентный цвет** подставляется из theme / brand.

### Информационные

| name | tags | Описание |
|------|------|----------|
| `geo_pin` | location, map, venue | Капля-пин, силуэт здания, акцент в пине |
| `calendar` | date, schedule | Перекидной календарь, звезда на странице |
| `clock` | time, schedule | Циферблат без цифр, минутная стрелка — акцент |
| `tickets` | ticket, concert, cinema | Два скрещенных билета |
| `price_tag` | price, money | Ярлык с «₽» |

### Рубрикатор

| name | tags |
|------|------|
| `mic` | concert, music, karaoke |
| `masks` | theatre, comedy |
| `disco_ball` | party, club, dance |
| `clapperboard` | cinema, movie |
| `palette` | art, exhibition |
| `lightbulb` | lecture, business, workshop |
| `sneaker` | sport, run |
| `balloon` | kids, family |

### SMM / CTA

| name | tags |
|------|------|
| `fire` | hot, hype, popular |
| `bookmark` | save, favorite |
| `paper_plane` | share, repost |
| `exclamation` | important, alert |
| `coffee_cup` | weekend, brunch, cafe |

---

## Groq: описания для matcher

В system prompt передаём сжатый каталог:

```
Available sticker tags: geo_pin→[location,venue], fire→[hot,party], …
Pick up to 2 sticker_intents per slide with anchor hint.
```

Matcher (Nuxt server):

```ts
// tags from Groq intent → best sticker row by tag overlap
```

---

## UI: bottom sheet «Стикеры»

1. **ИИ рекомендует** (top row): 3 стикера по контексту слайда.
2. Поиск по `name` / `tags`.
3. Табы по `category`.
4. Tap → объект в центре холста, готов к drag.

Кнопка 🔁 на выбранном стикере → shuffle по тому же primary tag.

---

## Seed-план

| Этап | Объём |
|------|-------|
| MVP 4b | 18 SVG/PNG из каталога выше + 4 font packs |
| 4c | +15 navigation/ui (стрелки, SWIPE, speech bubbles) |
| Later | thematic packs по `city_content_tags` |

Формат: SVG preferred (`accent_recolorable=true`); fallback PNG @2x.

---

## Критерии готовности

- [ ] Migration `stickers` + `carousel_preset_images`
- [ ] Seed 18 стикеров в Storage + rows
- [ ] Seed 3 vibe folders × 5 images (Улан-Удэ)
- [ ] Font packs в theme CSS vars
- [ ] Editor: sticker sheet + AI recommendations row
- [ ] Groq sticker_intents → matcher e2e
