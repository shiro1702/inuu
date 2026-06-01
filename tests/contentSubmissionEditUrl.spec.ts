import { describe, expect, it } from 'vitest'
import { buildPublicEventPagePath } from '../server/utils/contentSubmissionEditUrl'

describe('contentSubmissionEditUrl', () => {
  it('builds city-scoped public event path', () => {
    expect(buildPublicEventPagePath('ulan-ude', 'goncharnyj-krug')).toBe('/ulan-ude/events/goncharnyj-krug')
  })

  it('returns null when slug parts are empty', () => {
    expect(buildPublicEventPagePath('', 'event')).toBeNull()
    expect(buildPublicEventPagePath('ulan-ude', '')).toBeNull()
  })
})
