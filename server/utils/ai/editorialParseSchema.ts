import { z } from 'zod'
import { CONTENT_INTAKE_CHANNELS } from '~/server/utils/contentSubmissionIntake'

export const EDITORIAL_CONTENT_TYPES = [
  'venue_review',
  'venue_post',
  'news',
  'story',
] as const

export type EditorialContentType = (typeof EDITORIAL_CONTENT_TYPES)[number]

export const EDITORIAL_POST_TYPES = ['review', 'announcement', 'news'] as const
export const EDITORIAL_SOURCE_KINDS = ['bot_submit', 'telegram_parse', 'manual_editor'] as const

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

export const editorialStorySlideSchema = z.object({
  media_url: z.string().trim().max(2000).default(''),
  duration_seconds: z.number().int().min(1).max(120).default(5),
  action_type: z.enum(['open_url', 'open_venue', 'open_event', 'none']).default('none'),
  action_payload: z.record(z.unknown()).default({}),
})

export type EditorialStorySlide = z.infer<typeof editorialStorySlideSchema>

export const editorialParseResultSchema = z.object({
  content_type: z.enum(EDITORIAL_CONTENT_TYPES),
  post_type: z.enum(EDITORIAL_POST_TYPES).default('review'),
  title: z.string().trim().min(3).max(160),
  description_short: z.string().trim().min(10).max(280),
  description_full: z.string().trim().min(10).max(10_000),
  cover_media_url: nullableUrl,
  video_url: nullableUrl,
  media_urls: z.array(z.string().trim().url().max(2000)).max(12).default([]),
  city_slug: nullableTrimmedString,
  publication_date: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .nullable()
    .default(null),
  venue: z.object({
    name: nullableTrimmedString,
    id: z.string().uuid().nullable().optional(),
  }),
  organization: z.object({
    name: nullableTrimmedString,
    id: z.string().uuid().nullable().optional(),
  }),
  source: z.object({
    kind: z.enum(EDITORIAL_SOURCE_KINDS),
    url: nullableTrimmedString,
    external_id: nullableTrimmedString,
    intake: z.enum(CONTENT_INTAKE_CHANNELS).optional(),
  }),
  topic_tags: z.array(z.string().trim().min(2).max(40)).max(5),
  story: z
    .object({
      title: z.string().trim().min(3).max(120),
      slides: z.array(editorialStorySlideSchema).max(12),
    })
    .nullable()
    .default(null),
  confidence: z.number().min(0).max(1),
  missing_fields: z.array(z.string().trim().min(1).max(60)).max(20),
})

export type EditorialParseResult = z.infer<typeof editorialParseResultSchema>

export const editorialParseInputSchema = z.object({
  rawText: z.string().trim().min(1).max(50_000),
  sourceKind: z.enum(EDITORIAL_SOURCE_KINDS).default('manual_editor'),
  sourceUrl: z.string().trim().url().max(2000).optional().nullable(),
  sourceExternalId: z.string().trim().max(200).optional().nullable(),
  citySlug: z.string().trim().min(2).max(80).optional().nullable(),
  timezone: z.string().trim().min(3).max(64).optional().nullable(),
  contentTypeHint: z.enum(EDITORIAL_CONTENT_TYPES).optional().nullable(),
  coverMediaUrl: z.string().trim().url().max(2000).optional().nullable(),
  videoUrl: z.string().trim().url().max(2000).optional().nullable(),
  hints: z
    .object({
      availableTags: z.array(z.string()).optional(),
    })
    .optional(),
})

export type EditorialParseInput = z.infer<typeof editorialParseInputSchema>

export function normalizeEditorialDescriptions(
  payload: EditorialParseResult,
): EditorialParseResult {
  const full = payload.description_full || payload.description_short
  const short = payload.description_short || full.slice(0, 280)
  return {
    ...payload,
    description_full: full,
    description_short: short.slice(0, 280),
  }
}

export function isEditorialPayload(payload: unknown): payload is EditorialParseResult & Record<string, unknown> {
  if (!payload || typeof payload !== 'object') return false
  const ct = (payload as { content_type?: unknown }).content_type
  return typeof ct === 'string' && (EDITORIAL_CONTENT_TYPES as readonly string[]).includes(ct)
}

export function submissionKindFromEditorial(contentType: string): string {
  if (contentType === 'story') return 'story'
  if (contentType === 'venue_review') return 'venue_review'
  if (contentType === 'venue_post') return 'venue_post'
  return 'news'
}

export function editorialPostTypeFromPayload(payload: EditorialParseResult): string {
  if (payload.content_type === 'story') return 'announcement'
  if (payload.post_type) return payload.post_type
  if (payload.content_type === 'venue_review') return 'review'
  if (payload.content_type === 'venue_post') return 'venue_post'
  return 'news'
}
