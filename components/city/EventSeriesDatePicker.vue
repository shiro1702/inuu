<template>
  <section v-if="sessions.length > 1" class="rounded-2xl border border-indigo-200 bg-indigo-50/60 p-4">
    <h2 class="text-sm font-semibold text-indigo-950">Выберите дату</h2>
    <p class="mt-1 text-xs text-indigo-800/80">{{ sessions.length }} {{ datesLabel }}</p>
    <div class="mt-3 flex flex-wrap gap-2">
      <NuxtLink
        v-for="session in sessions"
        :key="session.slug"
        :to="`${cityBasePath}/events/${session.slug}`"
        class="inline-flex min-w-[7.5rem] flex-col rounded-xl border px-3 py-2 text-left text-sm transition"
        :class="session.isCurrent
          ? 'border-primary bg-primary text-white shadow-sm'
          : 'border-indigo-200 bg-white text-indigo-950 hover:border-primary/40 hover:bg-white'"
      >
        <span class="font-semibold leading-tight">{{ sessionDay(session.starts_at) }}</span>
        <span
          class="text-xs leading-tight"
          :class="session.isCurrent ? 'text-white/90' : 'text-indigo-700'"
        >
          {{ sessionTime(session.starts_at) }}
        </span>
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
export type SeriesSession = {
  slug: string
  starts_at: string
  isCurrent: boolean
}

const props = defineProps<{
  sessions: SeriesSession[]
}>()

const { cityBasePath } = useCity()

const datesLabel = computed(() => {
  const n = props.sessions.length
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return 'показ'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'показа'
  return 'показов'
})

function sessionDay(value: string) {
  try {
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'short',
      weekday: 'short',
    }).format(new Date(value))
  } catch {
    return ''
  }
}

function sessionTime(value: string) {
  try {
    return new Intl.DateTimeFormat('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(value))
  } catch {
    return ''
  }
}
</script>
