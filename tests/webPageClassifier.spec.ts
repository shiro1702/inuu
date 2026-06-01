import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { sanitizeHtml } from '../server/utils/webPageSanitizer'
import {
  filterUrlsForListPage,
  matchListPattern,
  shouldReclassify,
} from '../server/utils/webCrawlHelpers'
import type { ParsingStrategy } from '../server/utils/webParsingTypes'

const fixtureDir = join(dirname(fileURLToPath(import.meta.url)), 'fixtures', 'web')

describe('web crawl router helpers', () => {
  it('filters list URLs by glob pattern', () => {
    const html = readFileSync(join(fixtureDir, 'event-list.html'), 'utf8')
    const page = sanitizeHtml(html, 'https://venue.local/afisha')
    const urls = filterUrlsForListPage(page.links, page.finalUrl, '/events/*')

    expect(urls).toContain('https://venue.local/events/concert-blues')
    expect(urls).toContain('https://venue.local/events/standup-night')
    expect(urls).not.toContain('https://other-site.com/external')
    expect(urls.length).toBeLessThanOrEqual(5)
  })

  it('matchListPattern supports wildcards', () => {
    expect(matchListPattern('https://x.local/events/foo', '/events/*')).toBe(true)
    expect(matchListPattern('https://x.local/about', '/events/*')).toBe(false)
  })

  it('shouldReclassify when strategy missing or stale', () => {
    expect(shouldReclassify(null, null)).toBe(true)

    const fresh: ParsingStrategy = {
      page_type: 'single_event',
      classified_at: new Date().toISOString(),
      fail_count: 0,
    }
    expect(shouldReclassify(fresh, new Date().toISOString())).toBe(false)

    const stale: ParsingStrategy = {
      page_type: 'single_event',
      classified_at: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
    }
    expect(shouldReclassify(stale, null)).toBe(true)

    const failing: ParsingStrategy = {
      page_type: 'single_event',
      classified_at: new Date().toISOString(),
      fail_count: 2,
    }
    expect(shouldReclassify(failing, new Date().toISOString())).toBe(true)
  })
})
