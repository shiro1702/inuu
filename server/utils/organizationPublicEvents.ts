import type { SupabaseClient } from '@supabase/supabase-js'
import { extractTelegramChannelFromUrl } from '~/server/utils/ingestSourceDisplayName'
import { parseSourceMetadata } from '~/server/utils/eventPublicDetail'

const EVENT_SELECT =
  'id,slug,title,description,excerpt,starts_at,ends_at,price,currency,cover_media_url,is_promoted,venue_id,series_slug,category_id,source_metadata,shop_id,source_channel'

export type OrganizationEventRow = Record<string, unknown> & { id: string }

function eventMatchesTelegramChannels(row: OrganizationEventRow, channels: Set<string>): boolean {
  if (!channels.size) return false
  const meta = parseSourceMetadata(row.source_metadata)
  const sourceUrl = String(meta.source_url || '').toLowerCase()
  if (!sourceUrl) return false
  for (const channel of channels) {
    if (
      sourceUrl.includes(`/s/${channel}`)
      || sourceUrl.includes(`/${channel}/`)
      || sourceUrl.endsWith(`/${channel}`)
    ) {
      return true
    }
  }
  return false
}

export async function loadOrganizationUpcomingEvents(
  client: SupabaseClient,
  args: {
    cityId: string
    shopId: string
    nowIso: string
    fetchPool: number
  },
): Promise<OrganizationEventRow[]> {
  const { data: byShop, error: byShopError } = await client
    .from('events')
    .select(EVENT_SELECT)
    .eq('city_id', args.cityId)
    .eq('shop_id', args.shopId)
    .eq('is_published', true)
    .gte('starts_at', args.nowIso)
    .order('starts_at', { ascending: true })
    .limit(args.fetchPool)

  if (byShopError) {
    throw byShopError
  }

  const channels = new Set<string>()
  const { data: webSources } = await client
    .from('city_web_sources')
    .select('url')
    .eq('city_id', args.cityId)
    .eq('organization_id', args.shopId)
    .eq('is_active', true)

  for (const row of webSources ?? []) {
    const channel = extractTelegramChannelFromUrl(String((row as { url?: string }).url || ''))
    if (channel) channels.add(channel.toLowerCase())
  }

  if (!channels.size) {
    return (byShop ?? []) as OrganizationEventRow[]
  }

  const { data: pool } = await client
    .from('events')
    .select(EVENT_SELECT)
    .eq('city_id', args.cityId)
    .eq('is_published', true)
    .gte('starts_at', args.nowIso)
    .order('starts_at', { ascending: true })
    .limit(args.fetchPool)

  const merged = new Map<string, OrganizationEventRow>()
  for (const row of [...(byShop ?? []), ...(pool ?? [])] as OrganizationEventRow[]) {
    const id = String(row.id)
    if (merged.has(id)) continue
    if (row.shop_id === args.shopId || eventMatchesTelegramChannels(row, channels)) {
      merged.set(id, row)
    }
  }

  return [...merged.values()].sort(
    (a, b) => new Date(String(a.starts_at)).getTime() - new Date(String(b.starts_at)).getTime(),
  )
}

export async function resolveOrganizationDisplayName(
  client: SupabaseClient,
  args: { cityId: string; shopId: string; fallbackName: string },
): Promise<string> {
  const { data } = await client
    .from('city_web_sources')
    .select('display_name')
    .eq('city_id', args.cityId)
    .eq('organization_id', args.shopId)
    .eq('is_active', true)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const hint = typeof data?.display_name === 'string' ? data.display_name.trim() : ''
  if (hint.length > 1 && hint.toLowerCase() !== 't') return hint
  return args.fallbackName
}
