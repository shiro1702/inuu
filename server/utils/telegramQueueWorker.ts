import type { H3Event } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import { telegramSendMediaGroup } from '~/server/utils/telegramSend'

const RATE_LIMIT_MS = 45

type QueueRow = {
  id: string
  bot_kind: string
  chat_id: string
  payload: {
    media_urls?: string[]
    caption?: string
    bot_token?: string
  }
  attempts: number
}

function resolveBotToken(kind: string): string {
  const config = useRuntimeConfig()
  if (kind === 'moderation') {
    return String(config.botToken || '').trim()
  }
  return String(config.botToken || '').trim()
}

export async function dispatchTelegramQueue(event: H3Event, limit = 5): Promise<{ processed: number; errors: string[] }> {
  const client = await serverSupabaseServiceRole(event)
  const { data, error } = await client
    .from('telegram_queue')
    .select('id, bot_kind, chat_id, payload, attempts')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })
    .limit(limit)

  if (error) throw new Error(error.message)

  const rows = (data || []) as QueueRow[]
  const errors: string[] = []
  let processed = 0

  for (const row of rows) {
    const token = row.payload?.bot_token || resolveBotToken(row.bot_kind)
    const urls = row.payload?.media_urls || []
    try {
      if (!urls.length) throw new Error('No media_urls in payload')
      await telegramSendMediaGroup(
        token,
        row.chat_id,
        urls.map((url, i) => ({
          type: 'photo' as const,
          media: url,
          caption: i === 0 ? row.payload?.caption : undefined,
        })),
      )
      await client
        .from('telegram_queue')
        .update({
          status: 'sent',
          sent_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          attempts: row.attempts + 1,
        })
        .eq('id', row.id)
      processed++
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'send failed'
      errors.push(`${row.id}: ${message}`)
      await client
        .from('telegram_queue')
        .update({
          status: row.attempts >= 2 ? 'failed' : 'pending',
          last_error: message,
          updated_at: new Date().toISOString(),
          attempts: row.attempts + 1,
        })
        .eq('id', row.id)
    }
    await new Promise((r) => setTimeout(r, RATE_LIMIT_MS))
  }

  return { processed, errors }
}
