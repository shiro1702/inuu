# Волна 4a–4d — Carousel Editor SaaS

**Источник:** брейншторм [10.06.2026](../../fix/brainstorm/10.06.2026.md) · спеки [38](../features/content/38-carousel-editor-saas.md), [39](../features/content/39-carousel-canvas-architecture.md), [40](../features/content/40-carousel-assets-and-stickers.md).

**Документация (актуальный индекс):** [carousel/README.md](../features/content/carousel/README.md) — user guide, developer guide, ИИ, data model.

**Предусловие:** волна **3d** закрыта (TASK-025–027, PNG-рендер) · волна **3e** (TASK-028–030) — retention/push.

---

## URL для smoke-тестов

| Среда | Carousel Studio | Carousel Editor |
|-------|-----------------|-----------------|
| **Тест (Vercel)** | [inuu-topaz.vercel.app/dashboard/carousel-studio](https://inuu-topaz.vercel.app/dashboard/carousel-studio) | `…/dashboard/carousel/edit/{id}` |
| **Локально** | http://localhost:3000/dashboard/carousel-studio | http://localhost:3000/dashboard/carousel/edit/{id} |
| **Прод** | https://inuu.ru/dashboard/carousel-studio | https://inuu.ru/dashboard/carousel/edit/{id} |

Вход в dashboard обязателен. На тестовом стенде: логин → **«Новый проект + share link»** → новый редактор.

---

## Зачем

3d дала **статический PNG-экспорт** из multiplier. 4a–4d — **интерактивный mobile-first редактор** (Instagram UX): Groq из текста, правка на холсте, шаринг, шаблоны, TG.

---

## Карта волн

| Волна | Задачи | Результат для редакции |
|-------|--------|------------------------|
| **4a** | TASK-031–033 | Share link, style packs, mobile preview |
| **4b** | TASK-034–036 | Groq one-click, подборки, пресеты фонов |
| **4c** | TASK-037–039 | Flow/absolute canvas, user templates, стикеры |
| **4d** | TASK-040–041 | Афиши 9:16, TG send + queue |

---

## 4a — фундамент (TASK-031–033)

### TASK-031 · `generated_carousels` + share link

- Migration + Nitro API: create / get / update
- Route `/dashboard/carousel/edit/[id]`
- Кнопка «Поделиться» → copy URL
- Pinia + `pinia-plugin-persistedstate` для черновика

### TASK-032 · Style packs — ✅ уже в 3d

**8 шаблонов** в `utils/carouselTemplates.ts` (см. [35](../features/content/35-html-carousel-video-studio.md)).  
В 4a **не блокер**. Опционально: один доп. pack `acid-brutal` или Google Fonts.

### TASK-033 · Mobile preview shell

- Fullscreen mobile layout: header + canvas + thumb-zone actions
- Swipe prev/next; bottom sheet «Редактировать слайд»
- Dev route `/dev/carousel-editor`

**Smoke 4a:** создать проект → выбрать theme → 3 слайда preview → share link → открыть в другом браузере → тот же JSON.

---

## 4b — AI + медиа (TASK-034–036)

### TASK-034 · Groq raw text → carousel

- Nitro `POST /api/ai/carousel/generate`
- Промпт → slides JSON (как в спеке 38)
- Hook в dashboard content-ai или отдельная вкладка

### TASK-035 · Подборка → карусель

- UI: чекбоксы events + режим «из текста»
- Groq сжимает N событий в carousel JSON
- Связь с `curated_lists` (опционально save)

### TASK-036 · Preset images + image_tags matcher

- Storage folders `carousel-presets/`
- Table `carousel_preset_images` + seed Улан-Удэ
- Matcher: `image_tags` → url

**Smoke 4b:** вставить текст анонса → 4 слайда с фонами; выбрать 3 события → подборка-карусель.

---

## 4c — продвинутый холст (TASK-037–039)

### TASK-037 · Flow + absolute canvas

- JSON schema v2 ([39](../features/content/39-carousel-canvas-architecture.md))
- Dual-pass renderer; virtual canvas 1000×1778
- Snap + anchor flow (без haptic в MVP — ok)

### TASK-038 · User templates

- Table `user_templates` + CRUD
- «Сохранить как шаблон» / «Применить»
- Groq fill: blind JSON copy + roles fallback

### TASK-039 · Sticker library

- Table `stickers` + seed 18 шт. ([40](../features/content/40-carousel-assets-and-stickers.md))
- Bottom sheet; drag on canvas
- Groq `sticker_intents` → matcher

**Smoke 4c:** сохранить шаблон → новый текст + apply → тексты заменены, лого на месте; добавить стикер fire к заголовку.

---

## 4d — форматы + TG (TASK-040–041)

### TASK-040 · Poster / single post formats

- `project_type`: carousel | post | story | cover
- Aspect switcher 1:1 / 4:5 / 9:16 / 16:9
- Groq `telegram_post_text` + copy button

### TASK-041 · Отправка в Telegram

- Кнопка «Отправить в TG» (ЛС / moderation chat по роли)
- `telegram_queue` worker (reuse patterns from broadcast)
- Media group PNG из `html-to-image`

**Smoke 4d:** афиша 9:16 → PNG → очередь → media group в mod chat.

---

## Зависимости

```
3d (PNG renderer) ──► 4a (schema + UI shell)
                         ├──► 4b (Groq + presets)
                         └──► 4c (canvas v2 + stickers)
                                  └──► 4d (formats + TG)
3e (push/retention) — параллельно, не блокирует 4a
```

---

## Ключевые файлы (ожидаемые)

| Область | Путь |
|---------|------|
| Editor UI | `components/carousel-editor/` |
| State | `stores/carouselEditor.ts` |
| API | `server/api/ai/carousel/` |
| Migrations | `supabase/migrations/052_generated_carousels.sql` (и далее) |
| Groq | `server/utils/groqCarouselGenerate.ts` |

---

## Out of scope (всех волн 4)

- Client WebCodecs / MP4 (→ backlog 3f video)
- Server Puppeteer render
- Full Figma-like layers panel
- Unsplash integration (можно после 4b matcher)
- Публичный SaaS для внешних агентств (только manager/partner roles)

---

**Последнее обновление:** 10.06.2026
