export type IngestCityScope = {
  cityId: string
  citySlug: string
  cityName: string
}

type CityJoin = { slug: string; name: string }

export function ingestCityScopeFromJoin(row: {
  city_id: string
  cities: unknown
}): IngestCityScope | null {
  const cityRaw = Array.isArray(row.cities) ? row.cities[0] : row.cities
  if (!cityRaw || typeof cityRaw !== 'object') return null
  const slug = String((cityRaw as CityJoin).slug || '').trim()
  if (!slug) return null
  return {
    cityId: String(row.city_id),
    citySlug: slug,
    cityName: String((cityRaw as CityJoin).name || slug),
  }
}
