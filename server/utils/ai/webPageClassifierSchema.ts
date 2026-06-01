import { z } from 'zod'
import { WEB_PAGE_TYPES } from '~/server/utils/webParsingTypes'

export const webPageClassifierResultSchema = z.object({
  page_type: z.enum(WEB_PAGE_TYPES),
  event_urls: z.array(z.string().url().max(2000)).max(30).default([]),
  confidence: z.number().min(0).max(1),
  list_link_pattern: z.string().trim().max(200).nullable().optional(),
})

export type WebPageClassifierResult = z.infer<typeof webPageClassifierResultSchema>
