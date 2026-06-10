import { createError, type H3Event } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import { requireDashboardAccess } from '~/server/utils/dashboard'
import { resolveManagerCityScopeOrThrow } from '~/server/utils/managerCityAccess'

export type GeneratedCarouselRow = {
  id: string
  created_at: string
  updated_at: string
  created_by: string | null
  city_id: string | null
  title: string
  project_type: string
  theme_id: string
  aspect: string
  settings: Record<string, unknown>
  slides: unknown[]
}

export async function assertGeneratedCarouselAccess(
  event: H3Event,
  row: Pick<GeneratedCarouselRow, 'city_id' | 'created_by'>,
): Promise<{ userId: string }> {
  const access = await requireDashboardAccess(event)
  if (row.created_by && row.created_by === access.userId) {
    return { userId: access.userId }
  }
  if (!row.city_id) {
    throw createError({ statusCode: 403, statusMessage: 'No access to this carousel project' })
  }

  const client = await serverSupabaseServiceRole(event)
  const { data, error } = await client
    .from('shop_members')
    .select('shop_id, shops:shop_id(city_id)')
    .eq('user_id', access.userId)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message || 'Failed to verify access' })
  }

  const hasCity = (data ?? []).some((member) => {
    const shop = member.shops as { city_id?: string | null } | null
    return shop?.city_id === row.city_id
  })

  if (!hasCity) {
    throw createError({ statusCode: 403, statusMessage: 'No access to this carousel project' })
  }

  return { userId: access.userId }
}

export async function resolveCityIdForCarouselCreate(
  event: H3Event,
  citySlug: string,
): Promise<{ userId: string; cityId: string; citySlug: string; cityName: string }> {
  const scope = await resolveManagerCityScopeOrThrow(event, citySlug)
  return {
    userId: scope.userId,
    cityId: scope.cityId,
    citySlug: scope.citySlug,
    cityName: scope.cityName,
  }
}

export async function fetchGeneratedCarouselOrThrow(
  event: H3Event,
  id: string,
): Promise<GeneratedCarouselRow> {
  const client = await serverSupabaseServiceRole(event)
  const { data, error } = await client
    .from('generated_carousels')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message || 'Failed to load carousel' })
  }
  if (!data) {
    throw createError({ statusCode: 404, statusMessage: 'Carousel project not found' })
  }

  const row = data as GeneratedCarouselRow
  await assertGeneratedCarouselAccess(event, row)
  return row
}
