<template>
  <div class="relative flex h-full w-full flex-col overflow-hidden bg-[#FAF9F6] px-12 carousel-slide-pad-bottom pt-36 font-serif text-[#1A1A1A]">
    <div class="absolute carousel-slide-safe-bottom left-12 top-36 w-px bg-[#1A1A1A]/10" />

    <div
      v-if="slide.media_url"
      class="relative z-10 flex min-h-0 flex-[3] shrink-0 flex-col pl-8"
    >
      <div class="h-full min-h-[280px] overflow-hidden rounded-t-[4rem] rounded-b-2xl border border-black/5">
        <img
          :src="slide.media_url"
          alt=""
          crossorigin="anonymous"
          class="h-full w-full object-cover grayscale contrast-[1.05]"
        >
      </div>
    </div>

    <div
      class="relative z-10 flex min-h-0 flex-col pl-8"
      :class="slide.media_url ? 'flex-[2] justify-end space-y-6 pt-8' : 'flex-1 justify-center'"
    >
      <span v-if="!slide.media_url" class="text-8xl font-light leading-none text-gray-300">“</span>
      <div class="max-w-[95%] space-y-6">
        <h2 v-if="slide.title" class="text-4xl font-light leading-tight">
          {{ slide.title }}
        </h2>
        <div class="h-px w-12 bg-[#1A1A1A]" />
        <ul v-if="bullets.length" class="space-y-4 font-sans text-2xl font-light leading-relaxed text-gray-600">
          <li v-for="(item, index) in bullets" :key="index" class="flex items-start gap-4">
            <span v-if="!slide.media_url" class="font-serif text-2xl font-bold text-[#1A1A1A]">✓</span>
            <span>{{ item }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CarouselSlide } from '~/types/editorialCarousel'

const props = defineProps<{ slide: CarouselSlide }>()
const bullets = computed(() => (props.slide.bullets || []).filter(Boolean).slice(0, 5))
</script>
