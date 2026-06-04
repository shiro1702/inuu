import { createError, defineEventHandler, setResponseHeader } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'

type CuratedListItemRow = {
  id: string
  entity_type: string
  entity_id: string
  sort_order: number
  note: string | null
}

type ListWithItemsRow = {
  id: string
  slug: string
  title: string
  description: string | null
  topic_tags: string[] | null
  curated_list_items: CuratedListItemRow[] | null
  cities: { id: string; slug: string }
}

export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'Cache-Control', 'public, max-age=60, s-maxage=120, stale-while-revalidate=300')

  const slug = typeof event.context.params?.slug === 'string' ? event.context.params.slug : ''
  const listSlug = typeof event.context.params?.listSlug === 'string' ? event.context.params.listSlug : ''
  if (!slug || !listSlug) {
    throw createError({ statusCode: 400, statusMessage: 'City slug and list slug are required' })
  }

  const client = await serverSupabaseServiceRole(event)

  const { data: listRow, error: listError } = await client
    .from('curated_lists')
    .select(`
      id,
      slug,
      title,
      description,
      topic_tags,
      curated_list_items (
        id,
        entity_type,
        entity_id,
        sort_order,
        note
      ),
      cities!inner (
        id,
        slug
      )
    `)
    .eq('slug', listSlug)
    .eq('is_published', true)
    .eq('cities.slug', slug)
    .maybeSingle()

  if (listError) {
    console.error('[lists/detail] list load failed:', listError)
    throw createError({ statusCode: 500, statusMessage: 'Failed to load list' })
  }

  if (!listRow) {
    throw createError({ statusCode: 404, statusMessage: 'List not found' })
  }

  const row = listRow as ListWithItemsRow
  const cityId = row.cities.id
  const list = {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    topic_tags: Array.isArray(row.topic_tags) ? row.topic_tags : [],
  }

  const rows = [...(row.curated_list_items ?? [])].sort((a, b) => a.sort_order - b.sort_order)
  const venueIds = rows.filter((r) => r.entity_type === 'venue').map((r) => r.entity_id)
  const eventIds = rows.filter((r) => r.entity_type === 'event').map((r) => r.entity_id)

  const [venuesRes, eventsRes] = await Promise.all([
    venueIds.length
      ? client
          .from('venues')
          .select('id,slug,title,description,address,cover_media_url,vibe_tags,editorial_quote')
          .eq('city_id', cityId)
          .eq('is_published', true)
          .eq('is_active', true)
          .in('id', venueIds)
      : Promise.resolve({ data: [] as Record<string, unknown>[] }),
    eventIds.length
      ? client
          .from('events')
          .select('id,slug,title,description,starts_at,price,currency,cover_media_url')
          .eq('city_id', cityId)
          .eq('is_published', true)
          .in('id', eventIds)
      : Promise.resolve({ data: [] as Record<string, unknown>[] }),
  ])

  const venueById = new Map(
    (venuesRes.data ?? []).map((v) => [String((v as { id: string }).id), v]),
  )
  const eventById = new Map(
    (eventsRes.data ?? []).map((e) => [String((e as { id: string }).id), e]),
  )

  const items = rows
    .map((itemRow) => {
      if (itemRow.entity_type === 'venue') {
        const venue = venueById.get(itemRow.entity_id)
        return venue ? { entityType: 'venue' as const, note: itemRow.note, venue } : null
      }
      if (itemRow.entity_type === 'event') {
        const evt = eventById.get(itemRow.entity_id)
        return evt ? { entityType: 'event' as const, note: itemRow.note, event: evt } : null
      }
      return null
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)

  return { ok: true, list, items }
})
