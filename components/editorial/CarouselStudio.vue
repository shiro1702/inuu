<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-end gap-4">
      <label class="space-y-1 text-sm">
        <span class="font-medium text-gray-700">Формат</span>
        <select v-model="aspect" class="block w-full rounded-lg border border-gray-300 px-3 py-2">
          <option value="4:5">Instagram 4:5 (1080×1350)</option>
          <option value="9:16">Stories 9:16 (1080×1920)</option>
        </select>
      </label>
      <label class="space-y-1 text-sm">
        <span class="font-medium text-gray-700">Вайб (градиент)</span>
        <select v-model="vibeKey" class="block w-full rounded-lg border border-gray-300 px-3 py-2">
          <option v-for="key in vibeKeys" :key="key" :value="key">{{ key }}</option>
        </select>
      </label>
      <label class="space-y-1 text-sm flex-1 min-w-[200px]">
        <span class="font-medium text-gray-700">Ссылка на статью (outro)</span>
        <input
          v-model="linkHint"
          type="text"
          class="block w-full rounded-lg border border-gray-300 px-3 py-2"
          placeholder="/ulan-ude/guides/..."
        >
      </label>
    </div>

    <div class="grid gap-6 lg:grid-cols-2">
      <div class="space-y-4">
        <article
          v-for="(slide, index) in slides"
          :key="slide.role"
          class="rounded-lg border border-gray-200 bg-white p-4 space-y-3"
        >
          <h3 class="text-sm font-semibold uppercase tracking-wide text-gray-500">
            {{ roleLabel(slide.role) }}
          </h3>
          <label v-if="slide.role !== 'outro'" class="block space-y-1 text-sm">
            <span class="text-gray-700">Заголовок</span>
            <input
              v-model="slide.title"
              type="text"
              class="w-full rounded-lg border border-gray-300 px-3 py-2"
            >
          </label>
          <label v-if="slide.role === 'cover'" class="block space-y-1 text-sm">
            <span class="text-gray-700">Фото (URL)</span>
            <input
              v-model="slide.media_url"
              type="url"
              class="w-full rounded-lg border border-gray-300 px-3 py-2"
              placeholder="https://..."
            >
            <input
              type="file"
              accept="image/*"
              class="mt-1 block w-full text-xs"
              @change="(e) => onCoverFile(e, index)"
            >
          </label>
          <label v-if="slide.role === 'body'" class="block space-y-1 text-sm">
            <span class="text-gray-700">Тезисы (по строке)</span>
            <textarea
              :value="bulletsText(index)"
              rows="4"
              class="w-full rounded-lg border border-gray-300 px-3 py-2"
              @input="(e) => setBulletsFromText(index, (e.target as HTMLTextAreaElement).value)"
            />
          </label>
          <label v-if="slide.role === 'outro'" class="block space-y-1 text-sm">
            <span class="text-gray-700">CTA</span>
            <input
              v-model="slide.cta_text"
              type="text"
              class="w-full rounded-lg border border-gray-300 px-3 py-2"
            >
          </label>
        </article>
      </div>

      <div class="space-y-4">
        <h3 class="text-sm font-medium text-gray-700">Превью</h3>
        <div class="overflow-x-auto rounded-xl border bg-gray-950 p-3">
          <div class="mx-auto max-w-xs">
            <div class="origin-top scale-[0.32]">
              <CarouselSlideRenderer
                v-if="previewSlide"
                :slide="previewSlide"
                :aspect="aspect"
                :brand-name="brandName"
                :topic-tags="[vibeKey]"
                :link-hint="linkHint"
              />
            </div>
          </div>
        </div>
        <p class="text-xs text-gray-500">
          Слайд {{ previewIndex + 1 }} / {{ slides.length }} —
          <button
            v-for="(_, i) in slides"
            :key="i"
            type="button"
            class="mx-0.5 underline"
            :class="i === previewIndex ? 'text-primary font-medium' : 'text-gray-500'"
            @click="previewIndex = i"
          >
            {{ i + 1 }}
          </button>
        </p>
      </div>
    </div>

    <div class="pointer-events-none fixed -left-[9999px] top-0 opacity-0" aria-hidden="true">
      <CarouselSlideRenderer
        v-for="(slide, index) in slides"
        :key="`export-${slide.role}-${index}`"
        :ref="(el) => setRendererRef(el, index)"
        :slide="slideWithVibe(slide)"
        :aspect="aspect"
        :brand-name="brandName"
        :topic-tags="[vibeKey]"
        :link-hint="linkHint"
      />
    </div>

    <div class="flex flex-wrap gap-3">
      <button
        type="button"
        class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
        :disabled="exporting"
        @click="downloadPngs"
      >
        {{ exporting ? 'Рендер…' : 'Скачать PNG' }}
      </button>
      <button
        v-if="postId && citySlug"
        type="button"
        class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        :disabled="saving"
        @click="saveToPost"
      >
        {{ saving ? 'Сохранение…' : 'Сохранить в статью' }}
      </button>
      <button
        v-if="submissionId && citySlug"
        type="button"
        class="rounded-lg border border-primary px-4 py-2 text-sm font-medium text-primary disabled:opacity-50"
        :disabled="saving"
        @click="saveToSubmission"
      >
        {{ saving ? 'Сохранение…' : 'Сохранить в черновик' }}
      </button>
    </div>

    <p v-if="statusText" class="text-sm" :class="statusOk ? 'text-emerald-700' : 'text-red-600'">
      {{ statusText }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { CarouselAspect, CarouselSlide, EditorialCarouselMetadata } from '~/types/editorialCarousel'
import CarouselSlideRenderer from '~/components/editorial/carousel/CarouselSlideRenderer.vue'
import { CAROUSEL_VIBE_KEYS } from '~/utils/carouselVibeTheme'
import { downloadBlob, preloadCarouselMedia, renderSlideToPng } from '~/utils/renderSlideToPng'

const props = withDefaults(
  defineProps<{
    citySlug: string
    brandName?: string
    postId?: string
    submissionId?: string
    initialCarousel?: EditorialCarouselMetadata | null
    defaultLinkHint?: string | null
  }>(),
  { brandName: 'INUU' },
)

const vibeKeys = CAROUSEL_VIBE_KEYS
const aspect = ref<CarouselAspect>(props.initialCarousel?.aspect || '4:5')
const vibeKey = ref('party')
const linkHint = ref(props.defaultLinkHint || '')
const previewIndex = ref(0)
const exporting = ref(false)
const saving = ref(false)
const statusText = ref('')
const statusOk = ref(false)

const slides = ref<CarouselSlide[]>(defaultSlides())

function defaultSlides(): CarouselSlide[] {
  return [
    { role: 'cover', title: 'Заголовок обложки', gradient: 'party', media_url: null },
    { role: 'body', title: 'Главное', bullets: ['Первый тезис', 'Второй тезис'], gradient: 'party' },
    { role: 'outro', cta_text: 'Читать в INUU', gradient: 'party' },
  ]
}

function applyInitial() {
  const c = props.initialCarousel
  if (!c?.slides?.length) return
  aspect.value = c.aspect || '4:5'
  slides.value = c.slides.map((s) => ({ ...s }))
  const g = c.slides[0]?.gradient
  if (g && vibeKeys.includes(g as (typeof vibeKeys)[number])) {
    vibeKey.value = g
  }
}

watch(() => props.initialCarousel, applyInitial, { immediate: true })

watch(
  () => props.defaultLinkHint,
  (hint) => {
    if (hint) linkHint.value = hint
  },
)

watch(vibeKey, () => {
  slides.value = slides.value.map((s) => ({ ...s, gradient: vibeKey.value }))
})

function slideWithVibe(slide: CarouselSlide): CarouselSlide {
  return { ...slide, gradient: vibeKey.value }
}

const previewSlide = computed(() => {
  const s = slides.value[previewIndex.value]
  return s ? slideWithVibe(s) : null
})

function roleLabel(role: CarouselSlide['role']) {
  if (role === 'cover') return 'Обложка'
  if (role === 'outro') return 'Финал / CTA'
  return 'Суть'
}

function bulletsText(index: number): string {
  return (slides.value[index]?.bullets || []).join('\n')
}

function setBulletsFromText(index: number, text: string) {
  const slide = slides.value[index]
  if (!slide) return
  slide.bullets = text.split('\n').map((l) => l.trim()).filter(Boolean)
}

const rendererRefs = ref<Array<InstanceType<typeof CarouselSlideRenderer> | null>>([])

function setRendererRef(el: unknown, index: number) {
  rendererRefs.value[index] = el as InstanceType<typeof CarouselSlideRenderer> | null
}

function buildCarouselPayload(): EditorialCarouselMetadata {
  return {
    template_id: 'minimal-ios',
    aspect: aspect.value,
    slides: slides.value.map((s) => slideWithVibe(s)),
  }
}

async function onCoverFile(event: Event, index: number) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file || !props.citySlug) return
  const reader = new FileReader()
  reader.onload = async () => {
    const dataUrl = String(reader.result || '')
    const base64 = dataUrl.includes(',') ? dataUrl.split(',')[1]! : dataUrl
    try {
      const up = await $fetch<{ ok: boolean; url: string }>(
        `/api/dashboard/manager/cities/${props.citySlug}/editorial-cover/upload`,
        {
          method: 'POST',
          body: {
            fileName: file.name,
            mimeType: file.type,
            dataBase64: base64,
          },
        },
      )
      const slide = slides.value[index]
      if (slide) slide.media_url = up.url
    } catch (err: unknown) {
      statusOk.value = false
      statusText.value = err instanceof Error ? err.message : 'Ошибка загрузки обложки'
    }
  }
  reader.readAsDataURL(file)
}

