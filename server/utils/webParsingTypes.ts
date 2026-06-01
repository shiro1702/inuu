export const WEB_PAGE_TYPES = [
  'single_event',
  'event_list_links',
  'text_wall',
  'unknown',
] as const

export type WebPageType = (typeof WEB_PAGE_TYPES)[number]

export type ParsingStrategy = {
  page_type: WebPageType
  list_link_pattern?: string | null
  confidence?: number | null
  classified_at?: string | null
  fail_count?: number | null
}

export type ParsingRulesSelectors = {
  title?: string | null
  start_time?: string | null
  description?: string | null
  price?: string | null
  poster?: string | null
}

export type ParsingRules = {
  page_type?: WebPageType | null
  selectors?: ParsingRulesSelectors | null
  list_link_pattern?: string | null
}

export function parseParsingStrategy(raw: unknown): ParsingStrategy | null {
  if (!raw || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>
  const pageType = String(o.page_type || '')
  if (!WEB_PAGE_TYPES.includes(pageType as WebPageType)) return null
  return {
    page_type: pageType as WebPageType,
    list_link_pattern: typeof o.list_link_pattern === 'string' ? o.list_link_pattern : null,
    confidence: typeof o.confidence === 'number' ? o.confidence : null,
    classified_at: typeof o.classified_at === 'string' ? o.classified_at : null,
    fail_count: typeof o.fail_count === 'number' ? o.fail_count : null,
  }
}

export function parseParsingRules(raw: unknown): ParsingRules | null {
  if (!raw || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>
  const selectorsRaw = o.selectors
  let selectors: ParsingRulesSelectors | null = null
  if (selectorsRaw && typeof selectorsRaw === 'object') {
    const s = selectorsRaw as Record<string, unknown>
    selectors = {
      title: typeof s.title === 'string' ? s.title : null,
      start_time: typeof s.start_time === 'string' ? s.start_time : null,
      description: typeof s.description === 'string' ? s.description : null,
      price: typeof s.price === 'string' ? s.price : null,
      poster: typeof s.poster === 'string' ? s.poster : null,
    }
  }
  const pageType = o.page_type ? String(o.page_type) : null
  return {
    page_type:
      pageType && WEB_PAGE_TYPES.includes(pageType as WebPageType)
        ? (pageType as WebPageType)
        : null,
    selectors,
    list_link_pattern: typeof o.list_link_pattern === 'string' ? o.list_link_pattern : null,
  }
}
