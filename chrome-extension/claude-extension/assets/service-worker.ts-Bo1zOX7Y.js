import {
    A as e,
    f as t,
    B as a,
    m as s,
    s as n,
    S as o,
    C as r,
    _ as i,
    E as c,
    a as d,
} from "./permissions-DQjjgS8V.js";
import { i as m } from "./SentryService-JiT06VPa.js";
import { K as u, t as l, L as p, M as h, N as w, O as y, P as f } from "./mcpPermissions-njmGsNbg.js";
import "./client-BsbSyIlx.js";
let _ = null,
    g = null,
    T = !1,
    b = !1,
    I = !1,
    v = null,
    A = null;
function E(e) {
    e?.includes("native messaging host not found") && (b = !1);
}
async function P() {
    try {
        return await (async function () {
            if (_) return !0;
            if (T) return !1;
            T = !0;
            try {
                if (!(await chrome.permissions.contains({ permissions: ["nativeMessaging"] }))) return !1;
                if ("function" != typeof chrome.runtime.connectNative) return !1;
                const t = [
                    { name: "com.anthropic.claude_browser_extension", label: "Desktop" },
                    { name: "com.anthropic.claude_code_browser_extension", label: "Claude Code" },
                ];
                for (const a of t)
                    try {
                        const e = chrome.runtime.connectNative(a.name);
                        if (
                            await new Promise((t) => {
                                let a = !1;
                                const s = () => {
                                        a || ((a = !0), chrome.runtime.lastError, t(!1));
                                    },
                                    n = (o) => {
                                        a ||
                                            ("pong" === o.type &&
                                                ((a = !0),
                                                e.onDisconnect.removeListener(s),
                                                e.onMessage.removeListener(n),
                                                t(!0)));
                                    };
                                e.onDisconnect.addListener(s), e.onMessage.addListener(n);
                                try {
                                    e.postMessage({ type: "ping" });
                                } catch (o) {
                                    return void (a || ((a = !0), t(!1)));
                                }
                                setTimeout(() => {
                                    a ||
                                        ((a = !0),
                                        e.onDisconnect.removeListener(s),
                                        e.onMessage.removeListener(n),
                                        t(!1));
                                }, 1e4);
                            })
                        )
                            return (
                                (_ = e),
                                (g = a.name),
                                (b = !0),
                                _.onMessage.addListener(async (e) => {
                                    await N(e);
                                }),
                                _.onDisconnect.addListener(() => {
                                    const e = chrome.runtime.lastError?.message;
                                    (_ = null), (g = null), (I = !1), E(e), u();
                                }),
                                _.postMessage({ type: "get_status" }),
                                !0
                            );
                        e.disconnect();
                    } catch (e) {}
                return !1;
            } catch (e) {
                return e instanceof Error && E(e.message), !1;
            } finally {
                T = !1;
            }
        })();
    } catch (e) {
        return !1;
    }
}
async function S() {
    try {
        return (
            await chrome.permissions.remove({ permissions: ["nativeMessaging"] }),
            _?.disconnect(),
            (_ = null),
            (g = null),
            (T = !1),
            (b = !1),
            (I = !1),
            !0
        );
    } catch (e) {
        return !1;
    }
}
async function N(t) {
    switch (t.type) {
        case "tool_request":
            await (async function (e) {
                try {
                    const { method: t, params: a } = e;
                    if ("execute_tool" === t) {
                        if (!a?.tool) return void L(p("No tool specified"));
                        const e = a.client_id,
                            t = a.args?.tabGroupId,
                            s = "number" == typeof t ? t : void 0,
                            n = a.args?.tabId,
                            o = "number" == typeof n ? n : void 0;
                        L(await h({ toolName: a.tool, args: a.args || {}, tabId: o, tabGroupId: s, clientId: e }), e);
                    } else L({ content: `Unknown method: ${t}` });
                } catch (t) {
                    L(p(`Tool execution failed: ${t instanceof Error ? t.message : "Unknown error"}`));
                }
            })(t);
            break;
        case "status_response":
            v && (clearTimeout(A), (A = null), v({ nativeHostInstalled: b, mcpConnected: I }), (v = null));
            break;
        case "mcp_connected":
            !(async function () {
                e(), (I = !0), await l.initialize(), l.startTabGroupChangeListener();
            })();
            break;
        case "mcp_disconnected":
            (I = !1), l.stopTabGroupChangeListener();
    }
}
function L({ content: e, is_error: t }, a) {
    if (!_) return;
    if (!e || ("string" != typeof e && !Array.isArray(e))) return;
    let s;
    (s = t
        ? (function (e) {
              let t;
              const a =
                  "IMPORTANT: The user has explicitly declined this action. Do not attempt to use other tools or workarounds. Instead, acknowledge the denial and ask the user how they would prefer to proceed.";
              t =
                  "string" == typeof e
                      ? e.includes("Permission denied by user")
                          ? `${e} - ${a}`
                          : e
                      : e.map((t) =>
                            "object" == typeof t &&
                            null !== t &&
                            "text" in t &&
                            "string" == typeof t.text &&
                            t.text.includes("Permission denied by user")
                                ? { ...t, text: `${e} - ${a}` }
                                : t
                        );
              return { type: "tool_response", error: { content: t } };
          })(e)
        : { type: "tool_response", result: { content: e } }),
        _.postMessage(s);
}
async function k() {
    const e = t(),
        a = `${`claude-browser-extension/${chrome.runtime.getManifest().version} (external)`} ${navigator.userAgent} `,
        s = [
            {
                id: 1,
                priority: 1,
                action: {
                    type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
                    requestHeaders: [
                        { header: "User-Agent", operation: chrome.declarativeNetRequest.HeaderOperation.SET, value: a },
                    ],
                },
                condition: {
                    urlFilter: `${e.apiBaseUrl}/*`,
                    resourceTypes: [
                        chrome.declarativeNetRequest.ResourceType.XMLHTTPREQUEST,
                        chrome.declarativeNetRequest.ResourceType.OTHER,
                    ],
                },
            },
        ];
    await chrome.declarativeNetRequest.updateSessionRules({ removeRuleIds: [1], addRules: s });
}
const M = "/chrome/";
async function R(e, t) {
    try {
        const a = new URL(e);
        if ("clau.de" !== a.host) return !1;
        if ("/chrome/permissions" === a.pathname.toLowerCase())
            return (
                await (async function (e) {
                    try {
                        const e = chrome.runtime.getURL("options.html#permissions");
                        await chrome.tabs.create({ url: e });
                    } catch (t) {
                    } finally {
                        await U(e);
                    }
                })(t),
                !0
            );
        if (!a.pathname.startsWith(M)) return !1;
        const s = a.pathname.substring(8).toLowerCase();
        if ("reconnect" === s)
            return (
                await (async function (e) {
                    try {
                        await S(), await new Promise((e) => setTimeout(e, 500));
                        const e = await P();
                        w("claude_chrome.extension_url.reconnect", { success: e });
                    } catch (t) {
                        w("claude_chrome.extension_url.reconnect", { success: !1 });
                    } finally {
                        await U(e);
                    }
                })(t),
                !0
            );
        if (s.startsWith("tab/")) {
            const e = parseInt(s.substring(4), 10);
            return (
                await (async function (e, t) {
                    if (isNaN(e))
                        return (
                            w("claude_chrome.extension_url.tab_switch", { success: !1, error: "invalid_tab_id" }),
                            await U(t),
                            !0
                        );
                    try {
                        await l.initialize();
                        const a = await l.findGroupByTab(e);
                        if (!a || a.isUnmanaged)
                            return (
                                w("claude_chrome.extension_url.tab_switch", { success: !1, error: "tab_not_managed" }),
                                await U(t),
                                !0
                            );
                        const s = await chrome.tabs.get(e);
                        return (
                            void 0 !== s.windowId && (await chrome.windows.update(s.windowId, { focused: !0 })),
                            await chrome.tabs.update(e, { active: !0 }),
                            w("claude_chrome.extension_url.tab_switch", { success: !0 }),
                            await U(t),
                            !0
                        );
                    } catch (a) {
                        return w("claude_chrome.extension_url.tab_switch", { success: !1 }), await U(t), !0;
                    }
                })(e, t),
                !0
            );
        }
        return !1;
    } catch {
        return w("claude_chrome.extension_url.unknown_exception", {}), !1;
    }
}
async function U(e) {
    try {
        await chrome.tabs.remove(e);
    } catch (t) {}
}
async function O() {
    try {
        const t = (await d.getAllPrompts()).filter((e) => e.repeatType && "none" !== e.repeatType);
        if (0 === t.length) return;
        let a = 0,
            s = 0;
        for (const n of t)
            try {
                await d.updateAlarmForPrompt(n), a++;
            } catch (e) {
                s++;
            }
        try {
            await d.updateNextRunTimes();
        } catch (e) {}
    } catch (e) {}
}
m(), P();
const C = new Map();
async function D(e) {
    chrome.sidePanel.setOptions({ tabId: e, path: `sidepanel.html?tabId=${encodeURIComponent(e)}`, enabled: !0 }),
        chrome.sidePanel.open({ tabId: e }),
        await l.initialize(!0);
    const t = await l.findGroupByTab(e);
    if (t) {
        if (t.isUnmanaged) {
            try {
                await l.adoptOrphanedGroup(e, t.chromeGroupId);
            } catch (a) {}
            return;
        }
    } else {
        try {
            await l.createGroup(e);
        } catch (a) {}
        P();
    }
}
async function x(e) {
    const t = e.id;
    t && (await D(t));
}
async function $(e, t) {
    const a = `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
        s = await chrome.windows.create({ url: e.url || "about:blank", type: "normal", focused: !0 });
    if (!s || !s.id || !s.tabs || 0 === s.tabs.length) throw new Error("Failed to create window for scheduled task");
    const r = s.tabs[0];
    if (!r.id) throw new Error("Failed to get tab in new window for scheduled task");
    await l.initialize(!0);
    await l.createGroup(r.id);
    await n(o.TARGET_TAB_ID, r.id),
        await (async function (e) {
            const { sessionId: t, skipPermissions: a, model: s } = e,
                n = chrome.runtime.getURL(
                    `sidepanel.html?mode=window&sessionId=${t}${a ? "&skipPermissions=true" : ""}${s ? `&model=${encodeURIComponent(s)}` : ""}`
                ),
                o = await chrome.windows.create({
                    url: n,
                    type: "popup",
                    width: 500,
                    height: 768,
                    left: 100,
                    top: 100,
                    focused: !0,
                });
            if (!o) throw new Error("Failed to create sidepanel window");
            return o;
        })({ sessionId: a, skipPermissions: e.skipPermissions, model: e.model }),
        await (async function (e) {
            const { tabId: t, prompt: a, taskName: s, runLogId: n, sessionId: o, isScheduledTask: r } = e;
            return new Promise((e, i) => {
                const c = 3e4,
                    d = Date.now();
                let m = !1;
                const u = async () => {
                    try {
                        if (Date.now() - d > c)
                            return void i(new Error("Timeout waiting for tab to load for task execution"));
                        "complete" === (await chrome.tabs.get(t)).status
                            ? setTimeout(() => {
                                  m ||
                                      ((m = !0),
                                      chrome.runtime.sendMessage(
                                          {
                                              type: "EXECUTE_TASK",
                                              prompt: a,
                                              taskName: s,
                                              runLogId: n,
                                              windowSessionId: o,
                                              isScheduledTask: r,
                                          },
                                          () => {
                                              chrome.runtime.lastError
                                                  ? i(
                                                        new Error(
                                                            `Failed to send prompt: ${chrome.runtime.lastError.message}`
                                                        )
                                                    )
                                                  : e();
                                          }
                                      ));
                              }, 3e3)
                            : setTimeout(u, 500);
                    } catch (l) {
                        i(l);
                    }
                };
                setTimeout(u, 1e3);
            });
        })({ tabId: r.id, prompt: e.prompt, taskName: e.name, runLogId: t, sessionId: a, isScheduledTask: !0 });
}
chrome.runtime.onInstalled.addListener(async (e) => {
    chrome.storage.local.remove(["updateAvailable"]),
        chrome.runtime.setUninstallURL(
            "https://docs.google.com/forms/d/e/1FAIpQLSdLa1wTVkB2ml2abPI1FP9KiboOnp2N0c3aDmp5rWmaOybWwQ/viewform"
        ),
        a(),
        y(),
        await l.initialize(),
        await k(),
        e.reason === chrome.runtime.OnInstalledReason.INSTALL && s(),
        P(),
        await O();
}),
    chrome.runtime.onStartup.addListener(async () => {
        a(), y(), await k(), await l.initialize(), P(), await O();
    }),
    chrome.permissions.onAdded.addListener((e) => {
        e.permissions?.includes("nativeMessaging") && P();
    }),
    chrome.permissions.onRemoved.addListener((e) => {
        e.permissions?.includes("nativeMessaging") && S();
    }),
    chrome.action.onClicked.addListener(x),
    chrome.notifications.onClicked.addListener(async (e) => {
        chrome.notifications.clear(e);
        const t = e.split("_");
        let a = null;
        if ((t.length >= 2 && "unknown" !== t[1] && (a = parseInt(t[1], 10)), a && !isNaN(a)))
            try {
                const e = await chrome.tabs.get(a);
                if (e && e.windowId)
                    return (
                        await chrome.windows.update(e.windowId, { focused: !0 }),
                        void (await chrome.tabs.update(a, { active: !0 }))
                    );
            } catch {}
        const [s] = await chrome.tabs.query({ active: !0, currentWindow: !0 });
        s?.id && s.windowId && (await chrome.windows.update(s.windowId, { focused: !0 }));
    }),
    chrome.commands.onCommand.addListener((e) => {
        "toggle-side-panel" === e &&
            chrome.tabs.query({ active: !0, currentWindow: !0 }, (e) => {
                const t = e[0];
                t && x(t);
            });
    }),
    chrome.runtime.onUpdateAvailable.addListener((e) => {
        n(o.UPDATE_AVAILABLE, !0),
            w("claude_chrome.extension.update_available", {
                current_version: chrome.runtime.getManifest().version,
                new_version: e.version,
            });
    }),
    chrome.runtime.onMessage.addListener(
        (e, t, s) => (
            (async () => {
                if ("PLAY_NOTIFICATION_SOUND" !== e.type) {
                    if ("open_side_panel" === e.type) {
                        const a = e.tabId || t.tab?.id;
                        if (!a) return void s({ success: !1 });
                        if ((await D(a), e.prompt)) {
                            const t = async (a = 0) => {
                                try {
                                    const t = 0 === a ? 800 : 500;
                                    await new Promise((e) => setTimeout(e, t)),
                                        await new Promise((t, a) => {
                                            chrome.runtime.sendMessage(
                                                {
                                                    type: "POPULATE_INPUT_TEXT",
                                                    prompt: e.prompt,
                                                    permissionMode: e.permissionMode,
                                                    selectedModel: e.selectedModel,
                                                    attachments: e.attachments,
                                                },
                                                () => {
                                                    chrome.runtime.lastError
                                                        ? a(new Error(chrome.runtime.lastError.message))
                                                        : t();
                                                }
                                            );
                                        });
                                } catch (s) {
                                    a < 5 && (await t(a + 1));
                                }
                            };
                            await t();
                        }
                        if (e.conversationUuid) {
                            const t = async (a = 0) => {
                                try {
                                    const t = 0 === a ? 800 : 500;
                                    await new Promise((e) => setTimeout(e, t)),
                                        await new Promise((t, a) => {
                                            chrome.runtime.sendMessage(
                                                { type: "LOAD_CONVERSATION", conversationUuid: e.conversationUuid },
                                                () => {
                                                    chrome.runtime.lastError
                                                        ? a(new Error(chrome.runtime.lastError.message))
                                                        : t();
                                                }
                                            );
                                        });
                                } catch (s) {
                                    a < 5 && (await t(a + 1));
                                }
                            };
                            await t();
                        }
                        return void s({ success: !0 });
                    }
                    if ("logout" === e.type)
                        try {
                            await r(), await l.clearAllGroups(), await a(), await f(), s({ success: !0 });
                        } catch (i) {}
                    else if ("check_native_host_status" === e.type) {
                        const e = await (async function () {
                            return _ && b
                                ? (A && clearTimeout(A),
                                  new Promise((e) => {
                                      (v = e),
                                          _.postMessage({ type: "get_status" }),
                                          (A = setTimeout(() => {
                                              (v = null), e({ nativeHostInstalled: b, mcpConnected: I });
                                          }, 1e4));
                                  }))
                                : { nativeHostInstalled: b, mcpConnected: I };
                        })();
                        s({ status: e });
                    } else if ("SEND_MCP_NOTIFICATION" === e.type) {
                        const t = (function (e, t) {
                            if (!_) return !1;
                            const a = { type: "notification", jsonrpc: "2.0", method: e, params: t || {} };
                            return _.postMessage(a), !0;
                        })(e.method, e.params);
                        s({ success: t });
                    } else if ("OPEN_OPTIONS_WITH_TASK" === e.type)
                        try {
                            await n(o.PENDING_SCHEDULED_TASK, e.task);
                            const t = chrome.runtime.getURL("options.html"),
                                a = (await chrome.tabs.query({})).find((e) => e.url?.startsWith(t));
                            a && a.id
                                ? (await chrome.tabs.update(a.id, {
                                      url: chrome.runtime.getURL("options.html#prompts"),
                                      active: !0,
                                  }),
                                  a.windowId && (await chrome.windows.update(a.windowId, { focused: !0 })))
                                : await chrome.tabs.create({ url: chrome.runtime.getURL("options.html#prompts") }),
                                s({ success: !0 });
                        } catch (i) {
                            s({ success: !1, error: i.message });
                        }
                    else if ("EXECUTE_SCHEDULED_TASK" === e.type)
                        try {
                            const { task: t, runLogId: a } = e;
                            await $(t, a),
                                w("claude_chrome.scheduled_task.executed", {
                                    task_id: t.id,
                                    task_name: t.name,
                                    success: !0,
                                    execution_type: e.isManual ? "manual" : "automatic",
                                }),
                                s({ success: !0 });
                        } catch (i) {
                            w("claude_chrome.scheduled_task.executed", {
                                task_id: e.task.id,
                                task_name: e.task.name,
                                success: !1,
                                execution_type: e.isManual ? "manual" : "automatic",
                                error: i.message,
                            }),
                                s({ success: !1, error: i.message });
                        }
                    else if ("STOP_AGENT" === e.type) {
                        let a;
                        if ("CURRENT_TAB" === e.fromTabId && t.tab?.id) {
                            a = (await l.getMainTabId(t.tab.id)) || t.tab.id;
                        } else "number" == typeof e.fromTabId && (a = e.fromTabId);
                        a && chrome.runtime.sendMessage({ type: "STOP_AGENT", targetTabId: a }), s({ success: !0 });
                    } else if ("SWITCH_TO_MAIN_TAB" === e.type)
                        if (t.tab?.id)
                            try {
                                await l.initialize(!0);
                                const e = await l.getMainTabId(t.tab.id);
                                if (e) {
                                    await chrome.tabs.update(e, { active: !0 });
                                    const t = await chrome.tabs.get(e);
                                    t.windowId && (await chrome.windows.update(t.windowId, { focused: !0 })),
                                        s({ success: !0 });
                                } else s({ success: !1, error: "No main tab found" });
                            } catch (i) {
                                s({ success: !1, error: i.message });
                            }
                        else s({ success: !1, error: "No sender tab" });
                    else
                        "SECONDARY_TAB_CHECK_MAIN" === e.type
                            ? chrome.runtime.sendMessage(
                                  {
                                      type: "MAIN_TAB_ACK_REQUEST",
                                      secondaryTabId: e.secondaryTabId,
                                      mainTabId: e.mainTabId,
                                      timestamp: e.timestamp,
                                  },
                                  (e) => {
                                      s(e?.success ? { success: !0 } : { success: !1 });
                                  }
                              )
                            : "MAIN_TAB_ACK_RESPONSE" === e.type
                              ? s({ success: e.success })
                              : "STATIC_INDICATOR_HEARTBEAT" === e.type
                                ? (async () => {
                                      const e = t.tab?.id;
                                      if (e)
                                          try {
                                              const t = (await chrome.tabs.get(e)).groupId;
                                              if (void 0 === t || t === chrome.tabGroups.TAB_GROUP_ID_NONE)
                                                  return void s({ success: !1 });
                                              if (await l.findGroupByTab(e)) return void s({ success: !0 });
                                              const a = await chrome.tabs.query({ groupId: t }),
                                                  n = async (t) => {
                                                      if (t >= a.length) return void s({ success: !1 });
                                                      const o = a[t];
                                                      if (o.id === e || !o.id) return void (await n(t + 1));
                                                      const r = o.id,
                                                          i = Date.now(),
                                                          c = C.get(r);
                                                      if (c && i - c.timestamp < 3e3)
                                                          return c.isAlive
                                                              ? void s({ success: !0 })
                                                              : void (await n(t + 1));
                                                      chrome.runtime.sendMessage(
                                                          {
                                                              type: "MAIN_TAB_ACK_REQUEST",
                                                              secondaryTabId: e,
                                                              mainTabId: r,
                                                              timestamp: i,
                                                          },
                                                          async (e) => {
                                                              const a = e?.success ?? !1;
                                                              C.set(r, { timestamp: i, isAlive: a }),
                                                                  a ? s({ success: !0 }) : await n(t + 1);
                                                          }
                                                      );
                                                  };
                                              await n(0);
                                          } catch (i) {
                                              s({ success: !1 });
                                          }
                                      else s({ success: !1 });
                                  })()
                                : "DISMISS_STATIC_INDICATOR_FOR_GROUP" === e.type &&
                                  (async () => {
                                      const e = t.tab?.id;
                                      if (e)
                                          try {
                                              const t = (await chrome.tabs.get(e)).groupId;
                                              if (void 0 === t || t === chrome.tabGroups.TAB_GROUP_ID_NONE)
                                                  return void s({ success: !1 });
                                              await l.initialize(),
                                                  await l.dismissStaticIndicatorsForGroup(t),
                                                  s({ success: !0 });
                                          } catch (i) {
                                              s({ success: !1 });
                                          }
                                      else s({ success: !1 });
                                  })();
                } else
                    try {
                        await (async function () {
                            if (chrome.offscreen)
                                try {
                                    try {
                                        await chrome.offscreen.closeDocument();
                                    } catch {}
                                    await chrome.offscreen.createDocument({
                                        url: "offscreen.html",
                                        reasons: [chrome.offscreen.Reason.AUDIO_PLAYBACK],
                                        justification: "Play notification sounds when user is on different tab",
                                    });
                                } catch (i) {
                                    throw i;
                                }
                        })(),
                            await chrome.runtime.sendMessage({
                                type: "PLAY_NOTIFICATION_SOUND",
                                audioUrl: e.audioUrl,
                                volume: e.volume || 0.5,
                            }),
                            s({ success: !0 });
                    } catch (i) {
                        s({ success: !1, error: i.message });
                    }
            })(),
            !0
        )
    ),
    chrome.tabs.onRemoved.addListener(async (e) => {
        await l.handleTabClosed(e);
    }),
    chrome.webNavigation.onBeforeNavigate.addListener(async (e) => {
        0 === e.frameId && (await R(e.url, e.tabId));
    }),
    chrome.alarms.onAlarm.addListener(async (e) => {
        if (e.name.startsWith("prompt_"))
            try {
                const n = e.name,
                    o = await chrome.storage.local.get(["savedPrompts"]),
                    r = (o.savedPrompts || []).find((e) => e.id === n);
                if (r) {
                    const e = `${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
                    let o = null;
                    try {
                        const t = {
                            id: r.id,
                            name: r.command || "Scheduled Task",
                            prompt: r.prompt,
                            url: r.url,
                            enabled: !0,
                            skipPermissions: !1 !== r.skipPermissions,
                            model: r.model,
                        };
                        await $(t, e);
                    } catch (t) {
                        o = t instanceof Error ? t : new Error(String(t));
                        try {
                            await chrome.notifications.create({
                                type: "basic",
                                iconUrl: "/icon-128.png",
                                title: "Scheduled Task Failed",
                                message: `Task "${r.command || "Scheduled Task"}" failed to execute. ${o.message}`,
                                priority: 2,
                            });
                        } catch (a) {}
                    }
                    if ("monthly" === r.repeatType || "annually" === r.repeatType)
                        try {
                            const { SavedPromptsService: e } = await i(async () => {
                                const { SavedPromptsService: e } = await import("./permissions-DQjjgS8V.js").then(
                                    (e) => e.K
                                );
                                return { SavedPromptsService: e };
                            }, []);
                            await e.updateAlarmForPrompt(r);
                        } catch (t) {
                            const e = `retry_${n}`;
                            try {
                                await chrome.alarms.create(e, { delayInMinutes: 1 });
                            } catch (s) {}
                            try {
                                await chrome.notifications.create({
                                    type: "basic",
                                    iconUrl: "/icon-128.png",
                                    title: "Scheduled Task Setup Failed",
                                    message: `Failed to schedule next occurrence of "${r.command || "Scheduled Task"}". Please check the task settings.`,
                                    priority: 2,
                                });
                            } catch (a) {}
                        }
                }
            } catch (t) {}
        else if (e.name.startsWith("retry_"))
            try {
                const s = e.name.replace("retry_", ""),
                    n = await chrome.storage.local.get(["savedPrompts"]),
                    o = (n.savedPrompts || []).find((e) => e.id === s);
                if (o && ("monthly" === o.repeatType || "annually" === o.repeatType))
                    try {
                        const { SavedPromptsService: e } = await i(async () => {
                            const { SavedPromptsService: e } = await import("./permissions-DQjjgS8V.js").then(
                                (e) => e.K
                            );
                            return { SavedPromptsService: e };
                        }, []);
                        await e.updateAlarmForPrompt(o);
                    } catch (t) {
                        try {
                            await chrome.notifications.create({
                                type: "basic",
                                iconUrl: "/icon-128.png",
                                title: "Scheduled Task Needs Attention",
                                message: `Could not automatically reschedule "${o.command || "Scheduled Task"}". Please edit the task to reschedule it.`,
                                priority: 2,
                            });
                        } catch (a) {}
                    }
            } catch (t) {}
    }),
    chrome.runtime.onMessageExternal.addListener(
        (e, t, a) => (
            (async () => {
                if ("oauth_redirect" === e.type) {
                    const s = await c(e.redirect_uri, t?.tab?.id);
                    a(s), s.success && P();
                } else
                    "ping" === e.type
                        ? a({ success: !0, exists: !0 })
                        : "onboarding_task" === e.type &&
                          (chrome.runtime.sendMessage({ type: "POPULATE_INPUT_TEXT", prompt: e.payload?.prompt }),
                          a({ success: !0 }));
            })(),
            !0
        )
    );
