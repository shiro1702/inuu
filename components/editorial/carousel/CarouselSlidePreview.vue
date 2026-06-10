<template>
  <div
    ref="hostRef"
    class="carousel-slide-preview relative mx-auto w-full overflow-hidden rounded-lg bg-gray-950"
    :style="hostStyle"
  >
    <div
      v-if="slide"
      ref="scaledRef"
      class="absolute left-1/2 top-0"
      :style="innerStyle"
    >
      <CarouselSlideRenderer
        ref="rendererRef"
        :slide="slideForRenderer"
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
      <CarouselStickerOverlay
        v-if="stickerObjects.length"
        :objects="stickerObjects"
        :aspect="aspect"
        :frame-el="frameEl"
        :editable="editable"
        @update="(id, patch) => $emit('sticker-update', id, patch)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CarouselAspect, CarouselCanvasObject, CarouselSlide, CarouselTemplateId } from '~/types/editorialCarousel'
import { CAROUSEL_EXPORT_SIZES } from '~/types/editorialCarousel'
import CarouselSlideRenderer from '~/components/editorial/carousel/CarouselSlideRenderer.vue'
import CarouselStickerOverlay from '~/components/carousel-editor/CarouselStickerOverlay.vue'
import { getSlideStickerObjects } from '~/utils/carouselSlideObjects'
import { slideV2ToV1 } from '~/utils/carouselSlideAdapter'
import { isCarouselSlideV2 } from '~/types/editorialCarousel'

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
    /** Разрешить drag стикеров на холсте */
    editable?: boolean
  }>(),
  {
    maxWidth: 0,
    brandName: 'INUU',
    slideIndex: 1,
    totalSlides: 1,
    editable: false,
  },
)

defineEmits<{
  'sticker-update': [objectId: string, patch: Partial<CarouselCanvasObject>]
}>()

const hostRef = ref<HTMLElement | null>(null)
const scaledRef = ref<HTMLElement | null>(null)
const rendererRef = ref<InstanceType<typeof CarouselSlideRenderer> | null>(null)
const hostWidth = ref(280)

const frameEl = ref<HTMLElement | null>(null)

function syncFrameEl() {
  frameEl.value = rendererRef.value?.getFrameElement?.() ?? null
}

watch(rendererRef, () => nextTick(syncFrameEl), { immediate: true })
watch(() => props.slide, () => nextTick(syncFrameEl))

const stickerObjects = computed(() => getSlideStickerObjects(props.slide))

const slideForRenderer = computed(() => {
  const s = props.slide
  if (!s) return null
  return isCarouselSlideV2(s) ? slideV2ToV1(s) : s
})

function getFrameElement(): HTMLElement | null {
  if (stickerObjects.value.length && scaledRef.value) return scaledRef.value
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
    aspectRatio:
      props.aspect === '1:1'
        ? '1 / 1'
        : props.aspect === '16:9'
          ? '16 / 9'
          : props.aspect === '9:16'
            ? '9 / 16'
            : '4 / 5',
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
