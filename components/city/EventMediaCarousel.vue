<template>
  <div class="relative overflow-hidden rounded-2xl bg-gray-900">
    <div
      v-if="!urls.length"
      class="relative flex w-full items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-100 to-violet-100"
      :style="posterFrameStyle"
    >
      <span class="text-sm text-gray-500">Без афиши</span>
    </div>
    <template v-else>
      <div class="relative w-full overflow-hidden" :style="posterFrameStyle">
        <img
          v-if="!imageFailed"
          :src="urls[activeIndex]"
          :alt="alt"
          class="absolute inset-0 h-full w-full object-cover object-center"
          referrerpolicy="no-referrer"
          @error="handleImageError"
        />
        <div
          v-else
          class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-100 to-violet-100"
        >
          <span class="text-sm text-gray-500">Афиша недоступна</span>
        </div>
        <button
          v-if="urls.length > 1"
          type="button"
          class="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur hover:bg-black/70"
          aria-label="Предыдущее фото"
          @click="prev"
        >
          ‹
        </button>
        <button
          v-if="urls.length > 1"
          type="button"
          class="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur hover:bg-black/70"
          aria-label="Следующее фото"
          @click="next"
        >
          ›
        </button>
        <div
          v-if="urls.length > 1"
          class="absolute bottom-3 left-0 right-0 z-10 flex justify-center gap-1.5"
        >
          <button
            v-for="(_, i) in urls"
            :key="i"
            type="button"
            class="h-1.5 rounded-full transition-all"
            :class="i === activeIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/50'"
            :aria-label="`Фото ${i + 1}`"
            @click="activeIndex = i"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
const posterFrameStyle = { aspectRatio: '768 / 480' } as const

const props = withDefaults(
  defineProps<{
    urls: string[]
    alt?: string
  }>(),
  { alt: 'Афиша события' },
)

const activeIndex = ref(0)
const imageFailed = ref(false)
const failedIndexes = ref<Set<number>>(new Set())

watch(() => props.urls, () => {
  activeIndex.value = 0
  imageFailed.value = false
  failedIndexes.value = new Set()
})

function prev() {
  const n = props.urls.length
  if (n < 2) return
  activeIndex.value = (activeIndex.value - 1 + n) % n
}

function next() {
  const n = props.urls.length
  if (n < 2) return
  activeIndex.value = (activeIndex.value + 1) % n
}

function handleImageError() {
  const n = props.urls.length
  failedIndexes.value.add(activeIndex.value)
  if (n < 2) {
    imageFailed.value = true
    return
  }
  if (failedIndexes.value.size >= n) {
    imageFailed.value = true
    return
  }
  let nextIndex = (activeIndex.value + 1) % n
  while (failedIndexes.value.has(nextIndex) && failedIndexes.value.size < n) {
    nextIndex = (nextIndex + 1) % n
  }
  activeIndex.value = nextIndex
}
</script>
