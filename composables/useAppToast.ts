export type AppToastKind = 'ok' | 'info' | 'error'

export type AppToastItem = {
  id: string
  kind: AppToastKind
  message: string
}

export function useAppToast() {
  const toasts = useState<AppToastItem[]>('app-toasts', () => [])

  function dismissToast(id: string) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  function pushToast(message: string, kind: AppToastKind = 'ok', durationMs?: number) {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    toasts.value = [...toasts.value, { id, kind, message }]
    const ttl = durationMs ?? (kind === 'error' ? 9000 : 5500)
    if (process.client) {
      window.setTimeout(() => dismissToast(id), ttl)
    }
    return id
  }

  return { toasts, pushToast, dismissToast }
}
