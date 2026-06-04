import { createError, type H3Event } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import { eventStatusFromIngest, isMissingEventsStatusColumnError, normalizeUpdateKind } from '~/server/utils/eventLifecycleStatus'
import type { IngestPostType } from '~/server/utils/ai/eventParseSchema'

export type EventLinkCandidate = {
  id: string
  slug: string
  title: string
  starts_at: string | null
}

function normalizeTitle(value: string): string {
  return value.toLowerCase().replace(/\s+/g, ' ').trim()
}

export async function listEventLinkCandidates(
  event: H3Event,
  args: { cityId: string; titleHint?: string | null; limit?: number },
): Promise<EventLinkCandidate[]> {
  const client = await serverSupabaseServiceRole(event)
  const sinceIso = new Date(Date.now() - 1000 * 60 * 60 * 24 * 120).toISOString()
  const limit = Math.min(20, Math.max(3, args.limit ?? 8))

  const { data, error } = await client
    .from('events')
    .select('id,slug,title,starts_at')
    .eq('city_id', args.cityId)
    .eq('is_published', true)
    .gte('starts_at', sinceIso)
    .order('starts_at', { ascending: false })
    .limit(80)

  if (error || !data?.length) return []

  const hint = normalizeTitle(String(args.titleHint || ''))
  const rows = data as Array<{ id: string; slug: string; title: string; starts_at: string | null }>

  const scored = rows
    .map((row) => {
      const rowTitle = normalizeTitle(String(row.title || ''))
      let score = 0
      if (hint && (rowTitle === hint || rowTitle.includes(hint) || hint.includes(rowTitle))) {
        score += 10
      }
      return { row, score }
    })
    .sort((a, b) => b.score - a.score)

  return scored.slice(0, limit).map(({ row }) => ({
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title),
    starts_at: row.starts_at,
  }))
}

export async function setSubmissionLinkedEvent(
  event: H3Event,
  args: { submissionId: string; eventId: string },
): Promise<void> {
  const client = await serverSupabaseServiceRole(event)
  const { data: submission } = await client
    .from('content_submissions')
    .select('id,payload')
    .eq('id', args.submissionId)
    .maybeSingle()

  if (!submission?.id) {
    throw createError({ statusCode: 404, statusMessage: 'Submission not found' })
  }

  const payload = (submission.payload && typeof submission.payload === 'object'
    ? { ...(submission.payload as Record<string, unknown>) }
    : {}) as Record<string, unknown>

  payload.linked_event_id = args.eventId

  await client
    .from('content_submissions')
    .update({ payload, updated_at: new Date().toISOString() } as any)
    .eq('id', args.submissionId)
}

export async function cancelLinkedEventInDatabase(
  event: H3Event,
  args: { cityId: string; eventId: string; note?: string | null },
): Promise<{ slug: string }> {
  const client = await serverSupabaseServiceRole(event)
  const nowIso = new Date().toISOString()
  const patch = {
    event_status: 'cancelled',
    status_updated_at: nowIso,
    status_note: args.note?.trim().slice(0, 280) || null,
    updated_at: nowIso,
  }

  let result = await client
    .from('events')
    .update(patch as any)
    .eq('id', args.eventId)
    .eq('city_id', args.cityId)
    .select('slug')
    .maybeSingle()

  if (result.error && isMissingEventsStatusColumnError(result.error)) {
    result = await client
      .from('events')
      .update({ updated_at: nowIso } as any)
      .eq('id', args.eventId)
      .eq('city_id', args.cityId)
      .select('slug')
      .maybeSingle()
  }

  if (result.error || !result.data?.slug) {
    throw createError({
      statusCode: 500,
      statusMessage: result.error?.message || 'Failed to cancel event',
    })
  }

  return { slug: String(result.data.slug) }
}

export function ingestPostTypeFromPayload(payload: Record<string, unknown>): IngestPostType {
  const raw = String(payload.ingest_post_type || payload.post_type || 'new_event').trim()
  if (raw === 'cancellation' || raw === 'update' || raw === 'trash') return raw
  return 'new_event'
}

export function linkedEventIdFromPayload(payload: Record<string, unknown>): string | null {
  const id = String(payload.linked_event_id || '').trim()
  return id || null
}

export function lifecycleStatusPreview(
  postType: IngestPostType,
  payload: Record<string, unknown>,
): string {
  const kind = normalizeUpdateKind(payload.ingest_update_kind)
  return eventStatusFromIngest(postType, kind)
}
