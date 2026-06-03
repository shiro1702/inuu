<template>
  <div v-if="pending" class="text-sm text-gray-500">Загрузка…</div>
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
      v-if="post.video_url"
      :src="post.video_url"
      class="max-h-[480px] w-full rounded-xl bg-black"
      controls
      playsinline
    />
    <img
      v-else-if="post.cover_media_url && !hasImageInBody"
      :src="post.cover_media_url"
      :alt="post.title"
      class="max-h-[480px] w-full rounded-xl object-cover"
    >

    <EditorialBodyRenderer
      :blocks="bodyBlocks"
      :place-embeds="placeEmbedCards"
      :fallback-body="post.body"
    />
  </article>
</template>

<script setup lang="ts">
import type { EditorialBodyBlock } from '~/server/utils/editorialBodyJson'

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
  }>
}

const route = useRoute()
const { slug: citySlug, cityBasePath, displayName } = useCity()
const postSlug = computed(() => String(route.params.slug || ''))

const pending = ref(true)
const post = ref<EditorialDetail | null>(null)

const bodyBlocks = computed(() => post.value?.body_json ?? [])
const placeEmbedCards = computed(() => {
  const embeds = post.value?.place_embeds ?? {}
  const out: Record<string, {
    slug: string
    title: string
    cover_media_url?: string | null
    address?: string | null
  }> = {}
  for (const [id, v] of Object.entries(embeds)) {
    out[id] = {
      slug: v.slug,
      title: v.title,
      cover_media_url: v.cover_media_url,
      address: v.address,
    }
  }
  return out
})

const hasImageInBody = computed(() => bodyBlocks.value.some((b) => b.type === 'image'))

const { trackScroll } = useEditorialScrollDepth({ citySlug, postSlug })

watch([citySlug, postSlug], async () => {
  pending.value = true
  try {
    const res = await $fetch<{ ok: boolean; post?: EditorialDetail }>(
      `/api/cities/${citySlug.value}/editorial/${postSlug.value}`,
    )
    post.value = res?.post ?? null
  } catch {
    post.value = null
  } finally {
    pending.value = false
  }
}, { immediate: true })

let stopScroll: (() => void) | undefined
onMounted(() => {
  stopScroll = trackScroll()
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
