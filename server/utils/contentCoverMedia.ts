import type { H3Event } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import { normalizeRemoteMediaUrl } from '~/server/utils/remoteMediaUrl'
import { compressImageToWebp } from '~/server/utils/coverWebpCompress'

export { normalizeRemoteMediaUrl } from '~/server/utils/remoteMediaUrl'

const USER_AGENT = 'INUU-ContentBot/1.0 (+https://inuu.ru)'
const FETCH_TIMEOUT_MS = 12_000
const MAX_BYTES = 5 * 1024 * 1024

export type ResolvedCoverMedia = {
  url: string
  stored: boolean
  mime?: string
}

/**
 * Tries to mirror remote poster into Supabase storage as WebP; on failure returns a direct HTTPS URL.
 */
export async function resolveIngestCoverMediaUrl(
  event: H3Event,
  args: {
    sourceUrl: string
    cityId: string
    key: string
  },
): Promise<ResolvedCoverMedia | null> {
  const normalized = normalizeRemoteMediaUrl(args.sourceUrl)
  if (!normalized) return null

  try {
    const res = await fetch(normalized, {
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
        Referer: 'https://t.me/',
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    })

    if (!res.ok) {
      return { url: normalized, stored: false }
    }

    const contentType = String(res.headers.get('content-type') || '').toLowerCase()
    if (!contentType.startsWith('image/')) {
      return { url: normalized, stored: false }
    }

    const rawBytes = Buffer.from(await res.arrayBuffer())
    if (!rawBytes.byteLength || rawBytes.byteLength > MAX_BYTES) {
      return { url: normalized, stored: false }
    }

    const webpBytes = await compressImageToWebp(rawBytes)
    const uploadBytes = webpBytes && webpBytes.byteLength ? webpBytes : rawBytes
    const uploadMime = webpBytes && webpBytes.byteLength ? 'image/webp' : contentType.split(';')[0] || 'image/jpeg'
    const ext = uploadMime.includes('webp') ? 'webp' : 'jpg'

    const safeKey = args.key.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 64)
    const objectPath = `inuu-content/${args.cityId}/${Date.now()}-${safeKey}.${ext}`

    const client = await serverSupabaseServiceRole(event)
    const upload = await client.storage.from('organization-media').upload(objectPath, uploadBytes, {
      contentType: uploadMime,
      upsert: true,
    })

    if (upload.error) {
      console.warn('[contentCoverMedia] storage upload failed:', upload.error.message)
      return { url: normalized, stored: false }
    }

    const publicUrl = client.storage.from('organization-media').getPublicUrl(objectPath).data.publicUrl
    if (!publicUrl) {
      return { url: normalized, stored: false }
    }

    return { url: publicUrl, stored: true, mime: uploadMime }
  } catch (err) {
    console.warn('[contentCoverMedia] fetch/upload failed:', err)
    return { url: normalized, stored: false }
  }
}
