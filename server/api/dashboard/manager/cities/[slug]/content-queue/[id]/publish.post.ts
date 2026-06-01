import { createError, defineEventHandler } from 'h3'
import { resolveManagerCityScopeOrThrow } from '~/server/utils/managerCityAccess'
import { buildPublicEventPagePath, buildPublicEventPageUrl } from '~/server/utils/contentSubmissionEditUrl'
import { publishContentSubmission } from '~/server/utils/contentSubmissionPublish'
import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const slug = typeof event.context.params?.slug === 'string' ? event.context.params.slug : ''
  const submissionId = typeof event.context.params?.id === 'string' ? event.context.params.id : ''
  const scope = await resolveManagerCityScopeOrThrow(event, slug)

  if (!submissionId) {
    throw createError({ statusCode: 400, statusMessage: 'Submission id is required' })
  }

  const client = await serverSupabaseServiceRole(event)
  const { data: row } = await client
    .from('content_submissions')
    .select('id')
    .eq('id', submissionId)
    .eq('city_id', scope.cityId)
    .maybeSingle()

  if (!row?.id) {
    throw createError({ statusCode: 404, statusMessage: 'Submission not found' })
  }

  const published = await publishContentSubmission(event, submissionId)

  return {
    ok: true as const,
    published: {
      entityType: published.entityType,
      entityId: published.entityId,
      entitySlug: published.entitySlug,
      alreadyPublished: published.alreadyPublished,
      publicPath:
        published.entityType === 'event'
          ? buildPublicEventPagePath(scope.citySlug, published.entitySlug)
          : null,
      publicUrl:
        published.entityType === 'event'
          ? buildPublicEventPageUrl(event, {
              citySlug: scope.citySlug,
              eventSlug: published.entitySlug,
            })
          : null,
    },
  }
})
