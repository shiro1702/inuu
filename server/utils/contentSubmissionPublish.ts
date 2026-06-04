import { createError, type H3Event } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import type { EventParseResult } from '~/server/utils/ai/eventParseSchema'
import {
  editorialPostTypeFromPayload,
  isEditorialPayload,
  type EditorialParseResult,
} from '~/server/utils/ai/editorialParseSchema'
import { editorialMissingOrg, findVenueInCity } from '~/server/utils/editorialOrgResolve'
import { slugifyTaxonomy } from '~/server/utils/cityContentTaxonomy'
import { listEventStartsAtFromPayload } from '~/server/utils/eventStartsAt'
import { resolveSubmissionDescriptions } from '~/server/utils/eventParseDescriptions'
import {
  buildEventSeriesSlug,
  buildEventSessionSlug,
  isMissingEventsExcerptColumnError,
  isMissingEventsSeriesSlugColumnError,
} from '~/server/utils/eventSeries'
import { resolveIngestSourceOrganization } from '~/server/utils/ingestSourceContext'
import { findShopIdByParsedSourceUrl } from '~/server/utils/resolvePublicOrganization'
import { buildEditorialBodyJson } from '~/server/utils/editorialBodyJson'
import {
  createEditorialStoryPendingCampaign,
  createEditorialStoryTeaser,
} from '~/server/utils/editorialStoryTeaser'
import { buildStorySlidesFromEditorial } from '~/server/utils/buildStorySlidesFromEditorial'
import { createStoryCampaign, slidesFromEditorialStory } from '~/server/utils/storyCampaignWrite'
import { resolveIngestCoverMediaUrl } from '~/server/utils/contentCoverMedia'
import {
  eventStatusFromIngest,
  isMissingEventsStatusColumnError,
  normalizeUpdateKind,
} from '~/server/utils/eventLifecycleStatus'
import type { IngestPostType } from '~/server/utils/ai/eventParseSchema'
import { notifyEventPublished } from '~/server/utils/cityTopicBroadcast'
import {
  mergeEditorialPostMetadata,
  resolveCarouselFromPayload,
} from '~/server/utils/parseInstagramCarousel'

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

function isMissingEventsTldrColumnError(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false
  if (error.code === 'PGRST204') return true
  const msg = String(error.message || '').toLowerCase()
  return msg.includes('tldr') || msg.includes('vibe_emoji')
}

export type PublishSubmissionResult = {
  entityType: 'event' | 'editorial_post' | 'story_campaign'
  entityId: string
  entitySlug: string
  alreadyPublished: boolean
  publishedEventCount?: number
  seriesSlug?: string | null
  storyCampaignId?: string | null
  storyStudioPath?: string | null
}

export type PublishContentSubmissionOptions = {
  /** Create story campaign with slide_draft for dashboard PNG render (wave 3d). */
  storyVisuals?: boolean
}

async function resolveSubmissionShopId(
  event: H3Event,
  args: {
    client: Awaited<ReturnType<typeof serverSupabaseServiceRole>>
    cityId: string
    citySlug: string
    payload: EventParseResult & Record<string, unknown>
    submission: Record<string, unknown>
    editorialShopId: string | null
  },
): Promise<string | null> {
  const payloadOrgId =
    args.payload.organization && typeof args.payload.organization === 'object'
    && (args.payload.organization as { id?: unknown }).id
      ? String((args.payload.organization as { id: unknown }).id).trim()
      : ''

  let shopId = payloadOrgId || args.editorialShopId
  if (!payloadOrgId) {
    const publishSourceUrl =
      String(args.submission.source_url || args.payload.source?.url || '').trim() || null
    const publishSourceKind =
      String(args.submission.source_kind || args.payload.source?.kind || '').trim() || null

    if (args.citySlug && publishSourceUrl) {
      const linked = await resolveIngestSourceOrganization(event, {
        citySlug: args.citySlug,
        sourceUrl: publishSourceUrl,
        sourceKind: publishSourceKind,
      })
      if (linked?.organizationId) {
        shopId = linked.organizationId
      } else {
        const shadowShopId = await findShopIdByParsedSourceUrl(args.client, args.cityId, publishSourceUrl)
        if (shadowShopId) shopId = shadowShopId
      }
    }
  }
  return shopId
}

