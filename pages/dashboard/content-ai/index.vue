<template>
  <article class="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
    <h2 class="text-lg font-semibold">Настройки TG/MAX по городу</h2>
    <p class="text-xs text-gray-500">Менеджерские чаты, чат модерации и списки групп/каналов для парсинга.</p>

    <div class="grid gap-3 md:grid-cols-2">
      <label class="space-y-1 text-sm">
        <span class="font-medium text-gray-700">TG manager chat id</span>
        <input v-model="settingsForm.telegramManagerChatId" class="w-full rounded-lg border border-gray-300 px-3 py-2" />
      </label>
      <label class="space-y-1 text-sm">
        <span class="font-medium text-gray-700">TG moderation chat id</span>
        <input v-model="settingsForm.telegramModerationChatId" class="w-full rounded-lg border border-gray-300 px-3 py-2" />
      </label>
      <label class="space-y-1 text-sm">
        <span class="font-medium text-gray-700">MAX manager chat id</span>
        <input v-model="settingsForm.maxManagerChatId" class="w-full rounded-lg border border-gray-300 px-3 py-2" />
      </label>
      <label class="space-y-1 text-sm">
        <span class="font-medium text-gray-700">MAX moderation chat id</span>
        <input v-model="settingsForm.maxModerationChatId" class="w-full rounded-lg border border-gray-300 px-3 py-2" />
      </label>
    </div>

    <div class="space-y-2 text-sm">
      <span class="font-medium text-gray-700">TG parser source chats</span>
      <div class="flex flex-wrap gap-2">
        <span v-for="chat in settingsForm.telegramParserSourceChats" :key="`tg-${chat}`" class="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-2 py-1 text-xs font-mono text-blue-800">
          {{ chat }}
          <button type="button" class="text-blue-700 hover:text-blue-900" @click="removeParserChat('telegram', chat)">×</button>
        </span>
        <span v-if="!settingsForm.telegramParserSourceChats.length" class="text-xs text-gray-500">Список пуст</span>
      </div>
      <div class="flex gap-2">
        <input
          v-model="settingsForm.telegramParserSourceInput"
          class="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-xs"
          placeholder="-1001234567890"
          @keydown.enter.prevent="addParserChat('telegram')"
        />
        <button type="button" class="rounded border border-gray-300 px-3 py-2 text-xs hover:bg-gray-50" @click="addParserChat('telegram')">Добавить</button>
      </div>
    </div>
    <div class="space-y-2 text-sm">
      <span class="font-medium text-gray-700">MAX parser source chats</span>
      <div class="flex flex-wrap gap-2">
        <span v-for="chat in settingsForm.maxParserSourceChats" :key="`max-${chat}`" class="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-mono text-emerald-800">
          {{ chat }}
          <button type="button" class="text-emerald-700 hover:text-emerald-900" @click="removeParserChat('max', chat)">×</button>
        </span>
        <span v-if="!settingsForm.maxParserSourceChats.length" class="text-xs text-gray-500">Список пуст</span>
      </div>
      <div class="flex gap-2">
        <input
          v-model="settingsForm.maxParserSourceInput"
          class="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-xs"
          placeholder="conversation_id"
          @keydown.enter.prevent="addParserChat('max')"
        />
        <button type="button" class="rounded border border-gray-300 px-3 py-2 text-xs hover:bg-gray-50" @click="addParserChat('max')">Добавить</button>
      </div>
    </div>

    <div class="flex items-center gap-3">
      <button class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50" :disabled="settingsLoading" @click="saveSettings">
        {{ settingsLoading ? 'Сохраняем...' : 'Сохранить настройки города' }}
      </button>
      <span v-if="settingsMessage" class="text-sm text-gray-700">{{ settingsMessage }}</span>
    </div>

    <div class="rounded border border-gray-200 p-3">
      <p class="text-sm font-medium text-gray-800">Быстрая привязка чатов через бота</p>
      <p class="mt-1 text-xs text-gray-500">Сгенерируйте ссылку, откройте ее в боте, затем отправьте команду в нужной группе/чате.</p>
      <div class="mt-2 flex flex-wrap gap-2">
        <button class="rounded border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50" @click="generateChatLink('telegram','manager')">TG manager</button>
        <button class="rounded border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50" @click="generateChatLink('telegram','moderation')">TG moderation</button>
        <button class="rounded border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50" @click="generateChatLink('telegram','parser_source')">TG parser source</button>
        <button class="rounded border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50" @click="generateChatLink('max','manager')">MAX manager</button>
        <button class="rounded border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50" @click="generateChatLink('max','moderation')">MAX moderation</button>
        <button class="rounded border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50" @click="generateChatLink('max','parser_source')">MAX parser source</button>
      </div>
      <div v-if="chatLinkResult" class="mt-3 space-y-1 text-xs">
        <p><span class="font-medium">Deep link:</span> <a class="text-primary underline" :href="chatLinkResult.deepLink" target="_blank">{{ chatLinkResult.deepLink }}</a></p>
        <p><span class="font-medium">Команда:</span> <code class="rounded bg-gray-100 px-1">{{ chatLinkResult.bindCommand }}</code></p>
        <p><span class="font-medium">Истекает:</span> {{ chatLinkResult.tokenExpiresAt }}</p>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'

definePageMeta({ layout: 'dashboard-content-ai' })

