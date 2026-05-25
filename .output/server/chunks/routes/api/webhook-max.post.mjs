import { y as defineEventHandler, a$ as useRuntimeConfig, O as getHeader, t as createError, aA as readBody, aS as serverSupabaseServiceRole, a2 as getUnifiedFlowConfig, b as appendOrderTimelineEntry, S as getProfilePhone, aP as sendMax, af as mapActionToStatus, _ as getStaffResponseText, v as createServiceCallEvent, c as applyFestivalModerationAction, am as normalizePhone, aV as setProfilePhone, j as buildAuthSiteLinkUrl, ao as parseAuthLinkTokenUuidFromText } from '../../nitro/nitro.mjs';
import 'node:crypto';
import '@supabase/ssr';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:url';
import '@supabase/supabase-js';

function formatOrderRef(orderNumber, fallbackOrderId) {
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
      `\u{1F4E6} \u0417\u0430\u043A\u0430\u0437 ${formatOrderRef(order == null ? void 0 : order.order_number, orderId)}`,
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
        await sendMax(maxBaseUrl, maxToken, {
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
        await sendMax(maxBaseUrl, maxToken, {
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

export { webhookMax_post as default };
