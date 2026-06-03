import type { H3Event } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import type { EditorialBodyBlock } from '~/server/utils/editorialBodyJson'
import { normalizeBodyJson } from '~/server/utils/editorialBodyJson'

export type EditorialPlaceEmbedEnriched = {
  venue_id: string
  slug: string
  title: string
  cover_media_url: string | null
  rating_avg: number | null
  address: string | null
}

export async function enrichEditorialBodyBlocks(
  event: H3Event,
  cityId: string,
  raw: unknown,
): Promise<{ blocks: EditorialBodyBlock[]; placeEmbeds: Record<string, EditorialPlaceEmbedEnriched> }> {
  const blocks = normalizeBodyJson(raw) || []
  const venueIds = [
    ...new Set(
      blocks
        .filter((b): b is Extract<EditorialBodyBlock, { type: 'place_embed' }> => b.type === 'place_embed')
        .map((b) => b.venue_id),
    ),
  ]

  const placeEmbeds: Record<string, EditorialPlaceEmbedEnriched> = {}
  if (!venueIds.length) return { blocks, placeEmbeds }

  const client = await serverSupabaseServiceRole(event)
  const { data: venues } = await client
    .from('venues')
    .select('id,slug,title,cover_media_url,rating_avg,address')
    .eq('city_id', cityId)
    .in('id', venueIds)
    .eq('is_published', true)
    .eq('is_active', true)

  for (const row of venues ?? []) {
    placeEmbeds[String((row as any).id)] = {
      venue_id: String((row as any).id),
      slug: String((row as any).slug),
      title: String((row as any).title),
      cover_media_url: (row as any).cover_media_url || null,
      rating_avg: typeof (row as any).rating_avg === 'number' ? (row as any).rating_avg : null,
      address: (row as any).address || null,
    }
  }

  return { blocks, placeEmbeds }
}

export function editorialListSelectFields(): string {
  return 'id,slug,title,excerpt,cover_media_url,video_url,post_type,published_at,topic_tags,is_sponsored,read_later_count'
}
