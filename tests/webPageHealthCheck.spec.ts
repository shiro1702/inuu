import { describe, expect, it } from 'vitest'
import { detectCancelledOnSourcePage } from '../server/utils/webPageFetch'

describe('webPageHealthCheck', () => {
  it('detects cancellation keywords on page', () => {
    expect(detectCancelledOnSourcePage('<p>Концерт отменён организатором</p>')).toBe(true)
    expect(detectCancelledOnSourcePage('<p>Билеты в продаже</p>')).toBe(false)
  })
})
