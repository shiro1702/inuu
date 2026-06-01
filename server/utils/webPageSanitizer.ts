import * as cheerio from 'cheerio'
import { fetchUrlPlainText } from '~/server/utils/contentUrlEnricher'
import { fetchWebPageHtml } from '~/server/utils/webPageFetch'

const MAX_TEXT_CHARS = 3000
const MAX_SNIPPET_CHARS = 3000
const MAX_LINKS = 80

export type SanitizedWebPage = {
  url: string
  finalUrl: string
  text: string
  links: string[]
  htmlSnippet: string
}

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, ' ').trim()
}

function toAbsoluteUrl(href: string, baseUrl: string): string | null {
  try {
    return new URL(href, baseUrl).href
  } catch {
    return null
  }
}

function isHttpUrl(value: string): boolean {
  try {
    const u = new URL(value)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

export function sanitizeHtml(html: string, baseUrl: string): SanitizedWebPage {
  const $ = cheerio.load(html)
  $('script, style, header, footer, svg, noscript, iframe').remove()

  const links: string[] = []
  const seen = new Set<string>()
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href')?.trim()
    if (!href || href.startsWith('#') || href.startsWith('javascript:')) return
    const abs = toAbsoluteUrl(href, baseUrl)
    if (!abs || !isHttpUrl(abs) || seen.has(abs)) return
    seen.add(abs)
    links.push(abs)
  })

  let bodyText = normalizeWhitespace($('body').text() || $.root().text())
  if (bodyText.length < 20) {
    bodyText = normalizeWhitespace(
      $('main, [role="main"], article, #content, .content, .afisha').text() || '',
    )
  }
  const text = bodyText.slice(0, MAX_TEXT_CHARS)

  const snippetRoot = $('body').length ? $('body') : $.root()
  const htmlSnippet = snippetRoot.html()?.slice(0, MAX_SNIPPET_CHARS) || ''

  return {
    url: baseUrl,
    finalUrl: baseUrl,
    text,
    links: links.slice(0, MAX_LINKS),
    htmlSnippet,
  }
}

export async function sanitizeWebPage(url: string): Promise<SanitizedWebPage | null> {
  const fetched = await fetchWebPageHtml(url)
  if (!fetched?.html?.trim()) return null
  const sanitized = sanitizeHtml(fetched.html, fetched.finalUrl)
  return {
    ...sanitized,
    url,
    finalUrl: fetched.finalUrl,
  }
}

export type SanitizeWebPageResult = {
  page: SanitizedWebPage | null
  fetchMode: 'html' | 'plain_text_fallback' | 'failed'
  hint?: string
}

/** HTML sanitize first; if empty — fallback to fetchUrlPlainText (Firecrawl markdown / stripHtml). */
export async function sanitizeWebPageWithFallback(url: string): Promise<SanitizeWebPageResult> {
  const primary = await sanitizeWebPage(url)
  if (primary && primary.text.length >= 20) {
    return { page: primary, fetchMode: 'html' }
  }

  const plain = await fetchUrlPlainText(url)
  if (plain && plain.trim().length >= 20) {
    return {
      page: {
        url,
        finalUrl: url,
        text: plain.trim().slice(0, MAX_TEXT_CHARS),
        links: primary?.links?.length ? primary.links : [],
        htmlSnippet: primary?.htmlSnippet || plain.slice(0, MAX_SNIPPET_CHARS),
      },
      fetchMode: 'plain_text_fallback',
      hint: 'Used plain-text fallback (markdown or stripHtml)',
    }
  }

  if (!primary) {
    return {
      page: null,
      fetchMode: 'failed',
      hint: 'Could not fetch URL (network, 403, or invalid URL)',
    }
  }

  return {
    page: primary,
    fetchMode: 'failed',
    hint: `Page fetched but text too short (${primary.text.length} chars)`,
  }
}
