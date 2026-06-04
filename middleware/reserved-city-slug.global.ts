/** Сегменты, которые не должны обрабатываться как city_slug в /:city_slug */
const RESERVED_CITY_SLUGS = new Set([
  'dev',
  'moderation',
  'dashboard',
  'platform',
  'content-submission',
  'api',
  'login',
  'register',
  'profile',
  'onboarding',
  'partners',
  'link-telegram',
  'link-max',
  'link-vk',
  'invite',
  'achievements',
])

export default defineNuxtRouteMiddleware((to) => {
  const raw = to.params.city_slug
  const slug = typeof raw === 'string' ? raw.trim() : Array.isArray(raw) ? String(raw[0] || '').trim() : ''
  if (!slug || !RESERVED_CITY_SLUGS.has(slug)) return

  if (slug === 'dev') {
    return navigateTo('/dashboard/carousel-studio')
  }

  if (slug === 'moderation') {
    return navigateTo('/dashboard/content-ai')
  }

  return abortNavigation({
    statusCode: 404,
    statusMessage: 'Page not found',
  })
})
