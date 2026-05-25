import { createError, defineEventHandler, setResponseHeader } from 'h3'
import { serverSupabaseClient } from '#supabase/server'
import { resolveCityBySlug } from '~/server/utils/inuuCity'

export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'Cache-Control', 'public, max-age=60, s-maxage=120')
  const slug = typeof event.context.params?.slug === 'string' ? event.context.params.slug : ''
  const venueSlug = typeof event.context.params?.venueSlug === 'string' ? event.context.params.venueSlug : ''
  const city = await resolveCityBySlug(event, slug)

  const client = await serverSupabaseClient(event)
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

  const { data: upcomingEvents } = await client
    .from('events')
    .select('id,slug,title,starts_at,cover_media_url,price,currency')
    .eq('city_id', city.id)
    .eq('venue_id', data.id)
    .eq('is_published', true)
    .gte('starts_at', new Date().toISOString())
    .order('starts_at', { ascending: true })
    .limit(8)

  return { ok: true, venue: data, upcomingEvents: upcomingEvents ?? [] }
})
