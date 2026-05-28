<template>
  <section class="space-y-4">
    <header>
      <h1 class="text-2xl font-semibold">Admin city overview</h1>
      <p class="text-sm text-gray-600">Детальный обзор города для центральной администрации.</p>
    </header>

    <div v-if="pending" class="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-600">Загрузка...</div>
    <div v-else-if="errorMessage" class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{{ errorMessage }}</div>
    <div v-else class="space-y-4">
      <article class="rounded-lg border border-gray-200 bg-white p-4">
        <h2 class="text-lg font-semibold">{{ payload.city.name }}</h2>
        <p class="font-mono text-xs text-gray-500">{{ payload.city.slug }}</p>
        <div class="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div class="rounded border border-gray-200 p-3"><p class="text-xs text-gray-500">Shops</p><p class="text-xl font-semibold">{{ payload.metrics.shopsActive }}/{{ payload.metrics.shopsTotal }}</p></div>
          <div class="rounded border border-gray-200 p-3"><p class="text-xs text-gray-500">Events</p><p class="text-xl font-semibold">{{ payload.metrics.eventsUpcoming }}/{{ payload.metrics.eventsPublished }}</p></div>
          <div class="rounded border border-gray-200 p-3"><p class="text-xs text-gray-500">Editorial</p><p class="text-xl font-semibold">{{ payload.metrics.editorialPostsPublished }}/{{ payload.metrics.editorialPostsTotal }}</p></div>
          <div class="rounded border border-gray-200 p-3"><p class="text-xs text-gray-500">AI parse recent</p><p class="text-xl font-semibold">{{ payload.metrics.aiParsesSuccessRecent }}/{{ payload.metrics.aiParsesRecent }}</p></div>
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
    const res = await fetch(`/api/dashboard/admin/cities/${slug.value}/overview`)
    payload.value = await res.json()
  } catch (error: any) {
    errorMessage.value = error?.data?.statusMessage || error?.message || 'Не удалось загрузить admin overview'
  } finally {
    pending.value = false
  }
})
</script>
