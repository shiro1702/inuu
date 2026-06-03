# Статьи, лонгриды и retention («читать потом»)

**Источник:** брейншторм [03.06.2026](../../../fix/brainstorm/03.06.2026.md).

**Связь:** [01-news-editorial-options.md](./01-news-editorial-options.md), [30-manager-chat-place-editorial.md](./30-manager-chat-place-editorial.md), [06-bot-digest-subscriptions.md](./06-bot-digest-subscriptions.md), [31-content-tags-vibes-taxonomy.md](./31-content-tags-vibes-taxonomy.md).

**Задача:** [TASK-014](../../tracker/ACTIVE_TASKS.md).

---

## Зачем

Каталог мест и событий быстро «выгорает» у пользователя. **Журнал внутри приложения** (новости, обзоры, лонгриды) даёт повод возвращаться ежедневно. Retention-цепочка:

1. Stories / главная → тап на анонс  
2. Лонгрид → «🔖 Читать потом»  
3. Субботним утром — дружелюбный дайджест в Telegram  
4. В тексте — встроенная карточка места → CTA (карта / билеты)

---

## Типы материала

| `post_type` | Пример | Длина |
|-------------|--------|-------|
| `news` | «Отмена концерта», «Открылась кофейня» | короткая |
| `article` | «Гид по верандам 2024» | средняя |
| `longread` | «Барный кроул: 4 секретных места» | длинная |

Базовая таблица: `editorial_posts` (см. [01](./01-news-editorial-options.md)). Расширения ниже — одна миграция.

---

## Привязка контента

### A) Редакция портала

- `shop_id` = editorial shop города (`inuu-editorial`)
- `linked_entity_type` = null — глобальный материал города
- Примеры: сезонные гиды, интервью, городские дайджесты

### B) Контент организации / места

- `linked_entity_type` = `venue` | `shop`
- `linked_entity_id` = UUID
- На странице venue — блок **«Упоминания в статьях»** (reverse lookup по `linked_entity_id` + mentions в `body_json`)

У каждого поста: **`topic_tags[]`** из whitelist [31](./31-content-tags-vibes-taxonomy.md).

---

## Где показывать (UI)

| Поверхность | Роль | Поведение |
|-------------|------|-----------|
| **Stories** | Воронка внимания | Кликбейт-обложка → полный текст по тапу; сгорает по TTL |
| **Главная — «Журнал»** | Постоянная лента | Горизонтальный или вертикальный скролл, крупные обложки |
| **Карточка venue** | Контекст | Блок статей с привязкой к месту |
| **`/guides/[slug]`** | SEO + deep link | Полный текст, share, read later |

Stories-анонс создаётся при publish (ручно или из [34](./34-groq-editorial-content-multiplier.md)).

---

## «Читать потом»

### UX

- Кнопка **🔖 Читать потом** на странице статьи и в preview бота
- Раздел **«Сохранённое»** в профиле (рядом с избранными событиями / venues)
- Статус: `saved` | `reading` | `done` (опционально)

### Схема

```sql
user_saved_editorial (
  user_id uuid references profiles(id),
  editorial_post_id uuid references editorial_posts(id),
  saved_at timestamptz default now(),
  read_status text default 'saved', -- saved | done
  primary key (user_id, editorial_post_id)
);
```

### Offline (P2)

При save — prefetch текста + low-res обложки в IndexedDB (Service Worker / `useStorage`). Чтение в метро без сети.

---

## Умные напоминания бота

Не навязчивые пуши. Три сценария ([06](./06-bot-digest-subscriptions.md) — тип `READ_LATER_DIGEST`):

| Сценарий | Когда | Тон |
|----------|-------|-----|
| **Пятничный дайджест** | Пт вечер / Сб утро | «За неделю отложил N статей — полистай за кофе ☕» + список ссылок |
| **Контекстный** | Статья привязана к venue + акция на месте | «Сохранял обзор X — сейчас акция на Y» |
| **Hot news 24ч** | `post_type=news`, высокий urgency | Лёгкий пинг «пока актуально» — **max 1 раз** |

Триггер: cron (Supabase / Vercel) + очередь в боте. Opt-out через общие лимиты [06](./06-bot-digest-subscriptions.md).

---

## Конструктор блоков (`body_json`)

Плоский Markdown недостаточен для лонгридов. Блоки:

| `type` | Описание |
|--------|----------|
| `paragraph` | Текст |
| `image` | Одно фото + caption |
| `gallery` | 2–6 фото |
| `quote` | Цитата + автор |
| `place_embed` | `{ venue_id }` → Vue-карточка с рейтингом и CTA «Перейти» |
| `route_cta` | Список `venue_ids[]` + кнопка «Построить маршрут» (см. ниже) |
| `poll` | UGC-опрос (см. ниже) |

В админке / боте: шорткод `[place:uuid]` → `place_embed` при save.

---

## Доп. engagement (волна 2+)

### Маршрут в один click

Статья-подборка «4 бара на Пятницкой» → кнопка открывает карту с polyline между `venue_ids` и геопозицией пользователя.

### UGC-опрос в конце обзора

«Были тут?» → `[ Да, топ 🔥 ] [ Переоценено 👎 ] [ Хочу пойти 🔖 ]`  
Голоса агрегируются (отдельная таблица или JSON на venue) — **не заменяют** полноценные отзывы (§12 backlog).

### Аудио-версия (backlog)

Groq готовит текст для TTS; кнопка «Слушать» — вне MVP.

---

## Аналитика

| Метрика | Как |
|---------|-----|
| Opens | `editorial_post_views` или PostHog event |
| **Scroll depth** | 25 / 50 / 75 / 100% — клиентский beacon |
| Saves | count `user_saved_editorial` |
| CTR place_embed | click на встроенную карточку |

Раз в неделю бот присылает менеджерам отчёт: top/bottom по % дочитывания.

---

## API (MVP TASK-014)

| Метод | Путь |
|-------|------|
| GET | `/api/cities/[slug]/editorial` — список (фильтр `?tag=`) |
| GET | `/api/cities/[slug]/editorial/[postSlug]` — деталь + `body_json` |
| GET | `/api/cities/[slug]/venues/[id]/editorial` — упоминания |
| POST | `/api/me/saved-editorial` — save / unsave |
| GET | `/api/me/saved-editorial` — список сохранённого |

Публичные страницы: `/[city]/guides/[slug]` (или `/news/[slug]` — один canonical).

---

## Миграция (черновик)

```sql
alter table public.editorial_posts
  add column if not exists body_json jsonb,
  add column if not exists is_sponsored boolean default false,
  add column if not exists read_later_count int default 0;

-- topic_tags — см. 31, если ещё нет колонки
```

---

## Критерии готовности (TASK-014)

- [ ] Публичный list + detail API и страница `/guides/[slug]`
- [ ] `body_json` с минимум `paragraph`, `image`, `place_embed`
- [ ] Блок «Упоминания» на странице venue
- [ ] `user_saved_editorial` + UI «Читать потом» + раздел в профиле
- [ ] Журнал на главной (≥3 карточки последних published)
- [ ] Stories-анонс при publish (reuse `story_campaigns` или link из 30)
- [ ] Scroll depth event (хотя бы 50% / 100%)

**Out of scope TASK-014:** Groq multiplier ([34](./34-groq-editorial-content-multiplier.md)), HTML studio ([35](./35-html-carousel-video-studio.md)), пятничный cron бота (отдельно после save MVP).

---

## Связанные документы

- [verticals/news-and-editorial.md](../../verticals/news-and-editorial.md)
- [03-recommended-mvp.md](./03-recommended-mvp.md) — фаза 1h
