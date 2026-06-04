<template>
  <footer class="mt-auto shrink-0 border-t border-gray-200 bg-white/95 max-sm:pb-24">
    <div class="mx-auto max-w-6xl px-4 py-6 text-xs leading-6 text-gray-600 sm:px-6">
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

      <div
        v-if="showAccessLinks"
        class="mt-5 flex flex-col gap-2 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <p class="text-gray-500">
          Гостям — вход через Telegram или MAX в шапке сайта.
        </p>
        <NuxtLink
          :to="managerLoginTo"
          class="shrink-0 text-gray-600 underline decoration-dotted underline-offset-2 hover:text-gray-900"
        >
          Вход для команды (кабинет города)
        </NuxtLink>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCity } from '~/composables/useCity'
import { useTelegram } from '~/composables/useTelegram'

const { cityBasePath } = useCity()
const { isMessengerMiniApp } = useTelegram()
const route = useRoute()

const managerLoginTo = {
  path: '/dashboard/login',
  query: { redirect: '/dashboard/content-ai' },
}

const showAccessLinks = computed(() => {
  if (isMessengerMiniApp.value) return false
  const path = typeof route.path === 'string' ? route.path : ''
  return !path.startsWith('/dashboard/login')
})
</script>
