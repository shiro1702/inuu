import type { H3Event } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import { classifyWebPage } from '~/server/utils/ai/groqWebPageClassifier'
import { generateParsingRules } from '~/server/utils/ai/groqParsingRulesGenerator'
import type { EventParseResult } from '~/server/utils/ai/eventParseSchema'
import { runContentIngest } from '~/server/utils/contentIngestCore'
import { detectPreferDigest } from '~/server/utils/ai/eventParseSchema'
import { fetchUrlPlainText } from '~/server/utils/contentUrlEnricher'
import {
  buildTelegramPostExternalId,
  fetchTelegramWebPreviewPosts,
  resolveTelegramWebPreviewUrl,
} from '~/server/utils/telegramWebPreview'
import { shouldSkipCrawl } from '~/server/utils/ingestDedupe'
import { buildWebSourceExternalId } from '~/server/utils/ingestSourceIds'
import { resolveOrCreateShadowOrg } from '~/server/utils/ingestShadowOrg'
import { insertScrapingAlert } from '~/server/utils/scrapingAlerts'
import { fetchWebPageHtml } from '~/server/utils/webPageFetch'
import {
  sanitizeWebPageWithFallback,
  type SanitizedWebPage,
} from '~/server/utils/webPageSanitizer'
import {
  applyParsingRulesToHtml,
  buildRawTextFromApplied,
  isFastLaneComplete,
} from '~/server/utils/webParsingRulesApply'
import {
  filterEventUrls,
  MAX_CHILD_URLS,
  shouldReclassify,
} from '~/server/utils/webCrawlHelpers'
import {
  parseParsingRules,
  parseParsingStrategy,
  type ParsingRules,
  type ParsingStrategy,
  type WebPageType,
} from '~/server/utils/webParsingTypes'

export type WebCrawlSourceRow = {
  id: string
  city_id: string
  url: string
  display_name?: string | null
  context_type: string
  organization_id: string | null
  parsing_strategy: unknown
  parsing_rules: unknown
  rules_validated_at: string | null
}

export type WebCrawlCity = {
  slug: string
  timezone: string
  name: string
}

export type WebCrawlRunStats = {
  classified: boolean
  classifiedAs: WebPageType | null
  childUrlsFetched: number
  alerts: number
  usedFastLane: boolean
}

export type WebCrawlSourceResult = {
  ok: boolean
  skipped: boolean
  skipReason?: string
  error?: string
  hint?: string
  fetchMode?: 'html' | 'plain_text_fallback' | 'failed'
  ingestProcessed: boolean
  stats: WebCrawlRunStats
}

function isClassifierEnabled(): boolean {
  try {
    const config = useRuntimeConfig()
    const flag = String(
      (config as { webClassifierEnabled?: string }).webClassifierEnabled
        || process.env.NUXT_WEB_CLASSIFIER_ENABLED
        || '',
    ).trim()
    return flag === '1' || flag.toLowerCase() === 'true'
  } catch {
    const flag = String(process.env.NUXT_WEB_CLASSIFIER_ENABLED || '').trim()
    return flag === '1' || flag.toLowerCase() === 'true'
  }
}

async function saveParsingStrategy(args: {
  event: H3Event
  sourceId: string
  strategy: ParsingStrategy
}): Promise<void> {
  const client = await serverSupabaseServiceRole(args.event)
  await client
    .from('city_web_sources')
    .update({
      parsing_strategy: {
        ...args.strategy,
        classified_at: args.strategy.classified_at || new Date().toISOString(),
      },
      updated_at: new Date().toISOString(),
    } as any)
    .eq('id', args.sourceId)
}

async function saveParsingRules(args: {
  event: H3Event
  sourceId: string
  rules: ParsingRules
  validated: boolean
}): Promise<void> {
  const client = await serverSupabaseServiceRole(args.event)
  const patch: Record<string, unknown> = {
    parsing_rules: args.rules,
    updated_at: new Date().toISOString(),
  }
  if (args.validated) {
    patch.rules_validated_at = new Date().toISOString()
  }
  await client.from('city_web_sources').update(patch as any).eq('id', args.sourceId)
}

