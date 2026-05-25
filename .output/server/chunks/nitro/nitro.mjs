import process from 'node:process';globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import crypto$1, { createHash, randomBytes } from 'node:crypto';
import { createServerClient, parseCookieHeader } from '@supabase/ssr';
import http, { Server as Server$1 } from 'node:http';
import https, { Server } from 'node:https';
import { EventEmitter } from 'node:events';
import { Buffer as Buffer$1 } from 'node:buffer';
import { promises, existsSync } from 'node:fs';
import { resolve as resolve$1, dirname as dirname$1, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

const suspectProtoRx = /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/;
const suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
const JsonSigRx = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;
function jsonParseTransform(key, value) {
  if (key === "__proto__" || key === "constructor" && value && typeof value === "object" && "prototype" in value) {
    warnKeyDropped(key);
    return;
  }
  return value;
}
function warnKeyDropped(key) {
  console.warn(`[destr] Dropping "${key}" key to prevent prototype pollution.`);
}
function destr(value, options = {}) {
  if (typeof value !== "string") {
    return value;
  }
  if (value[0] === '"' && value[value.length - 1] === '"' && value.indexOf("\\") === -1) {
    return value.slice(1, -1);
  }
  const _value = value.trim();
  if (_value.length <= 9) {
    switch (_value.toLowerCase()) {
      case "true": {
        return true;
      }
      case "false": {
        return false;
      }
      case "undefined": {
        return void 0;
      }
      case "null": {
        return null;
      }
      case "nan": {
        return Number.NaN;
      }
      case "infinity": {
        return Number.POSITIVE_INFINITY;
      }
      case "-infinity": {
        return Number.NEGATIVE_INFINITY;
      }
    }
  }
  if (!JsonSigRx.test(value)) {
    if (options.strict) {
      throw new SyntaxError("[destr] Invalid JSON");
    }
    return value;
  }
  try {
    if (suspectProtoRx.test(value) || suspectConstructorRx.test(value)) {
      if (options.strict) {
        throw new Error("[destr] Possible prototype pollution");
      }
      return JSON.parse(value, jsonParseTransform);
    }
    return JSON.parse(value);
  } catch (error) {
    if (options.strict) {
      throw error;
    }
    return value;
  }
}

const HASH_RE = /#/g;
const AMPERSAND_RE = /&/g;
const SLASH_RE = /\//g;
const EQUAL_RE = /=/g;
const IM_RE = /\?/g;
const PLUS_RE = /\+/g;
const ENC_CARET_RE = /%5e/gi;
const ENC_BACKTICK_RE = /%60/gi;
const ENC_PIPE_RE = /%7c/gi;
const ENC_SPACE_RE = /%20/gi;
const ENC_SLASH_RE = /%2f/gi;
const ENC_ENC_SLASH_RE = /%252f/gi;
function encode(text) {
  return encodeURI("" + text).replace(ENC_PIPE_RE, "|");
}
function encodeQueryValue(input) {
  return encode(typeof input === "string" ? input : JSON.stringify(input)).replace(PLUS_RE, "%2B").replace(ENC_SPACE_RE, "+").replace(HASH_RE, "%23").replace(AMPERSAND_RE, "%26").replace(ENC_BACKTICK_RE, "`").replace(ENC_CARET_RE, "^").replace(SLASH_RE, "%2F");
}
function encodeQueryKey(text) {
  return encodeQueryValue(text).replace(EQUAL_RE, "%3D");
}
function encodePath(text) {
  return encode(text).replace(HASH_RE, "%23").replace(IM_RE, "%3F").replace(ENC_ENC_SLASH_RE, "%2F").replace(AMPERSAND_RE, "%26").replace(PLUS_RE, "%2B");
}
function decode(text = "") {
  try {
    return decodeURIComponent("" + text);
  } catch {
    return "" + text;
  }
}
function decodePath(text) {
  return decode(text.replace(ENC_SLASH_RE, "%252F"));
}
function decodeQueryKey(text) {
  return decode(text.replace(PLUS_RE, " "));
}
function decodeQueryValue(text) {
  return decode(text.replace(PLUS_RE, " "));
}

function parseQuery(parametersString = "") {
  const object = /* @__PURE__ */ Object.create(null);
  if (parametersString[0] === "?") {
    parametersString = parametersString.slice(1);
  }
  for (const parameter of parametersString.split("&")) {
    const s = parameter.match(/([^=]+)=?(.*)/) || [];
    if (s.length < 2) {
      continue;
    }
    const key = decodeQueryKey(s[1]);
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = decodeQueryValue(s[2] || "");
    if (object[key] === void 0) {
      object[key] = value;
    } else if (Array.isArray(object[key])) {
      object[key].push(value);
    } else {
      object[key] = [object[key], value];
    }
  }
  return object;
}
function encodeQueryItem(key, value) {
  if (typeof value === "number" || typeof value === "boolean") {
    value = String(value);
  }
  if (!value) {
    return encodeQueryKey(key);
  }
  if (Array.isArray(value)) {
    return value.map(
      (_value) => `${encodeQueryKey(key)}=${encodeQueryValue(_value)}`
    ).join("&");
  }
  return `${encodeQueryKey(key)}=${encodeQueryValue(value)}`;
}
function stringifyQuery(query) {
  return Object.keys(query).filter((k) => query[k] !== void 0).map((k) => encodeQueryItem(k, query[k])).filter(Boolean).join("&");
}

const PROTOCOL_STRICT_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{1,2})/;
const PROTOCOL_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{2})?/;
const PROTOCOL_RELATIVE_REGEX = /^([/\\]\s*){2,}[^/\\]/;
const PROTOCOL_SCRIPT_RE = /^[\s\0]*(blob|data|javascript|vbscript):$/i;
const TRAILING_SLASH_RE = /\/$|\/\?|\/#/;
const JOIN_LEADING_SLASH_RE = /^\.?\//;
function hasProtocol(inputString, opts = {}) {
  if (typeof opts === "boolean") {
    opts = { acceptRelative: opts };
  }
  if (opts.strict) {
    return PROTOCOL_STRICT_REGEX.test(inputString);
  }
  return PROTOCOL_REGEX.test(inputString) || (opts.acceptRelative ? PROTOCOL_RELATIVE_REGEX.test(inputString) : false);
}
function isScriptProtocol(protocol) {
  return !!protocol && PROTOCOL_SCRIPT_RE.test(protocol);
}
function hasTrailingSlash(input = "", respectQueryAndFragment) {
  if (!respectQueryAndFragment) {
    return input.endsWith("/");
  }
  return TRAILING_SLASH_RE.test(input);
}
function withoutTrailingSlash(input = "", respectQueryAndFragment) {
  if (!respectQueryAndFragment) {
    return (hasTrailingSlash(input) ? input.slice(0, -1) : input) || "/";
  }
  if (!hasTrailingSlash(input, true)) {
    return input || "/";
  }
  let path = input;
  let fragment = "";
  const fragmentIndex = input.indexOf("#");
  if (fragmentIndex !== -1) {
    path = input.slice(0, fragmentIndex);
    fragment = input.slice(fragmentIndex);
  }
  const [s0, ...s] = path.split("?");
  const cleanPath = s0.endsWith("/") ? s0.slice(0, -1) : s0;
  return (cleanPath || "/") + (s.length > 0 ? `?${s.join("?")}` : "") + fragment;
}
function withTrailingSlash(input = "", respectQueryAndFragment) {
  if (!respectQueryAndFragment) {
    return input.endsWith("/") ? input : input + "/";
  }
  if (hasTrailingSlash(input, true)) {
    return input || "/";
  }
  let path = input;
  let fragment = "";
  const fragmentIndex = input.indexOf("#");
  if (fragmentIndex !== -1) {
    path = input.slice(0, fragmentIndex);
    fragment = input.slice(fragmentIndex);
    if (!path) {
      return fragment;
    }
  }
  const [s0, ...s] = path.split("?");
  return s0 + "/" + (s.length > 0 ? `?${s.join("?")}` : "") + fragment;
}
function hasLeadingSlash(input = "") {
  return input.startsWith("/");
}
function withLeadingSlash(input = "") {
  return hasLeadingSlash(input) ? input : "/" + input;
}
function withBase(input, base) {
  if (isEmptyURL(base) || hasProtocol(input)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (input.startsWith(_base)) {
    const nextChar = input[_base.length];
    if (!nextChar || nextChar === "/" || nextChar === "?") {
      return input;
    }
  }
  return joinURL(_base, input);
}
function withoutBase(input, base) {
  if (isEmptyURL(base)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (!input.startsWith(_base)) {
    return input;
  }
  const nextChar = input[_base.length];
  if (nextChar && nextChar !== "/" && nextChar !== "?") {
    return input;
  }
  const trimmed = input.slice(_base.length).replace(/^\/+/, "");
  return "/" + trimmed;
}
function withQuery(input, query) {
  const parsed = parseURL(input);
  const mergedQuery = { ...parseQuery(parsed.search), ...query };
  parsed.search = stringifyQuery(mergedQuery);
  return stringifyParsedURL(parsed);
}
function getQuery$1(input) {
  return parseQuery(parseURL(input).search);
}
function isEmptyURL(url) {
  return !url || url === "/";
}
function isNonEmptyURL(url) {
  return url && url !== "/";
}
function joinURL(base, ...input) {
  let url = base || "";
  for (const segment of input.filter((url2) => isNonEmptyURL(url2))) {
    if (url) {
      const _segment = segment.replace(JOIN_LEADING_SLASH_RE, "");
      url = withTrailingSlash(url) + _segment;
    } else {
      url = segment;
    }
  }
  return url;
}
function joinRelativeURL(..._input) {
  const JOIN_SEGMENT_SPLIT_RE = /\/(?!\/)/;
  const input = _input.filter(Boolean);
  const segments = [];
  let segmentsDepth = 0;
  for (const i of input) {
    if (!i || i === "/") {
      continue;
    }
    for (const [sindex, s] of i.split(JOIN_SEGMENT_SPLIT_RE).entries()) {
      if (!s || s === ".") {
        continue;
      }
      if (s === "..") {
        if (segments.length === 1 && hasProtocol(segments[0])) {
          continue;
        }
        segments.pop();
        segmentsDepth--;
        continue;
      }
      if (sindex === 1 && segments[segments.length - 1]?.endsWith(":/")) {
        segments[segments.length - 1] += "/" + s;
        continue;
      }
      segments.push(s);
      segmentsDepth++;
    }
  }
  let url = segments.join("/");
  if (segmentsDepth >= 0) {
    if (input[0]?.startsWith("/") && !url.startsWith("/")) {
      url = "/" + url;
    } else if (input[0]?.startsWith("./") && !url.startsWith("./")) {
      url = "./" + url;
    }
  } else {
    url = "../".repeat(-1 * segmentsDepth) + url;
  }
  if (input[input.length - 1]?.endsWith("/") && !url.endsWith("/")) {
    url += "/";
  }
  return url;
}

const protocolRelative = Symbol.for("ufo:protocolRelative");
function parseURL(input = "", defaultProto) {
  const _specialProtoMatch = input.match(
    /^[\s\0]*(blob:|data:|javascript:|vbscript:)(.*)/i
  );
  if (_specialProtoMatch) {
    const [, _proto, _pathname = ""] = _specialProtoMatch;
    return {
      protocol: _proto.toLowerCase(),
      pathname: _pathname,
      href: _proto + _pathname,
      auth: "",
      host: "",
      search: "",
      hash: ""
    };
  }
  if (!hasProtocol(input, { acceptRelative: true })) {
    return parsePath(input);
  }
  const [, protocol = "", auth, hostAndPath = ""] = input.replace(/\\/g, "/").match(/^[\s\0]*([\w+.-]{2,}:)?\/\/([^/@]+@)?(.*)/) || [];
  let [, host = "", path = ""] = hostAndPath.match(/([^#/?]*)(.*)?/) || [];
  if (protocol === "file:") {
    path = path.replace(/\/(?=[A-Za-z]:)/, "");
  }
  const { pathname, search, hash } = parsePath(path);
  return {
    protocol: protocol.toLowerCase(),
    auth: auth ? auth.slice(0, Math.max(0, auth.length - 1)) : "",
    host,
    pathname,
    search,
    hash,
    [protocolRelative]: !protocol
  };
}
function parsePath(input = "") {
  const [pathname = "", search = "", hash = ""] = (input.match(/([^#?]*)(\?[^#]*)?(#.*)?/) || []).splice(1);
  return {
    pathname,
    search,
    hash
  };
}
function stringifyParsedURL(parsed) {
  const pathname = parsed.pathname || "";
  const search = parsed.search ? (parsed.search.startsWith("?") ? "" : "?") + parsed.search : "";
  const hash = parsed.hash || "";
  const auth = parsed.auth ? parsed.auth + "@" : "";
  const host = parsed.host || "";
  const proto = parsed.protocol || parsed[protocolRelative] ? (parsed.protocol || "") + "//" : "";
  return proto + auth + host + pathname + search + hash;
}

const fieldContentRegExp = /^[\u0009\u0020-\u007E\u0080-\u00FF]+$/;
function serialize$2(name, value, options) {
  const opt = options || {};
  const enc = opt.encode || encodeURIComponent;
  if (typeof enc !== "function") {
    throw new TypeError("option encode is invalid");
  }
  if (!fieldContentRegExp.test(name)) {
    throw new TypeError("argument name is invalid");
  }
  const encodedValue = enc(value);
  if (encodedValue && !fieldContentRegExp.test(encodedValue)) {
    throw new TypeError("argument val is invalid");
  }
  let str = name + "=" + encodedValue;
  if (void 0 !== opt.maxAge && opt.maxAge !== null) {
    const maxAge = opt.maxAge - 0;
    if (Number.isNaN(maxAge) || !Number.isFinite(maxAge)) {
      throw new TypeError("option maxAge is invalid");
    }
    str += "; Max-Age=" + Math.floor(maxAge);
  }
  if (opt.domain) {
    if (!fieldContentRegExp.test(opt.domain)) {
      throw new TypeError("option domain is invalid");
    }
    str += "; Domain=" + opt.domain;
  }
  if (opt.path) {
    if (!fieldContentRegExp.test(opt.path)) {
      throw new TypeError("option path is invalid");
    }
    str += "; Path=" + opt.path;
  }
  if (opt.expires) {
    if (!isDate(opt.expires) || Number.isNaN(opt.expires.valueOf())) {
      throw new TypeError("option expires is invalid");
    }
    str += "; Expires=" + opt.expires.toUTCString();
  }
  if (opt.httpOnly) {
    str += "; HttpOnly";
  }
  if (opt.secure) {
    str += "; Secure";
  }
  if (opt.priority) {
    const priority = typeof opt.priority === "string" ? opt.priority.toLowerCase() : opt.priority;
    switch (priority) {
      case "low": {
        str += "; Priority=Low";
        break;
      }
      case "medium": {
        str += "; Priority=Medium";
        break;
      }
      case "high": {
        str += "; Priority=High";
        break;
      }
      default: {
        throw new TypeError("option priority is invalid");
      }
    }
  }
  if (opt.sameSite) {
    const sameSite = typeof opt.sameSite === "string" ? opt.sameSite.toLowerCase() : opt.sameSite;
    switch (sameSite) {
      case true: {
        str += "; SameSite=Strict";
        break;
      }
      case "lax": {
        str += "; SameSite=Lax";
        break;
      }
      case "strict": {
        str += "; SameSite=Strict";
        break;
      }
      case "none": {
        str += "; SameSite=None";
        break;
      }
      default: {
        throw new TypeError("option sameSite is invalid");
      }
    }
  }
  if (opt.partitioned) {
    str += "; Partitioned";
  }
  return str;
}
function isDate(val) {
  return Object.prototype.toString.call(val) === "[object Date]" || val instanceof Date;
}

function parseSetCookie(setCookieValue, options) {
  const parts = (setCookieValue || "").split(";").filter((str) => typeof str === "string" && !!str.trim());
  const nameValuePairStr = parts.shift() || "";
  const parsed = _parseNameValuePair(nameValuePairStr);
  const name = parsed.name;
  let value = parsed.value;
  try {
    value = options?.decode === false ? value : (options?.decode || decodeURIComponent)(value);
  } catch {
  }
  const cookie = {
    name,
    value
  };
  for (const part of parts) {
    const sides = part.split("=");
    const partKey = (sides.shift() || "").trimStart().toLowerCase();
    const partValue = sides.join("=");
    switch (partKey) {
      case "expires": {
        cookie.expires = new Date(partValue);
        break;
      }
      case "max-age": {
        cookie.maxAge = Number.parseInt(partValue, 10);
        break;
      }
      case "secure": {
        cookie.secure = true;
        break;
      }
      case "httponly": {
        cookie.httpOnly = true;
        break;
      }
      case "samesite": {
        cookie.sameSite = partValue;
        break;
      }
      default: {
        cookie[partKey] = partValue;
      }
    }
  }
  return cookie;
}
function _parseNameValuePair(nameValuePairStr) {
  let name = "";
  let value = "";
  const nameValueArr = nameValuePairStr.split("=");
  if (nameValueArr.length > 1) {
    name = nameValueArr.shift();
    value = nameValueArr.join("=");
  } else {
    value = nameValuePairStr;
  }
  return { name, value };
}

const NODE_TYPES = {
  NORMAL: 0,
  WILDCARD: 1,
  PLACEHOLDER: 2
};

function createRouter$1(options = {}) {
  const ctx = {
    options,
    rootNode: createRadixNode(),
    staticRoutesMap: {}
  };
  const normalizeTrailingSlash = (p) => options.strictTrailingSlash ? p : p.replace(/\/$/, "") || "/";
  if (options.routes) {
    for (const path in options.routes) {
      insert(ctx, normalizeTrailingSlash(path), options.routes[path]);
    }
  }
  return {
    ctx,
    lookup: (path) => lookup(ctx, normalizeTrailingSlash(path)),
    insert: (path, data) => insert(ctx, normalizeTrailingSlash(path), data),
    remove: (path) => remove(ctx, normalizeTrailingSlash(path))
  };
}
function lookup(ctx, path) {
  const staticPathNode = ctx.staticRoutesMap[path];
  if (staticPathNode) {
    return staticPathNode.data;
  }
  const sections = path.split("/");
  const params = {};
  let paramsFound = false;
  let wildcardNode = null;
  let node = ctx.rootNode;
  let wildCardParam = null;
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (node.wildcardChildNode !== null) {
      wildcardNode = node.wildcardChildNode;
      wildCardParam = sections.slice(i).join("/");
    }
    const nextNode = node.children.get(section);
    if (nextNode === void 0) {
      if (node && node.placeholderChildren.length > 1) {
        const remaining = sections.length - i;
        node = node.placeholderChildren.find((c) => c.maxDepth === remaining) || null;
      } else {
        node = node.placeholderChildren[0] || null;
      }
      if (!node) {
        break;
      }
      if (node.paramName) {
        params[node.paramName] = section;
      }
      paramsFound = true;
    } else {
      node = nextNode;
    }
  }
  if ((node === null || node.data === null) && wildcardNode !== null) {
    node = wildcardNode;
    params[node.paramName || "_"] = wildCardParam;
    paramsFound = true;
  }
  if (!node) {
    return null;
  }
  if (paramsFound) {
    return {
      ...node.data,
      params: paramsFound ? params : void 0
    };
  }
  return node.data;
}
function insert(ctx, path, data) {
  let isStaticRoute = true;
  const sections = path.split("/");
  let node = ctx.rootNode;
  let _unnamedPlaceholderCtr = 0;
  const matchedNodes = [node];
  for (const section of sections) {
    let childNode;
    if (childNode = node.children.get(section)) {
      node = childNode;
    } else {
      const type = getNodeType(section);
      childNode = createRadixNode({ type, parent: node });
      node.children.set(section, childNode);
      if (type === NODE_TYPES.PLACEHOLDER) {
        childNode.paramName = section === "*" ? `_${_unnamedPlaceholderCtr++}` : section.slice(1);
        node.placeholderChildren.push(childNode);
        isStaticRoute = false;
      } else if (type === NODE_TYPES.WILDCARD) {
        node.wildcardChildNode = childNode;
        childNode.paramName = section.slice(
          3
          /* "**:" */
        ) || "_";
        isStaticRoute = false;
      }
      matchedNodes.push(childNode);
      node = childNode;
    }
  }
  for (const [depth, node2] of matchedNodes.entries()) {
    node2.maxDepth = Math.max(matchedNodes.length - depth, node2.maxDepth || 0);
  }
  node.data = data;
  if (isStaticRoute === true) {
    ctx.staticRoutesMap[path] = node;
  }
  return node;
}
function remove(ctx, path) {
  let success = false;
  const sections = path.split("/");
  let node = ctx.rootNode;
  for (const section of sections) {
    node = node.children.get(section);
    if (!node) {
      return success;
    }
  }
  if (node.data) {
    const lastSection = sections.at(-1) || "";
    node.data = null;
    if (Object.keys(node.children).length === 0 && node.parent) {
      node.parent.children.delete(lastSection);
      node.parent.wildcardChildNode = null;
      node.parent.placeholderChildren = [];
    }
    success = true;
  }
  return success;
}
function createRadixNode(options = {}) {
  return {
    type: options.type || NODE_TYPES.NORMAL,
    maxDepth: 0,
    parent: options.parent || null,
    children: /* @__PURE__ */ new Map(),
    data: options.data || null,
    paramName: options.paramName || null,
    wildcardChildNode: null,
    placeholderChildren: []
  };
}
function getNodeType(str) {
  if (str.startsWith("**")) {
    return NODE_TYPES.WILDCARD;
  }
  if (str[0] === ":" || str === "*") {
    return NODE_TYPES.PLACEHOLDER;
  }
  return NODE_TYPES.NORMAL;
}

function toRouteMatcher(router) {
  const table = _routerNodeToTable("", router.ctx.rootNode);
  return _createMatcher(table, router.ctx.options.strictTrailingSlash);
}
function _createMatcher(table, strictTrailingSlash) {
  return {
    ctx: { table },
    matchAll: (path) => _matchRoutes(path, table, strictTrailingSlash)
  };
}
function _createRouteTable() {
  return {
    static: /* @__PURE__ */ new Map(),
    wildcard: /* @__PURE__ */ new Map(),
    dynamic: /* @__PURE__ */ new Map()
  };
}
function _matchRoutes(path, table, strictTrailingSlash) {
  if (strictTrailingSlash !== true && path.endsWith("/")) {
    path = path.slice(0, -1) || "/";
  }
  const matches = [];
  for (const [key, value] of _sortRoutesMap(table.wildcard)) {
    if (path === key || path.startsWith(key + "/")) {
      matches.push(value);
    }
  }
  for (const [key, value] of _sortRoutesMap(table.dynamic)) {
    if (path.startsWith(key + "/")) {
      const subPath = "/" + path.slice(key.length).split("/").splice(2).join("/");
      matches.push(..._matchRoutes(subPath, value));
    }
  }
  const staticMatch = table.static.get(path);
  if (staticMatch) {
    matches.push(staticMatch);
  }
  return matches.filter(Boolean);
}
function _sortRoutesMap(m) {
  return [...m.entries()].sort((a, b) => a[0].length - b[0].length);
}
function _routerNodeToTable(initialPath, initialNode) {
  const table = _createRouteTable();
  function _addNode(path, node) {
    if (path) {
      if (node.type === NODE_TYPES.NORMAL && !(path.includes("*") || path.includes(":"))) {
        if (node.data) {
          table.static.set(path, node.data);
        }
      } else if (node.type === NODE_TYPES.WILDCARD) {
        table.wildcard.set(path.replace("/**", ""), node.data);
      } else if (node.type === NODE_TYPES.PLACEHOLDER) {
        const subTable = _routerNodeToTable("", node);
        if (node.data) {
          subTable.static.set("/", node.data);
        }
        table.dynamic.set(path.replace(/\/\*|\/:\w+/, ""), subTable);
        return;
      }
    }
    for (const [childPath, child] of node.children.entries()) {
      _addNode(`${path}/${childPath}`.replace("//", "/"), child);
    }
  }
  _addNode(initialPath, initialNode);
  return table;
}

function isPlainObject(value) {
  if (value === null || typeof value !== "object") {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== null && prototype !== Object.prototype && Object.getPrototypeOf(prototype) !== null) {
    return false;
  }
  if (Symbol.iterator in value) {
    return false;
  }
  if (Symbol.toStringTag in value) {
    return Object.prototype.toString.call(value) === "[object Module]";
  }
  return true;
}

function _defu(baseObject, defaults, namespace = ".", merger) {
  if (!isPlainObject(defaults)) {
    return _defu(baseObject, {}, namespace, merger);
  }
  const object = { ...defaults };
  for (const key of Object.keys(baseObject)) {
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = baseObject[key];
    if (value === null || value === void 0) {
      continue;
    }
    if (merger && merger(object, key, value, namespace)) {
      continue;
    }
    if (Array.isArray(value) && Array.isArray(object[key])) {
      object[key] = [...value, ...object[key]];
    } else if (isPlainObject(value) && isPlainObject(object[key])) {
      object[key] = _defu(
        value,
        object[key],
        (namespace ? `${namespace}.` : "") + key.toString(),
        merger
      );
    } else {
      object[key] = value;
    }
  }
  return object;
}
function createDefu(merger) {
  return (...arguments_) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    arguments_.reduce((p, c) => _defu(p, c, "", merger), {})
  );
}
const defu = createDefu();
const defuFn = createDefu((object, key, currentValue) => {
  if (object[key] !== void 0 && typeof currentValue === "function") {
    object[key] = currentValue(object[key]);
    return true;
  }
});

function o(n){throw new Error(`${n} is not implemented yet!`)}let i$1 = class i extends EventEmitter{__unenv__={};readableEncoding=null;readableEnded=true;readableFlowing=false;readableHighWaterMark=0;readableLength=0;readableObjectMode=false;readableAborted=false;readableDidRead=false;closed=false;errored=null;readable=false;destroyed=false;static from(e,t){return new i(t)}constructor(e){super();}_read(e){}read(e){}setEncoding(e){return this}pause(){return this}resume(){return this}isPaused(){return  true}unpipe(e){return this}unshift(e,t){}wrap(e){return this}push(e,t){return  false}_destroy(e,t){this.removeAllListeners();}destroy(e){return this.destroyed=true,this._destroy(e),this}pipe(e,t){return {}}compose(e,t){throw new Error("Method not implemented.")}[Symbol.asyncDispose](){return this.destroy(),Promise.resolve()}async*[Symbol.asyncIterator](){throw o("Readable.asyncIterator")}iterator(e){throw o("Readable.iterator")}map(e,t){throw o("Readable.map")}filter(e,t){throw o("Readable.filter")}forEach(e,t){throw o("Readable.forEach")}reduce(e,t,r){throw o("Readable.reduce")}find(e,t){throw o("Readable.find")}findIndex(e,t){throw o("Readable.findIndex")}some(e,t){throw o("Readable.some")}toArray(e){throw o("Readable.toArray")}every(e,t){throw o("Readable.every")}flatMap(e,t){throw o("Readable.flatMap")}drop(e,t){throw o("Readable.drop")}take(e,t){throw o("Readable.take")}asIndexedPairs(e){throw o("Readable.asIndexedPairs")}};let l$1 = class l extends EventEmitter{__unenv__={};writable=true;writableEnded=false;writableFinished=false;writableHighWaterMark=0;writableLength=0;writableObjectMode=false;writableCorked=0;closed=false;errored=null;writableNeedDrain=false;writableAborted=false;destroyed=false;_data;_encoding="utf8";constructor(e){super();}pipe(e,t){return {}}_write(e,t,r){if(this.writableEnded){r&&r();return}if(this._data===void 0)this._data=e;else {const s=typeof this._data=="string"?Buffer$1.from(this._data,this._encoding||t||"utf8"):this._data,a=typeof e=="string"?Buffer$1.from(e,t||this._encoding||"utf8"):e;this._data=Buffer$1.concat([s,a]);}this._encoding=t,r&&r();}_writev(e,t){}_destroy(e,t){}_final(e){}write(e,t,r){const s=typeof t=="string"?this._encoding:"utf8",a=typeof t=="function"?t:typeof r=="function"?r:void 0;return this._write(e,s,a),true}setDefaultEncoding(e){return this}end(e,t,r){const s=typeof e=="function"?e:typeof t=="function"?t:typeof r=="function"?r:void 0;if(this.writableEnded)return s&&s(),this;const a=e===s?void 0:e;if(a){const u=t===s?void 0:t;this.write(a,u,s);}return this.writableEnded=true,this.writableFinished=true,this.emit("close"),this.emit("finish"),this}cork(){}uncork(){}destroy(e){return this.destroyed=true,delete this._data,this.removeAllListeners(),this}compose(e,t){throw new Error("Method not implemented.")}[Symbol.asyncDispose](){return Promise.resolve()}};const c$1=class c{allowHalfOpen=true;_destroy;constructor(e=new i$1,t=new l$1){Object.assign(this,e),Object.assign(this,t),this._destroy=m(e._destroy,t._destroy);}};function _(){return Object.assign(c$1.prototype,i$1.prototype),Object.assign(c$1.prototype,l$1.prototype),c$1}function m(...n){return function(...e){for(const t of n)t(...e);}}const g=_();class A extends g{__unenv__={};bufferSize=0;bytesRead=0;bytesWritten=0;connecting=false;destroyed=false;pending=false;localAddress="";localPort=0;remoteAddress="";remoteFamily="";remotePort=0;autoSelectFamilyAttemptedAddresses=[];readyState="readOnly";constructor(e){super();}write(e,t,r){return  false}connect(e,t,r){return this}end(e,t,r){return this}setEncoding(e){return this}pause(){return this}resume(){return this}setTimeout(e,t){return this}setNoDelay(e){return this}setKeepAlive(e,t){return this}address(){return {}}unref(){return this}ref(){return this}destroySoon(){this.destroy();}resetAndDestroy(){const e=new Error("ERR_SOCKET_CLOSED");return e.code="ERR_SOCKET_CLOSED",this.destroy(e),this}}class y extends i$1{aborted=false;httpVersion="1.1";httpVersionMajor=1;httpVersionMinor=1;complete=true;connection;socket;headers={};trailers={};method="GET";url="/";statusCode=200;statusMessage="";closed=false;errored=null;readable=false;constructor(e){super(),this.socket=this.connection=e||new A;}get rawHeaders(){const e=this.headers,t=[];for(const r in e)if(Array.isArray(e[r]))for(const s of e[r])t.push(r,s);else t.push(r,e[r]);return t}get rawTrailers(){return []}setTimeout(e,t){return this}get headersDistinct(){return p(this.headers)}get trailersDistinct(){return p(this.trailers)}}function p(n){const e={};for(const[t,r]of Object.entries(n))t&&(e[t]=(Array.isArray(r)?r:[r]).filter(Boolean));return e}class w extends l$1{statusCode=200;statusMessage="";upgrading=false;chunkedEncoding=false;shouldKeepAlive=false;useChunkedEncodingByDefault=false;sendDate=false;finished=false;headersSent=false;strictContentLength=false;connection=null;socket=null;req;_headers={};constructor(e){super(),this.req=e;}assignSocket(e){e._httpMessage=this,this.socket=e,this.connection=e,this.emit("socket",e),this._flush();}_flush(){this.flushHeaders();}detachSocket(e){}writeContinue(e){}writeHead(e,t,r){e&&(this.statusCode=e),typeof t=="string"&&(this.statusMessage=t,t=void 0);const s=r||t;if(s&&!Array.isArray(s))for(const a in s)this.setHeader(a,s[a]);return this.headersSent=true,this}writeProcessing(){}setTimeout(e,t){return this}appendHeader(e,t){e=e.toLowerCase();const r=this._headers[e],s=[...Array.isArray(r)?r:[r],...Array.isArray(t)?t:[t]].filter(Boolean);return this._headers[e]=s.length>1?s:s[0],this}setHeader(e,t){return this._headers[e.toLowerCase()]=t,this}setHeaders(e){for(const[t,r]of Object.entries(e))this.setHeader(t,r);return this}getHeader(e){return this._headers[e.toLowerCase()]}getHeaders(){return this._headers}getHeaderNames(){return Object.keys(this._headers)}hasHeader(e){return e.toLowerCase()in this._headers}removeHeader(e){delete this._headers[e.toLowerCase()];}addTrailers(e){}flushHeaders(){}writeEarlyHints(e,t){typeof t=="function"&&t();}}const E=(()=>{const n=function(){};return n.prototype=Object.create(null),n})();function R(n={}){const e=new E,t=Array.isArray(n)||H(n)?n:Object.entries(n);for(const[r,s]of t)if(s){if(e[r]===void 0){e[r]=s;continue}e[r]=[...Array.isArray(e[r])?e[r]:[e[r]],...Array.isArray(s)?s:[s]];}return e}function H(n){return typeof n?.entries=="function"}function v(n={}){if(n instanceof Headers)return n;const e=new Headers;for(const[t,r]of Object.entries(n))if(r!==void 0){if(Array.isArray(r)){for(const s of r)e.append(t,String(s));continue}e.set(t,String(r));}return e}const S=new Set([101,204,205,304]);async function b(n,e){const t=new y,r=new w(t);t.url=e.url?.toString()||"/";let s;if(!t.url.startsWith("/")){const d=new URL(t.url);s=d.host,t.url=d.pathname+d.search+d.hash;}t.method=e.method||"GET",t.headers=R(e.headers||{}),t.headers.host||(t.headers.host=e.host||s||"localhost"),t.connection.encrypted=t.connection.encrypted||e.protocol==="https",t.body=e.body||null,t.__unenv__=e.context,await n(t,r);let a=r._data;(S.has(r.statusCode)||t.method.toUpperCase()==="HEAD")&&(a=null,delete r._headers["content-length"]);const u={status:r.statusCode,statusText:r.statusMessage,headers:r._headers,body:a};return t.destroy(),r.destroy(),u}async function C(n,e,t={}){try{const r=await b(n,{url:e,...t});return new Response(r.body,{status:r.status,statusText:r.statusText,headers:v(r.headers)})}catch(r){return new Response(r.toString(),{status:Number.parseInt(r.statusCode||r.code)||500,statusText:r.statusText})}}

function hasProp(obj, prop) {
  try {
    return prop in obj;
  } catch {
    return false;
  }
}

class H3Error extends Error {
  static __h3_error__ = true;
  statusCode = 500;
  fatal = false;
  unhandled = false;
  statusMessage;
  data;
  cause;
  constructor(message, opts = {}) {
    super(message, opts);
    if (opts.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
  toJSON() {
    const obj = {
      message: this.message,
      statusCode: sanitizeStatusCode(this.statusCode, 500)
    };
    if (this.statusMessage) {
      obj.statusMessage = sanitizeStatusMessage(this.statusMessage);
    }
    if (this.data !== void 0) {
      obj.data = this.data;
    }
    return obj;
  }
}
function createError$1(input) {
  if (typeof input === "string") {
    return new H3Error(input);
  }
  if (isError(input)) {
    return input;
  }
  const err = new H3Error(input.message ?? input.statusMessage ?? "", {
    cause: input.cause || input
  });
  if (hasProp(input, "stack")) {
    try {
      Object.defineProperty(err, "stack", {
        get() {
          return input.stack;
        }
      });
    } catch {
      try {
        err.stack = input.stack;
      } catch {
      }
    }
  }
  if (input.data) {
    err.data = input.data;
  }
  if (input.statusCode) {
    err.statusCode = sanitizeStatusCode(input.statusCode, err.statusCode);
  } else if (input.status) {
    err.statusCode = sanitizeStatusCode(input.status, err.statusCode);
  }
  if (input.statusMessage) {
    err.statusMessage = input.statusMessage;
  } else if (input.statusText) {
    err.statusMessage = input.statusText;
  }
  if (err.statusMessage) {
    const originalMessage = err.statusMessage;
    const sanitizedMessage = sanitizeStatusMessage(err.statusMessage);
    if (sanitizedMessage !== originalMessage) {
      console.warn(
        "[h3] Please prefer using `message` for longer error messages instead of `statusMessage`. In the future, `statusMessage` will be sanitized by default."
      );
    }
  }
  if (input.fatal !== void 0) {
    err.fatal = input.fatal;
  }
  if (input.unhandled !== void 0) {
    err.unhandled = input.unhandled;
  }
  return err;
}
function sendError(event, error, debug) {
  if (event.handled) {
    return;
  }
  const h3Error = isError(error) ? error : createError$1(error);
  const responseBody = {
    statusCode: h3Error.statusCode,
    statusMessage: h3Error.statusMessage,
    stack: [],
    data: h3Error.data
  };
  if (debug) {
    responseBody.stack = (h3Error.stack || "").split("\n").map((l) => l.trim());
  }
  if (event.handled) {
    return;
  }
  const _code = Number.parseInt(h3Error.statusCode);
  setResponseStatus(event, _code, h3Error.statusMessage);
  event.node.res.setHeader("content-type", MIMES.json);
  event.node.res.end(JSON.stringify(responseBody, void 0, 2));
}
function isError(input) {
  return input?.constructor?.__h3_error__ === true;
}

function getQuery(event) {
  return getQuery$1(event.path || "");
}
function getRouterParams(event, opts = {}) {
  let params = event.context.params || {};
  if (opts.decode) {
    params = { ...params };
    for (const key in params) {
      params[key] = decode(params[key]);
    }
  }
  return params;
}
function getRouterParam(event, name, opts = {}) {
  const params = getRouterParams(event, opts);
  return params[name];
}
function isMethod(event, expected, allowHead) {
  if (typeof expected === "string") {
    if (event.method === expected) {
      return true;
    }
  } else if (expected.includes(event.method)) {
    return true;
  }
  return false;
}
function assertMethod(event, expected, allowHead) {
  if (!isMethod(event, expected)) {
    throw createError$1({
      statusCode: 405,
      statusMessage: "HTTP method is not allowed."
    });
  }
}
function getRequestHeaders(event) {
  const _headers = {};
  for (const key in event.node.req.headers) {
    const val = event.node.req.headers[key];
    _headers[key] = Array.isArray(val) ? val.filter(Boolean).join(", ") : val;
  }
  return _headers;
}
function getRequestHeader(event, name) {
  const headers = getRequestHeaders(event);
  const value = headers[name.toLowerCase()];
  return value;
}
const getHeader = getRequestHeader;
function getRequestHost(event, opts = {}) {
  if (opts.xForwardedHost) {
    const _header = event.node.req.headers["x-forwarded-host"];
    const xForwardedHost = (_header || "").split(",").shift()?.trim();
    if (xForwardedHost) {
      return xForwardedHost;
    }
  }
  return event.node.req.headers.host || "localhost";
}
function getRequestProtocol(event, opts = {}) {
  if (opts.xForwardedProto !== false && event.node.req.headers["x-forwarded-proto"] === "https") {
    return "https";
  }
  return event.node.req.connection?.encrypted ? "https" : "http";
}
function getRequestURL(event, opts = {}) {
  const host = getRequestHost(event, opts);
  const protocol = getRequestProtocol(event, opts);
  const path = (event.node.req.originalUrl || event.path).replace(
    /^[/\\]+/g,
    "/"
  );
  return new URL(path, `${protocol}://${host}`);
}

const RawBodySymbol = Symbol.for("h3RawBody");
const ParsedBodySymbol = Symbol.for("h3ParsedBody");
const PayloadMethods$1 = ["PATCH", "POST", "PUT", "DELETE"];
function readRawBody(event, encoding = "utf8") {
  assertMethod(event, PayloadMethods$1);
  const _rawBody = event._requestBody || event.web?.request?.body || event.node.req[RawBodySymbol] || event.node.req.rawBody || event.node.req.body;
  if (_rawBody) {
    const promise2 = Promise.resolve(_rawBody).then((_resolved) => {
      if (Buffer.isBuffer(_resolved)) {
        return _resolved;
      }
      if (typeof _resolved.pipeTo === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.pipeTo(
            new WritableStream({
              write(chunk) {
                chunks.push(chunk);
              },
              close() {
                resolve(Buffer.concat(chunks));
              },
              abort(reason) {
                reject(reason);
              }
            })
          ).catch(reject);
        });
      } else if (typeof _resolved.pipe === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.on("data", (chunk) => {
            chunks.push(chunk);
          }).on("end", () => {
            resolve(Buffer.concat(chunks));
          }).on("error", reject);
        });
      }
      if (_resolved.constructor === Object) {
        return Buffer.from(JSON.stringify(_resolved));
      }
      if (_resolved instanceof URLSearchParams) {
        return Buffer.from(_resolved.toString());
      }
      if (_resolved instanceof FormData) {
        return new Response(_resolved).bytes().then((uint8arr) => Buffer.from(uint8arr));
      }
      return Buffer.from(_resolved);
    });
    return encoding ? promise2.then((buff) => buff.toString(encoding)) : promise2;
  }
  if (!Number.parseInt(event.node.req.headers["content-length"] || "") && !/\bchunked\b/i.test(
    String(event.node.req.headers["transfer-encoding"] ?? "")
  )) {
    return Promise.resolve(void 0);
  }
  const promise = event.node.req[RawBodySymbol] = new Promise(
    (resolve, reject) => {
      const bodyData = [];
      event.node.req.on("error", (err) => {
        reject(err);
      }).on("data", (chunk) => {
        bodyData.push(chunk);
      }).on("end", () => {
        resolve(Buffer.concat(bodyData));
      });
    }
  );
  const result = encoding ? promise.then((buff) => buff.toString(encoding)) : promise;
  return result;
}
async function readBody(event, options = {}) {
  const request = event.node.req;
  if (hasProp(request, ParsedBodySymbol)) {
    return request[ParsedBodySymbol];
  }
  const contentType = request.headers["content-type"] || "";
  const body = await readRawBody(event);
  let parsed;
  if (contentType === "application/json") {
    parsed = _parseJSON(body, options.strict ?? true);
  } else if (contentType.startsWith("application/x-www-form-urlencoded")) {
    parsed = _parseURLEncodedBody(body);
  } else if (contentType.startsWith("text/")) {
    parsed = body;
  } else {
    parsed = _parseJSON(body, options.strict ?? false);
  }
  request[ParsedBodySymbol] = parsed;
  return parsed;
}
function getRequestWebStream(event) {
  if (!PayloadMethods$1.includes(event.method)) {
    return;
  }
  const bodyStream = event.web?.request?.body || event._requestBody;
  if (bodyStream) {
    return bodyStream;
  }
  const _hasRawBody = RawBodySymbol in event.node.req || "rawBody" in event.node.req || "body" in event.node.req || "__unenv__" in event.node.req;
  if (_hasRawBody) {
    return new ReadableStream({
      async start(controller) {
        const _rawBody = await readRawBody(event, false);
        if (_rawBody) {
          controller.enqueue(_rawBody);
        }
        controller.close();
      }
    });
  }
  return new ReadableStream({
    start: (controller) => {
      event.node.req.on("data", (chunk) => {
        controller.enqueue(chunk);
      });
      event.node.req.on("end", () => {
        controller.close();
      });
      event.node.req.on("error", (err) => {
        controller.error(err);
      });
    }
  });
}
function _parseJSON(body = "", strict) {
  if (!body) {
    return void 0;
  }
  try {
    return destr(body, { strict });
  } catch {
    throw createError$1({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "Invalid JSON body"
    });
  }
}
function _parseURLEncodedBody(body) {
  const form = new URLSearchParams(body);
  const parsedForm = /* @__PURE__ */ Object.create(null);
  for (const [key, value] of form.entries()) {
    if (hasProp(parsedForm, key)) {
      if (!Array.isArray(parsedForm[key])) {
        parsedForm[key] = [parsedForm[key]];
      }
      parsedForm[key].push(value);
    } else {
      parsedForm[key] = value;
    }
  }
  return parsedForm;
}

function handleCacheHeaders(event, opts) {
  const cacheControls = ["public", ...opts.cacheControls || []];
  let cacheMatched = false;
  if (opts.maxAge !== void 0) {
    cacheControls.push(`max-age=${+opts.maxAge}`, `s-maxage=${+opts.maxAge}`);
  }
  if (opts.modifiedTime) {
    const modifiedTime = new Date(opts.modifiedTime);
    const ifModifiedSince = event.node.req.headers["if-modified-since"];
    event.node.res.setHeader("last-modified", modifiedTime.toUTCString());
    if (ifModifiedSince && new Date(ifModifiedSince) >= modifiedTime) {
      cacheMatched = true;
    }
  }
  if (opts.etag) {
    event.node.res.setHeader("etag", opts.etag);
    const ifNonMatch = event.node.req.headers["if-none-match"];
    if (ifNonMatch === opts.etag) {
      cacheMatched = true;
    }
  }
  event.node.res.setHeader("cache-control", cacheControls.join(", "));
  if (cacheMatched) {
    event.node.res.statusCode = 304;
    if (!event.handled) {
      event.node.res.end();
    }
    return true;
  }
  return false;
}

const MIMES = {
  html: "text/html",
  json: "application/json"
};

const DISALLOWED_STATUS_CHARS = /[^\u0009\u0020-\u007E]/g;
function sanitizeStatusMessage(statusMessage = "") {
  return statusMessage.replace(DISALLOWED_STATUS_CHARS, "");
}
function sanitizeStatusCode(statusCode, defaultStatusCode = 200) {
  if (!statusCode) {
    return defaultStatusCode;
  }
  if (typeof statusCode === "string") {
    statusCode = Number.parseInt(statusCode, 10);
  }
  if (statusCode < 100 || statusCode > 999) {
    return defaultStatusCode;
  }
  return statusCode;
}

function getDistinctCookieKey(name, opts) {
  return [name, opts.domain || "", opts.path || "/"].join(";");
}
function setCookie(event, name, value, serializeOptions = {}) {
  if (!serializeOptions.path) {
    serializeOptions = { path: "/", ...serializeOptions };
  }
  const newCookie = serialize$2(name, value, serializeOptions);
  const currentCookies = splitCookiesString(
    event.node.res.getHeader("set-cookie")
  );
  if (currentCookies.length === 0) {
    event.node.res.setHeader("set-cookie", newCookie);
    return;
  }
  const newCookieKey = getDistinctCookieKey(name, serializeOptions);
  event.node.res.removeHeader("set-cookie");
  for (const cookie of currentCookies) {
    const parsed = parseSetCookie(cookie);
    const key = getDistinctCookieKey(parsed.name, parsed);
    if (key === newCookieKey) {
      continue;
    }
    event.node.res.appendHeader("set-cookie", cookie);
  }
  event.node.res.appendHeader("set-cookie", newCookie);
}
function splitCookiesString(cookiesString) {
  if (Array.isArray(cookiesString)) {
    return cookiesString.flatMap((c) => splitCookiesString(c));
  }
  if (typeof cookiesString !== "string") {
    return [];
  }
  const cookiesStrings = [];
  let pos = 0;
  let start;
  let ch;
  let lastComma;
  let nextStart;
  let cookiesSeparatorFound;
  const skipWhitespace = () => {
    while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
      pos += 1;
    }
    return pos < cookiesString.length;
  };
  const notSpecialChar = () => {
    ch = cookiesString.charAt(pos);
    return ch !== "=" && ch !== ";" && ch !== ",";
  };
  while (pos < cookiesString.length) {
    start = pos;
    cookiesSeparatorFound = false;
    while (skipWhitespace()) {
      ch = cookiesString.charAt(pos);
      if (ch === ",") {
        lastComma = pos;
        pos += 1;
        skipWhitespace();
        nextStart = pos;
        while (pos < cookiesString.length && notSpecialChar()) {
          pos += 1;
        }
        if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
          cookiesSeparatorFound = true;
          pos = nextStart;
          cookiesStrings.push(cookiesString.slice(start, lastComma));
          start = pos;
        } else {
          pos = lastComma + 1;
        }
      } else {
        pos += 1;
      }
    }
    if (!cookiesSeparatorFound || pos >= cookiesString.length) {
      cookiesStrings.push(cookiesString.slice(start));
    }
  }
  return cookiesStrings;
}

const defer = typeof setImmediate === "undefined" ? (fn) => fn() : setImmediate;
function send(event, data, type) {
  if (type) {
    defaultContentType(event, type);
  }
  return new Promise((resolve) => {
    defer(() => {
      if (!event.handled) {
        event.node.res.end(data);
      }
      resolve();
    });
  });
}
function sendNoContent(event, code) {
  if (event.handled) {
    return;
  }
  if (!code && event.node.res.statusCode !== 200) {
    code = event.node.res.statusCode;
  }
  const _code = sanitizeStatusCode(code, 204);
  if (_code === 204) {
    event.node.res.removeHeader("content-length");
  }
  event.node.res.writeHead(_code);
  event.node.res.end();
}
function setResponseStatus(event, code, text) {
  if (code) {
    event.node.res.statusCode = sanitizeStatusCode(
      code,
      event.node.res.statusCode
    );
  }
  if (text) {
    event.node.res.statusMessage = sanitizeStatusMessage(text);
  }
}
function getResponseStatus(event) {
  return event.node.res.statusCode;
}
function getResponseStatusText(event) {
  return event.node.res.statusMessage;
}
function defaultContentType(event, type) {
  if (type && event.node.res.statusCode !== 304 && !event.node.res.getHeader("content-type")) {
    event.node.res.setHeader("content-type", type);
  }
}
function sendRedirect(event, location, code = 302) {
  event.node.res.statusCode = sanitizeStatusCode(
    code,
    event.node.res.statusCode
  );
  event.node.res.setHeader("location", location);
  const encodedLoc = location.replace(/"/g, "%22");
  const html = `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`;
  return send(event, html, MIMES.html);
}
function getResponseHeader(event, name) {
  return event.node.res.getHeader(name);
}
function setResponseHeaders(event, headers) {
  for (const [name, value] of Object.entries(headers)) {
    event.node.res.setHeader(
      name,
      value
    );
  }
}
const setHeaders = setResponseHeaders;
function setResponseHeader(event, name, value) {
  event.node.res.setHeader(name, value);
}
function appendResponseHeader(event, name, value) {
  let current = event.node.res.getHeader(name);
  if (!current) {
    event.node.res.setHeader(name, value);
    return;
  }
  if (!Array.isArray(current)) {
    current = [current.toString()];
  }
  event.node.res.setHeader(name, [...current, value]);
}
function removeResponseHeader(event, name) {
  return event.node.res.removeHeader(name);
}
function isStream(data) {
  if (!data || typeof data !== "object") {
    return false;
  }
  if (typeof data.pipe === "function") {
    if (typeof data._read === "function") {
      return true;
    }
    if (typeof data.abort === "function") {
      return true;
    }
  }
  if (typeof data.pipeTo === "function") {
    return true;
  }
  return false;
}
function isWebResponse(data) {
  return typeof Response !== "undefined" && data instanceof Response;
}
function sendStream(event, stream) {
  if (!stream || typeof stream !== "object") {
    throw new Error("[h3] Invalid stream provided.");
  }
  event.node.res._data = stream;
  if (!event.node.res.socket) {
    event._handled = true;
    return Promise.resolve();
  }
  if (hasProp(stream, "pipeTo") && typeof stream.pipeTo === "function") {
    return stream.pipeTo(
      new WritableStream({
        write(chunk) {
          event.node.res.write(chunk);
        }
      })
    ).then(() => {
      event.node.res.end();
    });
  }
  if (hasProp(stream, "pipe") && typeof stream.pipe === "function") {
    return new Promise((resolve, reject) => {
      stream.pipe(event.node.res);
      if (stream.on) {
        stream.on("end", () => {
          event.node.res.end();
          resolve();
        });
        stream.on("error", (error) => {
          reject(error);
        });
      }
      event.node.res.on("close", () => {
        if (stream.abort) {
          stream.abort();
        }
      });
    });
  }
  throw new Error("[h3] Invalid or incompatible stream provided.");
}
function sendWebResponse(event, response) {
  for (const [key, value] of response.headers) {
    if (key === "set-cookie") {
      event.node.res.appendHeader(key, splitCookiesString(value));
    } else {
      event.node.res.setHeader(key, value);
    }
  }
  if (response.status) {
    event.node.res.statusCode = sanitizeStatusCode(
      response.status,
      event.node.res.statusCode
    );
  }
  if (response.statusText) {
    event.node.res.statusMessage = sanitizeStatusMessage(response.statusText);
  }
  if (response.redirected) {
    event.node.res.setHeader("location", response.url);
  }
  if (!response.body) {
    event.node.res.end();
    return;
  }
  return sendStream(event, response.body);
}

const PayloadMethods = /* @__PURE__ */ new Set(["PATCH", "POST", "PUT", "DELETE"]);
const ignoredHeaders = /* @__PURE__ */ new Set([
  "transfer-encoding",
  "accept-encoding",
  "connection",
  "keep-alive",
  "upgrade",
  "expect",
  "host",
  "accept"
]);
async function proxyRequest(event, target, opts = {}) {
  let body;
  let duplex;
  if (PayloadMethods.has(event.method)) {
    if (opts.streamRequest) {
      body = getRequestWebStream(event);
      duplex = "half";
    } else {
      body = await readRawBody(event, false).catch(() => void 0);
    }
  }
  const method = opts.fetchOptions?.method || event.method;
  const fetchHeaders = mergeHeaders$1(
    getProxyRequestHeaders(event, { host: target.startsWith("/") }),
    opts.fetchOptions?.headers,
    opts.headers
  );
  return sendProxy(event, target, {
    ...opts,
    fetchOptions: {
      method,
      body,
      duplex,
      ...opts.fetchOptions,
      headers: fetchHeaders
    }
  });
}
async function sendProxy(event, target, opts = {}) {
  let response;
  try {
    response = await _getFetch(opts.fetch)(target, {
      headers: opts.headers,
      ignoreResponseError: true,
      // make $ofetch.raw transparent
      ...opts.fetchOptions
    });
  } catch (error) {
    throw createError$1({
      status: 502,
      statusMessage: "Bad Gateway",
      cause: error
    });
  }
  event.node.res.statusCode = sanitizeStatusCode(
    response.status,
    event.node.res.statusCode
  );
  event.node.res.statusMessage = sanitizeStatusMessage(response.statusText);
  const cookies = [];
  for (const [key, value] of response.headers.entries()) {
    if (key === "content-encoding") {
      continue;
    }
    if (key === "content-length") {
      continue;
    }
    if (key === "set-cookie") {
      cookies.push(...splitCookiesString(value));
      continue;
    }
    event.node.res.setHeader(key, value);
  }
  if (cookies.length > 0) {
    event.node.res.setHeader(
      "set-cookie",
      cookies.map((cookie) => {
        if (opts.cookieDomainRewrite) {
          cookie = rewriteCookieProperty(
            cookie,
            opts.cookieDomainRewrite,
            "domain"
          );
        }
        if (opts.cookiePathRewrite) {
          cookie = rewriteCookieProperty(
            cookie,
            opts.cookiePathRewrite,
            "path"
          );
        }
        return cookie;
      })
    );
  }
  if (opts.onResponse) {
    await opts.onResponse(event, response);
  }
  if (response._data !== void 0) {
    return response._data;
  }
  if (event.handled) {
    return;
  }
  if (opts.sendStream === false) {
    const data = new Uint8Array(await response.arrayBuffer());
    return event.node.res.end(data);
  }
  if (response.body) {
    for await (const chunk of response.body) {
      event.node.res.write(chunk);
    }
  }
  return event.node.res.end();
}
function getProxyRequestHeaders(event, opts) {
  const headers = /* @__PURE__ */ Object.create(null);
  const reqHeaders = getRequestHeaders(event);
  for (const name in reqHeaders) {
    if (!ignoredHeaders.has(name) || name === "host" && opts?.host) {
      headers[name] = reqHeaders[name];
    }
  }
  return headers;
}
function fetchWithEvent(event, req, init, options) {
  return _getFetch(options?.fetch)(req, {
    ...init,
    context: init?.context || event.context,
    headers: {
      ...getProxyRequestHeaders(event, {
        host: typeof req === "string" && req.startsWith("/")
      }),
      ...init?.headers
    }
  });
}
function _getFetch(_fetch) {
  if (_fetch) {
    return _fetch;
  }
  if (globalThis.fetch) {
    return globalThis.fetch;
  }
  throw new Error(
    "fetch is not available. Try importing `node-fetch-native/polyfill` for Node.js."
  );
}
function rewriteCookieProperty(header, map, property) {
  const _map = typeof map === "string" ? { "*": map } : map;
  return header.replace(
    new RegExp(`(;\\s*${property}=)([^;]+)`, "gi"),
    (match, prefix, previousValue) => {
      let newValue;
      if (previousValue in _map) {
        newValue = _map[previousValue];
      } else if ("*" in _map) {
        newValue = _map["*"];
      } else {
        return match;
      }
      return newValue ? prefix + newValue : "";
    }
  );
}
function mergeHeaders$1(defaults, ...inputs) {
  const _inputs = inputs.filter(Boolean);
  if (_inputs.length === 0) {
    return defaults;
  }
  const merged = new Headers(defaults);
  for (const input of _inputs) {
    const entries = Array.isArray(input) ? input : typeof input.entries === "function" ? input.entries() : Object.entries(input);
    for (const [key, value] of entries) {
      if (value !== void 0) {
        merged.set(key, value);
      }
    }
  }
  return merged;
}

class H3Event {
  "__is_event__" = true;
  // Context
  node;
  // Node
  web;
  // Web
  context = {};
  // Shared
  // Request
  _method;
  _path;
  _headers;
  _requestBody;
  // Response
  _handled = false;
  // Hooks
  _onBeforeResponseCalled;
  _onAfterResponseCalled;
  constructor(req, res) {
    this.node = { req, res };
  }
  // --- Request ---
  get method() {
    if (!this._method) {
      this._method = (this.node.req.method || "GET").toUpperCase();
    }
    return this._method;
  }
  get path() {
    return this._path || this.node.req.url || "/";
  }
  get headers() {
    if (!this._headers) {
      this._headers = _normalizeNodeHeaders(this.node.req.headers);
    }
    return this._headers;
  }
  // --- Respoonse ---
  get handled() {
    return this._handled || this.node.res.writableEnded || this.node.res.headersSent;
  }
  respondWith(response) {
    return Promise.resolve(response).then(
      (_response) => sendWebResponse(this, _response)
    );
  }
  // --- Utils ---
  toString() {
    return `[${this.method}] ${this.path}`;
  }
  toJSON() {
    return this.toString();
  }
  // --- Deprecated ---
  /** @deprecated Please use `event.node.req` instead. */
  get req() {
    return this.node.req;
  }
  /** @deprecated Please use `event.node.res` instead. */
  get res() {
    return this.node.res;
  }
}
function isEvent(input) {
  return hasProp(input, "__is_event__");
}
function createEvent(req, res) {
  return new H3Event(req, res);
}
function _normalizeNodeHeaders(nodeHeaders) {
  const headers = new Headers();
  for (const [name, value] of Object.entries(nodeHeaders)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        headers.append(name, item);
      }
    } else if (value) {
      headers.set(name, value);
    }
  }
  return headers;
}

function defineEventHandler(handler) {
  if (typeof handler === "function") {
    handler.__is_handler__ = true;
    return handler;
  }
  const _hooks = {
    onRequest: _normalizeArray(handler.onRequest),
    onBeforeResponse: _normalizeArray(handler.onBeforeResponse)
  };
  const _handler = (event) => {
    return _callHandler(event, handler.handler, _hooks);
  };
  _handler.__is_handler__ = true;
  _handler.__resolve__ = handler.handler.__resolve__;
  _handler.__websocket__ = handler.websocket;
  return _handler;
}
function _normalizeArray(input) {
  return input ? Array.isArray(input) ? input : [input] : void 0;
}
async function _callHandler(event, handler, hooks) {
  if (hooks.onRequest) {
    for (const hook of hooks.onRequest) {
      await hook(event);
      if (event.handled) {
        return;
      }
    }
  }
  const body = await handler(event);
  const response = { body };
  if (hooks.onBeforeResponse) {
    for (const hook of hooks.onBeforeResponse) {
      await hook(event, response);
    }
  }
  return response.body;
}
const eventHandler = defineEventHandler;
function isEventHandler(input) {
  return hasProp(input, "__is_handler__");
}
function toEventHandler(input, _, _route) {
  return input;
}
function defineLazyEventHandler(factory) {
  let _promise;
  let _resolved;
  const resolveHandler = () => {
    if (_resolved) {
      return Promise.resolve(_resolved);
    }
    if (!_promise) {
      _promise = Promise.resolve(factory()).then((r) => {
        const handler2 = r.default || r;
        if (typeof handler2 !== "function") {
          throw new TypeError(
            "Invalid lazy handler result. It should be a function:",
            handler2
          );
        }
        _resolved = { handler: toEventHandler(r.default || r) };
        return _resolved;
      });
    }
    return _promise;
  };
  const handler = eventHandler((event) => {
    if (_resolved) {
      return _resolved.handler(event);
    }
    return resolveHandler().then((r) => r.handler(event));
  });
  handler.__resolve__ = resolveHandler;
  return handler;
}
const lazyEventHandler = defineLazyEventHandler;

function createApp(options = {}) {
  const stack = [];
  const handler = createAppEventHandler(stack, options);
  const resolve = createResolver(stack);
  handler.__resolve__ = resolve;
  const getWebsocket = cachedFn(() => websocketOptions(resolve, options));
  const app = {
    // @ts-expect-error
    use: (arg1, arg2, arg3) => use(app, arg1, arg2, arg3),
    resolve,
    handler,
    stack,
    options,
    get websocket() {
      return getWebsocket();
    }
  };
  return app;
}
function use(app, arg1, arg2, arg3) {
  if (Array.isArray(arg1)) {
    for (const i of arg1) {
      use(app, i, arg2, arg3);
    }
  } else if (Array.isArray(arg2)) {
    for (const i of arg2) {
      use(app, arg1, i, arg3);
    }
  } else if (typeof arg1 === "string") {
    app.stack.push(
      normalizeLayer({ ...arg3, route: arg1, handler: arg2 })
    );
  } else if (typeof arg1 === "function") {
    app.stack.push(normalizeLayer({ ...arg2, handler: arg1 }));
  } else {
    app.stack.push(normalizeLayer({ ...arg1 }));
  }
  return app;
}
function createAppEventHandler(stack, options) {
  const spacing = options.debug ? 2 : void 0;
  return eventHandler(async (event) => {
    event.node.req.originalUrl = event.node.req.originalUrl || event.node.req.url || "/";
    const _rawReqUrl = event.node.req.url || "/";
    const _reqPath = _decodePath(event._path || _rawReqUrl);
    event._path = _reqPath;
    const _needsRawUrl = _reqPath !== _rawReqUrl;
    let _layerPath;
    if (options.onRequest) {
      await options.onRequest(event);
    }
    for (const layer of stack) {
      if (layer.route.length > 1) {
        if (!_reqPath.startsWith(layer.route)) {
          continue;
        }
        _layerPath = _reqPath.slice(layer.route.length) || "/";
      } else {
        _layerPath = _reqPath;
      }
      if (layer.match && !layer.match(_layerPath, event)) {
        continue;
      }
      event._path = _layerPath;
      event.node.req.url = _needsRawUrl ? layer.route.length > 1 ? _rawReqUrl.slice(layer.route.length) || "/" : _rawReqUrl : _layerPath;
      const val = await layer.handler(event);
      const _body = val === void 0 ? void 0 : await val;
      if (_body !== void 0) {
        const _response = { body: _body };
        if (options.onBeforeResponse) {
          event._onBeforeResponseCalled = true;
          await options.onBeforeResponse(event, _response);
        }
        await handleHandlerResponse(event, _response.body, spacing);
        if (options.onAfterResponse) {
          event._onAfterResponseCalled = true;
          await options.onAfterResponse(event, _response);
        }
        return;
      }
      if (event.handled) {
        if (options.onAfterResponse) {
          event._onAfterResponseCalled = true;
          await options.onAfterResponse(event, void 0);
        }
        return;
      }
    }
    if (!event.handled) {
      throw createError$1({
        statusCode: 404,
        statusMessage: `Cannot find any path matching ${event.path || "/"}.`
      });
    }
    if (options.onAfterResponse) {
      event._onAfterResponseCalled = true;
      await options.onAfterResponse(event, void 0);
    }
  });
}
function createResolver(stack) {
  return async (path) => {
    let _layerPath;
    for (const layer of stack) {
      if (layer.route === "/" && !layer.handler.__resolve__) {
        continue;
      }
      if (!path.startsWith(layer.route)) {
        continue;
      }
      _layerPath = path.slice(layer.route.length) || "/";
      if (layer.match && !layer.match(_layerPath, void 0)) {
        continue;
      }
      let res = { route: layer.route, handler: layer.handler };
      if (res.handler.__resolve__) {
        const _res = await res.handler.__resolve__(_layerPath);
        if (!_res) {
          continue;
        }
        res = {
          ...res,
          ..._res,
          route: joinURL(res.route || "/", _res.route || "/")
        };
      }
      return res;
    }
  };
}
function normalizeLayer(input) {
  let handler = input.handler;
  if (handler.handler) {
    handler = handler.handler;
  }
  if (input.lazy) {
    handler = lazyEventHandler(handler);
  } else if (!isEventHandler(handler)) {
    handler = toEventHandler(handler, void 0, input.route);
  }
  return {
    route: withoutTrailingSlash(input.route),
    match: input.match,
    handler
  };
}
function handleHandlerResponse(event, val, jsonSpace) {
  if (val === null) {
    return sendNoContent(event);
  }
  if (val) {
    if (isWebResponse(val)) {
      return sendWebResponse(event, val);
    }
    if (isStream(val)) {
      return sendStream(event, val);
    }
    if (val.buffer) {
      return send(event, val);
    }
    if (val.arrayBuffer && typeof val.arrayBuffer === "function") {
      return val.arrayBuffer().then((arrayBuffer) => {
        return send(event, Buffer.from(arrayBuffer), val.type);
      });
    }
    if (val instanceof Error) {
      throw createError$1(val);
    }
    if (typeof val.end === "function") {
      return true;
    }
  }
  const valType = typeof val;
  if (valType === "string") {
    return send(event, val, MIMES.html);
  }
  if (valType === "object" || valType === "boolean" || valType === "number") {
    return send(event, JSON.stringify(val, void 0, jsonSpace), MIMES.json);
  }
  if (valType === "bigint") {
    return send(event, val.toString(), MIMES.json);
  }
  throw createError$1({
    statusCode: 500,
    statusMessage: `[h3] Cannot send ${valType} as response.`
  });
}
function cachedFn(fn) {
  let cache;
  return () => {
    if (!cache) {
      cache = fn();
    }
    return cache;
  };
}
function _decodePath(url) {
  const qIndex = url.indexOf("?");
  const path = qIndex === -1 ? url : url.slice(0, qIndex);
  const query = qIndex === -1 ? "" : url.slice(qIndex);
  const decodedPath = path.includes("%25") ? decodePath(path.replace(/%25/g, "%2525")) : decodePath(path);
  return decodedPath + query;
}
function websocketOptions(evResolver, appOptions) {
  return {
    ...appOptions.websocket,
    async resolve(info) {
      const url = info.request?.url || info.url || "/";
      const { pathname } = typeof url === "string" ? parseURL(url) : url;
      const resolved = await evResolver(pathname);
      return resolved?.handler?.__websocket__ || {};
    }
  };
}

const RouterMethods = [
  "connect",
  "delete",
  "get",
  "head",
  "options",
  "post",
  "put",
  "trace",
  "patch"
];
function createRouter(opts = {}) {
  const _router = createRouter$1({});
  const routes = {};
  let _matcher;
  const router = {};
  const addRoute = (path, handler, method) => {
    let route = routes[path];
    if (!route) {
      routes[path] = route = { path, handlers: {} };
      _router.insert(path, route);
    }
    if (Array.isArray(method)) {
      for (const m of method) {
        addRoute(path, handler, m);
      }
    } else {
      route.handlers[method] = toEventHandler(handler);
    }
    return router;
  };
  router.use = router.add = (path, handler, method) => addRoute(path, handler, method || "all");
  for (const method of RouterMethods) {
    router[method] = (path, handle) => router.add(path, handle, method);
  }
  const matchHandler = (path = "/", method = "get") => {
    const qIndex = path.indexOf("?");
    if (qIndex !== -1) {
      path = path.slice(0, Math.max(0, qIndex));
    }
    const matched = _router.lookup(path);
    if (!matched || !matched.handlers) {
      return {
        error: createError$1({
          statusCode: 404,
          name: "Not Found",
          statusMessage: `Cannot find any route matching ${path || "/"}.`
        })
      };
    }
    let handler = matched.handlers[method] || matched.handlers.all;
    if (!handler) {
      if (!_matcher) {
        _matcher = toRouteMatcher(_router);
      }
      const _matches = _matcher.matchAll(path).reverse();
      for (const _match of _matches) {
        if (_match.handlers[method]) {
          handler = _match.handlers[method];
          matched.handlers[method] = matched.handlers[method] || handler;
          break;
        }
        if (_match.handlers.all) {
          handler = _match.handlers.all;
          matched.handlers.all = matched.handlers.all || handler;
          break;
        }
      }
    }
    if (!handler) {
      return {
        error: createError$1({
          statusCode: 405,
          name: "Method Not Allowed",
          statusMessage: `Method ${method} is not allowed on this route.`
        })
      };
    }
    return { matched, handler };
  };
  const isPreemptive = opts.preemptive || opts.preemtive;
  router.handler = eventHandler((event) => {
    const match = matchHandler(
      event.path,
      event.method.toLowerCase()
    );
    if ("error" in match) {
      if (isPreemptive) {
        throw match.error;
      } else {
        return;
      }
    }
    event.context.matchedRoute = match.matched;
    const params = match.matched.params || {};
    event.context.params = params;
    return Promise.resolve(match.handler(event)).then((res) => {
      if (res === void 0 && isPreemptive) {
        return null;
      }
      return res;
    });
  });
  router.handler.__resolve__ = async (path) => {
    path = withLeadingSlash(path);
    const match = matchHandler(path);
    if ("error" in match) {
      return;
    }
    let res = {
      route: match.matched.path,
      handler: match.handler
    };
    if (match.handler.__resolve__) {
      const _res = await match.handler.__resolve__(path);
      if (!_res) {
        return;
      }
      res = { ...res, ..._res };
    }
    return res;
  };
  return router;
}
function toNodeListener(app) {
  const toNodeHandle = async function(req, res) {
    const event = createEvent(req, res);
    try {
      await app.handler(event);
    } catch (_error) {
      const error = createError$1(_error);
      if (!isError(_error)) {
        error.unhandled = true;
      }
      setResponseStatus(event, error.statusCode, error.statusMessage);
      if (app.options.onError) {
        await app.options.onError(error, event);
      }
      if (event.handled) {
        return;
      }
      if (error.unhandled || error.fatal) {
        console.error("[h3]", error.fatal ? "[fatal]" : "[unhandled]", error);
      }
      if (app.options.onBeforeResponse && !event._onBeforeResponseCalled) {
        await app.options.onBeforeResponse(event, { body: error });
      }
      await sendError(event, error, !!app.options.debug);
      if (app.options.onAfterResponse && !event._onAfterResponseCalled) {
        await app.options.onAfterResponse(event, { body: error });
      }
    }
  };
  return toNodeHandle;
}

function flatHooks(configHooks, hooks = {}, parentName) {
  for (const key in configHooks) {
    const subHook = configHooks[key];
    const name = parentName ? `${parentName}:${key}` : key;
    if (typeof subHook === "object" && subHook !== null) {
      flatHooks(subHook, hooks, name);
    } else if (typeof subHook === "function") {
      hooks[name] = subHook;
    }
  }
  return hooks;
}
const defaultTask = { run: (function_) => function_() };
const _createTask = () => defaultTask;
const createTask = typeof console.createTask !== "undefined" ? console.createTask : _createTask;
function serialTaskCaller(hooks, args) {
  const name = args.shift();
  const task = createTask(name);
  return hooks.reduce(
    (promise, hookFunction) => promise.then(() => task.run(() => hookFunction(...args))),
    Promise.resolve()
  );
}
function parallelTaskCaller(hooks, args) {
  const name = args.shift();
  const task = createTask(name);
  return Promise.all(hooks.map((hook) => task.run(() => hook(...args))));
}
function callEachWith(callbacks, arg0) {
  for (const callback of [...callbacks]) {
    callback(arg0);
  }
}

class Hookable {
  constructor() {
    this._hooks = {};
    this._before = void 0;
    this._after = void 0;
    this._deprecatedMessages = void 0;
    this._deprecatedHooks = {};
    this.hook = this.hook.bind(this);
    this.callHook = this.callHook.bind(this);
    this.callHookWith = this.callHookWith.bind(this);
  }
  hook(name, function_, options = {}) {
    if (!name || typeof function_ !== "function") {
      return () => {
      };
    }
    const originalName = name;
    let dep;
    while (this._deprecatedHooks[name]) {
      dep = this._deprecatedHooks[name];
      name = dep.to;
    }
    if (dep && !options.allowDeprecated) {
      let message = dep.message;
      if (!message) {
        message = `${originalName} hook has been deprecated` + (dep.to ? `, please use ${dep.to}` : "");
      }
      if (!this._deprecatedMessages) {
        this._deprecatedMessages = /* @__PURE__ */ new Set();
      }
      if (!this._deprecatedMessages.has(message)) {
        console.warn(message);
        this._deprecatedMessages.add(message);
      }
    }
    if (!function_.name) {
      try {
        Object.defineProperty(function_, "name", {
          get: () => "_" + name.replace(/\W+/g, "_") + "_hook_cb",
          configurable: true
        });
      } catch {
      }
    }
    this._hooks[name] = this._hooks[name] || [];
    this._hooks[name].push(function_);
    return () => {
      if (function_) {
        this.removeHook(name, function_);
        function_ = void 0;
      }
    };
  }
  hookOnce(name, function_) {
    let _unreg;
    let _function = (...arguments_) => {
      if (typeof _unreg === "function") {
        _unreg();
      }
      _unreg = void 0;
      _function = void 0;
      return function_(...arguments_);
    };
    _unreg = this.hook(name, _function);
    return _unreg;
  }
  removeHook(name, function_) {
    if (this._hooks[name]) {
      const index = this._hooks[name].indexOf(function_);
      if (index !== -1) {
        this._hooks[name].splice(index, 1);
      }
      if (this._hooks[name].length === 0) {
        delete this._hooks[name];
      }
    }
  }
  deprecateHook(name, deprecated) {
    this._deprecatedHooks[name] = typeof deprecated === "string" ? { to: deprecated } : deprecated;
    const _hooks = this._hooks[name] || [];
    delete this._hooks[name];
    for (const hook of _hooks) {
      this.hook(name, hook);
    }
  }
  deprecateHooks(deprecatedHooks) {
    Object.assign(this._deprecatedHooks, deprecatedHooks);
    for (const name in deprecatedHooks) {
      this.deprecateHook(name, deprecatedHooks[name]);
    }
  }
  addHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    const removeFns = Object.keys(hooks).map(
      (key) => this.hook(key, hooks[key])
    );
    return () => {
      for (const unreg of removeFns.splice(0, removeFns.length)) {
        unreg();
      }
    };
  }
  removeHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    for (const key in hooks) {
      this.removeHook(key, hooks[key]);
    }
  }
  removeAllHooks() {
    for (const key in this._hooks) {
      delete this._hooks[key];
    }
  }
  callHook(name, ...arguments_) {
    arguments_.unshift(name);
    return this.callHookWith(serialTaskCaller, name, ...arguments_);
  }
  callHookParallel(name, ...arguments_) {
    arguments_.unshift(name);
    return this.callHookWith(parallelTaskCaller, name, ...arguments_);
  }
  callHookWith(caller, name, ...arguments_) {
    const event = this._before || this._after ? { name, args: arguments_, context: {} } : void 0;
    if (this._before) {
      callEachWith(this._before, event);
    }
    const result = caller(
      name in this._hooks ? [...this._hooks[name]] : [],
      arguments_
    );
    if (result instanceof Promise) {
      return result.finally(() => {
        if (this._after && event) {
          callEachWith(this._after, event);
        }
      });
    }
    if (this._after && event) {
      callEachWith(this._after, event);
    }
    return result;
  }
  beforeEach(function_) {
    this._before = this._before || [];
    this._before.push(function_);
    return () => {
      if (this._before !== void 0) {
        const index = this._before.indexOf(function_);
        if (index !== -1) {
          this._before.splice(index, 1);
        }
      }
    };
  }
  afterEach(function_) {
    this._after = this._after || [];
    this._after.push(function_);
    return () => {
      if (this._after !== void 0) {
        const index = this._after.indexOf(function_);
        if (index !== -1) {
          this._after.splice(index, 1);
        }
      }
    };
  }
}
function createHooks() {
  return new Hookable();
}

