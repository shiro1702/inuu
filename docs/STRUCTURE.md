# Структура каталога `docs/`

Шпаргалка: **где лежит что** и **куда класть новый файл**. Обзор разделов — в [README.md](README.md).

---

## Дерево папок

```
docs/
├── README.md             ← вход: продукт INUU, навигация
├── STRUCTURE.md          ← этот файл
│
├── inuu/                 ← КАНОН: продукт, вертикали, data model, implementation
│   ├── 00–11-*.md
│   ├── verticals/
│   ├── marketing/        ← SMM, outreach B2B
│   └── implementation/   ← вычистка legacy + переделка кода
│
├── reference/            ← термины INUU, хроника изменений
├── platform/             ← сквозная инфра (часть legacy PocketMenu)
├── features/             ← RFC по фичам (ресторанные — legacy)
├── payments/
├── backlog/
├── runbooks/
├── integrations/
├── verticals/festival/
├── content/              ← brainstorm, карусели (не канон)
├── marketing/
├── meta/
└── archive/              ← пометка legacy PocketMenu
```

---

## Куда класть новый файл

| Если это… | Папка |
|-----------|--------|
| Видение, roadmap, вертикаль, схема БД INUU | **`inuu/`** |
| План удаления/рефакторинга кода под INUU | **`inuu/implementation/`** |
| Словарь терминов, «что изменилось» | `reference/` |
| Мультитенант, омниканал, биллинг (сквозное) | `platform/` |
| Спека одной фичи | `features/` |
| Платежи | `payments/` |
| План работ до реализации | `backlog/` |
| Матрица фич INUU (чеклисты) | **`inuu/tracker/`** |
| Ops (деплой, SSH, relay) | `runbooks/` |
| Внешняя интеграция | `integrations/` |
| Фестиваль | `verticals/festival/` |
| Черновик, рилс, стратегия без решения | `fix/brainstorm/` (индекс → `inuu/`) |
| Лендинг / карусели | `marketing/`, `content/instagram-carousels/` |
| Процесс (GSD, UI) | `meta/` |

---

## `inuu/` vs остальное

- **`inuu/`** — всё, что описывает **целевой продукт** и его реализацию в `incity-new`.
- **`platform/`**, **`features/`** — оставшиеся документы от ресторанной платформы; при переносе сути в INUU — дублировать в `inuu/` и в старом файле оставить ссылку «см. inuu/…» или перенести в `archive/`.

---

## Устаревание

Источник правды по продукту: **`docs/inuu/`**. Код и тесты — по факту поведения. Релизы — `reference/RECENT_MAJOR_CHANGES_RU.md`.
