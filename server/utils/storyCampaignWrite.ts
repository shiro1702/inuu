import { createError, type H3Event } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import type { EditorialStorySlide } from '~/server/utils/ai/editorialParseSchema'

export type StorySlideInput = {
  mediaUrl: string
  durationSeconds?: number
  actionType?: string
  actionPayload?: Record<string, unknown>
  sortOrder?: number
}

export type CreateStoryCampaignArgs = {
  cityId: string
  shopId: string
  title: string
  previewUrl?: string | null
  linkUrl?: string | null
  placement?: 'top_bar' | 'catalog_grid' | 'home_hero'
  isActive?: boolean
  validFrom?: string | null
  validUntil?: string | null
  authorType?: 'editorial' | 'venue' | 'organization'
  slides: StorySlideInput[]
}

function normalizeStoryActionType(raw: unknown): string {
  const s = typeof raw === 'string' ? raw : 'none'
  if (['open_url', 'open_venue', 'open_event', 'none'].includes(s)) return s
  return 'none'
}

export async function createStoryCampaign(
  event: H3Event,
  args: CreateStoryCampaignArgs,
): Promise<{ campaignId: string }> {
  const client = await serverSupabaseServiceRole(event)
  const title = args.title.trim()
  if (title.length < 2) {
    throw createError({ statusCode: 400, statusMessage: 'Story title is required' })
  }

  const { data: campaign, error: insErr } = await client
    .from('story_campaigns')
    .insert({
      city_id: args.cityId,
      shop_id: args.shopId,
      author_type: args.authorType || 'organization',
      title,
      preview_url: args.previewUrl?.trim() || null,
      placement:
        args.placement === 'catalog_grid'
          ? 'catalog_grid'
          : args.placement === 'home_hero'
            ? 'home_hero'
            : 'top_bar',
      link_url: args.linkUrl?.trim() || null,
      is_active: args.isActive !== false,
      valid_from: args.validFrom ?? new Date().toISOString(),
      valid_until: args.validUntil ?? null,
      targeting: {},
    } as any)
    .select('id')
    .single()

  if (insErr || !campaign?.id) {
    throw createError({
      statusCode: 500,
      statusMessage: insErr?.message || 'Failed to create story campaign',
    })
  }

  const campaignId = String(campaign.id)
  const slides = args.slides.filter((s) => s.mediaUrl?.trim())

  if (slides.length) {
    const rows = slides.map((s, idx) => ({
      campaign_id: campaignId,
      sort_order: typeof s.sortOrder === 'number' ? s.sortOrder : idx,
      media_url: s.mediaUrl.trim(),
      duration_seconds:
        typeof s.durationSeconds === 'number' && s.durationSeconds >= 1
          ? Math.min(120, s.durationSeconds)
          : 5,
      action_type: normalizeStoryActionType(s.actionType),
      action_payload: s.actionPayload && typeof s.actionPayload === 'object' ? s.actionPayload : {},
    }))

    const { error: slideErr } = await client.from('story_slides').insert(rows)
    if (slideErr) {
      await client.from('story_campaigns').delete().eq('id', campaignId)
      throw createError({
        statusCode: 500,
        statusMessage: slideErr.message || 'Failed to create story slides',
      })
    }
  }

  return { campaignId }
}

export function slidesFromEditorialStory(
  slides: EditorialStorySlide[],
  fallbackMediaUrls: string[],
): StorySlideInput[] {
  const fromStory = slides
    .filter((s) => s.media_url?.trim())
    .map((s, idx) => ({
      mediaUrl: s.media_url,
      durationSeconds: s.duration_seconds,
      actionType: s.action_type,
      actionPayload: s.action_payload as Record<string, unknown>,
      sortOrder: idx,
    }))

  if (fromStory.length) return fromStory

  return fallbackMediaUrls.map((url, idx) => ({
    mediaUrl: url,
    durationSeconds: 5,
    actionType: 'none' as const,
    sortOrder: idx,
  }))
}
