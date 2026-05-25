# Supabase — INUU

## Миграции

| Папка | Назначение |
|-------|------------|
| [migrations/](migrations/) | **Актуальная** схема INUU (`001_inuu_*` … `020_inuu_seed_city_stories_slides`) |
| [migrations_legacy/](migrations_legacy/) | Архив PocketMenu (001–051), не для нового `db reset` |

### Применить с нуля (локально)

```bash
supabase db reset
# или
supabase migration up
```

### Содержимое INUU baseline

1. Extensions + enums  
2. `cities`  
3. `shops` (организации B2B), `shop_members`  
4. `profiles`, `auth_tokens`  
5. `venues`  
6. `festivals`  
7. `events`, `event_categories`  
8. `bookings`  
9. Beauty: `providers`, `services`, `schedule_slots`, `waitlist_entries`, `hot_slots`  
10. `user_favorites`, `city_subscriptions`, `user_city_preferences`  
11. `editorial_posts`, `curated_lists`  
12. `tourism_listings`, `tourism_leads`  
13. `story_campaigns` / `story_slides`  
14. `notification_events`  
15. `entity_reviews`  
16. `booking_payment_intents`, `payment_webhook_events`  
17. `feature_catalog` (модули INUU)  
18. RLS  
19. Seed Улан-Удэ  
20. Seed слайды городских сторис (Улан-Удэ)  

Спека: [../docs/inuu/09-data-model-overview.md](../docs/inuu/09-data-model-overview.md).

## Существующая prod-БД

Если на сервере уже применены **legacy** миграции:

1. **Не** делать `db reset` на проде.  
2. Написать transition-миграции: `052_inuu_*.sql` поверх текущей схемы (добавить таблицы, не drop `orders`/`products` сразу).  
3. Или новый Supabase-проект только под INUU + перенос данных.

## `supabase-telegram-link.sql` (корень репо)

Устарел — включён в `migrations/004_inuu_profiles_auth.sql`.
