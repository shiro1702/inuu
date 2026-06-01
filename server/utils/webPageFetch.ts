import {
  fetchTelegramWebPreviewHtml,
  resolveTelegramWebPreviewUrl,
} from '~/server/utils/telegramWebPreview'

const FETCH_TIMEOUT_MS = 8000
const USER_AGENT = 'INUU-ContentBot/1.0 (+https://inuu.ru)'

export type FetchedWebPage = {
  html: string
  finalUrl: string
  contentType: string
}

function getFirecrawlKey(): string {
  try {
    const config = useRuntimeConfig()
    return String((config as { firecrawlApiKey?: string }).firecrawlApiKey || process.env.FIRECRAWL_API_KEY || '').trim()
  } catch {
    return String(process.env.FIRECRAWL_API_KEY || '').trim()
  }
}

async function fetchViaFirecrawl(url: string, apiKey: string): Promise<FetchedWebPage | null> {
  try {
    const res = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ url, formats: ['html', 'markdown'] }),
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    })
    if (!res.ok) return null
    const data = (await res.json().catch(() => null)) as {
      data?: { html?: string; markdown?: string; metadata?: { sourceURL?: string } }
      html?: string
      markdown?: string
    } | null
    const finalUrl = data?.data?.metadata?.sourceURL || url
    const html = data?.data?.html || data?.html
    if (typeof html === 'string' && html.trim()) {
      return { html, finalUrl, contentType: 'text/html' }
    }
    const md = data?.data?.markdown || data?.markdown
    if (typeof md === 'string' && md.trim()) {
      return {
        html: `<article class="firecrawl-markdown">${md.replace(/</g, '&lt;')}</article>`,
        finalUrl,
        contentType: 'text/html',
      }
    }
    return null
  } catch {
    return null
  }
}

export async function fetchWebPageHtml(url: string): Promise<FetchedWebPage | null> {
  const telegramPreviewUrl = resolveTelegramWebPreviewUrl(url)
  if (telegramPreviewUrl) {
    const html = await fetchTelegramWebPreviewHtml(url)
    if (html) {
      return { html, finalUrl: telegramPreviewUrl, contentType: 'text/html' }
    }
    return null
  }
  if (/^https?:\/\/(t\.me|telegram\.me)\//i.test(url)) {
    return null
  }

  const firecrawlKey = getFirecrawlKey()
  if (firecrawlKey) {
    const viaFirecrawl = await fetchViaFirecrawl(url, firecrawlKey)
    if (viaFirecrawl) return viaFirecrawl
  }

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'text/html,application/xhtml+xml,text/plain;q=0.9,*/*;q=0.8',
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    })
    if (!res.ok) return null
    const contentType = String(res.headers.get('content-type') || '').toLowerCase()
    const body = await res.text()
    const finalUrl = res.url || url
    if (contentType.includes('text/html') || body.trim().startsWith('<')) {
      return { html: body, finalUrl, contentType: contentType || 'text/html' }
    }
    if (contentType.includes('text/plain') || contentType.includes('text/markdown')) {
      return {
        html: `<pre>${body.replace(/</g, '&lt;')}</pre>`,
        finalUrl,
        contentType,
      }
    }
    return null
  } catch {
    return null
  }
}
