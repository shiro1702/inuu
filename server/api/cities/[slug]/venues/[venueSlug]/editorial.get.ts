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

  const { data: posts, error: postsError } = await client
    .from('editorial_posts')
    .select(
      'id,slug,title,excerpt,body,cover_media_url,video_url,media_urls,post_type,published_at,topic_tags',
    )
    .eq('city_id', city.id)
    .eq('linked_entity_type', 'venue')
    .eq('linked_entity_id', venue.id)
    .eq('is_published', true)
    .in('post_type', EDITORIAL_POST_TYPES)
    .order('published_at', { ascending: false })
    .limit(12)

  if (postsError) {
    console.error('[venues/editorial] load failed:', postsError)
    throw createError({ statusCode: 500, statusMessage: 'Failed to load editorial posts' })
  }

  return {
    ok: true,
    venue: { id: venue.id, slug: venue.slug, title: venue.title },
    items: posts ?? [],
  }
})
