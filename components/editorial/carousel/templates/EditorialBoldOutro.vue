<template>
  <div class="flex h-full w-full flex-col items-center justify-center bg-[#f4efe6] px-12 carousel-slide-pad-bottom pt-36 text-center text-stone-900">
    <CarouselOutroQr
      v-if="linkHint"
      :link-hint="linkHint"
      :size="840"
      frame-class="mb-8 rounded-[2rem] border-2 border-stone-900/10 bg-white p-5 shadow-xl"
      image-class="h-[30rem] w-[30rem] rounded-2xl"
      placeholder-class="flex h-[30rem] w-[30rem] items-center justify-center rounded-2xl bg-stone-100"
    />
    <div class="max-w-[90%] rounded-[2rem] border-2 border-stone-900/15 bg-white px-12 py-10 shadow-xl">
      <p class="font-serif text-4xl font-bold leading-tight">
        {{ slide.cta_text || slide.title || 'Вся афиша в городе' }}
      </p>
      <p v-if="linkLabel" class="mt-5 text-xl text-stone-600">
        {{ linkLabel }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CarouselSlide } from '~/types/editorialCarousel'
import CarouselOutroQr from '~/components/editorial/carousel/CarouselOutroQr.vue'
import { carouselQrLinkLabel } from '~/utils/carouselQrCode'

const props = defineProps<{
  slide: CarouselSlide
  linkHint?: string | null
}>()

const linkLabel = computed(() => carouselQrLinkLabel(props.linkHint))
</script>
