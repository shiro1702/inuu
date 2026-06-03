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

## Текущий вектор (01.06.2026)

**Волна 2b закрыта** (TASK-008–010): classifier → router → cheerio fast lane + `scraping_alerts`. Runbook: [TASK-008-web-parsing-pipeline.md](./TASK-008-web-parsing-pipeline.md).

**Следующий фокус:** вернуть **TASK-004** (каталог источников Улан-Удэ) после smoke на 2 `cron_enabled` URL и `NUXT_WEB_CLASSIFIER_ENABLED=true` на dev.

**Отложено:** TASK-005 (санитар/TL;DR), TASK-006 (guides без AI-дайджеста — см. TASK-012).

**Закрыто:** TASK-012 — AI-подборки и дайджест недели (cron + Groq).

**Следующий фокус (контент/UX):** TASK-014 — редакционные статьи, read later, публичный guides API (брейншторм [03.06.2026](../../fix/brainstorm/03.06.2026.md)). TASK-015 (Groq multiplier) — whitelist тегов готов (TASK-013).

Индексы брейнштормов: [01.06.2026](../../fix/brainstorm/01.06.2026.md), [02.05.2026](../../fix/brainstorm/02.05.2026.md), [03.06.2026](../../fix/brainstorm/03.06.2026.md).

---

## Активные задачи

> **Очередь:** 2 задачи · лимит 3.

### TASK-014 · Редакционные статьи: API, read later, venue-блок

- **Статус:** `in_progress`
- **Матрица:** §6 «Публичный API guides» · «Привязка portal vs venue» · «Читать потом»
- **Цель:** пользователь читает новости/лонгриды на витрине, сохраняет «на потом», видит статьи на карточке venue
- **Спеки:** [33-editorial-articles-longreads-retention.md](../features/content/33-editorial-articles-longreads-retention.md), [03-recommended-mvp.md](../features/content/03-recommended-mvp.md), [01-news-editorial-options.md](../features/content/01-news-editorial-options.md)
- **In scope:**
  - `GET /api/cities/[slug]/editorial` + detail + venue mentions
  - Страницы `/guides/[slug]`, журнал на главной
  - `body_json` минимум: paragraph, image, `place_embed`
  - `user_saved_editorial` + UI «🔖 Читать потом»
  - Scroll depth events (50% / 100%)
