import { createError, defineEventHandler } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import { resolveManagerCityScopeOrThrow } from '~/server/utils/managerCityAccess'

export default defineEventHandler(async (event) => {
  const slugParam = typeof event.context.params?.slug === 'string' ? event.context.params.slug : ''
  const campaignId = typeof event.context.params?.id === 'string' ? event.context.params.id : ''
  if (!campaignId) {
    throw createError({ statusCode: 400, statusMessage: 'Campaign id is required' })
  }

  const scope = await resolveManagerCityScopeOrThrow(event, slugParam)
  const client = await serverSupabaseServiceRole(event)

  const { data: row, error } = await client
    .from('story_campaigns')
    .select('id, title, preview_url, placement, is_active, targeting, created_at')
    .eq('id', campaignId)
    .eq('city_id', scope.cityId)
    .maybeSingle()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message || 'Failed to load campaign' })
  }
  if (!row?.id) {
    throw createError({ statusCode: 404, statusMessage: 'Story campaign not found' })
  }

  const targeting = (row as { targeting?: unknown }).targeting
  const slideDraft =
    targeting && typeof targeting === 'object' && !Array.isArray(targeting)
      ? (targeting as { slide_draft?: unknown }).slide_draft
      : null

  return {
    ok: true as const,
    campaign: {
      id: row.id,
      title: (row as { title: string }).title,
      previewUrl: (row as { preview_url?: string }).preview_url,
      targeting,
      slideDraft,
    },
    city: { slug: scope.citySlug, name: scope.cityName },
  }
})
