import { createError, defineEventHandler, setResponseHeader } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import { enrichEventsForStorefront } from '~/server/utils/enrichEventsForStorefront'
import { prepareEventsListForDisplay } from '~/server/utils/eventListDisplay'
import { resolveCityBySlug } from '~/server/utils/inuuCity'

const UPCOMING_EVENTS_LIMIT = 24
const UPCOMING_EVENTS_FETCH_POOL = 80

export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'Cache-Control', 'public, max-age=60, s-maxage=120')
  const slug = typeof event.context.params?.slug === 'string' ? event.context.params.slug : ''
  const venueSlug = typeof event.context.params?.venueSlug === 'string' ? event.context.params.venueSlug : ''
  const city = await resolveCityBySlug(event, slug)

  const client = await serverSupabaseServiceRole(event)
  const { data, error } = await client
    .from('venues')
    .select('*')
    .eq('city_id', city.id)
    .eq('slug', venueSlug)
    .eq('is_published', true)
    .eq('is_active', true)
    .maybeSingle()

  if (error) {
    console.error('[venues/detail] load failed:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to load venue' })
  }

  if (!data) {
    throw createError({ statusCode: 404, statusMessage: 'Venue not found' })
  }

  const nowIso = new Date().toISOString()
  const { data: eventRows, error: eventsError } = await client
    .from('events')
    .select('id,slug,title,description,excerpt,starts_at,ends_at,price,currency,cover_media_url,is_promoted,venue_id,series_slug,category_id,source_metadata,shop_id,source_channel')
    .eq('city_id', city.id)
    .eq('venue_id', data.id)
    .eq('is_published', true)
    .gte('starts_at', nowIso)
    .order('starts_at', { ascending: true })
    .limit(UPCOMING_EVENTS_FETCH_POOL)

  if (eventsError) {
    console.error('[venues/detail] load events failed:', eventsError)
    throw createError({ statusCode: 500, statusMessage: 'Failed to load venue events' })
  }

  const upcomingEvents = await enrichEventsForStorefront(
    client,
    prepareEventsListForDisplay(eventRows ?? [], UPCOMING_EVENTS_LIMIT),
  )

  return { ok: true, venue: data, upcomingEvents }
})
