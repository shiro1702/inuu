export type EditorialGalleryItem = {
  type: 'photo' | 'video'
  url: string
  sort_order?: number
}

/** HTML comment embedded by `scripts/import_telegram_afisha.py` with gallery JSON. */
export const EDITORIAL_TELEGRAM_GALLERY_COMMENT_RE
  = /<!--\s*inuu-telegram-gallery\s*\n([\s\S]*?)\n-->/i

export function stripEditorialTelegramGalleryComment(body: string): string {
  return String(body || '').replace(EDITORIAL_TELEGRAM_GALLERY_COMMENT_RE, '').trimEnd()
}

export function parseEditorialTelegramGalleryComment(body: string): EditorialGalleryItem[] | null {
  const match = String(body || '').match(EDITORIAL_TELEGRAM_GALLERY_COMMENT_RE)
  if (!match?.[1]) return null
  try {
    const meta = JSON.parse(match[1].trim()) as { gallery?: unknown }
    if (!Array.isArray(meta.gallery)) return null
    const items: EditorialGalleryItem[] = []
    for (const raw of meta.gallery) {
      if (!raw || typeof raw !== 'object') continue
      const item = raw as { type?: string; url?: string; sort_order?: number }
      if (typeof item.url !== 'string' || !item.url.trim()) continue
      if (item.type !== 'photo' && item.type !== 'video') continue
      items.push({
        type: item.type,
        url: item.url.trim(),
        sort_order: typeof item.sort_order === 'number' ? item.sort_order : undefined,
      })
    }
    return items.length
      ? items.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      : null
  } catch {
    return null
  }
}

export function parseEditorialBodyFallback(body: string): { text: string; gallery: EditorialGalleryItem[] } {
  const gallery = parseEditorialTelegramGalleryComment(body) ?? []
  const text = stripEditorialTelegramGalleryComment(body)
  return { text, gallery }
}
