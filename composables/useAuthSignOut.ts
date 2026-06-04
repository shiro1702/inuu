import { ref } from 'vue'

/**
 * Завершает Supabase-сессию и уходит на redirectPath.
 * На клиенте — полная перезагрузка, чтобы сбросить cookies и middleware dashboard-auth.
 */
export function useAuthSignOut() {
  const supabase = useSupabaseClient()
  const isSigningOut = ref(false)

  async function signOutAndRedirect(redirectPath: string): Promise<void> {
    if (isSigningOut.value) return
    isSigningOut.value = true
    try {
      const { error } = await supabase.auth.signOut({ scope: 'global' })
      if (error) throw error
    } catch (err) {
      isSigningOut.value = false
      throw err
    }
    if (process.client) {
      window.location.assign(redirectPath)
      return
    }
    await navigateTo(redirectPath, { replace: true })
  }

  return { signOutAndRedirect, isSigningOut }
}
