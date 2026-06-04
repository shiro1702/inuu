import { createError, defineEventHandler } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import { enrichEventsForStorefront } from '~/server/utils/enrichEventsForStorefront'
import {
  mapEventRowToCarouselMaterial,
  mapVenueRowToCarouselMaterial,
} from '~/server/utils/mapCarouselMaterial'
import { resolveManagerCityScopeOrThrow } from '~/server/utils/managerCityAccess'

type CuratedListItemRow = {
  entity_type: string
  entity_id: string
  sort_order: number
  note: string | null
}

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

type VenueRow = {
  id: string
  slug: string
  title: string
  description: string | null
  address: string | null
  cover_media_url: string | null
}

export default defineEventHandler(async (event) => {
  const slugParam = typeof event.context.params?.slug === 'string' ? event.context.params.slug : ''
  const listSlug = typeof event.context.params?.listSlug === 'string' ? event.context.params.listSlug : ''
  const scope = await resolveManagerCityScopeOrThrow(event, slugParam)
  if (!listSlug.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'List slug is required' })
  }

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

  const { data: listRow, error: listError } = await client
    .from('curated_lists')
    .select('id,slug,title,description,topic_tags,curated_list_items(entity_type,entity_id,sort_order,note)')
    .eq('city_id', scope.cityId)
    .eq('slug', listSlug.trim())
    .eq('is_published', true)
    .maybeSingle()

  if (listError) {
    return { ok: false as const, message: listError.message, list: null, items: [] }
  }
  if (!listRow) {
    throw createError({ statusCode: 404, statusMessage: 'List not found' })
  }

  const listMeta = {
    id: String((listRow as { id: string }).id),
    slug: String((listRow as { slug: string }).slug),
    title: String((listRow as { title: string }).title),
    description: (listRow as { description?: string | null }).description ?? null,
    topicTags: Array.isArray((listRow as { topic_tags?: string[] }).topic_tags)
      ? (listRow as { topic_tags: string[] }).topic_tags.map(String)
      : [],
  }

  const orderedItems = [
    ...((listRow as { curated_list_items?: CuratedListItemRow[] }).curated_list_items ?? []),
  ].sort((a, b) => a.sort_order - b.sort_order)

  const eventIds = orderedItems.filter((r) => r.entity_type === 'event').map((r) => r.entity_id)
  const venueIds = orderedItems.filter((r) => r.entity_type === 'venue').map((r) => r.entity_id)

  const [eventsRes, venuesRes] = await Promise.all([
    eventIds.length
      ? client
          .from('events')
          .select(
            'id,slug,title,excerpt,tldr,starts_at,price,currency,cover_media_url,vibe_emoji,venue_id,shop_id,source_metadata',
          )
          .eq('city_id', scope.cityId)
          .eq('is_published', true)
          .in('id', eventIds)
      : Promise.resolve({ data: [] as EventRow[], error: null }),
    venueIds.length
      ? client
          .from('venues')
          .select('id,slug,title,description,address,cover_media_url')
          .eq('city_id', scope.cityId)
          .eq('is_published', true)
          .eq('is_active', true)
          .in('id', venueIds)
      : Promise.resolve({ data: [] as VenueRow[], error: null }),
  ])

  if (eventsRes.error || venuesRes.error) {
    return {
      ok: false as const,
      message: eventsRes.error?.message || venuesRes.error?.message || 'Load failed',
      list: listMeta,
      items: [],
    }
  }

  const eventsById = new Map((eventsRes.data ?? []).map((row) => [String((row as EventRow).id), row as EventRow]))
  const venuesById = new Map((venuesRes.data ?? []).map((row) => [String((row as VenueRow).id), row as VenueRow]))

  const eventRowsOrdered = eventIds
    .map((id) => eventsById.get(id))
    .filter((row): row is EventRow => Boolean(row))
  const enrichedEvents = await enrichEventsForStorefront(client, eventRowsOrdered)
  const enrichedById = new Map(enrichedEvents.map((row) => [String(row.id), row]))

  const items = orderedItems
    .map((itemRow) => {
      if (itemRow.entity_type === 'event') {
        const row = enrichedById.get(itemRow.entity_id)
        if (!row) return null
        return mapEventRowToCarouselMaterial({ ...row, venue: row.venue }, itemRow.note)
      }
      if (itemRow.entity_type === 'venue') {
        const row = venuesById.get(itemRow.entity_id)
        if (!row) return null
        return mapVenueRowToCarouselMaterial(row, itemRow.note)
      }
      return null
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)

  return {
    ok: true as const,
    timezone,
    list: listMeta,
    items,
    /** @deprecated use items */
    events: items.filter((i) => i.entityType === 'event'),
  }
})
