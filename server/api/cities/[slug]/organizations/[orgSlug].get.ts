import { createError, defineEventHandler, setResponseHeader } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import {
  EDITORIAL_SHOP_SLUG,
  enrichEventsForStorefront,
  organizationProfileFromShop,
} from '~/server/utils/enrichEventsForStorefront'
import { prepareEventsListForDisplay } from '~/server/utils/eventListDisplay'
import { parseSourceMetadata } from '~/server/utils/eventPublicDetail'
import { resolveCityBySlug } from '~/server/utils/inuuCity'

const UPCOMING_EVENTS_LIMIT = 24
const UPCOMING_EVENTS_FETCH_POOL = 80

export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'Cache-Control', 'public, max-age=60, s-maxage=120')
  const slug = typeof event.context.params?.slug === 'string' ? event.context.params.slug : ''
  const orgSlug = typeof event.context.params?.orgSlug === 'string' ? event.context.params.orgSlug : ''
  const city = await resolveCityBySlug(event, slug)

  if (!orgSlug || orgSlug === EDITORIAL_SHOP_SLUG) {
    throw createError({ statusCode: 404, statusMessage: 'Organization not found' })
  }

  const client = await serverSupabaseServiceRole(event)
  const { data: shop, error } = await client
    .from('shops')
    .select('id,slug,name,ui_settings')
    .eq('city_id', city.id)
    .eq('slug', orgSlug)
    .eq('is_active', true)
    .maybeSingle()

  if (error) {
    console.error('[organizations/detail] load shop failed:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to load organization' })
  }

  if (!shop?.id) {
    throw createError({ statusCode: 404, statusMessage: 'Organization not found' })
  }

  const shopId = String(shop.id)
  const nowIso = new Date().toISOString()

  const { data: eventRows, error: eventsError } = await client
    .from('events')
    .select('id,slug,title,description,excerpt,starts_at,ends_at,price,currency,cover_media_url,is_promoted,venue_id,series_slug,category_id,source_metadata,shop_id,source_channel')
    .eq('city_id', city.id)
    .eq('shop_id', shopId)
    .eq('is_published', true)
    .gte('starts_at', nowIso)
    .order('starts_at', { ascending: true })
    .limit(UPCOMING_EVENTS_FETCH_POOL)

  if (eventsError) {
    console.error('[organizations/detail] load events failed:', eventsError)
    throw createError({ statusCode: 500, statusMessage: 'Failed to load organization events' })
  }

  const upcomingEvents = await enrichEventsForStorefront(
    client,
    prepareEventsListForDisplay(eventRows ?? [], UPCOMING_EVENTS_LIMIT),
  )

  const profile = organizationProfileFromShop({
    slug: String(shop.slug),
    name: String(shop.name),
    ui_settings: (shop.ui_settings && typeof shop.ui_settings === 'object'
      ? shop.ui_settings
      : {}) as Record<string, unknown>,
  })

  let sourceHint: string | null = null
  const latest = (eventRows ?? [])[0]
  if (latest) {
    const meta = parseSourceMetadata((latest as { source_metadata?: unknown }).source_metadata)
    const channel = String((latest as { source_channel?: string }).source_channel || '').trim()
    if (meta.organization_name) {
      sourceHint = String(meta.organization_name)
    } else if (meta.source_url) {
      const tgMatch = meta.source_url.match(/(?:t\.me|telegram\.me)\/([a-zA-Z0-9_]+)/i)
      sourceHint = tgMatch?.[1] ? `@${tgMatch[1]}` : meta.source_url
    } else if (channel) {
      sourceHint = channel
    }
  }

  return {
    ok: true,
    organization: {
      id: shopId,
      slug: profile.slug,
      name: profile.name,
      description: profile.description,
      logoUrl: profile.logoUrl,
      isClaimed: profile.isClaimed,
      sourceHint,
    },
    upcomingEvents,
  }
})
