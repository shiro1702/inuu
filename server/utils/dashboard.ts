import { createError, getHeader, type H3Event } from 'h3'
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

function userIdFromJwtPayload(raw: { id?: string; sub?: string } | null): string | null {
  if (!raw) return null
  if (typeof raw.id === 'string' && raw.id) return raw.id
  if (typeof raw.sub === 'string' && raw.sub) return raw.sub
  return null
}

async function resolveUserIdFromBearer(event: H3Event): Promise<string | null> {
  const authHeader = getHeader(event, 'authorization')
  const token = typeof authHeader === 'string' && authHeader.startsWith('Bearer ')
    ? authHeader.slice(7).trim()
    : ''
  if (!token) return null

  const client = await serverSupabaseServiceRole(event)
  const { data, error } = await client.auth.getUser(token)
  if (error || !data.user?.id) return null
  return data.user.id
}

async function resolveUserMetadata(event: H3Event, userId: string): Promise<Record<string, unknown>> {
  const client = await serverSupabaseServiceRole(event)
  const { data, error } = await client.auth.admin.getUserById(userId)
  if (error || !data.user) return {}
  return (data.user.user_metadata && typeof data.user.user_metadata === 'object')
    ? data.user.user_metadata as Record<string, unknown>
    : {}
}

/** Resolves Supabase user id from SSR cookies or Authorization: Bearer. */
export async function resolveDashboardUserId(event: H3Event): Promise<string | null> {
  const cached = (event.context as { _dashboardUserId?: string })._dashboardUserId
  if (cached) return cached

  let userId: string | null = null
  try {
    const supabaseUser = await serverSupabaseUser(event)
    userId = userIdFromJwtPayload(supabaseUser as { id?: string; sub?: string } | null)
  } catch {
    // Stale cookie / getClaims failure — try Bearer below
  }

  if (!userId) {
    userId = await resolveUserIdFromBearer(event)
  }

  if (userId) {
    (event.context as { _dashboardUserId?: string })._dashboardUserId = userId
  }
  return userId
}

async function resolveUserId(event: H3Event): Promise<string> {
  const userId = await resolveDashboardUserId(event)
  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
  return userId
}

export async function resolveDashboardAccess(event: H3Event): Promise<DashboardAccess | null> {
  const userId = await resolveUserId(event)

  const now = Date.now()
  const cached = dashboardAccessCache.get(userId)
  if (cached && cached.expiresAt > now) {
    return cached.value
  }

  const client = await serverSupabaseServiceRole(event)
  const userMetadata = await resolveUserMetadata(event, userId)
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
    const metadataShopId = typeof userMetadata.active_shop_id === 'string'
      ? userMetadata.active_shop_id.trim()
      : ''
    if (metadataShopId) {
      shopId = metadataShopId
      role = normalizeRole(userMetadata.admin_role)
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

export async function requireDashboardAccess(event: H3Event): Promise<DashboardAccess> {
  const access = await resolveDashboardAccess(event)
  if (!access) {
    throw createError({ statusCode: 403, statusMessage: 'No organization access' })
  }
  return access
}
