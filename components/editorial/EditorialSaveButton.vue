<template>
  <button
    type="button"
    class="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition"
    :class="saved
      ? 'border-primary bg-primary/5 text-primary'
      : 'border-gray-200 bg-white text-gray-700 hover:border-primary/30'"
    :disabled="loading"
    @click="toggleSave"
  >
    <span>{{ saved ? '🔖 Сохранено' : '🔖 Читать потом' }}</span>
  </button>
</template>

<script setup lang="ts">
import { useSupabaseUser } from '#imports'

const props = defineProps<{
  postId: string
  initialSaved?: boolean
}>()

const emit = defineEmits<{ savedChange: [boolean] }>()

const user = useSupabaseUser()
const saved = ref(props.initialSaved === true)
const loading = ref(false)

watch(() => props.initialSaved, (v) => {
  saved.value = v === true
})

async function toggleSave() {
  if (!user.value) {
    await navigateTo('/login')
    return
  }
  loading.value = true
  try {
    const action = saved.value ? 'unsave' : 'save'
    const res = await $fetch<{ ok: boolean; saved?: boolean }>('/api/me/saved-editorial', {
      method: 'POST',
      body: { postId: props.postId, action },
    })
    saved.value = res.saved === true
    emit('savedChange', saved.value)
  } catch {
    // ignore
  } finally {
    loading.value = false
  }
}
</script>
