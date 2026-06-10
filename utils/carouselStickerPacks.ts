/** Паки стикеров в редакторе карусели. */
export const STICKER_PACK_ORDER = ['minimal', 'emoji'] as const

export type StickerPack = (typeof STICKER_PACK_ORDER)[number]

const PACK_LABELS: Record<string, string> = {
  minimal: 'Минимал',
  emoji: 'Эмодзи 3D',
}

export function stickerPackLabel(pack: string): string {
  return PACK_LABELS[pack] || pack
}

export function sortStickerPacks(packs: string[]): string[] {
  const set = new Set(packs)
  const ordered = STICKER_PACK_ORDER.filter((p) => set.has(p))
  for (const p of packs) {
    if (!ordered.includes(p)) ordered.push(p)
  }
  return ordered
}

export function inferStickerPack(item: { pack?: string; image_url?: string; is_vector?: boolean }): string {
  if (item.pack) return item.pack
  if (item.image_url?.includes('/carousel-stickers/emoji/')) return 'emoji'
  if (item.is_vector === false) return 'emoji'
  return 'minimal'
}
