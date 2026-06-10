# Волна 3d — PNG для каруселей и сторис

**Статус:** ✅ закрыта 04.06.2026 (TASK-025–027).

План: [ACTIVE_TASKS.md](../tracker/ACTIVE_TASKS.md) (архив TASK-025–027).

**После:** волна 3c. **Следующая:** [3e — retention в боте](../tracker/ACTIVE_TASKS.md#волна-3e--retention-и-editorial-push). **Не входит:** WebCodecs / MP4 (волна 3f+).

| Задача | Формат | Матрица |
|--------|--------|---------|
| TASK-025 | Общие HTML-шаблоны + `html-to-image` (база) | §6, §13 |
| TASK-026 | Карусель: `metadata.carousel`, сайт, export SMM | §6 |
| TASK-027 | Сторис: PNG-слайды → `story_slides` при publish | §6 |

Спеки: [35-html-carousel-video-studio.md](../features/content/35-html-carousel-video-studio.md) · [34-groq-editorial-content-multiplier.md](../features/content/34-groq-editorial-content-multiplier.md) · [30-manager-chat-place-editorial.md](../features/content/30-manager-chat-place-editorial.md)

---

## Порядок реализации

```text
TASK-025 (шаблоны + render util)
    ├──► TASK-026 (карусель editorial + export)
    └──► TASK-027 (сторис in-app + manager chat)
```

---

## Перед проверкой (prerequisites)

### 1. Миграция БД

Применить на Supabase (локально или remote):

```bash
# из корня репо, если используете Supabase CLI
supabase db push
# или выполнить вручную:
# supabase/migrations/051_editorial_posts_metadata.sql
```

Проверка в SQL:

```sql
select column_name
from information_schema.columns
where table_name = 'editorial_posts' and column_name = 'metadata';
```

Ожидание: одна строка, тип `jsonb`, default `'{}'`.

### 2. Окружение dev

| Переменная | Зачем |
|------------|--------|
| `NUXT_GROQ_API_KEY` | Кнопки «Пак контента» / «Карусель» в manager chat |
| Supabase URL + service role | Publish, upload в `organization-media` |
| Привязанный manager chat города | Callback-кнопки в Telegram |

```bash
npm run dev
# по умолчанию http://localhost:3000
```

### 3. Автотесты (быстрая регрессия)

```bash
npm test -- tests/parseInstagramCarousel.spec.ts tests/buildStorySlidesFromEditorial.spec.ts
```

Ожидание: все тесты green (парсер карусели + Hook–Story–Offer).

---

## Ключевые URL (dev, город `ulan-ude`)

| Что | URL |
|-----|-----|
| **Карусель Studio (менеджеры)** | http://localhost:3000/dashboard/carousel-studio |
| Smoke / legacy URL | `/dev/carousel-render` → редирект в Studio |
| Журнал / статья | http://localhost:3000/ulan-ude/guides/{slug} |
| Главная + сторис | http://localhost:3000/ulan-ude |
| Dashboard контент | http://localhost:3000/dashboard/content-ai |
| Story Studio (TASK-027) | http://localhost:3000/dashboard/story-studio?city=ulan-ude&campaign={uuid} |

Прод: `https://inuu.ru/ulan-ude/…` (или ваш домен) — те же пути.

---

## TASK-025 — шаблоны и PNG-рендер (~5 мин)

**Цель:** Cover + Body + Outro в **4:5** (1080×1350) и **9:16** (1080×1920), watermark `@бренд` на cover.

### Шаги

1. Открыть `/dashboard/carousel-studio` (нужен вход в dashboard). Для smoke без авторизации в dev: `/dev/carousel-render` → редирект в Studio.
2. Выбрать aspect **4:5** → **«Сгенерировать 3 PNG»**.
3. Убедиться:
   - скачались 3 файла (`carousel-cover-…`, `carousel-body-…`, `carousel-outro-…`);
   - под кнопкой появились превью-картинки **не пустые** (не белый/чёрный canvas);
   - на cover виден watermark вида `@Улан-Удэ` или `@INUU`.
4. Повторить с aspect **9:16** — те же 3 роли, вертикальный формат.

### Если пустой canvas

- Проверить консоль браузера (CORS на `media_url`, если добавили фото).
- Для storage: bucket `organization-media` должен отдавать CORS с `Access-Control-Allow-Origin` для origin dev-сервера.
- В шаблонах уже стоит `crossorigin="anonymous"` на `<img>`.

### Файлы

`components/editorial/carousel/`, `utils/renderSlideToPng.ts`, `pages/dev/carousel-render.vue`

---

## TASK-026 — карусель на сайте и export (~10 мин)

**Цель:** после publish в manager chat на статье — свайп-карусель; в dashboard — скачивание PNG; старые статьи без `metadata` — без ошибок.

### A. Manager chat → карусель в БД

1. В привязанном manager chat отправить материал (`/review` или `/post`) с текстом ≥10 символов и по возможности обложкой.
2. В превью нажать **«📷 Карусель»** (можно сначала **«📦 Пак контента»** — pack сохранится в payload).
3. Бот ответит: `Карусель собрана: N слайдов (4:5)`.
4. Нажать **«✅ Опубликовать на портал»**.

### B. Проверка на сайте

1. Открыть ссылку из ответа бота: `/ulan-ude/guides/{slug}`.
2. Под заголовком блок **«Карусель для соцсетей»** с свайпом (стрелки / точки).
3. ≥3 слайда, роли cover → body → outro.

### C. Проверка в БД (опционально)

```sql
select slug, metadata->'carousel'->'slides' as slides
from editorial_posts
where slug = 'ваш-slug'
order by published_at desc
limit 1;
```

Ожидание: `slides` — массив из ≥2 объектов с полями `role`, `title` / `bullets` / `cta_text`.

### D. Export PNG в dashboard

1. `/dashboard/content-ai` → выбрать город → в списке журнала найти **опубликованную** статью с каруселью.
2. Под ссылкой «На витрине» — блок **«Экспорт карусели (PNG)»** → **«Скачать все PNG»**.
3. Сравнить визуально с превью на `/guides/{slug}` (тот же `template_id` — default `minimal-ios`, всего **8** шаблонов, см. [35](../features/content/35-html-carousel-video-studio.md)).

### E. Регрессия без карусели

Открыть любую старую статью без `metadata.carousel` — страница как раньше, **без** блока карусели и без 500 в Network на editorial API.

### Файлы

`server/utils/parseInstagramCarousel.ts`, `contentSubmissionPublish.ts`, `inuuManagerChatBot.ts`, `EditorialCarousel.vue`, `EditorialCarouselExportPanel.vue`, миграция `051_*.sql`

---

## TASK-027 — сторис с PNG (~10 мин)

**Цель:** publish «+ сторис» → Story Studio → PNG на storage → круг на главной + 3+ кадра в fullscreen viewer.

**Важно:** PNG рендерится **в браузере** (dashboard). Бот только создаёт черновик кампании и даёт ссылку на Studio.

### A. Publish из manager chat

1. Черновик обзора в manager chat (как в 026).
2. Нажать **«✅ Опубликовать + сторис»** (не обычный «Опубликовать»).
3. Бот: ссылка на портал + строка вида  
   `🎬 Соберите PNG-сторис: /dashboard/story-studio?city=ulan-ude&campaign={uuid}`

### B. Story Studio

1. Открыть ссылку (нужен доступ в dashboard / авторизация менеджера).
2. Увидеть список 3 слайдов (cover / body / outro) из черновика.
3. **«Собрать и опубликовать слайды»** — дождаться успеха (`Готово: 3 слайдов…`).

### C. Главная и viewer

1. `/ulan-ude` — в полоске сторис новый круг с **PNG-превью** (не только градиент с текстом).
2. Открыть сторис — **3+ кадра** с картинками; при необходимости overlay из `action_payload.title` / `text`.

### D. Проверка в БД

```sql
select sc.id, sc.title, sc.preview_url, sc.targeting->'pending_render' as pending
from story_campaigns sc
where sc.city_id = (select id from cities where slug = 'ulan-ude')
order by sc.created_at desc
limit 3;

select sort_order, left(media_url, 80) as url
from story_slides
where campaign_id = 'uuid-кампании'
order by sort_order;
```

Ожидание после Studio:

- `pending_render` = `false` или отсутствует;
- `preview_url` = URL первого слайда в `organization-media`;
- ≥3 строк в `story_slides` с `media_url` на storage.

### E. Повторный render

Опубликовать **ещё один** обзор «+ сторис» — должна появиться **новая** кампания; старые круги на главной не пропадают и не перезаписываются.

### Файлы

`pages/dashboard/story-studio.vue`, `story-slide.upload.post.ts`, `story-campaigns/[id]/finalize-slides.post.ts`, `buildStorySlidesFromEditorial.ts`, `editorialStoryTeaser.ts`

---

## Smoke-чеклист волны 3d (~20 мин)

Сводный чеклист для UAT / перед релизом:

| # | Проверка | OK |
|---|----------|:--:|
| 1 | `/dev/carousel-render` — 3 PNG в 4:5 и 9:16, не пустые | ☐ |
| 2 | Manager: «Карусель» → publish → свайп на `/guides/{slug}` | ☐ |
| 3 | Dashboard: «Скачать все PNG» для той же статьи | ☐ |
| 4 | Старая статья без `metadata.carousel` — без ошибок | ☐ |
| 5 | Manager: «Опубликовать + сторис» → ссылка Studio | ☐ |
| 6 | Story Studio → успех → PNG на главной + 3 кадра в viewer | ☐ |
| 7 | «Пак контента» без карусели/сторис — текст в TG как раньше | ☐ |
| 8 | `npm test` — parseInstagramCarousel + buildStorySlides | ☐ |

---

## Связанные файлы (карта репо)

| Область | Пути |
|---------|------|
| Шаблоны / рендер | `components/editorial/carousel/`, `utils/renderSlideToPng.ts`, `utils/carouselVibeTheme.ts` |
| Типы | `types/editorialCarousel.ts` |
| Парсер карусели | `server/utils/parseInstagramCarousel.ts` |
| Publish / бот | `server/utils/contentSubmissionPublish.ts`, `server/utils/inuuManagerChatBot.ts` |
| Сторис | `server/utils/buildStorySlidesFromEditorial.ts`, `server/utils/editorialStoryTeaser.ts`, `server/utils/storyCampaignWrite.ts` |
| API upload/finalize | `server/api/dashboard/manager/cities/[slug]/story-slide.upload.post.ts`, `…/story-campaigns/[id]/finalize-slides.post.ts` |
| Витрина | `components/editorial/EditorialCarousel.vue`, `pages/[city_slug]/guides/[slug].vue` |
| UI сторис | `components/stories/StoriesTopBar.vue`, `StoryViewer.vue` |
| Миграция | `supabase/migrations/051_editorial_posts_metadata.sql` |
| Тесты | `tests/parseInstagramCarousel.spec.ts`, `tests/buildStorySlidesFromEditorial.spec.ts` |

---

## Out of wave (3f+)

- Client MP4 (GSAP + WebCodecs)
- Карусели в TG media group — [36](../features/content/36-bot-vibes-editorial-delivery.md)
- ZIP-архив слайдов (сейчас — поштучный download PNG)
- Server-side satori / Puppeteer для бота

---

## Troubleshooting

| Симптом | Вероятная причина | Что сделать |
|---------|-------------------|-------------|
| `404 City not found` на `/api/cities/dev/home` | `/dev/` ошибочно шёл как город `dev` | Открыть `/dev/carousel-render` или `/dev/` (редирект) |
| Пустой PNG / белый кадр | CORS на фото storage | CORS на bucket; `crossOrigin` на img |
| «Карусель собрана: 0» / ошибка парсера | Слабый текст в `instagram_carousel` | Повторить «Пак контента»; проверить fallback в `parseInstagramCarousel` |
| Нет блока карусели на сайте | Не нажали «Карусель» до publish или нет миграции 051 | Кнопка в боте + `metadata` в API |
| Story Studio «Нет черновика» | Обычный publish без `publish_story` | Использовать «Опубликовать + сторис» |
| Upload 500 | Нет прав на `organization-media` | RLS / service role в API |
| На главной только cover, 1 слайд | Не завершили Studio | Открыть Studio и «Собрать и опубликовать» |

---

**Следующая волна:** [WAVE_3C](../runbooks/WAVE_3C_README.md) (закрыта) → **3e** retention (TASK-028–030) в [ACTIVE_TASKS.md](../tracker/ACTIVE_TASKS.md).
