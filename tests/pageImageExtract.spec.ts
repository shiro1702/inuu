import { describe, expect, it } from 'vitest'
import { extractOgImageFromHtml } from '../server/utils/pageImageExtract'

describe('pageImageExtract', () => {
  it('reads og:image from HTML', () => {
    const html = `<html><head>
      <meta property="og:image" content="https://cdn.example.com/poster.jpg">
    </head><body></body></html>`
    expect(extractOgImageFromHtml(html)).toBe('https://cdn.example.com/poster.jpg')
  })
})
