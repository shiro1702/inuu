<template>
  <div class="flex min-h-full flex-1 flex-col bg-gray-50 text-gray-900">
    <header class="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div class="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <NuxtLink :to="cityBasePath" class="truncate text-base font-semibold text-gray-900">
          {{ displayName }}
        </NuxtLink>
        <nav class="flex items-center gap-1 text-sm sm:gap-2">
          <NuxtLink
            :to="`${cityBasePath}/events`"
            class="rounded-lg px-2 py-1.5 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            active-class="bg-gray-100 font-medium text-gray-900"
          >
            Афиша
          </NuxtLink>
          <NuxtLink
            :to="`${cityBasePath}/venues`"
            class="rounded-lg px-2 py-1.5 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            active-class="bg-gray-100 font-medium text-gray-900"
          >
            Места
          </NuxtLink>
          <NuxtLink
            :to="`${cityBasePath}/map`"
            class="hidden rounded-lg px-2 py-1.5 text-gray-600 hover:bg-gray-100 hover:text-gray-900 sm:inline-flex"
            active-class="bg-gray-100 font-medium text-gray-900"
          >
            Карта
          </NuxtLink>
          <NuxtLink
            v-if="showCabinetLink"
            to="/dashboard/content-ai"
            class="rounded-lg border border-primary bg-primary/5 px-2 py-1.5 text-sm font-medium text-primary hover:bg-primary/10"
          >
            Кабинет
          </NuxtLink>
          <CityGuestUserMenu
            v-else-if="showGuestUserMenu"
            :subscriptions-path="`${cityBasePath}/subscriptions`"
            :logout-redirect-path="`${cityBasePath}/events`"
          />
          <button
            v-else-if="showGuestBotLogin"
            type="button"
            class="rounded-lg border border-primary px-2 py-1.5 text-sm font-medium text-primary hover:bg-primary/5"
            @click="openGuestAuthModal"
          >
            Войти в бот
          </button>
        </nav>
      </div>
    </header>
    <main class="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6">
      <slot />
    </main>

    <CitySiteFooter />

    <AuthChannelModal
      v-model="guestAuthModalOpen"
      title="Вход для гостей"
      description="Через Telegram или MAX — чтобы сохранять подписки и записи. Это не кабинет редакции города."
      :channels="cityAuthChannels"
      intent="login"
      variant="light"
      :consent-href="consentPath"
      @submit="onAuthChannelSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { AuthChannel } from '~/types/authChannel'

const { cityBasePath, displayName, slug } = useCity()
const { consentPath } = useLegalPaths()
const { isMessengerMiniAppChrome } = useTelegram()
const user = useSupabaseUser()
const authReady = ref(false)
const config = useRuntimeConfig()
const route = useRoute()
const router = useRouter()

const { hasDashboardAccess, dashboardAccessChecked } = useDashboardAccess()
const { guestAuthModalOpen, openGuestAuthModal } = useCityGuestAuth()

const telegramBotName = (config.public.telegramBotName as string | undefined) || ''
const telegramBotUrl = computed(() =>
  telegramBotName ? `https://t.me/${telegramBotName}` : null,
)
const maxBotUrl = computed(() => {
  const raw = (config.public.maxBotUrl as string | undefined) || ''
  const trimmed = raw.trim()
  return trimmed || null
})

const cityAuthChannels = computed((): AuthChannel[] => {
  const opts: AuthChannel[] = []
  if (telegramBotUrl.value) opts.push('telegram')
  if (maxBotUrl.value) opts.push('max')
  return opts
})

const hasBotAuth = computed(() => cityAuthChannels.value.length > 0)

const navAuthReady = computed(() => authReady.value && dashboardAccessChecked.value)

const showCabinetLink = computed(() => navAuthReady.value && hasDashboardAccess.value)

const showGuestUserMenu = computed(() => {
  if (!navAuthReady.value) return false
  if (hasDashboardAccess.value) return false
  return !!user.value
})

const showGuestBotLogin = computed(() => {
  if (!navAuthReady.value) return false
  if (hasDashboardAccess.value) return false
  if (isMessengerMiniAppChrome.value) return false
  if (user.value) return false
  return hasBotAuth.value
})

const supabase = useSupabaseClient()

onMounted(async () => {
  try {
    await supabase.auth.getSession()
  } finally {
    authReady.value = true
  }
})

function resolvePostLoginRedirectPath(): string {
  const raw = typeof route.fullPath === 'string' ? route.fullPath.trim() : ''
  const fallback = cityBasePath.value
  if (!raw || !raw.startsWith('/') || raw.startsWith('//')) return fallback
  return raw
}

function onAuthChannelSubmit(channel: AuthChannel) {
  if (channel === 'telegram') {
    void openTelegramAuth()
    return
  }
  if (channel === 'max') {
    void openMaxAuth()
  }
}

async function openTelegramAuth() {
  guestAuthModalOpen.value = false
  if (!telegramBotUrl.value || typeof window === 'undefined') return
  const redirectPath = resolvePostLoginRedirectPath()
  try {
    const res = await $fetch<{ ok: boolean; token: string; botStartParam: string }>(
      '/api/auth/request-telegram-link',
      {
        method: 'POST',
        body: {
          citySlug: slug.value,
          redirectPath,
        },
      },
    )
    if (!res?.ok || !res.token || !res.botStartParam) {
      throw new Error('bad_response')
    }
    const tgUrl = `${telegramBotUrl.value}?start=${encodeURIComponent(res.botStartParam)}`
    window.open(tgUrl, '_blank', 'noopener')
    await router.push({
      path: '/link-telegram',
      query: {
        token: res.token,
        redirect: redirectPath,
      },
    })
  } catch {
    window.alert('Не удалось начать вход через Telegram. Попробуйте ещё раз.')
  }
}

async function openMaxAuth() {
  guestAuthModalOpen.value = false
  if (!maxBotUrl.value || typeof window === 'undefined') return
  const redirectPath = resolvePostLoginRedirectPath()
  try {
    const res = await $fetch<{ ok: boolean; token: string; botStartParam: string }>(
      '/api/auth/request-max-link',
      {
        method: 'POST',
        body: {
          citySlug: slug.value,
          redirectPath,
        },
      },
    )
    if (!res?.ok || !res.token || !res.botStartParam) {
      throw new Error('bad_response')
    }
    const hasQuery = maxBotUrl.value.includes('?')
    const maxUrl = `${maxBotUrl.value}${hasQuery ? '&' : '?'}start=${encodeURIComponent(res.botStartParam)}`
    window.open(maxUrl, '_blank', 'noopener')
    await router.push({
      path: '/link-max',
      query: {
        token: res.token,
        redirect: redirectPath,
      },
    })
  } catch {
    window.alert('Не удалось начать вход через MAX. Попробуйте ещё раз.')
  }
}
</script>
