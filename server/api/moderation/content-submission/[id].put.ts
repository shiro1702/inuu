import { defineEventHandler, readBody } from 'h3'
import { assertContentModerationAccess } from '~/server/utils/contentModerationAccess'
import {
  patchContentSubmissionRecord,
  type ContentSubmissionPayloadPatch,
} from '~/server/utils/contentSubmissionPayload'
import { refreshContentSubmissionModerationCard } from '~/server/utils/inuuContentModeration'

export default defineEventHandler(async (event) => {
  const id = typeof event.context.params?.id === 'string' ? event.context.params.id : ''
  const scope = await assertContentModerationAccess(event, id)
  const body = await readBody<ContentSubmissionPayloadPatch>(event).catch(() => ({}))

  const item = await patchContentSubmissionRecord(event, {
    cityId: scope.cityId,
    submissionId: scope.submissionId,
    body,
  })

  const config = useRuntimeConfig(event)
  const botToken = String(
    (event.context.tenant as { telegramBotToken?: string } | undefined)?.telegramBotToken
      || config.botToken
      || '',
  ).trim()
  if (botToken && scope.channel === 'telegram') {
    await refreshContentSubmissionModerationCard(event, {
      submissionId: scope.submissionId,
      botToken,
    }).catch((err) => console.error('[moderation/content-submission] refresh TG card:', err))
  }

  return { ok: true as const, item }
})
