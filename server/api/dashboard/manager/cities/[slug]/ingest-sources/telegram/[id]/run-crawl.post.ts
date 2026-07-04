import { defineEventHandler } from 'h3'
import { runDashboardTelegramSourceCrawl } from '~/server/utils/dashboardTelegramSourceCrawl'
import { resolveManagerCityScopeOrThrow } from '~/server/utils/managerCityAccess'

export default defineEventHandler(async (event) => {
  const slug = typeof event.context.params?.slug === 'string' ? event.context.params.slug : ''
  const sourceId = typeof event.context.params?.id === 'string' ? event.context.params.id : ''
  const scope = await resolveManagerCityScopeOrThrow(event, slug)

  const { crawlResult, source } = await runDashboardTelegramSourceCrawl({
    event,
    scope,
    sourceId,
    options: { persist: true },
  })

  const success = crawlResult.ok && (crawlResult.ingestProcessed || crawlResult.skipped)

  return {
    ok: success,
    persist: true,
    skipped: crawlResult.skipped,
    skipReason: crawlResult.skipReason,
    ingestProcessed: crawlResult.ingestProcessed,
    error: crawlResult.error || null,
    hint: crawlResult.hint || null,
    fetchMode: crawlResult.fetchMode || null,
    crawl: crawlResult,
    source,
  }
})
