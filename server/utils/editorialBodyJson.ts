import { z } from 'zod'

export const editorialParagraphBlockSchema = z.object({
  type: z.literal('paragraph'),
  text: z.string().trim().min(1).max(20_000),
})

export const editorialImageBlockSchema = z.object({
  type: z.literal('image'),
  url: z.string().trim().url().max(2000),
  caption: z.string().trim().max(500).nullable().optional(),
})

export const editorialPlaceEmbedBlockSchema = z.object({
  type: z.literal('place_embed'),
  venue_id: z.string().uuid(),
})

export const editorialBodyBlockSchema = z.discriminatedUnion('type', [
  editorialParagraphBlockSchema,
  editorialImageBlockSchema,
  editorialPlaceEmbedBlockSchema,
])

export type EditorialBodyBlock = z.infer<typeof editorialBodyBlockSchema>

export function normalizeBodyJson(raw: unknown): EditorialBodyBlock[] | null {
  if (!Array.isArray(raw)) return null
  const blocks: EditorialBodyBlock[] = []
  for (const item of raw) {
    const parsed = editorialBodyBlockSchema.safeParse(item)
    if (parsed.success) blocks.push(parsed.data)
  }
  return blocks.length ? blocks : null
}

export function bodyJsonFromPlainText(
  text: string,
  options?: { venueId?: string | null; coverUrl?: string | null; mediaUrls?: string[] },
): EditorialBodyBlock[] {
  const blocks: EditorialBodyBlock[] = []
  const trimmed = String(text || '').trim()
  if (!trimmed) return blocks

  const paragraphs = trimmed.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)
  const segmentRe = /(\[place:[0-9a-f-]{36}\])/gi
  for (const paragraph of paragraphs) {
    const segments = paragraph.split(segmentRe).filter((s) => s.length > 0)
    for (const segment of segments) {
      const placeMatch = segment.match(/^\[place:([0-9a-f-]{36})\]$/i)
      if (placeMatch) {
        blocks.push({ type: 'place_embed', venue_id: placeMatch[1] })
      } else if (segment.trim()) {
        blocks.push({ type: 'paragraph', text: segment.trim() })
      }
    }
  }

  if (options?.venueId && !blocks.some((b) => b.type === 'place_embed' && b.venue_id === options.venueId)) {
    blocks.push({ type: 'place_embed', venue_id: options.venueId })
  }

  const media = [
    ...(options?.coverUrl ? [options.coverUrl] : []),
    ...(options?.mediaUrls || []),
  ].filter((url, i, arr) => arr.indexOf(url) === i)

  for (const url of media) {
    if (!blocks.some((b) => b.type === 'image' && b.url === url)) {
      blocks.push({ type: 'image', url, caption: null })
    }
  }

  return blocks
}

export function bodyJsonToPlainText(blocks: EditorialBodyBlock[] | null | undefined): string {
  if (!blocks?.length) return ''
  return blocks
    .map((block) => {
      if (block.type === 'paragraph') return block.text
      if (block.type === 'image') return block.caption ? `[image: ${block.caption}]` : ''
      return ''
    })
    .filter(Boolean)
    .join('\n\n')
}

export function buildEditorialBodyJson(args: {
  descriptionFull: string
  venueId?: string | null
  coverUrl?: string | null
  mediaUrls?: string[]
  existingBodyJson?: unknown
}): EditorialBodyBlock[] {
  const fromExisting = normalizeBodyJson(args.existingBodyJson)
  if (fromExisting?.length) return fromExisting
  return bodyJsonFromPlainText(args.descriptionFull, {
    venueId: args.venueId,
    coverUrl: args.coverUrl,
    mediaUrls: args.mediaUrls,
  })
}
