import type { H3Event } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import {
  normalizeContextTypeForSource,
  type IngestContextType,
} from '~/server/utils/ingestSourcesDashboardShared'
import { extractTelegramChannelFromUrl } from '~/server/utils/ingestSourceDisplayName'
import { resolveCityBySlug } from '~/server/utils/inuuCity'

function extractTelegramSourceKey(sourceUrl: string | null | undefined): string | null {
  const channel = extractTelegramChannelFromUrl(String(sourceUrl || '').trim())
  return channel ? channel.toLowerCase() : null
}

function shopFromIngestSourceJoin(data: {
  organization_id?: string | null
  shops?: unknown
  display_name?: string | null
}): IngestSourceOrganization | null {
  const orgId = data.organization_id ? String(data.organization_id) : null
  const shop = Array.isArray(data.shops) ? data.shops[0] : data.shops
  if (!orgId || !shop || typeof shop !== 'object') return null
  const nameFromDisplay =
    typeof data.display_name === 'string' && data.display_name.trim()
      ? data.display_name.trim()
      : null
  const shopName = typeof (shop as { name?: unknown }).name === 'string'
    ? String((shop as { name: string }).name)
    : ''
  if (!shopName && !nameFromDisplay) return null
  return {
    organizationId: orgId,
    organizationName: nameFromDisplay || shopName,
  }
}

async function resolveWebSourceOrganizationByTelegramChannel(
  client: Awaited<ReturnType<typeof serverSupabaseServiceRole>>,
  cityId: string,
  channel: string,
): Promise<IngestSourceOrganization | null> {
  const key = channel.toLowerCase()
  const { data: rows } = await client
    .from('city_web_sources')
    .select('organization_id,display_name,url,shops:organization_id(id,name)')
    .eq('city_id', cityId)
    .eq('is_active', true)
    .not('organization_id', 'is', null)

  for (const row of rows ?? []) {
    const rowChannel = extractTelegramChannelFromUrl(String((row as { url?: string }).url || ''))
    if (rowChannel?.toLowerCase() !== key) continue
    const linked = shopFromIngestSourceJoin(row as {
      organization_id?: string | null
      shops?: unknown
      display_name?: string | null
    })
    if (linked) return linked
  }
  return null
}

function normalizeWebUrl(sourceUrl: string | null | undefined): string | null {
  if (!sourceUrl) return null
  try {
    const parsed = new URL(sourceUrl)
    if (!['http:', 'https:'].includes(parsed.protocol)) return null
    parsed.hash = ''
    return parsed.toString().replace(/\/$/, '')
  } catch {
    return null
  }
}

export async function resolveIngestSourceContext(
  event: H3Event,
  args: { citySlug?: string | null; sourceUrl?: string | null },
): Promise<IngestContextType> {
  const citySlug = String(args.citySlug || '').trim()
  if (!citySlug) return 'general'

  let cityId: string
  try {
    const city = await resolveCityBySlug(event, citySlug)
    cityId = city.id
  } catch {
    return 'general'
  }

  const client = await serverSupabaseServiceRole(event)
  const tgKey = extractTelegramSourceKey(args.sourceUrl)
  if (tgKey) {
    const { data } = await client
      .from('city_telegram_sources')
      .select('context_type')
      .eq('city_id', cityId)
      .eq('source_key', tgKey)
      .eq('is_active', true)
      .maybeSingle()
    if (data?.context_type) return normalizeContextTypeForSource(data.context_type)
  }

  const webUrl = normalizeWebUrl(args.sourceUrl)
  if (webUrl) {
    const { data } = await client
      .from('city_web_sources')
      .select('context_type')
      .eq('city_id', cityId)
      .eq('url', webUrl)
      .eq('is_active', true)
      .maybeSingle()
    if (data?.context_type) return normalizeContextTypeForSource(data.context_type)
  }

  return 'general'
}

export type IngestSourceOrganization = {
  organizationId: string
  organizationName: string
}

export async function resolveIngestSourceOrganization(
  event: H3Event,
  args: { citySlug?: string | null; sourceUrl?: string | null; sourceKind?: string | null },
): Promise<IngestSourceOrganization | null> {
  const citySlug = String(args.citySlug || '').trim()
  if (!citySlug) return null

  let cityId: string
  try {
    const city = await resolveCityBySlug(event, citySlug)
    cityId = city.id
  } catch {
    return null
  }

  const client = await serverSupabaseServiceRole(event)
  const kind = String(args.sourceKind || '').trim()
  const webUrl = normalizeWebUrl(args.sourceUrl)

  // Fast path for web sources: exact URL match is cheaper than scanning all web sources by tg channel.
  if (kind === 'web_cron' || kind === 'manual_editor') {
    if (webUrl) {
      const { data } = await client
        .from('city_web_sources')
        .select('organization_id,display_name,shops:organization_id(id,name)')
        .eq('city_id', cityId)
        .eq('url', webUrl)
        .maybeSingle()
      const linked = shopFromIngestSourceJoin(
        (data || {}) as { organization_id?: string | null; shops?: unknown; display_name?: string | null },
      )
      if (linked) return linked
    }
  }

  const tgKey = extractTelegramSourceKey(args.sourceUrl)
  if (tgKey) {
    const fromWeb = await resolveWebSourceOrganizationByTelegramChannel(client, cityId, tgKey)
    if (fromWeb) return fromWeb
  }

  if (tgKey) {
    const { data } = await client
      .from('city_telegram_sources')
      .select('organization_id,shops:organization_id(id,name)')
      .eq('city_id', cityId)
      .eq('source_key', tgKey)
      .maybeSingle()
    const linked = shopFromIngestSourceJoin(
      (data || {}) as { organization_id?: string | null; shops?: unknown },
    )
    if (linked) return linked
  }

  return null
}
