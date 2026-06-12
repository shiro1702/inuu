<template>
  <div class="flex min-h-dvh flex-col bg-gray-900 text-white">
    <CarouselEditorHeader
      :title="store.title"
      :saving="store.saving"
      @back="$emit('back')"
      @update:title="onTitle"
      @styles="styleSheetOpen = true"
      @save="onSave"
      @share="onShare"
    />

    <CarouselEditorCanvas
      ref="canvasRef"
      :slide="activeSlide"
      :aspect="store.aspect"
      :template-id="store.templateId"
      :city-name="store.cityName"
      :city-slug="store.citySlug"
      :topic-tags="[store.vibeKey]"
      :link-hint="store.linkHint"
      :slide-index="store.currentSlideIndex + 1"
      :total-slides="store.slides.length"
      @sticker-update="onStickerUpdate"
    />

    <CarouselEditorNav
      :can-prev="store.currentSlideIndex > 0"
      :can-next="store.currentSlideIndex < store.slides.length - 1"
      @prev="store.prevSlide()"
      @next="store.nextSlide()"
    />

    <CarouselEditorThumbBar
      :slide-count="store.slides.length"
      :current-index="store.currentSlideIndex"
      @select="store.setCurrentSlideIndex"
      @edit-slide="editSheetOpen = true"
      @all-slides="allSlidesOpen = true"
      @import-text="importTextOpen = true"
      @tab="onTab"
    />

    <div v-if="statusText" class="px-3 pb-2 text-center text-xs" :class="statusOk ? 'text-emerald-400' : 'text-red-400'">
      {{ statusText }}
    </div>

    <div class="grid grid-cols-2 gap-2 border-t border-gray-700 px-3 py-2 pb-safe">
      <button
        type="button"
        class="rounded-xl bg-white/10 py-2 text-sm font-medium disabled:opacity-50"
        :disabled="exporting"
        @click="downloadPngs"
      >
        {{ exporting ? 'Рендер…' : 'Скачать PNG' }}
      </button>
      <button
        v-if="showTelegramSend"
        type="button"
        class="rounded-xl bg-sky-600 py-2 text-sm font-medium disabled:opacity-50"
        :disabled="sendingTg"
        @click="$emit('send-telegram')"
      >
        {{ sendingTg ? '…' : 'Отправить в TG' }}
      </button>
    </div>

    <CarouselEditSlideSheet
      :open="editSheetOpen"
      :slide="activeSlide"
      :slide-index="store.currentSlideIndex"
      :total-slides="store.slides.length"
      :carousel-title="store.title"
      :vibe-key="store.vibeKey"
      :city-slug="store.citySlug"
      @close="editSheetOpen = false"
      @patch="onSlidePatch"
      @generated="onSlideAiGenerated"
    />

    <CarouselAllSlidesSheet
      :open="allSlidesOpen"
      :slides="store.slides"
      :current-index="store.currentSlideIndex"
      @close="allSlidesOpen = false"
      @select="onSelectSlide"
      @edit="onEditSlideAt"
      @move-up="store.moveSlideUp"
      @move-down="store.moveSlideDown"
      @remove="store.removeSlide"
      @add="store.addSlide"
      @import-text="openImportFromAllSlides"
    />

    <CarouselImportTextSheet
      :open="importTextOpen"
      :city-slug="store.citySlug"
      @close="importTextOpen = false"
      @generated="onTextGenerated"
    />

    <CarouselStickerSheet
      :open="stickerSheetOpen"
      :items="stickers"
      :loading="stickersLoading"
      @close="stickerSheetOpen = false"
      @pick="onStickerPick"
    />

    <CarouselTemplateSheet
      :open="templateSheetOpen"
      :items="templates"
      :loading="templatesLoading"
      @close="templateSheetOpen = false"
      @save="onSaveTemplate"
      @apply="onApplyTemplate"
    />

    <CarouselStyleSheet
      :open="styleSheetOpen"
      :template-id="store.templateId"
      :vibe-key="store.vibeKey"
      :aspect="store.aspect"
      :link-hint="store.linkHint"
      :project-type="store.projectType"
      :show-project-type="showProjectType"
      :show-all-aspects="showAllAspects"
      @close="styleSheetOpen = false"
      @update:template-id="store.setTemplateId($event)"
      @update:vibe-key="store.setVibeKey($event)"
      @update:aspect="onAspect"
      @update:link-hint="onLinkHint"
      @update:project-type="store.setProjectType($event as CarouselProjectType)"
    />
  </div>
</template>