const s$1=globalThis.Headers,i=globalThis.AbortController,l=globalThis.fetch||(()=>{throw new Error("[node-fetch-native] Failed to fetch: `globalThis.fetch` is not available!")});

class FetchError extends Error {
  constructor(message, opts) {
    super(message, opts);
    this.name = "FetchError";
    if (opts?.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
}
function createFetchError(ctx) {
  const errorMessage = ctx.error?.message || ctx.error?.toString() || "";
  const method = ctx.request?.method || ctx.options?.method || "GET";
  const url = ctx.request?.url || String(ctx.request) || "/";
  const requestStr = `[${method}] ${JSON.stringify(url)}`;
  const statusStr = ctx.response ? `${ctx.response.status} ${ctx.response.statusText}` : "<no response>";
  const message = `${requestStr}: ${statusStr}${errorMessage ? ` ${errorMessage}` : ""}`;
  const fetchError = new FetchError(
    message,
    ctx.error ? { cause: ctx.error } : void 0
  );
  for (const key of ["request", "options", "response"]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx[key];
      }
    });
  }
  for (const [key, refKey] of [
    ["data", "_data"],
    ["status", "status"],
    ["statusCode", "status"],
    ["statusText", "statusText"],
    ["statusMessage", "statusText"]
  ]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx.response && ctx.response[refKey];
      }
    });
  }
  return fetchError;
}

