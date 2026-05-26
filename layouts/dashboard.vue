<template>
  <div class="min-h-screen bg-gray-50 text-gray-900">
    <header class="border-b border-gray-200 bg-white">
      <div class="overflow-x-auto">
        <div class="mx-auto flex min-w-max max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:min-w-0 sm:px-6">
          <div class="flex items-center gap-5">
            <NuxtLink to="/dashboard" class="text-sm font-semibold text-gray-900">
              INUU Dashboard
            </NuxtLink>
            <nav class="flex items-center gap-4 whitespace-nowrap text-sm text-gray-600">
              <NuxtLink to="/dashboard/orders" class="hover:text-gray-900">Записи</NuxtLink>
              <NuxtLink to="/dashboard/reviews" class="hover:text-gray-900">Отзывы</NuxtLink>
              <NuxtLink to="/dashboard/stories" class="hover:text-gray-900">Сториз</NuxtLink>
              <NuxtLink to="/dashboard/branches" class="hover:text-gray-900">Точки</NuxtLink>
              <NuxtLink to="/dashboard/settings/organization" class="hover:text-gray-900">Настройки</NuxtLink>
              <NuxtLink to="/dashboard/integrations" class="hover:text-gray-900">Уведомления</NuxtLink>
            </nav>
          </div>
          <NuxtLink :to="storefrontPath" class="whitespace-nowrap text-sm text-gray-600 hover:text-gray-900">
            На витрину
          </NuxtLink>
        </div>
      </div>
    </header>
    <main class="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const config = useRuntimeConfig()
const defaultCity =
  typeof config.public.defaultCitySlug === 'string' && config.public.defaultCitySlug.trim()
    ? config.public.defaultCitySlug.trim()
    : 'ulan-ude'
const storefrontPath = ref(`/${defaultCity}`)

onMounted(() => {
  fetch('/api/dashboard/storefront')
    .then((response) => response.json() as Promise<{ ok: boolean; path: string }>)
    .then((payload) => {
      if (payload.path && payload.path.startsWith('/')) {
        storefrontPath.value = payload.path
      }
    })
    .catch(() => {
      storefrontPath.value = `/${defaultCity}`
    })
})
</script>
