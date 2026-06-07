<template>
  <div
    ref="hostRef"
    class="carousel-slide-preview relative mx-auto w-full overflow-hidden rounded-lg bg-gray-950"
    :style="hostStyle"
  >
    <div
      v-if="slide"
      class="absolute left-1/2 top-0"
      :style="innerStyle"
    >
      <CarouselSlideRenderer
        ref="rendererRef"
        :slide="slide"
        :aspect="aspect"
        :template-id="templateId"
        :brand-name="brandName"
        :city-name="cityName"
        :logo-url="logoUrl"
        :topic-tags="topicTags"
        :link-hint="linkHint"
        :slide-index="slideIndex"
        :total-slides="totalSlides"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CarouselAspect, CarouselSlide, CarouselTemplateId } from '~/types/editorialCarousel'
import { CAROUSEL_EXPORT_SIZES } from '~/types/editorialCarousel'
import CarouselSlideRenderer from '~/components/editorial/carousel/CarouselSlideRenderer.vue'

const props = withDefaults(
  defineProps<{
    slide: CarouselSlide | null
    aspect: CarouselAspect
    templateId?: CarouselTemplateId
    brandName?: string
    cityName?: string
    logoUrl?: string
    topicTags?: string[]
    linkHint?: string | null
    slideIndex?: number
    totalSlides?: number
    /** Макс. ширина превью в px */
    maxWidth?: number
  }>(),
  {
    maxWidth: 0,
    brandName: 'INUU',
    slideIndex: 1,
    totalSlides: 1,
  },
)

const hostRef = ref<HTMLElement | null>(null)
const rendererRef = ref<InstanceType<typeof CarouselSlideRenderer> | null>(null)
const hostWidth = ref(280)

function getFrameElement(): HTMLElement | null {
  return rendererRef.value?.getFrameElement?.() ?? null
}

defineExpose({ getFrameElement })

const exportSize = computed(() => CAROUSEL_EXPORT_SIZES[props.aspect])

const scale = computed(() => {
  const w = hostWidth.value
  if (!w) return 0.26
  return w / exportSize.value.width
})

const hostStyle = computed(() => {
  const maxW = props.maxWidth > 0
    ? props.maxWidth
    : props.aspect === '9:16'
      ? 240
      : 320
  return {
    aspectRatio: props.aspect === '4:5' ? '4 / 5' : '9 / 16',
    maxWidth: `${maxW}px`,
    width: '100%',
  }
})

const innerStyle = computed(() => ({
  width: `${exportSize.value.width}px`,
  height: `${exportSize.value.height}px`,
  transform: `translateX(-50%) scale(${scale.value})`,
  transformOrigin: 'top center',
}))

function measureHost() {
  const el = hostRef.value
  if (!el) return
  hostWidth.value = el.clientWidth
}

let resizeObserver: ResizeObserver | null = null

function bindObserver(el: HTMLElement | null) {
  resizeObserver?.disconnect()
  if (!el) return
  resizeObserver = new ResizeObserver(() => measureHost())
  resizeObserver.observe(el)
  measureHost()
}

onMounted(() => {
  bindObserver(hostRef.value)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
})

watch(hostRef, (el) => bindObserver(el))

watch(
  () => props.aspect,
  () => nextTick(measureHost),
)
</script>
