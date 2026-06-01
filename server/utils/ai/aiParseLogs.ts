import type { H3Event } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'

type LogArgs = {
  sourceKind: string
  sourceUrl?: string | null
  sourceExternalId?: string | null
  citySlug?: string | null
  model: string
  status: 'success' | 'failed' | 'persisted' | 'persist_failed' | 'skipped'
  latencyMs?: number | null
  promptTokens?: number | null
  completionTokens?: number | null
  totalTokens?: number | null
  confidence?: number | null
  missingFieldsCount?: number | null
  parseAttempts?: number
  errorMessage?: string | null
  payload?: Record<string, unknown> | null
}

export async function writeAiParseLog(event: H3Event, args: LogArgs): Promise<void> {
  try {
    const client = await serverSupabaseServiceRole(event)
    await client.from('ai_parse_logs').insert({
      source_kind: args.sourceKind,
      source_url: args.sourceUrl ?? null,
      source_external_id: args.sourceExternalId ?? null,
      city_slug: args.citySlug ?? null,
      model: args.model,
      status: args.status,
      latency_ms: args.latencyMs ?? null,
      prompt_tokens: args.promptTokens ?? null,
      completion_tokens: args.completionTokens ?? null,
      total_tokens: args.totalTokens ?? null,
      confidence: args.confidence ?? null,
      missing_fields_count: args.missingFieldsCount ?? null,
      parse_attempts: args.parseAttempts ?? 1,
      error_message: args.errorMessage ?? null,
      payload: args.payload ?? {},
    } as any)
  } catch (error) {
    console.error('[ai-parse-log] write failed', error)
  }
}
