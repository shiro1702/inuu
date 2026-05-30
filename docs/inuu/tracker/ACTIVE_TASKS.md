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
- **Статус:** `todo` | `in_progress` | `done` | `cancelled`
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

## Текущий вектор (30.05.2026)

**Наполнить БД событиями** через парсер (TG + web) и **привести витрину** к виду, где parsed-контент виден пользователю: карточки → организатор / venue → подборки и stories (следующая волна после org-страниц).

---

## Активные задачи

### TASK-001 · Пре-фильтр и контекст источника в Groq-парсере

- **Статус:** `todo`
- **Матрица:** §4 · «Пре-фильтр ключевых слов до Groq» · §4 · «Контекст источника в промпте»
- **Цель:** Больше событий в очередь при тех же затратах Groq — отсечь мусор до LLM и точнее парсить по типу площадки (театр / клуб / стендап).
- **Спеки:**
  - [16-parsing-pipeline-extensions.md](../features/content/16-parsing-pipeline-extensions.md) — пре-фильтр, один промпт
  - [17-ingest-sources-context.md](../features/content/17-ingest-sources-context.md) — `context_type` в system prompt
  - [08-event-sourcing-and-moderation-pipeline.md](../features/content/08-event-sourcing-and-moderation-pipeline.md) — цепочка submit
- **In scope:**
  - Модуль пре-фильтра (regex дат/цен + ключевые слова: афиша, билет, отмена, перенос…) **до** вызова Groq; лог «skipped by prefilter» в `ai_parse_logs`
  - Поле `context_type` на источнике (или fallback из parser chat metadata) → подстановка в system prompt
  - Подстановка словаря `city_content_tags` в промпт (1 категория + 1–5 тегов из БД)
  - Unit/интеграционная проверка на 5–10 реальных постах из moderation/parser чата
- **Out of scope:** Vision cross-check, `post_type` cancellation/update, userbot worker, dashboard CRUD источников
- **Ключевые файлы:**
  - `server/utils/` — groq parser, ingest submit
  - `server/api/ingest/content/submit.post.ts`
  - `server/api/ai/parse-event.post.ts`
- **Критерии готовности:**
  - [ ] ≥50% явного мусора (реклама без даты, поздравления) не доходит до Groq
  - [ ] Пост из «театрального» источника не галлюцинирует line-up / dress code
  - [ ] Теги в JSON только из словаря города
  - [ ] FEATURE_MATRIX: две строки → `[x]`

---

### TASK-002 · Web CRON парсинг + теневые профили организаций

- **Статус:** `todo`
- **Матрица:** §4 · «Web CRON парсинг сайтов» · §3 · «Теневые профили org из парсера + claim»
- **Цель:** Автоматически подтягивать афиши с сайтов организаторов Улан-Удэ и создавать черновые страницы org для связи событий.
- **Спеки:**
  - [17-ingest-sources-context.md](../features/content/17-ingest-sources-context.md) — web-cron, shadow org, dedupe
  - [10-telegram-sources-without-bot-access.md](../features/content/10-telegram-sources-without-bot-access.md) — тот же `POST /api/ingest/content/submit`
  - [15-event-detail-series-venues.md](../features/content/15-event-detail-series-venues.md) — `source_url`, `organization_id`
- **In scope:**
  - Миграция/расширение `sources` (или аналог): `url`, `context_type`, `organization_id`, `cron_enabled`
  - Cron route (Vercel cron / `server/api/cron/…`): обход 2–3 whitelist-сайтов Улан-Удэ
  - Fetch страницы → существующий URL enricher + Groq → `content_submissions` (как TG ingest)
  - При первом событии с нового домена/@channel: создать `organizations` с `is_claimed=false`, привязать `source`
  - Dedupe по `source_url` / fingerprint — skip если уже в БД
