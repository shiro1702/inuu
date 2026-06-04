<template>
  <div class="flex h-full w-full flex-col bg-[#f4efe6] px-12 pb-32 pt-36 text-stone-900">
    <div
      v-if="slide.media_url"
      class="mb-10 min-h-0 flex-1 overflow-hidden rounded-[2rem] shadow-2xl ring-1 ring-stone-900/10"
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
      class="mb-10 flex-1 rounded-[2rem]"
      :class="theme.gradientClass"
    />
    <h1 class="font-serif text-[3.25rem] font-bold leading-[1.08] tracking-tight">
      {{ slide.title || 'Заголовок' }}
    </h1>
  </div>
</template>

<script setup lang="ts">
import type { CarouselSlide } from '~/types/editorialCarousel'
import { resolveCarouselVibeTheme } from '~/utils/carouselVibeTheme'

const props = defineProps<{ slide: CarouselSlide; topicTags?: string[] }>()
const theme = computed(() => resolveCarouselVibeTheme(props.slide, props.topicTags))
</script>
