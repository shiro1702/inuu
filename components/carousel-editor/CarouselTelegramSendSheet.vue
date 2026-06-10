<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex flex-col justify-end bg-black/40"
      @click.self="$emit('close')"
    >
      <div class="rounded-t-2xl bg-white px-4 pb-safe pt-3 shadow-xl">
        <div class="mb-3 flex items-center justify-between">
          <h3 class="text-base font-semibold">Отправить в Telegram</h3>
          <button type="button" class="p-2" @click="$emit('close')">✕</button>
        </div>

        <p v-if="store.telegramPostText" class="mb-2 text-xs text-gray-600 line-clamp-3">
          {{ store.telegramPostText }}
        </p>
        <button
          v-if="store.telegramPostText"
          type="button"
          class="mb-3 w-full rounded-lg border border-gray-300 py-2 text-sm"
          @click="copyTgText"
        >
          Скопировать текст для TG
        </button>

        <div class="space-y-2 pb-4">
          <button
            type="button"
            class="w-full rounded-xl bg-sky-600 py-3 text-sm font-medium text-white disabled:opacity-50"
            :disabled="sending"
            @click="send('moderation')"
          >
            {{ sending ? '…' : 'Чат модераторов' }}
          </button>
          <button
            type="button"
            class="w-full rounded-xl border border-gray-300 py-3 text-sm font-medium disabled:opacity-50"
            :disabled="sending"
            @click="send('dm')"
          >
            ЛС (нужен chat_id)
          </button>
        </div>
        <p v-if="error" class="pb-4 text-sm text-red-600">{{ error }}</p>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useCarouselEditorStore } from '~/stores/carouselEditor'
import { delayMs, waitForQrImages } from '~/utils/carouselExport'
import { generateCarouselQrDataUrl } from '~/utils/carouselQrCode'
import { preloadCarouselMedia, renderSlideToPng } from '~/utils/renderSlideToPng'

const props = defineProps<{
  open: boolean
  citySlug: string
  prepareSlide?: (index: number) => Promise<HTMLElement>
}>()

const emit = defineEmits<{
  close: []
  sent: [message: string]
}>()

const store = useCarouselEditorStore()
const sending = ref(false)
const error = ref('')

async function copyTgText() {
  if (!store.telegramPostText) return
  await navigator.clipboard.writeText(store.telegramPostText)
}

async function uploadPng(blob: Blob, index: number): Promise<string> {
  const reader = new FileReader()
  const base64 = await new Promise<string>((resolve, reject) => {
    reader.onload = () => {
      const dataUrl = String(reader.result || '')
      resolve(dataUrl.includes(',') ? dataUrl.split(',')[1]! : dataUrl)
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })

  const up = await $fetch<{ ok: boolean; url: string }>(
    `/api/dashboard/manager/cities/${props.citySlug}/editorial-cover/upload`,
    {
      method: 'POST',
      body: {
        fileName: `carousel-tg-${index + 1}.png`,
        mimeType: 'image/png',
        dataBase64: base64,
      },
    },
  )
  return up.url
}

async function send(destination: 'moderation' | 'dm') {
  if (!props.citySlug?.trim()) {
    error.value = 'Не выбран город проекта — перезагрузите страницу или сохраните проект заново'
    return
  }
  if (!props.prepareSlide) {
    error.value = 'Экспорт не готов'
    return
  }
  sending.value = true
  error.value = ''
  try {
    const qrDataUrl = store.linkHint.trim()
      ? await generateCarouselQrDataUrl(store.linkHint, { size: 960 })
      : null
    await preloadCarouselMedia([...store.slides.map((s) => s.media_url), qrDataUrl])

    const urls: string[] = []
    for (let i = 0; i < store.slides.length; i++) {
      store.setCurrentSlideIndex(i)
      await nextTick()
      const node = await props.prepareSlide(i)
      const slide = store.slides[i]!
      if (slide.role === 'outro') await waitForQrImages(node)
      const blob = await renderSlideToPng(node, { aspect: store.aspect })
      urls.push(await uploadPng(blob, i))
      if (i < store.slides.length - 1) await delayMs(200)
    }

    let chatId = ''
    if (destination === 'dm') {
      chatId = window.prompt('Telegram chat_id') || ''
      if (!chatId) throw new Error('chat_id обязателен')
    }

    await $fetch('/api/dashboard/carousel/telegram-queue', {
      method: 'POST',
      body: {
        city_slug: props.citySlug,
        destination,
        chat_id: chatId || undefined,
        media_urls: urls,
        caption: store.telegramPostText || store.title,
      },
    })

    await $fetch('/api/cron/telegram-queue-dispatch', { method: 'POST' }).catch(() => undefined)
    emit('sent', 'Карусель поставлена в очередь Telegram')
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Ошибка отправки'
  } finally {
    sending.value = false
  }
}
</script>
