# INUU — документация городского агрегатора

Структурированная спецификация **INUU** — гиперлокальный лайфстайл-агрегатор: услуги, события, места, контент и монетизация.

Первый город: **Улан-Удэ**. Архитектура с первого дня — **несколько городов** (мультитенант).

**Репозиторий:** `incity-new` — **Nuxt 3 + Supabase + Telegram/MAX Mini App**.

Исходный brainstorm (October CMS) — исторический: [fix/brainstorm/chat](../fix/brainstorm/chat). Реализация только в этом monorepo.

---

## Навигация

| Документ | Содержание |
|----------|------------|
| [11-tech-stack.md](./11-tech-stack.md) | Стек, структура репо, env |
| [00-product-vision.md](./00-product-vision.md) | Позиционирование, ЦА, отличие от 2GIS/Яндекс |
| [01-multitenant-architecture.md](./01-multitenant-architecture.md) | Мульти-город: `cities`, URL, RLS |
| [02-roles-and-access.md](./02-roles-and-access.md) | Роли и личные кабинеты |
| [03-core-platform.md](./03-core-platform.md) | Главная, поиск, избранное, booking, платежи |
| [04-features-priority.md](./04-features-priority.md) | Приоритизация фич |
| [05-roadmap-and-hypotheses.md](./05-roadmap-and-hypotheses.md) | Этапы, метрики, развилки |
| [06-monetization.md](./06-monetization.md) | Реклама, подписки, лиды |
| [07-notifications-channels.md](./07-notifications-channels.md) | TG/MAX, email, рассылки |
| [08-marketing-launch.md](./08-marketing-launch.md) | Запуск и маркетинг |
| [marketing/SMM_PARTNER_MESSAGES.md](./marketing/SMM_PARTNER_MESSAGES.md) | Сообщения для SMM-партнёра |
| [marketing/OUTREACH_B2B_PARTNERS.md](./marketing/OUTREACH_B2B_PARTNERS.md) | Первое касание B2B |
| [09-data-model-overview.md](./09-data-model-overview.md) | Схема БД Supabase |
| [10-existing-codebase.md](./10-existing-codebase.md) | Что оставить / вычистить в коде |
| [implementation/03-ai-ingest-and-global-dashboards.md](./implementation/03-ai-ingest-and-global-dashboards.md) | Что реализовано: AI ingest, логи, manager/admin dashboards |

### Реализация в репозитории

| Документ | Содержание |
|----------|------------|
| [implementation/README.md](./implementation/README.md) | План вычистки legacy и рефакторинга |
| [implementation/01-cleanup-unused.md](./implementation/01-cleanup-unused.md) | Удаление ресторанного функционала |
| [implementation/02-refactor-existing.md](./implementation/02-refactor-existing.md) | Переделка модулей под INUU |
| [implementation/03-ai-ingest-and-global-dashboards.md](./implementation/03-ai-ingest-and-global-dashboards.md) | Фиксация реализации AI ingest и глобальных dashboard API |
| [implementation/04-dashboard-pages-ai-and-city-ops.md](./implementation/04-dashboard-pages-ai-and-city-ops.md) | Документация по новым страницам dashboard и city-ops API |

### Runbooks (операционка)

| Документ | Содержание |
|----------|------------|
| [runbooks/MANAGER_CONTENT_RUNBOOK_RU.md](./runbooks/MANAGER_CONTENT_RUNBOOK_RU.md) | Ежедневная инструкция менеджера: ingestion, модерация, мониторинг |

### Контент: как добавлять новости и МК

| Документ | Содержание |
|----------|------------|
| [features/content/README.md](./features/content/README.md) | Обзор вариантов |
| [features/content/01-news-editorial-options.md](./features/content/01-news-editorial-options.md) | Новости, подборки, обзоры |
| [features/content/02-masterclasses-events-options.md](./features/content/02-masterclasses-events-options.md) | Мастер-классы и афиша |
| [features/content/03-recommended-mvp.md](./features/content/03-recommended-mvp.md) | Рекомендуемые фазы MVP |
| [features/content/04-telegram-bot-content-moderation.md](./features/content/04-telegram-bot-content-moderation.md) | TG-бот: контент и модерация заявок |
| [features/content/05-bot-news-dialog-script.md](./features/content/05-bot-news-dialog-script.md) | Скрипт диалога новостей в боте |
| [features/content/06-bot-digest-subscriptions.md](./features/content/06-bot-digest-subscriptions.md) | Рассылка подборок и подписки по темам в боте |
| [features/content/07-paid-news-publication.md](./features/content/07-paid-news-publication.md) | Оплата за публикацию новостей |
| [features/content/08-event-sourcing-and-moderation-pipeline.md](./features/content/08-event-sourcing-and-moderation-pipeline.md) | Конвейер наполнения: бот + парсер + AI + модерация |
| [features/content/09-how-to-create-news-and-events.md](./features/content/09-how-to-create-news-and-events.md) | Практическая инструкция: как создавать новости/события через новый backend |

### Вертикали

| Документ | Содержание |
|----------|------------|
| [verticals/beauty.md](./verticals/beauty.md) | Красота, запись, лист ожидания |
| [verticals/confectioners.md](./verticals/confectioners.md) | Кондитеры |
| [verticals/events-and-venues.md](./verticals/events-and-venues.md) | События, заведения, карта |
| [verticals/tourism-baikal.md](./verticals/tourism-baikal.md) | Туризм, Байкал |
| [verticals/news-and-editorial.md](./verticals/news-and-editorial.md) | Редакция, подборки |
| [verticals/advertising.md](./verticals/advertising.md) | Реклама |
| [verticals/local-brands.md](./verticals/local-brands.md) | Локальные бренды |
| [verticals/photo-creative.md](./verticals/photo-creative.md) | Фото, студии |

---

## Сквозные документы (вне `inuu/`)

| Тема | Документ |
|------|----------|
| Омниканал TG/MAX | [OMNICHANNEL_MULTITENANT_PLAN_RU.md](../platform/OMNICHANNEL_MULTITENANT_PLAN_RU.md) |
| Платежи | [PAYMENTS_RU_YOOKASSA_TBANK.md](../payments/PAYMENTS_RU_YOOKASSA_TBANK.md) |
| UX агрегатора | [AGGREGATOR_UX_FEATURES_RU.md](../features/AGGREGATOR_UX_FEATURES_RU.md) |
| Термины UI | [TERMS.md](../reference/TERMS.md) |
| Legacy PocketMenu | [archive/README.md](../archive/README.md) |

---

## Стек (кратко)

| Слой | Технология |
|------|------------|
| Frontend | Nuxt 3, Vue 3, Pinia, Tailwind |
| Backend | Nitro (`server/api`) |
| БД | Supabase (PostgreSQL + RLS + Storage) |
| Auth | Supabase + Telegram Login + initData (TG/MAX) |
| Mini App | Telegram / MAX WebApp |
| Уведомления | `server/utils/notifications.ts`, webhooks |

Подробно: **[11-tech-stack.md](./11-tech-stack.md)**.