const payloadMethods = new Set(
  Object.freeze(["PATCH", "POST", "PUT", "DELETE"])
);
function isPayloadMethod(method = "GET") {
  return payloadMethods.has(method.toUpperCase());
}
function isJSONSerializable(value) {
  if (value === void 0) {
    return false;
  }
  const t = typeof value;
  if (t === "string" || t === "number" || t === "boolean" || t === null) {
    return true;
  }
  if (t !== "object") {
    return false;
  }
  if (Array.isArray(value)) {
    return true;
  }
  if (value.buffer) {
    return false;
  }
  if (value instanceof FormData || value instanceof URLSearchParams) {
    return false;
  }
  return value.constructor && value.constructor.name === "Object" || typeof value.toJSON === "function";
}
const textTypes = /* @__PURE__ */ new Set([
  "image/svg",
  "application/xml",
  "application/xhtml",
  "application/html"
]);
const JSON_RE = /^application\/(?:[\w!#$%&*.^`~-]*\+)?json(;.+)?$/i;
function detectResponseType(_contentType = "") {
  if (!_contentType) {
    return "json";
  }
  const contentType = _contentType.split(";").shift() || "";
  if (JSON_RE.test(contentType)) {
    return "json";
  }
  if (contentType === "text/event-stream") {
    return "stream";
  }
  if (textTypes.has(contentType) || contentType.startsWith("text/")) {
    return "text";
  }
  return "blob";
}
function resolveFetchOptions(request, input, defaults, Headers) {
  const headers = mergeHeaders(
    input?.headers ?? request?.headers,
    defaults?.headers,
    Headers
  );
  let query;
  if (defaults?.query || defaults?.params || input?.params || input?.query) {
    query = {
      ...defaults?.params,
      ...defaults?.query,
      ...input?.params,
      ...input?.query
    };
  }
  return {
    ...defaults,
    ...input,
    query,
    params: query,
    headers
  };
}
function mergeHeaders(input, defaults, Headers) {
  if (!defaults) {
    return new Headers(input);
  }
  const headers = new Headers(defaults);
  if (input) {
    for (const [key, value] of Symbol.iterator in input || Array.isArray(input) ? input : new Headers(input)) {
      headers.set(key, value);
    }
  }
  return headers;
}
async function callHooks(context, hooks) {
  if (hooks) {
    if (Array.isArray(hooks)) {
      for (const hook of hooks) {
        await hook(context);
      }
    } else {
      await hooks(context);
    }
  }
}

const retryStatusCodes = /* @__PURE__ */ new Set([
  408,
  // Request Timeout
  409,
  // Conflict
  425,
  // Too Early (Experimental)
  429,
  // Too Many Requests
  500,
  // Internal Server Error
  502,
  // Bad Gateway
  503,
  // Service Unavailable
  504
  // Gateway Timeout
]);
const nullBodyResponses = /* @__PURE__ */ new Set([101, 204, 205, 304]);
function createFetch(globalOptions = {}) {
  const {
    fetch = globalThis.fetch,
    Headers = globalThis.Headers,
    AbortController = globalThis.AbortController
  } = globalOptions;
  async function onError(context) {
    const isAbort = context.error && context.error.name === "AbortError" && !context.options.timeout || false;
    if (context.options.retry !== false && !isAbort) {
      let retries;
      if (typeof context.options.retry === "number") {
        retries = context.options.retry;
      } else {
        retries = isPayloadMethod(context.options.method) ? 0 : 1;
      }
      const responseCode = context.response && context.response.status || 500;
      if (retries > 0 && (Array.isArray(context.options.retryStatusCodes) ? context.options.retryStatusCodes.includes(responseCode) : retryStatusCodes.has(responseCode))) {
        const retryDelay = typeof context.options.retryDelay === "function" ? context.options.retryDelay(context) : context.options.retryDelay || 0;
        if (retryDelay > 0) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
        return $fetchRaw(context.request, {
          ...context.options,
          retry: retries - 1
        });
      }
    }
    const error = createFetchError(context);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(error, $fetchRaw);
    }
    throw error;
  }
  const $fetchRaw = async function $fetchRaw2(_request, _options = {}) {
    const context = {
      request: _request,
      options: resolveFetchOptions(
        _request,
        _options,
        globalOptions.defaults,
        Headers
      ),
      response: void 0,
      error: void 0
    };
    if (context.options.method) {
      context.options.method = context.options.method.toUpperCase();
    }
    if (context.options.onRequest) {
      await callHooks(context, context.options.onRequest);
      if (!(context.options.headers instanceof Headers)) {
        context.options.headers = new Headers(
          context.options.headers || {}
          /* compat */
        );
      }
    }
    if (typeof context.request === "string") {
      if (context.options.baseURL) {
        context.request = withBase(context.request, context.options.baseURL);
      }
      if (context.options.query) {
        context.request = withQuery(context.request, context.options.query);
        delete context.options.query;
      }
      if ("query" in context.options) {
        delete context.options.query;
      }
      if ("params" in context.options) {
        delete context.options.params;
      }
    }
    if (context.options.body && isPayloadMethod(context.options.method)) {
      if (isJSONSerializable(context.options.body)) {
        const contentType = context.options.headers.get("content-type");
        if (typeof context.options.body !== "string") {
          context.options.body = contentType === "application/x-www-form-urlencoded" ? new URLSearchParams(
            context.options.body
          ).toString() : JSON.stringify(context.options.body);
        }
        if (!contentType) {
          context.options.headers.set("content-type", "application/json");
        }
        if (!context.options.headers.has("accept")) {
          context.options.headers.set("accept", "application/json");
        }
      } else if (
        // ReadableStream Body
        "pipeTo" in context.options.body && typeof context.options.body.pipeTo === "function" || // Node.js Stream Body
        typeof context.options.body.pipe === "function"
      ) {
        if (!("duplex" in context.options)) {
          context.options.duplex = "half";
        }
      }
    }
    let abortTimeout;
    if (!context.options.signal && context.options.timeout) {
      const controller = new AbortController();
      abortTimeout = setTimeout(() => {
        const error = new Error(
          "[TimeoutError]: The operation was aborted due to timeout"
        );
        error.name = "TimeoutError";
        error.code = 23;
        controller.abort(error);
      }, context.options.timeout);
      context.options.signal = controller.signal;
    }
    try {
      context.response = await fetch(
        context.request,
        context.options
      );
    } catch (error) {
      context.error = error;
      if (context.options.onRequestError) {
        await callHooks(
          context,
          context.options.onRequestError
        );
      }
      return await onError(context);
    } finally {
      if (abortTimeout) {
        clearTimeout(abortTimeout);
      }
    }
    const hasBody = (context.response.body || // https://github.com/unjs/ofetch/issues/324
    // https://github.com/unjs/ofetch/issues/294
    // https://github.com/JakeChampion/fetch/issues/1454
    context.response._bodyInit) && !nullBodyResponses.has(context.response.status) && context.options.method !== "HEAD";
    if (hasBody) {
      const responseType = (context.options.parseResponse ? "json" : context.options.responseType) || detectResponseType(context.response.headers.get("content-type") || "");
      switch (responseType) {
        case "json": {
          const data = await context.response.text();
          const parseFunction = context.options.parseResponse || destr;
          context.response._data = parseFunction(data);
          break;
        }
        case "stream": {
          context.response._data = context.response.body || context.response._bodyInit;
          break;
        }
        default: {
          context.response._data = await context.response[responseType]();
        }
      }
    }
    if (context.options.onResponse) {
      await callHooks(
        context,
        context.options.onResponse
      );
    }
    if (!context.options.ignoreResponseError && context.response.status >= 400 && context.response.status < 600) {
      if (context.options.onResponseError) {
        await callHooks(
          context,
          context.options.onResponseError
        );
      }
      return await onError(context);
    }
    return context.response;
  };
  const $fetch = async function $fetch2(request, options) {
    const r = await $fetchRaw(request, options);
    return r._data;
  };
  $fetch.raw = $fetchRaw;
  $fetch.native = (...args) => fetch(...args);
  $fetch.create = (defaultOptions = {}, customGlobalOptions = {}) => createFetch({
    ...globalOptions,
    ...customGlobalOptions,
    defaults: {
      ...globalOptions.defaults,
      ...customGlobalOptions.defaults,
      ...defaultOptions
    }
  });
  return $fetch;
}

function createNodeFetch() {
  const useKeepAlive = JSON.parse(process.env.FETCH_KEEP_ALIVE || "false");
  if (!useKeepAlive) {
    return l;
  }
  const agentOptions = { keepAlive: true };
  const httpAgent = new http.Agent(agentOptions);
  const httpsAgent = new https.Agent(agentOptions);
  const nodeFetchOptions = {
    agent(parsedURL) {
      return parsedURL.protocol === "http:" ? httpAgent : httpsAgent;
    }
  };
  return function nodeFetchWithKeepAlive(input, init) {
    return l(input, { ...nodeFetchOptions, ...init });
  };
}
const fetch$1 = globalThis.fetch ? (...args) => globalThis.fetch(...args) : createNodeFetch();
const Headers$1 = globalThis.Headers || s$1;
const AbortController = globalThis.AbortController || i;
const ofetch = createFetch({ fetch: fetch$1, Headers: Headers$1, AbortController });
const $fetch$1 = ofetch;

function wrapToPromise(value) {
  if (!value || typeof value.then !== "function") {
    return Promise.resolve(value);
  }
  return value;
}
function asyncCall(function_, ...arguments_) {
  try {
    return wrapToPromise(function_(...arguments_));
  } catch (error) {
    return Promise.reject(error);
  }
}
function isPrimitive(value) {
  const type = typeof value;
  return value === null || type !== "object" && type !== "function";
}
function isPureObject(value) {
  const proto = Object.getPrototypeOf(value);
  return !proto || proto.isPrototypeOf(Object);
}
function stringify(value) {
  if (isPrimitive(value)) {
    return String(value);
  }
  if (isPureObject(value) || Array.isArray(value)) {
    return JSON.stringify(value);
  }
  if (typeof value.toJSON === "function") {
    return stringify(value.toJSON());
  }
  throw new Error("[unstorage] Cannot stringify value!");
}
const BASE64_PREFIX = "base64:";
function serializeRaw(value) {
  if (typeof value === "string") {
    return value;
  }
  return BASE64_PREFIX + base64Encode(value);
}
function deserializeRaw(value) {
  if (typeof value !== "string") {
    return value;
  }
  if (!value.startsWith(BASE64_PREFIX)) {
    return value;
  }
  return base64Decode(value.slice(BASE64_PREFIX.length));
}
function base64Decode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input, "base64");
  }
  return Uint8Array.from(
    globalThis.atob(input),
    (c) => c.codePointAt(0)
  );
}
function base64Encode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input).toString("base64");
  }
  return globalThis.btoa(String.fromCodePoint(...input));
}

