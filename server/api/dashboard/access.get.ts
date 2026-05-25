import { createError, defineEventHandler } from 'h3'
import { serverSupabaseUser } from '#supabase/server'
import { resolveDashboardAccess } from '~/server/utils/dashboard'

export default defineEventHandler(async (event) => {
  const supabaseUser = await serverSupabaseUser(event)
  if (!supabaseUser) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const raw = supabaseUser as { id?: string; sub?: string }
  const userId = typeof raw.id === 'string'
    ? raw.id
    : typeof raw.sub === 'string'
      ? raw.sub
      : null
  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const access = await resolveDashboardAccess(event)
  if (!access) {
    return {
      ok: false,
      userId,
      shopId: null,
      role: null,
    }
  }

  return {
    ok: true,
    userId: access.userId,
    shopId: access.shopId,
    role: access.role,
  }
})
