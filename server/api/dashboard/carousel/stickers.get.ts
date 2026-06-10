import { createError, defineEventHandler, getQuery } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import { mergeStickerLibrary } from '~/server/utils/carouselStickerCatalog'
import { requireDashboardAccess } from '~/server/utils/dashboard'

export default defineEventHandler(async (event) => {
  await requireDashboardAccess(event)
  const q = getQuery(event)
  const category = typeof q.category === 'string' ? q.category.trim() : ''

  const client = await serverSupabaseServiceRole(event)
  const { data, error } = await client
    .from('stickers')
    .select('*')
    .order('sort_order', { ascending: true })
    .limit(500)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  let items = mergeStickerLibrary(data || [])
  if (category) {
    items = items.filter((item) => item.category === category)
  }

  return { ok: true as const, items }
})
