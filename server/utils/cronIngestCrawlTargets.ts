import { createError, type H3Event } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import {
  buildCronIngestCrawlTargets,
  type BuildCronIngestCrawlTargetsInput,
  type CronIngestCrawlTarget,
} from '~/server/utils/cronIngestCrawlTargetsShared'
import {
  queryWebSourcesWith,
  WEB_SOURCE_CRON_SELECT,
  WEB_SOURCE_CRON_SELECT_LEGACY,
} from '~/server/utils/ingestSourcesDashboard'

export type { CronIngestCrawlTarget } from '~/server/utils/cronIngestCrawlTargetsShared'
export {
  buildCronIngestCrawlTargets,
  extractTelegramChannelKeyFromWebUrl,
} from '~/server/utils/cronIngestCrawlTargetsShared'

export async function listCronIngestCrawlTargets(event: H3Event): Promise<{
  targets: CronIngestCrawlTarget[]
  skippedDuplicates: number
}> {
  const client = await serverSupabaseServiceRole(event)

  const { data: webSources, error: webError } = await queryWebSourcesWith(
    WEB_SOURCE_CRON_SELECT,
    WEB_SOURCE_CRON_SELECT_LEGACY,
    (select) =>
      client
        .from('city_web_sources')
        .select(select)
        .eq('is_active', true),
  )

  if (webError) {
    throw createError({ statusCode: 500, statusMessage: webError.message })
  }

  const { data: telegramSources, error: tgError } = await client
    .from('city_telegram_sources')
    .select('id,city_id,source_key,cities!inner(slug,name)')
    .eq('is_active', true)

  if (tgError) {
    throw createError({ statusCode: 500, statusMessage: tgError.message })
  }

  return buildCronIngestCrawlTargets({
    webRows: (webSources ?? []) as BuildCronIngestCrawlTargetsInput['webRows'],
    telegramRows: (telegramSources ?? []) as BuildCronIngestCrawlTargetsInput['telegramRows'],
  })
}
