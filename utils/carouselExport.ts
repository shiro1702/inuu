export function waitForCarouselPaint(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
  })
}

export function delayMs(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** Дождаться data-URL QR в outro перед html-to-image. */
export function waitForQrImages(root: HTMLElement | null, timeoutMs = 4000): Promise<void> {
  if (!root) return Promise.resolve()

  const imgs = Array.from(root.querySelectorAll('img[src^="data:image"]')) as HTMLImageElement[]
  const pending = imgs.filter((img) => !img.complete)
  if (!pending.length) return Promise.resolve()

  return new Promise((resolve) => {
    const timer = setTimeout(resolve, timeoutMs)
    let left = pending.length
    const done = () => {
      left -= 1
      if (left <= 0) {
        clearTimeout(timer)
        resolve()
      }
    }
    for (const img of pending) {
      img.addEventListener('load', done, { once: true })
      img.addEventListener('error', done, { once: true })
    }
  })
}
