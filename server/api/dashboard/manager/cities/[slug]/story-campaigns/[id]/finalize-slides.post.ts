import { createError, defineEventHandler, readBody } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import { resolveManagerCityScopeOrThrow } from '~/server/utils/managerCityAccess'
import type { StorySlideInput } from '~/server/utils/storyCampaignWrite'

type Body = {
  slides?: Array<{
    mediaUrl: string
    sortOrder?: number
    title?: string
    text?: string
    durationSeconds?: number
    actionType?: string
    actionPayload?: Record<string, unknown>
  }>
}

export default defineEventHandler(async (event) => {
  const slugParam = typeof event.context.params?.slug === 'string' ? event.context.params.slug : ''
  const campaignId = typeof event.context.params?.id === 'string' ? event.context.params.id : ''
  if (!campaignId) {
    throw createError({ statusCode: 400, statusMessage: 'Campaign id is required' })
  }

  const scope = await resolveManagerCityScopeOrThrow(event, slugParam)
  const body = await readBody<Body>(event)
  const incoming = Array.isArray(body?.slides) ? body.slides : []
  const slides: StorySlideInput[] = incoming
    .filter((s) => s.mediaUrl?.trim())
    .map((s, idx) => ({
      mediaUrl: s.mediaUrl.trim(),
      sortOrder: typeof s.sortOrder === 'number' ? s.sortOrder : idx,
      durationSeconds: s.durationSeconds,
      actionType: s.actionType || 'open_url',
      actionPayload: {
        ...(s.actionPayload && typeof s.actionPayload === 'object' ? s.actionPayload : {}),
        ...(s.title ? { title: s.title } : {}),
        ...(s.text ? { text: s.text } : {}),
      },
    }))

  if (!slides.length) {
    throw createError({ statusCode: 400, statusMessage: 'At least one slide with mediaUrl is required' })
  }

  const client = await serverSupabaseServiceRole(event)
  const { data: campaign, error: loadErr } = await client
    .from('story_campaigns')
    .select('id,city_id,targeting')
    .eq('id', campaignId)
    .eq('city_id', scope.cityId)
    .maybeSingle()

  if (loadErr || !campaign?.id) {
    throw createError({ statusCode: 404, statusMessage: 'Story campaign not found' })
  }

  const targeting =
    campaign.targeting && typeof campaign.targeting === 'object' && !Array.isArray(campaign.targeting)
      ? { ...(campaign.targeting as Record<string, unknown>) }
      : {}

  const guidePath = typeof targeting.guide_path === 'string' ? targeting.guide_path : null

  await client.from('story_slides').delete().eq('campaign_id', campaignId)

  const rows = slides.map((s, idx) => ({
    campaign_id: campaignId,
    sort_order: typeof s.sortOrder === 'number' ? s.sortOrder : idx,
    media_url: s.mediaUrl.trim(),
    duration_seconds:
      typeof s.durationSeconds === 'number' && s.durationSeconds >= 1
        ? Math.min(120, s.durationSeconds)
        : 6,
    action_type: ['open_url', 'open_venue', 'open_event', 'none'].includes(String(s.actionType))
      ? String(s.actionType)
      : 'open_url',
    action_payload: {
      ...(s.actionPayload && typeof s.actionPayload === 'object' ? s.actionPayload : {}),
      ...(guidePath ? { url: guidePath } : {}),
    },
  }))

  const { error: slideErr } = await client.from('story_slides').insert(rows)
  if (slideErr) {
    throw createError({ statusCode: 500, statusMessage: slideErr.message || 'Failed to save slides' })
  }

  const previewUrl = slides[0]?.mediaUrl || null
  const { error: updErr } = await client
    .from('story_campaigns')
    .update({
      preview_url: previewUrl,
      targeting: {
        ...targeting,
        pending_render: false,
        slide_draft: null,
      },
      updated_at: new Date().toISOString(),
    } as any)
    .eq('id', campaignId)

  if (updErr) {
    throw createError({ statusCode: 500, statusMessage: updErr.message || 'Failed to update campaign' })
  }

  return {
    ok: true as const,
    campaignId,
    slideCount: slides.length,
    previewUrl,
  }
})
