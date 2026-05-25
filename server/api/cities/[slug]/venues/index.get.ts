import { defineEventHandler, getQuery, setResponseHeader } from 'h3'
import { serverSupabaseClient } from '#supabase/server'
import { resolveCityBySlug } from '~/server/utils/inuuCity'

export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'Cache-Control', 'public, max-age=60, s-maxage=120')
  const slug = typeof event.context.params?.slug === 'string' ? event.context.params.slug : ''
  const city = await resolveCityBySlug(event, slug)
  const query = getQuery(event)
  const limit = Math.min(50, Math.max(1, Number(query.limit) || 24))

  const client = await serverSupabaseClient(event)
  const { data, error } = await client
    .from('venues')
    .select('id,slug,title,description,address,lat,lng,cover_media_url,vibe_tags,rating_avg,editorial_quote,phone,instagram_url')
    .eq('city_id', city.id)
    .eq('is_published', true)
    .eq('is_active', true)
    .order('rating_avg', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('[venues/index] load failed:', error)
    return { ok: false, items: [] }
  }

  return { ok: true, items: data ?? [] }
})
