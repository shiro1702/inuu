<template>
  <section class="space-y-6">
    <div class="space-y-2">
      <h1 class="text-2xl font-semibold">Дашборд</h1>
      <p class="text-sm text-gray-600">Быстрые действия для запуска работы.</p>
    </div>

    <div v-if="pending" class="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-600">
      Проверяем доступ и данные организации...
    </div>

    <div v-else-if="errorMessage" class="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      {{ errorMessage }}
    </div>

    <div
      v-else-if="!hasOrganization"
      class="rounded-xl border border-dashed border-gray-300 bg-white p-6"
    >
      <h2 class="text-lg font-semibold text-gray-900">Создайте организацию</h2>
      <p class="mt-1 text-sm text-gray-600">
        Укажите название и адрес в URL — после этого откроются разделы дашборда INUU.
      </p>

      <form class="mt-5 max-w-md space-y-4" @submit.prevent="createOrganization">
        <label class="block space-y-1 text-sm">
          <span class="font-medium text-gray-700">Название</span>
          <input
            v-model="orgName"
            type="text"
            required
            class="w-full rounded-lg border border-gray-300 px-3 py-2"
            placeholder="Студия красоты «Лотос»"
          />
        </label>
        <label class="block space-y-1 text-sm">
          <span class="font-medium text-gray-700">Адрес в URL (slug)</span>
          <input
            v-model="orgSlug"
            type="text"
            required
            pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono lowercase"
            placeholder="lotos-beauty"
          />
          <span class="text-xs text-gray-500">Латиница и дефис, например <code class="rounded bg-gray-100 px-1">my-org</code></span>
        </label>
        <label class="block space-y-1 text-sm">
          <span class="font-medium text-gray-700">Тип организации</span>
          <select v-model="orgType" class="w-full rounded-lg border border-gray-300 px-3 py-2">
            <option value="venue_operator">Площадка / оператор</option>
            <option value="beauty_salon">Салон красоты</option>
            <option value="event_organizer">Организатор событий</option>
            <option value="confectioner">Кондитер / кейтеринг</option>
            <option value="advertiser">Рекламодатель</option>
          </select>
        </label>
        <p v-if="createError" class="text-sm text-red-600">{{ createError }}</p>
        <button
          type="submit"
          class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
          :disabled="creating"
        >
          {{ creating ? 'Создание…' : 'Создать' }}
        </button>
      </form>
    </div>

    <template v-else>
      <div class="flex flex-wrap gap-3">
        <NuxtLink
          to="/dashboard/orders"
          class="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm hover:border-gray-300"
        >
          Перейти к заказам
        </NuxtLink>
        <NuxtLink
          to="/dashboard/settings/organization"
          class="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm hover:border-gray-300"
        >
          Настройки организации
        </NuxtLink>
        <NuxtLink
          to="/dashboard/branches"
          class="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm hover:border-gray-300"
        >
          Открыть филиалы
        </NuxtLink>
        <NuxtLink
          to="/dashboard/moderation/city-ugc"
          class="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm hover:border-gray-300"
        >
          Городская модерация UGC
        </NuxtLink>
      </div>

      <div v-if="!hasBranches" class="rounded-xl border border-blue-200 bg-blue-50 p-4">
        <p class="text-sm font-medium text-blue-900">В организации пока нет точек.</p>
        <p class="mt-1 text-sm text-blue-800">Создайте первую точку, чтобы начать принимать записи.</p>
        <NuxtLink
          to="/dashboard/branches/new"
          class="mt-3 inline-flex rounded-lg border border-blue-300 bg-white px-3 py-1.5 text-sm text-blue-900 hover:bg-blue-100"
        >
          Создать точку
        </NuxtLink>
      </div>
    </template>

    <div v-if="hasOrganization && !pending && !errorMessage" class="rounded-xl border border-dashed border-gray-300 bg-white p-4">
      <h2 class="text-sm font-semibold text-gray-900">Скоро на этой странице</h2>
      <p class="mt-1 text-sm text-gray-600">
        KPI и графики дашборда находятся в разработке. Пока используйте разделы «Записи», «Точки» и «Настройки».
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'

declare const definePageMeta: (meta: Record<string, unknown>) => void
definePageMeta({ layout: 'dashboard' })

const { access, hasOrganization, load } = useDashboardAccess()
const pending = ref(true)
const errorMessage = ref<string | null>(null)
const branchCount = ref(0)

const orgName = ref('')
const orgSlug = ref('')
const orgType = ref('venue_operator')
const creating = ref(false)
const createError = ref<string | null>(null)

const hasBranches = computed(() => branchCount.value > 0)

function slugifyName(value: string): string {
  const map: Record<string, string> = {
    а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i',
    й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't',
    у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y',
    ь: '', э: 'e', ю: 'yu', я: 'ya',
  }
  return value
    .trim()
    .toLowerCase()
    .split('')
    .map((ch) => map[ch] ?? ch)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
}

watch(orgName, (name) => {
  if (!orgSlug.value.trim() && name.trim()) {
    orgSlug.value = slugifyName(name)
  }
})

async function loadDashboardData(options?: { force?: boolean }) {
  pending.value = true
  errorMessage.value = null
  try {
    await load(options)
    if (!hasOrganization.value) {
      branchCount.value = 0
      return
    }

    const response = await fetch('/api/dashboard/restaurants?compact=1&pageSize=1')
    if (!response.ok) throw new Error('Не удалось загрузить точки организации')
    const payload = await response.json() as { ok: boolean; items?: unknown[] }
    branchCount.value = Array.isArray(payload.items) ? payload.items.length : 0
  } catch (err: any) {
    errorMessage.value = err?.message || 'Ошибка загрузки дашборда'
  } finally {
    pending.value = false
  }
}

async function createOrganization() {
  createError.value = null
  creating.value = true
  try {
    await $fetch('/api/dashboard/organizations', {
      method: 'POST',
      body: {
        name: orgName.value.trim(),
        slug: orgSlug.value.trim().toLowerCase(),
        orgType: orgType.value,
      },
    })
    await loadDashboardData({ force: true })
  } catch (err: any) {
    createError.value = err?.data?.statusMessage || err?.message || 'Не удалось создать организацию'
  } finally {
    creating.value = false
  }
}

onMounted(() => {
  void loadDashboardData()
})
</script>
