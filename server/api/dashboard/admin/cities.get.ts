import { defineEventHandler, getQuery } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import { requirePlatformAdminAccess } from '~/server/utils/dashboardGlobal'

type CityRow = {
  id: string
  name: string
  slug: string
  timezone: string
  editorial_name: string | null
  is_active: boolean
}

export default defineEventHandler(async (event) => {
  const admin = await requirePlatformAdminAccess(event)
  const query = getQuery(event)
  const activeOnly = query.active_only === '1' || query.active_only === 'true'

  const client = await serverSupabaseServiceRole(event)
  let db = client
    .from('cities')
    .select('id,name,slug,timezone,editorial_name,is_active')
    .order('name', { ascending: true })
  if (activeOnly) db = db.eq('is_active', true)

  const { data, error } = await db
  if (error) {
    console.error('[dashboard/admin/cities] load failed:', error)
    return { ok: false as const, items: [] }
  }

  const rows = (data ?? []) as CityRow[]
  const cityIds = rows.map((x) => x.id)

  const [shopsRes, venuesRes, eventsRes] = await Promise.all([
    cityIds.length
      ? client.from('shops').select('id,city_id,is_active').in('city_id', cityIds)
      : Promise.resolve({ data: [], error: null } as any),
    cityIds.length
      ? client.from('venues').select('id,city_id,is_published,is_active').in('city_id', cityIds)
      : Promise.resolve({ data: [], error: null } as any),
    cityIds.length
      ? client.from('events').select('id,city_id,is_published,starts_at').in('city_id', cityIds)
      : Promise.resolve({ data: [], error: null } as any),
  ])

  const shops = (shopsRes.data ?? []) as Array<{ id: string; city_id: string; is_active: boolean }>
  const venues = (venuesRes.data ?? []) as Array<{ id: string; city_id: string; is_published: boolean; is_active: boolean }>
  const events = (eventsRes.data ?? []) as Array<{ id: string; city_id: string; is_published: boolean; starts_at: string | null }>
  const nowIso = new Date().toISOString()

  const items = rows.map((city) => {
    const cityShops = shops.filter((x) => x.city_id === city.id)
    const cityVenues = venues.filter((x) => x.city_id === city.id)
    const cityEvents = events.filter((x) => x.city_id === city.id)
    return {
      id: city.id,
      name: city.name,
      slug: city.slug,
      timezone: city.timezone,
      editorialName: city.editorial_name,
      isActive: city.is_active,
      metrics: {
        shopsTotal: cityShops.length,
        shopsActive: cityShops.filter((x) => x.is_active).length,
        venuesTotal: cityVenues.length,
        venuesPublished: cityVenues.filter((x) => x.is_published && x.is_active).length,
        eventsTotal: cityEvents.length,
        eventsPublished: cityEvents.filter((x) => x.is_published).length,
        eventsUpcoming: cityEvents.filter((x) => x.is_published && typeof x.starts_at === 'string' && x.starts_at >= nowIso).length,
      },
    }
  })

  return {
    ok: true as const,
    admin: {
      userId: admin.userId,
      role: admin.role,
    },
    items,
  }
})