- **Out of scope:** Puppeteer/Cloudflare bypass, полный claim-flow в UI, VK ingest, dashboard «регистрация источника»
- **Ключевые файлы:**
  - `supabase/migrations/` — sources / organizations
  - `server/api/cron/` (новый)
  - `server/api/ingest/content/submit.post.ts`
  - `vercel.json` — cron schedule
- **Критерии готовности:**
  - [ ] Cron по расписанию создаёт `content_submissions` с минимум одного whitelist-сайта
  - [ ] Новый источник → запись `organizations` (shadow) + link в submission payload
  - [ ] Повторный crawl того же URL не плодит дубликаты
  - [ ] FEATURE_MATRIX: две строки → `[x]` (или `[~]`→`[x]` если claim только частично — тогда claim в TASK-003)

---

### TASK-003 · Публичные страницы org/venue и афиша на витрине

- **Статус:** `todo`
- **Матрица:** §3 · «Страница организатора / источника + подписка» · §3 · «Афиша всех событий на странице venue» · §6 · «Stories города на главной» (частично)
- **Цель:** Parsed-события из TASK-001/002 видны на сайте: пользователь кликает организатора / venue и видит их афишу; главная показывает stories.
- **Спеки:**
  - [15-event-detail-series-venues.md](../features/content/15-event-detail-series-venues.md) — места, org, блок «источник»
  - [17-ingest-sources-context.md](../features/content/17-ingest-sources-context.md) — `native` vs `parsed`, CTA
  - [03-core-platform.md](../03-core-platform.md) — stories на главной
  - [verticals/events-and-venues.md](../verticals/events-and-venues.md)
- **In scope:**
  - `GET /api/cities/[slug]/organizations/[orgSlug]` + страница `/[city_slug]/organizations/[slug]` — афиша upcoming events
  - На карточке события: блок «Организатор» / «Источник: @channel» со ссылкой
  - Страница venue: блок «События здесь» (API filter `venue_id`)
  - Stories: данные из `home.get.ts` уже есть — довести UI на главной (компонент stories, если заглушка)
  - CTA parsed-события: «Купить на сайте организатора» (`registration_url` / `source_url`)
- **Out of scope:** Подписка на org (push), claim org в ЛК, chips дат / «похожие», cron-подборки, admin CRUD подборок
- **Ключевые файлы:**
  - `server/api/cities/[slug]/home.get.ts`
  - `server/api/cities/[slug]/organizations/` (новый)
  - `pages/[city_slug]/organizations/` (новый)
  - `pages/[city_slug]/venues/` — афиша
  - `pages/[city_slug]/events/` — блок org/source
  - Vue-компонент stories (см. `03-core-platform.md`)
- **Критерии готовности:**
  - [ ] Опубликованное parsed-событие с `organization_id` → кликабельная страница org с ≥1 событием
  - [ ] Venue с событиями показывает список на своей странице
  - [ ] Главная города показывает ≥1 story из API (не пустой placeholder)
  - [ ] FEATURE_MATRIX: venue afisha + org page → `[x]`; stories → `[~]` или `[x]` по факту глубины UI

---

## Следующая волна (не активно)

Появятся здесь после закрытия TASK-001…003:

| Тема | Матрица | Спека |
|------|---------|-------|
| `post_type`: отмена / перенос / sold-out | §4 | [16](../features/content/16-parsing-pipeline-extensions.md) |
| Cron-черновики подборок (Пт–Вс, ⭐4+) | §6 | [14](../features/content/14-digests-curated-admin-smm.md) |
| Подписка на организатора + push при publish | §3, §7 | [15](../features/content/15-event-detail-series-venues.md), [06](../features/content/06-bot-digest-subscriptions.md) |

---

## Архив

| ID | Название | Закрыто | Коммит / PR |
|----|----------|---------|-------------|
| — | *(пусто)* | — | — |

---

**Последнее обновление:** 30.05.2026 · активных: **3** · in_progress: **0**
