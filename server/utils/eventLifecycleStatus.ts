import type { IngestPostType } from '~/server/utils/ai/eventParseSchema'

export const EVENT_STATUSES = ['active', 'cancelled', 'sold_out', 'postponed'] as const
export type EventStatus = (typeof EVENT_STATUSES)[number]

export const UPDATE_KINDS = ['sold_out', 'reschedule', 'other'] as const
export type UpdateKind = (typeof UPDATE_KINDS)[number]

export function normalizeUpdateKind(raw: unknown): UpdateKind | null {
  const key = String(raw || '').trim().toLowerCase()
  if (key === 'sold_out' || key === 'sold-out' || key === 'soldout') return 'sold_out'
  if (key === 'reschedule' || key === 'postpone' || key === 'postponed') return 'reschedule'
  if (key === 'other') return 'other'
  return null
}

export function eventStatusFromIngest(
  postType: IngestPostType,
  updateKind: UpdateKind | null,
): EventStatus {
  if (postType === 'cancellation') return 'cancelled'
  if (postType === 'update') {
    if (updateKind === 'sold_out') return 'sold_out'
    return 'postponed'
  }
  return 'active'
}

export function isMissingEventsStatusColumnError(
  error: { code?: string; message?: string } | null,
): boolean {
  if (!error) return false
  if (error.code === 'PGRST204') return true
  const msg = String(error.message || '').toLowerCase()
  return msg.includes('event_status') || msg.includes('status_updated_at')
}
