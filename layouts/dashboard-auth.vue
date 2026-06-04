<template>
  <div class="min-h-screen bg-gray-50 text-gray-900">
    <header class="border-b border-gray-200 bg-white">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <span class="text-sm font-semibold text-gray-900">INUU — кабинет города</span>
        <NuxtLink
          :to="cityStorefrontPath"
          class="text-sm text-gray-600 hover:text-gray-900"
        >
          На афишу
        </NuxtLink>
      </div>
    </header>
    <main class="mx-auto max-w-md px-4 py-8 sm:px-6">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const config = useRuntimeConfig()
const cityStorefrontPath = computed(() => {
  const slug =
    typeof config.public.defaultCitySlug === 'string' && config.public.defaultCitySlug.trim()
      ? config.public.defaultCitySlug.trim()
      : 'ulan-ude'
  return `/${slug}/events`
})
</script>
