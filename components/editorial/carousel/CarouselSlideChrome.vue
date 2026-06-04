<template>
  <div class="relative h-full w-full">
    <slot />

    <div
      class="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center gap-3 px-10 pb-4 pt-10"
      :class="headerClass"
    >
      <div
        class="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl shadow-lg"
        :class="logoWrapClass"
      >
        <img
          v-if="showLogoImage"
          :src="logoUrl"
          alt=""
          crossorigin="anonymous"
          class="h-full w-full object-contain"
          @error="onLogoError"
        >
        <span
          v-else
          class="text-lg font-black tracking-tight"
          :class="logoFallbackClass"
        >{{ brandInitials }}</span>
      </div>
      <div class="min-w-0">
        <p class="truncate text-base font-bold leading-tight drop-shadow-md" :class="titleClass">
          {{ brandName }}
        </p>
        <p v-if="cityName" class="truncate text-sm opacity-80 drop-shadow" :class="subtitleClass">
          {{ cityName }}
        </p>
      </div>
    </div>

    <div
      class="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex items-end justify-between gap-4 px-10 pb-10 pt-16"
      :class="footerClass"
    >
      <p class="max-w-[55%] text-sm font-medium leading-snug drop-shadow" :class="sourceClass">
        {{ sourceLine }}
      </p>
      <div
        class="shrink-0 rounded-full px-5 py-2.5 text-base font-bold tabular-nums shadow-lg backdrop-blur-md"
        :class="counterClass"
      >
        {{ slideIndex }} / {{ totalSlides }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    slideIndex: number
    totalSlides: number
    brandName?: string
    cityName?: string
    logoUrl?: string
    variant?: 'dark' | 'light'
  }>(),
  {
    brandName: 'INUU',
    variant: 'dark',
  },
)

const logoBroken = ref(false)
const showLogoImage = computed(() => Boolean(props.logoUrl) && !logoBroken.value)

const brandInitials = computed(() => {
  const parts = props.brandName.trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return 'IN'
  return parts
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join('')
})

const sourceLine = computed(() => `Источник: ${props.brandName}`)

const isLight = computed(() => props.variant === 'light')

const headerClass = computed(() =>
  isLight.value ? 'bg-gradient-to-b from-white/90 to-transparent' : 'bg-gradient-to-b from-black/55 to-transparent',
)
const footerClass = computed(() =>
  isLight.value ? 'bg-gradient-to-t from-white/95 via-white/50 to-transparent' : 'bg-gradient-to-t from-black/75 via-black/35 to-transparent',
)
const logoWrapClass = computed(() => (isLight.value ? 'bg-white ring-1 ring-black/10' : 'bg-white/95'))
const logoFallbackClass = computed(() => (isLight.value ? 'text-primary' : 'text-primary'))
const titleClass = computed(() => (isLight.value ? 'text-stone-900' : 'text-white'))
const subtitleClass = computed(() => (isLight.value ? 'text-stone-600' : 'text-white/85'))
const sourceClass = computed(() => (isLight.value ? 'text-stone-600' : 'text-white/75'))
const counterClass = computed(() =>
  isLight.value ? 'bg-stone-900/90 text-white' : 'bg-black/60 text-white ring-1 ring-white/20',
)

function onLogoError() {
  logoBroken.value = true
}

watch(
  () => props.logoUrl,
  () => {
    logoBroken.value = false
  },
)
</script>
