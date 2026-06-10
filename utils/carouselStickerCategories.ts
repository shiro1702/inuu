/** Порядок и подписи категорий стикеров в UI. */
export const STICKER_CATEGORY_ORDER = ['thematic', 'ui', 'decor', 'navigation', 'emoji'] as const

export type StickerCategory = (typeof STICKER_CATEGORY_ORDER)[number]

const LABELS: Record<string, string> = {
  thematic: 'Тематические',
  ui: 'Бейджи и UI',
  decor: 'Декор',
  navigation: 'Навигация',
  emoji: 'Эмодзи',
}

export function stickerCategoryLabel(category: string): string {
  return LABELS[category] || category
}

export function sortStickerCategories(categories: string[]): string[] {
  const set = new Set(categories)
  const ordered = STICKER_CATEGORY_ORDER.filter((c) => set.has(c))
  for (const c of categories) {
    if (!ordered.includes(c)) ordered.push(c)
  }
  return ordered
}
