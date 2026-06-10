# Карусели — ИИ и Groq

## Обзор пайплайнов

```
Текст / события
      │
      ▼
generateCarouselWithGroq()  ──или──  generateSlideWithGroq()
      │
      ▼
JSON: slides + sticker_intents + image_tags
      │
      ├── mapGroqSlidesToCarousel() / mapGroqSlideToCarousel()
      ├── applyPresetUrlsToSlides()     ← carousel_preset_images
      └── matchStickerIntents()         ← stickers table
      │
      ▼
CarouselSlide[] в store / БД
```

Код: `server/utils/ai/groqCarouselGenerate.ts`.

---

## 1. Карусель целиком

**Endpoint:** `POST /api/ai/carousel/generate`

**Body:**

```json
{
  "mode": "raw",
  "text": "текст анонса…",
  "city_slug": "ulan-ude",
  "vibe_key": "party"
}
```

### Режимы `mode`

| mode | Вход | Поведение |
|------|------|-----------|
| `raw` | `text` | 3–5 слайдов из анонса |
| `events` | `events[]` | Сжатие N событий в карусель |
| `text_mash` | `text` | Пост с несколькими событиями → карусель |
| `poster` | `text` | Один слайд-афиша 9:16 |

### Ответ (успех)

```json
{
  "ok": true,
  "source": "groq",
  "model": "llama-3.3-70b-versatile",
  "latency_ms": 1200,
  "title": "Заголовок карусели",
  "telegram_post_text": "Текст для TG…",
  "slides": [ … ],
  "sticker_intents": [ … ]
}
```

### Fallback

- Нет `NUXT_GROQ_API_KEY` → `parseInstagramCarouselToSlides()` или deterministic events build.
- Ошибка Groq → local split по `---` / нумерации.

**UI:** `CarouselImportTextSheet.vue` (режим «ИИ (Groq)»).

---

## 2. Один слайд

**Endpoint:** `POST /api/ai/carousel/generate-slide`

**Body:**

```json
{
  "text": "Концерт в пятницу, 19:00, клуб «Город»…",
  "city_slug": "ulan-ude",
  "slide_role": "cover",
  "vibe_key": "party",
  "carousel_title": "Афиша выходных",
  "slide_index": 0,
  "total_slides": 4
}
```

`slide_role`: `cover` | `body` | `outro`.

Промпт учитывает роль:

- **cover** — яркий заголовок, subtitle, `image_tags`;
- **body** — title + тезисы (`text`, `badge`);
- **outro** — `cta_text`, минимум текста.

### Ответ

```json
{
  "ok": true,
  "source": "groq",
  "slide": { "role": "cover", "title": "…", "media_url": "…", "gradient": "party" }
}
```

Fallback: `localFallbackSlideFromText()` — первая строка = заголовок, остальные = bullets.

**UI:** `CarouselEditSlideSheet.vue` → блок «ИИ (Groq)».

При merge в store (`CarouselEditorShell.onSlideAiGenerated`):

- роль слайда сохраняется;
- вручную расставленные `objects` (стикеры) не затираются.

---

## 3. Fill user template

**Endpoint:** `POST /api/ai/carousel/fill-template`

Обновляет только текстовые `content` в `layout_config`, координаты и id не меняет.

Используется при «Применить шаблон» + новый текст (волна 4c).

---

## Формат ответа Groq (карусель)

```json
{
  "carousel_title": "string",
  "theme": "cozy_aesthetic",
  "telegram_post_text": "string",
  "slides": [
    {
      "type": "first | middle | last",
      "title": "string",
      "event_datetime": "7 июня, 19:00",
      "event_venue": "Клуб «Город»",
      "event_price": "от 500₽",
      "text": "только описание/тезис",
      "cta_text": "string",
      "image_tags": ["city sunset", "concert"]
    }
  ],
  "sticker_intents": [
    {
      "tag": "fire",
      "anchor": "flow",
      "anchor_target": "title",
      "position_hint": "top-right"
    }
  ]
}
```

Маппинг `type` → `role`: `first`→`cover`, `middle`→`body`, `last`→`outro`.

---

## Формат ответа Groq (один слайд)

```json
{
  "slide": {
    "type": "first",
    "title": "…",
    "subtitle": "…",
    "text": "…",
    "badge": "…",
    "cta_text": "…",
    "image_tags": ["…"]
  },
  "sticker_intents": []
}
```

---

## Matchers после Groq

### Image tags → preset URL

`server/utils/carouselImageMatcher.ts`

- Таблица `carousel_preset_images` (tags, vibe_slugs, storage_path).
- Score по overlap тегов + vibe.
- Event cover URLs — приоритет на cover-слайде.

### Sticker intents → objects

`server/utils/carouselStickerMatcher.ts`

- Таблица `stickers` (name, tags, image_url).
- `position_hint`: `top-right`, `top-left`, `bottom` → x/y.
- Результат: `CarouselCanvasObject` в `slide.objects[]`.

---

## Модели и retry

1. Primary: `NUXT_GROQ_MODEL` (default `llama-3.3-70b-versatile`).
2. Fallback: `NUXT_GROQ_CLASSIFIER_MODEL` (default `llama-3.1-8b-instant`).

`response_format: { type: 'json_object' }`, temperature ≈ 0.35.

Ошибки: `groqErrorHint()` из `server/utils/ai/groqParseErrors.ts`.
