import { createError, defineEventHandler, getQuery, readBody } from 'h3'
import {
  createCityContentTag,
  createCityEventCategory,
} from '~/server/utils/cityContentTaxonomy'
import { assertContentModerationAccess } from '~/server/utils/contentModerationAccess'

type Body = { name?: string }

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
  const body = await readBody<Body>(event).catch(() => ({}))
  const name = String(body.name || '').trim()
  if (name.length < 2) {
    throw createError({ statusCode: 400, statusMessage: 'Name is required' })
  }

  const item = kind === 'category'
    ? await createCityEventCategory(event, scope.cityId, name)
    : await createCityContentTag(event, scope.cityId, name)

  return { ok: true as const, kind, item }
})
