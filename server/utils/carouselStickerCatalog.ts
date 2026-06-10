import { readFileSync } from 'node:fs'
import { join } from 'node:path'

export type CatalogStickerRow = {
  slug: string
  category: string
  name: string
  description?: string
  tags: string[]
  sort_order: number
  pack?: string
  lucide?: string
  fluent_folder?: string
}

export type StickerListItem = {
  id: string
  category: string
  name: string
  description: string | null
  tags: string[]
  image_url: string
  sort_order: number
  pack: string
  is_vector: boolean
  accent_recolorable: boolean
}

let cachedLucideCatalog: CatalogStickerRow[] | null = null
let cachedEmojiCatalog: CatalogStickerRow[] | null = null

function readCatalog(fileName: string): CatalogStickerRow[] {
  try {
    const filePath = join(process.cwd(), 'scripts', fileName)
    const raw = JSON.parse(readFileSync(filePath, 'utf8')) as CatalogStickerRow[]
    return Array.isArray(raw) ? raw : []
  } catch {
    return []
  }
}

export function loadLucideStickerCatalog(): CatalogStickerRow[] {
  if (!cachedLucideCatalog) {
    cachedLucideCatalog = readCatalog('carousel-sticker-catalog.json')
  }
  return cachedLucideCatalog
}

export function loadEmojiStickerCatalog(): CatalogStickerRow[] {
  if (!cachedEmojiCatalog) {
    cachedEmojiCatalog = readCatalog('carousel-emoji-catalog.json')
  }
  return cachedEmojiCatalog
}

/** @deprecated use loadLucideStickerCatalog */
export function loadStickerCatalog(): CatalogStickerRow[] {
  return loadLucideStickerCatalog()
}

export function loadAllStickerCatalogs(): CatalogStickerRow[] {
  return [...loadLucideStickerCatalog(), ...loadEmojiStickerCatalog()]
}

function rowToStickerItem(row: CatalogStickerRow): StickerListItem {
  const pack = row.pack || (row.fluent_folder ? 'emoji' : 'minimal')
  const isEmoji = pack === 'emoji'
  return {
    id: `catalog-${row.slug}`,
    category: row.category,
    name: row.name,
    description: row.description || null,
    tags: row.tags || [],
    image_url: isEmoji
      ? `/carousel-stickers/emoji/${row.slug}.png`
      : `/carousel-stickers/${row.slug}.svg`,
    sort_order: row.sort_order,
    pack,
    is_vector: !isEmoji,
    accent_recolorable: !isEmoji,
  }
}

export function catalogToStickerItems(catalog: CatalogStickerRow[]): StickerListItem[] {
  return catalog.map(rowToStickerItem)
}

type DbSticker = {
  id: string
  category: string
  name: string
  description?: string | null
  tags?: string[] | null
  image_url: string
  sort_order?: number | null
  is_vector?: boolean
  isVector?: boolean
  accent_recolorable?: boolean
}

function inferPackFromDb(row: DbSticker): string {
  if (row.image_url.includes('/carousel-stickers/emoji/')) return 'emoji'
  if (row.is_vector === false || row.isVector === false) return 'emoji'
  return 'minimal'
}

/** БД + недостающие из файловых каталогов (полная библиотека). */
export function mergeStickerLibrary(dbRows: DbSticker[]): StickerListItem[] {
  const byUrl = new Map<string, StickerListItem>()

  for (const row of dbRows) {
    const item: StickerListItem = {
      id: row.id,
      category: row.category,
      name: row.name,
      description: row.description ?? null,
      tags: row.tags || [],
      image_url: row.image_url,
      sort_order: row.sort_order ?? 0,
      pack: inferPackFromDb(row),
      is_vector: row.is_vector ?? row.isVector ?? !row.image_url.includes('/emoji/'),
      accent_recolorable: row.accent_recolorable ?? !row.image_url.includes('/emoji/'),
    }
    byUrl.set(item.image_url, item)
  }

  for (const catalogItem of catalogToStickerItems(loadAllStickerCatalogs())) {
    if (byUrl.has(catalogItem.image_url)) continue
    byUrl.set(catalogItem.image_url, catalogItem)
  }

  return [...byUrl.values()].sort(
    (a, b) =>
      a.pack.localeCompare(b.pack)
      || a.sort_order - b.sort_order
      || a.name.localeCompare(b.name),
  )
}
