<template>
  <div class="space-y-2 rounded-lg border border-dashed border-gray-200 p-3">
    <p class="text-sm font-medium text-gray-800">Экспорт карусели (PNG)</p>
    <p class="text-xs text-gray-500">{{ carousel.slides.length }} слайдов · {{ carousel.aspect }}</p>
    <div class="pointer-events-none fixed -left-[9999px] top-0 opacity-0">
      <CarouselSlideRenderer
        v-for="(slide, index) in carousel.slides"
        :key="`${slide.role}-${index}`"
        :ref="(el) => setRendererRef(el, index)"
        :slide="slide"
        :aspect="carousel.aspect"
        :template-id="carousel.template_id"
        :brand-name="brandName"
        :topic-tags="topicTags"
        :link-hint="linkHint"
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
import { downloadBlob, preloadCarouselMedia, renderSlideToPng } from '~/utils/renderSlideToPng'

const props = defineProps<{
  carousel: EditorialCarouselMetadata
  brandName?: string
  topicTags?: string[]
  linkHint?: string | null
}>()

const exporting = ref(false)
const errorText = ref('')
const rendererRefs = ref<Array<InstanceType<typeof CarouselSlideRenderer> | null>>([])

function setRendererRef(el: unknown, index: number) {
  rendererRefs.value[index] = el as InstanceType<typeof CarouselSlideRenderer> | null
}

async function exportAll() {
  errorText.value = ''
  exporting.value = true
  try {
    await preloadCarouselMedia(props.carousel.slides.map((s) => s.media_url))
    await nextTick()
    for (let i = 0; i < props.carousel.slides.length; i++) {
      const node = rendererRefs.value[i]?.getFrameElement?.()
      if (!node) throw new Error(`Слайд ${i + 1} не готов`)
      const blob = await renderSlideToPng(node, { aspect: props.carousel.aspect })
      const role = props.carousel.slides[i]?.role || `slide-${i + 1}`
      downloadBlob(blob, `carousel-${role}-${i + 1}.png`)
    }
  } catch (err: unknown) {
    errorText.value = err instanceof Error ? err.message : 'Ошибка экспорта'
  } finally {
    exporting.value = false
  }
}
</script>
