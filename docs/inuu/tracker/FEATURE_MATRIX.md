# Матрица фич INUU

Сводка по группам функционала. **Статус:** `[x]` сделано · `[~]` в работе · `[ ]` не сделано / только спека.

Оценки: **Сложн.** 1–5 · **Важн.** P0–P3 · **Монет.** — / низ / сред / выс

---

## 1. Платформа и авторизация

| Статус | Фича | Сложн. | Важн. | Монет. | Спека |
|:------:|------|:------:|:-----:|:------:|-------|
| [x] | Мультитенант: `cities`, RLS, seed Улан-Удэ | 3 | P0 | — | [01-multitenant-architecture.md](../01-multitenant-architecture.md) |
| [x] | Роутинг `/[city_slug]/…`, middleware города | 2 | P0 | — | [03-core-platform.md](../03-core-platform.md) |
| [x] | Авторизация Telegram (сайт + Mini App initData) | 3 | P0 | — | [02-roles-and-access.md](../02-roles-and-access.md) |
| [x] | Привязка MAX / VK (`link-max`, `link-vk`) | 2 | P2 | — | [07-notifications-channels.md](../07-notifications-channels.md) |
| [x] | Роли: manager, platform admin, shop members | 3 | P0 | — | [02-roles-and-access.md](../02-roles-and-access.md) |
| [ ] | UI выбора города (мульти-город для пользователя) | 2 | P4 | — | [01-multitenant-architecture.md](../01-multitenant-architecture.md) |
| [ ] | PWA + web push | 4 | P3 | — | [04-features-priority.md](../04-features-priority.md) |

---

## 2. Афиша и события (B2C)

| Статус | Фича | Сложн. | Важн. | Монет. | Спека |
|:------:|------|:------:|:-----:|:------:|-------|
| [x] | API + страница каталога событий | 2 | P0 | — | [verticals/events-and-venues.md](../verticals/events-and-venues.md) |
| [x] | Детальная карточка события | 2 | P0 | — | [15-event-detail-series-venues.md](../features/content/15-event-detail-series-venues.md) |
| [x] | Фильтр по категории и датам | 2 | P0 | — | [03-core-platform.md](../03-core-platform.md) |
| [x] | Фильтр по тегам (OR, URL `?tag=`) | 2 | P1 | сред | [12-afisha-tag-subscriptions.md](../features/content/12-afisha-tag-subscriptions.md) |
| [x] | Страницы тегов `/tag/[tagSlug]` | 2 | P1 | — | [12-afisha-tag-subscriptions.md](../features/content/12-afisha-tag-subscriptions.md) |
| [x] | Серии событий (`series_slug`) + picker дат в UI | 3 | P1 | — | [15-event-detail-series-venues.md](../features/content/15-event-detail-series-venues.md) |
| [x] | CTA «Запись / билеты» → внешняя ссылка | 1 | P0 | — | [15-event-detail-series-venues.md](../features/content/15-event-detail-series-venues.md) |
| [x] | `source_url` / метаданные источника на событии | 2 | P1 | — | [08-event-sourcing-and-moderation-pipeline.md](../features/content/08-event-sourcing-and-moderation-pipeline.md) |
| [x] | CTA native 🎟 vs parsed 🌐 на карточках | 2 | P0 | — | [21-mini-app-and-web-wireframes.md](../features/content/21-mini-app-and-web-wireframes.md), [17-ingest-sources-context.md](../features/content/17-ingest-sources-context.md) |
| [ ] | Telegram Mini App: tab bar (афиша / билеты / профиль) | 4 | P1 | — | [21-mini-app-and-web-wireframes.md](../features/content/21-mini-app-and-web-wireframes.md) |
| [ ] | Mini App: highlights + фильтры (сегодня / выходные / бесплатно) | 2 | P1 | — | [21-mini-app-and-web-wireframes.md](../features/content/21-mini-app-and-web-wireframes.md) |
| [ ] | Сайт: B2B-блок + SEO footer + QR в Mini App | 2 | P1 | сред | [21-mini-app-and-web-wireframes.md](../features/content/21-mini-app-and-web-wireframes.md) |
| [ ] | Chips дат «как в кино» + мини-календарь на длинных сериях | 3 | P1 | — | [15-event-detail-series-venues.md](../features/content/15-event-detail-series-venues.md) |
| [ ] | Блок «Похожие события» по тегам/категории | 2 | P1 | — | [15-event-detail-series-venues.md](../features/content/15-event-detail-series-venues.md) |
| [ ] | Избранное + «Мои планы» + push за сутки | 3 | P1 | низ | [verticals/events-and-venues.md](../verticals/events-and-venues.md) |
| [ ] | Плашки ОТМЕНЕНО / SOLD OUT (не скрывать карточку) | 2 | P1 | — | [16-parsing-pipeline-extensions.md](../features/content/16-parsing-pipeline-extensions.md) |
| [ ] | «Позвать друга» (share deep link) | 2 | P2 | низ | [15-event-detail-series-venues.md](../features/content/15-event-detail-series-venues.md) |
| [ ] | Карта событий / venues на карте | 4 | P2 | — | [04-features-priority.md](../04-features-priority.md) |
| [ ] | Тиндер-свайпы для пользователей | 4 | P3 | низ | [14-digests-curated-admin-smm.md](../features/content/14-digests-curated-admin-smm.md) |

