import type { ParsingStrategy } from '~/server/utils/webParsingTypes'

export const STRATEGY_TTL_MS = 30 * 24 * 60 * 60 * 1000
export const MAX_CHILD_URLS = 5

export function shouldReclassify(strategy: ParsingStrategy | null, rulesValidatedAt: string | null): boolean {
  if (!strategy?.page_type) return true
  if ((strategy.fail_count || 0) >= 2) return true
  const classifiedAt = strategy.classified_at ? new Date(strategy.classified_at).getTime() : 0
  if (!classifiedAt || Date.now() - classifiedAt > STRATEGY_TTL_MS) return true
  if (rulesValidatedAt) {
    const rulesAge = Date.now() - new Date(rulesValidatedAt).getTime()
    if (rulesAge > STRATEGY_TTL_MS) return true
  }
  return false
}

export function matchListPattern(url: string, pattern: string | null | undefined): boolean {
  if (!pattern?.trim()) return true
  try {
    const path = new URL(url).pathname
    const re = new RegExp(
      `^${pattern.trim().replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*')}$`,
    )
    return re.test(path)
  } catch {
    return true
  }
}

export function filterEventUrls(urls: string[], baseUrl: string, pattern: string | null | undefined): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const raw of urls) {
    try {
      const abs = new URL(raw, baseUrl).href
      if (seen.has(abs)) continue
      if (!matchListPattern(abs, pattern)) continue
      seen.add(abs)
      out.push(abs)
    } catch {
      // skip invalid
    }
  }
  return out
}

export function filterUrlsForListPage(
  urls: string[],
  baseUrl: string,
  pattern: string | null | undefined,
): string[] {
  return filterEventUrls(urls, baseUrl, pattern).slice(0, MAX_CHILD_URLS)
}
