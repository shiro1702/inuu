# Роадмап и развилки (проверка гипотез)

Lean-подход: короткие спринты, измеримые метрики, **pivot** при провале гипотезы.

**Стек:** Nuxt 3 + Nitro + Supabase + Telegram/MAX Mini App + **Groq**. См. [11-tech-stack.md](./11-tech-stack.md).

**Метрики MVP (31.05):** CAC, CR афиша→оплата, брошенные корзины на ЮKassa, claim rate теневых org — [24-mvp-launch-checklist-ulan-ude.md](./features/content/24-mvp-launch-checklist-ulan-ude.md).

---

## Этап 0: Фундамент (1–2 недели)

### Делаем

- Деплой (Vercel / VPS), SSL, домен.
- Миграции Supabase: `cities`, базовые `venues`, `events`, `categories`.
- Nuxt: `pages/[city_slug]/`, middleware редиректа `/` → `/ulan-ude`.
- Seed: Улан-Удэ (`ulan-ude`).
- `runtimeConfig.public.defaultCitySlug`.

### Критерий готовности

- Витрина города открывается на мобильном; данные читаются из Supabase с RLS.

---

## Этап 1: MVP «Умная афиша» (2 недели)

### Делаем

- `pages/[city_slug]/index.vue` — сетка событий и мест (паттерн текущей главной агрегатора).
- `GET /api/cities/[slug]/events` (или composable + Supabase client с RLS).
- Страницы `events/[slug]`, `venues/[slug]`; CTA WhatsApp / «Хочу пойти».
- Подборки: таблица `curated_lists` + статичные seed или dashboard редакции.
- 50–100 карточек контента (seed / импорт, тексты — редакция).

### Гипотеза 1

**Люди готовы уходить из Instagram на сайт ради поиска и фильтров.**

| Метрика | Порог успеха |
|---------|--------------|
| Время на сайте | > 40 с |
| Глубина | > 3 страниц / сессия |
| Клики CTA | > 5% от визитов |

### Развилка 1 (через 2 недели)

| Результат | Действие |
|-----------|----------|
| ✅ Трафик и клики есть | → Этап 2 |
| ❌ Заходят и уходят | **Pivot A:** лендинг «Подборка на выходные» |
| ❌ Не переходят из Instagram | **Pivot B:** Telegram/MAX Web App (`useTelegram`, тот же Nuxt URL) |

---

## Этап 2: Социализация (2–3 недели)

### Делаем

- **Telegram Login** + привязка `profiles` (уже в репо).
- Таблица `user_favorites` + API `GET/POST /api/client/favorites`.
- **Stories** — модуль `dashboard/stories` + блок на главной.
- Telegram-канал → deep links на `/{city_slug}/events/{slug}`.
- Отзывы — расширение [REVIEWS_MODULE](../features/REVIEWS_MODULE_ROLLOUT_RU.md) под `booking_id`.

### Гипотеза 2

**Пользователи регистрируются ради «сохранить» и «напомнить».**

| Метрика | Порог |
|---------|-------|
| Регистрация | ≥ 10% визитов |
| Повторный визит за 7 дней | ≥ 15% |

### Развилка 2

| Результат | Действие |
|-----------|----------|
| ✅ Регистрируются | → Этап 3 |
| ❌ Боятся регистрации | **Pivot:** подписка в боте на `event_id` без ЛК (`city_subscriptions`) |

---

## Этап 3: Монетизация — Beauty + деньги (3–4 недели)

### Делаем

- `booking.post.ts` (форк логики `order.post.ts`) + ЮKassa webhook.
- ЛК клиента: `pages/profile` / `/{city_slug}/bookings`.
- Dashboard партнёра: слоты, заявки (`dashboard/...`).
- `waitlist_entries` + уведомления через `dispatchNotificationEvent`.
- `hot_slots` + таймер на Vue (composable).
- Платные `is_promoted` в выдаче.

### Гипотеза 3

**Мастера заполняют окна; клиенты покупают срочные слоты.**

| Метрика | Порог |
|---------|-------|
| Записей через сайт | ≥ 5–10 / день |
| Мастеров с горящим окном / нед | ≥ 10 |

### Развилка 3

| Результат | Действие |
|-----------|----------|
| ✅ Спрос есть | Подписка B2B через `shop_feature_subscriptions` |
| ❌ Мастера не постят | Редакция + TG-бот `/slot` |
| ❌ Нет доверия к оплате | CTA → WhatsApp (deep link) |

---

## Этап 4: Туризм и Байкал (3–4 недели, к маю–июню)

### Делаем

- `tourism_listings` + карточки на Nuxt.
- `POST /api/tourism/leads` → Telegram-канал партнёров (`dispatchNotificationEvent`).
- Без календаря занятости на MVP.

### Гипотеза 4 — развилки

См. [verticals/tourism-baikal.md](./verticals/tourism-baikal.md).

---

## Этап 5: Marketplace-слой (1–2 месяца)

- Кондитеры — [HOME_CONFECTIONERS_ORDER_FLOW_PLAN_RU.md](../features/HOME_CONFECTIONERS_ORDER_FLOW_PLAN_RU.md).
- Локальные бренды, кросс-промо, рекламный кабинет.

---

## Этап 6+: Масштаб

- Подписки и дайджесты в TG/MAX (`city_subscriptions`, pg_cron).
- Второй город в `cities`.
- PWA push (опционально).

---

## Сезонность (Улан-Удэ)

| Сезон | Фокус |
|-------|--------|
| Зима–весна | События, beauty |
| Май–сентябрь | Турбазы, тендер |
| Круглый год | Stories, боты, реклама |

---

## Чеклист запуска

- [ ] Supabase prod + миграции INUU
- [ ] Nuxt на Vercel/VPS, `defaultCitySlug`
- [ ] 50+ events/venues в БД
- [ ] Webhook Telegram + MAX
- [ ] Instagram + TG-канал
- [ ] `pages/[city_slug]/legal/*`
- [ ] Тест оплаты (sandbox ЮKassa)
- [ ] Первые 10 bookings/заявок