<script setup lang="ts">
import type { CarouselAspect, CarouselCanvasObject, CarouselSlide, CarouselSlideV2 } from '~/types/editorialCarousel'
import { normalizeSlideToV2 } from '~/utils/carouselSlideAdapter'
import type { CarouselProjectType } from '~/server/utils/generatedCarouselWrite'
import { isMetaLikeSlideTitle } from '~/utils/parseSlideEventText'
import { useCarouselEditorStore } from '~/stores/carouselEditor'
import CarouselEditorHeader from '~/components/carousel-editor/CarouselEditorHeader.vue'
import CarouselEditorCanvas from '~/components/carousel-editor/CarouselEditorCanvas.vue'
import CarouselEditorNav from '~/components/carousel-editor/CarouselEditorNav.vue'
import CarouselEditorThumbBar from '~/components/carousel-editor/CarouselEditorThumbBar.vue'
import CarouselEditSlideSheet from '~/components/carousel-editor/CarouselEditSlideSheet.vue'
import CarouselAllSlidesSheet from '~/components/carousel-editor/CarouselAllSlidesSheet.vue'
import CarouselImportTextSheet from '~/components/carousel-editor/CarouselImportTextSheet.vue'
import CarouselStyleSheet from '~/components/carousel-editor/CarouselStyleSheet.vue'
import CarouselStickerSheet, { type StickerItem } from '~/components/carousel-editor/CarouselStickerSheet.vue'
import CarouselTemplateSheet, { type UserTemplateItem } from '~/components/carousel-editor/CarouselTemplateSheet.vue'
import { delayMs, waitForQrImages } from '~/utils/carouselExport'
import { generateCarouselQrDataUrl } from '~/utils/carouselQrCode'
import { downloadBlob, preloadCarouselMedia, renderSlideToPng } from '~/utils/renderSlideToPng'

withDefaults(
  defineProps<{
    showTelegramSend?: boolean
    showProjectType?: boolean
    showAllAspects?: boolean
    sendingTg?: boolean
  }>(),
  {
    showTelegramSend: false,
    showProjectType: false,
    showAllAspects: false,
    sendingTg: false,
  },
)

defineEmits<{
  back: []
  'send-telegram': []
}>()

const store = useCarouselEditorStore()
const editSheetOpen = ref(false)
const allSlidesOpen = ref(false)
const importTextOpen = ref(false)
const styleSheetOpen = ref(false)
const stickerSheetOpen = ref(false)
const templateSheetOpen = ref(false)
const stickers = ref<StickerItem[]>([])
const stickersLoading = ref(false)
const templates = ref<UserTemplateItem[]>([])
const templatesLoading = ref(false)
const exporting = ref(false)
const statusText = ref('')
const statusOk = ref(false)
const canvasRef = ref<InstanceType<typeof CarouselEditorCanvas> | null>(null)

const activeSlide = computed(() => store.slides[store.currentSlideIndex] || null)

function onTitle(value: string) {
  store.title = value
  store.markDirty()
}

function onLinkHint(value: string) {
  store.linkHint = value
  store.markDirty()
}

function onAspect(value: string) {
  store.setAspect(value)
}

function onSlidePatch(patch: Partial<CarouselSlide>) {
  store.updateSlide(store.currentSlideIndex, patch)
}

function onSlideAiGenerated(generated: CarouselSlide) {
  const idx = store.currentSlideIndex
  const existing = store.slides[idx]
  const role = existing?.role || generated.role
  const existingV2 = existing ? normalizeSlideToV2(existing) : null
  const generatedV2 = normalizeSlideToV2({ ...generated, role }) as CarouselSlideV2

  const keepObjects = existingV2?.objects?.length ? existingV2.objects : generatedV2.objects
  const existingTitle = existing?.title?.trim()
  const generatedTitle = generatedV2.title?.trim()
  const keepTitle =
    Boolean(existingTitle) &&
    (!generatedTitle || isMetaLikeSlideTitle(generatedTitle))

  store.updateSlide(idx, {
    ...generatedV2,
    role,
    title: keepTitle ? existingTitle : generatedV2.title,
    objects: keepObjects,
  })

  editSheetOpen.value = false
  statusOk.value = true
  statusText.value = `Слайд ${idx + 1} сгенерирован ИИ`
}

async function loadStickers() {
  stickersLoading.value = true
  try {
    const res = await $fetch<{ ok: boolean; items: StickerItem[] }>('/api/dashboard/carousel/stickers')
    stickers.value = res?.items || []
  } finally {
    stickersLoading.value = false
  }
}

