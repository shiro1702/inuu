import { defineEventHandler } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import { requireDashboardAccess } from '~/server/utils/dashboard'

type Row = {
  shop_id: string
  role: string
  shops: {
    id: string
    name: string
    slug: string
    city_id: string | null
    is_active: boolean
    cities?: { id: string; name: string; slug: string; is_active: boolean } | Array<{ id: string; name: string; slug: string; is_active: boolean }> | null
  } | null
}

export default defineEventHandler(async (event) => {
  const access = await requireDashboardAccess(event)
  const client = await serverSupabaseServiceRole(event)

  const { data, error } = await client
    .from('shop_members')
    .select('shop_id,role,shops:shop_id(id,name,slug,city_id,is_active,cities(id,name,slug,is_active))')
    .eq('user_id', access.userId)

  if (error) {
    console.error('[dashboard/manager/cities] load failed:', error)
    return { ok: false as const, items: [] }
  }

  const rows = (data ?? []) as Row[]
  const byCity = new Map<string, {
    cityId: string
    cityName: string
    citySlug: string
    cityActive: boolean
    shopCount: number
    activeShopCount: number
    managerRoles: Set<string>
    shops: Array<{ id: string; name: string; slug: string; isActive: boolean; memberRole: string }>
  }>()

  for (const row of rows) {
    const shop = row.shops
    if (!shop || !shop.city_id) continue
    const cityRow = Array.isArray(shop.cities) ? shop.cities[0] : shop.cities
    if (!cityRow?.id || !cityRow?.slug) continue

    const key = cityRow.id
    const current = byCity.get(key) || {
      cityId: cityRow.id,
      cityName: cityRow.name || cityRow.slug,
      citySlug: cityRow.slug,
      cityActive: cityRow.is_active !== false,
      shopCount: 0,
      activeShopCount: 0,
      managerRoles: new Set<string>(),
      shops: [],
    }

    current.shopCount += 1
    if (shop.is_active) current.activeShopCount += 1
    current.managerRoles.add(String(row.role || 'staff'))
    current.shops.push({
      id: shop.id,
      name: shop.name,
      slug: shop.slug,
      isActive: shop.is_active === true,
      memberRole: String(row.role || 'staff'),
    })
    byCity.set(key, current)
  }

  const items = Array.from(byCity.values())
    .sort((a, b) => a.cityName.localeCompare(b.cityName))
    .map((x) => ({
      cityId: x.cityId,
      cityName: x.cityName,
      citySlug: x.citySlug,
      cityActive: x.cityActive,
      shopCount: x.shopCount,
      activeShopCount: x.activeShopCount,
      managerRoles: Array.from(x.managerRoles.values()),
      shops: x.shops.sort((a, b) => a.name.localeCompare(b.name)),
    }))

  return {
    ok: true as const,
    userId: access.userId,
    items,
  }
})
