import Groq from 'groq-sdk'
import { createError } from 'h3'
import type { CarouselSlide, CarouselSlideRole } from '~/types/editorialCarousel'
import { groqErrorHint } from '~/server/utils/ai/groqParseErrors'
import {
  groqCarouselEventFieldsPrompt,
  groqCarouselSlideJsonShape,
  mapGroqPayloadToCarouselSlide,
  type GroqCarouselSlidePayload,
} from '~/utils/groqCarouselSlideMap'
import { parseSlideEventText } from '~/utils/parseSlideEventText'

export type GroqCarouselSlide = GroqCarouselSlidePayload & {
  type: 'first' | 'middle' | 'last'
}

export type GroqCarouselResponse = {
  carousel_title?: string
  theme?: string
  telegram_post_text?: string
  slides: GroqCarouselSlide[]
  sticker_intents?: Array<{
    tag: string
    anchor?: 'flow' | 'canvas'
    anchor_target?: string
    position_hint?: string
  }>
}

function extractJson(raw: string): unknown {
  const trimmed = raw.trim()
  if (!trimmed) throw new Error('Empty LLM response')
  try {
    return JSON.parse(trimmed)
  } catch {
    const start = trimmed.indexOf('{')
    const end = trimmed.lastIndexOf('}')
    if (start === -1 || end === -1) throw new Error('No JSON object found')
    return JSON.parse(trimmed.slice(start, end + 1))
  }
}

function groqTypeToRole(type: string): CarouselSlideRole {
  if (type === 'first') return 'cover'
  if (type === 'last') return 'outro'
  return 'body'
}

export function roleToGroqType(role: CarouselSlideRole): 'first' | 'middle' | 'last' {
  if (role === 'cover') return 'first'
  if (role === 'outro') return 'last'
  return 'middle'
}

export function mapGroqSlidesToCarousel(slides: GroqCarouselSlide[], vibe = 'party'): CarouselSlide[] {
  return slides.map((s) => {
    const role = groqTypeToRole(String(s.type || 'middle'))
    return mapGroqPayloadToCarouselSlide(s, role, vibe)
  })
}

export type CarouselGenerateMode = 'raw' | 'events' | 'text_mash' | 'poster' | 'single_slide'

export function mapGroqSlideToCarousel(
  slide: GroqCarouselSlide,
  role: CarouselSlideRole,
  vibe = 'party',
): CarouselSlide {
  const forcedType = roleToGroqType(role)
  return mapGroqSlidesToCarousel([{ ...slide, type: forcedType }], vibe)[0]!
}

export function localFallbackSlideFromText(
  text: string,
  role: CarouselSlideRole,
  vibe = 'party',
): CarouselSlide {
  const lines = text
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean)
  const first = lines[0] || 'Слайд'

  if (role === 'cover') {
    return { role, title: first, media_url: null, gradient: vibe }
  }
  if (role === 'outro') {
    return {
      role,
      cta_text: first,
      title: lines[1] || undefined,
      gradient: vibe,
    }
  }

  const parsed = parseSlideEventText(text)
  return {
    role: 'body',
    title: parsed.title || (parsed.isStructured ? undefined : first),
    event_datetime: parsed.event_datetime || null,
    event_venue: parsed.event_venue || null,
    event_price: parsed.event_price || null,
    bullets: parsed.theses.length
      ? parsed.theses
      : parsed.isStructured
        ? undefined
        : lines.slice(1).length
          ? lines.slice(1)
          : ['Детали скоро'],
    gradient: vibe,
  }
}

