<template>
  <div>
    <div v-if="loadError" class="p-6 text-center text-red-600">{{ loadError }}</div>
    <div v-else-if="store.loading" class="flex min-h-dvh items-center justify-center text-gray-500">
      Загрузка проекта…
    </div>
    <CarouselEditorShell
      v-else
      ref="shellRef"
      show-telegram-send
      show-project-type
      show-all-aspects
      :sending-tg="sendingTg"
      @back="goBack"
      @send-telegram="onSendTelegram"
    />

    <CarouselTelegramSendSheet
      :open="tgSheetOpen"
      :city-slug="store.citySlug"
      :prepare-slide="prepareSlideForTg"
      @close="tgSheetOpen = false"
      @sent="onTgSent"
    />
  </div>
</template>

<script setup lang="ts">
import CarouselEditorShell from '~/components/carousel-editor/CarouselEditorShell.vue'
import CarouselTelegramSendSheet from '~/components/carousel-editor/CarouselTelegramSendSheet.vue'
import { useCarouselEditorStore } from '~/stores/carouselEditor'

definePageMeta({ layout: false })

const route = useRoute()
const router = useRouter()
const store = useCarouselEditorStore()
const loadError = ref('')
const tgSheetOpen = ref(false)
const sendingTg = ref(false)
const shellRef = ref<InstanceType<typeof CarouselEditorShell> | null>(null)

async function prepareSlideForTg(index: number) {
  return shellRef.value?.prepareSlideForExport(index) || Promise.reject(new Error('Editor not ready'))
}

const projectId = computed(() => String(route.params.id || '').trim())

async function resolveEditorCityFallback() {
  try {
    const cities = await $fetch<{ ok: boolean; items?: Array<{ citySlug: string; cityName: string }> }>(
      '/api/dashboard/manager/cities',
    )
    const first = cities?.items?.[0]
    if (first) store.setCity(first.citySlug, first.cityName)
  } catch {
    const config = useRuntimeConfig()
    const slug = String(config.public.defaultCitySlug || 'ulan-ude')
    store.setCity(slug, 'INUU')
  }
}

async function loadProject() {
  if (!projectId.value) {
    loadError.value = 'Нет id проекта'
    return
  }
  loadError.value = ''
  try {
    await store.load(projectId.value)
    if (!store.citySlug) {
      await resolveEditorCityFallback()
    }
  } catch (err: unknown) {
    loadError.value = err instanceof Error ? err.message : 'Не удалось загрузить проект'
  }
}

function goBack() {
  router.push('/dashboard/carousel-studio')
}

function onSendTelegram() {
  tgSheetOpen.value = true
}

function onTgSent(message: string) {
  tgSheetOpen.value = false
  sendingTg.value = false
  alert(message)
}

onMounted(() => {
  void loadProject()
})
</script>
