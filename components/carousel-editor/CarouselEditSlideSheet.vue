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
          <label v-if="slide.role !== 'outro'" class="block space-y-1 text-sm">
            <span class="font-medium text-gray-700">Заголовок</span>
            <input
              :value="slide.title || ''"
              type="text"
              class="w-full rounded-lg border border-gray-300 px-3 py-2"
              @input="patch({ title: ($event.target as HTMLInputElement).value })"
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

          <label v-if="slide.role === 'body'" class="block space-y-1 text-sm">
            <span class="font-medium text-gray-700">Тезисы (по строке)</span>
            <textarea
              :value="bulletsText"
              rows="4"
              class="w-full rounded-lg border border-gray-300 px-3 py-2"
              @input="patchBullets(($event.target as HTMLTextAreaElement).value)"
            />
          </label>

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
import type { CarouselSlide } from '~/types/editorialCarousel'

const props = defineProps<{
  open: boolean
  slide: CarouselSlide | null
  slideIndex: number
  citySlug?: string
}>()

const uploadError = ref('')

const emit = defineEmits<{
  close: []
  patch: [patch: Partial<CarouselSlide>]
}>()

const slideLabel = computed(() => {
  if (!props.slide) return 'Слайд'
  if (props.slide.role === 'cover') return 'Обложка'
  if (props.slide.role === 'outro') return 'Финал / CTA'
  return `Контент ${props.slideIndex + 1}`
})

const bulletsText = computed(() => (props.slide?.bullets || []).join('\n'))

function patch(p: Partial<CarouselSlide>) {
  emit('patch', p)
}

function patchBullets(text: string) {
  patch({
    bullets: text.split('\n').map((l) => l.trim()).filter(Boolean),
  })
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
