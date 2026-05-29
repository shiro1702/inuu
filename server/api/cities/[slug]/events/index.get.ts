import { defineEventHandler, getQuery, setResponseHeader } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import { resolveCityBySlug } from '~/server/utils/inuuCity'
import { countSeriesDates, dedupeEventsListForDisplay } from '~/server/utils/eventSeries'

export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'Cache-Control', 'public, max-age=60, s-maxage=120')
  const slug = typeof event.context.params?.slug === 'string' ? event.context.params.slug : ''
  const city = await resolveCityBySlug(event, slug)
  const query = getQuery(event)
  const limit = Math.min(50, Math.max(1, Number(query.limit) || 24))
  const nowIso = new Date().toISOString()

  const client = await serverSupabaseServiceRole(event)
  const { data, error } = await client
    .from('events')
    .select('id,slug,title,description,starts_at,ends_at,price,currency,cover_media_url,is_promoted,venue_id,series_slug')
    .eq('city_id', city.id)
    .eq('is_published', true)
    .gte('starts_at', nowIso)
    .order('starts_at', { ascending: true })
    .limit(Math.max(limit * 3, 60))

  if (error) {
    console.error('[events/index] load failed:', error)
    return { ok: false, items: [] }
  }

  const rows = data ?? []
  const seriesCounts = countSeriesDates(rows)
  const deduped = dedupeEventsListForDisplay(rows).slice(0, limit)
  const items = deduped.map((row) => ({
    ...row,
    series_date_count: row.series_slug ? seriesCounts.get(String(row.series_slug)) || 1 : 1,
  }))

  return { ok: true, items }
})
