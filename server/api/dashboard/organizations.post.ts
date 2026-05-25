import { createError, defineEventHandler, readBody } from 'h3'
import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'
import {
  invalidateDashboardAccessCache,
  resolveDashboardAccess,
} from '~/server/utils/dashboard'
import { getDefaultOrganizationSettings } from '~/server/utils/organizationStyle'

const ORG_TYPES = new Set([
  'beauty_salon',
  'event_organizer',
  'confectioner',
  'editorial',
  'venue_operator',
  'advertiser',
])

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

type CreateOrganizationBody = {
  name?: string
  slug?: string
  orgType?: string
  citySlug?: string
}

export default defineEventHandler(async (event) => {
  const existing = await resolveDashboardAccess(event)
  if (existing) {
    throw createError({ statusCode: 409, statusMessage: 'Organization already exists' })
  }

  const supabaseUser = await serverSupabaseUser(event)
  if (!supabaseUser) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
  const raw = supabaseUser as { id?: string; sub?: string }
  const userId = typeof raw.id === 'string'
    ? raw.id
    : typeof raw.sub === 'string'
      ? raw.sub
      : null
  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const body = await readBody<CreateOrganizationBody>(event)
  const name = body?.name?.trim()
  const slug = body?.slug?.trim().toLowerCase()
  if (!name || !slug) {
    throw createError({ statusCode: 400, statusMessage: 'name and slug are required' })
  }
  if (!SLUG_RE.test(slug)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid slug format' })
  }

  const orgTypeRaw = typeof body?.orgType === 'string' ? body.orgType.trim() : 'venue_operator'
  const orgType = ORG_TYPES.has(orgTypeRaw) ? orgTypeRaw : 'venue_operator'

  const config = useRuntimeConfig(event)
  const citySlug = (typeof body?.citySlug === 'string' && body.citySlug.trim())
    || (typeof config.public?.defaultCitySlug === 'string' ? config.public.defaultCitySlug : 'ulan-ude')

  const client = await serverSupabaseServiceRole(event)
  const { data: cityData, error: cityError } = await client
    .from('cities')
    .select('id')
    .eq('slug', citySlug)
    .maybeSingle()
  if (cityError || !cityData?.id) {
    throw createError({ statusCode: 400, statusMessage: 'City not found' })
  }

  const defaults = getDefaultOrganizationSettings()
  defaults.slug = slug
  defaults.displayName = name

  const { data: shop, error: shopError } = await client
    .from('shops')
    .insert({
      city_id: cityData.id,
      slug,
      name,
      org_type: orgType,
      is_active: true,
      ui_settings: { organization: defaults },
    })
    .select('id,slug,name')
    .single()

  if (shopError) {
    const message = shopError.message || 'Failed to create organization'
    const statusCode = /unique|duplicate/i.test(message) ? 409 : 400
    throw createError({ statusCode, statusMessage: message })
  }

  const { error: memberError } = await client.from('shop_members').insert({
    shop_id: shop.id,
    user_id: userId,
    role: 'owner',
  })
  if (memberError && !/duplicate/i.test(memberError.message)) {
    throw createError({ statusCode: 500, statusMessage: memberError.message || 'Failed to assign owner' })
  }

  const profileUpdate = await client
    .from('profiles')
    .update({ shop_id: shop.id })
    .eq('id', userId)
  if (profileUpdate.error && !/column .*shop_id/i.test(profileUpdate.error.message)) {
    // profiles.shop_id is optional in some deployments
  }

  invalidateDashboardAccessCache(userId)

  return {
    ok: true,
    shopId: shop.id,
    shopSlug: shop.slug,
    name: shop.name,
  }
})
