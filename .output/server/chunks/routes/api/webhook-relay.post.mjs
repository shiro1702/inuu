import { y as defineEventHandler, a$ as useRuntimeConfig, O as getHeader, t as createError, aA as readBody, am as normalizePhone, aS as serverSupabaseServiceRole, aV as setProfilePhone, j as buildAuthSiteLinkUrl, S as getProfilePhone, ay as processDueReviewPrompts, au as parseReviewTokenCallback, aa as isShopFeatureEnabled, f as applyReviewPromptTelegramCallback, c as applyFestivalModerationAction, ar as parseOrderContactCallback, a3 as handleTelegramOrderContactCallback, af as mapActionToStatus, _ as getStaffResponseText, v as createServiceCallEvent, ap as parseBranchCallback, p as canManageOrderFromManagerChat, ad as loadActiveShopBranches, a2 as getUnifiedFlowConfig, k as buildBranchPickerInlineKeyboard, m as buildManagerOrderInlineKeyboard, E as enrichManagerKeyboardFromOrder, g as assignOrderBranchFromChat, aX as syncTelegramChatsAfterBranchTransfer, b as appendOrderTimelineEntry, ag as mapChatCallbackToOrderStatus, d as applyOrderStatusFromChat, a8 as isDeliveryFulfillment } from '../../nitro/nitro.mjs';

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

export { webhook_post$1 as a, webhookRelay_post as w };
