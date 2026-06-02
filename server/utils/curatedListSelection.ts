import crypto from 'node:crypto'
import type { H3Event } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'

export type CuratedTagMode = 'or' | 'and'

export type CuratedSelectionFilters = {
  cityId: string
  dateFrom: string
  dateTo: string
  minEditorialScore?: number
  limit?: number
  categorySlug?: string | null
  topicTags?: string[]
  tagsMode?: CuratedTagMode
}

export type CuratedSelectionEvent = {
  id: string
  title: string
  slug: string
  starts_at: string
  category_id: string | null
  source_metadata: Record<string, unknown> | null
  editorial_score: number | null
}

function normalizeTags(tags: unknown): string[] {
  if (!Array.isArray(tags)) return []
  return tags
    .map((tag) => String(tag || '').trim().toLowerCase())
    .filter(Boolean)
}

function eventHasTags(
  sourceMetadata: Record<string, unknown> | null,
  wantedTags: string[],
  tagsMode: CuratedTagMode,
): boolean {
  if (!wantedTags.length) return true
  const sourceTags = normalizeTags(sourceMetadata?.topic_tags)
  if (!sourceTags.length) return false
  if (tagsMode === 'and') return wantedTags.every((tag) => sourceTags.includes(tag))
  return wantedTags.some((tag) => sourceTags.includes(tag))
}

function resolveCategorySlugHash(categorySlug: string | null, topicTags: string[], tagsMode: CuratedTagMode): string {
  const raw = JSON.stringify({
    categorySlug: categorySlug || null,
    topicTags,
    tagsMode,
    date: new Date().toISOString().slice(0, 10),
  })
  return crypto.createHash('sha1').update(raw).digest('hex').slice(0, 8)
}

export function buildCustomCuratedSlug(args: {
  categorySlug?: string | null
  topicTags?: string[]
  tagsMode?: CuratedTagMode
  refDate?: Date
}): string {
  const refDate = args.refDate || new Date()
  const ymd = refDate.toISOString().slice(0, 10).replace(/-/g, '')
  const tags = normalizeTags(args.topicTags || [])
  const mode: CuratedTagMode = args.tagsMode === 'and' ? 'and' : 'or'
  const hash = resolveCategorySlugHash(args.categorySlug || null, tags, mode)
  return `custom-${ymd}-${hash}`
}

function toIsoDateForTimeZone(date: Date, timeZone: string): string {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  return formatter.format(date)
}

export function resolveWeeklyDigestWindow(timeZone: string, refDate?: Date): { dateFrom: string; dateTo: string } {
  const ref = refDate || new Date()
  const cursor = new Date(ref)
  for (let i = 0; i < 8; i++) {
    const iso = toIsoDateForTimeZone(cursor, timeZone)
    const weekday = new Date(`${iso}T00:00:00.000Z`).getUTCDay()
    if (weekday === 5) {
      const sunday = new Date(`${iso}T00:00:00.000Z`)
      sunday.setUTCDate(sunday.getUTCDate() + 2)
      return {
        dateFrom: iso,
        dateTo: sunday.toISOString().slice(0, 10),
      }
    }
    cursor.setUTCDate(cursor.getUTCDate() + 1)
  }
  const fallback = toIsoDateForTimeZone(ref, timeZone)
  return { dateFrom: fallback, dateTo: fallback }
}

