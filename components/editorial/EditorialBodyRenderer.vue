<template>
  <div class="editorial-body space-y-6">
    <template v-if="blocks.length">
      <template v-for="(block, index) in blocks" :key="index">
        <p v-if="block.type === 'paragraph'" class="text-base leading-relaxed text-gray-800 whitespace-pre-wrap">
          {{ block.text }}
        </p>
        <figure v-else-if="block.type === 'image'" class="overflow-hidden rounded-xl">
          <img :src="block.url" alt="" class="max-h-[480px] w-full object-cover">
          <figcaption v-if="block.caption" class="mt-2 text-sm text-gray-500">
            {{ block.caption }}
          </figcaption>
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
    <p v-else-if="fallbackBody" class="text-base leading-relaxed text-gray-800 whitespace-pre-wrap">
      {{ fallbackBody }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { EditorialBodyBlock } from '~/server/utils/editorialBodyJson'

type PlaceEmbedCard = {
  slug: string
  title: string
  cover_media_url?: string | null
  address?: string | null
  editorial_quote?: string | null
  vibe_tags?: string[]
}

defineProps<{
  blocks: EditorialBodyBlock[]
  placeEmbeds?: Record<string, PlaceEmbedCard>
  fallbackBody?: string | null
}>()
</script>
