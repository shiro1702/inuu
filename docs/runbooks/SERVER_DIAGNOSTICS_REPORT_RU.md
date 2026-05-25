# Диагностика VPS (INUU / incity-new)

**Дата проверки:** 29 апреля 2026  
**Сервер:** 168.222.194.186 (REG.RU VPS)

Отчёт о доступности инфраструктуры Nuxt + self-hosted Supabase. Домены в логах (`pocketmenu.ru`, `api.pocketmenu.ru`) — **legacy**; при смене бренда обновить DNS и env.

---

## 1. Ресурсы (ОЗУ, CPU, диск)

Сервер **не** упирается в железо.

| Метрика | Значение |
|---------|----------|
| Load average | ~0.19–0.30 |
| RAM | ~6 ГБ всего, ~2.8 ГБ доступно |
| Диск | ~19% занято (77 ГБ свободно) |
| Uptime | 7+ дней |
| OOM kills | не обнаружено |

---

## 2. Docker

Контейнеры frontend и Supabase в статусе `healthy`. Frontend ~50 МБ RAM; Kong ~700 МБ, Analytics ~600 МБ, Postgres ~240 МБ — в норме.

---

## 3. Проблема: лимит подключений PostgreSQL

Симптом «сайт засыпает» связан с БД, не с CPU/RAM.

1. **Kong / Postgres:** `FATAL: sorry, too many clients already` (27 апр).
2. **`max_connections`** = **100** (дефолт).
3. **Nuxt SSR:** retry к `api.*.ru/rest/v1/...` при отказе PostgREST → долгая загрузка главной (города, каталог).

---

## 4. Рекомендации

1. Увеличить `max_connections` до **200–300** (память позволяет).
2. Проверить пул PostgREST (`PGRST_DB_POOL`).
3. После смены домена INUU — обновить `NUXT_PUBLIC_SUPABASE_URL` и nginx.

Подробнее деплой: [DEPLOY_SERVER_REGRU_SINGLE_VPS.md](./DEPLOY_SERVER_REGRU_SINGLE_VPS.md), [SELF_HOSTED_SUPABASE_SERVER_RUNBOOK_RU.md](./SELF_HOSTED_SUPABASE_SERVER_RUNBOOK_RU.md).

---

## Итог

VPS с запасом по ресурсам. Периодическая недоступность — исчерпание `max_connections` в Postgres; увеличение лимита должно стабилизировать API для INUU-витрины.
