# Groq editorial pipeline и content multiplier

**Источник:** брейншторм [03.06.2026](../../../fix/brainstorm/03.06.2026.md) (части 2–3 сессии).

**Связь:** [30-manager-chat-place-editorial.md](./30-manager-chat-place-editorial.md), [14-digests-curated-admin-smm.md](./14-digests-curated-admin-smm.md), [35-html-carousel-video-studio.md](./35-html-carousel-video-studio.md), [36-bot-vibes-editorial-delivery.md](./36-bot-vibes-editorial-delivery.md).

**Задача:** [TASK-015](../../tracker/ACTIVE_TASKS.md).

---

## Цель

Один админ с Telegram-ботом публикует **5+ качественных материалов в день** за 15–20 минут: Groq снимает рутину (рерайт, теги, нарезка), человек жмёт **✅ Опубликовать**.

Расширяет существующий manager chat ([30](./30-manager-chat-place-editorial.md)), не заменяет moderation queue для событий.

---

## Входные каналы (шаг 1)

| Источник | Действие админа |
|----------|-----------------|
| Telegram-пост | Forward в manager chat |
| Веб-страница | Ссылка |
| Полевой репортаж | Голосовое сообщение (Whisper → текст) |
| Фото / видео | Альбом + подпись |

---

## Groq pipeline (шаг 2)

Системный промпт (Llama через Groq):

1. **Рерайт** — tone of voice медиа, без «воды»
2. **Сущности** — название места, адрес, часы, цены
3. **Match Supabase** — venue/org по fuzzy name; если нет → предложить «Создать org»
4. **Теги** — до 5 slug из whitelist [31](./31-content-tags-vibes-taxonomy.md)
5. **Тип** — `news` | `article` | `longread` + `post_type`
6. **Story slides** — 3–4 слайда Hook–Story–Offer
7. **Content pack** — см. multiplier ниже

Reuse: `POST /api/ai/parse-editorial`, enricher из [11](./11-digest-parsing-and-curated-picks.md) для URL.

---

## Превью в Telegram (шаг 3)

Карточка в manager chat:

```
📝 ПРЕДПРОСМОТР
Заголовок: …
Текст: (3 абзаца)
🏷️ [underground] [craft-beer] [new-venue]
📍 Бар «Муха» (venue_id) — адрес OK
📱 Сторис: слайд 1… слайд 3
```

Inline-кнопки:

| Кнопка | Действие |
|--------|----------|
| ✅ Опубликовать на портал | `editorial_posts` + stories + очередь рассылки |
| 📝 Редактировать | Mini App или reply-тред |
| 🎨 Обложка | gen-cover (опционально, P2) |
| 📦 Пак контента | показать 6 форматов |
| 🗑️ В корзину | discard |

---

## Content multiplier: «1 статья = 6 форматов»

По кнопке **📦 Пак контента** Groq генерирует:

| # | Формат | Выход |
|---|--------|-------|
| 1 | **Авто-подборки** | Предложить slug существующих `curated_lists` + создать mini-list |
| 2 | **Reels / Shorts сценарий** | Таймкоды, кадры, voiceover (15–30 с) |
| 3 | **Instagram-карусель** | 4–6 слайдов → [35](./35-html-carousel-video-studio.md) |
| 4 | **Telegram-пост** | Markdown + inline `[Карта]` `[Читать]` |
| 5 | **Квиз / опрос** | Вопрос + 3 варианта из текста |
| 6 | **Push / кликбейт** | ≤40 символов для notification |

Экспорт PNG / MP4 — через [35](./35-html-carousel-video-studio.md), не в MVP multiplier.

---

## Медиа-ассеты

| Проблема | Решение |
|----------|---------|
| Фото из forward TG | Auto-extract attachments → Supabase Storage temp |
| Нет фото | Кнопка gen-cover (DALL-E / Flux) — **P2** |
| Тяжёлые файлы | WebP resize при upload ([32](./32-stable-cover-media-pipeline.md)) |
| Доп. медиа позже | Админ досылает фото в тред → привязка к `body_json` / slide index |

Парсинг медиа из URL — reuse web fetch + cheerio og:image.

---

## Публикация (шаг 4)

При **✅ Опубликовать**:

1. Insert / update `editorial_posts` (`body_json`, tags, links)
2. Create / link `story_campaigns` (анонс)
3. Enqueue vibe-segment delivery ([36](./36-bot-vibes-editorial-delivery.md)) — если `topic_tags` match
4. Optional: add items to `curated_lists` из п.1 multiplier
5. Notify moderation chat если `status=pending` (как в 30)

---

## Story script prompt (Hook–Story–Offer)

```
На основе статьи напиши 3 слайда для stories:
1 — кликбейт-вопрос
2 — шокирующий факт
3 — CTA «Читать обзор»
```

Выход → JSON slides для [35](./35-html-carousel-video-studio.md) или inline preview в боте.

---

## Критерии готовности (TASK-015)

- [ ] Forward / URL / voice в manager chat → Groq preview card
- [ ] Match venue + предложение создать org (reuse 30)
- [ ] Теги только из whitelist 31
- [ ] Кнопка «Пак контента» — 6 текстовых блоков в TG
- [ ] Publish → `editorial_posts` + story анонс
- [ ] Авто-предложение curated_list slug (read-only suggest, без auto-insert в MVP)

**Out of scope TASK-015:** PNG render ([35](./35-html-carousel-video-studio.md)), video ([35](./35-html-carousel-video-studio.md)), gen-cover AI, vibe mass-delivery ([36](./36-bot-vibes-editorial-delivery.md)).

---

## Зависимости

- **TASK-013** — seed тегов для Groq whitelist
- **TASK-014** — публичный editorial API принимает published posts
- **TASK-011** [x] — manager chat, parse-editorial, org binding
