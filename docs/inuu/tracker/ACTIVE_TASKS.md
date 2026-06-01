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

**Волна 2b — web-парсинг:** от «plain text на корневой URL» к конвейеру **classifier → router → CSS rules / fallback** ([26](../features/content/26-web-scraping-classifier-and-rules.md)).

Runbook исполнения: **[TASK-008-web-parsing-pipeline.md](./TASK-008-web-parsing-pipeline.md)**.

**Отложено:** наполнение каталога TG + backfill, санитар/TL;DR, guides/cron (TASK-004–006) — вернёмся после стабильного web crawl.

Индекс брейншторма: [01.06.2026](../../fix/brainstorm/01.06.2026.md) · baseline cron: [TASK-002](./ACTIVE_TASKS.md#архив) (архив).

---

## Активные задачи

> **Очередь:** 3 задачи · волна 2b (web-парсинг) · `todo`.

### TASK-008 · Web ingest: схема + HTML sanitize

- **Статус:** `todo`
- **Матрица:** §4 «Web: `parsing_strategy` / `parsing_rules` в БД» · §8 dashboard ingest
- **Цель:** Подготовить БД и единый fetch/sanitize HTML перед classifier и cheerio.
- **Спеки:** [26](../features/content/26-web-scraping-classifier-and-rules.md), [17](../features/content/17-ingest-sources-context.md), [TASK-008-web-parsing-pipeline.md](./TASK-008-web-parsing-pipeline.md) § TASK-008
- **In scope:**
  - Миграция: `city_web_sources.parsing_strategy`, `parsing_rules`, `rules_validated_at`; таблица `scraping_alerts`
  - `server/utils/webPageSanitizer.ts` + `webPageFetch.ts` (timeout, UA, strip script/style/header/footer, links[], text ≤3k)
  - Типы в `ingestSourcesDashboard.ts`; API GET/PUT отдают новые поля
  - Dashboard: read-only блок «стратегия / rules» + кнопка «Сбросить strategy» (без classifier пока)
- **Out of scope:** Groq classifier, apply rules, очередь child URL
- **Ключевые файлы:** `supabase/migrations/039_*`, `server/api/cron/web-sources-crawl.post.ts`, `server/utils/ingestSourcesDashboard.ts`, `components/dashboard/DashboardIngestSourcesPanel.vue`
- **Критерии готовности:**
  - [ ] Миграция на dev; существующий cron не ломается (можно ещё вызывать `fetchUrlPlainText` до 009)
  - [ ] `sanitizeWebPage(url)` — unit-тест на fixture HTML
  - [ ] Dashboard показывает `parsing_strategy` / `parsing_rules` для web-источника
- **Заметки:** Номер миграции `039` — проверить конфликт с незакоммиченными миграциями в ветке.

---

### TASK-009 · Groq classifier + router в web cron

- **Статус:** `todo`
- **Матрица:** §4 «Web: Groq classifier (`page_type`)» · §4 «Web: router (list / single / wall)»
- **Цель:** Определять тип страницы и ветвить crawl вместо одного blind `runContentIngest` на index URL.
- **Спеки:** [26](../features/content/26-web-scraping-classifier-and-rules.md), [TASK-008-web-parsing-pipeline.md](./TASK-008-web-parsing-pipeline.md) § TASK-009
- **In scope:**
  - `groqWebPageClassifier.ts` + Zod schema (`page_type`, `event_urls[]`, `confidence`)
  - `webCrawlRouter.ts`: ветки `single_event`, `event_list_links` (до 5 URL/прогон), `text_wall`, `unknown` → `scraping_alerts`
  - Кэш: писать `parsing_strategy` в `city_web_sources`; повторный classify по правилам из runbook
  - Интеграция в `web-sources-crawl.post.ts`; summary: `classified`, `child_urls_fetched`, `alerts`
  - `tests/webPageClassifier.spec.ts` (fixtures)
- **Out of scope:** CSS fast lane, rules generator, Puppeteer, VK
- **Ключевые файлы:** `server/utils/ai/groqWebPageClassifier.ts`, `server/utils/webCrawlRouter.ts`, `web-sources-crawl.post.ts`
- **Критерии готовности:**
  - [ ] List-страница (fixture) → ≥1 ingest с дочернего URL
  - [ ] `unknown` → alert, без submission
  - [ ] Повторный cron с валидной strategy не дергает classifier (smoke log)
- **Заметки:** Зависит от TASK-008. Feature flag `WEB_CLASSIFIER_ENABLED` — опционально для поэтапного деплоя.

---

### TASK-010 · parsing_rules: fast lane, auto-healing, alerts UI

- **Статус:** `todo`
- **Матрица:** §4 «Web: cheerio fast lane + auto-healing» · §4 «Web: `scraping_alerts` + dashboard»
- **Цель:** Парсить типовые страницы событий без Groq event parse; при поломке верстки — self-heal или fallback.
- **Спеки:** [26](../features/content/26-web-scraping-classifier-and-rules.md), [25](../features/content/25-groq-event-extraction-prompt.md) (fallback text), [TASK-008-web-parsing-pipeline.md](./TASK-008-web-parsing-pipeline.md) § TASK-010
- **In scope:**
  - `groqParsingRulesGenerator.ts` + `webParsingRulesApply.ts` (селекторы, `@src` для poster)
  - Fast lane → heal (1 retry) → fallback `runContentIngest(text)` как сейчас
  - Structured path: собранный payload → `runContentIngest` с заполненными полями где возможно
  - Dashboard: список open `scraping_alerts`, resolve / reset rules
- **Out of scope:** Publication date в event prompt (отдельный backlog), агрегаторы Kassir/Яндекс
- **Ключевые файлы:** `server/utils/ai/groqParsingRulesGenerator.ts`, `server/utils/webParsingRulesApply.ts`, `contentIngestCore.ts`, `DashboardIngestSourcesPanel.vue`
- **Критерии готовности:**
  - [ ] Fixture single-event: submission без вызова groq event parser (mock/spy)
  - [ ] Сломанные rules → новые rules в БД после heal
  - [ ] Fallback работает как текущий cron
  - [ ] Менеджер видит и закрывает alert в UI
- **Заметки:** Зависит от TASK-009. После закрытия — smoke на 2 реальных `cron_enabled` URL.

---

## Отложено (волна 2a — контент / наполнение)

> Статус `paused` · не считаются в лимите 3 активных · в матрице остаются `[ ]`.

| ID | Название | Почему отложено | Вернуть когда |
|----|----------|-----------------|---------------|
| TASK-004 | Каталог источников Улан-Удэ + backfill | Приоритет: довести web crawl до classifier/rules | TASK-008–010 done + 2 боевых web URL |
| TASK-005 | Санитар + TL;DR / vibe на карточках | Не блокирует web pipeline | После первых approve из 004 или параллельно |
| TASK-006 | Guides + cron-черновики подборок | Редакционный слой после афиши | TASK-004 частично закрыт |

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

- **Матрица:** §6 guides API · cron дайджестов
- **Спеки:** [14](../features/content/14-digests-curated-admin-smm.md), [03](../features/content/03-recommended-mvp.md)
- **In scope:** `/guides`, editorial API, cron `week-YYYY-wNN` черновик

</details>

---

## Бэклог волны 3 (не активно)

| ID / тема | Фокус | Матрица | Спека |
|-----------|--------|---------|-------|
| — | Groq: `publication_date` + расширенные поля JSON | §4 | [25](../features/content/25-groq-event-extraction-prompt.md) |
| — | VK wall + `t.me/s/` workers | §4 | [27](../features/content/27-ingest-workers-vk-telegram-web.md) |
| — | `post_type`: отмена / перенос / sold-out | §4 | [16](../features/content/16-parsing-pipeline-extensions.md) |
| — | Cross-platform Share (TG/MAX/Web) | §2 | [28](../features/content/28-omnichannel-share-and-tma-funnel.md) |
| — | NLP admin Tool Calling | §5 / §10 | [29](../features/content/29-nlp-admin-and-organizer-agent.md) |
| — | Сжатие афиш WebP при ingest | §4 | [24](../features/content/24-mvp-launch-checklist-ulan-ude.md) |
| — | Bot: QR + helpdesk + scanner | §5, §9 | [23](../features/content/23-bot-roles-ops-support.md) |
| — | Mini App tab bar, checkout | §2 | [21](../features/content/21-mini-app-and-web-wireframes.md) |

Индексы брейнштормов: [30.05.2026](../../fix/brainstorm/30.05.2026.md), [31.05.2026](../../fix/brainstorm/31.05.2026.md), [01.06.2026](../../fix/brainstorm/01.06.2026.md).

---

## Архив

| ID | Название | Закрыто | Коммит / PR |
|----|----------|---------|-------------|
| TASK-000 | Userbot: подписка на TG-каналы → ingest | 31.05.2026 | `workers/telegram-userbot/`, `035_city_telegram_sources.sql` |
| TASK-003 | Публичные org/venue и афиша на витрине | 31.05.2026 | [TASK-003-public-org-venue-storefront.md](./TASK-003-public-org-venue-storefront.md) |
| TASK-001 | Пре-фильтр + context_type + strict tags в Groq | 31.05.2026 | `contentPrefilter.ts`, `eventParsePrompt.ts`, `036_city_ingest_sources.sql` |
| TASK-002 | Web CRON + shadow org (plain text MVP) | 31.05.2026 | `web-sources-crawl.post.ts`, `ingestShadowOrg.ts`, `vercel.json` |
| TASK-007 | Dashboard: ingest-источники (web cron, TG, shadow org) | 31.05.2026 | `DashboardIngestSourcesPanel.vue`, ingest-sources API, `038_city_telegram_sources_org.sql` |

---

**Последнее обновление:** 01.06.2026 · активных: **3** (волна 2b web, `todo`) · отложено: **004–006** · in_progress: **0**
