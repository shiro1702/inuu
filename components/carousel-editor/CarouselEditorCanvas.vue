<template>
  <div class="flex flex-1 items-center justify-center bg-gray-950/95 px-3 py-4">
    <CarouselSlidePreview
      ref="previewRef"
      :slide="slide"
      :aspect="aspect"
      :template-id="templateId"
      :brand-name="brandName"
      :city-name="cityName"
      :city-slug="citySlug"
      :logo-url="logoUrl"
      :topic-tags="topicTags"
      :link-hint="linkHint"
      :slide-index="slideIndex"
      :total-slides="totalSlides"
      :max-width="maxWidth"
      editable
      @sticker-update="(id, patch) => $emit('sticker-update', id, patch)"
    />
  </div>
</template>

<script setup lang="ts">
import type { CarouselAspect, CarouselCanvasObject, CarouselSlide, CarouselTemplateId } from '~/types/editorialCarousel'
import CarouselSlidePreview from '~/components/editorial/carousel/CarouselSlidePreview.vue'
import { resolveCarouselBrandLogo } from '~/utils/carouselBrandLogo'
import { delayMs, waitForCarouselPaint } from '~/utils/carouselExport'

defineEmits<{
  'sticker-update': [objectId: string, patch: Partial<CarouselCanvasObject>]
}>()

const props = defineProps<{
  slide: CarouselSlide | null
  aspect: CarouselAspect
  templateId: CarouselTemplateId
  cityName?: string
  citySlug?: string
  topicTags?: string[]
  linkHint?: string
  slideIndex: number
  totalSlides: number
}>()

const config = useRuntimeConfig()
const brandName = computed(() => {
  const raw = config.public.brandName
  return typeof raw === 'string' && raw.trim() ? raw.trim() : 'INUU'
})
const logoUrl = computed(() => resolveCarouselBrandLogo(config))
const maxWidth = computed(() => (props.aspect === '9:16' ? 280 : 320))

const previewRef = ref<InstanceType<typeof CarouselSlidePreview> | null>(null)

async function prepareSlideForExport(): Promise<HTMLElement> {
  for (let attempt = 0; attempt < 10; attempt++) {
    await nextTick()
    await waitForCarouselPaint()
    const node = previewRef.value?.getFrameElement?.()
    if (node) return node
    await delayMs(50)
  }
  throw new Error('Слайд не готов к экспорту')
}

defineExpose({ prepareSlideForExport })
</script>
