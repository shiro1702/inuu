type TagGroupWithItems = {
  id: string
  label: string
  items: Array<{ slug: string }>
}

/** Где искать теги: события, новости, места или объединение. */
export const CONTENT_TAG_USAGE_SCOPES = ['events', 'editorial', 'venues', 'all'] as const
export type ContentTagUsageScope = (typeof CONTENT_TAG_USAGE_SCOPES)[number]

export function parseContentTagUsageScope(raw: unknown): ContentTagUsageScope | null {
  const value = typeof raw === 'string' ? raw.trim().toLowerCase() : ''
  return (CONTENT_TAG_USAGE_SCOPES as readonly string[]).includes(value)
    ? (value as ContentTagUsageScope)
    : null
}

export function filterTaxonomyByUsedSlugs<T extends { slug: string }>(
  items: T[],
  usedSlugs: Set<string>,
): T[] {
  if (!usedSlugs.size) return []
  return items.filter((item) => usedSlugs.has(String(item.slug).trim().toLowerCase()))
}

export function filterTagGroupsByUsedSlugs<T extends TagGroupWithItems>(
  groups: T[],
  usedSlugs: Set<string>,
): T[] {
  if (!usedSlugs.size) return []
  return groups
    .map((group) => ({
      ...group,
      items: group.items.filter((tag) => usedSlugs.has(String(tag.slug).trim().toLowerCase())),
    }))
    .filter((group) => group.items.length > 0)
}
