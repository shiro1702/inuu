import { createError, type H3Event } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import { ensureCityContentTags, ensureCityEventCategory } from '~/server/utils/cityContentTaxonomy'

export type ContentSubmissionPayloadPatch = {
  title?: string | null
  description?: string | null
  categorySlug?: string | null
  registrationUrl?: string | null
  topicTags?: string[]
  editorialScore?: number | null
}

export async function patchContentSubmissionRecord(
  event: H3Event,
  args: { cityId: string; submissionId: string; body: ContentSubmissionPayloadPatch },
): Promise<Record<string, unknown>> {
  const client = await serverSupabaseServiceRole(event)
  const { data: current, error: currentError } = await client
    .from('content_submissions')
    .select('id,city_id,payload,editorial_score')
    .eq('id', args.submissionId)
    .eq('city_id', args.cityId)
    .maybeSingle()

  if (currentError || !current?.id) {
    throw createError({ statusCode: 404, statusMessage: 'Submission not found' })
  }

  const payload = { ...((current as any).payload || {}) } as Record<string, unknown>
  if (typeof args.body.title === 'string') payload.title = args.body.title.trim()
  if (typeof args.body.description === 'string') payload.description = args.body.description.trim()
  if (typeof args.body.categorySlug === 'string') {
    payload.category_slug = await ensureCityEventCategory(event, args.cityId, args.body.categorySlug.trim())
  }
  if (typeof args.body.registrationUrl === 'string') {
    payload.registration_url = args.body.registrationUrl.trim()
  }
  if (Array.isArray(args.body.topicTags)) {
    payload.topic_tags = await ensureCityContentTags(event, args.cityId, args.body.topicTags)
  }

  const rowPatch: Record<string, unknown> = {
    payload,
    updated_at: new Date().toISOString(),
  }
  if (args.body.editorialScore !== undefined) {
    const raw = args.body.editorialScore
    rowPatch.editorial_score =
      raw === null || raw === undefined
        ? null
        : Math.max(1, Math.min(5, Math.round(Number(raw))))
  }

  const { data, error } = await client
    .from('content_submissions')
    .update(rowPatch as any)
    .eq('id', args.submissionId)
    .eq('city_id', args.cityId)
    .select('id,kind,status,payload,editorial_score,source_kind,updated_at')
    .maybeSingle()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message || 'Failed to update submission' })
  }

  return (data || {}) as Record<string, unknown>
}
