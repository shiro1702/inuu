import type { H3Event } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import type { EditorialParseResult } from '~/server/utils/ai/editorialParseSchema'
import { resolveOrCreateShadowOrg } from '~/server/utils/ingestShadowOrg'
import { slugifyTaxonomy } from '~/server/utils/cityContentTaxonomy'

export async function findVenueInCity(
  event: H3Event,
  args: { cityId: string; venueName: string | null; venueId?: string | null },
): Promise<{ id: string; slug: string; title: string; shop_id: string | null } | null> {
  const client = await serverSupabaseServiceRole(event)
  if (args.venueId) {
    const { data } = await client
      .from('venues')
      .select('id,slug,title,shop_id')
      .eq('city_id', args.cityId)
      .eq('id', args.venueId)
      .maybeSingle()
    return data?.id ? (data as any) : null
  }

  const name = String(args.venueName || '').trim()
  if (name.length < 2) return null

  const slugGuess = slugifyTaxonomy(name)
  const { data: bySlug } = await client
    .from('venues')
    .select('id,slug,title,shop_id')
    .eq('city_id', args.cityId)
    .eq('slug', slugGuess)
    .maybeSingle()
  if (bySlug?.id) return bySlug as any

  const { data: rows } = await client
    .from('venues')
    .select('id,slug,title,shop_id')
    .eq('city_id', args.cityId)
    .ilike('title', `%${name.slice(0, 40)}%`)
    .limit(5)

  if (!rows?.length) return null
  const exact = rows.find((r) => String((r as any).title).toLowerCase() === name.toLowerCase())
  return (exact || rows[0]) as any
}

export async function findShopByNameInCity(
  event: H3Event,
  args: { cityId: string; name: string },
): Promise<{ id: string; slug: string; name: string } | null> {
  const client = await serverSupabaseServiceRole(event)
  const name = args.name.trim()
  if (name.length < 2) return null

  const { data: rows } = await client
    .from('shops')
    .select('id,slug,name')
    .eq('city_id', args.cityId)
    .ilike('name', `%${name.slice(0, 40)}%`)
    .limit(8)

  if (!rows?.length) return null
  const exact = rows.find((r) => String((r as any).name).toLowerCase() === name.toLowerCase())
  return (exact || rows[0]) as any
}

export async function enrichEditorialOrganization(
  event: H3Event,
  args: {
    cityId: string
    citySlug: string
    payload: EditorialParseResult
    sourceUrl?: string | null
  },
): Promise<EditorialParseResult> {
  const payload = { ...args.payload }
  const orgId = payload.organization?.id ? String(payload.organization.id).trim() : ''
  if (orgId) return payload

  const venue = await findVenueInCity(event, {
    cityId: args.cityId,
    venueName: payload.venue?.name || null,
    venueId: payload.venue?.id || null,
  })
  if (venue) {
    payload.venue = { name: venue.title, id: venue.id }
    if (venue.shop_id) {
      payload.organization = { name: payload.organization?.name || venue.title, id: venue.shop_id }
      return payload
    }
  }

  const orgName = payload.organization?.name || payload.venue?.name || null
  if (orgName) {
    const shop = await findShopByNameInCity(event, { cityId: args.cityId, name: orgName })
    if (shop) {
      payload.organization = { name: shop.name, id: shop.id }
      return payload
    }
  }

  return payload
}

export async function attachShadowOrgToEditorialPayload(
  event: H3Event,
  args: {
    cityId: string
    payload: EditorialParseResult
    sourceUrl: string
  },
): Promise<EditorialParseResult> {
  const orgName = args.payload.organization?.name || args.payload.venue?.name || 'Организация'
  const shadow = await resolveOrCreateShadowOrg({
    event,
    cityId: args.cityId,
    sourceUrl: args.sourceUrl,
    orgNameHint: orgName,
  })
  return {
    ...args.payload,
    organization: { name: shadow.name, id: shadow.shopId },
  }
}

export function editorialMissingOrg(payload: EditorialParseResult): boolean {
  const id = payload.organization?.id
  return !id || !String(id).trim()
}
