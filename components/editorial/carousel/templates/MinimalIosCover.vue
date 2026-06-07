<template>
  <div class="relative flex h-full w-full flex-col">
    <img
      v-if="slide.media_url"
      :src="slide.media_url"
      alt=""
      crossorigin="anonymous"
      class="absolute inset-0 h-full w-full object-cover"
    >
    <div
      class="absolute inset-0"
      :class="theme.gradientClass"
      :style="slide.media_url ? { opacity: 0.55 } : undefined"
    />
    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

    <div class="relative z-10 flex h-full flex-col justify-end px-12 carousel-slide-pad-bottom pt-36">
      <h1
        class="text-5xl font-bold leading-tight drop-shadow-lg"
        :class="theme.textClass"
      >
        {{ slide.title || 'Заголовок' }}
      </h1>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CarouselSlide } from '~/types/editorialCarousel'
import { resolveCarouselVibeTheme } from '~/utils/carouselVibeTheme'

const props = defineProps<{
  slide: CarouselSlide
  topicTags?: string[]
}>()

const theme = computed(() => resolveCarouselVibeTheme(props.slide, props.topicTags))
</script>
