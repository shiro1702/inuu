# Волна 3d — PNG для каруселей и сторис

План: [ACTIVE_TASKS.md](../tracker/ACTIVE_TASKS.md) (TASK-025 → TASK-027).

**После:** волна 3c (TASK-024 push). **Не входит:** WebCodecs / MP4 (волна 3f+).

| Задача | Формат | Матрица |
|--------|--------|---------|
| TASK-025 | Общие HTML-шаблоны + `html-to-image` (база) | §6, §13 |
| TASK-026 | Карусель: `metadata.carousel`, сайт, export SMM | §6 |
| TASK-027 | Сторис: PNG-слайды → `story_slides` при publish | §6 |

Спеки: [35-html-carousel-video-studio.md](../features/content/35-html-carousel-video-studio.md) · [34-groq-editorial-content-multiplier.md](../features/content/34-groq-editorial-content-multiplier.md) · [30-manager-chat-place-editorial.md](../features/content/30-manager-chat-place-editorial.md)

---

## Порядок

```text
TASK-025 (шаблоны + render util)
    ├──► TASK-026 (карусель editorial + export)
    └──► TASK-027 (сторис in-app + manager chat)
```

026 и 027 можно вести параллельно после 025; не смешивать в один чат.

---

## Smoke (~20 мин)

1. **025** — один шаблон Cover/Body/Outro рендерится в PNG 1080×1350 (4:5) и 1080×1920 (9:16) без обрезки текста.
2. **026** — publish статьи с multiplier → `editorial_posts.metadata.carousel` + свайп на `/guides/[slug]`; ZIP или 4 PNG из dashboard/Mini App.
3. **027** — approve в manager chat → `story_campaigns` + `story_slides` с `image_url` на storage; главная показывает круги с превью.
4. Регрессия: текстовый content pack (TASK-015) по-прежнему работает, если рендер не вызван.

---

## Out of wave (3f+)

- Client MP4 (GSAP + WebCodecs) — отдельная задача
- Карусели в TG media group по вайбам — [36](../features/content/36-bot-vibes-editorial-delivery.md), после PNG + 3c push
