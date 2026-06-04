import { describe, expect, it } from 'vitest'
import { COVER_WEBP_MAX_BYTES, compressImageToWebp } from '../server/utils/coverWebpCompress'

// Minimal valid 1x1 PNG
const TINY_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64',
)

describe('coverWebpCompress', () => {
  it('produces webp under max bytes for tiny png', async () => {
    const out = await compressImageToWebp(TINY_PNG)
    expect(out).not.toBeNull()
    expect(out!.byteLength).toBeLessThanOrEqual(COVER_WEBP_MAX_BYTES)
    expect(out!.subarray(0, 4).toString('hex')).toBe('52494646') // RIFF (webp container) or check webp magic
  })
})
