import { createError, defineEventHandler, setResponseHeader } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import { enrichEditorialBodyBlocks, enrichEditorialLinkedVenue } from '~/server/utils/editorialPublic'
import { resolveCityBySlug } from '~/server/utils/inuuCity'
import type { EditorialGalleryItem } from '~/utils/editorialTelegramGallery'
import {
  parseEditorialTelegramGalleryComment,
  stripEditorialTelegramGalleryComment,
} from '~/utils/editorialTelegramGallery'

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

  const bodyRaw = String(post.body || '')
  const postType = String((post as { post_type?: string }).post_type || '')
  const isAfishaDigest = postType === 'afisha_digest'
  const hasGalleryComment = bodyRaw.includes('inuu-telegram-gallery')

  const [{ blocks, placeEmbeds: bodyPlaceEmbeds }, mediaResult] = await Promise.all([
    enrichEditorialBodyBlocks(event, city.id, (post as any).body_json),
    isAfishaDigest
      ? client
          .from('editorial_post_media')
          .select('media_type,media_url,sort_order')
          .eq('post_id', post.id)
          .order('sort_order', { ascending: true })
      : Promise.resolve({ data: null, error: null }),
  ])

  let gallery: EditorialGalleryItem[] = []
  const mediaRows = mediaResult.data
  if (mediaRows?.length) {
    for (const row of mediaRows) {
      const type = (row as { media_type?: string }).media_type
      const url = String((row as { media_url?: string }).media_url || '').trim()
      if ((type !== 'photo' && type !== 'video') || !url) continue
      gallery.push({
        type,
        url,
        sort_order: typeof (row as { sort_order?: number }).sort_order === 'number'
          ? (row as { sort_order: number }).sort_order
          : undefined,
      })
    }
  } else if (hasGalleryComment) {
    gallery = parseEditorialTelegramGalleryComment(bodyRaw) ?? []
  }

  const body = hasGalleryComment ? stripEditorialTelegramGalleryComment(bodyRaw) : bodyRaw

  const placeEmbeds = await enrichEditorialLinkedVenue(
    event,
    city.id,
    (post as { linked_entity_type?: string }).linked_entity_type,
    (post as { linked_entity_id?: string }).linked_entity_id,
    bodyPlaceEmbeds,
  )

  return {
    ok: true,
    post: {
      ...post,
      body,
      body_json: blocks.length ? blocks : null,
      place_embeds: placeEmbeds,
      gallery,
    },
  }
})
