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
      persist: false,
      createShadowOrg: body.createShadowOrg,
    },
  })

  return {
    ok: true as const,
    persist: false,
    skipped: crawlResult.skipped,
    skipReason: crawlResult.skipReason,
    ingestProcessed: crawlResult.ingestProcessed,
    shadowCreated,
    crawl: crawlResult,
    source,
  }
})
