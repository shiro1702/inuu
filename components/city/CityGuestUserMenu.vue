<template>
  <div ref="menuRootRef" class="relative z-50">
    <button
      type="button"
      class="flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
      :aria-expanded="showMenu"
      aria-label="Меню профиля"
      @click="showMenu = !showMenu"
    >
      <span>Профиль</span>
      <svg class="h-3 w-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <Transition name="dropdown">
      <div
        v-if="showMenu"
        class="absolute right-0 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-1 text-sm shadow-lg"
      >
        <NuxtLink
          to="/profile"
          class="block px-3 py-2 text-gray-700 hover:bg-gray-50"
          @click="showMenu = false"
        >
          Мой профиль
        </NuxtLink>
        <NuxtLink
          :to="subscriptionsPath"
          class="block px-3 py-2 text-gray-700 hover:bg-gray-50"
          @click="showMenu = false"
        >
          Подписки
        </NuxtLink>
        <button
          type="button"
          class="block w-full px-3 py-2 text-left text-red-600 hover:bg-red-50 disabled:opacity-50"
          :disabled="isSigningOut"
          @click="onLogout"
        >
          {{ isSigningOut ? 'Выход…' : 'Выйти' }}
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps<{
  subscriptionsPath: string
  logoutRedirectPath: string
}>()

const showMenu = ref(false)
const menuRootRef = ref<HTMLElement | null>(null)
const { signOutAndRedirect, isSigningOut } = useAuthSignOut()

function onDocumentClick(e: MouseEvent) {
  const target = e.target as Node | null
  if (!target || !showMenu.value) return
  const root = menuRootRef.value
  if (root && !root.contains(target)) showMenu.value = false
}

onMounted(() => {
  if (typeof document === 'undefined') return
  document.addEventListener('click', onDocumentClick, true)
})

onBeforeUnmount(() => {
  if (typeof document === 'undefined') return
  document.removeEventListener('click', onDocumentClick, true)
})

async function onLogout() {
  showMenu.value = false
  try {
    await signOutAndRedirect(props.logoutRedirectPath)
  } catch (e) {
    console.error('City guest logout error:', e)
    if (process.client) {
      window.alert('Не удалось выйти. Попробуйте ещё раз.')
    }
  }
}
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.12s ease, transform 0.12s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