async function bumpStrategyFailCount(args: {
  event: H3Event
  sourceId: string
  strategy: ParsingStrategy | null
}): Promise<void> {
  const client = await serverSupabaseServiceRole(args.event)
  const failCount = (args.strategy?.fail_count || 0) + 1
  await client
    .from('city_web_sources')
    .update({
      parsing_strategy: {
        ...(args.strategy || { page_type: 'unknown' }),
        fail_count: failCount,
      },
      updated_at: new Date().toISOString(),
    } as any)
    .eq('id', args.sourceId)
}

function buildParsedEventFromFields(args: {
  fields: ReturnType<typeof applyParsingRulesToHtml>
  sourceUrl: string
  sourceExternalId: string
  citySlug: string
}): EventParseResult {
  const desc = args.fields.description || args.fields.title || 'Событие'
  const short = desc.length > 280 ? `${desc.slice(0, 277)}...` : desc
  let dates: string[] = []
  if (args.fields.start_time) {
    const raw = args.fields.start_time
    dates = raw.includes('T') ? [raw] : [raw]
  }
  return {
    title: args.fields.title!,
    description_short: short,
    description_full: desc,
    description: desc,
    cover_media_url: args.fields.poster,
    city_slug: args.citySlug,
    event_kind: 'event',
    category_slug: null,
    venue: { name: null, address: null },
    organization: { name: null },
    source: {
      kind: 'web_cron',
      url: args.sourceUrl,
      external_id: args.sourceExternalId,
    },
    is_free: false,
    price_from: null,
    capacity: null,
    registration_url: null,
    topic_tags: [],
    recurrence: { rule: 'none', dates },
    confidence: 0.85,
    missing_fields: dates.length ? [] : ['recurrence.dates'],
  }
}

type IngestCtx = {
  event: H3Event
  source: WebCrawlSourceRow
  city: WebCrawlCity
  persist: boolean
  organizationId: string | null
  organizationName: string | null
  stats: WebCrawlRunStats
}

async function resolveOrganization(ctx: IngestCtx): Promise<{
  organizationId: string | null
  organizationName: string | null
}> {
  let organizationId = ctx.organizationId
  let organizationName = ctx.organizationName
  if (!organizationId) {
    const shadow = await resolveOrCreateShadowOrg({
      event: ctx.event,
      cityId: ctx.source.city_id,
      sourceUrl: ctx.source.url,
      orgNameHint: ctx.source.display_name,
      webSourceId: ctx.source.id,
    })
    organizationId = shadow.shopId
    organizationName = shadow.name
  }
  return { organizationId, organizationName }
}

async function runIngestText(
  ctx: IngestCtx,
  args: {
    rawText: string
    sourceUrl: string
    sourceExternalId: string
    preferDigest?: boolean
    parsedEvents?: EventParseResult[]
    coverMediaUrl?: string | null
  },
): Promise<{ processed: boolean; skipped: boolean; skipReason?: string; error?: string }> {
  const { organizationId, organizationName } = await resolveOrganization(ctx)
  let ingest: Awaited<ReturnType<typeof runContentIngest>>
  try {
    ingest = await runContentIngest(ctx.event, {
    rawText: args.rawText,
    sourceKind: 'web_cron',
    sourceUrl: args.sourceUrl,
    sourceExternalId: args.sourceExternalId,
    citySlug: ctx.city.slug,
    timezone: ctx.city.timezone,
    persist: ctx.persist,
    skipUrlEnrich: true,
    hints: {
      contextType: ctx.source.context_type,
      preferDigest: args.preferDigest,
    },
    organizationId,
    organizationName,
    parsedEvents: args.parsedEvents,
    coverMediaUrl: args.coverMediaUrl,
  })
  } catch (error: unknown) {
    const message =
      error && typeof error === 'object' && 'statusMessage' in error
        ? String((error as { statusMessage?: string }).statusMessage)
        : error instanceof Error
          ? error.message
          : 'ingest_failed'
    return { processed: false, skipped: false, error: message }
  }

  if (ingest.skippedByPrefilter) {
    return { processed: false, skipped: true, skipReason: 'prefilter' }
  }
  if (ingest.skippedByPastEvent) {
    return { processed: false, skipped: true, skipReason: 'past_event' }
  }
  if (ctx.persist && !ingest.persisted.ok) {
    return {
      processed: false,
      skipped: false,
      error: ingest.persisted.warning || 'persist_failed',
    }
  }
  return { processed: ingest.events.length > 0, skipped: false }
}