export async function generateCarouselWithGroq(args: {
  mode: CarouselGenerateMode
  text?: string
  cityName?: string
  citySlug?: string
  events?: Array<{
    title: string
    excerpt?: string | null
    tldr?: string | null
    startsAt?: string | null
    venueTitle?: string | null
    price?: string | null
    coverMediaUrl?: string | null
  }>
  projectType?: string
}): Promise<{ result: GroqCarouselResponse; model: string; latencyMs: number }> {
  const config = useRuntimeConfig()
  const apiKey = String(config.groqApiKey || '').trim()
  const primaryModel = String(config.groqModel || '').trim() || 'llama-3.3-70b-versatile'
  const fallbackModel = String(config.groqClassifierModel || '').trim() || 'llama-3.1-8b-instant'
  const models = [...new Set([primaryModel, fallbackModel].filter(Boolean))]

  if (!apiKey) {
    throw createError({ statusCode: 500, statusMessage: 'NUXT_GROQ_API_KEY is not configured' })
  }

  const startedAt = Date.now()
  const client = new Groq({ apiKey })
  let lastError: unknown = null

  const shape = {
    carousel_title: 'string',
    theme: 'cozy_aesthetic | urban_brutal | soft_minimal',
    telegram_post_text: 'string — markdown для TG поста',
    slides: [groqCarouselSlideJsonShape()],
    sticker_intents: [
      { tag: 'fire', anchor: 'flow', anchor_target: 'title', position_hint: 'top-right' },
    ],
  }

  let userContent = ''
  if (args.mode === 'events' && args.events?.length) {
    userContent = [
      'Упакуй выбранные события в Instagram-карусель 3–6 слайдов.',
      `Город: ${args.cityName || args.citySlug || 'город'}`,
      'События:',
      ...args.events.map((e, i) => [
        `${i + 1}. ${e.title}`,
        e.startsAt ? `Дата: ${e.startsAt}` : '',
        e.venueTitle ? `Место: ${e.venueTitle}` : '',
        e.price ? `Цена: ${e.price}` : '',
        e.tldr || e.excerpt ? `Описание: ${e.tldr || e.excerpt}` : '',
      ].filter(Boolean).join('\n')),
    ].join('\n')
  } else if (args.mode === 'text_mash') {
    userContent = [
      'Из текста-каши (один пост с несколькими событиями) извлеки события и собери карусель.',
      args.text || '',
    ].join('\n\n')
  } else if (args.mode === 'poster') {
    userContent = [
      'Сделай один слайд-афишу 9:16: category → title → date_time → location → description (≤60 симв.) → badge.',
      args.text || '',
    ].join('\n\n')
  } else {
    userContent = [
      'Преврати текст анонса в карусель 3–5 слайдов для Instagram.',
      args.text || '',
    ].join('\n\n')
  }

  const messages = [
    {
      role: 'system' as const,
      content: [
        'Ты — SMM-дизайнер INUU. Верни только JSON.',
        'Слайды: first (обложка), middle (контент), last (CTA).',
        groqCarouselEventFieldsPrompt(),
        'image_tags — 1–3 английских тега для подбора фона.',
        'Без выдуманных фактов. Кратко, для мобильного чтения.',
        'Если в тексте блоки разделены строкой ---, это границы слайдов: первый блок — обложка, пустой слайд не добавляй.',
      ].join('\n'),
    },
    {
      role: 'user' as const,
      content: ['Форма JSON:', JSON.stringify(shape), '', userContent].join('\n'),
    },
  ]

  for (const model of models) {
    try {
      const completion = await client.chat.completions.create({
        model,
        temperature: 0.35,
        response_format: { type: 'json_object' },
        messages,
      })

      const raw = completion.choices[0]?.message?.content || ''
      const json = extractJson(raw) as GroqCarouselResponse
      const slides = Array.isArray(json.slides) ? json.slides : []
      if (!slides.length) {
        throw new Error('Groq returned empty slides')
      }

      return {
        result: {
          carousel_title: String(json.carousel_title || '').trim(),
          theme: String(json.theme || '').trim(),
          telegram_post_text: String(json.telegram_post_text || '').trim(),
          slides,
          sticker_intents: Array.isArray(json.sticker_intents) ? json.sticker_intents : [],
        },
        model,
        latencyMs: Date.now() - startedAt,
      }
    } catch (err: unknown) {
      lastError = err
    }
  }

  throw createError({
    statusCode: 502,
    statusMessage: groqErrorHint(lastError),
  })
}

