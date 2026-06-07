import { describe, expect, it } from 'vitest'
import { carouselQrLinkLabel, resolveCarouselQrTargetUrl } from '~/utils/carouselQrCode'

describe('carouselQrCode', () => {
  it('resolves absolute URLs as-is', () => {
    expect(resolveCarouselQrTargetUrl('https://inuu.ru/ulan-ude/events')).toBe(
      'https://inuu.ru/ulan-ude/events',
    )
  })

  it('prefixes relative paths with origin', () => {
    expect(resolveCarouselQrTargetUrl('/ulan-ude/events', 'https://inuu.ru')).toBe(
      'https://inuu.ru/ulan-ude/events',
    )
  })

  it('strips protocol for display label', () => {
    expect(carouselQrLinkLabel('https://inuu.ru/ulan-ude/guides/test')).toBe(
      'inuu.ru/ulan-ude/guides/test',
    )
  })
})
