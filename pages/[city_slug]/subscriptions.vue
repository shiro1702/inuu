<template>
  <div>
    <NuxtLink :to="`${cityBasePath}/events`" class="text-sm text-primary hover:underline">← Афиша</NuxtLink>
    <h1 class="mt-2 text-2xl font-bold text-gray-900">Мои подписки</h1>
    <p class="mt-2 text-sm text-gray-600">
      Уведомления о событиях и подборках в {{ displayName }}.
    </p>

    <div v-if="!isAuthenticated" class="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
      <p>Войдите через Telegram или MAX, чтобы управлять подписками.</p>
      <button
        v-if="!isMessengerMiniApp"
        type="button"
        class="mt-3 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
        @click="openGuestAuthModal"
      >
        Войти через бот
      </button>
    </div>

    <div v-else-if="pending" class="mt-8 text-sm text-gray-500">Загрузка…</div>

    <div v-else class="mt-8 space-y-8">
      <section v-if="!settings?.messengerLinked" class="rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-sm text-indigo-900">
        <p>
          Чтобы получать push в Telegram, откройте INUU в боте или привяжите Telegram в
          <NuxtLink to="/profile" class="font-medium underline">профиле</NuxtLink>.
        </p>
        <p class="mt-2 text-xs text-indigo-700">
          Команда в боте: <code>/subscribe</code>
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold text-gray-900">Темы</h2>
        <p class="mt-1 text-sm text-gray-500">О чём присылать уведомления в бот.</p>
        <div class="mt-4 flex flex-col gap-2">
          <label
            v-for="topic in topicOptions"
            :key="topic.slug"
            class="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3"
          >
            <input
              v-model="selectedTopics"
              type="checkbox"
              class="h-4 w-4 rounded border-gray-300 text-primary"
              :value="topic.slug"
              :disabled="!settings?.messengerLinked"
            >
            <span>{{ topic.emoji }} {{ topic.label }}</span>
          </label>
        </div>
      </section>

      <section>
        <h2 class="text-lg font-semibold text-gray-900">Теги интересов</h2>
        <p class="mt-1 text-sm text-gray-500">Фильтр «или» — событие подходит, если есть хотя бы один тег.</p>
        <div class="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            class="rounded-full px-3 py-1.5 text-sm font-medium transition"
            :class="!selectedTags.length
              ? 'bg-indigo-100 text-indigo-800 ring-1 ring-indigo-200'
              : 'border border-gray-200 bg-white text-gray-700'"
            @click="selectedTags = []"
          >
            Все
          </button>
          <button
            v-for="tag in settings?.availableTags || []"
            :key="tag.slug"
            type="button"
            class="inline-flex items-center gap-1.5 rounded-full py-1.5 pl-3 pr-2 text-sm font-medium transition"
            :class="selectedTags.includes(tag.slug)
              ? 'bg-indigo-100 text-indigo-800 ring-1 ring-indigo-200'
              : 'border border-gray-200 bg-white text-gray-700 hover:border-indigo-200'"
            @click="toggleTag(tag.slug)"
          >
            <span>#{{ tag.name }}</span>
            <span
              class="inline-flex h-4 w-4 items-center justify-center text-base leading-none transition-transform duration-150"
              :class="selectedTags.includes(tag.slug) ? 'rotate-45' : ''"
              aria-hidden="true"
            >+</span>
          </button>
        </div>
      </section>

      <section>
        <label class="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3">
          <input
            v-model="marketingOptOut"
            type="checkbox"
            class="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary"
          >
          <span>
            <span class="font-medium text-gray-900">Только записи и билеты</span>
            <span class="mt-1 block text-sm text-gray-500">Отключить маркетинговые рассылки (афиша, подборки, новости).</span>
          </span>
        </label>
      </section>

      <div class="flex flex-wrap items-center gap-3">
        <button
          type="button"
          class="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60"
          :disabled="saving"
          @click="save"
        >
          {{ saving ? 'Сохраняем…' : 'Сохранить' }}
        </button>
        <NuxtLink :to="`${cityBasePath}/events`" class="text-sm text-primary hover:underline">
          К афише
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'city' })

type TopicSlug = 'digest' | 'events' | 'news'
type SettingsPayload = {
  interestTags: string[]
  topics: TopicSlug[]
  marketingOptOut: boolean
  messengerLinked: boolean
  availableTags: Array<{ slug: string; name: string }>
  topicOptions?: Array<{ slug: TopicSlug; label: string; emoji: string }>
}

const user = useSupabaseUser()
const { slug, displayName, cityBasePath } = useCity()
const { buildMessengerAuthHeaders, isMessengerMiniApp, messengerInitData } = useTelegram()
const { openGuestAuthModal } = useCityGuestAuth()
const { pushToast } = useAppToast()

const pending = ref(true)
const saving = ref(false)
const settings = ref<SettingsPayload | null>(null)
const selectedTags = ref<string[]>([])
const selectedTopics = ref<TopicSlug[]>([])
const marketingOptOut = ref(false)

const isAuthenticated = computed(
  () => !!user.value || !!messengerInitData.value || isMessengerMiniApp.value,
)

const topicOptions = computed(() =>
  settings.value?.topicOptions || [
    { slug: 'digest' as const, label: 'Главное по городу', emoji: '📬' },
    { slug: 'events' as const, label: 'Афиша', emoji: '🎭' },
    { slug: 'news' as const, label: 'Новости', emoji: '📰' },
  ],
)

function toggleTag(tagSlug: string) {
  const set = new Set(selectedTags.value)
  if (set.has(tagSlug)) set.delete(tagSlug)
  else set.add(tagSlug)
  selectedTags.value = [...set]
}

async function loadSettings() {
  if (!isAuthenticated.value) {
    pending.value = false
    return
  }
  pending.value = true
  try {
    const res = await $fetch<SettingsPayload & { ok: boolean }>(
      `/api/cities/${slug.value}/subscriptions`,
      { headers: buildMessengerAuthHeaders() },
    )
    settings.value = res
    selectedTags.value = [...(res.interestTags || [])]
    selectedTopics.value = [...(res.topics || [])]
    marketingOptOut.value = !!res.marketingOptOut
  } catch {
    pushToast('Не удалось загрузить подписки', 'error')
  } finally {
    pending.value = false
  }
}

async function save() {
  if (!isAuthenticated.value) {
    openGuestAuthModal()
    return
  }
  saving.value = true
  try {
    const res = await $fetch<{ ok: boolean; message?: string } & SettingsPayload>(
      `/api/cities/${slug.value}/subscriptions`,
      {
        method: 'PUT',
        body: {
          interestTags: selectedTags.value,
          topics: selectedTopics.value,
          marketingOptOut: marketingOptOut.value,
        },
        headers: buildMessengerAuthHeaders(),
      },
    )
    settings.value = res
    pushToast(res.message || 'Настройки сохранены', 'ok')
  } catch (e: unknown) {
    const err = e as { data?: { statusMessage?: string }; statusMessage?: string }
    pushToast(err?.data?.statusMessage || err?.statusMessage || 'Не удалось сохранить', 'error')
  } finally {
    saving.value = false
  }
}

watch([slug, isAuthenticated], () => {
  void loadSettings()
}, { immediate: true })

useHead({ title: () => `Подписки — ${displayName.value}` })
</script>
