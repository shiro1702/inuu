<template>
  <div v-if="pending" class="text-sm text-gray-500">Загрузка…</div>
  <div v-else-if="loadError" class="text-sm text-red-600">{{ loadError }}</div>
  <div v-else-if="!post" class="text-sm text-gray-500">Материал не найден.</div>
  <article v-else class="mx-auto max-w-3xl space-y-6">
    <NuxtLink :to="`${cityBasePath}/guides`" class="text-sm text-primary hover:underline">
      ← Журнал
    </NuxtLink>

    <header class="space-y-3">
      <p v-if="post.is_sponsored" class="text-xs font-medium uppercase tracking-wide text-amber-700">
        Промо
      </p>
      <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">{{ post.title }}</h1>
      <p v-if="post.excerpt" class="text-lg text-gray-600">{{ post.excerpt }}</p>
      <div class="flex flex-wrap items-center gap-3">
        <EditorialSaveButton :post-id="post.id" />
        <button
          type="button"
          class="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          @click="shareArticle"
        >
          Поделиться
        </button>
      </div>
    </header>

    <video
      v-if="post.video_url && !hasGallery"
      :src="post.video_url"
      class="max-h-[480px] w-full rounded-xl bg-black"
      controls
      playsinline
    />
    <img
      v-else-if="post.cover_media_url && !hasImageInBody && !hasGallery"
      :src="post.cover_media_url"
      :alt="post.title"
      class="max-h-[480px] w-full rounded-xl object-cover"
    >

    <EditorialBodyRenderer
      :blocks="bodyBlocks"
      :place-embeds="placeEmbedCards"
      :fallback-body="post.body"
      :gallery="post.gallery"
    />

    <section v-if="linkedVenueCard" class="space-y-2">
      <h2 class="text-sm font-medium uppercase tracking-wide text-gray-500">Место</h2>
      <CityVenueCard :venue="linkedVenueCard" />
    </section>
  </article>
</template>

<script setup lang="ts">
import type { EditorialBodyBlock } from '~/server/utils/editorialBodyJson'
import type { EditorialGalleryItem } from '~/utils/editorialTelegramGallery'

definePageMeta({ layout: 'city' })

type EditorialDetail = {
  id: string
  slug: string
  title: string
  excerpt?: string | null
  body: string
  body_json?: EditorialBodyBlock[] | null
  cover_media_url?: string | null
  video_url?: string | null
  is_sponsored?: boolean
  place_embeds?: Record<string, {
    slug: string
    title: string
    cover_media_url?: string | null
    address?: string | null
    rating_avg?: number | null
    editorial_quote?: string | null
    vibe_tags?: string[] | null
  }>
  gallery?: EditorialGalleryItem[]
  linked_entity_type?: string | null
  linked_entity_id?: string | null
}

const route = useRoute()
const { slug: citySlug, cityBasePath, displayName } = useCity()

const citySlugParam = computed(() => {
  const raw = route.params.city_slug
  const fromRoute = typeof raw === 'string' ? raw : Array.isArray(raw) ? raw[0] : ''
  return (fromRoute || citySlug.value || '').trim()
})

const postSlug = computed(() => String(route.params.slug || '').trim())

async function fetchEditorialPost() {
  const city = citySlugParam.value
  const slug = postSlug.value
  if (!city || !slug) return { ok: false as const, post: undefined }
  return await $fetch<{ ok: boolean; post?: EditorialDetail }>(
    `/api/cities/${city}/editorial/${slug}`,
  )
}

const { data, pending, error, refresh } = await useAsyncData(
  () => `editorial-post:${citySlugParam.value}:${postSlug.value}`,
  fetchEditorialPost,
  { watch: [citySlugParam, postSlug], lazy: true },
)

const post = computed(() => data.value?.post ?? null)
const loadError = computed(() => {
  if (error.value) {
    return 'Не удалось загрузить материал. Попробуйте обновить страницу.'
  }
  return null
})

const bodyBlocks = computed(() => post.value?.body_json ?? [])
const placeEmbedCards = computed(() => {
  const embeds = post.value?.place_embeds ?? {}
  const out: Record<string, {
    slug: string
    title: string
    cover_media_url?: string | null
    address?: string | null
    editorial_quote?: string | null
    vibe_tags?: string[] | null
  }> = {}
  for (const [id, v] of Object.entries(embeds)) {
    out[id] = {
      slug: v.slug,
      title: v.title,
      cover_media_url: v.cover_media_url,
      address: v.address,
      editorial_quote: v.editorial_quote,
      vibe_tags: v.vibe_tags,
    }
  }
  return out
})

const hasImageInBody = computed(() => bodyBlocks.value.some((b) => b.type === 'image'))
const hasGallery = computed(() => (post.value?.gallery?.length ?? 0) > 0)

const hasPlaceEmbedInBody = computed(() =>
  bodyBlocks.value.some((b) => b.type === 'place_embed'),
)

const linkedVenueCard = computed(() => {
  const p = post.value
  if (p?.linked_entity_type !== 'venue' || !p.linked_entity_id || hasPlaceEmbedInBody.value) {
    return null
  }
  const embed = placeEmbedCards.value[p.linked_entity_id]
  if (!embed) return null
  return embed
})

const { trackScroll } = useEditorialScrollDepth({ citySlug: citySlugParam, postSlug })

let stopScroll: (() => void) | undefined
onMounted(() => {
  stopScroll = trackScroll()
  if (!data.value?.post && !pending.value && !error.value) {
    void refresh()
  }
})
onUnmounted(() => {
  stopScroll?.()
})

async function shareArticle() {
  const url = import.meta.client ? window.location.href : ''
  if (!url) return
  if (navigator.share) {
    try {
      await navigator.share({ title: post.value?.title, url })
      return
    } catch {
      // fall through
    }
  }
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(url)
  }
}

useHead({
  title: () => (post.value?.title ? `${post.value.title} — ${displayName.value}` : `Журнал — ${displayName.value}`),
})
</script>
