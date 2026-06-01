import {
  extractOgImageFromHtml,
  fetchHtmlForImageExtract,
} from '~/server/utils/pageImageExtract'
import { fetchTelegramWebPreviewPosts } from '~/server/utils/telegramWebPreview'
import { normalizeRemoteMediaUrl } from '~/server/utils/remoteMediaUrl'

function parseTelegramPostPath(url: string): { channel: string; messageId: string } | null {
  try {
    const parsed = new URL(url.trim())
    if (!/^(t\.me|telegram\.me)$/i.test(parsed.hostname)) return null
    const match = parsed.pathname.match(/^\/([a-zA-Z0-9_]+)\/(\d+)\/?$/i)
    if (!match?.[1] || !match[2]) return null
    if (['s', 'joinchat', 'share', 'c'].includes(match[1].toLowerCase())) return null
    return { channel: match[1], messageId: match[2] }
  } catch {
    return null
  }
}

/** Cover from public t.me post page (og:image) or channel preview widget. */
export async function fetchTelegramPostCoverUrl(sourceUrl: string | null | undefined): Promise<string | null> {
  const trimmed = String(sourceUrl || '').trim()
  if (!trimmed) return null

  const post = parseTelegramPostPath(trimmed)
  if (post) {
    const page = await fetchHtmlForImageExtract(`https://t.me/${post.channel}/${post.messageId}`)
    if (page) {
      const og = extractOgImageFromHtml(page.html, page.finalUrl)
      if (og) return og
    }

    const preview = await fetchTelegramWebPreviewPosts(`https://t.me/s/${post.channel}`, 20)
    const dataPost = `${post.channel}/${post.messageId}`
    const fromPreview = preview?.posts.find((row) => row.dataPost === dataPost)?.posterUrl
    if (fromPreview) return normalizeRemoteMediaUrl(fromPreview)
  }

  const previewOnly = await fetchTelegramWebPreviewPosts(trimmed, 5)
  const lastWithPoster = [...(previewOnly?.posts || [])].reverse().find((row) => row.posterUrl)
  return lastWithPoster?.posterUrl ? normalizeRemoteMediaUrl(lastWithPoster.posterUrl) : null
}
