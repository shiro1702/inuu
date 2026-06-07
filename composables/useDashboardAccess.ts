import { ref, watch } from 'vue'

export type DashboardAccessResponse = {
  ok: boolean
  userId?: string
  shopId?: string | null
  role?: string | null
}

/** Одноразовая проверка доступа (логин, редирект после auth). */
export async function fetchDashboardAccess(): Promise<DashboardAccessResponse> {
  const { authHeaders } = useDashboardFetch()
  const headers = await authHeaders()
  return $fetch<DashboardAccessResponse>('/api/dashboard/access', {
    credentials: 'include',
    headers,
  })
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
