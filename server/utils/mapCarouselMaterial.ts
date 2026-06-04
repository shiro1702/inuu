import { resolveMaterialCoverUrl } from '~/utils/resolveMaterialCoverUrl'

function parseTopicTagsFromMetadata(raw: unknown): string[] {
  if (!raw || typeof raw !== 'object') return []
  const tags = (raw as Record<string, unknown>).topic_tags
  if (!Array.isArray(tags)) return []
  return tags.map((x) => String(x || '').trim()).filter(Boolean)
}

type EventDbRow = {
  id: string
  slug: string
  title: string
  excerpt: string | null
  tldr: string | null
  starts_at: string
  price: number | null
  currency: string | null
  cover_media_url: string | null
  vibe_emoji: string | null
  source_metadata: unknown
  venue?: { title: string } | null
}

type VenueDbRow = {
  id: string
  slug: string
  title: string
  description: string | null
  address: string | null
  cover_media_url: string | null
}

export type CarouselMaterialDto = {
  id: string
  entityType: 'event' | 'venue'
  slug: string
  title: string
  excerpt: string | null
  tldr: string | null
  startsAt: string | null
  price: number | null
  currency: string | null
  coverMediaUrl: string | null
  vibeEmoji: string | null
  venueTitle: string | null
  address: string | null
  topicTags: string[]
  listNote: string | null
}

export function mapEventRowToCarouselMaterial(row: EventDbRow, listNote?: string | null): CarouselMaterialDto {
  return {
    id: String(row.id),
    entityType: 'event',
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    tldr: row.tldr,
    startsAt: row.starts_at,
    price: row.price,
    currency: row.currency,
    coverMediaUrl: resolveMaterialCoverUrl({
      cover_media_url: row.cover_media_url,
      source_metadata: row.source_metadata,
    }),
    vibeEmoji: row.vibe_emoji,
    venueTitle: row.venue?.title ?? null,
    address: null,
    topicTags: parseTopicTagsFromMetadata(row.source_metadata),
    listNote: listNote ?? null,
  }
}

export function mapVenueRowToCarouselMaterial(row: VenueDbRow, listNote?: string | null): CarouselMaterialDto {
  return {
    id: String(row.id),
    entityType: 'venue',
    slug: row.slug,
    title: row.title,
    excerpt: row.description,
    tldr: null,
    startsAt: null,
    price: null,
    currency: null,
    coverMediaUrl: resolveMaterialCoverUrl({ cover_media_url: row.cover_media_url }),
    vibeEmoji: null,
    venueTitle: null,
    address: row.address,
    topicTags: [],
    listNote: listNote ?? null,
  }
}
