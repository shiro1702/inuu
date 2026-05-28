<template>
  <section class="space-y-4">
    <header>
      <h1 class="text-2xl font-semibold">Города (platform admin)</h1>
      <p class="text-sm text-gray-600">Глобальный обзор городов платформы с основными метриками.</p>
    </header>

    <div v-if="pending" class="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-600">Загрузка...</div>
    <div v-else-if="errorMessage" class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{{ errorMessage }}</div>
    <div v-else class="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <table class="min-w-full divide-y divide-gray-200 text-sm">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left">Город</th>
            <th class="px-4 py-3 text-left">Shops</th>
            <th class="px-4 py-3 text-left">Venues</th>
            <th class="px-4 py-3 text-left">Events</th>
            <th class="px-4 py-3 text-left"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="city in items" :key="city.id">
            <td class="px-4 py-3">
              <div class="font-medium">{{ city.name }}</div>
              <div class="font-mono text-xs text-gray-500">{{ city.slug }}</div>
            </td>
            <td class="px-4 py-3">{{ city.metrics.shopsActive }}/{{ city.metrics.shopsTotal }}</td>
            <td class="px-4 py-3">{{ city.metrics.venuesPublished }}/{{ city.metrics.venuesTotal }}</td>
            <td class="px-4 py-3">{{ city.metrics.eventsUpcoming }}/{{ city.metrics.eventsPublished }}</td>
            <td class="px-4 py-3">
              <NuxtLink :to="`/dashboard/admin/cities/${city.slug}/overview`" class="rounded border border-gray-300 px-3 py-1 hover:bg-gray-50">
                Open
              </NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

declare const definePageMeta: (meta: Record<string, unknown>) => void
definePageMeta({ layout: 'dashboard' })

const pending = ref(true)
const errorMessage = ref('')
const items = ref<any[]>([])

onMounted(async () => {
  pending.value = true
  errorMessage.value = ''
  try {
    const res = await fetch('/api/dashboard/admin/cities')
    const payload = await res.json() as any
    items.value = payload?.ok ? payload.items || [] : []
  } catch (error: any) {
    errorMessage.value = error?.data?.statusMessage || error?.message || 'Не удалось загрузить admin cities'
  } finally {
    pending.value = false
  }
})
</script>
