import Groq from 'groq-sdk'
import { createError, defineEventHandler, readBody } from 'h3'

function extractJson(raw: string): unknown {
  const trimmed = raw.trim()
  try {
    return JSON.parse(trimmed)
  } catch {
    const start = trimmed.indexOf('{')
    const end = trimmed.lastIndexOf('}')
    if (start === -1 || end === -1) throw new Error('No JSON')
    return JSON.parse(trimmed.slice(start, end + 1))
  }
}

type Body = {
  layout_config?: Record<string, unknown>
  text?: string
}

export default defineEventHandler(async (event) => {
  const body = await readBody<Body>(event)
  const layout = body?.layout_config
  const text = body?.text?.trim()
  if (!layout || !text) {
    throw createError({ statusCode: 400, statusMessage: 'layout_config and text required' })
  }

  const config = useRuntimeConfig()
  const apiKey = String(config.groqApiKey || '').trim()
  if (!apiKey) {
    throw createError({ statusCode: 500, statusMessage: 'NUXT_GROQ_API_KEY is not configured' })
  }

  const client = new Groq({ apiKey })
  const completion = await client.chat.completions.create({
    model: String(config.groqModel || 'llama-3.3-70b-versatile'),
    temperature: 0.3,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: 'Обнови только текстовые поля content в layout_config. Координаты и id не менять. Верни JSON { layout_config }.',
      },
      {
        role: 'user',
        content: `layout_config:\n${JSON.stringify(layout)}\n\nНовый текст:\n${text}`,
      },
    ],
  })

  const raw = completion.choices[0]?.message?.content || ''
  const json = extractJson(raw) as { layout_config?: Record<string, unknown> }
  return {
    ok: true as const,
    layout_config: json.layout_config || layout,
  }
})
