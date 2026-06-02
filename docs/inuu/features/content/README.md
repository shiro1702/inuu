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
| [12-afisha-tag-subscriptions.md](./12-afisha-tag-subscriptions.md) | Подписка на теги афиши (Mini App + бот) |

### Из брейншторма 30.05.2026

| Файл | Тема |
|------|------|
| [13-ai-content-horizon.md](./13-ai-content-horizon.md) | AI: консьерж, рерайт, вайбы, стратегия «Дерево» |
| [14-digests-curated-admin-smm.md](./14-digests-curated-admin-smm.md) | Подборки: admin-тиндер, cron, Stories, SMM export |
| [15-event-detail-series-venues.md](./15-event-detail-series-venues.md) | Карточка события, серии дат, места, источники |
| [16-parsing-pipeline-extensions.md](./16-parsing-pipeline-extensions.md) | Userbot, пре-фильтр, post_type, vision |
| [17-ingest-sources-context.md](./17-ingest-sources-context.md) | Web-cron, native/parsed, теневые org |
| [WEB_URL_PARSER_RU.md](../../runbooks/WEB_URL_PARSER_RU.md) | Runbook: dashboard, добавление URL, pipeline |
| [18-ticketing-full-flow.md](./18-ticketing-full-flow.md) | Билеты, волны цен, QR, возвраты |
| [19-organizer-lk-monetization.md](./19-organizer-lk-monetization.md) | ЛК организатора, шаблоны афиш, B2B upsell |
| [20-bot-engagement-backlog.md](./20-bot-engagement-backlog.md) | Backlog: матч друзей, радар, квесты |

### Из брейншторма 31.05.2026

| Файл | Тема |
|------|------|
| [21-mini-app-and-web-wireframes.md](./21-mini-app-and-web-wireframes.md) | TMA + сайт: wireframes, checkout, native/parsed |
| [22-ai-bot-concierge-and-intent.md](./22-ai-bot-concierge-and-intent.md) | Intent router, RAG, голос, группы, AI backend |
| [23-bot-roles-ops-support.md](./23-bot-roles-ops-support.md) | Бот B2C / B2B / admin, helpdesk, scanner |
| [24-mvp-launch-checklist-ulan-ude.md](./24-mvp-launch-checklist-ulan-ude.md) | MVP чеклист, must/cut, лимиты Groq/Vercel |

### Из брейншторма 01.06.2026

| Файл | Тема |
|------|------|
| [25-groq-event-extraction-prompt.md](./25-groq-event-extraction-prompt.md) | Промпт Groq: даты публикации, поля JSON, теги, дедуп |
| [26-web-scraping-classifier-and-rules.md](./26-web-scraping-classifier-and-rules.md) | Web: классификатор, CSS-rules, self-healing |
| [27-ingest-workers-vk-telegram-web.md](./27-ingest-workers-vk-telegram-web.md) | Воркеры VK / `t.me/s/` / сайты |
| [28-omnichannel-share-and-tma-funnel.md](./28-omnichannel-share-and-tma-funnel.md) | Share TG/MAX/Web, deep links, канал → TMA |
| [29-nlp-admin-and-organizer-agent.md](./29-nlp-admin-and-organizer-agent.md) | LLM Tool Calling: менеджер и организатор |

### Из брейншторма 02.05.2026 (сессия 01–02.06)

| Файл | Тема |
|------|------|
| [31-content-tags-vibes-taxonomy.md](./31-content-tags-vibes-taxonomy.md) | Категории vs теги-вайбы, мастер-список с эмодзи, единый фильтр |

Индекс сырого лога: [fix/brainstorm/30.05.2026.md](../../../fix/brainstorm/30.05.2026.md), [31.05.2026.md](../../../fix/brainstorm/31.05.2026.md), [01.06.2026.md](../../../fix/brainstorm/01.06.2026.md), [02.05.2026.md](../../../fix/brainstorm/02.05.2026.md).

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
