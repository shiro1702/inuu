import type { H3Event } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import type { EventDigestMeta } from '~/server/utils/ai/eventParseSchema'

export type CuratedPeriod = 'week' | 'month'

export type PeriodListMeta = {
  period: CuratedPeriod
  slug: string
  title: string
  periodStart: string
  periodEnd: string
}

function formatDateRu(isoDate: string): string {
  const [y, m, d] = isoDate.split('-').map(Number)
  const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
  const monthName = months[(m || 1) - 1] || ''
  return `${d || 1} ${monthName}`
}

function getZonedParts(date: Date, timeZone: string) {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  const parts = fmt.formatToParts(date)
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value || 0)
  return { year: get('year'), month: get('month'), day: get('day') }
}

function toIsoDate(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function addDays(year: number, month: number, day: number, delta: number) {
  const d = new Date(Date.UTC(year, month - 1, day + delta))
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate() }
}

function isoWeekInfo(year: number, month: number, day: number) {
  const d = new Date(Date.UTC(year, month - 1, day))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
  return { isoYear: d.getUTCFullYear(), isoWeek: weekNo }
}

export function resolvePeriodListMeta(args: {
  period: CuratedPeriod
  timeZone: string
  refDate?: Date
  digest?: EventDigestMeta | null
}): PeriodListMeta {
  const ref = args.refDate || new Date()
  const { year, month, day } = getZonedParts(ref, args.timeZone)

  if (args.period === 'month') {
    const slug = `month-${year}-${String(month).padStart(2, '0')}`
    const monthNames = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
    const title = args.digest?.title?.trim()
      || `Главное ${monthNames[month - 1] || 'месяца'} ${year}`
    const periodStart = args.digest?.period_start?.slice(0, 10)
      || toIsoDate(year, month, 1)
    const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate()
    const periodEnd = args.digest?.period_end?.slice(0, 10)
      || toIsoDate(year, month, lastDay)
    return { period: 'month', slug, title, periodStart, periodEnd }
  }

  const { isoYear, isoWeek } = isoWeekInfo(year, month, day)
  const slug = `week-${isoYear}-w${String(isoWeek).padStart(2, '0')}`

  const d = new Date(Date.UTC(year, month - 1, day))
  const dayNum = d.getUTCDay() || 7
  const monday = addDays(year, month, day, -(dayNum - 1))
  const sunday = addDays(monday.year, monday.month, monday.day, 6)

  const periodStart = args.digest?.period_start?.slice(0, 10)
    || toIsoDate(monday.year, monday.month, monday.day)
  const periodEnd = args.digest?.period_end?.slice(0, 10)
    || toIsoDate(sunday.year, sunday.month, sunday.day)

  const title = args.digest?.title?.trim()
    || `Главное недели ${formatDateRu(periodStart)} – ${formatDateRu(periodEnd)}`

  return { period: 'week', slug, title, periodStart, periodEnd }
}

export async function upsertCuratedListForPeriod(
  event: H3Event,
  args: {
    cityId: string
    meta: PeriodListMeta
    batchId?: string | null
    publish?: boolean
    description?: string
    selectionMode?: 'weekly' | 'custom'
    sourceMetadata?: Record<string, unknown> | null
  },
): Promise<{ listId: string; slug: string }> {
  const client = await serverSupabaseServiceRole(event)
  const { data: existing } = await client
    .from('curated_lists')
    .select('id,slug')
    .eq('city_id', args.cityId)
    .eq('slug', args.meta.slug)
    .maybeSingle()

  const sourceMetadata = {
    period: args.meta.period,
    period_start: args.meta.periodStart,
    period_end: args.meta.periodEnd,
    auto: true,
    batch_id: args.batchId || null,
    selection_mode: args.selectionMode || 'weekly',
    ...(args.sourceMetadata || {}),
  }
  const description = args.description
    || `Подборка ${args.meta.period === 'week' ? 'недели' : 'месяца'}`

  if (existing?.id) {
    await client
      .from('curated_lists')
      .update({
        title: args.meta.title,
        description,
        is_published: args.publish !== false,
        source_metadata: sourceMetadata,
        updated_at: new Date().toISOString(),
      } as any)
      .eq('id', existing.id)
    return { listId: String(existing.id), slug: String(existing.slug) }
  }

  const { data: created, error } = await client
    .from('curated_lists')
    .insert({
      city_id: args.cityId,
      slug: args.meta.slug,
      title: args.meta.title,
      description,
      is_published: args.publish !== false,
      sort_order: args.meta.period === 'week' ? 10 : 20,
      source_metadata: sourceMetadata,
    } as any)
    .select('id,slug')
    .maybeSingle()

  if (error || !created?.id) {
    throw new Error(error?.message || 'Failed to create curated list')
  }

  return { listId: String(created.id), slug: String((created as any).slug) }
}

