# Telegram-бот: роли B2C / B2B / admin

**Источник:** брейншторм [31.05.2026](../../../fix/brainstorm/31.05.2026.md) (31.05 07:41).

**Бот:** один `@inuu_bot`; поведение по `role` в БД ([02-roles-and-access.md](../../02-roles-and-access.md)).

**Статус:** спека; пересекается с [04-telegram-bot-content-moderation.md](./04-telegram-bot-content-moderation.md), [18-ticketing-full-flow.md](./18-ticketing-full-flow.md).

---

## Разделение: чат vs Mini App

| Слой | Назначение |
|------|------------|
| **Mini App** | Витрина, корзина, «Мои билеты», сканнер (камера) |
| **Чат бота** | Уведомления, NL-поиск, поддержка, admin ops |

---

## role: `user` (B2C)

### Главное меню `/start`

- Текст: «Найду лучшие события в городе…»
- **[ 🚀 Открыть афишу ]** → Mini App
- **[ 🎲 Случайные выходные ]** → [22](./22-ai-bot-concierge-and-intent.md)
- **[ Добавить в чат с друзьями ]**

### ИИ-поиск текстом / голосом

См. [22-ai-bot-concierge-and-intent.md](./22-ai-bot-concierge-and-intent.md).

### Транзакционные сообщения

| Событие | Сообщение |
|---------|-----------|
| Оплата OK | «🎉 Билеты куплены!» + PDF/картинка с QR |
| −24 ч | Напоминание о событии |
| −2 ч | «Скоро начнётся» + кнопка QR |

### Поддержка

- `/support` или кнопка **«Проблема с билетом?»** на билете.
- Сообщение → admin chat; reply админа → доставка юзеру ([Helpdesk](#helpdesk-в-telegram)).

---

## role: `organizer` (B2B)

Дополнительно к меню user:

| Функция | Реализация |
|---------|------------|
| **📷 Сканировать билеты** | Mini App + камера → 🟢/🔴/🟡 в чат ([18](./18-ticketing-full-flow.md)) |
| Пуш продаж | «+1 билет, N ₽, всего 45/100» (опционально MVP) |
| Claim профиля | «Кто-то запрашивает доступ к … Подтвердить?» |

---

## role: `admin` / manager

Уведомления в **moderation chat** города (`cities.editorial_moderation_chat_id`).

| Функция | UI в TG |
|---------|---------|
| **Tinder парсинга** | Карточка события + [✅ Опубликовать] [❌ Удалить] — см. [04](./04-telegram-bot-content-moderation.md), [08](./08-event-sourcing-and-moderation-pipeline.md) |
| **Теневые профили** | «ИИ создал профиль X. Одобрить?» |
| **Helpdesk** | Forward от user → reply админа → bot → user |
| **Алерты** | Cron down, ЮKassa 500, storage quota |

---

## Helpdesk в Telegram

Без тикет-системы на MVP:

1. User пишет в `@inuu_bot`.
2. Nitro пересылает в admin chat с `telegram_id` / `user_id`.
3. Admin **Reply** на forward.
4. Webhook ловит reply → `sendMessage` юзеру от имени платформы.

**Возвраты MVP:** кнопка «Вернуть билет» → заявка в admin chat → ручной refund в ЮKassa ([18](./18-ticketing-full-flow.md)).

---

## MVP must-have в боте

| # | Фича | Приоритет |
|---|------|-----------|
| 1 | QR после покупки в чат | P0 |
| 2 | Сканнер для organizer | P0 |
| 3 | Support forward + reply | P0 |
| 4 | NL-поиск (ограниченный) | P1 |
| 5 | Напоминания −24/−2 ч | P1 |
| 6 | Группы + poll | P2 |
| 7 | Пуш продаж org | P3 |

---

## Реализация в коде

- Роутинг ролей в `server/api/webhook.post.ts` после resolve `profiles`.
- B2C handlers: `server/utils/inuuContentBot.ts` (расширить).
- Support: новый `server/utils/inuuBotSupport.ts` (forward + reply map в Redis/DB).
- Scanner Mini App: отдельный route `pages/miniapp/scanner.vue` или WebApp deep link.
