import { createError, defineEventHandler } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import { requireDashboardAccess } from '~/server/utils/dashboard'

type ShopMemberRow = {
  shop_id: string
  role: string
  shops: {
    id: string
    city_id: string | null
    slug: string
    name: string
    is_active: boolean
    cities?: { id: string; slug: string; name: string } | Array<{ id: string; slug: string; name: string }> | null
  } | null
}

export default defineEventHandler(async (event) => {
  const access = await requireDashboardAccess(event)
  const slug = typeof event.context.params?.slug === 'string' ? event.context.params.slug.trim() : ''
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'City slug is required' })
  }

  const client = await serverSupabaseServiceRole(event)
  const { data: memberships, error: membershipsError } = await client
    .from('shop_members')
    .select('shop_id,role,shops:shop_id(id,city_id,slug,name,is_active,cities(id,slug,name))')
    .eq('user_id', access.userId)

  if (membershipsError) {
    throw createError({ statusCode: 500, statusMessage: membershipsError.message || 'Failed to resolve manager cities' })
  }

  const rows = (memberships ?? []) as ShopMemberRow[]
  const cityShops = rows.filter((row) => {
    const city = Array.isArray(row.shops?.cities) ? row.shops?.cities[0] : row.shops?.cities
    return city?.slug === slug && row.shops?.id
  })

  if (!cityShops.length) {
    throw createError({ statusCode: 403, statusMessage: 'No manager access for this city' })
  }

  const shopIds = cityShops.map((x) => String(x.shop_id))
  const cityMeta = Array.isArray(cityShops[0].shops?.cities) ? cityShops[0].shops?.cities[0] : cityShops[0].shops?.cities
  const cityId = cityMeta?.id || cityShops[0].shops?.city_id || null
  if (!cityId) {
    throw createError({ statusCode: 500, statusMessage: 'City ID is missing for manager access scope' })
  }

  const [shopsCountRes, venuesCountRes, eventsCountRes, bookingsCountRes] = await Promise.all([
    client.from('shops').select('id', { count: 'exact', head: true }).in('id', shopIds),
    client.from('venues').select('id', { count: 'exact', head: true }).in('shop_id', shopIds),
    client.from('events').select('id', { count: 'exact', head: true }).in('shop_id', shopIds),
    client.from('bookings').select('id', { count: 'exact', head: true }).in('shop_id', shopIds),
  ])

  const shopsCount = shopsCountRes.count ?? 0
  const venuesCount = venuesCountRes.count ?? 0
  const eventsCount = eventsCountRes.count ?? 0
  const bookingsCount = bookingsCountRes.count ?? 0

  return {
    ok: true as const,
    city: {
      id: cityId,
      slug,
      name: cityMeta?.name || slug,
    },
    scope: {
      managerUserId: access.userId,
      shopIds,
    },
    metrics: {
      shopsCount,
      venuesCount,
      eventsCount,
      bookingsCount,
    },
    shops: cityShops.map((x) => ({
      id: x.shops?.id,
      slug: x.shops?.slug,
      name: x.shops?.name,
      isActive: x.shops?.is_active === true,
      memberRole: x.role,
    })),
  }
})
