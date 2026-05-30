<template>
  <div class="profile-page">
    <h1>Профиль</h1>

    <div class="card">
      <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2>Данные пользователя</h2>
          <p class="hint">
            В mini app показываем всё, что уже знаем о пользователе из мессенджера, аккаунта и сохранённой анкеты.
          </p>
        </div>
        <span v-if="isMessengerMiniApp" class="badge badge-messenger">
          Mini App
        </span>
      </div>

      <dl class="info mt-4">
        <div>
          <dt>Имя</dt>
          <dd>{{ resolvedProfileName || 'Пока не указано' }}</dd>
        </div>
        <div>
          <dt>Телефон</dt>
          <dd>{{ profileForm.phone || 'Пока не указан' }}</dd>
        </div>
        <div>
          <dt>Email</dt>
          <dd>{{ resolvedEmail || 'Пока не указан' }}</dd>
        </div>
        <div>
          <dt>Telegram</dt>
          <dd>{{ telegramDisplay }}</dd>
        </div>
        <div>
          <dt>MAX</dt>
          <dd>{{ maxDisplay }}</dd>
        </div>
        <div v-if="messengerDebugLabel">
          <dt>Источник</dt>
          <dd>{{ messengerDebugLabel }}</dd>
        </div>
      </dl>

      <div v-if="!hasAnyProfileData" class="empty-state">
        <p class="font-medium text-gray-900">
          Пока о пользователе нет данных.
        </p>
        <p class="hint">
          Нажмите «Редактировать данные», чтобы заполнить анкету, или привяжите аккаунт через бота.
        </p>
      </div>

      <div class="mt-4 flex flex-col gap-2">
        <button
          type="button"
          class="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white sm:w-auto sm:self-start"
          @click="showProfileModal = true"
        >
          Редактировать данные
        </button>
        <div class="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <button
            v-if="telegramBotUrl"
            type="button"
            class="rounded-lg border border-primary bg-white px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5"
            @click="isMessengerMiniApp ? openTelegramAuth() : openAuthChooserModal()"
          >
            {{ isMessengerMiniApp ? 'Запросить данные через Telegram' : (telegramId !== null ? 'Перепривязать Telegram' : 'Войти через Telegram') }}
          </button>
          <button
            v-if="maxBotUrl"
            type="button"
            class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            @click="isMessengerMiniApp ? openMaxAuth() : openAuthChooserModal()"
          >
            {{ isMessengerMiniApp ? 'Запросить данные через MAX' : (maxUserId ? 'Перепривязать MAX' : 'Войти через MAX') }}
          </button>
          <button
            v-if="!isMessengerMiniApp && !user"
            type="button"
            class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            @click="openAuthChooserModal"
          >
            Выбрать способ входа
          </button>
        </div>
      </div>
    </div>

    <template v-if="user">
      <div class="card">
        <h2>Уведомления и подписки</h2>
        <p class="hint">
          Темы афиши, теги интересов и отключение маркетинговых рассылок.
        </p>
        <NuxtLink
          :to="`/${defaultCitySlug}/subscriptions`"
          class="mt-4 inline-flex rounded-lg border border-primary bg-white px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5"
        >
          Настроить подписки
        </NuxtLink>
      </div>

      <div class="card">
        <h2>Мои записи</h2>
        <p class="hint">
          История записей и билетов появится в следующем обновлении INUU. Пока сохраняйте избранное и подписки через Telegram / MAX.
        </p>
        <NuxtLink
          :to="`/${defaultCitySlug}`"
          class="mt-4 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
        >
          На главную города
        </NuxtLink>
      </div>
    </template>
  </div>
  <Teleport to="body">
    <div>
    <div v-if="showProfileModal" class="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto p-4 py-10">
      <div class="absolute inset-0 bg-black/40" @click="showProfileModal = false" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-sheet-title"
        class="relative z-[1] my-auto w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-xl"
        @click.stop
      >
        <div class="flex items-start justify-between gap-3">
          <div>
            <h3 id="profile-sheet-title" class="text-base font-semibold text-gray-900">
              Анкета для заказа
            </h3>
            <p class="mt-1 hint">
              Эти данные можно заранее заполнить в mini app, чтобы оформление заказа было быстрее.
            </p>
          </div>
          <button
            type="button"
            class="shrink-0 rounded-lg px-2 py-1 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-800"
            aria-label="Закрыть"
            @click="showProfileModal = false"
          >
            ✕
          </button>
        </div>
        <span v-if="saveStatus" class="mt-2 block text-xs text-gray-500">{{ saveStatus }}</span>

        <div class="mt-4 grid gap-3">
          <label class="field">
            <span>Имя</span>
            <input
              v-model="profileForm.name"
              type="text"
              placeholder="Как к вам обращаться"
            >
          </label>
          <label class="field">
            <span>Телефон</span>
            <input
              v-model="profileForm.phone"
              type="tel"
              placeholder="+7 900 000-00-00"
            >
          </label>
          <label class="field">
            <span>Комментарий</span>
            <textarea
              v-model="profileForm.notes"
              rows="3"
              placeholder="Например: домофон, этаж, удобный способ связи"
            ></textarea>
          </label>
        </div>

        <div class="mt-5 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="isSaving"
            @click="saveProfileDraft"
          >
            {{ isSaving ? 'Сохраняем...' : 'Сохранить данные' }}
          </button>
          <button
            v-if="telegramBotUrl || maxBotUrl || vkAuthEnabled"
            type="button"
            class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            @click="openAuthChooserModal"
          >
            Заполнить через бота
          </button>
        </div>
      </div>
    </div>

    <AuthChannelModal
      v-model="showAuthModal"
      title="Выберите бота"
      description="Откроется чат с ботом — продолжите там, затем вернитесь на сайт при необходимости."
      :channels="profileAuthChannels"
      intent="profile"
      variant="light"
      :consent-href="consentPath"
      @submit="onProfileAuthChannelSubmit"
    />
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useSupabaseClient, useSupabaseUser } from '#imports'
import { useRoute } from 'vue-router'
import { useTenant } from '../composables/useTenant'
import { useTelegram } from '../composables/useTelegram'
import { useMessengerStorage } from '../composables/useMessengerStorage'
import type { AuthChannel } from '~/types/authChannel'

