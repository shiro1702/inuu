import type { H3Event } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import { resolveIngestCoverMediaUrl } from '~/server/utils/contentCoverMedia'
import { fetchTelegramPostCoverUrl } from '~/server/utils/telegramPostCover'

const TELEGRAM_API = (token: string) => `https://api.telegram.org/bot${token}`

export type TelegramPhotoSize = {
  file_id?: string
  file_unique_id?: string
  width?: number
  height?: number
}

export type TelegramMessageWithMedia = {
  photo?: TelegramPhotoSize[]
  video?: { file_id?: string; mime_type?: string; duration?: number }
  document?: {
    file_id?: string
    mime_type?: string
    file_name?: string
  }
}

export function pickLargestTelegramPhotoFileId(photos?: TelegramPhotoSize[]): string | null {
  if (!Array.isArray(photos) || !photos.length) return null
  const sorted = [...photos].sort((a, b) => (b.width || 0) - (a.width || 0))
  const fileId = sorted[0]?.file_id
  return typeof fileId === 'string' && fileId.trim() ? fileId.trim() : null
}

async function telegramGetFilePath(botToken: string, fileId: string): Promise<string> {
  const res = await fetch(`${TELEGRAM_API(botToken)}/getFile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ file_id: fileId }),
  })
  if (!res.ok) {
    throw new Error(`Telegram getFile: ${res.status} ${await res.text()}`)
  }
  const data = await res.json() as { ok?: boolean; result?: { file_path?: string } }
  const path = data?.result?.file_path
  if (!path) throw new Error('Telegram getFile: missing file_path')
  return path
}

function guessExtension(filePath: string, fallback = 'jpg'): string {
  const ext = filePath.split('.').pop()?.toLowerCase()
  if (ext === 'jpg' || ext === 'jpeg' || ext === 'png' || ext === 'webp') return ext === 'jpeg' ? 'jpg' : ext
  if (ext === 'mp4' || ext === 'mov' || ext === 'webm') return ext
  return fallback
}

function contentTypeForExt(ext: string): string {
  if (ext === 'png') return 'image/png'
  if (ext === 'webp') return 'image/webp'
  if (ext === 'mp4') return 'video/mp4'
  if (ext === 'webm') return 'video/webm'
  if (ext === 'mov') return 'video/quicktime'
  return 'image/jpeg'
}

export async function uploadTelegramPhotoToContentStorage(
  event: H3Event,
  args: { botToken: string; fileId: string; cityId: string; key: string },
): Promise<string | null> {
  try {
    const filePath = await telegramGetFilePath(args.botToken, args.fileId)
    const fileRes = await fetch(`https://api.telegram.org/file/bot${args.botToken}/${filePath}`)
    if (!fileRes.ok) {
      throw new Error(`Telegram file download: ${fileRes.status}`)
    }
    const bytes = Buffer.from(await fileRes.arrayBuffer())
    if (!bytes.byteLength || bytes.byteLength > 5 * 1024 * 1024) {
      throw new Error('Telegram photo too large')
    }

    const ext = guessExtension(filePath)
    const safeKey = args.key.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 64)
    const objectPath = `inuu-content/${args.cityId}/${Date.now()}-${safeKey}.${ext}`

    const client = await serverSupabaseServiceRole(event)
    const contentType = contentTypeForExt(ext)
    const upload = await client.storage.from('organization-media').upload(objectPath, bytes, {
      contentType,
      upsert: true,
    })
    if (upload.error) {
      throw new Error(upload.error.message || 'Storage upload failed')
    }

    return client.storage.from('organization-media').getPublicUrl(objectPath).data.publicUrl || null
  } catch (err) {
    console.error('[telegramContentMedia] upload failed:', err)
    return null
  }
}

const MAX_VIDEO_BYTES = 48 * 1024 * 1024

