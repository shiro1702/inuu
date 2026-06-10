# Карусели — руководство разработчика

## Страницы и роуты

| Route | Файл | Назначение |
|-------|------|------------|
| `/dashboard/carousel-studio` | `pages/dashboard/carousel-studio.vue` | Studio: события, ручная сборка, legacy `CarouselStudio` |
| `/dashboard/carousel/edit/[id]` | `pages/dashboard/carousel/edit/[id].vue` | Shareable editor shell |
| `/dev/carousel-editor` | `pages/dev/carousel-editor.vue` | Dev sandbox без id |
| `/dev/carousel-render` | `pages/dev/carousel-render.vue` | Отладка рендера |

Публичная карусель в гайдах: `pages/[city_slug]/guides/[slug].vue` читает `metadata.carousel`.

---

## Компоненты

### Редактор (`components/carousel-editor/`)

| Компонент | Роль |
|-----------|------|
| `CarouselEditorShell.vue` | Корневой layout: header, canvas, nav, sheets, export |
| `CarouselEditorCanvas.vue` | Обёртка над `CarouselSlidePreview` |
| `CarouselEditSlideSheet.vue` | Редактирование полей + **ИИ одного слайда** |
| `CarouselImportTextSheet.vue` | Импорт текста / **ИИ всей карусели** |
| `CarouselStickerSheet.vue` | Bottom sheet библиотеки стикеров |
| `CarouselStickerOverlay.vue` | Стикеры на холсте: drag, pinch, rotate |
| `CarouselStyleSheet.vue` | Шаблон, vibe, aspect, project type |
| `CarouselTemplateSheet.vue` | User templates save/apply |
| `CarouselTelegramSendSheet.vue` | UI отправки в TG |
| `CanvasSlideRenderer.vue` | Dual-pass v2 renderer (flow + objects) |

### Рендер слайдов (`components/editorial/carousel/`)

| Компонент | Роль |
|-----------|------|
| `CarouselSlideRenderer.vue` | Выбор template pack по `role` + `templateId` |
| `CarouselSlidePreview.vue` | Масштабированное превью + sticker overlay |
| `CarouselSlideFrame.vue` | Фиксированный export size (1080×…) |
| `CarouselSlideChrome.vue` | Лого, бренд, счётчик слайдов |
| `templates/*` | 8×3 Vue-компонента Cover/Body/Outro |

---

## State: Pinia `carouselEditor`

Файл: `stores/carouselEditor.ts`

| Поле | Описание |
|------|----------|
| `id` | UUID в `generated_carousels` |
| `slides` | `CarouselSlide[]` |
| `templateId` | Style pack |
| `aspect` | `1:1` \| `4:5` \| `9:16` \| `16:9` |
| `vibeKey` | Градиент всех слайдов |
| `projectType` | `carousel` \| `post` \| `story` \| `cover` |
| `currentSlideIndex` | Активный слайд в UI |

Persist (client): `pinia-plugin-persistedstate` → key `carousel-editor-draft`.

Ключевые actions:

- `load(id)` / `save()` / `share()`
- `updateSlide(index, patch)`
- `addStickerToCurrentSlide(sticker)`
- `updateCanvasObject(slideIndex, objectId, patch)`
- `replaceSlides(slides)` — после Groq

---

## API: проекты

| Method | Path | Описание |
|--------|------|----------|
| `POST` | `/api/dashboard/carousel` | Создать проект (`city_slug` обязателен) |
| `GET` | `/api/dashboard/carousel/[id]` | Загрузить |
| `PUT` | `/api/dashboard/carousel/[id]` | Сохранить |
| `GET` | `/api/dashboard/carousel/stickers` | Библиотека стикеров |
| `GET` | `/api/dashboard/carousel/presets` | Preset images |
| `GET/POST` | `/api/dashboard/carousel/templates` | User templates |
| `POST` | `/api/dashboard/carousel/telegram-queue` | Поставить PNG в очередь TG |

