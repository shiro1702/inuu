# Трекер фич INUU

Живая матрица: **что запланировано**, **насколько сложно**, **насколько важно**, **сделано ли**.

| Файл | Назначение |
|------|------------|
| [FEATURE_MATRIX.md](./FEATURE_MATRIX.md) | Все фичи по группам + чекбоксы + ссылки на спеки |
| [ACTIVE_TASKS.md](./ACTIVE_TASKS.md) | **Активная очередь** (≤3 задачи на чат) — вместо кэша в Cursor |
| [TASK-003-public-org-venue-storefront.md](./TASK-003-public-org-venue-storefront.md) | Runbook исполнения TASK-003 (org/venue, CTA, stories) |
| [TASK-008-web-parsing-pipeline.md](./TASK-008-web-parsing-pipeline.md) | Runbook web crawl TASK-008–010 (classifier, rules, alerts) |
| [WAVE_3B_README.md](../runbooks/WAVE_3B_README.md) | **Волна 3b:** индекс проверки (WebP, статусы, weekend check) + URL прод/localhost |
| [WAVE_3C_README.md](../runbooks/WAVE_3C_README.md) | **Волна 3c:** topic_tags на lists, смарт-лента, push при publish события (TASK-022–024) |
| [WAVE_3D_README.md](../runbooks/WAVE_3D_README.md) | **Волна 3d:** PNG для каруселей и сторис (TASK-025–027); video — 3f+ |

## Как пользоваться

### Матрица (`FEATURE_MATRIX.md`)

1. Открыть `FEATURE_MATRIX.md`, найти группу.
2. Колонка **Статус:** `[x]` — сделано; `[~]` — в работе; `[ ]` — не сделано или только спека.
3. Начали фичу — `[ ]` → `[~]`; закончили — `[~]` → `[x]`. Обновить сводку внизу матрицы.
4. При релизе — при необходимости добавить строку в [RECENT_MAJOR_CHANGES_RU.md](../../reference/RECENT_MAJOR_CHANGES_RU.md).

### Активные задачи (`ACTIVE_TASKS.md`)

1. В начале сессии: `@docs/inuu/tracker/ACTIVE_TASKS.md` — scope, спеки, in/out уже в файле.
2. Берём **одну** задачу со статусом `todo` → ставим `in_progress`, в матрице — `[~]`.
3. Задача должна закрываться за **~75% контекста** одного чата; иначе — дробим.
4. Закончили → `done`, строка в **Архив**, матрица `[x]`, берём следующую из «Следующая волна» или добавляем новую (макс. 3 активных).

> Cursor-правила: `.cursor/rules/inuu-feature-matrix.mdc`, `.cursor/rules/inuu-active-tasks.mdc`

## Легенда оценок

| Шкала | Сложность (1–5) | Важность | Монетизация |
|-------|-----------------|----------|-------------|
| 1 | 1–3 дня | P0 — без этого продукт не летит | — нет прямого дохода |
| 2 | ~1 нед | P1 — сильно влияет на retention/наполнение | низ |
| 3 | 2–3 нед | P2 — рост / деньги после PMF | сред |
| 4 | 1–2 мес | P3 — nice-to-have / сезон | выс |
| 5 | 2+ мес, высокий риск | — | — |

**Последнее обновление матрицы:** 01.06.2026 (web pipeline TASK-008–010, спеки 25–29)

## Брейнштормы → трекер

| Индекс | Новые строки в матрице |
|--------|------------------------|
| [30.05.2026](../../fix/brainstorm/30.05.2026.md) | §4–§13, спеки 13–20 |
| [31.05.2026](../../fix/brainstorm/31.05.2026.md) | §2 TMA/сайт, §4 AI sanitizer, §5 helpdesk, §7 intent/voice, §9 билеты MVP, §13 рулетка |
| [01.06.2026](../../fix/brainstorm/01.06.2026.md) | §1–§13 парсинг/VK/web, §18–§22 share/TMA, §21–§22 NLP admin — спеки **25–29** |
