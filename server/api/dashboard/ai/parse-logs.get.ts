import { defineEventHandler, getQuery } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import { requireDashboardAccess } from '~/server/utils/dashboard'

export default defineEventHandler(async (event) => {
  await requireDashboardAccess(event)
  const query = getQuery(event)

  const status = typeof query.status === 'string' ? query.status.trim() : ''
  const sourceKind = typeof query.source_kind === 'string' ? query.source_kind.trim() : ''
  const citySlug = typeof query.city_slug === 'string' ? query.city_slug.trim() : ''
  const dateFrom = typeof query.date_from === 'string' ? query.date_from.trim() : ''
  const dateTo = typeof query.date_to === 'string' ? query.date_to.trim() : ''
  const page = Math.max(Number(query.page) || 1, 1)
  const pageSize = Math.min(Math.max(Number(query.pageSize) || 25, 1), 100)
  const from = (page - 1) * pageSize
  const to = from + pageSize

  const client = await serverSupabaseServiceRole(event)
  let db = client
    .from('ai_parse_logs')
    .select('id,created_at,source_kind,source_url,source_external_id,city_slug,model,status,latency_ms,prompt_tokens,completion_tokens,total_tokens,confidence,missing_fields_count,parse_attempts,error_message,payload')
    .order('created_at', { ascending: false })
    .range(from, to)

  if (status) db = db.eq('status', status)
  if (sourceKind) db = db.eq('source_kind', sourceKind)
  if (citySlug) db = db.eq('city_slug', citySlug)
  if (dateFrom) db = db.gte('created_at', dateFrom)
  if (dateTo) db = db.lte('created_at', dateTo)

  const { data, error } = await db
  if (error) {
    console.error('[dashboard/ai/parse-logs] load failed:', error)
    return {
      ok: false as const,
      items: [],
      pagination: {
        page,
        pageSize,
        hasNext: false,
        hasPrev: page > 1,
      },
    }
  }

  const rows = data ?? []
  return {
    ok: true as const,
    items: rows.slice(0, pageSize),
    pagination: {
      page,
      pageSize,
      hasNext: rows.length > pageSize,
      hasPrev: page > 1,
    },
  }
})
