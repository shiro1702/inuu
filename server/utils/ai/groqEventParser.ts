import Groq from 'groq-sdk'
import { createError } from 'h3'
import {
  eventParseInputSchema,
  eventParseResultSchema,
  type EventParseInput,
  type EventParseResult,
} from '~/server/utils/ai/eventParseSchema'
import { slugifyTaxonomy } from '~/server/utils/cityContentTaxonomy'

type ParseAttempt = {
  ok: boolean
  attempt: number
  raw?: string
  error?: string
  usage?: {
    promptTokens: number | null
    completionTokens: number | null
    totalTokens: number | null
  }
}

type ParseOutput = {
  result: EventParseResult
  attempts: ParseAttempt[]
  model: string
  latencyMs: number
}

function buildSystemPrompt(input: EventParseInput) {
  const tagList = input.hints?.availableTags?.map((t) => t.slug).join(', ') || ''
  const categoryList = input.hints?.availableCategories?.map((c) => c.slug).join(', ') || ''
  return [
    'Ты парсер событий и новостей для городского агрегатора.',
    'Твоя задача: извлечь данные из входного текста и вернуть ТОЛЬКО JSON.',
    'Запрещено выдумывать факты: если не найдено — ставь null или пустой массив.',
    tagList
      ? `topic_tags: выбери все подходящие slug из справочника [${tagList}]. Если нет точного — добавь новый slug латиницей (food, live-music). До 8 тегов.`
      : 'topic_tags: slug латиницей, до 8 штук, только реально подходящие теме.',
    categoryList
      ? `category_slug: один slug из [${categoryList}] или новый slug латиницей, если ничего не подходит.`
      : 'category_slug: slug категории латиницей или null.',
    'dates должны быть строками в ISO-like формате, если дата неясна — не выдумывать.',
    'Если в тексте несколько дат одного и того же мероприятия — все даты в recurrence.dates, не дроби на разные события.',
    'confidence: число от 0 до 1.',
    'missing_fields: список недостающих полей для модератора.',
  ].join('\n')
}

function buildUserPrompt(input: EventParseInput) {
  const timezone = input.timezone || 'Asia/Irkutsk'
  const citySlug = input.citySlug || null
  const sourceUrl = input.sourceUrl || null
  const sourceExternalId = input.sourceExternalId || null
  const hints = input.hints || {}
  const tagsHint = Array.isArray(hints.availableTags) && hints.availableTags.length
    ? `KNOWN_TAGS: ${JSON.stringify(hints.availableTags)}`
    : ''
  const categoriesHint = Array.isArray(hints.availableCategories) && hints.availableCategories.length
    ? `KNOWN_CATEGORIES: ${JSON.stringify(hints.availableCategories)}`
    : ''

  return [
    'Верни JSON строго по этой форме:',
    JSON.stringify({
      title: 'string',
      description: 'string',
      city_slug: 'string|null',
      event_kind: 'event|masterclass|news',
      category_slug: 'string|null',
      venue: { name: 'string|null', address: 'string|null' },
      organization: { name: 'string|null' },
      source: {
        kind: 'bot_submit|telegram_parse|manual_editor',
        url: 'string|null',
        external_id: 'string|null',
      },
      is_free: false,
      price_from: 0,
      capacity: null,
      registration_url: 'string|null',
      topic_tags: ['culture'],
      recurrence: {
        rule: 'none|daily|weekly|monthly|custom',
        dates: ['2026-06-15T11:00:00+08:00'],
      },
      confidence: 0.8,
      missing_fields: ['capacity'],
    }),
    '',
    `CONTEXT: timezone=${timezone}`,
    `CONTEXT: source.kind=${input.sourceKind}`,
    `CONTEXT: source.url=${sourceUrl}`,
    `CONTEXT: source.external_id=${sourceExternalId}`,
    `CONTEXT: city_slug=${citySlug}`,
    `CONTEXT: hints=${JSON.stringify({ categorySlug: hints.categorySlug, topicTags: hints.topicTags })}`,
    tagsHint,
    categoriesHint,
    '',
    'INPUT_TEXT:',
    input.rawText,
  ].join('\n')
}

function extractJsonObject(raw: string): unknown {
  const trimmed = raw.trim()
  if (!trimmed) throw new Error('Empty LLM response')
  try {
    return JSON.parse(trimmed)
  } catch {
    const start = trimmed.indexOf('{')
    const end = trimmed.lastIndexOf('}')
    if (start === -1 || end === -1 || end <= start) {
      throw new Error('No JSON object found')
    }
    return JSON.parse(trimmed.slice(start, end + 1))
  }
}

function normalizeResult(result: EventParseResult): EventParseResult {
  const normalizedTags = Array.from(
    new Set(
      (result.topic_tags || [])
        .map((tag) => slugifyTaxonomy(tag))
        .filter((tag) => tag.length >= 2),
    ),
  ).slice(0, 8)

  return {
    ...result,
    topic_tags: normalizedTags,
    category_slug: result.category_slug ? slugifyTaxonomy(result.category_slug) : null,
    source: {
      ...result.source,
      url: result.source.url || null,
      external_id: result.source.external_id || null,
    },
  }
}

async function runSingleAttempt(args: {
  client: Groq
  model: string
  input: EventParseInput
  attempt: number
}): Promise<{
  parsed: EventParseResult
  raw: string
  usage: { promptTokens: number | null; completionTokens: number | null; totalTokens: number | null }
}> {
  const completion = await args.client.chat.completions.create({
    model: args.model,
    temperature: 0,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: buildSystemPrompt(args.input) },
      { role: 'user', content: buildUserPrompt(args.input) },
    ],
  })

  const raw = completion.choices[0]?.message?.content || ''
  const json = extractJsonObject(raw)
  const parsed = eventParseResultSchema.parse(json)
  const usage = completion.usage
  return {
    parsed: normalizeResult(parsed),
    raw,
    usage: {
      promptTokens: typeof usage?.prompt_tokens === 'number' ? usage.prompt_tokens : null,
      completionTokens: typeof usage?.completion_tokens === 'number' ? usage.completion_tokens : null,
      totalTokens: typeof usage?.total_tokens === 'number' ? usage.total_tokens : null,
    },
  }
}

export async function parseEventWithGroq(inputRaw: EventParseInput): Promise<ParseOutput> {
  const startedAt = Date.now()
  const input = eventParseInputSchema.parse(inputRaw)
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
      const { parsed, raw, usage } = await runSingleAttempt({ client, model, input, attempt })
      attempts.push({ ok: true, attempt, raw, usage })
      return { result: parsed, attempts, model, latencyMs: Date.now() - startedAt }
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
    statusMessage: `Failed to parse event payload after ${maxAttempts} attempts`,
    data: { attempts },
  })
}