declare const useRuntimeConfig: any
declare const navigateTo: (to: any) => Promise<void> | void

const user = useSupabaseUser()
const supabase = useSupabaseClient()
const route = useRoute()
const { tenantPath, tenantKey } = useTenant()
const { consentPath } = useLegalPaths()
const config = useRuntimeConfig()
const defaultCitySlug = computed(() => {
  const raw = config.public?.defaultCitySlug
  return typeof raw === 'string' && raw.trim() ? raw.trim() : 'ulan-ude'
})
const { isMessengerMiniApp, isTelegram, isMaxMiniApp, messengerWebApp } = useTelegram()
const { canUseMessengerStorage, getItem, setItem } = useMessengerStorage()
const telegramBotName = (config.public.telegramBotName as string | undefined) || ''
const telegramBotUrl = computed(() => (telegramBotName ? `https://t.me/${telegramBotName}` : null))
const maxBotUrl = computed(() => {
  const raw = (config.public.maxBotUrl as string | undefined) || ''
  const trimmed = raw.trim()
  return trimmed || null
})
const vkAuthEnabled = computed(() => {
  const raw = config.public.vkIdClientId as string | number | undefined
  const appId = raw != null && raw !== '' ? String(raw).trim() : ''
  return Boolean(appId)
})

const profileAuthChannels = computed((): AuthChannel[] => {
  const opts: AuthChannel[] = []
  if (telegramBotUrl.value) opts.push('telegram')
  if (maxBotUrl.value) opts.push('max')
  if (vkAuthEnabled.value) opts.push('vk')
  return opts
})

const showAuthModal = ref(false)

function openAuthChooserModal() {
  showAuthModal.value = true
}

function closeAuthChooserModal() {
  showAuthModal.value = false
}

function onProfileAuthChannelSubmit(channel: AuthChannel) {
  if (channel === 'telegram') {
    void openTelegramAuth()
    return
  }
  if (channel === 'max') {
    void openMaxAuth()
    return
  }
  void openVkAuth()
}

const showProfileModal = ref(false)
const isSaving = ref(false)
const saveStatus = ref('')

type ProfileDraft = {
  name: string
  phone: string
  notes: string
}

