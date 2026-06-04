/**
 * Dashboard API fetch with Supabase session cookie + Bearer fallback.
 * Fixes 401 when the client has a session in memory but auth cookies are missing on the request.
 */
export function useDashboardFetch() {
  const supabase = useSupabaseClient()

  async function authHeaders(extra?: HeadersInit): Promise<Headers> {
    const headers = new Headers(extra)
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.access_token) {
      headers.set('Authorization', `Bearer ${session.access_token}`)
    }
    return headers
  }

  async function dashboardFetch(input: string, init?: RequestInit): Promise<Response> {
    const headers = await authHeaders(init?.headers)
    return fetch(input, {
      ...init,
      headers,
      credentials: 'include',
    })
  }

  return { dashboardFetch, authHeaders }
}
