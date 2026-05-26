import { defineEventHandler, getQuery, setResponseHeader } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import { resolveCityBySlug } from '~/server/utils/inuuCity'

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
    .select('id,slug,title,description,starts_at,ends_at,price,currency,cover_media_url,is_promoted,venue_id')
    .eq('city_id', city.id)
    .eq('is_published', true)
    .gte('starts_at', nowIso)
    .order('starts_at', { ascending: true })
    .limit(limit)

  if (error) {
    console.error('[events/index] load failed:', error)
    return { ok: false, items: [] }
  }

  return { ok: true, items: data ?? [] }
})
