import type { SupabaseClient } from '@supabase/supabase-js'
import { resolveEventDisplayLinks } from '~/server/utils/eventPublicDetail'
import type {
  EventCta,
  EventSaleMode,
  StorefrontOrganization,
  StorefrontVenue,
} from '~/types/storefront'

export const EDITORIAL_SHOP_SLUG = 'inuu-editorial'

export type { StorefrontOrganization, StorefrontVenue }

export type StorefrontEventEnrichment = {
  saleMode: EventSaleMode
  cta: EventCta
  organization: StorefrontOrganization | null
  venue: StorefrontVenue | null
}

type EnrichableRow = {
  shop_id?: string | null
  venue_id?: string | null
  source_channel?: string | null
  source_metadata?: unknown
}

export async function enrichEventsForStorefront<T extends EnrichableRow>(
  client: SupabaseClient,
  rows: T[],
): Promise<Array<T & StorefrontEventEnrichment>> {
  if (!rows.length) return []

  const shopIds = [...new Set(rows.map((r) => r.shop_id).filter(Boolean).map(String))]
  const venueIds = [...new Set(rows.map((r) => r.venue_id).filter(Boolean).map(String))]

  const shopsById = new Map<string, { slug: string; name: string }>()
  if (shopIds.length) {
    const { data: shops } = await client
      .from('shops')
      .select('id,slug,name')
      .in('id', shopIds)
      .eq('is_active', true)

    for (const shop of shops ?? []) {
      shopsById.set(String((shop as { id: string }).id), {
        slug: String((shop as { slug: string }).slug),
        name: String((shop as { name: string }).name),
      })
    }
  }

  const venuesById = new Map<string, { slug: string; title: string }>()
  if (venueIds.length) {
    const { data: venues } = await client
      .from('venues')
      .select('id,slug,title')
      .in('id', venueIds)
      .eq('is_active', true)

    for (const venue of venues ?? []) {
      venuesById.set(String((venue as { id: string }).id), {
        slug: String((venue as { slug: string }).slug),
        title: String((venue as { title: string }).title),
      })
    }
  }

  return rows.map((row) => {
    const links = resolveEventDisplayLinks(row)
    const shopId = row.shop_id ? String(row.shop_id) : null
    const shop = shopId ? shopsById.get(shopId) : null
    const venueId = row.venue_id ? String(row.venue_id) : null
    const venue = venueId ? venuesById.get(venueId) : null

    const organization =
      shop && shop.slug !== EDITORIAL_SHOP_SLUG
        ? { slug: shop.slug, name: shop.name }
        : null

    return {
      ...row,
      saleMode: links.saleMode,
      cta: links.cta,
      organization,
      venue: venue ? { slug: venue.slug, title: venue.title } : null,
    }
  })
}

export async function loadShopForStorefront(
  client: SupabaseClient,
  shopId: string,
): Promise<{ id: string; slug: string; name: string; ui_settings: Record<string, unknown> } | null> {
  const { data } = await client
    .from('shops')
    .select('id,slug,name,ui_settings')
    .eq('id', shopId)
    .eq('is_active', true)
    .maybeSingle()

  if (!data?.id) return null
  return {
    id: String(data.id),
    slug: String(data.slug),
    name: String(data.name),
    ui_settings: (data.ui_settings && typeof data.ui_settings === 'object'
      ? data.ui_settings
      : {}) as Record<string, unknown>,
  }
}

export function organizationProfileFromShop(shop: {
  slug: string
  name: string
  ui_settings: Record<string, unknown>
}) {
  const org = (shop.ui_settings.organization && typeof shop.ui_settings.organization === 'object'
    ? shop.ui_settings.organization
    : {}) as Record<string, unknown>

  const publicDescription =
    typeof org.public_description === 'string'
      ? org.public_description
      : typeof shop.ui_settings.public_description === 'string'
        ? shop.ui_settings.public_description
        : null

  const logoUrl =
    typeof org.logo_url === 'string'
      ? org.logo_url
      : typeof shop.ui_settings.logo_url === 'string'
        ? shop.ui_settings.logo_url
        : null

  const isClaimed =
    org.is_claimed === true
    || shop.ui_settings.is_claimed === true

  return {
    slug: shop.slug,
    name: shop.name,
    description: publicDescription,
    logoUrl,
    isClaimed,
  }
}
