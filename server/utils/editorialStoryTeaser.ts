import type { H3Event } from 'h3'
import { createStoryCampaign, type StorySlideInput } from '~/server/utils/storyCampaignWrite'
import type { CarouselSlide } from '~/types/editorialCarousel'

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
    slides?: StorySlideInput[]
  },
): Promise<{ campaignId: string } | null> {
  const cover = args.previewUrl?.trim()
  const guidePath = `/${args.citySlug}/guides/${args.postSlug}`
  const slideTitle = args.excerpt?.trim() || args.title

  if (args.slides?.length) {
    return createStoryCampaign(event, {
      cityId: args.cityId,
      shopId: args.shopId,
      title: slideTitle.slice(0, 120),
      previewUrl: args.slides[0]?.mediaUrl || cover || null,
      placement: 'top_bar',
      isActive: true,
      authorType: 'editorial',
      linkUrl: guidePath,
      slides: args.slides.map((s) => ({
        ...s,
        actionType: s.actionType || 'open_url',
        actionPayload: {
          ...(s.actionPayload || {}),
          url: guidePath,
        },
      })),
    })
  }

  if (!cover) return null

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
        actionPayload: { url: guidePath, title: slideTitle.slice(0, 80) },
      },
    ],
  })
}

export async function createEditorialStoryPendingCampaign(
  event: H3Event,
  args: {
    cityId: string
    citySlug: string
    shopId: string
    postSlug: string
    title: string
    previewUrl?: string | null
    excerpt?: string | null
    slideDraft: CarouselSlide[]
  },
): Promise<{ campaignId: string }> {
  const guidePath = `/${args.citySlug}/guides/${args.postSlug}`
  const slideTitle = args.excerpt?.trim() || args.title

  return createStoryCampaign(event, {
    cityId: args.cityId,
    shopId: args.shopId,
    title: slideTitle.slice(0, 120),
    previewUrl: args.previewUrl?.trim() || null,
    placement: 'top_bar',
    isActive: true,
    authorType: 'editorial',
    linkUrl: guidePath,
    slides: [],
    targeting: {
      pending_render: true,
      slide_draft: args.slideDraft,
      guide_path: guidePath,
      editorial_post_slug: args.postSlug,
    },
  })
}
