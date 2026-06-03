<template>
  <div v-if="pending" class="text-sm text-gray-500">Загрузка…</div>
  <div v-else-if="!venue" class="text-sm text-gray-500">Место не найдено.</div>
  <article v-else class="space-y-8">
    <NuxtLink :to="`${cityBasePath}/venues`" class="text-sm text-primary hover:underline">← Места</NuxtLink>
    <h1 class="text-2xl font-bold text-gray-900">{{ venue.title }}</h1>
    <p v-if="venue.address" class="text-sm text-gray-600">{{ venue.address }}</p>
    <p v-if="venue.description" class="text-gray-700">{{ venue.description }}</p>
    <p v-if="venue.editorial_quote" class="italic text-gray-600">«{{ venue.editorial_quote }}»</p>
    <a
      v-if="venue.phone"
      :href="`tel:${venue.phone}`"
      class="inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary"
    >
      Позвонить
    </a>

    <section v-if="editorialItems.length">
      <h2 class="text-lg font-semibold text-gray-900">Упоминания в статьях</h2>
      <div class="mt-4 space-y-4">
        <NuxtLink
          v-for="post in editorialItems"
          :key="post.id"
          :to="`${cityBasePath}/guides/${post.slug}`"
          class="group block rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-primary/30"
        >
          <h3 class="text-base font-semibold text-gray-900 group-hover:text-primary">{{ post.title }}</h3>
          <p v-if="post.excerpt" class="mt-2 text-sm text-gray-600">{{ post.excerpt }}</p>
        </NuxtLink>
      </div>
    </section>

    <section>
      <h2 class="text-lg font-semibold text-gray-900">События здесь</h2>
      <div v-if="upcomingEvents.length" class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <CityEventCard
          v-for="ev in upcomingEvents"
          :key="ev.id"
          :event="ev"
          :sale-mode="ev.saleMode"
          :cta="ev.cta"
        />
      </div>
      <p v-else class="mt-4 text-sm text-gray-500">Пока нет предстоящих событий в этом месте.</p>
    </section>
  </article>
</template>

<script setup lang="ts">
import type { EventCta, EventSaleMode } from '~/types/storefront'

definePageMeta({ layout: 'city' })

type UpcomingEvent = {
  id: string
  slug: string
  title: string
  starts_at: string
  price?: number
  description?: string | null
  excerpt?: string | null
  cover_media_url?: string | null
  series_date_count?: number
  saleMode?: EventSaleMode
  cta?: EventCta
}

const route = useRoute()
const { slug: citySlug, cityBasePath } = useCity()
const venueSlug = computed(() => String(route.params.slug || ''))

type EditorialItem = {
  id: string
  slug: string
  title: string
  excerpt?: string | null
}

const pending = ref(true)
const venue = ref<Record<string, any> | null>(null)
const upcomingEvents = ref<UpcomingEvent[]>([])
const editorialItems = ref<EditorialItem[]>([])

watch([citySlug, venueSlug], async () => {
  pending.value = true
  try {
    const [detailRes, editorialRes] = await Promise.all([
      $fetch<{
        ok: boolean
        venue?: Record<string, any>
        upcomingEvents?: UpcomingEvent[]
      }>(`/api/cities/${citySlug.value}/venues/${venueSlug.value}`),
      $fetch<{ ok: boolean; items?: EditorialItem[] }>(
        `/api/cities/${citySlug.value}/venues/${venueSlug.value}/editorial`,
      ).catch(() => ({ ok: false, items: [] })),
    ])
    venue.value = detailRes?.venue ?? null
    upcomingEvents.value = detailRes?.upcomingEvents ?? []
    editorialItems.value = editorialRes?.items ?? []
  } catch {
    venue.value = null
    upcomingEvents.value = []
    editorialItems.value = []
  } finally {
    pending.value = false
  }
}, { immediate: true })
</script>
