<template>
  <div class="space-y-6">
    <header class="space-y-2">
      <h1 class="text-2xl font-bold text-gray-900">Карусель для соцсетей</h1>
      <p class="text-sm text-gray-600">
        Редактор слайдов Cover → Body → Outro, превью и экспорт PNG (4:5 или 9:16).
      </p>
    </header>

    <div v-if="loadingCities" class="text-sm text-gray-500">Загрузка городов…</div>
    <div v-else class="flex flex-wrap items-end gap-4">
      <label class="space-y-1 text-sm">
        <span class="font-medium text-gray-700">Город</span>
        <select v-model="selectedCitySlug" class="rounded-lg border border-gray-300 px-3 py-2" @change="onCityChange">
          <option v-for="c in managerCities" :key="c.citySlug" :value="c.citySlug">
            {{ c.cityName }}
          </option>
        </select>
      </label>
      <label class="space-y-1 text-sm">
        <span class="font-medium text-gray-700">Источник</span>
        <select
          v-model="sourceKind"
          class="rounded-lg border border-gray-300 px-3 py-2"
          :disabled="Boolean(postId || submissionId)"
          @change="onSourceChange"
        >
          <option value="manual">Вручную</option>
          <option value="events">События (выбор вручную)</option>
          <option value="curated_list">Подборка</option>
          <option v-if="postId" value="article">Из статьи</option>
          <option v-if="submissionId" value="submission">Из черновика заявки</option>
        </select>
      </label>
      <p v-if="contextHint" class="text-sm text-gray-600">{{ contextHint }}</p>
      <p v-else-if="sourceHint" class="text-sm text-gray-600">{{ sourceHint }}</p>
    </div>

    <CarouselEventPicker
      v-if="selectedCitySlug && (sourceKind === 'events' || sourceKind === 'curated_list')"
      :city-slug="selectedCitySlug"
      :mode="sourceKind === 'curated_list' ? 'curated_list' : 'events'"
      :cover-title="eventsCoverTitle"
      :timezone="cityTimezone"
      @update:cover-title="eventsCoverTitle = $event"
      @build="onPickerBuild"
    />

    <div v-if="loadError" class="text-sm text-red-600">{{ loadError }}</div>
    <CarouselStudio
      v-else-if="selectedCitySlug"
      :key="studioKey"
      :city-slug="selectedCitySlug"
      :brand-name="selectedCityName"
      :post-id="postId"
      :submission-id="submissionId"
      :initial-carousel="initialCarousel"
      :default-link-hint="defaultLinkHint"
    />
  </div>
</template>

<script setup lang="ts">
import type { EditorialCarouselMetadata } from '~/types/editorialCarousel'
import CarouselStudio from '~/components/editorial/CarouselStudio.vue'
import CarouselEventPicker, { type PickerMaterialItem } from '~/components/editorial/CarouselEventPicker.vue'
import { buildEditorialCarouselMetadata } from '~/utils/parseInstagramCarousel'
import {
  buildCarouselFromEvents,
  carouselLinkHintForCity,
  type CarouselEventInput,
} from '~/utils/buildCarouselFromEvents'
import { resolveCarouselGradientFromTags } from '~/utils/carouselVibeTheme'

definePageMeta({ layout: 'dashboard' })

type ManagerCityItem = { citySlug: string; cityName: string }
type SourceKind = 'manual' | 'events' | 'curated_list' | 'article' | 'submission'

const route = useRoute()
const managerCities = ref<ManagerCityItem[]>([])
const selectedCitySlug = ref('')
const loadingCities = ref(true)
const loadError = ref('')
const initialCarousel = ref<EditorialCarouselMetadata | null>(null)
const contextHint = ref('')
const sourceKind = ref<SourceKind>('manual')
const eventsCoverTitle = ref('')
const cityTimezone = ref('Asia/Irkutsk')
const activeListSlug = ref('')
const studioKey = ref('manual-0')

const postId = computed(() => String(route.query.post || '').trim())
const submissionId = computed(() => String(route.query.submission || '').trim())

const selectedCityName = computed(
  () => managerCities.value.find((c) => c.citySlug === selectedCitySlug.value)?.cityName || 'INUU',
)

const defaultEventsCoverTitle = computed(
  () => `Афиша ${selectedCityName.value}`,
)

