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

  let sourceAlerts: unknown[] = []
  if (sourceIds.length) {
    const { data, error: sourceError } = await client
      .from('scraping_alerts')
      .select('id,web_source_id,event_id,url,reason,snapshot,created_at')
      .in('web_source_id', sourceIds)
      .is('resolved_at', null)
      .order('created_at', { ascending: false })
      .limit(100)
    if (sourceError) return []
    sourceAlerts = data ?? []
  }

  const { data: cityEvents } = await client.from('events').select('id').eq('city_id', cityId)
  const cityEventIds = (cityEvents ?? []).map((row: { id: string }) => String(row.id))

  let eventAlerts: unknown[] = []
  if (cityEventIds.length) {
    const { data, error: eventError } = await client
      .from('scraping_alerts')
      .select('id,web_source_id,event_id,url,reason,snapshot,created_at')
      .in('event_id', cityEventIds)
      .is('resolved_at', null)
      .order('created_at', { ascending: false })
      .limit(50)
    if (eventError) return []
    eventAlerts = data ?? []
  }

  const eventIds = [
    ...new Set(
      (eventAlerts ?? [])
        .map((row: { event_id?: string }) => row.event_id)
        .filter(Boolean)
        .map(String),
    ),
  ]
  const eventsById = new Map<string, { slug: string; title: string }>()
  if (eventIds.length) {
    const { data: events } = await client
      .from('events')
      .select('id,slug,title')
      .eq('city_id', cityId)
      .in('id', eventIds)
    for (const ev of events ?? []) {
      eventsById.set(String((ev as { id: string }).id), {
        slug: String((ev as { slug: string }).slug),
        title: String((ev as { title: string }).title),
      })
    }
  }

  const merged = [...(sourceAlerts ?? []), ...(eventAlerts ?? [])]
    .filter((row: { event_id?: string }) => {
      if (!row.event_id) return true
      const ev = eventsById.get(String(row.event_id))
      return Boolean(ev)
    })
    .slice(0, 100)

  return merged.map((row: any) => {
    const eventMeta = row.event_id ? eventsById.get(String(row.event_id)) : null
    return {
      id: String(row.id),
      webSourceId: row.web_source_id ? String(row.web_source_id) : null,
      webSourceUrl: row.web_source_id ? urlById.get(String(row.web_source_id)) || null : null,
      eventId: row.event_id ? String(row.event_id) : null,
      eventSlug: eventMeta?.slug || null,
      eventTitle: eventMeta?.title || null,
      url: String(row.url),
      reason: String(row.reason),
      snapshot: row.snapshot ? String(row.snapshot) : null,
      createdAt: String(row.created_at),
    }
  })
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
