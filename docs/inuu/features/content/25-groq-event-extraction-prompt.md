# Groq: извлечение события — промпт, даты, поля JSON

**Источник:** брейншторм [01.06.2026](../../../fix/brainstorm/01.06.2026.md) (31.05 12:47 – 12:56, 01.06 08:12).

**База:** [08-event-sourcing-and-moderation-pipeline.md](./08-event-sourcing-and-moderation-pipeline.md), [16-parsing-pipeline-extensions.md](./16-parsing-pipeline-extensions.md).

**Код:** `server/utils/ai/groqEventParser.ts`, `eventParseSchema.ts`, `eventParsePrompt.ts`.

---

## Принципы

| Правило | Почему |
|---------|--------|
| Источник **жёстко** привязан к org в БД | ИИ не угадывает площадку по тексту — `organization_id` из `sources` |
| Groq только для **неструктурированного текста** | Не кормить сырой HTML ([26](./26-web-scraping-classifier-and-rules.md)) |
| Факты не выдумывать | Неизвестное поле → `null` ([08](./08-event-sourcing-and-moderation-pipeline.md)) |

---

## Две даты в system prompt

| Переменная | Назначение |
|------------|------------|
| `publication_date` (+ день недели, locale `ru-RU`) | Отсчёт для «сегодня», «завтра», «в пятницу» |
| `current_date` (+ день недели) | `is_past_event`: не тащить прошедшее при запоздалом cron |

**Пример:** пост во вторник «завтра квиз», парсинг в четверг → событие среды, `is_past_event: true` → skip или reject на бэкенде.

Дополнить [15-event-detail-series-venues.md](./15-event-detail-series-venues.md): в промпте всегда обе даты, не только `current_date`.

---

## Расширенные поля JSON (из текста)

| Поле | Извлечение |
|------|------------|
| `registration_required`, `ticket_url`, `booking_phone` | CTA: бронь / билеты |
| `age_restriction` | Явно в тексте; иначе `18+` для бара/клуба по контексту org |
| `performers[]` | Line-up, спикеры, комики |
| `is_past_event` | Сравнение даты события с `current_date` |
| `events[]` | Несколько мероприятий в одном посте («портянка») — см. [11](./11-digest-parsing-and-curated-picks.md) |

**Контекст org в prompt (не в JSON):**

```
Организатор/площадка: {ORGANIZATION_NAME} ({type: venue|promoter|both})
```

Снижает ошибки адреса: адрес брать из профиля org, не из поста.

---

## Метаданные без ИИ

| Поле | Источник |
|------|----------|
| `poster_url` | VK `attachments` (max size `w`/`z`/`y`), TG photo, web selector |
| `latitude` / `longitude` | Таблица org / venue — один раз вручную |
| `original_post_url` | `source.url` обязателен |
| `engagement` (опц.) | Реакции VK/TG для ранжирования — backlog |

---

## Теги

- В prompt: **список существующих** тегов города → выбрать 1–5.
- `suggested_new_tags[]` — только предложения; в словарь после апрува в dashboard ([16](./16-parsing-pipeline-extensions.md)).
- Синонимы и опечатки не писать в `events` напрямую.

---

## Дедупликация (в рамках org)

Перед insert: есть ли событие у той же `organization_id` с похожим `title` и `start_time` ± **3 часа** → skip.

Cross-source дедуп (бар + городской паблик + комик) — **не MVP**; есть модераторский бот ([raw](../../../fix/brainstorm/01.06.2026-raw.md) ~315).

---

## Валидация после Groq

1. Zod / `eventParseSchema` — отбраковка битого JSON.
2. `is_past_event` или дата в прошлом → `skipped` в `ai_parse_logs` (миграция 037).
3. Пре-фильтр **до** Groq — [16](./16-parsing-pipeline-extensions.md), [27](./27-ingest-workers-vk-telegram-web.md).
4. Persist → `content_submissions` → модерация ([08](./08-event-sourcing-and-moderation-pipeline.md)).

---

## Связанные документы

- [17-ingest-sources-context.md](./17-ingest-sources-context.md) — `context_type` в промпте
- [implementation/03-ai-ingest-and-global-dashboards.md](../../implementation/03-ai-ingest-and-global-dashboards.md)
