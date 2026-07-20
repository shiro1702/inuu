import { createError, defineEventHandler } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import { assertCronWebSourcesSecret } from '~/server/utils/cronWebSourcesAuth'
import { runDashboardTelegramSourceCrawl } from '~/server/utils/dashboardTelegramSourceCrawl'
import { ingestCityScopeFromJoin } from '~/server/utils/ingestCityScope'
import { runOrScheduleBackground } from '~/server/utils/scheduleBackgroundWork'

export default defineEventHandler(async (event) => {
  assertCronWebSourcesSecret(event)

  const sourceId = typeof event.context.params?.id === 'string' ? event.context.params.id : ''
  if (!sourceId) {
    throw createError({ statusCode: 400, statusMessage: 'Source id is required' })
  }

  const client = await serverSupabaseServiceRole(event)
  const { data, error } = await client
    .from('city_telegram_sources')
    .select('id,city_id,is_active,cities!inner(slug,name)')
    .eq('id', sourceId)
    .maybeSingle()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }
  if (!data?.id || data.is_active === false) {
    throw createError({ statusCode: 404, statusMessage: 'Telegram source not found' })
  }

  const scope = ingestCityScopeFromJoin(data)
  if (!scope) {
    throw createError({ statusCode: 500, statusMessage: 'City scope is incomplete' })
  }

  const { scheduled } = await runOrScheduleBackground(event, () =>
    runDashboardTelegramSourceCrawl({
      event,
      scope,
      sourceId,
      options: { persist: true },
    }),
  )

  return { ok: true, accepted: true, scheduled, kind: 'telegram', sourceId }
})
