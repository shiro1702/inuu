
import type { DefineComponent, SlotsType } from 'vue'
type IslandComponent<T> = DefineComponent<{}, {refresh: () => Promise<void>}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, SlotsType<{ fallback: { error: unknown } }>> & T

type HydrationStrategies = {
  hydrateOnVisible?: IntersectionObserverInit | true
  hydrateOnIdle?: number | true
  hydrateOnInteraction?: keyof HTMLElementEventMap | Array<keyof HTMLElementEventMap> | true
  hydrateOnMediaQuery?: string
  hydrateAfter?: number
  hydrateWhen?: boolean
  hydrateNever?: true
}
type LazyComponent<T> = DefineComponent<HydrationStrategies, {}, {}, {}, {}, {}, {}, { hydrated: () => void }> & T

interface _GlobalComponents {
  AppHeader: typeof import("../../components/AppHeader.vue")['default']
  CheckoutSteps: typeof import("../../components/CheckoutSteps.vue")['default']
  PublicReviewsBlock: typeof import("../../components/PublicReviewsBlock.vue")['default']
  AuthChannelModal: typeof import("../../components/auth/AuthChannelModal.vue")['default']
  AuthPdConsentCheckbox: typeof import("../../components/auth/PdConsentCheckbox.vue")['default']
  CityEventCard: typeof import("../../components/city/CityEventCard.vue")['default']
  CityVenueCard: typeof import("../../components/city/CityVenueCard.vue")['default']
  DashboardDeliveryZoneMapEditor: typeof import("../../components/dashboard/DeliveryZoneMapEditor.vue")['default']
  DashboardOrganizationProductPreviewCard: typeof import("../../components/dashboard/OrganizationProductPreviewCard.vue")['default']
  DashboardOrganizationRestaurantPreviewCard: typeof import("../../components/dashboard/OrganizationRestaurantPreviewCard.vue")['default']
  LegalCookieBanner: typeof import("../../components/legal/CookieBanner.vue")['default']
  MapsOsmClusterMap: typeof import("../../components/maps/OsmClusterMap.vue")['default']
  StoriesTopBar: typeof import("../../components/stories/StoriesTopBar.vue")['default']
  StoriesStoryGridBanner: typeof import("../../components/stories/StoryGridBanner.vue")['default']
  StoriesStoryViewer: typeof import("../../components/stories/StoryViewer.vue")['default']
  StoriesStoryViewerSwiper: typeof import("../../components/stories/StoryViewerSwiper.vue")['default']
  NuxtWelcome: typeof import("../../node_modules/nuxt/dist/app/components/welcome.vue")['default']
  NuxtLayout: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-layout")['default']
  NuxtErrorBoundary: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
  ClientOnly: typeof import("../../node_modules/nuxt/dist/app/components/client-only")['default']
  DevOnly: typeof import("../../node_modules/nuxt/dist/app/components/dev-only")['default']
  ServerPlaceholder: typeof import("../../node_modules/nuxt/dist/app/components/server-placeholder")['default']
  NuxtLink: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-link")['default']
  NuxtLoadingIndicator: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
  NuxtTime: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
  NuxtRouteAnnouncer: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
  NuxtImg: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
  NuxtPicture: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
  NuxtPage: typeof import("../../node_modules/nuxt/dist/pages/runtime/page")['default']
  NoScript: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['NoScript']
  Link: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Link']
  Base: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Base']
  Title: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Title']
  Meta: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Meta']
  Style: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Style']
  Head: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Head']
  Html: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Html']
  Body: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Body']
  NuxtIsland: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-island")['default']
  LazyAppHeader: LazyComponent<typeof import("../../components/AppHeader.vue")['default']>
  LazyCheckoutSteps: LazyComponent<typeof import("../../components/CheckoutSteps.vue")['default']>
  LazyPublicReviewsBlock: LazyComponent<typeof import("../../components/PublicReviewsBlock.vue")['default']>
  LazyAuthChannelModal: LazyComponent<typeof import("../../components/auth/AuthChannelModal.vue")['default']>
  LazyAuthPdConsentCheckbox: LazyComponent<typeof import("../../components/auth/PdConsentCheckbox.vue")['default']>
  LazyCityEventCard: LazyComponent<typeof import("../../components/city/CityEventCard.vue")['default']>
  LazyCityVenueCard: LazyComponent<typeof import("../../components/city/CityVenueCard.vue")['default']>
  LazyDashboardDeliveryZoneMapEditor: LazyComponent<typeof import("../../components/dashboard/DeliveryZoneMapEditor.vue")['default']>
  LazyDashboardOrganizationProductPreviewCard: LazyComponent<typeof import("../../components/dashboard/OrganizationProductPreviewCard.vue")['default']>
  LazyDashboardOrganizationRestaurantPreviewCard: LazyComponent<typeof import("../../components/dashboard/OrganizationRestaurantPreviewCard.vue")['default']>
  LazyLegalCookieBanner: LazyComponent<typeof import("../../components/legal/CookieBanner.vue")['default']>
  LazyMapsOsmClusterMap: LazyComponent<typeof import("../../components/maps/OsmClusterMap.vue")['default']>
  LazyStoriesTopBar: LazyComponent<typeof import("../../components/stories/StoriesTopBar.vue")['default']>
  LazyStoriesStoryGridBanner: LazyComponent<typeof import("../../components/stories/StoryGridBanner.vue")['default']>
  LazyStoriesStoryViewer: LazyComponent<typeof import("../../components/stories/StoryViewer.vue")['default']>
  LazyStoriesStoryViewerSwiper: LazyComponent<typeof import("../../components/stories/StoryViewerSwiper.vue")['default']>
  LazyNuxtWelcome: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/welcome.vue")['default']>
  LazyNuxtLayout: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
  LazyNuxtErrorBoundary: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
  LazyClientOnly: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/client-only")['default']>
  LazyDevOnly: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/dev-only")['default']>
  LazyServerPlaceholder: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
  LazyNuxtLink: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-link")['default']>
  LazyNuxtLoadingIndicator: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
  LazyNuxtTime: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
  LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
  LazyNuxtImg: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
  LazyNuxtPicture: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
  LazyNuxtPage: LazyComponent<typeof import("../../node_modules/nuxt/dist/pages/runtime/page")['default']>
  LazyNoScript: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['NoScript']>
  LazyLink: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Link']>
  LazyBase: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Base']>
  LazyTitle: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Title']>
  LazyMeta: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Meta']>
  LazyStyle: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Style']>
  LazyHead: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Head']>
  LazyHtml: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Html']>
  LazyBody: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Body']>
  LazyNuxtIsland: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-island")['default']>
}

declare module 'vue' {
  export interface GlobalComponents extends _GlobalComponents { }
}

export {}
