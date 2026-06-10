import { defineStore } from 'pinia'
import type {
  CarouselAspect,
  CarouselCanvasObject,
  CarouselProjectType,
  CarouselSlide,
  CarouselSlideRole,
  CarouselSlideV2,
  EditorialCarouselMetadata,
} from '~/types/editorialCarousel'
import { isCarouselSlideV2 } from '~/types/editorialCarousel'
import { normalizeSlideToV2 } from '~/utils/carouselSlideAdapter'
import { defaultSlideForRole } from '~/utils/carouselSlideLabels'
import { DEFAULT_CAROUSEL_TEMPLATE_ID, normalizeCarouselTemplateId, type CarouselTemplateId } from '~/utils/carouselTemplates'
import type { GeneratedCarouselSettings } from '~/server/utils/generatedCarouselWrite'

export type CarouselEditorProject = {
  id: string | null
  citySlug: string
  cityName: string
  title: string
  projectType: CarouselProjectType
  templateId: CarouselTemplateId
  aspect: CarouselAspect
  vibeKey: string
  linkHint: string
  slides: CarouselSlide[]
  telegramPostText: string
  currentSlideIndex: number
  dirty: boolean
  loading: boolean
  saving: boolean
  lastSavedAt: string | null
}

function defaultSlides(): CarouselSlide[] {
  return [
    { role: 'cover', title: 'Заголовок обложки', gradient: 'party', media_url: null },
    { role: 'body', title: 'Главное', bullets: ['Первый тезис', 'Второй тезис'], gradient: 'party' },
    { role: 'outro', cta_text: 'Читать в INUU', gradient: 'party' },
  ]
}