const defaultLinkHint = computed(() => {
  const city = selectedCitySlug.value
  if (!city) return null
  if (sourceKind.value === 'curated_list' && activeListSlug.value) {
    return carouselLinkHintForCity(city, 'list', activeListSlug.value)
  }
  if (sourceKind.value === 'events' || sourceKind.value === 'curated_list') {
    return carouselLinkHintForCity(city, 'events')
  }
  if (postSlug.value) return `/${city}/guides/${postSlug.value}`
  return carouselLinkHintForCity(city, 'home')
})

const sourceHint = computed(() => {
  if (sourceKind.value === 'events') {
    return 'Отметьте события и соберите карусель. Вайбы — теги группы «Вайб и атмосфера». Лишние слайды можно удалить в редакторе.'
  }
  if (sourceKind.value === 'curated_list') {
    return 'Выберите опубликованную подборку — события из неё попадут в карусель (можно снять галочки).'
  }
  if (sourceKind.value === 'manual') {
    return 'Пустой шаблон: обложка, один body и outro — дополняйте вручную.'
  }
  return ''
})

const postSlug = ref('')

function bumpStudioKey() {
  studioKey.value = `${sourceKind.value}-${Date.now()}`
}

function pickerEventsToInput(events: PickerMaterialItem[]): CarouselEventInput[] {
  return events.map((item) => ({
    id: item.id,
    entityType: item.entityType,
    title: item.title,
    slug: item.slug,
    startsAt: item.startsAt,
    excerpt: item.excerpt,
    tldr: item.tldr,
    coverMediaUrl: item.coverMediaUrl,
    price: item.price,
    currency: item.currency,
    venueTitle: item.venueTitle,
    address: item.address,
    vibeEmoji: item.vibeEmoji,
    topicTags: item.topicTags,
    listNote: item.listNote,
  }))
}

function onPickerBuild(payload: {
  events: PickerMaterialItem[]
  coverTitle: string
  listSlug?: string
  listTitle?: string
}) {
  loadError.value = ''
  const city = selectedCitySlug.value
  if (!city) return

  const events = pickerEventsToInput(payload.events)
  const allTags = [
    ...events.flatMap((e) => e.topicTags || []),
  ]
  const gradient = resolveCarouselGradientFromTags(allTags)

  eventsCoverTitle.value = payload.coverTitle || defaultEventsCoverTitle.value
  activeListSlug.value = payload.listSlug?.trim() || ''

    initialCarousel.value = buildCarouselFromEvents({
      events,
      citySlug: city,
      cityName: selectedCityName.value,
      timezone: cityTimezone.value,
      coverTitle: eventsCoverTitle.value,
      vibe: gradient,
    })

  contextHint.value = payload.listTitle
    ? `Подборка «${payload.listTitle}»: ${events.length} слайдов`
    : `Собрано из ${events.length} событий`

  bumpStudioKey()
}

async function loadManagerCities() {
  loadingCities.value = true
  try {
    const res = await $fetch<{ ok: boolean; items?: ManagerCityItem[] }>('/api/dashboard/manager/cities')
    managerCities.value = res?.ok && res.items?.length ? res.items : []
    const fromQuery = String(route.query.city || '').trim()
    if (fromQuery && managerCities.value.some((c) => c.citySlug === fromQuery)) {
      selectedCitySlug.value = fromQuery
    } else if (managerCities.value[0]) {
      selectedCitySlug.value = managerCities.value[0].citySlug
    }
    if (!eventsCoverTitle.value) {
      eventsCoverTitle.value = defaultEventsCoverTitle.value
    }
  } catch {
    managerCities.value = []
  } finally {
    loadingCities.value = false
  }
}

async function loadCityTimezone() {
  const city = selectedCitySlug.value
  if (!city) return
  try {
    const res = await $fetch<{ ok: boolean; timezone?: string }>(
      `/api/dashboard/manager/cities/${city}/events`,
      { query: { limit: 1 } },
    )
    if (res?.timezone) cityTimezone.value = res.timezone
  } catch {
    cityTimezone.value = 'Asia/Irkutsk'
  }
}

