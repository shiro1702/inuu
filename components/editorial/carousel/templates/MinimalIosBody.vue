<template>
  <div class="relative flex h-full w-full">
    <div
      v-if="slide.media_url"
      class="w-1/2 shrink-0"
    >
      <img
        :src="slide.media_url"
        alt=""
        crossorigin="anonymous"
        class="h-full w-full object-cover"
      >
    </div>
    <div
      class="flex flex-1 flex-col justify-center gap-6 p-12"
      :class="[theme.gradientClass, theme.textClass]"
    >
      <h2
        v-if="slide.title"
        class="text-3xl font-bold leading-snug"
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
