import { createError, defineEventHandler, getHeader, readBody } from 'h3'
import type { CuratedTagMode } from '~/server/utils/curatedListSelection'
import { runCityDigestGeneration } from '~/server/utils/cityDigestGeneration'

type CronBody = {
  mode?: 'weekly' | 'custom'
  cityId?: string
  citySlug?: string
  categorySlug?: string
  topicTags?: string[]
  tagsMode?: CuratedTagMode
  limit?: number
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const secret = String((config as any).cronCityDigestSecret || '').trim()
  if (!secret) {
    throw createError({ statusCode: 503, statusMessage: 'Cron city digest secret not configured' })
  }
  const header = String(getHeader(event, 'x-cron-secret') || '').trim()
  if (header !== secret) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const rawBody = await readBody<CronBody>(event).catch(() => ({} as CronBody))
  return runCityDigestGeneration(event, {
    mode: rawBody.mode === 'custom' ? 'custom' : 'weekly',
    cityId: rawBody.cityId,
    citySlug: rawBody.citySlug,
    categorySlug: rawBody.categorySlug,
    topicTags: rawBody.topicTags,
    tagsMode: rawBody.tagsMode,
    limit: rawBody.limit,
    botToken: String((config as any).botToken || ''),
  })
})
