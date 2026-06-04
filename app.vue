<template>
  <div class="app-root flex min-h-dvh flex-col bg-gray-50 text-gray-900" :style="rootStyle">
    <AppHeader v-if="showLegacyHeader" />
    <div
      class="flex flex-1 flex-col"
      :class="showLegacyHeader && !isMessengerMiniAppChrome ? 'pt-16' : ''"
    >
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
    <LegalCookieBanner
      v-if="isStorefrontRoute && cityBasePath"
      :privacy-path="`${cityBasePath}/legal/privacy`"
      :cookies-path="`${cityBasePath}/legal/cookies`"
    />
    <AppToastStack />
    <footer
      v-if="isStorefrontRoute && !isCityInuuRoute"
      class="mt-12 border-t border-gray-200 bg-white/95"
    >
      <div class="mx-auto max-w-7xl px-4 py-6 text-xs leading-6 text-gray-600 sm:px-6">
        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <p class="font-medium text-gray-700">
              Оператор платформы: ИП Баранзаев Арсалан Баярович
            </p>
            <p>ИНН: 032384437278</p>
            <p>ОГРНИП: 325030000033105</p>
          </div>
          <div>
            <p class="font-medium text-gray-700">Юридические документы</p>
            <div class="flex flex-wrap gap-x-3 gap-y-1">
              <NuxtLink :to="`${cityBasePath}/legal/privacy`" class="underline decoration-dotted hover:text-gray-900">
                Политика конфиденциальности
              </NuxtLink>
              <NuxtLink :to="`${cityBasePath}/legal/offer`" class="underline decoration-dotted hover:text-gray-900">
                Публичная оферта
              </NuxtLink>
              <NuxtLink :to="`${cityBasePath}/legal/consent`" class="underline decoration-dotted hover:text-gray-900">
                Согласие на обработку ПДн
              </NuxtLink>
              <NuxtLink :to="`${cityBasePath}/legal/contacts`" class="underline decoration-dotted hover:text-gray-900">
                Реквизиты и контакты
              </NuxtLink>
              <NuxtLink :to="`${cityBasePath}/legal/cookies`" class="underline decoration-dotted hover:text-gray-900">
                Файлы cookie
              </NuxtLink>
            </div>
            <p class="mt-2 text-gray-500">
              INUU — городской агрегатор событий, мест и сервисов. По записям и билетам — напрямую к организаторам.
            </p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onServerPrefetch } from 'vue'
import { useRoute } from 'vue-router'
import { useTelegram } from './composables/useTelegram'
import { useTenant } from './composables/useTenant'

const { isMessengerMiniAppChrome } = useTelegram()
const { cssVars, loadTenantSettings } = useTenant()
const route = useRoute()
const config = useRuntimeConfig()

const rootStyle = computed(() => cssVars.value)

const defaultCitySlug = computed(() => {
  const raw = config.public.defaultCitySlug
  return typeof raw === 'string' && raw.trim() ? raw.trim() : 'ulan-ude'
})

const isCityInuuRoute = computed(() => {
  const routePath = typeof route.path === 'string' ? route.path : ''
  const citySlug = route.params?.city_slug
  const hasCitySlug = Array.isArray(citySlug)
    ? citySlug.length > 0
    : typeof citySlug === 'string' && citySlug.length > 0
  if (!hasCitySlug) return false
  const tenantSlug = route.params?.tenant_slug
  const hasTenantSlug = Array.isArray(tenantSlug)
    ? tenantSlug.length > 0
    : typeof tenantSlug === 'string' && tenantSlug.length > 0
  return !hasTenantSlug
})

const routeLayoutName = computed(() => {
  const raw = route.meta?.layout
  return typeof raw === 'string' ? raw : ''
})

const isDashboardShell = computed(() => {
  const routePath = typeof route.path === 'string' ? route.path : ''
  if (routePath.startsWith('/dashboard') || routePath.startsWith('/platform')) return true
  const layout = routeLayoutName.value
  return layout === 'dashboard' || layout === 'dashboard-auth'
})

const showLegacyHeader = computed(() => {
  if (isDashboardShell.value) return false
  const routePath = typeof route.path === 'string' ? route.path : ''
  if (routePath === '/' || routePath === '') return false
  if (routePath.startsWith('/moderation') || routePath.startsWith('/content-submission')) return false
  if (isCityInuuRoute.value) return false
  return true
})

const isStorefrontRoute = computed(() => {
  const citySlug = route.params?.city_slug
  const hasCitySlug = Array.isArray(citySlug)
    ? citySlug.length > 0
    : typeof citySlug === 'string' && citySlug.length > 0
  return hasCitySlug
})

const cityBasePath = computed(() => {
  const citySlug = route.params?.city_slug
  const city = Array.isArray(citySlug) ? citySlug[0] : citySlug
  if (typeof city === 'string' && city) return `/${city}`
  return `/${defaultCitySlug.value}`
})

onMounted(async () => {
  if (!showLegacyHeader.value) return
  await loadTenantSettings()
})

onServerPrefetch(async () => {
  if (!showLegacyHeader.value) return
  await loadTenantSettings()
})
</script>
