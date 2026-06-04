<template>
  <div :class="{ 'pb-28': showFixedSubscribe }">
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

      <div v-if="displayTagGroups.length">
        <div class="mb-2 flex flex-wrap items-center justify-between gap-2">
          <p class="text-xs font-medium uppercase tracking-wide text-gray-500">Теги</p>
          <p v-if="tagFilters.length > 1" class="text-xs text-gray-400">показаны события с любым из выбранных</p>
        </div>
        <div
          class="gap-2 px-1 pb-1"
          :class="useGroupedTagUi ? '-mx-1 flex flex-wrap' : '-mx-1 flex overflow-x-auto sm:flex-wrap sm:overflow-visible'"
        >
          <button
            type="button"
            class="shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition"
            :class="!tagFilters.length
              ? 'bg-indigo-100 text-indigo-800 ring-1 ring-indigo-200'
              : 'border border-gray-200 bg-white text-gray-700 hover:border-indigo-200 hover:text-indigo-800'"
            @click="clearTagFilters"
          >
            Все
          </button>

          <template v-if="useGroupedTagUi">
            <button
              v-for="group in displayTagGroups"
              :key="group.id"
              type="button"
              class="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition"
              :class="groupActiveCount(group) > 0
                ? 'bg-indigo-100 text-indigo-800 ring-1 ring-indigo-200'
                : 'border border-gray-200 bg-white text-gray-700 hover:border-indigo-200 hover:text-indigo-800'"
              @click="openTagGroupModal(group)"
            >
              <span>{{ group.label }}</span>
              <span
                v-if="groupActiveCount(group) > 0"
                class="inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-indigo-200/80 px-1.5 text-xs font-semibold tabular-nums"
              >
                {{ groupActiveCount(group) }}
              </span>
            </button>
          </template>

          <template v-else>
            <button
              v-for="tag in displayTagsFlat"
              :key="tag.slug"
              type="button"
              class="inline-flex shrink-0 items-center gap-1.5 rounded-full py-1.5 pl-3 pr-2 text-sm font-medium transition"
              :class="isTagActive(tag.slug)
                ? 'bg-indigo-100 text-indigo-800 ring-1 ring-indigo-200'
                : 'border border-gray-200 bg-white text-gray-700 hover:border-indigo-200 hover:text-indigo-800'"
              @click="toggleTag(tag.slug)"
            >
              <span>{{ tag.name }}</span>
              <span
                class="inline-flex h-4 w-4 items-center justify-center text-base leading-none transition-transform duration-150"
                :class="isTagActive(tag.slug) ? 'rotate-45' : ''"
                aria-hidden="true"
              >+</span>
            </button>
          </template>
        </div>

        <div
          v-if="tagFilters.length"
          ref="subscribeAnchorRef"
          class="mt-4"
        >
          <EventsTagSubscribeCta
            :subscribed="subscribedToSelection"
            :pending="subscribePending"
            :error="subscribeError"
            :settings-href="`${cityBasePath}/subscriptions`"
            @subscribe="onSubscribeClick"
          />
        </div>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="events-tag-modal-fade">
        <div
          v-if="activeTagGroup"
          class="fixed inset-0 z-[90] flex items-end justify-center sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="tagModalTitleId"
        >
          <div class="absolute inset-0 bg-black/40" aria-hidden="true" @click="closeTagGroupModal" />
          <div
            class="relative max-h-[min(85vh,32rem)] w-full overflow-hidden rounded-t-2xl bg-white shadow-xl sm:max-w-md sm:rounded-2xl"
          >
            <div class="flex items-center justify-between gap-3 border-b border-gray-100 px-4 py-3">
              <h2 :id="tagModalTitleId" class="text-base font-semibold text-gray-900">
                {{ activeTagGroup.label }}
              </h2>
              <button
                type="button"
                class="rounded-lg px-2 py-1 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                @click="closeTagGroupModal"
              >
                Закрыть
              </button>
            </div>
            <div class="overflow-y-auto px-4 py-3">
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="tag in activeTagGroup.items"
                  :key="tag.slug"
                  type="button"
                  class="inline-flex items-center gap-1.5 rounded-full py-1.5 pl-3 pr-2 text-sm font-medium transition"
                  :class="isTagActive(tag.slug)
                    ? 'bg-indigo-100 text-indigo-800 ring-1 ring-indigo-200'
                    : 'border border-gray-200 bg-white text-gray-700 hover:border-indigo-200 hover:text-indigo-800'"
                  @click="toggleTag(tag.slug)"
                >
                  <span>{{ tag.name }}</span>
                  <span
                    class="inline-flex h-4 w-4 items-center justify-center text-base leading-none transition-transform duration-150"
                    :class="isTagActive(tag.slug) ? 'rotate-45' : ''"
                    aria-hidden="true"
                  >+</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <Teleport to="body">
      <Transition name="events-tag-subscribe-slide">
        <div
          v-if="showFixedSubscribe"
          class="fixed inset-x-0 bottom-0 z-[80] border-t border-gray-200 bg-white/95 px-4 py-3 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] backdrop-blur sm:px-6"
        >
          <div class="mx-auto max-w-6xl">
            <EventsTagSubscribeCta
              :subscribed="subscribedToSelection"
              :pending="subscribePending"
              :error="subscribeError"
              :settings-href="`${cityBasePath}/subscriptions`"
              compact
              @subscribe="onSubscribeClick"
            />
          </div>
        </div>
      </Transition>
    </Teleport>

    <div v-if="pending" class="mt-8 text-sm text-gray-500">Загрузка…</div>
    <div v-else-if="items.length" class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <CityEventCard
        v-for="event in items"
        :key="event.id"
        :event="event"
        :sale-mode="event.saleMode"
        :cta="event.cta"
      />
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

