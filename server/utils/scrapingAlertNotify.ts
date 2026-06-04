import type { H3Event } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import { loadCityTelegramOpsSettings } from '~/server/utils/inuuContentModeration'

const TELEGRAM_API = (token: string) => `https://api.telegram.org/bot${token}`

const REASON_LABELS: Record<string, string> = {
  source_404: 'Страница источника 404',
  source_empty: 'Пустая / ошибка страницы',
  source_cancelled_on_site: 'На сайте отмена / sold out',
}

export async function notifyManagerScrapingAlert(
  event: H3Event,
  args: {
    cityId: string
    eventId: string
    eventSlug: string
    eventTitle: string
    reason: string
    url: string
  },
): Promise<void> {
  const config = useRuntimeConfig(event)
  const botToken = String(config.botToken || '').trim()
  if (!botToken) return

  const settings = await loadCityTelegramOpsSettings(event, args.cityId)
  const chatId = String(settings.manager_chat_id || settings.moderation_chat_id || '').trim()
  if (!chatId) return

  const client = await serverSupabaseServiceRole(event)
  const { data: city } = await client.from('cities').select('slug').eq('id', args.cityId).maybeSingle()
  const citySlug = String((city as { slug?: string } | null)?.slug || '')
  const appUrl = String(config.appUrl || '').trim().replace(/\/$/, '')
  const dashboardPath = appUrl ? `${appUrl}/dashboard/content-ai` : '/dashboard/content-ai'
  const eventPath = citySlug && appUrl ? `${appUrl}/${citySlug}/events/${args.eventSlug}` : ''

  const label = REASON_LABELS[args.reason] || args.reason
  const lines = [
    '⚠️ Проверка источника (выходные)',
    label,
    args.eventTitle,
    args.url,
    eventPath ? `Событие: ${eventPath}` : null,
    `Dashboard: ${dashboardPath}`,
  ].filter(Boolean)

  await fetch(`${TELEGRAM_API(botToken)}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text: lines.join('\n') }),
  }).catch(() => null)
}
