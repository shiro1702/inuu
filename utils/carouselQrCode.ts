const qrDataUrlCache = new Map<string, string>()

export function resolveCarouselQrTargetUrl(
  linkHint: string | null | undefined,
  origin?: string,
): string | null {
  const hint = String(linkHint || '').trim()
  if (!hint) return null
  if (/^https?:\/\//i.test(hint)) return hint

  const base =
    origin ||
    (typeof window !== 'undefined' ? window.location.origin : '') ||
    ''
  if (!base) return hint.startsWith('/') ? hint : `/${hint}`

  const normalizedBase = base.replace(/\/$/, '')
  const path = hint.startsWith('/') ? hint : `/${hint}`
  return `${normalizedBase}${path}`
}

export function carouselQrLinkLabel(linkHint: string | null | undefined): string {
  const target = resolveCarouselQrTargetUrl(linkHint)
  if (!target) return ''
  return target.replace(/^https?:\/\//, '')
}

export async function generateCarouselQrDataUrl(
  linkHint: string | null | undefined,
  options?: { size?: number; margin?: number; origin?: string },
): Promise<string | null> {
  const target = resolveCarouselQrTargetUrl(linkHint, options?.origin)
  if (!target) return null

  const cached = qrDataUrlCache.get(target)
  if (cached) return cached

  const QRCode = (await import('qrcode')).default
  const dataUrl = await QRCode.toDataURL(target, {
    width: options?.size ?? 840,
    margin: options?.margin ?? 2,
    errorCorrectionLevel: 'M',
  })
  qrDataUrlCache.set(target, dataUrl)
  return dataUrl
}

export function clearCarouselQrCache() {
  qrDataUrlCache.clear()
}
