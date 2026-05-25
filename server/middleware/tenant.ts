import { createError, defineEventHandler, getHeader, sendRedirect } from 'h3'
import {
  extractBotIdFromInitData,
  extractShopIdFromInitData,
  getShopByBotId,
  getShopByCustomDomain,
  getShopById,
  resolveShopIdFromEvent,
} from '~/server/utils/tenant'
import { getStyleRecord } from '~/server/utils/organizationStyle'
import { getMessengerInitDataFromEvent } from '~/server/utils/messengerInitData'

const REQUIRED_PATHS = [
  '/api/tenant',
  '/api/stories',
]

const CUSTOM_DOMAIN_REWRITE_PATHS = new Set(['/'])

function normalizeHost(host: string | null | undefined): string | null {
  if (!host) return null
  return host.trim().toLowerCase().replace(/:\d+$/, '') || null
}

function getPlatformBaseHost(): string | null {
  const config = useRuntimeConfig()
  const explicit = typeof config.public?.platformBaseDomain === 'string' ? config.public.platformBaseDomain : ''
  if (explicit.trim()) return normalizeHost(explicit)

  const appUrl = typeof config.appUrl === 'string' ? config.appUrl : ''
  if (!appUrl) return null
  try {
    return normalizeHost(new URL(appUrl).host)
  } catch {
    return null
  }
}

function isPlatformHost(host: string | null, baseHost: string | null): boolean {
  if (!host) return false
  if (host === 'localhost' || host === '127.0.0.1') return true
  if (!baseHost) return false
  return host === baseHost || host.endsWith(`.${baseHost}`)
}

function extractTenantSlugFromPath(path: string, defaultCitySlug: string | null): string | null {
  const segments = path.split('?')[0].split('/').filter(Boolean)
  const [firstSegment, secondSegment] = segments

  if (!firstSegment) return null
  if ([
    'api',
    '_nuxt',
    '__nuxt_error',
    'profile',
    'dashboard',
    'onboarding',
    'login',
    'register',
    'partners',
    'platform',
    'link-telegram',
    'link-max',
    'link-vk',
    'events',
    'venues',
    'map',
    'favorites',
    'bookings',
    'legal',
  ].includes(firstSegment)) return null
  if (/\.[a-z0-9]+$/i.test(firstSegment)) return null

  if (defaultCitySlug && firstSegment === defaultCitySlug) {
    if (secondSegment === 'festival' || secondSegment === 'events' || secondSegment === 'venues' || secondSegment === 'map') {
      return null
    }
    return secondSegment ?? null
  }

  return firstSegment
}

function shouldRewriteCustomDomainPath(path: string): boolean {
  const normalizedPath = (path.split('?')[0] || '/').replace(/\/+$/, '') || '/'
  return CUSTOM_DOMAIN_REWRITE_PATHS.has(normalizedPath)
}

function extractCityAndTenantFromPath(path: string): { citySlug: string; tenantSlug: string } | null {
  const segments = path.split('?')[0].split('/').filter(Boolean)
  if (segments.length < 2) return null
  const [citySlug, tenantSlug] = segments
  if (!citySlug || !tenantSlug) return null
  if ([
    'api',
    '_nuxt',
    '__nuxt_error',
    'profile',
    'dashboard',
    'onboarding',
    'login',
    'register',
    'partners',
    'platform',
    'link-telegram',
    'link-max',
    'link-vk',
    'events',
    'venues',
    'map',
    'favorites',
    'bookings',
    'legal',
  ].includes(citySlug)) return null
  if (tenantSlug === 'festival' || tenantSlug === 'events' || tenantSlug === 'venues') return null
  if (/\.[a-z0-9]+$/i.test(citySlug) || /\.[a-z0-9]+$/i.test(tenantSlug)) return null
  return { citySlug, tenantSlug }
}

