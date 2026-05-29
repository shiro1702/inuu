import { createError, type H3Event } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import type { EventParseResult } from '~/server/utils/ai/eventParseSchema'
import { slugifyTaxonomy } from '~/server/utils/cityContentTaxonomy'
import { resolveEventStartsAt } from '~/server/utils/eventStartsAt'

function slugifyTitle(input: string): string {
  return slugifyTaxonomy(input).slice(0, 80) || `item-${Date.now()}`
}

function parsePayload(raw: unknown): EventParseResult & Record<string, unknown> {
  return (raw && typeof raw === 'object' ? raw : {}) as EventParseResult & Record<string, unknown>
}

function isMissingEventsSourceColumnsError(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false
  if (error.code === 'PGRST204') return true
  const msg = String(error.message || '').toLowerCase()
  return msg.includes('source_channel') || msg.includes('source_metadata')
}

export type PublishSubmissionResult = {
  entityType: 'event' | 'editorial_post'
  entityId: string
  entitySlug: string
  alreadyPublished: boolean
}

export async function publishContentSubmission(
  event: H3Event,
  submissionId: string,
): Promise<PublishSubmissionResult> {
  const client = await serverSupabaseServiceRole(event)
  const { data: submission, error } = await client
    .from('content_submissions')
    .select('id,city_id,kind,status,payload,source_kind,source_url,editorial_score,published_entity_type,published_entity_id')
    .eq('id', submissionId)
    .maybeSingle()

  if (error || !submission?.id) {
    throw createError({ statusCode: 404, statusMessage: 'Submission not found' })
  }

  const publishedId = (submission as any).published_entity_id
  const publishedType = (submission as any).published_entity_type
  if (publishedId && publishedType) {
    const table = publishedType === 'editorial_post' ? 'editorial_posts' : 'events'
    const { data: existing } = await client
      .from(table)
      .select('id,slug')
      .eq('id', publishedId)
      .maybeSingle()
    if (existing?.id) {
      return {
        entityType: publishedType === 'editorial_post' ? 'editorial_post' : 'event',
        entityId: String(existing.id),
        entitySlug: String((existing as any).slug || ''),
        alreadyPublished: true,
      }
    }
  }

  const payload = parsePayload((submission as any).payload)
  const cityId = String((submission as any).city_id)
  const eventKind = String(payload.event_kind || (submission as any).kind || 'event')

  const { data: city } = await client
    .from('cities')
    .select('id,slug,timezone')
    .eq('id', cityId)
    .maybeSingle()

  const { data: editorialShop } = await client
    .from('shops')
    .select('id')
    .eq('city_id', cityId)
    .eq('slug', 'inuu-editorial')
    .maybeSingle()

  const shopId = (editorialShop as any)?.id ? String((editorialShop as any).id) : null
  const title = String(payload.title || '').trim()
  const description = String(payload.description || '').trim()
  if (title.length < 3) {
    throw createError({ statusCode: 400, statusMessage: 'Submission title is too short to publish' })
  }

  if (eventKind === 'news') {
    const postSlug = `${slugifyTitle(title)}-${String(submission.id).slice(0, 8)}`
    const topicTags = Array.isArray(payload.topic_tags) ? payload.topic_tags : []
    const { data: post, error: postError } = await client
      .from('editorial_posts')
      .insert({
        city_id: cityId,
        shop_id: shopId,
        slug: postSlug,
        title,
        body: description.length >= 20 ? description : `${description}\n\n${title}`,
        excerpt: description.slice(0, 280) || null,
        topic_tags: topicTags,
        category_slug: payload.category_slug || null,
        is_published: true,
        published_at: new Date().toISOString(),
      } as any)
      .select('id,slug')
      .maybeSingle()

    if (postError || !post?.id) {
      throw createError({
        statusCode: 500,
        statusMessage: postError?.message || 'Failed to publish editorial post',
      })
    }

    await client
      .from('content_submissions')
      .update({
        status: 'approved',
        published_entity_type: 'editorial_post',
        published_entity_id: post.id,
        updated_at: new Date().toISOString(),
      } as any)
      .eq('id', submissionId)

    return {
      entityType: 'editorial_post',
      entityId: String(post.id),
      entitySlug: String((post as any).slug),
      alreadyPublished: false,
    }
  }

  let categoryId: string | null = null
  if (payload.category_slug) {
    const { data: category } = await client
      .from('event_categories')
      .select('id')
      .eq('city_id', cityId)
      .eq('slug', payload.category_slug)
      .maybeSingle()
    categoryId = category?.id ? String(category.id) : null
  }

  const cityTimezone = String((city as any)?.timezone || 'Asia/Irkutsk')
  const startsAt = resolveEventStartsAt(payload, cityTimezone)
  const eventSlug = `${slugifyTitle(title)}-${String(submission.id).slice(0, 8)}`
  const priceRub = payload.is_free
    ? 0
    : Math.max(0, Math.round(Number(payload.price_from || 0)))

  const eventCore = {
    city_id: cityId,
    shop_id: shopId,
    category_id: categoryId,
    slug: eventSlug,
    title,
    description: description || title,
    starts_at: startsAt,
    ends_at: null,
    capacity: typeof payload.capacity === 'number' ? payload.capacity : null,
    price: priceRub,
    currency: 'RUB',
    cover_media_url: null,
    is_promoted: typeof (submission as any).editorial_score === 'number'
      && (submission as any).editorial_score >= 4,
    is_published: true,
  }

  const eventWithSource = {
    ...eventCore,
    source_channel: (submission as any).source_kind || payload.source?.kind || 'manual_editor',
    source_metadata: {
      content_submission_id: submission.id,
      source_url: (submission as any).source_url || payload.source?.url || null,
      topic_tags: payload.topic_tags || [],
      registration_url: payload.registration_url || null,
      city_slug: (city as any)?.slug || payload.city_slug || null,
    },
  }

  let createdEvent: { id: string; slug: string; starts_at?: string } | null = null
  let eventError: { code?: string; message?: string } | null = null

  const fullInsert = await client
    .from('events')
    .insert(eventWithSource as any)
    .select('id,slug,starts_at')
    .maybeSingle()
  createdEvent = fullInsert.data as typeof createdEvent
  eventError = fullInsert.error

  if (eventError && isMissingEventsSourceColumnsError(eventError)) {
    const coreInsert = await client
      .from('events')
      .insert(eventCore as any)
      .select('id,slug,starts_at')
      .maybeSingle()
    createdEvent = coreInsert.data as typeof createdEvent
    eventError = coreInsert.error
  }

  if (eventError || !createdEvent?.id) {
    throw createError({
      statusCode: 500,
      statusMessage: eventError?.message || 'Failed to publish event',
    })
  }

  await client
    .from('content_submissions')
    .update({
      status: 'approved',
      published_entity_type: 'event',
      published_entity_id: createdEvent.id,
      updated_at: new Date().toISOString(),
    } as any)
    .eq('id', submissionId)

  return {
    entityType: 'event',
    entityId: String(createdEvent.id),
    entitySlug: String((createdEvent as any).slug),
    alreadyPublished: false,
  }
}
