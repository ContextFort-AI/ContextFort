try {
    let p =
            typeof window < "u"
                ? window
                : typeof global < "u"
                  ? global
                  : typeof globalThis < "u"
                    ? globalThis
                    : typeof self < "u"
                      ? self
                      : {},
        h = new p.Error().stack;
    h &&
        ((p._sentryDebugIds = p._sentryDebugIds || {}),
        (p._sentryDebugIds[h] = "4e58c72c-0802-48c6-8f49-2a18adfe28e0"),
        (p._sentryDebugIdIdentifier = "sentry-dbid-4e58c72c-0802-48c6-8f49-2a18adfe28e0"));
} catch {}
(function () {
    "use strict";
    const p = "npclhjbddhklpbnacpjloidibaggcgon",
        h = "pplx-agent-",
        A = `${h}0_0-overlay-stop-button`;
    function w(...e) {}
    function T(e) {
        return chrome.runtime.sendMessage(p, e);
    }
    const D = (e) => e.hostname === "docs.google.com",
        O = `${h}0_0-overlay`,
        R = `${h}0_0-overlay-base`;
    async function q(e, t = !1, n = !1) {
        if (document.getElementById(O)) return;
        const i = (m, f) => {
                Object.assign(m.style, f);
            },
            c = document.createElement("div");
        c.id = O;
        const u = document.createElement("div");
        (u.id = R),
            i(c, {
                position: "fixed",
                inset: "-1.25em",
                border: "solid",
                borderWidth: "2.5em",
                borderColor: "initial",
                borderImage: "var(--pplx-overlay-gradient)",
                filter: "blur(24px)",
                zIndex: "2147483645",
                pointerEvents: "none",
                opacity: "0",
                transition: "opacity 1000ms cubic-bezier(0.4, 0, 0.2, 1)",
                willChange: "opacity, transform",
            }),
            i(u, {
                position: "fixed",
                inset: "0",
                zIndex: "2147483646",
                padding: "24px",
                opacity: "0.4",
                boxShadow: "var(--base-shadow)",
                pointerEvents: "none",
            });
        const d = document.createElement("style");
        d.textContent = `
        @property --a {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        @keyframes a {
          to { --a: 1turn }
        }
      `;
        const s = document.createElement("div");
        s.className = "indicator";
        const r = document.createElement("div");
        r.className = "indicator-play";
        const l = document.createElement("button");
        (l.id = A), l.setAttribute("aria-hidden", "true");
        let y = t;
        const _ = () => {
            (c.style.visibility = y ? "hidden" : "visible"),
                (l.textContent = y ? "Resume Comet Assistant" : "Pause Comet Assistant"),
                l.querySelectorAll(".indicator, .indicator-play").forEach((m) => m.remove()),
                l.prepend(y ? r : s),
                (u.style.opacity = "0.4");
        };
        _(),
            (l.onclick = async (m) => {
                m.stopPropagation(), m.preventDefault();
                const f = await T({ type: "BROWSER_TASK_PAUSE_RESUME", payload: { sidecarTabId: e } });
                f?.success && ((y = f.response?.is_paused ?? !1), _());
            }),
            n || document.body.appendChild(l),
            document.body.appendChild(u),
            c.appendChild(d),
            document.body.appendChild(c),
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    (c.style.opacity = "0.95"),
                        setTimeout(() => {
                            c.style.animation = "a 1250ms linear infinite";
                        }, 400);
                });
            });
    }
    function X() {
        const e = document.getElementById(O),
            t = document.getElementById(R);
        e &&
            ((e.style.opacity = "0"),
            setTimeout(() => {
                e.remove();
            }, 500)),
            t && t.remove(),
            document.getElementById(A)?.remove();
    }
    chrome.runtime.onMessage.addListener((e) => {
        if (e.type === "START_OVERLAY") {
            q(e.payload.sidecarTabId, e.payload.isPaused, e.payload.simpleMode);
            return;
        }
        if (e.type === "STOP_OVERLAY") {
            X();
            return;
        }
    });
    const B = "content-script-overlay",
        j = "content-script-selection-box",
        z = "content-script-selection-box-outline",
        H = "content-script-overlay-instructions";
    async function K() {
        const e = document.createElement("div");
        (e.id = B),
            (e.className =
                "agi-fixed agi-top-0 agi-left-0 agi-w-full agi-h-full agi-z-[1000] agi-bg-[rgba(0,0,0,0.5)] agi-flex agi-justify-center agi-items-center agi-pointer-events-auto"),
            (e.style.fontFamily = "FKGroteskNeue"),
            document.body.appendChild(e);
        const t = document.createElement("div");
        return (
            (t.className = "agi-relative agi-bg-black agi-p-6 agi-rounded-md agi-text-white agi-z-[1001]"),
            (t.id = H),
            (t.textContent = "Click or drag to take a screenshot"),
            e.appendChild(t),
            {
                overlay: e,
                cleanup: () => {
                    document.getElementById(B) && document.body.removeChild(e);
                },
            }
        );
    }
    function W(e) {
        const t = document.createElement("div");
        (t.id = j), (t.className = "agi-fixed agi-border-super agi-z-[1001] agi-bg-white"), e.appendChild(t);
        const n = document.createElement("div");
        return (
            (n.id = z),
            (n.className = "agi-fixed agi-z-[1002] agi-shadow-[0_0_0_1px_white]"),
            document.body.appendChild(n),
            {
                selectionBox: t,
                selectionBoxOutline: n,
                cleanup: () => {
                    document.body.contains(n) && document.body.removeChild(n);
                },
            }
        );
    }
    function J(e) {
        return new Promise((t) => {
            const n = new Image();
            (n.src = e), (n.onload = () => t(n));
        });
    }
    async function Q(e, t) {
        const n = await J(e),
            o = window.devicePixelRatio || 1,
            i = document.createElement("canvas");
        return (
            (i.width = t.width * o),
            (i.height = t.height * o),
            i
                .getContext("2d")
                ?.drawImage(n, t.x * o, t.y * o, t.width * o, t.height * o, 0, 0, t.width * o, t.height * o),
            i.toDataURL("image/png")
        );
    }
    function Z() {
        const e = document.documentElement.style.overflow,
            t = document.body.style.overflow,
            n = document.body.style.cursor;
        (document.documentElement.style.overflow = ""),
            (document.body.style.overflow = ""),
            document.documentElement.classList.add("entropy-content-script");
        const i = `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-camera"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 7h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2" /><path d="M9 13a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" /></svg>')}`;
        return (
            (document.body.style.cursor = `url("${i}"), auto`),
            () => {
                (document.documentElement.style.overflow = e),
                    (document.body.style.overflow = t),
                    (document.body.style.cursor = n),
                    document.documentElement.classList.remove("entropy-content-script");
            }
        );
    }
    async function ee(e) {
        let t = !1,
            n,
            o,
            i,
            c;
        const u = Z(),
            { overlay: d, cleanup: s } = await K(),
            { selectionBox: r, selectionBoxOutline: l, cleanup: y } = W(d);
        function _() {
            T({ type: "CAPTURE_FULL_SCREENSHOT", payload: { sidecarTabId: e } });
        }
        function m(a) {
            a.key === "Escape" && I();
        }
        function f(a) {
            a.button === 0 &&
                ((t = !0),
                (n = a.clientX),
                (o = a.clientY),
                (r.style.display = "block"),
                (l.style.display = "block"),
                (d.style.cursor = "crosshair"),
                (d.style.mixBlendMode = "multiply"),
                $(a));
        }
        function F(a) {
            t && $(a);
        }
        function $(a) {
            if (n == null || o == null) return;
            (i = a.clientX), (c = a.clientY);
            const E = Math.min(n, i),
                L = Math.min(o, c),
                S = Math.abs(i - n),
                Y = Math.abs(c - o);
            Object.assign(r.style, { left: `${E}px`, top: `${L}px`, width: `${S}px`, height: `${Y}px` }),
                Object.assign(l.style, { left: `${E}px`, top: `${L}px`, width: `${S}px`, height: `${Y}px` });
        }
        async function V() {
            try {
                if (n == null || o == null || i == null || c == null || (n === i && o === c)) {
                    _();
                    return;
                }
                const a = { x: Math.min(n, i), y: Math.min(o, c), width: Math.abs(i - n), height: Math.abs(c - o) },
                    E = await T({ type: "CAPTURE_VISIBLE_TAB", payload: { sidecarTabId: e } });
                if (E.error) {
                    w("Error capturing visible tab", E.error);
                    return;
                }
                const { screenshot: L } = E?.response ?? { screenshot: "" };
                w("Cropping screenshot", a);
                const S = await Q(L, a);
                w("Sending cropped screenshot to background script", S),
                    T({ type: "CAPTURE_PARTIAL_SCREENSHOT", payload: { screenshot: S, sidecarTabId: e } });
            } finally {
                I();
            }
        }
        function G() {
            (t = !1), (n = void 0), (o = void 0), (i = void 0), (c = void 0);
        }
        d.addEventListener("mousedown", f),
            window.addEventListener("mousemove", F),
            window.addEventListener("mouseup", V),
            window.addEventListener("keyup", m),
            window.addEventListener("mouseleave", G);
        function I() {
            (t = !1),
                (n = void 0),
                (o = void 0),
                (i = void 0),
                (c = void 0),
                (d.style.mixBlendMode = ""),
                u(),
                s(),
                y(),
                window.removeEventListener("keyup", m),
                window.removeEventListener("mousemove", F),
                window.removeEventListener("mouseup", V),
                d.removeEventListener("mousedown", f),
                window.removeEventListener("mouseleave", G);
        }
        return { cleanup: I };
    }
    const v = {
        canvasTileText: ".kix-canvas-tile-text",
        canvasTileSelection: ".kix-canvas-tile-selection",
        iframe: ".docs-texteventtarget-iframe",
        documentContent: 'div[aria-label="Document content"]',
    };
    let N = "",
        b = null,
        g = null,
        C = null;
    function M() {
        const e = document.querySelector(v.iframe);
        if (!e) return "";
        const n = (e.contentDocument ?? e.contentWindow?.document)?.querySelector(v.documentContent);
        n?.dispatchEvent(new Event("copy"));
        const o = n?.firstChild?.children ?? [];
        return Array.from(o, (i) => i.innerText).join(`
`);
    }
    function te() {
        const e = M().trim();
        return e ? { text: e, html: `<p>${e}</p>`, url: window.location.href, timestamp: Date.now() } : null;
    }
    function ne() {
        const e = M();
        N !== e && ((N = e), C?.());
    }
    function k() {
        const e = document.querySelectorAll(v.canvasTileSelection);
        e.length !== 0 &&
            (b?.disconnect(),
            (b = new MutationObserver(ne)),
            e.forEach((t) => {
                b?.observe(t, { childList: !0, subtree: !0 });
            }));
    }
    function oe(e) {
        (C = e), U();
    }
    function ie() {
        b?.disconnect(), g?.disconnect(), (b = null), (g = null), (C = null);
    }
    let x = null;
    function U() {
        const e = document.querySelectorAll(v.canvasTileText),
            t = document.querySelectorAll(v.canvasTileSelection);
        if (e.length > 0 || t.length > 0) {
            k();
            return;
        }
        if (!document.body) {
            x = setTimeout(() => U(), 300);
            return;
        }
        x && (clearTimeout(x), (x = null)),
            (g = new MutationObserver(() => {
                const n = document.querySelectorAll(v.canvasTileText),
                    o = document.querySelectorAll(v.canvasTileSelection);
                (n.length > 0 || o.length > 0) && (g?.disconnect(), (g = null), k());
            })),
            g.observe(document.body, { childList: !0, subtree: !0 });
    }
    const ce = 150;
    function P() {
        const e = D(new URL(window.location.href));
        let t = !0,
            n = null;
        function o() {
            t &&
                (n && clearTimeout(n),
                (n = setTimeout(() => {
                    i();
                }, ce)));
        }
        function i() {
            let s = null;
            if (e) s = te();
            else {
                const r = window.getSelection();
                if (!r || r.isCollapsed) {
                    chrome.runtime
                        .sendMessage({ type: "USER_SELECTION_CAPTURED", payload: { selection: null } })
                        .catch((l) => {});
                    return;
                }
                s = c(r);
            }
            s && w("User selection detected:", { text: s.text.substring(0, 50) + "...", url: s.url }),
                chrome.runtime
                    .sendMessage({ type: "USER_SELECTION_CAPTURED", payload: { selection: s } })
                    .catch((r) => {});
        }
        function c(s) {
            try {
                const r = s.getRangeAt(0),
                    l = document.createElement("div"),
                    y = r.cloneContents();
                return (
                    l.appendChild(y),
                    { text: s.toString().trim(), html: l.innerHTML, url: window.location.href, timestamp: Date.now() }
                );
            } catch {
                return null;
            }
        }
        function u() {
            setTimeout(() => {
                t && o();
            }, 10);
        }
        function d(s) {
            ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Shift"].includes(s.key) && o();
        }
        return (
            e && oe(o),
            document.addEventListener("selectionchange", o),
            document.addEventListener("mouseup", u),
            document.addEventListener("keyup", d),
            w("Selection tool activated", D(new URL(window.location.href)) ? "(Google docs mode)" : ""),
            {
                cleanup: () => {
                    (t = !1),
                        n && (clearTimeout(n), (n = null)),
                        e && ie(),
                        document.removeEventListener("selectionchange", o),
                        document.removeEventListener("mouseup", u),
                        document.removeEventListener("keyup", d);
                },
            }
        );
    }
    window.__PPLX_CONTENT_SCRIPT__ = (function () {
        let t, n;
        return {
            setupScreenshotTool: async (o) => {
                try {
                    t?.cleanup();
                } catch {}
                t = await ee(o);
            },
            deactivateScreenshotTool: () => {
                t?.cleanup(), (t = void 0);
            },
            setupSelectionTool: async () => {
                try {
                    n?.cleanup();
                } catch {}
                n = P();
            },
            deactivateSelectionTool: () => {
                n?.cleanup(), (n = void 0);
            },
        };
    })();
    async function se() {
        try {
            P();
        } catch {}
    }
    se();
})();
//# sourceMappingURL=content.js.map