export async function uploadTelegramFileToContentStorage(
  event: H3Event,
  args: { botToken: string; fileId: string; cityId: string; key: string; maxBytes?: number },
): Promise<string | null> {
  try {
    const filePath = await telegramGetFilePath(args.botToken, args.fileId)
    const fileRes = await fetch(`https://api.telegram.org/file/bot${args.botToken}/${filePath}`)
    if (!fileRes.ok) throw new Error(`Telegram file download: ${fileRes.status}`)
    const bytes = Buffer.from(await fileRes.arrayBuffer())
    const limit = args.maxBytes ?? 5 * 1024 * 1024
    if (!bytes.byteLength || bytes.byteLength > limit) {
      throw new Error('Telegram file too large')
    }

    const ext = guessExtension(filePath, 'mp4')
    const safeKey = args.key.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 64)
    const objectPath = `inuu-content/${args.cityId}/${Date.now()}-${safeKey}.${ext}`

    const client = await serverSupabaseServiceRole(event)
    const upload = await client.storage.from('organization-media').upload(objectPath, bytes, {
      contentType: contentTypeForExt(ext),
      upsert: true,
    })
    if (upload.error) throw new Error(upload.error.message || 'Storage upload failed')

    return client.storage.from('organization-media').getPublicUrl(objectPath).data.publicUrl || null
  } catch (err) {
    console.error('[telegramContentMedia] file upload failed:', err)
    return null
  }
}

function pickTelegramVideoFileId(message: TelegramMessageWithMedia): string | null {
  const video = message.video?.file_id
  if (video && String(video).trim()) return String(video).trim()
  const doc = message.document
  if (!doc?.file_id) return null
  const mime = String(doc.mime_type || '').toLowerCase()
  if (!mime.startsWith('video/')) return null
  return String(doc.file_id).trim()
}

export async function ingestTelegramMessageVideo(
  event: H3Event,
  args: {
    botToken: string
    message: TelegramMessageWithMedia
    cityId: string
    sourceExternalId: string
  },
): Promise<string | null> {
  const fileId = pickTelegramVideoFileId(args.message)
  if (!fileId) return null
  return uploadTelegramFileToContentStorage(event, {
    botToken: args.botToken,
    fileId,
    cityId: args.cityId,
    key: `${args.sourceExternalId}-video`,
    maxBytes: MAX_VIDEO_BYTES,
  })
}

function pickTelegramDocumentImageFileId(message: TelegramMessageWithMedia): string | null {
  const doc = message.document
  if (!doc?.file_id) return null
  const mime = String(doc.mime_type || '').toLowerCase()
  if (!mime.startsWith('image/')) return null
  return String(doc.file_id).trim()
}

export async function ingestTelegramMessageCover(
  event: H3Event,
  args: {
    botToken: string
    message: TelegramMessageWithMedia
    cityId: string
    sourceExternalId: string
  },
): Promise<string | null> {
  const fileId =
    pickLargestTelegramPhotoFileId(args.message.photo)
    || pickTelegramDocumentImageFileId(args.message)
  if (!fileId) return null
  return uploadTelegramPhotoToContentStorage(event, {
    botToken: args.botToken,
    fileId,
    cityId: args.cityId,
    key: args.sourceExternalId,
  })
}

/** Photo from message → storage; else og:image / preview poster from t.me link. */
export async function resolveTelegramIngestCover(
  event: H3Event,
  args: {
    botToken: string
    message: TelegramMessageWithMedia
    cityId: string
    sourceExternalId: string
    sourceUrl?: string | null
  },
): Promise<string | null> {
  const fromBot = await ingestTelegramMessageCover(event, {
    botToken: args.botToken,
    message: args.message,
    cityId: args.cityId,
    sourceExternalId: args.sourceExternalId,
  })
  if (fromBot) return fromBot

  const remotePoster = await fetchTelegramPostCoverUrl(args.sourceUrl)
  if (!remotePoster) return null

  const resolved = await resolveIngestCoverMediaUrl(event, {
    sourceUrl: remotePoster,
    cityId: args.cityId,
    key: args.sourceExternalId,
  })
  return resolved?.url ?? remotePoster
}
