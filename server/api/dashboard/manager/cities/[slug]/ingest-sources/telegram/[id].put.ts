import { createError, defineEventHandler, readBody } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import {
  assertShopInCity,
  getTelegramSourceById,
  mapTelegramSourceRow,
  normalizeTelegramSourceKey,
} from '~/server/utils/ingestSourcesDashboard'
import { resolveManagerCityScopeOrThrow } from '~/server/utils/managerCityAccess'
import { INGEST_CONTEXT_TYPES } from '~/server/utils/ingestSourcesDashboardShared'

type Body = {
  sourceKey?: string
  sourceType?: 'channel' | 'group'
  contextType?: string
  organizationId?: string | null
  isActive?: boolean
  ingestMode?: 'realtime' | 'batch'
  notes?: string | null
}

const TG_SOURCE_SELECT = `
  id,source_key,source_type,context_type,organization_id,is_active,ingest_mode,notes,created_at,updated_at,
  shops:organization_id(id,slug,name,ui_settings)
`

function normalizeContextType(value: unknown): string {
  const raw = String(value || 'general').trim().toLowerCase()
  return (INGEST_CONTEXT_TYPES as readonly string[]).includes(raw) ? raw : 'general'
}

export default defineEventHandler(async (event) => {
  const slug = typeof event.context.params?.slug === 'string' ? event.context.params.slug : ''
  const sourceId = typeof event.context.params?.id === 'string' ? event.context.params.id : ''
  const scope = await resolveManagerCityScopeOrThrow(event, slug)
  await getTelegramSourceById({ event, cityId: scope.cityId, id: sourceId })

  const body = await readBody<Body>(event).catch(() => ({}))
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() }

  if (body.sourceKey !== undefined) patch.source_key = normalizeTelegramSourceKey(String(body.sourceKey))
  if (body.sourceType !== undefined) patch.source_type = body.sourceType === 'group' ? 'group' : 'channel'
  if (body.contextType !== undefined) patch.context_type = normalizeContextType(body.contextType)
  if (body.organizationId !== undefined) {
    patch.organization_id = await assertShopInCity({
      event,
      cityId: scope.cityId,
      organizationId: body.organizationId,
    })
  }
  if (body.isActive !== undefined) patch.is_active = body.isActive !== false
  if (body.ingestMode !== undefined) patch.ingest_mode = body.ingestMode === 'batch' ? 'batch' : 'realtime'
  if (body.notes !== undefined) {
    patch.notes = body.notes ? String(body.notes).trim().slice(0, 500) : null
  }

  const client = await serverSupabaseServiceRole(event)
  const { data, error } = await client
    .from('city_telegram_sources')
    .update(patch as any)
    .eq('city_id', scope.cityId)
    .eq('id', sourceId)
    .select(TG_SOURCE_SELECT)
    .maybeSingle()

  if (error) {
    if (/duplicate|unique/i.test(error.message)) {
      throw createError({ statusCode: 409, statusMessage: 'Telegram source key already exists for this city' })
    }
    throw createError({ statusCode: 500, statusMessage: error.message })
  }
  if (!data?.id) {
    throw createError({ statusCode: 404, statusMessage: 'Telegram source not found' })
  }

  return { ok: true as const, item: mapTelegramSourceRow(data) }
})
