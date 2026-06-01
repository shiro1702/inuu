import * as cheerio from 'cheerio'
import type { ParsingRules, ParsingRulesSelectors } from '~/server/utils/webParsingTypes'

export type AppliedEventFields = {
  title: string | null
  start_time: string | null
  description: string | null
  price: string | null
  poster: string | null
}

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, ' ').trim()
}

function resolveSelectorValue($: cheerio.CheerioAPI, selector: string): string | null {
  const trimmed = selector.trim()
  if (!trimmed) return null

  const attrMatch = trimmed.match(/^(.+)@([a-zA-Z_-]+)$/)
  if (attrMatch) {
    const [, sel, attr] = attrMatch
    const val = $(sel).first().attr(attr)
    return val ? normalizeWhitespace(val) : null
  }

  const text = $(trimmed).first().text()
  return text ? normalizeWhitespace(text) : null
}

export function applyParsingRulesToHtml(
  html: string,
  rules: ParsingRules,
): AppliedEventFields {
  const $ = cheerio.load(html)
  const selectors: ParsingRulesSelectors = rules.selectors || {}

  return {
    title: selectors.title ? resolveSelectorValue($, selectors.title) : null,
    start_time: selectors.start_time ? resolveSelectorValue($, selectors.start_time) : null,
    description: selectors.description ? resolveSelectorValue($, selectors.description) : null,
    price: selectors.price ? resolveSelectorValue($, selectors.price) : null,
    poster: selectors.poster ? resolveSelectorValue($, selectors.poster) : null,
  }
}

export function isFastLaneComplete(fields: AppliedEventFields): boolean {
  return !!(fields.title && fields.start_time)
}

export function buildRawTextFromApplied(fields: AppliedEventFields): string {
  const parts = [
    fields.title,
    fields.start_time,
    fields.description,
    fields.price ? `Цена: ${fields.price}` : null,
  ].filter(Boolean)
  return parts.join('\n\n')
}
