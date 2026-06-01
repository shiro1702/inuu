import Groq from 'groq-sdk'
import { createError } from 'h3'
import {
  groqParsingRulesResultSchema,
  type GroqParsingRulesResult,
} from '~/server/utils/ai/groqParsingRulesSchema'
import type { SanitizedWebPage } from '~/server/utils/webPageSanitizer'

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

export async function generateParsingRules(page: SanitizedWebPage): Promise<{
  rules: GroqParsingRulesResult
  model: string
  latencyMs: number
}> {
  const startedAt = Date.now()
  const config = useRuntimeConfig()
  const apiKey = String(config.groqApiKey || '').trim()
  const model = String(config.groqClassifierModel || '').trim() || 'llama-3.1-8b-instant'

  if (!apiKey) {
    throw createError({ statusCode: 500, statusMessage: 'NUXT_GROQ_API_KEY is not configured' })
  }

  const client = new Groq({ apiKey })
  const completion = await client.chat.completions.create({
    model,
    temperature: 0,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content:
          'Generate stable CSS selectors for cheerio to extract event fields. Use @attr suffix for attributes, e.g. "img@src". Return JSON only.',
      },
      {
        role: 'user',
        content: [
          'Return:',
          '{ "page_type": "single_event", "selectors": { "title": "h1", "start_time": "time[datetime]", "description": ".body", "price": ".price", "poster": "img@src" }, "list_link_pattern": null }',
          '',
          `URL: ${page.finalUrl}`,
          'HTML_SNIPPET:',
          page.htmlSnippet.slice(0, 2500),
        ].join('\n'),
      },
    ],
  })

  const raw = completion.choices[0]?.message?.content || ''
  const rules = groqParsingRulesResultSchema.parse(extractJsonObject(raw))

  return { rules, model, latencyMs: Date.now() - startedAt }
}
