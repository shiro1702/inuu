<template>
  <section class="space-y-3">
    <h2
      v-if="showHeading"
      class="text-sm font-medium uppercase tracking-wide text-gray-500"
    >
      Карусель для соцсетей
    </h2>
    <div class="relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-100/80 p-3">
      <CarouselSlidePreview
        ref="previewRef"
        :slide="activeSlide"
        :aspect="aspect"
        :template-id="carousel.template_id"
        :brand-name="serviceBrandName"
        :city-name="cityDisplayName"
        :logo-url="logoUrl"
        :topic-tags="topicTags"
        :link-hint="linkHint"
        :slide-index="activeIndex + 1"
        :total-slides="slides.length"
        :max-width="maxWidth"
      />
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
    </div>
    <div
      v-if="slides.length > 1"
      class="flex justify-center gap-1.5"
    >
      <button
        v-for="(_, i) in slides"
        :key="i"
        type="button"
        class="h-1.5 rounded-full transition-all"
        :class="i === activeIndex ? 'w-6 bg-gray-800' : 'w-1.5 bg-gray-300'"
        :aria-label="`Слайд ${i + 1}`"
        @click="activeIndex = i"
      />
    </div>
    <p class="text-xs text-gray-500">
      {{ activeIndex + 1 }} / {{ slides.length }} · {{ aspect }}
    </p>
  </section>
</template>

<script setup lang="ts">
import type { EditorialCarouselMetadata } from '~/types/editorialCarousel'
import CarouselSlidePreview from '~/components/editorial/carousel/CarouselSlidePreview.vue'
import { delayMs, waitForCarouselPaint } from '~/utils/carouselExport'
import { resolveCarouselBrandLogo } from '~/utils/carouselBrandLogo'

const props = withDefaults(
  defineProps<{
    carousel: EditorialCarouselMetadata
    /** Название города под логотипом */
    brandName?: string
    topicTags?: string[]
    linkHint?: string | null
    /** Макс. ширина превью в px */
    maxWidth?: number
    showHeading?: boolean
  }>(),
  {
    maxWidth: 400,
    showHeading: true,
  },
)

const config = useRuntimeConfig()
const serviceBrandName = computed(() => {
  const raw = config.public.brandName
  return typeof raw === 'string' && raw.trim() ? raw.trim() : 'INUU'
})
const cityDisplayName = computed(() => props.brandName?.trim() || '')
const logoUrl = computed(() => resolveCarouselBrandLogo(config))

const activeIndex = ref(0)
const previewRef = ref<InstanceType<typeof CarouselSlidePreview> | null>(null)
const slides = computed(() => props.carousel.slides || [])
const aspect = computed(() => props.carousel.aspect || '4:5')
const activeSlide = computed(() => slides.value[activeIndex.value] || slides.value[0]!)

watch(
  () => [props.carousel.aspect, props.carousel.template_id] as const,
  () => {
    activeIndex.value = 0
  },
)

watch(
  () => slides.value.length,
  (len) => {
    if (activeIndex.value >= len) {
      activeIndex.value = Math.max(0, len - 1)
    }
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

async function prepareSlideForExport(index: number): Promise<HTMLElement> {
  const len = slides.value.length
  if (!len) throw new Error('Нет слайдов для экспорта')
  const safeIndex = Math.min(Math.max(index, 0), len - 1)
  activeIndex.value = safeIndex

  for (let attempt = 0; attempt < 10; attempt++) {
    await nextTick()
    await waitForCarouselPaint()
    const node = previewRef.value?.getFrameElement?.()
    if (node) return node
    await delayMs(50)
  }
  throw new Error(`Слайд ${safeIndex + 1} не готов`)
}

defineExpose({ prepareSlideForExport })
</script>
