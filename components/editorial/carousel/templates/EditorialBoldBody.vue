<template>
  <div class="flex h-full w-full flex-col bg-[#f4efe6] px-12 carousel-slide-pad-bottom pt-36 text-stone-900">
    <div
      v-if="slide.media_url"
      class="mb-8 h-[42%] shrink-0 overflow-hidden rounded-3xl shadow-xl ring-1 ring-stone-900/10"
    >
      <img
        :src="slide.media_url"
        alt=""
        crossorigin="anonymous"
        class="h-full w-full object-cover"
      >
    </div>
    <h2 v-if="slide.title" class="mb-5 font-serif text-4xl font-bold leading-tight">
      {{ slide.title }}
    </h2>
    <ul v-if="bullets.length" class="space-y-3 text-2xl leading-snug text-stone-700">
      <li v-for="(item, index) in bullets" :key="index" class="border-l-4 border-stone-900/25 pl-5">
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { CarouselSlide } from '~/types/editorialCarousel'

const props = defineProps<{ slide: CarouselSlide }>()
const bullets = computed(() => (props.slide.bullets || []).filter(Boolean).slice(0, 6))
</script>