- **Out of scope:** Groq multiplier (TASK-015), HTML/video studio ([35](../features/content/35-html-carousel-video-studio.md)), пятничный cron бота, offline cache, маршрут one-click, TTS
- **Ключевые файлы:** `supabase/migrations/`, `server/api/cities/`, `pages/[city_slug]/guides/`, `components/editorial/`
- **Критерии готовности:** чеклист в [33](../features/content/33-editorial-articles-longreads-retention.md#критерии-готовности-task-014)
- **Заметки:** поглощает часть отложенного TASK-006 (guides API); dashboard CRUD — отдельно

### TASK-015 · Groq content multiplier в manager chat

- **Статус:** `todo`
- **Матрица:** §5 «Groq editorial pipeline» · §6 «Content multiplier»
- **Цель:** админ кидает forward/URL/voice в manager chat → Groq preview → publish editorial + story анонс + текстовый «пак 6 форматов»
- **Спеки:** [34-groq-editorial-content-multiplier.md](../features/content/34-groq-editorial-content-multiplier.md), [30-manager-chat-place-editorial.md](../features/content/30-manager-chat-place-editorial.md)
- **In scope:**
  - Расширить parse-editorial: рерайт, entity match venue, теги из whitelist (TASK-013)
  - Preview card + кнопки Опубликовать / Пак контента / Отмена
  - 6 текстовых блоков multiplier в TG
  - Publish → `editorial_posts` + story campaign link
- **Out of scope:** PNG/HTML render ([35](../features/content/35-html-carousel-video-studio.md)), vibe TG delivery ([36](../features/content/36-bot-vibes-editorial-delivery.md)), gen-cover AI
- **Ключевые файлы:** `server/api/ai/parse-editorial`, manager chat handlers, `server/utils/groqEditorial*.ts`
- **Критерии готовности:** чеклист в [34](../features/content/34-groq-editorial-content-multiplier.md#критерии-готовности-task-015)
- **Заметки:** зависит от TASK-013 (whitelist) и TASK-014 (куда публиковать на витрине)

---

## Отложено (волна 2a — контент / наполнение)

> Статус `paused` · не считаются в лимите 3 активных · в матрице остаются `[ ]`.

| ID | Название | Почему отложено | Вернуть когда |
|----|----------|-----------------|---------------|
| TASK-004 | Каталог источников Улан-Удэ + backfill | Приоритет: довести web crawl до classifier/rules | **Сейчас** — 008–010 done |
| TASK-005 | Санитар + TL;DR / vibe на карточках | Не блокирует web pipeline | После первых approve из 004 или параллельно |
| TASK-006 | Guides + публичный editorial API | Редакционный слой; **guides API → TASK-014** | TASK-014 частично или параллельно 015 |

<details>
<summary>TASK-004 — полный scope (свернуто)</summary>

- **Матрица:** §4 Ingestion · §8 «Регистрация источников»
- **Спеки:** [10](../features/content/10-telegram-sources-without-bot-access.md), [17](../features/content/17-ingest-sources-context.md)
- **In scope:** seed 12–20 TG + 4–6 web, backfill userbot, ≥15 published events
- **Критерии:** см. историю в git до 01.06.2026

</details>

<details>
<summary>TASK-005 — полный scope (свернуто)</summary>

- **Матрица:** §4 санитар · TL;DR + vibe
- **Спеки:** [22](../features/content/22-ai-bot-concierge-and-intent.md), [16](../features/content/16-parsing-pipeline-extensions.md)
- **In scope:** `events.tldr`, `vibe_emoji`, enrich после Groq, `CityEventCard`

</details>

<details>
<summary>TASK-006 — полный scope (свернуто)</summary>

- **Матрица:** §6 guides API · публичные страницы editorial
- **Спеки:** [03](../features/content/03-recommended-mvp.md), [14](../features/content/14-digests-curated-admin-smm.md) (без cron)
- **In scope:** `/guides`, editorial API; **без** AI/cron дайджеста (см. TASK-012)

</details>

---

## Бэклог волны 3 (не активно)

| ID / тема | Фокус | Матрица | Спека |
|-----------|--------|---------|-------|
| — | HTML carousel + client video studio | §6, §13 | [35](../features/content/35-html-carousel-video-studio.md) |
| — | Editorial delivery по вайбам в TG | §7 | [36](../features/content/36-bot-vibes-editorial-delivery.md) |
| — | Groq: `publication_date` + расширенные поля JSON | §4 | [25](../features/content/25-groq-event-extraction-prompt.md) |
| — | VK wall + `t.me/s/` workers | §4 | [27](../features/content/27-ingest-workers-vk-telegram-web.md) |
| — | `post_type`: отмена / перенос / sold-out | §4 | [16](../features/content/16-parsing-pipeline-extensions.md) |
| — | Cross-platform Share (TG/MAX/Web) | §2 | [28](../features/content/28-omnichannel-share-and-tma-funnel.md) |
| — | NLP admin Tool Calling | §5 / §10 | [29](../features/content/29-nlp-admin-and-organizer-agent.md) |
| — | Сжатие афиш WebP при ingest | §4 | [24](../features/content/24-mvp-launch-checklist-ulan-ude.md) |
| — | Bot: QR + helpdesk + scanner | §5, §9 | [23](../features/content/23-bot-roles-ops-support.md) |
| — | Mini App tab bar, checkout | §2 | [21](../features/content/21-mini-app-and-web-wireframes.md) |
| TASK-012 | AI cron: черновик `week-YYYY-wNN` + Groq intro | §6 | [14](../features/content/14-digests-curated-admin-smm.md), [11](../features/content/11-digest-parsing-and-curated-picks.md) |

Индексы брейнштормов: [30.05.2026](../../fix/brainstorm/30.05.2026.md), [31.05.2026](../../fix/brainstorm/31.05.2026.md), [01.06.2026](../../fix/brainstorm/01.06.2026.md), [02.05.2026](../../fix/brainstorm/02.05.2026.md), [03.06.2026](../../fix/brainstorm/03.06.2026.md).

---

## Архив

| ID | Название | Закрыто | Коммит / PR |
|----|----------|---------|-------------|
| TASK-000 | Userbot: подписка на TG-каналы → ingest | 31.05.2026 | `workers/telegram-userbot/`, `035_city_telegram_sources.sql` |
| TASK-003 | Публичные org/venue и афиша на витрине | 31.05.2026 | [TASK-003-public-org-venue-storefront.md](./TASK-003-public-org-venue-storefront.md) |
| TASK-001 | Пре-фильтр + context_type + strict tags в Groq | 31.05.2026 | `contentPrefilter.ts`, `eventParsePrompt.ts`, `036_city_ingest_sources.sql` |
| TASK-002 | Web CRON + shadow org (plain text MVP) | 31.05.2026 | `web-sources-crawl.post.ts`, `ingestShadowOrg.ts`, `vercel.json` |
| TASK-007 | Dashboard: ingest-источники (web cron, TG, shadow org) | 31.05.2026 | `DashboardIngestSourcesPanel.vue`, ingest-sources API, `038_city_telegram_sources_org.sql` |
| TASK-008 | Web ingest: схема + HTML sanitize | 01.06.2026 | `039_web_parsing_strategy.sql`, `webPageSanitizer.ts`, `webPageFetch.ts` |
| TASK-009 | Groq classifier + router в web cron | 01.06.2026 | `groqWebPageClassifier.ts`, `webCrawlRouter.ts`, `NUXT_WEB_CLASSIFIER_ENABLED` |
| TASK-010 | parsing_rules fast lane + alerts UI | 01.06.2026 | `webParsingRulesApply.ts`, `scraping_alerts` API, `parsedEvents` in ingest |
| TASK-011 | Manager chat: обзоры мест, посты и stories | 01.06.2026 | [30-manager-chat-place-editorial.md](../features/content/30-manager-chat-place-editorial.md) |
| TASK-012 | AI-подборки и дайджест недели | 02.06.2026 | `city-digest.post.ts`, `curatedListSelection.ts`, `groqCuratedListCopy.ts`, `/pick list <slug>` |
| TASK-013 | Мастер-список тегов-вайбов (taxonomy) | 03.06.2026 | `042_city_content_tags_vibes_seed.sql`, `contentTagCatalog.ts`, grouped UI |

---

**Последнее обновление:** 03.06.2026 · активных: **014** (`in_progress`), **015** (`todo`) · отложено: **004–006** · архив: **012–013** done
