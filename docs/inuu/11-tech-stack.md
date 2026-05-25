# Технический стек INUU (Nuxt 3 + Supabase)

Документация INUU описывает продукт в репозитории **incity-new**, а не October CMS из раннего brainstorm.

---

## Слои

| Слой | Технология | Назначение |
|------|------------|------------|
| Frontend | **Nuxt 3**, Vue 3, **Pinia** | SSR/SSG витрина, dashboard, mini app |
| Стили | **Tailwind CSS** | UI витрины и дашборда |
| API | **Nitro** (`server/api/*`) | Бизнес-логика, webhooks, платежи |
| БД | **Supabase** (PostgreSQL) | Данные, RLS, Realtime, Storage |
| Auth | Supabase Auth + **Telegram Login** + **initData** (TG/MAX) | Клиент и партнёр |
| Файлы | **Supabase Storage** | Фото, stories, референсы заказов |
| Боты | Telegram Bot API, **MAX** Bot API | Уведомления, подписки, команды |
| Mini App | Telegram WebApp + MAX WebApp | `composables/useTelegram.ts` |
| Платежи | ЮKassa / Т-Банк | См. `docs/payments/` |
| Деплой | Vercel и/или VPS (Reg.ru) | См. `docs/runbooks/` |

---

## Структура репозитория (целевая для INUU)

```
pages/
  [city_slug]/                    # Витрина города (афиша INUU)
    index.vue                     # Главная: events, venues, stories
    events/[slug].vue
    venues/[slug].vue
    beauty/...
    map.vue
    legal/...
  dashboard/                      # ЛК партнёра (организатор, салон, редакция)
  platform/                     # Админ платформы (города, модерация)
server/
  api/                            # REST: bookings, events, favorites, webhooks
  utils/                          # notifications.ts, tenant, pricing
  middleware/                     # tenant.ts, auth
supabase/
  migrations/                     # Схема + RLS
composables/                      # useTelegram, useCity, useFavorites
stores/                           # Pinia
```

Ресторанные маршруты (`[city_slug]/[tenant_slug]/cart`, меню, кухня) **удаляются**; INUU использует `events`, `venues`, `bookings` в `[city_slug]/`.

---

## Мультитенант

- Таблица **`cities`**, колонка **`city_id`** во всех доменных таблицах INUU.
- Middleware: `middleware/redirect-city.global.ts` — `/` → `/{defaultCitySlug}`.
- `runtimeConfig.public.defaultCitySlug` (например `ulan-ude`).
- Подробно: [01-multitenant-architecture.md](./01-multitenant-architecture.md), [MULTI_TENANT_SAAS.md](../platform/MULTI_TENANT_SAAS.md).

---

## API (паттерны Nuxt)

| Задача | Паттерн |
|--------|---------|
| Публичный каталог | `GET /api/cities/[slug]/events` (или `$fetch` + server route) |
| Мутации клиента | `POST /api/...` + `resolveCustomerProfileId` |
| Дашборд партнёра | `server/api/dashboard/*` + RBAC по `shop_id` / `organization_id` |
| Webhooks | `server/api/webhook.post.ts`, `webhook-max.post.ts` |
| Уведомления | `dispatchNotificationEvent` в `server/utils/notifications.ts` |

Фильтры на MVP: query-параметры + Supabase `.filter()`; при росте каталога — полнотекст или RPC.

---

## Авторизация

| Канал | Реализация в репо |
|-------|-------------------|
| Сайт | Telegram Login Widget → `/api/auth/telegram`, cookie `tg_session` |
| Telegram Mini App | `initData` → валидация HMAC в API |
| MAX Mini App | `window.WebApp` + те же утилиты в `useTelegram.ts` |
| Профиль | `profiles` (`telegram_id`, `max_user_id`, …) |

Док: [TELEGRAM_AUTH_VIA_BOT_RU.md](../features/TELEGRAM_AUTH_VIA_BOT_RU.md).

---

## Медиа и Stories

- Загрузка: Supabase Storage + signed URL.
- Stories: переиспользовать модуль `dashboard/stories` (кампании, креативы, TTL).
- Просмотр на витрине: Vue-компонент (карусель / zuck.js по желанию).

---

## Email

- Транзакционные письма: Nitro + SMTP или сервис (Resend, UniSender) — отдельный env.
- Массовые рассылки INUU на старте — **Telegram/MAX**, email — подтверждения и резерв.

---

## Миграции и RLS

1. Схема INUU — `supabase/migrations/001_inuu_*.sql` … `019_inuu_seed_ulan_ude.sql` ([supabase/README.md](../../supabase/README.md)).
2. RLS: публичный read по `city_id` + `is_published`; write — владелец org / редакция.
3. Seed города Улан-Удэ в миграции или `supabase/seed.sql`.

---

## Переменные окружения (минимум)

См. корневой `.env.example`:

- `NUXT_PUBLIC_SUPABASE_URL`, ключи Supabase
- `NUXT_BOT_TOKEN`, `NUXT_TELEGRAM_BOT_NAME`
- Токены MAX mini app
- `NUXT_PUBLIC_DEFAULT_CITY_SLUG=ulan-ude`
- Ключи ЮKassa / Т-Банк (B2C и B2B раздельно)

---

## Что не используем

- October CMS, RainLab, Builder plugin
- Отдельный PHP-бэкенд для INUU
- MySQL как primary (только PostgreSQL через Supabase)

Brainstorm в [chat](../fix/brainstorm/chat) с October — исторический; реализация ведётся в **этом** monorepo.

---

## Связанные документы

- [10-existing-codebase.md](./10-existing-codebase.md) — наследие кода и вычистка
- [implementation/](./implementation/) — план рефакторинга
- [README.md](./README.md) — навигация по продукту
- [README.md](../../README.md) — быстрый старт репозитория
