<template>
  <div
    ref="overlayRef"
    class="absolute inset-0 z-20"
    :class="editable ? '' : 'pointer-events-none'"
  >
    <img
      v-for="obj in displayObjects"
      :key="obj.id"
      :src="obj.image_url"
      alt=""
      class="absolute object-contain drop-shadow-lg select-none"
      :class="editable ? 'cursor-grab touch-none active:cursor-grabbing' : ''"
      :style="styleFor(obj)"
      draggable="false"
      @pointerdown="onPointerDown($event, obj.id)"
      @wheel.prevent="onWheel($event, obj.id)"
    >
  </div>
</template>

<script setup lang="ts">
import type { CarouselAspect, CarouselCanvasObject } from '~/types/editorialCarousel'
import { CAROUSEL_EXPORT_SIZES } from '~/types/editorialCarousel'
import {
  pixelToCanvasPercent,
  stickerPixelPosition,
} from '~/utils/carouselStickerPosition'

const props = withDefaults(
  defineProps<{
    objects: CarouselCanvasObject[]
    aspect: CarouselAspect
    frameEl?: HTMLElement | null
    editable?: boolean
  }>(),
  { editable: false, frameEl: null },
)

const emit = defineEmits<{
  update: [objectId: string, patch: Partial<CarouselCanvasObject>]
}>()

const MIN_SCALE = 0.35
const MAX_SCALE = 3.5

type LiveTransform = { scale: number; rotation: number }
type LivePosition = { left: number; top: number }

type PointerPoint = { x: number; y: number }

type GestureSession = {
  objectId: string
  pointers: Map<number, PointerPoint>
  mode: 'pending' | 'drag' | 'transform' | 'rotate'
  dragOffset?: { x: number; y: number }
  startDistance?: number
  startAngle?: number
  startScale?: number
  startRotation?: number
  startCenter?: LivePosition
  capturedTarget?: HTMLElement
}

const livePositions = ref<Record<string, LivePosition>>({})
const liveTransforms = ref<Record<string, LiveTransform>>({})
const gesture = ref<GestureSession | null>(null)

const exportSize = computed(() => CAROUSEL_EXPORT_SIZES[props.aspect])

const displayObjects = computed(() =>
  props.objects.filter((o) => o.kind === 'sticker' && o.image_url),
)

function frameScale(frame: HTMLElement) {
  const rect = frame.getBoundingClientRect()
  return rect.width / exportSize.value.width
}

function pointerInFrame(ev: PointerEvent, frame: HTMLElement): PointerPoint {
  const rect = frame.getBoundingClientRect()
  const s = frameScale(frame)
  return {
    x: (ev.clientX - rect.left) / s,
    y: (ev.clientY - rect.top) / s,
  }
}

function basePosition(obj: CarouselCanvasObject) {
  const live = livePositions.value[obj.id]
  if (live) return live
  return stickerPixelPosition(
    obj,
    exportSize.value.width,
    exportSize.value.height,
    props.frameEl,
  )
}

function baseTransform(obj: CarouselCanvasObject): LiveTransform {
  const live = liveTransforms.value[obj.id]
  if (live) return live
  return { scale: obj.scale ?? 1, rotation: obj.rotation ?? 0 }
}

function styleFor(obj: CarouselCanvasObject): Record<string, string> {
  const { scale, rotation } = baseTransform(obj)
  const pos = basePosition(obj)
  const base = exportSize.value.width * 0.052 * scale

  return {
    left: `${pos.left}px`,
    top: `${pos.top}px`,
    width: `${base}px`,
    height: `${base}px`,
    transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
    zIndex: String(obj.zIndex ?? 20),
  }
}

function remeasure() {
  livePositions.value = {}
  liveTransforms.value = {}
}

let resizeObserver: ResizeObserver | null = null

function bindFrameObserver(el: HTMLElement | null) {
  resizeObserver?.disconnect()
  remeasure()
  if (!el) return
  resizeObserver = new ResizeObserver(remeasure)
  resizeObserver.observe(el)
}

watch(() => props.frameEl, (el) => bindFrameObserver(el), { immediate: true })
watch(() => props.objects, remeasure, { deep: true })

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  endGesture()
})

