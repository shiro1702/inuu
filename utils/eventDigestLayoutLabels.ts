import { EVENT_DIGEST_ALL_LAYOUTS } from '~/utils/eventDigestLayouts'

export function eventDigestLayoutLabel(layoutId?: string | null): string {
  const id = String(layoutId || '').trim()
  if (!id) return ''
  return EVENT_DIGEST_ALL_LAYOUTS.find((l) => l.id === id)?.label || ''
}
