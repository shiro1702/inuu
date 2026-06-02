<template>
  <div v-if="pending" class="text-sm text-gray-500">Загрузка…</div>
  <div v-else-if="!event" class="text-sm text-gray-500">Событие не найдено.</div>
  <article v-else class="mx-auto max-w-3xl space-y-6">
    <NuxtLink :to="`${cityBasePath}/events`" class="text-sm text-primary hover:underline">← Афиша</NuxtLink>

    <CityEventMediaCarousel :urls="mediaGallery" :alt="event.title" />

    <header class="space-y-3">
      <div class="flex flex-wrap items-center gap-2">
        <NuxtLink
          v-if="category"
          :to="`${cityBasePath}/events?category=${category.slug}`"
          class="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200"
        >
          {{ category.name }}
        </NuxtLink>
        <NuxtLink
          v-for="tag in tags"
          :key="tag.slug"
          :to="`${cityBasePath}/tag/${tag.slug}`"
          class="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-800 hover:border-primary/40 hover:bg-indigo-100"
        >
          #{{ tag.name }}
        </NuxtLink>
      </div>

      <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">{{ event.title }}</h1>

      <p class="text-base text-gray-600">{{ formattedMainDate }}</p>

      <p v-if="venue" class="text-sm text-gray-500">
        📍
        <NuxtLink
          :to="`${cityBasePath}/venues/${venue.slug}`"
          class="font-medium text-primary hover:underline"
        >
          {{ venue.title }}
        </NuxtLink>
        <span v-if="venue.address"> · {{ venue.address }}</span>
      </p>

      <p v-else-if="sourceDisplay" class="text-sm text-gray-500">
        Источник:
        <a
          v-if="sourceDisplay.url"
          :href="sourceDisplay.url"
          target="_blank"
          rel="noopener noreferrer"
          class="font-medium text-primary hover:underline"
        >
          {{ sourceDisplay.label }}
        </a>
        <span v-else>{{ sourceDisplay.label }}</span>
      </p>

      <p class="text-lg font-semibold" :class="event.price > 0 ? 'text-gray-900' : 'text-emerald-700'">
        {{ priceLabel }}
      </p>
    </header>

    <section
      v-if="organization"
      class="rounded-xl border border-gray-200 bg-gray-50 p-4"
    >
      <p class="text-xs font-medium uppercase tracking-wide text-gray-500">Организатор</p>
      <NuxtLink
        :to="organizationPageUrl"
        class="mt-2 flex flex-wrap items-center justify-between gap-2 group"
      >
        <span class="text-base font-semibold text-gray-900 group-hover:text-primary">
          {{ organization.name }}
        </span>
        <span class="text-sm font-medium text-primary group-hover:underline">
          Все события →
        </span>
      </NuxtLink>
    </section>

    <EventSeriesDatePicker v-if="seriesSessions.length > 1" :sessions="seriesSessions" />

    <div v-if="cta?.url" class="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
      <a
        :href="cta.url"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold shadow-sm transition"
        :class="ctaButtonClass"
      >
        {{ cta.emoji }} {{ cta.label }}
      </a>
    </div>

    <section v-if="fullDescription" class="prose prose-gray max-w-none">
      <h2 class="text-lg font-semibold text-gray-900">О событии</h2>
      <p class="mt-3 whitespace-pre-line text-base leading-relaxed text-gray-700">{{ fullDescription }}</p>
    </section>

    <section v-if="similarEvents.length" class="border-t border-gray-200 pt-8">
      <h2 class="text-lg font-semibold text-gray-900">Похожие события</h2>
      <div class="mt-4 grid gap-4 sm:grid-cols-2">
        <CityEventCard
          v-for="item in similarEvents"
          :key="item.id"
          :event="item"
          :sale-mode="item.saleMode"
          :cta="item.cta"
        />
      </div>
    </section>
  </article>
</template>

