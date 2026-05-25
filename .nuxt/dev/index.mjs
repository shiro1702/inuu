import process from 'node:process';globalThis._importMeta_={url:import.meta.url,env:process.env};import { tmpdir } from 'node:os';
import { defineEventHandler, handleCacheHeaders, splitCookiesString, createEvent, fetchWithEvent, isEvent, eventHandler, setHeaders, createError, sendRedirect, proxyRequest, getRequestHeader, setResponseHeaders, setResponseStatus, send, getRequestHeaders, setResponseHeader, appendResponseHeader, getRequestURL, getResponseHeader, removeResponseHeader, getHeader, setCookie, getResponseStatus, getQuery as getQuery$1, readBody, createApp, createRouter as createRouter$1, toNodeListener, lazyEventHandler, getRouterParam, getResponseStatusText } from 'file:///Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/h3/dist/index.mjs';
import { Server } from 'node:http';
import { resolve, dirname, join } from 'node:path';
import crypto$1, { randomBytes, randomUUID } from 'node:crypto';
import { parentPort, threadId } from 'node:worker_threads';
import { escapeHtml } from 'file:///Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/@vue/shared/dist/shared.cjs.js';
import viteNodeEntry_mjs from 'file:///Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/@nuxt/vite-builder/dist/vite-node-entry.mjs';
import { viteNodeFetch } from 'file:///Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/@nuxt/vite-builder/dist/vite-node.mjs';
import { createClient } from 'file:///Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/@supabase/supabase-js/dist/index.mjs';
import { createServerClient, parseCookieHeader } from 'file:///Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/@supabase/ssr/dist/main/index.js';
import { createRenderer, getRequestDependencies, getPreloadLinks, getPrefetchLinks } from 'file:///Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/vue-bundle-renderer/dist/runtime.mjs';
import { parseURL, withoutBase, joinURL, getQuery, withQuery, withTrailingSlash, decodePath, withLeadingSlash, withoutTrailingSlash, joinRelativeURL, encodePath } from 'file:///Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/ufo/dist/index.mjs';
import { renderToString } from 'file:///Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/vue/server-renderer/index.mjs';
import destr, { destr as destr$1 } from 'file:///Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/destr/dist/index.mjs';
import { createHooks } from 'file:///Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/hookable/dist/index.mjs';
import { createFetch, Headers as Headers$1 } from 'file:///Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/ofetch/dist/node.mjs';
import { fetchNodeRequestHandler, callNodeRequestHandler } from 'file:///Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/node-mock-http/dist/index.mjs';
import { createStorage, defineDriver, prefixStorage } from 'file:///Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/unstorage/dist/index.mjs';
import unstorage_47drivers_47fs from 'file:///Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/unstorage/drivers/fs.mjs';
import fsDriver from 'file:///Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/unstorage/drivers/fs-lite.mjs';
import lruCache from 'file:///Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/unstorage/drivers/lru-cache.mjs';
import { digest, hash as hash$1 } from 'file:///Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/ohash/dist/index.mjs';
import { klona } from 'file:///Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/klona/dist/index.mjs';
import defu, { defuFn } from 'file:///Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/defu/dist/defu.mjs';
import { snakeCase } from 'file:///Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/scule/dist/index.mjs';
import { getContext } from 'file:///Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/unctx/dist/index.mjs';
import { toRouteMatcher, createRouter } from 'file:///Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/radix3/dist/index.mjs';
import { readFile } from 'node:fs/promises';
import consola, { consola as consola$1 } from 'file:///Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/consola/dist/index.mjs';
import { ErrorParser } from 'file:///Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/youch-core/build/index.js';
import { Youch } from 'file:///Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/youch/build/index.js';
import { SourceMapConsumer } from 'file:///Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/source-map/source-map.js';
import { AsyncLocalStorage } from 'node:async_hooks';
import { stringify, uneval } from 'file:///Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/devalue/index.js';
import { captureRawStackTrace, parseRawStackTrace } from 'file:///Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/errx/dist/index.js';
import { isVNode, isRef, toValue } from 'file:///Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/vue/index.mjs';
import { WebSocket } from 'file:///Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/ws/wrapper.mjs';
import _wH6JrtIxmaSoA8lCPWFnE9z4lQeXW6H5z3l5aymEQw from 'file:///Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/@nuxt/vite-builder/dist/fix-stacktrace.mjs';
import { promises } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname as dirname$1, resolve as resolve$1 } from 'file:///Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/pathe/dist/index.mjs';
import { createHead as createHead$1, propsToString, renderSSRHead } from 'file:///Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/unhead/dist/server.mjs';
import { DeprecationsPlugin, PromisesPlugin, TemplateParamsPlugin, AliasSortingPlugin } from 'file:///Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/unhead/dist/plugins.mjs';
import { walkResolver } from 'file:///Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/unhead/dist/utils.mjs';

const serverAssets = [{"baseName":"server","dir":"/Users/arsalanbaranzaev/Desktop/projects/incity-new/server/assets"}];

const assets$1 = createStorage();

for (const asset of serverAssets) {
  assets$1.mount(asset.baseName, unstorage_47drivers_47fs({ base: asset.dir, ignore: (asset?.ignore || []) }));
}

// @ts-check


/**
 * @param {string} item
 */
function normalizeFsKey (item) {
  const safe = item.replace(/[^\w.-]/g, '_');
  const prefix = safe.slice(0, 20);
  const hash = crypto$1.createHash('sha256').update(item).digest('hex');
  return `${prefix}-${hash}`
}

const _47Users_47arsalanbaranzaev_47Desktop_47projects_47incity_45new_47node_modules_47_64nuxt_47nitro_45server_47dist_47runtime_47utils_47cache_45driver_46js = defineDriver(
  /**
   * @param {{ base?: string }} opts
   */
  (opts) => {
    const fs = fsDriver({ base: opts.base });
    const lru = lruCache({ max: 1000 });

    return {
      ...fs, // fall back to file system - only the bottom three methods are used in renderer
      async setItem (key, value, opts) {
        await Promise.all([
          fs.setItem?.(normalizeFsKey(key), value, opts),
          lru.setItem?.(key, value, opts),
        ]);
      },
      async hasItem (key, opts) {
        return await lru.hasItem(key, opts) || await fs.hasItem(normalizeFsKey(key), opts)
      },
      async getItem (key, opts) {
        return await lru.getItem(key, opts) || await fs.getItem(normalizeFsKey(key), opts)
      },
    }
  },
);

const storage = createStorage({});

storage.mount('/assets', assets$1);

storage.mount('root', unstorage_47drivers_47fs({"driver":"fs","readOnly":true,"base":"/Users/arsalanbaranzaev/Desktop/projects/incity-new","watchOptions":{"ignored":[null]}}));
storage.mount('src', unstorage_47drivers_47fs({"driver":"fs","readOnly":true,"base":"/Users/arsalanbaranzaev/Desktop/projects/incity-new/server","watchOptions":{"ignored":[null]}}));
storage.mount('cache:nuxt:payload', _47Users_47arsalanbaranzaev_47Desktop_47projects_47incity_45new_47node_modules_47_64nuxt_47nitro_45server_47dist_47runtime_47utils_47cache_45driver_46js({"driver":"/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/@nuxt/nitro-server/dist/runtime/utils/cache-driver.js","base":"/Users/arsalanbaranzaev/Desktop/projects/incity-new/.nuxt/cache/nuxt/payload"}));
storage.mount('build', unstorage_47drivers_47fs({"driver":"fs","readOnly":false,"base":"/Users/arsalanbaranzaev/Desktop/projects/incity-new/.nuxt"}));
storage.mount('cache', unstorage_47drivers_47fs({"driver":"fs","readOnly":false,"base":"/Users/arsalanbaranzaev/Desktop/projects/incity-new/.nuxt/cache"}));
storage.mount('data', unstorage_47drivers_47fs({"driver":"fs","base":"/Users/arsalanbaranzaev/Desktop/projects/incity-new/.data/kv"}));

function useStorage(base = "") {
  return base ? prefixStorage(storage, base) : storage;
}

const Hasher = /* @__PURE__ */ (() => {
  class Hasher2 {
    buff = "";
    #context = /* @__PURE__ */ new Map();
    write(str) {
      this.buff += str;
    }
    dispatch(value) {
      const type = value === null ? "null" : typeof value;
      return this[type](value);
    }
    object(object) {
      if (object && typeof object.toJSON === "function") {
        return this.object(object.toJSON());
      }
      const objString = Object.prototype.toString.call(object);
      let objType = "";
      const objectLength = objString.length;
      objType = objectLength < 10 ? "unknown:[" + objString + "]" : objString.slice(8, objectLength - 1);
      objType = objType.toLowerCase();
      let objectNumber = null;
      if ((objectNumber = this.#context.get(object)) === void 0) {
        this.#context.set(object, this.#context.size);
      } else {
        return this.dispatch("[CIRCULAR:" + objectNumber + "]");
      }
      if (typeof Buffer !== "undefined" && Buffer.isBuffer && Buffer.isBuffer(object)) {
        this.write("buffer:");
        return this.write(object.toString("utf8"));
      }
      if (objType !== "object" && objType !== "function" && objType !== "asyncfunction") {
        if (this[objType]) {
          this[objType](object);
        } else {
          this.unknown(object, objType);
        }
      } else {
        const keys = Object.keys(object).sort();
        const extraKeys = [];
        this.write("object:" + (keys.length + extraKeys.length) + ":");
        const dispatchForKey = (key) => {
          this.dispatch(key);
          this.write(":");
          this.dispatch(object[key]);
          this.write(",");
        };
        for (const key of keys) {
          dispatchForKey(key);
        }
        for (const key of extraKeys) {
          dispatchForKey(key);
        }
      }
    }
    array(arr, unordered) {
      unordered = unordered === void 0 ? false : unordered;
      this.write("array:" + arr.length + ":");
      if (!unordered || arr.length <= 1) {
        for (const entry of arr) {
          this.dispatch(entry);
        }
        return;
      }
      const contextAdditions = /* @__PURE__ */ new Map();
      const entries = arr.map((entry) => {
        const hasher = new Hasher2();
        hasher.dispatch(entry);
        for (const [key, value] of hasher.#context) {
          contextAdditions.set(key, value);
        }
        return hasher.toString();
      });
      this.#context = contextAdditions;
      entries.sort();
      return this.array(entries, false);
    }
    date(date) {
      return this.write("date:" + date.toJSON());
    }
    symbol(sym) {
      return this.write("symbol:" + sym.toString());
    }
    unknown(value, type) {
      this.write(type);
      if (!value) {
        return;
      }
      this.write(":");
      if (value && typeof value.entries === "function") {
        return this.array(
          [...value.entries()],
          true
          /* ordered */
        );
      }
    }
    error(err) {
      return this.write("error:" + err.toString());
    }
    boolean(bool) {
      return this.write("bool:" + bool);
    }
    string(string) {
      this.write("string:" + string.length + ":");
      this.write(string);
    }
    function(fn) {
      this.write("fn:");
      if (isNativeFunction(fn)) {
        this.dispatch("[native]");
      } else {
        this.dispatch(fn.toString());
      }
    }
    number(number) {
      return this.write("number:" + number);
    }
    null() {
      return this.write("Null");
    }
    undefined() {
      return this.write("Undefined");
    }
    regexp(regex) {
      return this.write("regex:" + regex.toString());
    }
    arraybuffer(arr) {
      this.write("arraybuffer:");
      return this.dispatch(new Uint8Array(arr));
    }
    url(url) {
      return this.write("url:" + url.toString());
    }
    map(map) {
      this.write("map:");
      const arr = [...map];
      return this.array(arr, false);
    }
    set(set) {
      this.write("set:");
      const arr = [...set];
      return this.array(arr, false);
    }
    bigint(number) {
      return this.write("bigint:" + number.toString());
    }
  }
  for (const type of [
    "uint8array",
    "uint8clampedarray",
    "unt8array",
    "uint16array",
    "unt16array",
    "uint32array",
    "unt32array",
    "float32array",
    "float64array"
  ]) {
    Hasher2.prototype[type] = function(arr) {
      this.write(type + ":");
      return this.array([...arr], false);
    };
  }
  function isNativeFunction(f) {
    if (typeof f !== "function") {
      return false;
    }
    return Function.prototype.toString.call(f).slice(
      -15
      /* "[native code] }".length */
    ) === "[native code] }";
  }
  return Hasher2;
})();
function serialize(object) {
  const hasher = new Hasher();
  hasher.dispatch(object);
  return hasher.buff;
}
function hash(value) {
  return digest(typeof value === "string" ? value : serialize(value)).replace(/[-_]/g, "").slice(0, 10);
}

function defaultCacheOptions() {
  return {
    name: "_",
    base: "/cache",
    swr: true,
    maxAge: 1
  };
}
function defineCachedFunction(fn, opts = {}) {
  opts = { ...defaultCacheOptions(), ...opts };
  const pending = {};
  const group = opts.group || "nitro/functions";
  const name = opts.name || fn.name || "_";
  const integrity = opts.integrity || hash([fn, opts]);
  const validate = opts.validate || ((entry) => entry.value !== void 0);
  async function get(key, resolver, shouldInvalidateCache, event) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    let entry = await useStorage().getItem(cacheKey).catch((error) => {
      console.error(`[cache] Cache read error.`, error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }) || {};
    if (typeof entry !== "object") {
      entry = {};
      const error = new Error("Malformed data read from cache.");
      console.error("[cache]", error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }
    const ttl = (opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = shouldInvalidateCache || entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl || validate(entry) === false;
    const _resolve = async () => {
      const isPending = pending[key];
      if (!isPending) {
        if (entry.value !== void 0 && (opts.staleMaxAge || 0) >= 0 && opts.swr === false) {
          entry.value = void 0;
          entry.integrity = void 0;
          entry.mtime = void 0;
          entry.expires = void 0;
        }
        pending[key] = Promise.resolve(resolver());
      }
      try {
        entry.value = await pending[key];
      } catch (error) {
        if (!isPending) {
          delete pending[key];
        }
        throw error;
      }
      if (!isPending) {
        entry.mtime = Date.now();
        entry.integrity = integrity;
        delete pending[key];
        if (validate(entry) !== false) {
          let setOpts;
          if (opts.maxAge && !opts.swr) {
            setOpts = { ttl: opts.maxAge };
          }
          const promise = useStorage().setItem(cacheKey, entry, setOpts).catch((error) => {
            console.error(`[cache] Cache write error.`, error);
            useNitroApp().captureError(error, { event, tags: ["cache"] });
          });
          if (event?.waitUntil) {
            event.waitUntil(promise);
          }
        }
      }
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (entry.value === void 0) {
      await _resolvePromise;
    } else if (expired && event && event.waitUntil) {
      event.waitUntil(_resolvePromise);
    }
    if (opts.swr && validate(entry) !== false) {
      _resolvePromise.catch((error) => {
        console.error(`[cache] SWR handler error.`, error);
        useNitroApp().captureError(error, { event, tags: ["cache"] });
      });
      return entry;
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const shouldBypassCache = await opts.shouldBypassCache?.(...args);
    if (shouldBypassCache) {
      return fn(...args);
    }
    const key = await (opts.getKey || getKey)(...args);
    const shouldInvalidateCache = await opts.shouldInvalidateCache?.(...args);
    const entry = await get(
      key,
      () => fn(...args),
      shouldInvalidateCache,
      args[0] && isEvent(args[0]) ? args[0] : void 0
    );
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
function cachedFunction(fn, opts = {}) {
  return defineCachedFunction(fn, opts);
}
function getKey(...args) {
  return args.length > 0 ? hash(args) : "";
}
function escapeKey(key) {
  return String(key).replace(/\W/g, "");
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions()) {
  const variableHeaderNames = (opts.varies || []).filter(Boolean).map((h) => h.toLowerCase()).sort();
  const _opts = {
    ...opts,
    getKey: async (event) => {
      const customKey = await opts.getKey?.(event);
      if (customKey) {
        return escapeKey(customKey);
      }
      const _path = event.node.req.originalUrl || event.node.req.url || event.path;
      let _pathname;
      try {
        _pathname = escapeKey(decodeURI(parseURL(_path).pathname)).slice(0, 16) || "index";
      } catch {
        _pathname = "-";
      }
      const _hashedPath = `${_pathname}.${hash(_path)}`;
      const _headers = variableHeaderNames.map((header) => [header, event.node.req.headers[header]]).map(([name, value]) => `${escapeKey(name)}.${hash(value)}`);
      return [_hashedPath, ..._headers].join(":");
    },
    validate: (entry) => {
      if (!entry.value) {
        return false;
      }
      if (entry.value.code >= 400) {
        return false;
      }
      if (entry.value.body === void 0) {
        return false;
      }
      if (entry.value.headers.etag === "undefined" || entry.value.headers["last-modified"] === "undefined") {
        return false;
      }
      return true;
    },
    group: opts.group || "nitro/handlers",
    integrity: opts.integrity || hash([handler, opts])
  };
  const _cachedHandler = cachedFunction(
    async (incomingEvent) => {
      const variableHeaders = {};
      for (const header of variableHeaderNames) {
        const value = incomingEvent.node.req.headers[header];
        if (value !== void 0) {
          variableHeaders[header] = value;
        }
      }
      const reqProxy = cloneWithProxy(incomingEvent.node.req, {
        headers: variableHeaders
      });
      const resHeaders = {};
      let _resSendBody;
      const resProxy = cloneWithProxy(incomingEvent.node.res, {
        statusCode: 200,
        writableEnded: false,
        writableFinished: false,
        headersSent: false,
        closed: false,
        getHeader(name) {
          return resHeaders[name];
        },
        setHeader(name, value) {
          resHeaders[name] = value;
          return this;
        },
        getHeaderNames() {
          return Object.keys(resHeaders);
        },
        hasHeader(name) {
          return name in resHeaders;
        },
        removeHeader(name) {
          delete resHeaders[name];
        },
        getHeaders() {
          return resHeaders;
        },
        end(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        write(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2(void 0);
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return true;
        },
        writeHead(statusCode, headers2) {
          this.statusCode = statusCode;
          if (headers2) {
            if (Array.isArray(headers2) || typeof headers2 === "string") {
              throw new TypeError("Raw headers  is not supported.");
            }
            for (const header in headers2) {
              const value = headers2[header];
              if (value !== void 0) {
                this.setHeader(
                  header,
                  value
                );
              }
            }
          }
          return this;
        }
      });
      const event = createEvent(reqProxy, resProxy);
      event.fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: useNitroApp().localFetch
      });
      event.$fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: globalThis.$fetch
      });
      event.waitUntil = incomingEvent.waitUntil;
      event.context = incomingEvent.context;
      event.context.cache = {
        options: _opts
      };
      const body = await handler(event) || _resSendBody;
      const headers = event.node.res.getHeaders();
      headers.etag = String(
        headers.Etag || headers.etag || `W/"${hash(body)}"`
      );
      headers["last-modified"] = String(
        headers["Last-Modified"] || headers["last-modified"] || (/* @__PURE__ */ new Date()).toUTCString()
      );
      const cacheControl = [];
      if (opts.swr) {
        if (opts.maxAge) {
          cacheControl.push(`s-maxage=${opts.maxAge}`);
        }
        if (opts.staleMaxAge) {
          cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
        } else {
          cacheControl.push("stale-while-revalidate");
        }
      } else if (opts.maxAge) {
        cacheControl.push(`max-age=${opts.maxAge}`);
      }
      if (cacheControl.length > 0) {
        headers["cache-control"] = cacheControl.join(", ");
      }
      const cacheEntry = {
        code: event.node.res.statusCode,
        headers,
        body
      };
      return cacheEntry;
    },
    _opts
  );
  return defineEventHandler(async (event) => {
    if (opts.headersOnly) {
      if (handleCacheHeaders(event, { maxAge: opts.maxAge })) {
        return;
      }
      return handler(event);
    }
    const response = await _cachedHandler(
      event
    );
    if (event.node.res.headersSent || event.node.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["last-modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.node.res.statusCode = response.code;
    for (const name in response.headers) {
      const value = response.headers[name];
      if (name === "set-cookie") {
        event.node.res.appendHeader(
          name,
          splitCookiesString(value)
        );
      } else {
        if (value !== void 0) {
          event.node.res.setHeader(name, value);
        }
      }
    }
    return response.body;
  });
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property];
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}
const cachedEventHandler = defineCachedEventHandler;

const inlineAppConfig = {
  "nuxt": {}
};



const appConfig = defuFn(inlineAppConfig);

function getEnv(key, opts) {
  const envKey = snakeCase(key).toUpperCase();
  return destr(
    process.env[opts.prefix + envKey] ?? process.env[opts.altPrefix + envKey]
  );
}
function _isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function applyEnv(obj, opts, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = getEnv(subKey, opts);
    if (_isObject(obj[key])) {
      if (_isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
        applyEnv(obj[key], opts, subKey);
      } else if (envValue === void 0) {
        applyEnv(obj[key], opts, subKey);
      } else {
        obj[key] = envValue ?? obj[key];
      }
    } else {
      obj[key] = envValue ?? obj[key];
    }
    if (opts.envExpansion && typeof obj[key] === "string") {
      obj[key] = _expandFromEnv(obj[key]);
    }
  }
  return obj;
}
const envExpandRx = /\{\{([^{}]*)\}\}/g;
function _expandFromEnv(value) {
  return value.replace(envExpandRx, (match, key) => {
    return process.env[key] || match;
  });
}

const _inlineRuntimeConfig = {
  "app": {
    "baseURL": "/",
    "buildId": "dev",
    "buildAssetsDir": "/_nuxt/",
    "cdnURL": ""
  },
  "nitro": {
    "envPrefix": "NUXT_",
    "routeRules": {
      "/__nuxt_error": {
        "cache": false
      },
      "/_nuxt/builds/meta/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        }
      },
      "/_nuxt/builds/**": {
        "headers": {
          "cache-control": "public, max-age=1, immutable"
        }
      }
    }
  },
  "public": {
    "brandName": "INUU",
    "platformBaseDomain": "",
    "defaultCitySlug": "ulan-ude",
    "yandexMapsApiKey": "",
    "telegramBotName": "inuu_test_bot",
    "maxBotUrl": "https://max.ru/id032384437278_bot",
    "pickupPointsJson": "",
    "dadataToken": "2ab5540f650bc2b75a057694ceab7ddc2d6029d1",
    "supabaseUrl": "https://nyvdgwxkzgshxlopkkoe.supabase.co",
    "supabaseKey": "sb_publishable_4AqzqnY6kMBzJz0dDA5niA_2EzfbX46",
    "vkIdClientId": "54573868",
    "supabase": {
      "url": "https://nyvdgwxkzgshxlopkkoe.supabase.co",
      "key": "sb_publishable_4AqzqnY6kMBzJz0dDA5niA_2EzfbX46",
      "redirect": false,
      "redirectOptions": {
        "login": "/login",
        "callback": "/confirm",
        "exclude": [],
        "cookieRedirect": false,
        "saveRedirectToCookie": false
      },
      "cookieName": "sb",
      "cookiePrefix": "sb-nyvdgwxkzgshxlopkkoe-auth-token",
      "useSsrCookies": true,
      "cookieOptions": {
        "maxAge": 28800,
        "sameSite": "lax",
        "secure": true
      },
      "clientOptions": {}
    }
  },
  "botToken": "8844377451:AAH7JBRHPYDPyRH31YUj2yC9H64AdFeiO-E",
  "managerChatId": "256715254",
  "appUrl": "https://tele-shop-sigma.vercel.app/",
  "sessionSecret": "",
  "yandexMapsApiKey": "",
  "yandexGeocoderApiKey": "02d6c122-1652-4f82-8158-e32536ee62e3",
  "maxApiBaseUrl": "https://platform-api.max.ru/",
  "maxApiToken": "f9LHodD0cOKBCnRdm5Im6otKqO-defMAmuANhXwoDRCJX6JeUjVnsgev38ufRKqHPcx85WwGw-c7OyIRhnf_",
  "maxMiniAppBotToken": "",
  "maxWebhookSecret": "",
  "telegramTransport": "direct",
  "telegramRelayUrl": "",
  "relaySharedSecret": "",
  "reviewPromptDelayMinutes": 45,
  "cronReviewPromptsSecret": "",
  "vkIdClientSecret": "5rVoF5Kxv6uetsrLLGk3",
  "vkIdRedirectUri": "https://tele-shop-sigma.vercel.app/api/auth/vk-id/callback",
  "vkIdBaseUrl": "https://id.vk.com",
  "supabaseUrl": "https://nyvdgwxkzgshxlopkkoe.supabase.co",
  "supabaseServiceKey": "sb_secret_6_QzhLTO3kUdLII0zBYzFg_5ax-hfFS",
  "supabase": {
    "serviceKey": "sb_secret_6_QzhLTO3kUdLII0zBYzFg_5ax-hfFS",
    "secretKey": "sb_secret_6_QzhLTO3kUdLII0zBYzFg_5ax-hfFS"
  }
};
const envOptions = {
  prefix: "NITRO_",
  altPrefix: _inlineRuntimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_",
  envExpansion: _inlineRuntimeConfig.nitro.envExpansion ?? process.env.NITRO_ENV_EXPANSION ?? false
};
const _sharedRuntimeConfig = _deepFreeze(
  applyEnv(klona(_inlineRuntimeConfig), envOptions)
);
function useRuntimeConfig(event) {
  if (!event) {
    return _sharedRuntimeConfig;
  }
  if (event.context.nitro.runtimeConfig) {
    return event.context.nitro.runtimeConfig;
  }
  const runtimeConfig = klona(_inlineRuntimeConfig);
  applyEnv(runtimeConfig, envOptions);
  event.context.nitro.runtimeConfig = runtimeConfig;
  return runtimeConfig;
}
_deepFreeze(klona(appConfig));
function _deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      _deepFreeze(value);
    }
  }
  return Object.freeze(object);
}
new Proxy(/* @__PURE__ */ Object.create(null), {
  get: (_, prop) => {
    console.warn(
      "Please use `useRuntimeConfig()` instead of accessing config directly."
    );
    const runtimeConfig = useRuntimeConfig();
    if (prop in runtimeConfig) {
      return runtimeConfig[prop];
    }
    return void 0;
  }
});

getContext("nitro-app", {
  asyncContext: false,
  AsyncLocalStorage: void 0
});

function isPathInScope(pathname, base) {
  let canonical;
  try {
    const pre = pathname.replace(/%2f/gi, "/").replace(/%5c/gi, "\\");
    canonical = new URL(pre, "http://_").pathname;
  } catch {
    return false;
  }
  return !base || canonical === base || canonical.startsWith(base + "/");
}

const config = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(
  createRouter({ routes: config.nitro.routeRules })
);
function createRouteRulesHandler(ctx) {
  return eventHandler((event) => {
    const routeRules = getRouteRules(event);
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers);
    }
    if (routeRules.redirect) {
      let target = routeRules.redirect.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.redirect._redirectStripBase;
        if (strpBase) {
          if (!isPathInScope(event.path.split("?")[0], strpBase)) {
            throw createError({ statusCode: 400 });
          }
          targetPath = withoutBase(targetPath, strpBase);
        } else if (targetPath.startsWith("//")) {
          targetPath = targetPath.replace(/^\/+/, "/");
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return sendRedirect(event, target, routeRules.redirect.statusCode);
    }
    if (routeRules.proxy) {
      let target = routeRules.proxy.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.proxy._proxyStripBase;
        if (strpBase) {
          if (!isPathInScope(event.path.split("?")[0], strpBase)) {
            throw createError({ statusCode: 400 });
          }
          targetPath = withoutBase(targetPath, strpBase);
        } else if (targetPath.startsWith("//")) {
          targetPath = targetPath.replace(/^\/+/, "/");
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return proxyRequest(event, target, {
        fetch: ctx.localFetch,
        ...routeRules.proxy
      });
    }
  });
}
function getRouteRules(event) {
  event.context._nitro = event.context._nitro || {};
  if (!event.context._nitro.routeRules) {
    event.context._nitro.routeRules = getRouteRulesForPath(
      withoutBase(event.path.split("?")[0], useRuntimeConfig().app.baseURL)
    );
  }
  return event.context._nitro.routeRules;
}
function getRouteRulesForPath(path) {
  return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
}

function _captureError(error, type) {
  console.error(`[${type}]`, error);
  useNitroApp().captureError(error, { tags: [type] });
}
function trapUnhandledNodeErrors() {
  process.on(
    "unhandledRejection",
    (error) => _captureError(error, "unhandledRejection")
  );
  process.on(
    "uncaughtException",
    (error) => _captureError(error, "uncaughtException")
  );
}
function joinHeaders(value) {
  return Array.isArray(value) ? value.join(", ") : String(value);
}
function normalizeFetchResponse(response) {
  if (!response.headers.has("set-cookie")) {
    return response;
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: normalizeCookieHeaders(response.headers)
  });
}
function normalizeCookieHeader(header = "") {
  return splitCookiesString(joinHeaders(header));
}
function normalizeCookieHeaders(headers) {
  const outgoingHeaders = new Headers();
  for (const [name, header] of headers) {
    if (name === "set-cookie") {
      for (const cookie of normalizeCookieHeader(header)) {
        outgoingHeaders.append("set-cookie", cookie);
      }
    } else {
      outgoingHeaders.set(name, joinHeaders(header));
    }
  }
  return outgoingHeaders;
}

function isJsonRequest(event) {
	
	if (hasReqHeader(event, "accept", "text/html")) {
		return false;
	}
	return hasReqHeader(event, "accept", "application/json") || hasReqHeader(event, "user-agent", "curl/") || hasReqHeader(event, "user-agent", "httpie/") || hasReqHeader(event, "sec-fetch-mode", "cors") || event.path.startsWith("/api/") || event.path.endsWith(".json");
}
function hasReqHeader(event, name, includes) {
	const value = getRequestHeader(event, name);
	return !!(value && typeof value === "string" && value.toLowerCase().includes(includes));
}

const iframeStorageBridge = (nonce) => `
(function () {
  const NONCE = ${JSON.stringify(nonce)};
  const memoryStore = Object.create(null);

  const post = (type, payload) => {
    window.parent.postMessage({ type, nonce: NONCE, ...payload }, '*');
  };

  const isValid = (data) => data && data.nonce === NONCE;

  const mockStorage = {
    getItem(key) {
      return Object.hasOwn(memoryStore, key)
        ? memoryStore[key]
        : null;
    },
    setItem(key, value) {
      const v = String(value);
      memoryStore[key] = v;
      post('storage-set', { key, value: v });
    },
    removeItem(key) {
      delete memoryStore[key];
      post('storage-remove', { key });
    },
    clear() {
      for (const key of Object.keys(memoryStore))
        delete memoryStore[key];
      post('storage-clear', {});
    },
    key(index) {
      const keys = Object.keys(memoryStore);
      return keys[index] ?? null;
    },
    get length() {
      return Object.keys(memoryStore).length;
    }
  };

  const defineLocalStorage = () => {
    try {
      Object.defineProperty(window, 'localStorage', {
        value: mockStorage,
        writable: false,
        configurable: true
      });
    } catch {
      window.localStorage = mockStorage;
    }
  };

  defineLocalStorage();

  window.addEventListener('message', (event) => {
    const data = event.data;
    if (!isValid(data) || data.type !== 'storage-sync-data') return;

    const incoming = data.data || {};
    for (const key of Object.keys(incoming))
      memoryStore[key] = incoming[key];

    if (typeof window.initTheme === 'function')
      window.initTheme();
    window.dispatchEvent(new Event('storage-ready'));
  });

  // Clipboard API is unavailable in data: URL iframe, so we use postMessage
  document.addEventListener('DOMContentLoaded', function() {
    window.copyErrorMessage = function(button) {
      post('clipboard-copy', { text: button.dataset.errorText });
      button.classList.add('copied');
      setTimeout(function() { button.classList.remove('copied'); }, 2000);
    };
  });

  post('storage-sync-request', {});
})();
`;
const parentStorageBridge = (nonce) => `
(function () {
  const host = document.querySelector('nuxt-error-overlay');
  if (!host) return;

  const NONCE = ${JSON.stringify(nonce)};
  const isValid = (data) => data && data.nonce === NONCE;

  // Handle clipboard copy from iframe
  window.addEventListener('message', function(e) {
    if (isValid(e) && e.data.type === 'clipboard-copy') {
      navigator.clipboard.writeText(e.data.text).catch(function() {});
    }
  });

  const collectLocalStorage = () => {
    const all = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k != null) all[k] = localStorage.getItem(k);
    }
    return all;
  };

  const attachWhenReady = () => {
    const root = host.shadowRoot;
    if (!root)
      return false;
    const iframe = root.getElementById('frame');
    if (!iframe || !iframe.contentWindow)
      return false;

    const handlers = {
      'storage-set': (d) => localStorage.setItem(d.key, d.value),
      'storage-remove': (d) => localStorage.removeItem(d.key),
      'storage-clear': () => localStorage.clear(),
      'storage-sync-request': () => {
        iframe.contentWindow.postMessage({
          type: 'storage-sync-data',
          data: collectLocalStorage(),
          nonce: NONCE
        }, '*');
      }
    };

    window.addEventListener('message', (event) => {
      const data = event.data;
      if (!isValid(data)) return;
      const fn = handlers[data.type];
      if (fn) fn(data);
    });

    return true;
  };

  if (attachWhenReady())
    return;

  const obs = new MutationObserver(() => {
    if (attachWhenReady())
      obs.disconnect();
  });

  obs.observe(host, { childList: true, subtree: true });
})();
`;
const errorCSS = `
:host {
  --preview-width: 240px;
  --preview-height: 180px;
  --base-width: 1200px;
  --base-height: 900px;
  --z-base: 999999998;
  --error-pip-left: auto;
  --error-pip-top: auto;
  --error-pip-right: 5px;
  --error-pip-bottom: 5px;
  --error-pip-origin: bottom right;
  --app-preview-left: auto;
  --app-preview-top: auto;
  --app-preview-right: 5px;
  --app-preview-bottom: 5px;
  all: initial;
  display: contents;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
#frame {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  border: none;
  z-index: var(--z-base);
}
#frame[inert] {
  left: var(--error-pip-left);
  top: var(--error-pip-top);
  right: var(--error-pip-right);
  bottom: var(--error-pip-bottom);
  width: var(--base-width);
  height: var(--base-height);
  transform: scale(calc(240 / 1200));
  transform-origin: var(--error-pip-origin);
  overflow: hidden;
  border-radius: calc(1200 * 8px / 240);
}
#preview {
  position: fixed;
  left: var(--app-preview-left);
  top: var(--app-preview-top);
  right: var(--app-preview-right);
  bottom: var(--app-preview-bottom);
  width: var(--preview-width);
  height: var(--preview-height);
  overflow: hidden;
  border-radius: 6px;
  pointer-events: none;
  z-index: var(--z-base);
  background: white;
  display: none;
}
#preview iframe {
  transform-origin: var(--error-pip-origin);
}
#frame:not([inert]) + #preview {
  display: block;
}
#toggle {
  position: fixed;
  left: var(--app-preview-left);
  top: var(--app-preview-top);
  right: calc(var(--app-preview-right) - 3px);
  bottom: calc(var(--app-preview-bottom) - 3px);
  width: var(--preview-width);
  height: var(--preview-height);
  background: none;
  border: 3px solid #00DC82;
  border-radius: 8px;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.2s, box-shadow 0.2s;
  z-index: calc(var(--z-base) + 1);
  display: flex;
  align-items: center;
  justify-content: center;
}
#toggle:hover,
#toggle:focus {
  opacity: 1;
  box-shadow: 0 0 20px rgba(0, 220, 130, 0.6);
}
#toggle:focus-visible {
  outline: 3px solid #00DC82;
  outline-offset: 0;
  box-shadow: 0 0 24px rgba(0, 220, 130, 0.8);
}
#frame[inert] ~ #toggle {
  left: var(--error-pip-left);
  top: var(--error-pip-top);
  right: calc(var(--error-pip-right) - 3px);
  bottom: calc(var(--error-pip-bottom) - 3px);
  cursor: grab;
}
:host(.dragging) #frame[inert] ~ #toggle {
  cursor: grabbing;
}
#frame:not([inert]) ~ #toggle,
#frame:not([inert]) + #preview {
  cursor: grab;
}
:host(.dragging-preview) #frame:not([inert]) ~ #toggle,
:host(.dragging-preview) #frame:not([inert]) + #preview {
  cursor: grabbing;
}

#pip-close {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.75);
  color: #fff;
  font-size: 16px;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  pointer-events: auto;
}
#pip-close:focus-visible {
  outline: 2px solid #00DC82;
  outline-offset: 2px;
}

#pip-restore {
  position: fixed;
  right: 16px;
  bottom: 16px;
  padding: 8px 14px;
  border-radius: 999px;
  border: 2px solid #00DC82;
  background: #111;
  color: #fff;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  z-index: calc(var(--z-base) + 2);
  cursor: grab;
}
#pip-restore:focus-visible {
  outline: 2px solid #00DC82;
  outline-offset: 2px;
}
:host(.dragging-restore) #pip-restore {
  cursor: grabbing;
}

#frame[hidden],
#toggle[hidden],
#preview[hidden],
#pip-restore[hidden],
#pip-close[hidden] {
  display: none !important;
}

@media (prefers-reduced-motion: reduce) {
  #toggle {
    transition: none;
  }
}
`;
function webComponentScript(base64HTML, startMinimized) {
	return `
(function () {
  try {
    // =========================
    // Host + Shadow
    // =========================
    const host = document.querySelector('nuxt-error-overlay');
    if (!host)
      return;
    const shadow = host.attachShadow({ mode: 'open' });

    // =========================
    // DOM helpers
    // =========================
    const el = (tag) => document.createElement(tag);
    const on = (node, type, fn, opts) => node.addEventListener(type, fn, opts);
    const hide = (node, v) => node.toggleAttribute('hidden', !!v);
    const setVar = (name, value) => host.style.setProperty(name, value);
    const unsetVar = (name) => host.style.removeProperty(name);

    // =========================
    // Create DOM
    // =========================
    const style = el('style');
    style.textContent = ${JSON.stringify(errorCSS)};

    const iframe = el('iframe');
    iframe.id = 'frame';
    iframe.src = 'data:text/html;base64,${base64HTML}';
    iframe.title = 'Detailed error stack trace';
    iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-top-navigation-by-user-activation');

    const preview = el('div');
    preview.id = 'preview';

    const toggle = el('div');
    toggle.id = 'toggle';
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('role', 'button');
    toggle.setAttribute('tabindex', '0');
    toggle.innerHTML = '<span class="sr-only">Toggle detailed error view</span>';

    const liveRegion = el('div');
    liveRegion.setAttribute('role', 'status');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.className = 'sr-only';

    const pipCloseButton = el('button');
    pipCloseButton.id = 'pip-close';
    pipCloseButton.setAttribute('type', 'button');
    pipCloseButton.setAttribute('aria-label', 'Hide error preview overlay');
    pipCloseButton.innerHTML = '&times;';
    pipCloseButton.hidden = true;
    toggle.appendChild(pipCloseButton);

    const pipRestoreButton = el('button');
    pipRestoreButton.id = 'pip-restore';
    pipRestoreButton.setAttribute('type', 'button');
    pipRestoreButton.setAttribute('aria-label', 'Show error overlay');
    pipRestoreButton.innerHTML = '<span aria-hidden="true">⟲</span><span>Show error overlay</span>';
    pipRestoreButton.hidden = true;

    // Order matters: #frame + #preview adjacency
    shadow.appendChild(style);
    shadow.appendChild(liveRegion);
    shadow.appendChild(iframe);
    shadow.appendChild(preview);
    shadow.appendChild(toggle);
    shadow.appendChild(pipRestoreButton);

    // =========================
    // Constants / keys
    // =========================
    const POS_KEYS = {
      position: 'nuxt-error-overlay:position',
      hiddenPretty: 'nuxt-error-overlay:error-pip:hidden',
      hiddenPreview: 'nuxt-error-overlay:app-preview:hidden'
    };

    const CSS_VARS = {
      pip: {
        left: '--error-pip-left',
        top: '--error-pip-top',
        right: '--error-pip-right',
        bottom: '--error-pip-bottom'
      },
      preview: {
        left: '--app-preview-left',
        top: '--app-preview-top',
        right: '--app-preview-right',
        bottom: '--app-preview-bottom'
      }
    };

    const MIN_GAP = 5;
    const DRAG_THRESHOLD = 2;

    // =========================
    // Local storage safe access + state
    // =========================
    let storageReady = true;
    let isPrettyHidden = false;
    let isPreviewHidden = false;

    const safeGet = (k) => {
      try {
        return localStorage.getItem(k);
      } catch {
        return null;
      }
    };

    const safeSet = (k, v) => {
      if (!storageReady) 
        return;
      try {
        localStorage.setItem(k, v);
      } catch {}
    };

    // =========================
    // Sizing helpers
    // =========================
    const vvSize = () => {
      const v = window.visualViewport;
      return v ? { w: v.width, h: v.height } : { w: window.innerWidth, h: window.innerHeight };
    };

    const previewSize = () => {
      const styles = getComputedStyle(host);
      const w = parseFloat(styles.getPropertyValue('--preview-width')) || 240;
      const h = parseFloat(styles.getPropertyValue('--preview-height')) || 180;
      return { w, h };
    };

    const sizeForTarget = (target) => {
      if (!target)
        return previewSize();
      const rect = target.getBoundingClientRect();
      if (rect.width && rect.height)
        return { w: rect.width, h: rect.height };
      return previewSize();
    };

    // =========================
    // Dock model + offset/alignment calculations
    // =========================
    const dock = { edge: null, offset: null, align: null, gap: null };

    const maxOffsetFor = (edge, size) => {
      const vv = vvSize();
      if (edge === 'left' || edge === 'right')
        return Math.max(MIN_GAP, vv.h - size.h - MIN_GAP);
      return Math.max(MIN_GAP, vv.w - size.w - MIN_GAP);
    };

    const clampOffset = (edge, value, size) => {
      const max = maxOffsetFor(edge, size);
      return Math.min(Math.max(value, MIN_GAP), max);
    };

    const updateDockAlignment = (size) => {
      if (!dock.edge || dock.offset == null)
        return;
      const max = maxOffsetFor(dock.edge, size);
      if (dock.offset <= max / 2) {
        dock.align = 'start';
        dock.gap = dock.offset;
      } else {
        dock.align = 'end';
        dock.gap = Math.max(0, max - dock.offset);
      }
    };

    const appliedOffsetFor = (size) => {
      if (!dock.edge || dock.offset == null)
        return null;
      const max = maxOffsetFor(dock.edge, size);

      if (dock.align === 'end' && typeof dock.gap === 'number') {
        return clampOffset(dock.edge, max - dock.gap, size);
      }
      if (dock.align === 'start' && typeof dock.gap === 'number') {
        return clampOffset(dock.edge, dock.gap, size);
      }
      return clampOffset(dock.edge, dock.offset, size);
    };

    const nearestEdgeAt = (x, y) => {
      const { w, h } = vvSize();
      const d = { left: x, right: w - x, top: y, bottom: h - y };
      return Object.keys(d).reduce((a, b) => (d[a] < d[b] ? a : b));
    };

    const cornerDefaultDock = () => {
      const vv = vvSize();
      const size = previewSize();
      const offset = Math.max(MIN_GAP, vv.w - size.w - MIN_GAP);
      return { edge: 'bottom', offset };
    };

    const currentTransformOrigin = () => {
      if (!dock.edge) return null;
      if (dock.edge === 'left' || dock.edge === 'top')
        return 'top left';
      if (dock.edge === 'right')
        return 'top right';
      return 'bottom left';
    };

    // =========================
    // Persist / load dock
    // =========================
    const loadDock = () => {
      const raw = safeGet(POS_KEYS.position);
      if (!raw)
        return;
      try {
        const parsed = JSON.parse(raw);
        const { edge, offset, align, gap } = parsed || {};
        if (!['left', 'right', 'top', 'bottom'].includes(edge))
          return;
        if (typeof offset !== 'number')
          return;

        dock.edge = edge;
        dock.offset = clampOffset(edge, offset, previewSize());
        dock.align = align === 'start' || align === 'end' ? align : null;
        dock.gap = typeof gap === 'number' ? gap : null;

        if (!dock.align || dock.gap == null)
          updateDockAlignment(previewSize());
      } catch {}
    };

    const persistDock = () => {
      if (!dock.edge || dock.offset == null)
        return; 
      safeSet(POS_KEYS.position, JSON.stringify({
        edge: dock.edge,
        offset: dock.offset,
        align: dock.align,
        gap: dock.gap
      }));
    };

    // =========================
    // Apply dock
    // =========================
    const dockToVars = (vars) => ({
      set: (side, v) => host.style.setProperty(vars[side], v),
      clear: (side) => host.style.removeProperty(vars[side])
    });

    const dockToEl = (node) => ({
      set: (side, v) => { node.style[side] = v; },
      clear: (side) => { node.style[side] = ''; }
    });

    const applyDock = (target, size, opts) => {
      if (!dock.edge || dock.offset == null) {
        target.clear('left');
        target.clear('top');
        target.clear('right');
        target.clear('bottom');
        return;
      }

      target.set('left', 'auto');
      target.set('top', 'auto');
      target.set('right', 'auto');
      target.set('bottom', 'auto');

      const applied = appliedOffsetFor(size);

      if (dock.edge === 'left') {
        target.set('left', MIN_GAP + 'px');
        target.set('top', applied + 'px');
      } else if (dock.edge === 'right') {
        target.set('right', MIN_GAP + 'px');
        target.set('top', applied + 'px');
      } else if (dock.edge === 'top') {
        target.set('top', MIN_GAP + 'px');
        target.set('left', applied + 'px');
      } else {
        target.set('bottom', MIN_GAP + 'px');
        target.set('left', applied + 'px');
      }

      if (!opts || opts.persist !== false)
        persistDock();
    };

    const applyDockAll = (opts) => {
      applyDock(dockToVars(CSS_VARS.pip), previewSize(), opts);
      applyDock(dockToVars(CSS_VARS.preview), previewSize(), opts);
      applyDock(dockToEl(pipRestoreButton), sizeForTarget(pipRestoreButton), opts);
    };

    const repaintToDock = () => {
      if (!dock.edge || dock.offset == null)
        return;
      const origin = currentTransformOrigin();
      if (origin)
        setVar('--error-pip-origin', origin);
      else 
        unsetVar('--error-pip-origin');
      applyDockAll({ persist: false });
    };

    // =========================
    // Hidden state + UI
    // =========================
    const loadHidden = () => {
      const rawPretty = safeGet(POS_KEYS.hiddenPretty);
      if (rawPretty != null)
        isPrettyHidden = rawPretty === '1' || rawPretty === 'true';
      const rawPreview = safeGet(POS_KEYS.hiddenPreview);
      if (rawPreview != null)
        isPreviewHidden = rawPreview === '1' || rawPreview === 'true';
    };

    const setPrettyHidden = (v) => {
      isPrettyHidden = !!v;
      safeSet(POS_KEYS.hiddenPretty, isPrettyHidden ? '1' : '0');
      updateUI();
    };

    const setPreviewHidden = (v) => {
      isPreviewHidden = !!v;
      safeSet(POS_KEYS.hiddenPreview, isPreviewHidden ? '1' : '0');
      updateUI();
    };

    const isMinimized = () => iframe.hasAttribute('inert');

    const setMinimized = (v) => {
      if (v) {
        iframe.setAttribute('inert', '');
        toggle.setAttribute('aria-expanded', 'false');
      } else {
        iframe.removeAttribute('inert');
        toggle.setAttribute('aria-expanded', 'true');
      }
    };

    const setRestoreLabel = (kind) => {
      if (kind === 'pretty') {
        pipRestoreButton.innerHTML = '<span aria-hidden="true">⟲</span><span>Show error overlay</span>';
        pipRestoreButton.setAttribute('aria-label', 'Show error overlay');
      } else {
        pipRestoreButton.innerHTML = '<span aria-hidden="true">⟲</span><span>Show error page</span>';
        pipRestoreButton.setAttribute('aria-label', 'Show error page');
      }
    };

    const updateUI = () => {
      const minimized = isMinimized();
      const showPiP = minimized && !isPrettyHidden;
      const showPreview = !minimized && !isPreviewHidden;
      const pipHiddenByUser = minimized && isPrettyHidden;
      const previewHiddenByUser = !minimized && isPreviewHidden;
      const showToggle = minimized ? showPiP : showPreview;
      const showRestore = pipHiddenByUser || previewHiddenByUser;

      hide(iframe, pipHiddenByUser);
      hide(preview, !showPreview);
      hide(toggle, !showToggle);
      hide(pipCloseButton, !showToggle);
      hide(pipRestoreButton, !showRestore);

      pipCloseButton.setAttribute('aria-label', minimized ? 'Hide error overlay' : 'Hide error page preview');

      if (pipHiddenByUser)
        setRestoreLabel('pretty');
      else if (previewHiddenByUser)
        setRestoreLabel('preview');

      host.classList.toggle('pip-hidden', isPrettyHidden);
      host.classList.toggle('preview-hidden', isPreviewHidden);
    };

    // =========================
    // Preview snapshot
    // =========================
    const updatePreview = () => {
      try {
        let previewIframe = preview.querySelector('iframe');
        if (!previewIframe) {
          previewIframe = el('iframe');
          previewIframe.style.cssText = 'width: 1200px; height: 900px; transform: scale(0.2); transform-origin: top left; border: none;';
          previewIframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');
          preview.appendChild(previewIframe);
        }

        const doctype = document.doctype ? '<!DOCTYPE ' + document.doctype.name + '>' : '';
        const cleanedHTML = document.documentElement.outerHTML
          .replace(/<nuxt-error-overlay[^>]*>.*?<\\/nuxt-error-overlay>/gs, '')
          .replace(/<script[^>]*>.*?<\\/script>/gs, '');

        const iframeDoc = previewIframe.contentDocument || previewIframe.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(doctype + cleanedHTML);
        iframeDoc.close();
      } catch (err) {
        console.error('Failed to update preview:', err);
      }
    };

    // =========================
    // View toggling
    // =========================
    const toggleView = () => {
      if (isMinimized()) {
        updatePreview();
        setMinimized(false);
        liveRegion.textContent = 'Showing detailed error view';
        setTimeout(() => { 
          try { 
            iframe.contentWindow.focus();
          } catch {}
        }, 100);
      } else {
        setMinimized(true);
        liveRegion.textContent = 'Showing error page';
        repaintToDock();
        void iframe.offsetWidth;
      }
      updateUI();
    };

    // =========================
    // Dragging (unified, rAF throttled)
    // =========================
    let drag = null;
    let rafId = null;
    let suppressToggleClick = false;
    let suppressRestoreClick = false;

    const beginDrag = (e) => {
      if (drag) 
        return;

      if (!dock.edge || dock.offset == null) {
        const def = cornerDefaultDock();
        dock.edge = def.edge;
        dock.offset = def.offset;
        updateDockAlignment(previewSize());
      }

      const isRestoreTarget = e.currentTarget === pipRestoreButton;

      drag = {
        kind: isRestoreTarget ? 'restore' : (isMinimized() ? 'pip' : 'preview'),
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        lastX: e.clientX,
        lastY: e.clientY,
        moved: false,
        target: e.currentTarget
      };

      drag.target.setPointerCapture(e.pointerId);

      if (drag.kind === 'restore')
        host.classList.add('dragging-restore');
      else 
        host.classList.add(drag.kind === 'pip' ? 'dragging' : 'dragging-preview');

      e.preventDefault();
    };

    const moveDrag = (e) => {
      if (!drag || drag.pointerId !== e.pointerId)
        return;

      drag.lastX = e.clientX;
      drag.lastY = e.clientY;
      
      const dx = drag.lastX - drag.startX;
      const dy = drag.lastY - drag.startY;

      if (!drag.moved && (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD)) {
        drag.moved = true;
      }

      if (!drag.moved)
        return;
      if (rafId)
        return;

      rafId = requestAnimationFrame(() => {
        rafId = null;

        const edge = nearestEdgeAt(drag.lastX, drag.lastY);
        const size = sizeForTarget(drag.target);

        let offset;
        if (edge === 'left' || edge === 'right') {
          const top = drag.lastY - (size.h / 2);
          offset = clampOffset(edge, Math.round(top), size);
        } else {
          const left = drag.lastX - (size.w / 2);
          offset = clampOffset(edge, Math.round(left), size);
        }

        dock.edge = edge;
        dock.offset = offset;
        updateDockAlignment(size);

        const origin = currentTransformOrigin();
        setVar('--error-pip-origin', origin || 'bottom right');

        applyDockAll({ persist: false });
      });
    };

    const endDrag = (e) => {
      if (!drag || drag.pointerId !== e.pointerId)
        return;

      const endedKind = drag.kind;
      drag.target.releasePointerCapture(e.pointerId);

      if (endedKind === 'restore')
        host.classList.remove('dragging-restore');
      else 
        host.classList.remove(endedKind === 'pip' ? 'dragging' : 'dragging-preview');

      const didMove = drag.moved;
      drag = null;

      if (didMove) {
        persistDock();
        if (endedKind === 'restore')
          suppressRestoreClick = true;
        else 
          suppressToggleClick = true;
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const bindDragTarget = (node) => {
      on(node, 'pointerdown', beginDrag);
      on(node, 'pointermove', moveDrag);
      on(node, 'pointerup', endDrag);
      on(node, 'pointercancel', endDrag);
    };

    bindDragTarget(toggle);
    bindDragTarget(pipRestoreButton);

    // =========================
    // Events (toggle / close / restore)
    // =========================
    on(toggle, 'click', (e) => {
      if (suppressToggleClick) {
        e.preventDefault();
        suppressToggleClick = false;
        return;
      }
      toggleView();
    });

    on(toggle, 'keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleView();
      }
    });

    on(pipCloseButton, 'click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (isMinimized())
        setPrettyHidden(true);
      else
        setPreviewHidden(true);
    });

    on(pipCloseButton, 'pointerdown', (e) => {
      e.stopPropagation();
    });

    on(pipRestoreButton, 'click', (e) => {
      if (suppressRestoreClick) {
        e.preventDefault();
        suppressRestoreClick = false;
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      if (isMinimized()) 
        setPrettyHidden(false);
      else 
        setPreviewHidden(false);
    });

    // =========================
    // Lifecycle: load / sync / repaint
    // =========================
    const loadState = () => {
      loadDock();
      loadHidden();

      if (isPrettyHidden && !isMinimized())
        setMinimized(true);

      updateUI();
      repaintToDock();
    };

    loadState();

    on(window, 'storage-ready', () => {
      storageReady = true;
      loadState();
    });

    const onViewportChange = () => repaintToDock();

    on(window, 'resize', onViewportChange);

    if (window.visualViewport) {
      on(window.visualViewport, 'resize', onViewportChange);
      on(window.visualViewport, 'scroll', onViewportChange);
    }

    // initial preview
    setTimeout(updatePreview, 100);

    // initial minimized option
    if (${startMinimized}) {
      setMinimized(true);
      repaintToDock();
      void iframe.offsetWidth;
      updateUI();
    }
  } catch (err) {
    console.error('Failed to initialize Nuxt error overlay:', err);
  }
})();
`;
}
function generateErrorOverlayHTML(html, options) {
	const nonce = Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, "0")).join("");
	const errorPage = html.replace("<head>", `<head><script>${iframeStorageBridge(nonce)}<\/script>`);
	const base64HTML = Buffer.from(errorPage, "utf8").toString("base64");
	return `
    <script>${parentStorageBridge(nonce)}<\/script>
    <nuxt-error-overlay></nuxt-error-overlay>
    <script>${webComponentScript(base64HTML, options?.startMinimized ?? false)}<\/script>
  `;
}

const errorHandler$0 = (async function errorhandler(error, event, { defaultHandler }) {
	if (event.handled || isJsonRequest(event)) {
		
		return;
	}
	
	const defaultRes = await defaultHandler(error, event, { json: true });
	
	const status = error.status || error.statusCode || 500;
	if (status === 404 && defaultRes.status === 302) {
		setResponseHeaders(event, defaultRes.headers);
		setResponseStatus(event, defaultRes.status, defaultRes.statusText);
		return send(event, JSON.stringify(defaultRes.body, null, 2));
	}
	if (typeof defaultRes.body !== "string" && Array.isArray(defaultRes.body.stack)) {
		
		defaultRes.body.stack = defaultRes.body.stack.join("\n");
	}
	const errorObject = defaultRes.body;
	
	const url = new URL(errorObject.url);
	errorObject.url = withoutBase(url.pathname, useRuntimeConfig(event).app.baseURL) + url.search + url.hash;
	
	errorObject.message = error.unhandled ? errorObject.message || "Server Error" : error.message || errorObject.message || "Server Error";
	
	errorObject.data ||= error.data;
	errorObject.statusText ||= error.statusText || error.statusMessage;
	delete defaultRes.headers["content-type"];
	delete defaultRes.headers["content-security-policy"];
	setResponseHeaders(event, defaultRes.headers);
	
	const reqHeaders = getRequestHeaders(event);
	
	const isRenderingError = event.path.startsWith("/__nuxt_error") || !!reqHeaders["x-nuxt-error"] || !!event.context.nuxt?.["~rendering-error"];
	if (!isRenderingError) {
		event.context.nuxt ||= {};
		event.context.nuxt["~rendering-error"] = true;
	}
	
	const res = isRenderingError ? null : await useNitroApp().localFetch(withQuery(joinURL(useRuntimeConfig(event).app.baseURL, "/__nuxt_error"), errorObject), {
		headers: {
			...reqHeaders,
			"x-nuxt-error": "true"
		},
		redirect: "manual"
	}).catch(() => null);
	if (event.handled) {
		return;
	}
	
	if (!res) {
		const { template } = await Promise.resolve().then(function () { return error500; });
		{
			
			errorObject.description = errorObject.message;
		}
		setResponseHeader(event, "Content-Type", "text/html;charset=UTF-8");
		return send(event, template(errorObject));
	}
	const html = await res.text();
	for (const [header, value] of res.headers.entries()) {
		if (header === "set-cookie") {
			appendResponseHeader(event, header, value);
			continue;
		}
		setResponseHeader(event, header, value);
	}
	setResponseStatus(event, res.status && res.status !== 200 ? res.status : defaultRes.status, res.statusText || defaultRes.statusText);
	if (!globalThis._importMeta_.test && typeof html === "string") {
		const prettyResponse = await defaultHandler(error, event, { json: false });
		if (typeof prettyResponse.body === "string") {
			return send(event, html.replace("</body>", `${generateErrorOverlayHTML(prettyResponse.body, { startMinimized: 300 <= status && status < 500 })}</body>`));
		}
	}
	return send(event, html);
});

function defineNitroErrorHandler(handler) {
  return handler;
}

const errorHandler$1 = defineNitroErrorHandler(
  async function defaultNitroErrorHandler(error, event) {
    const res = await defaultHandler(error, event);
    if (!event.node?.res.headersSent) {
      setResponseHeaders(event, res.headers);
    }
    setResponseStatus(event, res.status, res.statusText);
    return send(
      event,
      typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2)
    );
  }
);
async function defaultHandler(error, event, opts) {
  const isSensitive = error.unhandled || error.fatal;
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage || "Server Error";
  const url = getRequestURL(event, { xForwardedHost: true, xForwardedProto: true });
  if (statusCode === 404) {
    const baseURL = "/";
    if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) {
      const redirectTo = `${baseURL}${url.pathname.slice(1)}${url.search}`;
      return {
        status: 302,
        statusText: "Found",
        headers: { location: redirectTo },
        body: `Redirecting...`
      };
    }
  }
  await loadStackTrace(error).catch(consola.error);
  const youch = new Youch();
  if (isSensitive && !opts?.silent) {
    const tags = [error.unhandled && "[unhandled]", error.fatal && "[fatal]"].filter(Boolean).join(" ");
    const ansiError = await (await youch.toANSI(error)).replaceAll(process.cwd(), ".");
    consola.error(
      `[request error] ${tags} [${event.method}] ${url}

`,
      ansiError
    );
  }
  const useJSON = opts?.json ?? !getRequestHeader(event, "accept")?.includes("text/html");
  const headers = {
    "content-type": useJSON ? "application/json" : "text/html",
    // Prevent browser from guessing the MIME types of resources.
    "x-content-type-options": "nosniff",
    // Prevent error page from being embedded in an iframe
    "x-frame-options": "DENY",
    // Prevent browsers from sending the Referer header
    "referrer-policy": "no-referrer",
    // Disable the execution of any js
    "content-security-policy": "script-src 'self' 'unsafe-inline'; object-src 'none'; base-uri 'self';"
  };
  if (statusCode === 404 || !getResponseHeader(event, "cache-control")) {
    headers["cache-control"] = "no-cache";
  }
  const body = useJSON ? {
    error: true,
    url,
    statusCode,
    statusMessage,
    message: error.message,
    data: error.data,
    stack: error.stack?.split("\n").map((line) => line.trim())
  } : await youch.toHTML(error, {
    request: {
      url: url.href,
      method: event.method,
      headers: getRequestHeaders(event)
    }
  });
  return {
    status: statusCode,
    statusText: statusMessage,
    headers,
    body
  };
}
async function loadStackTrace(error) {
  if (!(error instanceof Error)) {
    return;
  }
  const parsed = await new ErrorParser().defineSourceLoader(sourceLoader).parse(error);
  const stack = error.message + "\n" + parsed.frames.map((frame) => fmtFrame(frame)).join("\n");
  Object.defineProperty(error, "stack", { value: stack });
  if (error.cause) {
    await loadStackTrace(error.cause).catch(consola.error);
  }
}
async function sourceLoader(frame) {
  if (!frame.fileName || frame.fileType !== "fs" || frame.type === "native") {
    return;
  }
  if (frame.type === "app") {
    const rawSourceMap = await readFile(`${frame.fileName}.map`, "utf8").catch(() => {
    });
    if (rawSourceMap) {
      const consumer = await new SourceMapConsumer(rawSourceMap);
      const originalPosition = consumer.originalPositionFor({ line: frame.lineNumber, column: frame.columnNumber });
      if (originalPosition.source && originalPosition.line) {
        frame.fileName = resolve(dirname(frame.fileName), originalPosition.source);
        frame.lineNumber = originalPosition.line;
        frame.columnNumber = originalPosition.column || 0;
      }
    }
  }
  const contents = await readFile(frame.fileName, "utf8").catch(() => {
  });
  return contents ? { contents } : void 0;
}
function fmtFrame(frame) {
  if (frame.type === "native") {
    return frame.raw;
  }
  const src = `${frame.fileName || ""}:${frame.lineNumber}:${frame.columnNumber})`;
  return frame.functionName ? `at ${frame.functionName} (${src}` : `at ${src}`;
}

const errorHandlers = [errorHandler$0, errorHandler$1];

async function errorHandler(error, event) {
  for (const handler of errorHandlers) {
    try {
      await handler(error, event, { defaultHandler });
      if (event.handled) {
        return; // Response handled
      }
    } catch(error) {
      // Handler itself thrown, log and continue
      console.error(error);
    }
  }
  // H3 will handle fallback
}

const script = `
if (!window.__NUXT_DEVTOOLS_TIME_METRIC__) {
  Object.defineProperty(window, '__NUXT_DEVTOOLS_TIME_METRIC__', {
    value: {},
    enumerable: false,
    configurable: true,
  })
}
window.__NUXT_DEVTOOLS_TIME_METRIC__.appInit = Date.now()
`;

const _AhnhL5jeVHxUAjtPbsLLrKLtATUzTG_ga2o3p0vPv9E = (function(nitro) {
  nitro.hooks.hook("render:html", (htmlContext) => {
    htmlContext.head.push(`<script>${script}<\/script>`);
  });
});

const rootDir = "/Users/arsalanbaranzaev/Desktop/projects/incity-new";

const appHead = {"meta":[{"name":"viewport","content":"width=device-width, initial-scale=1"},{"charset":"utf-8"}],"link":[],"style":[],"script":[{"src":"/js/telegram-web-app.js","tagPosition":"head"},{"src":"/js/max-web-app.js","tagPosition":"head"}],"noscript":[]};

const appRootTag = "div";

const appRootAttrs = {"id":"__nuxt"};

const appTeleportTag = "div";

const appTeleportAttrs = {"id":"teleports"};

const appId = "nuxt-app";

const devReducers = {
	VNode: (data) => isVNode(data) ? {
		type: data.type,
		props: data.props
	} : undefined,
	URL: (data) => data instanceof URL ? data.toString() : undefined,
	Symbol: (data) => typeof data === "symbol" ? data.description ?? "" : undefined
};
const asyncContext = getContext("nuxt-dev", {
	asyncContext: true,
	AsyncLocalStorage
});
const _wV1tgphgKlEFnaoGqK4dQTvO_drTkiQNkL2mopt5ug = (nitroApp) => {
	const handler = nitroApp.h3App.handler;
	nitroApp.h3App.handler = (event) => {
		return asyncContext.callAsync({
			logs: [],
			event
		}, () => handler(event));
	};
	onConsoleLog((_log) => {
		const ctx = asyncContext.tryUse();
		if (!ctx) {
			return;
		}
		const rawStack = captureRawStackTrace();
		if (!rawStack || rawStack.includes("runtime/vite-node.mjs")) {
			return;
		}
		const trace = [];
		let filename = "";
		for (const entry of parseRawStackTrace(rawStack)) {
			if (entry.source === globalThis._importMeta_.url) {
				continue;
			}
			if (EXCLUDE_TRACE_RE.test(entry.source)) {
				continue;
			}
			filename ||= entry.source.replace(withTrailingSlash(rootDir), "");
			trace.push({
				...entry,
				source: entry.source.startsWith("file://") ? entry.source.replace("file://", "") : entry.source
			});
		}
		const log = {
			..._log,
			
			filename,
			
			stack: trace
		};
		
		ctx.logs.push(log);
	});
	nitroApp.hooks.hook("afterResponse", () => {
		const ctx = asyncContext.tryUse();
		if (!ctx) {
			return;
		}
		return nitroApp.hooks.callHook("dev:ssr-logs", {
			logs: ctx.logs,
			path: ctx.event.path
		});
	});
	
	nitroApp.hooks.hook("render:html", (htmlContext) => {
		const ctx = asyncContext.tryUse();
		if (!ctx) {
			return;
		}
		try {
			const reducers = Object.assign(Object.create(null), devReducers, ctx.event.context["~payloadReducers"]);
			htmlContext.bodyAppend.unshift(`<script type="application/json" data-nuxt-logs="${appId}">${stringify(ctx.logs, reducers)}<\/script>`);
		} catch (e) {
			const shortError = e instanceof Error && "toString" in e ? ` Received \`${e.toString()}\`.` : "";
			console.warn(`[nuxt] Failed to stringify dev server logs.${shortError} You can define your own reducer/reviver for rich types following the instructions in https://nuxt.com/docs/api/composables/use-nuxt-app#payload.`);
		}
	});
};
const EXCLUDE_TRACE_RE = /\/node_modules\/(?:.*\/)?(?:nuxt|nuxt-nightly|nuxt-edge|nuxt3|consola|@vue)\/|core\/runtime\/nitro/;
function onConsoleLog(callback) {
	consola$1.addReporter({ log(logObj) {
		callback(logObj);
	} });
	consola$1.wrapConsole();
}

const _pGOP_RUTVRbrXsLZPUtedWzt7TxGpXWytENl3wvcAeo = defineNitroPlugin(() => {
  if (typeof globalThis.WebSocket === "undefined") {
    globalThis.WebSocket = WebSocket;
  }
});

const plugins = [
  _AhnhL5jeVHxUAjtPbsLLrKLtATUzTG_ga2o3p0vPv9E,
_wV1tgphgKlEFnaoGqK4dQTvO_drTkiQNkL2mopt5ug,
_pGOP_RUTVRbrXsLZPUtedWzt7TxGpXWytENl3wvcAeo,
_wH6JrtIxmaSoA8lCPWFnE9z4lQeXW6H5z3l5aymEQw
];

const assets = {
  "/index.mjs": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"afccb-AJQ/ZPmJiLYDw3cz6WscnmhzEig\"",
    "mtime": "2026-05-25T11:05:13.195Z",
    "size": 720075,
    "path": "index.mjs"
  }
};

function readAsset (id) {
  const serverDir = dirname$1(fileURLToPath(globalThis._importMeta_.url));
  return promises.readFile(resolve$1(serverDir, assets[id].path))
}

const publicAssetBases = {"/_nuxt/builds/meta/":{"maxAge":31536000},"/_nuxt/builds/":{"maxAge":1}};

function isPublicAssetURL(id = '') {
  if (assets[id]) {
    return true
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) { return true }
  }
  return false
}

function getAsset (id) {
  return assets[id]
}

const METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
const EncodingMap = { gzip: ".gz", br: ".br" };
const _I_Nsjs = eventHandler((event) => {
  if (event.method && !METHODS.has(event.method)) {
    return;
  }
  let id = decodePath(
    withLeadingSlash(withoutTrailingSlash(parseURL(event.path).pathname))
  );
  let asset;
  const encodingHeader = String(
    getRequestHeader(event, "accept-encoding") || ""
  );
  const encodings = [
    ...encodingHeader.split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(),
    ""
  ];
  for (const encoding of encodings) {
    for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
      const _asset = getAsset(_id);
      if (_asset) {
        asset = _asset;
        id = _id;
        break;
      }
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      removeResponseHeader(event, "Cache-Control");
      throw createError({ statusCode: 404 });
    }
    return;
  }
  if (asset.encoding !== void 0) {
    appendResponseHeader(event, "Vary", "Accept-Encoding");
  }
  const ifNotMatch = getRequestHeader(event, "if-none-match") === asset.etag;
  if (ifNotMatch) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  const ifModifiedSinceH = getRequestHeader(event, "if-modified-since");
  const mtimeDate = new Date(asset.mtime);
  if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  if (asset.type && !getResponseHeader(event, "Content-Type")) {
    setResponseHeader(event, "Content-Type", asset.type);
  }
  if (asset.etag && !getResponseHeader(event, "ETag")) {
    setResponseHeader(event, "ETag", asset.etag);
  }
  if (asset.mtime && !getResponseHeader(event, "Last-Modified")) {
    setResponseHeader(event, "Last-Modified", mtimeDate.toUTCString());
  }
  if (asset.encoding && !getResponseHeader(event, "Content-Encoding")) {
    setResponseHeader(event, "Content-Encoding", asset.encoding);
  }
  if (asset.size > 0 && !getResponseHeader(event, "Content-Length")) {
    setResponseHeader(event, "Content-Length", asset.size);
  }
  return readAsset(id);
});

function getMessengerInitDataFromEvent(event) {
  const a = getHeader(event, "x-messenger-init-data");
  const b = getHeader(event, "x-telegram-init-data");
  const fromA = typeof a === "string" ? a.trim() : "";
  const fromB = typeof b === "string" ? b.trim() : "";
  return fromA || fromB;
}
function validateWebAppInitData(initData, botToken) {
  if (typeof initData !== "string" || !initData.trim()) return null;
  if (typeof botToken !== "string" || !botToken.trim()) return null;
  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  if (!hash) return null;
  params.delete("hash");
  const dataCheckString = [...params.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => `${k}=${v}`).join("\n");
  const secretKey = crypto$1.createHmac("sha256", "WebAppData").update(botToken).digest();
  const computedHash = crypto$1.createHmac("sha256", secretKey).update(dataCheckString).digest("hex");
  if (computedHash !== hash) return null;
  const userStr = params.get("user");
  if (!userStr) return null;
  try {
    return JSON.parse(decodeURIComponent(userStr));
  } catch {
    return null;
  }
}
function uniqueNonEmptyTokens(tokens) {
  const seen = /* @__PURE__ */ new Set();
  const result = [];
  for (const token of tokens) {
    if (typeof token !== "string") continue;
    const trimmed = token.trim();
    if (!trimmed || seen.has(trimmed)) continue;
    seen.add(trimmed);
    result.push(trimmed);
  }
  return result;
}
function validateWebAppInitDataAnyToken(initData, tokens) {
  for (const token of uniqueNonEmptyTokens(tokens)) {
    const parsed = validateWebAppInitData(initData, token);
    if (parsed) return parsed;
  }
  return null;
}
function getMaxBotTokenForShop(integrationKeys, config) {
  const raw = integrationKeys && typeof integrationKeys.max_bot_token === "string" ? integrationKeys.max_bot_token.trim() : "";
  if (raw) return raw;
  const mini = typeof config.maxMiniAppBotToken === "string" ? config.maxMiniAppBotToken.trim() : "";
  if (mini) return mini;
  return typeof config.maxApiToken === "string" ? config.maxApiToken.trim() : "";
}

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

function defineNitroPlugin(def) {
  return def;
}

function defineRenderHandler(render) {
  const runtimeConfig = useRuntimeConfig();
  return eventHandler(async (event) => {
    const nitroApp = useNitroApp();
    const ctx = { event, render, response: void 0 };
    await nitroApp.hooks.callHook("render:before", ctx);
    if (!ctx.response) {
      if (event.path === `${runtimeConfig.app.baseURL}favicon.ico`) {
        setResponseHeader(event, "Content-Type", "image/x-icon");
        return send(
          event,
          "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
        );
      }
      ctx.response = await ctx.render(event);
      if (!ctx.response) {
        const _currentStatus = getResponseStatus(event);
        setResponseStatus(event, _currentStatus === 200 ? 500 : _currentStatus);
        return send(
          event,
          "No response returned from render handler: " + event.path
        );
      }
    }
    await nitroApp.hooks.callHook("render:response", ctx.response, ctx);
    if (ctx.response.headers) {
      setResponseHeaders(event, ctx.response.headers);
    }
    if (ctx.response.statusCode || ctx.response.statusMessage) {
      setResponseStatus(
        event,
        ctx.response.statusCode,
        ctx.response.statusMessage
      );
    }
    return ctx.response.body;
  });
}

const scheduledTasks = false;

const tasks = {
  
};

const __runningTasks__ = {};
async function runTask(name, {
  payload = {},
  context = {}
} = {}) {
  if (__runningTasks__[name]) {
    return __runningTasks__[name];
  }
  if (!(name in tasks)) {
    throw createError({
      message: `Task \`${name}\` is not available!`,
      statusCode: 404
    });
  }
  if (!tasks[name].resolve) {
    throw createError({
      message: `Task \`${name}\` is not implemented!`,
      statusCode: 501
    });
  }
  const handler = await tasks[name].resolve();
  const taskEvent = { name, payload, context };
  __runningTasks__[name] = handler.run(taskEvent);
  try {
    const res = await __runningTasks__[name];
    return res;
  } finally {
    delete __runningTasks__[name];
  }
}

function buildAssetsDir() {
	
	return useRuntimeConfig().app.buildAssetsDir;
}
function buildAssetsURL(...path) {
	return joinRelativeURL(publicAssetsURL(), buildAssetsDir(), ...path);
}
function publicAssetsURL(...path) {
	
	const app = useRuntimeConfig().app;
	const publicBase = app.cdnURL || app.baseURL;
	return path.length ? joinRelativeURL(publicBase, ...path) : publicBase;
}

function normalizePhone(raw) {
  const trimmed = String(raw || "").trim();
  if (!trimmed) return "";
  const digits = trimmed.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.length === 11 && digits.startsWith("8")) return `+7${digits.slice(1)}`;
  if (digits.length === 11 && digits.startsWith("7")) return `+${digits}`;
  if (digits.length === 10) return `+7${digits}`;
  return trimmed.startsWith("+") ? trimmed : `+${digits}`;
}
function phoneFromUserMetadata(meta) {
  const raw = typeof (meta == null ? void 0 : meta.phone) === "string" ? meta.phone : "";
  return raw ? normalizePhone(raw) : "";
}
async function findProfileIdByPhone(serviceClient, phoneRaw) {
  var _a;
  const normalized = normalizePhone(phoneRaw);
  if (!normalized) return null;
  let page = 1;
  const perPage = 200;
  while (page <= 10) {
    const { data, error } = await serviceClient.auth.admin.listUsers({ page, perPage });
    if (error) return null;
    const users = (_a = data == null ? void 0 : data.users) != null ? _a : [];
    const hit = users.find((u) => {
      var _a2;
      return phoneFromUserMetadata((_a2 = u.user_metadata) != null ? _a2 : null) === normalized;
    });
    if (hit == null ? void 0 : hit.id) {
      const { data: profile } = await serviceClient.from("profiles").select("id").eq("id", hit.id).maybeSingle();
      if (profile == null ? void 0 : profile.id) return String(profile.id);
    }
    if (users.length < perPage) break;
    page += 1;
  }
  return null;
}
async function getProfilePhone(serviceClient, profileId) {
  var _a, _b;
  if (!profileId) return "";
  const { data } = await serviceClient.auth.admin.getUserById(profileId);
  const meta = (_b = (_a = data == null ? void 0 : data.user) == null ? void 0 : _a.user_metadata) != null ? _b : {};
  return phoneFromUserMetadata(meta);
}
async function setProfilePhone(serviceClient, profileId, phoneRaw) {
  var _a, _b;
  const normalized = normalizePhone(phoneRaw);
  if (!profileId || !normalized) return "";
  const { data } = await serviceClient.auth.admin.getUserById(profileId);
  const meta = (_b = (_a = data == null ? void 0 : data.user) == null ? void 0 : _a.user_metadata) != null ? _b : {};
  await serviceClient.auth.admin.updateUserById(profileId, {
    user_metadata: { ...meta, phone: normalized }
  });
  return normalized;
}

function parseAuthLinkTokenUuidFromText(text) {
  var _a;
  const t = text.trim();
  const direct = /^link_([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i.exec(t);
  if (direct) return direct[1];
  const start = /^\/start\s+link_([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i.exec(t);
  if (start) return start[1];
  const embedded = /link_([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i.exec(t);
  return (_a = embedded == null ? void 0 : embedded[1]) != null ? _a : null;
}
function buildAuthSiteLinkUrl(options) {
  var _a, _b;
  const raw = ((_a = options.bridgePayload) == null ? void 0 : _a.link_context) || {};
  const baseApp = options.appUrlBase.replace(/\/$/, "");
  let baseUrl = baseApp;
  const host = raw.custom_domain_hostname && String(raw.custom_domain_hostname).trim();
  if (host) {
    const clean = host.replace(/^https?:\/\//i, "").replace(/\/+$/, "");
    baseUrl = `https://${clean}`;
  }
  const redirectPath = typeof raw.redirect_path === "string" && raw.redirect_path.startsWith("/") && !raw.redirect_path.startsWith("//") ? raw.redirect_path : `/${options.defaultCitySlug || "ulan-ude"}`;
  const shopId = raw.shop_slug && String(raw.shop_slug).trim() || ((_b = options.tenantShop) == null ? void 0 : _b.slug) && String(options.tenantShop.slug).trim() || "";
  const q = new URLSearchParams();
  q.set("token", options.token);
  q.set("redirect", redirectPath);
  if (shopId) q.set("shop_id", shopId);
  return `${baseUrl}/${options.linkPath}?${q.toString()}`;
}

function pickNewerIso(a, b) {
  const ta = new Date(a).getTime();
  const tb = new Date(b).getTime();
  return Number.isFinite(ta) && Number.isFinite(tb) ? ta >= tb ? a : b : a;
}
async function migrateCustomerDeliveryAddresses(serviceClient, fromProfileId, toProfileId) {
  var _a, _b, _c, _d;
  if (!fromProfileId || !toProfileId || fromProfileId === toProfileId) return;
  const { data: rows, error } = await serviceClient.from("customer_delivery_addresses").select("id,shop_id,address_line,flat,comment,lat,lon,last_used_at").eq("customer_profile_id", fromProfileId);
  if (error || !(rows == null ? void 0 : rows.length)) return;
  for (const raw of rows) {
    const line = String(raw.address_line || "").trim();
    if (!line) {
      await serviceClient.from("customer_delivery_addresses").delete().eq("id", raw.id);
      continue;
    }
    const flatVal = raw.flat != null && String(raw.flat).trim() !== "" ? String(raw.flat).trim() : null;
    const base = serviceClient.from("customer_delivery_addresses").select("id,comment,lat,lon,last_used_at").eq("customer_profile_id", toProfileId).eq("shop_id", raw.shop_id).eq("address_line", line);
    const { data: clash } = flatVal ? await base.eq("flat", flatVal).maybeSingle() : await base.is("flat", null).maybeSingle();
    if (clash == null ? void 0 : clash.id) {
      const c = clash;
      const lastUsed = pickNewerIso(String(raw.last_used_at || ""), String(c.last_used_at || ""));
      await serviceClient.from("customer_delivery_addresses").update({
        comment: raw.comment || c.comment || null,
        lat: (_b = (_a = raw.lat) != null ? _a : c.lat) != null ? _b : null,
        lon: (_d = (_c = raw.lon) != null ? _c : c.lon) != null ? _d : null,
        last_used_at: lastUsed
      }).eq("id", c.id);
      await serviceClient.from("customer_delivery_addresses").delete().eq("id", raw.id);
    } else {
      await serviceClient.from("customer_delivery_addresses").update({ customer_profile_id: toProfileId }).eq("id", raw.id);
    }
  }
}

async function findAuthUserIdByEmail$4(serviceClient, email) {
  var _a;
  let page = 1;
  const perPage = 200;
  while (page <= 10) {
    const { data, error } = await serviceClient.auth.admin.listUsers({ page, perPage });
    if (error) return null;
    const users = (_a = data == null ? void 0 : data.users) != null ? _a : [];
    const hit = users.find((user) => (user.email || "").toLowerCase() === email.toLowerCase());
    if (hit == null ? void 0 : hit.id) return hit.id;
    if (users.length < perPage) break;
    page += 1;
  }
  return null;
}
async function ensureMaxCustomerProfile(event, maxUserId, maxConversationId) {
  var _a;
  const id = String(maxUserId || "").trim();
  if (!id) return null;
  const serviceClient = await serverSupabaseServiceRole(event);
  const { data: existing } = await serviceClient.from("profiles").select("id").eq("max_user_id", id).maybeSingle();
  if (existing == null ? void 0 : existing.id) return String(existing.id);
  const config = useRuntimeConfig();
  const syntheticEmail = `max_${id.replace(/[^a-zA-Z0-9._-]/g, "_")}@max.local`;
  const secret = config.sessionSecret || "max-session-secret";
  const syntheticPassword = crypto$1.createHash("sha256").update(`${id}:${secret}`).digest("hex");
  const conv = null;
  let userId = await findAuthUserIdByEmail$4(serviceClient, syntheticEmail);
  if (!userId) {
    const { data: createdUser, error: createUserError } = await serviceClient.auth.admin.createUser({
      email: syntheticEmail,
      password: syntheticPassword,
      email_confirm: true,
      user_metadata: { max_user_id: id }
    });
    if (createUserError || !((_a = createdUser == null ? void 0 : createdUser.user) == null ? void 0 : _a.id)) {
      const again = await findAuthUserIdByEmail$4(serviceClient, syntheticEmail);
      if (!again) {
        console.error("[ensureMaxCustomerProfile] createUser failed", createUserError);
        return null;
      }
      userId = again;
    } else {
      userId = createdUser.user.id;
    }
  }
  const { error: upsertError } = await serviceClient.from("profiles").upsert(
    {
      id: userId,
      max_user_id: id,
      max_conversation_id: conv
    },
    { onConflict: "id" }
  );
  if (upsertError) {
    console.error("[ensureMaxCustomerProfile] profiles upsert failed", upsertError);
    const { data: raced } = await serviceClient.from("profiles").select("id").eq("max_user_id", id).maybeSingle();
    return (raced == null ? void 0 : raced.id) ? String(raced.id) : null;
  }
  await serviceClient.auth.admin.updateUserById(userId, {
    user_metadata: { max_user_id: id, ...{} }
  }).catch(() => {
  });
  return userId;
}

async function findAuthUserIdByEmail$3(serviceClient, email) {
  var _a;
  let page = 1;
  const perPage = 200;
  while (page <= 10) {
    const { data, error } = await serviceClient.auth.admin.listUsers({ page, perPage });
    if (error) return null;
    const users = (_a = data == null ? void 0 : data.users) != null ? _a : [];
    const hit = users.find((user) => (user.email || "").toLowerCase() === email.toLowerCase());
    if (hit == null ? void 0 : hit.id) return hit.id;
    if (users.length < perPage) break;
    page += 1;
  }
  return null;
}
async function ensureTelegramCustomerProfile(event, telegramId) {
  var _a;
  if (!Number.isFinite(telegramId)) return null;
  const serviceClient = await serverSupabaseServiceRole(event);
  const { data: existingRows } = await serviceClient.from("profiles").select("id").eq("telegram_id", telegramId).limit(1);
  const existing = Array.isArray(existingRows) ? existingRows[0] : null;
  if (existing == null ? void 0 : existing.id) return String(existing.id);
  const config = useRuntimeConfig();
  const syntheticEmail = `tg_${telegramId}@telegram.local`;
  const secret = config.sessionSecret || "telegram-session-secret";
  const syntheticPassword = crypto$1.createHash("sha256").update(`${telegramId}:${secret}`).digest("hex");
  let userId = await findAuthUserIdByEmail$3(serviceClient, syntheticEmail);
  if (!userId) {
    const { data: createdUser, error: createUserError } = await serviceClient.auth.admin.createUser({
      email: syntheticEmail,
      password: syntheticPassword,
      email_confirm: true,
      user_metadata: { telegram_id: telegramId }
    });
    if (createUserError || !((_a = createdUser == null ? void 0 : createdUser.user) == null ? void 0 : _a.id)) {
      const again = await findAuthUserIdByEmail$3(serviceClient, syntheticEmail);
      if (!again) {
        console.error("[ensureTelegramCustomerProfile] createUser failed", createUserError);
        return null;
      }
      userId = again;
    } else {
      userId = createdUser.user.id;
    }
  }
  const { error: upsertError } = await serviceClient.from("profiles").upsert(
    {
      id: userId,
      telegram_id: telegramId
    },
    { onConflict: "id" }
  );
  if (upsertError) {
    console.error("[ensureTelegramCustomerProfile] profiles upsert failed", upsertError);
    const { data: raced } = await serviceClient.from("profiles").select("id").eq("telegram_id", telegramId).maybeSingle();
    return (raced == null ? void 0 : raced.id) ? String(raced.id) : null;
  }
  await serviceClient.auth.admin.updateUserById(userId, {
    user_metadata: { telegram_id: telegramId }
  }).catch(() => {
  });
  return userId;
}

function readInitDataFromEvent(event) {
  var _a, _b;
  const initDataMessenger = (_a = getHeader(event, "x-messenger-init-data")) == null ? void 0 : _a.trim();
  const initDataLegacy = (_b = getHeader(event, "x-telegram-init-data")) == null ? void 0 : _b.trim();
  return initDataMessenger || initDataLegacy || "";
}
async function collectTelegramValidationTokens(event, initData, botToken) {
  var _a;
  const config = useRuntimeConfig();
  const tenant = (_a = event.context) == null ? void 0 : _a.tenant;
  const tokens = uniqueNonEmptyTokens([
    tenant == null ? void 0 : tenant.telegramBotToken,
    botToken,
    config.botToken
  ]);
  const botId = extractBotIdFromInitData(initData);
  if (botId) {
    const shopByBot = await getShopByBotId(event, botId).catch(() => null);
    if (shopByBot == null ? void 0 : shopByBot.telegram_bot_token) {
      return uniqueNonEmptyTokens([...tokens, shopByBot.telegram_bot_token]);
    }
  }
  return tokens;
}
async function resolveTelegramProfileId(event, tgUser) {
  const client = await serverSupabaseServiceRole(event);
  const { data: profileRows } = await client.from("profiles").select("id").eq("telegram_id", tgUser.id).limit(1);
  const profile = Array.isArray(profileRows) ? profileRows[0] : null;
  if (profile == null ? void 0 : profile.id) return String(profile.id);
  const ensured = await ensureTelegramCustomerProfile(event, tgUser.id);
  if (ensured) return ensured;
  throw createError({ statusCode: 401, message: "Profile not found" });
}
async function resolveMaxProfileId(event, maxUser) {
  const client = await serverSupabaseServiceRole(event);
  const maxId = String(maxUser.id);
  const { data: profile } = await client.from("profiles").select("id").eq("max_user_id", maxId).maybeSingle();
  if (profile == null ? void 0 : profile.id) return String(profile.id);
  const ensured = await ensureMaxCustomerProfile(event, maxId);
  if (ensured) return ensured;
  throw createError({ statusCode: 401, message: "Profile not found" });
}
async function resolveProfileFromMessengerInitData(event, initData, botToken) {
  var _a, _b;
  const config = useRuntimeConfig();
  const tenant = (_a = event.context) == null ? void 0 : _a.tenant;
  const integrationKeys = (_b = tenant == null ? void 0 : tenant.integrationKeys) != null ? _b : {};
  const telegramTokens = await collectTelegramValidationTokens(event, initData, botToken);
  const tgUser = validateWebAppInitDataAnyToken(initData, telegramTokens);
  if (tgUser) {
    return resolveTelegramProfileId(event, tgUser);
  }
  const maxTok = getMaxBotTokenForShop(integrationKeys, {
    maxMiniAppBotToken: config.maxMiniAppBotToken,
    maxApiToken: config.maxApiToken
  });
  const maxTokens = uniqueNonEmptyTokens([
    typeof integrationKeys.max_bot_token === "string" ? integrationKeys.max_bot_token : void 0,
    config.maxMiniAppBotToken,
    config.maxApiToken
  ]);
  if (maxTok && maxTokens.length > 0) {
    const maxUser = validateWebAppInitDataAnyToken(initData, maxTokens);
    if (maxUser) {
      return resolveMaxProfileId(event, maxUser);
    }
  }
  return null;
}
async function resolveCustomerProfileId(event, botToken) {
  const initData = readInitDataFromEvent(event);
  if (initData) {
    const fromMessenger = await resolveProfileFromMessengerInitData(event, initData, botToken);
    if (fromMessenger) return fromMessenger;
    throw createError({ statusCode: 401, message: "Invalid initData" });
  }
  const supabaseUser = await serverSupabaseUser(event);
  if (supabaseUser) {
    const rawUser = supabaseUser;
    const userId = typeof rawUser.id === "string" ? rawUser.id : typeof rawUser.sub === "string" ? rawUser.sub : null;
    if (userId) return userId;
  }
  throw createError({ statusCode: 401, message: "Unauthorized" });
}

const DASHBOARD_ACCESS_TTL_MS = 15e3;
const dashboardAccessCache = /* @__PURE__ */ new Map();
function normalizeRole(input) {
  if (typeof input !== "string") return "owner";
  const value = input.trim().toLowerCase();
  return value === "manager" ? "manager" : "owner";
}
async function requireDashboardAccess(event) {
  var _a, _b, _c, _d;
  const supabaseUser = await serverSupabaseUser(event);
  if (!supabaseUser) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }
  const raw = supabaseUser;
  const userId = typeof raw.id === "string" ? raw.id : typeof raw.sub === "string" ? raw.sub : null;
  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }
  const now = Date.now();
  const cached = dashboardAccessCache.get(userId);
  if (cached && cached.expiresAt > now) {
    return cached.value;
  }
  const client = await serverSupabaseServiceRole(event);
  let shopId = null;
  let role = "owner";
  const { data: profileData, error: profileError } = await client.from("profiles").select("shop_id,role").eq("id", userId).maybeSingle();
  if (profileError && !/column .*role/i.test(profileError.message)) {
    throw createError({ statusCode: 500, statusMessage: "Failed to read profile" });
  }
  if (profileData == null ? void 0 : profileData.shop_id) {
    shopId = profileData.shop_id;
    role = normalizeRole(profileData.role);
  }
  if (!shopId) {
    const fallback = await client.from("profiles").select("shop_id").eq("id", userId).maybeSingle();
    if (fallback.error) {
      throw createError({ statusCode: 500, statusMessage: "Failed to read profile" });
    }
    if ((_a = fallback.data) == null ? void 0 : _a.shop_id) {
      shopId = fallback.data.shop_id;
      role = "owner";
    }
  }
  if (!shopId) {
    const metadataShopId = typeof ((_b = raw.user_metadata) == null ? void 0 : _b.active_shop_id) === "string" ? raw.user_metadata.active_shop_id.trim() : "";
    if (metadataShopId) {
      shopId = metadataShopId;
      role = normalizeRole((_c = raw.user_metadata) == null ? void 0 : _c.admin_role);
    }
  }
  if (!shopId) {
    const memberAccess = await client.from("shop_members").select("shop_id,role").eq("user_id", userId).order("created_at", { ascending: true }).limit(1).maybeSingle();
    if (memberAccess.error && !/relation .*shop_members.* does not exist/i.test(memberAccess.error.message)) {
      throw createError({ statusCode: 500, statusMessage: "Failed to read shop membership" });
    }
    if ((_d = memberAccess.data) == null ? void 0 : _d.shop_id) {
      shopId = memberAccess.data.shop_id;
      role = normalizeRole(memberAccess.data.role);
    }
  }
  if (!shopId) {
    throw createError({ statusCode: 403, statusMessage: "No shop access. Complete onboarding first." });
  }
  const value = { userId, shopId, role };
  dashboardAccessCache.set(userId, {
    value,
    expiresAt: now + DASHBOARD_ACCESS_TTL_MS
  });
  return value;
}

const dashboardOrderStatusLabels = {
  new: "\u041D\u043E\u0432\u044B\u0439",
  in_progress: "\u0412 \u0440\u0430\u0431\u043E\u0442\u0435",
  ready_for_pickup: "\u041D\u0430 \u0432\u044B\u0434\u0430\u0447\u0435",
  out_for_delivery: "\u0414\u043E\u0441\u0442\u0430\u0432\u043A\u0430",
  handed_to_customer: "\u0412\u044B\u0434\u0430\u043D",
  cancelled: "\u041E\u0442\u043C\u0435\u043D\u0451\u043D"
};
function normalizeDashboardStatus(raw) {
  const s = (raw || "new").toLowerCase().trim();
  if (s === "in_progress" || s === "in-progress") return "in_progress";
  if (s === "ready_for_pickup" || s === "ready-for-pickup") return "ready_for_pickup";
  if (s === "out_for_delivery" || s === "out-for-delivery") return "out_for_delivery";
  if (s === "handed_to_customer" || s === "handed-to-customer") return "handed_to_customer";
  if (s === "done" || s === "completed") return "handed_to_customer";
  if (s === "cancelled" || s === "canceled") return "cancelled";
  return "new";
}
function isDeliveryFulfillment(fulfillmentType) {
  return (fulfillmentType || "").toLowerCase() === "delivery";
}
function getAllowedOrderStatusTransitions(current, fulfillmentType) {
  const delivery = isDeliveryFulfillment(fulfillmentType);
  switch (current) {
    case "new":
      return ["in_progress", "cancelled"];
    case "in_progress":
      if (delivery) return ["out_for_delivery", "handed_to_customer", "cancelled"];
      return ["ready_for_pickup", "handed_to_customer", "cancelled"];
    case "ready_for_pickup":
      return ["handed_to_customer", "cancelled"];
    case "out_for_delivery":
      return ["handed_to_customer", "cancelled"];
    case "handed_to_customer":
    case "cancelled":
    default:
      return [];
  }
}

function normalizeOrderItemsJson(raw) {
  if (!Array.isArray(raw)) return [];
  const out = [];
  for (const row of raw) {
    if (!row || typeof row !== "object") continue;
    const r = row;
    const id = typeof r.id === "string" ? r.id : "";
    const name = typeof r.name === "string" ? r.name : "\u0422\u043E\u0432\u0430\u0440";
    const qty = typeof r.quantity === "number" && Number.isFinite(r.quantity) ? Math.max(0, Math.floor(r.quantity)) : 0;
    const price = typeof r.price === "number" && Number.isFinite(r.price) ? Math.round(r.price) : 0;
    if (!id || qty <= 0) continue;
    out.push({
      productId: id,
      name,
      quantity: qty,
      price,
      selectedParameters: Array.isArray(r.selectedParameters) ? r.selectedParameters : void 0,
      selectedModifiers: Array.isArray(r.selectedModifiers) ? r.selectedModifiers : void 0
    });
  }
  return out;
}
function parseOrderMetadata(metadata) {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    return { timeline: [], rest: {} };
  }
  const m = metadata;
  const tl = m.timeline;
  const timeline = [];
  if (Array.isArray(tl)) {
    for (const e of tl) {
      if (!e || typeof e !== "object") continue;
      const o = e;
      const at = typeof o.at === "string" ? o.at : "";
      const label = typeof o.label === "string" ? o.label : "";
      if (!at || !label) continue;
      timeline.push({
        at,
        label,
        from: typeof o.from === "string" ? o.from : void 0,
        to: typeof o.to === "string" ? o.to : void 0,
        source: typeof o.source === "string" ? o.source : void 0,
        userId: typeof o.userId === "string" ? o.userId : void 0,
        comment: typeof o.comment === "string" ? o.comment : o.comment === null ? null : void 0
      });
    }
  }
  const { timeline: _t, ...rest } = m;
  return { timeline, rest };
}
function mergeMetadataWithTimeline(metadata, entry) {
  const { timeline, rest } = parseOrderMetadata(metadata);
  return {
    ...rest,
    timeline: [...timeline, entry]
  };
}

const IMAGES = [
  "1544025162-d76694265947",
  "1555939594-58d7cb561ad1",
  "1565299624946-b28f40a0ae38",
  "1567620905732-2d1ec7ab7445",
  "1512058566846-da385a02827f",
  "1551218808-94e220ab6718",
  "1493770348161-369560ae357d",
  "1504674900800-33a096f7ad32",
  "1559339352-11d035aa65de",
  "1563379926898-05f4615a45da",
  "1571091718767-18b0059f8d3a",
  "1540189549336-e6e99c3679fe",
  "1562967914-608f82629710",
  "1556910103-1c02745aae4d"
];
function img(ix) {
  const id = IMAGES[ix % IMAGES.length];
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=80`;
}
function buildDemoStoryCampaigns(_shopId) {
  const slideCounts = [1, 2, 3, 4, 1, 2, 3];
  const titles = [
    "[DEMO] \u0411\u043E\u043D\u0443\u0441\u044B \u0437\u0430 \u043E\u0442\u0437\u044B\u0432",
    "[DEMO] \u041F\u043E\u0434\u0430\u0440\u043E\u043A \u043D\u0430 \u043F\u0435\u0440\u0432\u044B\u0439 \u0437\u0430\u043A\u0430\u0437",
    "[DEMO] \u041A\u044D\u0448\u0431\u044D\u043A",
    "[DEMO] \u0421\u0447\u0430\u0441\u0442\u043B\u0438\u0432\u044B\u0435 \u0447\u0430\u0441\u044B",
    "[DEMO] \u0421\u043A\u0438\u0434\u043A\u0430 \u0432 \u0434\u0435\u043D\u044C \u0440\u043E\u0436\u0434\u0435\u043D\u0438\u044F",
    "[DEMO] \u041D\u043E\u0432\u0438\u043D\u043A\u0438 \u043D\u0435\u0434\u0435\u043B\u0438",
    "[DEMO] \u0421\u0435\u0442\u044B \u043D\u0430 \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u044E"
  ];
  let imgCursor = 0;
  return slideCounts.map((n, g) => {
    var _a, _b, _c;
    const id = `demo-campaign-${g + 1}`;
    const placement = g < 4 ? "top_bar" : "catalog_grid";
    const slides = Array.from({ length: n }, (_, i) => {
      const url = img(imgCursor++);
      return {
        id: `demo-slide-${g + 1}-${i + 1}`,
        campaignId: id,
        sortOrder: i,
        mediaUrl: url,
        durationSeconds: 5,
        actionType: i === n - 1 ? "open_category" : "none",
        actionPayload: i === n - 1 ? { category: "\u041E\u0441\u043D\u043E\u0432\u043D\u044B\u0435 \u0431\u043B\u044E\u0434\u0430" } : {}
      };
    });
    return {
      id,
      title: (_a = titles[g]) != null ? _a : `[DEMO] \u0413\u0440\u0443\u043F\u043F\u0430 ${g + 1}`,
      previewUrl: (_c = (_b = slides[0]) == null ? void 0 : _b.mediaUrl) != null ? _c : null,
      placement,
      targeting: {},
      slides
    };
  });
}

function parseDependencies(raw) {
  if (!Array.isArray(raw)) return [];
  return raw.map((x) => typeof x === "string" ? x.trim() : "").filter(Boolean);
}
async function loadCatalog(event, code) {
  const client = await serverSupabaseServiceRole(event);
  const { data, error } = await client.from("feature_catalog").select("code,dependencies").eq("code", code).maybeSingle();
  if (error) {
    if (/relation .*feature_catalog.* does not exist/i.test(error.message)) return null;
    throw createError({ statusCode: 500, statusMessage: "Failed to read feature catalog" });
  }
  return data;
}
async function isFeatureEnabledDirect(event, shopId, code) {
  const client = await serverSupabaseServiceRole(event);
  const { data, error } = await client.from("shop_feature_subscriptions").select("enabled").eq("shop_id", shopId).eq("feature_code", code).maybeSingle();
  if (error) {
    if (/relation .*shop_feature_subscriptions.* does not exist/i.test(error.message)) return false;
    throw createError({ statusCode: 500, statusMessage: "Failed to read feature subscriptions" });
  }
  return (data == null ? void 0 : data.enabled) === true;
}
async function isShopFeatureEnabled(event, shopId, code) {
  const catalog = await loadCatalog(event, code);
  if (!catalog) return false;
  const enabled = await isFeatureEnabledDirect(event, shopId, code);
  if (!enabled) return false;
  const deps = parseDependencies(catalog.dependencies);
  for (const dep of deps) {
    const depEnabled = await isFeatureEnabledDirect(event, shopId, dep);
    if (!depEnabled) return false;
  }
  return true;
}
async function requireShopFeature(event, shopId, code) {
  const enabled = await isShopFeatureEnabled(event, shopId, code);
  if (!enabled) {
    throw createError({
      statusCode: 402,
      statusMessage: `Feature ${code} is disabled for this shop`
    });
  }
}

async function resolveFestivalOrThrow(event, festivalSlug) {
  const client = await serverSupabaseServiceRole(event);
  const { data, error } = await client.from("festivals").select("id,slug,starts_at,ends_at,is_active").eq("slug", festivalSlug).maybeSingle();
  if (error) {
    throw createError({ statusCode: 500, statusMessage: "Failed to resolve festival" });
  }
  if (!data) {
    throw createError({ statusCode: 404, statusMessage: "Festival not found" });
  }
  return data;
}
async function resolveCustomerIdentityOrThrow(event) {
  var _a;
  const config = useRuntimeConfig();
  const tenant = (_a = event.context) == null ? void 0 : _a.tenant;
  const botToken = typeof (tenant == null ? void 0 : tenant.telegramBotToken) === "string" && tenant.telegramBotToken.trim() ? tenant.telegramBotToken.trim() : String(config.botToken || "");
  const profileId = await resolveCustomerProfileId(event, botToken);
  const client = await serverSupabaseServiceRole(event);
  const { data: profile } = await client.from("profiles").select("telegram_id,max_user_id").eq("id", profileId).maybeSingle();
  return {
    profileId,
    telegramId: Number.isFinite(Number(profile == null ? void 0 : profile.telegram_id)) ? Number(profile == null ? void 0 : profile.telegram_id) : null,
    maxUserId: typeof (profile == null ? void 0 : profile.max_user_id) === "string" && String(profile.max_user_id).trim() ? String(profile.max_user_id).trim() : null
  };
}
async function isCustomerBannedForFestival(client, args) {
  const checks = [
    client.from("festival_ugc_bans").select("id").eq("festival_id", args.festivalId).eq("shop_id", args.shopId).eq("is_active", true).eq("profile_id", args.profileId).maybeSingle()
  ];
  if (args.telegramId) {
    checks.push(
      client.from("festival_ugc_bans").select("id").eq("festival_id", args.festivalId).eq("shop_id", args.shopId).eq("is_active", true).eq("telegram_id", args.telegramId).maybeSingle()
    );
  }
  if (args.maxUserId) {
    checks.push(
      client.from("festival_ugc_bans").select("id").eq("festival_id", args.festivalId).eq("shop_id", args.shopId).eq("is_active", true).eq("max_user_id", args.maxUserId).maybeSingle()
    );
  }
  const results = await Promise.all(checks);
  return results.some((x) => {
    var _a;
    return !x.error && !!((_a = x.data) == null ? void 0 : _a.id);
  });
}
async function loadEligibleFestivalOrders(client, args) {
  var _a;
  let query = client.from("orders").select("id,shop_id,restaurant_id,order_number,status,created_at,items,restaurants!inner(id,name,festival_id,shop_id)").eq("customer_profile_id", args.profileId).eq("restaurants.festival_id", args.festivalId).eq("status", "handed_to_customer").order("created_at", { ascending: false }).limit((_a = args.limit) != null ? _a : 20);
  if (args.shopId) {
    query = query.eq("shop_id", args.shopId);
  }
  const { data, error } = await query;
  if (error) {
    throw createError({ statusCode: 500, statusMessage: "Failed to load festival orders" });
  }
  return data != null ? data : [];
}

const TELEGRAM_API$1 = (token) => `https://api.telegram.org/bot${token}`;
async function telegram$1(token, method, body) {
  const res = await fetch(`${TELEGRAM_API$1(token)}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Telegram ${method}: ${res.status} ${text}`);
  }
  return res.json();
}
async function sendMaxMessage$2(baseUrl, token, options) {
  var _a;
  if (!options.conversationId) return;
  const res = await fetch(`${baseUrl.replace(/\/$/, "")}/messages`, {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      conversationId: options.conversationId,
      text: options.text,
      ...((_a = options.attachments) == null ? void 0 : _a.length) ? { attachments: options.attachments } : {}
    })
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`MAX sendMessage: ${res.status} ${text}`);
  }
}
function statusPatchByAction(action) {
  if (action === "approve_menu") return { status: "approved_menu", publishToMenu: true, publishToFeed: false };
  if (action === "approve_feed") return { status: "approved_feed", publishToMenu: false, publishToFeed: true };
  if (action === "approve_menu_and_feed") return { status: "approved_menu_and_feed", publishToMenu: true, publishToFeed: true };
  if (action === "forward_to_corner") return { status: "forwarded_to_corner", publishToMenu: false, publishToFeed: false };
  if (action === "shadow_ban") return { status: "shadow_banned", publishToMenu: false, publishToFeed: false };
  return { status: "rejected", publishToMenu: false, publishToFeed: false };
}
async function sendFestivalSubmissionToModeration(event, submissionId) {
  var _a, _b, _c, _d;
  const config = useRuntimeConfig(event);
  const client = await serverSupabaseServiceRole(event);
  const { data: submission } = await client.from("festival_ugc_submissions").select("id,festival_id,shop_id,restaurant_id,order_id,kind,rating,category,media_url,moderation_channel,moderation_chat_id").eq("id", submissionId).maybeSingle();
  if (!(submission == null ? void 0 : submission.id)) return;
  const { data: festival } = await client.from("festivals").select("name,slug").eq("id", submission.festival_id).maybeSingle();
  const { data: restaurant } = submission.restaurant_id ? await client.from("restaurants").select("name").eq("id", submission.restaurant_id).maybeSingle() : { data: null };
  const title = submission.kind === "story" ? "\u041D\u043E\u0432\u0430\u044F Live-\u0441\u0442\u043E\u0440\u0438\u0441" : "\u041D\u043E\u0432\u044B\u0439 \u0432\u0438\u0434\u0435\u043E\u043E\u0442\u0437\u044B\u0432";
  const lines = [
    `\u{1F3AC} ${title}`,
    `\u{1F3AA} \u0424\u0435\u0441\u0442\u0438\u0432\u0430\u043B\u044C: ${String((festival == null ? void 0 : festival.name) || (festival == null ? void 0 : festival.slug) || "festival")}`,
    `\u{1F3EA} \u041A\u043E\u0440\u043D\u0435\u0440: ${String((restaurant == null ? void 0 : restaurant.name) || "\u2014")}`,
    `\u{1F194} Submission: ${String(submission.id)}`,
    `\u2B50 \u0420\u0435\u0439\u0442\u0438\u043D\u0433: ${Number(submission.rating || 0) || "\u2014"}`,
    `\u{1F3F7} \u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044F: ${String(submission.category || "\u2014")}`
  ];
  const text = lines.join("\n");
  const chatId = String(submission.moderation_chat_id || "");
  const tgToken = String(((_b = (_a = event.context) == null ? void 0 : _a.tenant) == null ? void 0 : _b.telegramBotToken) || config.botToken || "");
  const maxBaseUrl = String(config.maxApiBaseUrl || "");
  const maxToken = String(config.maxApiToken || "");
  if (submission.moderation_channel === "telegram" && chatId && tgToken) {
    const keyboard = {
      inline_keyboard: [
        [
          { text: "\u{1F525} \u0412 \u043C\u0435\u043D\u044E", callback_data: `ugc:approve_menu:${submissionId}` },
          { text: "\u{1F31F} \u0412 \u043C\u0435\u043D\u044E + \u043B\u0435\u043D\u0442\u0430", callback_data: `ugc:approve_menu_and_feed:${submissionId}` }
        ],
        [
          { text: "\u{1F354} \u0415\u0434\u0430", callback_data: `ugc:tag_food:${submissionId}` },
          { text: "\u{1F3B8} \u0421\u0446\u0435\u043D\u0430", callback_data: `ugc:tag_stage:${submissionId}` },
          { text: "\u{1F46F} \u0412\u0430\u0439\u0431", callback_data: `ugc:tag_vibe:${submissionId}` }
        ],
        [
          { text: "\u2709\uFE0F \u041C\u0435\u043D\u0435\u0434\u0436\u0435\u0440\u0443", callback_data: `ugc:forward:${submissionId}` },
          { text: "\u274C \u041E\u0442\u043A\u043B\u043E\u043D\u0438\u0442\u044C", callback_data: `ugc:reject:${submissionId}` },
          { text: "\u{1F6D1} \u0411\u0430\u043D", callback_data: `ugc:ban:${submissionId}` }
        ]
      ]
    };
    const payload = {
      chat_id: chatId,
      text,
      reply_markup: keyboard
    };
    const mediaUrl = String(submission.media_url || "");
    const isVideo = /\.(mp4|webm|mov)(\?|$)/i.test(mediaUrl);
    if (isVideo) {
      payload.video = mediaUrl;
      payload.caption = text;
      delete payload.text;
      const res2 = await telegram$1(tgToken, "sendVideo", payload);
      const msgId2 = (_c = res2 == null ? void 0 : res2.result) == null ? void 0 : _c.message_id;
      if (msgId2) {
        await client.from("festival_ugc_submissions").update({ moderation_message_id: String(msgId2), updated_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", submissionId);
      }
      return;
    }
    const res = await telegram$1(tgToken, "sendMessage", payload);
    const msgId = (_d = res == null ? void 0 : res.result) == null ? void 0 : _d.message_id;
    if (msgId) {
      await client.from("festival_ugc_submissions").update({ moderation_message_id: String(msgId), updated_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", submissionId);
    }
    return;
  }
  if (submission.moderation_channel === "max" && chatId && maxBaseUrl && maxToken) {
    const commandHint = [
      "",
      "\u041A\u043E\u043C\u0430\u043D\u0434\u044B \u043C\u043E\u0434\u0435\u0440\u0430\u0446\u0438\u0438:",
      `ugc approve_menu ${submissionId}`,
      `ugc approve_menu_and_feed ${submissionId}`,
      `ugc tag_food ${submissionId}`,
      `ugc tag_stage ${submissionId}`,
      `ugc tag_vibe ${submissionId}`,
      `ugc forward ${submissionId}`,
      `ugc reject ${submissionId}`,
      `ugc ban ${submissionId}`
    ].join("\n");
    await sendMaxMessage$2(maxBaseUrl, maxToken, {
      conversationId: chatId,
      text: `${text}
${commandHint}`
    });
  }
}
async function applyFestivalModerationAction(event, args) {
  var _a, _b;
  const config = useRuntimeConfig(event);
  const client = await serverSupabaseServiceRole(event);
  const { data: submission } = await client.from("festival_ugc_submissions").select("id,festival_id,shop_id,restaurant_id,order_id,kind,rating,author_profile_id,author_telegram_id,author_max_user_id,media_url").eq("id", args.submissionId).maybeSingle();
  if (!(submission == null ? void 0 : submission.id)) {
    throw createError({ statusCode: 404, statusMessage: "Submission not found" });
  }
  if (args.action === "tag_category") {
    const category = args.category || null;
    const { error: tagError } = await client.from("festival_ugc_submissions").update({ category, updated_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", args.submissionId);
    if (tagError) {
      throw createError({ statusCode: 500, statusMessage: "Failed to tag submission" });
    }
    await client.from("festival_ugc_moderation_events").insert({
      submission_id: args.submissionId,
      festival_id: submission.festival_id,
      shop_id: submission.shop_id,
      action: "tag_category",
      action_payload: { category },
      actor_channel: args.actorChannel,
      actor_user_id: args.actorUserId
    });
    return { status: "pending" };
  }
  if (args.action === "shadow_ban") {
    await client.from("festival_ugc_bans").upsert({
      festival_id: submission.festival_id,
      shop_id: submission.shop_id,
      profile_id: submission.author_profile_id || null,
      telegram_id: submission.author_telegram_id || null,
      max_user_id: submission.author_max_user_id || null,
      reason: "moderator_shadow_ban",
      is_active: true,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }, { onConflict: "festival_id,shop_id,profile_id" });
  }
  const patch = statusPatchByAction(args.action);
  const updatePayload = {
    status: patch.status,
    publish_to_menu: patch.publishToMenu,
    publish_to_feed: patch.publishToFeed,
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  if (args.action === "forward_to_corner") {
    updatePayload.forwarded_to_restaurant_at = (/* @__PURE__ */ new Date()).toISOString();
  }
  const { error: updateError } = await client.from("festival_ugc_submissions").update(updatePayload).eq("id", args.submissionId);
  if (updateError) {
    throw createError({ statusCode: 500, statusMessage: "Failed to update submission status" });
  }
  await client.from("festival_ugc_moderation_events").insert({
    submission_id: args.submissionId,
    festival_id: submission.festival_id,
    shop_id: submission.shop_id,
    action: args.action,
    action_payload: {},
    actor_channel: args.actorChannel,
    actor_user_id: args.actorUserId
  });
  if (args.action === "forward_to_corner") {
    const { data: branch } = submission.restaurant_id ? await client.from("restaurants").select("name,manager_group_chat_id,manager_max_chat_id").eq("id", submission.restaurant_id).maybeSingle() : { data: null };
    const { data: festival } = await client.from("festivals").select("name").eq("id", submission.festival_id).maybeSingle();
    const text = [
      "\u26A0\uFE0F \u041D\u0435\u0433\u0430\u0442\u0438\u0432\u043D\u044B\u0439 UGC-\u043E\u0442\u0437\u044B\u0432",
      `\u{1F3AA} \u0424\u0435\u0441\u0442\u0438\u0432\u0430\u043B\u044C: ${String((festival == null ? void 0 : festival.name) || "festival")}`,
      `\u{1F3EA} \u041A\u043E\u0440\u043D\u0435\u0440: ${String((branch == null ? void 0 : branch.name) || "\u2014")}`,
      `\u{1F194} Submission: ${args.submissionId}`,
      `\u2B50 \u041E\u0446\u0435\u043D\u043A\u0430: ${Number(submission.rating || 0) || "\u2014"}`,
      "\u041F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430, \u043E\u0442\u0440\u0430\u0431\u043E\u0442\u0430\u0439\u0442\u0435 \u043F\u0440\u0435\u0442\u0435\u043D\u0437\u0438\u044E \u0441 \u043A\u043E\u043C\u0430\u043D\u0434\u043E\u0439 \u043A\u043E\u0440\u043D\u0435\u0440\u0430.",
      `\u041C\u0435\u0434\u0438\u0430: ${String(submission.media_url || "\u2014")}`
    ].join("\n");
    const tgChat = typeof (branch == null ? void 0 : branch.manager_group_chat_id) === "string" ? String(branch.manager_group_chat_id).trim() : "";
    const maxChat = typeof (branch == null ? void 0 : branch.manager_max_chat_id) === "string" ? String(branch.manager_max_chat_id).trim() : "";
    const tgToken = String(((_b = (_a = event.context) == null ? void 0 : _a.tenant) == null ? void 0 : _b.telegramBotToken) || config.botToken || "");
    const maxBase = String(config.maxApiBaseUrl || "");
    const maxToken = String(config.maxApiToken || "");
    if (tgChat && tgToken) {
      await telegram$1(tgToken, "sendMessage", { chat_id: tgChat, text }).catch(() => {
      });
    }
    if (maxChat && maxBase && maxToken) {
      await sendMaxMessage$2(maxBase, maxToken, { conversationId: maxChat, text }).catch(() => {
      });
    }
  }
  return { status: patch.status };
}

async function resolveCityBySlug(event, slug) {
  const normalized = slug.trim();
  if (!normalized) {
    throw createError({ statusCode: 400, statusMessage: "City slug is required" });
  }
  const client = await serverSupabaseClient(event);
  const { data, error } = await client.from("cities").select("id,name,slug,timezone,editorial_name,is_active").eq("slug", normalized).eq("is_active", true).maybeSingle();
  if (error) {
    console.error("[inuuCity] load failed:", error);
    throw createError({ statusCode: 500, statusMessage: "Failed to load city" });
  }
  if (!data) {
    throw createError({ statusCode: 404, statusMessage: "City not found" });
  }
  return data;
}

const BRANCH_MENU_CALLBACK_PREFIX = "brmenu__";
const BRANCH_CANCEL_CALLBACK_PREFIX = "brcancel__";
const BRANCH_PICK_CALLBACK_RE = /^br(\d+)__(.+)$/;
const ORDER_CONTACT_CALLBACK_PREFIX = "orderContact__";
function buildOrderContactCallback(orderId) {
  return `${ORDER_CONTACT_CALLBACK_PREFIX}${orderId}`;
}
function parseOrderContactCallback(data) {
  const trimmed = data.trim();
  if (!trimmed.startsWith(ORDER_CONTACT_CALLBACK_PREFIX)) return null;
  const orderId = trimmed.slice(ORDER_CONTACT_CALLBACK_PREFIX.length).trim();
  return orderId ? { orderId } : null;
}
function buildBranchMenuCallback(orderId) {
  return `${BRANCH_MENU_CALLBACK_PREFIX}${orderId}`;
}
function buildBranchCancelCallback(orderId) {
  return `${BRANCH_CANCEL_CALLBACK_PREFIX}${orderId}`;
}
function buildBranchPickCallback(branchIndex, orderId) {
  return `br${branchIndex}__${orderId}`;
}
function parseBranchCallback(data) {
  var _a;
  const trimmed = data.trim();
  if (trimmed.startsWith(BRANCH_MENU_CALLBACK_PREFIX)) {
    const orderId = trimmed.slice(BRANCH_MENU_CALLBACK_PREFIX.length).trim();
    return orderId ? { kind: "menu", orderId } : null;
  }
  if (trimmed.startsWith(BRANCH_CANCEL_CALLBACK_PREFIX)) {
    const orderId = trimmed.slice(BRANCH_CANCEL_CALLBACK_PREFIX.length).trim();
    return orderId ? { kind: "cancel", orderId } : null;
  }
  const pick = BRANCH_PICK_CALLBACK_RE.exec(trimmed);
  if (pick) {
    const branchIndex = Number(pick[1]);
    const orderId = (_a = pick[2]) == null ? void 0 : _a.trim();
    if (!orderId || !Number.isFinite(branchIndex) || branchIndex < 0 || branchIndex > 99) return null;
    return { kind: "pick", branchIndex: Math.floor(branchIndex), orderId };
  }
  return null;
}
const CUSTOMER_VISIBLE_ORDER_STATUSES = /* @__PURE__ */ new Set([
  "in_progress",
  "ready_for_pickup",
  "out_for_delivery",
  "handed_to_customer",
  "cancelled"
]);
function shouldNotifyCustomerOfStatus(status) {
  const normalized = status.trim().toLowerCase();
  return CUSTOMER_VISIBLE_ORDER_STATUSES.has(normalized);
}
function formatManagerCustomerLine(ctx) {
  const phone = typeof ctx.customerPhone === "string" ? ctx.customerPhone.trim() : "";
  const channel = ctx.orderClientChannel === "max_mini" ? "MAX" : ctx.orderClientChannel === "telegram_mini" ? "Telegram" : ctx.orderClientChannel === "web" ? "\u0421\u0430\u0439\u0442" : null;
  const idPart = ctx.customerMaxUserId ? `id:${ctx.customerMaxUserId}` : ctx.customerTelegramId && ctx.customerTelegramId > 0 ? `id:${ctx.customerTelegramId}` : null;
  if (phone && channel && idPart) return `${phone} \u2022 ${channel} ${idPart}`;
  if (phone && idPart) return `${phone} \u2022 ${idPart}`;
  if (phone) return phone;
  if (channel && idPart) return `${channel} ${idPart}`;
  if (idPart) return idPart;
  return "\u043A\u043E\u043D\u0442\u0430\u043A\u0442 \u0443\u0442\u043E\u0447\u043D\u044F\u0435\u0442\u0441\u044F";
}
function buildMaxManagerContactUrl(maxBotUrl, orderId) {
  const base = maxBotUrl.trim();
  if (!base) return null;
  const sep = base.includes("?") ? "&" : "?";
  return `${base}${sep}start=${encodeURIComponent(`ordercontact_${orderId}`)}`;
}
function isValidHttpUrl(raw) {
  const trimmed = raw.trim();
  return trimmed.startsWith("https://") || trimmed.startsWith("http://");
}
function appendManagerContactButtons(rows, ctx) {
  const phone = typeof ctx.customerPhone === "string" ? ctx.customerPhone.trim() : "";
  const isMaxClient = ctx.orderClientChannel === "max_mini";
  const contactLabel = phone ? "\u{1F4DE} \u041F\u043E\u0437\u0432\u043E\u043D\u0438\u0442\u044C" : isMaxClient ? "\u{1F4DE} \u0421\u0432\u044F\u0437\u0430\u0442\u044C\u0441\u044F (MAX)" : "\u{1F4DE} \u0417\u0430\u043F\u0440\u043E\u0441\u0438\u0442\u044C \u043D\u043E\u043C\u0435\u0440";
  rows.push([{ text: contactLabel, callback_data: buildOrderContactCallback(ctx.orderId) }]);
  const linkRow = [];
  if (isMaxClient && ctx.maxBotUrl && isValidHttpUrl(ctx.maxBotUrl)) {
    const maxUrl = buildMaxManagerContactUrl(ctx.maxBotUrl, ctx.orderId);
    if (maxUrl && isValidHttpUrl(maxUrl)) {
      linkRow.push({ text: "\u{1F4AC} \u041E\u0442\u043A\u0440\u044B\u0442\u044C MAX", url: maxUrl });
    }
  }
  if (ctx.allowTelegramUserLink && ctx.customerTelegramId && Number.isFinite(ctx.customerTelegramId) && ctx.customerTelegramId > 0) {
    linkRow.push({ text: "\u2709\uFE0F Telegram", url: `tg://user?id=${ctx.customerTelegramId}` });
  }
  if (linkRow.length) rows.push(linkRow);
}
function buildManagerOrderInlineKeyboard(options) {
  const {
    orderId,
    fulfillmentType,
    orderStatus,
    customerTelegramId,
    customerMaxUserId,
    customerPhone,
    orderClientChannel,
    maxBotUrl,
    allowTelegramUserLink = false,
    dashboardOrderUrl,
    etaButtonsEnabled,
    etaPresets = [],
    branchPickerEnabled = false
  } = options;
  const delivery = isDeliveryFulfillment(fulfillmentType);
  const status = (orderStatus || "new").toLowerCase();
  const rows = [];
  const contactRows = [];
  appendManagerContactButtons(contactRows, {
    orderId,
    customerTelegramId,
    customerPhone,
    orderClientChannel,
    maxBotUrl,
    allowTelegramUserLink
  });
  if (dashboardOrderUrl && isValidHttpUrl(dashboardOrderUrl)) {
    contactRows.push([{ text: "\u{1F4CB} \u041E\u0442\u043A\u0440\u044B\u0442\u044C \u0437\u0430\u043A\u0430\u0437", url: dashboardOrderUrl }]);
  }
  if (branchPickerEnabled) {
    rows.push([{ text: "\u{1F3EA} \u0421\u043C\u0435\u043D\u0438\u0442\u044C \u0444\u0438\u043B\u0438\u0430\u043B", callback_data: buildBranchMenuCallback(orderId) }]);
  }
  if (status === "new" || status === "in_progress" || status === "ready_for_pickup" || status === "out_for_delivery") {
    if (status === "new") {
      rows.push([
        { text: "\u{1F468}\u200D\u{1F373} \u041F\u0440\u0438\u043D\u044F\u0442\u044C \u0432 \u0440\u0430\u0431\u043E\u0442\u0443", callback_data: `work__${orderId}` },
        { text: "\u23F1 \u0417\u0430\u0434\u0435\u0440\u0436\u043A\u0430 (\u043A\u0443\u0445\u043D\u044F)", callback_data: `delayWork__${orderId}` }
      ]);
      if (etaButtonsEnabled && etaPresets.length) {
        rows.push(
          etaPresets.slice(0, 4).map((mins) => ({
            text: `\u231B ${mins} \u043C\u0438\u043D`,
            callback_data: `etaWork_${mins}_${orderId}`
          }))
        );
      }
    } else if (status === "in_progress") {
      if (delivery) {
        rows.push([
          { text: "\u{1F69A} \u041F\u0435\u0440\u0435\u0434\u0430\u0442\u044C \u043A\u0443\u0440\u044C\u0435\u0440\u0443", callback_data: `courier__${orderId}` },
          { text: "\u23F1 \u0417\u0430\u0434\u0435\u0440\u0436\u043A\u0430 (\u043A\u0443\u0445\u043D\u044F)", callback_data: `delayWork__${orderId}` }
        ]);
      } else {
        rows.push([
          { text: "\u{1F4E6} \u0413\u043E\u0442\u043E\u0432 \u043A \u0432\u044B\u0434\u0430\u0447\u0435", callback_data: `pickup__${orderId}` },
          { text: "\u23F1 \u0417\u0430\u0434\u0435\u0440\u0436\u043A\u0430 (\u043A\u0443\u0445\u043D\u044F)", callback_data: `delayWork__${orderId}` }
        ]);
      }
    } else if (status === "ready_for_pickup") {
      rows.push([{ text: "\u2705 \u0412\u044B\u0434\u0430\u043D \u043A\u043B\u0438\u0435\u043D\u0442\u0443", callback_data: `done__${orderId}` }]);
    } else if (status === "out_for_delivery") {
      rows.push([
        { text: "\u2705 \u0414\u043E\u0441\u0442\u0430\u0432\u043B\u0435\u043D", callback_data: `done__${orderId}` },
        { text: "\u23F1 \u0417\u0430\u0434\u0435\u0440\u0436\u043A\u0430 (\u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0430)", callback_data: `delayCourier__${orderId}` }
      ]);
    }
  }
  if (contactRows.length) rows.push(...contactRows);
  return { inline_keyboard: rows.filter((row) => row.length > 0) };
}
function buildOrderTransferredNoticeText(orderRef, targetBranchName) {
  return [
    `\u{1F500} \u0417\u0430\u043A\u0430\u0437 ${orderRef} \u043F\u0435\u0440\u0435\u043D\u0435\u0441\u0451\u043D \u043D\u0430 \u0444\u0438\u043B\u0438\u0430\u043B \xAB${targetBranchName}\xBB`,
    "\u041A\u0430\u0440\u0442\u043E\u0447\u043A\u0430 \u0437\u0430\u043A\u0430\u0437\u0430 \u0438 \u043A\u043D\u043E\u043F\u043A\u0438 \u0443\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u044F \u2014 \u0432 \u0447\u0430\u0442\u0435 \u043D\u0430\u0437\u043D\u0430\u0447\u0435\u043D\u043D\u043E\u0433\u043E \u0444\u0438\u043B\u0438\u0430\u043B\u0430."
  ].join("\n");
}
function formatBranchPickerButtonLabel(branchName, isCurrent) {
  const raw = branchName.trim() || "\u2014";
  const maxLen = isCurrent ? 28 : 32;
  const truncated = raw.length > maxLen ? `${raw.slice(0, maxLen - 1)}\u2026` : raw;
  return isCurrent ? `\u2713 ${truncated} (\u0441\u0435\u0439\u0447\u0430\u0441)` : truncated;
}
function buildBranchPickerInlineKeyboard(branches, orderId, currentBranchId) {
  const currentId = typeof currentBranchId === "string" ? currentBranchId.trim() : "";
  const rows = [];
  let row = [];
  branches.forEach((branch, index) => {
    const isCurrent = Boolean(currentId && branch.id === currentId);
    const label = formatBranchPickerButtonLabel(branch.name, isCurrent);
    row.push({ text: label, callback_data: buildBranchPickCallback(index, orderId) });
    if (row.length >= 2) {
      rows.push(row);
      row = [];
    }
  });
  if (row.length) rows.push(row);
  rows.push([{ text: "\u21A9\uFE0F \u041D\u0430\u0437\u0430\u0434", callback_data: buildBranchCancelCallback(orderId) }]);
  return { inline_keyboard: rows };
}
function mapChatCallbackToOrderStatus(callbackStatus) {
  if (callbackStatus === "work") return "in_progress";
  if (callbackStatus === "courier") return "out_for_delivery";
  if (callbackStatus === "pickup") return "ready_for_pickup";
  return "handed_to_customer";
}
function buildCustomerStatusShortText(orderRef, status, fulfillmentType) {
  if (!shouldNotifyCustomerOfStatus(status)) return null;
  const delivery = isDeliveryFulfillment(fulfillmentType);
  if (status === "in_progress") {
    return `\u{1F468}\u200D\u{1F373} \u0412\u0430\u0448 \u0437\u0430\u043A\u0430\u0437 ${orderRef} \u043F\u0440\u0438\u043D\u044F\u0442 \u0432 \u0440\u0430\u0431\u043E\u0442\u0443. \u041A\u0443\u0445\u043D\u044F \u0443\u0436\u0435 \u0433\u043E\u0442\u043E\u0432\u0438\u0442 \u0432\u0430\u0448 \u0437\u0430\u043A\u0430\u0437.`;
  }
  if (status === "ready_for_pickup") {
    return `\u{1F4E6} \u0412\u0430\u0448 \u0437\u0430\u043A\u0430\u0437 ${orderRef} \u0433\u043E\u0442\u043E\u0432 \u043A \u0432\u044B\u0434\u0430\u0447\u0435. \u041C\u043E\u0436\u043D\u043E \u0437\u0430\u0431\u0438\u0440\u0430\u0442\u044C.`;
  }
  if (status === "out_for_delivery") {
    return `\u{1F69A} \u0412\u0430\u0448 \u0437\u0430\u043A\u0430\u0437 ${orderRef} \u043F\u0435\u0440\u0435\u0434\u0430\u043D \u043A\u0443\u0440\u044C\u0435\u0440\u0443 \u0438 \u0443\u0436\u0435 \u0432 \u043F\u0443\u0442\u0438.`;
  }
  if (status === "handed_to_customer") {
    return delivery ? `\u2705 \u0412\u0430\u0448 \u0437\u0430\u043A\u0430\u0437 ${orderRef} \u0434\u043E\u0441\u0442\u0430\u0432\u043B\u0435\u043D. \u0421\u043F\u0430\u0441\u0438\u0431\u043E, \u0447\u0442\u043E \u0432\u044B\u0431\u0440\u0430\u043B\u0438 \u043D\u0430\u0441! \u041F\u0440\u0438\u044F\u0442\u043D\u043E\u0433\u043E \u0430\u043F\u043F\u0435\u0442\u0438\u0442\u0430 \u{1F958}\u{1F363}\u{1F35C}` : `\u2705 \u0412\u0430\u0448 \u0437\u0430\u043A\u0430\u0437 ${orderRef} \u0432\u044B\u0434\u0430\u043D. \u0421\u043F\u0430\u0441\u0438\u0431\u043E, \u0447\u0442\u043E \u0432\u044B\u0431\u0440\u0430\u043B\u0438 \u043D\u0430\u0441! \u041F\u0440\u0438\u044F\u0442\u043D\u043E\u0433\u043E \u0430\u043F\u043F\u0435\u0442\u0438\u0442\u0430 \u{1F958}\u{1F363}\u{1F35C}`;
  }
  if (status === "cancelled") {
    return `\u274C \u0417\u0430\u043A\u0430\u0437 ${orderRef} \u043E\u0442\u043C\u0435\u043D\u0451\u043D. \u0415\u0441\u043B\u0438 \u044D\u0442\u043E \u043E\u0448\u0438\u0431\u043A\u0430 \u2014 \u043D\u0430\u043F\u0438\u0448\u0438\u0442\u0435 \u043D\u0430\u043C.`;
  }
  return null;
}

async function loadActiveShopBranches(event, shopId) {
  const client = await serverSupabaseServiceRole(event);
  const { data, error } = await client.from("restaurants").select("id,name,address,manager_group_chat_id").eq("shop_id", shopId).eq("is_active", true).order("name", { ascending: true });
  if (error) {
    console.error("loadActiveShopBranches:", error);
    return [];
  }
  return (data != null ? data : []).map((row) => ({
    id: String(row.id),
    name: String(row.name || "\u2014"),
    address: typeof row.address === "string" ? row.address : null,
    managerGroupChatId: typeof row.manager_group_chat_id === "string" && row.manager_group_chat_id.trim() ? row.manager_group_chat_id.trim() : null
  }));
}
async function canManageOrderFromManagerChat(event, shopId, chatId) {
  const normalizedChatId = chatId.trim();
  if (!normalizedChatId) return false;
  const client = await serverSupabaseServiceRole(event);
  const { data: shop } = await client.from("shops").select("manager_chat_id").eq("id", shopId).maybeSingle();
  const centralChatId = typeof (shop == null ? void 0 : shop.manager_chat_id) === "string" ? String(shop.manager_chat_id).trim() : "";
  if (centralChatId && centralChatId === normalizedChatId) return true;
  const branches = await loadActiveShopBranches(event, shopId);
  return branches.some((b) => b.managerGroupChatId === normalizedChatId);
}
async function assignOrderBranchFromChat(event, args) {
  var _a;
  const client = await serverSupabaseServiceRole(event);
  const { data: order } = await client.from("orders").select("id,shop_id,restaurant_id,status,order_number").eq("id", args.orderId).maybeSingle();
  if (!order) return { ok: false, reason: "order_not_found" };
  const shopId = String(order.shop_id);
  const allowed = await canManageOrderFromManagerChat(event, shopId, args.managerChatId);
  if (!allowed) return { ok: false, reason: "forbidden" };
  const branches = await loadActiveShopBranches(event, shopId);
  const target = branches[args.branchIndex];
  if (!target) return { ok: false, reason: "branch_not_found" };
  const previousBranchId = order.restaurant_id ? String(order.restaurant_id) : null;
  if (previousBranchId === target.id) return { ok: false, reason: "same_branch" };
  const now = (/* @__PURE__ */ new Date()).toISOString();
  await client.from("orders").update({ restaurant_id: target.id, updated_at: now }).eq("id", args.orderId).eq("shop_id", shopId);
  const prevName = previousBranchId ? ((_a = branches.find((b) => b.id === previousBranchId)) == null ? void 0 : _a.name) || previousBranchId : "\u2014";
  await appendOrderTimelineEntry(event, {
    orderId: args.orderId,
    shopId,
    label: `\u0424\u0438\u043B\u0438\u0430\u043B \u043F\u0435\u0440\u0435\u043D\u0430\u0437\u043D\u0430\u0447\u0435\u043D \u0438\u0437 \u0447\u0430\u0442\u0430: ${prevName} \u2192 ${target.name}`,
    source: args.source,
    userId: args.actorUserId,
    comment: null
  });
  return {
    ok: true,
    branchName: target.name,
    branchAddress: target.address || "\u0410\u0434\u0440\u0435\u0441 \u043D\u0435 \u0443\u043A\u0430\u0437\u0430\u043D",
    branchId: target.id,
    previousBranchId
  };
}

async function getUnifiedFlowConfig(event, restaurantId) {
  var _a;
  const client = await serverSupabaseServiceRole(event);
  const { data: restaurant } = await client.from("restaurants").select("integration_keys").eq("id", restaurantId).maybeSingle();
  const keys = (restaurant == null ? void 0 : restaurant.integration_keys) && typeof restaurant.integration_keys === "object" ? restaurant.integration_keys : {};
  const rawPresets = Array.isArray(keys.eta_presets) ? keys.eta_presets : [10, 15, 20, 30, 45];
  const etaPresets = rawPresets.map((value) => Number(value)).filter((value) => Number.isFinite(value) && value > 0).map((value) => Math.floor(value)).slice(0, 8);
  const rateLimitRaw = Number((_a = keys.eta_rate_limit_sec) != null ? _a : 180);
  const etaRateLimitSec = Number.isFinite(rateLimitRaw) ? Math.min(3600, Math.max(30, Math.floor(rateLimitRaw))) : 180;
  return {
    unifiedOrderFlowEnabled: true,
    etaButtonsEnabled: Boolean(keys.eta_buttons_enabled),
    etaPresets: etaPresets.length ? etaPresets : [10, 15, 20, 30, 45],
    etaRateLimitSec
  };
}
async function appendOrderTimelineEntry(event, args) {
  var _a;
  const client = await serverSupabaseServiceRole(event);
  const { data: order } = await client.from("orders").select("metadata").eq("id", args.orderId).eq("shop_id", args.shopId).maybeSingle();
  if (!order) return;
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const entry = {
    at: now,
    label: args.label,
    source: args.source,
    userId: args.userId || void 0,
    comment: (_a = args.comment) != null ? _a : null
  };
  const metadataNext = mergeMetadataWithTimeline(order.metadata, entry);
  await client.from("orders").update({ metadata: metadataNext, updated_at: now }).eq("id", args.orderId).eq("shop_id", args.shopId);
}
async function applyOrderStatusFromChat(event, args) {
  var _a;
  const client = await serverSupabaseServiceRole(event);
  const { data: order } = await client.from("orders").select("id,shop_id,restaurant_id,city_id,order_number,total,status,fulfillment_type,customer_telegram_id,customer_profile_id,metadata").eq("id", args.orderId).maybeSingle();
  if (!order) return;
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const entry = {
    at: now,
    label: `\u0421\u0442\u0430\u0442\u0443\u0441 \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D \u0438\u0437 \u0447\u0430\u0442\u0430: ${order.status || "new"} \u2192 ${args.status}`,
    from: String(order.status || "new"),
    to: args.status,
    source: args.source,
    userId: args.actorUserId,
    comment: null
  };
  const metadataNext = mergeMetadataWithTimeline(order.metadata, entry);
  await client.from("orders").update({ status: args.status, metadata: metadataNext, updated_at: now }).eq("id", args.orderId).eq("shop_id", order.shop_id);
  let customerMaxUserId = null;
  let customerMaxConversationId = null;
  const customerProfileId = (order == null ? void 0 : order.customer_profile_id) ? String(order.customer_profile_id) : "";
  if (customerProfileId) {
    const { data: profile } = await client.from("profiles").select("max_user_id,max_conversation_id").eq("id", customerProfileId).maybeSingle();
    const rawUserId = profile == null ? void 0 : profile.max_user_id;
    const rawConversationId = profile == null ? void 0 : profile.max_conversation_id;
    customerMaxUserId = typeof rawUserId === "string" && rawUserId.trim() ? rawUserId.trim() : null;
    customerMaxConversationId = typeof rawConversationId === "string" && rawConversationId.trim() ? rawConversationId.trim() : null;
  }
  if (shouldNotifyCustomerOfStatus(args.status)) {
    await dispatchNotificationEvent(event, {
      eventId: crypto$1.randomUUID(),
      eventType: "ORDER_STATUS_CHANGED",
      occurredAt: now,
      tenantContext: {
        shopId: String(order.shop_id),
        restaurantId: String(order.restaurant_id || ""),
        cityId: order.city_id ? String(order.city_id) : null
      },
      orderContext: {
        orderId: String(order.id),
        orderNumber: String(order.order_number || order.id).slice(0, 32),
        totalAmount: Number(order.total || 0),
        status: args.status,
        fulfillmentType: String(order.fulfillment_type || "delivery")
      },
      actorContext: {
        customerTelegramId: (_a = order.customer_telegram_id) != null ? _a : null,
        customerMaxUserId,
        customerMaxConversationId
      }
    });
  }
}

async function loadOrderCustomerContact(event, orderId, options) {
  const includePhone = (options == null ? void 0 : options.includePhone) === true;
  const client = await serverSupabaseServiceRole(event);
  const { data: order, error: orderError } = await client.from("orders").select("id,shop_id,restaurant_id,order_number,customer_telegram_id,customer_profile_id,order_client_channel").eq("id", orderId).maybeSingle();
  if (orderError) {
    console.error("loadOrderCustomerContact order query:", orderError);
  }
  if (!order) return null;
  const shopId = String(order.shop_id);
  const restaurantId = String(order.restaurant_id || "");
  const customerProfileId = typeof order.customer_profile_id === "string" && order.customer_profile_id.trim() ? String(order.customer_profile_id).trim() : null;
  let customerMaxUserId = null;
  let customerMaxConversationId = null;
  let customerPhone = "";
  if (customerProfileId) {
    if (includePhone) {
      try {
        customerPhone = await getProfilePhone(client, customerProfileId);
      } catch (err) {
        console.error("loadOrderCustomerContact getProfilePhone:", err);
      }
    }
    try {
      const { data: profile, error: profileError } = await client.from("profiles").select("max_user_id,max_conversation_id,telegram_id").eq("id", customerProfileId).maybeSingle();
      if (profileError) {
        console.error("loadOrderCustomerContact profile query:", profileError);
      } else {
        const rawMax = profile == null ? void 0 : profile.max_user_id;
        const rawConv = profile == null ? void 0 : profile.max_conversation_id;
        customerMaxUserId = typeof rawMax === "string" && rawMax.trim() ? rawMax.trim() : null;
        customerMaxConversationId = typeof rawConv === "string" && rawConv.trim() ? rawConv.trim() : null;
      }
    } catch (err) {
      console.error("loadOrderCustomerContact profile load:", err);
    }
  }
  const tgRaw = Number(order.customer_telegram_id);
  const customerTelegramId = Number.isFinite(tgRaw) && tgRaw > 0 ? Math.floor(tgRaw) : null;
  const { data: restaurant } = restaurantId ? await client.from("restaurants").select("name").eq("id", restaurantId).maybeSingle() : { data: null };
  const channelRaw = String(order.order_client_channel || "").trim().toLowerCase();
  const orderClientChannel = channelRaw === "telegram_mini" || channelRaw === "max_mini" || channelRaw === "web" ? channelRaw : null;
  return {
    orderId,
    shopId,
    restaurantId,
    orderNumber: typeof order.order_number === "string" ? order.order_number : null,
    orderClientChannel,
    customerProfileId,
    customerTelegramId,
    customerMaxUserId,
    customerMaxConversationId,
    customerPhone,
    restaurantName: String((restaurant == null ? void 0 : restaurant.name) || "\u0420\u0435\u0441\u0442\u043E\u0440\u0430\u043D")
  };
}
function orderContactToKeyboardContext(contact, options) {
  var _a;
  return {
    orderId: contact.orderId,
    customerTelegramId: contact.customerTelegramId,
    customerMaxUserId: contact.customerMaxUserId,
    customerPhone: contact.customerPhone || null,
    orderClientChannel: contact.orderClientChannel,
    maxBotUrl: (_a = options == null ? void 0 : options.maxBotUrl) != null ? _a : null,
    allowTelegramUserLink: (options == null ? void 0 : options.allowTelegramUserLink) === true
  };
}
async function requestCustomerContactForOrder(event, contact, options) {
  var _a;
  const restaurantLabel = contact.restaurantName;
  const knownPhone = ((_a = contact.customerPhone) == null ? void 0 : _a.trim()) || "";
  const contactRequestText = knownPhone ? `\u041C\u0435\u043D\u0435\u0434\u0436\u0435\u0440 \u0440\u0435\u0441\u0442\u043E\u0440\u0430\u043D\u0430 \xAB${restaurantLabel}\xBB \u0445\u043E\u0447\u0435\u0442 \u0441\u0432\u044F\u0437\u0430\u0442\u044C\u0441\u044F \u0441 \u0432\u0430\u043C\u0438 \u043F\u043E \u0437\u0430\u043A\u0430\u0437\u0443. \u0412\u0430\u0448 \u043D\u043E\u043C\u0435\u0440 \u0443\u0436\u0435 \u0441\u043E\u0445\u0440\u0430\u043D\u0451\u043D: ${knownPhone}.` : `\u041C\u0435\u043D\u0435\u0434\u0436\u0435\u0440 \u0440\u0435\u0441\u0442\u043E\u0440\u0430\u043D\u0430 \xAB${restaurantLabel}\xBB \u0445\u043E\u0447\u0435\u0442 \u0441\u0432\u044F\u0437\u0430\u0442\u044C\u0441\u044F \u0441 \u0432\u0430\u043C\u0438 \u043F\u043E \u0437\u0430\u043A\u0430\u0437\u0443. \u041F\u043E\u0434\u0435\u043B\u0438\u0442\u0435\u0441\u044C \u043D\u043E\u043C\u0435\u0440\u043E\u043C \u0442\u0435\u043B\u0435\u0444\u043E\u043D\u0430?`;
  let requestSent = false;
  const botToken = options.botToken.trim();
  if (contact.customerTelegramId && botToken) {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: contact.customerTelegramId,
        text: contactRequestText,
        ...knownPhone ? {} : {
          reply_markup: {
            keyboard: [[{ text: "\u041F\u043E\u0434\u0435\u043B\u0438\u0442\u044C\u0441\u044F \u043D\u043E\u043C\u0435\u0440\u043E\u043C", request_contact: true }]],
            resize_keyboard: true,
            one_time_keyboard: true
          }
        }
      })
    }).catch(() => {
    });
    requestSent = true;
  }
  const maxBaseUrl = String(options.maxBaseUrl || "").replace(/\/$/, "");
  const maxToken = String(options.maxToken || "").trim();
  const hasMaxConversation = typeof contact.customerMaxConversationId === "string" && contact.customerMaxConversationId.trim();
  const hasMaxUserId = typeof contact.customerMaxUserId === "string" && contact.customerMaxUserId.trim();
  if ((hasMaxConversation || hasMaxUserId) && maxBaseUrl && maxToken) {
    const attachments = !knownPhone ? [{
      type: "inline_keyboard",
      payload: { buttons: [[{ type: "request_contact", text: "\u041F\u043E\u0434\u0435\u043B\u0438\u0442\u044C\u0441\u044F \u043D\u043E\u043C\u0435\u0440\u043E\u043C" }]] }
    }] : void 0;
    const url = hasMaxConversation ? `${maxBaseUrl}/messages` : `${maxBaseUrl}/messages?user_id=${encodeURIComponent(String(contact.customerMaxUserId))}`;
    await fetch(url, {
      method: "POST",
      headers: {
        Authorization: maxToken,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...hasMaxConversation ? { conversationId: contact.customerMaxConversationId } : {},
        text: contactRequestText,
        ...attachments ? { attachments } : {}
      })
    }).catch(() => {
    });
    requestSent = true;
  }
  return { phoneShown: knownPhone || null, requestSent };
}
async function handleTelegramOrderContactCallback(event, args) {
  const contact = await loadOrderCustomerContact(event, args.orderId, { includePhone: true });
  if (!contact) {
    return { alertText: "\u0417\u0430\u043A\u0430\u0437 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D", showAlert: true };
  }
  if (args.managerChatId && !await canManageOrderFromManagerChat(event, contact.shopId, args.managerChatId)) {
    return { alertText: "\u041D\u0435\u0442 \u0434\u043E\u0441\u0442\u0443\u043F\u0430 \u043A \u044D\u0442\u043E\u043C\u0443 \u0437\u0430\u043A\u0430\u0437\u0443", showAlert: true };
  }
  if (contact.customerPhone) {
    return { alertText: `\u0422\u0435\u043B\u0435\u0444\u043E\u043D \u043A\u043B\u0438\u0435\u043D\u0442\u0430:
${contact.customerPhone}`, showAlert: true };
  }
  const config = useRuntimeConfig(event);
  const maxBaseUrl = String(config.maxApiBaseUrl || "");
  const maxToken = String(config.maxApiToken || "");
  const { requestSent } = await requestCustomerContactForOrder(event, contact, {
    botToken: args.botToken,
    maxBaseUrl,
    maxToken
  });
  if (!requestSent) {
    const hint = formatManagerCustomerLine(orderContactToKeyboardContext(contact));
    return {
      alertText: `\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u0437\u0430\u043F\u0440\u043E\u0441 \u043A\u043E\u043D\u0442\u0430\u043A\u0442\u0430.
${hint}`,
      showAlert: true
    };
  }
  const channelHint = contact.orderClientChannel === "max_mini" ? "\u041A\u043B\u0438\u0435\u043D\u0442 \u043E\u0444\u043E\u0440\u043C\u0438\u043B \u0437\u0430\u043A\u0430\u0437 \u0432 MAX \u2014 \u0437\u0430\u043F\u0440\u043E\u0441 \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D \u0432 MAX." : contact.orderClientChannel === "telegram_mini" ? "\u0417\u0430\u043F\u0440\u043E\u0441 \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D \u043A\u043B\u0438\u0435\u043D\u0442\u0443 \u0432 Telegram." : "\u0417\u0430\u043F\u0440\u043E\u0441 \u043A\u043E\u043D\u0442\u0430\u043A\u0442\u0430 \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D \u043A\u043B\u0438\u0435\u043D\u0442\u0443.";
  return { alertText: channelHint, showAlert: false };
}
async function enrichManagerKeyboardFromOrder(event, base) {
  var _a, _b, _c, _d, _e;
  const config = useRuntimeConfig(event);
  const maxBotUrl = String(((_a = config.public) == null ? void 0 : _a.maxBotUrl) || "").trim();
  const contact = await loadOrderCustomerContact(event, base.orderId);
  const ctx = contact ? orderContactToKeyboardContext(contact, {
    maxBotUrl,
    allowTelegramUserLink: base.allowTelegramUserLink === true
  }) : null;
  return {
    orderId: base.orderId,
    fulfillmentType: base.fulfillmentType,
    orderStatus: base.orderStatus,
    customerTelegramId: (_b = ctx == null ? void 0 : ctx.customerTelegramId) != null ? _b : null,
    customerMaxUserId: (_c = ctx == null ? void 0 : ctx.customerMaxUserId) != null ? _c : null,
    customerPhone: (_d = ctx == null ? void 0 : ctx.customerPhone) != null ? _d : null,
    orderClientChannel: (_e = ctx == null ? void 0 : ctx.orderClientChannel) != null ? _e : null,
    maxBotUrl,
    allowTelegramUserLink: base.allowTelegramUserLink === true,
    dashboardOrderUrl: base.dashboardOrderUrl,
    etaButtonsEnabled: base.etaButtonsEnabled,
    etaPresets: base.etaPresets,
    branchPickerEnabled: base.branchPickerEnabled
  };
}

function formatOrderRef$3(orderNumber, orderId) {
  const raw = orderNumber.trim() || orderId.trim();
  const normalized = raw.replace(/\s+/g, "");
  const short = normalized.length > 8 ? normalized.slice(0, 8) : normalized;
  return `#${short || "\u2014"}`;
}
function formatRub$1(value) {
  return `${new Intl.NumberFormat("ru-RU").format(value)} \u20BD`;
}
function formatItems$1(items) {
  if (!Array.isArray(items) || !items.length) return ["\u2022 \u0421\u043E\u0441\u0442\u0430\u0432 \u0432\u0440\u0435\u043C\u0435\u043D\u043D\u043E \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D"];
  const lines = [];
  for (const item of items.slice(0, 15)) {
    const name = typeof item.name === "string" && item.name.trim() ? item.name.trim() : "\u041F\u043E\u0437\u0438\u0446\u0438\u044F";
    const qty = Number(item.quantity || 0) > 0 ? Number(item.quantity) : 1;
    const price = Number(item.price || 0);
    lines.push(`\u2022 ${name} \xD7 ${qty} \u2014 ${formatRub$1(price * qty)}`);
  }
  if (items.length > 15) lines.push(`\u2026 \u0438 \u0435\u0449\u0451 ${items.length - 15} \u043F\u043E\u0437.`);
  return lines;
}
function getPaymentLine$1(order) {
  const method = order.paymentMethod.trim().toLowerCase();
  const status = order.paymentStatus.trim().toLowerCase();
  if (method === "online") {
    return status === "paid" ? "\u{1F4B8} \u0421\u043F\u043E\u0441\u043E\u0431 \u043E\u043F\u043B\u0430\u0442\u044B: \u041E\u043D\u043B\u0430\u0439\u043D (\u043E\u043F\u043B\u0430\u0447\u0435\u043D)" : "\u{1F4B8} \u0421\u043F\u043E\u0441\u043E\u0431 \u043E\u043F\u043B\u0430\u0442\u044B: \u041E\u043D\u043B\u0430\u0439\u043D (\u043E\u0436\u0438\u0434\u0430\u0435\u0442 \u043E\u043F\u043B\u0430\u0442\u044B)";
  }
  if (method === "card") return "\u{1F4B8} \u0421\u043F\u043E\u0441\u043E\u0431 \u043E\u043F\u043B\u0430\u0442\u044B: \u041A\u0430\u0440\u0442\u043E\u0439 \u043F\u0440\u0438 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u0438";
  if (method === "cash") return "\u{1F4B8} \u0421\u043F\u043E\u0441\u043E\u0431 \u043E\u043F\u043B\u0430\u0442\u044B: \u041D\u0430\u043B\u0438\u0447\u043D\u044B\u043C\u0438 \u043F\u0440\u0438 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u0438";
  return `\u{1F4B8} \u0421\u043F\u043E\u0441\u043E\u0431 \u043E\u043F\u043B\u0430\u0442\u044B: ${order.paymentMethod || "\u041D\u0435 \u0443\u043A\u0430\u0437\u0430\u043D"}`;
}
function buildMoneyBlock$1(order) {
  const lines = [
    `\u{1F4B0} \u0422\u043E\u0432\u0430\u0440\u044B: ${formatRub$1(order.subtotal)}`,
    `\u{1F69A} \u0414\u043E\u0441\u0442\u0430\u0432\u043A\u0430: ${formatRub$1(order.deliveryCost)}`
  ];
  if (order.discountAmount > 0) lines.push(`\u{1F381} \u0421\u043A\u0438\u0434\u043A\u0430: \u2212${formatRub$1(order.discountAmount)}`);
  if (order.bonusSpent > 0) lines.push(`\u2B50 \u0411\u043E\u043D\u0443\u0441\u044B: \u2212${formatRub$1(order.bonusSpent)}`);
  if (order.promoCode) lines.push(`\u{1F3F7} \u041F\u0440\u043E\u043C\u043E\u043A\u043E\u0434: ${order.promoCode}`);
  lines.push(`\u{1F4B3} \u0418\u0442\u043E\u0433\u043E: ${formatRub$1(order.total)}`);
  lines.push(getPaymentLine$1(order));
  return lines;
}
function buildFulfillmentBlock$1(order) {
  const lines = [];
  if (order.fulfillmentType === "pickup") {
    lines.push("\u{1F3EC} \u041F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u0435: \u0421\u0430\u043C\u043E\u0432\u044B\u0432\u043E\u0437");
    if (order.pickupPointName || order.pickupPointAddress) {
      lines.push(`\u041F\u0443\u043D\u043A\u0442: ${[order.pickupPointName, order.pickupPointAddress].filter(Boolean).join(", ")}`);
    }
  } else {
    lines.push("\u{1F69A} \u041F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u0435: \u0414\u043E\u0441\u0442\u0430\u0432\u043A\u0430");
    if (order.addressLine) {
      lines.push(`\u0410\u0434\u0440\u0435\u0441: ${[order.addressLine, order.addressFlat].filter(Boolean).join(", ")}`);
    }
  }
  if (order.addressComment) lines.push(`\u{1F4DD} \u041A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0439: ${order.addressComment}`);
  return lines;
}
function buildManagerCardText(payload) {
  const customerHandle = payload.customerContactLine || "\u043A\u043E\u043D\u0442\u0430\u043A\u0442 \u0443\u0442\u043E\u0447\u043D\u044F\u0435\u0442\u0441\u044F";
  return [
    `\u{1F514} \u041D\u043E\u0432\u044B\u0439 \u0437\u0430\u043A\u0430\u0437 ${formatOrderRef$3(payload.order.orderNumber, payload.orderId)}`,
    `\u{1F3EA} ${payload.brandName} \u2022 ${payload.branchName}`,
    `\u{1F4CD} ${payload.branchAddress}, ${payload.cityName}`,
    `\u041A\u043B\u0438\u0435\u043D\u0442: ${customerHandle}`,
    "",
    "\u{1F9FE} \u0421\u043E\u0441\u0442\u0430\u0432:",
    ...formatItems$1(payload.order.items),
    "",
    ...buildMoneyBlock$1(payload.order),
    "",
    ...buildFulfillmentBlock$1(payload.order)
  ].join("\n");
}
async function loadManagerOrderDetails(event, orderId) {
  const client = await serverSupabaseServiceRole(event);
  const { data: row } = await client.from("orders").select("order_number,status,fulfillment_type,payment_method,payment_status,subtotal,delivery_cost,total,discount_amount,bonus_amount_spent,promo_code_id,items,address,pickup_point,customer_telegram_id").eq("id", orderId).maybeSingle();
  if (!row) return null;
  const promoCodeId = row == null ? void 0 : row.promo_code_id;
  let promoCode = null;
  if (promoCodeId) {
    const { data: promoRow } = await client.from("shop_promo_codes").select("code").eq("id", promoCodeId).maybeSingle();
    promoCode = typeof (promoRow == null ? void 0 : promoRow.code) === "string" ? String(promoRow.code) : null;
  }
  const address = (row == null ? void 0 : row.address) || {};
  const pickup = (row == null ? void 0 : row.pickup_point) || {};
  const items = Array.isArray(row == null ? void 0 : row.items) ? row.items : [];
  const tgRaw = row == null ? void 0 : row.customer_telegram_id;
  const customerTelegramId = tgRaw !== null && tgRaw !== void 0 && Number.isFinite(Number(tgRaw)) && Number(tgRaw) > 0 ? Number(tgRaw) : null;
  return {
    orderNumber: String((row == null ? void 0 : row.order_number) || orderId),
    status: String((row == null ? void 0 : row.status) || "new"),
    fulfillmentType: String((row == null ? void 0 : row.fulfillment_type) || "delivery"),
    paymentMethod: String((row == null ? void 0 : row.payment_method) || ""),
    paymentStatus: String((row == null ? void 0 : row.payment_status) || ""),
    subtotal: Number((row == null ? void 0 : row.subtotal) || 0),
    deliveryCost: Number((row == null ? void 0 : row.delivery_cost) || 0),
    total: Number((row == null ? void 0 : row.total) || 0),
    discountAmount: Number((row == null ? void 0 : row.discount_amount) || 0),
    bonusSpent: Number((row == null ? void 0 : row.bonus_amount_spent) || 0),
    promoCode,
    items,
    addressLine: typeof address.line === "string" ? address.line : null,
    addressFlat: typeof address.flat === "string" ? address.flat : null,
    addressComment: typeof address.comment === "string" ? address.comment : null,
    pickupPointName: typeof pickup.name === "string" ? pickup.name : null,
    pickupPointAddress: typeof pickup.address === "string" ? pickup.address : null,
    customerTelegramId
  };
}
async function buildManagerOrderTelegramPayload(event, args) {
  var _a, _b, _c, _d, _e;
  const client = await serverSupabaseServiceRole(event);
  const order = await loadManagerOrderDetails(event, args.orderId);
  if (!order) return null;
  const orderContact = await loadOrderCustomerContact(event, args.orderId);
  const { data: shopRow } = await client.from("shops").select("name").eq("id", args.shopId).maybeSingle();
  const { data: branchRow } = await client.from("restaurants").select("name,address").eq("id", args.restaurantId).maybeSingle();
  const { data: cityRow } = args.cityId ? await client.from("cities").select("name").eq("id", args.cityId).maybeSingle() : { data: null };
  const config = useRuntimeConfig(event);
  const maxBotUrl = String(((_a = config.public) == null ? void 0 : _a.maxBotUrl) || "").trim();
  const appUrlBase = String(config.appUrl || "").replace(/\/$/, "");
  const dashboardOrderUrl = appUrlBase ? `${appUrlBase}/dashboard/orders/${encodeURIComponent(args.orderId)}` : "";
  const flowConfig = await getUnifiedFlowConfig(event, args.restaurantId);
  const shopBranches = await loadActiveShopBranches(event, args.shopId);
  const contactKeyboardCtx = orderContact ? orderContactToKeyboardContext(orderContact, { maxBotUrl, allowTelegramUserLink: false }) : null;
  const text = buildManagerCardText({
    order,
    orderId: args.orderId,
    brandName: String((shopRow == null ? void 0 : shopRow.name) || "\u2014"),
    branchName: String((branchRow == null ? void 0 : branchRow.name) || "\u2014"),
    branchAddress: String((branchRow == null ? void 0 : branchRow.address) || "\u0410\u0434\u0440\u0435\u0441 \u043D\u0435 \u0443\u043A\u0430\u0437\u0430\u043D"),
    cityName: String((cityRow == null ? void 0 : cityRow.name) || "\u2014"),
    customerContactLine: contactKeyboardCtx ? formatManagerCustomerLine(contactKeyboardCtx) : void 0
  });
  const replyMarkup = buildManagerOrderInlineKeyboard({
    orderId: args.orderId,
    fulfillmentType: order.fulfillmentType,
    orderStatus: order.status,
    customerTelegramId: (_b = contactKeyboardCtx == null ? void 0 : contactKeyboardCtx.customerTelegramId) != null ? _b : order.customerTelegramId,
    customerMaxUserId: (_c = contactKeyboardCtx == null ? void 0 : contactKeyboardCtx.customerMaxUserId) != null ? _c : null,
    customerPhone: (_d = contactKeyboardCtx == null ? void 0 : contactKeyboardCtx.customerPhone) != null ? _d : null,
    orderClientChannel: (_e = contactKeyboardCtx == null ? void 0 : contactKeyboardCtx.orderClientChannel) != null ? _e : null,
    maxBotUrl,
    allowTelegramUserLink: false,
    dashboardOrderUrl,
    etaButtonsEnabled: flowConfig.etaButtonsEnabled,
    etaPresets: flowConfig.etaPresets,
    branchPickerEnabled: shopBranches.length > 1
  });
  return { text, replyMarkup, orderRef: formatOrderRef$3(order.orderNumber, args.orderId) };
}
function parseManagerTelegramPosts(metadata) {
  if (!metadata || typeof metadata !== "object") return [];
  const raw = metadata.manager_telegram_posts;
  if (!Array.isArray(raw)) return [];
  const posts = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const chatId = typeof item.chatId === "string" ? item.chatId.trim() : "";
    const messageId = Number(item.messageId);
    if (!chatId || !Number.isFinite(messageId)) continue;
    const branchIdRaw = item.branchId;
    posts.push({
      chatId,
      messageId: Math.floor(messageId),
      branchId: typeof branchIdRaw === "string" && branchIdRaw.trim() ? branchIdRaw.trim() : null
    });
  }
  return posts;
}
async function persistManagerTelegramPost(event, args) {
  const client = await serverSupabaseServiceRole(event);
  const { data: order } = await client.from("orders").select("metadata").eq("id", args.orderId).eq("shop_id", args.shopId).maybeSingle();
  if (!order) return;
  const metadata = order.metadata && typeof order.metadata === "object" ? { ...order.metadata } : {};
  const posts = parseManagerTelegramPosts(metadata);
  const next = posts.filter((p) => p.chatId !== args.post.chatId);
  next.push(args.post);
  metadata.manager_telegram_posts = next;
  await client.from("orders").update({ metadata, updated_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", args.orderId).eq("shop_id", args.shopId);
}
async function telegramApi$1(botToken, method, body) {
  const response = await fetch(`https://api.telegram.org/bot${botToken}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  return response.json().catch(() => null);
}
async function editTelegramToTransferred(botToken, chatId, messageId, text) {
  const payload = await telegramApi$1(botToken, "editMessageText", {
    chat_id: chatId,
    message_id: messageId,
    text,
    reply_markup: { inline_keyboard: [] }
  });
  if ((payload == null ? void 0 : payload.ok) === false) {
    throw new Error(payload.description || "telegram_edit_failed");
  }
}
async function sendTelegramManagerCard(botToken, chatId, text, replyMarkup) {
  var _a, _b;
  const hasKeyboard = Boolean((_a = replyMarkup == null ? void 0 : replyMarkup.inline_keyboard) == null ? void 0 : _a.length);
  const payload = await telegramApi$1(botToken, "sendMessage", {
    chat_id: chatId,
    text,
    ...hasKeyboard ? { reply_markup: replyMarkup } : {}
  });
  if ((payload == null ? void 0 : payload.ok) === false) {
    throw new Error(payload.description || "telegram_send_failed");
  }
  const messageId = (_b = payload == null ? void 0 : payload.result) == null ? void 0 : _b.message_id;
  return typeof messageId === "number" && Number.isFinite(messageId) ? Math.floor(messageId) : null;
}
async function syncTelegramChatsAfterBranchTransfer(event, args) {
  var _a, _b;
  const card = await buildManagerOrderTelegramPayload(event, {
    shopId: args.shopId,
    restaurantId: args.newBranchId,
    orderId: args.orderId,
    cityId: args.cityId
  });
  if (!card) return;
  const transferNotice = buildOrderTransferredNoticeText(card.orderRef, args.newBranchName);
  const newBranchChatId = ((_a = args.branches.find((b) => b.id === args.newBranchId)) == null ? void 0 : _a.managerGroupChatId) || null;
  const previousBranchChatId = args.previousBranchId ? ((_b = args.branches.find((b) => b.id === args.previousBranchId)) == null ? void 0 : _b.managerGroupChatId) || null : null;
  const client = await serverSupabaseServiceRole(event);
  const { data: orderRow } = await client.from("orders").select("metadata").eq("id", args.orderId).eq("shop_id", args.shopId).maybeSingle();
  const knownPosts = parseManagerTelegramPosts(orderRow == null ? void 0 : orderRow.metadata);
  const targets = /* @__PURE__ */ new Map();
  for (const post of knownPosts) {
    targets.set(`${post.chatId}:${post.messageId}`, post);
  }
  targets.set(`${args.actingChatId}:${args.actingMessageId}`, {
    chatId: args.actingChatId,
    messageId: args.actingMessageId,
    branchId: args.previousBranchId
  });
  const actingIsNewBranch = Boolean(newBranchChatId && args.actingChatId === newBranchChatId);
  for (const post of targets.values()) {
    const isActing = post.chatId === args.actingChatId && post.messageId === args.actingMessageId;
    if (isActing && actingIsNewBranch) {
      const payload = await telegramApi$1(args.botToken, "editMessageText", {
        chat_id: post.chatId,
        message_id: post.messageId,
        text: card.text,
        reply_markup: card.replyMarkup
      });
      if ((payload == null ? void 0 : payload.ok) !== false) {
        await persistManagerTelegramPost(event, {
          shopId: args.shopId,
          orderId: args.orderId,
          post: { chatId: post.chatId, messageId: post.messageId, branchId: args.newBranchId }
        });
      }
      continue;
    }
    const isNewBranchChat = Boolean(newBranchChatId && post.chatId === newBranchChatId);
    if (isNewBranchChat) continue;
    const shouldMarkTransferred = post.branchId === args.previousBranchId || previousBranchChatId && post.chatId === previousBranchChatId || isActing;
    if (!shouldMarkTransferred) continue;
    try {
      await editTelegramToTransferred(args.botToken, post.chatId, post.messageId, transferNotice);
    } catch (err) {
      console.error("syncTelegramChatsAfterBranchTransfer mark transferred:", err);
    }
  }
  if (newBranchChatId && !actingIsNewBranch) {
    try {
      const messageId = await sendTelegramManagerCard(args.botToken, newBranchChatId, card.text, card.replyMarkup);
      if (messageId != null) {
        await persistManagerTelegramPost(event, {
          shopId: args.shopId,
          orderId: args.orderId,
          post: { chatId: newBranchChatId, messageId, branchId: args.newBranchId }
        });
      }
    } catch (err) {
      console.error("syncTelegramChatsAfterBranchTransfer send to new branch:", err);
    }
  }
}

const PREFIX = "rt_";
function parseReviewTokenCallback(data) {
  const raw = typeof data === "string" ? data.trim() : "";
  if (!raw.startsWith(PREFIX)) {
    return { ok: false, reason: "not_review_prompt" };
  }
  const rest = raw.slice(PREFIX.length);
  const lastUnderscore = rest.lastIndexOf("_");
  if (lastUnderscore <= 0 || lastUnderscore >= rest.length - 1) {
    return { ok: false, reason: "malformed" };
  }
  const token = rest.slice(0, lastUnderscore).trim();
  const tail = rest.slice(lastUnderscore + 1).trim().toLowerCase();
  if (!/^[0-9a-f]{10,24}$/i.test(token)) {
    return { ok: false, reason: "bad_token" };
  }
  if (tail === "e" || tail === "edit") {
    return { ok: true, token, action: "edit" };
  }
  const stars = Number(tail);
  if (!Number.isFinite(stars) || stars < 1 || stars > 5) {
    return { ok: false, reason: "bad_stars" };
  }
  return { ok: true, token, action: "rate", stars: Math.round(stars) };
}
function buildReviewCallbackData(token, part) {
  const safe = token.trim().toLowerCase();
  if (part === "edit") return `${PREFIX}${safe}_e`;
  return `${PREFIX}${safe}_${part}`;
}
function reviewPromptPlainText(orderRef) {
  return [`\u041A\u0430\u043A \u0432\u0430\u043C \u0437\u0430\u043A\u0430\u0437 ${orderRef}?`, "\u041E\u0446\u0435\u043D\u0438\u0442\u0435 \u043E\u0442 1 \u0434\u043E 5 \u0437\u0432\u0451\u0437\u0434 (\u043D\u0430\u0436\u043C\u0438\u0442\u0435 \u043D\u0430 \u0437\u0432\u0435\u0437\u0434\u0443)."].join("\n");
}
function telegramStarKeyboardRows(token) {
  const row = [1, 2, 3, 4, 5].map((n) => ({
    text: "\u2B50",
    callback_data: buildReviewCallbackData(token, n)
  }));
  return [row];
}
function telegramChangeRatingRow(token) {
  return [[{ text: "\u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C \u043E\u0446\u0435\u043D\u043A\u0443", callback_data: buildReviewCallbackData(token, "edit") }]];
}
function maxStarLinkAttachments(maxBotUrl, orderId) {
  const base = maxBotUrl.replace(/\/$/, "");
  const sep = base.includes("?") ? "&" : "?";
  const row = [1, 2, 3, 4, 5].map((n) => {
    const startapp = `reviewrate_${orderId}_${n}`;
    const url = `${base}${sep}startapp=${encodeURIComponent(startapp)}`;
    return { type: "link", text: `${n}\u2605`, url };
  });
  return [
    {
      type: "inline_keyboard",
      payload: { buttons: [row] }
    }
  ];
}

const STAFF_RESPONSE_TEXTS = {
  soon: "\u0421\u043A\u043E\u0440\u043E \u043F\u043E\u0434\u043E\u0439\u0434\u0443",
  on_my_way: "\u0423\u0436\u0435 \u0431\u0435\u0433\u0443 \u043A \u0432\u0430\u043C",
  done: "\u0417\u0430\u043F\u0440\u043E\u0441 \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D"
};
function getStaffResponseText(action) {
  return STAFF_RESPONSE_TEXTS[action] || action;
}
function mapActionToStatus(action) {
  if (action === "done") return "resolved";
  if (action === "on_my_way") return "in_progress";
  return "acknowledged";
}
async function sendMax$2(baseUrl, token, options) {
  const base = baseUrl.replace(/\/$/, "");
  const hasConversation = typeof options.conversationId === "string" && options.conversationId.trim();
  const hasUser = typeof options.userId === "string" && options.userId.trim();
  if (!hasConversation && !hasUser) throw new Error("max_target_missing");
  const url = hasConversation ? `${base}/messages` : `${base}/messages?user_id=${encodeURIComponent(String(options.userId))}`;
  const payload = hasConversation ? { conversationId: String(options.conversationId), text: options.text } : { text: options.text };
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: token, "Content-Type": "application/json" },
    body: JSON.stringify({
      ...payload,
      ...Array.isArray(options.attachments) && options.attachments.length ? { attachments: options.attachments } : {}
    })
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`max_send_failed:${res.status}:${text}`);
  }
}
async function createServiceCallEvent(event, payload) {
  const client = await serverSupabaseServiceRole(event);
  await client.from("service_call_events").insert({
    service_call_id: payload.serviceCallId,
    shop_id: payload.shopId,
    restaurant_id: payload.restaurantId,
    order_id: payload.orderId || null,
    event_type: payload.eventType,
    event_status: payload.eventStatus || null,
    channel: payload.channel,
    actor_binding_id: payload.actorBindingId || null,
    actor_external_user_id: payload.actorExternalUserId || null,
    actor_display_name: payload.actorDisplayName || null,
    message: payload.message || null,
    payload: payload.extraPayload || {}
  });
}

async function requireReviewsFeature(event, shopId) {
  await requireShopFeature(event, shopId, "reputation_reviews_pro");
}
async function resolveReviewIdentity(event) {
  var _a, _b, _c;
  const user = await serverSupabaseUser(event);
  if (user) {
    const rawUser = user;
    const userId = typeof rawUser.id === "string" ? rawUser.id : typeof rawUser.sub === "string" ? rawUser.sub : "";
    if (!userId) {
      throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
    }
    const client2 = await serverSupabaseServiceRole(event);
    const { data: profile2 } = await client2.from("profiles").select("id,telegram_id,max_user_id").eq("id", userId).maybeSingle();
    return {
      profileId: userId,
      telegramId: (profile2 == null ? void 0 : profile2.telegram_id) != null ? Number(profile2.telegram_id) : null,
      maxUserId: typeof (profile2 == null ? void 0 : profile2.max_user_id) === "string" && profile2.max_user_id.trim() ? profile2.max_user_id.trim() : null
    };
  }
  const botToken = typeof ((_b = (_a = event.context) == null ? void 0 : _a.tenant) == null ? void 0 : _b.telegramBotToken) === "string" ? String(((_c = event.context) == null ? void 0 : _c.tenant).telegramBotToken).trim() : "";
  if (!botToken) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }
  const profileId = await resolveCustomerProfileId(event, botToken);
  const client = await serverSupabaseServiceRole(event);
  const { data: profile } = await client.from("profiles").select("telegram_id,max_user_id").eq("id", profileId).maybeSingle();
  return {
    profileId,
    telegramId: (profile == null ? void 0 : profile.telegram_id) != null ? Number(profile.telegram_id) : null,
    maxUserId: typeof (profile == null ? void 0 : profile.max_user_id) === "string" && profile.max_user_id.trim() ? profile.max_user_id.trim() : null
  };
}
async function requireOwnedOrderForReview(event, args) {
  const client = await serverSupabaseServiceRole(event);
  const { data, error } = await client.from("orders").select("id,shop_id,restaurant_id,customer_profile_id,customer_telegram_id").eq("id", args.orderId).eq("shop_id", args.shopId).maybeSingle();
  if (error) {
    throw createError({ statusCode: 500, statusMessage: "Failed to load order" });
  }
  if (!data) {
    throw createError({ statusCode: 404, statusMessage: "Order not found" });
  }
  const profileMatch = args.identity.profileId && data.customer_profile_id && String(data.customer_profile_id) === args.identity.profileId;
  const telegramMatch = args.identity.telegramId != null && data.customer_telegram_id != null && Number(data.customer_telegram_id) === Number(args.identity.telegramId);
  let maxMatch = false;
  if (args.identity.maxUserId && data.customer_profile_id) {
    const { data: prof } = await client.from("profiles").select("max_user_id").eq("id", String(data.customer_profile_id)).maybeSingle();
    const stored = typeof (prof == null ? void 0 : prof.max_user_id) === "string" ? String(prof.max_user_id).trim() : "";
    maxMatch = Boolean(stored && stored === String(args.identity.maxUserId).trim());
  }
  if (!profileMatch && !telegramMatch && !maxMatch) {
    throw createError({ statusCode: 403, statusMessage: "Order does not belong to current customer" });
  }
  return data;
}
function sanitizeReviewComment(input) {
  if (typeof input !== "string") return null;
  const normalized = input.trim();
  if (!normalized) return null;
  return normalized.slice(0, 2e3);
}
function sanitizeVideoUrl(input) {
  if (typeof input !== "string") return null;
  const normalized = input.trim();
  if (!normalized) return null;
  if (!/^https?:\/\//i.test(normalized)) return null;
  return normalized.slice(0, 2e3);
}
function resolveInitialReviewStatus(rating) {
  return rating <= 3 ? "manager_review" : "published";
}
function resolveManagerNotificationMode(channelRow) {
  if (!channelRow) return { channel: null, chatId: null };
  const tg = typeof channelRow.telegram_chat_id === "string" ? channelRow.telegram_chat_id.trim() : "";
  const max = typeof channelRow.max_chat_id === "string" ? channelRow.max_chat_id.trim() : "";
  if (tg) return { channel: "telegram", chatId: tg };
  if (max) return { channel: "max", chatId: max };
  return { channel: null, chatId: null };
}
function parseListLimit(raw, defaults = 20, max = 100) {
  return Math.min(Math.max(Number(raw) || defaults, 1), max);
}

async function sendTelegram$1(botToken, chatId, text) {
  var _a;
  const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text })
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`telegram_send_failed:${res.status}:${body}`);
  }
  const payload = await res.json();
  const messageId = (_a = payload == null ? void 0 : payload.result) == null ? void 0 : _a.message_id;
  return messageId != null ? String(messageId) : null;
}
async function sendMax$1(baseUrl, token, conversationId, text) {
  const res = await fetch(`${baseUrl.replace(/\/$/, "")}/messages`, {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      conversationId,
      text
    })
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`max_send_failed:${res.status}:${body}`);
  }
}
function getStatusPatch(action) {
  if (action === "publish") return { status: "published", publishedAt: (/* @__PURE__ */ new Date()).toISOString() };
  if (action === "resolve") return { status: "resolved", resolvedAt: (/* @__PURE__ */ new Date()).toISOString() };
  if (action === "reopen") return { status: "manager_review", resolvedAt: null };
  return { status: "rejected", publishedAt: null };
}
async function sendReviewToManager(event, reviewId) {
  const config = useRuntimeConfig(event);
  const client = await serverSupabaseServiceRole(event);
  const { data: review } = await client.from("shop_reviews").select("id,shop_id,restaurant_id,order_id,rating,comment,video_url,moderation_channel,moderation_chat_id").eq("id", reviewId).maybeSingle();
  if (!(review == null ? void 0 : review.id)) return;
  const { data: shop } = await client.from("shops").select("name,telegram_bot_token").eq("id", review.shop_id).maybeSingle();
  const { data: restaurant } = review.restaurant_id ? await client.from("restaurants").select("name").eq("id", review.restaurant_id).maybeSingle() : { data: null };
  const title = [
    "\u26A0\uFE0F \u041D\u0435\u0433\u0430\u0442\u0438\u0432\u043D\u044B\u0439 \u043E\u0442\u0437\u044B\u0432",
    `\u{1F3EA} ${String((shop == null ? void 0 : shop.name) || "\u0420\u0435\u0441\u0442\u043E\u0440\u0430\u043D")}`,
    `\u{1F4CD} \u0422\u043E\u0447\u043A\u0430: ${String((restaurant == null ? void 0 : restaurant.name) || "\u2014")}`,
    `\u{1F9FE} \u0417\u0430\u043A\u0430\u0437: ${String(review.order_id || "\u2014")}`,
    `\u2B50 \u041E\u0446\u0435\u043D\u043A\u0430: ${Number(review.rating || 0)}`,
    `\u{1F4AC} \u041A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0439: ${String(review.comment || "\u2014")}`,
    `\u{1F3A5} \u0412\u0438\u0434\u0435\u043E: ${String(review.video_url || "\u2014")}`
  ].join("\n");
  const channel = String(review.moderation_channel || "");
  const chatId = String(review.moderation_chat_id || "");
  if (!channel || !chatId) return;
  if (channel === "telegram") {
    const botToken = String((shop == null ? void 0 : shop.telegram_bot_token) || config.botToken || "");
    if (!botToken) return;
    const messageId = await sendTelegram$1(botToken, chatId, title);
    if (messageId) {
      await client.from("shop_reviews").update({ moderation_message_id: messageId, forwarded_to_manager_at: (/* @__PURE__ */ new Date()).toISOString(), updated_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", reviewId);
    }
    return;
  }
  if (channel === "max") {
    const maxBaseUrl = String(config.maxApiBaseUrl || "");
    const maxToken = String(config.maxApiToken || "");
    if (!maxBaseUrl || !maxToken) return;
    await sendMax$1(maxBaseUrl, maxToken, chatId, title);
    await client.from("shop_reviews").update({ forwarded_to_manager_at: (/* @__PURE__ */ new Date()).toISOString(), updated_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", reviewId);
  }
}
async function applyReviewModerationAction(event, args) {
  const client = await serverSupabaseServiceRole(event);
  const { data: review } = await client.from("shop_reviews").select("id,shop_id,restaurant_id,status").eq("id", args.reviewId).eq("shop_id", args.shopId).maybeSingle();
  if (!(review == null ? void 0 : review.id)) {
    throw createError({ statusCode: 404, statusMessage: "Review not found" });
  }
  const patch = getStatusPatch(args.action);
  const payload = {
    status: patch.status,
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  if (Object.prototype.hasOwnProperty.call(patch, "publishedAt")) payload.published_at = patch.publishedAt || null;
  if (Object.prototype.hasOwnProperty.call(patch, "resolvedAt")) payload.resolved_at = patch.resolvedAt || null;
  const { error: updateError } = await client.from("shop_reviews").update(payload).eq("id", args.reviewId).eq("shop_id", args.shopId);
  if (updateError) {
    throw createError({ statusCode: 500, statusMessage: "Failed to update review" });
  }
  await client.from("shop_review_events").insert({
    review_id: args.reviewId,
    shop_id: args.shopId,
    restaurant_id: review.restaurant_id || null,
    action: args.action,
    action_payload: {},
    actor_channel: "dashboard",
    actor_user_id: args.actorUserId
  });
  return { status: patch.status };
}

async function resolveModeration(client, shopId, restaurantId) {
  const { data: scopedChannelRows } = restaurantId ? await client.from("shop_review_moderation_channels").select("restaurant_id,telegram_chat_id,max_chat_id,is_active").eq("shop_id", shopId).eq("restaurant_id", restaurantId).eq("is_active", true).limit(1) : { data: [] };
  const { data: globalChannelRows } = await client.from("shop_review_moderation_channels").select("restaurant_id,telegram_chat_id,max_chat_id,is_active").eq("shop_id", shopId).eq("is_active", true).is("restaurant_id", null).limit(1);
  const directChannel = (scopedChannelRows != null ? scopedChannelRows : [])[0];
  const globalChannel = (globalChannelRows != null ? globalChannelRows : [])[0];
  return resolveManagerNotificationMode(directChannel || globalChannel || null);
}
async function markReviewPromptsCompletedForOrder(client, orderId, reviewId) {
  const nowIso = (/* @__PURE__ */ new Date()).toISOString();
  await client.from("shop_order_review_prompts").update({
    status: "completed",
    review_id: reviewId,
    updated_at: nowIso
  }).eq("order_id", orderId).in("status", ["awaiting_send", "sent", "send_failed"]);
}
async function insertShopReview(event, args) {
  var _a, _b;
  const client = await serverSupabaseServiceRole(event);
  const rating = Math.round(args.rating);
  const status = resolveInitialReviewStatus(rating);
  const comment = sanitizeReviewComment((_a = args.comment) != null ? _a : null);
  const videoUrl = sanitizeVideoUrl((_b = args.videoUrl) != null ? _b : null);
  const moderation = await resolveModeration(client, args.shopId, args.order.restaurant_id);
  const nowIso = (/* @__PURE__ */ new Date()).toISOString();
  const payload = {
    shop_id: args.shopId,
    restaurant_id: args.order.restaurant_id || null,
    order_id: args.order.id,
    profile_id: args.identity.profileId,
    customer_telegram_id: args.identity.telegramId,
    customer_max_user_id: args.identity.maxUserId,
    rating,
    comment,
    video_url: videoUrl,
    status,
    moderation_channel: moderation.channel,
    moderation_chat_id: moderation.chatId,
    published_at: status === "published" ? nowIso : null
  };
  const { data: review, error } = await client.from("shop_reviews").insert(payload).select("id,shop_id,restaurant_id,order_id,rating,status,published_at,created_at").single();
  if (error || !review) {
    if ((error == null ? void 0 : error.code) === "23505") {
      throw createError({ statusCode: 409, statusMessage: "Review for this order already exists" });
    }
    throw createError({ statusCode: 500, statusMessage: (error == null ? void 0 : error.message) || "Failed to create review" });
  }
  await client.from("shop_review_events").insert({
    review_id: review.id,
    shop_id: args.shopId,
    restaurant_id: args.order.restaurant_id || null,
    action: "created",
    action_payload: { rating, hasComment: !!comment, hasVideo: !!videoUrl },
    actor_channel: args.actorChannel,
    actor_user_id: args.identity.profileId
  });
  if (status === "manager_review") {
    await client.from("shop_review_events").insert({
      review_id: review.id,
      shop_id: args.shopId,
      restaurant_id: args.order.restaurant_id || null,
      action: "send_to_manager",
      action_payload: {},
      actor_channel: args.actorChannel,
      actor_user_id: args.identity.profileId
    });
    await sendReviewToManager(event, String(review.id)).catch((err) => {
      console.error("reviews: send manager message failed", err);
    });
  }
  await markReviewPromptsCompletedForOrder(client, args.order.id, String(review.id)).catch((err) => {
    console.error("markReviewPromptsCompletedForOrder:", err);
  });
  return review;
}
async function updateShopReviewRating(event, args) {
  const client = await serverSupabaseServiceRole(event);
  const rating = Math.round(args.rating);
  const { data: existing, error: loadErr } = await client.from("shop_reviews").select("id,rating,status").eq("order_id", args.order.id).eq("shop_id", args.shopId).maybeSingle();
  if (loadErr) {
    throw createError({ statusCode: 500, statusMessage: loadErr.message || "Failed to load review" });
  }
  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: "Review not found" });
  }
  const nextStatus = resolveInitialReviewStatus(rating);
  const moderation = await resolveModeration(client, args.shopId, args.order.restaurant_id);
  const nowIso = (/* @__PURE__ */ new Date()).toISOString();
  const patch = {
    rating,
    status: nextStatus,
    moderation_channel: moderation.channel,
    moderation_chat_id: moderation.chatId,
    published_at: nextStatus === "published" ? nowIso : null,
    updated_at: nowIso
  };
  const { data: review, error } = await client.from("shop_reviews").update(patch).eq("id", existing.id).select("id,shop_id,restaurant_id,order_id,rating,status,published_at,created_at").single();
  if (error || !review) {
    throw createError({ statusCode: 500, statusMessage: (error == null ? void 0 : error.message) || "Failed to update review" });
  }
  await client.from("shop_review_events").insert({
    review_id: existing.id,
    shop_id: args.shopId,
    restaurant_id: args.order.restaurant_id || null,
    action: "edit",
    action_payload: { fromRating: existing.rating, toRating: rating, nextStatus },
    actor_channel: args.actorChannel,
    actor_user_id: args.identity.profileId
  });
  const prevRating = Number(existing.rating);
  const prevStatus = String(existing.status || "");
  const shouldNotifyManager = rating <= 3 && (prevRating > 3 || prevStatus === "published" || prevStatus === "new");
  if (nextStatus === "manager_review" && shouldNotifyManager) {
    await client.from("shop_review_events").insert({
      review_id: existing.id,
      shop_id: args.shopId,
      restaurant_id: args.order.restaurant_id || null,
      action: "send_to_manager",
      action_payload: { via: "rating_update", prevRating, nextRating: rating },
      actor_channel: args.actorChannel,
      actor_user_id: args.identity.profileId
    });
    await sendReviewToManager(event, String(existing.id)).catch((err) => {
      console.error("reviews: send manager message failed", err);
    });
  }
  await markReviewPromptsCompletedForOrder(client, args.order.id, String(existing.id)).catch((err) => {
    console.error("markReviewPromptsCompletedForOrder:", err);
  });
  return review;
}

function newPublicToken() {
  return crypto$1.randomBytes(6).toString("hex").toLowerCase();
}
function formatOrderRefShort(orderNumber, orderId) {
  const raw = typeof orderNumber === "string" && orderNumber.trim() ? orderNumber.trim() : orderId.trim();
  const normalized = raw.replace(/\s+/g, "");
  const short = normalized.length > 8 ? normalized.slice(0, 8) : normalized;
  return `#${short || "\u2014"}`;
}
function resolveReviewPromptDelayMinutes(event) {
  const config = useRuntimeConfig(event);
  const raw = Number(config.reviewPromptDelayMinutes);
  if (!Number.isFinite(raw) || raw < 0) return 45;
  return Math.min(24 * 60, Math.max(0, Math.floor(raw)));
}
async function scheduleReviewPromptsAfterHanded(event, input) {
  var _a, _b, _c, _d, _e;
  if (input.eventType !== "ORDER_STATUS_CHANGED") return;
  if (input.orderContext.status !== "handed_to_customer") return;
  const shopId = input.tenantContext.shopId;
  const orderId = input.orderContext.orderId;
  const enabled = await isShopFeatureEnabled(event, shopId, "reputation_reviews_pro");
  if (!enabled) return;
  const client = await serverSupabaseServiceRole(event);
  const { data: existingReview } = await client.from("shop_reviews").select("id").eq("order_id", orderId).maybeSingle();
  if (existingReview == null ? void 0 : existingReview.id) return;
  const { data: order } = await client.from("orders").select("id,shop_id,restaurant_id,status,customer_telegram_id,customer_profile_id,order_number").eq("id", orderId).eq("shop_id", shopId).maybeSingle();
  if (!order || String(order.status || "").toLowerCase() === "cancelled") return;
  const delayMin = resolveReviewPromptDelayMinutes(event);
  const scheduledFor = new Date(Date.now() + delayMin * 60 * 1e3).toISOString();
  const expiresAt = new Date(Date.now() + (delayMin + 72 * 60) * 60 * 1e3).toISOString();
  let customerMaxUserId = (_b = (_a = input.actorContext) == null ? void 0 : _a.customerMaxUserId) != null ? _b : null;
  let maxConversationId = (_d = (_c = input.actorContext) == null ? void 0 : _c.customerMaxConversationId) != null ? _d : null;
  const customerTelegramId = ((_e = input.actorContext) == null ? void 0 : _e.customerTelegramId) != null && Number.isFinite(Number(input.actorContext.customerTelegramId)) ? Number(input.actorContext.customerTelegramId) : null;
  const profileId = order.customer_profile_id ? String(order.customer_profile_id) : "";
  if (profileId && (!customerMaxUserId || !maxConversationId)) {
    const { data: profile } = await client.from("profiles").select("max_user_id,max_conversation_id").eq("id", profileId).maybeSingle();
    if (!customerMaxUserId && typeof (profile == null ? void 0 : profile.max_user_id) === "string" && profile.max_user_id.trim()) {
      customerMaxUserId = String(profile.max_user_id).trim();
    }
    if (!maxConversationId && typeof (profile == null ? void 0 : profile.max_conversation_id) === "string" && profile.max_conversation_id.trim()) {
      maxConversationId = String(profile.max_conversation_id).trim();
    }
  }
  const rows = [];
  if (customerTelegramId && customerTelegramId > 0) {
    rows.push({
      shop_id: shopId,
      order_id: orderId,
      restaurant_id: order.restaurant_id || null,
      channel: "telegram",
      public_token: newPublicToken(),
      status: "awaiting_send",
      scheduled_for: scheduledFor,
      expires_at: expiresAt,
      trigger_kind: "auto",
      customer_telegram_id: customerTelegramId,
      telegram_chat_id: String(customerTelegramId),
      customer_max_user_id: null,
      max_conversation_id: null
    });
  }
  const hasMax = Boolean(
    typeof customerMaxUserId === "string" && customerMaxUserId.trim() || typeof maxConversationId === "string" && maxConversationId.trim()
  );
  if (hasMax) {
    rows.push({
      shop_id: shopId,
      order_id: orderId,
      restaurant_id: order.restaurant_id || null,
      channel: "max",
      public_token: newPublicToken(),
      status: "awaiting_send",
      scheduled_for: scheduledFor,
      expires_at: expiresAt,
      trigger_kind: "auto",
      customer_telegram_id: null,
      telegram_chat_id: null,
      customer_max_user_id: typeof customerMaxUserId === "string" && customerMaxUserId.trim() ? customerMaxUserId.trim() : null,
      max_conversation_id: typeof maxConversationId === "string" && maxConversationId.trim() ? maxConversationId.trim() : null
    });
  }
  for (const row of rows) {
    const { error } = await client.from("shop_order_review_prompts").insert(row);
    if (error && String(error.code) !== "23505") {
      console.error("scheduleReviewPromptsAfterHanded insert:", error);
    }
  }
}
async function processDueReviewPrompts(event, opts) {
  const limit = Math.min(Math.max(Number(opts == null ? void 0 : opts.limit) || 20, 1), 100);
  const client = await serverSupabaseServiceRole(event);
  const nowIso = (/* @__PURE__ */ new Date()).toISOString();
  const { data: due, error } = await client.from("shop_order_review_prompts").select(
    "id,shop_id,order_id,restaurant_id,channel,public_token,status,scheduled_for,customer_telegram_id,telegram_chat_id,customer_max_user_id,max_conversation_id"
  ).eq("status", "awaiting_send").lte("scheduled_for", nowIso).order("scheduled_for", { ascending: true }).limit(limit);
  if (error || !(due == null ? void 0 : due.length)) return 0;
  let sent = 0;
  for (const row of due) {
    const ok = await sendOneReviewPrompt(event, row).catch((e) => {
      console.error("sendOneReviewPrompt", e);
      return false;
    });
    if (ok) sent += 1;
  }
  return sent;
}
async function sendOneReviewPrompt(event, row) {
  var _a, _b;
  const client = await serverSupabaseServiceRole(event);
  const promptId = String(row.id);
  const shopId = String(row.shop_id);
  const orderId = String(row.order_id);
  const { data: reviewExists } = await client.from("shop_reviews").select("id").eq("order_id", orderId).maybeSingle();
  if (reviewExists == null ? void 0 : reviewExists.id) {
    await client.from("shop_order_review_prompts").update({ status: "completed", review_id: String(reviewExists.id), updated_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", promptId);
    return true;
  }
  const { data: order } = await client.from("orders").select("id,status,order_number").eq("id", orderId).eq("shop_id", shopId).maybeSingle();
  if (!order || String(order.status || "").toLowerCase() === "cancelled") {
    await client.from("shop_order_review_prompts").update({ status: "expired", updated_at: (/* @__PURE__ */ new Date()).toISOString(), last_error: "order_cancelled_or_missing" }).eq("id", promptId);
    return true;
  }
  const enabled = await isShopFeatureEnabled(event, shopId, "reputation_reviews_pro");
  if (!enabled) {
    await client.from("shop_order_review_prompts").update({ status: "expired", updated_at: (/* @__PURE__ */ new Date()).toISOString(), last_error: "feature_disabled" }).eq("id", promptId);
    return true;
  }
  const orderRef = formatOrderRefShort(order.order_number, orderId);
  const text = reviewPromptPlainText(orderRef);
  const token = String(row.public_token || "").toLowerCase();
  const nowIso = (/* @__PURE__ */ new Date()).toISOString();
  if (row.channel === "telegram") {
    const { data: shop } = await client.from("shops").select("telegram_bot_token").eq("id", shopId).maybeSingle();
    const config = useRuntimeConfig(event);
    const botToken = String((shop == null ? void 0 : shop.telegram_bot_token) || config.botToken || "").trim();
    const chatId = String(row.telegram_chat_id || row.customer_telegram_id || "").trim();
    if (!botToken || !chatId) {
      await client.from("shop_order_review_prompts").update({ status: "send_failed", last_error: "missing_telegram_target", updated_at: nowIso }).eq("id", promptId);
      return true;
    }
    try {
      const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          reply_markup: { inline_keyboard: telegramStarKeyboardRows(token) }
        })
      });
      const payload = await res.json().catch(() => null);
      if (!res.ok || !(payload == null ? void 0 : payload.ok)) {
        throw new Error(`telegram_send_failed:${res.status}`);
      }
      const messageId = ((_a = payload == null ? void 0 : payload.result) == null ? void 0 : _a.message_id) != null ? String(payload.result.message_id) : null;
      await client.from("shop_order_review_prompts").update({
        status: "sent",
        sent_at: nowIso,
        telegram_message_id: messageId,
        last_error: null,
        updated_at: nowIso
      }).eq("id", promptId);
      return true;
    } catch (e) {
      await client.from("shop_order_review_prompts").update({
        status: "send_failed",
        last_error: String((e == null ? void 0 : e.message) || "telegram_error").slice(0, 500),
        updated_at: nowIso
      }).eq("id", promptId);
      return true;
    }
  }
  if (row.channel === "max") {
    const config = useRuntimeConfig(event);
    const maxBaseUrl = String(config.maxApiBaseUrl || "").trim();
    const maxToken = String(config.maxApiToken || "").trim();
    const maxBotUrl = String(((_b = config.public) == null ? void 0 : _b.maxBotUrl) || "").trim();
    if (!maxBaseUrl || !maxToken || !maxBotUrl) {
      await client.from("shop_order_review_prompts").update({ status: "send_failed", last_error: "max_not_configured", updated_at: nowIso }).eq("id", promptId);
      return true;
    }
    const userId = typeof row.customer_max_user_id === "string" && row.customer_max_user_id.trim() ? row.customer_max_user_id.trim() : null;
    const conversationId = typeof row.max_conversation_id === "string" && row.max_conversation_id.trim() ? row.max_conversation_id.trim() : null;
    try {
      await sendMax$2(maxBaseUrl, maxToken, {
        text,
        userId: conversationId ? void 0 : userId || void 0,
        conversationId: conversationId || void 0,
        attachments: maxStarLinkAttachments(maxBotUrl, orderId)
      });
      await client.from("shop_order_review_prompts").update({
        status: "sent",
        sent_at: nowIso,
        last_error: null,
        updated_at: nowIso
      }).eq("id", promptId);
      return true;
    } catch (e) {
      await client.from("shop_order_review_prompts").update({
        status: "send_failed",
        last_error: String((e == null ? void 0 : e.message) || "max_error").slice(0, 500),
        updated_at: nowIso
      }).eq("id", promptId);
      return true;
    }
  }
  return false;
}
async function enqueueManualReviewPrompts(event, args) {
  const client = await serverSupabaseServiceRole(event);
  const enabled = await isShopFeatureEnabled(event, args.shopId, "reputation_reviews_pro");
  if (!enabled) {
    throw new Error("feature_disabled");
  }
  const { data: reviewExists } = await client.from("shop_reviews").select("id").eq("order_id", args.orderId).maybeSingle();
  if (reviewExists == null ? void 0 : reviewExists.id) return { created: 0 };
  const { data: order } = await client.from("orders").select("id,shop_id,restaurant_id,customer_telegram_id,customer_profile_id,order_number,status").eq("id", args.orderId).eq("shop_id", args.shopId).maybeSingle();
  if (!order) throw new Error("order_not_found");
  let customerMaxUserId = null;
  let maxConversationId = null;
  const profileId = order.customer_profile_id ? String(order.customer_profile_id) : "";
  if (profileId) {
    const { data: profile } = await client.from("profiles").select("max_user_id,max_conversation_id").eq("id", profileId).maybeSingle();
    customerMaxUserId = typeof (profile == null ? void 0 : profile.max_user_id) === "string" && profile.max_user_id.trim() ? String(profile.max_user_id).trim() : null;
    maxConversationId = typeof (profile == null ? void 0 : profile.max_conversation_id) === "string" && profile.max_conversation_id.trim() ? String(profile.max_conversation_id).trim() : null;
  }
  const customerTelegramIdRaw = Number(order.customer_telegram_id);
  const customerTelegramId = Number.isFinite(customerTelegramIdRaw) && customerTelegramIdRaw > 0 ? customerTelegramIdRaw : null;
  const scheduledFor = (/* @__PURE__ */ new Date()).toISOString();
  const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1e3).toISOString();
  let created = 0;
  const upsertChannel = async (payload) => {
    const channel = String(payload.channel);
    const { data: existingRow } = await client.from("shop_order_review_prompts").select("id,status").eq("order_id", args.orderId).eq("channel", channel).maybeSingle();
    if ((existingRow == null ? void 0 : existingRow.id) && String(existingRow.status) !== "completed") {
      const { error: upErr } = await client.from("shop_order_review_prompts").update({
        public_token: newPublicToken(),
        status: "awaiting_send",
        scheduled_for: scheduledFor,
        expires_at: expiresAt,
        trigger_kind: "manual",
        created_by_profile_id: args.actorProfileId,
        last_error: null,
        telegram_message_id: null,
        max_message_id: null,
        sent_at: null,
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      }).eq("id", String(existingRow.id));
      if (!upErr) created += 1;
      return;
    }
    if (existingRow == null ? void 0 : existingRow.id) return;
    const { error } = await client.from("shop_order_review_prompts").insert(payload);
    if (!error) created += 1;
  };
  if (customerTelegramId) {
    await upsertChannel({
      shop_id: args.shopId,
      order_id: args.orderId,
      restaurant_id: order.restaurant_id || null,
      channel: "telegram",
      public_token: newPublicToken(),
      status: "awaiting_send",
      scheduled_for: scheduledFor,
      expires_at: expiresAt,
      trigger_kind: "manual",
      created_by_profile_id: args.actorProfileId,
      customer_telegram_id: customerTelegramId,
      telegram_chat_id: String(customerTelegramId),
      customer_max_user_id: null,
      max_conversation_id: null
    });
  }
  if (customerMaxUserId || maxConversationId) {
    await upsertChannel({
      shop_id: args.shopId,
      order_id: args.orderId,
      restaurant_id: order.restaurant_id || null,
      channel: "max",
      public_token: newPublicToken(),
      status: "awaiting_send",
      scheduled_for: scheduledFor,
      expires_at: expiresAt,
      trigger_kind: "manual",
      created_by_profile_id: args.actorProfileId,
      customer_telegram_id: null,
      telegram_chat_id: null,
      customer_max_user_id: customerMaxUserId,
      max_conversation_id: maxConversationId
    });
  }
  await processDueReviewPrompts(event, { limit: 10 });
  return { created };
}
async function applyReviewPromptTelegramCallback(event, args) {
  const client = await serverSupabaseServiceRole(event);
  const { data: prompt } = await client.from("shop_order_review_prompts").select(
    "id,shop_id,order_id,restaurant_id,channel,public_token,status,customer_telegram_id,telegram_message_id"
  ).eq("public_token", args.token.toLowerCase()).eq("channel", "telegram").maybeSingle();
  if (!(prompt == null ? void 0 : prompt.id) || String(prompt.shop_id) !== args.shopId) {
    throw new Error("prompt_not_found");
  }
  if (Number(prompt.customer_telegram_id) !== args.telegramUserId) {
    throw new Error("forbidden");
  }
  const orderId = String(prompt.order_id);
  const { data: order } = await client.from("orders").select("id,shop_id,restaurant_id,customer_profile_id,customer_telegram_id").eq("id", orderId).eq("shop_id", args.shopId).maybeSingle();
  if (!order) throw new Error("order_not_found");
  const identity = {
    profileId: order.customer_profile_id ? String(order.customer_profile_id) : null,
    telegramId: args.telegramUserId,
    maxUserId: null
  };
  if (args.action === "edit") {
    const keyboardToken = String(prompt.public_token).toLowerCase();
    const text = reviewPromptPlainText(formatOrderRefShort(null, orderId));
    await fetch(`https://api.telegram.org/bot${args.botToken}/editMessageText`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: args.chatId,
        message_id: args.messageId,
        text,
        reply_markup: { inline_keyboard: telegramStarKeyboardRows(keyboardToken) }
      })
    }).catch(() => {
    });
    return;
  }
  const stars = Number(args.stars);
  if (!Number.isFinite(stars) || stars < 1 || stars > 5) throw new Error("bad_rating");
  const { data: existing } = await client.from("shop_reviews").select("id").eq("order_id", orderId).maybeSingle();
  const orderRow = {
    id: String(order.id),
    shop_id: String(order.shop_id),
    restaurant_id: order.restaurant_id ? String(order.restaurant_id) : null
  };
  let reviewId = "";
  if (existing == null ? void 0 : existing.id) {
    const updated = await updateShopReviewRating(event, {
      shopId: args.shopId,
      order: orderRow,
      identity,
      rating: stars,
      actorChannel: "telegram"
    });
    reviewId = String(updated.id);
  } else {
    const created = await insertShopReview(event, {
      shopId: args.shopId,
      order: orderRow,
      identity,
      rating: stars,
      comment: null,
      videoUrl: null,
      actorChannel: "telegram"
    });
    reviewId = String(created.id);
  }
  const ratedText = `\u0421\u043F\u0430\u0441\u0438\u0431\u043E! \u0412\u0430\u0448\u0430 \u043E\u0446\u0435\u043D\u043A\u0430: ${stars} \u0438\u0437 5.`;
  await fetch(`https://api.telegram.org/bot${args.botToken}/editMessageText`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: args.chatId,
      message_id: args.messageId,
      text: ratedText,
      reply_markup: { inline_keyboard: telegramChangeRatingRow(String(prompt.public_token).toLowerCase()) }
    })
  }).catch(() => {
  });
  await client.from("shop_order_review_prompts").update({
    status: "completed",
    review_id: reviewId,
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  }).eq("id", String(prompt.id));
}

const statusDictionary = {
  new: "\u0421\u043E\u0437\u0434\u0430\u043D",
  in_progress: "\u0413\u043E\u0442\u043E\u0432\u0438\u0442\u0441\u044F",
  ready_for_pickup: "\u0413\u043E\u0442\u043E\u0432 \u043A \u0432\u044B\u0434\u0430\u0447\u0435",
  out_for_delivery: "\u041F\u0435\u0440\u0435\u0434\u0430\u043D \u043A\u0443\u0440\u044C\u0435\u0440\u0443",
  handed_to_customer: "\u0414\u043E\u0441\u0442\u0430\u0432\u043B\u0435\u043D",
  cancelled: "\u041E\u0442\u043C\u0435\u043D\u0435\u043D"
};
function getStatusLabel(status) {
  var _a;
  const normalized = status.trim().toLowerCase();
  return (_a = statusDictionary[normalized]) != null ? _a : normalized;
}
function formatOrderRef$2(orderNumber, orderId) {
  const raw = typeof orderNumber === "string" && orderNumber.trim() ? orderNumber.trim() : typeof orderId === "string" && orderId.trim() ? orderId.trim() : "";
  if (!raw) return "#\u2014";
  const normalized = raw.replace(/\s+/g, "");
  const short = normalized.length > 8 ? normalized.slice(0, 8) : normalized;
  return `#${short}`;
}
function buildNotificationKey(eventType, orderId, channel, targetType, targetId) {
  return `${eventType}:${orderId}:${channel}:${targetType}:${targetId}`;
}
async function sendTelegramMessage(botToken, chatId, text, options) {
  var _a;
  const replyMarkup = options == null ? void 0 : options.replyMarkup;
  const hasKeyboard = replyMarkup && Array.isArray(replyMarkup.inline_keyboard) && replyMarkup.inline_keyboard.length > 0;
  const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      ...hasKeyboard ? { reply_markup: replyMarkup } : {}
    })
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok || (payload == null ? void 0 : payload.ok) === false) {
    const detail = (payload == null ? void 0 : payload.description) || `http_${response.status}`;
    throw new Error(`telegram_send_failed:${detail}`);
  }
  const messageId = (_a = payload == null ? void 0 : payload.result) == null ? void 0 : _a.message_id;
  return typeof messageId === "number" && Number.isFinite(messageId) ? Math.floor(messageId) : null;
}
async function sendMaxMessage$1(baseUrl, token, target, text, attachments) {
  const base = baseUrl.replace(/\/$/, "");
  const hasConversation = typeof target.conversationId === "string" && target.conversationId.trim();
  const hasUserId = typeof target.userId === "string" && target.userId.trim();
  if (!hasConversation && !hasUserId) {
    throw new Error("max_send_target_missing");
  }
  const send = async (mode) => {
    const url = mode === "conversation" ? `${base}/messages` : `${base}/messages?user_id=${encodeURIComponent(String(target.userId))}`;
    return fetch(url, {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...mode === "conversation" ? { conversationId: String(target.conversationId) } : {},
        text,
        ...(attachments == null ? void 0 : attachments.length) ? { attachments } : {}
      })
    });
  };
  let response = await send(hasConversation ? "conversation" : "user");
  if (!response.ok) {
    const bodyText = await response.text();
    const isUnknownRecipient = response.status === 400 && /unknown recipient|proto\.payload/i.test(bodyText);
    if (hasConversation && hasUserId && isUnknownRecipient) {
      response = await send("user");
      if (!response.ok) {
        const fallbackBody = await response.text();
        throw new Error(`max_send_failed:${response.status}:${fallbackBody}`);
      }
      return;
    }
    throw new Error(`max_send_failed:${response.status}:${bodyText}`);
  }
  return;
}
function makeBridgeKey() {
  return randomBytes(9).toString("base64url");
}
async function createOrderBridgeToken(event, shopId, orderId, role) {
  const client = await serverSupabaseServiceRole(event);
  const bridgeKey = makeBridgeKey();
  const { error } = await client.from("auth_bridge_sessions").insert({
    bridge_key: bridgeKey,
    shop_id: shopId,
    scope_key: shopId,
    payload: {
      type: "order",
      orderId,
      shopId,
      role
    }
  });
  if (error) return null;
  return `order_${bridgeKey}`;
}
function buildManagerMessage(payload) {
  const order = payload.orderDetails;
  const lines = [
    `\u{1F514} \u041D\u043E\u0432\u044B\u0439 \u0437\u0430\u043A\u0430\u0437 ${formatOrderRef$2(order.orderNumber, payload.orderId)}`,
    `\u{1F3EA} ${payload.brandName} \u2022 ${payload.branchName}`,
    `\u{1F4CD} ${payload.branchAddress}, ${payload.cityName}`,
    `\u041A\u043B\u0438\u0435\u043D\u0442: ${payload.customerHandle}`,
    "",
    "\u{1F9FE} \u0421\u043E\u0441\u0442\u0430\u0432:",
    ...formatItems(order.items),
    "",
    ...buildMoneyBlock(order),
    "",
    ...buildFulfillmentBlock(order)
  ];
  return lines.join("\n");
}
function buildCustomerMessage(payload) {
  const order = payload.orderDetails;
  const lines = [
    `\u{1F4E6} \u0417\u0430\u043A\u0430\u0437 ${formatOrderRef$2(order.orderNumber, payload.orderId)}`,
    `\u0421\u0442\u0430\u0442\u0443\u0441: ${getStatusLabel(order.status)}`,
    `\u{1F3EA} ${payload.brandName} \u2022 ${payload.branchName}`,
    `\u{1F4CD} ${payload.branchAddress}, ${payload.cityName}`,
    "",
    "\u{1F9FE} \u0421\u043E\u0441\u0442\u0430\u0432 \u0437\u0430\u043A\u0430\u0437\u0430:",
    ...formatItems(order.items),
    "",
    ...buildMoneyBlock(order),
    "",
    ...buildFulfillmentBlock(order)
  ];
  return lines.join("\n");
}
function buildCustomerOrderStatusShortMessage(orderRef, status, fulfillmentType) {
  const normalized = normalizeDashboardStatus(status);
  return buildCustomerStatusShortText(orderRef, normalized, fulfillmentType);
}
function formatRub(value) {
  return `${new Intl.NumberFormat("ru-RU").format(value)} \u20BD`;
}
function formatItems(items) {
  if (!Array.isArray(items) || !items.length) return ["\u2022 \u0421\u043E\u0441\u0442\u0430\u0432 \u0432\u0440\u0435\u043C\u0435\u043D\u043D\u043E \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D"];
  const lines = [];
  for (const item of items.slice(0, 15)) {
    const name = typeof item.name === "string" && item.name.trim() ? item.name.trim() : "\u041F\u043E\u0437\u0438\u0446\u0438\u044F";
    const qty = Number(item.quantity || 0) > 0 ? Number(item.quantity) : 1;
    const price = Number(item.price || 0);
    lines.push(`\u2022 ${name} \xD7 ${qty} \u2014 ${formatRub(price * qty)}`);
  }
  if (items.length > 15) lines.push(`\u2026 \u0438 \u0435\u0449\u0451 ${items.length - 15} \u043F\u043E\u0437.`);
  return lines;
}
function getPaymentLine(order) {
  const method = order.paymentMethod.trim().toLowerCase();
  const status = order.paymentStatus.trim().toLowerCase();
  if (method === "online") {
    return status === "paid" ? "\u{1F4B8} \u0421\u043F\u043E\u0441\u043E\u0431 \u043E\u043F\u043B\u0430\u0442\u044B: \u041E\u043D\u043B\u0430\u0439\u043D (\u043E\u043F\u043B\u0430\u0447\u0435\u043D)" : "\u{1F4B8} \u0421\u043F\u043E\u0441\u043E\u0431 \u043E\u043F\u043B\u0430\u0442\u044B: \u041E\u043D\u043B\u0430\u0439\u043D (\u043E\u0436\u0438\u0434\u0430\u0435\u0442 \u043E\u043F\u043B\u0430\u0442\u044B)";
  }
  if (method === "card") return "\u{1F4B8} \u0421\u043F\u043E\u0441\u043E\u0431 \u043E\u043F\u043B\u0430\u0442\u044B: \u041A\u0430\u0440\u0442\u043E\u0439 \u043F\u0440\u0438 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u0438";
  if (method === "cash") return "\u{1F4B8} \u0421\u043F\u043E\u0441\u043E\u0431 \u043E\u043F\u043B\u0430\u0442\u044B: \u041D\u0430\u043B\u0438\u0447\u043D\u044B\u043C\u0438 \u043F\u0440\u0438 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u0438";
  return `\u{1F4B8} \u0421\u043F\u043E\u0441\u043E\u0431 \u043E\u043F\u043B\u0430\u0442\u044B: ${order.paymentMethod || "\u041D\u0435 \u0443\u043A\u0430\u0437\u0430\u043D"}`;
}
function buildMoneyBlock(order) {
  const lines = [
    `\u{1F4B0} \u0422\u043E\u0432\u0430\u0440\u044B: ${formatRub(order.subtotal)}`,
    `\u{1F69A} \u0414\u043E\u0441\u0442\u0430\u0432\u043A\u0430: ${formatRub(order.deliveryCost)}`
  ];
  if (order.discountAmount > 0) lines.push(`\u{1F381} \u0421\u043A\u0438\u0434\u043A\u0430: \u2212${formatRub(order.discountAmount)}`);
  if (order.bonusSpent > 0) lines.push(`\u2B50 \u0411\u043E\u043D\u0443\u0441\u044B: \u2212${formatRub(order.bonusSpent)}`);
  if (order.promoCode) lines.push(`\u{1F3F7} \u041F\u0440\u043E\u043C\u043E\u043A\u043E\u0434: ${order.promoCode}`);
  lines.push(`\u{1F4B3} \u0418\u0442\u043E\u0433\u043E: ${formatRub(order.total)}`);
  lines.push(getPaymentLine(order));
  return lines;
}
function buildFulfillmentBlock(order) {
  const lines = [];
  if (order.fulfillmentType === "pickup") {
    lines.push("\u{1F3EC} \u041F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u0435: \u0421\u0430\u043C\u043E\u0432\u044B\u0432\u043E\u0437");
    if (order.pickupPointName || order.pickupPointAddress) {
      lines.push(`\u041F\u0443\u043D\u043A\u0442: ${[order.pickupPointName, order.pickupPointAddress].filter(Boolean).join(", ")}`);
    }
  } else {
    lines.push("\u{1F69A} \u041F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u0435: \u0414\u043E\u0441\u0442\u0430\u0432\u043A\u0430");
    if (order.addressLine) {
      lines.push(`\u0410\u0434\u0440\u0435\u0441: ${[order.addressLine, order.addressFlat].filter(Boolean).join(", ")}`);
    }
  }
  if (order.addressComment) lines.push(`\u{1F4DD} \u041A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0439: ${order.addressComment}`);
  return lines;
}
async function loadOrderDetails(event, input) {
  const client = await serverSupabaseServiceRole(event);
  const { data: row } = await client.from("orders").select("order_number,status,fulfillment_type,payment_method,payment_status,subtotal,delivery_cost,total,discount_amount,bonus_amount_spent,promo_snapshot,promo_code_id,items,address,pickup_point").eq("id", input.orderContext.orderId).maybeSingle();
  const promoCodeId = row == null ? void 0 : row.promo_code_id;
  let promoCode = null;
  if (promoCodeId) {
    const { data: promoRow } = await client.from("shop_promo_codes").select("code").eq("id", promoCodeId).maybeSingle();
    promoCode = typeof (promoRow == null ? void 0 : promoRow.code) === "string" ? String(promoRow.code) : null;
  }
  const address = (row == null ? void 0 : row.address) || {};
  const pickup = (row == null ? void 0 : row.pickup_point) || {};
  const items = Array.isArray(row == null ? void 0 : row.items) ? row.items : [];
  return {
    orderNumber: String((row == null ? void 0 : row.order_number) || input.orderContext.orderNumber || input.orderContext.orderId),
    status: String((row == null ? void 0 : row.status) || input.orderContext.status || "new"),
    fulfillmentType: String((row == null ? void 0 : row.fulfillment_type) || "delivery"),
    paymentMethod: String((row == null ? void 0 : row.payment_method) || ""),
    paymentStatus: String((row == null ? void 0 : row.payment_status) || ""),
    subtotal: Number((row == null ? void 0 : row.subtotal) || input.orderContext.totalAmount || 0),
    deliveryCost: Number((row == null ? void 0 : row.delivery_cost) || 0),
    total: Number((row == null ? void 0 : row.total) || input.orderContext.totalAmount || 0),
    discountAmount: Number((row == null ? void 0 : row.discount_amount) || 0),
    bonusSpent: Number((row == null ? void 0 : row.bonus_amount_spent) || 0),
    promoCode,
    items,
    addressLine: typeof address.line === "string" ? address.line : null,
    addressFlat: typeof address.flat === "string" ? address.flat : null,
    addressComment: typeof address.comment === "string" ? address.comment : null,
    pickupPointName: typeof pickup.name === "string" ? pickup.name : null,
    pickupPointAddress: typeof pickup.address === "string" ? pickup.address : null
  };
}
async function resolveRecipients(event, input) {
  var _a, _b, _c, _d, _e;
  const client = await serverSupabaseServiceRole(event);
  const { data: restaurant } = await client.from("restaurants").select("manager_notification_mode,manager_group_chat_id,manager_max_chat_id,manager_recipients").eq("id", input.tenantContext.restaurantId).maybeSingle();
  const recipients = [];
  const mode = String((restaurant == null ? void 0 : restaurant.manager_notification_mode) || "group");
  const managerRecipients = Array.isArray(restaurant == null ? void 0 : restaurant.manager_recipients) ? restaurant.manager_recipients : [];
  if (input.eventType !== "ORDER_STATUS_CHANGED") {
    if (mode === "group") {
      const tgGroupId = typeof (restaurant == null ? void 0 : restaurant.manager_group_chat_id) === "string" ? restaurant.manager_group_chat_id.trim() : "";
      const maxGroupId = typeof (restaurant == null ? void 0 : restaurant.manager_max_chat_id) === "string" ? restaurant.manager_max_chat_id.trim() : "";
      if (tgGroupId) {
        recipients.push({ channel: "telegram", targetType: "manager_group", targetId: tgGroupId, conversationId: tgGroupId, maxUserId: null });
      }
      if (maxGroupId) {
        recipients.push({ channel: "max", targetType: "manager_group", targetId: maxGroupId, conversationId: maxGroupId, maxUserId: null });
      }
    } else {
      for (const manager of managerRecipients) {
        const channel = manager.channel === "max" ? "max" : manager.channel === "telegram" ? "telegram" : null;
        const targetId = typeof manager.targetId === "string" ? manager.targetId.trim() : "";
        if (!channel || !targetId) continue;
        recipients.push({ channel, targetType: "manager_user", targetId, conversationId: targetId, maxUserId: null });
      }
    }
  }
  if ((_a = input.actorContext) == null ? void 0 : _a.customerTelegramId) {
    const chatId = String(input.actorContext.customerTelegramId);
    recipients.push({ channel: "telegram", targetType: "customer", targetId: chatId, conversationId: chatId, maxUserId: null });
  }
  if (((_b = input.actorContext) == null ? void 0 : _b.customerMaxConversationId) || ((_c = input.actorContext) == null ? void 0 : _c.customerMaxUserId)) {
    const maxConversationId = typeof ((_d = input.actorContext) == null ? void 0 : _d.customerMaxConversationId) === "string" ? input.actorContext.customerMaxConversationId : null;
    const maxUserId = typeof ((_e = input.actorContext) == null ? void 0 : _e.customerMaxUserId) === "string" ? input.actorContext.customerMaxUserId : null;
    recipients.push({
      channel: "max",
      targetType: "customer",
      targetId: maxConversationId || maxUserId || "",
      conversationId: maxConversationId,
      maxUserId
    });
  }
  return recipients;
}
async function upsertNotificationEvent(event, payload) {
  var _a, _b;
  const client = await serverSupabaseServiceRole(event);
  const { data: existing } = await client.from("notification_events").select("id,attempt_count").eq("notification_key", payload.key).maybeSingle();
  const attemptCount = ((_a = existing == null ? void 0 : existing.attempt_count) != null ? _a : 0) + 1;
  const body = {
    notification_key: payload.key,
    event_type: payload.input.eventType,
    channel: payload.channel,
    shop_id: payload.input.tenantContext.shopId,
    restaurant_id: payload.input.tenantContext.restaurantId,
    city_id: payload.input.tenantContext.cityId,
    conversation_id: payload.conversationId,
    delivery_status: payload.status,
    attempt_count: attemptCount,
    last_error: (_b = payload.lastError) != null ? _b : null,
    payload: payload.input,
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  if (existing) {
    await client.from("notification_events").update(body).eq("id", existing.id);
    return;
  }
  await client.from("notification_events").insert(body);
}
async function dispatchNotificationEvent(event, input) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i;
  const config = useRuntimeConfig(event);
  const client = await serverSupabaseServiceRole(event);
  const recipients = await resolveRecipients(event, input);
  if (!recipients.length) return;
  const { data: shopRow } = await client.from("shops").select("name,telegram_bot_token,manager_chat_id,channel_policy").eq("id", input.tenantContext.shopId).maybeSingle();
  const { data: branchRow } = await client.from("restaurants").select("name,address,manager_group_chat_id,integration_keys").eq("id", input.tenantContext.restaurantId).maybeSingle();
  const { data: cityRow } = input.tenantContext.cityId ? await client.from("cities").select("name").eq("id", input.tenantContext.cityId).maybeSingle() : { data: null };
  const brandName = String((shopRow == null ? void 0 : shopRow.name) || "\u2014");
  const branchName = String((branchRow == null ? void 0 : branchRow.name) || "\u2014");
  const branchAddress = String((branchRow == null ? void 0 : branchRow.address) || "\u0410\u0434\u0440\u0435\u0441 \u043D\u0435 \u0443\u043A\u0430\u0437\u0430\u043D");
  const cityName = String((cityRow == null ? void 0 : cityRow.name) || "\u2014");
  let orderContact = null;
  try {
    orderContact = await loadOrderCustomerContact(event, input.orderContext.orderId);
  } catch (err) {
    console.error("dispatchNotificationEvent loadOrderCustomerContact:", err);
  }
  if (orderContact && input.actorContext) {
    if (!orderContact.customerMaxUserId && input.actorContext.customerMaxUserId) {
      orderContact = {
        ...orderContact,
        customerMaxUserId: String(input.actorContext.customerMaxUserId).trim() || null
      };
    }
    if (!orderContact.customerMaxConversationId && input.actorContext.customerMaxConversationId) {
      orderContact = {
        ...orderContact,
        customerMaxConversationId: String(input.actorContext.customerMaxConversationId).trim() || null
      };
    }
    if (!orderContact.customerTelegramId && input.actorContext.customerTelegramId) {
      orderContact = {
        ...orderContact,
        customerTelegramId: input.actorContext.customerTelegramId
      };
    }
  }
  const customerHandle = orderContact ? formatManagerCustomerLine(orderContactToKeyboardContext(orderContact)) : ((_a = input.actorContext) == null ? void 0 : _a.customerTelegramId) ? `Telegram id:${input.actorContext.customerTelegramId}` : ((_b = input.actorContext) == null ? void 0 : _b.customerMaxUserId) ? `MAX id:${input.actorContext.customerMaxUserId}` : "\u043A\u043E\u043D\u0442\u0430\u043A\u0442 \u0443\u0442\u043E\u0447\u043D\u044F\u0435\u0442\u0441\u044F";
  const orderDetails = await loadOrderDetails(event, input);
  const managerText = buildManagerMessage({
    orderDetails,
    orderId: input.orderContext.orderId,
    brandName,
    branchName,
    branchAddress,
    cityName,
    customerHandle
  });
  const customerText = buildCustomerMessage({
    orderDetails,
    orderId: input.orderContext.orderId,
    brandName,
    branchName,
    branchAddress,
    cityName
  });
  const orderRef = formatOrderRef$2(orderDetails.orderNumber, input.orderContext.orderId);
  const fulfillmentForCustomer = input.orderContext.fulfillmentType || orderDetails.fulfillmentType;
  const customerStatusShortText = buildCustomerOrderStatusShortMessage(orderRef, orderDetails.status, fulfillmentForCustomer);
  const maxBaseUrl = String(config.maxApiBaseUrl || "");
  const maxToken = String(config.maxApiToken || "");
  const maxBotUrl = String(((_c = config.public) == null ? void 0 : _c.maxBotUrl) || "").trim();
  const telegramBotName = String(((_d = config.public) == null ? void 0 : _d.telegramBotName) || "").trim();
  const appUrlBase = String(config.appUrl || "").replace(/\/$/, "");
  const dashboardOrderUrl = appUrlBase ? `${appUrlBase}/dashboard/orders/${encodeURIComponent(input.orderContext.orderId)}` : "";
  const maxBackoffMs = [3e4, 12e4, 6e5];
  const maxEnabledByRuntime = Boolean(maxBaseUrl && maxToken);
  const defaultManagerTelegramChatId = typeof (branchRow == null ? void 0 : branchRow.manager_group_chat_id) === "string" && branchRow.manager_group_chat_id.trim() ? String(branchRow.manager_group_chat_id).trim() : typeof (shopRow == null ? void 0 : shopRow.manager_chat_id) === "string" ? String(shopRow.manager_chat_id).trim() : "";
  for (const recipient of recipients) {
    const key = buildNotificationKey(input.eventType, input.orderContext.orderId, recipient.channel, recipient.targetType, recipient.targetId);
    const isManagerTarget = recipient.targetType === "manager_group" || recipient.targetType === "manager_user";
    const isCustomerTarget = recipient.targetType === "customer";
    if (isCustomerTarget && input.eventType === "ORDER_STATUS_CHANGED" && !customerStatusShortText) {
      continue;
    }
    const text = isManagerTarget && input.eventType === "ORDER_CREATED" ? managerText : isCustomerTarget && input.eventType === "ORDER_STATUS_CHANGED" ? customerStatusShortText || customerText : customerText;
    await upsertNotificationEvent(event, {
      key,
      input,
      channel: recipient.channel,
      conversationId: recipient.conversationId,
      status: "pending"
    });
    try {
      if (recipient.channel === "telegram") {
        const botToken = String((shopRow == null ? void 0 : shopRow.telegram_bot_token) || config.botToken);
        const customerBridgeToken = await createOrderBridgeToken(event, input.tenantContext.shopId, input.orderContext.orderId, "customer");
        const customerMiniAppUrl = customerBridgeToken && telegramBotName ? `https://t.me/${telegramBotName}?startapp=${encodeURIComponent(customerBridgeToken)}` : "";
        const flowConfig = await getUnifiedFlowConfig(event, input.tenantContext.restaurantId);
        const shopBranches = input.eventType === "ORDER_CREATED" && recipient.targetType !== "customer" ? await loadActiveShopBranches(event, input.tenantContext.shopId) : [];
        const contactKeyboardCtx = orderContact ? orderContactToKeyboardContext(orderContact, {
          maxBotUrl,
          allowTelegramUserLink: recipient.targetType === "manager_user"
        }) : {
          orderId: input.orderContext.orderId,
          customerTelegramId: (_f = (_e = input.actorContext) == null ? void 0 : _e.customerTelegramId) != null ? _f : null,
          customerMaxUserId: (_h = (_g = input.actorContext) == null ? void 0 : _g.customerMaxUserId) != null ? _h : null,
          customerPhone: null,
          orderClientChannel: null,
          maxBotUrl,
          allowTelegramUserLink: recipient.targetType === "manager_user"
        };
        const finalManagerKeyboard = input.eventType === "ORDER_CREATED" && recipient.targetType !== "customer" ? buildManagerOrderInlineKeyboard({
          orderId: input.orderContext.orderId,
          fulfillmentType: orderDetails.fulfillmentType,
          orderStatus: orderDetails.status,
          customerTelegramId: contactKeyboardCtx.customerTelegramId,
          customerMaxUserId: contactKeyboardCtx.customerMaxUserId,
          customerPhone: contactKeyboardCtx.customerPhone,
          orderClientChannel: contactKeyboardCtx.orderClientChannel,
          maxBotUrl: contactKeyboardCtx.maxBotUrl,
          allowTelegramUserLink: contactKeyboardCtx.allowTelegramUserLink,
          dashboardOrderUrl,
          etaButtonsEnabled: flowConfig.etaButtonsEnabled,
          etaPresets: flowConfig.etaPresets,
          branchPickerEnabled: shopBranches.length > 1
        }) : null;
        const customerKeyboardRows = [];
        if (recipient.targetType === "customer") {
          if (input.eventType === "ORDER_CREATED") {
            customerKeyboardRows.push([{ text: "\u23F1 \u0421\u043E\u043E\u0431\u0449\u0438\u0442\u044C \u043E \u0437\u0430\u0434\u0435\u0440\u0436\u043A\u0435", callback_data: `clientDelay_${input.orderContext.orderId}` }]);
          }
          if (customerMiniAppUrl) {
            customerKeyboardRows.push([{ text: "\u{1F4F1} \u041E\u0442\u043A\u0440\u044B\u0442\u044C \u0437\u0430\u043A\u0430\u0437", url: customerMiniAppUrl }]);
          }
        }
        const customerKeyboard = customerKeyboardRows.length ? { inline_keyboard: customerKeyboardRows } : null;
        const replyMarkup = finalManagerKeyboard || customerKeyboard || void 0;
        let sentMessageId = null;
        try {
          sentMessageId = await sendTelegramMessage(
            botToken,
            recipient.targetId,
            text,
            { replyMarkup }
          );
        } catch (sendErr) {
          if (replyMarkup) {
            try {
              sentMessageId = await sendTelegramMessage(botToken, recipient.targetId, text);
            } catch (retryErr) {
              throw retryErr;
            }
          } else {
            throw sendErr;
          }
        }
        if (input.eventType === "ORDER_CREATED" && isManagerTarget && sentMessageId != null) {
          await persistManagerTelegramPost(event, {
            shopId: input.tenantContext.shopId,
            orderId: input.orderContext.orderId,
            post: {
              chatId: recipient.targetId,
              messageId: sentMessageId,
              branchId: input.tenantContext.restaurantId
            }
          }).catch((err) => {
            console.error("persistManagerTelegramPost:", err);
          });
        }
      } else {
        if (!maxEnabledByRuntime) {
          await upsertNotificationEvent(event, {
            key,
            input,
            channel: recipient.channel,
            conversationId: recipient.conversationId,
            status: "failed",
            lastError: "max_api_not_configured"
          });
          continue;
        }
        let sent = false;
        let lastError = null;
        for (let attempt = 0; attempt < maxBackoffMs.length; attempt += 1) {
          try {
            const customerBridgeToken = await createOrderBridgeToken(event, input.tenantContext.shopId, input.orderContext.orderId, "customer");
            const customerMaxMiniAppUrl = customerBridgeToken && maxBotUrl ? `${maxBotUrl}${maxBotUrl.includes("?") ? "&" : "?"}startapp=${encodeURIComponent(customerBridgeToken)}&start_param=${encodeURIComponent(customerBridgeToken)}` : "";
            const maxAttachments = [];
            const buttons = [];
            if (recipient.targetType === "customer" && customerMaxMiniAppUrl) {
              buttons.push([{ type: "link", text: "\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u0437\u0430\u043A\u0430\u0437", url: customerMaxMiniAppUrl }]);
            }
            if (recipient.targetType !== "customer") {
              if (dashboardOrderUrl) buttons.push([{ type: "link", text: "\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u0437\u0430\u043A\u0430\u0437 (\u043C\u0435\u043D\u0435\u0434\u0436\u0435\u0440)", url: dashboardOrderUrl }]);
            }
            if (buttons.length) {
              maxAttachments.push({
                type: "inline_keyboard",
                payload: { buttons }
              });
            }
            await sendMaxMessage$1(
              maxBaseUrl,
              maxToken,
              { conversationId: recipient.conversationId, userId: recipient.maxUserId },
              text,
              maxAttachments
            );
            sent = true;
            break;
          } catch (err) {
            lastError = (err == null ? void 0 : err.message) || "max_send_failed";
            await upsertNotificationEvent(event, {
              key,
              input,
              channel: recipient.channel,
              conversationId: recipient.conversationId,
              status: attempt === maxBackoffMs.length - 1 ? "failed" : "retrying",
              lastError
            });
            if (attempt < maxBackoffMs.length - 1) {
              await new Promise((resolve) => setTimeout(resolve, maxBackoffMs[attempt]));
            }
          }
        }
        if (!sent) {
          const maxFailureReason = lastError || "max_retry_exhausted";
          await upsertNotificationEvent(event, {
            key,
            input,
            channel: recipient.channel,
            conversationId: recipient.conversationId,
            status: "failed",
            lastError: maxFailureReason
          });
          let fallbackTelegramTarget = null;
          if (recipient.targetType === "customer") {
            fallbackTelegramTarget = ((_i = input.actorContext) == null ? void 0 : _i.customerTelegramId) ? String(input.actorContext.customerTelegramId) : null;
          } else if (recipient.targetType === "manager_group") {
            fallbackTelegramTarget = defaultManagerTelegramChatId || null;
          }
          if (!fallbackTelegramTarget) {
            throw new Error(`max_fallback_target_missing:${recipient.targetType}`);
          }
          const fallbackKey = buildNotificationKey(
            input.eventType,
            input.orderContext.orderId,
            "telegram",
            recipient.targetType,
            fallbackTelegramTarget
          );
          const botToken = String((shopRow == null ? void 0 : shopRow.telegram_bot_token) || config.botToken);
          await upsertNotificationEvent(event, {
            key: fallbackKey,
            input,
            channel: "telegram",
            conversationId: fallbackTelegramTarget,
            status: "pending"
          });
          try {
            await sendTelegramMessage(botToken, fallbackTelegramTarget, `${text}

[Fallback: MAX \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D]`);
            await upsertNotificationEvent(event, {
              key: fallbackKey,
              input,
              channel: "telegram",
              conversationId: fallbackTelegramTarget,
              status: "sent",
              lastError: `fallback_from_max:${maxFailureReason}`
            });
          } catch (fallbackErr) {
            await upsertNotificationEvent(event, {
              key: fallbackKey,
              input,
              channel: "telegram",
              conversationId: fallbackTelegramTarget,
              status: "failed",
              lastError: (fallbackErr == null ? void 0 : fallbackErr.message) || "telegram_fallback_failed"
            });
            throw fallbackErr;
          }
          continue;
        }
      }
      await upsertNotificationEvent(event, {
        key,
        input,
        channel: recipient.channel,
        conversationId: recipient.conversationId,
        status: "sent"
      });
    } catch (err) {
      await upsertNotificationEvent(event, {
        key,
        input,
        channel: recipient.channel,
        conversationId: recipient.conversationId,
        status: "failed",
        lastError: (err == null ? void 0 : err.message) || "notification_send_failed"
      });
    }
  }
  if (input.eventType === "ORDER_STATUS_CHANGED" && input.orderContext.status === "handed_to_customer") {
    await scheduleReviewPromptsAfterHanded(event, input).catch((err) => {
      console.error("scheduleReviewPromptsAfterHanded:", err);
    });
    await processDueReviewPrompts(event, { limit: 8 }).catch((err) => {
      console.error("processDueReviewPrompts:", err);
    });
  }
}

const SETTINGS_TABLE = "platform_operation_settings";
const ALL_MODES = ["delivery", "pickup", "dine-in"];
const LEGACY_MODE_MAP = {
  "qr-menu": "dine-in",
  "showcase-order": "dine-in"
};
function normalizeModes(input) {
  if (!Array.isArray(input)) return [];
  const items = input.map((item) => String(item).trim().toLowerCase()).map((item) => {
    var _a;
    return (_a = LEGACY_MODE_MAP[item]) != null ? _a : item;
  }).filter((item) => ALL_MODES.includes(item));
  return Array.from(new Set(items));
}
function normalizeStringArray(input) {
  if (!Array.isArray(input)) return [];
  return input.map((item) => String(item).trim().toLowerCase()).filter(Boolean);
}
function getHost(event) {
  var _a, _b, _c, _d, _e, _f;
  const xfHost = typeof ((_c = (_b = (_a = event == null ? void 0 : event.node) == null ? void 0 : _a.req) == null ? void 0 : _b.headers) == null ? void 0 : _c["x-forwarded-host"]) === "string" ? event.node.req.headers["x-forwarded-host"] : "";
  const host = typeof ((_f = (_e = (_d = event == null ? void 0 : event.node) == null ? void 0 : _d.req) == null ? void 0 : _e.headers) == null ? void 0 : _f.host) === "string" ? event.node.req.headers.host : "";
  return (xfHost || host || "").toLowerCase();
}
function hasTestOverride(event, shopId, settings) {
  const host = getHost(event);
  const hostMatched = settings.testOverrideHosts.some((allowed) => allowed && host.includes(allowed));
  const shopMatched = settings.testOverrideShopIds.includes(shopId);
  return hostMatched || shopMatched;
}
async function getPlatformOperationSettings(event) {
  const client = await serverSupabaseServiceRole(event);
  const response = await client.from(SETTINGS_TABLE).select("disabled_fulfillment_modes,test_override_hosts,test_override_shop_ids").eq("id", 1).maybeSingle();
  const row = response.data;
  return {
    disabledFulfillmentModes: normalizeModes(row == null ? void 0 : row.disabled_fulfillment_modes),
    testOverrideHosts: normalizeStringArray(row == null ? void 0 : row.test_override_hosts),
    testOverrideShopIds: normalizeStringArray(row == null ? void 0 : row.test_override_shop_ids)
  };
}
async function applyGlobalFulfillmentPolicy(event, shopId, requested) {
  const settings = await getPlatformOperationSettings(event);
  if (hasTestOverride(event, shopId, settings)) return requested;
  const disabled = new Set(settings.disabledFulfillmentModes);
  const result = requested.filter((mode) => !disabled.has(mode));
  return result;
}

const TABLE_NAME = "organization_style_settings";
const PRESETS_TABLE_NAME = "organization_style_presets";
const MAX_AUDIT_ITEMS = 25;
const HEX_RE = /^#[0-9A-Fa-f]{6}$/;
const HHMM_RE$1 = /^([01]\d|2[0-3]):([0-5]\d)$/;
const memoryStoreKey = "__organization_style_memory_store__";
const presetsMemoryStoreKey = "__organization_style_presets_memory_store__";
const SYSTEM_STYLE_PRESETS = [
  {
    id: "classic-bistro",
    title: "Classic Bistro",
    mood: "\u0422\u0435\u043F\u043B\u044B\u0439, \u0430\u043F\u043F\u0435\u0442\u0438\u0442\u043D\u044B\u0439, \u0443\u043D\u0438\u0432\u0435\u0440\u0441\u0430\u043B\u044C\u043D\u044B\u0439",
    config: {
      tokens: {
        brandPrimary: "#B3472A",
        textOnPrimary: "#FFFFFF",
        brandSecondary: "#D9A441",
        brandAccent: "#6E3B2A",
        surfaceBackground: "#FFF9F5",
        surfaceCard: "#FFFFFF",
        textPrimary: "#2B211E",
        textMuted: "#6B5C56",
        stateSuccess: "#16A34A",
        stateWarning: "#D97706",
        stateError: "#DC2626"
      },
      radii: { button: 10, modal: 16, input: 10, card: 14 }
    }
  },
  {
    id: "modern-minimal",
    title: "Modern Minimal",
    mood: "\u0427\u0438\u0441\u0442\u044B\u0439, \u0442\u0435\u0445\u043D\u043E\u043B\u043E\u0433\u0438\u0447\u043D\u044B\u0439, \u0441\u043F\u043E\u043A\u043E\u0439\u043D\u044B\u0439",
    config: {
      tokens: {
        brandPrimary: "#1F6FEB",
        textOnPrimary: "#FFFFFF",
        brandSecondary: "#7AA2F7",
        brandAccent: "#0EA5E9",
        surfaceBackground: "#F7FAFC",
        surfaceCard: "#FFFFFF",
        textPrimary: "#0F172A",
        textMuted: "#475569",
        stateSuccess: "#16A34A",
        stateWarning: "#D97706",
        stateError: "#DC2626"
      },
      radii: { button: 8, modal: 14, input: 8, card: 12 }
    }
  },
  {
    id: "dark-urban",
    title: "Dark Urban",
    mood: "\u0412\u0435\u0447\u0435\u0440\u043D\u0438\u0439, \u043F\u0440\u0435\u043C\u0438\u0430\u043B\u044C\u043D\u044B\u0439, \u043A\u043E\u043D\u0442\u0440\u0430\u0441\u0442\u043D\u044B\u0439",
    config: {
      tokens: {
        brandPrimary: "#F97316",
        textOnPrimary: "#111827",
        brandSecondary: "#FDBA74",
        brandAccent: "#FB7185",
        surfaceBackground: "#111827",
        surfaceCard: "#1F2937",
        textPrimary: "#F9FAFB",
        textMuted: "#CBD5E1",
        stateSuccess: "#22C55E",
        stateWarning: "#F59E0B",
        stateError: "#EF4444"
      },
      radii: { button: 12, modal: 20, input: 10, card: 16 }
    }
  },
  {
    id: "soft-cafe",
    title: "Soft Cafe",
    mood: "\u041C\u044F\u0433\u043A\u0438\u0439, \u0434\u0440\u0443\u0436\u0435\u043B\u044E\u0431\u043D\u044B\u0439, \u0434\u0435\u0441\u0435\u0440\u0442\u043D\u044B\u0439",
    config: {
      tokens: {
        brandPrimary: "#8B5CF6",
        textOnPrimary: "#FFFFFF",
        brandSecondary: "#C4B5FD",
        brandAccent: "#F472B6",
        surfaceBackground: "#FDF4FF",
        surfaceCard: "#FFFFFF",
        textPrimary: "#3B0764",
        textMuted: "#6B21A8",
        stateSuccess: "#16A34A",
        stateWarning: "#D97706",
        stateError: "#DC2626"
      },
      radii: { button: 14, modal: 24, input: 12, card: 18 }
    }
  }
];
function getDefaultStyleConfig() {
  const first = SYSTEM_STYLE_PRESETS[0];
  return {
    identity: {
      name: "\u0420\u0435\u0441\u0442\u043E\u0440\u0430\u043D",
      shortDescription: "",
      fullDescription: "",
      logoSmallUrl: "",
      logoUrl: "",
      logoLargeUrl: "",
      faviconUrl: "",
      restaurantCardImageUrl: "",
      heroImageUrl: ""
    },
    tokens: { ...first.config.tokens },
    radii: { ...first.config.radii },
    presetId: first.id
  };
}
async function getIdentityFromExistingData(event, shopId) {
  var _a;
  try {
    const client = await serverSupabaseServiceRole(event);
    const [shopRes, restaurantRes] = await Promise.all([
      client.from("shops").select("name,ui_settings").eq("id", shopId).maybeSingle(),
      client.from("restaurants").select("name").eq("shop_id", shopId).eq("is_active", true).order("created_at", { ascending: false }).limit(1).maybeSingle()
    ]);
    const shopData = shopRes == null ? void 0 : shopRes.data;
    const restaurantData = restaurantRes == null ? void 0 : restaurantRes.data;
    const restaurantName = typeof (restaurantData == null ? void 0 : restaurantData.name) === "string" ? restaurantData.name : "";
    const shopName = typeof (shopData == null ? void 0 : shopData.name) === "string" ? shopData.name : "";
    const uiSettings = (_a = shopData == null ? void 0 : shopData.ui_settings) != null ? _a : {};
    const logoUrl = typeof (uiSettings == null ? void 0 : uiSettings.logo_url) === "string" ? uiSettings.logo_url : "";
    const description = typeof (uiSettings == null ? void 0 : uiSettings.description) === "string" ? uiSettings.description : "";
    const base = getDefaultStyleConfig();
    return {
      ...base.identity,
      name: restaurantName || shopName || base.identity.name,
      shortDescription: description,
      fullDescription: description,
      logoSmallUrl: logoUrl,
      logoUrl,
      logoLargeUrl: logoUrl,
      faviconUrl: "",
      restaurantCardImageUrl: "",
      heroImageUrl: ""
    };
  } catch (e) {
    return getDefaultStyleConfig().identity;
  }
}
function getDefaultOrganizationSettings() {
  const defaultWorkingHours = {
    mon: { isOpen: true, openAt: "09:00", closeAt: "22:00" },
    tue: { isOpen: true, openAt: "09:00", closeAt: "22:00" },
    wed: { isOpen: true, openAt: "09:00", closeAt: "22:00" },
    thu: { isOpen: true, openAt: "09:00", closeAt: "22:00" },
    fri: { isOpen: true, openAt: "09:00", closeAt: "22:00" },
    sat: { isOpen: true, openAt: "09:00", closeAt: "22:00" },
    sun: { isOpen: true, openAt: "09:00", closeAt: "22:00" }
  };
  return {
    slug: "",
    displayName: "",
    tagline: "",
    cuisine: "",
    contacts: {
      phone: "",
      max: "",
      telegram: "",
      email: ""
    },
    ops: {
      status: "open",
      minOrderAmount: 500,
      prepTimeMinutes: 30,
      deliveryFee: 150,
      freeDeliveryFrom: 1e3,
      fulfillmentTypes: ["delivery", "pickup"],
      dineInHallMode: "to-table",
      dineInStaffButtons: { waiter: true, hookah: false, requestBill: true },
      orderAcceptanceMode: "manual",
      ordersPaused: false,
      ordersPausedReason: "",
      workingHours: defaultWorkingHours
    },
    locale: {
      currency: "RUB",
      timezone: "Asia/Irkutsk",
      languages: ["ru"]
    },
    tax: {
      vatMode: "none"
    },
    legal: {
      legalName: "",
      inn: "",
      ogrn: ""
    }
  };
}
function getMemoryStore() {
  const root = globalThis;
  if (!root[memoryStoreKey]) {
    root[memoryStoreKey] = /* @__PURE__ */ new Map();
  }
  return root[memoryStoreKey];
}
function getPresetsMemoryStore() {
  const root = globalThis;
  if (!root[presetsMemoryStoreKey]) {
    root[presetsMemoryStoreKey] = /* @__PURE__ */ new Map();
  }
  return root[presetsMemoryStoreKey];
}
function cloneConfig(config) {
  return JSON.parse(JSON.stringify(config));
}
function normalizeAuditEntry(raw) {
  if (!raw || typeof raw !== "object") return null;
  if (typeof raw.at !== "string" || typeof raw.actorUserId !== "string") return null;
  if (raw.action !== "save" && raw.action !== "rollback") return null;
  const notes = Array.isArray(raw.notes) ? raw.notes.filter((item) => typeof item === "string") : [];
  return { at: raw.at, actorUserId: raw.actorUserId, action: raw.action, notes };
}
function normalizeConfig(raw) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x;
  const defaults = getDefaultStyleConfig();
  const config = raw && typeof raw === "object" ? raw : {};
  const legacyLogoUrl = typeof ((_a = config.identity) == null ? void 0 : _a.logoUrl) === "string" ? config.identity.logoUrl : "";
  const nextLogoSmall = typeof ((_b = config.identity) == null ? void 0 : _b.logoSmallUrl) === "string" ? config.identity.logoSmallUrl : legacyLogoUrl;
  const nextLogoLarge = typeof ((_c = config.identity) == null ? void 0 : _c.logoLargeUrl) === "string" ? config.identity.logoLargeUrl : legacyLogoUrl;
  return {
    identity: {
      name: typeof ((_d = config.identity) == null ? void 0 : _d.name) === "string" ? config.identity.name : defaults.identity.name,
      shortDescription: typeof ((_e = config.identity) == null ? void 0 : _e.shortDescription) === "string" ? config.identity.shortDescription : defaults.identity.shortDescription,
      fullDescription: typeof ((_f = config.identity) == null ? void 0 : _f.fullDescription) === "string" ? config.identity.fullDescription : defaults.identity.fullDescription,
      logoSmallUrl: nextLogoSmall || defaults.identity.logoSmallUrl,
      logoUrl: legacyLogoUrl || nextLogoSmall || nextLogoLarge || defaults.identity.logoUrl,
      logoLargeUrl: nextLogoLarge || nextLogoSmall || defaults.identity.logoLargeUrl,
      faviconUrl: typeof ((_g = config.identity) == null ? void 0 : _g.faviconUrl) === "string" ? config.identity.faviconUrl : defaults.identity.faviconUrl,
      restaurantCardImageUrl: typeof ((_h = config.identity) == null ? void 0 : _h.restaurantCardImageUrl) === "string" ? config.identity.restaurantCardImageUrl : defaults.identity.restaurantCardImageUrl,
      heroImageUrl: typeof ((_i = config.identity) == null ? void 0 : _i.heroImageUrl) === "string" ? config.identity.heroImageUrl : defaults.identity.heroImageUrl
    },
    tokens: {
      brandPrimary: typeof ((_j = config.tokens) == null ? void 0 : _j.brandPrimary) === "string" ? config.tokens.brandPrimary : defaults.tokens.brandPrimary,
      textOnPrimary: typeof ((_k = config.tokens) == null ? void 0 : _k.textOnPrimary) === "string" ? config.tokens.textOnPrimary : defaults.tokens.textOnPrimary,
      brandSecondary: typeof ((_l = config.tokens) == null ? void 0 : _l.brandSecondary) === "string" ? config.tokens.brandSecondary : defaults.tokens.brandSecondary,
      brandAccent: typeof ((_m = config.tokens) == null ? void 0 : _m.brandAccent) === "string" ? config.tokens.brandAccent : defaults.tokens.brandAccent,
      surfaceBackground: typeof ((_n = config.tokens) == null ? void 0 : _n.surfaceBackground) === "string" ? config.tokens.surfaceBackground : defaults.tokens.surfaceBackground,
      surfaceCard: typeof ((_o = config.tokens) == null ? void 0 : _o.surfaceCard) === "string" ? config.tokens.surfaceCard : defaults.tokens.surfaceCard,
      textPrimary: typeof ((_p = config.tokens) == null ? void 0 : _p.textPrimary) === "string" ? config.tokens.textPrimary : defaults.tokens.textPrimary,
      textMuted: typeof ((_q = config.tokens) == null ? void 0 : _q.textMuted) === "string" ? config.tokens.textMuted : defaults.tokens.textMuted,
      stateSuccess: typeof ((_r = config.tokens) == null ? void 0 : _r.stateSuccess) === "string" ? config.tokens.stateSuccess : defaults.tokens.stateSuccess,
      stateWarning: typeof ((_s = config.tokens) == null ? void 0 : _s.stateWarning) === "string" ? config.tokens.stateWarning : defaults.tokens.stateWarning,
      stateError: typeof ((_t = config.tokens) == null ? void 0 : _t.stateError) === "string" ? config.tokens.stateError : defaults.tokens.stateError
    },
    radii: {
      button: Number.isFinite((_u = config.radii) == null ? void 0 : _u.button) ? Number(config.radii.button) : defaults.radii.button,
      modal: Number.isFinite((_v = config.radii) == null ? void 0 : _v.modal) ? Number(config.radii.modal) : defaults.radii.modal,
      input: Number.isFinite((_w = config.radii) == null ? void 0 : _w.input) ? Number(config.radii.input) : defaults.radii.input,
      card: Number.isFinite((_x = config.radii) == null ? void 0 : _x.card) ? Number(config.radii.card) : defaults.radii.card
    },
    presetId: typeof config.presetId === "string" ? config.presetId : null
  };
}
function asString(input, fallback = "") {
  return typeof input === "string" ? input : fallback;
}
function asNullableNumber(input) {
  if (input === null || input === void 0 || input === "") return null;
  const value = Number(input);
  return Number.isFinite(value) ? value : null;
}
function normalizeCuisineValue(input) {
  if (typeof input === "string") return input;
  if (Array.isArray(input)) {
    return input.filter((item) => typeof item === "string" && item.trim().length > 0).join(", ");
  }
  return "";
}
function normalizeSettings(raw) {
  var _a;
  const defaults = getDefaultOrganizationSettings();
  const source = raw && typeof raw === "object" ? raw : {};
  const contacts = source.contacts && typeof source.contacts === "object" ? source.contacts : {};
  const ops = source.ops && typeof source.ops === "object" ? source.ops : {};
  const locale = source.locale && typeof source.locale === "object" ? source.locale : {};
  const tax = source.tax && typeof source.tax === "object" ? source.tax : {};
  const legal = source.legal && typeof source.legal === "object" ? source.legal : {};
  const status = ["open", "closed", "coming_soon", "temporarily_unavailable"].includes(ops.status) ? ops.status : defaults.ops.status;
  const orderAcceptanceMode = ["auto", "manual"].includes(ops.orderAcceptanceMode) ? ops.orderAcceptanceMode : defaults.ops.orderAcceptanceMode;
  const vatMode = ["none", "included", "excluded"].includes(tax.vatMode) ? tax.vatMode : defaults.tax.vatMode;
  const fulfillmentRaw = Array.isArray(ops.fulfillmentTypes) ? ops.fulfillmentTypes : defaults.ops.fulfillmentTypes;
  const legacyList = fulfillmentRaw.map((item) => String(item)).filter(
    (item) => ["delivery", "pickup", "dine-in", "qr-menu", "showcase-order"].includes(item)
  );
  const hadShowcase = legacyList.includes("showcase-order");
  const hadQrMenu = legacyList.includes("qr-menu");
  const hadDineIn = legacyList.includes("dine-in");
  const nextFulfillment = /* @__PURE__ */ new Set();
  for (const item of legacyList) {
    if (item === "delivery" || item === "pickup") nextFulfillment.add(item);
    if (item === "dine-in" || item === "qr-menu" || item === "showcase-order") nextFulfillment.add("dine-in");
  }
  const fulfillmentTypes = nextFulfillment.size > 0 ? Array.from(nextFulfillment) : [...defaults.ops.fulfillmentTypes];
  const HALL = ["qr-menu-browse", "to-table", "pickup-point"];
  let dineInHallMode = defaults.ops.dineInHallMode;
  const rawHall = ops.dineInHallMode;
  if (typeof rawHall === "string" && HALL.includes(rawHall)) {
    dineInHallMode = rawHall;
  } else {
    const legacyShowcaseFf = ops.showcaseOrderFulfillment === "pickup-point" ? "pickup-point" : "to-table";
    if (hadShowcase) {
      dineInHallMode = legacyShowcaseFf;
    } else if (hadQrMenu && !hadShowcase) {
      dineInHallMode = "to-table";
    } else if (hadDineIn && !hadQrMenu && !hadShowcase) {
      dineInHallMode = "to-table";
    }
  }
  const staffRaw = ops.dineInStaffButtons && typeof ops.dineInStaffButtons === "object" ? ops.dineInStaffButtons : null;
  const dineInStaffButtons = {
    waiter: typeof (staffRaw == null ? void 0 : staffRaw.waiter) === "boolean" ? staffRaw.waiter : defaults.ops.dineInStaffButtons.waiter,
    hookah: typeof (staffRaw == null ? void 0 : staffRaw.hookah) === "boolean" ? staffRaw.hookah : defaults.ops.dineInStaffButtons.hookah,
    requestBill: typeof (staffRaw == null ? void 0 : staffRaw.requestBill) === "boolean" ? staffRaw.requestBill : defaults.ops.dineInStaffButtons.requestBill
  };
  const dayKeys = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  const sourceWorkingHours = ops.workingHours && typeof ops.workingHours === "object" ? ops.workingHours : {};
  const workingHours = dayKeys.reduce((acc, day) => {
    const rawDay = sourceWorkingHours[day] && typeof sourceWorkingHours[day] === "object" ? sourceWorkingHours[day] : {};
    const fallback = defaults.ops.workingHours[day];
    acc[day] = {
      isOpen: typeof rawDay.isOpen === "boolean" ? rawDay.isOpen : fallback.isOpen,
      openAt: typeof rawDay.openAt === "string" ? rawDay.openAt : fallback.openAt,
      closeAt: typeof rawDay.closeAt === "string" ? rawDay.closeAt : fallback.closeAt
    };
    return acc;
  }, {});
  return {
    slug: asString(source.slug, defaults.slug),
    displayName: asString(source.displayName, defaults.displayName),
    tagline: asString(source.tagline, defaults.tagline),
    cuisine: normalizeCuisineValue(source.cuisine) || defaults.cuisine,
    contacts: {
      phone: asString(contacts.phone, defaults.contacts.phone),
      max: asString((_a = contacts.max) != null ? _a : contacts.whatsapp, defaults.contacts.max),
      telegram: asString(contacts.telegram, defaults.contacts.telegram),
      email: asString(contacts.email, defaults.contacts.email)
    },
    ops: {
      status,
      minOrderAmount: asNullableNumber(ops.minOrderAmount),
      prepTimeMinutes: asNullableNumber(ops.prepTimeMinutes),
      deliveryFee: asNullableNumber(ops.deliveryFee),
      freeDeliveryFrom: asNullableNumber(ops.freeDeliveryFrom),
      fulfillmentTypes,
      dineInHallMode,
      dineInStaffButtons,
      orderAcceptanceMode,
      ordersPaused: Boolean(ops.ordersPaused),
      ordersPausedReason: asString(ops.ordersPausedReason, defaults.ops.ordersPausedReason),
      workingHours
    },
    locale: {
      currency: asString(locale.currency, defaults.locale.currency).toUpperCase().slice(0, 3) || defaults.locale.currency,
      timezone: asString(locale.timezone, defaults.locale.timezone),
      languages: Array.isArray(locale.languages) ? locale.languages.filter((item) => typeof item === "string" && item.trim().length > 0).map((item) => item.trim().toLowerCase()) : defaults.locale.languages
    },
    tax: {
      vatMode
    },
    legal: {
      legalName: asString(legal.legalName, defaults.legal.legalName),
      inn: asString(legal.inn, defaults.legal.inn),
      ogrn: asString(legal.ogrn, defaults.legal.ogrn)
    }
  };
}
function canUseFallback(error) {
  if (!error) return false;
  const code = typeof (error == null ? void 0 : error.code) === "string" ? error.code : "";
  const message = typeof (error == null ? void 0 : error.message) === "string" ? error.message.toLowerCase() : "";
  if (["42P01", "42703", "42501", "PGRST116", "PGRST205"].includes(code)) return true;
  if (message.includes("does not exist")) return true;
  if (message.includes("relation")) return true;
  if (message.includes("column")) return true;
  if (message.includes("permission denied")) return true;
  if (message.includes("no rows")) return true;
  return true;
}
function normalizeRecord(raw) {
  return {
    config: normalizeConfig(raw == null ? void 0 : raw.config),
    prevConfig: (raw == null ? void 0 : raw.prevConfig) ? normalizeConfig(raw.prevConfig) : null,
    auditLog: Array.isArray(raw == null ? void 0 : raw.auditLog) ? raw.auditLog.map(normalizeAuditEntry).filter((item) => !!item) : []
  };
}
async function loadFromDb(event, shopId) {
  var _a;
  const client = await serverSupabaseServiceRole(event);
  const { data, error } = await client.from(TABLE_NAME).select("shop_id,config,prev_config,audit_log").eq("shop_id", shopId).maybeSingle();
  if (error) {
    console.warn("organization style load fallback:", { code: error == null ? void 0 : error.code, message: error == null ? void 0 : error.message });
    if (canUseFallback(error)) return null;
    throw createError({ statusCode: 500, statusMessage: "Failed to load organization style" });
  }
  if (!data) return null;
  return normalizeRecord({
    config: data.config,
    prevConfig: (_a = data.prev_config) != null ? _a : null,
    auditLog: Array.isArray(data.audit_log) ? data.audit_log : []
  });
}
async function saveToDb(event, shopId, record) {
  const client = await serverSupabaseServiceRole(event);
  const payload = {
    shop_id: shopId,
    config: record.config,
    prev_config: record.prevConfig,
    audit_log: record.auditLog
  };
  const { error } = await client.from(TABLE_NAME).upsert(payload, { onConflict: "shop_id" });
  if (!error) return true;
  console.warn("organization style save fallback:", { code: error == null ? void 0 : error.code, message: error == null ? void 0 : error.message });
  if (canUseFallback(error)) return false;
  throw createError({ statusCode: 500, statusMessage: "Failed to save organization style" });
}
function saveToMemory(shopId, record) {
  getMemoryStore().set(shopId, normalizeRecord(record));
}
async function getStyleRecord(event, shopId) {
  const fromDb = await loadFromDb(event, shopId);
  if (fromDb) return fromDb;
  const memory = getMemoryStore().get(shopId);
  if (memory) return normalizeRecord(memory);
  const baseConfig = getDefaultStyleConfig();
  const identity = await getIdentityFromExistingData(event, shopId);
  return normalizeRecord({
    config: {
      ...baseConfig,
      identity
    },
    prevConfig: null,
    auditLog: []
  });
}
async function getOrganizationSettings(event, shopId) {
  var _a, _b, _c, _d, _e, _f, _g;
  const client = await serverSupabaseServiceRole(event);
  const { data, error } = await client.from("shops").select("slug,name,ui_settings,legal_name,inn,ogrn").eq("id", shopId).maybeSingle();
  if (error || !data) {
    throw createError({ statusCode: 500, statusMessage: "Failed to load organization settings" });
  }
  const ui = (_a = data.ui_settings) != null ? _a : {};
  const org = normalizeSettings(ui.organization);
  const displayName = org.displayName || data.name || "";
  const modes = await applyGlobalFulfillmentPolicy(event, shopId, org.ops.fulfillmentTypes);
  return {
    ...org,
    slug: data.slug || "",
    displayName,
    ops: {
      ...org.ops,
      fulfillmentTypes: modes.length ? modes : []
    },
    legal: {
      legalName: ((_c = (_b = data.legal_name) != null ? _b : org.legal.legalName) != null ? _c : "").trim(),
      inn: ((_e = (_d = data.inn) != null ? _d : org.legal.inn) != null ? _e : "").trim(),
      ogrn: ((_g = (_f = data.ogrn) != null ? _f : org.legal.ogrn) != null ? _g : "").trim()
    }
  };
}
async function persistOrganizationSettings(event, shopId, settings) {
  var _a;
  const client = await serverSupabaseServiceRole(event);
  const { data, error } = await client.from("shops").select("ui_settings,name").eq("id", shopId).maybeSingle();
  if (error || !data) {
    throw createError({ statusCode: 500, statusMessage: "Failed to load current shop settings" });
  }
  const currentUi = (_a = data.ui_settings) != null ? _a : {};
  const normalized = normalizeSettings(settings);
  const nextUi = {
    ...currentUi,
    organization: normalized,
    logo_url: normalized.displayName ? currentUi.logo_url : currentUi.logo_url,
    description: currentUi.description
  };
  const payload = {
    slug: normalized.slug,
    ui_settings: nextUi,
    legal_name: normalized.legal.legalName.trim() || null,
    inn: normalized.legal.inn.trim() || null,
    ogrn: normalized.legal.ogrn.trim() || null
  };
  if (normalized.displayName) payload.name = normalized.displayName;
  const update = await client.from("shops").update(payload).eq("id", shopId).select("id");
  if (update.error) {
    throw createError({ statusCode: 500, statusMessage: update.error.message || "Failed to save organization settings" });
  }
}
function normalizePreset(raw) {
  var _a, _b;
  if (!raw || typeof raw !== "object") return null;
  if (typeof raw.id !== "string" || typeof raw.title !== "string") return null;
  return {
    id: raw.id,
    title: raw.title,
    mood: typeof raw.mood === "string" ? raw.mood : "",
    isSystem: Boolean(raw.isSystem),
    config: {
      tokens: normalizeConfig({ tokens: (_a = raw.config) == null ? void 0 : _a.tokens }).tokens,
      radii: normalizeConfig({ radii: (_b = raw.config) == null ? void 0 : _b.radii }).radii
    }
  };
}
async function getCustomPresets(event, shopId) {
  var _a;
  const client = await serverSupabaseServiceRole(event);
  const { data, error } = await client.from(PRESETS_TABLE_NAME).select("id,title,mood,config").eq("shop_id", shopId).order("created_at", { ascending: false }).returns();
  if (error) {
    if (canUseFallback(error)) {
      return ((_a = getPresetsMemoryStore().get(shopId)) != null ? _a : []).map((item) => ({ ...item, isSystem: false }));
    }
    throw createError({ statusCode: 500, statusMessage: "Failed to load custom presets" });
  }
  return (data != null ? data : []).map((row) => normalizePreset({ ...row, isSystem: false })).filter((item) => !!item);
}
async function createCustomPreset(event, shopId, actorUserId, payload) {
  var _a, _b;
  const title = payload.title.trim();
  if (!title || title.length > 60) {
    throw createError({ statusCode: 400, statusMessage: "Preset title must be between 1 and 60 chars" });
  }
  const mood = payload.mood.trim().slice(0, 160);
  const config = {
    tokens: normalizeConfig({ tokens: payload.config.tokens }).tokens,
    radii: normalizeConfig({ radii: payload.config.radii }).radii
  };
  const client = await serverSupabaseServiceRole(event);
  const insert = await client.from(PRESETS_TABLE_NAME).insert({
    shop_id: shopId,
    title,
    mood,
    config,
    created_by: actorUserId
  }).select("id,title,mood,config").maybeSingle();
  if (insert.error || !insert.data) {
    if (canUseFallback(insert.error)) {
      const fallback = {
        id: `custom-${Date.now()}`,
        title,
        mood,
        config,
        isSystem: false
      };
      const existing = (_a = getPresetsMemoryStore().get(shopId)) != null ? _a : [];
      getPresetsMemoryStore().set(shopId, [fallback, ...existing].slice(0, 50));
      return fallback;
    }
    throw createError({ statusCode: 500, statusMessage: ((_b = insert.error) == null ? void 0 : _b.message) || "Failed to create custom preset" });
  }
  const normalized = normalizePreset({ ...insert.data, isSystem: false });
  if (!normalized) {
    throw createError({ statusCode: 500, statusMessage: "Invalid custom preset payload" });
  }
  return normalized;
}
async function persistStyleRecord(event, shopId, record) {
  const normalized = normalizeRecord(record);
  const saved = await saveToDb(event, shopId, normalized);
  if (!saved) saveToMemory(shopId, normalized);
}
function getSystemPresets() {
  return SYSTEM_STYLE_PRESETS.map((item) => ({ ...item, isSystem: true }));
}
function validateOrganizationOperationsSettings(settings) {
  var _a;
  const errors = [];
  const slug = settings.slug.trim().toLowerCase();
  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    errors.push("Slug \u0434\u043E\u043B\u0436\u0435\u043D \u0431\u044B\u0442\u044C \u0432 \u0444\u043E\u0440\u043C\u0430\u0442\u0435 lowercase-kebab-case.");
  }
  if (settings.displayName.trim().length < 2 || settings.displayName.trim().length > 60) {
    errors.push("\u041F\u0443\u0431\u043B\u0438\u0447\u043D\u043E\u0435 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0434\u043E\u043B\u0436\u043D\u043E \u0431\u044B\u0442\u044C \u043E\u0442 2 \u0434\u043E 60 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432.");
  }
  if (settings.tagline.trim().length > 120) errors.push("\u041A\u043E\u0440\u043E\u0442\u043A\u0438\u0439 \u0441\u043B\u043E\u0433\u0430\u043D \u043F\u043E\u0434 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435\u043C \u043D\u0435 \u0434\u043E\u043B\u0436\u0435\u043D \u043F\u0440\u0435\u0432\u044B\u0448\u0430\u0442\u044C 120 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432.");
  if (settings.cuisine.trim().length > 300) errors.push("\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044F \u043A\u0443\u0445\u043D\u0438 \u043D\u0435 \u0434\u043E\u043B\u0436\u043D\u0430 \u043F\u0440\u0435\u0432\u044B\u0448\u0430\u0442\u044C 300 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432.");
  const numericChecks = [
    ["minOrderAmount", settings.ops.minOrderAmount],
    ["prepTimeMinutes", settings.ops.prepTimeMinutes],
    ["deliveryFee", settings.ops.deliveryFee],
    ["freeDeliveryFrom", settings.ops.freeDeliveryFrom]
  ];
  for (const [key, value] of numericChecks) {
    if (value !== null && value < 0) errors.push(`\u041F\u043E\u043B\u0435 ${key} \u043D\u0435 \u043C\u043E\u0436\u0435\u0442 \u0431\u044B\u0442\u044C \u043E\u0442\u0440\u0438\u0446\u0430\u0442\u0435\u043B\u044C\u043D\u044B\u043C.`);
  }
  const dayKeys = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  for (const day of dayKeys) {
    const row = (_a = settings.ops.workingHours) == null ? void 0 : _a[day];
    if (!row) {
      errors.push(`\u041D\u0435 \u0437\u0430\u043F\u043E\u043B\u043D\u0435\u043D \u0433\u0440\u0430\u0444\u0438\u043A \u0434\u043B\u044F \u0434\u043D\u044F ${day}.`);
      continue;
    }
    if (!HHMM_RE$1.test(row.openAt) || !HHMM_RE$1.test(row.closeAt)) {
      errors.push(`\u0412\u0440\u0435\u043C\u044F \u0434\u043B\u044F \u0434\u043D\u044F ${day} \u0434\u043E\u043B\u0436\u043D\u043E \u0431\u044B\u0442\u044C \u0432 \u0444\u043E\u0440\u043C\u0430\u0442\u0435 HH:MM.`);
      continue;
    }
    if (row.isOpen && row.openAt >= row.closeAt) {
      errors.push(`\u0414\u043B\u044F \u0434\u043D\u044F ${day} \u0432\u0440\u0435\u043C\u044F \u043E\u0442\u043A\u0440\u044B\u0442\u0438\u044F \u0434\u043E\u043B\u0436\u043D\u043E \u0431\u044B\u0442\u044C \u0440\u0430\u043D\u044C\u0448\u0435 \u0437\u0430\u043A\u0440\u044B\u0442\u0438\u044F.`);
    }
  }
  if (settings.locale.languages.length === 0) {
    errors.push("\u041D\u0443\u0436\u0435\u043D \u043C\u0438\u043D\u0438\u043C\u0443\u043C \u043E\u0434\u0438\u043D \u044F\u0437\u044B\u043A \u0432\u0438\u0442\u0440\u0438\u043D\u044B.");
  }
  return errors;
}
function validateOrganizationContactsSettings(settings) {
  const errors = [];
  if (settings.contacts.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.contacts.email)) {
    errors.push("\u041D\u0435\u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u044B\u0439 email \u0432 \u043A\u043E\u043D\u0442\u0430\u043A\u0442\u0430\u0445.");
  }
  const legalName = settings.legal.legalName.trim();
  const inn = settings.legal.inn.trim();
  const ogrn = settings.legal.ogrn.trim();
  if (legalName.length < 2 || legalName.length > 160) {
    errors.push("\u042E\u0440\u0438\u0434\u0438\u0447\u0435\u0441\u043A\u043E\u0435 \u043D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435 \u0434\u043E\u043B\u0436\u043D\u043E \u0431\u044B\u0442\u044C \u043E\u0442 2 \u0434\u043E 160 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432.");
  }
  if (!/^\d{10}(\d{2})?$/.test(inn)) {
    errors.push("\u0418\u041D\u041D \u0434\u043E\u043B\u0436\u0435\u043D \u0441\u043E\u0434\u0435\u0440\u0436\u0430\u0442\u044C 10 \u0438\u043B\u0438 12 \u0446\u0438\u0444\u0440.");
  }
  if (!/^\d{13}(\d{2})?$/.test(ogrn)) {
    errors.push("\u041E\u0413\u0420\u041D/\u041E\u0413\u0420\u041D\u0418\u041F \u0434\u043E\u043B\u0436\u0435\u043D \u0441\u043E\u0434\u0435\u0440\u0436\u0430\u0442\u044C 13 \u0438\u043B\u0438 15 \u0446\u0438\u0444\u0440.");
  }
  return errors;
}
function validateOrganizationSettings(settings) {
  return [...validateOrganizationOperationsSettings(settings), ...validateOrganizationContactsSettings(settings)];
}
function validateStyleConfig(config) {
  const errors = [];
  const name = config.identity.name.trim();
  const shortDescription = config.identity.shortDescription.trim();
  const fullDescription = config.identity.fullDescription.trim();
  if (name.length < 2 || name.length > 60) {
    errors.push("\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0440\u0435\u0441\u0442\u043E\u0440\u0430\u043D\u0430 \u0434\u043E\u043B\u0436\u043D\u043E \u0441\u043E\u0434\u0435\u0440\u0436\u0430\u0442\u044C \u043E\u0442 2 \u0434\u043E 60 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432.");
  }
  if (shortDescription.length > 160) {
    errors.push("\u041A\u043E\u0440\u043E\u0442\u043A\u043E\u0435 \u043E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043E\u043B\u0436\u043D\u043E \u0441\u043E\u0434\u0435\u0440\u0436\u0430\u0442\u044C \u043D\u0435 \u0431\u043E\u043B\u0435\u0435 160 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432.");
  }
  if (fullDescription.length > 1e3) {
    errors.push("\u041F\u043E\u043B\u043D\u043E\u0435 \u043E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043E\u043B\u0436\u043D\u043E \u0441\u043E\u0434\u0435\u0440\u0436\u0430\u0442\u044C \u043D\u0435 \u0431\u043E\u043B\u0435\u0435 1000 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432.");
  }
  const tokenEntries = Object.entries(config.tokens);
  for (const [key, value] of tokenEntries) {
    if (!HEX_RE.test(value)) {
      errors.push(`\u041F\u043E\u043B\u0435 ${key} \u0434\u043E\u043B\u0436\u043D\u043E \u0431\u044B\u0442\u044C \u0432 HEX-\u0444\u043E\u0440\u043C\u0430\u0442\u0435 #RRGGBB.`);
    }
  }
  const radiusEntries = Object.entries(config.radii);
  for (const [key, raw] of radiusEntries) {
    const value = Number(raw);
    if (!Number.isFinite(value) || value < 0 || value > 32) {
      errors.push(`\u0421\u043A\u0440\u0443\u0433\u043B\u0435\u043D\u0438\u0435 ${key} \u0434\u043E\u043B\u0436\u043D\u043E \u0431\u044B\u0442\u044C \u0432 \u0434\u0438\u0430\u043F\u0430\u0437\u043E\u043D\u0435 \u043E\u0442 0 \u0434\u043E 32.`);
    }
  }
  return errors;
}
function withAuditEntry(record, actorUserId, action, notes) {
  const entry = {
    at: (/* @__PURE__ */ new Date()).toISOString(),
    actorUserId,
    action,
    notes
  };
  return {
    config: cloneConfig(record.config),
    prevConfig: record.prevConfig ? cloneConfig(record.prevConfig) : null,
    auditLog: [entry, ...record.auditLog].slice(0, MAX_AUDIT_ITEMS)
  };
}

async function fetchShopLoyaltySettings(client, shopId) {
  const { data, error } = await client.from("shop_loyalty_settings").select("*").eq("shop_id", shopId).maybeSingle();
  if (error && error.code !== "PGRST116") {
    console.error("fetchShopLoyaltySettings", error);
    throw createError({ statusCode: 500, message: "Failed to load loyalty settings" });
  }
  if (!data) {
    return {
      shop_id: shopId,
      bonuses_enabled: true,
      allow_simultaneous_bonus_spend_and_earn: false,
      earn_percent_of_subtotal: 5,
      max_order_percent_payable_with_bonus: 25,
      expiry_enabled: false,
      expiry_days_inactivity: null,
      welcome_bonus_amount: 0,
      birthday_bonus_amount: 0,
      review_bonus_amount: 0,
      birthday_bonus_days_before: 7
    };
  }
  return data;
}
async function getCustomerBalance(client, shopId, profileId) {
  const { data, error } = await client.from("shop_customer_balances").select("balance").eq("shop_id", shopId).eq("customer_profile_id", profileId).maybeSingle();
  if (error) {
    console.error("getCustomerBalance", error);
    return 0;
  }
  return typeof (data == null ? void 0 : data.balance) === "number" ? data.balance : 0;
}
async function accrueLoyaltyEarnForPaidOrder(client, orderId, shopId) {
  const { data: order, error: oErr } = await client.from("orders").select("id, shop_id, subtotal, customer_profile_id, status, bonus_amount_spent").eq("id", orderId).eq("shop_id", shopId).maybeSingle();
  if (oErr || !(order == null ? void 0 : order.customer_profile_id)) {
    return;
  }
  if (String(order.status || "").toLowerCase() !== "handed_to_customer") {
    return;
  }
  const settings = await fetchShopLoyaltySettings(client, shopId);
  if (!settings.bonuses_enabled) return;
  const bonusSpent = typeof order.bonus_amount_spent === "number" ? order.bonus_amount_spent : 0;
  if (bonusSpent > 0 && !settings.allow_simultaneous_bonus_spend_and_earn) return;
  const pct = settings.earn_percent_of_subtotal;
  if (pct <= 0) return;
  const earn = Math.floor(order.subtotal * pct / 100);
  if (earn <= 0) return;
  const { error: insErr } = await client.from("loyalty_ledger").insert({
    shop_id: shopId,
    customer_profile_id: order.customer_profile_id,
    order_id: orderId,
    delta: earn,
    reason: "earn_order",
    meta: { subtotal: order.subtotal, percent: pct }
  });
  if ((insErr == null ? void 0 : insErr.code) === "23505") {
    return;
  }
  if (insErr) {
    console.error("accrueLoyaltyEarnForPaidOrder insert:", insErr);
    return;
  }
  const cur = await getCustomerBalance(client, shopId, order.customer_profile_id);
  const { error: upErr } = await client.from("shop_customer_balances").upsert(
    {
      shop_id: shopId,
      customer_profile_id: order.customer_profile_id,
      balance: cur + earn,
      last_activity_at: (/* @__PURE__ */ new Date()).toISOString()
    },
    { onConflict: "shop_id,customer_profile_id" }
  );
  if (upErr) {
    console.error("accrueLoyaltyEarnForPaidOrder balance:", upErr);
  }
}

const WORKING_DAY_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const HHMM_RE = /^([01]\d|2[0-3]):([0-5]\d)$/;
function normalizeWeeklyWorkingHours(input, fallback) {
  const source = input && typeof input === "object" && !Array.isArray(input) ? input : {};
  const out = {};
  for (const day of WORKING_DAY_KEYS) {
    const row = source[day] && typeof source[day] === "object" ? source[day] : {};
    const fallbackRow = fallback[day];
    out[day] = {
      isOpen: typeof row.isOpen === "boolean" ? row.isOpen : fallbackRow.isOpen,
      openAt: typeof row.openAt === "string" && HHMM_RE.test(row.openAt) ? row.openAt : fallbackRow.openAt,
      closeAt: typeof row.closeAt === "string" && HHMM_RE.test(row.closeAt) ? row.closeAt : fallbackRow.closeAt
    };
  }
  return out;
}
function resolveEffectiveWorkingHours(organizationWorkingHours, branchOverride) {
  if (!branchOverride || branchOverride.useOrganizationHours || !branchOverride.workingHours) {
    return organizationWorkingHours;
  }
  return branchOverride.workingHours;
}

function averageRatingsFromRows(rows) {
  const sampleCount = rows.length;
  if (!sampleCount) return { average: null, count: 0 };
  const sum = rows.reduce((acc, x) => acc + Number(x.rating || 0), 0);
  return {
    average: Number((sum / sampleCount).toFixed(2)),
    count: sampleCount
  };
}

async function computePublicRating(event, args) {
  var _a;
  const limit = Math.min(Math.max((_a = args.sampleLimit) != null ? _a : 20, 1), 50);
  const client = await serverSupabaseServiceRole(event);
  let q = client.from("shop_reviews").select("rating,published_at").eq("shop_id", args.shopId).eq("status", "published").order("published_at", { ascending: false }).limit(limit);
  if (args.restaurantId) q = q.eq("restaurant_id", args.restaurantId);
  const { data, error } = await q;
  if (error) return {
    public_rating: null,
    sample_count: 0,
    formula: "\u0420\u0435\u0439\u0442\u0438\u043D\u0433 \u0440\u0430\u0441\u0441\u0447\u0438\u0442\u0430\u043D \u043F\u043E \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u043C 20 \u043E\u043F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u043D\u043D\u044B\u043C \u043E\u0442\u0437\u044B\u0432\u0430\u043C"
  };
  const rows = data != null ? data : [];
  const { average, count } = averageRatingsFromRows(rows);
  if (!count) {
    return {
      public_rating: null,
      sample_count: 0,
      formula: "\u0420\u0435\u0439\u0442\u0438\u043D\u0433 \u0440\u0430\u0441\u0441\u0447\u0438\u0442\u0430\u043D \u043F\u043E \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u043C 20 \u043E\u043F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u043D\u043D\u044B\u043C \u043E\u0442\u0437\u044B\u0432\u0430\u043C"
    };
  }
  return {
    public_rating: average,
    sample_count: count,
    formula: "\u0420\u0435\u0439\u0442\u0438\u043D\u0433 \u0440\u0430\u0441\u0441\u0447\u0438\u0442\u0430\u043D \u043F\u043E \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u043C 20 \u043E\u043F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u043D\u043D\u044B\u043C \u043E\u0442\u0437\u044B\u0432\u0430\u043C"
  };
}
async function computeInternalQualityScore(event, args) {
  var _a;
  const limit = Math.min(Math.max((_a = args.sampleLimit) != null ? _a : 20, 1), 100);
  const client = await serverSupabaseServiceRole(event);
  let q = client.from("shop_reviews").select("rating,created_at").eq("shop_id", args.shopId).order("created_at", { ascending: false }).limit(limit);
  if (args.restaurantId) q = q.eq("restaurant_id", args.restaurantId);
  const { data, error } = await q;
  if (error) return { internal_quality_score: null, sample_count: 0 };
  const rows = data != null ? data : [];
  const { average, count } = averageRatingsFromRows(rows);
  if (!count) return { internal_quality_score: null, sample_count: 0 };
  return {
    internal_quality_score: average,
    sample_count: count
  };
}

function isTargetingEmpty(targeting) {
  if (targeting == null) return true;
  if (typeof targeting !== "object") return true;
  return Object.keys(targeting).length === 0;
}
function campaignMatchesTargeting(targeting, ctx) {
  if (isTargetingEmpty(targeting)) return true;
  if (!ctx.userId) return false;
  const t = targeting;
  if (Array.isArray(t.genders) && t.genders.length > 0) {
    const g = (ctx.gender || "").toLowerCase();
    const allowed = t.genders.map((x) => String(x).toLowerCase());
    if (!g || !allowed.includes(g)) return false;
  }
  if (typeof t.birthday_within_days === "number" && t.birthday_within_days >= 0) {
    if (!ctx.birthDate) return false;
    const next = nextBirthdayDate(ctx.birthDate);
    if (!next) return false;
    const today = startOfDay(/* @__PURE__ */ new Date());
    const diffDays = Math.ceil((next.getTime() - today.getTime()) / (24 * 60 * 60 * 1e3));
    if (diffDays < 0 || diffDays > t.birthday_within_days) return false;
  }
  if (typeof t.min_orders_count === "number" && t.min_orders_count > 0) {
    if (ctx.ordersCount < t.min_orders_count) return false;
  }
  if (typeof t.days_since_last_order_gt === "number" && t.days_since_last_order_gt >= 0) {
    if (ctx.daysSinceLastOrder === null) return false;
    if (ctx.daysSinceLastOrder <= t.days_since_last_order_gt) return false;
  }
  return true;
}
function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function nextBirthdayDate(birthDateIso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(birthDateIso.trim());
  if (!m) return null;
  const month = Number(m[2]) - 1;
  const day = Number(m[3]);
  const now = /* @__PURE__ */ new Date();
  let y = now.getFullYear();
  let next = new Date(y, month, day);
  if (next < startOfDay(now)) {
    y += 1;
    next = new Date(y, month, day);
  }
  return startOfDay(next);
}

function base64Url(buf) {
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
function generateVkPkcePair() {
  const state = crypto$1.randomBytes(18).toString("base64url");
  const codeVerifier = crypto$1.randomBytes(48).toString("base64url");
  const codeChallenge = base64Url(crypto$1.createHash("sha256").update(codeVerifier).digest());
  return { state, codeVerifier, codeChallenge };
}
function buildVkAuthorizeUrl(options) {
  const base = options.baseUrl.replace(/\/$/, "");
  const q = new URLSearchParams();
  q.set("response_type", "code");
  q.set("client_id", options.clientId);
  q.set("redirect_uri", options.redirectUri);
  q.set("state", options.state);
  q.set("code_challenge", options.codeChallenge);
  q.set("code_challenge_method", "S256");
  q.set("scope", options.scope || "email phone vkid.personal_info");
  return `${base}/authorize?${q.toString()}`;
}
async function exchangeVkCode(options) {
  const base = options.baseUrl.replace(/\/$/, "");
  const body = new URLSearchParams();
  body.set("grant_type", "authorization_code");
  body.set("client_id", options.clientId);
  body.set("client_secret", options.clientSecret);
  body.set("redirect_uri", options.redirectUri);
  body.set("code", options.code);
  body.set("code_verifier", options.codeVerifier);
  if (options.deviceId) body.set("device_id", options.deviceId);
  if (options.state) body.set("state", options.state);
  const res = await fetch(`${base}/oauth2/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });
  if (!res.ok) {
    const txt = await res.text();
    throw createError({
      statusCode: 401,
      statusMessage: `VK token exchange failed: ${res.status} ${txt}`
    });
  }
  return await res.json();
}
async function fetchVkUserInfo(options) {
  const base = options.baseUrl.replace(/\/$/, "");
  const res = await fetch(`${base}/oauth2/user_info`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ access_token: options.accessToken })
  });
  if (!res.ok) {
    const txt = await res.text();
    throw createError({
      statusCode: 401,
      statusMessage: `VK user_info failed: ${res.status} ${txt}`
    });
  }
  return await res.json();
}

const serverSupabaseClient = async (event) => {
  if (!event.context._supabaseClient) {
    const { url, key, cookiePrefix, cookieOptions, clientOptions: { auth = {}, global = {} } } = useRuntimeConfig(event).public.supabase;
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

const serverSupabaseServiceRole = (event) => {
  const config = useRuntimeConfig(event);
  const secretKey = config.supabase.secretKey;
  const serviceKey = config.supabase.serviceKey;
  const url = config.public.supabase.url;
  const serverKey = secretKey || serviceKey;
  if (!serverKey) {
    throw new Error("Missing server key. Set either `SUPABASE_SECRET_KEY` (recommended) or `SUPABASE_SERVICE_KEY` (deprecated) in your environment variables.");
  }
  if (!event.context._supabaseServiceRole) {
    event.context._supabaseServiceRole = createClient(url, serverKey, {
      auth: {
        detectSessionInUrl: false,
        persistSession: false,
        autoRefreshToken: false
      },
      global: {
        fetch: fetchWithRetry
      }
    });
  }
  return event.context._supabaseServiceRole;
};

const serverSupabaseUser = async (event) => {
  const client = await serverSupabaseClient(event);
  const { data, error } = await client.auth.getClaims();
  if (error) {
    throw createError({ statusMessage: error?.message });
  }
  return data?.claims ?? null;
};

const CACHE_TTL_MS = 6e4;
const shopCache = /* @__PURE__ */ new Map();
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SHOP_SELECT_WITH_DOMAIN = "id,slug,name,custom_domain,legal_name,inn,ogrn,yookassa_shop_id,yookassa_secret_key,telegram_bot_token,telegram_bot_id,manager_chat_id,integration_keys,ui_settings,is_active";
const SHOP_SELECT_WITH_DOMAIN_LEGACY = "id,slug,name,custom_domain,telegram_bot_token,telegram_bot_id,manager_chat_id,integration_keys,ui_settings,is_active";
const SHOP_SELECT_LEGACY = "id,slug,name,telegram_bot_token,telegram_bot_id,manager_chat_id,integration_keys,ui_settings,is_active";
function getCached(shopId) {
  const hit = shopCache.get(shopId);
  if (!hit) return null;
  if (Date.now() > hit.expiresAt) {
    shopCache.delete(shopId);
    return null;
  }
  return hit.value;
}
function setCached(shopId, value) {
  shopCache.set(shopId, {
    value,
    expiresAt: Date.now() + CACHE_TTL_MS
  });
}
function extractShopIdFromInitData(initData) {
  const params = new URLSearchParams(initData);
  const startParam = params.get("start_param");
  if (!startParam) return null;
  const direct = startParam.match(/shop_(.+)/i);
  if (direct == null ? void 0 : direct[1]) return decodeURIComponent(direct[1]).trim();
  return decodeURIComponent(startParam).trim();
}
function extractBotIdFromInitData(initData) {
  const params = new URLSearchParams(initData);
  const direct = params.get("bot_id");
  if (direct && /^\d+$/.test(direct)) {
    return Number.parseInt(direct, 10);
  }
  return null;
}
async function resolveShopIdFromEvent(event) {
  var _a;
  const query = getQuery$1(event);
  const queryShop = typeof query.shop_id === "string" ? query.shop_id : null;
  if (queryShop == null ? void 0 : queryShop.trim()) return queryShop.trim();
  const headerShop = getHeader(event, "x-shop-id");
  if (headerShop == null ? void 0 : headerShop.trim()) return headerShop.trim();
  const rawInitData = getMessengerInitDataFromEvent(event);
  if (rawInitData == null ? void 0 : rawInitData.trim()) {
    return (_a = extractShopIdFromInitData(rawInitData)) != null ? _a : null;
  }
  return null;
}
async function getShopById(event, shopId) {
  const shopRef = shopId.trim();
  if (!shopRef) return null;
  const cached = getCached(shopRef);
  if (cached) return cached;
  const client = await serverSupabaseServiceRole(event);
  const loadShop = async (selectClause) => {
    const baseQuery = client.from("shops").select(selectClause);
    return UUID_RE.test(shopRef) ? await baseQuery.eq("id", shopRef).maybeSingle() : await baseQuery.eq("slug", shopRef).maybeSingle();
  };
  const tries = [SHOP_SELECT_WITH_DOMAIN, SHOP_SELECT_WITH_DOMAIN_LEGACY, SHOP_SELECT_LEGACY];
  let data = null;
  let error = null;
  for (const clause of tries) {
    const attempt = await loadShop(clause);
    data = attempt.data;
    error = attempt.error;
    if (!error || data) break;
  }
  if (error) {
    throw createError({ statusCode: 500, message: "Failed to read tenant shop config" });
  }
  if (!data) return null;
  const shop = data;
  setCached(shopRef, shop);
  setCached(shop.id, shop);
  setCached(shop.slug, shop);
  if (shop.custom_domain) setCached(shop.custom_domain, shop);
  return shop;
}
async function getShopByCustomDomain(event, host) {
  const normalizedHost = host.trim().toLowerCase();
  if (!normalizedHost) return null;
  const cached = getCached(normalizedHost);
  if (cached) return cached;
  const client = await serverSupabaseServiceRole(event);
  const { data, error } = await client.from("shops").select(SHOP_SELECT_WITH_DOMAIN).eq("custom_domain", normalizedHost).maybeSingle();
  if (error) {
    if (/custom_domain/i.test(error.message)) {
      return null;
    }
    throw createError({ statusCode: 500, message: "Failed to read tenant by custom domain" });
  }
  if (!data) return null;
  const shop = data;
  setCached(normalizedHost, shop);
  setCached(shop.id, shop);
  setCached(shop.slug, shop);
  if (shop.custom_domain) setCached(shop.custom_domain, shop);
  return shop;
}
async function getShopByBotId(event, botId) {
  const client = await serverSupabaseServiceRole(event);
  const loadShop = async (selectClause) => client.from("shops").select(selectClause).eq("telegram_bot_id", botId).maybeSingle();
  const tries = [SHOP_SELECT_WITH_DOMAIN, SHOP_SELECT_WITH_DOMAIN_LEGACY, SHOP_SELECT_LEGACY];
  let data = null;
  let error = null;
  for (const clause of tries) {
    const attempt = await loadShop(clause);
    data = attempt.data;
    error = attempt.error;
    if (!error || data) break;
  }
  if (error) {
    throw createError({ statusCode: 500, message: "Failed to read tenant by bot id" });
  }
  if (!data) return null;
  const shop = data;
  setCached(shop.id, shop);
  setCached(shop.slug, shop);
  if (shop.custom_domain) setCached(shop.custom_domain, shop);
  return shop;
}
async function requireTenantShop(event) {
  var _a;
  const query = getQuery$1(event);
  const queryShopRaw = typeof query.shop_id === "string" ? query.shop_id.trim() : "";
  if (queryShopRaw) {
    const shop2 = await getShopById(event, queryShopRaw);
    if (!shop2 || !shop2.is_active) {
      throw createError({ statusCode: 404, message: "Shop not found" });
    }
    return { shopId: shop2.id, shop: shop2 };
  }
  const tenant = event.context.tenant;
  if ((tenant == null ? void 0 : tenant.shopId) && ((_a = tenant.shop) == null ? void 0 : _a.is_active)) {
    return { shopId: tenant.shopId, shop: tenant.shop };
  }
  const ref = await resolveShopIdFromEvent(event);
  if (!ref) {
    throw createError({ statusCode: 400, message: "Missing shop_id" });
  }
  const shop = await getShopById(event, ref);
  if (!shop || !shop.is_active) {
    throw createError({ statusCode: 404, message: "Shop not found" });
  }
  return { shopId: shop.id, shop };
}
async function resolveCanonicalTenantCartPath(event, shop) {
  var _a, _b, _c;
  const config = useRuntimeConfig();
  const defaultCitySlugRaw = typeof ((_a = config.public) == null ? void 0 : _a.defaultCitySlug) === "string" ? config.public.defaultCitySlug : "";
  const defaultCitySlug = defaultCitySlugRaw.trim() || "ulan-ude";
  const client = await serverSupabaseServiceRole(event);
  const { data: restaurants } = await client.from("restaurants").select("city_id,is_active").eq("shop_id", shop.id).eq("is_active", true).order("created_at", { ascending: true }).limit(1);
  let citySlug = defaultCitySlug;
  const cityId = Array.isArray(restaurants) && ((_b = restaurants[0]) == null ? void 0 : _b.city_id) ? String(restaurants[0].city_id) : "";
  if (cityId) {
    const { data: cityRow } = await client.from("cities").select("slug").eq("id", cityId).maybeSingle();
    if ((_c = cityRow == null ? void 0 : cityRow.slug) == null ? void 0 : _c.trim()) {
      citySlug = cityRow.slug.trim();
    }
  }
  const tenantSlug = shop.slug.trim();
  const cartPath = `/${citySlug}/${tenantSlug}/cart`;
  const checkoutPath = `/${citySlug}/${tenantSlug}/checkout`;
  return { citySlug, tenantSlug, cartPath, checkoutPath };
}

const REQUIRED_PATHS = [
  "/api/tenant",
  "/api/stories"
];
const CUSTOM_DOMAIN_REWRITE_PATHS = /* @__PURE__ */ new Set(["/"]);
function normalizeHost(host) {
  if (!host) return null;
  return host.trim().toLowerCase().replace(/:\d+$/, "") || null;
}
function getPlatformBaseHost() {
  var _a;
  const config = useRuntimeConfig();
  const explicit = typeof ((_a = config.public) == null ? void 0 : _a.platformBaseDomain) === "string" ? config.public.platformBaseDomain : "";
  if (explicit.trim()) return normalizeHost(explicit);
  const appUrl = typeof config.appUrl === "string" ? config.appUrl : "";
  if (!appUrl) return null;
  try {
    return normalizeHost(new URL(appUrl).host);
  } catch {
    return null;
  }
}
function isPlatformHost(host, baseHost) {
  if (!host) return false;
  if (host === "localhost" || host === "127.0.0.1") return true;
  if (!baseHost) return false;
  return host === baseHost || host.endsWith(`.${baseHost}`);
}
function extractTenantSlugFromPath(path, defaultCitySlug) {
  const segments = path.split("?")[0].split("/").filter(Boolean);
  const [firstSegment, secondSegment] = segments;
  if (!firstSegment) return null;
  if ([
    "api",
    "_nuxt",
    "__nuxt_error",
    "profile",
    "dashboard",
    "onboarding",
    "login",
    "register",
    "partners",
    "platform",
    "link-telegram",
    "link-max",
    "link-vk",
    "events",
    "venues",
    "map",
    "favorites",
    "bookings",
    "legal"
  ].includes(firstSegment)) return null;
  if (/\.[a-z0-9]+$/i.test(firstSegment)) return null;
  if (defaultCitySlug && firstSegment === defaultCitySlug) {
    if (secondSegment === "festival" || secondSegment === "events" || secondSegment === "venues" || secondSegment === "map") {
      return null;
    }
    return secondSegment != null ? secondSegment : null;
  }
  return firstSegment;
}
function shouldRewriteCustomDomainPath(path) {
  const normalizedPath = (path.split("?")[0] || "/").replace(/\/+$/, "") || "/";
  return CUSTOM_DOMAIN_REWRITE_PATHS.has(normalizedPath);
}
function extractCityAndTenantFromPath(path) {
  const segments = path.split("?")[0].split("/").filter(Boolean);
  if (segments.length < 2) return null;
  const [citySlug, tenantSlug] = segments;
  if (!citySlug || !tenantSlug) return null;
  if ([
    "api",
    "_nuxt",
    "__nuxt_error",
    "profile",
    "dashboard",
    "onboarding",
    "login",
    "register",
    "partners",
    "platform",
    "link-telegram",
    "link-max",
    "link-vk",
    "events",
    "venues",
    "map",
    "favorites",
    "bookings",
    "legal"
  ].includes(citySlug)) return null;
  if (tenantSlug === "festival" || tenantSlug === "events" || tenantSlug === "venues") return null;
  if (/\.[a-z0-9]+$/i.test(citySlug) || /\.[a-z0-9]+$/i.test(tenantSlug)) return null;
  return { citySlug, tenantSlug };
}
const _Fv4zcQ = defineEventHandler(async (event) => {
  var _a, _b, _c;
  const path = event.path || "";
  const config = useRuntimeConfig();
  const defaultCitySlug = typeof ((_a = config.public) == null ? void 0 : _a.defaultCitySlug) === "string" ? config.public.defaultCitySlug : null;
  const requestHost = normalizeHost(getHeader(event, "x-forwarded-host") || getHeader(event, "host"));
  const platformBaseHost = getPlatformBaseHost();
  const isCustomDomain = !!requestHost && !isPlatformHost(requestHost, platformBaseHost);
  let shop = isCustomDomain && requestHost ? await getShopByCustomDomain(event, requestHost) : null;
  const shopId = await resolveShopIdFromEvent(event);
  const isRequired = REQUIRED_PATHS.some((prefix) => path.startsWith(prefix));
  if (!shop && shopId) {
    shop = await getShopById(event, shopId);
  }
  if (!shop && !path.startsWith("/api/")) {
    const slugFromPath = extractTenantSlugFromPath(path, defaultCitySlug);
    if (slugFromPath) {
      shop = await getShopById(event, slugFromPath);
    }
  }
  if (!shop) {
    const initData = getMessengerInitDataFromEvent(event);
    if (initData) {
      const botId = extractBotIdFromInitData(initData);
      if (botId) {
        shop = await getShopByBotId(event, botId);
      }
      if (!shop) {
        const shopRef = extractShopIdFromInitData(initData);
        if (shopRef) {
          shop = await getShopById(event, shopRef);
        }
      }
    }
  }
  if (!shop) {
    if (!path.startsWith("/api/")) {
      const cityAndTenant = extractCityAndTenantFromPath(path);
      if (cityAndTenant) {
        return sendRedirect(event, `/${cityAndTenant.citySlug}/`, 302);
      }
      return;
    }
    if (isRequired) {
      throw createError({ statusCode: 404, message: "Shop not found" });
    }
    return;
  }
  if (!shop.is_active) {
    throw createError({ statusCode: 403, message: "Shop is inactive" });
  }
  let uiSettings = (_b = shop.ui_settings) != null ? _b : {};
  let shopName = shop.name;
  if (!path.startsWith("/api/")) {
    try {
      const record = await getStyleRecord(event, shop.id);
      const cfg = record.config;
      const nextSmallLogo = typeof cfg.identity.logoSmallUrl === "string" ? cfg.identity.logoSmallUrl.trim() : "";
      const nextLargeLogo = typeof cfg.identity.logoLargeUrl === "string" ? cfg.identity.logoLargeUrl.trim() : "";
      const nextLogo = nextSmallLogo || (typeof cfg.identity.logoUrl === "string" ? cfg.identity.logoUrl.trim() : "");
      const nextDesc = typeof cfg.identity.shortDescription === "string" ? cfg.identity.shortDescription.trim() : "";
      const fallbackLogo = typeof (uiSettings == null ? void 0 : uiSettings.logo_url) === "string" ? uiSettings.logo_url : "";
      const fallbackDesc = typeof (uiSettings == null ? void 0 : uiSettings.description) === "string" ? uiSettings.description : "";
      uiSettings = {
        ...uiSettings,
        logo_url: nextLogo || fallbackLogo,
        logo_large_url: nextLargeLogo || nextLogo || fallbackLogo,
        description: nextDesc || fallbackDesc,
        ...deriveTenantThemeFromStyle$1(cfg),
        radius_button: `${cfg.radii.button}px`,
        radius_modal: `${cfg.radii.modal}px`,
        radius_input: `${cfg.radii.input}px`,
        radius_card: `${cfg.radii.card}px`
      };
      shopName = cfg.identity.name || shopName;
      shop.name = shopName;
    } catch {
    }
  }
  event.context.tenant = {
    shopId: shop.id,
    shop,
    telegramBotToken: shop.telegram_bot_token,
    integrationKeys: (_c = shop.integration_keys) != null ? _c : {},
    uiSettings,
    isCustomDomain
  };
  if (!path.startsWith("/api/") && isCustomDomain && shouldRewriteCustomDomainPath(path)) {
    const url = new URL(event.node.req.url || path, "http://internal.local");
    const normalizedPath = (url.pathname.replace(/\/+$/, "") || "/") === "/" ? "" : url.pathname.replace(/\/+$/, "");
    url.pathname = `/${shop.slug}${normalizedPath}`;
    event.node.req.url = `${url.pathname}${url.search}`;
  }
});
function hexToRgb$1(hex) {
  if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) return null;
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16)
  };
}
function mixHex$1(a, b, amount) {
  const aRgb = hexToRgb$1(a);
  const bRgb = hexToRgb$1(b);
  if (!aRgb || !bRgb) return a;
  const t = Math.max(0, Math.min(1, amount));
  const r = Math.round(aRgb.r * (1 - t) + bRgb.r * t);
  const g = Math.round(aRgb.g * (1 - t) + bRgb.g * t);
  const bl = Math.round(aRgb.b * (1 - t) + bRgb.b * t);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${bl.toString(16).padStart(2, "0")}`;
}
function deriveTenantThemeFromStyle$1(cfg) {
  var _a, _b, _c, _d;
  const primary = typeof ((_a = cfg == null ? void 0 : cfg.colors) == null ? void 0 : _a.primary) === "string" ? cfg.colors.primary : "#111827";
  const secondary = typeof ((_b = cfg == null ? void 0 : cfg.colors) == null ? void 0 : _b.secondary) === "string" ? cfg.colors.secondary : "#6b7280";
  const textPrimary = typeof ((_c = cfg == null ? void 0 : cfg.colors) == null ? void 0 : _c.textPrimary) === "string" ? cfg.colors.textPrimary : "#111827";
  const surfaceCard = typeof ((_d = cfg == null ? void 0 : cfg.colors) == null ? void 0 : _d.surfaceCard) === "string" ? cfg.colors.surfaceCard : "#ffffff";
  return {
    primary,
    primary_50: mixHex$1(primary, "#ffffff", 0.92),
    primary_100: mixHex$1(primary, "#ffffff", 0.85),
    secondary,
    text_primary: textPrimary,
    surface_card: surfaceCard,
    on_primary: "#ffffff"
  };
}

const VueResolver = (_, value) => {
  return isRef(value) ? toValue(value) : value;
};

const headSymbol = "usehead";
// @__NO_SIDE_EFFECTS__
function vueInstall(head) {
  const plugin = {
    install(app) {
      app.config.globalProperties.$unhead = head;
      app.config.globalProperties.$head = head;
      app.provide(headSymbol, head);
    }
  };
  return plugin.install;
}

// @__NO_SIDE_EFFECTS__
function resolveUnrefHeadInput(input) {
  return walkResolver(input, VueResolver);
}

function filterIslandProps(props) {
  if (!props) {
    return {};
  }
  const out = {};
  for (const key in props) {
    if (!key.startsWith("data-v-")) {
      out[key] = props[key];
    }
  }
  return out;
}
function computeIslandHash(name, filteredProps, context, source) {
  return hash$1([name, filteredProps, context, source]).replace(/[-_]/g, "");
}

const NUXT_RUNTIME_PAYLOAD_EXTRACTION = false;

// @__NO_SIDE_EFFECTS__
function createHead(options = {}) {
  const head = createHead$1({
    ...options,
    propResolvers: [VueResolver]
  });
  head.install = vueInstall(head);
  return head;
}

const unheadOptions = {
  disableDefaults: true,
  disableCapoSorting: false,
  plugins: [DeprecationsPlugin, PromisesPlugin, TemplateParamsPlugin, AliasSortingPlugin],
};

function encodeEventPath(path) {
	const queryIndex = path.indexOf("?");
	if (queryIndex === -1) {
		return encodePath(path);
	}
	return encodePath(path.slice(0, queryIndex)) + path.slice(queryIndex);
}
function createSSRContext(event) {
	const url = encodeEventPath(event.path);
	const ssrContext = {
		url,
		event,
		runtimeConfig: useRuntimeConfig(event),
		noSSR: event.context.nuxt?.noSSR || (false),
		head: createHead(unheadOptions),
		error: false,
		nuxt: undefined,
		payload: {},
		["~payloadReducers"]: Object.create(null),
		modules: new Set()
	};
	return ssrContext;
}
function setSSRError(ssrContext, error) {
	ssrContext.error = true;
	ssrContext.payload = { error };
	ssrContext.url = error.url;
}

// @ts-expect-error private property consumed by vite-generated url helpers
globalThis.__buildAssetsURL = buildAssetsURL;
// @ts-expect-error private property consumed by vite-generated url helpers
globalThis.__publicAssetsURL = publicAssetsURL;
const APP_ROOT_OPEN_TAG = `<${appRootTag}${propsToString(appRootAttrs)}>`;
const APP_ROOT_CLOSE_TAG = `</${appRootTag}>`;
// @ts-expect-error file will be produced after app build
const getServerEntry = () => Promise.resolve().then(function () { return server; }).then((r) => r.default || r);
// @ts-expect-error file will be produced after app build
const getClientManifest = () => Promise.resolve().then(function () { return client_manifest$1; }).then((r) => r.default || r).then((r) => typeof r === "function" ? r() : r);

const getSSRRenderer = lazyCachedFunction(async () => {
	
	const createSSRApp = await getServerEntry();
	if (!createSSRApp) {
		throw new Error("Server bundle is not available");
	}
	
	const precomputed = undefined ;
	
	const renderer = createRenderer(createSSRApp, {
		precomputed,
		manifest: await getClientManifest() ,
		renderToString: renderToString$1,
		buildAssetsURL
	});
	async function renderToString$1(input, context) {
		const html = await renderToString(input, context);
		
		
		if (process.env.NUXT_VITE_NODE_OPTIONS) {
			renderer.rendererContext.updateManifest(await getClientManifest());
		}
		return APP_ROOT_OPEN_TAG + html + APP_ROOT_CLOSE_TAG;
	}
	return renderer;
});

const getSPARenderer = lazyCachedFunction(async () => {
	const precomputed = undefined ;
	// @ts-expect-error virtual file
	const spaTemplate = await Promise.resolve().then(function () { return _virtual__spaTemplate; }).then((r) => r.template).catch(() => "").then((r) => {
		{
			return APP_ROOT_OPEN_TAG + r + APP_ROOT_CLOSE_TAG;
		}
	});
	
	const renderer = createRenderer(() => () => {}, {
		precomputed,
		manifest: await getClientManifest() ,
		renderToString: () => spaTemplate,
		buildAssetsURL
	});
	const result = await renderer.renderToString({});
	const renderToString = (ssrContext) => {
		const config = useRuntimeConfig(ssrContext.event);
		ssrContext.modules ||= new Set();
		ssrContext.payload.serverRendered = false;
		ssrContext.config = {
			public: config.public,
			app: config.app
		};
		return Promise.resolve(result);
	};
	return {
		rendererContext: renderer.rendererContext,
		renderToString
	};
});
function lazyCachedFunction(fn) {
	let res = null;
	return () => {
		if (res === null) {
			res = fn().catch((err) => {
				res = null;
				throw err;
			});
		}
		return res;
	};
}
function getRenderer(ssrContext) {
	return ssrContext.noSSR ? getSPARenderer() : getSSRRenderer();
}
// @ts-expect-error file will be produced after app build
const getSSRStyles = lazyCachedFunction(() => Promise.resolve().then(function () { return styles$1; }).then((r) => r.default || r));

async function renderInlineStyles(usedModules) {
	const styleMap = await getSSRStyles();
	const inlinedStyles = new Set();
	for (const mod of usedModules) {
		if (mod in styleMap && styleMap[mod]) {
			for (const style of await styleMap[mod]()) {
				inlinedStyles.add(style);
			}
		}
	}
	return Array.from(inlinedStyles).map((style) => ({ innerHTML: style }));
}

// @ts-expect-error virtual file
const ROOT_NODE_REGEX = new RegExp(`^<${appRootTag}[^>]*>([\\s\\S]*)<\\/${appRootTag}>$`);

function getServerComponentHTML(body) {
	const match = body.match(ROOT_NODE_REGEX);
	return match?.[1] || body;
}
const SSR_SLOT_TELEPORT_MARKER = /^uid=([^;]*);slot=(.*)$/;
const SSR_CLIENT_TELEPORT_MARKER = /^uid=([^;]*);client=(.*)$/;
const SSR_CLIENT_SLOT_MARKER = /^island-slot=([^;]*);(.*)$/;
function getSlotIslandResponse(ssrContext) {
	if (!ssrContext.islandContext || !Object.keys(ssrContext.islandContext.slots).length) {
		return undefined;
	}
	const response = {};
	for (const [name, slot] of Object.entries(ssrContext.islandContext.slots)) {
		response[name] = {
			...slot,
			fallback: ssrContext.teleports?.[`island-fallback=${name}`]
		};
	}
	return response;
}
function getClientIslandResponse(ssrContext) {
	if (!ssrContext.islandContext || !Object.keys(ssrContext.islandContext.components).length) {
		return undefined;
	}
	const response = {};
	for (const [clientUid, component] of Object.entries(ssrContext.islandContext.components)) {
		
		const html = ssrContext.teleports?.[clientUid]?.replaceAll("<!--teleport start anchor-->", "") || "";
		response[clientUid] = {
			...component,
			html,
			slots: getComponentSlotTeleport(clientUid, ssrContext.teleports ?? {})
		};
	}
	return response;
}
function getComponentSlotTeleport(clientUid, teleports) {
	const entries = Object.entries(teleports);
	const slots = {};
	for (const [key, value] of entries) {
		const match = key.match(SSR_CLIENT_SLOT_MARKER);
		if (match) {
			const [, id, slot] = match;
			if (!slot || clientUid !== id) {
				continue;
			}
			slots[slot] = value;
		}
	}
	return slots;
}
function replaceIslandTeleports(ssrContext, html) {
	const { teleports, islandContext } = ssrContext;
	if (islandContext || !teleports) {
		return html;
	}
	for (const key in teleports) {
		const matchClientComp = key.match(SSR_CLIENT_TELEPORT_MARKER);
		if (matchClientComp) {
			const [, uid, clientId] = matchClientComp;
			if (!uid || !clientId) {
				continue;
			}
			html = html.replace(new RegExp(` data-island-uid="${uid}" data-island-component="${clientId}"[^>]*>`), (full) => {
				return full + teleports[key];
			});
			continue;
		}
		const matchSlot = key.match(SSR_SLOT_TELEPORT_MARKER);
		if (matchSlot) {
			const [, uid, slot] = matchSlot;
			if (!uid || !slot) {
				continue;
			}
			html = html.replace(new RegExp(` data-island-uid="${uid}" data-island-slot="${slot}"[^>]*>`), (full) => {
				return full + teleports[key];
			});
		}
	}
	return html;
}

const ISLAND_SUFFIX_RE = /\.json(?:\?.*)?$/;
const handler$1 = defineEventHandler(async (event) => {
	const nitroApp = useNitroApp();
	setResponseHeaders(event, {
		"content-type": "application/json;charset=utf-8",
		"x-powered-by": "Nuxt"
	});
	const islandContext = await getIslandContext(event);
	const ssrContext = {
		...createSSRContext(event),
		islandContext,
		noSSR: false,
		url: islandContext.url
	};
	
	const renderer = await getSSRRenderer();
	const renderResult = await renderer.renderToString(ssrContext).catch(async (err) => {
		if (ssrContext["~renderResponse"] && err?.message === "skipping render") {
			return {};
		}
		await ssrContext.nuxt?.hooks.callHook("app:error", err);
		throw err;
	});
	
	
	await ssrContext.nuxt?.hooks.callHook("app:rendered", {
		ssrContext,
		renderResult
	});
	if (ssrContext["~renderResponse"]) {
		const response = ssrContext["~renderResponse"];
		if (response.statusCode && response.statusCode >= 400) {
			throw createError({
				statusCode: response.statusCode,
				statusMessage: response.statusMessage
			});
		}
		return returnIslandResponse(event, response);
	}
	
	if (ssrContext.payload?.error) {
		throw ssrContext.payload.error;
	}
	const inlinedStyles = await renderInlineStyles(ssrContext.modules ?? []);
	if (inlinedStyles.length) {
		ssrContext.head.push({ style: inlinedStyles });
	}
	{
		const { styles } = getRequestDependencies(ssrContext, renderer.rendererContext);
		const link = [];
		for (const resource of Object.values(styles)) {
			
			if ("inline" in getQuery(resource.file)) {
				continue;
			}
			
			
			if (resource.file.includes("scoped") && !resource.file.includes("pages/")) {
				link.push({
					rel: "stylesheet",
					href: renderer.rendererContext.buildAssetsURL(resource.file),
					crossorigin: ""
				});
			}
		}
		if (link.length) {
			ssrContext.head.push({ link }, { mode: "server" });
		}
	}
	const islandHead = {};
	for (const entry of ssrContext.head.entries.values()) {
		
		for (const [key, value] of Object.entries(resolveUnrefHeadInput(entry.input))) {
			const currentValue = islandHead[key];
			if (Array.isArray(currentValue)) {
				currentValue.push(...value);
			} else {
				islandHead[key] = value;
			}
		}
	}
	
	islandHead.link ||= [];
	islandHead.style ||= [];
	const islandResponse = {
		id: islandContext.id,
		head: islandHead,
		html: getServerComponentHTML(renderResult.html),
		components: getClientIslandResponse(ssrContext),
		slots: getSlotIslandResponse(ssrContext)
	};
	await nitroApp.hooks.callHook("render:island", islandResponse, {
		event,
		islandContext
	});
	return islandResponse;
});
function returnIslandResponse(event, response) {
	for (const header in response.headers || {}) {
		setResponseHeader(event, header, response.headers[header]);
	}
	if (response.statusCode) {
		setResponseStatus(event, response.statusCode, response.statusMessage);
	}
	return response.body;
}
const ISLAND_PATH_PREFIX = "/__nuxt_island/";
const VALID_COMPONENT_NAME_RE = /^[a-z][\w.-]*$/i;
async function getIslandContext(event) {
	let url = event.path || "";
	url.replace(/\?.*$/, "");
	if (!url.startsWith(ISLAND_PATH_PREFIX)) {
		throw createError({
			statusCode: 400,
			statusMessage: "Invalid island request path"
		});
	}
	const componentParts = url.substring(ISLAND_PATH_PREFIX.length).replace(ISLAND_SUFFIX_RE, "").split("_");
	const hashId = componentParts.length > 1 ? componentParts.pop() : undefined;
	const componentName = componentParts.join("_");
	if (!componentName || !VALID_COMPONENT_NAME_RE.test(componentName)) {
		throw createError({
			statusCode: 400,
			statusMessage: "Invalid island component name"
		});
	}
	const rawContext = event.method === "GET" ? getQuery$1(event) : await readBody(event);
	const rawProps = destr$1(rawContext?.props) || {};
	const filteredProps = filterIslandProps(rawProps);
	
	
	const clientContext = {};
	if (rawContext && typeof rawContext === "object") {
		for (const key in rawContext) {
			if (key !== "props") {
				clientContext[key] = rawContext[key];
			}
		}
	}
	
	
	const expectedHash = computeIslandHash(componentName, filteredProps, clientContext, undefined);
	if (!hashId || hashId !== expectedHash) {
		throw createError({
			statusCode: 400,
			statusMessage: "Invalid island request hash"
		});
	}
	return {
		url: typeof rawContext?.url === "string" ? rawContext.url : "/",
		id: hashId,
		name: componentName,
		props: rawProps,
		slots: {},
		components: {}
	};
}

const _lazy_RvwyMH = () => Promise.resolve().then(function () { return exchangeMaxSession_post$1; });
const _lazy_03WsRB = () => Promise.resolve().then(function () { return exchangeTelegramSession_post$1; });
const _lazy_w3cdvs = () => Promise.resolve().then(function () { return exchangeVkSession_post$1; });
const _lazy_C99VEe = () => Promise.resolve().then(function () { return linkMax_post$1; });
const _lazy_FNAjmw = () => Promise.resolve().then(function () { return linkTelegram_post$1; });
const _lazy_FzDv_F = () => Promise.resolve().then(function () { return maxLinkStatus_get$1; });
const _lazy_o75NtK = () => Promise.resolve().then(function () { return requestMaxLink_post$1; });
const _lazy_8DMAwn = () => Promise.resolve().then(function () { return requestTelegramLink_post$1; });
const _lazy_Nqu4P_ = () => Promise.resolve().then(function () { return requestVkLink_post$1; });
const _lazy_2P2Wrf = () => Promise.resolve().then(function () { return telegramLinkStatus_get$1; });
const _lazy_3Q5gl_ = () => Promise.resolve().then(function () { return callback_get$1; });
const _lazy_fza5HK = () => Promise.resolve().then(function () { return vkLinkStatus_get$1; });
const _lazy_cZSPXT = () => Promise.resolve().then(function () { return cities_get$3; });
const _lazy_s7B7a4 = () => Promise.resolve().then(function () { return _eventSlug__get$1; });
const _lazy_Prd3G_ = () => Promise.resolve().then(function () { return index_get$9; });
const _lazy_5mTFh_ = () => Promise.resolve().then(function () { return home_get$1; });
const _lazy_32gqwJ = () => Promise.resolve().then(function () { return _listSlug__get$1; });
const _lazy_xc5jGi = () => Promise.resolve().then(function () { return stories_get$3; });
const _lazy_jlpLqZ = () => Promise.resolve().then(function () { return _venueSlug__get$1; });
const _lazy_gY1Bvy = () => Promise.resolve().then(function () { return index_get$7; });
const _lazy_q_FidK = () => Promise.resolve().then(function () { return clientOrders_get$1; });
const _lazy_T9W_fd = () => Promise.resolve().then(function () { return reviewPrompts_post$1; });
const _lazy_lGk9Ax = () => Promise.resolve().then(function () { return access_get$1; });
const _lazy_Xz3BQ5 = () => Promise.resolve().then(function () { return branches_post$1; });
const _lazy_pwi2MS = () => Promise.resolve().then(function () { return _id__put$3; });
const _lazy_sc1SzI = () => Promise.resolve().then(function () { return deactivate_post$1; });
const _lazy_9cmB4o = () => Promise.resolve().then(function () { return features_get$1; });
const _lazy_BEa7dI = () => Promise.resolve().then(function () { return toggle_post$1; });
const _lazy_AYoQFM = () => Promise.resolve().then(function () { return festivalModeration_get$1; });
const _lazy_AFGp6j = () => Promise.resolve().then(function () { return festivalModeration_put$1; });
const _lazy_NqBmuF = () => Promise.resolve().then(function () { return test_post$3; });
const _lazy_jp1yIk = () => Promise.resolve().then(function () { return maxChatLinkToken_post$1; });
const _lazy_hpsJ42 = () => Promise.resolve().then(function () { return notificationEvents_get$1; });
const _lazy_QWjJOs = () => Promise.resolve().then(function () { return notifications_get$1; });
const _lazy_3FEqrG = () => Promise.resolve().then(function () { return notifications_put$1; });
const _lazy_zDdOjf = () => Promise.resolve().then(function () { return test_post$1; });
const _lazy_PrSQzt = () => Promise.resolve().then(function () { return telegramChatLinkToken_post$1; });
const _lazy_ytwhbg = () => Promise.resolve().then(function () { return telegramChatUnlink_post$1; });
const _lazy_ldx0nb = () => Promise.resolve().then(function () { return cityUgc_get$1; });
const _lazy_TI2AEn = () => Promise.resolve().then(function () { return action_post$3; });
const _lazy_9UgdcH = () => Promise.resolve().then(function () { return _id__get$3; });
const _lazy_nj2uTd = () => Promise.resolve().then(function () { return delay_post$1; });
const _lazy_oHFiZP = () => Promise.resolve().then(function () { return reviewPrompt_post$1; });
const _lazy_q0s1S1 = () => Promise.resolve().then(function () { return status_put$1; });
const _lazy_wFEWjN = () => Promise.resolve().then(function () { return index_get$5; });
const _lazy_qKnWPv = () => Promise.resolve().then(function () { return media_post$1; });
const _lazy_Kp1JXb = () => Promise.resolve().then(function () { return stylePresets_get$1; });
const _lazy_9aOX12 = () => Promise.resolve().then(function () { return stylePresets_post$1; });
const _lazy_0_1qYh = () => Promise.resolve().then(function () { return style_get$1; });
const _lazy_LseL4w = () => Promise.resolve().then(function () { return style_put$1; });
const _lazy_Y0mhAX = () => Promise.resolve().then(function () { return contacts_put$1; });
const _lazy_k_QcFR = () => Promise.resolve().then(function () { return identity_put$1; });
const _lazy_X4GOLd = () => Promise.resolve().then(function () { return operations_put$1; });
const _lazy_hKhvbv = () => Promise.resolve().then(function () { return rollback_post$1; });
const _lazy_FNFqef = () => Promise.resolve().then(function () { return styles_put$1; });
const _lazy_uSl_L7 = () => Promise.resolve().then(function () { return restaurants_get$1; });
const _lazy_lmzMkq = () => Promise.resolve().then(function () { return action_post$1; });
const _lazy_GPP4ee = () => Promise.resolve().then(function () { return index_get$3; });
const _lazy_vGbBtJ = () => Promise.resolve().then(function () { return storefront_get$1; });
const _lazy_JwIfPN = () => Promise.resolve().then(function () { return _id__delete$1; });
const _lazy_Exsa5l = () => Promise.resolve().then(function () { return _id__get$1; });
const _lazy_5KqrlI = () => Promise.resolve().then(function () { return _id__put$1; });
const _lazy_oeNIa_ = () => Promise.resolve().then(function () { return index_get$1; });
const _lazy_BKKmC8 = () => Promise.resolve().then(function () { return index_post$1; });
const _lazy_SFiPSu = () => Promise.resolve().then(function () { return media_upload_post$1; });
const _lazy_N4WRuh = () => Promise.resolve().then(function () { return achievements_get$1; });
const _lazy_lIqP3R = () => Promise.resolve().then(function () { return reviews_post$3; });
const _lazy_llfTgk = () => Promise.resolve().then(function () { return ugc_get$1; });
const _lazy_q9cNCl = () => Promise.resolve().then(function () { return eligibility_get$1; });
const _lazy_xSQept = () => Promise.resolve().then(function () { return upload_post$1; });
const _lazy_kClRrT = () => Promise.resolve().then(function () { return geocode_get$1; });
const _lazy_2xUO3I = () => Promise.resolve().then(function () { return platformCities_get$1; });
const _lazy_Zj4vT9 = () => Promise.resolve().then(function () { return reviews_get$1; });
const _lazy_OXgZ5M = () => Promise.resolve().then(function () { return reviews_patch$1; });
const _lazy_9rNeBy = () => Promise.resolve().then(function () { return reviews_post$1; });
const _lazy_ErF9_I = () => Promise.resolve().then(function () { return shops_get$1; });
const _lazy_fxdjJk = () => Promise.resolve().then(function () { return stories_get$1; });
const _lazy_IQeviU = () => Promise.resolve().then(function () { return views_post$1; });
const _lazy_TnrUDV = () => Promise.resolve().then(function () { return tenant_get$1; });
const _lazy_bOieFZ = () => Promise.resolve().then(function () { return cities_get$1; });
const _lazy_SKISOS = () => Promise.resolve().then(function () { return resolveCanonical_get$1; });
const _lazy_yPR5B0 = () => Promise.resolve().then(function () { return webhookMax_post$1; });
const _lazy_mu5K9i = () => Promise.resolve().then(function () { return webhookRelay_post; });
const _lazy_HwcIKV = () => Promise.resolve().then(function () { return webhook_post$1; });
const _lazy_2tVpPI = () => Promise.resolve().then(function () { return yookassa_post$1; });
const _lazy_VaUVu9 = () => Promise.resolve().then(function () { return renderer; });

const handlers = [
  { route: '', handler: _I_Nsjs, lazy: false, middleware: true, method: undefined },
  { route: '', handler: _Fv4zcQ, lazy: false, middleware: true, method: undefined },
  { route: '/api/auth/exchange-max-session', handler: _lazy_RvwyMH, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/exchange-telegram-session', handler: _lazy_03WsRB, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/exchange-vk-session', handler: _lazy_w3cdvs, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/link-max', handler: _lazy_C99VEe, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/link-telegram', handler: _lazy_FNAjmw, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/max-link-status', handler: _lazy_FzDv_F, lazy: true, middleware: false, method: "get" },
  { route: '/api/auth/request-max-link', handler: _lazy_o75NtK, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/request-telegram-link', handler: _lazy_8DMAwn, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/request-vk-link', handler: _lazy_Nqu4P_, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/telegram-link-status', handler: _lazy_2P2Wrf, lazy: true, middleware: false, method: "get" },
  { route: '/api/auth/vk-id/callback', handler: _lazy_3Q5gl_, lazy: true, middleware: false, method: "get" },
  { route: '/api/auth/vk-link-status', handler: _lazy_fza5HK, lazy: true, middleware: false, method: "get" },
  { route: '/api/cities', handler: _lazy_cZSPXT, lazy: true, middleware: false, method: "get" },
  { route: '/api/cities/:slug/events/:eventSlug', handler: _lazy_s7B7a4, lazy: true, middleware: false, method: "get" },
  { route: '/api/cities/:slug/events', handler: _lazy_Prd3G_, lazy: true, middleware: false, method: "get" },
  { route: '/api/cities/:slug/home', handler: _lazy_5mTFh_, lazy: true, middleware: false, method: "get" },
  { route: '/api/cities/:slug/lists/:listSlug', handler: _lazy_32gqwJ, lazy: true, middleware: false, method: "get" },
  { route: '/api/cities/:slug/stories', handler: _lazy_xc5jGi, lazy: true, middleware: false, method: "get" },
  { route: '/api/cities/:slug/venues/:venueSlug', handler: _lazy_jlpLqZ, lazy: true, middleware: false, method: "get" },
  { route: '/api/cities/:slug/venues', handler: _lazy_gY1Bvy, lazy: true, middleware: false, method: "get" },
  { route: '/api/client-orders', handler: _lazy_q_FidK, lazy: true, middleware: false, method: "get" },
  { route: '/api/cron/review-prompts', handler: _lazy_T9W_fd, lazy: true, middleware: false, method: "post" },
  { route: '/api/dashboard/access', handler: _lazy_lGk9Ax, lazy: true, middleware: false, method: "get" },
  { route: '/api/dashboard/branches', handler: _lazy_Xz3BQ5, lazy: true, middleware: false, method: "post" },
  { route: '/api/dashboard/branches/:id', handler: _lazy_pwi2MS, lazy: true, middleware: false, method: "put" },
  { route: '/api/dashboard/branches/:id/deactivate', handler: _lazy_sc1SzI, lazy: true, middleware: false, method: "post" },
  { route: '/api/dashboard/features', handler: _lazy_9cmB4o, lazy: true, middleware: false, method: "get" },
  { route: '/api/dashboard/features/toggle', handler: _lazy_BEa7dI, lazy: true, middleware: false, method: "post" },
  { route: '/api/dashboard/integrations/festival-moderation', handler: _lazy_AYoQFM, lazy: true, middleware: false, method: "get" },
  { route: '/api/dashboard/integrations/festival-moderation', handler: _lazy_AFGp6j, lazy: true, middleware: false, method: "put" },
  { route: '/api/dashboard/integrations/festival-moderation/test', handler: _lazy_NqBmuF, lazy: true, middleware: false, method: "post" },
  { route: '/api/dashboard/integrations/max-chat-link-token', handler: _lazy_jp1yIk, lazy: true, middleware: false, method: "post" },
  { route: '/api/dashboard/integrations/notification-events', handler: _lazy_hpsJ42, lazy: true, middleware: false, method: "get" },
  { route: '/api/dashboard/integrations/notifications', handler: _lazy_QWjJOs, lazy: true, middleware: false, method: "get" },
  { route: '/api/dashboard/integrations/notifications', handler: _lazy_3FEqrG, lazy: true, middleware: false, method: "put" },
  { route: '/api/dashboard/integrations/notifications/test', handler: _lazy_zDdOjf, lazy: true, middleware: false, method: "post" },
  { route: '/api/dashboard/integrations/telegram-chat-link-token', handler: _lazy_PrSQzt, lazy: true, middleware: false, method: "post" },
  { route: '/api/dashboard/integrations/telegram-chat-unlink', handler: _lazy_ytwhbg, lazy: true, middleware: false, method: "post" },
  { route: '/api/dashboard/moderation/city-ugc', handler: _lazy_ldx0nb, lazy: true, middleware: false, method: "get" },
  { route: '/api/dashboard/moderation/city-ugc/action', handler: _lazy_TI2AEn, lazy: true, middleware: false, method: "post" },
  { route: '/api/dashboard/orders/:id', handler: _lazy_9UgdcH, lazy: true, middleware: false, method: "get" },
  { route: '/api/dashboard/orders/:id/delay', handler: _lazy_nj2uTd, lazy: true, middleware: false, method: "post" },
  { route: '/api/dashboard/orders/:id/review-prompt', handler: _lazy_oHFiZP, lazy: true, middleware: false, method: "post" },
  { route: '/api/dashboard/orders/:id/status', handler: _lazy_q0s1S1, lazy: true, middleware: false, method: "put" },
  { route: '/api/dashboard/orders', handler: _lazy_wFEWjN, lazy: true, middleware: false, method: "get" },
  { route: '/api/dashboard/organization/media', handler: _lazy_qKnWPv, lazy: true, middleware: false, method: "post" },
  { route: '/api/dashboard/organization/style-presets', handler: _lazy_Kp1JXb, lazy: true, middleware: false, method: "get" },
  { route: '/api/dashboard/organization/style-presets', handler: _lazy_9aOX12, lazy: true, middleware: false, method: "post" },
  { route: '/api/dashboard/organization/style', handler: _lazy_0_1qYh, lazy: true, middleware: false, method: "get" },
  { route: '/api/dashboard/organization/style', handler: _lazy_LseL4w, lazy: true, middleware: false, method: "put" },
  { route: '/api/dashboard/organization/style/contacts', handler: _lazy_Y0mhAX, lazy: true, middleware: false, method: "put" },
  { route: '/api/dashboard/organization/style/identity', handler: _lazy_k_QcFR, lazy: true, middleware: false, method: "put" },
  { route: '/api/dashboard/organization/style/operations', handler: _lazy_X4GOLd, lazy: true, middleware: false, method: "put" },
  { route: '/api/dashboard/organization/style/rollback', handler: _lazy_hKhvbv, lazy: true, middleware: false, method: "post" },
  { route: '/api/dashboard/organization/style/styles', handler: _lazy_FNFqef, lazy: true, middleware: false, method: "put" },
  { route: '/api/dashboard/restaurants', handler: _lazy_uSl_L7, lazy: true, middleware: false, method: "get" },
  { route: '/api/dashboard/reviews/action', handler: _lazy_lmzMkq, lazy: true, middleware: false, method: "post" },
  { route: '/api/dashboard/reviews', handler: _lazy_GPP4ee, lazy: true, middleware: false, method: "get" },
  { route: '/api/dashboard/storefront', handler: _lazy_vGbBtJ, lazy: true, middleware: false, method: "get" },
  { route: '/api/dashboard/stories/campaigns/:id', handler: _lazy_JwIfPN, lazy: true, middleware: false, method: "delete" },
  { route: '/api/dashboard/stories/campaigns/:id', handler: _lazy_Exsa5l, lazy: true, middleware: false, method: "get" },
  { route: '/api/dashboard/stories/campaigns/:id', handler: _lazy_5KqrlI, lazy: true, middleware: false, method: "put" },
  { route: '/api/dashboard/stories/campaigns', handler: _lazy_oeNIa_, lazy: true, middleware: false, method: "get" },
  { route: '/api/dashboard/stories/campaigns', handler: _lazy_BKKmC8, lazy: true, middleware: false, method: "post" },
  { route: '/api/dashboard/stories/media.upload', handler: _lazy_SFiPSu, lazy: true, middleware: false, method: "post" },
  { route: '/api/festival/:festival_slug/achievements', handler: _lazy_N4WRuh, lazy: true, middleware: false, method: "get" },
  { route: '/api/festival/:festival_slug/reviews', handler: _lazy_lIqP3R, lazy: true, middleware: false, method: "post" },
  { route: '/api/festival/:festival_slug/ugc', handler: _lazy_llfTgk, lazy: true, middleware: false, method: "get" },
  { route: '/api/festival/:festival_slug/ugc/eligibility', handler: _lazy_q9cNCl, lazy: true, middleware: false, method: "get" },
  { route: '/api/festival/:festival_slug/ugc/upload', handler: _lazy_xSQept, lazy: true, middleware: false, method: "post" },
  { route: '/api/geocode', handler: _lazy_kClRrT, lazy: true, middleware: false, method: "get" },
  { route: '/api/platform-cities', handler: _lazy_2xUO3I, lazy: true, middleware: false, method: "get" },
  { route: '/api/reviews', handler: _lazy_Zj4vT9, lazy: true, middleware: false, method: "get" },
  { route: '/api/reviews', handler: _lazy_OXgZ5M, lazy: true, middleware: false, method: "patch" },
  { route: '/api/reviews', handler: _lazy_9rNeBy, lazy: true, middleware: false, method: "post" },
  { route: '/api/shops', handler: _lazy_ErF9_I, lazy: true, middleware: false, method: "get" },
  { route: '/api/stories', handler: _lazy_fxdjJk, lazy: true, middleware: false, method: "get" },
  { route: '/api/stories/views', handler: _lazy_IQeviU, lazy: true, middleware: false, method: "post" },
  { route: '/api/tenant', handler: _lazy_TnrUDV, lazy: true, middleware: false, method: "get" },
  { route: '/api/tenant/cities', handler: _lazy_bOieFZ, lazy: true, middleware: false, method: "get" },
  { route: '/api/tenant/resolve-canonical', handler: _lazy_SKISOS, lazy: true, middleware: false, method: "get" },
  { route: '/api/webhook-max', handler: _lazy_yPR5B0, lazy: true, middleware: false, method: "post" },
  { route: '/api/webhook-relay', handler: _lazy_mu5K9i, lazy: true, middleware: false, method: "post" },
  { route: '/api/webhook', handler: _lazy_HwcIKV, lazy: true, middleware: false, method: "post" },
  { route: '/api/webhooks/yookassa', handler: _lazy_2tVpPI, lazy: true, middleware: false, method: "post" },
  { route: '/__nuxt_error', handler: _lazy_VaUVu9, lazy: true, middleware: false, method: undefined },
  { route: '/__nuxt_island/**', handler: handler$1, lazy: false, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_VaUVu9, lazy: true, middleware: false, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const captureError = (error, context = {}) => {
    const promise = hooks.callHookParallel("error", error, context).catch((error_) => {
      console.error("Error while capturing another error", error_);
    });
    if (context.event && isEvent(context.event)) {
      const errors = context.event.context.nitro?.errors;
      if (errors) {
        errors.push({ error, context });
      }
      if (context.event.waitUntil) {
        context.event.waitUntil(promise);
      }
    }
  };
  const h3App = createApp({
    debug: destr(true),
    onError: (error, event) => {
      captureError(error, { event, tags: ["request"] });
      return errorHandler(error, event);
    },
    onRequest: async (event) => {
      event.context.nitro = event.context.nitro || { errors: [] };
      const fetchContext = event.node.req?.__unenv__;
      if (fetchContext?._platform) {
        event.context = {
          _platform: fetchContext?._platform,
          // #3335
          ...fetchContext._platform,
          ...event.context
        };
      }
      if (!event.context.waitUntil && fetchContext?.waitUntil) {
        event.context.waitUntil = fetchContext.waitUntil;
      }
      event.fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: localFetch });
      event.$fetch = (req, init) => fetchWithEvent(event, req, init, {
        fetch: $fetch
      });
      event.waitUntil = (promise) => {
        if (!event.context.nitro._waitUntilPromises) {
          event.context.nitro._waitUntilPromises = [];
        }
        event.context.nitro._waitUntilPromises.push(promise);
        if (event.context.waitUntil) {
          event.context.waitUntil(promise);
        }
      };
      event.captureError = (error, context) => {
        captureError(error, { event, ...context });
      };
      await nitroApp$1.hooks.callHook("request", event).catch((error) => {
        captureError(error, { event, tags: ["request"] });
      });
    },
    onBeforeResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("beforeResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    },
    onAfterResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("afterResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    }
  });
  const router = createRouter$1({
    preemptive: true
  });
  const nodeHandler = toNodeListener(h3App);
  const localCall = (aRequest) => callNodeRequestHandler(
    nodeHandler,
    aRequest
  );
  const localFetch = (input, init) => {
    if (!input.toString().startsWith("/")) {
      return globalThis.fetch(input, init);
    }
    return fetchNodeRequestHandler(
      nodeHandler,
      input,
      init
    ).then((response) => normalizeFetchResponse(response));
  };
  const $fetch = createFetch({
    fetch: localFetch,
    Headers: Headers$1,
    defaults: { baseURL: config.app.baseURL }
  });
  globalThis.$fetch = $fetch;
  h3App.use(createRouteRulesHandler({ localFetch }));
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(
        /\/+/g,
        "/"
      );
      h3App.use(middlewareBase, handler);
    } else {
      const routeRules = getRouteRulesForPath(
        h.route.replace(/:\w+|\*\*/g, "_")
      );
      if (routeRules.cache) {
        handler = cachedEventHandler(handler, {
          group: "nitro/routes",
          ...routeRules.cache
        });
      }
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router.handler);
  const app = {
    hooks,
    h3App,
    router,
    localCall,
    localFetch,
    captureError
  };
  return app;
}
function runNitroPlugins(nitroApp2) {
  for (const plugin of plugins) {
    try {
      plugin(nitroApp2);
    } catch (error) {
      nitroApp2.captureError(error, { tags: ["plugin"] });
      throw error;
    }
  }
}
const nitroApp$1 = createNitroApp();
function useNitroApp() {
  return nitroApp$1;
}
runNitroPlugins(nitroApp$1);

if (!globalThis.crypto) {
  globalThis.crypto = crypto$1.webcrypto;
}
const { NITRO_NO_UNIX_SOCKET, NITRO_DEV_WORKER_ID } = process.env;
trapUnhandledNodeErrors();
parentPort?.on("message", (msg) => {
  if (msg && msg.event === "shutdown") {
    shutdown();
  }
});
const nitroApp = useNitroApp();
const server$1 = new Server(toNodeListener(nitroApp.h3App));
let listener;
listen().catch(() => listen(
  true
  /* use random port */
)).catch((error) => {
  console.error("Dev worker failed to listen:", error);
  return shutdown();
});
nitroApp.router.get(
  "/_nitro/tasks",
  defineEventHandler(async (event) => {
    const _tasks = await Promise.all(
      Object.entries(tasks).map(async ([name, task]) => {
        const _task = await task.resolve?.();
        return [name, { description: _task?.meta?.description }];
      })
    );
    return {
      tasks: Object.fromEntries(_tasks),
      scheduledTasks
    };
  })
);
nitroApp.router.use(
  "/_nitro/tasks/:name",
  defineEventHandler(async (event) => {
    const name = getRouterParam(event, "name");
    const payload = {
      ...getQuery$1(event),
      ...await readBody(event).then((r) => r?.payload).catch(() => ({}))
    };
    return await runTask(name, { payload });
  })
);
function listen(useRandomPort = Boolean(
  NITRO_NO_UNIX_SOCKET || process.versions.webcontainer || "Bun" in globalThis && process.platform === "win32"
)) {
  return new Promise((resolve, reject) => {
    try {
      listener = server$1.listen(useRandomPort ? 0 : getSocketAddress(), () => {
        const address = server$1.address();
        parentPort?.postMessage({
          event: "listen",
          address: typeof address === "string" ? { socketPath: address } : { host: "localhost", port: address?.port }
        });
        resolve();
      });
    } catch (error) {
      reject(error);
    }
  });
}
function getSocketAddress() {
  const socketName = `nitro-worker-${process.pid}-${threadId}-${NITRO_DEV_WORKER_ID}-${Math.round(Math.random() * 1e4)}.sock`;
  if (process.platform === "win32") {
    return join(String.raw`\\.\pipe`, socketName);
  }
  if (process.platform === "linux") {
    const nodeMajor = Number.parseInt(process.versions.node.split(".")[0], 10);
    if (nodeMajor >= 20) {
      return `\0${socketName}`;
    }
  }
  return join(tmpdir(), socketName);
}
async function shutdown() {
  server$1.closeAllConnections?.();
  await Promise.all([
    new Promise((resolve) => listener?.close(resolve)),
    nitroApp.hooks.callHook("close").catch(console.error)
  ]);
  parentPort?.postMessage({ event: "exit" });
}

const _messages = {
	"appName": "Nuxt",
	"version": "",
	"status": 500,
	"statusText": "Server error",
	"description": "This page is temporarily unavailable."
};
const template$1 = (messages) => {
	messages = {
		..._messages,
		...messages
	};
	return "<!DOCTYPE html><html lang=\"en\"><head><title>" + escapeHtml(messages.status) + " - " + escapeHtml(messages.statusText) + " | " + escapeHtml(messages.appName) + "</title><meta charset=\"utf-8\"><meta content=\"width=device-width,initial-scale=1.0,minimum-scale=1.0\" name=\"viewport\"><style>.spotlight{background:linear-gradient(45deg,#00dc82,#36e4da 50%,#0047e1);filter:blur(20vh)}*,:after,:before{border-color:var(--un-default-border-color,#e5e7eb);border-style:solid;border-width:0;box-sizing:border-box}:after,:before{--un-content:\"\"}html{line-height:1.5;-webkit-text-size-adjust:100%;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-feature-settings:normal;font-variation-settings:normal;-moz-tab-size:4;tab-size:4;-webkit-tap-highlight-color:transparent}body{line-height:inherit;margin:0}h1{font-size:inherit;font-weight:inherit}h1,p{margin:0}*,:after,:before{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 transparent;--un-ring-shadow:0 0 transparent;--un-shadow-inset: ;--un-shadow:0 0 transparent;--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgba(147,197,253,.5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: }.fixed{position:fixed}.-bottom-1\\/2{bottom:-50%}.left-0{left:0}.right-0{right:0}.grid{display:grid}.mb-16{margin-bottom:4rem}.mb-8{margin-bottom:2rem}.h-1\\/2{height:50%}.max-w-520px{max-width:520px}.min-h-screen{min-height:100vh}.place-content-center{place-content:center}.overflow-hidden{overflow:hidden}.bg-white{--un-bg-opacity:1;background-color:rgb(255 255 255/var(--un-bg-opacity))}.px-8{padding-left:2rem;padding-right:2rem}.text-center{text-align:center}.text-8xl{font-size:6rem;line-height:1}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-black{--un-text-opacity:1;color:rgb(0 0 0/var(--un-text-opacity))}.font-light{font-weight:300}.font-medium{font-weight:500}.leading-tight{line-height:1.25}.font-sans{font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji}.antialiased{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}@media(prefers-color-scheme:dark){.dark\\:bg-black{--un-bg-opacity:1;background-color:rgb(0 0 0/var(--un-bg-opacity))}.dark\\:text-white{--un-text-opacity:1;color:rgb(255 255 255/var(--un-text-opacity))}}@media(min-width:640px){.sm\\:px-0{padding-left:0;padding-right:0}.sm\\:text-4xl{font-size:2.25rem;line-height:2.5rem}}</style><script>!function(){const e=document.createElement(\"link\").relList;if(!(e&&e.supports&&e.supports(\"modulepreload\"))){for(const e of document.querySelectorAll('link[rel=\"modulepreload\"]'))r(e);new MutationObserver(e=>{for(const o of e)if(\"childList\"===o.type)for(const e of o.addedNodes)\"LINK\"===e.tagName&&\"modulepreload\"===e.rel&&r(e)}).observe(document,{childList:!0,subtree:!0})}function r(e){if(e.ep)return;e.ep=!0;const r=function(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),\"use-credentials\"===e.crossOrigin?r.credentials=\"include\":\"anonymous\"===e.crossOrigin?r.credentials=\"omit\":r.credentials=\"same-origin\",r}(e);fetch(e.href,r)}}();<\/script></head><body class=\"antialiased bg-white dark:bg-black dark:text-white font-sans grid min-h-screen overflow-hidden place-content-center text-black\"><div class=\"-bottom-1/2 fixed h-1/2 left-0 right-0 spotlight\"></div><div class=\"max-w-520px text-center\"><h1 class=\"font-medium mb-8 sm:text-10xl text-8xl\">" + escapeHtml(messages.status) + "</h1><p class=\"font-light leading-tight mb-16 px-8 sm:px-0 sm:text-4xl text-xl\">" + escapeHtml(messages.description) + "</p></div></body></html>";
};

const error500 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  template: template$1
}, Symbol.toStringTag, { value: 'Module' }));

const server = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: viteNodeEntry_mjs
}, Symbol.toStringTag, { value: 'Module' }));

const client_manifest = () => viteNodeFetch.getManifest();

const client_manifest$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: client_manifest
}, Symbol.toStringTag, { value: 'Module' }));

const template = "";

const _virtual__spaTemplate = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  template: template
}, Symbol.toStringTag, { value: 'Module' }));

const styles = {};

const styles$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: styles
}, Symbol.toStringTag, { value: 'Module' }));

async function findAuthUserIdByEmail$2(serviceClient, email) {
  var _a;
  let page = 1;
  const perPage = 200;
  while (page <= 10) {
    const { data, error } = await serviceClient.auth.admin.listUsers({ page, perPage });
    if (error) return null;
    const users = (_a = data == null ? void 0 : data.users) != null ? _a : [];
    const hit = users.find((user) => (user.email || "").toLowerCase() === email.toLowerCase());
    if (hit == null ? void 0 : hit.id) return hit.id;
    if (users.length < perPage) break;
    page += 1;
  }
  return null;
}
const exchangeMaxSession_post = defineEventHandler(async (event) => {
  var _a, _b, _c;
  const body = await readBody(event);
  if (!(body == null ? void 0 : body.token)) {
    throw createError({ statusCode: 400, statusMessage: "Token is required" });
  }
  const config = useRuntimeConfig();
  const supabaseUrl = config.supabaseUrl || "";
  const supabaseAnonKey = config.public.supabaseKey || "";
  if (!supabaseUrl || !supabaseAnonKey) {
    throw createError({ statusCode: 500, statusMessage: "Supabase URL or anon key missing" });
  }
  const serviceClient = await serverSupabaseServiceRole(event);
  const { data: tokenRow, error: tokenError } = await serviceClient.from("auth_tokens").select("*").eq("token", body.token).eq("channel", "max").maybeSingle();
  if (tokenError) {
    throw createError({ statusCode: 500, statusMessage: "Failed to check MAX token" });
  }
  if (!tokenRow) {
    throw createError({ statusCode: 400, statusMessage: "Invalid MAX token" });
  }
  if (new Date(tokenRow.expires_at).getTime() < Date.now()) {
    await serviceClient.from("auth_tokens").delete().eq("token", body.token);
    throw createError({ statusCode: 400, statusMessage: "Token expired" });
  }
  const maxUserId = String(tokenRow.max_user_id || "").trim();
  if (!maxUserId) {
    throw createError({
      statusCode: 409,
      statusMessage: "MAX confirmation pending"
    });
  }
  const maxConversationId = String(tokenRow.max_conversation_id || "").trim() || null;
  const bridgePayload = tokenRow.bridge_payload || {};
  const sharedPhoneRaw = bridgePayload.max_shared_phone;
  const sharedPhone = typeof sharedPhoneRaw === "string" && sharedPhoneRaw.trim() ? normalizePhone(sharedPhoneRaw.trim()) : "";
  const linkProfileRaw = bridgePayload.link_profile_id;
  const linkProfileId = typeof linkProfileRaw === "string" && linkProfileRaw.trim() ? linkProfileRaw.trim() : "";
  if (linkProfileId) {
    const supabaseUser = await serverSupabaseUser(event);
    const sessionUid = (() => {
      const u = supabaseUser;
      const id = typeof (u == null ? void 0 : u.id) === "string" ? u.id.trim() : "";
      if (id) return id;
      return typeof (u == null ? void 0 : u.sub) === "string" ? u.sub.trim() : "";
    })();
    if (!sessionUid || sessionUid !== linkProfileId) {
      throw createError({
        statusCode: 403,
        statusMessage: "\u0412\u043E\u0439\u0434\u0438\u0442\u0435 \u043D\u0430 \u0441\u0430\u0439\u0442\u0435 \u0432 \u044D\u0442\u043E\u043C \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0435 \u043F\u043E\u0434 \u0442\u0435\u043C \u0436\u0435 \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u043E\u043C \u0438 \u0437\u0430\u0432\u0435\u0440\u0448\u0438\u0442\u0435 \u043F\u0440\u0438\u0432\u044F\u0437\u043A\u0443 MAX \u0441\u043D\u043E\u0432\u0430."
      });
    }
    const { data: holder, error: holderErr } = await serviceClient.from("profiles").select("id").eq("max_user_id", maxUserId).maybeSingle();
    if (holderErr) {
      throw createError({ statusCode: 500, statusMessage: "Failed to resolve MAX profile holder" });
    }
    const maxHolderId = (holder == null ? void 0 : holder.id) ? String(holder.id) : null;
    if (maxHolderId && maxHolderId !== linkProfileId) {
      await migrateCustomerDeliveryAddresses(serviceClient, maxHolderId, linkProfileId);
      await serviceClient.from("profiles").update({ max_user_id: null, max_conversation_id: null }).eq("id", maxHolderId);
    }
    const { error: attachErr } = await serviceClient.from("profiles").update({
      max_user_id: maxUserId,
      max_conversation_id: maxConversationId
    }).eq("id", linkProfileId);
    if (attachErr) {
      throw createError({ statusCode: 500, statusMessage: "Failed to attach MAX to profile" });
    }
    const { data: authUser, error: authReadErr } = await serviceClient.auth.admin.getUserById(linkProfileId);
    if (authReadErr || !(authUser == null ? void 0 : authUser.user)) {
      throw createError({ statusCode: 500, statusMessage: "Failed to read auth user for MAX link" });
    }
    const meta = (_a = authUser.user.user_metadata) != null ? _a : {};
    await serviceClient.auth.admin.updateUserById(linkProfileId, {
      user_metadata: {
        ...meta,
        max_user_id: maxUserId,
        ...maxConversationId ? { max_conversation_id: maxConversationId } : {}
      }
    });
    if (sharedPhone) {
      await setProfilePhone(serviceClient, linkProfileId, sharedPhone);
    }
    await serviceClient.from("auth_tokens").delete().eq("token", body.token);
    return {
      success: true,
      userId: linkProfileId,
      maxUserId,
      bridge_payload: (_b = tokenRow.bridge_payload) != null ? _b : null,
      session_unchanged: true
    };
  }
  const { data: existingProfileByMax, error: profileError } = await serviceClient.from("profiles").select("id").eq("max_user_id", maxUserId).maybeSingle();
  if (profileError) {
    throw createError({ statusCode: 500, statusMessage: "Failed to prepare MAX profile" });
  }
  const syntheticEmail = `max_${maxUserId.replace(/[^a-zA-Z0-9._-]/g, "_")}@max.local`;
  const secret = config.sessionSecret || "max-session-secret";
  const syntheticPassword = crypto$1.createHash("sha256").update(`${maxUserId}:${secret}`).digest("hex");
  let userId;
  const existingProfileByPhoneId = !existingProfileByMax && sharedPhone ? await findProfileIdByPhone(serviceClient, sharedPhone) : null;
  const existingProfile = existingProfileByMax || (existingProfileByPhoneId ? { id: existingProfileByPhoneId } : null);
  if (!existingProfile) {
    const { data: createdUser, error: createUserError } = await serviceClient.auth.admin.createUser({
      email: syntheticEmail,
      password: syntheticPassword,
      email_confirm: true,
      user_metadata: {
        max_user_id: maxUserId,
        ...sharedPhone ? { phone: sharedPhone } : {}
      }
    });
    if (createUserError || !(createdUser == null ? void 0 : createdUser.user)) {
      throw createError({ statusCode: 500, statusMessage: "Failed to create MAX user" });
    }
    userId = createdUser.user.id;
    const { error: upsertError } = await serviceClient.from("profiles").upsert(
      {
        id: userId,
        max_user_id: maxUserId,
        max_conversation_id: maxConversationId
      },
      { onConflict: "id" }
    );
    if (upsertError) {
      throw createError({ statusCode: 500, statusMessage: "Failed to link MAX profile" });
    }
  } else {
    userId = String(existingProfile.id);
    const { error: updateError } = await serviceClient.auth.admin.updateUserById(userId, {
      email: syntheticEmail,
      password: syntheticPassword,
      email_confirm: true
    });
    if (updateError) {
      const message = String(updateError.message || "").toLowerCase();
      const isEmailConflict = message.includes("email") && (message.includes("already") || message.includes("exists") || message.includes("duplicate"));
      if (!isEmailConflict) {
        throw createError({ statusCode: 500, statusMessage: "Failed to prepare existing MAX user" });
      }
      const syntheticUserId = await findAuthUserIdByEmail$2(serviceClient, syntheticEmail);
      if (!syntheticUserId) {
        throw createError({ statusCode: 500, statusMessage: "Failed to repair MAX user mapping" });
      }
      const { error: normalizeError } = await serviceClient.auth.admin.updateUserById(syntheticUserId, {
        password: syntheticPassword,
        email_confirm: true,
        user_metadata: {
          max_user_id: maxUserId,
          ...sharedPhone ? { phone: sharedPhone } : {}
        }
      });
      if (normalizeError) {
        throw createError({ statusCode: 500, statusMessage: "Failed to normalize synthetic MAX user" });
      }
      const { error: rebindError } = await serviceClient.from("profiles").update({
        id: syntheticUserId,
        max_user_id: maxUserId,
        max_conversation_id: maxConversationId
      }).eq("id", userId);
      if (rebindError) {
        throw createError({ statusCode: 500, statusMessage: "Failed to rebind MAX profile" });
      }
      userId = syntheticUserId;
    } else {
      await serviceClient.from("profiles").update({ max_user_id: maxUserId, max_conversation_id: maxConversationId }).eq("id", userId);
    }
  }
  const supabaseForAuth = createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false } });
  const { data: signInData, error: signInError } = await supabaseForAuth.auth.signInWithPassword({
    email: syntheticEmail,
    password: syntheticPassword
  });
  if (signInError || !(signInData == null ? void 0 : signInData.session)) {
    throw createError({ statusCode: 500, statusMessage: "Failed to create MAX Supabase session" });
  }
  await serviceClient.from("profiles").update({ max_user_id: maxUserId, max_conversation_id: maxConversationId }).eq("id", userId);
  if (sharedPhone) {
    await setProfilePhone(serviceClient, userId, sharedPhone);
  }
  await serviceClient.from("auth_tokens").delete().eq("token", body.token);
  return {
    success: true,
    userId,
    maxUserId,
    bridge_payload: (_c = tokenRow.bridge_payload) != null ? _c : null,
    access_token: signInData.session.access_token,
    refresh_token: signInData.session.refresh_token,
    expires_in: signInData.session.expires_in
  };
});

const exchangeMaxSession_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: exchangeMaxSession_post
}, Symbol.toStringTag, { value: 'Module' }));

async function findAuthUserIdByEmail$1(serviceClient, email) {
  var _a;
  let page = 1;
  const perPage = 200;
  while (page <= 10) {
    const { data, error } = await serviceClient.auth.admin.listUsers({ page, perPage });
    if (error) {
      console.error("Error listing auth users in exchange-session:", error);
      return null;
    }
    const users = (_a = data == null ? void 0 : data.users) != null ? _a : [];
    const hit = users.find((user) => (user.email || "").toLowerCase() === email.toLowerCase());
    if (hit == null ? void 0 : hit.id) return hit.id;
    if (users.length < perPage) break;
    page += 1;
  }
  return null;
}
const exchangeTelegramSession_post = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e;
  const body = await readBody(event);
  if (!(body == null ? void 0 : body.token)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Token is required"
    });
  }
  const config = useRuntimeConfig();
  const supabaseUrl = config.supabaseUrl || "";
  const supabaseAnonKey = config.public.supabaseKey || "";
  if (!supabaseUrl || !supabaseAnonKey) {
    throw createError({
      statusCode: 500,
      statusMessage: "Supabase URL or anon key missing"
    });
  }
  const serviceClient = await serverSupabaseServiceRole(event);
  const { data: tokenRow, error: tokenError } = await serviceClient.from("auth_tokens").select("*").eq("token", body.token).maybeSingle();
  if (tokenError) {
    console.error("Error querying auth_tokens in exchange-session:", tokenError);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to check token"
    });
  }
  if (!tokenRow) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid token"
    });
  }
  const now = /* @__PURE__ */ new Date();
  const expiresAt = new Date(tokenRow.expires_at);
  if (expiresAt.getTime() < now.getTime()) {
    await serviceClient.from("auth_tokens").delete().eq("token", body.token);
    throw createError({
      statusCode: 400,
      statusMessage: "Token expired"
    });
  }
  if (tokenRow.telegram_id == null) {
    throw createError({
      statusCode: 409,
      statusMessage: "Telegram confirmation pending"
    });
  }
  const bridgeFromToken = tokenRow.bridge_payload || {};
  const sharedPhoneRaw = (_a = bridgeFromToken.telegram_shared_phone) != null ? _a : bridgeFromToken.shared_phone;
  const sharedPhone = typeof sharedPhoneRaw === "string" && sharedPhoneRaw.trim() ? normalizePhone(sharedPhoneRaw.trim()) : "";
  const rawTg = tokenRow.telegram_id;
  const telegramId = typeof rawTg === "number" && Number.isFinite(rawTg) ? rawTg : typeof rawTg === "string" ? Number.parseInt(rawTg, 10) : Number(rawTg);
  if (!Number.isFinite(telegramId)) {
    throw createError({
      statusCode: 500,
      statusMessage: "Invalid telegram id on token"
    });
  }
  const { data: profileRows, error: profileError } = await serviceClient.from("profiles").select("id").eq("telegram_id", telegramId).limit(1);
  const profileByTelegram = (_b = profileRows == null ? void 0 : profileRows[0]) != null ? _b : null;
  const profileByPhoneId = !profileByTelegram && sharedPhone ? await findProfileIdByPhone(serviceClient, sharedPhone) : null;
  const existingProfile = profileByTelegram || (profileByPhoneId ? { id: profileByPhoneId } : null);
  if (profileError) {
    console.error("Error querying profiles by telegram_id in exchange-session:", profileError);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to prepare session for Telegram"
    });
  }
  const syntheticEmail = `tg_${telegramId}@telegram.local`;
  const secret = config.sessionSecret || "telegram-session-secret";
  const syntheticPassword = crypto$1.createHash("sha256").update(String(telegramId) + ":" + secret).digest("hex");
  let userId;
  if (!existingProfile) {
    const { data: createdUser, error: createUserError } = await serviceClient.auth.admin.createUser({
      email: syntheticEmail,
      password: syntheticPassword,
      email_confirm: true,
      user_metadata: {
        telegram_id: telegramId,
        ...sharedPhone ? { phone: sharedPhone } : {}
      }
    });
    if (createUserError || !(createdUser == null ? void 0 : createdUser.user)) {
      console.error("Error creating auth user for telegram_id in exchange-session:", createUserError);
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to create user for Telegram"
      });
    }
    userId = createdUser.user.id;
    const { error: upsertError } = await serviceClient.from("profiles").upsert(
      {
        id: userId,
        telegram_id: telegramId
      },
      { onConflict: "id" }
    );
    if (upsertError) {
      console.error("Error creating profile with telegram_id in exchange-session:", upsertError);
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to link Telegram profile"
      });
    }
  } else {
    userId = existingProfile.id;
    const { data: existingUserData, error: getUserError } = await serviceClient.auth.admin.getUserById(userId);
    if (getUserError) {
      console.error("Error fetching auth user for existing profile in exchange-session:", getUserError);
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to prepare existing user for Telegram session"
      });
    }
    const existingAuthUser = (_c = existingUserData == null ? void 0 : existingUserData.user) != null ? _c : null;
    if (!existingAuthUser) {
      const { data: createdUser, error: createUserError } = await serviceClient.auth.admin.createUser({
        email: syntheticEmail,
        password: syntheticPassword,
        email_confirm: true,
        user_metadata: {
          telegram_id: telegramId,
          ...sharedPhone ? { phone: sharedPhone } : {}
        }
      });
      if (createUserError || !(createdUser == null ? void 0 : createdUser.user)) {
        console.error(
          "Error creating auth user for orphaned profile in exchange-session:",
          createUserError
        );
        throw createError({
          statusCode: 500,
          statusMessage: "Failed to repair Telegram user"
        });
      }
      userId = createdUser.user.id;
      const { error: upsertError } = await serviceClient.from("profiles").upsert(
        {
          id: userId,
          telegram_id: telegramId
        },
        { onConflict: "id" }
      );
      if (upsertError) {
        console.error(
          "Error updating profile for orphaned user in exchange-session:",
          upsertError
        );
        throw createError({
          statusCode: 500,
          statusMessage: "Failed to link repaired Telegram profile"
        });
      }
    } else {
      const { error: updateError } = await serviceClient.auth.admin.updateUserById(userId, {
        email: syntheticEmail,
        password: syntheticPassword,
        email_confirm: true
      });
      if (updateError) {
        console.warn("Primary updateUserById failed, trying repair path in exchange-session:", updateError);
        let syntheticUserId = await findAuthUserIdByEmail$1(serviceClient, syntheticEmail);
        if (!syntheticUserId) {
          const { data: createdSyntheticUser, error: createSyntheticError } = await serviceClient.auth.admin.createUser({
            email: syntheticEmail,
            password: syntheticPassword,
            email_confirm: true,
            user_metadata: {
              telegram_id: telegramId,
              ...sharedPhone ? { phone: sharedPhone } : {}
            }
          });
          if (createSyntheticError || !((_d = createdSyntheticUser == null ? void 0 : createdSyntheticUser.user) == null ? void 0 : _d.id)) {
            console.error("Error creating synthetic auth user during repair in exchange-session:", createSyntheticError);
            throw createError({
              statusCode: 500,
              statusMessage: "Failed to prepare existing Telegram user"
            });
          }
          syntheticUserId = createdSyntheticUser.user.id;
        }
        const { error: normalizeSyntheticError } = await serviceClient.auth.admin.updateUserById(syntheticUserId, {
          password: syntheticPassword,
          email_confirm: true,
          user_metadata: {
            telegram_id: telegramId,
            ...sharedPhone ? { phone: sharedPhone } : {}
          }
        });
        if (normalizeSyntheticError) {
          console.error("Error normalizing synthetic auth user in exchange-session:", normalizeSyntheticError);
          throw createError({
            statusCode: 500,
            statusMessage: "Failed to normalize synthetic Telegram user"
          });
        }
        const { error: rebindError } = await serviceClient.from("profiles").update({ id: syntheticUserId, telegram_id: telegramId }).eq("id", userId).eq("telegram_id", telegramId);
        if (rebindError) {
          console.error("Error rebinding profile to synthetic user in exchange-session:", rebindError);
          throw createError({
            statusCode: 500,
            statusMessage: "Failed to rebind Telegram profile"
          });
        }
        userId = syntheticUserId;
      }
    }
  }
  const supabaseForAuth = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false
    }
  });
  const { data: signInData, error: signInError } = await supabaseForAuth.auth.signInWithPassword({
    email: syntheticEmail,
    password: syntheticPassword
  });
  if (signInError || !(signInData == null ? void 0 : signInData.session)) {
    console.error("Error signing in synthetic user for Telegram:", signInError);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to create Supabase session"
    });
  }
  const session = signInData.session;
  await serviceClient.from("profiles").update({ telegram_id: telegramId }).eq("id", userId);
  if (sharedPhone) {
    await setProfilePhone(serviceClient, userId, sharedPhone);
  }
  const { error: deleteError } = await serviceClient.from("auth_tokens").delete().eq("token", body.token);
  if (deleteError) {
    console.error("Error deleting auth_token in exchange-session:", deleteError);
  }
  return {
    success: true,
    userId,
    telegramId,
    bridge_payload: (_e = tokenRow.bridge_payload) != null ? _e : null,
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    expires_in: session.expires_in
  };
});

const exchangeTelegramSession_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: exchangeTelegramSession_post
}, Symbol.toStringTag, { value: 'Module' }));

async function findAuthUserIdByEmail(serviceClient, email) {
  var _a;
  let page = 1;
  const perPage = 200;
  while (page <= 10) {
    const { data, error } = await serviceClient.auth.admin.listUsers({ page, perPage });
    if (error) return null;
    const users = (_a = data == null ? void 0 : data.users) != null ? _a : [];
    const hit = users.find((user) => (user.email || "").toLowerCase() === email.toLowerCase());
    if (hit == null ? void 0 : hit.id) return hit.id;
    if (users.length < perPage) break;
    page += 1;
  }
  return null;
}
const exchangeVkSession_post = defineEventHandler(async (event) => {
  var _a;
  const body = await readBody(event);
  if (!(body == null ? void 0 : body.token)) {
    throw createError({ statusCode: 400, statusMessage: "Token is required" });
  }
  const config = useRuntimeConfig();
  const supabaseUrl = config.supabaseUrl || "";
  const supabaseAnonKey = config.public.supabaseKey || "";
  if (!supabaseUrl || !supabaseAnonKey) {
    throw createError({ statusCode: 500, statusMessage: "Supabase URL or anon key missing" });
  }
  const serviceClient = await serverSupabaseServiceRole(event);
  const { data: tokenRow, error: tokenError } = await serviceClient.from("auth_tokens").select("*").eq("token", body.token).eq("channel", "vk").maybeSingle();
  if (tokenError) {
    throw createError({ statusCode: 500, statusMessage: "Failed to check VK token" });
  }
  if (!tokenRow) {
    throw createError({ statusCode: 400, statusMessage: "Invalid VK token" });
  }
  if (new Date(tokenRow.expires_at).getTime() < Date.now()) {
    await serviceClient.from("auth_tokens").delete().eq("token", body.token);
    throw createError({ statusCode: 400, statusMessage: "Token expired" });
  }
  const vkUserId = String(tokenRow.vk_user_id || "").trim();
  if (!vkUserId) {
    throw createError({
      statusCode: 409,
      statusMessage: "VK confirmation pending"
    });
  }
  const bridgePayload = tokenRow.bridge_payload || {};
  const vkEmail = typeof bridgePayload.vk_email === "string" ? bridgePayload.vk_email.trim() : "";
  const vkPhone = typeof bridgePayload.vk_phone === "string" ? bridgePayload.vk_phone.trim() : "";
  const { data: existingProfile, error: profileError } = await serviceClient.from("profiles").select("id").eq("vk_user_id", vkUserId).maybeSingle();
  if (profileError) {
    throw createError({ statusCode: 500, statusMessage: "Failed to prepare VK profile" });
  }
  const syntheticEmail = `vk_${vkUserId.replace(/[^a-zA-Z0-9._-]/g, "_")}@vk.local`;
  const secret = config.sessionSecret || "vk-session-secret";
  const syntheticPassword = crypto$1.createHash("sha256").update(`${vkUserId}:${secret}`).digest("hex");
  let userId;
  if (!existingProfile) {
    const { data: createdUser, error: createUserError } = await serviceClient.auth.admin.createUser({
      email: syntheticEmail,
      password: syntheticPassword,
      email_confirm: true,
      user_metadata: {
        vk_user_id: vkUserId,
        ...vkPhone ? { phone: vkPhone } : {}
      }
    });
    if (createUserError || !(createdUser == null ? void 0 : createdUser.user)) {
      throw createError({ statusCode: 500, statusMessage: "Failed to create VK user" });
    }
    userId = createdUser.user.id;
    const { error: upsertError } = await serviceClient.from("profiles").upsert(
      {
        id: userId,
        vk_user_id: vkUserId,
        vk_email: vkEmail || null,
        vk_phone: vkPhone || null
      },
      { onConflict: "id" }
    );
    if (upsertError) {
      throw createError({ statusCode: 500, statusMessage: "Failed to link VK profile" });
    }
  } else {
    userId = String(existingProfile.id);
    const { error: updateError } = await serviceClient.auth.admin.updateUserById(userId, {
      email: syntheticEmail,
      password: syntheticPassword,
      email_confirm: true
    });
    if (updateError) {
      const message = String(updateError.message || "").toLowerCase();
      const isEmailConflict = message.includes("email") && (message.includes("already") || message.includes("exists") || message.includes("duplicate"));
      if (!isEmailConflict) {
        throw createError({ statusCode: 500, statusMessage: "Failed to prepare existing VK user" });
      }
      const syntheticUserId = await findAuthUserIdByEmail(serviceClient, syntheticEmail);
      if (!syntheticUserId) {
        throw createError({ statusCode: 500, statusMessage: "Failed to repair VK user mapping" });
      }
      const { error: normalizeError } = await serviceClient.auth.admin.updateUserById(syntheticUserId, {
        password: syntheticPassword,
        email_confirm: true,
        user_metadata: {
          vk_user_id: vkUserId,
          ...vkPhone ? { phone: vkPhone } : {}
        }
      });
      if (normalizeError) {
        throw createError({ statusCode: 500, statusMessage: "Failed to normalize synthetic VK user" });
      }
      const { error: rebindError } = await serviceClient.from("profiles").update({
        id: syntheticUserId,
        vk_user_id: vkUserId,
        vk_email: vkEmail || null,
        vk_phone: vkPhone || null
      }).eq("id", userId);
      if (rebindError) {
        throw createError({ statusCode: 500, statusMessage: "Failed to rebind VK profile" });
      }
      userId = syntheticUserId;
    } else {
      await serviceClient.from("profiles").update({
        vk_user_id: vkUserId,
        vk_email: vkEmail || null,
        vk_phone: vkPhone || null
      }).eq("id", userId);
    }
  }
  const supabaseForAuth = createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false } });
  const { data: signInData, error: signInError } = await supabaseForAuth.auth.signInWithPassword({
    email: syntheticEmail,
    password: syntheticPassword
  });
  if (signInError || !(signInData == null ? void 0 : signInData.session)) {
    throw createError({ statusCode: 500, statusMessage: "Failed to create VK Supabase session" });
  }
  await serviceClient.from("auth_tokens").delete().eq("token", body.token);
  return {
    success: true,
    userId,
    vkUserId,
    bridge_payload: (_a = tokenRow.bridge_payload) != null ? _a : null,
    access_token: signInData.session.access_token,
    refresh_token: signInData.session.refresh_token,
    expires_in: signInData.session.expires_in
  };
});

const exchangeVkSession_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: exchangeVkSession_post
}, Symbol.toStringTag, { value: 'Module' }));

const linkMax_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!(body == null ? void 0 : body.token)) {
    throw createError({ statusCode: 400, statusMessage: "Token is required" });
  }
  const serviceClient = await serverSupabaseServiceRole(event);
  const { data: tokenRow, error: tokenError } = await serviceClient.from("auth_tokens").select("*").eq("token", body.token).eq("channel", "max").maybeSingle();
  if (tokenError) {
    throw createError({ statusCode: 500, statusMessage: "Failed to check MAX token" });
  }
  if (!tokenRow) {
    throw createError({ statusCode: 400, statusMessage: "Invalid MAX token" });
  }
  if (new Date(tokenRow.expires_at).getTime() < Date.now()) {
    await serviceClient.from("auth_tokens").delete().eq("token", body.token);
    throw createError({ statusCode: 400, statusMessage: "Token expired" });
  }
  return {
    success: true,
    maxUserId: tokenRow.max_user_id || null,
    maxConversationId: tokenRow.max_conversation_id || null
  };
});

const linkMax_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: linkMax_post
}, Symbol.toStringTag, { value: 'Module' }));

const linkTelegram_post = defineEventHandler(async (event) => {
  var _a;
  const body = await readBody(event);
  if (!(body == null ? void 0 : body.token)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Token is required"
    });
  }
  const serviceClient = await serverSupabaseServiceRole(event);
  const { data: tokenRow, error: tokenError } = await serviceClient.from("auth_tokens").select("*").eq("token", body.token).maybeSingle();
  if (tokenError) {
    console.error("Error querying auth_tokens:", tokenError);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to check token"
    });
  }
  if (!tokenRow) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid token"
    });
  }
  const now = /* @__PURE__ */ new Date();
  const expiresAt = new Date(tokenRow.expires_at);
  if (expiresAt.getTime() < now.getTime()) {
    await serviceClient.from("auth_tokens").delete().eq("token", body.token);
    throw createError({
      statusCode: 400,
      statusMessage: "Token expired"
    });
  }
  const rawTg = tokenRow.telegram_id;
  const telegramId = typeof rawTg === "number" && Number.isFinite(rawTg) ? rawTg : typeof rawTg === "string" ? Number.parseInt(rawTg, 10) : Number(rawTg);
  if (!Number.isFinite(telegramId)) {
    throw createError({
      statusCode: 500,
      statusMessage: "Invalid telegram id on token"
    });
  }
  const { data: profileRows, error: profileError } = await serviceClient.from("profiles").select("id").eq("telegram_id", telegramId).limit(1);
  const existingProfile = (_a = profileRows == null ? void 0 : profileRows[0]) != null ? _a : null;
  if (profileError) {
    console.error("Error querying profiles by telegram_id:", profileError);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to link Telegram"
    });
  }
  let userId;
  if (existingProfile) {
    userId = existingProfile.id;
  } else {
    const syntheticEmail = `tg_${telegramId}@telegram.local`;
    const syntheticPassword = crypto.randomUUID();
    const { data: createdUser, error: createUserError } = await serviceClient.auth.admin.createUser({
      email: syntheticEmail,
      password: syntheticPassword,
      email_confirm: true,
      user_metadata: {
        telegram_id: telegramId
      }
    });
    if (createUserError || !(createdUser == null ? void 0 : createdUser.user)) {
      console.error("Error creating auth user for telegram_id:", createUserError);
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to create user for Telegram link"
      });
    }
    userId = createdUser.user.id;
    const { error: upsertError } = await serviceClient.from("profiles").upsert(
      {
        id: userId,
        telegram_id: telegramId
      },
      { onConflict: "id" }
    );
    if (upsertError) {
      console.error("Error creating profile with telegram_id:", upsertError);
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to link Telegram"
      });
    }
  }
  const { error: deleteError } = await serviceClient.from("auth_tokens").delete().eq("token", body.token);
  if (deleteError) {
    console.error("Error deleting used token:", deleteError);
  }
  return {
    success: true,
    telegramId,
    userId
  };
});

const linkTelegram_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: linkTelegram_post
}, Symbol.toStringTag, { value: 'Module' }));

const maxLinkStatus_get = defineEventHandler(async (event) => {
  const query = getQuery$1(event);
  const token = typeof query.token === "string" ? query.token.trim() : "";
  if (!token) {
    throw createError({ statusCode: 400, statusMessage: "token is required" });
  }
  const serviceClient = await serverSupabaseServiceRole(event);
  const { data: row, error } = await serviceClient.from("auth_tokens").select("max_user_id, expires_at, channel").eq("token", token).maybeSingle();
  if (error) {
    console.error("max-link-status query failed", error);
    throw createError({ statusCode: 500, statusMessage: "Failed to check token" });
  }
  if (!row) {
    return { ok: true, state: "invalid" };
  }
  if (String(row.channel || "") !== "max") {
    return { ok: true, state: "invalid" };
  }
  const now = Date.now();
  const expiresAt = new Date(String(row.expires_at)).getTime();
  if (Number.isFinite(expiresAt) && expiresAt < now) {
    await serviceClient.from("auth_tokens").delete().eq("token", token);
    return { ok: true, state: "expired" };
  }
  const maxUser = row.max_user_id;
  if (maxUser != null && String(maxUser).trim() !== "") {
    return { ok: true, state: "ready" };
  }
  return { ok: true, state: "pending" };
});

const maxLinkStatus_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: maxLinkStatus_get
}, Symbol.toStringTag, { value: 'Module' }));

function defaultCityHomePath(defaultCitySlug) {
  const slug = defaultCitySlug.trim() || "ulan-ude";
  return `/${slug}`;
}
function sanitizeAuthRedirectPath(path, defaultCitySlug) {
  const fallback = defaultCityHomePath(defaultCitySlug);
  if (typeof path !== "string" || !path.startsWith("/") || path.startsWith("//")) {
    return fallback;
  }
  if (path.includes("/cart") || path.includes("/checkout") || path.includes("/bonuses")) {
    return fallback;
  }
  return path;
}

function sanitizeInternalPath$2(path, defaultCitySlug) {
  return sanitizeAuthRedirectPath(path, defaultCitySlug);
}
const requestMaxLink_post = defineEventHandler(async (event) => {
  var _a;
  const body = await readBody(event);
  const shopId = typeof (body == null ? void 0 : body.shopId) === "string" ? body.shopId.trim() : "";
  let shop = null;
  if (shopId) {
    shop = await getShopById(event, shopId);
    if (!shop) {
      throw createError({ statusCode: 404, statusMessage: "Shop not found" });
    }
  }
  const config = useRuntimeConfig();
  const defaultCitySlug = typeof ((_a = config.public) == null ? void 0 : _a.defaultCitySlug) === "string" && config.public.defaultCitySlug.trim() ? config.public.defaultCitySlug.trim() : "ulan-ude";
  const citySlug = typeof (body == null ? void 0 : body.citySlug) === "string" && body.citySlug.trim() ? body.citySlug.trim() : defaultCitySlug;
  const redirectPath = sanitizeInternalPath$2(body == null ? void 0 : body.redirectPath, defaultCitySlug);
  const serviceClient = await serverSupabaseServiceRole(event);
  let bridgePayload = {};
  const rawBridge = typeof (body == null ? void 0 : body.bridgeKey) === "string" ? body.bridgeKey.trim() : "";
  if (rawBridge && shop) {
    const { data: bridgeRow } = await serviceClient.from("auth_bridge_sessions").select("payload, shop_id, expires_at").eq("bridge_key", rawBridge).maybeSingle();
    const isExpired = (bridgeRow == null ? void 0 : bridgeRow.expires_at) ? new Date(String(bridgeRow.expires_at)).getTime() < Date.now() : true;
    const bridgeShop = (bridgeRow == null ? void 0 : bridgeRow.shop_id) != null ? String(bridgeRow.shop_id) : "";
    const matchesShop = bridgeShop === shop.id || bridgeShop === shop.slug;
    if (bridgeRow && !isExpired && matchesShop) {
      bridgePayload = { ...bridgeRow.payload };
      await serviceClient.from("auth_bridge_sessions").delete().eq("bridge_key", rawBridge);
    }
  }
  bridgePayload.link_context = {
    shop_slug: (shop == null ? void 0 : shop.slug) || void 0,
    city_slug: citySlug,
    redirect_path: redirectPath,
    custom_domain_hostname: (shop == null ? void 0 : shop.custom_domain) ? String(shop.custom_domain).trim() : null
  };
  const loggedIn = await serverSupabaseUser(event);
  const sessionUid = (() => {
    const u = loggedIn;
    const id = typeof (u == null ? void 0 : u.id) === "string" ? u.id.trim() : "";
    if (id) return id;
    return typeof (u == null ? void 0 : u.sub) === "string" ? u.sub.trim() : "";
  })();
  if (sessionUid) {
    bridgePayload.link_profile_id = sessionUid;
  }
  const token = randomUUID();
  const { error } = await serviceClient.from("auth_tokens").insert({
    token,
    telegram_id: null,
    channel: "max",
    bridge_payload: bridgePayload
  });
  if (error) {
    console.error("request-max-link insert failed", error);
    throw createError({ statusCode: 500, statusMessage: "Failed to create MAX link token" });
  }
  const botStartParam = `link_${token}`;
  return {
    ok: true,
    token,
    botStartParam
  };
});

const requestMaxLink_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: requestMaxLink_post
}, Symbol.toStringTag, { value: 'Module' }));

function sanitizeInternalPath$1(path, defaultCitySlug) {
  return sanitizeAuthRedirectPath(path, defaultCitySlug);
}
const requestTelegramLink_post = defineEventHandler(async (event) => {
  var _a;
  const body = await readBody(event);
  const shopId = typeof (body == null ? void 0 : body.shopId) === "string" ? body.shopId.trim() : "";
  let shop = null;
  if (shopId) {
    shop = await getShopById(event, shopId);
    if (!shop) {
      throw createError({ statusCode: 404, statusMessage: "Shop not found" });
    }
  }
  const config = useRuntimeConfig();
  const defaultCitySlug = typeof ((_a = config.public) == null ? void 0 : _a.defaultCitySlug) === "string" && config.public.defaultCitySlug.trim() ? config.public.defaultCitySlug.trim() : "ulan-ude";
  const citySlug = typeof (body == null ? void 0 : body.citySlug) === "string" && body.citySlug.trim() ? body.citySlug.trim() : defaultCitySlug;
  const redirectPath = sanitizeInternalPath$1(body == null ? void 0 : body.redirectPath, defaultCitySlug);
  const serviceClient = await serverSupabaseServiceRole(event);
  let bridgePayload = {};
  const rawBridge = typeof (body == null ? void 0 : body.bridgeKey) === "string" ? body.bridgeKey.trim() : "";
  if (rawBridge && shop) {
    const { data: bridgeRow } = await serviceClient.from("auth_bridge_sessions").select("payload, shop_id, expires_at").eq("bridge_key", rawBridge).maybeSingle();
    const isExpired = (bridgeRow == null ? void 0 : bridgeRow.expires_at) ? new Date(String(bridgeRow.expires_at)).getTime() < Date.now() : true;
    const bridgeShop = (bridgeRow == null ? void 0 : bridgeRow.shop_id) != null ? String(bridgeRow.shop_id) : "";
    const matchesShop = bridgeShop === shop.id || bridgeShop === shop.slug;
    if (bridgeRow && !isExpired && matchesShop) {
      bridgePayload = { ...bridgeRow.payload };
      await serviceClient.from("auth_bridge_sessions").delete().eq("bridge_key", rawBridge);
    }
  }
  bridgePayload.link_context = {
    shop_slug: (shop == null ? void 0 : shop.slug) || void 0,
    city_slug: citySlug,
    redirect_path: redirectPath,
    custom_domain_hostname: (shop == null ? void 0 : shop.custom_domain) ? String(shop.custom_domain).trim() : null
  };
  const token = randomUUID();
  const { error } = await serviceClient.from("auth_tokens").insert({
    token,
    telegram_id: null,
    channel: "telegram",
    bridge_payload: bridgePayload
  });
  if (error) {
    console.error("request-telegram-link insert failed", error);
    throw createError({ statusCode: 500, statusMessage: "Failed to create link token" });
  }
  const botStartParam = `link_${token}`;
  return {
    ok: true,
    token,
    botStartParam
  };
});

const requestTelegramLink_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: requestTelegramLink_post
}, Symbol.toStringTag, { value: 'Module' }));

function sanitizeInternalPath(path, defaultCitySlug) {
  return sanitizeAuthRedirectPath(path, defaultCitySlug);
}
const requestVkLink_post = defineEventHandler(async (event) => {
  var _a, _b;
  const body = await readBody(event);
  const shopId = typeof (body == null ? void 0 : body.shopId) === "string" ? body.shopId.trim() : "";
  let shop = null;
  if (shopId) {
    shop = await getShopById(event, shopId);
    if (!shop) {
      throw createError({ statusCode: 404, statusMessage: "Shop not found" });
    }
  }
  const config = useRuntimeConfig();
  const clientId = String(((_a = config.public) == null ? void 0 : _a.vkIdClientId) || "").trim();
  const redirectUri = String(config.vkIdRedirectUri || "").trim();
  const vkBaseUrl = String(config.vkIdBaseUrl || "").trim() || "https://id.vk.com";
  if (!clientId || !redirectUri) {
    throw createError({ statusCode: 500, statusMessage: "VK ID OAuth is not configured" });
  }
  const defaultCitySlug = typeof ((_b = config.public) == null ? void 0 : _b.defaultCitySlug) === "string" && config.public.defaultCitySlug.trim() ? config.public.defaultCitySlug.trim() : "ulan-ude";
  const citySlug = typeof (body == null ? void 0 : body.citySlug) === "string" && body.citySlug.trim() ? body.citySlug.trim() : defaultCitySlug;
  const redirectPath = sanitizeInternalPath(body == null ? void 0 : body.redirectPath, defaultCitySlug);
  const serviceClient = await serverSupabaseServiceRole(event);
  let bridgePayload = {};
  const rawBridge = typeof (body == null ? void 0 : body.bridgeKey) === "string" ? body.bridgeKey.trim() : "";
  if (rawBridge && shop) {
    const { data: bridgeRow } = await serviceClient.from("auth_bridge_sessions").select("payload, shop_id, expires_at").eq("bridge_key", rawBridge).maybeSingle();
    const isExpired = (bridgeRow == null ? void 0 : bridgeRow.expires_at) ? new Date(String(bridgeRow.expires_at)).getTime() < Date.now() : true;
    const bridgeShop = (bridgeRow == null ? void 0 : bridgeRow.shop_id) != null ? String(bridgeRow.shop_id) : "";
    const matchesShop = bridgeShop === shop.id || bridgeShop === shop.slug;
    if (bridgeRow && !isExpired && matchesShop) {
      bridgePayload = { ...bridgeRow.payload };
      await serviceClient.from("auth_bridge_sessions").delete().eq("bridge_key", rawBridge);
    }
  }
  bridgePayload.link_context = {
    shop_slug: (shop == null ? void 0 : shop.slug) || void 0,
    city_slug: citySlug,
    redirect_path: redirectPath,
    custom_domain_hostname: (shop == null ? void 0 : shop.custom_domain) ? String(shop.custom_domain).trim() : null
  };
  const token = randomUUID();
  const { state, codeVerifier, codeChallenge } = generateVkPkcePair();
  const authorizeUrl = buildVkAuthorizeUrl({
    baseUrl: vkBaseUrl,
    clientId,
    redirectUri,
    state,
    codeChallenge
  });
  const { error } = await serviceClient.from("auth_tokens").insert({
    token,
    telegram_id: null,
    channel: "vk",
    bridge_payload: bridgePayload,
    vk_state: state,
    vk_code_verifier: codeVerifier
  });
  if (error) {
    console.error("request-vk-link insert failed", error);
    throw createError({ statusCode: 500, statusMessage: "Failed to create VK link token" });
  }
  return {
    ok: true,
    token,
    authorizeUrl
  };
});

const requestVkLink_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: requestVkLink_post
}, Symbol.toStringTag, { value: 'Module' }));

const telegramLinkStatus_get = defineEventHandler(async (event) => {
  const query = getQuery$1(event);
  const token = typeof query.token === "string" ? query.token.trim() : "";
  if (!token) {
    throw createError({ statusCode: 400, statusMessage: "token is required" });
  }
  const serviceClient = await serverSupabaseServiceRole(event);
  const { data: row, error } = await serviceClient.from("auth_tokens").select("telegram_id, expires_at, channel").eq("token", token).maybeSingle();
  if (error) {
    console.error("telegram-link-status query failed", error);
    throw createError({ statusCode: 500, statusMessage: "Failed to check token" });
  }
  if (!row) {
    return { ok: true, state: "invalid" };
  }
  if (String(row.channel || "telegram") !== "telegram") {
    return { ok: true, state: "invalid" };
  }
  const now = Date.now();
  const expiresAt = new Date(String(row.expires_at)).getTime();
  if (Number.isFinite(expiresAt) && expiresAt < now) {
    await serviceClient.from("auth_tokens").delete().eq("token", token);
    return { ok: true, state: "expired" };
  }
  const tgId = row.telegram_id;
  if (tgId != null) {
    return { ok: true, state: "ready" };
  }
  return { ok: true, state: "pending" };
});

const telegramLinkStatus_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: telegramLinkStatus_get
}, Symbol.toStringTag, { value: 'Module' }));

function toErrorMessage(raw) {
  if (typeof raw !== "string") return "vk_oauth_failed";
  return encodeURIComponent(raw.slice(0, 200));
}
const callback_get = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e, _f, _g;
  const query = getQuery$1(event);
  const code = typeof query.code === "string" ? query.code.trim() : "";
  const state = typeof query.state === "string" ? query.state.trim() : "";
  const deviceId = typeof query.device_id === "string" ? query.device_id.trim() : "";
  const errorFromVk = typeof query.error === "string" ? query.error.trim() : "";
  const config = useRuntimeConfig();
  const appUrlBase = (config.appUrl || "").replace(/\/$/, "");
  const defaultCitySlug = typeof ((_a = config.public) == null ? void 0 : _a.defaultCitySlug) === "string" && config.public.defaultCitySlug.trim() ? config.public.defaultCitySlug.trim() : "ulan-ude";
  if (!state) {
    throw createError({ statusCode: 400, statusMessage: "state is required" });
  }
  const serviceClient = await serverSupabaseServiceRole(event);
  const { data: row, error: rowError } = await serviceClient.from("auth_tokens").select("token, channel, expires_at, vk_state, vk_code_verifier, vk_user_id, bridge_payload").eq("vk_state", state).maybeSingle();
  if (rowError) {
    throw createError({ statusCode: 500, statusMessage: "Failed to read VK auth token" });
  }
  if (!row || String(row.channel || "") !== "vk") {
    throw createError({ statusCode: 400, statusMessage: "Invalid VK state" });
  }
  const token = String(row.token);
  const expiresAt = new Date(String(row.expires_at)).getTime();
  if (Number.isFinite(expiresAt) && expiresAt < Date.now()) {
    await serviceClient.from("auth_tokens").delete().eq("token", token);
    return sendRedirect(event, `/link-vk?token=${encodeURIComponent(token)}&error=token_expired`, 302);
  }
  if (errorFromVk) {
    return sendRedirect(event, `/link-vk?token=${encodeURIComponent(token)}&error=${toErrorMessage(errorFromVk)}`, 302);
  }
  if (!code) {
    return sendRedirect(event, `/link-vk?token=${encodeURIComponent(token)}&error=missing_code`, 302);
  }
  const vkClientId = String(((_b = config.public) == null ? void 0 : _b.vkIdClientId) || "").trim();
  const vkClientSecret = String(config.vkIdClientSecret || "").trim();
  const vkRedirectUri = String(config.vkIdRedirectUri || "").trim();
  const vkBaseUrl = String(config.vkIdBaseUrl || "").trim() || "https://id.vk.com";
  const codeVerifier = String(row.vk_code_verifier || "").trim();
  if (!vkClientId || !vkClientSecret || !vkRedirectUri || !codeVerifier) {
    throw createError({ statusCode: 500, statusMessage: "VK OAuth configuration is invalid" });
  }
  try {
    const tokenRes = await exchangeVkCode({
      baseUrl: vkBaseUrl,
      clientId: vkClientId,
      clientSecret: vkClientSecret,
      redirectUri: vkRedirectUri,
      code,
      codeVerifier,
      deviceId: deviceId || void 0,
      state
    });
    const accessToken = String(tokenRes.access_token || "").trim();
    if (!accessToken) throw new Error("missing_access_token");
    const userInfo = await fetchVkUserInfo({
      baseUrl: vkBaseUrl,
      accessToken
    });
    const vkUserRaw = (_d = (_c = userInfo == null ? void 0 : userInfo.user) == null ? void 0 : _c.user_id) != null ? _d : tokenRes.user_id;
    const vkUserId = vkUserRaw != null ? String(vkUserRaw).trim() : "";
    if (!vkUserId) throw new Error("missing_vk_user_id");
    const existingVk = String(row.vk_user_id || "").trim();
    if (existingVk && existingVk !== vkUserId) {
      return sendRedirect(event, `/link-vk?token=${encodeURIComponent(token)}&error=token_already_bound`, 302);
    }
    const bridgePayload = {
      ...row.bridge_payload || {},
      vk_email: typeof ((_e = userInfo == null ? void 0 : userInfo.user) == null ? void 0 : _e.email) === "string" ? userInfo.user.email : null,
      vk_phone: typeof ((_f = userInfo == null ? void 0 : userInfo.user) == null ? void 0 : _f.phone) === "string" ? userInfo.user.phone : null
    };
    if (!existingVk) {
      const { error: updErr } = await serviceClient.from("auth_tokens").update({
        vk_user_id: vkUserId,
        vk_device_id: deviceId || null,
        bridge_payload: bridgePayload
      }).eq("token", token).is("vk_user_id", null);
      if (updErr) {
        throw updErr;
      }
    } else {
      await serviceClient.from("auth_tokens").update({
        vk_device_id: deviceId || null,
        bridge_payload: bridgePayload
      }).eq("token", token);
    }
    const link = buildAuthSiteLinkUrl({
      linkPath: "link-vk",
      appUrlBase,
      defaultCitySlug,
      token,
      bridgePayload,
      tenantShop: (_g = event.context.tenant) == null ? void 0 : _g.shop
    });
    return sendRedirect(event, link, 302);
  } catch (err) {
    const status = (err == null ? void 0 : err.statusMessage) || (err == null ? void 0 : err.message) || "vk_oauth_failed";
    return sendRedirect(event, `/link-vk?token=${encodeURIComponent(token)}&error=${toErrorMessage(status)}`, 302);
  }
});

const callback_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: callback_get
}, Symbol.toStringTag, { value: 'Module' }));

const vkLinkStatus_get = defineEventHandler(async (event) => {
  const query = getQuery$1(event);
  const token = typeof query.token === "string" ? query.token.trim() : "";
  if (!token) {
    throw createError({ statusCode: 400, statusMessage: "token is required" });
  }
  const serviceClient = await serverSupabaseServiceRole(event);
  const { data: row, error } = await serviceClient.from("auth_tokens").select("vk_user_id, expires_at, channel").eq("token", token).maybeSingle();
  if (error) {
    console.error("vk-link-status query failed", error);
    throw createError({ statusCode: 500, statusMessage: "Failed to check token" });
  }
  if (!row) {
    return { ok: true, state: "invalid" };
  }
  if (String(row.channel || "") !== "vk") {
    return { ok: true, state: "invalid" };
  }
  const now = Date.now();
  const expiresAt = new Date(String(row.expires_at)).getTime();
  if (Number.isFinite(expiresAt) && expiresAt < now) {
    await serviceClient.from("auth_tokens").delete().eq("token", token);
    return { ok: true, state: "expired" };
  }
  const vkUserId = row.vk_user_id;
  if (vkUserId != null && String(vkUserId).trim() !== "") {
    return { ok: true, state: "ready" };
  }
  return { ok: true, state: "pending" };
});

const vkLinkStatus_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: vkLinkStatus_get
}, Symbol.toStringTag, { value: 'Module' }));

function canRetryWithLegacySchema(error) {
  const code = typeof (error == null ? void 0 : error.code) === "string" ? error.code : "";
  return code === "42703" || code === "42P01" || code.startsWith("PGRST2");
}
const cities_get$2 = defineEventHandler(async (event) => {
  var _a, _b, _c;
  setResponseHeader(event, "Cache-Control", "public, max-age=120, s-maxage=300, stale-while-revalidate=600");
  const query = getQuery$1(event);
  const config = useRuntimeConfig(event);
  const requestedSlug = typeof query.slug === "string" ? query.slug.trim() : "";
  const requestedFestivalSlug = typeof query.festival_slug === "string" ? query.festival_slug.trim() : "";
  const defaultSlug = typeof ((_a = config.public) == null ? void 0 : _a.defaultCitySlug) === "string" ? config.public.defaultCitySlug.trim() : "";
  const slug = requestedSlug || defaultSlug;
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: "City slug is required" });
  }
  const client = await serverSupabaseClient(event);
  let data = null;
  let error = null;
  const primary = await client.from("cities").select("id,name,slug,timezone,editorial_name,is_active").eq("slug", slug).eq("is_active", true).maybeSingle();
  data = primary.data;
  error = primary.error;
  if (error && canRetryWithLegacySchema(error)) {
    const fallback = await client.from("cities").select("id,name,slug").eq("slug", slug).maybeSingle();
    data = fallback.data;
    error = fallback.error;
  }
  if (error) {
    console.error("Failed to load city by slug:", error);
    throw createError({ statusCode: 500, statusMessage: "Failed to load city" });
  }
  const city = data;
  if (!city) {
    return {
      ok: true,
      city: null
    };
  }
  let festival = null;
  const { data: festivalRows } = await client.from("festivals").select("id,slug,name,description,pulse_stats,schedule,public_banner_lead_days,starts_at,ends_at").eq("city_id", city.id).eq("is_active", true).order("created_at", { ascending: false }).limit(10);
  if (Array.isArray(festivalRows) && festivalRows.length) {
    const nowTs = Date.now();
    const current = requestedFestivalSlug ? festivalRows.find((row) => typeof row.slug === "string" && row.slug.trim() === requestedFestivalSlug) : festivalRows.find((row) => {
      const startsAt = typeof row.starts_at === "string" ? Date.parse(row.starts_at) : NaN;
      const endsAt = typeof row.ends_at === "string" ? Date.parse(row.ends_at) : NaN;
      const leadDays = typeof row.public_banner_lead_days === "number" ? row.public_banner_lead_days : 35;
      const bannerStartsAt = Number.isNaN(startsAt) ? NaN : startsAt - leadDays * 24 * 60 * 60 * 1e3;
      const startsOk = Number.isNaN(bannerStartsAt) || bannerStartsAt <= nowTs;
      const endsOk = Number.isNaN(endsAt) || endsAt >= nowTs;
      return startsOk && endsOk;
    });
    if (current == null ? void 0 : current.id) {
      festival = current;
    }
  }
  return {
    ok: true,
    city: {
      id: city.id,
      name: city.name,
      slug: city.slug,
      timezone: city.timezone || "Asia/Irkutsk",
      editorialName: (_b = city.editorial_name) != null ? _b : null,
      isActive: city.is_active !== false
    },
    festival: festival ? {
      id: festival.id,
      slug: festival.slug,
      name: festival.name,
      description: festival.description,
      pulseStats: (_c = festival.pulse_stats) != null ? _c : {},
      schedule: Array.isArray(festival.schedule) ? festival.schedule : []
    } : null
  };
});

const cities_get$3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: cities_get$2
}, Symbol.toStringTag, { value: 'Module' }));

const _eventSlug__get = defineEventHandler(async (event) => {
  var _a, _b;
  setResponseHeader(event, "Cache-Control", "public, max-age=60, s-maxage=120");
  const slug = typeof ((_a = event.context.params) == null ? void 0 : _a.slug) === "string" ? event.context.params.slug : "";
  const eventSlug = typeof ((_b = event.context.params) == null ? void 0 : _b.eventSlug) === "string" ? event.context.params.eventSlug : "";
  const city = await resolveCityBySlug(event, slug);
  const client = await serverSupabaseClient(event);
  const { data, error } = await client.from("events").select("*, venues:venue_id(id,slug,title,address)").eq("city_id", city.id).eq("slug", eventSlug).eq("is_published", true).maybeSingle();
  if (error) {
    console.error("[events/detail] load failed:", error);
    throw createError({ statusCode: 500, statusMessage: "Failed to load event" });
  }
  if (!data) {
    throw createError({ statusCode: 404, statusMessage: "Event not found" });
  }
  return { ok: true, event: data };
});

const _eventSlug__get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _eventSlug__get
}, Symbol.toStringTag, { value: 'Module' }));

const index_get$8 = defineEventHandler(async (event) => {
  var _a;
  setResponseHeader(event, "Cache-Control", "public, max-age=60, s-maxage=120");
  const slug = typeof ((_a = event.context.params) == null ? void 0 : _a.slug) === "string" ? event.context.params.slug : "";
  const city = await resolveCityBySlug(event, slug);
  const query = getQuery$1(event);
  const limit = Math.min(50, Math.max(1, Number(query.limit) || 24));
  const nowIso = (/* @__PURE__ */ new Date()).toISOString();
  const client = await serverSupabaseClient(event);
  const { data, error } = await client.from("events").select("id,slug,title,description,starts_at,ends_at,price,currency,cover_media_url,is_promoted,venue_id").eq("city_id", city.id).eq("is_published", true).gte("starts_at", nowIso).order("starts_at", { ascending: true }).limit(limit);
  if (error) {
    console.error("[events/index] load failed:", error);
    return { ok: false, items: [] };
  }
  return { ok: true, items: data != null ? data : [] };
});

const index_get$9 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_get$8
}, Symbol.toStringTag, { value: 'Module' }));

const home_get = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e, _f;
  setResponseHeader(event, "Cache-Control", "public, max-age=60, s-maxage=120, stale-while-revalidate=300");
  const slug = typeof ((_a = event.context.params) == null ? void 0 : _a.slug) === "string" ? event.context.params.slug : "";
  const city = await resolveCityBySlug(event, slug);
  const client = await serverSupabaseClient(event);
  const nowIso = (/* @__PURE__ */ new Date()).toISOString();
  const [storiesRes, eventsRes, venuesRes, listsRes, hotSlotsRes] = await Promise.all([
    client.from("story_campaigns").select("id,title,preview_url,placement,author_type,link_url").eq("city_id", city.id).eq("is_active", true).in("placement", ["top_bar", "home_hero"]).order("created_at", { ascending: false }).limit(12),
    client.from("events").select("id,slug,title,description,starts_at,ends_at,price,currency,cover_media_url,is_promoted,venue_id").eq("city_id", city.id).eq("is_published", true).gte("starts_at", nowIso).order("starts_at", { ascending: true }).limit(12),
    client.from("venues").select("id,slug,title,description,address,lat,lng,cover_media_url,vibe_tags,rating_avg,editorial_quote").eq("city_id", city.id).eq("is_published", true).eq("is_active", true).order("rating_avg", { ascending: false }).limit(12),
    client.from("curated_lists").select("id,slug,title,description,sort_order").eq("city_id", city.id).eq("is_published", true).order("sort_order", { ascending: true }).limit(6),
    client.from("hot_slots").select("id,starts_at,expires_at,price,discount_price,provider_id,service_id").eq("city_id", city.id).eq("is_active", true).gte("expires_at", nowIso).order("starts_at", { ascending: true }).limit(8)
  ]);
  return {
    ok: true,
    city: {
      id: city.id,
      name: city.name,
      slug: city.slug,
      timezone: city.timezone,
      editorialName: city.editorial_name
    },
    stories: (_b = storiesRes.data) != null ? _b : [],
    events: (_c = eventsRes.data) != null ? _c : [],
    venues: (_d = venuesRes.data) != null ? _d : [],
    curatedLists: (_e = listsRes.data) != null ? _e : [],
    hotSlots: (_f = hotSlotsRes.data) != null ? _f : []
  };
});

const home_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: home_get
}, Symbol.toStringTag, { value: 'Module' }));

const _listSlug__get = defineEventHandler(async (event) => {
  var _a, _b, _c, _d;
  setResponseHeader(event, "Cache-Control", "public, max-age=60, s-maxage=120");
  const slug = typeof ((_a = event.context.params) == null ? void 0 : _a.slug) === "string" ? event.context.params.slug : "";
  const listSlug = typeof ((_b = event.context.params) == null ? void 0 : _b.listSlug) === "string" ? event.context.params.listSlug : "";
  const city = await resolveCityBySlug(event, slug);
  const client = await serverSupabaseClient(event);
  const { data: list, error: listError } = await client.from("curated_lists").select("id,slug,title,description").eq("city_id", city.id).eq("slug", listSlug).eq("is_published", true).maybeSingle();
  if (listError) {
    console.error("[lists/detail] list load failed:", listError);
    throw createError({ statusCode: 500, statusMessage: "Failed to load list" });
  }
  if (!list) {
    throw createError({ statusCode: 404, statusMessage: "List not found" });
  }
  const { data: rawItems, error: itemsError } = await client.from("curated_list_items").select("id,entity_type,entity_id,sort_order,note").eq("list_id", list.id).order("sort_order", { ascending: true });
  if (itemsError) {
    console.error("[lists/detail] items load failed:", itemsError);
    throw createError({ statusCode: 500, statusMessage: "Failed to load list items" });
  }
  const rows = rawItems != null ? rawItems : [];
  const venueIds = rows.filter((r) => r.entity_type === "venue").map((r) => r.entity_id);
  const eventIds = rows.filter((r) => r.entity_type === "event").map((r) => r.entity_id);
  const [venuesRes, eventsRes] = await Promise.all([
    venueIds.length ? client.from("venues").select("id,slug,title,description,address,cover_media_url,vibe_tags,editorial_quote").eq("city_id", city.id).eq("is_published", true).eq("is_active", true).in("id", venueIds) : Promise.resolve({ data: [] }),
    eventIds.length ? client.from("events").select("id,slug,title,description,starts_at,price,currency,cover_media_url").eq("city_id", city.id).eq("is_published", true).in("id", eventIds) : Promise.resolve({ data: [] })
  ]);
  const venueById = new Map(
    ((_c = venuesRes.data) != null ? _c : []).map((v) => [String(v.id), v])
  );
  const eventById = new Map(
    ((_d = eventsRes.data) != null ? _d : []).map((e) => [String(e.id), e])
  );
  const items = rows.map((row) => {
    if (row.entity_type === "venue") {
      const venue = venueById.get(row.entity_id);
      return venue ? { entityType: "venue", note: row.note, venue } : null;
    }
    if (row.entity_type === "event") {
      const evt = eventById.get(row.entity_id);
      return evt ? { entityType: "event", note: row.note, event: evt } : null;
    }
    return null;
  }).filter((item) => item !== null);
  return { ok: true, list, items };
});

const _listSlug__get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _listSlug__get
}, Symbol.toStringTag, { value: 'Module' }));

const CITY_PLACEMENTS = ["top_bar", "home_hero"];
const stories_get$2 = defineEventHandler(async (event) => {
  var _a;
  setResponseHeader(event, "Cache-Control", "public, max-age=60, s-maxage=120, stale-while-revalidate=300");
  const slug = typeof ((_a = event.context.params) == null ? void 0 : _a.slug) === "string" ? event.context.params.slug : "";
  const city = await resolveCityBySlug(event, slug);
  const client = await serverSupabaseClient(event);
  const nowIso = (/* @__PURE__ */ new Date()).toISOString();
  const { data: campaigns, error: campErr } = await client.from("story_campaigns").select(
    "id, title, preview_url, placement, is_active, valid_from, valid_until, targeting, created_at"
  ).eq("city_id", city.id).eq("is_active", true).in("placement", [...CITY_PLACEMENTS]).order("created_at", { ascending: false });
  if (campErr) {
    console.error("cities/stories campaigns:", campErr);
    throw createError({ statusCode: 500, statusMessage: "Failed to load stories" });
  }
  const timeOk = (c) => {
    const vf = c.valid_from;
    const vu = c.valid_until;
    if (vf && typeof vf === "string" && vf > nowIso) return false;
    if (vu && typeof vu === "string" && vu < nowIso) return false;
    return true;
  };
  const filtered = (campaigns != null ? campaigns : []).filter((c) => timeOk(c));
  const campaignIds = filtered.map((c) => c.id);
  if (campaignIds.length === 0) {
    return {
      ok: true,
      cityId: city.id,
      topBar: [],
      campaigns: []
    };
  }
  const { data: slides, error: slideErr } = await client.from("story_slides").select(
    "id, campaign_id, sort_order, media_url, duration_seconds, action_type, action_payload"
  ).in("campaign_id", campaignIds).order("sort_order", { ascending: true });
  if (slideErr) {
    console.error("cities/stories slides:", slideErr);
    throw createError({ statusCode: 500, statusMessage: "Failed to load story slides" });
  }
  const slidesByCampaign = /* @__PURE__ */ new Map();
  for (const s of slides != null ? slides : []) {
    const cid = s.campaign_id;
    if (!slidesByCampaign.has(cid)) slidesByCampaign.set(cid, []);
    slidesByCampaign.get(cid).push(s);
  }
  const mapSlide = (s) => {
    var _a2;
    const actionPayload = (_a2 = s.action_payload) != null ? _a2 : {};
    const title = typeof actionPayload.title === "string" ? actionPayload.title : null;
    const text = typeof actionPayload.text === "string" ? actionPayload.text : null;
    return {
      id: s.id,
      campaignId: s.campaign_id,
      sortOrder: s.sort_order,
      mediaUrl: s.media_url || "",
      durationSeconds: s.duration_seconds,
      actionType: s.action_type,
      actionPayload,
      title,
      text
    };
  };
  const mapCampaign = (c) => {
    var _a2, _b;
    const id = c.id;
    const rawSlides = (_a2 = slidesByCampaign.get(id)) != null ? _a2 : [];
    return {
      id,
      title: c.title,
      previewUrl: (_b = c.preview_url) != null ? _b : null,
      placement: c.placement,
      targeting: c.targeting,
      slides: rawSlides.map((x) => mapSlide(x))
    };
  };
  const mapped = filtered.map((c) => mapCampaign(c)).filter((c) => c.slides.length > 0);
  const topBar = mapped.filter(
    (c) => CITY_PLACEMENTS.includes(c.placement)
  );
  return {
    ok: true,
    cityId: city.id,
    topBar,
    campaigns: mapped
  };
});

const stories_get$3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: stories_get$2
}, Symbol.toStringTag, { value: 'Module' }));

const _venueSlug__get = defineEventHandler(async (event) => {
  var _a, _b;
  setResponseHeader(event, "Cache-Control", "public, max-age=60, s-maxage=120");
  const slug = typeof ((_a = event.context.params) == null ? void 0 : _a.slug) === "string" ? event.context.params.slug : "";
  const venueSlug = typeof ((_b = event.context.params) == null ? void 0 : _b.venueSlug) === "string" ? event.context.params.venueSlug : "";
  const city = await resolveCityBySlug(event, slug);
  const client = await serverSupabaseClient(event);
  const { data, error } = await client.from("venues").select("*").eq("city_id", city.id).eq("slug", venueSlug).eq("is_published", true).eq("is_active", true).maybeSingle();
  if (error) {
    console.error("[venues/detail] load failed:", error);
    throw createError({ statusCode: 500, statusMessage: "Failed to load venue" });
  }
  if (!data) {
    throw createError({ statusCode: 404, statusMessage: "Venue not found" });
  }
  const { data: upcomingEvents } = await client.from("events").select("id,slug,title,starts_at,cover_media_url,price,currency").eq("city_id", city.id).eq("venue_id", data.id).eq("is_published", true).gte("starts_at", (/* @__PURE__ */ new Date()).toISOString()).order("starts_at", { ascending: true }).limit(8);
  return { ok: true, venue: data, upcomingEvents: upcomingEvents != null ? upcomingEvents : [] };
});

const _venueSlug__get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _venueSlug__get
}, Symbol.toStringTag, { value: 'Module' }));

const index_get$6 = defineEventHandler(async (event) => {
  var _a;
  setResponseHeader(event, "Cache-Control", "public, max-age=60, s-maxage=120");
  const slug = typeof ((_a = event.context.params) == null ? void 0 : _a.slug) === "string" ? event.context.params.slug : "";
  const city = await resolveCityBySlug(event, slug);
  const query = getQuery$1(event);
  const limit = Math.min(50, Math.max(1, Number(query.limit) || 24));
  const client = await serverSupabaseClient(event);
  const { data, error } = await client.from("venues").select("id,slug,title,description,address,lat,lng,cover_media_url,vibe_tags,rating_avg,editorial_quote,phone,instagram_url").eq("city_id", city.id).eq("is_published", true).eq("is_active", true).order("rating_avg", { ascending: false }).limit(limit);
  if (error) {
    console.error("[venues/index] load failed:", error);
    return { ok: false, items: [] };
  }
  return { ok: true, items: data != null ? data : [] };
});

const index_get$7 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_get$6
}, Symbol.toStringTag, { value: 'Module' }));

const clientOrders_get = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e, _f;
  const config = useRuntimeConfig();
  const tenant = (_a = event.context) == null ? void 0 : _a.tenant;
  const botToken = typeof (tenant == null ? void 0 : tenant.telegramBotToken) === "string" && tenant.telegramBotToken.trim() ? tenant.telegramBotToken.trim() : String(config.botToken || "");
  if (!botToken) {
    throw createError({ statusCode: 500, statusMessage: "Bot token missing" });
  }
  const profileId = await resolveCustomerProfileId(event, botToken).catch(() => "");
  const initData = getMessengerInitDataFromEvent(event);
  const telegramCandidateTokens = uniqueNonEmptyTokens([
    typeof (tenant == null ? void 0 : tenant.telegramBotToken) === "string" ? tenant.telegramBotToken : void 0,
    botToken,
    config.botToken
  ]);
  const telegramUserId = initData ? (_c = (_b = validateWebAppInitDataAnyToken(initData, telegramCandidateTokens)) == null ? void 0 : _b.id) != null ? _c : null : null;
  const tenantIntegrationKeys = (_e = (_d = event.context) == null ? void 0 : _d.tenant) == null ? void 0 : _e.integrationKeys;
  const maxToken = getMaxBotTokenForShop(tenantIntegrationKeys, {
    maxMiniAppBotToken: config.maxMiniAppBotToken,
    maxApiToken: config.maxApiToken
  });
  const maxCandidateTokens = uniqueNonEmptyTokens([
    typeof (tenantIntegrationKeys == null ? void 0 : tenantIntegrationKeys.max_bot_token) === "string" ? tenantIntegrationKeys.max_bot_token : void 0,
    config.maxMiniAppBotToken,
    config.maxApiToken,
    maxToken
  ]);
  const maxUserId = initData ? String(((_f = validateWebAppInitDataAnyToken(initData, maxCandidateTokens)) == null ? void 0 : _f.id) || "").trim() : "";
  const hasMessengerIdentity = telegramUserId != null || !!maxUserId;
  if (!profileId && !hasMessengerIdentity) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }
  const client = await serverSupabaseServiceRole(event);
  let ordersQuery = client.from("orders").select("id,shop_id,restaurant_id,status,fulfillment_type,payment_method,subtotal,delivery_cost,total,items,created_at").order("created_at", { ascending: false }).limit(200);
  if (profileId) {
    ordersQuery = ordersQuery.eq("customer_profile_id", profileId);
  } else if (telegramUserId != null) {
    ordersQuery = ordersQuery.eq("customer_telegram_id", telegramUserId);
  } else if (maxUserId) {
    const { data: maxProfile } = await client.from("profiles").select("id").eq("max_user_id", maxUserId).maybeSingle();
    const maxProfileId = (maxProfile == null ? void 0 : maxProfile.id) ? String(maxProfile.id) : "";
    if (!maxProfileId) {
      throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
    }
    ordersQuery = ordersQuery.eq("customer_profile_id", maxProfileId);
  }
  const { data: ordersData, error: ordersError } = await ordersQuery;
  if (ordersError) {
    console.error("Failed to load client orders:", ordersError);
    throw createError({ statusCode: 500, statusMessage: "Failed to load orders" });
  }
  const rows = ordersData != null ? ordersData : [];
  const shopIds = Array.from(new Set(rows.map((x) => x.shop_id).filter(Boolean)));
  const restaurantIds = Array.from(new Set(rows.map((x) => x.restaurant_id).filter((x) => !!x)));
  const orderIds = rows.map((r) => r.id);
  const reviewByOrderId = /* @__PURE__ */ new Set();
  if (orderIds.length) {
    const { data: revRows } = await client.from("shop_reviews").select("order_id").in("order_id", orderIds);
    for (const rv of revRows != null ? revRows : []) {
      const oid = typeof (rv == null ? void 0 : rv.order_id) === "string" ? String(rv.order_id) : "";
      if (oid) reviewByOrderId.add(oid);
    }
  }
  const shopsMap = /* @__PURE__ */ new Map();
  if (shopIds.length) {
    const { data: shopsData } = await client.from("shops").select("id,name").in("id", shopIds);
    for (const row of shopsData != null ? shopsData : []) {
      if ((row == null ? void 0 : row.id) && (row == null ? void 0 : row.name)) shopsMap.set(row.id, row.name);
    }
  }
  const restaurantsMap = /* @__PURE__ */ new Map();
  if (restaurantIds.length) {
    const { data: restaurantsData } = await client.from("restaurants").select("id,name").in("id", restaurantIds);
    for (const row of restaurantsData != null ? restaurantsData : []) {
      if ((row == null ? void 0 : row.id) && (row == null ? void 0 : row.name)) restaurantsMap.set(row.id, row.name);
    }
  }
  const activeStatuses = /* @__PURE__ */ new Set(["new", "in_progress", "ready_for_pickup", "out_for_delivery"]);
  const items = rows.map((row) => {
    const status = normalizeDashboardStatus(row.status);
    const safeItems = Array.isArray(row.items) ? row.items : [];
    const itemsCount = safeItems.reduce((sum, item) => sum + (Number(item == null ? void 0 : item.quantity) || 0), 0);
    const itemsPreview = safeItems.slice(0, 5).map((item) => ({
      name: typeof (item == null ? void 0 : item.name) === "string" && item.name.trim() ? item.name.trim() : "\u041F\u043E\u0437\u0438\u0446\u0438\u044F",
      quantity: Number(item == null ? void 0 : item.quantity) > 0 ? Number(item.quantity) : 1
    }));
    const title = restaurantsMap.get(row.restaurant_id || "") || shopsMap.get(row.shop_id) || "\u0420\u0435\u0441\u0442\u043E\u0440\u0430\u043D";
    return {
      id: row.id,
      shopId: row.shop_id,
      restaurantId: row.restaurant_id,
      restaurantName: title,
      status,
      isActive: activeStatuses.has(status),
      fulfillmentType: row.fulfillment_type || "delivery",
      paymentMethod: row.payment_method || "cash",
      subtotal: row.subtotal || 0,
      deliveryCost: row.delivery_cost || 0,
      total: row.total || 0,
      itemsCount,
      itemsPreview,
      createdAt: row.created_at,
      hasShopReview: reviewByOrderId.has(row.id)
    };
  });
  return { ok: true, items };
});

const clientOrders_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: clientOrders_get
}, Symbol.toStringTag, { value: 'Module' }));

const reviewPrompts_post = defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const secret = String(config.cronReviewPromptsSecret || "").trim();
  if (!secret) {
    throw createError({ statusCode: 503, statusMessage: "Cron secret not configured" });
  }
  const header = String(getHeader(event, "x-cron-secret") || "").trim();
  if (header !== secret) {
    throw createError({ statusCode: 403, statusMessage: "Forbidden" });
  }
  const processed = await processDueReviewPrompts(event, { limit: 50 });
  return { ok: true, processed };
});

const reviewPrompts_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: reviewPrompts_post
}, Symbol.toStringTag, { value: 'Module' }));

const access_get = defineEventHandler(async (event) => {
  const access = await requireDashboardAccess(event);
  return {
    ok: true,
    userId: access.userId,
    shopId: access.shopId,
    role: access.role
  };
});

const access_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: access_get
}, Symbol.toStringTag, { value: 'Module' }));

function normalizeFestivalFulfillmentType$1(value) {
  return value === "delivery" || value === "pickup" || value === "dine-in" ? value : null;
}
const branches_post = defineEventHandler(async (event) => {
  var _a, _b, _c;
  const access = await requireDashboardAccess(event);
  const body = await readBody(event);
  const name = (_a = body == null ? void 0 : body.name) == null ? void 0 : _a.trim();
  const address = (_b = body == null ? void 0 : body.address) == null ? void 0 : _b.trim();
  if (!name || !address) {
    throw createError({ statusCode: 400, statusMessage: "name and address are required" });
  }
  const lat = typeof (body == null ? void 0 : body.lat) === "number" && Number.isFinite(body.lat) ? body.lat : null;
  const lon = typeof (body == null ? void 0 : body.lon) === "number" && Number.isFinite(body.lon) ? body.lon : null;
  const isFestivalBranch = (body == null ? void 0 : body.isFestival) === true;
  const festivalFulfillmentType = normalizeFestivalFulfillmentType$1(body == null ? void 0 : body.festivalFulfillmentType) || "pickup";
  const client = await serverSupabaseServiceRole(event);
  const config = useRuntimeConfig(event);
  const citySlug = typeof ((_c = config.public) == null ? void 0 : _c.defaultCitySlug) === "string" ? config.public.defaultCitySlug : "ulan-ude";
  const { data: cityData, error: cityError } = await client.from("cities").select("id").eq("slug", citySlug).maybeSingle();
  if (cityError || !(cityData == null ? void 0 : cityData.id)) {
    throw createError({ statusCode: 500, statusMessage: "Default city is missing" });
  }
  const { data, error } = await client.from("restaurants").insert({
    shop_id: access.shopId,
    city_id: cityData.id,
    name,
    address,
    lat,
    lon,
    supports_delivery: (body == null ? void 0 : body.supportsDelivery) !== false,
    supports_pickup: (body == null ? void 0 : body.supportsPickup) !== false,
    supports_dine_in: (body == null ? void 0 : body.supportsDineIn) === true,
    supports_qr_menu: (body == null ? void 0 : body.supportsQrMenu) === true,
    supports_showcase_order: (body == null ? void 0 : body.supportsShowcaseOrder) === true,
    festival_id: (body == null ? void 0 : body.festivalId) || null,
    is_festival: isFestivalBranch,
    festival_fulfillment_type: isFestivalBranch ? festivalFulfillmentType : null,
    is_active: true
  }).select("id,name,address,lat,lon,supports_delivery,supports_pickup,supports_dine_in,supports_qr_menu,supports_showcase_order,festival_id,is_festival,festival_fulfillment_type,is_active").single();
  if (error) {
    throw createError({ statusCode: 400, statusMessage: error.message || "Failed to create branch" });
  }
  return { ok: true, item: data };
});

const branches_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: branches_post
}, Symbol.toStringTag, { value: 'Module' }));

function normalizeFestivalFulfillmentType(value) {
  return value === "delivery" || value === "pickup" || value === "dine-in" ? value : null;
}
const _id__put$2 = defineEventHandler(async (event) => {
  var _a, _b, _c, _d;
  const access = await requireDashboardAccess(event);
  if (access.role !== "owner") {
    throw createError({ statusCode: 403, statusMessage: "Only owner can update branch settings" });
  }
  const branchId = getRouterParam(event, "id");
  if (!branchId) {
    throw createError({ statusCode: 400, statusMessage: "Branch id is required" });
  }
  const body = await readBody(event);
  const name = (_a = body == null ? void 0 : body.name) == null ? void 0 : _a.trim();
  const address = (_b = body == null ? void 0 : body.address) == null ? void 0 : _b.trim();
  const lat = typeof (body == null ? void 0 : body.lat) === "number" && Number.isFinite(body.lat) ? body.lat : null;
  const lon = typeof (body == null ? void 0 : body.lon) === "number" && Number.isFinite(body.lon) ? body.lon : null;
  const isFestivalBranch = (body == null ? void 0 : body.isFestival) === true;
  const festivalFulfillmentType = normalizeFestivalFulfillmentType(body == null ? void 0 : body.festivalFulfillmentType) || "pickup";
  if (!name || !address) {
    throw createError({ statusCode: 400, statusMessage: "name and address are required" });
  }
  const client = await serverSupabaseServiceRole(event);
  const fallbackWorkingHours = getDefaultOrganizationSettings().ops.workingHours;
  const normalizedWorkingHours = normalizeWeeklyWorkingHours(body == null ? void 0 : body.workingHours, fallbackWorkingHours);
  let update = await client.from("restaurants").update({
    name,
    address,
    lat,
    lon,
    supports_delivery: (body == null ? void 0 : body.supportsDelivery) === true,
    supports_pickup: (body == null ? void 0 : body.supportsPickup) === true,
    supports_dine_in: (body == null ? void 0 : body.supportsDineIn) === true,
    supports_qr_menu: (body == null ? void 0 : body.supportsQrMenu) === true,
    supports_showcase_order: (body == null ? void 0 : body.supportsShowcaseOrder) === true,
    festival_id: (body == null ? void 0 : body.festivalId) || null,
    is_festival: isFestivalBranch,
    festival_fulfillment_type: isFestivalBranch ? festivalFulfillmentType : null,
    use_organization_working_hours: (body == null ? void 0 : body.useOrganizationWorkingHours) !== false,
    working_hours: normalizedWorkingHours
  }).eq("id", branchId).eq("shop_id", access.shopId).select("id,name,address,lat,lon,supports_delivery,supports_pickup,supports_dine_in,supports_qr_menu,supports_showcase_order,festival_id,is_festival,festival_fulfillment_type,use_organization_working_hours,working_hours,is_active").maybeSingle();
  if (update.error && update.error.code === "42703") {
    update = await client.from("restaurants").update({
      name,
      address,
      lat,
      lon,
      supports_delivery: (body == null ? void 0 : body.supportsDelivery) === true,
      supports_pickup: (body == null ? void 0 : body.supportsPickup) === true,
      supports_dine_in: (body == null ? void 0 : body.supportsDineIn) === true,
      supports_qr_menu: (body == null ? void 0 : body.supportsQrMenu) === true,
      supports_showcase_order: (body == null ? void 0 : body.supportsShowcaseOrder) === true,
      festival_id: (body == null ? void 0 : body.festivalId) || null,
      is_festival: isFestivalBranch,
      festival_fulfillment_type: isFestivalBranch ? festivalFulfillmentType : null
    }).eq("id", branchId).eq("shop_id", access.shopId).select("id,name,address,lat,lon,supports_delivery,supports_pickup,supports_dine_in,supports_qr_menu,supports_showcase_order,festival_id,is_festival,festival_fulfillment_type,is_active").maybeSingle();
    if (update.data) {
      update.data.use_organization_working_hours = true;
      update.data.working_hours = fallbackWorkingHours;
    }
  }
  if (update.error || !update.data) {
    throw createError({ statusCode: 400, statusMessage: ((_c = update.error) == null ? void 0 : _c.message) || "Failed to update branch" });
  }
  return {
    ok: true,
    item: {
      id: update.data.id,
      name: update.data.name,
      address: update.data.address,
      lat: update.data.lat,
      lon: update.data.lon,
      supportsDelivery: update.data.supports_delivery,
      supportsPickup: update.data.supports_pickup,
      supportsDineIn: update.data.supports_dine_in,
      supportsQrMenu: update.data.supports_qr_menu,
      supportsShowcaseOrder: update.data.supports_showcase_order,
      festivalId: (_d = update.data.festival_id) != null ? _d : null,
      isFestival: update.data.is_festival === true,
      festivalFulfillmentType: ["delivery", "pickup", "dine-in"].includes(String(update.data.festival_fulfillment_type)) ? update.data.festival_fulfillment_type : null,
      useOrganizationWorkingHours: update.data.use_organization_working_hours !== false,
      workingHours: normalizeWeeklyWorkingHours(update.data.working_hours, fallbackWorkingHours),
      isActive: update.data.is_active
    }
  };
});

const _id__put$3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__put$2
}, Symbol.toStringTag, { value: 'Module' }));

const deactivate_post = defineEventHandler(async (event) => {
  var _a;
  const access = await requireDashboardAccess(event);
  if (access.role !== "owner") {
    throw createError({ statusCode: 403, statusMessage: "Only owner can deactivate branch" });
  }
  const branchId = getRouterParam(event, "id");
  if (!branchId) {
    throw createError({ statusCode: 400, statusMessage: "Branch id is required" });
  }
  const client = await serverSupabaseServiceRole(event);
  const update = await client.from("restaurants").update({ is_active: false }).eq("id", branchId).eq("shop_id", access.shopId).select("id,is_active").maybeSingle();
  if (update.error || !update.data) {
    throw createError({ statusCode: 400, statusMessage: ((_a = update.error) == null ? void 0 : _a.message) || "Failed to deactivate branch" });
  }
  return { ok: true };
});

const deactivate_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: deactivate_post
}, Symbol.toStringTag, { value: 'Module' }));

const features_get = defineEventHandler(async (event) => {
  const access = await requireDashboardAccess(event);
  const client = await serverSupabaseServiceRole(event);
  const { data: subs } = await client.from("shop_feature_subscriptions").select("feature_code,enabled,started_at,ended_at,source").eq("shop_id", access.shopId);
  const { data: catalog } = await client.from("feature_catalog").select("code,name,billing_type,price,currency,dependencies,status");
  const catalogRows = catalog != null ? catalog : [];
  const subByCode = new Map((subs != null ? subs : []).map((x) => [String(x.feature_code), x]));
  const items = catalogRows.map((row) => {
    const code = String(row.code || "");
    const sub = subByCode.get(code);
    return {
      code,
      name: String(row.name || code),
      billingType: String(row.billing_type || ""),
      price: Number(row.price || 0),
      currency: String(row.currency || "RUB"),
      dependencies: Array.isArray(row.dependencies) ? row.dependencies : [],
      catalogStatus: String(row.status || "available"),
      enabled: (sub == null ? void 0 : sub.enabled) === true,
      startedAt: (sub == null ? void 0 : sub.started_at) || null,
      endedAt: (sub == null ? void 0 : sub.ended_at) || null,
      source: (sub == null ? void 0 : sub.source) || null
    };
  });
  return { ok: true, items };
});

const features_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: features_get
}, Symbol.toStringTag, { value: 'Module' }));

const toggle_post = defineEventHandler(async (event) => {
  const access = await requireDashboardAccess(event);
  if (access.role !== "owner") {
    throw createError({ statusCode: 403, statusMessage: "Only owner can toggle modules" });
  }
  const body = await readBody(event).catch(() => ({}));
  const featureCode = typeof body.featureCode === "string" ? body.featureCode.trim() : "";
  const enabled = body.enabled === true;
  if (!featureCode) {
    throw createError({ statusCode: 400, statusMessage: "featureCode is required" });
  }
  const client = await serverSupabaseServiceRole(event);
  const { data: catalogRow } = await client.from("feature_catalog").select("code").eq("code", featureCode).maybeSingle();
  if (!(catalogRow == null ? void 0 : catalogRow.code)) {
    throw createError({ statusCode: 404, statusMessage: "Unknown feature code" });
  }
  const { error } = await client.from("shop_feature_subscriptions").upsert({
    shop_id: access.shopId,
    feature_code: featureCode,
    enabled,
    source: "manual",
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  }, { onConflict: "shop_id,feature_code" });
  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message || "Failed to update subscription" });
  }
  await client.from("shop_feature_events").insert({
    shop_id: access.shopId,
    feature_code: featureCode,
    action: enabled ? "enabled" : "disabled",
    payload: {},
    actor_user_id: access.userId
  });
  return { ok: true, enabled };
});

const toggle_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: toggle_post
}, Symbol.toStringTag, { value: 'Module' }));

const festivalModeration_get = defineEventHandler(async (event) => {
  const access = await requireDashboardAccess(event);
  const client = await serverSupabaseServiceRole(event);
  const { data: festivalLinks } = await client.from("restaurants").select("festival_id").eq("shop_id", access.shopId).not("festival_id", "is", null);
  const festivalIds = Array.from(new Set((festivalLinks != null ? festivalLinks : []).map((x) => String(x.festival_id || "")).filter(Boolean)));
  let festivals = [];
  if (festivalIds.length) {
    const { data } = await client.from("festivals").select("id,slug,name").in("id", festivalIds).order("starts_at", { ascending: false });
    festivals = (data != null ? data : []).map((x) => ({
      id: String(x.id),
      slug: String(x.slug || ""),
      name: String(x.name || x.slug || "Festival")
    }));
  }
  const { data: chats } = await client.from("festival_moderation_chats").select("id,festival_id,telegram_chat_id,max_chat_id,is_active,updated_at").eq("shop_id", access.shopId).order("updated_at", { ascending: false });
  return {
    ok: true,
    festivals,
    chats: (chats != null ? chats : []).map((x) => ({
      id: String(x.id),
      festivalId: String(x.festival_id),
      telegramChatId: x.telegram_chat_id || "",
      maxChatId: x.max_chat_id || "",
      isActive: x.is_active !== false,
      updatedAt: String(x.updated_at || "")
    }))
  };
});

const festivalModeration_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: festivalModeration_get
}, Symbol.toStringTag, { value: 'Module' }));

const festivalModeration_put = defineEventHandler(async (event) => {
  var _a, _b, _c;
  const access = await requireDashboardAccess(event);
  if (access.role !== "owner") {
    throw createError({ statusCode: 403, statusMessage: "Only owner can update festival moderation settings" });
  }
  const body = await readBody(event).catch(() => ({}));
  const festivalId = (_a = body.festivalId) == null ? void 0 : _a.trim();
  if (!festivalId) {
    throw createError({ statusCode: 400, statusMessage: "festivalId is required" });
  }
  const telegramChatId = ((_b = body.telegramChatId) == null ? void 0 : _b.trim()) || null;
  const maxChatId = ((_c = body.maxChatId) == null ? void 0 : _c.trim()) || null;
  const isActive = body.isActive !== false;
  if (!telegramChatId && !maxChatId) {
    throw createError({ statusCode: 400, statusMessage: "At least one chat id is required" });
  }
  const client = await serverSupabaseServiceRole(event);
  const { data: festival } = await client.from("festivals").select("id").eq("id", festivalId).maybeSingle();
  if (!(festival == null ? void 0 : festival.id)) {
    throw createError({ statusCode: 404, statusMessage: "Festival not found" });
  }
  const { error } = await client.from("festival_moderation_chats").upsert({
    festival_id: festivalId,
    shop_id: access.shopId,
    telegram_chat_id: telegramChatId,
    max_chat_id: maxChatId,
    is_active: isActive,
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  }, { onConflict: "festival_id,shop_id" });
  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message || "Failed to save festival moderation settings" });
  }
  return { ok: true };
});

const festivalModeration_put$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: festivalModeration_put
}, Symbol.toStringTag, { value: 'Module' }));

async function sendTelegram(botToken, chatId, text) {
  const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text })
  });
  if (!response.ok) {
    throw new Error(`telegram_send_failed:${response.status}`);
  }
}
async function sendMax(baseUrl, token, conversationId, text) {
  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/messages`, {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ conversationId, text })
  });
  if (!response.ok) {
    throw new Error(`max_send_failed:${response.status}`);
  }
}
const test_post$2 = defineEventHandler(async (event) => {
  var _a;
  const access = await requireDashboardAccess(event);
  if (access.role !== "owner") {
    throw createError({ statusCode: 403, statusMessage: "Only owner can send test messages" });
  }
  const body = await readBody(event).catch(() => ({}));
  const festivalId = (_a = body.festivalId) == null ? void 0 : _a.trim();
  if (!festivalId) {
    throw createError({ statusCode: 400, statusMessage: "festivalId is required" });
  }
  const client = await serverSupabaseServiceRole(event);
  const { data: row } = await client.from("festival_moderation_chats").select("telegram_chat_id,max_chat_id").eq("shop_id", access.shopId).eq("festival_id", festivalId).eq("is_active", true).maybeSingle();
  if (!row) {
    throw createError({ statusCode: 404, statusMessage: "Festival moderation chat is not configured" });
  }
  const config = useRuntimeConfig(event);
  const tenant = event.context.tenant;
  const botToken = typeof (tenant == null ? void 0 : tenant.telegramBotToken) === "string" && tenant.telegramBotToken.trim() ? tenant.telegramBotToken.trim() : String(config.botToken || "");
  const maxBaseUrl = String(config.maxApiBaseUrl || "");
  const maxToken = String(config.maxApiToken || "");
  const text = "\u{1F9EA} Festival UGC moderation test: \u0447\u0430\u0442 \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D \u0438 \u0433\u043E\u0442\u043E\u0432 \u043A \u0430\u043F\u0440\u0443\u0432\u0430\u043C.";
  const sent = [];
  if (row.telegram_chat_id && botToken) {
    await sendTelegram(botToken, String(row.telegram_chat_id), text);
    sent.push("telegram");
  }
  if (row.max_chat_id && maxBaseUrl && maxToken) {
    await sendMax(maxBaseUrl, maxToken, String(row.max_chat_id), text);
    sent.push("max");
  }
  if (!sent.length) {
    throw createError({ statusCode: 400, statusMessage: "No available transport to send test message" });
  }
  return { ok: true, sent };
});

const test_post$3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: test_post$2
}, Symbol.toStringTag, { value: 'Module' }));

const maxChatLinkToken_post = defineEventHandler(async (event) => {
  var _a;
  const access = await requireDashboardAccess(event);
  if (access.role !== "owner") {
    throw createError({ statusCode: 403, statusMessage: "Only owner can create chat link tokens" });
  }
  const body = await readBody(event).catch(() => ({}));
  const restaurantId = typeof body.restaurantId === "string" ? body.restaurantId.trim() : "";
  if (!restaurantId) {
    throw createError({ statusCode: 400, statusMessage: "restaurantId is required" });
  }
  const config = useRuntimeConfig(event);
  const maxBotUrl = typeof ((_a = config.public) == null ? void 0 : _a.maxBotUrl) === "string" ? config.public.maxBotUrl.trim() : "";
  if (!maxBotUrl) {
    throw createError({ statusCode: 500, statusMessage: "maxBotUrl is not configured" });
  }
  const client = await serverSupabaseServiceRole(event);
  const { data: restaurant } = await client.from("restaurants").select("id").eq("id", restaurantId).eq("shop_id", access.shopId).maybeSingle();
  if (!restaurant) {
    throw createError({ statusCode: 404, statusMessage: "Restaurant not found" });
  }
  const token = randomUUID();
  const ttlMs = 10 * 60 * 1e3;
  const expiresAt = new Date(Date.now() + ttlMs).toISOString();
  const { error } = await client.from("telegram_chat_link_tokens").insert({
    shop_id: access.shopId,
    restaurant_id: restaurantId,
    token,
    created_by: access.userId,
    expires_at: expiresAt
  });
  if (error) {
    throw createError({ statusCode: 500, statusMessage: "Failed to create link token" });
  }
  const separator = maxBotUrl.includes("?") ? "&" : "?";
  return {
    ok: true,
    token,
    tokenExpiresAt: expiresAt,
    deepLink: `${maxBotUrl}${separator}start=${encodeURIComponent(`linkmaxchat_${token}`)}`,
    bindCommand: `/bindmax ${token}`
  };
});

const maxChatLinkToken_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: maxChatLinkToken_post
}, Symbol.toStringTag, { value: 'Module' }));

const notificationEvents_get = defineEventHandler(async (event) => {
  const access = await requireDashboardAccess(event);
  const query = getQuery$1(event);
  const status = typeof query.status === "string" ? query.status.trim() : "";
  const channel = typeof query.channel === "string" ? query.channel.trim() : "";
  const restaurantId = typeof query.restaurantId === "string" ? query.restaurantId.trim() : "";
  const page = Math.max(Number(query.page) || 1, 1);
  const pageSize = Math.min(Math.max(Number(query.pageSize) || 25, 1), 100);
  const from = (page - 1) * pageSize;
  const to = from + pageSize;
  const client = await serverSupabaseServiceRole(event);
  let db = client.from("notification_events").select("id,notification_key,event_type,channel,shop_id,restaurant_id,city_id,conversation_id,delivery_status,attempt_count,last_error,created_at,updated_at").eq("shop_id", access.shopId).order("created_at", { ascending: false }).range(from, to);
  if (status) db = db.eq("delivery_status", status);
  if (channel) db = db.eq("channel", channel);
  if (restaurantId) db = db.eq("restaurant_id", restaurantId);
  const { data } = await db;
  const rows = data != null ? data : [];
  return {
    ok: true,
    items: rows.slice(0, pageSize),
    pagination: {
      page,
      pageSize,
      hasNext: rows.length > pageSize,
      hasPrev: page > 1
    }
  };
});

const notificationEvents_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: notificationEvents_get
}, Symbol.toStringTag, { value: 'Module' }));

const notifications_get = defineEventHandler(async (event) => {
  var _a;
  const access = await requireDashboardAccess(event);
  const query = getQuery$1(event);
  const page = Math.max(Number(query.page) || 1, 1);
  const pageSize = Math.min(Math.max(Number(query.pageSize) || 25, 1), 100);
  const restaurantId = typeof query.restaurantId === "string" ? query.restaurantId.trim() : "";
  const from = (page - 1) * pageSize;
  const to = from + pageSize;
  const client = await serverSupabaseServiceRole(event);
  const { data: shop } = await client.from("shops").select("channel_policy").eq("id", access.shopId).maybeSingle();
  let restaurantsQuery = client.from("restaurants").select("id,name,manager_notification_mode,manager_group_chat_id,manager_max_chat_id,manager_recipients,service_calls_enabled,service_call_types,integration_keys").eq("shop_id", access.shopId).order("created_at", { ascending: false });
  if (restaurantId) restaurantsQuery = restaurantsQuery.eq("id", restaurantId);
  const { data: restaurants } = await restaurantsQuery.range(from, to);
  const rows = restaurants != null ? restaurants : [];
  const pagedRows = rows.slice(0, pageSize);
  const restaurantIds = pagedRows.map((row) => row.id).filter(Boolean);
  let bindingsByRestaurant = /* @__PURE__ */ new Map();
  if (restaurantIds.length) {
    const { data: bindings } = await client.from("restaurant_staff_bot_bindings").select("id,restaurant_id,channel,external_user_id,staff_role,display_name,is_active,updated_at").in("restaurant_id", restaurantIds).order("updated_at", { ascending: false });
    const grouped = /* @__PURE__ */ new Map();
    for (const row of bindings || []) {
      const restaurantIdValue = String(row.restaurant_id || "");
      if (!restaurantIdValue) continue;
      const current = grouped.get(restaurantIdValue) || [];
      current.push({
        id: String(row.id),
        channel: String(row.channel),
        externalUserId: String(row.external_user_id || ""),
        staffRole: String(row.staff_role || ""),
        displayName: typeof row.display_name === "string" ? String(row.display_name) : "",
        isActive: Boolean(row.is_active)
      });
      grouped.set(restaurantIdValue, current);
    }
    bindingsByRestaurant = grouped;
  }
  return {
    ok: true,
    channelPolicy: (_a = shop == null ? void 0 : shop.channel_policy) != null ? _a : { primary: "telegram", secondary: "max", maxEnabled: false },
    restaurants: pagedRows.map((row) => {
      const integrationKeys = (row == null ? void 0 : row.integration_keys) && typeof row.integration_keys === "object" ? row.integration_keys : {};
      const rawEtaPresets = Array.isArray(integrationKeys.eta_presets) ? integrationKeys.eta_presets : [];
      const etaPresets = rawEtaPresets.map((value) => Number(value)).filter((value) => Number.isFinite(value) && value > 0).slice(0, 8);
      return {
        id: row.id,
        name: row.name,
        managerNotificationMode: row.manager_notification_mode || "group",
        managerGroupChatId: row.manager_group_chat_id || "",
        managerMaxChatId: row.manager_max_chat_id || "",
        managerRecipients: Array.isArray(row.manager_recipients) ? row.manager_recipients : [],
        serviceCallsEnabled: row.service_calls_enabled === true,
        serviceCallTypes: Array.isArray(row.service_call_types) ? row.service_call_types : ["call_waiter", "call_hookah", "request_bill"],
        staffBotBindings: bindingsByRestaurant.get(String(row.id)) || [],
        unifiedOrderFlowEnabled: true,
        etaButtonsEnabled: Boolean(integrationKeys.eta_buttons_enabled),
        etaPresets: etaPresets.length ? etaPresets : [10, 15, 20, 30, 45],
        etaRateLimitSec: (() => {
          const raw = Number(integrationKeys.eta_rate_limit_sec);
          if (!Number.isFinite(raw) || raw < 30) return 180;
          return Math.min(3600, Math.floor(raw));
        })()
      };
    }),
    pagination: {
      page,
      pageSize,
      hasNext: rows.length > pageSize,
      hasPrev: page > 1
    }
  };
});

const notifications_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: notifications_get
}, Symbol.toStringTag, { value: 'Module' }));

const notifications_put = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e, _f, _g;
  const access = await requireDashboardAccess(event);
  if (access.role !== "owner") {
    throw createError({ statusCode: 403, statusMessage: "Only owner can update integrations" });
  }
  const body = await readBody(event).catch(() => ({}));
  const client = await serverSupabaseServiceRole(event);
  if (body.channelPolicy) {
    const nextPolicy = {
      primary: body.channelPolicy.primary === "max" ? "max" : "telegram",
      secondary: body.channelPolicy.secondary === "telegram" ? "telegram" : "max",
      maxEnabled: body.channelPolicy.maxEnabled === true
    };
    await client.from("shops").update({ channel_policy: nextPolicy }).eq("id", access.shopId);
  }
  if ((_a = body.restaurantSettings) == null ? void 0 : _a.id) {
    const orgSettings = await getOrganizationSettings(event, access.shopId);
    const orgButtons = orgSettings.ops.dineInStaffButtons || { waiter: true, hookah: false, requestBill: true };
    const orgAllowedTypes = [
      ...orgButtons.waiter === false ? [] : ["call_waiter"],
      ...orgButtons.hookah === true ? ["call_hookah"] : [],
      ...orgButtons.requestBill === false ? [] : ["request_bill"]
    ];
    const recipients = Array.isArray(body.restaurantSettings.managerRecipients) ? body.restaurantSettings.managerRecipients.filter((item) => {
      var _a2;
      return (item.channel === "telegram" || item.channel === "max") && ((_a2 = item.targetId) == null ? void 0 : _a2.trim());
    }).map((item) => ({ channel: item.channel, targetId: item.targetId.trim() })) : [];
    const serviceCallTypesRaw = Array.isArray(body.restaurantSettings.serviceCallTypes) ? body.restaurantSettings.serviceCallTypes : ["call_waiter", "call_hookah", "request_bill"];
    const serviceCallTypes = Array.from(
      new Set(
        serviceCallTypesRaw.map((x) => String(x)).filter((x) => x === "call_waiter" || x === "call_hookah" || x === "request_bill").filter((x) => orgAllowedTypes.includes(x))
      )
    );
    const { data: restaurantExisting } = await client.from("restaurants").select("integration_keys").eq("id", body.restaurantSettings.id).eq("shop_id", access.shopId).maybeSingle();
    const currentIntegrationKeys = (restaurantExisting == null ? void 0 : restaurantExisting.integration_keys) && typeof restaurantExisting.integration_keys === "object" ? restaurantExisting.integration_keys : {};
    const rawEtaPresets = Array.isArray(body.restaurantSettings.etaPresets) ? body.restaurantSettings.etaPresets : Array.isArray(currentIntegrationKeys.eta_presets) ? currentIntegrationKeys.eta_presets : [10, 15, 20, 30, 45];
    const etaPresets = rawEtaPresets.map((value) => Number(value)).filter((value) => Number.isFinite(value) && value > 0).map((value) => Math.floor(value)).slice(0, 8);
    const etaRateLimitRaw = Number(
      (_c = (_b = body.restaurantSettings.etaRateLimitSec) != null ? _b : currentIntegrationKeys.eta_rate_limit_sec) != null ? _c : 180
    );
    const etaRateLimitSec = Number.isFinite(etaRateLimitRaw) ? Math.min(3600, Math.max(30, Math.floor(etaRateLimitRaw))) : 180;
    const integrationKeysNext = {
      ...currentIntegrationKeys,
      // Unified flow is always on; dashboard no longer exposes a toggle.
      unified_order_flow_enabled: true,
      eta_buttons_enabled: body.restaurantSettings.etaButtonsEnabled === true,
      eta_presets: etaPresets.length ? etaPresets : [10, 15, 20, 30, 45],
      eta_rate_limit_sec: etaRateLimitSec
    };
    await client.from("restaurants").update({
      manager_notification_mode: body.restaurantSettings.managerNotificationMode === "personal" ? "personal" : "group",
      manager_group_chat_id: ((_d = body.restaurantSettings.managerGroupChatId) == null ? void 0 : _d.trim()) || null,
      manager_max_chat_id: ((_e = body.restaurantSettings.managerMaxChatId) == null ? void 0 : _e.trim()) || null,
      manager_recipients: recipients,
      service_calls_enabled: body.restaurantSettings.serviceCallsEnabled === true,
      service_call_types: serviceCallTypes.length ? serviceCallTypes : ["call_waiter", "call_hookah", "request_bill"],
      integration_keys: integrationKeysNext
    }).eq("id", body.restaurantSettings.id).eq("shop_id", access.shopId);
  }
  if ((_f = body.staffBindingUpsert) == null ? void 0 : _f.restaurantId) {
    const patch = body.staffBindingUpsert;
    const restaurantId = patch.restaurantId.trim();
    const channel = patch.channel === "max" ? "max" : "telegram";
    const staffRole = patch.staffRole;
    if (!restaurantId) throw createError({ statusCode: 400, statusMessage: "restaurantId is required for staff binding" });
    if (!(staffRole === "waiter" || staffRole === "hookah" || staffRole === "cashier" || staffRole === "manager")) {
      throw createError({ statusCode: 400, statusMessage: "Invalid staffRole for staff binding" });
    }
    const externalUserId = String(patch.externalUserId || "").trim();
    if (!externalUserId) throw createError({ statusCode: 400, statusMessage: "externalUserId is required" });
    const row = {
      shop_id: access.shopId,
      restaurant_id: restaurantId,
      channel,
      external_user_id: externalUserId,
      staff_role: staffRole,
      display_name: ((_g = patch.displayName) == null ? void 0 : _g.trim()) || null,
      is_active: patch.isActive !== false,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    if (typeof patch.id === "string" && patch.id.trim()) {
      await client.from("restaurant_staff_bot_bindings").update(row).eq("id", patch.id.trim()).eq("shop_id", access.shopId);
      return { ok: true };
    }
    await client.from("restaurant_staff_bot_bindings").upsert(row, { onConflict: "restaurant_id,channel,external_user_id" });
  }
  return { ok: true };
});

const notifications_put$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: notifications_put
}, Symbol.toStringTag, { value: 'Module' }));

const test_post = defineEventHandler(async (event) => {
  var _a;
  const access = await requireDashboardAccess(event);
  const body = await readBody(event).catch(() => ({}));
  const restaurantId = (_a = body.restaurantId) == null ? void 0 : _a.trim();
  if (!restaurantId) {
    throw createError({ statusCode: 400, statusMessage: "restaurantId is required" });
  }
  await dispatchNotificationEvent(event, {
    eventId: crypto$1.randomUUID(),
    eventType: "ORDER_CREATED",
    occurredAt: (/* @__PURE__ */ new Date()).toISOString(),
    tenantContext: {
      shopId: access.shopId,
      restaurantId,
      cityId: null
    },
    orderContext: {
      orderId: crypto$1.randomUUID(),
      orderNumber: "TEST-ORDER",
      totalAmount: 0,
      status: "new"
    }
  });
  return { ok: true };
});

const test_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: test_post
}, Symbol.toStringTag, { value: 'Module' }));

const telegramChatLinkToken_post = defineEventHandler(async (event) => {
  var _a;
  const access = await requireDashboardAccess(event);
  if (access.role !== "owner") {
    throw createError({ statusCode: 403, statusMessage: "Only owner can create chat link tokens" });
  }
  const body = await readBody(event).catch(() => ({}));
  const restaurantId = typeof body.restaurantId === "string" ? body.restaurantId.trim() : "";
  if (!restaurantId) {
    throw createError({ statusCode: 400, statusMessage: "restaurantId is required" });
  }
  const config = useRuntimeConfig(event);
  const botNameRaw = typeof ((_a = config.public) == null ? void 0 : _a.telegramBotName) === "string" ? config.public.telegramBotName.trim() : "";
  const botName = botNameRaw.replace(/^@/, "");
  if (!botName) {
    throw createError({ statusCode: 500, statusMessage: "telegramBotName is not configured" });
  }
  const client = await serverSupabaseServiceRole(event);
  const { data: restaurant } = await client.from("restaurants").select("id").eq("id", restaurantId).eq("shop_id", access.shopId).maybeSingle();
  if (!restaurant) {
    throw createError({ statusCode: 404, statusMessage: "Restaurant not found" });
  }
  const token = randomUUID();
  const ttlMs = 10 * 60 * 1e3;
  const expiresAt = new Date(Date.now() + ttlMs).toISOString();
  const { error } = await client.from("telegram_chat_link_tokens").insert({
    shop_id: access.shopId,
    restaurant_id: restaurantId,
    token,
    created_by: access.userId,
    expires_at: expiresAt
  });
  if (error) {
    throw createError({ statusCode: 500, statusMessage: "Failed to create link token" });
  }
  return {
    ok: true,
    token,
    tokenExpiresAt: expiresAt,
    deepLink: `https://t.me/${botName}?start=linkchat_${token}`,
    bindCommand: `/bind ${token}`
  };
});

const telegramChatLinkToken_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: telegramChatLinkToken_post
}, Symbol.toStringTag, { value: 'Module' }));

const telegramChatUnlink_post = defineEventHandler(async (event) => {
  const access = await requireDashboardAccess(event);
  if (access.role !== "owner") {
    throw createError({ statusCode: 403, statusMessage: "Only owner can unlink chat" });
  }
  const body = await readBody(event).catch(() => ({}));
  const restaurantId = typeof body.restaurantId === "string" ? body.restaurantId.trim() : "";
  if (!restaurantId) {
    throw createError({ statusCode: 400, statusMessage: "restaurantId is required" });
  }
  const client = await serverSupabaseServiceRole(event);
  const { error } = await client.from("restaurants").update({ manager_group_chat_id: null }).eq("id", restaurantId).eq("shop_id", access.shopId);
  if (error) {
    throw createError({ statusCode: 500, statusMessage: "Failed to unlink telegram chat" });
  }
  return { ok: true };
});

const telegramChatUnlink_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: telegramChatUnlink_post
}, Symbol.toStringTag, { value: 'Module' }));

const cityUgc_get = defineEventHandler(async (event) => {
  const access = await requireDashboardAccess(event);
  if (access.role !== "owner") {
    throw createError({ statusCode: 403, statusMessage: "Only owner can access city moderation panel" });
  }
  const query = getQuery$1(event);
  const status = typeof query.status === "string" ? query.status.trim() : "pending";
  const cityId = typeof query.city_id === "string" ? query.city_id.trim() : "";
  const festivalId = typeof query.festival_id === "string" ? query.festival_id.trim() : "";
  const kind = typeof query.kind === "string" ? query.kind.trim() : "";
  const limit = Math.min(Math.max(Number(query.limit) || 100, 1), 300);
  const client = await serverSupabaseServiceRole(event);
  const { data: restaurants } = await client.from("restaurants").select("id,city_id,name").eq("shop_id", access.shopId);
  const restaurantRows = restaurants != null ? restaurants : [];
  restaurantRows.map((x) => x.id);
  const cityIds = Array.from(new Set(restaurantRows.map((x) => x.city_id).filter((x) => !!x)));
  const { data: cities } = cityIds.length ? await client.from("cities").select("id,name").in("id", cityIds) : { data: [] };
  const cityById = new Map((cities != null ? cities : []).map((x) => [String(x.id), String(x.name || "\u2014")]));
  const restaurantById = new Map(restaurantRows.map((x) => [x.id, x]));
  let dbQuery = client.from("festival_ugc_submissions").select("id,festival_id,shop_id,restaurant_id,order_id,kind,rating,category,media_url,status,publish_to_menu,publish_to_feed,created_at").eq("shop_id", access.shopId).order("created_at", { ascending: false }).limit(limit);
  if (status && status !== "all") dbQuery = dbQuery.eq("status", status);
  if (festivalId) dbQuery = dbQuery.eq("festival_id", festivalId);
  if (kind && kind !== "all") dbQuery = dbQuery.eq("kind", kind);
  const { data: submissions, error } = await dbQuery;
  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message || "Failed to load city moderation queue" });
  }
  const festivalIds = Array.from(new Set((submissions != null ? submissions : []).map((x) => String(x.festival_id || "")).filter(Boolean)));
  const { data: festivals } = festivalIds.length ? await client.from("festivals").select("id,slug,name").in("id", festivalIds) : { data: [] };
  const festivalById = new Map((festivals != null ? festivals : []).map((x) => [String(x.id), { name: String(x.name || ""), slug: String(x.slug || "") }]));
  const items = (submissions != null ? submissions : []).map((x) => {
    var _a, _b;
    const restaurant = restaurantById.get(String(x.restaurant_id || ""));
    const city = (restaurant == null ? void 0 : restaurant.city_id) ? cityById.get(restaurant.city_id) || "\u2014" : "\u2014";
    return {
      id: String(x.id),
      festivalId: String(x.festival_id || ""),
      festivalName: ((_a = festivalById.get(String(x.festival_id || ""))) == null ? void 0 : _a.name) || "\u0424\u0435\u0441\u0442\u0438\u0432\u0430\u043B\u044C",
      festivalSlug: ((_b = festivalById.get(String(x.festival_id || ""))) == null ? void 0 : _b.slug) || "",
      restaurantId: x.restaurant_id ? String(x.restaurant_id) : "",
      restaurantName: (restaurant == null ? void 0 : restaurant.name) || "\u2014",
      cityId: (restaurant == null ? void 0 : restaurant.city_id) || "",
      cityName: city,
      orderId: x.order_id ? String(x.order_id) : null,
      kind: x.kind === "story" ? "story" : "video_review",
      rating: typeof x.rating === "number" ? x.rating : null,
      category: x.category || null,
      mediaUrl: String(x.media_url || ""),
      status: String(x.status || "pending"),
      publishToMenu: x.publish_to_menu === true,
      publishToFeed: x.publish_to_feed === true,
      createdAt: String(x.created_at || "")
    };
  }).filter((x) => cityId ? x.cityId === cityId : true);
  return {
    ok: true,
    filters: {
      cities: cityIds.map((id) => ({ id, name: cityById.get(id) || id })),
      festivals: (festivals != null ? festivals : []).map((x) => ({ id: String(x.id), name: String(x.name || "\u0424\u0435\u0441\u0442\u0438\u0432\u0430\u043B\u044C"), slug: String(x.slug || "") }))
    },
    items
  };
});

const cityUgc_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: cityUgc_get
}, Symbol.toStringTag, { value: 'Module' }));

const action_post$2 = defineEventHandler(async (event) => {
  var _a;
  const access = await requireDashboardAccess(event);
  if (access.role !== "owner") {
    throw createError({ statusCode: 403, statusMessage: "Only owner can moderate city UGC" });
  }
  const body = await readBody(event).catch(() => ({}));
  const submissionId = (_a = body.submissionId) == null ? void 0 : _a.trim();
  if (!submissionId) {
    throw createError({ statusCode: 400, statusMessage: "submissionId is required" });
  }
  const action = body.action || "reject";
  const allowed = /* @__PURE__ */ new Set(["approve_menu", "approve_feed", "approve_menu_and_feed", "reject", "forward_to_corner", "shadow_ban", "tag_category"]);
  if (!allowed.has(action)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid action" });
  }
  const result = await applyFestivalModerationAction(event, {
    submissionId,
    action,
    category: body.category || null,
    actorChannel: "dashboard",
    actorUserId: access.userId
  });
  return { ok: true, status: result.status };
});

const action_post$3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: action_post$2
}, Symbol.toStringTag, { value: 'Module' }));

const _id__get$2 = defineEventHandler(async (event) => {
  var _a, _b, _c;
  const access = await requireDashboardAccess(event);
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Order id is required" });
  }
  const client = await serverSupabaseServiceRole(event);
  const runLoad = async (includeOrderNumber) => {
    const selectFields = includeOrderNumber ? `
      id,
      order_number,
      shop_id,
      restaurant_id,
      city_id,
      status,
      fulfillment_type,
      payment_method,
      subtotal,
      delivery_cost,
      total,
      items,
      address,
      pickup_point,
      comment,
      metadata,
      created_at,
      updated_at,
      customer_telegram_id,
      customer_profile_id
    ` : `
      id,
      shop_id,
      restaurant_id,
      city_id,
      status,
      fulfillment_type,
      payment_method,
      subtotal,
      delivery_cost,
      total,
      items,
      address,
      pickup_point,
      comment,
      metadata,
      created_at,
      updated_at,
      customer_telegram_id,
      customer_profile_id
    `;
    return client.from("orders").select(selectFields).eq("id", id).eq("shop_id", access.shopId).maybeSingle();
  };
  let { data, error } = await runLoad(true);
  if (error && String((error == null ? void 0 : error.message) || "").includes("order_number")) {
    const fallback = await runLoad(false);
    data = fallback.data;
    error = fallback.error;
  }
  if (error) {
    console.error("dashboard order detail:", error);
    throw createError({ statusCode: 500, statusMessage: "Failed to load order" });
  }
  if (!data) {
    throw createError({ statusCode: 404, statusMessage: "Order not found" });
  }
  const row = data;
  const { timeline } = parseOrderMetadata(row.metadata);
  const normalizedItems = normalizeOrderItemsJson(row.items);
  const st = normalizeDashboardStatus(row.status);
  let restaurantName = "\u2014";
  if (row.restaurant_id) {
    const { data: r } = await client.from("restaurants").select("name").eq("id", row.restaurant_id).eq("shop_id", access.shopId).maybeSingle();
    if (r == null ? void 0 : r.name) restaurantName = r.name;
  }
  let cityName = "\u2014";
  if (row.city_id) {
    const { data: c } = await client.from("cities").select("name").eq("id", row.city_id).maybeSingle();
    if (c == null ? void 0 : c.name) cityName = c.name;
  }
  let shopName = "\u2014";
  const { data: shopRow } = await client.from("shops").select("name").eq("id", access.shopId).maybeSingle();
  if (shopRow == null ? void 0 : shopRow.name) shopName = shopRow.name;
  let reviewPrompt = {
    moduleEnabled: false,
    hasReview: false,
    reviewRating: null,
    prompts: []
  };
  const reviewsEnabled = await isShopFeatureEnabled(event, access.shopId, "reputation_reviews_pro");
  if (reviewsEnabled) {
    reviewPrompt.moduleEnabled = true;
    const [{ data: rev }, { data: prompts }] = await Promise.all([
      client.from("shop_reviews").select("id,rating").eq("order_id", id).eq("shop_id", access.shopId).maybeSingle(),
      client.from("shop_order_review_prompts").select("channel,status,scheduled_for,sent_at,last_error,trigger_kind").eq("order_id", id).eq("shop_id", access.shopId)
    ]);
    if (rev == null ? void 0 : rev.id) {
      reviewPrompt.hasReview = true;
      reviewPrompt.reviewRating = typeof rev.rating === "number" ? Number(rev.rating) : null;
    }
    reviewPrompt.prompts = (prompts != null ? prompts : []).map((p) => ({
      channel: String(p.channel || ""),
      status: String(p.status || ""),
      scheduledFor: p.scheduled_for ? String(p.scheduled_for) : null,
      sentAt: p.sent_at ? String(p.sent_at) : null,
      lastError: typeof p.last_error === "string" ? p.last_error : null,
      triggerKind: String(p.trigger_kind || "")
    }));
  }
  return {
    ok: true,
    order: {
      id: row.id,
      orderNumber: row.order_number || null,
      shopId: row.shop_id,
      restaurantId: row.restaurant_id,
      restaurantName,
      cityId: row.city_id,
      cityName,
      brand: shopName,
      status: st,
      fulfillmentType: row.fulfillment_type || "delivery",
      paymentMethod: row.payment_method || "cash",
      subtotal: (_a = row.subtotal) != null ? _a : 0,
      deliveryCost: (_b = row.delivery_cost) != null ? _b : 0,
      total: (_c = row.total) != null ? _c : 0,
      items: normalizedItems,
      address: row.address,
      pickupPoint: row.pickup_point,
      comment: row.comment,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      customerTelegramId: row.customer_telegram_id,
      customerProfileId: row.customer_profile_id,
      timeline: [...timeline].sort((a, b) => b.at.localeCompare(a.at)),
      reviewPrompt
    }
  };
});

const _id__get$3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__get$2
}, Symbol.toStringTag, { value: 'Module' }));

function telegramApi(token) {
  return `https://api.telegram.org/bot${token}/sendMessage`;
}
function delayText(orderNumber, kind) {
  if (kind === "delivery") {
    return `\u23F1 \u041D\u0435\u0431\u043E\u043B\u044C\u0448\u0430\u044F \u0437\u0430\u0434\u0435\u0440\u0436\u043A\u0430 \u043F\u043E \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0435 \u0437\u0430\u043A\u0430\u0437\u0430 #${orderNumber}: \u043A\u0443\u0440\u044C\u0435\u0440 \u0443\u0436\u0435 \u0432 \u043F\u0443\u0442\u0438, \u043D\u043E \u043C\u043E\u0436\u0435\u0442 \u043F\u0440\u0438\u0435\u0445\u0430\u0442\u044C \u0447\u0443\u0442\u044C \u043F\u043E\u0437\u0436\u0435. \u0421\u043F\u0430\u0441\u0438\u0431\u043E \u0437\u0430 \u0442\u0435\u0440\u043F\u0435\u043D\u0438\u0435.`;
  }
  return `\u23F1 \u041D\u0435\u0431\u043E\u043B\u044C\u0448\u0430\u044F \u0437\u0430\u0434\u0435\u0440\u0436\u043A\u0430 \u043F\u043E \u0437\u0430\u043A\u0430\u0437\u0443 #${orderNumber}: \u043A\u0443\u0445\u043D\u044F \u0433\u043E\u0442\u043E\u0432\u0438\u0442 \u0432\u0430\u0448\u0435 \u0431\u043B\u044E\u0434\u043E \u0447\u0443\u0442\u044C \u0434\u043E\u043B\u044C\u0448\u0435 \u043E\u0431\u044B\u0447\u043D\u043E\u0433\u043E. \u0421\u043F\u0430\u0441\u0438\u0431\u043E \u0437\u0430 \u043E\u0436\u0438\u0434\u0430\u043D\u0438\u0435.`;
}
function shortOrderRef(orderNumber) {
  const normalized = orderNumber.replace(/\s+/g, "");
  return normalized.length > 8 ? normalized.slice(0, 8) : normalized;
}
const delay_post = defineEventHandler(async (event) => {
  const access = await requireDashboardAccess(event);
  const id = getRouterParam(event, "id");
  if (!id) throw createError({ statusCode: 400, statusMessage: "Order id is required" });
  const body = await readBody(event).catch(() => ({}));
  const kind = (body == null ? void 0 : body.kind) === "delivery" ? "delivery" : "kitchen";
  const comment = typeof (body == null ? void 0 : body.comment) === "string" ? body.comment.trim() : "";
  const client = await serverSupabaseServiceRole(event);
  const { data: order, error: loadError } = await client.from("orders").select("id,shop_id,order_number,customer_telegram_id,metadata").eq("id", id).eq("shop_id", access.shopId).maybeSingle();
  if (loadError) throw createError({ statusCode: 500, statusMessage: "Failed to load order" });
  if (!order) throw createError({ statusCode: 404, statusMessage: "Order not found" });
  if (!order.customer_telegram_id) {
    throw createError({ statusCode: 400, statusMessage: "\u0423 \u0437\u0430\u043A\u0430\u0437\u0430 \u043D\u0435\u0442 Telegram \u043A\u043B\u0438\u0435\u043D\u0442\u0430 \u0434\u043B\u044F \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F" });
  }
  const { data: shop } = await client.from("shops").select("telegram_bot_token").eq("id", access.shopId).maybeSingle();
  const config = useRuntimeConfig();
  const tokenFromShop = typeof (shop == null ? void 0 : shop.telegram_bot_token) === "string" ? shop.telegram_bot_token.trim() : "";
  const botToken = tokenFromShop && tokenFromShop !== "platform-bot" ? tokenFromShop : String(config.botToken || "");
  if (!botToken) throw createError({ statusCode: 500, statusMessage: "Telegram bot token is not configured" });
  const orderNumber = shortOrderRef(order.order_number && String(order.order_number).trim() || String(order.id));
  const text = delayText(orderNumber, kind);
  const telegramRes = await fetch(telegramApi(botToken), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: Number(order.customer_telegram_id),
      text
    })
  }).catch(() => null);
  if (!(telegramRes == null ? void 0 : telegramRes.ok)) {
    throw createError({ statusCode: 502, statusMessage: "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u0435 \u043A\u043B\u0438\u0435\u043D\u0442\u0443" });
  }
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const entry = {
    at: now,
    label: `\u0423\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u0435 \u043E \u0437\u0430\u0434\u0435\u0440\u0436\u043A\u0435 (${kind === "delivery" ? "\u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0430" : "\u043A\u0443\u0445\u043D\u044F"}) \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u043E \u043A\u043B\u0438\u0435\u043D\u0442\u0443${comment ? `: ${comment}` : ""}`,
    source: "dashboard",
    userId: access.userId,
    comment: comment || null
  };
  const newMetadata = mergeMetadataWithTimeline(order.metadata, entry);
  await client.from("orders").update({ metadata: newMetadata, updated_at: now }).eq("id", id).eq("shop_id", access.shopId);
  return { ok: true };
});

const delay_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: delay_post
}, Symbol.toStringTag, { value: 'Module' }));

const reviewPrompt_post = defineEventHandler(async (event) => {
  const access = await requireDashboardAccess(event);
  await requireReviewsFeature(event, access.shopId);
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Order id is required" });
  }
  try {
    const result = await enqueueManualReviewPrompts(event, {
      shopId: access.shopId,
      orderId: id,
      actorProfileId: access.userId
    });
    return { ok: true, ...result };
  } catch (e) {
    const msg = String((e == null ? void 0 : e.message) || "failed");
    if (msg === "feature_disabled") {
      throw createError({ statusCode: 402, statusMessage: "Review prompts module disabled" });
    }
    if (msg === "order_not_found") {
      throw createError({ statusCode: 404, statusMessage: "Order not found" });
    }
    throw createError({ statusCode: 500, statusMessage: msg });
  }
});

const reviewPrompt_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: reviewPrompt_post
}, Symbol.toStringTag, { value: 'Module' }));

const statusLabels = dashboardOrderStatusLabels;
function resolveReviewReminderDelayMs(raw) {
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed <= 0) return 5 * 60 * 1e3;
  return Math.max(1e4, parsed);
}
async function sendReviewReminder(args) {
  if (!args.restaurantId) return;
  const { data: restaurant } = await args.client.from("restaurants").select("festival_id,name").eq("id", args.restaurantId).maybeSingle();
  const festivalId = restaurant == null ? void 0 : restaurant.festival_id;
  if (!festivalId) return;
  const { data: festival } = await args.client.from("festivals").select("name,slug").eq("id", festivalId).maybeSingle();
  const orderRef = String(args.orderNumber || args.orderId).slice(0, 12);
  const festivalName = String((festival == null ? void 0 : festival.name) || "\u0444\u0435\u0441\u0442\u0438\u0432\u0430\u043B\u044F");
  const reminderText = [
    `\u041A\u0430\u043A \u0432\u0430\u043C \u0437\u0430\u043A\u0430\u0437 #${orderRef}?`,
    `\u041F\u043E\u0434\u0435\u043B\u0438\u0442\u0435\u0441\u044C \u043A\u043E\u0440\u043E\u0442\u043A\u0438\u043C \u0432\u0438\u0434\u0435\u043E\u043E\u0442\u0437\u044B\u0432\u043E\u043C \u043E \u0431\u043B\u044E\u0434\u0435 \u0434\u043B\u044F ${festivalName} \u0438 \u043F\u043E\u043B\u0443\u0447\u0438\u0442\u0435 \u0431\u043E\u043D\u0443\u0441\u043D\u044B\u0435 \u0431\u0430\u043B\u043B\u044B.`,
    '\u041E\u0442\u043A\u0440\u043E\u0439\u0442\u0435 \u043C\u0438\u043D\u0438\u0430\u043F\u043F, \u0440\u0430\u0437\u0434\u0435\u043B "\u041C\u043E\u0438 \u0437\u0430\u043A\u0430\u0437\u044B" \u0438 \u043D\u0430\u0436\u043C\u0438\u0442\u0435 "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0432\u0438\u0434\u0435\u043E\u043E\u0442\u0437\u044B\u0432".'
  ].join("\n");
  const botToken = String(args.config.botToken || "");
  if (args.customerTelegramId && botToken) {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: args.customerTelegramId,
        text: reminderText
      })
    }).catch((err) => {
      console.error("festival review reminder telegram send failed:", err);
    });
  }
  const maxBaseUrl = String(args.config.maxApiBaseUrl || "").replace(/\/$/, "");
  const maxToken = String(args.config.maxApiToken || "");
  const hasMaxConversation = typeof args.customerMaxConversationId === "string" && args.customerMaxConversationId.trim();
  const hasMaxUserId = typeof args.customerMaxUserId === "string" && args.customerMaxUserId.trim();
  if ((hasMaxConversation || hasMaxUserId) && maxBaseUrl && maxToken) {
    const url = hasMaxConversation ? `${maxBaseUrl}/messages` : `${maxBaseUrl}/messages?user_id=${encodeURIComponent(String(args.customerMaxUserId))}`;
    const body = hasMaxConversation ? { conversationId: String(args.customerMaxConversationId), text: reminderText } : { text: reminderText };
    await fetch(url, {
      method: "POST",
      headers: {
        Authorization: maxToken,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    }).catch((err) => {
      console.error("festival review reminder max send failed:", err);
    });
  }
}
const status_put = defineEventHandler(async (event) => {
  var _a;
  const config = useRuntimeConfig(event);
  const access = await requireDashboardAccess(event);
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Order id is required" });
  }
  const body = await readBody(event).catch(() => ({}));
  const nextRaw = typeof (body == null ? void 0 : body.nextStatus) === "string" ? body.nextStatus.trim().toLowerCase() : "";
  const comment = typeof (body == null ? void 0 : body.comment) === "string" ? body.comment.trim() : "";
  const nextStatus = nextRaw === "in_progress" || nextRaw === "in-progress" ? "in_progress" : nextRaw === "ready_for_pickup" || nextRaw === "ready-for-pickup" ? "ready_for_pickup" : nextRaw === "out_for_delivery" || nextRaw === "out-for-delivery" ? "out_for_delivery" : nextRaw === "handed_to_customer" || nextRaw === "handed-to-customer" || nextRaw === "done" ? "handed_to_customer" : nextRaw === "cancelled" || nextRaw === "canceled" ? "cancelled" : nextRaw === "new" ? "new" : null;
  if (!nextStatus) {
    throw createError({ statusCode: 400, statusMessage: "Invalid nextStatus" });
  }
  if (nextStatus === "cancelled" && !comment) {
    throw createError({ statusCode: 400, statusMessage: "Comment is required for cancellation" });
  }
  const client = await serverSupabaseServiceRole(event);
  const { data: existing, error: loadError } = await client.from("orders").select("id,order_number,status,metadata,fulfillment_type,total,restaurant_id,city_id,customer_telegram_id,customer_profile_id").eq("id", id).eq("shop_id", access.shopId).maybeSingle();
  if (loadError) {
    console.error("dashboard order status load:", loadError);
    throw createError({ statusCode: 500, statusMessage: "Failed to load order" });
  }
  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: "Order not found" });
  }
  const current = normalizeDashboardStatus(existing.status);
  const allowed = getAllowedOrderStatusTransitions(current, existing.fulfillment_type);
  if (!allowed.includes(nextStatus)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid status transition" });
  }
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const entry = {
    at: now,
    label: `\u0421\u0442\u0430\u0442\u0443\u0441: ${statusLabels[current]} \u2192 ${statusLabels[nextStatus]}${comment ? ` (${comment})` : ""}`,
    from: current,
    to: nextStatus,
    source: "dashboard",
    userId: access.userId,
    comment: comment || null
  };
  const newMetadata = mergeMetadataWithTimeline(existing.metadata, entry);
  const { error: updateError } = await client.from("orders").update({
    status: nextStatus,
    metadata: newMetadata,
    updated_at: now
  }).eq("id", id).eq("shop_id", access.shopId);
  if (updateError) {
    console.error("dashboard order status update:", updateError);
    throw createError({ statusCode: 500, statusMessage: "Failed to update order" });
  }
  if (nextStatus === "handed_to_customer") {
    await accrueLoyaltyEarnForPaidOrder(client, String(existing.id), access.shopId);
  }
  const customerProfileId = (existing == null ? void 0 : existing.customer_profile_id) ? String(existing.customer_profile_id) : "";
  let customerMaxUserId = null;
  let customerMaxConversationId = null;
  if (customerProfileId) {
    const { data: profile } = await client.from("profiles").select("max_user_id,max_conversation_id").eq("id", customerProfileId).maybeSingle();
    const rawUserId = profile == null ? void 0 : profile.max_user_id;
    const rawConversationId = profile == null ? void 0 : profile.max_conversation_id;
    customerMaxUserId = typeof rawUserId === "string" && rawUserId.trim() ? rawUserId.trim() : null;
    customerMaxConversationId = typeof rawConversationId === "string" && rawConversationId.trim() ? rawConversationId.trim() : null;
  }
  await dispatchNotificationEvent(event, {
    eventId: crypto$1.randomUUID(),
    eventType: "ORDER_STATUS_CHANGED",
    occurredAt: now,
    tenantContext: {
      shopId: access.shopId,
      restaurantId: String(existing.restaurant_id || ""),
      cityId: existing.city_id ? String(existing.city_id) : null
    },
    orderContext: {
      orderId: String(existing.id),
      orderNumber: String(existing.order_number || existing.id).slice(0, 32),
      totalAmount: Number(existing.total || 0),
      status: nextStatus,
      fulfillmentType: String(existing.fulfillment_type || "delivery")
    },
    actorContext: {
      customerTelegramId: (_a = existing.customer_telegram_id) != null ? _a : null,
      customerMaxUserId,
      customerMaxConversationId
    }
  });
  if (nextStatus === "handed_to_customer") {
    const reminderDelayMs = resolveReviewReminderDelayMs(config.festivalReviewReminderDelayMs);
    const orderId = String(existing.id);
    const orderNumber = String(existing.order_number || orderId);
    const restaurantId = (existing == null ? void 0 : existing.restaurant_id) ? String(existing.restaurant_id) : null;
    const customerTelegramIdRaw = Number(existing == null ? void 0 : existing.customer_telegram_id);
    const customerTelegramId = Number.isFinite(customerTelegramIdRaw) && customerTelegramIdRaw > 0 ? customerTelegramIdRaw : null;
    setTimeout(() => {
      void sendReviewReminder({
        client,
        config,
        orderId,
        orderNumber,
        shopId: access.shopId,
        restaurantId,
        customerTelegramId,
        customerMaxUserId,
        customerMaxConversationId
      });
    }, reminderDelayMs);
  }
  return { ok: true, status: nextStatus };
});

const status_put$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: status_put
}, Symbol.toStringTag, { value: 'Module' }));

const index_get$4 = defineEventHandler(async (event) => {
  const access = await requireDashboardAccess(event);
  const q = getQuery$1(event);
  const period = typeof q.period === "string" ? q.period : "all";
  const statusFilter = typeof q.status === "string" && q.status !== "all" ? q.status.toLowerCase() : null;
  const restaurantId = typeof q.restaurant_id === "string" && q.restaurant_id.trim() ? q.restaurant_id.trim() : null;
  const fulfillmentType = typeof q.fulfillment_type === "string" && q.fulfillment_type.trim() ? q.fulfillment_type.trim().toLowerCase() : null;
  const client = await serverSupabaseServiceRole(event);
  const buildOrdersQuery = (includeOrderNumber) => {
    const selectFields = includeOrderNumber ? `
      id,
      order_number,
      shop_id,
      restaurant_id,
      city_id,
      status,
      fulfillment_type,
      payment_method,
      external_order_id,
      external_status,
      last_sync_error,
      subtotal,
      delivery_cost,
      total,
      items,
      created_at,
      customer_telegram_id,
      customer_profile_id
    ` : `
      id,
      shop_id,
      restaurant_id,
      city_id,
      status,
      fulfillment_type,
      payment_method,
      external_order_id,
      external_status,
      last_sync_error,
      subtotal,
      delivery_cost,
      total,
      items,
      created_at,
      customer_telegram_id,
      customer_profile_id
    `;
    let query = client.from("orders").select(selectFields).eq("shop_id", access.shopId).order("created_at", { ascending: false }).limit(500);
    if (restaurantId) {
      query = query.eq("restaurant_id", restaurantId);
    }
    if (fulfillmentType) {
      query = query.eq("fulfillment_type", fulfillmentType);
    }
    if (statusFilter && ["new", "in_progress", "ready_for_pickup", "out_for_delivery", "handed_to_customer", "done", "cancelled"].includes(
      statusFilter
    )) {
      if (statusFilter === "handed_to_customer") {
        query = query.in("status", ["handed_to_customer", "done", "completed"]);
      } else if (statusFilter === "done") {
        query = query.in("status", ["done", "completed", "handed_to_customer"]);
      } else {
        query = query.eq("status", statusFilter);
      }
    }
    const now = /* @__PURE__ */ new Date();
    if (period === "today") {
      const start = new Date(now);
      start.setHours(0, 0, 0, 0);
      query = query.gte("created_at", start.toISOString());
    } else if (period === "week") {
      const start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1e3);
      query = query.gte("created_at", start.toISOString());
    }
    return query;
  };
  let { data, error } = await buildOrdersQuery(true);
  if (error && String((error == null ? void 0 : error.message) || "").includes("order_number")) {
    const fallback = await buildOrdersQuery(false);
    data = fallback.data;
    error = fallback.error;
  }
  if (error) {
    console.error("dashboard orders list:", error);
    throw createError({ statusCode: 500, statusMessage: "Failed to load orders" });
  }
  const rows = data != null ? data : [];
  const restaurantIds = Array.from(new Set(rows.map((r) => r.restaurant_id).filter((x) => !!x)));
  const cityIds = Array.from(new Set(rows.map((r) => r.city_id).filter((x) => !!x)));
  const restaurantsMap = /* @__PURE__ */ new Map();
  if (restaurantIds.length) {
    const { data: rdata } = await client.from("restaurants").select("id,name").in("id", restaurantIds).eq("shop_id", access.shopId);
    for (const r of rdata != null ? rdata : []) {
      if ((r == null ? void 0 : r.id) && (r == null ? void 0 : r.name)) restaurantsMap.set(r.id, r.name);
    }
  }
  const citiesMap = /* @__PURE__ */ new Map();
  if (cityIds.length) {
    const { data: cdata } = await client.from("cities").select("id,name").in("id", cityIds);
    for (const c of cdata != null ? cdata : []) {
      if ((c == null ? void 0 : c.id) && (c == null ? void 0 : c.name)) citiesMap.set(c.id, c.name);
    }
  }
  let shopName = "\u2014";
  const { data: shopRow } = await client.from("shops").select("name").eq("id", access.shopId).maybeSingle();
  if (shopRow == null ? void 0 : shopRow.name) shopName = shopRow.name;
  const items = rows.map((row) => {
    var _a, _b, _c, _d, _e;
    const safeItems = Array.isArray(row.items) ? row.items : [];
    const itemsCount = safeItems.reduce((sum, item) => sum + (Number(item == null ? void 0 : item.quantity) || 0), 0);
    const itemsPreview = safeItems.map((item) => {
      const name = typeof (item == null ? void 0 : item.name) === "string" && item.name.trim() ? item.name.trim() : "\u0422\u043E\u0432\u0430\u0440";
      const quantity = Number(item == null ? void 0 : item.quantity) > 0 ? Math.floor(Number(item.quantity)) : 1;
      return { name, quantity };
    });
    const st = normalizeDashboardStatus(row.status);
    return {
      id: row.id,
      orderNumber: row.order_number || null,
      shopId: row.shop_id,
      restaurantId: row.restaurant_id,
      restaurantName: row.restaurant_id ? (_a = restaurantsMap.get(row.restaurant_id)) != null ? _a : "\u2014" : "\u2014",
      cityId: row.city_id,
      cityName: row.city_id ? (_b = citiesMap.get(row.city_id)) != null ? _b : "\u2014" : "\u2014",
      brand: shopName,
      status: st,
      fulfillmentType: row.fulfillment_type || "delivery",
      paymentMethod: row.payment_method || "cash",
      externalOrderId: row.external_order_id || null,
      externalStatus: row.external_status || null,
      lastSyncError: row.last_sync_error || null,
      subtotal: (_c = row.subtotal) != null ? _c : 0,
      deliveryCost: (_d = row.delivery_cost) != null ? _d : 0,
      total: (_e = row.total) != null ? _e : 0,
      itemsCount,
      itemsPreview,
      createdAt: row.created_at,
      customerTelegramId: row.customer_telegram_id,
      customerProfileId: row.customer_profile_id
    };
  });
  return { ok: true, items };
});

const index_get$5 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_get$4
}, Symbol.toStringTag, { value: 'Module' }));

const ALLOWED_MIME$2 = /* @__PURE__ */ new Set(["image/png", "image/jpeg", "image/webp", "image/svg+xml", "image/x-icon"]);
const MAX_SIZE_BYTES$2 = 2 * 1024 * 1024;
function sanitizeFileName$2(input) {
  const cleaned = input.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-80) || "upload";
  return cleaned.replace(/\.[a-zA-Z0-9]+$/, "");
}
function getExtension$2(fileName, mimeType) {
  var _a;
  const fromName = (_a = fileName.split(".").pop()) == null ? void 0 : _a.toLowerCase();
  if (fromName && /^[a-z0-9]+$/.test(fromName)) return fromName;
  if (mimeType === "image/jpeg") return "jpg";
  if (mimeType === "image/png") return "png";
  if (mimeType === "image/webp") return "webp";
  if (mimeType === "image/svg+xml") return "svg";
  if (mimeType === "image/x-icon") return "ico";
  return "bin";
}
function validateDimensions(kind, width, height) {
  if (kind === "favicon") return;
  if (!Number.isFinite(width) || !Number.isFinite(height) || !width || !height) {
    throw createError({ statusCode: 400, statusMessage: "Image dimensions are required" });
  }
  if ((kind === "logo" || kind === "logo-large") && (width < 256 || height < 256)) {
    throw createError({ statusCode: 400, statusMessage: "Logo must be at least 256x256" });
  }
}
const media_post = defineEventHandler(async (event) => {
  const access = await requireDashboardAccess(event);
  if (access.role !== "owner") {
    throw createError({ statusCode: 403, statusMessage: "Only owner can upload organization media" });
  }
  const body = await readBody(event);
  if (!(body == null ? void 0 : body.kind) || !body.mimeType || !body.dataBase64 || !body.fileName) {
    throw createError({ statusCode: 400, statusMessage: "kind, fileName, mimeType and dataBase64 are required" });
  }
  if (!["logo", "logo-large", "favicon", "restaurant-card", "hero"].includes(body.kind)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid media kind" });
  }
  if (!ALLOWED_MIME$2.has(body.mimeType)) {
    throw createError({ statusCode: 400, statusMessage: "Unsupported media type" });
  }
  validateDimensions(body.kind, body.width, body.height);
  const bytes = Buffer.from(body.dataBase64, "base64");
  if (!bytes.byteLength || bytes.byteLength > MAX_SIZE_BYTES$2) {
    throw createError({ statusCode: 400, statusMessage: "File size must be between 1B and 2MB" });
  }
  const extension = getExtension$2(body.fileName, body.mimeType);
  const safeName = sanitizeFileName$2(body.fileName);
  const objectPath = `${access.shopId}/${body.kind}/${Date.now()}-${safeName}.${extension}`;
  const client = await serverSupabaseServiceRole(event);
  const upload = await client.storage.from("organization-media").upload(objectPath, bytes, {
    contentType: body.mimeType,
    upsert: true
  });
  if (upload.error) {
    throw createError({ statusCode: 500, statusMessage: upload.error.message || "Upload failed" });
  }
  const publicUrl = client.storage.from("organization-media").getPublicUrl(objectPath).data.publicUrl;
  return {
    ok: true,
    kind: body.kind,
    url: publicUrl,
    path: objectPath
  };
});

const media_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: media_post
}, Symbol.toStringTag, { value: 'Module' }));

const stylePresets_get = defineEventHandler(async (event) => {
  const access = await requireDashboardAccess(event);
  const [system, custom] = await Promise.all([
    Promise.resolve(getSystemPresets()),
    getCustomPresets(event, access.shopId)
  ]);
  return {
    ok: true,
    items: [...system, ...custom]
  };
});

const stylePresets_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: stylePresets_get
}, Symbol.toStringTag, { value: 'Module' }));

const stylePresets_post = defineEventHandler(async (event) => {
  var _a;
  const access = await requireDashboardAccess(event);
  if (access.role !== "owner") {
    throw createError({ statusCode: 403, statusMessage: "Only owner can create custom presets" });
  }
  const body = await readBody(event);
  if (!(body == null ? void 0 : body.title) || !(body == null ? void 0 : body.config)) {
    throw createError({ statusCode: 400, statusMessage: "Preset title and config are required" });
  }
  const created = await createCustomPreset(event, access.shopId, access.userId, {
    title: body.title,
    mood: (_a = body.mood) != null ? _a : "",
    config: body.config
  });
  return {
    ok: true,
    item: created
  };
});

const stylePresets_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: stylePresets_post
}, Symbol.toStringTag, { value: 'Module' }));

const style_get = defineEventHandler(async (event) => {
  const access = await requireDashboardAccess(event);
  const [record, settings] = await Promise.all([
    getStyleRecord(event, access.shopId),
    getOrganizationSettings(event, access.shopId)
  ]);
  return {
    ok: true,
    role: access.role,
    settings,
    data: record.config,
    hasRollback: !!record.prevConfig,
    auditLog: record.auditLog
  };
});

const style_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: style_get
}, Symbol.toStringTag, { value: 'Module' }));

const style_put = defineEventHandler(async (event) => {
  var _a;
  const access = await requireDashboardAccess(event);
  if (access.role !== "owner") {
    throw createError({ statusCode: 403, statusMessage: "Only owner can save organization style" });
  }
  const body = await readBody(event);
  if (!(body == null ? void 0 : body.data)) {
    throw createError({ statusCode: 400, statusMessage: "Style payload is required" });
  }
  if (!(body == null ? void 0 : body.settings)) {
    throw createError({ statusCode: 400, statusMessage: "Organization settings payload is required" });
  }
  const errors = validateStyleConfig(body.data);
  errors.push(...validateOrganizationSettings(body.settings));
  if (errors.length) {
    throw createError({ statusCode: 400, statusMessage: errors.join(" ") });
  }
  const normalizedSlug = body.settings.slug.trim().toLowerCase();
  const client = await serverSupabaseServiceRole(event);
  const duplicateSlug = await client.from("shops").select("id").eq("slug", normalizedSlug).neq("id", access.shopId).limit(1).maybeSingle();
  if (duplicateSlug.error) {
    throw createError({ statusCode: 500, statusMessage: duplicateSlug.error.message || "Failed to validate slug uniqueness" });
  }
  if ((_a = duplicateSlug.data) == null ? void 0 : _a.id) {
    throw createError({ statusCode: 400, statusMessage: "\u042D\u0442\u043E\u0442 slug \u0443\u0436\u0435 \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0435\u0442\u0441\u044F \u0434\u0440\u0443\u0433\u0438\u043C \u0440\u0435\u0441\u0442\u043E\u0440\u0430\u043D\u043E\u043C." });
  }
  const current = await getStyleRecord(event, access.shopId);
  const nextSettings = {
    ...body.settings,
    slug: normalizedSlug
  };
  await persistOrganizationSettings(event, access.shopId, nextSettings);
  const nextRecord = withAuditEntry(
    {
      config: body.data,
      prevConfig: current.config,
      auditLog: current.auditLog
    },
    access.userId,
    "save",
    ["\u041E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u044B \u0441\u0442\u0438\u043B\u044C \u0438 \u0438\u0434\u0435\u043D\u0442\u0438\u043A\u0430 \u043E\u0440\u0433\u0430\u043D\u0438\u0437\u0430\u0446\u0438\u0438"]
  );
  await persistStyleRecord(event, access.shopId, nextRecord);
  const settings = await getOrganizationSettings(event, access.shopId);
  return {
    ok: true,
    role: access.role,
    settings,
    data: nextRecord.config,
    hasRollback: !!nextRecord.prevConfig,
    auditLog: nextRecord.auditLog
  };
});

const style_put$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: style_put
}, Symbol.toStringTag, { value: 'Module' }));

const contacts_put = defineEventHandler(async (event) => {
  var _a, _b;
  const access = await requireDashboardAccess(event);
  if (access.role !== "owner") {
    throw createError({ statusCode: 403, statusMessage: "Only owner can save organization contacts" });
  }
  const body = await readBody(event);
  if (!((_a = body == null ? void 0 : body.settings) == null ? void 0 : _a.contacts)) {
    throw createError({ statusCode: 400, statusMessage: "Organization contacts payload is required" });
  }
  const current = await getOrganizationSettings(event, access.shopId);
  const nextSettings = {
    ...current,
    contacts: body.settings.contacts,
    legal: (_b = body.settings.legal) != null ? _b : current.legal
  };
  const errors = validateOrganizationContactsSettings(nextSettings);
  if (errors.length) {
    throw createError({ statusCode: 400, statusMessage: errors.join(" ") });
  }
  await persistOrganizationSettings(event, access.shopId, nextSettings);
  const style = await getStyleRecord(event, access.shopId);
  const settings = await getOrganizationSettings(event, access.shopId);
  return {
    ok: true,
    role: access.role,
    settings,
    data: style.config,
    hasRollback: !!style.prevConfig,
    auditLog: style.auditLog
  };
});

const contacts_put$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: contacts_put
}, Symbol.toStringTag, { value: 'Module' }));

function validateIdentitySettings(settings) {
  const errors = [];
  const slug = settings.slug.trim().toLowerCase();
  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    errors.push("Slug \u0434\u043E\u043B\u0436\u0435\u043D \u0431\u044B\u0442\u044C \u0432 \u0444\u043E\u0440\u043C\u0430\u0442\u0435 lowercase-kebab-case.");
  }
  if (settings.displayName.trim().length < 2 || settings.displayName.trim().length > 60) {
    errors.push("\u041F\u0443\u0431\u043B\u0438\u0447\u043D\u043E\u0435 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0434\u043E\u043B\u0436\u043D\u043E \u0431\u044B\u0442\u044C \u043E\u0442 2 \u0434\u043E 60 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432.");
  }
  if (settings.tagline.trim().length > 120) {
    errors.push("\u041A\u043E\u0440\u043E\u0442\u043A\u0438\u0439 \u0441\u043B\u043E\u0433\u0430\u043D \u043F\u043E\u0434 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435\u043C \u043D\u0435 \u0434\u043E\u043B\u0436\u0435\u043D \u043F\u0440\u0435\u0432\u044B\u0448\u0430\u0442\u044C 120 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432.");
  }
  if (settings.cuisine.trim().length > 300) {
    errors.push("\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044F \u043A\u0443\u0445\u043D\u0438 \u043D\u0435 \u0434\u043E\u043B\u0436\u043D\u0430 \u043F\u0440\u0435\u0432\u044B\u0448\u0430\u0442\u044C 300 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432.");
  }
  return errors;
}
const identity_put = defineEventHandler(async (event) => {
  var _a;
  const access = await requireDashboardAccess(event);
  if (access.role !== "owner") {
    throw createError({ statusCode: 403, statusMessage: "Only owner can save organization identity" });
  }
  const body = await readBody(event);
  if (!(body == null ? void 0 : body.data) || !(body == null ? void 0 : body.settings)) {
    throw createError({ statusCode: 400, statusMessage: "Payload is required" });
  }
  const errors = validateStyleConfig(body.data);
  errors.push(...validateIdentitySettings(body.settings));
  if (errors.length) {
    throw createError({ statusCode: 400, statusMessage: errors.join(" ") });
  }
  const normalizedSlug = body.settings.slug.trim().toLowerCase();
  const client = await serverSupabaseServiceRole(event);
  const duplicateSlug = await client.from("shops").select("id").eq("slug", normalizedSlug).neq("id", access.shopId).limit(1).maybeSingle();
  if (duplicateSlug.error) {
    throw createError({ statusCode: 500, statusMessage: duplicateSlug.error.message || "Failed to validate slug uniqueness" });
  }
  if ((_a = duplicateSlug.data) == null ? void 0 : _a.id) {
    throw createError({ statusCode: 400, statusMessage: "\u042D\u0442\u043E\u0442 slug \u0443\u0436\u0435 \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0435\u0442\u0441\u044F \u0434\u0440\u0443\u0433\u0438\u043C \u0440\u0435\u0441\u0442\u043E\u0440\u0430\u043D\u043E\u043C." });
  }
  const currentStyle = await getStyleRecord(event, access.shopId);
  const currentSettings = await getOrganizationSettings(event, access.shopId);
  const nextStyle = {
    ...currentStyle.config,
    identity: body.data.identity
  };
  const nextSettings = {
    ...currentSettings,
    slug: normalizedSlug,
    displayName: body.settings.displayName,
    tagline: body.settings.tagline,
    cuisine: body.settings.cuisine
  };
  await persistOrganizationSettings(event, access.shopId, nextSettings);
  const nextRecord = withAuditEntry(
    {
      config: nextStyle,
      prevConfig: currentStyle.config,
      auditLog: currentStyle.auditLog
    },
    access.userId,
    "save",
    ["\u041E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u044B \u0430\u0439\u0434\u0435\u043D\u0442\u0438\u043A\u0430 \u0438 \u043F\u0443\u0431\u043B\u0438\u0447\u043D\u044B\u0435 \u043F\u043E\u043B\u044F \u043E\u0440\u0433\u0430\u043D\u0438\u0437\u0430\u0446\u0438\u0438"]
  );
  await persistStyleRecord(event, access.shopId, nextRecord);
  const settings = await getOrganizationSettings(event, access.shopId);
  return {
    ok: true,
    role: access.role,
    settings,
    data: nextRecord.config,
    hasRollback: !!nextRecord.prevConfig,
    auditLog: nextRecord.auditLog
  };
});

const identity_put$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: identity_put
}, Symbol.toStringTag, { value: 'Module' }));

const operations_put = defineEventHandler(async (event) => {
  const access = await requireDashboardAccess(event);
  if (access.role !== "owner") {
    throw createError({ statusCode: 403, statusMessage: "Only owner can save organization operations" });
  }
  const body = await readBody(event);
  if (!(body == null ? void 0 : body.settings)) {
    throw createError({ statusCode: 400, statusMessage: "Organization settings payload is required" });
  }
  const current = await getOrganizationSettings(event, access.shopId);
  const nextSettings = {
    ...current,
    ops: body.settings.ops,
    locale: body.settings.locale,
    tax: body.settings.tax
  };
  const errors = validateOrganizationOperationsSettings(nextSettings);
  if (errors.length) {
    throw createError({ statusCode: 400, statusMessage: errors.join(" ") });
  }
  await persistOrganizationSettings(event, access.shopId, nextSettings);
  const style = await getStyleRecord(event, access.shopId);
  const settings = await getOrganizationSettings(event, access.shopId);
  return {
    ok: true,
    role: access.role,
    settings,
    data: style.config,
    hasRollback: !!style.prevConfig,
    auditLog: style.auditLog
  };
});

const operations_put$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: operations_put
}, Symbol.toStringTag, { value: 'Module' }));

const rollback_post = defineEventHandler(async (event) => {
  const access = await requireDashboardAccess(event);
  if (access.role !== "owner") {
    throw createError({ statusCode: 403, statusMessage: "Only owner can rollback organization style" });
  }
  const current = await getStyleRecord(event, access.shopId);
  if (!current.prevConfig) {
    throw createError({ statusCode: 400, statusMessage: "No previous style state for rollback" });
  }
  const nextRecord = withAuditEntry(
    {
      config: current.prevConfig,
      prevConfig: null,
      auditLog: current.auditLog
    },
    access.userId,
    "rollback",
    ["\u0412\u044B\u043F\u043E\u043B\u043D\u0435\u043D rollback \u0441\u0442\u0438\u043B\u044F \u043E\u0440\u0433\u0430\u043D\u0438\u0437\u0430\u0446\u0438\u0438"]
  );
  await persistStyleRecord(event, access.shopId, nextRecord);
  const settings = await getOrganizationSettings(event, access.shopId);
  return {
    ok: true,
    role: access.role,
    settings,
    data: nextRecord.config,
    hasRollback: !!nextRecord.prevConfig,
    auditLog: nextRecord.auditLog
  };
});

const rollback_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: rollback_post
}, Symbol.toStringTag, { value: 'Module' }));

const styles_put = defineEventHandler(async (event) => {
  var _a;
  const access = await requireDashboardAccess(event);
  if (access.role !== "owner") {
    throw createError({ statusCode: 403, statusMessage: "Only owner can save organization style" });
  }
  const body = await readBody(event);
  if (!(body == null ? void 0 : body.data)) {
    throw createError({ statusCode: 400, statusMessage: "Style payload is required" });
  }
  const errors = validateStyleConfig(body.data);
  if (errors.length) {
    throw createError({ statusCode: 400, statusMessage: errors.join(" ") });
  }
  const current = await getStyleRecord(event, access.shopId);
  const nextStyle = {
    ...current.config,
    tokens: body.data.tokens,
    radii: body.data.radii,
    presetId: (_a = body.data.presetId) != null ? _a : null
  };
  const nextRecord = withAuditEntry(
    {
      config: nextStyle,
      prevConfig: current.config,
      auditLog: current.auditLog
    },
    access.userId,
    "save",
    ["\u041E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u044B \u0441\u0442\u0438\u043B\u0438 \u043E\u0440\u0433\u0430\u043D\u0438\u0437\u0430\u0446\u0438\u0438"]
  );
  await persistStyleRecord(event, access.shopId, nextRecord);
  const settings = await getOrganizationSettings(event, access.shopId);
  return {
    ok: true,
    role: access.role,
    settings,
    data: nextRecord.config,
    hasRollback: !!nextRecord.prevConfig,
    auditLog: nextRecord.auditLog
  };
});

const styles_put$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: styles_put
}, Symbol.toStringTag, { value: 'Module' }));

let cachedRestaurantsSelectMode = "primary";
function isMissingColumnError(error) {
  if (!error || typeof error !== "object") return false;
  const code = typeof error.code === "string" ? error.code : "";
  const message = typeof error.message === "string" ? error.message.toLowerCase() : "";
  const details = typeof error.details === "string" ? error.details.toLowerCase() : "";
  return code === "42703" || code === "PGRST204" || message.includes("column") || details.includes("column");
}
const restaurants_get = defineEventHandler(async (event) => {
  const access = await requireDashboardAccess(event);
  const query = getQuery$1(event);
  const compact = query.compact === "1" || query.compact === "true";
  const branchList = query.branchList === "1" || query.branchList === "true";
  const clientPromise = serverSupabaseServiceRole(event);
  if (compact) {
    const client2 = await clientPromise;
    const page = Math.max(Number(query.page) || 1, 1);
    const pageSize = Math.min(Math.max(Number(query.pageSize) || 100, 1), 200);
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    const { data: data2, error: error2 } = await client2.from("restaurants").select("id,name").eq("shop_id", access.shopId).order("created_at", { ascending: false }).range(from, to);
    if (error2) {
      console.error("Failed to load compact dashboard restaurants:", error2);
      throw createError({ statusCode: 500, statusMessage: "Failed to load restaurants" });
    }
    const rows2 = data2 != null ? data2 : [];
    return {
      ok: true,
      shopId: access.shopId,
      items: rows2.slice(0, pageSize).map((row) => ({
        id: row.id,
        name: row.name
      })),
      pagination: {
        page,
        pageSize,
        hasNext: rows2.length > pageSize,
        hasPrev: page > 1
      }
    };
  }
  if (branchList) {
    const client2 = await clientPromise;
    const { data: data2, error: error2 } = await client2.from("restaurants").select("id,name,address,city_id,cities(name),is_active,created_at").eq("shop_id", access.shopId).order("created_at", { ascending: false });
    if (error2) {
      console.error("Failed to load branch-list dashboard restaurants:", error2);
      throw createError({ statusCode: 500, statusMessage: "Failed to load restaurants" });
    }
    return {
      ok: true,
      shopId: access.shopId,
      items: (data2 != null ? data2 : []).map((row) => {
        const cityRow = Array.isArray(row.cities) ? row.cities[0] : row.cities;
        const cityName = typeof (cityRow == null ? void 0 : cityRow.name) === "string" && cityRow.name.trim().length ? cityRow.name.trim() : null;
        return {
          id: row.id,
          name: row.name,
          address: row.address,
          cityId: typeof row.city_id === "string" ? row.city_id : null,
          cityName,
          isActive: row.is_active === true,
          createdAt: row.created_at
        };
      })
    };
  }
  const [org, client] = await Promise.all([
    getOrganizationSettings(event, access.shopId),
    clientPromise
  ]);
  const allowedSet = new Set(org.ops.fulfillmentTypes);
  const hallMode = org.ops.dineInHallMode;
  const hallOrderingEnabled = allowedSet.has("dine-in") && hallMode !== "qr-menu-browse";
  let data = null;
  let error = null;
  const runRestaurantsQuery = async (mode) => {
    const selectByMode = {
      primary: "id,name,address,city_id,cities(name),lat,lon,supports_delivery,supports_pickup,supports_dine_in,supports_qr_menu,supports_showcase_order,festival_id,is_festival,festival_fulfillment_type,use_organization_working_hours,working_hours,is_active,created_at",
      fallback: "id,name,address,city_id,cities(name),lat,lon,supports_delivery,supports_pickup,supports_dine_in,supports_qr_menu,supports_showcase_order,is_active,created_at",
      legacy: "id,name,address,city_id,cities(name),lat,lon,supports_delivery,supports_pickup,supports_dine_in,is_active,created_at"
    };
    return client.from("restaurants").select(selectByMode[mode]).eq("shop_id", access.shopId).order("created_at", { ascending: false });
  };
  const modesInOrder = ["primary", "fallback", "legacy"];
  const startIndex = modesInOrder.indexOf(cachedRestaurantsSelectMode);
  const modesToTry = [...modesInOrder.slice(startIndex), ...modesInOrder.slice(0, startIndex)];
  for (const mode of modesToTry) {
    const result = await runRestaurantsQuery(mode);
    data = result.data;
    error = result.error;
    if (!error) {
      cachedRestaurantsSelectMode = mode;
      break;
    }
    if (!isMissingColumnError(error)) {
      break;
    }
  }
  if (error) {
    console.error("Failed to load dashboard restaurants:", error);
    throw createError({ statusCode: 500, statusMessage: "Failed to load restaurants" });
  }
  const rows = data != null ? data : [];
  const fallbackWorkingHours = getDefaultOrganizationSettings().ops.workingHours;
  return {
    ok: true,
    shopId: access.shopId,
    items: rows.map((row) => {
      const cityRow = Array.isArray(row.cities) ? row.cities[0] : row.cities;
      const cityName = typeof (cityRow == null ? void 0 : cityRow.name) === "string" && cityRow.name.trim().length ? cityRow.name.trim() : null;
      return {
        id: row.id,
        name: row.name,
        address: row.address,
        cityId: typeof row.city_id === "string" ? row.city_id : null,
        cityName,
        lat: typeof row.lat === "number" && Number.isFinite(row.lat) ? row.lat : null,
        lon: typeof row.lon === "number" && Number.isFinite(row.lon) ? row.lon : null,
        supportsDelivery: row.supports_delivery === true && allowedSet.has("delivery"),
        supportsPickup: row.supports_pickup === true && allowedSet.has("pickup"),
        supportsDineIn: row.supports_dine_in === true && allowedSet.has("dine-in"),
        supportsQrMenu: row.supports_qr_menu === true && hallOrderingEnabled && hallMode === "to-table",
        supportsShowcaseOrder: row.supports_showcase_order === true && hallOrderingEnabled && hallMode === "pickup-point",
        festivalId: typeof row.festival_id === "string" ? row.festival_id : null,
        isFestival: row.is_festival === true,
        festivalFulfillmentType: ["delivery", "pickup", "dine-in"].includes(String(row.festival_fulfillment_type)) ? row.festival_fulfillment_type : null,
        useOrganizationWorkingHours: row.use_organization_working_hours !== false,
        workingHours: normalizeWeeklyWorkingHours(row.working_hours, fallbackWorkingHours),
        isActive: row.is_active,
        createdAt: row.created_at
      };
    })
  };
});

const restaurants_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: restaurants_get
}, Symbol.toStringTag, { value: 'Module' }));

const action_post = defineEventHandler(async (event) => {
  const access = await requireDashboardAccess(event);
  await requireReviewsFeature(event, access.shopId);
  const body = await readBody(event).catch(() => ({}));
  const reviewId = typeof body.reviewId === "string" ? body.reviewId.trim() : "";
  if (!reviewId) {
    throw createError({ statusCode: 400, statusMessage: "reviewId is required" });
  }
  const action = body.action || "reject";
  const allowed = /* @__PURE__ */ new Set(["publish", "reject", "resolve", "reopen"]);
  if (!allowed.has(action)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid action" });
  }
  const result = await applyReviewModerationAction(event, {
    reviewId,
    shopId: access.shopId,
    action,
    actorUserId: access.userId
  });
  return { ok: true, status: result.status };
});

const action_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: action_post
}, Symbol.toStringTag, { value: 'Module' }));

const index_get$2 = defineEventHandler(async (event) => {
  const access = await requireDashboardAccess(event);
  await requireReviewsFeature(event, access.shopId);
  const query = getQuery$1(event);
  const status = typeof query.status === "string" && query.status.trim() ? query.status.trim() : "all";
  const restaurantId = typeof query.restaurant_id === "string" && query.restaurant_id.trim() ? query.restaurant_id.trim() : "";
  const limit = Math.min(Math.max(Number(query.limit) || 100, 1), 300);
  const onlyNegative = String(query.only_negative || "").trim() === "1";
  const client = await serverSupabaseServiceRole(event);
  let dbQuery = client.from("shop_reviews").select("id,shop_id,restaurant_id,order_id,rating,comment,video_url,status,moderation_channel,moderation_chat_id,forwarded_to_manager_at,published_at,resolved_at,created_at").eq("shop_id", access.shopId).order("created_at", { ascending: false }).limit(limit);
  if (status !== "all") dbQuery = dbQuery.eq("status", status);
  if (restaurantId) dbQuery = dbQuery.eq("restaurant_id", restaurantId);
  if (onlyNegative) dbQuery = dbQuery.lte("rating", 3);
  const { data, error } = await dbQuery;
  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message || "Failed to load reviews queue" });
  }
  const restaurantIds = Array.from(new Set((data != null ? data : []).map((x) => String(x.restaurant_id || "")).filter(Boolean)));
  const { data: restaurants } = restaurantIds.length ? await client.from("restaurants").select("id,name").in("id", restaurantIds) : { data: [] };
  const restaurantById = new Map((restaurants != null ? restaurants : []).map((x) => [String(x.id), String(x.name || "\u2014")]));
  const items = (data != null ? data : []).map((x) => ({
    id: String(x.id),
    restaurantId: x.restaurant_id ? String(x.restaurant_id) : null,
    restaurantName: x.restaurant_id ? restaurantById.get(String(x.restaurant_id)) || "\u2014" : "\u2014",
    orderId: String(x.order_id || ""),
    rating: Number(x.rating || 0),
    comment: typeof x.comment === "string" ? x.comment : null,
    videoUrl: typeof x.video_url === "string" ? x.video_url : null,
    status: String(x.status || "new"),
    moderationChannel: x.moderation_channel || null,
    moderationChatId: x.moderation_chat_id || null,
    forwardedToManagerAt: x.forwarded_to_manager_at || null,
    publishedAt: x.published_at || null,
    resolvedAt: x.resolved_at || null,
    createdAt: String(x.created_at || "")
  }));
  const publicAgg = await computePublicRating(event, {
    shopId: access.shopId,
    restaurantId: restaurantId || null,
    sampleLimit: 20
  });
  const internalAgg = await computeInternalQualityScore(event, {
    shopId: access.shopId,
    restaurantId: restaurantId || null,
    sampleLimit: 20
  });
  let negBase = client.from("shop_reviews").select("id", { count: "exact", head: true }).eq("shop_id", access.shopId).lte("rating", 3);
  if (restaurantId) negBase = negBase.eq("restaurant_id", restaurantId);
  let negResolved = client.from("shop_reviews").select("id", { count: "exact", head: true }).eq("shop_id", access.shopId).lte("rating", 3).eq("status", "resolved");
  if (restaurantId) negResolved = negResolved.eq("restaurant_id", restaurantId);
  const [{ count: negativeTotal }, { count: resolvedNegative }] = await Promise.all([negBase, negResolved]);
  const negativeTotalN = typeof negativeTotal === "number" ? negativeTotal : 0;
  const resolvedNegativeN = typeof resolvedNegative === "number" ? resolvedNegative : 0;
  return {
    ok: true,
    items,
    metrics: {
      public_rating: publicAgg.public_rating,
      public_sample_count: publicAgg.sample_count,
      internal_quality_score: internalAgg.internal_quality_score,
      internal_sample_count: internalAgg.sample_count,
      negative_total: negativeTotalN,
      negative_resolved: resolvedNegativeN,
      negative_resolved_percent: negativeTotalN > 0 ? Math.round(resolvedNegativeN / negativeTotalN * 100) : 0
    }
  };
});

const index_get$3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_get$2
}, Symbol.toStringTag, { value: 'Module' }));

const storefront_get = defineEventHandler(async (event) => {
  var _a, _b;
  const access = await requireDashboardAccess(event);
  const client = await serverSupabaseServiceRole(event);
  const config = useRuntimeConfig(event);
  const defaultCitySlug = typeof ((_a = config.public) == null ? void 0 : _a.defaultCitySlug) === "string" && config.public.defaultCitySlug.trim() ? config.public.defaultCitySlug.trim() : "ulan-ude";
  const { data, error } = await client.from("shops").select("slug").eq("id", access.shopId).maybeSingle();
  if (error) {
    throw createError({ statusCode: 500, statusMessage: "Failed to resolve storefront path" });
  }
  const cityRes = await client.from("restaurants").select("cities(slug)").eq("shop_id", access.shopId).eq("is_active", true).limit(1);
  if (cityRes.error) {
    throw createError({ statusCode: 500, statusMessage: "Failed to resolve storefront city" });
  }
  const firstRow = Array.isArray(cityRes.data) ? cityRes.data[0] : null;
  const citySlug = typeof ((_b = firstRow == null ? void 0 : firstRow.cities) == null ? void 0 : _b.slug) === "string" && firstRow.cities.slug.trim() ? firstRow.cities.slug.trim() : defaultCitySlug;
  const slug = typeof (data == null ? void 0 : data.slug) === "string" ? data.slug.trim() : "";
  return {
    ok: true,
    path: slug ? `/${citySlug}/${slug}` : "/"
  };
});

const storefront_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: storefront_get
}, Symbol.toStringTag, { value: 'Module' }));

const _id__delete = defineEventHandler(async (event) => {
  var _a;
  const access = await requireDashboardAccess(event);
  const client = await serverSupabaseServiceRole(event);
  const id = (_a = event.context.params) == null ? void 0 : _a.id;
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "ID is required" });
  }
  const { error } = await client.from("story_campaigns").delete().eq("id", id).eq("shop_id", access.shopId);
  if (error) {
    console.error("delete story campaign:", error);
    throw createError({ statusCode: 500, statusMessage: "Failed to delete campaign" });
  }
  return { ok: true };
});

const _id__delete$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__delete
}, Symbol.toStringTag, { value: 'Module' }));

const _id__get = defineEventHandler(async (event) => {
  var _a, _b;
  const access = await requireDashboardAccess(event);
  const client = await serverSupabaseServiceRole(event);
  const id = (_a = event.context.params) == null ? void 0 : _a.id;
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "ID is required" });
  }
  const { data: row, error } = await client.from("story_campaigns").select("id, title, preview_url, placement, is_active, valid_from, valid_until, targeting, created_at").eq("id", id).eq("shop_id", access.shopId).maybeSingle();
  if (error) {
    throw createError({ statusCode: 500, statusMessage: "Failed to load campaign" });
  }
  if (!row) {
    throw createError({ statusCode: 404, statusMessage: "Campaign not found" });
  }
  const { data: slideRows, error: sErr } = await client.from("story_slides").select("id, sort_order, media_url, duration_seconds, action_type, action_payload").eq("campaign_id", id).order("sort_order", { ascending: true });
  if (sErr) {
    throw createError({ statusCode: 500, statusMessage: "Failed to load slides" });
  }
  const slides = (slideRows != null ? slideRows : []).map((s) => {
    var _a2;
    return {
      id: s.id,
      sortOrder: s.sort_order,
      mediaUrl: s.media_url,
      durationSeconds: s.duration_seconds,
      actionType: s.action_type,
      actionPayload: (_a2 = s.action_payload) != null ? _a2 : {}
    };
  });
  const r = row;
  return {
    ok: true,
    item: {
      id: r.id,
      title: r.title,
      previewUrl: r.preview_url,
      placement: r.placement,
      isActive: r.is_active,
      validFrom: r.valid_from,
      validUntil: r.valid_until,
      targeting: (_b = r.targeting) != null ? _b : {},
      createdAt: r.created_at,
      slides
    }
  };
});

const _id__get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__get
}, Symbol.toStringTag, { value: 'Module' }));

const _id__put = defineEventHandler(async (event) => {
  var _a;
  const access = await requireDashboardAccess(event);
  const client = await serverSupabaseServiceRole(event);
  const id = (_a = event.context.params) == null ? void 0 : _a.id;
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "ID is required" });
  }
  const body = await readBody(event);
  const { data: existing, error: exErr } = await client.from("story_campaigns").select("id").eq("id", id).eq("shop_id", access.shopId).maybeSingle();
  if (exErr) {
    throw createError({ statusCode: 500, statusMessage: "Failed to load campaign" });
  }
  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: "Campaign not found" });
  }
  const patch = {};
  if (typeof (body == null ? void 0 : body.title) === "string") patch.title = body.title.trim();
  if ((body == null ? void 0 : body.previewUrl) === null) patch.preview_url = null;
  else if (typeof (body == null ? void 0 : body.previewUrl) === "string") patch.preview_url = body.previewUrl.trim() || null;
  if ((body == null ? void 0 : body.placement) === "top_bar" || (body == null ? void 0 : body.placement) === "catalog_grid") patch.placement = body.placement;
  if (typeof (body == null ? void 0 : body.isActive) === "boolean") patch.is_active = body.isActive;
  if ("validFrom" in body) patch.valid_from = body.validFrom;
  if ("validUntil" in body) patch.valid_until = body.validUntil;
  if ((body == null ? void 0 : body.targeting) && typeof body.targeting === "object") patch.targeting = body.targeting;
  if (Object.keys(patch).length) {
    patch.updated_at = (/* @__PURE__ */ new Date()).toISOString();
    const { error: upErr } = await client.from("story_campaigns").update(patch).eq("id", id);
    if (upErr) {
      console.error("update story campaign:", upErr);
      throw createError({ statusCode: 500, statusMessage: "Failed to update campaign" });
    }
  }
  if (Array.isArray(body == null ? void 0 : body.slides)) {
    const slides = body.slides;
    const { data: oldSlides } = await client.from("story_slides").select("id").eq("campaign_id", id);
    const oldIds = new Set((oldSlides != null ? oldSlides : []).map((r) => r.id));
    const nextIds = new Set(slides.map((s) => s.id).filter((x) => typeof x === "string"));
    for (const oid of oldIds) {
      if (!nextIds.has(oid)) {
        await client.from("story_slides").delete().eq("id", oid);
      }
    }
    let idx = 0;
    for (const s of slides) {
      const sortOrder = typeof s.sortOrder === "number" ? s.sortOrder : idx;
      const durationSeconds = typeof s.durationSeconds === "number" && s.durationSeconds >= 1 ? Math.min(120, s.durationSeconds) : 5;
      const actionType = normalizeActionType$1(s.actionType);
      const actionPayload = s.actionPayload && typeof s.actionPayload === "object" ? s.actionPayload : {};
      const mediaUrl = typeof s.mediaUrl === "string" ? s.mediaUrl.trim() : "";
      if (s.id && oldIds.has(s.id)) {
        const { error: u } = await client.from("story_slides").update({
          sort_order: sortOrder,
          media_url: mediaUrl,
          duration_seconds: durationSeconds,
          action_type: actionType,
          action_payload: actionPayload,
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        }).eq("id", s.id).eq("campaign_id", id);
        if (u) {
          console.error("update slide:", u);
          throw createError({ statusCode: 500, statusMessage: "Failed to update slide" });
        }
      } else {
        const { error: ins } = await client.from("story_slides").insert({
          campaign_id: id,
          sort_order: sortOrder,
          media_url: mediaUrl,
          duration_seconds: durationSeconds,
          action_type: actionType,
          action_payload: actionPayload
        });
        if (ins) {
          console.error("insert slide:", ins);
          throw createError({ statusCode: 500, statusMessage: "Failed to insert slide" });
        }
      }
      idx++;
    }
  }
  return { ok: true };
});
function normalizeActionType$1(raw) {
  const s = typeof raw === "string" ? raw : "none";
  if (["add_to_cart", "apply_promo", "open_category", "none"].includes(s)) return s;
  return "none";
}

const _id__put$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__put
}, Symbol.toStringTag, { value: 'Module' }));

const index_get = defineEventHandler(async (event) => {
  var _a;
  const access = await requireDashboardAccess(event);
  const client = await serverSupabaseServiceRole(event);
  const { data: campaigns, error } = await client.from("story_campaigns").select("id, title, preview_url, placement, is_active, valid_from, valid_until, targeting, created_at").eq("shop_id", access.shopId).order("created_at", { ascending: false });
  if (error) {
    console.error("dashboard stories campaigns list:", error);
    throw createError({ statusCode: 500, statusMessage: "Failed to load story campaigns" });
  }
  const ids = (campaigns != null ? campaigns : []).map((c) => c.id);
  const slideCountByCampaign = /* @__PURE__ */ new Map();
  if (ids.length) {
    const { data: slides, error: sErr } = await client.from("story_slides").select("campaign_id").in("campaign_id", ids);
    if (sErr) {
      console.error("dashboard stories slides:", sErr);
      throw createError({ statusCode: 500, statusMessage: "Failed to load story slides" });
    }
    for (const s of slides != null ? slides : []) {
      const cid = s.campaign_id;
      slideCountByCampaign.set(cid, ((_a = slideCountByCampaign.get(cid)) != null ? _a : 0) + 1);
    }
  }
  return {
    ok: true,
    items: (campaigns != null ? campaigns : []).map((row) => {
      var _a2, _b;
      return {
        id: row.id,
        title: row.title,
        previewUrl: row.preview_url,
        placement: row.placement,
        isActive: row.is_active,
        validFrom: row.valid_from,
        validUntil: row.valid_until,
        targeting: (_a2 = row.targeting) != null ? _a2 : {},
        createdAt: row.created_at,
        slides: Array.from({ length: (_b = slideCountByCampaign.get(row.id)) != null ? _b : 0 }, () => ({}))
      };
    })
  };
});

const index_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_get
}, Symbol.toStringTag, { value: 'Module' }));

const index_post = defineEventHandler(async (event) => {
  var _a, _b;
  const access = await requireDashboardAccess(event);
  const client = await serverSupabaseServiceRole(event);
  const body = await readBody(event);
  const title = typeof (body == null ? void 0 : body.title) === "string" ? body.title.trim() : "";
  if (!title) {
    throw createError({ statusCode: 400, statusMessage: "title is required" });
  }
  const placement = (body == null ? void 0 : body.placement) === "catalog_grid" ? "catalog_grid" : "top_bar";
  const previewUrl = typeof (body == null ? void 0 : body.previewUrl) === "string" && body.previewUrl.trim() ? body.previewUrl.trim() : null;
  const isActive = (body == null ? void 0 : body.isActive) !== false;
  const validFrom = (_a = body == null ? void 0 : body.validFrom) != null ? _a : null;
  const validUntil = (_b = body == null ? void 0 : body.validUntil) != null ? _b : null;
  const targeting = (body == null ? void 0 : body.targeting) && typeof body.targeting === "object" ? body.targeting : {};
  const { data: campaign, error: insErr } = await client.from("story_campaigns").insert({
    shop_id: access.shopId,
    title,
    preview_url: previewUrl,
    placement,
    is_active: isActive,
    valid_from: validFrom,
    valid_until: validUntil,
    targeting
  }).select("id").single();
  if (insErr || !(campaign == null ? void 0 : campaign.id)) {
    console.error("create story campaign:", insErr);
    throw createError({ statusCode: 500, statusMessage: "Failed to create campaign" });
  }
  const campaignId = campaign.id;
  const slidesInput = Array.isArray(body == null ? void 0 : body.slides) ? body.slides : [];
  if (slidesInput.length) {
    const rows = slidesInput.map((s, idx) => ({
      campaign_id: campaignId,
      sort_order: typeof s.sortOrder === "number" ? s.sortOrder : idx,
      media_url: typeof s.mediaUrl === "string" ? s.mediaUrl.trim() : "",
      duration_seconds: typeof s.durationSeconds === "number" && s.durationSeconds >= 1 ? Math.min(120, s.durationSeconds) : 5,
      action_type: normalizeActionType(s.actionType),
      action_payload: s.actionPayload && typeof s.actionPayload === "object" ? s.actionPayload : {}
    }));
    const { error: slideErr } = await client.from("story_slides").insert(rows);
    if (slideErr) {
      await client.from("story_campaigns").delete().eq("id", campaignId);
      console.error("create story slides:", slideErr);
      throw createError({ statusCode: 500, statusMessage: "Failed to create slides" });
    }
  }
  return { ok: true, id: campaignId };
});
function normalizeActionType(raw) {
  const s = typeof raw === "string" ? raw : "none";
  if (["add_to_cart", "apply_promo", "open_category", "none"].includes(s)) return s;
  return "none";
}

const index_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_post
}, Symbol.toStringTag, { value: 'Module' }));

const ALLOWED_MIME$1 = /* @__PURE__ */ new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "video/mp4",
  "video/webm",
  "video/quicktime"
]);
const MAX_SIZE_BYTES$1 = 8 * 1024 * 1024;
function sanitizeFileName$1(input) {
  const cleaned = input.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-80) || "upload";
  return cleaned.replace(/\.[a-zA-Z0-9]+$/, "");
}
function getExtension$1(fileName, mimeType) {
  var _a;
  const fromName = (_a = fileName.split(".").pop()) == null ? void 0 : _a.toLowerCase();
  if (fromName && /^[a-z0-9]+$/.test(fromName)) return fromName;
  if (mimeType === "image/jpeg") return "jpg";
  if (mimeType === "image/png") return "png";
  if (mimeType === "image/webp") return "webp";
  if (mimeType === "video/mp4") return "mp4";
  if (mimeType === "video/webm") return "webm";
  if (mimeType === "video/quicktime") return "mov";
  return "bin";
}
const media_upload_post = defineEventHandler(async (event) => {
  const access = await requireDashboardAccess(event);
  const body = await readBody(event);
  if (!(body == null ? void 0 : body.mimeType) || !body.dataBase64 || !body.fileName) {
    throw createError({
      statusCode: 400,
      statusMessage: "fileName, mimeType and dataBase64 are required"
    });
  }
  if (!ALLOWED_MIME$1.has(body.mimeType)) {
    throw createError({ statusCode: 400, statusMessage: "Unsupported media type" });
  }
  const bytes = Buffer.from(body.dataBase64, "base64");
  if (!bytes.byteLength || bytes.byteLength > MAX_SIZE_BYTES$1) {
    throw createError({ statusCode: 400, statusMessage: "File too large (max 8MB)" });
  }
  const extension = getExtension$1(body.fileName, body.mimeType);
  const safeName = sanitizeFileName$1(body.fileName);
  const sub = body.kind === "preview" ? "stories/preview" : "stories/slides";
  const objectPath = `${access.shopId}/${sub}/${Date.now()}-${safeName}.${extension}`;
  const client = await serverSupabaseServiceRole(event);
  const upload = await client.storage.from("organization-media").upload(objectPath, bytes, {
    contentType: body.mimeType,
    upsert: true
  });
  if (upload.error) {
    throw createError({ statusCode: 500, statusMessage: upload.error.message || "Upload failed" });
  }
  const publicUrl = client.storage.from("organization-media").getPublicUrl(objectPath).data.publicUrl;
  return {
    ok: true,
    url: publicUrl,
    path: objectPath
  };
});

const media_upload_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: media_upload_post
}, Symbol.toStringTag, { value: 'Module' }));

const achievements_get = defineEventHandler(async (event) => {
  const festivalSlug = getRouterParam(event, "festival_slug");
  const client = await serverSupabaseClient(event);
  const serviceClient = await serverSupabaseServiceRole(event);
  const user = await serverSupabaseUser(event);
  if (!festivalSlug) {
    return { ok: false, error: "Festival slug is required" };
  }
  const { data: festival, error: festivalError } = await serviceClient.from("festivals").select("id").eq("slug", festivalSlug).single();
  if (festivalError || !festival) {
    return { ok: false, error: "Festival not found" };
  }
  const { data: achievements, error: achError } = await serviceClient.from("festival_achievements").select("*").eq("festival_id", festival.id).order("created_at", { ascending: true });
  if (achError || !achievements) {
    return { ok: false, error: "Could not fetch achievements" };
  }
  let userProgress = {};
  if (user) {
    const { data: progress, error: progError } = await client.from("user_festival_achievements").select("*").eq("user_id", user.id);
    if (!progError && progress) {
      userProgress = progress.reduce((acc, curr) => {
        acc[curr.achievement_id] = curr;
        return acc;
      }, {});
    }
  }
  const result = achievements.map((ach) => {
    const prog = userProgress[ach.id];
    return {
      id: ach.id,
      code: ach.code,
      title: ach.title,
      description: ach.description,
      maxProgress: ach.max_progress,
      points: ach.points,
      iconUrl: ach.icon_url,
      progress: prog ? prog.progress : 0,
      isCompleted: prog ? prog.is_completed : false,
      completedAt: prog ? prog.completed_at : null
    };
  });
  return {
    ok: true,
    items: result
  };
});

const achievements_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: achievements_get
}, Symbol.toStringTag, { value: 'Module' }));

const CATEGORIES = /* @__PURE__ */ new Set(["live", "food", "stage", "vibe", "quest"]);
const reviews_post$2 = defineEventHandler(async (event) => {
  var _a;
  const festivalSlug = getRouterParam(event, "festival_slug");
  if (!festivalSlug) {
    throw createError({ statusCode: 400, statusMessage: "festival_slug is required" });
  }
  const body = await readBody(event).catch(() => ({}));
  const kind = body.kind === "story" ? "story" : "video_review";
  const rating = typeof body.rating === "number" ? Math.round(body.rating) : null;
  if (kind === "video_review" && (rating == null || rating < 1 || rating > 5)) {
    throw createError({ statusCode: 400, statusMessage: "rating from 1 to 5 is required for video_review" });
  }
  if (!body.mediaUrl || !body.mediaUrl.trim()) {
    throw createError({ statusCode: 400, statusMessage: "mediaUrl is required" });
  }
  if (body.category && !CATEGORIES.has(body.category)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid category" });
  }
  const { shopId } = await requireTenantShop(event);
  const festival = await resolveFestivalOrThrow(event, festivalSlug);
  const identity = await resolveCustomerIdentityOrThrow(event);
  const client = await serverSupabaseServiceRole(event);
  const isBanned = await isCustomerBannedForFestival(client, {
    festivalId: festival.id,
    shopId,
    profileId: identity.profileId,
    telegramId: identity.telegramId,
    maxUserId: identity.maxUserId
  });
  if (isBanned) {
    throw createError({ statusCode: 403, statusMessage: "UGC is blocked for this account" });
  }
  const eligibleOrders = await loadEligibleFestivalOrders(client, {
    profileId: identity.profileId,
    festivalId: festival.id,
    shopId,
    limit: 50
  });
  if (!eligibleOrders.length) {
    throw createError({ statusCode: 403, statusMessage: "Purchase is required before posting" });
  }
  let selectedOrder = eligibleOrders[0];
  if (body.orderId) {
    const hit = eligibleOrders.find((x) => String(x.id) === body.orderId);
    if (!hit) {
      throw createError({ statusCode: 400, statusMessage: "orderId is not eligible" });
    }
    selectedOrder = hit;
  }
  if (kind === "video_review" && !body.orderId) {
    throw createError({ statusCode: 400, statusMessage: "orderId is required for video_review" });
  }
  const { data: modChat } = await client.from("festival_moderation_chats").select("telegram_chat_id,max_chat_id").eq("festival_id", festival.id).eq("shop_id", shopId).eq("is_active", true).maybeSingle();
  const moderationChannel = (modChat == null ? void 0 : modChat.telegram_chat_id) ? "telegram" : (modChat == null ? void 0 : modChat.max_chat_id) ? "max" : null;
  const moderationChatId = moderationChannel === "telegram" ? String((modChat == null ? void 0 : modChat.telegram_chat_id) || "") : moderationChannel === "max" ? String((modChat == null ? void 0 : modChat.max_chat_id) || "") : null;
  const payload = {
    festival_id: festival.id,
    shop_id: shopId,
    restaurant_id: (selectedOrder == null ? void 0 : selectedOrder.restaurant_id) || null,
    order_id: kind === "video_review" ? String(selectedOrder.id) : null,
    order_item_payload: body.orderItemPayload && typeof body.orderItemPayload === "object" ? body.orderItemPayload : {},
    author_profile_id: identity.profileId,
    author_telegram_id: identity.telegramId,
    author_max_user_id: identity.maxUserId,
    kind,
    rating,
    category: body.category || null,
    media_url: body.mediaUrl.trim(),
    media_path: ((_a = body.mediaPath) == null ? void 0 : _a.trim()) || null,
    status: "pending",
    publish_to_menu: false,
    publish_to_feed: false,
    moderation_channel: moderationChannel,
    moderation_chat_id: moderationChatId
  };
  const { data, error } = await client.from("festival_ugc_submissions").insert(payload).select("id,festival_id,shop_id,restaurant_id,order_id,kind,rating,category,status,created_at,moderation_channel,moderation_chat_id").single();
  if (error || !data) {
    throw createError({ statusCode: 500, statusMessage: (error == null ? void 0 : error.message) || "Failed to create review" });
  }
  await client.from("festival_ugc_moderation_events").insert({
    submission_id: data.id,
    festival_id: festival.id,
    shop_id: shopId,
    action: "tag_category",
    action_payload: { initial: true, category: body.category || null, kind },
    actor_channel: "dashboard",
    actor_user_id: identity.profileId
  });
  await sendFestivalSubmissionToModeration(event, String(data.id)).catch((err) => {
    console.error("festival reviews: failed to send moderation message", err);
  });
  return { ok: true, item: data };
});

const reviews_post$3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: reviews_post$2
}, Symbol.toStringTag, { value: 'Module' }));

const ugc_get = defineEventHandler(async (event) => {
  const festivalSlug = getRouterParam(event, "festival_slug");
  if (!festivalSlug) {
    throw createError({ statusCode: 400, statusMessage: "festival_slug is required" });
  }
  const query = getQuery$1(event);
  const category = typeof query.category === "string" && query.category.trim() ? query.category.trim().toLowerCase() : "all";
  const limit = Math.min(Math.max(Number(query.limit) || 40, 1), 100);
  const shopId = typeof query.shop_id === "string" && query.shop_id.trim() ? query.shop_id.trim() : null;
  const festival = await resolveFestivalOrThrow(event, festivalSlug);
  const client = await serverSupabaseServiceRole(event);
  let dbQuery = client.from("festival_ugc_submissions").select("id,shop_id,restaurant_id,order_id,kind,rating,category,media_url,order_item_payload,status,publish_to_menu,publish_to_feed,created_at").eq("festival_id", festival.id).in("status", ["approved_feed", "approved_menu_and_feed"]).eq("publish_to_feed", true).order("created_at", { ascending: false }).limit(limit);
  if (shopId) {
    dbQuery = dbQuery.eq("shop_id", shopId);
  }
  if (category !== "all") {
    dbQuery = dbQuery.eq("category", category);
  }
  const { data, error } = await dbQuery;
  if (error) {
    throw createError({ statusCode: 500, statusMessage: "Failed to load festival UGC feed" });
  }
  const items = (data != null ? data : []).map((x) => ({
    id: String(x.id),
    kind: x.kind === "story" ? "story" : "video_review",
    rating: typeof x.rating === "number" ? x.rating : null,
    category: x.category || null,
    mediaUrl: String(x.media_url || ""),
    orderItemPayload: x.order_item_payload && typeof x.order_item_payload === "object" ? x.order_item_payload : {},
    shopId: String(x.shop_id || ""),
    restaurantId: x.restaurant_id ? String(x.restaurant_id) : null,
    orderId: x.order_id ? String(x.order_id) : null,
    createdAt: String(x.created_at || "")
  }));
  return {
    ok: true,
    festivalId: festival.id,
    category,
    items
  };
});

const ugc_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: ugc_get
}, Symbol.toStringTag, { value: 'Module' }));

const eligibility_get = defineEventHandler(async (event) => {
  const festivalSlug = getRouterParam(event, "festival_slug");
  if (!festivalSlug) {
    throw createError({ statusCode: 400, statusMessage: "festival_slug is required" });
  }
  const { shopId } = await requireTenantShop(event);
  const festival = await resolveFestivalOrThrow(event, festivalSlug);
  const identity = await resolveCustomerIdentityOrThrow(event);
  const client = await serverSupabaseServiceRole(event);
  const isBanned = await isCustomerBannedForFestival(client, {
    festivalId: festival.id,
    shopId,
    profileId: identity.profileId,
    telegramId: identity.telegramId,
    maxUserId: identity.maxUserId
  });
  if (isBanned) {
    return {
      ok: true,
      festivalId: festival.id,
      profileId: identity.profileId,
      canPostStory: false,
      canPostReview: false,
      reason: "banned",
      ordersForReview: []
    };
  }
  const orders = await loadEligibleFestivalOrders(client, {
    profileId: identity.profileId,
    festivalId: festival.id,
    shopId,
    limit: 30
  });
  const canPostStory = orders.length > 0;
  const ordersForReview = orders.map((x) => {
    var _a;
    return {
      id: String(x.id),
      orderNumber: String(x.order_number || x.id),
      restaurantId: String(x.restaurant_id || ""),
      restaurantName: String(((_a = x.restaurants) == null ? void 0 : _a.name) || "\u041A\u043E\u0440\u043D\u0435\u0440"),
      createdAt: String(x.created_at || ""),
      items: Array.isArray(x.items) ? x.items : []
    };
  });
  return {
    ok: true,
    festivalId: festival.id,
    profileId: identity.profileId,
    canPostStory,
    canPostReview: ordersForReview.length > 0,
    ordersForReview
  };
});

const eligibility_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: eligibility_get
}, Symbol.toStringTag, { value: 'Module' }));

const ALLOWED_MIME = /* @__PURE__ */ new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "image/jpeg",
  "image/png",
  "image/webp"
]);
const MAX_SIZE_BYTES = 20 * 1024 * 1024;
function sanitizeFileName(input) {
  const cleaned = input.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-80) || "upload";
  return cleaned.replace(/\.[a-zA-Z0-9]+$/, "");
}
function getExtension(fileName, mimeType) {
  var _a;
  const fromName = (_a = fileName.split(".").pop()) == null ? void 0 : _a.toLowerCase();
  if (fromName && /^[a-z0-9]+$/.test(fromName)) return fromName;
  if (mimeType === "video/mp4") return "mp4";
  if (mimeType === "video/webm") return "webm";
  if (mimeType === "video/quicktime") return "mov";
  if (mimeType === "image/jpeg") return "jpg";
  if (mimeType === "image/png") return "png";
  if (mimeType === "image/webp") return "webp";
  return "bin";
}
const upload_post = defineEventHandler(async (event) => {
  const festivalSlug = getRouterParam(event, "festival_slug");
  if (!festivalSlug) {
    throw createError({ statusCode: 400, statusMessage: "festival_slug is required" });
  }
  const body = await readBody(event).catch(() => ({}));
  if (!(body == null ? void 0 : body.fileName) || !(body == null ? void 0 : body.mimeType) || !(body == null ? void 0 : body.dataBase64)) {
    throw createError({ statusCode: 400, statusMessage: "fileName, mimeType and dataBase64 are required" });
  }
  if (!ALLOWED_MIME.has(body.mimeType)) {
    throw createError({ statusCode: 400, statusMessage: "Unsupported media type" });
  }
  const bytes = Buffer.from(body.dataBase64, "base64");
  if (!bytes.byteLength || bytes.byteLength > MAX_SIZE_BYTES) {
    throw createError({ statusCode: 400, statusMessage: "File too large (max 20MB)" });
  }
  const { shopId } = await requireTenantShop(event);
  const festival = await resolveFestivalOrThrow(event, festivalSlug);
  const identity = await resolveCustomerIdentityOrThrow(event);
  const client = await serverSupabaseServiceRole(event);
  const extension = getExtension(body.fileName, body.mimeType);
  const safeName = sanitizeFileName(body.fileName);
  const objectPath = `${shopId}/festival/${festival.id}/ugc/${identity.profileId}/${Date.now()}-${safeName}.${extension}`;
  const upload = await client.storage.from("organization-media").upload(objectPath, bytes, {
    contentType: body.mimeType,
    upsert: true
  });
  if (upload.error) {
    throw createError({ statusCode: 500, statusMessage: upload.error.message || "Upload failed" });
  }
  const publicUrl = client.storage.from("organization-media").getPublicUrl(objectPath).data.publicUrl;
  return { ok: true, url: publicUrl, path: objectPath, mimeType: body.mimeType };
});

const upload_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: upload_post
}, Symbol.toStringTag, { value: 'Module' }));

const cache = /* @__PURE__ */ new Map();
const MAX_CACHE = 800;
const inFlight = /* @__PURE__ */ new Map();
const NOMINATIM_UA = "TeleShop/1.0 (city aggregator; +https://pocketmenu.ru)";
function cacheKey(fullQuery) {
  return fullQuery.trim().toLowerCase();
}
function trimCache() {
  if (cache.size <= MAX_CACHE) return;
  const drop = Math.floor(cache.size / 2);
  let i = 0;
  for (const k of cache.keys()) {
    cache.delete(k);
    i++;
    if (i >= drop) break;
  }
}
async function fetchNominatim(fullQuery) {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "1");
  url.searchParams.set("q", fullQuery);
  const res = await fetch(url.toString(), {
    headers: {
      "User-Agent": NOMINATIM_UA,
      Accept: "application/json"
    }
  });
  if (!res.ok) {
    return null;
  }
  const data = await res.json();
  const first = Array.isArray(data) ? data[0] : null;
  if (!first) return null;
  const lat = Number(first.lat);
  const lon = Number(first.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  return { lat, lon };
}
const geocode_get = defineEventHandler(async (event) => {
  const q = getQuery$1(event);
  const raw = typeof q.q === "string" ? q.q.trim() : "";
  if (!raw) {
    throw createError({ statusCode: 400, statusMessage: "q is required" });
  }
  const city = typeof q.city === "string" ? q.city.trim() : "";
  const fullQuery = city ? `${raw}, ${city}` : raw;
  const key = cacheKey(fullQuery);
  const hit = cache.get(key);
  if (hit) {
    return { ok: true, lat: hit.lat, lon: hit.lon, cached: true };
  }
  const pending = inFlight.get(key);
  if (pending) {
    const coords2 = await pending;
    if (!coords2) {
      return { ok: false, error: "not_found" };
    }
    return { ok: true, lat: coords2.lat, lon: coords2.lon, cached: true };
  }
  const promise = (async () => {
    try {
      const coords2 = await fetchNominatim(fullQuery);
      if (coords2) {
        trimCache();
        cache.set(key, coords2);
      }
      return coords2;
    } finally {
      inFlight.delete(key);
    }
  })();
  inFlight.set(key, promise);
  const coords = await promise;
  if (!coords) {
    return { ok: false, error: "not_found" };
  }
  return { ok: true, lat: coords.lat, lon: coords.lon, cached: false };
});

const geocode_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: geocode_get
}, Symbol.toStringTag, { value: 'Module' }));

const platformCities_get = defineEventHandler(async (event) => {
  const client = await serverSupabaseServiceRole(event);
  const { data, error } = await client.from("cities").select("id,name,slug,is_active,created_at").order("name", { ascending: true });
  if (error) {
    console.error("Failed to load platform cities:", error);
    throw createError({ statusCode: 500, statusMessage: "Failed to load cities" });
  }
  const rows = data != null ? data : [];
  return {
    ok: true,
    items: rows.map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      isActive: row.is_active,
      createdAt: row.created_at
    }))
  };
});

const platformCities_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: platformCities_get
}, Symbol.toStringTag, { value: 'Module' }));

const reviews_get = defineEventHandler(async (event) => {
  const query = getQuery$1(event);
  const restaurantId = typeof query.restaurant_id === "string" && query.restaurant_id.trim() ? query.restaurant_id.trim() : "";
  const shopRef = typeof query.shop_id === "string" ? query.shop_id.trim() : "";
  const limit = parseListLimit(query.limit, 20, 50);
  let shopId = "";
  if (shopRef) {
    const shop = await getShopById(event, shopRef);
    if (!shop) throw createError({ statusCode: 404, statusMessage: "Shop not found" });
    shopId = shop.id;
  } else {
    const tenant = await requireTenantShop(event);
    shopId = tenant.shopId;
  }
  const moduleEnabled = await isShopFeatureEnabled(event, shopId, "reputation_reviews_pro");
  if (!moduleEnabled) {
    return {
      ok: true,
      moduleEnabled: false,
      items: [],
      rating: {
        public_rating: null,
        sample_count: 0,
        formula: "\u0420\u0435\u0439\u0442\u0438\u043D\u0433 \u0440\u0430\u0441\u0441\u0447\u0438\u0442\u0430\u043D \u043F\u043E \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u043C 20 \u043E\u043F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u043D\u043D\u044B\u043C \u043E\u0442\u0437\u044B\u0432\u0430\u043C"
      }
    };
  }
  const client = await serverSupabaseServiceRole(event);
  let reviewsQuery = client.from("shop_reviews").select("id,shop_id,restaurant_id,rating,comment,video_url,published_at,created_at").eq("shop_id", shopId).eq("status", "published").order("published_at", { ascending: false }).limit(limit);
  if (restaurantId) {
    reviewsQuery = reviewsQuery.eq("restaurant_id", restaurantId);
  }
  const { data, error } = await reviewsQuery;
  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message || "Failed to load reviews" });
  }
  const items = (data != null ? data : []).map((x) => ({
    id: String(x.id),
    rating: Number(x.rating || 0),
    comment: typeof x.comment === "string" ? x.comment : null,
    videoUrl: typeof x.video_url === "string" ? x.video_url : null,
    publishedAt: String(x.published_at || x.created_at || "")
  }));
  const ratingAgg = await computePublicRating(event, {
    shopId,
    restaurantId: restaurantId || null,
    sampleLimit: 20
  });
  return {
    ok: true,
    moduleEnabled: true,
    items,
    rating: ratingAgg
  };
});

const reviews_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: reviews_get
}, Symbol.toStringTag, { value: 'Module' }));

const reviews_patch = defineEventHandler(async (event) => {
  const body = await readBody(event).catch(() => ({}));
  const orderId = typeof body.orderId === "string" ? body.orderId.trim() : "";
  const rating = Number(body.rating || 0);
  if (!orderId) throw createError({ statusCode: 400, statusMessage: "orderId is required" });
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    throw createError({ statusCode: 400, statusMessage: "rating from 1 to 5 is required" });
  }
  const { shopId } = await requireTenantShop(event);
  await requireReviewsFeature(event, shopId);
  const identity = await resolveReviewIdentity(event);
  const order = await requireOwnedOrderForReview(event, { shopId, orderId, identity });
  const review = await updateShopReviewRating(event, {
    shopId,
    order: { id: order.id, shop_id: order.shop_id, restaurant_id: order.restaurant_id },
    identity,
    rating,
    actorChannel: identity.maxUserId ? "max" : identity.telegramId ? "telegram" : "system"
  });
  return { ok: true, item: review };
});

const reviews_patch$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: reviews_patch
}, Symbol.toStringTag, { value: 'Module' }));

const reviews_post = defineEventHandler(async (event) => {
  const body = await readBody(event).catch(() => ({}));
  const orderId = typeof body.orderId === "string" ? body.orderId.trim() : "";
  const rating = Number(body.rating || 0);
  if (!orderId) throw createError({ statusCode: 400, statusMessage: "orderId is required" });
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    throw createError({ statusCode: 400, statusMessage: "rating from 1 to 5 is required" });
  }
  const { shopId } = await requireTenantShop(event);
  await requireReviewsFeature(event, shopId);
  const identity = await resolveReviewIdentity(event);
  const order = await requireOwnedOrderForReview(event, { shopId, orderId, identity });
  const review = await insertShopReview(event, {
    shopId,
    order: { id: order.id, shop_id: order.shop_id, restaurant_id: order.restaurant_id },
    identity,
    rating,
    comment: body.comment,
    videoUrl: body.videoUrl,
    actorChannel: "system"
  });
  return { ok: true, item: review };
});

const reviews_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: reviews_post
}, Symbol.toStringTag, { value: 'Module' }));

function normalizeRestaurants(raw) {
  if (!raw) return [];
  const list = Array.isArray(raw) ? raw : [raw];
  return list.filter((r) => !!r && typeof r === "object" && typeof r.id === "string").map((r) => ({
    ...r,
    supports_dine_in: Boolean(r.supports_dine_in),
    festival_fulfillment_type: ["delivery", "pickup", "dine-in"].includes(String(r.festival_fulfillment_type)) ? r.festival_fulfillment_type : null
  }));
}
const shops_get = defineEventHandler(async (event) => {
  var _a, _b, _c, _d;
  setResponseHeader(event, "Cache-Control", "public, max-age=30, s-maxage=60, stale-while-revalidate=120");
  const query = getQuery$1(event);
  const config = useRuntimeConfig(event);
  const requestedCitySlug = typeof query.city_slug === "string" ? query.city_slug.trim() : "";
  const requestedFestivalSlug = typeof query.festival_slug === "string" ? query.festival_slug.trim() : "";
  const defaultCitySlug = typeof ((_a = config.public) == null ? void 0 : _a.defaultCitySlug) === "string" ? config.public.defaultCitySlug.trim() : "";
  const citySlug = requestedCitySlug || defaultCitySlug;
  if (!citySlug) {
    throw createError({ statusCode: 400, message: "city_slug is required" });
  }
  const client = await serverSupabaseServiceRole(event);
  const { data: cityData, error: cityError } = await client.from("cities").select("id").eq("slug", citySlug).eq("is_active", true).maybeSingle();
  if (cityError) {
    console.error("Failed to resolve city slug:", cityError);
    throw createError({ statusCode: 500, message: "Failed to resolve city" });
  }
  if (!(cityData == null ? void 0 : cityData.id)) {
    return { ok: true, items: [] };
  }
  const cityId = cityData.id;
  let activeFestival = null;
  const nowTs = Date.now();
  const { data: festivalRows, error: festivalError } = await client.from("festivals").select("id,slug,name,description,pulse_stats,schedule,starts_at,ends_at").eq("city_id", cityId).eq("is_active", true).order("created_at", { ascending: false }).limit(10);
  if (festivalError) {
    console.error("Failed to resolve active festival:", festivalError);
  } else if (Array.isArray(festivalRows)) {
    const current = requestedFestivalSlug ? festivalRows.find((row) => typeof row.slug === "string" && row.slug.trim() === requestedFestivalSlug) : festivalRows.find((row) => {
      const startsAt = typeof row.starts_at === "string" ? Date.parse(row.starts_at) : NaN;
      const endsAt = typeof row.ends_at === "string" ? Date.parse(row.ends_at) : NaN;
      const startsOk = Number.isNaN(startsAt) || startsAt <= nowTs;
      const endsOk = Number.isNaN(endsAt) || endsAt >= nowTs;
      return startsOk && endsOk;
    });
    if (current == null ? void 0 : current.id) {
      activeFestival = current;
    }
  }
  let data = null;
  let error = null;
  const primary = await client.from("shops").select("id,slug,name,ui_settings,is_active,restaurants!restaurants_shop_id_fkey!inner(id,name,address,lat,lon,city_id,festival_id,is_festival,festival_fulfillment_type,is_active,supports_delivery,supports_pickup,supports_dine_in)").eq("is_active", true).eq("restaurants.city_id", cityId).eq("restaurants.is_active", true).order("name", { ascending: true });
  data = primary.data;
  error = primary.error;
  if (error && error.code === "42703") {
    const fallback = await client.from("shops").select("id,slug,name,ui_settings,is_active,restaurants!restaurants_shop_id_fkey!inner(id,name,address,lat,lon,city_id,is_active,supports_delivery,supports_pickup)").eq("is_active", true).eq("restaurants.city_id", cityId).eq("restaurants.is_active", true).order("name", { ascending: true });
    data = (_c = (_b = fallback.data) == null ? void 0 : _b.map((row) => ({
      ...row,
      restaurants: normalizeRestaurants(row.restaurants).map((r) => ({
        ...r,
        supports_dine_in: false,
        festival_fulfillment_type: null
      }))
    }))) != null ? _c : null;
    error = fallback.error;
  }
  if (!error && activeFestival) {
    data = (data != null ? data : []).map((row) => ({
      ...row,
      restaurants: normalizeRestaurants(row.restaurants).filter((r) => r.is_festival === true && r.festival_id === activeFestival.id)
    })).filter((row) => normalizeRestaurants(row.restaurants).length > 0);
  } else if (!error) {
    data = (data != null ? data : []).map((row) => ({
      ...row,
      restaurants: normalizeRestaurants(row.restaurants).filter((r) => r.is_festival !== true)
    })).filter((row) => normalizeRestaurants(row.restaurants).length > 0);
  }
  if (error) {
    console.error("Failed to load shops:", error);
    throw createError({ statusCode: 500, message: "Failed to load restaurants list" });
  }
  const rows = data != null ? data : [];
  const firstByShop = /* @__PURE__ */ new Map();
  const fulfillmentAgg = /* @__PURE__ */ new Map();
  for (const row of rows) {
    if (!firstByShop.has(row.id)) firstByShop.set(row.id, row);
    let agg = fulfillmentAgg.get(row.id);
    if (!agg) {
      agg = {
        hasDelivery: false,
        hasPickup: false,
        hasDineIn: false,
        pickupRestaurantIds: /* @__PURE__ */ new Set(),
        dineInRestaurantIds: /* @__PURE__ */ new Set(),
        pickupPoints: [],
        dineInPoints: []
      };
      fulfillmentAgg.set(row.id, agg);
    }
    for (const r of normalizeRestaurants(row.restaurants)) {
      const festivalMode = activeFestival ? r.festival_fulfillment_type : null;
      const supportsDelivery = festivalMode ? festivalMode === "delivery" : r.supports_delivery;
      const supportsPickup = festivalMode ? festivalMode === "pickup" : r.supports_pickup;
      const supportsDineIn = festivalMode ? festivalMode === "dine-in" : r.supports_dine_in;
      if (supportsDelivery) agg.hasDelivery = true;
      if (supportsPickup && !agg.pickupRestaurantIds.has(r.id)) {
        agg.pickupRestaurantIds.add(r.id);
        agg.hasPickup = true;
        agg.pickupPoints.push({
          restaurantId: r.id,
          name: r.name,
          address: r.address,
          lat: typeof r.lat === "number" && Number.isFinite(r.lat) ? r.lat : null,
          lon: typeof r.lon === "number" && Number.isFinite(r.lon) ? r.lon : null
        });
      }
      if (supportsDineIn && !agg.dineInRestaurantIds.has(r.id)) {
        agg.dineInRestaurantIds.add(r.id);
        agg.hasDineIn = true;
        agg.dineInPoints.push({
          restaurantId: r.id,
          name: r.name,
          address: r.address,
          lat: typeof r.lat === "number" && Number.isFinite(r.lat) ? r.lat : null,
          lon: typeof r.lon === "number" && Number.isFinite(r.lon) ? r.lon : null
        });
      }
    }
  }
  const uniqueRows = Array.from(firstByShop.values());
  const items = await Promise.all(uniqueRows.map(async (row) => {
    var _a2, _b2, _c2, _d2, _e, _f, _g, _h, _i, _j, _k, _l;
    const agg = fulfillmentAgg.get(row.id);
    let fulfillment = {
      delivery: Boolean(agg == null ? void 0 : agg.hasDelivery),
      pickup: Boolean(agg == null ? void 0 : agg.hasPickup),
      dineIn: Boolean(agg == null ? void 0 : agg.hasDineIn)
    };
    let pickupPoints = [];
    let dineInPoints = [];
    try {
      const org = await getOrganizationSettings(event, row.id);
      const modes = new Set(org.ops.fulfillmentTypes);
      fulfillment = {
        delivery: modes.has("delivery") && Boolean(agg == null ? void 0 : agg.hasDelivery),
        pickup: modes.has("pickup") && Boolean(agg == null ? void 0 : agg.hasPickup),
        dineIn: modes.has("dine-in") && Boolean(agg == null ? void 0 : agg.hasDineIn)
      };
      pickupPoints = fulfillment.pickup && ((_a2 = agg == null ? void 0 : agg.pickupPoints) == null ? void 0 : _a2.length) ? agg.pickupPoints : [];
      dineInPoints = fulfillment.dineIn && ((_b2 = agg == null ? void 0 : agg.dineInPoints) == null ? void 0 : _b2.length) ? agg.dineInPoints : [];
    } catch {
      pickupPoints = fulfillment.pickup && ((_c2 = agg == null ? void 0 : agg.pickupPoints) == null ? void 0 : _c2.length) ? agg.pickupPoints : [];
      dineInPoints = fulfillment.dineIn && ((_d2 = agg == null ? void 0 : agg.dineInPoints) == null ? void 0 : _d2.length) ? agg.dineInPoints : [];
    }
    try {
      const record = await getStyleRecord(event, row.id);
      const cfg = record.config;
      return {
        id: row.id,
        slug: row.slug,
        name: cfg.identity.name || row.name,
        logoUrl: cfg.identity.logoUrl || (typeof ((_e = row.ui_settings) == null ? void 0 : _e.logo_url) === "string" ? (_f = row.ui_settings) == null ? void 0 : _f.logo_url : null),
        description: cfg.identity.shortDescription || (typeof ((_g = row.ui_settings) == null ? void 0 : _g.description) === "string" ? (_h = row.ui_settings) == null ? void 0 : _h.description : null),
        fulfillment,
        pickupPoints,
        dineInPoints
      };
    } catch {
      return {
        id: row.id,
        slug: row.slug,
        name: row.name,
        logoUrl: typeof ((_i = row.ui_settings) == null ? void 0 : _i.logo_url) === "string" ? (_j = row.ui_settings) == null ? void 0 : _j.logo_url : null,
        description: typeof ((_k = row.ui_settings) == null ? void 0 : _k.description) === "string" ? (_l = row.ui_settings) == null ? void 0 : _l.description : null,
        fulfillment,
        pickupPoints,
        dineInPoints
      };
    }
  }));
  return {
    ok: true,
    items,
    festival: activeFestival ? {
      id: activeFestival.id,
      slug: activeFestival.slug,
      name: activeFestival.name,
      description: activeFestival.description,
      pulseStats: (_d = activeFestival.pulse_stats) != null ? _d : {},
      schedule: Array.isArray(activeFestival.schedule) ? activeFestival.schedule : []
    } : null
  };
});

const shops_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: shops_get
}, Symbol.toStringTag, { value: 'Module' }));

function normalizeUserId$1(raw) {
  if (!raw || typeof raw !== "object") return null;
  const o = raw;
  if (typeof o.id === "string" && o.id) return o.id;
  if (typeof o.sub === "string" && o.sub) return o.sub;
  return null;
}
const stories_get = defineEventHandler(async (event) => {
  const { shopId } = await requireTenantShop(event);
  const client = await serverSupabaseServiceRole(event);
  const supabaseUser = await serverSupabaseUser(event);
  const userId = normalizeUserId$1(supabaseUser);
  let viewer = {
    userId,
    gender: null,
    birthDate: null,
    ordersCount: 0,
    daysSinceLastOrder: null
  };
  if (userId) {
    const { data: profile } = await client.from("profiles").select("gender, birth_date").eq("id", userId).maybeSingle();
    const gender = profile && typeof profile.gender === "string" ? profile.gender : null;
    const birthDate = profile && profile.birth_date != null ? String(profile.birth_date).slice(0, 10) : null;
    const { count: orderCount } = await client.from("orders").select("*", { count: "exact", head: true }).eq("shop_id", shopId).eq("customer_profile_id", userId).neq("status", "cancelled");
    const { data: lastOrder } = await client.from("orders").select("created_at").eq("shop_id", shopId).eq("customer_profile_id", userId).neq("status", "cancelled").order("created_at", { ascending: false }).limit(1).maybeSingle();
    let daysSinceLastOrder = null;
    if (lastOrder == null ? void 0 : lastOrder.created_at) {
      const last = new Date(lastOrder.created_at);
      const now = /* @__PURE__ */ new Date();
      daysSinceLastOrder = Math.floor(
        (now.getTime() - last.getTime()) / (24 * 60 * 60 * 1e3)
      );
    }
    viewer = {
      userId,
      gender,
      birthDate,
      ordersCount: orderCount != null ? orderCount : 0,
      daysSinceLastOrder
    };
  }
  const nowIso = (/* @__PURE__ */ new Date()).toISOString();
  const { data: campaigns, error: campErr } = await client.from("story_campaigns").select(
    "id, shop_id, title, preview_url, placement, is_active, valid_from, valid_until, targeting, created_at"
  ).eq("shop_id", shopId).eq("is_active", true);
  if (campErr) {
    console.error("stories.get campaigns:", campErr);
    throw createError({ statusCode: 500, statusMessage: "Failed to load stories" });
  }
  const timeOk = (c) => {
    const row = c;
    const vf = row.valid_from;
    const vu = row.valid_until;
    if (vf && typeof vf === "string" && vf > nowIso) return false;
    if (vu && typeof vu === "string" && vu < nowIso) return false;
    return true;
  };
  const filtered = (campaigns != null ? campaigns : []).filter((c) => {
    if (!timeOk(c)) return false;
    const targeting = c.targeting;
    if (!userId) {
      return isTargetingEmpty(targeting);
    }
    return campaignMatchesTargeting(targeting, viewer);
  });
  const campaignIds = filtered.map((c) => c.id);
  if (campaignIds.length === 0) {
    const allowDemo = process.env.STORIES_DEMO === "1";
    if (allowDemo) {
      const demo = buildDemoStoryCampaigns();
      const topBar2 = demo.filter((c) => c.placement === "top_bar" && c.slides.length > 0);
      const catalogGrid2 = demo.filter((c) => c.placement === "catalog_grid" && c.slides.length > 0);
      return {
        ok: true,
        shopId,
        topBar: topBar2,
        catalogGrid: catalogGrid2,
        campaigns: demo
      };
    }
    return {
      ok: true,
      shopId,
      topBar: [],
      catalogGrid: [],
      campaigns: []
    };
  }
  const { data: slides, error: slideErr } = await client.from("story_slides").select(
    "id, campaign_id, sort_order, media_url, duration_seconds, action_type, action_payload"
  ).in("campaign_id", campaignIds).order("sort_order", { ascending: true });
  if (slideErr) {
    console.error("stories.get slides:", slideErr);
    throw createError({ statusCode: 500, statusMessage: "Failed to load story slides" });
  }
  const slidesByCampaign = /* @__PURE__ */ new Map();
  for (const s of slides != null ? slides : []) {
    const cid = s.campaign_id;
    if (!slidesByCampaign.has(cid)) slidesByCampaign.set(cid, []);
    slidesByCampaign.get(cid).push(s);
  }
  const mapSlide = (s) => {
    var _a;
    const actionPayload = (_a = s.action_payload) != null ? _a : {};
    const title = typeof actionPayload.title === "string" ? actionPayload.title : null;
    const text = typeof actionPayload.text === "string" ? actionPayload.text : null;
    return {
      id: s.id,
      campaignId: s.campaign_id,
      sortOrder: s.sort_order,
      mediaUrl: s.media_url || "",
      durationSeconds: s.duration_seconds,
      actionType: s.action_type,
      actionPayload,
      title,
      text
    };
  };
  const mapCampaign = (c) => {
    var _a, _b;
    const id = c.id;
    const rawSlides = (_a = slidesByCampaign.get(id)) != null ? _a : [];
    return {
      id,
      title: c.title,
      previewUrl: (_b = c.preview_url) != null ? _b : null,
      placement: c.placement,
      targeting: c.targeting,
      slides: rawSlides.map((x) => mapSlide(x))
    };
  };
  const mapped = filtered.map((c) => mapCampaign(c));
  const topBar = mapped.filter((c) => c.placement === "top_bar" && c.slides.length > 0);
  const catalogGrid = mapped.filter((c) => c.placement === "catalog_grid" && c.slides.length > 0);
  return {
    ok: true,
    shopId,
    topBar,
    catalogGrid,
    campaigns: mapped
  };
});

const stories_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: stories_get
}, Symbol.toStringTag, { value: 'Module' }));

function normalizeUserId(raw) {
  if (!raw || typeof raw !== "object") return null;
  const o = raw;
  if (typeof o.id === "string" && o.id) return o.id;
  if (typeof o.sub === "string" && o.sub) return o.sub;
  return null;
}
const views_post = defineEventHandler(async (event) => {
  const { shopId } = await requireTenantShop(event);
  const body = await readBody(event);
  const slideId = typeof (body == null ? void 0 : body.slideId) === "string" ? body.slideId.trim() : "";
  if (!slideId) {
    throw createError({ statusCode: 400, statusMessage: "slideId is required" });
  }
  const client = await serverSupabaseServiceRole(event);
  const supabaseUser = await serverSupabaseUser(event);
  const userId = normalizeUserId(supabaseUser);
  const { data: slideRow, error: slideErr } = await client.from("story_slides").select("id, campaign_id").eq("id", slideId).maybeSingle();
  if (slideErr || !slideRow) {
    throw createError({ statusCode: 404, statusMessage: "Slide not found" });
  }
  const { data: campaign, error: campErr } = await client.from("story_campaigns").select("id, shop_id").eq("id", slideRow.campaign_id).maybeSingle();
  if (campErr || !campaign || campaign.shop_id !== shopId) {
    throw createError({ statusCode: 400, statusMessage: "Invalid slide for this shop" });
  }
  const { error: insErr } = await client.from("story_views").insert({
    slide_id: slideId,
    user_id: userId,
    viewed_at: (/* @__PURE__ */ new Date()).toISOString()
  });
  if (insErr) {
    console.error("story_views insert:", insErr);
    throw createError({ statusCode: 500, statusMessage: "Failed to record view" });
  }
  return { ok: true };
});

const views_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: views_post
}, Symbol.toStringTag, { value: 'Module' }));

const tenant_get = defineEventHandler(async (event) => {
  var _a, _b, _c, _d;
  const query = getQuery$1(event);
  const branchId = typeof query.branch_id === "string" && query.branch_id.trim() ? query.branch_id.trim() : typeof query.restaurant_id === "string" && query.restaurant_id.trim() ? query.restaurant_id.trim() : null;
  const tenantFromContext = event.context.tenant;
  if (tenantFromContext) {
    const shopId2 = tenantFromContext.shopId;
    let uiSettings2 = (_a = tenantFromContext.uiSettings) != null ? _a : {};
    let shopName2 = (_c = (_b = tenantFromContext.shop) == null ? void 0 : _b.name) != null ? _c : "";
    const orgSettings2 = await getOrganizationSettings(event, shopId2);
    let effectiveWorkingHours2 = orgSettings2.ops.workingHours;
    try {
      const record = await getStyleRecord(event, shopId2);
      const cfg = record.config;
      const nextSmallLogo = typeof cfg.identity.logoSmallUrl === "string" ? cfg.identity.logoSmallUrl.trim() : "";
      const nextLargeLogo = typeof cfg.identity.logoLargeUrl === "string" ? cfg.identity.logoLargeUrl.trim() : "";
      const nextLogo = nextSmallLogo || (typeof cfg.identity.logoUrl === "string" ? cfg.identity.logoUrl.trim() : "");
      const nextDesc = typeof cfg.identity.shortDescription === "string" ? cfg.identity.shortDescription.trim() : "";
      const fallbackLogo = typeof (uiSettings2 == null ? void 0 : uiSettings2.logo_url) === "string" ? uiSettings2.logo_url : "";
      const fallbackDesc = typeof (uiSettings2 == null ? void 0 : uiSettings2.description) === "string" ? uiSettings2.description : "";
      uiSettings2 = {
        ...uiSettings2,
        // MVP: если identity не заполнена — не ломаем старые shops.ui_settings.
        logo_url: nextLogo || fallbackLogo,
        logo_large_url: nextLargeLogo || nextLogo || fallbackLogo,
        description: nextDesc || fallbackDesc,
        ...deriveTenantThemeFromStyle(cfg),
        // Радиусы пробрасываем в theme-систему CSS vars.
        radius_button: `${cfg.radii.button}px`,
        radius_modal: `${cfg.radii.modal}px`,
        radius_input: `${cfg.radii.input}px`,
        radius_card: `${cfg.radii.card}px`,
        organization_timezone: orgSettings2.locale.timezone,
        organization_working_hours: orgSettings2.ops.workingHours,
        organization_dine_in_staff_buttons: orgSettings2.ops.dineInStaffButtons,
        effective_working_hours: effectiveWorkingHours2
      };
      shopName2 = cfg.identity.name || shopName2;
    } catch {
    }
    if (branchId) {
      try {
        const client = await serverSupabaseServiceRole(event);
        const branchRes = await client.from("restaurants").select("use_organization_working_hours,working_hours").eq("shop_id", shopId2).eq("id", branchId).eq("is_active", true).maybeSingle();
        if (branchRes.data) {
          const branchWorkingHours = normalizeWeeklyWorkingHours(branchRes.data.working_hours, orgSettings2.ops.workingHours);
          effectiveWorkingHours2 = resolveEffectiveWorkingHours(orgSettings2.ops.workingHours, {
            useOrganizationHours: branchRes.data.use_organization_working_hours !== false,
            workingHours: branchWorkingHours
          });
          uiSettings2 = {
            ...uiSettings2,
            effective_working_hours: effectiveWorkingHours2
          };
        }
      } catch {
      }
    }
    uiSettings2 = {
      ...uiSettings2,
      organization_timezone: orgSettings2.locale.timezone,
      organization_working_hours: orgSettings2.ops.workingHours,
      organization_dine_in_staff_buttons: orgSettings2.ops.dineInStaffButtons,
      effective_working_hours: effectiveWorkingHours2
    };
    return {
      ok: true,
      shopId: shopId2,
      tenantSlug: tenantFromContext.shop.slug,
      isCustomDomain: !!tenantFromContext.isCustomDomain,
      shop: {
        id: tenantFromContext.shop.id,
        slug: tenantFromContext.shop.slug,
        name: shopName2,
        legalName: tenantFromContext.shop.legal_name || null,
        inn: tenantFromContext.shop.inn || null,
        ogrn: tenantFromContext.shop.ogrn || null
      },
      uiSettings: uiSettings2
    };
  }
  const { shopId, shop } = await requireTenantShop(event);
  let uiSettings = (_d = shop.ui_settings) != null ? _d : {};
  let shopName = shop.name;
  const orgSettings = await getOrganizationSettings(event, shopId);
  let effectiveWorkingHours = orgSettings.ops.workingHours;
  try {
    const record = await getStyleRecord(event, shopId);
    const cfg = record.config;
    const nextSmallLogo = typeof cfg.identity.logoSmallUrl === "string" ? cfg.identity.logoSmallUrl.trim() : "";
    const nextLargeLogo = typeof cfg.identity.logoLargeUrl === "string" ? cfg.identity.logoLargeUrl.trim() : "";
    const nextLogo = nextSmallLogo || (typeof cfg.identity.logoUrl === "string" ? cfg.identity.logoUrl.trim() : "");
    const nextDesc = typeof cfg.identity.shortDescription === "string" ? cfg.identity.shortDescription.trim() : "";
    const fallbackLogo = typeof (uiSettings == null ? void 0 : uiSettings.logo_url) === "string" ? uiSettings.logo_url : "";
    const fallbackDesc = typeof (uiSettings == null ? void 0 : uiSettings.description) === "string" ? uiSettings.description : "";
    uiSettings = {
      ...uiSettings,
      logo_url: nextLogo || fallbackLogo,
      logo_large_url: nextLargeLogo || nextLogo || fallbackLogo,
      description: nextDesc || fallbackDesc,
      ...deriveTenantThemeFromStyle(cfg),
      radius_button: `${cfg.radii.button}px`,
      radius_modal: `${cfg.radii.modal}px`,
      radius_input: `${cfg.radii.input}px`,
      radius_card: `${cfg.radii.card}px`,
      organization_timezone: orgSettings.locale.timezone,
      organization_working_hours: orgSettings.ops.workingHours,
      organization_dine_in_staff_buttons: orgSettings.ops.dineInStaffButtons,
      effective_working_hours: effectiveWorkingHours
    };
    shopName = cfg.identity.name || shopName;
  } catch {
  }
  if (branchId) {
    try {
      const client = await serverSupabaseServiceRole(event);
      const branchRes = await client.from("restaurants").select("use_organization_working_hours,working_hours").eq("shop_id", shopId).eq("id", branchId).eq("is_active", true).maybeSingle();
      if (branchRes.data) {
        const branchWorkingHours = normalizeWeeklyWorkingHours(branchRes.data.working_hours, orgSettings.ops.workingHours);
        effectiveWorkingHours = resolveEffectiveWorkingHours(orgSettings.ops.workingHours, {
          useOrganizationHours: branchRes.data.use_organization_working_hours !== false,
          workingHours: branchWorkingHours
        });
        uiSettings = {
          ...uiSettings,
          effective_working_hours: effectiveWorkingHours
        };
      }
    } catch {
    }
  }
  uiSettings = {
    ...uiSettings,
    organization_timezone: orgSettings.locale.timezone,
    organization_working_hours: orgSettings.ops.workingHours,
    organization_dine_in_staff_buttons: orgSettings.ops.dineInStaffButtons,
    effective_working_hours: effectiveWorkingHours
  };
  return {
    ok: true,
    shopId: shop.id,
    tenantSlug: shop.slug,
    isCustomDomain: false,
    shop: {
      id: shop.id,
      slug: shop.slug,
      name: shopName,
      legalName: shop.legal_name || null,
      inn: shop.inn || null,
      ogrn: shop.ogrn || null
    },
    uiSettings
  };
});
function hexToRgb(hex) {
  if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) return null;
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16)
  };
}
function mixHex(a, b, amount) {
  const aRgb = hexToRgb(a);
  const bRgb = hexToRgb(b);
  if (!aRgb || !bRgb) return a;
  const t = Math.max(0, Math.min(1, amount));
  const r = Math.round(aRgb.r * (1 - t) + bRgb.r * t);
  const g = Math.round(aRgb.g * (1 - t) + bRgb.g * t);
  const bl = Math.round(aRgb.b * (1 - t) + bRgb.b * t);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${bl.toString(16).padStart(2, "0")}`;
}
function derivePrimaryVariants(brandPrimary) {
  const primary = brandPrimary;
  return {
    primary,
    primary_50: mixHex(primary, "#ffffff", 0.85),
    primary_100: mixHex(primary, "#ffffff", 0.7),
    primary_600: mixHex(primary, "#000000", 0.25),
    primary_700: mixHex(primary, "#000000", 0.35)
  };
}
function deriveTenantThemeFromStyle(cfg) {
  return {
    ...derivePrimaryVariants(cfg.tokens.brandPrimary),
    on_primary: cfg.tokens.textOnPrimary,
    secondary: cfg.tokens.brandSecondary,
    accent: cfg.tokens.brandAccent,
    surface_background: cfg.tokens.surfaceBackground,
    surface_card: cfg.tokens.surfaceCard,
    text_primary: cfg.tokens.textPrimary,
    text_muted: cfg.tokens.textMuted,
    state_success: cfg.tokens.stateSuccess,
    state_warning: cfg.tokens.stateWarning,
    state_error: cfg.tokens.stateError
  };
}

const tenant_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: tenant_get
}, Symbol.toStringTag, { value: 'Module' }));

const cities_get = defineEventHandler(async (event) => {
  var _a;
  const tenantShopId = ((_a = event.context.tenant) == null ? void 0 : _a.shopId) || await resolveShopIdFromEvent(event);
  if (!tenantShopId) return { ok: true, items: [] };
  const client = await serverSupabaseServiceRole(event);
  const { data, error } = await client.from("restaurants").select("cities(id,name,slug)").eq("shop_id", tenantShopId).eq("is_active", true);
  if (error) {
    return { ok: true, items: [] };
  }
  const seen = /* @__PURE__ */ new Set();
  const items = [];
  for (const row of data != null ? data : []) {
    const city = row == null ? void 0 : row.cities;
    const slug = typeof (city == null ? void 0 : city.slug) === "string" ? city.slug.trim() : "";
    const id = typeof (city == null ? void 0 : city.id) === "string" ? city.id : "";
    const name = typeof (city == null ? void 0 : city.name) === "string" ? city.name : slug;
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);
    items.push({ id, name, slug });
  }
  return { ok: true, items };
});

const cities_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: cities_get
}, Symbol.toStringTag, { value: 'Module' }));

const resolveCanonical_get = defineEventHandler(async (event) => {
  const ref = await resolveShopIdFromEvent(event);
  if (!ref) {
    throw createError({ statusCode: 400, statusMessage: "Missing shop_id" });
  }
  const shop = await getShopById(event, ref);
  if (!shop || !shop.is_active) {
    throw createError({ statusCode: 404, statusMessage: "Shop not found" });
  }
  const canonical = await resolveCanonicalTenantCartPath(event, shop);
  return {
    ok: true,
    shopId: shop.id,
    citySlug: canonical.citySlug,
    tenantSlug: canonical.tenantSlug,
    cartPath: canonical.cartPath,
    checkoutPath: canonical.checkoutPath
  };
});

const resolveCanonical_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: resolveCanonical_get
}, Symbol.toStringTag, { value: 'Module' }));

function formatOrderRef$1(orderNumber, fallbackOrderId) {
  const raw = typeof orderNumber === "string" && orderNumber.trim() ? orderNumber.trim() : fallbackOrderId.trim();
  const normalized = raw.replace(/\s+/g, "");
  const short = normalized.length > 8 ? normalized.slice(0, 8) : normalized;
  return `#${short || "\u2014"}`;
}
function extractStartPayload(update) {
  var _a, _b, _c;
  const direct = typeof update.payload === "string" && update.payload.trim() ? update.payload.trim() : typeof update.start_payload === "string" && update.start_payload.trim() ? update.start_payload.trim() : "";
  if (direct) return direct;
  const text = typeof ((_b = (_a = update.message) == null ? void 0 : _a.body) == null ? void 0 : _b.text) === "string" ? update.message.body.text.trim() : "";
  if (!text) return "";
  const match = /^\/start(?:@\S+)?\s+(.+)$/i.exec(text);
  return ((_c = match == null ? void 0 : match[1]) == null ? void 0 : _c.trim()) || "";
}
function parseNumericId(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value.trim());
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}
function normalizeNonEmptyId(value) {
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (typeof value === "string" && value.trim()) return value.trim();
  return null;
}
function normalizeAuthTokenUuid(raw) {
  var _a, _b;
  const t = raw.trim();
  if (!t) return null;
  const plain = (_b = (_a = /^([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i.exec(t)) == null ? void 0 : _a[1]) != null ? _b : null;
  return plain ? plain.toLowerCase() : null;
}
function parseMaxBindToken(text) {
  const trimmed = text.trim();
  const [first = "", second = ""] = trimmed.split(/\s+/, 2);
  const command = first.toLowerCase();
  if (command === "bindmax" || command === "/bindmax" || command.startsWith("/bindmax@")) {
    return second ? second.trim() : null;
  }
  if (command.startsWith("bindmax_")) {
    const token = first.slice("bindmax_".length);
    return token ? token.trim() : null;
  }
  if (command.startsWith("/bindmax_")) {
    const token = first.slice("/bindmax_".length);
    return token ? token.trim() : null;
  }
  return null;
}
function extractMaxBindTokenFromUpdate(update, messageText) {
  var _a;
  const direct = parseMaxBindToken(messageText);
  if (direct) return direct;
  const dump = JSON.stringify(update);
  const match = /(?:^|["\s:/])\/?bindmax(?:@[\w.-]+)?[\s_]+([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i.exec(dump);
  return ((_a = match == null ? void 0 : match[1]) == null ? void 0 : _a.trim()) || null;
}
function parseMaxServiceCommand(text) {
  var _a, _b;
  const parts = text.trim().split(/\s+/);
  if (parts.length < 3) return null;
  const cmd = parts[0].toLowerCase();
  if (cmd !== "/sc" && cmd !== "sc") return null;
  const serviceCallId = (_a = parts[1]) == null ? void 0 : _a.trim();
  const actionRaw = (_b = parts[2]) == null ? void 0 : _b.trim().toLowerCase();
  if (!serviceCallId) return null;
  if (actionRaw !== "soon" && actionRaw !== "on_my_way" && actionRaw !== "done") return null;
  return { serviceCallId, action: actionRaw };
}
function parseMaxContactCommand(text) {
  var _a;
  const parts = text.trim().split(/\s+/);
  if (parts.length < 2) return null;
  const cmd = parts[0].toLowerCase();
  if (cmd !== "/contact" && cmd !== "contact") return null;
  const serviceCallId = (_a = parts[1]) == null ? void 0 : _a.trim();
  if (!serviceCallId) return null;
  return { serviceCallId };
}
function extractMaxConversationId(update) {
  var _a, _b, _c, _d, _e, _f, _g;
  const raw = update;
  const msg = update.message;
  const candidates = [
    (_a = msg == null ? void 0 : msg.recipient) == null ? void 0 : _a.chat_id,
    (_b = update.recipient) == null ? void 0 : _b.chat_id,
    update.chat_id,
    update.conversation_id,
    (_c = update.chat) == null ? void 0 : _c.chat_id,
    (_d = update.chat) == null ? void 0 : _d.id,
    (_e = update.dialog) == null ? void 0 : _e.chat_id,
    (_f = update.dialog) == null ? void 0 : _f.id,
    raw.conversationId,
    raw.conversation_id,
    raw.chatId,
    raw.chat_id
  ];
  for (const candidate of candidates) {
    const normalized = normalizeNonEmptyId(candidate);
    if (normalized) return normalized;
  }
  const dump = JSON.stringify(update);
  const match = /"(?:conversationId|conversation_id|chatId|chat_id|dialog_id|dialogId)"\s*:\s*"?([^",}\s]+)"?/i.exec(dump);
  return ((_g = match == null ? void 0 : match[1]) == null ? void 0 : _g.trim()) || null;
}
function extractMaxActorUserId(body) {
  var _a, _b, _c, _d, _e;
  const msg = body.message;
  const fromMsg = parseNumericId((_a = msg == null ? void 0 : msg.sender) == null ? void 0 : _a.user_id);
  if (fromMsg != null) return fromMsg;
  const fromUser = parseNumericId((_d = (_b = body.user) == null ? void 0 : _b.user_id) != null ? _d : (_c = body.user) == null ? void 0 : _c.id);
  if (fromUser != null) return fromUser;
  const raw = body;
  const usr = raw.user;
  if (usr && typeof usr === "object") {
    const u = usr;
    const id = parseNumericId((_e = u.user_id) != null ? _e : u.id);
    if (id != null) return id;
  }
  return parseNumericId(raw.user_id);
}
function extractTokenUuidFromUpdate(update) {
  var _a, _b;
  const payloadSources = [
    String(update.payload || ""),
    String(update.start_payload || "")
  ];
  for (const s of payloadSources) {
    const payloadToken = parseAuthLinkTokenUuidFromText(s);
    if (payloadToken) return normalizeAuthTokenUuid(payloadToken);
    const plainUuid = normalizeAuthTokenUuid(s);
    if (plainUuid) return plainUuid;
  }
  const msg = update.message;
  const candidates = [
    typeof ((_a = msg == null ? void 0 : msg.body) == null ? void 0 : _a.text) === "string" ? msg.body.text : "",
    typeof ((_b = msg == null ? void 0 : msg.body) == null ? void 0 : _b.caption) === "string" ? msg.body.caption : "",
    typeof (msg == null ? void 0 : msg.text) === "string" ? msg.text : ""
  ];
  for (const raw of candidates) {
    const token = parseAuthLinkTokenUuidFromText(raw);
    if (token) return normalizeAuthTokenUuid(token);
    const plain = normalizeAuthTokenUuid(raw);
    if (plain) return plain;
  }
  const dump = JSON.stringify(update);
  const hit = /link_([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i.exec(dump);
  return (hit == null ? void 0 : hit[1]) ? normalizeAuthTokenUuid(hit[1]) : null;
}
function extractTelFromVcf(vcf) {
  const compact = vcf.replace(/\r?\n/g, "\n");
  const telLine = compact.split("\n").find((line) => /^([^:]*:)?TEL/i.test(line.trim()));
  if (telLine) {
    const raw = telLine.replace(/^[^:]+:\s*/i, "").trim();
    const digits = raw.replace(/\D/g, "");
    if (digits.length >= 10) return raw;
  }
  const loose = compact.match(/\+?\d[\d\s().-]{8,}\d/);
  return loose ? loose[0].replace(/\s/g, "") : null;
}
function extractPhoneFromMaxMessageBody(msg) {
  var _a;
  const atts = (_a = msg == null ? void 0 : msg.body) == null ? void 0 : _a.attachments;
  if (!Array.isArray(atts)) return null;
  for (const a of atts) {
    if (!a || typeof a !== "object") continue;
    if (String(a.type || "") !== "contact") continue;
    const p = a.payload;
    if (!p || typeof p !== "object") continue;
    const direct = p.vcf_phone;
    if (typeof direct === "string" && direct.trim()) return normalizePhone(direct.trim());
    const vcf = p.vcf_info;
    if (typeof vcf === "string" && vcf.trim()) {
      const tel = extractTelFromVcf(vcf.trim());
      if (tel) return normalizePhone(tel);
    }
  }
  return null;
}
async function sendMaxDmWithLinkAndClipboard(options) {
  const base = options.baseUrl.replace(/\/$/, "");
  const url = `${base}/messages?user_id=${encodeURIComponent(String(options.userId))}`;
  const attachments = [
    {
      type: "inline_keyboard",
      payload: {
        buttons: [
          [
            {
              type: "link",
              text: "\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u0441\u0430\u0439\u0442 \u0434\u043B\u044F \u0432\u0445\u043E\u0434\u0430",
              url: options.linkUrl
            }
          ],
          [
            {
              type: "clipboard",
              text: "\u0421\u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0441\u0441\u044B\u043B\u043A\u0443",
              payload: options.linkUrl
            }
          ]
        ]
      }
    }
  ];
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: options.token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      text: options.text,
      attachments
    })
  });
  if (!res.ok) {
    const bodyText = await res.text();
    throw new Error(`max_send_failed:${res.status}:${bodyText}`);
  }
}
async function sendMaxDmRequestContactOnly(options) {
  const base = options.baseUrl.replace(/\/$/, "");
  const url = `${base}/messages?user_id=${encodeURIComponent(String(options.userId))}`;
  const attachments = [
    {
      type: "inline_keyboard",
      payload: {
        buttons: [[{ type: "request_contact", text: "\u041F\u043E\u0434\u0435\u043B\u0438\u0442\u044C\u0441\u044F \u043D\u043E\u043C\u0435\u0440\u043E\u043C" }]]
      }
    }
  ];
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: options.token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      text: "\u041F\u043E \u0436\u0435\u043B\u0430\u043D\u0438\u044E \u043D\u0430\u0436\u043C\u0438\u0442\u0435 \u043A\u043D\u043E\u043F\u043A\u0443 \u043D\u0438\u0436\u0435, \u0447\u0442\u043E\u0431\u044B \u043C\u044B \u0441\u043E\u0445\u0440\u0430\u043D\u0438\u043B\u0438 \u043D\u043E\u043C\u0435\u0440 \u0434\u043B\u044F \u0437\u0430\u043A\u0430\u0437\u043E\u0432.",
      attachments
    })
  });
  if (!res.ok) {
    const bodyText = await res.text();
    throw new Error(`max_send_contact_row_failed:${res.status}:${bodyText}`);
  }
}
async function sendMaxDmPlain(options) {
  const base = options.baseUrl.replace(/\/$/, "");
  const url = `${base}/messages?user_id=${encodeURIComponent(String(options.userId))}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: options.token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ text: options.text })
  });
  if (!res.ok) {
    const bodyText = await res.text();
    throw new Error(`max_send_failed:${res.status}:${bodyText}`);
  }
}
async function sendMaxToConversation(options) {
  const base = options.baseUrl.replace(/\/$/, "");
  const res = await fetch(`${base}/messages`, {
    method: "POST",
    headers: {
      Authorization: options.token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      conversationId: options.conversationId,
      text: options.text
    })
  });
  if (!res.ok) {
    const bodyText = await res.text();
    throw new Error(`max_send_conversation_failed:${res.status}:${bodyText}`);
  }
}
const webhookMax_post = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z;
  const config = useRuntimeConfig();
  const secret = typeof config.maxWebhookSecret === "string" ? config.maxWebhookSecret.trim() : "";
  if (secret) {
    const header = getHeader(event, "x-max-bot-api-secret") || "";
    if (header !== secret) {
      throw createError({ statusCode: 403, statusMessage: "Forbidden" });
    }
  }
  const maxBaseUrl = String(config.maxApiBaseUrl || "").trim();
  const maxToken = String(config.maxApiToken || "").trim();
  if (!maxBaseUrl || !maxToken) {
    console.error("webhook-max: NUXT_MAX_API_BASE_URL or NUXT_MAX_API_TOKEN missing");
    throw createError({ statusCode: 500, statusMessage: "MAX API not configured" });
  }
  const appUrlBase = (config.appUrl || "").replace(/\/$/, "");
  const defaultCitySlug = typeof ((_a = config.public) == null ? void 0 : _a.defaultCitySlug) === "string" && config.public.defaultCitySlug.trim() ? config.public.defaultCitySlug.trim() : "ulan-ude";
  const body = await readBody(event);
  const updateType = String((body == null ? void 0 : body.update_type) || "").trim();
  if (!body) {
    return { ok: true };
  }
  const incomingText = typeof ((_c = (_b = body.message) == null ? void 0 : _b.body) == null ? void 0 : _c.text) === "string" ? body.message.body.text.trim() : typeof ((_d = body.message) == null ? void 0 : _d.text) === "string" ? body.message.text.trim() : "";
  const hasBindCommand = Boolean(extractMaxBindTokenFromUpdate(body, incomingText));
  const supportedType = updateType === "message_created" || updateType === "bot_started";
  if (!supportedType && !hasBindCommand) {
    return { ok: true };
  }
  const msg = body.message;
  if (((_e = msg == null ? void 0 : msg.sender) == null ? void 0 : _e.is_bot) === true || ((_f = body.user) == null ? void 0 : _f.is_bot) === true) {
    return { ok: true };
  }
  const actorUserId = extractMaxActorUserId(body);
  const startPayload = extractStartPayload(body);
  const messageTextRaw = typeof ((_g = msg == null ? void 0 : msg.body) == null ? void 0 : _g.text) === "string" ? msg.body.text.trim() : typeof (msg == null ? void 0 : msg.text) === "string" ? msg.text.trim() : "";
  if (actorUserId != null && startPayload.startsWith("linkmaxchat_")) {
    const token = startPayload.slice("linkmaxchat_".length).trim();
    if (!token) {
      await sendMaxDmPlain({
        baseUrl: maxBaseUrl,
        token: maxToken,
        userId: actorUserId,
        text: "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043F\u0440\u043E\u0447\u0438\u0442\u0430\u0442\u044C \u0442\u043E\u043A\u0435\u043D \u043F\u0440\u0438\u0432\u044F\u0437\u043A\u0438. \u0421\u0433\u0435\u043D\u0435\u0440\u0438\u0440\u0443\u0439\u0442\u0435 \u0441\u0441\u044B\u043B\u043A\u0443 \u0437\u0430\u043D\u043E\u0432\u043E \u0432 \u043A\u0430\u0431\u0438\u043D\u0435\u0442\u0435."
      }).catch((e) => console.error("webhook-max: linkmaxchat invalid token ack failed:", e));
      return { ok: true };
    }
    await sendMaxDmPlain({
      baseUrl: maxBaseUrl,
      token: maxToken,
      userId: actorUserId,
      text: [
        "\u0422\u043E\u043A\u0435\u043D \u043F\u0440\u0438\u0432\u044F\u0437\u043A\u0438 MAX \u043F\u043E\u043B\u0443\u0447\u0435\u043D.",
        "\u0422\u0435\u043F\u0435\u0440\u044C \u0434\u043E\u0431\u0430\u0432\u044C\u0442\u0435 MAX-\u0431\u043E\u0442\u0430 \u0432 \u043D\u0443\u0436\u043D\u0443\u044E \u0433\u0440\u0443\u043F\u043F\u0443 \u043C\u0435\u043D\u0435\u0434\u0436\u0435\u0440\u043E\u0432 \u0438 \u043E\u0442\u043F\u0440\u0430\u0432\u044C\u0442\u0435 \u0442\u0430\u043C \u043A\u043E\u043C\u0430\u043D\u0434\u0443:",
        `/bindmax ${token}`,
        "",
        "\u041F\u043E\u0441\u043B\u0435 \u043A\u043E\u043C\u0430\u043D\u0434\u044B \u044D\u0442\u043E\u0442 MAX-\u0447\u0430\u0442 \u0431\u0443\u0434\u0435\u0442 \u043F\u0440\u0438\u0432\u044F\u0437\u0430\u043D \u043A \u0444\u0438\u043B\u0438\u0430\u043B\u0443."
      ].join("\n")
    }).catch((e) => console.error("webhook-max: linkmaxchat instructions failed:", e));
    return { ok: true };
  }
  if (actorUserId != null && startPayload.startsWith("orderdelay_")) {
    const orderId = startPayload.slice("orderdelay_".length).trim();
    if (!orderId) return { ok: true };
    const supabaseDelay = await serverSupabaseServiceRole(event);
    const signalKey = `max_client_delay_signal:${orderId}:${actorUserId}`;
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1e3).toISOString();
    const { data: existingSignal } = await supabaseDelay.from("notification_events").select("id,updated_at").eq("notification_key", signalKey).gte("updated_at", fiveMinutesAgo).maybeSingle();
    if (existingSignal == null ? void 0 : existingSignal.id) {
      await sendMaxDmPlain({
        baseUrl: maxBaseUrl,
        token: maxToken,
        userId: actorUserId,
        text: "\u0421\u0438\u0433\u043D\u0430\u043B \u0443\u0436\u0435 \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D \u043D\u0435\u0434\u0430\u0432\u043D\u043E. \u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u0435 \u0447\u0443\u0442\u044C \u043F\u043E\u0437\u0436\u0435."
      }).catch((e) => console.error("webhook-max: delay duplicate ack failed:", e));
      return { ok: true };
    }
    const { data: order } = await supabaseDelay.from("orders").select("id,order_number,shop_id,restaurant_id").eq("id", orderId).maybeSingle();
    await getUnifiedFlowConfig(event, String(order.restaurant_id || ""));
    await appendOrderTimelineEntry(event, {
      orderId,
      shopId: String(order.shop_id),
      label: "\u041A\u043B\u0438\u0435\u043D\u0442 \u043E\u0442\u043F\u0440\u0430\u0432\u0438\u043B \u0441\u0438\u0433\u043D\u0430\u043B \u043E \u0437\u0430\u0434\u0435\u0440\u0436\u043A\u0435 \u0438\u0437 MAX",
      source: "max",
      userId: String(actorUserId),
      comment: null
    });
    if (!order) {
      await sendMaxDmPlain({
        baseUrl: maxBaseUrl,
        token: maxToken,
        userId: actorUserId,
        text: "\u0417\u0430\u043A\u0430\u0437 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D."
      }).catch((e) => console.error("webhook-max: delay order not found ack failed:", e));
      return { ok: true };
    }
    const { data: branch } = await supabaseDelay.from("restaurants").select("name,manager_group_chat_id,manager_max_chat_id").eq("id", order.restaurant_id).maybeSingle();
    const { data: shop } = await supabaseDelay.from("shops").select("telegram_bot_token").eq("id", order.shop_id).maybeSingle();
    const managerTgChatId = typeof (branch == null ? void 0 : branch.manager_group_chat_id) === "string" ? String(branch.manager_group_chat_id).trim() : "";
    const managerMaxChatId = typeof (branch == null ? void 0 : branch.manager_max_chat_id) === "string" ? String(branch.manager_max_chat_id).trim() : "";
    const telegramBotToken = typeof (shop == null ? void 0 : shop.telegram_bot_token) === "string" ? String(shop.telegram_bot_token).trim() : "";
    const managerText = [
      "\u26A0\uFE0F \u041A\u043B\u0438\u0435\u043D\u0442 \u0441\u043E\u043E\u0431\u0449\u0438\u043B \u043E \u0437\u0430\u0434\u0435\u0440\u0436\u043A\u0435",
      `\u{1F4E6} \u0417\u0430\u043A\u0430\u0437 ${formatOrderRef$1(order == null ? void 0 : order.order_number, orderId)}`,
      `\u{1F3EA} \u0424\u0438\u043B\u0438\u0430\u043B: ${String((branch == null ? void 0 : branch.name) || "\u2014")}`,
      `\u{1F464} \u041A\u043B\u0438\u0435\u043D\u0442 MAX: id:${actorUserId}`
    ].join("\n");
    if (managerTgChatId && telegramBotToken) {
      await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: managerTgChatId,
          text: managerText
        })
      }).catch((e) => console.error("webhook-max: delay notify manager telegram failed:", e));
    }
    if (managerMaxChatId) {
      await sendMaxToConversation({
        baseUrl: maxBaseUrl,
        token: maxToken,
        conversationId: managerMaxChatId,
        text: managerText
      }).catch((e) => console.error("webhook-max: delay notify manager max failed:", e));
    }
    await supabaseDelay.from("notification_events").upsert({
      notification_key: signalKey,
      event_type: "ORDER_STATUS_CHANGED",
      channel: "max",
      shop_id: order.shop_id,
      restaurant_id: order.restaurant_id,
      conversation_id: managerMaxChatId || managerTgChatId || null,
      delivery_status: "sent",
      attempt_count: 1,
      payload: { orderId, fromMaxUserId: actorUserId, source: "client_delay_signal_max" },
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }, { onConflict: "notification_key" });
    await sendMaxDmPlain({
      baseUrl: maxBaseUrl,
      token: maxToken,
      userId: actorUserId,
      text: "\u0421\u0438\u0433\u043D\u0430\u043B \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D \u043C\u0435\u043D\u0435\u0434\u0436\u0435\u0440\u0443 \u0440\u0435\u0441\u0442\u043E\u0440\u0430\u043D\u0430."
    }).catch((e) => console.error("webhook-max: delay ack failed:", e));
    return { ok: true };
  }
  const bindToken = extractMaxBindTokenFromUpdate(body, messageTextRaw);
  if (bindToken) {
    const conversationIdValue = extractMaxConversationId(body);
    console.info("webhook-max: bindmax command received", {
      updateType,
      hasConversationId: Boolean(conversationIdValue),
      conversationId: conversationIdValue,
      tokenPrefix: bindToken.slice(0, 8),
      messageText: messageTextRaw
    });
    if (!conversationIdValue) {
      console.warn("webhook-max: bindmax conversation id not found", {
        updateType,
        payload: (_h = body.payload) != null ? _h : null,
        start_payload: (_i = body.start_payload) != null ? _i : null,
        messageRecipient: (_j = msg == null ? void 0 : msg.recipient) != null ? _j : null,
        chat_id: (_k = body.chat_id) != null ? _k : null
      });
      if (actorUserId != null) {
        await sendMaxDmPlain({
          baseUrl: maxBaseUrl,
          token: maxToken,
          userId: actorUserId,
          text: "\u041A\u043E\u043C\u0430\u043D\u0434\u0430 bindmax \u0440\u0430\u0431\u043E\u0442\u0430\u0435\u0442 \u0442\u043E\u043B\u044C\u043A\u043E \u0432 \u0433\u0440\u0443\u043F\u043F\u0435 \u043C\u0435\u043D\u0435\u0434\u0436\u0435\u0440\u043E\u0432. \u041E\u0442\u043F\u0440\u0430\u0432\u044C\u0442\u0435 \u0435\u0451 \u0432 \u043D\u0443\u0436\u043D\u043E\u043C MAX-\u0447\u0430\u0442\u0435."
        }).catch(() => {
        });
      }
      return { ok: true };
    }
    const supabase2 = await serverSupabaseServiceRole(event);
    const { data: tokenRow } = await supabase2.from("telegram_chat_link_tokens").select("token,shop_id,restaurant_id,expires_at,used_at").eq("token", bindToken).maybeSingle();
    if (!tokenRow) {
      console.warn("webhook-max: bindmax token not found", { tokenPrefix: bindToken.slice(0, 8) });
      await sendMaxToConversation({
        baseUrl: maxBaseUrl,
        token: maxToken,
        conversationId: conversationIdValue,
        text: "\u0422\u043E\u043A\u0435\u043D \u043F\u0440\u0438\u0432\u044F\u0437\u043A\u0438 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D. \u0421\u0433\u0435\u043D\u0435\u0440\u0438\u0440\u0443\u0439\u0442\u0435 \u043D\u043E\u0432\u0443\u044E \u0441\u0441\u044B\u043B\u043A\u0443 \u0432 \u043A\u0430\u0431\u0438\u043D\u0435\u0442\u0435."
      }).catch(() => {
      });
      return { ok: true };
    }
    if (tokenRow.used_at) {
      console.warn("webhook-max: bindmax token already used", { tokenPrefix: bindToken.slice(0, 8) });
      await sendMaxToConversation({
        baseUrl: maxBaseUrl,
        token: maxToken,
        conversationId: conversationIdValue,
        text: "\u042D\u0442\u043E\u0442 \u0442\u043E\u043A\u0435\u043D \u0443\u0436\u0435 \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u043D. \u0421\u0433\u0435\u043D\u0435\u0440\u0438\u0440\u0443\u0439\u0442\u0435 \u043D\u043E\u0432\u044B\u0439 \u0432 \u043A\u0430\u0431\u0438\u043D\u0435\u0442\u0435."
      }).catch(() => {
      });
      return { ok: true };
    }
    if (new Date(tokenRow.expires_at).getTime() < Date.now()) {
      console.warn("webhook-max: bindmax token expired", { tokenPrefix: bindToken.slice(0, 8), expiresAt: tokenRow.expires_at });
      await sendMaxToConversation({
        baseUrl: maxBaseUrl,
        token: maxToken,
        conversationId: conversationIdValue,
        text: "\u0422\u043E\u043A\u0435\u043D \u0438\u0441\u0442\u0435\u043A. \u0421\u0433\u0435\u043D\u0435\u0440\u0438\u0440\u0443\u0439\u0442\u0435 \u043D\u043E\u0432\u044B\u0439 \u0432 \u043A\u0430\u0431\u0438\u043D\u0435\u0442\u0435."
      }).catch(() => {
      });
      return { ok: true };
    }
    const { data: existingRestaurant } = await supabase2.from("restaurants").select("id").eq("manager_max_chat_id", conversationIdValue).neq("id", tokenRow.restaurant_id).maybeSingle();
    if (existingRestaurant == null ? void 0 : existingRestaurant.id) {
      console.warn("webhook-max: bindmax chat already linked", {
        conversationId: conversationIdValue,
        existingRestaurantId: existingRestaurant.id
      });
      await sendMaxToConversation({
        baseUrl: maxBaseUrl,
        token: maxToken,
        conversationId: conversationIdValue,
        text: "\u042D\u0442\u043E\u0442 MAX-\u0447\u0430\u0442 \u0443\u0436\u0435 \u043F\u0440\u0438\u0432\u044F\u0437\u0430\u043D \u043A \u0434\u0440\u0443\u0433\u043E\u043C\u0443 \u0440\u0435\u0441\u0442\u043E\u0440\u0430\u043D\u0443."
      }).catch(() => {
      });
      return { ok: true };
    }
    const { data: updatedRestaurant, error: updateError } = await supabase2.from("restaurants").update({ manager_max_chat_id: conversationIdValue }).eq("id", tokenRow.restaurant_id).eq("shop_id", tokenRow.shop_id).select("name").maybeSingle();
    if (updateError || !updatedRestaurant) {
      console.error("Bind MAX chat update restaurant failed:", updateError);
      await sendMaxToConversation({
        baseUrl: maxBaseUrl,
        token: maxToken,
        conversationId: conversationIdValue,
        text: "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0441\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u043F\u0440\u0438\u0432\u044F\u0437\u043A\u0443 MAX-\u0447\u0430\u0442\u0430. \u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0435\u0449\u0435 \u0440\u0430\u0437."
      }).catch(() => {
      });
      return { ok: true };
    }
    await supabase2.from("telegram_chat_link_tokens").update({ used_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("token", bindToken).is("used_at", null);
    await sendMaxToConversation({
      baseUrl: maxBaseUrl,
      token: maxToken,
      conversationId: conversationIdValue,
      text: `MAX-\u0447\u0430\u0442 \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u043F\u0440\u0438\u0432\u044F\u0437\u0430\u043D \u043A \u0440\u0435\u0441\u0442\u043E\u0440\u0430\u043D\u0443 "${updatedRestaurant.name}".`
    }).catch(() => {
    });
    console.info("webhook-max: bindmax linked restaurant", {
      conversationId: conversationIdValue,
      restaurantId: tokenRow.restaurant_id,
      tokenPrefix: bindToken.slice(0, 8)
    });
    return { ok: true };
  }
  if (actorUserId != null) {
    const contactCommand = parseMaxContactCommand(messageTextRaw);
    if (contactCommand) {
      const supabase2 = await serverSupabaseServiceRole(event);
      const { data: callRow } = await supabase2.from("service_calls").select("id,shop_id,restaurant_id,customer_telegram_id,customer_max_user_id,customer_max_conversation_id,customer_profile_id").eq("id", contactCommand.serviceCallId).maybeSingle();
      if (!callRow) {
        await sendMaxDmPlain({
          baseUrl: maxBaseUrl,
          token: maxToken,
          userId: actorUserId,
          text: "Service call \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D."
        }).catch(() => {
        });
        return { ok: true };
      }
      const { data: restaurant } = await supabase2.from("restaurants").select("name").eq("id", callRow.restaurant_id).maybeSingle();
      const customerProfileId = typeof callRow.customer_profile_id === "string" ? String(callRow.customer_profile_id) : "";
      const knownPhone = customerProfileId ? await getProfilePhone(supabase2, customerProfileId) : "";
      const contactRequestText = knownPhone ? `\u041C\u0435\u043D\u0435\u0434\u0436\u0435\u0440 \u0440\u0435\u0441\u0442\u043E\u0440\u0430\u043D\u0430 "${String((restaurant == null ? void 0 : restaurant.name) || "\u0420\u0435\u0441\u0442\u043E\u0440\u0430\u043D")}" \u0445\u043E\u0447\u0435\u0442 \u0441\u0432\u044F\u0437\u0430\u0442\u044C\u0441\u044F \u0441 \u0432\u0430\u043C\u0438. \u0412\u0430\u0448 \u043D\u043E\u043C\u0435\u0440 \u0443\u0436\u0435 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D: ${knownPhone}.` : `\u041C\u0435\u043D\u0435\u0434\u0436\u0435\u0440 \u0440\u0435\u0441\u0442\u043E\u0440\u0430\u043D\u0430 "${String((restaurant == null ? void 0 : restaurant.name) || "\u0420\u0435\u0441\u0442\u043E\u0440\u0430\u043D")}" \u0445\u043E\u0447\u0435\u0442 \u0441\u0432\u044F\u0437\u0430\u0442\u044C\u0441\u044F \u0441 \u0432\u0430\u043C\u0438. \u041F\u043E\u0434\u0435\u043B\u0438\u0442\u044C\u0441\u044F \u043A\u043E\u043D\u0442\u0430\u043A\u0442\u043E\u043C?`;
      const botToken = String(config.botToken || "").trim();
      const customerTelegramIdRaw = Number(callRow.customer_telegram_id);
      const customerTelegramId = Number.isFinite(customerTelegramIdRaw) && customerTelegramIdRaw > 0 ? customerTelegramIdRaw : null;
      if (customerTelegramId && botToken) {
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: customerTelegramId,
            text: contactRequestText,
            ...knownPhone ? {} : {
              reply_markup: {
                keyboard: [[{ text: "\u041F\u043E\u0434\u0435\u043B\u0438\u0442\u044C\u0441\u044F \u043D\u043E\u043C\u0435\u0440\u043E\u043C", request_contact: true }]],
                resize_keyboard: true,
                one_time_keyboard: true
              }
            }
          })
        }).catch(() => {
        });
      }
      const customerMaxConversationId = typeof callRow.customer_max_conversation_id === "string" ? String(callRow.customer_max_conversation_id).trim() : "";
      const customerMaxUserId = typeof callRow.customer_max_user_id === "string" ? String(callRow.customer_max_user_id).trim() : "";
      if (customerMaxConversationId || customerMaxUserId) {
        await sendMax$2(maxBaseUrl, maxToken, {
          conversationId: customerMaxConversationId || void 0,
          userId: customerMaxConversationId ? void 0 : customerMaxUserId || void 0,
          text: contactRequestText,
          attachments: knownPhone ? void 0 : [{
            type: "inline_keyboard",
            payload: { buttons: [[{ type: "request_contact", text: "\u041F\u043E\u0434\u0435\u043B\u0438\u0442\u044C\u0441\u044F \u043D\u043E\u043C\u0435\u0440\u043E\u043C" }]] }
          }]
        }).catch(() => {
        });
      }
      await sendMaxDmPlain({
        baseUrl: maxBaseUrl,
        token: maxToken,
        userId: actorUserId,
        text: knownPhone ? `\u041D\u043E\u043C\u0435\u0440 \u043A\u043B\u0438\u0435\u043D\u0442\u0430: ${knownPhone}` : "\u0417\u0430\u043F\u0440\u043E\u0441 \u043A\u043E\u043D\u0442\u0430\u043A\u0442\u0430 \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D \u043A\u043B\u0438\u0435\u043D\u0442\u0443"
      }).catch(() => {
      });
      return { ok: true };
    }
    const serviceCommand = parseMaxServiceCommand(messageTextRaw);
    if (serviceCommand) {
      const conversationId = extractMaxConversationId(body);
      if (!conversationId) {
        await sendMaxDmPlain({
          baseUrl: maxBaseUrl,
          token: maxToken,
          userId: actorUserId,
          text: "\u041A\u043E\u043C\u0430\u043D\u0434\u0443 /sc \u043D\u0443\u0436\u043D\u043E \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u044F\u0442\u044C \u0438\u0437 \u0440\u0430\u0431\u043E\u0447\u0435\u0433\u043E MAX-\u0433\u0440\u0443\u043F\u043F\u043E\u0432\u043E\u0433\u043E \u0447\u0430\u0442\u0430."
        }).catch(() => {
        });
        return { ok: true };
      }
      const supabase2 = await serverSupabaseServiceRole(event);
      const { data: callRow } = await supabase2.from("service_calls").select("id,shop_id,restaurant_id,order_id,customer_telegram_id,customer_max_user_id,customer_max_conversation_id").eq("id", serviceCommand.serviceCallId).maybeSingle();
      if (!callRow) {
        await sendMaxDmPlain({
          baseUrl: maxBaseUrl,
          token: maxToken,
          userId: actorUserId,
          text: "Service call \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D."
        }).catch(() => {
        });
        return { ok: true };
      }
      const externalUserId = String(actorUserId);
      const { data: binding } = await supabase2.from("restaurant_staff_bot_bindings").select("id,display_name").eq("shop_id", callRow.shop_id).eq("restaurant_id", callRow.restaurant_id).eq("channel", "max").eq("external_user_id", externalUserId).maybeSingle();
      const nowIso = (/* @__PURE__ */ new Date()).toISOString();
      const nextStatus = mapActionToStatus(serviceCommand.action);
      const { data: currentCall } = await supabase2.from("service_calls").select("first_response_at").eq("id", serviceCommand.serviceCallId).maybeSingle();
      const patch = { status: nextStatus, updated_at: nowIso };
      if (!(currentCall == null ? void 0 : currentCall.first_response_at)) patch.first_response_at = nowIso;
      if (nextStatus === "resolved") patch.resolved_at = nowIso;
      await supabase2.from("service_calls").update(patch).eq("id", serviceCommand.serviceCallId);
      const responseText = getStaffResponseText(serviceCommand.action);
      const actorName = typeof binding.display_name === "string" && binding.display_name.trim() ? String(binding.display_name).trim() : `\u0421\u043E\u0442\u0440\u0443\u0434\u043D\u0438\u043A ${externalUserId}`;
      await createServiceCallEvent(event, {
        serviceCallId: serviceCommand.serviceCallId,
        shopId: String(callRow.shop_id),
        restaurantId: String(callRow.restaurant_id),
        orderId: callRow.order_id ? String(callRow.order_id) : null,
        eventType: "staff_response",
        eventStatus: nextStatus,
        channel: "max",
        actorBindingId: (binding == null ? void 0 : binding.id) ? String(binding.id) : null,
        actorExternalUserId: externalUserId,
        actorDisplayName: actorName,
        message: responseText,
        extraPayload: { action: serviceCommand.action, conversationId }
      });
      const customerText = `\u041E\u0442\u0432\u0435\u0442 \u043F\u0435\u0440\u0441\u043E\u043D\u0430\u043B\u0430: ${responseText}`;
      const botToken = String(config.botToken || "").trim();
      const customerTelegramIdRaw = Number(callRow.customer_telegram_id);
      const customerTelegramId = Number.isFinite(customerTelegramIdRaw) && customerTelegramIdRaw > 0 ? customerTelegramIdRaw : null;
      if (customerTelegramId && botToken) {
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: customerTelegramId, text: customerText })
        }).catch(() => {
        });
      }
      const customerMaxConversationId = typeof callRow.customer_max_conversation_id === "string" ? String(callRow.customer_max_conversation_id).trim() : "";
      const customerMaxUserId = typeof callRow.customer_max_user_id === "string" ? String(callRow.customer_max_user_id).trim() : "";
      if (customerMaxConversationId || customerMaxUserId) {
        await sendMax$2(maxBaseUrl, maxToken, {
          conversationId: customerMaxConversationId || void 0,
          userId: customerMaxConversationId ? void 0 : customerMaxUserId || void 0,
          text: customerText
        }).catch(() => {
        });
      }
      await sendMaxDmPlain({
        baseUrl: maxBaseUrl,
        token: maxToken,
        userId: actorUserId,
        text: `\u041E\u0442\u0432\u0435\u0442 \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D: ${responseText}`
      }).catch(() => {
      });
      return { ok: true };
    }
  }
  if (actorUserId != null && /^ugc\s+/i.test(messageTextRaw)) {
    const [, rawAction = "", rawSubmissionId = ""] = messageTextRaw.split(/\s+/, 3);
    const actionName = rawAction.trim().toLowerCase();
    const submissionId = rawSubmissionId.trim();
    if (!submissionId) {
      await sendMaxDmPlain({
        baseUrl: maxBaseUrl,
        token: maxToken,
        userId: actorUserId,
        text: "\u0424\u043E\u0440\u043C\u0430\u0442 \u043A\u043E\u043C\u0430\u043D\u0434\u044B: ugc <action> <submissionId>"
      }).catch(() => {
      });
      return { ok: true };
    }
    const map = () => {
      if (actionName === "approve_menu") return { action: "approve_menu", label: "\u041E\u043F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u043D\u043E \u0432 \u043C\u0435\u043D\u044E" };
      if (actionName === "approve_menu_and_feed") return { action: "approve_menu_and_feed", label: "\u041E\u043F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u043D\u043E \u0432 \u043C\u0435\u043D\u044E \u0438 \u0432 \u043B\u0435\u043D\u0442\u0435" };
      if (actionName === "tag_food") return { action: "tag_category", category: "food", label: "\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044F: \u0435\u0434\u0430" };
      if (actionName === "tag_stage") return { action: "tag_category", category: "stage", label: "\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044F: \u0441\u0446\u0435\u043D\u0430" };
      if (actionName === "tag_vibe") return { action: "tag_category", category: "vibe", label: "\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044F: \u0432\u0430\u0439\u0431" };
      if (actionName === "tag_quest") return { action: "tag_category", category: "quest", label: "\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044F: \u043A\u0432\u0435\u0441\u0442" };
      if (actionName === "forward") return { action: "forward_to_corner", label: "\u041F\u0435\u0440\u0435\u0441\u043B\u0430\u043D\u043E \u043C\u0435\u043D\u0435\u0434\u0436\u0435\u0440\u0443 \u043A\u043E\u0440\u043D\u0435\u0440\u0430" };
      if (actionName === "ban") return { action: "shadow_ban", label: "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D \u0432 \u0442\u0435\u043D\u0435\u0432\u043E\u0439 \u0431\u0430\u043D" };
      return { action: "reject", label: "\u041E\u0442\u043A\u043B\u043E\u043D\u0435\u043D\u043E" };
    };
    const mapped = map();
    try {
      await applyFestivalModerationAction(event, {
        submissionId,
        action: mapped.action,
        category: mapped.category,
        actorChannel: "max",
        actorUserId: String(actorUserId)
      });
      await sendMaxDmPlain({
        baseUrl: maxBaseUrl,
        token: maxToken,
        userId: actorUserId,
        text: `UGC: ${mapped.label}`
      }).catch(() => {
      });
    } catch (err) {
      console.error("webhook-max ugc moderation failed:", err);
      await sendMaxDmPlain({
        baseUrl: maxBaseUrl,
        token: maxToken,
        userId: actorUserId,
        text: "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043F\u0440\u0438\u043C\u0435\u043D\u0438\u0442\u044C \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435 \u043C\u043E\u0434\u0435\u0440\u0430\u0446\u0438\u0438 UGC"
      }).catch(() => {
      });
    }
    return { ok: true };
  }
  if (updateType === "message_created" && actorUserId != null) {
    const tokenHint = extractTokenUuidFromUpdate(body);
    const sharedPhone = normalizePhone(extractPhoneFromMaxMessageBody(msg) || "");
    if (sharedPhone && !tokenHint) {
      const supabaseEarly = await serverSupabaseServiceRole(event);
      const { data: tokenForContact } = await supabaseEarly.from("auth_tokens").select("token, bridge_payload").eq("channel", "max").eq("max_user_id", String(actorUserId)).gt("expires_at", (/* @__PURE__ */ new Date()).toISOString()).order("expires_at", { ascending: false }).limit(1).maybeSingle();
      if (tokenForContact == null ? void 0 : tokenForContact.token) {
        const prev = (_l = tokenForContact.bridge_payload) != null ? _l : {};
        await supabaseEarly.from("auth_tokens").update({
          bridge_payload: { ...prev, max_shared_phone: sharedPhone }
        }).eq("token", tokenForContact.token);
        const { data: profile } = await supabaseEarly.from("profiles").select("id").eq("max_user_id", String(actorUserId)).maybeSingle();
        if (profile == null ? void 0 : profile.id) {
          await setProfilePhone(supabaseEarly, String(profile.id), sharedPhone);
        }
        try {
          await sendMaxDmPlain({
            baseUrl: maxBaseUrl,
            token: maxToken,
            userId: actorUserId,
            text: "\u041D\u043E\u043C\u0435\u0440 \u0441\u043E\u0445\u0440\u0430\u043D\u0451\u043D. \u0417\u0430\u0432\u0435\u0440\u0448\u0438\u0442\u0435 \u0432\u0445\u043E\u0434 \u043D\u0430 \u0441\u0430\u0439\u0442\u0435."
          });
        } catch (e) {
          console.error("webhook-max contact ack:", e);
        }
        return { ok: true };
      }
    }
  }
  const tokenUuid = extractTokenUuidFromUpdate(body);
  if (!tokenUuid) {
    console.info("webhook-max: token not found in update payload", {
      updateType,
      sender: (_n = (_m = msg == null ? void 0 : msg.sender) != null ? _m : body.user) != null ? _n : null,
      recipient: (_o = msg == null ? void 0 : msg.recipient) != null ? _o : null,
      chat_id: (_p = body.chat_id) != null ? _p : null,
      payload: (_q = body.payload) != null ? _q : null,
      start_payload: (_r = body.start_payload) != null ? _r : null
    });
    return { ok: true };
  }
  const tokenKey = tokenUuid.toLowerCase();
  const senderId = actorUserId;
  if (senderId == null) {
    console.info("webhook-max: sender_id not found/invalid", {
      updateType,
      sender: (_t = (_s = msg == null ? void 0 : msg.sender) != null ? _s : body.user) != null ? _t : null,
      user: (_u = body.user) != null ? _u : null,
      payload: (_v = body.payload) != null ? _v : null
    });
    return { ok: true };
  }
  const chatId = (_x = parseNumericId((_w = msg == null ? void 0 : msg.recipient) == null ? void 0 : _w.chat_id)) != null ? _x : parseNumericId(body.chat_id);
  const recipientUserId = parseNumericId((_y = msg == null ? void 0 : msg.recipient) == null ? void 0 : _y.user_id);
  const conversationKey = typeof chatId === "number" ? String(chatId) : typeof recipientUserId === "number" ? String(recipientUserId) : null;
  const maxUserIdStr = String(senderId);
  const supabase = await serverSupabaseServiceRole(event);
  const tenant = event.context.tenant;
  const { data: row, error: fetchErr } = await supabase.from("auth_tokens").select("token, max_user_id, expires_at, bridge_payload, channel").eq("token", tokenKey).maybeSingle();
  if (fetchErr) {
    console.error("webhook-max fetch token:", fetchErr);
    try {
      await sendMaxDmPlain({
        baseUrl: maxBaseUrl,
        token: maxToken,
        userId: senderId,
        text: "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C \u0441\u0441\u044B\u043B\u043A\u0443. \u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u043F\u043E\u0437\u0436\u0435."
      });
    } catch (e) {
      console.error("webhook-max notify error:", e);
    }
    return { ok: true };
  }
  if (!row || String(row.channel || "") !== "max") {
    try {
      await sendMaxDmPlain({
        baseUrl: maxBaseUrl,
        token: maxToken,
        userId: senderId,
        text: "\u0421\u0441\u044B\u043B\u043A\u0430 \u043D\u0435\u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0442\u0435\u043B\u044C\u043D\u0430 \u0438\u043B\u0438 \u0443\u0441\u0442\u0430\u0440\u0435\u043B\u0430. \u0417\u0430\u043F\u0440\u043E\u0441\u0438\u0442\u0435 \u0432\u0445\u043E\u0434 \u043D\u0430 \u0441\u0430\u0439\u0442\u0435 \u0435\u0449\u0451 \u0440\u0430\u0437."
      });
    } catch (e) {
      console.error("webhook-max notify error:", e);
    }
    return { ok: true };
  }
  const expiresAt = new Date(String(row.expires_at)).getTime();
  if (Number.isFinite(expiresAt) && expiresAt < Date.now()) {
    await supabase.from("auth_tokens").delete().eq("token", tokenKey);
    try {
      await sendMaxDmPlain({
        baseUrl: maxBaseUrl,
        token: maxToken,
        userId: senderId,
        text: "\u0421\u0440\u043E\u043A \u0441\u0441\u044B\u043B\u043A\u0438 \u0438\u0441\u0442\u0451\u043A. \u0412\u0435\u0440\u043D\u0438\u0442\u0435\u0441\u044C \u043D\u0430 \u0441\u0430\u0439\u0442 \u0438 \u0437\u0430\u043F\u0440\u043E\u0441\u0438\u0442\u0435 \u0432\u0445\u043E\u0434 \u0441\u043D\u043E\u0432\u0430."
      });
    } catch (e) {
      console.error("webhook-max notify error:", e);
    }
    return { ok: true };
  }
  const existingMax = row.max_user_id;
  if (existingMax != null && String(existingMax).trim() !== "" && String(existingMax) !== maxUserIdStr) {
    try {
      await sendMaxDmPlain({
        baseUrl: maxBaseUrl,
        token: maxToken,
        userId: senderId,
        text: "\u042D\u0442\u0430 \u0441\u0441\u044B\u043B\u043A\u0430 \u0443\u0436\u0435 \u0431\u044B\u043B\u0430 \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u043D\u0430 \u0432 \u0434\u0440\u0443\u0433\u043E\u043C \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u0435 MAX. \u0417\u0430\u043F\u0440\u043E\u0441\u0438\u0442\u0435 \u043D\u043E\u0432\u0443\u044E \u043D\u0430 \u0441\u0430\u0439\u0442\u0435."
      });
    } catch (e) {
      console.error("webhook-max notify error:", e);
    }
    return { ok: true };
  }
  if (existingMax == null || String(existingMax).trim() === "") {
    const { data: updated, error: updErr } = await supabase.from("auth_tokens").update({
      max_user_id: maxUserIdStr,
      max_conversation_id: conversationKey
    }).eq("token", tokenKey).is("max_user_id", null).select("token").maybeSingle();
    if (updErr) {
      console.error("webhook-max update token:", updErr);
    }
    if (!updated) {
      const { data: again } = await supabase.from("auth_tokens").select("max_user_id").eq("token", tokenKey).maybeSingle();
      const rid = again == null ? void 0 : again.max_user_id;
      if (rid != null && String(rid) !== maxUserIdStr) {
        try {
          await sendMaxDmPlain({
            baseUrl: maxBaseUrl,
            token: maxToken,
            userId: senderId,
            text: "\u042D\u0442\u0430 \u0441\u0441\u044B\u043B\u043A\u0430 \u0443\u0436\u0435 \u0431\u044B\u043B\u0430 \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u043D\u0430 \u0432 \u0434\u0440\u0443\u0433\u043E\u043C \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u0435 MAX."
          });
        } catch (e) {
          console.error("webhook-max notify error:", e);
        }
        return { ok: true };
      }
    }
  }
  const phoneFromMessage = normalizePhone(extractPhoneFromMaxMessageBody(msg) || "");
  const baseBridge = (_z = row.bridge_payload) != null ? _z : null;
  const bridgePayload = phoneFromMessage ? { ...baseBridge || {}, max_shared_phone: phoneFromMessage } : baseBridge;
  if (phoneFromMessage) {
    await supabase.from("auth_tokens").update({ bridge_payload: bridgePayload }).eq("token", tokenKey);
  }
  const { data: existingProfile } = await supabase.from("profiles").select("id").eq("max_user_id", maxUserIdStr).maybeSingle();
  const existingPhone = (existingProfile == null ? void 0 : existingProfile.id) ? await getProfilePhone(supabase, String(existingProfile.id)) : "";
  const shouldAskForContact = !(phoneFromMessage || existingPhone);
  const tokenForLink = typeof row.token === "string" ? row.token : tokenKey;
  const link = buildAuthSiteLinkUrl({
    linkPath: "link-max",
    appUrlBase,
    defaultCitySlug,
    token: tokenForLink,
    bridgePayload: bridgePayload != null ? bridgePayload : null,
    tenantShop: tenant == null ? void 0 : tenant.shop
  });
  const messageText = [
    "\u2705 MAX \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0451\u043D.",
    "",
    "\u041F\u043E \u0436\u0435\u043B\u0430\u043D\u0438\u044E \u043D\u0430\u0436\u043C\u0438\u0442\u0435 \xAB\u041F\u043E\u0434\u0435\u043B\u0438\u0442\u044C\u0441\u044F \u043D\u043E\u043C\u0435\u0440\u043E\u043C\xBB, \u0447\u0442\u043E\u0431\u044B \u043C\u044B \u0441\u043E\u0445\u0440\u0430\u043D\u0438\u043B\u0438 \u0442\u0435\u043B\u0435\u0444\u043E\u043D \u0434\u043B\u044F \u0437\u0430\u043A\u0430\u0437\u043E\u0432.",
    "\u0412\u0435\u0440\u043D\u0438\u0442\u0435\u0441\u044C \u043D\u0430 \u0441\u0430\u0439\u0442 \u2014 \u0432\u0445\u043E\u0434 \u0437\u0430\u0432\u0435\u0440\u0448\u0438\u0442\u0441\u044F \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438. \u0415\u0441\u043B\u0438 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0430 \u043D\u0435 \u043E\u0431\u043D\u043E\u0432\u0438\u043B\u0430\u0441\u044C, \u043E\u0442\u043A\u0440\u043E\u0439\u0442\u0435 \u0441\u0441\u044B\u043B\u043A\u0443 \u043A\u043D\u043E\u043F\u043A\u043E\u0439 \u043D\u0438\u0436\u0435 \u0438\u043B\u0438 \u0441\u043A\u043E\u043F\u0438\u0440\u0443\u0439\u0442\u0435 \u0435\u0451."
  ].join("\n");
  try {
    await sendMaxDmWithLinkAndClipboard({
      baseUrl: maxBaseUrl,
      token: maxToken,
      userId: senderId,
      text: messageText,
      linkUrl: link
    });
    if (shouldAskForContact) {
      try {
        await sendMaxDmRequestContactOnly({
          baseUrl: maxBaseUrl,
          token: maxToken,
          userId: senderId
        });
      } catch (eContact) {
        console.warn("webhook-max: follow-up request_contact message failed:", eContact);
      }
    }
  } catch (e) {
    console.warn("webhook-max: send with link keyboard failed, retrying plain:", e);
    try {
      await sendMaxDmPlain({
        baseUrl: maxBaseUrl,
        token: maxToken,
        userId: senderId,
        text: `${messageText}

${link}`
      });
    } catch (e2) {
      console.error("webhook-max plain send failed:", e2);
    }
  }
  return { ok: true };
});

const webhookMax_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: webhookMax_post
}, Symbol.toStringTag, { value: 'Module' }));

const TELEGRAM_API = (token) => `https://api.telegram.org/bot${token}`;
async function telegram(token, method, body) {
  const config = useRuntimeConfig();
  const transport = String(config.telegramTransport || "direct").trim().toLowerCase();
  const relayUrl = String(config.telegramRelayUrl || "").trim();
  const relaySecret = String(config.relaySharedSecret || "").trim();
  const useRelay = transport === "relay" && !!relayUrl;
  const res = useRelay ? await fetch(relayUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...relaySecret ? { "x-relay-secret": relaySecret } : {}
    },
    body: JSON.stringify({
      method,
      payload: body,
      botToken: token
    })
  }) : await fetch(`${TELEGRAM_API(token)}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const text = await res.text();
    const mode = useRelay ? "Relay" : "Telegram";
    throw new Error(`${mode} ${method}: ${res.status} ${text}`);
  }
  return res.json();
}
async function sendMaxMessage(baseUrl, token, options) {
  const base = baseUrl.replace(/\/$/, "");
  const hasConversation = typeof options.conversationId === "string" && options.conversationId.trim();
  const hasUserId = typeof options.userId === "string" && options.userId.trim();
  if (!hasConversation && !hasUserId) {
    throw new Error("max_send_target_missing");
  }
  const send = async (mode) => {
    const url = mode === "conversation" ? `${base}/messages` : `${base}/messages?user_id=${encodeURIComponent(String(options.userId))}`;
    return fetch(url, {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text: options.text,
        ...mode === "conversation" ? { conversationId: String(options.conversationId) } : {},
        ...Array.isArray(options.attachments) && options.attachments.length ? { attachments: options.attachments } : {}
      })
    });
  };
  let res = await send(hasConversation ? "conversation" : "user");
  if (!res.ok) {
    const text = await res.text();
    const isUnknownRecipient = res.status === 400 && /unknown recipient|proto\.payload/i.test(text);
    if (hasConversation && hasUserId && isUnknownRecipient) {
      res = await send("user");
      if (!res.ok) {
        const fallbackText = await res.text();
        throw new Error(`MAX sendMessage: ${res.status} ${fallbackText}`);
      }
      return;
    }
    throw new Error(`MAX sendMessage: ${res.status} ${text}`);
  }
}
function formatOrderRef(orderNumber, fallbackOrderId) {
  const raw = typeof orderNumber === "string" && orderNumber.trim() ? orderNumber.trim() : fallbackOrderId.trim();
  const normalized = raw.replace(/\s+/g, "");
  const short = normalized.length > 8 ? normalized.slice(0, 8) : normalized;
  return `#${short || "\u2014"}`;
}
function parseCallbackData(data) {
  const parts = data.split("_");
  if (parts.length !== 3) return null;
  const [rawStatus, userIdRaw, orderId] = parts;
  const userId = userIdRaw && userIdRaw.trim() ? userIdRaw.trim() : null;
  if (!rawStatus || !orderId) return null;
  if (rawStatus === "work" || rawStatus === "courier" || rawStatus === "pickup" || rawStatus === "done") {
    return { kind: "status", status: rawStatus, userId, orderId };
  }
  if (rawStatus === "delayWork") {
    return { kind: "delay", status: "work", userId, orderId };
  }
  if (rawStatus === "delayCourier") {
    return { kind: "delay", status: "courier", userId, orderId };
  }
  return null;
}
function parseBindToken(text) {
  const trimmed = text.trim();
  const [first = "", second = ""] = trimmed.split(/\s+/, 2);
  const command = first.toLowerCase();
  if (command === "/bind" || command.startsWith("/bind@")) {
    return second ? second.trim() : null;
  }
  if (command.startsWith("/bind_")) {
    const token = first.slice("/bind_".length);
    return token ? token.trim() : null;
  }
  return null;
}
function parseServiceCallbackData(data) {
  var _a;
  const parts = data.split(":");
  if (parts.length !== 3 || parts[0] !== "svc") return null;
  const action = parts[1];
  const serviceCallId = (_a = parts[2]) == null ? void 0 : _a.trim();
  if (!serviceCallId) return null;
  if (action !== "soon" && action !== "on_my_way" && action !== "done") return null;
  return { action, serviceCallId };
}
function parseServiceContactCallbackData(data) {
  var _a;
  const parts = data.split(":");
  if (parts.length !== 3 || parts[0] !== "svc" || parts[1] !== "contact") return null;
  const serviceCallId = (_a = parts[2]) == null ? void 0 : _a.trim();
  if (!serviceCallId) return null;
  return { serviceCallId };
}
const CLIENT_MESSAGES = {
  work: (orderRef) => `\u{1F468}\u200D\u{1F373} \u0412\u0430\u0448 \u0437\u0430\u043A\u0430\u0437 ${orderRef} \u043F\u0440\u0438\u043D\u044F\u0442 \u0432 \u0440\u0430\u0431\u043E\u0442\u0443. \u041A\u0443\u0445\u043D\u044F \u0443\u0436\u0435 \u0433\u043E\u0442\u043E\u0432\u0438\u0442 \u0432\u0430\u0448 \u0437\u0430\u043A\u0430\u0437.`,
  courier: (orderRef) => `\u{1F69A} \u0412\u0430\u0448 \u0437\u0430\u043A\u0430\u0437 ${orderRef} \u043F\u0435\u0440\u0435\u0434\u0430\u043D \u043A\u0443\u0440\u044C\u0435\u0440\u0443 \u0438 \u0443\u0436\u0435 \u0432 \u043F\u0443\u0442\u0438.`,
  pickup: (orderRef) => `\u{1F4E6} \u0412\u0430\u0448 \u0437\u0430\u043A\u0430\u0437 ${orderRef} \u0433\u043E\u0442\u043E\u0432 \u043A \u0432\u044B\u0434\u0430\u0447\u0435. \u041C\u043E\u0436\u043D\u043E \u0437\u0430\u0431\u0438\u0440\u0430\u0442\u044C.`,
  done: (orderRef) => `\u2705 \u0412\u0430\u0448 \u0437\u0430\u043A\u0430\u0437 ${orderRef} \u0434\u043E\u0441\u0442\u0430\u0432\u043B\u0435\u043D. \u0421\u043F\u0430\u0441\u0438\u0431\u043E, \u0447\u0442\u043E \u0432\u044B\u0431\u0440\u0430\u043B\u0438 \u043D\u0430\u0441! \u041F\u0440\u0438\u044F\u0442\u043D\u043E\u0433\u043E \u0430\u043F\u043F\u0435\u0442\u0438\u0442\u0430 \u{1F958}\u{1F363}\u{1F35C}`
};
function managerStatusLine(status, fulfillmentType) {
  if (status === "work") return "\u{1F7E1} \u0421\u0442\u0430\u0442\u0443\u0441 \u0437\u0430\u043A\u0430\u0437\u0430: \u043F\u0440\u0438\u043D\u044F\u0442 \u0432 \u0440\u0430\u0431\u043E\u0442\u0443";
  if (status === "pickup") return "\u{1F7E2} \u0421\u0442\u0430\u0442\u0443\u0441 \u0437\u0430\u043A\u0430\u0437\u0430: \u0433\u043E\u0442\u043E\u0432 \u043A \u0432\u044B\u0434\u0430\u0447\u0435";
  if (status === "courier") return "\u{1F7E0} \u0421\u0442\u0430\u0442\u0443\u0441 \u0437\u0430\u043A\u0430\u0437\u0430: \u043F\u0435\u0440\u0435\u0434\u0430\u043D \u043A\u0443\u0440\u044C\u0435\u0440\u0443";
  return isDeliveryFulfillment(fulfillmentType) ? "\u{1F7E2} \u0421\u0442\u0430\u0442\u0443\u0441 \u0437\u0430\u043A\u0430\u0437\u0430: \u0434\u043E\u0441\u0442\u0430\u0432\u043B\u0435\u043D \u043A\u043B\u0438\u0435\u043D\u0442\u0443 \u2705" : "\u{1F7E2} \u0421\u0442\u0430\u0442\u0443\u0441 \u0437\u0430\u043A\u0430\u0437\u0430: \u0432\u044B\u0434\u0430\u043D \u043A\u043B\u0438\u0435\u043D\u0442\u0443 \u2705";
}
const CLIENT_DELAY_MESSAGES = {
  work: (orderRef) => `\u23F1 \u041D\u0435\u0431\u043E\u043B\u044C\u0448\u0430\u044F \u0437\u0430\u0434\u0435\u0440\u0436\u043A\u0430 \u043F\u043E \u0437\u0430\u043A\u0430\u0437\u0443 ${orderRef}: \u043A\u0443\u0445\u043D\u044F \u0433\u043E\u0442\u043E\u0432\u0438\u0442 \u0432\u0430\u0448\u0435 \u0431\u043B\u044E\u0434\u043E \u0447\u0443\u0442\u044C \u0434\u043E\u043B\u044C\u0448\u0435 \u043E\u0431\u044B\u0447\u043D\u043E\u0433\u043E. \u0421\u043F\u0430\u0441\u0438\u0431\u043E \u0437\u0430 \u043E\u0436\u0438\u0434\u0430\u043D\u0438\u0435 \u{1F468}\u200D\u{1F373}\u{1F469}\u200D\u{1F373}`,
  courier: (orderRef) => `\u23F1 \u041D\u0435\u0431\u043E\u043B\u044C\u0448\u0430\u044F \u0437\u0430\u0434\u0435\u0440\u0436\u043A\u0430 \u043F\u043E \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0435 \u0437\u0430\u043A\u0430\u0437\u0430 ${orderRef}: \u043A\u0443\u0440\u044C\u0435\u0440 \u0443\u0436\u0435 \u0432 \u043F\u0443\u0442\u0438, \u043D\u043E \u043C\u043E\u0436\u0435\u0442 \u043F\u0440\u0438\u0435\u0445\u0430\u0442\u044C \u0447\u0443\u0442\u044C \u043F\u043E\u0437\u0436\u0435. \u0421\u043F\u0430\u0441\u0438\u0431\u043E \u0437\u0430 \u0442\u0435\u0440\u043F\u0435\u043D\u0438\u0435 \u{1F69A}\u{1F69B}\u{1F4E6}`
};
function withStatusLine(baseText, statusLabel) {
  const lines = baseText.split("\n");
  const filtered = lines.filter((line) => !line.trim().startsWith("\u0421\u0442\u0430\u0442\u0443\u0441 \u0437\u0430\u043A\u0430\u0437\u0430:"));
  return `${filtered.join("\n")}

${statusLabel}`;
}
function appendOrderDetails(baseText, details) {
  const rub = (value) => `${new Intl.NumberFormat("ru-RU").format(value)} \u20BD`;
  return [
    baseText,
    "",
    `\u{1F3EA} \u0424\u0438\u043B\u0438\u0430\u043B: ${details.branchName}`,
    `\u{1F4CD} \u0410\u0434\u0440\u0435\u0441 \u0444\u0438\u043B\u0438\u0430\u043B\u0430: ${details.branchAddress}`,
    `\u{1F4B0} \u0414\u043E\u0441\u0442\u0430\u0432\u043A\u0430: ${rub(details.deliveryCost)}`,
    `\u{1F4B3} \u0418\u0442\u043E\u0433\u043E: ${rub(details.orderTotal)}`
  ].join("\n");
}
const webhook_post = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E, _F, _G;
  const config = useRuntimeConfig();
  const relaySecret = String(config.relaySharedSecret || "").trim();
  const isRelayEndpoint = String(event.path || "").startsWith("/api/webhook-relay");
  if (isRelayEndpoint && relaySecret) {
    const providedSecret = String(getHeader(event, "x-relay-secret") || "").trim();
    if (providedSecret !== relaySecret) {
      throw createError({ statusCode: 403, statusMessage: "Forbidden" });
    }
  }
  const tenant = event.context.tenant;
  const botToken = (tenant == null ? void 0 : tenant.telegramBotToken) || config.botToken;
  const maxApiBaseUrl = String(config.maxApiBaseUrl || "").trim();
  const maxApiToken = String(config.maxApiToken || "").trim();
  const maxBotUrl = String(((_a = config.public) == null ? void 0 : _a.maxBotUrl) || "").trim();
  const appUrlBase = (config.appUrl || "").replace(/\/$/, "");
  const defaultCitySlug = typeof ((_b = config.public) == null ? void 0 : _b.defaultCitySlug) === "string" && config.public.defaultCitySlug.trim() ? config.public.defaultCitySlug.trim() : "ulan-ude";
  const appUrl = ((_c = tenant == null ? void 0 : tenant.shop) == null ? void 0 : _c.custom_domain) ? `https://${tenant.shop.custom_domain}` : ((_d = tenant == null ? void 0 : tenant.shop) == null ? void 0 : _d.slug) ? `${appUrlBase}/${encodeURIComponent(tenant.shop.slug)}` : appUrlBase;
  if (!botToken) {
    throw createError({ statusCode: 500, message: "Server config: bot token missing" });
  }
  try {
    const body = await readBody(event);
    if (!body) {
      throw createError({ statusCode: 400, message: "Expected Telegram update body" });
    }
    if (((_f = (_e = body.message) == null ? void 0 : _e.contact) == null ? void 0 : _f.phone_number) && ((_g = body.message.chat) == null ? void 0 : _g.id) !== void 0) {
      const chatId2 = body.message.chat.id;
      const phone = normalizePhone(String(body.message.contact.phone_number || "").trim());
      if (phone) {
        const supabaseContact = await serverSupabaseServiceRole(event);
        const { data: tokenForPhone } = await supabaseContact.from("auth_tokens").select("token, bridge_payload").eq("channel", "telegram").eq("telegram_id", chatId2).gt("expires_at", (/* @__PURE__ */ new Date()).toISOString()).order("expires_at", { ascending: false }).limit(1).maybeSingle();
        if (tokenForPhone == null ? void 0 : tokenForPhone.token) {
          const prev = (_h = tokenForPhone.bridge_payload) != null ? _h : {};
          await supabaseContact.from("auth_tokens").update({
            bridge_payload: { ...prev, telegram_shared_phone: phone }
          }).eq("token", tokenForPhone.token);
          const { data: profile } = await supabaseContact.from("profiles").select("id").eq("telegram_id", chatId2).maybeSingle();
          if (profile == null ? void 0 : profile.id) {
            await setProfilePhone(supabaseContact, String(profile.id), phone);
          }
          try {
            await telegram(botToken, "sendMessage", {
              chat_id: chatId2,
              text: "\u041D\u043E\u043C\u0435\u0440 \u0441\u043E\u0445\u0440\u0430\u043D\u0451\u043D. \u0417\u0430\u0432\u0435\u0440\u0448\u0438\u0442\u0435 \u0432\u0445\u043E\u0434 \u043D\u0430 \u0441\u0430\u0439\u0442\u0435.",
              reply_markup: { remove_keyboard: true }
            });
          } catch (e) {
            console.error("telegram contact ack:", e);
          }
          return { ok: true };
        }
      }
      return { ok: true };
    }
    if ((_i = body.message) == null ? void 0 : _i.text) {
      const chatId2 = (_j = body.message.chat) == null ? void 0 : _j.id;
      if (chatId2 === void 0) return { ok: true };
      const text = (body.message.text || "").trim();
      const [commandRaw, paramRaw] = text.split(" ");
      const isStart = commandRaw === "/start" || commandRaw.startsWith("/start@");
      const isLogin = commandRaw === "/login" || commandRaw.startsWith("/login@");
      if (isStart) {
        const startParam = paramRaw || "";
        const appUrlBase2 = (config.appUrl || "").replace(/\/$/, "");
        const linkSessionMatch = /^link_([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i.exec(
          startParam
        );
        if (linkSessionMatch && appUrlBase2) {
          const tokenUuid = linkSessionMatch[1];
          const supabase2 = await serverSupabaseServiceRole(event);
          const { data: row, error: fetchErr } = await supabase2.from("auth_tokens").select("token, telegram_id, expires_at, bridge_payload, channel").eq("token", tokenUuid).maybeSingle();
          if (fetchErr) {
            console.error("link_ session fetch:", fetchErr);
            await telegram(botToken, "sendMessage", {
              chat_id: chatId2,
              text: "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C \u0441\u0441\u044B\u043B\u043A\u0443. \u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u043F\u043E\u0437\u0436\u0435."
            });
            return { ok: true };
          }
          if (!row || String(row.channel || "telegram") !== "telegram") {
            await telegram(botToken, "sendMessage", {
              chat_id: chatId2,
              text: "\u0421\u0441\u044B\u043B\u043A\u0430 \u043D\u0435\u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0442\u0435\u043B\u044C\u043D\u0430 \u0438\u043B\u0438 \u0443\u0441\u0442\u0430\u0440\u0435\u043B\u0430. \u0417\u0430\u043F\u0440\u043E\u0441\u0438\u0442\u0435 \u0432\u0445\u043E\u0434 \u043D\u0430 \u0441\u0430\u0439\u0442\u0435 \u0435\u0449\u0451 \u0440\u0430\u0437."
            });
            return { ok: true };
          }
          const expiresAt = new Date(String(row.expires_at)).getTime();
          if (Number.isFinite(expiresAt) && expiresAt < Date.now()) {
            await supabase2.from("auth_tokens").delete().eq("token", tokenUuid);
            await telegram(botToken, "sendMessage", {
              chat_id: chatId2,
              text: "\u0421\u0440\u043E\u043A \u0441\u0441\u044B\u043B\u043A\u0438 \u0438\u0441\u0442\u0451\u043A. \u0412\u0435\u0440\u043D\u0438\u0442\u0435\u0441\u044C \u043D\u0430 \u0441\u0430\u0439\u0442 \u0438 \u0437\u0430\u043F\u0440\u043E\u0441\u0438\u0442\u0435 \u0432\u0445\u043E\u0434 \u0441\u043D\u043E\u0432\u0430."
            });
            return { ok: true };
          }
          const existingTg = row.telegram_id;
          if (existingTg != null && existingTg !== chatId2) {
            await telegram(botToken, "sendMessage", {
              chat_id: chatId2,
              text: "\u042D\u0442\u0430 \u0441\u0441\u044B\u043B\u043A\u0430 \u0443\u0436\u0435 \u0431\u044B\u043B\u0430 \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u043D\u0430 \u0432 \u0434\u0440\u0443\u0433\u043E\u043C Telegram-\u0430\u043A\u043A\u0430\u0443\u043D\u0442\u0435. \u0417\u0430\u043F\u0440\u043E\u0441\u0438\u0442\u0435 \u043D\u043E\u0432\u0443\u044E \u043D\u0430 \u0441\u0430\u0439\u0442\u0435."
            });
            return { ok: true };
          }
          if (existingTg == null) {
            const { data: updated, error: updErr } = await supabase2.from("auth_tokens").update({ telegram_id: chatId2 }).eq("token", tokenUuid).is("telegram_id", null).select("token").maybeSingle();
            if (updErr) {
              console.error("link_ session update:", updErr);
              await telegram(botToken, "sendMessage", {
                chat_id: chatId2,
                text: "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u044C \u0432\u0445\u043E\u0434. \u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u043F\u043E\u0437\u0436\u0435."
              });
              return { ok: true };
            }
            if (!updated) {
              const { data: again } = await supabase2.from("auth_tokens").select("telegram_id").eq("token", tokenUuid).maybeSingle();
              const rid = again == null ? void 0 : again.telegram_id;
              if (rid != null && rid !== chatId2) {
                await telegram(botToken, "sendMessage", {
                  chat_id: chatId2,
                  text: "\u042D\u0442\u0430 \u0441\u0441\u044B\u043B\u043A\u0430 \u0443\u0436\u0435 \u0431\u044B\u043B\u0430 \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u043D\u0430 \u0432 \u0434\u0440\u0443\u0433\u043E\u043C Telegram-\u0430\u043A\u043A\u0430\u0443\u043D\u0442\u0435. \u0417\u0430\u043F\u0440\u043E\u0441\u0438\u0442\u0435 \u043D\u043E\u0432\u0443\u044E \u043D\u0430 \u0441\u0430\u0439\u0442\u0435."
                });
                return { ok: true };
              }
            }
          }
          const phoneFromMessage = normalizePhone(((_l = (_k = body.message.contact) == null ? void 0 : _k.phone_number) == null ? void 0 : _l.trim()) || "");
          const baseBridge = (_m = row.bridge_payload) != null ? _m : null;
          const bridgePayload = phoneFromMessage ? { ...baseBridge || {}, telegram_shared_phone: phoneFromMessage } : baseBridge;
          if (phoneFromMessage) {
            await supabase2.from("auth_tokens").update({ bridge_payload: bridgePayload }).eq("token", tokenUuid);
          }
          const link = buildAuthSiteLinkUrl({
            linkPath: "link-telegram",
            appUrlBase: appUrlBase2,
            defaultCitySlug,
            token: tokenUuid,
            bridgePayload: bridgePayload != null ? bridgePayload : null,
            tenantShop: tenant == null ? void 0 : tenant.shop
          });
          const replyMarkup = {
            inline_keyboard: [
              [{ text: "\u041F\u0440\u0438\u0432\u044F\u0437\u0430\u0442\u044C \u0430\u043A\u043A\u0430\u0443\u043D\u0442 \u0438 \u043E\u0442\u043A\u0440\u044B\u0442\u044C \u0441\u0430\u0439\u0442", url: link }],
              [{ text: "\u0421\u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0441\u0441\u044B\u043B\u043A\u0443 \u0434\u043B\u044F \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0430", copy_text: { text: link } }]
            ]
          };
          const contactReplyMarkup = {
            keyboard: [[{ text: "\u041F\u043E\u0434\u0435\u043B\u0438\u0442\u044C\u0441\u044F \u043D\u043E\u043C\u0435\u0440\u043E\u043C", request_contact: true }]],
            resize_keyboard: true,
            one_time_keyboard: true
          };
          const { data: existingProfile } = await supabase2.from("profiles").select("id").eq("telegram_id", chatId2).maybeSingle();
          const existingPhone = (existingProfile == null ? void 0 : existingProfile.id) ? await getProfilePhone(supabase2, String(existingProfile.id)) : "";
          const shouldAskForContact = !(phoneFromMessage || existingPhone);
          try {
            await telegram(botToken, "sendMessage", {
              chat_id: chatId2,
              text: [
                "\u2705 Telegram \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0451\u043D.",
                "",
                "\u0412\u0435\u0440\u043D\u0438\u0442\u0435\u0441\u044C \u043D\u0430 \u0441\u0430\u0439\u0442 \u2014 \u0432\u0445\u043E\u0434 \u0437\u0430\u0432\u0435\u0440\u0448\u0438\u0442\u0441\u044F \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438. \u0415\u0441\u043B\u0438 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0430 \u043D\u0435 \u043E\u0431\u043D\u043E\u0432\u0438\u043B\u0430\u0441\u044C, \u043D\u0430\u0436\u043C\u0438\u0442\u0435 \u043A\u043D\u043E\u043F\u043A\u0443 \xAB\u041F\u0440\u0438\u0432\u044F\u0437\u0430\u0442\u044C \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u2026\xBB \u0438\u043B\u0438 \u0441\u043A\u043E\u043F\u0438\u0440\u0443\u0439\u0442\u0435 \u0441\u0441\u044B\u043B\u043A\u0443 \u0438 \u043E\u0442\u043A\u0440\u043E\u0439\u0442\u0435 \u0435\u0451 \u0432 \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0435.",
                "",
                "\u0421\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u043C \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435\u043C \u043C\u043E\u0436\u043D\u043E \u043E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u043D\u043E\u043C\u0435\u0440 \u0442\u0435\u043B\u0435\u0444\u043E\u043D\u0430 \u0434\u043B\u044F \u0437\u0430\u043A\u0430\u0437\u043E\u0432 \u2014 \u044D\u0442\u043E \u043D\u0435\u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E."
              ].join("\n"),
              reply_markup: replyMarkup
            });
            if (shouldAskForContact) try {
              await telegram(botToken, "sendMessage", {
                chat_id: chatId2,
                text: "\u041D\u0430\u0436\u043C\u0438\u0442\u0435 \u043A\u043D\u043E\u043F\u043A\u0443 \u043D\u0438\u0436\u0435, \u0435\u0441\u043B\u0438 \u0445\u043E\u0442\u0438\u0442\u0435 \u0441\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u043D\u043E\u043C\u0435\u0440 \u0434\u043B\u044F \u0437\u0430\u043A\u0430\u0437\u043E\u0432.",
                reply_markup: contactReplyMarkup
              });
            } catch (e2) {
              console.warn("telegram request_contact keyboard failed:", e2);
            }
          } catch (e) {
            console.warn("sendMessage with copy_text failed, retrying without copy button:", e);
            await telegram(botToken, "sendMessage", {
              chat_id: chatId2,
              text: [
                "\u2705 Telegram \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0451\u043D.",
                "",
                "\u0412\u0435\u0440\u043D\u0438\u0442\u0435\u0441\u044C \u043D\u0430 \u0441\u0430\u0439\u0442. \u0415\u0441\u043B\u0438 \u0432\u0445\u043E\u0434 \u043D\u0435 \u0437\u0430\u0432\u0435\u0440\u0448\u0438\u043B\u0441\u044F, \u043E\u0442\u043A\u0440\u043E\u0439\u0442\u0435 \u0441\u0441\u044B\u043B\u043A\u0443:",
                link,
                "",
                "\u0421\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u043C \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435\u043C \u043C\u043E\u0436\u043D\u043E \u043E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u043D\u043E\u043C\u0435\u0440 \u0442\u0435\u043B\u0435\u0444\u043E\u043D\u0430 \u0434\u043B\u044F \u0437\u0430\u043A\u0430\u0437\u043E\u0432."
              ].join("\n"),
              reply_markup: {
                inline_keyboard: [[{ text: "\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u0441\u0430\u0439\u0442 \u0434\u043B\u044F \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0438\u044F \u0432\u0445\u043E\u0434\u0430", url: link }]]
              }
            });
            if (shouldAskForContact) try {
              await telegram(botToken, "sendMessage", {
                chat_id: chatId2,
                text: "\u041D\u0430\u0436\u043C\u0438\u0442\u0435 \u043A\u043D\u043E\u043F\u043A\u0443 \u043D\u0438\u0436\u0435, \u0435\u0441\u043B\u0438 \u0445\u043E\u0442\u0438\u0442\u0435 \u0441\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u043D\u043E\u043C\u0435\u0440 \u0434\u043B\u044F \u0437\u0430\u043A\u0430\u0437\u043E\u0432.",
                reply_markup: contactReplyMarkup
              });
            } catch (e2) {
              console.warn("telegram request_contact keyboard failed:", e2);
            }
          }
          return { ok: true };
        }
        const startParts = startParam.split("_");
        const startKey = startParts.slice(0, 2).join("_");
        if (startKey === "linkchat") {
          const token = startParts.slice(1).join("_").trim();
          if (!token) {
            await telegram(botToken, "sendMessage", {
              chat_id: chatId2,
              text: "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043F\u0440\u043E\u0447\u0438\u0442\u0430\u0442\u044C \u0442\u043E\u043A\u0435\u043D \u043F\u0440\u0438\u0432\u044F\u0437\u043A\u0438. \u0421\u0433\u0435\u043D\u0435\u0440\u0438\u0440\u0443\u0439\u0442\u0435 \u0441\u0441\u044B\u043B\u043A\u0443 \u0437\u0430\u043D\u043E\u0432\u043E \u0432 \u043A\u0430\u0431\u0438\u043D\u0435\u0442\u0435."
            });
            return { ok: true };
          }
          await telegram(botToken, "sendMessage", {
            chat_id: chatId2,
            text: [
              "\u0422\u043E\u043A\u0435\u043D \u043F\u0440\u0438\u0432\u044F\u0437\u043A\u0438 \u043F\u043E\u043B\u0443\u0447\u0435\u043D.",
              "\u0422\u0435\u043F\u0435\u0440\u044C \u0434\u043E\u0431\u0430\u0432\u044C\u0442\u0435 \u043C\u0435\u043D\u044F \u0432 \u043D\u0443\u0436\u043D\u0443\u044E \u0433\u0440\u0443\u043F\u043F\u0443 \u043C\u0435\u043D\u0435\u0434\u0436\u0435\u0440\u043E\u0432 \u0438 \u043E\u0442\u043F\u0440\u0430\u0432\u044C\u0442\u0435 \u0442\u0430\u043C \u043A\u043E\u043C\u0430\u043D\u0434\u0443:",
              `/bind ${token}`,
              "",
              "\u041F\u0440\u0438\u0432\u044F\u0437\u043A\u0443 \u043C\u043E\u0436\u0435\u0442 \u0437\u0430\u0432\u0435\u0440\u0448\u0438\u0442\u044C \u0442\u043E\u043B\u044C\u043A\u043E \u0430\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u043E\u0440 \u044D\u0442\u043E\u0439 \u0433\u0440\u0443\u043F\u043F\u044B."
            ].join("\n")
          });
          return { ok: true };
        }
        if (!startParam) {
          const replyMarkup = appUrl ? {
            inline_keyboard: [[{ text: "\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u043C\u0430\u0433\u0430\u0437\u0438\u043D", web_app: { url: appUrl } }]]
          } : void 0;
          await telegram(botToken, "sendMessage", {
            chat_id: chatId2,
            text: "\u0414\u043E\u0431\u0440\u043E \u043F\u043E\u0436\u0430\u043B\u043E\u0432\u0430\u0442\u044C! \u041D\u0430\u0436\u043C\u0438\u0442\u0435 \u043A\u043D\u043E\u043F\u043A\u0443 \u043D\u0438\u0436\u0435, \u0447\u0442\u043E\u0431\u044B \u043E\u0442\u043A\u0440\u044B\u0442\u044C \u043C\u0430\u0433\u0430\u0437\u0438\u043D.",
            reply_markup: replyMarkup
          });
          return { ok: true };
        }
        await telegram(botToken, "sendMessage", {
          chat_id: chatId2,
          text: [
            "\u0427\u0442\u043E\u0431\u044B \u0432\u043E\u0439\u0442\u0438 \u043D\u0430 \u0441\u0430\u0439\u0442, \u043E\u0442\u043A\u0440\u043E\u0439\u0442\u0435 \u043C\u0430\u0433\u0430\u0437\u0438\u043D \u0432 \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0435 \u0438 \u043D\u0430\u0436\u043C\u0438\u0442\u0435 \xAB\u0412\u043E\u0439\u0442\u0438 \u0447\u0435\u0440\u0435\u0437 Telegram\xBB.",
            "\u0421\u0430\u0439\u0442 \u0441\u043E\u0437\u0434\u0430\u0441\u0442 \u043E\u0434\u043D\u043E\u0440\u0430\u0437\u043E\u0432\u0443\u044E \u0441\u0441\u044B\u043B\u043A\u0443 \u2014 \u043E\u0442\u043A\u0440\u043E\u0439\u0442\u0435 \u0435\u0451 \u0437\u0434\u0435\u0441\u044C, \u0432 \u0447\u0430\u0442\u0435 \u0441 \u0431\u043E\u0442\u043E\u043C."
          ].join("\n")
        });
        return { ok: true };
      }
      if (isLogin) {
        await telegram(botToken, "sendMessage", {
          chat_id: chatId2,
          text: [
            "\u0412\u0445\u043E\u0434 \u0432\u044B\u043F\u043E\u043B\u043D\u044F\u0435\u0442\u0441\u044F \u0447\u0435\u0440\u0435\u0437 \u0441\u0430\u0439\u0442.",
            "\u041E\u0442\u043A\u0440\u043E\u0439\u0442\u0435 \u043C\u0430\u0433\u0430\u0437\u0438\u043D \u0432 \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0435 \u0438 \u043D\u0430\u0436\u043C\u0438\u0442\u0435 \xAB\u0412\u043E\u0439\u0442\u0438 \u0447\u0435\u0440\u0435\u0437 Telegram\xBB \u2014 \u0432\u0430\u043C \u043E\u0442\u043A\u0440\u043E\u0435\u0442\u0441\u044F \u044D\u0442\u043E\u0442 \u0431\u043E\u0442 \u0441 \u0433\u043E\u0442\u043E\u0432\u043E\u0439 \u0441\u0441\u044B\u043B\u043A\u043E\u0439."
          ].join("\n")
        });
        return { ok: true };
      }
      const bindToken = parseBindToken(text);
      if (bindToken) {
        const fromId = (_n = body.message.from) == null ? void 0 : _n.id;
        const chatType = (((_o = body.message.chat) == null ? void 0 : _o.type) || "").toLowerCase();
        const isGroupChat = chatType === "group" || chatType === "supergroup";
        if (!isGroupChat) {
          await telegram(botToken, "sendMessage", {
            chat_id: chatId2,
            text: "\u041A\u043E\u043C\u0430\u043D\u0434\u0430 /bind \u0440\u0430\u0431\u043E\u0442\u0430\u0435\u0442 \u0442\u043E\u043B\u044C\u043A\u043E \u0432 \u0433\u0440\u0443\u043F\u043F\u0435. \u041E\u0442\u043F\u0440\u0430\u0432\u044C\u0442\u0435 \u0435\u0451 \u0432 \u0447\u0430\u0442\u0435 \u043C\u0435\u043D\u0435\u0434\u0436\u0435\u0440\u043E\u0432."
          });
          return { ok: true };
        }
        if (!fromId) {
          await telegram(botToken, "sendMessage", {
            chat_id: chatId2,
            text: "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043E\u043F\u0440\u0435\u0434\u0435\u043B\u0438\u0442\u044C \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F. \u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u0435 \u043A\u043E\u043C\u0430\u043D\u0434\u0443 \u043F\u043E\u0437\u0436\u0435."
          });
          return { ok: true };
        }
        const supabase2 = await serverSupabaseServiceRole(event);
        const { data: tokenRow } = await supabase2.from("telegram_chat_link_tokens").select("token,shop_id,restaurant_id,expires_at,used_at").eq("token", bindToken).maybeSingle();
        if (!tokenRow) {
          await telegram(botToken, "sendMessage", {
            chat_id: chatId2,
            text: "\u0422\u043E\u043A\u0435\u043D \u043F\u0440\u0438\u0432\u044F\u0437\u043A\u0438 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D. \u0421\u0433\u0435\u043D\u0435\u0440\u0438\u0440\u0443\u0439\u0442\u0435 \u043D\u043E\u0432\u0443\u044E \u0441\u0441\u044B\u043B\u043A\u0443 \u0432 \u043A\u0430\u0431\u0438\u043D\u0435\u0442\u0435."
          });
          return { ok: true };
        }
        if (tokenRow.used_at) {
          await telegram(botToken, "sendMessage", {
            chat_id: chatId2,
            text: "\u042D\u0442\u043E\u0442 \u0442\u043E\u043A\u0435\u043D \u0443\u0436\u0435 \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u043D. \u0421\u0433\u0435\u043D\u0435\u0440\u0438\u0440\u0443\u0439\u0442\u0435 \u043D\u043E\u0432\u044B\u0439 \u0432 \u043A\u0430\u0431\u0438\u043D\u0435\u0442\u0435."
          });
          return { ok: true };
        }
        if (new Date(tokenRow.expires_at).getTime() < Date.now()) {
          await telegram(botToken, "sendMessage", {
            chat_id: chatId2,
            text: "\u0422\u043E\u043A\u0435\u043D \u0438\u0441\u0442\u0435\u043A. \u0421\u0433\u0435\u043D\u0435\u0440\u0438\u0440\u0443\u0439\u0442\u0435 \u043D\u043E\u0432\u044B\u0439 \u0432 \u043A\u0430\u0431\u0438\u043D\u0435\u0442\u0435."
          });
          return { ok: true };
        }
        const memberResult = await telegram(botToken, "getChatMember", {
          chat_id: chatId2,
          user_id: fromId
        }).catch(() => null);
        const memberStatus = String(((_p = memberResult == null ? void 0 : memberResult.result) == null ? void 0 : _p.status) || "").toLowerCase();
        if (!(memberStatus === "administrator" || memberStatus === "creator")) {
          await telegram(botToken, "sendMessage", {
            chat_id: chatId2,
            text: "\u0422\u043E\u043B\u044C\u043A\u043E \u0430\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u043E\u0440 \u0433\u0440\u0443\u043F\u043F\u044B \u043C\u043E\u0436\u0435\u0442 \u0432\u044B\u043F\u043E\u043B\u043D\u0438\u0442\u044C \u043F\u0440\u0438\u0432\u044F\u0437\u043A\u0443."
          });
          return { ok: true };
        }
        const chatIdValue = String(chatId2);
        const { data: existingRestaurant } = await supabase2.from("restaurants").select("id").eq("manager_group_chat_id", chatIdValue).neq("id", tokenRow.restaurant_id).maybeSingle();
        if (existingRestaurant == null ? void 0 : existingRestaurant.id) {
          await telegram(botToken, "sendMessage", {
            chat_id: chatId2,
            text: "\u042D\u0442\u043E\u0442 \u0447\u0430\u0442 \u0443\u0436\u0435 \u043F\u0440\u0438\u0432\u044F\u0437\u0430\u043D \u043A \u0434\u0440\u0443\u0433\u043E\u043C\u0443 \u0440\u0435\u0441\u0442\u043E\u0440\u0430\u043D\u0443."
          });
          return { ok: true };
        }
        const { data: updatedRestaurant, error: updateError } = await supabase2.from("restaurants").update({ manager_group_chat_id: chatIdValue }).eq("id", tokenRow.restaurant_id).eq("shop_id", tokenRow.shop_id).select("name").maybeSingle();
        if (updateError || !updatedRestaurant) {
          console.error("Bind chat update restaurant failed:", updateError);
          await telegram(botToken, "sendMessage", {
            chat_id: chatId2,
            text: "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0441\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u043F\u0440\u0438\u0432\u044F\u0437\u043A\u0443 \u0447\u0430\u0442\u0430. \u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0435\u0449\u0435 \u0440\u0430\u0437."
          });
          return { ok: true };
        }
        await supabase2.from("telegram_chat_link_tokens").update({ used_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("token", bindToken).is("used_at", null);
        await telegram(botToken, "sendMessage", {
          chat_id: chatId2,
          text: `\u0427\u0430\u0442 \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u043F\u0440\u0438\u0432\u044F\u0437\u0430\u043D \u043A \u0440\u0435\u0441\u0442\u043E\u0440\u0430\u043D\u0443 "${updatedRestaurant.name}".`
        });
        return { ok: true };
      }
      if (text === "/help") {
        await telegram(botToken, "sendMessage", {
          chat_id: chatId2,
          text: "\u041F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0430: \u0441\u0432\u044F\u0436\u0438\u0442\u0435\u0441\u044C \u0441 \u043D\u0430\u043C\u0438 \u0432 \u0447\u0430\u0442\u0435 \u0438\u043B\u0438 \u043F\u043E \u043A\u043E\u043D\u0442\u0430\u043A\u0442\u0430\u043C, \u0443\u043A\u0430\u0437\u0430\u043D\u043D\u044B\u043C \u0432 \u043E\u043F\u0438\u0441\u0430\u043D\u0438\u0438 \u0431\u043E\u0442\u0430."
        });
        return { ok: true };
      }
      return { ok: true };
    }
    const query = body.callback_query;
    if (!(query == null ? void 0 : query.data) || !query.message) {
      return { ok: true };
    }
    await processDueReviewPrompts(event, { limit: 8 }).catch(() => {
    });
    const rtParsed = parseReviewTokenCallback(String(query.data));
    if (rtParsed.ok) {
      const shopId = String((tenant == null ? void 0 : tenant.shopId) || "").trim();
      if (!shopId) {
        await telegram(botToken, "answerCallbackQuery", { callback_query_id: query.id, text: "\u041C\u0430\u0433\u0430\u0437\u0438\u043D \u043D\u0435 \u043E\u043F\u0440\u0435\u0434\u0435\u043B\u0451\u043D", show_alert: false });
        return { ok: true };
      }
      const feat = await isShopFeatureEnabled(event, shopId, "reputation_reviews_pro");
      if (!feat) {
        await telegram(botToken, "answerCallbackQuery", { callback_query_id: query.id, text: "\u041C\u043E\u0434\u0443\u043B\u044C \u043E\u0442\u0437\u044B\u0432\u043E\u0432 \u043E\u0442\u043A\u043B\u044E\u0447\u0451\u043D", show_alert: false });
        return { ok: true };
      }
      const fromId = Number((_q = query.from) == null ? void 0 : _q.id);
      const chatId2 = Number(query.message.chat.id);
      const messageId2 = Number(query.message.message_id);
      if (!Number.isFinite(fromId) || !Number.isFinite(chatId2) || !Number.isFinite(messageId2)) {
        await telegram(botToken, "answerCallbackQuery", { callback_query_id: query.id, text: "\u041D\u0435\u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u044B\u0439 \u0437\u0430\u043F\u0440\u043E\u0441", show_alert: false });
        return { ok: true };
      }
      try {
        if (rtParsed.action === "edit") {
          await applyReviewPromptTelegramCallback(event, {
            shopId,
            botToken,
            telegramUserId: fromId,
            chatId: chatId2,
            messageId: messageId2,
            token: rtParsed.token,
            action: "edit"
          });
        } else {
          await applyReviewPromptTelegramCallback(event, {
            shopId,
            botToken,
            telegramUserId: fromId,
            chatId: chatId2,
            messageId: messageId2,
            token: rtParsed.token,
            action: "rate",
            stars: rtParsed.stars
          });
        }
        await telegram(botToken, "answerCallbackQuery", {
          callback_query_id: query.id,
          text: rtParsed.action === "edit" ? "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u043E\u0446\u0435\u043D\u043A\u0443" : "\u0421\u043F\u0430\u0441\u0438\u0431\u043E!",
          show_alert: false
        });
      } catch (e) {
        console.error("review prompt telegram callback:", e);
        await telegram(botToken, "answerCallbackQuery", {
          callback_query_id: query.id,
          text: "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0441\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u043E\u0446\u0435\u043D\u043A\u0443",
          show_alert: false
        });
      }
      return { ok: true };
    }
    if (query.data.startsWith("ugc:")) {
      const parts = query.data.split(":");
      const actionKey = parts[1] || "";
      const submissionId = parts[2] || "";
      if (!submissionId) {
        await telegram(botToken, "answerCallbackQuery", { callback_query_id: query.id, text: "\u041D\u0435\u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u044B\u0439 UGC callback", show_alert: false });
        return { ok: true };
      }
      const mapAction = () => {
        if (actionKey === "approve_menu") return { action: "approve_menu", label: "\u041E\u043F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u043D\u043E \u0432 \u043C\u0435\u043D\u044E" };
        if (actionKey === "approve_menu_and_feed") return { action: "approve_menu_and_feed", label: "\u041E\u043F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u043D\u043E \u0432 \u043C\u0435\u043D\u044E \u0438 \u043B\u0435\u043D\u0442\u0435" };
        if (actionKey === "tag_food") return { action: "tag_category", category: "food", label: "\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044F: \u0415\u0434\u0430" };
        if (actionKey === "tag_stage") return { action: "tag_category", category: "stage", label: "\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044F: \u0421\u0446\u0435\u043D\u0430" };
        if (actionKey === "tag_vibe") return { action: "tag_category", category: "vibe", label: "\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044F: \u0412\u0430\u0439\u0431" };
        if (actionKey === "tag_quest") return { action: "tag_category", category: "quest", label: "\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044F: \u041A\u0432\u0435\u0441\u0442" };
        if (actionKey === "forward") return { action: "forward_to_corner", label: "\u041F\u0435\u0440\u0435\u0441\u043B\u0430\u043D\u043E \u043C\u0435\u043D\u0435\u0434\u0436\u0435\u0440\u0443 \u043A\u043E\u0440\u043D\u0435\u0440\u0430" };
        if (actionKey === "ban") return { action: "shadow_ban", label: "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D \u0432 \u0442\u0435\u043D\u0435\u0432\u043E\u0439 \u0431\u0430\u043D" };
        return { action: "reject", label: "\u041E\u0442\u043A\u043B\u043E\u043D\u0435\u043D\u043E" };
      };
      const mapped = mapAction();
      try {
        await applyFestivalModerationAction(event, {
          submissionId,
          action: mapped.action,
          category: mapped.category,
          actorChannel: "telegram",
          actorUserId: String(((_r = query.from) == null ? void 0 : _r.id) || "")
        });
        await telegram(botToken, "answerCallbackQuery", {
          callback_query_id: query.id,
          text: mapped.label,
          show_alert: false
        });
      } catch (err) {
        console.error("webhook ugc moderation failed:", err);
        await telegram(botToken, "answerCallbackQuery", {
          callback_query_id: query.id,
          text: "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043F\u0440\u0438\u043C\u0435\u043D\u0438\u0442\u044C \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435",
          show_alert: true
        });
      }
      return { ok: true };
    }
    const orderContactCb = parseOrderContactCallback(query.data);
    if (orderContactCb) {
      const managerChatId2 = String(((_t = (_s = query.message) == null ? void 0 : _s.chat) == null ? void 0 : _t.id) || "");
      const result = await handleTelegramOrderContactCallback(event, {
        botToken,
        orderId: orderContactCb.orderId,
        managerChatId: managerChatId2,
        callbackQueryId: query.id
      });
      await telegram(botToken, "answerCallbackQuery", {
        callback_query_id: query.id,
        text: result.alertText,
        show_alert: result.showAlert
      });
      return { ok: true };
    }
    const serviceCb = parseServiceCallbackData(query.data);
    const serviceContactCb = parseServiceContactCallbackData(query.data);
    if (serviceContactCb) {
      const supabase2 = await serverSupabaseServiceRole(event);
      const { serviceCallId } = serviceContactCb;
      const { data: callRow } = await supabase2.from("service_calls").select("id,shop_id,restaurant_id,order_id,customer_telegram_id,customer_max_user_id,customer_max_conversation_id,customer_profile_id").eq("id", serviceCallId).maybeSingle();
      if (!callRow) {
        await telegram(botToken, "answerCallbackQuery", { callback_query_id: query.id, text: "\u0417\u0430\u043F\u0440\u043E\u0441 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D", show_alert: false });
        return { ok: true };
      }
      const { data: restaurant } = await supabase2.from("restaurants").select("name").eq("id", callRow.restaurant_id).maybeSingle();
      const customerProfileId2 = typeof callRow.customer_profile_id === "string" ? String(callRow.customer_profile_id) : "";
      const knownPhone = customerProfileId2 ? await getProfilePhone(supabase2, customerProfileId2) : "";
      const customerTelegramIdRaw = Number(callRow.customer_telegram_id);
      const customerTelegramId2 = Number.isFinite(customerTelegramIdRaw) && customerTelegramIdRaw > 0 ? customerTelegramIdRaw : null;
      if (customerTelegramId2) {
        await telegram(botToken, "sendMessage", {
          chat_id: customerTelegramId2,
          text: knownPhone ? `\u041C\u0435\u043D\u0435\u0434\u0436\u0435\u0440 \u0440\u0435\u0441\u0442\u043E\u0440\u0430\u043D\u0430 "${String((restaurant == null ? void 0 : restaurant.name) || "\u0420\u0435\u0441\u0442\u043E\u0440\u0430\u043D")}" \u0445\u043E\u0447\u0435\u0442 \u0441\u0432\u044F\u0437\u0430\u0442\u044C\u0441\u044F \u0441 \u0432\u0430\u043C\u0438. \u0412\u0430\u0448 \u043D\u043E\u043C\u0435\u0440 \u0443\u0436\u0435 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D: ${knownPhone}.` : `\u041C\u0435\u043D\u0435\u0434\u0436\u0435\u0440 \u0440\u0435\u0441\u0442\u043E\u0440\u0430\u043D\u0430 "${String((restaurant == null ? void 0 : restaurant.name) || "\u0420\u0435\u0441\u0442\u043E\u0440\u0430\u043D")}" \u0445\u043E\u0447\u0435\u0442 \u0441\u0432\u044F\u0437\u0430\u0442\u044C\u0441\u044F \u0441 \u0432\u0430\u043C\u0438. \u041F\u043E\u0434\u0435\u043B\u0438\u0442\u044C\u0441\u044F \u043A\u043E\u043D\u0442\u0430\u043A\u0442\u043E\u043C?`,
          ...knownPhone ? {} : {
            reply_markup: {
              keyboard: [[{ text: "\u041F\u043E\u0434\u0435\u043B\u0438\u0442\u044C\u0441\u044F \u043D\u043E\u043C\u0435\u0440\u043E\u043C", request_contact: true }]],
              resize_keyboard: true,
              one_time_keyboard: true
            }
          }
        }).catch(() => {
        });
      }
      await telegram(botToken, "answerCallbackQuery", {
        callback_query_id: query.id,
        text: knownPhone ? `\u041D\u043E\u043C\u0435\u0440 \u043A\u043B\u0438\u0435\u043D\u0442\u0430: ${knownPhone}` : "\u0417\u0430\u043F\u0440\u043E\u0441 \u043A\u043E\u043D\u0442\u0430\u043A\u0442\u0430 \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D \u043A\u043B\u0438\u0435\u043D\u0442\u0443",
        show_alert: false
      });
      return { ok: true };
    }
    if (serviceCb) {
      const supabase2 = await serverSupabaseServiceRole(event);
      const actorTelegramId = String(((_u = query.from) == null ? void 0 : _u.id) || "").trim();
      const { action, serviceCallId } = serviceCb;
      if (!actorTelegramId) {
        await telegram(botToken, "answerCallbackQuery", {
          callback_query_id: query.id,
          text: "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043E\u043F\u0440\u0435\u0434\u0435\u043B\u0438\u0442\u044C \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F",
          show_alert: true
        });
        return { ok: true };
      }
      const { data: callRow } = await supabase2.from("service_calls").select("id,shop_id,restaurant_id,order_id,customer_telegram_id,customer_max_user_id,customer_max_conversation_id").eq("id", serviceCallId).maybeSingle();
      if (!callRow) {
        await telegram(botToken, "answerCallbackQuery", { callback_query_id: query.id, text: "\u0417\u0430\u043F\u0440\u043E\u0441 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D", show_alert: false });
        return { ok: true };
      }
      const { data: binding } = await supabase2.from("restaurant_staff_bot_bindings").select("id,display_name").eq("shop_id", callRow.shop_id).eq("restaurant_id", callRow.restaurant_id).eq("channel", "telegram").eq("external_user_id", actorTelegramId).maybeSingle();
      const nowIso = (/* @__PURE__ */ new Date()).toISOString();
      const nextStatus = mapActionToStatus(action);
      const updatePatch = { status: nextStatus, updated_at: nowIso };
      const { data: callCurrent } = await supabase2.from("service_calls").select("first_response_at").eq("id", serviceCallId).maybeSingle();
      if (!(callCurrent == null ? void 0 : callCurrent.first_response_at)) updatePatch.first_response_at = nowIso;
      if (nextStatus === "resolved") updatePatch.resolved_at = nowIso;
      await supabase2.from("service_calls").update(updatePatch).eq("id", serviceCallId);
      const actorName = typeof binding.display_name === "string" && binding.display_name.trim() ? String(binding.display_name).trim() : `\u0421\u043E\u0442\u0440\u0443\u0434\u043D\u0438\u043A ${actorTelegramId}`;
      const responseText = getStaffResponseText(action);
      await createServiceCallEvent(event, {
        serviceCallId,
        shopId: String(callRow.shop_id),
        restaurantId: String(callRow.restaurant_id),
        orderId: callRow.order_id ? String(callRow.order_id) : null,
        eventType: "staff_response",
        eventStatus: nextStatus,
        channel: "telegram",
        actorBindingId: (binding == null ? void 0 : binding.id) ? String(binding.id) : null,
        actorExternalUserId: actorTelegramId,
        actorDisplayName: actorName,
        message: responseText,
        extraPayload: { action }
      });
      const clientText2 = `\u041E\u0442\u0432\u0435\u0442 \u043F\u0435\u0440\u0441\u043E\u043D\u0430\u043B\u0430: ${responseText}`;
      const customerTelegramIdRaw = Number(callRow.customer_telegram_id);
      const customerTelegramId2 = Number.isFinite(customerTelegramIdRaw) && customerTelegramIdRaw > 0 ? customerTelegramIdRaw : null;
      if (customerTelegramId2) {
        await telegram(botToken, "sendMessage", { chat_id: customerTelegramId2, text: clientText2 }).catch(() => {
        });
      }
      const customerMaxUserId = typeof callRow.customer_max_user_id === "string" ? String(callRow.customer_max_user_id).trim() : "";
      const customerMaxConversationId = typeof callRow.customer_max_conversation_id === "string" ? String(callRow.customer_max_conversation_id).trim() : "";
      if ((customerMaxConversationId || customerMaxUserId) && maxApiBaseUrl && maxApiToken) {
        await sendMaxMessage(maxApiBaseUrl, maxApiToken, {
          conversationId: customerMaxConversationId || void 0,
          userId: customerMaxConversationId ? void 0 : customerMaxUserId || void 0,
          text: clientText2
        }).catch(() => {
        });
      }
      await telegram(botToken, "answerCallbackQuery", {
        callback_query_id: query.id,
        text: `\u041E\u0442\u0432\u0435\u0442 \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D: ${responseText}`,
        show_alert: false
      });
      return { ok: true };
    }
    const branchCb = parseBranchCallback(query.data);
    if (branchCb && ((_w = (_v = query.message) == null ? void 0 : _v.chat) == null ? void 0 : _w.id) != null && ((_x = query.message) == null ? void 0 : _x.message_id) != null) {
      const chatId2 = String(query.message.chat.id);
      const messageId2 = query.message.message_id;
      const currentText2 = query.message.text || "";
      const supabaseBranch = await serverSupabaseServiceRole(event);
      const { data: orderRow } = await supabaseBranch.from("orders").select("id,shop_id,restaurant_id,city_id,status,fulfillment_type,order_number,customer_telegram_id").eq("id", branchCb.orderId).maybeSingle();
      if (!orderRow) {
        await telegram(botToken, "answerCallbackQuery", {
          callback_query_id: query.id,
          text: "\u0417\u0430\u043A\u0430\u0437 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D",
          show_alert: false
        });
        return { ok: true };
      }
      const shopId = String(orderRow.shop_id);
      const allowed = await canManageOrderFromManagerChat(event, shopId, chatId2);
      if (!allowed) {
        await telegram(botToken, "answerCallbackQuery", {
          callback_query_id: query.id,
          text: "\u041D\u0435\u0442 \u0434\u043E\u0441\u0442\u0443\u043F\u0430 \u043A \u044D\u0442\u043E\u043C\u0443 \u0437\u0430\u043A\u0430\u0437\u0443",
          show_alert: true
        });
        return { ok: true };
      }
      const appUrlBaseBranch = (config.appUrl || "").replace(/\/$/, "");
      const dashboardOrderUrlBranch = appUrlBaseBranch ? `${appUrlBaseBranch}/dashboard/orders/${encodeURIComponent(branchCb.orderId)}` : "";
      const shopBranches = await loadActiveShopBranches(event, shopId);
      const flowConfigBranch = await getUnifiedFlowConfig(event, String(orderRow.restaurant_id || ""));
      if (branchCb.kind === "menu") {
        const currentBranchId = orderRow.restaurant_id ? String(orderRow.restaurant_id) : null;
        const picker = buildBranchPickerInlineKeyboard(shopBranches, branchCb.orderId, currentBranchId);
        const currentBranchName = currentBranchId ? (_y = shopBranches.find((b) => b.id === currentBranchId)) == null ? void 0 : _y.name : null;
        await telegram(botToken, "editMessageReplyMarkup", {
          chat_id: chatId2,
          message_id: messageId2,
          reply_markup: picker
        });
        await telegram(botToken, "answerCallbackQuery", {
          callback_query_id: query.id,
          text: currentBranchName ? `\u0421\u0435\u0439\u0447\u0430\u0441: ${currentBranchName}. \u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0444\u0438\u043B\u0438\u0430\u043B` : "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0444\u0438\u043B\u0438\u0430\u043B",
          show_alert: false
        });
        return { ok: true };
      }
      if (branchCb.kind === "cancel") {
        const keyboard2 = buildManagerOrderInlineKeyboard(
          await enrichManagerKeyboardFromOrder(event, {
            orderId: branchCb.orderId,
            fulfillmentType: String(orderRow.fulfillment_type || "delivery"),
            orderStatus: String(orderRow.status || "new"),
            dashboardOrderUrl: dashboardOrderUrlBranch,
            etaButtonsEnabled: flowConfigBranch.etaButtonsEnabled,
            etaPresets: flowConfigBranch.etaPresets,
            branchPickerEnabled: shopBranches.length > 1
          })
        );
        await telegram(botToken, "editMessageReplyMarkup", {
          chat_id: chatId2,
          message_id: messageId2,
          reply_markup: keyboard2
        });
        await telegram(botToken, "answerCallbackQuery", { callback_query_id: query.id });
        return { ok: true };
      }
      const assignResult = await assignOrderBranchFromChat(event, {
        orderId: branchCb.orderId,
        branchIndex: branchCb.branchIndex,
        source: "telegram",
        actorUserId: String(((_z = query.from) == null ? void 0 : _z.id) || ""),
        managerChatId: chatId2
      });
      if (!assignResult.ok) {
        const alertText = assignResult.reason === "same_branch" ? "\u0417\u0430\u043A\u0430\u0437 \u0443\u0436\u0435 \u043D\u0430 \u044D\u0442\u043E\u043C \u0444\u0438\u043B\u0438\u0430\u043B\u0435" : assignResult.reason === "forbidden" ? "\u041D\u0435\u0442 \u0434\u043E\u0441\u0442\u0443\u043F\u0430" : "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0441\u043C\u0435\u043D\u0438\u0442\u044C \u0444\u0438\u043B\u0438\u0430\u043B";
        await telegram(botToken, "answerCallbackQuery", {
          callback_query_id: query.id,
          text: alertText,
          show_alert: assignResult.reason !== "same_branch"
        });
        return { ok: true };
      }
      const cityId = orderRow.city_id ? String(orderRow.city_id) : null;
      await syncTelegramChatsAfterBranchTransfer(event, {
        botToken,
        shopId,
        orderId: branchCb.orderId,
        cityId,
        previousBranchId: assignResult.previousBranchId,
        newBranchId: assignResult.branchId,
        newBranchName: assignResult.branchName,
        branches: shopBranches,
        actingChatId: chatId2,
        actingMessageId: messageId2
      });
      await telegram(botToken, "answerCallbackQuery", {
        callback_query_id: query.id,
        text: `\u0424\u0438\u043B\u0438\u0430\u043B: ${assignResult.branchName}`,
        show_alert: false
      });
      return { ok: true };
    }
    const parsed = parseCallbackData(query.data);
    const isEtaCallback = query.data.startsWith("etaWork_") || query.data.startsWith("etaCourier_");
    if (isEtaCallback) {
      const [, minsRaw = "", orderIdRaw = ""] = query.data.split("_");
      const orderId2 = orderIdRaw.trim();
      const mins = Number(minsRaw);
      if (!orderId2 || !Number.isFinite(mins) || mins <= 0) {
        await telegram(botToken, "answerCallbackQuery", { callback_query_id: query.id, text: "\u041D\u0435\u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u044B\u0439 ETA", show_alert: false });
        return { ok: true };
      }
      const supabase2 = await serverSupabaseServiceRole(event);
      const { data: order } = await supabase2.from("orders").select("id,shop_id,restaurant_id,customer_telegram_id").eq("id", orderId2).maybeSingle();
      if (!order) {
        await telegram(botToken, "answerCallbackQuery", { callback_query_id: query.id, text: "\u0417\u0430\u043A\u0430\u0437 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D", show_alert: false });
        return { ok: true };
      }
      await getUnifiedFlowConfig(event, String(order.restaurant_id || ""));
      await appendOrderTimelineEntry(event, {
        orderId: orderId2,
        shopId: String(order.shop_id),
        label: `ETA \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D \u0438\u0437 Telegram: ~${Math.floor(mins)} \u043C\u0438\u043D`,
        source: "telegram",
        userId: String(((_A = query.from) == null ? void 0 : _A.id) || ""),
        comment: null
      });
      const customerTelegramId2 = Number(order.customer_telegram_id);
      if (Number.isFinite(customerTelegramId2) && customerTelegramId2 > 0) {
        await telegram(botToken, "sendMessage", {
          chat_id: customerTelegramId2,
          text: `\u23F1 \u041E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0435 \u043F\u043E \u0437\u0430\u043A\u0430\u0437\u0443 ${formatOrderRef(order.order_number, orderId2)}: \u043E\u0440\u0438\u0435\u043D\u0442\u0438\u0440\u043E\u0432\u043E\u0447\u043D\u043E ${Math.floor(mins)} \u043C\u0438\u043D.`
        }).catch(() => {
        });
      }
      await telegram(botToken, "answerCallbackQuery", {
        callback_query_id: query.id,
        text: `ETA: ${Math.floor(mins)} \u043C\u0438\u043D`,
        show_alert: false
      });
      return { ok: true };
    }
    if (query.data.startsWith("clientDelay_")) {
      const orderId2 = query.data.slice("clientDelay_".length).trim();
      if (!orderId2) {
        await telegram(botToken, "answerCallbackQuery", { callback_query_id: query.id, text: "\u041D\u0435\u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u044B\u0439 \u0441\u0438\u0433\u043D\u0430\u043B", show_alert: false });
        return { ok: true };
      }
      const supabase2 = await serverSupabaseServiceRole(event);
      const signalKey = `client_delay_signal:${orderId2}:${query.from.id}`;
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1e3).toISOString();
      const { data: existingSignal } = await supabase2.from("notification_events").select("id,updated_at").eq("notification_key", signalKey).gte("updated_at", fiveMinutesAgo).maybeSingle();
      if (existingSignal == null ? void 0 : existingSignal.id) {
        await telegram(botToken, "answerCallbackQuery", {
          callback_query_id: query.id,
          text: "\u0421\u0438\u0433\u043D\u0430\u043B \u0443\u0436\u0435 \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D \u043D\u0435\u0434\u0430\u0432\u043D\u043E, \u043F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u0435 \u0447\u0443\u0442\u044C \u043F\u043E\u0437\u0436\u0435",
          show_alert: false
        });
        return { ok: true };
      }
      const { data: order } = await supabase2.from("orders").select("id,order_number,shop_id,restaurant_id,customer_telegram_id").eq("id", orderId2).maybeSingle();
      if (!order) {
        await telegram(botToken, "answerCallbackQuery", { callback_query_id: query.id, text: "\u0417\u0430\u043A\u0430\u0437 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D", show_alert: false });
        return { ok: true };
      }
      const { data: branch2 } = await supabase2.from("restaurants").select("name,manager_group_chat_id").eq("id", order.restaurant_id).maybeSingle();
      const managerChatId2 = typeof (branch2 == null ? void 0 : branch2.manager_group_chat_id) === "string" ? String(branch2.manager_group_chat_id).trim() : "";
      if (!managerChatId2) {
        await telegram(botToken, "answerCallbackQuery", {
          callback_query_id: query.id,
          text: "\u0427\u0430\u0442 \u043C\u0435\u043D\u0435\u0434\u0436\u0435\u0440\u043E\u0432 \u043D\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043D",
          show_alert: true
        });
        return { ok: true };
      }
      await telegram(botToken, "sendMessage", {
        chat_id: managerChatId2,
        text: [
          "\u26A0\uFE0F \u041A\u043B\u0438\u0435\u043D\u0442 \u0441\u043E\u043E\u0431\u0449\u0438\u043B \u043E \u0437\u0430\u0434\u0435\u0440\u0436\u043A\u0435",
          `\u{1F4E6} \u0417\u0430\u043A\u0430\u0437 ${formatOrderRef(order.order_number, orderId2)}`,
          `\u{1F3EA} \u0424\u0438\u043B\u0438\u0430\u043B: ${String((branch2 == null ? void 0 : branch2.name) || "\u2014")}`,
          `\u{1F464} \u041A\u043B\u0438\u0435\u043D\u0442: id:${query.from.id}`
        ].join("\n"),
        reply_markup: {
          inline_keyboard: [[{ text: "\u{1F4DE} \u0421\u0432\u044F\u0437\u0430\u0442\u044C\u0441\u044F \u0441 \u043A\u043B\u0438\u0435\u043D\u0442\u043E\u043C", callback_data: `orderContact__${orderId2}` }]]
        }
      });
      await supabase2.from("notification_events").upsert({
        notification_key: signalKey,
        event_type: "ORDER_STATUS_CHANGED",
        channel: "telegram",
        shop_id: order.shop_id,
        restaurant_id: order.restaurant_id,
        conversation_id: managerChatId2,
        delivery_status: "sent",
        attempt_count: 1,
        payload: { orderId: orderId2, fromTelegramId: query.from.id, source: "client_delay_signal" },
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      }, { onConflict: "notification_key" });
      await telegram(botToken, "answerCallbackQuery", {
        callback_query_id: query.id,
        text: "\u0421\u0438\u0433\u043D\u0430\u043B \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D \u043C\u0435\u043D\u0435\u0434\u0436\u0435\u0440\u0443 \u0440\u0435\u0441\u0442\u043E\u0440\u0430\u043D\u0430",
        show_alert: false
      });
      return { ok: true };
    }
    if (!parsed) {
      await telegram(botToken, "answerCallbackQuery", { callback_query_id: query.id });
      return { ok: true };
    }
    const { kind, status, userId: legacyUserId, orderId } = parsed;
    const chatId = query.message.chat.id;
    const messageId = query.message.message_id;
    const currentText = query.message.text || "";
    const supabase = await serverSupabaseServiceRole(event);
    const { data: orderDetails } = await supabase.from("orders").select("id,shop_id,total,delivery_cost,restaurant_id,status,fulfillment_type,customer_telegram_id,customer_profile_id,order_number").eq("id", orderId).maybeSingle();
    if (!orderDetails) {
      await telegram(botToken, "answerCallbackQuery", {
        callback_query_id: query.id,
        text: "\u0417\u0430\u043A\u0430\u0437 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D",
        show_alert: false
      });
      return { ok: true };
    }
    const managerChatId = String(((_C = (_B = query.message) == null ? void 0 : _B.chat) == null ? void 0 : _C.id) || "");
    const orderShopId = String(orderDetails.shop_id);
    if (managerChatId && !await canManageOrderFromManagerChat(event, orderShopId, managerChatId)) {
      await telegram(botToken, "answerCallbackQuery", {
        callback_query_id: query.id,
        text: "\u041D\u0435\u0442 \u0434\u043E\u0441\u0442\u0443\u043F\u0430 \u043A \u044D\u0442\u043E\u043C\u0443 \u0437\u0430\u043A\u0430\u0437\u0443",
        show_alert: true
      });
      return { ok: true };
    }
    const orderRef = formatOrderRef(orderDetails == null ? void 0 : orderDetails.order_number, orderId);
    const flowConfig = await getUnifiedFlowConfig(event, String((orderDetails == null ? void 0 : orderDetails.restaurant_id) || ""));
    const unifiedFlowEnabled = flowConfig.unifiedOrderFlowEnabled;
    const customerProfileId = (orderDetails == null ? void 0 : orderDetails.customer_profile_id) ? String(orderDetails.customer_profile_id) : "";
    let maxUserId = null;
    let maxConversationId = null;
    if (customerProfileId) {
      const { data: profile } = await supabase.from("profiles").select("max_user_id,max_conversation_id,telegram_id").eq("id", customerProfileId).maybeSingle();
      const rawMaxUserId = profile == null ? void 0 : profile.max_user_id;
      const rawConversationId = profile == null ? void 0 : profile.max_conversation_id;
      maxUserId = typeof rawMaxUserId === "string" && rawMaxUserId.trim() ? rawMaxUserId.trim() : null;
      maxConversationId = typeof rawConversationId === "string" && rawConversationId.trim() ? rawConversationId.trim() : null;
    }
    const telegramIdFromOrder = Number(orderDetails == null ? void 0 : orderDetails.customer_telegram_id);
    const telegramIdFromLegacy = Number(legacyUserId || "");
    const customerTelegramId = Number.isFinite(telegramIdFromOrder) && telegramIdFromOrder > 0 ? telegramIdFromOrder : Number.isFinite(telegramIdFromLegacy) && telegramIdFromLegacy > 0 ? telegramIdFromLegacy : null;
    const { data: branch } = (orderDetails == null ? void 0 : orderDetails.restaurant_id) ? await supabase.from("restaurants").select("name,address").eq("id", orderDetails.restaurant_id).maybeSingle() : { data: null };
    const enrichedText = (base) => appendOrderDetails(base, {
      branchName: String((branch == null ? void 0 : branch.name) || "\u2014"),
      branchAddress: String((branch == null ? void 0 : branch.address) || "\u2014"),
      orderTotal: Number((orderDetails == null ? void 0 : orderDetails.total) || 0),
      deliveryCost: Number((orderDetails == null ? void 0 : orderDetails.delivery_cost) || 0)
    });
    if (kind === "delay") {
      const baseStatus = status === "courier" ? "courier" : "work";
      if (unifiedFlowEnabled) {
        await appendOrderTimelineEntry(event, {
          orderId,
          shopId: String(orderDetails.shop_id),
          label: `\u0421\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435 \u043E \u0437\u0430\u0434\u0435\u0440\u0436\u043A\u0435 \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u043E \u043A\u043B\u0438\u0435\u043D\u0442\u0443 (${baseStatus === "courier" ? "\u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0430" : "\u043A\u0443\u0445\u043D\u044F"})`,
          source: "telegram",
          userId: String(((_D = query.from) == null ? void 0 : _D.id) || ""),
          comment: null
        });
      }
      const clientDelayText = (_E = CLIENT_DELAY_MESSAGES[baseStatus]) == null ? void 0 : _E.call(CLIENT_DELAY_MESSAGES, orderRef);
      if (clientDelayText) {
        if (customerTelegramId) {
          await telegram(botToken, "sendMessage", {
            chat_id: customerTelegramId,
            text: enrichedText(clientDelayText)
          }).catch((err) => console.error("Notify client delay error:", err));
        }
        if ((maxUserId || maxConversationId) && maxApiBaseUrl && maxApiToken) {
          await sendMaxMessage(maxApiBaseUrl, maxApiToken, {
            userId: maxUserId,
            conversationId: maxConversationId,
            text: enrichedText(clientDelayText)
          }).catch((err) => console.error("Notify MAX client delay error:", err));
        }
      }
      await telegram(botToken, "answerCallbackQuery", {
        callback_query_id: query.id,
        text: "\u0418\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044F \u043E \u0437\u0430\u0434\u0435\u0440\u0436\u043A\u0435 \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0430 \u043A\u043B\u0438\u0435\u043D\u0442\u0443",
        show_alert: false
      });
      return { ok: true };
    }
    const fulfillmentType = String(orderDetails.fulfillment_type || "delivery");
    if (unifiedFlowEnabled) {
      const nextStatus = mapChatCallbackToOrderStatus(status);
      await applyOrderStatusFromChat(event, {
        orderId,
        status: nextStatus,
        source: "telegram",
        actorUserId: String(((_F = query.from) == null ? void 0 : _F.id) || "")
      });
    }
    const clientText = (_G = CLIENT_MESSAGES[status]) == null ? void 0 : _G.call(CLIENT_MESSAGES, orderRef);
    if (clientText && !unifiedFlowEnabled) {
      if (customerTelegramId) {
        await telegram(botToken, "sendMessage", {
          chat_id: customerTelegramId,
          text: enrichedText(clientText),
          reply_markup: status === "done" ? void 0 : { inline_keyboard: [[{ text: "\u23F1 \u0421\u043E\u043E\u0431\u0449\u0438\u0442\u044C \u043E \u0437\u0430\u0434\u0435\u0440\u0436\u043A\u0435", callback_data: `clientDelay_${orderId}` }]] }
        }).catch((err) => console.error("Notify client error:", err));
      }
      if ((maxUserId || maxConversationId) && maxApiBaseUrl && maxApiToken) {
        const maxButtons = [];
        if (status !== "done" && maxBotUrl) {
          const maxDelayUrl = `${maxBotUrl}${maxBotUrl.includes("?") ? "&" : "?"}startapp=${encodeURIComponent(`orderdelay_${orderId}`)}`;
          maxButtons.push([{ type: "link", text: "\u0421\u043E\u043E\u0431\u0449\u0438\u0442\u044C \u043E \u0437\u0430\u0434\u0435\u0440\u0436\u043A\u0435", url: maxDelayUrl }]);
        }
        await sendMaxMessage(maxApiBaseUrl, maxApiToken, {
          userId: maxUserId,
          conversationId: maxConversationId,
          text: enrichedText(clientText),
          attachments: maxButtons.length ? [{ type: "inline_keyboard", payload: { buttons: maxButtons } }] : void 0
        }).catch((err) => console.error("Notify MAX client error:", err));
      }
    }
    const appUrlBaseStatus = (config.appUrl || "").replace(/\/$/, "");
    const dashboardOrderUrlStatus = appUrlBaseStatus ? `${appUrlBaseStatus}/dashboard/orders/${encodeURIComponent(orderId)}` : "";
    const shopBranchesStatus = await loadActiveShopBranches(event, orderShopId);
    const nextDbStatus = unifiedFlowEnabled ? mapChatCallbackToOrderStatus(status) : String(orderDetails.status || "new");
    const updatedText = withStatusLine(currentText, managerStatusLine(status, fulfillmentType));
    const keyboardBase = {
      orderId,
      fulfillmentType,
      dashboardOrderUrl: dashboardOrderUrlStatus,
      etaButtonsEnabled: flowConfig.etaButtonsEnabled,
      etaPresets: flowConfig.etaPresets,
      branchPickerEnabled: shopBranchesStatus.length > 1
    };
    const keyboard = status === "done" ? buildManagerOrderInlineKeyboard(
      await enrichManagerKeyboardFromOrder(event, {
        ...keyboardBase,
        orderStatus: "handed_to_customer",
        branchPickerEnabled: false
      })
    ) : buildManagerOrderInlineKeyboard(
      await enrichManagerKeyboardFromOrder(event, {
        ...keyboardBase,
        orderStatus: nextDbStatus
      })
    );
    await telegram(botToken, "editMessageText", {
      chat_id: chatId,
      message_id: messageId,
      text: updatedText,
      reply_markup: keyboard.inline_keyboard.length ? keyboard : void 0
    });
    await telegram(botToken, "answerCallbackQuery", { callback_query_id: query.id });
    return { ok: true };
  } catch (error) {
    console.error("webhook telegram handler failed:", error);
    return { ok: true };
  }
});

const webhook_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: webhook_post
}, Symbol.toStringTag, { value: 'Module' }));

const webhookRelay_post = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: webhook_post
}, Symbol.toStringTag, { value: 'Module' }));

const yookassa_post = defineEventHandler(async (event) => {
  var _a, _b, _c;
  const payload = await readBody(event);
  const providerPaymentId = typeof ((_a = payload == null ? void 0 : payload.object) == null ? void 0 : _a.id) === "string" ? payload.object.id.trim() : "";
  const eventName = typeof (payload == null ? void 0 : payload.event) === "string" ? payload.event : "";
  const eventIdRaw = typeof (payload == null ? void 0 : payload.id) === "string" ? payload.id : "";
  const eventId = eventIdRaw || `${eventName}:${providerPaymentId}:${((_b = payload == null ? void 0 : payload.object) == null ? void 0 : _b.status) || "unknown"}`;
  if (!providerPaymentId) {
    throw createError({ statusCode: 400, statusMessage: "Invalid YooKassa webhook payload: object.id is required" });
  }
  const client = await serverSupabaseServiceRole(event);
  const insertEvent = await client.from("payment_webhook_events").insert({
    provider: "yookassa",
    event_id: eventId,
    provider_payment_id: providerPaymentId,
    payload: payload != null ? payload : {},
    processed: false
  });
  if (insertEvent.error && insertEvent.error.code !== "23505") {
    throw createError({ statusCode: 500, statusMessage: "Failed to persist webhook event" });
  }
  if (insertEvent.error && insertEvent.error.code === "23505") {
    return { ok: true, duplicate: true };
  }
  const { data: intent, error: intentError } = await client.from("order_payment_intents").select("id,order_id,shop_id,status").eq("provider", "yookassa").eq("provider_payment_id", providerPaymentId).order("created_at", { ascending: false }).limit(1).maybeSingle();
  if (intentError || !intent) {
    throw createError({ statusCode: 404, statusMessage: "Payment intent not found for webhook event" });
  }
  const paymentStatus = String(((_c = payload == null ? void 0 : payload.object) == null ? void 0 : _c.status) || "").toLowerCase();
  const nextOrderPaymentStatus = paymentStatus === "succeeded" ? "paid" : paymentStatus === "canceled" ? "canceled" : paymentStatus === "pending" ? "pending" : "failed";
  const orderUpdatePayload = {
    payment_status: nextOrderPaymentStatus,
    payment_provider: "yookassa",
    payment_id: providerPaymentId
  };
  if (nextOrderPaymentStatus === "paid") {
    orderUpdatePayload.paid_at = (/* @__PURE__ */ new Date()).toISOString();
  }
  const { error: updateOrderError } = await client.from("orders").update(orderUpdatePayload).eq("id", intent.order_id).eq("shop_id", intent.shop_id);
  if (updateOrderError) {
    throw createError({ statusCode: 500, statusMessage: "Failed to update order payment status" });
  }
  const { error: updateIntentError } = await client.from("order_payment_intents").update({
    status: paymentStatus || "unknown",
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  }).eq("id", intent.id);
  if (updateIntentError) {
    throw createError({ statusCode: 500, statusMessage: "Failed to update payment intent status" });
  }
  const signature = getHeader(event, "x-yookassa-signature") || "";
  const { error: markProcessedError } = await client.from("payment_webhook_events").update({
    processed: true,
    processed_at: (/* @__PURE__ */ new Date()).toISOString(),
    payload: { ...payload != null ? payload : {}, __headers: { x_yookassa_signature: signature } }
  }).eq("provider", "yookassa").eq("event_id", eventId);
  if (markProcessedError) {
    throw createError({ statusCode: 500, statusMessage: "Failed to mark webhook event as processed" });
  }
  return { ok: true };
});

const yookassa_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: yookassa_post
}, Symbol.toStringTag, { value: 'Module' }));

function renderPayloadResponse(ssrContext) {
	return {
		body: encodeForwardSlashes(stringify(splitPayload(ssrContext).payload, ssrContext["~payloadReducers"])) ,
		statusCode: getResponseStatus(ssrContext.event),
		statusMessage: getResponseStatusText(ssrContext.event),
		headers: {
			"content-type": "application/json;charset=utf-8" ,
			"x-powered-by": "Nuxt"
		}
	};
}
function renderPayloadJsonScript(opts) {
	const contents = opts.data ? encodeForwardSlashes(stringify(opts.data, opts.ssrContext["~payloadReducers"])) : "";
	const payload = {
		"type": "application/json",
		"innerHTML": contents,
		"data-nuxt-data": appId,
		"data-ssr": !(opts.ssrContext.noSSR)
	};
	{
		payload.id = "__NUXT_DATA__";
	}
	if (opts.src) {
		payload["data-src"] = opts.src;
	}
	const config = uneval(opts.ssrContext.config);
	return [payload, { innerHTML: `window.__NUXT__={};window.__NUXT__.config=${config}` }];
}

function encodeForwardSlashes(str) {
	return str.replaceAll("/", "\\u002F");
}
function splitPayload(ssrContext) {
	const { data, prerenderedAt, ...initial } = ssrContext.payload;
	return {
		initial: {
			...initial,
			prerenderedAt
		},
		payload: {
			data,
			prerenderedAt
		}
	};
}

const renderSSRHeadOptions = {"omitLineBreaks":false};

// @ts-expect-error private property consumed by vite-generated url helpers
globalThis.__buildAssetsURL = buildAssetsURL;
// @ts-expect-error private property consumed by vite-generated url helpers
globalThis.__publicAssetsURL = publicAssetsURL;
const HAS_APP_TELEPORTS = !!(appTeleportAttrs.id);
const APP_TELEPORT_OPEN_TAG = HAS_APP_TELEPORTS ? `<${appTeleportTag}${propsToString(appTeleportAttrs)}>` : "";
const APP_TELEPORT_CLOSE_TAG = HAS_APP_TELEPORTS ? `</${appTeleportTag}>` : "";
const PAYLOAD_URL_RE = /^[^?]*\/_payload.json(?:\?.*)?$/ ;
const PAYLOAD_FILENAME = "_payload.json" ;
const handler = defineRenderHandler((event) => {
	
	const ssrError = event.path.startsWith("/__nuxt_error") ? getQuery$1(event) : null;
	if (ssrError && !("__unenv__" in event.node.req)) {
		throw createError({
			status: 404,
			statusText: "Page Not Found: /__nuxt_error",
			message: "Page Not Found: /__nuxt_error"
		});
	}
	return renderRoute(event, ssrError);
});
async function renderRoute(event, ssrError) {
	const nitroApp = useNitroApp();
	
	const ssrContext = createSSRContext(event);
	
	const headEntryOptions = { mode: "server" };
	ssrContext.head.push(appHead, headEntryOptions);
	if (ssrError) {
		
		const status = ssrError.status || ssrError.statusCode;
		if (status) {
			
			ssrError.status = ssrError.statusCode = Number.parseInt(status);
		}
		setSSRError(ssrContext, ssrError);
	}
	
	const routeOptions = getRouteRules(event);
	
	const _PAYLOAD_EXTRACTION = !ssrContext.noSSR && (NUXT_RUNTIME_PAYLOAD_EXTRACTION);
	const isRenderingPayload = (_PAYLOAD_EXTRACTION || routeOptions.prerender) && PAYLOAD_URL_RE.test(ssrContext.url);
	if (isRenderingPayload) {
		const url = ssrContext.url.substring(0, ssrContext.url.lastIndexOf("/")) || "/";
		ssrContext.url = url;
		event._path = event.node.req.url = url;
	}
	if (routeOptions.ssr === false) {
		ssrContext.noSSR = true;
	}
	const payloadURL = _PAYLOAD_EXTRACTION ? joinURL(ssrContext.runtimeConfig.app.cdnURL || ssrContext.runtimeConfig.app.baseURL, ssrContext.url.replace(/\?.*$/, ""), PAYLOAD_FILENAME) + "?" + ssrContext.runtimeConfig.app.buildId : undefined;
	
	const renderer = await getRenderer(ssrContext);
	const _rendered = await renderer.renderToString(ssrContext).catch(async (error) => {
		
		
		if ((ssrContext["~renderResponse"] || ssrContext._renderResponse) && error.message === "skipping render") {
			return {};
		}
		
		const _err = !ssrError && ssrContext.payload?.error || error;
		await ssrContext.nuxt?.hooks.callHook("app:error", _err);
		throw _err;
	});
	
	
	const inlinedStyles = [];
	await ssrContext.nuxt?.hooks.callHook("app:rendered", {
		ssrContext,
		renderResult: _rendered
	});
	if (ssrContext["~renderResponse"] || ssrContext._renderResponse) {
		
		return ssrContext["~renderResponse"] || ssrContext._renderResponse;
	}
	
	if (ssrContext.payload?.error && !ssrError) {
		throw ssrContext.payload.error;
	}
	
	if (isRenderingPayload) {
		const response = renderPayloadResponse(ssrContext);
		return response;
	}
	const NO_SCRIPTS = routeOptions.noScripts;
	
	const { styles, scripts } = getRequestDependencies(ssrContext, renderer.rendererContext);
	
	if (_PAYLOAD_EXTRACTION && !NO_SCRIPTS) {
		ssrContext.head.push({ link: [{
			rel: "preload",
			as: "fetch",
			crossorigin: "anonymous",
			href: payloadURL
		} ] }, headEntryOptions);
	}
	if (ssrContext["~preloadManifest"] && !NO_SCRIPTS) {
		ssrContext.head.push({ link: [{
			rel: "preload",
			as: "fetch",
			fetchpriority: "low",
			crossorigin: "anonymous",
			href: buildAssetsURL(`builds/meta/${ssrContext.runtimeConfig.app.buildId}.json`)
		}] }, {
			...headEntryOptions,
			tagPriority: "low"
		});
	}
	
	if (inlinedStyles.length) {
		ssrContext.head.push({ style: inlinedStyles });
	}
	const link = [];
	for (const resource of Object.values(styles)) {
		
		if ("inline" in getQuery(resource.file)) {
			continue;
		}
		
		
		
		link.push({
			rel: "stylesheet",
			href: renderer.rendererContext.buildAssetsURL(resource.file),
			crossorigin: ""
		});
	}
	if (link.length) {
		ssrContext.head.push({ link }, headEntryOptions);
	}
	if (!NO_SCRIPTS) {
		
		
		
		if (ssrContext["~lazyHydratedModules"]) {
			for (const id of ssrContext["~lazyHydratedModules"]) {
				ssrContext.modules?.delete(id);
			}
		}
		
		ssrContext.head.push({ link: getPreloadLinks(ssrContext, renderer.rendererContext) }, headEntryOptions);
		ssrContext.head.push({ link: getPrefetchLinks(ssrContext, renderer.rendererContext) }, headEntryOptions);
		
		ssrContext.head.push({ script: _PAYLOAD_EXTRACTION ? renderPayloadJsonScript({
			ssrContext,
			data: splitPayload(ssrContext).initial,
			src: payloadURL
		})  : renderPayloadJsonScript({
			ssrContext,
			data: ssrContext.payload
		})  }, {
			...headEntryOptions,
			
			tagPosition: "bodyClose",
			tagPriority: "high"
		});
	}
	
	if (!routeOptions.noScripts) {
		const tagPosition = "head";
		ssrContext.head.push({ script: Object.values(scripts).map((resource) => ({
			type: resource.module ? "module" : null,
			src: renderer.rendererContext.buildAssetsURL(resource.file),
			defer: resource.module ? null : true,
			
			
			tagPosition,
			crossorigin: ""
		})) }, headEntryOptions);
	}
	const { headTags, bodyTags, bodyTagsOpen, htmlAttrs, bodyAttrs } = await renderSSRHead(ssrContext.head, renderSSRHeadOptions);
	
	const htmlContext = {
		htmlAttrs: htmlAttrs ? [htmlAttrs] : [],
		head: normalizeChunks([headTags]),
		bodyAttrs: bodyAttrs ? [bodyAttrs] : [],
		bodyPrepend: normalizeChunks([bodyTagsOpen, ssrContext.teleports?.body]),
		body: [replaceIslandTeleports(ssrContext, _rendered.html) , APP_TELEPORT_OPEN_TAG + (HAS_APP_TELEPORTS ? joinTags([ssrContext.teleports?.[`#${appTeleportAttrs.id}`]]) : "") + APP_TELEPORT_CLOSE_TAG],
		bodyAppend: [bodyTags]
	};
	
	await nitroApp.hooks.callHook("render:html", htmlContext, { event });
	
	return {
		body: renderHTMLDocument(htmlContext),
		statusCode: getResponseStatus(event),
		statusMessage: getResponseStatusText(event),
		headers: {
			"content-type": "text/html;charset=utf-8",
			"x-powered-by": "Nuxt"
		}
	};
}
function normalizeChunks(chunks) {
	const result = [];
	for (const _chunk of chunks) {
		const chunk = _chunk?.trim();
		if (chunk) {
			result.push(chunk);
		}
	}
	return result;
}
function joinTags(tags) {
	return tags.join("");
}
function joinAttrs(chunks) {
	if (chunks.length === 0) {
		return "";
	}
	return " " + chunks.join(" ");
}
function renderHTMLDocument(html) {
	return "<!DOCTYPE html>" + `<html${joinAttrs(html.htmlAttrs)}>` + `<head>${joinTags(html.head)}</head>` + `<body${joinAttrs(html.bodyAttrs)}>${joinTags(html.bodyPrepend)}${joinTags(html.body)}${joinTags(html.bodyAppend)}</body>` + "</html>";
}

const renderer = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: handler
}, Symbol.toStringTag, { value: 'Module' }));
