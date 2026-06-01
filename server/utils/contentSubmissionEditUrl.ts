import { getRequestURL, type H3Event } from 'h3'

export type ContentSubmissionEditLinks = {
  /** Прямой HTTPS URL формы (MAX, браузер). */
  httpsUrl: string | null
  /** Deep link в Mini App через бота (работает из групповых чатов). */
  telegramUrl: string | null
}

export function resolveAppBaseUrl(event: H3Event): string {
  const config = useRuntimeConfig(event)
  const raw = String(config.appUrl || process.env.NUXT_APP_URL || '').trim()
  if (raw) {
    try {
      const normalized = raw.startsWith('http') ? raw : `https://${raw}`
      const parsed = new URL(normalized)
      return `${parsed.protocol}//${parsed.host}`
    } catch {
      return raw.replace(/\/$/, '')
    }
  }
  try {
    const url = getRequestURL(event)
    return `${url.protocol}//${url.host}`
  } catch {
    return ''
  }
}

export const CONTENT_SUBMISSION_EDIT_PATH = '/content-submission/edit'

/** Публичная страница события на витрине города. */
export function buildPublicEventPagePath(citySlug: string, eventSlug: string): string | null {
  const city = citySlug.trim()
  const slug = eventSlug.trim()
  if (!city || !slug) return null
  return `/${city}/events/${slug}`
}

/** HTTPS-ссылка на событие; без `NUXT_APP_URL` — только path. */
export function buildPublicEventPageUrl(
  event: H3Event,
  args: { citySlug: string; eventSlug: string },
): string | null {
  const path = buildPublicEventPagePath(args.citySlug, args.eventSlug)
  if (!path) return null
  const base = resolveAppBaseUrl(event)
  return base ? `${base.replace(/\/$/, '')}${path}` : path
}

export function buildContentSubmissionEditLinks(
  event: H3Event,
  args: { submissionId: string; citySlug: string },
): ContentSubmissionEditLinks {
  const base = resolveAppBaseUrl(event)
  const submissionId = args.submissionId.trim()
  if (!base || !submissionId) {
    return { httpsUrl: null, telegramUrl: null }
  }

  const params = new URLSearchParams()
  if (args.citySlug.trim()) params.set('city', args.citySlug.trim())
  const q = params.toString()
  const httpsUrl = `${base}${CONTENT_SUBMISSION_EDIT_PATH}/${encodeURIComponent(submissionId)}${q ? `?${q}` : ''}`

  // t.me?startapp= даёт BOT_INVALID, если Mini App не привязан в BotFather — не используем в группах.
  return { httpsUrl, telegramUrl: httpsUrl }
}

/** @deprecated Используйте buildContentSubmissionEditLinks */
export function buildContentSubmissionEditUrl(
  event: H3Event,
  args: { submissionId: string; citySlug: string },
): string | null {
  const links = buildContentSubmissionEditLinks(event, args)
  return links.telegramUrl || links.httpsUrl
}
