<template>
  <div v-if="pending" class="py-16 text-center text-sm text-gray-500">
    Загружаем город…
  </div>
  <div v-else-if="loadError" class="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
    {{ loadError }}
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

    <section>
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

    <section>
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
  </div>
</template>

<script setup lang="ts">
import type { StoryCampaignDto, StorySlideDto } from '~/types/stories'

definePageMeta({ layout: 'city' })

const { slug, cityBasePath, displayName } = useCity()
const { topBar: storiesTopBar, loading: storiesLoading } = useCityStories(slug)

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

const pending = ref(true)
const loadError = ref<string | null>(null)
const home = ref<HomePayload | null>(null)

async function loadHome() {
  pending.value = true
  loadError.value = null
  try {
    const res = await $fetch<{
      ok: boolean
      events?: HomePayload['events']
      venues?: HomePayload['venues']
      curatedLists?: HomePayload['curatedLists']
      editorialJournal?: HomePayload['editorialJournal']
    }>(`/api/cities/${slug.value}/home`)
    if (!res?.ok) {
      loadError.value = 'Не удалось загрузить главную'
      home.value = null
      return
    }
    home.value = {
      events: (res.events ?? []) as HomePayload['events'],
      venues: (res.venues ?? []) as HomePayload['venues'],
      curatedLists: res.curatedLists ?? [],
      editorialJournal: res.editorialJournal ?? [],
    }
  } catch (e: unknown) {
    loadError.value = e instanceof Error ? e.message : 'Ошибка загрузки'
    home.value = null
  } finally {
    pending.value = false
  }
}

watch(slug, () => {
  void loadHome()
}, { immediate: true })

useHead({
  title: () => `${displayName.value} — INUU`,
})
</script>
