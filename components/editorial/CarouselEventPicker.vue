<template>
  <section class="rounded-lg border border-gray-200 bg-gray-50/80 p-4 space-y-4">
    <div class="flex flex-wrap items-end gap-3">
      <label v-if="mode === 'curated_list'" class="space-y-1 text-sm min-w-[220px]">
        <span class="font-medium text-gray-700">Подборка</span>
        <select
          v-model="selectedListSlug"
          class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2"
          :disabled="loadingLists"
          @change="onListChange"
        >
          <option value="">— выберите —</option>
          <option v-for="list in curatedLists" :key="list.slug" :value="list.slug">
            {{ list.title }}
          </option>
        </select>
      </label>

      <template v-if="mode === 'events'">
        <div class="space-y-1 text-sm w-full">
          <span class="font-medium text-gray-700">Вайб (теги афиши)</span>
          <div class="flex flex-wrap gap-1.5">
            <button
              type="button"
              class="rounded-full px-3 py-1 text-xs font-medium transition"
              :class="!vibeTagFilters.length
                ? 'bg-primary text-white'
                : 'border border-gray-300 bg-white text-gray-700 hover:border-primary/40'"
              @click="vibeTagFilters = []"
            >
              Все
            </button>
            <button
              v-for="tag in vibeTags"
              :key="tag.slug"
              type="button"
              class="rounded-full px-3 py-1 text-xs font-medium transition"
              :class="vibeTagFilters.includes(tag.slug)
                ? 'bg-primary text-white'
                : 'border border-gray-300 bg-white text-gray-700 hover:border-primary/40'"
              @click="toggleVibeTag(tag.slug)"
            >
              {{ tag.name }}
            </button>
          </div>
        </div>
        <button
          type="button"
          class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
          :disabled="loadingPool"
          @click="loadEventPool"
        >
          {{ loadingPool ? 'Загрузка…' : 'Обновить список' }}
        </button>
      </template>

      <label class="space-y-1 text-sm min-w-[200px]">
        <span class="font-medium text-gray-700">Заголовок обложки</span>
        <input
          :value="coverTitle"
          type="text"
          class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2"
          @input="emit('update:coverTitle', ($event.target as HTMLInputElement).value)"
        >
      </label>
    </div>

    <div v-if="loadingPool || loadingLists" class="text-sm text-gray-500">Загрузка…</div>
    <p v-else-if="poolError" class="text-sm text-red-600">{{ poolError }}</p>
    <p v-else-if="!eventPool.length" class="text-sm text-gray-500">
      {{ mode === 'curated_list' ? 'В подборке нет опубликованных событий.' : 'Нет событий по фильтру.' }}
    </p>

    <div v-else class="space-y-2">
      <div class="flex flex-wrap items-center justify-between gap-2 text-sm">
        <span class="text-gray-600">
          Выбрано {{ selectedIds.size }} из {{ eventPool.length }}
        </span>
        <div class="flex gap-2">
          <button type="button" class="text-primary underline" @click="selectAll">Все</button>
          <button type="button" class="text-gray-600 underline" @click="selectNone">Снять</button>
        </div>
      </div>
      <ul class="max-h-64 space-y-1 overflow-y-auto rounded-lg border border-gray-200 bg-white p-2">
        <li v-for="ev in eventPool" :key="ev.id">
          <label class="flex cursor-pointer items-start gap-2 rounded-md px-2 py-1.5 hover:bg-gray-50">
            <input
              type="checkbox"
              class="mt-1"
              :checked="selectedIds.has(ev.id)"
              @change="toggleEvent(ev.id)"
            >
            <img
              v-if="ev.coverMediaUrl"
              :src="ev.coverMediaUrl"
              alt=""
              class="mt-0.5 h-12 w-12 shrink-0 rounded-md object-cover"
            >
            <span
              v-else
              class="mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-gray-200 text-[10px] text-gray-500"
            >
              нет фото
            </span>
            <span class="min-w-0 flex-1 text-sm">
              <span class="font-medium text-gray-900">
                <span v-if="ev.entityType === 'venue'" class="text-gray-500">Место · </span>
                {{ ev.title }}
              </span>
              <span v-if="ev.entityType === 'event'" class="mt-0.5 block text-xs text-gray-500">
                {{ formatDate(ev.startsAt) }}
              </span>
              <span v-if="ev.topicTags?.length" class="mt-0.5 block text-xs text-gray-400">
                {{ ev.topicTags.slice(0, 4).join(' · ') }}
              </span>
            </span>
          </label>
        </li>
      </ul>
      <button
        type="button"
        class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        :disabled="!selectedIds.size"
        @click="emitBuild"
      >
        Собрать карусель ({{ selectedIds.size }})
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { formatEventStartsAtRu } from '~/utils/formatEventStartsAtRu'

