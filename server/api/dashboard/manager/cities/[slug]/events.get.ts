import { defineEventHandler, getQuery } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import { enrichEventsForStorefront } from '~/server/utils/enrichEventsForStorefront'
import { mapEventRowToCarouselMaterial } from '~/server/utils/mapCarouselMaterial'
import { resolveManagerCityScopeOrThrow } from '~/server/utils/managerCityAccess'
import {
  filterEventsByTags,
  parseTagSlugsFromQuery,
  prepareEventsListForDisplay,
} from '~/utils/eventListDisplay'

type EventRow = {
  id: string
  slug: string
  title: string
  excerpt: string | null
  tldr: string | null
  starts_at: string
  price: number | null
  currency: string | null
  cover_media_url: string | null
  vibe_emoji: string | null
  venue_id: string | null
  shop_id: string | null
  source_metadata: unknown
}

export default defineEventHandler(async (event) => {
  const slugParam = typeof event.context.params?.slug === 'string' ? event.context.params.slug : ''
  const scope = await resolveManagerCityScopeOrThrow(event, slugParam)
  const query = getQuery(event)
  const limit = Math.min(50, Math.max(1, Number(query.limit) || 24))
  const tagSlugs = parseTagSlugsFromQuery(query.tag)
  const nowIso = new Date().toISOString()

  const client = await serverSupabaseServiceRole(event)

  const { data: cityRow } = await client
    .from('cities')
    .select('timezone')
    .eq('id', scope.cityId)
    .maybeSingle()

  const timezone =
    typeof cityRow?.timezone === 'string' && cityRow.timezone.trim()
      ? cityRow.timezone.trim()
      : 'Asia/Irkutsk'

  const fetchPool = tagSlugs.length ? Math.max(limit * 4, 80) : Math.max(limit * 2, 40)

  const { data, error } = await client
    .from('events')
    .select(
      'id,slug,title,excerpt,tldr,starts_at,price,currency,cover_media_url,vibe_emoji,venue_id,shop_id,source_metadata',
    )
    .eq('city_id', scope.cityId)
    .eq('is_published', true)
    .gte('starts_at', nowIso)
    .order('starts_at', { ascending: true })
    .limit(fetchPool)

  if (error) {
    return {
      ok: false as const,
      city: { id: scope.cityId, slug: scope.citySlug, name: scope.cityName },
      timezone,
      items: [],
      message: error.message,
    }
  }

  let rows = (data ?? []) as EventRow[]
  rows = filterEventsByTags(rows, tagSlugs)
  rows = prepareEventsListForDisplay(rows, limit)
  const enriched = await enrichEventsForStorefront(client, rows)

  const items = enriched.map((row) =>
    mapEventRowToCarouselMaterial({
      ...row,
      venue: row.venue,
    }),
  )

  return {
    ok: true as const,
    city: { id: scope.cityId, slug: scope.citySlug, name: scope.cityName },
    timezone,
    items,
  }
})
