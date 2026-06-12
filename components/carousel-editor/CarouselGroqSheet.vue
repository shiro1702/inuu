<template>
  <CarouselSheetTeleport :open="open">
    <div
      class="fixed inset-0 z-50 flex flex-col justify-end bg-black/40"
      @click.self="$emit('close')"
    >
      <div class="max-h-[85dvh] overflow-y-auto rounded-t-2xl bg-white px-4 pb-safe pt-3 shadow-xl">
        <div class="mb-3 flex items-center justify-between">
          <h3 class="text-base font-semibold text-gray-900">ИИ — карусель</h3>
          <button type="button" class="p-2 text-gray-500" @click="$emit('close')">✕</button>
        </div>

        <div class="mb-3 flex flex-wrap gap-2">
          <button
            v-for="prompt in quickPrompts"
            :key="prompt.label"
            type="button"
            class="rounded-full border border-gray-300 px-3 py-1 text-xs"
            @click="text = prompt.text"
          >
            {{ prompt.label }}
          </button>
        </div>

        <textarea
          v-model="text"
          rows="6"
          class="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          placeholder="Вставьте текст анонса, пост из TG или описание события…"
        />

        <button
          type="button"
          class="mb-4 w-full rounded-xl bg-violet-600 py-3 text-sm font-medium text-white disabled:opacity-50"
          :disabled="loading || !text.trim()"
          @click="generate"
        >
          {{ loading ? 'Генерация…' : 'Сгенерировать карусель' }}
        </button>

        <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
      </div>
    </div>
  </CarouselSheetTeleport>
</template>

<script setup lang="ts">
import type { CarouselSlide } from '~/types/editorialCarousel'

const props = defineProps<{
  open: boolean
  citySlug: string
  mode?: 'raw' | 'text_mash' | 'poster'
}>()

const emit = defineEmits<{
  close: []
  generated: [payload: { slides: CarouselSlide[]; title?: string; telegramPostText?: string }]
}>()

const text = ref('')
const loading = ref(false)
const error = ref('')

const quickPrompts = [
  { label: 'Концерт', text: 'В пятницу в клубе — живой концерт местной группы, вход от 500₽, 19:00' },
  { label: 'Гастро', text: 'Новое меню в ресторане: дегустация бурятской кухни, бронь по телефону' },
  { label: 'Лекция', text: 'Бесплатная лекция об архитектуре города, суббота 15:00, библиотека' },
]

async function generate() {
  if (!text.value.trim()) return
  loading.value = true
  error.value = ''
  try {
    const res = await $fetch<{
      ok: boolean
      slides: CarouselSlide[]
      title?: string
      telegram_post_text?: string
    }>('/api/ai/carousel/generate', {
      method: 'POST',
      body: {
        mode: props.mode || 'raw',
        text: text.value.trim(),
        city_slug: props.citySlug,
      },
    })
    emit('generated', {
      slides: res.slides,
      title: res.title,
      telegramPostText: res.telegram_post_text,
    })
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Ошибка генерации'
  } finally {
    loading.value = false
  }
}
</script>
