import { defineEventHandler } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import { resolveManagerCityScopeOrThrow } from '~/server/utils/managerCityAccess'

type ContentOpsSettings = {
  telegram?: {
    manager_chat_id?: string
    moderation_chat_id?: string
    parser_source_chats?: string[]
  }
  max?: {
    manager_chat_id?: string
    moderation_chat_id?: string
    parser_source_chats?: string[]
  }
}

export default defineEventHandler(async (event) => {
  const slug = typeof event.context.params?.slug === 'string' ? event.context.params.slug : ''
  const scope = await resolveManagerCityScopeOrThrow(event, slug)
  const client = await serverSupabaseServiceRole(event)

  const { data, error } = await client
    .from('cities')
    .select('id,name,slug,content_ops_settings')
    .eq('id', scope.cityId)
    .maybeSingle()

  if (error || !data) {
    return { ok: false as const, message: error?.message || 'City settings not found' }
  }

  return {
    ok: true as const,
    city: {
      id: scope.cityId,
      slug: scope.citySlug,
      name: scope.cityName,
    },
    scope: {
      shopIds: scope.shopIds,
      primaryShopId: scope.primaryShopId,
    },
    settings: ((data as any).content_ops_settings || {}) as ContentOpsSettings,
  }
})
