<template>
  <div class="relative flex h-full w-full flex-col">
    <div
      v-if="slide.media_url"
      class="min-h-0 flex-[3] shrink-0"
    >
      <img
        :src="slide.media_url"
        alt=""
        crossorigin="anonymous"
        class="h-full min-h-[280px] w-full object-cover"
      >
    </div>
    <div
      class="flex flex-col gap-6 px-12 carousel-slide-pad-bottom pt-10"
      :class="[
        theme.gradientClass,
        theme.textClass,
        slide.media_url ? 'flex-[2] justify-end' : 'min-h-0 flex-1 justify-center pt-36',
      ]"
    >
      <h2
        v-if="slide.title"
        class="text-4xl font-bold leading-snug"
      >
        {{ slide.title }}
      </h2>
      <ul v-if="bullets.length" class="space-y-4 text-2xl leading-snug">
        <li
          v-for="(item, index) in bullets"
          :key="index"
          class="flex gap-3"
        >
          <span class="mt-1 h-2 w-2 shrink-0 rounded-full bg-white/70" />
          <span>{{ item }}</span>
        </li>
      </ul>
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
const bullets = computed(() => (props.slide.bullets || []).filter(Boolean).slice(0, 6))
</script>
