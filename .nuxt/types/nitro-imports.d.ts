declare global {
  const BRANCH_CANCEL_CALLBACK_PREFIX: typeof import('../../server/utils/orderChatFlowPure').BRANCH_CANCEL_CALLBACK_PREFIX
  const BRANCH_MENU_CALLBACK_PREFIX: typeof import('../../server/utils/orderChatFlowPure').BRANCH_MENU_CALLBACK_PREFIX
  const BRANCH_PICK_CALLBACK_RE: typeof import('../../server/utils/orderChatFlowPure').BRANCH_PICK_CALLBACK_RE
  const CUSTOMER_VISIBLE_ORDER_STATUSES: typeof import('../../server/utils/orderChatFlowPure').CUSTOMER_VISIBLE_ORDER_STATUSES
  const H3Error: typeof import('../../node_modules/h3').H3Error
  const H3Event: typeof import('../../node_modules/h3').H3Event
  const ORDER_CONTACT_CALLBACK_PREFIX: typeof import('../../server/utils/orderChatFlowPure').ORDER_CONTACT_CALLBACK_PREFIX
  const SYSTEM_STYLE_PRESETS: typeof import('../../server/utils/organizationStyle').SYSTEM_STYLE_PRESETS
  const __buildAssetsURL: typeof import('../../node_modules/@nuxt/nitro-server/dist/runtime/utils/paths').buildAssetsURL
  const __publicAssetsURL: typeof import('../../node_modules/@nuxt/nitro-server/dist/runtime/utils/paths').publicAssetsURL
  const accrueLoyaltyEarnForPaidOrder: typeof import('../../server/utils/pricingPromoBonus').accrueLoyaltyEarnForPaidOrder
  const appendCorsHeaders: typeof import('../../node_modules/h3').appendCorsHeaders
  const appendCorsPreflightHeaders: typeof import('../../node_modules/h3').appendCorsPreflightHeaders
  const appendHeader: typeof import('../../node_modules/h3').appendHeader
  const appendHeaders: typeof import('../../node_modules/h3').appendHeaders
  const appendManagerContactButtons: typeof import('../../server/utils/orderChatFlowPure').appendManagerContactButtons
  const appendOrderTimelineEntry: typeof import('../../server/utils/orderFlowActions').appendOrderTimelineEntry
  const appendResponseHeader: typeof import('../../node_modules/h3').appendResponseHeader
  const appendResponseHeaders: typeof import('../../node_modules/h3').appendResponseHeaders
  const applyFestivalModerationAction: typeof import('../../server/utils/festivalUgcModeration').applyFestivalModerationAction
  const applyGlobalFulfillmentPolicy: typeof import('../../server/utils/platformOperationSettings').applyGlobalFulfillmentPolicy
  const applyOrderStatusFromChat: typeof import('../../server/utils/orderFlowActions').applyOrderStatusFromChat
  const applyPresetToConfig: typeof import('../../server/utils/organizationStyle').applyPresetToConfig
  const applyPromoToCart: typeof import('../../server/utils/pricingPromoBonus').applyPromoToCart
  const applyReviewModerationAction: typeof import('../../server/utils/reviewsModeration').applyReviewModerationAction
  const applyReviewPromptTelegramCallback: typeof import('../../server/utils/reviewPromptFlow').applyReviewPromptTelegramCallback
  const assertMethod: typeof import('../../node_modules/h3').assertMethod
  const assertShopIdMatchesTenant: typeof import('../../server/utils/tenant').assertShopIdMatchesTenant
  const assertValidTimeWindows: typeof import('../../server/utils/menuAvailability').assertValidTimeWindows
  const assignOrderBranchFromChat: typeof import('../../server/utils/orderChatFlow').assignOrderBranchFromChat
  const buildAuthSiteLinkUrl: typeof import('../../server/utils/authSiteLink').buildAuthSiteLinkUrl
  const buildBranchCancelCallback: typeof import('../../server/utils/orderChatFlowPure').buildBranchCancelCallback
  const buildBranchMenuCallback: typeof import('../../server/utils/orderChatFlowPure').buildBranchMenuCallback
  const buildBranchPickCallback: typeof import('../../server/utils/orderChatFlowPure').buildBranchPickCallback
  const buildBranchPickerInlineKeyboard: typeof import('../../server/utils/orderChatFlowPure').buildBranchPickerInlineKeyboard
  const buildCustomerStatusShortText: typeof import('../../server/utils/orderChatFlowPure').buildCustomerStatusShortText
  const buildDemoStoryCampaigns: typeof import('../../server/utils/demoStories').buildDemoStoryCampaigns
  const buildManagerOrderInlineKeyboard: typeof import('../../server/utils/orderChatFlowPure').buildManagerOrderInlineKeyboard
  const buildManagerOrderTelegramPayload: typeof import('../../server/utils/orderManagerTelegram').buildManagerOrderTelegramPayload
  const buildOrderContactCallback: typeof import('../../server/utils/orderChatFlowPure').buildOrderContactCallback
  const buildOrderTransferredNoticeText: typeof import('../../server/utils/orderChatFlowPure').buildOrderTransferredNoticeText
  const buildReviewCallbackData: typeof import('../../server/utils/reviewPromptParse').buildReviewCallbackData
  const buildVkAuthorizeUrl: typeof import('../../server/utils/vkOAuth').buildVkAuthorizeUrl
  const cachedEventHandler: typeof import('../../node_modules/nitropack/dist/runtime/internal/cache').cachedEventHandler
  const cachedFunction: typeof import('../../node_modules/nitropack/dist/runtime/internal/cache').cachedFunction
  const callNodeListener: typeof import('../../node_modules/h3').callNodeListener
  const campaignMatchesTargeting: typeof import('../../server/utils/storyTargeting').campaignMatchesTargeting
  const canManageOrderFromManagerChat: typeof import('../../server/utils/orderChatFlow').canManageOrderFromManagerChat
  const capBonusSpend: typeof import('../../server/utils/pricingPromoBonus').capBonusSpend
  const catalogGroupsToOrderValidationShape: typeof import('../../server/utils/productParametersCatalog').catalogGroupsToOrderValidationShape
  const clearResponseHeaders: typeof import('../../node_modules/h3').clearResponseHeaders
  const clearSession: typeof import('../../node_modules/h3').clearSession
  const computeDuplicateQtySumByKey: typeof import('../../server/utils/dashboardOrders').computeDuplicateQtySumByKey
  const computeInternalQualityScore: typeof import('../../server/utils/reviewsAggregation').computeInternalQualityScore
  const computeOrderCountByDuplicateKey: typeof import('../../server/utils/dashboardOrders').computeOrderCountByDuplicateKey
  const computePublicRating: typeof import('../../server/utils/reviewsAggregation').computePublicRating
  const createApp: typeof import('../../node_modules/h3').createApp
  const createAppEventHandler: typeof import('../../node_modules/h3').createAppEventHandler
  const createCustomPreset: typeof import('../../server/utils/organizationStyle').createCustomPreset
  const createError: typeof import('../../node_modules/h3').createError
  const createEvent: typeof import('../../node_modules/h3').createEvent
  const createEventStream: typeof import('../../node_modules/h3').createEventStream
  const createRouter: typeof import('../../node_modules/h3').createRouter
  const createServiceCallEvent: typeof import('../../server/utils/serviceCalls').createServiceCallEvent
  const createSessionToken: typeof import('../../server/utils/session').createSessionToken
  const createYooKassaPayment: typeof import('../../server/utils/yookassa').createYooKassaPayment
  const defaultContentType: typeof import('../../node_modules/h3').defaultContentType
  const defineAppConfig: typeof import('../../node_modules/@nuxt/nitro-server/dist/runtime/utils/config').defineAppConfig
  const defineCachedEventHandler: typeof import('../../node_modules/nitropack/dist/runtime/internal/cache').defineCachedEventHandler
  const defineCachedFunction: typeof import('../../node_modules/nitropack/dist/runtime/internal/cache').defineCachedFunction
  const defineEventHandler: typeof import('../../node_modules/h3').defineEventHandler
  const defineLazyEventHandler: typeof import('../../node_modules/h3').defineLazyEventHandler
  const defineNitroErrorHandler: typeof import('../../node_modules/nitropack/dist/runtime/internal/error/utils').defineNitroErrorHandler
  const defineNitroPlugin: typeof import('../../node_modules/nitropack/dist/runtime/internal/plugin').defineNitroPlugin
  const defineNodeListener: typeof import('../../node_modules/h3').defineNodeListener
  const defineNodeMiddleware: typeof import('../../node_modules/h3').defineNodeMiddleware
  const defineRenderHandler: typeof import('../../node_modules/nitropack/dist/runtime/internal/renderer').defineRenderHandler
  const defineRequestMiddleware: typeof import('../../node_modules/h3').defineRequestMiddleware
  const defineResponseMiddleware: typeof import('../../node_modules/h3').defineResponseMiddleware
  const defineRouteMeta: typeof import('../../node_modules/nitropack/dist/runtime/internal/meta').defineRouteMeta
  const defineTask: typeof import('../../node_modules/nitropack/dist/runtime/internal/task').defineTask
  const defineWebSocket: typeof import('../../node_modules/h3').defineWebSocket
  const defineWebSocketHandler: typeof import('../../node_modules/h3').defineWebSocketHandler
  const deleteCookie: typeof import('../../node_modules/h3').deleteCookie
  const dispatchIikoOutbox: typeof import('../../server/utils/iiko').dispatchIikoOutbox
  const dispatchNotificationEvent: typeof import('../../server/utils/notifications').dispatchNotificationEvent
  const dispatchQuickRestoOutbox: typeof import('../../server/utils/quickresto').dispatchQuickRestoOutbox
  const dynamicEventHandler: typeof import('../../node_modules/h3').dynamicEventHandler
  const enqueueIikoOrderOutbox: typeof import('../../server/utils/iiko').enqueueIikoOrderOutbox
  const enqueueManualReviewPrompts: typeof import('../../server/utils/reviewPromptFlow').enqueueManualReviewPrompts
  const enqueueQuickRestoOrderOutbox: typeof import('../../server/utils/quickresto').enqueueQuickRestoOrderOutbox
  const enrichManagerKeyboardFromOrder: typeof import('../../server/utils/orderManagerCustomerContact').enrichManagerKeyboardFromOrder
  const ensureMaxCustomerProfile: typeof import('../../server/utils/ensureMaxCustomerProfile').ensureMaxCustomerProfile
  const ensureTelegramCustomerProfile: typeof import('../../server/utils/ensureTelegramCustomerProfile').ensureTelegramCustomerProfile
  const evaluateMenuAvailability: typeof import('../../server/utils/menuAvailability').evaluateMenuAvailability
  const eventHandler: typeof import('../../node_modules/h3').eventHandler
  const exchangeVkCode: typeof import('../../server/utils/vkOAuth').exchangeVkCode
  const extractBotIdFromInitData: typeof import('../../server/utils/tenant').extractBotIdFromInitData
  const extractShopIdFromInitData: typeof import('../../server/utils/tenant').extractShopIdFromInitData
  const fetchProductParameterGroupsByProductId: typeof import('../../server/utils/productParametersCatalog').fetchProductParameterGroupsByProductId
  const fetchPromoByCode: typeof import('../../server/utils/pricingPromoBonus').fetchPromoByCode
  const fetchShopLoyaltySettings: typeof import('../../server/utils/pricingPromoBonus').fetchShopLoyaltySettings
  const fetchVkUserInfo: typeof import('../../server/utils/vkOAuth').fetchVkUserInfo
  const fetchWithEvent: typeof import('../../node_modules/h3').fetchWithEvent
  const findProfileIdByPhone: typeof import('../../server/utils/accountPhoneLink').findProfileIdByPhone
  const formatBranchPickerButtonLabel: typeof import('../../server/utils/orderChatFlowPure').formatBranchPickerButtonLabel
  const formatManagerCustomerLine: typeof import('../../server/utils/orderChatFlowPure').formatManagerCustomerLine
  const fromNodeMiddleware: typeof import('../../node_modules/h3').fromNodeMiddleware
  const fromPlainHandler: typeof import('../../node_modules/h3').fromPlainHandler
  const fromWebHandler: typeof import('../../node_modules/h3').fromWebHandler
  const generateVkPkcePair: typeof import('../../server/utils/vkOAuth').generateVkPkcePair
  const getAllowedOrderStatusTransitions: typeof import('../../server/utils/dashboardOrders').getAllowedOrderStatusTransitions
  const getCookie: typeof import('../../node_modules/h3').getCookie
  const getCustomPresets: typeof import('../../server/utils/organizationStyle').getCustomPresets
  const getCustomerBalance: typeof import('../../server/utils/pricingPromoBonus').getCustomerBalance
  const getDefaultOrganizationSettings: typeof import('../../server/utils/organizationStyle').getDefaultOrganizationSettings
  const getDefaultStyleConfig: typeof import('../../server/utils/organizationStyle').getDefaultStyleConfig
  const getHeader: typeof import('../../node_modules/h3').getHeader
  const getHeaders: typeof import('../../node_modules/h3').getHeaders
  const getIikoClient: typeof import('../../server/utils/iiko').getIikoClient
  const getMaxBotTokenForShop: typeof import('../../server/utils/messengerInitData').getMaxBotTokenForShop
  const getMessengerInitDataFromEvent: typeof import('../../server/utils/messengerInitData').getMessengerInitDataFromEvent
  const getMethod: typeof import('../../node_modules/h3').getMethod
  const getOrganizationSettings: typeof import('../../server/utils/organizationStyle').getOrganizationSettings
  const getPlatformOperationSettings: typeof import('../../server/utils/platformOperationSettings').getPlatformOperationSettings
  const getProfilePhone: typeof import('../../server/utils/accountPhoneLink').getProfilePhone
  const getProxyRequestHeaders: typeof import('../../node_modules/h3').getProxyRequestHeaders
  const getQuery: typeof import('../../node_modules/h3').getQuery
  const getQuickRestoClient: typeof import('../../server/utils/quickresto').getQuickRestoClient
  const getRequestFingerprint: typeof import('../../node_modules/h3').getRequestFingerprint
  const getRequestHeader: typeof import('../../node_modules/h3').getRequestHeader
  const getRequestHeaders: typeof import('../../node_modules/h3').getRequestHeaders
  const getRequestHost: typeof import('../../node_modules/h3').getRequestHost
  const getRequestIP: typeof import('../../node_modules/h3').getRequestIP
  const getRequestPath: typeof import('../../node_modules/h3').getRequestPath
  const getRequestProtocol: typeof import('../../node_modules/h3').getRequestProtocol
  const getRequestURL: typeof import('../../node_modules/h3').getRequestURL
  const getRequestWebStream: typeof import('../../node_modules/h3').getRequestWebStream
  const getResponseHeader: typeof import('../../node_modules/h3').getResponseHeader
  const getResponseHeaders: typeof import('../../node_modules/h3').getResponseHeaders
  const getResponseStatus: typeof import('../../node_modules/h3').getResponseStatus
  const getResponseStatusText: typeof import('../../node_modules/h3').getResponseStatusText
  const getRouteRules: typeof import('../../node_modules/nitropack/dist/runtime/internal/route-rules').getRouteRules
  const getRouterParam: typeof import('../../node_modules/h3').getRouterParam
  const getRouterParams: typeof import('../../node_modules/h3').getRouterParams
  const getServiceCallLabel: typeof import('../../server/utils/serviceCalls').getServiceCallLabel
  const getSession: typeof import('../../node_modules/h3').getSession
  const getShopByBotId: typeof import('../../server/utils/tenant').getShopByBotId
  const getShopByCustomDomain: typeof import('../../server/utils/tenant').getShopByCustomDomain
  const getShopById: typeof import('../../server/utils/tenant').getShopById
  const getStaffResponseText: typeof import('../../server/utils/serviceCalls').getStaffResponseText
  const getStyleRecord: typeof import('../../server/utils/organizationStyle').getStyleRecord
  const getSystemPresets: typeof import('../../server/utils/organizationStyle').getSystemPresets
  const getUnifiedFlowConfig: typeof import('../../server/utils/orderFlowActions').getUnifiedFlowConfig
  const getValidatedQuery: typeof import('../../node_modules/h3').getValidatedQuery
  const getValidatedRouterParams: typeof import('../../node_modules/h3').getValidatedRouterParams
  const handleCacheHeaders: typeof import('../../node_modules/h3').handleCacheHeaders
  const handleCors: typeof import('../../node_modules/h3').handleCors
  const handleTelegramOrderContactCallback: typeof import('../../server/utils/orderManagerCustomerContact').handleTelegramOrderContactCallback
  const insertShopReview: typeof import('../../server/utils/shopReviewWrite').insertShopReview
  const isCorsOriginAllowed: typeof import('../../node_modules/h3').isCorsOriginAllowed
  const isCustomerBannedForFestival: typeof import('../../server/utils/festivalUgc').isCustomerBannedForFestival
  const isError: typeof import('../../node_modules/h3').isError
  const isEvent: typeof import('../../node_modules/h3').isEvent
  const isEventHandler: typeof import('../../node_modules/h3').isEventHandler
  const isMethod: typeof import('../../node_modules/h3').isMethod
  const isPreflightRequest: typeof import('../../node_modules/h3').isPreflightRequest
  const isShopFeatureEnabled: typeof import('../../server/utils/features').isShopFeatureEnabled
  const isStream: typeof import('../../node_modules/h3').isStream
  const isTargetingEmpty: typeof import('../../server/utils/storyTargeting').isTargetingEmpty
  const isWebResponse: typeof import('../../node_modules/h3').isWebResponse
  const lazyEventHandler: typeof import('../../node_modules/h3').lazyEventHandler
  const loadActiveShopBranches: typeof import('../../server/utils/orderChatFlow').loadActiveShopBranches
  const loadEligibleFestivalOrders: typeof import('../../server/utils/festivalUgc').loadEligibleFestivalOrders
  const loadOrderCustomerContact: typeof import('../../server/utils/orderManagerCustomerContact').loadOrderCustomerContact
  const loadTenantProductsForOrder: typeof import('../../server/utils/orderLinePricing').loadTenantProductsForOrder
  const mapActionToStatus: typeof import('../../server/utils/serviceCalls').mapActionToStatus
  const mapChatCallbackToOrderStatus: typeof import('../../server/utils/orderChatFlowPure').mapChatCallbackToOrderStatus
  const markReviewPromptsCompletedForOrder: typeof import('../../server/utils/shopReviewWrite').markReviewPromptsCompletedForOrder
  const maxStarLinkAttachments: typeof import('../../server/utils/reviewPromptParse').maxStarLinkAttachments
  const mergeMetadataWithTimeline: typeof import('../../server/utils/dashboardOrders').mergeMetadataWithTimeline
  const migrateCustomerDeliveryAddresses: typeof import('../../server/utils/customerDeliveryAddressMerge').migrateCustomerDeliveryAddresses
  const nitroPlugin: typeof import('../../node_modules/nitropack/dist/runtime/internal/plugin').nitroPlugin
  const normalizeDashboardStatus: typeof import('../../server/utils/dashboardOrders').normalizeDashboardStatus
  const normalizeOrderItemsJson: typeof import('../../server/utils/dashboardOrders').normalizeOrderItemsJson
  const normalizePhone: typeof import('../../server/utils/accountPhoneLink').normalizePhone
  const normalizePromoCode: typeof import('../../server/utils/pricingPromoBonus').normalizePromoCode
  const normalizeTimeWindows: typeof import('../../server/utils/menuAvailability').normalizeTimeWindows
  const orderContactToKeyboardContext: typeof import('../../server/utils/orderManagerCustomerContact').orderContactToKeyboardContext
  const orderItemDuplicateKey: typeof import('../../server/utils/dashboardOrders').orderItemDuplicateKey
  const parseAuthLinkTokenUuidFromText: typeof import('../../server/utils/authSiteLink').parseAuthLinkTokenUuidFromText
  const parseBranchCallback: typeof import('../../server/utils/orderChatFlowPure').parseBranchCallback
  const parseCookies: typeof import('../../node_modules/h3').parseCookies
  const parseListLimit: typeof import('../../server/utils/reviews').parseListLimit
  const parseMaxReviewRateStartPayload: typeof import('../../server/utils/reviewPromptParse').parseMaxReviewRateStartPayload
  const parseOrderContactCallback: typeof import('../../server/utils/orderChatFlowPure').parseOrderContactCallback
  const parseOrderMetadata: typeof import('../../server/utils/dashboardOrders').parseOrderMetadata
  const parseReviewTokenCallback: typeof import('../../server/utils/reviewPromptParse').parseReviewTokenCallback
  const persistManagerTelegramPost: typeof import('../../server/utils/orderManagerTelegram').persistManagerTelegramPost
  const persistOrganizationSettings: typeof import('../../server/utils/organizationStyle').persistOrganizationSettings
  const persistStyleRecord: typeof import('../../server/utils/organizationStyle').persistStyleRecord
  const priceCartItemsFromCatalog: typeof import('../../server/utils/orderLinePricing').priceCartItemsFromCatalog
  const processDueReviewPrompts: typeof import('../../server/utils/reviewPromptFlow').processDueReviewPrompts
  const promisifyNodeListener: typeof import('../../node_modules/h3').promisifyNodeListener
  const proxyRequest: typeof import('../../node_modules/h3').proxyRequest
  const readBody: typeof import('../../node_modules/h3').readBody
  const readFormData: typeof import('../../node_modules/h3').readFormData
  const readHeaderShopId: typeof import('../../server/utils/reviews').readHeaderShopId
  const readMultipartFormData: typeof import('../../node_modules/h3').readMultipartFormData
  const readRawBody: typeof import('../../node_modules/h3').readRawBody
  const readValidatedBody: typeof import('../../node_modules/h3').readValidatedBody
  const removeResponseHeader: typeof import('../../node_modules/h3').removeResponseHeader
  const requestCustomerContactForOrder: typeof import('../../server/utils/orderManagerCustomerContact').requestCustomerContactForOrder
  const requireDashboardAccess: typeof import('../../server/utils/dashboard').requireDashboardAccess
  const requireOwnedOrderForReview: typeof import('../../server/utils/reviews').requireOwnedOrderForReview
  const requireRestaurantForShop: typeof import('../../server/utils/tenant').requireRestaurantForShop
  const requireRestaurantZoneForShop: typeof import('../../server/utils/tenant').requireRestaurantZoneForShop
  const requireReviewsFeature: typeof import('../../server/utils/reviews').requireReviewsFeature
  const requireShopFeature: typeof import('../../server/utils/features').requireShopFeature
  const requireTenantShop: typeof import('../../server/utils/tenant').requireTenantShop
  const resolveCanonicalTenantCartPath: typeof import('../../server/utils/tenant').resolveCanonicalTenantCartPath
  const resolveCityBySlug: typeof import('../../server/utils/inuuCity').resolveCityBySlug
  const resolveCustomerIdentityOrThrow: typeof import('../../server/utils/festivalUgc').resolveCustomerIdentityOrThrow
  const resolveCustomerProfileId: typeof import('../../server/utils/customerProfile').resolveCustomerProfileId
  const resolveDeliveryForPoint: typeof import('../../server/utils/resolveDeliveryForPoint').resolveDeliveryForPoint
  const resolveDeliveryRestricted: typeof import('../../server/utils/menuAvailability').resolveDeliveryRestricted
  const resolveEffectiveTimeWindows: typeof import('../../server/utils/menuAvailability').resolveEffectiveTimeWindows
  const resolveFestivalOrThrow: typeof import('../../server/utils/festivalUgc').resolveFestivalOrThrow
  const resolveIikoConfig: typeof import('../../server/utils/iiko').resolveIikoConfig
  const resolveInitialReviewStatus: typeof import('../../server/utils/reviews').resolveInitialReviewStatus
  const resolveManagerNotificationMode: typeof import('../../server/utils/reviews').resolveManagerNotificationMode
  const resolveQuickRestoConfig: typeof import('../../server/utils/quickresto').resolveQuickRestoConfig
  const resolveReviewIdentity: typeof import('../../server/utils/reviews').resolveReviewIdentity
  const resolveReviewPromptDelayMinutes: typeof import('../../server/utils/reviewPromptFlow').resolveReviewPromptDelayMinutes
  const resolveShopIdFromEvent: typeof import('../../server/utils/tenant').resolveShopIdFromEvent
  const reviewPromptPlainText: typeof import('../../server/utils/reviewPromptParse').reviewPromptPlainText
  const runTask: typeof import('../../node_modules/nitropack/dist/runtime/internal/task').runTask
  const sanitizeReviewComment: typeof import('../../server/utils/reviews').sanitizeReviewComment
  const sanitizeStatusCode: typeof import('../../node_modules/h3').sanitizeStatusCode
  const sanitizeStatusMessage: typeof import('../../node_modules/h3').sanitizeStatusMessage
  const sanitizeVideoUrl: typeof import('../../server/utils/reviews').sanitizeVideoUrl
  const scheduleReviewPromptsAfterHanded: typeof import('../../server/utils/reviewPromptFlow').scheduleReviewPromptsAfterHanded
  const sealSession: typeof import('../../node_modules/h3').sealSession
  const send: typeof import('../../node_modules/h3').send
  const sendError: typeof import('../../node_modules/h3').sendError
  const sendFestivalSubmissionToModeration: typeof import('../../server/utils/festivalUgcModeration').sendFestivalSubmissionToModeration
  const sendIterable: typeof import('../../node_modules/h3').sendIterable
  const sendMax: typeof import('../../server/utils/serviceCalls').sendMax
  const sendNoContent: typeof import('../../node_modules/h3').sendNoContent
  const sendProxy: typeof import('../../node_modules/h3').sendProxy
  const sendRedirect: typeof import('../../node_modules/h3').sendRedirect
  const sendReviewToManager: typeof import('../../server/utils/reviewsModeration').sendReviewToManager
  const sendStream: typeof import('../../node_modules/h3').sendStream
  const sendTelegram: typeof import('../../server/utils/serviceCalls').sendTelegram
  const sendWebResponse: typeof import('../../node_modules/h3').sendWebResponse
  const serveStatic: typeof import('../../node_modules/h3').serveStatic
  const setCookie: typeof import('../../node_modules/h3').setCookie
  const setHeader: typeof import('../../node_modules/h3').setHeader
  const setHeaders: typeof import('../../node_modules/h3').setHeaders
  const setProfilePhone: typeof import('../../server/utils/accountPhoneLink').setProfilePhone
  const setResponseHeader: typeof import('../../node_modules/h3').setResponseHeader
  const setResponseHeaders: typeof import('../../node_modules/h3').setResponseHeaders
  const setResponseStatus: typeof import('../../node_modules/h3').setResponseStatus
  const shouldNotifyCustomerOfStatus: typeof import('../../server/utils/orderChatFlowPure').shouldNotifyCustomerOfStatus
  const splitCookiesString: typeof import('../../node_modules/h3').splitCookiesString
  const sumCartLines: typeof import('../../server/utils/orderLinePricing').sumCartLines
  const syncTelegramChatsAfterBranchTransfer: typeof import('../../server/utils/orderManagerTelegram').syncTelegramChatsAfterBranchTransfer
  const telegramChangeRatingRow: typeof import('../../server/utils/reviewPromptParse').telegramChangeRatingRow
  const telegramStarKeyboardRows: typeof import('../../server/utils/reviewPromptParse').telegramStarKeyboardRows
  const toEventHandler: typeof import('../../node_modules/h3').toEventHandler
  const toNodeListener: typeof import('../../node_modules/h3').toNodeListener
  const toPlainHandler: typeof import('../../node_modules/h3').toPlainHandler
  const toWebHandler: typeof import('../../node_modules/h3').toWebHandler
  const toWebRequest: typeof import('../../node_modules/h3').toWebRequest
  const uniqueNonEmptyTokens: typeof import('../../server/utils/messengerInitData').uniqueNonEmptyTokens
  const unsealSession: typeof import('../../node_modules/h3').unsealSession
  const updateManagerMessageBranchLines: typeof import('../../server/utils/orderChatFlowPure').updateManagerMessageBranchLines
  const updateSession: typeof import('../../node_modules/h3').updateSession
  const updateShopReviewRating: typeof import('../../server/utils/shopReviewWrite').updateShopReviewRating
  const useAppConfig: typeof import('../../node_modules/nitropack/dist/runtime/internal/config').useAppConfig
  const useBase: typeof import('../../node_modules/h3').useBase
  const useEvent: typeof import('../../node_modules/nitropack/dist/runtime/internal/context').useEvent
  const useNitroApp: typeof import('../../node_modules/nitropack/dist/runtime/internal/app').useNitroApp
  const useRuntimeConfig: typeof import('../../node_modules/nitropack/dist/runtime/internal/config').useRuntimeConfig
  const useSession: typeof import('../../node_modules/h3').useSession
  const useStorage: typeof import('../../node_modules/nitropack/dist/runtime/internal/storage').useStorage
  const validateOrganizationContactsSettings: typeof import('../../server/utils/organizationStyle').validateOrganizationContactsSettings
  const validateOrganizationOperationsSettings: typeof import('../../server/utils/organizationStyle').validateOrganizationOperationsSettings
  const validateOrganizationSettings: typeof import('../../server/utils/organizationStyle').validateOrganizationSettings
  const validateStyleConfig: typeof import('../../server/utils/organizationStyle').validateStyleConfig
  const validateWebAppInitData: typeof import('../../server/utils/messengerInitData').validateWebAppInitData
  const validateWebAppInitDataAnyToken: typeof import('../../server/utils/messengerInitData').validateWebAppInitDataAnyToken
  const verifySessionToken: typeof import('../../server/utils/session').verifySessionToken
  const withAuditEntry: typeof import('../../server/utils/organizationStyle').withAuditEntry
  const writeEarlyHints: typeof import('../../node_modules/h3').writeEarlyHints
}
// for type re-export
declare global {
  // @ts-ignore
  export type { EventHandler, EventHandlerRequest, EventHandlerResponse, EventHandlerObject, H3EventContext } from '../../node_modules/h3'
  import('../../node_modules/h3')
  // @ts-ignore
  export type { LinkContextPayload } from '../../server/utils/authSiteLink'
  import('../../server/utils/authSiteLink')
  // @ts-ignore
  export type { DashboardAccess } from '../../server/utils/dashboard'
  import('../../server/utils/dashboard')
  // @ts-ignore
  export type { NormalizedOrderItem, TimelineEntry, DashboardOrderStatus } from '../../server/utils/dashboardOrders'
  import('../../server/utils/dashboardOrders')
  // @ts-ignore
  export type { FestivalRow, CustomerIdentity } from '../../server/utils/festivalUgc'
  import('../../server/utils/festivalUgc')
  // @ts-ignore
  export type { IikoMode, IikoConfig, IikoMenuCategory, IikoMenuItem, IikoStopListItem, IikoClient } from '../../server/utils/iiko'
  import('../../server/utils/iiko')
  // @ts-ignore
  export type { InuuCityRow } from '../../server/utils/inuuCity'
  import('../../server/utils/inuuCity')
  // @ts-ignore
  export type { FulfillmentType, MenuTimeWindow } from '../../server/utils/menuAvailability'
  import('../../server/utils/menuAvailability')
  // @ts-ignore
  export type { WebAppInitUser } from '../../server/utils/messengerInitData'
  import('../../server/utils/messengerInitData')
  // @ts-ignore
  export type { NotificationEventType, NotificationChannel, NotificationTargetType, NotificationEvent } from '../../server/utils/notifications'
  import('../../server/utils/notifications')
  // @ts-ignore
  export type { AssignBranchResult } from '../../server/utils/orderChatFlow'
  import('../../server/utils/orderChatFlow')
  // @ts-ignore
  export type { OrderClientChannel, ShopBranchRow, ParsedBranchCallback, ManagerCustomerContactContext, ChatFlowOrderStatus } from '../../server/utils/orderChatFlowPure'
  import('../../server/utils/orderChatFlowPure')
  // @ts-ignore
  export type { UnifiedFlowConfig } from '../../server/utils/orderFlowActions'
  import('../../server/utils/orderFlowActions')
  // @ts-ignore
  export type { SelectedModifierPayload, SelectedParameterPayload, CartItemPayload, ProductRow } from '../../server/utils/orderLinePricing'
  import('../../server/utils/orderLinePricing')
  // @ts-ignore
  export type { OrderCustomerContact } from '../../server/utils/orderManagerCustomerContact'
  import('../../server/utils/orderManagerCustomerContact')
  // @ts-ignore
  export type { ManagerTelegramPost } from '../../server/utils/orderManagerTelegram'
  import('../../server/utils/orderManagerTelegram')
  // @ts-ignore
  export type { FulfillmentMode } from '../../server/utils/platformOperationSettings'
  import('../../server/utils/platformOperationSettings')
  // @ts-ignore
  export type { ShopPromoRow, ShopLoyaltySettingsRow, PromoApplyResult } from '../../server/utils/pricingPromoBonus'
  import('../../server/utils/pricingPromoBonus')
  // @ts-ignore
  export type { CatalogProductRef, CatalogParameterOption, CatalogParameterGroup } from '../../server/utils/productParametersCatalog'
  import('../../server/utils/productParametersCatalog')
  // @ts-ignore
  export type { QuickRestoMode, QuickRestoConfig, QuickRestoMenuCategory, QuickRestoMenuItem, QuickRestoStopListItem, QuickRestoClient } from '../../server/utils/quickresto'
  import('../../server/utils/quickresto')
  // @ts-ignore
  export type { ResolvedDeliveryChoice, ResolveDeliveryForPointResult } from '../../server/utils/resolveDeliveryForPoint'
  import('../../server/utils/resolveDeliveryForPoint')
  // @ts-ignore
  export type { ParsedReviewTokenCallback } from '../../server/utils/reviewPromptParse'
  import('../../server/utils/reviewPromptParse')
  // @ts-ignore
  export type { ReviewStatus, ReviewIdentity } from '../../server/utils/reviews'
  import('../../server/utils/reviews')
  // @ts-ignore
  export type { PublicRatingResult, InternalQualityResult } from '../../server/utils/reviewsAggregation'
  import('../../server/utils/reviewsAggregation')
  // @ts-ignore
  export type { ServiceCallType, ServiceCallStatus, ServiceCallChannel } from '../../server/utils/serviceCalls'
  import('../../server/utils/serviceCalls')
  // @ts-ignore
  export type { TelegramSessionUser } from '../../server/utils/session'
  import('../../server/utils/session')
  // @ts-ignore
  export type { OrderRowForReview } from '../../server/utils/shopReviewWrite'
  import('../../server/utils/shopReviewWrite')
  // @ts-ignore
  export type { StoryTargeting, ViewerContext } from '../../server/utils/storyTargeting'
  import('../../server/utils/storyTargeting')
  // @ts-ignore
  export type { TenantShop, TenantRestaurant, TenantRestaurantZone } from '../../server/utils/tenant'
  import('../../server/utils/tenant')
  // @ts-ignore
  export type { VkPkcePair, VkTokenExchangeResult, VkUserInfoResult } from '../../server/utils/vkOAuth'
  import('../../server/utils/vkOAuth')
  // @ts-ignore
  export type { YooKassaCreatePaymentResult } from '../../server/utils/yookassa'
  import('../../server/utils/yookassa')
}
export { H3Event, H3Error, appendCorsHeaders, appendCorsPreflightHeaders, appendHeader, appendHeaders, appendResponseHeader, appendResponseHeaders, assertMethod, callNodeListener, clearResponseHeaders, clearSession, createApp, createAppEventHandler, createError, createEvent, createEventStream, createRouter, defaultContentType, defineEventHandler, defineLazyEventHandler, defineNodeListener, defineNodeMiddleware, defineRequestMiddleware, defineResponseMiddleware, defineWebSocket, defineWebSocketHandler, deleteCookie, dynamicEventHandler, eventHandler, fetchWithEvent, fromNodeMiddleware, fromPlainHandler, fromWebHandler, getCookie, getHeader, getHeaders, getMethod, getProxyRequestHeaders, getQuery, getRequestFingerprint, getRequestHeader, getRequestHeaders, getRequestHost, getRequestIP, getRequestPath, getRequestProtocol, getRequestURL, getRequestWebStream, getResponseHeader, getResponseHeaders, getResponseStatus, getResponseStatusText, getRouterParam, getRouterParams, getSession, getValidatedQuery, getValidatedRouterParams, handleCacheHeaders, handleCors, isCorsOriginAllowed, isError, isEvent, isEventHandler, isMethod, isPreflightRequest, isStream, isWebResponse, lazyEventHandler, parseCookies, promisifyNodeListener, proxyRequest, readBody, readFormData, readMultipartFormData, readRawBody, readValidatedBody, removeResponseHeader, sanitizeStatusCode, sanitizeStatusMessage, sealSession, send, sendError, sendIterable, sendNoContent, sendProxy, sendRedirect, sendStream, sendWebResponse, serveStatic, setCookie, setHeader, setHeaders, setResponseHeader, setResponseHeaders, setResponseStatus, splitCookiesString, toEventHandler, toNodeListener, toPlainHandler, toWebHandler, toWebRequest, unsealSession, updateSession, useBase, useSession, writeEarlyHints } from 'h3';
export { useNitroApp } from 'nitropack/runtime/internal/app';
export { useRuntimeConfig, useAppConfig } from 'nitropack/runtime/internal/config';
export { defineNitroPlugin, nitroPlugin } from 'nitropack/runtime/internal/plugin';
export { defineCachedFunction, defineCachedEventHandler, cachedFunction, cachedEventHandler } from 'nitropack/runtime/internal/cache';
export { useStorage } from 'nitropack/runtime/internal/storage';
export { defineRenderHandler } from 'nitropack/runtime/internal/renderer';
export { defineRouteMeta } from 'nitropack/runtime/internal/meta';
export { getRouteRules } from 'nitropack/runtime/internal/route-rules';
export { useEvent } from 'nitropack/runtime/internal/context';
export { defineTask, runTask } from 'nitropack/runtime/internal/task';
export { defineNitroErrorHandler } from 'nitropack/runtime/internal/error/utils';
export { buildAssetsURL as __buildAssetsURL, publicAssetsURL as __publicAssetsURL } from '/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/@nuxt/nitro-server/dist/runtime/utils/paths';
export { defineAppConfig } from '/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/@nuxt/nitro-server/dist/runtime/utils/config';
export { normalizePhone, findProfileIdByPhone, getProfilePhone, setProfilePhone } from '/Users/arsalanbaranzaev/Desktop/projects/incity-new/server/utils/accountPhoneLink';
export { parseAuthLinkTokenUuidFromText, buildAuthSiteLinkUrl } from '/Users/arsalanbaranzaev/Desktop/projects/incity-new/server/utils/authSiteLink';
export { migrateCustomerDeliveryAddresses } from '/Users/arsalanbaranzaev/Desktop/projects/incity-new/server/utils/customerDeliveryAddressMerge';
export { resolveCustomerProfileId } from '/Users/arsalanbaranzaev/Desktop/projects/incity-new/server/utils/customerProfile';
export { requireDashboardAccess } from '/Users/arsalanbaranzaev/Desktop/projects/incity-new/server/utils/dashboard';
export { orderItemDuplicateKey, normalizeOrderItemsJson, computeDuplicateQtySumByKey, computeOrderCountByDuplicateKey, parseOrderMetadata, mergeMetadataWithTimeline, normalizeDashboardStatus, getAllowedOrderStatusTransitions } from '/Users/arsalanbaranzaev/Desktop/projects/incity-new/server/utils/dashboardOrders';
export { buildDemoStoryCampaigns } from '/Users/arsalanbaranzaev/Desktop/projects/incity-new/server/utils/demoStories';
export { ensureMaxCustomerProfile } from '/Users/arsalanbaranzaev/Desktop/projects/incity-new/server/utils/ensureMaxCustomerProfile';
export { ensureTelegramCustomerProfile } from '/Users/arsalanbaranzaev/Desktop/projects/incity-new/server/utils/ensureTelegramCustomerProfile';
export { isShopFeatureEnabled, requireShopFeature } from '/Users/arsalanbaranzaev/Desktop/projects/incity-new/server/utils/features';
export { resolveFestivalOrThrow, resolveCustomerIdentityOrThrow, isCustomerBannedForFestival, loadEligibleFestivalOrders } from '/Users/arsalanbaranzaev/Desktop/projects/incity-new/server/utils/festivalUgc';
export { sendFestivalSubmissionToModeration, applyFestivalModerationAction } from '/Users/arsalanbaranzaev/Desktop/projects/incity-new/server/utils/festivalUgcModeration';
export { resolveIikoConfig, getIikoClient, enqueueIikoOrderOutbox, dispatchIikoOutbox } from '/Users/arsalanbaranzaev/Desktop/projects/incity-new/server/utils/iiko';
export { resolveCityBySlug } from '/Users/arsalanbaranzaev/Desktop/projects/incity-new/server/utils/inuuCity';
export { normalizeTimeWindows, assertValidTimeWindows, resolveDeliveryRestricted, resolveEffectiveTimeWindows, evaluateMenuAvailability } from '/Users/arsalanbaranzaev/Desktop/projects/incity-new/server/utils/menuAvailability';
export { getMessengerInitDataFromEvent, validateWebAppInitData, uniqueNonEmptyTokens, validateWebAppInitDataAnyToken, getMaxBotTokenForShop } from '/Users/arsalanbaranzaev/Desktop/projects/incity-new/server/utils/messengerInitData';
export { dispatchNotificationEvent } from '/Users/arsalanbaranzaev/Desktop/projects/incity-new/server/utils/notifications';
export { loadActiveShopBranches, canManageOrderFromManagerChat, assignOrderBranchFromChat } from '/Users/arsalanbaranzaev/Desktop/projects/incity-new/server/utils/orderChatFlow';
export { BRANCH_MENU_CALLBACK_PREFIX, BRANCH_CANCEL_CALLBACK_PREFIX, BRANCH_PICK_CALLBACK_RE, ORDER_CONTACT_CALLBACK_PREFIX, buildOrderContactCallback, parseOrderContactCallback, buildBranchMenuCallback, buildBranchCancelCallback, buildBranchPickCallback, parseBranchCallback, CUSTOMER_VISIBLE_ORDER_STATUSES, shouldNotifyCustomerOfStatus, formatManagerCustomerLine, appendManagerContactButtons, buildManagerOrderInlineKeyboard, buildOrderTransferredNoticeText, formatBranchPickerButtonLabel, buildBranchPickerInlineKeyboard, updateManagerMessageBranchLines, mapChatCallbackToOrderStatus, buildCustomerStatusShortText } from '/Users/arsalanbaranzaev/Desktop/projects/incity-new/server/utils/orderChatFlowPure';
export { getUnifiedFlowConfig, appendOrderTimelineEntry, applyOrderStatusFromChat } from '/Users/arsalanbaranzaev/Desktop/projects/incity-new/server/utils/orderFlowActions';
export { loadTenantProductsForOrder, priceCartItemsFromCatalog, sumCartLines } from '/Users/arsalanbaranzaev/Desktop/projects/incity-new/server/utils/orderLinePricing';
export { loadOrderCustomerContact, orderContactToKeyboardContext, requestCustomerContactForOrder, handleTelegramOrderContactCallback, enrichManagerKeyboardFromOrder } from '/Users/arsalanbaranzaev/Desktop/projects/incity-new/server/utils/orderManagerCustomerContact';
export { buildManagerOrderTelegramPayload, persistManagerTelegramPost, syncTelegramChatsAfterBranchTransfer } from '/Users/arsalanbaranzaev/Desktop/projects/incity-new/server/utils/orderManagerTelegram';
export { SYSTEM_STYLE_PRESETS, getDefaultStyleConfig, getDefaultOrganizationSettings, getStyleRecord, getOrganizationSettings, persistOrganizationSettings, getCustomPresets, createCustomPreset, persistStyleRecord, applyPresetToConfig, getSystemPresets, validateOrganizationOperationsSettings, validateOrganizationContactsSettings, validateOrganizationSettings, validateStyleConfig, withAuditEntry } from '/Users/arsalanbaranzaev/Desktop/projects/incity-new/server/utils/organizationStyle';
export { getPlatformOperationSettings, applyGlobalFulfillmentPolicy } from '/Users/arsalanbaranzaev/Desktop/projects/incity-new/server/utils/platformOperationSettings';
export { normalizePromoCode, fetchShopLoyaltySettings, fetchPromoByCode, applyPromoToCart, getCustomerBalance, capBonusSpend, accrueLoyaltyEarnForPaidOrder } from '/Users/arsalanbaranzaev/Desktop/projects/incity-new/server/utils/pricingPromoBonus';
export { fetchProductParameterGroupsByProductId, catalogGroupsToOrderValidationShape } from '/Users/arsalanbaranzaev/Desktop/projects/incity-new/server/utils/productParametersCatalog';
export { resolveQuickRestoConfig, getQuickRestoClient, enqueueQuickRestoOrderOutbox, dispatchQuickRestoOutbox } from '/Users/arsalanbaranzaev/Desktop/projects/incity-new/server/utils/quickresto';
export { resolveDeliveryForPoint } from '/Users/arsalanbaranzaev/Desktop/projects/incity-new/server/utils/resolveDeliveryForPoint';
export { resolveReviewPromptDelayMinutes, scheduleReviewPromptsAfterHanded, processDueReviewPrompts, enqueueManualReviewPrompts, applyReviewPromptTelegramCallback } from '/Users/arsalanbaranzaev/Desktop/projects/incity-new/server/utils/reviewPromptFlow';
export { parseReviewTokenCallback, buildReviewCallbackData, reviewPromptPlainText, telegramStarKeyboardRows, telegramChangeRatingRow, maxStarLinkAttachments, parseMaxReviewRateStartPayload } from '/Users/arsalanbaranzaev/Desktop/projects/incity-new/server/utils/reviewPromptParse';
export { requireReviewsFeature, resolveReviewIdentity, requireOwnedOrderForReview, sanitizeReviewComment, sanitizeVideoUrl, resolveInitialReviewStatus, resolveManagerNotificationMode, parseListLimit, readHeaderShopId } from '/Users/arsalanbaranzaev/Desktop/projects/incity-new/server/utils/reviews';
export { computePublicRating, computeInternalQualityScore } from '/Users/arsalanbaranzaev/Desktop/projects/incity-new/server/utils/reviewsAggregation';
export { sendReviewToManager, applyReviewModerationAction } from '/Users/arsalanbaranzaev/Desktop/projects/incity-new/server/utils/reviewsModeration';
export { getServiceCallLabel, getStaffResponseText, mapActionToStatus, sendTelegram, sendMax, createServiceCallEvent } from '/Users/arsalanbaranzaev/Desktop/projects/incity-new/server/utils/serviceCalls';
export { createSessionToken, verifySessionToken } from '/Users/arsalanbaranzaev/Desktop/projects/incity-new/server/utils/session';
export { markReviewPromptsCompletedForOrder, insertShopReview, updateShopReviewRating } from '/Users/arsalanbaranzaev/Desktop/projects/incity-new/server/utils/shopReviewWrite';
export { isTargetingEmpty, campaignMatchesTargeting } from '/Users/arsalanbaranzaev/Desktop/projects/incity-new/server/utils/storyTargeting';
export { extractShopIdFromInitData, extractBotIdFromInitData, resolveShopIdFromEvent, getShopById, getShopByCustomDomain, getShopByBotId, requireTenantShop, resolveCanonicalTenantCartPath, assertShopIdMatchesTenant, requireRestaurantForShop, requireRestaurantZoneForShop } from '/Users/arsalanbaranzaev/Desktop/projects/incity-new/server/utils/tenant';
export { generateVkPkcePair, buildVkAuthorizeUrl, exchangeVkCode, fetchVkUserInfo } from '/Users/arsalanbaranzaev/Desktop/projects/incity-new/server/utils/vkOAuth';
export { createYooKassaPayment } from '/Users/arsalanbaranzaev/Desktop/projects/incity-new/server/utils/yookassa';