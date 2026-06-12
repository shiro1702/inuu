import { describe, expect, it } from 'vitest'
import {
  assignEventDigestLayoutVariants,
  EVENT_DIGEST_BODY_LAYOUTS,
  EVENT_DIGEST_COVER_LAYOUTS,
  EVENT_DIGEST_OUTRO_LAYOUTS,
  resolveEventDigestLayoutVariant,
} from '~/utils/eventDigestLayouts'
import type { CarouselSlide } from '~/types/editorialCarousel'

describe('eventDigestLayouts', () => {
  it('assigns rotating cover, body and outro variants', () => {
    const slides: CarouselSlide[] = [
      { role: 'cover', title: 'Дайджест' },
      { role: 'body', title: 'Концерт' },
      { role: 'body', title: 'Выставка' },
      { role: 'outro', cta_text: 'INUU' },
    ]

    const assigned = assignEventDigestLayoutVariants(slides)

    expect(assigned[0]?.layout_variant).toBe('digest-cover-branded')
    expect(assigned[1]?.layout_variant).toBe('digest-body-split')
    expect(assigned[2]?.layout_variant).toBe('digest-body-fullbleed')
    expect(assigned[3]?.layout_variant).toBe('digest-outro-qr')
  })

  it('exposes five layouts per slide role', () => {
    expect(EVENT_DIGEST_COVER_LAYOUTS).toHaveLength(5)
    expect(EVENT_DIGEST_BODY_LAYOUTS).toHaveLength(5)
    expect(EVENT_DIGEST_OUTRO_LAYOUTS).toHaveLength(5)
  })

  it('resolves default when variant missing', () => {
    expect(resolveEventDigestLayoutVariant({ role: 'cover', title: 'x' })).toBe(
      'digest-cover-branded',
    )
  })
})
