/** How a content_submission entered the pipeline (UI labels for managers). */

export const CONTENT_INTAKE_CHANNELS = [
  'web_parse',
  'manual',
  'telegram_group',
  'telegram_bot',
  'telegram_channel',
] as const

export type ContentIntakeChannel = (typeof CONTENT_INTAKE_CHANNELS)[number]

export const CONTENT_INTAKE_LABELS: Record<ContentIntakeChannel, string> = {
  web_parse: 'Парсинг сайта',
  manual: 'Ручной ввод',
  telegram_group: 'Группа в Telegram',
  telegram_bot: 'Прямо в бота',
  telegram_channel: 'Парсинг Telegram (канал)',
}

function isTelegramUrl(url: string | null | undefined): boolean {
  if (!url?.trim()) return false
  try {
    return /^(t\.me|telegram\.me)$/i.test(new URL(url.trim()).hostname)
  } catch {
    return /t\.me|telegram\.me/i.test(url)
  }
}

export function isContentIntakeChannel(value: unknown): value is ContentIntakeChannel {
  return typeof value === 'string' && (CONTENT_INTAKE_CHANNELS as readonly string[]).includes(value)
}

export function inferContentIntakeChannel(args: {
  sourceKind?: string | null
  intake?: string | null
  sourceUrl?: string | null
  sourceExternalId?: string | null
}): ContentIntakeChannel {
  if (isContentIntakeChannel(args.intake)) return args.intake

  const kind = String(args.sourceKind || '').trim()
  if (kind === 'bot_submit') return 'telegram_bot'
  if (kind === 'manual_editor') return 'manual'
  if (kind === 'web_cron') {
    return isTelegramUrl(args.sourceUrl) ? 'telegram_channel' : 'web_parse'
  }
  if (kind === 'telegram_parse') return 'telegram_channel'
  return 'manual'
}

export function resolveContentIntakeLabel(args: {
  sourceKind?: string | null
  intake?: string | null
  sourceUrl?: string | null
  sourceExternalId?: string | null
}): string {
  const channel = inferContentIntakeChannel(args)
  return CONTENT_INTAKE_LABELS[channel]
}

export function intakeFromPayload(payload: unknown): string | null {
  if (!payload || typeof payload !== 'object') return null
  const p = payload as Record<string, unknown>
  const direct = (p.source as { intake?: unknown } | undefined)?.intake
  if (isContentIntakeChannel(direct)) return direct
  const nested = (p.events as Array<{ source?: { intake?: unknown } }> | undefined)?.[0]?.source?.intake
  if (isContentIntakeChannel(nested)) return nested
  return null
}

export function withSourceIntake<T extends { source: { kind: string; url: string | null; external_id: string | null } }>(
  parse: T,
  intake: ContentIntakeChannel,
): T & { source: T['source'] & { intake: ContentIntakeChannel } } {
  return {
    ...parse,
    source: {
      ...parse.source,
      intake,
    },
  }
}
