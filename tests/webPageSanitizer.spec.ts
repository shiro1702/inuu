import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { sanitizeHtml } from '../server/utils/webPageSanitizer'

const fixtureDir = join(dirname(fileURLToPath(import.meta.url)), 'fixtures', 'web')

function loadFixture(name: string): string {
  return readFileSync(join(fixtureDir, name), 'utf8')
}

describe('sanitizeHtml', () => {
  it('strips script/style/header/footer and extracts links and text', () => {
    const html = loadFixture('single-event.html')
    const result = sanitizeHtml(html, 'https://venue.local/events/blues')

    expect(result.text).toContain('Концерт')
    expect(result.text).toContain('Байкал Blues')
    expect(result.text).not.toMatch(/window\.tracker/i)
    expect(result.text).not.toContain('Меню сайта')
    expect(result.text.length).toBeLessThanOrEqual(3000)
    expect(result.links).toContain('https://venue.local/events/other')
    expect(result.links).toContain('https://example.org/tickets')
    expect(result.htmlSnippet).not.toContain('<script')
  })

  it('extracts list page links as absolute URLs', () => {
    const html = loadFixture('event-list.html')
    const result = sanitizeHtml(html, 'https://venue.local/afisha')

    expect(result.links).toContain('https://venue.local/events/concert-blues')
    expect(result.links).toContain('https://venue.local/events/standup-night')
    expect(result.links).toContain('https://other-site.com/external')
  })
})
