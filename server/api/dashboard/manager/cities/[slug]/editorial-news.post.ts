import { createError, defineEventHandler, readBody } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import { resolveManagerCityScopeOrThrow } from '~/server/utils/managerCityAccess'
import { ensureCityContentTags, ensureCityEventCategory } from '~/server/utils/cityContentTaxonomy'

type Body = {
  title?: string
  body?: string
  excerpt?: string | null
  coverMediaUrl?: string | null
  publishNow?: boolean
  topicTags?: string[]
  categorySlug?: string | null
}

function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-zа-я0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    .slice(0, 90)
}

export default defineEventHandler(async (event) => {
  const slugParam = typeof event.context.params?.slug === 'string' ? event.context.params.slug : ''
  const scope = await resolveManagerCityScopeOrThrow(event, slugParam)
  const body = await readBody<Body>(event).catch(() => ({}))

  const title = String(body.title || '').trim()
  const text = String(body.body || '').trim()
  if (title.length < 3 || text.length < 20) {
    throw createError({ statusCode: 400, statusMessage: 'Title/body are too short for editorial post' })
  }

  const slugBase = slugify(title) || `news-${Date.now()}`
  const postSlug = `${slugBase}-${Date.now().toString().slice(-5)}`
  const publishNow = body.publishNow === true
  const topicTags = Array.isArray(body.topicTags)
    ? await ensureCityContentTags(event, scope.cityId, body.topicTags)
    : []
  const categorySlug = body.categorySlug
    ? await ensureCityEventCategory(event, scope.cityId, String(body.categorySlug))
    : null

  const payload = {
    city_id: scope.cityId,
    shop_id: scope.primaryShopId,
    slug: postSlug,
    title,
    body: text,
    excerpt: body.excerpt ? String(body.excerpt).trim() : null,
    cover_media_url: body.coverMediaUrl ? String(body.coverMediaUrl).trim() : null,
    topic_tags: topicTags,
    category_slug: categorySlug,
    is_published: publishNow,
    published_at: publishNow ? new Date().toISOString() : null,
  }

  const client = await serverSupabaseServiceRole(event)
  const { data, error } = await client
    .from('editorial_posts')
    .insert(payload as any)
    .select('id,slug,title,is_published,published_at')
    .maybeSingle()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message || 'Failed to create editorial post' })
  }

  return {
    ok: true as const,
    city: {
      id: scope.cityId,
      slug: scope.citySlug,
      name: scope.cityName,
    },
    item: data || null,
  }
})
