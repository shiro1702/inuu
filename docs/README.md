# Документация INUU

**INUU** — гиперлокальный лайфстайл-агрегатор города (афиша, места, запись, туризм, редакция). Репозиторий **incity-new**: Nuxt 3 + Supabase + Telegram/MAX Mini App.

**Канон продукта и архитектуры:** [inuu/README.md](inuu/README.md).

**Карта папок и правила «куда класть новое»:** [STRUCTURE.md](STRUCTURE.md).

---

## Быстрый старт по темам

| Тема | Документ |
|------|----------|
| Видение, ЦА, дифференциация | [inuu/00-product-vision.md](inuu/00-product-vision.md) |
| Мульти-город, URL, RLS | [inuu/01-multitenant-architecture.md](inuu/01-multitenant-architecture.md) |
| Роли и кабинеты | [inuu/02-roles-and-access.md](inuu/02-roles-and-access.md) |
| Платформа (поиск, избранное, booking) | [inuu/03-core-platform.md](inuu/03-core-platform.md) |
| Стек и структура репо | [inuu/11-tech-stack.md](inuu/11-tech-stack.md) |
| Модель данных | [inuu/09-data-model-overview.md](inuu/09-data-model-overview.md) |
| Что убрать / что переделать в коде | [inuu/implementation/](inuu/implementation/) |
| Термины UI и домена | [reference/TERMS.md](reference/TERMS.md) |
| Telegram auth | [features/TELEGRAM_AUTH_VIA_BOT_RU.md](features/TELEGRAM_AUTH_VIA_BOT_RU.md) |
| Омниканал (TODO) | [backlog/BACKEND_TODO_OMNICHANNEL_RU.md](backlog/BACKEND_TODO_OMNICHANNEL_RU.md) |
| SMM / outreach | [inuu/marketing/](inuu/marketing/) |

---

## Разделы `docs/` (кроме INUU)

| Папка | Назначение | Статус |
|-------|------------|--------|
| [inuu/](inuu/) | **Актуальная** продуктовая и техспека INUU | Канон |
| [reference/](reference/) | Термины, хроника релизов | Актуально (термины — под INUU) |
| [platform/](platform/) | Мультитенант, омниканал, биллинг | Частично переиспользуется; см. [inuu/10-existing-codebase.md](inuu/10-existing-codebase.md) |
| [features/](features/) | RFC по отдельным фичам | Сверять с INUU; ресторанные — legacy |
| [payments/](payments/) | Эквайринг, webhooks | Актуально для booking/билетов |
| [runbooks/](runbooks/) | Деплой, Telegram relay, Supabase | Ops; домены обновить под INUU |
| [integrations/](integrations/) | Внешние API | Только нужные вертикали INUU |
| [verticals/festival/](verticals/festival/) | Фестивальный сценарий | Подмножество events/venues |
| [backlog/](backlog/) | Планы до реализации | Не источник правды |
| [content/](content/), [marketing/](marketing/) | Черновики, карусели | Архив идей; не канон |
| [archive/](archive/) | Материалы эпохи PocketMenu | Только справка, не для новых фич |

---

## Куда класть новые файлы

| Тип материала | Папка |
|---------------|--------|
| Продукт INUU, вертикали, roadmap, data model | **`inuu/`** |
| Глоссарий, крупные релизы | `reference/` |
| Сквозная платформа (если не влезает в inuu) | `platform/` |
| RFC одной фичи витрины / compliance | `features/` |
| Платежи booking/подписок | `payments/` |
| Планы «сделать потом» | `backlog/` |
| Деплой, серверы, relay | `runbooks/` |
| Внешние интеграции | `integrations/` |
| Идеи без фиксации | `content/brainstorm/` (не канон) |

Новую продуктовую документацию **не** писать в корень `docs/` под брендом PocketMenu / teleShop.

---

## Устаревание

- **INUU** (`docs/inuu/`) — источник правды по целевому продукту.
- **PocketMenu** (рестораны, QR-меню, корзина блюд, iiko, кухня) — снят с продукта; описания в `platform/`, `features/`, `content/`, `integrations/quickresto*` — legacy до вычистки кода ([inuu/implementation/01-cleanup-unused.md](inuu/implementation/01-cleanup-unused.md)).
- При расхождении с кодом приоритет у репозитория; факт выката — [reference/RECENT_MAJOR_CHANGES_RU.md](reference/RECENT_MAJOR_CHANGES_RU.md).
