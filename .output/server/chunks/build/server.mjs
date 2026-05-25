import process from 'node:process';globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import { defineComponent, ref, inject, h, Suspense, hasInjectionContext, toRef, isRef, computed, watch, getCurrentInstance, shallowRef, resolveComponent, Fragment, unref, provide, shallowReactive, createElementBlock, cloneVNode, useSSRContext, defineAsyncComponent, createApp, useModel, useId, mergeProps, withCtx, createTextVNode, mergeModels, openBlock, createBlock, createVNode, toDisplayString, onServerPrefetch, onErrorCaptured, resolveDynamicComponent, reactive, effectScope, nextTick, getCurrentScope, isReadonly, isShallow, isReactive, toRaw, markRaw } from 'vue';
import { t as createError$1, a4 as hasProtocol, a9 as isScriptProtocol, ac as joinURL, at as parseQuery, b6 as withQuery, aN as sanitizeStatusCode, av as parseURL, C as encodePath, x as decodePath, L as getContext, b7 as withTrailingSlash, b8 as withoutTrailingSlash, $ as $fetch$1, h as baseURL, A as defu, u as createHooks, G as executeAsync, O as getHeader, aU as setCookie, U as getRequestHeaders } from '../nitro/nitro.mjs';
import { RouterView, useRoute as useRoute$1, useRouter as useRouter$1, createMemoryHistory, createRouter, START_LOCATION } from 'vue-router';
import { createServerClient, parseCookieHeader } from '@supabase/ssr';
import { ssrRenderAttrs, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrRenderClass, ssrRenderComponent, ssrRenderTeleport, ssrRenderStyle, ssrInterpolate, ssrRenderList, ssrLooseEqual, ssrRenderSuspense, ssrRenderVNode } from 'vue/server-renderer';
import 'node:crypto';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:url';
import '@supabase/supabase-js';

