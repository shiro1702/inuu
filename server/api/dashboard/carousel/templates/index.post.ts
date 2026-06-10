import { createError, defineEventHandler, readBody } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import { requireDashboardAccess } from '~/server/utils/dashboard'
import { resolveManagerCityScopeOrThrow } from '~/server/utils/managerCityAccess'

type Body = {
  name?: string
  city_slug?: string
  theme_id?: string
  project_type?: string
  layout_config?: Record<string, unknown>
  preview_url?: string
}

export default defineEventHandler(async (event) => {
  const access = await requireDashboardAccess(event)
  const body = await readBody<Body>(event)
  const name = body?.name?.trim()
  if (!name) throw createError({ statusCode: 400, statusMessage: 'name is required' })

  let cityId: string | null = null
  if (body?.city_slug) {
    const scope = await resolveManagerCityScopeOrThrow(event, body.city_slug)
    cityId = scope.cityId
  }

  const client = await serverSupabaseServiceRole(event)
  const { data, error } = await client
    .from('user_templates')
    .insert({
      user_id: access.userId,
      city_id: cityId,
      name,
      theme_id: body?.theme_id || 'minimal-ios',
      project_type: body?.project_type || 'carousel',
      layout_config: body?.layout_config || {},
      preview_url: body?.preview_url || null,
    })
    .select('*')
    .single()

  if (error || !data) {
    throw createError({ statusCode: 500, statusMessage: error?.message || 'Failed to save template' })
  }

  return { ok: true as const, template: data }
})
