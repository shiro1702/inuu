import { getFontEmbedCSS, toBlob } from 'html-to-image'
import type { CarouselAspect } from '~/types/editorialCarousel'
import { CAROUSEL_EXPORT_SIZES } from '~/types/editorialCarousel'

const TEXT_TAGS = new Set(['H1', 'H2', 'H3', 'H4', 'P', 'SPAN', 'LI', 'A', 'BUTTON', 'LABEL'])

type StyleSnapshot = { el: HTMLElement; cssText: string }
type ImageSnapshot = { el: HTMLImageElement; src: string; srcset: string | null }

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

function materializeCaptureStyles(root: HTMLElement): StyleSnapshot[] {
  const snapshots: StyleSnapshot[] = []
  const nodes = [root, ...Array.from(root.querySelectorAll<HTMLElement>('*'))]

  for (const el of nodes) {
    snapshots.push({ el, cssText: el.style.cssText })
    const computed = window.getComputedStyle(el)

    el.style.setProperty('backdrop-filter', 'none', 'important')
    el.style.setProperty('filter', 'none', 'important')
    el.style.hyphens = 'none'
    el.style.wordBreak = 'normal'
    el.style.overflowWrap = 'normal'

    if (!TEXT_TAGS.has(el.tagName)) continue

    el.style.fontSize = computed.fontSize
    el.style.fontFamily = computed.fontFamily
    el.style.fontWeight = computed.fontWeight
    el.style.fontStyle = computed.fontStyle
    el.style.lineHeight = computed.lineHeight
    el.style.letterSpacing = computed.letterSpacing
    el.style.textTransform = computed.textTransform

    if (computed.width !== 'auto') el.style.width = computed.width
    if (computed.maxWidth !== 'none') el.style.maxWidth = computed.maxWidth
  }

  return snapshots
}

function restoreCaptureStyles(snapshots: StyleSnapshot[]): void {
  for (const { el, cssText } of snapshots) {
    el.style.cssText = cssText
  }
}

/** Временно инлайнит уже загруженные картинки — без повторного fetch. */
function inlineLoadedImagesMutating(root: HTMLElement): ImageSnapshot[] {
  const snapshots: ImageSnapshot[] = []

  for (const img of root.querySelectorAll('img')) {
    if (!(img instanceof HTMLImageElement)) continue

    snapshots.push({
      el: img,
      src: img.src,
      srcset: img.getAttribute('srcset'),
    })

    if (img.src.startsWith('data:')) continue
    if (!img.complete || !img.naturalWidth) continue

    try {
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')
      if (!ctx) continue
      ctx.drawImage(img, 0, 0)
      img.src = canvas.toDataURL('image/png')
      img.removeAttribute('srcset')
    } catch {
      // tainted canvas — оставляем исходный URL
    }
  }

  return snapshots
}

function restoreInlineImages(snapshots: ImageSnapshot[]): void {
  for (const { el, src, srcset } of snapshots) {
    el.src = src
    if (srcset) el.setAttribute('srcset', srcset)
    else el.removeAttribute('srcset')
  }
}

function formatRenderError(err: unknown): string {
  if (err instanceof Error) return err.message
  if (err instanceof Event) {
    const target = err.target
    if (target instanceof HTMLImageElement) {
      return `не загрузилось изображение: ${target.currentSrc || target.src}`
    }
    return 'ошибка загрузки ресурса для PNG'
  }
  return String(err)
}

async function renderFromCaptureSource(
  source: HTMLElement,
  options: RenderSlideToPngOptions,
): Promise<Blob> {
  const { width, height } = CAROUSEL_EXPORT_SIZES[options.aspect]
  const styleSnapshots = materializeCaptureStyles(source)
  const imageSnapshots = inlineLoadedImagesMutating(source)

  try {
    const fontEmbedCSS = await getFontEmbedCSS(source)
    const blob = await toBlob(source, {
      width,
      height,
      pixelRatio: options.pixelRatio ?? 1,
      cacheBust: false,
      fontEmbedCSS,
      onImageErrorHandler: () => undefined,
    })
    if (!blob) throw new Error('PNG-рендер вернул пустой файл')
    return blob
  } finally {
    restoreInlineImages(imageSnapshots)
    restoreCaptureStyles(styleSnapshots)
  }
}

export async function renderSlideToPng(
  node: HTMLElement,
  options: RenderSlideToPngOptions,
): Promise<Blob> {
  if (typeof document === 'undefined') {
    throw new Error('renderSlideToPng requires a browser environment')
  }

  await document.fonts.ready

  try {
    return await renderFromCaptureSource(node, options)
  } catch (err: unknown) {
    const hint = formatRenderError(err)
    if (/security|tainted|cross/i.test(hint)) {
      throw new Error('Не удалось загрузить изображения (CORS). Замените обложку на файл из INUU.')
    }
    throw new Error(`PNG-рендер: ${hint}`)
  }
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
  anchor.style.display = 'none'
  document.body.appendChild(anchor)
  anchor.click()
  window.setTimeout(() => {
    anchor.remove()
    URL.revokeObjectURL(url)
  }, 250)
}
