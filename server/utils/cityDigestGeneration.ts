import type { H3Event } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import {
  resolvePeriodListMeta,
  upsertCuratedListBySlug,
  upsertCuratedListForPeriod,
} from '~/server/utils/curatedListPeriod'
import {
  buildCustomCuratedSlug,
  resolveWeeklyDigestWindow,
  selectCuratedEvents,
  syncCuratedListEvents,
  type CuratedTagMode,
} from '~/server/utils/curatedListSelection'
import { generateCuratedListCopy } from '~/server/utils/ai/groqCuratedListCopy'
import { sendCuratedListDraftNotification } from '~/server/utils/inuuContentBot'

export type CityDigestGenerateInput = {
  mode: 'weekly' | 'custom'
  cityId?: string
  citySlug?: string
  categorySlug?: string
  topicTags?: string[]
  tagsMode?: CuratedTagMode
  limit?: number
  minScore?: number
  botToken?: string
}

function parseTags(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value
    .map((tag) => String(tag || '').trim().toLowerCase())
    .filter(Boolean)
}

export async function runCityDigestGeneration(
  event: H3Event,
  input: CityDigestGenerateInput,
) {
  const config = useRuntimeConfig(event)
  const client = await serverSupabaseServiceRole(event)
  const mode = input.mode === 'custom' ? 'custom' : 'weekly'
  const defaultLimit = Math.min(20, Math.max(3, Number((config as any).cronCityDigestLimit || 12)))
  const limit = Math.min(20, Math.max(3, Number(input.limit) || defaultLimit))
  const rawMinScore = input.minScore ?? (config as any).cronCityDigestMinScore ?? 4
  const minScore = Math.max(1, Math.min(5, Number(rawMinScore)))
  const tagsMode: CuratedTagMode = input.tagsMode === 'and' ? 'and' : 'or'
  const topicTags = parseTags(input.topicTags)
  const botToken = String(input.botToken || (config as any).botToken || '').trim()

  let request = client
    .from('cities')
    .select('id,slug,name,timezone,is_active')
    .eq('is_active', true)
  if (input.cityId) request = request.eq('id', input.cityId)
  if (input.citySlug) request = request.eq('slug', input.citySlug)

  const { data: cities, error: cityError } = await request
  if (cityError) {
    throw new Error(cityError.message || 'Failed to load cities')
  }

  const summary = {
    ok: true as const,
    mode,
    processed: 0,
    createdOrUpdated: 0,
    skipped: 0,
    errors: [] as Array<{ city: string; error: string }>,
    lists: [] as Array<{ city: string; slug: string; events: number }>,
    notifications: [] as Array<{ city: string; slug: string; sent: number; targets: number; reason?: string }>,
  }

  for (const city of cities || []) {
    try {
      const cityId = String((city as any).id)
      const citySlug = String((city as any).slug || '')
      const cityName = String((city as any).name || citySlug)
      const timezone = String((city as any).timezone || 'Asia/Irkutsk')
      const weeklyWindow = resolveWeeklyDigestWindow(timezone)

      const selected = await selectCuratedEvents(event, {
        cityId,
        dateFrom: weeklyWindow.dateFrom,
        dateTo: weeklyWindow.dateTo,
        minEditorialScore: minScore,
        limit,
        categorySlug: input.categorySlug || null,
        topicTags,
        tagsMode,
      })

      if (!selected.length) {
        summary.skipped += 1
        summary.processed += 1
        continue
      }

      const copy = await generateCuratedListCopy({
        mode,
        cityName,
        dateFrom: weeklyWindow.dateFrom,
        dateTo: weeklyWindow.dateTo,
        events: selected.map((row) => ({
          title: String(row.title || ''),
          starts_at: String(row.starts_at || ''),
          category: null,
        })),
      })

      let listId = ''
      let slug = ''
      if (mode === 'weekly') {
        const meta = resolvePeriodListMeta({ period: 'week', timeZone: timezone })
        const upserted = await upsertCuratedListForPeriod(event, {
          cityId,
          meta: { ...meta, title: copy.title },
          description: copy.description,
          publish: false,
          selectionMode: 'weekly',
          sourceMetadata: {
            selection_mode: 'weekly',
            filters: {
              min_editorial_score: minScore,
              limit,
              date_from: weeklyWindow.dateFrom,
              date_to: weeklyWindow.dateTo,
            },
            llm_model: copy.model,
          },
        })
        listId = upserted.listId
        slug = upserted.slug
      } else {
        const customSlug = buildCustomCuratedSlug({
          categorySlug: input.categorySlug || null,
          topicTags,
          tagsMode,
        })
        const upserted = await upsertCuratedListBySlug(event, {
          cityId,
          slug: customSlug,
          title: copy.title,
          description: copy.description,
          publish: false,
          sortOrder: 15,
          sourceMetadata: {
            selection_mode: 'custom',
            filters: {
              min_editorial_score: minScore,
              limit,
              category_slug: input.categorySlug || null,
              topic_tags: topicTags,
              tags_mode: tagsMode,
              date_from: weeklyWindow.dateFrom,
              date_to: weeklyWindow.dateTo,
            },
            llm_model: copy.model,
          },
        })
        listId = upserted.listId
        slug = upserted.slug
      }

      await syncCuratedListEvents(event, {
        listId,
        eventIds: selected.map((row) => row.id),
      })

      if (botToken) {
        const notifyResult = await sendCuratedListDraftNotification(event, {
          botToken,
          cityId,
          cityName,
          slug,
          mode,
        }).catch((err) => {
          console.error('[cityDigestGeneration] notify failed:', err)
          return { sent: 0, targets: 0, reason: err instanceof Error ? err.message : 'notify_failed' }
        })
        summary.notifications.push({
          city: citySlug,
          slug,
          sent: notifyResult.sent,
          targets: notifyResult.targets,
          reason: notifyResult.reason,
        })
        if (notifyResult.targets > 0 && notifyResult.sent === 0) {
          summary.errors.push({
            city: citySlug,
            error: `notification_failed_for_all_targets (${notifyResult.targets})`,
          })
        }
      } else {
        summary.notifications.push({
          city: citySlug,
          slug,
          sent: 0,
          targets: 0,
          reason: 'bot_token_missing',
        })
      }

      summary.createdOrUpdated += 1
      summary.processed += 1
      summary.lists.push({ city: citySlug, slug, events: selected.length })
    } catch (err) {
      summary.errors.push({
        city: String((city as any).slug || (city as any).id || 'unknown'),
        error: err instanceof Error ? err.message : 'unknown_error',
      })
      summary.processed += 1
    }
  }

  return summary
}
