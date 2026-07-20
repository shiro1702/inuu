import { createError, getHeader, type H3Event } from 'h3'

export function assertCronWebSourcesSecret(event: H3Event): void {
  const config = useRuntimeConfig(event)
  const secret = String((config as { cronWebSourcesSecret?: string }).cronWebSourcesSecret || '').trim()
  if (!secret) {
    throw createError({ statusCode: 503, statusMessage: 'Cron secret not configured' })
  }
  const header = String(getHeader(event, 'x-cron-secret') || '').trim()
  if (header !== secret) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }
}

export function cronWebSourcesSecretHeader(event: H3Event): Record<string, string> {
  const config = useRuntimeConfig(event)
  const secret = String((config as { cronWebSourcesSecret?: string }).cronWebSourcesSecret || '').trim()
  return { 'x-cron-secret': secret }
}
