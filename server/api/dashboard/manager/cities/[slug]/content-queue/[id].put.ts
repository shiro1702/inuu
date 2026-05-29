import { createError, defineEventHandler, readBody } from 'h3'
import { resolveManagerCityScopeOrThrow } from '~/server/utils/managerCityAccess'
import { patchContentSubmissionRecord } from '~/server/utils/contentSubmissionPayload'

type Body = {
  title?: string | null
  description?: string | null
  categorySlug?: string | null
  registrationUrl?: string | null
  topicTags?: string[]
  editorialScore?: number | null
}

export default defineEventHandler(async (event) => {
  const slug = typeof event.context.params?.slug === 'string' ? event.context.params.slug : ''
  const id = typeof event.context.params?.id === 'string' ? event.context.params.id : ''
  const scope = await resolveManagerCityScopeOrThrow(event, slug)
  if (!id.trim()) throw createError({ statusCode: 400, statusMessage: 'Submission id is required' })

  const body = await readBody<Body>(event).catch(() => ({}))
  const item = await patchContentSubmissionRecord(event, {
    cityId: scope.cityId,
    submissionId: id,
    body,
  })

  return { ok: true as const, item }
})
