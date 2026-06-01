import { z } from 'zod'

export const SOURCE_KINDS = ['bot_submit', 'telegram_parse', 'manual_editor', 'web_cron'] as const
export const EVENT_KINDS = ['event', 'masterclass', 'news'] as const
export const RECURRENCE_RULES = ['none', 'daily', 'weekly', 'monthly', 'custom'] as const
export const PARSE_KINDS = ['single', 'digest'] as const
export const DIGEST_PERIODS = ['week', 'month'] as const

const nullableTrimmedString = z
  .string()
  .trim()
  .min(1)
  .max(500)
  .nullable()
  .default(null)

const nullableUrl = z
  .string()
  .trim()
  .url()
  .max(2000)
  .nullable()
  .default(null)

export const eventParseResultSchema = z.object({
  title: z.string().trim().min(3).max(160),
  description_short: z.string().trim().min(10).max(280),
  description_full: z.string().trim().min(10).max(10_000),
  /** @deprecated synced with description_full */
  description: z.string().trim().min(10).max(10_000),
  cover_media_url: nullableUrl,
  city_slug: nullableTrimmedString,
  event_kind: z.enum(EVENT_KINDS).default('event'),
  category_slug: nullableTrimmedString,
  venue: z.object({
    name: nullableTrimmedString,
    address: nullableTrimmedString,
  }),
  organization: z.object({
    name: nullableTrimmedString,
    id: z.string().uuid().nullable().optional(),
  }),
  source: z.object({
    kind: z.enum(SOURCE_KINDS),
    url: nullableTrimmedString,
    external_id: nullableTrimmedString,
  }),
  is_free: z.boolean(),
  price_from: z.number().nonnegative().nullable().default(null),
  capacity: z.number().int().positive().nullable().default(null),
  registration_url: nullableTrimmedString,
  topic_tags: z.array(z.string().trim().min(2).max(40)).max(5),
  recurrence: z.object({
    rule: z.enum(RECURRENCE_RULES).default('none'),
    dates: z.array(z.string().trim().min(10).max(64)).max(32),
  }),
  confidence: z.number().min(0).max(1),
  missing_fields: z.array(z.string().trim().min(1).max(60)).max(20),
})

export type EventParseResult = z.infer<typeof eventParseResultSchema>

export const eventDigestMetaSchema = z.object({
  title: z.string().trim().min(3).max(160).nullable().default(null),
  period: z.enum(DIGEST_PERIODS).nullable().default(null),
  period_start: z.string().trim().max(64).nullable().default(null),
  period_end: z.string().trim().max(64).nullable().default(null),
})

export type EventDigestMeta = z.infer<typeof eventDigestMetaSchema>

export const eventDigestParseResultSchema = z.object({
  parse_kind: z.enum(PARSE_KINDS),
  digest: eventDigestMetaSchema.nullable().default(null),
  events: z.array(eventParseResultSchema).min(1).max(20),
})

export type EventDigestParseResult = z.infer<typeof eventDigestParseResultSchema>

export type EventParseInput = {
  rawText: string
  sourceKind: (typeof SOURCE_KINDS)[number]
  sourceUrl?: string | null
  sourceExternalId?: string | null
  citySlug?: string | null
  timezone?: string | null
  coverMediaUrl?: string | null
  hints?: {
    categorySlug?: string | null
    topicTags?: string[]
    preferDigest?: boolean
    contextType?: string | null
    availableTags?: Array<{ slug: string; name: string }>
    availableCategories?: Array<{ slug: string; name: string }>
  }
}

const eventParseHintsSchema = z
  .object({
    categorySlug: z.string().trim().max(64).nullable().optional(),
    topicTags: z.array(z.string().trim().min(2).max(40)).max(10).optional(),
    preferDigest: z.boolean().optional(),
    contextType: z.string().trim().max(32).nullable().optional(),
    availableTags: z
      .array(z.object({ slug: z.string(), name: z.string() }))
      .max(100)
      .optional(),
    availableCategories: z
      .array(z.object({ slug: z.string(), name: z.string() }))
      .max(100)
      .optional(),
  })
  .optional()

export const eventParseInputSchema = z
  .object({
    rawText: z.string().trim().max(30_000),
    sourceKind: z.enum(SOURCE_KINDS),
    sourceUrl: z.string().trim().max(500).nullable().optional(),
    sourceExternalId: z.string().trim().max(120).nullable().optional(),
    citySlug: z.string().trim().max(64).nullable().optional(),
    timezone: z.string().trim().max(60).nullable().optional(),
    hints: eventParseHintsSchema,
  })
  .superRefine((data, ctx) => {
    const textLen = data.rawText.trim().length
    const hasSourceUrl = !!(data.sourceUrl && data.sourceUrl.trim())
    const hasUrlInText = /https?:\/\//i.test(data.rawText)
    if (textLen < 1 && !hasSourceUrl && !hasUrlInText) {
      ctx.addIssue({
        code: 'custom',
        message: 'rawText or URL is required',
        path: ['rawText'],
      })
      return
    }
    if (textLen < 10 && !hasSourceUrl && !hasUrlInText) {
      ctx.addIssue({
        code: 'custom',
        message: 'rawText must be at least 10 characters when no URL is provided',
        path: ['rawText'],
      })
    }
  })

const DIGEST_KEYWORDS = [
  'афиша',
  'на неделю',
  'на месяц',
  'главное',
  'подборка',
  'дайджест',
  'digest',
  'что посетить',
  'куда сходить',
]

/** Heuristic: message likely lists multiple distinct events. */
export function detectPreferDigest(rawText: string): boolean {
  const text = rawText.toLowerCase()
  if (DIGEST_KEYWORDS.some((kw) => text.includes(kw))) return true
  const dateLikeLines = rawText
    .split(/\n+/)
    .filter((line) => /\d{1,2}[./]\d{1,2}|\d{1,2}\s+(январ|феврал|март|апрел|ма[йя]|июн|июл|август|сентябр|октябр|ноябр|декабр)/i.test(line))
  if (dateLikeLines.length >= 3) return true
  const numberedItems = rawText.match(/^\s*\d+[.)]\s+/gm)
  if (numberedItems && numberedItems.length >= 3) return true
  return false
}

export const EVENT_PARSE_TAGS = [
  'food',
  'culture',
  'family',
  'nightlife',
  'sport',
  'beauty',
  'tourism',
  'city',
] as const
