<template>
  <div v-if="homeError" class="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
    {{ homeError }}
  </div>
  <div v-else class="space-y-10">
    <section>
      <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">
        {{ displayName }}
      </h1>
      <p class="mt-2 max-w-2xl text-sm text-gray-600 sm:text-base">
        Афиша, места и подборки — городской гид INUU.
      </p>
    </section>

    <section v-if="displayTagsFlat.length">
      <p class="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">Темы</p>
      <div
        class="gap-2 px-1 pb-1"
        :class="useGroupedTagUi ? '-mx-1 flex flex-wrap' : '-mx-1 flex overflow-x-auto [scrollbar-width:none] sm:flex-wrap sm:overflow-visible'"
      >
        <button
          type="button"
          class="shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition"
          :class="!activeTag
            ? 'bg-indigo-100 text-indigo-800 ring-1 ring-indigo-200'
            : 'border border-gray-200 bg-white text-gray-700 hover:border-indigo-200 hover:text-indigo-800'"
          @click="setActiveTag(null)"
        >
          Все
        </button>

        <template v-if="useGroupedTagUi">
          <button
            v-for="group in displayTagGroups"
            :key="group.id"
            type="button"
            class="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition"
            :class="groupHasActiveTag(group)
              ? 'bg-indigo-100 text-indigo-800 ring-1 ring-indigo-200'
              : 'border border-gray-200 bg-white text-gray-700 hover:border-indigo-200 hover:text-indigo-800'"
            @click="openTagGroupModal(group)"
          >
            <span>{{ group.label }}</span>
            <span
              v-if="groupHasActiveTag(group)"
              class="inline-flex h-2 w-2 rounded-full bg-indigo-500"
              aria-hidden="true"
            />
          </button>
        </template>

        <template v-else>
          <button
            v-for="tag in displayTagsFlat"
            :key="tag.slug"
            type="button"
            class="inline-flex shrink-0 items-center gap-1.5 rounded-full py-1.5 pl-3 pr-2 text-sm font-medium transition"
            :class="activeTag === tag.slug
              ? 'bg-indigo-100 text-indigo-800 ring-1 ring-indigo-200'
              : 'border border-gray-200 bg-white text-gray-700 hover:border-indigo-200 hover:text-indigo-800'"
            @click="toggleTag(tag.slug)"
          >
            <span>{{ tag.name }}</span>
            <span
              class="inline-flex h-4 w-4 items-center justify-center text-base leading-none transition-transform duration-150"
              :class="activeTag === tag.slug ? 'rotate-45' : ''"
              aria-hidden="true"
            >+</span>
          </button>
        </template>
      </div>
      <p v-if="activeTag" class="mt-2 text-xs text-gray-500">
        Показаны материалы с тегом «{{ activeTagName }}».
        <NuxtLink :to="`${cityBasePath}/tag/${activeTag}`" class="text-primary hover:underline">Страница тега</NuxtLink>
      </p>
    </section>

    <Teleport to="body">
      <Transition name="home-tag-modal-fade">
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
                  :class="activeTag === tag.slug
                    ? 'bg-indigo-100 text-indigo-800 ring-1 ring-indigo-200'
                    : 'border border-gray-200 bg-white text-gray-700 hover:border-indigo-200 hover:text-indigo-800'"
                  @click="toggleTag(tag.slug)"
                >
                  <span>{{ tag.name }}</span>
                  <span
                    class="inline-flex h-4 w-4 items-center justify-center text-base leading-none transition-transform duration-150"
                    :class="activeTag === tag.slug ? 'rotate-45' : ''"
                    aria-hidden="true"
                  >+</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <section class="-mx-4 sm:-mx-6">
      <StoriesTopBar
        :campaigns="storiesTopBar"
        :loading="storiesLoading"
        @open="openStory"
      />
    </section>

    <StoriesStoryViewer
      v-model="storyViewerOpen"
      :campaign="activeStory"
      :campaigns="storiesTopBar"
      auto-advance-campaigns
      :shop-id="null"
      @action="onStoryAction"
    />

    <section v-if="homePending" class="py-6 text-center text-sm text-gray-500">
      Загружаем материалы…
    </section>

    <template v-else>
    <section v-if="home?.editorialJournal?.length">
      <div class="mb-4 flex items-center justify-between gap-2">
        <h2 class="text-lg font-semibold text-gray-900">Журнал</h2>
        <NuxtLink :to="`${cityBasePath}/guides`" class="text-sm font-medium text-primary hover:underline">
          Все материалы
        </NuxtLink>
      </div>
      <div class="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:-mx-6 sm:px-6">
        <EditorialCard
          v-for="post in home.editorialJournal"
          :key="post.id"
          :post="post"
        />
      </div>
    </section>

    <section v-if="home?.curatedLists?.length">
      <div class="mb-4 flex items-center justify-between gap-2">
        <h2 class="text-lg font-semibold text-gray-900">Подборки</h2>
        <NuxtLink :to="`${cityBasePath}/lists`" class="text-sm font-medium text-primary hover:underline">
          Все подборки
        </NuxtLink>
      </div>
      <div class="grid gap-3 sm:grid-cols-2">
        <NuxtLink
          v-for="list in home.curatedLists"
          :key="list.id"
          :to="`${cityBasePath}/lists/${list.slug}`"
          class="group block rounded-xl border border-gray-200 bg-white p-4 transition hover:border-primary/30 hover:shadow-sm"
        >
          <h3 class="font-semibold text-gray-900 group-hover:text-primary">{{ list.title }}</h3>
          <p v-if="list.description" class="mt-1 text-sm text-gray-600">{{ list.description }}</p>
        </NuxtLink>
      </div>
    </section>

    <section v-if="!activeTag || home?.events?.length">
      <div class="mb-4 flex items-center justify-between gap-2">
        <h2 class="text-lg font-semibold text-gray-900">Афиша</h2>
        <NuxtLink :to="`${cityBasePath}/events`" class="text-sm font-medium text-primary hover:underline">
          Все события
        </NuxtLink>
      </div>
      <div v-if="home?.events?.length" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <CityEventCard
          v-for="event in home.events"
          :key="event.id"
          :event="event"
          :sale-mode="event.saleMode"
          :cta="event.cta"
        />
      </div>
      <p v-else class="text-sm text-gray-500">Скоро появятся новые события.</p>
    </section>

    <section v-if="!activeTag">
      <div class="mb-4 flex items-center justify-between gap-2">
        <h2 class="text-lg font-semibold text-gray-900">Места</h2>
        <NuxtLink :to="`${cityBasePath}/venues`" class="text-sm font-medium text-primary hover:underline">
          Все места
        </NuxtLink>
      </div>
      <div v-if="home?.venues?.length" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <CityVenueCard v-for="venue in home.venues" :key="venue.id" :venue="venue" />
      </div>
      <p v-else class="text-sm text-gray-500">Места появятся в ближайшее время.</p>
    </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { StoryCampaignDto, StorySlideDto } from '~/types/stories'

