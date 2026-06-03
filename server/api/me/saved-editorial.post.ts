import { createError, defineEventHandler, readBody } from 'h3'
import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'

type Body = {
  postId?: string
  action?: 'save' | 'unsave'
}

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

  const body = await readBody<Body>(event).catch(() => ({}))
  const postId = typeof body?.postId === 'string' ? body.postId.trim() : ''
  const action = body?.action === 'unsave' ? 'unsave' : body?.action === 'save' ? 'save' : null

  if (!postId || !action) {
    throw createError({ statusCode: 400, statusMessage: 'postId and action (save|unsave) are required' })
  }

  const client = await serverSupabaseServiceRole(event)
  const { data: post } = await client
    .from('editorial_posts')
    .select('id,is_published')
    .eq('id', postId)
    .maybeSingle()

  if (!post?.id || !(post as any).is_published) {
    throw createError({ statusCode: 404, statusMessage: 'Editorial post not found' })
  }

  if (action === 'unsave') {
    await client
      .from('user_saved_editorial')
      .delete()
      .eq('user_id', userId)
      .eq('editorial_post_id', postId)

    const { count } = await client
      .from('user_saved_editorial')
      .select('editorial_post_id', { count: 'exact', head: true })
      .eq('editorial_post_id', postId)

    await client
      .from('editorial_posts')
      .update({ read_later_count: count ?? 0 } as any)
      .eq('id', postId)

    return { ok: true as const, saved: false }
  }

  const { error: upsertError } = await client.from('user_saved_editorial').upsert(
    {
      user_id: userId,
      editorial_post_id: postId,
      saved_at: new Date().toISOString(),
      read_status: 'saved',
    },
    { onConflict: 'user_id,editorial_post_id' },
  )

  if (upsertError) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to save editorial post' })
  }

  const { count } = await client
    .from('user_saved_editorial')
    .select('editorial_post_id', { count: 'exact', head: true })
    .eq('editorial_post_id', postId)

  await client
    .from('editorial_posts')
    .update({ read_later_count: count ?? 0 } as any)
    .eq('id', postId)

  return { ok: true as const, saved: true }
})
