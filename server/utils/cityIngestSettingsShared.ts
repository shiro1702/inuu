export type CityIngestSettings = {
  prefilter_enabled: boolean
  reject_past_events_enabled: boolean
}

const DEFAULTS: CityIngestSettings = {
  prefilter_enabled: true,
  reject_past_events_enabled: true,
}

export function parseCityIngestSettings(raw: unknown): CityIngestSettings {
  const o = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {}
  return {
    prefilter_enabled: o.prefilter_enabled === false ? false : DEFAULTS.prefilter_enabled,
    reject_past_events_enabled:
      o.reject_past_events_enabled === false ? false : DEFAULTS.reject_past_events_enabled,
  }
}
