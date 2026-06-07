import { describe, expect, it } from 'vitest'
import {
  CAROUSEL_STORIES_SAFE_BOTTOM_PX,
  carouselChromeFooterBottomStyle,
  carouselStoriesExtraBottomPaddingPx,
} from '~/utils/carouselSafeZone'

describe('carouselSafeZone', () => {
  it('adds bottom safe zone only for 9:16', () => {
    expect(carouselStoriesExtraBottomPaddingPx('4:5')).toBe(0)
    expect(carouselStoriesExtraBottomPaddingPx('9:16')).toBe(CAROUSEL_STORIES_SAFE_BOTTOM_PX)
  })

  it('lifts chrome footer above stories safe zone', () => {
    expect(carouselChromeFooterBottomStyle('4:5')).toBeUndefined()
    expect(carouselChromeFooterBottomStyle('9:16')).toEqual({
      bottom: `${CAROUSEL_STORIES_SAFE_BOTTOM_PX}px`,
    })
  })
})
