import { defineEventHandler, readBody } from 'h3'
import { runDashboardWebSourceCrawl } from '~/server/utils/dashboardWebSourceCrawl'
import { resolveManagerCityScopeOrThrow } from '~/server/utils/managerCityAccess'

type Body = {
  createShadowOrg?: boolean
}

export default defineEventHandler(async (event) => {
  const slug = typeof event.context.params?.slug === 'string' ? event.context.params.slug : ''
  const sourceId = typeof event.context.params?.id === 'string' ? event.context.params.id : ''
  const scope = await resolveManagerCityScopeOrThrow(event, slug)
  const body = await readBody<Body>(event).catch(() => ({}))

  const { crawlResult, shadowCreated, source } = await runDashboardWebSourceCrawl({
    event,
    scope,
    sourceId,
    options: {
      persist: true,
      createShadowOrg: body.createShadowOrg,
    },
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
    shadowCreated,
    crawl: crawlResult,
    source,
  }
})
