import type { H3Event } from 'h3'
import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { serverSupabaseServiceRole } from '#supabase/server'

export type InuuCityRow = {
  id: string
  name: string
  slug: string
  timezone: string
  editorial_name: string | null
  is_active: boolean
}

const CITY_CACHE_TTL_MS = 5 * 60 * 1000
const cityBySlugCache = new Map<string, { row: InuuCityRow; expiresAt: number }>()

export async function resolveCityBySlug(
  event: H3Event,
  slug: string,
  existingClient?: SupabaseClient,
): Promise<InuuCityRow> {
  const normalized = slug.trim()
  if (!normalized) {
    throw createError({ statusCode: 400, statusMessage: 'City slug is required' })
  }

  const cached = cityBySlugCache.get(normalized)
  if (cached && cached.expiresAt > Date.now()) {
    return cached.row
  }

  const client = existingClient ?? (await serverSupabaseServiceRole(event))
  const { data, error } = await client
    .from('cities')
    .select('id,name,slug,timezone,editorial_name,is_active')
    .eq('slug', normalized)
    .eq('is_active', true)
    .maybeSingle()

  if (error) {
    console.error('[inuuCity] load failed:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to load city' })
  }

  if (!data) {
    throw createError({ statusCode: 404, statusMessage: 'City not found' })
  }

  const row = data as InuuCityRow
  cityBySlugCache.set(normalized, { row, expiresAt: Date.now() + CITY_CACHE_TTL_MS })
  return row
}
