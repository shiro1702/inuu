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

**Волна 3a закрыта:** TASK-004, 005, 018 → архив.

**Следующая волна 3b:** TASK-019–021 (запланировано ниже) — можно брать в активные (лимит 3).

Индексы брейнштормов: [01.06.2026](../../fix/brainstorm/01.06.2026.md), [02.05.2026](../../fix/brainstorm/02.05.2026.md), [03.06.2026](../../fix/brainstorm/03.06.2026.md).

---

## Активные задачи

> **Слоты свободны** (0/3). Старт 3b: `@ACTIVE_TASKS.md` + взять TASK-019 в `in_progress`.

---

## Запланировано · Волна 3b — «Качество ingest + карточка»

> Статус `todo` · **не в лимите 3 активных** · старт после волны 3a.  
> Очередь волны: **3 задачи** (по одной в активных или параллельно).

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
| TASK-004 | Каталог источников Улан-Удэ + backfill | 03.06.2026 | `045_wave3a_ulan_ude_ingest_sources.sql`, [runbook](./TASK-004-ulan-ude-sources-backfill.md) |
| TASK-005 | Санитар + TL;DR + vibe на карточках | 03.06.2026 | `046_events_tldr_vibe.sql`, `CityEventCard.vue`, Groq parse/publish |
| TASK-018 | Groq `publication_date` + `post_type` | 03.06.2026 | `eventIngestPostType.ts`, `contentIngestCore.ts`, `tests/eventIngestPostType.spec.ts` |

---

**Последнее обновление:** 03.06.2026 · активных: **0** · запланировано: **019–021** (3b, `todo`) · бэклог: **3c+**
