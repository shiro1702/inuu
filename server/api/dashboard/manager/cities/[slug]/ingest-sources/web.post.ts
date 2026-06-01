import { createError, defineEventHandler, readBody } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import {
  assertShopInCity,
  getWebSourceById,
  mapWebSourceRow,
  normalizeWebSourceUrl,
} from '~/server/utils/ingestSourcesDashboard'
import { resolveManagerCityScopeOrThrow } from '~/server/utils/managerCityAccess'
import { INGEST_CONTEXT_TYPES } from '~/server/utils/ingestSourcesDashboardShared'

type Body = {
  url?: string
  contextType?: string
  organizationId?: string | null
  cronEnabled?: boolean
  isActive?: boolean
  notes?: string | null
}

const WEB_SOURCE_SELECT = `
  id,url,context_type,organization_id,cron_enabled,is_active,last_crawled_at,notes,created_at,updated_at,
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

  const url = normalizeWebSourceUrl(String(body.url || ''))
  const organizationId = await assertShopInCity({
    event,
    cityId: scope.cityId,
    organizationId: body.organizationId,
  })

  const client = await serverSupabaseServiceRole(event)
  const { data, error } = await client
    .from('city_web_sources')
    .insert({
      city_id: scope.cityId,
      url,
      context_type: normalizeContextType(body.contextType),
      organization_id: organizationId,
      cron_enabled: body.cronEnabled === true,
      is_active: body.isActive !== false,
      notes: body.notes ? String(body.notes).trim().slice(0, 500) : null,
    } as any)
    .select(WEB_SOURCE_SELECT)
    .maybeSingle()

  if (error) {
    if (/duplicate|unique/i.test(error.message)) {
      throw createError({ statusCode: 409, statusMessage: 'Web source URL already exists for this city' })
    }
    throw createError({ statusCode: 500, statusMessage: error.message })
  }
  if (!data?.id) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to create web source' })
  }

  return { ok: true as const, item: mapWebSourceRow(data) }
})
