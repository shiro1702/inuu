import type { H3Event } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import {
  detectCancelledOnSourcePage,
  fetchWebPageForHealthCheck,
} from '~/server/utils/webPageFetch'
import { insertScrapingAlertIfNew } from '~/server/utils/scrapingAlerts'
import { notifyManagerScrapingAlert } from '~/server/utils/scrapingAlertNotify'

function isWeekendDate(iso: string, timeZone: string): boolean {
  try {
    const weekday = new Intl.DateTimeFormat('en-US', { timeZone, weekday: 'short' }).format(new Date(iso))
    return weekday === 'Sat' || weekday === 'Sun'
  } catch {
    const day = new Date(iso).getUTCDay()
    return day === 0 || day === 6
  }
}

function sourceUrlFromMetadata(raw: unknown): string | null {
  if (!raw || typeof raw !== 'object') return null
  const url = String((raw as Record<string, unknown>).source_url || '').trim()
  return /^https?:\/\//i.test(url) ? url : null
}

async function resolveWebSourceId(
  client: Awaited<ReturnType<typeof serverSupabaseServiceRole>>,
  cityId: string,
  pageUrl: string,
): Promise<string | null> {
  const { data: sources } = await client
    .from('city_web_sources')
    .select('id,url')
    .eq('city_id', cityId)
    .eq('is_active', true)

  if (!sources?.length) return null
  let host = ''
  try {
    host = new URL(pageUrl).host
  } catch {
    return null
  }

  for (const row of sources as Array<{ id: string; url: string }>) {
    try {
      if (new URL(row.url).host === host) return String(row.id)
    } catch {
      continue
    }
  }
  return null
}

export async function runWeekendSourceHealthCheck(
  event: H3Event,
  args?: { citySlug?: string; limit?: number },
): Promise<{
  checked: number
  alerts: number
  errors: number
}> {
  const client = await serverSupabaseServiceRole(event)
  const limit = Math.min(80, Math.max(5, args?.limit ?? 40))
  const now = Date.now()
  const horizonIso = new Date(now + 1000 * 60 * 60 * 24 * 12).toISOString()

  let citiesQuery = client.from('cities').select('id,slug,timezone').eq('is_active', true)
  if (args?.citySlug) {
    citiesQuery = citiesQuery.eq('slug', args.citySlug)
  }
  const { data: cities } = await citiesQuery

  let checked = 0
  let alerts = 0
  let errors = 0

  for (const city of cities ?? []) {
    const cityId = String((city as { id: string }).id)
    const timeZone = String((city as { timezone?: string }).timezone || 'Asia/Irkutsk')

    const { data: events } = await client
      .from('events')
      .select('id,slug,title,starts_at,source_metadata,event_status')
      .eq('city_id', cityId)
      .eq('is_published', true)
      .gte('starts_at', new Date().toISOString())
      .lte('starts_at', horizonIso)
      .order('starts_at', { ascending: true })
      .limit(limit * 3)

    const weekendEvents = (events ?? []).filter((row: { starts_at: string }) =>
      isWeekendDate(String(row.starts_at), timeZone),
    ).slice(0, limit)

    for (const row of weekendEvents as Array<{
      id: string
      slug: string
      title: string
      source_metadata: unknown
      event_status?: string
    }>) {
      if (String(row.event_status || 'active') !== 'active') continue
      const sourceUrl = sourceUrlFromMetadata(row.source_metadata)
      if (!sourceUrl) continue

      checked += 1
      try {
        const fetched = await fetchWebPageForHealthCheck(sourceUrl)
        if (!fetched) {
          errors += 1
          continue
        }

        let reason: string | null = null
        let snapshot: string | null = null

        if (fetched.status === 404 || fetched.status === 410) {
          reason = 'source_404'
          snapshot = `HTTP ${fetched.status}`
        } else if (fetched.status >= 400) {
          reason = 'source_empty'
          snapshot = `HTTP ${fetched.status}`
        } else if (detectCancelledOnSourcePage(fetched.html)) {
          reason = 'source_cancelled_on_site'
          snapshot = fetched.html.replace(/\s+/g, ' ').slice(0, 400)
        }

        if (!reason) continue

        const webSourceId = await resolveWebSourceId(client, cityId, sourceUrl)
        const inserted = await insertScrapingAlertIfNew({
          event,
          webSourceId,
          eventId: row.id,
          url: sourceUrl,
          reason,
          snapshot,
        })
        if (inserted) {
          alerts += 1
          await notifyManagerScrapingAlert(event, {
            cityId,
            eventId: row.id,
            eventSlug: row.slug,
            eventTitle: row.title,
            reason,
            url: sourceUrl,
          }).catch((err) => console.warn('[sourceWeekendHealthCheck] notify:', err))
        }
      } catch (err) {
        errors += 1
        console.warn('[sourceWeekendHealthCheck] check failed:', err)
      }
    }
  }

  return { checked, alerts, errors }
}