definePageMeta({ layout: 'city' })

const HOME_HIDDEN_TAG_GROUPS = new Set(['content-format'])
/** Как на афише: больше порога — группы + модалка вместо длинного списка. */
const TAG_GROUPED_UI_MIN = 12

type TagItem = { slug: string; name: string; tagGroup?: string }
type TagGroup = { id: string; label: string; items: TagItem[] }

const route = useRoute()
const router = useRouter()
const { slug, cityBasePath, displayName } = useCity()
const { topBar: storiesTopBar, loading: storiesLoading } = useCityStories(slug)

const activeTag = computed(() => {
  const raw = route.query.tag
  const value = typeof raw === 'string' ? raw.trim().toLowerCase() : ''
  return value || null
})

const { data: tagsCatalog } = useFetch<{ ok: boolean; groups?: TagGroup[] }>(
  () => `/api/cities/${slug.value}/content-tags?scope=feed`,
  { watch: [slug], lazy: true, default: () => ({ ok: true, groups: [] }) },
)

const displayTagGroups = computed(() =>
  (tagsCatalog.value?.groups ?? []).filter(
    (g) => !HOME_HIDDEN_TAG_GROUPS.has(g.id) && g.items.length > 0,
  ),
)

const displayTagsFlat = computed(() => displayTagGroups.value.flatMap((g) => g.items))

const useGroupedTagUi = computed(() => displayTagsFlat.value.length > TAG_GROUPED_UI_MIN)

const activeTagGroup = ref<TagGroup | null>(null)
const tagModalTitleId = 'home-tag-group-modal-title'

function groupHasActiveTag(group: TagGroup) {
  return group.items.some((tag) => tag.slug === activeTag.value)
}