const PROFILE_DRAFT_STORAGE_KEY = 'teleshop_profile_draft'
const profileForm = reactive<ProfileDraft>({
  name: '',
  phone: '',
  notes: '',
})

const userId = computed<string | null>(() => {
  const raw = (user.value as any)?.sub
  return typeof raw === 'string' ? raw : null
})

const telegramId = computed<number | null>(() => {
  const raw = (user.value as any)?.user_metadata?.telegram_id
  return typeof raw === 'number' ? raw : null
})

const maxUserId = computed<string | null>(() => {
  const raw = (user.value as any)?.user_metadata?.max_user_id
  if (typeof raw === 'string') {
    const trimmed = raw.trim()
    return trimmed || null
  }
  if (typeof raw === 'number') return String(raw)
  return null
})

const authMetadata = computed<Record<string, any>>(() => ((user.value as any)?.user_metadata ?? {}) as Record<string, any>)

const messengerUser = computed<Record<string, any> | null>(() => {
  const raw = messengerWebApp.value?.initDataUnsafe?.user
  return raw && typeof raw === 'object' ? (raw as Record<string, any>) : null
})

const resolvedEmail = computed<string | null>(() => {
  const raw = (user.value as any)?.email
  return typeof raw === 'string' && raw.trim() ? raw.trim() : null
})

const resolvedProfileName = computed<string>(() => {
  const candidates = [
    profileForm.name,
    authMetadata.value.full_name,
    authMetadata.value.name,
    authMetadata.value.first_name,
    [messengerUser.value?.first_name, messengerUser.value?.last_name].filter(Boolean).join(' '),
    messengerUser.value?.username ? `@${messengerUser.value.username}` : '',
  ]
  for (const item of candidates) {
    if (typeof item === 'string' && item.trim()) return item.trim()
  }
  return ''
})

const telegramDisplay = computed(() => {
  if (telegramId.value !== null) return `Привязан, ID ${telegramId.value}`
  if (isTelegram.value && messengerUser.value?.id) {
    const username = typeof messengerUser.value.username === 'string' && messengerUser.value.username.trim()
      ? ` (@${messengerUser.value.username.trim()})`
      : ''
    return `Mini App user ID ${messengerUser.value.id}${username}`
  }
  return 'Не подключён'
})

const maxDisplay = computed(() => {
  if (maxUserId.value) return `Привязан, ID ${maxUserId.value}`
  if (isMaxMiniApp.value && messengerUser.value?.id) {
    return `Mini App user ID ${messengerUser.value.id}`
  }
  return 'Не подключён'
})

const messengerDebugLabel = computed(() => {
  if (isTelegram.value) return 'Telegram Mini App'
  if (isMaxMiniApp.value) return 'MAX Mini App'
  if (user.value) return 'Аккаунт сайта'
  return ''
})

const hasAnyProfileData = computed(() => {
  return Boolean(
    resolvedProfileName.value
    || profileForm.phone.trim()
    || resolvedEmail.value
    || telegramId.value !== null
    || maxUserId.value
    || messengerUser.value?.id,
  )
})

function profileDraftStorageKey() {
  const shopRef =
    (typeof route.query.shop_id === 'string' && route.query.shop_id.trim())
    || tenantKey.value?.trim()
    || 'default'
  return `${PROFILE_DRAFT_STORAGE_KEY}:${shopRef}`
}

function applyDraft(draft: Partial<ProfileDraft> | null | undefined) {
  if (!draft || typeof draft !== 'object') return
  if (typeof draft.name === 'string') profileForm.name = draft.name
  if (typeof draft.phone === 'string') profileForm.phone = draft.phone
  if (typeof draft.notes === 'string') profileForm.notes = draft.notes
}

function hydrateProfileFormFromKnownSources() {
  if (!profileForm.name.trim()) {
    const fallbackName = [
      authMetadata.value.full_name,
      authMetadata.value.name,
      [messengerUser.value?.first_name, messengerUser.value?.last_name].filter(Boolean).join(' '),
    ].find((value) => typeof value === 'string' && value.trim())
    if (typeof fallbackName === 'string') profileForm.name = fallbackName.trim()
  }
  if (!profileForm.phone.trim() && typeof authMetadata.value.phone === 'string') {
    profileForm.phone = authMetadata.value.phone.trim()
  }
  if (!profileForm.notes.trim() && typeof authMetadata.value.order_notes === 'string') {
    profileForm.notes = authMetadata.value.order_notes.trim()
  }
}

