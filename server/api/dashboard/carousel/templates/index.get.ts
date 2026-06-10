import { defineEventHandler, getQuery } from 'h3'
import { createError } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import { requireDashboardAccess } from '~/server/utils/dashboard'

export default defineEventHandler(async (event) => {
  const access = await requireDashboardAccess(event)
  const q = getQuery(event)
  const cityId = typeof q.city_id === 'string' ? q.city_id.trim() : ''

  const client = await serverSupabaseServiceRole(event)
  let query = client
    .from('user_templates')
    .select('*')
    .eq('user_id', access.userId)
    .order('created_at', { ascending: false })

  if (cityId) query = query.eq('city_id', cityId)

  const { data, error } = await query
  if (error) throw createError({ statusCode: 500, statusMessage: error.message })

  return { ok: true as const, items: data || [] }
})
