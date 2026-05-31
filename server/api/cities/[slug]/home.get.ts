import { defineEventHandler, setResponseHeader } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import { resolveCityBySlug } from '~/server/utils/inuuCity'
import { enrichEventsForStorefront } from '~/server/utils/enrichEventsForStorefront'
import { prepareEventsListForDisplay } from '~/server/utils/eventListDisplay'

const HOME_EVENTS_LIMIT = 6
const HOME_EVENTS_FETCH_POOL = 48

export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'Cache-Control', 'public, max-age=60, s-maxage=120, stale-while-revalidate=300')

  const slug = typeof event.context.params?.slug === 'string' ? event.context.params.slug : ''
  const city = await resolveCityBySlug(event, slug)
  const client = await serverSupabaseServiceRole(event)
  const nowIso = new Date().toISOString()

  const [storiesRes, eventsRes, venuesRes, listsRes, hotSlotsRes] = await Promise.all([
    client
      .from('story_campaigns')
      .select('id,title,preview_url,placement,author_type,link_url')
      .eq('city_id', city.id)
      .eq('is_active', true)
      .in('placement', ['top_bar', 'home_hero'])
      .order('created_at', { ascending: false })
      .limit(12),
    client
      .from('events')
      .select('id,slug,title,description,excerpt,starts_at,ends_at,price,currency,cover_media_url,is_promoted,venue_id,series_slug,shop_id,source_channel,source_metadata')
      .eq('city_id', city.id)
      .eq('is_published', true)
      .gte('starts_at', nowIso)
      .order('starts_at', { ascending: true })
      .limit(HOME_EVENTS_FETCH_POOL),
    client
      .from('venues')
      .select('id,slug,title,description,address,lat,lng,cover_media_url,vibe_tags,rating_avg,editorial_quote')
      .eq('city_id', city.id)
      .eq('is_published', true)
      .eq('is_active', true)
      .order('rating_avg', { ascending: false })
      .limit(12),
    client
      .from('curated_lists')
      .select('id,slug,title,description,sort_order')
      .eq('city_id', city.id)
      .eq('is_published', true)
      .order('sort_order', { ascending: true })
      .limit(6),
    client
      .from('hot_slots')
      .select('id,starts_at,expires_at,price,discount_price,provider_id,service_id')
      .eq('city_id', city.id)
      .eq('is_active', true)
      .gte('expires_at', nowIso)
      .order('starts_at', { ascending: true })
      .limit(8),
  ])

  return {
    ok: true,
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
      prepareEventsListForDisplay(eventsRes.data ?? [], HOME_EVENTS_LIMIT, { sortByImportance: true }),
    ),
    venues: venuesRes.data ?? [],
    curatedLists: listsRes.data ?? [],
    hotSlots: hotSlotsRes.data ?? [],
  }
})
