<template>
  <div v-if="pending" class="text-sm text-gray-500">Загрузка…</div>
  <div v-else-if="!event" class="text-sm text-gray-500">Событие не найдено.</div>
  <article v-else class="mx-auto max-w-3xl space-y-6">
    <NuxtLink :to="`${cityBasePath}/events`" class="text-sm text-primary hover:underline">← Афиша</NuxtLink>

    <EventMediaCarousel :urls="mediaGallery" :alt="event.title" />

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

      <p v-if="venueLine" class="text-sm text-gray-500">
        📍 {{ venueLine }}
      </p>
      <p v-if="organizationName" class="text-sm text-gray-500">
        Организатор: {{ organizationName }}
      </p>

      <p class="text-lg font-semibold" :class="event.price > 0 ? 'text-gray-900' : 'text-emerald-700'">
        {{ priceLabel }}
      </p>
    </header>

    <EventSeriesDatePicker v-if="seriesSessions.length > 1" :sessions="seriesSessions" />

    <div v-if="hasActionLinks" class="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
      <a
        v-if="links.registrationUrl"
        :href="links.registrationUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-90"
      >
        {{ registrationCta }}
      </a>
      <a
        v-if="links.sourceUrl"
        :href="links.sourceUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50"
      >
        Подробнее у организатора
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
        />
      </div>
    </section>
  </article>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'city' })

type SeriesSession = {
  slug: string
  starts_at: string
  isCurrent: boolean
}

const route = useRoute()
const { slug: citySlug, cityBasePath } = useCity()
const eventSlug = computed(() => String(route.params.slug || ''))

const pending = ref(true)
const event = ref<Record<string, any> | null>(null)
const mediaGallery = ref<string[]>([])
const tags = ref<Array<{ slug: string; name: string }>>([])
const category = ref<{ slug: string; name: string } | null>(null)
const links = ref<{ registrationUrl: string | null; sourceUrl: string | null }>({
  registrationUrl: null,
  sourceUrl: null,
})
const seriesSessions = ref<SeriesSession[]>([])
const similarEvents = ref<Array<Record<string, any>>>([])
const organizationName = ref<string | null>(null)

const formattedMainDate = computed(() => formatDateTime(event.value?.starts_at))

const venueLine = computed(() => {
  const v = event.value?.venues
  if (!v) return ''
  const parts = [v.title, v.address].filter(Boolean)
  return parts.join(' · ')
})

const fullDescription = computed(() => String(event.value?.description || '').trim())

const priceLabel = computed(() => {
  if (!event.value) return ''
  return event.value.price > 0 ? `от ${event.value.price} ₽` : 'Вход бесплатный'
})

const registrationCta = computed(() =>
  event.value?.price > 0 ? 'Купить билет' : 'Записаться',
)

const hasActionLinks = computed(() =>
  Boolean(links.value.registrationUrl || links.value.sourceUrl),
)

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
      links?: { registrationUrl: string | null; sourceUrl: string | null }
      seriesSessions?: SeriesSession[]
      similarEvents?: Array<Record<string, any>>
      organizationName?: string | null
    }>(`/api/cities/${citySlug.value}/events/${eventSlug.value}`)

    event.value = res?.event ?? null
    mediaGallery.value = res?.mediaGallery ?? []
    tags.value = res?.tags ?? []
    category.value = res?.category ?? null
    links.value = {
      registrationUrl: res?.links?.registrationUrl ?? null,
      sourceUrl: res?.links?.sourceUrl ?? null,
    }
    seriesSessions.value = res?.seriesSessions ?? []
    similarEvents.value = res?.similarEvents ?? []
    organizationName.value = res?.organizationName ?? null
  } catch {
    event.value = null
    mediaGallery.value = []
    tags.value = []
    category.value = null
    seriesSessions.value = []
    similarEvents.value = []
    organizationName.value = null
  } finally {
    pending.value = false
  }
}, { immediate: true })

useHead({
  title: () => (event.value?.title ? String(event.value.title) : 'Событие'),
})
</script>
