import type { H3Event } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import {
  parseCityIngestSettings,
  type CityIngestSettings,
} from '~/server/utils/cityIngestSettingsShared'
import { resolveCityBySlug } from '~/server/utils/inuuCity'

export type { CityIngestSettings } from '~/server/utils/cityIngestSettingsShared'
export { parseCityIngestSettings } from '~/server/utils/cityIngestSettingsShared'

export async function loadCityIngestSettings(
  event: H3Event,
  cityId: string,
): Promise<CityIngestSettings> {
  const client = await serverSupabaseServiceRole(event)
  const { data } = await client
    .from('cities')
    .select('content_ops_settings')
    .eq('id', cityId)
    .maybeSingle()

  const settings = ((data as any)?.content_ops_settings || {}) as Record<string, unknown>
  const ingest = settings.ingest
  return parseCityIngestSettings(ingest)
}

export async function resolveCityPrefilterEnabled(
  event: H3Event,
  citySlug: string | null | undefined,
): Promise<boolean> {
  const slug = String(citySlug || '').trim()
  if (!slug) return true
  try {
    const city = await resolveCityBySlug(event, slug)
    const settings = await loadCityIngestSettings(event, city.id)
    return settings.prefilter_enabled
  } catch {
    return true
  }
}
