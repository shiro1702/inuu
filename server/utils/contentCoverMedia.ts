import type { H3Event } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import { normalizeRemoteMediaUrl } from '~/server/utils/remoteMediaUrl'

export { normalizeRemoteMediaUrl } from '~/server/utils/remoteMediaUrl'

const USER_AGENT = 'INUU-ContentBot/1.0 (+https://inuu.ru)'
const FETCH_TIMEOUT_MS = 12_000
const MAX_BYTES = 5 * 1024 * 1024

function guessImageExtension(contentType: string, sourceUrl: string): string {
  const type = contentType.toLowerCase()
  if (type.includes('png')) return 'png'
  if (type.includes('webp')) return 'webp'
  if (type.includes('gif')) return 'gif'
  const path = sourceUrl.split('?')[0] || ''
  const match = path.match(/\.(jpe?g|png|webp|gif)$/i)
  if (match?.[1]) return match[1].toLowerCase().replace('jpeg', 'jpg')
  return 'jpg'
}

export type ResolvedCoverMedia = {
  url: string
  stored: boolean
}

/**
 * Tries to mirror remote poster into Supabase storage; on failure returns a direct HTTPS URL.
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

    const bytes = Buffer.from(await res.arrayBuffer())
    if (!bytes.byteLength || bytes.byteLength > MAX_BYTES) {
      return { url: normalized, stored: false }
    }

    const ext = guessImageExtension(contentType, normalized)
    const safeKey = args.key.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 64)
    const objectPath = `inuu-content/${args.cityId}/${Date.now()}-${safeKey}.${ext}`

    const client = await serverSupabaseServiceRole(event)
    const upload = await client.storage.from('organization-media').upload(objectPath, bytes, {
      contentType: contentType.split(';')[0] || 'image/jpeg',
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

    return { url: publicUrl, stored: true }
  } catch (err) {
    console.warn('[contentCoverMedia] fetch/upload failed:', err)
    return { url: normalized, stored: false }
  }
}
