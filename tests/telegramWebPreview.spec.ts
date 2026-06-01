import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import {
  buildTelegramPostExternalId,
  buildTelegramPostSourceUrl,
  parseTelegramWebPreviewHtml,
  resolveTelegramWebPreviewUrl,
  selectRecentTelegramWebPreviewPosts,
} from '../server/utils/telegramWebPreview'

const fixtureDir = join(dirname(fileURLToPath(import.meta.url)), 'fixtures', 'telegram')

describe('telegramWebPreview', () => {
  it('resolves t.me/s and bare channel URLs', () => {
    expect(resolveTelegramWebPreviewUrl('https://t.me/s/standuuup2u')).toBe(
      'https://t.me/s/standuuup2u',
    )
    expect(resolveTelegramWebPreviewUrl('https://t.me/standuuup2u/')).toBe(
      'https://t.me/s/standuuup2u',
    )
    expect(resolveTelegramWebPreviewUrl('https://t.me/standuuup2u/123')).toBeNull()
  })

  it('parses posts from preview HTML', () => {
    const html = readFileSync(join(fixtureDir, 'channel-preview-snippet.html'), 'utf8')
    const posts = parseTelegramWebPreviewHtml(html)
    expect(posts).toHaveLength(1)
    expect(posts[0]?.text.toLowerCase()).toContain('открытый микрофон')
    expect(posts[0]?.dataPost).toBe('standuuup2u/100')
    expect(buildTelegramPostSourceUrl('standuuup2u/100')).toBe('https://t.me/standuuup2u/100')
    expect(buildTelegramPostExternalId('standuuup2u/100')).toBe('tgweb:standuuup2u:100')
  })

  it('keeps only the last N posts', () => {
    const posts = [
      { dataPost: 'c/1', sourceUrl: 'u1', text: 'a', datetime: null, posterUrl: null },
      { dataPost: 'c/2', sourceUrl: 'u2', text: 'b', datetime: null, posterUrl: null },
      { dataPost: 'c/3', sourceUrl: 'u3', text: 'c', datetime: null, posterUrl: null },
    ]
    expect(selectRecentTelegramWebPreviewPosts(posts, 2).map((p) => p.dataPost)).toEqual(['c/2', 'c/3'])
  })
})
