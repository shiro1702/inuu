import type { EventParseInput } from '~/server/utils/ai/eventParseSchema'
import type { IngestContextType } from '~/server/utils/ingestSourceContext'

const CONTEXT_PROMPTS: Record<IngestContextType, string> = {
  theater:
    'Контекст: театр. Ищи состав, возрастное ограничение (12+), ряды. НЕ выдумывай line-up, dress code, столы.',
  club: 'Контекст: клуб. Ищи line-up, dress code, бронь столов, DJ.',
  standup: 'Контекст: стендап. Ищи комиков, open mic, формат вечера.',
  library: 'Контекст: библиотека. Ищи лекции, клубы по интересам, возраст участников.',
  museum: 'Контекст: музей. Ищи выставки, экскурсии, возрастные ограничения.',
  cinema: 'Контекст: кино. Ищи фильм, сеансы, формат (2D/3D/IMAX).',
  general: 'Контекст: общий городской источник. Извлекай только явные факты из текста.',
}

function resolveContextType(input: EventParseInput): IngestContextType {
  const raw = String(input.hints?.contextType || 'general').trim().toLowerCase()
  if (raw in CONTEXT_PROMPTS) return raw as IngestContextType
  return 'general'
}

export function buildEventParseSystemPrompt(input: EventParseInput): string {
  const tagList = input.hints?.availableTags?.map((t) => t.slug).join(', ') || ''
  const categoryList = input.hints?.availableCategories?.map((c) => c.slug).join(', ') || ''
  const preferDigest = input.hints?.preferDigest === true
  const contextType = resolveContextType(input)
  return [
    'Ты парсер событий и новостей для городского агрегатора.',
    'Твоя задача: извлечь данные из входного текста и вернуть ТОЛЬКО JSON.',
    'Запрещено выдумывать факты: если не найдено — ставь null или пустой массив.',
    CONTEXT_PROMPTS[contextType],
    tagList
      ? `topic_tags: выбери 1–5 slug ТОЛЬКО из справочника [${tagList}]. Новые slug запрещены — если нет точного совпадения, пропусти тег.`
      : 'topic_tags: до 5 slug латиницей, только реально подходящие теме.',
    categoryList
      ? `category_slug: один slug ТОЛЬКО из [${categoryList}] или null если ничего не подходит. Новые slug запрещены.`
      : 'category_slug: slug категории латиницей или null.',
    'dates должны быть строками в ISO-like формате, если дата неясна — не выдумывать.',
    'Если в тексте несколько дат ОДНОГО И ТОГО ЖЕ мероприятия — parse_kind=single, все даты в recurrence.dates одного события.',
    'Если в тексте СПИСОК РАЗНЫХ мероприятий (афиша недели, нумерованный список, несколько названий) — parse_kind=digest, каждый пункт отдельный объект в events[].',
    preferDigest
      ? 'HINT: вход похож на digest/афишу — предпочитай parse_kind=digest если есть 2+ разных события.'
      : '',
    'digest: title периода (например «Афиша недели»), period=week|month если явно указано, иначе null.',
    'confidence: число от 0 до 1 на каждое событие в events[].',
    'missing_fields: список недостающих полей для модератора на каждое событие.',
    'description_short: 1–2 предложения для карточки (до 280 символов).',
    'description_full: полный текст для страницы события.',
    'Максимум 20 событий в events[].',
  ].filter(Boolean).join('\n')
}
