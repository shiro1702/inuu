import type { EditorialParseResult } from '~/server/utils/ai/editorialParseSchema'
import type { CarouselSlide } from '~/types/editorialCarousel'

export function buildStorySlidesFromEditorial(payload: EditorialParseResult): CarouselSlide[] {
  const fromParse = payload.story?.slides || []
  if (fromParse.length) {
    return fromParse.map((s, index) => {
      const text =
        typeof (s.action_payload as { text?: string })?.text === 'string'
          ? (s.action_payload as { text: string }).text
          : typeof (s.action_payload as { title?: string })?.title === 'string'
            ? (s.action_payload as { title: string }).title
            : ''
      return {
        role: index === 0 ? 'cover' : index === fromParse.length - 1 ? 'outro' : 'body',
        title: text || payload.title,
        bullets: text ? [text] : undefined,
        media_url: s.media_url || payload.cover_media_url || null,
        cta_text: index === fromParse.length - 1 ? 'Читать обзор' : undefined,
        gradient: payload.topic_tags?.[0] || 'party',
      } satisfies CarouselSlide
    })
  }

  const short = String(payload.description_short || '').trim()
  const title = String(payload.title || '').trim()

  return [
    {
      role: 'cover',
      title: title || 'Новый обзор',
      gradient: payload.topic_tags?.[0] || 'party',
      media_url: payload.cover_media_url || null,
    },
    {
      role: 'body',
      title: 'Главное',
      bullets: short ? [short.slice(0, 120)] : ['Смотрите подробности в материале'],
      gradient: payload.topic_tags?.[0] || 'party',
    },
    {
      role: 'outro',
      cta_text: 'Читать обзор в INUU',
      gradient: payload.topic_tags?.[0] || 'party',
    },
  ]
}
