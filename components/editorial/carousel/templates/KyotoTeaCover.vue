<template>
  <div class="relative flex h-full w-full flex-col overflow-hidden bg-[#FAF9F6] px-12 carousel-slide-pad-bottom pt-36 font-serif text-[#1A1A1A]">
    <div class="absolute carousel-slide-safe-bottom left-12 top-36 w-px bg-[#1A1A1A]/10" />

    <div class="relative z-10 flex min-h-0 flex-[3] shrink-0 flex-col pl-8">
      <div
        v-if="slide.media_url"
        class="h-full min-h-[320px] overflow-hidden rounded-t-[5rem] rounded-b-2xl border border-[#1A1A1A]/10"
      >
        <img
          :src="slide.media_url"
          alt=""
          crossorigin="anonymous"
          class="h-full w-full object-cover grayscale"
        >
      </div>
      <div
        v-else
        class="h-full min-h-[320px] overflow-hidden rounded-t-[5rem] rounded-b-2xl border border-[#1A1A1A]/10"
      >
        <div class="h-full w-full grayscale" :class="theme.gradientClass" />
      </div>
    </div>

    <div class="relative z-10 flex min-h-0 flex-[2] flex-col justify-end space-y-5 pl-8 pt-8">
      <span class="font-mono text-xl tracking-[0.25em] text-gray-400 uppercase">Zen spaces</span>
      <h1 class="text-[3.75rem] font-light leading-[1.08] tracking-tight">
        {{ slide.title || 'Заголовок' }}
      </h1>
      <div class="h-px w-12 bg-[#1A1A1A]" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CarouselSlide } from '~/types/editorialCarousel'
import { resolveCarouselVibeTheme } from '~/utils/carouselVibeTheme'

const props = defineProps<{ slide: CarouselSlide; topicTags?: string[] }>()
const theme = computed(() => resolveCarouselVibeTheme(props.slide, props.topicTags))
</script>