async function loadProfileDraft() {
  let parsed: Partial<ProfileDraft> | null = null
  if (canUseMessengerStorage()) {
    try {
      const raw = await getItem(profileDraftStorageKey())
      parsed = raw ? JSON.parse(raw) : null
    } catch {
      parsed = null
    }
  }
  if (!parsed && process.client) {
    try {
      const raw = localStorage.getItem(profileDraftStorageKey())
      parsed = raw ? JSON.parse(raw) : null
    } catch {
      parsed = null
    }
  }
  applyDraft(parsed)
  hydrateProfileFormFromKnownSources()
}

async function persistProfileDraft(draft: ProfileDraft) {
  const data = JSON.stringify(draft)
  if (process.client) {
    try {
      localStorage.setItem(profileDraftStorageKey(), data)
    } catch {
      // ignore
    }
  }
  if (canUseMessengerStorage()) {
    await setItem(profileDraftStorageKey(), data)
  }
}

async function saveProfileDraft() {
  isSaving.value = true
  saveStatus.value = ''
  const payload: ProfileDraft = {
    name: profileForm.name.trim(),
    phone: profileForm.phone.trim(),
    notes: profileForm.notes.trim(),
  }
  try {
    await persistProfileDraft(payload)
    if (user.value) {
      const { error } = await supabase.auth.updateUser({
        data: {
          ...authMetadata.value,
          full_name: payload.name || null,
          phone: payload.phone || null,
          order_notes: payload.notes || null,
        },
      })
      if (error) throw error
    }
    saveStatus.value = 'Сохранено'
  } catch {
    saveStatus.value = 'Не удалось сохранить'
  } finally {
    isSaving.value = false
    setTimeout(() => {
      if (saveStatus.value === 'Сохранено') saveStatus.value = ''
    }, 2200)
  }
}

onMounted(() => {
  void loadProfileDraft()
})

watch([user, messengerUser], () => {
  hydrateProfileFormFromKnownSources()
}, { immediate: true })

function openMessengerExternalUrl(url: string) {
  if (typeof window === 'undefined' || !url) return
  try {
    const tg = (window as unknown as { Telegram?: { WebApp?: { openLink?: (u: string) => void } } }).Telegram
      ?.WebApp
    if (tg && typeof tg.openLink === 'function') {
      tg.openLink(url)
      return
    }
  } catch {
    // fall through to window.open
  }
  try {
    const max = (window as unknown as { WebApp?: { openLink?: (u: string) => void } }).WebApp
    if (max && typeof max.openLink === 'function') {
      max.openLink(url)
      return
    }
  } catch {
    // fall through
  }
  window.open(url, '_blank', 'noopener')
}

async function openTelegramAuth() {
  closeAuthChooserModal()
  if (!telegramBotUrl.value || typeof window === 'undefined') return
  const shopRef =
    (typeof route.query.shop_id === 'string' && route.query.shop_id.trim()) || tenantKey.value?.trim() || ''
  if (!shopRef) {
    openMessengerExternalUrl(telegramBotUrl.value)
    return
  }
  const citySlug = typeof route.params.city_slug === 'string' ? route.params.city_slug.trim() : ''
  try {
    const res = await $fetch<{ ok: boolean; token: string; botStartParam: string }>(
      '/api/auth/request-telegram-link',
      {
        method: 'POST',
        headers: { 'x-shop-id': shopRef },
        body: {
          shopId: shopRef,
          citySlug: citySlug || undefined,
          redirectPath: tenantPath('/profile'),
        },
      },
    )
    if (!res?.ok || !res.token || !res.botStartParam) {
      throw new Error('bad_response')
    }
    const tgUrl = `${telegramBotUrl.value}?start=${encodeURIComponent(res.botStartParam)}`
    openMessengerExternalUrl(tgUrl)
    await navigateTo({
      path: '/link-telegram',
      query: {
        token: res.token,
        redirect: tenantPath('/profile'),
        shop_id: shopRef,
      },
    })
  } catch {
    window.alert('Не удалось начать вход через Telegram. Попробуйте ещё раз.')
  }
}

