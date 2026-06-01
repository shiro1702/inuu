import { createError, defineEventHandler, readBody } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import { fetchUrlPlainText } from '~/server/utils/contentUrlEnricher'
import { runContentIngest } from '~/server/utils/contentIngestCore'
import { buildWebSourceExternalId, shouldSkipCrawl } from '~/server/utils/ingestDedupe'
import { getWebSourceById, mapWebSourceRow } from '~/server/utils/ingestSourcesDashboard'
import { resolveOrCreateShadowOrg } from '~/server/utils/ingestShadowOrg'
import { resolveManagerCityScopeOrThrow } from '~/server/utils/managerCityAccess'

type Body = {
  createShadowOrg?: boolean
}

const WEB_SOURCE_SELECT = `
  id,url,context_type,organization_id,cron_enabled,is_active,last_crawled_at,notes,created_at,updated_at,
  shops:organization_id(id,slug,name,ui_settings)
`

export default defineEventHandler(async (event) => {
  const slug = typeof event.context.params?.slug === 'string' ? event.context.params.slug : ''
  const sourceId = typeof event.context.params?.id === 'string' ? event.context.params.id : ''
  const scope = await resolveManagerCityScopeOrThrow(event, slug)
  const source = await getWebSourceById({ event, cityId: scope.cityId, id: sourceId })
  const body = await readBody<Body>(event).catch(() => ({}))

  const sourceExternalId = buildWebSourceExternalId(source.url)
  const dedupe = await shouldSkipCrawl({
    event,
    cityId: scope.cityId,
    sourceUrl: source.url,
    sourceExternalId,
  })

  if (dedupe.skip) {
    return {
      ok: true as const,
      skipped: true,
      reason: dedupe.reason,
      source,
    }
  }

  const pageText = await fetchUrlPlainText(source.url)
  if (!pageText || pageText.trim().length < 20) {
    throw createError({ statusCode: 422, statusMessage: 'empty_or_short_page' })
  }

  let organizationId = source.organizationId
  let organizationName = source.organization?.name || null
  let shadowCreated = false

  if (!organizationId && body.createShadowOrg !== false) {
    const shadow = await resolveOrCreateShadowOrg({
      event,
      cityId: scope.cityId,
      sourceUrl: source.url,
      webSourceId: source.id,
    })
    organizationId = shadow.shopId
    organizationName = shadow.name
    shadowCreated = shadow.created
  }

  const ingest = await runContentIngest(event, {
    rawText: pageText,
    sourceKind: 'web_cron',
    sourceUrl: source.url,
    sourceExternalId,
    citySlug: scope.citySlug,
    persist: false,
    skipUrlEnrich: true,
    hints: { contextType: source.contextType },
    organizationId,
    organizationName,
  })

  const client = await serverSupabaseServiceRole(event)
  await client
    .from('city_web_sources')
    .update({ last_crawled_at: new Date().toISOString() } as any)
    .eq('id', source.id)

  let refreshedSource = source
  if (shadowCreated || organizationId !== source.organizationId) {
    const { data } = await client
      .from('city_web_sources')
      .select(WEB_SOURCE_SELECT)
      .eq('id', source.id)
      .maybeSingle()
    if (data?.id) refreshedSource = mapWebSourceRow(data)
  }

  return {
    ok: true as const,
    skipped: ingest.skippedByPrefilter === true,
    skippedByPrefilter: ingest.skippedByPrefilter === true,
    shadowCreated,
    source: refreshedSource,
    ingest: {
      parseKind: ingest.parseKind,
      eventsCount: ingest.events.length,
      events: ingest.events,
      model: ingest.model,
      latencyMs: ingest.latencyMs,
      moderationStatus: ingest.moderationStatus,
    },
  }
})
