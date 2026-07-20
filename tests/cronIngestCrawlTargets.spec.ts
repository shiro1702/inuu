import { describe, expect, it } from 'vitest'
import {
  buildCronIngestCrawlTargets,
  extractTelegramChannelKeyFromWebUrl,
} from '../server/utils/cronIngestCrawlTargetsShared'

describe('extractTelegramChannelKeyFromWebUrl', () => {
  it('extracts channel slug from t.me/s preview URL', () => {
    expect(extractTelegramChannelKeyFromWebUrl('https://t.me/s/kuda_poiti_uu')).toBe('kuda_poiti_uu')
  })

  it('returns null for non-telegram URLs', () => {
    expect(extractTelegramChannelKeyFromWebUrl('https://example.com/afisha')).toBeNull()
  })
})

describe('buildCronIngestCrawlTargets', () => {
  const city = { slug: 'ulan-ude', name: 'Улан-Удэ' }

  it('deduplicates telegram when active web t.me/s mirror exists', () => {
    const { targets, skippedDuplicates } = buildCronIngestCrawlTargets({
      webRows: [{
        id: 'web-1',
        city_id: 'city-1',
        url: 'https://t.me/s/kuda_poiti_uu',
        display_name: 'Куда пойти',
        cities: city,
      }],
      telegramRows: [{
        id: 'tg-1',
        city_id: 'city-1',
        source_key: 'kuda_poiti_uu',
        cities: city,
      }],
    })

    expect(targets).toHaveLength(1)
    expect(targets[0]?.kind).toBe('web')
    expect(skippedDuplicates).toBe(1)
  })

  it('includes both web and telegram when web URL is not a t.me/s mirror', () => {
    const { targets, skippedDuplicates } = buildCronIngestCrawlTargets({
      webRows: [{
        id: 'web-1',
        city_id: 'city-1',
        url: 'https://theater.example.com/afisha',
        display_name: 'Театр',
        cities: city,
      }],
      telegramRows: [{
        id: 'tg-1',
        city_id: 'city-1',
        source_key: 'standup_uu',
        cities: city,
      }],
    })

    expect(targets).toHaveLength(2)
    expect(targets.map((t) => t.kind).sort()).toEqual(['telegram', 'web'])
    expect(skippedDuplicates).toBe(0)
  })
})