const { dashboardFetch } = useDashboardFetch()
const { selectedCitySlug } = useContentAiCity()

const settingsLoading = ref(false)
const settingsMessage = ref('')
const chatLinkResult = ref<{ deepLink: string; bindCommand: string; tokenExpiresAt: string } | null>(null)
const settingsForm = reactive({
  telegramManagerChatId: '',
  telegramModerationChatId: '',
  telegramParserSourceChats: [] as string[],
  telegramParserSourceInput: '',
  maxManagerChatId: '',
  maxModerationChatId: '',
  maxParserSourceChats: [] as string[],
  maxParserSourceInput: '',
})

async function loadSettings() {
  if (!selectedCitySlug.value) return
  settingsLoading.value = true
  settingsMessage.value = ''
  try {
    const res = await dashboardFetch(`/api/dashboard/manager/cities/${selectedCitySlug.value}/content-settings`)
    const payload = await res.json() as any
    const settings = payload?.settings || {}
    settingsForm.telegramManagerChatId = settings?.telegram?.manager_chat_id || ''
    settingsForm.telegramModerationChatId = settings?.telegram?.moderation_chat_id || ''
    settingsForm.telegramParserSourceChats = Array.isArray(settings?.telegram?.parser_source_chats)
      ? settings.telegram.parser_source_chats.map((x: unknown) => String(x || '').trim()).filter(Boolean)
      : []
    settingsForm.telegramParserSourceInput = ''
    settingsForm.maxManagerChatId = settings?.max?.manager_chat_id || ''
    settingsForm.maxModerationChatId = settings?.max?.moderation_chat_id || ''
    settingsForm.maxParserSourceChats = Array.isArray(settings?.max?.parser_source_chats)
      ? settings.max.parser_source_chats.map((x: unknown) => String(x || '').trim()).filter(Boolean)
      : []
    settingsForm.maxParserSourceInput = ''
  } catch (error: any) {
    settingsMessage.value = error?.data?.statusMessage || error?.message || 'Не удалось загрузить настройки'
  } finally {
    settingsLoading.value = false
  }
}

async function saveSettings() {
  if (!selectedCitySlug.value) return
  settingsLoading.value = true
  settingsMessage.value = ''
  try {
    const res = await dashboardFetch(`/api/dashboard/manager/cities/${selectedCitySlug.value}/content-settings`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        telegramManagerChatId: settingsForm.telegramManagerChatId,
        telegramModerationChatId: settingsForm.telegramModerationChatId,
        telegramParserSourceChats: settingsForm.telegramParserSourceChats,
        maxManagerChatId: settingsForm.maxManagerChatId,
        maxModerationChatId: settingsForm.maxModerationChatId,
        maxParserSourceChats: settingsForm.maxParserSourceChats,
      }),
    })
    if (!res.ok) throw new Error('Не удалось сохранить настройки')
    settingsMessage.value = 'Сохранено'
  } catch (error: any) {
    settingsMessage.value = error?.data?.statusMessage || error?.message || 'Ошибка сохранения'
  } finally {
    settingsLoading.value = false
  }
}

function addParserChat(channel: 'telegram' | 'max') {
  const isTelegram = channel === 'telegram'
  const input = isTelegram ? settingsForm.telegramParserSourceInput : settingsForm.maxParserSourceInput
  const value = String(input || '').trim()
  if (!value) return
  if (isTelegram) {
    if (!settingsForm.telegramParserSourceChats.includes(value)) {
      settingsForm.telegramParserSourceChats.push(value)
    }
    settingsForm.telegramParserSourceInput = ''
    return
  }
  if (!settingsForm.maxParserSourceChats.includes(value)) {
    settingsForm.maxParserSourceChats.push(value)
  }
  settingsForm.maxParserSourceInput = ''
}

function removeParserChat(channel: 'telegram' | 'max', value: string) {
  if (channel === 'telegram') {
    settingsForm.telegramParserSourceChats = settingsForm.telegramParserSourceChats.filter((x: string) => x !== value)
    return
  }
  settingsForm.maxParserSourceChats = settingsForm.maxParserSourceChats.filter((x: string) => x !== value)
}

async function generateChatLink(channel: 'telegram' | 'max', target: 'manager' | 'moderation' | 'parser_source') {
  if (!selectedCitySlug.value) return
  settingsMessage.value = ''
  chatLinkResult.value = null
  try {
    const res = await dashboardFetch(`/api/dashboard/manager/cities/${selectedCitySlug.value}/chat-link-token`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ channel, target }),
    })
    const payload = await res.json() as any
    if (!res.ok || payload?.ok === false) {
      throw new Error(payload?.statusMessage || payload?.message || 'Не удалось сгенерировать ссылку')
    }
    chatLinkResult.value = {
      deepLink: String(payload.deepLink || ''),
      bindCommand: String(payload.bindCommand || ''),
      tokenExpiresAt: String(payload.tokenExpiresAt || ''),
    }
    settingsMessage.value = `Ссылка готова (${channel}/${target})`
  } catch (error: any) {
    settingsMessage.value = error?.data?.statusMessage || error?.message || 'Ошибка генерации ссылки'
  }
}

watch(selectedCitySlug, () => {
  void loadSettings()
})

onMounted(() => {
  if (selectedCitySlug.value) void loadSettings()
})
</script>
