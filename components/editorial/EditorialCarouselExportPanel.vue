<template>
  <div class="space-y-2 rounded-lg border border-dashed border-gray-200 p-3">
    <p class="text-sm font-medium text-gray-800">Экспорт карусели (PNG)</p>
    <p class="text-xs text-gray-500">{{ carousel.slides.length }} слайдов · {{ carousel.aspect }}</p>
    <div class="pointer-events-none fixed -left-[10000px] top-0">
      <CarouselSlideRenderer
        v-show="exporting"
        ref="exportRendererRef"
        :key="`${exportSlideIndex}-${exportingSlide?.role ?? 'slide'}`"
        :slide="exportingSlide ?? carousel.slides[0]!"
        :aspect="carousel.aspect"
        :template-id="carousel.template_id"
        :brand-name="serviceBrandName"
        :city-name="cityDisplayName"
        :logo-url="logoUrl"
        :topic-tags="topicTags"
        :link-hint="linkHint"
        :slide-index="exportSlideIndex"
        :total-slides="carousel.slides.length"
      />
    </div>
    <button
      type="button"
      class="rounded-lg border border-gray-200 px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"
      :disabled="exporting"
      @click="exportAll"
    >
      {{ exporting ? 'Рендер…' : 'Скачать все PNG' }}
    </button>
    <p v-if="errorText" class="text-xs text-red-600">{{ errorText }}</p>
  </div>
</template>

<script setup lang="ts">
import type { EditorialCarouselMetadata } from '~/types/editorialCarousel'
import CarouselSlideRenderer from '~/components/editorial/carousel/CarouselSlideRenderer.vue'
import { resolveCarouselBrandLogo } from '~/utils/carouselBrandLogo'
import { delayMs, waitForCarouselPaint, waitForQrImages } from '~/utils/carouselExport'
import { generateCarouselQrDataUrl } from '~/utils/carouselQrCode'
import { downloadBlob, preloadCarouselMedia, renderSlideToPng } from '~/utils/renderSlideToPng'

const props = defineProps<{
  carousel: EditorialCarouselMetadata
  brandName?: string
  topicTags?: string[]
  linkHint?: string | null
}>()

const config = useRuntimeConfig()
const serviceBrandName = computed(() => {
  const raw = config.public.brandName
  return typeof raw === 'string' && raw.trim() ? raw.trim() : 'INUU'
})
const cityDisplayName = computed(() => props.brandName?.trim() || '')
const logoUrl = computed(() => resolveCarouselBrandLogo(config))

const exporting = ref(false)
const errorText = ref('')
const exportingSlide = ref<EditorialCarouselMetadata['slides'][number] | null>(null)
const exportSlideIndex = ref(1)
const exportRendererRef = ref<InstanceType<typeof CarouselSlideRenderer> | null>(null)

async function resolveExportFrameElement(slideNumber: number): Promise<HTMLElement> {
  for (let attempt = 0; attempt < 10; attempt++) {
    await nextTick()
    await waitForCarouselPaint()
    const node = exportRendererRef.value?.getFrameElement?.()
    if (node) return node
    await delayMs(50)
  }
  throw new Error(`Слайд ${slideNumber} не готов`)
}

async function exportAll() {
  errorText.value = ''
  const firstSlide = props.carousel.slides[0]
  if (!firstSlide) {
    errorText.value = 'Нет слайдов для экспорта'
    return
  }

  exporting.value = true
  exportingSlide.value = firstSlide
  exportSlideIndex.value = 1

  try {
    const qrDataUrl = props.linkHint?.trim()
      ? await generateCarouselQrDataUrl(props.linkHint, { size: 960 })
      : null
    await preloadCarouselMedia([...props.carousel.slides.map((s) => s.media_url), qrDataUrl])
    await resolveExportFrameElement(1)

    for (let i = 0; i < props.carousel.slides.length; i++) {
      const slide = props.carousel.slides[i]!
      exportSlideIndex.value = i + 1
      exportingSlide.value = slide
      const node = await resolveExportFrameElement(i + 1)
      if (slide.role === 'outro') await waitForQrImages(node)
      const blob = await renderSlideToPng(node, { aspect: props.carousel.aspect })
      downloadBlob(blob, `carousel-${i + 1}.png`)
      if (i < props.carousel.slides.length - 1) await delayMs(250)
    }
  } catch (err: unknown) {
    errorText.value = err instanceof Error ? err.message : 'Ошибка экспорта'
  } finally {
    exportingSlide.value = null
    exporting.value = false
  }
}
</script>
