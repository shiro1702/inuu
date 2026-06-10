export async function telegramApiCall(
  botToken: string,
  method: string,
  body: Record<string, unknown>,
): Promise<unknown> {
  const token = botToken.trim()
  if (!token) throw new Error('Telegram bot token is missing')

  const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const json = await res.json().catch(() => ({}))
  if (!res.ok || (json as { ok?: boolean }).ok === false) {
    const desc = (json as { description?: string }).description || res.statusText
    throw new Error(`Telegram ${method} failed: ${desc}`)
  }
  return json
}

export type MediaGroupInput = {
  type: 'photo'
  media: string
  caption?: string
}

export async function telegramSendMediaGroup(
  botToken: string,
  chatId: string | number,
  media: MediaGroupInput[],
): Promise<unknown> {
  return telegramApiCall(botToken, 'sendMediaGroup', {
    chat_id: chatId,
    media: media.map((m, i) => ({
      type: m.type,
      media: m.media,
      ...(i === 0 && m.caption ? { caption: m.caption, parse_mode: 'Markdown' } : {}),
    })),
  })
}
