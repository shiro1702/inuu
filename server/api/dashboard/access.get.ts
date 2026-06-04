import { createError, defineEventHandler } from 'h3'
import { resolveDashboardAccess, resolveDashboardUserId } from '~/server/utils/dashboard'

export default defineEventHandler(async (event) => {
  const userId = await resolveDashboardUserId(event)
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
