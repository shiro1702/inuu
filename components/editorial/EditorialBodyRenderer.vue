<template>
  <div class="editorial-body space-y-6">
    <template v-if="blocks.length">
      <template v-for="(block, index) in blocks" :key="index">
        <p v-if="block.type === 'paragraph'" class="text-base leading-relaxed text-gray-800 whitespace-pre-wrap">
          {{ block.text }}
        </p>
        <figure v-else-if="block.type === 'image'" class="overflow-hidden rounded-xl">
          <img
            :src="block.url"
            alt=""
            referrerpolicy="no-referrer"
            class="max-h-[480px] w-full object-cover"
            @error="onImageError(index)"
          >
          <figcaption
            v-if="block.caption && !failedImageIndexes.has(index)"
            class="mt-2 text-sm text-gray-500"
          >
            {{ block.caption }}
          </figcaption>
          <p v-else-if="failedImageIndexes.has(index)" class="mt-2 text-sm text-gray-500">
            Фото временно недоступно
          </p>
        </figure>
        <div v-else-if="block.type === 'place_embed'">
          <CityVenueCard
            v-if="placeEmbeds[block.venue_id]"
            :venue="placeEmbeds[block.venue_id]"
          />
          <p v-else class="text-sm text-gray-500">Место недоступно</p>
        </div>
      </template>
    </template>
    <p v-else-if="displayFallbackText" class="text-base leading-relaxed text-gray-800 whitespace-pre-wrap">
      {{ displayFallbackText }}
    </p>

    <div
      v-if="galleryItems.length"
      class="grid grid-cols-1 gap-3 sm:grid-cols-2"
    >
      <figure
        v-for="(item, gi) in galleryItems"
        :key="`${item.url}-${gi}`"
        class="overflow-hidden rounded-xl"
      >
        <video
          v-if="item.type === 'video'"
          :src="item.url"
          class="max-h-[480px] w-full bg-black"
          controls
          playsinline
        />
        <img
          v-else
          :src="item.url"
          alt=""
          loading="lazy"
          decoding="async"
          class="max-h-[480px] w-full object-cover"
        >
      </figure>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { EditorialBodyBlock } from '~/server/utils/editorialBodyJson'
import type { EditorialGalleryItem } from '~/utils/editorialTelegramGallery'
import { parseEditorialBodyFallback } from '~/utils/editorialTelegramGallery'

type PlaceEmbedCard = {
  slug: string
  title: string
  cover_media_url?: string | null
  address?: string | null
  editorial_quote?: string | null
  vibe_tags?: string[]
}

const props = defineProps<{
  blocks: EditorialBodyBlock[]
  placeEmbeds?: Record<string, PlaceEmbedCard>
  fallbackBody?: string | null
  gallery?: EditorialGalleryItem[] | null
}>()

const failedImageIndexes = ref(new Set<number>())

function onImageError(index: number) {
  failedImageIndexes.value = new Set([...failedImageIndexes.value, index])
}

watch(() => props.blocks, () => {
  failedImageIndexes.value = new Set()
})

const parsedFallback = computed(() => parseEditorialBodyFallback(props.fallbackBody || ''))

const displayFallbackText = computed(() => {
  if (props.blocks.length) return ''
  return parsedFallback.value.text
})

const galleryItems = computed(() => {
  if (props.gallery?.length) return props.gallery
  return parsedFallback.value.gallery
})
</script>
