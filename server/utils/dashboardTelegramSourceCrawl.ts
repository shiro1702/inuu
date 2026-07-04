import type { H3Event } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import { getTelegramSourceById } from '~/server/utils/ingestSourcesDashboard'
import type { ManagerCityScope } from '~/server/utils/managerCityAccess'
import { executeWebSourceCrawl, type WebCrawlSourceRow } from '~/server/utils/webCrawlRouter'

export type DashboardTelegramCrawlOptions = {
  persist: boolean
}

export async function runDashboardTelegramSourceCrawl(args: {
  event: H3Event
  scope: ManagerCityScope
  sourceId: string
  options: DashboardTelegramCrawlOptions
}) {
  const sourceDto = await getTelegramSourceById({
    event: args.event,
    cityId: args.scope.cityId,
    id: args.sourceId,
  })

  const client = await serverSupabaseServiceRole(args.event)
  const { data: cityRow } = await client
    .from('cities')
    .select('timezone')
    .eq('id', args.scope.cityId)
    .maybeSingle()

  const previewUrl = `https://t.me/s/${sourceDto.sourceKey}`
  const syntheticSource: WebCrawlSourceRow = {
    id: args.sourceId,
    city_id: args.scope.cityId,
    url: previewUrl,
    display_name: sourceDto.organization?.name || `@${sourceDto.sourceKey}`,
    context_type: sourceDto.contextType,
    organization_id: sourceDto.organizationId,
    parsing_strategy: null,
    parsing_rules: null,
    rules_validated_at: null,
  }

  const crawlResult = await executeWebSourceCrawl({
    event: args.event,
    source: syntheticSource,
    city: {
      slug: args.scope.citySlug,
      timezone: String(cityRow?.timezone || 'Asia/Irkutsk'),
      name: args.scope.cityName,
    },
    persist: args.options.persist,
    organizationId: sourceDto.organizationId,
    organizationName: sourceDto.organization?.name || null,
    stats: {
      classified: false,
      classifiedAs: 'text_wall',
      childUrlsFetched: 0,
      alerts: 0,
      usedFastLane: false,
    },
  })

  return {
    crawlResult,
    source: sourceDto,
  }
}