async function downloadPngs() {
  statusText.value = ''
  exporting.value = true
  try {
    await preloadCarouselMedia(slides.value.map((s) => s.media_url))
    await nextTick()
    for (let i = 0; i < slides.value.length; i++) {
      const node = rendererRefs.value[i]?.getFrameElement?.()
      if (!node) throw new Error(`Слайд ${i + 1} не готов`)
      const blob = await renderSlideToPng(node, { aspect: aspect.value })
      const role = slides.value[i]?.role || `slide-${i + 1}`
      downloadBlob(blob, `carousel-${role}-${i + 1}.png`)
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

async function saveToPost() {
  if (!props.postId || !props.citySlug) return
  saving.value = true
  statusText.value = ''
  try {
    await $fetch(
      `/api/dashboard/manager/cities/${props.citySlug}/editorial-news/${props.postId}/carousel`,
      { method: 'PUT', body: { carousel: buildCarouselPayload() } },
    )
    statusOk.value = true
    statusText.value = 'Карусель сохранена в статью — появится на сайте после публикации'
  } catch (err: unknown) {
    statusOk.value = false
    statusText.value = err instanceof Error ? err.message : 'Не удалось сохранить'
  } finally {
    saving.value = false
  }
}

async function saveToSubmission() {
  if (!props.submissionId || !props.citySlug) return
  saving.value = true
  statusText.value = ''
  try {
    await $fetch(
      `/api/dashboard/manager/cities/${props.citySlug}/content-queue/${props.submissionId}/carousel`,
      { method: 'PUT', body: { carousel: buildCarouselPayload() } },
    )
    statusOk.value = true
    statusText.value = 'Черновик карусели сохранён — при publish попадёт на сайт'
  } catch (err: unknown) {
    statusOk.value = false
    statusText.value = err instanceof Error ? err.message : 'Не удалось сохранить'
  } finally {
    saving.value = false
  }
}
</script>