const storageKeyProperties = [
  "has",
  "hasItem",
  "get",
  "getItem",
  "getItemRaw",
  "set",
  "setItem",
  "setItemRaw",
  "del",
  "remove",
  "removeItem",
  "getMeta",
  "setMeta",
  "removeMeta",
  "getKeys",
  "clear",
  "mount",
  "unmount"
];
function prefixStorage(storage, base) {
  base = normalizeBaseKey(base);
  if (!base) {
    return storage;
  }
  const nsStorage = { ...storage };
  for (const property of storageKeyProperties) {
    nsStorage[property] = (key = "", ...args) => (
      // @ts-ignore
      storage[property](base + key, ...args)
    );
  }
  nsStorage.getKeys = (key = "", ...arguments_) => storage.getKeys(base + key, ...arguments_).then((keys) => keys.map((key2) => key2.slice(base.length)));
  nsStorage.keys = nsStorage.getKeys;
  nsStorage.getItems = async (items, commonOptions) => {
    const prefixedItems = items.map(
      (item) => typeof item === "string" ? base + item : { ...item, key: base + item.key }
    );
    const results = await storage.getItems(prefixedItems, commonOptions);
    return results.map((entry) => ({
      key: entry.key.slice(base.length),
      value: entry.value
    }));
  };
  nsStorage.setItems = async (items, commonOptions) => {
    const prefixedItems = items.map((item) => ({
      key: base + item.key,
      value: item.value,
      options: item.options
    }));
    return storage.setItems(prefixedItems, commonOptions);
  };
  return nsStorage;
}
function normalizeKey$1(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
}
function joinKeys(...keys) {
  return normalizeKey$1(keys.join(":"));
}
function normalizeBaseKey(base) {
  base = normalizeKey$1(base);
  return base ? base + ":" : "";
}
function filterKeyByDepth(key, depth) {
  if (depth === void 0) {
    return true;
  }
  let substrCount = 0;
  let index = key.indexOf(":");
  while (index > -1) {
    substrCount++;
    index = key.indexOf(":", index + 1);
  }
  return substrCount <= depth;
}
function filterKeyByBase(key, base) {
  if (base) {
    return key.startsWith(base) && key[key.length - 1] !== "$";
  }
  return key[key.length - 1] !== "$";
}

function defineDriver$1(factory) {
  return factory;
}

const DRIVER_NAME$1 = "memory";
const memory = defineDriver$1(() => {
  const data = /* @__PURE__ */ new Map();
  return {
    name: DRIVER_NAME$1,
    getInstance: () => data,
    hasItem(key) {
      return data.has(key);
    },
    getItem(key) {
      return data.get(key) ?? null;
    },
    getItemRaw(key) {
      return data.get(key) ?? null;
    },
    setItem(key, value) {
      data.set(key, value);
    },
    setItemRaw(key, value) {
      data.set(key, value);
    },
    removeItem(key) {
      data.delete(key);
    },
    getKeys() {
      return [...data.keys()];
    },
    clear() {
      data.clear();
    },
    dispose() {
      data.clear();
    }
  };
});

function createStorage(options = {}) {
  const context = {
    mounts: { "": options.driver || memory() },
    mountpoints: [""],
    watching: false,
    watchListeners: [],
    unwatch: {}
  };
  const getMount = (key) => {
    for (const base of context.mountpoints) {
      if (key.startsWith(base)) {
        return {
          base,
          relativeKey: key.slice(base.length),
          driver: context.mounts[base]
        };
      }
    }
    return {
      base: "",
      relativeKey: key,
      driver: context.mounts[""]
    };
  };
  const getMounts = (base, includeParent) => {
    return context.mountpoints.filter(
      (mountpoint) => mountpoint.startsWith(base) || includeParent && base.startsWith(mountpoint)
    ).map((mountpoint) => ({
      relativeBase: base.length > mountpoint.length ? base.slice(mountpoint.length) : void 0,
      mountpoint,
      driver: context.mounts[mountpoint]
    }));
  };
  const onChange = (event, key) => {
    if (!context.watching) {
      return;
    }
    key = normalizeKey$1(key);
    for (const listener of context.watchListeners) {
      listener(event, key);
    }
  };
  const startWatch = async () => {
    if (context.watching) {
      return;
    }
    context.watching = true;
    for (const mountpoint in context.mounts) {
      context.unwatch[mountpoint] = await watch(
        context.mounts[mountpoint],
        onChange,
        mountpoint
      );
    }
  };
  const stopWatch = async () => {
    if (!context.watching) {
      return;
    }
    for (const mountpoint in context.unwatch) {
      await context.unwatch[mountpoint]();
    }
    context.unwatch = {};
    context.watching = false;
  };
  const runBatch = (items, commonOptions, cb) => {
    const batches = /* @__PURE__ */ new Map();
    const getBatch = (mount) => {
      let batch = batches.get(mount.base);
      if (!batch) {
        batch = {
          driver: mount.driver,
          base: mount.base,
          items: []
        };
        batches.set(mount.base, batch);
      }
      return batch;
    };
    for (const item of items) {
      const isStringItem = typeof item === "string";
      const key = normalizeKey$1(isStringItem ? item : item.key);
      const value = isStringItem ? void 0 : item.value;
      const options2 = isStringItem || !item.options ? commonOptions : { ...commonOptions, ...item.options };
      const mount = getMount(key);
      getBatch(mount).items.push({
        key,
        value,
        relativeKey: mount.relativeKey,
        options: options2
      });
    }
    return Promise.all([...batches.values()].map((batch) => cb(batch))).then(
      (r) => r.flat()
    );
  };
  const storage = {
    // Item
    hasItem(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.hasItem, relativeKey, opts);
    },
    getItem(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => destr(value)
      );
    },
    getItems(items, commonOptions = {}) {
      return runBatch(items, commonOptions, (batch) => {
        if (batch.driver.getItems) {
          return asyncCall(
            batch.driver.getItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              options: item.options
            })),
            commonOptions
          ).then(
            (r) => r.map((item) => ({
              key: joinKeys(batch.base, item.key),
              value: destr(item.value)
            }))
          );
        }
        return Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.getItem,
              item.relativeKey,
              item.options
            ).then((value) => ({
              key: item.key,
              value: destr(value)
            }));
          })
        );
      });
    },
    getItemRaw(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.getItemRaw) {
        return asyncCall(driver.getItemRaw, relativeKey, opts);
      }
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => deserializeRaw(value)
      );
    },
    async setItem(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key);
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.setItem) {
        return;
      }
      await asyncCall(driver.setItem, relativeKey, stringify(value), opts);
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async setItems(items, commonOptions) {
      await runBatch(items, commonOptions, async (batch) => {
        if (batch.driver.setItems) {
          return asyncCall(
            batch.driver.setItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              value: stringify(item.value),
              options: item.options
            })),
            commonOptions
          );
        }
        if (!batch.driver.setItem) {
          return;
        }
        await Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.setItem,
              item.relativeKey,
              stringify(item.value),
              item.options
            );
          })
        );
      });
    },
    async setItemRaw(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key, opts);
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.setItemRaw) {
        await asyncCall(driver.setItemRaw, relativeKey, value, opts);
      } else if (driver.setItem) {
        await asyncCall(driver.setItem, relativeKey, serializeRaw(value), opts);
      } else {
        return;
      }
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async removeItem(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { removeMeta: opts };
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.removeItem) {
        return;
      }
      await asyncCall(driver.removeItem, relativeKey, opts);
      if (opts.removeMeta || opts.removeMata) {
        await asyncCall(driver.removeItem, relativeKey + "$", opts);
      }
      if (!driver.watch) {
        onChange("remove", key);
      }
    },
    // Meta
    async getMeta(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { nativeOnly: opts };
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      const meta = /* @__PURE__ */ Object.create(null);
      if (driver.getMeta) {
        Object.assign(meta, await asyncCall(driver.getMeta, relativeKey, opts));
      }
      if (!opts.nativeOnly) {
        const value = await asyncCall(
          driver.getItem,
          relativeKey + "$",
          opts
        ).then((value_) => destr(value_));
        if (value && typeof value === "object") {
          if (typeof value.atime === "string") {
            value.atime = new Date(value.atime);
          }
          if (typeof value.mtime === "string") {
            value.mtime = new Date(value.mtime);
          }
          Object.assign(meta, value);
        }
      }
      return meta;
    },
    setMeta(key, value, opts = {}) {
      return this.setItem(key + "$", value, opts);
    },
    removeMeta(key, opts = {}) {
      return this.removeItem(key + "$", opts);
    },
    // Keys
    async getKeys(base, opts = {}) {
      base = normalizeBaseKey(base);
      const mounts = getMounts(base, true);
      let maskedMounts = [];
      const allKeys = [];
      let allMountsSupportMaxDepth = true;
      for (const mount of mounts) {
        if (!mount.driver.flags?.maxDepth) {
          allMountsSupportMaxDepth = false;
        }
        const rawKeys = await asyncCall(
          mount.driver.getKeys,
          mount.relativeBase,
          opts
        );
        for (const key of rawKeys) {
          const fullKey = mount.mountpoint + normalizeKey$1(key);
          if (!maskedMounts.some((p) => fullKey.startsWith(p))) {
            allKeys.push(fullKey);
          }
        }
        maskedMounts = [
          mount.mountpoint,
          ...maskedMounts.filter((p) => !p.startsWith(mount.mountpoint))
        ];
      }
      const shouldFilterByDepth = opts.maxDepth !== void 0 && !allMountsSupportMaxDepth;
      return allKeys.filter(
        (key) => (!shouldFilterByDepth || filterKeyByDepth(key, opts.maxDepth)) && filterKeyByBase(key, base)
      );
    },
    // Utils
    async clear(base, opts = {}) {
      base = normalizeBaseKey(base);
      await Promise.all(
        getMounts(base, false).map(async (m) => {
          if (m.driver.clear) {
            return asyncCall(m.driver.clear, m.relativeBase, opts);
          }
          if (m.driver.removeItem) {
            const keys = await m.driver.getKeys(m.relativeBase || "", opts);
            return Promise.all(
              keys.map((key) => m.driver.removeItem(key, opts))
            );
          }
        })
      );
    },
    async dispose() {
      await Promise.all(
        Object.values(context.mounts).map((driver) => dispose(driver))
      );
    },
    async watch(callback) {
      await startWatch();
      context.watchListeners.push(callback);
      return async () => {
        context.watchListeners = context.watchListeners.filter(
          (listener) => listener !== callback
        );
        if (context.watchListeners.length === 0) {
          await stopWatch();
        }
      };
    },
    async unwatch() {
      context.watchListeners = [];
      await stopWatch();
    },
    // Mount
    mount(base, driver) {
      base = normalizeBaseKey(base);
      if (base && context.mounts[base]) {
        throw new Error(`already mounted at ${base}`);
      }
      if (base) {
        context.mountpoints.push(base);
        context.mountpoints.sort((a, b) => b.length - a.length);
      }
      context.mounts[base] = driver;
      if (context.watching) {
        Promise.resolve(watch(driver, onChange, base)).then((unwatcher) => {
          context.unwatch[base] = unwatcher;
        }).catch(console.error);
      }
      return storage;
    },
    async unmount(base, _dispose = true) {
      base = normalizeBaseKey(base);
      if (!base || !context.mounts[base]) {
        return;
      }
      if (context.watching && base in context.unwatch) {
        context.unwatch[base]?.();
        delete context.unwatch[base];
      }
      if (_dispose) {
        await dispose(context.mounts[base]);
      }
      context.mountpoints = context.mountpoints.filter((key) => key !== base);
      delete context.mounts[base];
    },
    getMount(key = "") {
      key = normalizeKey$1(key) + ":";
      const m = getMount(key);
      return {
        driver: m.driver,
        base: m.base
      };
    },
    getMounts(base = "", opts = {}) {
      base = normalizeKey$1(base);
      const mounts = getMounts(base, opts.parents);
      return mounts.map((m) => ({
        driver: m.driver,
        base: m.mountpoint
      }));
    },
    // Aliases
    keys: (base, opts = {}) => storage.getKeys(base, opts),
    get: (key, opts = {}) => storage.getItem(key, opts),
    set: (key, value, opts = {}) => storage.setItem(key, value, opts),
    has: (key, opts = {}) => storage.hasItem(key, opts),
    del: (key, opts = {}) => storage.removeItem(key, opts),
    remove: (key, opts = {}) => storage.removeItem(key, opts)
  };
  return storage;
}
function watch(driver, onChange, base) {
  return driver.watch ? driver.watch((event, key) => onChange(event, base + key)) : () => {
  };
}
async function dispose(driver) {
  if (typeof driver.dispose === "function") {
    await asyncCall(driver.dispose);
  }
}