if (!globalThis.$fetch) {
  globalThis.$fetch = $fetch$1.create({
    baseURL: baseURL()
  });
}
if (!("global" in globalThis)) {
  globalThis.global = globalThis;
}
const appLayoutTransition = false;
const nuxtLinkDefaults = { "componentName": "NuxtLink" };
const asyncDataDefaults = { "value": null, "errorValue": null, "deep": true };
const fetchDefaults = {};
const appId = "nuxt-app";
function getNuxtAppCtx(id = appId) {
  return getContext(id, {
    asyncContext: false
  });
}
const NuxtPluginIndicator = "__nuxt_plugin";
function createNuxtApp(options) {
  let hydratingCount = 0;
  const nuxtApp = {
    _id: options.id || appId || "nuxt-app",
    _scope: effectScope(),
    provide: void 0,
    globalName: "nuxt",
    versions: {
      get nuxt() {
        return "3.21.6";
      },
      get vue() {
        return nuxtApp.vueApp.version;
      }
    },
    payload: shallowReactive({
      ...options.ssrContext?.payload || {},
      data: shallowReactive({}),
      state: reactive({}),
      once: /* @__PURE__ */ new Set(),
      _errors: shallowReactive({})
    }),
    static: {
      data: {}
    },
    runWithContext(fn) {
      if (nuxtApp._scope.active && !getCurrentScope()) {
        return nuxtApp._scope.run(() => callWithNuxt(nuxtApp, fn));
      }
      return callWithNuxt(nuxtApp, fn);
    },
    isHydrating: false,
    deferHydration() {
      if (!nuxtApp.isHydrating) {
        return () => {
        };
      }
      hydratingCount++;
      let called = false;
      return () => {
        if (called) {
          return;
        }
        called = true;
        hydratingCount--;
        if (hydratingCount === 0) {
          nuxtApp.isHydrating = false;
          return nuxtApp.callHook("app:suspense:resolve");
        }
      };
    },
    _asyncDataPromises: {},
    _asyncData: shallowReactive({}),
    _payloadRevivers: {},
    ...options
  };
  {
    nuxtApp.payload.serverRendered = true;
  }
  if (nuxtApp.ssrContext) {
    nuxtApp.payload.path = nuxtApp.ssrContext.url;
    nuxtApp.ssrContext.nuxt = nuxtApp;
    nuxtApp.ssrContext.payload = nuxtApp.payload;
    nuxtApp.ssrContext.config = {
      public: nuxtApp.ssrContext.runtimeConfig.public,
      app: nuxtApp.ssrContext.runtimeConfig.app
    };
  }
  nuxtApp.hooks = createHooks();
  nuxtApp.hook = nuxtApp.hooks.hook;
  {
    const contextCaller = async function(hooks, args) {
      for (const hook of hooks) {
        await nuxtApp.runWithContext(() => hook(...args));
      }
    };
    nuxtApp.hooks.callHook = (name, ...args) => nuxtApp.hooks.callHookWith(contextCaller, name, ...args);
  }
  nuxtApp.callHook = nuxtApp.hooks.callHook;
  nuxtApp.provide = (name, value) => {
    const $name = "$" + name;
    defineGetter(nuxtApp, $name, value);
    defineGetter(nuxtApp.vueApp.config.globalProperties, $name, value);
  };
  defineGetter(nuxtApp.vueApp, "$nuxt", nuxtApp);
  defineGetter(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
  const runtimeConfig = options.ssrContext.runtimeConfig;
  nuxtApp.provide("config", runtimeConfig);
  return nuxtApp;
}
function registerPluginHooks(nuxtApp, plugin2) {
  if (plugin2.hooks) {
    nuxtApp.hooks.addHooks(plugin2.hooks);
  }
}
async function applyPlugin(nuxtApp, plugin2) {
  if (typeof plugin2 === "function") {
    const { provide: provide2 } = await nuxtApp.runWithContext(() => plugin2(nuxtApp)) || {};
    if (provide2 && typeof provide2 === "object") {
      for (const key in provide2) {
        nuxtApp.provide(key, provide2[key]);
      }
    }
  }
}
async function applyPlugins(nuxtApp, plugins2) {
  const resolvedPlugins = /* @__PURE__ */ new Set();
  const unresolvedPlugins = [];
  const parallels = [];
  let error = void 0;
  let promiseDepth = 0;
  async function executePlugin(plugin2) {
    const unresolvedPluginsForThisPlugin = plugin2.dependsOn?.filter((name) => plugins2.some((p) => p._name === name) && !resolvedPlugins.has(name)) ?? [];
    if (unresolvedPluginsForThisPlugin.length > 0) {
      unresolvedPlugins.push([new Set(unresolvedPluginsForThisPlugin), plugin2]);
    } else {
      const promise = applyPlugin(nuxtApp, plugin2).then(async () => {
        if (plugin2._name) {
          resolvedPlugins.add(plugin2._name);
          await Promise.all(unresolvedPlugins.map(async ([dependsOn, unexecutedPlugin]) => {
            if (dependsOn.has(plugin2._name)) {
              dependsOn.delete(plugin2._name);
              if (dependsOn.size === 0) {
                promiseDepth++;
                await executePlugin(unexecutedPlugin);
              }
            }
          }));
        }
      }).catch((e) => {
        if (!plugin2.parallel && !nuxtApp.payload.error) {
          throw e;
        }
        error ||= e;
      });
      if (plugin2.parallel) {
        parallels.push(promise);
      } else {
        await promise;
      }
    }
  }
  for (const plugin2 of plugins2) {
    if (nuxtApp.ssrContext?.islandContext && plugin2.env?.islands === false) {
      continue;
    }
    registerPluginHooks(nuxtApp, plugin2);
  }
  for (const plugin2 of plugins2) {
    if (nuxtApp.ssrContext?.islandContext && plugin2.env?.islands === false) {
      continue;
    }
    await executePlugin(plugin2);
  }
  await Promise.all(parallels);
  if (promiseDepth) {
    for (let i = 0; i < promiseDepth; i++) {
      await Promise.all(parallels);
    }
  }
  if (error) {
    throw nuxtApp.payload.error || error;
  }
}
// @__NO_SIDE_EFFECTS__
function defineNuxtPlugin(plugin2) {
  if (typeof plugin2 === "function") {
    return plugin2;
  }
  const _name = plugin2._name || plugin2.name;
  delete plugin2.name;
  return Object.assign(plugin2.setup || (() => {
  }), plugin2, { [NuxtPluginIndicator]: true, _name });
}
function callWithNuxt(nuxt, setup, args) {
  const fn = () => setup();
  const nuxtAppCtx = getNuxtAppCtx(nuxt._id);
  {
    return nuxt.vueApp.runWithContext(() => nuxtAppCtx.callAsync(nuxt, fn));
  }
}
function tryUseNuxtApp(id) {
  let nuxtAppInstance;
  if (hasInjectionContext()) {
    nuxtAppInstance = getCurrentInstance()?.appContext.app.$nuxt;
  }
  nuxtAppInstance ||= getNuxtAppCtx(id).tryUse();
  return nuxtAppInstance || null;
}
function useNuxtApp(id) {
  const nuxtAppInstance = tryUseNuxtApp(id);
  if (!nuxtAppInstance) {
    {
      throw new Error("[nuxt] instance unavailable");
    }
  }
  return nuxtAppInstance;
}
// @__NO_SIDE_EFFECTS__
function useRuntimeConfig(_event) {
  return useNuxtApp().$config;
}
function defineGetter(obj, key, val) {
  Object.defineProperty(obj, key, { get: () => val });
}
const LayoutMetaSymbol = /* @__PURE__ */ Symbol("layout-meta");
const PageRouteSymbol = /* @__PURE__ */ Symbol("route");
globalThis._importMeta_.url.replace(/\/app\/.*$/, "/");
const useRouter = () => {
  return useNuxtApp()?.$router;
};
const useRoute = () => {
  if (hasInjectionContext()) {
    return inject(PageRouteSymbol, useNuxtApp()._route);
  }
  return useNuxtApp()._route;
};
// @__NO_SIDE_EFFECTS__
function defineNuxtRouteMiddleware(middleware) {
  return middleware;
}
const isProcessingMiddleware = () => {
  try {
    if (useNuxtApp()._processingMiddleware) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
};
const HTML_ATTR_UNSAFE_RE = /[&"'<>]/g;
const HTML_ATTR_ENCODE_MAP = {
  "&": "%26",
  '"': "%22",
  "'": "%27",
  "<": "%3C",
  ">": "%3E"
};
function encodeForHtmlAttr(value) {
  return value.replace(HTML_ATTR_UNSAFE_RE, (c) => HTML_ATTR_ENCODE_MAP[c]);
}
const navigateTo = (to, options) => {
  to ||= "/";
  const toPath = typeof to === "string" ? to : "path" in to ? resolveRouteObject(to) : useRouter().resolve(to).href;
  const isExternalHost = hasProtocol(toPath, { acceptRelative: true });
  const isExternal = options?.external || isExternalHost;
  if (isExternal) {
    if (!options?.external) {
      throw new Error("Navigating to an external URL is not allowed by default. Use `navigateTo(url, { external: true })`.");
    }
    const { protocol } = new URL(toPath, "http://localhost");
    if (protocol && isScriptProtocol(protocol)) {
      throw new Error(`Cannot navigate to a URL with '${protocol}' protocol.`);
    }
  }
  const inMiddleware = isProcessingMiddleware();
  const router = useRouter();
  const nuxtApp = useNuxtApp();
  {
    if (nuxtApp.ssrContext) {
      const fullPath = typeof to === "string" || isExternal ? toPath : router.resolve(to).fullPath || "/";
      const location2 = isExternal ? toPath : joinURL((/* @__PURE__ */ useRuntimeConfig()).app.baseURL, fullPath);
      const redirect = async function(response) {
        await nuxtApp.callHook("app:redirected");
        const encodedLoc = encodeForHtmlAttr(location2);
        const encodedHeader = encodeURL(location2, isExternalHost);
        nuxtApp.ssrContext["~renderResponse"] = {
          statusCode: sanitizeStatusCode(options?.redirectCode || 302, 302),
          body: `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`,
          headers: { location: encodedHeader }
        };
        return response;
      };
      if (!isExternal && inMiddleware) {
        router.afterEach((final) => final.fullPath === fullPath ? redirect(false) : void 0);
        return to;
      }
      return redirect(!inMiddleware ? void 0 : (
        /* abort route navigation */
        false
      ));
    }
  }
  if (isExternal) {
    nuxtApp._scope.stop();
    if (options?.replace) {
      (void 0).replace(toPath);
    } else {
      (void 0).href = toPath;
    }
    if (inMiddleware) {
      if (!nuxtApp.isHydrating) {
        return false;
      }
      return new Promise(() => {
      });
    }
    return Promise.resolve();
  }
  const encodedTo = typeof to === "string" ? encodeRoutePath(to) : to;
  return options?.replace ? router.replace(encodedTo) : router.push(encodedTo);
};
function resolveRouteObject(to) {
  return withQuery(to.path || "", to.query || {}) + (to.hash || "");
}
function encodeURL(location2, isExternalHost = false) {
  const url = new URL(location2, "http://localhost");
  if (!isExternalHost) {
    return url.pathname + url.search + url.hash;
  }
  if (location2.startsWith("//")) {
    return url.toString().replace(url.protocol, "");
  }
  return url.toString();
}
function encodeRoutePath(url) {
  const parsed = parseURL(url);
  return encodePath(decodePath(parsed.pathname)) + parsed.search + parsed.hash;
}
const NUXT_ERROR_SIGNATURE = "__nuxt_error";
const useError = /* @__NO_SIDE_EFFECTS__ */ () => toRef(useNuxtApp().payload, "error");
const showError = (error) => {
  const nuxtError = createError(error);
  try {
    const error2 = /* @__PURE__ */ useError();
    if (false) ;
    error2.value ||= nuxtError;
  } catch {
    throw nuxtError;
  }
  return nuxtError;
};
const isNuxtError = (error) => !!error && typeof error === "object" && NUXT_ERROR_SIGNATURE in error;
const createError = (error) => {
  if (typeof error !== "string" && error.statusText) {
    error.message ??= error.statusText;
  }
  const nuxtError = createError$1(error);
  Object.defineProperty(nuxtError, NUXT_ERROR_SIGNATURE, {
    value: true,
    configurable: false,
    writable: false
  });
  Object.defineProperty(nuxtError, "status", {
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    get: () => nuxtError.statusCode,
    configurable: true
  });
  Object.defineProperty(nuxtError, "statusText", {
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    get: () => nuxtError.statusMessage,
    configurable: true
  });
  return nuxtError;
};
function freezeHead(head) {
  const realPush = head.push;
  head.push = () => ({ dispose: () => {
  }, patch: () => {
  }, _poll: () => {
  } });
  return () => {
    head.push = realPush;
  };
}
const unhead_k2P3m_ZDyjlr2mMYnoDPwavjsDN8hBlk9cFai0bbopU = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:head",
  enforce: "pre",
  setup(nuxtApp) {
    const head = nuxtApp.ssrContext.head;
    if (nuxtApp.ssrContext.islandContext) {
      const unfreeze = freezeHead(head);
      nuxtApp.hooks.hookOnce("app:created", unfreeze);
    }
    nuxtApp.vueApp.use(head);
  }
});
function toArray$1(value) {
  return Array.isArray(value) ? value : [value];
}
const matcher = (m, p) => {
  return [];
};
const _routeRulesMatcher = (path) => defu({}, ...matcher().map((r) => r.data).reverse());
const routeRulesMatcher$1 = _routeRulesMatcher;
function getRouteRules(arg) {
  const path = typeof arg === "string" ? arg : arg.path;
  try {
    return routeRulesMatcher$1(path);
  } catch (e) {
    console.error("[nuxt] Error matching route rules.", e);
    return {};
  }
}
const __nuxt_page_meta$t = { layout: "city" };
const __nuxt_page_meta$s = { layout: "dashboard" };
const __nuxt_page_meta$r = { layout: "dashboard" };
const __nuxt_page_meta$q = { layout: "city" };
const __nuxt_page_meta$p = { layout: "dashboard" };
const __nuxt_page_meta$o = { layout: "dashboard" };
const __nuxt_page_meta$n = { layout: "dashboard" };
const __nuxt_page_meta$m = { layout: "dashboard" };
const __nuxt_page_meta$l = { layout: "dashboard" };
const __nuxt_page_meta$k = { layout: "dashboard" };
const __nuxt_page_meta$j = { layout: "dashboard" };
const __nuxt_page_meta$i = { layout: "dashboard" };
const __nuxt_page_meta$h = { layout: "dashboard" };
const __nuxt_page_meta$g = { layout: "dashboard" };
const __nuxt_page_meta$f = { layout: "dashboard" };
const __nuxt_page_meta$e = { layout: "dashboard" };
const __nuxt_page_meta$d = { layout: "dashboard" };
const __nuxt_page_meta$c = { layout: "dashboard" };
const __nuxt_page_meta$b = { layout: "city" };
const __nuxt_page_meta$a = { layout: "city" };
const __nuxt_page_meta$9 = { layout: "dashboard" };
const __nuxt_page_meta$8 = { layout: "city" };
const __nuxt_page_meta$7 = { layout: "city" };
const __nuxt_page_meta$6 = { layout: "dashboard" };
const __nuxt_page_meta$5 = { layout: "dashboard" };
const __nuxt_page_meta$4 = { layout: "dashboard" };
const __nuxt_page_meta$3 = { layout: "dashboard" };
const __nuxt_page_meta$2 = { layout: "dashboard" };
const __nuxt_page_meta$1 = { layout: "dashboard" };
const __nuxt_page_meta = { layout: "dashboard" };
const _routes = [
  {
    name: "index",
    path: "/",
    component: () => import('./index-DZL1pxrO.mjs')
  },
  {
    name: "login",
    path: "/login",
    component: () => import('./login-NrEmqkdy.mjs')
  },
  {
    name: "link-vk",
    path: "/link-vk",
    component: () => import('./link-vk-UBcKtK3z.mjs')
  },
  {
    name: "profile",
    path: "/profile",
    component: () => import('./profile-DzaeZy_o.mjs')
  },
  {
    name: "link-max",
    path: "/link-max",
    component: () => import('./link-max-DYoTbGqJ.mjs')
  },
  {
    name: "partners",
    path: "/partners",
    component: () => import('./partners-DRm8Nmv1.mjs')
  },
  {
    name: "register",
    path: "/register",
    component: () => import('./register-C5GVtCME.mjs')
  },
  {
    name: "onboarding",
    path: "/onboarding",
    component: () => import('./onboarding-DG66hnON.mjs')
  },
  {
    name: "achievements",
    path: "/achievements",
    component: () => import('./achievements-D25QXNgw.mjs')
  },
  {
    name: "link-telegram",
    path: "/link-telegram",
    component: () => import('./link-telegram-D6zyOqYt.mjs')
  },
  {
    name: "invite-token",
    path: "/invite/:token()",
    component: () => import('./_token_-DiASjGxr.mjs')
  },
  {
    name: "city_slug-map",
    path: "/:city_slug()/map",
    meta: __nuxt_page_meta$t || {},
    component: () => import('./map-DMm5_oZc.mjs')
  },
  {
    name: "dashboard",
    path: "/dashboard",
    meta: __nuxt_page_meta$s || {},
    component: () => import('./index-8jOFlkc8.mjs')
  },
  {
    name: "dashboard-login",
    path: "/dashboard/login",
    component: () => import('./login-fMG6esQ0.mjs')
  },
  {
    name: "platform-cities",
    path: "/platform/cities",
    meta: __nuxt_page_meta$r || {},
    component: () => import('./cities-BWt1iYaX.mjs')
  },
  {
    name: "city_slug",
    path: "/:city_slug()",
    meta: __nuxt_page_meta$q || {},
    component: () => import('./index-CmYAVmOS.mjs')
  },
  {
    name: "dashboard-reviews",
    path: "/dashboard/reviews",
    meta: __nuxt_page_meta$p || {},
    component: () => import('./reviews-CspfRSoT.mjs')
  },
  {
    name: "dashboard-analytics",
    path: "/dashboard/analytics",
    meta: __nuxt_page_meta$o || {},
    component: () => import('./analytics-BDxG5KEu.mjs')
  },
  {
    name: "dashboard-marketing",
    path: "/dashboard/marketing",
    meta: __nuxt_page_meta$n || {},
    component: () => import('./marketing-DhycqR1A.mjs')
  },
  {
    name: "dashboard-team",
    path: "/dashboard/team",
    meta: __nuxt_page_meta$m || {},
    component: () => import('./index-q95Y9P4l.mjs')
  },
  {
    name: "dashboard-team-roles",
    path: "/dashboard/team/roles",
    meta: __nuxt_page_meta$l || {},
    component: () => import('./roles-D76p8UyB.mjs')
  },
  {
    name: "platform-restaurants",
    path: "/platform/restaurants",
    meta: __nuxt_page_meta$k || {},
    component: () => import('./restaurants-Bs-AEV1G.mjs')
  },
  {
    name: "dashboard-orders-id",
    path: "/dashboard/orders/:id()",
    meta: __nuxt_page_meta$j || {},
    component: () => import('./_id_-tGScAhjJ.mjs')
  },
  {
    name: "platform-applications",
    path: "/platform/applications",
    meta: __nuxt_page_meta$i || {},
    component: () => import('./applications-BM-bsqSW.mjs')
  },
  {
    name: "dashboard-applications",
    path: "/dashboard/applications",
    meta: __nuxt_page_meta$h || {},
    component: () => import('./applications-Bo64rMFk.mjs')
  },
  {
    name: "dashboard-branches-new",
    path: "/dashboard/branches/new",
    meta: __nuxt_page_meta$g || {},
    component: () => import('./new-DMupyX69.mjs')
  },
  {
    name: "dashboard-integrations",
    path: "/dashboard/integrations",
    meta: __nuxt_page_meta$e || {},
    component: () => import('./integrations-B-foH3ZV.mjs'),
    children: [
      {
        name: "dashboard-integrations-notifications-restaurantId",
        path: "notifications/:restaurantId()",
        meta: __nuxt_page_meta$f || {},
        component: () => import('./_restaurantId_-ohx7TgsP.mjs')
      }
    ]
  },
  {
    name: "dashboard-orders",
    path: "/dashboard/orders",
    meta: __nuxt_page_meta$d || {},
    component: () => import('./index-AEQKuJqO.mjs')
  },
  {
    name: "city_slug-legal-offer",
    path: "/:city_slug()/legal/offer",
    component: () => import('./offer-3q7NOrT7.mjs')
  },
  {
    name: "dashboard-stories",
    path: "/dashboard/stories",
    meta: __nuxt_page_meta$c || {},
    component: () => import('./index-BqCct9Ax.mjs')
  },
  {
    name: "city_slug-achievements",
    path: "/:city_slug()/achievements",
    component: () => import('./achievements-CThfRjPX.mjs')
  },
  {
    name: "city_slug-events",
    path: "/:city_slug()/events",
    meta: __nuxt_page_meta$b || {},
    component: () => import('./index-BiRN7oTQ.mjs')
  },
  {
    name: "city_slug-venues",
    path: "/:city_slug()/venues",
    meta: __nuxt_page_meta$a || {},
    component: () => import('./index-D9PxOseG.mjs')
  },
  {
    name: "dashboard-branches",
    path: "/dashboard/branches",
    meta: __nuxt_page_meta$9 || {},
    component: () => import('./index-asStH4yq.mjs')
  },
  {
    name: "city_slug-events-slug",
    path: "/:city_slug()/events/:slug()",
    meta: __nuxt_page_meta$8 || {},
    component: () => import('./_slug_-B6W5JesQ.mjs')
  },
  {
    name: "city_slug-legal-consent",
    path: "/:city_slug()/legal/consent",
    component: () => import('./consent-Dy8EJm2Z.mjs')
  },
  {
    name: "city_slug-legal-cookies",
    path: "/:city_slug()/legal/cookies",
    component: () => import('./cookies-pRK8yQVH.mjs')
  },
  {
    name: "city_slug-legal-privacy",
    path: "/:city_slug()/legal/privacy",
    component: () => import('./privacy-CbV-KvtS.mjs')
  },
  {
    name: "city_slug-venues-slug",
    path: "/:city_slug()/venues/:slug()",
    meta: __nuxt_page_meta$7 || {},
    component: () => import('./_slug_-BFNc4M8R.mjs')
  },
  {
    name: "city_slug-legal-contacts",
    path: "/:city_slug()/legal/contacts",
    component: () => import('./contacts-DARJySyp.mjs')
  },
  {
    name: "dashboard-settings-profile",
    path: "/dashboard/settings/profile",
    meta: __nuxt_page_meta$6 || {},
    component: () => import('./profile-D-3a8DUD.mjs')
  },
  {
    name: "dashboard-team-invitations",
    path: "/dashboard/team/invitations",
    meta: __nuxt_page_meta$5 || {},
    component: () => import('./invitations-BZfPMRXN.mjs')
  },
  {
    name: "dashboard-team-new-manager",
    path: "/dashboard/team/new-manager",
    meta: __nuxt_page_meta$4 || {},
    component: () => import('./new-manager-wCswEwpz.mjs')
  },
  {
    name: "dashboard-branches-id",
    path: "/dashboard/branches/:id()",
    meta: __nuxt_page_meta$3 || {},
    component: () => import('./index-BapDYjhY.mjs')
  },
  {
    name: "dashboard-moderation-city-ugc",
    path: "/dashboard/moderation/city-ugc",
    meta: __nuxt_page_meta$2 || {},
    component: () => import('./city-ugc-lkSNdXd0.mjs')
  },
  {
    name: "dashboard-festival-leaderboard",
    path: "/dashboard/festival-leaderboard",
    component: () => import('./festival-leaderboard-15r-kTcD.mjs')
  },
  {
    name: "dashboard-settings-organization",
    path: "/dashboard/settings/organization",
    meta: __nuxt_page_meta$1 || {},
    component: () => import('./organization-p5m6IsVM.mjs')
  },
  {
    name: "dashboard-stories-campaigns-id",
    path: "/dashboard/stories/campaigns/:id()",
    meta: __nuxt_page_meta || {},
    component: () => import('./_id_-yvNiUsRu.mjs')
  },
  {
    name: "city_slug-festival-festival_slug",
    path: "/:city_slug()/festival/:festival_slug()",
    component: () => import('./index-CheFkP2x.mjs')
  },
  {
    name: "city_slug-festival-festival_slug-leaderboard",
    path: "/:city_slug()/festival/:festival_slug()/leaderboard",
    component: () => import('./leaderboard-uEn96wA0.mjs')
  },
  {
    name: "city_slug-festival-festival_slug-achievements",
    path: "/:city_slug()/festival/:festival_slug()/achievements",
    component: () => import('./achievements-DqtxSu1O.mjs')
  },
  {
    name: "city_slug-festival-festival_slug-tenant_slug",
    path: "/:city_slug()/festival/:festival_slug()/:tenant_slug()",
    component: () => import('./index-CUzWsXew.mjs')
  }
];
const _wrapInTransition = (props, children) => {
  return { default: () => children.default?.() };
};
const ROUTE_KEY_PARENTHESES_RE = /(:\w+)\([^)]+\)/g;
const ROUTE_KEY_SYMBOLS_RE = /(:\w+)[?+*]/g;
const ROUTE_KEY_NORMAL_RE = /:\w+/g;
function generateRouteKey(route) {
  const source = route?.meta.key ?? route.path.replace(ROUTE_KEY_PARENTHESES_RE, "$1").replace(ROUTE_KEY_SYMBOLS_RE, "$1").replace(ROUTE_KEY_NORMAL_RE, (r) => route.params[r.slice(1)]?.toString() || "");
  return typeof source === "function" ? source(route) : source;
}
function isChangingPage(to, from) {
  if (to === from || from === START_LOCATION) {
    return false;
  }
  if (generateRouteKey(to) !== generateRouteKey(from)) {
    return true;
  }
  const areComponentsSame = to.matched.every(
    (comp, index) => comp.components && comp.components.default === from.matched[index]?.components?.default
  );
  if (areComponentsSame) {
    return false;
  }
  return true;
}
function toArray(value) {
  return Array.isArray(value) ? value : [value];
}
function _mergeTransitionProps(routeProps) {
  const _props = [];
  for (const prop of routeProps) {
    if (!prop) {
      continue;
    }
    _props.push({
      ...prop,
      onAfterLeave: prop.onAfterLeave ? toArray(prop.onAfterLeave) : void 0,
      onBeforeLeave: prop.onBeforeLeave ? toArray(prop.onBeforeLeave) : void 0
    });
  }
  return defu(..._props);
}
const routerOptions0 = {
  scrollBehavior(to, from, savedPosition) {
    const nuxtApp = useNuxtApp();
    const hashScrollBehaviour = useRouter().options?.scrollBehaviorType ?? "auto";
    if (to.path.replace(/\/$/, "") === from.path.replace(/\/$/, "")) {
      if (from.hash && !to.hash) {
        return { left: 0, top: 0 };
      }
      if (to.hash) {
        return { el: to.hash, top: _getHashElementScrollMarginTop(to.hash), behavior: hashScrollBehaviour };
      }
      return false;
    }
    const routeAllowsScrollToTop = typeof to.meta.scrollToTop === "function" ? to.meta.scrollToTop(to, from) : to.meta.scrollToTop;
    if (routeAllowsScrollToTop === false) {
      return false;
    }
    if (from === START_LOCATION) {
      return _calculatePosition(to, from, savedPosition, hashScrollBehaviour);
    }
    return new Promise((resolve) => {
      const doScroll = () => {
        requestAnimationFrame(() => resolve(_calculatePosition(to, from, savedPosition, hashScrollBehaviour)));
      };
      nuxtApp.hooks.hookOnce("page:loading:end", () => {
        const transitionPromise = nuxtApp["~transitionPromise"];
        if (transitionPromise) {
          transitionPromise.then(doScroll);
        } else {
          doScroll();
        }
      });
    });
  }
};
function _getHashElementScrollMarginTop(selector) {
  try {
    const elem = (void 0).querySelector(selector);
    if (elem) {
      return (Number.parseFloat(getComputedStyle(elem).scrollMarginTop) || 0) + (Number.parseFloat(getComputedStyle((void 0).documentElement).scrollPaddingTop) || 0);
    }
  } catch {
  }
  return 0;
}
function _calculatePosition(to, from, savedPosition, defaultHashScrollBehaviour) {
  if (savedPosition) {
    return savedPosition;
  }
  if (to.hash) {
    return {
      el: to.hash,
      top: _getHashElementScrollMarginTop(to.hash),
      behavior: isChangingPage(to, from) ? defaultHashScrollBehaviour : "instant"
    };
  }
  return {
    left: 0,
    top: 0
  };
}
const configRouterOptions = {
  hashMode: false,
  scrollBehaviorType: "auto"
};
const routerOptions = {
  ...configRouterOptions,
  ...routerOptions0
};
const validate = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to, from) => {
  let __temp, __restore;
  if (!to.meta?.validate) {
    return;
  }
  const result = ([__temp, __restore] = executeAsync(() => Promise.resolve(to.meta.validate(to))), __temp = await __temp, __restore(), __temp);
  if (result === true) {
    return;
  }
  const error = createError({
    fatal: false,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    status: result && (result.status || result.statusCode) || 404,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    statusText: result && (result.statusText || result.statusMessage) || `Page Not Found: ${to.fullPath}`,
    data: {
      path: to.fullPath
    }
  });
  return error;
});
const useSupabaseClient = () => {
  return useNuxtApp().$supabase.client;
};
const dashboard_45auth_45global = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to) => {
  let __temp, __restore;
  if (!to.path.startsWith("/dashboard")) return;
  const isDashboardLoginPage = to.path === "/dashboard/login";
  const resolveRedirectPath = () => {
    const redirectFromQuery = typeof to.query.redirect === "string" ? to.query.redirect : "";
    return redirectFromQuery.startsWith("/dashboard") ? redirectFromQuery : "/dashboard";
  };
  const supabase = useSupabaseClient();
  const {
    data: { session }
  } = ([__temp, __restore] = executeAsync(() => supabase.auth.getSession()), __temp = await __temp, __restore(), __temp);
  if (!session) {
    if (isDashboardLoginPage) return;
    return navigateTo({
      path: "/dashboard/login",
      query: { redirect: to.fullPath }
    });
  }
  if (isDashboardLoginPage) {
    const redirectFromQuery = typeof to.query.redirect === "string" ? to.query.redirect : "";
    const redirectTarget = redirectFromQuery.startsWith("/dashboard") ? redirectFromQuery : "/dashboard";
    return navigateTo(redirectTarget);
  }
  try {
    const access = ([__temp, __restore] = executeAsync(() => $fetch("/api/dashboard/access")), __temp = await __temp, __restore(), __temp);
    if (!access?.ok || !access.shopId) {
      if (to.path === "/dashboard") {
        return navigateTo({
          path: "/onboarding",
          query: { redirect: resolveRedirectPath() }
        });
      }
      return navigateTo({
        path: "/dashboard",
        query: { redirect: to.fullPath }
      });
    }
  } catch (error) {
    const statusCode = error?.statusCode ?? error?.response?.status;
    if (statusCode === 403 && to.path === "/dashboard") {
      return navigateTo({
        path: "/onboarding",
        query: { redirect: resolveRedirectPath() }
      });
    }
    if (statusCode === 401) {
      return navigateTo({
        path: "/dashboard/login",
        query: { redirect: to.fullPath }
      });
    }
    return;
  }
});
function useRequestEvent(nuxtApp) {
  nuxtApp ||= useNuxtApp();
  return nuxtApp.ssrContext?.event;
}
function useRequestHeaders(include) {
  const event = useRequestEvent();
  const _headers = event ? getRequestHeaders(event) : {};
  if (!include || !event) {
    return _headers;
  }
  const headers = /* @__PURE__ */ Object.create(null);
  for (const _key of include) {
    const key = _key.toLowerCase();
    const header = _headers[key];
    if (header) {
      headers[key] = header;
    }
  }
  return headers;
}
function useRequestFetch() {
  return useRequestEvent()?.$fetch || globalThis.$fetch;
}
function normalizeHost(host) {
  if (!host) return null;
  return host.trim().toLowerCase().replace(/:\d+$/, "") || null;
}
function isPlatformHost(host, platformBaseDomain) {
  if (!host) return false;
  const base = platformBaseDomain ? normalizeHost(platformBaseDomain) : null;
  if (host === "localhost" || host === "127.0.0.1") return true;
  if (!base) return true;
  return host === base || host.endsWith(`.${base}`);
}
const redirect_45city_45global = /* @__PURE__ */ defineNuxtRouteMiddleware((to) => {
  const config = /* @__PURE__ */ useRuntimeConfig();
  const slug = config.public?.defaultCitySlug;
  if (!slug) return;
  if (to.path !== "/" && to.path !== "") return;
  const headers = useRequestHeaders(["host"]);
  const host = normalizeHost(headers.host);
  const appBaseHost = typeof config.appUrl === "string" ? (() => {
    try {
      return normalizeHost(new URL(config.appUrl).host);
    } catch {
      return null;
    }
  })() : null;
  const base = config.public?.platformBaseDomain ? config.public?.platformBaseDomain : appBaseHost ?? void 0;
  if (!isPlatformHost(host, base)) return;
  return navigateTo(`/${slug}`);
});
const manifest_45route_45rule = /* @__PURE__ */ defineNuxtRouteMiddleware((to) => {
  {
    return;
  }
});
const globalMiddleware = [
  validate,
  dashboard_45auth_45global,
  redirect_45city_45global,
  manifest_45route_45rule
];
const namedMiddleware = {};
const pageIslandRoutes = {};
const plugin$1 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:router",
  enforce: "pre",
  async setup(nuxtApp) {
    let __temp, __restore;
    let routerBase = (/* @__PURE__ */ useRuntimeConfig()).app.baseURL;
    const history = routerOptions.history?.(routerBase) ?? createMemoryHistory(routerBase);
    const routes = routerOptions.routes ? ([__temp, __restore] = executeAsync(() => routerOptions.routes(_routes)), __temp = await __temp, __restore(), __temp) ?? _routes : _routes;
    let startPosition;
    const router = createRouter({
      ...routerOptions,
      scrollBehavior: (to, from, savedPosition) => {
        if (from === START_LOCATION) {
          startPosition = savedPosition;
          return;
        }
        if (routerOptions.scrollBehavior) {
          router.options.scrollBehavior = routerOptions.scrollBehavior;
          if ("scrollRestoration" in (void 0).history) {
            const unsub = router.beforeEach(() => {
              unsub();
              (void 0).history.scrollRestoration = "manual";
            });
          }
          return routerOptions.scrollBehavior(to, START_LOCATION, startPosition || savedPosition);
        }
      },
      history,
      routes
    });
    nuxtApp.vueApp.use(router);
    const previousRoute = shallowRef(router.currentRoute.value);
    router.afterEach((_to, from) => {
      previousRoute.value = from;
    });
    Object.defineProperty(nuxtApp.vueApp.config.globalProperties, "previousRoute", {
      get: () => previousRoute.value
    });
    const initialURL = nuxtApp.ssrContext.url;
    const _route = shallowRef(router.currentRoute.value);
    const syncCurrentRoute = () => {
      _route.value = router.currentRoute.value;
    };
    router.afterEach((to, from) => {
      const lastTo = to.matched.at(-1)?.components?.default;
      const lastFrom = from.matched.at(-1)?.components?.default;
      if (lastTo === lastFrom) {
        syncCurrentRoute();
        return;
      }
      if (to.matched.length < from.matched.length && to.matched.every((m, i) => m.components?.default === from.matched[i]?.components?.default)) {
        syncCurrentRoute();
      }
    });
    const route = { sync: syncCurrentRoute };
    for (const key in _route.value) {
      Object.defineProperty(route, key, {
        get: () => _route.value[key],
        enumerable: true
      });
    }
    nuxtApp._route = shallowReactive(route);
    nuxtApp._middleware ||= {
      global: [],
      named: {}
    };
    const error = /* @__PURE__ */ useError();
    const isServerPage = nuxtApp.ssrContext?.islandContext?.name?.startsWith("page_");
    if (!nuxtApp.ssrContext?.islandContext || isServerPage) {
      router.afterEach(async (to, _from, failure) => {
        delete nuxtApp._processingMiddleware;
        if (failure) {
          await nuxtApp.callHook("page:loading:end");
        }
        if (failure?.type === 4) {
          return;
        }
        if (to.redirectedFrom && to.fullPath !== initialURL) {
          await nuxtApp.runWithContext(() => navigateTo(to.fullPath || "/"));
        }
      });
    }
    try {
      if (true) {
        ;
        [__temp, __restore] = executeAsync(() => router.push(initialURL)), await __temp, __restore();
        ;
      }
      ;
      [__temp, __restore] = executeAsync(() => router.isReady()), await __temp, __restore();
      ;
    } catch (error2) {
      [__temp, __restore] = executeAsync(() => nuxtApp.runWithContext(() => showError(error2))), await __temp, __restore();
    }
    const resolvedInitialRoute = router.currentRoute.value;
    const hasDeferredRoute = false;
    syncCurrentRoute();
    if (nuxtApp.ssrContext?.islandContext && !isServerPage) {
      return { provide: { router } };
    }
    const initialLayout = nuxtApp.payload.state._layout;
    router.beforeEach(async (to, from) => {
      await nuxtApp.callHook("page:loading:start");
      to.meta = reactive(to.meta);
      if (nuxtApp.isHydrating && initialLayout && !isReadonly(to.meta.layout)) {
        to.meta.layout = initialLayout;
      }
      nuxtApp._processingMiddleware = true;
      if (!nuxtApp.ssrContext?.islandContext || isServerPage) {
        const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
        for (const component of to.matched) {
          const componentMiddleware = component.meta.middleware;
          if (!componentMiddleware) {
            continue;
          }
          for (const entry2 of toArray$1(componentMiddleware)) {
            middlewareEntries.add(entry2);
          }
        }
        const routeRules = getRouteRules({ path: to.path });
        if (routeRules.appMiddleware) {
          for (const key in routeRules.appMiddleware) {
            if (routeRules.appMiddleware[key]) {
              middlewareEntries.add(key);
            } else {
              middlewareEntries.delete(key);
            }
          }
        }
        for (const entry2 of middlewareEntries) {
          const middleware = typeof entry2 === "string" ? nuxtApp._middleware.named[entry2] || await namedMiddleware[entry2]?.().then((r) => r.default || r) : entry2;
          if (!middleware) {
            throw new Error(`Unknown route middleware: '${entry2}'.`);
          }
          try {
            if (false) ;
            const result = await nuxtApp.runWithContext(() => middleware(to, from));
            if (true) {
              if (result === false || result instanceof Error) {
                const error2 = result || createError({
                  status: 404,
                  statusText: `Page Not Found: ${initialURL}`
                });
                await nuxtApp.runWithContext(() => showError(error2));
                return false;
              }
            }
            if (result === true) {
              continue;
            }
            if (result === false) {
              return result;
            }
            if (result) {
              if (isNuxtError(result) && result.fatal) {
                await nuxtApp.runWithContext(() => showError(result));
              }
              return result;
            }
          } catch (err) {
            const error2 = createError(err);
            if (error2.fatal) {
              await nuxtApp.runWithContext(() => showError(error2));
            }
            return error2;
          }
        }
      }
    });
    if (isServerPage) {
      router.beforeResolve((to) => {
        const expected = pageIslandRoutes[nuxtApp.ssrContext.islandContext.name];
        const actual = to.matched.find((m) => m.components?.default?.__nuxt_island)?.components?.default;
        if (!expected || expected !== actual?.__nuxt_island) {
          nuxtApp.ssrContext["~renderResponse"] = {
            statusCode: 400,
            statusMessage: "Invalid island request path"
          };
          return false;
        }
      });
    }
    router.onError(async () => {
      delete nuxtApp._processingMiddleware;
      await nuxtApp.callHook("page:loading:end");
    });
    router.afterEach((to) => {
      if (to.matched.length === 0 && !error.value) {
        return nuxtApp.runWithContext(() => showError(createError({
          status: 404,
          fatal: false,
          statusText: `Page not found: ${to.fullPath}`,
          data: {
            path: to.fullPath
          }
        })));
      }
    });
    nuxtApp.hooks.hookOnce("app:created", async () => {
      try {
        if ("name" in resolvedInitialRoute) {
          resolvedInitialRoute.name = void 0;
        }
        if (hasDeferredRoute) ;
        else {
          await router.replace({
            ...resolvedInitialRoute,
            force: true
          });
        }
        router.options.scrollBehavior = routerOptions.scrollBehavior;
      } catch (error2) {
        await nuxtApp.runWithContext(() => showError(error2));
      }
    });
    return { provide: { router } };
  }
});
async function fetchWithRetry(req, init) {
  const retries = 3;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fetch(req, init);
    } catch (error) {
      if (init?.signal?.aborted) {
        throw error;
      }
      if (attempt === retries) {
        console.error(`Error fetching request ${req}`, error, init);
        throw error;
      }
      console.warn(`Retrying fetch attempt ${attempt + 1} for request: ${req}`);
      await new Promise((resolve) => setTimeout(resolve, 100 * attempt));
    }
  }
  throw new Error("Unreachable code");
}
function setCookies(event, cookies) {
  const response = event.node.res;
  const headersWritable = () => !response.headersSent && !response.writableEnded;
  if (!headersWritable()) {
    return;
  }
  for (const { name, value, options } of cookies) {
    if (!headersWritable()) {
      break;
    }
    setCookie(event, name, value, options);
  }
}
const serverSupabaseClient = async (event) => {
  if (!event.context._supabaseClient) {
    const { url, key, cookiePrefix, cookieOptions, clientOptions: { auth = {}, global = {} } } = (/* @__PURE__ */ useRuntimeConfig()).public.supabase;
    event.context._supabaseClient = createServerClient(url, key, {
      auth,
      cookies: {
        getAll: () => parseCookieHeader(getHeader(event, "Cookie") ?? ""),
        setAll: (cookies) => setCookies(event, cookies)
      },
      cookieOptions: {
        ...cookieOptions,
        name: cookiePrefix
      },
      global: {
        fetch: fetchWithRetry,
        ...global
      }
    });
  }
  return event.context._supabaseClient;
};
const serverSupabaseUser = async (event) => {
  const client = await serverSupabaseClient(event);
  const { data, error } = await client.auth.getClaims();
  if (error) {
    throw createError$1({ statusMessage: error?.message });
  }
  return data?.claims ?? null;
};
const serverSupabaseSession = async (event) => {
  const client = await serverSupabaseClient(event);
  const { data: { session }, error } = await client.auth.getSession();
  if (error) {
    throw createError$1({ statusMessage: error?.message });
  }
  delete session?.user;
  return session;
};
const useStateKeyPrefix = "$s";
function useState(...args) {
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (typeof args[0] !== "string") {
    args.unshift(autoKey);
  }
  const [_key, init] = args;
  if (!_key || typeof _key !== "string") {
    throw new TypeError("[nuxt] [useState] key must be a string: " + _key);
  }
  if (init !== void 0 && typeof init !== "function") {
    throw new Error("[nuxt] [useState] init must be a function: " + init);
  }
  const key = useStateKeyPrefix + _key;
  const nuxtApp = useNuxtApp();
  const state = toRef(nuxtApp.payload.state, key);
  if (state.value === void 0 && init) {
    const initialValue = init();
    if (isRef(initialValue)) {
      nuxtApp.payload.state[key] = initialValue;
      return initialValue;
    }
    state.value = initialValue;
  }
  return state;
}
const useSupabaseSession = () => useState("supabase_session", () => null);
const useSupabaseUser = () => useState("supabase_user", () => null);
const supabase_server_NZuw_NDm2ZtOgvg4QqXN_Xqdg_KPvGuBBWKrLH15GWY = /* @__PURE__ */ defineNuxtPlugin({
  name: "supabase",
  enforce: "pre",
  async setup({ provide: provide2 }) {
    let __temp, __restore;
    const { url, key, cookiePrefix, useSsrCookies, cookieOptions, clientOptions } = (/* @__PURE__ */ useRuntimeConfig()).public.supabase;
    const event = useRequestEvent();
    const client = createServerClient(url, key, {
      ...clientOptions,
      cookies: {
        getAll: () => parseCookieHeader(getHeader(event, "Cookie") ?? ""),
        setAll: (cookies) => setCookies(event, cookies)
      },
      cookieOptions: {
        ...cookieOptions,
        name: cookiePrefix
      },
      global: {
        fetch: fetchWithRetry,
        ...clientOptions.global
      }
    });
    provide2("supabase", { client });
    if (useSsrCookies) {
      const [
        session,
        user
      ] = ([__temp, __restore] = executeAsync(() => Promise.all([
        serverSupabaseSession(event).catch(() => null),
        serverSupabaseUser(event).catch(() => null)
      ])), __temp = await __temp, __restore(), __temp);
      useSupabaseSession().value = session;
      useSupabaseUser().value = user;
    }
  }
});
function definePayloadReducer(name, reduce) {
  {
    useNuxtApp().ssrContext["~payloadReducers"][name] = reduce;
  }
}
const reducers = [
  ["NuxtError", (data) => isNuxtError(data) && data.toJSON()],
  ["EmptyShallowRef", (data) => isRef(data) && isShallow(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["EmptyRef", (data) => isRef(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["ShallowRef", (data) => isRef(data) && isShallow(data) && data.value],
  ["ShallowReactive", (data) => isReactive(data) && isShallow(data) && toRaw(data)],
  ["Ref", (data) => isRef(data) && data.value],
  ["Reactive", (data) => isReactive(data) && toRaw(data)]
];
const revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:revive-payload:server",
  setup() {
    for (const [reducer, fn] of reducers) {
      definePayloadReducer(reducer, fn);
    }
  }
});
const piniaSymbol = (
  /* istanbul ignore next */
  /* @__PURE__ */ Symbol()
);
var MutationType;
(function(MutationType2) {
  MutationType2["direct"] = "direct";
  MutationType2["patchObject"] = "patch object";
  MutationType2["patchFunction"] = "patch function";
})(MutationType || (MutationType = {}));
function createPinia() {
  const scope = effectScope(true);
  const state = scope.run(() => ref({}));
  let _p = [];
  let toBeInstalled = [];
  const pinia = markRaw({
    install(app) {
      {
        pinia._a = app;
        app.provide(piniaSymbol, pinia);
        app.config.globalProperties.$pinia = pinia;
        toBeInstalled.forEach((plugin2) => _p.push(plugin2));
        toBeInstalled = [];
      }
    },
    use(plugin2) {
      if (!this._a && true) {
        toBeInstalled.push(plugin2);
      } else {
        _p.push(plugin2);
      }
      return this;
    },
    _p,
    // it's actually undefined here
    // @ts-expect-error
    _a: null,
    _e: scope,
    _s: /* @__PURE__ */ new Map(),
    state
  });
  return pinia;
}
defineComponent({
  name: "ServerPlaceholder",
  render() {
    return createElementBlock("div");
  }
});
const clientOnlySymbol = /* @__PURE__ */ Symbol.for("nuxt:client-only");
const __nuxt_component_0$3 = defineComponent({
  name: "ClientOnly",
  inheritAttrs: false,
  props: ["fallback", "placeholder", "placeholderTag", "fallbackTag"],
  ...false,
  setup(props, { slots, attrs }) {
    const mounted = shallowRef(false);
    const vm = getCurrentInstance();
    if (vm) {
      vm._nuxtClientOnly = true;
    }
    provide(clientOnlySymbol, true);
    return () => {
      if (mounted.value) {
        const vnodes = slots.default?.();
        if (vnodes && vnodes.length === 1) {
          return [cloneVNode(vnodes[0], attrs)];
        }
        return vnodes;
      }
      const slot = slots.fallback || slots.placeholder;
      if (slot) {
        return h(slot);
      }
      const fallbackStr = props.fallback || props.placeholder || "";
      const fallbackTag = props.fallbackTag || props.placeholderTag || "span";
      return createElementBlock(fallbackTag, attrs, fallbackStr);
    };
  }
});
const firstNonUndefined = (...args) => args.find((arg) => arg !== void 0);
// @__NO_SIDE_EFFECTS__
function defineNuxtLink(options) {
  const componentName = options.componentName || "NuxtLink";
  function isHashLinkWithoutHashMode(link) {
    return typeof link === "string" && link.startsWith("#");
  }
  function resolveTrailingSlashBehavior(to, resolve, trailingSlash) {
    const effectiveTrailingSlash = trailingSlash ?? options.trailingSlash;
    if (!to || effectiveTrailingSlash !== "append" && effectiveTrailingSlash !== "remove") {
      return to;
    }
    if (typeof to === "string") {
      return applyTrailingSlashBehavior(to, effectiveTrailingSlash);
    }
    const path = "path" in to && to.path !== void 0 ? to.path : resolve(to).path;
    const resolvedPath = {
      ...to,
      name: void 0,
      // named routes would otherwise always override trailing slash behavior
      path: applyTrailingSlashBehavior(path, effectiveTrailingSlash)
    };
    return resolvedPath;
  }
  function useNuxtLink(props) {
    const router = useRouter();
    const config = /* @__PURE__ */ useRuntimeConfig();
    const hasTarget = computed(() => !!unref(props.target) && unref(props.target) !== "_self");
    const isAbsoluteUrl = computed(() => {
      const path = unref(props.to) || unref(props.href) || "";
      return typeof path === "string" && hasProtocol(path, { acceptRelative: true });
    });
    const builtinRouterLink = resolveComponent("RouterLink");
    const useBuiltinLink = builtinRouterLink && typeof builtinRouterLink !== "string" ? builtinRouterLink.useLink : void 0;
    const isExternal = computed(() => {
      if (unref(props.external)) {
        return true;
      }
      const path = unref(props.to) || unref(props.href) || "";
      if (typeof path === "object") {
        return false;
      }
      return path === "" || isAbsoluteUrl.value;
    });
    const to = computed(() => {
      const path = unref(props.to) || unref(props.href) || "";
      if (isExternal.value) {
        return path;
      }
      return resolveTrailingSlashBehavior(path, router.resolve, unref(props.trailingSlash));
    });
    const link = isExternal.value ? void 0 : useBuiltinLink?.({ ...props, to, viewTransition: unref(props.viewTransition) });
    const href = computed(() => {
      const effectiveTrailingSlash = unref(props.trailingSlash) ?? options.trailingSlash;
      if (!to.value || isAbsoluteUrl.value || isHashLinkWithoutHashMode(to.value)) {
        return to.value;
      }
      if (isExternal.value) {
        const path = typeof to.value === "object" && "path" in to.value ? resolveRouteObject(to.value) : to.value;
        const href2 = typeof path === "object" ? router.resolve(path).href : path;
        return applyTrailingSlashBehavior(href2, effectiveTrailingSlash);
      }
      if (typeof to.value === "object") {
        return router.resolve(to.value)?.href ?? null;
      }
      return applyTrailingSlashBehavior(joinURL(config.app.baseURL, to.value), effectiveTrailingSlash);
    });
    return {
      to,
      hasTarget,
      isAbsoluteUrl,
      isExternal,
      //
      href,
      isActive: link?.isActive ?? computed(() => to.value === router.currentRoute.value.path),
      isExactActive: link?.isExactActive ?? computed(() => to.value === router.currentRoute.value.path),
      route: link?.route ?? computed(() => router.resolve(to.value)),
      async navigate(_e) {
        await navigateTo(href.value, { replace: unref(props.replace), external: isExternal.value || hasTarget.value });
      }
    };
  }
  return defineComponent({
    name: componentName,
    props: {
      // Routing
      to: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      href: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      // Attributes
      target: {
        type: String,
        default: void 0,
        required: false
      },
      rel: {
        type: String,
        default: void 0,
        required: false
      },
      noRel: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Prefetching
      prefetch: {
        type: Boolean,
        default: void 0,
        required: false
      },
      prefetchOn: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      noPrefetch: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Styling
      activeClass: {
        type: String,
        default: void 0,
        required: false
      },
      exactActiveClass: {
        type: String,
        default: void 0,
        required: false
      },
      prefetchedClass: {
        type: String,
        default: void 0,
        required: false
      },
      // Vue Router's `<RouterLink>` additional props
      replace: {
        type: Boolean,
        default: void 0,
        required: false
      },
      ariaCurrentValue: {
        type: String,
        default: void 0,
        required: false
      },
      // Edge cases handling
      external: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Slot API
      custom: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Behavior
      trailingSlash: {
        type: String,
        default: void 0,
        required: false
      }
    },
    useLink: useNuxtLink,
    setup(props, { slots }) {
      const router = useRouter();
      const { to, href, navigate, isExternal, hasTarget, isAbsoluteUrl } = useNuxtLink(props);
      shallowRef(false);
      const el = void 0;
      const elRef = void 0;
      async function prefetch(nuxtApp = useNuxtApp()) {
        {
          return;
        }
      }
      return () => {
        if (!isExternal.value && !hasTarget.value && !isHashLinkWithoutHashMode(to.value)) {
          const routerLinkProps = {
            ref: elRef,
            to: to.value,
            activeClass: props.activeClass || options.activeClass,
            exactActiveClass: props.exactActiveClass || options.exactActiveClass,
            replace: props.replace,
            ariaCurrentValue: props.ariaCurrentValue,
            custom: props.custom
          };
          if (!props.custom) {
            routerLinkProps.rel = props.rel || void 0;
          }
          return h(
            resolveComponent("RouterLink"),
            routerLinkProps,
            slots.default
          );
        }
        const target = props.target || null;
        const rel = firstNonUndefined(
          // converts `""` to `null` to prevent the attribute from being added as empty (`rel=""`)
          props.noRel ? "" : props.rel,
          options.externalRelAttribute,
          /*
          * A fallback rel of `noopener noreferrer` is applied for external links or links that open in a new tab.
          * This solves a reverse tabnapping security flaw in browsers pre-2021 as well as improving privacy.
          */
          isAbsoluteUrl.value || hasTarget.value ? "noopener noreferrer" : ""
        ) || null;
        if (props.custom) {
          if (!slots.default) {
            return null;
          }
          return slots.default({
            href: href.value,
            navigate,
            prefetch,
            get route() {
              if (!href.value) {
                return void 0;
              }
              const url = new URL(href.value, "http://localhost");
              return {
                path: url.pathname,
                fullPath: url.pathname,
                get query() {
                  return parseQuery(url.search);
                },
                hash: url.hash,
                params: {},
                name: void 0,
                matched: [],
                redirectedFrom: void 0,
                meta: {},
                href: href.value
              };
            },
            rel,
            target,
            isExternal: isExternal.value || hasTarget.value,
            isActive: false,
            isExactActive: false
          });
        }
        return h("a", {
          ref: el,
          href: href.value || null,
          // converts `""` to `null` to prevent the attribute from being added as empty (`href=""`)
          rel,
          target,
          onClick: async (event) => {
            if (isExternal.value || hasTarget.value) {
              return;
            }
            event.preventDefault();
            try {
              const encodedHref = encodeRoutePath(href.value);
              return await (props.replace ? router.replace(encodedHref) : router.push(encodedHref));
            } finally {
            }
          }
        }, slots.default?.());
      };
    }
  });
}
const __nuxt_component_0$2 = /* @__PURE__ */ defineNuxtLink(nuxtLinkDefaults);
function applyTrailingSlashBehavior(to, trailingSlash) {
  const normalizeFn = trailingSlash === "append" ? withTrailingSlash : withoutTrailingSlash;
  const hasProtocolDifferentFromHttp = hasProtocol(to) && !to.startsWith("http");
  if (hasProtocolDifferentFromHttp) {
    return to;
  }
  return normalizeFn(to, true);
}
const plugin = /* @__PURE__ */ defineNuxtPlugin({
  name: "pinia",
  setup(nuxtApp) {
    const pinia = createPinia();
    nuxtApp.vueApp.use(pinia);
    {
      nuxtApp.payload.pinia = pinia.state.value;
    }
    return {
      provide: {
        pinia
      }
    };
  }
});
const components_plugin_z4hgvsiddfKkfXTP6M8M4zG5Cb7sGnDhcryKVM45Di4 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:global-components"
});
const plugins = [
  unhead_k2P3m_ZDyjlr2mMYnoDPwavjsDN8hBlk9cFai0bbopU,
  plugin$1,
  supabase_server_NZuw_NDm2ZtOgvg4QqXN_Xqdg_KPvGuBBWKrLH15GWY,
  revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms,
  plugin,
  components_plugin_z4hgvsiddfKkfXTP6M8M4zG5Cb7sGnDhcryKVM45Di4
];
const ariaLabel = "Согласие на обработку персональных данных для входа";
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "PdConsentCheckbox",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    consentHref: {},
    variant: {}
  }, {
    "modelValue": { type: Boolean, ...{ default: false } },
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const model = useModel(__props, "modelValue");
    const props = __props;
    const inputId = useId();
    const wrapClass = computed(
      () => props.variant === "dark" ? "rounded-xl border border-[color:var(--color-primary-100)] bg-[color:var(--color-surface-card)] p-3.5 shadow-sm" : "rounded-lg border border-gray-200 bg-gray-50/80 p-3.5"
    );
    const checkboxClass = computed(
      () => props.variant === "dark" ? "border-[color:var(--color-text-muted)]/45 bg-[color:var(--color-surface-bg)] accent-[var(--color-primary)] checked:border-primary checked:bg-primary/15" : "border-gray-400 bg-white accent-[var(--color-primary)] checked:border-primary"
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$2;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["text-left", wrapClass.value],
        role: "group",
        "aria-label": ariaLabel
      }, _attrs))}><div class="flex gap-3"><input${ssrRenderAttr("id", unref(inputId))}${ssrIncludeBooleanAttr(Array.isArray(model.value) ? ssrLooseContain(model.value, null) : model.value) ? " checked" : ""} type="checkbox" class="${ssrRenderClass([checkboxClass.value, "mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded border-2"])}"><label${ssrRenderAttr("for", unref(inputId))} class="min-w-0 cursor-pointer text-sm leading-snug"><span class="block font-medium text-[color:var(--color-text-primary)]">Согласие на обработку персональных данных</span><span class="mt-1 block text-xs leading-relaxed text-[color:var(--color-text-muted)]"> Я согласен(на) на `);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: __props.consentHref,
        target: "_blank",
        rel: "noopener noreferrer",
        class: "underline decoration-dotted underline-offset-2 text-primary hover:opacity-90",
        onClick: () => {
        }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` обработку персональных данных `);
          } else {
            return [
              createTextVNode(" обработку персональных данных ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(` (текст откроется в новой вкладке). </span></label></div></div>`);
    };
  }
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/auth/PdConsentCheckbox.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
function useTelegram() {
  function readCachedInitData() {
    return "";
  }
  const isTelegram = computed(() => {
    return false;
  });
  const isMaxMiniApp = computed(() => {
    return false;
  });
  const isMessengerMiniApp = computed(() => isTelegram.value || isMaxMiniApp.value);
  const webApp = computed(() => {
    return null;
  });
  const messengerWebApp = computed(() => {
    return null;
  });
  const messengerInitDataTick = ref(0);
  function readMessengerInitDataNow() {
    const fromBridge = messengerWebApp.value?.initData?.trim() || "";
    if (fromBridge) {
      return fromBridge;
    }
    return readCachedInitData();
  }
  const messengerInitData = computed(() => {
    void messengerInitDataTick.value;
    return readMessengerInitDataNow();
  });
  useState("messenger-initdata-poll-bootstrapped", () => false);
  function buildMessengerAuthHeaders(extra) {
    const headers = { ...extra };
    const data = messengerInitData.value;
    if (data) {
      headers["x-telegram-init-data"] = data;
      headers["x-messenger-init-data"] = data;
    }
    return headers;
  }
  function messengerClientChannel() {
    if (isTelegram.value) return "telegram_mini";
    if (isMaxMiniApp.value) return "max_mini";
    return "web";
  }
  function expandMessengerViewport() {
    const app = messengerWebApp.value;
    if (!app || typeof app.expand !== "function") return;
    try {
      app.expand();
    } catch {
    }
  }
  function showMainButton(text) {
    if (!webApp.value) return;
    webApp.value.MainButton.text = text;
    webApp.value.MainButton.show();
  }
  function hideMainButton() {
    if (!webApp.value) return;
    webApp.value.MainButton.hide();
  }
  function onMainButtonClick(handler) {
    if (!webApp.value) return;
    webApp.value.MainButton.onClick(handler);
  }
  function offMainButtonClick(handler) {
    if (!webApp.value) return;
    webApp.value.MainButton.offClick(handler);
  }
  function cardClass(baseWeb) {
    return baseWeb;
  }
  function buttonClass(baseWeb) {
    return baseWeb;
  }
  function textClass(baseWeb) {
    return baseWeb;
  }
  function mutedTextClass(baseWeb) {
    return baseWeb;
  }
  return {
    isTelegram,
    isMaxMiniApp,
    isMessengerMiniApp,
    webApp,
    messengerWebApp,
    messengerInitData,
    buildMessengerAuthHeaders,
    messengerClientChannel,
    expandMessengerViewport,
    showMainButton,
    hideMainButton,
    onMainButtonClick,
    offMainButtonClick,
    cardClass,
    buttonClass,
    textClass,
    mutedTextClass
  };
}
function normalizeTheme(input) {
  if (!input || typeof input !== "object") return {};
  const out = {};
  for (const [key, value] of Object.entries(input)) {
    if (typeof value === "string" && value.trim()) out[key] = value.trim();
  }
  return out;
}
function getStringSetting(input, ...keys) {
  if (!input) return null;
  for (const key of keys) {
    const value = input[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return null;
}
function getObjectSetting(input, ...keys) {
  if (!input) return null;
  for (const key of keys) {
    const value = input[key];
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return value;
    }
  }
  return null;
}
function buildCssVars(theme) {
  const vars = {};
  const mapping = {
    primary: "--color-primary",
    primary_50: "--color-primary-50",
    primary_100: "--color-primary-100",
    primary_600: "--color-primary-600",
    primary_700: "--color-primary-700",
    on_primary: "--color-on-primary",
    secondary: "--color-secondary",
    accent: "--color-accent",
    surface_background: "--color-surface-bg",
    surface_card: "--color-surface-card",
    text_primary: "--color-text-primary",
    text_muted: "--color-text-muted",
    state_success: "--color-success",
    state_warning: "--color-warning",
    state_error: "--color-error",
    radius_button: "--radius-button",
    radius_modal: "--radius-modal",
    radius_input: "--radius-input",
    radius_card: "--radius-card"
  };
  for (const [key, value] of Object.entries(theme)) {
    vars[`--tenant-${key}`] = value;
    const cssVar = mapping[key];
    if (cssVar) {
      vars[cssVar] = value;
    }
  }
  return vars;
}
function normalizeRouteQueryParam(value) {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (Array.isArray(value)) {
    const found = value.find((x) => typeof x === "string" && !!x.trim());
    if (found) return found.trim();
  }
  return null;
}
function useTenant() {
  const route = useRoute$1();
  const { buildMessengerAuthHeaders } = useTelegram();
  const isDashboardRoute = computed(() => {
    const routePath = typeof route.path === "string" ? route.path : "";
    if (routePath.startsWith("/dashboard")) return true;
    return false;
  });
  const isNonTenantRoute = computed(() => {
    const routePath = typeof route.path === "string" ? route.path : "";
    const nonTenantPrefixes = [
      "/dashboard",
      "/onboarding",
      "/login",
      "/register",
      "/profile",
      "/partners",
      "/platform",
      "/link-telegram",
      "/link-max",
      "/link-vk"
    ];
    return nonTenantPrefixes.some((prefix) => routePath.startsWith(prefix));
  });
  const event = useRequestEvent();
  const state = useState("tenant-state", () => ({
    loaded: false,
    loading: false,
    shopId: null,
    tenantSlug: null,
    shopName: null,
    theme: {},
    isCustomDomain: false,
    logoUrl: null,
    logoLargeUrl: null,
    description: null,
    legalName: null,
    inn: null,
    ogrn: null,
    organizationTimezone: null,
    organizationWorkingHours: null,
    organizationDineInStaffButtons: null,
    effectiveWorkingHours: null
  }));
  function applyTenant(payload) {
    state.value.shopId = payload.shopId ?? null;
    state.value.tenantSlug = payload.tenantSlug ?? payload.shop?.slug ?? state.value.tenantSlug ?? null;
    state.value.shopName = payload.shop?.name ?? state.value.shopName ?? null;
    const normalizedTheme = normalizeTheme(payload.uiSettings);
    state.value.theme = normalizedTheme;
    state.value.isCustomDomain = !!payload.isCustomDomain;
    state.value.logoUrl = getStringSetting(payload.uiSettings ?? null, "logo_url", "logoUrl");
    state.value.logoLargeUrl = getStringSetting(payload.uiSettings ?? null, "logo_large_url", "logoLargeUrl");
    state.value.description = getStringSetting(payload.uiSettings ?? null, "description", "shop_description", "shopDescription");
    state.value.legalName = typeof payload.shop?.legalName === "string" ? payload.shop.legalName : null;
    state.value.inn = typeof payload.shop?.inn === "string" ? payload.shop.inn : null;
    state.value.ogrn = typeof payload.shop?.ogrn === "string" ? payload.shop.ogrn : null;
    state.value.organizationTimezone = getStringSetting(payload.uiSettings ?? null, "organization_timezone");
    state.value.organizationWorkingHours = getObjectSetting(payload.uiSettings ?? null, "organization_working_hours");
    state.value.organizationDineInStaffButtons = getObjectSetting(payload.uiSettings ?? null, "organization_dine_in_staff_buttons");
    state.value.effectiveWorkingHours = getObjectSetting(payload.uiSettings ?? null, "effective_working_hours");
    state.value.loaded = true;
    state.value.loading = false;
  }
  if (event?.context?.tenant && !state.value.loaded) {
    applyTenant({
      shopId: event.context.tenant.shopId,
      tenantSlug: event.context.tenant.shop.slug,
      shop: {
        name: event.context.tenant.shop.name,
        slug: event.context.tenant.shop.slug,
        legalName: event.context.tenant.shop.legal_name ?? null,
        inn: event.context.tenant.shop.inn ?? null,
        ogrn: event.context.tenant.shop.ogrn ?? null
      },
      uiSettings: event.context.tenant.uiSettings,
      isCustomDomain: !!event.context.tenant.isCustomDomain
    });
    state.value.loaded = false;
    state.value.loading = false;
  }
  const routeTenantSlug = computed(
    () => typeof route.params.tenant_slug === "string" ? route.params.tenant_slug : null
  );
  const routeCitySlug = computed(
    () => typeof route.params.city_slug === "string" ? route.params.city_slug : null
  );
  const routeFestivalSlug = computed(() => {
    if (typeof route.params.festival_slug === "string" && route.params.festival_slug.trim()) {
      return route.params.festival_slug.trim();
    }
    const queryFestival = normalizeRouteQueryParam(route.query.festival_slug);
    return queryFestival || null;
  });
  const tenantKey = computed(
    () => (
      // Витрина ресторана SPA-навигация: приоритет должен быть у URL.
      // Иначе tenantKey может не измениться (из-за tenantSlug в state),
      // и тогда мы не перезагрузим theme/настройки нового ресторана.
      state.value.isCustomDomain ? state.value.shopId || state.value.tenantSlug || normalizeRouteQueryParam(route.query.shop_id) : routeTenantSlug.value || state.value.shopId || state.value.tenantSlug || normalizeRouteQueryParam(route.query.shop_id)
    )
  );
  const authLinkRestaurantHint = computed(() => {
    const routePath = typeof route.path === "string" ? route.path : "";
    if (!/^\/link-(telegram|max|vk)(\/|$)/.test(routePath)) return null;
    const raw = normalizeRouteQueryParam(route.query.redirect);
    if (!raw || !raw.startsWith("/")) return null;
    const pathOnly = raw.split("?")[0].replace(/\/+$/, "") || "/";
    const segments = pathOnly.split("/").filter(Boolean);
    const shopFromQuery = normalizeRouteQueryParam(route.query.shop_id);
    const RESERVED_SECOND = /* @__PURE__ */ new Set([
      "orders",
      "checkout",
      "cart",
      "profile",
      "partners",
      "platform",
      "login",
      "register",
      "festival",
      "bonuses",
      "achievements"
    ]);
    if (segments.length >= 2 && segments[1] === "festival") {
      if (segments.length < 4) return null;
      const tenantSeg = segments[3];
      if (shopFromQuery && tenantSeg !== shopFromQuery) return null;
      return {
        citySlug: segments[0],
        festivalSlug: segments[2],
        tenantSlug: tenantSeg
      };
    }
    if (segments.length >= 2) {
      const tenantSeg = segments[1];
      if (RESERVED_SECOND.has(tenantSeg)) return null;
      if (shopFromQuery && tenantSeg !== shopFromQuery) return null;
      if (!shopFromQuery && state.value.tenantSlug && tenantSeg !== state.value.tenantSlug) return null;
      return {
        citySlug: segments[0],
        festivalSlug: null,
        tenantSlug: tenantSeg
      };
    }
    return null;
  });
  const routePrefix = computed(() => {
    const slug = routeTenantSlug.value || state.value.tenantSlug;
    if (!slug || state.value.isCustomDomain) return "";
    const hint = authLinkRestaurantHint.value;
    const citySlug = routeCitySlug.value || hint?.citySlug || null;
    const festivalSlug = routeFestivalSlug.value || hint?.festivalSlug || null;
    if (citySlug && festivalSlug) {
      return `/${citySlug}/festival/${festivalSlug}/${slug}`;
    }
    if (citySlug) return `/${citySlug}/${slug}`;
    return `/${slug}`;
  });
  const branchScopeSignature = computed(
    () => JSON.stringify([
      normalizeRouteQueryParam(route.query.branch_id),
      normalizeRouteQueryParam(route.query.restaurant_id)
    ])
  );
  const cssVars = computed(() => {
    return buildCssVars(state.value.theme);
  });
  function tenantPath(path = "/") {
    const normalized = path.startsWith("/") ? path : `/${path}`;
    if (normalized === "/") {
      return routePrefix.value || "/";
    }
    return `${routePrefix.value}${normalized}`;
  }
  async function loadTenantSettings() {
    if (state.value.loading || state.value.loaded) return;
    const explicitTenantFromQuery = normalizeRouteQueryParam(route.query.shop_id);
    if ((isDashboardRoute.value || isNonTenantRoute.value) && !explicitTenantFromQuery) {
      state.value.loaded = true;
      state.value.loading = false;
      return;
    }
    const tenantRef = tenantKey.value || void 0;
    if (!tenantRef && !state.value.isCustomDomain) {
      state.value.loaded = true;
      state.value.loading = false;
      return;
    }
    state.value.loading = true;
    try {
      const branchFromQuery = normalizeRouteQueryParam(route.query.branch_id);
      const restaurantFromQuery = normalizeRouteQueryParam(route.query.restaurant_id);
      const query = {};
      if (tenantRef) query.shop_id = tenantRef;
      if (branchFromQuery) query.branch_id = branchFromQuery;
      else if (restaurantFromQuery) query.restaurant_id = restaurantFromQuery;
      try {
        const res = await $fetch("/api/tenant", {
          query: Object.keys(query).length ? query : void 0,
          headers: buildMessengerAuthHeaders(tenantRef ? { "x-shop-id": tenantRef } : void 0)
        });
        if (res?.ok) {
          applyTenant(res);
        }
      } catch {
      }
    } finally {
      if (!state.value.loaded) {
        state.value.loaded = true;
        state.value.loading = false;
      }
    }
  }
  watch(
    tenantKey,
    async (key, prev) => {
      if (!key || key === prev) return;
      state.value.loaded = false;
      state.value.tenantSlug = null;
      state.value.shopId = null;
      state.value.shopName = null;
      state.value.logoUrl = null;
      state.value.logoLargeUrl = null;
      state.value.description = null;
      state.value.legalName = null;
      state.value.inn = null;
      state.value.ogrn = null;
      state.value.organizationTimezone = null;
      state.value.organizationWorkingHours = null;
      state.value.organizationDineInStaffButtons = null;
      state.value.effectiveWorkingHours = null;
      state.value.theme = {};
      try {
        await loadTenantSettings();
      } finally {
        state.value.loading = false;
      }
    },
    { immediate: false }
  );
  watch(
    branchScopeSignature,
    async (next, prev) => {
      if (next === prev) return;
      if (isDashboardRoute.value || isNonTenantRoute.value) return;
      state.value.loaded = false;
      await loadTenantSettings();
    },
    { immediate: false }
  );
  return {
    tenant: state,
    tenantKey,
    routePrefix,
    tenantPath,
    cssVars,
    loadTenantSettings
  };
}
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "AuthChannelModal",
  __ssrInlineRender: true,
  props: {
    modelValue: { type: Boolean },
    title: { default: "Выберите способ входа" },
    description: {},
    channels: {},
    intent: {},
    variant: { default: "light" },
    consentHref: {}
  },
  emits: ["update:modelValue", "submit"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const { tenant } = useTenant();
    const theme = computed(() => tenant.value.theme || {});
    const mainTextColor = computed(() => theme.value.text_primary || "var(--color-text-primary)");
    const mutedTextColor = computed(() => theme.value.text_muted || "var(--color-text-muted)");
    const surfaceCardColor = computed(() => theme.value.surface_card || "var(--color-surface-card)");
    const borderColor = computed(() => theme.value.primary_100 || "#e5e7eb");
    const panelStyle = computed(() => ({
      border: `1px solid ${borderColor.value}`,
      backgroundColor: surfaceCardColor.value,
      color: mainTextColor.value
    }));
    const panelClass = computed(
      () => props.variant === "light" ? "border border-gray-200 bg-white" : ""
    );
    const titleId = useId();
    const radioGroupName = `auth-channel-${useId()}`;
    const pdConsent = ref(false);
    const selectedChannel = ref("telegram");
    function syncSelection() {
      const list = props.channels;
      if (!list.length) return;
      if (!list.includes(selectedChannel.value)) {
        selectedChannel.value = list[0];
      }
    }
    watch(
      () => props.modelValue,
      (open) => {
        if (open) {
          pdConsent.value = false;
          syncSelection();
        }
      }
    );
    watch(
      () => props.channels,
      () => syncSelection(),
      { deep: true }
    );
    const primaryButtonLabel = computed(() => {
      const ch = selectedChannel.value;
      const intent = props.intent;
      if (intent === "continue") {
        if (ch === "telegram") return "Продолжить в Telegram";
        if (ch === "max") return "Продолжить в MAX";
        return "Далее";
      }
      if (intent === "profile") {
        if (ch === "telegram") return "Открыть Telegram";
        if (ch === "max") return "Открыть MAX";
        return "Войти через ВКонтакте";
      }
      if (ch === "vk") return "Войти через ВКонтакте";
      if (ch === "telegram") return "Войти через Telegram";
      return "Войти через MAX";
    });
    function channelLabel(ch) {
      if (ch === "telegram") return "Telegram";
      if (ch === "max") return "MAX";
      return "ВКонтакте";
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AuthPdConsentCheckbox = _sfc_main$6;
      ssrRenderTeleport(_push, (_push2) => {
        if (__props.modelValue) {
          _push2(`<div class="fixed inset-0 z-[90] flex items-center justify-center p-4" role="dialog" aria-modal="true"${ssrRenderAttr("aria-labelledby", unref(titleId))} data-v-d5aefbf8><div class="absolute inset-0 bg-black/40" aria-hidden="true" data-v-d5aefbf8></div><div class="${ssrRenderClass([panelClass.value, "modal-panel relative w-full max-w-sm rounded-2xl p-5 shadow-xl"])}" style="${ssrRenderStyle(__props.variant === "dark" ? panelStyle.value : void 0)}" data-v-d5aefbf8><h3${ssrRenderAttr("id", unref(titleId))} class="${ssrRenderClass([__props.variant === "light" ? "text-gray-900" : "", "text-base font-semibold"])}" style="${ssrRenderStyle(__props.variant === "dark" ? { color: mainTextColor.value } : void 0)}" data-v-d5aefbf8>${ssrInterpolate(__props.title)}</h3><p class="${ssrRenderClass([__props.variant === "light" ? "text-gray-600" : "", "mt-1 text-sm"])}" style="${ssrRenderStyle(__props.variant === "dark" ? { color: mutedTextColor.value } : void 0)}" data-v-d5aefbf8>${ssrInterpolate(__props.description)}</p>`);
          if (__props.channels.length) {
            _push2(`<fieldset class="mt-4 space-y-2" data-v-d5aefbf8><legend class="sr-only" data-v-d5aefbf8>Способ авторизации</legend><!--[-->`);
            ssrRenderList(__props.channels, (ch) => {
              _push2(`<label class="${ssrRenderClass([
                selectedChannel.value === ch ? "border-primary bg-primary/5 shadow-sm ring-2 ring-primary/20" : __props.variant === "dark" ? "border-white/15 bg-black/5 hover:border-white/25" : "border-gray-200 bg-white hover:border-gray-300",
                "flex cursor-pointer items-center gap-3 rounded-xl border-2 px-3 py-2.5 transition-colors focus-within:outline-none focus-within:ring-2 focus-within:ring-primary/35"
              ])}" data-v-d5aefbf8><input${ssrIncludeBooleanAttr(ssrLooseEqual(selectedChannel.value, ch)) ? " checked" : ""} type="radio"${ssrRenderAttr("name", radioGroupName)}${ssrRenderAttr("value", ch)} class="sr-only" data-v-d5aefbf8><span class="${ssrRenderClass([
                selectedChannel.value === ch ? __props.variant === "dark" ? "border-primary bg-primary/15" : "border-primary bg-white" : __props.variant === "dark" ? "border-white/40 bg-black/10" : "border-gray-400 bg-white",
                "relative flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors"
              ])}" aria-hidden="true" data-v-d5aefbf8><span class="${ssrRenderClass([
                selectedChannel.value === ch ? "h-2.5 w-2.5 scale-100 opacity-100" : "h-2.5 w-2.5 scale-0 opacity-0",
                "rounded-full bg-primary transition-all duration-150 ease-out"
              ])}" data-v-d5aefbf8></span></span><span class="${ssrRenderClass([__props.variant === "light" ? "text-gray-900" : "", "min-w-0 text-sm font-medium"])}" style="${ssrRenderStyle(__props.variant === "dark" ? { color: mainTextColor.value } : void 0)}" data-v-d5aefbf8>${ssrInterpolate(channelLabel(ch))}</span></label>`);
            });
            _push2(`<!--]--></fieldset>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<div class="mt-4" data-v-d5aefbf8>`);
          _push2(ssrRenderComponent(_component_AuthPdConsentCheckbox, {
            modelValue: pdConsent.value,
            "onUpdate:modelValue": ($event) => pdConsent.value = $event,
            variant: __props.variant,
            "consent-href": __props.consentHref
          }, null, _parent));
          _push2(`</div><div class="mt-4" data-v-d5aefbf8><button type="button" class="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-on-primary transition hover:bg-primary-600 active:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"${ssrIncludeBooleanAttr(!pdConsent.value || !__props.channels.length) ? " disabled" : ""} data-v-d5aefbf8>${ssrInterpolate(primaryButtonLabel.value)}</button></div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
    };
  }
});
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/auth/AuthChannelModal.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const __nuxt_component_1$1 = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-d5aefbf8"]]);
function useLegalPaths() {
  const route = useRoute$1();
  const config = /* @__PURE__ */ useRuntimeConfig();
  const defaultCitySlug = computed(() => {
    const raw = config.public?.defaultCitySlug;
    return typeof raw === "string" && raw.trim() ? raw.trim() : "ulan-ude";
  });
  const cityBasePath = computed(() => {
    const cs = route.params.city_slug;
    const city = Array.isArray(cs) ? cs[0] : cs;
    if (typeof city === "string" && city.trim()) return `/${city.trim()}`;
    return `/${defaultCitySlug.value}`;
  });
  const consentPath = computed(() => `${cityBasePath.value}/legal/consent`);
  const privacyPath = computed(() => `${cityBasePath.value}/legal/privacy`);
  const cookiesPath = computed(() => `${cityBasePath.value}/legal/cookies`);
  return { cityBasePath, consentPath, privacyPath, cookiesPath, defaultCitySlug };
}
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "AppHeader",
  __ssrInlineRender: true,
  setup(__props) {
    const { isMessengerMiniApp } = useTelegram();
    const user = useSupabaseUser();
    const config = /* @__PURE__ */ useRuntimeConfig();
    const route = useRoute$1();
    useRouter$1();
    useSupabaseClient();
    const { tenant, tenantPath } = useTenant();
    const { consentPath } = useLegalPaths();
    const telegramBotName = config.public.telegramBotName || "";
    const telegramBotUrl = computed(
      () => telegramBotName ? `https://t.me/${telegramBotName}` : null
    );
    const maxBotUrl = computed(() => {
      const raw = config.public.maxBotUrl || "";
      const trimmed = raw.trim();
      return trimmed || null;
    });
    const vkAuthEnabled = computed(() => {
      const raw = config.public.vkIdClientId;
      const appId2 = raw != null && raw !== "" ? String(raw).trim() : "";
      return Boolean(appId2);
    });
    const headerAuthChannels = computed(() => {
      const opts = [];
      if (telegramBotUrl.value) opts.push("telegram");
      if (maxBotUrl.value) opts.push("max");
      if (vkAuthEnabled.value) opts.push("vk");
      return opts;
    });
    function onAuthChannelSubmit(channel) {
      if (channel === "telegram") {
        void openTelegramAuth();
        return;
      }
      if (channel === "max") {
        void openMaxAuth();
        return;
      }
      void openVkAuth();
    }
    const homeLink = computed(() => tenantPath("/"));
    const festivalBackLink = computed(() => {
      const citySlug = typeof route.params.city_slug === "string" ? route.params.city_slug.trim() : "";
      const festivalSlug = typeof route.params.festival_slug === "string" ? route.params.festival_slug.trim() : "";
      const tenantSlug = typeof route.params.tenant_slug === "string" ? route.params.tenant_slug.trim() : "";
      if (citySlug && festivalSlug && tenantSlug) return `/${citySlug}/festival/${festivalSlug}`;
      return null;
    });
    const festivalPrefix = computed(() => {
      const citySlug = typeof route.params.city_slug === "string" ? route.params.city_slug.trim() : "";
      const festivalSlug = typeof route.params.festival_slug === "string" ? route.params.festival_slug.trim() : "";
      if (citySlug && festivalSlug) return `/${citySlug}/festival/${festivalSlug}`;
      if (citySlug) return `/${citySlug}`;
      return "";
    });
    const ordersLink = computed(() => {
      const citySlug = typeof route.params.city_slug === "string" ? route.params.city_slug.trim() : "";
      const tenantSlug = typeof route.params.tenant_slug === "string" ? route.params.tenant_slug.trim() : "";
      if (tenantSlug && festivalPrefix.value) return `${festivalPrefix.value}/${tenantSlug}/orders`;
      if (citySlug && tenantSlug) return `/${citySlug}/${tenantSlug}/orders`;
      if (citySlug) return `/${citySlug}/orders`;
      return tenantPath("/orders");
    });
    const bonusesLink = computed(() => {
      const tenantSlug = typeof route.params.tenant_slug === "string" ? route.params.tenant_slug.trim() : "";
      const citySlug = typeof route.params.city_slug === "string" ? route.params.city_slug.trim() : "";
      if (tenantSlug && festivalPrefix.value) return `${festivalPrefix.value}/${tenantSlug}/bonuses`;
      if (citySlug && tenantSlug) return `/${citySlug}/${tenantSlug}/bonuses`;
      return tenantPath("/bonuses");
    });
    const achievementsLink = computed(() => {
      const tenantSlug = typeof route.params.tenant_slug === "string" ? route.params.tenant_slug.trim() : "";
      const citySlug = typeof route.params.city_slug === "string" ? route.params.city_slug.trim() : "";
      if (festivalPrefix.value) return `${festivalPrefix.value}/achievements`;
      if (citySlug && tenantSlug) return `/${citySlug}/${tenantSlug}/achievements`;
      if (citySlug) return `/${citySlug}/achievements`;
      return tenantPath("/achievements");
    });
    const bonusesMenuVisible = computed(() => {
      const citySlug = typeof route.params.city_slug === "string" ? route.params.city_slug.trim() : "";
      const tenantSlug = typeof route.params.tenant_slug === "string" ? route.params.tenant_slug.trim() : "";
      return !!(citySlug && tenantSlug) || !!tenant.value.tenantSlug;
    });
    const achievementsMenuVisible = computed(() => {
      const citySlug = typeof route.params.city_slug === "string" ? route.params.city_slug.trim() : "";
      const tenantSlug = typeof route.params.tenant_slug === "string" ? route.params.tenant_slug.trim() : "";
      return !!citySlug || !!tenantSlug || !!tenant.value.tenantSlug;
    });
    const showMiniappCustomerLinks = computed(() => {
      if (isNonTenantRoute.value || isDashboardRoute.value) return false;
      const routeCitySlug = typeof route.params.city_slug === "string" ? route.params.city_slug.trim() : "";
      const routeTenantSlug = typeof route.params.tenant_slug === "string" ? route.params.tenant_slug.trim() : "";
      return !!(routeCitySlug || routeTenantSlug || tenant.value.tenantSlug);
    });
    const brandName = computed(() => {
      const raw = config.public.brandName;
      return typeof raw === "string" && raw.trim() ? raw.trim() : "INUU";
    });
    const tenantName = computed(() => tenant.value.shopName || brandName.value);
    const tenantLogoUrl = computed(() => tenant.value.logoUrl || tenant.value.logoLargeUrl || "/logo.webp");
    computed(() => tenant.value.description || "");
    const defaultCitySlug = computed(() => typeof config.public?.defaultCitySlug === "string" && config.public.defaultCitySlug.trim() ? config.public.defaultCitySlug.trim() : "ulan-ude");
    const availableCities = ref([]);
    const selectedCitySlug = ref(defaultCitySlug.value);
    const isDashboardRoute = computed(() => {
      const routePath = typeof route.path === "string" ? route.path : "";
      if (routePath.startsWith("/dashboard")) return true;
      return false;
    });
    const isNonTenantRoute = computed(() => {
      const routePath = typeof route.path === "string" ? route.path : "";
      const nonTenantPrefixes = [
        "/dashboard",
        "/onboarding",
        "/login",
        "/register",
        "/profile",
        "/partners",
        "/platform",
        "/link-telegram",
        "/link-max",
        "/link-vk"
      ];
      return nonTenantPrefixes.some((prefix) => routePath.startsWith(prefix));
    });
    const showCitySelector = computed(() => !isNonTenantRoute.value && availableCities.value.length > 1 && !!tenant.value.tenantSlug);
    const theme = computed(() => tenant.value.theme || {});
    const mainTextColor = computed(() => theme.value.text_primary || "var(--color-text-primary)");
    const surfaceCardColor = computed(() => theme.value.surface_card || "var(--color-surface-card)");
    const borderColor = computed(() => theme.value.primary_100 || "#e5e7eb");
    const headerStyle = computed(() => ({
      borderColor: borderColor.value,
      backgroundColor: `${surfaceCardColor.value}f2`
    }));
    const selectStyle = computed(() => ({
      border: `1px solid ${borderColor.value}`,
      backgroundColor: surfaceCardColor.value,
      color: mainTextColor.value
    }));
    const ghostButtonStyle = computed(() => ({
      border: `1px solid ${borderColor.value}`,
      color: mainTextColor.value,
      backgroundColor: "transparent"
    }));
    const iconButtonStyle = computed(() => ({
      border: `1px solid ${borderColor.value}`,
      color: mainTextColor.value,
      backgroundColor: "transparent"
    }));
    const menuStyle = computed(() => ({
      border: `1px solid ${borderColor.value}`,
      backgroundColor: surfaceCardColor.value,
      color: mainTextColor.value
    }));
    const showUserMenu = ref(false);
    const showMiniappMenu = ref(false);
    const showAuthModal = ref(false);
    ref(null);
    ref(null);
    const profileLink = computed(() => "/profile");
    async function openTelegramAuth() {
      showAuthModal.value = false;
      if (!telegramBotUrl.value || true) return;
    }
    async function openMaxAuth() {
      showAuthModal.value = false;
      if (!maxBotUrl.value || true) return;
    }
    async function openVkAuth() {
      showAuthModal.value = false;
      return;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$2;
      const _component_AuthChannelModal = __nuxt_component_1$1;
      _push(`<header${ssrRenderAttrs(mergeProps({
        class: "fixed inset-x-0 top-0 z-50 border-b backdrop-blur",
        style: headerStyle.value
      }, _attrs))} data-v-a04e87da><div class="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6" data-v-a04e87da><div class="flex min-w-0 items-center gap-3" data-v-a04e87da>`);
      if (festivalBackLink.value) {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: festivalBackLink.value,
          class: "flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition bg-black/5 hover:bg-black/10",
          style: { color: mainTextColor.value },
          "aria-label": "Назад к фестивалю"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" data-v-a04e87da${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" data-v-a04e87da${_scopeId}></path></svg>`);
            } else {
              return [
                (openBlock(), createBlock("svg", {
                  class: "h-5 w-5",
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24",
                  "aria-hidden": "true"
                }, [
                  createVNode("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "stroke-width": "2",
                    d: "M15 19l-7-7 7-7"
                  })
                ]))
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: homeLink.value,
        class: "flex min-w-0 items-center gap-3",
        style: { color: mainTextColor.value }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<img${ssrRenderAttr("src", tenantLogoUrl.value)}${ssrRenderAttr("alt", tenantName.value)} class="h-10 w-auto shrink-0 object-cover" data-v-a04e87da${_scopeId}><div class="min-w-0" data-v-a04e87da${_scopeId}><span class="block truncate text-sm font-semibold tracking-wide sm:text-base" data-v-a04e87da${_scopeId}>${ssrInterpolate(tenantName.value)}</span></div>`);
          } else {
            return [
              createVNode("img", {
                src: tenantLogoUrl.value,
                alt: tenantName.value,
                class: "h-10 w-auto shrink-0 object-cover"
              }, null, 8, ["src", "alt"]),
              createVNode("div", { class: "min-w-0" }, [
                createVNode("span", { class: "block truncate text-sm font-semibold tracking-wide sm:text-base" }, toDisplayString(tenantName.value), 1)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (showCitySelector.value) {
        _push(`<div class="hidden md:block" data-v-a04e87da><label class="sr-only" for="city-selector" data-v-a04e87da>Город</label><select id="city-selector" class="rounded-lg px-3 py-2 text-sm" style="${ssrRenderStyle(selectStyle.value)}" data-v-a04e87da><!--[-->`);
        ssrRenderList(availableCities.value, (city) => {
          _push(`<option${ssrRenderAttr("value", city.slug)} data-v-a04e87da${ssrIncludeBooleanAttr(Array.isArray(selectedCitySlug.value) ? ssrLooseContain(selectedCitySlug.value, city.slug) : ssrLooseEqual(selectedCitySlug.value, city.slug)) ? " selected" : ""}>${ssrInterpolate(city.name)}</option>`);
        });
        _push(`<!--]--></select></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(isMessengerMiniApp) && showMiniappCustomerLinks.value) {
        _push(`<div class="relative z-[51] shrink-0" data-v-a04e87da><button type="button" class="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition sm:text-sm" style="${ssrRenderStyle(ghostButtonStyle.value)}"${ssrRenderAttr("aria-expanded", showMiniappMenu.value)} aria-label="Меню заказов" data-v-a04e87da><span class="hidden sm:inline" data-v-a04e87da>Меню INUU</span><span class="sm:hidden" data-v-a04e87da>Меню</span><svg class="h-3 w-3 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" data-v-a04e87da><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" data-v-a04e87da></path></svg></button>`);
        if (showMiniappMenu.value) {
          _push(`<div class="absolute right-0 mt-2 w-52 rounded-lg py-1 text-sm shadow-lg dropdown-panel" style="${ssrRenderStyle(menuStyle.value)}" data-v-a04e87da>`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: profileLink.value,
            class: "block px-3 py-2",
            style: { color: mainTextColor.value },
            onClick: ($event) => showMiniappMenu.value = false
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Профиль `);
              } else {
                return [
                  createTextVNode(" Профиль ")
                ];
              }
            }),
            _: 1
          }, _parent));
          if (achievementsMenuVisible.value) {
            _push(ssrRenderComponent(_component_NuxtLink, {
              to: achievementsLink.value,
              class: "block px-3 py-2",
              style: { color: mainTextColor.value },
              onClick: ($event) => showMiniappMenu.value = false
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(` Достижения `);
                } else {
                  return [
                    createTextVNode(" Достижения ")
                  ];
                }
              }),
              _: 1
            }, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/profile",
            class: "block px-3 py-2",
            style: { color: mainTextColor.value },
            onClick: ($event) => showMiniappMenu.value = false
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Профиль `);
              } else {
                return [
                  createTextVNode(" Профиль ")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (!unref(isMessengerMiniApp)) {
        _push(`<div class="flex items-center gap-2 sm:gap-3" data-v-a04e87da>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/partners",
          class: "hidden rounded-lg px-3 py-2 text-sm font-medium transition sm:inline-flex",
          style: ghostButtonStyle.value
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Партнёрам `);
            } else {
              return [
                createTextVNode(" Партнёрам ")
              ];
            }
          }),
          _: 1
        }, _parent));
        if (unref(user)) {
          _push(`<div class="relative z-[51]" data-v-a04e87da><button type="button" class="flex h-10 w-10 items-center justify-center rounded-full sm:hidden" style="${ssrRenderStyle(iconButtonStyle.value)}" aria-label="Профиль"${ssrRenderAttr("aria-expanded", showUserMenu.value)} data-v-a04e87da><svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" data-v-a04e87da><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 14a4 4 0 10-8 0m8 0v1a3 3 0 01-3 3H11a3 3 0 01-3-3v-1m8 0a4 4 0 01-8 0m8 0a4 4 0 00-8 0M12 11a4 4 0 100-8 4 4 0 000 8z" data-v-a04e87da></path></svg></button><button type="button" class="hidden items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium sm:flex" style="${ssrRenderStyle(ghostButtonStyle.value)}"${ssrRenderAttr("aria-expanded", showUserMenu.value)} data-v-a04e87da><span data-v-a04e87da>Профиль</span><svg class="h-3 w-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" data-v-a04e87da><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" data-v-a04e87da></path></svg></button>`);
          if (showUserMenu.value) {
            _push(`<div class="absolute right-0 mt-2 w-48 rounded-lg py-1 text-sm shadow-lg dropdown-panel" style="${ssrRenderStyle(menuStyle.value)}" data-v-a04e87da>`);
            _push(ssrRenderComponent(_component_NuxtLink, {
              to: ordersLink.value,
              class: "block px-3 py-2",
              style: { color: mainTextColor.value },
              onClick: ($event) => showUserMenu.value = false
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(` История заказов `);
                } else {
                  return [
                    createTextVNode(" История заказов ")
                  ];
                }
              }),
              _: 1
            }, _parent));
            if (bonusesMenuVisible.value) {
              _push(ssrRenderComponent(_component_NuxtLink, {
                to: bonusesLink.value,
                class: "block px-3 py-2",
                style: { color: mainTextColor.value },
                onClick: ($event) => showUserMenu.value = false
              }, {
                default: withCtx((_, _push2, _parent2, _scopeId) => {
                  if (_push2) {
                    _push2(` Бонусы `);
                  } else {
                    return [
                      createTextVNode(" Бонусы ")
                    ];
                  }
                }),
                _: 1
              }, _parent));
            } else {
              _push(`<!---->`);
            }
            if (achievementsMenuVisible.value) {
              _push(ssrRenderComponent(_component_NuxtLink, {
                to: achievementsLink.value,
                class: "block px-3 py-2",
                style: { color: mainTextColor.value },
                onClick: ($event) => showUserMenu.value = false
              }, {
                default: withCtx((_, _push2, _parent2, _scopeId) => {
                  if (_push2) {
                    _push2(` Достижения `);
                  } else {
                    return [
                      createTextVNode(" Достижения ")
                    ];
                  }
                }),
                _: 1
              }, _parent));
            } else {
              _push(`<!---->`);
            }
            _push(ssrRenderComponent(_component_NuxtLink, {
              to: "/profile",
              class: "block px-3 py-2",
              style: { color: mainTextColor.value },
              onClick: ($event) => showUserMenu.value = false
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(` Профиль `);
                } else {
                  return [
                    createTextVNode(" Профиль ")
                  ];
                }
              }),
              _: 1
            }, _parent));
            _push(`<button type="button" class="block w-full px-3 py-2 text-left text-red-600 hover:bg-red-50" data-v-a04e87da> Выйти </button></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else if (telegramBotUrl.value || maxBotUrl.value || vkAuthEnabled.value) {
          _push(`<button type="button" class="rounded-full border border-primary px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary-50 active:bg-primary-100 sm:rounded-lg" data-v-a04e87da><span class="sm:hidden" data-v-a04e87da>Войти</span><span class="hidden sm:inline" data-v-a04e87da>Войти</span></button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      _push(ssrRenderComponent(_component_AuthChannelModal, {
        modelValue: showAuthModal.value,
        "onUpdate:modelValue": ($event) => showAuthModal.value = $event,
        title: "Выберите способ входа",
        description: "Доступна авторизация через Telegram, MAX или VK ID.",
        channels: headerAuthChannels.value,
        intent: "login",
        variant: "dark",
        "consent-href": unref(consentPath),
        onSubmit: onAuthChannelSubmit
      }, null, _parent));
      _push(`</header>`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AppHeader.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const __nuxt_component_0$1 = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-a04e87da"]]);
const layouts = {
  city: defineAsyncComponent(() => import('./city-BJh2AbcE.mjs').then((m) => m.default || m)),
  dashboard: defineAsyncComponent(() => import('./dashboard-Bl0gd6bn.mjs').then((m) => m.default || m))
};
const routeRulesMatcher = _routeRulesMatcher;
const LayoutLoader = defineComponent({
  name: "LayoutLoader",
  inheritAttrs: false,
  props: {
    name: String,
    layoutProps: Object
  },
  setup(props, context) {
    return () => h(layouts[props.name], props.layoutProps, context.slots);
  }
});
const nuxtLayoutProps = {
  name: {
    type: [String, Boolean, Object],
    default: null
  },
  fallback: {
    type: [String, Object],
    default: null
  }
};
const __nuxt_component_1 = defineComponent({
  name: "NuxtLayout",
  inheritAttrs: false,
  props: nuxtLayoutProps,
  setup(props, context) {
    const nuxtApp = useNuxtApp();
    const injectedRoute = inject(PageRouteSymbol);
    const shouldUseEagerRoute = !injectedRoute || injectedRoute === useRoute();
    const route = shouldUseEagerRoute ? useRoute$1() : injectedRoute;
    const layout = computed(() => {
      let layout2 = unref(props.name) ?? route?.meta.layout ?? routeRulesMatcher(route?.path).appLayout ?? "default";
      if (layout2 && !(layout2 in layouts)) {
        if (props.fallback) {
          layout2 = unref(props.fallback);
        }
      }
      return layout2;
    });
    const layoutRef = shallowRef();
    context.expose({ layoutRef });
    const done = nuxtApp.deferHydration();
    let lastLayout;
    return () => {
      const hasLayout = !!layout.value && layout.value in layouts;
      const hasTransition = hasLayout && !!(route?.meta.layoutTransition ?? appLayoutTransition);
      const transitionProps = hasTransition && _mergeTransitionProps([
        route?.meta.layoutTransition,
        appLayoutTransition,
        {
          onBeforeLeave() {
            nuxtApp["~transitionPromise"] = new Promise((resolve) => {
              nuxtApp["~transitionFinish"] = resolve;
            });
          },
          onAfterLeave() {
            nuxtApp["~transitionFinish"]?.();
            delete nuxtApp["~transitionFinish"];
            delete nuxtApp["~transitionPromise"];
          }
        }
      ]);
      const previouslyRenderedLayout = lastLayout;
      lastLayout = layout.value;
      return _wrapInTransition(transitionProps, {
        default: () => h(
          Suspense,
          {
            suspensible: true,
            onResolve: async () => {
              await nextTick(done);
            }
          },
          {
            default: () => h(
              LayoutProvider,
              {
                layoutProps: mergeProps(context.attrs, route.meta.layoutProps ?? {}, { ref: layoutRef }),
                key: layout.value || void 0,
                name: layout.value,
                shouldProvide: !props.name,
                isRenderingNewLayout: (name) => {
                  return name !== previouslyRenderedLayout && name === layout.value;
                },
                hasTransition
              },
              context.slots
            )
          }
        )
      }).default();
    };
  }
});
const LayoutProvider = defineComponent({
  name: "NuxtLayoutProvider",
  inheritAttrs: false,
  props: {
    name: {
      type: [String, Boolean]
    },
    layoutProps: {
      type: Object
    },
    hasTransition: {
      type: Boolean
    },
    shouldProvide: {
      type: Boolean
    },
    isRenderingNewLayout: {
      type: Function,
      required: true
    }
  },
  setup(props, context) {
    const name = props.name;
    if (props.shouldProvide) {
      provide(LayoutMetaSymbol, {
        // When name=false, always return true so NuxtPage doesn't skip rendering
        isCurrent: (route) => name === false || name === (route.meta.layout ?? routeRulesMatcher(route.path).appLayout ?? "default")
      });
    }
    const injectedRoute = inject(PageRouteSymbol);
    const isNotWithinNuxtPage = injectedRoute && injectedRoute === useRoute();
    if (isNotWithinNuxtPage) {
      const vueRouterRoute = useRoute$1();
      const reactiveChildRoute = {};
      for (const _key in vueRouterRoute) {
        const key = _key;
        Object.defineProperty(reactiveChildRoute, key, {
          enumerable: true,
          get: () => {
            return props.isRenderingNewLayout(props.name) ? vueRouterRoute[key] : injectedRoute[key];
          }
        });
      }
      provide(PageRouteSymbol, shallowReactive(reactiveChildRoute));
    }
    return () => {
      if (!name || typeof name === "string" && !(name in layouts)) {
        return context.slots.default?.();
      }
      return h(
        LayoutLoader,
        { key: name, layoutProps: props.layoutProps, name },
        context.slots
      );
    };
  }
});
const defineRouteProvider = (name = "RouteProvider") => defineComponent({
  name,
  props: {
    route: {
      type: Object,
      required: true
    },
    vnode: Object,
    vnodeRef: Object,
    renderKey: String,
    trackRootNodes: Boolean
  },
  setup(props) {
    const previousKey = props.renderKey;
    const previousRoute = props.route;
    const route = {};
    for (const key in props.route) {
      Object.defineProperty(route, key, {
        get: () => previousKey === props.renderKey ? props.route[key] : previousRoute[key],
        enumerable: true
      });
    }
    provide(PageRouteSymbol, shallowReactive(route));
    return () => {
      if (!props.vnode) {
        return props.vnode;
      }
      return h(props.vnode, { ref: props.vnodeRef });
    };
  }
});
const RouteProvider = defineRouteProvider();
const __nuxt_component_0 = defineComponent({
  name: "NuxtPage",
  inheritAttrs: false,
  props: {
    name: {
      type: String
    },
    transition: {
      type: [Boolean, Object],
      default: void 0
    },
    keepalive: {
      type: [Boolean, Object],
      default: void 0
    },
    route: {
      type: Object
    },
    pageKey: {
      type: [Function, String],
      default: null
    }
  },
  setup(props, { attrs, slots, expose }) {
    const nuxtApp = useNuxtApp();
    const pageRef = ref();
    inject(PageRouteSymbol, null);
    expose({ pageRef });
    inject(LayoutMetaSymbol, null);
    nuxtApp.deferHydration();
    return () => {
      return h(RouterView, { name: props.name, route: props.route, ...attrs }, {
        default: (routeProps) => {
          return h(Suspense, { suspensible: true }, {
            default() {
              return h(RouteProvider, {
                vnode: slots.default ? normalizeSlot(slots.default, routeProps) : routeProps.Component,
                route: routeProps.route,
                vnodeRef: pageRef
              });
            }
          });
        }
      });
    };
  }
});
function normalizeSlot(slot, data) {
  const slotContent = slot(data);
  return slotContent.length === 1 ? h(slotContent[0]) : h(Fragment, void 0, slotContent);
}
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "CookieBanner",
  __ssrInlineRender: true,
  props: {
    privacyPath: {},
    cookiesPath: {}
  },
  setup(__props) {
    ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_0$3;
      _push(ssrRenderComponent(_component_ClientOnly, _attrs, {}, _parent));
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/legal/CookieBanner.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "app",
  __ssrInlineRender: true,
  setup(__props) {
    const { isMessengerMiniApp } = useTelegram();
    const { cssVars, loadTenantSettings } = useTenant();
    const route = useRoute$1();
    const config = /* @__PURE__ */ useRuntimeConfig();
    const rootStyle = computed(() => cssVars.value);
    const defaultCitySlug = computed(() => {
      const raw = config.public.defaultCitySlug;
      return typeof raw === "string" && raw.trim() ? raw.trim() : "ulan-ude";
    });
    const isCityInuuRoute = computed(() => {
      typeof route.path === "string" ? route.path : "";
      const citySlug = route.params?.city_slug;
      const hasCitySlug = Array.isArray(citySlug) ? citySlug.length > 0 : typeof citySlug === "string" && citySlug.length > 0;
      if (!hasCitySlug) return false;
      const tenantSlug = route.params?.tenant_slug;
      const hasTenantSlug = Array.isArray(tenantSlug) ? tenantSlug.length > 0 : typeof tenantSlug === "string" && tenantSlug.length > 0;
      return !hasTenantSlug;
    });
    const showLegacyHeader = computed(() => {
      const routePath = typeof route.path === "string" ? route.path : "";
      if (routePath.startsWith("/dashboard") || routePath.startsWith("/platform")) return false;
      if (isCityInuuRoute.value) return false;
      return true;
    });
    const isStorefrontRoute = computed(() => {
      const citySlug = route.params?.city_slug;
      const hasCitySlug = Array.isArray(citySlug) ? citySlug.length > 0 : typeof citySlug === "string" && citySlug.length > 0;
      return hasCitySlug;
    });
    const cityBasePath = computed(() => {
      const citySlug = route.params?.city_slug;
      const city = Array.isArray(citySlug) ? citySlug[0] : citySlug;
      if (typeof city === "string" && city) return `/${city}`;
      return `/${defaultCitySlug.value}`;
    });
    onServerPrefetch(async () => {
      if (!showLegacyHeader.value) return;
      await loadTenantSettings();
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AppHeader = __nuxt_component_0$1;
      const _component_NuxtLayout = __nuxt_component_1;
      const _component_NuxtPage = __nuxt_component_0;
      const _component_LegalCookieBanner = _sfc_main$3;
      const _component_NuxtLink = __nuxt_component_0$2;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "app-root min-h-screen bg-gray-50 text-gray-900",
        style: rootStyle.value
      }, _attrs))}>`);
      if (showLegacyHeader.value) {
        _push(ssrRenderComponent(_component_AppHeader, null, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="${ssrRenderClass(showLegacyHeader.value && !unref(isMessengerMiniApp) ? "pt-16" : "")}">`);
      _push(ssrRenderComponent(_component_NuxtLayout, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_NuxtPage, null, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_NuxtPage)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (isStorefrontRoute.value && cityBasePath.value) {
        _push(ssrRenderComponent(_component_LegalCookieBanner, {
          "privacy-path": `${cityBasePath.value}/legal/privacy`,
          "cookies-path": `${cityBasePath.value}/legal/cookies`
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (isStorefrontRoute.value) {
        _push(`<footer class="mt-12 border-t border-gray-200 bg-white/95"><div class="mx-auto max-w-7xl px-4 py-6 text-xs leading-6 text-gray-600 sm:px-6"><div class="grid gap-4 sm:grid-cols-2"><div><p class="font-medium text-gray-700"> Оператор платформы: ИП Баранзаев Арсалан Баярович </p><p>ИНН: 032384437278</p><p>ОГРНИП: 325030000033105</p></div><div><p class="font-medium text-gray-700">Юридические документы</p><div class="flex flex-wrap gap-x-3 gap-y-1">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `${cityBasePath.value}/legal/privacy`,
          class: "underline decoration-dotted hover:text-gray-900"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Политика конфиденциальности `);
            } else {
              return [
                createTextVNode(" Политика конфиденциальности ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `${cityBasePath.value}/legal/offer`,
          class: "underline decoration-dotted hover:text-gray-900"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Публичная оферта `);
            } else {
              return [
                createTextVNode(" Публичная оферта ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `${cityBasePath.value}/legal/consent`,
          class: "underline decoration-dotted hover:text-gray-900"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Согласие на обработку ПДн `);
            } else {
              return [
                createTextVNode(" Согласие на обработку ПДн ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `${cityBasePath.value}/legal/contacts`,
          class: "underline decoration-dotted hover:text-gray-900"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Реквизиты и контакты `);
            } else {
              return [
                createTextVNode(" Реквизиты и контакты ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `${cityBasePath.value}/legal/cookies`,
          class: "underline decoration-dotted hover:text-gray-900"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Файлы cookie `);
            } else {
              return [
                createTextVNode(" Файлы cookie ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div><p class="mt-2 text-gray-500"> INUU — городской агрегатор событий, мест и сервисов. По записям и билетам — напрямую к организаторам. </p></div></div></div></footer>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("app.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {
  __name: "nuxt-error-page",
  __ssrInlineRender: true,
  props: {
    error: Object
  },
  setup(__props) {
    const props = __props;
    const _error = props.error;
    const status = Number(_error.statusCode || 500);
    const is404 = status === 404;
    const statusText = _error.statusMessage ?? (is404 ? "Page Not Found" : "Internal Server Error");
    const description = _error.message || _error.toString();
    const stack = void 0;
    const _Error404 = defineAsyncComponent(() => import('./error-404-BObn3ewe.mjs'));
    const _Error = defineAsyncComponent(() => import('./error-500-D8EVRZOh.mjs'));
    const ErrorTemplate = is404 ? _Error404 : _Error;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(ErrorTemplate), mergeProps({ status: unref(status), statusText: unref(statusText), statusCode: unref(status), statusMessage: unref(statusText), description: unref(description), stack: unref(stack) }, _attrs), null, _parent));
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-error-page.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "nuxt-root",
  __ssrInlineRender: true,
  setup(__props) {
    const IslandRenderer = () => null;
    const nuxtApp = useNuxtApp();
    nuxtApp.deferHydration();
    nuxtApp.ssrContext.url;
    const SingleRenderer = false;
    provide(PageRouteSymbol, useRoute());
    nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup", []);
    const error = /* @__PURE__ */ useError();
    const abortRender = error.value && !nuxtApp.ssrContext.error;
    function invokeAppErrorHandler(err, target, info) {
      const errorHandler = nuxtApp.vueApp.config.errorHandler;
      if (errorHandler && !errorHandler.__nuxt_default) {
        try {
          errorHandler(err, target, info);
        } catch (handlerError) {
          console.error("[nuxt] Error in `app.config.errorHandler`", handlerError);
        }
      }
    }
    onErrorCaptured((err, target, info) => {
      nuxtApp.hooks.callHook("vue:error", err, target, info).catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
      {
        const p = nuxtApp.runWithContext(() => showError(err));
        onServerPrefetch(() => p);
        invokeAppErrorHandler(err, target, info);
        return false;
      }
    });
    const islandContext = nuxtApp.ssrContext.islandContext;
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderSuspense(_push, {
        default: () => {
          if (unref(abortRender)) {
            _push(`<div></div>`);
          } else if (unref(error)) {
            _push(ssrRenderComponent(unref(_sfc_main$1), { error: unref(error) }, null, _parent));
          } else if (unref(islandContext)) {
            _push(ssrRenderComponent(unref(IslandRenderer), { context: unref(islandContext) }, null, _parent));
          } else if (unref(SingleRenderer)) {
            ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(SingleRenderer)), null, null), _parent);
          } else {
            _push(ssrRenderComponent(unref(_sfc_main$2), null, null, _parent));
          }
        },
        _: 1
      });
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-root.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
let entry;
{
  entry = async function createNuxtAppServer(ssrContext) {
    const vueApp = createApp(_sfc_main);
    const nuxt = createNuxtApp({ vueApp, ssrContext });
    try {
      await applyPlugins(nuxt, plugins);
      await nuxt.hooks.callHook("app:created", vueApp);
    } catch (error) {
      await nuxt.hooks.callHook("app:error", error);
      nuxt.payload.error ||= createError(error);
    }
    if (ssrContext && (ssrContext["~renderResponse"] || ssrContext._renderResponse)) {
      throw new Error("skipping render");
    }
    return vueApp;
  };
}
const entry_default = ((ssrContext) => entry(ssrContext));

export { __nuxt_component_0$2 as _, __nuxt_component_0 as a, __nuxt_component_1$1 as b, _export_sfc as c, asyncDataDefaults as d, entry_default as default, createError as e, fetchDefaults as f, useNuxtApp as g, useRequestFetch as h, useRoute as i, useRouter as j, useRuntimeConfig as k, useState as l, useSupabaseClient as m, navigateTo as n, useSupabaseUser as o, useTelegram as p, useTenant as q, tryUseNuxtApp as t, useLegalPaths as u };
