import { defineEventHandler, getQuery, setResponseHeader } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import { resolveCityBySlug } from '~/server/utils/inuuCity'

const DEFAULT_PAGE_SIZE = 12
const MAX_PAGE_SIZE = 24

export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'Cache-Control', 'public, max-age=60, s-maxage=120, stale-while-revalidate=300')

  const slug = typeof event.context.params?.slug === 'string' ? event.context.params.slug : ''
  const city = await resolveCityBySlug(event, slug)
  const query = getQuery(event)

  const page = Math.max(1, Number(query.page) || 1)
  const pageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, Number(query.limit) || DEFAULT_PAGE_SIZE))
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const client = await serverSupabaseServiceRole(event)
  const { data, count, error } = await client
    .from('curated_lists')
    .select('id,slug,title,description,sort_order,created_at', { count: 'exact' })
    .eq('city_id', city.id)
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) {
    console.error('[lists/index] load failed:', error)
    return {
      ok: false,
      items: [],
      page,
      pageSize,
      total: 0,
      totalPages: 0,
    }
  }

  const total = count ?? 0
  const totalPages = total ? Math.ceil(total / pageSize) : 0

  return {
    ok: true,
    items: data ?? [],
    page,
    pageSize,
    total,
    totalPages,
  }
})