export async function generateSlideWithGroq(args: {
  text: string
  slideRole: CarouselSlideRole
  cityName?: string
  citySlug?: string
  carouselTitle?: string
  slideIndex?: number
  totalSlides?: number
}): Promise<{
  slide: GroqCarouselSlide
  sticker_intents: GroqCarouselResponse['sticker_intents']
  model: string
  latencyMs: number
}> {
  const config = useRuntimeConfig()
  const apiKey = String(config.groqApiKey || '').trim()
  const primaryModel = String(config.groqModel || '').trim() || 'llama-3.3-70b-versatile'
  const fallbackModel = String(config.groqClassifierModel || '').trim() || 'llama-3.1-8b-instant'
  const models = [...new Set([primaryModel, fallbackModel].filter(Boolean))]

  if (!apiKey) {
    throw createError({ statusCode: 500, statusMessage: 'NUXT_GROQ_API_KEY is not configured' })
  }

  const startedAt = Date.now()
  const client = new Groq({ apiKey })
  const slideType = roleToGroqType(args.slideRole)
  let lastError: unknown = null

  const roleHint =
    args.slideRole === 'cover'
      ? 'обложка карусели: яркий заголовок, короткий subtitle, image_tags для фона'
      : args.slideRole === 'outro'
        ? 'финальный CTA-слайд: cta_text, минимум текста, призыв открыть в приложении'
        : 'контентный слайд: title, event_datetime, event_venue, event_price, text (тезис), image_tags'

  const context = [
    args.carouselTitle ? `Название карусели: ${args.carouselTitle}` : '',
    args.slideIndex != null && args.totalSlides
      ? `Слайд ${args.slideIndex + 1} из ${args.totalSlides}`
      : '',
    args.cityName || args.citySlug ? `Город: ${args.cityName || args.citySlug}` : '',
  ]
    .filter(Boolean)
    .join('\n')

  const shape = {
    slide: { ...groqCarouselSlideJsonShape(), type: slideType },
    sticker_intents: [
      { tag: 'fire', anchor: 'flow', anchor_target: 'title', position_hint: 'top-right' },
    ],
  }

  const messages = [
    {
      role: 'system' as const,
      content: [
        'Ты — SMM-дизайнер INUU. Верни только JSON с одним слайдом.',
        `Тип слайда: ${slideType}. ${roleHint}`,
        groqCarouselEventFieldsPrompt(),
        'image_tags — 1–3 английских тега для подбора фона.',
        'sticker_intents — 0–2 стикера по контексту (можно пустой массив).',
        'Без выдуманных фактов. Кратко, для мобильного чтения.',
      ].join('\n'),
    },
    {
      role: 'user' as const,
      content: [
        'Форма JSON:',
        JSON.stringify(shape),
        context,
        'Исходный текст для этого слайда:',
        args.text,
      ].join('\n\n'),
    },
  ]

  for (const model of models) {
    try {
      const completion = await client.chat.completions.create({
        model,
        temperature: 0.35,
        response_format: { type: 'json_object' },
        messages,
      })

      const raw = completion.choices[0]?.message?.content || ''
      const json = extractJson(raw) as {
        slide?: GroqCarouselSlide
        sticker_intents?: GroqCarouselResponse['sticker_intents']
      }
      const slide = json.slide
      if (!slide || typeof slide !== 'object') {
        throw new Error('Groq returned empty slide')
      }

      return {
        slide: { ...slide, type: slideType },
        sticker_intents: Array.isArray(json.sticker_intents) ? json.sticker_intents : [],
        model,
        latencyMs: Date.now() - startedAt,
      }
    } catch (err: unknown) {
      lastError = err
    }
  }

  throw createError({
    statusCode: 502,
    statusMessage: groqErrorHint(lastError),
  })
}
