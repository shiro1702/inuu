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

## Матрица вайб → тема (реализовано)

**Канон:** `utils/carouselVibeTheme.ts` · поле слайда `gradient` · UI-селект в `CarouselStudio`.

| Ключ `gradient` | Алиасы тегов | Tailwind gradient | Акцент border |
|-----------------|--------------|-------------------|---------------|
| `party` | party, active | `from-violet-600 via-fuchsia-600 to-indigo-900` | fuchsia |
| `nightlife` | nightlife, night, late-night, loud, drive | = romance (rose/purple) | rose |
| `romance` | romance, date, wine | `from-rose-950 via-purple-900 to-slate-950` | rose |
| `underground` | underground, speakeasy, techno | `from-zinc-950 via-stone-900 to-black` | cyan glow |
| `vegan` | vegan, eco | `from-emerald-950 via-green-900 to-stone-950` | emerald |
| `tourism` | tourism, chill, zen | = vegan gradient | emerald |

`resolveCarouselGradientFromTags(topic_tags)` — для сборки из событий/подборок.  
Default fallback: `party`.

Шаблоны с **собственной палитрой** (не только vibe): `stockholm-calm`, `kyoto-tea`, `parisian-atelier`, `editorial-bold`, `event-digest` — фон зашит в компонентах; vibe gradient используется как fallback без фото.

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

## Библиотека шаблонов (реализовано в коде)

**Канон:** `utils/carouselTemplates.ts` · `types/editorialCarousel.ts` · `CarouselSlideRenderer.vue`.

Каждый шаблон — **тройка** Vue-компонентов `Cover` / `Body` / `Outro` + `chromeVariant` (`dark` | `light`) для шапки/футера (`CarouselSlideChrome`).

| ID | UI label | Chrome | Визуальный характер | Шрифты / палитра (Tailwind) |
|----|----------|--------|---------------------|------------------------------|
| `minimal-ios` | Minimal iOS | dark | Фото на весь экран + градиент-оверлей, крупный заголовок внизу | `font-bold`, vibe gradient; default template |
| `photo-card` | Фото-карточка | dark | Full-bleed фото, заголовок в нижней зоне | sans, белый текст на градиенте |
| `editorial-bold` | Редакционный | light | Светлый фон `#f4efe6`, фото в рамке, serif-заголовок | `font-serif`, stone-900 |
| `city-poster` | Городская афиша | dark | Белая рамка 10px, бейдж «Афиша», uppercase black | `font-black uppercase`, poster frame |
| `stockholm-calm` | Stockholm Calm | light | Овсяный фон `#F4F0EA`, фото в rounded card, «Issue» mono | `font-sans` + `font-light`, сканди-минимализм |
| `kyoto-tea` | Kyoto Tea | light | Wabi-sabi: `#FAF9F6`, serif, grayscale фото, тонкая линия | `font-serif` + `font-mono` labels |
| `parisian-atelier` | Parisian Atelier | light | Крем `#FFFDF9`, паспарту-border, «l'art de vivre» | `font-serif`, журнальный шик |
| `event-digest` | Дайджест афиши | dark | Stories-стиль: чёрная плашка, фиолетовый бейдж даты `#8A63D2`, оранжевый pin | uppercase black, `@city` handle |

Vue: `CarouselSlideRenderer` выбирает компонент по `slide.role` + `templateId`.

**Не реализовано** (были в ранней спеке 03.06): `editorial-gloss`, `acid-brutal`, `split-media` — заменены расширенным набором выше.

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

## Статус реализации (аудит кода, 10.06.2026)

| Область | Статус | Где в репо |
|---------|--------|------------|
| 8 шаблонов × Cover/Body/Outro | ✅ | `components/editorial/carousel/templates/*` |
| Vibe gradients (6 ключей) | ✅ | `utils/carouselVibeTheme.ts` |
| Aspects 4:5 + 9:16 | ✅ | `types/editorialCarousel.ts`, `CAROUSEL_EXPORT_SIZES` |
| PNG export (`html-to-image`) | ✅ | `utils/renderSlideToPng.ts` |
| Live carousel на сайте | ✅ | `EditorialCarousel.vue` → `/guides/[slug]` |
| Dashboard Carousel Studio | ✅ | `/dashboard/carousel-studio`, `CarouselStudio.vue` |
| Сборка из событий / подборок | ✅ | `buildCarouselFromEvents.ts`, `CarouselEventPicker.vue` |
| Парсер Groq `instagram_carousel` | ✅ | `parseInstagramCarousel.ts` |
| Сохранение `metadata.carousel` | ✅ | migration `051`, API `carousel.put` |
| QR на outro | ✅ | `carouselQrCode.ts`, `CarouselOutroQr.vue` |
| Stories safe zone 9:16 | ✅ | `utils/carouselSafeZone.ts` |
| Story Studio PNG (reuse templates) | ✅ | `/dashboard/story-studio` |
| Watermark / brand chrome | ✅ | `CarouselSlideChrome`, `carouselBrandLogo.ts` |
| Groq one-click raw text → JSON | ❌ | волна 4b |
| Share link `generated_carousels` | ❌ | волна 4a |
| Mobile IG editor UX | ❌ | волна 4a (сейчас desktop split) |
| Стикеры / draggable text | ❌ | волна 4c |
| TG send media group | ❌ | волна 4d |
| Client MP4 (WebCodecs) | ❌ | backlog 3f |

## Критерии готовности (backlog)

- [x] 8 Vue-шаблонов Cover/Body/Outro
- [x] Vibe → gradient mapping
- [x] Live carousel на `/guides/[slug]`
- [x] Client PNG export (dashboard Carousel Studio)
- [ ] Client MP4 1080×1920 (VideoStudio)
- [x] Brand chrome / watermark на слайдах

---

## Связанные документы

- [19-organizer-lk-monetization.md](./19-organizer-lk-monetization.md) — шаблонные афиши (отдельный продукт B2B)
- [28-omnichannel-share-and-tma-funnel.md](./28-omnichannel-share-and-tma-funnel.md) — share flow
