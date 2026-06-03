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

## Текущий вектор (03.06.2026)

**Волна 3a в работе:** TASK-004 (источники + runbook) · TASK-005 · TASK-018 — код в репо; backfill/cron smoke — вручную по [TASK-004-ulan-ude-sources-backfill.md](./TASK-004-ulan-ude-sources-backfill.md).

**Следующая волна 3b:** TASK-019–021 (запланировано ниже) — после закрытия 3a / smoke TASK-004.

Индексы брейнштормов: [01.06.2026](../../fix/brainstorm/01.06.2026.md), [02.05.2026](../../fix/brainstorm/02.05.2026.md), [03.06.2026](../../fix/brainstorm/03.06.2026.md).

---

## Активные задачи · Волна 3a

> **Очередь:** 3 задачи · лимит 3 · **TASK-004** size **L**.

### TASK-004 · Каталог источников Улан-Удэ + backfill

- **Статус:** `in_progress`
- **Размер:** L
- **Матрица:** §4 Ingestion · §8 «Регистрация источников»
- **Цель:** whitelist TG/web для Улан-Удэ и первичное наполнение афиши из ingest
- **Спеки:** [10](../features/content/10-telegram-sources-without-bot-access.md), [17](../features/content/17-ingest-sources-context.md), [TASK-004 runbook](./TASK-004-ulan-ude-sources-backfill.md)
- **In scope:**
  - Seed 12–20 TG + 4–6 web (`045_wave3a_ulan_ude_ingest_sources.sql`)
  - 2 web `cron_enabled` для smoke classifier/rules
  - Smoke seed ≥15 published events
  - Runbook backfill userbot + cron
- **Out of scope:** VK worker, `t.me/s/` отдельный воркер (027), venue editorial (017)
- **Ключевые файлы:** `supabase/migrations/045_*.sql`, `workers/telegram-userbot/`, `server/api/cron/web-sources-crawl.post.ts`
- **Критерии готовности:** чеклист в runbook TASK-004
- **Заметки:** миграция и runbook готовы; осталось — подписка userbot, smoke cron, approve ≥15 из очереди

### TASK-005 · Санитар + TL;DR + vibe на карточках

- **Статус:** `in_progress`
- **Размер:** M
- **Матрица:** §4 «AI-санитар» · «TL;DR + vibe emoji»
- **Цель:** карточка афиши показывает короткий pitch и emoji-вайб из Groq
- **Спеки:** [22](../features/content/22-ai-bot-concierge-and-intent.md), [16](../features/content/16-parsing-pipeline-extensions.md), [13](../features/content/13-ai-content-horizon.md)
- **In scope:**
  - `events.tldr`, `events.vibe_emoji` (`046_events_tldr_vibe.sql`)
  - Поля в `eventParseSchema` + prompt + publish + `CityEventCard`
- **Out of scope:** отдельный второй LLM-вызов «санитар», SEO-рерайт страниц
- **Ключевые файлы:** `eventParseSchema.ts`, `eventParsePrompt.ts`, `contentSubmissionPublish.ts`, `CityEventCard.vue`
- **Критерии готовности:**
  - [ ] После approve в БД есть `tldr` или `vibe_emoji` на тестовом событии
  - [ ] Карточка на `/events` показывает emoji + TL;DR
- **Заметки:** санитар = те же поля Groq на этапе parse (без второго запроса)

### TASK-018 · Groq event: `publication_date` + `post_type`

- **Статус:** `in_progress`
- **Размер:** S
- **Матрица:** §4 `post_type` · Groq `publication_date`
- **Цель:** парсер различает отмену/перенос/мусор; даты «завтра» от даты поста
- **Спеки:** [25](../features/content/25-groq-event-extraction-prompt.md), [16](../features/content/16-parsing-pipeline-extensions.md)
- **In scope:**
  - `post_type` + `publication_date` в digest JSON
  - `trash` → skip persist; `cancellation`/`update` → needs_revision + карточка модерации
- **Out of scope:** авто-отмена события в БД по fuzzy match
- **Ключевые файлы:** `eventParseSchema.ts`, `groqEventParser.ts`, `contentIngestCore.ts`, `eventIngestPostType.ts`
- **Критерии готовности:**
  - [ ] Тестовый JSON `post_type: trash` не создаёт submission
  - [ ] `cancellation` попадает в очередь с меткой типа поста
- **Заметки:** `tests/eventIngestPostType.spec.ts`

---

## Запланировано · Волна 3b — «Качество ingest + карточка»

> Статус `todo` · **не в лимите 3 активных** · старт после волны 3a (минимум: smoke web cron + первые approve из TASK-004).  
> Очередь волны: **3 задачи** (по одной в активных или параллельно, если 3a закрыта).

