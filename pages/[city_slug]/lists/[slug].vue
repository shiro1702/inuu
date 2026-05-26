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

type ListItem =
  | { entityType: 'venue'; note: string | null; venue: Record<string, unknown> }
  | { entityType: 'event'; note: string | null; event: Record<string, unknown> }

type ListResponse = {
  ok: boolean
  list?: { title: string; description?: string | null }
  items?: ListItem[]
}

const { data, pending } = await useFetch<ListResponse>(
  () => `/api/cities/${citySlug.value}/lists/${listSlug.value}`,
  { watch: [citySlug, listSlug] },
)

const list = computed(() => data.value?.list ?? null)
const items = computed(() => data.value?.items ?? [])

useHead({
  title: () => (list.value?.title ? `${list.value.title} — ${displayName.value}` : `Подборка — ${displayName.value}`),
})
</script>
