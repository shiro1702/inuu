import { createError, type H3Event } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import { ensureCityContentTags, ensureCityEventCategory } from '~/server/utils/cityContentTaxonomy'
import { buildEditorialBodyJson } from '~/server/utils/editorialBodyJson'
import { createEditorialStoryTeaser } from '~/server/utils/editorialStoryTeaser'
import type { ManagerCityScope } from '~/server/utils/managerCityAccess'

export type EditorialDashboardInput = {
  title?: string
  body?: string
  excerpt?: string | null
  coverMediaUrl?: string | null
  publishNow?: boolean
  isPublished?: boolean
  topicTags?: string[]
  categorySlug?: string | null
}

export type EditorialDashboardItem = {
  id: string
  slug: string
  title: string
  excerpt: string | null
  body: string
  body_json?: unknown
  cover_media_url: string | null
  topic_tags: string[] | null
  category_slug: string | null
  post_type: string | null
  linked_entity_type: string | null
  linked_entity_id: string | null
  is_published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
  metadata?: Record<string, unknown> | null
}

export const editorialDashboardSelectFields =
  'id,slug,title,excerpt,body,body_json,cover_media_url,topic_tags,category_slug,post_type,linked_entity_type,linked_entity_id,is_published,published_at,created_at,updated_at,metadata'

function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-zа-я0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    .slice(0, 90)
}

export function generateEditorialPostSlug(title: string): string {
  const slugBase = slugify(title) || `news-${Date.now()}`
  return `${slugBase}-${Date.now().toString().slice(-5)}`
}

export function resolvePublishState(
  input: EditorialDashboardInput,
  wasPublished: boolean,
): { isPublished: boolean; publishedAt: string | null } {
  const wantsPublish =
    input.isPublished === true || (input.isPublished !== false && input.publishNow === true)
  const wantsUnpublish = input.isPublished === false

  if (wantsUnpublish) {
    return { isPublished: false, publishedAt: null }
  }
  if (wantsPublish) {
    return { isPublished: true, publishedAt: new Date().toISOString() }
  }
  if (wasPublished) {
    return { isPublished: true, publishedAt: null }
  }
  return { isPublished: false, publishedAt: null }
}

export async function normalizeEditorialDashboardInput(
  event: H3Event,
  cityId: string,
  input: EditorialDashboardInput,
): Promise<{
  title: string
  body: string
  excerpt: string | null
  coverUrl: string | null
  topicTags: string[]
  categorySlug: string | null
  bodyJson: ReturnType<typeof buildEditorialBodyJson>
}> {
  const title = String(input.title || '').trim()
  const body = String(input.body || '').trim()
  if (title.length < 3 || body.length < 20) {
    throw createError({ statusCode: 400, statusMessage: 'Title/body are too short for editorial post' })
  }

  const topicTags = Array.isArray(input.topicTags)
    ? await ensureCityContentTags(event, cityId, input.topicTags)
    : []
  const categorySlug = input.categorySlug
    ? await ensureCityEventCategory(event, cityId, String(input.categorySlug))
    : null
  const coverUrl = input.coverMediaUrl ? String(input.coverMediaUrl).trim() : null

  return {
    title,
    body,
    excerpt: input.excerpt ? String(input.excerpt).trim() : null,
    coverUrl,
    topicTags,
    categorySlug,
    bodyJson: buildEditorialBodyJson({
      descriptionFull: body,
      coverUrl,
    }),
  }
}

export function editorialPublicPath(citySlug: string, postSlug: string): string {
  return `/${citySlug}/guides/${postSlug}`
}

export async function maybeCreateEditorialStoryTeaser(
  event: H3Event,
  scope: ManagerCityScope,
  args: {
    postSlug: string
    title: string
    coverUrl: string | null
    excerpt: string | null
    isFirstPublish: boolean
    isPublished: boolean
  },
): Promise<void> {
  if (!args.isPublished || !args.isFirstPublish || !scope.primaryShopId) return
  await createEditorialStoryTeaser(event, {
    cityId: scope.cityId,
    citySlug: scope.citySlug,
    shopId: scope.primaryShopId,
    postSlug: args.postSlug,
    title: args.title,
    previewUrl: args.coverUrl,
    excerpt: args.excerpt,
  }).catch((err) => console.warn('[editorial-news] story teaser failed:', err))
}

export async function insertEditorialPost(
  event: H3Event,
  scope: ManagerCityScope,
  input: EditorialDashboardInput,
): Promise<EditorialDashboardItem> {
  const normalized = await normalizeEditorialDashboardInput(event, scope.cityId, input)
  const { isPublished, publishedAt } = resolvePublishState(input, false)
  const postSlug = generateEditorialPostSlug(normalized.title)

  const client = await serverSupabaseServiceRole(event)
  const { data, error } = await client
    .from('editorial_posts')
    .insert({
      city_id: scope.cityId,
      shop_id: scope.primaryShopId,
      slug: postSlug,
      title: normalized.title,
      body: normalized.body,
      body_json: normalized.bodyJson,
      excerpt: normalized.excerpt,
      cover_media_url: normalized.coverUrl,
      topic_tags: normalized.topicTags,
      category_slug: normalized.categorySlug,
      is_published: isPublished,
      published_at: publishedAt,
      updated_at: new Date().toISOString(),
    } as any)
    .select(editorialDashboardSelectFields)
    .maybeSingle()

  if (error || !data?.id) {
    throw createError({ statusCode: 500, statusMessage: error?.message || 'Failed to create editorial post' })
  }

  await maybeCreateEditorialStoryTeaser(event, scope, {
    postSlug: String(data.slug),
    title: normalized.title,
    coverUrl: normalized.coverUrl,
    excerpt: normalized.excerpt,
    isFirstPublish: true,
    isPublished,
  })

  return data as EditorialDashboardItem
}

