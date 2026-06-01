import type { H3Event } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'

export type ScrapingAlertDto = {
  id: string
  webSourceId: string
  webSourceUrl: string | null
  url: string
  reason: string
  snapshot: string | null
  createdAt: string
}

export async function insertScrapingAlert(args: {
  event: H3Event
  webSourceId: string
  url: string
  reason: string
  snapshot?: string | null
}): Promise<void> {
  const client = await serverSupabaseServiceRole(args.event)
  const snapshot = args.snapshot ? args.snapshot.slice(0, 2000) : null
  await client.from('scraping_alerts').insert({
    web_source_id: args.webSourceId,
    url: args.url,
    reason: args.reason,
    snapshot,
  } as any)
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
  if (!sourceIds.length) return []

  const urlById = new Map((sources ?? []).map((s: { id: string; url: string }) => [s.id, s.url]))

  const { data, error } = await client
    .from('scraping_alerts')
    .select('id,web_source_id,url,reason,snapshot,created_at')
    .in('web_source_id', sourceIds)
    .is('resolved_at', null)
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) return []

  return (data ?? []).map((row: any) => ({
    id: String(row.id),
    webSourceId: String(row.web_source_id),
    webSourceUrl: urlById.get(String(row.web_source_id)) || null,
    url: String(row.url),
    reason: String(row.reason),
    snapshot: row.snapshot ? String(row.snapshot) : null,
    createdAt: String(row.created_at),
  }))
}

export async function resolveScrapingAlert(args: {
  event: H3Event
  cityId: string
  alertId: string
}): Promise<boolean> {
  const client = await serverSupabaseServiceRole(args.event)
  const { data: alert } = await client
    .from('scraping_alerts')
    .select('id,web_source_id')
    .eq('id', args.alertId)
    .maybeSingle()

  if (!alert?.id) return false

  const { data: source } = await client
    .from('city_web_sources')
    .select('id')
    .eq('id', alert.web_source_id)
    .eq('city_id', args.cityId)
    .maybeSingle()

  if (!source?.id) return false

  await client
    .from('scraping_alerts')
    .update({ resolved_at: new Date().toISOString() } as any)
    .eq('id', args.alertId)

  return true
}
