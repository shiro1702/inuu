import { createError, defineEventHandler, setResponseHeader } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import { enrichEditorialBodyBlocks } from '~/server/utils/editorialPublic'
import { resolveCityBySlug } from '~/server/utils/inuuCity'

export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'Cache-Control', 'public, max-age=60, s-maxage=120')

  const slug = typeof event.context.params?.slug === 'string' ? event.context.params.slug : ''
  const postSlug = typeof event.context.params?.postSlug === 'string' ? event.context.params.postSlug : ''
  if (!postSlug) {
    throw createError({ statusCode: 400, statusMessage: 'Post slug is required' })
  }

  const city = await resolveCityBySlug(event, slug)
  const client = await serverSupabaseServiceRole(event)

  const { data: post, error } = await client
    .from('editorial_posts')
    .select(
      'id,slug,title,excerpt,body,body_json,cover_media_url,video_url,media_urls,post_type,published_at,topic_tags,is_sponsored,read_later_count,linked_entity_type,linked_entity_id',
    )
    .eq('city_id', city.id)
    .eq('slug', postSlug)
    .eq('is_published', true)
    .maybeSingle()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to load editorial post' })
  }
  if (!post?.id) {
    throw createError({ statusCode: 404, statusMessage: 'Editorial post not found' })
  }

  const { blocks, placeEmbeds } = await enrichEditorialBodyBlocks(event, city.id, (post as any).body_json)

  return {
    ok: true,
    post: {
      ...post,
      body_json: blocks.length ? blocks : null,
      place_embeds: placeEmbeds,
    },
  }
})