async function tryFastLaneIngest(
  ctx: IngestCtx,
  args: {
    pageUrl: string
    sanitized: SanitizedWebPage
    rules: ParsingRules | null
    allowHeal: boolean
  },
): Promise<{ ok: boolean; usedFallback: boolean }> {
  let rules = args.rules
  const fetched = await fetchWebPageHtml(args.pageUrl)
  if (!fetched?.html) {
    return { ok: false, usedFallback: false }
  }

  const tryApply = (r: ParsingRules) => {
    const fields = applyParsingRulesToHtml(fetched.html, r)
    return { fields, complete: isFastLaneComplete(fields) }
  }

  if (rules?.selectors) {
    const first = tryApply(rules)
    if (first.complete) {
      const sourceExternalId = buildWebSourceExternalId(args.pageUrl)
      const parsed = buildParsedEventFromFields({
        fields: first.fields,
        sourceUrl: args.pageUrl,
        sourceExternalId,
        citySlug: ctx.city.slug,
      })
      await saveParsingRules({
        event: ctx.event,
        sourceId: ctx.source.id,
        rules,
        validated: true,
      })
      ctx.stats.usedFastLane = true
      await runIngestText(ctx, {
        rawText: buildRawTextFromApplied(first.fields),
        sourceUrl: args.pageUrl,
        sourceExternalId,
        parsedEvents: [parsed],
      })
      return { ok: true, usedFallback: false }
    }
  }

  if (!args.allowHeal) {
    return { ok: false, usedFallback: false }
  }

  const generated = await generateParsingRules(args.sanitized)
  rules = {
    page_type: generated.rules.page_type,
    selectors: generated.rules.selectors,
    list_link_pattern: generated.rules.list_link_pattern,
  }
  await saveParsingRules({ event: ctx.event, sourceId: ctx.source.id, rules, validated: false })

  const second = tryApply(rules)
  if (second.complete) {
    const sourceExternalId = buildWebSourceExternalId(args.pageUrl)
    const parsed = buildParsedEventFromFields({
      fields: second.fields,
      sourceUrl: args.pageUrl,
      sourceExternalId,
      citySlug: ctx.city.slug,
    })
    await saveParsingRules({ event: ctx.event, sourceId: ctx.source.id, rules, validated: true })
    ctx.stats.usedFastLane = true
    await runIngestText(ctx, {
      rawText: buildRawTextFromApplied(second.fields),
      sourceUrl: args.pageUrl,
      sourceExternalId,
      parsedEvents: [parsed],
    })
    return { ok: true, usedFallback: false }
  }

  return { ok: false, usedFallback: false }
}

async function ingestPageWithPipeline(
  ctx: IngestCtx,
  pageUrl: string,
  sanitized: SanitizedWebPage,
  pageType: WebPageType,
): Promise<{ processed: boolean; skipped: boolean; error?: string }> {
  const sourceExternalId = buildWebSourceExternalId(pageUrl)
  const dedupe = await shouldSkipCrawl({
    event: ctx.event,
    cityId: ctx.source.city_id,
    sourceUrl: pageUrl,
    sourceExternalId,
  })
  if (dedupe.skip) {
    return { processed: false, skipped: true, error: dedupe.reason }
  }

  if (pageType === 'single_event') {
    const rules = parseParsingRules(ctx.source.parsing_rules)
    const fast = await tryFastLaneIngest(ctx, {
      pageUrl,
      sanitized,
      rules,
      allowHeal: true,
    })
    if (fast.ok) return { processed: true, skipped: false }

    await insertScrapingAlert({
      event: ctx.event,
      webSourceId: ctx.source.id,
      url: pageUrl,
      reason: 'rules_failed',
      snapshot: sanitized.text.slice(0, 500),
    })
    ctx.stats.alerts += 1
    const strategy = parseParsingStrategy(ctx.source.parsing_strategy)
    await bumpStrategyFailCount({ event: ctx.event, sourceId: ctx.source.id, strategy })

    return runIngestText(ctx, {
      rawText: sanitized.text,
      sourceUrl: pageUrl,
      sourceExternalId,
    })
  }

  if (pageType === 'text_wall') {
    return runIngestText(ctx, {
      rawText: sanitized.text,
      sourceUrl: pageUrl,
      sourceExternalId,
      preferDigest: true,
    })
  }

  return { processed: false, skipped: false }
}