const AFISHA_HIDDEN_TAG_GROUPS = new Set(['content-format'])
/** Больше этого числа тегов на афише — показываем группы, иначе все теги списком. */
const TAG_GROUPED_UI_MIN = 12

type TagItem = { slug: string; name: string; tagGroup?: string }
type TagGroup = { id: string; label: string; items: TagItem[] }
type DatePresetId = 'all' | 'today' | 'tomorrow' | 'week'

const route = useRoute()
const router = useRouter()
const user = useSupabaseUser()
const { slug, displayName, city, cityBasePath } = useCity()
const { messengerInitData, buildMessengerAuthHeaders } = useTelegram()
const { openGuestAuthModal } = useCityGuestAuth()
const { pushToast } = useAppToast()
const config = useRuntimeConfig()

const pending = ref(true)
const items = ref<Array<Record<string, any>>>([])
const tagGroups = ref<TagGroup[]>([])
const activeTagGroup = ref<TagGroup | null>(null)
const tagModalTitleId = 'events-tag-group-modal-title'
const subscribeAnchorRef = ref<HTMLElement | null>(null)
const subscribeAnchorVisible = ref(true)
const subscribedToSelection = ref(false)
const subscribePending = ref(false)
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

const displayTagGroups = computed(() =>
  tagGroups.value.filter((g) => !AFISHA_HIDDEN_TAG_GROUPS.has(g.id) && g.items.length > 0),
)

const displayTagsFlat = computed(() => displayTagGroups.value.flatMap((g) => g.items))

const useGroupedTagUi = computed(() => displayTagsFlat.value.length > TAG_GROUPED_UI_MIN)

const showFixedSubscribe = computed(
  () => tagFilters.value.length > 0 && !subscribeAnchorVisible.value,
)

function groupActiveCount(group: TagGroup) {
  return group.items.filter((tag) => tagFilters.value.includes(tag.slug)).length
}

function openTagGroupModal(group: TagGroup) {
  activeTagGroup.value = group
}

