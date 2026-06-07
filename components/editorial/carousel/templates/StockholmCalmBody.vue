<template>
  <div class="flex h-full w-full flex-col bg-[#F4F0EA] px-12 carousel-slide-pad-bottom pt-36 font-sans text-[#3E332E]">
    <div
      v-if="slide.media_url"
      class="flex min-h-0 flex-[3] shrink-0 flex-col"
    >
      <div class="h-full min-h-[280px] overflow-hidden rounded-[2rem] bg-white p-2 shadow-lg">
        <img
          :src="slide.media_url"
          alt=""
          crossorigin="anonymous"
          class="h-full w-full rounded-[1.5rem] object-cover"
        >
      </div>
    </div>

    <div
      class="flex min-h-0 flex-col"
      :class="slide.media_url ? 'flex-[2] justify-end space-y-5 pt-8' : 'flex-1 justify-center space-y-12'"
    >
      <div v-if="slide.title" :class="slide.media_url ? '' : 'space-y-4 text-center'">
        <span
          v-if="!slide.media_url"
          class="font-mono text-lg tracking-widest text-[#3E332E]/40 uppercase"
        >Checklist</span>
        <h2 class="text-5xl font-light leading-tight tracking-tight text-[#2B2320]">
          {{ slide.title }}
        </h2>
      </div>
      <div v-if="bullets.length" :class="slide.media_url ? 'space-y-4' : 'space-y-7'">
        <div
          v-for="(item, index) in bullets"
          :key="index"
          class="flex items-start gap-6 border-b border-[#3E332E]/10 pb-5 last:border-0"
        >
          <span class="shrink-0 font-mono text-2xl text-[#3E332E]/40">{{ String(index + 1).padStart(2, '0') }}</span>
          <p class="text-2xl font-light leading-relaxed text-[#3E332E]/80">{{ item }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CarouselSlide } from '~/types/editorialCarousel'

const props = defineProps<{ slide: CarouselSlide }>()
const bullets = computed(() => (props.slide.bullets || []).filter(Boolean).slice(0, 5))
</script>
