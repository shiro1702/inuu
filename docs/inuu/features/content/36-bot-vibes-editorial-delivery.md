# Доставка editorial по вайбам в Telegram

**Источник:** брейншторм [03.06.2026](../../../fix/brainstorm/03.06.2026.md) (персональные карусели, онбординг, opt-out).

**Связь:** [06-bot-digest-subscriptions.md](./06-bot-digest-subscriptions.md), [12-afisha-tag-subscriptions.md](./12-afisha-tag-subscriptions.md), [34-groq-editorial-content-multiplier.md](./34-groq-editorial-content-multiplier.md), [33-editorial-articles-longreads-retention.md](./33-editorial-articles-longreads-retention.md).

**Статус:** спека · после TASK-013 (whitelist) + TASK-015 (publish trigger).

---

## Идея

Вместо массового спама — **точечная доставка** пользователям с opt-in на вайб (`interest_tags` / `city_subscriptions`).

При publish `editorial_posts` с `topic_tags` containing `[wine]`:

1. Найти пользователей с подпиской на tag `wine`
2. Отправить **media group** (3–5 фото) + Groq-текст под вайб
3. Inline: `[ 📍 Карта ]` `[ 🔖 Читать ]` `[ ❌ Меньше такого ]`

Open rate ожидается высокий — контент self-selected.

---

## Формат сообщения

```
Привет! Нашли спот под бокал красного 🍷
Бар «Слеза» — винил, приглушённый свет…

• date • aesthetic • premium

[ 📍 Карта ] [ 🔖 Читать обзор ] [ ⚙️ Подписки ]
[ ❌ Меньше такого ]
```

Media group: обложка + 2–4 кадра из `body_json` / carousel ([35](./35-html-carousel-video-studio.md)).

Текст — Groq variant с tone под primary vibe (reuse multiplier prompt).

---

## Cold start / онбординг

Новый пользователь без `interest_tags`:

1. Quick quiz в `/start` или первом открытии Mini App: «Стиль выходных?» — 3 тапа, 5–7 вайбов
2. Пока теги пусты — показывать **«Глобальный топ»** (popular by views + saves)

Reuse UI из [12](./12-afisha-tag-subscriptions.md) `/subscriptions`.

---

## «Меньше такого»

| Действие | Эффект |
|----------|--------|
| Tap «Меньше такого» | Снизить weight tag(s) поста для user (не отписывать от всего вайба) |
| «Настроить подписку» | Deep link `/subscriptions` |

Хранение: `user_tag_feedback (user_id, tag_slug, delta)` или JSONB в `user_city_preferences`.

---

## Спонсорский контент

- `editorial_posts.is_sponsored = true` → плашка «Промо» на сайте
- Рассылка по вайбу — **платная услуга B2B** ([07](./07-paid-news-publication.md)): «5000 users с tag grill»
- Лимиты маркетинговых push — [06](./06-bot-digest-subscriptions.md)

---

## Триггер

On publish (after TASK-015):

```
editorial_posts INSERT/UPDATE is_published=true
  → edge function / queue
  → segment by topic_tags ∩ user interest_tags
  → rate limit per user (max N editorial/week)
  → sendMediaGroup + inline keyboard
```

Не дублировать mass `news` topic — vibe match строже.

---

## Read later reminders

См. [33](./33-editorial-articles-longreads-retention.md):

- Cron пятница: aggregate `user_saved_editorial` → digest message
- Hot news: single ping 24h (отдельный job, low priority queue)

Notification types: `READ_LATER_WEEKEND`, `READ_LATER_HOT`.

---

## Критерии готовности (backlog)

- [ ] Segment query: users by tag intersection
- [ ] sendMediaGroup + carousel assets
- [ ] Groq персонализированный intro (1 абзац)
- [ ] Callback `inuu:less-like:` + weight decay
- [ ] Rate limits editorial push per user/week
- [ ] `is_sponsored` label in message template

**Depends on:** TASK-013, TASK-014 (save API), TASK-015 (publish hook).
