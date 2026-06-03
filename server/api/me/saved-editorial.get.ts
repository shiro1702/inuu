import { createError, defineEventHandler } from 'h3'
import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'
import { editorialListSelectFields } from '~/server/utils/editorialPublic'

function normalizeUserId(raw: unknown): string | null {
  if (!raw || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>
  if (typeof o.id === 'string' && o.id) return o.id
  if (typeof o.sub === 'string' && o.sub) return o.sub
  return null
}

export default defineEventHandler(async (event) => {
  const supabaseUser = await serverSupabaseUser(event)
  const userId = normalizeUserId(supabaseUser)
  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const client = await serverSupabaseServiceRole(event)
  const { data: saves, error: savesError } = await client
    .from('user_saved_editorial')
    .select('editorial_post_id,saved_at,read_status')
    .eq('user_id', userId)
    .order('saved_at', { ascending: false })
    .limit(100)

  if (savesError) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to load saved editorial' })
  }

  const postIds = (saves ?? []).map((s) => String((s as any).editorial_post_id))
  if (!postIds.length) {
    return { ok: true as const, items: [] }
  }

  const { data: posts, error: postsError } = await client
    .from('editorial_posts')
    .select(`${editorialListSelectFields()},city_id`)
    .in('id', postIds)
    .eq('is_published', true)

  if (postsError) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to load editorial posts' })
  }

  const postById = new Map((posts ?? []).map((p) => [String((p as any).id), p]))
  const items = (saves ?? [])
    .map((save) => {
      const post = postById.get(String((save as any).editorial_post_id))
      if (!post) return null
      return {
        saved_at: (save as any).saved_at,
        read_status: (save as any).read_status,
        post,
      }
    })
    .filter(Boolean)

  return { ok: true as const, items }
})