export async function runTelegramWebPreviewCrawl(ctx: IngestCtx): Promise<WebCrawlSourceResult> {
  const stats: WebCrawlRunStats = {
    classified: false,
    classifiedAs: 'text_wall',
    childUrlsFetched: 0,
    alerts: 0,
    usedFastLane: false,
  }

  const preview = await fetchTelegramWebPreviewPosts(ctx.source.url)
  if (!preview?.posts.length) {
    const hint = resolveTelegramWebPreviewUrl(ctx.source.url)
      ? 'Не удалось загрузить t.me/s/ или в канале нет текстовых постов'
      : 'Для Telegram укажите публичный канал: https://t.me/s/{channel}'
    return {
      ok: false,
      skipped: false,
      error: 'empty_or_short_page',
      hint,
      fetchMode: 'failed',
      ingestProcessed: false,
      stats,
    }
  }

  let anyProcessed = false
  let lastError: string | undefined
  let skippedCount = 0
  let pastSkippedCount = 0
  let lastChannelPosterUrl: string | null = null

  for (const post of preview.posts) {
    if (post.posterUrl) {
      lastChannelPosterUrl = post.posterUrl
    }
    const coverMediaUrl = post.posterUrl || lastChannelPosterUrl
    const sourceExternalId = buildTelegramPostExternalId(post.dataPost)
    const postText = post.datetime ? `${post.text}\n\n(${post.datetime})` : post.text
    const ingest = await runIngestText(ctx, {
      rawText: postText,
      sourceUrl: post.sourceUrl,
      sourceExternalId,
      preferDigest: detectPreferDigest(postText),
      coverMediaUrl,
    })
    if (ingest.skipped) skippedCount += 1
    if (ingest.skipReason === 'past_event') pastSkippedCount += 1
    if (ingest.processed) anyProcessed = true
    if (ingest.error) lastError = ingest.error
  }

  return {
    ok: anyProcessed || skippedCount > 0,
    skipped: !anyProcessed && skippedCount > 0,
    skipReason: !anyProcessed && skippedCount > 0
      ? pastSkippedCount > 0 && pastSkippedCount === skippedCount
        ? 'all_posts_past_events'
        : 'all_posts_prefiltered'
      : undefined,
    error: anyProcessed ? undefined : lastError || 'no_events_extracted',
    hint: anyProcessed
      ? undefined
      : pastSkippedCount > 0
        ? 'Посты распознаны, но все даты в прошлом — в очередь не попали'
        : 'Посты загружены, но Groq не извлёк события (пре-фильтр или пустой parse)',
    fetchMode: 'html',
    ingestProcessed: anyProcessed,
    stats,
  }
}

export async function runLegacyWebCrawl(ctx: IngestCtx): Promise<WebCrawlSourceResult> {
  const stats: WebCrawlRunStats = {
    classified: false,
    classifiedAs: null,
    childUrlsFetched: 0,
    alerts: 0,
    usedFastLane: false,
  }
  const crawlCtx = { ...ctx, stats }

  const sourceExternalId = buildWebSourceExternalId(ctx.source.url)
  const dedupe = await shouldSkipCrawl({
    event: ctx.event,
    cityId: ctx.source.city_id,
    sourceUrl: ctx.source.url,
    sourceExternalId,
  })
  if (dedupe.skip) {
    return {
      ok: true,
      skipped: true,
      skipReason: dedupe.reason,
      ingestProcessed: false,
      stats,
    }
  }

  const pageText = await fetchUrlPlainText(ctx.source.url)
  if (!pageText || pageText.trim().length < 20) {
    return {
      ok: false,
      skipped: false,
      error: 'empty_or_short_page',
      ingestProcessed: false,
      stats,
    }
  }

  const ingest = await runIngestText(crawlCtx, {
    rawText: pageText,
    sourceUrl: ctx.source.url,
    sourceExternalId,
  })

  return {
    ok: !ingest.error,
    skipped: ingest.skipped,
    error: ingest.error,
    ingestProcessed: ingest.processed,
    stats,
  }
}

