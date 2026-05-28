<template>
  <section class="space-y-4">
    <header>
      <h1 class="text-2xl font-semibold">Manager city overview</h1>
      <p class="text-sm text-gray-600">Оперативные метрики по городу в рамках manager scope.</p>
    </header>

    <div v-if="pending" class="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-600">Загрузка...</div>
    <div v-else-if="errorMessage" class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{{ errorMessage }}</div>
    <div v-else class="space-y-4">
      <article class="rounded-lg border border-gray-200 bg-white p-4">
        <h2 class="text-lg font-semibold">{{ payload.city.name }}</h2>
        <p class="font-mono text-xs text-gray-500">{{ payload.city.slug }}</p>
        <div class="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div class="rounded border border-gray-200 p-3"><p class="text-xs text-gray-500">Shops</p><p class="text-xl font-semibold">{{ payload.metrics.shopsCount }}</p></div>
          <div class="rounded border border-gray-200 p-3"><p class="text-xs text-gray-500">Venues</p><p class="text-xl font-semibold">{{ payload.metrics.venuesCount }}</p></div>
          <div class="rounded border border-gray-200 p-3"><p class="text-xs text-gray-500">Events</p><p class="text-xl font-semibold">{{ payload.metrics.eventsCount }}</p></div>
          <div class="rounded border border-gray-200 p-3"><p class="text-xs text-gray-500">Bookings</p><p class="text-xl font-semibold">{{ payload.metrics.bookingsCount }}</p></div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

declare const definePageMeta: (meta: Record<string, unknown>) => void
definePageMeta({ layout: 'dashboard' })

const route = useRoute()
const slug = computed(() => String(route.params.slug || ''))
const pending = ref(true)
const errorMessage = ref('')
const payload = ref<any>(null)

onMounted(async () => {
  pending.value = true
  errorMessage.value = ''
  try {
    const res = await fetch(`/api/dashboard/manager/cities/${slug.value}/overview`)
    payload.value = await res.json()
  } catch (error: any) {
    errorMessage.value = error?.data?.statusMessage || error?.message || 'Не удалось загрузить overview'
  } finally {
    pending.value = false
  }
})
</script>
