import { defineEventHandler, getQuery } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import { enrichEventsForStorefront } from '~/server/utils/enrichEventsForStorefront'
import { prepareEventsListForDisplay } from '~/utils/eventListDisplay'
import { resolveManagerCityScopeOrThrow } from '~/server/utils/managerCityAccess'

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
}

export default defineEventHandler(async (event) => {
  const slugParam = typeof event.context.params?.slug === 'string' ? event.context.params.slug : ''
  const scope = await resolveManagerCityScopeOrThrow(event, slugParam)
  const query = getQuery(event)
  const limit = Math.min(20, Math.max(1, Number(query.limit) || 10))
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

  const { data, error } = await client
    .from('events')
    .select(
      'id,slug,title,excerpt,tldr,starts_at,price,currency,cover_media_url,vibe_emoji,venue_id,shop_id',
    )
    .eq('city_id', scope.cityId)
    .eq('is_published', true)
    .gte('starts_at', nowIso)
    .order('starts_at', { ascending: true })
    .limit(Math.max(limit * 2, 40))

  if (error) {
    return {
      ok: false as const,
      city: { id: scope.cityId, slug: scope.citySlug, name: scope.cityName },
      timezone,
      items: [],
      message: error.message,
    }
  }

  const rows = prepareEventsListForDisplay((data ?? []) as EventRow[], limit)
  const enriched = await enrichEventsForStorefront(client, rows)

  const items = enriched.map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    tldr: row.tldr,
    startsAt: row.starts_at,
    price: row.price,
    currency: row.currency,
    coverMediaUrl: row.cover_media_url,
    vibeEmoji: row.vibe_emoji,
    venueTitle: row.venue?.title ?? null,
  }))

  return {
    ok: true as const,
    city: { id: scope.cityId, slug: scope.citySlug, name: scope.cityName },
    timezone,
    items,
  }
})
