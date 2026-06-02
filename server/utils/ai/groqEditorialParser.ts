import Groq from 'groq-sdk'
import { createError } from 'h3'
import {
  buildEditorialParseSystemPrompt,
  buildEditorialParseUserPrompt,
} from '~/server/utils/ai/editorialParsePrompt'
import {
  editorialParseInputSchema,
  editorialParseResultSchema,
  normalizeEditorialDescriptions,
  type EditorialParseInput,
  type EditorialParseResult,
} from '~/server/utils/ai/editorialParseSchema'
import { slugifyTaxonomy } from '~/server/utils/cityContentTaxonomy'

type ParseAttempt = {
  ok: boolean
  attempt: number
  error?: string
  usage?: {
    promptTokens: number | null
    completionTokens: number | null
    totalTokens: number | null
  }
}

export type EditorialParseOutput = {
  result: EditorialParseResult
  attempts: ParseAttempt[]
  model: string
  latencyMs: number
}

function extractJsonObject(raw: string): unknown {
  const trimmed = raw.trim()
  if (!trimmed) throw new Error('Empty LLM response')
  try {
    return JSON.parse(trimmed)
  } catch {
    const start = trimmed.indexOf('{')
    const end = trimmed.lastIndexOf('}')
    if (start === -1 || end === -1 || end <= start) throw new Error('No JSON object found')
    return JSON.parse(trimmed.slice(start, end + 1))
  }
}

function applyInputDefaults(
  result: EditorialParseResult,
  input: EditorialParseInput,
): EditorialParseResult {
  const tags = Array.from(
    new Set(
      (result.topic_tags || [])
        .map((tag) => slugifyTaxonomy(tag))
        .filter((tag) => tag.length >= 2),
    ),
  ).slice(0, 5)

  const contentType = input.contentTypeHint || result.content_type

  return normalizeEditorialDescriptions({
    ...result,
    content_type: contentType,
    city_slug: result.city_slug || input.citySlug || null,
    cover_media_url: result.cover_media_url || input.coverMediaUrl || null,
    video_url: result.video_url || input.videoUrl || null,
    topic_tags: tags,
    source: {
      kind: input.sourceKind,
      url: result.source?.url || input.sourceUrl || null,
      external_id: result.source?.external_id || input.sourceExternalId || null,
    },
  })
}

export async function parseEditorialWithGroq(
  inputRaw: EditorialParseInput,
): Promise<EditorialParseOutput> {
  const startedAt = Date.now()
  const input = editorialParseInputSchema.parse(inputRaw)
  const config = useRuntimeConfig()
  const apiKey = String(config.groqApiKey || '').trim()
  const model = String(config.groqModel || '').trim() || 'llama-3.3-70b-versatile'

  if (!apiKey) {
    throw createError({ statusCode: 500, statusMessage: 'NUXT_GROQ_API_KEY is not configured' })
  }

  const client = new Groq({ apiKey })
  const attempts: ParseAttempt[] = []
  const maxAttempts = 2

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const completion = await client.chat.completions.create({
        model,
        temperature: 0,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: buildEditorialParseSystemPrompt(input) },
          { role: 'user', content: buildEditorialParseUserPrompt(input) },
        ],
      })

      const raw = completion.choices[0]?.message?.content || ''
      const json = extractJsonObject(raw)
      const parsed = editorialParseResultSchema.parse(json)
      const usage = completion.usage
      attempts.push({
        ok: true,
        attempt,
        usage: {
          promptTokens: typeof usage?.prompt_tokens === 'number' ? usage.prompt_tokens : null,
          completionTokens: typeof usage?.completion_tokens === 'number' ? usage.completion_tokens : null,
          totalTokens: typeof usage?.total_tokens === 'number' ? usage.total_tokens : null,
        },
      })

      return {
        result: applyInputDefaults(parsed, input),
        attempts,
        model,
        latencyMs: Date.now() - startedAt,
      }
    } catch (error: any) {
      attempts.push({
        ok: false,
        attempt,
        error: error?.message ? String(error.message) : 'Unknown parse error',
      })
    }
  }

  throw createError({
    statusCode: 422,
    statusMessage: `Failed to parse editorial payload after ${maxAttempts} attempts`,
    data: { attempts },
  })
}
