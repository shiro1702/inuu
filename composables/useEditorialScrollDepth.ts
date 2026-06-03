export function useEditorialScrollDepth(args: {
  citySlug: Ref<string> | string
  postSlug: Ref<string> | string
}) {
  const sent = ref(new Set<number>())
  const sessionKey = useState('editorial-scroll-session', () => {
    if (import.meta.server) return 'srv'
    return `ed-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
  })

  function citySlugValue() {
    return typeof args.citySlug === 'string' ? args.citySlug : args.citySlug.value
  }

  function postSlugValue() {
    return typeof args.postSlug === 'string' ? args.postSlug : args.postSlug.value
  }

  async function sendDepth(depth: 50 | 100) {
    if (sent.value.has(depth)) return
    sent.value.add(depth)
    const slug = citySlugValue()
    const post = postSlugValue()
    if (!slug || !post) return
    try {
      await $fetch(`/api/cities/${slug}/editorial/${post}/scroll`, {
        method: 'POST',
        body: { depth, sessionKey: sessionKey.value },
      })
    } catch {
      sent.value.delete(depth)
    }
  }

  function trackScroll(container?: HTMLElement | null) {
    if (import.meta.server) return () => {}

    const onScroll = () => {
      const el = container || document.documentElement
      const scrollTop = container ? container.scrollTop : window.scrollY
      const height = (container ? container.scrollHeight : document.documentElement.scrollHeight)
        - (container ? container.clientHeight : window.innerHeight)
      if (height <= 0) return
      const ratio = scrollTop / height
      if (ratio >= 0.45) void sendDepth(50)
      if (ratio >= 0.92) void sendDepth(100)
    }

    const target = container || window
    target.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => target.removeEventListener('scroll', onScroll)
  }

  return { trackScroll, sendDepth }
}