export async function runClassifierWebCrawl(ctx: IngestCtx): Promise<WebCrawlSourceResult> {
  const stats: WebCrawlRunStats = {
    classified: false,
    classifiedAs: null,
    childUrlsFetched: 0,
    alerts: 0,
    usedFastLane: false,
  }
  const crawlCtx = { ...ctx, stats }

  const fetchResult = await sanitizeWebPageWithFallback(ctx.source.url)
  const sanitized = fetchResult.page
  if (!sanitized || sanitized.text.length < 20) {
    await insertScrapingAlert({
      event: crawlCtx.event,
      webSourceId: crawlCtx.source.id,
      url: ctx.source.url,
      reason: 'empty_page',
      snapshot: sanitized?.text?.slice(0, 200) || fetchResult.hint || null,
    })
    stats.alerts += 1
    return {
      ok: false,
      skipped: false,
      error: 'empty_or_short_page',
      ingestProcessed: false,
      stats,
      fetchMode: fetchResult.fetchMode,
      hint: fetchResult.hint,
    }
  }

  let strategy = parseParsingStrategy(ctx.source.parsing_strategy)
  const rulesValidatedAt = ctx.source.rules_validated_at

  if (shouldReclassify(strategy, rulesValidatedAt)) {
    const classified = await classifyWebPage(sanitized)
    strategy = {
      page_type: classified.result.page_type,
      list_link_pattern: classified.result.list_link_pattern || null,
      confidence: classified.result.confidence,
      classified_at: new Date().toISOString(),
      fail_count: 0,
    }
    await saveParsingStrategy({
      event: crawlCtx.event,
      sourceId: crawlCtx.source.id,
      strategy,
    })
    stats.classified = true
    ctx.source.parsing_strategy = strategy
  }

  const pageType = strategy?.page_type || 'unknown'
  stats.classifiedAs = pageType

  if (pageType === 'unknown') {
    await insertScrapingAlert({
      event: crawlCtx.event,
      webSourceId: crawlCtx.source.id,
      url: crawlCtx.source.url,
      reason: 'unknown',
      snapshot: sanitized.text.slice(0, 500),
    })
    stats.alerts += 1
    return {
      ok: true,
      skipped: false,
      ingestProcessed: false,
      stats,
    }
  }

  if (pageType === 'event_list_links') {
    const rootDedupe = await shouldSkipCrawl({
      event: crawlCtx.event,
      cityId: crawlCtx.source.city_id,
      sourceUrl: ctx.source.url,
      sourceExternalId: buildWebSourceExternalId(ctx.source.url),
    })
    if (rootDedupe.skip) {
      return {
        ok: true,
        skipped: true,
        skipReason: rootDedupe.reason,
        ingestProcessed: false,
        stats,
      }
    }

    let childUrls = filterEventUrls(
      sanitized.links,
      sanitized.finalUrl,
      strategy?.list_link_pattern,
    )
    if (!childUrls.length) {
      const classified = await classifyWebPage(sanitized)
      childUrls = filterEventUrls(
        classified.result.event_urls,
        sanitized.finalUrl,
        classified.result.list_link_pattern || strategy?.list_link_pattern,
      )
    }

    childUrls = childUrls.slice(0, MAX_CHILD_URLS)
    let anyProcessed = false
    let lastError: string | undefined

    for (const childUrl of childUrls) {
      stats.childUrlsFetched += 1
      const childFetch = await sanitizeWebPageWithFallback(childUrl)
      const childSanitized = childFetch.page
      if (!childSanitized) continue
      const result = await ingestPageWithPipeline(crawlCtx, childUrl, childSanitized, 'single_event')
      if (result.processed) anyProcessed = true
      if (result.error) lastError = result.error
    }

    return {
      ok: !lastError,
      skipped: false,
      error: lastError,
      ingestProcessed: anyProcessed,
      stats,
    }
  }

  const result = await ingestPageWithPipeline(crawlCtx, ctx.source.url, sanitized, pageType)
  return {
    ok: !result.error,
    skipped: result.skipped,
    skipReason: result.skipped ? result.error : undefined,
    error: result.error,
    ingestProcessed: result.processed,
    stats,
  }
}

export function shouldUseWebClassifier(): boolean {
  return isClassifierEnabled()
}

export async function executeWebSourceCrawl(ctx: IngestCtx): Promise<WebCrawlSourceResult> {
  if (resolveTelegramWebPreviewUrl(ctx.source.url)) {
    return runTelegramWebPreviewCrawl(ctx)
  }
  if (!isClassifierEnabled()) {
    return runLegacyWebCrawl(ctx)
  }
  return runClassifierWebCrawl(ctx)
}
