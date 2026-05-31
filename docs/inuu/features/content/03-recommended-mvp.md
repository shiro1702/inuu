# Рекомендуемый путь: MVP новостей и мастер-классов

Черновик решения для согласования с редакцией. После утверждения — перенести задачи в `implementation/02-refactor-existing.md`.

---

## Решение в одном абзаце

**Мастер-классы** — только таблица `events` с `category_id = masterclass`, создание через **общий dashboard событий** (сначала для редакции, self-service организаторов — фаза 2).  
**Новости** — таблица `editorial_posts`; **фаза 0** — SQL/Studio, **фаза 1** — dashboard редакции в том же стиле, что stories upload.  
**Не делаем** на MVP: отдельную таблицу МК, парсинг RSS/IG, внешнюю CMS (если редакция не настаивает).

---

## Фазы

### Фаза 0 — «Наполнить витрину» (3–7 дней)

| Что | Как |
|-----|-----|
| 10–30 events, из них 5+ МК | Seed SQL или Supabase Studio ([вариант A](./01-news-editorial-options.md)) |
| 2–3 подборки | `curated_lists` + items (уже есть seed `weekend`) |
| 0–5 новостей | `editorial_posts` вручную, если есть страница guides |
| Stories | существующий dashboard / SQL |

**Доработки кода (минимум):**

- `GET /api/cities/[slug]/events?category=masterclass`
- `GET /api/cities/[slug]/editorial` (список + `[slug]` деталь)
- `pages/[city_slug]/events/...`, `guides/...` (из refactor plan)

### Фаза 1 — «Редакция без разработчика» (2–3 недели)

Единый раздел **«Контент города»** в dashboard для shop `inuu-editorial`:

| Вкладка | CRUD |
|---------|------|
| Афиша / МК | `events` (+ выбор category, venue) |
| Новости | `editorial_posts` |
| Подборки | `curated_lists` + drag-sort items |
| Stories | уже частично есть |

Права: `city_editor` / members editorial shop.  
Публикация: `is_published` + `published_at`; опционально notify TG.

**Связь МК ↔ новость:** кнопка «Создать анонс» из event → черновик post с `linked_entity_id` (миграция при необходимости).

### Фаза 2 — «Партнёры сами» (после гипотезы записи)

- Организатор: CRUD своих events, модерация редактором  
- `bookings` + оплата билета  
- `event_series` / sessions если повторяющиеся МК  

### Фаза 1b — «Бот: заявки и модерация» (~1–1.5 нед)

См. **[04-telegram-bot-content-moderation.md](./04-telegram-bot-content-moderation.md)**.

- Партнёр: `/submit` → `content_submissions` → чат менеджеров с ✅/❌  
- Редакция: `/news`, `/event` без очереди (опционально раньше 1b)  
- Паттерн как `festivalUgcModeration.ts` + роутинг `inuu:sub:*` в webhook  
- Редакторский score (⭐1..⭐5) и кнопка `Редактировать` в Mini App  
- Единый inbound: bot submit + TG parser с обязательным `source_url`  

### Фаза 1c — «Оплата публикации» (+~1 нед к 1b)

См. **[07-paid-news-publication.md](./07-paid-news-publication.md)**.

- Этап 0: счёт вручную, `payment_status = invoiced`  
- Этап 1: `content_products` + YooKassa B2B в боте **до** модерации  
- `is_sponsored` на сайте, политика возвратов  

### Фаза 1d — «Рассылка подборок в боте» (параллельно 1b)

См. **[06-bot-digest-subscriptions.md](./06-bot-digest-subscriptions.md)** — полная спека; для первого релиза — раздел **MVP-набор**: 3 темы (`digest`, `events`, `news`), 5 тегов интересов, 2 пресета в `/start`.

### Фаза 1e — «Digest-парсинг и подборки» (**реализовано**)

См. **[11-digest-parsing-and-curated-picks.md](./11-digest-parsing-and-curated-picks.md)**.

- Multi-event digest из одного поста (`parse_kind=digest`)
- URL enricher для ссылок в чате
- Batch-модерация + auto `curated_lists` при approve_all
- `/pick week|month` в moderation chat

### Фаза 1f — «Расширения из брейншторма 30.05» (план)

Индекс: [fix/brainstorm/30.05.2026.md](../../../fix/brainstorm/30.05.2026.md).

