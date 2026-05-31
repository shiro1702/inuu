export type EventSaleMode = 'native' | 'parsed'

export type EventCta = {
  label: string
  url: string | null
  emoji: '🎟' | '🌐'
}

export type StorefrontOrganization = {
  slug: string
  name: string
}

export type StorefrontVenue = {
  slug: string
  title: string
  address?: string | null
}

export type SourceDisplay = {
  label: string
  url: string | null
}
