<template>
  <div class="relative h-full w-full px-8 pt-36 carousel-slide-pad-bottom">
    <div
      class="relative flex h-full w-full flex-col overflow-hidden border-[10px] border-white shadow-2xl"
      :class="theme.gradientClass"
    >
      <img
        v-if="slide.media_url"
        :src="slide.media_url"
        alt=""
        crossorigin="anonymous"
        class="absolute inset-0 h-full w-full object-cover opacity-90"
      >
      <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />
      <div class="relative z-10 flex h-full flex-col justify-between p-10">
        <span class="inline-flex w-fit border-2 border-white px-4 py-1 text-sm font-bold uppercase tracking-[0.2em] text-white">
          Афиша
        </span>
        <h1 class="text-[3.5rem] font-black uppercase leading-[0.92] tracking-tight text-white">
          {{ slide.title || 'Заголовок' }}
        </h1>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CarouselSlide } from '~/types/editorialCarousel'
import { resolveCarouselVibeTheme } from '~/utils/carouselVibeTheme'

const props = defineProps<{ slide: CarouselSlide; topicTags?: string[] }>()
const theme = computed(() => resolveCarouselVibeTheme(props.slide, props.topicTags))
</script>