| Приоритет | Тема | Спека |
|-----------|------|--------|
| P0 | Пре-фильтр + `post_type` + vision cross-check | [16](./16-parsing-pipeline-extensions.md) |
| P0 | Серии дат в UI + schedule в парсере | [15](./15-event-detail-series-venues.md) |
| P1 | Admin-сборка подборок, cron-черновики | [14](./14-digests-curated-admin-smm.md) |
| P1 | Контекст sources, web-cron, claim org | [17](./17-ingest-sources-context.md) |
| P2 | Билеты + волны цен | [18](./18-ticketing-full-flow.md) |
| P2 | ЛК организатора + шаблоны афиш | [19](./19-organizer-lk-monetization.md) |
| P3 | AI-консьерж, нишевые каналы | [13](./13-ai-content-horizon.md) |

### Фаза 1g — «Wireframes, bot roles, AI concierge» (из брейншторма 31.05)

Индекс: [fix/brainstorm/31.05.2026.md](../../../fix/brainstorm/31.05.2026.md).

| Приоритет | Тема | Спека |
|-----------|------|--------|
| P0 | MVP чеклист Улан-Удэ (юридика, support, must/cut) | [24](./24-mvp-launch-checklist-ulan-ude.md) |
| P0 | Wireframes TMA + сайт, native/parsed | [21](./21-mini-app-and-web-wireframes.md) |
| P0 | Бот: QR, scanner, helpdesk | [23](./23-bot-roles-ops-support.md) |
| P1 | AI санитар + TL;DR при парсинге | [22](./22-ai-bot-concierge-and-intent.md), [16](./16-parsing-pipeline-extensions.md) |
| P1 | Intent NL-поиск в боте | [22](./22-ai-bot-concierge-and-intent.md) |
| P2 | RAG-профиль, голос, группы | [22](./22-ai-bot-concierge-and-intent.md) |

### Фаза 3 — «Каналы»

- Автопост в TG при publish  
- Notion-sync только если dashboard не прижился  

---

## Матрица «что куда класть»

| Контент пользователя | Сущность | Кто создаёт |
|----------------------|----------|-------------|
| «Открылась кофейня» | `editorial_posts` | Редакция |
| «5 мест для свидания» | `curated_lists` | Редакция |
| МК «Лепка 15 июня» | `events` + category masterclass | Редакция → организатор |
| Концерт | `events` + category concerts | Организатор |
| Обзор после МК | `editorial_posts` → link event | Редакция |
| Афиша в stories | `story_campaigns` | Редакция |
| Цитата на карточке бара | `venues.editorial_quote` | Редакция |

---

## Миграции (если идём по фазе 1)

```sql
-- опционально, одна миграция
alter table public.editorial_posts
  add column if not exists post_type text default 'news',
  add column if not exists linked_entity_type public.inuu_entity_type,
  add column if not exists linked_entity_id uuid,
  add column if not exists excerpt text;

-- RLS write для editorial shop members (отдельный файл политик)
```

`events.organizer` — уже `shop_id`; при появлении `organizations` — не ломать, добавить nullable `organization_id`.

---

## Метрики успеха фазы 1

- Редакция публикует ≥3 материала/неделю **без тикета разработчику**
- ≥70% МК на витрине с заполненным `venue_id` и `category_id`
- Время от черновика до publish < 15 минут

---

## Альтернатива (если сроки жмут)

Только **фаза 0** + Notion как CMS ([вариант C](./01-news-editorial-options.md)) с еженедельным скриптом импорта — принять технический долг на 1–2 месяца.

---

## Согласовано: Telegram-бот (фаза 1b)

См. [04-telegram-bot-content-moderation.md](./04-telegram-bot-content-moderation.md):

- Один `@inuu_bot`
- Чат модерации — привязка через существующий механизм токенов → `cities.editorial_moderation_chat_id`
- Approve/reject — любой участник группы; в БД пишем `reviewed_by_telegram_id` (+ username, profile если есть)
- Reject — кнопки причин + опциональный комментарий (reply в группе)
- Source-aware pipeline: хранить `source_kind/source_url/source_external_id` для anti-dup и аналитики каналов

Подробная спецификация конвейера: [08-event-sourcing-and-moderation-pipeline.md](./08-event-sourcing-and-moderation-pipeline.md).

## Оплата публикации (фаза 1c)

См. [07-paid-news-publication.md](./07-paid-news-publication.md):

- MVP: оплата **до** модерации + счёт для юрлиц
- Редакция `/news` — без оплаты

---

## Следующий шаг

1. Согласовать с Юмжиной: достаточно ли фазы 0 на 2 недели или сразу dashboard.  
2. Зафиксировать формат `body` (Markdown vs Tiptap HTML).  
3. Реализация R11–R12 в [implementation/02-refactor-existing.md](../implementation/02-refactor-existing.md).

**Статус:** бот-модерация — **ADR согласован**; dashboard редакции — черновик.
