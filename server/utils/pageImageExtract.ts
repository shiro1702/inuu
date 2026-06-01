import * as cheerio from 'cheerio'
import { normalizeRemoteMediaUrl } from '~/server/utils/remoteMediaUrl'

const USER_AGENT = 'INUU-ContentBot/1.0 (+https://inuu.ru)'
const FETCH_TIMEOUT_MS = 10_000

function toAbsoluteUrl(href: string, baseUrl: string): string | null {
  try {
    return new URL(href, baseUrl).href
  } catch {
    return null
  }
}

export function extractOgImageFromHtml(html: string, baseUrl?: string): string | null {
  const $ = cheerio.load(html)
  const candidates = [
    $('meta[property="og:image"]').attr('content'),
    $('meta[property="og:image:url"]').attr('content'),
    $('meta[name="twitter:image"]').attr('content'),
    $('link[rel="image_src"]').attr('href'),
  ]

  for (const raw of candidates) {
    const normalized = normalizeRemoteMediaUrl(
      raw ? (baseUrl ? toAbsoluteUrl(raw, baseUrl) : raw) : null,
    )
    if (normalized && !normalized.includes('telegram.org/img/emoji')) {
      return normalized
    }
  }

  return null
}

/** Best-effort hero image from event page HTML (og:image, then large <img> in main). */
export function extractPrimaryImageFromHtml(html: string, baseUrl: string): string | null {
  const og = extractOgImageFromHtml(html, baseUrl)
  if (og) return og

  const $ = cheerio.load(html)
  const scopes = ['main', 'article', '[role="main"]', '.event', '.afisha', 'body']
  for (const scope of scopes) {
    const imgs = $(scope).find('img[src]')
    let best: { url: string; area: number } | null = null
    imgs.each((_, el) => {
      const src = $(el).attr('src')
      const abs = src ? toAbsoluteUrl(src, baseUrl) : null
      const normalized = normalizeRemoteMediaUrl(abs)
      if (!normalized) return
      if (/pixel|spacer|1x1|emoji|icon|logo/i.test(normalized)) return
      const w = Number($(el).attr('width')) || 400
      const h = Number($(el).attr('height')) || 300
      const area = w * h
      if (!best || area > best.area) {
        best = { url: normalized, area }
      }
    })
    if (best) return best.url
  }

  return null
}

export async function fetchHtmlForImageExtract(url: string): Promise<{ html: string; finalUrl: string } | null> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.8',
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    })
    if (!res.ok) return null
    const html = await res.text()
    if (!html.trim()) return null
    return { html, finalUrl: res.url || url }
  } catch {
    return null
  }
}
