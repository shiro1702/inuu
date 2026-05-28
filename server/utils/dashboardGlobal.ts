import { createError, type H3Event } from 'h3'
import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'

function readPlatformRoleFromUser(rawUser: any): string {
  const metaRole = typeof rawUser?.user_metadata?.platform_role === 'string'
    ? rawUser.user_metadata.platform_role
    : typeof rawUser?.app_metadata?.platform_role === 'string'
      ? rawUser.app_metadata.platform_role
      : ''
  return metaRole.trim().toLowerCase()
}

function isPlatformAdminRole(role: string): boolean {
  return role === 'platform_admin' || role === 'super_admin'
}

async function readProfilePlatformRole(event: H3Event, userId: string): Promise<string> {
  const client = await serverSupabaseServiceRole(event)
  const { data } = await client
    .from('profiles')
    .select('metadata')
    .eq('id', userId)
    .maybeSingle()

  const role = typeof (data as any)?.metadata?.platform_role === 'string'
    ? String((data as any).metadata.platform_role).trim().toLowerCase()
    : ''
  return role
}

export async function resolvePlatformAdminAccess(event: H3Event): Promise<{ userId: string; role: string } | null> {
  const supabaseUser = await serverSupabaseUser(event)
  if (!supabaseUser) return null

  const raw = supabaseUser as any
  const userId = typeof raw.id === 'string'
    ? raw.id
    : typeof raw.sub === 'string'
      ? raw.sub
      : null
  if (!userId) return null

  const userRole = readPlatformRoleFromUser(raw)
  if (isPlatformAdminRole(userRole)) {
    return { userId, role: userRole }
  }

  const profileRole = await readProfilePlatformRole(event, userId)
  if (isPlatformAdminRole(profileRole)) {
    return { userId, role: profileRole }
  }

  return null
}

export async function requirePlatformAdminAccess(event: H3Event): Promise<{ userId: string; role: string }> {
  const access = await resolvePlatformAdminAccess(event)
  if (!access) {
    throw createError({ statusCode: 403, statusMessage: 'Platform admin access required' })
  }
  return access
}
