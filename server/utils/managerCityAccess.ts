import { createError, type H3Event } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import { requireDashboardAccess } from '~/server/utils/dashboard'

export type ManagerCityScope = {
  userId: string
  cityId: string
  citySlug: string
  cityName: string
  shopIds: string[]
  primaryShopId: string
}

type ShopMemberRow = {
  shop_id: string
  shops: {
    id: string
    city_id: string | null
    cities?: { id: string; slug: string; name: string } | Array<{ id: string; slug: string; name: string }> | null
  } | null
}

export async function resolveManagerCityScopeOrThrow(event: H3Event, citySlug: string): Promise<ManagerCityScope> {
  const access = await requireDashboardAccess(event)
  const normalizedSlug = citySlug.trim()
  if (!normalizedSlug) {
    throw createError({ statusCode: 400, statusMessage: 'City slug is required' })
  }

  const client = await serverSupabaseServiceRole(event)
  const { data, error } = await client
    .from('shop_members')
    .select('shop_id,shops:shop_id(id,city_id,cities(id,slug,name))')
    .eq('user_id', access.userId)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message || 'Failed to resolve city scope' })
  }

  const rows = (data ?? []) as ShopMemberRow[]
  const cityRows = rows.filter((row) => {
    const city = Array.isArray(row.shops?.cities) ? row.shops?.cities[0] : row.shops?.cities
    return city?.slug === normalizedSlug && row.shops?.id
  })

  if (!cityRows.length) {
    throw createError({ statusCode: 403, statusMessage: 'No manager access for this city' })
  }

  const firstCity = Array.isArray(cityRows[0].shops?.cities) ? cityRows[0].shops?.cities[0] : cityRows[0].shops?.cities
  if (!firstCity?.id) {
    throw createError({ statusCode: 500, statusMessage: 'City scope is incomplete' })
  }

  const shopIds = Array.from(new Set(cityRows.map((x) => String(x.shop_id))))
  return {
    userId: access.userId,
    cityId: firstCity.id,
    citySlug: firstCity.slug,
    cityName: firstCity.name || firstCity.slug,
    shopIds,
    primaryShopId: shopIds[0],
  }
}
