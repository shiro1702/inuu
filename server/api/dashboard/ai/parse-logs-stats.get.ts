import { defineEventHandler, getQuery } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import { requireDashboardAccess } from '~/server/utils/dashboard'

type LogRow = {
  created_at: string | null
  source_kind: string | null
  status: string | null
  latency_ms: number | null
  prompt_tokens: number | null
  completion_tokens: number | null
  total_tokens: number | null
  confidence: number | null
  missing_fields_count: number | null
  error_message: string | null
}

function inc(map: Map<string, number>, key: string) {
  map.set(key, (map.get(key) || 0) + 1)
}

function avg(sum: number, count: number): number | null {
  if (!count) return null
  return Number((sum / count).toFixed(2))
}

export default defineEventHandler(async (event) => {
  await requireDashboardAccess(event)
  const query = getQuery(event)

  const sourceKind = typeof query.source_kind === 'string' ? query.source_kind.trim() : ''
  const citySlug = typeof query.city_slug === 'string' ? query.city_slug.trim() : ''
  const dateFrom = typeof query.date_from === 'string' ? query.date_from.trim() : ''
  const dateTo = typeof query.date_to === 'string' ? query.date_to.trim() : ''
  const limit = Math.min(Math.max(Number(query.limit) || 2000, 100), 10_000)

  const client = await serverSupabaseServiceRole(event)
  let db = client
    .from('ai_parse_logs')
    .select('created_at,source_kind,status,latency_ms,prompt_tokens,completion_tokens,total_tokens,confidence,missing_fields_count,error_message')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (sourceKind) db = db.eq('source_kind', sourceKind)
  if (citySlug) db = db.eq('city_slug', citySlug)
  if (dateFrom) db = db.gte('created_at', dateFrom)
  if (dateTo) db = db.lte('created_at', dateTo)

  const { data, error } = await db
  if (error) {
    console.error('[dashboard/ai/parse-logs-stats] load failed:', error)
    return {
      ok: false as const,
      message: error.message || 'Failed to load stats',
      totals: null,
      breakdown: null,
      daily: [],
      topErrors: [],
    }
  }

  const rows = (data ?? []) as LogRow[]
  const byStatus = new Map<string, number>()
  const bySource = new Map<string, number>()
  const byDay = new Map<string, { total: number; success: number; failed: number; tokens: number }>()
  const byError = new Map<string, number>()

  let successCount = 0
  let failedCount = 0
  let latencySum = 0
  let latencyCount = 0
  let confidenceSum = 0
  let confidenceCount = 0
  let missingFieldsSum = 0
  let missingFieldsCount = 0
  let promptTokensSum = 0
  let completionTokensSum = 0
  let totalTokensSum = 0

  for (const row of rows) {
    const status = (row.status || 'unknown').trim().toLowerCase()
    const source = (row.source_kind || 'unknown').trim().toLowerCase()
    inc(byStatus, status)
    inc(bySource, source)

    const isSuccess = status === 'success' || status === 'persisted'
    const isFailed = status === 'failed' || status === 'persist_failed'
    if (isSuccess) successCount += 1
    if (isFailed) failedCount += 1

    if (typeof row.latency_ms === 'number') {
      latencySum += row.latency_ms
      latencyCount += 1
    }
    if (typeof row.confidence === 'number') {
      confidenceSum += row.confidence
      confidenceCount += 1
    }
    if (typeof row.missing_fields_count === 'number') {
      missingFieldsSum += row.missing_fields_count
      missingFieldsCount += 1
    }

    const promptTokens = typeof row.prompt_tokens === 'number' ? row.prompt_tokens : 0
    const completionTokens = typeof row.completion_tokens === 'number' ? row.completion_tokens : 0
    const totalTokens = typeof row.total_tokens === 'number' ? row.total_tokens : 0
    promptTokensSum += promptTokens
    completionTokensSum += completionTokens
    totalTokensSum += totalTokens

    const createdAt = row.created_at || ''
    const day = createdAt ? createdAt.slice(0, 10) : 'unknown'
    const prevDay = byDay.get(day) || { total: 0, success: 0, failed: 0, tokens: 0 }
    prevDay.total += 1
    prevDay.tokens += totalTokens
    if (isSuccess) prevDay.success += 1
    if (isFailed) prevDay.failed += 1
    byDay.set(day, prevDay)

    if (isFailed && row.error_message) {
      inc(byError, row.error_message.slice(0, 180))
    }
  }

  const statusEntries = Array.from(byStatus.entries()).sort((a, b) => b[1] - a[1])
  const sourceEntries = Array.from(bySource.entries()).sort((a, b) => b[1] - a[1])
  const daily = Array.from(byDay.entries())
    .filter(([day]) => day !== 'unknown')
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([day, value]) => ({
      day,
      total: value.total,
      success: value.success,
      failed: value.failed,
      successRate: value.total ? Number((value.success / value.total).toFixed(4)) : 0,
      tokens: value.tokens,
    }))
  const topErrors = Array.from(byError.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([message, count]) => ({ message, count }))

  return {
    ok: true as const,
    window: {
      dateFrom: dateFrom || null,
      dateTo: dateTo || null,
      sampledRows: rows.length,
      sampleLimit: limit,
    },
    totals: {
      total: rows.length,
      success: successCount,
      failed: failedCount,
      successRate: rows.length ? Number((successCount / rows.length).toFixed(4)) : 0,
      avgLatencyMs: avg(latencySum, latencyCount),
      avgConfidence: avg(confidenceSum, confidenceCount),
      avgMissingFields: avg(missingFieldsSum, missingFieldsCount),
      tokens: {
        prompt: promptTokensSum,
        completion: completionTokensSum,
        total: totalTokensSum,
      },
    },
    breakdown: {
      status: statusEntries.map(([key, count]) => ({ key, count })),
      source: sourceEntries.map(([key, count]) => ({ key, count })),
    },
    daily,
    topErrors,
  }
})
