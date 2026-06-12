<template>
  <CarouselSheetTeleport :open="open">
    <div
      class="fixed inset-0 z-50 flex flex-col justify-end bg-black/40"
      @click.self="$emit('close')"
    >
      <div class="max-h-[70dvh] overflow-y-auto rounded-t-2xl bg-white px-4 pb-safe pt-3 shadow-xl">
        <div class="mb-3 flex items-center justify-between">
          <h3 class="text-base font-semibold">Стили</h3>
          <button type="button" class="p-2 text-gray-500" @click="$emit('close')">✕</button>
        </div>
        <label class="mb-3 block space-y-1 text-sm">
          <span class="font-medium text-gray-700">Шаблон</span>
          <select
            :value="templateId"
            class="w-full rounded-lg border border-gray-300 px-3 py-2"
            @change="$emit('update:templateId', ($event.target as HTMLSelectElement).value)"
          >
            <option v-for="tpl in templateOptions" :key="tpl.id" :value="tpl.id">
              {{ tpl.label }}
            </option>
          </select>
        </label>
        <label class="mb-3 block space-y-1 text-sm">
          <span class="font-medium text-gray-700">Вайб</span>
          <select
            :value="vibeKey"
            class="w-full rounded-lg border border-gray-300 px-3 py-2"
            @change="$emit('update:vibeKey', ($event.target as HTMLSelectElement).value)"
          >
            <option v-for="key in vibeKeys" :key="key" :value="key">{{ key }}</option>
          </select>
        </label>
        <label class="mb-3 block space-y-1 text-sm">
          <span class="font-medium text-gray-700">Формат</span>
          <select
            :value="aspect"
            class="w-full rounded-lg border border-gray-300 px-3 py-2"
            @change="$emit('update:aspect', ($event.target as HTMLSelectElement).value)"
          >
            <option value="4:5">Instagram 4:5</option>
            <option value="9:16">Stories 9:16</option>
            <option v-if="showAllAspects" value="1:1">Пост 1:1</option>
            <option v-if="showAllAspects" value="16:9">Cover 16:9</option>
          </select>
        </label>
        <label v-if="showProjectType" class="mb-3 block space-y-1 text-sm">
          <span class="font-medium text-gray-700">Тип проекта</span>
          <select
            :value="projectType"
            class="w-full rounded-lg border border-gray-300 px-3 py-2"
            @change="$emit('update:projectType', ($event.target as HTMLSelectElement).value)"
          >
            <option value="carousel">Карусель</option>
            <option value="post">Пост 1 слайд</option>
            <option value="story">Афиша / Story</option>
            <option value="cover">Cover 16:9</option>
          </select>
        </label>
        <label class="block space-y-1 text-sm">
          <span class="font-medium text-gray-700">Ссылка (outro QR)</span>
          <input
            :value="linkHint"
            type="text"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            @input="$emit('update:linkHint', ($event.target as HTMLInputElement).value)"
          >
        </label>
      </div>
    </div>
  </CarouselSheetTeleport>
</template>

<script setup lang="ts">
import type { CarouselAspect } from '~/types/editorialCarousel'
import { CAROUSEL_TEMPLATE_OPTIONS } from '~/utils/carouselTemplates'
import { CAROUSEL_VIBE_KEYS } from '~/utils/carouselVibeTheme'

withDefaults(
  defineProps<{
    open: boolean
    templateId: string
    vibeKey: string
    aspect: CarouselAspect | string
    linkHint: string
    projectType?: string
    showProjectType?: boolean
    showAllAspects?: boolean
  }>(),
  { showProjectType: false, showAllAspects: false },
)

defineEmits<{
  close: []
  'update:templateId': [value: string]
  'update:vibeKey': [value: string]
  'update:aspect': [value: string]
  'update:linkHint': [value: string]
  'update:projectType': [value: string]
}>()

const templateOptions = CAROUSEL_TEMPLATE_OPTIONS
const vibeKeys = CAROUSEL_VIBE_KEYS
</script>
