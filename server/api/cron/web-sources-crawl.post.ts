import { createError, defineEventHandler, getHeader } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import { fetchUrlPlainText } from '~/server/utils/contentUrlEnricher'
import { runContentIngest } from '~/server/utils/contentIngestCore'
import { buildWebSourceExternalId, shouldSkipCrawl } from '~/server/utils/ingestDedupe'
import { resolveOrCreateShadowOrg } from '~/server/utils/ingestShadowOrg'

type WebSourceRow = {
  id: string
  city_id: string
  url: string
  context_type: string
  organization_id: string | null
  cities: { slug: string; timezone: string; name: string }
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const secret = String((config as any).cronWebSourcesSecret || '').trim()
  if (!secret) {
    throw createError({ statusCode: 503, statusMessage: 'Cron secret not configured' })
  }
  const header = String(getHeader(event, 'x-cron-secret') || '').trim()
  if (header !== secret) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const client = await serverSupabaseServiceRole(event)
  const { data: sources, error } = await client
    .from('city_web_sources')
    .select('id,city_id,url,context_type,organization_id,cities!inner(slug,timezone,name)')
    .eq('cron_enabled', true)
    .eq('is_active', true)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  const rows = (sources ?? []).map((row: any) => ({
    ...row,
    cities: Array.isArray(row.cities) ? row.cities[0] : row.cities,
  })) as WebSourceRow[]
  const summary = {
    ok: true as const,
    processed: 0,
    skipped: 0,
    errors: [] as Array<{ url: string; error: string }>,
  }

  for (const source of rows) {
    try {
      const city = source.cities
      const sourceExternalId = buildWebSourceExternalId(source.url)
      const dedupe = await shouldSkipCrawl({
        event,
        cityId: source.city_id,
        sourceUrl: source.url,
        sourceExternalId,
      })
      if (dedupe.skip) {
        summary.skipped += 1
        await client
          .from('city_web_sources')
          .update({ last_crawled_at: new Date().toISOString() } as any)
          .eq('id', source.id)
        continue
      }

      const pageText = await fetchUrlPlainText(source.url)
      if (!pageText || pageText.trim().length < 20) {
        summary.errors.push({ url: source.url, error: 'empty_or_short_page' })
        continue
      }

      let organizationId = source.organization_id
      let organizationName: string | null = null
      if (!organizationId) {
        const shadow = await resolveOrCreateShadowOrg({
          event,
          cityId: source.city_id,
          sourceUrl: source.url,
          webSourceId: source.id,
        })
        organizationId = shadow.shopId
        organizationName = shadow.name
      }

      const ingest = await runContentIngest(event, {
        rawText: pageText,
        sourceKind: 'web_cron',
        sourceUrl: source.url,
        sourceExternalId,
        citySlug: city.slug,
        timezone: city.timezone,
        persist: true,
        skipUrlEnrich: true,
        hints: { contextType: source.context_type },
        organizationId,
        organizationName,
      })

      if (ingest.skippedByPrefilter) {
        summary.skipped += 1
      } else if (ingest.persisted.ok) {
        summary.processed += 1
      } else {
        summary.errors.push({
          url: source.url,
          error: ingest.persisted.warning || 'persist_failed',
        })
      }

      await client
        .from('city_web_sources')
        .update({ last_crawled_at: new Date().toISOString() } as any)
        .eq('id', source.id)
    } catch (err) {
      summary.errors.push({
        url: source.url,
        error: err instanceof Error ? err.message : 'unknown_error',
      })
    }
  }

  return summary
})
