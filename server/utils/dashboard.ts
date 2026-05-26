import { createError } from 'h3'
import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'

export type DashboardAccess = {
  userId: string
  shopId: string
  role: 'owner' | 'manager'
}

type CachedDashboardAccess = {
  value: DashboardAccess
  expiresAt: number
}

const DASHBOARD_ACCESS_TTL_MS = 15_000
const dashboardAccessCache = new Map<string, CachedDashboardAccess>()

function normalizeRole(input: unknown): 'owner' | 'manager' {
  if (typeof input !== 'string') return 'owner'
  const value = input.trim().toLowerCase()
  if (value === 'manager' || value === 'staff' || value === 'editor') return 'manager'
  return 'owner'
}

function isIgnorableProfilesSchemaError(message: string | undefined): boolean {
  if (!message) return false
  return /column/i.test(message) && /(shop_id|role)/i.test(message)
}

export function invalidateDashboardAccessCache(userId: string) {
  dashboardAccessCache.delete(userId)
}

async function resolveUserId(event: any): Promise<string> {
  const supabaseUser = await serverSupabaseUser(event)
  if (!supabaseUser) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const raw = supabaseUser as any
  const userId = typeof raw.id === 'string'
    ? raw.id
    : typeof raw.sub === 'string'
      ? raw.sub
      : null
  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
  return userId
}

export async function resolveDashboardAccess(event: any): Promise<DashboardAccess | null> {
  const userId = await resolveUserId(event)

  const now = Date.now()
  const cached = dashboardAccessCache.get(userId)
  if (cached && cached.expiresAt > now) {
    return cached.value
  }

  const client = await serverSupabaseServiceRole(event)
  const raw = await serverSupabaseUser(event) as any
  let shopId: string | null = null
  let role: 'owner' | 'manager' = 'owner'

  const memberAccess = await client
    .from('shop_members')
    .select('shop_id,role')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()

  if (memberAccess.error && !/relation .*shop_members.* does not exist/i.test(memberAccess.error.message)) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to read shop membership' })
  }

  if (memberAccess.data?.shop_id) {
    shopId = memberAccess.data.shop_id as string
    role = normalizeRole((memberAccess.data as any).role)
  }

  if (!shopId) {
    const metadataShopId = typeof raw.user_metadata?.active_shop_id === 'string'
      ? raw.user_metadata.active_shop_id.trim()
      : ''
    if (metadataShopId) {
      shopId = metadataShopId
      role = normalizeRole(raw.user_metadata?.admin_role)
    }
  }

  if (!shopId) {
    const { data: profileData, error: profileError } = await client
      .from('profiles')
      .select('shop_id,role')
      .eq('id', userId)
      .maybeSingle()

    if (profileError) {
      if (!isIgnorableProfilesSchemaError(profileError.message)) {
        throw createError({ statusCode: 500, statusMessage: 'Failed to read profile' })
      }
    } else if (profileData?.shop_id) {
      shopId = profileData.shop_id as string
      role = normalizeRole((profileData as any).role)
    }
  }

  if (!shopId) {
    return null
  }

  const value: DashboardAccess = { userId, shopId, role }
  dashboardAccessCache.set(userId, {
    value,
    expiresAt: now + DASHBOARD_ACCESS_TTL_MS,
  })
  return value
}

export async function requireDashboardAccess(event: any): Promise<DashboardAccess> {
  const access = await resolveDashboardAccess(event)
  if (!access) {
    throw createError({ statusCode: 403, statusMessage: 'No organization access' })
  }
  return access
}