---

## 3. Заведения и организаторы (витрина)

| Статус | Фича | Сложн. | Важн. | Монет. | Спека |
|:------:|------|:------:|:-----:|:------:|-------|
| [x] | Каталог venues API + страницы | 2 | P1 | — | [verticals/events-and-venues.md](../verticals/events-and-venues.md) |
| [x] | Афиша всех событий на странице venue | 2 | P1 | сред | [15-event-detail-series-venues.md](../features/content/15-event-detail-series-venues.md) |
| [x] | Страница организатора / источника + подписка | 3 | P1 | сред | [15-event-detail-series-venues.md](../features/content/15-event-detail-series-venues.md) |
| [x] | Теневые профили org из парсера + claim | 4 | P1 | выс | [17-ingest-sources-context.md](../features/content/17-ingest-sources-context.md) |
| [ ] | Вайб-фильтры («для свидания», «с ноутбуком») | 3 | P2 | — | [verticals/events-and-venues.md](../verticals/events-and-venues.md) |
| [x] | Блок обзоров на странице venue | 2 | P2 | — | [30-manager-chat-place-editorial.md](../features/content/30-manager-chat-place-editorial.md) |

---

## 4. Ingestion и AI-парсинг

| Статус | Фича | Сложн. | Важн. | Монет. | Спека |
|:------:|------|:------:|:-----:|:------:|-------|
| [x] | `POST /api/ai/parse-event` (Groq, parse-only) | 2 | P0 | — | [implementation/03-ai-ingest-and-global-dashboards.md](../implementation/03-ai-ingest-and-global-dashboards.md) |
| [x] | `POST /api/ingest/content/submit` (parse → dedupe → queue) | 3 | P0 | — | [08-event-sourcing-and-moderation-pipeline.md](../features/content/08-event-sourcing-and-moderation-pipeline.md) |
| [x] | Логи `ai_parse_logs` + dashboard stats | 2 | P1 | — | [implementation/03-ai-ingest-and-global-dashboards.md](../implementation/03-ai-ingest-and-global-dashboards.md) |
| [x] | `parse_kind`: single vs digest (multi-event пост) | 3 | P0 | — | [11-digest-parsing-and-curated-picks.md](../features/content/11-digest-parsing-and-curated-picks.md) |
| [x] | URL enricher (fetch / Firecrawl) перед Groq | 3 | P0 | — | [11-digest-parsing-and-curated-picks.md](../features/content/11-digest-parsing-and-curated-picks.md) |
| [x] | Несколько дат в одном событии (`recurrence.dates`) | 2 | P1 | — | [11-digest-parsing-and-curated-picks.md](../features/content/11-digest-parsing-and-curated-picks.md) |
| [x] | Batch `content_submission_batches` (digest pack) | 2 | P0 | — | [11-digest-parsing-and-curated-picks.md](../features/content/11-digest-parsing-and-curated-picks.md) |
| [x] | Ingest из parser source chats (пересылка / пост в чат) | 3 | P0 | — | [10-telegram-sources-without-bot-access.md](../features/content/10-telegram-sources-without-bot-access.md) |
| [x] | Userbot worker (Telethon/Pyrogram) вне репо | 4 | P1 | — | [10-telegram-sources-without-bot-access.md](../features/content/10-telegram-sources-without-bot-access.md) |
| [x] | Пре-фильтр ключевых слов до Groq | 2 | P1 | — | [16-parsing-pipeline-extensions.md](../features/content/16-parsing-pipeline-extensions.md) |
| [ ] | `post_type`: new / cancellation / update / trash | 3 | P1 | — | [16-parsing-pipeline-extensions.md](../features/content/16-parsing-pipeline-extensions.md) |
| [ ] | Vision: сверка текст ↔ афиша (`conflict_alert`) | 3 | P1 | — | [16-parsing-pipeline-extensions.md](../features/content/16-parsing-pipeline-extensions.md) |
| [x] | Web CRON парсинг сайтов (MVP: plain text на index URL) | 4 | P1 | сред | [17-ingest-sources-context.md](../features/content/17-ingest-sources-context.md), TASK-002 |
| [x] | Web: `parsing_strategy` / `parsing_rules` + `scraping_alerts` | 3 | P1 | — | [26](../features/content/26-web-scraping-classifier-and-rules.md), TASK-008 |
| [x] | Web: Groq classifier (`page_type`) + router | 4 | P1 | — | [26](../features/content/26-web-scraping-classifier-and-rules.md), TASK-009 |
| [x] | Web: cheerio fast lane + auto-healing rules | 4 | P1 | — | [26](../features/content/26-web-scraping-classifier-and-rules.md), TASK-010 |
| [ ] | Groq event prompt: `publication_date` + CTA/age/lineup | 2 | P1 | — | [25-groq-event-extraction-prompt.md](../features/content/25-groq-event-extraction-prompt.md) |
| [x] | Контекст источника в промпте (театр / клуб / …) | 2 | P1 | — | [17-ingest-sources-context.md](../features/content/17-ingest-sources-context.md) |
| [ ] | AI-санитар парсинга (title, price, category, vibe) | 2 | P1 | — | [22-ai-bot-concierge-and-intent.md](../features/content/22-ai-bot-concierge-and-intent.md), [16-parsing-pipeline-extensions.md](../features/content/16-parsing-pipeline-extensions.md) |
| [ ] | TL;DR + vibe emoji на карточке события | 2 | P1 | — | [22-ai-bot-concierge-and-intent.md](../features/content/22-ai-bot-concierge-and-intent.md), [13-ai-content-horizon.md](../features/content/13-ai-content-horizon.md) |
| [ ] | Сжатие афиш WebP при ingest | 2 | P1 | — | [24-mvp-launch-checklist-ulan-ude.md](../features/content/24-mvp-launch-checklist-ulan-ude.md) |
| [ ] | Groq: каскад 8b/70b + graceful 429 | 2 | P1 | — | [24-mvp-launch-checklist-ulan-ude.md](../features/content/24-mvp-launch-checklist-ulan-ude.md), [11-tech-stack.md](../11-tech-stack.md) |
| [ ] | VK wall ingest | 3 | P2 | — | [27-ingest-workers-vk-telegram-web.md](../features/content/27-ingest-workers-vk-telegram-web.md) |
| [ ] | Telegram public: `t.me/s/` HTML worker | 2 | P2 | — | [27-ingest-workers-vk-telegram-web.md](../features/content/27-ingest-workers-vk-telegram-web.md) |

