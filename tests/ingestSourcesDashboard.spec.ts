import { describe, expect, it } from 'vitest'
import { parseCityIngestSettings } from '../server/utils/cityIngestSettingsShared'
import { normalizeWebSourceUrl } from '../server/utils/ingestSourcesDashboardShared'

describe('parseCityIngestSettings', () => {
  it('defaults prefilter_enabled to true', () => {
    expect(parseCityIngestSettings(undefined).prefilter_enabled).toBe(true)
    expect(parseCityIngestSettings({}).prefilter_enabled).toBe(true)
  })

  it('respects explicit false', () => {
    expect(parseCityIngestSettings({ prefilter_enabled: false }).prefilter_enabled).toBe(false)
  })
})

describe('normalizeWebSourceUrl', () => {
  it('normalizes trailing slash', () => {
    expect(normalizeWebSourceUrl('https://example.com/afisha/')).toBe('https://example.com/afisha')
  })

  it('rejects invalid url', () => {
    expect(() => normalizeWebSourceUrl('not-a-url')).toThrow()
  })
})
