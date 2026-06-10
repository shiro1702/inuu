# Карусели — модель данных

## БД: `generated_carousels`

```sql
id            uuid PK
created_at    timestamptz
updated_at    timestamptz
created_by    uuid → auth.users
city_id       uuid → cities
title         text
project_type  text   -- carousel | post | story | cover
theme_id      text   -- minimal-ios, photo-card, …
aspect        text   -- 4:5, 9:16, 1:1, 16:9
settings      jsonb  -- vibe_key, link_hint, brand_name, telegram_post_text, …
slides        jsonb  -- CarouselSlide[]
```

`settings` типизирован как `GeneratedCarouselSettings` в `server/utils/generatedCarouselWrite.ts`.

---

## Поля события (event-digest)

| Поле | UI | Groq JSON |
|------|-----|-----------|
| `event_datetime` | Фиолетовый бейдж | `event_datetime` |
| `event_venue` | 📍 + CTA «Подробнее у …» | `event_venue` |
| `event_price` | Белый бейдж цены | `event_price` |
| `bullets[]` | Только тезис | `text` |

Старые слайды без полей — fallback через разбор `bullets`.

---

## Слайд: schema v1 (legacy)

```typescript
{
  schema_version?: 1,
  role: 'cover' | 'body' | 'outro',
  title?: string,
  event_datetime?: string | null,
  event_venue?: string | null,
  event_price?: string | null,
  bullets?: string[],
  media_url?: string | null,
  cta_text?: string,
  gradient?: string,
  image_tags?: string[]
}
```

Рендер: `CarouselSlideRenderer` + `slideV2ToV1()` при необходимости.

Адаптер v1→v2: `utils/carouselSlideAdapter.ts` → `normalizeSlideToV2()`.

---

## Слайд: schema v2 (canvas)

```typescript
{
  schema_version: 2,
  role: 'cover' | 'body' | 'outro',
  type?: 'first' | 'middle' | 'last',
  title?: string,
  bullets?: string[],
  media_url?: string | null,
  cta_text?: string,
  gradient?: string,
  background?: {
    type: 'image' | 'gradient',
    url?: string | null,
    overlay?: string
  },
  flow?: CarouselFlowBlock[],
  objects?: CarouselCanvasObject[]
}
```

### Flow block

```typescript
{
  id: string,           // 'title', 'bullet_0', 'hero', …
  kind: 'text' | 'media',
  role?: string,        // title, description, cta, hero_image
  content?: string,
  url?: string | null,
  layout?: string
}
```

### Canvas object (стикер / текст / лого)

```typescript
{
  id: string,
  kind: 'sticker' | 'text' | 'logo',
  sticker_id?: string,
  image_url?: string,
  content?: string,
  anchor: 'canvas' | 'flow',
  anchor_target?: string,  // flow[].id при anchor=flow
  x: number,               // 0–100, % от якоря или холста
  y: number,
  scale?: number,
  rotation?: number,
  zIndex?: number
}
```

Детальная архитектура: [39-carousel-canvas-architecture.md](../39-carousel-canvas-architecture.md).

---

## Virtual / export sizes

Канон: `types/editorialCarousel.ts`

| Aspect | Export (PNG) | Virtual (internal) |
|--------|--------------|-------------------|
| `1:1` | 1080×1080 | 1000×1000 |
| `4:5` | 1080×1350 | 1000×1250 |
| `9:16` | 1080×1920 | 1000×1778 |
| `16:9` | 1920×1080 | 1778×1000 |

Координаты стикеров хранятся в **virtual/export space** (проценты 0–100), preview и PNG согласованы.

---

## Editorial metadata

Опубликованная карусель в статье:

```typescript
// editorial_posts.metadata
{
  carousel: {
    template_id: CarouselTemplateId,
    aspect: CarouselAspect,
    slides: CarouselSlide[]
  }
}
```

Тип: `EditorialCarouselMetadata` в `types/editorialCarousel.ts`.

API записи: `server/api/dashboard/manager/cities/[slug]/editorial-news/[id]/carousel.put.ts`.

---

## Связанные таблицы

### `stickers`

| Поле | Тип |
|------|-----|
| category | text |
| name | text |
| tags | text[] |
| image_url | text |
| sort_order | int |

Seed: 18 SVG в migration `054_stickers.sql` + `public/carousel-stickers/`.

### `carousel_preset_images`

| Поле | Тип |
|------|-----|
| city_id | uuid nullable |
| storage_path | text |
| tags | text[] |
| vibe_slugs | text[] |

### `user_templates`

| Поле | Тип |
|------|-----|
| user_id | uuid |
| city_id | uuid |
| name | text |
| theme_id | text |
| project_type | text |
| layout_config | jsonb |

### `telegram_queue`

Очередь media group для отправки PNG в Telegram.

---

## TypeScript entry points

| Файл | Содержание |
|------|------------|
| `types/editorialCarousel.ts` | Все типы, export sizes |
| `utils/carouselSlideAdapter.ts` | v1 ↔ v2 |
| `utils/carouselSlideObjects.ts` | `getSlideStickerObjects()` |
| `utils/carouselStickerPosition.ts` | Layout стикеров на холсте |
| `utils/carouselTemplates.ts` | ID шаблонов, нормализация |
| `utils/parseInstagramCarousel.ts` | Local split без Groq |