---

## 5. Модерация и Telegram-бот

| Статус | Фича | Сложн. | Важн. | Монет. | Спека |
|:------:|------|:------:|:-----:|:------:|-------|
| [x] | Очередь `content_submissions` | 2 | P0 | — | [04-telegram-bot-content-moderation.md](../features/content/04-telegram-bot-content-moderation.md) |
| [x] | Карточки в moderation chat: approve / reject / revise | 3 | P0 | — | [04-telegram-bot-content-moderation.md](../features/content/04-telegram-bot-content-moderation.md) |
| [x] | Digest: approve_all / split / reject pack | 3 | P0 | — | [11-digest-parsing-and-curated-picks.md](../features/content/11-digest-parsing-and-curated-picks.md) |
| [x] | Редакторский score ⭐1–5 после approve | 2 | P1 | — | [04-telegram-bot-content-moderation.md](../features/content/04-telegram-bot-content-moderation.md) |
| [x] | Ссылка на событие на сайте в карточке после approve | 1 | P1 | — | [04-telegram-bot-content-moderation.md](../features/content/04-telegram-bot-content-moderation.md) |
| [x] | Mini App редактирование заявки | 3 | P1 | — | [04-telegram-bot-content-moderation.md](../features/content/04-telegram-bot-content-moderation.md) |
| [x] | Привязка moderation chat (`chat-link-token`, settings) | 2 | P0 | — | [implementation/04-dashboard-pages-ai-and-city-ops.md](../implementation/04-dashboard-pages-ai-and-city-ops.md) |
| [x] | `/pick week\|month` — сбор подборки inline | 3 | P1 | — | [11-digest-parsing-and-curated-picks.md](../features/content/11-digest-parsing-and-curated-picks.md) |
| [ ] | `/submit` для партнёров (публичная предложка) | 3 | P1 | — | [04-telegram-bot-content-moderation.md](../features/content/04-telegram-bot-content-moderation.md) |
| [ ] | `/news`, `/event` для редакции (без очереди) | 2 | P2 | — | [05-bot-news-dialog-script.md](../features/content/05-bot-news-dialog-script.md) |
| [ ] | Approve с рангом одной кнопкой «Одобрить 5⭐» | 1 | P2 | — | [16-parsing-pipeline-extensions.md](../features/content/16-parsing-pipeline-extensions.md) |
| [ ] | Редактирование тегов в Mini App (словарь из БД) | 3 | P1 | — | [16-parsing-pipeline-extensions.md](../features/content/16-parsing-pipeline-extensions.md) |
| [ ] | Bot helpdesk: forward + reply из admin chat | 3 | P1 | — | [23-bot-roles-ops-support.md](../features/content/23-bot-roles-ops-support.md) |
| [ ] | Admin алерты (cron, ЮKassa, storage) | 2 | P2 | — | [23-bot-roles-ops-support.md](../features/content/23-bot-roles-ops-support.md) |

