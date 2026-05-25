<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900">Афиша</h1>
    <p class="mt-2 text-sm text-gray-600">События в {{ displayName }}</p>
    <div v-if="pending" class="mt-8 text-sm text-gray-500">Загрузка…</div>
    <div v-else-if="items.length" class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <CityEventCard v-for="event in items" :key="event.id" :event="event" />
    </div>
    <p v-else class="mt-8 text-sm text-gray-500">Пока нет опубликованных событий.</p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'city' })

const { slug, displayName } = useCity()
const pending = ref(true)
const items = ref<Array<Record<string, any>>>([])

watch(slug, async () => {
  pending.value = true
  try {
    const res = await $fetch<{ ok: boolean; items?: Array<Record<string, any>> }>(
      `/api/cities/${slug.value}/events`,
    )
    items.value = res?.items ?? []
  } finally {
    pending.value = false
  }
}, { immediate: true })

useHead({ title: () => `Афиша — ${displayName.value}` })
</script>