function clampScale(value: number) {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, value))
}

function pointerDistance(a: PointerPoint, b: PointerPoint) {
  return Math.hypot(b.x - a.x, b.y - a.y)
}

function pointerAngle(a: PointerPoint, b: PointerPoint) {
  return (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI
}

function pointerCenter(a: PointerPoint, b: PointerPoint): LivePosition {
  return { left: (a.x + b.x) / 2, top: (a.y + b.y) / 2 }
}

function commitGesture(session: GestureSession) {
  const obj = props.objects.find((o) => o.id === session.objectId)
  if (!obj) return

  const patch: Partial<CarouselCanvasObject> = {
    anchor: 'canvas',
    anchor_target: undefined,
  }

  const livePos = livePositions.value[session.objectId]
  if (livePos) {
    const { x, y } = pixelToCanvasPercent(
      livePos.left,
      livePos.top,
      exportSize.value.width,
      exportSize.value.height,
    )
    patch.x = x
    patch.y = y
  }

  const liveTf = liveTransforms.value[session.objectId]
  if (liveTf) {
    patch.scale = clampScale(liveTf.scale)
    patch.rotation = liveTf.rotation
  }

  if (Object.keys(patch).length > 2) {
    emit('update', session.objectId, patch)
  }
}

function endGesture() {
  if (!gesture.value) return
  const session = gesture.value
  if (session.capturedTarget) {
    for (const pid of session.pointers.keys()) {
      try {
        session.capturedTarget.releasePointerCapture(pid)
      } catch {
        /* already released */
      }
    }
  }
  window.removeEventListener('pointermove', onWindowPointerMove)
  window.removeEventListener('pointerup', onWindowPointerUp)
  window.removeEventListener('pointercancel', onWindowPointerUp)
  commitGesture(session)
  gesture.value = null
  const nextPos = { ...livePositions.value }
  const nextTf = { ...liveTransforms.value }
  delete nextPos[session.objectId]
  delete nextTf[session.objectId]
  livePositions.value = nextPos
  liveTransforms.value = nextTf
}

function ensureLiveState(objectId: string) {
  const obj = props.objects.find((o) => o.id === objectId)
  if (!obj) return

  if (!livePositions.value[objectId]) {
    const pos = basePosition(obj)
    livePositions.value = { ...livePositions.value, [objectId]: { ...pos } }
  }
  if (!liveTransforms.value[objectId]) {
    const tf = baseTransform(obj)
    liveTransforms.value = { ...liveTransforms.value, [objectId]: { ...tf } }
  }
}

function startTransformMode(session: GestureSession) {
  const pts = [...session.pointers.values()]
  if (pts.length < 2) return

  const obj = props.objects.find((o) => o.id === session.objectId)
  if (!obj) return

  ensureLiveState(session.objectId)
  const tf = liveTransforms.value[session.objectId]!

  session.mode = 'transform'
  session.startDistance = pointerDistance(pts[0]!, pts[1]!)
  session.startAngle = pointerAngle(pts[0]!, pts[1]!)
  session.startScale = tf.scale
  session.startRotation = tf.rotation
  session.startCenter = { ...livePositions.value[session.objectId]! }
  session.dragOffset = undefined
}

function startDragMode(session: GestureSession, pointerId: number) {
  const frame = props.frameEl
  if (!frame) return

  const pt = session.pointers.get(pointerId)
  const center = livePositions.value[session.objectId]
  if (!pt || !center) return

  session.mode = 'drag'
  session.dragOffset = { x: pt.x - center.left, y: pt.y - center.top }
  session.startDistance = undefined
  session.startAngle = undefined
}

function onWindowPointerMove(ev: PointerEvent) {
  const session = gesture.value
  const frame = props.frameEl
  if (!session || !frame) return
  if (!session.pointers.has(ev.pointerId)) return

  session.pointers.set(ev.pointerId, pointerInFrame(ev, frame))

  if (session.mode === 'rotate') {
    const pt = session.pointers.get(ev.pointerId)
    const center = livePositions.value[session.objectId]
    if (!pt || !center || session.startAngle == null) return
    const angle = (Math.atan2(pt.y - center.top, pt.x - center.left) * 180) / Math.PI
    liveTransforms.value = {
      ...liveTransforms.value,
      [session.objectId]: {
        scale: liveTransforms.value[session.objectId]?.scale ?? session.startScale ?? 1,
        rotation: (session.startRotation ?? 0) + (angle - session.startAngle),
      },
    }
    return
  }

  if (session.pointers.size >= 2) {
    if (session.mode !== 'transform') startTransformMode(session)
    if (session.mode !== 'transform') return

    const pts = [...session.pointers.values()]
    const dist = pointerDistance(pts[0]!, pts[1]!)
    const angle = pointerAngle(pts[0]!, pts[1]!)
    const ratio = session.startDistance ? dist / session.startDistance : 1
    const deltaAngle = session.startAngle != null ? angle - session.startAngle : 0

    liveTransforms.value = {
      ...liveTransforms.value,
      [session.objectId]: {
        scale: clampScale((session.startScale ?? 1) * ratio),
        rotation: (session.startRotation ?? 0) + deltaAngle,
      },
    }

    if (session.startCenter) {
      const center = pointerCenter(pts[0]!, pts[1]!)
      livePositions.value = {
        ...livePositions.value,
        [session.objectId]: { left: center.left, top: center.top },
      }
    }
    return
  }

  if (session.mode === 'pending' || session.mode === 'drag') {
    if (session.mode === 'pending') startDragMode(session, ev.pointerId)
    const pt = session.pointers.get(ev.pointerId)
    if (!pt || !session.dragOffset) return

    livePositions.value = {
      ...livePositions.value,
      [session.objectId]: {
        left: pt.x - session.dragOffset.x,
        top: pt.y - session.dragOffset.y,
      },
    }
  }
}

function onWindowPointerUp(ev: PointerEvent) {
  const session = gesture.value
  if (!session || !session.pointers.has(ev.pointerId)) return

  session.pointers.delete(ev.pointerId)

  if (session.pointers.size === 0) {
    endGesture()
    return
  }

  if (session.pointers.size === 1) {
    session.mode = 'pending'
    session.startDistance = undefined
    session.startAngle = undefined
    session.startScale = undefined
    session.startRotation = undefined
    const remainingId = session.pointers.keys().next().value
    if (remainingId != null) startDragMode(session, remainingId)
  }
}

function onPointerDown(e: PointerEvent, objectId: string) {
  if (!props.editable || e.button !== 0) return
  e.preventDefault()
  e.stopPropagation()

  const frame = props.frameEl
  if (!frame) return

  const target = e.currentTarget as HTMLElement

  if (!gesture.value || gesture.value.objectId !== objectId) {
    if (gesture.value) endGesture()

    ensureLiveState(objectId)
    const pt = pointerInFrame(e, frame)
    const center = livePositions.value[objectId]!
    const tf = liveTransforms.value[objectId]!

    if (e.shiftKey) {
      gesture.value = {
        objectId,
        pointers: new Map([[e.pointerId, pt]]),
        mode: 'rotate',
        startRotation: tf.rotation,
        startAngle: (Math.atan2(pt.y - center.top, pt.x - center.left) * 180) / Math.PI,
        startScale: tf.scale,
        capturedTarget: target,
      }
    } else {
      gesture.value = {
        objectId,
        pointers: new Map([[e.pointerId, pt]]),
        mode: 'pending',
        capturedTarget: target,
      }
    }

    window.addEventListener('pointermove', onWindowPointerMove)
    window.addEventListener('pointerup', onWindowPointerUp)
    window.addEventListener('pointercancel', onWindowPointerUp)
  } else {
    gesture.value.pointers.set(e.pointerId, pointerInFrame(e, frame))
    if (gesture.value.pointers.size >= 2) startTransformMode(gesture.value)
  }

  try {
    target.setPointerCapture(e.pointerId)
  } catch {
    /* ignore */
  }
}

function onWheel(e: WheelEvent, objectId: string) {
  if (!props.editable) return

  const obj = props.objects.find((o) => o.id === objectId)
  if (!obj) return

  const tf = baseTransform(obj)
  const delta = e.deltaY > 0 ? -0.08 : 0.08
  const nextScale = clampScale(tf.scale + delta)

  emit('update', objectId, { scale: nextScale })
}
</script>
