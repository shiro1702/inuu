export default defineNuxtPlugin(() => {
  const { webApp, hideMainButton, expandMessengerViewport } = useTelegram()

  if (!webApp.value) return

  webApp.value.ready()
  expandMessengerViewport()
  hideMainButton()
})
