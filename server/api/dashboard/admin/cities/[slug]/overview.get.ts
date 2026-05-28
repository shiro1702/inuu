import { createError, defineEventHandler } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import { requirePlatformAdminAccess } from '~/server/utils/dashboardGlobal'

export default defineEventHandler(async (event) => {
  const admin = await requirePlatformAdminAccess(event)
  const slug = typeof event.context.params?.slug === 'string' ? event.context.params.slug.trim() : ''
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'City slug is required' })
  }

  const client = await serverSupabaseServiceRole(event)
  const { data: city, error: cityError } = await client
    .from('cities')
    .select('id,name,slug,timezone,is_active,editorial_name')
    .eq('slug', slug)
    .maybeSingle()

  if (cityError) {
    throw createError({ statusCode: 500, statusMessage: cityError.message || 'Failed to load city' })
  }
  if (!city?.id) {
    throw createError({ statusCode: 404, statusMessage: 'City not found' })
  }

  const cityId = String(city.id)
  const [shopsRes, membersRes, venuesRes, eventsRes, postsRes, storiesRes, logsRes] = await Promise.all([
    client.from('shops').select('id,name,slug,is_active').eq('city_id', cityId),
    client
      .from('shop_members')
      .select('id,shop_id,user_id,role,shops!inner(city_id)')
      .eq('shops.city_id', cityId),
    client.from('venues').select('id,is_published,is_active').eq('city_id', cityId),
    client.from('events').select('id,is_published,starts_at').eq('city_id', cityId),
    client.from('editorial_posts').select('id,is_published,published_at').eq('city_id', cityId),
    client.from('story_campaigns').select('id,is_active,status').eq('city_id', cityId),
    client
      .from('ai_parse_logs')
      .select('id,status,created_at,city_slug')
      .eq('city_slug', slug)
      .order('created_at', { ascending: false })
      .limit(200),
  ])

  const shops = (shopsRes.data ?? []) as Array<{ id: string; name: string; slug: string; is_active: boolean }>
  const members = (membersRes.data ?? []) as Array<{ id: string; shop_id: string; user_id: string; role: string }>
  const venues = (venuesRes.data ?? []) as Array<{ id: string; is_published: boolean; is_active: boolean }>
  const events = (eventsRes.data ?? []) as Array<{ id: string; is_published: boolean; starts_at: string | null }>
  const posts = (postsRes.data ?? []) as Array<{ id: string; is_published: boolean; published_at: string | null }>
  const stories = (storiesRes.data ?? []) as Array<{ id: string; is_active: boolean; status: string | null }>
  const aiLogs = (logsRes.data ?? []) as Array<{ id: string; status: string | null; created_at: string | null }>
  const nowIso = new Date().toISOString()

  return {
    ok: true as const,
    admin: { userId: admin.userId, role: admin.role },
    city: {
      id: city.id,
      slug: city.slug,
      name: city.name,
      timezone: city.timezone,
      editorialName: city.editorial_name,
      isActive: city.is_active,
    },
    metrics: {
      shopsTotal: shops.length,
      shopsActive: shops.filter((x) => x.is_active).length,
      uniqueManagers: new Set(members.map((x) => x.user_id)).size,
      venuesTotal: venues.length,
      venuesPublished: venues.filter((x) => x.is_published && x.is_active).length,
      eventsTotal: events.length,
      eventsPublished: events.filter((x) => x.is_published).length,
      eventsUpcoming: events.filter((x) => x.is_published && typeof x.starts_at === 'string' && x.starts_at >= nowIso).length,
      editorialPostsTotal: posts.length,
      editorialPostsPublished: posts.filter((x) => x.is_published).length,
      activeStories: stories.filter((x) => x.is_active).length,
      aiParsesRecent: aiLogs.length,
      aiParsesSuccessRecent: aiLogs.filter((x) => ['success', 'persisted'].includes(String(x.status || ''))).length,
      aiParsesFailedRecent: aiLogs.filter((x) => ['failed', 'persist_failed'].includes(String(x.status || ''))).length,
    },
    shops: shops.map((x) => ({
      id: x.id,
      slug: x.slug,
      name: x.name,
      isActive: x.is_active,
      membersCount: members.filter((m) => m.shop_id === x.id).length,
      memberRoles: Array.from(new Set(members.filter((m) => m.shop_id === x.id).map((m) => m.role))),
    })),
  }
})
