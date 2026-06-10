import type { H3Event } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import type { CarouselSlide } from '~/types/editorialCarousel'

type PresetRow = {
  id: string
  storage_path: string
  tags: string[] | null
  vibe_slugs: string[] | null
}

type SlideWithTags = CarouselSlide & { image_tags?: string[] }

function scorePreset(tags: string[], queryTags: string[], vibe?: string, vibeSlugs?: string[] | null): number {
  let score = 0
  const normalized = tags.map((t) => t.toLowerCase())
  for (const q of queryTags) {
    const qn = q.toLowerCase()
    if (normalized.some((t) => t.includes(qn) || qn.includes(t))) score += 2
  }
  if (vibe && vibeSlugs?.includes(vibe)) score += 3
  return score
}

export async function resolvePresetPublicUrl(
  event: H3Event,
  storagePath: string,
): Promise<string | null> {
  const client = await serverSupabaseServiceRole(event)
  const { data } = await client.storage.from('media').createSignedUrl(storagePath, 60 * 60 * 24 * 7)
  if (data?.signedUrl) return data.signedUrl
  const config = useRuntimeConfig()
  const base = String(config.supabaseUrl || config.public.supabaseUrl || '').replace(/\/$/, '')
  if (base) return `${base}/storage/v1/object/public/media/${storagePath}`
  return null
}

export async function matchCarouselSlideImages(
  event: H3Event,
  args: {
    slides: SlideWithTags[]
    cityId?: string | null
    vibeKey?: string
    eventCoverUrls?: string[]
  },
): Promise<CarouselSlide[]> {
  const client = await serverSupabaseServiceRole(event)
  let query = client.from('carousel_preset_images').select('id, storage_path, tags, vibe_slugs')
  if (args.cityId) {
    query = query.or(`city_id.eq.${args.cityId},city_id.is.null`)
  }
  const { data: presets } = await query.limit(200)
  const presetRows = (presets || []) as PresetRow[]

  let eventCoverIndex = 0
  return args.slides.map((slide) => {
    if (slide.media_url) return slide

    const tags = slide.image_tags || []
    if (args.eventCoverUrls?.length && eventCoverIndex < args.eventCoverUrls.length && slide.role === 'cover') {
      const url = args.eventCoverUrls[eventCoverIndex++]!
      return { ...slide, media_url: url }
    }

    if (!tags.length && !args.vibeKey) return slide

    let best: PresetRow | null = null
    let bestScore = 0
    for (const row of presetRows) {
      const s = scorePreset(row.tags || [], tags, args.vibeKey, row.vibe_slugs)
      if (s > bestScore) {
        bestScore = s
        best = row
      }
    }

    if (!best && args.vibeKey) {
      for (const row of presetRows) {
        const s = scorePreset(row.tags || [], [args.vibeKey], args.vibeKey, row.vibe_slugs)
        if (s > bestScore) {
          bestScore = s
          best = row
        }
      }
    }

    if (!best) return slide
    return slide
  })
}

export async function applyPresetUrlsToSlides(
  event: H3Event,
  slides: SlideWithTags[],
  args: { cityId?: string | null; vibeKey?: string; eventCoverUrls?: string[] },
): Promise<CarouselSlide[]> {
  const client = await serverSupabaseServiceRole(event)
  let query = client.from('carousel_preset_images').select('id, storage_path, tags, vibe_slugs')
  if (args.cityId) {
    query = query.or(`city_id.eq.${args.cityId},city_id.is.null`)
  }
  const { data: presets } = await query.limit(200)
  const presetRows = (presets || []) as PresetRow[]

  const out: CarouselSlide[] = []
  let eventCoverIndex = 0

  for (const slide of slides) {
    if (slide.media_url) {
      out.push(slide)
      continue
    }

    if (args.eventCoverUrls?.length && slide.role === 'cover' && eventCoverIndex < args.eventCoverUrls.length) {
      out.push({ ...slide, media_url: args.eventCoverUrls[eventCoverIndex++]! })
      continue
    }

    const tags = slide.image_tags || []
    let best: PresetRow | null = null
    let bestScore = 0
    for (const row of presetRows) {
      const s = scorePreset(row.tags || [], tags.length ? tags : [args.vibeKey || ''], args.vibeKey, row.vibe_slugs)
      if (s > bestScore) {
        bestScore = s
        best = row
      }
    }

    if (best?.storage_path) {
      const url = await resolvePresetPublicUrl(event, best.storage_path)
      out.push({ ...slide, media_url: url })
    } else {
      out.push(slide)
    }
  }

  return out
}