async function publishEditorialFromPayload(
  event: H3Event,
  args: {
    client: Awaited<ReturnType<typeof serverSupabaseServiceRole>>
    submissionId: string
    cityId: string
    shopId: string | null
    payload: EditorialParseResult
    submission: Record<string, unknown>
    storyVisuals?: boolean
  },
): Promise<PublishSubmissionResult> {
  if (editorialMissingOrg(args.payload)) {
    throw createError({ statusCode: 400, statusMessage: 'Organization is required to publish editorial content' })
  }

  const title = String(args.payload.title || '').trim()
  const descriptionFull = String(args.payload.description_full || args.payload.description_short || '').trim()
  const descriptionShort = String(args.payload.description_short || descriptionFull).slice(0, 280)

  if (title.length < 3) {
    throw createError({ statusCode: 400, statusMessage: 'Submission title is too short to publish' })
  }
  if (descriptionFull.length < 10) {
    throw createError({ statusCode: 400, statusMessage: 'Submission description is too short to publish' })
  }

  const venue = await findVenueInCity(event, {
    cityId: args.cityId,
    venueName: args.payload.venue?.name || null,
    venueId: args.payload.venue?.id || null,
  })

  const mediaUrls = [
    ...(args.payload.cover_media_url ? [args.payload.cover_media_url] : []),
    ...(Array.isArray(args.payload.media_urls) ? args.payload.media_urls : []),
  ].filter((url, i, arr) => arr.indexOf(url) === i)

  const postSlug = `${slugifyTitle(title)}-${String(args.submissionId).slice(0, 8)}`
  const postType = editorialPostTypeFromPayload(args.payload)
  const bodyJson = buildEditorialBodyJson({
    descriptionFull,
    venueId: venue?.id || null,
    coverUrl: args.payload.cover_media_url || null,
    mediaUrls,
    existingBodyJson: (args.payload as { body_json?: unknown }).body_json,
  })

  const carouselMeta = resolveCarouselFromPayload(
    args.payload as unknown as Record<string, unknown>,
  )
  const metadata = mergeEditorialPostMetadata(null, carouselMeta)

  const { data: post, error: postError } = await args.client
    .from('editorial_posts')
    .insert({
      city_id: args.cityId,
      shop_id: args.shopId,
      slug: postSlug,
      title,
      body: descriptionFull,
      body_json: bodyJson,
      excerpt: descriptionShort || null,
      cover_media_url: args.payload.cover_media_url || null,
      video_url: args.payload.video_url || null,
      media_urls: mediaUrls,
      post_type: postType,
      topic_tags: args.payload.topic_tags || [],
      publication_date: args.payload.publication_date || null,
      linked_entity_type: venue?.id ? 'venue' : null,
      linked_entity_id: venue?.id || null,
      metadata,
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

  let citySlug = String((args.payload as { city_slug?: string }).city_slug || '').trim()
  if (!citySlug) {
    const { data: cityRow } = await args.client.from('cities').select('slug').eq('id', args.cityId).maybeSingle()
    citySlug = String((cityRow as any)?.slug || '').trim()
  }
  let storyCampaignId: string | null = null
  let storyStudioPath: string | null = null

  if (args.shopId && citySlug) {
    try {
      if (args.storyVisuals) {
        const slideDraft = buildStorySlidesFromEditorial(args.payload)
        const pending = await createEditorialStoryPendingCampaign(event, {
          cityId: args.cityId,
          citySlug,
          shopId: args.shopId,
          postSlug: String((post as any).slug),
          title,
          previewUrl: args.payload.cover_media_url || null,
          excerpt: descriptionShort,
          slideDraft,
        })
        storyCampaignId = pending.campaignId
        storyStudioPath = `/dashboard/story-studio?city=${encodeURIComponent(citySlug)}&campaign=${pending.campaignId}`
      } else {
        await createEditorialStoryTeaser(event, {
          cityId: args.cityId,
          citySlug,
          shopId: args.shopId,
          postSlug: String((post as any).slug),
          title,
          previewUrl: args.payload.cover_media_url || null,
          excerpt: descriptionShort,
        })
      }
    } catch (err) {
      console.warn('[publishEditorial] story teaser failed:', err)
    }
  }

  await args.client
    .from('content_submissions')
    .update({
      status: 'approved',
      published_entity_type: 'editorial_post',
      published_entity_id: post.id,
      updated_at: new Date().toISOString(),
    } as any)
    .eq('id', args.submissionId)

  return {
    entityType: 'editorial_post',
    entityId: String(post.id),
    entitySlug: String((post as any).slug),
    alreadyPublished: false,
    storyCampaignId,
    storyStudioPath,
  }
}

async function publishStoryFromPayload(
  event: H3Event,
  args: {
    client: Awaited<ReturnType<typeof serverSupabaseServiceRole>>
    submissionId: string
    cityId: string
    shopId: string | null
    payload: EditorialParseResult
  },
): Promise<PublishSubmissionResult> {
  if (!args.shopId) {
    throw createError({ statusCode: 400, statusMessage: 'Organization is required to publish story' })
  }
  if (editorialMissingOrg(args.payload)) {
    throw createError({ statusCode: 400, statusMessage: 'Organization is required to publish story' })
  }

  const title = String(args.payload.story?.title || args.payload.title || '').trim()
  const fallbackUrls = [
    ...(args.payload.cover_media_url ? [args.payload.cover_media_url] : []),
    ...(args.payload.video_url ? [args.payload.video_url] : []),
    ...(Array.isArray(args.payload.media_urls) ? args.payload.media_urls : []),
  ].filter(Boolean)

  const slides = slidesFromEditorialStory(args.payload.story?.slides || [], fallbackUrls)
  if (!slides.length) {
    throw createError({ statusCode: 400, statusMessage: 'Story needs at least one slide with media' })
  }

  const { campaignId } = await createStoryCampaign(event, {
    cityId: args.cityId,
    shopId: args.shopId,
    title,
    previewUrl: args.payload.cover_media_url || slides[0]?.mediaUrl || null,
    placement: 'top_bar',
    isActive: true,
    validFrom: new Date().toISOString(),
    validUntil: null,
    authorType: 'organization',
    slides,
  })

  await args.client
    .from('content_submissions')
    .update({
      status: 'approved',
      published_entity_type: 'story_campaign',
      published_entity_id: campaignId,
      updated_at: new Date().toISOString(),
    } as any)
    .eq('id', args.submissionId)

  return {
    entityType: 'story_campaign',
    entityId: campaignId,
    entitySlug: campaignId,
    alreadyPublished: false,
  }
}

function stripEventRowFields(
  row: Record<string, unknown>,
  fields: Array<'source_channel' | 'source_metadata' | 'series_slug' | 'excerpt'>,
): Record<string, unknown> {
  const next = { ...row }
  for (const field of fields) delete next[field]
  return next
}

async function publishLifecycleStatusUpdate(args: {
  client: Awaited<ReturnType<typeof serverSupabaseServiceRole>>
  submissionId: string
  cityId: string
  cityTimezone: string
  payload: EventParseResult & Record<string, unknown>
  ingestPostType: IngestPostType
}): Promise<PublishSubmissionResult> {
  const linkedEventId = String((args.payload as any).linked_event_id || '').trim()
  if (!linkedEventId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Привяжите событие в карточке модерации перед публикацией отмены/переноса',
    })
  }

  const updateKind = normalizeUpdateKind((args.payload as any).ingest_update_kind)
  const nextStatus = eventStatusFromIngest(args.ingestPostType, updateKind)
  const nowIso = new Date().toISOString()

  const patch: Record<string, unknown> = {
    event_status: nextStatus,
    status_updated_at: nowIso,
    status_note: String(args.payload.title || '').trim().slice(0, 280) || null,
    updated_at: nowIso,
  }

  const startsAtList = listEventStartsAtFromPayload(args.payload, args.cityTimezone)
  if (args.ingestPostType === 'update' && updateKind === 'reschedule' && startsAtList[0]) {
    patch.starts_at = startsAtList[0]
  }

  let updateResult = await args.client
    .from('events')
    .update(patch as any)
    .eq('id', linkedEventId)
    .eq('city_id', args.cityId)
    .select('id,slug,series_slug')
    .maybeSingle()

  if (updateResult.error && isMissingEventsStatusColumnError(updateResult.error)) {
    const { starts_at, event_status, status_updated_at, status_note, ...legacy } = patch
    updateResult = await args.client
      .from('events')
      .update(legacy as any)
      .eq('id', linkedEventId)
      .eq('city_id', args.cityId)
      .select('id,slug,series_slug')
      .maybeSingle()
  }

  if (updateResult.error || !updateResult.data?.id) {
    throw createError({
      statusCode: 500,
      statusMessage: updateResult.error?.message || 'Failed to update event status',
    })
  }

  await args.client
    .from('content_submissions')
    .update({
      status: 'approved',
      published_entity_type: 'event',
      published_entity_id: linkedEventId,
      updated_at: nowIso,
    } as any)
    .eq('id', args.submissionId)

  return {
    entityType: 'event',
    entityId: String(updateResult.data.id),
    entitySlug: String((updateResult.data as any).slug || ''),
    alreadyPublished: false,
    seriesSlug: (updateResult.data as any).series_slug || null,
  }
}

