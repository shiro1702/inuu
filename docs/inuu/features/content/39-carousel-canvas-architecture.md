# Carousel Canvas — техническая архитектура холста

**Источник:** брейншторм [10.06.2026](../../../fix/brainstorm/10.06.2026.md) (разделы flow/absolute, якоря, virtual canvas, AI pipeline).

**Связь:** [38-carousel-editor-saas.md](./38-carousel-editor-saas.md) · [35-html-carousel-video-studio.md](./35-html-carousel-video-studio.md)

**Статус:** спека · реализация волна **4c**.

---

## Проблема

Чистое absolute positioning (как Figma без Auto Layout) ломается, когда Groq генерирует заголовок длиннее ожидаемого.

**Решение:** гибрид **Relative Flow + Absolute Overlays**.

---

## Анатомия слоёв

```
┌─────────────────────────────┐
│  Background (full bleed)    │
├─────────────────────────────┤
│  Flow Stack (flex column)   │  ← title, subtitle, body, media-in-flow
│    ┌─ anchor wrapper ─┐     │
│    │  local absolutes │     │  ← стикеры с anchor=flow
│    └──────────────────┘     │
├─────────────────────────────┤
│  Canvas absolutes (z)       │  ← anchor=canvas (водяной знак, декор)
└─────────────────────────────┘
```

| Слой | Позиционирование | Примеры |
|------|------------------|---------|
| Background | CSS `background-image` / gradient | Фото города, vibe gradient |
| Flow stack | Flexbox, порядок в JSON | category, title, subtitle, description |
| Flow-anchored satellites | `position: absolute` относительно flow-wrapper | Бейдж у заголовка, стрелка к дате |
| Canvas satellites | `position: absolute` относительно холста | Watermark, neon glow, угловой «18+» |

---

## JSON-схема слайда (v2)

```json
{
  "type": "middle",
  "layout_variant": "text_right_image_left",
  "theme_id": "cozy_aesthetic",
  "background": { "type": "image", "url": "…", "overlay": "rgba(0,0,0,0.4)" },
  "flow": [
    { "id": "category", "kind": "text", "role": "category", "content": "КОНЦЕРТ" },
    { "id": "title", "kind": "text", "role": "title", "content": "Антоха МС" },
    { "id": "desc", "kind": "text", "role": "description", "content": "…" },
    { "id": "hero", "kind": "media", "role": "hero_image", "url": "…", "layout": "inset" }
  ],
  "objects": [
    {
      "id": "badge_price",
      "kind": "sticker",
      "sticker_id": "uuid",
      "anchor": "flow",
      "anchor_target": "title",
      "x": 85, "y": -10,
      "scale": 1, "rotation": 0,
      "zIndex": 15
    },
    {
      "id": "wm",
      "kind": "text",
      "content": "@incity",
      "anchor": "canvas",
      "x": 5, "y": 5,
      "fontSize": 14,
      "zIndex": 20
    }
  ]
}
```

### Поля absolute object

| Поле | Тип | Описание |
|------|-----|----------|
| `anchor` | `canvas` \| `flow` | Родительская система координат |
| `anchor_target` | `flow[].id` | При `anchor=flow` — к какому блоку привязан |
| `x`, `y` | number (virtual units) | Смещение от угла якоря (%, 0–100) |
| `zIndex` | int | Порядок слоя; текст flow ≈ 10 |
| `kind` | `sticker` \| `text` \| `logo` | Тип объекта |

---

## Virtual Canvas (координаты)

Внутренний размер холста **всегда фиксирован** (например 1000×1000 или 1000×1778 для 9:16).

```
screenX = virtualX * (viewportWidth / virtualWidth)
exportX = virtualX * (exportWidth / virtualWidth)
```

Хранить в БД только virtual coords — preview на iPhone и export 1080×1920 согласованы.

---

## Dual-Pass Renderer

### Pass 1 — Flow

1. Рендер `flow[]` сверху вниз.
2. Браузер вычисляет высоты блоков.
3. Для каждого flow-блока — `getBoundingClientRect()` → **anchor box**.

### Pass 2 — Satellites

1. Для каждого `object` с `anchor=flow` — позиция = anchor box + local offset.
2. Для `anchor=canvas` — позиция от краёв холста.
3. Сортировка по `zIndex`, отрисовка.

При изменении текста Pass 1 пересчитывает box → Pass 2 автоматически двигает привязанные стикеры.

---

## Gesture Processor (mobile)

| Жест | Действие |
|------|----------|
| Drag | Δx, Δy → обновить virtual coords |
| Pinch | scale |
| Rotate | rotation |
| Snap | если dist(object, flowBox) < threshold → `anchor=flow`, haptic |
| Trash zone | drag Y > 85% viewport → delete object |

Библиотеки: `interact.js` или touch handlers + `pinch-zoom` для Vue 3.

### Z-index UX (без чисел)

| UI label | zIndex policy |
|----------|---------------|
| На задний план | min в группе, < 10 |
| На шаг назад | zIndex - 1 |
| На шаг вперёд | zIndex + 1 |
| На передний план | max в группе |

---

## Draggable text

Текстовые блоки в `objects[]` с `kind=text` поддерживают:

- drag / resize / rotate (как стикеры);
- double-tap → `contenteditable` overlay;
- опционально `role` для Groq mapping.

Текст в `flow[]` — для основного контента (авто-высота).  
Текст в `objects[]` — декоративный / ручной оверлей.

---

## AI Pipeline (связь с Groq)

```
User input
    → Prompt builder (+ available sticker tags, themes, roles)
    → Groq (structured JSON)
    → Sticker matcher (tags → sticker_id)
    → Image matcher (image_tags → url)
    → Template merger (if user_template selected)
    → State tree update
    → Dual-pass render
```

Groq **не вычисляет координаты** для flow-текста — только строки и роли.  
Координаты стикеров — из шаблона или `position_hint` → эвристика UI.

---

## Vue-модули (предлагаемая структура)

```
components/carousel-editor/
  CarouselEditorShell.vue      # mobile shell, tabs, bottom sheets
  CarouselCanvas.vue           # dual-pass container
  CarouselFlowStack.vue        # flow renderer
  CarouselObjectLayer.vue      # absolutes + gestures
  CarouselSlideNavigator.vue   # prev/next, dots
  composables/useCarouselState.ts
  composables/useVirtualCanvas.ts
  composables/useCarouselGestures.ts
```

---

## Критерии готовности

- [ ] JSON schema v2 в TypeScript types
- [ ] Flow pass: 4+ block kinds (text, media)
- [ ] Satellite pass: anchor canvas + anchor flow
- [ ] zIndex UI без ручного ввода
- [ ] Snap + haptic на поддерживаемых устройствах
- [ ] Virtual canvas: preview и PNG export совпадают по компоновке
- [ ] Unit: при росте title flow-anchored badge смещается вниз