export type PickerMaterialItem = {
  id: string
  entityType: 'event' | 'venue'
  slug: string
  title: string
  startsAt: string | null
  excerpt?: string | null
  tldr?: string | null
  coverMediaUrl?: string | null
  sourceMetadata?: unknown
  source_metadata?: unknown
  price?: number | null
  currency?: string | null
  venueTitle?: string | null
  address?: string | null
  vibeEmoji?: string | null
  topicTags?: string[]
  listNote?: string | null
}

/** @deprecated */
export type PickerEventItem = PickerMaterialItem

type VibeTag = { slug: string; name: string; tagGroup?: string }
type CuratedListOption = { slug: string; title: string }

const props = defineProps<{
  citySlug: string
  mode: 'events' | 'curated_list'
  coverTitle: string
  timezone: string
}>()

const emit = defineEmits<{
  'update:coverTitle': [value: string]
  build: [payload: { events: PickerMaterialItem[]; coverTitle: string; listSlug?: string; listTitle?: string }]
}>()

function normalizePoolItem(raw: PickerMaterialItem): PickerMaterialItem {
  return {
    ...raw,
    entityType: raw.entityType === 'venue' ? 'venue' : 'event',
    coverMediaUrl: raw.coverMediaUrl || null,
    topicTags: raw.topicTags || [],
  }
}

const vibeTags = ref<VibeTag[]>([])
const vibeTagFilters = ref<string[]>([])
const eventPool = ref<PickerMaterialItem[]>([])
const selectedIds = ref(new Set<string>())
const loadingPool = ref(false)
const loadingLists = ref(false)
const poolError = ref('')
const curatedLists = ref<CuratedListOption[]>([])
const selectedListSlug = ref('')

function formatDate(startsAt: string | null) {
  return formatEventStartsAtRu(startsAt, props.timezone)
}

function toggleVibeTag(slug: string) {
  const set = new Set(vibeTagFilters.value)
  if (set.has(slug)) set.delete(slug)
  else set.add(slug)
  vibeTagFilters.value = [...set]
}

