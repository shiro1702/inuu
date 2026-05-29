import { getRequestURL, type H3Event } from 'h3'

export type ContentSubmissionEditLinks = {
  /** Прямой HTTPS URL формы (MAX, браузер). */
  httpsUrl: string | null
  /** Deep link в Mini App через бота (работает из групповых чатов). */
  telegramUrl: string | null
}

function resolveAppBaseUrl(event: H3Event): string {
  const config = useRuntimeConfig(event)
  const fromConfig = String(config.appUrl || process.env.NUXT_APP_URL || '').trim().replace(/\/$/, '')
  if (fromConfig) return fromConfig
  try {
    const url = getRequestURL(event)
    return `${url.protocol}//${url.host}`.replace(/\/$/, '')
  } catch {
    return ''
  }
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
  const httpsUrl = `${base}/moderation/content-submission/${encodeURIComponent(submissionId)}${q ? `?${q}` : ''}`

  const config = useRuntimeConfig(event)
  const botName = String(config.public?.telegramBotName || process.env.NUXT_TELEGRAM_BOT_NAME || '')
    .trim()
    .replace(/^@/, '')
  const startapp = `cedit_${submissionId}`
  const telegramUrl = botName
    ? `https://t.me/${botName}?startapp=${encodeURIComponent(startapp)}`
    : httpsUrl

  return { httpsUrl, telegramUrl }
}

/** @deprecated Используйте buildContentSubmissionEditLinks */
export function buildContentSubmissionEditUrl(
  event: H3Event,
  args: { submissionId: string; citySlug: string },
): string | null {
  const links = buildContentSubmissionEditLinks(event, args)
  return links.telegramUrl || links.httpsUrl
}
