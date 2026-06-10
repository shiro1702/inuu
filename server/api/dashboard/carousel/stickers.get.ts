import { createError, defineEventHandler, getQuery } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import { requireDashboardAccess } from '~/server/utils/dashboard'

export default defineEventHandler(async (event) => {
  await requireDashboardAccess(event)
  const q = getQuery(event)
  const category = typeof q.category === 'string' ? q.category.trim() : ''

  const client = await serverSupabaseServiceRole(event)
  let query = client.from('stickers').select('*').order('sort_order', { ascending: true })
  if (category) query = query.eq('category', category)

  const { data, error } = await query
  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return { ok: true as const, items: data || [] }
})