async function loadContext() {
  loadError.value = ''
  if (sourceKind.value === 'manual' || sourceKind.value === 'events' || sourceKind.value === 'curated_list') {
    if (sourceKind.value === 'manual') {
      initialCarousel.value = null
      contextHint.value = ''
      activeListSlug.value = ''
      bumpStudioKey()
    }
    return
  }

  initialCarousel.value = null
  contextHint.value = ''
  activeListSlug.value = ''
  const city = selectedCitySlug.value
  if (!city) return

  try {
    if (postId.value && sourceKind.value === 'article') {
      const res = await $fetch<{
        ok: boolean
        item?: { slug: string; title: string; metadata?: Record<string, unknown> }
      }>(`/api/dashboard/manager/cities/${city}/editorial-news/${postId.value}`)
      if (res?.item) {
        postSlug.value = res.item.slug
        const raw = res.item.metadata?.carousel
        if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
          initialCarousel.value = raw as EditorialCarouselMetadata
        }
        contextHint.value = `Статья: ${res.item.title}`
        bumpStudioKey()
      }
      return
    }

    if (submissionId.value && sourceKind.value === 'submission') {
      const res = await $fetch<{
        ok: boolean
        items?: Array<{ id: string; payload?: Record<string, unknown> }>
      }>(`/api/dashboard/manager/cities/${city}/content-queue?status=all&limit=200`)
      const row = res?.items?.find((i) => i.id === submissionId.value)
      const payload = row?.payload
      if (payload) {
        const prebuilt = payload.carousel_metadata
        if (prebuilt && typeof prebuilt === 'object') {
          initialCarousel.value = prebuilt as EditorialCarouselMetadata
        } else {
          const pack = payload.content_pack as { instagram_carousel?: string } | undefined
          if (pack?.instagram_carousel) {
            const mediaUrls = [
              typeof payload.cover_media_url === 'string' ? payload.cover_media_url : '',
              ...(Array.isArray(payload.media_urls)
                ? payload.media_urls.map((x: unknown) => String(x || ''))
                : []),
            ].map((x) => x.trim()).filter(Boolean)
            initialCarousel.value = buildEditorialCarouselMetadata({
              instagramCarousel: pack.instagram_carousel,
              coverMediaUrl: mediaUrls[0] || null,
              mediaUrls,
              topicTags: Array.isArray(payload.topic_tags)
                ? payload.topic_tags.map(String)
                : [],
              fallback: {
                title: typeof payload.title === 'string' ? payload.title : undefined,
                descriptionShort:
                  typeof payload.description_short === 'string'
                    ? payload.description_short
                    : undefined,
              },
            })
          }
        }
        contextHint.value = `Черновик заявки ${submissionId.value.slice(0, 8)}…`
        bumpStudioKey()
      }
    }
  } catch (err: unknown) {
    loadError.value = err instanceof Error ? err.message : 'Не удалось загрузить данные'
  }
}

function onCityChange() {
  eventsCoverTitle.value = defaultEventsCoverTitle.value
  activeListSlug.value = ''
  void loadCityTimezone()
  if (sourceKind.value === 'events' || sourceKind.value === 'curated_list') {
    initialCarousel.value = null
    contextHint.value = ''
    bumpStudioKey()
    return
  }
  void loadContext()
}

function onSourceChange() {
  loadError.value = ''
  activeListSlug.value = ''
  if (sourceKind.value === 'events' || sourceKind.value === 'curated_list') {
    if (!eventsCoverTitle.value) eventsCoverTitle.value = defaultEventsCoverTitle.value
    initialCarousel.value = null
    contextHint.value = ''
    bumpStudioKey()
    return
  }
  void loadContext()
}

watch([selectedCitySlug, postId, submissionId], () => {
  if (!selectedCitySlug.value) return
  void loadCityTimezone()
  if (sourceKind.value === 'events' || sourceKind.value === 'curated_list') return
  if (sourceKind.value !== 'manual') void loadContext()
})

watch(defaultEventsCoverTitle, (title) => {
  if ((sourceKind.value === 'events' || sourceKind.value === 'curated_list') && !eventsCoverTitle.value.trim()) {
    eventsCoverTitle.value = title
  }
})

onMounted(async () => {
  if (postId.value) sourceKind.value = 'article'
  else if (submissionId.value) sourceKind.value = 'submission'

  await loadManagerCities()
  await loadCityTimezone()
  if (sourceKind.value !== 'events' && sourceKind.value !== 'curated_list') {
    await loadContext()
  }
})
</script>
