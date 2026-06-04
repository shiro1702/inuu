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

**Следующая волна:** [3d — PNG карусели и сторис](#волна-3d--png-для-каруселей-и-сторис) (TASK-025 → 027). Runbook: [WAVE_3D_README.md](../runbooks/WAVE_3D_README.md).

**Дальше:** [3e retention в боте](#волна-3e--retention-и-editorial-push) · [3f+ бэклог](#бэклог-после-3e-не-активно).

Индексы брейнштормов: [01.06.2026](../../fix/brainstorm/01.06.2026.md), [02.05.2026](../../fix/brainstorm/02.05.2026.md), [03.06.2026](../../fix/brainstorm/03.06.2026.md).

---

## Активные задачи

> **0/3** — слоты свободны. Старт 3d: **TASK-025** → `in_progress` + `[~]` в матрице.

---

## Волна 3c — таксономия и первый «денежный» push

**Статус волны:** ✅ закрыта 04.06.2026 (TASK-022–024).

**Порядок:** 022 → 023 → 024.

---

## Волна 3d — PNG для каруселей и сторис

**Зачем:** multiplier (TASK-015) даёт **текст** карусели/сторис; редакции нужны **готовые картинки** для сайта, SMM и полоски stories — без WebCodecs.

**Порядок:** 025 → (026 ‖ 027).

| Формат | Сейчас в продукте | После 3d |
|--------|-------------------|----------|
| **Карусель** | `instagram_carousel` текст в Groq pack | PNG-слайды + свайп на статье + export |
| **Сторис** | `story_campaigns` + текстовые слайды | PNG на storage → `story_slides.image_url` |

---

### TASK-025 · HTML-шаблоны слайдов + PNG-рендер (база)

- **Статус:** `todo`
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
  - [ ] Dev-страница или Storybook-like route рендерит Cover+Body+Outro в 3 PNG без пустого canvas.
  - [ ] 9:16 и 4:5 из одного `slide` data с разным wrapper.
  - [ ] Watermark `@brand` на cover.

---

### TASK-026 · Карусель: `metadata.carousel` + сайт + export

- **Статус:** `todo`
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
  - [ ] После publish статьи с pack — на странице видна карусель из ≥3 слайдов.
  - [ ] Export 4 PNG совпадает с превью на сайте.
  - [ ] Без `metadata.carousel` — статья как сейчас (без ошибок).

---

### TASK-027 · Сторис: PNG-слайды → `story_slides` при publish

- **Статус:** `todo`
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
  - [ ] Publish обзора из manager chat → на `/ulan-ude` новый круг с PNG-превью.
  - [ ] Fullscreen story показывает 3+ слайда с картинкой и текстом.
  - [ ] Повторный render не ломает старые кампании (новая кампания или replace по slug).

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

## Бэклог после 3e (не активно)

| ID / волна | Фокус | Матрица | Спека |
|------------|--------|---------|-------|
| 3f | Client video: WebCodecs + MP4 (Reels) | §13 | [35](../features/content/35-html-carousel-video-studio.md) |
| 3f | Карусели в TG по вайбам (media group) | §7 | [36](../features/content/36-bot-vibes-editorial-delivery.md) |
| TASK-017 | Venue announcements из ingest | §4 | [37](../features/content/37-ingest-editorial-routing.md) |
| — | Cross-platform Share | §2 | [28](../features/content/28-omnichannel-share-and-tma-funnel.md) |

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

---

**Последнее обновление:** 04.06.2026 · активных: **0** · текущая волна: **3d** (TASK-025–027)
