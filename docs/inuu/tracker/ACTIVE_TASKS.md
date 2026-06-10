# Активные задачи INUU

Живая очередь работ **вместо кэша в чате Cursor**. Один файл — один источник правды о том, что делаем прямо сейчас.

**Связано:** [FEATURE_MATRIX.md](./FEATURE_MATRIX.md) (все фичи) · [README](./README.md) (как пользоваться трекером)

---

## Зачем этот файл

| Было (кэш в чате) | Стало (`ACTIVE_TASKS.md`) |
|-------------------|---------------------------|
| Контекст теряется между сессиями | Задачи, scope и спеки лежат в репо |
| Непонятно, что «в работе» | Явный статус + ссылка на строку матрицы |
| Задача раздувается до эпика | Лимит: **≤3 задачи**, каждая — **~75% контекста** одного чата |

### Правила очереди

1. **Не больше 3 активных задач** (или 1 крупная, если явно помечена `size: L`).
2. **Размер задачи** — закрывается за один фокусированный чат Cursor (~75% контекста): код + проверка + обновление статусов.
3. **Начали** → статус `in_progress`, в [FEATURE_MATRIX.md](./FEATURE_MATRIX.md) строка `[~]`.
4. **Закончили** → статус `done`, перенести в [Архив](#архив), в матрице `[x]`, обновить сводку.
5. **Новая задача** — только после закрытия или явной отмены (`cancelled`) одной из активных.
6. В начале чата: `@docs/inuu/tracker/ACTIVE_TASKS.md` — агент подхватывает scope без пересказа.

### Шаблон задачи

```markdown
### TASK-NNN · Название
- **Статус:** `todo` | `in_progress` | `done` | `cancelled` | `paused`
- **Матрица:** §N · «Название фичи»
- **Цель:** одно предложение — зачем
- **Спеки:** ссылки
- **In scope:** буллеты
- **Out of scope:** буллеты (чтобы не раздувать)
- **Ключевые файлы:** пути в репо
- **Критерии готовности:** проверяемые пункты
- **Заметки:** контекст, блокеры, решения
```

---

## Текущий вектор (04.06.2026)

**Волна 3c закрыта:** TASK-022–024 → архив. Runbook: [WAVE_3C_README.md](../runbooks/WAVE_3C_README.md).

**Волна 3d закрыта:** TASK-025–027 → архив. Runbook: [WAVE_3D_README.md](../runbooks/WAVE_3D_README.md).

**Следующая волна:** [3e retention в боте](#волна-3e--retention-и-editorial-push) · ~~4a–4d Carousel Editor~~ ✅ закрыта.

Индексы брейнштормов: [01.06.2026](../../fix/brainstorm/01.06.2026.md), [02.05.2026](../../fix/brainstorm/02.05.2026.md), [03.06.2026](../../fix/brainstorm/03.06.2026.md), [10.06.2026](../../fix/brainstorm/10.06.2026.md).

---

## Активные задачи

> **0/3** — слоты свободны. Волна **4a–4d** закрыта (TASK-031–041).

---

## Волна 3c — таксономия и первый «денежный» push

**Статус волны:** ✅ закрыта 04.06.2026 (TASK-022–024).

**Порядок:** 022 → 023 → 024.

---

## Волна 3d — PNG для каруселей и сторис

**Статус волны:** ✅ закрыта 04.06.2026 (TASK-025–027).

**Как проверить:** [WAVE_3D_README.md](../runbooks/WAVE_3D_README.md) — prerequisites, URL, smoke-чеклист, SQL, troubleshooting.

---

## Волна 3d (архив описания)

**Зачем:** multiplier (TASK-015) даёт **текст** карусели/сторис; редакции нужны **готовые картинки** для сайта, SMM и полоски stories — без WebCodecs.

| Формат | После 3d |
|--------|----------|
| **Карусель** | PNG-слайды + свайп на статье + export |
| **Сторис** | PNG на storage → `story_slides.media_url` |

---

### TASK-025 · HTML-шаблоны слайдов + PNG-рендер (база)

- **Статус:** `done` (архив)
- **Размер:** M
- **Матрица:** §6 · HTML carousel studio (фаза 1 — только PNG)
- **Цель:** один раз сверстать слайды и рендерить их в PNG на клиенте (`html-to-image`), без дублирования вёрстки для карусели и сторис.
- **Спеки:** [35-html-carousel-video-studio.md](../features/content/35-html-carousel-video-studio.md) (разделы «Анатомия», «Рендеринг», без Video)
- **In scope:**
  - Vue: минимум 1 шаблон (`minimal-ios` или `split-media`) — роли `cover` / `body` / `outro`.
  - Aspect: `4:5` (карусель/IG) и `9:16` (сторис) через prop.
  - Vibe → CSS vars из `topic_tags` / `city_content_tags` (MVP: 3–4 пресета градиента).
  - Утилита `renderSlideToPng(slide, aspect)` + preload шрифтов / CORS для storage URL.
  - JSON-схема слайда: `role`, `title`, `bullets`, `media_url`, `cta_text` (как в спеке `metadata.carousel`).
- **Out of scope:** WebCodecs / MP4; 4 полных стиля из библиотеки; satori на сервере; Mini App crop-редактор.
- **Ключевые файлы:** `components/editorial/carousel/` (новое), `package.json` (`html-to-image`)
- **Критерии готовности:**
  - [x] Dev-страница `/dev/carousel-render` — Cover+Body+Outro в PNG.
  - [x] 9:16 и 4:5 из одного `slide` data.
  - [x] Watermark `@brand` на cover.

---

### TASK-026 · Карусель: `metadata.carousel` + сайт + export

- **Статус:** `done` (архив)
- **Размер:** M
- **Матрица:** §6 · HTML carousel studio (живая карусель + export)
- **Цель:** лонгрид на сайте показывает свайп-карусель; из multiplier/publish можно скачать PNG для Instagram.
- **Спеки:** [35-html-carousel-video-studio.md](../features/content/35-html-carousel-video-studio.md) · [34-groq-editorial-content-multiplier.md](../features/content/34-groq-editorial-content-multiplier.md)
- **In scope:**
  - `editorial_posts.metadata.carousel` — сохранение `slides[]` при publish / кнопка «Собрать карусель» в manager chat.
  - Парсер: `instagram_carousel` из Groq pack → `slides[]` (заголовки/буллеты по слайдам).
  - `EditorialCarousel.vue` на `/guides/[slug]` — интерактивный свайп.
  - Export: ZIP или поштучный download PNG (dashboard editorial или Mini App stub).
- **Out of scope:** живая карусель в TG media group ([36](../features/content/36-bot-vibes-editorial-delivery.md)); server Puppeteer; video.
- **Ключевые файлы:** `groqEditorialContentPack.ts`, `editorialDashboard.ts`, `inuuManagerChatBot.ts`, `pages/[city_slug]/guides/`
- **Критерии готовности:**
  - [x] `metadata.carousel` при publish + кнопка «Карусель» в manager chat.
  - [x] Export PNG в dashboard (`EditorialCarouselExportPanel`).
  - [x] Без `metadata.carousel` — статья без изменений.

---

### TASK-027 · Сторис: PNG-слайды → `story_slides` при publish

- **Статус:** `done` (архив)
- **Размер:** M
- **Матрица:** §6 · Stories города (визуальные слайды из шаблонов)
- **Цель:** при публикации editorial из manager chat сторис на главной — с **картинками**, не только текстом в preview.
- **Спеки:** [35-html-carousel-video-studio.md](../features/content/35-html-carousel-video-studio.md) · [30-manager-chat-place-editorial.md](../features/content/30-manager-chat-place-editorial.md) · [34-groq-editorial-content-multiplier.md](../features/content/34-groq-editorial-content-multiplier.md)
- **In scope:**
  - Hook–Story–Offer: 3–4 слайда из Groq story pack → render 9:16 PNG → upload Supabase Storage.
  - Запись `story_campaigns` + `story_slides` с `image_url`, `sort_order` (reuse `storyCampaignWrite.ts`).
  - Teaser на главной (`StoriesTopBar`) показывает обложку первого слайда.
  - Опция в preview: «Опубликовать + сторис» / отдельная кнопка «Пересобрать слайды».
- **Out of scope:** полноэкранный story viewer redesign; video slides; автопост в IG Stories API.
- **Ключевые файлы:** `storyCampaignWrite.ts`, `editorialDashboard.ts`, `inuuManagerChatBot.ts`, `components/stories/`, `server/api/cities/[slug]/stories.get.ts`
- **Критерии готовности:**
  - [x] «Опубликовать + сторис» → Story Studio → PNG на storage.
  - [x] `finalize-slides` пишет `story_slides` + `preview_url`.
  - [x] Новая кампания на каждый publish (старые не трогаем).

---

## Волна 3e — retention и editorial push

**После 3d.** Три задачи — бот и уведомления по журналу (бывший бэклог «3d»).

| ID | Кратко | Матрица |
|----|--------|---------|
| TASK-028 | Read later: пятничный дайджест в боте | §7 |
| TASK-029 | Weekly editorial report (scroll 50/100) | §6 |
| TASK-030 | Push при publish подборки / `editorial_posts` | §7 |

Спеки: [33](../features/content/33-editorial-articles-longreads-retention.md), [06](../features/content/06-bot-digest-subscriptions.md).

---

## Волна 4a–4d — Carousel Editor SaaS

**Статус волны:** ✅ закрыта 10.06.2026 (TASK-031–041).

**После 3e.** Интерактивный mobile-first редактор каруселей (Instagram UX) поверх PNG MVP волны 3d.

**Runbook:** [WAVE_4A_CAROUSEL_EDITOR.md](../runbooks/WAVE_4A_CAROUSEL_EDITOR.md) · **Спеки:** [38](../features/content/38-carousel-editor-saas.md), [39](../features/content/39-carousel-canvas-architecture.md), [40](../features/content/40-carousel-assets-and-stickers.md) · **Брейншторм:** [10.06.2026](../../fix/brainstorm/10.06.2026.md).

| Волна | Задачи | Фокус |
|-------|--------|-------|
| **4a** | TASK-031–033 | Share link, style packs, mobile shell |
| **4b** | TASK-034–036 | Groq generate, подборки, preset images |
| **4c** | TASK-037–039 | Flow/absolute canvas, templates, stickers |
| **4d** | TASK-040–041 | Афиши 9:16, TG send + queue |

**Порядок:** 031 → 032 → 033 → 034 → … → 041 (4a перед 4b; 4c можно частично параллелить с 4b после 033).

---

### TASK-031 · `generated_carousels` + share link + persist

- **Статус:** `done` (архив)
- **Размер:** M
- **Матрица:** §6 · Carousel Editor: share link · persist черновика
- **Цель:** сохранять проект карусели в БД и делиться ссылкой на редактирование; не терять черновик при перезагрузке.
- **Спеки:** [38](../features/content/38-carousel-editor-saas.md)
- **In scope:** migration `generated_carousels`; API CRUD; route `/dashboard/carousel/edit/[id]`; Pinia + persistedstate; кнопка «Поделиться».
- **Out of scope:** Groq generate; стикеры; TG send.
- **Критерии готовности:**
  - [x] Save/load JSON слайдов по UUID
  - [x] Share URL открывает тот же state
  - [x] Reload страницы не сбрасывает локальный черновик

---

### TASK-032 · Style packs first / middle / last

- **Статус:** `done` (закрыто в 3d — **8 шаблонов** в коде, не 3 из брейншторма 10.06)
- **Размер:** M
- **Матрица:** §6 · style packs first/middle/last
- **Цель:** визуальные паки с разными шаблонами обложки, контента и CTA.
- **Спеки:** [35](../features/content/35-html-carousel-video-studio.md) · [38](../features/content/38-carousel-editor-saas.md)
- **Реализовано:** `minimal-ios`, `photo-card`, `editorial-bold`, `city-poster`, `stockholm-calm`, `kyoto-tea`, `parisian-atelier`, `event-digest` — `CarouselSlideRenderer.vue`
- **Критерии готовности:**
  - [x] Смена theme перерисовывает cover/body/outro
  - [x] Export PNG для всех pack
- **Заметки:** в 4a не переделывать — при необходимости только **+1** pack (`acid-brutal`) или vibe-тюнинг

---

### TASK-033 · Mobile preview shell (Instagram UX)

- **Статус:** `done` (архив)
- **Размер:** M
- **Матрица:** §6 · mobile preview IG UX
- **Цель:** mobile-first оболочка редактора: холст, свайп слайдов, bottom sheet «редактировать слайд».
- **Спеки:** [38](../features/content/38-carousel-editor-saas.md)
- **In scope:** layout header/canvas/thumb-zone/tab-bar; prev/next 50/50; edit slide sheet; `/dev/carousel-editor`.
- **Out of scope:** pinch стикеров; Groq sheet; haptic.
- **Критерии готовности:**
  - [x] На 375px ширине всё управление в thumb-zone
  - [x] Листание 3+ слайдов без перезагрузки

---

### TASK-034 · Groq: сырой текст → карусель

- **Статус:** `done` (архив)
- **Размер:** M
- **Матрица:** §6 · Groq сырой текст → карусель
- **Спеки:** [38](../features/content/38-carousel-editor-saas.md)
- **In scope:** `POST /api/ai/carousel/generate`; промпт → slides JSON; UI в dashboard.
- **Out of scope:** template fill; sticker intents.
- **Критерии готовности:**
  - [x] Текст анонса → 3–5 слайдов в редакторе за один запрос

---

### TASK-035 · Подборка событий / текста → карусель

- **Статус:** `done` (архив)
- **Размер:** M
- **Матрица:** §6 · Groq подборка → карусель
- **Спеки:** [38](../features/content/38-carousel-editor-saas.md)
- **In scope:** чекбоксы events; режим «текст-каша»; Groq carousel JSON.
- **Out of scope:** auto publish в curated_list.
- **Критерии готовности:**
  - [x] 3 события из БД → карусель с обложкой и CTA

---

### TASK-036 · Preset images + `image_tags` matcher

- **Статус:** `done` (архив)
- **Размер:** M
- **Матрица:** §6 · медиатека пресетов
- **Спеки:** [40](../features/content/40-carousel-assets-and-stickers.md)
- **In scope:** Storage folders; `carousel_preset_images`; matcher по тегам Groq.
- **Out of scope:** Unsplash API.
- **Критерии готовности:**
  - [x] У каждого слайда с `image_tags` подставляется фон из presets

---

### TASK-037 · Flow + absolute canvas (dual-pass)

- **Статус:** `done` (архив)
- **Размер:** L
- **Матрица:** §6 · Flow + Absolute canvas
- **Спеки:** [39](../features/content/39-carousel-canvas-architecture.md)
- **In scope:** JSON v2; flow stack; satellites; virtual canvas; anchor flow/canvas.
- **Out of scope:** full layers panel (Figma mode).
- **Критерии готовности:**
  - [x] Длинный заголовок не наезжает на description (flow)
  - [x] Стикер с anchor=flow двигается с title

---

### TASK-038 · User templates + Groq fill

- **Статус:** `done` (архив)
- **Размер:** M
- **Матрица:** §6 · user_templates · Groq + шаблон
- **Спеки:** [38](../features/content/38-carousel-editor-saas.md)
- **In scope:** `user_templates` CRUD; save/apply; Groq blind JSON copy.
- **Out of scope:** marketplace шаблонов.
- **Критерии готовности:**
  - [x] Сохранить дизайн → apply к новому тексту → layout сохранён

---

### TASK-039 · Sticker library + canvas drag

- **Статус:** `done` (архив)
- **Размер:** M
- **Матрица:** §6 · стикеры · Groq автоподбор стикеров
- **Спеки:** [40](../features/content/40-carousel-assets-and-stickers.md)
- **In scope:** `stickers` seed 18; bottom sheet; drag; Groq sticker_intents matcher.
- **Out of scope:** SVG recolor UI.
- **Критерии готовности:**
  - [x] Добавить стикер с sheet → drag на холсте
  - [x] Groq предлагает ≥1 стикер по контексту слайда

---

### TASK-040 · Афиши и посты (aspect ratios)

- **Статус:** `done` (архив)
- **Размер:** M
- **Матрица:** §6 · генератор афиш/постов
- **Спеки:** [38](../features/content/38-carousel-editor-saas.md)
- **In scope:** `project_type` post/story/cover; aspects 1:1, 4:5, 9:16, 16:9; `telegram_post_text`.
- **Out of scope:** отдельный продуктовый landing.
- **Критерии готовности:**
  - [x] Один слайд 9:16 экспортируется как афиша
  - [x] Кнопка «Скопировать текст для TG»

---

### TASK-041 · Отправка карусели в Telegram

- **Статус:** `done` (архив)
- **Размер:** M
- **Матрица:** §6 · отправка в TG
- **Спеки:** [38](../features/content/38-carousel-editor-saas.md)
- **In scope:** кнопка рядом с PNG export; dropdown ЛС/mod chat; `telegram_queue` worker; media group.
- **Out of scope:** новый бот (reuse moderation bot).
- **Критерии готовности:**
  - [x] Manager: PNG album в moderation chat
  - [x] Partner: только ЛС

---

## Бэклог после 4d (не активно)

| ID / волна | Фокус | Матрица | Спека |
|------------|--------|---------|-------|
| 3f | Client video: WebCodecs + MP4 (Reels) | §13 | [35](../features/content/35-html-carousel-video-studio.md) |
| 3f | Карусели в TG по вайбам (media group) | §7 | [36](../features/content/36-bot-vibes-editorial-delivery.md) |
| TASK-017 | Venue announcements из ingest | §4 | [37](../features/content/37-ingest-editorial-routing.md) |
| — | Cross-platform Share | §2 | [28](../features/content/28-omnichannel-share-and-tma-funnel.md) |
| — | Unsplash fallback для `image_tags` | §6 | [38](../features/content/38-carousel-editor-saas.md) |

---

## Архив

| ID | Название | Закрыто | Коммит / PR |
|----|----------|---------|-------------|
| TASK-000 | Userbot: подписка на TG-каналы → ingest | 31.05.2026 | `workers/telegram-userbot/`, `035_city_telegram_sources.sql` |
| TASK-003 | Публичные org/venue и афиша на витрине | 31.05.2026 | [TASK-003-public-org-venue-storefront.md](./TASK-003-public-org-venue-storefront.md) |
| TASK-001 | Пре-фильтр + context_type + strict tags в Groq | 31.05.2026 | `contentPrefilter.ts`, `eventParsePrompt.ts`, `036_city_ingest_sources.sql` |
| TASK-002 | Web CRON + shadow org (plain text MVP) | 31.05.2026 | `web-sources-crawl.post.ts`, `ingestShadowOrg.ts`, `vercel.json` |
| TASK-007 | Dashboard: ingest-источники | 31.05.2026 | `DashboardIngestSourcesPanel.vue` |
| TASK-008–010 | Web pipeline classifier/rules | 01.06.2026 | [TASK-008-web-parsing-pipeline.md](./TASK-008-web-parsing-pipeline.md) |
| TASK-011–016 | Manager chat, digest, taxonomy, editorial routing spec | 03.06.2026 | см. архив в git |
| TASK-006 | Guides + editorial API + dashboard CRUD | 03.06.2026 | `editorialDashboard.ts`, `/guides` |
| TASK-014 | Read later, venue-блок, scroll beacon | 03.06.2026 | `043`, `044` |
| TASK-015 | Groq content multiplier | 03.06.2026 | `groqEditorialContentPack.ts` |
| TASK-004 | Каталог источников Улан-Удэ + backfill | 03.06.2026 | `045_wave3a_ulan_ude_ingest_sources.sql`, [runbook](./TASK-004-ulan-ude-sources-backfill.md) |
| TASK-005 | Санитар + TL;DR + vibe на карточках | 03.06.2026 | `046_events_tldr_vibe.sql`, `CityEventCard.vue` |
| TASK-018 | Groq `publication_date` + `post_type` | 03.06.2026 | `eventIngestPostType.ts`, `contentIngestCore.ts` |
| TASK-019 | WebP афиш + Groq cascade 429 | 03.06.2026 | [WAVE_3B](../runbooks/WAVE_3B_README.md) |
| TASK-020 | Плашки отмена/sold out + модерация link | 03.06.2026 | `047`, `eventModerationLink.ts` |
| TASK-021 | AI-чек источников перед выходными | 03.06.2026 | `048`, [SOURCE_WEEKEND_CHECK](../runbooks/SOURCE_WEEKEND_CHECK.md) |
| TASK-022 | `topic_tags` на подборках + digest union | 04.06.2026 | `050_curated_lists_topic_tags.sql`, `curatedListPeriod.ts` |
| TASK-023 | Смарт-лента: фильтр по тегам | 04.06.2026 | `home.get.ts`, `index.vue`, `tag/[tagSlug]` |
| TASK-024 | Push при publish события | 04.06.2026 | `cityTopicBroadcast.ts`, `contentSubmissionPublish.ts` |
| TASK-025 | HTML-шаблоны слайдов + PNG-рендер | 04.06.2026 | `components/editorial/carousel/`, `html-to-image`, `/dev/carousel-render` |
| TASK-026 | Карусель metadata + сайт + export | 04.06.2026 | `051_editorial_posts_metadata.sql`, `EditorialCarousel.vue`, `parseInstagramCarousel.ts` |
| TASK-027 | Сторис PNG → story_slides | 04.06.2026 | `/dashboard/story-studio`, `story-slide.upload`, `publish_story` |
| TASK-031–041 | Carousel Editor SaaS (волны 4a–4d) | 10.06.2026 | `052–056` migrations, `/dashboard/carousel/edit/[id]`, `components/carousel-editor/` |

---

**Последнее обновление:** 10.06.2026 · активных: **0** · закрыта: **4a–4d** (TASK-031–041) · следующая: **3e** (TASK-028–030) или backlog 3f
