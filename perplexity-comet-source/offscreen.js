try {
    let Be =
            typeof window < "u"
                ? window
                : typeof global < "u"
                  ? global
                  : typeof globalThis < "u"
                    ? globalThis
                    : typeof self < "u"
                      ? self
                      : {},
        ee = new Be.Error().stack;
    ee &&
        ((Be._sentryDebugIds = Be._sentryDebugIds || {}),
        (Be._sentryDebugIds[ee] = "af977790-ea39-48b5-a789-889b8b5e97fe"),
        (Be._sentryDebugIdIdentifier = "sentry-dbid-af977790-ea39-48b5-a789-889b8b5e97fe"));
} catch {}
(function (Be) {
    typeof define == "function" && define.amd ? define(Be) : Be();
})(function () {
    "use strict";
    const Be = "0.0.169",
        ee = { log: "log", debug: "debug", info: "info", warn: "warn", error: "error" },
        Xe = console,
        Bt = {};
    Object.keys(ee).forEach((e) => {
        Bt[e] = Xe[e];
    });
    const Gn = "Datadog Browser SDK:",
        I = {
            debug: Bt.debug.bind(Xe, Gn),
            log: Bt.log.bind(Xe, Gn),
            info: Bt.info.bind(Xe, Gn),
            warn: Bt.warn.bind(Xe, Gn),
            error: Bt.error.bind(Xe, Gn),
        },
        Ar = "https://docs.datadoghq.com",
        Yd = `${Ar}/real_user_monitoring/browser/troubleshooting`,
        $i = "More details:";
    function Vo(e, t) {
        return (...n) => {
            try {
                return e(...n);
            } catch (r) {
                I.error(t, r);
            }
        };
    }
    function Tt(e) {
        return e !== 0 && Math.random() * 100 <= e;
    }
    function jn(e, t) {
        return +e.toFixed(t);
    }
    function Xd(e) {
        return Wn(e) && e >= 0 && e <= 100;
    }
    function Wn(e) {
        return typeof e == "number";
    }
    const ue = 1e3,
        me = 60 * ue,
        zo = 60 * me,
        Ho = 365 * (24 * zo);
    function Kn(e) {
        return { relative: e, timeStamp: Zd(e) };
    }
    function Jd(e) {
        return { relative: Rr(e), timeStamp: e };
    }
    function Zd(e) {
        const t = ge() - performance.now();
        return t > qn() ? Math.round(mn(t, e)) : Qd(e);
    }
    function Go() {
        return Math.round(ge() - mn(qn(), performance.now()));
    }
    function O(e) {
        return Wn(e) ? jn(e * 1e6, 0) : e;
    }
    function ge() {
        return new Date().getTime();
    }
    function $() {
        return ge();
    }
    function Ce() {
        return performance.now();
    }
    function ne() {
        return { relative: Ce(), timeStamp: $() };
    }
    function Bi() {
        return { relative: 0, timeStamp: qn() };
    }
    function Q(e, t) {
        return t - e;
    }
    function mn(e, t) {
        return e + t;
    }
    function Rr(e) {
        return e - qn();
    }
    function Qd(e) {
        return Math.round(mn(qn(), e));
    }
    function ef(e) {
        return e < Ho;
    }
    let Vi;
    function qn() {
        var e, t;
        return (
            Vi === void 0 &&
                (Vi =
                    (t = (e = performance.timing) === null || e === void 0 ? void 0 : e.navigationStart) !== null &&
                    t !== void 0
                        ? t
                        : performance.timeOrigin),
            Vi
        );
    }
    const Vt = 1024,
        jo = 1024 * Vt,
        tf = /[^\u0000-\u007F]/;
    function Wo(e) {
        return tf.test(e)
            ? window.TextEncoder !== void 0
                ? new TextEncoder().encode(e).length
                : new Blob([e]).size
            : e.length;
    }
    function nf(e) {
        const t = e.reduce((i, s) => i + s.length, 0),
            n = new Uint8Array(t);
        let r = 0;
        for (const i of e) n.set(i, r), (r += i.length);
        return n;
    }
    function Yn(e) {
        return { ...e };
    }
    function Cr(e, t) {
        return Object.keys(e).some((n) => e[n] === t);
    }
    function zt(e) {
        return Object.keys(e).length === 0;
    }
    function Ko(e, t) {
        const n = {};
        for (const r of Object.keys(e)) n[r] = t(e[r]);
        return n;
    }
    function Ee() {
        if (typeof globalThis == "object") return globalThis;
        Object.defineProperty(Object.prototype, "_dd_temp_", {
            get() {
                return this;
            },
            configurable: !0,
        });
        let e = _dd_temp_;
        return (
            delete Object.prototype._dd_temp_,
            typeof e != "object" &&
                (typeof self == "object" ? (e = self) : typeof window == "object" ? (e = window) : (e = {})),
            e
        );
    }
    const Ve = Ee(),
        Ht = "WorkerGlobalScope" in Ve;
    function It(e, t) {
        const n = Ee();
        let r;
        return n.Zone && typeof n.Zone.__symbol__ == "function" && (r = e[n.Zone.__symbol__(t)]), r || (r = e[t]), r;
    }
    let kr,
        qo = !1;
    function rf(e) {
        kr = e;
    }
    function sf(e) {
        qo = e;
    }
    function of(e, t, n) {
        const r = n.value;
        n.value = function (...i) {
            return (kr ? S(r) : r).apply(this, i);
        };
    }
    function S(e) {
        return function () {
            return ut(e, this, arguments);
        };
    }
    function ut(e, t, n) {
        try {
            return e.apply(t, n);
        } catch (r) {
            ze(r);
        }
    }
    function ze(e) {
        if ((zi(e), kr))
            try {
                kr(e);
            } catch (t) {
                zi(t);
            }
    }
    function zi(...e) {
        qo && I.error("[MONITOR]", ...e);
    }
    function ae(e, t) {
        return It(Ee(), "setTimeout")(S(e), t);
    }
    function Se(e) {
        It(Ee(), "clearTimeout")(e);
    }
    function gn(e, t) {
        return It(Ee(), "setInterval")(S(e), t);
    }
    function xr(e) {
        It(Ee(), "clearInterval")(e);
    }
    function Yo(e) {
        var t;
        const n = (t = Ve.queueMicrotask) === null || t === void 0 ? void 0 : t.bind(Ve);
        typeof n == "function" ? n(S(e)) : Promise.resolve().then(S(e));
    }
    class D {
        constructor(t) {
            (this.onFirstSubscribe = t), (this.observers = []);
        }
        subscribe(t) {
            return this.addObserver(t), { unsubscribe: () => this.removeObserver(t) };
        }
        notify(t) {
            this.observers.forEach((n) => n(t));
        }
        addObserver(t) {
            this.observers.push(t),
                this.observers.length === 1 &&
                    this.onFirstSubscribe &&
                    (this.onLastUnsubscribe = this.onFirstSubscribe(this) || void 0);
        }
        removeObserver(t) {
            (this.observers = this.observers.filter((n) => t !== n)),
                !this.observers.length && this.onLastUnsubscribe && this.onLastUnsubscribe();
        }
    }
    function Xo(...e) {
        return new D((t) => {
            const n = e.map((r) => r.subscribe((i) => t.notify(i)));
            return () => n.forEach((r) => r.unsubscribe());
        });
    }
    class Jo extends D {
        constructor(t) {
            super(), (this.maxBufferSize = t), (this.buffer = []);
        }
        notify(t) {
            this.buffer.push(t), this.buffer.length > this.maxBufferSize && this.buffer.shift(), super.notify(t);
        }
        subscribe(t) {
            let n = !1;
            const r = {
                unsubscribe: () => {
                    (n = !0), this.removeObserver(t);
                },
            };
            return (
                Yo(() => {
                    for (const i of this.buffer) {
                        if (n) return;
                        t(i);
                    }
                    n || this.addObserver(t);
                }),
                r
            );
        }
        unbuffer() {
            Yo(() => {
                this.maxBufferSize = this.buffer.length = 0;
            });
        }
    }
    function At(e, t, n) {
        const r = n && n.leading !== void 0 ? n.leading : !0,
            i = n && n.trailing !== void 0 ? n.trailing : !0;
        let s = !1,
            o,
            a;
        return {
            throttled: (...c) => {
                if (s) {
                    o = c;
                    return;
                }
                r ? e(...c) : (o = c),
                    (s = !0),
                    (a = ae(() => {
                        i && o && e(...o), (s = !1), (o = void 0);
                    }, t));
            },
            cancel: () => {
                Se(a), (s = !1), (o = void 0);
            },
        };
    }
    function N() {}
    function de(e) {
        return e
            ? (parseInt(e, 10) ^ ((Math.random() * 16) >> (parseInt(e, 10) / 4))).toString(16)
            : `10000000-1000-4000-8000-${1e11}`.replace(/[018]/g, de);
    }
    const Or = /([\w-]+)\s*=\s*([^;]+)/g;
    function Xn(e, t) {
        for (Or.lastIndex = 0; ; ) {
            const n = Or.exec(e);
            if (n) {
                if (n[1] === t) return n[2];
            } else break;
        }
    }
    function af(e) {
        const t = new Map();
        for (Or.lastIndex = 0; ; ) {
            const n = Or.exec(e);
            if (n) t.set(n[1], n[2]);
            else break;
        }
        return t;
    }
    function Hi(e, t, n = "") {
        const r = e.charCodeAt(t - 1),
            s = r >= 55296 && r <= 56319 ? t + 1 : t;
        return e.length <= s ? e : `${e.slice(0, s)}${n}`;
    }
    function cf() {
        return Zo() === 0;
    }
    function uf() {
        return Zo() === 1;
    }
    let Nr;
    function Zo() {
        return Nr ?? (Nr = lf());
    }
    function lf(e = window) {
        var t;
        const n = e.navigator.userAgent;
        return e.chrome || /HeadlessChrome/.test(n)
            ? 0
            : ((t = e.navigator.vendor) === null || t === void 0 ? void 0 : t.indexOf("Apple")) === 0 ||
                (/safari/i.test(n) && !/chrome|android/i.test(n))
              ? 1
              : 2;
    }
    function Gi(e) {
        return Jn(e, location.href).href;
    }
    function df(e) {
        try {
            return !!Jn(e);
        } catch {
            return !1;
        }
    }
    function ff(e) {
        const t = Jn(e).pathname;
        return t[0] === "/" ? t : `/${t}`;
    }
    function Jn(e, t) {
        const { URL: n } = pf();
        try {
            return t !== void 0 ? new n(e, t) : new n(e);
        } catch (r) {
            throw new Error(`Failed to construct URL: ${String(r)}`);
        }
    }
    let ji;
    function pf() {
        if (!ji) {
            let e, t;
            try {
                (e = document.createElement("iframe")),
                    (e.style.display = "none"),
                    document.body.appendChild(e),
                    (t = e.contentWindow);
            } catch {
                t = Ve;
            }
            (ji = { URL: t.URL }), e?.remove();
        }
        return ji;
    }
    function Lr(e, t, n = 0, r) {
        const i = new Date();
        i.setTime(i.getTime() + n);
        const s = `expires=${i.toUTCString()}`,
            o = r && r.crossSite ? "none" : "strict",
            a = r && r.domain ? `;domain=${r.domain}` : "",
            c = r && r.secure ? ";secure" : "",
            u = r && r.partitioned ? ";partitioned" : "";
        document.cookie = `${e}=${t};${s};path=/;samesite=${o}${a}${c}${u}`;
    }
    function Mr(e) {
        return Xn(document.cookie, e);
    }
    let Wi;
    function Rt(e) {
        return Wi || (Wi = af(document.cookie)), Wi.get(e);
    }
    function Qo(e, t) {
        Lr(e, "", 0, t);
    }
    function hf(e) {
        if (document.cookie === void 0 || document.cookie === null) return !1;
        try {
            const t = `dd_cookie_test_${de()}`,
                n = "test";
            Lr(t, n, me, e);
            const r = Mr(t) === n;
            return Qo(t, e), r;
        } catch (t) {
            return I.error(t), !1;
        }
    }
    let Ki;
    function ea(e = location.hostname, t = document.referrer) {
        if (Ki === void 0) {
            const n = mf(e, t);
            if (n) {
                const r = `dd_site_test_${de()}`,
                    i = "test",
                    s = n.split(".");
                let o = s.pop();
                for (; s.length && !Mr(r); ) (o = `${s.pop()}.${o}`), Lr(r, i, ue, { domain: o });
                Qo(r, { domain: o }), (Ki = o);
            }
        }
        return Ki;
    }
    function mf(e, t) {
        try {
            return e || Jn(t).hostname;
        } catch {}
    }
    const Ct = "_dd_s";
    function ta(e, t) {
        for (let n = e.length - 1; n >= 0; n -= 1) {
            const r = e[n];
            if (t(r, n, e)) return r;
        }
    }
    function Dr(e) {
        return Object.values(e);
    }
    function qi(e) {
        return Object.entries(e);
    }
    const Gt = 4 * zo,
        na = 15 * me,
        gf = Ho,
        ra = "0",
        Zn = { COOKIE: "cookie", LOCAL_STORAGE: "local-storage" },
        ia = /^([a-zA-Z]+)=([a-z0-9-]+)$/,
        Yi = "&";
    function _f(e) {
        return !!e && (e.indexOf(Yi) !== -1 || ia.test(e));
    }
    const bf = "1";
    function jt(e, t) {
        const n = { isExpired: bf };
        return t.trackAnonymousUser && (e?.anonymousId ? (n.anonymousId = e?.anonymousId) : (n.anonymousId = de())), n;
    }
    function Pr(e) {
        return zt(e);
    }
    function sa(e) {
        return !Pr(e);
    }
    function Qn(e) {
        return e.isExpired !== void 0 || !yf(e);
    }
    function yf(e) {
        return (
            (e.created === void 0 || ge() - Number(e.created) < Gt) && (e.expire === void 0 || ge() < Number(e.expire))
        );
    }
    function oa(e) {
        e.expire = String(ge() + na);
    }
    function aa(e) {
        return qi(e)
            .map(([t, n]) => (t === "anonymousId" ? `aid=${n}` : `${t}=${n}`))
            .join(Yi);
    }
    function Xi(e) {
        const t = {};
        return (
            _f(e) &&
                e.split(Yi).forEach((n) => {
                    const r = ia.exec(n);
                    if (r !== null) {
                        const [, i, s] = r;
                        i === "aid" ? (t.anonymousId = s) : (t[i] = s);
                    }
                }),
            t
        );
    }
    const Ef = "_dd",
        Sf = "_dd_r",
        vf = "_dd_l",
        wf = "rum",
        Tf = "logs";
    function If(e) {
        if (!Rt(Ct)) {
            const n = Rt(Ef),
                r = Rt(Sf),
                i = Rt(vf),
                s = {};
            n && (s.id = n),
                i && /^[01]$/.test(i) && (s[Tf] = i),
                r && /^[012]$/.test(r) && (s[wf] = r),
                sa(s) && (oa(s), e.persistSession(s));
        }
    }
    function ca(e) {
        const t = Rf(e);
        return t && hf(t) ? { type: Zn.COOKIE, cookieOptions: t } : void 0;
    }
    function Af(e, t) {
        const n = {
            isLockEnabled: cf(),
            persistSession: (r) => ua(t, e, r, na),
            retrieveSession: la,
            expireSession: (r) => ua(t, e, jt(r, e), Gt),
        };
        return If(n), n;
    }
    function ua(e, t, n, r) {
        Lr(Ct, aa(n), t.trackAnonymousUser ? gf : r, e);
    }
    function la() {
        const e = Mr(Ct);
        return Xi(e);
    }
    function Rf(e) {
        const t = {};
        if (
            ((t.secure = !!e.useSecureSessionCookie || !!e.usePartitionedCrossSiteSessionCookie),
            (t.crossSite = !!e.usePartitionedCrossSiteSessionCookie),
            (t.partitioned = !!e.usePartitionedCrossSiteSessionCookie),
            e.trackSessionAcrossSubdomains)
        ) {
            const n = ea();
            if (!n) return;
            t.domain = n;
        }
        return t;
    }
    const Cf = "_dd_test_";
    function da() {
        try {
            const e = de(),
                t = `${Cf}${e}`;
            localStorage.setItem(t, e);
            const n = localStorage.getItem(t);
            return localStorage.removeItem(t), e === n ? { type: Zn.LOCAL_STORAGE } : void 0;
        } catch {
            return;
        }
    }
    function kf(e) {
        return { isLockEnabled: !1, persistSession: fa, retrieveSession: xf, expireSession: (t) => Of(t, e) };
    }
    function fa(e) {
        localStorage.setItem(Ct, aa(e));
    }
    function xf() {
        const e = localStorage.getItem(Ct);
        return Xi(e);
    }
    function Of(e, t) {
        fa(jt(e, t));
    }
    const Nf = 10,
        Lf = 100,
        Mf = ue,
        pa = "--",
        ha = [];
    let Ur;
    function Wt(e, t, n = 0) {
        var r;
        const { isLockEnabled: i, persistSession: s, expireSession: o } = t,
            a = (d) => s({ ...d, lock: u }),
            c = () => {
                const { lock: d, ...p } = t.retrieveSession();
                return { session: p, lock: d && !Pf(d) ? d : void 0 };
            };
        if ((Ur || (Ur = e), e !== Ur)) {
            ha.push(e);
            return;
        }
        if (i && n >= Lf) {
            ma(t);
            return;
        }
        let u,
            f = c();
        if (i) {
            if (f.lock) {
                Fr(e, t, n);
                return;
            }
            if (((u = Df()), a(f.session), (f = c()), f.lock !== u)) {
                Fr(e, t, n);
                return;
            }
        }
        let l = e.process(f.session);
        if (i && ((f = c()), f.lock !== u)) {
            Fr(e, t, n);
            return;
        }
        if ((l && (Qn(l) ? o(l) : (oa(l), i ? a(l) : s(l))), i && !(l && Qn(l)))) {
            if (((f = c()), f.lock !== u)) {
                Fr(e, t, n);
                return;
            }
            s(f.session), (l = f.session);
        }
        (r = e.after) === null || r === void 0 || r.call(e, l || f.session), ma(t);
    }
    function Fr(e, t, n) {
        ae(() => {
            Wt(e, t, n + 1);
        }, Nf);
    }
    function ma(e) {
        Ur = void 0;
        const t = ha.shift();
        t && Wt(t, e);
    }
    function Df() {
        return de() + pa + $();
    }
    function Pf(e) {
        const [, t] = e.split(pa);
        return !t || Q(Number(t), $()) > Mf;
    }
    const ga = ue;
    function Uf(e) {
        switch (e.sessionPersistence) {
            case Zn.COOKIE:
                return ca(e);
            case Zn.LOCAL_STORAGE:
                return da();
            case void 0: {
                let t = ca(e);
                return !t && e.allowFallbackToLocalStorage && (t = da()), t;
            }
            default:
                I.error(`Invalid session persistence '${String(e.sessionPersistence)}'`);
        }
    }
    function Ff(e, t) {
        return e.type === Zn.COOKIE ? Af(t, e.cookieOptions) : kf(t);
    }
    function $f(e, t, n, r, i = Ff(e, t)) {
        const s = new D(),
            o = new D(),
            a = new D(),
            c = gn(p, ga);
        let u;
        m();
        const { throttled: f, cancel: l } = At(() => {
            Wt(
                {
                    process: (_) => {
                        if (Pr(_)) return;
                        const M = h(_);
                        return g(M), M;
                    },
                    after: (_) => {
                        sa(_) && !w() && y(_), (u = _);
                    },
                },
                i
            );
        }, ga);
        function d() {
            Wt({ process: (_) => (w() ? h(_) : void 0) }, i);
        }
        function p() {
            const _ = i.retrieveSession();
            Qn(_) ? Wt({ process: (M) => (Qn(M) ? jt(M, t) : void 0), after: h }, i) : h(_);
        }
        function h(_) {
            return (
                Qn(_) && (_ = jt(_, t)), w() && (b(_) ? E() : (a.notify({ previousState: u, newState: _ }), (u = _))), _
            );
        }
        function m() {
            Wt(
                {
                    process: (_) => {
                        if (Pr(_)) return jt(_, t);
                    },
                    after: (_) => {
                        u = _;
                    },
                },
                i
            );
        }
        function g(_) {
            if (Pr(_)) return !1;
            const M = r(_[n]);
            (_[n] = M), delete _.isExpired, M !== ra && !_.id && ((_.id = de()), (_.created = String(ge())));
        }
        function w() {
            return u?.[n] !== void 0;
        }
        function b(_) {
            return u.id !== _.id || u[n] !== _[n];
        }
        function E() {
            (u = jt(u, t)), o.notify();
        }
        function y(_) {
            (u = _), s.notify();
        }
        function T(_) {
            Wt({ process: (M) => ({ ...M, ..._ }), after: h }, i);
        }
        return {
            expandOrRenewSession: f,
            expandSession: d,
            getSession: () => u,
            renewObservable: s,
            expireObservable: o,
            sessionStateUpdateObservable: a,
            restartSession: m,
            expire: () => {
                l(), i.expireSession(u), h(jt(u, t));
            },
            stop: () => {
                xr(c);
            },
            updateSessionState: T,
        };
    }
    const Ji = { GRANTED: "granted", NOT_GRANTED: "not-granted" };
    function _a(e) {
        const t = new D();
        return {
            tryToInit(n) {
                e || (e = n);
            },
            update(n) {
                (e = n), t.notify();
            },
            isGranted() {
                return e === Ji.GRANTED;
            },
            observable: t,
        };
    }
    function Kt(e) {
        return e === null ? "null" : Array.isArray(e) ? "array" : typeof e;
    }
    function er(e) {
        const t = Kt(e);
        return t === "string" || t === "function" || e instanceof RegExp;
    }
    function $r(e, t, n = !1) {
        return e.some((r) => {
            try {
                if (typeof r == "function") return r(t);
                if (r instanceof RegExp) return r.test(t);
                if (typeof r == "string") return n ? t.startsWith(r) : r === t;
            } catch (i) {
                I.error(i);
            }
            return !1;
        });
    }
    const ba = ["chrome-extension://", "moz-extension://"];
    function ya(e) {
        return ba.some((t) => e.includes(t));
    }
    function Bf(e, t = "") {
        if (ya(e)) return !1;
        const r =
            t
                .split(
                    `
`
                )
                .filter((i) => {
                    const s = i.trim();
                    return s.length && /^at\s+|@/.test(s);
                })[1] || "";
        return ya(r);
    }
    function Vf(e = "") {
        for (const t of ba) {
            const n = e.match(new RegExp(`${t}[^/]+`));
            if (n) return n[0];
        }
    }
    function tr(e, t, n) {
        if (typeof e != "object" || e === null) return JSON.stringify(e);
        const r = _n(Object.prototype),
            i = _n(Array.prototype),
            s = _n(Object.getPrototypeOf(e)),
            o = _n(e);
        try {
            return JSON.stringify(e, t, n);
        } catch {
            return "<error: unable to serialize object>";
        } finally {
            r(), i(), s(), o();
        }
    }
    function _n(e) {
        const t = e,
            n = t.toJSON;
        return n
            ? (delete t.toJSON,
              () => {
                  t.toJSON = n;
              })
            : N;
    }
    const zf = 220 * Vt,
        Hf = "$",
        Gf = 3;
    function j(e, t = zf) {
        const n = _n(Object.prototype),
            r = _n(Array.prototype),
            i = [],
            s = new WeakMap(),
            o = Zi(e, Hf, void 0, i, s),
            a = JSON.stringify(o);
        let c = a ? a.length : 0;
        if (c > t) {
            es(t, "discarded", e);
            return;
        }
        for (; i.length > 0 && c < t; ) {
            const u = i.shift();
            let f = 0;
            if (Array.isArray(u.source))
                for (let l = 0; l < u.source.length; l++) {
                    const d = Zi(u.source[l], u.path, l, i, s);
                    if ((d !== void 0 ? (c += JSON.stringify(d).length) : (c += 4), (c += f), (f = 1), c > t)) {
                        es(t, "truncated", e);
                        break;
                    }
                    u.target[l] = d;
                }
            else
                for (const l in u.source)
                    if (Object.prototype.hasOwnProperty.call(u.source, l)) {
                        const d = Zi(u.source[l], u.path, l, i, s);
                        if ((d !== void 0 && ((c += JSON.stringify(d).length + f + l.length + Gf), (f = 1)), c > t)) {
                            es(t, "truncated", e);
                            break;
                        }
                        u.target[l] = d;
                    }
        }
        return n(), r(), o;
    }
    function Zi(e, t, n, r, i) {
        const s = Kf(e);
        if (!s || typeof s != "object") return jf(s);
        const o = Qi(s);
        if (o !== "[Object]" && o !== "[Array]" && o !== "[Error]") return o;
        const a = e;
        if (i.has(a)) return `[Reference seen at ${i.get(a)}]`;
        const c = n !== void 0 ? `${t}.${n}` : t,
            u = Array.isArray(s) ? [] : {};
        return i.set(a, c), r.push({ source: s, target: u, path: c }), u;
    }
    function jf(e) {
        return typeof e == "bigint"
            ? `[BigInt] ${e.toString()}`
            : typeof e == "function"
              ? `[Function] ${e.name || "unknown"}`
              : typeof e == "symbol"
                ? `[Symbol] ${e.description || e.toString()}`
                : e;
    }
    function Qi(e) {
        try {
            if (e instanceof Event) return Wf(e);
            if (e instanceof RegExp) return `[RegExp] ${e.toString()}`;
            const n = Object.prototype.toString.call(e).match(/\[object (.*)\]/);
            if (n && n[1]) return `[${n[1]}]`;
        } catch {}
        return "[Unserializable]";
    }
    function Wf(e) {
        return {
            type: e.type,
            isTrusted: e.isTrusted,
            currentTarget: e.currentTarget ? Qi(e.currentTarget) : null,
            target: e.target ? Qi(e.target) : null,
        };
    }
    function Kf(e) {
        const t = e;
        if (t && typeof t.toJSON == "function")
            try {
                return t.toJSON();
            } catch {}
        return e;
    }
    function es(e, t, n) {
        I.warn(`The data provided has been ${t} as it is over the limit of ${e} characters:`, n);
    }
    const bn = "?";
    function yn(e) {
        var t, n;
        const r = [];
        let i = ts(e, "stack");
        const s = String(e);
        if (
            (i && i.startsWith(s) && (i = i.slice(s.length)),
            i &&
                i
                    .split(
                        `
`
                    )
                    .forEach((o) => {
                        const a = Xf(o) || Zf(o) || ep(o) || rp(o);
                        a && (!a.func && a.line && (a.func = bn), r.push(a));
                    }),
            r.length > 0 && ap() && e instanceof Error)
        ) {
            const o = [];
            let a = e;
            for (; (a = Object.getPrototypeOf(a)) && Sa(a); ) {
                const c = ((t = a.constructor) === null || t === void 0 ? void 0 : t.name) || bn;
                o.push(c);
            }
            for (let c = o.length - 1; c >= 0 && ((n = r[0]) === null || n === void 0 ? void 0 : n.func) === o[c]; c--)
                r.shift();
        }
        return { message: ts(e, "message"), name: ts(e, "name"), stack: r };
    }
    const Ea =
            "((?:file|https?|blob|chrome-extension|electron|native|eval|webpack|snippet|<anonymous>|\\w+\\.|\\/).*?)",
        En = "(?::(\\d+))",
        qf = new RegExp(`^\\s*at (.*?) ?\\(${Ea}${En}?${En}?\\)?\\s*$`, "i"),
        Yf = new RegExp(`\\((\\S*)${En}${En}\\)`);
    function Xf(e) {
        const t = qf.exec(e);
        if (!t) return;
        const n = t[2] && t[2].indexOf("native") === 0,
            r = t[2] && t[2].indexOf("eval") === 0,
            i = Yf.exec(t[2]);
        return (
            r && i && ((t[2] = i[1]), (t[3] = i[2]), (t[4] = i[3])),
            {
                args: n ? [t[2]] : [],
                column: t[4] ? +t[4] : void 0,
                func: t[1] || bn,
                line: t[3] ? +t[3] : void 0,
                url: n ? void 0 : t[2],
            }
        );
    }
    const Jf = new RegExp(`^\\s*at ?${Ea}${En}?${En}??\\s*$`, "i");
    function Zf(e) {
        const t = Jf.exec(e);
        if (t) return { args: [], column: t[3] ? +t[3] : void 0, func: bn, line: t[2] ? +t[2] : void 0, url: t[1] };
    }
    const Qf =
        /^\s*at (?:((?:\[object object\])?.+) )?\(?((?:file|ms-appx|https?|webpack|blob):.*?):(\d+)(?::(\d+))?\)?\s*$/i;
    function ep(e) {
        const t = Qf.exec(e);
        if (t) return { args: [], column: t[4] ? +t[4] : void 0, func: t[1] || bn, line: +t[3], url: t[2] };
    }
    const tp =
            /^\s*(.*?)(?:\((.*?)\))?(?:(?:(?:^|@)((?:file|https?|blob|chrome|webpack|resource|capacitor|\[native).*?|[^@]*bundle|\[wasm code\])(?::(\d+))?(?::(\d+))?)|@)\s*$/i,
        np = /(\S+) line (\d+)(?: > eval line \d+)* > eval/i;
    function rp(e) {
        const t = tp.exec(e);
        if (!t) return;
        const n = t[3] && t[3].indexOf(" > eval") > -1,
            r = np.exec(t[3]);
        return (
            n && r && ((t[3] = r[1]), (t[4] = r[2]), (t[5] = void 0)),
            {
                args: t[2] ? t[2].split(",") : [],
                column: t[5] ? +t[5] : void 0,
                func: t[1] || bn,
                line: t[4] ? +t[4] : void 0,
                url: t[3],
            }
        );
    }
    function ts(e, t) {
        if (typeof e != "object" || !e || !(t in e)) return;
        const n = e[t];
        return typeof n == "string" ? n : void 0;
    }
    function ip(e, t, n, r) {
        if (t === void 0) return;
        const { name: i, message: s } = op(e);
        return { name: i, message: s, stack: [{ url: t, column: r, line: n }] };
    }
    const sp =
        /^(?:[Uu]ncaught (?:exception: )?)?(?:((?:Eval|Internal|Range|Reference|Syntax|Type|URI|)Error): )?([\s\S]*)$/;
    function op(e) {
        let t, n;
        return {}.toString.call(e) === "[object String]" && ([, t, n] = sp.exec(e)), { name: t, message: n };
    }
    function Sa(e) {
        return String(e.constructor).startsWith("class ");
    }
    let Br;
    function ap() {
        if (Br !== void 0) return Br;
        class e extends Error {
            constructor() {
                super(), (this.name = "Error");
            }
        }
        const [t, n] = [e, Error].map((r) => new r());
        return (Br = Sa(Object.getPrototypeOf(t)) && n.stack !== t.stack), Br;
    }
    function Sn(e) {
        const n = new Error(e);
        n.name = "HandlingStack";
        let r;
        return (
            ut(() => {
                const i = yn(n);
                (i.stack = i.stack.slice(2)), (r = vn(i));
            }),
            r
        );
    }
    function vn(e) {
        let t = va(e);
        return (
            e.stack.forEach((n) => {
                const r = n.func === "?" ? "<anonymous>" : n.func,
                    i = n.args && n.args.length > 0 ? `(${n.args.join(", ")})` : "",
                    s = n.line ? `:${n.line}` : "",
                    o = n.line && n.column ? `:${n.column}` : "";
                t += `
  at ${r}${i} @ ${n.url}${s}${o}`;
            }),
            t
        );
    }
    function va(e) {
        return `${e.name || "Error"}: ${e.message}`;
    }
    const wa = "No stack, consider using an instance of Error";
    function Vr({
        stackTrace: e,
        originalError: t,
        handlingStack: n,
        componentStack: r,
        startClocks: i,
        nonErrorPrefix: s,
        useFallbackStack: o = !0,
        source: a,
        handling: c,
    }) {
        const u = qt(t);
        return (
            !e && u && (e = yn(t)),
            {
                startClocks: i,
                source: a,
                handling: c,
                handlingStack: n,
                componentStack: r,
                originalError: t,
                type: e ? e.name : void 0,
                message: cp(e, u, s, t),
                stack: e ? vn(e) : o ? wa : void 0,
                causes: u ? fp(t, a) : void 0,
                fingerprint: up(t),
                context: lp(t),
            }
        );
    }
    function cp(e, t, n, r) {
        return e?.message && e?.name ? e.message : t ? "Empty message" : `${n} ${tr(j(r))}`;
    }
    function up(e) {
        return qt(e) && "dd_fingerprint" in e ? String(e.dd_fingerprint) : void 0;
    }
    function lp(e) {
        if (e !== null && typeof e == "object" && "dd_context" in e) return e.dd_context;
    }
    function dp(e) {
        var t;
        return (t = /@ (.+)/.exec(e)) === null || t === void 0 ? void 0 : t[1];
    }
    function qt(e) {
        return e instanceof Error || Object.prototype.toString.call(e) === "[object Error]";
    }
    function fp(e, t) {
        let n = e;
        const r = [];
        for (; qt(n?.cause) && r.length < 10; ) {
            const i = yn(n.cause);
            r.push({ message: n.cause.message, source: t, type: i?.name, stack: i && vn(i) }), (n = n.cause);
        }
        return r.length ? r : void 0;
    }
    var lt;
    (function (e) {
        (e.TRACK_INTAKE_REQUESTS = "track_intake_requests"),
            (e.WRITABLE_RESOURCE_GRAPHQL = "writable_resource_graphql"),
            (e.USE_TREE_WALKER_FOR_ACTION_NAME = "use_tree_walker_for_action_name"),
            (e.GRAPHQL_TRACKING = "graphql_tracking"),
            (e.FEATURE_OPERATION_VITAL = "feature_operation_vital"),
            (e.SHORT_SESSION_INVESTIGATION = "short_session_investigation");
    })(lt || (lt = {}));
    const ns = new Set();
    function Ta(e) {
        Array.isArray(e) && pp(e.filter((t) => Cr(lt, t)));
    }
    function pp(e) {
        e.forEach((t) => {
            ns.add(t);
        });
    }
    function wn(e) {
        return ns.has(e);
    }
    function hp() {
        return ns;
    }
    const mp = 200;
    function zr(e) {
        const { env: t, service: n, version: r, datacenter: i, sdkVersion: s, variant: o } = e,
            a = [Yt("sdk_version", s ?? "6.21.2")];
        return (
            t && a.push(Yt("env", t)),
            n && a.push(Yt("service", n)),
            r && a.push(Yt("version", r)),
            i && a.push(Yt("datacenter", i)),
            o && a.push(Yt("variant", o)),
            a
        );
    }
    function Yt(e, t) {
        const n = t ? `${e}:${t}` : e;
        return (
            (n.length > mp || gp(n)) &&
                I.warn(
                    `Tag ${n} doesn't meet tag requirements and will be sanitized. ${$i} ${Ar}/getting_started/tagging/#defining-tags`
                ),
            Ia(n)
        );
    }
    function Ia(e) {
        return e.replace(/,/g, "_");
    }
    function gp(e) {
        return _p() ? new RegExp("[^\\p{Ll}\\p{Lo}0-9_:./-]", "u").test(e) : !1;
    }
    function _p() {
        try {
            return new RegExp("[\\p{Ll}]", "u"), !0;
        } catch {
            return !1;
        }
    }
    const Aa = "datad0g.com",
        bp = "dd0g-gov.com",
        Xt = "datadoghq.com",
        yp = "datadoghq.eu",
        Ep = "ddog-gov.com",
        Sp = "pci.browser-intake-datadoghq.com",
        vp = ["ddsource", "dd-api-key", "dd-request-id"];
    function Hr(e, t) {
        const n = Ve.__ddBrowserSdkExtensionCallback;
        n && n({ type: e, payload: t });
    }
    function Gr(e, t, n = wp()) {
        if (t === void 0) return e;
        if (typeof t != "object" || t === null) return t;
        if (t instanceof Date) return new Date(t.getTime());
        if (t instanceof RegExp) {
            const i =
                t.flags ||
                [
                    t.global ? "g" : "",
                    t.ignoreCase ? "i" : "",
                    t.multiline ? "m" : "",
                    t.sticky ? "y" : "",
                    t.unicode ? "u" : "",
                ].join("");
            return new RegExp(t.source, i);
        }
        if (n.hasAlreadyBeenSeen(t)) return;
        if (Array.isArray(t)) {
            const i = Array.isArray(e) ? e : [];
            for (let s = 0; s < t.length; ++s) i[s] = Gr(i[s], t[s], n);
            return i;
        }
        const r = Kt(e) === "object" ? e : {};
        for (const i in t) Object.prototype.hasOwnProperty.call(t, i) && (r[i] = Gr(r[i], t[i], n));
        return r;
    }
    function jr(e) {
        return Gr(void 0, e);
    }
    function Oe(...e) {
        let t;
        for (const n of e) n != null && (t = Gr(t, n));
        return t;
    }
    function wp() {
        if (typeof WeakSet < "u") {
            const t = new WeakSet();
            return {
                hasAlreadyBeenSeen(n) {
                    const r = t.has(n);
                    return r || t.add(n), r;
                },
            };
        }
        const e = [];
        return {
            hasAlreadyBeenSeen(t) {
                const n = e.indexOf(t) >= 0;
                return n || e.push(t), n;
            },
        };
    }
    function Ra() {
        var e;
        const t = Ve.navigator;
        return {
            status: t.onLine ? "connected" : "not_connected",
            interfaces: t.connection && t.connection.type ? [t.connection.type] : void 0,
            effective_type: (e = t.connection) === null || e === void 0 ? void 0 : e.effectiveType,
        };
    }
    function Ca(e) {
        return e >= 500;
    }
    function ka(e) {
        try {
            return e.clone();
        } catch {
            return;
        }
    }
    const ve = {
            AGENT: "agent",
            CONSOLE: "console",
            CUSTOM: "custom",
            LOGGER: "logger",
            NETWORK: "network",
            SOURCE: "source",
            REPORT: "report",
        },
        Tp = 80 * Vt,
        Ip = 32,
        xa = 20 * jo,
        Ap = me,
        Oa = ue;
    function Na(e, t, n, r, i, s) {
        t.transportStatus === 0 && t.queuedPayloads.size() === 0 && t.bandwidthMonitor.canHandle(e)
            ? Ma(e, t, n, s, {
                  onSuccess: () => Da(0, t, n, r, i, s),
                  onFailure: () => {
                      t.queuedPayloads.enqueue(e) ||
                          s.notify({ type: "queue-full", bandwidth: t.bandwidthMonitor.stats(), payload: e }),
                          La(t, n, r, i, s);
                  },
              })
            : t.queuedPayloads.enqueue(e) ||
              s.notify({ type: "queue-full", bandwidth: t.bandwidthMonitor.stats(), payload: e });
    }
    function La(e, t, n, r, i) {
        e.transportStatus === 2 &&
            ae(() => {
                const s = e.queuedPayloads.first();
                Ma(s, e, t, i, {
                    onSuccess: () => {
                        e.queuedPayloads.dequeue(), (e.currentBackoffTime = Oa), Da(1, e, t, n, r, i);
                    },
                    onFailure: () => {
                        (e.currentBackoffTime = Math.min(Ap, e.currentBackoffTime * 2)), La(e, t, n, r, i);
                    },
                });
            }, e.currentBackoffTime);
    }
    function Ma(e, t, n, r, { onSuccess: i, onFailure: s }) {
        t.bandwidthMonitor.add(e),
            n(e, (o) => {
                t.bandwidthMonitor.remove(e),
                    Rp(o)
                        ? ((t.transportStatus = t.bandwidthMonitor.ongoingRequestCount > 0 ? 1 : 2),
                          (e.retry = { count: e.retry ? e.retry.count + 1 : 1, lastFailureStatus: o.status }),
                          r.notify({ type: "failure", bandwidth: t.bandwidthMonitor.stats(), payload: e }),
                          s())
                        : ((t.transportStatus = 0),
                          r.notify({ type: "success", bandwidth: t.bandwidthMonitor.stats(), payload: e }),
                          i());
            });
    }
    function Da(e, t, n, r, i, s) {
        e === 0 &&
            t.queuedPayloads.isFull() &&
            !t.queueFullReported &&
            (i({
                message: `Reached max ${r} events size queued for upload: ${xa / jo}MiB`,
                source: ve.AGENT,
                startClocks: ne(),
            }),
            (t.queueFullReported = !0));
        const o = t.queuedPayloads;
        for (t.queuedPayloads = Pa(); o.size() > 0; ) Na(o.dequeue(), t, n, r, i, s);
    }
    function Rp(e) {
        return (
            e.type !== "opaque" &&
            ((e.status === 0 && !navigator.onLine) || e.status === 408 || e.status === 429 || Ca(e.status))
        );
    }
    function Cp() {
        return {
            transportStatus: 0,
            currentBackoffTime: Oa,
            bandwidthMonitor: kp(),
            queuedPayloads: Pa(),
            queueFullReported: !1,
        };
    }
    function Pa() {
        const e = [];
        return {
            bytesCount: 0,
            enqueue(t) {
                return this.isFull() ? !1 : (e.push(t), (this.bytesCount += t.bytesCount), !0);
            },
            first() {
                return e[0];
            },
            dequeue() {
                const t = e.shift();
                return t && (this.bytesCount -= t.bytesCount), t;
            },
            size() {
                return e.length;
            },
            isFull() {
                return this.bytesCount >= xa;
            },
        };
    }
    function kp() {
        return {
            ongoingRequestCount: 0,
            ongoingByteCount: 0,
            canHandle(e) {
                return (
                    this.ongoingRequestCount === 0 ||
                    (this.ongoingByteCount + e.bytesCount <= Tp && this.ongoingRequestCount < Ip)
                );
            },
            add(e) {
                (this.ongoingRequestCount += 1), (this.ongoingByteCount += e.bytesCount);
            },
            remove(e) {
                (this.ongoingRequestCount -= 1), (this.ongoingByteCount -= e.bytesCount);
            },
            stats() {
                return { ongoingByteCount: this.ongoingByteCount, ongoingRequestCount: this.ongoingRequestCount };
            },
        };
    }
    function Wr(e, t, n) {
        const r = new D(),
            i = Cp();
        return {
            observable: r,
            send: (s) => {
                for (const o of e) Na(s, i, (a, c) => Np(o, t, a, c), o.trackType, n, r);
            },
            sendOnExit: (s) => {
                for (const o of e) xp(o, t, s);
            },
        };
    }
    function xp(e, t, n) {
        if (!!navigator.sendBeacon && n.bytesCount < t)
            try {
                const i = e.build("beacon", n);
                if (navigator.sendBeacon(i, n.data)) return;
            } catch (i) {
                Op(i);
            }
        rs(e, n);
    }
    let Ua = !1;
    function Op(e) {
        Ua || ((Ua = !0), ze(e));
    }
    function Np(e, t, n, r) {
        if (Lp() && n.bytesCount < t) {
            const s = e.build("fetch-keepalive", n);
            fetch(s, { method: "POST", body: n.data, keepalive: !0, mode: "cors" })
                .then(S((o) => r?.({ status: o.status, type: o.type })))
                .catch(S(() => rs(e, n, r)));
        } else rs(e, n, r);
    }
    function rs(e, t, n) {
        const r = e.build("fetch", t);
        fetch(r, { method: "POST", body: t.data, mode: "cors" })
            .then(S((i) => n?.({ status: i.status, type: i.type })))
            .catch(S(() => n?.({ status: 0 })));
    }
    function Lp() {
        try {
            return window.Request && "keepalive" in new Request("http://a");
        } catch {
            return !1;
        }
    }
    function Jt() {
        const e = Mp();
        if (e)
            return {
                getCapabilities() {
                    var t;
                    return JSON.parse(((t = e.getCapabilities) === null || t === void 0 ? void 0 : t.call(e)) || "[]");
                },
                getPrivacyLevel() {
                    var t;
                    return (t = e.getPrivacyLevel) === null || t === void 0 ? void 0 : t.call(e);
                },
                getAllowedWebViewHosts() {
                    return JSON.parse(e.getAllowedWebViewHosts());
                },
                send(t, n, r) {
                    const i = r ? { id: r } : void 0;
                    e.send(JSON.stringify({ eventType: t, event: n, view: i }));
                },
            };
    }
    function Fa(e) {
        const t = Jt();
        return !!t && t.getCapabilities().includes(e);
    }
    function Je(e) {
        var t;
        e === void 0 && (e = (t = Ee().location) === null || t === void 0 ? void 0 : t.hostname);
        const n = Jt();
        return !!n && n.getAllowedWebViewHosts().some((r) => e === r || e.endsWith(`.${r}`));
    }
    function Mp() {
        return Ee().DatadogEventBridge;
    }
    function J(e, t, n, r, i) {
        return we(e, t, [n], r, i);
    }
    function we(e, t, n, r, { once: i, capture: s, passive: o } = {}) {
        const a = S((d) => {
                (!d.isTrusted && !d.__ddIsTrusted && !e.allowUntrustedEvents) || (i && l(), r(d));
            }),
            c = o ? { capture: s, passive: o } : s,
            u = window.EventTarget && t instanceof EventTarget ? window.EventTarget.prototype : t,
            f = It(u, "addEventListener");
        n.forEach((d) => f.call(t, d, a, c));
        function l() {
            const d = It(u, "removeEventListener");
            n.forEach((p) => d.call(t, p, a, c));
        }
        return { stop: l };
    }
    const Tn = {
        HIDDEN: "visibility_hidden",
        UNLOADING: "before_unload",
        PAGEHIDE: "page_hide",
        FROZEN: "page_frozen",
    };
    function $a(e) {
        return new D((t) => {
            const { stop: n } = we(
                    e,
                    window,
                    ["visibilitychange", "freeze"],
                    (i) => {
                        i.type === "visibilitychange" && document.visibilityState === "hidden"
                            ? t.notify({ reason: Tn.HIDDEN })
                            : i.type === "freeze" && t.notify({ reason: Tn.FROZEN });
                    },
                    { capture: !0 }
                ),
                r = J(e, window, "beforeunload", () => {
                    t.notify({ reason: Tn.UNLOADING });
                }).stop;
            return () => {
                n(), r();
            };
        });
    }
    function Ba(e) {
        return Dr(Tn).includes(e);
    }
    function is({ encoder: e, request: t, flushController: n, messageBytesLimit: r }) {
        let i = {};
        const s = n.flushObservable.subscribe((l) => f(l));
        function o(l, d, p) {
            n.notifyBeforeAddMessage(d),
                p !== void 0
                    ? ((i[p] = l), n.notifyAfterAddMessage())
                    : e.write(
                          e.isEmpty
                              ? l
                              : `
${l}`,
                          (h) => {
                              n.notifyAfterAddMessage(h - d);
                          }
                      );
        }
        function a(l) {
            return l !== void 0 && i[l] !== void 0;
        }
        function c(l) {
            const d = i[l];
            delete i[l];
            const p = e.estimateEncodedBytesCount(d);
            n.notifyAfterRemoveMessage(p);
        }
        function u(l, d) {
            const p = tr(l),
                h = e.estimateEncodedBytesCount(p);
            if (h >= r) {
                I.warn(
                    `Discarded a message whose size was bigger than the maximum allowed size ${r}KB. ${$i} ${Yd}/#technical-limitations`
                );
                return;
            }
            a(d) && c(d), o(p, h, d);
        }
        function f(l) {
            const d = Dr(i).join(`
`);
            i = {};
            const p = Ba(l.reason),
                h = p ? t.sendOnExit : t.send;
            if (p && e.isAsync) {
                const m = e.finishSync();
                m.outputBytesCount && h(Va(m));
                const g = [m.pendingData, d].filter(Boolean).join(`
`);
                g && h({ data: g, bytesCount: Wo(g) });
            } else
                d &&
                    e.write(
                        e.isEmpty
                            ? d
                            : `
${d}`
                    ),
                    e.finish((m) => {
                        h(Va(m));
                    });
        }
        return { flushController: n, add: u, upsert: u, stop: s.unsubscribe };
    }
    function Va(e) {
        let t;
        return (
            typeof e.output == "string" ? (t = e.output) : (t = new Blob([e.output], { type: "text/plain" })),
            { data: t, bytesCount: e.outputBytesCount, encoding: e.encoding }
        );
    }
    function ss({
        messagesLimit: e,
        bytesLimit: t,
        durationLimit: n,
        pageMayExitObservable: r,
        sessionExpireObservable: i,
    }) {
        const s = r.subscribe((h) => f(h.reason)),
            o = i.subscribe(() => f("session_expire")),
            a = new D(() => () => {
                s.unsubscribe(), o.unsubscribe();
            });
        let c = 0,
            u = 0;
        function f(h) {
            if (u === 0) return;
            const m = u,
                g = c;
            (u = 0), (c = 0), p(), a.notify({ reason: h, messagesCount: m, bytesCount: g });
        }
        let l;
        function d() {
            l === void 0 &&
                (l = ae(() => {
                    f("duration_limit");
                }, n));
        }
        function p() {
            Se(l), (l = void 0);
        }
        return {
            flushObservable: a,
            get messagesCount() {
                return u;
            },
            notifyBeforeAddMessage(h) {
                c + h >= t && f("bytes_limit"), (u += 1), (c += h), d();
            },
            notifyAfterAddMessage(h = 0) {
                (c += h), u >= e ? f("messages_limit") : c >= t && f("bytes_limit");
            },
            notifyAfterRemoveMessage(h) {
                (c -= h), (u -= 1), u === 0 && p();
            },
        };
    }
    const He = "DISCARDED",
        le = "SKIPPED";
    function za() {
        const e = {};
        return {
            register(t, n) {
                return (
                    e[t] || (e[t] = []),
                    e[t].push(n),
                    {
                        unregister: () => {
                            e[t] = e[t].filter((r) => r !== n);
                        },
                    }
                );
            },
            triggerHook(t, n) {
                const r = e[t] || [],
                    i = [];
                for (const s of r) {
                    const o = s(n);
                    if (o === He) return He;
                    o !== le && i.push(o);
                }
                return Oe(...i);
            },
        };
    }
    const kt = { LOG: "log", CONFIGURATION: "configuration", USAGE: "usage" },
        Dp = [
            "https://www.datadoghq-browser-agent.com",
            "https://www.datad0g-browser-agent.com",
            "https://d3uc069fcn7uxw.cloudfront.net",
            "https://d20xtzwzcl0ceb.cloudfront.net",
            "http://localhost",
            "<anonymous>",
        ],
        Pp = 1,
        Up = [Ep];
    let os;
    function In() {
        return os || (os = new Jo(100)), os;
    }
    function Ha(e, t, n, r, i, s) {
        const o = new D(),
            { stop: a } = $p(t, r, i, s, o),
            { enabled: c, metricsEnabled: u } = Fp(e, t, n, o);
        return { stop: a, enabled: c, metricsEnabled: u };
    }
    function Fp(e, t, n, r, i = Pp) {
        const s = {},
            o = !Up.includes(t.site) && Tt(t.telemetrySampleRate),
            a = {
                [kt.LOG]: o,
                [kt.CONFIGURATION]: o && Tt(t.telemetryConfigurationSampleRate),
                [kt.USAGE]: o && Tt(t.telemetryUsageSampleRate),
                metric: o && Tt(i),
            },
            c = Bp(),
            u = In();
        return (
            u.subscribe(({ rawEvent: l, metricName: d }) => {
                if ((d && !a.metric) || !a[l.type]) return;
                const p = d || l.status || l.type;
                let h = s[p];
                if ((h || (h = s[p] = new Set()), h.size >= t.maxTelemetryEventsPerPage)) return;
                const m = tr(l);
                if (h.has(m)) return;
                const g = n.triggerHook(1, { startTime: ne().relative });
                if (g === He) return;
                const w = f(g, e, l, c);
                r.notify(w), Hr("telemetry", w), h.add(m);
            }),
            u.unbuffer(),
            rf(as),
            { enabled: o, metricsEnabled: a.metric }
        );
        function f(l, d, p, h) {
            const g = {
                type: "telemetry",
                date: ne().timeStamp,
                service: d,
                version: "6.21.2",
                source: "browser",
                _dd: { format_version: 2 },
                telemetry: Oe(p, { runtime_env: h, connectivity: Ra(), sdk_setup: "npm" }),
                ddtags: zr(t).join(","),
                experimental_features: Array.from(hp()),
            };
            return Oe(g, l);
        }
    }
    function $p(e, t, n, r, i) {
        const s = [];
        if (Je()) {
            const o = Jt(),
                a = i.subscribe((c) => o.send("internal_telemetry", c));
            s.push(a.unsubscribe);
        } else {
            const o = [e.rumEndpointBuilder];
            e.replica && Vp(e) && o.push(e.replica.rumEndpointBuilder);
            const a = is({
                encoder: r(4),
                request: Wr(o, e.batchBytesLimit, t),
                flushController: ss({
                    messagesLimit: e.batchMessagesLimit,
                    bytesLimit: e.batchBytesLimit,
                    durationLimit: e.flushTimeout,
                    pageMayExitObservable: n,
                    sessionExpireObservable: new D(),
                }),
                messageBytesLimit: e.messageBytesLimit,
            });
            s.push(a.stop);
            const c = i.subscribe(a.add);
            s.push(c.unsubscribe);
        }
        return { stop: () => s.forEach((o) => o()) };
    }
    function Bp() {
        var e;
        return {
            is_local_file: ((e = Ve.location) === null || e === void 0 ? void 0 : e.protocol) === "file:",
            is_worker: Ht,
        };
    }
    function Vp(e) {
        return e.site === Aa;
    }
    function dt(e, t) {
        zi(ee.debug, e, t), In().notify({ rawEvent: { type: kt.LOG, message: e, status: "debug", ...t } });
    }
    function as(e, t) {
        In().notify({ rawEvent: { type: kt.LOG, status: "error", ...zp(e), ...t } });
    }
    function Ga(e) {
        In().notify({ rawEvent: { type: kt.CONFIGURATION, configuration: e } });
    }
    function nr(e, t) {
        In().notify({ rawEvent: { type: kt.LOG, message: e, status: "debug", ...t }, metricName: e });
    }
    function oe(e) {
        In().notify({ rawEvent: { type: kt.USAGE, usage: e } });
    }
    function zp(e) {
        if (qt(e)) {
            const t = yn(e);
            return { error: { kind: t.name, stack: vn(Hp(t)) }, message: t.message };
        }
        return { error: { stack: wa }, message: `Uncaught ${tr(e)}` };
    }
    function Hp(e) {
        return (e.stack = e.stack.filter((t) => !t.url || Dp.some((n) => t.url.startsWith(n)))), e;
    }
    const ja =
            "Running the Browser SDK in a Web extension content script is discouraged and will be forbidden in a future major release unless the `allowedTrackingOrigins` option is provided.",
        Gp = "SDK initialized on a non-allowed domain.";
    function jp(e, t, n = typeof location < "u" ? location.origin : "") {
        const r = e.allowedTrackingOrigins;
        if (!r) {
            if (Bf(n, t)) {
                I.warn(ja);
                const s = Vf(t);
                dt(ja, { extensionUrl: s || "unknown" });
            }
            return !0;
        }
        const i = $r(r, n);
        return i || I.error(Gp), i;
    }
    function Zt(e, t, n) {
        const r = Wp(e, t);
        return {
            build(i, s) {
                const o = Kp(e, t, i, s, n);
                return r(o);
            },
            trackType: t,
        };
    }
    function Wp(e, t) {
        const n = `/api/v2/${t}`,
            r = e.proxy;
        if (typeof r == "string") {
            const s = Gi(r);
            return (o) => `${s}?ddforward=${encodeURIComponent(`${n}?${o}`)}`;
        }
        if (typeof r == "function") return (s) => r({ path: n, parameters: s });
        const i = Wa(t, e);
        return (s) => `https://${i}${n}?${s}`;
    }
    function Wa(e, t) {
        const { site: n = Xt, internalAnalyticsSubdomain: r } = t;
        if (e === "logs" && t.usePciIntake && n === Xt) return Sp;
        if (r && n === Xt) return `${r}.${Xt}`;
        if (n === bp) return `http-intake.logs.${n}`;
        const i = n.split("."),
            s = i.pop();
        return `browser-intake-${i.join("-")}.${s}`;
    }
    function Kp(
        { clientToken: e, internalAnalyticsSubdomain: t, source: n = "browser" },
        r,
        i,
        { retry: s, encoding: o },
        a = []
    ) {
        const c = [
            `ddsource=${n}`,
            `dd-api-key=${e}`,
            `dd-evp-origin-version=${encodeURIComponent("6.21.2")}`,
            "dd-evp-origin=browser",
            `dd-request-id=${de()}`,
        ].concat(a);
        return (
            o && c.push(`dd-evp-encoding=${o}`),
            r === "rum" &&
                (c.push(`batch_time=${$()}`, `_dd.api=${i}`),
                s && c.push(`_dd.retry_count=${s.count}`, `_dd.retry_after=${s.lastFailureStatus}`)),
            t && c.reverse(),
            c.join("&")
        );
    }
    function qp(e) {
        const t = e.site || Xt,
            n = Yp(e.source),
            r = Xp({ ...e, site: t, source: n });
        return { replica: Jp({ ...e, site: t, source: n }), site: t, source: n, ...r };
    }
    function Yp(e) {
        return e === "flutter" || e === "unity" ? e : "browser";
    }
    function Xp(e) {
        return {
            logsEndpointBuilder: Zt(e, "logs"),
            rumEndpointBuilder: Zt(e, "rum"),
            profilingEndpointBuilder: Zt(e, "profile"),
            sessionReplayEndpointBuilder: Zt(e, "replay"),
            exposuresEndpointBuilder: Zt(e, "exposures"),
        };
    }
    function Jp(e) {
        if (!e.replica) return;
        const t = { ...e, site: Xt, clientToken: e.replica.clientToken };
        return {
            logsEndpointBuilder: Zt(t, "logs"),
            rumEndpointBuilder: Zt(t, "rum", [`application.id=${e.replica.applicationId}`]),
        };
    }
    function Ka(e) {
        return vp.every((t) => e.includes(t));
    }
    const An = {
            ALLOW: "allow",
            MASK: "mask",
            MASK_USER_INPUT: "mask-user-input",
            MASK_UNLESS_ALLOWLISTED: "mask-unless-allowlisted",
        },
        cs = { ALL: "all", SAMPLED: "sampled" };
    function us(e, t) {
        return e != null && typeof e != "string" ? (I.error(`${t} must be defined as a string`), !1) : !0;
    }
    function Zp(e) {
        return e && typeof e == "string" && !/(datadog|ddog|datad0g|dd0g)/.test(e)
            ? (I.error(`Site should be a valid Datadog site. ${$i} ${Ar}/getting_started/site/.`), !1)
            : !0;
    }
    function Rn(e, t) {
        return e !== void 0 && !Xd(e) ? (I.error(`${t} Sample Rate should be a number between 0 and 100`), !1) : !0;
    }
    function qa(e, t) {
        var n, r, i, s, o, a, c, u, f, l;
        if (!e || !e.clientToken) {
            I.error("Client Token is not configured, we will not send any data.");
            return;
        }
        if (e.allowedTrackingOrigins !== void 0 && !Array.isArray(e.allowedTrackingOrigins)) {
            I.error("Allowed Tracking Origins must be an array");
            return;
        }
        if (
            !(
                !Zp(e.site) ||
                !Rn(e.sessionSampleRate, "Session") ||
                !Rn(e.telemetrySampleRate, "Telemetry") ||
                !Rn(e.telemetryConfigurationSampleRate, "Telemetry Configuration") ||
                !Rn(e.telemetryUsageSampleRate, "Telemetry Usage") ||
                !us(e.version, "Version") ||
                !us(e.env, "Env") ||
                !us(e.service, "Service") ||
                !jp(e, t ?? "")
            )
        ) {
            if (e.trackingConsent !== void 0 && !Cr(Ji, e.trackingConsent)) {
                I.error('Tracking Consent should be either "granted" or "not-granted"');
                return;
            }
            return {
                beforeSend: e.beforeSend && Vo(e.beforeSend, "beforeSend threw an error:"),
                sessionStoreStrategyType: Ht ? void 0 : Uf(e),
                sessionSampleRate: (n = e.sessionSampleRate) !== null && n !== void 0 ? n : 100,
                telemetrySampleRate: (r = e.telemetrySampleRate) !== null && r !== void 0 ? r : 20,
                telemetryConfigurationSampleRate:
                    (i = e.telemetryConfigurationSampleRate) !== null && i !== void 0 ? i : 5,
                telemetryUsageSampleRate: (s = e.telemetryUsageSampleRate) !== null && s !== void 0 ? s : 5,
                service: (o = e.service) !== null && o !== void 0 ? o : void 0,
                env: (a = e.env) !== null && a !== void 0 ? a : void 0,
                version: (c = e.version) !== null && c !== void 0 ? c : void 0,
                datacenter: (u = e.datacenter) !== null && u !== void 0 ? u : void 0,
                silentMultipleInit: !!e.silentMultipleInit,
                allowUntrustedEvents: !!e.allowUntrustedEvents,
                trackingConsent: (f = e.trackingConsent) !== null && f !== void 0 ? f : Ji.GRANTED,
                trackAnonymousUser: (l = e.trackAnonymousUser) !== null && l !== void 0 ? l : !0,
                storeContextsAcrossPages: !!e.storeContextsAcrossPages,
                batchBytesLimit: 16 * Vt,
                eventRateLimiterThreshold: 3e3,
                maxTelemetryEventsPerPage: 15,
                flushTimeout: 30 * ue,
                batchMessagesLimit: Ht ? 1 : 50,
                messageBytesLimit: 256 * Vt,
                variant: e.variant,
                sdkVersion: e.sdkVersion,
                ...qp(e),
            };
        }
    }
    function Ya(e) {
        return {
            session_sample_rate: e.sessionSampleRate,
            telemetry_sample_rate: e.telemetrySampleRate,
            telemetry_configuration_sample_rate: e.telemetryConfigurationSampleRate,
            telemetry_usage_sample_rate: e.telemetryUsageSampleRate,
            use_before_send: !!e.beforeSend,
            use_partitioned_cross_site_session_cookie: e.usePartitionedCrossSiteSessionCookie,
            use_secure_session_cookie: e.useSecureSessionCookie,
            use_proxy: !!e.proxy,
            silent_multiple_init: e.silentMultipleInit,
            track_session_across_subdomains: e.trackSessionAcrossSubdomains,
            track_anonymous_user: e.trackAnonymousUser,
            session_persistence: e.sessionPersistence,
            allow_fallback_to_local_storage: !!e.allowFallbackToLocalStorage,
            store_contexts_across_pages: !!e.storeContextsAcrossPages,
            allow_untrusted_events: !!e.allowUntrustedEvents,
            tracking_consent: e.trackingConsent,
            use_allowed_tracking_origins: Array.isArray(e.allowedTrackingOrigins),
            source: e.source,
            sdk_version: e.sdkVersion,
            variant: e.variant,
        };
    }
    function Te(e, t, n, { computeHandlingStack: r } = {}) {
        let i = e[t];
        if (typeof i != "function")
            if (t in e && t.startsWith("on")) i = N;
            else return { stop: N };
        let s = !1;
        const o = function () {
            if (s) return i.apply(this, arguments);
            const a = Array.from(arguments);
            let c;
            ut(n, null, [
                {
                    target: this,
                    parameters: a,
                    onPostCall: (f) => {
                        c = f;
                    },
                    handlingStack: r ? Sn("instrumented method") : void 0,
                },
            ]);
            const u = i.apply(this, a);
            return c && ut(c, null, [u]), u;
        };
        return (
            (e[t] = o),
            {
                stop: () => {
                    (s = !0), e[t] === o && (e[t] = i);
                },
            }
        );
    }
    function rr(e, t, n) {
        const r = Object.getOwnPropertyDescriptor(e, t);
        if (!r || !r.set || !r.configurable) return { stop: N };
        const i = N;
        let s = (a, c) => {
            ae(() => {
                s !== i && n(a, c);
            }, 0);
        };
        const o = function (a) {
            r.set.call(this, a), s(this, a);
        };
        return (
            Object.defineProperty(e, t, { set: o }),
            {
                stop: () => {
                    var a;
                    ((a = Object.getOwnPropertyDescriptor(e, t)) === null || a === void 0 ? void 0 : a.set) === o &&
                        Object.defineProperty(e, t, r),
                        (s = i);
                },
            }
        );
    }
    function Qp() {
        return new D((e) => {
            const t = (i, s) => {
                    const o = Vr({
                        stackTrace: s,
                        originalError: i,
                        startClocks: ne(),
                        nonErrorPrefix: "Uncaught",
                        source: ve.SOURCE,
                        handling: "unhandled",
                    });
                    e.notify(o);
                },
                { stop: n } = eh(t),
                { stop: r } = th(t);
            return () => {
                n(), r();
            };
        });
    }
    function eh(e) {
        return Te(Ee(), "onerror", ({ parameters: [t, n, r, i, s] }) => {
            let o;
            qt(s) || (o = ip(t, n, r, i)), e(s ?? t, o);
        });
    }
    function th(e) {
        return Te(Ee(), "onunhandledrejection", ({ parameters: [t] }) => {
            e(t.reason || "Empty reason");
        });
    }
    function Xa(e) {
        const t = {
            version: "6.21.2",
            onReady(n) {
                n();
            },
            ...e,
        };
        return (
            Object.defineProperty(t, "_setDebug", {
                get() {
                    return sf;
                },
                enumerable: !1,
            }),
            t
        );
    }
    function Ja(e, t, n) {
        const r = e[t];
        r &&
            !r.q &&
            r.version &&
            I.warn("SDK is loaded more than once. This is unsupported and might have unexpected behavior."),
            (e[t] = n),
            r && r.q && r.q.forEach((i) => Vo(i, "onReady callback threw an error:")());
    }
    function Kr(e, t) {
        t.silentMultipleInit || I.error(`${e} is already initialized.`);
    }
    const Cn = { intervention: "intervention", deprecation: "deprecation", cspViolation: "csp_violation" };
    function Za(e, t) {
        const n = [];
        t.includes(Cn.cspViolation) && n.push(rh(e));
        const r = t.filter((i) => i !== Cn.cspViolation);
        return r.length && n.push(nh(r)), Xo(...n);
    }
    function nh(e) {
        return new D((t) => {
            if (!window.ReportingObserver) return;
            const n = S((i, s) => i.forEach((o) => t.notify(ih(o)))),
                r = new window.ReportingObserver(n, { types: e, buffered: !0 });
            return (
                r.observe(),
                () => {
                    r.disconnect();
                }
            );
        });
    }
    function rh(e) {
        return new D((t) => {
            const { stop: n } = J(e, document, "securitypolicyviolation", (r) => {
                t.notify(sh(r));
            });
            return n;
        });
    }
    function ih(e) {
        const { type: t, body: n } = e;
        return Qa({
            type: n.id,
            message: `${t}: ${n.message}`,
            originalError: e,
            stack: ec(n.id, n.message, n.sourceFile, n.lineNumber, n.columnNumber),
        });
    }
    function sh(e) {
        const t = `'${e.blockedURI}' blocked by '${e.effectiveDirective}' directive`;
        return Qa({
            type: e.effectiveDirective,
            message: `${Cn.cspViolation}: ${t}`,
            originalError: e,
            csp: { disposition: e.disposition },
            stack: ec(
                e.effectiveDirective,
                e.originalPolicy ? `${t} of the policy "${Hi(e.originalPolicy, 100, "...")}"` : "no policy",
                e.sourceFile,
                e.lineNumber,
                e.columnNumber
            ),
        });
    }
    function Qa(e) {
        return { startClocks: ne(), source: ve.REPORT, handling: "unhandled", ...e };
    }
    function ec(e, t, n, r, i) {
        return n
            ? vn({ name: e, message: t, stack: [{ func: "?", url: n, line: r ?? void 0, column: i ?? void 0 }] })
            : void 0;
    }
    function oh(e) {
        const t = new Set();
        return e.forEach((n) => t.add(n)), Array.from(t);
    }
    function tc(e, t) {
        const n = e.indexOf(t);
        n >= 0 && e.splice(n, 1);
    }
    function ir(e) {
        return Array.isArray(e) && e.length > 0;
    }
    const qr = 1 / 0,
        ah = me;
    let sr = null;
    const Yr = new Set();
    function ch() {
        Yr.forEach((e) => e());
    }
    function kn({ expireDelay: e, maxEntries: t }) {
        let n = [];
        sr || (sr = gn(() => ch(), ah));
        const r = () => {
            const f = Ce() - e;
            for (; n.length > 0 && n[n.length - 1].endTime < f; ) n.pop();
        };
        Yr.add(r);
        function i(f, l) {
            const d = {
                value: f,
                startTime: l,
                endTime: qr,
                remove: () => {
                    tc(n, d);
                },
                close: (p) => {
                    d.endTime = p;
                },
            };
            return t && n.length >= t && n.pop(), n.unshift(d), d;
        }
        function s(f = qr, l = { returnInactive: !1 }) {
            for (const d of n)
                if (d.startTime <= f) {
                    if (l.returnInactive || f <= d.endTime) return d.value;
                    break;
                }
        }
        function o(f) {
            const l = n[0];
            l && l.endTime === qr && l.close(f);
        }
        function a(f = qr, l = 0) {
            const d = mn(f, l);
            return n.filter((p) => p.startTime <= d && f <= p.endTime).map((p) => p.value);
        }
        function c() {
            n = [];
        }
        function u() {
            Yr.delete(r), Yr.size === 0 && sr && (xr(sr), (sr = null));
        }
        return { add: i, find: s, closeActive: o, findAll: a, reset: c, stop: u };
    }
    const uh = "datadog-synthetics-public-id",
        lh = "datadog-synthetics-result-id",
        dh = "datadog-synthetics-injects-rum";
    function Xr() {
        return Ht ? !1 : !!(Ve._DATADOG_SYNTHETICS_INJECTS_RUM || Rt(dh));
    }
    function nc() {
        const e = window._DATADOG_SYNTHETICS_PUBLIC_ID || Rt(uh);
        return typeof e == "string" ? e : void 0;
    }
    function rc() {
        const e = window._DATADOG_SYNTHETICS_RESULT_ID || Rt(lh);
        return typeof e == "string" ? e : void 0;
    }
    function ic() {
        return !!(nc() && rc());
    }
    const fh = me,
        ph = Gt;
    function sc(e, t, n, r) {
        const i = new D(),
            s = new D(),
            o = $f(e.sessionStoreStrategyType, e, t, n),
            a = kn({ expireDelay: ph });
        if (
            (o.renewObservable.subscribe(() => {
                a.add(c(), Ce()), i.notify();
            }),
            o.expireObservable.subscribe(() => {
                s.notify(), a.closeActive(Ce());
            }),
            o.expandOrRenewSession(),
            a.add(c(), Bi().relative),
            wn(lt.SHORT_SESSION_INVESTIGATION))
        ) {
            const u = o.getSession();
            u && bh(e, u);
        }
        r.observable.subscribe(() => {
            r.isGranted() ? o.expandOrRenewSession() : o.expire();
        }),
            hh(e, () => {
                r.isGranted() && o.expandOrRenewSession();
            }),
            mh(e, () => o.expandSession()),
            gh(e, () => o.restartSession());
        function c() {
            const u = o.getSession();
            return u
                ? { id: u.id, trackingType: u[t], isReplayForced: !!u.forcedReplay, anonymousId: u.anonymousId }
                : (_h().catch(() => {}), { id: "invalid", trackingType: ra, isReplayForced: !1, anonymousId: void 0 });
        }
        return {
            findSession: (u, f) => a.find(u, f),
            renewObservable: i,
            expireObservable: s,
            sessionStateUpdateObservable: o.sessionStateUpdateObservable,
            expire: o.expire,
            updateSessionState: o.updateSessionState,
        };
    }
    function hh(e, t) {
        const { stop: n } = we(e, window, ["click", "touchstart", "keydown", "scroll"], t, {
            capture: !0,
            passive: !0,
        });
    }
    function mh(e, t) {
        const n = () => {
                document.visibilityState === "visible" && t();
            },
            { stop: r } = J(e, document, "visibilitychange", n);
        gn(n, fh);
    }
    function gh(e, t) {
        const { stop: n } = J(e, window, "resume", t, { capture: !0 });
    }
    async function _h() {
        const e = la();
        dt("Unexpected session state", {
            session: e,
            isSyntheticsTest: ic(),
            createdTimestamp: e?.created,
            expireTimestamp: e?.expire,
            cookie: await oc(),
            currentDomain: `${window.location.protocol}//${window.location.hostname}`,
        });
    }
    function bh(e, t) {
        if (!window.cookieStore || !t.created) return;
        const n = Number(t.created),
            r = ge(),
            { stop: i } = J(e, cookieStore, "change", s);
        function s(o) {
            const a = ta(o.changed, (u) => u.name === Ct);
            if (!a) return;
            const c = ge() - n;
            if (c > 14 * me) i();
            else {
                const u = Xi(a.value);
                if (u.id && u.id !== t.id) {
                    i();
                    const f = ge() - r;
                    oc()
                        .then((l) => {
                            dt("Session cookie changed", { time: f, session_age: c, old: t, new: u, cookie: l });
                        })
                        .catch(ze);
                }
            }
        }
    }
    async function oc() {
        let e;
        return (
            "cookieStore" in window
                ? (e = await window.cookieStore.getAll(Ct))
                : (e = document.cookie.split(/\s*;\s*/).filter((t) => t.startsWith(Ct))),
            { count: e.length, domain: ea() || "undefined", ...e }
        );
    }
    function ls() {
        let e = "",
            t = 0;
        return {
            isAsync: !1,
            get isEmpty() {
                return !e;
            },
            write(n, r) {
                const i = Wo(n);
                (t += i), (e += n), r && r(i);
            },
            finish(n) {
                n(this.finishSync());
            },
            finishSync() {
                const n = { output: e, outputBytesCount: t, rawBytesCount: t, pendingData: "" };
                return (e = ""), (t = 0), n;
            },
            estimateEncodedBytesCount(n) {
                return n.length;
            },
        };
    }
    class ac {
        constructor() {
            this.callbacks = {};
        }
        notify(t, n) {
            const r = this.callbacks[t];
            r && r.forEach((i) => i(n));
        }
        subscribe(t, n) {
            return (
                this.callbacks[t] || (this.callbacks[t] = []),
                this.callbacks[t].push(n),
                {
                    unsubscribe: () => {
                        this.callbacks[t] = this.callbacks[t].filter((r) => n !== r);
                    },
                }
            );
        }
    }
    function Jr(e, t, n) {
        let r = 0,
            i = !1;
        return {
            isLimitReached() {
                if (
                    (r === 0 &&
                        ae(() => {
                            r = 0;
                        }, me),
                    (r += 1),
                    r <= t || i)
                )
                    return (i = !1), !1;
                if (r === t + 1) {
                    i = !0;
                    try {
                        n({
                            message: `Reached max number of ${e}s by minute: ${t}`,
                            source: ve.AGENT,
                            startClocks: ne(),
                        });
                    } finally {
                        i = !1;
                    }
                }
                return !0;
            },
        };
    }
    function ds(e, t, n) {
        return document.readyState === t || document.readyState === "complete"
            ? (n(), { stop: N })
            : J(e, window, t === "complete" ? "load" : "DOMContentLoaded", n, { once: !0 });
    }
    function yh(e, t) {
        return new Promise((n) => {
            ds(e, t, n);
        });
    }
    let fs;
    const ps = new WeakMap();
    function cc(e) {
        return fs || (fs = Eh(e)), fs;
    }
    function Eh(e) {
        return new D((t) => {
            const { stop: n } = Te(XMLHttpRequest.prototype, "open", Sh),
                { stop: r } = Te(
                    XMLHttpRequest.prototype,
                    "send",
                    (s) => {
                        vh(s, e, t);
                    },
                    { computeHandlingStack: !0 }
                ),
                { stop: i } = Te(XMLHttpRequest.prototype, "abort", wh);
            return () => {
                n(), r(), i();
            };
        });
    }
    function Sh({ target: e, parameters: [t, n] }) {
        ps.set(e, { state: "open", method: String(t).toUpperCase(), url: Gi(String(n)) });
    }
    function vh({ target: e, parameters: [t], handlingStack: n }, r, i) {
        const s = ps.get(e);
        if (!s) return;
        const o = s;
        (o.state = "start"),
            (o.startClocks = ne()),
            (o.isAborted = !1),
            (o.xhr = e),
            (o.handlingStack = n),
            (o.body = t);
        let a = !1;
        const { stop: c } = Te(e, "onreadystatechange", () => {
                e.readyState === XMLHttpRequest.DONE && u();
            }),
            u = () => {
                if ((f(), c(), a)) return;
                a = !0;
                const l = s;
                (l.state = "complete"),
                    (l.duration = Q(o.startClocks.timeStamp, $())),
                    (l.status = e.status),
                    i.notify(Yn(l));
            },
            { stop: f } = J(r, e, "loadend", u);
        i.notify(o);
    }
    function wh({ target: e }) {
        const t = ps.get(e);
        t && (t.isAborted = !0);
    }
    let hs;
    function Zr() {
        return hs || (hs = Th()), hs;
    }
    function Th() {
        return new D((e) => {
            if (!Ve.fetch) return;
            const { stop: t } = Te(Ve, "fetch", (n) => Ih(n, e), { computeHandlingStack: !0 });
            return t;
        });
    }
    function Ih({ parameters: e, onPostCall: t, handlingStack: n }, r) {
        const [i, s] = e;
        let o = s && s.method;
        o === void 0 && i instanceof Request && (o = i.method);
        const a = o !== void 0 ? String(o).toUpperCase() : "GET",
            c = i instanceof Request ? i.url : Gi(String(i)),
            u = ne(),
            f = { state: "start", init: s, input: i, method: a, startClocks: u, url: c, handlingStack: n };
        r.notify(f), (e[0] = f.input), (e[1] = f.init), t((l) => Ah(r, l, f));
    }
    function Ah(e, t, n) {
        const r = n;
        function i(s) {
            (r.state = "resolve"), Object.assign(r, s), e.notify(r);
        }
        t.then(
            S((s) => {
                i({ response: s, responseType: s.type, status: s.status, isAborted: !1 });
            }),
            S((s) => {
                var o, a;
                i({
                    status: 0,
                    isAborted:
                        ((a = (o = r.init) === null || o === void 0 ? void 0 : o.signal) === null || a === void 0
                            ? void 0
                            : a.aborted) ||
                        (s instanceof DOMException && s.code === DOMException.ABORT_ERR),
                    error: s,
                });
            })
        );
    }
    function uc(e, t) {
        if (window.requestIdleCallback && window.cancelIdleCallback) {
            const n = window.requestIdleCallback(S(e), t);
            return () => window.cancelIdleCallback(n);
        }
        return Ch(e);
    }
    const Rh = 50;
    function Ch(e) {
        const t = ge(),
            n = ae(() => {
                e({ didTimeout: !1, timeRemaining: () => Math.max(0, Rh - (ge() - t)) });
            }, 0);
        return () => Se(n);
    }
    const kh = ue,
        xh = 30;
    function Oh() {
        const e = [];
        function t(r) {
            let i;
            if (r.didTimeout) {
                const s = performance.now();
                i = () => xh - (performance.now() - s);
            } else i = r.timeRemaining.bind(r);
            for (; i() > 0 && e.length; ) e.shift()();
            e.length && n();
        }
        function n() {
            uc(t, { timeout: kh });
        }
        return {
            push(r) {
                e.push(r) === 1 && n();
            },
            stop() {
                e.length = 0;
            },
        };
    }
    let ms = {};
    function lc(e) {
        const t = e.map((n) => (ms[n] || (ms[n] = Nh(n)), ms[n]));
        return Xo(...t);
    }
    function Nh(e) {
        return new D((t) => {
            const n = Xe[e];
            return (
                (Xe[e] = (...r) => {
                    n.apply(console, r);
                    const i = Sn("console error");
                    ut(() => {
                        t.notify(Lh(r, e, i));
                    });
                }),
                () => {
                    Xe[e] = n;
                }
            );
        });
    }
    function Lh(e, t, n) {
        const r = e.map((i) => Mh(i)).join(" ");
        if (t === ee.error) {
            const i = e.find(qt),
                s = Vr({
                    originalError: i,
                    handlingStack: n,
                    startClocks: ne(),
                    source: ve.CONSOLE,
                    handling: "handled",
                    nonErrorPrefix: "Provided",
                    useFallbackStack: !1,
                });
            return (s.message = r), { api: t, message: r, handlingStack: n, error: s };
        }
        return { api: t, message: r, error: void 0, handlingStack: n };
    }
    function Mh(e) {
        return typeof e == "string" ? j(e) : qt(e) ? va(yn(e)) : tr(j(e), void 0, 2);
    }
    const Dh = 500;
    function dc() {
        const e = [];
        return {
            add: (i) => {
                e.push(i) > Dh && e.splice(0, 1);
            },
            remove: (i) => {
                tc(e, i);
            },
            drain: (i) => {
                e.forEach((s) => s(i)), (e.length = 0);
            },
        };
    }
    function Ph(e) {
        const t = Kt(e) === "object";
        return t || I.error("Unsupported context:", e), t;
    }
    function gs(e, t, n) {
        const r = { ...e };
        for (const [i, { required: s, type: o }] of Object.entries(t))
            o === "string" && !fc(r[i]) && (r[i] = String(r[i])),
                s &&
                    fc(r[i]) &&
                    I.warn(`The property ${i} of ${n} is required; context will not be sent to the intake.`);
        return r;
    }
    function fc(e) {
        return e == null || e === "";
    }
    function or(e = "", { propertiesConfig: t = {} } = {}) {
        let n = {};
        const r = new D(),
            i = {
                getContext: () => jr(n),
                setContext: (s) => {
                    Ph(s) ? (n = j(gs(s, t, e))) : i.clearContext(), r.notify();
                },
                setContextProperty: (s, o) => {
                    (n = j(gs({ ...n, [s]: o }, t, e))), r.notify();
                },
                removeContextProperty: (s) => {
                    delete n[s], gs(n, t, e), r.notify();
                },
                clearContext: () => {
                    (n = {}), r.notify();
                },
                changeObservable: r,
            };
        return i;
    }
    function z(e, t, n, r) {
        return S((...i) => (r && oe({ feature: r }), e()[t][n](...i)));
    }
    function _s(e, t, n) {
        e.changeObservable.subscribe(() => {
            const r = e.getContext();
            n.add((i) => i[t].setContext(r));
        });
    }
    const Uh = "_dd_c",
        Fh = [];
    function bs(e, t, n, r) {
        const i = $h(n, r);
        Fh.push(
            J(e, window, "storage", ({ key: u }) => {
                i === u && o();
            })
        ),
            t.changeObservable.subscribe(a);
        const s = Oe(c(), t.getContext());
        zt(s) || t.setContext(s);
        function o() {
            t.setContext(c());
        }
        function a() {
            localStorage.setItem(i, JSON.stringify(t.getContext()));
        }
        function c() {
            const u = localStorage.getItem(i);
            return u ? JSON.parse(u) : {};
        }
    }
    function $h(e, t) {
        return `${Uh}_${e}_${t}`;
    }
    function pc(e, t, n) {
        const r = ys();
        return (
            t.storeContextsAcrossPages && bs(t, r, n, 4),
            e.register(0, () => {
                const i = r.getContext();
                return zt(i) || !i.id ? le : { account: i };
            }),
            r
        );
    }
    function ys() {
        return or("account", { propertiesConfig: { id: { type: "string", required: !0 }, name: { type: "string" } } });
    }
    function hc(e, t, n, r) {
        const i = Es();
        return (
            t.storeContextsAcrossPages && bs(t, i, n, 2),
            e.register(0, () => {
                const s = i.getContext();
                return r ? { context: s } : s;
            }),
            i
        );
    }
    function Es() {
        return or("global context");
    }
    function mc(e, t, n, r) {
        const i = Ss();
        return (
            t.storeContextsAcrossPages && bs(t, i, r, 1),
            e.register(0, ({ eventType: s, startTime: o }) => {
                const a = i.getContext(),
                    c = n.findTrackedSession(o);
                return (
                    c && c.anonymousId && !a.anonymous_id && t.trackAnonymousUser && (a.anonymous_id = c.anonymousId),
                    zt(a) ? le : { type: s, usr: a }
                );
            }),
            e.register(1, ({ startTime: s }) => {
                var o;
                return {
                    anonymous_id: (o = n.findTrackedSession(s)) === null || o === void 0 ? void 0 : o.anonymousId,
                };
            }),
            i
        );
    }
    function Ss() {
        return or("user", {
            propertiesConfig: { id: { type: "string" }, name: { type: "string" }, email: { type: "string" } },
        });
    }
    const P = { userContext: "userContext", globalContext: "globalContext", accountContext: "accountContext" },
        H = {
            getContext: "getContext",
            setContext: "setContext",
            setContextProperty: "setContextProperty",
            removeContextProperty: "removeContextProperty",
            clearContext: "clearContext",
        };
    function gc(e, t, n) {
        const r = e.getReader(),
            i = [];
        let s = 0;
        o();
        function o() {
            r.read().then(
                S((c) => {
                    if (c.done) {
                        a();
                        return;
                    }
                    n.collectStreamBody && i.push(c.value), (s += c.value.length), s > n.bytesLimit ? a() : o();
                }),
                S((c) => t(c))
            );
        }
        function a() {
            r.cancel().catch(N);
            let c, u;
            if (n.collectStreamBody) {
                let f;
                if (i.length === 1) f = i[0];
                else {
                    f = new Uint8Array(s);
                    let l = 0;
                    i.forEach((d) => {
                        f.set(d, l), (l += d.length);
                    });
                }
                (c = f.slice(0, n.bytesLimit)), (u = f.length > n.bytesLimit);
            }
            t(void 0, c, u);
        }
    }
    const _e = {
            DOCUMENT: "document",
            XHR: "xhr",
            BEACON: "beacon",
            FETCH: "fetch",
            CSS: "css",
            JS: "js",
            IMAGE: "image",
            FONT: "font",
            MEDIA: "media",
            OTHER: "other",
        },
        Qt = { FETCH: _e.FETCH, XHR: _e.XHR },
        Bh = 500;
    function _c(e = Qp) {
        const t = new Jo(Bh),
            n = e().subscribe((r) => {
                t.notify({ type: 0, error: r });
            });
        return {
            observable: t,
            stop: () => {
                n.unsubscribe();
            },
        };
    }
    function Vh() {
        try {
            return new Intl.DateTimeFormat().resolvedOptions().timeZone;
        } catch {
            return;
        }
    }
    function Qr(e, t, n) {
        const r = n.getHandler(),
            i = Array.isArray(r) ? r : [r];
        return bc[e] >= bc[n.getLevel()] && i.includes(t);
    }
    const k = {
            ok: "ok",
            debug: "debug",
            info: "info",
            notice: "notice",
            warn: "warn",
            error: "error",
            critical: "critical",
            alert: "alert",
            emerg: "emerg",
        },
        bc = {
            [k.ok]: 0,
            [k.debug]: 1,
            [k.info]: 2,
            [k.notice]: 4,
            [k.warn]: 5,
            [k.error]: 6,
            [k.critical]: 7,
            [k.alert]: 8,
            [k.emerg]: 9,
        };
    function ei(e, { includeMessage: t = !1 } = {}) {
        return {
            stack: e.stack,
            kind: e.type,
            message: t ? e.message : void 0,
            causes: e.causes,
            fingerprint: e.fingerprint,
            handling: e.handling,
        };
    }
    var zh = function (e, t, n, r) {
        var i = arguments.length,
            s = i < 3 ? t : r === null ? (r = Object.getOwnPropertyDescriptor(t, n)) : r,
            o;
        if (typeof Reflect == "object" && typeof Reflect.decorate == "function") s = Reflect.decorate(e, t, n, r);
        else
            for (var a = e.length - 1; a >= 0; a--)
                (o = e[a]) && (s = (i < 3 ? o(s) : i > 3 ? o(t, n, s) : o(t, n)) || s);
        return i > 3 && s && Object.defineProperty(t, n, s), s;
    };
    const ar = { console: "console", http: "http" },
        Hh = Object.keys(k);
    class Ne {
        constructor(t, n, r = ar.http, i = k.debug, s = {}) {
            (this.handleLogStrategy = t),
                (this.handlerType = r),
                (this.level = i),
                (this.contextManager = or("logger")),
                (this.tags = []),
                this.contextManager.setContext(s),
                n && this.contextManager.setContextProperty("logger", { name: n });
        }
        logImplementation(t, n, r = k.info, i, s) {
            const o = j(n);
            let a;
            if (i != null) {
                const c = Vr({
                    originalError: i,
                    nonErrorPrefix: "Provided",
                    source: ve.LOGGER,
                    handling: "handled",
                    startClocks: ne(),
                });
                a = Oe({ error: ei(c, { includeMessage: !0 }) }, c.context, o);
            } else a = o;
            this.handleLogStrategy({ message: j(t), context: a, status: r }, this, s);
        }
        log(t, n, r = k.info, i) {
            let s;
            Qr(r, ar.http, this) && (s = Sn("log")), this.logImplementation(t, n, r, i, s);
        }
        setContext(t) {
            this.contextManager.setContext(t);
        }
        getContext() {
            return this.contextManager.getContext();
        }
        setContextProperty(t, n) {
            this.contextManager.setContextProperty(t, n);
        }
        removeContextProperty(t) {
            this.contextManager.removeContextProperty(t);
        }
        clearContext() {
            this.contextManager.clearContext();
        }
        addTag(t, n) {
            this.tags.push(Yt(t, n));
        }
        removeTagsWithKey(t) {
            const n = Ia(t);
            this.tags = this.tags.filter((r) => r !== n && !r.startsWith(`${n}:`));
        }
        getTags() {
            return this.tags.slice();
        }
        setHandler(t) {
            this.handlerType = t;
        }
        getHandler() {
            return this.handlerType;
        }
        setLevel(t) {
            this.level = t;
        }
        getLevel() {
            return this.level;
        }
    }
    zh([of], Ne.prototype, "logImplementation", null),
        (Ne.prototype.ok = ft(k.ok)),
        (Ne.prototype.debug = ft(k.debug)),
        (Ne.prototype.info = ft(k.info)),
        (Ne.prototype.notice = ft(k.notice)),
        (Ne.prototype.warn = ft(k.warn)),
        (Ne.prototype.error = ft(k.error)),
        (Ne.prototype.critical = ft(k.critical)),
        (Ne.prototype.alert = ft(k.alert)),
        (Ne.prototype.emerg = ft(k.emerg));
    function ft(e) {
        return function (t, n, r) {
            let i;
            Qr(e, ar.http, this) && (i = Sn("log")), this.logImplementation(t, n, e, r, i);
        };
    }
    function yc() {
        return Ht ? {} : { view: { referrer: document.referrer, url: window.location.href } };
    }
    const Gh = 32 * Vt;
    function jh(e, t) {
        e.usePciIntake === !0 &&
            e.site &&
            e.site !== "datadoghq.com" &&
            I.warn(
                "PCI compliance for Logs is only available for Datadog organizations in the US1 site. Default intake will be used."
            );
        const n = qa(e, t),
            r = Ec(e.forwardConsoleLogs, Dr(ee), "Forward Console Logs"),
            i = Ec(e.forwardReports, Dr(Cn), "Forward Reports");
        if (!(!n || !r || !i))
            return (
                e.forwardErrorsToLogs && !r.includes(ee.error) && r.push(ee.error),
                {
                    forwardErrorsToLogs: e.forwardErrorsToLogs !== !1,
                    forwardConsoleLogs: r,
                    forwardReports: i,
                    requestErrorResponseLengthLimit: Gh,
                    ...n,
                }
            );
    }
    function Ec(e, t, n) {
        if (e === void 0) return [];
        if (!(e === "all" || (Array.isArray(e) && e.every((r) => t.includes(r))))) {
            I.error(`${n} should be "all" or an array with allowed values "${t.join('", "')}"`);
            return;
        }
        return e === "all" ? t : oh(e);
    }
    function Wh(e) {
        const t = Ya(e);
        return {
            forward_errors_to_logs: e.forwardErrorsToLogs,
            forward_console_logs: e.forwardConsoleLogs,
            forward_reports: e.forwardReports,
            use_pci_intake: e.usePciIntake,
            ...t,
        };
    }
    function Kh(e, t, n) {
        const r = dc(),
            i = Es();
        _s(i, P.globalContext, r);
        const s = ys();
        _s(s, P.accountContext, r);
        const o = Ss();
        _s(o, P.userContext, r);
        let a, c;
        const u = t.observable.subscribe(f);
        function f() {
            if (!c || !a || !t.isGranted()) return;
            u.unsubscribe();
            const l = n(a, c);
            r.drain(l);
        }
        return {
            init(l, d) {
                if (!l) {
                    I.error("Missing configuration");
                    return;
                }
                if ((Ta(l.enableExperimentalFeatures), Je() && (l = qh(l)), (a = l), Ga(Wh(l)), c)) {
                    Kr("DD_LOGS", l);
                    return;
                }
                const p = jh(l, d);
                p && ((c = p), Zr().subscribe(N), t.tryToInit(p.trackingConsent), f());
            },
            get initConfiguration() {
                return a;
            },
            globalContext: i,
            accountContext: s,
            userContext: o,
            getInternalContext: N,
            handleLog(l, d, p, h = e(), m = $()) {
                r.add((g) => g.handleLog(l, d, p, h, m));
            },
        };
    }
    function qh(e) {
        return { ...e, clientToken: "empty" };
    }
    function Yh(e) {
        const t = _a(),
            n = _c().observable;
        let r = Kh(yc, t, (a, c) => {
            const u = e(c, yc, t, n);
            return (r = Xh(a, u)), u;
        });
        const i = () => r,
            s = {},
            o = new Ne((...a) => r.handleLog(...a));
        return Xa({
            logger: o,
            init: (a) => {
                const c = new Error().stack;
                ut(() => r.init(a, c));
            },
            setTrackingConsent: S((a) => {
                t.update(a), oe({ feature: "set-tracking-consent", tracking_consent: a });
            }),
            getGlobalContext: z(i, P.globalContext, H.getContext),
            setGlobalContext: z(i, P.globalContext, H.setContext),
            setGlobalContextProperty: z(i, P.globalContext, H.setContextProperty),
            removeGlobalContextProperty: z(i, P.globalContext, H.removeContextProperty),
            clearGlobalContext: z(i, P.globalContext, H.clearContext),
            createLogger: S(
                (a, c = {}) => (
                    (s[a] = new Ne((...u) => r.handleLog(...u), j(a), c.handler, c.level, j(c.context))), s[a]
                )
            ),
            getLogger: S((a) => s[a]),
            getInitConfiguration: S(() => jr(r.initConfiguration)),
            getInternalContext: S((a) => r.getInternalContext(a)),
            setUser: z(i, P.userContext, H.setContext),
            getUser: z(i, P.userContext, H.getContext),
            setUserProperty: z(i, P.userContext, H.setContextProperty),
            removeUserProperty: z(i, P.userContext, H.removeContextProperty),
            clearUser: z(i, P.userContext, H.clearContext),
            setAccount: z(i, P.accountContext, H.setContext),
            getAccount: z(i, P.accountContext, H.getContext),
            setAccountProperty: z(i, P.accountContext, H.setContextProperty),
            removeAccountProperty: z(i, P.accountContext, H.removeContextProperty),
            clearAccount: z(i, P.accountContext, H.clearContext),
        });
    }
    function Xh(e, t) {
        return {
            init: (n) => {
                Kr("DD_LOGS", n);
            },
            initConfiguration: e,
            ...t,
        };
    }
    const Jh = "logs";
    function Zh(e, t) {
        const n = sc(e, Jh, (r) => Sc(e, r), t);
        return {
            findTrackedSession: (r, i = { returnInactive: !1 }) => {
                const s = n.findSession(r, i);
                return s && s.trackingType === "1" ? { id: s.id, anonymousId: s.anonymousId } : void 0;
            },
            expireObservable: n.expireObservable,
        };
    }
    function Qh(e) {
        const n = Sc(e) === "1" ? {} : void 0;
        return { findTrackedSession: () => n, expireObservable: new D() };
    }
    function Sc(e, t) {
        return em(t) ? t : Tt(e.sessionSampleRate) ? "1" : "0";
    }
    function em(e) {
        return e === "0" || e === "1";
    }
    function tm(e, t, n, r, i) {
        const s = Hh.concat(["custom"]),
            o = {};
        s.forEach((a) => {
            o[a] = Jr(a, e.eventRateLimiterThreshold, i);
        }),
            t.subscribe(
                0,
                ({
                    rawLogsEvent: a,
                    messageContext: c = void 0,
                    savedCommonContext: u = void 0,
                    domainContext: f,
                    ddtags: l = [],
                }) => {
                    var d, p;
                    const h = Rr(a.date),
                        m = u || r(),
                        g = n.triggerHook(0, { startTime: h });
                    if (g === He) return;
                    const w = zr(e),
                        b = Oe({ view: m.view }, g, a, c, { ddtags: w.concat(l).join(",") });
                    ((d = e.beforeSend) === null || d === void 0 ? void 0 : d.call(e, b, f)) === !1 ||
                        (b.origin !== ve.AGENT &&
                            ((p = o[b.status]) !== null && p !== void 0 ? p : o.custom).isLimitReached()) ||
                        t.notify(1, b);
                }
            );
    }
    const nm = { [ee.log]: k.info, [ee.debug]: k.debug, [ee.info]: k.info, [ee.warn]: k.warn, [ee.error]: k.error };
    function rm(e, t) {
        const n = lc(e.forwardConsoleLogs).subscribe((r) => {
            var i;
            const s = {
                rawLogsEvent: {
                    date: $(),
                    message: r.message,
                    origin: ve.CONSOLE,
                    error: r.error && ei(r.error),
                    status: nm[r.api],
                },
                messageContext: (i = r.error) === null || i === void 0 ? void 0 : i.context,
                domainContext: { handlingStack: r.handlingStack },
            };
            t.notify(0, s);
        });
        return {
            stop: () => {
                n.unsubscribe();
            },
        };
    }
    function im(e, t) {
        const n = Za(e, e.forwardReports).subscribe((r) => {
            let i = r.message,
                s;
            const o = r.originalError.type === "deprecation" ? k.warn : k.error;
            o === k.error ? (s = ei(r)) : r.stack && (i += ` Found in ${dp(r.stack)}`),
                t.notify(0, { rawLogsEvent: { date: $(), message: i, origin: ve.REPORT, error: s, status: o } });
        });
        return {
            stop: () => {
                n.unsubscribe();
            },
        };
    }
    function sm(e, t) {
        if (!e.forwardErrorsToLogs) return { stop: N };
        const n = (Ht ? new D() : cc(e)).subscribe((s) => {
                s.state === "complete" && i(Qt.XHR, s);
            }),
            r = Zr().subscribe((s) => {
                s.state === "resolve" && i(Qt.FETCH, s);
            });
        function i(s, o) {
            !Ka(o.url) &&
                (um(o) || Ca(o.status)) &&
                ("xhr" in o ? om(o.xhr, e, a) : o.response ? cm(o.response, e, a) : o.error && am(o.error, e, a));
            function a(c) {
                const u = { isAborted: o.isAborted, handlingStack: o.handlingStack };
                t.notify(0, {
                    rawLogsEvent: {
                        message: `${lm(s)} error ${o.method} ${o.url}`,
                        date: o.startClocks.timeStamp,
                        error: { stack: c || "Failed to load", handling: void 0 },
                        http: { method: o.method, status_code: o.status, url: o.url },
                        status: k.error,
                        origin: ve.NETWORK,
                    },
                    domainContext: u,
                });
            }
        }
        return {
            stop: () => {
                n.unsubscribe(), r.unsubscribe();
            },
        };
    }
    function om(e, t, n) {
        typeof e.response == "string" ? n(vs(e.response, t)) : n(e.response);
    }
    function am(e, t, n) {
        n(vs(vn(yn(e)), t));
    }
    function cm(e, t, n) {
        const r = ka(e);
        !r || !r.body
            ? n()
            : window.TextDecoder
              ? dm(r.body, t.requestErrorResponseLengthLimit, (i, s) => {
                    n(i ? `Unable to retrieve response: ${i}` : s);
                })
              : r.text().then(
                    S((i) => n(vs(i, t))),
                    S((i) => n(`Unable to retrieve response: ${i}`))
                );
    }
    function um(e) {
        return e.status === 0 && e.responseType !== "opaque";
    }
    function vs(e, t) {
        return e.length > t.requestErrorResponseLengthLimit
            ? `${e.substring(0, t.requestErrorResponseLengthLimit)}...`
            : e;
    }
    function lm(e) {
        return Qt.XHR === e ? "XHR" : "Fetch";
    }
    function dm(e, t, n) {
        gc(
            e,
            (r, i, s) => {
                if (r) n(r);
                else {
                    let o = new TextDecoder().decode(i);
                    s && (o += "..."), n(void 0, o);
                }
            },
            { bytesLimit: t, collectStreamBody: !0 }
        );
    }
    function fm(e, t, n) {
        if (!e.forwardErrorsToLogs) return { stop: N };
        const r = n.subscribe((i) => {
            if (i.type === 0) {
                const s = i.error;
                t.notify(0, {
                    rawLogsEvent: {
                        message: s.message,
                        date: s.startClocks.timeStamp,
                        error: ei(s),
                        origin: ve.SOURCE,
                        status: k.error,
                    },
                    messageContext: s.context,
                });
            }
        });
        return {
            stop: () => {
                r.unsubscribe();
            },
        };
    }
    const pm = ac;
    function hm(e) {
        function t(n, r, i, s, o) {
            const a = Oe(r.getContext(), n.context);
            if ((Qr(n.status, ar.console, r) && gm(n, a), Qr(n.status, ar.http, r))) {
                const c = {
                    rawLogsEvent: { date: o || $(), message: n.message, status: n.status, origin: ve.LOGGER },
                    messageContext: a,
                    savedCommonContext: s,
                    ddtags: r.getTags(),
                };
                i && (c.domainContext = { handlingStack: i }), e.notify(0, c);
            }
        }
        return { handleLog: t };
    }
    const mm = {
        [k.ok]: ee.debug,
        [k.debug]: ee.debug,
        [k.info]: ee.info,
        [k.notice]: ee.info,
        [k.warn]: ee.warn,
        [k.error]: ee.error,
        [k.critical]: ee.error,
        [k.alert]: ee.error,
        [k.emerg]: ee.error,
    };
    function gm({ status: e, message: t }, n) {
        Bt[mm[e]].call(Xe, t, n);
    }
    function _m(e, t, n, r, i) {
        const s = [e.logsEndpointBuilder];
        e.replica && s.push(e.replica.logsEndpointBuilder);
        const o = is({
            encoder: ls(),
            request: Wr(s, e.batchBytesLimit, n),
            flushController: ss({
                messagesLimit: e.batchMessagesLimit,
                bytesLimit: e.batchBytesLimit,
                durationLimit: e.flushTimeout,
                pageMayExitObservable: r,
                sessionExpireObservable: i.expireObservable,
            }),
            messageBytesLimit: e.messageBytesLimit,
        });
        return (
            t.subscribe(1, (a) => {
                o.add(a);
            }),
            o
        );
    }
    function bm(e) {
        const t = Jt();
        e.subscribe(1, (n) => {
            t.send("log", n);
        });
    }
    function ym(e) {
        return {
            get: (t) => {
                const n = e.findTrackedSession(t);
                if (n) return { session_id: n.id };
            },
        };
    }
    function Em(e) {
        return (t) => {
            e.notify(0, {
                rawLogsEvent: { message: t.message, date: t.startClocks.timeStamp, origin: ve.AGENT, status: k.error },
            }),
                dt("Error reported to customer", { "error.message": t.message });
        };
    }
    const Sm = za;
    function vm(e) {
        const t = Ve;
        e.register(0, ({ startTime: i }) => {
            const s = n(i);
            return s || le;
        }),
            e.register(1, ({ startTime: i }) => {
                var s, o;
                const a = n(i);
                return a
                    ? {
                          application: { id: a.application_id },
                          view: { id: (s = a.view) === null || s === void 0 ? void 0 : s.id },
                          action: { id: (o = a.user_action) === null || o === void 0 ? void 0 : o.id },
                      }
                    : le;
            });
        function n(i) {
            const o = Xr() ? t.DD_RUM_SYNTHETICS : t.DD_RUM,
                a = r(i, o);
            if (a) return a;
        }
        function r(i, s) {
            if (s && s.getInternalContext) return s.getInternalContext(i);
        }
    }
    function wm(e, t, n) {
        e.register(0, ({ startTime: r }) => {
            const i = n.findTrackedSession(r);
            return n.findTrackedSession(r, { returnInactive: !0 })
                ? { service: t.service, session_id: i ? i.id : void 0, session: i ? { id: i.id } : void 0 }
                : He;
        }),
            e.register(1, ({ startTime: r }) => {
                const i = n.findTrackedSession(r);
                return !i || !i.id ? le : { session: { id: i.id } };
            });
    }
    function Tm(e, t) {
        function n() {
            return t.isGranted() ? le : He;
        }
        e.register(0, n), e.register(1, n);
    }
    const ws = "logs";
    function Im(e, t, n, r) {
        const i = new pm(),
            s = Sm(),
            o = [];
        i.subscribe(1, (g) => Hr("logs", g));
        const a = Em(i),
            c = Ht ? new D() : $a(e),
            u = Ha("browser-logs-sdk", e, s, a, c, ls);
        o.push(u.stop);
        const f = e.sessionStoreStrategyType && !Je() && !Xr() ? Zh(e, n) : Qh(e);
        Tm(s, n), wm(s, e, f);
        const l = pc(s, e, ws),
            d = mc(s, e, f, ws),
            p = hc(s, e, ws, !1);
        vm(s), sm(e, i), fm(e, i, r), r.unbuffer(), rm(e, i), im(e, i);
        const { handleLog: h } = hm(i);
        if ((tm(e, i, s, t, a), Je())) bm(i);
        else {
            const { stop: g } = _m(e, i, a, c, f);
            o.push(() => g());
        }
        const m = ym(f);
        return {
            handleLog: h,
            getInternalContext: m.get,
            accountContext: l,
            globalContext: p,
            userContext: d,
            stop: () => {
                o.forEach((g) => g());
            },
        };
    }
    const vc = Yh(Im);
    Ja(Ee(), "DD_LOGS", vc);
    const C = {
            ACTION: "action",
            ERROR: "error",
            LONG_TASK: "long_task",
            VIEW: "view",
            RESOURCE: "resource",
            VITAL: "vital",
        },
        wc = { LONG_TASK: "long-task", LONG_ANIMATION_FRAME: "long-animation-frame" },
        pt = { INITIAL_LOAD: "initial_load", ROUTE_CHANGE: "route_change", BF_CACHE: "bf_cache" },
        ti = { CLICK: "click", CUSTOM: "custom" },
        cr = { RAGE_CLICK: "rage_click", ERROR_CLICK: "error_click", DEAD_CLICK: "dead_click" },
        ur = { DURATION: "duration", OPERATION_STEP: "operation_step" };
    function Am() {
        return { vitalsByName: new Map(), vitalsByReference: new WeakMap() };
    }
    function Rm(e, t, n) {
        function r(o) {
            return !t.wasInPageStateDuringPeriod("frozen", o.startClocks.relative, o.duration);
        }
        function i(o) {
            r(o) && e.notify(12, Ac(o));
        }
        function s(o, a, c, u) {
            if (!wn(lt.FEATURE_OPERATION_VITAL)) return;
            const { operationKey: f, context: l, description: d } = c || {},
                p = {
                    name: o,
                    type: ur.OPERATION_STEP,
                    operationKey: f,
                    failureReason: u,
                    stepType: a,
                    startClocks: ne(),
                    context: j(l),
                    description: d,
                };
            e.notify(12, Ac(p));
        }
        return {
            addOperationStepVital: s,
            addDurationVital: i,
            startDurationVital: (o, a = {}) => Tc(n, o, a),
            stopDurationVital: (o, a = {}) => {
                Ic(i, n, o, a);
            },
        };
    }
    function Tc({ vitalsByName: e, vitalsByReference: t }, n, r = {}) {
        const i = { name: n, startClocks: ne(), ...r },
            s = { __dd_vital_reference: !0 };
        return e.set(n, i), t.set(s, i), s;
    }
    function Ic(e, { vitalsByName: t, vitalsByReference: n }, r, i = {}) {
        const s = typeof r == "string" ? t.get(r) : n.get(r);
        s && (e(Cm(s, s.startClocks, i, ne())), typeof r == "string" ? t.delete(r) : n.delete(r));
    }
    function Cm(e, t, n, r) {
        var i;
        return {
            name: e.name,
            type: ur.DURATION,
            startClocks: t,
            duration: Q(t.timeStamp, r.timeStamp),
            context: Oe(e.context, n.context),
            description: (i = n.description) !== null && i !== void 0 ? i : e.description,
        };
    }
    function Ac(e) {
        const { startClocks: t, type: n, name: r, description: i, context: s } = e,
            o = {
                id: de(),
                type: n,
                name: r,
                description: i,
                ...(n === ur.DURATION
                    ? { duration: O(e.duration) }
                    : { step_type: e.stepType, operation_key: e.operationKey, failure_reason: e.failureReason }),
            };
        return {
            rawRumEvent: { date: t.timeStamp, vital: o, type: C.VITAL, context: s },
            startTime: t.relative,
            duration: n === ur.DURATION ? e.duration : void 0,
            domainContext: {},
        };
    }
    function Rc(e, t, n) {
        if (e)
            for (const r of e) {
                const i = r[t];
                i && i(n);
            }
    }
    const Cc = new Map();
    function kc(e, t) {
        if (t === 100) return !0;
        if (t === 0) return !1;
        const n = Cc.get(t);
        if (n && e === n.sessionId) return n.decision;
        let r;
        return (
            window.BigInt ? (r = km(BigInt(`0x${e.split("-")[4]}`), t)) : (r = Tt(t)),
            Cc.set(t, { sessionId: e, decision: r }),
            r
        );
    }
    function km(e, t) {
        const n = BigInt("1111111111111111111"),
            r = BigInt("0x10000000000000000"),
            i = (e * n) % r;
        return Number(i) <= (t / 100) * Number(r);
    }
    function xm() {
        return Oc(64);
    }
    function xc() {
        return Oc(63);
    }
    function Oc(e) {
        const t = crypto.getRandomValues(new Uint32Array(2));
        return (
            e === 63 && (t[t.length - 1] >>>= 1),
            {
                toString(n = 10) {
                    let r = t[1],
                        i = t[0],
                        s = "";
                    do {
                        const o = (r % n) * 4294967296 + i;
                        (r = Math.floor(r / n)), (i = Math.floor(o / n)), (s = (o % n).toString(n) + s);
                    } while (r || i);
                    return s;
                },
            }
        );
    }
    function xn(e) {
        return e.toString(16).padStart(16, "0");
    }
    function Om(e) {
        const t = e;
        return Kt(t) === "object" && er(t.match) && Array.isArray(t.propagatorTypes);
    }
    function Nm(e) {
        e.status === 0 && !e.isAborted && ((e.traceId = void 0), (e.spanId = void 0), (e.traceSampled = void 0));
    }
    function Lm(e, t, n, r) {
        return {
            clearTracingIfNeeded: Nm,
            traceFetch: (i) =>
                Nc(e, i, t, n, r, (s) => {
                    var o;
                    if (i.input instanceof Request && !(!((o = i.init) === null || o === void 0) && o.headers))
                        (i.input = new Request(i.input)),
                            Object.keys(s).forEach((a) => {
                                i.input.headers.append(a, s[a]);
                            });
                    else {
                        i.init = Yn(i.init);
                        const a = [];
                        i.init.headers instanceof Headers
                            ? i.init.headers.forEach((c, u) => {
                                  a.push([u, c]);
                              })
                            : Array.isArray(i.init.headers)
                              ? i.init.headers.forEach((c) => {
                                    a.push(c);
                                })
                              : i.init.headers &&
                                Object.keys(i.init.headers).forEach((c) => {
                                    a.push([c, i.init.headers[c]]);
                                }),
                            (i.init.headers = a.concat(qi(s)));
                    }
                }),
            traceXhr: (i, s) =>
                Nc(e, i, t, n, r, (o) => {
                    Object.keys(o).forEach((a) => {
                        s.setRequestHeader(a, o[a]);
                    });
                }),
        };
    }
    function Nc(e, t, n, r, i, s) {
        const o = n.findTrackedSession();
        if (!o) return;
        const a = e.allowedTracingUrls.find((f) => $r([f.match], t.url, !0));
        if (!a) return;
        const c = kc(o.id, e.traceSampleRate);
        (c || e.traceContextInjection === cs.ALL) &&
            ((t.traceSampled = c),
            (t.traceId = xm()),
            (t.spanId = xc()),
            s(Mm(t.traceId, t.spanId, t.traceSampled, o.id, a.propagatorTypes, r, i, e)));
    }
    function Mm(e, t, n, r, i, s, o, a) {
        const c = {};
        if (
            (i.forEach((u) => {
                switch (u) {
                    case "datadog": {
                        Object.assign(c, {
                            "x-datadog-origin": "rum",
                            "x-datadog-parent-id": t.toString(),
                            "x-datadog-sampling-priority": n ? "1" : "0",
                            "x-datadog-trace-id": e.toString(),
                        });
                        break;
                    }
                    case "tracecontext": {
                        Object.assign(c, {
                            traceparent: `00-0000000000000000${xn(e)}-${xn(t)}-0${n ? "1" : "0"}`,
                            tracestate: `dd=s:${n ? "1" : "0"};o:rum`,
                        });
                        break;
                    }
                    case "b3": {
                        Object.assign(c, { b3: `${xn(e)}-${xn(t)}-${n ? "1" : "0"}` });
                        break;
                    }
                    case "b3multi": {
                        Object.assign(c, {
                            "X-B3-TraceId": xn(e),
                            "X-B3-SpanId": xn(t),
                            "X-B3-Sampled": n ? "1" : "0",
                        });
                        break;
                    }
                }
            }),
            a.propagateTraceBaggage)
        ) {
            const u = { "session.id": r },
                f = s.getContext().id;
            typeof f == "string" && (u["user.id"] = f);
            const l = o.getContext().id;
            typeof l == "string" && (u["account.id"] = l);
            const d = Object.entries(u)
                .map(([p, h]) => `${p}=${encodeURIComponent(h)}`)
                .join(",");
            d && (c.baggage = d);
        }
        return c;
    }
    const Lc = ["tracecontext", "datadog"];
    function Dm(e, t) {
        var n, r, i, s, o, a, c;
        if (
            (e.trackFeatureFlagsForEvents !== void 0 &&
                !Array.isArray(e.trackFeatureFlagsForEvents) &&
                I.warn("trackFeatureFlagsForEvents should be an array"),
            !e.applicationId)
        ) {
            I.error("Application ID is not configured, no RUM data will be collected.");
            return;
        }
        if (!Rn(e.sessionReplaySampleRate, "Session Replay") || !Rn(e.traceSampleRate, "Trace")) return;
        if (e.excludedActivityUrls !== void 0 && !Array.isArray(e.excludedActivityUrls)) {
            I.error("Excluded Activity Urls should be an array");
            return;
        }
        const u = Pm(e);
        if (!u) return;
        const f = qa(e, t),
            l = Fm(e);
        if (!f) return;
        const d = (n = e.sessionReplaySampleRate) !== null && n !== void 0 ? n : 0;
        return {
            applicationId: e.applicationId,
            actionNameAttribute: e.actionNameAttribute,
            sessionReplaySampleRate: d,
            startSessionReplayRecordingManually:
                e.startSessionReplayRecordingManually !== void 0 ? !!e.startSessionReplayRecordingManually : d === 0,
            traceSampleRate: (r = e.traceSampleRate) !== null && r !== void 0 ? r : 100,
            rulePsr: Wn(e.traceSampleRate) ? e.traceSampleRate / 100 : void 0,
            allowedTracingUrls: u,
            excludedActivityUrls: (i = e.excludedActivityUrls) !== null && i !== void 0 ? i : [],
            workerUrl: e.workerUrl,
            compressIntakeRequests: !!e.compressIntakeRequests,
            trackUserInteractions: !!(!((s = e.trackUserInteractions) !== null && s !== void 0) || s),
            trackViewsManually: !!e.trackViewsManually,
            trackResources: !!(!((o = e.trackResources) !== null && o !== void 0) || o),
            trackLongTasks: !!(!((a = e.trackLongTasks) !== null && a !== void 0) || a),
            trackBfcacheViews: !!e.trackBfcacheViews,
            trackEarlyRequests: !!e.trackEarlyRequests,
            subdomain: e.subdomain,
            defaultPrivacyLevel: Cr(An, e.defaultPrivacyLevel) ? e.defaultPrivacyLevel : An.MASK,
            enablePrivacyForActionName: !!e.enablePrivacyForActionName,
            traceContextInjection: Cr(cs, e.traceContextInjection) ? e.traceContextInjection : cs.SAMPLED,
            plugins: e.plugins || [],
            trackFeatureFlagsForEvents: e.trackFeatureFlagsForEvents || [],
            profilingSampleRate: (c = e.profilingSampleRate) !== null && c !== void 0 ? c : 0,
            propagateTraceBaggage: !!e.propagateTraceBaggage,
            allowedGraphQlUrls: l,
            ...f,
        };
    }
    function Pm(e) {
        if (e.allowedTracingUrls === void 0) return [];
        if (!Array.isArray(e.allowedTracingUrls)) {
            I.error("Allowed Tracing URLs should be an array");
            return;
        }
        if (e.allowedTracingUrls.length !== 0 && e.service === void 0) {
            I.error("Service needs to be configured when tracing is enabled");
            return;
        }
        const t = [];
        return (
            e.allowedTracingUrls.forEach((n) => {
                er(n)
                    ? t.push({ match: n, propagatorTypes: Lc })
                    : Om(n)
                      ? t.push(n)
                      : I.warn(
                            "Allowed Tracing Urls parameters should be a string, RegExp, function, or an object. Ignoring parameter",
                            n
                        );
            }),
            t
        );
    }
    function Um(e) {
        const t = new Set();
        return (
            ir(e.allowedTracingUrls) &&
                e.allowedTracingUrls.forEach((n) => {
                    er(n)
                        ? Lc.forEach((r) => t.add(r))
                        : Kt(n) === "object" &&
                          Array.isArray(n.propagatorTypes) &&
                          n.propagatorTypes.forEach((r) => t.add(r));
                }),
            Array.from(t)
        );
    }
    function Fm(e) {
        if (!e.allowedGraphQlUrls) return [];
        if (!Array.isArray(e.allowedGraphQlUrls)) return I.warn("allowedGraphQlUrls should be an array"), [];
        const t = [];
        return (
            e.allowedGraphQlUrls.forEach((n) => {
                er(n)
                    ? t.push({ match: n, trackPayload: !1 })
                    : n &&
                      typeof n == "object" &&
                      "match" in n &&
                      er(n.match) &&
                      t.push({ match: n.match, trackPayload: !!n.trackPayload });
            }),
            t
        );
    }
    function $m(e) {
        return ir(e) && e.some((t) => (typeof t == "object" && "trackPayload" in t ? !!t.trackPayload : !1));
    }
    function Bm(e) {
        var t;
        const n = Ya(e);
        return {
            session_replay_sample_rate: e.sessionReplaySampleRate,
            start_session_replay_recording_manually: e.startSessionReplayRecordingManually,
            trace_sample_rate: e.traceSampleRate,
            trace_context_injection: e.traceContextInjection,
            propagate_trace_baggage: e.propagateTraceBaggage,
            action_name_attribute: e.actionNameAttribute,
            use_allowed_tracing_urls: ir(e.allowedTracingUrls),
            use_allowed_graph_ql_urls: ir(e.allowedGraphQlUrls),
            use_track_graph_ql_payload: $m(e.allowedGraphQlUrls),
            selected_tracing_propagators: Um(e),
            default_privacy_level: e.defaultPrivacyLevel,
            enable_privacy_for_action_name: e.enablePrivacyForActionName,
            use_excluded_activity_urls: ir(e.excludedActivityUrls),
            use_worker_url: !!e.workerUrl,
            compress_intake_requests: e.compressIntakeRequests,
            track_views_manually: e.trackViewsManually,
            track_user_interactions: e.trackUserInteractions,
            track_resources: e.trackResources,
            track_long_task: e.trackLongTasks,
            track_bfcache_views: e.trackBfcacheViews,
            track_early_requests: e.trackEarlyRequests,
            plugins:
                (t = e.plugins) === null || t === void 0
                    ? void 0
                    : t.map((r) => {
                          var i;
                          return {
                              name: r.name,
                              ...((i = r.getConfigurationTelemetry) === null || i === void 0 ? void 0 : i.call(r)),
                          };
                      }),
            track_feature_flags_for_events: e.trackFeatureFlagsForEvents,
            remote_configuration_id: e.remoteConfigurationId,
            profiling_sample_rate: e.profilingSampleRate,
            use_remote_configuration_proxy: !!e.remoteConfigurationProxy,
            ...n,
        };
    }
    function Vm(e) {
        const t = [];
        let n = 0,
            r;
        const i = { quote: void 0, escapeSequence: void 0 };
        let s = "";
        for (const o of e) {
            if (((r = Mc[n].find((a) => Km[a](o, i))), !r)) return [];
            if (i.escapeSequence !== void 0 && r !== 12) {
                if (!Xm(i.escapeSequence)) return [];
                (s += Zm(i.escapeSequence)), (i.escapeSequence = void 0);
            }
            qm.includes(r)
                ? (s += o)
                : Ym.includes(r) && s !== ""
                  ? (t.push(s), (s = ""))
                  : r === 12
                    ? (i.escapeSequence = i.escapeSequence ? `${i.escapeSequence}${o}` : o)
                    : r === 8
                      ? (i.quote = o)
                      : r === 9 && (i.quote = void 0),
                (n = r);
        }
        return Mc[n].includes(1) ? (s !== "" && t.push(s), t) : [];
    }
    const zm = /[a-zA-Z_$]/,
        Hm = /[a-zA-Z0-9_$]/,
        Gm = /[0-9]/,
        jm = /[a-fA-F0-9]/,
        Wm = `'"`,
        Km = {
            0: () => !1,
            1: () => !1,
            2: (e) => zm.test(e),
            3: (e) => Hm.test(e),
            4: (e) => e === ".",
            5: (e) => e === "[",
            6: (e) => e === "]",
            7: (e) => Gm.test(e),
            8: (e) => Wm.includes(e),
            9: (e, t) => e === t.quote,
            10: () => !0,
            11: (e) => e === "\\",
            12: (e, t) =>
                t.escapeSequence === void 0
                    ? `${t.quote}/\\bfnrtu`.includes(e)
                    : t.escapeSequence.startsWith("u") && t.escapeSequence.length < 5
                      ? jm.test(e)
                      : !1,
        },
        Mc = {
            0: [2, 5],
            1: [],
            2: [3, 4, 5, 1],
            3: [3, 4, 5, 1],
            4: [2],
            5: [8, 7],
            6: [4, 5, 1],
            7: [7, 6],
            8: [11, 9, 10],
            9: [6],
            10: [11, 9, 10],
            11: [12],
            12: [12, 11, 9, 10],
        },
        qm = [2, 3, 7, 10],
        Ym = [4, 5, 6];
    function Xm(e) {
        return `"'/\\bfnrt`.includes(e) || (e.startsWith("u") && e.length === 5);
    }
    const Jm = {
        '"': '"',
        "'": "'",
        "/": "/",
        "\\": "\\",
        b: "\b",
        f: "\f",
        n: `
`,
        r: "\r",
        t: "	",
    };
    function Zm(e) {
        return e.startsWith("u") ? String.fromCharCode(parseInt(e.slice(1), 16)) : Jm[e];
    }
    const Qm = "v1",
        eg = [
            "applicationId",
            "service",
            "env",
            "version",
            "sessionSampleRate",
            "sessionReplaySampleRate",
            "defaultPrivacyLevel",
            "enablePrivacyForActionName",
            "traceSampleRate",
            "trackSessionAcrossSubdomains",
            "allowedTracingUrls",
            "allowedTrackingOrigins",
        ];
    async function tg(e, t) {
        let n;
        const r = rg(),
            i = await ag(e);
        return (
            i.ok
                ? (r.increment("fetch", "success"), (n = ng(e, i.value, t, r)))
                : (r.increment("fetch", "failure"), I.error(i.error)),
            nr("remote configuration metrics", { metrics: r.get() }),
            n
        );
    }
    function ng(e, t, n, r) {
        const i = { ...e };
        return (
            eg.forEach((d) => {
                d in t && (i[d] = s(t[d]));
            }),
            Object.keys(n).forEach((d) => {
                t[d] !== void 0 && o(n[d], t[d]);
            }),
            i
        );
        function s(d) {
            if (Array.isArray(d)) return d.map(s);
            if (ig(d)) {
                if (sg(d)) {
                    const p = d.rcSerializedType;
                    switch (p) {
                        case "string":
                            return d.value;
                        case "regex":
                            return Dc(d.value);
                        case "dynamic":
                            return a(d);
                        default:
                            I.error(`Unsupported remote configuration: "rcSerializedType": "${p}"`);
                            return;
                    }
                }
                return Ko(d, s);
            }
            return d;
        }
        function o(d, p) {
            p.forEach(({ key: h, value: m }) => {
                d.setContextProperty(h, s(m));
            });
        }
        function a(d) {
            const p = d.strategy;
            let h;
            switch (p) {
                case "cookie":
                    h = c(d);
                    break;
                case "dom":
                    h = u(d);
                    break;
                case "js":
                    h = l(d);
                    break;
                default:
                    I.error(`Unsupported remote configuration: "strategy": "${p}"`);
                    return;
            }
            const m = d.extractor;
            return m !== void 0 && typeof h == "string" ? og(m, h) : h;
        }
        function c({ name: d }) {
            const p = Mr(d);
            return r.increment("cookie", p !== void 0 ? "success" : "missing"), p;
        }
        function u({ selector: d, attribute: p }) {
            let h;
            try {
                h = document.querySelector(d);
            } catch {
                I.error(`Invalid selector in the remote configuration: '${d}'`), r.increment("dom", "failure");
                return;
            }
            if (!h) {
                r.increment("dom", "missing");
                return;
            }
            if (f(h, p)) {
                I.error(`Forbidden element selected by the remote configuration: '${d}'`),
                    r.increment("dom", "failure");
                return;
            }
            const m = p !== void 0 ? h.getAttribute(p) : h.textContent;
            if (m === null) {
                r.increment("dom", "missing");
                return;
            }
            return r.increment("dom", "success"), m;
        }
        function f(d, p) {
            return d.getAttribute("type") === "password" && p === "value";
        }
        function l({ path: d }) {
            let p = window;
            const h = Vm(d);
            if (h.length === 0) {
                I.error(`Invalid JSON path in the remote configuration: '${d}'`), r.increment("js", "failure");
                return;
            }
            for (const m of h) {
                if (!(m in p)) {
                    r.increment("js", "missing");
                    return;
                }
                try {
                    p = p[m];
                } catch (g) {
                    I.error(`Error accessing: '${d}'`, g), r.increment("js", "failure");
                    return;
                }
            }
            return r.increment("js", "success"), p;
        }
    }
    function rg() {
        const e = { fetch: {} };
        return {
            get: () => e,
            increment: (t, n) => {
                e[t] || (e[t] = {}), e[t][n] || (e[t][n] = 0), (e[t][n] = e[t][n] + 1);
            },
        };
    }
    function ig(e) {
        return typeof e == "object" && e !== null;
    }
    function sg(e) {
        return "rcSerializedType" in e;
    }
    function Dc(e) {
        try {
            return new RegExp(e);
        } catch {
            I.error(`Invalid regex in the remote configuration: '${e}'`);
        }
    }
    function og(e, t) {
        const n = Dc(e.value);
        if (n === void 0) return;
        const r = n.exec(t);
        if (r === null) return;
        const [i, s] = r;
        return s || i;
    }
    async function ag(e) {
        let t;
        try {
            t = await fetch(cg(e));
        } catch {
            t = void 0;
        }
        if (!t || !t.ok) return { ok: !1, error: new Error("Error fetching the remote configuration.") };
        const n = await t.json();
        return n.rum ? { ok: !0, value: n.rum } : { ok: !1, error: new Error("No remote configuration for RUM.") };
    }
    function cg(e) {
        return e.remoteConfigurationProxy
            ? e.remoteConfigurationProxy
            : `https://sdk-configuration.${Wa("rum", e)}/${Qm}/${encodeURIComponent(e.remoteConfigurationId)}.json`;
    }
    function ug({ ignoreInitIfSyntheticsWillInjectRum: e = !0, startDeflateWorker: t }, n, r, i) {
        const s = dc(),
            o = Es();
        Ts(o, P.globalContext, s);
        const a = Ss();
        Ts(a, P.userContext, s);
        const c = ys();
        Ts(c, P.accountContext, s);
        let u, f, l, d;
        const p = n.observable.subscribe(m),
            h = {};
        function m() {
            if (!l || !d || !n.isGranted()) return;
            p.unsubscribe();
            let y;
            if (d.trackViewsManually) {
                if (!u) return;
                s.remove(u.callback), (y = u.options);
            }
            const T = i(d, f, y);
            s.drain(T);
        }
        function g(y, T) {
            const _ = Je();
            if ((_ && (y = lg(y)), (l = y), Ga(Bm(y)), d)) {
                Kr("DD_RUM", y);
                return;
            }
            const M = Dm(y, T);
            if (M) {
                if (!_ && !M.sessionStoreStrategyType) {
                    I.warn("No storage available for session. We will not send any data.");
                    return;
                }
                (M.compressIntakeRequests && !_ && t && ((f = t(M, "Datadog RUM", N)), !f)) ||
                    ((d = M), Zr().subscribe(N), n.tryToInit(M.trackingConsent), m());
            }
        }
        const w = (y) => {
            s.add((T) => T.addDurationVital(y));
        };
        return {
            init(y, T, _) {
                if (!y) {
                    I.error("Missing configuration");
                    return;
                }
                Ta(y.enableExperimentalFeatures),
                    (l = y),
                    !(e && Xr()) &&
                        (Rc(y.plugins, "onInit", { initConfiguration: y, publicApi: T }),
                        y.remoteConfigurationId
                            ? tg(y, { user: a, context: o })
                                  .then((M) => {
                                      M && g(M, _);
                                  })
                                  .catch(ze)
                            : g(y, _));
            },
            get initConfiguration() {
                return l;
            },
            getInternalContext: N,
            stopSession: N,
            addTiming(y, T = $()) {
                s.add((_) => _.addTiming(y, T));
            },
            startView(y, T = ne()) {
                const _ = (M) => {
                    M.startView(y, T);
                };
                s.add(_), u || ((u = { options: y, callback: _ }), m());
            },
            setViewName(y) {
                s.add((T) => T.setViewName(y));
            },
            setViewContext(y) {
                s.add((T) => T.setViewContext(y));
            },
            setViewContextProperty(y, T) {
                s.add((_) => _.setViewContextProperty(y, T));
            },
            getViewContext: () => h,
            globalContext: o,
            userContext: a,
            accountContext: c,
            addAction(y) {
                s.add((T) => T.addAction(y));
            },
            addError(y) {
                s.add((T) => T.addError(y));
            },
            addFeatureFlagEvaluation(y, T) {
                s.add((_) => _.addFeatureFlagEvaluation(y, T));
            },
            startDurationVital(y, T) {
                return Tc(r, y, T);
            },
            stopDurationVital(y, T) {
                Ic(w, r, y, T);
            },
            addDurationVital: w,
            addOperationStepVital: (y, T, _, M) => {
                s.add(($e) => $e.addOperationStepVital(j(y), T, j(_), j(M)));
            },
        };
    }
    function lg(e) {
        var t, n;
        return {
            ...e,
            applicationId: "00000000-aaaa-0000-aaaa-000000000000",
            clientToken: "empty",
            sessionSampleRate: 100,
            defaultPrivacyLevel:
                (t = e.defaultPrivacyLevel) !== null && t !== void 0
                    ? t
                    : (n = Jt()) === null || n === void 0
                      ? void 0
                      : n.getPrivacyLevel(),
        };
    }
    function Ts(e, t, n) {
        e.changeObservable.subscribe(() => {
            const r = e.getContext();
            n.add((i) => i[t].setContext(r));
        });
    }
    function dg(e, t, n, r = {}) {
        const i = _a(),
            s = Am(),
            o = _c().observable;
        let a = ug(r, i, s, (l, d, p) => {
            const h = e(
                l,
                t,
                n,
                p,
                d && r.createDeflateEncoder ? (m) => r.createDeflateEncoder(l, d, m) : ls,
                i,
                s,
                o,
                r.sdkName
            );
            return (
                t.onRumStart(h.lifeCycle, l, h.session, h.viewHistory, d, h.telemetry),
                n.onRumStart(h.lifeCycle, h.hooks, l, h.session, h.viewHistory),
                (a = fg(a, h)),
                Rc(l.plugins, "onRumStart", { strategy: a, addEvent: h.addEvent }),
                h
            );
        });
        const c = () => a,
            u = S((l) => {
                const d = typeof l == "object" ? l : { name: l };
                a.startView(d), oe({ feature: "start-view" });
            }),
            f = Xa({
                init: (l) => {
                    const d = new Error().stack;
                    ut(() => a.init(l, f, d));
                },
                setTrackingConsent: S((l) => {
                    i.update(l), oe({ feature: "set-tracking-consent", tracking_consent: l });
                }),
                setViewName: S((l) => {
                    a.setViewName(l), oe({ feature: "set-view-name" });
                }),
                setViewContext: S((l) => {
                    a.setViewContext(l), oe({ feature: "set-view-context" });
                }),
                setViewContextProperty: S((l, d) => {
                    a.setViewContextProperty(l, d), oe({ feature: "set-view-context-property" });
                }),
                getViewContext: S(() => (oe({ feature: "set-view-context-property" }), a.getViewContext())),
                getInternalContext: S((l) => a.getInternalContext(l)),
                getInitConfiguration: S(() => jr(a.initConfiguration)),
                addAction: (l, d) => {
                    const p = Sn("action");
                    ut(() => {
                        a.addAction({
                            name: j(l),
                            context: j(d),
                            startClocks: ne(),
                            type: ti.CUSTOM,
                            handlingStack: p,
                        }),
                            oe({ feature: "add-action" });
                    });
                },
                addError: (l, d) => {
                    const p = Sn("error");
                    ut(() => {
                        a.addError({ error: l, handlingStack: p, context: j(d), startClocks: ne() }),
                            oe({ feature: "add-error" });
                    });
                },
                addTiming: S((l, d) => {
                    a.addTiming(j(l), d);
                }),
                setGlobalContext: z(c, P.globalContext, H.setContext, "set-global-context"),
                getGlobalContext: z(c, P.globalContext, H.getContext, "get-global-context"),
                setGlobalContextProperty: z(c, P.globalContext, H.setContextProperty, "set-global-context-property"),
                removeGlobalContextProperty: z(
                    c,
                    P.globalContext,
                    H.removeContextProperty,
                    "remove-global-context-property"
                ),
                clearGlobalContext: z(c, P.globalContext, H.clearContext, "clear-global-context"),
                setUser: z(c, P.userContext, H.setContext, "set-user"),
                getUser: z(c, P.userContext, H.getContext, "get-user"),
                setUserProperty: z(c, P.userContext, H.setContextProperty, "set-user-property"),
                removeUserProperty: z(c, P.userContext, H.removeContextProperty, "remove-user-property"),
                clearUser: z(c, P.userContext, H.clearContext, "clear-user"),
                setAccount: z(c, P.accountContext, H.setContext, "set-account"),
                getAccount: z(c, P.accountContext, H.getContext, "get-account"),
                setAccountProperty: z(c, P.accountContext, H.setContextProperty, "set-account-property"),
                removeAccountProperty: z(c, P.accountContext, H.removeContextProperty, "remove-account-property"),
                clearAccount: z(c, P.accountContext, H.clearContext, "clear-account"),
                startView: u,
                stopSession: S(() => {
                    a.stopSession(), oe({ feature: "stop-session" });
                }),
                addFeatureFlagEvaluation: S((l, d) => {
                    a.addFeatureFlagEvaluation(j(l), j(d)), oe({ feature: "add-feature-flag-evaluation" });
                }),
                getSessionReplayLink: S(() => t.getSessionReplayLink()),
                startSessionReplayRecording: S((l) => {
                    t.start(l), oe({ feature: "start-session-replay-recording", force: l && l.force });
                }),
                stopSessionReplayRecording: S(() => t.stop()),
                addDurationVital: S((l, d) => {
                    oe({ feature: "add-duration-vital" }),
                        a.addDurationVital({
                            name: j(l),
                            type: ur.DURATION,
                            startClocks: Jd(d.startTime),
                            duration: d.duration,
                            context: j(d && d.context),
                            description: j(d && d.description),
                        });
                }),
                startDurationVital: S(
                    (l, d) => (
                        oe({ feature: "start-duration-vital" }),
                        a.startDurationVital(j(l), { context: j(d && d.context), description: j(d && d.description) })
                    )
                ),
                stopDurationVital: S((l, d) => {
                    oe({ feature: "stop-duration-vital" }),
                        a.stopDurationVital(typeof l == "string" ? j(l) : l, {
                            context: j(d && d.context),
                            description: j(d && d.description),
                        });
                }),
                startFeatureOperation: S((l, d) => {
                    oe({ feature: "add-operation-step-vital", action_type: "start" }),
                        a.addOperationStepVital(l, "start", d);
                }),
                succeedFeatureOperation: S((l, d) => {
                    oe({ feature: "add-operation-step-vital", action_type: "succeed" }),
                        a.addOperationStepVital(l, "end", d);
                }),
                failFeatureOperation: S((l, d, p) => {
                    oe({ feature: "add-operation-step-vital", action_type: "fail" }),
                        a.addOperationStepVital(l, "end", p, d);
                }),
            });
        return f;
    }
    function fg(e, t) {
        return {
            init: (n) => {
                Kr("DD_RUM", n);
            },
            initConfiguration: e.initConfiguration,
            ...t,
        };
    }
    function pg() {
        const e = Pc();
        return new D((t) => {
            if (!e) return;
            const n = new e(S((r) => t.notify(r)));
            return (
                n.observe(document, { attributes: !0, characterData: !0, childList: !0, subtree: !0 }),
                () => n.disconnect()
            );
        });
    }
    function Pc() {
        let e;
        const t = window;
        if (t.Zone && ((e = It(t, "MutationObserver")), t.MutationObserver && e === t.MutationObserver)) {
            const n = new t.MutationObserver(N),
                r = It(n, "originalInstance");
            e = r && r.constructor;
        }
        return e || (e = t.MutationObserver), e;
    }
    function hg() {
        const e = new D(),
            { stop: t } = Te(window, "open", () => e.notify());
        return { observable: e, stop: t };
    }
    function mg(e, t, n, r, i) {
        return {
            get: (s) => {
                const o = n.findView(s),
                    a = i.findUrl(s),
                    c = t.findTrackedSession(s);
                if (c && o && a) {
                    const u = r.findActionId(s);
                    return {
                        application_id: e,
                        session_id: c.id,
                        user_action: u ? { id: u } : void 0,
                        view: { id: o.id, name: o.name, referrer: a.referrer, url: a.url },
                    };
                }
            },
        };
    }
    const gg = ac,
        _g = Gt;
    function bg(e) {
        const t = kn({ expireDelay: _g });
        e.subscribe(1, (r) => {
            t.add(n(r), r.startClocks.relative);
        }),
            e.subscribe(6, ({ endClocks: r }) => {
                t.closeActive(r.relative);
            }),
            e.subscribe(3, (r) => {
                const i = t.find(r.startClocks.relative);
                i &&
                    (r.name && (i.name = r.name),
                    r.context && (i.context = r.context),
                    (i.sessionIsActive = r.sessionIsActive));
            }),
            e.subscribe(10, () => {
                t.reset();
            });
        function n(r) {
            return {
                service: r.service,
                version: r.version,
                context: r.context,
                id: r.id,
                name: r.name,
                startClocks: r.startClocks,
            };
        }
        return {
            findView: (r) => t.find(r),
            stop: () => {
                t.stop();
            },
        };
    }
    const Uc = "initial_document",
        yg = [
            [_e.DOCUMENT, (e) => Uc === e],
            [_e.XHR, (e) => e === "xmlhttprequest"],
            [_e.FETCH, (e) => e === "fetch"],
            [_e.BEACON, (e) => e === "beacon"],
            [_e.CSS, (e, t) => /\.css$/i.test(t)],
            [_e.JS, (e, t) => /\.js$/i.test(t)],
            [
                _e.IMAGE,
                (e, t) =>
                    ["image", "img", "icon"].includes(e) || /\.(gif|jpg|jpeg|tiff|png|svg|ico)$/i.exec(t) !== null,
            ],
            [_e.FONT, (e, t) => /\.(woff|eot|woff2|ttf)$/i.exec(t) !== null],
            [_e.MEDIA, (e, t) => ["audio", "video"].includes(e) || /\.(mp3|mp4)$/i.exec(t) !== null],
        ];
    function Eg(e) {
        const t = e.name;
        if (!df(t)) return _e.OTHER;
        const n = ff(t);
        for (const [r, i] of yg) if (i(e.initiatorType, n)) return r;
        return _e.OTHER;
    }
    function Fc(...e) {
        for (let t = 1; t < e.length; t += 1) if (e[t - 1] > e[t]) return !1;
        return !0;
    }
    function $c(e) {
        return e.initiatorType === "xmlhttprequest" || e.initiatorType === "fetch";
    }
    function Sg(e) {
        const { duration: t, startTime: n, responseEnd: r } = e;
        return t === 0 && n < r ? Q(n, r) : t;
    }
    function vg(e) {
        if (!Vc(e)) return;
        const {
                startTime: t,
                fetchStart: n,
                workerStart: r,
                redirectStart: i,
                redirectEnd: s,
                domainLookupStart: o,
                domainLookupEnd: a,
                connectStart: c,
                secureConnectionStart: u,
                connectEnd: f,
                requestStart: l,
                responseStart: d,
                responseEnd: p,
            } = e,
            h = { download: en(t, d, p), first_byte: en(t, l, d) };
        return (
            0 < r && r < n && (h.worker = en(t, r, n)),
            n < f && ((h.connect = en(t, c, f)), c <= u && u <= f && (h.ssl = en(t, u, f))),
            n < a && (h.dns = en(t, o, a)),
            t < s && (h.redirect = en(t, i, s)),
            h
        );
    }
    function Bc(e) {
        return e.duration >= 0;
    }
    function Vc(e) {
        const t = Fc(
                e.startTime,
                e.fetchStart,
                e.domainLookupStart,
                e.domainLookupEnd,
                e.connectStart,
                e.connectEnd,
                e.requestStart,
                e.responseStart,
                e.responseEnd
            ),
            n = wg(e) ? Fc(e.startTime, e.redirectStart, e.redirectEnd, e.fetchStart) : !0;
        return t && n;
    }
    function wg(e) {
        return e.redirectEnd > e.startTime;
    }
    function en(e, t, n) {
        if (e <= t && t <= n) return { duration: O(Q(t, n)), start: O(Q(e, t)) };
    }
    function Tg(e) {
        return e.nextHopProtocol === "" ? void 0 : e.nextHopProtocol;
    }
    function Ig(e) {
        return e.deliveryType === "" ? "other" : e.deliveryType;
    }
    function Ag(e) {
        if (e.startTime < e.responseStart) {
            const { encodedBodySize: t, decodedBodySize: n, transferSize: r } = e;
            return { size: n, encoded_body_size: t, decoded_body_size: n, transfer_size: r };
        }
        return { size: void 0, encoded_body_size: void 0, decoded_body_size: void 0, transfer_size: void 0 };
    }
    function Is(e) {
        return e && (!Ka(e) || wn(lt.TRACK_INTAKE_REQUESTS));
    }
    const Rg = /data:(.+)?(;base64)?,/g,
        Cg = 24e3;
    function zc(e, t = Cg) {
        if (e.length <= t || !e.startsWith("data:")) return e;
        const n = e.substring(0, 100).match(Rg);
        return n ? `${n[0]}[...]` : e;
    }
    let Hc = 1;
    function kg(e, t, n, r, i) {
        const s = Lm(t, n, r, i);
        xg(e, t, s), Og(e, s);
    }
    function xg(e, t, n) {
        const r = cc(t).subscribe((i) => {
            const s = i;
            if (Is(s.url))
                switch (s.state) {
                    case "start":
                        n.traceXhr(s, s.xhr),
                            (s.requestIndex = Gc()),
                            e.notify(7, { requestIndex: s.requestIndex, url: s.url });
                        break;
                    case "complete":
                        n.clearTracingIfNeeded(s),
                            e.notify(8, {
                                duration: s.duration,
                                method: s.method,
                                requestIndex: s.requestIndex,
                                spanId: s.spanId,
                                startClocks: s.startClocks,
                                status: s.status,
                                traceId: s.traceId,
                                traceSampled: s.traceSampled,
                                type: Qt.XHR,
                                url: s.url,
                                xhr: s.xhr,
                                isAborted: s.isAborted,
                                handlingStack: s.handlingStack,
                                body: s.body,
                            });
                        break;
                }
        });
        return { stop: () => r.unsubscribe() };
    }
    function Og(e, t) {
        const n = Zr().subscribe((r) => {
            const i = r;
            if (Is(i.url))
                switch (i.state) {
                    case "start":
                        t.traceFetch(i),
                            (i.requestIndex = Gc()),
                            e.notify(7, { requestIndex: i.requestIndex, url: i.url });
                        break;
                    case "resolve":
                        Ng(i, (s) => {
                            var o;
                            t.clearTracingIfNeeded(i),
                                e.notify(8, {
                                    duration: s,
                                    method: i.method,
                                    requestIndex: i.requestIndex,
                                    responseType: i.responseType,
                                    spanId: i.spanId,
                                    startClocks: i.startClocks,
                                    status: i.status,
                                    traceId: i.traceId,
                                    traceSampled: i.traceSampled,
                                    type: Qt.FETCH,
                                    url: i.url,
                                    response: i.response,
                                    init: i.init,
                                    input: i.input,
                                    isAborted: i.isAborted,
                                    handlingStack: i.handlingStack,
                                    body: (o = i.init) === null || o === void 0 ? void 0 : o.body,
                                });
                        });
                        break;
                }
        });
        return { stop: () => n.unsubscribe() };
    }
    function Gc() {
        const e = Hc;
        return (Hc += 1), e;
    }
    function Ng(e, t) {
        const n = e.response && ka(e.response);
        !n || !n.body
            ? t(Q(e.startClocks.timeStamp, $()))
            : gc(
                  n.body,
                  () => {
                      t(Q(e.startClocks.timeStamp, $()));
                  },
                  { bytesLimit: Number.POSITIVE_INFINITY, collectStreamBody: !1 }
              );
    }
    function jc(e) {
        return Wn(e) && e < 0 ? void 0 : e;
    }
    function Wc({ lifeCycle: e, isChildEvent: t, onChange: n = N }) {
        const r = { errorCount: 0, longTaskCount: 0, resourceCount: 0, actionCount: 0, frustrationCount: 0 },
            i = e.subscribe(13, (s) => {
                var o;
                if (!(s.type === "view" || s.type === "vital" || !t(s)))
                    switch (s.type) {
                        case C.ERROR:
                            (r.errorCount += 1), n();
                            break;
                        case C.ACTION:
                            (r.actionCount += 1),
                                s.action.frustration && (r.frustrationCount += s.action.frustration.type.length),
                                n();
                            break;
                        case C.LONG_TASK:
                            (r.longTaskCount += 1), n();
                            break;
                        case C.RESOURCE:
                            (!((o = s._dd) === null || o === void 0) && o.discarded) || ((r.resourceCount += 1), n());
                            break;
                    }
            });
        return {
            stop: () => {
                i.unsubscribe();
            },
            eventCounts: r,
        };
    }
    function Lg(e, t) {
        const n = ge();
        let r = !1;
        const { stop: i } = we(
            e,
            window,
            ["click", "mousedown", "keydown", "touchstart", "pointerdown"],
            (a) => {
                if (!a.cancelable) return;
                const c = {
                    entryType: "first-input",
                    processingStart: Ce(),
                    processingEnd: Ce(),
                    startTime: a.timeStamp,
                    duration: 0,
                    name: "",
                    cancelable: !1,
                    target: null,
                    toJSON: () => ({}),
                };
                a.type === "pointerdown" ? s(e, c) : o(c);
            },
            { passive: !0, capture: !0 }
        );
        return { stop: i };
        function s(a, c) {
            we(
                a,
                window,
                ["pointerup", "pointercancel"],
                (u) => {
                    u.type === "pointerup" && o(c);
                },
                { once: !0 }
            );
        }
        function o(a) {
            if (!r) {
                (r = !0), i();
                const c = a.processingStart - a.startTime;
                c >= 0 && c < ge() - n && t(a);
            }
        }
    }
    var F;
    (function (e) {
        (e.EVENT = "event"),
            (e.FIRST_INPUT = "first-input"),
            (e.LARGEST_CONTENTFUL_PAINT = "largest-contentful-paint"),
            (e.LAYOUT_SHIFT = "layout-shift"),
            (e.LONG_TASK = "longtask"),
            (e.LONG_ANIMATION_FRAME = "long-animation-frame"),
            (e.NAVIGATION = "navigation"),
            (e.PAINT = "paint"),
            (e.RESOURCE = "resource"),
            (e.VISIBILITY_STATE = "visibility-state");
    })(F || (F = {}));
    function Ze(e, t) {
        return new D((n) => {
            if (!window.PerformanceObserver) return;
            const r = (c) => {
                const u = Pg(c);
                u.length > 0 && n.notify(u);
            };
            let i,
                s = !0;
            const o = new PerformanceObserver(
                S((c) => {
                    s ? (i = ae(() => r(c.getEntries()))) : r(c.getEntries());
                })
            );
            try {
                o.observe(t);
            } catch {
                if ([F.RESOURCE, F.NAVIGATION, F.LONG_TASK, F.PAINT].includes(t.type)) {
                    t.buffered && (i = ae(() => r(performance.getEntriesByType(t.type))));
                    try {
                        o.observe({ entryTypes: [t.type] });
                    } catch {
                        return;
                    }
                }
            }
            (s = !1), Mg(e);
            let a;
            return (
                !xt(F.FIRST_INPUT) &&
                    t.type === F.FIRST_INPUT &&
                    ({ stop: a } = Lg(e, (c) => {
                        r([c]);
                    })),
                () => {
                    o.disconnect(), a && a(), Se(i);
                }
            );
        });
    }
    let lr;
    function Mg(e) {
        return (
            !lr &&
                Dg() &&
                "addEventListener" in performance &&
                (lr = J(e, performance, "resourcetimingbufferfull", () => {
                    performance.clearResourceTimings();
                })),
            () => {
                lr?.stop();
            }
        );
    }
    function Dg() {
        return window.performance !== void 0 && "getEntries" in performance;
    }
    function xt(e) {
        return (
            window.PerformanceObserver &&
            PerformanceObserver.supportedEntryTypes !== void 0 &&
            PerformanceObserver.supportedEntryTypes.includes(e)
        );
    }
    function Pg(e) {
        return e.filter((t) => !Ug(t));
    }
    function Ug(e) {
        return e.entryType === F.RESOURCE && (!Is(e.name) || !Bc(e));
    }
    function As(e) {
        return e.nodeType === Node.TEXT_NODE;
    }
    function Fg(e) {
        return e.nodeType === Node.COMMENT_NODE;
    }
    function ht(e) {
        return e.nodeType === Node.ELEMENT_NODE;
    }
    function ni(e) {
        return ht(e) && !!e.shadowRoot;
    }
    function Rs(e) {
        const t = e;
        return !!t.host && t.nodeType === Node.DOCUMENT_FRAGMENT_NODE && ht(t.host);
    }
    function $g(e) {
        return e.childNodes.length > 0 || ni(e);
    }
    function Kc(e, t) {
        let n = e.firstChild;
        for (; n; ) t(n), (n = n.nextSibling);
        ni(e) && t(e.shadowRoot);
    }
    function ri(e) {
        return Rs(e) ? e.host : e.parentNode;
    }
    const qc = 100,
        Bg = 100,
        Yc = "data-dd-excluded-activity-mutations";
    function Cs(e, t, n, r, i, s) {
        const o = zg(e, t, n, r);
        return Vg(o, i, s);
    }
    function Vg(e, t, n) {
        let r,
            i = !1;
        const s = ae(
                S(() => u({ hadActivity: !1 })),
                qc
            ),
            o =
                n !== void 0
                    ? ae(
                          S(() => u({ hadActivity: !0, end: $() })),
                          n
                      )
                    : void 0,
            a = e.subscribe(({ isBusy: f }) => {
                Se(s), Se(r);
                const l = $();
                f ||
                    (r = ae(
                        S(() => u({ hadActivity: !0, end: l })),
                        Bg
                    ));
            }),
            c = () => {
                (i = !0), Se(s), Se(r), Se(o), a.unsubscribe();
            };
        function u(f) {
            i || (c(), t(f));
        }
        return { stop: c };
    }
    function zg(e, t, n, r) {
        return new D((i) => {
            const s = [];
            let o,
                a = 0;
            return (
                s.push(
                    t.subscribe((u) => {
                        u.every(Hg) || c();
                    }),
                    n.subscribe(c),
                    Ze(r, { type: F.RESOURCE }).subscribe((u) => {
                        u.some((f) => !ks(r, f.name)) && c();
                    }),
                    e.subscribe(7, (u) => {
                        ks(r, u.url) || (o === void 0 && (o = u.requestIndex), (a += 1), c());
                    }),
                    e.subscribe(8, (u) => {
                        ks(r, u.url) || o === void 0 || u.requestIndex < o || ((a -= 1), c());
                    })
                ),
                () => {
                    s.forEach((u) => u.unsubscribe());
                }
            );
            function c() {
                i.notify({ isBusy: a > 0 });
            }
        });
    }
    function ks(e, t) {
        return $r(e.excludedActivityUrls, t);
    }
    function Hg(e) {
        const t = e.type === "characterData" ? e.target.parentElement : e.target;
        return !!(t && ht(t) && t.matches(`[${Yc}], [${Yc}] *`));
    }
    const ii = "data-dd-action-name",
        Gg = "Masked Element",
        Xc = [
            ii,
            "data-testid",
            "data-test",
            "data-qa",
            "data-cy",
            "data-test-id",
            "data-qa-id",
            "data-testing",
            "data-component",
            "data-element",
            "data-source-file",
        ],
        jg = [Zc, Kg],
        Wg = [Zc, qg, Yg];
    function dr(e, t) {
        if (!e.isConnected) return;
        let n,
            r = e;
        for (; r && r.nodeName !== "HTML"; ) {
            const i = Qc(r, jg, Jg, t, n);
            if (i) return i;
            (n = Qc(r, Wg, Zg, t, n) || si(Xg(r), n)), (r = r.parentElement);
        }
        return n;
    }
    function Jc(e) {
        return /[0-9]/.test(e);
    }
    function Kg(e) {
        if (e.id && !Jc(e.id)) return `#${CSS.escape(e.id)}`;
    }
    function qg(e) {
        if (e.tagName === "BODY") return;
        const t = e.classList;
        for (let n = 0; n < t.length; n += 1) {
            const r = t[n];
            if (!Jc(r)) return `${CSS.escape(e.tagName)}.${CSS.escape(r)}`;
        }
    }
    function Yg(e) {
        return CSS.escape(e.tagName);
    }
    function Zc(e, t) {
        if (t) {
            const r = n(t);
            if (r) return r;
        }
        for (const r of Xc) {
            const i = n(r);
            if (i) return i;
        }
        function n(r) {
            if (e.hasAttribute(r)) return `${CSS.escape(e.tagName)}[${r}="${CSS.escape(e.getAttribute(r))}"]`;
        }
    }
    function Xg(e) {
        let t = e.parentElement.firstElementChild,
            n = 1;
        for (; t && t !== e; ) t.tagName === e.tagName && (n += 1), (t = t.nextElementSibling);
        return `${CSS.escape(e.tagName)}:nth-of-type(${n})`;
    }
    function Qc(e, t, n, r, i) {
        for (const s of t) {
            const o = s(e, r);
            if (o && n(e, o, i)) return si(o, i);
        }
    }
    function Jg(e, t, n) {
        return e.ownerDocument.querySelectorAll(si(t, n)).length === 1;
    }
    function Zg(e, t, n) {
        let r;
        if (n === void 0) r = (o) => o.matches(t);
        else {
            const o = si(`${t}:scope`, n);
            r = (a) => a.querySelector(o) !== null;
        }
        let s = e.parentElement.firstElementChild;
        for (; s; ) {
            if (s !== e && r(s)) return !1;
            s = s.nextElementSibling;
        }
        return !0;
    }
    function si(e, t) {
        return t ? `${e}>${t}` : e;
    }
    const v = {
            IGNORE: "ignore",
            HIDDEN: "hidden",
            ALLOW: An.ALLOW,
            MASK: An.MASK,
            MASK_USER_INPUT: An.MASK_USER_INPUT,
            MASK_UNLESS_ALLOWLISTED: An.MASK_UNLESS_ALLOWLISTED,
        },
        xs = "data-dd-privacy",
        Qg = "hidden",
        e_ = "dd-privacy-",
        Ot = "***",
        eu = "data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==",
        t_ = { INPUT: !0, OUTPUT: !0, TEXTAREA: !0, SELECT: !0, OPTION: !0, DATALIST: !0, OPTGROUP: !0 },
        n_ = "x";
    function tn(e) {
        return `[${xs}="${e}"], .${e_}${e}`;
    }
    function Ge(e, t, n) {
        if (n && n.has(e)) return n.get(e);
        const r = ri(e),
            i = r ? Ge(r, t, n) : t,
            s = nu(e),
            o = tu(s, i);
        return n && n.set(e, o), o;
    }
    function tu(e, t) {
        switch (t) {
            case v.HIDDEN:
            case v.IGNORE:
                return t;
        }
        switch (e) {
            case v.ALLOW:
            case v.MASK:
            case v.MASK_USER_INPUT:
            case v.MASK_UNLESS_ALLOWLISTED:
            case v.HIDDEN:
            case v.IGNORE:
                return e;
            default:
                return t;
        }
    }
    function nu(e) {
        if (ht(e)) {
            if (e.tagName === "BASE") return v.ALLOW;
            if (e.tagName === "INPUT") {
                const t = e;
                if (t.type === "password" || t.type === "email" || t.type === "tel" || t.type === "hidden")
                    return v.MASK;
                const n = t.getAttribute("autocomplete");
                if (n && (n.startsWith("cc-") || n.endsWith("-password"))) return v.MASK;
            }
            if (e.matches(tn(v.HIDDEN))) return v.HIDDEN;
            if (e.matches(tn(v.MASK))) return v.MASK;
            if (e.matches(tn(v.MASK_UNLESS_ALLOWLISTED))) return v.MASK_UNLESS_ALLOWLISTED;
            if (e.matches(tn(v.MASK_USER_INPUT))) return v.MASK_USER_INPUT;
            if (e.matches(tn(v.ALLOW))) return v.ALLOW;
            if (r_(e)) return v.IGNORE;
        }
    }
    function fr(e, t) {
        switch (t) {
            case v.MASK:
            case v.HIDDEN:
            case v.IGNORE:
                return !0;
            case v.MASK_UNLESS_ALLOWLISTED:
                return As(e) ? (oi(e.parentNode) ? !0 : !su(e.textContent || "")) : oi(e);
            case v.MASK_USER_INPUT:
                return As(e) ? oi(e.parentNode) : oi(e);
            default:
                return !1;
        }
    }
    function oi(e) {
        if (!e || e.nodeType !== e.ELEMENT_NODE) return !1;
        const t = e;
        if (t.tagName === "INPUT")
            switch (t.type) {
                case "button":
                case "color":
                case "reset":
                case "submit":
                    return !1;
            }
        return !!t_[t.tagName];
    }
    const ru = (e) => e.replace(/\S/g, n_);
    function iu(e, t, n) {
        var r;
        const i = (r = e.parentElement) === null || r === void 0 ? void 0 : r.tagName;
        let s = e.textContent || "";
        if (t && !s.trim()) return;
        const o = n;
        if (i === "SCRIPT") s = Ot;
        else if (o === v.HIDDEN) s = Ot;
        else if (fr(e, o))
            if (i === "DATALIST" || i === "SELECT" || i === "OPTGROUP") {
                if (!s.trim()) return;
            } else i === "OPTION" ? (s = Ot) : o === v.MASK_UNLESS_ALLOWLISTED ? (s = i_(s)) : (s = ru(s));
        return s;
    }
    function r_(e) {
        if (e.nodeName === "SCRIPT") return !0;
        if (e.nodeName === "LINK") {
            const n = t("rel");
            return (/preload|prefetch/i.test(n) && t("as") === "script") || n === "shortcut icon" || n === "icon";
        }
        if (e.nodeName === "META") {
            const n = t("name"),
                r = t("rel"),
                i = t("property");
            return (
                /^msapplication-tile(image|color)$/.test(n) ||
                n === "application-name" ||
                r === "icon" ||
                r === "apple-touch-icon" ||
                r === "shortcut icon" ||
                n === "keywords" ||
                n === "description" ||
                /^(og|twitter|fb):/.test(i) ||
                /^(og|twitter):/.test(n) ||
                n === "pinterest" ||
                n === "robots" ||
                n === "googlebot" ||
                n === "bingbot" ||
                e.hasAttribute("http-equiv") ||
                n === "author" ||
                n === "generator" ||
                n === "framework" ||
                n === "publisher" ||
                n === "progid" ||
                /^article:/.test(i) ||
                /^product:/.test(i) ||
                n === "google-site-verification" ||
                n === "yandex-verification" ||
                n === "csrf-token" ||
                n === "p:domain_verify" ||
                n === "verify-v1" ||
                n === "verification" ||
                n === "shopify-checkout-api-token"
            );
        }
        function t(n) {
            return (e.getAttribute(n) || "").toLowerCase();
        }
        return !1;
    }
    function su(e) {
        var t;
        return !e || !e.trim()
            ? !0
            : ((t = window.$DD_ALLOW) === null || t === void 0 ? void 0 : t.has(e.toLocaleLowerCase())) || !1;
    }
    function i_(e, t) {
        return su(e) ? e : t || ru(e);
    }
    const ou = ue,
        s_ = 100;
    function o_(e, t) {
        const n = [];
        let r = 0,
            i;
        s(e);
        function s(c) {
            c.stopObservable.subscribe(o), n.push(c), Se(i), (i = ae(a, ou));
        }
        function o() {
            r === 1 && n.every((c) => c.isStopped()) && ((r = 2), t(n));
        }
        function a() {
            Se(i), r === 0 && ((r = 1), o());
        }
        return {
            tryAppend: (c) =>
                r !== 0 ? !1 : n.length > 0 && !a_(n[n.length - 1].event, c.event) ? (a(), !1) : (s(c), !0),
            stop: () => {
                a();
            },
        };
    }
    function a_(e, t) {
        return e.target === t.target && c_(e, t) <= s_ && e.timeStamp - t.timeStamp <= ou;
    }
    function c_(e, t) {
        return Math.sqrt(Math.pow(e.clientX - t.clientX, 2) + Math.pow(e.clientY - t.clientY, 2));
    }
    function u_(e, t, n = v.ALLOW) {
        const { actionNameAttribute: r } = t,
            i = au(e, ii) || (r && au(e, r));
        return i
            ? { name: i, nameSource: "custom_attribute" }
            : n === v.MASK
              ? { name: Gg, nameSource: "mask_placeholder" }
              : cu(e, l_, t) || cu(e, d_, t) || { name: "", nameSource: "blank" };
    }
    function au(e, t) {
        const n = e.closest(`[${t}]`);
        if (!n) return;
        const r = n.getAttribute(t);
        return lu(uu(r.trim()));
    }
    const l_ = [
            (e, t) => {
                if ("labels" in e && e.labels && e.labels.length > 0) return ai(e.labels[0], t);
            },
            (e) => {
                if (e.nodeName === "INPUT") {
                    const t = e,
                        n = t.getAttribute("type");
                    if (n === "button" || n === "submit" || n === "reset")
                        return { name: t.value, nameSource: "text_content" };
                }
            },
            (e, t) => {
                if (e.nodeName === "BUTTON" || e.nodeName === "LABEL" || e.getAttribute("role") === "button")
                    return ai(e, t);
            },
            (e) => pr(e, "aria-label"),
            (e, t) => {
                const n = e.getAttribute("aria-labelledby");
                if (n)
                    return {
                        name: n
                            .split(/\s+/)
                            .map((r) => p_(e, r))
                            .filter((r) => !!r)
                            .map((r) => du(r, t))
                            .join(" "),
                        nameSource: "text_content",
                    };
            },
            (e) => pr(e, "alt"),
            (e) => pr(e, "name"),
            (e) => pr(e, "title"),
            (e) => pr(e, "placeholder"),
            (e, t) => {
                if ("options" in e && e.options.length > 0) return ai(e.options[0], t);
            },
        ],
        d_ = [(e, t) => ai(e, t)],
        f_ = 10;
    function cu(e, t, n) {
        let r = e,
            i = 0;
        for (; i <= f_ && r && r.nodeName !== "BODY" && r.nodeName !== "HTML" && r.nodeName !== "HEAD"; ) {
            for (const s of t) {
                const o = s(r, n);
                if (o) {
                    const { name: a, nameSource: c } = o,
                        u = a && a.trim();
                    if (u) return { name: lu(uu(u)), nameSource: c };
                }
            }
            if (r.nodeName === "FORM") break;
            (r = r.parentElement), (i += 1);
        }
    }
    function uu(e) {
        return e.replace(/\s+/g, " ");
    }
    function lu(e) {
        return e.length > 100 ? `${Hi(e, 100)} [...]` : e;
    }
    function p_(e, t) {
        return e.ownerDocument ? e.ownerDocument.getElementById(t) : null;
    }
    function pr(e, t) {
        return { name: e.getAttribute(t) || "", nameSource: "standard_attribute" };
    }
    function ai(e, t) {
        return { name: du(e, t) || "", nameSource: "text_content" };
    }
    function du(e, t) {
        if (e.isContentEditable) return;
        const { enablePrivacyForActionName: n, actionNameAttribute: r, defaultPrivacyLevel: i } = t;
        if (wn(lt.USE_TREE_WALKER_FOR_ACTION_NAME)) return h_(e, r, n, i);
        if ("innerText" in e) {
            let s = e.innerText;
            const o = (a) => {
                const c = e.querySelectorAll(a);
                for (let u = 0; u < c.length; u += 1) {
                    const f = c[u];
                    if ("innerText" in f) {
                        const l = f.innerText;
                        l && l.trim().length > 0 && (s = s.replace(l, ""));
                    }
                }
            };
            return o(`[${ii}]`), r && o(`[${r}]`), n && o(`${tn(v.HIDDEN)}, ${tn(v.MASK)}`), s;
        }
        return e.textContent;
    }
    function h_(e, t, n, r) {
        const i = new Map(),
            s = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, a);
        let o = "";
        for (; s.nextNode(); ) {
            const c = s.currentNode;
            if (ht(c)) {
                (c.nodeName === "BR" ||
                    c.nodeName === "P" ||
                    ["block", "flex", "grid", "list-item", "table", "table-caption"].includes(
                        getComputedStyle(c).display
                    )) &&
                    (o += " ");
                continue;
            }
            o += c.textContent || "";
        }
        return o.replace(/\s+/g, " ").trim();
        function a(c) {
            const u = Ge(c, r, i);
            if (n && u && fr(c, u)) return NodeFilter.FILTER_REJECT;
            if (ht(c)) {
                if (c.hasAttribute(ii) || (t && c.hasAttribute(t))) return NodeFilter.FILTER_REJECT;
                const f = getComputedStyle(c);
                if (
                    f.visibility !== "visible" ||
                    f.display === "none" ||
                    (f.contentVisibility && f.contentVisibility !== "visible")
                )
                    return NodeFilter.FILTER_REJECT;
            }
            return NodeFilter.FILTER_ACCEPT;
        }
    }
    function m_(e, { onPointerDown: t, onPointerUp: n }) {
        let r,
            i = { selection: !1, input: !1, scroll: !1 },
            s;
        const o = [
            J(
                e,
                window,
                "pointerdown",
                (a) => {
                    pu(a) && ((r = fu()), (i = { selection: !1, input: !1, scroll: !1 }), (s = t(a)));
                },
                { capture: !0 }
            ),
            J(
                e,
                window,
                "selectionchange",
                () => {
                    (!r || !fu()) && (i.selection = !0);
                },
                { capture: !0 }
            ),
            J(
                e,
                window,
                "scroll",
                () => {
                    i.scroll = !0;
                },
                { capture: !0, passive: !0 }
            ),
            J(
                e,
                window,
                "pointerup",
                (a) => {
                    if (pu(a) && s) {
                        const c = i;
                        n(s, a, () => c), (s = void 0);
                    }
                },
                { capture: !0 }
            ),
            J(
                e,
                window,
                "input",
                () => {
                    i.input = !0;
                },
                { capture: !0 }
            ),
        ];
        return {
            stop: () => {
                o.forEach((a) => a.stop());
            },
        };
    }
    function fu() {
        const e = window.getSelection();
        return !e || e.isCollapsed;
    }
    function pu(e) {
        return e.target instanceof Element && e.isPrimary !== !1;
    }
    const hu = 3;
    function g_(e, t) {
        if (__(e))
            return (
                t.addFrustration(cr.RAGE_CLICK),
                e.some(mu) && t.addFrustration(cr.DEAD_CLICK),
                t.hasError && t.addFrustration(cr.ERROR_CLICK),
                { isRage: !0 }
            );
        const n = e.some((r) => r.getUserActivity().selection);
        return (
            e.forEach((r) => {
                r.hasError && r.addFrustration(cr.ERROR_CLICK), mu(r) && !n && r.addFrustration(cr.DEAD_CLICK);
            }),
            { isRage: !1 }
        );
    }
    function __(e) {
        if (e.some((t) => t.getUserActivity().selection || t.getUserActivity().scroll)) return !1;
        for (let t = 0; t < e.length - (hu - 1); t += 1)
            if (e[t + hu - 1].event.timeStamp - e[t].event.timeStamp <= ue) return !0;
        return !1;
    }
    const b_ =
        'input:not([type="checkbox"]):not([type="radio"]):not([type="button"]):not([type="submit"]):not([type="reset"]):not([type="range"]),textarea,select,[contenteditable],[contenteditable] *,canvas,a[href],a[href] *';
    function mu(e) {
        if (e.hasPageActivity || e.getUserActivity().input || e.getUserActivity().scroll) return !1;
        let t = e.event.target;
        return (
            t.tagName === "LABEL" && t.hasAttribute("for") && (t = document.getElementById(t.getAttribute("for"))),
            !t || !t.matches(b_)
        );
    }
    const gu = 10 * ue,
        hr = new Map();
    function y_(e) {
        const t = hr.get(e);
        return hr.delete(e), t;
    }
    function _u(e, t) {
        hr.set(e, t),
            hr.forEach((n, r) => {
                Q(r, Ce()) > gu && hr.delete(r);
            });
    }
    const E_ = 5 * me;
    function S_(e, t, n, r) {
        const i = kn({ expireDelay: E_ }),
            s = new D();
        let o;
        e.subscribe(10, () => {
            i.reset();
        }),
            e.subscribe(5, f),
            e.subscribe(11, (l) => {
                l.reason === Tn.UNLOADING && f();
            });
        const { stop: a } = m_(r, {
            onPointerDown: (l) => v_(r, e, t, l, n),
            onPointerUp: ({ clickActionBase: l, hadActivityOnPointerDown: d }, p, h) => {
                w_(r, e, t, n, i, s, u, l, p, h, d);
            },
        });
        return {
            stop: () => {
                f(), s.notify(), a();
            },
            actionContexts: { findActionId: (l) => i.findAll(l) },
        };
        function u(l) {
            if (!o || !o.tryAppend(l)) {
                const d = l.clone();
                o = o_(l, (p) => {
                    I_(p, d);
                });
            }
        }
        function f() {
            o && o.stop();
        }
    }
    function v_(e, t, n, r, i) {
        let s;
        if ((e.enablePrivacyForActionName ? (s = Ge(r.target, e.defaultPrivacyLevel)) : (s = v.ALLOW), s === v.HIDDEN))
            return;
        const o = T_(r, s, e);
        let a = !1;
        return (
            Cs(
                t,
                n,
                i,
                e,
                (c) => {
                    a = c.hadActivity;
                },
                qc
            ),
            { clickActionBase: o, hadActivityOnPointerDown: () => a }
        );
    }
    function w_(e, t, n, r, i, s, o, a, c, u, f) {
        var l;
        const d = bu(t, i, u, a, c);
        o(d);
        const p = (l = a?.target) === null || l === void 0 ? void 0 : l.selector;
        p && _u(c.timeStamp, p);
        const { stop: h } = Cs(
                t,
                n,
                r,
                e,
                (w) => {
                    w.hadActivity && w.end < d.startClocks.timeStamp
                        ? d.discard()
                        : w.hadActivity
                          ? d.stop(w.end)
                          : f()
                            ? d.stop(d.startClocks.timeStamp)
                            : d.stop();
                },
                gu
            ),
            m = t.subscribe(5, ({ endClocks: w }) => {
                d.stop(w.timeStamp);
            }),
            g = s.subscribe(() => {
                d.stop();
            });
        d.stopObservable.subscribe(() => {
            m.unsubscribe(), h(), g.unsubscribe();
        });
    }
    function T_(e, t, n) {
        const r = e.target.getBoundingClientRect(),
            i = dr(e.target, n.actionNameAttribute);
        i && _u(e.timeStamp, i);
        const { name: s, nameSource: o } = u_(e.target, n, t);
        return {
            type: ti.CLICK,
            target: { width: Math.round(r.width), height: Math.round(r.height), selector: i },
            position: { x: Math.round(e.clientX - r.left), y: Math.round(e.clientY - r.top) },
            name: s,
            nameSource: o,
        };
    }
    function bu(e, t, n, r, i) {
        const s = de(),
            o = ne(),
            a = t.add(s, o.relative),
            c = Wc({
                lifeCycle: e,
                isChildEvent: (h) =>
                    h.action !== void 0 && (Array.isArray(h.action.id) ? h.action.id.includes(s) : h.action.id === s),
            });
        let u = 0,
            f;
        const l = [],
            d = new D();
        function p(h) {
            u === 0 && ((f = h), (u = 1), f ? a.close(Rr(f)) : a.remove(), c.stop(), d.notify());
        }
        return {
            event: i,
            stop: p,
            stopObservable: d,
            get hasError() {
                return c.eventCounts.errorCount > 0;
            },
            get hasPageActivity() {
                return f !== void 0;
            },
            getUserActivity: n,
            addFrustration: (h) => {
                l.push(h);
            },
            startClocks: o,
            isStopped: () => u === 1 || u === 2,
            clone: () => bu(e, t, n, r, i),
            validate: (h) => {
                if ((p(), u !== 1)) return;
                const { resourceCount: m, errorCount: g, longTaskCount: w } = c.eventCounts,
                    b = {
                        duration: f && Q(o.timeStamp, f),
                        startClocks: o,
                        id: s,
                        frustrationTypes: l,
                        counts: { resourceCount: m, errorCount: g, longTaskCount: w },
                        events: h ?? [i],
                        event: i,
                        ...r,
                    };
                e.notify(0, b), (u = 2);
            },
            discard: () => {
                p(), (u = 2);
            },
        };
    }
    function I_(e, t) {
        const { isRage: n } = g_(e, t);
        n
            ? (e.forEach((r) => r.discard()), t.stop($()), t.validate(e.map((r) => r.event)))
            : (t.discard(), e.forEach((r) => r.validate()));
    }
    function A_(e, t, n, r, i) {
        const { unsubscribe: s } = e.subscribe(0, (c) => {
            e.notify(12, yu(c));
        });
        t.register(0, ({ startTime: c, eventType: u }) => {
            if (u !== C.ERROR && u !== C.RESOURCE && u !== C.LONG_TASK) return le;
            const f = o.findActionId(c);
            return f ? { type: u, action: { id: f } } : le;
        }),
            t.register(1, ({ startTime: c }) => ({ action: { id: o.findActionId(c) } }));
        let o = { findActionId: N },
            a = N;
        return (
            i.trackUserInteractions && ({ actionContexts: o, stop: a } = S_(e, n, r, i)),
            {
                addAction: (c) => {
                    e.notify(12, yu(c));
                },
                actionContexts: o,
                stop: () => {
                    s(), a();
                },
            }
        );
    }
    function yu(e) {
        const t = Os(e)
                ? {
                      action: {
                          id: e.id,
                          loading_time: jc(O(e.duration)),
                          frustration: { type: e.frustrationTypes },
                          error: { count: e.counts.errorCount },
                          long_task: { count: e.counts.longTaskCount },
                          resource: { count: e.counts.resourceCount },
                      },
                      _dd: { action: { target: e.target, position: e.position, name_source: e.nameSource } },
                  }
                : { context: e.context },
            n = Oe(
                {
                    action: { id: de(), target: { name: e.name }, type: e.type },
                    date: e.startClocks.timeStamp,
                    type: C.ACTION,
                },
                t
            ),
            r = Os(e) ? e.duration : void 0,
            i = Os(e) ? { events: e.events } : { handlingStack: e.handlingStack };
        return { rawRumEvent: n, duration: r, startTime: e.startClocks.relative, domainContext: i };
    }
    function Os(e) {
        return e.type !== ti.CUSTOM;
    }
    function R_(e) {
        const t = lc([ee.error]).subscribe((n) => e.notify(n.error));
        return {
            stop: () => {
                t.unsubscribe();
            },
        };
    }
    function C_(e, t) {
        const n = Za(e, [Cn.cspViolation, Cn.intervention]).subscribe((r) => t.notify(r));
        return {
            stop: () => {
                n.unsubscribe();
            },
        };
    }
    function k_(e, t, n) {
        const r = new D();
        return (
            n.subscribe((i) => {
                i.type === 0 && r.notify(i.error);
            }),
            R_(r),
            C_(t, r),
            r.subscribe((i) => e.notify(14, { error: i })),
            x_(e)
        );
    }
    function x_(e) {
        return (
            e.subscribe(14, ({ error: t }) => {
                e.notify(12, O_(t));
            }),
            {
                addError: ({ error: t, handlingStack: n, componentStack: r, startClocks: i, context: s }) => {
                    const o = Vr({
                        originalError: t,
                        handlingStack: n,
                        componentStack: r,
                        startClocks: i,
                        nonErrorPrefix: "Provided",
                        source: ve.CUSTOM,
                        handling: "handled",
                    });
                    (o.context = Oe(o.context, s)), e.notify(14, { error: o });
                },
            }
        );
    }
    function O_(e) {
        const t = {
                date: e.startClocks.timeStamp,
                error: {
                    id: de(),
                    message: e.message,
                    source: e.source,
                    stack: e.stack,
                    handling_stack: e.handlingStack,
                    component_stack: e.componentStack,
                    type: e.type,
                    handling: e.handling,
                    causes: e.causes,
                    source_type: "browser",
                    fingerprint: e.fingerprint,
                    csp: e.csp,
                },
                type: C.ERROR,
                context: e.context,
            },
            n = { error: e.originalError, handlingStack: e.handlingStack };
        return { rawRumEvent: t, startTime: e.startClocks.relative, domainContext: n };
    }
    const Eu = new WeakSet();
    function N_(e) {
        if (!performance || !("getEntriesByName" in performance)) return;
        const t = performance.getEntriesByName(e.url, "resource");
        if (!t.length || !("toJSON" in t[0])) return;
        const n = t
            .filter((r) => !Eu.has(r))
            .filter((r) => Bc(r) && Vc(r))
            .filter((r) =>
                L_(r, e.startClocks.relative, Su({ startTime: e.startClocks.relative, duration: e.duration }))
            );
        if (n.length === 1) return Eu.add(n[0]), n[0].toJSON();
    }
    function Su(e) {
        return mn(e.startTime, e.duration);
    }
    function L_(e, t, n) {
        return e.startTime >= t - 1 && Su(e) <= mn(n, 1);
    }
    const M_ = 2 * me;
    function D_(e) {
        const t = P_(e) || U_(e);
        if (!(!t || t.traceTime <= ge() - M_)) return t.traceId;
    }
    function P_(e) {
        const t = e.querySelector("meta[name=dd-trace-id]"),
            n = e.querySelector("meta[name=dd-trace-time]");
        return vu(t && t.content, n && n.content);
    }
    function U_(e) {
        const t = F_(e);
        if (t) return vu(Xn(t, "trace-id"), Xn(t, "trace-time"));
    }
    function vu(e, t) {
        const n = t && Number(t);
        if (!(!e || !n)) return { traceId: e, traceTime: n };
    }
    function F_(e) {
        for (let t = 0; t < e.childNodes.length; t += 1) {
            const n = wu(e.childNodes[t]);
            if (n) return n;
        }
        if (e.body)
            for (let t = e.body.childNodes.length - 1; t >= 0; t -= 1) {
                const n = e.body.childNodes[t],
                    r = wu(n);
                if (r) return r;
                if (!As(n)) break;
            }
    }
    function wu(e) {
        if (e && Fg(e)) {
            const t = /^\s*DATADOG;(.*?)\s*$/.exec(e.data);
            if (t) return t[1];
        }
    }
    function Tu() {
        if (xt(F.NAVIGATION)) {
            const n = performance.getEntriesByType(F.NAVIGATION)[0];
            if (n) return n;
        }
        const e = $_(),
            t = {
                entryType: F.NAVIGATION,
                initiatorType: "navigation",
                name: window.location.href,
                startTime: 0,
                duration: e.loadEventEnd,
                decodedBodySize: 0,
                encodedBodySize: 0,
                transferSize: 0,
                workerStart: 0,
                toJSON: () => ({ ...t, toJSON: void 0 }),
                ...e,
            };
        return t;
    }
    function $_() {
        const e = {},
            t = performance.timing;
        for (const n in t)
            if (Wn(t[n])) {
                const r = n,
                    i = t[r];
                e[r] = i === 0 ? 0 : Rr(i);
            }
        return e;
    }
    function B_(e, t, n = Tu) {
        ds(e, "interactive", () => {
            const r = n(),
                i = Object.assign(r.toJSON(), {
                    entryType: F.RESOURCE,
                    initiatorType: Uc,
                    duration: r.responseEnd,
                    traceId: D_(document),
                    toJSON: () => ({ ...i, toJSON: void 0 }),
                });
            t(i);
        });
    }
    const V_ = 1e3;
    function z_(e) {
        const t = new Set(),
            n = e.subscribe(8, (r) => {
                t.add(r), t.size > V_ && (dt("Too many requests"), t.delete(t.values().next().value));
            });
        return {
            getMatchingRequest(r) {
                let i = 1 / 0,
                    s;
                for (const o of t) {
                    const a = r.startTime - o.startClocks.relative;
                    0 <= a && a < i && o.url === r.name && ((i = Math.abs(a)), (s = o));
                }
                return s && t.delete(s), s;
            },
            stop() {
                n.unsubscribe();
            },
        };
    }
    const H_ = 32 * Vt;
    function G_(e, t) {
        return t.allowedGraphQlUrls.find((n) => $r([n.match], e));
    }
    function j_(e, t = !1) {
        if (!e || typeof e != "string") return;
        let n;
        try {
            n = JSON.parse(e);
        } catch {
            return;
        }
        if (!n || !n.query) return;
        const r = n.query.trim(),
            i = W_(r),
            s = n.operationName;
        if (!i) return;
        let o;
        return (
            n.variables && (o = JSON.stringify(n.variables)),
            { operationType: i, operationName: s, variables: o, payload: t ? Hi(r, H_, "...") : void 0 }
        );
    }
    function W_(e) {
        var t;
        return (t = e.match(/^\s*(query|mutation|subscription)\b/i)) === null || t === void 0 ? void 0 : t[1];
    }
    function K_(e, t, n, r = Oh(), i = B_) {
        let s;
        const o = t.trackEarlyRequests;
        o
            ? (s = z_(e))
            : e.subscribe(8, (u) => {
                  c(() => q_(u, t, n));
              });
        const a = Ze(t, { type: F.RESOURCE, buffered: !0 }).subscribe((u) => {
            for (const f of u) (o || !$c(f)) && c(() => Iu(f, t, n, s));
        });
        i(t, (u) => {
            c(() => Iu(u, t, n, s));
        });
        function c(u) {
            r.push(() => {
                const f = u();
                f && e.notify(12, f);
            });
        }
        return {
            stop: () => {
                r.stop(), a.unsubscribe();
            },
        };
    }
    function q_(e, t, n) {
        const r = N_(e);
        return Au(r, e, n, t);
    }
    function Iu(e, t, n, r) {
        const i = $c(e) && r ? r.getMatchingRequest(e) : void 0;
        return Au(e, i, n, t);
    }
    function Au(e, t, n, r) {
        if (!e && !t) return;
        const i = t ? Z_(t, r) : Q_(e, r);
        if (!r.trackResources && !i) return;
        const s = e ? Kn(e.startTime) : t.startClocks,
            o = e ? Sg(e) : eb(n, s, t.duration),
            a = t && Y_(t, r),
            c = Oe(
                {
                    date: s.timeStamp,
                    resource: {
                        id: de(),
                        duration: O(o),
                        type: t ? (t.type === Qt.XHR ? _e.XHR : _e.FETCH) : Eg(e),
                        method: t ? t.method : void 0,
                        status_code: t ? t.status : tb(e.responseStatus),
                        url: t ? zc(t.url) : e.name,
                        protocol: e && Tg(e),
                        delivery_type: e && Ig(e),
                        graphql: a,
                    },
                    type: C.RESOURCE,
                    _dd: { discarded: !r.trackResources },
                },
                i,
                e && J_(e)
            );
        return { startTime: s.relative, duration: o, rawRumEvent: c, domainContext: X_(e, t) };
    }
    function Y_(e, t) {
        if (!wn(lt.GRAPHQL_TRACKING)) return;
        const n = G_(e.url, t);
        if (n) return j_(e.body, n.trackPayload);
    }
    function X_(e, t) {
        if (t) {
            const n = { performanceEntry: e, isAborted: t.isAborted, handlingStack: t.handlingStack };
            return t.type === Qt.XHR
                ? { xhr: t.xhr, ...n }
                : { requestInput: t.input, requestInit: t.init, response: t.response, error: t.error, ...n };
        }
        return { performanceEntry: e };
    }
    function J_(e) {
        const { renderBlockingStatus: t } = e;
        return { resource: { render_blocking_status: t, ...Ag(e), ...vg(e) } };
    }
    function Z_(e, t) {
        if (e.traceSampled && e.traceId && e.spanId)
            return { _dd: { span_id: e.spanId.toString(), trace_id: e.traceId.toString(), rule_psr: t.rulePsr } };
    }
    function Q_(e, t) {
        if (e.traceId) return { _dd: { trace_id: e.traceId, span_id: xc().toString(), rule_psr: t.rulePsr } };
    }
    function eb(e, t, n) {
        return e.wasInPageStateDuringPeriod("frozen", t.relative, n) ? void 0 : n;
    }
    function tb(e) {
        return e === 0 ? void 0 : e;
    }
    function nb(e, t, n) {
        const { stop: r, eventCounts: i } = Wc({ lifeCycle: e, isChildEvent: (s) => s.view.id === t, onChange: n });
        return { stop: r, eventCounts: i };
    }
    const rb = 10 * me;
    function ib(e, t, n) {
        return {
            stop: Ze(e, { type: F.PAINT, buffered: !0 }).subscribe((i) => {
                const s = i.find(
                    (o) => o.name === "first-contentful-paint" && o.startTime < t.timeStamp && o.startTime < rb
                );
                s && n(s.startTime);
            }).unsubscribe,
        };
    }
    function sb(e, t) {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                t(Q(e, Ce()));
            });
        });
    }
    function ob(e, t, n) {
        const r = Ze(e, { type: F.FIRST_INPUT, buffered: !0 }).subscribe((i) => {
            const s = i.find((o) => o.startTime < t.timeStamp);
            if (s) {
                const o = Q(s.startTime, s.processingStart);
                let a;
                s.target && ht(s.target) && (a = dr(s.target, e.actionNameAttribute)),
                    n({ delay: o >= 0 ? o : 0, time: s.startTime, targetSelector: a });
            }
        });
        return {
            stop: () => {
                r.unsubscribe();
            },
        };
    }
    function ab(e, t, n = Tu) {
        return lb(e, () => {
            const r = n();
            ub(r) || t(cb(r));
        });
    }
    function cb(e) {
        return {
            domComplete: e.domComplete,
            domContentLoaded: e.domContentLoadedEventEnd,
            domInteractive: e.domInteractive,
            loadEvent: e.loadEventEnd,
            firstByte: e.responseStart >= 0 && e.responseStart <= Ce() ? e.responseStart : void 0,
        };
    }
    function ub(e) {
        return e.loadEventEnd <= 0;
    }
    function lb(e, t) {
        let n;
        const { stop: r } = ds(e, "complete", () => {
            n = ae(() => t());
        });
        return {
            stop: () => {
                r(), Se(n);
            },
        };
    }
    const db = 10 * me;
    function fb(e, t, n, r) {
        let i = 1 / 0;
        const { stop: s } = we(
            e,
            n,
            ["pointerdown", "keydown"],
            (c) => {
                i = c.timeStamp;
            },
            { capture: !0, once: !0 }
        );
        let o = 0;
        const a = Ze(e, { type: F.LARGEST_CONTENTFUL_PAINT, buffered: !0 }).subscribe((c) => {
            const u = ta(
                c,
                (f) =>
                    f.entryType === F.LARGEST_CONTENTFUL_PAINT &&
                    f.startTime < i &&
                    f.startTime < t.timeStamp &&
                    f.startTime < db &&
                    f.size > o
            );
            if (u) {
                let f;
                u.element && (f = dr(u.element, e.actionNameAttribute)),
                    r({ value: u.startTime, targetSelector: f, resourceUrl: pb(u) }),
                    (o = u.size);
            }
        });
        return {
            stop: () => {
                s(), a.unsubscribe();
            },
        };
    }
    function pb(e) {
        return e.url === "" ? void 0 : e.url;
    }
    function Ru(e, t, n = window) {
        if (document.visibilityState === "hidden") return { timeStamp: 0, stop: N };
        if (xt(F.VISIBILITY_STATE)) {
            const s = performance
                .getEntriesByType(F.VISIBILITY_STATE)
                .filter((o) => o.name === "hidden")
                .find((o) => o.startTime >= t.relative);
            if (s) return { timeStamp: s.startTime, stop: N };
        }
        let r = 1 / 0;
        const { stop: i } = we(
            e,
            n,
            ["pagehide", "visibilitychange"],
            (s) => {
                (s.type === "pagehide" || document.visibilityState === "hidden") && ((r = s.timeStamp), i());
            },
            { capture: !0 }
        );
        return {
            get timeStamp() {
                return r;
            },
            stop: i,
        };
    }
    function hb(e, t, n, r) {
        const i = {},
            { stop: s } = ab(e, (l) => {
                n(l.loadEvent), (i.navigationTimings = l), r();
            }),
            o = Ru(e, t),
            { stop: a } = ib(e, o, (l) => {
                (i.firstContentfulPaint = l), r();
            }),
            { stop: c } = fb(e, o, window, (l) => {
                (i.largestContentfulPaint = l), r();
            }),
            { stop: u } = ob(e, o, (l) => {
                (i.firstInput = l), r();
            });
        function f() {
            s(), a(), c(), u(), o.stop();
        }
        return { stop: f, initialViewMetrics: i };
    }
    const Ns = (e, t) => e * t,
        mb = (e, t) => {
            const n = Math.max(e.left, t.left),
                r = Math.max(e.top, t.top),
                i = Math.min(e.right, t.right),
                s = Math.min(e.bottom, t.bottom);
            return n >= i || r >= s ? 0 : Ns(i - n, s - r);
        },
        Cu = (e) => {
            const t = Ns(e.previousRect.width, e.previousRect.height),
                n = Ns(e.currentRect.width, e.currentRect.height),
                r = mb(e.previousRect, e.currentRect);
            return t + n - r;
        };
    function gb(e, t, n) {
        if (!Sb()) return { stop: N };
        let r = 0,
            i;
        n({ value: 0 });
        const s = Eb(),
            o = Ze(e, { type: F.LAYOUT_SHIFT, buffered: !0 }).subscribe((a) => {
                var c;
                for (const u of a) {
                    if (u.hadRecentInput || u.startTime < t) continue;
                    const { cumulatedValue: f, isMaxValue: l } = s.update(u);
                    if (l) {
                        const d = _b(u.sources);
                        i = {
                            target: d?.node ? new WeakRef(d.node) : void 0,
                            time: Q(t, u.startTime),
                            previousRect: d?.previousRect,
                            currentRect: d?.currentRect,
                            devicePixelRatio: window.devicePixelRatio,
                        };
                    }
                    if (f > r) {
                        r = f;
                        const d = (c = i?.target) === null || c === void 0 ? void 0 : c.deref();
                        n({
                            value: jn(r, 4),
                            targetSelector: d && dr(d, e.actionNameAttribute),
                            time: i?.time,
                            previousRect: i?.previousRect ? ku(i.previousRect) : void 0,
                            currentRect: i?.currentRect ? ku(i.currentRect) : void 0,
                            devicePixelRatio: i?.devicePixelRatio,
                        });
                    }
                }
            });
        return {
            stop: () => {
                o.unsubscribe();
            },
        };
    }
    function _b(e) {
        let t;
        for (const n of e)
            if (n.node && ht(n.node)) {
                const r = Cu(n);
                (!t || Cu(t) < r) && (t = n);
            }
        return t;
    }
    function ku({ x: e, y: t, width: n, height: r }) {
        return { x: e, y: t, width: n, height: r };
    }
    const bb = 5 * ue,
        yb = ue;
    function Eb() {
        let e = 0,
            t,
            n,
            r = 0;
        return {
            update: (i) => {
                const s = t === void 0 || i.startTime - n >= yb || i.startTime - t >= bb;
                let o;
                return (
                    s
                        ? ((t = n = i.startTime), (r = e = i.value), (o = !0))
                        : ((e += i.value), (n = i.startTime), (o = i.value > r), o && (r = i.value)),
                    { cumulatedValue: e, isMaxValue: o }
                );
            },
        };
    }
    function Sb() {
        return xt(F.LAYOUT_SHIFT) && "WeakRef" in window;
    }
    let ci,
        xu = 0,
        Ls = 1 / 0,
        Ms = 0;
    function vb() {
        "interactionCount" in performance ||
            ci ||
            ((ci = new window.PerformanceObserver(
                S((e) => {
                    e.getEntries().forEach((t) => {
                        const n = t;
                        n.interactionId &&
                            ((Ls = Math.min(Ls, n.interactionId)),
                            (Ms = Math.max(Ms, n.interactionId)),
                            (xu = (Ms - Ls) / 7 + 1));
                    });
                })
            )),
            ci.observe({ type: "event", buffered: !0, durationThreshold: 0 }));
    }
    const Ou = () => (ci ? xu : window.performance.interactionCount || 0),
        Nu = 10,
        wb = 1 * me;
    function Tb(e, t, n) {
        if (!Rb()) return { getInteractionToNextPaint: () => {}, setViewEnd: N, stop: N };
        const { getViewInteractionCount: r, stopViewInteractionCount: i } = Ab(n);
        let s = 1 / 0;
        const o = Ib(r);
        let a = -1,
            c,
            u;
        function f(p) {
            for (const m of p) m.interactionId && m.startTime >= t && m.startTime <= s && o.process(m);
            const h = o.estimateP98Interaction();
            h &&
                h.duration !== a &&
                ((a = h.duration),
                (u = Q(t, h.startTime)),
                (c = y_(h.startTime)),
                !c && h.target && ht(h.target) && (c = dr(h.target, e.actionNameAttribute)));
        }
        const l = Ze(e, { type: F.FIRST_INPUT, buffered: !0 }).subscribe(f),
            d = Ze(e, { type: F.EVENT, durationThreshold: 40, buffered: !0 }).subscribe(f);
        return {
            getInteractionToNextPaint: () => {
                if (a >= 0) return { value: Math.min(a, wb), targetSelector: c, time: u };
                if (r()) return { value: 0 };
            },
            setViewEnd: (p) => {
                (s = p), i();
            },
            stop: () => {
                d.unsubscribe(), l.unsubscribe();
            },
        };
    }
    function Ib(e) {
        const t = [];
        function n() {
            t.sort((r, i) => i.duration - r.duration).splice(Nu);
        }
        return {
            process(r) {
                const i = t.findIndex((o) => r.interactionId === o.interactionId),
                    s = t[t.length - 1];
                i !== -1
                    ? r.duration > t[i].duration && ((t[i] = r), n())
                    : (t.length < Nu || r.duration > s.duration) && (t.push(r), n());
            },
            estimateP98Interaction() {
                const r = Math.min(t.length - 1, Math.floor(e() / 50));
                return t[r];
            },
        };
    }
    function Ab(e) {
        vb();
        const t = e === pt.INITIAL_LOAD ? 0 : Ou();
        let n = { stopped: !1 };
        function r() {
            return Ou() - t;
        }
        return {
            getViewInteractionCount: () => (n.stopped ? n.interactionCount : r()),
            stopViewInteractionCount: () => {
                n = { stopped: !0, interactionCount: r() };
            },
        };
    }
    function Rb() {
        return xt(F.EVENT) && window.PerformanceEventTiming && "interactionId" in PerformanceEventTiming.prototype;
    }
    function Cb(e, t, n, r, i, s, o) {
        let a = i === pt.INITIAL_LOAD,
            c = !0;
        const u = [],
            f = Ru(r, s);
        function l() {
            if (!c && !a && u.length > 0) {
                const p = Math.max(...u);
                p < f.timeStamp - s.relative && o(p);
            }
        }
        const { stop: d } = Cs(e, t, n, r, (p) => {
            c && ((c = !1), p.hadActivity && u.push(Q(s.timeStamp, p.end)), l());
        });
        return {
            stop: () => {
                d(), f.stop();
            },
            setLoadEvent: (p) => {
                a && ((a = !1), u.push(p), l());
            },
        };
    }
    function Lu() {
        let e;
        const t = window.visualViewport;
        return (
            t
                ? (e = t.pageLeft - t.offsetLeft)
                : window.scrollX !== void 0
                  ? (e = window.scrollX)
                  : (e = window.pageXOffset || 0),
            Math.round(e)
        );
    }
    function Ds() {
        let e;
        const t = window.visualViewport;
        return (
            t
                ? (e = t.pageTop - t.offsetTop)
                : window.scrollY !== void 0
                  ? (e = window.scrollY)
                  : (e = window.pageYOffset || 0),
            Math.round(e)
        );
    }
    let Ps;
    function Mu(e) {
        return Ps || (Ps = kb(e)), Ps;
    }
    function kb(e) {
        return new D((t) => {
            const { throttled: n } = At(() => {
                t.notify(ui());
            }, 200);
            return J(e, window, "resize", n, { capture: !0, passive: !0 }).stop;
        });
    }
    function ui() {
        const e = window.visualViewport;
        return e
            ? { width: Number(e.width * e.scale), height: Number(e.height * e.scale) }
            : { width: Number(window.innerWidth || 0), height: Number(window.innerHeight || 0) };
    }
    const xb = ue;
    function Ob(e, t, n, r = Lb(e)) {
        let i = 0,
            s = 0,
            o = 0;
        const a = r.subscribe(({ scrollDepth: c, scrollTop: u, scrollHeight: f }) => {
            let l = !1;
            if ((c > i && ((i = c), (l = !0)), f > s)) {
                s = f;
                const d = Ce();
                (o = Q(t.relative, d)), (l = !0);
            }
            l && n({ maxDepth: Math.min(i, s), maxDepthScrollTop: u, maxScrollHeight: s, maxScrollHeightTime: o });
        });
        return { stop: () => a.unsubscribe() };
    }
    function Nb() {
        const e = Ds(),
            { height: t } = ui(),
            n = Math.round((document.scrollingElement || document.documentElement).scrollHeight),
            r = Math.round(t + e);
        return { scrollHeight: n, scrollDepth: r, scrollTop: e };
    }
    function Lb(e, t = xb) {
        return new D((n) => {
            function r() {
                n.notify(Nb());
            }
            if (window.ResizeObserver) {
                const i = At(r, t, { leading: !1, trailing: !0 }),
                    s = document.scrollingElement || document.documentElement,
                    o = new ResizeObserver(S(i.throttled));
                s && o.observe(s);
                const a = J(e, window, "scroll", i.throttled, { passive: !0 });
                return () => {
                    i.cancel(), o.disconnect(), a.stop();
                };
            }
        });
    }
    function Mb(e, t, n, r, i, s, o) {
        const a = {},
            { stop: c, setLoadEvent: u } = Cb(e, t, n, r, s, o, (m) => {
                (a.loadingTime = m), i();
            }),
            { stop: f } = Ob(r, o, (m) => {
                a.scroll = m;
            }),
            { stop: l } = gb(r, o.relative, (m) => {
                (a.cumulativeLayoutShift = m), i();
            }),
            { stop: d, getInteractionToNextPaint: p, setViewEnd: h } = Tb(r, o.relative, s);
        return {
            stop: () => {
                c(), l(), f();
            },
            stopINPTracking: d,
            setLoadEvent: u,
            setViewEnd: h,
            getCommonViewMetrics: () => ((a.interactionToNextPaint = p()), a),
        };
    }
    function Db(e, t) {
        const { stop: n } = J(
            e,
            window,
            "pageshow",
            (r) => {
                r.persisted && t(r);
            },
            { capture: !0 }
        );
        return n;
    }
    function Pb(e, t, n) {
        sb(e.relative, (r) => {
            (t.firstContentfulPaint = r), (t.largestContentfulPaint = { value: r }), n();
        });
    }
    const Ub = 3e3,
        Fb = 5 * me,
        $b = 5 * me;
    function Bb(e, t, n, r, i, s, o, a) {
        const c = new Set();
        let u = d(pt.INITIAL_LOAD, Bi(), a),
            f;
        p();
        let l;
        o &&
            ((l = h(s)),
            i.trackBfcacheViews &&
                (f = Db(i, (m) => {
                    u.end();
                    const g = Kn(m.timeStamp);
                    u = d(pt.BF_CACHE, g, void 0);
                })));
        function d(m, g, w) {
            const b = Vb(t, n, r, i, e, m, g, w);
            return (
                c.add(b),
                b.stopObservable.subscribe(() => {
                    c.delete(b);
                }),
                b
            );
        }
        function p() {
            t.subscribe(10, () => {
                u = d(pt.ROUTE_CHANGE, void 0, {
                    name: u.name,
                    service: u.service,
                    version: u.version,
                    context: u.contextManager.getContext(),
                });
            }),
                t.subscribe(9, () => {
                    u.end({ sessionIsActive: !1 });
                });
        }
        function h(m) {
            return m.subscribe(({ oldLocation: g, newLocation: w }) => {
                Hb(g, w) && (u.end(), (u = d(pt.ROUTE_CHANGE)));
            });
        }
        return {
            addTiming: (m, g = $()) => {
                u.addTiming(m, g);
            },
            startView: (m, g) => {
                u.end({ endClocks: g }), (u = d(pt.ROUTE_CHANGE, g, m));
            },
            setViewContext: (m) => {
                u.contextManager.setContext(m);
            },
            setViewContextProperty: (m, g) => {
                u.contextManager.setContextProperty(m, g);
            },
            setViewName: (m) => {
                u.setViewName(m);
            },
            getViewContext: () => u.contextManager.getContext(),
            stop: () => {
                l && l.unsubscribe(), f && f(), u.end(), c.forEach((m) => m.stop());
            },
        };
    }
    function Vb(e, t, n, r, i, s, o = ne(), a) {
        const c = de(),
            u = new D(),
            f = {};
        let l = 0,
            d;
        const p = Yn(i),
            h = or();
        let m = !0,
            g = a?.name;
        const w = a?.service || r.service,
            b = a?.version || r.version,
            E = a?.context;
        E && h.setContext(E);
        const y = { id: c, name: g, startClocks: o, service: w, version: b, context: E };
        e.notify(1, y), e.notify(2, y);
        const { throttled: T, cancel: _ } = At(xe, Ub, { leading: !1 }),
            {
                setLoadEvent: M,
                setViewEnd: $e,
                stop: qe,
                stopINPTracking: L,
                getCommonViewMetrics: W,
            } = Mb(e, t, n, r, Ae, s, o),
            { stop: K, initialViewMetrics: ie } =
                s === pt.INITIAL_LOAD ? hb(r, o, M, Ae) : { stop: N, initialViewMetrics: {} };
        s === pt.BF_CACHE && Pb(o, ie, Ae);
        const { stop: ce, eventCounts: ye } = nb(e, c, Ae),
            it = gn(xe, Fb),
            vt = e.subscribe(11, (se) => {
                se.reason === Tn.UNLOADING && xe();
            });
        xe(), h.changeObservable.subscribe(Ae);
        function Ye() {
            e.notify(3, { id: c, name: g, context: h.getContext(), startClocks: o, sessionIsActive: m });
        }
        function Ae() {
            Ye(), T();
        }
        function xe() {
            _(), Ye(), (l += 1);
            const se = d === void 0 ? $() : d.timeStamp;
            e.notify(4, {
                customTimings: f,
                documentVersion: l,
                id: c,
                name: g,
                service: w,
                version: b,
                context: h.getContext(),
                loadingType: s,
                location: p,
                startClocks: o,
                commonViewMetrics: W(),
                initialViewMetrics: ie,
                duration: Q(o.timeStamp, se),
                isActive: d === void 0,
                sessionIsActive: m,
                eventCounts: ye,
            });
        }
        return {
            get name() {
                return g;
            },
            service: w,
            version: b,
            contextManager: h,
            stopObservable: u,
            end(se = {}) {
                var Re, st;
                d ||
                    ((d = (Re = se.endClocks) !== null && Re !== void 0 ? Re : ne()),
                    (m = (st = se.sessionIsActive) !== null && st !== void 0 ? st : !0),
                    e.notify(5, { endClocks: d }),
                    e.notify(6, { endClocks: d }),
                    xr(it),
                    $e(d.relative),
                    qe(),
                    vt.unsubscribe(),
                    xe(),
                    ae(() => {
                        this.stop();
                    }, $b));
            },
            stop() {
                K(), ce(), L(), u.notify();
            },
            addTiming(se, Re) {
                if (d) return;
                const st = ef(Re) ? Re : Q(o.timeStamp, Re);
                (f[zb(se)] = st), Ae();
            },
            setViewName(se) {
                (g = se), xe();
            },
        };
    }
    function zb(e) {
        const t = e.replace(/[^a-zA-Z0-9-_.@$]/g, "_");
        return t !== e && I.warn(`Invalid timing name: ${e}, sanitized to: ${t}`), t;
    }
    function Hb(e, t) {
        return e.pathname !== t.pathname || (!Gb(t.hash) && Du(t.hash) !== Du(e.hash));
    }
    function Gb(e) {
        const t = e.substring(1);
        return t !== "" && !!document.getElementById(t);
    }
    function Du(e) {
        const t = e.indexOf("?");
        return t < 0 ? e : e.slice(0, t);
    }
    function jb(e, t, n, r, i, s, o, a, c, u) {
        return (
            e.subscribe(4, (f) => e.notify(12, Wb(f, n, a))),
            t.register(0, ({ startTime: f, eventType: l }) => {
                const d = c.findView(f);
                return d
                    ? {
                          type: l,
                          service: d.service,
                          version: d.version,
                          context: d.context,
                          view: { id: d.id, name: d.name },
                      }
                    : He;
            }),
            t.register(1, ({ startTime: f }) => {
                var l;
                return { view: { id: (l = c.findView(f)) === null || l === void 0 ? void 0 : l.id } };
            }),
            Bb(r, e, i, s, n, o, !n.trackViewsManually, u)
        );
    }
    function Wb(e, t, n) {
        var r, i, s, o, a, c, u, f, l, d, p, h, m, g, w, b, E, y;
        const T = n.getReplayStats(e.id),
            _ =
                (i = (r = e.commonViewMetrics) === null || r === void 0 ? void 0 : r.cumulativeLayoutShift) === null ||
                i === void 0
                    ? void 0
                    : i.devicePixelRatio,
            M = {
                _dd: {
                    document_version: e.documentVersion,
                    replay_stats: T,
                    cls: _ ? { device_pixel_ratio: _ } : void 0,
                    configuration: { start_session_replay_recording_manually: t.startSessionReplayRecordingManually },
                },
                date: e.startClocks.timeStamp,
                type: C.VIEW,
                view: {
                    action: { count: e.eventCounts.actionCount },
                    frustration: { count: e.eventCounts.frustrationCount },
                    cumulative_layout_shift:
                        (s = e.commonViewMetrics.cumulativeLayoutShift) === null || s === void 0 ? void 0 : s.value,
                    cumulative_layout_shift_time: O(
                        (o = e.commonViewMetrics.cumulativeLayoutShift) === null || o === void 0 ? void 0 : o.time
                    ),
                    cumulative_layout_shift_target_selector:
                        (a = e.commonViewMetrics.cumulativeLayoutShift) === null || a === void 0
                            ? void 0
                            : a.targetSelector,
                    first_byte: O(
                        (c = e.initialViewMetrics.navigationTimings) === null || c === void 0 ? void 0 : c.firstByte
                    ),
                    dom_complete: O(
                        (u = e.initialViewMetrics.navigationTimings) === null || u === void 0 ? void 0 : u.domComplete
                    ),
                    dom_content_loaded: O(
                        (f = e.initialViewMetrics.navigationTimings) === null || f === void 0
                            ? void 0
                            : f.domContentLoaded
                    ),
                    dom_interactive: O(
                        (l = e.initialViewMetrics.navigationTimings) === null || l === void 0
                            ? void 0
                            : l.domInteractive
                    ),
                    error: { count: e.eventCounts.errorCount },
                    first_contentful_paint: O(e.initialViewMetrics.firstContentfulPaint),
                    first_input_delay: O(
                        (d = e.initialViewMetrics.firstInput) === null || d === void 0 ? void 0 : d.delay
                    ),
                    first_input_time: O(
                        (p = e.initialViewMetrics.firstInput) === null || p === void 0 ? void 0 : p.time
                    ),
                    first_input_target_selector:
                        (h = e.initialViewMetrics.firstInput) === null || h === void 0 ? void 0 : h.targetSelector,
                    interaction_to_next_paint: O(
                        (m = e.commonViewMetrics.interactionToNextPaint) === null || m === void 0 ? void 0 : m.value
                    ),
                    interaction_to_next_paint_time: O(
                        (g = e.commonViewMetrics.interactionToNextPaint) === null || g === void 0 ? void 0 : g.time
                    ),
                    interaction_to_next_paint_target_selector:
                        (w = e.commonViewMetrics.interactionToNextPaint) === null || w === void 0
                            ? void 0
                            : w.targetSelector,
                    is_active: e.isActive,
                    name: e.name,
                    largest_contentful_paint: O(
                        (b = e.initialViewMetrics.largestContentfulPaint) === null || b === void 0 ? void 0 : b.value
                    ),
                    largest_contentful_paint_target_selector:
                        (E = e.initialViewMetrics.largestContentfulPaint) === null || E === void 0
                            ? void 0
                            : E.targetSelector,
                    load_event: O(
                        (y = e.initialViewMetrics.navigationTimings) === null || y === void 0 ? void 0 : y.loadEvent
                    ),
                    loading_time: jc(O(e.commonViewMetrics.loadingTime)),
                    loading_type: e.loadingType,
                    long_task: { count: e.eventCounts.longTaskCount },
                    performance: Kb(e.commonViewMetrics, e.initialViewMetrics),
                    resource: { count: e.eventCounts.resourceCount },
                    time_spent: O(e.duration),
                },
                display: e.commonViewMetrics.scroll
                    ? {
                          scroll: {
                              max_depth: e.commonViewMetrics.scroll.maxDepth,
                              max_depth_scroll_top: e.commonViewMetrics.scroll.maxDepthScrollTop,
                              max_scroll_height: e.commonViewMetrics.scroll.maxScrollHeight,
                              max_scroll_height_time: O(e.commonViewMetrics.scroll.maxScrollHeightTime),
                          },
                      }
                    : void 0,
                privacy: { replay_level: t.defaultPrivacyLevel },
                device: { locale: navigator.language, locales: navigator.languages, time_zone: Vh() },
            };
        return (
            zt(e.customTimings) || (M.view.custom_timings = Ko(e.customTimings, O)),
            {
                rawRumEvent: M,
                startTime: e.startClocks.relative,
                duration: e.duration,
                domainContext: { location: e.location },
            }
        );
    }
    function Kb(
        { cumulativeLayoutShift: e, interactionToNextPaint: t },
        { firstContentfulPaint: n, firstInput: r, largestContentfulPaint: i }
    ) {
        return {
            cls: e && {
                score: e.value,
                timestamp: O(e.time),
                target_selector: e.targetSelector,
                previous_rect: e.previousRect,
                current_rect: e.currentRect,
            },
            fcp: n && { timestamp: O(n) },
            fid: r && { duration: O(r.delay), timestamp: O(r.time), target_selector: r.targetSelector },
            inp: t && { duration: O(t.value), timestamp: O(t.time), target_selector: t.targetSelector },
            lcp: i && { timestamp: O(i.value), target_selector: i.targetSelector, resource_url: i.resourceUrl },
        };
    }
    const qb = "rum";
    function Yb(e, t, n) {
        const r = sc(e, qb, (i) => Jb(e, i), n);
        return (
            r.expireObservable.subscribe(() => {
                t.notify(9);
            }),
            r.renewObservable.subscribe(() => {
                t.notify(10);
            }),
            r.sessionStateUpdateObservable.subscribe(({ previousState: i, newState: s }) => {
                if (!i.forcedReplay && s.forcedReplay) {
                    const o = r.findSession();
                    o && (o.isReplayForced = !0);
                }
            }),
            {
                findTrackedSession: (i) => {
                    const s = r.findSession(i);
                    if (!(!s || s.trackingType === "0"))
                        return {
                            id: s.id,
                            sessionReplay: s.trackingType === "1" ? 1 : s.isReplayForced ? 2 : 0,
                            anonymousId: s.anonymousId,
                        };
                },
                expire: r.expire,
                expireObservable: r.expireObservable,
                setForcedReplay: () => r.updateSessionState({ forcedReplay: "1" }),
            }
        );
    }
    function Xb() {
        const e = { id: "00000000-aaaa-0000-aaaa-000000000000", sessionReplay: Fa("records") ? 1 : 0 };
        return { findTrackedSession: () => e, expire: N, expireObservable: new D(), setForcedReplay: N };
    }
    function Jb(e, t) {
        return Zb(t) ? t : Tt(e.sessionSampleRate) ? (Tt(e.sessionReplaySampleRate) ? "1" : "2") : "0";
    }
    function Zb(e) {
        return e === "0" || e === "1" || e === "2";
    }
    function Qb(e, t, n, r, i, s) {
        const o = [e.rumEndpointBuilder];
        e.replica && o.push(e.replica.rumEndpointBuilder);
        const a = is({
            encoder: s(2),
            request: Wr(o, e.batchBytesLimit, n),
            flushController: ss({
                messagesLimit: e.batchMessagesLimit,
                bytesLimit: e.batchBytesLimit,
                durationLimit: e.flushTimeout,
                pageMayExitObservable: r,
                sessionExpireObservable: i,
            }),
            messageBytesLimit: e.messageBytesLimit,
        });
        return (
            t.subscribe(13, (c) => {
                c.type === C.VIEW ? a.upsert(c, c.view.id) : a.add(c);
            }),
            a
        );
    }
    function ey(e) {
        const t = Jt();
        e.subscribe(13, (n) => {
            t.send("rum", n);
        });
    }
    const ty = Gt;
    function ny(e, t, n, r) {
        const i = kn({ expireDelay: ty });
        let s;
        e.subscribe(1, ({ startClocks: c }) => {
            const u = r.href;
            i.add(a({ url: u, referrer: s || document.referrer }), c.relative), (s = u);
        }),
            e.subscribe(6, ({ endClocks: c }) => {
                i.closeActive(c.relative);
            });
        const o = n.subscribe(({ newLocation: c }) => {
            const u = i.find();
            if (u) {
                const f = Ce();
                i.closeActive(f), i.add(a({ url: c.href, referrer: u.referrer }), f);
            }
        });
        function a({ url: c, referrer: u }) {
            return { url: c, referrer: u };
        }
        return (
            t.register(0, ({ startTime: c, eventType: u }) => {
                const f = i.find(c);
                return f ? { type: u, view: { url: f.url, referrer: f.referrer } } : He;
            }),
            {
                findUrl: (c) => i.find(c),
                stop: () => {
                    o.unsubscribe(), i.stop();
                },
            }
        );
    }
    function ry(e, t) {
        let n = Yn(t);
        return new D((r) => {
            const { stop: i } = iy(e, o),
                { stop: s } = sy(e, o);
            function o() {
                if (n.href === t.href) return;
                const a = Yn(t);
                r.notify({ newLocation: a, oldLocation: n }), (n = a);
            }
            return () => {
                i(), s();
            };
        });
    }
    function iy(e, t) {
        const { stop: n } = Te(Pu("pushState"), "pushState", ({ onPostCall: s }) => {
                s(t);
            }),
            { stop: r } = Te(Pu("replaceState"), "replaceState", ({ onPostCall: s }) => {
                s(t);
            }),
            { stop: i } = J(e, window, "popstate", t);
        return {
            stop: () => {
                n(), r(), i();
            },
        };
    }
    function sy(e, t) {
        return J(e, window, "hashchange", t);
    }
    function Pu(e) {
        return Object.prototype.hasOwnProperty.call(history, e) ? history : History.prototype;
    }
    const oy = Gt;
    function ay(e, t, n) {
        const r = kn({ expireDelay: oy });
        return (
            e.subscribe(1, ({ startClocks: i }) => {
                r.add({}, i.relative);
            }),
            e.subscribe(6, ({ endClocks: i }) => {
                r.closeActive(i.relative);
            }),
            t.register(0, ({ startTime: i, eventType: s }) => {
                if (!n.trackFeatureFlagsForEvents.concat([C.VIEW, C.ERROR]).includes(s)) return le;
                const a = r.find(i);
                return !a || zt(a) ? le : { type: s, feature_flags: a };
            }),
            {
                addFeatureFlagEvaluation: (i, s) => {
                    const o = r.find();
                    o && (o[i] = s);
                },
            }
        );
    }
    const cy = 10 * ue;
    let On, li;
    function uy(e, t, n) {
        e.metricsEnabled &&
            ($u(),
            (li = !1),
            t.subscribe(13, () => {
                li = !0;
            }),
            n.subscribe(({ bytesCount: r, messagesCount: i }) => {
                li && ((li = !1), (On.batchCount += 1), Fu(On.batchBytesCount, r), Fu(On.batchMessagesCount, i));
            }),
            gn(ly, cy));
    }
    function ly() {
        On.batchCount !== 0 && (nr("Customer data measures", On), $u());
    }
    function Uu() {
        return { min: 1 / 0, max: 0, sum: 0 };
    }
    function Fu(e, t) {
        (e.sum += t), (e.min = Math.min(e.min, t)), (e.max = Math.max(e.max, t));
    }
    function $u() {
        On = { batchCount: 0, batchBytesCount: Uu(), batchMessagesCount: Uu() };
    }
    const dy = 4e3,
        fy = 500,
        py = Gt;
    function hy(e, t, n = fy) {
        const r = kn({ expireDelay: py, maxEntries: dy });
        let i;
        xt(F.VISIBILITY_STATE) &&
            performance.getEntriesByType(F.VISIBILITY_STATE).forEach((u) => {
                const f = u.name === "hidden" ? "hidden" : "active";
                o(f, u.startTime);
            }),
            o(Bu(), Ce());
        const { stop: s } = we(
            t,
            window,
            ["pageshow", "focus", "blur", "visibilitychange", "resume", "freeze", "pagehide"],
            (c) => {
                o(gy(c), c.timeStamp);
            },
            { capture: !0 }
        );
        function o(c, u = Ce()) {
            c !== i && ((i = c), r.closeActive(u), r.add({ state: i, startTime: u }, u));
        }
        function a(c, u, f) {
            return r.findAll(u, f).some((l) => l.state === c);
        }
        return (
            e.register(0, ({ startTime: c, duration: u = 0, eventType: f }) => {
                if (f === C.VIEW) {
                    const l = r.findAll(c, u);
                    return { type: f, _dd: { page_states: my(l, c, n) } };
                }
                return f === C.ACTION || f === C.ERROR ? { type: f, view: { in_foreground: a("active", c, 0) } } : le;
            }),
            {
                wasInPageStateDuringPeriod: a,
                addPageState: o,
                stop: () => {
                    s(), r.stop();
                },
            }
        );
    }
    function my(e, t, n) {
        if (e.length !== 0)
            return e
                .slice(-n)
                .reverse()
                .map(({ state: r, startTime: i }) => ({ state: r, start: O(Q(t, i)) }));
    }
    function gy(e) {
        return e.type === "freeze" ? "frozen" : e.type === "pagehide" ? (e.persisted ? "frozen" : "terminated") : Bu();
    }
    function Bu() {
        return document.visibilityState === "hidden" ? "hidden" : document.hasFocus() ? "active" : "passive";
    }
    function _y(e, t) {
        let n;
        const r = requestAnimationFrame(
                S(() => {
                    n = ui();
                })
            ),
            i = Mu(t).subscribe((s) => {
                n = s;
            }).unsubscribe;
        return (
            e.register(0, ({ eventType: s }) => ({ type: s, display: n ? { viewport: n } : void 0 })),
            {
                stop: () => {
                    i(), r && cancelAnimationFrame(r);
                },
            }
        );
    }
    function by(e, t) {
        const n = window.cookieStore ? yy(e) : Sy;
        return new D((r) => n(t, (i) => r.notify(i)));
    }
    function yy(e) {
        return (t, n) =>
            J(e, window.cookieStore, "change", (i) => {
                const s = i.changed.find((o) => o.name === t) || i.deleted.find((o) => o.name === t);
                s && n(s.value);
            }).stop;
    }
    const Ey = ue;
    function Sy(e, t) {
        const n = Xn(document.cookie, e),
            r = gn(() => {
                const i = Xn(document.cookie, e);
                i !== n && t(i);
            }, Ey);
        return () => {
            xr(r);
        };
    }
    const Vu = "datadog-ci-visibility-test-execution-id";
    function vy(e, t, n = by(e, Vu)) {
        var r;
        let i = Rt(Vu) || ((r = window.Cypress) === null || r === void 0 ? void 0 : r.env("traceId"));
        const s = n.subscribe((o) => {
            i = o;
        });
        return (
            t.register(0, ({ eventType: o }) =>
                typeof i != "string" ? le : { type: o, session: { type: "ci_test" }, ci_test: { test_execution_id: i } }
            ),
            {
                stop: () => {
                    s.unsubscribe();
                },
            }
        );
    }
    function wy(e, t) {
        const n = Ze(t, { type: F.LONG_ANIMATION_FRAME, buffered: !0 }).subscribe((r) => {
            for (const i of r) {
                const s = Kn(i.startTime),
                    o = {
                        date: s.timeStamp,
                        long_task: {
                            id: de(),
                            entry_type: wc.LONG_ANIMATION_FRAME,
                            duration: O(i.duration),
                            blocking_duration: O(i.blockingDuration),
                            first_ui_event_timestamp: O(i.firstUIEventTimestamp),
                            render_start: O(i.renderStart),
                            style_and_layout_start: O(i.styleAndLayoutStart),
                            start_time: O(i.startTime),
                            scripts: i.scripts.map((a) => ({
                                duration: O(a.duration),
                                pause_duration: O(a.pauseDuration),
                                forced_style_and_layout_duration: O(a.forcedStyleAndLayoutDuration),
                                start_time: O(a.startTime),
                                execution_start: O(a.executionStart),
                                source_url: a.sourceURL,
                                source_function_name: a.sourceFunctionName,
                                source_char_position: a.sourceCharPosition,
                                invoker: a.invoker,
                                invoker_type: a.invokerType,
                                window_attribution: a.windowAttribution,
                            })),
                        },
                        type: C.LONG_TASK,
                        _dd: { discarded: !1 },
                    };
                e.notify(12, {
                    rawRumEvent: o,
                    startTime: s.relative,
                    duration: i.duration,
                    domainContext: { performanceEntry: i },
                });
            }
        });
        return { stop: () => n.unsubscribe() };
    }
    function Ty(e, t) {
        const n = Ze(t, { type: F.LONG_TASK, buffered: !0 }).subscribe((r) => {
            for (const i of r) {
                if (i.entryType !== F.LONG_TASK || !t.trackLongTasks) break;
                const s = Kn(i.startTime),
                    o = {
                        date: s.timeStamp,
                        long_task: { id: de(), entry_type: wc.LONG_TASK, duration: O(i.duration) },
                        type: C.LONG_TASK,
                        _dd: { discarded: !1 },
                    };
                e.notify(12, {
                    rawRumEvent: o,
                    startTime: s.relative,
                    duration: i.duration,
                    domainContext: { performanceEntry: i },
                });
            }
        });
        return {
            stop() {
                n.unsubscribe();
            },
        };
    }
    function Iy(e) {
        e.register(0, ({ eventType: t }) => {
            if (!ic()) return le;
            const n = nc(),
                r = rc();
            return {
                type: t,
                session: { type: "synthetics" },
                synthetics: { test_id: n, result_id: r, injected: Xr() },
            };
        });
    }
    function Ay(e, t, n) {
        const r = jr(e),
            i = n(r);
        return qi(t).forEach(([s, o]) => Us(e, r, s.split(/\.|(?=\[\])/), o)), i;
    }
    function Us(e, t, n, r) {
        const [i, ...s] = n;
        if (i === "[]") {
            Array.isArray(e) && Array.isArray(t) && e.forEach((o, a) => Us(o, t[a], s, r));
            return;
        }
        if (!(!zu(e) || !zu(t))) {
            if (s.length > 0) return Us(e[i], t[i], s, r);
            Ry(e, i, t[i], r);
        }
    }
    function Ry(e, t, n, r) {
        const i = Kt(n);
        i === r ? (e[t] = j(n)) : r === "object" && (i === "undefined" || i === "null") && (e[t] = {});
    }
    function zu(e) {
        return Kt(e) === "object";
    }
    const Nn = { "view.name": "string", "view.url": "string", "view.referrer": "string" },
        Ln = { context: "object" },
        Mn = { service: "string", version: "string" };
    let Hu;
    function Cy(e, t, n, r) {
        Hu = {
            [C.VIEW]: { "view.performance.lcp.resource_url": "string", ...Ln, ...Nn, ...Mn },
            [C.ERROR]: {
                "error.message": "string",
                "error.stack": "string",
                "error.resource.url": "string",
                "error.fingerprint": "string",
                ...Ln,
                ...Nn,
                ...Mn,
            },
            [C.RESOURCE]: {
                "resource.url": "string",
                ...(wn(lt.WRITABLE_RESOURCE_GRAPHQL) ? { "resource.graphql": "object" } : {}),
                ...Ln,
                ...Nn,
                ...Mn,
            },
            [C.ACTION]: { "action.target.name": "string", ...Ln, ...Nn, ...Mn },
            [C.LONG_TASK]: {
                "long_task.scripts[].source_url": "string",
                "long_task.scripts[].invoker": "string",
                ...Ln,
                ...Nn,
                ...Mn,
            },
            [C.VITAL]: { ...Ln, ...Nn, ...Mn },
        };
        const i = {
            [C.ERROR]: Jr(C.ERROR, e.eventRateLimiterThreshold, r),
            [C.ACTION]: Jr(C.ACTION, e.eventRateLimiterThreshold, r),
            [C.VITAL]: Jr(C.VITAL, e.eventRateLimiterThreshold, r),
        };
        t.subscribe(12, ({ startTime: s, duration: o, rawRumEvent: a, domainContext: c }) => {
            const u = n.triggerHook(0, { eventType: a.type, startTime: s, duration: o });
            if (u === He) return;
            const f = Oe(u, a, { ddtags: zr(e).join(",") });
            ky(f, e.beforeSend, c, i) && (zt(f.context) && delete f.context, t.notify(13, f));
        });
    }
    function ky(e, t, n, r) {
        var i;
        if (t) {
            const o = Ay(e, Hu[e.type], (a) => t(a, n));
            if (o === !1 && e.type !== C.VIEW) return !1;
            o === !1 && I.warn("Can't dismiss view events using beforeSend!");
        }
        return !((i = r[e.type]) === null || i === void 0 ? void 0 : i.isLimitReached());
    }
    function xy(e, t, n, r) {
        e.register(0, ({ eventType: i, startTime: s }) => {
            const o = t.findTrackedSession(s),
                a = r.findView(s);
            if (!o || !a) return He;
            let c, u, f;
            return (
                i === C.VIEW
                    ? ((c = n.getReplayStats(a.id) ? !0 : void 0),
                      (u = o.sessionReplay === 1),
                      (f = a.sessionIsActive ? void 0 : !1))
                    : (c = n.isRecording() ? !0 : void 0),
                { type: i, session: { id: o.id, type: "user", has_replay: c, sampled_for_replay: u, is_active: f } }
            );
        }),
            e.register(1, ({ startTime: i }) => {
                const s = t.findTrackedSession(i);
                return s ? { session: { id: s.id } } : le;
            });
    }
    function Oy(e) {
        e.register(0, ({ eventType: t }) => ({ type: t, connectivity: Ra() }));
    }
    function Ny(e, t, n) {
        e.register(0, ({ eventType: r }) => {
            const i = t.source;
            return {
                type: r,
                _dd: {
                    format_version: 2,
                    drift: Go(),
                    configuration: {
                        session_sample_rate: jn(t.sessionSampleRate, 3),
                        session_replay_sample_rate: jn(t.sessionReplaySampleRate, 3),
                        profiling_sample_rate: jn(t.profilingSampleRate, 3),
                    },
                    browser_sdk_version: Je() ? "6.21.2" : void 0,
                    sdk_name: n,
                },
                application: { id: t.applicationId },
                date: $(),
                source: i,
            };
        }),
            e.register(1, () => ({ application: { id: t.applicationId } }));
    }
    function Ly(e, t) {
        e.register(1, () => (t.isGranted() ? le : He));
    }
    const My = za,
        Dy = [C.ACTION, C.ERROR, C.LONG_TASK, C.RESOURCE, C.VITAL];
    function Py(e) {
        return {
            addEvent: (t, n, r, i) => {
                Dy.includes(n.type) && e.notify(12, { startTime: t, rawRumEvent: n, domainContext: r, duration: i });
            },
        };
    }
    function Uy(e, t) {
        if (!t.metricsEnabled) return { stop: N };
        const { unsubscribe: n } = e.subscribe(4, ({ initialViewMetrics: r }) => {
            !r.largestContentfulPaint ||
                !r.navigationTimings ||
                (nr("Initial view metrics", { metrics: Fy(r.largestContentfulPaint, r.navigationTimings) }), n());
        });
        return { stop: n };
    }
    function Fy(e, t) {
        return {
            lcp: { value: e.value },
            navigation: {
                domComplete: t.domComplete,
                domContentLoaded: t.domContentLoaded,
                domInteractive: t.domInteractive,
                firstByte: t.firstByte,
                loadEvent: t.loadEvent,
            },
        };
    }
    function $y(e, t, n, r, i, s, o, a, c) {
        const u = [],
            f = new gg(),
            l = My();
        f.subscribe(13, (he) => Hr("rum", he));
        const d = (he) => {
                f.notify(14, { error: he }), dt("Error reported to customer", { "error.message": he.message });
            },
            p = $a(e),
            h = p.subscribe((he) => {
                f.notify(11, he);
            });
        u.push(() => h.unsubscribe());
        const m = Ha("browser-rum-sdk", e, l, d, p, i);
        u.push(m.stop);
        const g = Je() ? Xb() : Yb(e, f, s);
        if (Je()) ey(f);
        else {
            const he = Qb(e, f, d, p, g.expireObservable, i);
            u.push(() => he.stop()), uy(m, f, he.flushController.flushObservable);
        }
        const w = pg(),
            b = ry(e, location),
            { observable: E, stop: y } = hg();
        u.push(y), Ny(l, e, c);
        const T = hy(l, e),
            _ = bg(f);
        u.push(() => _.stop());
        const M = ny(f, l, b, location);
        u.push(() => M.stop());
        const $e = ay(f, l, e);
        xy(l, g, t, _), Oy(l), Ly(l, s);
        const qe = hc(l, e, "rum", !0),
            L = mc(l, e, g, "rum"),
            W = pc(l, e, "rum"),
            { actionContexts: K, addAction: ie, addEvent: ce, stop: ye } = By(f, l, e, T, w, E, d);
        u.push(ye);
        const {
            addTiming: it,
            startView: vt,
            setViewName: Ye,
            setViewContext: Ae,
            setViewContextProperty: xe,
            getViewContext: se,
            stop: Re,
        } = jb(f, l, e, location, w, E, b, t, _, r);
        u.push(Re);
        const { stop: st } = Uy(f, m);
        u.push(st);
        const { stop: zn } = K_(f, e, T);
        if ((u.push(zn), e.trackLongTasks))
            if (xt(F.LONG_ANIMATION_FRAME)) {
                const { stop: he } = wy(f, e);
                u.push(he);
            } else Ty(f, e);
        const { addError: wr } = k_(f, e, a);
        a.unbuffer(), kg(f, e, g, L, W);
        const $t = Rm(f, T, o),
            Pi = mg(e.applicationId, g, _, K, M);
        return (
            u.push(() => n.stop()),
            {
                addAction: ie,
                addEvent: ce,
                addError: wr,
                addTiming: it,
                addFeatureFlagEvaluation: $e.addFeatureFlagEvaluation,
                startView: vt,
                setViewContext: Ae,
                setViewContextProperty: xe,
                getViewContext: se,
                setViewName: Ye,
                lifeCycle: f,
                viewHistory: _,
                session: g,
                stopSession: () => g.expire(),
                getInternalContext: Pi.get,
                startDurationVital: $t.startDurationVital,
                stopDurationVital: $t.stopDurationVital,
                addDurationVital: $t.addDurationVital,
                addOperationStepVital: $t.addOperationStepVital,
                globalContext: qe,
                userContext: L,
                accountContext: W,
                telemetry: m,
                stop: () => {
                    u.forEach((he) => he());
                },
                hooks: l,
            }
        );
    }
    function By(e, t, n, r, i, s, o) {
        const a = A_(e, t, i, s, n),
            c = Py(e),
            u = _y(t, n),
            f = vy(n, t);
        return (
            Iy(t),
            Cy(n, e, t, o),
            {
                pageStateHistory: r,
                addAction: a.addAction,
                addEvent: c.addEvent,
                actionContexts: a.actionContexts,
                stop: () => {
                    a.stop(), f.stop(), u.stop(), r.stop();
                },
            }
        );
    }
    function Vy(e, { session: t, viewContext: n, errorType: r }) {
        const i = t ? t.id : "no-session-id",
            s = [];
        r !== void 0 && s.push(`error-type=${r}`),
            n && (s.push(`seed=${n.id}`), s.push(`from=${n.startClocks.timeStamp}`));
        const o = zy(e),
            a = `/rum/replay/sessions/${i}`;
        return `${o}${a}?${s.join("&")}`;
    }
    function zy(e) {
        const t = e.site,
            n = e.subdomain || Hy(e);
        return `https://${n ? `${n}.` : ""}${t}`;
    }
    function Hy(e) {
        switch (e.site) {
            case Xt:
            case yp:
                return "app";
            case Aa:
                return "dd";
            default:
                return;
        }
    }
    const Gy = 1e3;
    let Le;
    function jy(e) {
        return di(e).segments_count;
    }
    function Wy(e) {
        di(e).segments_count += 1;
    }
    function Ky(e) {
        di(e).records_count += 1;
    }
    function qy(e, t) {
        di(e).segments_total_raw_size += t;
    }
    function Yy(e) {
        return Le?.get(e);
    }
    function di(e) {
        Le || (Le = new Map());
        let t;
        return (
            Le.has(e)
                ? (t = Le.get(e))
                : ((t = { records_count: 0, segments_count: 0, segments_total_raw_size: 0 }),
                  Le.set(e, t),
                  Le.size > Gy && Xy()),
            t
        );
    }
    function Xy() {
        if (!Le) return;
        const e = Le.keys().next().value;
        e && Le.delete(e);
    }
    function Gu(e, t, n) {
        let r = 0,
            i = [],
            s,
            o = !0,
            a = 0;
        const c = [],
            { stop: u } = J(e, t, "message", ({ data: d }) => {
                if (d.type !== "wrote" || d.streamId !== n) return;
                const p = c[0];
                p &&
                    (p.id === d.id
                        ? (c.shift(),
                          (r += d.additionalBytesCount),
                          i.push(d.result),
                          (s = d.trailer),
                          p.writeCallback
                              ? p.writeCallback(d.result.byteLength)
                              : p.finishCallback && p.finishCallback())
                        : p.id < d.id && u());
            });
        function f() {
            const d = i.length === 0 ? new Uint8Array(0) : nf(i.concat(s)),
                p = { rawBytesCount: r, output: d, outputBytesCount: d.byteLength, encoding: "deflate" };
            return (r = 0), (i = []), p;
        }
        function l() {
            o || (t.postMessage({ action: "reset", streamId: n }), (o = !0));
        }
        return {
            isAsync: !0,
            get isEmpty() {
                return o;
            },
            write(d, p) {
                t.postMessage({ action: "write", id: a, data: d, streamId: n }),
                    c.push({ id: a, writeCallback: p, data: d }),
                    (o = !1),
                    (a += 1);
            },
            finish(d) {
                l(),
                    c.length
                        ? (c.forEach((p) => {
                              delete p.writeCallback;
                          }),
                          (c[c.length - 1].finishCallback = () => d(f())))
                        : d(f());
            },
            finishSync() {
                l();
                const d = c.map((p) => p.data).join("");
                return (c.length = 0), { ...f(), pendingData: d };
            },
            estimateEncodedBytesCount(d) {
                return d.length / 8;
            },
            stop() {
                u();
            },
        };
    }
    function Fs({ configuredUrl: e, error: t, source: n, scriptType: r }) {
        if (
            (I.error(`${n} failed to start: an error occurred while initializing the ${r}:`, t),
            t instanceof Event || (t instanceof Error && Jy(t.message)))
        ) {
            let i;
            e
                ? (i = `Please make sure the ${r} URL ${e} is correct and CSP is correctly configured.`)
                : (i = "Please make sure CSP is correctly configured."),
                I.error(
                    `${i} See documentation at ${Ar}/integrations/content_security_policy_logs/#use-csp-with-real-user-monitoring-and-session-replay`
                );
        } else r === "worker" && as(t);
    }
    function Jy(e) {
        return e.includes("Content Security Policy") || e.includes("requires 'TrustedScriptURL'");
    }
    const Zy = 30 * ue;
    function ju(e) {
        return new Worker(
            e.workerUrl ||
                URL.createObjectURL(
                    new Blob([
                        '(()=>{function t(t){const e=t.reduce((t,e)=>t+e.length,0),a=new Uint8Array(e);let n=0;for(const e of t)a.set(e,n),n+=e.length;return a}function e(t){for(var e=t.length;--e>=0;)t[e]=0}var a=new Uint8Array([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0]),n=new Uint8Array([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13]),r=new Uint8Array([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7]),i=new Uint8Array([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),s=Array(576);e(s);var h=Array(60);e(h);var l=Array(512);e(l);var _=Array(256);e(_);var o=Array(29);e(o);var d,u,f,c=Array(30);function p(t,e,a,n,r){this.static_tree=t,this.extra_bits=e,this.extra_base=a,this.elems=n,this.max_length=r,this.has_stree=t&&t.length}function g(t,e){this.dyn_tree=t,this.max_code=0,this.stat_desc=e}e(c);var v=function(t){return t<256?l[t]:l[256+(t>>>7)]},w=function(t,e){t.pending_buf[t.pending++]=255&e,t.pending_buf[t.pending++]=e>>>8&255},m=function(t,e,a){t.bi_valid>16-a?(t.bi_buf|=e<<t.bi_valid&65535,w(t,t.bi_buf),t.bi_buf=e>>16-t.bi_valid,t.bi_valid+=a-16):(t.bi_buf|=e<<t.bi_valid&65535,t.bi_valid+=a)},b=function(t,e,a){m(t,a[2*e],a[2*e+1])},y=function(t,e){var a=0;do{a|=1&t,t>>>=1,a<<=1}while(--e>0);return a>>>1},z=function(t,e,a){var n,r,i=Array(16),s=0;for(n=1;n<=15;n++)i[n]=s=s+a[n-1]<<1;for(r=0;r<=e;r++){var h=t[2*r+1];0!==h&&(t[2*r]=y(i[h]++,h))}},k=function(t){var e;for(e=0;e<286;e++)t.dyn_ltree[2*e]=0;for(e=0;e<30;e++)t.dyn_dtree[2*e]=0;for(e=0;e<19;e++)t.bl_tree[2*e]=0;t.dyn_ltree[512]=1,t.opt_len=t.static_len=0,t.last_lit=t.matches=0},x=function(t){t.bi_valid>8?w(t,t.bi_buf):t.bi_valid>0&&(t.pending_buf[t.pending++]=t.bi_buf),t.bi_buf=0,t.bi_valid=0},A=function(t,e,a,n){var r=2*e,i=2*a;return t[r]<t[i]||t[r]===t[i]&&n[e]<=n[a]},U=function(t,e,a){for(var n=t.heap[a],r=a<<1;r<=t.heap_len&&(r<t.heap_len&&A(e,t.heap[r+1],t.heap[r],t.depth)&&r++,!A(e,n,t.heap[r],t.depth));)t.heap[a]=t.heap[r],a=r,r<<=1;t.heap[a]=n},B=function(t,e,r){var i,s,h,l,d=0;if(0!==t.last_lit)do{i=t.pending_buf[t.d_buf+2*d]<<8|t.pending_buf[t.d_buf+2*d+1],s=t.pending_buf[t.l_buf+d],d++,0===i?b(t,s,e):(h=_[s],b(t,h+256+1,e),0!==(l=a[h])&&(s-=o[h],m(t,s,l)),i--,h=v(i),b(t,h,r),0!==(l=n[h])&&(i-=c[h],m(t,i,l)))}while(d<t.last_lit);b(t,256,e)},I=function(t,e){var a,n,r,i=e.dyn_tree,s=e.stat_desc.static_tree,h=e.stat_desc.has_stree,l=e.stat_desc.elems,_=-1;for(t.heap_len=0,t.heap_max=573,a=0;a<l;a++)0!==i[2*a]?(t.heap[++t.heap_len]=_=a,t.depth[a]=0):i[2*a+1]=0;for(;t.heap_len<2;)i[2*(r=t.heap[++t.heap_len]=_<2?++_:0)]=1,t.depth[r]=0,t.opt_len--,h&&(t.static_len-=s[2*r+1]);for(e.max_code=_,a=t.heap_len>>1;a>=1;a--)U(t,i,a);r=l;do{a=t.heap[1],t.heap[1]=t.heap[t.heap_len--],U(t,i,1),n=t.heap[1],t.heap[--t.heap_max]=a,t.heap[--t.heap_max]=n,i[2*r]=i[2*a]+i[2*n],t.depth[r]=(t.depth[a]>=t.depth[n]?t.depth[a]:t.depth[n])+1,i[2*a+1]=i[2*n+1]=r,t.heap[1]=r++,U(t,i,1)}while(t.heap_len>=2);t.heap[--t.heap_max]=t.heap[1],function(t,e){var a,n,r,i,s,h,l=e.dyn_tree,_=e.max_code,o=e.stat_desc.static_tree,d=e.stat_desc.has_stree,u=e.stat_desc.extra_bits,f=e.stat_desc.extra_base,c=e.stat_desc.max_length,p=0;for(i=0;i<=15;i++)t.bl_count[i]=0;for(l[2*t.heap[t.heap_max]+1]=0,a=t.heap_max+1;a<573;a++)(i=l[2*l[2*(n=t.heap[a])+1]+1]+1)>c&&(i=c,p++),l[2*n+1]=i,n>_||(t.bl_count[i]++,s=0,n>=f&&(s=u[n-f]),h=l[2*n],t.opt_len+=h*(i+s),d&&(t.static_len+=h*(o[2*n+1]+s)));if(0!==p){do{for(i=c-1;0===t.bl_count[i];)i--;t.bl_count[i]--,t.bl_count[i+1]+=2,t.bl_count[c]--,p-=2}while(p>0);for(i=c;0!==i;i--)for(n=t.bl_count[i];0!==n;)(r=t.heap[--a])>_||(l[2*r+1]!==i&&(t.opt_len+=(i-l[2*r+1])*l[2*r],l[2*r+1]=i),n--)}}(t,e),z(i,_,t.bl_count)},E=function(t,e,a){var n,r,i=-1,s=e[1],h=0,l=7,_=4;for(0===s&&(l=138,_=3),e[2*(a+1)+1]=65535,n=0;n<=a;n++)r=s,s=e[2*(n+1)+1],++h<l&&r===s||(h<_?t.bl_tree[2*r]+=h:0!==r?(r!==i&&t.bl_tree[2*r]++,t.bl_tree[32]++):h<=10?t.bl_tree[34]++:t.bl_tree[36]++,h=0,i=r,0===s?(l=138,_=3):r===s?(l=6,_=3):(l=7,_=4))},C=function(t,e,a){var n,r,i=-1,s=e[1],h=0,l=7,_=4;for(0===s&&(l=138,_=3),n=0;n<=a;n++)if(r=s,s=e[2*(n+1)+1],!(++h<l&&r===s)){if(h<_)do{b(t,r,t.bl_tree)}while(0!==--h);else 0!==r?(r!==i&&(b(t,r,t.bl_tree),h--),b(t,16,t.bl_tree),m(t,h-3,2)):h<=10?(b(t,17,t.bl_tree),m(t,h-3,3)):(b(t,18,t.bl_tree),m(t,h-11,7));h=0,i=r,0===s?(l=138,_=3):r===s?(l=6,_=3):(l=7,_=4)}},D=!1,M=function(t,e,a,n){m(t,0+(n?1:0),3),function(t,e,a){x(t),w(t,a),w(t,~a),t.pending_buf.set(t.window.subarray(e,e+a),t.pending),t.pending+=a}(t,e,a)},j=M,L=function(t,e,a,n){for(var r=65535&t,i=t>>>16&65535,s=0;0!==a;){a-=s=a>2e3?2e3:a;do{i=i+(r=r+e[n++]|0)|0}while(--s);r%=65521,i%=65521}return r|i<<16},S=new Uint32Array(function(){for(var t,e=[],a=0;a<256;a++){t=a;for(var n=0;n<8;n++)t=1&t?3988292384^t>>>1:t>>>1;e[a]=t}return e}()),T=function(t,e,a,n){var r=S,i=n+a;t^=-1;for(var s=n;s<i;s++)t=t>>>8^r[255&(t^e[s])];return-1^t},O={2:"need dictionary",1:"stream end",0:"","-1":"file error","-2":"stream error","-3":"data error","-4":"insufficient memory","-5":"buffer error","-6":"incompatible version"},q=j,F=function(t,e,a){return t.pending_buf[t.d_buf+2*t.last_lit]=e>>>8&255,t.pending_buf[t.d_buf+2*t.last_lit+1]=255&e,t.pending_buf[t.l_buf+t.last_lit]=255&a,t.last_lit++,0===e?t.dyn_ltree[2*a]++:(t.matches++,e--,t.dyn_ltree[2*(_[a]+256+1)]++,t.dyn_dtree[2*v(e)]++),t.last_lit===t.lit_bufsize-1},G=-2,H=258,J=262,K=103,N=113,P=666,Q=function(t,e){return t.msg=O[e],e},R=function(t){return(t<<1)-(t>4?9:0)},V=function(t){for(var e=t.length;--e>=0;)t[e]=0},W=function(t,e,a){return(e<<t.hash_shift^a)&t.hash_mask},X=function(t){var e=t.state,a=e.pending;a>t.avail_out&&(a=t.avail_out),0!==a&&(t.output.set(e.pending_buf.subarray(e.pending_out,e.pending_out+a),t.next_out),t.next_out+=a,e.pending_out+=a,t.total_out+=a,t.avail_out-=a,e.pending-=a,0===e.pending&&(e.pending_out=0))},Y=function(t,e){(function(t,e,a,n){var r,l,_=0;t.level>0?(2===t.strm.data_type&&(t.strm.data_type=function(t){var e,a=4093624447;for(e=0;e<=31;e++,a>>>=1)if(1&a&&0!==t.dyn_ltree[2*e])return 0;if(0!==t.dyn_ltree[18]||0!==t.dyn_ltree[20]||0!==t.dyn_ltree[26])return 1;for(e=32;e<256;e++)if(0!==t.dyn_ltree[2*e])return 1;return 0}(t)),I(t,t.l_desc),I(t,t.d_desc),_=function(t){var e;for(E(t,t.dyn_ltree,t.l_desc.max_code),E(t,t.dyn_dtree,t.d_desc.max_code),I(t,t.bl_desc),e=18;e>=3&&0===t.bl_tree[2*i[e]+1];e--);return t.opt_len+=3*(e+1)+5+5+4,e}(t),r=t.opt_len+3+7>>>3,(l=t.static_len+3+7>>>3)<=r&&(r=l)):r=l=a+5,a+4<=r&&-1!==e?M(t,e,a,n):4===t.strategy||l===r?(m(t,2+(n?1:0),3),B(t,s,h)):(m(t,4+(n?1:0),3),function(t,e,a,n){var r;for(m(t,e-257,5),m(t,a-1,5),m(t,n-4,4),r=0;r<n;r++)m(t,t.bl_tree[2*i[r]+1],3);C(t,t.dyn_ltree,e-1),C(t,t.dyn_dtree,a-1)}(t,t.l_desc.max_code+1,t.d_desc.max_code+1,_+1),B(t,t.dyn_ltree,t.dyn_dtree)),k(t),n&&x(t)})(t,t.block_start>=0?t.block_start:-1,t.strstart-t.block_start,e),t.block_start=t.strstart,X(t.strm)},Z=function(t,e){t.pending_buf[t.pending++]=e},$=function(t,e){t.pending_buf[t.pending++]=e>>>8&255,t.pending_buf[t.pending++]=255&e},tt=function(t,e,a,n){var r=t.avail_in;return r>n&&(r=n),0===r?0:(t.avail_in-=r,e.set(t.input.subarray(t.next_in,t.next_in+r),a),1===t.state.wrap?t.adler=L(t.adler,e,r,a):2===t.state.wrap&&(t.adler=T(t.adler,e,r,a)),t.next_in+=r,t.total_in+=r,r)},et=function(t,e){var a,n,r=t.max_chain_length,i=t.strstart,s=t.prev_length,h=t.nice_match,l=t.strstart>t.w_size-J?t.strstart-(t.w_size-J):0,_=t.window,o=t.w_mask,d=t.prev,u=t.strstart+H,f=_[i+s-1],c=_[i+s];t.prev_length>=t.good_match&&(r>>=2),h>t.lookahead&&(h=t.lookahead);do{if(_[(a=e)+s]===c&&_[a+s-1]===f&&_[a]===_[i]&&_[++a]===_[i+1]){i+=2,a++;do{}while(_[++i]===_[++a]&&_[++i]===_[++a]&&_[++i]===_[++a]&&_[++i]===_[++a]&&_[++i]===_[++a]&&_[++i]===_[++a]&&_[++i]===_[++a]&&_[++i]===_[++a]&&i<u);if(n=H-(u-i),i=u-H,n>s){if(t.match_start=e,s=n,n>=h)break;f=_[i+s-1],c=_[i+s]}}}while((e=d[e&o])>l&&0!==--r);return s<=t.lookahead?s:t.lookahead},at=function(t){var e,a,n,r,i,s=t.w_size;do{if(r=t.window_size-t.lookahead-t.strstart,t.strstart>=s+(s-J)){t.window.set(t.window.subarray(s,s+s),0),t.match_start-=s,t.strstart-=s,t.block_start-=s,e=a=t.hash_size;do{n=t.head[--e],t.head[e]=n>=s?n-s:0}while(--a);e=a=s;do{n=t.prev[--e],t.prev[e]=n>=s?n-s:0}while(--a);r+=s}if(0===t.strm.avail_in)break;if(a=tt(t.strm,t.window,t.strstart+t.lookahead,r),t.lookahead+=a,t.lookahead+t.insert>=3)for(i=t.strstart-t.insert,t.ins_h=t.window[i],t.ins_h=W(t,t.ins_h,t.window[i+1]);t.insert&&(t.ins_h=W(t,t.ins_h,t.window[i+3-1]),t.prev[i&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=i,i++,t.insert--,!(t.lookahead+t.insert<3)););}while(t.lookahead<J&&0!==t.strm.avail_in)},nt=function(t,e){for(var a,n;;){if(t.lookahead<J){if(at(t),t.lookahead<J&&0===e)return 1;if(0===t.lookahead)break}if(a=0,t.lookahead>=3&&(t.ins_h=W(t,t.ins_h,t.window[t.strstart+3-1]),a=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart),0!==a&&t.strstart-a<=t.w_size-J&&(t.match_length=et(t,a)),t.match_length>=3)if(n=F(t,t.strstart-t.match_start,t.match_length-3),t.lookahead-=t.match_length,t.match_length<=t.max_lazy_match&&t.lookahead>=3){t.match_length--;do{t.strstart++,t.ins_h=W(t,t.ins_h,t.window[t.strstart+3-1]),a=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart}while(0!==--t.match_length);t.strstart++}else t.strstart+=t.match_length,t.match_length=0,t.ins_h=t.window[t.strstart],t.ins_h=W(t,t.ins_h,t.window[t.strstart+1]);else n=F(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++;if(n&&(Y(t,!1),0===t.strm.avail_out))return 1}return t.insert=t.strstart<2?t.strstart:2,4===e?(Y(t,!0),0===t.strm.avail_out?3:4):t.last_lit&&(Y(t,!1),0===t.strm.avail_out)?1:2},rt=function(t,e){for(var a,n,r;;){if(t.lookahead<J){if(at(t),t.lookahead<J&&0===e)return 1;if(0===t.lookahead)break}if(a=0,t.lookahead>=3&&(t.ins_h=W(t,t.ins_h,t.window[t.strstart+3-1]),a=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart),t.prev_length=t.match_length,t.prev_match=t.match_start,t.match_length=2,0!==a&&t.prev_length<t.max_lazy_match&&t.strstart-a<=t.w_size-J&&(t.match_length=et(t,a),t.match_length<=5&&(1===t.strategy||3===t.match_length&&t.strstart-t.match_start>4096)&&(t.match_length=2)),t.prev_length>=3&&t.match_length<=t.prev_length){r=t.strstart+t.lookahead-3,n=F(t,t.strstart-1-t.prev_match,t.prev_length-3),t.lookahead-=t.prev_length-1,t.prev_length-=2;do{++t.strstart<=r&&(t.ins_h=W(t,t.ins_h,t.window[t.strstart+3-1]),a=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart)}while(0!==--t.prev_length);if(t.match_available=0,t.match_length=2,t.strstart++,n&&(Y(t,!1),0===t.strm.avail_out))return 1}else if(t.match_available){if((n=F(t,0,t.window[t.strstart-1]))&&Y(t,!1),t.strstart++,t.lookahead--,0===t.strm.avail_out)return 1}else t.match_available=1,t.strstart++,t.lookahead--}return t.match_available&&(n=F(t,0,t.window[t.strstart-1]),t.match_available=0),t.insert=t.strstart<2?t.strstart:2,4===e?(Y(t,!0),0===t.strm.avail_out?3:4):t.last_lit&&(Y(t,!1),0===t.strm.avail_out)?1:2};function it(t,e,a,n,r){this.good_length=t,this.max_lazy=e,this.nice_length=a,this.max_chain=n,this.func=r}var st=[new it(0,0,0,0,function(t,e){var a=65535;for(a>t.pending_buf_size-5&&(a=t.pending_buf_size-5);;){if(t.lookahead<=1){if(at(t),0===t.lookahead&&0===e)return 1;if(0===t.lookahead)break}t.strstart+=t.lookahead,t.lookahead=0;var n=t.block_start+a;if((0===t.strstart||t.strstart>=n)&&(t.lookahead=t.strstart-n,t.strstart=n,Y(t,!1),0===t.strm.avail_out))return 1;if(t.strstart-t.block_start>=t.w_size-J&&(Y(t,!1),0===t.strm.avail_out))return 1}return t.insert=0,4===e?(Y(t,!0),0===t.strm.avail_out?3:4):(t.strstart>t.block_start&&(Y(t,!1),t.strm.avail_out),1)}),new it(4,4,8,4,nt),new it(4,5,16,8,nt),new it(4,6,32,32,nt),new it(4,4,16,16,rt),new it(8,16,32,32,rt),new it(8,16,128,128,rt),new it(8,32,128,256,rt),new it(32,128,258,1024,rt),new it(32,258,258,4096,rt)];function ht(){this.strm=null,this.status=0,this.pending_buf=null,this.pending_buf_size=0,this.pending_out=0,this.pending=0,this.wrap=0,this.gzhead=null,this.gzindex=0,this.method=8,this.last_flush=-1,this.w_size=0,this.w_bits=0,this.w_mask=0,this.window=null,this.window_size=0,this.prev=null,this.head=null,this.ins_h=0,this.hash_size=0,this.hash_bits=0,this.hash_mask=0,this.hash_shift=0,this.block_start=0,this.match_length=0,this.prev_match=0,this.match_available=0,this.strstart=0,this.match_start=0,this.lookahead=0,this.prev_length=0,this.max_chain_length=0,this.max_lazy_match=0,this.level=0,this.strategy=0,this.good_match=0,this.nice_match=0,this.dyn_ltree=new Uint16Array(1146),this.dyn_dtree=new Uint16Array(122),this.bl_tree=new Uint16Array(78),V(this.dyn_ltree),V(this.dyn_dtree),V(this.bl_tree),this.l_desc=null,this.d_desc=null,this.bl_desc=null,this.bl_count=new Uint16Array(16),this.heap=new Uint16Array(573),V(this.heap),this.heap_len=0,this.heap_max=0,this.depth=new Uint16Array(573),V(this.depth),this.l_buf=0,this.lit_bufsize=0,this.last_lit=0,this.d_buf=0,this.opt_len=0,this.static_len=0,this.matches=0,this.insert=0,this.bi_buf=0,this.bi_valid=0}for(var lt=function(t){var e,i=function(t){if(!t||!t.state)return Q(t,G);t.total_in=t.total_out=0,t.data_type=2;var e=t.state;return e.pending=0,e.pending_out=0,e.wrap<0&&(e.wrap=-e.wrap),e.status=e.wrap?42:N,t.adler=2===e.wrap?0:1,e.last_flush=0,function(t){D||(function(){var t,e,i,g,v,w=Array(16);for(i=0,g=0;g<28;g++)for(o[g]=i,t=0;t<1<<a[g];t++)_[i++]=g;for(_[i-1]=g,v=0,g=0;g<16;g++)for(c[g]=v,t=0;t<1<<n[g];t++)l[v++]=g;for(v>>=7;g<30;g++)for(c[g]=v<<7,t=0;t<1<<n[g]-7;t++)l[256+v++]=g;for(e=0;e<=15;e++)w[e]=0;for(t=0;t<=143;)s[2*t+1]=8,t++,w[8]++;for(;t<=255;)s[2*t+1]=9,t++,w[9]++;for(;t<=279;)s[2*t+1]=7,t++,w[7]++;for(;t<=287;)s[2*t+1]=8,t++,w[8]++;for(z(s,287,w),t=0;t<30;t++)h[2*t+1]=5,h[2*t]=y(t,5);d=new p(s,a,257,286,15),u=new p(h,n,0,30,15),f=new p([],r,0,19,7)}(),D=!0),t.l_desc=new g(t.dyn_ltree,d),t.d_desc=new g(t.dyn_dtree,u),t.bl_desc=new g(t.bl_tree,f),t.bi_buf=0,t.bi_valid=0,k(t)}(e),0}(t);return 0===i&&((e=t.state).window_size=2*e.w_size,V(e.head),e.max_lazy_match=st[e.level].max_lazy,e.good_match=st[e.level].good_length,e.nice_match=st[e.level].nice_length,e.max_chain_length=st[e.level].max_chain,e.strstart=0,e.block_start=0,e.lookahead=0,e.insert=0,e.match_length=e.prev_length=2,e.match_available=0,e.ins_h=0),i},_t=function(t,e){var a,n;if(!t||!t.state||e>5||e<0)return t?Q(t,G):G;var r=t.state;if(!t.output||!t.input&&0!==t.avail_in||r.status===P&&4!==e)return Q(t,0===t.avail_out?-5:G);r.strm=t;var i=r.last_flush;if(r.last_flush=e,42===r.status)if(2===r.wrap)t.adler=0,Z(r,31),Z(r,139),Z(r,8),r.gzhead?(Z(r,(r.gzhead.text?1:0)+(r.gzhead.hcrc?2:0)+(r.gzhead.extra?4:0)+(r.gzhead.name?8:0)+(r.gzhead.comment?16:0)),Z(r,255&r.gzhead.time),Z(r,r.gzhead.time>>8&255),Z(r,r.gzhead.time>>16&255),Z(r,r.gzhead.time>>24&255),Z(r,9===r.level?2:r.strategy>=2||r.level<2?4:0),Z(r,255&r.gzhead.os),r.gzhead.extra&&r.gzhead.extra.length&&(Z(r,255&r.gzhead.extra.length),Z(r,r.gzhead.extra.length>>8&255)),r.gzhead.hcrc&&(t.adler=T(t.adler,r.pending_buf,r.pending,0)),r.gzindex=0,r.status=69):(Z(r,0),Z(r,0),Z(r,0),Z(r,0),Z(r,0),Z(r,9===r.level?2:r.strategy>=2||r.level<2?4:0),Z(r,3),r.status=N);else{var h=8+(r.w_bits-8<<4)<<8;h|=(r.strategy>=2||r.level<2?0:r.level<6?1:6===r.level?2:3)<<6,0!==r.strstart&&(h|=32),h+=31-h%31,r.status=N,$(r,h),0!==r.strstart&&($(r,t.adler>>>16),$(r,65535&t.adler)),t.adler=1}if(69===r.status)if(r.gzhead.extra){for(a=r.pending;r.gzindex<(65535&r.gzhead.extra.length)&&(r.pending!==r.pending_buf_size||(r.gzhead.hcrc&&r.pending>a&&(t.adler=T(t.adler,r.pending_buf,r.pending-a,a)),X(t),a=r.pending,r.pending!==r.pending_buf_size));)Z(r,255&r.gzhead.extra[r.gzindex]),r.gzindex++;r.gzhead.hcrc&&r.pending>a&&(t.adler=T(t.adler,r.pending_buf,r.pending-a,a)),r.gzindex===r.gzhead.extra.length&&(r.gzindex=0,r.status=73)}else r.status=73;if(73===r.status)if(r.gzhead.name){a=r.pending;do{if(r.pending===r.pending_buf_size&&(r.gzhead.hcrc&&r.pending>a&&(t.adler=T(t.adler,r.pending_buf,r.pending-a,a)),X(t),a=r.pending,r.pending===r.pending_buf_size)){n=1;break}n=r.gzindex<r.gzhead.name.length?255&r.gzhead.name.charCodeAt(r.gzindex++):0,Z(r,n)}while(0!==n);r.gzhead.hcrc&&r.pending>a&&(t.adler=T(t.adler,r.pending_buf,r.pending-a,a)),0===n&&(r.gzindex=0,r.status=91)}else r.status=91;if(91===r.status)if(r.gzhead.comment){a=r.pending;do{if(r.pending===r.pending_buf_size&&(r.gzhead.hcrc&&r.pending>a&&(t.adler=T(t.adler,r.pending_buf,r.pending-a,a)),X(t),a=r.pending,r.pending===r.pending_buf_size)){n=1;break}n=r.gzindex<r.gzhead.comment.length?255&r.gzhead.comment.charCodeAt(r.gzindex++):0,Z(r,n)}while(0!==n);r.gzhead.hcrc&&r.pending>a&&(t.adler=T(t.adler,r.pending_buf,r.pending-a,a)),0===n&&(r.status=K)}else r.status=K;if(r.status===K&&(r.gzhead.hcrc?(r.pending+2>r.pending_buf_size&&X(t),r.pending+2<=r.pending_buf_size&&(Z(r,255&t.adler),Z(r,t.adler>>8&255),t.adler=0,r.status=N)):r.status=N),0!==r.pending){if(X(t),0===t.avail_out)return r.last_flush=-1,0}else if(0===t.avail_in&&R(e)<=R(i)&&4!==e)return Q(t,-5);if(r.status===P&&0!==t.avail_in)return Q(t,-5);if(0!==t.avail_in||0!==r.lookahead||0!==e&&r.status!==P){var l=2===r.strategy?function(t,e){for(var a;;){if(0===t.lookahead&&(at(t),0===t.lookahead)){if(0===e)return 1;break}if(t.match_length=0,a=F(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++,a&&(Y(t,!1),0===t.strm.avail_out))return 1}return t.insert=0,4===e?(Y(t,!0),0===t.strm.avail_out?3:4):t.last_lit&&(Y(t,!1),0===t.strm.avail_out)?1:2}(r,e):3===r.strategy?function(t,e){for(var a,n,r,i,s=t.window;;){if(t.lookahead<=H){if(at(t),t.lookahead<=H&&0===e)return 1;if(0===t.lookahead)break}if(t.match_length=0,t.lookahead>=3&&t.strstart>0&&(n=s[r=t.strstart-1])===s[++r]&&n===s[++r]&&n===s[++r]){i=t.strstart+H;do{}while(n===s[++r]&&n===s[++r]&&n===s[++r]&&n===s[++r]&&n===s[++r]&&n===s[++r]&&n===s[++r]&&n===s[++r]&&r<i);t.match_length=H-(i-r),t.match_length>t.lookahead&&(t.match_length=t.lookahead)}if(t.match_length>=3?(a=F(t,1,t.match_length-3),t.lookahead-=t.match_length,t.strstart+=t.match_length,t.match_length=0):(a=F(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++),a&&(Y(t,!1),0===t.strm.avail_out))return 1}return t.insert=0,4===e?(Y(t,!0),0===t.strm.avail_out?3:4):t.last_lit&&(Y(t,!1),0===t.strm.avail_out)?1:2}(r,e):st[r.level].func(r,e);if(3!==l&&4!==l||(r.status=P),1===l||3===l)return 0===t.avail_out&&(r.last_flush=-1),0;if(2===l&&(1===e?function(t){m(t,2,3),b(t,256,s),function(t){16===t.bi_valid?(w(t,t.bi_buf),t.bi_buf=0,t.bi_valid=0):t.bi_valid>=8&&(t.pending_buf[t.pending++]=255&t.bi_buf,t.bi_buf>>=8,t.bi_valid-=8)}(t)}(r):5!==e&&(q(r,0,0,!1),3===e&&(V(r.head),0===r.lookahead&&(r.strstart=0,r.block_start=0,r.insert=0))),X(t),0===t.avail_out))return r.last_flush=-1,0}return 4!==e?0:r.wrap<=0?1:(2===r.wrap?(Z(r,255&t.adler),Z(r,t.adler>>8&255),Z(r,t.adler>>16&255),Z(r,t.adler>>24&255),Z(r,255&t.total_in),Z(r,t.total_in>>8&255),Z(r,t.total_in>>16&255),Z(r,t.total_in>>24&255)):($(r,t.adler>>>16),$(r,65535&t.adler)),X(t),r.wrap>0&&(r.wrap=-r.wrap),0!==r.pending?0:1)},ot=function(t){if(!t||!t.state)return G;var e=t.state.status;return 42!==e&&69!==e&&73!==e&&91!==e&&e!==K&&e!==N&&e!==P?Q(t,G):(t.state=null,e===N?Q(t,-3):0)},dt=new Uint8Array(256),ut=0;ut<256;ut++)dt[ut]=ut>=252?6:ut>=248?5:ut>=240?4:ut>=224?3:ut>=192?2:1;dt[254]=dt[254]=1;var ft=function(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg="",this.state=null,this.data_type=2,this.adler=0},ct=Object.prototype.toString;function pt(){this.options={level:-1,method:8,chunkSize:16384,windowBits:15,memLevel:8,strategy:0};var t=this.options;t.raw&&t.windowBits>0?t.windowBits=-t.windowBits:t.gzip&&t.windowBits>0&&t.windowBits<16&&(t.windowBits+=16),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new ft,this.strm.avail_out=0;var e,a,n=function(t,e,a,n,r,i){if(!t)return G;var s=1;if(-1===e&&(e=6),n<0?(s=0,n=-n):n>15&&(s=2,n-=16),r<1||r>9||8!==a||n<8||n>15||e<0||e>9||i<0||i>4)return Q(t,G);8===n&&(n=9);var h=new ht;return t.state=h,h.strm=t,h.wrap=s,h.gzhead=null,h.w_bits=n,h.w_size=1<<h.w_bits,h.w_mask=h.w_size-1,h.hash_bits=r+7,h.hash_size=1<<h.hash_bits,h.hash_mask=h.hash_size-1,h.hash_shift=~~((h.hash_bits+3-1)/3),h.window=new Uint8Array(2*h.w_size),h.head=new Uint16Array(h.hash_size),h.prev=new Uint16Array(h.w_size),h.lit_bufsize=1<<r+6,h.pending_buf_size=4*h.lit_bufsize,h.pending_buf=new Uint8Array(h.pending_buf_size),h.d_buf=1*h.lit_bufsize,h.l_buf=3*h.lit_bufsize,h.level=e,h.strategy=i,h.method=a,lt(t)}(this.strm,t.level,t.method,t.windowBits,t.memLevel,t.strategy);if(0!==n)throw Error(O[n]);if(t.header&&(e=this.strm,a=t.header,e&&e.state&&(2!==e.state.wrap||(e.state.gzhead=a))),t.dictionary){var r;if(r="[object ArrayBuffer]"===ct.call(t.dictionary)?new Uint8Array(t.dictionary):t.dictionary,0!==(n=function(t,e){var a=e.length;if(!t||!t.state)return G;var n=t.state,r=n.wrap;if(2===r||1===r&&42!==n.status||n.lookahead)return G;if(1===r&&(t.adler=L(t.adler,e,a,0)),n.wrap=0,a>=n.w_size){0===r&&(V(n.head),n.strstart=0,n.block_start=0,n.insert=0);var i=new Uint8Array(n.w_size);i.set(e.subarray(a-n.w_size,a),0),e=i,a=n.w_size}var s=t.avail_in,h=t.next_in,l=t.input;for(t.avail_in=a,t.next_in=0,t.input=e,at(n);n.lookahead>=3;){var _=n.strstart,o=n.lookahead-2;do{n.ins_h=W(n,n.ins_h,n.window[_+3-1]),n.prev[_&n.w_mask]=n.head[n.ins_h],n.head[n.ins_h]=_,_++}while(--o);n.strstart=_,n.lookahead=2,at(n)}return n.strstart+=n.lookahead,n.block_start=n.strstart,n.insert=n.lookahead,n.lookahead=0,n.match_length=n.prev_length=2,n.match_available=0,t.next_in=h,t.input=l,t.avail_in=s,n.wrap=r,0}(this.strm,r)))throw Error(O[n]);this._dict_set=!0}}function gt(t,e,a){try{t.postMessage({type:"errored",error:e,streamId:a})}catch(n){t.postMessage({type:"errored",error:e+"",streamId:a})}}function vt(t){const e=t.strm.adler;return new Uint8Array([3,0,e>>>24&255,e>>>16&255,e>>>8&255,255&e])}pt.prototype.push=function(t,e){var a,n,r=this.strm,i=this.options.chunkSize;if(this.ended)return!1;for(n=e===~~e?e:!0===e?4:0,"[object ArrayBuffer]"===ct.call(t)?r.input=new Uint8Array(t):r.input=t,r.next_in=0,r.avail_in=r.input.length;;)if(0===r.avail_out&&(r.output=new Uint8Array(i),r.next_out=0,r.avail_out=i),(2===n||3===n)&&r.avail_out<=6)this.onData(r.output.subarray(0,r.next_out)),r.avail_out=0;else{if(1===(a=_t(r,n)))return r.next_out>0&&this.onData(r.output.subarray(0,r.next_out)),a=ot(this.strm),this.onEnd(a),this.ended=!0,0===a;if(0!==r.avail_out){if(n>0&&r.next_out>0)this.onData(r.output.subarray(0,r.next_out)),r.avail_out=0;else if(0===r.avail_in)break}else this.onData(r.output)}return!0},pt.prototype.onData=function(t){this.chunks.push(t)},pt.prototype.onEnd=function(t){0===t&&(this.result=function(t){for(var e=0,a=0,n=t.length;a<n;a++)e+=t[a].length;for(var r=new Uint8Array(e),i=0,s=0,h=t.length;i<h;i++){var l=t[i];r.set(l,s),s+=l.length}return r}(this.chunks)),this.chunks=[],this.err=t,this.msg=this.strm.msg},function(e=self){try{const a=new Map;e.addEventListener("message",n=>{try{const r=function(e,a){switch(a.action){case"init":return{type:"initialized",version:"6.21.2"};case"write":{let n=e.get(a.streamId);n||(n=new pt,e.set(a.streamId,n));const r=n.chunks.length,i=function(t){if("function"==typeof TextEncoder&&TextEncoder.prototype.encode)return(new TextEncoder).encode(t);let e,a,n,r,i,s=t.length,h=0;for(r=0;r<s;r++)a=t.charCodeAt(r),55296==(64512&a)&&r+1<s&&(n=t.charCodeAt(r+1),56320==(64512&n)&&(a=65536+(a-55296<<10)+(n-56320),r++)),h+=a<128?1:a<2048?2:a<65536?3:4;for(e=new Uint8Array(h),i=0,r=0;i<h;r++)a=t.charCodeAt(r),55296==(64512&a)&&r+1<s&&(n=t.charCodeAt(r+1),56320==(64512&n)&&(a=65536+(a-55296<<10)+(n-56320),r++)),a<128?e[i++]=a:a<2048?(e[i++]=192|a>>>6,e[i++]=128|63&a):a<65536?(e[i++]=224|a>>>12,e[i++]=128|a>>>6&63,e[i++]=128|63&a):(e[i++]=240|a>>>18,e[i++]=128|a>>>12&63,e[i++]=128|a>>>6&63,e[i++]=128|63&a);return e}(a.data);return n.push(i,2),{type:"wrote",id:a.id,streamId:a.streamId,result:t(n.chunks.slice(r)),trailer:vt(n),additionalBytesCount:i.length}}case"reset":e.delete(a.streamId)}}(a,n.data);r&&e.postMessage(r)}catch(t){gt(e,t,n.data&&"streamId"in n.data?n.data.streamId:void 0)}})}catch(t){gt(e,t)}}()})();',
                    ])
                )
        );
    }
    let re = { status: 0 };
    function Wu(e, t, n, r = ju) {
        switch ((re.status === 0 && Qy(e, t, r), re.status)) {
            case 1:
                return re.initializationFailureCallbacks.push(n), re.worker;
            case 3:
                return re.worker;
        }
    }
    function Ku() {
        return re.status;
    }
    function Qy(e, t, n = ju) {
        try {
            const r = n(e),
                { stop: i } = J(e, r, "error", (a) => {
                    $s(e, t, a);
                }),
                { stop: s } = J(e, r, "message", ({ data: a }) => {
                    a.type === "errored" ? $s(e, t, a.error, a.streamId) : a.type === "initialized" && tE(a.version);
                });
            r.postMessage({ action: "init" }),
                ae(() => eE(t), Zy),
                (re = {
                    status: 1,
                    worker: r,
                    stop: () => {
                        i(), s();
                    },
                    initializationFailureCallbacks: [],
                });
        } catch (r) {
            $s(e, t, r);
        }
    }
    function eE(e) {
        re.status === 1 &&
            (I.error(`${e} failed to start: a timeout occurred while initializing the Worker`),
            re.initializationFailureCallbacks.forEach((t) => t()),
            (re = { status: 2 }));
    }
    function tE(e) {
        re.status === 1 && (re = { status: 3, worker: re.worker, stop: re.stop, version: e });
    }
    function $s(e, t, n, r) {
        re.status === 1 || re.status === 0
            ? (Fs({ configuredUrl: e.workerUrl, error: n, source: t, scriptType: "worker" }),
              re.status === 1 && re.initializationFailureCallbacks.forEach((i) => i()),
              (re = { status: 2 }))
            : as(n, { worker_version: re.status === 3 && re.version, stream_id: r });
    }
    function qu() {
        return (
            typeof Array.from == "function" &&
            typeof CSSSupportsRule == "function" &&
            typeof URL.createObjectURL == "function" &&
            "forEach" in NodeList.prototype
        );
    }
    function nE(e, t, n, r) {
        const i = t.findTrackedSession(),
            s = rE(i, r),
            o = n.findView();
        return Vy(e, { viewContext: o, errorType: s, session: i });
    }
    function rE(e, t) {
        if (!qu()) return "browser-not-supported";
        if (!e) return "rum-not-tracked";
        if (e.sessionReplay === 0) return "incorrect-session-plan";
        if (!t) return "replay-not-started";
    }
    function iE(e, t) {
        if (!e.metricsEnabled) return { stop: N };
        let n, r, i;
        const { unsubscribe: s } = t.subscribe((o) => {
            switch (o.type) {
                case "start":
                    (n = { forced: o.forced, timestamp: $() }), (r = void 0), (i = void 0);
                    break;
                case "document-ready":
                    n && (r = Q(n.timestamp, $()));
                    break;
                case "recorder-settled":
                    n && (i = Q(n.timestamp, $()));
                    break;
                case "aborted":
                case "deflate-encoder-load-failed":
                case "recorder-load-failed":
                case "succeeded":
                    s(), n && nr("Recorder init metrics", { metrics: sE(n.forced, i, Q(n.timestamp, $()), o.type, r) });
                    break;
            }
        });
        return { stop: s };
    }
    function sE(e, t, n, r, i) {
        return {
            forced: e,
            loadRecorderModuleDuration: t,
            recorderInitDuration: n,
            result: r,
            waitForDocReadyDuration: i,
        };
    }
    function oE(e, t, n, r, i, s, o) {
        let a = 0,
            c;
        t.subscribe(9, () => {
            (a === 2 || a === 3) && (d(), (a = 1));
        }),
            t.subscribe(10, () => {
                a === 1 && l();
            });
        const u = new D();
        iE(o, u);
        const f = async (p) => {
            u.notify({ type: "start", forced: p });
            const [h] = await Promise.all([
                Yu(u, { type: "recorder-settled" }, i()),
                Yu(u, { type: "document-ready" }, yh(e, "interactive")),
            ]);
            if (a !== 2) {
                u.notify({ type: "aborted" });
                return;
            }
            if (!h) {
                (a = 0), u.notify({ type: "recorder-load-failed" });
                return;
            }
            const m = s();
            if (!m) {
                (a = 0), u.notify({ type: "deflate-encoder-load-failed" });
                return;
            }
            ({ stop: c } = h(t, e, n, r, m, o)), (a = 3), u.notify({ type: "succeeded" });
        };
        function l(p) {
            const h = n.findTrackedSession();
            if (aE(h, p)) {
                a = 1;
                return;
            }
            if (cE(a)) return;
            a = 2;
            const m = uE(h, p) || !1;
            f(m).catch(ze), m && n.setForcedReplay();
        }
        function d() {
            a === 3 && c?.(), (a = 0);
        }
        return {
            start: l,
            stop: d,
            getSessionReplayLink() {
                return nE(e, n, r, a !== 0);
            },
            isRecording: () => a === 3,
        };
    }
    function aE(e, t) {
        return !e || (e.sessionReplay === 0 && (!t || !t.force));
    }
    function cE(e) {
        return e === 2 || e === 3;
    }
    function uE(e, t) {
        return t && t.force && e.sessionReplay === 0;
    }
    async function Yu(e, t, n) {
        try {
            return await n;
        } finally {
            e.notify(t);
        }
    }
    function lE() {
        let e = 0;
        return {
            strategy: {
                start() {
                    e = 1;
                },
                stop() {
                    e = 2;
                },
                isRecording: () => !1,
                getSessionReplayLink: N,
            },
            shouldStartImmediately(t) {
                return e === 1 || (e === 0 && !t.startSessionReplayRecordingManually);
            },
        };
    }
    function dE(e, t) {
        if ((Je() && !Fa("records")) || !qu())
            return {
                start: N,
                stop: N,
                getReplayStats: () => {},
                onRumStart: N,
                isRecording: () => !1,
                getSessionReplayLink: () => {},
            };
        let { strategy: n, shouldStartImmediately: r } = lE();
        return {
            start: (s) => n.start(s),
            stop: () => n.stop(),
            getSessionReplayLink: () => n.getSessionReplayLink(),
            onRumStart: i,
            isRecording: () => Ku() === 3 && n.isRecording(),
            getReplayStats: (s) => (Ku() === 3 ? Yy(s) : void 0),
        };
        function i(s, o, a, c, u, f) {
            let l;
            function d() {
                return (
                    l ||
                        (u ??
                            (u = Wu(
                                o,
                                "Datadog Session Replay",
                                () => {
                                    n.stop();
                                },
                                t
                            )),
                        u && (l = Gu(o, u, 1))),
                    l
                );
            }
            (n = oE(o, s, a, c, e, d, f)), r(o) && n.start();
        }
    }
    const zI = "modulepreload",
        HI = function (e) {
            return "/" + e;
        },
        GI = {},
        Xu = function (t, n, r) {
            let i = Promise.resolve();
            function s(o) {
                const a = new Event("vite:preloadError", { cancelable: !0 });
                if (((a.payload = o), window.dispatchEvent(a), !a.defaultPrevented)) throw o;
            }
            return i.then((o) => {
                for (const a of o || []) a.status === "rejected" && s(a.reason);
                return t().catch(s);
            });
        };
    async function fE(e = pE) {
        try {
            return await e();
        } catch (t) {
            Fs({ error: t, source: "Recorder", scriptType: "module" });
        }
    }
    async function pE() {
        return (await Xu(() => Promise.resolve().then(() => vI), void 0)).startRecording;
    }
    function hE() {
        return Ee().Profiler !== void 0;
    }
    const mE = (e) => {
        let t = { status: "starting" };
        return (
            e.register(0, ({ eventType: n }) =>
                n !== C.VIEW && n !== C.LONG_TASK ? le : { type: n, _dd: { profiling: t } }
            ),
            {
                get: () => t,
                set: (n) => {
                    t = n;
                },
            }
        );
    };
    async function gE(e = _E) {
        try {
            return await e();
        } catch (t) {
            Fs({ error: t, source: "Profiler", scriptType: "module" });
        }
    }
    async function _E() {
        return (await Xu(() => Promise.resolve().then(() => UI), void 0)).createRumProfiler;
    }
    function bE() {
        let e;
        function t(n, r, i, s, o) {
            const a = s.findTrackedSession();
            if (!a || !kc(a.id, i.profilingSampleRate)) return;
            const c = mE(r);
            if (!hE()) {
                c.set({ status: "error", error_reason: "not-supported-by-browser" });
                return;
            }
            gE()
                .then((u) => {
                    if (!u) {
                        dt("[DD_RUM] Failed to lazy load the RUM Profiler"),
                            c.set({ status: "error", error_reason: "failed-to-lazy-load" });
                        return;
                    }
                    (e = u(i, n, s, c)), e.start(o.findView());
                })
                .catch(ze);
        }
        return {
            onRumStart: t,
            stop: () => {
                e?.stop().catch(ze);
            },
        };
    }
    const yE = dE(fE),
        EE = bE(),
        SE = dg($y, yE, EE, { startDeflateWorker: Wu, createDeflateEncoder: Gu, sdkName: "rum" });
    Ja(Ee(), "DD_RUM", SE);
    function vE(e) {
        return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
    }
    var mr = { exports: {} },
        wE = mr.exports,
        Ju;
    function TE() {
        return (
            Ju ||
                ((Ju = 1),
                (function (e, t) {
                    (function (n, r) {
                        var i = "",
                            s = "?",
                            o = "function",
                            a = "undefined",
                            c = "object",
                            u = "string",
                            f = "major",
                            l = "model",
                            d = "name",
                            p = "type",
                            h = "vendor",
                            m = "version",
                            g = "architecture",
                            w = "console",
                            b = "mobile",
                            E = "tablet",
                            y = "smarttv",
                            T = "wearable",
                            _ = "embedded",
                            M = 500,
                            $e = "Amazon",
                            qe = "Apple",
                            L = "ASUS",
                            W = "BlackBerry",
                            K = "Browser",
                            ie = "Chrome",
                            ce = "Edge",
                            ye = "Firefox",
                            it = "Google",
                            vt = "Huawei",
                            Ye = "LG",
                            Ae = "Microsoft",
                            xe = "Motorola",
                            se = "Opera",
                            Re = "Samsung",
                            st = "Sharp",
                            zn = "Sony",
                            wr = "Xiaomi",
                            $t = "Zebra",
                            Pi = "Facebook",
                            he = "Chromium OS",
                            Gd = "Mac OS",
                            FI = function (U, q) {
                                var x = {};
                                for (var Z in U)
                                    q[Z] && q[Z].length % 2 === 0 ? (x[Z] = q[Z].concat(U[Z])) : (x[Z] = U[Z]);
                                return x;
                            },
                            Ui = function (U) {
                                for (var q = {}, x = 0; x < U.length; x++) q[U[x].toUpperCase()] = U[x];
                                return q;
                            },
                            jd = function (U, q) {
                                return typeof U === u ? Tr(q).indexOf(Tr(U)) !== -1 : !1;
                            },
                            Tr = function (U) {
                                return U.toLowerCase();
                            },
                            $I = function (U) {
                                return typeof U === u ? U.replace(/[^\d\.]/g, i).split(".")[0] : r;
                            },
                            Fo = function (U, q) {
                                if (typeof U === u)
                                    return (U = U.replace(/^\s\s*/, i)), typeof q === a ? U : U.substring(0, M);
                            },
                            Ir = function (U, q) {
                                for (var x = 0, Z, wt, at, G, R, ct; x < q.length && !R; ) {
                                    var Bo = q[x],
                                        qd = q[x + 1];
                                    for (Z = wt = 0; Z < Bo.length && !R && Bo[Z]; )
                                        if (((R = Bo[Z++].exec(U)), R))
                                            for (at = 0; at < qd.length; at++)
                                                (ct = R[++wt]),
                                                    (G = qd[at]),
                                                    typeof G === c && G.length > 0
                                                        ? G.length === 2
                                                            ? typeof G[1] == o
                                                                ? (this[G[0]] = G[1].call(this, ct))
                                                                : (this[G[0]] = G[1])
                                                            : G.length === 3
                                                              ? typeof G[1] === o && !(G[1].exec && G[1].test)
                                                                  ? (this[G[0]] = ct ? G[1].call(this, ct, G[2]) : r)
                                                                  : (this[G[0]] = ct ? ct.replace(G[1], G[2]) : r)
                                                              : G.length === 4 &&
                                                                (this[G[0]] = ct
                                                                    ? G[3].call(this, ct.replace(G[1], G[2]))
                                                                    : r)
                                                        : (this[G] = ct || r);
                                    x += 2;
                                }
                            },
                            $o = function (U, q) {
                                for (var x in q)
                                    if (typeof q[x] === c && q[x].length > 0) {
                                        for (var Z = 0; Z < q[x].length; Z++)
                                            if (jd(q[x][Z], U)) return x === s ? r : x;
                                    } else if (jd(q[x], U)) return x === s ? r : x;
                                return U;
                            },
                            BI = {
                                "1.0": "/8",
                                1.2: "/1",
                                1.3: "/3",
                                "2.0": "/412",
                                "2.0.2": "/416",
                                "2.0.3": "/417",
                                "2.0.4": "/419",
                                "?": "/",
                            },
                            Wd = {
                                ME: "4.90",
                                "NT 3.11": "NT3.51",
                                "NT 4.0": "NT4.0",
                                2e3: "NT 5.0",
                                XP: ["NT 5.1", "NT 5.2"],
                                Vista: "NT 6.0",
                                7: "NT 6.1",
                                8: "NT 6.2",
                                8.1: "NT 6.3",
                                10: ["NT 6.4", "NT 10.0"],
                                RT: "ARM",
                            },
                            Kd = {
                                browser: [
                                    [/\b(?:crmo|crios)\/([\w\.]+)/i],
                                    [m, [d, "Chrome"]],
                                    [/edg(?:e|ios|a)?\/([\w\.]+)/i],
                                    [m, [d, "Edge"]],
                                    [
                                        /(opera mini)\/([-\w\.]+)/i,
                                        /(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i,
                                        /(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i,
                                    ],
                                    [d, m],
                                    [/opios[\/ ]+([\w\.]+)/i],
                                    [m, [d, se + " Mini"]],
                                    [/\bop(?:rg)?x\/([\w\.]+)/i],
                                    [m, [d, se + " GX"]],
                                    [/\bopr\/([\w\.]+)/i],
                                    [m, [d, se]],
                                    [/\bb[ai]*d(?:uhd|[ub]*[aekoprswx]{5,6})[\/ ]?([\w\.]+)/i],
                                    [m, [d, "Baidu"]],
                                    [
                                        /(kindle)\/([\w\.]+)/i,
                                        /(lunascape|maxthon|netfront|jasmine|blazer)[\/ ]?([\w\.]*)/i,
                                        /(avant|iemobile|slim)\s?(?:browser)?[\/ ]?([\w\.]*)/i,
                                        /(?:ms|\()(ie) ([\w\.]+)/i,
                                        /(flock|rockmelt|midori|epiphany|silk|skyfire|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon|rekonq|puffin|brave|whale(?!.+naver)|qqbrowserlite|qq|duckduckgo)\/([-\w\.]+)/i,
                                        /(heytap|ovi)browser\/([\d\.]+)/i,
                                        /(weibo)__([\d\.]+)/i,
                                    ],
                                    [d, m],
                                    [/\bddg\/([\w\.]+)/i],
                                    [m, [d, "DuckDuckGo"]],
                                    [/(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i],
                                    [m, [d, "UC" + K]],
                                    [
                                        /microm.+\bqbcore\/([\w\.]+)/i,
                                        /\bqbcore\/([\w\.]+).+microm/i,
                                        /micromessenger\/([\w\.]+)/i,
                                    ],
                                    [m, [d, "WeChat"]],
                                    [/konqueror\/([\w\.]+)/i],
                                    [m, [d, "Konqueror"]],
                                    [/trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i],
                                    [m, [d, "IE"]],
                                    [/ya(?:search)?browser\/([\w\.]+)/i],
                                    [m, [d, "Yandex"]],
                                    [/slbrowser\/([\w\.]+)/i],
                                    [m, [d, "Smart Lenovo " + K]],
                                    [/(avast|avg)\/([\w\.]+)/i],
                                    [[d, /(.+)/, "$1 Secure " + K], m],
                                    [/\bfocus\/([\w\.]+)/i],
                                    [m, [d, ye + " Focus"]],
                                    [/\bopt\/([\w\.]+)/i],
                                    [m, [d, se + " Touch"]],
                                    [/coc_coc\w+\/([\w\.]+)/i],
                                    [m, [d, "Coc Coc"]],
                                    [/dolfin\/([\w\.]+)/i],
                                    [m, [d, "Dolphin"]],
                                    [/coast\/([\w\.]+)/i],
                                    [m, [d, se + " Coast"]],
                                    [/miuibrowser\/([\w\.]+)/i],
                                    [m, [d, "MIUI " + K]],
                                    [/fxios\/([-\w\.]+)/i],
                                    [m, [d, ye]],
                                    [/\bqihu|(qi?ho?o?|360)browser/i],
                                    [[d, "360 " + K]],
                                    [/(oculus|sailfish|huawei|vivo)browser\/([\w\.]+)/i],
                                    [[d, /(.+)/, "$1 " + K], m],
                                    [/samsungbrowser\/([\w\.]+)/i],
                                    [m, [d, Re + " Internet"]],
                                    [/(comodo_dragon)\/([\w\.]+)/i],
                                    [[d, /_/g, " "], m],
                                    [/metasr[\/ ]?([\d\.]+)/i],
                                    [m, [d, "Sogou Explorer"]],
                                    [/(sogou)mo\w+\/([\d\.]+)/i],
                                    [[d, "Sogou Mobile"], m],
                                    [
                                        /(electron)\/([\w\.]+) safari/i,
                                        /(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i,
                                        /m?(qqbrowser|2345Explorer)[\/ ]?([\w\.]+)/i,
                                    ],
                                    [d, m],
                                    [/(lbbrowser)/i, /\[(linkedin)app\]/i],
                                    [d],
                                    [/((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i],
                                    [[d, Pi], m],
                                    [
                                        /(Klarna)\/([\w\.]+)/i,
                                        /(kakao(?:talk|story))[\/ ]([\w\.]+)/i,
                                        /(naver)\(.*?(\d+\.[\w\.]+).*\)/i,
                                        /safari (line)\/([\w\.]+)/i,
                                        /\b(line)\/([\w\.]+)\/iab/i,
                                        /(alipay)client\/([\w\.]+)/i,
                                        /(twitter)(?:and| f.+e\/([\w\.]+))/i,
                                        /(chromium|instagram|snapchat)[\/ ]([-\w\.]+)/i,
                                    ],
                                    [d, m],
                                    [/\bgsa\/([\w\.]+) .*safari\//i],
                                    [m, [d, "GSA"]],
                                    [/musical_ly(?:.+app_?version\/|_)([\w\.]+)/i],
                                    [m, [d, "TikTok"]],
                                    [/headlesschrome(?:\/([\w\.]+)| )/i],
                                    [m, [d, ie + " Headless"]],
                                    [/ wv\).+(chrome)\/([\w\.]+)/i],
                                    [[d, ie + " WebView"], m],
                                    [/droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i],
                                    [m, [d, "Android " + K]],
                                    [/(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i],
                                    [d, m],
                                    [/version\/([\w\.\,]+) .*mobile\/\w+ (safari)/i],
                                    [m, [d, "Mobile Safari"]],
                                    [/version\/([\w(\.|\,)]+) .*(mobile ?safari|safari)/i],
                                    [m, d],
                                    [/webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i],
                                    [d, [m, $o, BI]],
                                    [/(webkit|khtml)\/([\w\.]+)/i],
                                    [d, m],
                                    [/(navigator|netscape\d?)\/([-\w\.]+)/i],
                                    [[d, "Netscape"], m],
                                    [/mobile vr; rv:([\w\.]+)\).+firefox/i],
                                    [m, [d, ye + " Reality"]],
                                    [
                                        /ekiohf.+(flow)\/([\w\.]+)/i,
                                        /(swiftfox)/i,
                                        /(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror|klar)[\/ ]?([\w\.\+]+)/i,
                                        /(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([-\w\.]+)$/i,
                                        /(firefox)\/([\w\.]+)/i,
                                        /(mozilla)\/([\w\.]+) .+rv\:.+gecko\/\d+/i,
                                        /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir|obigo|mosaic|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i,
                                        /(links) \(([\w\.]+)/i,
                                        /panasonic;(viera)/i,
                                    ],
                                    [d, m],
                                    [/(cobalt)\/([\w\.]+)/i],
                                    [d, [m, /master.|lts./, ""]],
                                ],
                                cpu: [
                                    [/(?:(amd|x(?:(?:86|64)[-_])?|wow|win)64)[;\)]/i],
                                    [[g, "amd64"]],
                                    [/(ia32(?=;))/i],
                                    [[g, Tr]],
                                    [/((?:i[346]|x)86)[;\)]/i],
                                    [[g, "ia32"]],
                                    [/\b(aarch64|arm(v?8e?l?|_?64))\b/i],
                                    [[g, "arm64"]],
                                    [/\b(arm(?:v[67])?ht?n?[fl]p?)\b/i],
                                    [[g, "armhf"]],
                                    [/windows (ce|mobile); ppc;/i],
                                    [[g, "arm"]],
                                    [/((?:ppc|powerpc)(?:64)?)(?: mac|;|\))/i],
                                    [[g, /ower/, i, Tr]],
                                    [/(sun4\w)[;\)]/i],
                                    [[g, "sparc"]],
                                    [
                                        /((?:avr32|ia64(?=;))|68k(?=\))|\barm(?=v(?:[1-7]|[5-7]1)l?|;|eabi)|(?=atmel )avr|(?:irix|mips|sparc)(?:64)?\b|pa-risc)/i,
                                    ],
                                    [[g, Tr]],
                                ],
                                device: [
                                    [/\b(sch-i[89]0\d|shw-m380s|sm-[ptx]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i],
                                    [l, [h, Re], [p, E]],
                                    [
                                        /\b((?:s[cgp]h|gt|sm)-\w+|sc[g-]?[\d]+a?|galaxy nexus)/i,
                                        /samsung[- ]([-\w]+)/i,
                                        /sec-(sgh\w+)/i,
                                    ],
                                    [l, [h, Re], [p, b]],
                                    [/(?:\/|\()(ip(?:hone|od)[\w, ]*)(?:\/|;)/i],
                                    [l, [h, qe], [p, b]],
                                    [
                                        /\((ipad);[-\w\),; ]+apple/i,
                                        /applecoremedia\/[\w\.]+ \((ipad)/i,
                                        /\b(ipad)\d\d?,\d\d?[;\]].+ios/i,
                                    ],
                                    [l, [h, qe], [p, E]],
                                    [/(macintosh);/i],
                                    [l, [h, qe]],
                                    [/\b(sh-?[altvz]?\d\d[a-ekm]?)/i],
                                    [l, [h, st], [p, b]],
                                    [/\b((?:ag[rs][23]?|bah2?|sht?|btv)-a?[lw]\d{2})\b(?!.+d\/s)/i],
                                    [l, [h, vt], [p, E]],
                                    [
                                        /(?:huawei|honor)([-\w ]+)[;\)]/i,
                                        /\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i,
                                    ],
                                    [l, [h, vt], [p, b]],
                                    [
                                        /\b(poco[\w ]+|m2\d{3}j\d\d[a-z]{2})(?: bui|\))/i,
                                        /\b; (\w+) build\/hm\1/i,
                                        /\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i,
                                        /\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i,
                                        /oid[^\)]+; (m?[12][0-389][01]\w{3,6}[c-y])( bui|; wv|\))/i,
                                        /\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max|cc)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite)?)(?: bui|\))/i,
                                    ],
                                    [
                                        [l, /_/g, " "],
                                        [h, wr],
                                        [p, b],
                                    ],
                                    [
                                        /oid[^\)]+; (2\d{4}(283|rpbf)[cgl])( bui|\))/i,
                                        /\b(mi[-_ ]?(?:pad)(?:[\w_ ]+))(?: bui|\))/i,
                                    ],
                                    [
                                        [l, /_/g, " "],
                                        [h, wr],
                                        [p, E],
                                    ],
                                    [
                                        /; (\w+) bui.+ oppo/i,
                                        /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i,
                                    ],
                                    [l, [h, "OPPO"], [p, b]],
                                    [/\b(opd2\d{3}a?) bui/i],
                                    [l, [h, "OPPO"], [p, E]],
                                    [/vivo (\w+)(?: bui|\))/i, /\b(v[12]\d{3}\w?[at])(?: bui|;)/i],
                                    [l, [h, "Vivo"], [p, b]],
                                    [/\b(rmx[1-3]\d{3})(?: bui|;|\))/i],
                                    [l, [h, "Realme"], [p, b]],
                                    [
                                        /\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i,
                                        /\bmot(?:orola)?[- ](\w*)/i,
                                        /((?:moto[\w\(\) ]+|xt\d{3,4}|nexus 6)(?= bui|\)))/i,
                                    ],
                                    [l, [h, xe], [p, b]],
                                    [/\b(mz60\d|xoom[2 ]{0,2}) build\//i],
                                    [l, [h, xe], [p, E]],
                                    [/((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i],
                                    [l, [h, Ye], [p, E]],
                                    [
                                        /(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i,
                                        /\blg[-e;\/ ]+((?!browser|netcast|android tv)\w+)/i,
                                        /\blg-?([\d\w]+) bui/i,
                                    ],
                                    [l, [h, Ye], [p, b]],
                                    [
                                        /(ideatab[-\w ]+)/i,
                                        /lenovo ?(s[56]000[-\w]+|tab(?:[\w ]+)|yt[-\d\w]{6}|tb[-\d\w]{6})/i,
                                    ],
                                    [l, [h, "Lenovo"], [p, E]],
                                    [/(?:maemo|nokia).*(n900|lumia \d+)/i, /nokia[-_ ]?([-\w\.]*)/i],
                                    [
                                        [l, /_/g, " "],
                                        [h, "Nokia"],
                                        [p, b],
                                    ],
                                    [/(pixel c)\b/i],
                                    [l, [h, it], [p, E]],
                                    [/droid.+; (pixel[\daxl ]{0,6})(?: bui|\))/i],
                                    [l, [h, it], [p, b]],
                                    [
                                        /droid.+ (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-a\w[4-7][12])(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i,
                                    ],
                                    [l, [h, zn], [p, b]],
                                    [/sony tablet [ps]/i, /\b(?:sony)?sgp\w+(?: bui|\))/i],
                                    [
                                        [l, "Xperia Tablet"],
                                        [h, zn],
                                        [p, E],
                                    ],
                                    [/ (kb2005|in20[12]5|be20[12][59])\b/i, /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i],
                                    [l, [h, "OnePlus"], [p, b]],
                                    [
                                        /(alexa)webm/i,
                                        /(kf[a-z]{2}wi|aeo[c-r]{2})( bui|\))/i,
                                        /(kf[a-z]+)( bui|\)).+silk\//i,
                                    ],
                                    [l, [h, $e], [p, E]],
                                    [/((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i],
                                    [
                                        [l, /(.+)/g, "Fire Phone $1"],
                                        [h, $e],
                                        [p, b],
                                    ],
                                    [/(playbook);[-\w\),; ]+(rim)/i],
                                    [l, h, [p, E]],
                                    [/\b((?:bb[a-f]|st[hv])100-\d)/i, /\(bb10; (\w+)/i],
                                    [l, [h, W], [p, b]],
                                    [
                                        /(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i,
                                    ],
                                    [l, [h, L], [p, E]],
                                    [/ (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i],
                                    [l, [h, L], [p, b]],
                                    [/(nexus 9)/i],
                                    [l, [h, "HTC"], [p, E]],
                                    [
                                        /(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i,
                                        /(zte)[- ]([\w ]+?)(?: bui|\/|\))/i,
                                        /(alcatel|geeksphone|nexian|panasonic(?!(?:;|\.))|sony(?!-bra))[-_ ]?([-\w]*)/i,
                                    ],
                                    [h, [l, /_/g, " "], [p, b]],
                                    [/droid.+; ([ab][1-7]-?[0178a]\d\d?)/i],
                                    [l, [h, "Acer"], [p, E]],
                                    [/droid.+; (m[1-5] note) bui/i, /\bmz-([-\w]{2,})/i],
                                    [l, [h, "Meizu"], [p, b]],
                                    [/; ((?:power )?armor(?:[\w ]{0,8}))(?: bui|\))/i],
                                    [l, [h, "Ulefone"], [p, b]],
                                    [
                                        /(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron|infinix|tecno)[-_ ]?([-\w]*)/i,
                                        /(hp) ([\w ]+\w)/i,
                                        /(asus)-?(\w+)/i,
                                        /(microsoft); (lumia[\w ]+)/i,
                                        /(lenovo)[-_ ]?([-\w]+)/i,
                                        /(jolla)/i,
                                        /(oppo) ?([\w ]+) bui/i,
                                    ],
                                    [h, l, [p, b]],
                                    [
                                        /(kobo)\s(ereader|touch)/i,
                                        /(archos) (gamepad2?)/i,
                                        /(hp).+(touchpad(?!.+tablet)|tablet)/i,
                                        /(kindle)\/([\w\.]+)/i,
                                        /(nook)[\w ]+build\/(\w+)/i,
                                        /(dell) (strea[kpr\d ]*[\dko])/i,
                                        /(le[- ]+pan)[- ]+(\w{1,9}) bui/i,
                                        /(trinity)[- ]*(t\d{3}) bui/i,
                                        /(gigaset)[- ]+(q\w{1,9}) bui/i,
                                        /(vodafone) ([\w ]+)(?:\)| bui)/i,
                                    ],
                                    [h, l, [p, E]],
                                    [/(surface duo)/i],
                                    [l, [h, Ae], [p, E]],
                                    [/droid [\d\.]+; (fp\du?)(?: b|\))/i],
                                    [l, [h, "Fairphone"], [p, b]],
                                    [/(u304aa)/i],
                                    [l, [h, "AT&T"], [p, b]],
                                    [/\bsie-(\w*)/i],
                                    [l, [h, "Siemens"], [p, b]],
                                    [/\b(rct\w+) b/i],
                                    [l, [h, "RCA"], [p, E]],
                                    [/\b(venue[\d ]{2,7}) b/i],
                                    [l, [h, "Dell"], [p, E]],
                                    [/\b(q(?:mv|ta)\w+) b/i],
                                    [l, [h, "Verizon"], [p, E]],
                                    [/\b(?:barnes[& ]+noble |bn[rt])([\w\+ ]*) b/i],
                                    [l, [h, "Barnes & Noble"], [p, E]],
                                    [/\b(tm\d{3}\w+) b/i],
                                    [l, [h, "NuVision"], [p, E]],
                                    [/\b(k88) b/i],
                                    [l, [h, "ZTE"], [p, E]],
                                    [/\b(nx\d{3}j) b/i],
                                    [l, [h, "ZTE"], [p, b]],
                                    [/\b(gen\d{3}) b.+49h/i],
                                    [l, [h, "Swiss"], [p, b]],
                                    [/\b(zur\d{3}) b/i],
                                    [l, [h, "Swiss"], [p, E]],
                                    [/\b((zeki)?tb.*\b) b/i],
                                    [l, [h, "Zeki"], [p, E]],
                                    [/\b([yr]\d{2}) b/i, /\b(dragon[- ]+touch |dt)(\w{5}) b/i],
                                    [[h, "Dragon Touch"], l, [p, E]],
                                    [/\b(ns-?\w{0,9}) b/i],
                                    [l, [h, "Insignia"], [p, E]],
                                    [/\b((nxa|next)-?\w{0,9}) b/i],
                                    [l, [h, "NextBook"], [p, E]],
                                    [/\b(xtreme\_)?(v(1[045]|2[015]|[3469]0|7[05])) b/i],
                                    [[h, "Voice"], l, [p, b]],
                                    [/\b(lvtel\-)?(v1[12]) b/i],
                                    [[h, "LvTel"], l, [p, b]],
                                    [/\b(ph-1) /i],
                                    [l, [h, "Essential"], [p, b]],
                                    [/\b(v(100md|700na|7011|917g).*\b) b/i],
                                    [l, [h, "Envizen"], [p, E]],
                                    [/\b(trio[-\w\. ]+) b/i],
                                    [l, [h, "MachSpeed"], [p, E]],
                                    [/\btu_(1491) b/i],
                                    [l, [h, "Rotor"], [p, E]],
                                    [/(shield[\w ]+) b/i],
                                    [l, [h, "Nvidia"], [p, E]],
                                    [/(sprint) (\w+)/i],
                                    [h, l, [p, b]],
                                    [/(kin\.[onetw]{3})/i],
                                    [
                                        [l, /\./g, " "],
                                        [h, Ae],
                                        [p, b],
                                    ],
                                    [/droid.+; (cc6666?|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i],
                                    [l, [h, $t], [p, E]],
                                    [/droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i],
                                    [l, [h, $t], [p, b]],
                                    [/smart-tv.+(samsung)/i],
                                    [h, [p, y]],
                                    [/hbbtv.+maple;(\d+)/i],
                                    [
                                        [l, /^/, "SmartTV"],
                                        [h, Re],
                                        [p, y],
                                    ],
                                    [/(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i],
                                    [
                                        [h, Ye],
                                        [p, y],
                                    ],
                                    [/(apple) ?tv/i],
                                    [h, [l, qe + " TV"], [p, y]],
                                    [/crkey/i],
                                    [
                                        [l, ie + "cast"],
                                        [h, it],
                                        [p, y],
                                    ],
                                    [/droid.+aft(\w+)( bui|\))/i],
                                    [l, [h, $e], [p, y]],
                                    [/\(dtv[\);].+(aquos)/i, /(aquos-tv[\w ]+)\)/i],
                                    [l, [h, st], [p, y]],
                                    [/(bravia[\w ]+)( bui|\))/i],
                                    [l, [h, zn], [p, y]],
                                    [/(mitv-\w{5}) bui/i],
                                    [l, [h, wr], [p, y]],
                                    [/Hbbtv.*(technisat) (.*);/i],
                                    [h, l, [p, y]],
                                    [
                                        /\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i,
                                        /hbbtv\/\d+\.\d+\.\d+ +\([\w\+ ]*; *([\w\d][^;]*);([^;]*)/i,
                                    ],
                                    [
                                        [h, Fo],
                                        [l, Fo],
                                        [p, y],
                                    ],
                                    [/\b(android tv|smart[- ]?tv|opera tv|tv; rv:)\b/i],
                                    [[p, y]],
                                    [/(ouya)/i, /(nintendo) ([wids3utch]+)/i],
                                    [h, l, [p, w]],
                                    [/droid.+; (shield) bui/i],
                                    [l, [h, "Nvidia"], [p, w]],
                                    [/(playstation [345portablevi]+)/i],
                                    [l, [h, zn], [p, w]],
                                    [/\b(xbox(?: one)?(?!; xbox))[\); ]/i],
                                    [l, [h, Ae], [p, w]],
                                    [/((pebble))app/i],
                                    [h, l, [p, T]],
                                    [/(watch)(?: ?os[,\/]|\d,\d\/)[\d\.]+/i],
                                    [l, [h, qe], [p, T]],
                                    [/droid.+; (glass) \d/i],
                                    [l, [h, it], [p, T]],
                                    [/droid.+; (wt63?0{2,3})\)/i],
                                    [l, [h, $t], [p, T]],
                                    [/(quest( \d| pro)?)/i],
                                    [l, [h, Pi], [p, T]],
                                    [/(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i],
                                    [h, [p, _]],
                                    [/(aeobc)\b/i],
                                    [l, [h, $e], [p, _]],
                                    [/droid .+?; ([^;]+?)(?: bui|; wv\)|\) applew).+? mobile safari/i],
                                    [l, [p, b]],
                                    [/droid .+?; ([^;]+?)(?: bui|\) applew).+?(?! mobile) safari/i],
                                    [l, [p, E]],
                                    [/\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i],
                                    [[p, E]],
                                    [/(phone|mobile(?:[;\/]| [ \w\/\.]*safari)|pda(?=.+windows ce))/i],
                                    [[p, b]],
                                    [/(android[-\w\. ]{0,9});.+buil/i],
                                    [l, [h, "Generic"]],
                                ],
                                engine: [
                                    [/windows.+ edge\/([\w\.]+)/i],
                                    [m, [d, ce + "HTML"]],
                                    [/webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i],
                                    [m, [d, "Blink"]],
                                    [
                                        /(presto)\/([\w\.]+)/i,
                                        /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i,
                                        /ekioh(flow)\/([\w\.]+)/i,
                                        /(khtml|tasman|links)[\/ ]\(?([\w\.]+)/i,
                                        /(icab)[\/ ]([23]\.[\d\.]+)/i,
                                        /\b(libweb)/i,
                                    ],
                                    [d, m],
                                    [/rv\:([\w\.]{1,9})\b.+(gecko)/i],
                                    [m, d],
                                ],
                                os: [
                                    [/microsoft (windows) (vista|xp)/i],
                                    [d, m],
                                    [/(windows (?:phone(?: os)?|mobile))[\/ ]?([\d\.\w ]*)/i],
                                    [d, [m, $o, Wd]],
                                    [
                                        /windows nt 6\.2; (arm)/i,
                                        /windows[\/ ]?([ntce\d\. ]+\w)(?!.+xbox)/i,
                                        /(?:win(?=3|9|n)|win 9x )([nt\d\.]+)/i,
                                    ],
                                    [
                                        [m, $o, Wd],
                                        [d, "Windows"],
                                    ],
                                    [
                                        /ip[honead]{2,4}\b(?:.*os ([\w]+) like mac|; opera)/i,
                                        /(?:ios;fbsv\/|iphone.+ios[\/ ])([\d\.]+)/i,
                                        /cfnetwork\/.+darwin/i,
                                    ],
                                    [
                                        [m, /_/g, "."],
                                        [d, "iOS"],
                                    ],
                                    [/(mac os x) ?([\w\. ]*)/i, /(macintosh|mac_powerpc\b)(?!.+haiku)/i],
                                    [
                                        [d, Gd],
                                        [m, /_/g, "."],
                                    ],
                                    [/droid ([\w\.]+)\b.+(android[- ]x86|harmonyos)/i],
                                    [m, d],
                                    [
                                        /(android|webos|qnx|bada|rim tablet os|maemo|meego|sailfish)[-\/ ]?([\w\.]*)/i,
                                        /(blackberry)\w*\/([\w\.]*)/i,
                                        /(tizen|kaios)[\/ ]([\w\.]+)/i,
                                        /\((series40);/i,
                                    ],
                                    [d, m],
                                    [/\(bb(10);/i],
                                    [m, [d, W]],
                                    [/(?:symbian ?os|symbos|s60(?=;)|series60)[-\/ ]?([\w\.]*)/i],
                                    [m, [d, "Symbian"]],
                                    [/mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i],
                                    [m, [d, ye + " OS"]],
                                    [/web0s;.+rt(tv)/i, /\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i],
                                    [m, [d, "webOS"]],
                                    [/watch(?: ?os[,\/]|\d,\d\/)([\d\.]+)/i],
                                    [m, [d, "watchOS"]],
                                    [/crkey\/([\d\.]+)/i],
                                    [m, [d, ie + "cast"]],
                                    [/(cros) [\w]+(?:\)| ([\w\.]+)\b)/i],
                                    [[d, he], m],
                                    [
                                        /panasonic;(viera)/i,
                                        /(netrange)mmh/i,
                                        /(nettv)\/(\d+\.[\w\.]+)/i,
                                        /(nintendo|playstation) ([wids345portablevuch]+)/i,
                                        /(xbox); +xbox ([^\);]+)/i,
                                        /\b(joli|palm)\b ?(?:os)?\/?([\w\.]*)/i,
                                        /(mint)[\/\(\) ]?(\w*)/i,
                                        /(mageia|vectorlinux)[; ]/i,
                                        /([kxln]?ubuntu|debian|suse|opensuse|gentoo|arch(?= linux)|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire)(?: gnu\/linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\/ ]?(?!chrom|package)([-\w\.]*)/i,
                                        /(hurd|linux) ?([\w\.]*)/i,
                                        /(gnu) ?([\w\.]*)/i,
                                        /\b([-frentopcghs]{0,5}bsd|dragonfly)[\/ ]?(?!amd|[ix346]{1,2}86)([\w\.]*)/i,
                                        /(haiku) (\w+)/i,
                                    ],
                                    [d, m],
                                    [/(sunos) ?([\w\.\d]*)/i],
                                    [[d, "Solaris"], m],
                                    [
                                        /((?:open)?solaris)[-\/ ]?([\w\.]*)/i,
                                        /(aix) ((\d)(?=\.|\)| )[\w\.])*/i,
                                        /\b(beos|os\/2|amigaos|morphos|openvms|fuchsia|hp-ux|serenityos)/i,
                                        /(unix) ?([\w\.]*)/i,
                                    ],
                                    [d, m],
                                ],
                            },
                            ot = function (U, q) {
                                if ((typeof U === c && ((q = U), (U = r)), !(this instanceof ot)))
                                    return new ot(U, q).getResult();
                                var x = typeof n !== a && n.navigator ? n.navigator : r,
                                    Z = U || (x && x.userAgent ? x.userAgent : i),
                                    wt = x && x.userAgentData ? x.userAgentData : r,
                                    at = q ? FI(Kd, q) : Kd,
                                    G = x && x.userAgent == Z;
                                return (
                                    (this.getBrowser = function () {
                                        var R = {};
                                        return (
                                            (R[d] = r),
                                            (R[m] = r),
                                            Ir.call(R, Z, at.browser),
                                            (R[f] = $I(R[m])),
                                            G && x && x.brave && typeof x.brave.isBrave == o && (R[d] = "Brave"),
                                            R
                                        );
                                    }),
                                    (this.getCPU = function () {
                                        var R = {};
                                        return (R[g] = r), Ir.call(R, Z, at.cpu), R;
                                    }),
                                    (this.getDevice = function () {
                                        var R = {};
                                        return (
                                            (R[h] = r),
                                            (R[l] = r),
                                            (R[p] = r),
                                            Ir.call(R, Z, at.device),
                                            G && !R[p] && wt && wt.mobile && (R[p] = b),
                                            G &&
                                                R[l] == "Macintosh" &&
                                                x &&
                                                typeof x.standalone !== a &&
                                                x.maxTouchPoints &&
                                                x.maxTouchPoints > 2 &&
                                                ((R[l] = "iPad"), (R[p] = E)),
                                            R
                                        );
                                    }),
                                    (this.getEngine = function () {
                                        var R = {};
                                        return (R[d] = r), (R[m] = r), Ir.call(R, Z, at.engine), R;
                                    }),
                                    (this.getOS = function () {
                                        var R = {};
                                        return (
                                            (R[d] = r),
                                            (R[m] = r),
                                            Ir.call(R, Z, at.os),
                                            G &&
                                                !R[d] &&
                                                wt &&
                                                wt.platform &&
                                                wt.platform != "Unknown" &&
                                                (R[d] = wt.platform.replace(/chrome os/i, he).replace(/macos/i, Gd)),
                                            R
                                        );
                                    }),
                                    (this.getResult = function () {
                                        return {
                                            ua: this.getUA(),
                                            browser: this.getBrowser(),
                                            engine: this.getEngine(),
                                            os: this.getOS(),
                                            device: this.getDevice(),
                                            cpu: this.getCPU(),
                                        };
                                    }),
                                    (this.getUA = function () {
                                        return Z;
                                    }),
                                    (this.setUA = function (R) {
                                        return (Z = typeof R === u && R.length > M ? Fo(R, M) : R), this;
                                    }),
                                    this.setUA(Z),
                                    this
                                );
                            };
                        (ot.BROWSER = Ui([d, m, f])),
                            (ot.CPU = Ui([g])),
                            (ot.DEVICE = Ui([l, h, p, w, b, y, E, T, _])),
                            (ot.ENGINE = ot.OS = Ui([d, m])),
                            e.exports && (t = e.exports = ot),
                            (t.UAParser = ot);
                        var Hn = typeof n !== a && (n.jQuery || n.Zepto);
                        if (Hn && !Hn.ua) {
                            var Fi = new ot();
                            (Hn.ua = Fi.getResult()),
                                (Hn.ua.get = function () {
                                    return Fi.getUA();
                                }),
                                (Hn.ua.set = function (U) {
                                    Fi.setUA(U);
                                    var q = Fi.getResult();
                                    for (var x in q) Hn.ua[x] = q[x];
                                });
                        }
                    })(typeof window == "object" ? window : wE);
                })(mr, mr.exports)),
            mr.exports
        );
    }
    var IE = TE();
    const AE = vE(IE),
        RE = ["chrome122", "safari16", "edge132", "firefox135", "ios16"],
        CE = /([a-zA-Z]+)(\d+)/,
        kE = RE.reduce((e, t) => {
            const n = t.match(CE);
            return n && (e[n[1]] = +n[2]), e;
        }, {});
    function xE(e) {
        const t = e.toLowerCase();
        if (t === "chrome" || t === "chromium" || t === "chrome webview") return "chrome";
        if (t === "safari") return "safari";
        if (t === "mobile safari") return "ios";
        if (t === "edge") return "edge";
        if (t === "firefox") return "firefox";
    }
    function OE(e) {
        try {
            const n = new AE(e).getBrowser(),
                r = n.version;
            if (!n.name) return !0;
            const i = xE(n.name);
            if (!i) return !0;
            const s = kE[i];
            if (!s || !r) return !0;
            const o = r.split(".")[0];
            if (!o) return !0;
            const a = parseInt(o);
            return isNaN(a) ? !0 : a >= s;
        } catch {
            return !0;
        }
    }
    const mt = Symbol.for("@ts-pattern/matcher"),
        NE = Symbol.for("@ts-pattern/isVariadic"),
        Zu = "@ts-pattern/anonymous-select-key",
        Bs = (e) => !!(e && typeof e == "object"),
        fi = (e) => e && !!e[mt],
        gt = (e, t, n) => {
            if (fi(e)) {
                const r = e[mt](),
                    { matched: i, selections: s } = r.match(t);
                return i && s && Object.keys(s).forEach((o) => n(o, s[o])), i;
            }
            if (Bs(e)) {
                if (!Bs(t)) return !1;
                if (Array.isArray(e)) {
                    if (!Array.isArray(t)) return !1;
                    let r = [],
                        i = [],
                        s = [];
                    for (const o of e.keys()) {
                        const a = e[o];
                        fi(a) && a[NE] ? s.push(a) : s.length ? i.push(a) : r.push(a);
                    }
                    if (s.length) {
                        if (s.length > 1)
                            throw new Error(
                                "Pattern error: Using `...P.array(...)` several times in a single pattern is not allowed."
                            );
                        if (t.length < r.length + i.length) return !1;
                        const o = t.slice(0, r.length),
                            a = i.length === 0 ? [] : t.slice(-i.length),
                            c = t.slice(r.length, i.length === 0 ? 1 / 0 : -i.length);
                        return (
                            r.every((u, f) => gt(u, o[f], n)) &&
                            i.every((u, f) => gt(u, a[f], n)) &&
                            (s.length === 0 || gt(s[0], c, n))
                        );
                    }
                    return e.length === t.length && e.every((o, a) => gt(o, t[a], n));
                }
                return Object.keys(e).every((r) => {
                    const i = e[r];
                    return (r in t || (fi((s = i)) && s[mt]().matcherType === "optional")) && gt(i, t[r], n);
                    var s;
                });
            }
            return Object.is(t, e);
        },
        Nt = (e) => {
            var t, n, r;
            return Bs(e)
                ? fi(e)
                    ? (t = (n = (r = e[mt]()).getSelectionKeys) == null ? void 0 : n.call(r)) != null
                        ? t
                        : []
                    : Array.isArray(e)
                      ? gr(e, Nt)
                      : gr(Object.values(e), Nt)
                : [];
        },
        gr = (e, t) => e.reduce((n, r) => n.concat(t(r)), []);
    function Me(e) {
        return Object.assign(e, {
            optional: () => LE(e),
            and: (t) => te(e, t),
            or: (t) => ME(e, t),
            select: (t) => (t === void 0 ? Qu(e) : Qu(t, e)),
        });
    }
    function LE(e) {
        return Me({
            [mt]: () => ({
                match: (t) => {
                    let n = {};
                    const r = (i, s) => {
                        n[i] = s;
                    };
                    return t === void 0
                        ? (Nt(e).forEach((i) => r(i, void 0)), { matched: !0, selections: n })
                        : { matched: gt(e, t, r), selections: n };
                },
                getSelectionKeys: () => Nt(e),
                matcherType: "optional",
            }),
        });
    }
    function te(...e) {
        return Me({
            [mt]: () => ({
                match: (t) => {
                    let n = {};
                    const r = (i, s) => {
                        n[i] = s;
                    };
                    return { matched: e.every((i) => gt(i, t, r)), selections: n };
                },
                getSelectionKeys: () => gr(e, Nt),
                matcherType: "and",
            }),
        });
    }
    function ME(...e) {
        return Me({
            [mt]: () => ({
                match: (t) => {
                    let n = {};
                    const r = (i, s) => {
                        n[i] = s;
                    };
                    return (
                        gr(e, Nt).forEach((i) => r(i, void 0)), { matched: e.some((i) => gt(i, t, r)), selections: n }
                    );
                },
                getSelectionKeys: () => gr(e, Nt),
                matcherType: "or",
            }),
        });
    }
    function B(e) {
        return { [mt]: () => ({ match: (t) => ({ matched: !!e(t) }) }) };
    }
    function Qu(...e) {
        const t = typeof e[0] == "string" ? e[0] : void 0,
            n = e.length === 2 ? e[1] : typeof e[0] == "string" ? void 0 : e[0];
        return Me({
            [mt]: () => ({
                match: (r) => {
                    let i = { [t ?? Zu]: r };
                    return {
                        matched:
                            n === void 0 ||
                            gt(n, r, (s, o) => {
                                i[s] = o;
                            }),
                        selections: i,
                    };
                },
                getSelectionKeys: () => [t ?? Zu].concat(n === void 0 ? [] : Nt(n)),
            }),
        });
    }
    function Qe(e) {
        return typeof e == "number";
    }
    function Lt(e) {
        return typeof e == "string";
    }
    function Mt(e) {
        return typeof e == "bigint";
    }
    Me(
        B(function (e) {
            return !0;
        })
    );
    const Dt = (e) =>
        Object.assign(Me(e), {
            startsWith: (t) => {
                return Dt(te(e, ((n = t), B((r) => Lt(r) && r.startsWith(n)))));
                var n;
            },
            endsWith: (t) => {
                return Dt(te(e, ((n = t), B((r) => Lt(r) && r.endsWith(n)))));
                var n;
            },
            minLength: (t) => Dt(te(e, ((n) => B((r) => Lt(r) && r.length >= n))(t))),
            length: (t) => Dt(te(e, ((n) => B((r) => Lt(r) && r.length === n))(t))),
            maxLength: (t) => Dt(te(e, ((n) => B((r) => Lt(r) && r.length <= n))(t))),
            includes: (t) => {
                return Dt(te(e, ((n = t), B((r) => Lt(r) && r.includes(n)))));
                var n;
            },
            regex: (t) => {
                return Dt(te(e, ((n = t), B((r) => Lt(r) && !!r.match(n)))));
                var n;
            },
        });
    Dt(B(Lt));
    const et = (e) =>
        Object.assign(Me(e), {
            between: (t, n) => et(te(e, ((r, i) => B((s) => Qe(s) && r <= s && i >= s))(t, n))),
            lt: (t) => et(te(e, ((n) => B((r) => Qe(r) && r < n))(t))),
            gt: (t) => et(te(e, ((n) => B((r) => Qe(r) && r > n))(t))),
            lte: (t) => et(te(e, ((n) => B((r) => Qe(r) && r <= n))(t))),
            gte: (t) => et(te(e, ((n) => B((r) => Qe(r) && r >= n))(t))),
            int: () =>
                et(
                    te(
                        e,
                        B((t) => Qe(t) && Number.isInteger(t))
                    )
                ),
            finite: () =>
                et(
                    te(
                        e,
                        B((t) => Qe(t) && Number.isFinite(t))
                    )
                ),
            positive: () =>
                et(
                    te(
                        e,
                        B((t) => Qe(t) && t > 0)
                    )
                ),
            negative: () =>
                et(
                    te(
                        e,
                        B((t) => Qe(t) && t < 0)
                    )
                ),
        });
    et(B(Qe));
    const Pt = (e) =>
        Object.assign(Me(e), {
            between: (t, n) => Pt(te(e, ((r, i) => B((s) => Mt(s) && r <= s && i >= s))(t, n))),
            lt: (t) => Pt(te(e, ((n) => B((r) => Mt(r) && r < n))(t))),
            gt: (t) => Pt(te(e, ((n) => B((r) => Mt(r) && r > n))(t))),
            lte: (t) => Pt(te(e, ((n) => B((r) => Mt(r) && r <= n))(t))),
            gte: (t) => Pt(te(e, ((n) => B((r) => Mt(r) && r >= n))(t))),
            positive: () =>
                Pt(
                    te(
                        e,
                        B((t) => Mt(t) && t > 0)
                    )
                ),
            negative: () =>
                Pt(
                    te(
                        e,
                        B((t) => Mt(t) && t < 0)
                    )
                ),
        });
    Pt(B(Mt)),
        Me(
            B(function (e) {
                return typeof e == "boolean";
            })
        ),
        Me(
            B(function (e) {
                return typeof e == "symbol";
            })
        ),
        Me(
            B(function (e) {
                return e == null;
            })
        ),
        Me(
            B(function (e) {
                return e != null;
            })
        );
    function DE({ clientToken: e, version: t, env: n, debug: r, sessionSampleRate: i, service: s = "web-nextjs" }) {
        const o = OE(navigator.userAgent);
        vc.init({
            clientToken: e,
            site: "datadoghq.com",
            service: s,
            env: n,
            version: t,
            sessionSampleRate: i,
            forwardErrorsToLogs: !0,
            forwardConsoleLogs: ["warn", "error", "info"],
            silentMultipleInit: r,
            beforeSend: (a) =>
                !o ||
                a.http?.url.includes("reddit.com") ||
                (a.http?.status_code === 0 && (a.status = "warn"),
                a.error?.handling === "unhandled" && a.message?.includes("Script error.") && !a.error?.cause)
                    ? !1
                    : a.status === "error" || a.status === "warn" || a.status === "info",
        });
    }
    DE({
        clientToken: "pub4ecf63e3fd1ad28de1a9027c01181601",
        version: Be,
        env: "production",
        debug: !1,
        sessionSampleRate: 100,
        service: "agent-extension",
    });
    const Y = typeof __SENTRY_DEBUG__ > "u" || __SENTRY_DEBUG__,
        nn = "8.47.0",
        V = globalThis;
    function pi(e, t, n) {
        const r = n || V,
            i = (r.__SENTRY__ = r.__SENTRY__ || {}),
            s = (i[nn] = i[nn] || {});
        return s[e] || (s[e] = t());
    }
    const rn = typeof __SENTRY_DEBUG__ > "u" || __SENTRY_DEBUG__,
        PE = "Sentry Logger ",
        Vs = ["debug", "info", "warn", "error", "log", "assert", "trace"],
        hi = {};
    function sn(e) {
        if (!("console" in V)) return e();
        const t = V.console,
            n = {},
            r = Object.keys(hi);
        r.forEach((i) => {
            const s = hi[i];
            (n[i] = t[i]), (t[i] = s);
        });
        try {
            return e();
        } finally {
            r.forEach((i) => {
                t[i] = n[i];
            });
        }
    }
    function UE() {
        let e = !1;
        const t = {
            enable: () => {
                e = !0;
            },
            disable: () => {
                e = !1;
            },
            isEnabled: () => e,
        };
        return (
            rn
                ? Vs.forEach((n) => {
                      t[n] = (...r) => {
                          e &&
                              sn(() => {
                                  V.console[n](`${PE}[${n}]:`, ...r);
                              });
                      };
                  })
                : Vs.forEach((n) => {
                      t[n] = () => {};
                  }),
            t
        );
    }
    const A = pi("logger", UE),
        el = 50,
        on = "?",
        tl = /\(error: (.*)\)/,
        nl = /captureMessage|captureException/;
    function rl(...e) {
        const t = e.sort((n, r) => n[0] - r[0]).map((n) => n[1]);
        return (n, r = 0, i = 0) => {
            const s = [],
                o = n.split(`
`);
            for (let a = r; a < o.length; a++) {
                const c = o[a];
                if (c.length > 1024) continue;
                const u = tl.test(c) ? c.replace(tl, "$1") : c;
                if (!u.match(/\S*Error: /)) {
                    for (const f of t) {
                        const l = f(u);
                        if (l) {
                            s.push(l);
                            break;
                        }
                    }
                    if (s.length >= el + i) break;
                }
            }
            return $E(s.slice(i));
        };
    }
    function FE(e) {
        return Array.isArray(e) ? rl(...e) : e;
    }
    function $E(e) {
        if (!e.length) return [];
        const t = Array.from(e);
        return (
            /sentryWrapped/.test(mi(t).function || "") && t.pop(),
            t.reverse(),
            nl.test(mi(t).function || "") && (t.pop(), nl.test(mi(t).function || "") && t.pop()),
            t.slice(0, el).map((n) => ({ ...n, filename: n.filename || mi(t).filename, function: n.function || on }))
        );
    }
    function mi(e) {
        return e[e.length - 1] || {};
    }
    const zs = "<anonymous>";
    function Ut(e) {
        try {
            return !e || typeof e != "function" ? zs : e.name || zs;
        } catch {
            return zs;
        }
    }
    function il(e) {
        const t = e.exception;
        if (t) {
            const n = [];
            try {
                return (
                    t.values.forEach((r) => {
                        r.stacktrace.frames && n.push(...r.stacktrace.frames);
                    }),
                    n
                );
            } catch {
                return;
            }
        }
    }
    const gi = {},
        sl = {};
    function an(e, t) {
        (gi[e] = gi[e] || []), gi[e].push(t);
    }
    function cn(e, t) {
        if (!sl[e]) {
            sl[e] = !0;
            try {
                t();
            } catch (n) {
                rn && A.error(`Error while instrumenting ${e}`, n);
            }
        }
    }
    function je(e, t) {
        const n = e && gi[e];
        if (n)
            for (const r of n)
                try {
                    r(t);
                } catch (i) {
                    rn &&
                        A.error(
                            `Error while triggering instrumentation handler.
Type: ${e}
Name: ${Ut(r)}
Error:`,
                            i
                        );
                }
    }
    let Hs = null;
    function BE(e) {
        const t = "error";
        an(t, e), cn(t, VE);
    }
    function VE() {
        (Hs = V.onerror),
            (V.onerror = function (e, t, n, r, i) {
                return (
                    je("error", { column: r, error: i, line: n, msg: e, url: t }), Hs ? Hs.apply(this, arguments) : !1
                );
            }),
            (V.onerror.__SENTRY_INSTRUMENTED__ = !0);
    }
    let Gs = null;
    function zE(e) {
        const t = "unhandledrejection";
        an(t, e), cn(t, HE);
    }
    function HE() {
        (Gs = V.onunhandledrejection),
            (V.onunhandledrejection = function (e) {
                return je("unhandledrejection", e), Gs ? Gs.apply(this, arguments) : !0;
            }),
            (V.onunhandledrejection.__SENTRY_INSTRUMENTED__ = !0);
    }
    function _i() {
        return js(V), V;
    }
    function js(e) {
        const t = (e.__SENTRY__ = e.__SENTRY__ || {});
        return (t.version = t.version || nn), (t[nn] = t[nn] || {});
    }
    const ol = Object.prototype.toString;
    function Ws(e) {
        switch (ol.call(e)) {
            case "[object Error]":
            case "[object Exception]":
            case "[object DOMException]":
            case "[object WebAssembly.Exception]":
                return !0;
            default:
                return un(e, Error);
        }
    }
    function Dn(e, t) {
        return ol.call(e) === `[object ${t}]`;
    }
    function al(e) {
        return Dn(e, "ErrorEvent");
    }
    function cl(e) {
        return Dn(e, "DOMError");
    }
    function GE(e) {
        return Dn(e, "DOMException");
    }
    function _t(e) {
        return Dn(e, "String");
    }
    function Ks(e) {
        return (
            typeof e == "object" && e !== null && "__sentry_template_string__" in e && "__sentry_template_values__" in e
        );
    }
    function qs(e) {
        return e === null || Ks(e) || (typeof e != "object" && typeof e != "function");
    }
    function Pn(e) {
        return Dn(e, "Object");
    }
    function bi(e) {
        return typeof Event < "u" && un(e, Event);
    }
    function jE(e) {
        return typeof Element < "u" && un(e, Element);
    }
    function WE(e) {
        return Dn(e, "RegExp");
    }
    function yi(e) {
        return !!(e && e.then && typeof e.then == "function");
    }
    function KE(e) {
        return Pn(e) && "nativeEvent" in e && "preventDefault" in e && "stopPropagation" in e;
    }
    function un(e, t) {
        try {
            return e instanceof t;
        } catch {
            return !1;
        }
    }
    function ul(e) {
        return !!(typeof e == "object" && e !== null && (e.__isVue || e._isVue));
    }
    const Ys = V,
        qE = 80;
    function ll(e, t = {}) {
        if (!e) return "<unknown>";
        try {
            let n = e;
            const r = 5,
                i = [];
            let s = 0,
                o = 0;
            const a = " > ",
                c = a.length;
            let u;
            const f = Array.isArray(t) ? t : t.keyAttrs,
                l = (!Array.isArray(t) && t.maxStringLength) || qE;
            for (; n && s++ < r && ((u = YE(n, f)), !(u === "html" || (s > 1 && o + i.length * c + u.length >= l))); )
                i.push(u), (o += u.length), (n = n.parentNode);
            return i.reverse().join(a);
        } catch {
            return "<unknown>";
        }
    }
    function YE(e, t) {
        const n = e,
            r = [];
        if (!n || !n.tagName) return "";
        if (Ys.HTMLElement && n instanceof HTMLElement && n.dataset) {
            if (n.dataset.sentryComponent) return n.dataset.sentryComponent;
            if (n.dataset.sentryElement) return n.dataset.sentryElement;
        }
        r.push(n.tagName.toLowerCase());
        const i = t && t.length ? t.filter((o) => n.getAttribute(o)).map((o) => [o, n.getAttribute(o)]) : null;
        if (i && i.length)
            i.forEach((o) => {
                r.push(`[${o[0]}="${o[1]}"]`);
            });
        else {
            n.id && r.push(`#${n.id}`);
            const o = n.className;
            if (o && _t(o)) {
                const a = o.split(/\s+/);
                for (const c of a) r.push(`.${c}`);
            }
        }
        const s = ["aria-label", "type", "name", "title", "alt"];
        for (const o of s) {
            const a = n.getAttribute(o);
            a && r.push(`[${o}="${a}"]`);
        }
        return r.join("");
    }
    function XE() {
        try {
            return Ys.document.location.href;
        } catch {
            return "";
        }
    }
    function JE(e) {
        if (!Ys.HTMLElement) return null;
        let t = e;
        const n = 5;
        for (let r = 0; r < n; r++) {
            if (!t) return null;
            if (t instanceof HTMLElement) {
                if (t.dataset.sentryComponent) return t.dataset.sentryComponent;
                if (t.dataset.sentryElement) return t.dataset.sentryElement;
            }
            t = t.parentNode;
        }
        return null;
    }
    function Un(e, t = 0) {
        return typeof e != "string" || t === 0 || e.length <= t ? e : `${e.slice(0, t)}...`;
    }
    function dl(e, t) {
        if (!Array.isArray(e)) return "";
        const n = [];
        for (let r = 0; r < e.length; r++) {
            const i = e[r];
            try {
                ul(i) ? n.push("[VueViewModel]") : n.push(String(i));
            } catch {
                n.push("[value cannot be serialized]");
            }
        }
        return n.join(t);
    }
    function ZE(e, t, n = !1) {
        return _t(e) ? (WE(t) ? t.test(e) : _t(t) ? (n ? e === t : e.includes(t)) : !1) : !1;
    }
    function Ei(e, t = [], n = !1) {
        return t.some((r) => ZE(e, r, n));
    }
    function ke(e, t, n) {
        if (!(t in e)) return;
        const r = e[t],
            i = n(r);
        typeof i == "function" && fl(i, r);
        try {
            e[t] = i;
        } catch {
            rn && A.log(`Failed to replace method "${t}" in object`, e);
        }
    }
    function ln(e, t, n) {
        try {
            Object.defineProperty(e, t, { value: n, writable: !0, configurable: !0 });
        } catch {
            rn && A.log(`Failed to add non-enumerable property "${t}" to object`, e);
        }
    }
    function fl(e, t) {
        try {
            const n = t.prototype || {};
            (e.prototype = t.prototype = n), ln(e, "__sentry_original__", t);
        } catch {}
    }
    function Xs(e) {
        return e.__sentry_original__;
    }
    function pl(e) {
        if (Ws(e)) return { message: e.message, name: e.name, stack: e.stack, ...ml(e) };
        if (bi(e)) {
            const t = { type: e.type, target: hl(e.target), currentTarget: hl(e.currentTarget), ...ml(e) };
            return typeof CustomEvent < "u" && un(e, CustomEvent) && (t.detail = e.detail), t;
        } else return e;
    }
    function hl(e) {
        try {
            return jE(e) ? ll(e) : Object.prototype.toString.call(e);
        } catch {
            return "<unknown>";
        }
    }
    function ml(e) {
        if (typeof e == "object" && e !== null) {
            const t = {};
            for (const n in e) Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
            return t;
        } else return {};
    }
    function QE(e, t = 40) {
        const n = Object.keys(pl(e));
        n.sort();
        const r = n[0];
        if (!r) return "[object has no keys]";
        if (r.length >= t) return Un(r, t);
        for (let i = n.length; i > 0; i--) {
            const s = n.slice(0, i).join(", ");
            if (!(s.length > t)) return i === n.length ? s : Un(s, t);
        }
        return "";
    }
    function De(e) {
        return Js(e, new Map());
    }
    function Js(e, t) {
        if (eS(e)) {
            const n = t.get(e);
            if (n !== void 0) return n;
            const r = {};
            t.set(e, r);
            for (const i of Object.getOwnPropertyNames(e)) typeof e[i] < "u" && (r[i] = Js(e[i], t));
            return r;
        }
        if (Array.isArray(e)) {
            const n = t.get(e);
            if (n !== void 0) return n;
            const r = [];
            return (
                t.set(e, r),
                e.forEach((i) => {
                    r.push(Js(i, t));
                }),
                r
            );
        }
        return e;
    }
    function eS(e) {
        if (!Pn(e)) return !1;
        try {
            const t = Object.getPrototypeOf(e).constructor.name;
            return !t || t === "Object";
        } catch {
            return !0;
        }
    }
    const gl = 1e3;
    function _r() {
        return Date.now() / gl;
    }
    function tS() {
        const { performance: e } = V;
        if (!e || !e.now) return _r;
        const t = Date.now() - e.now(),
            n = e.timeOrigin == null ? t : e.timeOrigin;
        return () => (n + e.now()) / gl;
    }
    const bt = tS();
    (() => {
        const { performance: e } = V;
        if (!e || !e.now) return;
        const t = 3600 * 1e3,
            n = e.now(),
            r = Date.now(),
            i = e.timeOrigin ? Math.abs(e.timeOrigin + n - r) : t,
            s = i < t,
            o = e.timing && e.timing.navigationStart,
            c = typeof o == "number" ? Math.abs(o + n - r) : t,
            u = c < t;
        return s || u ? (i <= c ? e.timeOrigin : o) : r;
    })();
    function Pe() {
        const e = V,
            t = e.crypto || e.msCrypto;
        let n = () => Math.random() * 16;
        try {
            if (t && t.randomUUID) return t.randomUUID().replace(/-/g, "");
            t &&
                t.getRandomValues &&
                (n = () => {
                    const r = new Uint8Array(1);
                    return t.getRandomValues(r), r[0];
                });
        } catch {}
        return ("10000000100040008000" + 1e11).replace(/[018]/g, (r) => (r ^ ((n() & 15) >> (r / 4))).toString(16));
    }
    function _l(e) {
        return e.exception && e.exception.values ? e.exception.values[0] : void 0;
    }
    function Ft(e) {
        const { message: t, event_id: n } = e;
        if (t) return t;
        const r = _l(e);
        return r
            ? r.type && r.value
                ? `${r.type}: ${r.value}`
                : r.type || r.value || n || "<unknown>"
            : n || "<unknown>";
    }
    function Zs(e, t, n) {
        const r = (e.exception = e.exception || {}),
            i = (r.values = r.values || []),
            s = (i[0] = i[0] || {});
        s.value || (s.value = t || ""), s.type || (s.type = "Error");
    }
    function Fn(e, t) {
        const n = _l(e);
        if (!n) return;
        const r = { type: "generic", handled: !0 },
            i = n.mechanism;
        if (((n.mechanism = { ...r, ...i, ...t }), t && "data" in t)) {
            const s = { ...(i && i.data), ...t.data };
            n.mechanism.data = s;
        }
    }
    function bl(e) {
        if (nS(e)) return !0;
        try {
            ln(e, "__sentry_captured__", !0);
        } catch {}
        return !1;
    }
    function nS(e) {
        try {
            return e.__sentry_captured__;
        } catch {}
    }
    var yt;
    (function (e) {
        e[(e.PENDING = 0)] = "PENDING";
        const n = 1;
        e[(e.RESOLVED = n)] = "RESOLVED";
        const r = 2;
        e[(e.REJECTED = r)] = "REJECTED";
    })(yt || (yt = {}));
    function dn(e) {
        return new Ue((t) => {
            t(e);
        });
    }
    function Si(e) {
        return new Ue((t, n) => {
            n(e);
        });
    }
    class Ue {
        constructor(t) {
            Ue.prototype.__init.call(this),
                Ue.prototype.__init2.call(this),
                Ue.prototype.__init3.call(this),
                Ue.prototype.__init4.call(this),
                (this._state = yt.PENDING),
                (this._handlers = []);
            try {
                t(this._resolve, this._reject);
            } catch (n) {
                this._reject(n);
            }
        }
        then(t, n) {
            return new Ue((r, i) => {
                this._handlers.push([
                    !1,
                    (s) => {
                        if (!t) r(s);
                        else
                            try {
                                r(t(s));
                            } catch (o) {
                                i(o);
                            }
                    },
                    (s) => {
                        if (!n) i(s);
                        else
                            try {
                                r(n(s));
                            } catch (o) {
                                i(o);
                            }
                    },
                ]),
                    this._executeHandlers();
            });
        }
        catch(t) {
            return this.then((n) => n, t);
        }
        finally(t) {
            return new Ue((n, r) => {
                let i, s;
                return this.then(
                    (o) => {
                        (s = !1), (i = o), t && t();
                    },
                    (o) => {
                        (s = !0), (i = o), t && t();
                    }
                ).then(() => {
                    if (s) {
                        r(i);
                        return;
                    }
                    n(i);
                });
            });
        }
        __init() {
            this._resolve = (t) => {
                this._setResult(yt.RESOLVED, t);
            };
        }
        __init2() {
            this._reject = (t) => {
                this._setResult(yt.REJECTED, t);
            };
        }
        __init3() {
            this._setResult = (t, n) => {
                if (this._state === yt.PENDING) {
                    if (yi(n)) {
                        n.then(this._resolve, this._reject);
                        return;
                    }
                    (this._state = t), (this._value = n), this._executeHandlers();
                }
            };
        }
        __init4() {
            this._executeHandlers = () => {
                if (this._state === yt.PENDING) return;
                const t = this._handlers.slice();
                (this._handlers = []),
                    t.forEach((n) => {
                        n[0] ||
                            (this._state === yt.RESOLVED && n[1](this._value),
                            this._state === yt.REJECTED && n[2](this._value),
                            (n[0] = !0));
                    });
            };
        }
    }
    function rS(e) {
        const t = bt(),
            n = {
                sid: Pe(),
                init: !0,
                timestamp: t,
                started: t,
                duration: 0,
                status: "ok",
                errors: 0,
                ignoreDuration: !1,
                toJSON: () => sS(n),
            };
        return e && $n(n, e), n;
    }
    function $n(e, t = {}) {
        if (
            (t.user &&
                (!e.ipAddress && t.user.ip_address && (e.ipAddress = t.user.ip_address),
                !e.did && !t.did && (e.did = t.user.id || t.user.email || t.user.username)),
            (e.timestamp = t.timestamp || bt()),
            t.abnormal_mechanism && (e.abnormal_mechanism = t.abnormal_mechanism),
            t.ignoreDuration && (e.ignoreDuration = t.ignoreDuration),
            t.sid && (e.sid = t.sid.length === 32 ? t.sid : Pe()),
            t.init !== void 0 && (e.init = t.init),
            !e.did && t.did && (e.did = `${t.did}`),
            typeof t.started == "number" && (e.started = t.started),
            e.ignoreDuration)
        )
            e.duration = void 0;
        else if (typeof t.duration == "number") e.duration = t.duration;
        else {
            const n = e.timestamp - e.started;
            e.duration = n >= 0 ? n : 0;
        }
        t.release && (e.release = t.release),
            t.environment && (e.environment = t.environment),
            !e.ipAddress && t.ipAddress && (e.ipAddress = t.ipAddress),
            !e.userAgent && t.userAgent && (e.userAgent = t.userAgent),
            typeof t.errors == "number" && (e.errors = t.errors),
            t.status && (e.status = t.status);
    }
    function iS(e, t) {
        let n = {};
        e.status === "ok" && (n = { status: "exited" }), $n(e, n);
    }
    function sS(e) {
        return De({
            sid: `${e.sid}`,
            init: e.init,
            started: new Date(e.started * 1e3).toISOString(),
            timestamp: new Date(e.timestamp * 1e3).toISOString(),
            status: e.status,
            errors: e.errors,
            did: typeof e.did == "number" || typeof e.did == "string" ? `${e.did}` : void 0,
            duration: e.duration,
            abnormal_mechanism: e.abnormal_mechanism,
            attrs: { release: e.release, environment: e.environment, ip_address: e.ipAddress, user_agent: e.userAgent },
        });
    }
    function yl() {
        return Pe();
    }
    function Qs() {
        return Pe().substring(16);
    }
    function vi(e, t, n = 2) {
        if (!t || typeof t != "object" || n <= 0) return t;
        if (e && t && Object.keys(t).length === 0) return e;
        const r = { ...e };
        for (const i in t) Object.prototype.hasOwnProperty.call(t, i) && (r[i] = vi(r[i], t[i], n - 1));
        return r;
    }
    const eo = "_sentrySpan";
    function El(e, t) {
        t ? ln(e, eo, t) : delete e[eo];
    }
    function Sl(e) {
        return e[eo];
    }
    const oS = 100;
    class to {
        constructor() {
            (this._notifyingListeners = !1),
                (this._scopeListeners = []),
                (this._eventProcessors = []),
                (this._breadcrumbs = []),
                (this._attachments = []),
                (this._user = {}),
                (this._tags = {}),
                (this._extra = {}),
                (this._contexts = {}),
                (this._sdkProcessingMetadata = {}),
                (this._propagationContext = { traceId: yl(), spanId: Qs() });
        }
        clone() {
            const t = new to();
            return (
                (t._breadcrumbs = [...this._breadcrumbs]),
                (t._tags = { ...this._tags }),
                (t._extra = { ...this._extra }),
                (t._contexts = { ...this._contexts }),
                this._contexts.flags && (t._contexts.flags = { values: [...this._contexts.flags.values] }),
                (t._user = this._user),
                (t._level = this._level),
                (t._session = this._session),
                (t._transactionName = this._transactionName),
                (t._fingerprint = this._fingerprint),
                (t._eventProcessors = [...this._eventProcessors]),
                (t._requestSession = this._requestSession),
                (t._attachments = [...this._attachments]),
                (t._sdkProcessingMetadata = { ...this._sdkProcessingMetadata }),
                (t._propagationContext = { ...this._propagationContext }),
                (t._client = this._client),
                (t._lastEventId = this._lastEventId),
                El(t, Sl(this)),
                t
            );
        }
        setClient(t) {
            this._client = t;
        }
        setLastEventId(t) {
            this._lastEventId = t;
        }
        getClient() {
            return this._client;
        }
        lastEventId() {
            return this._lastEventId;
        }
        addScopeListener(t) {
            this._scopeListeners.push(t);
        }
        addEventProcessor(t) {
            return this._eventProcessors.push(t), this;
        }
        setUser(t) {
            return (
                (this._user = t || { email: void 0, id: void 0, ip_address: void 0, username: void 0 }),
                this._session && $n(this._session, { user: t }),
                this._notifyScopeListeners(),
                this
            );
        }
        getUser() {
            return this._user;
        }
        getRequestSession() {
            return this._requestSession;
        }
        setRequestSession(t) {
            return (this._requestSession = t), this;
        }
        setTags(t) {
            return (this._tags = { ...this._tags, ...t }), this._notifyScopeListeners(), this;
        }
        setTag(t, n) {
            return (this._tags = { ...this._tags, [t]: n }), this._notifyScopeListeners(), this;
        }
        setExtras(t) {
            return (this._extra = { ...this._extra, ...t }), this._notifyScopeListeners(), this;
        }
        setExtra(t, n) {
            return (this._extra = { ...this._extra, [t]: n }), this._notifyScopeListeners(), this;
        }
        setFingerprint(t) {
            return (this._fingerprint = t), this._notifyScopeListeners(), this;
        }
        setLevel(t) {
            return (this._level = t), this._notifyScopeListeners(), this;
        }
        setTransactionName(t) {
            return (this._transactionName = t), this._notifyScopeListeners(), this;
        }
        setContext(t, n) {
            return n === null ? delete this._contexts[t] : (this._contexts[t] = n), this._notifyScopeListeners(), this;
        }
        setSession(t) {
            return t ? (this._session = t) : delete this._session, this._notifyScopeListeners(), this;
        }
        getSession() {
            return this._session;
        }
        update(t) {
            if (!t) return this;
            const n = typeof t == "function" ? t(this) : t,
                [r, i] =
                    n instanceof fn ? [n.getScopeData(), n.getRequestSession()] : Pn(n) ? [t, t.requestSession] : [],
                {
                    tags: s,
                    extra: o,
                    user: a,
                    contexts: c,
                    level: u,
                    fingerprint: f = [],
                    propagationContext: l,
                } = r || {};
            return (
                (this._tags = { ...this._tags, ...s }),
                (this._extra = { ...this._extra, ...o }),
                (this._contexts = { ...this._contexts, ...c }),
                a && Object.keys(a).length && (this._user = a),
                u && (this._level = u),
                f.length && (this._fingerprint = f),
                l && (this._propagationContext = l),
                i && (this._requestSession = i),
                this
            );
        }
        clear() {
            return (
                (this._breadcrumbs = []),
                (this._tags = {}),
                (this._extra = {}),
                (this._user = {}),
                (this._contexts = {}),
                (this._level = void 0),
                (this._transactionName = void 0),
                (this._fingerprint = void 0),
                (this._requestSession = void 0),
                (this._session = void 0),
                El(this, void 0),
                (this._attachments = []),
                this.setPropagationContext({ traceId: yl() }),
                this._notifyScopeListeners(),
                this
            );
        }
        addBreadcrumb(t, n) {
            const r = typeof n == "number" ? n : oS;
            if (r <= 0) return this;
            const i = { timestamp: _r(), ...t },
                s = this._breadcrumbs;
            return s.push(i), (this._breadcrumbs = s.length > r ? s.slice(-r) : s), this._notifyScopeListeners(), this;
        }
        getLastBreadcrumb() {
            return this._breadcrumbs[this._breadcrumbs.length - 1];
        }
        clearBreadcrumbs() {
            return (this._breadcrumbs = []), this._notifyScopeListeners(), this;
        }
        addAttachment(t) {
            return this._attachments.push(t), this;
        }
        clearAttachments() {
            return (this._attachments = []), this;
        }
        getScopeData() {
            return {
                breadcrumbs: this._breadcrumbs,
                attachments: this._attachments,
                contexts: this._contexts,
                tags: this._tags,
                extra: this._extra,
                user: this._user,
                level: this._level,
                fingerprint: this._fingerprint || [],
                eventProcessors: this._eventProcessors,
                propagationContext: this._propagationContext,
                sdkProcessingMetadata: this._sdkProcessingMetadata,
                transactionName: this._transactionName,
                span: Sl(this),
            };
        }
        setSDKProcessingMetadata(t) {
            return (this._sdkProcessingMetadata = vi(this._sdkProcessingMetadata, t, 2)), this;
        }
        setPropagationContext(t) {
            return (this._propagationContext = { spanId: Qs(), ...t }), this;
        }
        getPropagationContext() {
            return this._propagationContext;
        }
        captureException(t, n) {
            const r = n && n.event_id ? n.event_id : Pe();
            if (!this._client) return A.warn("No client configured on scope - will not capture exception!"), r;
            const i = new Error("Sentry syntheticException");
            return (
                this._client.captureException(
                    t,
                    { originalException: t, syntheticException: i, ...n, event_id: r },
                    this
                ),
                r
            );
        }
        captureMessage(t, n, r) {
            const i = r && r.event_id ? r.event_id : Pe();
            if (!this._client) return A.warn("No client configured on scope - will not capture message!"), i;
            const s = new Error(t);
            return (
                this._client.captureMessage(
                    t,
                    n,
                    { originalException: t, syntheticException: s, ...r, event_id: i },
                    this
                ),
                i
            );
        }
        captureEvent(t, n) {
            const r = n && n.event_id ? n.event_id : Pe();
            return this._client
                ? (this._client.captureEvent(t, { ...n, event_id: r }, this), r)
                : (A.warn("No client configured on scope - will not capture event!"), r);
        }
        _notifyScopeListeners() {
            this._notifyingListeners ||
                ((this._notifyingListeners = !0),
                this._scopeListeners.forEach((t) => {
                    t(this);
                }),
                (this._notifyingListeners = !1));
        }
    }
    const fn = to;
    function aS() {
        return pi("defaultCurrentScope", () => new fn());
    }
    function cS() {
        return pi("defaultIsolationScope", () => new fn());
    }
    class uS {
        constructor(t, n) {
            let r;
            t ? (r = t) : (r = new fn());
            let i;
            n ? (i = n) : (i = new fn()), (this._stack = [{ scope: r }]), (this._isolationScope = i);
        }
        withScope(t) {
            const n = this._pushScope();
            let r;
            try {
                r = t(n);
            } catch (i) {
                throw (this._popScope(), i);
            }
            return yi(r)
                ? r.then(
                      (i) => (this._popScope(), i),
                      (i) => {
                          throw (this._popScope(), i);
                      }
                  )
                : (this._popScope(), r);
        }
        getClient() {
            return this.getStackTop().client;
        }
        getScope() {
            return this.getStackTop().scope;
        }
        getIsolationScope() {
            return this._isolationScope;
        }
        getStackTop() {
            return this._stack[this._stack.length - 1];
        }
        _pushScope() {
            const t = this.getScope().clone();
            return this._stack.push({ client: this.getClient(), scope: t }), t;
        }
        _popScope() {
            return this._stack.length <= 1 ? !1 : !!this._stack.pop();
        }
    }
    function Bn() {
        const e = _i(),
            t = js(e);
        return (t.stack = t.stack || new uS(aS(), cS()));
    }
    function lS(e) {
        return Bn().withScope(e);
    }
    function dS(e, t) {
        const n = Bn();
        return n.withScope(() => ((n.getStackTop().scope = e), t(e)));
    }
    function vl(e) {
        return Bn().withScope(() => e(Bn().getIsolationScope()));
    }
    function fS() {
        return {
            withIsolationScope: vl,
            withScope: lS,
            withSetScope: dS,
            withSetIsolationScope: (e, t) => vl(t),
            getCurrentScope: () => Bn().getScope(),
            getIsolationScope: () => Bn().getIsolationScope(),
        };
    }
    function no(e) {
        const t = js(e);
        return t.acs ? t.acs : fS();
    }
    function Et() {
        const e = _i();
        return no(e).getCurrentScope();
    }
    function br() {
        const e = _i();
        return no(e).getIsolationScope();
    }
    function pS() {
        return pi("globalScope", () => new fn());
    }
    function hS(...e) {
        const t = _i(),
            n = no(t);
        if (e.length === 2) {
            const [r, i] = e;
            return r ? n.withSetScope(r, i) : n.withScope(i);
        }
        return n.withScope(e[0]);
    }
    function fe() {
        return Et().getClient();
    }
    function mS(e) {
        const t = e.getPropagationContext(),
            { traceId: n, spanId: r, parentSpanId: i } = t;
        return De({ trace_id: n, span_id: r, parent_span_id: i });
    }
    const gS = "_sentryMetrics";
    function _S(e) {
        const t = e[gS];
        if (!t) return;
        const n = {};
        for (const [, [r, i]] of t) (n[r] || (n[r] = [])).push(De(i));
        return n;
    }
    const bS = "sentry.source",
        yS = "sentry.sample_rate",
        ES = "sentry.op",
        SS = "sentry.origin",
        vS = 0,
        wS = 1,
        TS = "sentry-",
        IS = /^sentry-/;
    function AS(e) {
        const t = RS(e);
        if (!t) return;
        const n = Object.entries(t).reduce((r, [i, s]) => {
            if (i.match(IS)) {
                const o = i.slice(TS.length);
                r[o] = s;
            }
            return r;
        }, {});
        if (Object.keys(n).length > 0) return n;
    }
    function RS(e) {
        if (!(!e || (!_t(e) && !Array.isArray(e))))
            return Array.isArray(e)
                ? e.reduce((t, n) => {
                      const r = wl(n);
                      return (
                          Object.entries(r).forEach(([i, s]) => {
                              t[i] = s;
                          }),
                          t
                      );
                  }, {})
                : wl(e);
    }
    function wl(e) {
        return e
            .split(",")
            .map((t) => t.split("=").map((n) => decodeURIComponent(n.trim())))
            .reduce((t, [n, r]) => (n && r && (t[n] = r), t), {});
    }
    const CS = 1;
    let Tl = !1;
    function kS(e) {
        const { spanId: t, traceId: n, isRemote: r } = e.spanContext(),
            i = r ? t : ro(e).parent_span_id,
            s = r ? Qs() : t;
        return De({ parent_span_id: i, span_id: s, trace_id: n });
    }
    function Il(e) {
        return typeof e == "number"
            ? Al(e)
            : Array.isArray(e)
              ? e[0] + e[1] / 1e9
              : e instanceof Date
                ? Al(e.getTime())
                : bt();
    }
    function Al(e) {
        return e > 9999999999 ? e / 1e3 : e;
    }
    function ro(e) {
        if (OS(e)) return e.getSpanJSON();
        try {
            const { spanId: t, traceId: n } = e.spanContext();
            if (xS(e)) {
                const { attributes: r, startTime: i, name: s, endTime: o, parentSpanId: a, status: c } = e;
                return De({
                    span_id: t,
                    trace_id: n,
                    data: r,
                    description: s,
                    parent_span_id: a,
                    start_timestamp: Il(i),
                    timestamp: Il(o) || void 0,
                    status: LS(c),
                    op: r[ES],
                    origin: r[SS],
                    _metrics_summary: _S(e),
                });
            }
            return { span_id: t, trace_id: n };
        } catch {
            return {};
        }
    }
    function xS(e) {
        const t = e;
        return !!t.attributes && !!t.startTime && !!t.name && !!t.endTime && !!t.status;
    }
    function OS(e) {
        return typeof e.getSpanJSON == "function";
    }
    function NS(e) {
        const { traceFlags: t } = e.spanContext();
        return t === CS;
    }
    function LS(e) {
        if (!(!e || e.code === vS)) return e.code === wS ? "ok" : e.message || "unknown_error";
    }
    const MS = "_sentryRootSpan";
    function Rl(e) {
        return e[MS] || e;
    }
    function DS() {
        Tl ||
            (sn(() => {
                console.warn(
                    "[Sentry] Deprecation warning: Returning null from `beforeSendSpan` will be disallowed from SDK version 9.0.0 onwards. The callback will only support mutating spans. To drop certain spans, configure the respective integrations directly."
                );
            }),
            (Tl = !0));
    }
    function PS(e) {
        if (typeof __SENTRY_TRACING__ == "boolean" && !__SENTRY_TRACING__) return !1;
        const t = fe(),
            n = t && t.getOptions();
        return !!n && (n.enableTracing || "tracesSampleRate" in n || "tracesSampler" in n);
    }
    const io = "production",
        US = "_frozenDsc";
    function Cl(e, t) {
        const n = t.getOptions(),
            { publicKey: r } = t.getDsn() || {},
            i = De({ environment: n.environment || io, release: n.release, public_key: r, trace_id: e });
        return t.emit("createDsc", i), i;
    }
    function FS(e, t) {
        const n = t.getPropagationContext();
        return n.dsc || Cl(n.traceId, e);
    }
    function $S(e) {
        const t = fe();
        if (!t) return {};
        const n = Rl(e),
            r = n[US];
        if (r) return r;
        const i = n.spanContext().traceState,
            s = i && i.get("sentry.dsc"),
            o = s && AS(s);
        if (o) return o;
        const a = Cl(e.spanContext().traceId, t),
            c = ro(n),
            u = c.data || {},
            f = u[yS];
        f != null && (a.sample_rate = `${f}`);
        const l = u[bS],
            d = c.description;
        return (
            l !== "url" && d && (a.transaction = d), PS() && (a.sampled = String(NS(n))), t.emit("createDsc", a, n), a
        );
    }
    function BS(e) {
        if (typeof e == "boolean") return Number(e);
        const t = typeof e == "string" ? parseFloat(e) : e;
        if (typeof t != "number" || isNaN(t) || t < 0 || t > 1) {
            Y &&
                A.warn(
                    `[Tracing] Given sample rate is invalid. Sample rate must be a boolean or a number between 0 and 1. Got ${JSON.stringify(e)} of type ${JSON.stringify(typeof e)}.`
                );
            return;
        }
        return t;
    }
    const VS = /^(?:(\w+):)\/\/(?:(\w+)(?::(\w+)?)?@)([\w.-]+)(?::(\d+))?\/(.+)/;
    function zS(e) {
        return e === "http" || e === "https";
    }
    function wi(e, t = !1) {
        const { host: n, path: r, pass: i, port: s, projectId: o, protocol: a, publicKey: c } = e;
        return `${a}://${c}${t && i ? `:${i}` : ""}@${n}${s ? `:${s}` : ""}/${r && `${r}/`}${o}`;
    }
    function HS(e) {
        const t = VS.exec(e);
        if (!t) {
            sn(() => {
                console.error(`Invalid Sentry Dsn: ${e}`);
            });
            return;
        }
        const [n, r, i = "", s = "", o = "", a = ""] = t.slice(1);
        let c = "",
            u = a;
        const f = u.split("/");
        if ((f.length > 1 && ((c = f.slice(0, -1).join("/")), (u = f.pop())), u)) {
            const l = u.match(/^\d+/);
            l && (u = l[0]);
        }
        return kl({ host: s, pass: i, path: c, projectId: u, port: o, protocol: n, publicKey: r });
    }
    function kl(e) {
        return {
            protocol: e.protocol,
            publicKey: e.publicKey || "",
            pass: e.pass || "",
            host: e.host,
            port: e.port || "",
            path: e.path || "",
            projectId: e.projectId,
        };
    }
    function GS(e) {
        if (!rn) return !0;
        const { port: t, projectId: n, protocol: r } = e;
        return ["protocol", "publicKey", "host", "projectId"].find((o) =>
            e[o] ? !1 : (A.error(`Invalid Sentry Dsn: ${o} missing`), !0)
        )
            ? !1
            : n.match(/^\d+$/)
              ? zS(r)
                  ? t && isNaN(parseInt(t, 10))
                      ? (A.error(`Invalid Sentry Dsn: Invalid port ${t}`), !1)
                      : !0
                  : (A.error(`Invalid Sentry Dsn: Invalid protocol ${r}`), !1)
              : (A.error(`Invalid Sentry Dsn: Invalid projectId ${n}`), !1);
    }
    function jS(e) {
        const t = typeof e == "string" ? HS(e) : kl(e);
        if (!(!t || !GS(t))) return t;
    }
    function WS() {
        const e = typeof WeakSet == "function",
            t = e ? new WeakSet() : [];
        function n(i) {
            if (e) return t.has(i) ? !0 : (t.add(i), !1);
            for (let s = 0; s < t.length; s++) if (t[s] === i) return !0;
            return t.push(i), !1;
        }
        function r(i) {
            if (e) t.delete(i);
            else
                for (let s = 0; s < t.length; s++)
                    if (t[s] === i) {
                        t.splice(s, 1);
                        break;
                    }
        }
        return [n, r];
    }
    function St(e, t = 100, n = 1 / 0) {
        try {
            return so("", e, t, n);
        } catch (r) {
            return { ERROR: `**non-serializable** (${r})` };
        }
    }
    function xl(e, t = 3, n = 100 * 1024) {
        const r = St(e, t);
        return XS(r) > n ? xl(e, t - 1, n) : r;
    }
    function so(e, t, n = 1 / 0, r = 1 / 0, i = WS()) {
        const [s, o] = i;
        if (t == null || ["boolean", "string"].includes(typeof t) || (typeof t == "number" && Number.isFinite(t)))
            return t;
        const a = KS(e, t);
        if (!a.startsWith("[object ")) return a;
        if (t.__sentry_skip_normalization__) return t;
        const c =
            typeof t.__sentry_override_normalization_depth__ == "number"
                ? t.__sentry_override_normalization_depth__
                : n;
        if (c === 0) return a.replace("object ", "");
        if (s(t)) return "[Circular ~]";
        const u = t;
        if (u && typeof u.toJSON == "function")
            try {
                const p = u.toJSON();
                return so("", p, c - 1, r, i);
            } catch {}
        const f = Array.isArray(t) ? [] : {};
        let l = 0;
        const d = pl(t);
        for (const p in d) {
            if (!Object.prototype.hasOwnProperty.call(d, p)) continue;
            if (l >= r) {
                f[p] = "[MaxProperties ~]";
                break;
            }
            const h = d[p];
            (f[p] = so(p, h, c - 1, r, i)), l++;
        }
        return o(t), f;
    }
    function KS(e, t) {
        try {
            if (e === "domain" && t && typeof t == "object" && t._events) return "[Domain]";
            if (e === "domainEmitter") return "[DomainEmitter]";
            if (typeof global < "u" && t === global) return "[Global]";
            if (typeof window < "u" && t === window) return "[Window]";
            if (typeof document < "u" && t === document) return "[Document]";
            if (ul(t)) return "[VueViewModel]";
            if (KE(t)) return "[SyntheticEvent]";
            if (typeof t == "number" && !Number.isFinite(t)) return `[${t}]`;
            if (typeof t == "function") return `[Function: ${Ut(t)}]`;
            if (typeof t == "symbol") return `[${String(t)}]`;
            if (typeof t == "bigint") return `[BigInt: ${String(t)}]`;
            const n = qS(t);
            return /^HTML(\w*)Element$/.test(n) ? `[HTMLElement: ${n}]` : `[object ${n}]`;
        } catch (n) {
            return `**non-serializable** (${n})`;
        }
    }
    function qS(e) {
        const t = Object.getPrototypeOf(e);
        return t ? t.constructor.name : "null prototype";
    }
    function YS(e) {
        return ~-encodeURI(e).split(/%..|./).length;
    }
    function XS(e) {
        return YS(JSON.stringify(e));
    }
    function yr(e, t = []) {
        return [e, t];
    }
    function JS(e, t) {
        const [n, r] = e;
        return [n, [...r, t]];
    }
    function Ol(e, t) {
        const n = e[1];
        for (const r of n) {
            const i = r[0].type;
            if (t(r, i)) return !0;
        }
        return !1;
    }
    function oo(e) {
        return V.__SENTRY__ && V.__SENTRY__.encodePolyfill
            ? V.__SENTRY__.encodePolyfill(e)
            : new TextEncoder().encode(e);
    }
    function ZS(e) {
        const [t, n] = e;
        let r = JSON.stringify(t);
        function i(s) {
            typeof r == "string"
                ? (r = typeof s == "string" ? r + s : [oo(r), s])
                : r.push(typeof s == "string" ? oo(s) : s);
        }
        for (const s of n) {
            const [o, a] = s;
            if (
                (i(`
${JSON.stringify(o)}
`),
                typeof a == "string" || a instanceof Uint8Array)
            )
                i(a);
            else {
                let c;
                try {
                    c = JSON.stringify(a);
                } catch {
                    c = JSON.stringify(St(a));
                }
                i(c);
            }
        }
        return typeof r == "string" ? r : QS(r);
    }
    function QS(e) {
        const t = e.reduce((i, s) => i + s.length, 0),
            n = new Uint8Array(t);
        let r = 0;
        for (const i of e) n.set(i, r), (r += i.length);
        return n;
    }
    function ev(e) {
        const t = typeof e.data == "string" ? oo(e.data) : e.data;
        return [
            De({
                type: "attachment",
                length: t.length,
                filename: e.filename,
                content_type: e.contentType,
                attachment_type: e.attachmentType,
            }),
            t,
        ];
    }
    const tv = {
        session: "session",
        sessions: "session",
        attachment: "attachment",
        transaction: "transaction",
        event: "error",
        client_report: "internal",
        user_report: "default",
        profile: "profile",
        profile_chunk: "profile",
        replay_event: "replay",
        replay_recording: "replay",
        check_in: "monitor",
        feedback: "feedback",
        span: "span",
        statsd: "metric_bucket",
        raw_security: "security",
    };
    function Nl(e) {
        return tv[e];
    }
    function Ll(e) {
        if (!e || !e.sdk) return;
        const { name: t, version: n } = e.sdk;
        return { name: t, version: n };
    }
    function nv(e, t, n, r) {
        const i = e.sdkProcessingMetadata && e.sdkProcessingMetadata.dynamicSamplingContext;
        return {
            event_id: e.event_id,
            sent_at: new Date().toISOString(),
            ...(t && { sdk: t }),
            ...(!!n && r && { dsn: wi(r) }),
            ...(i && { trace: De({ ...i }) }),
        };
    }
    function rv(e, t) {
        return (
            t &&
                ((e.sdk = e.sdk || {}),
                (e.sdk.name = e.sdk.name || t.name),
                (e.sdk.version = e.sdk.version || t.version),
                (e.sdk.integrations = [...(e.sdk.integrations || []), ...(t.integrations || [])]),
                (e.sdk.packages = [...(e.sdk.packages || []), ...(t.packages || [])])),
            e
        );
    }
    function iv(e, t, n, r) {
        const i = Ll(n),
            s = { sent_at: new Date().toISOString(), ...(i && { sdk: i }), ...(!!r && t && { dsn: wi(t) }) },
            o = "aggregates" in e ? [{ type: "sessions" }, e] : [{ type: "session" }, e.toJSON()];
        return yr(s, [o]);
    }
    function sv(e, t, n, r) {
        const i = Ll(n),
            s = e.type && e.type !== "replay_event" ? e.type : "event";
        rv(e, n && n.sdk);
        const o = nv(e, i, r, t);
        return delete e.sdkProcessingMetadata, yr(o, [[{ type: s }, e]]);
    }
    function ao(e, t, n, r = 0) {
        return new Ue((i, s) => {
            const o = e[r];
            if (t === null || typeof o != "function") i(t);
            else {
                const a = o({ ...t }, n);
                Y && o.id && a === null && A.log(`Event processor "${o.id}" dropped event`),
                    yi(a)
                        ? a.then((c) => ao(e, c, n, r + 1).then(i)).then(null, s)
                        : ao(e, a, n, r + 1)
                              .then(i)
                              .then(null, s);
            }
        });
    }
    let Ti, Ml, Ii;
    function ov(e) {
        const t = V._sentryDebugIds;
        if (!t) return {};
        const n = Object.keys(t);
        return (
            (Ii && n.length === Ml) ||
                ((Ml = n.length),
                (Ii = n.reduce((r, i) => {
                    Ti || (Ti = {});
                    const s = Ti[i];
                    if (s) r[s[0]] = s[1];
                    else {
                        const o = e(i);
                        for (let a = o.length - 1; a >= 0; a--) {
                            const c = o[a],
                                u = c && c.filename,
                                f = t[i];
                            if (u && f) {
                                (r[u] = f), (Ti[i] = [u, f]);
                                break;
                            }
                        }
                    }
                    return r;
                }, {}))),
            Ii
        );
    }
    function av(e, t) {
        const { fingerprint: n, span: r, breadcrumbs: i, sdkProcessingMetadata: s } = t;
        cv(e, t), r && dv(e, r), fv(e, n), uv(e, i), lv(e, s);
    }
    function Dl(e, t) {
        const {
            extra: n,
            tags: r,
            user: i,
            contexts: s,
            level: o,
            sdkProcessingMetadata: a,
            breadcrumbs: c,
            fingerprint: u,
            eventProcessors: f,
            attachments: l,
            propagationContext: d,
            transactionName: p,
            span: h,
        } = t;
        Ai(e, "extra", n),
            Ai(e, "tags", r),
            Ai(e, "user", i),
            Ai(e, "contexts", s),
            (e.sdkProcessingMetadata = vi(e.sdkProcessingMetadata, a, 2)),
            o && (e.level = o),
            p && (e.transactionName = p),
            h && (e.span = h),
            c.length && (e.breadcrumbs = [...e.breadcrumbs, ...c]),
            u.length && (e.fingerprint = [...e.fingerprint, ...u]),
            f.length && (e.eventProcessors = [...e.eventProcessors, ...f]),
            l.length && (e.attachments = [...e.attachments, ...l]),
            (e.propagationContext = { ...e.propagationContext, ...d });
    }
    function Ai(e, t, n) {
        e[t] = vi(e[t], n, 1);
    }
    function cv(e, t) {
        const { extra: n, tags: r, user: i, contexts: s, level: o, transactionName: a } = t,
            c = De(n);
        c && Object.keys(c).length && (e.extra = { ...c, ...e.extra });
        const u = De(r);
        u && Object.keys(u).length && (e.tags = { ...u, ...e.tags });
        const f = De(i);
        f && Object.keys(f).length && (e.user = { ...f, ...e.user });
        const l = De(s);
        l && Object.keys(l).length && (e.contexts = { ...l, ...e.contexts }),
            o && (e.level = o),
            a && e.type !== "transaction" && (e.transaction = a);
    }
    function uv(e, t) {
        const n = [...(e.breadcrumbs || []), ...t];
        e.breadcrumbs = n.length ? n : void 0;
    }
    function lv(e, t) {
        e.sdkProcessingMetadata = { ...e.sdkProcessingMetadata, ...t };
    }
    function dv(e, t) {
        (e.contexts = { trace: kS(t), ...e.contexts }),
            (e.sdkProcessingMetadata = { dynamicSamplingContext: $S(t), ...e.sdkProcessingMetadata });
        const n = Rl(t),
            r = ro(n).description;
        r && !e.transaction && e.type === "transaction" && (e.transaction = r);
    }
    function fv(e, t) {
        (e.fingerprint = e.fingerprint ? (Array.isArray(e.fingerprint) ? e.fingerprint : [e.fingerprint]) : []),
            t && (e.fingerprint = e.fingerprint.concat(t)),
            e.fingerprint && !e.fingerprint.length && delete e.fingerprint;
    }
    function pv(e, t, n, r, i, s) {
        const { normalizeDepth: o = 3, normalizeMaxBreadth: a = 1e3 } = e,
            c = { ...t, event_id: t.event_id || n.event_id || Pe(), timestamp: t.timestamp || _r() },
            u = n.integrations || e.integrations.map((g) => g.name);
        hv(c, e), _v(c, u), i && i.emit("applyFrameMetadata", t), t.type === void 0 && mv(c, e.stackParser);
        const f = yv(r, n.captureContext);
        n.mechanism && Fn(c, n.mechanism);
        const l = i ? i.getEventProcessors() : [],
            d = pS().getScopeData();
        if (s) {
            const g = s.getScopeData();
            Dl(d, g);
        }
        if (f) {
            const g = f.getScopeData();
            Dl(d, g);
        }
        const p = [...(n.attachments || []), ...d.attachments];
        p.length && (n.attachments = p), av(c, d);
        const h = [...l, ...d.eventProcessors];
        return ao(h, c, n).then((g) => (g && gv(g), typeof o == "number" && o > 0 ? bv(g, o, a) : g));
    }
    function hv(e, t) {
        const { environment: n, release: r, dist: i, maxValueLength: s = 250 } = t;
        (e.environment = e.environment || n || io),
            !e.release && r && (e.release = r),
            !e.dist && i && (e.dist = i),
            e.message && (e.message = Un(e.message, s));
        const o = e.exception && e.exception.values && e.exception.values[0];
        o && o.value && (o.value = Un(o.value, s));
        const a = e.request;
        a && a.url && (a.url = Un(a.url, s));
    }
    function mv(e, t) {
        const n = ov(t);
        try {
            e.exception.values.forEach((r) => {
                r.stacktrace.frames.forEach((i) => {
                    n && i.filename && (i.debug_id = n[i.filename]);
                });
            });
        } catch {}
    }
    function gv(e) {
        const t = {};
        try {
            e.exception.values.forEach((r) => {
                r.stacktrace.frames.forEach((i) => {
                    i.debug_id &&
                        (i.abs_path ? (t[i.abs_path] = i.debug_id) : i.filename && (t[i.filename] = i.debug_id),
                        delete i.debug_id);
                });
            });
        } catch {}
        if (Object.keys(t).length === 0) return;
        (e.debug_meta = e.debug_meta || {}), (e.debug_meta.images = e.debug_meta.images || []);
        const n = e.debug_meta.images;
        Object.entries(t).forEach(([r, i]) => {
            n.push({ type: "sourcemap", code_file: r, debug_id: i });
        });
    }
    function _v(e, t) {
        t.length > 0 && ((e.sdk = e.sdk || {}), (e.sdk.integrations = [...(e.sdk.integrations || []), ...t]));
    }
    function bv(e, t, n) {
        if (!e) return null;
        const r = {
            ...e,
            ...(e.breadcrumbs && {
                breadcrumbs: e.breadcrumbs.map((i) => ({ ...i, ...(i.data && { data: St(i.data, t, n) }) })),
            }),
            ...(e.user && { user: St(e.user, t, n) }),
            ...(e.contexts && { contexts: St(e.contexts, t, n) }),
            ...(e.extra && { extra: St(e.extra, t, n) }),
        };
        return (
            e.contexts &&
                e.contexts.trace &&
                r.contexts &&
                ((r.contexts.trace = e.contexts.trace),
                e.contexts.trace.data && (r.contexts.trace.data = St(e.contexts.trace.data, t, n))),
            e.spans && (r.spans = e.spans.map((i) => ({ ...i, ...(i.data && { data: St(i.data, t, n) }) }))),
            e.contexts && e.contexts.flags && r.contexts && (r.contexts.flags = St(e.contexts.flags, 3, n)),
            r
        );
    }
    function yv(e, t) {
        if (!t) return e;
        const n = e ? e.clone() : new fn();
        return n.update(t), n;
    }
    function KI(e) {}
    function Ev(e, t) {
        return Et().captureException(e, void 0);
    }
    function Pl(e, t) {
        return Et().captureEvent(e, t);
    }
    function Ul(e) {
        const t = fe(),
            n = br(),
            r = Et(),
            { release: i, environment: s = io } = (t && t.getOptions()) || {},
            { userAgent: o } = V.navigator || {},
            a = rS({ release: i, environment: s, user: r.getUser() || n.getUser(), ...(o && { userAgent: o }), ...e }),
            c = n.getSession();
        return c && c.status === "ok" && $n(c, { status: "exited" }), Fl(), n.setSession(a), r.setSession(a), a;
    }
    function Fl() {
        const e = br(),
            t = Et(),
            n = t.getSession() || e.getSession();
        n && iS(n), $l(), e.setSession(), t.setSession();
    }
    function $l() {
        const e = br(),
            t = Et(),
            n = fe(),
            r = t.getSession() || e.getSession();
        r && n && n.captureSession(r);
    }
    function Bl(e = !1) {
        if (e) {
            Fl();
            return;
        }
        $l();
    }
    const Sv = "7";
    function vv(e) {
        const t = e.protocol ? `${e.protocol}:` : "",
            n = e.port ? `:${e.port}` : "";
        return `${t}//${e.host}${n}${e.path ? `/${e.path}` : ""}/api/`;
    }
    function wv(e) {
        return `${vv(e)}${e.projectId}/envelope/`;
    }
    function Tv(e, t) {
        const n = { sentry_version: Sv };
        return (
            e.publicKey && (n.sentry_key = e.publicKey),
            t && (n.sentry_client = `${t.name}/${t.version}`),
            new URLSearchParams(n).toString()
        );
    }
    function Iv(e, t, n) {
        return t || `${wv(e)}?${Tv(e, n)}`;
    }
    const Vl = [];
    function Av(e) {
        const t = {};
        return (
            e.forEach((n) => {
                const { name: r } = n,
                    i = t[r];
                (i && !i.isDefaultInstance && n.isDefaultInstance) || (t[r] = n);
            }),
            Object.values(t)
        );
    }
    function Rv(e) {
        const t = e.defaultIntegrations || [],
            n = e.integrations;
        t.forEach((o) => {
            o.isDefaultInstance = !0;
        });
        let r;
        if (Array.isArray(n)) r = [...t, ...n];
        else if (typeof n == "function") {
            const o = n(t);
            r = Array.isArray(o) ? o : [o];
        } else r = t;
        const i = Av(r),
            s = i.findIndex((o) => o.name === "Debug");
        if (s > -1) {
            const [o] = i.splice(s, 1);
            i.push(o);
        }
        return i;
    }
    function Cv(e, t) {
        const n = {};
        return (
            t.forEach((r) => {
                r && Hl(e, r, n);
            }),
            n
        );
    }
    function zl(e, t) {
        for (const n of t) n && n.afterAllSetup && n.afterAllSetup(e);
    }
    function Hl(e, t, n) {
        if (n[t.name]) {
            Y && A.log(`Integration skipped because it was already installed: ${t.name}`);
            return;
        }
        if (
            ((n[t.name] = t),
            Vl.indexOf(t.name) === -1 && typeof t.setupOnce == "function" && (t.setupOnce(), Vl.push(t.name)),
            t.setup && typeof t.setup == "function" && t.setup(e),
            typeof t.preprocessEvent == "function")
        ) {
            const r = t.preprocessEvent.bind(t);
            e.on("preprocessEvent", (i, s) => r(i, s, e));
        }
        if (typeof t.processEvent == "function") {
            const r = t.processEvent.bind(t),
                i = Object.assign((s, o) => r(s, o, e), { id: t.name });
            e.addEventProcessor(i);
        }
        Y && A.log(`Integration installed: ${t.name}`);
    }
    function qI(e) {
        return e;
    }
    function kv(e, t, n) {
        const r = [{ type: "client_report" }, { timestamp: _r(), discarded_events: e }];
        return yr(t ? { dsn: t } : {}, [r]);
    }
    class tt extends Error {
        constructor(t, n = "warn") {
            super(t),
                (this.message = t),
                (this.name = new.target.prototype.constructor.name),
                Object.setPrototypeOf(this, new.target.prototype),
                (this.logLevel = n);
        }
    }
    const Gl = "Not capturing exception because it's already been captured.";
    class xv {
        constructor(t) {
            if (
                ((this._options = t),
                (this._integrations = {}),
                (this._numProcessing = 0),
                (this._outcomes = {}),
                (this._hooks = {}),
                (this._eventProcessors = []),
                t.dsn ? (this._dsn = jS(t.dsn)) : Y && A.warn("No DSN provided, client will not send events."),
                this._dsn)
            ) {
                const i = Iv(this._dsn, t.tunnel, t._metadata ? t._metadata.sdk : void 0);
                this._transport = t.transport({
                    tunnel: this._options.tunnel,
                    recordDroppedEvent: this.recordDroppedEvent.bind(this),
                    ...t.transportOptions,
                    url: i,
                });
            }
            const r = ["enableTracing", "tracesSampleRate", "tracesSampler"].find((i) => i in t && t[i] == null);
            r &&
                sn(() => {
                    console.warn(
                        `[Sentry] Deprecation warning: \`${r}\` is set to undefined, which leads to tracing being enabled. In v9, a value of \`undefined\` will result in tracing being disabled.`
                    );
                });
        }
        captureException(t, n, r) {
            const i = Pe();
            if (bl(t)) return Y && A.log(Gl), i;
            const s = { event_id: i, ...n };
            return this._process(this.eventFromException(t, s).then((o) => this._captureEvent(o, s, r))), s.event_id;
        }
        captureMessage(t, n, r, i) {
            const s = { event_id: Pe(), ...r },
                o = Ks(t) ? t : String(t),
                a = qs(t) ? this.eventFromMessage(o, n, s) : this.eventFromException(t, s);
            return this._process(a.then((c) => this._captureEvent(c, s, i))), s.event_id;
        }
        captureEvent(t, n, r) {
            const i = Pe();
            if (n && n.originalException && bl(n.originalException)) return Y && A.log(Gl), i;
            const s = { event_id: i, ...n },
                a = (t.sdkProcessingMetadata || {}).capturedSpanScope;
            return this._process(this._captureEvent(t, s, a || r)), s.event_id;
        }
        captureSession(t) {
            typeof t.release != "string"
                ? Y && A.warn("Discarded session because of missing or non-string release")
                : (this.sendSession(t), $n(t, { init: !1 }));
        }
        getDsn() {
            return this._dsn;
        }
        getOptions() {
            return this._options;
        }
        getSdkMetadata() {
            return this._options._metadata;
        }
        getTransport() {
            return this._transport;
        }
        flush(t) {
            const n = this._transport;
            return n
                ? (this.emit("flush"), this._isClientDoneProcessing(t).then((r) => n.flush(t).then((i) => r && i)))
                : dn(!0);
        }
        close(t) {
            return this.flush(t).then((n) => ((this.getOptions().enabled = !1), this.emit("close"), n));
        }
        getEventProcessors() {
            return this._eventProcessors;
        }
        addEventProcessor(t) {
            this._eventProcessors.push(t);
        }
        init() {
            (this._isEnabled() || this._options.integrations.some(({ name: t }) => t.startsWith("Spotlight"))) &&
                this._setupIntegrations();
        }
        getIntegrationByName(t) {
            return this._integrations[t];
        }
        addIntegration(t) {
            const n = this._integrations[t.name];
            Hl(this, t, this._integrations), n || zl(this, [t]);
        }
        sendEvent(t, n = {}) {
            this.emit("beforeSendEvent", t, n);
            let r = sv(t, this._dsn, this._options._metadata, this._options.tunnel);
            for (const s of n.attachments || []) r = JS(r, ev(s));
            const i = this.sendEnvelope(r);
            i && i.then((s) => this.emit("afterSendEvent", t, s), null);
        }
        sendSession(t) {
            const n = iv(t, this._dsn, this._options._metadata, this._options.tunnel);
            this.sendEnvelope(n);
        }
        recordDroppedEvent(t, n, r) {
            if (this._options.sendClientReports) {
                const i = typeof r == "number" ? r : 1,
                    s = `${t}:${n}`;
                Y && A.log(`Recording outcome: "${s}"${i > 1 ? ` (${i} times)` : ""}`),
                    (this._outcomes[s] = (this._outcomes[s] || 0) + i);
            }
        }
        on(t, n) {
            const r = (this._hooks[t] = this._hooks[t] || []);
            return (
                r.push(n),
                () => {
                    const i = r.indexOf(n);
                    i > -1 && r.splice(i, 1);
                }
            );
        }
        emit(t, ...n) {
            const r = this._hooks[t];
            r && r.forEach((i) => i(...n));
        }
        sendEnvelope(t) {
            return (
                this.emit("beforeEnvelope", t),
                this._isEnabled() && this._transport
                    ? this._transport.send(t).then(null, (n) => (Y && A.error("Error while sending envelope:", n), n))
                    : (Y && A.error("Transport disabled"), dn({}))
            );
        }
        _setupIntegrations() {
            const { integrations: t } = this._options;
            (this._integrations = Cv(this, t)), zl(this, t);
        }
        _updateSessionFromEvent(t, n) {
            let r = !1,
                i = !1;
            const s = n.exception && n.exception.values;
            if (s) {
                i = !0;
                for (const c of s) {
                    const u = c.mechanism;
                    if (u && u.handled === !1) {
                        r = !0;
                        break;
                    }
                }
            }
            const o = t.status === "ok";
            ((o && t.errors === 0) || (o && r)) &&
                ($n(t, { ...(r && { status: "crashed" }), errors: t.errors || Number(i || r) }),
                this.captureSession(t));
        }
        _isClientDoneProcessing(t) {
            return new Ue((n) => {
                let r = 0;
                const i = 1,
                    s = setInterval(() => {
                        this._numProcessing == 0
                            ? (clearInterval(s), n(!0))
                            : ((r += i), t && r >= t && (clearInterval(s), n(!1)));
                    }, i);
            });
        }
        _isEnabled() {
            return this.getOptions().enabled !== !1 && this._transport !== void 0;
        }
        _prepareEvent(t, n, r = Et(), i = br()) {
            const s = this.getOptions(),
                o = Object.keys(this._integrations);
            return (
                !n.integrations && o.length > 0 && (n.integrations = o),
                this.emit("preprocessEvent", t, n),
                t.type || i.setLastEventId(t.event_id || n.event_id),
                pv(s, t, n, r, this, i).then((a) => {
                    if (a === null) return a;
                    a.contexts = { trace: mS(r), ...a.contexts };
                    const c = FS(this, r);
                    return (a.sdkProcessingMetadata = { dynamicSamplingContext: c, ...a.sdkProcessingMetadata }), a;
                })
            );
        }
        _captureEvent(t, n = {}, r) {
            return this._processEvent(t, n, r).then(
                (i) => i.event_id,
                (i) => {
                    if (Y) {
                        const s = i;
                        s.logLevel === "log" ? A.log(s.message) : A.warn(s);
                    }
                }
            );
        }
        _processEvent(t, n, r) {
            const i = this.getOptions(),
                { sampleRate: s } = i,
                o = Wl(t),
                a = jl(t),
                c = t.type || "error",
                u = `before send for type \`${c}\``,
                f = typeof s > "u" ? void 0 : BS(s);
            if (a && typeof f == "number" && Math.random() > f)
                return (
                    this.recordDroppedEvent("sample_rate", "error", t),
                    Si(
                        new tt(
                            `Discarding event because it's not included in the random sample (sampling rate = ${s})`,
                            "log"
                        )
                    )
                );
            const l = c === "replay_event" ? "replay" : c,
                p = (t.sdkProcessingMetadata || {}).capturedSpanIsolationScope;
            return this._prepareEvent(t, n, r, p)
                .then((h) => {
                    if (h === null)
                        throw (
                            (this.recordDroppedEvent("event_processor", l, t),
                            new tt("An event processor returned `null`, will not send event.", "log"))
                        );
                    if (n.data && n.data.__sentry__ === !0) return h;
                    const g = Nv(this, i, h, n);
                    return Ov(g, u);
                })
                .then((h) => {
                    if (h === null) {
                        if ((this.recordDroppedEvent("before_send", l, t), o)) {
                            const b = 1 + (t.spans || []).length;
                            this.recordDroppedEvent("before_send", "span", b);
                        }
                        throw new tt(`${u} returned \`null\`, will not send event.`, "log");
                    }
                    const m = r && r.getSession();
                    if ((!o && m && this._updateSessionFromEvent(m, h), o)) {
                        const w = (h.sdkProcessingMetadata && h.sdkProcessingMetadata.spanCountBeforeProcessing) || 0,
                            b = h.spans ? h.spans.length : 0,
                            E = w - b;
                        E > 0 && this.recordDroppedEvent("before_send", "span", E);
                    }
                    const g = h.transaction_info;
                    if (o && g && h.transaction !== t.transaction) {
                        const w = "custom";
                        h.transaction_info = { ...g, source: w };
                    }
                    return this.sendEvent(h, n), h;
                })
                .then(null, (h) => {
                    throw h instanceof tt
                        ? h
                        : (this.captureException(h, { data: { __sentry__: !0 }, originalException: h }),
                          new tt(`Event processing pipeline threw an error, original event will not be sent. Details have been sent as a new event.
Reason: ${h}`));
                });
        }
        _process(t) {
            this._numProcessing++,
                t.then(
                    (n) => (this._numProcessing--, n),
                    (n) => (this._numProcessing--, n)
                );
        }
        _clearOutcomes() {
            const t = this._outcomes;
            return (
                (this._outcomes = {}),
                Object.entries(t).map(([n, r]) => {
                    const [i, s] = n.split(":");
                    return { reason: i, category: s, quantity: r };
                })
            );
        }
        _flushOutcomes() {
            Y && A.log("Flushing outcomes...");
            const t = this._clearOutcomes();
            if (t.length === 0) {
                Y && A.log("No outcomes to send");
                return;
            }
            if (!this._dsn) {
                Y && A.log("No dsn provided, will not send outcomes");
                return;
            }
            Y && A.log("Sending outcomes:", t);
            const n = kv(t, this._options.tunnel && wi(this._dsn));
            this.sendEnvelope(n);
        }
    }
    function Ov(e, t) {
        const n = `${t} must return \`null\` or a valid event.`;
        if (yi(e))
            return e.then(
                (r) => {
                    if (!Pn(r) && r !== null) throw new tt(n);
                    return r;
                },
                (r) => {
                    throw new tt(`${t} rejected with ${r}`);
                }
            );
        if (!Pn(e) && e !== null) throw new tt(n);
        return e;
    }
    function Nv(e, t, n, r) {
        const { beforeSend: i, beforeSendTransaction: s, beforeSendSpan: o } = t;
        if (jl(n) && i) return i(n, r);
        if (Wl(n)) {
            if (n.spans && o) {
                const a = [];
                for (const c of n.spans) {
                    const u = o(c);
                    u ? a.push(u) : (DS(), e.recordDroppedEvent("before_send", "span"));
                }
                n.spans = a;
            }
            if (s) {
                if (n.spans) {
                    const a = n.spans.length;
                    n.sdkProcessingMetadata = { ...n.sdkProcessingMetadata, spanCountBeforeProcessing: a };
                }
                return s(n, r);
            }
        }
        return n;
    }
    function jl(e) {
        return e.type === void 0;
    }
    function Wl(e) {
        return e.type === "transaction";
    }
    function Lv(e, t) {
        t.debug === !0 &&
            (Y
                ? A.enable()
                : sn(() => {
                      console.warn("[Sentry] Cannot initialize SDK with `debug` option using a non-debug bundle.");
                  })),
            Et().update(t.initialScope);
        const r = new e(t);
        return Mv(r), r.init(), r;
    }
    function Mv(e) {
        Et().setClient(e);
    }
    function Dv(e) {
        const t = [];
        function n() {
            return e === void 0 || t.length < e;
        }
        function r(o) {
            return t.splice(t.indexOf(o), 1)[0] || Promise.resolve(void 0);
        }
        function i(o) {
            if (!n()) return Si(new tt("Not adding Promise because buffer limit was reached."));
            const a = o();
            return t.indexOf(a) === -1 && t.push(a), a.then(() => r(a)).then(null, () => r(a).then(null, () => {})), a;
        }
        function s(o) {
            return new Ue((a, c) => {
                let u = t.length;
                if (!u) return a(!0);
                const f = setTimeout(() => {
                    o && o > 0 && a(!1);
                }, o);
                t.forEach((l) => {
                    dn(l).then(() => {
                        --u || (clearTimeout(f), a(!0));
                    }, c);
                });
            });
        }
        return { $: t, add: i, drain: s };
    }
    const Pv = 60 * 1e3;
    function Uv(e, t = Date.now()) {
        const n = parseInt(`${e}`, 10);
        if (!isNaN(n)) return n * 1e3;
        const r = Date.parse(`${e}`);
        return isNaN(r) ? Pv : r - t;
    }
    function Fv(e, t) {
        return e[t] || e.all || 0;
    }
    function $v(e, t, n = Date.now()) {
        return Fv(e, t) > n;
    }
    function Bv(e, { statusCode: t, headers: n }, r = Date.now()) {
        const i = { ...e },
            s = n && n["x-sentry-rate-limits"],
            o = n && n["retry-after"];
        if (s)
            for (const a of s.trim().split(",")) {
                const [c, u, , , f] = a.split(":", 5),
                    l = parseInt(c, 10),
                    d = (isNaN(l) ? 60 : l) * 1e3;
                if (!u) i.all = r + d;
                else
                    for (const p of u.split(";"))
                        p === "metric_bucket"
                            ? (!f || f.split(";").includes("custom")) && (i[p] = r + d)
                            : (i[p] = r + d);
            }
        else o ? (i.all = r + Uv(o, r)) : t === 429 && (i.all = r + 60 * 1e3);
        return i;
    }
    const Vv = 64;
    function zv(e, t, n = Dv(e.bufferSize || Vv)) {
        let r = {};
        const i = (o) => n.drain(o);
        function s(o) {
            const a = [];
            if (
                (Ol(o, (l, d) => {
                    const p = Nl(d);
                    if ($v(r, p)) {
                        const h = Kl(l, d);
                        e.recordDroppedEvent("ratelimit_backoff", p, h);
                    } else a.push(l);
                }),
                a.length === 0)
            )
                return dn({});
            const c = yr(o[0], a),
                u = (l) => {
                    Ol(c, (d, p) => {
                        const h = Kl(d, p);
                        e.recordDroppedEvent(l, Nl(p), h);
                    });
                },
                f = () =>
                    t({ body: ZS(c) }).then(
                        (l) => (
                            l.statusCode !== void 0 &&
                                (l.statusCode < 200 || l.statusCode >= 300) &&
                                Y &&
                                A.warn(`Sentry responded with status code ${l.statusCode} to sent event.`),
                            (r = Bv(r, l)),
                            l
                        ),
                        (l) => {
                            throw (u("network_error"), l);
                        }
                    );
            return n.add(f).then(
                (l) => l,
                (l) => {
                    if (l instanceof tt)
                        return (
                            Y && A.error("Skipped sending event because buffer is full."), u("queue_overflow"), dn({})
                        );
                    throw l;
                }
            );
        }
        return { send: s, flush: i };
    }
    function Kl(e, t) {
        if (!(t !== "event" && t !== "transaction")) return Array.isArray(e) ? e[1] : void 0;
    }
    function Hv(e, t, n = [t], r = "npm") {
        const i = e._metadata || {};
        i.sdk ||
            (i.sdk = {
                name: `sentry.javascript.${t}`,
                packages: n.map((s) => ({ name: `${r}:@sentry/${s}`, version: nn })),
                version: nn,
            }),
            (e._metadata = i);
    }
    const Gv = 100;
    function pn(e, t) {
        const n = fe(),
            r = br();
        if (!n) return;
        const { beforeBreadcrumb: i = null, maxBreadcrumbs: s = Gv } = n.getOptions();
        if (s <= 0) return;
        const a = { timestamp: _r(), ...e },
            c = i ? sn(() => i(a, t)) : a;
        c !== null && (n.emit && n.emit("beforeAddBreadcrumb", c, t), r.addBreadcrumb(c, s));
    }
    let ql;
    const jv = "FunctionToString",
        Yl = new WeakMap(),
        Wv = () => ({
            name: jv,
            setupOnce() {
                ql = Function.prototype.toString;
                try {
                    Function.prototype.toString = function (...e) {
                        const t = Xs(this),
                            n = Yl.has(fe()) && t !== void 0 ? t : this;
                        return ql.apply(n, e);
                    };
                } catch {}
            },
            setup(e) {
                Yl.set(e, !0);
            },
        }),
        Kv = [
            /^Script error\.?$/,
            /^Javascript error: Script error\.? on line 0$/,
            /^ResizeObserver loop completed with undelivered notifications.$/,
            /^Cannot redefine property: googletag$/,
            "undefined is not an object (evaluating 'a.L')",
            `can't redefine non-configurable property "solana"`,
            "vv().getRestrictions is not a function. (In 'vv().getRestrictions(1,a)', 'vv().getRestrictions' is undefined)",
            "Can't find variable: _AutofillCallbackHandler",
            /^Non-Error promise rejection captured with value: Object Not Found Matching Id:\d+, MethodName:simulateEvent, ParamCount:\d+$/,
        ],
        qv = "InboundFilters",
        Yv = (e = {}) => ({
            name: qv,
            processEvent(t, n, r) {
                const i = r.getOptions(),
                    s = Xv(e, i);
                return Jv(t, s) ? null : t;
            },
        });
    function Xv(e = {}, t = {}) {
        return {
            allowUrls: [...(e.allowUrls || []), ...(t.allowUrls || [])],
            denyUrls: [...(e.denyUrls || []), ...(t.denyUrls || [])],
            ignoreErrors: [...(e.ignoreErrors || []), ...(t.ignoreErrors || []), ...(e.disableErrorDefaults ? [] : Kv)],
            ignoreTransactions: [...(e.ignoreTransactions || []), ...(t.ignoreTransactions || [])],
            ignoreInternal: e.ignoreInternal !== void 0 ? e.ignoreInternal : !0,
        };
    }
    function Jv(e, t) {
        return t.ignoreInternal && rw(e)
            ? (Y &&
                  A.warn(`Event dropped due to being internal Sentry Error.
Event: ${Ft(e)}`),
              !0)
            : Zv(e, t.ignoreErrors)
              ? (Y &&
                    A.warn(`Event dropped due to being matched by \`ignoreErrors\` option.
Event: ${Ft(e)}`),
                !0)
              : sw(e)
                ? (Y &&
                      A.warn(`Event dropped due to not having an error message, error type or stacktrace.
Event: ${Ft(e)}`),
                  !0)
                : Qv(e, t.ignoreTransactions)
                  ? (Y &&
                        A.warn(`Event dropped due to being matched by \`ignoreTransactions\` option.
Event: ${Ft(e)}`),
                    !0)
                  : ew(e, t.denyUrls)
                    ? (Y &&
                          A.warn(`Event dropped due to being matched by \`denyUrls\` option.
Event: ${Ft(e)}.
Url: ${Ri(e)}`),
                      !0)
                    : tw(e, t.allowUrls)
                      ? !1
                      : (Y &&
                            A.warn(`Event dropped due to not being matched by \`allowUrls\` option.
Event: ${Ft(e)}.
Url: ${Ri(e)}`),
                        !0);
    }
    function Zv(e, t) {
        return e.type || !t || !t.length ? !1 : nw(e).some((n) => Ei(n, t));
    }
    function Qv(e, t) {
        if (e.type !== "transaction" || !t || !t.length) return !1;
        const n = e.transaction;
        return n ? Ei(n, t) : !1;
    }
    function ew(e, t) {
        if (!t || !t.length) return !1;
        const n = Ri(e);
        return n ? Ei(n, t) : !1;
    }
    function tw(e, t) {
        if (!t || !t.length) return !0;
        const n = Ri(e);
        return n ? Ei(n, t) : !0;
    }
    function nw(e) {
        const t = [];
        e.message && t.push(e.message);
        let n;
        try {
            n = e.exception.values[e.exception.values.length - 1];
        } catch {}
        return n && n.value && (t.push(n.value), n.type && t.push(`${n.type}: ${n.value}`)), t;
    }
    function rw(e) {
        try {
            return e.exception.values[0].type === "SentryError";
        } catch {}
        return !1;
    }
    function iw(e = []) {
        for (let t = e.length - 1; t >= 0; t--) {
            const n = e[t];
            if (n && n.filename !== "<anonymous>" && n.filename !== "[native code]") return n.filename || null;
        }
        return null;
    }
    function Ri(e) {
        try {
            let t;
            try {
                t = e.exception.values[0].stacktrace.frames;
            } catch {}
            return t ? iw(t) : null;
        } catch {
            return Y && A.error(`Cannot extract url for event ${Ft(e)}`), null;
        }
    }
    function sw(e) {
        return e.type || !e.exception || !e.exception.values || e.exception.values.length === 0
            ? !1
            : !e.message && !e.exception.values.some((t) => t.stacktrace || (t.type && t.type !== "Error") || t.value);
    }
    function ow(e, t, n = 250, r, i, s, o) {
        if (!s.exception || !s.exception.values || !o || !un(o.originalException, Error)) return;
        const a = s.exception.values.length > 0 ? s.exception.values[s.exception.values.length - 1] : void 0;
        a && (s.exception.values = aw(co(e, t, i, o.originalException, r, s.exception.values, a, 0), n));
    }
    function co(e, t, n, r, i, s, o, a) {
        if (s.length >= n + 1) return s;
        let c = [...s];
        if (un(r[i], Error)) {
            Xl(o, a);
            const u = e(t, r[i]),
                f = c.length;
            Jl(u, i, f, a), (c = co(e, t, n, r[i], i, [u, ...c], u, f));
        }
        return (
            Array.isArray(r.errors) &&
                r.errors.forEach((u, f) => {
                    if (un(u, Error)) {
                        Xl(o, a);
                        const l = e(t, u),
                            d = c.length;
                        Jl(l, `errors[${f}]`, d, a), (c = co(e, t, n, u, i, [l, ...c], l, d));
                    }
                }),
            c
        );
    }
    function Xl(e, t) {
        (e.mechanism = e.mechanism || { type: "generic", handled: !0 }),
            (e.mechanism = {
                ...e.mechanism,
                ...(e.type === "AggregateError" && { is_exception_group: !0 }),
                exception_id: t,
            });
    }
    function Jl(e, t, n, r) {
        (e.mechanism = e.mechanism || { type: "generic", handled: !0 }),
            (e.mechanism = { ...e.mechanism, type: "chained", source: t, exception_id: n, parent_id: r });
    }
    function aw(e, t) {
        return e.map((n) => (n.value && (n.value = Un(n.value, t)), n));
    }
    function uo(e) {
        if (!e) return {};
        const t = e.match(/^(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/);
        if (!t) return {};
        const n = t[6] || "",
            r = t[8] || "";
        return { host: t[4], path: t[5], protocol: t[2], search: n, hash: r, relative: t[5] + n + r };
    }
    function cw(e) {
        const t = "console";
        an(t, e), cn(t, uw);
    }
    function uw() {
        "console" in V &&
            Vs.forEach(function (e) {
                e in V.console &&
                    ke(V.console, e, function (t) {
                        return (
                            (hi[e] = t),
                            function (...n) {
                                je("console", { args: n, level: e });
                                const i = hi[e];
                                i && i.apply(V.console, n);
                            }
                        );
                    });
            });
    }
    function lw(e) {
        return e === "warn" ? "warning" : ["fatal", "error", "warning", "log", "info", "debug"].includes(e) ? e : "log";
    }
    const dw = "Dedupe",
        fw = () => {
            let e;
            return {
                name: dw,
                processEvent(t) {
                    if (t.type) return t;
                    try {
                        if (pw(t, e))
                            return (
                                Y && A.warn("Event dropped due to being a duplicate of previously captured event."),
                                null
                            );
                    } catch {}
                    return (e = t);
                },
            };
        };
    function pw(e, t) {
        return t ? !!(hw(e, t) || mw(e, t)) : !1;
    }
    function hw(e, t) {
        const n = e.message,
            r = t.message;
        return !((!n && !r) || (n && !r) || (!n && r) || n !== r || !Ql(e, t) || !Zl(e, t));
    }
    function mw(e, t) {
        const n = ed(t),
            r = ed(e);
        return !(!n || !r || n.type !== r.type || n.value !== r.value || !Ql(e, t) || !Zl(e, t));
    }
    function Zl(e, t) {
        let n = il(e),
            r = il(t);
        if (!n && !r) return !0;
        if ((n && !r) || (!n && r) || ((n = n), (r = r), r.length !== n.length)) return !1;
        for (let i = 0; i < r.length; i++) {
            const s = r[i],
                o = n[i];
            if (s.filename !== o.filename || s.lineno !== o.lineno || s.colno !== o.colno || s.function !== o.function)
                return !1;
        }
        return !0;
    }
    function Ql(e, t) {
        let n = e.fingerprint,
            r = t.fingerprint;
        if (!n && !r) return !0;
        if ((n && !r) || (!n && r)) return !1;
        (n = n), (r = r);
        try {
            return n.join("") === r.join("");
        } catch {
            return !1;
        }
    }
    function ed(e) {
        return e.exception && e.exception.values && e.exception.values[0];
    }
    function td(e) {
        if (e !== void 0) return e >= 400 && e < 500 ? "warning" : e >= 500 ? "error" : void 0;
    }
    const lo = V;
    function nd() {
        if (!("fetch" in lo)) return !1;
        try {
            return new Headers(), new Request("http://www.example.com"), new Response(), !0;
        } catch {
            return !1;
        }
    }
    function fo(e) {
        return e && /^function\s+\w+\(\)\s+\{\s+\[native code\]\s+\}$/.test(e.toString());
    }
    function gw() {
        if (typeof EdgeRuntime == "string") return !0;
        if (!nd()) return !1;
        if (fo(lo.fetch)) return !0;
        let e = !1;
        const t = lo.document;
        if (t && typeof t.createElement == "function")
            try {
                const n = t.createElement("iframe");
                (n.hidden = !0),
                    t.head.appendChild(n),
                    n.contentWindow && n.contentWindow.fetch && (e = fo(n.contentWindow.fetch)),
                    t.head.removeChild(n);
            } catch (n) {
                rn && A.warn("Could not create sandbox iframe for pure fetch check, bailing to window.fetch: ", n);
            }
        return e;
    }
    function _w(e, t) {
        const n = "fetch";
        an(n, e), cn(n, () => bw(void 0, t));
    }
    function bw(e, t = !1) {
        (t && !gw()) ||
            ke(V, "fetch", function (n) {
                return function (...r) {
                    const i = new Error(),
                        { method: s, url: o } = yw(r),
                        a = { args: r, fetchData: { method: s, url: o }, startTimestamp: bt() * 1e3, virtualError: i };
                    return (
                        je("fetch", { ...a }),
                        n.apply(V, r).then(
                            async (c) => (je("fetch", { ...a, endTimestamp: bt() * 1e3, response: c }), c),
                            (c) => {
                                throw (
                                    (je("fetch", { ...a, endTimestamp: bt() * 1e3, error: c }),
                                    Ws(c) && c.stack === void 0 && ((c.stack = i.stack), ln(c, "framesToPop", 1)),
                                    c)
                                );
                            }
                        )
                    );
                };
            });
    }
    function po(e, t) {
        return !!e && typeof e == "object" && !!e[t];
    }
    function rd(e) {
        return typeof e == "string" ? e : e ? (po(e, "url") ? e.url : e.toString ? e.toString() : "") : "";
    }
    function yw(e) {
        if (e.length === 0) return { method: "GET", url: "" };
        if (e.length === 2) {
            const [n, r] = e;
            return { url: rd(n), method: po(r, "method") ? String(r.method).toUpperCase() : "GET" };
        }
        const t = e[0];
        return { url: rd(t), method: po(t, "method") ? String(t.method).toUpperCase() : "GET" };
    }
    function Ew() {
        return "npm";
    }
    const Ci = V;
    function Sw() {
        const e = Ci.chrome,
            t = e && e.app && e.app.runtime,
            n = "history" in Ci && !!Ci.history.pushState && !!Ci.history.replaceState;
        return !t && n;
    }
    const X = V;
    let ho = 0;
    function id() {
        return ho > 0;
    }
    function vw() {
        ho++,
            setTimeout(() => {
                ho--;
            });
    }
    function Vn(e, t = {}) {
        function n(i) {
            return typeof i == "function";
        }
        if (!n(e)) return e;
        try {
            const i = e.__sentry_wrapped__;
            if (i) return typeof i == "function" ? i : e;
            if (Xs(e)) return e;
        } catch {
            return e;
        }
        const r = function (...i) {
            try {
                const s = i.map((o) => Vn(o, t));
                return e.apply(this, s);
            } catch (s) {
                throw (
                    (vw(),
                    hS((o) => {
                        o.addEventProcessor(
                            (a) => (
                                t.mechanism && (Zs(a, void 0), Fn(a, t.mechanism)),
                                (a.extra = { ...a.extra, arguments: i }),
                                a
                            )
                        ),
                            Ev(s);
                    }),
                    s)
                );
            }
        };
        try {
            for (const i in e) Object.prototype.hasOwnProperty.call(e, i) && (r[i] = e[i]);
        } catch {}
        fl(r, e), ln(e, "__sentry_wrapped__", r);
        try {
            Object.getOwnPropertyDescriptor(r, "name").configurable &&
                Object.defineProperty(r, "name", {
                    get() {
                        return e.name;
                    },
                });
        } catch {}
        return r;
    }
    const Er = typeof __SENTRY_DEBUG__ > "u" || __SENTRY_DEBUG__;
    function mo(e, t) {
        const n = _o(e, t),
            r = { type: Rw(t), value: Cw(t) };
        return (
            n.length && (r.stacktrace = { frames: n }),
            r.type === void 0 && r.value === "" && (r.value = "Unrecoverable error caught"),
            r
        );
    }
    function ww(e, t, n, r) {
        const i = fe(),
            s = i && i.getOptions().normalizeDepth,
            o = Lw(t),
            a = { __serialized__: xl(t, s) };
        if (o) return { exception: { values: [mo(e, o)] }, extra: a };
        const c = {
            exception: {
                values: [
                    {
                        type: bi(t) ? t.constructor.name : r ? "UnhandledRejection" : "Error",
                        value: Ow(t, { isUnhandledRejection: r }),
                    },
                ],
            },
            extra: a,
        };
        if (n) {
            const u = _o(e, n);
            u.length && (c.exception.values[0].stacktrace = { frames: u });
        }
        return c;
    }
    function go(e, t) {
        return { exception: { values: [mo(e, t)] } };
    }
    function _o(e, t) {
        const n = t.stacktrace || t.stack || "",
            r = Iw(t),
            i = Aw(t);
        try {
            return e(n, r, i);
        } catch {}
        return [];
    }
    const Tw = /Minified React error #\d+;/i;
    function Iw(e) {
        return e && Tw.test(e.message) ? 1 : 0;
    }
    function Aw(e) {
        return typeof e.framesToPop == "number" ? e.framesToPop : 0;
    }
    function sd(e) {
        return typeof WebAssembly < "u" && typeof WebAssembly.Exception < "u" ? e instanceof WebAssembly.Exception : !1;
    }
    function Rw(e) {
        const t = e && e.name;
        return !t && sd(e)
            ? e.message && Array.isArray(e.message) && e.message.length == 2
                ? e.message[0]
                : "WebAssembly.Exception"
            : t;
    }
    function Cw(e) {
        const t = e && e.message;
        return t
            ? t.error && typeof t.error.message == "string"
                ? t.error.message
                : sd(e) && Array.isArray(e.message) && e.message.length == 2
                  ? e.message[1]
                  : t
            : "No error message";
    }
    function kw(e, t, n, r) {
        const i = (n && n.syntheticException) || void 0,
            s = bo(e, t, i, r);
        return Fn(s), (s.level = "error"), n && n.event_id && (s.event_id = n.event_id), dn(s);
    }
    function xw(e, t, n = "info", r, i) {
        const s = (r && r.syntheticException) || void 0,
            o = yo(e, t, s, i);
        return (o.level = n), r && r.event_id && (o.event_id = r.event_id), dn(o);
    }
    function bo(e, t, n, r, i) {
        let s;
        if (al(t) && t.error) return go(e, t.error);
        if (cl(t) || GE(t)) {
            const o = t;
            if ("stack" in t) s = go(e, t);
            else {
                const a = o.name || (cl(o) ? "DOMError" : "DOMException"),
                    c = o.message ? `${a}: ${o.message}` : a;
                (s = yo(e, c, n, r)), Zs(s, c);
            }
            return "code" in o && (s.tags = { ...s.tags, "DOMException.code": `${o.code}` }), s;
        }
        return Ws(t)
            ? go(e, t)
            : Pn(t) || bi(t)
              ? ((s = ww(e, t, n, i)), Fn(s, { synthetic: !0 }), s)
              : ((s = yo(e, t, n, r)), Zs(s, `${t}`), Fn(s, { synthetic: !0 }), s);
    }
    function yo(e, t, n, r) {
        const i = {};
        if (r && n) {
            const s = _o(e, n);
            s.length && (i.exception = { values: [{ value: t, stacktrace: { frames: s } }] }), Fn(i, { synthetic: !0 });
        }
        if (Ks(t)) {
            const { __sentry_template_string__: s, __sentry_template_values__: o } = t;
            return (i.logentry = { message: s, params: o }), i;
        }
        return (i.message = t), i;
    }
    function Ow(e, { isUnhandledRejection: t }) {
        const n = QE(e),
            r = t ? "promise rejection" : "exception";
        return al(e)
            ? `Event \`ErrorEvent\` captured as ${r} with message \`${e.message}\``
            : bi(e)
              ? `Event \`${Nw(e)}\` (type=${e.type}) captured as ${r}`
              : `Object captured as ${r} with keys: ${n}`;
    }
    function Nw(e) {
        try {
            const t = Object.getPrototypeOf(e);
            return t ? t.constructor.name : void 0;
        } catch {}
    }
    function Lw(e) {
        for (const t in e)
            if (Object.prototype.hasOwnProperty.call(e, t)) {
                const n = e[t];
                if (n instanceof Error) return n;
            }
    }
    function Mw(e, { metadata: t, tunnel: n, dsn: r }) {
        const i = {
                event_id: e.event_id,
                sent_at: new Date().toISOString(),
                ...(t && t.sdk && { sdk: { name: t.sdk.name, version: t.sdk.version } }),
                ...(!!n && !!r && { dsn: wi(r) }),
            },
            s = Dw(e);
        return yr(i, [s]);
    }
    function Dw(e) {
        return [{ type: "user_report" }, e];
    }
    class Pw extends xv {
        constructor(t) {
            const n = { parentSpanIsAlwaysRootSpan: !0, ...t },
                r = X.SENTRY_SDK_SOURCE || Ew();
            Hv(n, "browser", ["browser"], r),
                super(n),
                n.sendClientReports &&
                    X.document &&
                    X.document.addEventListener("visibilitychange", () => {
                        X.document.visibilityState === "hidden" && this._flushOutcomes();
                    });
        }
        eventFromException(t, n) {
            return kw(this._options.stackParser, t, n, this._options.attachStacktrace);
        }
        eventFromMessage(t, n = "info", r) {
            return xw(this._options.stackParser, t, n, r, this._options.attachStacktrace);
        }
        captureUserFeedback(t) {
            if (!this._isEnabled()) {
                Er && A.warn("SDK not enabled, will not capture user feedback.");
                return;
            }
            const n = Mw(t, { metadata: this.getSdkMetadata(), dsn: this.getDsn(), tunnel: this.getOptions().tunnel });
            this.sendEnvelope(n);
        }
        _prepareEvent(t, n, r) {
            return (t.platform = t.platform || "javascript"), super._prepareEvent(t, n, r);
        }
    }
    const Uw = typeof __SENTRY_DEBUG__ > "u" || __SENTRY_DEBUG__,
        be = V,
        Fw = 1e3;
    let od, Eo, So;
    function $w(e) {
        an("dom", e), cn("dom", Bw);
    }
    function Bw() {
        if (!be.document) return;
        const e = je.bind(null, "dom"),
            t = ad(e, !0);
        be.document.addEventListener("click", t, !1),
            be.document.addEventListener("keypress", t, !1),
            ["EventTarget", "Node"].forEach((n) => {
                const i = be[n],
                    s = i && i.prototype;
                !s ||
                    !s.hasOwnProperty ||
                    !s.hasOwnProperty("addEventListener") ||
                    (ke(s, "addEventListener", function (o) {
                        return function (a, c, u) {
                            if (a === "click" || a == "keypress")
                                try {
                                    const f = (this.__sentry_instrumentation_handlers__ =
                                            this.__sentry_instrumentation_handlers__ || {}),
                                        l = (f[a] = f[a] || { refCount: 0 });
                                    if (!l.handler) {
                                        const d = ad(e);
                                        (l.handler = d), o.call(this, a, d, u);
                                    }
                                    l.refCount++;
                                } catch {}
                            return o.call(this, a, c, u);
                        };
                    }),
                    ke(s, "removeEventListener", function (o) {
                        return function (a, c, u) {
                            if (a === "click" || a == "keypress")
                                try {
                                    const f = this.__sentry_instrumentation_handlers__ || {},
                                        l = f[a];
                                    l &&
                                        (l.refCount--,
                                        l.refCount <= 0 &&
                                            (o.call(this, a, l.handler, u), (l.handler = void 0), delete f[a]),
                                        Object.keys(f).length === 0 && delete this.__sentry_instrumentation_handlers__);
                                } catch {}
                            return o.call(this, a, c, u);
                        };
                    }));
            });
    }
    function Vw(e) {
        if (e.type !== Eo) return !1;
        try {
            if (!e.target || e.target._sentryId !== So) return !1;
        } catch {}
        return !0;
    }
    function zw(e, t) {
        return e !== "keypress"
            ? !1
            : !t || !t.tagName
              ? !0
              : !(t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
    }
    function ad(e, t = !1) {
        return (n) => {
            if (!n || n._sentryCaptured) return;
            const r = Hw(n);
            if (zw(n.type, r)) return;
            ln(n, "_sentryCaptured", !0), r && !r._sentryId && ln(r, "_sentryId", Pe());
            const i = n.type === "keypress" ? "input" : n.type;
            Vw(n) || (e({ event: n, name: i, global: t }), (Eo = n.type), (So = r ? r._sentryId : void 0)),
                clearTimeout(od),
                (od = be.setTimeout(() => {
                    (So = void 0), (Eo = void 0);
                }, Fw));
        };
    }
    function Hw(e) {
        try {
            return e.target;
        } catch {
            return null;
        }
    }
    let ki;
    function cd(e) {
        const t = "history";
        an(t, e), cn(t, Gw);
    }
    function Gw() {
        if (!Sw()) return;
        const e = be.onpopstate;
        be.onpopstate = function (...n) {
            const r = be.location.href,
                i = ki;
            if (((ki = r), je("history", { from: i, to: r }), e))
                try {
                    return e.apply(this, n);
                } catch {}
        };
        function t(n) {
            return function (...r) {
                const i = r.length > 2 ? r[2] : void 0;
                if (i) {
                    const s = ki,
                        o = String(i);
                    (ki = o), je("history", { from: s, to: o });
                }
                return n.apply(this, r);
            };
        }
        ke(be.history, "pushState", t), ke(be.history, "replaceState", t);
    }
    const xi = {};
    function jw(e) {
        const t = xi[e];
        if (t) return t;
        let n = be[e];
        if (fo(n)) return (xi[e] = n.bind(be));
        const r = be.document;
        if (r && typeof r.createElement == "function")
            try {
                const i = r.createElement("iframe");
                (i.hidden = !0), r.head.appendChild(i);
                const s = i.contentWindow;
                s && s[e] && (n = s[e]), r.head.removeChild(i);
            } catch (i) {
                Uw && A.warn(`Could not create sandbox iframe for ${e} check, bailing to window.${e}: `, i);
            }
        return n && (xi[e] = n.bind(be));
    }
    function ud(e) {
        xi[e] = void 0;
    }
    const Sr = "__sentry_xhr_v3__";
    function Ww(e) {
        an("xhr", e), cn("xhr", Kw);
    }
    function Kw() {
        if (!be.XMLHttpRequest) return;
        const e = XMLHttpRequest.prototype;
        (e.open = new Proxy(e.open, {
            apply(t, n, r) {
                const i = new Error(),
                    s = bt() * 1e3,
                    o = _t(r[0]) ? r[0].toUpperCase() : void 0,
                    a = qw(r[1]);
                if (!o || !a) return t.apply(n, r);
                (n[Sr] = { method: o, url: a, request_headers: {} }),
                    o === "POST" && a.match(/sentry_key/) && (n.__sentry_own_request__ = !0);
                const c = () => {
                    const u = n[Sr];
                    if (u && n.readyState === 4) {
                        try {
                            u.status_code = n.status;
                        } catch {}
                        const f = { endTimestamp: bt() * 1e3, startTimestamp: s, xhr: n, virtualError: i };
                        je("xhr", f);
                    }
                };
                return (
                    "onreadystatechange" in n && typeof n.onreadystatechange == "function"
                        ? (n.onreadystatechange = new Proxy(n.onreadystatechange, {
                              apply(u, f, l) {
                                  return c(), u.apply(f, l);
                              },
                          }))
                        : n.addEventListener("readystatechange", c),
                    (n.setRequestHeader = new Proxy(n.setRequestHeader, {
                        apply(u, f, l) {
                            const [d, p] = l,
                                h = f[Sr];
                            return h && _t(d) && _t(p) && (h.request_headers[d.toLowerCase()] = p), u.apply(f, l);
                        },
                    })),
                    t.apply(n, r)
                );
            },
        })),
            (e.send = new Proxy(e.send, {
                apply(t, n, r) {
                    const i = n[Sr];
                    if (!i) return t.apply(n, r);
                    r[0] !== void 0 && (i.body = r[0]);
                    const s = { startTimestamp: bt() * 1e3, xhr: n };
                    return je("xhr", s), t.apply(n, r);
                },
            }));
    }
    function qw(e) {
        if (_t(e)) return e;
        try {
            return e.toString();
        } catch {}
    }
    function Yw(e, t = jw("fetch")) {
        let n = 0,
            r = 0;
        function i(s) {
            const o = s.body.length;
            (n += o), r++;
            const a = {
                body: s.body,
                method: "POST",
                referrerPolicy: "origin",
                headers: e.headers,
                keepalive: n <= 6e4 && r < 15,
                ...e.fetchOptions,
            };
            if (!t) return ud("fetch"), Si("No fetch implementation available");
            try {
                return t(e.url, a).then(
                    (c) => (
                        (n -= o),
                        r--,
                        {
                            statusCode: c.status,
                            headers: {
                                "x-sentry-rate-limits": c.headers.get("X-Sentry-Rate-Limits"),
                                "retry-after": c.headers.get("Retry-After"),
                            },
                        }
                    )
                );
            } catch (c) {
                return ud("fetch"), (n -= o), r--, Si(c);
            }
        }
        return zv(e, i);
    }
    const Xw = 30,
        Jw = 50;
    function vo(e, t, n, r) {
        const i = { filename: e, function: t === "<anonymous>" ? on : t, in_app: !0 };
        return n !== void 0 && (i.lineno = n), r !== void 0 && (i.colno = r), i;
    }
    const Zw = /^\s*at (\S+?)(?::(\d+))(?::(\d+))\s*$/i,
        Qw =
            /^\s*at (?:(.+?\)(?: \[.+\])?|.*?) ?\((?:address at )?)?(?:async )?((?:<anonymous>|[-a-z]+:|.*bundle|\/)?.*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i,
        eT = /\((\S*)(?::(\d+))(?::(\d+))\)/,
        tT = [
            Xw,
            (e) => {
                const t = Zw.exec(e);
                if (t) {
                    const [, r, i, s] = t;
                    return vo(r, on, +i, +s);
                }
                const n = Qw.exec(e);
                if (n) {
                    if (n[2] && n[2].indexOf("eval") === 0) {
                        const o = eT.exec(n[2]);
                        o && ((n[2] = o[1]), (n[3] = o[2]), (n[4] = o[3]));
                    }
                    const [i, s] = ld(n[1] || on, n[2]);
                    return vo(s, i, n[3] ? +n[3] : void 0, n[4] ? +n[4] : void 0);
                }
            },
        ],
        nT =
            /^\s*(.*?)(?:\((.*?)\))?(?:^|@)?((?:[-a-z]+)?:\/.*?|\[native code\]|[^@]*(?:bundle|\d+\.js)|\/[\w\-. /=]+)(?::(\d+))?(?::(\d+))?\s*$/i,
        rT = /(\S+) line (\d+)(?: > eval line \d+)* > eval/i,
        iT = rl(
            ...[
                tT,
                [
                    Jw,
                    (e) => {
                        const t = nT.exec(e);
                        if (t) {
                            if (t[3] && t[3].indexOf(" > eval") > -1) {
                                const s = rT.exec(t[3]);
                                s && ((t[1] = t[1] || "eval"), (t[3] = s[1]), (t[4] = s[2]), (t[5] = ""));
                            }
                            let r = t[3],
                                i = t[1] || on;
                            return ([i, r] = ld(i, r)), vo(r, i, t[4] ? +t[4] : void 0, t[5] ? +t[5] : void 0);
                        }
                    },
                ],
            ]
        ),
        ld = (e, t) => {
            const n = e.indexOf("safari-extension") !== -1,
                r = e.indexOf("safari-web-extension") !== -1;
            return n || r
                ? [
                      e.indexOf("@") !== -1 ? e.split("@")[0] : on,
                      n ? `safari-extension:${t}` : `safari-web-extension:${t}`,
                  ]
                : [e, t];
        },
        Oi = 1024,
        sT = "Breadcrumbs",
        oT = (e = {}) => {
            const t = { console: !0, dom: !0, fetch: !0, history: !0, sentry: !0, xhr: !0, ...e };
            return {
                name: sT,
                setup(n) {
                    t.console && cw(uT(n)),
                        t.dom && $w(cT(n, t.dom)),
                        t.xhr && Ww(lT(n)),
                        t.fetch && _w(dT(n)),
                        t.history && cd(fT(n)),
                        t.sentry && n.on("beforeSendEvent", aT(n));
                },
            };
        };
    function aT(e) {
        return function (n) {
            fe() === e &&
                pn(
                    {
                        category: `sentry.${n.type === "transaction" ? "transaction" : "event"}`,
                        event_id: n.event_id,
                        level: n.level,
                        message: Ft(n),
                    },
                    { event: n }
                );
        };
    }
    function cT(e, t) {
        return function (r) {
            if (fe() !== e) return;
            let i,
                s,
                o = typeof t == "object" ? t.serializeAttribute : void 0,
                a = typeof t == "object" && typeof t.maxStringLength == "number" ? t.maxStringLength : void 0;
            a &&
                a > Oi &&
                (Er &&
                    A.warn(
                        `\`dom.maxStringLength\` cannot exceed ${Oi}, but a value of ${a} was configured. Sentry will use ${Oi} instead.`
                    ),
                (a = Oi)),
                typeof o == "string" && (o = [o]);
            try {
                const u = r.event,
                    f = pT(u) ? u.target : u;
                (i = ll(f, { keyAttrs: o, maxStringLength: a })), (s = JE(f));
            } catch {
                i = "<unknown>";
            }
            if (i.length === 0) return;
            const c = { category: `ui.${r.name}`, message: i };
            s && (c.data = { "ui.component_name": s }), pn(c, { event: r.event, name: r.name, global: r.global });
        };
    }
    function uT(e) {
        return function (n) {
            if (fe() !== e) return;
            const r = {
                category: "console",
                data: { arguments: n.args, logger: "console" },
                level: lw(n.level),
                message: dl(n.args, " "),
            };
            if (n.level === "assert")
                if (n.args[0] === !1)
                    (r.message = `Assertion failed: ${dl(n.args.slice(1), " ") || "console.assert"}`),
                        (r.data.arguments = n.args.slice(1));
                else return;
            pn(r, { input: n.args, level: n.level });
        };
    }
    function lT(e) {
        return function (n) {
            if (fe() !== e) return;
            const { startTimestamp: r, endTimestamp: i } = n,
                s = n.xhr[Sr];
            if (!r || !i || !s) return;
            const { method: o, url: a, status_code: c, body: u } = s,
                f = { method: o, url: a, status_code: c },
                l = { xhr: n.xhr, input: u, startTimestamp: r, endTimestamp: i },
                d = td(c);
            pn({ category: "xhr", data: f, type: "http", level: d }, l);
        };
    }
    function dT(e) {
        return function (n) {
            if (fe() !== e) return;
            const { startTimestamp: r, endTimestamp: i } = n;
            if (i && !(n.fetchData.url.match(/sentry_key/) && n.fetchData.method === "POST"))
                if (n.error) {
                    const s = n.fetchData,
                        o = { data: n.error, input: n.args, startTimestamp: r, endTimestamp: i };
                    pn({ category: "fetch", data: s, level: "error", type: "http" }, o);
                } else {
                    const s = n.response,
                        o = { ...n.fetchData, status_code: s && s.status },
                        a = { input: n.args, response: s, startTimestamp: r, endTimestamp: i },
                        c = td(o.status_code);
                    pn({ category: "fetch", data: o, type: "http", level: c }, a);
                }
        };
    }
    function fT(e) {
        return function (n) {
            if (fe() !== e) return;
            let r = n.from,
                i = n.to;
            const s = uo(X.location.href);
            let o = r ? uo(r) : void 0;
            const a = uo(i);
            (!o || !o.path) && (o = s),
                s.protocol === a.protocol && s.host === a.host && (i = a.relative),
                s.protocol === o.protocol && s.host === o.host && (r = o.relative),
                pn({ category: "navigation", data: { from: r, to: i } });
        };
    }
    function pT(e) {
        return !!e && !!e.target;
    }
    const hT = [
            "EventTarget",
            "Window",
            "Node",
            "ApplicationCache",
            "AudioTrackList",
            "BroadcastChannel",
            "ChannelMergerNode",
            "CryptoOperation",
            "EventSource",
            "FileReader",
            "HTMLUnknownElement",
            "IDBDatabase",
            "IDBRequest",
            "IDBTransaction",
            "KeyOperation",
            "MediaController",
            "MessagePort",
            "ModalWindow",
            "Notification",
            "SVGElementInstance",
            "Screen",
            "SharedWorker",
            "TextTrack",
            "TextTrackCue",
            "TextTrackList",
            "WebSocket",
            "WebSocketWorker",
            "Worker",
            "XMLHttpRequest",
            "XMLHttpRequestEventTarget",
            "XMLHttpRequestUpload",
        ],
        mT = "BrowserApiErrors",
        gT = (e = {}) => {
            const t = {
                XMLHttpRequest: !0,
                eventTarget: !0,
                requestAnimationFrame: !0,
                setInterval: !0,
                setTimeout: !0,
                ...e,
            };
            return {
                name: mT,
                setupOnce() {
                    t.setTimeout && ke(X, "setTimeout", dd),
                        t.setInterval && ke(X, "setInterval", dd),
                        t.requestAnimationFrame && ke(X, "requestAnimationFrame", _T),
                        t.XMLHttpRequest && "XMLHttpRequest" in X && ke(XMLHttpRequest.prototype, "send", bT);
                    const n = t.eventTarget;
                    n && (Array.isArray(n) ? n : hT).forEach(yT);
                },
            };
        };
    function dd(e) {
        return function (...t) {
            const n = t[0];
            return (
                (t[0] = Vn(n, { mechanism: { data: { function: Ut(e) }, handled: !1, type: "instrument" } })),
                e.apply(this, t)
            );
        };
    }
    function _T(e) {
        return function (t) {
            return e.apply(this, [
                Vn(t, {
                    mechanism: {
                        data: { function: "requestAnimationFrame", handler: Ut(e) },
                        handled: !1,
                        type: "instrument",
                    },
                }),
            ]);
        };
    }
    function bT(e) {
        return function (...t) {
            const n = this;
            return (
                ["onload", "onerror", "onprogress", "onreadystatechange"].forEach((i) => {
                    i in n &&
                        typeof n[i] == "function" &&
                        ke(n, i, function (s) {
                            const o = {
                                    mechanism: {
                                        data: { function: i, handler: Ut(s) },
                                        handled: !1,
                                        type: "instrument",
                                    },
                                },
                                a = Xs(s);
                            return a && (o.mechanism.data.handler = Ut(a)), Vn(s, o);
                        });
                }),
                e.apply(this, t)
            );
        };
    }
    function yT(e) {
        const n = X[e],
            r = n && n.prototype;
        !r ||
            !r.hasOwnProperty ||
            !r.hasOwnProperty("addEventListener") ||
            (ke(r, "addEventListener", function (i) {
                return function (s, o, a) {
                    try {
                        ET(o) &&
                            (o.handleEvent = Vn(o.handleEvent, {
                                mechanism: {
                                    data: { function: "handleEvent", handler: Ut(o), target: e },
                                    handled: !1,
                                    type: "instrument",
                                },
                            }));
                    } catch {}
                    return i.apply(this, [
                        s,
                        Vn(o, {
                            mechanism: {
                                data: { function: "addEventListener", handler: Ut(o), target: e },
                                handled: !1,
                                type: "instrument",
                            },
                        }),
                        a,
                    ]);
                };
            }),
            ke(r, "removeEventListener", function (i) {
                return function (s, o, a) {
                    try {
                        const c = o.__sentry_wrapped__;
                        c && i.call(this, s, c, a);
                    } catch {}
                    return i.call(this, s, o, a);
                };
            }));
    }
    function ET(e) {
        return typeof e.handleEvent == "function";
    }
    const ST = () => ({
            name: "BrowserSession",
            setupOnce() {
                if (typeof X.document > "u") {
                    Er && A.warn("Using the `browserSessionIntegration` in non-browser environments is not supported.");
                    return;
                }
                Ul({ ignoreDuration: !0 }),
                    Bl(),
                    cd(({ from: e, to: t }) => {
                        e !== void 0 && e !== t && (Ul({ ignoreDuration: !0 }), Bl());
                    });
            },
        }),
        vT = "GlobalHandlers",
        wT = (e = {}) => {
            const t = { onerror: !0, onunhandledrejection: !0, ...e };
            return {
                name: vT,
                setupOnce() {
                    Error.stackTraceLimit = 50;
                },
                setup(n) {
                    t.onerror && (TT(n), fd("onerror")), t.onunhandledrejection && (IT(n), fd("onunhandledrejection"));
                },
            };
        };
    function TT(e) {
        BE((t) => {
            const { stackParser: n, attachStacktrace: r } = pd();
            if (fe() !== e || id()) return;
            const { msg: i, url: s, line: o, column: a, error: c } = t,
                u = CT(bo(n, c || i, void 0, r, !1), s, o, a);
            (u.level = "error"), Pl(u, { originalException: c, mechanism: { handled: !1, type: "onerror" } });
        });
    }
    function IT(e) {
        zE((t) => {
            const { stackParser: n, attachStacktrace: r } = pd();
            if (fe() !== e || id()) return;
            const i = AT(t),
                s = qs(i) ? RT(i) : bo(n, i, void 0, r, !0);
            (s.level = "error"),
                Pl(s, { originalException: i, mechanism: { handled: !1, type: "onunhandledrejection" } });
        });
    }
    function AT(e) {
        if (qs(e)) return e;
        try {
            if ("reason" in e) return e.reason;
            if ("detail" in e && "reason" in e.detail) return e.detail.reason;
        } catch {}
        return e;
    }
    function RT(e) {
        return {
            exception: {
                values: [
                    {
                        type: "UnhandledRejection",
                        value: `Non-Error promise rejection captured with value: ${String(e)}`,
                    },
                ],
            },
        };
    }
    function CT(e, t, n, r) {
        const i = (e.exception = e.exception || {}),
            s = (i.values = i.values || []),
            o = (s[0] = s[0] || {}),
            a = (o.stacktrace = o.stacktrace || {}),
            c = (a.frames = a.frames || []),
            u = r,
            f = n,
            l = _t(t) && t.length > 0 ? t : XE();
        return c.length === 0 && c.push({ colno: u, filename: l, function: on, in_app: !0, lineno: f }), e;
    }
    function fd(e) {
        Er && A.log(`Global Handler attached: ${e}`);
    }
    function pd() {
        const e = fe();
        return (e && e.getOptions()) || { stackParser: () => [], attachStacktrace: !1 };
    }
    const kT = () => ({
            name: "HttpContext",
            preprocessEvent(e) {
                if (!X.navigator && !X.location && !X.document) return;
                const t = (e.request && e.request.url) || (X.location && X.location.href),
                    { referrer: n } = X.document || {},
                    { userAgent: r } = X.navigator || {},
                    i = {
                        ...(e.request && e.request.headers),
                        ...(n && { Referer: n }),
                        ...(r && { "User-Agent": r }),
                    },
                    s = { ...e.request, ...(t && { url: t }), headers: i };
                e.request = s;
            },
        }),
        xT = "cause",
        OT = 5,
        NT = "LinkedErrors",
        LT = (e = {}) => {
            const t = e.limit || OT,
                n = e.key || xT;
            return {
                name: NT,
                preprocessEvent(r, i, s) {
                    const o = s.getOptions();
                    ow(mo, o.stackParser, o.maxValueLength, n, t, r, i);
                },
            };
        };
    function MT(e) {
        const t = [Yv(), Wv(), gT(), oT(), wT(), LT(), fw(), kT()];
        return e.autoSessionTracking !== !1 && t.push(ST()), t;
    }
    function DT(e = {}) {
        const t = {
            defaultIntegrations: MT(e),
            release:
                typeof __SENTRY_RELEASE__ == "string"
                    ? __SENTRY_RELEASE__
                    : X.SENTRY_RELEASE && X.SENTRY_RELEASE.id
                      ? X.SENTRY_RELEASE.id
                      : void 0,
            autoSessionTracking: !0,
            sendClientReports: !0,
        };
        return e.defaultIntegrations == null && delete e.defaultIntegrations, { ...t, ...e };
    }
    function PT() {
        const e = typeof X.window < "u" && X;
        if (!e) return !1;
        const t = e.chrome ? "chrome" : "browser",
            n = e[t],
            r = n && n.runtime && n.runtime.id,
            i = (X.location && X.location.href) || "",
            s = ["chrome-extension:", "moz-extension:", "ms-browser-extension:", "safari-web-extension:"],
            o = !!r && X === X.top && s.some((c) => i.startsWith(`${c}//`)),
            a = typeof e.nw < "u";
        return !!r && !o && !a;
    }
    function UT(e = {}) {
        const t = DT(e);
        if (!t.skipBrowserExtensionCheck && PT()) {
            sn(() => {
                console.error(
                    "[Sentry] You cannot run Sentry this way in a browser extension, check: https://docs.sentry.io/platforms/javascript/best-practices/browser-extensions/"
                );
            });
            return;
        }
        Er &&
            (nd() ||
                A.warn(
                    "No Fetch API detected. The Sentry SDK requires a Fetch API compatible environment to send events. Please add a Fetch API polyfill."
                ));
        const n = { ...t, stackParser: FE(t.stackParser || iT), integrations: Rv(t), transport: t.transport || Yw };
        return Lv(Pw, n);
    }
    const FT = () => {
            UT({
                dsn: "https://fb12ea0c434aa20ad37bf9cc9cff7e31@o4504136533147648.ingest.us.sentry.io/4508600749064192",
                integrations: [],
                release: chrome.runtime.getManifest?.().version ?? "offscreen",
                environment: "production",
            });
        },
        $T = "/mobilebasic",
        BT = (e) => {
            e.keep(["input", "textarea", "select", "option"]),
                e.addRule("spanSpaces", { filter: ["span"], replacement: (t) => ` ${t.trim()} ` }),
                e.addRule("links", {
                    filter: ["a"],
                    replacement: (t, n) => {
                        const r = n,
                            i = r.getAttribute("href") ?? "";
                        if (!i) return "";
                        const s = r.getAttribute("aria-label") ?? "",
                            o = r.getAttribute("title") ?? "";
                        return `[${t || s || o}](${i})`;
                    },
                }),
                e.addRule("tableCell", {
                    filter: ["td", "th"],
                    replacement: (t, n) => {
                        const r = t
                                .replace(/\n+/g, " ")
                                .replace(/(?<!\\)\|/g, "")
                                .replace(/(.)\1{3,}/gm, "$1$1$1")
                                .trim(),
                            s = Number(n.getAttribute("colspan") ?? "1");
                        return Array.from({ length: s }, (o, a) => ` ${a === 0 ? r : " "} |`).join("");
                    },
                }),
                e.addRule("tableRow", {
                    filter: "tr",
                    replacement: (t) =>
                        t.replace(/(?<!\\)\|/g, "").trim()
                            ? `
|${t}`
                            : "",
                }),
                e.addRule("tableSection", { filter: ["thead", "tbody", "tfoot"], replacement: (t) => t }),
                e.addRule("table", {
                    filter: "table",
                    replacement: (t) => {
                        const n = t.indexOf(
                                `
`,
                                1
                            ),
                            i = t.slice(0, n).match(/(?<!\\)\|/g) ?? [],
                            s = i.join("   "),
                            o = i.join("---");
                        return i.length > 1
                            ? `
${s}
${o}${t}`
                            : t.replace(/(?<!\\)\|/g, "").trim();
                    },
                }),
                e.addRule("media", {
                    filter: ["img", "video", "audio", "iframe", "canvas"],
                    replacement: (t, n) => {
                        const r = n,
                            i = r.getAttribute("alt") ?? "",
                            s = r.getAttribute("title") ?? "";
                        return i || s || "";
                    },
                });
        };
    function VT(e) {
        for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n) n.hasOwnProperty(r) && (e[r] = n[r]);
        }
        return e;
    }
    function wo(e, t) {
        return Array(t + 1).join(e);
    }
    function zT(e) {
        return e.replace(/^\n*/, "");
    }
    function HT(e) {
        for (
            var t = e.length;
            t > 0 &&
            e[t - 1] ===
                `
`;

        )
            t--;
        return e.substring(0, t);
    }
    var GT = [
        "ADDRESS",
        "ARTICLE",
        "ASIDE",
        "AUDIO",
        "BLOCKQUOTE",
        "BODY",
        "CANVAS",
        "CENTER",
        "DD",
        "DIR",
        "DIV",
        "DL",
        "DT",
        "FIELDSET",
        "FIGCAPTION",
        "FIGURE",
        "FOOTER",
        "FORM",
        "FRAMESET",
        "H1",
        "H2",
        "H3",
        "H4",
        "H5",
        "H6",
        "HEADER",
        "HGROUP",
        "HR",
        "HTML",
        "ISINDEX",
        "LI",
        "MAIN",
        "MENU",
        "NAV",
        "NOFRAMES",
        "NOSCRIPT",
        "OL",
        "OUTPUT",
        "P",
        "PRE",
        "SECTION",
        "TABLE",
        "TBODY",
        "TD",
        "TFOOT",
        "TH",
        "THEAD",
        "TR",
        "UL",
    ];
    function To(e) {
        return Io(e, GT);
    }
    var hd = [
        "AREA",
        "BASE",
        "BR",
        "COL",
        "COMMAND",
        "EMBED",
        "HR",
        "IMG",
        "INPUT",
        "KEYGEN",
        "LINK",
        "META",
        "PARAM",
        "SOURCE",
        "TRACK",
        "WBR",
    ];
    function md(e) {
        return Io(e, hd);
    }
    function jT(e) {
        return _d(e, hd);
    }
    var gd = ["A", "TABLE", "THEAD", "TBODY", "TFOOT", "TH", "TD", "IFRAME", "SCRIPT", "AUDIO", "VIDEO"];
    function WT(e) {
        return Io(e, gd);
    }
    function KT(e) {
        return _d(e, gd);
    }
    function Io(e, t) {
        return t.indexOf(e.nodeName) >= 0;
    }
    function _d(e, t) {
        return (
            e.getElementsByTagName &&
            t.some(function (n) {
                return e.getElementsByTagName(n).length;
            })
        );
    }
    var pe = {};
    (pe.paragraph = {
        filter: "p",
        replacement: function (e) {
            return (
                `

` +
                e +
                `

`
            );
        },
    }),
        (pe.lineBreak = {
            filter: "br",
            replacement: function (e, t, n) {
                return (
                    n.br +
                    `
`
                );
            },
        }),
        (pe.heading = {
            filter: ["h1", "h2", "h3", "h4", "h5", "h6"],
            replacement: function (e, t, n) {
                var r = Number(t.nodeName.charAt(1));
                if (n.headingStyle === "setext" && r < 3) {
                    var i = wo(r === 1 ? "=" : "-", e.length);
                    return (
                        `

` +
                        e +
                        `
` +
                        i +
                        `

`
                    );
                } else
                    return (
                        `

` +
                        wo("#", r) +
                        " " +
                        e +
                        `

`
                    );
            },
        }),
        (pe.blockquote = {
            filter: "blockquote",
            replacement: function (e) {
                return (
                    (e = e.replace(/^\n+|\n+$/g, "")),
                    (e = e.replace(/^/gm, "> ")),
                    `

` +
                        e +
                        `

`
                );
            },
        }),
        (pe.list = {
            filter: ["ul", "ol"],
            replacement: function (e, t) {
                var n = t.parentNode;
                return n.nodeName === "LI" && n.lastElementChild === t
                    ? `
` + e
                    : `

` +
                          e +
                          `

`;
            },
        }),
        (pe.listItem = {
            filter: "li",
            replacement: function (e, t, n) {
                e = e
                    .replace(/^\n+/, "")
                    .replace(
                        /\n+$/,
                        `
`
                    )
                    .replace(
                        /\n/gm,
                        `
    `
                    );
                var r = n.bulletListMarker + "   ",
                    i = t.parentNode;
                if (i.nodeName === "OL") {
                    var s = i.getAttribute("start"),
                        o = Array.prototype.indexOf.call(i.children, t);
                    r = (s ? Number(s) + o : o + 1) + ".  ";
                }
                return (
                    r +
                    e +
                    (t.nextSibling && !/\n$/.test(e)
                        ? `
`
                        : "")
                );
            },
        }),
        (pe.indentedCodeBlock = {
            filter: function (e, t) {
                return (
                    t.codeBlockStyle === "indented" &&
                    e.nodeName === "PRE" &&
                    e.firstChild &&
                    e.firstChild.nodeName === "CODE"
                );
            },
            replacement: function (e, t, n) {
                return (
                    `

    ` +
                    t.firstChild.textContent.replace(
                        /\n/g,
                        `
    `
                    ) +
                    `

`
                );
            },
        }),
        (pe.fencedCodeBlock = {
            filter: function (e, t) {
                return (
                    t.codeBlockStyle === "fenced" &&
                    e.nodeName === "PRE" &&
                    e.firstChild &&
                    e.firstChild.nodeName === "CODE"
                );
            },
            replacement: function (e, t, n) {
                for (
                    var r = t.firstChild.getAttribute("class") || "",
                        i = (r.match(/language-(\S+)/) || [null, ""])[1],
                        s = t.firstChild.textContent,
                        o = n.fence.charAt(0),
                        a = 3,
                        c = new RegExp("^" + o + "{3,}", "gm"),
                        u;
                    (u = c.exec(s));

                )
                    u[0].length >= a && (a = u[0].length + 1);
                var f = wo(o, a);
                return (
                    `

` +
                    f +
                    i +
                    `
` +
                    s.replace(/\n$/, "") +
                    `
` +
                    f +
                    `

`
                );
            },
        }),
        (pe.horizontalRule = {
            filter: "hr",
            replacement: function (e, t, n) {
                return (
                    `

` +
                    n.hr +
                    `

`
                );
            },
        }),
        (pe.inlineLink = {
            filter: function (e, t) {
                return t.linkStyle === "inlined" && e.nodeName === "A" && e.getAttribute("href");
            },
            replacement: function (e, t) {
                var n = t.getAttribute("href");
                n && (n = n.replace(/([()])/g, "\\$1"));
                var r = Ni(t.getAttribute("title"));
                return r && (r = ' "' + r.replace(/"/g, '\\"') + '"'), "[" + e + "](" + n + r + ")";
            },
        }),
        (pe.referenceLink = {
            filter: function (e, t) {
                return t.linkStyle === "referenced" && e.nodeName === "A" && e.getAttribute("href");
            },
            replacement: function (e, t, n) {
                var r = t.getAttribute("href"),
                    i = Ni(t.getAttribute("title"));
                i && (i = ' "' + i + '"');
                var s, o;
                switch (n.linkReferenceStyle) {
                    case "collapsed":
                        (s = "[" + e + "][]"), (o = "[" + e + "]: " + r + i);
                        break;
                    case "shortcut":
                        (s = "[" + e + "]"), (o = "[" + e + "]: " + r + i);
                        break;
                    default:
                        var a = this.references.length + 1;
                        (s = "[" + e + "][" + a + "]"), (o = "[" + a + "]: " + r + i);
                }
                return this.references.push(o), s;
            },
            references: [],
            append: function (e) {
                var t = "";
                return (
                    this.references.length &&
                        ((t =
                            `

` +
                            this.references.join(`
`) +
                            `

`),
                        (this.references = [])),
                    t
                );
            },
        }),
        (pe.emphasis = {
            filter: ["em", "i"],
            replacement: function (e, t, n) {
                return e.trim() ? n.emDelimiter + e + n.emDelimiter : "";
            },
        }),
        (pe.strong = {
            filter: ["strong", "b"],
            replacement: function (e, t, n) {
                return e.trim() ? n.strongDelimiter + e + n.strongDelimiter : "";
            },
        }),
        (pe.code = {
            filter: function (e) {
                var t = e.previousSibling || e.nextSibling,
                    n = e.parentNode.nodeName === "PRE" && !t;
                return e.nodeName === "CODE" && !n;
            },
            replacement: function (e) {
                if (!e) return "";
                e = e.replace(/\r?\n|\r/g, " ");
                for (
                    var t = /^`|^ .*?[^ ].* $|`$/.test(e) ? " " : "", n = "`", r = e.match(/`+/gm) || [];
                    r.indexOf(n) !== -1;

                )
                    n = n + "`";
                return n + t + e + t + n;
            },
        }),
        (pe.image = {
            filter: "img",
            replacement: function (e, t) {
                var n = Ni(t.getAttribute("alt")),
                    r = t.getAttribute("src") || "",
                    i = Ni(t.getAttribute("title")),
                    s = i ? ' "' + i + '"' : "";
                return r ? "![" + n + "](" + r + s + ")" : "";
            },
        });
    function Ni(e) {
        return e
            ? e.replace(
                  /(\n+\s*)+/g,
                  `
`
              )
            : "";
    }
    function bd(e) {
        (this.options = e),
            (this._keep = []),
            (this._remove = []),
            (this.blankRule = { replacement: e.blankReplacement }),
            (this.keepReplacement = e.keepReplacement),
            (this.defaultRule = { replacement: e.defaultReplacement }),
            (this.array = []);
        for (var t in e.rules) this.array.push(e.rules[t]);
    }
    bd.prototype = {
        add: function (e, t) {
            this.array.unshift(t);
        },
        keep: function (e) {
            this._keep.unshift({ filter: e, replacement: this.keepReplacement });
        },
        remove: function (e) {
            this._remove.unshift({
                filter: e,
                replacement: function () {
                    return "";
                },
            });
        },
        forNode: function (e) {
            if (e.isBlank) return this.blankRule;
            var t;
            return (t = Ao(this.array, e, this.options)) ||
                (t = Ao(this._keep, e, this.options)) ||
                (t = Ao(this._remove, e, this.options))
                ? t
                : this.defaultRule;
        },
        forEach: function (e) {
            for (var t = 0; t < this.array.length; t++) e(this.array[t], t);
        },
    };
    function Ao(e, t, n) {
        for (var r = 0; r < e.length; r++) {
            var i = e[r];
            if (qT(i, t, n)) return i;
        }
    }
    function qT(e, t, n) {
        var r = e.filter;
        if (typeof r == "string") {
            if (r === t.nodeName.toLowerCase()) return !0;
        } else if (Array.isArray(r)) {
            if (r.indexOf(t.nodeName.toLowerCase()) > -1) return !0;
        } else if (typeof r == "function") {
            if (r.call(e, t, n)) return !0;
        } else throw new TypeError("`filter` needs to be a string, array, or function");
    }
    function YT(e) {
        var t = e.element,
            n = e.isBlock,
            r = e.isVoid,
            i =
                e.isPre ||
                function (l) {
                    return l.nodeName === "PRE";
                };
        if (!(!t.firstChild || i(t))) {
            for (var s = null, o = !1, a = null, c = yd(a, t, i); c !== t; ) {
                if (c.nodeType === 3 || c.nodeType === 4) {
                    var u = c.data.replace(/[ \r\n\t]+/g, " ");
                    if (((!s || / $/.test(s.data)) && !o && u[0] === " " && (u = u.substr(1)), !u)) {
                        c = Ro(c);
                        continue;
                    }
                    (c.data = u), (s = c);
                } else if (c.nodeType === 1)
                    n(c) || c.nodeName === "BR"
                        ? (s && (s.data = s.data.replace(/ $/, "")), (s = null), (o = !1))
                        : r(c) || i(c)
                          ? ((s = null), (o = !0))
                          : s && (o = !1);
                else {
                    c = Ro(c);
                    continue;
                }
                var f = yd(a, c, i);
                (a = c), (c = f);
            }
            s && ((s.data = s.data.replace(/ $/, "")), s.data || Ro(s));
        }
    }
    function Ro(e) {
        var t = e.nextSibling || e.parentNode;
        return e.parentNode.removeChild(e), t;
    }
    function yd(e, t, n) {
        return (e && e.parentNode === t) || n(t)
            ? t.nextSibling || t.parentNode
            : t.firstChild || t.nextSibling || t.parentNode;
    }
    var Co = typeof window < "u" ? window : {};
    function XT() {
        var e = Co.DOMParser,
            t = !1;
        try {
            new e().parseFromString("", "text/html") && (t = !0);
        } catch {}
        return t;
    }
    function JT() {
        var e = function () {};
        return (
            ZT()
                ? (e.prototype.parseFromString = function (t) {
                      var n = new window.ActiveXObject("htmlfile");
                      return (n.designMode = "on"), n.open(), n.write(t), n.close(), n;
                  })
                : (e.prototype.parseFromString = function (t) {
                      var n = document.implementation.createHTMLDocument("");
                      return n.open(), n.write(t), n.close(), n;
                  }),
            e
        );
    }
    function ZT() {
        var e = !1;
        try {
            document.implementation.createHTMLDocument("").open();
        } catch {
            Co.ActiveXObject && (e = !0);
        }
        return e;
    }
    var QT = XT() ? Co.DOMParser : JT();
    function e0(e, t) {
        var n;
        if (typeof e == "string") {
            var r = t0().parseFromString('<x-turndown id="turndown-root">' + e + "</x-turndown>", "text/html");
            n = r.getElementById("turndown-root");
        } else n = e.cloneNode(!0);
        return YT({ element: n, isBlock: To, isVoid: md, isPre: t.preformattedCode ? n0 : null }), n;
    }
    var ko;
    function t0() {
        return (ko = ko || new QT()), ko;
    }
    function n0(e) {
        return e.nodeName === "PRE" || e.nodeName === "CODE";
    }
    function r0(e, t) {
        return (
            (e.isBlock = To(e)),
            (e.isCode = e.nodeName === "CODE" || e.parentNode.isCode),
            (e.isBlank = i0(e)),
            (e.flankingWhitespace = s0(e, t)),
            e
        );
    }
    function i0(e) {
        return !md(e) && !WT(e) && /^\s*$/i.test(e.textContent) && !jT(e) && !KT(e);
    }
    function s0(e, t) {
        if (e.isBlock || (t.preformattedCode && e.isCode)) return { leading: "", trailing: "" };
        var n = o0(e.textContent);
        return (
            n.leadingAscii && Ed("left", e, t) && (n.leading = n.leadingNonAscii),
            n.trailingAscii && Ed("right", e, t) && (n.trailing = n.trailingNonAscii),
            { leading: n.leading, trailing: n.trailing }
        );
    }
    function o0(e) {
        var t = e.match(/^(([ \t\r\n]*)(\s*))(?:(?=\S)[\s\S]*\S)?((\s*?)([ \t\r\n]*))$/);
        return {
            leading: t[1],
            leadingAscii: t[2],
            leadingNonAscii: t[3],
            trailing: t[4],
            trailingNonAscii: t[5],
            trailingAscii: t[6],
        };
    }
    function Ed(e, t, n) {
        var r, i, s;
        return (
            e === "left" ? ((r = t.previousSibling), (i = / $/)) : ((r = t.nextSibling), (i = /^ /)),
            r &&
                (r.nodeType === 3
                    ? (s = i.test(r.nodeValue))
                    : n.preformattedCode && r.nodeName === "CODE"
                      ? (s = !1)
                      : r.nodeType === 1 && !To(r) && (s = i.test(r.textContent))),
            s
        );
    }
    var a0 = Array.prototype.reduce,
        c0 = [
            [/\\/g, "\\\\"],
            [/\*/g, "\\*"],
            [/^-/g, "\\-"],
            [/^\+ /g, "\\+ "],
            [/^(=+)/g, "\\$1"],
            [/^(#{1,6}) /g, "\\$1 "],
            [/`/g, "\\`"],
            [/^~~~/g, "\\~~~"],
            [/\[/g, "\\["],
            [/\]/g, "\\]"],
            [/^>/g, "\\>"],
            [/_/g, "\\_"],
            [/^(\d+)\. /g, "$1\\. "],
        ];
    function Li(e) {
        if (!(this instanceof Li)) return new Li(e);
        var t = {
            rules: pe,
            headingStyle: "setext",
            hr: "* * *",
            bulletListMarker: "*",
            codeBlockStyle: "indented",
            fence: "```",
            emDelimiter: "_",
            strongDelimiter: "**",
            linkStyle: "inlined",
            linkReferenceStyle: "full",
            br: "  ",
            preformattedCode: !1,
            blankReplacement: function (n, r) {
                return r.isBlock
                    ? `

`
                    : "";
            },
            keepReplacement: function (n, r) {
                return r.isBlock
                    ? `

` +
                          r.outerHTML +
                          `

`
                    : r.outerHTML;
            },
            defaultReplacement: function (n, r) {
                return r.isBlock
                    ? `

` +
                          n +
                          `

`
                    : n;
            },
        };
        (this.options = VT({}, t, e)), (this.rules = new bd(this.options));
    }
    Li.prototype = {
        turndown: function (e) {
            if (!d0(e)) throw new TypeError(e + " is not a string, or an element/document/fragment node.");
            if (e === "") return "";
            var t = Sd.call(this, new e0(e, this.options));
            return u0.call(this, t);
        },
        use: function (e) {
            if (Array.isArray(e)) for (var t = 0; t < e.length; t++) this.use(e[t]);
            else if (typeof e == "function") e(this);
            else throw new TypeError("plugin must be a Function or an Array of Functions");
            return this;
        },
        addRule: function (e, t) {
            return this.rules.add(e, t), this;
        },
        keep: function (e) {
            return this.rules.keep(e), this;
        },
        remove: function (e) {
            return this.rules.remove(e), this;
        },
        escape: function (e) {
            return c0.reduce(function (t, n) {
                return t.replace(n[0], n[1]);
            }, e);
        },
    };
    function Sd(e) {
        var t = this;
        return a0.call(
            e.childNodes,
            function (n, r) {
                r = new r0(r, t.options);
                var i = "";
                return (
                    r.nodeType === 3
                        ? (i = r.isCode ? r.nodeValue : t.escape(r.nodeValue))
                        : r.nodeType === 1 && (i = l0.call(t, r)),
                    vd(n, i)
                );
            },
            ""
        );
    }
    function u0(e) {
        var t = this;
        return (
            this.rules.forEach(function (n) {
                typeof n.append == "function" && (e = vd(e, n.append(t.options)));
            }),
            e.replace(/^[\t\r\n]+/, "").replace(/[\t\r\n\s]+$/, "")
        );
    }
    function l0(e) {
        var t = this.rules.forNode(e),
            n = Sd.call(this, e),
            r = e.flankingWhitespace;
        return (r.leading || r.trailing) && (n = n.trim()), r.leading + t.replacement(n, e, this.options) + r.trailing;
    }
    function vd(e, t) {
        var n = HT(e),
            r = zT(t),
            i = Math.max(e.length - n.length, t.length - r.length),
            s = `

`.substring(0, i);
        return n + s + r;
    }
    function d0(e) {
        return (
            e != null &&
            (typeof e == "string" || (e.nodeType && (e.nodeType === 1 || e.nodeType === 9 || e.nodeType === 11)))
        );
    }
    const wd = new Li();
    wd.use(BT);
    const xo = (e) => wd.turndown(e);
    class f0 {
        async resizeImage(t, n) {
            return new Promise((r, i) => {
                const s = new Image();
                (s.onload = () => {
                    try {
                        const o = document.createElement("canvas"),
                            a = o.getContext("2d");
                        if (!a) {
                            i(new Error("Failed to get canvas context"));
                            return;
                        }
                        const c = s.height / s.width,
                            u = Math.min(s.width, n),
                            f = u * c;
                        (o.width = u), (o.height = f), a.drawImage(s, 0, 0, u, f);
                        const l = o.toDataURL("image/png", 1);
                        r(l);
                    } catch (o) {
                        i(o);
                    }
                }),
                    (s.onerror = () => i(new Error("Failed to load image"))),
                    t.startsWith("data:") ? (s.src = t) : (s.src = `data:image/png;base64,${t}`);
            });
        }
        async parsePdf(t) {
            let n = () => {},
                r = () => {};
            const i = new Promise((c, u) => {
                    (n = c), (r = u);
                }),
                s = await fetch(t, Oo),
                o = new Worker(chrome.runtime.getURL("pdf_worker.js"));
            (o.onmessage = (c) => n(c.data)), (o.onerror = (c) => r(c.error));
            const a = await s.arrayBuffer();
            return o.postMessage(a, [a]), i;
        }
        async parseGoogleSheets(t) {
            const r = await (await fetch(t, Oo)).text(),
                i = new DOMParser().parseFromString(r, "text/html"),
                s = i.body.querySelector("table") ?? i.body;
            return xo(s.outerHTML);
        }
        async parseGoogleDocs(t) {
            const r = await (await fetch(t, Oo)).text(),
                i = new DOMParser().parseFromString(r, "text/html");
            if (t.endsWith($T)) {
                i.querySelectorAll("style, script").forEach((u) => u.remove());
                const c = (await xo(i.body.innerHTML)).trim();
                if (c.length) return c;
            }
            const s = (c) =>
                    c
                        .replace(/\\u([\da-fA-F]{4})/g, (u, f) => String.fromCharCode(parseInt(f, 16)))
                        .replace(/\\u[\da-fA-F]{4}/g, "")
                        .replace(
                            /\r\n?/g,
                            `
`
                        )
                        .replace(/[\u0000-\u0009\u000B\u000C\u000E-\u001F\u007F-\u009F]/g, "")
                        .replace(
                            /[ \t]+\n/g,
                            `
`
                        )
                        .replace(
                            /\n{3,}/g,
                            `

`
                        )
                        .trim(),
                o = /DOCS_modelChunk\s*=\s*(\[[\s\S]*?\]);/,
                a = i.body.innerHTML.match(o);
            if (a?.[1]) {
                const u = JSON.parse(a[1]).find((f) => f && typeof f == "object" && f.s);
                if (u?.s) return s(u.s);
            }
            return "";
        }
        transformToMarkdown(t) {
            return xo(t);
        }
    }
    const Oo = { cache: "force-cache", mode: "no-cors" },
        p0 = new f0();
    FT(),
        chrome.runtime.onMessage.addListener(async (e) => {
            if (e.type !== "OFFSCREEN_REQUEST") return;
            const t = { type: "OFFSCREEN_RESPONSE", requestId: e.requestId };
            try {
                const n = await p0[e.method](...e.args);
                chrome.runtime.sendMessage({ ...t, result: n });
            } catch (n) {
                const r =
                    n instanceof Error
                        ? { type: n.name, message: n.message, stack: n.stack }
                        : { type: "unknown", message: String(n) };
                chrome.runtime.sendMessage({ ...t, error: r });
            }
        });
    const No = new WeakMap();
    function nt(e) {
        return No.has(e);
    }
    function h0(e) {
        let t = e;
        for (; t; ) {
            if (!nt(t) && !Rs(t)) return !1;
            t = ri(t);
        }
        return !0;
    }
    function Ie(e) {
        return No.get(e);
    }
    function m0(e, t) {
        No.set(e, t);
    }
    function Lo(e, t) {
        const n = e.tagName,
            r = e.value;
        if (fr(e, t)) {
            const i = e.type;
            return n === "INPUT" && (i === "button" || i === "submit" || i === "reset")
                ? r
                : !r || n === "OPTION"
                  ? void 0
                  : Ot;
        }
        if (n === "OPTION" || n === "SELECT") return e.value;
        if (!(n !== "INPUT" && n !== "TEXTAREA")) return r;
    }
    const g0 = /url\((?:(')([^']*)'|(")([^"]*)"|([^)]*))\)/gm,
        _0 = /^[A-Za-z]+:|^\/\//,
        b0 = /^["']?data:.*,/i;
    function y0(e, t) {
        return e.replace(g0, (n, r, i, s, o, a) => {
            const c = i || o || a;
            if (!t || !c || _0.test(c) || b0.test(c)) return n;
            const u = r || s || "";
            return `url(${u}${E0(c, t)}${u})`;
        });
    }
    function E0(e, t) {
        try {
            return Jn(e, t).href;
        } catch {
            return e;
        }
    }
    const S0 = /[^a-z1-6-_]/;
    function Td(e) {
        const t = e.toLowerCase().trim();
        return S0.test(t) ? "div" : t;
    }
    function Id(e, t) {
        return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${e}' height='${t}' style='background-color:silver'%3E%3C/svg%3E`;
    }
    const rt = {
            FullSnapshot: 2,
            IncrementalSnapshot: 3,
            Meta: 4,
            Focus: 6,
            ViewEnd: 7,
            VisualViewport: 8,
            FrustrationRecord: 9,
        },
        hn = { Document: 0, DocumentType: 1, Element: 2, Text: 3, CDATA: 4, DocumentFragment: 11 },
        Fe = {
            Mutation: 0,
            MouseMove: 1,
            MouseInteraction: 2,
            Scroll: 3,
            ViewportResize: 4,
            Input: 5,
            TouchMove: 6,
            MediaInteraction: 7,
            StyleSheetRule: 8,
        },
        We = {
            MouseUp: 0,
            MouseDown: 1,
            Click: 2,
            ContextMenu: 3,
            DblClick: 4,
            Focus: 5,
            Blur: 6,
            TouchStart: 7,
            TouchEnd: 9,
        },
        Ad = { Play: 0, Pause: 1 };
    function Rd(e) {
        if (!(e === void 0 || e.length === 0))
            return e.map((t) => {
                const n = t.cssRules || t.rules;
                return {
                    cssRules: Array.from(n, (s) => s.cssText),
                    disabled: t.disabled || void 0,
                    media: t.media.length > 0 ? Array.from(t.media) : void 0,
                };
            });
    }
    const v0 = 1e6;
    function Cd(e, t, n, r) {
        if (t === v.HIDDEN) return null;
        const i = e.getAttribute(n);
        if (t === v.MASK && n !== xs && !Xc.includes(n) && n !== r.actionNameAttribute) {
            const s = e.tagName;
            switch (n) {
                case "title":
                case "alt":
                case "placeholder":
                    return Ot;
            }
            if (s === "IMG" && (n === "src" || n === "srcset")) {
                const o = e;
                if (o.naturalWidth > 0) return Id(o.naturalWidth, o.naturalHeight);
                const { width: a, height: c } = e.getBoundingClientRect();
                return a > 0 || c > 0 ? Id(a, c) : eu;
            }
            if (s === "SOURCE" && (n === "src" || n === "srcset")) return eu;
            if ((s === "A" && n === "href") || (i && n.startsWith("data-")) || (s === "IFRAME" && n === "srcdoc"))
                return Ot;
        }
        return !i || typeof i != "string" ? i : zc(i, v0);
    }
    function Mo() {
        return { cssText: { count: 0, max: 0, sum: 0 }, serializationDuration: { count: 0, max: 0, sum: 0 } };
    }
    function Mi(e, t, n) {
        (e[t].count += 1), (e[t].max = Math.max(e[t].max, n)), (e[t].sum += n);
    }
    function w0(e, t) {
        for (const n of ["cssText", "serializationDuration"])
            (e[n].count += t[n].count), (e[n].max = Math.max(e[n].max, t[n].max)), (e[n].sum += t[n].sum);
    }
    function T0(e, t, n) {
        if (t === v.HIDDEN) return {};
        const r = {},
            i = Td(e.tagName),
            s = e.ownerDocument;
        for (let f = 0; f < e.attributes.length; f += 1) {
            const d = e.attributes.item(f).name,
                p = Cd(e, t, d, n.configuration);
            p !== null && (r[d] = p);
        }
        if (e.value && (i === "textarea" || i === "select" || i === "option" || i === "input")) {
            const f = Lo(e, t);
            f !== void 0 && (r.value = f);
        }
        if (i === "option" && t === v.ALLOW) {
            const f = e;
            f.selected && (r.selected = f.selected);
        }
        if (i === "link") {
            const f = Array.from(s.styleSheets).find((d) => d.href === e.href),
                l = Do(f);
            l && f && (Mi(n.serializationContext.serializationStats, "cssText", l.length), (r._cssText = l));
        }
        if (i === "style" && e.sheet) {
            const f = Do(e.sheet);
            f && (Mi(n.serializationContext.serializationStats, "cssText", f.length), (r._cssText = f));
        }
        const o = e;
        if (
            (i === "input" &&
                (o.type === "radio" || o.type === "checkbox") &&
                (t === v.ALLOW ? (r.checked = !!o.checked) : fr(o, t) && delete r.checked),
            i === "audio" || i === "video")
        ) {
            const f = e;
            r.rr_mediaState = f.paused ? "paused" : "played";
        }
        let a, c;
        const u = n.serializationContext;
        switch (u.status) {
            case 0:
                (a = Math.round(e.scrollTop)),
                    (c = Math.round(e.scrollLeft)),
                    (a || c) && u.elementsScrollPositions.set(e, { scrollTop: a, scrollLeft: c });
                break;
            case 1:
                u.elementsScrollPositions.has(e) &&
                    ({ scrollTop: a, scrollLeft: c } = u.elementsScrollPositions.get(e));
                break;
        }
        return c && (r.rr_scrollLeft = c), a && (r.rr_scrollTop = a), r;
    }
    function Do(e) {
        if (!e) return null;
        let t;
        try {
            t = e.rules || e.cssRules;
        } catch {}
        if (!t) return null;
        const n = Array.from(t, uf() ? I0 : kd).join("");
        return y0(n, e.href);
    }
    function I0(e) {
        if (R0(e) && e.selectorText.includes(":")) {
            const t = /(\[[\w-]+[^\\])(:[^\]]+\])/g;
            return e.cssText.replace(t, "$1\\$2");
        }
        return kd(e);
    }
    function kd(e) {
        return (A0(e) && Do(e.styleSheet)) || e.cssText;
    }
    function A0(e) {
        return "styleSheet" in e;
    }
    function R0(e) {
        return "selectorText" in e;
    }
    function Po(e, t) {
        const n = x0(e, t);
        if (!n) return null;
        const r = Ie(e) || k0(),
            i = n;
        return (i.id = r), m0(e, r), t.serializedNodeIds && t.serializedNodeIds.add(r), i;
    }
    let C0 = 1;
    function k0() {
        return C0++;
    }
    function Uo(e, t) {
        const n = [];
        return (
            Kc(e, (r) => {
                const i = Po(r, t);
                i && n.push(i);
            }),
            n
        );
    }
    function x0(e, t) {
        switch (e.nodeType) {
            case e.DOCUMENT_NODE:
                return O0(e, t);
            case e.DOCUMENT_FRAGMENT_NODE:
                return N0(e, t);
            case e.DOCUMENT_TYPE_NODE:
                return L0(e);
            case e.ELEMENT_NODE:
                return M0(e, t);
            case e.TEXT_NODE:
                return P0(e, t);
            case e.CDATA_SECTION_NODE:
                return U0();
        }
    }
    function O0(e, t) {
        return { type: hn.Document, childNodes: Uo(e, t), adoptedStyleSheets: Rd(e.adoptedStyleSheets) };
    }
    function N0(e, t) {
        const n = Rs(e);
        return (
            n && t.serializationContext.shadowRootsController.addShadowRoot(e),
            {
                type: hn.DocumentFragment,
                childNodes: Uo(e, t),
                isShadowRoot: n,
                adoptedStyleSheets: n ? Rd(e.adoptedStyleSheets) : void 0,
            }
        );
    }
    function L0(e) {
        return { type: hn.DocumentType, name: e.name, publicId: e.publicId, systemId: e.systemId };
    }
    function M0(e, t) {
        const n = Td(e.tagName),
            r = D0(e) || void 0,
            i = tu(nu(e), t.parentNodePrivacyLevel);
        if (i === v.HIDDEN) {
            const { width: a, height: c } = e.getBoundingClientRect();
            return {
                type: hn.Element,
                tagName: n,
                attributes: { rr_width: `${a}px`, rr_height: `${c}px`, [xs]: Qg },
                childNodes: [],
                isSVG: r,
            };
        }
        if (i === v.IGNORE) return;
        const s = T0(e, i, t);
        let o = [];
        if ($g(e) && n !== "style") {
            let a;
            t.parentNodePrivacyLevel === i && t.ignoreWhiteSpace === (n === "head")
                ? (a = t)
                : (a = { ...t, parentNodePrivacyLevel: i, ignoreWhiteSpace: n === "head" }),
                (o = Uo(e, a));
        }
        return { type: hn.Element, tagName: n, attributes: s, childNodes: o, isSVG: r };
    }
    function D0(e) {
        return e.tagName === "svg" || e instanceof SVGElement;
    }
    function P0(e, t) {
        const n = iu(e, t.ignoreWhiteSpace || !1, t.parentNodePrivacyLevel);
        if (n !== void 0) return { type: hn.Text, textContent: n };
    }
    function U0() {
        return { type: hn.CDATA, textContent: "" };
    }
    function F0(e, t, n) {
        const r = $(),
            i = Po(e, { serializationContext: n, parentNodePrivacyLevel: t.defaultPrivacyLevel, configuration: t });
        return Mi(n.serializationStats, "serializationDuration", Q(r, $())), i;
    }
    function xd(e) {
        return !!e.changedTouches;
    }
    function vr(e) {
        return e.composed === !0 && ni(e.target) ? e.composedPath()[0] : e.target;
    }
    const Od = 25;
    function $0(e) {
        return (
            Math.abs(e.pageTop - e.offsetTop - window.scrollY) > Od ||
            Math.abs(e.pageLeft - e.offsetLeft - window.scrollX) > Od
        );
    }
    const B0 = (e, t) => {
            const n = window.visualViewport,
                r = { layoutViewportX: e, layoutViewportY: t, visualViewportX: e, visualViewportY: t };
            if (n)
                $0(n)
                    ? ((r.layoutViewportX = Math.round(e + n.offsetLeft)),
                      (r.layoutViewportY = Math.round(t + n.offsetTop)))
                    : ((r.visualViewportX = Math.round(e - n.offsetLeft)),
                      (r.visualViewportY = Math.round(t - n.offsetTop)));
            else return r;
            return r;
        },
        Nd = (e) => ({
            scale: e.scale,
            offsetLeft: e.offsetLeft,
            offsetTop: e.offsetTop,
            pageLeft: e.pageLeft,
            pageTop: e.pageTop,
            height: e.height,
            width: e.width,
        });
    function Ke(e, t) {
        return { data: { source: e, ...t }, type: rt.IncrementalSnapshot, timestamp: $() };
    }
    const V0 = 50;
    function z0(e, t) {
        const { throttled: n, cancel: r } = At(
                (s) => {
                    const o = vr(s);
                    if (nt(o)) {
                        const a = Ld(s);
                        if (!a) return;
                        const c = { id: Ie(o), timeOffset: 0, x: a.x, y: a.y };
                        t(Ke(xd(s) ? Fe.TouchMove : Fe.MouseMove, { positions: [c] }));
                    }
                },
                V0,
                { trailing: !1 }
            ),
            { stop: i } = we(e, document, ["mousemove", "touchmove"], n, { capture: !0, passive: !0 });
        return {
            stop: () => {
                i(), r();
            },
        };
    }
    function Ld(e) {
        let { clientX: t, clientY: n } = xd(e) ? e.changedTouches[0] : e;
        if (window.visualViewport) {
            const { visualViewportX: r, visualViewportY: i } = B0(t, n);
            (t = r), (n = i);
        }
        if (!(!Number.isFinite(t) || !Number.isFinite(n))) return { x: t, y: n };
    }
    const Md = {
        pointerup: We.MouseUp,
        mousedown: We.MouseDown,
        click: We.Click,
        contextmenu: We.ContextMenu,
        dblclick: We.DblClick,
        focus: We.Focus,
        blur: We.Blur,
        touchstart: We.TouchStart,
        touchend: We.TouchEnd,
    };
    function H0(e, t, n) {
        const r = (i) => {
            const s = vr(i);
            if (Ge(s, e.defaultPrivacyLevel) === v.HIDDEN || !nt(s)) return;
            const o = Ie(s),
                a = Md[i.type];
            let c;
            if (a !== We.Blur && a !== We.Focus) {
                const f = Ld(i);
                if (!f) return;
                c = { id: o, type: a, x: f.x, y: f.y };
            } else c = { id: o, type: a };
            const u = { id: n.getIdForEvent(i), ...Ke(Fe.MouseInteraction, c) };
            t(u);
        };
        return we(e, document, Object.keys(Md), r, { capture: !0, passive: !0 });
    }
    const G0 = 100;
    function Dd(e, t, n, r = document) {
        const { throttled: i, cancel: s } = At((a) => {
                const c = vr(a);
                if (!c || Ge(c, e.defaultPrivacyLevel) === v.HIDDEN || !nt(c)) return;
                const u = Ie(c),
                    f =
                        c === document
                            ? { scrollTop: Ds(), scrollLeft: Lu() }
                            : { scrollTop: Math.round(c.scrollTop), scrollLeft: Math.round(c.scrollLeft) };
                n.set(c, f), t(Ke(Fe.Scroll, { id: u, x: f.scrollLeft, y: f.scrollTop }));
            }, G0),
            { stop: o } = J(e, r, "scroll", i, { capture: !0, passive: !0 });
        return {
            stop: () => {
                o(), s();
            },
        };
    }
    const j0 = 200;
    function W0(e, t) {
        const n = Mu(e).subscribe((r) => {
            t(Ke(Fe.ViewportResize, r));
        });
        return {
            stop: () => {
                n.unsubscribe();
            },
        };
    }
    function K0(e, t) {
        const n = window.visualViewport;
        if (!n) return { stop: N };
        const { throttled: r, cancel: i } = At(
                () => {
                    t({ data: Nd(n), type: rt.VisualViewport, timestamp: $() });
                },
                j0,
                { trailing: !1 }
            ),
            { stop: s } = we(e, n, ["resize", "scroll"], r, { capture: !0, passive: !0 });
        return {
            stop: () => {
                s(), i();
            },
        };
    }
    function q0(e, t) {
        return we(
            e,
            document,
            ["play", "pause"],
            (n) => {
                const r = vr(n);
                !r ||
                    Ge(r, e.defaultPrivacyLevel) === v.HIDDEN ||
                    !nt(r) ||
                    t(Ke(Fe.MediaInteraction, { id: Ie(r), type: n.type === "play" ? Ad.Play : Ad.Pause }));
            },
            { capture: !0, passive: !0 }
        );
    }
    function Y0(e) {
        function t(i, s) {
            i && nt(i.ownerNode) && s(Ie(i.ownerNode));
        }
        const n = [
            Te(CSSStyleSheet.prototype, "insertRule", ({ target: i, parameters: [s, o] }) => {
                t(i, (a) => e(Ke(Fe.StyleSheetRule, { id: a, adds: [{ rule: s, index: o }] })));
            }),
            Te(CSSStyleSheet.prototype, "deleteRule", ({ target: i, parameters: [s] }) => {
                t(i, (o) => e(Ke(Fe.StyleSheetRule, { id: o, removes: [{ index: s }] })));
            }),
        ];
        typeof CSSGroupingRule < "u" ? r(CSSGroupingRule) : (r(CSSMediaRule), r(CSSSupportsRule));
        function r(i) {
            n.push(
                Te(i.prototype, "insertRule", ({ target: s, parameters: [o, a] }) => {
                    t(s.parentStyleSheet, (c) => {
                        const u = Pd(s);
                        u && (u.push(a || 0), e(Ke(Fe.StyleSheetRule, { id: c, adds: [{ rule: o, index: u }] })));
                    });
                }),
                Te(i.prototype, "deleteRule", ({ target: s, parameters: [o] }) => {
                    t(s.parentStyleSheet, (a) => {
                        const c = Pd(s);
                        c && (c.push(o), e(Ke(Fe.StyleSheetRule, { id: a, removes: [{ index: c }] })));
                    });
                })
            );
        }
        return {
            stop: () => {
                n.forEach((i) => i.stop());
            },
        };
    }
    function Pd(e) {
        const t = [];
        let n = e;
        for (; n.parentRule; ) {
            const o = Array.from(n.parentRule.cssRules).indexOf(n);
            t.unshift(o), (n = n.parentRule);
        }
        if (!n.parentStyleSheet) return;
        const i = Array.from(n.parentStyleSheet.cssRules).indexOf(n);
        return t.unshift(i), t;
    }
    function X0(e, t) {
        return we(e, window, ["focus", "blur"], () => {
            t({ data: { has_focus: document.hasFocus() }, type: rt.Focus, timestamp: $() });
        });
    }
    function J0(e, t, n) {
        const r = e.subscribe(12, (i) => {
            var s, o;
            i.rawRumEvent.type === C.ACTION &&
                i.rawRumEvent.action.type === ti.CLICK &&
                !(
                    (o = (s = i.rawRumEvent.action.frustration) === null || s === void 0 ? void 0 : s.type) === null ||
                    o === void 0
                ) &&
                o.length &&
                "events" in i.domainContext &&
                i.domainContext.events &&
                i.domainContext.events.length &&
                t({
                    timestamp: i.rawRumEvent.date,
                    type: rt.FrustrationRecord,
                    data: {
                        frustrationTypes: i.rawRumEvent.action.frustration.type,
                        recordIds: i.domainContext.events.map((a) => n.getIdForEvent(a)),
                    },
                });
        });
        return {
            stop: () => {
                r.unsubscribe();
            },
        };
    }
    function Z0(e, t) {
        const n = e.subscribe(5, () => {
            t({ timestamp: $(), type: rt.ViewEnd });
        });
        return {
            stop: () => {
                n.unsubscribe();
            },
        };
    }
    function Ud(e, t, n = document) {
        const r = e.defaultPrivacyLevel,
            i = new WeakMap(),
            s = n !== document,
            { stop: o } = we(
                e,
                n,
                s ? ["change"] : ["input", "change"],
                (f) => {
                    const l = vr(f);
                    (l instanceof HTMLInputElement ||
                        l instanceof HTMLTextAreaElement ||
                        l instanceof HTMLSelectElement) &&
                        c(l);
                },
                { capture: !0, passive: !0 }
            );
        let a;
        if (s) a = N;
        else {
            const f = [
                rr(HTMLInputElement.prototype, "value", c),
                rr(HTMLInputElement.prototype, "checked", c),
                rr(HTMLSelectElement.prototype, "value", c),
                rr(HTMLTextAreaElement.prototype, "value", c),
                rr(HTMLSelectElement.prototype, "selectedIndex", c),
            ];
            a = () => {
                f.forEach((l) => l.stop());
            };
        }
        return {
            stop: () => {
                a(), o();
            },
        };
        function c(f) {
            const l = Ge(f, r);
            if (l === v.HIDDEN) return;
            const d = f.type;
            let p;
            if (d === "radio" || d === "checkbox") {
                if (fr(f, l)) return;
                p = { isChecked: f.checked };
            } else {
                const m = Lo(f, l);
                if (m === void 0) return;
                p = { text: m };
            }
            u(f, p);
            const h = f.name;
            d === "radio" &&
                h &&
                f.checked &&
                document.querySelectorAll(`input[type="radio"][name="${CSS.escape(h)}"]`).forEach((m) => {
                    m !== f && u(m, { isChecked: !1 });
                });
        }
        function u(f, l) {
            if (!nt(f)) return;
            const d = i.get(f);
            (!d || d.text !== l.text || d.isChecked !== l.isChecked) &&
                (i.set(f, l), t(Ke(Fe.Input, { id: Ie(f), ...l })));
        }
    }
    const Q0 = 100,
        eI = 16;
    function tI(e) {
        let t = N,
            n = [];
        function r() {
            t(), e(n), (n = []);
        }
        const { throttled: i, cancel: s } = At(r, eI, { leading: !1 });
        return {
            addMutations: (o) => {
                n.length === 0 && (t = uc(i, { timeout: Q0 })), n.push(...o);
            },
            flush: r,
            stop: () => {
                t(), s();
            },
        };
    }
    function Fd(e, t, n, r) {
        const i = Pc();
        if (!i) return { stop: N, flush: N };
        const s = tI((a) => {
                nI(a.concat(o.takeRecords()), e, t, n);
            }),
            o = new i(S(s.addMutations));
        return (
            o.observe(r, {
                attributeOldValue: !0,
                attributes: !0,
                characterData: !0,
                characterDataOldValue: !0,
                childList: !0,
                subtree: !0,
            }),
            {
                stop: () => {
                    o.disconnect(), s.stop();
                },
                flush: () => {
                    s.flush();
                },
            }
        );
    }
    function nI(e, t, n, r) {
        const i = new Map();
        e.filter((d) => d.type === "childList").forEach((d) => {
            d.removedNodes.forEach((p) => {
                $d(p, r.removeShadowRoot);
            });
        });
        const s = e.filter(
                (d) => d.target.isConnected && h0(d.target) && Ge(d.target, n.defaultPrivacyLevel, i) !== v.HIDDEN
            ),
            o = Mo(),
            {
                adds: a,
                removes: c,
                hasBeenSerialized: u,
            } = rI(
                s.filter((d) => d.type === "childList"),
                n,
                o,
                r,
                i
            ),
            f = iI(
                s.filter((d) => d.type === "characterData" && !u(d.target)),
                n,
                i
            ),
            l = sI(
                s.filter((d) => d.type === "attributes" && !u(d.target)),
                n,
                i
            );
        (!f.length && !l.length && !c.length && !a.length) ||
            t(Ke(Fe.Mutation, { adds: a, removes: c, texts: f, attributes: l }), o);
    }
    function rI(e, t, n, r, i) {
        const s = new Set(),
            o = new Map();
        for (const h of e)
            h.addedNodes.forEach((m) => {
                s.add(m);
            }),
                h.removedNodes.forEach((m) => {
                    s.has(m) || o.set(m, h.target), s.delete(m);
                });
        const a = Array.from(s);
        oI(a);
        const c = new Set(),
            u = { status: 2, serializationStats: n, shadowRootsController: r },
            f = [];
        for (const h of a) {
            if (d(h)) continue;
            const m = Ge(h.parentNode, t.defaultPrivacyLevel, i);
            if (m === v.HIDDEN || m === v.IGNORE) continue;
            const g = $(),
                w = Po(h, {
                    serializedNodeIds: c,
                    parentNodePrivacyLevel: m,
                    serializationContext: u,
                    configuration: t,
                });
            if ((Mi(n, "serializationDuration", Q(g, $())), !w)) continue;
            const b = ri(h);
            f.push({ nextId: p(h), parentId: Ie(b), node: w });
        }
        const l = [];
        return (
            o.forEach((h, m) => {
                nt(m) && l.push({ parentId: Ie(h), id: Ie(m) });
            }),
            { adds: f, removes: l, hasBeenSerialized: d }
        );
        function d(h) {
            return nt(h) && c.has(Ie(h));
        }
        function p(h) {
            let m = h.nextSibling;
            for (; m; ) {
                if (nt(m)) return Ie(m);
                m = m.nextSibling;
            }
            return null;
        }
    }
    function iI(e, t, n) {
        var r;
        const i = [],
            s = new Set(),
            o = e.filter((a) => (s.has(a.target) ? !1 : (s.add(a.target), !0)));
        for (const a of o) {
            if (a.target.textContent === a.oldValue) continue;
            const u = Ge(ri(a.target), t.defaultPrivacyLevel, n);
            u === v.HIDDEN ||
                u === v.IGNORE ||
                i.push({ id: Ie(a.target), value: (r = iu(a.target, !1, u)) !== null && r !== void 0 ? r : null });
        }
        return i;
    }
    function sI(e, t, n) {
        const r = [],
            i = new Map(),
            s = e.filter((a) => {
                const c = i.get(a.target);
                return c && c.has(a.attributeName)
                    ? !1
                    : (c ? c.add(a.attributeName) : i.set(a.target, new Set([a.attributeName])), !0);
            }),
            o = new Map();
        for (const a of s) {
            if (a.target.getAttribute(a.attributeName) === a.oldValue) continue;
            const u = Ge(a.target, t.defaultPrivacyLevel, n),
                f = Cd(a.target, u, a.attributeName, t);
            let l;
            if (a.attributeName === "value") {
                const p = Lo(a.target, u);
                if (p === void 0) continue;
                l = p;
            } else typeof f == "string" ? (l = f) : (l = null);
            let d = o.get(a.target);
            d || ((d = { id: Ie(a.target), attributes: {} }), r.push(d), o.set(a.target, d)),
                (d.attributes[a.attributeName] = l);
        }
        return r;
    }
    function oI(e) {
        e.sort((t, n) => {
            const r = t.compareDocumentPosition(n);
            return r & Node.DOCUMENT_POSITION_CONTAINED_BY
                ? -1
                : r & Node.DOCUMENT_POSITION_CONTAINS || r & Node.DOCUMENT_POSITION_FOLLOWING
                  ? 1
                  : r & Node.DOCUMENT_POSITION_PRECEDING
                    ? -1
                    : 0;
        });
    }
    function $d(e, t) {
        ni(e) && t(e.shadowRoot), Kc(e, (n) => $d(n, t));
    }
    function aI() {
        const e = new WeakMap();
        return {
            set(t, n) {
                (t === document && !document.scrollingElement) ||
                    e.set(t === document ? document.scrollingElement : t, n);
            },
            get(t) {
                return e.get(t);
            },
            has(t) {
                return e.has(t);
            },
        };
    }
    const cI = (e, t, n) => {
        const r = new Map(),
            i = {
                addShadowRoot: (s) => {
                    if (r.has(s)) return;
                    const o = Fd(t, e, i, s),
                        a = Ud(e, t, s),
                        c = Dd(e, t, n, s);
                    r.set(s, {
                        flush: () => o.flush(),
                        stop: () => {
                            o.stop(), a.stop(), c.stop();
                        },
                    });
                },
                removeShadowRoot: (s) => {
                    const o = r.get(s);
                    o && (o.stop(), r.delete(s));
                },
                stop: () => {
                    r.forEach(({ stop: s }) => s());
                },
                flush: () => {
                    r.forEach(({ flush: s }) => s());
                },
            };
        return i;
    };
    function uI(e, t, n, r, i, s) {
        const o = (c, u) => {
            const { width: f, height: l } = ui();
            s({ data: { height: l, href: window.location.href, width: f }, type: rt.Meta, timestamp: c }),
                s({ data: { has_focus: document.hasFocus() }, type: rt.Focus, timestamp: c });
            const d = Mo();
            s(
                {
                    data: {
                        node: F0(document, r, {
                            status: u,
                            elementsScrollPositions: e,
                            serializationStats: d,
                            shadowRootsController: t,
                        }),
                        initialOffset: { left: Lu(), top: Ds() },
                    },
                    type: rt.FullSnapshot,
                    timestamp: c,
                },
                d
            ),
                window.visualViewport && s({ data: Nd(window.visualViewport), type: rt.VisualViewport, timestamp: c });
        };
        o($(), 0);
        const { unsubscribe: a } = n.subscribe(2, (c) => {
            i(), o(c.startClocks.timeStamp, 1);
        });
        return { stop: a };
    }
    function lI() {
        const e = new WeakMap();
        let t = 1;
        return {
            getIdForEvent(n) {
                return e.has(n) || e.set(n, t++), e.get(n);
            },
        };
    }
    function dI(e) {
        const { emit: t, configuration: n, lifeCycle: r } = e;
        if (!t) throw new Error("emit function is required");
        const i = (d, p) => {
                t(d, p), Hr("record", { record: d });
                const h = e.viewHistory.findView();
                Ky(h.id);
            },
            s = aI(),
            o = cI(n, i, s),
            { stop: a } = uI(s, o, r, n, c, i);
        function c() {
            o.flush(), f.flush();
        }
        const u = lI(),
            f = Fd(i, n, o, document),
            l = [
                f,
                z0(n, i),
                H0(n, i, u),
                Dd(n, i, s, document),
                W0(n, i),
                Ud(n, i),
                q0(n, i),
                Y0(i),
                X0(n, i),
                K0(n, i),
                J0(r, i, u),
                Z0(r, (d) => {
                    c(), i(d);
                }),
            ];
        return {
            stop: () => {
                o.stop(), l.forEach((d) => d.stop()), a();
            },
            flushMutations: c,
            shadowRootsController: o,
        };
    }
    function fI(e, t, n, r) {
        const i = new FormData();
        i.append("segment", new Blob([e], { type: "application/octet-stream" }), `${t.session.id}-${t.start}`);
        const s = { raw_segment_size: r, compressed_segment_size: e.byteLength, ...t },
            o = JSON.stringify(s);
        return (
            i.append("event", new Blob([o], { type: "application/json" })),
            {
                data: i,
                bytesCount: e.byteLength,
                cssText: n.cssText,
                isFullSnapshot: t.index_in_view === 0,
                rawSize: r,
                recordCount: t.records_count,
                serializationDuration: n.serializationDuration,
            }
        );
    }
    function pI({ context: e, creationReason: t, encoder: n }) {
        let r = 0;
        const i = e.view.id,
            s = jy(i),
            o = {
                start: 1 / 0,
                end: -1 / 0,
                creation_reason: t,
                records_count: 0,
                has_full_snapshot: !1,
                index_in_view: s,
                source: "browser",
                ...e,
            },
            a = Mo();
        Wy(i);
        function c(f, l, d) {
            (o.start = Math.min(o.start, f.timestamp)),
                (o.end = Math.max(o.end, f.timestamp)),
                (o.records_count += 1),
                o.has_full_snapshot || (o.has_full_snapshot = f.type === rt.FullSnapshot),
                l && w0(a, l);
            const p = n.isEmpty ? '{"records":[' : ",";
            n.write(p + JSON.stringify(f), (h) => {
                (r += h), d(r);
            });
        }
        function u(f) {
            if (n.isEmpty) throw new Error("Empty segment flushed");
            n.write(`],${JSON.stringify(o).slice(1)}
`),
                n.finish((l) => {
                    qy(o.view.id, l.rawBytesCount), f(o, a, l);
                });
        }
        return { addRecord: c, flush: u };
    }
    const hI = 5 * ue;
    let Bd = 6e4;
    function mI(e, t, n, r, i, s) {
        return gI(e, () => _I(t.applicationId, n, r), i, s);
    }
    function gI(e, t, n, r) {
        let i = { status: 0, nextSegmentCreationReason: "init" };
        const { unsubscribe: s } = e.subscribe(2, () => {
                a("view_change");
            }),
            { unsubscribe: o } = e.subscribe(11, (c) => {
                a(c.reason);
            });
        function a(c) {
            i.status === 1 &&
                (i.segment.flush((u, f, l) => {
                    const d = fI(l.output, u, f, l.rawBytesCount);
                    Ba(c) ? n.sendOnExit(d) : n.send(d);
                }),
                Se(i.expirationTimeoutId)),
                c !== "stop" ? (i = { status: 0, nextSegmentCreationReason: c }) : (i = { status: 2 });
        }
        return {
            addRecord: (c, u) => {
                if (i.status !== 2) {
                    if (i.status === 0) {
                        const f = t();
                        if (!f) return;
                        i = {
                            status: 1,
                            segment: pI({ encoder: r, context: f, creationReason: i.nextSegmentCreationReason }),
                            expirationTimeoutId: ae(() => {
                                a("segment_duration_limit");
                            }, hI),
                        };
                    }
                    i.segment.addRecord(c, u, (f) => {
                        f > Bd && a("segment_bytes_limit");
                    });
                }
            },
            stop: () => {
                a("stop"), s(), o();
            },
        };
    }
    function _I(e, t, n) {
        const r = t.findTrackedSession(),
            i = n.findView();
        if (!(!r || !i)) return { application: { id: e }, session: { id: r.id }, view: { id: i.id } };
    }
    function bI(e, t) {
        if (!e.metricsEnabled) return { stop: N };
        const { unsubscribe: n } = t.subscribe((r) => {
            if (r.type === "failure" || r.type === "queue-full" || (r.type === "success" && r.payload.isFullSnapshot)) {
                const i = yI(r.type, r.bandwidth, r.payload);
                nr("Segment network request metrics", { metrics: i });
            }
        });
        return { stop: n };
    }
    function yI(e, t, n) {
        return {
            cssText: { count: n.cssText.count, max: n.cssText.max, sum: n.cssText.sum },
            isFullSnapshot: n.isFullSnapshot,
            ongoingRequests: { count: t.ongoingRequestCount, totalSize: t.ongoingByteCount },
            recordCount: n.recordCount,
            result: e,
            serializationDuration: {
                count: n.serializationDuration.count,
                max: n.serializationDuration.max,
                sum: n.serializationDuration.sum,
            },
            size: { compressed: n.bytesCount, raw: n.rawSize },
        };
    }
    function EI(e) {
        const t = Jt();
        return {
            addRecord: (n) => {
                const r = e.findView();
                t.send("record", n, r.id);
            },
        };
    }
    function SI(e, t, n, r, i, s, o) {
        const a = [],
            c = (d) => {
                e.notify(14, { error: d }), dt("Error reported to customer", { "error.message": d.message });
            },
            u = o || Wr([t.sessionReplayEndpointBuilder], Bd, c);
        let f;
        if (Je()) ({ addRecord: f } = EI(r));
        else {
            const d = mI(e, t, n, r, u, i);
            (f = d.addRecord), a.push(d.stop);
            const p = bI(s, u.observable);
            a.push(p.stop);
        }
        const { stop: l } = dI({ emit: f, configuration: t, lifeCycle: e, viewHistory: r });
        return (
            a.push(l),
            {
                stop: () => {
                    a.forEach((d) => d());
                },
            }
        );
    }
    const vI = Object.freeze(
        Object.defineProperty({ __proto__: null, startRecording: SI }, Symbol.toStringTag, { value: "Module" })
    );
    function wI(e) {
        let t = 0;
        for (const n of e) n.stackId !== void 0 && t++;
        return t;
    }
    const Di = new Map();
    function TI(e, t) {
        Di.set(t, e);
    }
    function II(e) {
        return Di.get(e);
    }
    function Vd(e) {
        for (const t of Di.keys()) t < e && Di.delete(t);
    }
    function AI({ rawRumEvent: e, startTime: t }) {
        if (e.type !== C.LONG_TASK) return;
        const n = e.long_task.id;
        TI(n, t);
    }
    function RI(e, t, n) {
        const r = { application: { id: t } };
        n && (r.session = { id: n });
        const { ids: i, names: s } = CI(e.views);
        i.length && (r.view = { id: i, name: s });
        const o = e.longTasks.map((a) => a.id).filter((a) => a !== void 0);
        return o.length && (r.long_task = { id: o }), r;
    }
    function CI(e) {
        const t = { ids: [], names: [] };
        for (const n of e) t.ids.push(n.viewId), n.viewName && t.names.push(n.viewName);
        return (t.names = Array.from(new Set(t.names))), t;
    }
    const kI = (e, t, n) => {
        const { profilingEndpointBuilder: r, applicationId: i } = t,
            s = xI(e, t, n),
            o = NI(e, s),
            a = r.build("fetch", o);
        return (
            dt("Sending profile to public profiling intake", { profilingIntakeURL: a, applicationId: i, sessionId: n }),
            fetch(a, { body: o.data, method: "POST" })
        );
    };
    function xI(e, t, n) {
        const r = zr(t),
            i = RI(e, t.applicationId, n),
            s = OI(r);
        return {
            ...i,
            attachments: ["wall-time.json"],
            start: new Date(e.startClocks.timeStamp).toISOString(),
            end: new Date(e.endClocks.timeStamp).toISOString(),
            family: "chrome",
            runtime: "chrome",
            format: "json",
            version: 4,
            tags_profiler: s.join(","),
            _dd: { clock_drift: Go() },
        };
    }
    function OI(e) {
        return e.concat(["language:javascript", "runtime:chrome", "family:chrome", "host:browser"]);
    }
    function NI(e, t) {
        const n = new Blob([JSON.stringify(e)], { type: "application/json" }),
            r = new FormData();
        return (
            r.append("event", new Blob([JSON.stringify(t)], { type: "application/json" }), "event.json"),
            r.append("wall-time.json", n, "wall-time.json"),
            { data: r, bytesCount: 0 }
        );
    }
    const LI = { sendProfile: kI },
        MI = /\/(?![vV]\d{1,2}\/)([^/\d?]*\d+[^/?]*)/g;
    function DI(e) {
        return e ? e.replace(MI, "/?") : "/";
    }
    const zd = (e, t) => e || DI(t),
        Hd = { sampleIntervalMs: 10, collectIntervalMs: 6e4, minProfileDurationMs: 5e3, minNumberOfSamples: 50 };
    function PI(e, t, n, r, i = Hd) {
        const s = xt(F.LONG_ANIMATION_FRAME);
        let o;
        const a = [];
        let c = { state: "stopped" };
        function u(L) {
            c.state !== "running" &&
                ((o = L
                    ? { startClocks: L.startClocks, viewId: L.id, viewName: zd(L.name, document.location.pathname) }
                    : void 0),
                a.push(J(e, window, "visibilitychange", y).stop, J(e, window, "beforeunload", T).stop),
                d());
        }
        async function f() {
            await h("stopped"),
                a.forEach((L) => L()),
                Vd(ne().relative),
                r.set({ status: "stopped", error_reason: void 0 });
        }
        function l(L) {
            if (L.state === "running") return { cleanupTasks: L.cleanupTasks, observer: L.observer };
            const W = [];
            let K;
            if (e.trackLongTasks) {
                (K = new PerformanceObserver(b)), K.observe({ entryTypes: [_()] });
                const ce = t.subscribe(12, (ye) => {
                    AI(ye);
                });
                W.push(() => K?.disconnect()), W.push(ce.unsubscribe);
            }
            const ie = t.subscribe(2, (ce) => {
                const ye = {
                    viewId: ce.id,
                    viewName: zd(ce.name, document.location.pathname),
                    startClocks: ce.startClocks,
                };
                m(ye), (o = ye);
            });
            return W.push(ie.unsubscribe), { cleanupTasks: W, observer: K };
        }
        function d() {
            const L = Ee().Profiler;
            if (!L)
                throw (
                    (r.set({ status: "error", error_reason: "not-supported-by-browser" }),
                    new Error("RUM Profiler is not supported in this browser."))
                );
            p(c).catch(ze);
            const { cleanupTasks: W, observer: K } = l(c);
            let ie;
            try {
                ie = new L({
                    sampleInterval: i.sampleIntervalMs,
                    maxBufferSize: Math.round((i.collectIntervalMs * 1.5) / i.sampleIntervalMs),
                });
            } catch (ce) {
                ce instanceof Error && ce.message.includes("disabled by Document Policy")
                    ? (I.warn(
                          "[DD_RUM] Profiler startup failed. Ensure your server includes the `Document-Policy: js-profiling` response header when serving HTML pages.",
                          ce
                      ),
                      r.set({ status: "error", error_reason: "missing-document-policy-header" }))
                    : r.set({ status: "error", error_reason: "unexpected-exception" });
                return;
            }
            r.set({ status: "running", error_reason: void 0 }),
                (c = {
                    state: "running",
                    startClocks: ne(),
                    profiler: ie,
                    timeoutId: ae(d, i.collectIntervalMs),
                    longTasks: [],
                    views: [],
                    cleanupTasks: W,
                    observer: K,
                }),
                m(o),
                ie.addEventListener("samplebufferfull", w);
        }
        async function p(L) {
            var W, K;
            if (L.state !== "running") return;
            E(
                (K = (W = L.observer) === null || W === void 0 ? void 0 : W.takeRecords()) !== null && K !== void 0
                    ? K
                    : []
            ),
                Se(L.timeoutId),
                L.profiler.removeEventListener("samplebufferfull", w);
            const { startClocks: ie, longTasks: ce, views: ye } = L,
                it = ne();
            await L.profiler
                .stop()
                .then((vt) => {
                    const Ye = ne(),
                        Ae = ce.length > 0,
                        xe = Q(ie.timeStamp, Ye.timeStamp) < i.minProfileDurationMs,
                        se = wI(vt.samples) < i.minNumberOfSamples;
                    (!Ae && (xe || se)) ||
                        (g(
                            Object.assign(vt, {
                                startClocks: ie,
                                endClocks: Ye,
                                clocksOrigin: Bi(),
                                longTasks: ce,
                                views: ye,
                                sampleInterval: i.sampleIntervalMs,
                            })
                        ),
                        Vd(it.relative));
                })
                .catch(ze);
        }
        async function h(L) {
            c.state === "running" && (c.cleanupTasks.forEach((W) => W()), await p(c), (c = { state: L }));
        }
        function m(L) {
            c.state !== "running" || !L || c.views.push(L);
        }
        function g(L) {
            var W;
            const K = (W = n.findTrackedSession()) === null || W === void 0 ? void 0 : W.id;
            LI.sendProfile(L, e, K).catch(ze);
        }
        function w() {
            d();
        }
        function b(L) {
            E(L.getEntries());
        }
        function E(L) {
            if (c.state === "running")
                for (const W of L) {
                    if (W.duration < i.sampleIntervalMs) continue;
                    const K = Kn(W.startTime),
                        ie = II(K.relative);
                    c.longTasks.push({ id: ie, duration: W.duration, entryType: W.entryType, startClocks: K });
                }
        }
        function y() {
            document.visibilityState === "hidden" && c.state === "running"
                ? h("paused").catch(ze)
                : document.visibilityState === "visible" && c.state === "paused" && d();
        }
        function T() {
            d();
        }
        function _() {
            return s ? "long-animation-frame" : "longtask";
        }
        function M() {
            return c.state === "stopped";
        }
        function $e() {
            return c.state === "running";
        }
        function qe() {
            return c.state === "paused";
        }
        return { start: u, stop: f, isStopped: M, isRunning: $e, isPaused: qe };
    }
    const UI = Object.freeze(
        Object.defineProperty(
            { __proto__: null, DEFAULT_RUM_PROFILER_CONFIGURATION: Hd, createRumProfiler: PI },
            Symbol.toStringTag,
            { value: "Module" }
        )
    );
});
//# sourceMappingURL=offscreen.js.map
