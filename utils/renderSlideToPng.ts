import { toPng } from 'html-to-image'
import type { CarouselAspect } from '~/types/editorialCarousel'
import { CAROUSEL_EXPORT_SIZES } from '~/types/editorialCarousel'

function preloadImage(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve()
    img.onerror = () => reject(new Error(`Failed to preload image: ${url}`))
    img.src = url
  })
}

export async function preloadCarouselMedia(urls: Array<string | null | undefined>): Promise<void> {
  const unique = [...new Set(urls.filter((u): u is string => Boolean(u?.trim())))]
  await Promise.all(
    unique.map((url) => preloadImage(url).catch(() => undefined)),
  )
}

export type RenderSlideToPngOptions = {
  aspect: CarouselAspect
  pixelRatio?: number
}

export async function renderSlideToPng(
  node: HTMLElement,
  options: RenderSlideToPngOptions,
): Promise<Blob> {
  if (typeof document === 'undefined') {
    throw new Error('renderSlideToPng requires a browser environment')
  }

  await document.fonts.ready

  const { width, height } = CAROUSEL_EXPORT_SIZES[options.aspect]
  const dataUrl = await toPng(node, {
    width,
    height,
    pixelRatio: options.pixelRatio ?? 1,
    cacheBust: true,
  })

  const response = await fetch(dataUrl)
  return response.blob()
}

export async function renderSlideToDataUrl(
  node: HTMLElement,
  options: RenderSlideToPngOptions,
): Promise<string> {
  const blob = await renderSlideToPng(node, options)
  return URL.createObjectURL(blob)
}

export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = fileName
  anchor.click()
  URL.revokeObjectURL(url)
}
