import { createError, defineEventHandler, getHeader } from 'h3'
import { dispatchTelegramQueue } from '~/server/utils/telegramQueueWorker'

/** Manual / external cron (GitHub Actions, cron-job.org). Not in vercel.json on Hobby — minute schedules block deploy. */
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
