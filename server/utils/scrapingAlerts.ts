import type { H3Event } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'

export type ScrapingAlertDto = {
  id: string
  webSourceId: string | null
  webSourceUrl: string | null
  eventId: string | null
  eventSlug: string | null
  eventTitle: string | null
  url: string
  reason: string
  snapshot: string | null
  createdAt: string
}

export async function insertScrapingAlert(args: {
  event: H3Event
  webSourceId?: string | null
  eventId?: string | null
  url: string
  reason: string
  snapshot?: string | null
}): Promise<void> {
  const client = await serverSupabaseServiceRole(args.event)
  const snapshot = args.snapshot ? args.snapshot.slice(0, 2000) : null
  await client.from('scraping_alerts').insert({
    web_source_id: args.webSourceId || null,
    event_id: args.eventId || null,
    url: args.url,
    reason: args.reason,
    snapshot,
  } as any)
}

export async function insertScrapingAlertIfNew(args: {
  event: H3Event
  webSourceId?: string | null
  eventId?: string | null
  url: string
  reason: string
  snapshot?: string | null
}): Promise<boolean> {
  const client = await serverSupabaseServiceRole(args.event)
  if (args.eventId) {
    const { data: existing } = await client
      .from('scraping_alerts')
      .select('id')
      .eq('event_id', args.eventId)
      .eq('reason', args.reason)
      .is('resolved_at', null)
      .maybeSingle()
    if (existing?.id) return false
  }

  await insertScrapingAlert(args)
  return true
}

function mapScrapingAlertRow(
  row: {
    id: string
    web_source_id?: string | null
    event_id?: string | null
    url: string
    reason: string
    snapshot?: string | null
    created_at: string
    events?: { slug: string; title: string } | Array<{ slug: string; title: string }> | null
  },
  urlById: Map<string, string>,
): ScrapingAlertDto {
  const eventRow = Array.isArray(row.events) ? row.events[0] : row.events
  return {
    id: String(row.id),
    webSourceId: row.web_source_id ? String(row.web_source_id) : null,
    webSourceUrl: row.web_source_id ? urlById.get(String(row.web_source_id)) || null : null,
    eventId: row.event_id ? String(row.event_id) : null,
    eventSlug: eventRow?.slug ? String(eventRow.slug) : null,
    eventTitle: eventRow?.title ? String(eventRow.title) : null,
    url: String(row.url),
    reason: String(row.reason),
    snapshot: row.snapshot ? String(row.snapshot) : null,
    createdAt: String(row.created_at),
  }
}

export async function listOpenScrapingAlerts(
  event: H3Event,
  cityId: string,
): Promise<ScrapingAlertDto[]> {
  const client = await serverSupabaseServiceRole(event)
  const { data: sources } = await client
    .from('city_web_sources')
    .select('id,url')
    .eq('city_id', cityId)

  const sourceIds = (sources ?? []).map((s: { id: string }) => s.id)
  const urlById = new Map((sources ?? []).map((s: { id: string; url: string }) => [s.id, s.url]))

  const [sourceAlertsResult, eventAlertsResult] = await Promise.all([
    sourceIds.length
      ? client
        .from('scraping_alerts')
        .select('id,web_source_id,event_id,url,reason,snapshot,created_at')
        .in('web_source_id', sourceIds)
        .is('resolved_at', null)
        .order('created_at', { ascending: false })
        .limit(100)
      : Promise.resolve({ data: [], error: null }),
    client
      .from('scraping_alerts')
      .select('id,web_source_id,event_id,url,reason,snapshot,created_at,events!inner(slug,title,city_id)')
      .eq('events.city_id', cityId)
      .is('resolved_at', null)
      .order('created_at', { ascending: false })
      .limit(50),
  ])

  if (sourceAlertsResult.error && eventAlertsResult.error) return []

  const sourceAlerts = sourceAlertsResult.error ? [] : (sourceAlertsResult.data ?? [])
  const eventAlerts = eventAlertsResult.error ? [] : (eventAlertsResult.data ?? [])

  const merged = new Map<string, ScrapingAlertDto>()
  for (const row of [...sourceAlerts, ...eventAlerts]) {
    const mapped = mapScrapingAlertRow(row as any, urlById)
    merged.set(mapped.id, mapped)
  }

  return Array.from(merged.values())
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 100)
}

export async function resolveScrapingAlert(args: {
  event: H3Event
  cityId: string
  alertId: string
}): Promise<boolean> {
  const client = await serverSupabaseServiceRole(args.event)
  const { data: alert } = await client
    .from('scraping_alerts')
    .select('id,web_source_id,event_id')
    .eq('id', args.alertId)
    .maybeSingle()

  if (!alert?.id) return false

  if (alert.web_source_id) {
    const { data: source } = await client
      .from('city_web_sources')
      .select('id')
      .eq('id', alert.web_source_id)
      .eq('city_id', args.cityId)
      .maybeSingle()

    if (!source?.id) return false
  } else if (alert.event_id) {
    const { data: ev } = await client
      .from('events')
      .select('id')
      .eq('id', alert.event_id)
      .eq('city_id', args.cityId)
      .maybeSingle()
    if (!ev?.id) return false
  } else {
    return false
  }

  await client
    .from('scraping_alerts')
    .update({ resolved_at: new Date().toISOString() } as any)
    .eq('id', args.alertId)

  return true
}
