<template>
  <div class="border-t border-gray-200 bg-white px-2 pb-safe pt-2">
    <div class="mb-2 flex justify-center gap-1">
      <button
        v-for="(_, i) in slideCount"
        :key="i"
        type="button"
        class="h-1 rounded-full transition-all"
        :class="i === currentIndex ? 'w-5 bg-primary' : 'w-1.5 bg-gray-300'"
        :aria-label="`Слайд ${i + 1}`"
        @click="$emit('select', i)"
      />
    </div>
    <div class="grid grid-cols-3 gap-1">
      <button
        type="button"
        class="flex flex-col items-center gap-1 rounded-xl py-2 text-xs font-medium"
        :class="activeTab === 'text' ? 'bg-primary/10 text-primary' : 'text-gray-600'"
        @click="$emit('tab', 'text')"
      >
        <span class="text-lg">📝</span>
        Текст
      </button>
      <button
        type="button"
        class="flex flex-col items-center gap-1 rounded-xl py-2 text-xs font-medium text-gray-600"
        @click="$emit('tab', 'stickers')"
      >
        <span class="text-lg">✨</span>
        Стикеры
      </button>
      <button
        type="button"
        class="flex flex-col items-center gap-1 rounded-xl py-2 text-xs font-medium text-gray-600"
        @click="$emit('tab', 'templates')"
      >
        <span class="text-lg">📐</span>
        Шаблоны
      </button>
    </div>
    <div class="mt-2 grid grid-cols-2 gap-2">
      <button
        type="button"
        class="rounded-xl border border-gray-300 py-2.5 text-sm font-medium text-gray-800"
        @click="$emit('edit-slide')"
      >
        Слайд
      </button>
      <button
        type="button"
        class="rounded-xl border border-gray-300 py-2.5 text-sm font-medium text-gray-800"
        @click="$emit('all-slides')"
      >
        Все слайды
      </button>
    </div>
    <button
      type="button"
      class="mt-2 w-full rounded-xl border border-violet-200 bg-violet-50 py-3 text-sm font-medium text-violet-800"
      @click="$emit('import-text')"
    >
      Вставить текст → карусель
    </button>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    slideCount: number
    currentIndex: number
    activeTab?: 'text' | 'stickers' | 'templates'
  }>(),
  { activeTab: 'text' },
)

defineEmits<{
  select: [index: number]
  tab: [tab: 'text' | 'stickers' | 'templates']
  'edit-slide': []
  'all-slides': []
  'import-text': []
}>()
</script>
