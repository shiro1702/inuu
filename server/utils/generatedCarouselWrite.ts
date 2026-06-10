import type { H3Event } from 'h3'
import { createError } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import type { CarouselAspect, CarouselSlide, CarouselTemplateId } from '~/types/editorialCarousel'
import { normalizeCarouselTemplateId } from '~/utils/carouselTemplates'
import type { GeneratedCarouselRow } from '~/server/utils/generatedCarouselAccess'

export type CarouselProjectType = 'carousel' | 'post' | 'story' | 'cover'

export type GeneratedCarouselSettings = {
  vibe_key?: string
  link_hint?: string
  brand_name?: string
  city_slug?: string
  telegram_post_text?: string
}

export type GeneratedCarouselPayload = {
  title?: string
  project_type?: CarouselProjectType
  theme_id?: CarouselTemplateId | string
  aspect?: CarouselAspect | string
  settings?: GeneratedCarouselSettings
  slides?: CarouselSlide[]
  city_slug?: string
}

function normalizeAspect(value: unknown): CarouselAspect {
  const v = typeof value === 'string' ? value.trim() : ''
  if (v === '9:16' || v === '1:1' || v === '16:9') return v
  return '4:5'
}

function normalizeProjectType(value: unknown): CarouselProjectType {
  const v = typeof value === 'string' ? value.trim() : ''
  if (v === 'post' || v === 'story' || v === 'cover') return v
  return 'carousel'
}

export function rowToCarouselResponse(
  row: GeneratedCarouselRow,
  extras?: { city_slug?: string | null; city_name?: string | null },
) {
  const settings = (row.settings || {}) as GeneratedCarouselSettings
  return {
    id: row.id,
    created_at: row.created_at,
    updated_at: row.updated_at,
    city_id: row.city_id,
    city_slug: extras?.city_slug || settings.city_slug || null,
    city_name: extras?.city_name || settings.brand_name || null,
    title: row.title,
    project_type: row.project_type,
    theme_id: normalizeCarouselTemplateId(row.theme_id),
    aspect: normalizeAspect(row.aspect),
    settings: (row.settings || {}) as GeneratedCarouselSettings,
    slides: Array.isArray(row.slides) ? (row.slides as CarouselSlide[]) : [],
  }
}

export async function createGeneratedCarousel(
  event: H3Event,
  args: { userId: string; cityId: string; payload?: GeneratedCarouselPayload },
) {
  const client = await serverSupabaseServiceRole(event)
  const slides = args.payload?.slides?.length
    ? args.payload.slides
    : [
        { role: 'cover' as const, title: 'Заголовок обложки', gradient: 'party', media_url: null },
        { role: 'body' as const, title: 'Главное', bullets: ['Первый тезис'], gradient: 'party' },
        { role: 'outro' as const, cta_text: 'Читать в INUU', gradient: 'party' },
      ]

  const citySlug = args.payload?.city_slug?.trim() || ''
  const settings: GeneratedCarouselSettings = {
    ...(args.payload?.settings || {}),
    ...(citySlug ? { city_slug: citySlug } : {}),
  }

  const { data, error } = await client
    .from('generated_carousels')
    .insert({
      created_by: args.userId,
      city_id: args.cityId,
      title: args.payload?.title?.trim() || 'Новая карусель',
      project_type: normalizeProjectType(args.payload?.project_type),
      theme_id: normalizeCarouselTemplateId(args.payload?.theme_id),
      aspect: normalizeAspect(args.payload?.aspect),
      settings,
      slides,
    })
    .select('*')
    .single()

  if (error || !data) {
    throw createError({ statusCode: 500, statusMessage: error?.message || 'Failed to create carousel' })
  }

  return rowToCarouselResponse(data as GeneratedCarouselRow)
}

export async function updateGeneratedCarousel(
  event: H3Event,
  id: string,
  payload: GeneratedCarouselPayload,
) {
  const client = await serverSupabaseServiceRole(event)
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() }

  if (payload.title !== undefined) patch.title = payload.title.trim() || 'Новая карусель'
  if (payload.project_type !== undefined) patch.project_type = normalizeProjectType(payload.project_type)
  if (payload.theme_id !== undefined) patch.theme_id = normalizeCarouselTemplateId(payload.theme_id)
  if (payload.aspect !== undefined) patch.aspect = normalizeAspect(payload.aspect)
  if (payload.settings !== undefined) patch.settings = payload.settings
  if (payload.slides !== undefined) {
    if (!payload.slides.length) {
      throw createError({ statusCode: 400, statusMessage: 'slides must not be empty' })
    }
    patch.slides = payload.slides
  }

  const { data, error } = await client
    .from('generated_carousels')
    .update(patch)
    .eq('id', id)
    .select('*')
    .single()

  if (error || !data) {
    throw createError({ statusCode: 500, statusMessage: error?.message || 'Failed to update carousel' })
  }

  return rowToCarouselResponse(data as GeneratedCarouselRow)
}
