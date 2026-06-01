import type { H3Event } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import { buildWebSourceExternalId } from '~/server/utils/ingestSourceIds'

export { buildWebSourceExternalId } from '~/server/utils/ingestSourceIds'

export async function shouldSkipCrawl(args: {
  event: H3Event
  cityId: string
  sourceUrl: string
  sourceExternalId?: string | null
}): Promise<{ skip: boolean; reason?: string }> {
  const client = await serverSupabaseServiceRole(args.event)
  const sourceUrl = args.sourceUrl.trim()
  const externalId = args.sourceExternalId?.trim() || buildWebSourceExternalId(sourceUrl)

  const { data: submissionByUrl } = await client
    .from('content_submissions')
    .select('id,status')
    .eq('city_id', args.cityId)
    .eq('source_url', sourceUrl)
    .limit(1)
    .maybeSingle()

  if (submissionByUrl?.id) {
    return { skip: true, reason: `submission_exists:${submissionByUrl.status}` }
  }

  const { data: submissionByExt } = await client
    .from('content_submissions')
    .select('id,status')
    .eq('city_id', args.cityId)
    .eq('source_external_id', externalId)
    .limit(1)
    .maybeSingle()

  if (submissionByExt?.id) {
    return { skip: true, reason: `submission_exists:${submissionByExt.status}` }
  }

  const { data: events } = await client
    .from('events')
    .select('id')
    .eq('city_id', args.cityId)
    .filter('source_metadata->>source_url', 'eq', sourceUrl)
    .limit(1)

  if (events?.length) {
    return { skip: true, reason: 'event_published' }
  }

  return { skip: false }
}
