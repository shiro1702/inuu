import { defineEventHandler, getQuery } from 'h3'
import { createError } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import { requireDashboardAccess } from '~/server/utils/dashboard'
import { resolvePresetPublicUrl } from '~/server/utils/carouselImageMatcher'
import { resolveManagerCityScopeOrThrow } from '~/server/utils/managerCityAccess'

export default defineEventHandler(async (event) => {
  await requireDashboardAccess(event)
  const q = getQuery(event)
  const citySlug = typeof q.city === 'string' ? q.city.trim() : ''
  const vibe = typeof q.vibe === 'string' ? q.vibe.trim() : ''

  let cityId: string | null = null
  if (citySlug) {
    const scope = await resolveManagerCityScopeOrThrow(event, citySlug)
    cityId = scope.cityId
  }

  const client = await serverSupabaseServiceRole(event)
  let query = client.from('carousel_preset_images').select('*').limit(50)
  if (cityId) query = query.or(`city_id.eq.${cityId},city_id.is.null`)
  if (vibe) query = query.contains('vibe_slugs', [vibe])

  const { data, error } = await query
  if (error) throw createError({ statusCode: 500, statusMessage: error.message })

  const items = await Promise.all(
    ((data || []) as Array<{ id: string; storage_path: string; tags: string[]; folder: string }>).map(async (row) => ({
      ...row,
      url: await resolvePresetPublicUrl(event, row.storage_path),
    })),
  )

  return { ok: true as const, items }
})
