import type { H3Event } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import {
  getMasterContentTag,
  isMasterContentTagSlug,
  masterTagsAsTaxonomy,
  type TaxonomyTagWithGroup,
} from '~/server/utils/contentTagCatalog'

export type TaxonomyTag = TaxonomyTagWithGroup
export type TaxonomyCategory = { slug: string; name: string }

export function slugifyTaxonomy(input: string): string {
  const map: Record<string, string> = {
    а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i',
    й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't',
    у: 'u', ф: 'f', х: 'h', ц: 'c', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '',
    э: 'e', ю: 'yu', я: 'ya',
  }
  const lowered = input.trim().toLowerCase()
  const translit = lowered
    .split('')
    .map((ch) => map[ch] ?? ch)
    .join('')
  return translit
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    .slice(0, 48)
}

function displayNameFromSlug(slug: string): string {
  return slug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function mapRowToTag(row: { slug: string; name?: string; tag_group?: string }): TaxonomyTag {
  return {
    slug: String(row.slug),
    name: String(row.name || row.slug),
    tagGroup: String(row.tag_group || getMasterContentTag(String(row.slug))?.tagGroup || 'legacy'),
  }
}

export async function listCityContentTags(
  event: H3Event,
  cityId: string,
  query?: string,
): Promise<TaxonomyTag[]> {
  const client = await serverSupabaseServiceRole(event)
  const { data, error } = await client
    .from('city_content_tags')
    .select('slug,name,sort_order,tag_group')
    .eq('city_id', cityId)
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })
    .limit(200)

  if (error) {
    console.error('[cityContentTaxonomy] list tags failed:', error)
    return masterTagsAsTaxonomy()
  }

  let items = (data ?? []).map((row: any) => mapRowToTag(row))

  const q = String(query || '').trim().toLowerCase()
  if (q) {
    items = items.filter((x) => x.slug.includes(q) || x.name.toLowerCase().includes(q))
  }
  return items
}

export async function ensureCityContentTags(
  event: H3Event,
  cityId: string,
  slugs: string[],
): Promise<string[]> {
  const normalized = Array.from(
    new Set(
      slugs
        .map((x) => slugifyTaxonomy(String(x || '')))
        .filter((x) => x.length >= 2),
    ),
  ).slice(0, 8)

  if (!normalized.length) return []

  const client = await serverSupabaseServiceRole(event)
  const { data: existing } = await client
    .from('city_content_tags')
    .select('slug')
    .eq('city_id', cityId)
    .in('slug', normalized)

  const existingSet = new Set((existing ?? []).map((row: any) => String(row.slug)))
  const toCreate = normalized.filter((slug) => !existingSet.has(slug))
  if (toCreate.length) {
    const rows = toCreate.map((slug, index) => {
      const master = getMasterContentTag(slug)
      return {
        city_id: cityId,
        slug,
        name: master?.name || displayNameFromSlug(slug),
        sort_order: master?.sortOrder ?? 1000 + index,
        tag_group: master?.tagGroup ?? 'legacy',
      }
    })
    const { error } = await client.from('city_content_tags').insert(rows as any)
    if (error) console.error('[cityContentTaxonomy] ensure tags insert:', error)
  }

  return normalized
}

export async function createCityContentTag(
  event: H3Event,
  cityId: string,
  name: string,
): Promise<TaxonomyTag> {
  const slug = slugifyTaxonomy(name)
  if (slug.length < 2) {
    throw new Error('Tag name is too short')
  }
  const master = getMasterContentTag(slug)
  const client = await serverSupabaseServiceRole(event)
  const { data, error } = await client
    .from('city_content_tags')
    .upsert(
      {
        city_id: cityId,
        slug,
        name: name.trim() || master?.name || displayNameFromSlug(slug),
        sort_order: master?.sortOrder ?? 999,
        tag_group: master?.tagGroup ?? 'legacy',
      } as any,
      { onConflict: 'city_id,slug' },
    )
    .select('slug,name,tag_group')
    .maybeSingle()

  if (error || !data) {
    throw new Error(error?.message || 'Failed to create tag')
  }
  return mapRowToTag(data as any)
}

