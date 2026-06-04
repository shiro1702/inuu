<template>
  <div v-if="pending" class="text-sm text-gray-500">Загрузка…</div>
  <div v-else-if="!list" class="text-sm text-gray-500">Подборка не найдена.</div>
  <div v-else class="space-y-6">
    <NuxtLink :to="cityBasePath" class="text-sm text-primary hover:underline">← {{ displayName }}</NuxtLink>
    <header>
      <h1 class="text-2xl font-bold text-gray-900">{{ list.title }}</h1>
      <p v-if="list.description" class="mt-2 text-sm text-gray-600">{{ list.description }}</p>
      <div v-if="topicTagChips.length" class="mt-4 flex flex-wrap gap-2">
        <NuxtLink
          v-for="tag in topicTagChips"
          :key="tag.slug"
          :to="`${cityBasePath}/tag/${tag.slug}`"
          class="inline-flex shrink-0 items-center rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:border-indigo-200 hover:text-indigo-800"
        >
          {{ tag.name }}
        </NuxtLink>
      </div>
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
  list?: { title: string; description?: string | null; topic_tags?: string[] }
  items?: ListItem[]
}

const { data, pending } = await useFetch<ListResponse>(
  () => `/api/cities/${citySlug.value}/lists/${listSlug.value}`,
  { watch: [citySlug, listSlug] },
)

const list = computed(() => data.value?.list ?? null)
const items = computed(() => data.value?.items ?? [])

const { data: tagsCatalog } = await useFetch<{ ok: boolean; items?: Array<{ slug: string; name: string }> }>(
  () => `/api/cities/${citySlug.value}/content-tags?scope=lists`,
  { watch: [citySlug] },
)

const tagNameBySlug = computed(() => {
  const map = new Map<string, string>()
  for (const tag of tagsCatalog.value?.items ?? []) {
    map.set(String(tag.slug).toLowerCase(), tag.name)
  }
  return map
})

const topicTagChips = computed(() => {
  const slugs = list.value?.topic_tags ?? []
  return slugs.map((slug) => ({
    slug,
    name: tagNameBySlug.value.get(String(slug).toLowerCase()) || slug,
  }))
})

useHead({
  title: () => (list.value?.title ? `${list.value.title} — ${displayName.value}` : `Подборка — ${displayName.value}`),
})
</script>
