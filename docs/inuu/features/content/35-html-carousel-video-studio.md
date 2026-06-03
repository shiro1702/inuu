# HTML carousel studio и client-side video

**Источник:** брейншторм [03.06.2026](../../../fix/brainstorm/03.06.2026.md) (HTML/CSS рендер, шаблоны, видео на клиенте).

**Связь:** [14-digests-curated-admin-smm.md](./14-digests-curated-admin-smm.md), [34-groq-editorial-content-multiplier.md](./34-groq-editorial-content-multiplier.md), [31-content-tags-vibes-taxonomy.md](./31-content-tags-vibes-taxonomy.md).

**Статус:** спека · **не в активных задачах** (после TASK-014/015).

---

## Принцип

Один HTML/CSS (Tailwind) шаблон:

- **На сайте** — живая интерактивная карусель (свайп, кликабельные CTA)
- **Для экспорта** — PNG через `html-to-image` (браузер) или satori (serverless, только для бота если нужно)
- **Для видео** — та же вёрстка + GSAP → **client-side** WebCodecs → MP4

Дублирование дизайна; без Canva/Figma в рутине.

---

## Матрица вайб → тема

| Vibe (пример) | Tailwind gradient | Шрифт | Декор |
|---------------|-------------------|-------|-------|
| romance / wine | `from-rose-950 via-purple-900 to-slate-950` | serif | glow, тонкая рамка |
| underground / techno | `from-zinc-950 via-stone-900 to-black` | mono | неон border, noise |
| vegan / eco | `from-emerald-950 via-green-900 to-stone-950` | sans | скругления, иконки |
| party | `from-violet-600 via-fuchsia-600 to-indigo-900` | display black | glitch |

Хранить в `city_content_tags.metadata.theme` или отдельный JSON seed.

---

## Анатомия карусели

```
[ Cover / Hook ] → [ Body × N ] → [ Outro / CTA ]
```

| Слайд | Цель | Элементы |
|-------|------|----------|
| **Cover** | Stop scroll | 3–5 слов заголовок, фото/градиент, watermark |
| **Body** | Суть | Тезисы; split layout (фото + текст) |
| **Outro** | Конверсия | QR, промокод, «Сохрани», deep link |

Groq из [34](./34-groq-editorial-content-multiplier.md) разбивает текст по ролям.

---

## Библиотека шаблонов

| ID | Название | Стиль |
|----|----------|-------|
| `editorial-gloss` | Глянец | Serif, пастель, рамки |
| `acid-brutal` | Кислотный брутализм | Mono, неон, шум |
| `minimal-ios` | Минимал | Glassmorphism, Inter |
| `split-media` | Сплит | 50/50 фото + текст |

Vue: `<CarouselSlide :template="id" :slide="data" />` — dynamic component.

---

## Watermark

| Вариант | Позиция (зависит от template) |
|---------|--------------------------------|
| `@brand / city` | top-left |
| App icon + username | top (minimal-ios) |
| Partner co-brand | `is_sponsored` — рядом с брендом |

---

## Хранение в БД

```json
{
  "carousel": {
    "template_id": "editorial-gloss",
    "aspect": "4:5",
    "slides": [
      { "role": "cover", "title": "…", "media_url": "…", "gradient": "romance" },
      { "role": "body", "bullets": ["…"], "media_url": "…" },
      { "role": "outro", "cta_text": "Читать в приложении", "qr_url": "…" }
    ]
  }
}
```

Поле: `editorial_posts.metadata.carousel` или `story_campaigns.slide_json`.

---

## Рендеринг

### Сайт (интерактив)

- Комponent `EditorialCarousel.vue` — свайп, micro-CSS animations
- Кнопка **«Поделиться»** → `html-to-image` в браузере → download PNG (viral UGC)

### Экспорт для SMM (admin)

| Среда | Стек |
|-------|------|
| Mini App (preferred) | `html-to-image` client-side |
| Bot preview | satori + `@resvg/resvg-js` (лёгкий PNG без Puppeteer) |

**Не используем** server Puppeteer для video — решение 03.06: сервер занят другими задачами.

### Video (client-only)

```
GSAP timeline → html-to-image per frame → WebCodecs VideoEncoder → mp4-muxer
```

Библиотеки: `gsap`, `html-to-image`, `mp4-muxer` (+ WebCodecs API).

Комponent: `VideoStudio.vue` — preview 1080×1920, кнопка «Собрать Reels».

**Нюансы:**

- CORS: `crossorigin="anonymous"` + Supabase Storage CORS `*`
- Шрифты: preload / `document.fonts.ready` до рендера
- Аудио: AudioContext + muxer audio track (опционально, vibe-matched loops)

Структура ролика 10–15 с: Hook 0–3 с → cuts 3–12 с → CTA 12–15 с.

---

## UI: Bot vs Mini App

| Режим | Когда |
|-------|-------|
| **Bot express** | Inline «Шаблон: Глянец / Брутал / …» → re-render preview message |
| **Mini App editor** | Crop фото, правка текста на слайде, export ZIP |

Кнопка в manager chat после Groq preview: `[ 🛠 Открыть в редакторе ]`.

---

## Критерии готовности (backlog)

- [ ] 4 Vue-шаблона Cover/Body/Outro
- [ ] Vibe → CSS vars mapping
- [ ] Live carousel на `/guides/[slug]`
- [ ] Client PNG export (admin Mini App)
- [ ] Client MP4 1080×1920 (VideoStudio)
- [ ] Watermark по template rules

---

## Связанные документы

- [19-organizer-lk-monetization.md](./19-organizer-lk-monetization.md) — шаблонные афиши (отдельный продукт B2B)
- [28-omnichannel-share-and-tma-funnel.md](./28-omnichannel-share-and-tma-funnel.md) — share flow