const _assets = {

};

const normalizeKey = function normalizeKey(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
};

const assets$1 = {
  getKeys() {
    return Promise.resolve(Object.keys(_assets))
  },
  hasItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(id in _assets)
  },
  getItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].import() : null)
  },
  getMeta (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].meta : {})
  }
};

function defineDriver(factory) {
  return factory;
}
function createError(driver, message, opts) {
  const err = new Error(`[unstorage] [${driver}] ${message}`, opts);
  if (Error.captureStackTrace) {
    Error.captureStackTrace(err, createError);
  }
  return err;
}
function createRequiredError(driver, name) {
  if (Array.isArray(name)) {
    return createError(
      driver,
      `Missing some of the required options ${name.map((n) => "`" + n + "`").join(", ")}`
    );
  }
  return createError(driver, `Missing required option \`${name}\`.`);
}

function ignoreNotfound(err) {
  return err.code === "ENOENT" || err.code === "EISDIR" ? null : err;
}
function ignoreExists(err) {
  return err.code === "EEXIST" ? null : err;
}
async function writeFile(path, data, encoding) {
  await ensuredir(dirname$1(path));
  return promises.writeFile(path, data, encoding);
}
function readFile(path, encoding) {
  return promises.readFile(path, encoding).catch(ignoreNotfound);
}
function unlink(path) {
  return promises.unlink(path).catch(ignoreNotfound);
}
function readdir(dir) {
  return promises.readdir(dir, { withFileTypes: true }).catch(ignoreNotfound).then((r) => r || []);
}
async function ensuredir(dir) {
  if (existsSync(dir)) {
    return;
  }
  await ensuredir(dirname$1(dir)).catch(ignoreExists);
  await promises.mkdir(dir).catch(ignoreExists);
}
async function readdirRecursive(dir, ignore, maxDepth) {
  if (ignore && ignore(dir)) {
    return [];
  }
  const entries = await readdir(dir);
  const files = [];
  await Promise.all(
    entries.map(async (entry) => {
      const entryPath = resolve$1(dir, entry.name);
      if (entry.isDirectory()) {
        if (maxDepth === void 0 || maxDepth > 0) {
          const dirFiles = await readdirRecursive(
            entryPath,
            ignore,
            maxDepth === void 0 ? void 0 : maxDepth - 1
          );
          files.push(...dirFiles.map((f) => entry.name + "/" + f));
        }
      } else {
        if (!(ignore && ignore(entry.name))) {
          files.push(entry.name);
        }
      }
    })
  );
  return files;
}
async function rmRecursive(dir) {
  const entries = await readdir(dir);
  await Promise.all(
    entries.map((entry) => {
      const entryPath = resolve$1(dir, entry.name);
      if (entry.isDirectory()) {
        return rmRecursive(entryPath).then(() => promises.rmdir(entryPath));
      } else {
        return promises.unlink(entryPath);
      }
    })
  );
}

const PATH_TRAVERSE_RE = /\.\.:|\.\.$/;
const DRIVER_NAME = "fs-lite";
const unstorage_47drivers_47fs_45lite = defineDriver((opts = {}) => {
  if (!opts.base) {
    throw createRequiredError(DRIVER_NAME, "base");
  }
  opts.base = resolve$1(opts.base);
  const r = (key) => {
    if (PATH_TRAVERSE_RE.test(key)) {
      throw createError(
        DRIVER_NAME,
        `Invalid key: ${JSON.stringify(key)}. It should not contain .. segments`
      );
    }
    const resolved = join(opts.base, key.replace(/:/g, "/"));
    return resolved;
  };
  return {
    name: DRIVER_NAME,
    options: opts,
    flags: {
      maxDepth: true
    },
    hasItem(key) {
      return existsSync(r(key));
    },
    getItem(key) {
      return readFile(r(key), "utf8");
    },
    getItemRaw(key) {
      return readFile(r(key));
    },
    async getMeta(key) {
      const { atime, mtime, size, birthtime, ctime } = await promises.stat(r(key)).catch(() => ({}));
      return { atime, mtime, size, birthtime, ctime };
    },
    setItem(key, value) {
      if (opts.readOnly) {
        return;
      }
      return writeFile(r(key), value, "utf8");
    },
    setItemRaw(key, value) {
      if (opts.readOnly) {
        return;
      }
      return writeFile(r(key), value);
    },
    removeItem(key) {
      if (opts.readOnly) {
        return;
      }
      return unlink(r(key));
    },
    getKeys(_base, topts) {
      return readdirRecursive(r("."), opts.ignore, topts?.maxDepth);
    },
    async clear() {
      if (opts.readOnly || opts.noClear) {
        return;
      }
      await rmRecursive(r("."));
    }
  };
});

const storage = createStorage({});

storage.mount('/assets', assets$1);

storage.mount('data', unstorage_47drivers_47fs_45lite({"driver":"fsLite","base":"./.data/kv"}));

function useStorage(base = "") {
  return base ? prefixStorage(storage, base) : storage;
}

function serialize$1(o){return typeof o=="string"?`'${o}'`:new c().serialize(o)}const c=/*@__PURE__*/function(){class o{#t=new Map;compare(t,r){const e=typeof t,n=typeof r;return e==="string"&&n==="string"?t.localeCompare(r):e==="number"&&n==="number"?t-r:String.prototype.localeCompare.call(this.serialize(t,true),this.serialize(r,true))}serialize(t,r){if(t===null)return "null";switch(typeof t){case "string":return r?t:`'${t}'`;case "bigint":return `${t}n`;case "object":return this.$object(t);case "function":return this.$function(t)}return String(t)}serializeObject(t){const r=Object.prototype.toString.call(t);if(r!=="[object Object]")return this.serializeBuiltInType(r.length<10?`unknown:${r}`:r.slice(8,-1),t);const e=t.constructor,n=e===Object||e===void 0?"":e.name;if(n!==""&&globalThis[n]===e)return this.serializeBuiltInType(n,t);if(typeof t.toJSON=="function"){const i=t.toJSON();return n+(i!==null&&typeof i=="object"?this.$object(i):`(${this.serialize(i)})`)}return this.serializeObjectEntries(n,Object.entries(t))}serializeBuiltInType(t,r){const e=this["$"+t];if(e)return e.call(this,r);if(typeof r?.entries=="function")return this.serializeObjectEntries(t,r.entries());throw new Error(`Cannot serialize ${t}`)}serializeObjectEntries(t,r){const e=Array.from(r).sort((i,a)=>this.compare(i[0],a[0]));let n=`${t}{`;for(let i=0;i<e.length;i++){const[a,l]=e[i];n+=`${this.serialize(a,true)}:${this.serialize(l)}`,i<e.length-1&&(n+=",");}return n+"}"}$object(t){let r=this.#t.get(t);return r===void 0&&(this.#t.set(t,`#${this.#t.size}`),r=this.serializeObject(t),this.#t.set(t,r)),r}$function(t){const r=Function.prototype.toString.call(t);return r.slice(-15)==="[native code] }"?`${t.name||""}()[native]`:`${t.name}(${t.length})${r.replace(/\s*\n\s*/g,"")}`}$Array(t){let r="[";for(let e=0;e<t.length;e++)r+=this.serialize(t[e]),e<t.length-1&&(r+=",");return r+"]"}$Date(t){try{return `Date(${t.toISOString()})`}catch{return "Date(null)"}}$ArrayBuffer(t){return `ArrayBuffer[${new Uint8Array(t).join(",")}]`}$Set(t){return `Set${this.$Array(Array.from(t).sort((r,e)=>this.compare(r,e)))}`}$Map(t){return this.serializeObjectEntries("Map",t.entries())}}for(const s of ["Error","RegExp","URL"])o.prototype["$"+s]=function(t){return `${s}(${t})`};for(const s of ["Int8Array","Uint8Array","Uint8ClampedArray","Int16Array","Uint16Array","Int32Array","Uint32Array","Float32Array","Float64Array"])o.prototype["$"+s]=function(t){return `${s}[${t.join(",")}]`};for(const s of ["BigInt64Array","BigUint64Array"])o.prototype["$"+s]=function(t){return `${s}[${t.join("n,")}${t.length>0?"n":""}]`};return o}();

const e=globalThis.process?.getBuiltinModule?.("crypto")?.hash,r="sha256",s="base64url";function digest(t){if(e)return e(r,t,s);const o=createHash(r).update(t);return globalThis.process?.versions?.webcontainer?o.digest().toString(s):o.digest(s)}

function hash$1(input) {
  return digest(serialize$1(input));
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

function klona(x) {
	if (typeof x !== 'object') return x;

	var k, tmp, str=Object.prototype.toString.call(x);

	if (str === '[object Object]') {
		if (x.constructor !== Object && typeof x.constructor === 'function') {
			tmp = new x.constructor();
			for (k in x) {
				if (x.hasOwnProperty(k) && tmp[k] !== x[k]) {
					tmp[k] = klona(x[k]);
				}
			}
		} else {
			tmp = {}; // null
			for (k in x) {
				if (k === '__proto__') {
					Object.defineProperty(tmp, k, {
						value: klona(x[k]),
						configurable: true,
						enumerable: true,
						writable: true,
					});
				} else {
					tmp[k] = klona(x[k]);
				}
			}
		}
		return tmp;
	}

	if (str === '[object Array]') {
		k = x.length;
		for (tmp=Array(k); k--;) {
			tmp[k] = klona(x[k]);
		}
		return tmp;
	}

	if (str === '[object Set]') {
		tmp = new Set;
		x.forEach(function (val) {
			tmp.add(klona(val));
		});
		return tmp;
	}

	if (str === '[object Map]') {
		tmp = new Map;
		x.forEach(function (val, key) {
			tmp.set(klona(key), klona(val));
		});
		return tmp;
	}

	if (str === '[object Date]') {
		return new Date(+x);
	}

	if (str === '[object RegExp]') {
		tmp = new RegExp(x.source, x.flags);
		tmp.lastIndex = x.lastIndex;
		return tmp;
	}

	if (str === '[object DataView]') {
		return new x.constructor( klona(x.buffer) );
	}

	if (str === '[object ArrayBuffer]') {
		return x.slice(0);
	}

	// ArrayBuffer.isView(x)
	// ~> `new` bcuz `Buffer.slice` => ref
	if (str.slice(-6) === 'Array]') {
		return new x.constructor(x);
	}

	return x;
}

const inlineAppConfig = {
  "nuxt": {}
};



const appConfig = defuFn(inlineAppConfig);

const NUMBER_CHAR_RE = /\d/;
const STR_SPLITTERS = ["-", "_", "/", "."];
function isUppercase(char = "") {
  if (NUMBER_CHAR_RE.test(char)) {
    return void 0;
  }
  return char !== char.toLowerCase();
}
function splitByCase(str, separators) {
  const splitters = STR_SPLITTERS;
  const parts = [];
  if (!str || typeof str !== "string") {
    return parts;
  }
  let buff = "";
  let previousUpper;
  let previousSplitter;
  for (const char of str) {
    const isSplitter = splitters.includes(char);
    if (isSplitter === true) {
      parts.push(buff);
      buff = "";
      previousUpper = void 0;
      continue;
    }
    const isUpper = isUppercase(char);
    if (previousSplitter === false) {
      if (previousUpper === false && isUpper === true) {
        parts.push(buff);
        buff = char;
        previousUpper = isUpper;
        continue;
      }
      if (previousUpper === true && isUpper === false && buff.length > 1) {
        const lastChar = buff.at(-1);
        parts.push(buff.slice(0, Math.max(0, buff.length - 1)));
        buff = lastChar + char;
        previousUpper = isUpper;
        continue;
      }
    }
    buff += char;
    previousUpper = isUpper;
    previousSplitter = isSplitter;
  }
  parts.push(buff);
  return parts;
}
function kebabCase(str, joiner) {
  return str ? (Array.isArray(str) ? str : splitByCase(str)).map((p) => p.toLowerCase()).join(joiner) : "";
}
function snakeCase(str) {
  return kebabCase(str || "", "_");
}

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
    "buildId": "db346e87-12ee-4e0f-9f7c-4dd8bc61d859",
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
      },
      "/_nuxt/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        }
      }
    }
  },
  "public": {
    "brandName": "INUU",
    "platformBaseDomain": "",
    "defaultCitySlug": "ulan-ude",
    "yandexMapsApiKey": "",
    "telegramBotName": "",
    "maxBotUrl": "",
    "pickupPointsJson": "",
    "dadataToken": "",
    "supabaseUrl": "",
    "supabaseKey": "",
    "vkIdClientId": "",
    "supabase": {
      "url": "",
      "key": "",
      "redirect": false,
      "redirectOptions": {
        "login": "/login",
        "callback": "/confirm",
        "exclude": [],
        "cookieRedirect": false,
        "saveRedirectToCookie": false
      },
      "cookieName": "sb",
      "cookiePrefix": "",
      "useSsrCookies": true,
      "cookieOptions": {
        "maxAge": 28800,
        "sameSite": "lax",
        "secure": true
      },
      "clientOptions": {}
    }
  },
  "botToken": "",
  "managerChatId": "",
  "appUrl": "",
  "sessionSecret": "",
  "yandexMapsApiKey": "",
  "yandexGeocoderApiKey": "",
  "maxApiBaseUrl": "",
  "maxApiToken": "",
  "maxMiniAppBotToken": "",
  "maxWebhookSecret": "",
  "telegramTransport": "direct",
  "telegramRelayUrl": "",
  "relaySharedSecret": "",
  "reviewPromptDelayMinutes": 45,
  "cronReviewPromptsSecret": "",
  "vkIdClientSecret": "",
  "vkIdRedirectUri": "",
  "vkIdBaseUrl": "https://id.vk.com",
  "supabaseUrl": "",
  "supabaseServiceKey": "",
  "supabase": {
    "serviceKey": "",
    "secretKey": ""
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

function createContext(opts = {}) {
  let currentInstance;
  let isSingleton = false;
  const checkConflict = (instance) => {
    if (currentInstance && currentInstance !== instance) {
      throw new Error("Context conflict");
    }
  };
  let als;
  if (opts.asyncContext) {
    const _AsyncLocalStorage = opts.AsyncLocalStorage || globalThis.AsyncLocalStorage;
    if (_AsyncLocalStorage) {
      als = new _AsyncLocalStorage();
    } else {
      console.warn("[unctx] `AsyncLocalStorage` is not provided.");
    }
  }
  const _getCurrentInstance = () => {
    if (als) {
      const instance = als.getStore();
      if (instance !== void 0) {
        return instance;
      }
    }
    return currentInstance;
  };
  return {
    use: () => {
      const _instance = _getCurrentInstance();
      if (_instance === void 0) {
        throw new Error("Context is not available");
      }
      return _instance;
    },
    tryUse: () => {
      return _getCurrentInstance();
    },
    set: (instance, replace) => {
      if (!replace) {
        checkConflict(instance);
      }
      currentInstance = instance;
      isSingleton = true;
    },
    unset: () => {
      currentInstance = void 0;
      isSingleton = false;
    },
    call: (instance, callback) => {
      checkConflict(instance);
      currentInstance = instance;
      try {
        return als ? als.run(instance, callback) : callback();
      } finally {
        if (!isSingleton) {
          currentInstance = void 0;
        }
      }
    },
    async callAsync(instance, callback) {
      currentInstance = instance;
      const onRestore = () => {
        currentInstance = instance;
      };
      const onLeave = () => currentInstance === instance ? onRestore : void 0;
      asyncHandlers.add(onLeave);
      try {
        const r = als ? als.run(instance, callback) : callback();
        if (!isSingleton) {
          currentInstance = void 0;
        }
        return await r;
      } finally {
        asyncHandlers.delete(onLeave);
      }
    }
  };
}
function createNamespace(defaultOpts = {}) {
  const contexts = {};
  return {
    get(key, opts = {}) {
      if (!contexts[key]) {
        contexts[key] = createContext({ ...defaultOpts, ...opts });
      }
      return contexts[key];
    }
  };
}
const _globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : {};
const globalKey = "__unctx__";
const defaultNamespace = _globalThis[globalKey] || (_globalThis[globalKey] = createNamespace());
const getContext = (key, opts = {}) => defaultNamespace.get(key, opts);
const asyncHandlersKey = "__unctx_async_handlers__";
const asyncHandlers = _globalThis[asyncHandlersKey] || (_globalThis[asyncHandlersKey] = /* @__PURE__ */ new Set());
function executeAsync(function_) {
  const restores = [];
  for (const leaveHandler of asyncHandlers) {
    const restore2 = leaveHandler();
    if (restore2) {
      restores.push(restore2);
    }
  }
  const restore = () => {
    for (const restore2 of restores) {
      restore2();
    }
  };
  let awaitable = function_();
  if (awaitable && typeof awaitable === "object" && "catch" in awaitable) {
    awaitable = awaitable.catch((error) => {
      restore();
      throw error;
    });
  }
  return [awaitable, restore];
}

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
  createRouter$1({ routes: config.nitro.routeRules })
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
            throw createError$1({ statusCode: 400 });
          }
          targetPath = withoutBase(targetPath, strpBase);
        } else if (targetPath.startsWith("//")) {
          targetPath = targetPath.replace(/^\/+/, "/");
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery$1(event.path);
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
            throw createError$1({ statusCode: 400 });
          }
          targetPath = withoutBase(targetPath, strpBase);
        } else if (targetPath.startsWith("//")) {
          targetPath = targetPath.replace(/^\/+/, "/");
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery$1(event.path);
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
		const { template } = await import('../_/error-500.mjs');
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
	return send(event, html);
});

function defineNitroErrorHandler(handler) {
  return handler;
}

