# NLP-агент: менеджер и организатор (Tool Calling)

**Источник:** брейншторм [01.06.2026](../../../fix/brainstorm/01.06.2026.md) (01.06 08:44 – 09:00+).

**База:** [23-bot-roles-ops-support.md](./23-bot-roles-ops-support.md), [19-organizer-lk-monetization.md](./19-organizer-lk-monetization.md), [22-ai-bot-concierge-and-intent.md](./22-ai-bot-concierge-and-intent.md).

**Статус:** спека; No-UI CMS через чат.

---

## Архитектура

```
Сообщение TG/MAX → Nitro endpoint
  → resolve user → role (admin | organizer | user)
  → system prompt + tools[] по роли
  → Groq tool calling
  → execute tools → preview → confirm inline
```

**Правило UX:** сначала превью + `[✅ Применить]` / `[❌ Отмена]`, потом запись в БД.

---

## Tools: менеджер / admin

### Поиск

| Tool | Пример фразы |
|------|----------------|
| `search_events(query, date_range?)` | «Стендап на выходных» |
| `get_unmoderated_events(limit)` | «Покажи свежие спарсенные» |

### Редактирование

| Tool | Пример |
|------|--------|
| `update_event_field(event_id, field, value)` | «Цена 1500», «Начало в 20:00» |
| `regenerate_event_description(event_id, instructions?)` | «Перепиши дерзче» |
| `generate_html_promo_image(event_id, format)` | story / post — [14](./14-digests-curated-admin-smm.md) |

### Публикация и маркетинг

| Tool | Пример |
|------|--------|
| `set_event_status(event_id, published\|draft\|rejected)` | «Публикуй» / «В мусор» |
| `toggle_featured(event_id, boolean)` | «Сделай главным на неделю» |
| `create_collection(title, event_ids[])` | Подборка «С детьми» |
| `publish_to_channels(event_id, platforms[])` | TG, MAX, Insta (ручной export для Insta) |

### Система

| Tool | Пример |
|------|--------|
| `assign_organizer(event_id, organizer_id)` | B2B привязка |
| `get_event_stats(event_id)` | Клики, share, просмотры |

---

## Tools: организатор (B2B)

Только **свои** `shop_id` / события (RLS + проверка в handler).

| Tool | Пример |
|------|--------|
| `create_draft_event(details)` | Голос/текст афиши → черновик → «Отправить на модерацию?» |
| `update_my_event(event_id, updates)` | «Диджей заболел, замени на Петю» |
| `get_my_stats(period)` | «Клики за неделю» |
| `request_promotion(event_id, package)` | Топ / featured → оплата [19](./19-organizer-lk-monetization.md) |

---

## role: `user` (B2C)

Не admin-tools — intent + поиск событий ([22](./22-ai-bot-concierge-and-intent.md)): «Куда сходить сегодня бесплатно».

---

## Fallback (нет подходящего tool)

System prompt:

1. Не галлюцинировать действие.
2. Сказать, что функция недоступна.
3. Предложить ближайшую альтернативу из tools.
4. Предложить `/help`.

**Пример:** «Напишите в Ариг Ус» → «Не умею в СМИ; могу: выложить в каналы / сделать featured / сгенерировать картинку».

---

## `/help` и онбординг

| Формат | Когда |
|--------|-------|
| Inline-кнопки | `/help`, «Меню» — частые действия по роли |
| LLM-список | «Что ты умеешь?» — текст под роль |

Кнопки для орга: Создать событие | Статистика | Купить рекламу | Полный список.

---

## Связь с другими векторами (из брейншторма)

| Вектор | Документ |
|--------|----------|
| AI-консьерж, маршрут на вечер | [13](./13-ai-content-horizon.md), [22](./22-ai-bot-concierge-and-intent.md) |
| «Я пойду», геймификация | [20](./20-bot-engagement-backlog.md) |
| Programmatic SEO | [03-core-platform.md](../../03-core-platform.md), [21](./21-mini-app-and-web-wireframes.md) |

---

## Реализация (чеклист)

- [ ] JSON Schema tools для Groq / OpenAI-compatible API
- [ ] `server/api/bot/agent.post.ts` — единая точка + RBAC
- [ ] Audit log: кто какой tool вызвал
- [ ] Preview URLs в Mini App (`?preview=1&token=…`)
