import type { IngestPostType } from '~/server/utils/ai/eventParseSchema'

const POST_TYPE_LABELS: Record<IngestPostType, string> = {
  new_event: 'Новое событие',
  cancellation: 'Отмена / закрытие',
  update: 'Перенос / изменение',
  trash: 'Не событие',
}

export function normalizeIngestPostType(raw: unknown): IngestPostType {
  const key = String(raw || 'new_event').trim().toLowerCase()
  if (key === 'cancellation' || key === 'cancel') return 'cancellation'
  if (key === 'update' || key === 'reschedule' || key === 'sold_out' || key === 'sold-out') return 'update'
  if (key === 'trash' || key === 'not_event' || key === 'ignore') return 'trash'
  return 'new_event'
}

export function ingestPostTypeLabel(postType: IngestPostType): string {
  return POST_TYPE_LABELS[postType] || postType
}

export function shouldSkipPersistForPostType(postType: IngestPostType): boolean {
  return postType === 'trash'
}

export function moderationStatusForPostType(
  postType: IngestPostType,
  base: 'pending' | 'needs_revision',
): 'pending' | 'needs_revision' {
  if (postType === 'cancellation' || postType === 'update') return 'needs_revision'
  return base
}
