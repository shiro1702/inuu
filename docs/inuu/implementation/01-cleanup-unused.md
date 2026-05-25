# Очистка: legacy ресторанного функционала

Что убрать из **incity-new** при продукте **INUU** (афиша, venues, beauty, туризм, редакция). Режимов `food` / `both` / feature-flag PocketMenu **нет** — целевое состояние одно.

Уровни действий:

| Уровень | Смысл | Когда |
|---------|--------|--------|
| **hide** | Не показывать в UI, маршрут 404 или redirect | Сразу |
| **deprecate** | API 410/redirect + лог; данные в БД не трогать | После hide |
| **remove** | Удалить файлы, миграции drop (с бэкапом) | После 90 дней без обращений к API |

---

## 1. Публичная витрина (pages)

### remove / hide

| Путь / страница | Причина |
|-----------------|--------|
| `[city_slug]/[tenant_slug]/cart.vue` | Корзина блюд |
| `[city_slug]/[tenant_slug]/checkout.vue` | Доставка / зал |
| `[city_slug]/[tenant_slug]/index.vue` | Меню ресторана |
| `[city_slug]/[tenant_slug]/bonuses.vue` | Лояльность ресторана |
| `[city_slug]/cart.vue`, `checkout.vue` | Общая корзина города |
| `[tenant_slug]/*` (корень без city) | Legacy витрина tenant |
| `pages/cart.vue`, `checkout.vue` | Глобальная корзина |
| `pages/bonuses.vue` | Бонусы ресторанов |

### оставить / переделать

| Путь | INUU |
|------|------|
| `[city_slug]/index.vue` | Главная: events, venues, stories |
| `[city_slug]/events/`, `venues/`, `beauty/`, `map` | Новые маршруты |
| `[city_slug]/legal/*` | Оферта, ПДн |
| `[city_slug]/orders.vue` | → «Мои записи» / bookings |
| `login`, `profile`, `link-telegram`, `link-max` | Auth |
| `partners.vue` | B2B лендинг INUU |

### фестиваль

| Путь | Решение |
|------|---------|
| `[city_slug]/festival/...` | Оставить как подтип events/venues |
| `.../[tenant_slug]/cart` (еда на фестивале) | Удалить, если нет корнеров с меню |

---

## 2. Composables / stores

### remove

| Модуль | Назначение (legacy) |
|--------|---------------------|
| `stores/cart.ts` | Мульти-shop корзина |
| `useCheckoutAddress.ts` | Адрес доставки |
| `useCheckoutTenantRestaurants.ts` | Филиал на checkout |
| `useDeliveryZone.ts` | Зоны доставки |
| `useTenantRestaurantsCache.ts` | Кэш ресторанов |
| `useWorkingHoursStatus.ts` | Часы для заказа еды |

### оставить

| Модуль | INUU |
|--------|------|
| `useTelegram.ts` | Mini App TG + MAX |
| `useMessengerStorage.ts` | Storage в TMA |
| `useStories.ts` | Stories |
| `useLegalPaths.ts` | Legal URLs |
| `useGeocodedMarkers.ts` | Карта venues |
| `useTenant.ts` | → organization context |
| `useDashboardAccess.ts` | RBAC |

---

## 3. Server API (Nitro)

### deprecate → remove

**Меню и каталог:** `products.get.ts`, `dashboard/menu/**`, `promo/preview.post.ts`

**Заказ еды:** `order.post.ts`, `order-bridge.*`, `cart-bridge.*`, `client-order-status.get.ts`, `delivery-resolve.post.ts`, `restaurant-zones.get.ts`

**POS:** `webhooks/iiko/**`, `webhooks/quickresto/**`, `dashboard/integrations/iiko|quickresto/**`, `checkout/iiko|quickresto/**`

**Зал:** `service-calls.*`, `dashboard/branches/[id]/kitchen/**`, `tables/**`, `zones`, `orders/kanban`, `manager`, `delay`

**Лояльность:** `loyalty/balance.get.ts`, `dashboard/marketing/loyalty-settings.*`

**Онбординг ресторана:** `onboarding/create-shop.post.ts` → онбординг organization INUU

### оставить / адаптировать

| API | INUU |
|-----|------|
| `cities.get.ts` | Города |
| `restaurants.get.ts` | Заменить на `venues` или удалить |
| `client-orders.get.ts` | → `client-bookings` |
| `reviews.*` | Отзывы на booking |
| `stories.get.ts`, `dashboard/stories/**` | Stories |
| `webhook.post.ts`, `webhook-max.post.ts` | Боты + подписки |
| `auth/**` | Сессии |
| `webhooks/yookassa.post.ts` | Оплата |
| `festival/**` | События |
| `dashboard/reviews/**`, `integrations/notifications/**` | Модерация, пуши |
| `dashboard/features/**` | SaaS-модули INUU |

---

## 4. Dashboard (B2B)

### remove

Меню, кухня, столы, зоны доставки, kanban заказов еды, cross-sell, iiko / Quick Resto, loyalty ресторана.

### оставить / переименовать в UI

| Было | INUU |
|------|------|
| Филиалы | Точки / venues |
| Заказы | Записи / bookings |
| Stories, Reviews, Team, settings | Без изменений логики |
| Applications | Заявки партнёров |

---

## 5. База данных (Supabase)

На фазе hide/deprecate таблицы не drop — только перестать читать из приложения.

### кандидаты на remove (фаза 4)

`products`, `product_*`, `menu_*`, modifiers, `restaurant_delivery_zones`, `restaurant_tables`, `service_calls*`, `iiko_*`, `quickresto_*`, restaurant-only `loyalty_*`

### оставить / эволюция

| Таблица | INUU |
|---------|------|
| `cities`, `shops` | Мульти-город; `shops` → organizations |
| `restaurants` | Миграция в `venues` или type=venue |
| `orders` | Архив; новые — `bookings` |
| `profiles`, `notification_events` | Клиенты, омниканал |
| `festivals`, `festival_*` | Крупные события |
| `shop_feature_subscriptions` | B2B модули INUU |
| Reviews (`047_*`) | Отзывы |

---

## 6. Документация

Помечено в [../../archive/README.md](../../archive/README.md): `integrations/QUICK_RESTO_*`, ресторанные `features/ORDER_*`, instagram-carousels HoReCa.

**Не удалять:** `inuu/verticals/confectioners.md` и связанный order-flow для самозанятых (отдельная вертикаль, не QR-меню зала).

---

## 7. Env

Убрать из деплоя INUU: ключи iiko / Quick Resto, `DADATA_*` (если нет доставки).

Оставить: Supabase, боты TG/MAX, ЮKassa, `NUXT_PUBLIC_DEFAULT_CITY_SLUG=ulan-ude`.

---

## 8. Чеклист

**Фаза hide**

- [ ] Скрыты cart/checkout/bonuses и tenant menu routes
- [ ] Dashboard без Menu, Kitchen, Zones, iiko, QR
- [ ] Главная `[city_slug]/index` — events/venues, не лента ресторанов
- [ ] `docs/archive/` и корневой README — бренд INUU

**Фаза remove**

- [ ] Нет трафика на food API 90 дней
- [ ] Удалены routes menu/cart/iiko/QR
- [ ] Drop неиспользуемых таблиц (бэкап)

---

## Риски

| Риск | Митигация |
|------|-----------|
| Потерять данные старых заказов | Архив БД перед drop; read-only export |
| Фестиваль с корнерами еды | Отдельный сценарий через `events` + booking, не полное меню POS |

См. [02-refactor-existing.md](./02-refactor-existing.md).
