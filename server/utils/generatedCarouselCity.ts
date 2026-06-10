import type { H3Event } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'

export async function resolveCitySlugAndName(
  event: H3Event,
  cityId: string | null,
): Promise<{ city_slug: string | null; city_name: string | null }> {
  if (!cityId) return { city_slug: null, city_name: null }

  const client = await serverSupabaseServiceRole(event)
  const { data } = await client
    .from('cities')
    .select('slug, name')
    .eq('id', cityId)
    .maybeSingle()

  if (!data) return { city_slug: null, city_name: null }
  return {
    city_slug: typeof data.slug === 'string' ? data.slug : null,
    city_name: typeof data.name === 'string' ? data.name : null,
  }
}