const errorHandler$1 = defineNitroErrorHandler(
  function defaultNitroErrorHandler(error, event) {
    const res = defaultHandler(error, event);
    setResponseHeaders(event, res.headers);
    setResponseStatus(event, res.status, res.statusText);
    return send(event, JSON.stringify(res.body, null, 2));
  }
);
function defaultHandler(error, event, opts) {
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
  if (isSensitive && !opts?.silent) {
    const tags = [error.unhandled && "[unhandled]", error.fatal && "[fatal]"].filter(Boolean).join(" ");
    console.error(`[request error] ${tags} [${event.method}] ${url}
`, error);
  }
  const headers = {
    "content-type": "application/json",
    // Prevent browser from guessing the MIME types of resources.
    "x-content-type-options": "nosniff",
    // Prevent error page from being embedded in an iframe
    "x-frame-options": "DENY",
    // Prevent browsers from sending the Referer header
    "referrer-policy": "no-referrer",
    // Disable the execution of any js
    "content-security-policy": "script-src 'none'; frame-ancestors 'none';"
  };
  setResponseStatus(event, statusCode, statusMessage);
  if (statusCode === 404 || !getResponseHeader(event, "cache-control")) {
    headers["cache-control"] = "no-cache";
  }
  const body = {
    error: true,
    url: url.href,
    statusCode,
    statusMessage,
    message: isSensitive ? "Server Error" : error.message,
    data: isSensitive ? void 0 : error.data
  };
  return {
    status: statusCode,
    statusText: statusMessage,
    headers,
    body
  };
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

const plugins = [
  
];

const assets = {
  "/.gitkeep": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"0-2jmj7l5rSw0yVb/vlWAYkK/YBwk\"",
    "mtime": "2026-05-25T10:44:19.218Z",
    "size": 0,
    "path": "../public/.gitkeep"
  },
  "/image_112x112.png": {
    "type": "image/png",
    "etag": "\"1c8a-v7jduJIRvfc5OdxCBFDEqtDUXRU\"",
    "mtime": "2026-05-25T10:44:19.218Z",
    "size": 7306,
    "path": "../public/image_112x112.png"
  },
  "/logo.webp": {
    "type": "image/webp",
    "etag": "\"19bc-n7L0UTu098QRMJEbGwrdrtPQZeI\"",
    "mtime": "2026-05-25T10:44:19.218Z",
    "size": 6588,
    "path": "../public/logo.webp"
  },
  "/luna-lounge-logo.png": {
    "type": "image/png",
    "etag": "\"118a-/Qt2c3NVZ5HW97gcCMWm1LC4uuQ\"",
    "mtime": "2026-05-25T10:44:19.218Z",
    "size": 4490,
    "path": "../public/luna-lounge-logo.png"
  },
  "/js/max-web-app.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"7810-mGIegmqTmuK3kk5UfZo3oF00D5g\"",
    "mtime": "2026-05-25T10:44:19.209Z",
    "size": 30736,
    "path": "../public/js/max-web-app.js"
  },
  "/menu/menu_r1_c1.webp": {
    "type": "image/webp",
    "etag": "\"3baa-/l4QRdsXpHaCJZDsnef0uOpi71k\"",
    "mtime": "2026-05-25T10:44:19.210Z",
    "size": 15274,
    "path": "../public/menu/menu_r1_c1.webp"
  },
  "/menu/menu_r1_c2.webp": {
    "type": "image/webp",
    "etag": "\"32de-nKOf5v4ungOu7pbjT4bxkArFfY4\"",
    "mtime": "2026-05-25T10:44:19.209Z",
    "size": 13022,
    "path": "../public/menu/menu_r1_c2.webp"
  },
  "/menu/menu_r1_c3.webp": {
    "type": "image/webp",
    "etag": "\"3762-YaPSfwbNsbfjTOAYF0hRZfv0R9M\"",
    "mtime": "2026-05-25T10:44:19.213Z",
    "size": 14178,
    "path": "../public/menu/menu_r1_c3.webp"
  },
  "/menu/menu_r2_c1.webp": {
    "type": "image/webp",
    "etag": "\"39e0-mr91u4fLoe+lQggqKfh5xCZaJjg\"",
    "mtime": "2026-05-25T10:44:19.210Z",
    "size": 14816,
    "path": "../public/menu/menu_r2_c1.webp"
  },
  "/menu/menu_r2_c2.webp": {
    "type": "image/webp",
    "etag": "\"39f0-C7KppPaykKPGWN6x1r2P2NeTe90\"",
    "mtime": "2026-05-25T10:44:19.212Z",
    "size": 14832,
    "path": "../public/menu/menu_r2_c2.webp"
  },
  "/menu/menu_r2_c3.webp": {
    "type": "image/webp",
    "etag": "\"2fae-1zMibG6v0XCitCuklm+X3h9QMV0\"",
    "mtime": "2026-05-25T10:44:19.213Z",
    "size": 12206,
    "path": "../public/menu/menu_r2_c3.webp"
  },
  "/menu/menu_r3_c1.webp": {
    "type": "image/webp",
    "etag": "\"2e1e-OYz2tYS0umdhvHiD26xOGb1QEH8\"",
    "mtime": "2026-05-25T10:44:19.214Z",
    "size": 11806,
    "path": "../public/menu/menu_r3_c1.webp"
  },
  "/menu/menu_r3_c2.webp": {
    "type": "image/webp",
    "etag": "\"2e8e-UZozjKmQuLKRcSzXLR5k1MNcmEw\"",
    "mtime": "2026-05-25T10:44:19.213Z",
    "size": 11918,
    "path": "../public/menu/menu_r3_c2.webp"
  },
  "/menu/menu_r3_c3.webp": {
    "type": "image/webp",
    "etag": "\"1f6c-L0zlfU//3wxiskoZcafnd6jQUIk\"",
    "mtime": "2026-05-25T10:44:19.214Z",
    "size": 8044,
    "path": "../public/menu/menu_r3_c3.webp"
  },
  "/menu/menu_r4_c1.webp": {
    "type": "image/webp",
    "etag": "\"2ca0-ENZSdGZWax0CaI3JQGjDkP1S9Rg\"",
    "mtime": "2026-05-25T10:44:19.214Z",
    "size": 11424,
    "path": "../public/menu/menu_r4_c1.webp"
  },
  "/menu/menu_r4_c2.webp": {
    "type": "image/webp",
    "etag": "\"1dbc-CkY8R3phk9HCjqIJKyDe010Wn/E\"",
    "mtime": "2026-05-25T10:44:19.214Z",
    "size": 7612,
    "path": "../public/menu/menu_r4_c2.webp"
  },
  "/menu/menu_r4_c3.webp": {
    "type": "image/webp",
    "etag": "\"1f8c-Om6GLUZBaJRW9fSEGaB6/HBdENo\"",
    "mtime": "2026-05-25T10:44:19.214Z",
    "size": 8076,
    "path": "../public/menu/menu_r4_c3.webp"
  },
  "/js/telegram-web-app.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1c675-2D+KMGK3D1EUfBUBiRtFI9s0Z0o\"",
    "mtime": "2026-05-25T10:44:19.213Z",
    "size": 116341,
    "path": "../public/js/telegram-web-app.js"
  },
  "/menu/menu_r5_c1.webp": {
    "type": "image/webp",
    "etag": "\"2f76-hR1sjZspnNVJD0UeGeB6DiWmpZo\"",
    "mtime": "2026-05-25T10:44:19.214Z",
    "size": 12150,
    "path": "../public/menu/menu_r5_c1.webp"
  },
  "/menu/menu_r5_c2.webp": {
    "type": "image/webp",
    "etag": "\"191c-dyHri7hMc/mqUUTql3skkvaWRig\"",
    "mtime": "2026-05-25T10:44:19.214Z",
    "size": 6428,
    "path": "../public/menu/menu_r5_c2.webp"
  },
  "/menu/menu_r5_c3.webp": {
    "type": "image/webp",
    "etag": "\"2120-TA6mbttm8GeEmP4YGDwLJzIEuxw\"",
    "mtime": "2026-05-25T10:44:19.214Z",
    "size": 8480,
    "path": "../public/menu/menu_r5_c3.webp"
  },
  "/pixel-assets/cashback-slide.webp": {
    "type": "image/webp",
    "etag": "\"67da-1Luu6HDCQOdZekwZxfjWg0ba6X4\"",
    "mtime": "2026-05-25T10:44:19.215Z",
    "size": 26586,
    "path": "../public/pixel-assets/cashback-slide.webp"
  },
  "/test-logo.png": {
    "type": "image/png",
    "etag": "\"f5ff6-pP/5FkSjstgED4dkZKPCjeAg6+s\"",
    "mtime": "2026-05-25T10:44:19.220Z",
    "size": 1007606,
    "path": "../public/test-logo.png"
  },
  "/menu.webp": {
    "type": "image/webp",
    "etag": "\"14af32-kMYtvLfvUoSuMuYLdCi7lKEfR/Q\"",
    "mtime": "2026-05-25T10:44:19.222Z",
    "size": 1355570,
    "path": "../public/menu.webp"
  },
  "/pixel-assets/delivery-slide.webp": {
    "type": "image/webp",
    "etag": "\"64a0-EhTIf0jDZnaKD4KX45zwB5N/NZE\"",
    "mtime": "2026-05-25T10:44:19.210Z",
    "size": 25760,
    "path": "../public/pixel-assets/delivery-slide.webp"
  },
  "/pixel-assets/levelup-slide.webp": {
    "type": "image/webp",
    "etag": "\"6ad4-d5+Q2c6s8kMCu0XHUIyEskHPLyI\"",
    "mtime": "2026-05-25T10:44:19.214Z",
    "size": 27348,
    "path": "../public/pixel-assets/levelup-slide.webp"
  },
  "/pixel-assets/logo-pixel-pizza-small.webp": {
    "type": "image/webp",
    "etag": "\"3272-qTWvv+7fnE1aZ1im5xsKwhcnsJ8\"",
    "mtime": "2026-05-25T10:44:19.214Z",
    "size": 12914,
    "path": "../public/pixel-assets/logo-pixel-pizza-small.webp"
  },
  "/pixel-assets/hero-slide.webp": {
    "type": "image/webp",
    "etag": "\"61a8-1CUMSnWRfRNbcICxYUx+0sXjfLM\"",
    "mtime": "2026-05-25T10:44:19.214Z",
    "size": 25000,
    "path": "../public/pixel-assets/hero-slide.webp"
  },
  "/pixel-assets/menu-cheese-sticks.webp": {
    "type": "image/webp",
    "etag": "\"5452-uDfDIRv8zGB327CHy/7Wf5C+Fvs\"",
    "mtime": "2026-05-25T10:44:19.216Z",
    "size": 21586,
    "path": "../public/pixel-assets/menu-cheese-sticks.webp"
  },
  "/pixel-assets/logo-pixel-pizza.webp": {
    "type": "image/webp",
    "etag": "\"15468-Jgd28YBVH7vKezPSjH1gIAzvK4A\"",
    "mtime": "2026-05-25T10:44:19.215Z",
    "size": 87144,
    "path": "../public/pixel-assets/logo-pixel-pizza.webp"
  },
  "/pixel-assets/menu-combo.webp": {
    "type": "image/webp",
    "etag": "\"68ec-0kRFnNhtxJVt+iMUlflrpSNICII\"",
    "mtime": "2026-05-25T10:44:19.215Z",
    "size": 26860,
    "path": "../public/pixel-assets/menu-combo.webp"
  },
  "/pixel-assets/menu-diablo.webp": {
    "type": "image/webp",
    "etag": "\"6a22-MHR5Qcp6kRAW0jisKYcqjDQjPfE\"",
    "mtime": "2026-05-25T10:44:19.215Z",
    "size": 27170,
    "path": "../public/pixel-assets/menu-diablo.webp"
  },
  "/pixel-assets/menu-four-cheese.webp": {
    "type": "image/webp",
    "etag": "\"6298-owPtX+E5M8ul4+nXkCaMjRSROj0\"",
    "mtime": "2026-05-25T10:44:19.215Z",
    "size": 25240,
    "path": "../public/pixel-assets/menu-four-cheese.webp"
  },
  "/pixel-assets/menu-hawaiian.webp": {
    "type": "image/webp",
    "etag": "\"5f9e-ZHDBOY7OioIA2fHdP2c8pWyqKQY\"",
    "mtime": "2026-05-25T10:44:19.215Z",
    "size": 24478,
    "path": "../public/pixel-assets/menu-hawaiian.webp"
  },
  "/pixel-assets/menu-margherita.webp": {
    "type": "image/webp",
    "etag": "\"6232-s4HG3uw9L+PFk/vPDTPHXvD3hMQ\"",
    "mtime": "2026-05-25T10:44:19.215Z",
    "size": 25138,
    "path": "../public/pixel-assets/menu-margherita.webp"
  },
  "/pixel-assets/menu-meat-bbq.webp": {
    "type": "image/webp",
    "etag": "\"6cbe-9Ub36TEVg4D5DTnv0ZogW0Zl61A\"",
    "mtime": "2026-05-25T10:44:19.215Z",
    "size": 27838,
    "path": "../public/pixel-assets/menu-meat-bbq.webp"
  },
  "/pixel-assets/menu-nuggets.webp": {
    "type": "image/webp",
    "etag": "\"518a-BkPsl5J/fHmvTDuDaXFQqjrHKOA\"",
    "mtime": "2026-05-25T10:44:19.215Z",
    "size": 20874,
    "path": "../public/pixel-assets/menu-nuggets.webp"
  },
  "/pixel-assets/menu-pepperoni.webp": {
    "type": "image/webp",
    "etag": "\"6710-uaLSbCWl6Q4EJX6IY2DBGvDOc5Y\"",
    "mtime": "2026-05-25T10:44:19.216Z",
    "size": 26384,
    "path": "../public/pixel-assets/menu-pepperoni.webp"
  },
  "/pixel-assets/menu-slide.webp": {
    "type": "image/webp",
    "etag": "\"60a4-paOi9XyYX6DEs0KdZcT+GykTmRo\"",
    "mtime": "2026-05-25T10:44:19.216Z",
    "size": 24740,
    "path": "../public/pixel-assets/menu-slide.webp"
  },
  "/pixel-assets/menu-wings.webp": {
    "type": "image/webp",
    "etag": "\"5886-LYRAXcUcE63UKQjriAxl2qW8v/Y\"",
    "mtime": "2026-05-25T10:44:19.217Z",
    "size": 22662,
    "path": "../public/pixel-assets/menu-wings.webp"
  },
  "/pixel-assets/multiplayer-slide.webp": {
    "type": "image/webp",
    "etag": "\"6a30-74NUB9s7z0JlgMM8+zvgGs4/Lmg\"",
    "mtime": "2026-05-25T10:44:19.216Z",
    "size": 27184,
    "path": "../public/pixel-assets/multiplayer-slide.webp"
  },
  "/pixel-assets/preview-cashback.webp": {
    "type": "image/webp",
    "etag": "\"33b8-AB1qmNhaua0oOC1GBkXmKqyw2HU\"",
    "mtime": "2026-05-25T10:44:19.216Z",
    "size": 13240,
    "path": "../public/pixel-assets/preview-cashback.webp"
  },
  "/pixel-assets/preview-delivery.webp": {
    "type": "image/webp",
    "etag": "\"481c-TlmP3LixoY1KCsowRHz3sh/Jj4w\"",
    "mtime": "2026-05-25T10:44:19.216Z",
    "size": 18460,
    "path": "../public/pixel-assets/preview-delivery.webp"
  },
  "/pixel-assets/preview-levelup.webp": {
    "type": "image/webp",
    "etag": "\"33ca-xWfjRrPu4I8PyC9wpjZXegwJYfM\"",
    "mtime": "2026-05-25T10:44:19.216Z",
    "size": 13258,
    "path": "../public/pixel-assets/preview-levelup.webp"
  },
  "/pixel-assets/preview-menu.webp": {
    "type": "image/webp",
    "etag": "\"4268-mg8TTUpFvSs/gN2B8qRge//XlwA\"",
    "mtime": "2026-05-25T10:44:19.216Z",
    "size": 17000,
    "path": "../public/pixel-assets/preview-menu.webp"
  },
  "/pixel-assets/preview-multiplayer.webp": {
    "type": "image/webp",
    "etag": "\"33f2-opLOyGsg0DhL25IOiLxmqPc2KT4\"",
    "mtime": "2026-05-25T10:44:19.217Z",
    "size": 13298,
    "path": "../public/pixel-assets/preview-multiplayer.webp"
  },
  "/pixel-assets/preview-reviews.webp": {
    "type": "image/webp",
    "etag": "\"20d0-ALG/mUQo5hbbffvrEKUWRFkYaGY\"",
    "mtime": "2026-05-25T10:44:19.217Z",
    "size": 8400,
    "path": "../public/pixel-assets/preview-reviews.webp"
  },
  "/pixel-assets/preview-select-hero.webp": {
    "type": "image/webp",
    "etag": "\"3822-tMGdvvx55rSWRs5PkPJJOodNECs\"",
    "mtime": "2026-05-25T10:44:19.217Z",
    "size": 14370,
    "path": "../public/pixel-assets/preview-select-hero.webp"
  },
  "/pixel-assets/preview-start-game.webp": {
    "type": "image/webp",
    "etag": "\"491c-L7itkaVUr0Cngy9QxEBGGb0gWm0\"",
    "mtime": "2026-05-25T10:44:19.217Z",
    "size": 18716,
    "path": "../public/pixel-assets/preview-start-game.webp"
  },
  "/pixel-assets/preview-telegram.webp": {
    "type": "image/webp",
    "etag": "\"30bc-3FF1239J+GAHCSgIzvl32ys+3co\"",
    "mtime": "2026-05-25T10:44:19.217Z",
    "size": 12476,
    "path": "../public/pixel-assets/preview-telegram.webp"
  },
  "/pixel-assets/reviews-slide.webp": {
    "type": "image/webp",
    "etag": "\"625a-q44MWp9J3lFsLyk1F5d4GWyAMDo\"",
    "mtime": "2026-05-25T10:44:19.217Z",
    "size": 25178,
    "path": "../public/pixel-assets/reviews-slide.webp"
  },
  "/pixel-assets/start-game-slide.webp": {
    "type": "image/webp",
    "etag": "\"6ac4-5rfq3K+pPpAeSkbk0uT/DTNiNRc\"",
    "mtime": "2026-05-25T10:44:19.217Z",
    "size": 27332,
    "path": "../public/pixel-assets/start-game-slide.webp"
  },
  "/pixel-assets/telegram-slide.webp": {
    "type": "image/webp",
    "etag": "\"5a7a-ohrVUZ0kWwAGYPDkOPOY47ab73E\"",
    "mtime": "2026-05-25T10:44:19.217Z",
    "size": 23162,
    "path": "../public/pixel-assets/telegram-slide.webp"
  },
  "/_nuxt/0ZdNfdmC.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1e6-UdVmaoFTiOjMyzXbHn2ZKgh8bUo\"",
    "mtime": "2026-05-25T10:44:19.201Z",
    "size": 486,
    "path": "../public/_nuxt/0ZdNfdmC.js"
  },
  "/_nuxt/2b8AcYZ7.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"eaa-pNI4jpldkmmJdkDr1ijDnNjx8Rs\"",
    "mtime": "2026-05-25T10:44:19.201Z",
    "size": 3754,
    "path": "../public/_nuxt/2b8AcYZ7.js"
  },
  "/_nuxt/3Jr1XEi8.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"5de-+d03vxE3htBtb0FCZSyOwth5vaM\"",
    "mtime": "2026-05-25T10:44:19.201Z",
    "size": 1502,
    "path": "../public/_nuxt/3Jr1XEi8.js"
  },
  "/_nuxt/9WwASofS.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"23b7-1ES0JqjjzkD8EWdMBffWdL9lIwE\"",
    "mtime": "2026-05-25T10:44:19.201Z",
    "size": 9143,
    "path": "../public/_nuxt/9WwASofS.js"
  },
  "/_nuxt/9kgHOMYk.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"156c-h9YwELQHO634DvQCeKTnVQ2exOs\"",
    "mtime": "2026-05-25T10:44:19.201Z",
    "size": 5484,
    "path": "../public/_nuxt/9kgHOMYk.js"
  },
  "/_nuxt/AJPaulca.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"f43-32yOqsWJFZzZZrin/lits6Q6oWY\"",
    "mtime": "2026-05-25T10:44:19.201Z",
    "size": 3907,
    "path": "../public/_nuxt/AJPaulca.js"
  },
  "/_nuxt/B4TiFKui.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"84a-JiGUHjFYMuBxtZYMp80CLhEwRSc\"",
    "mtime": "2026-05-25T10:44:19.201Z",
    "size": 2122,
    "path": "../public/_nuxt/B4TiFKui.js"
  },
  "/_nuxt/B5G8uhqx.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"5510-CKQ+ViOOQOUkYC/3SJ/q+lJpwGs\"",
    "mtime": "2026-05-25T10:44:19.201Z",
    "size": 21776,
    "path": "../public/_nuxt/B5G8uhqx.js"
  },
  "/_nuxt/B6shn7ZK.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"14a-p8UC4w+lB+Qa+KslVpHjg+I7D24\"",
    "mtime": "2026-05-25T10:44:19.201Z",
    "size": 330,
    "path": "../public/_nuxt/B6shn7ZK.js"
  },
  "/_nuxt/B8C02rP7.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"456-iC44qo4bOKyMaXtdMSr/ypo/5uE\"",
    "mtime": "2026-05-25T10:44:19.201Z",
    "size": 1110,
    "path": "../public/_nuxt/B8C02rP7.js"
  },
  "/_nuxt/B8Yzu9wA.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"fe-BWDPQuyXinLF68IkwnFKYSxTwnI\"",
    "mtime": "2026-05-25T10:44:19.201Z",
    "size": 254,
    "path": "../public/_nuxt/B8Yzu9wA.js"
  },
  "/_nuxt/BCF3wonQ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"172a-X8pVVdTfMTrGYMJXWSTdX7mO14s\"",
    "mtime": "2026-05-25T10:44:19.201Z",
    "size": 5930,
    "path": "../public/_nuxt/BCF3wonQ.js"
  },
  "/_nuxt/BRIrDGyD.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1c16-6lE6PloGVN0RuNCH3IIrmqI7zO8\"",
    "mtime": "2026-05-25T10:44:19.202Z",
    "size": 7190,
    "path": "../public/_nuxt/BRIrDGyD.js"
  },
  "/_nuxt/BS08JSs0.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"d00-oTFsB6sIeBD1ZM/G/23sSWjrP+E\"",
    "mtime": "2026-05-25T10:44:19.202Z",
    "size": 3328,
    "path": "../public/_nuxt/BS08JSs0.js"
  },
  "/_nuxt/BG8MyhE7.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"69d-1vQ7jEqPgaCCwL2NcyZ0YqI7i4w\"",
    "mtime": "2026-05-25T10:44:19.202Z",
    "size": 1693,
    "path": "../public/_nuxt/BG8MyhE7.js"
  },
  "/_nuxt/BS8--Lt2.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"a6-Q7H0PZI5vvV0X9cmBJh14SPlYHA\"",
    "mtime": "2026-05-25T10:44:19.202Z",
    "size": 166,
    "path": "../public/_nuxt/BS8--Lt2.js"
  },
  "/_nuxt/BZcISPln.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"8ae-Pl3rGELpU6bVbcZdDuUwWrbRtks\"",
    "mtime": "2026-05-25T10:44:19.202Z",
    "size": 2222,
    "path": "../public/_nuxt/BZcISPln.js"
  },
  "/_nuxt/BbM3pWlW.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"b07-Uk/ORcNuR+mY9IXifOuxkQjObvQ\"",
    "mtime": "2026-05-25T10:44:19.202Z",
    "size": 2823,
    "path": "../public/_nuxt/BbM3pWlW.js"
  },
  "/_nuxt/BeIGMCco.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"36af-RFRWXcr3aFwczSc7qSJc3HQHRJE\"",
    "mtime": "2026-05-25T10:44:19.202Z",
    "size": 13999,
    "path": "../public/_nuxt/BeIGMCco.js"
  },
  "/_nuxt/BwV0SyZj.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"18c-Aw+9FWfTMhOcWcIlARONoDMJ6s8\"",
    "mtime": "2026-05-25T10:44:19.202Z",
    "size": 396,
    "path": "../public/_nuxt/BwV0SyZj.js"
  },
  "/_nuxt/Bx_HRWFh.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"387-OBkz9ims3IvxsEIjsMrwZSZB2KQ\"",
    "mtime": "2026-05-25T10:44:19.202Z",
    "size": 903,
    "path": "../public/_nuxt/Bx_HRWFh.js"
  },
  "/_nuxt/BiW59EQu.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"56e-3Tq616XS6S0V/JTycIPSZhdgU1Y\"",
    "mtime": "2026-05-25T10:44:19.202Z",
    "size": 1390,
    "path": "../public/_nuxt/BiW59EQu.js"
  },
  "/_nuxt/C6qti0YP.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"979-Uj3/8m9Lh2h1JDpVTr5YRq6e9SM\"",
    "mtime": "2026-05-25T10:44:19.202Z",
    "size": 2425,
    "path": "../public/_nuxt/C6qti0YP.js"
  },
  "/_nuxt/CFlahxAE.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"b20-MD4ik11i5Q9TmGT/1+1mNqpbZx8\"",
    "mtime": "2026-05-25T10:44:19.202Z",
    "size": 2848,
    "path": "../public/_nuxt/CFlahxAE.js"
  },
  "/_nuxt/CFn4tjBt.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"345-5zqHH7Rwvp/5Lk0eAC8SfGmdLqA\"",
    "mtime": "2026-05-25T10:44:19.202Z",
    "size": 837,
    "path": "../public/_nuxt/CFn4tjBt.js"
  },
  "/_nuxt/CKOZ78Ap.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"c84-T2H3x+qX1fC1Kctacj9Da1JqpbY\"",
    "mtime": "2026-05-25T10:44:19.202Z",
    "size": 3204,
    "path": "../public/_nuxt/CKOZ78Ap.js"
  },
  "/_nuxt/CGs2bc5K.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"78d-qS0TsQCfjKD1t7kkbv1kPlSyZDk\"",
    "mtime": "2026-05-25T10:44:19.202Z",
    "size": 1933,
    "path": "../public/_nuxt/CGs2bc5K.js"
  },
  "/_nuxt/CKtwGLEd.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"d4a-tZKvqvY5BnT7jN8xFy0s+ei1mTA\"",
    "mtime": "2026-05-25T10:44:19.202Z",
    "size": 3402,
    "path": "../public/_nuxt/CKtwGLEd.js"
  },
  "/_nuxt/CIkUFlkN.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"a81-QYftkPzppqfLYm+eiw6U9dlvmMo\"",
    "mtime": "2026-05-25T10:44:19.202Z",
    "size": 2689,
    "path": "../public/_nuxt/CIkUFlkN.js"
  },
  "/_nuxt/CL_vLD4y.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"935-+c701ri2YVi9482v9+C+Zf136TY\"",
    "mtime": "2026-05-25T10:44:19.202Z",
    "size": 2357,
    "path": "../public/_nuxt/CL_vLD4y.js"
  },
  "/_nuxt/CSoX3ZGJ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"387f-MrwZ+ZIEtUZrbnQ6LnA1vlizjRU\"",
    "mtime": "2026-05-25T10:44:19.202Z",
    "size": 14463,
    "path": "../public/_nuxt/CSoX3ZGJ.js"
  },
  "/_nuxt/CWyFbVVa.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"14f-EWFV7MCwwb0y7LjNJkYm5GSeOeM\"",
    "mtime": "2026-05-25T10:44:19.202Z",
    "size": 335,
    "path": "../public/_nuxt/CWyFbVVa.js"
  },
  "/_nuxt/C_Hgfv1s.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"495e-F90j9p95MhU2hg6efs2vjpNMuAM\"",
    "mtime": "2026-05-25T10:44:19.202Z",
    "size": 18782,
    "path": "../public/_nuxt/C_Hgfv1s.js"
  },
  "/_nuxt/CVOwFEYl.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4e-dVjF+qA9EcM632IfVW94nnRGBMY\"",
    "mtime": "2026-05-25T10:44:19.202Z",
    "size": 78,
    "path": "../public/_nuxt/CVOwFEYl.js"
  },
  "/_nuxt/Ca1fmp2L.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"135-RC7Qvx4oIOBU4UwuXP/h1+FAde8\"",
    "mtime": "2026-05-25T10:44:19.202Z",
    "size": 309,
    "path": "../public/_nuxt/Ca1fmp2L.js"
  },
  "/_nuxt/CcWUX8Zm.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"18b-Adcxdc5XXGEPBp6m/LClJFG6VSY\"",
    "mtime": "2026-05-25T10:44:19.202Z",
    "size": 395,
    "path": "../public/_nuxt/CcWUX8Zm.js"
  },
  "/_nuxt/CixaP9YW.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"b072-7UuwKYwh5SWdnT5k/y1POHSCQx4\"",
    "mtime": "2026-05-25T10:44:19.203Z",
    "size": 45170,
    "path": "../public/_nuxt/CixaP9YW.js"
  },
  "/_nuxt/CopmqjD1.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"e9d-ggMCPQSwue2sfGaADi3DR0+Hs+U\"",
    "mtime": "2026-05-25T10:44:19.203Z",
    "size": 3741,
    "path": "../public/_nuxt/CopmqjD1.js"
  },
  "/_nuxt/CfH31exI.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"c60-uL1Ujer2gdzSk+dAieP5N/5/dww\"",
    "mtime": "2026-05-25T10:44:19.203Z",
    "size": 3168,
    "path": "../public/_nuxt/CfH31exI.js"
  },
  "/_nuxt/CpGpYOF3.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"578a-a5gu7mGHRVKKuV2B7dz5AGyqgIs\"",
    "mtime": "2026-05-25T10:44:19.203Z",
    "size": 22410,
    "path": "../public/_nuxt/CpGpYOF3.js"
  },
  "/_nuxt/CqDbEFy1.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"64ec-KYpEt1UVC30c+Gc9tJ/Zm1GOaQo\"",
    "mtime": "2026-05-25T10:44:19.203Z",
    "size": 25836,
    "path": "../public/_nuxt/CqDbEFy1.js"
  },
  "/_nuxt/Crb_TxiL.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"eef-Q/c8YOWq+vqU+bDNsdkwb37m1ug\"",
    "mtime": "2026-05-25T10:44:19.203Z",
    "size": 3823,
    "path": "../public/_nuxt/Crb_TxiL.js"
  },
  "/_nuxt/CrrVLZlJ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"79a-ekAJI5rNHaFeVveS6yRTnAxqlf4\"",
    "mtime": "2026-05-25T10:44:19.203Z",
    "size": 1946,
    "path": "../public/_nuxt/CrrVLZlJ.js"
  },
  "/_nuxt/CtAUN0Kw.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"643b-TuC1prLyy3aBd5c4B1a+oT+Pvv4\"",
    "mtime": "2026-05-25T10:44:19.203Z",
    "size": 25659,
    "path": "../public/_nuxt/CtAUN0Kw.js"
  },
  "/_nuxt/CvQ5b0Qp.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"fa1-7beGylW7uZMJXN/FIEWkypDvLDk\"",
    "mtime": "2026-05-25T10:44:19.203Z",
    "size": 4001,
    "path": "../public/_nuxt/CvQ5b0Qp.js"
  },
  "/_nuxt/Cza_BPAm.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2963-ZY4zSQ0J5zt1vU323HeAw8p+52Q\"",
    "mtime": "2026-05-25T10:44:19.203Z",
    "size": 10595,
    "path": "../public/_nuxt/Cza_BPAm.js"
  },
  "/_nuxt/CzgrP9OU.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"c3-DD45RaHmw9aLPFW6+7K8bDKgRq0\"",
    "mtime": "2026-05-25T10:44:19.203Z",
    "size": 195,
    "path": "../public/_nuxt/CzgrP9OU.js"
  },
  "/_nuxt/D0-ZwT7Q.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"671-nwUqMhM1CfDL6JmyUMjGixhe8Vo\"",
    "mtime": "2026-05-25T10:44:19.203Z",
    "size": 1649,
    "path": "../public/_nuxt/D0-ZwT7Q.js"
  },
  "/_nuxt/D86eLDiy.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"474-pMcnNXZYjyjkElq1ilMnDGmufVI\"",
    "mtime": "2026-05-25T10:44:19.203Z",
    "size": 1140,
    "path": "../public/_nuxt/D86eLDiy.js"
  },
  "/_nuxt/DDQzbox8.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"d40-9IVAsYuMnCaectq4Cv0anrFmWys\"",
    "mtime": "2026-05-25T10:44:19.203Z",
    "size": 3392,
    "path": "../public/_nuxt/DDQzbox8.js"
  },
  "/_nuxt/DIY-Y1zy.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"e04-/qqRTSFqR6wd9A5NIWOifwufNtM\"",
    "mtime": "2026-05-25T10:44:19.203Z",
    "size": 3588,
    "path": "../public/_nuxt/DIY-Y1zy.js"
  },
  "/_nuxt/Cshmre4w.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"68b96-cEBa5HSmGuNn5V/ibl3hPYgeTbw\"",
    "mtime": "2026-05-25T10:44:19.203Z",
    "size": 428950,
    "path": "../public/_nuxt/Cshmre4w.js"
  },
  "/_nuxt/DLYmF-ab.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2f3-PzYKXBXCJuRaH788OpKxTuptczc\"",
    "mtime": "2026-05-25T10:44:19.203Z",
    "size": 755,
    "path": "../public/_nuxt/DLYmF-ab.js"
  },
  "/_nuxt/DNrxpd-B.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1386-Y+0tvojHpYQB90IayhUt30B7cBg\"",
    "mtime": "2026-05-25T10:44:19.204Z",
    "size": 4998,
    "path": "../public/_nuxt/DNrxpd-B.js"
  },
  "/_nuxt/DRGv0omr.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"a6-eBR7j4XykBCbTCWHpzw1IXYCAuA\"",
    "mtime": "2026-05-25T10:44:19.204Z",
    "size": 166,
    "path": "../public/_nuxt/DRGv0omr.js"
  },
  "/_nuxt/DSdW0i4y.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1318-hrDliZ1UKFswGdmgzejDPVs3ExU\"",
    "mtime": "2026-05-25T10:44:19.204Z",
    "size": 4888,
    "path": "../public/_nuxt/DSdW0i4y.js"
  },
  "/_nuxt/DebLFpQo.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"177-9+o+eUGZZTxIzU7xuNlHkE4MAL4\"",
    "mtime": "2026-05-25T10:44:19.204Z",
    "size": 375,
    "path": "../public/_nuxt/DebLFpQo.js"
  },
  "/_nuxt/Df473p7K.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"44a-LJj7Tph8/BG2kOAY1MlnywEeLLA\"",
    "mtime": "2026-05-25T10:44:19.204Z",
    "size": 1098,
    "path": "../public/_nuxt/Df473p7K.js"
  },
  "/_nuxt/DiDyrXAC.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"e8-45ptKBTIBWnkJcrbJ+ybGvUfK6I\"",
    "mtime": "2026-05-25T10:44:19.204Z",
    "size": 232,
    "path": "../public/_nuxt/DiDyrXAC.js"
  },
  "/_nuxt/DvEbpXIT.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2b3-fYlre4kLHsbdbDF2Mcw2e6B/2SY\"",
    "mtime": "2026-05-25T10:44:19.204Z",
    "size": 691,
    "path": "../public/_nuxt/DvEbpXIT.js"
  },
  "/_nuxt/GJwx8V8A.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"105e-io5HyQ1xJWm/GhxnuhDCqvgQJ6Y\"",
    "mtime": "2026-05-25T10:44:19.204Z",
    "size": 4190,
    "path": "../public/_nuxt/GJwx8V8A.js"
  },
  "/_nuxt/DxfMXyYV.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"f61-4LSyBnit6+BYx/cX78hRZ2cvg6U\"",
    "mtime": "2026-05-25T10:44:19.204Z",
    "size": 3937,
    "path": "../public/_nuxt/DxfMXyYV.js"
  },
  "/_nuxt/Ge7GMN09.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"575a-VxZ1ZDTX8MddvlsLGIWN8bjesU0\"",
    "mtime": "2026-05-25T10:44:19.204Z",
    "size": 22362,
    "path": "../public/_nuxt/Ge7GMN09.js"
  },
  "/_nuxt/I-TdkZfb.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"b19-ALgmq1IFUoI3VZByEHm2cI1Yq3Y\"",
    "mtime": "2026-05-25T10:44:19.204Z",
    "size": 2841,
    "path": "../public/_nuxt/I-TdkZfb.js"
  },
  "/_nuxt/IpPmCKiD.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1180-MQ58J5Dw+OTrDZDuePPj4J0BD54\"",
    "mtime": "2026-05-25T10:44:19.204Z",
    "size": 4480,
    "path": "../public/_nuxt/IpPmCKiD.js"
  },
  "/_nuxt/QdtZnGZo.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"47d-UL2CH9ANABHRQCPInFCUFx3+y5M\"",
    "mtime": "2026-05-25T10:44:19.204Z",
    "size": 1149,
    "path": "../public/_nuxt/QdtZnGZo.js"
  },
  "/_nuxt/ehLDCe3h.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"73f-TJO5VEeGQCjUi8LtoU9S7/UR0s4\"",
    "mtime": "2026-05-25T10:44:19.204Z",
    "size": 1855,
    "path": "../public/_nuxt/ehLDCe3h.js"
  },
  "/_nuxt/entry.CQUjydtz.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"360-H+NYxTwmkCOsWqTGdxgA7CR+/3U\"",
    "mtime": "2026-05-25T10:44:19.204Z",
    "size": 864,
    "path": "../public/_nuxt/entry.CQUjydtz.css"
  },
  "/_nuxt/error-404.DL_4WIao.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"dca-KnjyV0UbpsrliiJzZx69defY74k\"",
    "mtime": "2026-05-25T10:44:19.204Z",
    "size": 3530,
    "path": "../public/_nuxt/error-404.DL_4WIao.css"
  },
  "/_nuxt/error-500.I1Dtv2V5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"75a-vEGyJqldBVJrnMfcLsrGaHcxYl0\"",
    "mtime": "2026-05-25T10:44:19.204Z",
    "size": 1882,
    "path": "../public/_nuxt/error-500.I1Dtv2V5.css"
  },
  "/_nuxt/link-max.Dmjq6CS_.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"48b-AqeciXYYoIOzZb5X8HCALSPF0mE\"",
    "mtime": "2026-05-25T10:44:19.204Z",
    "size": 1163,
    "path": "../public/_nuxt/link-max.Dmjq6CS_.css"
  },
  "/_nuxt/link-telegram.C0gU0IC4.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"25a-l93yZIHl4KFC0BSLjGQ6LJD7n0Y\"",
    "mtime": "2026-05-25T10:44:19.204Z",
    "size": 602,
    "path": "../public/_nuxt/link-telegram.C0gU0IC4.css"
  },
  "/_nuxt/link-vk.Bqcp57sb.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"213-yxjjvgs3iLSL9M3u0yTcFWpwkAI\"",
    "mtime": "2026-05-25T10:44:19.204Z",
    "size": 531,
    "path": "../public/_nuxt/link-vk.Bqcp57sb.css"
  },
  "/_nuxt/login.noxhYo85.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"428-n2t9z3XOv7PlMRyfJ8SlLIPqBW8\"",
    "mtime": "2026-05-25T10:44:19.204Z",
    "size": 1064,
    "path": "../public/_nuxt/login.noxhYo85.css"
  },
  "/_nuxt/profile.BfrJ9_Id.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"5b1-neFEzI5I66XVlXA1pY/DYLUIkbE\"",
    "mtime": "2026-05-25T10:44:19.204Z",
    "size": 1457,
    "path": "../public/_nuxt/profile.BfrJ9_Id.css"
  },
  "/_nuxt/login.psimfxYy.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"429-dJ2xlZASEE4CLOmnyowO3ttpQsM\"",
    "mtime": "2026-05-25T10:44:19.204Z",
    "size": 1065,
    "path": "../public/_nuxt/login.psimfxYy.css"
  },
  "/_nuxt/rLFBl4zk.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"946-LC5PT38IOFwPH1/0hE5Qpj4QhmY\"",
    "mtime": "2026-05-25T10:44:19.204Z",
    "size": 2374,
    "path": "../public/_nuxt/rLFBl4zk.js"
  },
  "/_nuxt/register.BE9q0uxC.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"534-wpx2exaeZFhveQV9aDXYHvwv+eI\"",
    "mtime": "2026-05-25T10:44:19.204Z",
    "size": 1332,
    "path": "../public/_nuxt/register.BE9q0uxC.css"
  },
  "/_nuxt/builds/meta/dev.json": {
    "type": "application/json",
    "etag": "\"37-c8aak+pFkA0NZn7pLhBDG/0oFWI\"",
    "mtime": "2026-05-25T10:44:19.191Z",
    "size": 55,
    "path": "../public/_nuxt/builds/meta/dev.json"
  },
  "/_nuxt/builds/meta/db346e87-12ee-4e0f-9f7c-4dd8bc61d859.json": {
    "type": "application/json",
    "etag": "\"58-e8TU/ZDTdjuP1p1szn1tPgWHiqM\"",
    "mtime": "2026-05-25T10:44:19.191Z",
    "size": 88,
    "path": "../public/_nuxt/builds/meta/db346e87-12ee-4e0f-9f7c-4dd8bc61d859.json"
  },
  "/_nuxt/builds/latest.json": {
    "type": "application/json",
    "etag": "\"47-C1AW3IX3U3iKtbNn4fx3g7y4Lj8\"",
    "mtime": "2026-05-25T10:44:19.193Z",
    "size": 71,
    "path": "../public/_nuxt/builds/latest.json"
  },
  "/menu.png": {
    "type": "image/png",
    "etag": "\"9f7d0e-jFu5Cq1vhwlCxl0RYV9fhRXyAYw\"",
    "mtime": "2026-05-25T10:44:19.228Z",
    "size": 10452238,
    "path": "../public/menu.png"
  }
};

