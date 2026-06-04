<template>
  <div class="flex h-full w-full items-center justify-center p-8 pb-32 pt-36">
    <div
      class="flex h-full w-full flex-col items-center justify-center border-[10px] border-white p-10 text-center shadow-2xl"
      :class="theme.gradientClass"
    >
      <p class="text-5xl font-black uppercase leading-none tracking-tight text-white">
        {{ slide.cta_text || 'INUU' }}
      </p>
      <p v-if="linkHint" class="mt-6 max-w-[90%] text-xl font-semibold uppercase tracking-wider text-white/80">
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
