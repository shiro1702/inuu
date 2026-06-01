# Источники ingest: контекст, web-cron, теневые организации

**Источник:** брейнштормы [30.05.2026](../../../fix/brainstorm/30.05.2026.md), [01.06.2026](../../../fix/brainstorm/01.06.2026.md).

**Расширения web:** [26-web-scraping-classifier-and-rules.md](./26-web-scraping-classifier-and-rules.md). Воркеры: [27-ingest-workers-vk-telegram-web.md](./27-ingest-workers-vk-telegram-web.md).

---

## `native` vs `parsed`

| `source_type` | Кто создал | CTA в Mini App |
|---------------|------------|----------------|
| `native` | Организатор в ЛК / бот после claim | **Купить билет** (ЮKassa, hold, QR) |
| `parsed` | Userbot / web-cron / VK | **Купить на сайте организатора** (`registration_url`) |

Продажа через нашу кассу только при договоре с организатором.

### Монетизация parsed

- CPA / партнёрские ссылки (Kassir, Яндекс.Афиша) — опционально.
- **Claim Event:** «120 просмотров → заберите карточку» → `parsed` → `native`.
- Наполнение базы для консьержа и EventPass без комиссии с билета.

---

## Таблица `sources` (расширение)

| Поле | Назначение |
|------|------------|
| `url` | Сайт или `@channel` |
| `organization_id` | Привязка к org |
| `context_type` | `club`, `theater`, `standup`, `library`, … — **в system prompt** |
| `parsing_rules` | JSON: CSS-селекторы ([26](./26-web-scraping-classifier-and-rules.md)) |
| `parsing_strategy` | Кэш типа страницы после классификатора (`single_event`, `event_list_links`, …) |
| `external_id_strategy` | `url` \| `fingerprint` |

Таблица **`scraping_alerts`**: источник не распарсился (`unknown`, сломанные rules) — для dashboard менеджера.

### Контекст в промпте

Пример для клуба: искать line-up, dress code, столы.  
Для театра: состав, возраст 12+, ряды.

Снижает галлюцинации и объём «лишних» полей в JSON.

---

## Дедупликация

| Сценарий | Ключ |
|----------|------|
| Есть URL события | `source_url` / `external_id` → upsert |
| TG-пост без URL | fingerprint: `date + venue + title_prefix` |

---

## Web CRON (03:00)

1. Обход whitelist сайтов (Puppeteer при Cloudflare).
2. Skip если fingerprint/url уже в БД.
3. Groq extract → `content_submissions` / `pending`.
4. Картинка → Storage.

Переиспользовать тот же `groqEventParser`, что для TG.

---

## Теневой профиль организации

При первом парсинге источника:

1. Test-run 3 поста/страницы.
2. Groq + scrape: название, лого, адрес, описание.
3. Создать `organizations` с `is_claimed=false`, `manager_approved=false`.
4. Менеджер: **Approve** в web или TG (`✅` / `✏️ в web`).

B2B: «У вас уже есть страница, 50 подписчиков — подтвердите владение».

---

## Регистрация источника

| Канал | Кто |
|-------|-----|
| Web dashboard (city-ops) | Менеджер — основной |
| Команды бота | Запасной |

Поток: URL → test parse → предложение org + context → approve → cron enabled.

---

## Связи

- [10-telegram-sources-without-bot-access.md](./10-telegram-sources-without-bot-access.md)
- [09-data-model-overview.md](../../09-data-model-overview.md)
- [16-parsing-pipeline-extensions.md](./16-parsing-pipeline-extensions.md)
