# INUU — городской лайфстайл-агрегатор (Nuxt 3)

**INUU** — гиперлокальный агрегатор города: афиша, места, запись к мастерам, туризм, редакция. Первый город: **Улан-Удэ**.

Монорепозиторий **incity-new**: **Nuxt 3 + Supabase + Telegram/MAX Mini App**.

## Документация

**Канон продукта:** [docs/inuu/README.md](docs/inuu/README.md)

**Карта `docs/`:** [docs/README.md](docs/README.md)

## Стек

- **Nuxt 3 / Vue 3**, Pinia, Tailwind
- **Supabase** (PostgreSQL, RLS, Storage)
- **Nitro** (`server/api`) — API, webhooks, платежи
- **Telegram / MAX** — боты, Mini App, уведомления

## Быстрый старт (локально)

### Требования

- Node.js 18+
- Supabase (локально или cloud)

### Установка

```bash
npm install
cp .env.example .env
# заполнить NUXT_PUBLIC_SUPABASE_* и токены ботов
npm run dev
```

Переменные: см. `.env.example`, [docs/inuu/11-tech-stack.md](docs/inuu/11-tech-stack.md).

## Репозиторий

- Продуктовая спека и план вычистки legacy: `docs/inuu/`
- Ops (деплой, relay): `docs/runbooks/` — домены обновить под INUU при смене инфраструктуры
- Материалы эпохи PocketMenu (рестораны, QR-меню): `docs/archive/` — не канон
