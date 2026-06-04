<template>
  <div class="flex h-full w-full flex-col items-center justify-center bg-[#f4efe6] px-12 pb-32 pt-36 text-center text-stone-900">
    <div class="max-w-[90%] rounded-[2rem] border-2 border-stone-900/15 bg-white px-12 py-10 shadow-xl">
      <p class="font-serif text-4xl font-bold leading-tight">
        {{ slide.cta_text || slide.title || 'Вся афиша в городе' }}
      </p>
      <p v-if="linkHint" class="mt-5 text-xl text-stone-600">
        {{ linkHint }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CarouselSlide } from '~/types/editorialCarousel'

defineProps<{
  slide: CarouselSlide
  linkHint?: string | null
}>()
</script>
