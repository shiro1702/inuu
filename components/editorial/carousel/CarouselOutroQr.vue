<template>
  <div v-if="linkHint?.trim()" :class="frameClass">
    <img
      v-if="qrDataUrl"
      :src="qrDataUrl"
      alt=""
      crossorigin="anonymous"
      :class="imageClass"
      @load="onLoad"
      @error="onError"
    >
    <div
      v-else
      :class="placeholderClass"
      aria-hidden="true"
    >
      <span class="font-mono text-xs tracking-widest opacity-40">QR…</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { generateCarouselQrDataUrl } from '~/utils/carouselQrCode'

const props = withDefaults(
  defineProps<{
    linkHint?: string | null
    size?: number
    frameClass?: string
    imageClass?: string
    placeholderClass?: string
  }>(),
  {
    size: 840,
    frameClass: 'inline-flex items-center justify-center',
    imageClass: 'h-[33rem] w-[33rem] rounded-2xl',
    placeholderClass:
      'flex h-[33rem] w-[33rem] items-center justify-center rounded-2xl bg-black/5',
  },
)

const qrDataUrl = ref<string | null>(null)
const loadError = ref(false)

async function rebuildQr() {
  loadError.value = false
  if (!props.linkHint?.trim()) {
    qrDataUrl.value = null
    return
  }
  try {
    qrDataUrl.value = await generateCarouselQrDataUrl(props.linkHint, {
      size: props.size,
      margin: 2,
    })
  } catch {
    qrDataUrl.value = null
    loadError.value = true
  }
}

function onLoad() {
  loadError.value = false
}

function onError() {
  loadError.value = true
}

watch(() => props.linkHint, () => void rebuildQr(), { immediate: true })
</script>
