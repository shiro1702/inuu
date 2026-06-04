import type { CarouselSlide } from '~/types/editorialCarousel'

export type CarouselVibeTheme = {
  gradientClass: string
  accentClass: string
  textClass: string
}

const VIBE_THEMES: Record<string, CarouselVibeTheme> = {
  romance: {
    gradientClass: 'bg-gradient-to-br from-rose-950 via-purple-900 to-slate-950',
    accentClass: 'border-rose-400/40',
    textClass: 'text-rose-50',
  },
  wine: {
    gradientClass: 'bg-gradient-to-br from-rose-950 via-purple-900 to-slate-950',
    accentClass: 'border-rose-400/40',
    textClass: 'text-rose-50',
  },
  nightlife: {
    gradientClass: 'bg-gradient-to-br from-rose-950 via-purple-900 to-slate-950',
    accentClass: 'border-rose-400/40',
    textClass: 'text-rose-50',
  },
  underground: {
    gradientClass: 'bg-gradient-to-br from-zinc-950 via-stone-900 to-black',
    accentClass: 'border-cyan-400/60 shadow-[0_0_24px_rgba(34,211,238,0.35)]',
    textClass: 'text-zinc-100',
  },
  techno: {
    gradientClass: 'bg-gradient-to-br from-zinc-950 via-stone-900 to-black',
    accentClass: 'border-cyan-400/60 shadow-[0_0_24px_rgba(34,211,238,0.35)]',
    textClass: 'text-zinc-100',
  },
  vegan: {
    gradientClass: 'bg-gradient-to-br from-emerald-950 via-green-900 to-stone-950',
    accentClass: 'border-emerald-400/40',
    textClass: 'text-emerald-50',
  },
  eco: {
    gradientClass: 'bg-gradient-to-br from-emerald-950 via-green-900 to-stone-950',
    accentClass: 'border-emerald-400/40',
    textClass: 'text-emerald-50',
  },
  tourism: {
    gradientClass: 'bg-gradient-to-br from-emerald-950 via-green-900 to-stone-950',
    accentClass: 'border-emerald-400/40',
    textClass: 'text-emerald-50',
  },
  party: {
    gradientClass: 'bg-gradient-to-br from-violet-600 via-fuchsia-600 to-indigo-900',
    accentClass: 'border-fuchsia-300/50',
    textClass: 'text-white',
  },
}

const DEFAULT_THEME = VIBE_THEMES.party!

export const CAROUSEL_VIBE_KEYS = [
  'party',
  'nightlife',
  'romance',
  'underground',
  'vegan',
  'tourism',
] as const

export function resolveCarouselVibeTheme(slide: CarouselSlide, topicTags?: string[]): CarouselVibeTheme {
  const key = (slide.gradient || topicTags?.[0] || 'party').toLowerCase()
  return VIBE_THEMES[key] || DEFAULT_THEME
}

const TAG_TO_GRADIENT: Record<string, (typeof CAROUSEL_VIBE_KEYS)[number]> = {
  nightlife: 'nightlife',
  night: 'nightlife',
  'late-night': 'nightlife',
  loud: 'nightlife',
  drive: 'nightlife',
  romance: 'romance',
  date: 'romance',
  underground: 'underground',
  speakeasy: 'underground',
  techno: 'underground',
  vegan: 'vegan',
  eco: 'vegan',
  tourism: 'tourism',
  chill: 'tourism',
  zen: 'tourism',
  party: 'party',
  active: 'party',
}

export function resolveCarouselGradientFromTags(tags: string[]): (typeof CAROUSEL_VIBE_KEYS)[number] {
  for (const raw of tags) {
    const slug = raw.trim().toLowerCase()
    if (!slug) continue
    if ((CAROUSEL_VIBE_KEYS as readonly string[]).includes(slug)) {
      return slug as (typeof CAROUSEL_VIBE_KEYS)[number]
    }
    const mapped = TAG_TO_GRADIENT[slug]
    if (mapped) return mapped
  }
  return 'party'
}

export function carouselBrandHandle(displayName: string): string {
  const trimmed = displayName.trim()
  if (!trimmed) return '@INUU'
  return trimmed.startsWith('@') ? trimmed : `@${trimmed}`
}
