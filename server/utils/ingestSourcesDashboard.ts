import { createError } from 'h3'
import type { H3Event } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import {
  INGEST_CONTEXT_TYPES,
  type IngestContextType,
} from '~/server/utils/ingestSourcesDashboardShared'
import {
  normalizeContextTypeForSource,
  normalizeTelegramSourceKey,
  normalizeWebSourceUrl,
} from '~/server/utils/ingestSourcesDashboardShared'
import {
  parseParsingRules,
  parseParsingStrategy,
  type ParsingRules,
  type ParsingStrategy,
} from '~/server/utils/webParsingTypes'

export type ShopPickerItem = {
  id: string
  slug: string
  name: string
  isClaimed: boolean
  parsedSourceDomain: string | null
}

export type WebSourceDto = {
  id: string
  url: string
  displayName: string | null
  contextType: IngestContextType
  organizationId: string | null
  organization: ShopPickerItem | null
  cronEnabled: boolean
  isActive: boolean
  lastCrawledAt: string | null
  notes: string | null
  parsingStrategy: ParsingStrategy | null
  parsingRules: ParsingRules | null
  rulesValidatedAt: string | null
  createdAt: string
  updatedAt: string
}

export type TelegramSourceDto = {
  id: string
  sourceKey: string
  sourceType: 'channel' | 'group'
  contextType: IngestContextType
  organizationId: string | null
  organization: ShopPickerItem | null
  isActive: boolean
  ingestMode: 'realtime' | 'batch'
  notes: string | null
  createdAt: string
  updatedAt: string
}

function normalizeContextType(value: unknown): IngestContextType {
  return normalizeContextTypeForSource(value)
}

function mapShopRow(row: any): ShopPickerItem | null {
  if (!row?.id) return null
  const ui = row.ui_settings && typeof row.ui_settings === 'object' ? row.ui_settings : {}
  return {
    id: String(row.id),
    slug: String(row.slug || ''),
    name: String(row.name || ''),
    isClaimed: ui.is_claimed === true,
    parsedSourceDomain: typeof ui.parsed_source_domain === 'string' ? ui.parsed_source_domain : null,
  }
}

function orgFromJoin(raw: unknown): ShopPickerItem | null {
  if (!raw) return null
  const row = Array.isArray(raw) ? raw[0] : raw
  return mapShopRow(row)
}

export function mapWebSourceRow(row: any): WebSourceDto {
  return {
    id: String(row.id),
    url: String(row.url),
    displayName: row.display_name ? String(row.display_name) : null,
    contextType: normalizeContextType(row.context_type),
    organizationId: row.organization_id ? String(row.organization_id) : null,
    organization: orgFromJoin(row.shops),
    cronEnabled: row.cron_enabled === true,
    isActive: row.is_active !== false,
    lastCrawledAt: row.last_crawled_at ? String(row.last_crawled_at) : null,
    notes: row.notes ? String(row.notes) : null,
    parsingStrategy: parseParsingStrategy(row.parsing_strategy),
    parsingRules: parseParsingRules(row.parsing_rules),
    rulesValidatedAt: row.rules_validated_at ? String(row.rules_validated_at) : null,
    createdAt: String(row.created_at || ''),
    updatedAt: String(row.updated_at || ''),
  }
}

export function mapTelegramSourceRow(row: any): TelegramSourceDto {
  const sourceType = row.source_type === 'group' ? 'group' : 'channel'
  const ingestMode = row.ingest_mode === 'batch' ? 'batch' : 'realtime'
  return {
    id: String(row.id),
    sourceKey: String(row.source_key),
    sourceType,
    contextType: normalizeContextType(row.context_type),
    organizationId: row.organization_id ? String(row.organization_id) : null,
    organization: orgFromJoin(row.shops),
    isActive: row.is_active !== false,
    ingestMode,
    notes: row.notes ? String(row.notes) : null,
    createdAt: String(row.created_at || ''),
    updatedAt: String(row.updated_at || ''),
  }
}

export async function assertShopInCity(args: {
  event: H3Event
  cityId: string
  organizationId: string | null | undefined
}): Promise<string | null> {
  const orgId = String(args.organizationId || '').trim()
  if (!orgId) return null

  const client = await serverSupabaseServiceRole(args.event)
  const { data, error } = await client
    .from('shops')
    .select('id,city_id')
    .eq('id', orgId)
    .maybeSingle()

  if (error || !data?.id) {
    throw createError({ statusCode: 400, statusMessage: 'Organization not found' })
  }
  if (String((data as any).city_id) !== args.cityId) {
    throw createError({ statusCode: 400, statusMessage: 'Organization belongs to another city' })
  }
  return orgId
}

