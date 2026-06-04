<template>
  <div class="relative flex h-full w-full flex-col justify-end px-12 pb-32 pt-36" :class="theme.gradientClass">
    <div class="rounded-3xl border border-white/25 bg-black/45 p-10 backdrop-blur-md">
      <p class="text-4xl font-bold leading-tight text-white">
        {{ slide.cta_text || slide.title || 'Смотреть афишу' }}
      </p>
      <p v-if="linkHint" class="mt-4 text-xl text-white/75">
        {{ linkHint }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CarouselSlide } from '~/types/editorialCarousel'
import { resolveCarouselVibeTheme } from '~/utils/carouselVibeTheme'

const props = defineProps<{
  slide: CarouselSlide
  linkHint?: string | null
  topicTags?: string[]
}>()
const theme = computed(() => resolveCarouselVibeTheme(props.slide, props.topicTags))
</script>
