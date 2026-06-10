# Carousel Editor SaaS — mobile-first студия контента

**Источник:** брейншторм [10.06.2026](../../../fix/brainstorm/10.06.2026.md).

**Связь:** [35-html-carousel-video-studio.md](./35-html-carousel-video-studio.md) (PNG MVP, волна 3d) · [34-groq-editorial-content-multiplier.md](./34-groq-editorial-content-multiplier.md) · [39-carousel-canvas-architecture.md](./39-carousel-canvas-architecture.md) · [40-carousel-assets-and-stickers.md](./40-carousel-assets-and-stickers.md)

**Статус:** спека · волны **4a–4d** (после 3e). **База 3d уже в коде** — см. [35](./35-html-carousel-video-studio.md#статус-реализации-аудит-кода-10062026).

---

## Уже в коде (волна 3d + studio)

| Фича | Реализация |
|------|------------|
| **8 style packs** (cover/body/outro) | `minimal-ios`, `photo-card`, `editorial-bold`, `city-poster`, `stockholm-calm`, `kyoto-tea`, `parisian-atelier`, `event-digest` — [35](./35-html-carousel-video-studio.md) |
| **6 vibe-градиентов** | `party`, `nightlife`, `romance`, `underground`, `vegan`, `tourism` |
| **Carousel Studio** | `/dashboard/carousel-studio` — ручной редактор, превью, PNG export |
| **Источники** | вручную · события (чекбоксы + vibe-фильтр) · подборка · статья · черновик заявки |
| **Сборка подборки** | `buildCarouselFromEvents` — **без Groq** (даты, цена, tldr из БД) |
| **Groq multiplier** | текст `instagram_carousel` → `parseInstagramCarousel` (не structured JSON) |
| **Публикация** | `metadata.carousel` на `editorial_posts` + свайп на `/guides/[slug]` |
| **Stories** | Story Studio reuses `CarouselSlideRenderer` @ 9:16 |

**Ещё не в коде:** share link, Pinia persist, mobile IG UX, стикеры, Groq JSON generate, TG send, `user_templates`, flow/absolute canvas.

---

## Продуктовая цель

Превратить экспорт PNG (3d) в **рабочий инструмент SMM** для менеджеров и партнёров:

- вставил текст / выбрал события → **готовая карусель за секунды** (Groq);
- поправил на телефоне (как Instagram Stories);
- скачал PNG / отправил в TG / поделился ссылкой на доработку.

---

## Типы проекта

| Тип | Слайдов | Aspect по умолчанию | Use case |
|-----|---------|---------------------|----------|
| **carousel** | 3–7 | `4:5` | Подборки, гайды, лонгриды |
| **post** | 1 | `1:1` | Быстрый анонс в ленту |
| **story** / **poster** | 1 | `9:16` | Афиша, Stories, вертикальный плакат |
| **cover** | 1 | `16:9` | YouTube / превью статьи |

Технически афиша — карусель из одного слайда с плотной компоновкой.

---

## Три роли слайда + style packs

Каждый **theme pack** задаёт три разных HTML-шаблона:

| Роль | `type` | Задача |
|------|--------|--------|
| Обложка | `first` | Название, категория, вайб, яркое фото |
| Контент | `middle` | Читаемость: сетка, плашка под текст |
| CTA | `last` | QR, deep link, «Забронировать», минимум текста |

### Style packs (dropdown) — **уже 8 шт. в коде**

См. полную таблицу в [35](./35-html-carousel-video-studio.md#библиотека-шаблонов-реализовано-в-коде).

| ID (код) | Ближайший вайб из брейншторма 10.06 |
|----------|-------------------------------------|
| `minimal-ios`, `photo-card` | Универсальный / party |
| `editorial-bold`, `parisian-atelier`, `stockholm-calm`, `kyoto-tea` | Cozy Aesthetic |
| `city-poster`, `event-digest` | Urban / афиша / nightlife |
| `minimal-ios` + vibe `underground` | Neon / Tech (через gradient, не отдельный pack) |

**Волна 4a:** не дублировать 3 новых pack — расширять существующие или добавить `acid-brutal` только если нужен отдельный визуал.

---

## Mobile UX (Instagram-first)

Референс: Stories editor. **Без боковых панелей.**

### Анатомия экрана

```
[←]  Проект          [Стили] [💾]
─────────────────────────────────
         [  ХОЛСТ 9:16 / 4:5  ]
─────────────────────────────────
[ 🤖 ИИ ]  [ 🎨 Цвета ]
─────────────────────────────────
[ Текст ] [ Стикеры ] [ Шаблоны ]
```

### Паттерны

| Действие | Поведение |
|----------|-----------|
| Свайп слайдов | Кнопки ⬅️ 50% / ➡️ 50% под превью |
| Редактировать слайд | 100% кнопка → bottom sheet с полями слайда |
| Редактировать все | Accordion всех слайдов |
| Стикер | Drag одним пальцем; pinch+rotate двумя; корзина 🗑 внизу при drag |
| Привязка к тексту | Haptic + glow вокруг flow-блока при snap |
| Слои | Контекстное меню: «На задний / передний план» (без ввода z-index) |
| Текст | Double-tap → фокус-режим над клавиатурой (как IG) |
| Groq | Bottom sheet «Опиши событие» + quick prompts (концерт / пиццерия / лекция) |

**Старт:** AI генерирует весь макет → пользователь дорабатывает детали (гибрид вариантов 1+2 из брейншторма).

---

## Groq-пайплайны

### 1. Сырой текст → карусель

Вход: текст или URL (через существующий enricher).

Системный промпт: вернуть JSON:

```json
{
  "carousel_title": "…",
  "theme": "cozy_aesthetic",
  "slides": [
    {
      "type": "first",
      "title": "…",
      "subtitle": "…",
      "image_tags": ["city sunset"]
    },
    {
      "type": "middle",
      "title": "…",
      "text": "…",
      "badge": "Пятница, 19:00",
      "image_tags": ["wine glass"]
    },
    {
      "type": "last",
      "title": "…",
      "cta_text": "Открыть в боте",
      "image_tags": ["qr code"]
    }
  ]
}
```

После ответа: **image matcher** подставляет фоны (см. ниже).

### 2. Подборка из событий БД

Менеджер отмечает 3–5 `events` / `editorial_posts` → Groq сжимает тексты под слайды + общий заголовок обложки.

### 3. Подборка из «текста-каши»

Один пост из TG-конкурента → Groq парсит N событий + упаковывает в carousel JSON.

### 4. Афиша (1 слайд)

Промпт с приоритетами: category → title → date_time → location → description (≤60 симв.) → badge.

Опционально в том же ответе:

```json
{
  "canvas_data": { "…": "…" },
  "telegram_post_text": "🔥 *Заголовок*\\n\\n…"
}
```

### 5. Groq + пользовательский шаблон

**Подход A — semantic roles** на текстовых блоках: `title`, `date_time`, `location`, `price`, `description`, `cta`.

**Подход B — blind JSON copy:** передать весь `layout_config` шаблона + новый текст; Groq меняет только `content`, не трогая координаты.

**Default:** B; роли — для шаблонов «с нуля» и плейсхолдеров `[Здесь будет дата]`.

### 6. Автоподбор стикеров

Groq возвращает намерения:

```json
{
  "sticker_intents": [
    { "tag": "fire", "anchor": "flow", "anchor_target": "title", "position_hint": "top-right" }
  ]
}
```

Matcher: `stickers` table по тегам → [40](./40-carousel-assets-and-stickers.md).

---

## Автоподбор картинок (`image_tags`)

| Приоритет | Источник |
|-----------|----------|
| A | Обложки выбранных событий из БД |
| B | Supabase Storage `presets/{cities,vibes,places}/` с тегами |
| C | Unsplash / Pexels API (опционально) |

---

## Персистентность и шаринг

### Local / session

- `pinia-plugin-persistedstate` — черновик редактора.
- Бренд партнёра (цвета, лого) из `profiles` / venue при авторизации.

### Shareable projects

```sql
create table generated_carousels (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  created_by uuid references auth.users(id),
  city_id uuid references cities(id),
  title text,
  project_type text, -- carousel | post | story | cover
  theme_id text,
  aspect text,
  settings jsonb,
  slides jsonb
);
```

URL: `/dashboard/carousel/edit/[id]` или Mini App route.

Кнопка «🔗 Поделиться» → save → copy link.

### Пользовательские шаблоны

```sql
create table user_templates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  city_id uuid,
  name text not null,
  preview_url text,
  theme_id text,
  project_type text,
  layout_config jsonb not null
);
```

`layout_config`: `global_styles`, `slide_templates.first|middle|last` с `fixed_objects`, `text_styles`.

UI: «💾 Сохранить как шаблон» + список «Мои шаблоны → Применить».

---

## Доставка в Telegram

| Роль | Куда | Формат |
|------|------|--------|
| partner | ЛС с ботом | media group PNG + caption |
| manager | moderation chat города | media group + кнопки approve |

**Не отправлять напрямую** — запись в `telegram_queue`, worker ≤25 msg/s.

См. мультибот: B2C bot / moderation bot / org notifications bot — лимиты не пересекаются.

Кнопка рядом с «Скачать PNG»: **«Отправить в TG»** (dropdown: ЛС / чат модераторов).

---

## Интеграция с существующим кодом (3d)

| Уже есть | Расширяем |
|----------|-----------|
| `components/editorial/carousel/` | + editor mode, + style packs |
| `metadata.carousel` на `editorial_posts` | + `generated_carousels` для черновиков |
| `html-to-image` export | без изменений |
| `parseInstagramCarousel.ts` | reuse для Groq output |
| Story Studio 9:16 | тот же renderer, `project_type=story` |

---

## Критерии готовности по волнам

### 4a (фундамент)

- [ ] `generated_carousels` migration + API CRUD
- [ ] Share link load/save
- [ ] Pinia persist черновика
- [ ] 3 theme packs × 3 slide types
- [ ] Mobile preview: swipe + edit slide sheet

### 4b (AI + медиа)

- [ ] Groq raw text → carousel
- [ ] Подборка: events checkbox + text mash
- [ ] `image_tags` matcher (storage presets)
- [ ] Preset folders seed в Storage

### 4c (продвинутый холст)

- [ ] Flow + absolute canvas ([39](./39-carousel-canvas-architecture.md))
- [ ] `user_templates` save/apply
- [ ] Groq template fill (roles + blind copy)
- [ ] Sticker library UI + drag on canvas

### 4d (форматы + TG)

- [ ] Poster 9:16 / post 1:1 из того же редактора
- [ ] `telegram_post_text` + copy button
- [ ] TG send + queue worker
- [ ] Groq sticker intents + matcher

---

## Связанные документы

- [19-organizer-lk-monetization.md](./19-organizer-lk-monetization.md) — B2B шаблонные афиши (пересечение с `user_templates`)
- [36-bot-vibes-editorial-delivery.md](./36-bot-vibes-editorial-delivery.md) — доставка готовых каруселей подписчикам
- [07-notifications-channels.md](../../07-notifications-channels.md) — каналы уведомлений
