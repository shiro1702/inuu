# Карусели — обзор продукта

## Зачем

INUU генерирует **Instagram-карусели** (и афиши 9:16, посты 1:1) из:

- текста анонса или поста из Telegram;
- подборки событий из БД;
- ручного ввода в редакторе.

Результат — готовые PNG для соцсетей или отправка media group в Telegram.

## Архитектура (высокий уровень)

```
┌─────────────────────────────────────────────────────────────┐
│  Источник: текст / события / статья / ручной ввод           │
└──────────────────────────┬──────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  Groq (опционально) → JSON слайдов + image_tags + стикеры   │
└──────────────────────────┬──────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  Matchers: preset images · sticker tags                     │
└──────────────────────────┬──────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  HTML/CSS рендер (Vue templates) → превью в браузере        │
└──────────────────────────┬──────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  html-to-image → PNG 1080×1350 / 1080×1920 / …              │
└─────────────────────────────────────────────────────────────┘
```

## Типы проекта (`project_type`)

| Тип | Слайдов | Aspect по умолчанию | Use case |
|-----|---------|---------------------|----------|
| `carousel` | 3–7 | `4:5` | Подборки, гайды |
| `post` | 1 | `1:1` | Быстрый пост в ленту |
| `story` | 1 | `9:16` | Stories, вертикальная афиша |
| `cover` | 1 | `16:9` | YouTube / превью |

## Роли слайдов

| Роль | `type` (v2) | Задача |
|------|-------------|--------|
| `cover` | `first` | Обложка: заголовок, фото, вайб |
| `body` | `middle` | Контент: тезисы, split layout |
| `outro` | `last` | CTA, QR, deep link |

## Style packs (8 шаблонов)

Каждый pack — тройка Vue-компонентов Cover / Body / Outro:

`minimal-ios` · `photo-card` · `editorial-bold` · `city-poster` · `stockholm-calm` · `kyoto-tea` · `parisian-atelier` · `event-digest`

Канон: `utils/carouselTemplates.ts`, детали в [35-html-carousel-video-studio.md](../35-html-carousel-video-studio.md).

## Vibe-градиенты

6 ключей: `party`, `nightlife`, `romance`, `underground`, `vegan`, `tourism`.

Поле слайда `gradient` · резолвер `utils/carouselVibeTheme.ts`.

## Статус реализации (июнь 2026)

### Carousel Studio (3d)

- [x] 8 style packs, 6 vibes
- [x] Сборка из событий (`buildCarouselFromEvents`)
- [x] Ручной редактор + PNG export
- [x] Публикация в `editorial_posts.metadata.carousel`

### Carousel Editor (4a–4d)

- [x] `generated_carousels` + share link `/dashboard/carousel/edit/[id]`
- [x] Pinia persist черновика
- [x] Mobile shell: header, canvas, thumb bar, bottom sheets
- [x] Groq: текст → карусель (`POST /api/ai/carousel/generate`)
- [x] Groq: текст → один слайд (`POST /api/ai/carousel/generate-slide`)
- [x] Preset images matcher по `image_tags`
- [x] JSON v2: flow + objects (стикеры)
- [x] Библиотека стикеров (18 SVG) + drag / pinch / rotate на холсте
- [x] User templates: save / apply / Groq fill
- [x] `project_type` + aspects 1:1 / 4:5 / 9:16 / 16:9
- [x] Отправка в Telegram (`telegram_queue` + cron dispatch)

### Не в MVP

- Client-side video (GSAP + WebCodecs)
- Haptic snap к flow-блокам
- Trash zone при drag стикера
- Marketplace шаблонов