export const useCarouselEditorStore = defineStore('carouselEditor', {
  state: (): CarouselEditorProject => ({
    id: null,
    citySlug: '',
    cityName: 'INUU',
    title: 'Новая карусель',
    projectType: 'carousel',
    templateId: DEFAULT_CAROUSEL_TEMPLATE_ID,
    aspect: '4:5',
    vibeKey: 'party',
    linkHint: '',
    slides: defaultSlides(),
    telegramPostText: '',
    currentSlideIndex: 0,
    dirty: false,
    loading: false,
    saving: false,
    lastSavedAt: null,
  }),

  persist: {
    key: 'carousel-editor-draft',
    paths: [
      'id',
      'citySlug',
      'cityName',
      'title',
      'projectType',
      'templateId',
      'aspect',
      'vibeKey',
      'linkHint',
      'slides',
      'telegramPostText',
    ],
  },

  getters: {
    previewCarousel(state): EditorialCarouselMetadata {
      return {
        template_id: state.templateId,
        aspect: state.aspect,
        slides: state.slides.map((s) => ({ ...s, gradient: state.vibeKey })),
      }
    },
    slideCount: (state) => state.slides.length,
  },

  actions: {
    markDirty() {
      this.dirty = true
    },

    setCity(slug: string, name?: string) {
      this.citySlug = slug
      if (name) this.cityName = name
      this.markDirty()
    },

    setSlides(slides: CarouselSlide[]) {
      this.slides = slides.map((s) => ({ ...s, gradient: this.vibeKey }))
      this.markDirty()
    },

    setCurrentSlideIndex(index: number) {
      const max = Math.max(0, this.slides.length - 1)
      this.currentSlideIndex = Math.min(Math.max(0, index), max)
    },

    nextSlide() {
      this.setCurrentSlideIndex(this.currentSlideIndex + 1)
    },

    prevSlide() {
      this.setCurrentSlideIndex(this.currentSlideIndex - 1)
    },

    updateSlide(index: number, patch: Partial<CarouselSlide>) {
      const slide = this.slides[index]
      if (!slide) return
      const base = isCarouselSlideV2(slide) ? { ...slide } : { ...slide }
      this.slides[index] = { ...base, ...patch, gradient: this.vibeKey }
      this.markDirty()
    },

    setVibeKey(vibe: string) {
      this.vibeKey = vibe
      this.slides = this.slides.map((s) => ({ ...s, gradient: vibe }))
      this.markDirty()
    },

    setTemplateId(id: CarouselTemplateId | string) {
      this.templateId = normalizeCarouselTemplateId(id)
      this.markDirty()
    },

    setAspect(aspect: CarouselAspect | string) {
      const v = String(aspect)
      if (v === '9:16' || v === '1:1' || v === '16:9' || v === '4:5') {
        this.aspect = v
      }
      this.markDirty()
    },

    setProjectType(type: CarouselProjectType) {
      this.projectType = type
      if (type === 'post' || type === 'story' || type === 'cover') {
        if (this.slides.length > 1) {
          this.slides = [this.slides[0]!]
        }
      }
      this.markDirty()
    },

    hydrateFromMetadata(meta: EditorialCarouselMetadata, extras?: Partial<GeneratedCarouselSettings>) {
      this.templateId = normalizeCarouselTemplateId(meta.template_id)
      this.aspect = meta.aspect === '9:16' ? '9:16' : '4:5'
      this.slides = meta.slides.map((s) => ({ ...s }))
      const g = meta.slides[0]?.gradient
      if (g) this.vibeKey = g
      if (extras?.link_hint) this.linkHint = extras.link_hint
      if (extras?.vibe_key) this.vibeKey = extras.vibe_key
      if (extras?.telegram_post_text) this.telegramPostText = extras.telegram_post_text
      this.markDirty()
    },

    applyServerProject(project: {
      id: string
      title: string
      project_type: string
      theme_id: string
      aspect: CarouselAspect
      settings: GeneratedCarouselSettings
      slides: CarouselSlide[]
      city_slug?: string | null
      city_name?: string | null
    }) {
      this.id = project.id
      this.title = project.title
      if (project.city_slug) this.citySlug = project.city_slug
      if (project.city_name) this.cityName = project.city_name
      this.projectType = (project.project_type as CarouselProjectType) || 'carousel'
      this.templateId = normalizeCarouselTemplateId(project.theme_id)
      this.aspect = project.aspect === '9:16' ? '9:16' : '4:5'
      this.slides = project.slides.map((s) => ({ ...s }))
      const settings = project.settings || {}
      if (settings.vibe_key) this.vibeKey = settings.vibe_key
      if (settings.link_hint) this.linkHint = settings.link_hint
      if (settings.brand_name) this.cityName = settings.brand_name
      if (settings.telegram_post_text) this.telegramPostText = settings.telegram_post_text
      const g = project.slides[0]?.gradient
      if (g && !settings.vibe_key) this.vibeKey = g
      this.dirty = false
      this.lastSavedAt = new Date().toISOString()
    },

    buildSavePayload() {
      return {
        title: this.title,
        project_type: this.projectType,
        theme_id: this.templateId,
        aspect: this.aspect,
        settings: {
          vibe_key: this.vibeKey,
          link_hint: this.linkHint,
          brand_name: this.cityName,
          city_slug: this.citySlug || undefined,
          telegram_post_text: this.telegramPostText || undefined,
        } satisfies GeneratedCarouselSettings,
        slides: this.slides.map((s) => ({ ...s, gradient: this.vibeKey })),
      }
    },

    async load(id: string) {
      this.loading = true
      try {
        const res = await $fetch<{ ok: boolean; project: Parameters<typeof this.applyServerProject>[0] }>(
          `/api/dashboard/carousel/${id}`,
        )
        if (res?.project) this.applyServerProject(res.project)
      } finally {
        this.loading = false
      }
    },

    async create(citySlug: string) {
      this.saving = true
      try {
        const res = await $fetch<{ ok: boolean; project: Parameters<typeof this.applyServerProject>[0] }>(
          '/api/dashboard/carousel',
          {
            method: 'POST',
            body: { city_slug: citySlug, ...this.buildSavePayload() },
          },
        )
        if (res?.project) {
          this.applyServerProject(res.project)
          if (!this.citySlug) this.citySlug = citySlug
        }
        return res?.project?.id || null
      } finally {
        this.saving = false
      }
    },

    async save() {
      if (!this.id) {
        if (!this.citySlug) throw new Error('citySlug required to create project')
        return this.create(this.citySlug)
      }
      this.saving = true
      try {
        const res = await $fetch<{ ok: boolean; project: Parameters<typeof this.applyServerProject>[0] }>(
          `/api/dashboard/carousel/${this.id}`,
          { method: 'PUT', body: this.buildSavePayload() },
        )
        if (res?.project) this.applyServerProject(res.project)
        return this.id
      } finally {
        this.saving = false
      }
    },

    async share(): Promise<string> {
      const id = await this.save()
      if (!id) throw new Error('Failed to save project')
      if (import.meta.client) {
        const url = `${window.location.origin}/dashboard/carousel/edit/${id}`
        await navigator.clipboard.writeText(url)
        return url
      }
      return `/dashboard/carousel/edit/${id}`
    },

    addStickerToCurrentSlide(sticker: { id: string; image_url: string; name: string }) {
      const idx = this.currentSlideIndex
      const slide = this.slides[idx]
      if (!slide) return
      const v2 = normalizeSlideToV2(slide) as CarouselSlideV2
      const count = (v2.objects || []).length
      const obj: CarouselCanvasObject = {
        id: `sticker_${Date.now()}`,
        kind: 'sticker',
        sticker_id: sticker.id,
        image_url: sticker.image_url,
        anchor: 'canvas',
        x: 50 + (count % 3) * 6 - 6,
        y: 50 + Math.floor(count / 3) * 8 - 4,
        scale: 1.1,
        zIndex: 20 + count,
      }
      this.slides[idx] = { ...v2, objects: [...(v2.objects || []), obj] }
      this.markDirty()
    },

    updateCanvasObject(slideIndex: number, objectId: string, patch: Partial<CarouselCanvasObject>) {
      const slide = this.slides[slideIndex]
      if (!slide) return
      const v2 = normalizeSlideToV2(slide) as CarouselSlideV2
      const objects = (v2.objects || []).map((o) =>
        o.id === objectId ? { ...o, ...patch } : o,
      )
      this.slides[slideIndex] = { ...v2, objects }
      this.markDirty()
    },

    addSlide(role: CarouselSlideRole = 'body', afterIndex?: number) {
      const insertAt = afterIndex ?? this.currentSlideIndex + 1
      const slide = defaultSlideForRole(role, this.vibeKey)
      const next = [...this.slides]
      next.splice(Math.min(insertAt, next.length), 0, slide)
      this.slides = next
      this.currentSlideIndex = Math.min(insertAt, this.slides.length - 1)
      this.markDirty()
    },

    removeSlide(index: number) {
      if (this.slides.length <= 1) return
      this.slides = this.slides.filter((_, i) => i !== index)
      if (this.currentSlideIndex >= this.slides.length) {
        this.currentSlideIndex = this.slides.length - 1
      }
      this.markDirty()
    },

    moveSlideUp(index: number) {
      if (index <= 0) return
      const next = [...this.slides]
      const [row] = next.splice(index, 1)
      if (!row) return
      next.splice(index - 1, 0, row)
      this.slides = next
      if (this.currentSlideIndex === index) this.currentSlideIndex = index - 1
      this.markDirty()
    },

    moveSlideDown(index: number) {
      if (index >= this.slides.length - 1) return
      const next = [...this.slides]
      const [row] = next.splice(index, 1)
      if (!row) return
      next.splice(index + 1, 0, row)
      this.slides = next
      if (this.currentSlideIndex === index) this.currentSlideIndex = index + 1
      this.markDirty()
    },

    replaceSlides(slides: CarouselSlide[]) {
      if (!slides.length) return
      this.setSlides(slides)
      this.currentSlideIndex = 0
    },

    applyLayoutConfig(layout: Record<string, unknown>) {
      const slides = layout.slides as CarouselSlide[] | undefined
      if (slides?.length) this.setSlides(slides)
      const theme = layout.theme_id as string | undefined
      if (theme) this.setTemplateId(theme)
      this.markDirty()
    },

    buildLayoutConfig() {
      return {
        theme_id: this.templateId,
        aspect: this.aspect,
        project_type: this.projectType,
        slides: this.slides.map((s) => (isCarouselSlideV2(s) ? s : normalizeSlideToV2(s))),
      }
    },

    resetDraft() {
      this.$reset()
      this.slides = defaultSlides()
    },
  },
})
