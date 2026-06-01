import { z } from 'zod'
import { WEB_PAGE_TYPES } from '~/server/utils/webParsingTypes'

export const parsingRulesSelectorsSchema = z.object({
  title: z.string().trim().min(1).max(300).nullable().optional(),
  start_time: z.string().trim().min(1).max(300).nullable().optional(),
  description: z.string().trim().min(1).max(300).nullable().optional(),
  price: z.string().trim().min(1).max(300).nullable().optional(),
  poster: z.string().trim().min(1).max(300).nullable().optional(),
})

export const groqParsingRulesResultSchema = z.object({
  page_type: z.enum(WEB_PAGE_TYPES).default('single_event'),
  selectors: parsingRulesSelectorsSchema,
  list_link_pattern: z.string().trim().max(200).nullable().optional(),
})

export type GroqParsingRulesResult = z.infer<typeof groqParsingRulesResultSchema>
