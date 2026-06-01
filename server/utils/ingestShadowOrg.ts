import type { H3Event } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import { slugifyTaxonomy } from '~/server/utils/cityContentTaxonomy'
import {
  extractTelegramChannelFromUrl,
  resolveIngestSourceDisplayName,
} from '~/server/utils/ingestSourceDisplayName'

function extractDomain(sourceUrl: string): string {
  try {
    return new URL(sourceUrl).hostname.replace(/^www\./, '')
  } catch {
    return 'unknown-source'
  }
}

export type ShadowOrgResult = {
  shopId: string
  slug: string
  name: string
  created: boolean
}

export async function resolveOrCreateShadowOrg(args: {
  event: H3Event
  cityId: string
  sourceUrl: string
  orgNameHint?: string | null
  webSourceId?: string | null
}): Promise<ShadowOrgResult> {
  const client = await serverSupabaseServiceRole(args.event)
  const domain = extractDomain(args.sourceUrl)
  const channel = extractTelegramChannelFromUrl(args.sourceUrl)
  const parsedSourceKey = channel ? `t.me/${channel.toLowerCase()}` : domain
  const slugBase = slugifyTaxonomy(channel || domain) || 'parsed-org'
  const name = resolveIngestSourceDisplayName({
    sourceUrl: args.sourceUrl,
    displayName: args.orgNameHint,
  })

  const { data: byDomain } = await client
    .from('shops')
    .select('id,slug,name,ui_settings')
    .eq('city_id', args.cityId)
    .filter('ui_settings->>parsed_source_domain', 'eq', parsedSourceKey)
    .maybeSingle()

  if (byDomain?.id) {
    if (args.webSourceId) {
      await client
        .from('city_web_sources')
        .update({ organization_id: byDomain.id, updated_at: new Date().toISOString() } as any)
        .eq('id', args.webSourceId)
        .is('organization_id', null)
    }
    return {
      shopId: String(byDomain.id),
      slug: String(byDomain.slug),
      name: String(byDomain.name),
      created: false,
    }
  }

  let slug = slugBase
  for (let i = 0; i < 5; i++) {
    const candidate = i === 0 ? slug : `${slugBase}-${i + 1}`
    const { data: existingSlug } = await client
      .from('shops')
      .select('id')
      .eq('city_id', args.cityId)
      .eq('slug', candidate)
      .maybeSingle()
    if (!existingSlug?.id) {
      slug = candidate
      break
    }
  }

  const { data: created, error } = await client
    .from('shops')
    .insert({
      city_id: args.cityId,
      slug,
      name,
      org_type: 'venue_operator',
      ui_settings: {
        is_claimed: false,
        parsed_source_domain: parsedSourceKey,
      },
    } as any)
    .select('id,slug,name')
    .maybeSingle()

  if (error || !created?.id) {
    throw new Error(error?.message || 'Failed to create shadow organization')
  }

  if (args.webSourceId) {
    await client
      .from('city_web_sources')
      .update({ organization_id: created.id, updated_at: new Date().toISOString() } as any)
      .eq('id', args.webSourceId)
  }

  return {
    shopId: String(created.id),
    slug: String(created.slug),
    name: String(created.name),
    created: true,
  }
}
