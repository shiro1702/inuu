<template>
  <NuxtLayout name="dashboard">
    <section class="space-y-6">
      <header class="space-y-2">
        <h1 class="text-2xl font-semibold">Контент AI и новости</h1>
        <p class="text-sm text-gray-600">
          Проверка AI-парсинга, ingestion и ручное добавление новостей. Настройки чатов и парсинг-источников задаются отдельно для каждого города.
        </p>
      </header>

      <div class="rounded-lg border border-gray-200 bg-white p-4">
        <label class="block space-y-1 text-sm">
          <span class="font-medium text-gray-700">Город</span>
          <select
            v-model="selectedCitySlug"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 disabled:bg-gray-50"
            :disabled="loadingCities && !managerCities.length"
          >
            <option v-if="loadingCities && !managerCities.length" value="">Загружаем города…</option>
            <option v-else-if="!managerCities.length" value="">Нет городов в scope</option>
            <option v-for="city in managerCities" :key="city.citySlug" :value="city.citySlug">
              {{ city.cityName }} ({{ city.citySlug }})
            </option>
          </select>
        </label>
        <p v-if="!loadingCities && !managerCities.length" class="mt-2 text-sm text-amber-800">
          У аккаунта нет городов в manager scope. Нужна привязка к `shop_members`.
        </p>
      </div>

      <nav class="flex gap-1 overflow-x-auto border-b border-gray-200" aria-label="Разделы контента AI">
        <NuxtLink
          v-for="tab in tabs"
          :key="tab.to"
          :to="tab.to"
          class="shrink-0 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors"
          :class="isTabActive(tab.to)
            ? 'border-primary text-primary'
            : 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900'"
        >
          {{ tab.label }}
        </NuxtLink>
      </nav>

      <slot />
    </section>
  </NuxtLayout>
</template>

<script setup lang="ts">
const route = useRoute()
const { managerCities, selectedCitySlug, loadingCities } = useContentAiCity()

const tabs = [
  { label: 'Настройки TG/MAX', to: '/dashboard/content-ai' },
  { label: 'Источники', to: '/dashboard/content-ai/sources' },
  { label: 'AI тест', to: '/dashboard/content-ai/parse' },
  { label: 'Журнал', to: '/dashboard/content-ai/editorial' },
  { label: 'Дайджесты', to: '/dashboard/content-ai/digests' },
  { label: 'Очередь', to: '/dashboard/content-ai/queue' },
] as const

function isTabActive(path: string): boolean {
  if (path === '/dashboard/content-ai') {
    return route.path === '/dashboard/content-ai' || route.path === '/dashboard/content-ai/'
  }
  return route.path === path || route.path.startsWith(`${path}/`)
}
</script>
