import { createError, defineEventHandler, readBody, setResponseHeader } from 'h3'
import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'
import { resolveCityBySlug } from '~/server/utils/inuuCity'

type Body = {
  depth?: number
  sessionKey?: string
}

function normalizeUserId(raw: unknown): string | null {
  if (!raw || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>
  if (typeof o.id === 'string' && o.id) return o.id
  if (typeof o.sub === 'string' && o.sub) return o.sub
  return null
}

export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'Cache-Control', 'no-store')

  const slug = typeof event.context.params?.slug === 'string' ? event.context.params.slug : ''
  const postSlug = typeof event.context.params?.postSlug === 'string' ? event.context.params.postSlug : ''
  const city = await resolveCityBySlug(event, slug)
  const body = await readBody<Body>(event).catch(() => ({}))

  const depth = Number(body?.depth)
  if (depth !== 50 && depth !== 100) {
    throw createError({ statusCode: 400, statusMessage: 'depth must be 50 or 100' })
  }

  const client = await serverSupabaseServiceRole(event)
  const { data: post } = await client
    .from('editorial_posts')
    .select('id')
    .eq('city_id', city.id)
    .eq('slug', postSlug)
    .eq('is_published', true)
    .maybeSingle()

  if (!post?.id) {
    throw createError({ statusCode: 404, statusMessage: 'Editorial post not found' })
  }

  const supabaseUser = await serverSupabaseUser(event)
  const userId = normalizeUserId(supabaseUser)
  const sessionKey = typeof body?.sessionKey === 'string' ? body.sessionKey.trim().slice(0, 120) : null

  const { error } = await client.from('editorial_scroll_events').insert({
    editorial_post_id: post.id,
    city_id: city.id,
    depth_percent: depth,
    user_id: userId,
    session_key: sessionKey,
  })

  if (error) {
    console.error('[editorial/scroll] insert failed:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to record scroll depth' })
  }

  return { ok: true as const }
})
