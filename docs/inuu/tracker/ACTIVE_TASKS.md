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

## Текущий вектор (31.05.2026)

**Наполнить БД событиями** (TG userbot + web cron) и **привести витрину** к виду, где parsed-контент виден: org/venue → подборки → stories.

Параллельно зафиксирован **MVP launch** из брейншторма 31.05: wireframes TMA, bot roles (QR / scanner / helpdesk), AI sanitizer — см. фазу **1g** в [03-recommended-mvp.md](../features/content/03-recommended-mvp.md) и спеки **21–24**.

---

## Активные задачи

> **Очередь:** 0 задач — TASK-001…002 закрыты 31.05.2026.

_Нет активных задач. Следующая волна — см. таблицу ниже._

---

## Следующая волна (не активно)

Появятся здесь после закрытия TASK-001…002:

| ID | Тема | Матрица | Спека |
|----|------|---------|-------|
| TASK-004 | AI sanitizer + TL;DR/vibe при парсинге | §4 | [22](../features/content/22-ai-bot-concierge-and-intent.md), [16](../features/content/16-parsing-pipeline-extensions.md) |
| TASK-005 | Bot: QR после оплаты + helpdesk + scanner MVP | §5, §9 | [23](../features/content/23-bot-roles-ops-support.md), [18](../features/content/18-ticketing-full-flow.md) |
| TASK-006 | AI intent router (NL-поиск в боте) | §7 | [22](../features/content/22-ai-bot-concierge-and-intent.md) |
| — | `post_type`: отмена / перенос / sold-out | §4 | [16](../features/content/16-parsing-pipeline-extensions.md) |
| — | Cron-черновики подборок (Пт–Вс, ⭐4+) | §6 | [14](../features/content/14-digests-curated-admin-smm.md) |
| — | Mini App wireframes (tab bar, checkout) | §2 | [21](../features/content/21-mini-app-and-web-wireframes.md) |
| — | ЮKassa split + hold + оферта org | §9 | [18](../features/content/18-ticketing-full-flow.md), [24](../features/content/24-mvp-launch-checklist-ulan-ude.md) |

Индекс брейншторма 31.05: [fix/brainstorm/31.05.2026.md](../../fix/brainstorm/31.05.2026.md).

---

## Архив

| ID | Название | Закрыто | Коммит / PR |
|----|----------|---------|-------------|
| TASK-000 | Userbot: подписка на TG-каналы → ingest | 31.05.2026 | `workers/telegram-userbot/`, `035_city_telegram_sources.sql` |
| TASK-003 | Публичные org/venue и афиша на витрине | 31.05.2026 | [TASK-003-public-org-venue-storefront.md](./TASK-003-public-org-venue-storefront.md) — saleMode/CTA, org page, venue grid, stories |
| TASK-001 | Пре-фильтр + context_type + strict tags в Groq | 31.05.2026 | `contentPrefilter.ts`, `eventParsePrompt.ts`, `036_city_ingest_sources.sql` |
| TASK-002 | Web CRON + shadow org | 31.05.2026 | `web-sources-crawl.post.ts`, `ingestShadowOrg.ts`, `vercel.json` |

---

**Последнее обновление:** 31.05.2026 · активных: **0** · in_progress: **0**
