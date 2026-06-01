import { createError, defineEventHandler, readBody } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import {
  assertShopInCity,
  getWebSourceById,
  mapWebSourceRow,
  updateWebSourceReturning,
} from '~/server/utils/ingestSourcesDashboard'
import {
  INGEST_CONTEXT_TYPES,
  normalizeWebSourceUrl,
} from '~/server/utils/ingestSourcesDashboardShared'
import { resolveManagerCityScopeOrThrow } from '~/server/utils/managerCityAccess'

type Body = {
  url?: string
  displayName?: string | null
  contextType?: string
  organizationId?: string | null
  cronEnabled?: boolean
  isActive?: boolean
  notes?: string | null
}

function normalizeContextType(value: unknown): string {
  const raw = String(value || 'general').trim().toLowerCase()
  return (INGEST_CONTEXT_TYPES as readonly string[]).includes(raw) ? raw : 'general'
}

export default defineEventHandler(async (event) => {
  const slug = typeof event.context.params?.slug === 'string' ? event.context.params.slug : ''
  const sourceId = typeof event.context.params?.id === 'string' ? event.context.params.id : ''
  const scope = await resolveManagerCityScopeOrThrow(event, slug)
  await getWebSourceById({ event, cityId: scope.cityId, id: sourceId })

  const body = await readBody<Body>(event).catch(() => ({}))
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() }

  if (body.url !== undefined) patch.url = normalizeWebSourceUrl(String(body.url))
  if (body.displayName !== undefined) {
    patch.display_name = body.displayName ? String(body.displayName).trim().slice(0, 120) : null
  }
  if (body.contextType !== undefined) patch.context_type = normalizeContextType(body.contextType)
  if (body.organizationId !== undefined) {
    patch.organization_id = await assertShopInCity({
      event,
      cityId: scope.cityId,
      organizationId: body.organizationId,
    })
  }
  if (body.cronEnabled !== undefined) patch.cron_enabled = body.cronEnabled === true
  if (body.isActive !== undefined) patch.is_active = body.isActive !== false
  if (body.notes !== undefined) {
    patch.notes = body.notes ? String(body.notes).trim().slice(0, 500) : null
  }

  const client = await serverSupabaseServiceRole(event)
  const { data, error } = await updateWebSourceReturning(
    client,
    { cityId: scope.cityId, id: sourceId },
    patch,
  )

  if (error) {
    if (/duplicate|unique/i.test(error.message)) {
      throw createError({ statusCode: 409, statusMessage: 'Web source URL already exists for this city' })
    }
    throw createError({ statusCode: 500, statusMessage: error.message })
  }
  if (!data?.id) {
    throw createError({ statusCode: 404, statusMessage: 'Web source not found' })
  }

  return { ok: true as const, item: mapWebSourceRow(data) }
})
