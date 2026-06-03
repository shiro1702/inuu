import Groq from 'groq-sdk'
import { createError } from 'h3'

const TELEGRAM_API = (token: string) => `https://api.telegram.org/bot${token}`

async function telegramGetFilePath(botToken: string, fileId: string): Promise<string> {
  const res = await fetch(`${TELEGRAM_API(botToken)}/getFile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ file_id: fileId }),
  })
  if (!res.ok) {
    throw new Error(`Telegram getFile: ${res.status} ${await res.text()}`)
  }
  const data = (await res.json()) as { ok?: boolean; result?: { file_path?: string } }
  const path = data?.result?.file_path
  if (!path) throw new Error('Telegram getFile: missing file_path')
  return path
}

export async function transcribeTelegramVoice(args: {
  botToken: string
  fileId: string
}): Promise<{ text: string; model: string }> {
  const config = useRuntimeConfig()
  const apiKey = String(config.groqApiKey || '').trim()
  const model = String(config.groqWhisperModel || '').trim() || 'whisper-large-v3'

  if (!apiKey) {
    throw createError({ statusCode: 500, statusMessage: 'NUXT_GROQ_API_KEY is not configured' })
  }

  const filePath = await telegramGetFilePath(args.botToken, args.fileId)
  const fileRes = await fetch(`https://api.telegram.org/file/bot${args.botToken}/${filePath}`)
  if (!fileRes.ok) {
    throw new Error(`Telegram file download: ${fileRes.status}`)
  }

  const bytes = Buffer.from(await fileRes.arrayBuffer())
  if (!bytes.byteLength) throw new Error('Empty voice file')

  const ext = filePath.endsWith('.oga') || filePath.endsWith('.ogg') ? 'ogg' : 'ogg'
  const client = new Groq({ apiKey })
  const file = new File([bytes], `voice.${ext}`, { type: 'audio/ogg' })

  const transcription = await client.audio.transcriptions.create({
    file,
    model,
    language: 'ru',
    response_format: 'json',
  })

  const text = String((transcription as { text?: string }).text || '').trim()
  if (text.length < 3) {
    throw new Error('Voice transcription too short')
  }

  return { text, model }
}