---

## 6. Редакция: новости, подборки, stories

| Статус | Фича | Сложн. | Важн. | Монет. | Спека |
|:------:|------|:------:|:-----:|:------:|-------|
| [x] | Публичные подборки `curated_lists` + `/lists/[slug]` | 2 | P0 | сред | [01-news-editorial-options.md](../features/content/01-news-editorial-options.md) |
| [x] | Авто-подборка периода при digest approve_all | 2 | P1 | — | [11-digest-parsing-and-curated-picks.md](../features/content/11-digest-parsing-and-curated-picks.md) |
| [x] | Создание новости в dashboard (`editorial-news`) | 2 | P1 | — | [09-how-to-create-news-and-events.md](../features/content/09-how-to-create-news-and-events.md) |
| [x] | Словарь `city_content_tags` + CRUD в dashboard | 2 | P1 | — | [implementation/04-dashboard-pages-ai-and-city-ops.md](../implementation/04-dashboard-pages-ai-and-city-ops.md) |
| [ ] | Публичный API + страницы guides / editorial | 3 | P1 | SEO | [03-recommended-mvp.md](../features/content/03-recommended-mvp.md) |
| [ ] | Полный CRUD редакции (events, lists, news) в dashboard | 4 | P1 | — | [03-recommended-mvp.md](../features/content/03-recommended-mvp.md) |
| [ ] | Promo-блоки в подборках (не event) | 3 | P2 | сред | [14-digests-curated-admin-smm.md](../features/content/14-digests-curated-admin-smm.md) |
| [ ] | Admin «тиндер» для сборки дайджеста | 4 | P2 | — | [14-digests-curated-admin-smm.md](../features/content/14-digests-curated-admin-smm.md) |
| [x] | Cron авто-черновики дайджестов (праздники, ⭐4–5) | 3 | P2 | — | [14-digests-curated-admin-smm.md](../features/content/14-digests-curated-admin-smm.md) |
| [x] | Stories города на главной (city stories API → UI) | 3 | P1 | выс | [04-features-priority.md](../04-features-priority.md) |
| [ ] | HTML→image экспорт для Instagram | 4 | P2 | сред | [14-digests-curated-admin-smm.md](../features/content/14-digests-curated-admin-smm.md) |
| [x] | Обзоры/посты о местах через manager chat (AI, видео, org) | 4 | P1 | сред | [30-manager-chat-place-editorial.md](../features/content/30-manager-chat-place-editorial.md) |
| [x] | Stories через manager chat (слайды, org) | 3 | P1 | выс | [30-manager-chat-place-editorial.md](../features/content/30-manager-chat-place-editorial.md) |

