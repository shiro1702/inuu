export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith('/dashboard')) return
  const isDashboardLoginPage = to.path === '/dashboard/login'

  const supabase = useSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    if (isDashboardLoginPage) return
    return navigateTo({
      path: '/dashboard/login',
      query: { redirect: to.fullPath },
    })
  }

  if (isDashboardLoginPage) {
    const redirectFromQuery = typeof to.query.redirect === 'string' ? to.query.redirect : ''
    const redirectTarget = redirectFromQuery.startsWith('/dashboard') ? redirectFromQuery : '/dashboard'
    return navigateTo(redirectTarget)
  }
})
