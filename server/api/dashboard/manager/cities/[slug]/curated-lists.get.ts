import { defineEventHandler } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import { resolveManagerCityScopeOrThrow } from '~/server/utils/managerCityAccess'

export default defineEventHandler(async (event) => {
  const slugParam = typeof event.context.params?.slug === 'string' ? event.context.params.slug : ''
  const scope = await resolveManagerCityScopeOrThrow(event, slugParam)
  const client = await serverSupabaseServiceRole(event)

  const { data, error } = await client
    .from('curated_lists')
    .select('id,slug,title,description,topic_tags,updated_at')
    .eq('city_id', scope.cityId)
    .eq('is_published', true)
    .order('updated_at', { ascending: false })
    .limit(80)

  if (error) {
    return {
      ok: false as const,
      items: [],
      message: error.message,
    }
  }

  const items = (data ?? []).map((row) => ({
    id: String((row as { id: string }).id),
    slug: String((row as { slug: string }).slug),
    title: String((row as { title: string }).title || (row as { slug: string }).slug),
    description:
      typeof (row as { description?: string | null }).description === 'string'
        ? (row as { description: string }).description
        : null,
    topicTags: Array.isArray((row as { topic_tags?: string[] }).topic_tags)
      ? (row as { topic_tags: string[] }).topic_tags.map(String)
      : [],
  }))

  return { ok: true as const, items }
})
