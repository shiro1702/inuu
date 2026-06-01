import { describe, expect, it } from 'vitest'
import {
  extractTelegramChannelFromUrl,
  formatTopicTagsAsHashtags,
  resolveIngestSourceDisplayName,
} from '../server/utils/ingestSourceDisplayName'

describe('ingestSourceDisplayName', () => {
  it('extracts channel from t.me/s URL', () => {
    expect(extractTelegramChannelFromUrl('https://t.me/s/standuuup2u')).toBe('standuuup2u')
  })

  it('does not use bare t.me domain as display name', () => {
    expect(resolveIngestSourceDisplayName({ sourceUrl: 'https://t.me/s/standuuup2u' })).toBe('Standuuup2u')
    expect(resolveIngestSourceDisplayName({ sourceUrl: 'https://t.me/s/standuuup2u', displayName: 'STANDUP2U' })).toBe(
      'STANDUP2U',
    )
  })

  it('formats topic tags as hashtags', () => {
    expect(formatTopicTagsAsHashtags(['culture', 'nightlife'])).toBe('#culture #nightlife')
  })
})