function closeTagGroupModal() {
  activeTagGroup.value = null
}

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
  subscribeError.value = ''
  const nextTags = isTagActive(slug)
    ? tagFilters.value.filter((t) => t !== slug)
    : [...tagFilters.value, slug]

  const query = routeQueryBase()
  if (nextTags.length) query.tag = nextTags
  void router.replace({ query })
}

function clearTagFilters() {
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
    const res = await $fetch<{ ok: boolean; groups?: TagGroup[] }>(
      `/api/cities/${slug.value}/content-tags?scope=events`,
    )
    tagGroups.value = res?.groups?.length ? res.groups : []
  } catch {
    tagGroups.value = []
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
  subscribeError.value = ''

  if (!tagFilters.value.length) return

  if (!isAuthenticated.value) {
    openGuestAuthModal()
    return
  }

  subscribePending.value = true
  try {
    const res = await $fetch<{
      ok: boolean
      message?: string
      subscribedToSelection?: boolean
      messengerLinked?: boolean
    }>(`/api/cities/${slug.value}/subscriptions/tags`, {
      method: 'POST',
      body: { tags: tagFilters.value },
      headers: buildMessengerAuthHeaders(),
    })
    subscribedToSelection.value = !!res?.subscribedToSelection
    if (res?.messengerLinked) {
      pushToast(res?.message || 'Подписка сохранена. Уведомления придут в бот.', 'ok')
    } else {
      const botName = String(config.public.telegramBotName || 'inuu_bot').replace(/^@/, '')
      pushToast(
        `Интересы сохранены. Чтобы получать пуши, откройте афишу в Telegram-боте @${botName} или настройте подписки.`,
        'info',
        9000,
      )
    }
  } catch (e: unknown) {
    const err = e as { data?: { statusMessage?: string }; statusMessage?: string; message?: string }
    subscribeError.value = err?.data?.statusMessage
      || err?.statusMessage
      || (e instanceof Error ? e.message : '')
      || 'Не удалось сохранить подписку'
    pushToast(subscribeError.value, 'error')
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

let subscribeAnchorObserver: IntersectionObserver | null = null

function disconnectSubscribeAnchorObserver() {
  subscribeAnchorObserver?.disconnect()
  subscribeAnchorObserver = null
}

function observeSubscribeAnchor(el: HTMLElement | null) {
  disconnectSubscribeAnchorObserver()
  if (!el || typeof IntersectionObserver === 'undefined') {
    subscribeAnchorVisible.value = true
    return
  }
  subscribeAnchorObserver = new IntersectionObserver(
    ([entry]) => {
      subscribeAnchorVisible.value = entry?.isIntersecting ?? false
    },
    { threshold: 0, rootMargin: '0px 0px -1px 0px' },
  )
  subscribeAnchorObserver.observe(el)
}

watch(subscribeAnchorRef, (el) => {
  observeSubscribeAnchor(el)
}, { flush: 'post' })

watch(tagFilters, (filters) => {
  if (!filters.length) {
    subscribeAnchorVisible.value = true
    closeTagGroupModal()
  }
})

watch(useGroupedTagUi, (grouped) => {
  if (!grouped) closeTagGroupModal()
})

onUnmounted(() => {
  disconnectSubscribeAnchorObserver()
})

useHead({ title: () => `Афиша — ${displayName.value}` })
</script>

<style scoped>
.events-tag-modal-fade-enter-active,
.events-tag-modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.events-tag-modal-fade-enter-active .relative,
.events-tag-modal-fade-leave-active .relative {
  transition: transform 0.2s ease;
}

.events-tag-modal-fade-enter-from,
.events-tag-modal-fade-leave-to {
  opacity: 0;
}

.events-tag-modal-fade-enter-from .relative,
.events-tag-modal-fade-leave-to .relative {
  transform: translateY(1rem);
}

.events-tag-subscribe-slide-enter-active,
.events-tag-subscribe-slide-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.events-tag-subscribe-slide-enter-from,
.events-tag-subscribe-slide-leave-to {
  opacity: 0;
  transform: translateY(100%);
}
</style>
