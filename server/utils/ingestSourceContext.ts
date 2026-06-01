import type { H3Event } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import {
  normalizeContextTypeForSource,
  type IngestContextType,
} from '~/server/utils/ingestSourcesDashboardShared'
import { resolveCityBySlug } from '~/server/utils/inuuCity'

function extractTelegramSourceKey(sourceUrl: string | null | undefined): string | null {
  if (!sourceUrl) return null
  const match = sourceUrl.match(/(?:t\.me|telegram\.me)\/([a-zA-Z0-9_]+)/i)
  return match?.[1] ? match[1].toLowerCase() : null
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

  if (kind === 'web_cron' || kind === 'manual_editor') {
    const webUrl = normalizeWebUrl(args.sourceUrl)
    if (webUrl) {
      const { data } = await client
        .from('city_web_sources')
        .select('organization_id,shops:organization_id(id,name)')
        .eq('city_id', cityId)
        .eq('url', webUrl)
        .maybeSingle()
      const orgId = data?.organization_id ? String(data.organization_id) : null
      const shop = Array.isArray((data as any)?.shops) ? (data as any).shops[0] : (data as any)?.shops
      if (orgId && shop?.name) {
        return { organizationId: orgId, organizationName: String(shop.name) }
      }
    }
  }

  const tgKey = extractTelegramSourceKey(args.sourceUrl)
  if (tgKey) {
    const { data } = await client
      .from('city_telegram_sources')
      .select('organization_id,shops:organization_id(id,name)')
      .eq('city_id', cityId)
      .eq('source_key', tgKey)
      .maybeSingle()
    const orgId = data?.organization_id ? String(data.organization_id) : null
    const shop = Array.isArray((data as any)?.shops) ? (data as any).shops[0] : (data as any)?.shops
    if (orgId && shop?.name) {
      return { organizationId: orgId, organizationName: String(shop.name) }
    }
  }

  return null
}
