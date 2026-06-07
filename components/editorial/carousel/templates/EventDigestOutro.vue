<template>
  <div class="relative flex h-full w-full flex-col bg-black px-10 pt-36 carousel-slide-pad-bottom">
    <div class="flex min-h-0 flex-1 flex-col items-center justify-center space-y-10 text-center">
      <CarouselOutroQr
        :link-hint="linkHint"
        :size="840"
        frame-class="rounded-3xl border-2 border-white/20 bg-white p-5 shadow-xl"
        image-class="h-[30rem] w-[30rem] rounded-2xl"
        placeholder-class="flex h-[30rem] w-[30rem] items-center justify-center rounded-2xl bg-white/90"
      />

      <div class="max-w-[90%] space-y-4">
        <p class="text-4xl font-bold leading-tight text-white">
          {{ slide.cta_text || slide.title || 'Вся афиша в городе' }}
        </p>
        <p v-if="linkHint" class="text-2xl text-white/70">
          Наведите камеру на QR-код
        </p>
      </div>

      <span
        v-if="linkLabel"
        class="rounded-full border-2 border-white px-10 py-4 text-2xl font-bold text-white"
      >
        {{ linkLabel }}
      </span>
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