async function insertEventRow(args: {
  client: Awaited<ReturnType<typeof serverSupabaseServiceRole>>
  row: Record<string, unknown>
}): Promise<{ id: string; slug: string; starts_at?: string }> {
  const variants: Record<string, unknown>[] = [args.row]
  variants.push(stripEventRowFields(args.row, ['source_channel', 'source_metadata']))
  variants.push(stripEventRowFields(args.row, ['series_slug']))
  variants.push(stripEventRowFields(args.row, ['excerpt']))
  variants.push(stripEventRowFields(args.row, ['tldr', 'vibe_emoji']))
  variants.push(stripEventRowFields(args.row, ['source_channel', 'source_metadata', 'series_slug', 'excerpt']))
  variants.push(stripEventRowFields(args.row, ['source_channel', 'source_metadata', 'series_slug', 'excerpt', 'tldr', 'vibe_emoji']))

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
      || isMissingEventsTldrColumnError(attempt.error)
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
  options?: PublishContentSubmissionOptions,
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
    const table =
      publishedType === 'editorial_post'
        ? 'editorial_posts'
        : publishedType === 'story_campaign'
          ? 'story_campaigns'
          : 'events'
    const { data: existing } = await client
      .from(table)
      .select('id,slug,series_slug,title')
      .eq('id', publishedId)
      .maybeSingle()
    if (existing?.id) {
      const entityType =
        publishedType === 'editorial_post'
          ? 'editorial_post'
          : publishedType === 'story_campaign'
            ? 'story_campaign'
            : 'event'
      return {
        entityType,
        entityId: String(existing.id),
        entitySlug: String((existing as any).slug || (existing as any).id || ''),
        alreadyPublished: true,
        seriesSlug: (existing as any).series_slug || null,
      }
    }
  }

  const rawPayload = (submission as any).payload
  const cityId = String((submission as any).city_id)
  const submissionKind = String((submission as any).kind || 'event')

  const { data: city } = await client
    .from('cities')
    .select('id,slug,timezone')
    .eq('id', cityId)
    .maybeSingle()

  const citySlug = String((city as any)?.slug || '').trim()

  const { data: editorialShop } = await client
    .from('shops')
    .select('id')
    .eq('city_id', cityId)
    .eq('slug', 'inuu-editorial')
    .maybeSingle()

  const editorialShopId = (editorialShop as any)?.id ? String((editorialShop as any).id) : null

  if (isEditorialPayload(rawPayload)) {
    const editorialPayload = rawPayload as EditorialParseResult
    const shopId = await resolveSubmissionShopId(event, {
      client,
      cityId,
      citySlug,
      payload: editorialPayload as unknown as EventParseResult & Record<string, unknown>,
      submission: submission as Record<string, unknown>,
      editorialShopId,
    })

    if (submissionKind === 'story' || editorialPayload.content_type === 'story') {
      return publishStoryFromPayload(event, {
        client,
        submissionId,
        cityId,
        shopId,
        payload: editorialPayload,
      })
    }

    if (
      submissionKind === 'venue_review'
      || submissionKind === 'venue_post'
      || submissionKind === 'news'
      || ['venue_review', 'venue_post', 'news'].includes(editorialPayload.content_type)
    ) {
      return publishEditorialFromPayload(event, {
        client,
        submissionId,
        cityId,
        shopId,
        payload: editorialPayload,
        submission: submission as Record<string, unknown>,
        storyVisuals: options?.storyVisuals === true,
      })
    }
  }

  const payload = parsePayload(rawPayload)
  const eventKind = String(payload.event_kind || submissionKind || 'event')

  const shopId = await resolveSubmissionShopId(event, {
    client,
    cityId,
    citySlug,
    payload,
    submission: submission as Record<string, unknown>,
    editorialShopId,
  })

  const title = String(payload.title || '').trim()
  const { descriptionShort, descriptionFull } = resolveSubmissionDescriptions(payload)
  if (title.length < 3) {
    throw createError({ statusCode: 400, statusMessage: 'Submission title is too short to publish' })
  }
  if (descriptionFull.length < 10) {
    throw createError({ statusCode: 400, statusMessage: 'Submission description is too short to publish' })
  }

  let coverMediaUrl = typeof payload.cover_media_url === 'string'
    ? payload.cover_media_url.trim() || null
    : null

  if (coverMediaUrl && !coverMediaUrl.includes('/storage/v1/object/public/organization-media/')) {
    const mirrored = await resolveIngestCoverMediaUrl(event, {
      sourceUrl: coverMediaUrl,
      cityId,
      key: `publish-${String(submission.id).slice(0, 8)}`,
    }).catch(() => null)
    if (mirrored?.stored && mirrored.url) {
      coverMediaUrl = mirrored.url
    }
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

  const ingestPostType = String((payload as any).ingest_post_type || '').trim() || 'new_event'
  if (ingestPostType === 'cancellation' || ingestPostType === 'update') {
    return publishLifecycleStatusUpdate({
      client,
      submissionId,
      cityId,
      cityTimezone: String((city as any)?.timezone || 'Asia/Irkutsk'),
      payload,
      ingestPostType: ingestPostType as IngestPostType,
    })
  }

  const sourceMeta = {
    content_submission_id: submission.id,
    source_url: (submission as any).source_url || payload.source?.url || null,
    ingest_post_type: ingestPostType,
    ingest_publication_date: (payload as any).ingest_publication_date || null,
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
      tldr: typeof (payload as any).tldr === 'string' ? String((payload as any).tldr).trim().slice(0, 320) || null : null,
      vibe_emoji:
        typeof (payload as any).vibe_emoji === 'string'
          ? String((payload as any).vibe_emoji).trim().slice(0, 24) || null
          : null,
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

  const topicTags = Array.isArray(payload.topic_tags)
    ? payload.topic_tags.map((x) => String(x || '').trim()).filter(Boolean)
    : []

  void notifyEventPublished(event, {
    cityId,
    citySlug,
    cityTimezone: String((city as any)?.timezone || 'Asia/Irkutsk'),
    eventId: String(primary.id),
    eventSlug: String(primary.slug),
    eventTitle: title,
    startsAt: primary.starts_at || startsAtList[0] || null,
    topicTags,
  }).catch((err) => console.error('[contentSubmissionPublish] event publish notify:', err))

  return {
    entityType: 'event',
    entityId: String(primary.id),
    entitySlug: String(primary.slug),
    alreadyPublished: false,
    publishedEventCount: createdEvents.length,
    seriesSlug,
  }
}
