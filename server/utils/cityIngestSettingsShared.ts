export type CityIngestSettings = {
  prefilter_enabled: boolean
}

const DEFAULTS: CityIngestSettings = {
  prefilter_enabled: true,
}

export function parseCityIngestSettings(raw: unknown): CityIngestSettings {
  const o = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {}
  return {
    prefilter_enabled: o.prefilter_enabled === false ? false : DEFAULTS.prefilter_enabled,
  }
}
