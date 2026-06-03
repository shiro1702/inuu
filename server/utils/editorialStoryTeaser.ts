import type { H3Event } from 'h3'
import { createStoryCampaign } from '~/server/utils/storyCampaignWrite'

export async function createEditorialStoryTeaser(
  event: H3Event,
  args: {
    cityId: string
    citySlug: string
    shopId: string
    postSlug: string
    title: string
    previewUrl?: string | null
    excerpt?: string | null
  },
): Promise<{ campaignId: string } | null> {
  const cover = args.previewUrl?.trim()
  if (!cover) return null

  const guidePath = `/${args.citySlug}/guides/${args.postSlug}`
  const slideTitle = args.excerpt?.trim() || args.title

  return createStoryCampaign(event, {
    cityId: args.cityId,
    shopId: args.shopId,
    title: slideTitle.slice(0, 120),
    previewUrl: cover,
    placement: 'top_bar',
    isActive: true,
    authorType: 'editorial',
    linkUrl: guidePath,
    slides: [
      {
        mediaUrl: cover,
        durationSeconds: 6,
        actionType: 'open_url',
        actionPayload: { url: guidePath },
      },
    ],
  })
}
