import { resolveTelegramWebPreviewUrl } from '~/server/utils/telegramWebPreview'

export type CronIngestCrawlTarget = {
  kind: 'web' | 'telegram'
  id: string
  cityId: string
  citySlug: string
  cityName: string
  label: string
}

type CityJoin = { slug: string; name: string }

function normalizeCityJoin(raw: unknown): CityJoin | null {
  if (!raw) return null
  const row = Array.isArray(raw) ? raw[0] : raw
  if (!row || typeof row !== 'object') return null
  const slug = String((row as CityJoin).slug || '').trim()
  if (!slug) return null
  return {
    slug,
    name: String((row as CityJoin).name || slug),
  }
}

/** Channel slug from web URL like https://t.me/s/kuda_poiti_uu */
export function extractTelegramChannelKeyFromWebUrl(url: string): string | null {
  const previewUrl = resolveTelegramWebPreviewUrl(url)
  if (!previewUrl) return null
  const match = previewUrl.match(/\/s\/([a-zA-Z0-9_]+)$/i)
  return match ? match[1].toLowerCase() : null
}

export type BuildCronIngestCrawlTargetsInput = {
  webRows: Array<{ id: string; city_id: string; url: string; display_name?: string | null; cities?: unknown }>
  telegramRows: Array<{ id: string; city_id: string; source_key: string; cities?: unknown }>
}

export function buildCronIngestCrawlTargets(input: BuildCronIngestCrawlTargetsInput): {
  targets: CronIngestCrawlTarget[]
  skippedDuplicates: number
} {
  const coveredTelegramKeys = new Set<string>()
  const webTargets: CronIngestCrawlTarget[] = []

  for (const row of input.webRows) {
    const city = normalizeCityJoin(row.cities)
    if (!city) continue
    const channelKey = extractTelegramChannelKeyFromWebUrl(String(row.url || ''))
    if (channelKey) coveredTelegramKeys.add(channelKey)
    webTargets.push({
      kind: 'web',
      id: String(row.id),
      cityId: String(row.city_id),
      citySlug: city.slug,
      cityName: city.name,
      label: row.display_name ? String(row.display_name) : String(row.url),
    })
  }

  const telegramTargets: CronIngestCrawlTarget[] = []
  let skippedDuplicates = 0

  for (const row of input.telegramRows) {
    const sourceKey = String(row.source_key || '').toLowerCase()
    if (sourceKey && coveredTelegramKeys.has(sourceKey)) {
      skippedDuplicates += 1
      continue
    }
    const city = normalizeCityJoin(row.cities)
    if (!city) continue
    telegramTargets.push({
      kind: 'telegram',
      id: String(row.id),
      cityId: String(row.city_id),
      citySlug: city.slug,
      cityName: city.name,
      label: `@${row.source_key}`,
    })
  }

  return {
    targets: [...webTargets, ...telegramTargets],
    skippedDuplicates,
  }
}
