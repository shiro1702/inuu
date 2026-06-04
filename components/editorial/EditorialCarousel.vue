<template>
  <section class="space-y-3">
    <h2 class="text-sm font-medium uppercase tracking-wide text-gray-500">
      Карусель для соцсетей
    </h2>
    <div class="relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-950">
      <div class="mx-auto max-w-md">
        <div class="origin-top scale-[0.32] sm:scale-[0.42]">
          <CarouselSlideRenderer
            :slide="activeSlide"
            :aspect="aspect"
            :template-id="carousel.template_id"
            :brand-name="brandName"
            :topic-tags="topicTags"
            :link-hint="linkHint"
          />
        </div>
      </div>
      <button
        v-if="slides.length > 1"
        type="button"
        class="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white"
        aria-label="Предыдущий слайд"
        @click="prev"
      >
        ‹
      </button>
      <button
        v-if="slides.length > 1"
        type="button"
        class="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white"
        aria-label="Следующий слайд"
        @click="next"
      >
        ›
      </button>
      <div
        v-if="slides.length > 1"
        class="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5"
      >
        <button
          v-for="(_, i) in slides"
          :key="i"
          type="button"
          class="h-1.5 rounded-full transition-all"
          :class="i === activeIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/50'"
          :aria-label="`Слайд ${i + 1}`"
          @click="activeIndex = i"
        />
      </div>
    </div>
    <p class="text-xs text-gray-500">
      {{ activeIndex + 1 }} / {{ slides.length }} · {{ aspect }}
    </p>
  </section>
</template>

<script setup lang="ts">
import type { EditorialCarouselMetadata } from '~/types/editorialCarousel'
import CarouselSlideRenderer from '~/components/editorial/carousel/CarouselSlideRenderer.vue'

const props = defineProps<{
  carousel: EditorialCarouselMetadata
  brandName?: string
  topicTags?: string[]
  linkHint?: string | null
}>()

const activeIndex = ref(0)
const slides = computed(() => props.carousel.slides || [])
const aspect = computed(() => props.carousel.aspect || '4:5')
const activeSlide = computed(() => slides.value[activeIndex.value] || slides.value[0]!)

watch(
  () => props.carousel,
  () => {
    activeIndex.value = 0
  },
)

function prev() {
  const len = slides.value.length
  if (!len) return
  activeIndex.value = (activeIndex.value - 1 + len) % len
}

function next() {
  const len = slides.value.length
  if (!len) return
  activeIndex.value = (activeIndex.value + 1) % len
}
</script>
