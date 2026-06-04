import { createError, defineEventHandler, getHeader } from 'h3'
import { runWeekendSourceHealthCheck } from '~/server/utils/sourceWeekendHealthCheck'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const secret = String((config as { cronWebSourcesSecret?: string }).cronWebSourcesSecret || '').trim()
  if (!secret) {
    throw createError({ statusCode: 503, statusMessage: 'Cron secret not configured' })
  }
  const header = String(getHeader(event, 'x-cron-secret') || '').trim()
  if (header !== secret) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const result = await runWeekendSourceHealthCheck(event)
  return { ok: true, ...result }
})
