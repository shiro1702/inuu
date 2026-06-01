import Groq from 'groq-sdk'
import { createError } from 'h3'
import {
  webPageClassifierResultSchema,
  type WebPageClassifierResult,
} from '~/server/utils/ai/webPageClassifierSchema'
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

function buildClassifierPrompt(page: SanitizedWebPage): string {
  const linkSample = page.links.slice(0, 25).join('\n')
  return [
    'Classify this web page for an events ingest pipeline.',
    'Return JSON only:',
    '{ "page_type": "single_event"|"event_list_links"|"text_wall"|"unknown",',
    '  "event_urls": ["https://..."],',
    '  "confidence": 0.0-1.0,',
    '  "list_link_pattern": "/events/*" or null }',
    '',
    'Rules:',
    '- single_event: one event on the page',
    '- event_list_links: list of links to separate event pages; put absolute URLs in event_urls',
    '- text_wall: many events described in one page text without separate URLs',
    '- unknown: not an events page',
    '',
    `PAGE_URL: ${page.finalUrl}`,
    'LINKS:',
    linkSample || '(none)',
    '',
    'TEXT:',
    page.text,
  ].join('\n')
}

export type ClassifyWebPageOutput = {
  result: WebPageClassifierResult
  model: string
  latencyMs: number
  raw: string
}

export async function classifyWebPage(page: SanitizedWebPage): Promise<ClassifyWebPageOutput> {
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
          'You classify HTML pages for event ingestion. Respond with valid JSON only. Use absolute URLs in event_urls.',
      },
      { role: 'user', content: buildClassifierPrompt(page) },
    ],
  })

  const raw = completion.choices[0]?.message?.content || ''
  const json = extractJsonObject(raw)
  const result = webPageClassifierResultSchema.parse(json)

  return {
    result,
    model,
    latencyMs: Date.now() - startedAt,
    raw,
  }
}
