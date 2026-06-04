<template>
  <div class="mx-auto max-w-sm">
    <h1 class="text-lg font-semibold text-gray-900">
      Кабинет управления городом
    </h1>
    <p class="mt-1 text-sm text-gray-600">
      Вход по email и паролю для редакторов и менеджеров контента. Это не гостевой профиль на афише —
      после входа откроется раздел «Контент AI» и другие инструменты дашборда.
    </p>

    <form class="mt-6 flex flex-col gap-3" @submit.prevent="onSubmit">
      <label class="flex flex-col gap-1 text-sm text-gray-700">
        <span>Email</span>
        <input
          v-model="email"
          type="email"
          required
          autocomplete="email"
          class="rounded-lg border border-gray-300 px-3 py-2"
        >
      </label>

      <label class="flex flex-col gap-1 text-sm text-gray-700">
        <span>Пароль</span>
        <input
          v-model="password"
          type="password"
          required
          autocomplete="current-password"
          class="rounded-lg border border-gray-300 px-3 py-2"
        >
      </label>

      <p v-if="errorMessage" class="text-sm text-red-600">
        {{ errorMessage }}
      </p>

      <button
        type="submit"
        class="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
        :disabled="isLoading"
      >
        <span v-if="isLoading">Вход…</span>
        <span v-else>Войти в кабинет</span>
      </button>
    </form>

    <NuxtLink
      :to="cityBasePath"
      class="mt-6 inline-block text-sm text-gray-500 hover:text-gray-800"
    >
      ← На афишу города
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

declare const useRuntimeConfig: () => { public: { defaultCitySlug?: string } }
import { useRoute, useRouter } from 'vue-router'

definePageMeta({ layout: 'dashboard-auth' })

const route = useRoute()
const router = useRouter()
const supabase = useSupabaseClient()
const config = useRuntimeConfig()
const cityBasePath = computed(() => {
  const slug =
    typeof config.public.defaultCitySlug === 'string' && config.public.defaultCitySlug.trim()
      ? config.public.defaultCitySlug.trim()
      : 'ulan-ude'
  return `/${slug}`
})

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMessage = ref<string | null>(null)

const redirectPath = computed(() => {
  const value = route.query.redirect
  if (typeof value === 'string' && value.startsWith('/dashboard')) return value
  return '/dashboard/content-ai'
})

async function goAfterAuth() {
  await router.replace({ path: redirectPath.value })
}

onMounted(async () => {
  const { data } = await supabase.auth.getSession()
  if (data.session) {
    await goAfterAuth()
  }
})

async function onSubmit() {
  isLoading.value = true
  errorMessage.value = null

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value.trim(),
      password: password.value,
    })

    if (error) {
      errorMessage.value = error.message || 'Не удалось войти. Проверьте данные.'
      return
    }

    await goAfterAuth()
  } catch (error: unknown) {
    errorMessage.value = error instanceof Error ? error.message : 'Не удалось войти. Попробуйте ещё раз.'
  } finally {
    isLoading.value = false
  }
}
</script>