### TASK-019 · WebP афиш + Groq cascade 429

- **Статус:** `todo`
- **Размер:** M
- **Матрица:** §4 «Сжатие афиш WebP» · «Groq: каскад 8b/70b + graceful 429»
- **Цель:** лёгкие обложки при ingest и устойчивый парсинг при лимитах Groq
- **Спеки:** [24-mvp-launch-checklist-ulan-ude.md](../features/content/24-mvp-launch-checklist-ulan-ude.md), [11-tech-stack.md](../11-tech-stack.md)
- **In scope:**
  - Сжатие cover → WebP при ingest (цель < 300 KB)
  - Fallback модели / retry при 429 в `groqEventParser`
  - Логирование в `ai_parse_logs` при деградации
- **Out of scope:** CDN отдельно от Storage, платный резервный провайдер
- **Ключевые файлы:** `server/utils/contentCoverMedia.ts`, `server/utils/ai/groqEventParser.ts`, ingest publish path
- **Критерии готовности:**
  - [ ] Новый ingest сохраняет WebP URL (или webp mime) в `cover_media_url`
  - [ ] При 429 парсинг не падает 500 — очередь/лог с понятным warning
- **Заметки:** зависит от стабильного ingest (TASK-004)

### TASK-020 · Отмена / перенос / SOLD OUT на витрине

- **Статус:** `todo`
- **Размер:** M
- **Матрица:** §2 «Плашки ОТМЕНЕНО / SOLD OUT» · §4 `post_type` (UI)
- **Цель:** пользователь видит статус события, карточка не исчезает молча
- **Спеки:** [16-parsing-pipeline-extensions.md](../features/content/16-parsing-pipeline-extensions.md), [15-event-detail-series-venues.md](../features/content/15-event-detail-series-venues.md)
- **In scope:**
  - Поле статуса на `events` (или `source_metadata`) из `post_type` update/cancellation
  - Плашки на `CityEventCard` и детальной странице
  - Модерация: кнопка «Отменить в базе» (MVP — ручной approve → `is_cancelled` / скрытие CTA)
- **Out of scope:** fuzzy auto-match отмены по тексту без модератора (расширение TASK-018)
- **Ключевые файлы:** `supabase/migrations/`, `CityEventCard.vue`, `pages/[city_slug]/events/[eventSlug].vue`, `contentSubmissionPublish.ts`
- **Критерии готовности:**
  - [ ] Событие с флагом отмены показывает плашку «Отменено»
  - [ ] Sold out / перенос — отдельная плашка или бейдж на карточке
- **Заметки:** опирается на `post_type` из TASK-018

### TASK-021 · AI-чек источников перед выходными

- **Статус:** `todo`
- **Размер:** M
- **Матрица:** §4 «AI-чек источников (404, отмена на сайте)»
- **Цель:** менеджер видит расхождения афиши на сайте источника и в базе до выходных
- **Спеки:** [16-parsing-pipeline-extensions.md](../features/content/16-parsing-pipeline-extensions.md), [02.05.2026](../../fix/brainstorm/02.05.2026.md)
- **In scope:**
  - Cron или ручной триггер: re-fetch whitelisted web sources
  - Сравнение «событие ещё в афише» vs опубликовано у нас
  - Запись в `scraping_alerts` / уведомление в manager chat
- **Out of scope:** полный мониторинг всех внешних сайтов, VK
- **Ключевые файлы:** `server/api/cron/`, `scrapingAlerts.ts`, `web-sources-crawl.post.ts`, dashboard alerts UI
- **Критерии готовности:**
  - [ ] Тестовый 404/«отмена» на странице источника → alert в dashboard
  - [ ] Runbook: когда запускать (чт–пт перед выходными)
- **Заметки:** после стабильного web cron (TASK-004 + 008–010)

---

## Бэклог волны 3c+ (не активно)

| ID / тема | Фокус | Матрица | Спека |
|-----------|--------|---------|-------|
| 3c | `topic_tags` на подборках + смарт-лента | §6 | [31](../features/content/31-content-tags-vibes-taxonomy.md) |
| 3c | Push при publish события | §7 | [06](../features/content/06-bot-digest-subscriptions.md) |
| 3d | Read later: пятничный дайджест в боте | §7 | [33](../features/content/33-editorial-articles-longreads-retention.md) |
| — | HTML carousel + client video studio | §6, §13 | [35](../features/content/35-html-carousel-video-studio.md) |
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

---

**Последнее обновление:** 03.06.2026 · активных: **004–005, 018** (3a) · запланировано: **019–021** (3b, `todo`) · бэклог: **3c+**
