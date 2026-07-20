import { defineEventHandler } from 'h3'
import { assertCronWebSourcesSecret } from '~/server/utils/cronWebSourcesAuth'
import { runWeekendSourceHealthCheck } from '~/server/utils/sourceWeekendHealthCheck'

export default defineEventHandler(async (event) => {
  assertCronWebSourcesSecret(event)

  const result = await runWeekendSourceHealthCheck(event)
  return { ok: true, ...result }
})
