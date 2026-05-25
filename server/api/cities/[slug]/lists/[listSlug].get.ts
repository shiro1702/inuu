import { createError, defineEventHandler, setResponseHeader } from 'h3'
import { serverSupabaseClient } from '#supabase/server'
import { resolveCityBySlug } from '~/server/utils/inuuCity'

type CuratedListItemRow = {
  id: string
  entity_type: string
  entity_id: string
  sort_order: number
  note: string | null
}

export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'Cache-Control', 'public, max-age=60, s-maxage=120')
  const slug = typeof event.context.params?.slug === 'string' ? event.context.params.slug : ''
  const listSlug = typeof event.context.params?.listSlug === 'string' ? event.context.params.listSlug : ''
  const city = await resolveCityBySlug(event, slug)

  const client = await serverSupabaseClient(event)
  const { data: list, error: listError } = await client
    .from('curated_lists')
    .select('id,slug,title,description')
    .eq('city_id', city.id)
    .eq('slug', listSlug)
    .eq('is_published', true)
    .maybeSingle()

  if (listError) {
    console.error('[lists/detail] list load failed:', listError)
    throw createError({ statusCode: 500, statusMessage: 'Failed to load list' })
  }

  if (!list) {
    throw createError({ statusCode: 404, statusMessage: 'List not found' })
  }

  const { data: rawItems, error: itemsError } = await client
    .from('curated_list_items')
    .select('id,entity_type,entity_id,sort_order,note')
    .eq('list_id', list.id)
    .order('sort_order', { ascending: true })

  if (itemsError) {
    console.error('[lists/detail] items load failed:', itemsError)
    throw createError({ statusCode: 500, statusMessage: 'Failed to load list items' })
  }

  const rows = (rawItems ?? []) as CuratedListItemRow[]
  const venueIds = rows.filter((r) => r.entity_type === 'venue').map((r) => r.entity_id)
  const eventIds = rows.filter((r) => r.entity_type === 'event').map((r) => r.entity_id)

  const [venuesRes, eventsRes] = await Promise.all([
    venueIds.length
      ? client
          .from('venues')
          .select('id,slug,title,description,address,cover_media_url,vibe_tags,editorial_quote')
          .eq('city_id', city.id)
          .eq('is_published', true)
          .eq('is_active', true)
          .in('id', venueIds)
      : Promise.resolve({ data: [] as Record<string, unknown>[] }),
    eventIds.length
      ? client
          .from('events')
          .select('id,slug,title,description,starts_at,price,currency,cover_media_url')
          .eq('city_id', city.id)
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
    .map((row) => {
      if (row.entity_type === 'venue') {
        const venue = venueById.get(row.entity_id)
        return venue ? { entityType: 'venue' as const, note: row.note, venue } : null
      }
      if (row.entity_type === 'event') {
        const evt = eventById.get(row.entity_id)
        return evt ? { entityType: 'event' as const, note: row.note, event: evt } : null
      }
      return null
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)

  return { ok: true, list, items }
})
