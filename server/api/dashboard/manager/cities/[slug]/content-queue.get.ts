import { defineEventHandler, getQuery } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import { resolveManagerCityScopeOrThrow } from '~/server/utils/managerCityAccess'

export default defineEventHandler(async (event) => {
  const slug = typeof event.context.params?.slug === 'string' ? event.context.params.slug : ''
  const scope = await resolveManagerCityScopeOrThrow(event, slug)
  const query = getQuery(event)
  const status = typeof query.status === 'string' ? query.status.trim() : 'pending'
  const queueKind = typeof query.kind === 'string' ? query.kind.trim() : ''

  const limit = Math.min(Math.max(Number(query.limit) || 50, 1), 200)

  const client = await serverSupabaseServiceRole(event)
  let db = client
    .from('content_submissions')
    .select('id,city_id,kind,status,payload,source_kind,source_url,source_external_id,editorial_score,reject_reason_code,reject_comment,batch_id,batch_role,batch_index,created_at,updated_at')
    .eq('city_id', scope.cityId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (status && status !== 'all') {
    db = db.eq('status', status)
  }
  if (queueKind === 'event_digest') {
    db = db.eq('kind', 'event_digest')
  } else if (queueKind === 'event') {
    db = db.or('kind.eq.event,kind.is.null')
    db = db.or('batch_role.is.null,batch_role.eq.item')
  }

  const { data, error } = await db
  if (error) {
    return {
      ok: false as const,
      city: { id: scope.cityId, slug: scope.citySlug, name: scope.cityName },
      items: [],
      message: error.message || 'Queue is unavailable (content_submissions schema may be missing)',
    }
  }

  return {
    ok: true as const,
    city: { id: scope.cityId, slug: scope.citySlug, name: scope.cityName },
    items: (data ?? []).map((row: any) => ({
      id: String(row.id),
      kind: String(row.kind || 'event'),
      status: String(row.status || 'pending'),
      sourceKind: row.source_kind ? String(row.source_kind) : null,
      sourceUrl: row.source_url ? String(row.source_url) : null,
      sourceExternalId: row.source_external_id ? String(row.source_external_id) : null,
      editorialScore: typeof row.editorial_score === 'number' ? row.editorial_score : null,
      rejectReasonCode: row.reject_reason_code ? String(row.reject_reason_code) : null,
      rejectComment: row.reject_comment ? String(row.reject_comment) : null,
      batchId: row.batch_id ? String(row.batch_id) : null,
      batchRole: row.batch_role ? String(row.batch_role) : null,
      batchIndex: typeof row.batch_index === 'number' ? row.batch_index : null,
      eventsCount: row.batch_role === 'batch' && Array.isArray(row.payload?.events)
        ? row.payload.events.length
        : null,
      payload: row.payload || {},
      createdAt: String(row.created_at || ''),
      updatedAt: String(row.updated_at || ''),
    })),
  }
})
