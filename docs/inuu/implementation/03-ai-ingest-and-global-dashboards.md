# Реализация: AI ingest + глобальные дашборды

Документ фиксирует, что уже реализовано в коде по двум направлениям:

1. AI-парсинг контента (Groq) и ingestion pipeline.
2. Глобальные дашборды по городам (manager/admin).

---

## Что реализовано (backend)

### AI parsing / ingestion

- `POST /api/ai/parse-event`  
  Быстрый parse-only endpoint (без записи в очередь).
- `POST /api/ingest/content/submit`  
  Полный ingestion: parse -> dedupe -> moderation status -> optional persist.

Ключевые файлы:

- `server/utils/ai/eventParseSchema.ts` — Zod-схемы input/output.
- `server/utils/ai/groqEventParser.ts` — Groq client, prompt, retry, normalize.
- `server/api/ai/parse-event.post.ts` — parse-only API.
- `server/api/ingest/content/submit.post.ts` — ingestion API.

### Логирование AI (наблюдаемость)

- Миграция: `supabase/migrations/023_inuu_ai_parse_logs.sql`
- Таблица: `public.ai_parse_logs`
- Логгер: `server/utils/ai/aiParseLogs.ts`

Логи пишутся из:

- `server/api/ai/parse-event.post.ts`
- `server/api/ingest/content/submit.post.ts`

### Dashboard API для AI логов

- `GET /api/dashboard/ai/parse-logs`
- `GET /api/dashboard/ai/parse-logs-stats`

Файлы:

- `server/api/dashboard/ai/parse-logs.get.ts`
- `server/api/dashboard/ai/parse-logs-stats.get.ts`

### Глобальные дашборды по городам

#### Manager scope (города, где пользователь состоит в `shop_members`)

- `GET /api/dashboard/manager/cities`
- `GET /api/dashboard/manager/cities/:slug/overview`

Файлы:

- `server/api/dashboard/manager/cities.get.ts`
- `server/api/dashboard/manager/cities/[slug]/overview.get.ts`

#### Platform admin scope (все города платформы)

- `GET /api/dashboard/admin/cities`
- `GET /api/dashboard/admin/cities/:slug/overview`

Файлы:

- `server/api/dashboard/admin/cities.get.ts`
- `server/api/dashboard/admin/cities/[slug]/overview.get.ts`
- `server/utils/dashboardGlobal.ts` (проверка platform-admin роли)

---

## Модель доступа

### Manager

Используется существующий `requireDashboardAccess` + membership в `shop_members`.

Менеджер видит только те города, где у него есть хотя бы одна организация (`shop`) через membership.

### Platform admin

Используется `requirePlatformAdminAccess`:

- сперва проверка `user_metadata.platform_role` / `app_metadata.platform_role`,
- fallback: `profiles.metadata.platform_role`.

Разрешенные роли:

- `platform_admin`
- `super_admin`

---

## Схема миграций и env

### Новые переменные окружения

- `NUXT_GROQ_API_KEY`
- `NUXT_GROQ_MODEL` (default: `llama-3.3-70b-versatile`)

Определены в:

- `nuxt.config.ts`
- `.env.example`

### Новая миграция

- `023_inuu_ai_parse_logs.sql` (таблица логов AI parser)

---

## Ограничения текущей версии

- Ingestion записывает в `content_submissions`, если таблица/колонки доступны в БД.
- Dedupe сейчас эвристический (`title + date`) по `events`.
- Глобальные dashboard endpoints серверные; UI-страницы для них еще не реализованы.

---

## Следующие шаги

1. Добавить frontend-страницы для `/dashboard/manager/*` и `/dashboard/admin/*`.
2. Добавить bootstrap endpoint для выбора режима (`manager`/`platform_admin`).
3. Доработать дедупликацию по `source_external_id` на уровне уникального индекса.
4. Расширить ingestion до автоматической отправки в чат модерации.