async function openVkAuth() {
  closeAuthChooserModal()
  if (!vkAuthEnabled.value || typeof window === 'undefined') return
  const shopRef =
    (typeof route.query.shop_id === 'string' && route.query.shop_id.trim()) || tenantKey.value?.trim() || ''
  if (!shopRef) {
    window.alert('Не удалось определить ресторан. Откройте профиль со страницы ресторана или добавьте shop_id в адрес.')
    return
  }
  const citySlug = typeof route.params.city_slug === 'string' ? route.params.city_slug.trim() : ''
  const redirectPath = tenantPath('/profile')
  try {
    const res = await $fetch<{ ok: boolean; token: string; authorizeUrl: string }>('/api/auth/request-vk-link', {
      method: 'POST',
      headers: { 'x-shop-id': shopRef },
      body: {
        shopId: shopRef,
        citySlug: citySlug || undefined,
        redirectPath,
      },
    })
    if (!res?.ok || !res.token || !res.authorizeUrl) {
      throw new Error('bad_response')
    }
    await navigateTo({
      path: '/link-vk',
      query: {
        token: res.token,
        redirect: redirectPath,
        shop_id: shopRef,
      },
    })
    window.location.href = res.authorizeUrl
  } catch {
    window.alert('Не удалось начать вход через ВКонтакте. Попробуйте ещё раз.')
  }
}

async function openMaxAuth() {
  closeAuthChooserModal()
  if (!maxBotUrl.value || typeof window === 'undefined') return
  const shopRef =
    (typeof route.query.shop_id === 'string' && route.query.shop_id.trim()) || tenantKey.value?.trim() || ''
  if (!shopRef) {
    openMessengerExternalUrl(maxBotUrl.value)
    return
  }
  const citySlug = typeof route.params.city_slug === 'string' ? route.params.city_slug.trim() : ''
  try {
    const res = await $fetch<{ ok: boolean; token: string; botStartParam: string }>(
      '/api/auth/request-max-link',
      {
        method: 'POST',
        headers: { 'x-shop-id': shopRef },
        body: {
          shopId: shopRef,
          citySlug: citySlug || undefined,
          redirectPath: tenantPath('/profile'),
        },
      },
    )
    if (!res?.ok || !res.token || !res.botStartParam) {
      throw new Error('bad_response')
    }
    const hasQuery = maxBotUrl.value.includes('?')
    const maxUrl = `${maxBotUrl.value}${hasQuery ? '&' : '?'}start=${encodeURIComponent(res.botStartParam)}`
    openMessengerExternalUrl(maxUrl)
    await navigateTo({
      path: '/link-max',
      query: {
        token: res.token,
        redirect: tenantPath('/profile'),
        shop_id: shopRef,
      },
    })
  } catch {
    window.alert('Не удалось начать вход через MAX. Попробуйте ещё раз.')
  }
}
</script>

<style scoped>
.profile-page {
  max-width: 640px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem;
  display: grid;
  gap: 1rem;
}

h1 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.25rem;
}

.card {
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  padding: 1.5rem;
}

.card h2 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.info {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
}

.badge {
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  border-radius: 999px;
  padding: 0.35rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.badge-messenger {
  background: #eff6ff;
  color: #1d4ed8;
}

.info dt {
  font-weight: 500;
  color: #4b5563;
}

.info dd {
  margin: 0;
  color: #111827;
}

.hint {
  font-size: 0.85rem;
  color: #6b7280;
}

.field {
  display: grid;
  gap: 0.4rem;
  font-size: 0.9rem;
  color: #374151;
}

.field input,
.field textarea {
  width: 100%;
  border-radius: 0.75rem;
  border: 1px solid #d1d5db;
  padding: 0.75rem 0.9rem;
  font-size: 0.95rem;
  color: #111827;
  background: #ffffff;
}

.field input:focus,
.field textarea:focus {
  outline: none;
  border-color: var(--color-primary, #2563eb);
  box-shadow: 0 0 0 1px var(--color-primary, #2563eb);
}

.empty-state {
  margin-top: 1rem;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  padding: 0.9rem 1rem;
}
</style>
