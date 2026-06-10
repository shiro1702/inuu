<template>
  <div>
    <div v-if="!ready" class="flex min-h-dvh items-center justify-center text-gray-500">Загрузка…</div>
    <CarouselEditorShell
      v-else
      @back="goStudio"
    />
  </div>
</template>

<script setup lang="ts">
import CarouselEditorShell from '~/components/carousel-editor/CarouselEditorShell.vue'
import { useCarouselEditorStore } from '~/stores/carouselEditor'

definePageMeta({ layout: false })

const router = useRouter()
const config = useRuntimeConfig()
const store = useCarouselEditorStore()
const ready = ref(false)
async function init() {
  const defaultSlug = String(config.public.defaultCitySlug || 'ulan-ude')
  try {
    const cities = await $fetch<{ ok: boolean; items?: Array<{ citySlug: string; cityName: string }> }>(
      '/api/dashboard/manager/cities',
    ).catch(() => ({ ok: false, items: [] }))
    const match = cities?.items?.find((c) => c.citySlug === defaultSlug) || cities?.items?.[0]
    if (match) {
      store.setCity(match.citySlug, match.cityName)
    } else {
      store.setCity(defaultSlug, 'INUU')
    }
  } catch {
    store.setCity(defaultSlug, 'INUU')
  }
  ready.value = true
}

function goStudio() {
  router.push('/dashboard/carousel-studio')
}

onMounted(() => {
  void init()
})
</script>
