import { createError, defineEventHandler, readBody } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import { assertShopInCity, mapTelegramSourceRow } from '~/server/utils/ingestSourcesDashboard'
import {
  INGEST_CONTEXT_TYPES,
  normalizeTelegramSourceKey,
} from '~/server/utils/ingestSourcesDashboardShared'
import { resolveManagerCityScopeOrThrow } from '~/server/utils/managerCityAccess'

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
  const scope = await resolveManagerCityScopeOrThrow(event, slug)
  const body = await readBody<Body>(event).catch(() => ({}))

  const sourceKey = normalizeTelegramSourceKey(String(body.sourceKey || ''))
  const organizationId = await assertShopInCity({
    event,
    cityId: scope.cityId,
    organizationId: body.organizationId,
  })

  const client = await serverSupabaseServiceRole(event)
  const { data, error } = await client
    .from('city_telegram_sources')
    .insert({
      city_id: scope.cityId,
      source_key: sourceKey,
      source_type: body.sourceType === 'group' ? 'group' : 'channel',
      context_type: normalizeContextType(body.contextType),
      organization_id: organizationId,
      is_active: body.isActive !== false,
      ingest_mode: body.ingestMode === 'batch' ? 'batch' : 'realtime',
      notes: body.notes ? String(body.notes).trim().slice(0, 500) : null,
    } as any)
    .select(TG_SOURCE_SELECT)
    .maybeSingle()

  if (error) {
    if (/duplicate|unique/i.test(error.message)) {
      throw createError({ statusCode: 409, statusMessage: 'Telegram source already exists for this city' })
    }
    throw createError({ statusCode: 500, statusMessage: error.message })
  }
  if (!data?.id) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to create telegram source' })
  }

  return { ok: true as const, item: mapTelegramSourceRow(data) }
})