function openTagGroupModal(group: TagGroup) {
  activeTagGroup.value = group
}

function closeTagGroupModal() {
  activeTagGroup.value = null
}

const activeTagName = computed(() => {
  if (!activeTag.value) return ''
  const found = displayTagsFlat.value.find((t) => t.slug === activeTag.value)
  return found?.name || activeTag.value
})

function setActiveTag(tagSlug: string | null) {
  const query = { ...route.query }
  if (tagSlug) query.tag = tagSlug
  else delete query.tag
  void router.replace({ query })
}

function toggleTag(tagSlug: string) {
  setActiveTag(activeTag.value === tagSlug ? null : tagSlug)
  closeTagGroupModal()
}

const storyViewerOpen = ref(false)
const activeStory = ref<StoryCampaignDto | null>(null)

function openStory(campaign: StoryCampaignDto) {
  activeStory.value = campaign
  storyViewerOpen.value = true
}

function onStoryAction(payload: { slide: StorySlideDto; actionType: string }) {
  const { slide, actionType } = payload
  const p = slide.actionPayload ?? {}

  if (actionType === 'open_url') {
    const url = typeof p.url === 'string' ? p.url : typeof p.href === 'string' ? p.href : ''
    if (url) {
      void navigateTo(url, { external: url.startsWith('http') })
      return
    }
  }

  if (actionType === 'open_event') {
    const eventSlug = typeof p.slug === 'string' ? p.slug : typeof p.eventSlug === 'string' ? p.eventSlug : ''
    if (eventSlug) {
      void navigateTo(`${cityBasePath.value}/events/${eventSlug}`)
      return
    }
  }

  if (actionType === 'open_venue') {
    const venueSlug = typeof p.slug === 'string' ? p.slug : typeof p.venueSlug === 'string' ? p.venueSlug : ''
    if (venueSlug) {
      void navigateTo(`${cityBasePath.value}/venues/${venueSlug}`)
    }
  }
}

type EditorialJournalItem = {
  id: string
  slug: string
  title: string
  excerpt?: string | null
  cover_media_url?: string | null
  is_sponsored?: boolean
}

type HomePayload = {
  events: Array<Record<string, unknown>>
  venues: Array<Record<string, unknown>>
  curatedLists: Array<{ id: string; slug: string; title: string; description?: string | null }>
  editorialJournal: EditorialJournalItem[]
}

const homeFetchKey = computed(() => `city-home:${slug.value}:${activeTag.value || 'all'}`)

const { data: homeResponse, pending: homePending, error: homeFetchError } = useFetch<{
  ok: boolean
  events?: HomePayload['events']
  venues?: HomePayload['venues']
  curatedLists?: HomePayload['curatedLists']
  editorialJournal?: HomePayload['editorialJournal']
}>(
  () => {
    const params = activeTag.value ? `?tag=${encodeURIComponent(activeTag.value)}` : ''
    return `/api/cities/${slug.value}/home${params}`
  },
  {
    watch: [slug, activeTag],
    key: homeFetchKey,
    lazy: true,
    default: () => ({ ok: true, events: [], venues: [], curatedLists: [], editorialJournal: [] }),
  },
)

const home = computed<HomePayload | null>(() => {
  const res = homeResponse.value
  if (!res?.ok) return null
  return {
    events: (res.events ?? []) as HomePayload['events'],
    venues: (res.venues ?? []) as HomePayload['venues'],
    curatedLists: res.curatedLists ?? [],
    editorialJournal: res.editorialJournal ?? [],
  }
})

const homeError = computed(() => {
  if (homeFetchError.value) {
    return homeFetchError.value instanceof Error
      ? homeFetchError.value.message
      : 'Ошибка загрузки'
  }
  if (homeResponse.value && !homeResponse.value.ok) return 'Не удалось загрузить главную'
  return null
})

useHead({
  title: () => `${displayName.value} — INUU`,
})
</script>

<style scoped>
.home-tag-modal-fade-enter-active,
.home-tag-modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.home-tag-modal-fade-enter-active .relative,
.home-tag-modal-fade-leave-active .relative {
  transition: transform 0.2s ease;
}

.home-tag-modal-fade-enter-from,
.home-tag-modal-fade-leave-to {
  opacity: 0;
}

.home-tag-modal-fade-enter-from .relative,
.home-tag-modal-fade-leave-to .relative {
  transform: translateY(1rem);
}
</style>
