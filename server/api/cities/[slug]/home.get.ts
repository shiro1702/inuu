import { defineEventHandler, getQuery, setResponseHeader } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import { resolveCityBySlug } from '~/server/utils/inuuCity'
import { enrichEventsForStorefront } from '~/server/utils/enrichEventsForStorefront'
import { filterEventsByTags, prepareEventsListForDisplay } from '~/server/utils/eventListDisplay'

const HOME_EVENTS_LIMIT = 6
const HOME_EVENTS_FETCH_POOL = 48
const HOME_CURATED_LISTS_LIMIT = 4
const HOME_EDITORIAL_JOURNAL_LIMIT = 6

export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'Cache-Control', 'public, max-age=60, s-maxage=120, stale-while-revalidate=300')

  const slug = typeof event.context.params?.slug === 'string' ? event.context.params.slug : ''
  const city = await resolveCityBySlug(event, slug)
  const query = getQuery(event)
  const tag = typeof query.tag === 'string' ? query.tag.trim().toLowerCase() : ''
  const client = await serverSupabaseServiceRole(event)
  const nowIso = new Date().toISOString()

  const eventsQuery = client
    .from('events')
    .select('id,slug,title,description,excerpt,starts_at,ends_at,price,currency,cover_media_url,is_promoted,venue_id,series_slug,shop_id,source_channel,source_metadata')
    .eq('city_id', city.id)
    .eq('is_published', true)
    .gte('starts_at', nowIso)
    .order('starts_at', { ascending: true })
    .limit(HOME_EVENTS_FETCH_POOL)

  let listsQuery = client
    .from('curated_lists')
    .select('id,slug,title,description,topic_tags,sort_order,created_at')
    .eq('city_id', city.id)
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(HOME_CURATED_LISTS_LIMIT)

  let editorialQuery = client
    .from('editorial_posts')
    .select('id,slug,title,excerpt,cover_media_url,published_at,topic_tags,is_sponsored')
    .eq('city_id', city.id)
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(HOME_EDITORIAL_JOURNAL_LIMIT)

  if (tag) {
    listsQuery = listsQuery.contains('topic_tags', [tag])
    editorialQuery = editorialQuery.contains('topic_tags', [tag])
  }

  const storiesPromise = client
    .from('story_campaigns')
    .select('id,title,preview_url,placement,author_type,link_url')
    .eq('city_id', city.id)
    .eq('is_active', true)
    .in('placement', ['top_bar', 'home_hero'])
    .order('created_at', { ascending: false })
    .limit(12)

  const venuesPromise = tag
    ? Promise.resolve({ data: [] as Record<string, unknown>[] })
    : client
        .from('venues')
        .select('id,slug,title,description,address,lat,lng,cover_media_url,vibe_tags,rating_avg,editorial_quote')
        .eq('city_id', city.id)
        .eq('is_published', true)
        .eq('is_active', true)
        .order('rating_avg', { ascending: false })
        .limit(12)

  const hotSlotsPromise = tag
    ? Promise.resolve({ data: [] as Record<string, unknown>[] })
    : client
        .from('hot_slots')
        .select('id,starts_at,expires_at,price,discount_price,provider_id,service_id')
        .eq('city_id', city.id)
        .eq('is_active', true)
        .gte('expires_at', nowIso)
        .order('starts_at', { ascending: true })
        .limit(8)

  const [storiesRes, eventsRes, venuesRes, listsRes, hotSlotsRes, editorialRes] = await Promise.all([
    storiesPromise,
    eventsQuery,
    venuesPromise,
    listsQuery,
    hotSlotsPromise,
    editorialQuery,
  ])

  const eventsRaw = tag
    ? filterEventsByTags(eventsRes.data ?? [], [tag])
    : (eventsRes.data ?? [])

  return {
    ok: true,
    activeTag: tag || null,
    city: {
      id: city.id,
      name: city.name,
      slug: city.slug,
      timezone: city.timezone,
      editorialName: city.editorial_name,
    },
    stories: storiesRes.data ?? [],
    events: await enrichEventsForStorefront(
      client,
      prepareEventsListForDisplay(eventsRaw, HOME_EVENTS_LIMIT, { sortByImportance: true }),
    ),
    venues: venuesRes.data ?? [],
    curatedLists: listsRes.data ?? [],
    hotSlots: hotSlotsRes.data ?? [],
    editorialJournal: editorialRes.data ?? [],
  }
})