---

## 7. Подписки и уведомления

| Статус | Фича | Сложн. | Важн. | Монет. | Спека |
|:------:|------|:------:|:-----:|:------:|-------|
| [x] | Страница `/subscriptions` + API сохранения интересов | 2 | P1 | — | [12-afisha-tag-subscriptions.md](../features/content/12-afisha-tag-subscriptions.md) |
| [x] | Кнопка «Получать подборку в боте» с афиши | 2 | P1 | — | [12-afisha-tag-subscriptions.md](../features/content/12-afisha-tag-subscriptions.md) |
| [x] | `/subscribe` + callbacks `inuu:notify:*` | 3 | P1 | — | [12-afisha-tag-subscriptions.md](../features/content/12-afisha-tag-subscriptions.md) |
| [ ] | Push при publish события (match по тегам) | 3 | P1 | выс | [06-bot-digest-subscriptions.md](../features/content/06-bot-digest-subscriptions.md) |
| [ ] | Push при publish подборки / новости | 3 | P1 | сред | [06-bot-digest-subscriptions.md](../features/content/06-bot-digest-subscriptions.md) |
| [ ] | Напоминания −24ч / −2ч + QR в чате | 2 | P1 | — | [23-bot-roles-ops-support.md](../features/content/23-bot-roles-ops-support.md) |
| [ ] | AI intent router + NL-консьерж в боте | 4 | P1 | сред | [22-ai-bot-concierge-and-intent.md](../features/content/22-ai-bot-concierge-and-intent.md), [13-ai-content-horizon.md](../features/content/13-ai-content-horizon.md) |
| [ ] | Голосовые → Whisper (Groq) → intent поиск | 3 | P2 | — | [22-ai-bot-concierge-and-intent.md](../features/content/22-ai-bot-concierge-and-intent.md) |
| [ ] | RAG-профиль: теги + покупки в промпте Groq | 3 | P2 | — | [22-ai-bot-concierge-and-intent.md](../features/content/22-ai-bot-concierge-and-intent.md) |
| [ ] | Бот в группах: @mention + Poll «куда идём» | 3 | P2 | низ | [22-ai-bot-concierge-and-intent.md](../features/content/22-ai-bot-concierge-and-intent.md) |
| [ ] | Персональный пятничный дайджест (Groq текст) | 4 | P2 | низ | [06-bot-digest-subscriptions.md](../features/content/06-bot-digest-subscriptions.md) |
| [ ] | Лимиты маркетинговых рассылок / opt-out | 2 | P2 | — | [06-bot-digest-subscriptions.md](../features/content/06-bot-digest-subscriptions.md) |

