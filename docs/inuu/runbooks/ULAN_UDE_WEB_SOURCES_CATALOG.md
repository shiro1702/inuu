# Каталог web-источников парсинга · Улан-Удэ

**Миграция:** `052_ulande_web_sources_catalog.sql`  
**Dashboard:** [/dashboard/content-ai](http://localhost:3000/dashboard/content-ai) → город `ulan-ude` → «Web-источники (cron)»  
**Runbook парсера:** [WEB_URL_PARSER_RU.md](./WEB_URL_PARSER_RU.md)

---

## Сводка проверки (08.06.2026)

| Источник | URL | Статус | Тип страницы (ожидание) | Заметки |
|----------|-----|--------|-------------------------|---------|
| Музеи (каталог) | https://uuportal.ru/museum | ✅ OK | `event_list_links` | 6 музеев, ссылки на карточки с выставками |
| Музей Сампилова | …/hudozhestvennyy-muzey-im.-c.s.-sampilova | ✅ OK | `text_wall` / `single_event` | 8 выставок с датами «Вт, 9 июн - Вс, 21 июн», билеты muzeyrb.ru |
| Городские паблики VK | https://uuportal.ru/city/gorod | ✅ OK | `text_wall` | 90 пабликов, ~21 пост в ленте. Текст + даты на странице; VK-ссылки `vk.com/wall-*` валидны |
| ЦБС главная | https://cbs-uu.ru/ | ✅ OK | `event_list_links` | Лента новостей + ссылки на еженедельные афиши |
| ЦБС июнь 2026 | https://cbs-uu.ru/2026/06/ | ✅ OK | `event_list_links` | Посты + превью афиш; дочерние URL — сборники |
| ЦБС афиша 8–14 июн | …/afisha-meropriyatij-s-8-po-14-iyunya/ | ✅ OK | `text_wall` | События по дням (8–14 июн), время, адрес, возраст 6+/12+ |
| НБРБ афиша | https://nbrb.ru/affiche/ | ✅ OK | `event_list_links` | Карточки с датами, «Загрузить еще» |
| Город зовёт (рубрики) | gorodzovet.ru/ulan-ude/{tag}/ | ✅ OK | `event_list_links` | Карточки с ценой, Пушкинская карта; **дубли между рубриками** |

---

## uuportal.ru · Музеи

**Каталог:** https://uuportal.ru/museum

На индексной странице — 6 музеев с количеством выставок. Каждая карточка ведёт на страницу музея с блоком **«Выставки»**:

- диапазон дат (`Вт, 9 июн - Вс, 21 июн`);
- постоянная экспозиция (`Постоянно`);
- ссылка «Купить билет на muzeyrb.ru».

**В БД добавлены:** индекс + 6 карточек музеев (см. миграцию 052).

**Контекст Groq:** `museum`.

---

## uuportal.ru · Городские паблики (VK)

**URL:** https://uuportal.ru/city/gorod

Проверка корректности данных:

1. **Текст постов** — полный текст на странице uuportal (не нужно парсить VK напрямую).
2. **VK-ссылки** — кнопка «Открыть в VK» ведёт на `vk.com/wall-{group}_{post}` или `vk.com/club{id}`; при скрейпе ссылок все URL отвечают 200.
3. **События в постах** — даты, время, площадки, хештеги `#uuportal`, `#УланУдэ360` (пример: открытие выставки 11 июня 14:00, День города 12–13 июня с расписанием по часам).
4. **Фильтры** — «Культура» (15 пабликов), «Мэрия» (16), «Спорт»; отдельные страницы пабликов: `/city/gorod/culture-uu`, `/city/gorod/gorodulanude`, …

**Риски:** в ленте есть не-афишные посты (набор в ДХШ, фотоотчёты) — пре-фильтр города должен остаться включён.

**Контекст Groq:** `general`.

---

## cbs-uu.ru · Муниципальные библиотеки

Структура сайта (WordPress):

| Уровень | Пример | Содержимое |
|---------|--------|------------|
| Главная | https://cbs-uu.ru/ | Последние новости + ссылка на текущую афишу |
| Год | https://cbs-uu.ru/2026/ | Архив за год |
| Месяц | https://cbs-uu.ru/2026/06/ | Посты месяца + превью афиш |
| Сборник | …/2026/06/08/afisha-meropriyatij-s-8-po-14-iyunya/ | **Много событий на одной странице**, разбивка по дням |

Еженедельные сборники **не сидятся статически** — cron на месячной странице должен находить их как `event_list_links` (до 5 URL за прогон).

**Операционно:** раз в месяц обновить URL `https://cbs-uu.ru/YYYY/MM/` в dashboard (или SQL).

**Контекст Groq:** `library`.

---

## nbrb.ru · Национальная библиотека

**URL:** https://nbrb.ru/affiche/

- Выставки с датами «До 30 июня»;
- «Афиша месяца» — сводный пост;
- Виртуальный концертный зал с датами сеансов;
- Пагинация «Загрузить еще».

**Контекст Groq:** `library`.

---

## gorodzovet.ru · Город зовёт

Рубрики (все в миграции 052):

| Рубрика | URL |
|---------|-----|
| Балет | https://gorodzovet.ru/ulan-ude/ballet/ |
| Бесплатные | https://gorodzovet.ru/ulan-ude/free/ |
| Детская афиша | https://gorodzovet.ru/ulan-ude/kids/ |
| Концерты | https://gorodzovet.ru/ulan-ude/concert/ |
| Культура и искусство | https://gorodzovet.ru/ulan-ude/culture/ |
| Литература | https://gorodzovet.ru/ulan-ude/books/ |
| Музыка | https://gorodzovet.ru/ulan-ude/music/ |
| Образ жизни | https://gorodzovet.ru/ulan-ude/lifestyle/ |
| Театр | https://gorodzovet.ru/ulan-ude/theater/ |
| Шоу и концерты | https://gorodzovet.ru/ulan-ude/shows/ |
| Экскурсии | https://gorodzovet.ru/ulan-ude/excursion/ |

**Дубликаты:** одно событие (напр. балет «Анюта») встречается в `ballet`, `theater`, `kids`. Dedupe: `ingestDedupe.ts` по `source_url`; между рубриками — разные URL карточек, но одинаковый контент → дедуп на уровне org/title+дата при модерации.

**Альтернатива:** одна рубрика `https://gorodzovet.ru/ulan-ude/` покрывает всё, но теряется теговый контекст для Groq.

---

## Чеклист после применения миграции

1. `supabase db push` или применить `052` на prod.
2. Открыть content-ai → `ulan-ude` → убедиться, что **+22** web-источника (поверх существующих t.me/s).
3. Для каждого приоритетного URL: **Проверить** (test crawl, `persist: false`).
4. При успешном parse — **Cron enabled** для ночного обхода.
5. Раз в месяц: обновить URL ЦБС `…/YYYY/MM/`.
6. Следить за `scraping_alerts` после первого cron.

### Приоритет test crawl

1. `uuportal.ru/city/gorod` — максимум городских анонсов
2. `cbs-uu.ru/2026/06/` → дочерняя афиша
3. `nbrb.ru/affiche/`
4. `gorodzovet.ru/ulan-ude/theater/`
5. `uuportal.ru/museum/hudozhestvennyy-muzey-im.-c.s.-sampilova`

---

## Связанные документы

- [TASK-004-ulan-ude-sources-backfill.md](../tracker/TASK-004-ulan-ude-sources-backfill.md) — TG + t.me/s seed
- [WEB_URL_PARSER_RU.md](./WEB_URL_PARSER_RU.md) — как работает cron/classifier
