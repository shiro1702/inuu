import { createError, defineEventHandler } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import { resolveManagerCityScopeOrThrow } from '~/server/utils/managerCityAccess'
import { notifyContentSubmissionTelegramChats } from '~/server/utils/inuuContentModeration'

export default defineEventHandler(async (event) => {
  const slug = typeof event.context.params?.slug === 'string' ? event.context.params.slug : ''
  const submissionId = typeof event.context.params?.id === 'string' ? event.context.params.id : ''
  const scope = await resolveManagerCityScopeOrThrow(event, slug)

  if (!submissionId) {
    throw createError({ statusCode: 400, statusMessage: 'Submission id is required' })
  }

  const config = useRuntimeConfig(event)
  const botToken = String((event.context.tenant as any)?.telegramBotToken || config.botToken || '').trim()
  if (!botToken) {
    throw createError({ statusCode: 500, statusMessage: 'Telegram bot token is not configured' })
  }

  const client = await serverSupabaseServiceRole(event)
  const { data: submission, error } = await client
    .from('content_submissions')
    .select('id,city_id,status')
    .eq('id', submissionId)
    .eq('city_id', scope.cityId)
    .maybeSingle()

  if (error || !submission?.id) {
    throw createError({ statusCode: 404, statusMessage: 'Submission not found' })
  }

  await notifyContentSubmissionTelegramChats(event, {
    submissionId: String(submission.id),
    cityId: scope.cityId,
    botToken,
    force: true,
  })

  return { ok: true as const, submissionId: String(submission.id) }
})