---

## 8. Dashboard и операционка

| Статус | Фича | Сложн. | Важн. | Монет. | Спека |
|:------:|------|:------:|:-----:|:------:|-------|
| [x] | `dashboard/content-ai` — тест parse, очередь, настройки | 3 | P0 | — | [implementation/04-dashboard-pages-ai-and-city-ops.md](../implementation/04-dashboard-pages-ai-and-city-ops.md) |
| [x] | Manager / admin city overview pages | 2 | P1 | — | [implementation/03-ai-ingest-and-global-dashboards.md](../implementation/03-ai-ingest-and-global-dashboards.md) |
| [x] | Content queue: approve, publish, notify TG | 3 | P0 | — | [implementation/04-dashboard-pages-ai-and-city-ops.md](../implementation/04-dashboard-pages-ai-and-city-ops.md) |
| [x] | Per-city parser / moderation chat IDs | 2 | P0 | — | [implementation/04-dashboard-pages-ai-and-city-ops.md](../implementation/04-dashboard-pages-ai-and-city-ops.md) |
| [x] | Регистрация источников (web + approve профиля org) | 4 | P1 | — | [17-ingest-sources-context.md](../features/content/17-ingest-sources-context.md) |
| [ ] | Runbook-sync: UI = [MANAGER_CONTENT_RUNBOOK](../runbooks/MANAGER_CONTENT_RUNBOOK_RU.md) | 1 | P2 | — | [runbooks/MANAGER_CONTENT_RUNBOOK_RU.md](../runbooks/MANAGER_CONTENT_RUNBOOK_RU.md) |

---

## 9. Билеты и оплата

| Статус | Фича | Сложн. | Важн. | Монет. | Спека |
|:------:|------|:------:|:-----:|:------:|-------|
| [x] | Схема БД payments (legacy / inuu migrations) | 2 | P1 | — | [payments/PAYMENTS_RU_YOOKASSA_TBANK.md](../../payments/PAYMENTS_RU_YOOKASSA_TBANK.md) |
| [x] | Webhook YooKassa (ресторанный legacy) | 3 | — | — | [payments/PAYMENTS_TODO_RU.md](../../payments/PAYMENTS_TODO_RU.md) |
| [ ] | Покупка билета в боте / Mini App | 5 | P1 | выс | [18-ticketing-full-flow.md](../features/content/18-ticketing-full-flow.md), [21-mini-app-and-web-wireframes.md](../features/content/21-mini-app-and-web-wireframes.md) |
| [ ] | Чекбокс оферта platform + org при оплате | 1 | P0 | — | [24-mvp-launch-checklist-ulan-ude.md](../features/content/24-mvp-launch-checklist-ulan-ude.md), [18-ticketing-full-flow.md](../features/content/18-ticketing-full-flow.md) |
| [ ] | Push QR-билета в чат после оплаты | 2 | P0 | — | [23-bot-roles-ops-support.md](../features/content/23-bot-roles-ops-support.md), [18-ticketing-full-flow.md](../features/content/18-ticketing-full-flow.md) |
| [ ] | SOS «Проблема с билетом» → support | 1 | P1 | — | [23-bot-roles-ops-support.md](../features/content/23-bot-roles-ops-support.md), [18-ticketing-full-flow.md](../features/content/18-ticketing-full-flow.md) |
| [ ] | Hold 15 мин + анти-овербукинг | 3 | P1 | — | [18-ticketing-full-flow.md](../features/content/18-ticketing-full-flow.md) |
| [ ] | ЮKassa split (4% платформе) | 4 | P1 | выс | [18-ticketing-full-flow.md](../features/content/18-ticketing-full-flow.md) |
| [ ] | QR-билет + сканнер для организатора | 4 | P1 | — | [18-ticketing-full-flow.md](../features/content/18-ticketing-full-flow.md) |
| [ ] | Динамические «волны» цен | 4 | P2 | выс | [18-ticketing-full-flow.md](../features/content/18-ticketing-full-flow.md) |
| [ ] | Возвраты MVP: заявка в admin chat → ручной refund | 3 | P1 | — | [18-ticketing-full-flow.md](../features/content/18-ticketing-full-flow.md), [23-bot-roles-ops-support.md](../features/content/23-bot-roles-ops-support.md) |
| [ ] | Автовозвраты + waitlist (калькулятор 193-ФЗ) | 4 | P2 | — | [18-ticketing-full-flow.md](../features/content/18-ticketing-full-flow.md) |
| [ ] | «Поделиться билетом» другу (deep link) | 3 | P2 | низ | [18-ticketing-full-flow.md](../features/content/18-ticketing-full-flow.md) |
| [ ] | Оплата публикации партнёрской новости (B2B) | 3 | P2 | выс | [07-paid-news-publication.md](../features/content/07-paid-news-publication.md) |

