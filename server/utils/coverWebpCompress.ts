export const COVER_WEBP_MAX_BYTES = 300_000
export const COVER_WEBP_MAX_WIDTH = 1200

/**
 * Compress raster image bytes to WebP under COVER_WEBP_MAX_BYTES when possible.
 */
async function loadSharp() {
  const mod = await import('sharp')
  return mod.default
}

export async function compressImageToWebp(bytes: Buffer): Promise<Buffer | null> {
  try {
    const sharp = await loadSharp()
    let quality = 82
    let width = COVER_WEBP_MAX_WIDTH
    let best: Buffer | null = null

    for (let round = 0; round < 10; round++) {
      const out = await sharp(bytes)
        .rotate()
        .resize({ width, withoutEnlargement: true })
        .webp({ quality })
        .toBuffer()

      if (!best || out.byteLength < best.byteLength) {
        best = out
      }
      if (out.byteLength <= COVER_WEBP_MAX_BYTES) {
        return out
      }
      if (quality > 52) {
        quality -= 10
        continue
      }
      width = Math.max(480, Math.floor(width * 0.82))
      quality = 76
    }

    return best
  } catch (err) {
    console.warn('[coverWebpCompress] failed:', err)
    return null
  }
}