export async function selectCuratedEvents(
  event: H3Event,
  filters: CuratedSelectionFilters,
): Promise<CuratedSelectionEvent[]> {
  const client = await serverSupabaseServiceRole(event)
  const limit = Math.min(40, Math.max(1, Number(filters.limit) || 12))
  const minEditorialScore = Number.isFinite(filters.minEditorialScore)
    ? Number(filters.minEditorialScore)
    : 4
  const topicTags = normalizeTags(filters.topicTags || [])
  const tagsMode: CuratedTagMode = filters.tagsMode === 'and' ? 'and' : 'or'

  let categoryId: string | null = null
  if (filters.categorySlug) {
    const { data: category } = await client
      .from('event_categories')
      .select('id')
      .eq('city_id', filters.cityId)
      .eq('slug', String(filters.categorySlug))
      .maybeSingle()
    categoryId = category?.id ? String(category.id) : '__not_found__'
  }

  let request = client
    .from('events')
    .select('id,title,slug,starts_at,category_id,source_metadata')
    .eq('city_id', filters.cityId)
    .eq('is_published', true)
    .gte('starts_at', `${filters.dateFrom}T00:00:00`)
    .lte('starts_at', `${filters.dateTo}T23:59:59`)
    .order('starts_at', { ascending: true })
    .limit(limit * 6)

  if (categoryId) {
    request = request.eq('category_id', categoryId)
  }

  const { data, error } = await request
  if (error) {
    throw new Error(`Failed to load curated candidates: ${error.message}`)
  }

  const rows = ((data || []) as Array<Omit<CuratedSelectionEvent, 'editorial_score'>>)
    .map((row) => ({ ...row, editorial_score: null as number | null }))

  const eventIds = rows.map((row) => row.id)
  let scoreByEventId = new Map<string, number>()
  if (eventIds.length) {
    const { data: scores } = await client
      .from('content_submissions')
      .select('published_entity_id,editorial_score')
      .eq('city_id', filters.cityId)
      .eq('status', 'approved')
      .eq('published_entity_type', 'event')
      .in('published_entity_id', eventIds)
      .not('editorial_score', 'is', null)
    for (const row of scores || []) {
      const eventId = String((row as any).published_entity_id || '')
      const score = Number((row as any).editorial_score)
      if (!eventId || !Number.isFinite(score)) continue
      const prev = scoreByEventId.get(eventId) || 0
      if (score > prev) scoreByEventId.set(eventId, score)
    }
  }

  const filtered = rows.filter((row) => {
    const score = scoreByEventId.get(String(row.id)) || 0
    row.editorial_score = score || null
    if (score < minEditorialScore) return false
    return eventHasTags(row.source_metadata, topicTags, tagsMode)
  })
  return filtered.slice(0, limit)
}

export async function syncCuratedListEvents(
  event: H3Event,
  args: { listId: string; eventIds: string[] },
): Promise<{ added: number; removed: number; kept: number }> {
  const client = await serverSupabaseServiceRole(event)
  const wanted = args.eventIds.map((id) => String(id))
  const wantedSet = new Set(wanted)

  const { data: existing } = await client
    .from('curated_list_items')
    .select('id,entity_id')
    .eq('list_id', args.listId)
    .eq('entity_type', 'event')

  const current = (existing || []).map((row: any) => ({
    id: String(row.id),
    entityId: String(row.entity_id),
  }))
  const currentSet = new Set(current.map((row) => row.entityId))

  const toRemove = current.filter((row) => !wantedSet.has(row.entityId))
  const toAdd = wanted.filter((eventId) => !currentSet.has(eventId))
  const kept = wanted.filter((eventId) => currentSet.has(eventId)).length

  if (toRemove.length) {
    await client
      .from('curated_list_items')
      .delete()
      .eq('list_id', args.listId)
      .eq('entity_type', 'event')
      .in('entity_id', toRemove.map((row) => row.entityId))
  }

  if (toAdd.length) {
    await client.from('curated_list_items').insert(
      toAdd.map((eventId) => ({
        list_id: args.listId,
        entity_type: 'event',
        entity_id: eventId,
        sort_order: Math.max(0, wanted.indexOf(eventId)),
      })),
    )
  }

  for (let index = 0; index < wanted.length; index++) {
    await client
      .from('curated_list_items')
      .update({ sort_order: index })
      .eq('list_id', args.listId)
      .eq('entity_type', 'event')
      .eq('entity_id', wanted[index])
  }

  return { added: toAdd.length, removed: toRemove.length, kept }
}