export async function listCityShopsForPicker(
  event: H3Event,
  cityId: string,
): Promise<ShopPickerItem[]> {
  const client = await serverSupabaseServiceRole(event)
  const { data, error } = await client
    .from('shops')
    .select('id,slug,name,ui_settings')
    .eq('city_id', cityId)
    .order('name', { ascending: true })
    .limit(200)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return (data ?? []).map((row) => mapShopRow(row)!).filter(Boolean)
}

const WEB_SOURCE_SELECT_TAIL = `
  context_type,organization_id,cron_enabled,is_active,last_crawled_at,notes,
  parsing_strategy,parsing_rules,rules_validated_at,
  created_at,updated_at,
  shops:organization_id(id,slug,name,ui_settings)
`

/** Full select after migration 040; use queryWebSources() for backward compatibility. */
export const WEB_SOURCE_SELECT = `
  id,url,display_name,${WEB_SOURCE_SELECT_TAIL}
`

/** List view: omit heavy parsing_rules JSONB. */
export const WEB_SOURCE_LIST_SELECT = `
  id,url,display_name,
  context_type,organization_id,cron_enabled,is_active,last_crawled_at,notes,
  parsing_strategy,rules_validated_at,
  created_at,updated_at,
  shops:organization_id(id,slug,name,ui_settings)
`

export const WEB_SOURCE_LIST_SELECT_LEGACY = `
  id,url,
  context_type,organization_id,cron_enabled,is_active,last_crawled_at,notes,
  parsing_strategy,rules_validated_at,
  created_at,updated_at,
  shops:organization_id(id,slug,name,ui_settings)
`

export const WEB_SOURCE_SELECT_LEGACY = `
  id,url,${WEB_SOURCE_SELECT_TAIL}
`

export function isDisplayNameColumnError(message: string | undefined): boolean {
  const text = String(message || '')
  return /display_name/i.test(text) && /does not exist|could not find/i.test(text)
}

function withNullDisplayName<T extends Record<string, unknown>>(row: T): T {
  return { ...row, display_name: row.display_name ?? null }
}

type WebSourceQueryResult = { data: unknown; error: { message?: string } | null }

export async function queryWebSourcesWith(
  fullSelect: string,
  legacySelect: string,
  run: (select: string) => Promise<WebSourceQueryResult>,
): Promise<WebSourceQueryResult> {
  let result = await run(fullSelect)
  if (!result.error || !isDisplayNameColumnError(result.error.message)) {
    return result
  }
  result = await run(legacySelect)
  if (!result.data) return result
  if (Array.isArray(result.data)) {
    return { ...result, data: result.data.map((row) => withNullDisplayName(row as Record<string, unknown>)) }
  }
  return { ...result, data: withNullDisplayName(result.data as Record<string, unknown>) }
}

export async function queryWebSources(
  run: (select: string) => Promise<WebSourceQueryResult>,
): Promise<WebSourceQueryResult> {
  return queryWebSourcesWith(WEB_SOURCE_SELECT, WEB_SOURCE_SELECT_LEGACY, run)
}

export function omitDisplayNamePatch(patch: Record<string, unknown>): Record<string, unknown> {
  const { display_name: _removed, ...rest } = patch
  return rest
}

export const WEB_SOURCE_CRAWL_SELECT = `
  id,city_id,url,display_name,context_type,organization_id,parsing_strategy,parsing_rules,rules_validated_at
`

export const WEB_SOURCE_CRAWL_SELECT_LEGACY = `
  id,city_id,url,context_type,organization_id,parsing_strategy,parsing_rules,rules_validated_at
`

export const WEB_SOURCE_CRON_SELECT = `
  ${WEB_SOURCE_CRAWL_SELECT},cities!inner(slug,timezone,name)
`

export const WEB_SOURCE_CRON_SELECT_LEGACY = `
  ${WEB_SOURCE_CRAWL_SELECT_LEGACY},cities!inner(slug,timezone,name)
`

type SupabaseLike = {
  from: (table: string) => {
    insert: (row: unknown) => { select: (cols: string) => { maybeSingle: () => Promise<WebSourceQueryResult> } }
    update: (patch: unknown) => {
      eq: (col: string, val: string) => {
        eq: (col: string, val: string) => { select: (cols: string) => { maybeSingle: () => Promise<WebSourceQueryResult> } }
      }
    }
  }
}

