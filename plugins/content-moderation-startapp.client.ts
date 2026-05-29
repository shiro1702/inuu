/**
 * Редирект из Telegram Mini App по startapp=cedit_{submissionId}
 * (кнопка «Редактировать» в групповом чате менеджеров).
 */
export default defineNuxtPlugin(() => {
  if (!process.client) return

  const router = useRouter()
  const route = useRoute()

  function resolveSubmissionIdFromStartParam(): string | null {
    const tg = (window as any).Telegram?.WebApp
    const max = (window as any).WebApp
    const startParam = String(
      tg?.initDataUnsafe?.start_param
        || max?.initDataUnsafe?.start_param
        || '',
    ).trim()
    if (!startParam.startsWith('cedit_')) return null
    const id = startParam.slice('cedit_'.length).trim()
    return id || null
  }

  function tryRedirect() {
    const submissionId = resolveSubmissionIdFromStartParam()
    if (!submissionId) return
    const target = `/moderation/content-submission/${submissionId}`
    if (route.path === target) return
    void router.replace(target)
  }

  onMounted(() => {
    tryRedirect()
    const delays = [80, 250, 600, 1200]
    for (const ms of delays) {
      window.setTimeout(tryRedirect, ms)
    }
  })
})