export async function updateEditorialPost(
  event: H3Event,
  scope: ManagerCityScope,
  postId: string,
  input: EditorialDashboardInput,
): Promise<{ item: EditorialDashboardItem; publicPath: string | null }> {
  const client = await serverSupabaseServiceRole(event)
  const { data: existing, error: loadError } = await client
    .from('editorial_posts')
    .select(`${editorialDashboardSelectFields}`)
    .eq('id', postId)
    .eq('city_id', scope.cityId)
    .maybeSingle()

  if (loadError) {
    throw createError({ statusCode: 500, statusMessage: loadError.message || 'Failed to load editorial post' })
  }
  if (!existing?.id) {
    throw createError({ statusCode: 404, statusMessage: 'Editorial post not found' })
  }

  const wasPublished = Boolean((existing as any).is_published)
  const mergedInput: EditorialDashboardInput = {
    title: input.title ?? (existing as any).title,
    body: input.body ?? (existing as any).body,
    excerpt: input.excerpt !== undefined ? input.excerpt : (existing as any).excerpt,
    coverMediaUrl:
      input.coverMediaUrl !== undefined ? input.coverMediaUrl : (existing as any).cover_media_url,
    topicTags: input.topicTags ?? (existing as any).topic_tags ?? [],
    categorySlug:
      input.categorySlug !== undefined ? input.categorySlug : (existing as any).category_slug,
    publishNow: input.publishNow,
    isPublished: input.isPublished,
  }

  const normalized = await normalizeEditorialDashboardInput(event, scope.cityId, mergedInput)
  const { isPublished, publishedAt } = resolvePublishState(input, wasPublished)

  let nextPublishedAt: string | null = (existing as any).published_at ?? null
  if (isPublished && !wasPublished) {
    nextPublishedAt = publishedAt ?? new Date().toISOString()
  } else if (!isPublished) {
    nextPublishedAt = null
  } else if (publishedAt) {
    nextPublishedAt = publishedAt
  }

  const { data, error } = await client
    .from('editorial_posts')
    .update({
      title: normalized.title,
      body: normalized.body,
      body_json: normalized.bodyJson,
      excerpt: normalized.excerpt,
      cover_media_url: normalized.coverUrl,
      topic_tags: normalized.topicTags,
      category_slug: normalized.categorySlug,
      is_published: isPublished,
      published_at: nextPublishedAt,
      updated_at: new Date().toISOString(),
    } as any)
    .eq('id', postId)
    .eq('city_id', scope.cityId)
    .select(editorialDashboardSelectFields)
    .maybeSingle()

  if (error || !data?.id) {
    throw createError({ statusCode: 500, statusMessage: error?.message || 'Failed to update editorial post' })
  }

  const isFirstPublish = isPublished && !wasPublished
  await maybeCreateEditorialStoryTeaser(event, scope, {
    postSlug: String(data.slug),
    title: normalized.title,
    coverUrl: normalized.coverUrl,
    excerpt: normalized.excerpt,
    isFirstPublish,
    isPublished,
  })

  return {
    item: data as EditorialDashboardItem,
    publicPath: isPublished ? editorialPublicPath(scope.citySlug, String(data.slug)) : null,
  }
}

export async function listEditorialPostsForManager(
  event: H3Event,
  cityId: string,
  options: { status?: string; page?: number; limit?: number },
): Promise<{ items: EditorialDashboardItem[]; page: number; pageSize: number; total: number; totalPages: number }> {
  const page = Math.max(1, options.page || 1)
  const pageSize = Math.min(50, Math.max(1, options.limit || 20))
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  const status = (options.status || 'all').trim()

  const client = await serverSupabaseServiceRole(event)
  let q = client
    .from('editorial_posts')
    .select(editorialDashboardSelectFields, { count: 'exact' })
    .eq('city_id', cityId)
    .order('updated_at', { ascending: false })

  if (status === 'published') q = q.eq('is_published', true)
  else if (status === 'draft') q = q.eq('is_published', false)

  const { data, count, error } = await q.range(from, to)
  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message || 'Failed to list editorial posts' })
  }

  const total = count ?? 0
  return {
    items: (data ?? []) as EditorialDashboardItem[],
    page,
    pageSize,
    total,
    totalPages: total ? Math.ceil(total / pageSize) : 0,
  }
}

export async function getEditorialPostForManager(
  event: H3Event,
  cityId: string,
  postId: string,
): Promise<EditorialDashboardItem> {
  const client = await serverSupabaseServiceRole(event)
  const { data, error } = await client
    .from('editorial_posts')
    .select(editorialDashboardSelectFields)
    .eq('id', postId)
    .eq('city_id', cityId)
    .maybeSingle()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message || 'Failed to load editorial post' })
  }
  if (!data?.id) {
    throw createError({ statusCode: 404, statusMessage: 'Editorial post not found' })
  }
  return data as EditorialDashboardItem
}
