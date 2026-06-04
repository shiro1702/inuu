<template>
  <main class="bg-white text-gray-900">
    <section class="border-b border-gray-100 bg-gradient-to-b from-primary-50/80 to-white">
      <div class="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
        <p class="text-sm font-medium uppercase tracking-wide text-primary">
          Реклама
        </p>
        <h1 class="mt-3 max-w-3xl text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl lg:text-[2.5rem]">
          Продвигайте бизнес в городском гиде INUU
        </h1>
        <p class="mt-5 max-w-2xl text-lg leading-relaxed text-gray-600">
          Афиша, места и подборки редакции — аудитория, которая уже ищет, куда сходить и к кому записаться.
          Размещения на сайте, в stories и в Telegram-канале города.
        </p>
        <div class="mt-8 flex flex-wrap items-center gap-3">
          <a
            v-if="contactTelegramUrl"
            :href="contactTelegramUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-3 text-base font-semibold text-on-primary shadow-sm transition hover:bg-primary-600 active:bg-primary-700"
          >
            Обсудить размещение
          </a>
          <a
            :href="contactEmailHref"
            class="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3 text-base font-medium text-gray-800 transition hover:border-primary hover:bg-primary-50"
          >
            Написать на email
          </a>
          <NuxtLink
            :to="cityHomePath"
            class="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3 text-base font-medium text-gray-800 transition hover:border-primary hover:bg-primary-50"
          >
            Посмотреть афишу города
          </NuxtLink>
        </div>
      </div>
    </section>

    <div class="mx-auto max-w-5xl space-y-16 px-4 py-14 sm:px-6 sm:py-16">
      <section aria-labelledby="ads-audience">
        <h2 id="ads-audience" class="text-2xl font-semibold text-gray-900">
          Кому подходит
        </h2>
        <ul class="mt-5 grid gap-4 sm:grid-cols-2">
          <li
            v-for="item in audienceItems"
            :key="item.title"
            class="rounded-xl border border-gray-200 p-5"
          >
            <p class="font-semibold text-gray-900">{{ item.title }}</p>
            <p class="mt-2 text-sm leading-relaxed text-gray-600">{{ item.desc }}</p>
          </li>
        </ul>
      </section>

      <section aria-labelledby="ads-formats">
        <h2 id="ads-formats" class="text-2xl font-semibold text-gray-900">
          Форматы размещения
        </h2>
        <p class="mt-3 text-gray-600">
          Все кампании привязаны к городу — гости видят релевантные предложения в своём INUU, без «чужих» баннеров.
        </p>
        <div class="mt-6 overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table class="min-w-full divide-y divide-gray-200 text-left text-sm">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="whitespace-nowrap px-4 py-3 font-semibold text-gray-900 sm:px-5">
                  Формат
                </th>
                <th scope="col" class="px-4 py-3 font-semibold text-gray-900 sm:px-5">
                  Где показываем
                </th>
                <th scope="col" class="whitespace-nowrap px-4 py-3 font-semibold text-gray-900 sm:px-5">
                  Ориентир
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 bg-white">
              <tr v-for="row in placementRows" :key="row.format">
                <td class="px-4 py-3 font-medium text-gray-900 sm:px-5">
                  {{ row.format }}
                </td>
                <td class="px-4 py-3 text-gray-700 sm:px-5">
                  {{ row.where }}
                </td>
                <td class="whitespace-nowrap px-4 py-3 text-gray-600 sm:px-5">
                  {{ row.price }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="mt-4 text-sm text-gray-500">
          Точные условия и сроки — после брифа. Прайс уточняется по первым продажам в городе.
        </p>
      </section>

      <section aria-labelledby="ads-packages">
        <h2 id="ads-packages" class="text-2xl font-semibold text-gray-900">
          Пакеты
        </h2>
        <div class="mt-6 grid gap-4 md:grid-cols-3">
          <article
            v-for="pack in packageCards"
            :key="pack.title"
            class="rounded-xl border border-gray-200 bg-white p-5"
          >
            <p class="text-sm font-semibold uppercase tracking-wide text-primary">{{ pack.badge }}</p>
            <h3 class="mt-2 text-lg font-semibold text-gray-900">{{ pack.title }}</h3>
            <p class="mt-2 text-sm text-gray-600">{{ pack.desc }}</p>
            <p class="mt-4 rounded-lg bg-primary-50 px-3 py-2 text-sm font-semibold text-gray-900">
              {{ pack.price }}
            </p>
          </article>
        </div>
      </section>

      <section aria-labelledby="ads-how">
        <h2 id="ads-how" class="text-2xl font-semibold text-gray-900">
          Как запускаем кампанию
        </h2>
        <ol class="mt-6 space-y-4">
          <li v-for="(step, index) in launchSteps" :key="step.title" class="flex gap-4">
            <span
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-on-primary"
            >
              {{ index + 1 }}
            </span>
            <div>
              <p class="font-medium text-gray-900">{{ step.title }}</p>
              <p class="mt-1 text-sm text-gray-600">{{ step.desc }}</p>
            </div>
          </li>
        </ol>
      </section>

      <section aria-labelledby="ads-rules">
        <h2 id="ads-rules" class="text-2xl font-semibold text-gray-900">
          Прозрачность для гостей
        </h2>
        <ul class="mt-5 space-y-3 text-base text-gray-600">
          <li v-for="rule in transparencyRules" :key="rule" class="flex gap-3">
            <span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
            {{ rule }}
          </li>
        </ul>
      </section>

      <section aria-labelledby="ads-org" class="rounded-2xl border border-gray-200 bg-gray-50/80 p-5">
        <h2 id="ads-org" class="text-lg font-semibold text-gray-900">
          Вы организатор или владелец места?
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Бесплатная карточка в афише и кабинет для команды — отдельный процесс, не через рекламный отдел.
        </p>
        <div class="mt-4 flex flex-wrap gap-3">
          <NuxtLink
            :to="`${cityHomePath}/legal/contacts`"
            class="text-sm font-medium text-primary hover:underline"
          >
            Связаться с редакцией
          </NuxtLink>
          <NuxtLink
            to="/dashboard/login"
            class="text-sm font-medium text-gray-700 hover:text-gray-900 hover:underline"
          >
            Вход в кабинет города
          </NuxtLink>
        </div>
      </section>
    </div>

    <section class="border-t border-gray-200 bg-gray-50 py-14 sm:py-16">
      <div class="mx-auto max-w-5xl px-4 text-center sm:px-6">
        <h2 class="text-2xl font-semibold text-gray-900 sm:text-3xl">
          Оставьте заявку — подберём формат под вашу задачу
        </h2>
        <p class="mx-auto mt-3 max-w-2xl text-gray-600">
          Салон, бар, турбаза, ивент или локальный бренд — расскажите цель, даты и бюджет, пришлём медиакит и варианты слотов.
        </p>
        <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            v-if="contactTelegramUrl"
            :href="contactTelegramUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-3 text-base font-semibold text-on-primary shadow-sm transition hover:bg-primary-600 active:bg-primary-700"
          >
            Написать в Telegram
          </a>
          <a
            :href="contactEmailHref"
            class="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3 text-base font-medium text-gray-800 transition hover:border-primary hover:bg-primary-50"
          >
            {{ contactEmail }}
          </a>
        </div>
      </div>
    </section>

    <footer class="border-t border-gray-200 bg-white">
      <div class="mx-auto max-w-5xl px-4 py-6 text-xs text-gray-600 sm:px-6">
        <NuxtLink :to="cityHomePath" class="font-medium text-primary hover:underline">
          ← На главную города
        </NuxtLink>
        <p class="mt-3 text-gray-500">
          INUU — городской агрегатор событий, мест и сервисов. Рекламные материалы проходят премодерацию.
        </p>
      </div>
    </footer>
  </main>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()

const defaultCitySlug = computed(() => {
  const raw = config.public.defaultCitySlug
  return typeof raw === 'string' && raw.trim() ? raw.trim() : 'ulan-ude'
})

const cityHomePath = computed(() => `/${defaultCitySlug.value}/events`)

const contactEmail = 'shiro1702@gmail.com'
const contactEmailHref = `mailto:${contactEmail}?subject=${encodeURIComponent('Реклама на INUU')}`
const contactTelegramHandle = 'arsalanbar'
const contactTelegramUrl = `https://t.me/${contactTelegramHandle}`

const audienceItems = [
  { title: 'Салоны и мастера', desc: 'Запись, акции, «горящие окошки» — видимость в beauty-категории и подборках.' },
  { title: 'Бары и рестораны', desc: 'События, вечеринки, дегустации — трафик из афиши и stories.' },
  { title: 'Турбазы и отдых', desc: 'Сезонные пакеты на Байкал и выходные — баннеры и спонсор подборки.' },
  { title: 'Организаторы и площадки', desc: 'Спонсор календаря, продвижение конкретного ивента.' },
  { title: 'Локальные бренды', desc: 'Нативное место в редакционной подборке с пометкой «Реклама».' },
  { title: 'Сервисы города', desc: 'Доставка цветов, фотостудии, курсы — релевантный сегмент без спама.' },
] as const

const placementRows = [
  { format: 'Баннер на главной', where: 'Ротация на главной странице города', price: 'договорная / неделя' },
  { format: 'Топ категории', where: 'Верх афиши, beauty, туризм', price: 'от 3 000 ₽ / мес' },
  { format: 'Story, первый слот', where: 'Полоска stories на сайте', price: '1 000–5 000 ₽ / 24 ч' },
  { format: 'Натив в подборке', where: 'Платное место в редакционном списке', price: 'фикс за слот' },
  { format: 'Telegram-дайджест', where: 'Пост в канале города', price: 'в пакете «выходные»' },
  { format: 'Пакет «Выходные»', where: 'Сайт + story + пост в TG', price: '10 000–25 000 ₽' },
] as const

const packageCards = [
  {
    badge: 'Старт',
    title: 'Точечное промо',
    desc: 'Один слот: story или натив в подборке на выбранные даты.',
    price: 'от 1 000 ₽',
  },
  {
    badge: 'Рост',
    title: 'Категория + афиша',
    desc: 'Закрепление вверху категории и карточка события в ленте.',
    price: 'от 3 000 ₽ / мес',
  },
  {
    badge: 'Максимум',
    title: 'Омниканал «Выходные»',
    desc: 'Главная + stories + пост в Telegram под ваш оффер.',
    price: '10 000–25 000 ₽',
  },
] as const

const launchSteps = [
  { title: 'Бриф', desc: 'Цель, аудитория, даты, ссылка на лендинг или карточку INUU.' },
  { title: 'Креатив и модерация', desc: 'Проверяем по закону о рекламе, возрастным ограничениям и правилам платформы.' },
  { title: 'Запуск', desc: 'Включаем слоты, вешаем UTM для отчёта по кликам.' },
  { title: 'Отчёт', desc: 'Показы, переходы, CTR — по запросу в конце кампании.' },
] as const

const transparencyRules = [
  'Рекламные блоки помечаются «Реклама» — редакционные подборки не продаются без маркировки.',
  'Премодерация всех креативов до публикации.',
  'Платные рассылки в бот — только с согласия пользователя и лимитом частоты.',
  'Персональные данные гостей не передаются рекламодателю — только агрегированная статистика.',
] as const

useSeoMeta({
  title: 'Реклама на INUU — размещение в городском гиде',
  description:
    'Реклама в INUU: баннеры, stories, подборки и Telegram-канал города. Салоны, бары, ивенты, турбазы и локальные бренды в Улан-Удэ.',
  ogTitle: 'Реклама на INUU',
  ogDescription: 'Продвижение в афише, подборках и омниканальных пакетах городского гида INUU.',
})
</script>
