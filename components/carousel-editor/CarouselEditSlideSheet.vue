<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex flex-col justify-end bg-black/40"
      @click.self="$emit('close')"
    >
      <div
        class="max-h-[85dvh] overflow-y-auto rounded-t-2xl bg-white px-4 pb-safe pt-3 shadow-xl"
        role="dialog"
        aria-modal="true"
      >
        <div class="mb-3 flex items-center justify-between">
          <h3 class="text-base font-semibold text-gray-900">{{ slideLabel }}</h3>
          <button type="button" class="rounded-lg p-2 text-gray-500" @click="$emit('close')">✕</button>
        </div>

        <div v-if="slide" class="space-y-4 pb-4">
          <section class="rounded-xl border border-violet-200 bg-violet-50/60 p-3">
            <div class="mb-2 flex items-center justify-between gap-2">
              <p class="text-sm font-semibold text-violet-900">ИИ (Groq)</p>
              <button
                type="button"
                class="text-xs font-medium text-violet-700"
                @click="aiOpen = !aiOpen"
              >
                {{ aiOpen ? 'Скрыть' : 'Сгенерировать' }}
              </button>
            </div>

            <div v-if="aiOpen" class="space-y-3">
              <p class="text-xs text-violet-800/80">
                {{ aiHint }}
              </p>

              <div class="flex flex-wrap gap-2">
                <button
                  v-for="prompt in quickPrompts"
                  :key="prompt.label"
                  type="button"
                  class="rounded-full border border-violet-200 bg-white px-3 py-1 text-xs text-violet-900"
                  @click="aiText = prompt.text"
                >
                  {{ prompt.label }}
                </button>
              </div>

              <textarea
                v-model="aiText"
                rows="4"
                class="w-full rounded-lg border border-violet-200 bg-white px-3 py-2 text-sm"
                :placeholder="aiPlaceholder"
              />

              <button
                type="button"
                class="w-full rounded-xl bg-violet-600 py-2.5 text-sm font-medium text-white disabled:opacity-50"
                :disabled="aiLoading || !aiText.trim()"
                @click="generateWithAi"
              >
                {{ aiLoading ? 'Генерация…' : 'Сгенерировать слайд' }}
              </button>

              <p v-if="aiError" class="text-xs text-red-600">{{ aiError }}</p>
            </div>
          </section>

          <CarouselEventDigestLayoutPicker
            v-if="isEventDigest && slide"
            :slide="slide"
            :layout-variant="slide.layout_variant"
            @select="patch({ layout_variant: $event })"
          />

          <label v-if="slide.role !== 'outro'" class="block space-y-1 text-sm">
            <span class="font-medium text-gray-700">Заголовок</span>
            <input
              :value="slide.title || ''"
              type="text"
              class="w-full rounded-lg border border-gray-300 px-3 py-2"
              @input="patch({ title: ($event.target as HTMLInputElement).value })"
            >
          </label>

          <label
            v-if="isEventDigest && slide.role === 'cover'"
            class="block space-y-1 text-sm"
          >
            <span class="font-medium text-gray-700">Подзаголовок / дата</span>
            <input
              :value="slide.cta_text || ''"
              type="text"
              class="w-full rounded-lg border border-gray-300 px-3 py-2"
              placeholder="1 июня · 14 февраля"
              @input="patch({ cta_text: ($event.target as HTMLInputElement).value })"
            >
          </label>

          <label v-if="slide.role === 'cover' || slide.role === 'body'" class="block space-y-1 text-sm">
            <span class="font-medium text-gray-700">Фото (URL)</span>
            <input
              :value="slide.media_url || ''"
              type="url"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              placeholder="https://..."
              @input="patch({ media_url: ($event.target as HTMLInputElement).value || null })"
            >
            <input
              v-if="citySlug"
              type="file"
              accept="image/*"
              class="mt-1 block w-full text-xs"
              @change="onCoverFile"
            >
            <p v-if="uploadError" class="text-xs text-red-600">{{ uploadError }}</p>
          </label>

          <template v-if="slide.role === 'body'">
            <label class="block space-y-1 text-sm">
              <span class="font-medium text-gray-700">Дата и время</span>
              <input
                :value="slide.event_datetime || ''"
                type="text"
                class="w-full rounded-lg border border-gray-300 px-3 py-2"
                placeholder="7 июня, 19:00"
                @input="patch({ event_datetime: ($event.target as HTMLInputElement).value || null })"
              >
            </label>
            <label class="block space-y-1 text-sm">
              <span class="font-medium text-gray-700">Место / источник (для «Подробнее у…»)</span>
              <input
                :value="slide.event_venue || ''"
                type="text"
                class="w-full rounded-lg border border-gray-300 px-3 py-2"
                placeholder="Кафе Эфир"
                @input="patch({ event_venue: ($event.target as HTMLInputElement).value || null })"
              >
            </label>
            <label class="block space-y-1 text-sm">
              <span class="font-medium text-gray-700">Цена</span>
              <input
                :value="slide.event_price || ''"
                type="text"
                class="w-full rounded-lg border border-gray-300 px-3 py-2"
                placeholder="от 500₽"
                @input="patch({ event_price: ($event.target as HTMLInputElement).value || null })"
              >
            </label>
            <label class="block space-y-1 text-sm">
              <span class="font-medium text-gray-700">Описание / тезис</span>
              <textarea
                :value="bulletsText"
                rows="3"
                class="w-full rounded-lg border border-gray-300 px-3 py-2"
                placeholder="Короткое описание события"
                @input="patchBullets(($event.target as HTMLTextAreaElement).value)"
              />
            </label>
          </template>

          <label v-if="slide.role === 'outro'" class="block space-y-1 text-sm">
            <span class="font-medium text-gray-700">CTA</span>
            <input
              :value="slide.cta_text || ''"
              type="text"
              class="w-full rounded-lg border border-gray-300 px-3 py-2"
              @input="patch({ cta_text: ($event.target as HTMLInputElement).value })"
            >
          </label>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import type { CarouselSlide, CarouselSlideRole, CarouselTemplateId } from '~/types/editorialCarousel'
