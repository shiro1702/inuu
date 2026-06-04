# Волна 3c — таксономия и первый «денежный» push

План задач: [ACTIVE_TASKS.md](../tracker/ACTIVE_TASKS.md) (TASK-022 → TASK-024).

| Документ | Фича | Матрица |
|----------|------|---------|
| TASK-022 | `topic_tags` на подборках + наследование в авто-дайджесте | §6 |
| TASK-023 | Смарт-лента: фильтр по тегам (events + editorial + lists) | §6 |
| TASK-024 | Push при publish события (match тегов / `events`) | §7 |

Спеки: [31-content-tags-vibes-taxonomy.md](../features/content/31-content-tags-vibes-taxonomy.md) · [06-bot-digest-subscriptions.md](../features/content/06-bot-digest-subscriptions.md)

---

## Порядок и зависимости

```text
TASK-022 (БД + digest tags) ──┬──► TASK-023 (смарт-лента UI/API)
                              └──► TASK-024 (push на publish event)
```

Рекомендуемый порядок чатов: **022 → 023 → 024**. 024 можно начать после миграции 022, если notify-утилита не зависит от ленты.

---

## Smoke-чеклист волны 3c (~20 мин)

1. **022** — `curated_lists.topic_tags` в БД; авто-лист `week-…` после digest `approve_all` получает union тегов из событий пакета.
2. **022** — chips тегов на `/lists/[slug]`; dashboard: поле тегов при сохранении подборки (если в scope).
3. **023** — `?tag=romance` на главной/журнале фильтрует events + editorial + lists (OR внутри типа).
4. **024** — publish события с `topic_tags` → TG push подписчикам `events` + пересечение `interest_tags` (пустые interest = все по теме).
5. **024** — cooldown / без дубля при повторном publish; нет push при `marketing_opt_out`.

---

## Ключевые URL (dev: `ulan-ude`)

| Что | Локально |
|-----|----------|
| Афиша + теги | http://localhost:3000/ulan-ude/events?tag=culture |
| Главная / журнал | http://localhost:3000/ulan-ude |
| Подборка | http://localhost:3000/ulan-ude/lists/{slug} |
| Подписки | http://localhost:3000/ulan-ude/subscriptions |

---

## Связанные файлы (стартовая карта)

| Область | Пути |
|---------|------|
| Миграции | `supabase/migrations/050_*.sql` (новая) |
| Digest lists | `server/utils/curatedListPeriod.ts`, `inuuContentModeration.ts` |
| Публичное API | `server/api/cities/[slug]/events/`, `editorial/`, `lists/` |
| Подписки | `server/utils/cityTagSubscriptions.ts`, `cityNotifySubscriptions.ts` |
| Publish | `server/utils/contentSubmissionPublish.ts` |
| Витрина | `pages/[city_slug]/events/index.vue`, `layouts/city.vue` |

Прод: `https://inuu.ru/ulan-ude/…` — см. [WAVE_3B_README.md](./WAVE_3B_README.md).

**Следующая волна:** [WAVE_3D_README.md](./WAVE_3D_README.md) — PNG карусели и сторис (без WebCodecs).
