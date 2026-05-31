# AI-бот: intent, консьерж, голос, группы

**Источник:** брейншторм [31.05.2026](../../../fix/brainstorm/31.05.2026.md) (31.05 07:49 – 08:39).

**Стек:** Nuxt Nitro webhook → Groq (`json_object`) → Supabase → Telegram.

**Статус:** спека; базовый NL-поиск — P2 после ingest. Санитар парсинга — P1 ([16](./16-parsing-pipeline-extensions.md)).

**Связано:** [13-ai-content-horizon.md](./13-ai-content-horizon.md), [12-afisha-tag-subscriptions.md](./12-afisha-tag-subscriptions.md), [implementation/03-ai-ingest-and-global-dashboards.md](../../implementation/03-ai-ingest-and-global-dashboards.md).

---

## Архитектура: Intent Router

```
Telegram message → webhook.post.ts
  → (voice?) Groq Whisper → text
  → Groq intent (Llama-3-8b, json_object) → { intent, params }
  → handler по intent → Supabase (+ опционально 2GIS/Places)
  → Groq форматирование ответа (70b) → карточки + inline buttons
```

**Typing action** пока идёт Groq + DB (~1–2 с).

При **429 Groq:** fallback — «Открой Афишу» + кнопка Mini App ([24](./24-mvp-launch-checklist-ulan-ude.md)).

### Intents (MVP+)

| Intent | Пример запроса | Действие |
|--------|----------------|----------|
| `direct_search` | «Стендап на выходных до 1000» | JSON-фильтры → Supabase → 3 карточки |
| `vibe_match` | «С пацанами, шумно, пиво, поржать» | Groq → categories[] → события |
| `random_weekend` | Кнопка 🎲 / «удиви меня» | `ORDER BY random()` → Groq презентация |
| `itinerary` | «Театр + поужинать недорого рядом» | событие + **2GIS/Places API** → сценарий |
| `gift` | «Подарок маме, любит классику» | подбор + опция сертификата |
| `quiz` | «Хочу квиз, команда из 4» | фильтр category=quiz + ближайшие даты |

Роутер — **отдельный быстрый вызов** 8b (~200 ms), не смешивать с генерацией текста.

---

## RAG: профиль пользователя

Перед вызовом Groq Nitro подтягивает из Supabase:

- теги подписок ([12](./12-afisha-tag-subscriptions.md));
- покупки (прошлые и будущие билеты);
- опционально: `customer_profiles.preference_tags` после AI-онбординга.

**Примеры поведения:**

| Ситуация | Ответ бота |
|----------|------------|
| «Куда в пятницу?» без деталей | Учитывает #техно + прошлые рейвы |
| «Подборка на выходные» | Исключает субботу 20:00 — уже куплен стендап |
| «Хочу новое» | Конtrast к истории (квизы → иммерсивный театр) |

**AI-онбординг `/start`:** «Что любишь?» → Groq → массив тегов в профиль.

**Персональные push:** cron находит новое событие по тегу → Groq текст → сегмент покупателей жанра.

---

## Голосовые сообщения

Groq **Whisper** (`whisper-large-v3`): Telegram `.ogg` → текст → тот же intent pipeline.

**UX:** в начале ответа показывать распознанный текст:

> 🎤 «Хочу на стендап на Арбате» — вот что нашёл…

LLM на этапе intent игнорирует «эээ», «подожди» в транскрипте.

**Vercel timeout:** для длинных voice — сразу `sendMessage("Слушаю…")`, тяжёлую логику — async после ACK webhook.

---

## Групповые чаты (growth)

Privacy Mode TG **оставляем включённым** — бот видит только:

- команды `/…`;
- `@inuu_bot …`;
- reply на сообщение бота.

### Механики

| # | Фича | Поведение |
|---|------|-----------|
| 1 | **ИИ-примиритель** | 3 варианта + автоматический Telegram Poll «Куда идём?» |
| 2 | **Reply-контекст** | Reply на сообщение друга + `@bot спасай` → Groq читает оба текста |
| 3 | **Voice + mention** | Reply на войс + `@bot` → Whisper исходного + поиск |

Кнопка в личке: **[ Добавить в чат с друзьями ]**.

---

## AI на бэкенде (не только чат)

| # | Фича | MVP? | Документ |
|---|------|------|----------|
| Санитар парсинга | clean_title, price, category из мусора | **P1 Must** | [16](./16-parsing-pipeline-extensions.md) |
| TL;DR + vibe | 2 предложения + 3 эмодзи на карточке | **P1 Must** | [13](./13-ai-content-horizon.md) |
| «🪄 Сделать красиво» B2B | черновик из сырого текста org | P2 | [19](./19-organizer-lk-monetization.md) |
| SEO-рерайт страниц | уникальные meta для parsed events | P2 | [13](./13-ai-content-horizon.md) |
| Дерзкие push-пятницы | Groq ToV для digest | P3 | [14](./14-digests-curated-admin-smm.md) |

---

## Экономия Groq (Улан-Удэ)

| Приём | Зачем |
|-------|-------|
| 8b для intent, 70b только для финального текста | RPM/TPM |
| В промпт ≤5 событий после фильтра Supabase | токены |
| Кеш «рулетки выходных» — 5 текстов утром пятницы | повторные нажатия |
| Graceful 429 | лояльность vs «бот сломался» |

Подробнее лимиты: [24-mvp-launch-checklist-ulan-ude.md](./24-mvp-launch-checklist-ulan-ude.md), [11-tech-stack.md](../../11-tech-stack.md).

---

## pgvector (после MVP)

Семантический поиск, если `.ilike` + intent не хватает («потанцевать и поплакать»). Supabase pgvector — фаза 2.
