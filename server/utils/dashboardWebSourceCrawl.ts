import { createError, type H3Event } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import {
  getWebSourceById,
  mapWebSourceRow,
  queryWebSourcesWith,
  WEB_SOURCE_CRAWL_SELECT,
  WEB_SOURCE_CRAWL_SELECT_LEGACY,
  queryWebSources,
} from '~/server/utils/ingestSourcesDashboard'
import { resolveOrCreateShadowOrg } from '~/server/utils/ingestShadowOrg'
import type { IngestCityScope } from '~/server/utils/ingestCityScope'
import { executeWebSourceCrawl, type WebCrawlSourceRow } from '~/server/utils/webCrawlRouter'

export type DashboardWebCrawlOptions = {
  persist: boolean
  createShadowOrg?: boolean
}

export async function runDashboardWebSourceCrawl(args: {
  event: H3Event
  scope: IngestCityScope
  sourceId: string
  options: DashboardWebCrawlOptions
}) {
  const sourceDto = await getWebSourceById({
    event: args.event,
    cityId: args.scope.cityId,
    id: args.sourceId,
  })

  const client = await serverSupabaseServiceRole(args.event)
  const { data: row, error } = await queryWebSourcesWith(
    WEB_SOURCE_CRAWL_SELECT,
    WEB_SOURCE_CRAWL_SELECT_LEGACY,
    (select) =>
      client
        .from('city_web_sources')
        .select(select)
        .eq('city_id', args.scope.cityId)
        .eq('id', args.sourceId)
        .maybeSingle(),
  )

  if (error || !row?.id) {
    throw createError({ statusCode: 404, statusMessage: 'Web source not found' })
  }

  const { data: cityRow } = await client
    .from('cities')
    .select('timezone')
    .eq('id', args.scope.cityId)
    .maybeSingle()

  let organizationId = sourceDto.organizationId
  let organizationName = sourceDto.organization?.name || null
  let shadowCreated = false

  if (!organizationId && args.options.createShadowOrg !== false) {
    const shadow = await resolveOrCreateShadowOrg({
      event: args.event,
      cityId: args.scope.cityId,
      sourceUrl: sourceDto.url,
      orgNameHint: sourceDto.displayName,
      webSourceId: sourceDto.id,
    })
    organizationId = shadow.shopId
    organizationName = shadow.name
    shadowCreated = shadow.created
  }

  const crawlResult = await executeWebSourceCrawl({
    event: args.event,
    source: row as WebCrawlSourceRow,
    city: {
      slug: args.scope.citySlug,
      timezone: String(cityRow?.timezone || 'Asia/Irkutsk'),
      name: args.scope.cityName,
    },
    persist: args.options.persist,
    organizationId,
    organizationName,
    stats: {
      classified: false,
      classifiedAs: null,
      childUrlsFetched: 0,
      alerts: 0,
      usedFastLane: false,
    },
  })

  await client
    .from('city_web_sources')
    .update({ last_crawled_at: new Date().toISOString() } as Record<string, string>)
    .eq('id', args.sourceId)

  const { data: refreshed } = await queryWebSources((select) =>
    client.from('city_web_sources').select(select).eq('id', args.sourceId).maybeSingle(),
  )

  return {
    crawlResult,
    shadowCreated,
    source: refreshed?.id ? mapWebSourceRow(refreshed) : sourceDto,
  }
}
