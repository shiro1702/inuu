import { createError, type H3Event } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import type { EventParseResult } from '~/server/utils/ai/eventParseSchema'
import { slugifyTaxonomy } from '~/server/utils/cityContentTaxonomy'
import { listEventStartsAtFromPayload } from '~/server/utils/eventStartsAt'
import { resolveSubmissionDescriptions } from '~/server/utils/eventParseDescriptions'
import {
  buildEventSeriesSlug,
  buildEventSessionSlug,
  isMissingEventsExcerptColumnError,
  isMissingEventsSeriesSlugColumnError,
} from '~/server/utils/eventSeries'

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
  publishedEventCount?: number
  seriesSlug?: string | null
}

function stripEventRowFields(
  row: Record<string, unknown>,
  fields: Array<'source_channel' | 'source_metadata' | 'series_slug' | 'excerpt'>,
): Record<string, unknown> {
  const next = { ...row }
  for (const field of fields) delete next[field]
  return next
}

async function insertEventRow(args: {
  client: Awaited<ReturnType<typeof serverSupabaseServiceRole>>
  row: Record<string, unknown>
}): Promise<{ id: string; slug: string; starts_at?: string }> {
  const variants: Record<string, unknown>[] = [args.row]
  variants.push(stripEventRowFields(args.row, ['source_channel', 'source_metadata']))
  variants.push(stripEventRowFields(args.row, ['series_slug']))
  variants.push(stripEventRowFields(args.row, ['excerpt']))
  variants.push(stripEventRowFields(args.row, ['source_channel', 'source_metadata', 'series_slug', 'excerpt']))

  let lastError: { message?: string } | null = null
  for (const row of variants) {
    const attempt = await args.client
      .from('events')
      .insert(row as any)
      .select('id,slug,starts_at')
      .maybeSingle()

    if (!attempt.error && attempt.data?.id) {
      return attempt.data as { id: string; slug: string; starts_at?: string }
    }

    lastError = attempt.error
    const retryable = isMissingEventsSourceColumnsError(attempt.error)
      || isMissingEventsSeriesSlugColumnError(attempt.error)
      || isMissingEventsExcerptColumnError(attempt.error)
    if (!retryable) break
  }

  throw createError({
    statusCode: 500,
    statusMessage: lastError?.message || 'Failed to publish event',
  })
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

  if ((submission as any).batch_role === 'batch') {
    throw createError({ statusCode: 400, statusMessage: 'Cannot publish batch parent directly — use digest approve or publish items' })
  }

  const publishedId = (submission as any).published_entity_id
  const publishedType = (submission as any).published_entity_type
  if (publishedId && publishedType) {
    const table = publishedType === 'editorial_post' ? 'editorial_posts' : 'events'
    const { data: existing } = await client
      .from(table)
      .select('id,slug,series_slug')
      .eq('id', publishedId)
      .maybeSingle()
    if (existing?.id) {
      return {
        entityType: publishedType === 'editorial_post' ? 'editorial_post' : 'event',
        entityId: String(existing.id),
        entitySlug: String((existing as any).slug || ''),
        alreadyPublished: true,
        seriesSlug: (existing as any).series_slug || null,
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

  const editorialShopId = (editorialShop as any)?.id ? String((editorialShop as any).id) : null
  const payloadOrgId =
    payload.organization && typeof payload.organization === 'object' && (payload.organization as { id?: unknown }).id
      ? String((payload.organization as { id: unknown }).id).trim()
      : ''
  const shopId = payloadOrgId || editorialShopId
  const title = String(payload.title || '').trim()
  const { descriptionShort, descriptionFull } = resolveSubmissionDescriptions(payload)
  if (title.length < 3) {
    throw createError({ statusCode: 400, statusMessage: 'Submission title is too short to publish' })
  }
  if (descriptionFull.length < 10) {
    throw createError({ statusCode: 400, statusMessage: 'Submission description is too short to publish' })
  }

  const coverMediaUrl = typeof payload.cover_media_url === 'string'
    ? payload.cover_media_url.trim() || null
    : null

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
        body: descriptionFull.length >= 20 ? descriptionFull : `${descriptionFull}\n\n${title}`,
        excerpt: descriptionShort.slice(0, 280) || null,
        cover_media_url: coverMediaUrl,
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
  const startsAtList = listEventStartsAtFromPayload(payload, cityTimezone)
  const seriesSlug = buildEventSeriesSlug(title, payload.venue?.name)
  const priceRub = payload.is_free
    ? 0
    : Math.max(0, Math.round(Number(payload.price_from || 0)))

  const mediaUrls = [
    ...(coverMediaUrl ? [coverMediaUrl] : []),
    ...(Array.isArray((payload as any).media_urls)
      ? (payload as any).media_urls.map((x: unknown) => String(x || '').trim()).filter(Boolean)
      : []),
  ].filter((url, i, arr) => arr.indexOf(url) === i)

  const sourceMeta = {
    content_submission_id: submission.id,
    source_url: (submission as any).source_url || payload.source?.url || null,
    topic_tags: payload.topic_tags || [],
    registration_url: payload.registration_url || null,
    organization_name: payload.organization?.name || null,
    media_urls: mediaUrls,
    city_slug: (city as any)?.slug || payload.city_slug || null,
    series_dates_count: startsAtList.length,
  }

  const createdEvents: Array<{ id: string; slug: string; starts_at?: string }> = []

  for (const startsAt of startsAtList) {
    let eventSlug = buildEventSessionSlug(seriesSlug, startsAt)
    const eventCore = {
      city_id: cityId,
      shop_id: shopId,
      category_id: categoryId,
      slug: eventSlug,
      title,
      description: descriptionFull || title,
      excerpt: descriptionShort || null,
      starts_at: startsAt,
      ends_at: null,
      capacity: typeof payload.capacity === 'number' ? payload.capacity : null,
      price: priceRub,
      currency: 'RUB',
      cover_media_url: coverMediaUrl,
      is_promoted: typeof (submission as any).editorial_score === 'number'
        && (submission as any).editorial_score >= 4,
      is_published: true,
      series_slug: seriesSlug,
      source_channel: (submission as any).source_kind || payload.source?.kind || 'manual_editor',
      source_metadata: sourceMeta,
    }

    let created: { id: string; slug: string; starts_at?: string }
    try {
      created = await insertEventRow({ client, row: eventCore })
    } catch (err: any) {
      const msg = String(err?.statusMessage || err?.message || '').toLowerCase()
      if (msg.includes('duplicate') || msg.includes('unique')) {
        eventSlug = `${eventSlug}-${String(submission.id).slice(0, 6)}`
        created = await insertEventRow({
          client,
          row: { ...eventCore, slug: eventSlug },
        })
      } else {
        throw err
      }
    }
    createdEvents.push(created)
  }

  if (!createdEvents.length) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to publish event' })
  }

  const primary = createdEvents[0]

  await client
    .from('content_submissions')
    .update({
      status: 'approved',
      published_entity_type: 'event',
      published_entity_id: primary.id,
      updated_at: new Date().toISOString(),
    } as any)
    .eq('id', submissionId)

  return {
    entityType: 'event',
    entityId: String(primary.id),
    entitySlug: String(primary.slug),
    alreadyPublished: false,
    publishedEventCount: createdEvents.length,
    seriesSlug,
  }
}
