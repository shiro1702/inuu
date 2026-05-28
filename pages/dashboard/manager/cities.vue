<template>
  <section class="space-y-4">
    <header>
      <h1 class="text-2xl font-semibold">Города менеджера</h1>
      <p class="text-sm text-gray-600">Города и организации, к которым у текущего пользователя есть manager/owner доступ.</p>
    </header>

    <div v-if="pending" class="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-600">Загрузка...</div>
    <div v-else-if="errorMessage" class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{{ errorMessage }}</div>
    <div v-else class="space-y-3">
      <article v-for="city in items" :key="city.cityId" class="rounded-lg border border-gray-200 bg-white p-4">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h2 class="text-lg font-semibold">{{ city.cityName }}</h2>
            <p class="font-mono text-xs text-gray-500">{{ city.citySlug }}</p>
            <p class="mt-1 text-sm text-gray-600">
              Организаций: {{ city.shopCount }} (активных {{ city.activeShopCount }}), роли: {{ city.managerRoles.join(', ') }}
            </p>
          </div>
          <NuxtLink :to="`/dashboard/manager/cities/${city.citySlug}/overview`" class="rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50">
            Открыть overview
          </NuxtLink>
        </div>
      </article>
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
    const res = await fetch('/api/dashboard/manager/cities')
    const payload = await res.json() as any
    items.value = payload?.ok ? payload.items || [] : []
  } catch (error: any) {
    errorMessage.value = error?.data?.statusMessage || error?.message || 'Не удалось загрузить города'
  } finally {
    pending.value = false
  }
})
</script>
