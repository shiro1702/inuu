# Telegram userbot → INUU ingest

Python-воркер (Telethon), который читает whitelisted Telegram-каналы и отправляет посты в `POST /api/ingest/content/submit`.

**Спека:** [docs/inuu/features/content/10-telegram-sources-without-bot-access.md](../../docs/inuu/features/content/10-telegram-sources-without-bot-access.md)

## Зачем

Обычный бот не может читать чужие каналы без прав админа. Userbot работает под обычным Telegram-аккаунтом, подписанным на каналы организаторов, и автоматически подаёт анонсы в существующий AI-пipeline INUU — без ручной пересылки в parser chat.

## Два режима работы

| Режим | Команда | Что делает |
|-------|---------|------------|
| **Realtime** | `python main.py` | Слушает **новые** и **отредактированные** посты в активных каналах |
| **Backfill** | `python main.py --backfill` | Обходит **уже опубликованные** посты в канале — в т.ч. афишу будущих событий, которые вышли до запуска воркера |

### Realtime (по умолчанию)

После подключения к каналу воркер **не прогоняет всю историю** — ставит `last_seen_message_id` на последний пост и дальше реагирует только на новые публикации. Так не тратятся токены Groq на старые посты.

### Backfill (первичное наполнение)

Когда канал только подключили, в ленте уже могут лежать анонсы **предстоящих** событий (концерт через две недели, спектакль в субботу и т.д.). Режим backfill:

1. Читает последние N постов канала (по умолчанию 50).
2. Отправляет каждый в ingest → Groq извлекает даты и названия.
3. Идемпотентность по `sourceExternalId` не создаёт дубли, если пост уже был в очереди.
4. Прошедшие события Groq тоже может распознать — менеджер отклонит или статус будет `needs_revision`.

```bash
# все активные каналы, по 50 последних постов
python main.py --backfill

# один канал, 100 постов
python main.py --backfill --backfill-source in.ulanude --backfill-limit 100
```

**Когда запускать backfill:** один раз при подключении нового источника или после долгого простоя воркера. В обычной работе достаточно realtime.

## Архитектура

```
city_telegram_sources (Supabase)
        ↓
Telethon userbot (этот воркер)
        ↓
POST /api/ingest/content/submit (Nuxt)
        ↓
Groq → content_submissions → чат модерации
```

Воркер живёт **вне** Nuxt-приложения (`workers/telegram-userbot/`). Не запускается через `npm run dev`.

## Подготовка

1. Применить миграцию [`supabase/migrations/035_city_telegram_sources.sql`](../../supabase/migrations/035_city_telegram_sources.sql)
2. [my.telegram.org](https://my.telegram.org) → `api_id`, `api_hash`
3. Telegram-аккаунт, подписанный на целевые каналы
4. Nuxt с `NUXT_GROQ_API_KEY` и Supabase env

## Установка

```bash
cd workers/telegram-userbot
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# заполнить .env (см. ниже)
```

### Сессия Telethon

```bash
python scripts/create_session.py
# войти по номеру телефона; скопировать TELEGRAM_SESSION_STRING в .env
```

### Переменные окружения

| Переменная | Обязательно | Описание |
|------------|-------------|----------|
| `TELEGRAM_API_ID` | да | my.telegram.org |
| `TELEGRAM_API_HASH` | да | my.telegram.org |
| `TELEGRAM_SESSION_STRING` | да | StringSession после логина |
| `SUPABASE_URL` | да | URL проекта Supabase |
| `SUPABASE_SECRET_KEY` | да | Service role key |
| `INGEST_API_URL` | да | напр. `http://127.0.0.1:3000` |
| `INGEST_SECRET` | нет | Должен совпадать с `NUXT_INGEST_SECRET`, если задан |
| `INGEST_RATE_LIMIT_MS` | нет | Пауза между POST (по умолчанию `1000`) |
| `SOURCES_RELOAD_SEC` | нет | Перечитать источники из БД (по умолчанию `120`) |

Воркер также подхватывает `.env` из корня репозитория.

## Включение источников

Seed создаёт строки **неактивными** (`is_active = false`). Перед запуском:

```sql
update public.city_telegram_sources
set is_active = true
where source_key = 'in.ulanude'
  and city_id = (select id from cities where slug = 'ulan-ude');
```

Убедитесь, что аккаунт userbot подписан на канал. Замените placeholder-username в seed (`baikalteatr` и др.) на реальные @ каналы.

## Запуск

```bash
# Терминал 1 — Nuxt
npm run dev

# Терминал 2 — userbot (realtime)
cd workers/telegram-userbot
source .venv/bin/activate
python main.py
```

### Типичный сценарий для нового канала

```bash
# 1. Backfill — подтянуть уже опубликованную афишу
python main.py --backfill --backfill-source standup_uu --backfill-limit 80

# 2. Realtime — слушать новые посты
python main.py
```

## Smoke-тесты

### A. HTTP без Telethon

```bash
python scripts/smoke_ingest.py --message-id 999002
```

Ожидается `HTTP 200`, `ok: true`. При `persist: true` проверить `content_submissions` и `ai_parse_logs`. Повтор с тем же `--message-id` → предупреждение об уже существующей заявке.

### B. Один пост из канала

```bash
python main.py --smoke-source-key in.ulanude --smoke-message-id 12345
```

Источник должен быть `is_active = true`.

### C. Unit-тесты

```bash
python tests/test_normalizer.py -v
```

## Юридический чеклист

Перед включением источника ([спека §Юридика](../../docs/inuu/features/content/10-telegram-sources-without-bot-access.md)):

- [ ] Подтверждено право использовать / републиковать контент
- [ ] Условия канала не запрещают такой сбор
- [ ] Спорные источники → только модерация, без автопубликации

## Production (VPS + systemd)

В MVP не реализовано; рекомендуемый контур:

1. Небольшой VPS с always-on процессом
2. `systemd`: `ExecStart=/path/to/.venv/bin/python main.py`, `Restart=always`
3. `INGEST_API_URL` → production URL Nuxt
4. `NUXT_INGEST_SECRET` + `INGEST_SECRET`
5. Session string не коммитить; ограничить firewall VPS

## Troubleshooting

| Проблема | Решение |
|----------|---------|
| `No active sources` | `is_active = true` в `city_telegram_sources` |
| `403 Forbidden` на ingest | Совпадение `INGEST_SECRET` / `NUXT_INGEST_SECRET` |
| FloodWait от Telegram | Уменьшить `--backfill-limit`; не гонять backfill часто; очередь 1 req/s встроена |
| Канал без `@username` | `sourceUrl` будет null; dedupe работает через `sourceExternalId` |
| Новый источник не подхватился | Перезапустить воркер (handlers регистрируются при старте) |
| Backfill прогнал старые посты | Это ожидаемо; Groq + модерация отсеют неактуальное; дубли не плодятся |

## Файлы

| Файл | Назначение |
|------|------------|
| `main.py` | CLI: realtime, backfill, smoke |
| `worker.py` | Telethon handlers + очередь ingest |
| `normalizer.py` | Сообщение → payload ingest |
| `ingest_client.py` | HTTP-клиент с retry и rate limit |
| `sources.py` | Список источников из Supabase + `last_seen_message_id` |