---

## 10. B2B: личный кабинет организатора

| Статус | Фича | Сложн. | Важн. | Монет. | Спека |
|:------:|------|:------:|:-----:|:------:|-------|
| [ ] | Web ЛК: CRUD событий, волны цен | 4 | P2 | выс | [19-organizer-lk-monetization.md](../features/content/19-organizer-lk-monetization.md) |
| [ ] | Login through Telegram для org | 2 | P2 | — | [19-organizer-lk-monetization.md](../features/content/19-organizer-lk-monetization.md) |
| [ ] | Mini App: сканнер + live-счётчик входа | 4 | P2 | — | [19-organizer-lk-monetization.md](../features/content/19-organizer-lk-monetization.md) |
| [ ] | Шаблонные афиши (слои, не gen-AI) | 4 | P2 | сред | [19-organizer-lk-monetization.md](../features/content/19-organizer-lk-monetization.md) |
| [ ] | Таргет-push для org (CPM) | 4 | P2 | выс | [19-organizer-lk-monetization.md](../features/content/19-organizer-lk-monetization.md) |
| [ ] | Реферальные ссылки промоутеров + split | 5 | P2 | выс | [19-organizer-lk-monetization.md](../features/content/19-organizer-lk-monetization.md) |
| [ ] | Pro-админка мастер-классов (waitlist, доп. поля) | 4 | P2 | выс | [19-organizer-lk-monetization.md](../features/content/19-organizer-lk-monetization.md) |

---

## 11. Монетизация (сквозное)

| Статус | Фича | Сложн. | Важн. | Монет. | Спека |
|:------:|------|:------:|:-----:|:------:|-------|
| [ ] | Буст события / топ ленты | 2 | P2 | выс | [06-monetization.md](../06-monetization.md) |
| [ ] | EventPass B2C (без серв. сбора, скидка волны) | 3 | P2 | выс | [06-monetization.md](../06-monetization.md) |
| [ ] | Баннеры / натив в подборках | 3 | P3 | выс | [06-monetization.md](../06-monetization.md) |
| [ ] | CPA на parsed-события (внешние билеты) | 2 | P2 | сред | [17-ingest-sources-context.md](../features/content/17-ingest-sources-context.md) |
| [ ] | ~~Бронь столов~~ | — | — | — | **снято** (брейншторм 30.05) |
| [ ] | ~~Интеграция такси~~ | — | — | — | **снято** (брейншторм 30.05) |

---

## 12. Вертикали (не афиша)

