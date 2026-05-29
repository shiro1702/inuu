import { createError, defineEventHandler, getQuery } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import { assertContentModerationAccess } from '~/server/utils/contentModerationAccess'
import { listCityContentTags, listCityEventCategories } from '~/server/utils/cityContentTaxonomy'

export default defineEventHandler(async (event) => {
  const slug = typeof event.context.params?.slug === 'string' ? event.context.params.slug : ''
  const query = getQuery(event)
  const submissionId = typeof query.submissionId === 'string' ? query.submissionId.trim() : ''
  if (!submissionId) {
    throw createError({ statusCode: 400, statusMessage: 'submissionId query is required' })
  }

  const scope = await assertContentModerationAccess(event, submissionId)
  if (scope.citySlug !== slug.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'City slug does not match submission' })
  }

  const kind = query.kind === 'category' ? 'category' : 'tags'
  const q = typeof query.q === 'string' ? query.q : ''

  if (kind === 'category') {
    const items = await listCityEventCategories(event, scope.cityId, q)
    return { ok: true as const, kind, items }
  }

  const items = await listCityContentTags(event, scope.cityId, q)
  return { ok: true as const, kind, items }
})
