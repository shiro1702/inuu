import { createError, defineEventHandler, readBody } from 'h3'
import type { CuratedTagMode } from '~/server/utils/curatedListSelection'
import { resolveManagerCityScopeOrThrow } from '~/server/utils/managerCityAccess'
import { runCityDigestGeneration } from '~/server/utils/cityDigestGeneration'

type Body = {
  mode?: 'weekly' | 'custom'
  categorySlug?: string | null
  topicTags?: string[]
  tagsMode?: CuratedTagMode
  limit?: number
  minScore?: number
}

export default defineEventHandler(async (event) => {
  const slugParam = typeof event.context.params?.slug === 'string' ? event.context.params.slug : ''
  const scope = await resolveManagerCityScopeOrThrow(event, slugParam)
  const body = await readBody<Body>(event).catch(() => ({} as Body))
  const mode = body.mode === 'custom' ? 'custom' : 'weekly'

  const config = useRuntimeConfig(event)
  const botToken = String((event.context.tenant as any)?.telegramBotToken || config.botToken || '').trim()
  const result = await runCityDigestGeneration(event, {
    mode,
    cityId: scope.cityId,
    categorySlug: body.categorySlug || null,
    topicTags: Array.isArray(body.topicTags) ? body.topicTags : [],
    tagsMode: body.tagsMode === 'and' ? 'and' : 'or',
    limit: body.limit,
    minScore: body.minScore,
    botToken,
  })

  if (!result.ok) {
    throw createError({ statusCode: 500, statusMessage: 'Digest generation failed' })
  }
  return {
    ok: true as const,
    city: {
      id: scope.cityId,
      slug: scope.citySlug,
      name: scope.cityName,
    },
    ...result,
  }
})
