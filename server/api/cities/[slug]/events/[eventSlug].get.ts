import { createError, defineEventHandler, setResponseHeader } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import { resolveCityBySlug } from '~/server/utils/inuuCity'
import { enrichEventsForStorefront } from '~/server/utils/enrichEventsForStorefront'
import { resolvePublicEventOrganization } from '~/server/utils/resolvePublicOrganization'
import {
  buildEventMediaGallery,
  loadSimilarPublishedEvents,
  parseSourceMetadata,
  resolveCityTagLabels,
  resolveEventDisplayLinks,
  type PublicEventSession,
} from '~/server/utils/eventPublicDetail'
import { shouldHideEventCta } from '~/utils/eventLifecycleDisplay'

const OPTIONAL_ORGANIZATION_TIMEOUT_MS = 350

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, fallback: T): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | null = null
  try {
    return await Promise.race([
      promise,
      new Promise<T>((resolve) => {
        timer = setTimeout(() => resolve(fallback), timeoutMs)
      }),
    ])
  } finally {
    if (timer) clearTimeout(timer)
  }
}

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

  const meta = parseSourceMetadata((data as any).source_metadata)
  const topicTags = meta.topic_tags || []
  const categoryId = (data as any).category_id ? String((data as any).category_id) : null

  const mediaGallery = buildEventMediaGallery(data as any)
  const shopId = (data as any).shop_id ? String((data as any).shop_id) : null
  const seriesSlug = (data as any).series_slug
  const displayLinks = resolveEventDisplayLinks(data as any)

  const tagsPromise = resolveCityTagLabels(client, city.id, topicTags)
  const categoryPromise = categoryId
    ? client
      .from('event_categories')
      .select('slug,name')
      .eq('id', categoryId)
      .maybeSingle()
      .then(({ data: cat }) => (cat?.slug ? { slug: String(cat.slug), name: String(cat.name) } : null))
    : Promise.resolve(null)
  const seriesSessionsPromise = seriesSlug
    ? client
      .from('events')
      .select('slug,starts_at')
      .eq('city_id', city.id)
      .eq('series_slug', seriesSlug)
      .eq('is_published', true)
      .gte('starts_at', new Date().toISOString())
      .order('starts_at', { ascending: true })
      .then(({ data: siblings }) => (siblings ?? []).map((row: any) => ({
        slug: String(row.slug),
        starts_at: String(row.starts_at),
        isCurrent: String(row.slug) === eventSlug,
      })))
    : Promise.resolve([] as PublicEventSession[])
  const similarEventsPromise = loadSimilarPublishedEvents(client, {
    cityId: city.id,
    excludeSlug: eventSlug,
    topicTags,
    categoryId,
    shopId,
    limit: 6,
  })
  const organizationPromise = withTimeout(
    resolvePublicEventOrganization({
      client,
      event,
      cityId: city.id,
      citySlug: slug,
      shopId,
      sourceMetadata: (data as any).source_metadata,
      sourceChannel: (data as any).source_channel,
    }).catch(() => null),
    OPTIONAL_ORGANIZATION_TIMEOUT_MS,
    null,
  )

  const [tags, category, seriesSessions, similarEvents, organization] = await Promise.all([
    tagsPromise,
    categoryPromise,
    seriesSessionsPromise,
    similarEventsPromise,
    organizationPromise,
  ])

  const venueRow = (data as any).venues
  const venue = venueRow?.slug
    ? {
        slug: String(venueRow.slug),
        title: String(venueRow.title || ''),
        address: venueRow.address ? String(venueRow.address) : null,
      }
    : null

  const sourceDisplay = organization
    ? null
    : {
        label: displayLinks.sourceLabel || meta.organization_name || 'Источник',
        url: displayLinks.sourceUrl,
      }

  const similarEnriched = similarEvents.length
    ? await enrichEventsForStorefront(client, similarEvents)
    : []

  return {
    ok: true,
    event: data,
    mediaGallery,
    tags,
    category,
    links: {
      registrationUrl: meta.registration_url || null,
      sourceUrl: meta.source_url || null,
    },
    organizationName: meta.organization_name || organization?.name || null,
    organization,
    venue,
    saleMode: displayLinks.saleMode,
    cta: shouldHideEventCta((data as any).event_status) ? null : displayLinks.cta,
    sourceDisplay,
    seriesSessions,
    similarEvents: similarEnriched,
  }
})
