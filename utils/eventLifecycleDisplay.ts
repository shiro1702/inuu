export type EventStatus = 'active' | 'cancelled' | 'sold_out' | 'postponed'

const STATUS_LABELS: Record<EventStatus, string> = {
  active: '',
  cancelled: 'Отменено',
  sold_out: 'Sold out',
  postponed: 'Перенесено',
}

export function eventStatusLabel(status: string | null | undefined): string {
  const key = String(status || 'active') as EventStatus
  return STATUS_LABELS[key] || ''
}

export function shouldHideEventCta(status: string | null | undefined): boolean {
  const s = String(status || 'active')
  return s === 'cancelled' || s === 'sold_out'
}
