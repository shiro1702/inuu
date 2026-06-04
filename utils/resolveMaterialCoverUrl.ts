function collectMediaUrls(raw: unknown): string[] {
  const pushUnique = (urls: string[], value: unknown) => {
    const normalized = String(value || '').trim()
    if (!normalized) return
    if (!/^https?:\/\//i.test(normalized)) return
    if (!urls.includes(normalized)) urls.push(normalized)
  }

  const out: string[] = []
  if (Array.isArray(raw)) {
    for (const value of raw) pushUnique(out, value)
    return out
  }

  if (typeof raw !== 'string') return out
  const value = raw.trim()
  if (!value) return out

  if (value.startsWith('[')) {
    try {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed)) {
        for (const item of parsed) pushUnique(out, item)
        return out
      }
    } catch {
      // delimiter split below
    }
  }

  const chunks = value
    .split(/[\n,;]+/g)
    .map((item) => item.trim())
    .filter(Boolean)
  for (const item of chunks) pushUnique(out, item)
  return out
}

function mediaUrlsFromSourceMetadata(raw: unknown): string[] {
  if (!raw || typeof raw !== 'object') return []
  const o = raw as Record<string, unknown>
  return [
    ...collectMediaUrls(o.media_urls),
    ...collectMediaUrls(o.media_url),
    ...collectMediaUrls(o.poster_url),
    ...collectMediaUrls(o.image_url),
    ...collectMediaUrls(o.cover_media_url),
    ...collectMediaUrls(o.poster),
    ...collectMediaUrls(o.image),
  ].filter((url, index, list) => list.indexOf(url) === index)
}

/** Первый URL обложки: колонка события/места → галерея в source_metadata. */
export function resolveMaterialCoverUrl(row: {
  coverMediaUrl?: string | null
  cover_media_url?: string | null
  sourceMetadata?: unknown
  source_metadata?: unknown
}): string | null {
  const direct = String(row.coverMediaUrl || row.cover_media_url || '').trim()
  if (direct && /^https?:\/\//i.test(direct)) return direct

  const fromMeta = mediaUrlsFromSourceMetadata(row.sourceMetadata ?? row.source_metadata)
  return fromMeta[0] || null
}

export function listMaterialCoverUrls(row: {
  coverMediaUrl?: string | null
  cover_media_url?: string | null
  sourceMetadata?: unknown
  source_metadata?: unknown
}): string[] {
  const urls: string[] = []
  const push = (value: string | null | undefined) => {
    const normalized = String(value || '').trim()
    if (normalized && /^https?:\/\//i.test(normalized) && !urls.includes(normalized)) {
      urls.push(normalized)
    }
  }

  push(row.coverMediaUrl)
  push(row.cover_media_url)
  for (const url of mediaUrlsFromSourceMetadata(row.sourceMetadata ?? row.source_metadata)) {
    push(url)
  }
  return urls
}