export default defineEventHandler(async (event) => {
  const path = event.path || ''
  const config = useRuntimeConfig()
  const defaultCitySlug = typeof config.public?.defaultCitySlug === 'string' ? config.public.defaultCitySlug : null
  const requestHost = normalizeHost(getHeader(event, 'x-forwarded-host') || getHeader(event, 'host'))
  const platformBaseHost = getPlatformBaseHost()
  const isCustomDomain = !!requestHost && !isPlatformHost(requestHost, platformBaseHost)

  let shop = isCustomDomain && requestHost
    ? await getShopByCustomDomain(event, requestHost)
    : null

  const shopId = await resolveShopIdFromEvent(event)
  const isRequired = REQUIRED_PATHS.some((prefix) => path.startsWith(prefix))

  if (!shop && shopId) {
    shop = await getShopById(event, shopId)
  }

  if (!shop && !path.startsWith('/api/')) {
    const slugFromPath = extractTenantSlugFromPath(path, defaultCitySlug)
    if (slugFromPath) {
      shop = await getShopById(event, slugFromPath)
    }
  }

  if (!shop) {
    const initData = getMessengerInitDataFromEvent(event)
    if (initData) {
      const botId = extractBotIdFromInitData(initData)
      if (botId) {
        shop = await getShopByBotId(event, botId)
      }
      if (!shop) {
        const shopRef = extractShopIdFromInitData(initData)
        if (shopRef) {
          shop = await getShopById(event, shopRef)
        }
      }
    }
  }

  if (!shop) {
    if (!path.startsWith('/api/')) {
      const cityAndTenant = extractCityAndTenantFromPath(path)
      if (cityAndTenant) {
        return sendRedirect(event, `/${cityAndTenant.citySlug}/`, 302)
      }
      return
    }
    if (isRequired) {
      throw createError({ statusCode: 404, message: 'Shop not found' })
    }
    return
  }

  if (!shop.is_active) {
    throw createError({ statusCode: 403, message: 'Shop is inactive' })
  }

  let uiSettings = shop.ui_settings ?? {}
  let shopName = shop.name

  if (!path.startsWith('/api/')) {
    try {
      const record = await getStyleRecord(event, shop.id)
      const cfg = record.config
      const nextSmallLogo = typeof cfg.identity.logoSmallUrl === 'string' ? cfg.identity.logoSmallUrl.trim() : ''
      const nextLargeLogo = typeof cfg.identity.logoLargeUrl === 'string' ? cfg.identity.logoLargeUrl.trim() : ''
      const nextLogo = nextSmallLogo || (typeof cfg.identity.logoUrl === 'string' ? cfg.identity.logoUrl.trim() : '')
      const nextDesc = typeof cfg.identity.shortDescription === 'string' ? cfg.identity.shortDescription.trim() : ''
      const fallbackLogo = typeof uiSettings?.logo_url === 'string' ? (uiSettings as any).logo_url : ''
      const fallbackDesc = typeof uiSettings?.description === 'string' ? (uiSettings as any).description : ''

      uiSettings = {
        ...uiSettings,
        logo_url: nextLogo || fallbackLogo,
        logo_large_url: nextLargeLogo || nextLogo || fallbackLogo,
        description: nextDesc || fallbackDesc,
        ...deriveTenantThemeFromStyle(cfg),
        radius_button: `${cfg.radii.button}px`,
        radius_modal: `${cfg.radii.modal}px`,
        radius_input: `${cfg.radii.input}px`,
        radius_card: `${cfg.radii.card}px`,
      }
      shopName = cfg.identity.name || shopName
      ;(shop as any).name = shopName
    } catch {
      // best-effort
    }
  }

  event.context.tenant = {
    shopId: shop.id,
    shop,
    telegramBotToken: shop.telegram_bot_token,
    integrationKeys: shop.integration_keys ?? {},
    uiSettings,
    isCustomDomain,
  } as any

  if (!path.startsWith('/api/') && isCustomDomain && shouldRewriteCustomDomainPath(path)) {
    const url = new URL(event.node.req.url || path, 'http://internal.local')
    const normalizedPath = (url.pathname.replace(/\/+$/, '') || '/') === '/' ? '' : url.pathname.replace(/\/+$/, '')
    url.pathname = `/${shop.slug}${normalizedPath}`
    event.node.req.url = `${url.pathname}${url.search}`
  }
})

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) return null
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  }
}

function mixHex(a: string, b: string, amount: number): string {
  const aRgb = hexToRgb(a)
  const bRgb = hexToRgb(b)
  if (!aRgb || !bRgb) return a
  const t = Math.max(0, Math.min(1, amount))
  const r = Math.round(aRgb.r * (1 - t) + bRgb.r * t)
  const g = Math.round(aRgb.g * (1 - t) + bRgb.g * t)
  const bl = Math.round(aRgb.b * (1 - t) + bRgb.b * t)
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${bl.toString(16).padStart(2, '0')}`
}

function deriveTenantThemeFromStyle(cfg: any): Record<string, string> {
  const primary = typeof cfg?.colors?.primary === 'string' ? cfg.colors.primary : '#111827'
  const secondary = typeof cfg?.colors?.secondary === 'string' ? cfg.colors.secondary : '#6b7280'
  const textPrimary = typeof cfg?.colors?.textPrimary === 'string' ? cfg.colors.textPrimary : '#111827'
  const surfaceCard = typeof cfg?.colors?.surfaceCard === 'string' ? cfg.colors.surfaceCard : '#ffffff'
  return {
    primary,
    primary_50: mixHex(primary, '#ffffff', 0.92),
    primary_100: mixHex(primary, '#ffffff', 0.85),
    secondary,
    text_primary: textPrimary,
    surface_card: surfaceCard,
    on_primary: '#ffffff',
  }
}
