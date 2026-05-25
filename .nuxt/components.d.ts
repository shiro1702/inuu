
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


export const AppHeader: typeof import("../components/AppHeader.vue")['default']
export const CheckoutSteps: typeof import("../components/CheckoutSteps.vue")['default']
export const PublicReviewsBlock: typeof import("../components/PublicReviewsBlock.vue")['default']
export const AuthChannelModal: typeof import("../components/auth/AuthChannelModal.vue")['default']
export const AuthPdConsentCheckbox: typeof import("../components/auth/PdConsentCheckbox.vue")['default']
export const CityEventCard: typeof import("../components/city/CityEventCard.vue")['default']
export const CityVenueCard: typeof import("../components/city/CityVenueCard.vue")['default']
export const DashboardDeliveryZoneMapEditor: typeof import("../components/dashboard/DeliveryZoneMapEditor.vue")['default']
export const DashboardOrganizationProductPreviewCard: typeof import("../components/dashboard/OrganizationProductPreviewCard.vue")['default']
export const DashboardOrganizationRestaurantPreviewCard: typeof import("../components/dashboard/OrganizationRestaurantPreviewCard.vue")['default']
export const LegalCookieBanner: typeof import("../components/legal/CookieBanner.vue")['default']
export const MapsOsmClusterMap: typeof import("../components/maps/OsmClusterMap.vue")['default']
export const StoriesTopBar: typeof import("../components/stories/StoriesTopBar.vue")['default']
export const StoriesStoryGridBanner: typeof import("../components/stories/StoryGridBanner.vue")['default']
export const StoriesStoryViewer: typeof import("../components/stories/StoryViewer.vue")['default']
export const StoriesStoryViewerSwiper: typeof import("../components/stories/StoryViewerSwiper.vue")['default']
export const NuxtWelcome: typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']
export const NuxtLayout: typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']
export const NuxtErrorBoundary: typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
export const ClientOnly: typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']
export const DevOnly: typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']
export const ServerPlaceholder: typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']
export const NuxtLink: typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']
export const NuxtLoadingIndicator: typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
export const NuxtTime: typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
export const NuxtRouteAnnouncer: typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
export const NuxtImg: typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
export const NuxtPicture: typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
export const NuxtPage: typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']
export const NoScript: typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']
export const Link: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']
export const Base: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']
export const Title: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']
export const Meta: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']
export const Style: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']
export const Head: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']
export const Html: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']
export const Body: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']
export const NuxtIsland: typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']
export const LazyAppHeader: LazyComponent<typeof import("../components/AppHeader.vue")['default']>
export const LazyCheckoutSteps: LazyComponent<typeof import("../components/CheckoutSteps.vue")['default']>
export const LazyPublicReviewsBlock: LazyComponent<typeof import("../components/PublicReviewsBlock.vue")['default']>
export const LazyAuthChannelModal: LazyComponent<typeof import("../components/auth/AuthChannelModal.vue")['default']>
export const LazyAuthPdConsentCheckbox: LazyComponent<typeof import("../components/auth/PdConsentCheckbox.vue")['default']>
export const LazyCityEventCard: LazyComponent<typeof import("../components/city/CityEventCard.vue")['default']>
export const LazyCityVenueCard: LazyComponent<typeof import("../components/city/CityVenueCard.vue")['default']>
export const LazyDashboardDeliveryZoneMapEditor: LazyComponent<typeof import("../components/dashboard/DeliveryZoneMapEditor.vue")['default']>
export const LazyDashboardOrganizationProductPreviewCard: LazyComponent<typeof import("../components/dashboard/OrganizationProductPreviewCard.vue")['default']>
export const LazyDashboardOrganizationRestaurantPreviewCard: LazyComponent<typeof import("../components/dashboard/OrganizationRestaurantPreviewCard.vue")['default']>
export const LazyLegalCookieBanner: LazyComponent<typeof import("../components/legal/CookieBanner.vue")['default']>
export const LazyMapsOsmClusterMap: LazyComponent<typeof import("../components/maps/OsmClusterMap.vue")['default']>
export const LazyStoriesTopBar: LazyComponent<typeof import("../components/stories/StoriesTopBar.vue")['default']>
export const LazyStoriesStoryGridBanner: LazyComponent<typeof import("../components/stories/StoryGridBanner.vue")['default']>
export const LazyStoriesStoryViewer: LazyComponent<typeof import("../components/stories/StoryViewer.vue")['default']>
export const LazyStoriesStoryViewerSwiper: LazyComponent<typeof import("../components/stories/StoryViewerSwiper.vue")['default']>
export const LazyNuxtWelcome: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']>
export const LazyNuxtLayout: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
export const LazyNuxtErrorBoundary: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
export const LazyClientOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']>
export const LazyDevOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']>
export const LazyServerPlaceholder: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
export const LazyNuxtLink: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']>
export const LazyNuxtLoadingIndicator: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
export const LazyNuxtTime: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
export const LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
export const LazyNuxtImg: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
export const LazyNuxtPicture: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
export const LazyNuxtPage: LazyComponent<typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']>
export const LazyNoScript: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']>
export const LazyLink: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']>
export const LazyBase: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']>
export const LazyTitle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']>
export const LazyMeta: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']>
export const LazyStyle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']>
export const LazyHead: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']>
export const LazyHtml: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']>
export const LazyBody: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']>
export const LazyNuxtIsland: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']>

export const componentNames: string[]
