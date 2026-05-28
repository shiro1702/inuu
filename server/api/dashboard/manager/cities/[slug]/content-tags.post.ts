import { createError, defineEventHandler, readBody } from 'h3'
import { resolveManagerCityScopeOrThrow } from '~/server/utils/managerCityAccess'
import { createCityContentTag } from '~/server/utils/cityContentTaxonomy'

type Body = { name?: string }

export default defineEventHandler(async (event) => {
  const slug = typeof event.context.params?.slug === 'string' ? event.context.params.slug : ''
  const scope = await resolveManagerCityScopeOrThrow(event, slug)
  const body = await readBody<Body>(event).catch(() => ({}))
  const name = String(body.name || '').trim()
  if (name.length < 2) {
    throw createError({ statusCode: 400, statusMessage: 'Tag name is required' })
  }
  const item = await createCityContentTag(event, scope.cityId, name)
  return { ok: true as const, item }
})