function toggleEvent(id: string) {
  const next = new Set(selectedIds.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  selectedIds.value = next
}

function selectAll() {
  selectedIds.value = new Set(eventPool.value.map((e) => e.id))
}

function selectNone() {
  selectedIds.value = new Set()
}

function selectedEvents(): PickerMaterialItem[] {
  return eventPool.value.filter((e) => selectedIds.value.has(e.id))
}

function emitBuild() {
  const events = selectedEvents()
  if (!events.length) return
  emit('build', {
    events,
    coverTitle: props.coverTitle,
    listSlug: props.mode === 'curated_list' ? selectedListSlug.value : undefined,
    listTitle:
      props.mode === 'curated_list'
        ? curatedLists.value.find((l) => l.slug === selectedListSlug.value)?.title
        : undefined,
  })
}

const CAROUSEL_HIDDEN_TAG_GROUPS = new Set(['content-format'])

type ContentTagsResponse = {
  ok: boolean
  items?: VibeTag[]
  groups?: Array<{ id: string; items: VibeTag[] }>
}

function buildManagerContentTagsUrl(scope?: 'events') {
  const base = `/api/dashboard/manager/cities/${props.citySlug}/content-tags`
  return scope ? `${base}?scope=${scope}` : base
}

function pickAfishaTagsForCarousel(
  items: VibeTag[],
  groups: Array<{ id: string; items: VibeTag[] }>,
): VibeTag[] {
  const vibeItems = items.filter((t) => t.tagGroup === 'vibes')
  if (vibeItems.length) return vibeItems

  const vibeFromGroups = groups
    .filter((g) => g.id === 'vibes')
    .flatMap((g) => g.items)
  if (vibeFromGroups.length) return vibeFromGroups

  const fromGroups = groups
    .filter((g) => !CAROUSEL_HIDDEN_TAG_GROUPS.has(g.id))
    .flatMap((g) => g.items)
  if (fromGroups.length) return fromGroups

  return items.filter((t) => t.tagGroup !== 'content-format')
}

async function fetchManagerContentTags(scope?: 'events'): Promise<ContentTagsResponse | null> {
  try {
    return await $fetch<ContentTagsResponse>(buildManagerContentTagsUrl(scope))
  } catch {
    return null
  }
}

async function loadVibeTags() {
  if (!props.citySlug) return

  const scoped = await fetchManagerContentTags('events')
  let picked = pickAfishaTagsForCarousel(
    scoped?.ok && scoped.items?.length ? scoped.items : [],
    scoped?.ok && scoped.groups?.length ? scoped.groups : [],
  )

  if (!picked.length) {
    const full = await fetchManagerContentTags()
    picked = pickAfishaTagsForCarousel(
      full?.ok && full.items?.length ? full.items : [],
      full?.ok && full.groups?.length ? full.groups : [],
    )
  }

  vibeTags.value = picked
}

async function loadCuratedLists() {
  if (!props.citySlug) return
  loadingLists.value = true
  try {
    const res = await $fetch<{ ok: boolean; items?: CuratedListOption[] }>(
      `/api/dashboard/manager/cities/${props.citySlug}/curated-lists`,
    )
    curatedLists.value = res?.ok && res.items?.length ? res.items : []
  } catch {
    curatedLists.value = []
  } finally {
    loadingLists.value = false
  }
}

async function loadEventPool() {
  if (!props.citySlug) return
  loadingPool.value = true
  poolError.value = ''
  try {
    const tagQuery = vibeTagFilters.value.length
      ? vibeTagFilters.value.map((t) => `tag=${encodeURIComponent(t)}`).join('&')
      : ''
    const url = `/api/dashboard/manager/cities/${props.citySlug}/events?limit=40${tagQuery ? `&${tagQuery}` : ''}`
    const res = await $fetch<{ ok: boolean; items?: PickerMaterialItem[]; message?: string }>(url)
    if (!res?.ok) throw new Error(res?.message || 'Не удалось загрузить события')
    eventPool.value = (res.items || []).map((item) => normalizePoolItem(item))
    selectedIds.value = new Set(eventPool.value.map((e) => e.id))
  } catch (err: unknown) {
    poolError.value = err instanceof Error ? err.message : 'Ошибка загрузки'
    eventPool.value = []
    selectedIds.value = new Set()
  } finally {
    loadingPool.value = false
  }
}

async function loadListEvents() {
  const listSlug = selectedListSlug.value.trim()
  if (!props.citySlug || !listSlug) {
    eventPool.value = []
    selectedIds.value = new Set()
    return
  }
  loadingPool.value = true
  poolError.value = ''
  try {
    const res = await $fetch<{
      ok: boolean
      list?: { title: string }
      items?: PickerMaterialItem[]
      events?: PickerMaterialItem[]
      message?: string
    }>(`/api/dashboard/manager/cities/${props.citySlug}/curated-lists/${encodeURIComponent(listSlug)}`)
    if (!res?.ok) throw new Error(res?.message || 'Не удалось загрузить подборку')
    const rows = res.items?.length ? res.items : res.events || []
    eventPool.value = rows.map((item) => normalizePoolItem(item))
    selectedIds.value = new Set(eventPool.value.map((e) => e.id))
    if (res.list?.title) {
      emit('update:coverTitle', res.list.title)
    }
  } catch (err: unknown) {
    poolError.value = err instanceof Error ? err.message : 'Ошибка загрузки'
    eventPool.value = []
    selectedIds.value = new Set()
  } finally {
    loadingPool.value = false
  }
}

function onListChange() {
  void loadListEvents()
}

watch(
  () => props.citySlug,
  async () => {
    vibeTagFilters.value = []
    if (props.mode === 'events') {
      await loadVibeTags()
      await loadEventPool()
    } else {
      await loadCuratedLists()
      if (selectedListSlug.value) await loadListEvents()
    }
  },
  { immediate: true },
)

watch(
  () => props.mode,
  async (mode) => {
    poolError.value = ''
    if (mode === 'events') {
      selectedListSlug.value = ''
      await loadVibeTags()
      await loadEventPool()
    } else {
      vibeTagFilters.value = []
      await loadCuratedLists()
    }
  },
)

watch(
  vibeTagFilters,
  () => {
    if (props.mode === 'events' && props.citySlug) {
      void loadEventPool()
    }
  },
  { deep: true },
)

defineExpose({ reload: loadEventPool })
</script>