async function loadTemplates() {
  templatesLoading.value = true
  try {
    const res = await $fetch<{ ok: boolean; items: UserTemplateItem[] }>('/api/dashboard/carousel/templates')
    templates.value = res?.items || []
  } finally {
    templatesLoading.value = false
  }
}

function onTab(tab: 'text' | 'stickers' | 'templates') {
  if (tab === 'text') editSheetOpen.value = true
  if (tab === 'stickers') {
    stickerSheetOpen.value = true
    void loadStickers()
  }
  if (tab === 'templates') {
    templateSheetOpen.value = true
    void loadTemplates()
  }
}

function onStickerPick(item: StickerItem) {
  store.addStickerToCurrentSlide(item)
  stickerSheetOpen.value = false
  statusOk.value = true
  statusText.value = `Стикер «${item.name}» добавлен на слайд ${store.currentSlideIndex + 1}`
}

function onStickerUpdate(objectId: string, patch: Partial<CarouselCanvasObject>) {
  store.updateCanvasObject(store.currentSlideIndex, objectId, patch)
}

function onSelectSlide(index: number) {
  store.setCurrentSlideIndex(index)
}

function onEditSlideAt(index: number) {
  store.setCurrentSlideIndex(index)
  allSlidesOpen.value = false
  editSheetOpen.value = true
}

function openImportFromAllSlides() {
  allSlidesOpen.value = false
  importTextOpen.value = true
}

function onTextGenerated(payload: {
  slides: CarouselSlide[]
  title?: string
  telegramPostText?: string
}) {
  store.replaceSlides(payload.slides)
  if (payload.title) {
    store.title = payload.title
    store.markDirty()
  }
  if (payload.telegramPostText) {
    store.telegramPostText = payload.telegramPostText
    store.markDirty()
  }
  importTextOpen.value = false
  statusOk.value = true
  statusText.value = `Готово: ${payload.slides.length} слайдов`
}

async function onSaveTemplate(name: string) {
  if (!name.trim() || !store.citySlug) return
  await $fetch('/api/dashboard/carousel/templates', {
    method: 'POST',
    body: {
      name: name.trim(),
      city_slug: store.citySlug,
      theme_id: store.templateId,
      project_type: store.projectType,
      layout_config: store.buildLayoutConfig(),
    },
  })
  await loadTemplates()
}

function onApplyTemplate(tpl: UserTemplateItem) {
  store.applyLayoutConfig(tpl.layout_config || {})
  if (tpl.theme_id) store.setTemplateId(tpl.theme_id)
  templateSheetOpen.value = false
}

async function onSave() {
  statusText.value = ''
  try {
    await store.save()
    statusOk.value = true
    statusText.value = 'Сохранено'
  } catch (err: unknown) {
    statusOk.value = false
    statusText.value = err instanceof Error ? err.message : 'Ошибка сохранения'
  }
}

async function onShare() {
  statusText.value = ''
  try {
    const url = await store.share()
    statusOk.value = true
    statusText.value = `Ссылка скопирована: ${url}`
  } catch (err: unknown) {
    statusOk.value = false
    statusText.value = err instanceof Error ? err.message : 'Ошибка'
  }
}

async function downloadPngs() {
  statusText.value = ''
  exporting.value = true
  try {
    const qrDataUrl = store.linkHint.trim()
      ? await generateCarouselQrDataUrl(store.linkHint, { size: 960 })
      : null
    await preloadCarouselMedia([...store.slides.map((s) => s.media_url), qrDataUrl])

    for (let i = 0; i < store.slides.length; i++) {
      store.setCurrentSlideIndex(i)
      await nextTick()
      const node = await canvasRef.value?.prepareSlideForExport?.()
      if (!node) throw new Error('Превью не готово')
      const slide = store.slides[i]!
      if (slide.role === 'outro') await waitForQrImages(node)
      const blob = await renderSlideToPng(node, { aspect: store.aspect })
      downloadBlob(blob, `carousel-${i + 1}.png`)
      if (i < store.slides.length - 1) await delayMs(250)
    }
    statusOk.value = true
    statusText.value = 'PNG скачаны'
  } catch (err: unknown) {
    statusOk.value = false
    statusText.value = err instanceof Error ? err.message : 'Ошибка рендера'
  } finally {
    exporting.value = false
  }
}

async function prepareSlideForExport(index: number) {
  store.setCurrentSlideIndex(index)
  await nextTick()
  return canvasRef.value?.prepareSlideForExport?.() || Promise.reject(new Error('Canvas not ready'))
}

defineExpose({ downloadPngs, onSave, onShare, prepareSlideForExport })
</script>
