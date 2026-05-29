<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900">Афиша</h1>
    <p class="mt-2 text-sm text-gray-600">События в {{ displayName }}</p>

    <div class="mt-6 space-y-4">
      <div>
        <p class="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">Когда</p>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="preset in datePresets"
            :key="preset.id"
            type="button"
            class="rounded-full px-3 py-1.5 text-sm font-medium transition"
            :class="activeDatePreset === preset.id
              ? 'bg-primary text-white'
              : 'border border-gray-200 bg-white text-gray-700 hover:border-primary/30 hover:text-primary'"
            @click="setDatePreset(preset.id)"
          >
            {{ preset.label }}
          </button>
        </div>
      </div>

      <div v-if="tags.length">
        <div class="mb-2 flex flex-wrap items-center justify-between gap-2">
          <p class="text-xs font-medium uppercase tracking-wide text-gray-500">Теги</p>
          <p v-if="tagFilters.length > 1" class="text-xs text-gray-400">показаны события с любым из выбранных</p>
        </div>
        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            class="rounded-full px-3 py-1.5 text-sm font-medium transition"
            :class="!tagFilters.length
              ? 'bg-indigo-100 text-indigo-800 ring-1 ring-indigo-200'
              : 'border border-gray-200 bg-white text-gray-700 hover:border-indigo-200 hover:text-indigo-800'"
            @click="clearTagFilters"
          >
            Все
          </button>
          <button
            v-for="tag in tags"
            :key="tag.slug"
            type="button"
            class="inline-flex items-center gap-1.5 rounded-full py-1.5 pl-3 pr-2 text-sm font-medium transition"
            :class="isTagActive(tag.slug)
              ? 'bg-indigo-100 text-indigo-800 ring-1 ring-indigo-200'
              : 'border border-gray-200 bg-white text-gray-700 hover:border-indigo-200 hover:text-indigo-800'"
            @click="toggleTag(tag.slug)"
          >
            <span>#{{ tag.name }}</span>
            <span
              class="inline-flex h-4 w-4 items-center justify-center text-base leading-none transition-transform duration-150"
              :class="isTagActive(tag.slug) ? 'rotate-45' : ''"
              aria-hidden="true"
            >+</span>
          </button>
        </div>

        <div v-if="tagFilters.length" class="mt-3 flex flex-wrap items-center gap-3">
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="subscribePending || subscribedToSelection"
            @click="onSubscribeClick"
          >
            <span v-if="subscribePending">Сохраняем…</span>
            <span v-else-if="subscribedToSelection">Вы подписаны на эти теги</span>
            <span v-else>Получать подборку в боте</span>
          </button>
          <p v-if="subscribeMessage" class="text-sm text-emerald-700">{{ subscribeMessage }}</p>
          <p v-else-if="subscribeError" class="text-sm text-red-600">{{ subscribeError }}</p>
        </div>
      </div>
    </div>

    <div v-if="pending" class="mt-8 text-sm text-gray-500">Загрузка…</div>
    <div v-else-if="items.length" class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <CityEventCard v-for="event in items" :key="event.id" :event="event" />
    </div>
    <p v-else class="mt-8 text-sm text-gray-500">Пока нет событий по выбранным фильтрам.</p>
  </div>
</template>

<script setup lang="ts">
import {
  addCalendarDays,
  formatZonedIsoDate,
  getWeekRangeIsoDates,
} from '~/utils/eventDateFilters'
import { parseTagSlugsFromQuery } from '~/utils/eventListDisplay'

definePageMeta({ layout: 'city' })

type TagItem = { slug: string; name: string }
type DatePresetId = 'all' | 'today' | 'tomorrow' | 'week'

const route = useRoute()
const router = useRouter()
const user = useSupabaseUser()
const { slug, displayName, city } = useCity()
const { messengerInitData, buildMessengerAuthHeaders, isMessengerMiniApp } = useTelegram()

const pending = ref(true)
const items = ref<Array<Record<string, any>>>([])
const tags = ref<TagItem[]>([])
const subscribedToSelection = ref(false)
const subscribePending = ref(false)
const subscribeMessage = ref('')
const subscribeError = ref('')

const categoryFilter = computed(() => {
  const q = route.query.category
  return typeof q === 'string' ? q : ''
})

const tagFilters = computed(() => parseTagSlugsFromQuery(route.query.tag))

const dateFrom = computed(() => {
  const q = route.query.from
  return typeof q === 'string' ? q.slice(0, 10) : ''
})

const dateTo = computed(() => {
  const q = route.query.to
  return typeof q === 'string' ? q.slice(0, 10) : ''
})

const timezone = computed(() => city.value?.timezone || 'Asia/Irkutsk')

const isAuthenticated = computed(() => !!user.value || !!messengerInitData.value)

const datePresets = [
  { id: 'all' as const, label: 'Все' },
  { id: 'today' as const, label: 'Сегодня' },
  { id: 'tomorrow' as const, label: 'Завтра' },
  { id: 'week' as const, label: 'На неделе' },
]

const activeDatePreset = computed((): DatePresetId => {
  if (!dateFrom.value && !dateTo.value) return 'all'
  const today = formatZonedIsoDate(new Date(), timezone.value)
  const tomorrow = addCalendarDays(today, 1)
  const week = getWeekRangeIsoDates(new Date(), timezone.value)
  if (dateFrom.value === today && dateTo.value === today) return 'today'
  if (dateFrom.value === tomorrow && dateTo.value === tomorrow) return 'tomorrow'
  if (dateFrom.value === week.from && dateTo.value === week.to) return 'week'
  return 'all'
})