import CarouselEventDigestLayoutPicker from '~/components/carousel-editor/CarouselEventDigestLayoutPicker.vue'

const props = defineProps<{
  open: boolean
  slide: CarouselSlide | null
  slideIndex: number
  citySlug?: string
  carouselTitle?: string
  totalSlides?: number
  vibeKey?: string
  templateId?: CarouselTemplateId | string
}>()

const uploadError = ref('')
const aiOpen = ref(false)
const aiText = ref('')
const aiLoading = ref(false)
const aiError = ref('')

const emit = defineEmits<{
  close: []
  patch: [patch: Partial<CarouselSlide>]
  generated: [slide: CarouselSlide]
}>()

const isEventDigest = computed(() => props.templateId === 'event-digest')

const slideLabel = computed(() => {
  if (!props.slide) return 'Слайд'
  if (props.slide.role === 'cover') return 'Обложка'
  if (props.slide.role === 'outro') return 'Финал / CTA'
  return `Контент ${props.slideIndex + 1}`
})

const aiHint = computed(() => {
  const role = props.slide?.role
  if (role === 'cover') return 'Опишите событие или тему — ИИ соберёт обложку с заголовком и подберёт фон.'
  if (role === 'outro') return 'Опишите призыв к действию — ИИ сформирует финальный CTA-слайд.'
  return 'Вставьте факты, тезисы или абзац — ИИ оформит контентный слайд.'
})

const aiPlaceholder = computed(() => {
  const role = props.slide?.role
  if (role === 'cover') return 'Концерт Антохи МС, пятница 19:00, клуб «Город»…'
  if (role === 'outro') return 'Читайте подборку в INUU, ссылка в профиле…'
  return 'Главные факты слайда: дата, место, цена, детали…'
})

const quickPrompts = computed(() => {
  const role = props.slide?.role
  if (role === 'cover') {
    return [
      { label: 'Концерт', text: 'Живой концерт в пятницу, 19:00, клуб «Город», вход от 500₽' },
      { label: 'Выставка', text: 'Открытие фотовыставки о Байкале, суббота 12:00, галерея «Арт»' },
    ]
  }
  if (role === 'outro') {
    return [
      { label: 'INUU', text: 'Все события и билеты — в приложении INUU' },
      { label: 'Подписка', text: 'Подписывайтесь, чтобы не пропустить афишу города' },
    ]
  }
  return [
    { label: 'Детали', text: 'Начало в 19:00\nАдрес: ул. Ленина, 12\nВход свободный' },
    { label: 'Меню', text: 'Дегустационный сет из 5 блюд\nБронь по телефону\nПятница–воскресенье' },
  ]
})

const bulletsText = computed(() => (props.slide?.bullets || []).join('\n'))

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) {
      aiOpen.value = false
      aiError.value = ''
    }
  },
)

function patch(p: Partial<CarouselSlide>) {
  emit('patch', p)
}

function patchBullets(text: string) {
  patch({
    bullets: text.split('\n').map((l) => l.trim()).filter(Boolean),
  })
}

async function generateWithAi() {
  if (!aiText.value.trim() || !props.slide) return
  if (!props.citySlug?.trim()) {
    aiError.value = 'Не выбран город проекта'
    return
  }

  aiLoading.value = true
  aiError.value = ''

  try {
    const res = await $fetch<{
      ok: boolean
      slide: CarouselSlide
      source?: string
    }>('/api/ai/carousel/generate-slide', {
      method: 'POST',
      body: {
        text: aiText.value.trim(),
        city_slug: props.citySlug,
        slide_role: props.slide.role as CarouselSlideRole,
        vibe_key: props.vibeKey || 'party',
        carousel_title: props.carouselTitle,
        slide_index: props.slideIndex,
        total_slides: props.totalSlides,
      },
    })

    emit('generated', res.slide)
    aiOpen.value = false
  } catch (err: unknown) {
    aiError.value = err instanceof Error ? err.message : 'Ошибка генерации'
  } finally {
    aiLoading.value = false
  }
}

async function onCoverFile(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  const city = props.citySlug?.trim()
  if (!file || !city) return
  uploadError.value = ''
  const reader = new FileReader()
  reader.onload = async () => {
    const dataUrl = String(reader.result || '')
    const base64 = dataUrl.includes(',') ? dataUrl.split(',')[1]! : dataUrl
    try {
      const up = await $fetch<{ ok: boolean; url: string }>(
        `/api/dashboard/manager/cities/${city}/editorial-cover/upload`,
        {
          method: 'POST',
          body: { fileName: file.name, mimeType: file.type, dataBase64: base64 },
        },
      )
      patch({ media_url: up.url })
    } catch (err: unknown) {
      uploadError.value = err instanceof Error ? err.message : 'Ошибка загрузки'
    }
  }
  reader.readAsDataURL(file)
}
</script>
