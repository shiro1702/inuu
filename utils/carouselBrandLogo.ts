export function resolveCarouselBrandLogo(config?: { public?: Record<string, unknown> }): string {
  const pub = config?.public || {}
  const candidates = [pub.brandLogoUrl, pub.logoUrl, pub.logo]
  for (const raw of candidates) {
    if (typeof raw === 'string' && raw.trim()) return raw.trim()
  }
  return '/logo.webp'
}
