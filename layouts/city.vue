<template>
  <div class="min-h-screen bg-gray-50 text-gray-900">
    <header class="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div class="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <NuxtLink :to="cityBasePath" class="truncate text-base font-semibold text-gray-900">
          {{ displayName }}
        </NuxtLink>
        <nav class="flex items-center gap-1 text-sm sm:gap-2">
          <NuxtLink
            :to="`${cityBasePath}/events`"
            class="rounded-lg px-2 py-1.5 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            active-class="bg-gray-100 font-medium text-gray-900"
          >
            Афиша
          </NuxtLink>
          <NuxtLink
            :to="`${cityBasePath}/venues`"
            class="rounded-lg px-2 py-1.5 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            active-class="bg-gray-100 font-medium text-gray-900"
          >
            Места
          </NuxtLink>
          <NuxtLink
            :to="`${cityBasePath}/map`"
            class="hidden rounded-lg px-2 py-1.5 text-gray-600 hover:bg-gray-100 hover:text-gray-900 sm:inline-flex"
            active-class="bg-gray-100 font-medium text-gray-900"
          >
            Карта
          </NuxtLink>
          <NuxtLink
            to="/login"
            class="rounded-lg border border-gray-200 px-2 py-1.5 text-gray-700 hover:bg-gray-50"
          >
            Войти
          </NuxtLink>
        </nav>
      </div>
    </header>
    <main class="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const { cityBasePath, displayName } = useCity()
</script>
