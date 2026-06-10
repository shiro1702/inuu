import type { CarouselCanvasObject } from '~/types/editorialCarousel'

const FLOW_ANCHOR_SELECTORS: Record<string, string> = {
  title: 'h1, h2',
  hero: 'img.object-cover',
  hero_image: 'img.object-cover',
  media: 'img.object-cover',
  cta: 'h2, h3',
}

export function findFlowAnchorEl(frame: HTMLElement, targetId: string): HTMLElement | null {
  const byAttr = frame.querySelector(`[data-carousel-flow-id="${targetId}"]`)
  if (byAttr instanceof HTMLElement) return byAttr

  const selector = FLOW_ANCHOR_SELECTORS[targetId]
  if (selector) {
    const el = frame.querySelector(selector)
    if (el instanceof HTMLElement) return el
  }

  return null
}

function offsetWithinFrame(el: HTMLElement, frame: HTMLElement) {
  const frameRect = frame.getBoundingClientRect()
  const elRect = el.getBoundingClientRect()
  const scale = frame.offsetWidth > 0 ? frameRect.width / frame.offsetWidth : 1
  return {
    left: (elRect.left - frameRect.left) / scale,
    top: (elRect.top - frameRect.top) / scale,
    width: elRect.width / scale,
    height: elRect.height / scale,
  }
}

export type StickerPixelPosition = {
  left: number
  top: number
}

/** Позиция стикера в px относительно холста (export size). */
export function stickerPixelPosition(
  obj: CarouselCanvasObject,
  frameW: number,
  frameH: number,
  frameEl?: HTMLElement | null,
): StickerPixelPosition {
  if (obj.anchor === 'flow' && obj.anchor_target && frameEl) {
    const anchor = findFlowAnchorEl(frameEl, obj.anchor_target)
    if (anchor) {
      const box = offsetWithinFrame(anchor, frameEl)
      return {
        left: box.left + box.width + (obj.x / 100) * box.width,
        top: box.top + (obj.y / 100) * box.height,
      }
    }
  }

  return {
    left: (obj.x / 100) * frameW,
    top: (obj.y / 100) * frameH,
  }
}

/** Canvas % из позиции в px (центр стикера). */
export function pixelToCanvasPercent(
  left: number,
  top: number,
  frameW: number,
  frameH: number,
): { x: number; y: number } {
  return {
    x: Math.min(100, Math.max(0, (left / frameW) * 100)),
    y: Math.min(100, Math.max(0, (top / frameH) * 100)),
  }
}
