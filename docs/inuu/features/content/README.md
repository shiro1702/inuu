# Контент: новости и мастер-классы — обзор вариантов

Документы для **выбора способа добавления** материалов в INUU до начала разработки админки.

## Текущее состояние (репозиторий)

| Сущность | Таблица | Публичное API | UI создания |
|----------|---------|---------------|-------------|
| Новости / обзоры | `editorial_posts` | **нет** (только read через будущие страницы) | нет |
| Подборки | `curated_lists`, `curated_list_items` | `GET /api/cities/[slug]/lists/[listSlug]` | TG `/pick`, авто при digest approve |
| События (в т.ч. МК) | `events`, `event_categories` | `GET /api/cities/[slug]/events` | parser chat + digest batch |
| Stories редакции | `story_campaigns` | stories API | частично: dashboard stories (legacy shop) |

Seed: `supabase/migrations/019_inuu_seed_ulan_ude.sql`. Редакция как `shop` с `org_type = editorial`.

## Документы

| Файл | Тема |
|------|------|
| [01-news-editorial-options.md](./01-news-editorial-options.md) | Как добавлять **новости**, обзоры, подборки |
| [02-masterclasses-events-options.md](./02-masterclasses-events-options.md) | Как добавлять **мастер-классы** и афишу |
| [03-recommended-mvp.md](./03-recommended-mvp.md) | Сводная рекомендация и фазы |
| [04-telegram-bot-content-moderation.md](./04-telegram-bot-content-moderation.md) | **TG-бот:** приём контента + approve/reject для менеджеров |
| [05-bot-news-dialog-script.md](./05-bot-news-dialog-script.md) | Скрипт диалога `/news` и `/submit` → новость |
| [06-bot-digest-subscriptions.md](./06-bot-digest-subscriptions.md) | **Рассылка подборок** в боте и **подписки по темам/тегам** |
| [07-paid-news-publication.md](./07-paid-news-publication.md) | **Оплата** за публикацию партнёрских новостей (варианты, SKU, БД) |
| [11-digest-parsing-and-curated-picks.md](./11-digest-parsing-and-curated-picks.md) | **Digest-парсинг**, URL enricher, подборки недели/месяца |

## Связанные спеки

- [verticals/news-and-editorial.md](../../verticals/news-and-editorial.md)
- [verticals/events-and-venues.md](../../verticals/events-and-venues.md)
- [09-data-model-overview.md](../../09-data-model-overview.md)
- [02-roles-and-access.md](../../02-roles-and-access.md)

## Критерии выбора варианта

Оценивать каждый вариант по шкале 1–5:

1. **Скорость до первой публикации** (дни)
2. **Удобство для редакции** (Юмжина, не разработчики)
3. **SEO / структура URL** на сайте
4. **Связь с записью и оплатой** (билет, CTA)
5. **Стоимость поддержки** (свой код vs внешний сервис)

После выбора — зафиксировать решение в [03-recommended-mvp.md](./03-recommended-mvp.md) и завести задачи в `implementation/`.
