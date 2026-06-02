import Groq from 'groq-sdk'

export type CuratedCopyEventFact = {
  title: string
  starts_at: string
  venue?: string | null
  category?: string | null
}

function safeFallback(args: {
  mode: 'weekly' | 'custom'
  eventCount: number
  cityName: string
  dateFrom?: string | null
  dateTo?: string | null
}): { title: string; description: string } {
  if (args.mode === 'weekly') {
    const title = args.dateFrom && args.dateTo
      ? `Главное на выходные ${args.dateFrom} – ${args.dateTo}`
      : 'Главное на выходные'
    const description = `Подборка на выходные для ${args.cityName}: ${args.eventCount} событий.`
    return { title, description }
  }
  return {
    title: `Подборка по интересам · ${args.cityName}`,
    description: `Собрано ${args.eventCount} событий по выбранным фильтрам.`,
  }
}

function extractJson(raw: string): unknown {
  const text = String(raw || '').trim()
  if (!text) throw new Error('empty_llm_response')
  try {
    return JSON.parse(text)
  } catch {
    const start = text.indexOf('{')
    const end = text.lastIndexOf('}')
    if (start < 0 || end <= start) throw new Error('json_not_found')
    return JSON.parse(text.slice(start, end + 1))
  }
}

export async function generateCuratedListCopy(args: {
  mode: 'weekly' | 'custom'
  cityName: string
  dateFrom?: string | null
  dateTo?: string | null
  events: CuratedCopyEventFact[]
}): Promise<{ title: string; description: string; model: string; latencyMs: number }> {
  const fallback = safeFallback({
    mode: args.mode,
    eventCount: args.events.length,
    cityName: args.cityName,
    dateFrom: args.dateFrom || null,
    dateTo: args.dateTo || null,
  })
  if (!args.events.length) {
    return { ...fallback, model: 'fallback', latencyMs: 0 }
  }

  const config = useRuntimeConfig()
  const apiKey = String(config.groqApiKey || '').trim()
  const model = String(config.groqModel || '').trim() || 'llama-3.3-70b-versatile'
  if (!apiKey) {
    return { ...fallback, model: 'fallback', latencyMs: 0 }
  }

  const client = new Groq({ apiKey })
  const started = Date.now()
  const systemPrompt = [
    'Ты редактор городских подборок.',
    'Верни только JSON: {"title":"...","description":"..."}',
    'Без выдуманных фактов: используй только события из EVENTS.',
    'Не добавляй площадки, даты или артистов, которых нет в EVENTS.',
    'title: до 90 символов, description: до 240 символов.',
  ].join('\n')
  const userPrompt = [
    `MODE=${args.mode}`,
    `CITY=${args.cityName}`,
    `DATE_FROM=${args.dateFrom || '-'}`,
    `DATE_TO=${args.dateTo || '-'}`,
    `EVENTS=${JSON.stringify(args.events)}`,
  ].join('\n')

  try {
    const completion = await client.chat.completions.create({
      model,
      temperature: 0,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    })
    const raw = completion.choices[0]?.message?.content || ''
    const parsed = extractJson(raw) as { title?: unknown; description?: unknown }
    const title = typeof parsed.title === 'string' ? parsed.title.trim() : ''
    const description = typeof parsed.description === 'string' ? parsed.description.trim() : ''
    if (!title || !description) {
      return { ...fallback, model, latencyMs: Date.now() - started }
    }
    return { title, description, model, latencyMs: Date.now() - started }
  } catch {
    return { ...fallback, model, latencyMs: Date.now() - started }
  }
}