export async function insertWebSourceReturning(
  client: SupabaseLike,
  row: Record<string, unknown>,
): Promise<WebSourceQueryResult> {
  let result = await client
    .from('city_web_sources')
    .insert(row)
    .select(WEB_SOURCE_SELECT)
    .maybeSingle()
  if (!result.error || !isDisplayNameColumnError(result.error.message)) {
    return result
  }
  result = await client
    .from('city_web_sources')
    .insert(omitDisplayNamePatch(row))
    .select(WEB_SOURCE_SELECT_LEGACY)
    .maybeSingle()
  if (result.data && typeof result.data === 'object') {
    return { ...result, data: withNullDisplayName(result.data as Record<string, unknown>) }
  }
  return result
}

export async function updateWebSourceReturning(
  client: SupabaseLike,
  filters: { cityId: string; id: string },
  patch: Record<string, unknown>,
): Promise<WebSourceQueryResult> {
  let result = await client
    .from('city_web_sources')
    .update(patch)
    .eq('city_id', filters.cityId)
    .eq('id', filters.id)
    .select(WEB_SOURCE_SELECT)
    .maybeSingle()
  if (!result.error || !isDisplayNameColumnError(result.error.message)) {
    return result
  }
  const legacyPatch = omitDisplayNamePatch(patch)
  const hadDisplayName = Object.keys(patch).length !== Object.keys(legacyPatch).length
  if (!hadDisplayName) {
    return result
  }
  result = await client
    .from('city_web_sources')
    .update(legacyPatch)
    .eq('city_id', filters.cityId)
    .eq('id', filters.id)
    .select(WEB_SOURCE_SELECT_LEGACY)
    .maybeSingle()
  if (result.data && typeof result.data === 'object') {
    return { ...result, data: withNullDisplayName(result.data as Record<string, unknown>) }
  }
  return result
}

const TG_SOURCE_SELECT = `
  id,source_key,source_type,context_type,organization_id,is_active,ingest_mode,notes,created_at,updated_at,
  shops:organization_id(id,slug,name,ui_settings)
`

export async function listWebSources(event: H3Event, cityId: string): Promise<WebSourceDto[]> {
  const client = await serverSupabaseServiceRole(event)
  const { data, error } = await queryWebSources((select) =>
    client
      .from('city_web_sources')
      .select(select)
      .eq('city_id', cityId)
      .order('created_at', { ascending: false }),
  )

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return ((data as unknown[]) ?? []).map(mapWebSourceRow)
}

export async function listWebSourcesForDashboard(event: H3Event, cityId: string): Promise<WebSourceDto[]> {
  const client = await serverSupabaseServiceRole(event)
  const { data, error } = await queryWebSourcesWith(WEB_SOURCE_LIST_SELECT, WEB_SOURCE_LIST_SELECT_LEGACY, (select) =>
    client
      .from('city_web_sources')
      .select(select)
      .eq('city_id', cityId)
      .order('created_at', { ascending: false }),
  )

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return ((data as unknown[]) ?? []).map((row) => mapWebSourceRow({ ...row, parsing_rules: null }))
}

export async function listTelegramSources(event: H3Event, cityId: string): Promise<TelegramSourceDto[]> {
  const client = await serverSupabaseServiceRole(event)
  const { data, error } = await client
    .from('city_telegram_sources')
    .select(TG_SOURCE_SELECT)
    .eq('city_id', cityId)
    .order('source_key', { ascending: true })

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return (data ?? []).map(mapTelegramSourceRow)
}

export async function getWebSourceById(args: {
  event: H3Event
  cityId: string
  id: string
}): Promise<WebSourceDto> {
  const client = await serverSupabaseServiceRole(args.event)
  const { data, error } = await queryWebSources((select) =>
    client
      .from('city_web_sources')
      .select(select)
      .eq('city_id', args.cityId)
      .eq('id', args.id)
      .maybeSingle(),
  )

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  const row = data as Record<string, unknown> | null
  if (!row?.id) throw createError({ statusCode: 404, statusMessage: 'Web source not found' })
  return mapWebSourceRow(row)
}

export async function getTelegramSourceById(args: {
  event: H3Event
  cityId: string
  id: string
}): Promise<TelegramSourceDto> {
  const client = await serverSupabaseServiceRole(args.event)
  const { data, error } = await client
    .from('city_telegram_sources')
    .select(TG_SOURCE_SELECT)
    .eq('city_id', args.cityId)
    .eq('id', args.id)
    .maybeSingle()

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  if (!data?.id) throw createError({ statusCode: 404, statusMessage: 'Telegram source not found' })
  return mapTelegramSourceRow(data)
}