function routeQueryBase(): Record<string, string | string[]> {
  const next: Record<string, string | string[]> = {}
  for (const [key, value] of Object.entries(route.query)) {
    if (key === 'tag') continue
    if (typeof value === 'string') next[key] = value
    else if (Array.isArray(value)) next[key] = value.filter((v): v is string => typeof v === 'string')
  }
  return next
}

function buildQueryPatch(patch: Record<string, string | undefined>) {
  const next = routeQueryBase()
  for (const [key, value] of Object.entries(patch)) {
    if (value) next[key] = value
    else delete next[key]
  }
  return next
}

function isTagActive(slug: string) {
  return tagFilters.value.includes(slug)
}

function toggleTag(slug: string) {
  subscribeMessage.value = ''
  subscribeError.value = ''
  const nextTags = isTagActive(slug)
    ? tagFilters.value.filter((t) => t !== slug)
    : [...tagFilters.value, slug]

  const query = routeQueryBase()
  if (nextTags.length) query.tag = nextTags
  void router.replace({ query })
}

function clearTagFilters() {
  subscribeMessage.value = ''
  subscribeError.value = ''
  void router.replace({ query: routeQueryBase() })
}

function setDatePreset(preset: DatePresetId) {
  const today = formatZonedIsoDate(new Date(), timezone.value)
  let patch: Record<string, string | undefined> = { from: undefined, to: undefined }

  if (preset === 'today') {
    patch = { from: today, to: today }
  } else if (preset === 'tomorrow') {
    const tomorrow = addCalendarDays(today, 1)
    patch = { from: tomorrow, to: tomorrow }
  } else if (preset === 'week') {
    const week = getWeekRangeIsoDates(new Date(), timezone.value)
    patch = { from: week.from, to: week.to }
  }

  void router.replace({ query: buildQueryPatch(patch) })
}

function buildEventsQuery() {
  const params = new URLSearchParams()
  if (categoryFilter.value) params.set('category', categoryFilter.value)
  for (const tag of tagFilters.value) params.append('tag', tag)
  if (dateFrom.value) params.set('from', dateFrom.value)
  if (dateTo.value) params.set('to', dateTo.value)
  const qs = params.toString()
  return qs ? `?${qs}` : ''
}

function buildSubscriptionQuery() {
  const params = new URLSearchParams()
  for (const tag of tagFilters.value) params.append('tag', tag)
  const qs = params.toString()
  return qs ? `?${qs}` : ''
}

async function loadTags() {
  try {
    const res = await $fetch<{ ok: boolean; items?: TagItem[] }>(
      `/api/cities/${slug.value}/content-tags`,
    )
    tags.value = res?.items ?? []
  } catch {
    tags.value = []
  }
}

async function loadSubscriptionState() {
  subscribedToSelection.value = false
  if (!tagFilters.value.length || !isAuthenticated.value) return

  try {
    const res = await $fetch<{
      ok: boolean
      authenticated?: boolean
      subscribedToSelection?: boolean
    }>(`/api/cities/${slug.value}/subscriptions/tags${buildSubscriptionQuery()}`, {
      headers: buildMessengerAuthHeaders(),
    })
    subscribedToSelection.value = !!(res?.authenticated && res?.subscribedToSelection)
  } catch {
    subscribedToSelection.value = false
  }
}

async function onSubscribeClick() {
  subscribeMessage.value = ''
  subscribeError.value = ''

  if (!tagFilters.value.length) return

  if (!isAuthenticated.value) {
    void navigateTo(`/login?redirect=${encodeURIComponent(route.fullPath)}`)
    return
  }

  subscribePending.value = true
  try {
    const res = await $fetch<{
      ok: boolean
      message?: string
      subscribedToSelection?: boolean
    }>(`/api/cities/${slug.value}/subscriptions/tags`, {
      method: 'POST',
      body: { tags: tagFilters.value },
      headers: buildMessengerAuthHeaders(),
    })
    subscribedToSelection.value = !!res?.subscribedToSelection
    subscribeMessage.value = res?.message || 'Подписка сохранена'
  } catch (e: unknown) {
    const err = e as { data?: { statusMessage?: string }; statusMessage?: string; message?: string }
    subscribeError.value = err?.data?.statusMessage
      || err?.statusMessage
      || (e instanceof Error ? e.message : '')
      || 'Не удалось сохранить подписку'
  } finally {
    subscribePending.value = false
  }
}

watch([slug, categoryFilter, tagFilters, dateFrom, dateTo], async () => {
  pending.value = true
  try {
    const res = await $fetch<{ ok: boolean; items?: Array<Record<string, any>> }>(
      `/api/cities/${slug.value}/events${buildEventsQuery()}`,
    )
    items.value = res?.items ?? []
  } finally {
    pending.value = false
  }
}, { immediate: true })

watch([slug, tagFilters, isAuthenticated, messengerInitData], () => {
  void loadSubscriptionState()
}, { immediate: true })

watch(slug, () => {
  void loadTags()
}, { immediate: true })

useHead({ title: () => `Афиша — ${displayName.value}` })
</script>
