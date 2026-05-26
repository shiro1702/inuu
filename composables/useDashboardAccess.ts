type DashboardRole = 'owner' | 'manager'

export type DashboardAccessResponse = {
  ok: boolean
  userId: string
  shopId: string | null
  role: DashboardRole | null
}

type DashboardPermission =
  | 'orders.view'
  | 'orders.status.change'
  | 'orders.kanban.move'
  | 'menu.manage'
  | 'marketing.manage'
  | 'branches.view'
  | 'branches.create'
  | 'branches.archive'
  | 'team.manage'
  | 'settings.org.edit'
  | 'integrations.manage'

const ownerPermissions: DashboardPermission[] = [
  'orders.view',
  'orders.status.change',
  'orders.kanban.move',
  'menu.manage',
  'marketing.manage',
  'branches.view',
  'branches.create',
  'branches.archive',
  'team.manage',
  'settings.org.edit',
  'integrations.manage',
]

const managerPermissions: DashboardPermission[] = [
  'orders.view',
  'orders.status.change',
  'menu.manage',
  'marketing.manage',
  'branches.view',
  'branches.create',
]

let loadPromise: Promise<DashboardAccessResponse> | null = null

export async function fetchDashboardAccess(): Promise<DashboardAccessResponse> {
  return $fetch<DashboardAccessResponse>('/api/dashboard/access')
}

export function useDashboardAccess() {
  const state = useState<DashboardAccessResponse | null>('dashboard-access-state', () => null)
  const loading = useState<boolean>('dashboard-access-loading', () => false)
  const error = useState<string | null>('dashboard-access-error', () => null)

  const hasOrganization = computed(() => Boolean(state.value?.ok && state.value.shopId))

  const role = computed<DashboardRole>(() => state.value?.role ?? 'manager')

  const permissions = computed<Set<DashboardPermission>>(() => {
    if (!hasOrganization.value) return new Set<DashboardPermission>()
    const list = role.value === 'owner' ? ownerPermissions : managerPermissions
    return new Set<DashboardPermission>(list)
  })

  const can = (permission: DashboardPermission) => permissions.value.has(permission)

  const load = async (options?: { force?: boolean }) => {
    if (!options?.force && state.value) {
      return state.value
    }

    if (!options?.force && loadPromise) {
      return loadPromise
    }

    loading.value = true
    error.value = null

    const run = async () => {
      try {
        const access = await fetchDashboardAccess()
        state.value = access
        return access
      } catch (err: any) {
        state.value = null
        error.value = err?.data?.statusMessage || err?.message || 'Failed to load dashboard access'
        throw err
      } finally {
        loading.value = false
        loadPromise = null
      }
    }

    loadPromise = run()
    return loadPromise
  }

  const reset = () => {
    state.value = null
    loadPromise = null
    error.value = null
  }

  return {
    access: state,
    hasOrganization,
    role,
    loading,
    error,
    can,
    load,
    reset,
  }
}
