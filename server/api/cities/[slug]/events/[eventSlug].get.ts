import { createError, defineEventHandler, setResponseHeader } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import { resolveCityBySlug } from '~/server/utils/inuuCity'

export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'Cache-Control', 'public, max-age=60, s-maxage=120')
  const slug = typeof event.context.params?.slug === 'string' ? event.context.params.slug : ''
  const eventSlug = typeof event.context.params?.eventSlug === 'string' ? event.context.params.eventSlug : ''
  const city = await resolveCityBySlug(event, slug)

  const client = await serverSupabaseServiceRole(event)
  const { data, error } = await client
    .from('events')
    .select('*, venues:venue_id(id,slug,title,address)')
    .eq('city_id', city.id)
    .eq('slug', eventSlug)
    .eq('is_published', true)
    .maybeSingle()

  if (error) {
    console.error('[events/detail] load failed:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to load event' })
  }

  if (!data) {
    throw createError({ statusCode: 404, statusMessage: 'Event not found' })
  }

  let seriesSessions: Array<{ slug: string; starts_at: string }> = []
  const seriesSlug = (data as any).series_slug
  if (seriesSlug) {
    const nowIso = new Date().toISOString()
    const { data: siblings } = await client
      .from('events')
      .select('slug,starts_at')
      .eq('city_id', city.id)
      .eq('series_slug', seriesSlug)
      .eq('is_published', true)
      .gte('starts_at', nowIso)
      .order('starts_at', { ascending: true })

    seriesSessions = (siblings ?? []).map((row: any) => ({
      slug: String(row.slug),
      starts_at: String(row.starts_at),
    }))
  }

  return { ok: true, event: data, seriesSessions }
})
