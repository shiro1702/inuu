import { createError, defineEventHandler, getHeader } from 'h3'
import { dispatchTelegramQueue } from '~/server/utils/telegramQueueWorker'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const secret = String(config.cronReviewPromptsSecret || '').trim()
  const header = getHeader(event, 'x-cron-secret')
  if (secret && header !== secret) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const result = await dispatchTelegramQueue(event, 10)
  return { ok: true as const, ...result }
})