const _DRIVE_LETTER_START_RE = /^[A-Za-z]:\//;
function normalizeWindowsPath(input = "") {
  if (!input) {
    return input;
  }
  return input.replace(/\\/g, "/").replace(_DRIVE_LETTER_START_RE, (r) => r.toUpperCase());
}
const _IS_ABSOLUTE_RE = /^[/\\](?![/\\])|^[/\\]{2}(?!\.)|^[A-Za-z]:[/\\]/;
const _DRIVE_LETTER_RE = /^[A-Za-z]:$/;
function cwd() {
  if (typeof process !== "undefined" && typeof process.cwd === "function") {
    return process.cwd().replace(/\\/g, "/");
  }
  return "/";
}
const resolve = function(...arguments_) {
  arguments_ = arguments_.map((argument) => normalizeWindowsPath(argument));
  let resolvedPath = "";
  let resolvedAbsolute = false;
  for (let index = arguments_.length - 1; index >= -1 && !resolvedAbsolute; index--) {
    const path = index >= 0 ? arguments_[index] : cwd();
    if (!path || path.length === 0) {
      continue;
    }
    resolvedPath = `${path}/${resolvedPath}`;
    resolvedAbsolute = isAbsolute(path);
  }
  resolvedPath = normalizeString(resolvedPath, !resolvedAbsolute);
  if (resolvedAbsolute && !isAbsolute(resolvedPath)) {
    return `/${resolvedPath}`;
  }
  return resolvedPath.length > 0 ? resolvedPath : ".";
};
function normalizeString(path, allowAboveRoot) {
  let res = "";
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let char = null;
  for (let index = 0; index <= path.length; ++index) {
    if (index < path.length) {
      char = path[index];
    } else if (char === "/") {
      break;
    } else {
      char = "/";
    }
    if (char === "/") {
      if (lastSlash === index - 1 || dots === 1) ; else if (dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res[res.length - 1] !== "." || res[res.length - 2] !== ".") {
          if (res.length > 2) {
            const lastSlashIndex = res.lastIndexOf("/");
            if (lastSlashIndex === -1) {
              res = "";
              lastSegmentLength = 0;
            } else {
              res = res.slice(0, lastSlashIndex);
              lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
            }
            lastSlash = index;
            dots = 0;
            continue;
          } else if (res.length > 0) {
            res = "";
            lastSegmentLength = 0;
            lastSlash = index;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          res += res.length > 0 ? "/.." : "..";
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0) {
          res += `/${path.slice(lastSlash + 1, index)}`;
        } else {
          res = path.slice(lastSlash + 1, index);
        }
        lastSegmentLength = index - lastSlash - 1;
      }
      lastSlash = index;
      dots = 0;
    } else if (char === "." && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}
const isAbsolute = function(p) {
  return _IS_ABSOLUTE_RE.test(p);
};
const dirname = function(p) {
  const segments = normalizeWindowsPath(p).replace(/\/$/, "").split("/").slice(0, -1);
  if (segments.length === 1 && _DRIVE_LETTER_RE.test(segments[0])) {
    segments[0] += "/";
  }
  return segments.join("/") || (isAbsolute(p) ? "/" : ".");
};

function readAsset (id) {
  const serverDir = dirname(fileURLToPath(globalThis._importMeta_.url));
  return promises.readFile(resolve(serverDir, assets[id].path))
}

const publicAssetBases = {"/_nuxt/builds/meta/":{"maxAge":31536000},"/_nuxt/builds/":{"maxAge":1},"/_nuxt/":{"maxAge":31536000}};

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
      throw createError$1({ statusCode: 404 });
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

function baseURL() {
	
	return useRuntimeConfig().app.baseURL;
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

async function findAuthUserIdByEmail$1(serviceClient, email) {
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
  let userId = await findAuthUserIdByEmail$1(serviceClient, syntheticEmail);
  if (!userId) {
    const { data: createdUser, error: createUserError } = await serviceClient.auth.admin.createUser({
      email: syntheticEmail,
      password: syntheticPassword,
      email_confirm: true,
      user_metadata: { max_user_id: id }
    });
    if (createUserError || !((_a = createdUser == null ? void 0 : createdUser.user) == null ? void 0 : _a.id)) {
      const again = await findAuthUserIdByEmail$1(serviceClient, syntheticEmail);
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
  let userId = await findAuthUserIdByEmail(serviceClient, syntheticEmail);
  if (!userId) {
    const { data: createdUser, error: createUserError } = await serviceClient.auth.admin.createUser({
      email: syntheticEmail,
      password: syntheticPassword,
      email_confirm: true,
      user_metadata: { telegram_id: telegramId }
    });
    if (createUserError || !((_a = createdUser == null ? void 0 : createdUser.user) == null ? void 0 : _a.id)) {
      const again = await findAuthUserIdByEmail(serviceClient, syntheticEmail);
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
  throw createError$1({ statusCode: 401, message: "Profile not found" });
}
async function resolveMaxProfileId(event, maxUser) {
  const client = await serverSupabaseServiceRole(event);
  const maxId = String(maxUser.id);
  const { data: profile } = await client.from("profiles").select("id").eq("max_user_id", maxId).maybeSingle();
  if (profile == null ? void 0 : profile.id) return String(profile.id);
  const ensured = await ensureMaxCustomerProfile(event, maxId);
  if (ensured) return ensured;
  throw createError$1({ statusCode: 401, message: "Profile not found" });
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
    throw createError$1({ statusCode: 401, message: "Invalid initData" });
  }
  const supabaseUser = await serverSupabaseUser(event);
  if (supabaseUser) {
    const rawUser = supabaseUser;
    const userId = typeof rawUser.id === "string" ? rawUser.id : typeof rawUser.sub === "string" ? rawUser.sub : null;
    if (userId) return userId;
  }
  throw createError$1({ statusCode: 401, message: "Unauthorized" });
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
    throw createError$1({ statusCode: 401, statusMessage: "Unauthorized" });
  }
  const raw = supabaseUser;
  const userId = typeof raw.id === "string" ? raw.id : typeof raw.sub === "string" ? raw.sub : null;
  if (!userId) {
    throw createError$1({ statusCode: 401, statusMessage: "Unauthorized" });
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
    throw createError$1({ statusCode: 500, statusMessage: "Failed to read profile" });
  }
  if (profileData == null ? void 0 : profileData.shop_id) {
    shopId = profileData.shop_id;
    role = normalizeRole(profileData.role);
  }
  if (!shopId) {
    const fallback = await client.from("profiles").select("shop_id").eq("id", userId).maybeSingle();
    if (fallback.error) {
      throw createError$1({ statusCode: 500, statusMessage: "Failed to read profile" });
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
      throw createError$1({ statusCode: 500, statusMessage: "Failed to read shop membership" });
    }
    if ((_d = memberAccess.data) == null ? void 0 : _d.shop_id) {
      shopId = memberAccess.data.shop_id;
      role = normalizeRole(memberAccess.data.role);
    }
  }
  if (!shopId) {
    throw createError$1({ statusCode: 403, statusMessage: "No shop access. Complete onboarding first." });
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
    throw createError$1({ statusCode: 500, statusMessage: "Failed to read feature catalog" });
  }
  return data;
}
async function isFeatureEnabledDirect(event, shopId, code) {
  const client = await serverSupabaseServiceRole(event);
  const { data, error } = await client.from("shop_feature_subscriptions").select("enabled").eq("shop_id", shopId).eq("feature_code", code).maybeSingle();
  if (error) {
    if (/relation .*shop_feature_subscriptions.* does not exist/i.test(error.message)) return false;
    throw createError$1({ statusCode: 500, statusMessage: "Failed to read feature subscriptions" });
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
    throw createError$1({
      statusCode: 402,
      statusMessage: `Feature ${code} is disabled for this shop`
    });
  }
}

async function resolveFestivalOrThrow(event, festivalSlug) {
  const client = await serverSupabaseServiceRole(event);
  const { data, error } = await client.from("festivals").select("id,slug,starts_at,ends_at,is_active").eq("slug", festivalSlug).maybeSingle();
  if (error) {
    throw createError$1({ statusCode: 500, statusMessage: "Failed to resolve festival" });
  }
  if (!data) {
    throw createError$1({ statusCode: 404, statusMessage: "Festival not found" });
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
    throw createError$1({ statusCode: 500, statusMessage: "Failed to load festival orders" });
  }
  return data != null ? data : [];
}

const TELEGRAM_API = (token) => `https://api.telegram.org/bot${token}`;
async function telegram(token, method, body) {
  const res = await fetch(`${TELEGRAM_API(token)}/${method}`, {
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
async function sendMaxMessage$1(baseUrl, token, options) {
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
      const res2 = await telegram(tgToken, "sendVideo", payload);
      const msgId2 = (_c = res2 == null ? void 0 : res2.result) == null ? void 0 : _c.message_id;
      if (msgId2) {
        await client.from("festival_ugc_submissions").update({ moderation_message_id: String(msgId2), updated_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", submissionId);
      }
      return;
    }
    const res = await telegram(tgToken, "sendMessage", payload);
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
    await sendMaxMessage$1(maxBaseUrl, maxToken, {
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
    throw createError$1({ statusCode: 404, statusMessage: "Submission not found" });
  }
  if (args.action === "tag_category") {
    const category = args.category || null;
    const { error: tagError } = await client.from("festival_ugc_submissions").update({ category, updated_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", args.submissionId);
    if (tagError) {
      throw createError$1({ statusCode: 500, statusMessage: "Failed to tag submission" });
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
    throw createError$1({ statusCode: 500, statusMessage: "Failed to update submission status" });
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
      await telegram(tgToken, "sendMessage", { chat_id: tgChat, text }).catch(() => {
      });
    }
    if (maxChat && maxBase && maxToken) {
      await sendMaxMessage$1(maxBase, maxToken, { conversationId: maxChat, text }).catch(() => {
      });
    }
  }
  return { status: patch.status };
}

async function resolveCityBySlug(event, slug) {
  const normalized = slug.trim();
  if (!normalized) {
    throw createError$1({ statusCode: 400, statusMessage: "City slug is required" });
  }
  const client = await serverSupabaseServiceRole(event);
  const { data, error } = await client.from("cities").select("id,name,slug,timezone,editorial_name,is_active").eq("slug", normalized).eq("is_active", true).maybeSingle();
  if (error) {
    console.error("[inuuCity] load failed:", error);
    throw createError$1({ statusCode: 500, statusMessage: "Failed to load city" });
  }
  if (!data) {
    throw createError$1({ statusCode: 404, statusMessage: "City not found" });
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

function formatOrderRef$1(orderNumber, orderId) {
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
    `\u{1F514} \u041D\u043E\u0432\u044B\u0439 \u0437\u0430\u043A\u0430\u0437 ${formatOrderRef$1(payload.order.orderNumber, payload.orderId)}`,
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
  return { text, replyMarkup, orderRef: formatOrderRef$1(order.orderNumber, args.orderId) };
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
async function telegramApi(botToken, method, body) {
  const response = await fetch(`https://api.telegram.org/bot${botToken}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  return response.json().catch(() => null);
}
async function editTelegramToTransferred(botToken, chatId, messageId, text) {
  const payload = await telegramApi(botToken, "editMessageText", {
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
  const payload = await telegramApi(botToken, "sendMessage", {
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
      const payload = await telegramApi(args.botToken, "editMessageText", {
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
async function sendMax$1(baseUrl, token, options) {
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
      throw createError$1({ statusCode: 401, statusMessage: "Unauthorized" });
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
    throw createError$1({ statusCode: 401, statusMessage: "Unauthorized" });
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
    throw createError$1({ statusCode: 500, statusMessage: "Failed to load order" });
  }
  if (!data) {
    throw createError$1({ statusCode: 404, statusMessage: "Order not found" });
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
    throw createError$1({ statusCode: 403, statusMessage: "Order does not belong to current customer" });
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

async function sendTelegram(botToken, chatId, text) {
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
async function sendMax(baseUrl, token, conversationId, text) {
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
    const messageId = await sendTelegram(botToken, chatId, title);
    if (messageId) {
      await client.from("shop_reviews").update({ moderation_message_id: messageId, forwarded_to_manager_at: (/* @__PURE__ */ new Date()).toISOString(), updated_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", reviewId);
    }
    return;
  }
  if (channel === "max") {
    const maxBaseUrl = String(config.maxApiBaseUrl || "");
    const maxToken = String(config.maxApiToken || "");
    if (!maxBaseUrl || !maxToken) return;
    await sendMax(maxBaseUrl, maxToken, chatId, title);
    await client.from("shop_reviews").update({ forwarded_to_manager_at: (/* @__PURE__ */ new Date()).toISOString(), updated_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", reviewId);
  }
}
async function applyReviewModerationAction(event, args) {
  const client = await serverSupabaseServiceRole(event);
  const { data: review } = await client.from("shop_reviews").select("id,shop_id,restaurant_id,status").eq("id", args.reviewId).eq("shop_id", args.shopId).maybeSingle();
  if (!(review == null ? void 0 : review.id)) {
    throw createError$1({ statusCode: 404, statusMessage: "Review not found" });
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
    throw createError$1({ statusCode: 500, statusMessage: "Failed to update review" });
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
      throw createError$1({ statusCode: 409, statusMessage: "Review for this order already exists" });
    }
    throw createError$1({ statusCode: 500, statusMessage: (error == null ? void 0 : error.message) || "Failed to create review" });
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
    throw createError$1({ statusCode: 500, statusMessage: loadErr.message || "Failed to load review" });
  }
  if (!existing) {
    throw createError$1({ statusCode: 404, statusMessage: "Review not found" });
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
    throw createError$1({ statusCode: 500, statusMessage: (error == null ? void 0 : error.message) || "Failed to update review" });
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
      await sendMax$1(maxBaseUrl, maxToken, {
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
function formatOrderRef(orderNumber, orderId) {
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
async function sendMaxMessage(baseUrl, token, target, text, attachments) {
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
    `\u{1F514} \u041D\u043E\u0432\u044B\u0439 \u0437\u0430\u043A\u0430\u0437 ${formatOrderRef(order.orderNumber, payload.orderId)}`,
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
    `\u{1F4E6} \u0417\u0430\u043A\u0430\u0437 ${formatOrderRef(order.orderNumber, payload.orderId)}`,
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
  const orderRef = formatOrderRef(orderDetails.orderNumber, input.orderContext.orderId);
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
            await sendMaxMessage(
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
    throw createError$1({ statusCode: 500, statusMessage: "Failed to load organization style" });
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
  throw createError$1({ statusCode: 500, statusMessage: "Failed to save organization style" });
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
    throw createError$1({ statusCode: 500, statusMessage: "Failed to load organization settings" });
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
    throw createError$1({ statusCode: 500, statusMessage: "Failed to load current shop settings" });
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
    throw createError$1({ statusCode: 500, statusMessage: update.error.message || "Failed to save organization settings" });
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
    throw createError$1({ statusCode: 500, statusMessage: "Failed to load custom presets" });
  }
  return (data != null ? data : []).map((row) => normalizePreset({ ...row, isSystem: false })).filter((item) => !!item);
}
async function createCustomPreset(event, shopId, actorUserId, payload) {
  var _a, _b;
  const title = payload.title.trim();
  if (!title || title.length > 60) {
    throw createError$1({ statusCode: 400, statusMessage: "Preset title must be between 1 and 60 chars" });
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
    throw createError$1({ statusCode: 500, statusMessage: ((_b = insert.error) == null ? void 0 : _b.message) || "Failed to create custom preset" });
  }
  const normalized = normalizePreset({ ...insert.data, isSystem: false });
  if (!normalized) {
    throw createError$1({ statusCode: 500, statusMessage: "Invalid custom preset payload" });
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
    throw createError$1({ statusCode: 500, message: "Failed to load loyalty settings" });
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
    throw createError$1({
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
    throw createError$1({
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
    throw createError$1({ statusMessage: error?.message });
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
  const query = getQuery(event);
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
    throw createError$1({ statusCode: 500, message: "Failed to read tenant shop config" });
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
    throw createError$1({ statusCode: 500, message: "Failed to read tenant by custom domain" });
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
    throw createError$1({ statusCode: 500, message: "Failed to read tenant by bot id" });
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
  const query = getQuery(event);
  const queryShopRaw = typeof query.shop_id === "string" ? query.shop_id.trim() : "";
  if (queryShopRaw) {
    const shop2 = await getShopById(event, queryShopRaw);
    if (!shop2 || !shop2.is_active) {
      throw createError$1({ statusCode: 404, message: "Shop not found" });
    }
    return { shopId: shop2.id, shop: shop2 };
  }
  const tenant = event.context.tenant;
  if ((tenant == null ? void 0 : tenant.shopId) && ((_a = tenant.shop) == null ? void 0 : _a.is_active)) {
    return { shopId: tenant.shopId, shop: tenant.shop };
  }
  const ref = await resolveShopIdFromEvent(event);
  if (!ref) {
    throw createError$1({ statusCode: 400, message: "Missing shop_id" });
  }
  const shop = await getShopById(event, ref);
  if (!shop || !shop.is_active) {
    throw createError$1({ statusCode: 404, message: "Shop not found" });
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
      throw createError$1({ statusCode: 404, message: "Shop not found" });
    }
    return;
  }
  if (!shop.is_active) {
    throw createError$1({ statusCode: 403, message: "Shop is inactive" });
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
        ...deriveTenantThemeFromStyle(cfg),
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
function deriveTenantThemeFromStyle(cfg) {
  var _a, _b, _c, _d;
  const primary = typeof ((_a = cfg == null ? void 0 : cfg.colors) == null ? void 0 : _a.primary) === "string" ? cfg.colors.primary : "#111827";
  const secondary = typeof ((_b = cfg == null ? void 0 : cfg.colors) == null ? void 0 : _b.secondary) === "string" ? cfg.colors.secondary : "#6b7280";
  const textPrimary = typeof ((_c = cfg == null ? void 0 : cfg.colors) == null ? void 0 : _c.textPrimary) === "string" ? cfg.colors.textPrimary : "#111827";
  const surfaceCard = typeof ((_d = cfg == null ? void 0 : cfg.colors) == null ? void 0 : _d.surfaceCard) === "string" ? cfg.colors.surfaceCard : "#ffffff";
  return {
    primary,
    primary_50: mixHex(primary, "#ffffff", 0.92),
    primary_100: mixHex(primary, "#ffffff", 0.85),
    secondary,
    text_primary: textPrimary,
    surface_card: surfaceCard,
    on_primary: "#ffffff"
  };
}

const _SxA8c9 = defineEventHandler(() => {});

const _lazy_RvwyMH = () => import('../routes/api/auth/exchange-max-session.post.mjs');
const _lazy_03WsRB = () => import('../routes/api/auth/exchange-telegram-session.post.mjs');
const _lazy_w3cdvs = () => import('../routes/api/auth/exchange-vk-session.post.mjs');
const _lazy_C99VEe = () => import('../routes/api/auth/link-max.post.mjs');
const _lazy_FNAjmw = () => import('../routes/api/auth/link-telegram.post.mjs');
const _lazy_FzDv_F = () => import('../routes/api/auth/max-link-status.get.mjs');
const _lazy_o75NtK = () => import('../routes/api/auth/request-max-link.post.mjs');
const _lazy_8DMAwn = () => import('../routes/api/auth/request-telegram-link.post.mjs');
const _lazy_Nqu4P_ = () => import('../routes/api/auth/request-vk-link.post.mjs');
const _lazy_2P2Wrf = () => import('../routes/api/auth/telegram-link-status.get.mjs');
const _lazy_3Q5gl_ = () => import('../routes/api/auth/vk-id/callback.get.mjs');
const _lazy_fza5HK = () => import('../routes/api/auth/vk-link-status.get.mjs');
const _lazy_cZSPXT = () => import('../routes/api/cities.get.mjs');
const _lazy_s7B7a4 = () => import('../routes/api/cities/_slug/events/_eventSlug_.get.mjs');
const _lazy_Prd3G_ = () => import('../routes/api/cities/_slug/index.get.mjs');
const _lazy_5mTFh_ = () => import('../routes/api/cities/_slug/home.get.mjs');
const _lazy_jlpLqZ = () => import('../routes/api/cities/_slug/venues/_venueSlug_.get.mjs');
const _lazy_gY1Bvy = () => import('../routes/api/cities/_slug/index.get2.mjs');
const _lazy_q_FidK = () => import('../routes/api/client-orders.get.mjs');
const _lazy_T9W_fd = () => import('../routes/api/cron/review-prompts.post.mjs');
const _lazy_lGk9Ax = () => import('../routes/api/dashboard/access.get.mjs');
const _lazy_Xz3BQ5 = () => import('../routes/api/dashboard/branches.post.mjs');
const _lazy_pwi2MS = () => import('../routes/api/dashboard/branches/_id_.put.mjs');
const _lazy_sc1SzI = () => import('../routes/api/dashboard/branches/_id/deactivate.post.mjs');
const _lazy_9cmB4o = () => import('../routes/api/dashboard/features.get.mjs');
const _lazy_BEa7dI = () => import('../routes/api/dashboard/features/toggle.post.mjs');
const _lazy_AYoQFM = () => import('../routes/api/dashboard/integrations/festival-moderation.get.mjs');
const _lazy_AFGp6j = () => import('../routes/api/dashboard/integrations/festival-moderation.put.mjs');
const _lazy_NqBmuF = () => import('../routes/api/dashboard/integrations/festival-moderation/test.post.mjs');
const _lazy_jp1yIk = () => import('../routes/api/dashboard/integrations/max-chat-link-token.post.mjs');
const _lazy_hpsJ42 = () => import('../routes/api/dashboard/integrations/notification-events.get.mjs');
const _lazy_QWjJOs = () => import('../routes/api/dashboard/integrations/notifications.get.mjs');
const _lazy_3FEqrG = () => import('../routes/api/dashboard/integrations/notifications.put.mjs');
const _lazy_zDdOjf = () => import('../routes/api/dashboard/integrations/notifications/test.post.mjs');
const _lazy_PrSQzt = () => import('../routes/api/dashboard/integrations/telegram-chat-link-token.post.mjs');
const _lazy_ytwhbg = () => import('../routes/api/dashboard/integrations/telegram-chat-unlink.post.mjs');
const _lazy_ldx0nb = () => import('../routes/api/dashboard/moderation/city-ugc.get.mjs');
const _lazy_TI2AEn = () => import('../routes/api/dashboard/moderation/city-ugc/action.post.mjs');
const _lazy_9UgdcH = () => import('../routes/api/dashboard/orders/_id_.get.mjs');
const _lazy_nj2uTd = () => import('../routes/api/dashboard/orders/_id/delay.post.mjs');
const _lazy_oHFiZP = () => import('../routes/api/dashboard/orders/_id/review-prompt.post.mjs');
const _lazy_q0s1S1 = () => import('../routes/api/dashboard/orders/_id/status.put.mjs');
const _lazy_wFEWjN = () => import('../routes/api/dashboard/index.get.mjs');
const _lazy_qKnWPv = () => import('../routes/api/dashboard/organization/media.post.mjs');
const _lazy_Kp1JXb = () => import('../routes/api/dashboard/organization/style-presets.get.mjs');
const _lazy_9aOX12 = () => import('../routes/api/dashboard/organization/style-presets.post.mjs');
const _lazy_0_1qYh = () => import('../routes/api/dashboard/organization/style.get.mjs');
const _lazy_LseL4w = () => import('../routes/api/dashboard/organization/style.put.mjs');
const _lazy_Y0mhAX = () => import('../routes/api/dashboard/organization/style/contacts.put.mjs');
const _lazy_k_QcFR = () => import('../routes/api/dashboard/organization/style/identity.put.mjs');
const _lazy_X4GOLd = () => import('../routes/api/dashboard/organization/style/operations.put.mjs');
const _lazy_hKhvbv = () => import('../routes/api/dashboard/organization/style/rollback.post.mjs');
const _lazy_FNFqef = () => import('../routes/api/dashboard/organization/style/styles.put.mjs');
const _lazy_uSl_L7 = () => import('../routes/api/dashboard/restaurants.get.mjs');
const _lazy_lmzMkq = () => import('../routes/api/dashboard/reviews/action.post.mjs');
const _lazy_GPP4ee = () => import('../routes/api/dashboard/index.get2.mjs');
const _lazy_vGbBtJ = () => import('../routes/api/dashboard/storefront.get.mjs');
const _lazy_JwIfPN = () => import('../routes/api/dashboard/stories/campaigns/_id_.delete.mjs');
const _lazy_Exsa5l = () => import('../routes/api/dashboard/stories/campaigns/_id_.get.mjs');
const _lazy_5KqrlI = () => import('../routes/api/dashboard/stories/campaigns/_id_.put.mjs');
const _lazy_oeNIa_ = () => import('../routes/api/dashboard/stories/index.get.mjs');
const _lazy_BKKmC8 = () => import('../routes/api/dashboard/stories/index.post.mjs');
const _lazy_SFiPSu = () => import('../routes/api/dashboard/stories/media.upload.post.mjs');
const _lazy_N4WRuh = () => import('../routes/api/festival/_festival_slug/achievements.get.mjs');
const _lazy_lIqP3R = () => import('../routes/api/festival/_festival_slug/reviews.post.mjs');
const _lazy_llfTgk = () => import('../routes/api/festival/_festival_slug/ugc.get.mjs');
const _lazy_q9cNCl = () => import('../routes/api/festival/_festival_slug/ugc/eligibility.get.mjs');
const _lazy_xSQept = () => import('../routes/api/festival/_festival_slug/ugc/upload.post.mjs');
const _lazy_kClRrT = () => import('../routes/api/geocode.get.mjs');
const _lazy_2xUO3I = () => import('../routes/api/platform-cities.get.mjs');
const _lazy_Zj4vT9 = () => import('../routes/api/reviews.get.mjs');
const _lazy_OXgZ5M = () => import('../routes/api/reviews.patch.mjs');
const _lazy_9rNeBy = () => import('../routes/api/reviews.post.mjs');
const _lazy_ErF9_I = () => import('../routes/api/shops.get.mjs');
const _lazy_fxdjJk = () => import('../routes/api/stories.get.mjs');
const _lazy_IQeviU = () => import('../routes/api/stories/views.post.mjs');
const _lazy_TnrUDV = () => import('../routes/api/tenant.get.mjs');
const _lazy_bOieFZ = () => import('../routes/api/tenant/cities.get.mjs');
const _lazy_SKISOS = () => import('../routes/api/tenant/resolve-canonical.get.mjs');
const _lazy_yPR5B0 = () => import('../routes/api/webhook-max.post.mjs');
const _lazy_mu5K9i = () => import('../routes/api/webhook-relay.post.mjs').then(function (n) { return n.w; });
const _lazy_HwcIKV = () => import('../routes/api/webhook-relay.post.mjs').then(function (n) { return n.a; });
const _lazy_2tVpPI = () => import('../routes/api/webhooks/yookassa.post.mjs');
const _lazy_VaUVu9 = () => import('../routes/renderer.mjs').then(function (n) { return n.r; });

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
  { route: '/__nuxt_island/**', handler: _SxA8c9, lazy: false, middleware: false, method: undefined },
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
    debug: destr(false),
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
  const router = createRouter({
    preemptive: true
  });
  const nodeHandler = toNodeListener(h3App);
  const localCall = (aRequest) => b(
    nodeHandler,
    aRequest
  );
  const localFetch = (input, init) => {
    if (!input.toString().startsWith("/")) {
      return globalThis.fetch(input, init);
    }
    return C(
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

const debug = (...args) => {
};
function GracefulShutdown(server, opts) {
  opts = opts || {};
  const options = Object.assign(
    {
      signals: "SIGINT SIGTERM",
      timeout: 3e4,
      development: false,
      forceExit: true,
      onShutdown: (signal) => Promise.resolve(signal),
      preShutdown: (signal) => Promise.resolve(signal)
    },
    opts
  );
  let isShuttingDown = false;
  const connections = {};
  let connectionCounter = 0;
  const secureConnections = {};
  let secureConnectionCounter = 0;
  let failed = false;
  let finalRun = false;
  function onceFactory() {
    let called = false;
    return (emitter, events, callback) => {
      function call() {
        if (!called) {
          called = true;
          return Reflect.apply(callback, this, arguments);
        }
      }
      for (const e of events) {
        emitter.on(e, call);
      }
    };
  }
  const signals = options.signals.split(" ").map((s) => s.trim()).filter((s) => s.length > 0);
  const once = onceFactory();
  once(process, signals, (signal) => {
    debug("received shut down signal", signal);
    shutdown(signal).then(() => {
      if (options.forceExit) {
        process.exit(failed ? 1 : 0);
      }
    }).catch((error) => {
      debug("server shut down error occurred", error);
      process.exit(1);
    });
  });
  function isFunction(functionToCheck) {
    const getType = Object.prototype.toString.call(functionToCheck);
    return /^\[object\s([A-Za-z]+)?Function]$/.test(getType);
  }
  function destroy(socket, force = false) {
    if (socket._isIdle && isShuttingDown || force) {
      socket.destroy();
      if (socket.server instanceof http.Server) {
        delete connections[socket._connectionId];
      } else {
        delete secureConnections[socket._connectionId];
      }
    }
  }
  function destroyAllConnections(force = false) {
    debug("Destroy Connections : " + (force ? "forced close" : "close"));
    let counter = 0;
    let secureCounter = 0;
    for (const key of Object.keys(connections)) {
      const socket = connections[key];
      const serverResponse = socket._httpMessage;
      if (serverResponse && !force) {
        if (!serverResponse.headersSent) {
          serverResponse.setHeader("connection", "close");
        }
      } else {
        counter++;
        destroy(socket);
      }
    }
    debug("Connections destroyed : " + counter);
    debug("Connection Counter    : " + connectionCounter);
    for (const key of Object.keys(secureConnections)) {
      const socket = secureConnections[key];
      const serverResponse = socket._httpMessage;
      if (serverResponse && !force) {
        if (!serverResponse.headersSent) {
          serverResponse.setHeader("connection", "close");
        }
      } else {
        secureCounter++;
        destroy(socket);
      }
    }
    debug("Secure Connections destroyed : " + secureCounter);
    debug("Secure Connection Counter    : " + secureConnectionCounter);
  }
  server.on("request", (req, res) => {
    req.socket._isIdle = false;
    if (isShuttingDown && !res.headersSent) {
      res.setHeader("connection", "close");
    }
    res.on("finish", () => {
      req.socket._isIdle = true;
      destroy(req.socket);
    });
  });
  server.on("connection", (socket) => {
    if (isShuttingDown) {
      socket.destroy();
    } else {
      const id = connectionCounter++;
      socket._isIdle = true;
      socket._connectionId = id;
      connections[id] = socket;
      socket.once("close", () => {
        delete connections[socket._connectionId];
      });
    }
  });
  server.on("secureConnection", (socket) => {
    if (isShuttingDown) {
      socket.destroy();
    } else {
      const id = secureConnectionCounter++;
      socket._isIdle = true;
      socket._connectionId = id;
      secureConnections[id] = socket;
      socket.once("close", () => {
        delete secureConnections[socket._connectionId];
      });
    }
  });
  process.on("close", () => {
    debug("closed");
  });
  function shutdown(sig) {
    function cleanupHttp() {
      destroyAllConnections();
      debug("Close http server");
      return new Promise((resolve, reject) => {
        server.close((err) => {
          if (err) {
            return reject(err);
          }
          return resolve(true);
        });
      });
    }
    debug("shutdown signal - " + sig);
    if (options.development) {
      debug("DEV-Mode - immediate forceful shutdown");
      return process.exit(0);
    }
    function finalHandler() {
      if (!finalRun) {
        finalRun = true;
        if (options.finally && isFunction(options.finally)) {
          debug("executing finally()");
          options.finally();
        }
      }
      return Promise.resolve();
    }
    function waitForReadyToShutDown(totalNumInterval) {
      debug(`waitForReadyToShutDown... ${totalNumInterval}`);
      if (totalNumInterval === 0) {
        debug(
          `Could not close connections in time (${options.timeout}ms), will forcefully shut down`
        );
        return Promise.resolve(true);
      }
      const allConnectionsClosed = Object.keys(connections).length === 0 && Object.keys(secureConnections).length === 0;
      if (allConnectionsClosed) {
        debug("All connections closed. Continue to shutting down");
        return Promise.resolve(false);
      }
      debug("Schedule the next waitForReadyToShutdown");
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(waitForReadyToShutDown(totalNumInterval - 1));
        }, 250);
      });
    }
    if (isShuttingDown) {
      return Promise.resolve();
    }
    debug("shutting down");
    return options.preShutdown(sig).then(() => {
      isShuttingDown = true;
      cleanupHttp();
    }).then(() => {
      const pollIterations = options.timeout ? Math.round(options.timeout / 250) : 0;
      return waitForReadyToShutDown(pollIterations);
    }).then((force) => {
      debug("Do onShutdown now");
      if (force) {
        destroyAllConnections(force);
      }
      return options.onShutdown(sig);
    }).then(finalHandler).catch((error) => {
      const errString = typeof error === "string" ? error : JSON.stringify(error);
      debug(errString);
      failed = true;
      throw errString;
    });
  }
  function shutdownManual() {
    return shutdown("manual");
  }
  return shutdownManual;
}

function getGracefulShutdownConfig() {
  return {
    disabled: !!process.env.NITRO_SHUTDOWN_DISABLED,
    signals: (process.env.NITRO_SHUTDOWN_SIGNALS || "SIGTERM SIGINT").split(" ").map((s) => s.trim()),
    timeout: Number.parseInt(process.env.NITRO_SHUTDOWN_TIMEOUT || "", 10) || 3e4,
    forceExit: !process.env.NITRO_SHUTDOWN_NO_FORCE_EXIT
  };
}
function setupGracefulShutdown(listener, nitroApp) {
  const shutdownConfig = getGracefulShutdownConfig();
  if (shutdownConfig.disabled) {
    return;
  }
  GracefulShutdown(listener, {
    signals: shutdownConfig.signals.join(" "),
    timeout: shutdownConfig.timeout,
    forceExit: shutdownConfig.forceExit,
    onShutdown: async () => {
      await new Promise((resolve) => {
        const timeout = setTimeout(() => {
          console.warn("Graceful shutdown timeout, force exiting...");
          resolve();
        }, shutdownConfig.timeout);
        nitroApp.hooks.callHook("close").catch((error) => {
          console.error(error);
        }).finally(() => {
          clearTimeout(timeout);
          resolve();
        });
      });
    }
  });
}

const cert = process.env.NITRO_SSL_CERT;
const key = process.env.NITRO_SSL_KEY;
const nitroApp = useNitroApp();
const server = cert && key ? new Server({ key, cert }, toNodeListener(nitroApp.h3App)) : new Server$1(toNodeListener(nitroApp.h3App));
const port = destr(process.env.NITRO_PORT || process.env.PORT) || 3e3;
const host = process.env.NITRO_HOST || process.env.HOST;
const path = process.env.NITRO_UNIX_SOCKET;
const listener = server.listen(path ? { path } : { port, host }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  const protocol = cert && key ? "https" : "http";
  const addressInfo = listener.address();
  if (typeof addressInfo === "string") {
    console.log(`Listening on unix socket ${addressInfo}`);
    return;
  }
  const baseURL = (useRuntimeConfig().app.baseURL || "").replace(/\/$/, "");
  const url = `${protocol}://${addressInfo.family === "IPv6" ? `[${addressInfo.address}]` : addressInfo.address}:${addressInfo.port}${baseURL}`;
  console.log(`Listening on ${url}`);
});
trapUnhandledNodeErrors();
setupGracefulShutdown(listener, nitroApp);
const nodeServer = {};

export { $fetch$1 as $, defu as A, dispatchNotificationEvent as B, encodePath as C, enqueueManualReviewPrompts as D, enrichManagerKeyboardFromOrder as E, exchangeVkCode as F, executeAsync as G, fetchVkUserInfo as H, findProfileIdByPhone as I, generateVkPkcePair as J, getAllowedOrderStatusTransitions as K, getContext as L, getCustomPresets as M, getDefaultOrganizationSettings as N, getHeader as O, getMaxBotTokenForShop as P, getMessengerInitDataFromEvent as Q, getOrganizationSettings as R, getProfilePhone as S, getQuery as T, getRequestHeaders as U, getResponseStatus as V, getResponseStatusText as W, getRouteRules as X, getRouterParam as Y, getShopById as Z, getStaffResponseText as _, accrueLoyaltyEarnForPaidOrder as a, useRuntimeConfig as a$, getStyleRecord as a0, getSystemPresets as a1, getUnifiedFlowConfig as a2, handleTelegramOrderContactCallback as a3, hasProtocol as a4, hash$1 as a5, insertShopReview as a6, isCustomerBannedForFestival as a7, isDeliveryFulfillment as a8, isScriptProtocol as a9, readBody as aA, requireDashboardAccess as aB, requireOwnedOrderForReview as aC, requireReviewsFeature as aD, requireTenantShop as aE, resolveCanonicalTenantCartPath as aF, resolveCityBySlug as aG, resolveCustomerIdentityOrThrow as aH, resolveCustomerProfileId as aI, resolveEffectiveWorkingHours as aJ, resolveFestivalOrThrow as aK, resolveReviewIdentity as aL, resolveShopIdFromEvent as aM, sanitizeStatusCode as aN, sendFestivalSubmissionToModeration as aO, sendMax$1 as aP, sendRedirect as aQ, serverSupabaseClient as aR, serverSupabaseServiceRole as aS, serverSupabaseUser as aT, setCookie as aU, setProfilePhone as aV, setResponseHeader as aW, syncTelegramChatsAfterBranchTransfer as aX, uniqueNonEmptyTokens as aY, updateShopReviewRating as aZ, useNitroApp as a_, isShopFeatureEnabled as aa, isTargetingEmpty as ab, joinURL as ac, loadActiveShopBranches as ad, loadEligibleFestivalOrders as ae, mapActionToStatus as af, mapChatCallbackToOrderStatus as ag, mergeMetadataWithTimeline as ah, migrateCustomerDeliveryAddresses as ai, nodeServer as aj, normalizeDashboardStatus as ak, normalizeOrderItemsJson as al, normalizePhone as am, normalizeWeeklyWorkingHours as an, parseAuthLinkTokenUuidFromText as ao, parseBranchCallback as ap, parseListLimit as aq, parseOrderContactCallback as ar, parseOrderMetadata as as, parseQuery as at, parseReviewTokenCallback as au, parseURL as av, persistOrganizationSettings as aw, persistStyleRecord as ax, processDueReviewPrompts as ay, publicAssetsURL as az, appendOrderTimelineEntry as b, validateOrganizationContactsSettings as b0, validateOrganizationOperationsSettings as b1, validateOrganizationSettings as b2, validateStyleConfig as b3, validateWebAppInitDataAnyToken as b4, withAuditEntry as b5, withQuery as b6, withTrailingSlash as b7, withoutTrailingSlash as b8, applyFestivalModerationAction as c, applyOrderStatusFromChat as d, applyReviewModerationAction as e, applyReviewPromptTelegramCallback as f, assignOrderBranchFromChat as g, baseURL as h, buildAssetsURL as i, buildAuthSiteLinkUrl as j, buildBranchPickerInlineKeyboard as k, buildDemoStoryCampaigns as l, buildManagerOrderInlineKeyboard as m, buildVkAuthorizeUrl as n, campaignMatchesTargeting as o, canManageOrderFromManagerChat as p, computeInternalQualityScore as q, computePublicRating as r, createCustomPreset as s, createError$1 as t, createHooks as u, createServiceCallEvent as v, dashboardOrderStatusLabels as w, decodePath as x, defineEventHandler as y, defineRenderHandler as z };
