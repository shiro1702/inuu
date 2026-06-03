import { createError, defineEventHandler, setResponseHeader } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import { resolveCityBySlug } from '~/server/utils/inuuCity'

const EDITORIAL_POST_TYPES = ['review', 'venue_post', 'announcement']

export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'Cache-Control', 'public, max-age=60, s-maxage=120')
  const slug = typeof event.context.params?.slug === 'string' ? event.context.params.slug : ''
  const venueSlug = typeof event.context.params?.venueSlug === 'string' ? event.context.params.venueSlug : ''
  const city = await resolveCityBySlug(event, slug)

  const client = await serverSupabaseServiceRole(event)
  const { data: venue, error: venueError } = await client
    .from('venues')
    .select('id,slug,title')
    .eq('city_id', city.id)
    .eq('slug', venueSlug)
    .eq('is_published', true)
    .eq('is_active', true)
    .maybeSingle()

  if (venueError) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to load venue' })
  }
  if (!venue?.id) {
    throw createError({ statusCode: 404, statusMessage: 'Venue not found' })
  }

  const { data: linkedPosts, error: linkedError } = await client
    .from('editorial_posts')
    .select(
      'id,slug,title,excerpt,cover_media_url,video_url,post_type,published_at,topic_tags',
    )
    .eq('city_id', city.id)
    .eq('linked_entity_type', 'venue')
    .eq('linked_entity_id', venue.id)
    .eq('is_published', true)
    .in('post_type', EDITORIAL_POST_TYPES)
    .order('published_at', { ascending: false })
    .limit(12)

  if (linkedError) {
    console.error('[venues/editorial] linked load failed:', linkedError)
    throw createError({ statusCode: 500, statusMessage: 'Failed to load editorial posts' })
  }

  const { data: mentionCandidates, error: mentionError } = await client
    .from('editorial_posts')
    .select(
      'id,slug,title,excerpt,cover_media_url,video_url,post_type,published_at,topic_tags,body_json',
    )
    .eq('city_id', city.id)
    .eq('is_published', true)
    .not('body_json', 'is', null)
    .order('published_at', { ascending: false })
    .limit(40)

  if (mentionError) {
    console.error('[venues/editorial] mentions load failed:', mentionError)
  }

  const mentionPosts = (mentionCandidates ?? []).filter((row) => {
    const blocks = (row as any).body_json
    if (!Array.isArray(blocks)) return false
    return blocks.some(
      (b: { type?: string; venue_id?: string }) =>
        b?.type === 'place_embed' && String(b.venue_id) === String(venue.id),
    )
  }).map(({ body_json: _bj, ...rest }) => rest)

  const byId = new Map<string, Record<string, unknown>>()
  for (const row of [...(linkedPosts ?? []), ...(mentionPosts ?? [])]) {
    byId.set(String((row as any).id), row as Record<string, unknown>)
  }
  const items = [...byId.values()].sort((a, b) => {
    const ta = new Date(String(a.published_at || 0)).getTime()
    const tb = new Date(String(b.published_at || 0)).getTime()
    return tb - ta
  })

  return {
    ok: true,
    venue: { id: venue.id, slug: venue.slug, title: venue.title },
    items,
  }
})
