# Карусели INUU — документация

Практическая документация по продукту **HTML-каруселей**: от SMM-редактора до API и схемы данных.

## Два режима работы

| Режим | URL | Для кого |
|-------|-----|----------|
| **Carousel Studio** | `/dashboard/carousel-studio` | Быстрая сборка из событий / статей / ручного ввода, экспорт PNG |
| **Carousel Editor** | `/dashboard/carousel/edit/[id]` | Полноценный mobile-first редактор: share link, ИИ, стикеры, шаблоны, TG |

**Тестовый стенд:** [inuu-topaz.vercel.app/dashboard/carousel-studio](https://inuu-topaz.vercel.app/dashboard/carousel-studio) · **прод:** [inuu.ru/dashboard/carousel-studio](https://inuu.ru/dashboard/carousel-studio)

Оба используют одни и те же **шаблоны** (`CarouselSlideRenderer`) и **экспорт PNG** (`html-to-image`).

## Документы

| Файл | Аудитория | Содержание |
|------|-----------|------------|
| [01-overview.md](./01-overview.md) | PM, редакция, разработка | Продукт, волны, что сделано |
| [02-user-guide.md](./02-user-guide.md) | SMM, менеджеры контента | Как собрать карусель, ИИ, стикеры, экспорт |
| [03-developer-guide.md](./03-developer-guide.md) | Разработчики | Роуты, компоненты, store, API, миграции |
| [04-ai-and-groq.md](./04-ai-and-groq.md) | Разработчики, промпт-инженеры | Groq-пайплайны: карусель целиком и один слайд |
| [05-data-model.md](./05-data-model.md) | Разработчики | JSON слайдов v1/v2, БД, virtual canvas |

## Спеки (детальный дизайн)

| Файл | Тема |
|------|------|
| [35-html-carousel-video-studio.md](../35-html-carousel-video-studio.md) | Шаблоны, vibe-градиенты, PNG MVP (волна 3d) |
| [38-carousel-editor-saas.md](../38-carousel-editor-saas.md) | Mobile UX, Groq, share, project types |
| [39-carousel-canvas-architecture.md](../39-carousel-canvas-architecture.md) | Flow + absolute, якоря, virtual canvas |
| [40-carousel-assets-and-stickers.md](../40-carousel-assets-and-stickers.md) | Стикеры, пресеты фонов, шрифты |

## Runbook

- [WAVE_4A_CAROUSEL_EDITOR.md](../../../runbooks/WAVE_4A_CAROUSEL_EDITOR.md) — волны 4a–4d, smoke-тесты

## Быстрые ссылки в коде

| Что | Путь |
|-----|------|
| Типы слайдов | `types/editorialCarousel.ts` |
| Pinia store редактора | `stores/carouselEditor.ts` |
| Shell редактора | `components/carousel-editor/CarouselEditorShell.vue` |
| Рендер слайда | `components/editorial/carousel/CarouselSlideRenderer.vue` |
| Groq: карусель | `server/api/ai/carousel/generate.post.ts` |
| Groq: один слайд | `server/api/ai/carousel/generate-slide.post.ts` |
| PNG export | `utils/renderSlideToPng.ts` |