export async function upsertCuratedListBySlug(
  event: H3Event,
  args: {
    cityId: string
    slug: string
    title: string
    description: string
    publish?: boolean
    sortOrder?: number
    sourceMetadata?: Record<string, unknown> | null
  },
): Promise<{ listId: string; slug: string }> {
  const client = await serverSupabaseServiceRole(event)
  const { data: existing } = await client
    .from('curated_lists')
    .select('id,slug')
    .eq('city_id', args.cityId)
    .eq('slug', args.slug)
    .maybeSingle()

  if (existing?.id) {
    await client
      .from('curated_lists')
      .update({
        title: args.title,
        description: args.description,
        is_published: args.publish === true,
        source_metadata: args.sourceMetadata || {},
        updated_at: new Date().toISOString(),
      } as any)
      .eq('id', existing.id)
    return { listId: String(existing.id), slug: String(existing.slug) }
  }

  const { data: created, error } = await client
    .from('curated_lists')
    .insert({
      city_id: args.cityId,
      slug: args.slug,
      title: args.title,
      description: args.description,
      is_published: args.publish === true,
      sort_order: typeof args.sortOrder === 'number' ? args.sortOrder : 15,
      source_metadata: args.sourceMetadata || {},
    } as any)
    .select('id,slug')
    .maybeSingle()
  if (error || !created?.id) {
    throw new Error(error?.message || 'Failed to create custom curated list')
  }
  return { listId: String(created.id), slug: String((created as any).slug) }
}

export async function addEventToCuratedList(
  event: H3Event,
  args: {
    listId: string
    eventId: string
    sortOrder?: number
    note?: string | null
  },
): Promise<void> {
  const client = await serverSupabaseServiceRole(event)
  const { data: existing } = await client
    .from('curated_list_items')
    .select('id')
    .eq('list_id', args.listId)
    .eq('entity_type', 'event')
    .eq('entity_id', args.eventId)
    .maybeSingle()

  if (existing?.id) return

  await client.from('curated_list_items').insert({
    list_id: args.listId,
    entity_type: 'event',
    entity_id: args.eventId,
    sort_order: typeof args.sortOrder === 'number' ? args.sortOrder : 0,
    note: args.note || null,
  } as any)
}

export async function removeEventFromCuratedList(
  event: H3Event,
  args: { listId: string; eventId: string },
): Promise<void> {
  const client = await serverSupabaseServiceRole(event)
  await client
    .from('curated_list_items')
    .delete()
    .eq('list_id', args.listId)
    .eq('entity_type', 'event')
    .eq('entity_id', args.eventId)
}

export async function syncDigestEventsToCuratedList(
  event: H3Event,
  args: {
    cityId: string
    timeZone: string
    digest: EventDigestMeta | null
    batchId: string
    publishedItems: Array<{ eventId: string; batchIndex: number }>
  },
): Promise<{ listSlug: string; listId: string } | null> {
  if (!args.publishedItems.length) return null

  const period: CuratedPeriod = args.digest?.period === 'month' ? 'month' : 'week'
  const meta = resolvePeriodListMeta({
    period,
    timeZone: args.timeZone,
    digest: args.digest,
  })

  const { listId, slug } = await upsertCuratedListForPeriod(event, {
    cityId: args.cityId,
    meta,
    batchId: args.batchId,
    publish: true,
  })

  for (const item of args.publishedItems) {
    await addEventToCuratedList(event, {
      listId,
      eventId: item.eventId,
      sortOrder: item.batchIndex,
    })
  }

  return { listSlug: slug, listId }
}
