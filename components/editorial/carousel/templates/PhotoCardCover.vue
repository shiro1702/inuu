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
      :class="slide.media_url ? 'bg-black/25' : theme.gradientClass"
    />
    <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />
    <div class="relative z-10 flex h-full flex-col justify-end px-12 carousel-slide-pad-bottom pt-36">
      <h1 class="text-5xl font-bold leading-[1.05] text-white drop-shadow-lg">
        {{ slide.title || 'Заголовок' }}
      </h1>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CarouselSlide } from '~/types/editorialCarousel'
import { resolveCarouselVibeTheme } from '~/utils/carouselVibeTheme'

const props = defineProps<{ slide: CarouselSlide; topicTags?: string[] }>()
const theme = computed(() => resolveCarouselVibeTheme(props.slide, props.topicTags))
</script>
