import { createError, defineEventHandler, getHeader } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import {
  queryWebSourcesWith,
  WEB_SOURCE_CRON_SELECT,
  WEB_SOURCE_CRON_SELECT_LEGACY,
} from '~/server/utils/ingestSourcesDashboard'
import { executeWebSourceCrawl, type WebCrawlSourceRow } from '~/server/utils/webCrawlRouter'

type WebSourceRow = WebCrawlSourceRow & {
  cities: { slug: string; timezone: string; name: string }
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const secret = String((config as { cronWebSourcesSecret?: string }).cronWebSourcesSecret || '').trim()
  if (!secret) {
    throw createError({ statusCode: 503, statusMessage: 'Cron secret not configured' })
  }
  const header = String(getHeader(event, 'x-cron-secret') || '').trim()
  if (header !== secret) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const client = await serverSupabaseServiceRole(event)
  const { data: sources, error } = await queryWebSourcesWith(
    WEB_SOURCE_CRON_SELECT,
    WEB_SOURCE_CRON_SELECT_LEGACY,
    (select) =>
      client
        .from('city_web_sources')
        .select(select)
        .eq('cron_enabled', true)
        .eq('is_active', true),
  )

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  const rows = (sources ?? []).map((row: Record<string, unknown>) => ({
    ...row,
    cities: Array.isArray(row.cities) ? row.cities[0] : row.cities,
  })) as WebSourceRow[]

  const summary = {
    ok: true as const,
    processed: 0,
    skipped: 0,
    classified: 0,
    child_urls_fetched: 0,
    alerts: 0,
    fast_lane: 0,
    errors: [] as Array<{ url: string; error: string }>,
  }

  for (const source of rows) {
    try {
      const city = source.cities
      const result = await executeWebSourceCrawl({
        event,
        source,
        city,
        persist: true,
        organizationId: source.organization_id,
        organizationName: null,
        stats: {
          classified: false,
          classifiedAs: null,
          childUrlsFetched: 0,
          alerts: 0,
          usedFastLane: false,
        },
      })

      if (result.stats.classified) summary.classified += 1
      summary.child_urls_fetched += result.stats.childUrlsFetched
      summary.alerts += result.stats.alerts
      if (result.stats.usedFastLane) summary.fast_lane += 1

      if (result.skipped) {
        summary.skipped += 1
      } else if (result.ingestProcessed) {
        summary.processed += 1
      } else if (result.error) {
        summary.errors.push({ url: source.url, error: result.error })
      }

      await client
        .from('city_web_sources')
        .update({ last_crawled_at: new Date().toISOString() } as Record<string, string>)
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
