import type { H3Event } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import { parseSourceMetadata } from '~/server/utils/eventPublicDetail'
import type { TaxonomyTag } from '~/server/utils/cityContentTaxonomy'
import {
  filterTaxonomyByUsedSlugs,
  type ContentTagUsageScope,
} from '~/utils/cityContentTagsInUse'

export {
  CONTENT_TAG_USAGE_SCOPES,
  filterTagGroupsByUsedSlugs,
  filterTaxonomyByUsedSlugs,
  parseContentTagUsageScope,
  type ContentTagUsageScope,
} from '~/utils/cityContentTagsInUse'

function addTagSlug(target: Set<string>, raw: unknown) {
  const slug = String(raw || '').trim().toLowerCase()
  if (slug.length >= 2) target.add(slug)
}

function collectFromTopicTagArrays(rows: Array<{ topic_tags?: unknown } | null | undefined>) {
  const slugs = new Set<string>()
  for (const row of rows) {
    if (!row || !Array.isArray(row.topic_tags)) continue
    for (const tag of row.topic_tags) addTagSlug(slugs, tag)
  }
  return slugs
}

async function collectEventTopicTagSlugs(event: H3Event, cityId: string): Promise<Set<string>> {
  const client = await serverSupabaseServiceRole(event)
  const nowIso = new Date().toISOString()
  const { data, error } = await client
    .from('events')
    .select('source_metadata')
    .eq('city_id', cityId)
    .eq('is_published', true)
    .or(`starts_at.gte.${nowIso},event_status.in.(cancelled,sold_out,postponed)`)
    .limit(800)

  if (error) {
    console.error('[cityContentTagsInUse] events scan failed:', error)
    return new Set()
  }

  const slugs = new Set<string>()
  for (const row of data ?? []) {
    const meta = parseSourceMetadata((row as { source_metadata?: unknown }).source_metadata)
    for (const tag of meta.topic_tags || []) addTagSlug(slugs, tag)
  }
  return slugs
}

async function collectEditorialTopicTagSlugs(event: H3Event, cityId: string): Promise<Set<string>> {
  const client = await serverSupabaseServiceRole(event)
  const { data, error } = await client
    .from('editorial_posts')
    .select('topic_tags')
    .eq('city_id', cityId)
    .eq('is_published', true)
    .limit(500)

  if (error) {
    console.error('[cityContentTagsInUse] editorial scan failed:', error)
    return new Set()
  }
  return collectFromTopicTagArrays(data ?? [])
}

async function collectVenueVibeTagSlugs(event: H3Event, cityId: string): Promise<Set<string>> {
  const client = await serverSupabaseServiceRole(event)
  const { data, error } = await client
    .from('venues')
    .select('vibe_tags')
    .eq('city_id', cityId)
    .eq('is_published', true)
    .eq('is_active', true)
    .limit(500)

  if (error) {
    console.error('[cityContentTagsInUse] venues scan failed:', error)
    return new Set()
  }

  const slugs = new Set<string>()
  for (const row of data ?? []) {
    if (!Array.isArray((row as { vibe_tags?: unknown }).vibe_tags)) continue
    for (const tag of (row as { vibe_tags: unknown[] }).vibe_tags) addTagSlug(slugs, tag)
  }
  return slugs
}

export async function collectCityContentTagSlugsInUse(
  event: H3Event,
  cityId: string,
  scope: ContentTagUsageScope,
): Promise<Set<string>> {
  if (scope === 'events') return collectEventTopicTagSlugs(event, cityId)
  if (scope === 'editorial') return collectEditorialTopicTagSlugs(event, cityId)
  if (scope === 'venues') return collectVenueVibeTagSlugs(event, cityId)

  const [events, editorial, venues] = await Promise.all([
    collectEventTopicTagSlugs(event, cityId),
    collectEditorialTopicTagSlugs(event, cityId),
    collectVenueVibeTagSlugs(event, cityId),
  ])
  return new Set([...events, ...editorial, ...venues])
}

export async function listCityContentTagsInScope(
  event: H3Event,
  cityId: string,
  scope: ContentTagUsageScope,
  allTags: TaxonomyTag[],
): Promise<TaxonomyTag[]> {
  const used = await collectCityContentTagSlugsInUse(event, cityId, scope)
  return filterTaxonomyByUsedSlugs(allTags, used)
}
