import { createError, defineEventHandler } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import { resolveDashboardAccess } from '~/server/utils/dashboard'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const defaultCitySlug = typeof config.public?.defaultCitySlug === 'string' && config.public.defaultCitySlug.trim()
    ? config.public.defaultCitySlug.trim()
    : 'ulan-ude'

  const access = await resolveDashboardAccess(event)
  if (!access) {
    return {
      ok: true,
      path: `/${defaultCitySlug}`,
    }
  }

  const client = await serverSupabaseServiceRole(event)

  const { data: shop, error } = await client
    .from('shops')
    .select('slug,city_id')
    .eq('id', access.shopId)
    .maybeSingle()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to resolve storefront path' })
  }

  let citySlug = defaultCitySlug
  if (shop?.city_id) {
    const { data: city } = await client
      .from('cities')
      .select('slug')
      .eq('id', shop.city_id)
      .maybeSingle()
    if (typeof city?.slug === 'string' && city.slug.trim()) {
      citySlug = city.slug.trim()
    }
  }

  const slug = typeof shop?.slug === 'string' ? shop.slug.trim() : ''
  if (!slug) {
    return { ok: true, path: `/${citySlug}` }
  }

  return {
    ok: true,
    path: `/${citySlug}/${slug}`,
  }
})
