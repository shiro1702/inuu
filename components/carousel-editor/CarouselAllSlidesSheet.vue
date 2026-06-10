<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex flex-col justify-end bg-black/40"
      @click.self="$emit('close')"
    >
      <div class="flex max-h-[90dvh] flex-col rounded-t-2xl bg-white shadow-xl">
        <div class="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <h3 class="text-base font-semibold text-gray-900">Все слайды</h3>
          <button type="button" class="p-2 text-gray-500" @click="$emit('close')">✕</button>
        </div>

        <div class="flex-1 overflow-y-auto px-4 py-3">
          <ul class="space-y-2">
            <li
              v-for="(slide, index) in slides"
              :key="`slide-row-${index}`"
              class="rounded-xl border border-gray-200 bg-gray-50 p-3"
              :class="index === currentIndex ? 'ring-2 ring-primary' : ''"
            >
              <div class="mb-2 flex items-start justify-between gap-2">
                <button
                  type="button"
                  class="min-w-0 flex-1 text-left"
                  @click="$emit('select', index)"
                >
                  <span class="text-xs font-medium uppercase text-gray-500">
                    {{ index + 1 }}. {{ roleLabel(slide, index, slides) }}
                  </span>
                  <p class="truncate text-sm font-medium text-gray-900">{{ previewText(slide) }}</p>
                </button>
                <div class="flex shrink-0 flex-col gap-1">
                  <button
                    type="button"
                    class="rounded border border-gray-300 px-2 py-0.5 text-xs disabled:opacity-30"
                    :disabled="index === 0"
                    aria-label="Выше"
                    @click="$emit('move-up', index)"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    class="rounded border border-gray-300 px-2 py-0.5 text-xs disabled:opacity-30"
                    :disabled="index === slides.length - 1"
                    aria-label="Ниже"
                    @click="$emit('move-down', index)"
                  >
                    ↓
                  </button>
                </div>
              </div>
              <div class="flex flex-wrap gap-2">
                <button
                  type="button"
                  class="text-xs text-primary"
                  @click="$emit('edit', index)"
                >
                  Редактировать
                </button>
                <button
                  v-if="slides.length > 1"
                  type="button"
                  class="text-xs text-red-600"
                  @click="$emit('remove', index)"
                >
                  Удалить
                </button>
              </div>
            </li>
          </ul>
        </div>

        <div class="space-y-2 border-t border-gray-200 px-4 py-3 pb-safe">
          <div class="flex flex-wrap gap-2">
            <button
              type="button"
              class="rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium"
              @click="$emit('add', 'body')"
            >
              + Контент
            </button>
            <button
              type="button"
              class="rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium"
              @click="$emit('add', 'cover')"
            >
              + Обложка
            </button>
            <button
              type="button"
              class="rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium"
              @click="$emit('add', 'outro')"
            >
              + CTA
            </button>
          </div>
          <button
            type="button"
            class="w-full rounded-xl bg-violet-600 py-3 text-sm font-medium text-white"
            @click="$emit('import-text')"
          >
            Вставить текст → карусель
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import type { CarouselSlide, CarouselSlideRole } from '~/types/editorialCarousel'
import { carouselSlidePreviewText, carouselSlideRoleLabel } from '~/utils/carouselSlideLabels'

defineProps<{
  open: boolean
  slides: CarouselSlide[]
  currentIndex: number
}>()

defineEmits<{
  close: []
  select: [index: number]
  edit: [index: number]
  'move-up': [index: number]
  'move-down': [index: number]
  remove: [index: number]
  add: [role: CarouselSlideRole]
  'import-text': []
}>()

function roleLabel(slide: CarouselSlide, index: number, slides: CarouselSlide[]) {
  return carouselSlideRoleLabel(slide, index, slides)
}

function previewText(slide: CarouselSlide) {
  return carouselSlidePreviewText(slide)
}
</script>
