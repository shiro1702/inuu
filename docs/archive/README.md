# Архив: PocketMenu / teleShop

В этом репозитории продукт **PocketMenu** (QR-меню, заказы еды, кухня, iiko, Quick Resto) **снят**. Единственный целевой продукт — **INUU** → [../inuu/README.md](../inuu/README.md).

Ниже — где остались старые материалы (не обновляются под INUU без явной задачи):

| Папка / файлы | Содержание |
|---------------|------------|
| `platform/MULTI_TENANT_SAAS.md` | Ресторанный мультитенант |
| `platform/FEATURE_TOGGLES_PRICING_RU.md` | Модули `core_qr_menu`, кухня, доставка |
| `features/HOME_CONFECTIONERS_*`, `ORDER_*` | Заказы еды (часть кондитеров переносится в `inuu/verticals/confectioners.md`) |
| `integrations/QUICK_RESTO_*`, iiko | Ресторанные POS |
| `content/brainstorm/стратегия-pocketmenu.md` | Стратегия PocketMenu |
| `content/instagram-carousels/*` | B2B карусели HoReCa |
| `marketing/partners-landing-structure-*` | Лендинг партнёров ресторанов |
| `runbooks/*pocketmenu*` в URL | Домены деплоя — обновить при смене бренда |
| `ORDER_SYSTEM.md`, `ORDER_AND_AUTH_FLOW_REVIEW.md` | Заказы еды, checkout |
| `TELEGRAM_STATELESS_BRIDGE.md` | Мост корзины Web → TMA |

**Не использовать** эти документы для новых фич. Для вычистки кода см. [../inuu/implementation/01-cleanup-unused.md](../inuu/implementation/01-cleanup-unused.md).