<script setup lang="ts">
import type { EventCta, EventSaleMode, SourceDisplay, StorefrontOrganization, StorefrontVenue } from '~/types/storefront'

definePageMeta({ layout: 'city' })

type SeriesSession = {
  slug: string
  starts_at: string
  isCurrent: boolean
}

type SimilarEvent = {
  id: string
  slug: string
  title: string
  starts_at: string
  price?: number
  cover_media_url?: string | null
  excerpt?: string | null
  saleMode?: EventSaleMode
  cta?: EventCta
}

const route = useRoute()
const { slug: citySlug, cityBasePath } = useCity()
const eventSlug = computed(() => String(route.params.slug || ''))

const pending = ref(true)
const event = ref<Record<string, any> | null>(null)
const mediaGallery = ref<string[]>([])
const tags = ref<Array<{ slug: string; name: string }>>([])
const category = ref<{ slug: string; name: string } | null>(null)
const seriesSessions = ref<SeriesSession[]>([])
const similarEvents = ref<SimilarEvent[]>([])
const organization = ref<StorefrontOrganization | null>(null)
const venue = ref<StorefrontVenue | null>(null)
const sourceDisplay = ref<SourceDisplay | null>(null)
const saleMode = ref<EventSaleMode>('native')
const cta = ref<EventCta | null>(null)

const formattedMainDate = computed(() => formatDateTime(event.value?.starts_at))

const organizationPageUrl = computed(
  () => `${cityBasePath.value}/organizations/${organization.value?.slug || ''}`,
)

const fullDescription = computed(() => String(event.value?.description || '').trim())

const priceLabel = computed(() => {
  if (!event.value) return ''
  return event.value.price > 0 ? `от ${event.value.price} ₽` : 'Вход бесплатный'
})

const ctaButtonClass = computed(() => {
  if (saleMode.value === 'parsed') {
    return 'border border-gray-300 bg-white text-gray-800 hover:bg-gray-50'
  }
  return 'bg-primary text-white hover:opacity-90'
})

function formatDateTime(value: string | undefined | null) {
  if (!value) return ''
  try {
    return new Intl.DateTimeFormat('ru-RU', {
      dateStyle: 'full',
      timeStyle: 'short',
    }).format(new Date(value))
  } catch {
    return ''
  }
}

watch([citySlug, eventSlug], async () => {
  pending.value = true
  try {
    const res = await $fetch<{
      ok: boolean
      event?: Record<string, any>
      mediaGallery?: string[]
      tags?: Array<{ slug: string; name: string }>
      category?: { slug: string; name: string } | null
      seriesSessions?: SeriesSession[]
      similarEvents?: SimilarEvent[]
      organization?: StorefrontOrganization | null
      venue?: StorefrontVenue | null
      sourceDisplay?: SourceDisplay | null
      saleMode?: EventSaleMode
      cta?: EventCta
    }>(`/api/cities/${citySlug.value}/events/${eventSlug.value}`)

    event.value = res?.event ?? null
    mediaGallery.value = res?.mediaGallery ?? []
    tags.value = res?.tags ?? []
    category.value = res?.category ?? null
    seriesSessions.value = res?.seriesSessions ?? []
    similarEvents.value = res?.similarEvents ?? []
    organization.value = res?.organization ?? null
    venue.value = res?.venue ?? null
    sourceDisplay.value = res?.sourceDisplay ?? null
    saleMode.value = res?.saleMode ?? 'native'
    cta.value = res?.cta ?? null
  } catch {
    event.value = null
    mediaGallery.value = []
    tags.value = []
    category.value = null
    seriesSessions.value = []
    similarEvents.value = []
    organization.value = null
    venue.value = null
    sourceDisplay.value = null
    cta.value = null
  } finally {
    pending.value = false
  }
}, { immediate: true })

useHead({
  title: () => (event.value?.title ? String(event.value.title) : 'Событие'),
})
</script>
