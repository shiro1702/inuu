<template>
  <div v-if="pending" class="text-sm text-gray-500">Загрузка…</div>
  <div v-else-if="!list" class="text-sm text-gray-500">Подборка не найдена.</div>
  <div v-else class="space-y-6">
    <NuxtLink :to="cityBasePath" class="text-sm text-primary hover:underline">← {{ displayName }}</NuxtLink>
    <header>
      <h1 class="text-2xl font-bold text-gray-900">{{ list.title }}</h1>
      <p v-if="list.description" class="mt-2 text-sm text-gray-600">{{ list.description }}</p>
    </header>

    <div v-if="items.length" class="space-y-8">
      <section v-for="(item, index) in items" :key="`${item.entityType}-${index}`">
        <p v-if="item.note" class="mb-2 text-sm italic text-gray-600">{{ item.note }}</p>
        <CityVenueCard v-if="item.entityType === 'venue'" :venue="item.venue" />
        <CityEventCard v-else-if="item.entityType === 'event'" :event="item.event" />
      </section>
    </div>
    <p v-else class="text-sm text-gray-500">В этой подборке пока нет мест и событий.</p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'city' })

const route = useRoute()
const { slug: citySlug, cityBasePath, displayName } = useCity()
const listSlug = computed(() => String(route.params.slug || ''))

const pending = ref(true)
const list = ref<{ title: string; description?: string | null } | null>(null)
const items = ref<
  Array<
    | { entityType: 'venue'; note: string | null; venue: Record<string, unknown> }
    | { entityType: 'event'; note: string | null; event: Record<string, unknown> }
  >
>([])

watch([citySlug, listSlug], async () => {
  pending.value = true
  try {
    const res = await $fetch<{
      ok: boolean
      list?: { title: string; description?: string | null }
      items?: typeof items.value
    }>(`/api/cities/${citySlug.value}/lists/${listSlug.value}`)
    list.value = res?.list ?? null
    items.value = res?.items ?? []
  } catch {
    list.value = null
    items.value = []
  } finally {
    pending.value = false
  }
}, { immediate: true })

useHead({
  title: () => (list.value?.title ? `${list.value.title} — ${displayName.value}` : `Подборка — ${displayName.value}`),
})
</script>
