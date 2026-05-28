# Страницы dashboard: AI + city ops

Документация по новым страницам и API для проверки AI ingestion, ручного создания новостей и управления городскими каналами TG/MAX.

---

## Новые страницы

## `dashboard/content-ai`

Файл: `pages/dashboard/content-ai.vue`

Назначение:

- единая рабочая страница менеджера контента.

Что можно сделать:

1. Выбрать город из manager scope.
2. Настроить per-city каналы:
   - Telegram manager chat id
   - Telegram moderation chat id
   - Telegram parser source chats
   - MAX manager chat id
   - MAX moderation chat id
   - MAX parser source chats
3. Протестировать AI:
   - parse-only
   - ingest (без persist)
   - ingest + persist
4. Создать новость вручную в `editorial_posts`.
5. Управлять очередью `content_submissions`:
   - фильтр по статусам
   - approve/reject/needs_revision
   - score 1..5
   - inline edit payload

---

## `dashboard/manager/cities`

Файл: `pages/dashboard/manager/cities.vue`

Показывает города, где пользователь имеет доступ через `shop_members`.

---

## `dashboard/manager/cities/:slug/overview`

Файл: `pages/dashboard/manager/cities/[slug]/overview.vue`

Метрики менеджера в пределах его scope:

- shops
- venues
- events
- bookings

---

## `dashboard/admin/cities`

Файл: `pages/dashboard/admin/cities.vue`

Глобальный обзор городов для platform admin.

---

## `dashboard/admin/cities/:slug/overview`

Файл: `pages/dashboard/admin/cities/[slug]/overview.vue`

Детальный обзор города для центральной администрации:

- shops/members
- venues/events
- editorial/stories
- AI parse recent success/fail

---

## API для страниц

### Manager city scope

- `GET /api/dashboard/manager/cities`
- `GET /api/dashboard/manager/cities/:slug/overview`
- `GET /api/dashboard/manager/cities/:slug/content-settings`
- `PUT /api/dashboard/manager/cities/:slug/content-settings`
- `POST /api/dashboard/manager/cities/:slug/editorial-news`
- `GET /api/dashboard/manager/cities/:slug/content-queue`
- `POST /api/dashboard/manager/cities/:slug/content-queue/action`
- `PUT /api/dashboard/manager/cities/:slug/content-queue/:id`

### Admin scope

- `GET /api/dashboard/admin/cities`
- `GET /api/dashboard/admin/cities/:slug/overview`

### AI helpers

- `POST /api/ai/parse-event`
- `POST /api/ingest/content/submit`
- `GET /api/dashboard/ai/parse-logs`
- `GET /api/dashboard/ai/parse-logs-stats`

---

## Права доступа

### Manager

Проверка через:

- `requireDashboardAccess`
- `resolveManagerCityScopeOrThrow`

Ограничение:

- доступ только к городам, где есть membership в `shop_members`.

### Platform admin

Проверка через:

- `requirePlatformAdminAccess` (`server/utils/dashboardGlobal.ts`)

Роли:

- `platform_admin`
- `super_admin`

---

## Миграции

- `023_inuu_ai_parse_logs.sql` — логи AI parser.
- `024_inuu_city_content_ops_settings.sql` — `cities.content_ops_settings`.

---

## Навигация в UI

В `layouts/dashboard.vue` добавлены ссылки:

- `Контент AI`
- `Города менеджера`
- `Города admin`

---

## Быстрый smoke-тест

1. Открыть `/dashboard/content-ai`.
2. Выбрать город.
3. Сохранить TG/MAX settings.
4. Выполнить Parse only.
5. Выполнить Ingest + persist.
6. Убедиться, что запись появилась в Queue.
7. Применить action `approve`.
8. Создать manual новость через форму.


/dashboard/content-ai — проверка AI + ingestion + ручное добавление новостей + queue + настройки TG/MAX по городу
/dashboard/manager/cities — список городов менеджера
/dashboard/manager/cities/:slug/overview — overview города в manager scope (пример: /dashboard/manager/cities/ulan-ude/overview)
/dashboard/admin/cities — глобальный список городов для platform admin
/dashboard/admin/cities/:slug/overview — детальный overview города для platform admin (пример: /dashboard/admin/cities/ulan-ude/overview)
