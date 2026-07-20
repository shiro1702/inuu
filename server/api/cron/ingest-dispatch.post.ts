import { createError, defineEventHandler } from 'h3'
import { assertCronWebSourcesSecret, cronWebSourcesSecretHeader } from '~/server/utils/cronWebSourcesAuth'
import { listCronIngestCrawlTargets } from '~/server/utils/cronIngestCrawlTargets'

export default defineEventHandler(async (event) => {
  assertCronWebSourcesSecret(event)

  const config = useRuntimeConfig(event)
  const appUrl = String(config.appUrl || '').trim().replace(/\/$/, '')
  if (!appUrl) {
    throw createError({
      statusCode: 503,
      statusMessage: 'NUXT_APP_URL is not configured (required for ingest fan-out dispatch)',
    })
  }

  const { targets, skippedDuplicates } = await listCronIngestCrawlTargets(event)
  const headers = {
    ...cronWebSourcesSecretHeader(event),
    'content-type': 'application/json',
  }

  const results = await Promise.allSettled(
    targets.map(async (target) => {
      const path = target.kind === 'web'
        ? `/api/internal/ingest-crawl/web/${target.id}`
        : `/api/internal/ingest-crawl/telegram/${target.id}`
      const res = await fetch(`${appUrl}${path}`, { method: 'POST', headers })
      if (!res.ok) {
        const body = await res.text().catch(() => '')
        throw new Error(`${target.kind}:${target.id} HTTP ${res.status} ${body.slice(0, 200)}`)
      }
      return target
    }),
  )

  const dispatched = results.filter((item) => item.status === 'fulfilled').length
  const failed = results
    .map((item, index) => ({ item, target: targets[index] }))
    .filter(({ item }) => item.status === 'rejected')
    .map(({ item, target }) => ({
      kind: target?.kind,
      id: target?.id,
      label: target?.label,
      error: item.status === 'rejected'
        ? (item.reason instanceof Error ? item.reason.message : String(item.reason))
        : 'unknown_error',
    }))

  return {
    ok: failed.length === 0,
    dispatched,
    failed: failed.length,
    web: targets.filter((item) => item.kind === 'web').length,
    telegram: targets.filter((item) => item.kind === 'telegram').length,
    skippedDuplicates,
    errors: failed,
  }
})
