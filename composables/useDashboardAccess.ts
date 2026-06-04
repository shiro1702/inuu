import { ref, watch } from 'vue'

type DashboardAccessResponse = {
  ok: boolean
  role?: string | null
}

/** Есть ли у текущего Supabase-пользователя доступ в /dashboard (shop_members). */
export function useDashboardAccess() {
  const user = useSupabaseUser()
  const hasDashboardAccess = ref(false)
  const dashboardAccessChecked = ref(false)

  async function refreshDashboardAccess() {
    dashboardAccessChecked.value = false
    if (!user.value) {
      hasDashboardAccess.value = false
      dashboardAccessChecked.value = true
      return
    }
    try {
      const { authHeaders } = useDashboardFetch()
      const headers = await authHeaders()
      const res = await $fetch<DashboardAccessResponse>('/api/dashboard/access', {
        credentials: 'include',
        headers,
      })
      hasDashboardAccess.value = !!res?.ok
    } catch {
      hasDashboardAccess.value = false
    } finally {
      dashboardAccessChecked.value = true
    }
  }

  watch(user, () => {
    void refreshDashboardAccess()
  }, { immediate: true })

  return {
    hasDashboardAccess,
    dashboardAccessChecked,
    refreshDashboardAccess,
  }
}
