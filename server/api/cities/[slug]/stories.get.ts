import { createError, defineEventHandler, setResponseHeader } from 'h3'
import { serverSupabaseClient } from '#supabase/server'
import { resolveCityBySlug } from '~/server/utils/inuuCity'

const CITY_PLACEMENTS = ['top_bar', 'home_hero'] as const

export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'Cache-Control', 'public, max-age=60, s-maxage=120, stale-while-revalidate=300')

  const slug = typeof event.context.params?.slug === 'string' ? event.context.params.slug : ''
  const city = await resolveCityBySlug(event, slug)
  const client = await serverSupabaseClient(event)
  const nowIso = new Date().toISOString()

  const { data: campaigns, error: campErr } = await client
    .from('story_campaigns')
    .select(
      'id, title, preview_url, placement, is_active, valid_from, valid_until, targeting, created_at',
    )
    .eq('city_id', city.id)
    .eq('is_active', true)
    .in('placement', [...CITY_PLACEMENTS])
    .order('created_at', { ascending: false })

  if (campErr) {
    console.error('cities/stories campaigns:', campErr)
    throw createError({ statusCode: 500, statusMessage: 'Failed to load stories' })
  }

  const timeOk = (c: Record<string, unknown>): boolean => {
    const vf = c.valid_from
    const vu = c.valid_until
    if (vf && typeof vf === 'string' && vf > nowIso) return false
    if (vu && typeof vu === 'string' && vu < nowIso) return false
    return true
  }

  const filtered = (campaigns ?? []).filter((c) => timeOk(c as Record<string, unknown>))
  const campaignIds = filtered.map((c) => (c as { id: string }).id)

  if (campaignIds.length === 0) {
    return {
      ok: true,
      cityId: city.id,
      topBar: [],
      campaigns: [],
    }
  }

  const { data: slides, error: slideErr } = await client
    .from('story_slides')
    .select(
      'id, campaign_id, sort_order, media_url, duration_seconds, action_type, action_payload',
    )
    .in('campaign_id', campaignIds)
    .order('sort_order', { ascending: true })

  if (slideErr) {
    console.error('cities/stories slides:', slideErr)
    throw createError({ statusCode: 500, statusMessage: 'Failed to load story slides' })
  }

  const slidesByCampaign = new Map<string, typeof slides>()
  for (const s of slides ?? []) {
    const cid = (s as { campaign_id: string }).campaign_id
    if (!slidesByCampaign.has(cid)) slidesByCampaign.set(cid, [])
    slidesByCampaign.get(cid)!.push(s)
  }

  const mapSlide = (s: Record<string, unknown>) => {
    const actionPayload = (s.action_payload ?? {}) as Record<string, unknown>
    const title = typeof actionPayload.title === 'string' ? actionPayload.title : null
    const text = typeof actionPayload.text === 'string' ? actionPayload.text : null
    return {
      id: s.id as string,
      campaignId: s.campaign_id as string,
      sortOrder: s.sort_order as number,
      mediaUrl: (s.media_url as string) || '',
      durationSeconds: s.duration_seconds as number,
      actionType: s.action_type as string,
      actionPayload,
      title,
      text,
    }
  }

  const mapCampaign = (c: Record<string, unknown>) => {
    const id = c.id as string
    const rawSlides = slidesByCampaign.get(id) ?? []
    return {
      id,
      title: c.title as string,
      previewUrl: (c.preview_url as string | null) ?? null,
      placement: c.placement as string,
      targeting: c.targeting,
      slides: rawSlides.map((x) => mapSlide(x as Record<string, unknown>)),
    }
  }

  const mapped = filtered
    .map((c) => mapCampaign(c as Record<string, unknown>))
    .filter((c) => c.slides.length > 0)

  const topBar = mapped.filter((c) =>
    CITY_PLACEMENTS.includes(c.placement as (typeof CITY_PLACEMENTS)[number]),
  )

  return {
    ok: true,
    cityId: city.id,
    topBar,
    campaigns: mapped,
  }
})
