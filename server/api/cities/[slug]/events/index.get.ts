import { defineEventHandler, getQuery, setResponseHeader } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import { resolveCityBySlug } from '~/server/utils/inuuCity'
import { enrichEventsForStorefront } from '~/server/utils/enrichEventsForStorefront'
import {
  filterEventsByDateRange,
  filterEventsByTags,
  parseIsoDateParam,
  parseTagSlugsFromQuery,
  prepareEventsListForDisplay,
} from '~/server/utils/eventListDisplay'

export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'Cache-Control', 'public, max-age=60, s-maxage=120')
  const slug = typeof event.context.params?.slug === 'string' ? event.context.params.slug : ''
  const city = await resolveCityBySlug(event, slug)
  const query = getQuery(event)
  const limit = Math.min(50, Math.max(1, Number(query.limit) || 24))
  const categorySlug = typeof query.category === 'string' ? query.category.trim() : ''
  const tagSlugs = parseTagSlugsFromQuery(query.tag)
  const dateFrom = typeof query.from === 'string' ? parseIsoDateParam(query.from) : null
  const dateTo = typeof query.to === 'string' ? parseIsoDateParam(query.to) : null
  const nowIso = new Date().toISOString()

  const client = await serverSupabaseServiceRole(event)
  let categoryId: string | null = null
  if (categorySlug) {
    const { data: cat } = await client
      .from('event_categories')
      .select('id')
      .eq('city_id', city.id)
      .eq('slug', categorySlug)
      .maybeSingle()
    categoryId = cat?.id ? String(cat.id) : null
  }

  const fetchPool = tagSlugs.length ? Math.max(limit * 6, 120) : Math.max(limit * 3, 60)

  let request = client
    .from('events')
    .select('id,slug,title,description,excerpt,starts_at,ends_at,price,currency,cover_media_url,is_promoted,venue_id,series_slug,category_id,source_metadata,shop_id,source_channel')
    .eq('city_id', city.id)
    .eq('is_published', true)
    .gte('starts_at', nowIso)
  if (categoryId) request = request.eq('category_id', categoryId)

  const { data, error } = await request
    .order('starts_at', { ascending: true })
    .limit(fetchPool)

  if (error) {
    console.error('[events/index] load failed:', error)
    return { ok: false, items: [] }
  }

  let rows = data ?? []
  rows = filterEventsByTags(rows, tagSlugs)
  rows = filterEventsByDateRange(rows, dateFrom, dateTo, city.timezone)

  const items = await enrichEventsForStorefront(
    client,
    prepareEventsListForDisplay(rows, limit),
  )

  return { ok: true, items }
})