export async function listCityEventCategories(
  event: H3Event,
  cityId: string,
  query?: string,
): Promise<TaxonomyCategory[]> {
  const client = await serverSupabaseServiceRole(event)
  const { data, error } = await client
    .from('event_categories')
    .select('slug,name,sort_order')
    .eq('city_id', cityId)
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })
    .limit(200)

  if (error) {
    console.error('[cityContentTaxonomy] list categories failed:', error)
    return []
  }

  let items = (data ?? []).map((row: any) => ({
    slug: String(row.slug),
    name: String(row.name || row.slug),
  }))

  const q = String(query || '').trim().toLowerCase()
  if (q) {
    items = items.filter((x) => x.slug.includes(q) || x.name.toLowerCase().includes(q))
  }
  return items
}

export async function ensureCityEventCategory(
  event: H3Event,
  cityId: string,
  slugOrName: string | null | undefined,
): Promise<string | null> {
  const raw = String(slugOrName || '').trim()
  if (!raw) return null

  const slug = slugifyTaxonomy(raw)
  if (!slug) return null

  const client = await serverSupabaseServiceRole(event)
  const { data: existing } = await client
    .from('event_categories')
    .select('slug')
    .eq('city_id', cityId)
    .eq('slug', slug)
    .maybeSingle()

  if (!existing?.slug) {
    const name = raw.includes('-') && raw === slug ? displayNameFromSlug(slug) : raw
    const { error } = await client.from('event_categories').insert({
      city_id: cityId,
      slug,
      name,
      sort_order: 999,
    } as any)
    if (error && !/duplicate|unique/i.test(error.message)) {
      console.error('[cityContentTaxonomy] ensure category:', error)
    }
  }

  return slug
}

export async function createCityEventCategory(
  event: H3Event,
  cityId: string,
  name: string,
): Promise<TaxonomyCategory> {
  const slug = slugifyTaxonomy(name)
  if (slug.length < 2) throw new Error('Category name is too short')

  const client = await serverSupabaseServiceRole(event)
  const { data, error } = await client
    .from('event_categories')
    .upsert(
      {
        city_id: cityId,
        slug,
        name: name.trim() || displayNameFromSlug(slug),
        sort_order: 999,
      } as any,
      { onConflict: 'city_id,slug' },
    )
    .select('slug,name')
    .maybeSingle()

  if (error || !data) throw new Error(error?.message || 'Failed to create category')
  return { slug: String((data as any).slug), name: String((data as any).name) }
}

export async function loadCityParseTaxonomy(
  event: H3Event,
  cityId: string,
): Promise<{ tags: TaxonomyTag[]; categories: TaxonomyCategory[] }> {
  const [tags, categories] = await Promise.all([
    listCityContentTags(event, cityId),
    listCityEventCategories(event, cityId),
  ])
  return { tags, categories }
}

const CONTEXT_DEFAULT_TOPIC_TAGS: Record<string, string[]> = {
  standup: ['nightlife', 'culture'],
  club: ['nightlife'],
  theater: ['culture'],
  museum: ['culture'],
  cinema: ['culture'],
  library: ['culture', 'family'],
}

export async function resolveParsedTaxonomy(
  event: H3Event,
  cityId: string,
  args: { topicTags: string[]; categorySlug: string | null; contextType?: string | null },
): Promise<{ topicTags: string[]; categorySlug: string | null }> {
  const categories = await listCityEventCategories(event, cityId)
  const knownCategorySlugs = new Set(categories.map((c) => c.slug))

  let topicTags = Array.from(
    new Set(
      args.topicTags
        .map((x) => slugifyTaxonomy(String(x || '')))
        .filter((x) => x.length >= 2 && isMasterContentTagSlug(x)),
    ),
  ).slice(0, 5)

  if (!topicTags.length) {
    const ctx = String(args.contextType || 'general').trim().toLowerCase()
    const defaults = CONTEXT_DEFAULT_TOPIC_TAGS[ctx] || []
    topicTags = defaults.filter((slug) => isMasterContentTagSlug(slug)).slice(0, 5)
  }

  if (topicTags.length) {
    await ensureCityContentTags(event, cityId, topicTags)
  }

  const catSlug = args.categorySlug ? slugifyTaxonomy(args.categorySlug) : null
  const categorySlug = catSlug && knownCategorySlugs.has(catSlug) ? catSlug : null

  return { topicTags, categorySlug }
}
