import { z } from 'zod'

export const SOURCE_KINDS = ['bot_submit', 'telegram_parse', 'manual_editor'] as const
export const EVENT_KINDS = ['event', 'masterclass', 'news'] as const
export const RECURRENCE_RULES = ['none', 'daily', 'weekly', 'monthly', 'custom'] as const

const nullableTrimmedString = z
  .string()
  .trim()
  .min(1)
  .max(500)
  .nullable()
  .default(null)

export const eventParseResultSchema = z.object({
  title: z.string().trim().min(3).max(160),
  description: z.string().trim().min(10).max(10_000),
  city_slug: nullableTrimmedString,
  event_kind: z.enum(EVENT_KINDS).default('event'),
  category_slug: nullableTrimmedString,
  venue: z.object({
    name: nullableTrimmedString,
    address: nullableTrimmedString,
  }),
  organization: z.object({
    name: nullableTrimmedString,
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

export type EventParseInput = {
  rawText: string
  sourceKind: (typeof SOURCE_KINDS)[number]
  sourceUrl?: string | null
  sourceExternalId?: string | null
  citySlug?: string | null
  timezone?: string | null
  hints?: {
    categorySlug?: string | null
    topicTags?: string[]
  }
}

export const eventParseInputSchema = z.object({
  rawText: z.string().trim().min(10).max(30_000),
  sourceKind: z.enum(SOURCE_KINDS),
  sourceUrl: z.string().trim().max(500).nullable().optional(),
  sourceExternalId: z.string().trim().max(120).nullable().optional(),
  citySlug: z.string().trim().max(64).nullable().optional(),
  timezone: z.string().trim().max(60).nullable().optional(),
  hints: z
    .object({
      categorySlug: z.string().trim().max(64).nullable().optional(),
      topicTags: z.array(z.string().trim().min(2).max(40)).max(10).optional(),
    })
    .optional(),
})

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
