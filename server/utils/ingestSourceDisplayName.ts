function displayNameFromDomain(hostname: string): string {
  const base = hostname.replace(/^www\./, '').split('.')[0] || hostname
  return base
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function extractTelegramChannelFromUrl(sourceUrl: string): string | null {
  try {
    const parsed = new URL(sourceUrl.trim())
    if (!/^(t\.me|telegram\.me)$/i.test(parsed.hostname)) return null
    const match =
      parsed.pathname.match(/\/s\/([a-zA-Z0-9_]+)/i)
      || parsed.pathname.match(/^\/([a-zA-Z0-9_]+)/i)
    const key = match?.[1]
    if (!key || ['joinchat', 'addstickers', 'share', 'c'].includes(key.toLowerCase())) return null
    return key
  } catch {
    return null
  }
}

/** Label for shadow org / moderation when URL is t.me/s/channel. */
export function resolveIngestSourceDisplayName(args: {
  sourceUrl: string
  displayName?: string | null
}): string {
  const hint = String(args.displayName || '').trim()
  if (hint) return hint.slice(0, 120)

  const channel = extractTelegramChannelFromUrl(args.sourceUrl)
  if (channel) {
    return channel
      .replace(/_/g, ' ')
      .split(' ')
      .map((part) => (part ? part.charAt(0).toUpperCase() + part.slice(1) : ''))
      .join(' ')
      .trim()
  }

  try {
    const hostname = new URL(args.sourceUrl).hostname.replace(/^www\./, '')
    const label = displayNameFromDomain(hostname)
    if (label.length >= 2) return label
  } catch {
    // ignore
  }

  return 'Источник'
}

/** Stable key for shadow org lookup (`ui_settings.parsed_source_domain`). */
export function parsedSourceKeyFromUrl(sourceUrl: string): string | null {
  const trimmed = sourceUrl.trim()
  if (!trimmed) return null
  const channel = extractTelegramChannelFromUrl(trimmed)
  if (channel) return `t.me/${channel.toLowerCase()}`
  try {
    return new URL(trimmed).hostname.replace(/^www\./, '')
  } catch {
    return null
  }
}

export function formatTopicTagsAsHashtags(slugs: string[]): string {
  const unique = Array.from(
    new Set(
      slugs
        .map((tag) => String(tag || '').trim().replace(/^#+/, ''))
        .filter((tag) => tag.length >= 2),
    ),
  ).slice(0, 8)
  if (!unique.length) return '—'
  return unique.map((tag) => `#${tag}`).join(' ')
}
