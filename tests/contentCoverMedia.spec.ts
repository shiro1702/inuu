import { describe, expect, it } from 'vitest'
import { normalizeRemoteMediaUrl } from '../server/utils/remoteMediaUrl'

describe('contentCoverMedia', () => {
  it('normalizes protocol-relative URLs', () => {
    expect(normalizeRemoteMediaUrl('//cdn4.telesco.pe/file/x.jpg')).toBe(
      'https://cdn4.telesco.pe/file/x.jpg',
    )
  })

  it('rejects non-http URLs', () => {
    expect(normalizeRemoteMediaUrl('javascript:alert(1)')).toBeNull()
  })
})
