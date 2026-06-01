import type { SupabaseClient } from '@supabase/supabase-js'
import { resolveEventCta, resolveEventSaleMode } from '~/server/utils/eventSaleMode'
import type { EventCta, EventSaleMode } from '~/types/storefront'

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
  shop_id?: string | null
  venue_id?: string | null
  source_channel?: string | null
  source_metadata?: unknown
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
    .select('id,slug,title,starts_at,cover_media_url,price,excerpt,description,source_metadata,category_id,shop_id,venue_id,source_channel,series_slug')
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
      shop_id: row.shop_id ? String(row.shop_id) : null,
      venue_id: row.venue_id ? String(row.venue_id) : null,
      source_channel: row.source_channel ? String(row.source_channel) : null,
      source_metadata: row.source_metadata ?? null,
    })
    if (out.length >= limit) break
  }
  return out
}

export type EventSourceDisplay = {
  label: string
  url: string | null
}

export type EventDisplayLinks = {
  saleMode: EventSaleMode
  cta: EventCta
  sourceLabel: string | null
  sourceUrl: string | null
}

const SOURCE_CHANNEL_LABELS: Record<string, string> = {
  telegram_parse: 'Telegram',
  web_cron: 'Сайт организатора',
  vk_parse: 'ВКонтакте',
  bot_submit: 'Партнёр',
  manual_editor: 'Редакция INUU',
}

function resolveSourceLabel(row: {
  source_channel?: string | null
  source_metadata?: unknown
}): string | null {
  const meta = parseSourceMetadata(row.source_metadata)
  const sourceUrl = meta.source_url || ''
  const tgMatch = sourceUrl.match(/(?:t\.me|telegram\.me)\/(?:s\/)?([a-zA-Z0-9_]+)/i)
  if (tgMatch?.[1] && !['joinchat', 'c', 'share'].includes(tgMatch[1].toLowerCase())) {
    return `Telegram @${tgMatch[1]}`
  }

  const orgName = meta.organization_name ? String(meta.organization_name).trim() : ''
  if (orgName && orgName.length > 1 && orgName.toLowerCase() !== 't') {
    return orgName
  }

  const channel = String(row.source_channel || '').trim()
  if (!channel) return null

  return SOURCE_CHANNEL_LABELS[channel] || channel
}

export function resolveEventDisplayLinks(row: {
  source_channel?: string | null
  source_metadata?: unknown
  shop_id?: string | null
}): EventDisplayLinks {
  const meta = parseSourceMetadata(row.source_metadata)
  const saleMode = resolveEventSaleMode(row)
  const sourceUrl = meta.source_url || meta.registration_url || null
  return {
    saleMode,
    cta: resolveEventCta({
      saleMode,
      registrationUrl: meta.registration_url,
      sourceUrl: meta.source_url,
    }),
    sourceLabel: resolveSourceLabel(row),
    sourceUrl,
  }
}

export { parseSourceMetadata }
