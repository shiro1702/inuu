import Groq from 'groq-sdk'
import { createError } from 'h3'
import type { EditorialParseResult } from '~/server/utils/ai/editorialParseSchema'

export type EditorialContentPack = {
  curated_lists: string
  reels_script: string
  instagram_carousel: string
  telegram_post: string
  quiz: string
  push_headline: string
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

export function formatEditorialContentPackMessage(
  pack: EditorialContentPack,
  guideUrl?: string | null,
): string {
  const linkLine = guideUrl ? `\n\n🔗 ${guideUrl}` : ''
  return [
    '📦 Пак контента (6 форматов)',
    '',
    '1️⃣ Авто-подборки',
    pack.curated_lists,
    '',
    '2️⃣ Reels / Shorts',
    pack.reels_script,
    '',
    '3️⃣ Instagram-карусель',
    pack.instagram_carousel,
    '',
    '4️⃣ Telegram-пост',
    pack.telegram_post,
    '',
    '5️⃣ Квиз',
    pack.quiz,
    '',
    '6️⃣ Push / кликбейт',
    pack.push_headline,
    linkLine,
  ].join('\n')
}

export async function generateEditorialContentPack(args: {
  payload: EditorialParseResult
  cityName: string
  citySlug: string
  suggestedListSlugs?: string[]
  guideUrl?: string | null
}): Promise<{ pack: EditorialContentPack; model: string; latencyMs: number }> {
  const config = useRuntimeConfig()
  const apiKey = String(config.groqApiKey || '').trim()
  const model = String(config.groqModel || '').trim() || 'llama-3.3-70b-versatile'

  if (!apiKey) {
    throw createError({ statusCode: 500, statusMessage: 'NUXT_GROQ_API_KEY is not configured' })
  }

  const startedAt = Date.now()
  const client = new Groq({ apiKey })
  const listsHint = args.suggestedListSlugs?.length
    ? `Существующие подборки города (slug): ${args.suggestedListSlugs.join(', ')}`
    : 'Подборок не предложено — предложи 1–2 новых slug.'

  const shape = {
    curated_lists: 'string — какие curated_list slug подходят + идея mini-list',
    reels_script: 'string — таймкоды 15–30 сек',
    instagram_carousel: 'string — 4–6 слайдов текстом',
    telegram_post: 'string — markdown + [Карта] [Читать]',
    quiz: 'string — вопрос + 3 варианта',
    push_headline: 'string — до 40 символов',
  }

  const completion = await client.chat.completions.create({
    model,
    temperature: 0.4,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: [
          'Ты — SMM-редактор городского гида INUU.',
          'Сгенерируй 6 текстовых форматов из одной статьи. Без выдуманных фактов.',
          listsHint,
          args.guideUrl ? `Ссылка на статью: ${args.guideUrl}` : '',
        ].filter(Boolean).join('\n'),
      },
      {
        role: 'user',
        content: [
          'JSON по форме:',
          JSON.stringify(shape),
          '',
          `Город: ${args.cityName} (${args.citySlug})`,
          `Заголовок: ${args.payload.title}`,
          `Коротко: ${args.payload.description_short}`,
          `Полный текст:\n${args.payload.description_full}`,
          `Теги: ${(args.payload.topic_tags || []).join(', ')}`,
        ].join('\n'),
      },
    ],
  })

  const raw = completion.choices[0]?.message?.content || ''
  const json = extractJson(raw) as EditorialContentPack
  const pack: EditorialContentPack = {
    curated_lists: String(json.curated_lists || '').trim(),
    reels_script: String(json.reels_script || '').trim(),
    instagram_carousel: String(json.instagram_carousel || '').trim(),
    telegram_post: String(json.telegram_post || '').trim(),
    quiz: String(json.quiz || '').trim(),
    push_headline: String(json.push_headline || '').trim().slice(0, 40),
  }

  return { pack, model, latencyMs: Date.now() - startedAt }
}
