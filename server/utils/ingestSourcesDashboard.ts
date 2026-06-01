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

export {
  INGEST_CONTEXT_TYPES,
  normalizeTelegramSourceKey,
  normalizeWebSourceUrl,
} from '~/server/utils/ingestSourcesDashboardShared'
export type { IngestContextType }

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
  contextType: IngestContextType
  organizationId: string | null
  organization: ShopPickerItem | null
  cronEnabled: boolean
  isActive: boolean
  lastCrawledAt: string | null
  notes: string | null
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
    contextType: normalizeContextType(row.context_type),
    organizationId: row.organization_id ? String(row.organization_id) : null,
    organization: orgFromJoin(row.shops),
    cronEnabled: row.cron_enabled === true,
    isActive: row.is_active !== false,
    lastCrawledAt: row.last_crawled_at ? String(row.last_crawled_at) : null,
    notes: row.notes ? String(row.notes) : null,
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

const WEB_SOURCE_SELECT = `
  id,url,context_type,organization_id,cron_enabled,is_active,last_crawled_at,notes,created_at,updated_at,
  shops:organization_id(id,slug,name,ui_settings)
`

const TG_SOURCE_SELECT = `
  id,source_key,source_type,context_type,organization_id,is_active,ingest_mode,notes,created_at,updated_at,
  shops:organization_id(id,slug,name,ui_settings)
`

export async function listWebSources(event: H3Event, cityId: string): Promise<WebSourceDto[]> {
  const client = await serverSupabaseServiceRole(event)
  const { data, error } = await client
    .from('city_web_sources')
    .select(WEB_SOURCE_SELECT)
    .eq('city_id', cityId)
    .order('created_at', { ascending: false })

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return (data ?? []).map(mapWebSourceRow)
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
  const { data, error } = await client
    .from('city_web_sources')
    .select(WEB_SOURCE_SELECT)
    .eq('city_id', args.cityId)
    .eq('id', args.id)
    .maybeSingle()

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  if (!data?.id) throw createError({ statusCode: 404, statusMessage: 'Web source not found' })
  return mapWebSourceRow(data)
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
