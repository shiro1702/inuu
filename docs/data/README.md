# Telegram export — in.ulanude афиша

Экспорт канала **in.ulanude 🗓️Афиша города** (Telegram Desktop → Export chat history → HTML).

## Структура

| Файл / папка | Назначение |
|--------------|------------|
| `messages.html` | Посты и альбомы (joined messages = одна подборка) |
| `photos/` | JPEG-афиши (без `*_thumb.jpg` — полный размер) |
| `video_files/` | Короткие ролики (крупные файлы в HTML без ссылки — пропускаются) |

Одна **недельная подборка** = первое сообщение альбома (текст + обложка) + `joined` с остальными медиа.

## Импорт в INUU

1. Применить миграцию схемы (один раз):

   ```bash
   # Supabase Dashboard → SQL → вставить supabase/migrations/022_inuu_telegram_content.sql
   # или после supabase link:
   npx supabase db push
   ```

2. Заполнить БД и скопировать медиа в `public/content/afisha/telegram/`:

   ```bash
   python3 scripts/import_telegram_afisha.py
   ```

Повторный запуск идемпотентен (`on_conflict` по slug / source_path).

## Маппинг в БД

| Telegram | Таблица INUU |
|----------|----------------|
| Альбом недели | `editorial_posts` (`post_type = afisha_digest` после миграции 022) |
| Каждое фото афиши | `events` + `curated_list_items` |
| Галерея (фото + видео) | `editorial_post_media` (после 022) или JSON в `body` (до 022) |
| Подборка недели | `curated_lists` (`afisha-week-YYYY-MM-DD`) |

Медиа: bucket `city-editorial-media` или fallback `/content/afisha/telegram/...` в репозитории.
