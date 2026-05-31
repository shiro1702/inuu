import type { EventCta, EventSaleMode } from '~/types/storefront'

export type { EventCta, EventSaleMode }

const PARSED_CHANNELS = new Set([
  'telegram_parse',
  'web_cron',
  'vk_parse',
])

export function resolveEventSaleMode(row: {
  source_channel?: string | null
  shop_id?: string | null
}): EventSaleMode {
  const ch = String(row.source_channel || '').trim()
  if (PARSED_CHANNELS.has(ch)) return 'parsed'
  return 'native'
}

export function resolveEventCta(args: {
  saleMode: EventSaleMode
  registrationUrl?: string | null
  sourceUrl?: string | null
}): EventCta {
  if (args.saleMode === 'parsed') {
    return {
      emoji: '🌐',
      label: 'На сайт',
      url: args.sourceUrl || args.registrationUrl || null,
    }
  }
  return {
    emoji: '🎟',
    label: 'Купить',
    url: args.registrationUrl || args.sourceUrl || null,
  }
}
