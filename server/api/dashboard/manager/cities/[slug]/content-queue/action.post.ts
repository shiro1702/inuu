import { createError, defineEventHandler, readBody } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import { resolveManagerCityScopeOrThrow } from '~/server/utils/managerCityAccess'
import { publishContentSubmission } from '~/server/utils/contentSubmissionPublish'
import { showPostApproveScoreKeyboard } from '~/server/utils/inuuContentModeration'

type Body = {
  submissionId?: string
  action?: 'approve' | 'reject' | 'needs_revision' | 'score'
  score?: number | null
  rejectComment?: string | null
}

export default defineEventHandler(async (event) => {
  const slug = typeof event.context.params?.slug === 'string' ? event.context.params.slug : ''
  const scope = await resolveManagerCityScopeOrThrow(event, slug)
  const body = await readBody<Body>(event).catch(() => ({}))
  const submissionId = String(body.submissionId || '').trim()
  const action = String(body.action || '').trim()

  if (!submissionId) throw createError({ statusCode: 400, statusMessage: 'submissionId is required' })
  if (!['approve', 'reject', 'needs_revision', 'score'].includes(action)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid action' })
  }

  const client = await serverSupabaseServiceRole(event)
  const { data: current, error: currentError } = await client
    .from('content_submissions')
    .select('id,city_id,status,editorial_score')
    .eq('id', submissionId)
    .eq('city_id', scope.cityId)
    .maybeSingle()

  if (currentError || !current?.id) {
    throw createError({ statusCode: 404, statusMessage: 'Submission not found in manager city scope' })
  }

  const patch: Record<string, unknown> = {}
  if (action === 'approve') patch.status = 'approved'
  if (action === 'reject') {
    patch.status = 'rejected'
    patch.reject_comment = body.rejectComment ? String(body.rejectComment).trim() : null
  }
  if (action === 'needs_revision') patch.status = 'needs_revision'
  if (action === 'score') {
    const raw = Number(body.score)
    patch.editorial_score = Number.isFinite(raw) ? Math.max(1, Math.min(5, Math.round(raw))) : null
  }

  const { data, error } = await client
    .from('content_submissions')
    .update(patch as any)
    .eq('id', submissionId)
    .eq('city_id', scope.cityId)
    .select('id,status,editorial_score,reject_comment,updated_at,published_entity_type,published_entity_id')
    .maybeSingle()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message || 'Failed to apply queue action' })
  }

  let published: Awaited<ReturnType<typeof publishContentSubmission>> | null = null
  if (action === 'approve') {
    published = await publishContentSubmission(event, submissionId)
    if (published.entityType === 'event') {
      const config = useRuntimeConfig(event)
      const botToken = String((event.context.tenant as any)?.telegramBotToken || config.botToken || '').trim()
      if (botToken) {
        const publicPath = `/${scope.citySlug}/events/${published.entitySlug}`
        await showPostApproveScoreKeyboard(event, {
          submissionId,
          botToken,
          publishPath: publicPath,
        }).catch((err) => console.error('[content-queue] post-approve score UI:', err))
      }
    }
  }

  return {
    ok: true as const,
    item: data || null,
    published: published
      ? {
          entityType: published.entityType,
          entityId: published.entityId,
          entitySlug: published.entitySlug,
          alreadyPublished: published.alreadyPublished,
          publicPath:
            published.entityType === 'event'
              ? `/${scope.citySlug}/events/${published.entitySlug}`
              : null,
        }
      : null,
  }
})
