<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex flex-col justify-end bg-black/40"
      @click.self="$emit('close')"
    >
      <div class="max-h-[90dvh] overflow-y-auto rounded-t-2xl bg-white px-4 pb-safe pt-3 shadow-xl">
        <div class="mb-3 flex items-center justify-between">
          <h3 class="text-base font-semibold text-gray-900">Текст → карусель</h3>
          <button type="button" class="p-2 text-gray-500" @click="$emit('close')">✕</button>
        </div>

        <div class="mb-3 flex gap-2">
          <button
            type="button"
            class="flex-1 rounded-lg py-2 text-sm font-medium"
            :class="mode === 'split' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'"
            @click="mode = 'split'"
          >
            Разбить текст
          </button>
          <button
            type="button"
            class="flex-1 rounded-lg py-2 text-sm font-medium"
            :class="mode === 'ai' ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-700'"
            @click="mode = 'ai'"
          >
            ИИ (Groq)
          </button>
        </div>

        <p class="mb-2 text-xs text-gray-500">
          Вставьте пост целиком. Между слайдами — строка
          <code class="rounded bg-gray-100 px-1">---</code>
          (не в начале текста) или нумерация «1. … 2. …».
        </p>

        <textarea
          v-model="text"
          rows="10"
          class="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          placeholder="Весь текст анонса, подборки или пост из Telegram…"
        />

        <div v-if="mode === 'ai'" class="mb-3 flex flex-wrap gap-2">
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

        <button
          type="button"
          class="mb-4 w-full rounded-xl py-3 text-sm font-medium text-white disabled:opacity-50"
          :class="mode === 'ai' ? 'bg-violet-600' : 'bg-primary'"
          :disabled="loading || !text.trim()"
          @click="apply"
        >
          {{ loading ? 'Обработка…' : mode === 'ai' ? 'Сгенерировать карусель' : 'Разбить на слайды' }}
        </button>

        <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import type { CarouselSlide } from '~/types/editorialCarousel'
import { parseInstagramCarouselToSlides } from '~/utils/parseInstagramCarousel'

const props = defineProps<{
  open: boolean
  citySlug: string
}>()

const emit = defineEmits<{
  close: []
  generated: [payload: { slides: CarouselSlide[]; title?: string; telegramPostText?: string }]
}>()

const mode = ref<'split' | 'ai'>('split')
const text = ref('')
const loading = ref(false)
const error = ref('')

const quickPrompts = [
  { label: 'Концерт', text: 'В пятницу в клубе — живой концерт местной группы, вход от 500₽, 19:00' },
  { label: 'Гастро', text: 'Новое меню в ресторане: дегустация бурятской кухни, бронь по телефону' },
  { label: 'Подборка', text: 'Пятничный дайджест\n---\nКонцерт в «Городе»\n19:00, от 500₽\n---\nВыставка в музее\nдо воскресенья\n---\nЧитать в INUU' },
]

async function apply() {
  if (!text.value.trim()) return
  loading.value = true
  error.value = ''

  try {
    if (mode.value === 'split') {
      const slides = parseInstagramCarouselToSlides(text.value.trim())
      if (!slides.length) {
        error.value = 'Не удалось разбить текст — добавьте разделители --- или нумерацию'
        return
      }
      emit('generated', { slides, title: slides[0]?.title })
      return
    }

    if (!props.citySlug?.trim()) {
      error.value = 'Не выбран город проекта'
      return
    }

    try {
      const res = await $fetch<{
        ok: boolean
        slides: CarouselSlide[]
        title?: string
        telegram_post_text?: string
      }>('/api/ai/carousel/generate', {
        method: 'POST',
        body: {
          mode: 'raw',
          text: text.value.trim(),
          city_slug: props.citySlug,
        },
      })
      emit('generated', {
        slides: res.slides,
        title: res.title,
        telegramPostText: res.telegram_post_text,
      })
    } catch {
      const slides = parseInstagramCarouselToSlides(text.value.trim())
      if (slides.length) {
        emit('generated', { slides, title: slides[0]?.title })
      } else {
        throw new Error('ИИ недоступен и автоматическое разбиение не сработало')
      }
    }
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Ошибка'
  } finally {
    loading.value = false
  }
}
</script>
