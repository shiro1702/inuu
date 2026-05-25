<template>
  <NuxtPage v-if="isNotificationSettingsRoute" />
  <section v-else class="space-y-4">
    <h1 class="text-2xl font-semibold">Уведомления</h1>
    <p class="text-sm text-gray-600">
      Настройка омниканальных уведомлений для команды. Интеграции POS и меню в INUU не используются.
    </p>
    <p class="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-700">
      Откройте настройки уведомлений для филиала из раздела
      <NuxtLink to="/dashboard/branches" class="font-medium text-primary underline">Точки</NuxtLink>
      или перейдите по прямой ссылке из списка филиалов.
    </p>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

definePageMeta({ layout: 'dashboard' })

const route = useRoute()
const isNotificationSettingsRoute = computed(() =>
  route.path.includes('/dashboard/integrations/notifications/'),
)
</script>
