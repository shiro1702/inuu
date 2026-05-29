import type { SupabaseClient } from '@supabase/supabase-js'

export type EventSourceMetadata = {
  topic_tags?: string[]
  registration_url?: string | null
  source_url?: string | null
  media_urls?: string[]
  organization_name?: string | null
}

export type PublicEventTag = { slug: string; name: string }

export type PublicEventSession = {
  slug: string
  starts_at: string
  isCurrent: boolean
}

export type PublicSimilarEvent = {
  id: string
  slug: string
  title: string
  starts_at: string
  cover_media_url: string | null
  excerpt: string | null
  price: number
}

function parseSourceMetadata(raw: unknown): EventSourceMetadata {
  if (!raw || typeof raw !== 'object') return {}
  const o = raw as Record<string, unknown>
  const tags = Array.isArray(o.topic_tags)
    ? o.topic_tags.map((x) => String(x || '').trim()).filter(Boolean)
    : []
  const media = Array.isArray(o.media_urls)
    ? o.media_urls.map((x) => String(x || '').trim()).filter(Boolean)
    : []
  return {
    topic_tags: tags,
    registration_url: typeof o.registration_url === 'string' ? o.registration_url : null,
    source_url: typeof o.source_url === 'string' ? o.source_url : null,
    media_urls: media,
    organization_name: typeof o.organization_name === 'string' ? o.organization_name : null,
  }
}

export function buildEventMediaGallery(row: {
  cover_media_url?: string | null
  source_metadata?: unknown
}): string[] {
  const meta = parseSourceMetadata(row.source_metadata)
  const urls = new Set<string>()
  if (row.cover_media_url) urls.add(String(row.cover_media_url))
  for (const url of meta.media_urls || []) urls.add(url)
  return [...urls]
}

export async function resolveCityTagLabels(
  client: SupabaseClient,
  cityId: string,
  slugs: string[],
): Promise<PublicEventTag[]> {
  if (!slugs.length) return []
  const { data } = await client
    .from('city_content_tags')
    .select('slug,name')
    .eq('city_id', cityId)
    .in('slug', slugs)

  const bySlug = new Map((data ?? []).map((r: any) => [String(r.slug), String(r.name)]))
  return slugs.map((slug) => ({
    slug,
    name: bySlug.get(slug) || slug,
  }))
}

export async function loadSimilarPublishedEvents(
  client: SupabaseClient,
  args: {
    cityId: string
    excludeSlug: string
    topicTags: string[]
    categoryId: string | null
    shopId: string | null
    limit?: number
  },
): Promise<PublicSimilarEvent[]> {
  const limit = args.limit ?? 6
  const nowIso = new Date().toISOString()

  const { data: rows } = await client
    .from('events')
    .select('id,slug,title,starts_at,cover_media_url,price,excerpt,description,source_metadata,category_id,shop_id,series_slug')
    .eq('city_id', args.cityId)
    .eq('is_published', true)
    .gte('starts_at', nowIso)
    .neq('slug', args.excludeSlug)
    .order('starts_at', { ascending: true })
    .limit(80)

  const candidates = (rows ?? []).filter((row: any) => String(row.slug) !== args.excludeSlug)

  const tagSet = new Set(args.topicTags)
  const byTag = candidates.filter((row: any) => {
    const meta = parseSourceMetadata(row.source_metadata)
    return (meta.topic_tags || []).some((t) => tagSet.has(t))
  })

  const pickedIds = new Set<string>()
  const pushUnique = (list: any[]) => {
    for (const row of list) {
      const id = String(row.id)
      if (pickedIds.has(id)) continue
      pickedIds.add(id)
      picked.push(row)
      if (picked.length >= limit) break
    }
  }

  let picked: any[] = []
  pushUnique(byTag)
  if (picked.length < limit && args.categoryId) {
    pushUnique(candidates.filter((row: any) => row.category_id === args.categoryId))
  }
  if (picked.length < limit && args.shopId) {
    pushUnique(candidates.filter((row: any) => row.shop_id === args.shopId))
  }

  const seenSeries = new Set<string>()
  const out: PublicSimilarEvent[] = []
  for (const row of picked) {
    const series = row.series_slug ? String(row.series_slug) : `id:${row.id}`
    if (seenSeries.has(series)) continue
    seenSeries.add(series)
    out.push({
      id: String(row.id),
      slug: String(row.slug),
      title: String(row.title),
      starts_at: String(row.starts_at),
      cover_media_url: row.cover_media_url ? String(row.cover_media_url) : null,
      excerpt: row.excerpt ? String(row.excerpt) : null,
      price: Number(row.price) || 0,
    })
    if (out.length >= limit) break
  }
  return out
}

export { parseSourceMetadata }
