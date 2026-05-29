const URL_REGEX = /https?:\/\/[^\s<>"')\]]+/gi
const FETCH_TIMEOUT_MS = 8000
const MAX_EXTRACTED_CHARS = 8000
const MAX_URLS = 3

export function extractUrls(rawText: string): string[] {
  const matches = rawText.match(URL_REGEX) || []
  const normalized = matches
    .map((url) => url.replace(/[.,;:!?)]+$/, '').trim())
    .filter((url) => {
      try {
        const parsed = new URL(url)
        return parsed.protocol === 'http:' || parsed.protocol === 'https:'
      } catch {
        return false
      }
    })
  return [...new Set(normalized)].slice(0, MAX_URLS)
}

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/\s+/g, ' ')
    .trim()
}

async function fetchUrlPlainText(url: string): Promise<string | null> {
  if (/^https?:\/\/(t\.me|telegram\.me)\//i.test(url)) {
    return null
  }

  const config = useRuntimeConfig()
  const firecrawlKey = String((config as any).firecrawlApiKey || process.env.FIRECRAWL_API_KEY || '').trim()

  if (firecrawlKey) {
    try {
      const res = await fetch('https://api.firecrawl.dev/v1/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${firecrawlKey}`,
        },
        body: JSON.stringify({ url, formats: ['markdown'] }),
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      })
      if (res.ok) {
        const data = await res.json().catch(() => null) as any
        const md = data?.data?.markdown || data?.markdown
        if (typeof md === 'string' && md.trim()) {
          return md.trim().slice(0, MAX_EXTRACTED_CHARS)
        }
      }
    } catch {
      // fall through to plain fetch
    }
  }

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'INUU-ContentBot/1.0 (+https://inuu.ru)',
        Accept: 'text/html,application/xhtml+xml,text/plain;q=0.9,*/*;q=0.8',
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    })
    if (!res.ok) return null
    const contentType = String(res.headers.get('content-type') || '').toLowerCase()
    const body = await res.text()
    if (contentType.includes('text/html')) {
      return stripHtml(body).slice(0, MAX_EXTRACTED_CHARS) || null
    }
    if (contentType.includes('text/plain') || contentType.includes('text/markdown')) {
      return body.trim().slice(0, MAX_EXTRACTED_CHARS) || null
    }
    return null
  } catch {
    return null
  }
}

export type EnrichRawTextResult = {
  rawText: string
  urls: string[]
  enrichedUrls: string[]
}

export async function enrichRawTextWithUrls(rawText: string): Promise<EnrichRawTextResult> {
  const trimmed = rawText.trim()
  const urls = extractUrls(trimmed)
  if (!urls.length) {
    return { rawText: trimmed, urls: [], enrichedUrls: [] }
  }

  const shouldFetchAll = trimmed.length < 50
  const enrichedUrls: string[] = []
  const blocks: string[] = []

  for (const url of urls) {
    const shouldFetch = shouldFetchAll || urls.length <= 2
    if (!shouldFetch) continue
    const text = await fetchUrlPlainText(url)
    if (text) {
      enrichedUrls.push(url)
      blocks.push(`--- LINK: ${url} ---\n${text}\n--- END LINK ---`)
    }
  }

  if (!blocks.length) {
    return { rawText: trimmed, urls, enrichedUrls: [] }
  }

  const combined = [...blocks, '', trimmed].join('\n').trim()
  return {
    rawText: combined.slice(0, 30_000),
    urls,
    enrichedUrls,
  }
}

export function hasIngestibleContent(rawText: string, sourceUrl?: string | null): boolean {
  const textLen = rawText.trim().length
  if (textLen >= 10) return true
  if (sourceUrl && sourceUrl.trim()) return true
  if (extractUrls(rawText).length > 0) return true
  return textLen >= 1 && extractUrls(rawText).length > 0
}
