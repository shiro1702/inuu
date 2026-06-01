import * as cheerio from 'cheerio'

const FETCH_TIMEOUT_MS = 8000
const USER_AGENT = 'INUU-ContentBot/1.0 (+https://inuu.ru)'
export const DEFAULT_TELEGRAM_WEB_PREVIEW_POST_LIMIT = 5

export type TelegramWebPreviewPost = {
  dataPost: string
  sourceUrl: string
  text: string
  datetime: string | null
  posterUrl: string | null
}

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, ' ').trim()
}

export function isTelegramHost(hostname: string): boolean {
  return /^(t\.me|telegram\.me)$/i.test(hostname)
}

/** Public channel preview: https://t.me/s/{channel} */
export function resolveTelegramWebPreviewUrl(url: string): string | null {
  let parsed: URL
  try {
    parsed = new URL(url.trim())
  } catch {
    return null
  }
  if (!isTelegramHost(parsed.hostname)) return null

  const path = parsed.pathname.replace(/\/$/, '') || '/'
  const previewMatch = path.match(/^\/s\/([a-zA-Z0-9_]+)$/i)
  if (previewMatch) {
    parsed.hash = ''
    return `https://t.me/s/${previewMatch[1]}`
  }

  const channelMatch = path.match(/^\/([a-zA-Z0-9_]+)$/i)
  if (channelMatch && !['joinchat', 'addstickers', 'share'].includes(channelMatch[1].toLowerCase())) {
    return `https://t.me/s/${channelMatch[1]}`
  }

  return null
}

export function buildTelegramPostSourceUrl(dataPost: string): string {
  const [channel, messageId] = dataPost.split('/')
  if (!channel || !messageId) return `https://t.me/${dataPost}`
  return `https://t.me/${channel}/${messageId}`
}

export function buildTelegramPostExternalId(dataPost: string): string {
  return `tgweb:${dataPost.replace('/', ':')}`
}

function extractPosterUrl(style: string | undefined): string | null {
  if (!style) return null
  const match = style.match(/url\(['"]?([^'")]+)['"]?\)/i)
  return match?.[1] || null
}

function extractMessageText($: cheerio.CheerioAPI, message: cheerio.Cheerio<cheerio.Element>): string {
  const textRoot = message.find('.tgme_widget_message_text').first()
  if (!textRoot.length) return ''

  const clone = textRoot.clone()
  clone.find('br').replaceWith('\n')
  return normalizeWhitespace(clone.text().replace(/\n\s+/g, '\n').replace(/\n+/g, '\n'))
}

export function parseTelegramWebPreviewHtml(html: string): TelegramWebPreviewPost[] {
  const $ = cheerio.load(html)
  const posts: TelegramWebPreviewPost[] = []

  $('.tgme_widget_message[data-post]').each((_, el) => {
    const message = $(el)
    const dataPost = message.attr('data-post')?.trim()
    if (!dataPost) return

    const text = extractMessageText($, message)
    if (text.length < 10) return

    const datetime = message.find('time[datetime]').first().attr('datetime') || null
    const posterUrl = extractPosterUrl(
      message.find('.tgme_widget_message_photo_wrap').first().attr('style'),
    )

    posts.push({
      dataPost,
      sourceUrl: buildTelegramPostSourceUrl(dataPost),
      text,
      datetime,
      posterUrl,
    })
  })

  return posts
}

export function selectRecentTelegramWebPreviewPosts(
  posts: TelegramWebPreviewPost[],
  limit = DEFAULT_TELEGRAM_WEB_PREVIEW_POST_LIMIT,
): TelegramWebPreviewPost[] {
  if (posts.length <= limit) return posts
  return posts.slice(-limit)
}

export function buildTelegramWebPreviewCombinedText(
  posts: TelegramWebPreviewPost[],
): string {
  return posts
    .map((post) => {
      const dateLine = post.datetime ? `Дата поста: ${post.datetime}` : ''
      return [`--- Telegram @${post.dataPost.split('/')[0]} / ${post.dataPost} ---`, dateLine, post.text]
        .filter(Boolean)
        .join('\n')
    })
    .join('\n\n')
    .trim()
}

export async function fetchTelegramWebPreviewHtml(url: string): Promise<string | null> {
  const previewUrl = resolveTelegramWebPreviewUrl(url)
  if (!previewUrl) return null

  try {
    const res = await fetch(previewUrl, {
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.8',
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    })
    if (!res.ok) return null
    const body = await res.text()
    return body.trim() ? body : null
  } catch {
    return null
  }
}

export async function fetchTelegramWebPreviewPosts(
  url: string,
  limit = DEFAULT_TELEGRAM_WEB_PREVIEW_POST_LIMIT,
): Promise<{ previewUrl: string; posts: TelegramWebPreviewPost[] } | null> {
  const previewUrl = resolveTelegramWebPreviewUrl(url)
  if (!previewUrl) return null

  const html = await fetchTelegramWebPreviewHtml(url)
  if (!html) return null

  const posts = selectRecentTelegramWebPreviewPosts(parseTelegramWebPreviewHtml(html), limit)
  return { previewUrl, posts }
}
