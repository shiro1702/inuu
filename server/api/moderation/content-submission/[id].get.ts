import { createError, defineEventHandler } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import { assertContentModerationAccess } from '~/server/utils/contentModerationAccess'
import { listCityContentTags, listCityEventCategories } from '~/server/utils/cityContentTaxonomy'

export default defineEventHandler(async (event) => {
  const id = typeof event.context.params?.id === 'string' ? event.context.params.id : ''
  const scope = await assertContentModerationAccess(event, id)

  const client = await serverSupabaseServiceRole(event)
  const { data, error } = await client
    .from('content_submissions')
    .select('id,kind,status,payload,editorial_score,source_kind,source_url,updated_at')
    .eq('id', scope.submissionId)
    .eq('city_id', scope.cityId)
    .maybeSingle()

  if (error || !data?.id) {
    throw createError({ statusCode: 404, statusMessage: 'Submission not found' })
  }

  const [tags, categories] = await Promise.all([
    listCityContentTags(event, scope.cityId),
    listCityEventCategories(event, scope.cityId),
  ])

  return {
    ok: true as const,
    city: { slug: scope.citySlug, name: scope.cityName },
    item: data,
    taxonomy: { tags, categories },
  }
})
