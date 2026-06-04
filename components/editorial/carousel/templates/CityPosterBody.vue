<template>
  <div class="relative h-full w-full p-8 pb-32 pt-36">
    <div class="relative flex h-full w-full flex-col overflow-hidden border-[10px] border-white bg-stone-950 shadow-2xl">
      <img
        v-if="slide.media_url"
        :src="slide.media_url"
        alt=""
        crossorigin="anonymous"
        class="absolute inset-0 h-[48%] w-full object-cover"
      >
      <div
        class="relative z-10 flex flex-1 flex-col justify-end p-10"
        :class="slide.media_url ? 'mt-[48%]' : theme.gradientClass"
      >
        <h2 v-if="slide.title" class="mb-5 text-4xl font-black uppercase leading-none tracking-tight text-white">
          {{ slide.title }}
        </h2>
        <ul v-if="bullets.length" class="space-y-2 text-xl font-semibold uppercase tracking-wide text-white/90">
          <li v-for="(item, index) in bullets" :key="index">
            {{ item }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CarouselSlide } from '~/types/editorialCarousel'
import { resolveCarouselVibeTheme } from '~/utils/carouselVibeTheme'

const props = defineProps<{ slide: CarouselSlide; topicTags?: string[] }>()
const theme = computed(() => resolveCarouselVibeTheme(props.slide, props.topicTags))
const bullets = computed(() => (props.slide.bullets || []).filter(Boolean).slice(0, 5))
</script>
