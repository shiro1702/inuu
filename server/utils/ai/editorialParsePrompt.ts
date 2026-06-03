import type { EditorialParseInput } from '~/server/utils/ai/editorialParseSchema'
import { formatTagsForGroqPrompt } from '~/server/utils/contentTagCatalog'

function formatRuDate(d: Date, timeZone: string): { isoDate: string; weekday: string } {
  const isoDate = d.toLocaleDateString('en-CA', { timeZone })
  const weekday = d.toLocaleDateString('ru-RU', { timeZone, weekday: 'long' })
  return { isoDate, weekday }
}

export function buildEditorialParseSystemPrompt(input: EditorialParseInput): string {
  const tz = input.timezone || 'Asia/Irkutsk'
  const now = new Date()
  const pub = formatRuDate(now, tz)
  const hint = input.contentTypeHint
    ? `Ожидаемый тип контента: ${input.contentTypeHint}.`
    : 'Определи тип: venue_review (обзор места), venue_post (пост о месте), news (новость без привязки к месту), story (короткая story-кампания из слайдов).'

  return [
    'Ты — редактор городского гида INUU. Извлекаешь структурированные данные из поста редакции.',
    'НЕ извлекай даты и время мероприятий (starts_at, recurrence, афиша событий).',
    'Используй publication_date только если в тексте явно указана дата публикации материала.',
    `Текущая дата (current_date): ${pub.isoDate}, ${pub.weekday} (${tz}).`,
    `Дата публикации по умолчанию (publication_date): ${pub.isoDate}.`,
    hint,
    'Не выдумывай факты. Неизвестное → null или пустой массив.',
    'Для story: заполни story.title и story.slides (1–12), media_url оставь null если нет URL — подставит сервер.',
    'organization.name — название заведения/организатора из текста; organization.id не заполняй.',
    'venue — конкретное место на карте города, если это обзор заведения.',
    Array.isArray(input.hints?.availableTags) && input.hints.availableTags.length
      ? `topic_tags: выбери 1–5 slug ТОЛЬКО из справочника (по группам):\n${formatTagsForGroqPrompt(input.hints.availableTags)}\nНовые slug запрещены.`
      : '',
  ]
    .filter(Boolean)
    .join('\n')
}

export function buildEditorialParseUserPrompt(input: EditorialParseInput): string {
  const shape = {
    content_type: 'venue_review|venue_post|news|story',
    post_type: 'review|announcement|news',
    title: 'string',
    description_short: 'string',
    description_full: 'string',
    cover_media_url: 'string|null',
    video_url: 'string|null',
    media_urls: ['string'],
    city_slug: 'string|null',
    publication_date: 'YYYY-MM-DD|null',
    venue: { name: 'string|null', id: null },
    organization: { name: 'string|null', id: null },
    source: {
      kind: input.sourceKind,
      url: input.sourceUrl || null,
      external_id: input.sourceExternalId || null,
    },
    topic_tags: ['culture'],
    story: {
      title: 'string',
      slides: [{ media_url: 'string', duration_seconds: 5, action_type: 'none', action_payload: {} }],
    },
    confidence: 0.85,
    missing_fields: [],
  }

  return [
    'Верни один JSON-объект строго по форме:',
    JSON.stringify(shape),
    '',
    `city_slug: ${input.citySlug || 'null'}`,
    input.coverMediaUrl ? `cover_media_url уже задан: ${input.coverMediaUrl}` : '',
    input.videoUrl ? `video_url уже задан: ${input.videoUrl}` : '',
    '',
    'Текст:',
    input.rawText,
  ]
    .filter(Boolean)
    .join('\n')
}
