<template>
  <div class="relative flex h-full w-full flex-col overflow-hidden bg-[#FFFDF9] px-10 carousel-slide-pad-bottom pt-36 font-serif text-[#2D362E]">
    <div class="pointer-events-none absolute inset-6 rounded-2xl border border-[#2D362E]/10" />

    <div
      v-if="slide.media_url"
      class="relative z-10 flex min-h-0 flex-[3] shrink-0 flex-col px-4"
    >
      <div class="h-full min-h-[280px] overflow-hidden rounded-2xl shadow-lg">
        <img
          :src="slide.media_url"
          alt=""
          crossorigin="anonymous"
          class="h-full w-full object-cover"
        >
      </div>
    </div>

    <div
      class="relative z-10 flex min-h-0 flex-col px-4"
      :class="slide.media_url ? 'flex-[2] justify-end space-y-6 pt-8' : 'flex-1 justify-center'"
    >
      <h2 v-if="slide.title" class="text-4xl font-normal leading-snug">
        {{ slide.title }}
      </h2>
      <ul v-if="bullets.length" class="space-y-4 font-sans text-2xl font-light leading-relaxed text-[#2D362E]/70">
        <li
          v-for="(item, index) in bullets"
          :key="index"
          :class="slide.media_url ? '' : 'border-l-2 border-[#2D362E]/20 pl-6'"
        >
          {{ item }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CarouselSlide } from '~/types/editorialCarousel'

const props = defineProps<{ slide: CarouselSlide }>()
const bullets = computed(() => (props.slide.bullets || []).filter(Boolean).slice(0, 5))
</script>
