<template>
  <div class="mx-auto max-w-3xl space-y-6 p-6">
    <header class="space-y-1">
      <h1 class="text-xl font-bold text-gray-900">Story Studio</h1>
      <p class="text-sm text-gray-600">
        Рендер 9:16 PNG из шаблонов и загрузка в сторис города.
      </p>
    </header>

    <div v-if="loadError" class="text-sm text-red-600">{{ loadError }}</div>
    <div v-else-if="loading" class="text-sm text-gray-500">Загрузка…</div>
    <template v-else-if="slideDraft.length">
      <p class="text-sm text-gray-700">
        Кампания: <span class="font-medium">{{ campaignTitle }}</span> · {{ slideDraft.length }} слайдов
      </p>

      <div class="pointer-events-none fixed -left-[9999px] top-0 opacity-0">
        <CarouselSlideRenderer
          v-for="(slide, index) in slideDraft"
          :key="`${slide.role}-${index}`"
          :ref="(el) => setRendererRef(el, index)"
          :slide="slide"
          aspect="9:16"
          :brand-name="cityName"
          :topic-tags="topicTags"
          :link-hint="guidePath"
        />
      </div>

      <ul class="space-y-2 text-sm text-gray-600">
        <li v-for="(slide, i) in slideDraft" :key="i">
          {{ i + 1 }}. {{ slide.role }} — {{ slide.title || slide.cta_text || '—' }}
        </li>
      </ul>

      <button
        type="button"
        class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        :disabled="rendering"
        @click="renderAndUpload"
      >
        {{ rendering ? 'Рендер и загрузка…' : 'Собрать и опубликовать слайды' }}
      </button>

      <p v-if="statusText" class="text-sm" :class="statusOk ? 'text-emerald-700' : 'text-red-600'">
        {{ statusText }}
      </p>
    </template>
    <p v-else class="text-sm text-gray-500">
      Нет черновика слайдов. Опубликуйте материал через «Опубликовать + сторис» в manager chat.
    </p>
  </div>
</template>

<script setup lang="ts">
import type { CarouselSlide } from '~/types/editorialCarousel'
import CarouselSlideRenderer from '~/components/editorial/carousel/CarouselSlideRenderer.vue'
import { preloadCarouselMedia, renderSlideToPng } from '~/utils/renderSlideToPng'

definePageMeta({ layout: 'dashboard' })

const route = useRoute()
const citySlug = computed(() => String(route.query.city || '').trim())
const campaignId = computed(() => String(route.query.campaign || '').trim())

const loading = ref(true)
const loadError = ref('')
const campaignTitle = ref('')
const cityName = ref('INUU')
const guidePath = ref<string | null>(null)
const topicTags = ref<string[]>([])
const slideDraft = ref<CarouselSlide[]>([])
const rendering = ref(false)
const statusText = ref('')
const statusOk = ref(false)

const rendererRefs = ref<Array<InstanceType<typeof CarouselSlideRenderer> | null>>([])

function setRendererRef(el: unknown, index: number) {
  rendererRefs.value[index] = el as InstanceType<typeof CarouselSlideRenderer> | null
}

async function loadCampaign() {
  loading.value = true
  loadError.value = ''
  try {
    if (!citySlug.value || !campaignId.value) {
      throw new Error('Укажите query: city и campaign')
    }
    const res = await $fetch<{
      ok: boolean
      campaign: {
        title: string
        targeting?: { guide_path?: string }
        slideDraft?: CarouselSlide[]
      }
      city: { name: string }
    }>(`/api/dashboard/manager/cities/${citySlug.value}/story-campaigns/${campaignId.value}`)

    campaignTitle.value = res.campaign.title
    cityName.value = res.city.name
    guidePath.value =
      typeof res.campaign.targeting === 'object' &&
      res.campaign.targeting &&
      typeof (res.campaign.targeting as { guide_path?: string }).guide_path === 'string'
        ? (res.campaign.targeting as { guide_path: string }).guide_path
        : null

    const draft = res.campaign.slideDraft
    slideDraft.value = Array.isArray(draft) ? draft : []
  } catch (err: unknown) {
    loadError.value = err instanceof Error ? err.message : 'Не удалось загрузить кампанию'
  } finally {
    loading.value = false
  }
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = String(reader.result || '')
      const base64 = result.includes(',') ? result.split(',')[1]! : result
      resolve(base64)
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(blob)
  })
}

async function renderAndUpload() {
  statusText.value = ''
  statusOk.value = false
  rendering.value = true

  try {
    await preloadCarouselMedia(slideDraft.value.map((s) => s.media_url))
    await nextTick()

    const uploaded: Array<{
      mediaUrl: string
      sortOrder: number
      title?: string
      text?: string
    }> = []

    for (let i = 0; i < slideDraft.value.length; i++) {
      const slide = slideDraft.value[i]!
      const node = rendererRefs.value[i]?.getFrameElement?.()
      if (!node) throw new Error(`Слайд ${i + 1} не готов к рендеру`)

      const blob = await renderSlideToPng(node, { aspect: '9:16' })
      const base64 = await blobToBase64(blob)
      const up = await $fetch<{ ok: boolean; url: string }>(
        `/api/dashboard/manager/cities/${citySlug.value}/story-slide/upload`,
        {
          method: 'POST',
          body: {
            fileName: `story-${slide.role}-${i + 1}.png`,
            mimeType: 'image/png',
            dataBase64: base64,
            campaignId: campaignId.value,
            sortOrder: i,
          },
        },
      )

      uploaded.push({
        mediaUrl: up.url,
        sortOrder: i,
        title: slide.title,
        text: slide.bullets?.join(' ') || slide.cta_text,
      })
    }

    await $fetch(
      `/api/dashboard/manager/cities/${citySlug.value}/story-campaigns/${campaignId.value}/finalize-slides`,
      {
        method: 'POST',
        body: { slides: uploaded },
      },
    )

    statusOk.value = true
    statusText.value = `Готово: ${uploaded.length} слайдов на главной города.`
  } catch (err: unknown) {
    statusText.value = err instanceof Error ? err.message : 'Ошибка рендера'
  } finally {
    rendering.value = false
  }
}

onMounted(() => {
  void loadCampaign()
})
</script>
