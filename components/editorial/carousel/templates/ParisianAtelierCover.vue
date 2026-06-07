<template>
  <div class="relative flex h-full w-full flex-col overflow-hidden bg-[#FFFDF9] px-10 carousel-slide-pad-bottom pt-36 font-serif text-[#2D362E]">
    <div class="pointer-events-none absolute inset-6 rounded-2xl border border-[#2D362E]/10" />

    <div class="relative z-10 flex min-h-0 flex-[3] shrink-0 flex-col px-4">
      <div
        v-if="slide.media_url"
        class="h-full min-h-[320px] overflow-hidden rounded-3xl border border-[#2D362E]/5 shadow-2xl"
      >
        <img
          :src="slide.media_url"
          alt=""
          crossorigin="anonymous"
          class="h-full w-full object-cover"
        >
      </div>
      <div
        v-else
        class="h-full min-h-[320px] overflow-hidden rounded-3xl border border-[#2D362E]/5 shadow-2xl"
      >
        <div class="h-full w-full" :class="theme.gradientClass" />
      </div>
    </div>

    <div class="relative z-10 flex min-h-0 flex-[2] flex-col justify-end px-4 pt-8">
      <span class="mb-3 font-mono text-xl tracking-widest text-[#2D362E]/40 uppercase">l'art de vivre</span>
      <h1 class="text-[3.75rem] font-normal leading-[1.08] tracking-tight">
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
