# Ingest-воркеры: VK API, Telegram Web, сайты

**Источник:** брейншторм [01.06.2026](../../../fix/brainstorm/01.06.2026.md) (01.06 08:12 – 08:17).

**База:** [08-event-sourcing-and-moderation-pipeline.md](./08-event-sourcing-and-moderation-pipeline.md), [10-telegram-sources-without-bot-access.md](./10-telegram-sources-without-bot-access.md).

---

## Три параллельных воркера

| Worker | Источник | Выход |
|--------|----------|--------|
| **VK** | `wall.get` JSON | `POST /api/ingest/content/submit` |
| **TG Web** | `https://t.me/s/{channel}` HTML | то же |
| **WEB** | Whitelist сайтов + [26](./26-web-scraping-classifier-and-rules.md) | то же |

Общая очередь → Groq ([25](./25-groq-event-extraction-prompt.md)) → **модераторский чат** (approve/reject).

Cron: Vercel / Nitro — интервал по платформе (VK/TG ~3–6 ч, TG web не чаще **1–2 ч** на канал — риск rate limit IP).

---

## VK Worker

### Настройка

- Приложение VK Developers → **service access token**.
- В `city_ingest_sources` / dashboard: `platform = vk`, `domain` (напр. `harats_uu`).

### Забор

```
GET https://api.vk.com/method/wall.get?domain={domain}&count=5&v=5.131&access_token=...
```

Только последние **5** постов; `date` → `publication_date` для промпта.

### Пре-фильтр (до Groq)

Триггеры (хотя бы одно): билет, вход, старт, сбор, ждём вас, бронь, line-up, концерт, мастер-класс, начало в, …  
Бан: «фотоотчёт», «ищем официанта», чистый мем.

### HD-афиша

Из `attachments[].photo.sizes` выбрать максимальный тип **`w` > `z` > `y`** → `poster_url`.

---

## TG Web Worker (`t.me/s/`)

Альтернатива MTProto/userbot для **публичных** каналов ([10](./10-telegram-sources-without-bot-access.md)).

| Элемент | Селектор / атрибут |
|---------|-------------------|
| Пост | `.tgme_widget_message` |
| Текст | `.tgme_widget_message_text` (`<br>` → `\n`) |
| Дата | `time[datetime]` в `.tgme_widget_message_date` |
| Фото | `.tgme_widget_message_photo_wrap` → `style` → regex `url('...')` |

Последние **3–5** постов → тот же пре-фильтр, что VK → submit.

**Userbot** остаётся для закрытых каналов и медиа, куда web не отдаёт контент.

---

## WEB Worker

См. [26-web-scraping-classifier-and-rules.md](./26-web-scraping-classifier-and-rules.md), cron `web-sources-crawl`.

---

## Inbound в [08](./08-event-sourcing-and-moderation-pipeline.md)

| `source.kind` | Описание |
|---------------|----------|
| `vk_parse` | VK wall |
| `telegram_web` | `t.me/s/` |
| `web_cron` | Сайт org |
| `telegram_parse` | Userbot (как сейчас) |
| `bot_submit` | Ручная подача |

---

## Не в scope этого документа

- Cross-source дедуп — модерация вручную на старте.
- Автопубликация в канал без approve — см. [14](./14-digests-curated-admin-smm.md).

---

## Связанные документы

- [platform/OMNICHANNEL_MULTITENANT_PLAN_RU.md](../../../platform/OMNICHANNEL_MULTITENANT_PLAN_RU.md)
- [implementation/03-ai-ingest-and-global-dashboards.md](../../implementation/03-ai-ingest-and-global-dashboards.md)
- `workers/telegram-userbot/README.md` — userbot
