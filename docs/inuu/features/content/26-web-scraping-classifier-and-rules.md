# Web-парсинг: классификатор, роутер, self-healing rules

**Источник:** брейншторм [01.06.2026](../../../fix/brainstorm/01.06.2026.md) (01.06 07:58 – 08:06).

**База:** [17-ingest-sources-context.md](./17-ingest-sources-context.md), [25-groq-event-extraction-prompt.md](./25-groq-event-extraction-prompt.md).

**Cron:** `POST /api/cron/web-sources-crawl` (Vercel Cron).

---

## Проблема

Сайты организаторов ≠ API VK/TG: список ссылок, «портянка» на одной странице, SPA. Сырой HTML в Groq — дорого и шумно.

---

## Конвейер (Graceful Crawling)

```
fetch → cheerio sanitize → [кэш parsing_strategy?] → иначе Groq Classifier
  → Router → extract (CSS rules | text LLM) → ingest/submit
```

### Этап 0: Sanitize (без ИИ)

- Удалить `<script>`, `<style>`, `<footer>`, `<header>`, `<svg>`.
- Оставить текст + `href`; опционально HTML → Markdown для классификатора.
- Лимит ~3000 символов на запрос классификатору.

### Этап 1: Groq Classifier (лёгкая модель)

Типы страницы:

| `page_type` | Действие |
|-------------|----------|
| `single_event` | Текст страницы → [25](./25-groq-event-extraction-prompt.md) |
| `event_list_links` | Очередь URL → каждый как `single_event` |
| `text_wall` | Один промпт → массив `events[]` |
| `unknown` | Запись в `scraping_alerts`, уведомление в dashboard |

Ответ классификатора сохранять как **`parsing_strategy`** на `city_web_sources` / `sources` — не вызывать классификатор каждый cron, пока стратегия валидна.

### Этап 2: Router

- **Агрегаторы** (Яндекс.Афиша, Kassir…) — отдельный hardcoded adapter, **без** LLM на каждый обход.
- **Локальные сайты** — ИИ только при первом подключении и при поломке rules.

---

## `parsing_rules` (JSONB)

ИИ-разведчик один раз генерирует селекторы; дальше только cheerio:

```json
{
  "page_type": "single_event",
  "selectors": {
    "title": "h1.event-title",
    "start_time": "time[datetime]",
    "description": ".event-body",
    "price": ".ticket-price",
    "poster": ".poster-img img@src"
  },
  "list_link_pattern": "/events/*"
}
```

Синтаксис `@attr` — брать атрибут, не text.

### Fast lane → Auto-healing → Fallback

| Шаг | Условие |
|-----|---------|
| Fast lane | Есть `parsing_rules`, извлечены `title` + `start_time` |
| Auto-healing | Селекторы пустые / верстка сменилась → Groq → обновить `parsing_rules` |
| Fallback | Нет структуры → `innerText` → [25](./25-groq-event-extraction-prompt.md) |

---

## `scraping_alerts`

| Поле | Назначение |
|------|------------|
| `source_id` | Какой сайт |
| `url` | Страница |
| `reason` | `unknown`, `rules_failed`, `classifier_low_confidence` |
| `snapshot` | Опц. фрагмент текста для менеджера |

Менеджер добавляет adapter или правит rules в dashboard ([17](./17-ingest-sources-context.md)).

---

## Экономия токенов

- Кэш `parsing_strategy` + regex по `list_link_pattern` для новых URL.
- Классификатор — короткий контекст; extraction — только страницы событий.
- Не парсить одни и те же URL (fingerprint / `source_url` в [17](./17-ingest-sources-context.md)).

---

## Связанные документы

- [27-ingest-workers-vk-telegram-web.md](./27-ingest-workers-vk-telegram-web.md) — WEB worker
- [contentUrlEnricher](../../../server/utils/contentUrlEnricher.ts) — обогащение по URL
