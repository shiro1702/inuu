import { createError, type H3Event } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import type { EditorialCarouselMetadata } from '~/types/editorialCarousel'
import { mergeEditorialPostMetadata } from '~/server/utils/parseInstagramCarousel'

export async function saveEditorialPostCarouselMetadata(
  event: H3Event,
  args: {
    cityId: string
    postId: string
    carousel: EditorialCarouselMetadata
  },
): Promise<void> {
  const client = await serverSupabaseServiceRole(event)
  const { data: existing, error: loadErr } = await client
    .from('editorial_posts')
    .select('id,metadata')
    .eq('id', args.postId)
    .eq('city_id', args.cityId)
    .maybeSingle()

  if (loadErr) {
    throw createError({ statusCode: 500, statusMessage: loadErr.message || 'Failed to load post' })
  }
  if (!existing?.id) {
    throw createError({ statusCode: 404, statusMessage: 'Editorial post not found' })
  }

  const metadata = mergeEditorialPostMetadata((existing as { metadata?: unknown }).metadata, args.carousel)

  const { error: updErr } = await client
    .from('editorial_posts')
    .update({ metadata, updated_at: new Date().toISOString() } as any)
    .eq('id', args.postId)
    .eq('city_id', args.cityId)

  if (updErr) {
    throw createError({ statusCode: 500, statusMessage: updErr.message || 'Failed to save carousel' })
  }
}

export async function saveSubmissionCarouselDraft(
  event: H3Event,
  args: {
    cityId: string
    submissionId: string
    carousel: EditorialCarouselMetadata
  },
): Promise<void> {
  const client = await serverSupabaseServiceRole(event)
  const { data: row, error: loadErr } = await client
    .from('content_submissions')
    .select('id,payload')
    .eq('id', args.submissionId)
    .eq('city_id', args.cityId)
    .maybeSingle()

  if (loadErr) {
    throw createError({ statusCode: 500, statusMessage: loadErr.message || 'Failed to load submission' })
  }
  if (!row?.id) {
    throw createError({ statusCode: 404, statusMessage: 'Submission not found' })
  }

  const payload =
    row.payload && typeof row.payload === 'object' && !Array.isArray(row.payload)
      ? { ...(row.payload as Record<string, unknown>) }
      : {}

  payload.carousel_metadata = args.carousel

  const { error: updErr } = await client
    .from('content_submissions')
    .update({ payload, updated_at: new Date().toISOString() } as any)
    .eq('id', args.submissionId)

  if (updErr) {
    throw createError({ statusCode: 500, statusMessage: updErr.message || 'Failed to save carousel draft' })
  }
}
