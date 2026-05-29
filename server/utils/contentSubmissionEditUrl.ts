import type { H3Event } from 'h3'

/** URL мини-приложения редактирования заявки (Telegram web_app / MAX link). */
export function buildContentSubmissionEditUrl(
  event: H3Event,
  args: { submissionId: string; citySlug: string },
): string | null {
  const config = useRuntimeConfig(event)
  const base = String(config.appUrl || process.env.NUXT_APP_URL || '').trim().replace(/\/$/, '')
  if (!base || !args.submissionId.trim()) return null
  const params = new URLSearchParams()
  if (args.citySlug.trim()) params.set('city', args.citySlug.trim())
  const q = params.toString()
  return `${base}/moderation/content-submission/${encodeURIComponent(args.submissionId.trim())}${q ? `?${q}` : ''}`
}
