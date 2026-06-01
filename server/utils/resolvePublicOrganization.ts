import type { H3Event } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import {
  EDITORIAL_SHOP_SLUG,
  loadShopForStorefront,
} from '~/server/utils/enrichEventsForStorefront'
import { parseSourceMetadata } from '~/server/utils/eventPublicDetail'
import { resolveIngestSourceOrganization } from '~/server/utils/ingestSourceContext'
import { parsedSourceKeyFromUrl } from '~/server/utils/ingestSourceDisplayName'
import type { StorefrontOrganization } from '~/types/storefront'

export { parsedSourceKeyFromUrl }

async function loadShopByParsedSourceKey(
  client: SupabaseClient,
  cityId: string,
  key: string,
): Promise<{ id: string; slug: string; name: string } | null> {
  const { data } = await client
    .from('shops')
    .select('id,slug,name')
    .eq('city_id', cityId)
    .eq('is_active', true)
    .filter('ui_settings->>parsed_source_domain', 'eq', key)
    .maybeSingle()

  if (!data?.id || !data?.slug || String(data.slug) === EDITORIAL_SHOP_SLUG) return null
  return {
    id: String(data.id),
    slug: String(data.slug),
    name: String(data.name),
  }
}

export async function findShopIdByParsedSourceUrl(
  client: SupabaseClient,
  cityId: string,
  sourceUrl: string | null | undefined,
): Promise<string | null> {
  const key = sourceUrl ? parsedSourceKeyFromUrl(sourceUrl) : null
  if (!key) return null
  const shop = await loadShopByParsedSourceKey(client, cityId, key)
  return shop?.id ?? null
}

export async function findShopByParsedSourceUrl(
  client: SupabaseClient,
  cityId: string,
  sourceUrl: string | null | undefined,
): Promise<StorefrontOrganization | null> {
  const key = sourceUrl ? parsedSourceKeyFromUrl(sourceUrl) : null
  if (!key) return null
  const shop = await loadShopByParsedSourceKey(client, cityId, key)
  if (!shop) return null
  return { slug: shop.slug, name: shop.name }
}

export async function resolvePublicEventOrganization(args: {
  client: SupabaseClient
  event?: H3Event
  cityId: string
  citySlug: string
  shopId: string | null
  sourceMetadata: unknown
  sourceChannel?: string | null
}): Promise<StorefrontOrganization | null> {
  if (args.shopId) {
    const shop = await loadShopForStorefront(args.client, args.shopId)
    if (shop && shop.slug !== EDITORIAL_SHOP_SLUG) {
      return { slug: shop.slug, name: shop.name }
    }
  }

  const meta = parseSourceMetadata(args.sourceMetadata)
  const sourceUrl = meta.source_url?.trim() || null

  if (sourceUrl && args.event) {
    const linked = await resolveIngestSourceOrganization(args.event, {
      citySlug: args.citySlug,
      sourceUrl,
      sourceKind: args.sourceChannel,
    })
    if (linked?.organizationId) {
      const shop = await loadShopForStorefront(args.client, linked.organizationId)
      if (shop && shop.slug !== EDITORIAL_SHOP_SLUG) {
        const displayName = linked.organizationName?.trim()
        return {
          slug: shop.slug,
          name: displayName && displayName.length > 1 ? displayName : shop.name,
        }
      }
    }
  }

  if (sourceUrl) {
    const bySource = await findShopByParsedSourceUrl(args.client, args.cityId, sourceUrl)
    if (bySource) return bySource
  }

  return null
}
