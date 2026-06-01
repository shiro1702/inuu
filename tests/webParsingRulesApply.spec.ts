import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import {
  applyParsingRulesToHtml,
  isFastLaneComplete,
} from '../server/utils/webParsingRulesApply'

const fixtureDir = join(dirname(fileURLToPath(import.meta.url)), 'fixtures', 'web')

describe('applyParsingRulesToHtml', () => {
  it('extracts title and start_time from fixture', () => {
    const html = readFileSync(join(fixtureDir, 'single-event.html'), 'utf8')
    const fields = applyParsingRulesToHtml(html, {
      page_type: 'single_event',
      selectors: {
        title: 'h1.event-title',
        start_time: 'time@datetime',
        description: '.event-body',
        price: null,
        poster: null,
      },
    })

    expect(fields.title).toContain('Байкал Blues')
    expect(fields.start_time).toContain('2026-06-15')
    expect(fields.description).toContain('блюз')
    expect(isFastLaneComplete(fields)).toBe(true)
  })

  it('reads poster via @src selector', () => {
    const html = `
      <article>
        <h1 class="event-title">Show</h1>
        <time datetime="2026-07-01T18:00:00+08:00">1 июля</time>
        <img class="poster-img" src="https://cdn.example/poster.jpg" />
      </article>
    `
    const fields = applyParsingRulesToHtml(html, {
      selectors: {
        title: 'h1.event-title',
        start_time: 'time@datetime',
        poster: '.poster-img@src',
      },
    })

    expect(fields.poster).toBe('https://cdn.example/poster.jpg')
    expect(isFastLaneComplete(fields)).toBe(true)
  })
})
