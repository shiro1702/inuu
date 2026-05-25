export default defineNuxtPlugin(() => {
  const { expandMessengerViewport } = useTelegram()
  expandMessengerViewport()

  const wa = typeof window !== 'undefined' ? (window as any).WebApp : null
  if (wa && typeof wa.ready === 'function') {
    wa.ready()
  }
})
