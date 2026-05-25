# Реализация INUU в репозитории

План перевода **incity-new** из legacy-кода ресторанной платформы в **городской агрегатор INUU** (без параллельного продукта PocketMenu).

| Документ | Назначение |
|----------|------------|
| [01-cleanup-unused.md](./01-cleanup-unused.md) | Что **удалить** из кода и UI |
| [02-refactor-existing.md](./02-refactor-existing.md) | Что **переделать** под INUU |

Связанные документы:

- [../10-existing-codebase.md](../10-existing-codebase.md) — что оставить из текущего кода
- [../11-tech-stack.md](../11-tech-stack.md) — стек
- [../05-roadmap-and-hypotheses.md](../05-roadmap-and-hypotheses.md) — этапы продукта

---

## Принципы

1. **Один продукт** — INUU; ресторанное меню, корзина блюд, кухня, POS не поддерживаются.
2. **Скрыть → deprecate → удалить** — сначала отключить маршруты и пункты меню, затем API, затем таблицы (с бэкапом).
3. **INUU-таблицы рядом** — `events`, `venues`, `bookings`; legacy `orders`/`products` выводятся из эксплуатации.
4. **Один деплой** — Nuxt + Supabase + TG/MAX.

---

## Порядок работ

```
Фаза 0  Скрытие ресторанных маршрутов и dashboard (01-cleanup)
Фаза 1  Главная, auth, city context (02-refactor, блок A)
Фаза 2  Bookings, favorites, бот (02-refactor, блоки B–C)
Фаза 3  Deprecate restaurant-only API (01-cleanup)
Фаза 4  Удаление файлов и drop таблиц — после стабилизации INUU в Улан-Удэ
```

Оценка: фазы 0–2 — 4–8 недель при part-time; фаза 4 — после метрик MVP.
