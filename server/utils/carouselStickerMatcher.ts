import type { H3Event } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import type { CarouselCanvasObject } from '~/types/editorialCarousel'

type StickerRow = {
  id: string
  name: string
  tags: string[]
  image_url: string
}

export type StickerIntent = {
  tag: string
  anchor?: 'flow' | 'canvas'
  anchor_target?: string
  position_hint?: string
}

function hintToCoords(hint?: string): { x: number; y: number } {
  const h = (hint || '').toLowerCase()
  if (h.includes('top-right')) return { x: 85, y: 5 }
  if (h.includes('top-left')) return { x: 5, y: 5 }
  if (h.includes('bottom')) return { x: 50, y: 85 }
  return { x: 75, y: -10 }
}

export async function matchStickerIntents(
  event: H3Event,
  intents: StickerIntent[],
): Promise<CarouselCanvasObject[]> {
  if (!intents.length) return []

  const client = await serverSupabaseServiceRole(event)
  const { data } = await client.from('stickers').select('id, name, tags, image_url').limit(250)
  const rows = (data || []) as StickerRow[]

  const objects: CarouselCanvasObject[] = []
  for (const [i, intent] of intents.entries()) {
    const tag = intent.tag.toLowerCase()
    let best: StickerRow | null = null
    let bestScore = 0
    for (const row of rows) {
      const tags = [row.name, ...(row.tags || [])].map((t) => t.toLowerCase())
      const matched = tags.some((t) => t.includes(tag) || tag.includes(t))
      if (!matched) continue
      const isEmoji = row.image_url.includes('/carousel-stickers/emoji/')
      const score = 2 + (isEmoji ? 1 : 0)
      if (score > bestScore) {
        bestScore = score
        best = row
      }
    }
    if (!best) continue
    const pos = hintToCoords(intent.position_hint)
    objects.push({
      id: `sticker_${i}_${best.name}`,
      kind: 'sticker',
      sticker_id: best.id,
      image_url: best.image_url,
      anchor: intent.anchor || 'flow',
      anchor_target: intent.anchor_target || 'title',
      x: pos.x,
      y: pos.y,
      scale: 1,
      zIndex: 15 + i,
    })
  }
  return objects
}
