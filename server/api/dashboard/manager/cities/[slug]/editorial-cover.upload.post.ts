import { createError, defineEventHandler, readBody } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import { compressImageToWebp } from '~/server/utils/coverWebpCompress'
import { resolveManagerCityScopeOrThrow } from '~/server/utils/managerCityAccess'

const ALLOWED_MIME = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/gif'])
const MAX_SIZE_BYTES = 8 * 1024 * 1024

type Body = {
  fileName?: string
  mimeType?: string
  dataBase64?: string
}

function sanitizeFileName(input: string): string {
  const cleaned = input.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-80) || 'cover'
  return cleaned.replace(/\.[a-zA-Z0-9]+$/, '')
}

function fallbackExtension(mimeType: string): string {
  if (mimeType === 'image/png') return 'png'
  if (mimeType === 'image/gif') return 'gif'
  return 'jpg'
}

export default defineEventHandler(async (event) => {
  const slugParam = typeof event.context.params?.slug === 'string' ? event.context.params.slug : ''
  const scope = await resolveManagerCityScopeOrThrow(event, slugParam)
  const body = await readBody<Body>(event)

  if (!body?.mimeType || !body.dataBase64 || !body.fileName) {
    throw createError({
      statusCode: 400,
      statusMessage: 'fileName, mimeType and dataBase64 are required',
    })
  }
  if (!ALLOWED_MIME.has(body.mimeType)) {
    throw createError({ statusCode: 400, statusMessage: 'Unsupported media type (images only)' })
  }

  const bytes = Buffer.from(body.dataBase64, 'base64')
  if (!bytes.byteLength || bytes.byteLength > MAX_SIZE_BYTES) {
    throw createError({ statusCode: 400, statusMessage: 'File too large (max 8MB)' })
  }

  const webpBytes = await compressImageToWebp(bytes)
  const uploadBytes = webpBytes && webpBytes.byteLength ? webpBytes : bytes
  const uploadMime = webpBytes && webpBytes.byteLength ? 'image/webp' : body.mimeType
  const ext = webpBytes && webpBytes.byteLength ? 'webp' : fallbackExtension(body.mimeType)
  const safeName = sanitizeFileName(body.fileName)
  const objectPath = `inuu-content/${scope.cityId}/editorial/${Date.now()}-${safeName}.${ext}`

  const client = await serverSupabaseServiceRole(event)
  const upload = await client.storage.from('organization-media').upload(objectPath, uploadBytes, {
    contentType: uploadMime,
    upsert: true,
  })

  if (upload.error) {
    throw createError({ statusCode: 500, statusMessage: upload.error.message || 'Upload failed' })
  }

  const publicUrl = client.storage.from('organization-media').getPublicUrl(objectPath).data.publicUrl

  return {
    ok: true as const,
    url: publicUrl,
    path: objectPath,
  }
})
