<template>
  <div class="relative h-full w-full">
    <img
      v-if="slide.media_url"
      :src="slide.media_url"
      alt=""
      crossorigin="anonymous"
      class="absolute inset-0 h-full w-full object-cover"
    >
    <div
      class="absolute inset-0"
      :class="slide.media_url ? 'bg-black/20' : theme.gradientClass"
    />
    <div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />
    <div class="relative z-10 flex h-full flex-col justify-end px-12 carousel-slide-pad-bottom pt-36">
      <h2 v-if="slide.title" class="mb-6 text-4xl font-bold leading-tight text-white">
        {{ slide.title }}
      </h2>
      <ul v-if="bullets.length" class="space-y-3 text-2xl leading-snug text-white/95">
        <li v-for="(item, index) in bullets" :key="index" class="flex gap-3">
          <span class="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-white" />
          <span>{{ item }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CarouselSlide } from '~/types/editorialCarousel'
import { resolveCarouselVibeTheme } from '~/utils/carouselVibeTheme'

const props = defineProps<{ slide: CarouselSlide; topicTags?: string[] }>()
const theme = computed(() => resolveCarouselVibeTheme(props.slide, props.topicTags))
const bullets = computed(() => (props.slide.bullets || []).filter(Boolean).slice(0, 6))
</script>
