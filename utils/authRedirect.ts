export function defaultCityHomePath(defaultCitySlug: string): string {
  const slug = defaultCitySlug.trim() || 'ulan-ude'
  return `/${slug}`
}

export function sanitizeAuthRedirectPath(path: unknown, defaultCitySlug: string): string {
  const fallback = defaultCityHomePath(defaultCitySlug)
  if (typeof path !== 'string' || !path.startsWith('/') || path.startsWith('//')) {
    return fallback
  }
  if (path.includes('/cart') || path.includes('/checkout') || path.includes('/bonuses')) {
    return fallback
  }
  return path
}