| Статус | Фича | Сложн. | Важн. | Монет. | Спека |
|:------:|------|:------:|:-----:|:------:|-------|
| [ ] | Beauty: запись, слоты, лист ожидания | 5 | P1 | выс | [verticals/beauty.md](../verticals/beauty.md) |
| [ ] | Туризм / Байкал: каталог + тендер заявки | 5 | P2 | выс | [verticals/tourism-baikal.md](../verticals/tourism-baikal.md) |
| [ ] | Аудио/текст маршруты по городу + QR | 5 | P3 | сред | [verticals/tourism-baikal.md](../verticals/tourism-baikal.md) |
| [ ] | Кондитеры (полный цикл заказа) | 5 | P2 | сред | [verticals/confectioners.md](../verticals/confectioners.md) |
| [ ] | Локальные бренды (витрина) | 3 | P3 | сред | [verticals/local-brands.md](../verticals/local-brands.md) |
| [ ] | Рекламный кабинет | 5 | P3 | выс | [verticals/advertising.md](../verticals/advertising.md) |
| [ ] | Отзывы и рейтинг | 4 | P2 | низ | [04-features-priority.md](../04-features-priority.md) |

---

## 13. Backlog вовлечения и AI-медиа

| Статус | Фича | Сложн. | Важн. | Монет. | Спека |
|:------:|------|:------:|:-----:|:------:|-------|
| [ ] | «Матч с друзьями» (групповой выбор) | 5 | P3 | низ | [20-bot-engagement-backlog.md](../features/content/20-bot-engagement-backlog.md) |
| [ ] | Радар «что рядом» (гео) | 3 | P2 | сред | [20-bot-engagement-backlog.md](../features/content/20-bot-engagement-backlog.md) |
| [ ] | AI-маршрут на вечер (событие + еда рядом) | 4 | P2 | — | [22-ai-bot-concierge-and-intent.md](../features/content/22-ai-bot-concierge-and-intent.md), [20-bot-engagement-backlog.md](../features/content/20-bot-engagement-backlog.md) |
| [ ] | Рулетка «случайные выходные» | 2 | P2 | — | [22-ai-bot-concierge-and-intent.md](../features/content/22-ai-bot-concierge-and-intent.md), [20-bot-engagement-backlog.md](../features/content/20-bot-engagement-backlog.md) |
| [ ] | Нишевые TG-каналы (стратегия «Дерево») | 3 | P3 | сред | [13-ai-content-horizon.md](../features/content/13-ai-content-horizon.md) |
| [ ] | Stories-матрица автоконтента | 4 | P2 | — | [14-digests-curated-admin-smm.md](../features/content/14-digests-curated-admin-smm.md) |

---

## Сводка (на 02.06.2026)

| | Кол-во |
|---|--------|
| Всего строк | 139 |
| `[x]` сделано | 60 |
| `[~]` в работе | 0 |
| `[ ]` в плане | 79 |

> **Примечание:** `[x]` = есть рабочий код или MVP закрыт по спеке; `[~]` = идёт реализация; `[ ]` = не начато или только спека. Строки «снято» (§11) не входят в «в плане». При расхождении с кодом — править здесь первым делом.

## Связанные документы

- [04-features-priority.md](../04-features-priority.md) — приоритеты волн A–E  
- [03-recommended-mvp.md](../features/content/03-recommended-mvp.md) — фазы контента (в т.ч. **1g** из 31.05)  
- [fix/brainstorm/30.05.2026.md](../../fix/brainstorm/30.05.2026.md) — индекс брейншторма 30.05  
- [fix/brainstorm/31.05.2026.md](../../fix/brainstorm/31.05.2026.md) — индекс брейншторма 31.05 (спеки 21–24)  
- [fix/brainstorm/01.06.2026.md](../../fix/brainstorm/01.06.2026.md) — индекс 01.06 (спеки 25–29, web pipeline)  
- [tracker/TASK-008-web-parsing-pipeline.md](./TASK-008-web-parsing-pipeline.md) — runbook web crawl 008–010
