import { createError, defineEventHandler, readBody } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import { resolveManagerCityScopeOrThrow } from '~/server/utils/managerCityAccess'

type Body = {
  title?: string | null
  description?: string | null
  categorySlug?: string | null
  registrationUrl?: string | null
  topicTags?: string[]
}

export default defineEventHandler(async (event) => {
  const slug = typeof event.context.params?.slug === 'string' ? event.context.params.slug : ''
  const id = typeof event.context.params?.id === 'string' ? event.context.params.id : ''
  const scope = await resolveManagerCityScopeOrThrow(event, slug)
  if (!id.trim()) throw createError({ statusCode: 400, statusMessage: 'Submission id is required' })

  const body = await readBody<Body>(event).catch(() => ({}))
  const client = await serverSupabaseServiceRole(event)
  const { data: current, error: currentError } = await client
    .from('content_submissions')
    .select('id,city_id,payload')
    .eq('id', id)
    .eq('city_id', scope.cityId)
    .maybeSingle()

  if (currentError || !current?.id) {
    throw createError({ statusCode: 404, statusMessage: 'Submission not found in manager city scope' })
  }

  const payload = { ...((current as any).payload || {}) } as any
  if (typeof body.title === 'string') payload.title = body.title.trim()
  if (typeof body.description === 'string') payload.description = body.description.trim()
  if (typeof body.categorySlug === 'string') payload.category_slug = body.categorySlug.trim()
  if (typeof body.registrationUrl === 'string') payload.registration_url = body.registrationUrl.trim()
  if (Array.isArray(body.topicTags)) {
    payload.topic_tags = Array.from(new Set(body.topicTags.map((x) => String(x || '').trim()).filter(Boolean))).slice(0, 8)
  }

  const { data, error } = await client
    .from('content_submissions')
    .update({ payload } as any)
    .eq('id', id)
    .eq('city_id', scope.cityId)
    .select('id,status,payload,updated_at')
    .maybeSingle()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message || 'Failed to update submission payload' })
  }

  return { ok: true as const, item: data || null }
})