Утилиты: `server/utils/generatedCarouselAccess.ts`, `generatedCarouselWrite.ts`.

---

## API: ИИ

| Method | Path | Описание |
|--------|------|----------|
| `POST` | `/api/ai/carousel/generate` | Карусель целиком |
| `POST` | `/api/ai/carousel/generate-slide` | Один слайд |
| `POST` | `/api/ai/carousel/fill-template` | Groq blind copy в user template |

Требует `NUXT_GROQ_API_KEY`. См. [04-ai-and-groq.md](./04-ai-and-groq.md).

---

## PNG export

1. `CarouselEditorCanvas.prepareSlideForExport()` — ждёт paint, возвращает DOM node.
2. `renderSlideToPng(node, { aspect })` — `html-to-image`, размер из `CAROUSEL_EXPORT_SIZES`.
3. Outro: `waitForQrImages()` — дождаться QR.

Файлы: `utils/renderSlideToPng.ts`, `utils/carouselExport.ts`, `utils/carouselQrCode.ts`.

---

## Стикеры: позиционирование

`utils/carouselStickerPosition.ts`:

- `anchor: canvas` — `x`/`y` как % холста (0–100);
- `anchor: flow` — смещение от DOM-якоря (`h1`/`h2` для `title`).

Overlay в export space (1080 px), масштабируется вместе с preview.

---

## Telegram queue

1. `POST /api/dashboard/carousel/telegram-queue` — ставит job.
2. Cron `GET /api/cron/telegram-queue-dispatch` (`vercel.json`) — worker `server/utils/telegramQueueWorker.ts`.

Таблица: `telegram_queue` (migration `056_telegram_queue.sql`).

---

## Миграции Supabase

| Migration | Таблица |
|-----------|---------|
| `052_generated_carousels.sql` | Проекты редактора |
| `053_carousel_preset_images.sql` | Фоны по тегам |
| `054_stickers.sql` | Библиотека стикеров + seed |
| `055_user_templates.sql` | Шаблоны пользователя |
| `056_telegram_queue.sql` | Очередь отправки в TG |
| `058_stickers_emoji_pack.sql` | Fluent Emoji 3D PNG |

Два пака стикеров:

| Пак | Путь | Источник | Лицензия |
|-----|------|----------|----------|
| `minimal` | `public/carousel-stickers/*.svg` | Lucide | ISC |
| `emoji` | `public/carousel-stickers/emoji/*.png` | [Fluent Emoji](https://github.com/microsoft/fluentui-emoji) 3D | MIT |

Синхронизация ассетов:

```bash
npm run sync:carousel-stickers:all
# или по отдельности:
npm run sync:carousel-stickers      # Lucide SVG, 47 шт.
npm run sync:carousel-emoji-stickers # Fluent 3D PNG, 50 шт.
```

Каталоги: `scripts/carousel-sticker-catalog.json`, `scripts/carousel-emoji-catalog.json`.  
API `GET /api/dashboard/carousel/stickers` мержит БД + оба каталога. Groq matcher предпочитает emoji-пак при совпадении тегов.

---

## Env

| Переменная | Назначение |
|------------|------------|
| `NUXT_GROQ_API_KEY` | Groq API |
| `NUXT_GROQ_MODEL` | Основная модель (default `llama-3.3-70b-versatile`) |
| `NUXT_GROQ_CLASSIFIER_MODEL` | Fallback |

---

## Smoke-тесты

См. [WAVE_4A_CAROUSEL_EDITOR.md](../../../runbooks/WAVE_4A_CAROUSEL_EDITOR.md).

Минимум после изменений:

1. Создать проект → 3 слайда preview → save → reload по share link.
2. ИИ: текст → 4+ слайда с фонами.
3. ИИ: один body-слайд из текста.
4. Стикер → drag → save → reload — координаты на месте.
5. Скачать PNG — разрешение 1080 по длинной стороне.
