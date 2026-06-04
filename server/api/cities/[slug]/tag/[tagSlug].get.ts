import { createError, defineEventHandler, setResponseHeader } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import { enrichEventsForStorefront } from '~/server/utils/enrichEventsForStorefront'
import { resolveCityBySlug } from '~/server/utils/inuuCity'
import { parseSourceMetadata } from '~/server/utils/eventPublicDetail'
import { countSeriesDates, dedupeEventsListForDisplay } from '~/server/utils/eventSeries'

export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'Cache-Control', 'public, max-age=60, s-maxage=120')
  const citySlug = typeof event.context.params?.slug === 'string' ? event.context.params.slug : ''
  const tagSlug = typeof event.context.params?.tagSlug === 'string' ? event.context.params.tagSlug : ''
  if (!tagSlug) {
    throw createError({ statusCode: 400, statusMessage: 'Tag slug is required' })
  }

  const city = await resolveCityBySlug(event, citySlug)
  const client = await serverSupabaseServiceRole(event)
  const nowIso = new Date().toISOString()

  const { data: tagRow } = await client
    .from('city_content_tags')
    .select('slug,name')
    .eq('city_id', city.id)
    .eq('slug', tagSlug)
    .maybeSingle()

  const { data: eventRows } = await client
    .from('events')
    .select('id,slug,title,description,excerpt,starts_at,price,currency,cover_media_url,series_slug,source_metadata,shop_id,source_channel,venue_id')
    .eq('city_id', city.id)
    .eq('is_published', true)
    .gte('starts_at', nowIso)
    .order('starts_at', { ascending: true })
    .limit(120)

  const eventsFiltered = (eventRows ?? []).filter((row: any) => {
    const meta = parseSourceMetadata(row.source_metadata)
    return (meta.topic_tags || []).includes(tagSlug)
  })

  const seriesCounts = countSeriesDates(eventsFiltered)
  const deduped = dedupeEventsListForDisplay(eventsFiltered).map((row) => ({
    ...row,
    series_date_count: row.series_slug ? seriesCounts.get(String(row.series_slug)) || 1 : 1,
  }))
  const events = await enrichEventsForStorefront(client, deduped)

  const { data: newsRows } = await client
    .from('editorial_posts')
    .select('id,slug,title,excerpt,cover_media_url,published_at,topic_tags')
    .eq('city_id', city.id)
    .eq('is_published', true)
    .contains('topic_tags', [tagSlug])
    .order('published_at', { ascending: false })
    .limit(24)

  const { data: listRows } = await client
    .from('curated_lists')
    .select('id,slug,title,description,topic_tags,created_at')
    .eq('city_id', city.id)
    .eq('is_published', true)
    .contains('topic_tags', [tagSlug])
    .order('created_at', { ascending: false })
    .limit(24)

  return {
    ok: true,
    tag: {
      slug: tagSlug,
      name: tagRow?.name ? String(tagRow.name) : tagSlug,
    },
    events,
    news: newsRows ?? [],
    lists: listRows ?? [],
  }
})
