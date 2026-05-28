# Runbook: менеджер контента (города)

Короткая инструкция для ежедневной работы менеджера с новостями и событиями.

---

## Цель

Быстро доводить входящий контент до публикации:

1. Принять входящий анонс.
2. Прогнать через AI-парсер.
3. Проверить качество и дубли.
4. Отправить в модерацию / на доработку.
5. Отслеживать качество по dashboard-метрикам.

---

## Базовый ежедневный цикл

### Шаг 1. Принять материал

Источники:

- партнёр в боте (`bot_submit`);
- парсер каналов (`telegram_parse`);
- ручной ввод (`manual_editor`).

Минимально должно быть:

- текст анонса,
- ссылка на источник,
- город,
- дата (или явное отсутствие даты для ручной доработки).

### Шаг 2. Parse-only проверка

Endpoint:

- `POST /api/ai/parse-event`

Проверяем:

- корректный `title`,
- извлечённые `dates`,
- `topic_tags`,
- `confidence`,
- `missing_fields`.

Если parse плохой (нет даты, confidence низкий), не публиковать автоматически.

### Шаг 3. Ingestion

Endpoint:

- `POST /api/ingest/content/submit`

Режимы:

- `persist=false` — тестовый прогон;
- `persist=true` — отправка в очередь (`content_submissions`).

Смотрим в ответе:

- `moderationStatus`: `pending` или `needs_revision`;
- `duplicates`: найденные похожие записи;
- `persisted.ok`: запись прошла или нет.

### Шаг 4. Решение по материалу

- `pending`: отправляем на модерацию и публикацию;
- `needs_revision`: менеджер правит поля (дата, место, теги, источник), затем повторный ingestion.

---

## Как читать статусы

| Поле | Значение | Что делать |
|------|----------|------------|
| `moderationStatus` | `pending` | Можно в рабочую очередь модерации |
| `moderationStatus` | `needs_revision` | Исправить обязательные поля и перезапустить |
| `persisted.ok` | `true` | Запись создана |
| `persisted.ok` | `false` | Проверить warning/схему БД |
| `duplicates.items.length > 0` | Есть дубли | Сверить вручную, не плодить повтор |

---

## Мониторинг качества (каждый день)

### Лента логов

- `GET /api/dashboard/ai/parse-logs`

Проверять:

- частые `failed` / `persist_failed`,
- источники с низким качеством extraction.

### Сводка

- `GET /api/dashboard/ai/parse-logs-stats`

Смотреть:

- `successRate`,
- `avgLatencyMs`,
- `avgConfidence`,
- `topErrors`.

Пороговые сигналы:

- success rate < 0.85;
- резкий рост `persist_failed`;
- `avgConfidence` < 0.60 по отдельному источнику.

---

## Работа с городами в новом dashboard

### Manager scope

- `GET /api/dashboard/manager/cities`
- `GET /api/dashboard/manager/cities/:slug/overview`

Использование:

- выбрать город, где есть доступ менеджера;
- видеть свой фактический охват (shops/venues/events/bookings).

### Platform admin scope (для центральной администрации)

- `GET /api/dashboard/admin/cities`
- `GET /api/dashboard/admin/cities/:slug/overview`

Использование:

- сравнивать эффективность городов;
- видеть проблемные города по контенту/событиям/AI quality.

---

## Эскалация проблем

Эскалировать разработчику, если:

1. `parse-event` стабильно падает (`failed`) по всем источникам.
2. `persist_failed` > 10 подряд.
3. Дашборд-эндпоинты городов возвращают 403 при корректных правах.
4. Метрики резко деградировали после деплоя (latency/tokens/errors).

В эскалации передавать:

- пример request payload,
- timestamp,
- `source_kind`,
- `city_slug`,
- `topErrors` из stats.

---

## Чеклист менеджера (на день)

- [ ] Проверил новые источники и приоритетные анонсы.
- [ ] Прогнал parse/ingest для входящих материалов.
- [ ] Разрулил `needs_revision`.
- [ ] Проверил дубли и не опубликовал повторы.
- [ ] Посмотрел `parse-logs-stats`.
- [ ] Передал проблемные кейсы в эскалацию.
