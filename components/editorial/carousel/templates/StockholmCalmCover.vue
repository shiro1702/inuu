<template>
  <div class="flex h-full w-full flex-col bg-[#F4F0EA] px-12 carousel-slide-pad-bottom pt-36 font-sans text-[#3E332E]">
    <div class="flex min-h-0 flex-[3] shrink-0 flex-col">
      <div
        v-if="slide.media_url"
        class="h-full min-h-[320px] overflow-hidden rounded-[2rem] bg-white p-2 shadow-lg"
      >
        <img
          :src="slide.media_url"
          alt=""
          crossorigin="anonymous"
          class="h-full w-full rounded-[1.5rem] object-cover"
        >
      </div>
      <div
        v-else
        class="h-full min-h-[320px] overflow-hidden rounded-[2rem] bg-white p-2 shadow-lg"
      >
        <div class="h-full w-full rounded-[1.5rem]" :class="theme.gradientClass" />
      </div>
    </div>

    <div class="flex min-h-0 flex-[2] flex-col justify-end space-y-5 pt-8">
      <span class="font-mono text-xl tracking-widest text-[#3E332E]/40 uppercase">Issue</span>
      <h1 class="text-[3.75rem] font-light leading-[1.08] tracking-tight text-[#2B2320]">
        {{ slide.title || 'Заголовок' }}
      </h1>
      <div class="h-px w-24 bg-[#3E332E]/30" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CarouselSlide } from '~/types/editorialCarousel'
import { resolveCarouselVibeTheme } from '~/utils/carouselVibeTheme'

const props = defineProps<{ slide: CarouselSlide; topicTags?: string[] }>()
const theme = computed(() => resolveCarouselVibeTheme(props.slide, props.topicTags))
</script>
