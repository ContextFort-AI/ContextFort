try {
  let e = typeof window < "u" ? window : typeof global < "u" ? global : typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : {}, t = new e.Error().stack;
  t && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[t] = "d7ee6132-0e94-4e2f-9a0e-677a0da2e7c1", e._sentryDebugIdIdentifier = "sentry-dbid-d7ee6132-0e94-4e2f-9a0e-677a0da2e7c1");
} catch {
}
const Tm = "entropy-agent-extension-main", vm = "__", Ed = "pplx-agent-", Sd = "/mobilebasic", fe = typeof __SENTRY_DEBUG__ > "u" || __SENTRY_DEBUG__, Ln = "8.47.0", se = globalThis;
function Vo(e, t, n) {
  const r = n || se, s = r.__SENTRY__ = r.__SENTRY__ || {}, o = s[Ln] = s[Ln] || {};
  return o[e] || (o[e] = t());
}
const zn = typeof __SENTRY_DEBUG__ > "u" || __SENTRY_DEBUG__, Im = "Sentry Logger ", na = [
  "debug",
  "info",
  "warn",
  "error",
  "log",
  "assert",
  "trace"
], bo = {};
function Kn(e) {
  if (!("console" in se))
    return e();
  const t = se.console, n = {}, r = Object.keys(bo);
  r.forEach((s) => {
    const o = bo[s];
    n[s] = t[s], t[s] = o;
  });
  try {
    return e();
  } finally {
    r.forEach((s) => {
      t[s] = n[s];
    });
  }
}
function km() {
  let e = !1;
  const t = {
    enable: () => {
      e = !0;
    },
    disable: () => {
      e = !1;
    },
    isEnabled: () => e
  };
  return zn ? na.forEach((n) => {
    t[n] = (...r) => {
      e && Kn(() => {
        se.console[n](`${Im}[${n}]:`, ...r);
      });
    };
  }) : na.forEach((n) => {
    t[n] = () => {
    };
  }), t;
}
const V = Vo("logger", km), Td = 50, Mn = "?", nu = /\(error: (.*)\)/, ru = /captureMessage|captureException/;
function vd(...e) {
  const t = e.sort((n, r) => n[0] - r[0]).map((n) => n[1]);
  return (n, r = 0, s = 0) => {
    const o = [], i = n.split(`
`);
    for (let a = r; a < i.length; a++) {
      const c = i[a];
      if (c.length > 1024)
        continue;
      const u = nu.test(c) ? c.replace(nu, "$1") : c;
      if (!u.match(/\S*Error: /)) {
        for (const f of t) {
          const l = f(u);
          if (l) {
            o.push(l);
            break;
          }
        }
        if (o.length >= Td + s)
          break;
      }
    }
    return Am(o.slice(s));
  };
}
function Cm(e) {
  return Array.isArray(e) ? vd(...e) : e;
}
function Am(e) {
  if (!e.length)
    return [];
  const t = Array.from(e);
  return /sentryWrapped/.test(Fs(t).function || "") && t.pop(), t.reverse(), ru.test(Fs(t).function || "") && (t.pop(), ru.test(Fs(t).function || "") && t.pop()), t.slice(0, Td).map((n) => ({
    ...n,
    filename: n.filename || Fs(t).filename,
    function: n.function || Mn
  }));
}
function Fs(e) {
  return e[e.length - 1] || {};
}
const Ei = "<anonymous>";
function cn(e) {
  try {
    return !e || typeof e != "function" ? Ei : e.name || Ei;
  } catch {
    return Ei;
  }
}
function su(e) {
  const t = e.exception;
  if (t) {
    const n = [];
    try {
      return t.values.forEach((r) => {
        r.stacktrace.frames && n.push(...r.stacktrace.frames);
      }), n;
    } catch {
      return;
    }
  }
}
const so = {}, ou = {};
function jn(e, t) {
  so[e] = so[e] || [], so[e].push(t);
}
function qn(e, t) {
  if (!ou[e]) {
    ou[e] = !0;
    try {
      t();
    } catch (n) {
      zn && V.error(`Error while instrumenting ${e}`, n);
    }
  }
}
function pt(e, t) {
  const n = e && so[e];
  if (n)
    for (const r of n)
      try {
        r(t);
      } catch (s) {
        zn && V.error(
          `Error while triggering instrumentation handler.
Type: ${e}
Name: ${cn(r)}
Error:`,
          s
        );
      }
}
let Si = null;
function Rm(e) {
  const t = "error";
  jn(t, e), qn(t, xm);
}
function xm() {
  Si = se.onerror, se.onerror = function(e, t, n, r, s) {
    return pt("error", {
      column: r,
      error: s,
      line: n,
      msg: e,
      url: t
    }), Si ? Si.apply(this, arguments) : !1;
  }, se.onerror.__SENTRY_INSTRUMENTED__ = !0;
}
let Ti = null;
function Om(e) {
  const t = "unhandledrejection";
  jn(t, e), qn(t, Lm);
}
function Lm() {
  Ti = se.onunhandledrejection, se.onunhandledrejection = function(e) {
    return pt("unhandledrejection", e), Ti ? Ti.apply(this, arguments) : !0;
  }, se.onunhandledrejection.__SENTRY_INSTRUMENTED__ = !0;
}
function Wo() {
  return Qa(se), se;
}
function Qa(e) {
  const t = e.__SENTRY__ = e.__SENTRY__ || {};
  return t.version = t.version || Ln, t[Ln] = t[Ln] || {};
}
const Id = Object.prototype.toString;
function ec(e) {
  switch (Id.call(e)) {
    case "[object Error]":
    case "[object Exception]":
    case "[object DOMException]":
    case "[object WebAssembly.Exception]":
      return !0;
    default:
      return Pn(e, Error);
  }
}
function xr(e, t) {
  return Id.call(e) === `[object ${t}]`;
}
function kd(e) {
  return xr(e, "ErrorEvent");
}
function iu(e) {
  return xr(e, "DOMError");
}
function Nm(e) {
  return xr(e, "DOMException");
}
function Ft(e) {
  return xr(e, "String");
}
function tc(e) {
  return typeof e == "object" && e !== null && "__sentry_template_string__" in e && "__sentry_template_values__" in e;
}
function nc(e) {
  return e === null || tc(e) || typeof e != "object" && typeof e != "function";
}
function Er(e) {
  return xr(e, "Object");
}
function Ho(e) {
  return typeof Event < "u" && Pn(e, Event);
}
function Mm(e) {
  return typeof Element < "u" && Pn(e, Element);
}
function Pm(e) {
  return xr(e, "RegExp");
}
function Go(e) {
  return !!(e && e.then && typeof e.then == "function");
}
function Dm(e) {
  return Er(e) && "nativeEvent" in e && "preventDefault" in e && "stopPropagation" in e;
}
function Pn(e, t) {
  try {
    return e instanceof t;
  } catch {
    return !1;
  }
}
function Cd(e) {
  return !!(typeof e == "object" && e !== null && (e.__isVue || e._isVue));
}
const rc = se, Um = 80;
function Ad(e, t = {}) {
  if (!e)
    return "<unknown>";
  try {
    let n = e;
    const r = 5, s = [];
    let o = 0, i = 0;
    const a = " > ", c = a.length;
    let u;
    const f = Array.isArray(t) ? t : t.keyAttrs, l = !Array.isArray(t) && t.maxStringLength || Um;
    for (; n && o++ < r && (u = Fm(n, f), !(u === "html" || o > 1 && i + s.length * c + u.length >= l)); )
      s.push(u), i += u.length, n = n.parentNode;
    return s.reverse().join(a);
  } catch {
    return "<unknown>";
  }
}
function Fm(e, t) {
  const n = e, r = [];
  if (!n || !n.tagName)
    return "";
  if (rc.HTMLElement && n instanceof HTMLElement && n.dataset) {
    if (n.dataset.sentryComponent)
      return n.dataset.sentryComponent;
    if (n.dataset.sentryElement)
      return n.dataset.sentryElement;
  }
  r.push(n.tagName.toLowerCase());
  const s = t && t.length ? t.filter((i) => n.getAttribute(i)).map((i) => [i, n.getAttribute(i)]) : null;
  if (s && s.length)
    s.forEach((i) => {
      r.push(`[${i[0]}="${i[1]}"]`);
    });
  else {
    n.id && r.push(`#${n.id}`);
    const i = n.className;
    if (i && Ft(i)) {
      const a = i.split(/\s+/);
      for (const c of a)
        r.push(`.${c}`);
    }
  }
  const o = ["aria-label", "type", "name", "title", "alt"];
  for (const i of o) {
    const a = n.getAttribute(i);
    a && r.push(`[${i}="${a}"]`);
  }
  return r.join("");
}
function $m() {
  try {
    return rc.document.location.href;
  } catch {
    return "";
  }
}
function Bm(e) {
  if (!rc.HTMLElement)
    return null;
  let t = e;
  const n = 5;
  for (let r = 0; r < n; r++) {
    if (!t)
      return null;
    if (t instanceof HTMLElement) {
      if (t.dataset.sentryComponent)
        return t.dataset.sentryComponent;
      if (t.dataset.sentryElement)
        return t.dataset.sentryElement;
    }
    t = t.parentNode;
  }
  return null;
}
function gr(e, t = 0) {
  return typeof e != "string" || t === 0 || e.length <= t ? e : `${e.slice(0, t)}...`;
}
function au(e, t) {
  if (!Array.isArray(e))
    return "";
  const n = [];
  for (let r = 0; r < e.length; r++) {
    const s = e[r];
    try {
      Cd(s) ? n.push("[VueViewModel]") : n.push(String(s));
    } catch {
      n.push("[value cannot be serialized]");
    }
  }
  return n.join(t);
}
function Vm(e, t, n = !1) {
  return Ft(e) ? Pm(t) ? t.test(e) : Ft(t) ? n ? e === t : e.includes(t) : !1 : !1;
}
function zo(e, t = [], n = !1) {
  return t.some((r) => Vm(e, r, n));
}
function Je(e, t, n) {
  if (!(t in e))
    return;
  const r = e[t], s = n(r);
  typeof s == "function" && Rd(s, r);
  try {
    e[t] = s;
  } catch {
    zn && V.log(`Failed to replace method "${t}" in object`, e);
  }
}
function Dn(e, t, n) {
  try {
    Object.defineProperty(e, t, {
      // enumerable: false, // the default, so we can save on bundle size by not explicitly setting it
      value: n,
      writable: !0,
      configurable: !0
    });
  } catch {
    zn && V.log(`Failed to add non-enumerable property "${t}" to object`, e);
  }
}
function Rd(e, t) {
  try {
    const n = t.prototype || {};
    e.prototype = t.prototype = n, Dn(e, "__sentry_original__", t);
  } catch {
  }
}
function sc(e) {
  return e.__sentry_original__;
}
function xd(e) {
  if (ec(e))
    return {
      message: e.message,
      name: e.name,
      stack: e.stack,
      ...uu(e)
    };
  if (Ho(e)) {
    const t = {
      type: e.type,
      target: cu(e.target),
      currentTarget: cu(e.currentTarget),
      ...uu(e)
    };
    return typeof CustomEvent < "u" && Pn(e, CustomEvent) && (t.detail = e.detail), t;
  } else
    return e;
}
function cu(e) {
  try {
    return Mm(e) ? Ad(e) : Object.prototype.toString.call(e);
  } catch {
    return "<unknown>";
  }
}
function uu(e) {
  if (typeof e == "object" && e !== null) {
    const t = {};
    for (const n in e)
      Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
    return t;
  } else
    return {};
}
function Wm(e, t = 40) {
  const n = Object.keys(xd(e));
  n.sort();
  const r = n[0];
  if (!r)
    return "[object has no keys]";
  if (r.length >= t)
    return gr(r, t);
  for (let s = n.length; s > 0; s--) {
    const o = n.slice(0, s).join(", ");
    if (!(o.length > t))
      return s === n.length ? o : gr(o, t);
  }
  return "";
}
function tt(e) {
  return ra(e, /* @__PURE__ */ new Map());
}
function ra(e, t) {
  if (Hm(e)) {
    const n = t.get(e);
    if (n !== void 0)
      return n;
    const r = {};
    t.set(e, r);
    for (const s of Object.getOwnPropertyNames(e))
      typeof e[s] < "u" && (r[s] = ra(e[s], t));
    return r;
  }
  if (Array.isArray(e)) {
    const n = t.get(e);
    if (n !== void 0)
      return n;
    const r = [];
    return t.set(e, r), e.forEach((s) => {
      r.push(ra(s, t));
    }), r;
  }
  return e;
}
function Hm(e) {
  if (!Er(e))
    return !1;
  try {
    const t = Object.getPrototypeOf(e).constructor.name;
    return !t || t === "Object";
  } catch {
    return !0;
  }
}
const Od = 1e3;
function _s() {
  return Date.now() / Od;
}
function Gm() {
  const { performance: e } = se;
  if (!e || !e.now)
    return _s;
  const t = Date.now() - e.now(), n = e.timeOrigin == null ? t : e.timeOrigin;
  return () => (n + e.now()) / Od;
}
const $t = Gm();
(() => {
  const { performance: e } = se;
  if (!e || !e.now)
    return;
  const t = 3600 * 1e3, n = e.now(), r = Date.now(), s = e.timeOrigin ? Math.abs(e.timeOrigin + n - r) : t, o = s < t, i = e.timing && e.timing.navigationStart, c = typeof i == "number" ? Math.abs(i + n - r) : t, u = c < t;
  return o || u ? s <= c ? e.timeOrigin : i : r;
})();
function st() {
  const e = se, t = e.crypto || e.msCrypto;
  let n = () => Math.random() * 16;
  try {
    if (t && t.randomUUID)
      return t.randomUUID().replace(/-/g, "");
    t && t.getRandomValues && (n = () => {
      const r = new Uint8Array(1);
      return t.getRandomValues(r), r[0];
    });
  } catch {
  }
  return ("10000000100040008000" + 1e11).replace(
    /[018]/g,
    (r) => (
      // eslint-disable-next-line no-bitwise
      (r ^ (n() & 15) >> r / 4).toString(16)
    )
  );
}
function Ld(e) {
  return e.exception && e.exception.values ? e.exception.values[0] : void 0;
}
function Zt(e) {
  const { message: t, event_id: n } = e;
  if (t)
    return t;
  const r = Ld(e);
  return r ? r.type && r.value ? `${r.type}: ${r.value}` : r.type || r.value || n || "<unknown>" : n || "<unknown>";
}
function sa(e, t, n) {
  const r = e.exception = e.exception || {}, s = r.values = r.values || [], o = s[0] = s[0] || {};
  o.value || (o.value = t || ""), o.type || (o.type = "Error");
}
function Sr(e, t) {
  const n = Ld(e);
  if (!n)
    return;
  const r = { type: "generic", handled: !0 }, s = n.mechanism;
  if (n.mechanism = { ...r, ...s, ...t }, t && "data" in t) {
    const o = { ...s && s.data, ...t.data };
    n.mechanism.data = o;
  }
}
function lu(e) {
  if (zm(e))
    return !0;
  try {
    Dn(e, "__sentry_captured__", !0);
  } catch {
  }
  return !1;
}
function zm(e) {
  try {
    return e.__sentry_captured__;
  } catch {
  }
}
var Mt;
(function(e) {
  e[e.PENDING = 0] = "PENDING";
  const n = 1;
  e[e.RESOLVED = n] = "RESOLVED";
  const r = 2;
  e[e.REJECTED = r] = "REJECTED";
})(Mt || (Mt = {}));
function Un(e) {
  return new Qe((t) => {
    t(e);
  });
}
function wo(e) {
  return new Qe((t, n) => {
    n(e);
  });
}
class Qe {
  constructor(t) {
    Qe.prototype.__init.call(this), Qe.prototype.__init2.call(this), Qe.prototype.__init3.call(this), Qe.prototype.__init4.call(this), this._state = Mt.PENDING, this._handlers = [];
    try {
      t(this._resolve, this._reject);
    } catch (n) {
      this._reject(n);
    }
  }
  /** JSDoc */
  then(t, n) {
    return new Qe((r, s) => {
      this._handlers.push([
        !1,
        (o) => {
          if (!t)
            r(o);
          else
            try {
              r(t(o));
            } catch (i) {
              s(i);
            }
        },
        (o) => {
          if (!n)
            s(o);
          else
            try {
              r(n(o));
            } catch (i) {
              s(i);
            }
        }
      ]), this._executeHandlers();
    });
  }
  /** JSDoc */
  catch(t) {
    return this.then((n) => n, t);
  }
  /** JSDoc */
  finally(t) {
    return new Qe((n, r) => {
      let s, o;
      return this.then(
        (i) => {
          o = !1, s = i, t && t();
        },
        (i) => {
          o = !0, s = i, t && t();
        }
      ).then(() => {
        if (o) {
          r(s);
          return;
        }
        n(s);
      });
    });
  }
  /** JSDoc */
  __init() {
    this._resolve = (t) => {
      this._setResult(Mt.RESOLVED, t);
    };
  }
  /** JSDoc */
  __init2() {
    this._reject = (t) => {
      this._setResult(Mt.REJECTED, t);
    };
  }
  /** JSDoc */
  __init3() {
    this._setResult = (t, n) => {
      if (this._state === Mt.PENDING) {
        if (Go(n)) {
          n.then(this._resolve, this._reject);
          return;
        }
        this._state = t, this._value = n, this._executeHandlers();
      }
    };
  }
  /** JSDoc */
  __init4() {
    this._executeHandlers = () => {
      if (this._state === Mt.PENDING)
        return;
      const t = this._handlers.slice();
      this._handlers = [], t.forEach((n) => {
        n[0] || (this._state === Mt.RESOLVED && n[1](this._value), this._state === Mt.REJECTED && n[2](this._value), n[0] = !0);
      });
    };
  }
}
function Km(e) {
  const t = $t(), n = {
    sid: st(),
    init: !0,
    timestamp: t,
    started: t,
    duration: 0,
    status: "ok",
    errors: 0,
    ignoreDuration: !1,
    toJSON: () => qm(n)
  };
  return e && Tr(n, e), n;
}
function Tr(e, t = {}) {
  if (t.user && (!e.ipAddress && t.user.ip_address && (e.ipAddress = t.user.ip_address), !e.did && !t.did && (e.did = t.user.id || t.user.email || t.user.username)), e.timestamp = t.timestamp || $t(), t.abnormal_mechanism && (e.abnormal_mechanism = t.abnormal_mechanism), t.ignoreDuration && (e.ignoreDuration = t.ignoreDuration), t.sid && (e.sid = t.sid.length === 32 ? t.sid : st()), t.init !== void 0 && (e.init = t.init), !e.did && t.did && (e.did = `${t.did}`), typeof t.started == "number" && (e.started = t.started), e.ignoreDuration)
    e.duration = void 0;
  else if (typeof t.duration == "number")
    e.duration = t.duration;
  else {
    const n = e.timestamp - e.started;
    e.duration = n >= 0 ? n : 0;
  }
  t.release && (e.release = t.release), t.environment && (e.environment = t.environment), !e.ipAddress && t.ipAddress && (e.ipAddress = t.ipAddress), !e.userAgent && t.userAgent && (e.userAgent = t.userAgent), typeof t.errors == "number" && (e.errors = t.errors), t.status && (e.status = t.status);
}
function jm(e, t) {
  let n = {};
  e.status === "ok" && (n = { status: "exited" }), Tr(e, n);
}
function qm(e) {
  return tt({
    sid: `${e.sid}`,
    init: e.init,
    // Make sure that sec is converted to ms for date constructor
    started: new Date(e.started * 1e3).toISOString(),
    timestamp: new Date(e.timestamp * 1e3).toISOString(),
    status: e.status,
    errors: e.errors,
    did: typeof e.did == "number" || typeof e.did == "string" ? `${e.did}` : void 0,
    duration: e.duration,
    abnormal_mechanism: e.abnormal_mechanism,
    attrs: {
      release: e.release,
      environment: e.environment,
      ip_address: e.ipAddress,
      user_agent: e.userAgent
    }
  });
}
function du() {
  return st();
}
function oa() {
  return st().substring(16);
}
function Ko(e, t, n = 2) {
  if (!t || typeof t != "object" || n <= 0)
    return t;
  if (e && t && Object.keys(t).length === 0)
    return e;
  const r = { ...e };
  for (const s in t)
    Object.prototype.hasOwnProperty.call(t, s) && (r[s] = Ko(r[s], t[s], n - 1));
  return r;
}
const ia = "_sentrySpan";
function fu(e, t) {
  t ? Dn(e, ia, t) : delete e[ia];
}
function pu(e) {
  return e[ia];
}
const Xm = 100;
class oc {
  /** Flag if notifying is happening. */
  /** Callback for client to receive scope changes. */
  /** Callback list that will be called during event processing. */
  /** Array of breadcrumbs. */
  /** User */
  /** Tags */
  /** Extra */
  /** Contexts */
  /** Attachments */
  /** Propagation Context for distributed tracing */
  /**
   * A place to stash data which is needed at some point in the SDK's event processing pipeline but which shouldn't get
   * sent to Sentry
   */
  /** Fingerprint */
  /** Severity */
  /**
   * Transaction Name
   *
   * IMPORTANT: The transaction name on the scope has nothing to do with root spans/transaction objects.
   * It's purpose is to assign a transaction to the scope that's added to non-transaction events.
   */
  /** Session */
  /** Request Mode Session Status */
  // eslint-disable-next-line deprecation/deprecation
  /** The client on this scope */
  /** Contains the last event id of a captured event.  */
  // NOTE: Any field which gets added here should get added not only to the constructor but also to the `clone` method.
  constructor() {
    this._notifyingListeners = !1, this._scopeListeners = [], this._eventProcessors = [], this._breadcrumbs = [], this._attachments = [], this._user = {}, this._tags = {}, this._extra = {}, this._contexts = {}, this._sdkProcessingMetadata = {}, this._propagationContext = {
      traceId: du(),
      spanId: oa()
    };
  }
  /**
   * @inheritDoc
   */
  clone() {
    const t = new oc();
    return t._breadcrumbs = [...this._breadcrumbs], t._tags = { ...this._tags }, t._extra = { ...this._extra }, t._contexts = { ...this._contexts }, this._contexts.flags && (t._contexts.flags = {
      values: [...this._contexts.flags.values]
    }), t._user = this._user, t._level = this._level, t._session = this._session, t._transactionName = this._transactionName, t._fingerprint = this._fingerprint, t._eventProcessors = [...this._eventProcessors], t._requestSession = this._requestSession, t._attachments = [...this._attachments], t._sdkProcessingMetadata = { ...this._sdkProcessingMetadata }, t._propagationContext = { ...this._propagationContext }, t._client = this._client, t._lastEventId = this._lastEventId, fu(t, pu(this)), t;
  }
  /**
   * @inheritDoc
   */
  setClient(t) {
    this._client = t;
  }
  /**
   * @inheritDoc
   */
  setLastEventId(t) {
    this._lastEventId = t;
  }
  /**
   * @inheritDoc
   */
  getClient() {
    return this._client;
  }
  /**
   * @inheritDoc
   */
  lastEventId() {
    return this._lastEventId;
  }
  /**
   * @inheritDoc
   */
  addScopeListener(t) {
    this._scopeListeners.push(t);
  }
  /**
   * @inheritDoc
   */
  addEventProcessor(t) {
    return this._eventProcessors.push(t), this;
  }
  /**
   * @inheritDoc
   */
  setUser(t) {
    return this._user = t || {
      email: void 0,
      id: void 0,
      ip_address: void 0,
      username: void 0
    }, this._session && Tr(this._session, { user: t }), this._notifyScopeListeners(), this;
  }
  /**
   * @inheritDoc
   */
  getUser() {
    return this._user;
  }
  /**
   * @inheritDoc
   */
  // eslint-disable-next-line deprecation/deprecation
  getRequestSession() {
    return this._requestSession;
  }
  /**
   * @inheritDoc
   */
  // eslint-disable-next-line deprecation/deprecation
  setRequestSession(t) {
    return this._requestSession = t, this;
  }
  /**
   * @inheritDoc
   */
  setTags(t) {
    return this._tags = {
      ...this._tags,
      ...t
    }, this._notifyScopeListeners(), this;
  }
  /**
   * @inheritDoc
   */
  setTag(t, n) {
    return this._tags = { ...this._tags, [t]: n }, this._notifyScopeListeners(), this;
  }
  /**
   * @inheritDoc
   */
  setExtras(t) {
    return this._extra = {
      ...this._extra,
      ...t
    }, this._notifyScopeListeners(), this;
  }
  /**
   * @inheritDoc
   */
  setExtra(t, n) {
    return this._extra = { ...this._extra, [t]: n }, this._notifyScopeListeners(), this;
  }
  /**
   * @inheritDoc
   */
  setFingerprint(t) {
    return this._fingerprint = t, this._notifyScopeListeners(), this;
  }
  /**
   * @inheritDoc
   */
  setLevel(t) {
    return this._level = t, this._notifyScopeListeners(), this;
  }
  /**
   * @inheritDoc
   */
  setTransactionName(t) {
    return this._transactionName = t, this._notifyScopeListeners(), this;
  }
  /**
   * @inheritDoc
   */
  setContext(t, n) {
    return n === null ? delete this._contexts[t] : this._contexts[t] = n, this._notifyScopeListeners(), this;
  }
  /**
   * @inheritDoc
   */
  setSession(t) {
    return t ? this._session = t : delete this._session, this._notifyScopeListeners(), this;
  }
  /**
   * @inheritDoc
   */
  getSession() {
    return this._session;
  }
  /**
   * @inheritDoc
   */
  update(t) {
    if (!t)
      return this;
    const n = typeof t == "function" ? t(this) : t, [r, s] = n instanceof un ? (
      // eslint-disable-next-line deprecation/deprecation
      [n.getScopeData(), n.getRequestSession()]
    ) : Er(n) ? [t, t.requestSession] : [], { tags: o, extra: i, user: a, contexts: c, level: u, fingerprint: f = [], propagationContext: l } = r || {};
    return this._tags = { ...this._tags, ...o }, this._extra = { ...this._extra, ...i }, this._contexts = { ...this._contexts, ...c }, a && Object.keys(a).length && (this._user = a), u && (this._level = u), f.length && (this._fingerprint = f), l && (this._propagationContext = l), s && (this._requestSession = s), this;
  }
  /**
   * @inheritDoc
   */
  clear() {
    return this._breadcrumbs = [], this._tags = {}, this._extra = {}, this._user = {}, this._contexts = {}, this._level = void 0, this._transactionName = void 0, this._fingerprint = void 0, this._requestSession = void 0, this._session = void 0, fu(this, void 0), this._attachments = [], this.setPropagationContext({ traceId: du() }), this._notifyScopeListeners(), this;
  }
  /**
   * @inheritDoc
   */
  addBreadcrumb(t, n) {
    const r = typeof n == "number" ? n : Xm;
    if (r <= 0)
      return this;
    const s = {
      timestamp: _s(),
      ...t
    }, o = this._breadcrumbs;
    return o.push(s), this._breadcrumbs = o.length > r ? o.slice(-r) : o, this._notifyScopeListeners(), this;
  }
  /**
   * @inheritDoc
   */
  getLastBreadcrumb() {
    return this._breadcrumbs[this._breadcrumbs.length - 1];
  }
  /**
   * @inheritDoc
   */
  clearBreadcrumbs() {
    return this._breadcrumbs = [], this._notifyScopeListeners(), this;
  }
  /**
   * @inheritDoc
   */
  addAttachment(t) {
    return this._attachments.push(t), this;
  }
  /**
   * @inheritDoc
   */
  clearAttachments() {
    return this._attachments = [], this;
  }
  /** @inheritDoc */
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
      span: pu(this)
    };
  }
  /**
   * @inheritDoc
   */
  setSDKProcessingMetadata(t) {
    return this._sdkProcessingMetadata = Ko(this._sdkProcessingMetadata, t, 2), this;
  }
  /**
   * @inheritDoc
   */
  setPropagationContext(t) {
    return this._propagationContext = {
      // eslint-disable-next-line deprecation/deprecation
      spanId: oa(),
      ...t
    }, this;
  }
  /**
   * @inheritDoc
   */
  getPropagationContext() {
    return this._propagationContext;
  }
  /**
   * @inheritDoc
   */
  captureException(t, n) {
    const r = n && n.event_id ? n.event_id : st();
    if (!this._client)
      return V.warn("No client configured on scope - will not capture exception!"), r;
    const s = new Error("Sentry syntheticException");
    return this._client.captureException(
      t,
      {
        originalException: t,
        syntheticException: s,
        ...n,
        event_id: r
      },
      this
    ), r;
  }
  /**
   * @inheritDoc
   */
  captureMessage(t, n, r) {
    const s = r && r.event_id ? r.event_id : st();
    if (!this._client)
      return V.warn("No client configured on scope - will not capture message!"), s;
    const o = new Error(t);
    return this._client.captureMessage(
      t,
      n,
      {
        originalException: t,
        syntheticException: o,
        ...r,
        event_id: s
      },
      this
    ), s;
  }
  /**
   * @inheritDoc
   */
  captureEvent(t, n) {
    const r = n && n.event_id ? n.event_id : st();
    return this._client ? (this._client.captureEvent(t, { ...n, event_id: r }, this), r) : (V.warn("No client configured on scope - will not capture event!"), r);
  }
  /**
   * This will be called on every set call.
   */
  _notifyScopeListeners() {
    this._notifyingListeners || (this._notifyingListeners = !0, this._scopeListeners.forEach((t) => {
      t(this);
    }), this._notifyingListeners = !1);
  }
}
const un = oc;
function Ym() {
  return Vo("defaultCurrentScope", () => new un());
}
function Jm() {
  return Vo("defaultIsolationScope", () => new un());
}
class Zm {
  constructor(t, n) {
    let r;
    t ? r = t : r = new un();
    let s;
    n ? s = n : s = new un(), this._stack = [{ scope: r }], this._isolationScope = s;
  }
  /**
   * Fork a scope for the stack.
   */
  withScope(t) {
    const n = this._pushScope();
    let r;
    try {
      r = t(n);
    } catch (s) {
      throw this._popScope(), s;
    }
    return Go(r) ? r.then(
      (s) => (this._popScope(), s),
      (s) => {
        throw this._popScope(), s;
      }
    ) : (this._popScope(), r);
  }
  /**
   * Get the client of the stack.
   */
  getClient() {
    return this.getStackTop().client;
  }
  /**
   * Returns the scope of the top stack.
   */
  getScope() {
    return this.getStackTop().scope;
  }
  /**
   * Get the isolation scope for the stack.
   */
  getIsolationScope() {
    return this._isolationScope;
  }
  /**
   * Returns the topmost scope layer in the order domain > local > process.
   */
  getStackTop() {
    return this._stack[this._stack.length - 1];
  }
  /**
   * Push a scope to the stack.
   */
  _pushScope() {
    const t = this.getScope().clone();
    return this._stack.push({
      client: this.getClient(),
      scope: t
    }), t;
  }
  /**
   * Pop a scope from the stack.
   */
  _popScope() {
    return this._stack.length <= 1 ? !1 : !!this._stack.pop();
  }
}
function vr() {
  const e = Wo(), t = Qa(e);
  return t.stack = t.stack || new Zm(Ym(), Jm());
}
function Qm(e) {
  return vr().withScope(e);
}
function eg(e, t) {
  const n = vr();
  return n.withScope(() => (n.getStackTop().scope = e, t(e)));
}
function hu(e) {
  return vr().withScope(() => e(vr().getIsolationScope()));
}
function tg() {
  return {
    withIsolationScope: hu,
    withScope: Qm,
    withSetScope: eg,
    withSetIsolationScope: (e, t) => hu(t),
    getCurrentScope: () => vr().getScope(),
    getIsolationScope: () => vr().getIsolationScope()
  };
}
function ic(e) {
  const t = Qa(e);
  return t.acs ? t.acs : tg();
}
function zt() {
  const e = Wo();
  return ic(e).getCurrentScope();
}
function bs() {
  const e = Wo();
  return ic(e).getIsolationScope();
}
function ng() {
  return Vo("globalScope", () => new un());
}
function rg(...e) {
  const t = Wo(), n = ic(t);
  if (e.length === 2) {
    const [r, s] = e;
    return r ? n.withSetScope(r, s) : n.withScope(s);
  }
  return n.withScope(e[0]);
}
function De() {
  return zt().getClient();
}
function sg(e) {
  const t = e.getPropagationContext(), { traceId: n, spanId: r, parentSpanId: s } = t;
  return tt({
    trace_id: n,
    span_id: r,
    parent_span_id: s
  });
}
const og = "_sentryMetrics";
function ig(e) {
  const t = e[og];
  if (!t)
    return;
  const n = {};
  for (const [, [r, s]] of t)
    (n[r] || (n[r] = [])).push(tt(s));
  return n;
}
const ag = "sentry.source", cg = "sentry.sample_rate", ug = "sentry.op", lg = "sentry.origin", dg = 0, fg = 1, pg = "sentry-", hg = /^sentry-/;
function mg(e) {
  const t = gg(e);
  if (!t)
    return;
  const n = Object.entries(t).reduce((r, [s, o]) => {
    if (s.match(hg)) {
      const i = s.slice(pg.length);
      r[i] = o;
    }
    return r;
  }, {});
  if (Object.keys(n).length > 0)
    return n;
}
function gg(e) {
  if (!(!e || !Ft(e) && !Array.isArray(e)))
    return Array.isArray(e) ? e.reduce((t, n) => {
      const r = mu(n);
      return Object.entries(r).forEach(([s, o]) => {
        t[s] = o;
      }), t;
    }, {}) : mu(e);
}
function mu(e) {
  return e.split(",").map((t) => t.split("=").map((n) => decodeURIComponent(n.trim()))).reduce((t, [n, r]) => (n && r && (t[n] = r), t), {});
}
const yg = 1;
let gu = !1;
function _g(e) {
  const { spanId: t, traceId: n, isRemote: r } = e.spanContext(), s = r ? t : ac(e).parent_span_id, o = r ? oa() : t;
  return tt({
    parent_span_id: s,
    span_id: o,
    trace_id: n
  });
}
function yu(e) {
  return typeof e == "number" ? _u(e) : Array.isArray(e) ? e[0] + e[1] / 1e9 : e instanceof Date ? _u(e.getTime()) : $t();
}
function _u(e) {
  return e > 9999999999 ? e / 1e3 : e;
}
function ac(e) {
  if (wg(e))
    return e.getSpanJSON();
  try {
    const { spanId: t, traceId: n } = e.spanContext();
    if (bg(e)) {
      const { attributes: r, startTime: s, name: o, endTime: i, parentSpanId: a, status: c } = e;
      return tt({
        span_id: t,
        trace_id: n,
        data: r,
        description: o,
        parent_span_id: a,
        start_timestamp: yu(s),
        // This is [0,0] by default in OTEL, in which case we want to interpret this as no end time
        timestamp: yu(i) || void 0,
        status: Sg(c),
        op: r[ug],
        origin: r[lg],
        _metrics_summary: ig(e)
      });
    }
    return {
      span_id: t,
      trace_id: n
    };
  } catch {
    return {};
  }
}
function bg(e) {
  const t = e;
  return !!t.attributes && !!t.startTime && !!t.name && !!t.endTime && !!t.status;
}
function wg(e) {
  return typeof e.getSpanJSON == "function";
}
function Eg(e) {
  const { traceFlags: t } = e.spanContext();
  return t === yg;
}
function Sg(e) {
  if (!(!e || e.code === dg))
    return e.code === fg ? "ok" : e.message || "unknown_error";
}
const Tg = "_sentryRootSpan";
function Nd(e) {
  return e[Tg] || e;
}
function vg() {
  gu || (Kn(() => {
    console.warn(
      "[Sentry] Deprecation warning: Returning null from `beforeSendSpan` will be disallowed from SDK version 9.0.0 onwards. The callback will only support mutating spans. To drop certain spans, configure the respective integrations directly."
    );
  }), gu = !0);
}
function Ig(e) {
  if (typeof __SENTRY_TRACING__ == "boolean" && !__SENTRY_TRACING__)
    return !1;
  const t = De(), n = t && t.getOptions();
  return !!n && (n.enableTracing || "tracesSampleRate" in n || "tracesSampler" in n);
}
const cc = "production", kg = "_frozenDsc";
function Md(e, t) {
  const n = t.getOptions(), { publicKey: r } = t.getDsn() || {}, s = tt({
    environment: n.environment || cc,
    release: n.release,
    public_key: r,
    trace_id: e
  });
  return t.emit("createDsc", s), s;
}
function Cg(e, t) {
  const n = t.getPropagationContext();
  return n.dsc || Md(n.traceId, e);
}
function Ag(e) {
  const t = De();
  if (!t)
    return {};
  const n = Nd(e), r = n[kg];
  if (r)
    return r;
  const s = n.spanContext().traceState, o = s && s.get("sentry.dsc"), i = o && mg(o);
  if (i)
    return i;
  const a = Md(e.spanContext().traceId, t), c = ac(n), u = c.data || {}, f = u[cg];
  f != null && (a.sample_rate = `${f}`);
  const l = u[ag], d = c.description;
  return l !== "url" && d && (a.transaction = d), Ig() && (a.sampled = String(Eg(n))), t.emit("createDsc", a, n), a;
}
function Rg(e) {
  if (typeof e == "boolean")
    return Number(e);
  const t = typeof e == "string" ? parseFloat(e) : e;
  if (typeof t != "number" || isNaN(t) || t < 0 || t > 1) {
    fe && V.warn(
      `[Tracing] Given sample rate is invalid. Sample rate must be a boolean or a number between 0 and 1. Got ${JSON.stringify(
        e
      )} of type ${JSON.stringify(typeof e)}.`
    );
    return;
  }
  return t;
}
const xg = /^(?:(\w+):)\/\/(?:(\w+)(?::(\w+)?)?@)([\w.-]+)(?::(\d+))?\/(.+)/;
function Og(e) {
  return e === "http" || e === "https";
}
function jo(e, t = !1) {
  const { host: n, path: r, pass: s, port: o, projectId: i, protocol: a, publicKey: c } = e;
  return `${a}://${c}${t && s ? `:${s}` : ""}@${n}${o ? `:${o}` : ""}/${r && `${r}/`}${i}`;
}
function Lg(e) {
  const t = xg.exec(e);
  if (!t) {
    Kn(() => {
      console.error(`Invalid Sentry Dsn: ${e}`);
    });
    return;
  }
  const [n, r, s = "", o = "", i = "", a = ""] = t.slice(1);
  let c = "", u = a;
  const f = u.split("/");
  if (f.length > 1 && (c = f.slice(0, -1).join("/"), u = f.pop()), u) {
    const l = u.match(/^\d+/);
    l && (u = l[0]);
  }
  return Pd({ host: o, pass: s, path: c, projectId: u, port: i, protocol: n, publicKey: r });
}
function Pd(e) {
  return {
    protocol: e.protocol,
    publicKey: e.publicKey || "",
    pass: e.pass || "",
    host: e.host,
    port: e.port || "",
    path: e.path || "",
    projectId: e.projectId
  };
}
function Ng(e) {
  if (!zn)
    return !0;
  const { port: t, projectId: n, protocol: r } = e;
  return ["protocol", "publicKey", "host", "projectId"].find((i) => e[i] ? !1 : (V.error(`Invalid Sentry Dsn: ${i} missing`), !0)) ? !1 : n.match(/^\d+$/) ? Og(r) ? t && isNaN(parseInt(t, 10)) ? (V.error(`Invalid Sentry Dsn: Invalid port ${t}`), !1) : !0 : (V.error(`Invalid Sentry Dsn: Invalid protocol ${r}`), !1) : (V.error(`Invalid Sentry Dsn: Invalid projectId ${n}`), !1);
}
function Mg(e) {
  const t = typeof e == "string" ? Lg(e) : Pd(e);
  if (!(!t || !Ng(t)))
    return t;
}
function Pg() {
  const e = typeof WeakSet == "function", t = e ? /* @__PURE__ */ new WeakSet() : [];
  function n(s) {
    if (e)
      return t.has(s) ? !0 : (t.add(s), !1);
    for (let o = 0; o < t.length; o++)
      if (t[o] === s)
        return !0;
    return t.push(s), !1;
  }
  function r(s) {
    if (e)
      t.delete(s);
    else
      for (let o = 0; o < t.length; o++)
        if (t[o] === s) {
          t.splice(o, 1);
          break;
        }
  }
  return [n, r];
}
function Pt(e, t = 100, n = 1 / 0) {
  try {
    return aa("", e, t, n);
  } catch (r) {
    return { ERROR: `**non-serializable** (${r})` };
  }
}
function Dd(e, t = 3, n = 100 * 1024) {
  const r = Pt(e, t);
  return $g(r) > n ? Dd(e, t - 1, n) : r;
}
function aa(e, t, n = 1 / 0, r = 1 / 0, s = Pg()) {
  const [o, i] = s;
  if (t == null || // this matches null and undefined -> eqeq not eqeqeq
  ["boolean", "string"].includes(typeof t) || typeof t == "number" && Number.isFinite(t))
    return t;
  const a = Dg(e, t);
  if (!a.startsWith("[object "))
    return a;
  if (t.__sentry_skip_normalization__)
    return t;
  const c = typeof t.__sentry_override_normalization_depth__ == "number" ? t.__sentry_override_normalization_depth__ : n;
  if (c === 0)
    return a.replace("object ", "");
  if (o(t))
    return "[Circular ~]";
  const u = t;
  if (u && typeof u.toJSON == "function")
    try {
      const p = u.toJSON();
      return aa("", p, c - 1, r, s);
    } catch {
    }
  const f = Array.isArray(t) ? [] : {};
  let l = 0;
  const d = xd(t);
  for (const p in d) {
    if (!Object.prototype.hasOwnProperty.call(d, p))
      continue;
    if (l >= r) {
      f[p] = "[MaxProperties ~]";
      break;
    }
    const h = d[p];
    f[p] = aa(p, h, c - 1, r, s), l++;
  }
  return i(t), f;
}
function Dg(e, t) {
  try {
    if (e === "domain" && t && typeof t == "object" && t._events)
      return "[Domain]";
    if (e === "domainEmitter")
      return "[DomainEmitter]";
    if (typeof global < "u" && t === global)
      return "[Global]";
    if (typeof window < "u" && t === window)
      return "[Window]";
    if (typeof document < "u" && t === document)
      return "[Document]";
    if (Cd(t))
      return "[VueViewModel]";
    if (Dm(t))
      return "[SyntheticEvent]";
    if (typeof t == "number" && !Number.isFinite(t))
      return `[${t}]`;
    if (typeof t == "function")
      return `[Function: ${cn(t)}]`;
    if (typeof t == "symbol")
      return `[${String(t)}]`;
    if (typeof t == "bigint")
      return `[BigInt: ${String(t)}]`;
    const n = Ug(t);
    return /^HTML(\w*)Element$/.test(n) ? `[HTMLElement: ${n}]` : `[object ${n}]`;
  } catch (n) {
    return `**non-serializable** (${n})`;
  }
}
function Ug(e) {
  const t = Object.getPrototypeOf(e);
  return t ? t.constructor.name : "null prototype";
}
function Fg(e) {
  return ~-encodeURI(e).split(/%..|./).length;
}
function $g(e) {
  return Fg(JSON.stringify(e));
}
function ws(e, t = []) {
  return [e, t];
}
function Bg(e, t) {
  const [n, r] = e;
  return [n, [...r, t]];
}
function bu(e, t) {
  const n = e[1];
  for (const r of n) {
    const s = r[0].type;
    if (t(r, s))
      return !0;
  }
  return !1;
}
function ca(e) {
  return se.__SENTRY__ && se.__SENTRY__.encodePolyfill ? se.__SENTRY__.encodePolyfill(e) : new TextEncoder().encode(e);
}
function Vg(e) {
  const [t, n] = e;
  let r = JSON.stringify(t);
  function s(o) {
    typeof r == "string" ? r = typeof o == "string" ? r + o : [ca(r), o] : r.push(typeof o == "string" ? ca(o) : o);
  }
  for (const o of n) {
    const [i, a] = o;
    if (s(`
${JSON.stringify(i)}
`), typeof a == "string" || a instanceof Uint8Array)
      s(a);
    else {
      let c;
      try {
        c = JSON.stringify(a);
      } catch {
        c = JSON.stringify(Pt(a));
      }
      s(c);
    }
  }
  return typeof r == "string" ? r : Wg(r);
}
function Wg(e) {
  const t = e.reduce((s, o) => s + o.length, 0), n = new Uint8Array(t);
  let r = 0;
  for (const s of e)
    n.set(s, r), r += s.length;
  return n;
}
function Hg(e) {
  const t = typeof e.data == "string" ? ca(e.data) : e.data;
  return [
    tt({
      type: "attachment",
      length: t.length,
      filename: e.filename,
      content_type: e.contentType,
      attachment_type: e.attachmentType
    }),
    t
  ];
}
const Gg = {
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
  raw_security: "security"
};
function wu(e) {
  return Gg[e];
}
function Ud(e) {
  if (!e || !e.sdk)
    return;
  const { name: t, version: n } = e.sdk;
  return { name: t, version: n };
}
function zg(e, t, n, r) {
  const s = e.sdkProcessingMetadata && e.sdkProcessingMetadata.dynamicSamplingContext;
  return {
    event_id: e.event_id,
    sent_at: (/* @__PURE__ */ new Date()).toISOString(),
    ...t && { sdk: t },
    ...!!n && r && { dsn: jo(r) },
    ...s && {
      trace: tt({ ...s })
    }
  };
}
function Kg(e, t) {
  return t && (e.sdk = e.sdk || {}, e.sdk.name = e.sdk.name || t.name, e.sdk.version = e.sdk.version || t.version, e.sdk.integrations = [...e.sdk.integrations || [], ...t.integrations || []], e.sdk.packages = [...e.sdk.packages || [], ...t.packages || []]), e;
}
function jg(e, t, n, r) {
  const s = Ud(n), o = {
    sent_at: (/* @__PURE__ */ new Date()).toISOString(),
    ...s && { sdk: s },
    ...!!r && t && { dsn: jo(t) }
  }, i = "aggregates" in e ? [{ type: "sessions" }, e] : [{ type: "session" }, e.toJSON()];
  return ws(o, [i]);
}
function qg(e, t, n, r) {
  const s = Ud(n), o = e.type && e.type !== "replay_event" ? e.type : "event";
  Kg(e, n && n.sdk);
  const i = zg(e, s, r, t);
  return delete e.sdkProcessingMetadata, ws(i, [[{ type: o }, e]]);
}
function ua(e, t, n, r = 0) {
  return new Qe((s, o) => {
    const i = e[r];
    if (t === null || typeof i != "function")
      s(t);
    else {
      const a = i({ ...t }, n);
      fe && i.id && a === null && V.log(`Event processor "${i.id}" dropped event`), Go(a) ? a.then((c) => ua(e, c, n, r + 1).then(s)).then(null, o) : ua(e, a, n, r + 1).then(s).then(null, o);
    }
  });
}
let $s, Eu, Bs;
function Xg(e) {
  const t = se._sentryDebugIds;
  if (!t)
    return {};
  const n = Object.keys(t);
  return Bs && n.length === Eu || (Eu = n.length, Bs = n.reduce((r, s) => {
    $s || ($s = {});
    const o = $s[s];
    if (o)
      r[o[0]] = o[1];
    else {
      const i = e(s);
      for (let a = i.length - 1; a >= 0; a--) {
        const c = i[a], u = c && c.filename, f = t[s];
        if (u && f) {
          r[u] = f, $s[s] = [u, f];
          break;
        }
      }
    }
    return r;
  }, {})), Bs;
}
function Yg(e, t) {
  const { fingerprint: n, span: r, breadcrumbs: s, sdkProcessingMetadata: o } = t;
  Jg(e, t), r && ey(e, r), ty(e, n), Zg(e, s), Qg(e, o);
}
function Su(e, t) {
  const {
    extra: n,
    tags: r,
    user: s,
    contexts: o,
    level: i,
    sdkProcessingMetadata: a,
    breadcrumbs: c,
    fingerprint: u,
    eventProcessors: f,
    attachments: l,
    propagationContext: d,
    transactionName: p,
    span: h
  } = t;
  Vs(e, "extra", n), Vs(e, "tags", r), Vs(e, "user", s), Vs(e, "contexts", o), e.sdkProcessingMetadata = Ko(e.sdkProcessingMetadata, a, 2), i && (e.level = i), p && (e.transactionName = p), h && (e.span = h), c.length && (e.breadcrumbs = [...e.breadcrumbs, ...c]), u.length && (e.fingerprint = [...e.fingerprint, ...u]), f.length && (e.eventProcessors = [...e.eventProcessors, ...f]), l.length && (e.attachments = [...e.attachments, ...l]), e.propagationContext = { ...e.propagationContext, ...d };
}
function Vs(e, t, n) {
  e[t] = Ko(e[t], n, 1);
}
function Jg(e, t) {
  const { extra: n, tags: r, user: s, contexts: o, level: i, transactionName: a } = t, c = tt(n);
  c && Object.keys(c).length && (e.extra = { ...c, ...e.extra });
  const u = tt(r);
  u && Object.keys(u).length && (e.tags = { ...u, ...e.tags });
  const f = tt(s);
  f && Object.keys(f).length && (e.user = { ...f, ...e.user });
  const l = tt(o);
  l && Object.keys(l).length && (e.contexts = { ...l, ...e.contexts }), i && (e.level = i), a && e.type !== "transaction" && (e.transaction = a);
}
function Zg(e, t) {
  const n = [...e.breadcrumbs || [], ...t];
  e.breadcrumbs = n.length ? n : void 0;
}
function Qg(e, t) {
  e.sdkProcessingMetadata = {
    ...e.sdkProcessingMetadata,
    ...t
  };
}
function ey(e, t) {
  e.contexts = {
    trace: _g(t),
    ...e.contexts
  }, e.sdkProcessingMetadata = {
    dynamicSamplingContext: Ag(t),
    ...e.sdkProcessingMetadata
  };
  const n = Nd(t), r = ac(n).description;
  r && !e.transaction && e.type === "transaction" && (e.transaction = r);
}
function ty(e, t) {
  e.fingerprint = e.fingerprint ? Array.isArray(e.fingerprint) ? e.fingerprint : [e.fingerprint] : [], t && (e.fingerprint = e.fingerprint.concat(t)), e.fingerprint && !e.fingerprint.length && delete e.fingerprint;
}
function ny(e, t, n, r, s, o) {
  const { normalizeDepth: i = 3, normalizeMaxBreadth: a = 1e3 } = e, c = {
    ...t,
    event_id: t.event_id || n.event_id || st(),
    timestamp: t.timestamp || _s()
  }, u = n.integrations || e.integrations.map((g) => g.name);
  ry(c, e), iy(c, u), s && s.emit("applyFrameMetadata", t), t.type === void 0 && sy(c, e.stackParser);
  const f = cy(r, n.captureContext);
  n.mechanism && Sr(c, n.mechanism);
  const l = s ? s.getEventProcessors() : [], d = ng().getScopeData();
  if (o) {
    const g = o.getScopeData();
    Su(d, g);
  }
  if (f) {
    const g = f.getScopeData();
    Su(d, g);
  }
  const p = [...n.attachments || [], ...d.attachments];
  p.length && (n.attachments = p), Yg(c, d);
  const h = [
    ...l,
    // Run scope event processors _after_ all other processors
    ...d.eventProcessors
  ];
  return ua(h, c, n).then((g) => (g && oy(g), typeof i == "number" && i > 0 ? ay(g, i, a) : g));
}
function ry(e, t) {
  const { environment: n, release: r, dist: s, maxValueLength: o = 250 } = t;
  e.environment = e.environment || n || cc, !e.release && r && (e.release = r), !e.dist && s && (e.dist = s), e.message && (e.message = gr(e.message, o));
  const i = e.exception && e.exception.values && e.exception.values[0];
  i && i.value && (i.value = gr(i.value, o));
  const a = e.request;
  a && a.url && (a.url = gr(a.url, o));
}
function sy(e, t) {
  const n = Xg(t);
  try {
    e.exception.values.forEach((r) => {
      r.stacktrace.frames.forEach((s) => {
        n && s.filename && (s.debug_id = n[s.filename]);
      });
    });
  } catch {
  }
}
function oy(e) {
  const t = {};
  try {
    e.exception.values.forEach((r) => {
      r.stacktrace.frames.forEach((s) => {
        s.debug_id && (s.abs_path ? t[s.abs_path] = s.debug_id : s.filename && (t[s.filename] = s.debug_id), delete s.debug_id);
      });
    });
  } catch {
  }
  if (Object.keys(t).length === 0)
    return;
  e.debug_meta = e.debug_meta || {}, e.debug_meta.images = e.debug_meta.images || [];
  const n = e.debug_meta.images;
  Object.entries(t).forEach(([r, s]) => {
    n.push({
      type: "sourcemap",
      code_file: r,
      debug_id: s
    });
  });
}
function iy(e, t) {
  t.length > 0 && (e.sdk = e.sdk || {}, e.sdk.integrations = [...e.sdk.integrations || [], ...t]);
}
function ay(e, t, n) {
  if (!e)
    return null;
  const r = {
    ...e,
    ...e.breadcrumbs && {
      breadcrumbs: e.breadcrumbs.map((s) => ({
        ...s,
        ...s.data && {
          data: Pt(s.data, t, n)
        }
      }))
    },
    ...e.user && {
      user: Pt(e.user, t, n)
    },
    ...e.contexts && {
      contexts: Pt(e.contexts, t, n)
    },
    ...e.extra && {
      extra: Pt(e.extra, t, n)
    }
  };
  return e.contexts && e.contexts.trace && r.contexts && (r.contexts.trace = e.contexts.trace, e.contexts.trace.data && (r.contexts.trace.data = Pt(e.contexts.trace.data, t, n))), e.spans && (r.spans = e.spans.map((s) => ({
    ...s,
    ...s.data && {
      data: Pt(s.data, t, n)
    }
  }))), e.contexts && e.contexts.flags && r.contexts && (r.contexts.flags = Pt(e.contexts.flags, 3, n)), r;
}
function cy(e, t) {
  if (!t)
    return e;
  const n = e ? e.clone() : new un();
  return n.update(t), n;
}
function uy(e) {
  if (e)
    return ly(e) ? { captureContext: e } : fy(e) ? {
      captureContext: e
    } : e;
}
function ly(e) {
  return e instanceof un || typeof e == "function";
}
const dy = [
  "user",
  "level",
  "extra",
  "contexts",
  "tags",
  "fingerprint",
  "requestSession",
  "propagationContext"
];
function fy(e) {
  return Object.keys(e).some((t) => dy.includes(t));
}
function Fd(e, t) {
  return zt().captureException(e, uy(t));
}
function $d(e, t) {
  return zt().captureEvent(e, t);
}
function Tu(e) {
  const t = De(), n = bs(), r = zt(), { release: s, environment: o = cc } = t && t.getOptions() || {}, { userAgent: i } = se.navigator || {}, a = Km({
    release: s,
    environment: o,
    user: r.getUser() || n.getUser(),
    ...i && { userAgent: i },
    ...e
  }), c = n.getSession();
  return c && c.status === "ok" && Tr(c, { status: "exited" }), Bd(), n.setSession(a), r.setSession(a), a;
}
function Bd() {
  const e = bs(), t = zt(), n = t.getSession() || e.getSession();
  n && jm(n), Vd(), e.setSession(), t.setSession();
}
function Vd() {
  const e = bs(), t = zt(), n = De(), r = t.getSession() || e.getSession();
  r && n && n.captureSession(r);
}
function vu(e = !1) {
  if (e) {
    Bd();
    return;
  }
  Vd();
}
const py = "7";
function hy(e) {
  const t = e.protocol ? `${e.protocol}:` : "", n = e.port ? `:${e.port}` : "";
  return `${t}//${e.host}${n}${e.path ? `/${e.path}` : ""}/api/`;
}
function my(e) {
  return `${hy(e)}${e.projectId}/envelope/`;
}
function gy(e, t) {
  const n = {
    sentry_version: py
  };
  return e.publicKey && (n.sentry_key = e.publicKey), t && (n.sentry_client = `${t.name}/${t.version}`), new URLSearchParams(n).toString();
}
function yy(e, t, n) {
  return t || `${my(e)}?${gy(e, n)}`;
}
const Iu = [];
function _y(e) {
  const t = {};
  return e.forEach((n) => {
    const { name: r } = n, s = t[r];
    s && !s.isDefaultInstance && n.isDefaultInstance || (t[r] = n);
  }), Object.values(t);
}
function by(e) {
  const t = e.defaultIntegrations || [], n = e.integrations;
  t.forEach((i) => {
    i.isDefaultInstance = !0;
  });
  let r;
  if (Array.isArray(n))
    r = [...t, ...n];
  else if (typeof n == "function") {
    const i = n(t);
    r = Array.isArray(i) ? i : [i];
  } else
    r = t;
  const s = _y(r), o = s.findIndex((i) => i.name === "Debug");
  if (o > -1) {
    const [i] = s.splice(o, 1);
    s.push(i);
  }
  return s;
}
function wy(e, t) {
  const n = {};
  return t.forEach((r) => {
    r && Wd(e, r, n);
  }), n;
}
function ku(e, t) {
  for (const n of t)
    n && n.afterAllSetup && n.afterAllSetup(e);
}
function Wd(e, t, n) {
  if (n[t.name]) {
    fe && V.log(`Integration skipped because it was already installed: ${t.name}`);
    return;
  }
  if (n[t.name] = t, Iu.indexOf(t.name) === -1 && typeof t.setupOnce == "function" && (t.setupOnce(), Iu.push(t.name)), t.setup && typeof t.setup == "function" && t.setup(e), typeof t.preprocessEvent == "function") {
    const r = t.preprocessEvent.bind(t);
    e.on("preprocessEvent", (s, o) => r(s, o, e));
  }
  if (typeof t.processEvent == "function") {
    const r = t.processEvent.bind(t), s = Object.assign((o, i) => r(o, i, e), {
      id: t.name
    });
    e.addEventProcessor(s);
  }
  fe && V.log(`Integration installed: ${t.name}`);
}
function Ey(e, t, n) {
  const r = [
    { type: "client_report" },
    {
      timestamp: _s(),
      discarded_events: e
    }
  ];
  return ws(t ? { dsn: t } : {}, [r]);
}
class St extends Error {
  /** Display name of this error instance. */
  constructor(t, n = "warn") {
    super(t), this.message = t, this.name = new.target.prototype.constructor.name, Object.setPrototypeOf(this, new.target.prototype), this.logLevel = n;
  }
}
const Cu = "Not capturing exception because it's already been captured.";
class Sy {
  /** Options passed to the SDK. */
  /** The client Dsn, if specified in options. Without this Dsn, the SDK will be disabled. */
  /** Array of set up integrations. */
  /** Number of calls being processed */
  /** Holds flushable  */
  // eslint-disable-next-line @typescript-eslint/ban-types
  /**
   * Initializes this client instance.
   *
   * @param options Options for the client.
   */
  constructor(t) {
    if (this._options = t, this._integrations = {}, this._numProcessing = 0, this._outcomes = {}, this._hooks = {}, this._eventProcessors = [], t.dsn ? this._dsn = Mg(t.dsn) : fe && V.warn("No DSN provided, client will not send events."), this._dsn) {
      const s = yy(
        this._dsn,
        t.tunnel,
        t._metadata ? t._metadata.sdk : void 0
      );
      this._transport = t.transport({
        tunnel: this._options.tunnel,
        recordDroppedEvent: this.recordDroppedEvent.bind(this),
        ...t.transportOptions,
        url: s
      });
    }
    const r = ["enableTracing", "tracesSampleRate", "tracesSampler"].find((s) => s in t && t[s] == null);
    r && Kn(() => {
      console.warn(
        `[Sentry] Deprecation warning: \`${r}\` is set to undefined, which leads to tracing being enabled. In v9, a value of \`undefined\` will result in tracing being disabled.`
      );
    });
  }
  /**
   * @inheritDoc
   */
  captureException(t, n, r) {
    const s = st();
    if (lu(t))
      return fe && V.log(Cu), s;
    const o = {
      event_id: s,
      ...n
    };
    return this._process(
      this.eventFromException(t, o).then(
        (i) => this._captureEvent(i, o, r)
      )
    ), o.event_id;
  }
  /**
   * @inheritDoc
   */
  captureMessage(t, n, r, s) {
    const o = {
      event_id: st(),
      ...r
    }, i = tc(t) ? t : String(t), a = nc(t) ? this.eventFromMessage(i, n, o) : this.eventFromException(t, o);
    return this._process(a.then((c) => this._captureEvent(c, o, s))), o.event_id;
  }
  /**
   * @inheritDoc
   */
  captureEvent(t, n, r) {
    const s = st();
    if (n && n.originalException && lu(n.originalException))
      return fe && V.log(Cu), s;
    const o = {
      event_id: s,
      ...n
    }, a = (t.sdkProcessingMetadata || {}).capturedSpanScope;
    return this._process(this._captureEvent(t, o, a || r)), o.event_id;
  }
  /**
   * @inheritDoc
   */
  captureSession(t) {
    typeof t.release != "string" ? fe && V.warn("Discarded session because of missing or non-string release") : (this.sendSession(t), Tr(t, { init: !1 }));
  }
  /**
   * @inheritDoc
   */
  getDsn() {
    return this._dsn;
  }
  /**
   * @inheritDoc
   */
  getOptions() {
    return this._options;
  }
  /**
   * @see SdkMetadata
   *
   * @return The metadata of the SDK
   */
  getSdkMetadata() {
    return this._options._metadata;
  }
  /**
   * @inheritDoc
   */
  getTransport() {
    return this._transport;
  }
  /**
   * @inheritDoc
   */
  flush(t) {
    const n = this._transport;
    return n ? (this.emit("flush"), this._isClientDoneProcessing(t).then((r) => n.flush(t).then((s) => r && s))) : Un(!0);
  }
  /**
   * @inheritDoc
   */
  close(t) {
    return this.flush(t).then((n) => (this.getOptions().enabled = !1, this.emit("close"), n));
  }
  /** Get all installed event processors. */
  getEventProcessors() {
    return this._eventProcessors;
  }
  /** @inheritDoc */
  addEventProcessor(t) {
    this._eventProcessors.push(t);
  }
  /** @inheritdoc */
  init() {
    (this._isEnabled() || // Force integrations to be setup even if no DSN was set when we have
    // Spotlight enabled. This is particularly important for browser as we
    // don't support the `spotlight` option there and rely on the users
    // adding the `spotlightBrowserIntegration()` to their integrations which
    // wouldn't get initialized with the check below when there's no DSN set.
    this._options.integrations.some(({ name: t }) => t.startsWith("Spotlight"))) && this._setupIntegrations();
  }
  /**
   * Gets an installed integration by its name.
   *
   * @returns The installed integration or `undefined` if no integration with that `name` was installed.
   */
  getIntegrationByName(t) {
    return this._integrations[t];
  }
  /**
   * @inheritDoc
   */
  addIntegration(t) {
    const n = this._integrations[t.name];
    Wd(this, t, this._integrations), n || ku(this, [t]);
  }
  /**
   * @inheritDoc
   */
  sendEvent(t, n = {}) {
    this.emit("beforeSendEvent", t, n);
    let r = qg(t, this._dsn, this._options._metadata, this._options.tunnel);
    for (const o of n.attachments || [])
      r = Bg(r, Hg(o));
    const s = this.sendEnvelope(r);
    s && s.then((o) => this.emit("afterSendEvent", t, o), null);
  }
  /**
   * @inheritDoc
   */
  sendSession(t) {
    const n = jg(t, this._dsn, this._options._metadata, this._options.tunnel);
    this.sendEnvelope(n);
  }
  /**
   * @inheritDoc
   */
  recordDroppedEvent(t, n, r) {
    if (this._options.sendClientReports) {
      const s = typeof r == "number" ? r : 1, o = `${t}:${n}`;
      fe && V.log(`Recording outcome: "${o}"${s > 1 ? ` (${s} times)` : ""}`), this._outcomes[o] = (this._outcomes[o] || 0) + s;
    }
  }
  // Keep on() & emit() signatures in sync with types' client.ts interface
  /* eslint-disable @typescript-eslint/unified-signatures */
  /** @inheritdoc */
  /** @inheritdoc */
  on(t, n) {
    const r = this._hooks[t] = this._hooks[t] || [];
    return r.push(n), () => {
      const s = r.indexOf(n);
      s > -1 && r.splice(s, 1);
    };
  }
  /** @inheritdoc */
  /** @inheritdoc */
  emit(t, ...n) {
    const r = this._hooks[t];
    r && r.forEach((s) => s(...n));
  }
  /**
   * @inheritdoc
   */
  sendEnvelope(t) {
    return this.emit("beforeEnvelope", t), this._isEnabled() && this._transport ? this._transport.send(t).then(null, (n) => (fe && V.error("Error while sending envelope:", n), n)) : (fe && V.error("Transport disabled"), Un({}));
  }
  /* eslint-enable @typescript-eslint/unified-signatures */
  /** Setup integrations for this client. */
  _setupIntegrations() {
    const { integrations: t } = this._options;
    this._integrations = wy(this, t), ku(this, t);
  }
  /** Updates existing session based on the provided event */
  _updateSessionFromEvent(t, n) {
    let r = !1, s = !1;
    const o = n.exception && n.exception.values;
    if (o) {
      s = !0;
      for (const c of o) {
        const u = c.mechanism;
        if (u && u.handled === !1) {
          r = !0;
          break;
        }
      }
    }
    const i = t.status === "ok";
    (i && t.errors === 0 || i && r) && (Tr(t, {
      ...r && { status: "crashed" },
      errors: t.errors || Number(s || r)
    }), this.captureSession(t));
  }
  /**
   * Determine if the client is finished processing. Returns a promise because it will wait `timeout` ms before saying
   * "no" (resolving to `false`) in order to give the client a chance to potentially finish first.
   *
   * @param timeout The time, in ms, after which to resolve to `false` if the client is still busy. Passing `0` (or not
   * passing anything) will make the promise wait as long as it takes for processing to finish before resolving to
   * `true`.
   * @returns A promise which will resolve to `true` if processing is already done or finishes before the timeout, and
   * `false` otherwise
   */
  _isClientDoneProcessing(t) {
    return new Qe((n) => {
      let r = 0;
      const s = 1, o = setInterval(() => {
        this._numProcessing == 0 ? (clearInterval(o), n(!0)) : (r += s, t && r >= t && (clearInterval(o), n(!1)));
      }, s);
    });
  }
  /** Determines whether this SDK is enabled and a transport is present. */
  _isEnabled() {
    return this.getOptions().enabled !== !1 && this._transport !== void 0;
  }
  /**
   * Adds common information to events.
   *
   * The information includes release and environment from `options`,
   * breadcrumbs and context (extra, tags and user) from the scope.
   *
   * Information that is already present in the event is never overwritten. For
   * nested objects, such as the context, keys are merged.
   *
   * @param event The original event.
   * @param hint May contain additional information about the original exception.
   * @param currentScope A scope containing event metadata.
   * @returns A new event with more information.
   */
  _prepareEvent(t, n, r = zt(), s = bs()) {
    const o = this.getOptions(), i = Object.keys(this._integrations);
    return !n.integrations && i.length > 0 && (n.integrations = i), this.emit("preprocessEvent", t, n), t.type || s.setLastEventId(t.event_id || n.event_id), ny(o, t, n, r, this, s).then((a) => {
      if (a === null)
        return a;
      a.contexts = {
        trace: sg(r),
        ...a.contexts
      };
      const c = Cg(this, r);
      return a.sdkProcessingMetadata = {
        dynamicSamplingContext: c,
        ...a.sdkProcessingMetadata
      }, a;
    });
  }
  /**
   * Processes the event and logs an error in case of rejection
   * @param event
   * @param hint
   * @param scope
   */
  _captureEvent(t, n = {}, r) {
    return this._processEvent(t, n, r).then(
      (s) => s.event_id,
      (s) => {
        if (fe) {
          const o = s;
          o.logLevel === "log" ? V.log(o.message) : V.warn(o);
        }
      }
    );
  }
  /**
   * Processes an event (either error or message) and sends it to Sentry.
   *
   * This also adds breadcrumbs and context information to the event. However,
   * platform specific meta data (such as the User's IP address) must be added
   * by the SDK implementor.
   *
   *
   * @param event The event to send to Sentry.
   * @param hint May contain additional information about the original exception.
   * @param currentScope A scope containing event metadata.
   * @returns A SyncPromise that resolves with the event or rejects in case event was/will not be send.
   */
  _processEvent(t, n, r) {
    const s = this.getOptions(), { sampleRate: o } = s, i = Gd(t), a = Hd(t), c = t.type || "error", u = `before send for type \`${c}\``, f = typeof o > "u" ? void 0 : Rg(o);
    if (a && typeof f == "number" && Math.random() > f)
      return this.recordDroppedEvent("sample_rate", "error", t), wo(
        new St(
          `Discarding event because it's not included in the random sample (sampling rate = ${o})`,
          "log"
        )
      );
    const l = c === "replay_event" ? "replay" : c, p = (t.sdkProcessingMetadata || {}).capturedSpanIsolationScope;
    return this._prepareEvent(t, n, r, p).then((h) => {
      if (h === null)
        throw this.recordDroppedEvent("event_processor", l, t), new St("An event processor returned `null`, will not send event.", "log");
      if (n.data && n.data.__sentry__ === !0)
        return h;
      const g = vy(this, s, h, n);
      return Ty(g, u);
    }).then((h) => {
      if (h === null) {
        if (this.recordDroppedEvent("before_send", l, t), i) {
          const y = 1 + (t.spans || []).length;
          this.recordDroppedEvent("before_send", "span", y);
        }
        throw new St(`${u} returned \`null\`, will not send event.`, "log");
      }
      const m = r && r.getSession();
      if (!i && m && this._updateSessionFromEvent(m, h), i) {
        const _ = h.sdkProcessingMetadata && h.sdkProcessingMetadata.spanCountBeforeProcessing || 0, y = h.spans ? h.spans.length : 0, b = _ - y;
        b > 0 && this.recordDroppedEvent("before_send", "span", b);
      }
      const g = h.transaction_info;
      if (i && g && h.transaction !== t.transaction) {
        const _ = "custom";
        h.transaction_info = {
          ...g,
          source: _
        };
      }
      return this.sendEvent(h, n), h;
    }).then(null, (h) => {
      throw h instanceof St ? h : (this.captureException(h, {
        data: {
          __sentry__: !0
        },
        originalException: h
      }), new St(
        `Event processing pipeline threw an error, original event will not be sent. Details have been sent as a new event.
Reason: ${h}`
      ));
    });
  }
  /**
   * Occupies the client with processing and event
   */
  _process(t) {
    this._numProcessing++, t.then(
      (n) => (this._numProcessing--, n),
      (n) => (this._numProcessing--, n)
    );
  }
  /**
   * Clears outcomes on this client and returns them.
   */
  _clearOutcomes() {
    const t = this._outcomes;
    return this._outcomes = {}, Object.entries(t).map(([n, r]) => {
      const [s, o] = n.split(":");
      return {
        reason: s,
        category: o,
        quantity: r
      };
    });
  }
  /**
   * Sends client reports as an envelope.
   */
  _flushOutcomes() {
    fe && V.log("Flushing outcomes...");
    const t = this._clearOutcomes();
    if (t.length === 0) {
      fe && V.log("No outcomes to send");
      return;
    }
    if (!this._dsn) {
      fe && V.log("No dsn provided, will not send outcomes");
      return;
    }
    fe && V.log("Sending outcomes:", t);
    const n = Ey(t, this._options.tunnel && jo(this._dsn));
    this.sendEnvelope(n);
  }
  /**
   * @inheritDoc
   */
}
function Ty(e, t) {
  const n = `${t} must return \`null\` or a valid event.`;
  if (Go(e))
    return e.then(
      (r) => {
        if (!Er(r) && r !== null)
          throw new St(n);
        return r;
      },
      (r) => {
        throw new St(`${t} rejected with ${r}`);
      }
    );
  if (!Er(e) && e !== null)
    throw new St(n);
  return e;
}
function vy(e, t, n, r) {
  const { beforeSend: s, beforeSendTransaction: o, beforeSendSpan: i } = t;
  if (Hd(n) && s)
    return s(n, r);
  if (Gd(n)) {
    if (n.spans && i) {
      const a = [];
      for (const c of n.spans) {
        const u = i(c);
        u ? a.push(u) : (vg(), e.recordDroppedEvent("before_send", "span"));
      }
      n.spans = a;
    }
    if (o) {
      if (n.spans) {
        const a = n.spans.length;
        n.sdkProcessingMetadata = {
          ...n.sdkProcessingMetadata,
          spanCountBeforeProcessing: a
        };
      }
      return o(n, r);
    }
  }
  return n;
}
function Hd(e) {
  return e.type === void 0;
}
function Gd(e) {
  return e.type === "transaction";
}
function Iy(e, t) {
  t.debug === !0 && (fe ? V.enable() : Kn(() => {
    console.warn("[Sentry] Cannot initialize SDK with `debug` option using a non-debug bundle.");
  })), zt().update(t.initialScope);
  const r = new e(t);
  return ky(r), r.init(), r;
}
function ky(e) {
  zt().setClient(e);
}
function Cy(e) {
  const t = [];
  function n() {
    return e === void 0 || t.length < e;
  }
  function r(i) {
    return t.splice(t.indexOf(i), 1)[0] || Promise.resolve(void 0);
  }
  function s(i) {
    if (!n())
      return wo(new St("Not adding Promise because buffer limit was reached."));
    const a = i();
    return t.indexOf(a) === -1 && t.push(a), a.then(() => r(a)).then(
      null,
      () => r(a).then(null, () => {
      })
    ), a;
  }
  function o(i) {
    return new Qe((a, c) => {
      let u = t.length;
      if (!u)
        return a(!0);
      const f = setTimeout(() => {
        i && i > 0 && a(!1);
      }, i);
      t.forEach((l) => {
        Un(l).then(() => {
          --u || (clearTimeout(f), a(!0));
        }, c);
      });
    });
  }
  return {
    $: t,
    add: s,
    drain: o
  };
}
const Ay = 60 * 1e3;
function Ry(e, t = Date.now()) {
  const n = parseInt(`${e}`, 10);
  if (!isNaN(n))
    return n * 1e3;
  const r = Date.parse(`${e}`);
  return isNaN(r) ? Ay : r - t;
}
function xy(e, t) {
  return e[t] || e.all || 0;
}
function Oy(e, t, n = Date.now()) {
  return xy(e, t) > n;
}
function Ly(e, { statusCode: t, headers: n }, r = Date.now()) {
  const s = {
    ...e
  }, o = n && n["x-sentry-rate-limits"], i = n && n["retry-after"];
  if (o)
    for (const a of o.trim().split(",")) {
      const [c, u, , , f] = a.split(":", 5), l = parseInt(c, 10), d = (isNaN(l) ? 60 : l) * 1e3;
      if (!u)
        s.all = r + d;
      else
        for (const p of u.split(";"))
          p === "metric_bucket" ? (!f || f.split(";").includes("custom")) && (s[p] = r + d) : s[p] = r + d;
    }
  else i ? s.all = r + Ry(i, r) : t === 429 && (s.all = r + 60 * 1e3);
  return s;
}
const Ny = 64;
function My(e, t, n = Cy(
  e.bufferSize || Ny
)) {
  let r = {};
  const s = (i) => n.drain(i);
  function o(i) {
    const a = [];
    if (bu(i, (l, d) => {
      const p = wu(d);
      if (Oy(r, p)) {
        const h = Au(l, d);
        e.recordDroppedEvent("ratelimit_backoff", p, h);
      } else
        a.push(l);
    }), a.length === 0)
      return Un({});
    const c = ws(i[0], a), u = (l) => {
      bu(c, (d, p) => {
        const h = Au(d, p);
        e.recordDroppedEvent(l, wu(p), h);
      });
    }, f = () => t({ body: Vg(c) }).then(
      (l) => (l.statusCode !== void 0 && (l.statusCode < 200 || l.statusCode >= 300) && fe && V.warn(`Sentry responded with status code ${l.statusCode} to sent event.`), r = Ly(r, l), l),
      (l) => {
        throw u("network_error"), l;
      }
    );
    return n.add(f).then(
      (l) => l,
      (l) => {
        if (l instanceof St)
          return fe && V.error("Skipped sending event because buffer is full."), u("queue_overflow"), Un({});
        throw l;
      }
    );
  }
  return {
    send: o,
    flush: s
  };
}
function Au(e, t) {
  if (!(t !== "event" && t !== "transaction"))
    return Array.isArray(e) ? e[1] : void 0;
}
function Py(e, t, n = [t], r = "npm") {
  const s = e._metadata || {};
  s.sdk || (s.sdk = {
    name: `sentry.javascript.${t}`,
    packages: n.map((o) => ({
      name: `${r}:@sentry/${o}`,
      version: Ln
    })),
    version: Ln
  }), e._metadata = s;
}
const Dy = 100;
function Fn(e, t) {
  const n = De(), r = bs();
  if (!n) return;
  const { beforeBreadcrumb: s = null, maxBreadcrumbs: o = Dy } = n.getOptions();
  if (o <= 0) return;
  const a = { timestamp: _s(), ...e }, c = s ? Kn(() => s(a, t)) : a;
  c !== null && (n.emit && n.emit("beforeAddBreadcrumb", c, t), r.addBreadcrumb(c, o));
}
let Ru;
const Uy = "FunctionToString", xu = /* @__PURE__ */ new WeakMap(), Fy = (() => ({
  name: Uy,
  setupOnce() {
    Ru = Function.prototype.toString;
    try {
      Function.prototype.toString = function(...e) {
        const t = sc(this), n = xu.has(De()) && t !== void 0 ? t : this;
        return Ru.apply(n, e);
      };
    } catch {
    }
  },
  setup(e) {
    xu.set(e, !0);
  }
})), $y = Fy, By = [
  /^Script error\.?$/,
  /^Javascript error: Script error\.? on line 0$/,
  /^ResizeObserver loop completed with undelivered notifications.$/,
  // The browser logs this when a ResizeObserver handler takes a bit longer. Usually this is not an actual issue though. It indicates slowness.
  /^Cannot redefine property: googletag$/,
  // This is thrown when google tag manager is used in combination with an ad blocker
  "undefined is not an object (evaluating 'a.L')",
  // Random error that happens but not actionable or noticeable to end-users.
  `can't redefine non-configurable property "solana"`,
  // Probably a browser extension or custom browser (Brave) throwing this error
  "vv().getRestrictions is not a function. (In 'vv().getRestrictions(1,a)', 'vv().getRestrictions' is undefined)",
  // Error thrown by GTM, seemingly not affecting end-users
  "Can't find variable: _AutofillCallbackHandler",
  // Unactionable error in instagram webview https://developers.facebook.com/community/threads/320013549791141/
  /^Non-Error promise rejection captured with value: Object Not Found Matching Id:\d+, MethodName:simulateEvent, ParamCount:\d+$/
  // unactionable error from CEFSharp, a .NET library that embeds chromium in .NET apps
], Vy = "InboundFilters", Wy = ((e = {}) => ({
  name: Vy,
  processEvent(t, n, r) {
    const s = r.getOptions(), o = Gy(e, s);
    return zy(t, o) ? null : t;
  }
})), Hy = Wy;
function Gy(e = {}, t = {}) {
  return {
    allowUrls: [...e.allowUrls || [], ...t.allowUrls || []],
    denyUrls: [...e.denyUrls || [], ...t.denyUrls || []],
    ignoreErrors: [
      ...e.ignoreErrors || [],
      ...t.ignoreErrors || [],
      ...e.disableErrorDefaults ? [] : By
    ],
    ignoreTransactions: [...e.ignoreTransactions || [], ...t.ignoreTransactions || []],
    ignoreInternal: e.ignoreInternal !== void 0 ? e.ignoreInternal : !0
  };
}
function zy(e, t) {
  return t.ignoreInternal && Jy(e) ? (fe && V.warn(`Event dropped due to being internal Sentry Error.
Event: ${Zt(e)}`), !0) : Ky(e, t.ignoreErrors) ? (fe && V.warn(
    `Event dropped due to being matched by \`ignoreErrors\` option.
Event: ${Zt(e)}`
  ), !0) : Qy(e) ? (fe && V.warn(
    `Event dropped due to not having an error message, error type or stacktrace.
Event: ${Zt(
      e
    )}`
  ), !0) : jy(e, t.ignoreTransactions) ? (fe && V.warn(
    `Event dropped due to being matched by \`ignoreTransactions\` option.
Event: ${Zt(e)}`
  ), !0) : qy(e, t.denyUrls) ? (fe && V.warn(
    `Event dropped due to being matched by \`denyUrls\` option.
Event: ${Zt(
      e
    )}.
Url: ${Eo(e)}`
  ), !0) : Xy(e, t.allowUrls) ? !1 : (fe && V.warn(
    `Event dropped due to not being matched by \`allowUrls\` option.
Event: ${Zt(
      e
    )}.
Url: ${Eo(e)}`
  ), !0);
}
function Ky(e, t) {
  return e.type || !t || !t.length ? !1 : Yy(e).some((n) => zo(n, t));
}
function jy(e, t) {
  if (e.type !== "transaction" || !t || !t.length)
    return !1;
  const n = e.transaction;
  return n ? zo(n, t) : !1;
}
function qy(e, t) {
  if (!t || !t.length)
    return !1;
  const n = Eo(e);
  return n ? zo(n, t) : !1;
}
function Xy(e, t) {
  if (!t || !t.length)
    return !0;
  const n = Eo(e);
  return n ? zo(n, t) : !0;
}
function Yy(e) {
  const t = [];
  e.message && t.push(e.message);
  let n;
  try {
    n = e.exception.values[e.exception.values.length - 1];
  } catch {
  }
  return n && n.value && (t.push(n.value), n.type && t.push(`${n.type}: ${n.value}`)), t;
}
function Jy(e) {
  try {
    return e.exception.values[0].type === "SentryError";
  } catch {
  }
  return !1;
}
function Zy(e = []) {
  for (let t = e.length - 1; t >= 0; t--) {
    const n = e[t];
    if (n && n.filename !== "<anonymous>" && n.filename !== "[native code]")
      return n.filename || null;
  }
  return null;
}
function Eo(e) {
  try {
    let t;
    try {
      t = e.exception.values[0].stacktrace.frames;
    } catch {
    }
    return t ? Zy(t) : null;
  } catch {
    return fe && V.error(`Cannot extract url for event ${Zt(e)}`), null;
  }
}
function Qy(e) {
  return e.type || !e.exception || !e.exception.values || e.exception.values.length === 0 ? !1 : (
    // No top-level message
    !e.message && // There are no exception values that have a stacktrace, a non-generic-Error type or value
    !e.exception.values.some((t) => t.stacktrace || t.type && t.type !== "Error" || t.value)
  );
}
function e_(e, t, n = 250, r, s, o, i) {
  if (!o.exception || !o.exception.values || !i || !Pn(i.originalException, Error))
    return;
  const a = o.exception.values.length > 0 ? o.exception.values[o.exception.values.length - 1] : void 0;
  a && (o.exception.values = t_(
    la(
      e,
      t,
      s,
      i.originalException,
      r,
      o.exception.values,
      a,
      0
    ),
    n
  ));
}
function la(e, t, n, r, s, o, i, a) {
  if (o.length >= n + 1)
    return o;
  let c = [...o];
  if (Pn(r[s], Error)) {
    Ou(i, a);
    const u = e(t, r[s]), f = c.length;
    Lu(u, s, f, a), c = la(
      e,
      t,
      n,
      r[s],
      s,
      [u, ...c],
      u,
      f
    );
  }
  return Array.isArray(r.errors) && r.errors.forEach((u, f) => {
    if (Pn(u, Error)) {
      Ou(i, a);
      const l = e(t, u), d = c.length;
      Lu(l, `errors[${f}]`, d, a), c = la(
        e,
        t,
        n,
        u,
        s,
        [l, ...c],
        l,
        d
      );
    }
  }), c;
}
function Ou(e, t) {
  e.mechanism = e.mechanism || { type: "generic", handled: !0 }, e.mechanism = {
    ...e.mechanism,
    ...e.type === "AggregateError" && { is_exception_group: !0 },
    exception_id: t
  };
}
function Lu(e, t, n, r) {
  e.mechanism = e.mechanism || { type: "generic", handled: !0 }, e.mechanism = {
    ...e.mechanism,
    type: "chained",
    source: t,
    exception_id: n,
    parent_id: r
  };
}
function t_(e, t) {
  return e.map((n) => (n.value && (n.value = gr(n.value, t)), n));
}
function vi(e) {
  if (!e)
    return {};
  const t = e.match(/^(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/);
  if (!t)
    return {};
  const n = t[6] || "", r = t[8] || "";
  return {
    host: t[4],
    path: t[5],
    protocol: t[2],
    search: n,
    hash: r,
    relative: t[5] + n + r
    // everything minus origin
  };
}
function n_(e) {
  const t = "console";
  jn(t, e), qn(t, r_);
}
function r_() {
  "console" in se && na.forEach(function(e) {
    e in se.console && Je(se.console, e, function(t) {
      return bo[e] = t, function(...n) {
        pt("console", { args: n, level: e });
        const s = bo[e];
        s && s.apply(se.console, n);
      };
    });
  });
}
function s_(e) {
  return e === "warn" ? "warning" : ["fatal", "error", "warning", "log", "info", "debug"].includes(e) ? e : "log";
}
const o_ = "Dedupe", i_ = (() => {
  let e;
  return {
    name: o_,
    processEvent(t) {
      if (t.type)
        return t;
      try {
        if (c_(t, e))
          return fe && V.warn("Event dropped due to being a duplicate of previously captured event."), null;
      } catch {
      }
      return e = t;
    }
  };
}), a_ = i_;
function c_(e, t) {
  return t ? !!(u_(e, t) || l_(e, t)) : !1;
}
function u_(e, t) {
  const n = e.message, r = t.message;
  return !(!n && !r || n && !r || !n && r || n !== r || !Kd(e, t) || !zd(e, t));
}
function l_(e, t) {
  const n = Nu(t), r = Nu(e);
  return !(!n || !r || n.type !== r.type || n.value !== r.value || !Kd(e, t) || !zd(e, t));
}
function zd(e, t) {
  let n = su(e), r = su(t);
  if (!n && !r)
    return !0;
  if (n && !r || !n && r || (n = n, r = r, r.length !== n.length))
    return !1;
  for (let s = 0; s < r.length; s++) {
    const o = r[s], i = n[s];
    if (o.filename !== i.filename || o.lineno !== i.lineno || o.colno !== i.colno || o.function !== i.function)
      return !1;
  }
  return !0;
}
function Kd(e, t) {
  let n = e.fingerprint, r = t.fingerprint;
  if (!n && !r)
    return !0;
  if (n && !r || !n && r)
    return !1;
  n = n, r = r;
  try {
    return n.join("") === r.join("");
  } catch {
    return !1;
  }
}
function Nu(e) {
  return e.exception && e.exception.values && e.exception.values[0];
}
function jd(e) {
  if (e !== void 0)
    return e >= 400 && e < 500 ? "warning" : e >= 500 ? "error" : void 0;
}
const da = se;
function qd() {
  if (!("fetch" in da))
    return !1;
  try {
    return new Headers(), new Request("http://www.example.com"), new Response(), !0;
  } catch {
    return !1;
  }
}
function fa(e) {
  return e && /^function\s+\w+\(\)\s+\{\s+\[native code\]\s+\}$/.test(e.toString());
}
function d_() {
  if (typeof EdgeRuntime == "string")
    return !0;
  if (!qd())
    return !1;
  if (fa(da.fetch))
    return !0;
  let e = !1;
  const t = da.document;
  if (t && typeof t.createElement == "function")
    try {
      const n = t.createElement("iframe");
      n.hidden = !0, t.head.appendChild(n), n.contentWindow && n.contentWindow.fetch && (e = fa(n.contentWindow.fetch)), t.head.removeChild(n);
    } catch (n) {
      zn && V.warn("Could not create sandbox iframe for pure fetch check, bailing to window.fetch: ", n);
    }
  return e;
}
function f_(e, t) {
  const n = "fetch";
  jn(n, e), qn(n, () => p_(void 0, t));
}
function p_(e, t = !1) {
  t && !d_() || Je(se, "fetch", function(n) {
    return function(...r) {
      const s = new Error(), { method: o, url: i } = h_(r), a = {
        args: r,
        fetchData: {
          method: o,
          url: i
        },
        startTimestamp: $t() * 1e3,
        // // Adding the error to be able to fingerprint the failed fetch event in HttpClient instrumentation
        virtualError: s
      };
      return pt("fetch", {
        ...a
      }), n.apply(se, r).then(
        async (c) => (pt("fetch", {
          ...a,
          endTimestamp: $t() * 1e3,
          response: c
        }), c),
        (c) => {
          throw pt("fetch", {
            ...a,
            endTimestamp: $t() * 1e3,
            error: c
          }), ec(c) && c.stack === void 0 && (c.stack = s.stack, Dn(c, "framesToPop", 1)), c;
        }
      );
    };
  });
}
function pa(e, t) {
  return !!e && typeof e == "object" && !!e[t];
}
function Mu(e) {
  return typeof e == "string" ? e : e ? pa(e, "url") ? e.url : e.toString ? e.toString() : "" : "";
}
function h_(e) {
  if (e.length === 0)
    return { method: "GET", url: "" };
  if (e.length === 2) {
    const [n, r] = e;
    return {
      url: Mu(n),
      method: pa(r, "method") ? String(r.method).toUpperCase() : "GET"
    };
  }
  const t = e[0];
  return {
    url: Mu(t),
    method: pa(t, "method") ? String(t.method).toUpperCase() : "GET"
  };
}
function m_() {
  return "npm";
}
const Ws = se;
function g_() {
  const e = Ws.chrome, t = e && e.app && e.app.runtime, n = "history" in Ws && !!Ws.history.pushState && !!Ws.history.replaceState;
  return !t && n;
}
const pe = se;
let ha = 0;
function Xd() {
  return ha > 0;
}
function y_() {
  ha++, setTimeout(() => {
    ha--;
  });
}
function Ir(e, t = {}) {
  function n(s) {
    return typeof s == "function";
  }
  if (!n(e))
    return e;
  try {
    const s = e.__sentry_wrapped__;
    if (s)
      return typeof s == "function" ? s : e;
    if (sc(e))
      return e;
  } catch {
    return e;
  }
  const r = function(...s) {
    try {
      const o = s.map((i) => Ir(i, t));
      return e.apply(this, o);
    } catch (o) {
      throw y_(), rg((i) => {
        i.addEventProcessor((a) => (t.mechanism && (sa(a, void 0), Sr(a, t.mechanism)), a.extra = {
          ...a.extra,
          arguments: s
        }, a)), Fd(o);
      }), o;
    }
  };
  try {
    for (const s in e)
      Object.prototype.hasOwnProperty.call(e, s) && (r[s] = e[s]);
  } catch {
  }
  Rd(r, e), Dn(e, "__sentry_wrapped__", r);
  try {
    Object.getOwnPropertyDescriptor(r, "name").configurable && Object.defineProperty(r, "name", {
      get() {
        return e.name;
      }
    });
  } catch {
  }
  return r;
}
const Es = typeof __SENTRY_DEBUG__ > "u" || __SENTRY_DEBUG__;
function uc(e, t) {
  const n = lc(e, t), r = {
    type: S_(t),
    value: T_(t)
  };
  return n.length && (r.stacktrace = { frames: n }), r.type === void 0 && r.value === "" && (r.value = "Unrecoverable error caught"), r;
}
function __(e, t, n, r) {
  const s = De(), o = s && s.getOptions().normalizeDepth, i = A_(t), a = {
    __serialized__: Dd(t, o)
  };
  if (i)
    return {
      exception: {
        values: [uc(e, i)]
      },
      extra: a
    };
  const c = {
    exception: {
      values: [
        {
          type: Ho(t) ? t.constructor.name : r ? "UnhandledRejection" : "Error",
          value: k_(t, { isUnhandledRejection: r })
        }
      ]
    },
    extra: a
  };
  if (n) {
    const u = lc(e, n);
    u.length && (c.exception.values[0].stacktrace = { frames: u });
  }
  return c;
}
function Ii(e, t) {
  return {
    exception: {
      values: [uc(e, t)]
    }
  };
}
function lc(e, t) {
  const n = t.stacktrace || t.stack || "", r = w_(t), s = E_(t);
  try {
    return e(n, r, s);
  } catch {
  }
  return [];
}
const b_ = /Minified React error #\d+;/i;
function w_(e) {
  return e && b_.test(e.message) ? 1 : 0;
}
function E_(e) {
  return typeof e.framesToPop == "number" ? e.framesToPop : 0;
}
function Yd(e) {
  return typeof WebAssembly < "u" && typeof WebAssembly.Exception < "u" ? e instanceof WebAssembly.Exception : !1;
}
function S_(e) {
  const t = e && e.name;
  return !t && Yd(e) ? e.message && Array.isArray(e.message) && e.message.length == 2 ? e.message[0] : "WebAssembly.Exception" : t;
}
function T_(e) {
  const t = e && e.message;
  return t ? t.error && typeof t.error.message == "string" ? t.error.message : Yd(e) && Array.isArray(e.message) && e.message.length == 2 ? e.message[1] : t : "No error message";
}
function v_(e, t, n, r) {
  const s = n && n.syntheticException || void 0, o = dc(e, t, s, r);
  return Sr(o), o.level = "error", n && n.event_id && (o.event_id = n.event_id), Un(o);
}
function I_(e, t, n = "info", r, s) {
  const o = r && r.syntheticException || void 0, i = ma(e, t, o, s);
  return i.level = n, r && r.event_id && (i.event_id = r.event_id), Un(i);
}
function dc(e, t, n, r, s) {
  let o;
  if (kd(t) && t.error)
    return Ii(e, t.error);
  if (iu(t) || Nm(t)) {
    const i = t;
    if ("stack" in t)
      o = Ii(e, t);
    else {
      const a = i.name || (iu(i) ? "DOMError" : "DOMException"), c = i.message ? `${a}: ${i.message}` : a;
      o = ma(e, c, n, r), sa(o, c);
    }
    return "code" in i && (o.tags = { ...o.tags, "DOMException.code": `${i.code}` }), o;
  }
  return ec(t) ? Ii(e, t) : Er(t) || Ho(t) ? (o = __(e, t, n, s), Sr(o, {
    synthetic: !0
  }), o) : (o = ma(e, t, n, r), sa(o, `${t}`), Sr(o, {
    synthetic: !0
  }), o);
}
function ma(e, t, n, r) {
  const s = {};
  if (r && n) {
    const o = lc(e, n);
    o.length && (s.exception = {
      values: [{ value: t, stacktrace: { frames: o } }]
    }), Sr(s, { synthetic: !0 });
  }
  if (tc(t)) {
    const { __sentry_template_string__: o, __sentry_template_values__: i } = t;
    return s.logentry = {
      message: o,
      params: i
    }, s;
  }
  return s.message = t, s;
}
function k_(e, { isUnhandledRejection: t }) {
  const n = Wm(e), r = t ? "promise rejection" : "exception";
  return kd(e) ? `Event \`ErrorEvent\` captured as ${r} with message \`${e.message}\`` : Ho(e) ? `Event \`${C_(e)}\` (type=${e.type}) captured as ${r}` : `Object captured as ${r} with keys: ${n}`;
}
function C_(e) {
  try {
    const t = Object.getPrototypeOf(e);
    return t ? t.constructor.name : void 0;
  } catch {
  }
}
function A_(e) {
  for (const t in e)
    if (Object.prototype.hasOwnProperty.call(e, t)) {
      const n = e[t];
      if (n instanceof Error)
        return n;
    }
}
function R_(e, {
  metadata: t,
  tunnel: n,
  dsn: r
}) {
  const s = {
    event_id: e.event_id,
    sent_at: (/* @__PURE__ */ new Date()).toISOString(),
    ...t && t.sdk && {
      sdk: {
        name: t.sdk.name,
        version: t.sdk.version
      }
    },
    ...!!n && !!r && { dsn: jo(r) }
  }, o = x_(e);
  return ws(s, [o]);
}
function x_(e) {
  return [{
    type: "user_report"
  }, e];
}
class O_ extends Sy {
  /**
   * Creates a new Browser SDK instance.
   *
   * @param options Configuration options for this SDK.
   */
  constructor(t) {
    const n = {
      // We default this to true, as it is the safer scenario
      parentSpanIsAlwaysRootSpan: !0,
      ...t
    }, r = pe.SENTRY_SDK_SOURCE || m_();
    Py(n, "browser", ["browser"], r), super(n), n.sendClientReports && pe.document && pe.document.addEventListener("visibilitychange", () => {
      pe.document.visibilityState === "hidden" && this._flushOutcomes();
    });
  }
  /**
   * @inheritDoc
   */
  eventFromException(t, n) {
    return v_(this._options.stackParser, t, n, this._options.attachStacktrace);
  }
  /**
   * @inheritDoc
   */
  eventFromMessage(t, n = "info", r) {
    return I_(this._options.stackParser, t, n, r, this._options.attachStacktrace);
  }
  /**
   * Sends user feedback to Sentry.
   *
   * @deprecated Use `captureFeedback` instead.
   */
  captureUserFeedback(t) {
    if (!this._isEnabled()) {
      Es && V.warn("SDK not enabled, will not capture user feedback.");
      return;
    }
    const n = R_(t, {
      metadata: this.getSdkMetadata(),
      dsn: this.getDsn(),
      tunnel: this.getOptions().tunnel
    });
    this.sendEnvelope(n);
  }
  /**
   * @inheritDoc
   */
  _prepareEvent(t, n, r) {
    return t.platform = t.platform || "javascript", super._prepareEvent(t, n, r);
  }
}
const L_ = typeof __SENTRY_DEBUG__ > "u" || __SENTRY_DEBUG__, Be = se, N_ = 1e3;
let Pu, ga, ya;
function M_(e) {
  jn("dom", e), qn("dom", P_);
}
function P_() {
  if (!Be.document)
    return;
  const e = pt.bind(null, "dom"), t = Du(e, !0);
  Be.document.addEventListener("click", t, !1), Be.document.addEventListener("keypress", t, !1), ["EventTarget", "Node"].forEach((n) => {
    const s = Be[n], o = s && s.prototype;
    !o || !o.hasOwnProperty || !o.hasOwnProperty("addEventListener") || (Je(o, "addEventListener", function(i) {
      return function(a, c, u) {
        if (a === "click" || a == "keypress")
          try {
            const f = this.__sentry_instrumentation_handlers__ = this.__sentry_instrumentation_handlers__ || {}, l = f[a] = f[a] || { refCount: 0 };
            if (!l.handler) {
              const d = Du(e);
              l.handler = d, i.call(this, a, d, u);
            }
            l.refCount++;
          } catch {
          }
        return i.call(this, a, c, u);
      };
    }), Je(
      o,
      "removeEventListener",
      function(i) {
        return function(a, c, u) {
          if (a === "click" || a == "keypress")
            try {
              const f = this.__sentry_instrumentation_handlers__ || {}, l = f[a];
              l && (l.refCount--, l.refCount <= 0 && (i.call(this, a, l.handler, u), l.handler = void 0, delete f[a]), Object.keys(f).length === 0 && delete this.__sentry_instrumentation_handlers__);
            } catch {
            }
          return i.call(this, a, c, u);
        };
      }
    ));
  });
}
function D_(e) {
  if (e.type !== ga)
    return !1;
  try {
    if (!e.target || e.target._sentryId !== ya)
      return !1;
  } catch {
  }
  return !0;
}
function U_(e, t) {
  return e !== "keypress" ? !1 : !t || !t.tagName ? !0 : !(t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
}
function Du(e, t = !1) {
  return (n) => {
    if (!n || n._sentryCaptured)
      return;
    const r = F_(n);
    if (U_(n.type, r))
      return;
    Dn(n, "_sentryCaptured", !0), r && !r._sentryId && Dn(r, "_sentryId", st());
    const s = n.type === "keypress" ? "input" : n.type;
    D_(n) || (e({ event: n, name: s, global: t }), ga = n.type, ya = r ? r._sentryId : void 0), clearTimeout(Pu), Pu = Be.setTimeout(() => {
      ya = void 0, ga = void 0;
    }, N_);
  };
}
function F_(e) {
  try {
    return e.target;
  } catch {
    return null;
  }
}
let Hs;
function Jd(e) {
  const t = "history";
  jn(t, e), qn(t, $_);
}
function $_() {
  if (!g_())
    return;
  const e = Be.onpopstate;
  Be.onpopstate = function(...n) {
    const r = Be.location.href, s = Hs;
    if (Hs = r, pt("history", { from: s, to: r }), e)
      try {
        return e.apply(this, n);
      } catch {
      }
  };
  function t(n) {
    return function(...r) {
      const s = r.length > 2 ? r[2] : void 0;
      if (s) {
        const o = Hs, i = String(s);
        Hs = i, pt("history", { from: o, to: i });
      }
      return n.apply(this, r);
    };
  }
  Je(Be.history, "pushState", t), Je(Be.history, "replaceState", t);
}
const oo = {};
function B_(e) {
  const t = oo[e];
  if (t)
    return t;
  let n = Be[e];
  if (fa(n))
    return oo[e] = n.bind(Be);
  const r = Be.document;
  if (r && typeof r.createElement == "function")
    try {
      const s = r.createElement("iframe");
      s.hidden = !0, r.head.appendChild(s);
      const o = s.contentWindow;
      o && o[e] && (n = o[e]), r.head.removeChild(s);
    } catch (s) {
      L_ && V.warn(`Could not create sandbox iframe for ${e} check, bailing to window.${e}: `, s);
    }
  return n && (oo[e] = n.bind(Be));
}
function Uu(e) {
  oo[e] = void 0;
}
const Jr = "__sentry_xhr_v3__";
function V_(e) {
  jn("xhr", e), qn("xhr", W_);
}
function W_() {
  if (!Be.XMLHttpRequest)
    return;
  const e = XMLHttpRequest.prototype;
  e.open = new Proxy(e.open, {
    apply(t, n, r) {
      const s = new Error(), o = $t() * 1e3, i = Ft(r[0]) ? r[0].toUpperCase() : void 0, a = H_(r[1]);
      if (!i || !a)
        return t.apply(n, r);
      n[Jr] = {
        method: i,
        url: a,
        request_headers: {}
      }, i === "POST" && a.match(/sentry_key/) && (n.__sentry_own_request__ = !0);
      const c = () => {
        const u = n[Jr];
        if (u && n.readyState === 4) {
          try {
            u.status_code = n.status;
          } catch {
          }
          const f = {
            endTimestamp: $t() * 1e3,
            startTimestamp: o,
            xhr: n,
            virtualError: s
          };
          pt("xhr", f);
        }
      };
      return "onreadystatechange" in n && typeof n.onreadystatechange == "function" ? n.onreadystatechange = new Proxy(n.onreadystatechange, {
        apply(u, f, l) {
          return c(), u.apply(f, l);
        }
      }) : n.addEventListener("readystatechange", c), n.setRequestHeader = new Proxy(n.setRequestHeader, {
        apply(u, f, l) {
          const [d, p] = l, h = f[Jr];
          return h && Ft(d) && Ft(p) && (h.request_headers[d.toLowerCase()] = p), u.apply(f, l);
        }
      }), t.apply(n, r);
    }
  }), e.send = new Proxy(e.send, {
    apply(t, n, r) {
      const s = n[Jr];
      if (!s)
        return t.apply(n, r);
      r[0] !== void 0 && (s.body = r[0]);
      const o = {
        startTimestamp: $t() * 1e3,
        xhr: n
      };
      return pt("xhr", o), t.apply(n, r);
    }
  });
}
function H_(e) {
  if (Ft(e))
    return e;
  try {
    return e.toString();
  } catch {
  }
}
function G_(e, t = B_("fetch")) {
  let n = 0, r = 0;
  function s(o) {
    const i = o.body.length;
    n += i, r++;
    const a = {
      body: o.body,
      method: "POST",
      referrerPolicy: "origin",
      headers: e.headers,
      // Outgoing requests are usually cancelled when navigating to a different page, causing a "TypeError: Failed to
      // fetch" error and sending a "network_error" client-outcome - in Chrome, the request status shows "(cancelled)".
      // The `keepalive` flag keeps outgoing requests alive, even when switching pages. We want this since we're
      // frequently sending events right before the user is switching pages (eg. when finishing navigation transactions).
      // Gotchas:
      // - `keepalive` isn't supported by Firefox
      // - As per spec (https://fetch.spec.whatwg.org/#http-network-or-cache-fetch):
      //   If the sum of contentLength and inflightKeepaliveBytes is greater than 64 kibibytes, then return a network error.
      //   We will therefore only activate the flag when we're below that limit.
      // There is also a limit of requests that can be open at the same time, so we also limit this to 15
      // See https://github.com/getsentry/sentry-javascript/pull/7553 for details
      keepalive: n <= 6e4 && r < 15,
      ...e.fetchOptions
    };
    if (!t)
      return Uu("fetch"), wo("No fetch implementation available");
    try {
      return t(e.url, a).then((c) => (n -= i, r--, {
        statusCode: c.status,
        headers: {
          "x-sentry-rate-limits": c.headers.get("X-Sentry-Rate-Limits"),
          "retry-after": c.headers.get("Retry-After")
        }
      }));
    } catch (c) {
      return Uu("fetch"), n -= i, r--, wo(c);
    }
  }
  return My(e, s);
}
const z_ = 30, K_ = 50;
function _a(e, t, n, r) {
  const s = {
    filename: e,
    function: t === "<anonymous>" ? Mn : t,
    in_app: !0
    // All browser frames are considered in_app
  };
  return n !== void 0 && (s.lineno = n), r !== void 0 && (s.colno = r), s;
}
const j_ = /^\s*at (\S+?)(?::(\d+))(?::(\d+))\s*$/i, q_ = /^\s*at (?:(.+?\)(?: \[.+\])?|.*?) ?\((?:address at )?)?(?:async )?((?:<anonymous>|[-a-z]+:|.*bundle|\/)?.*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i, X_ = /\((\S*)(?::(\d+))(?::(\d+))\)/, Y_ = (e) => {
  const t = j_.exec(e);
  if (t) {
    const [, r, s, o] = t;
    return _a(r, Mn, +s, +o);
  }
  const n = q_.exec(e);
  if (n) {
    if (n[2] && n[2].indexOf("eval") === 0) {
      const i = X_.exec(n[2]);
      i && (n[2] = i[1], n[3] = i[2], n[4] = i[3]);
    }
    const [s, o] = Zd(n[1] || Mn, n[2]);
    return _a(o, s, n[3] ? +n[3] : void 0, n[4] ? +n[4] : void 0);
  }
}, J_ = [z_, Y_], Z_ = /^\s*(.*?)(?:\((.*?)\))?(?:^|@)?((?:[-a-z]+)?:\/.*?|\[native code\]|[^@]*(?:bundle|\d+\.js)|\/[\w\-. /=]+)(?::(\d+))?(?::(\d+))?\s*$/i, Q_ = /(\S+) line (\d+)(?: > eval line \d+)* > eval/i, eb = (e) => {
  const t = Z_.exec(e);
  if (t) {
    if (t[3] && t[3].indexOf(" > eval") > -1) {
      const o = Q_.exec(t[3]);
      o && (t[1] = t[1] || "eval", t[3] = o[1], t[4] = o[2], t[5] = "");
    }
    let r = t[3], s = t[1] || Mn;
    return [s, r] = Zd(s, r), _a(r, s, t[4] ? +t[4] : void 0, t[5] ? +t[5] : void 0);
  }
}, tb = [K_, eb], nb = [J_, tb], rb = vd(...nb), Zd = (e, t) => {
  const n = e.indexOf("safari-extension") !== -1, r = e.indexOf("safari-web-extension") !== -1;
  return n || r ? [
    e.indexOf("@") !== -1 ? e.split("@")[0] : Mn,
    n ? `safari-extension:${t}` : `safari-web-extension:${t}`
  ] : [e, t];
}, Gs = 1024, sb = "Breadcrumbs", ob = ((e = {}) => {
  const t = {
    console: !0,
    dom: !0,
    fetch: !0,
    history: !0,
    sentry: !0,
    xhr: !0,
    ...e
  };
  return {
    name: sb,
    setup(n) {
      t.console && n_(ub(n)), t.dom && M_(cb(n, t.dom)), t.xhr && V_(lb(n)), t.fetch && f_(db(n)), t.history && Jd(fb(n)), t.sentry && n.on("beforeSendEvent", ab(n));
    }
  };
}), ib = ob;
function ab(e) {
  return function(n) {
    De() === e && Fn(
      {
        category: `sentry.${n.type === "transaction" ? "transaction" : "event"}`,
        event_id: n.event_id,
        level: n.level,
        message: Zt(n)
      },
      {
        event: n
      }
    );
  };
}
function cb(e, t) {
  return function(r) {
    if (De() !== e)
      return;
    let s, o, i = typeof t == "object" ? t.serializeAttribute : void 0, a = typeof t == "object" && typeof t.maxStringLength == "number" ? t.maxStringLength : void 0;
    a && a > Gs && (Es && V.warn(
      `\`dom.maxStringLength\` cannot exceed ${Gs}, but a value of ${a} was configured. Sentry will use ${Gs} instead.`
    ), a = Gs), typeof i == "string" && (i = [i]);
    try {
      const u = r.event, f = pb(u) ? u.target : u;
      s = Ad(f, { keyAttrs: i, maxStringLength: a }), o = Bm(f);
    } catch {
      s = "<unknown>";
    }
    if (s.length === 0)
      return;
    const c = {
      category: `ui.${r.name}`,
      message: s
    };
    o && (c.data = { "ui.component_name": o }), Fn(c, {
      event: r.event,
      name: r.name,
      global: r.global
    });
  };
}
function ub(e) {
  return function(n) {
    if (De() !== e)
      return;
    const r = {
      category: "console",
      data: {
        arguments: n.args,
        logger: "console"
      },
      level: s_(n.level),
      message: au(n.args, " ")
    };
    if (n.level === "assert")
      if (n.args[0] === !1)
        r.message = `Assertion failed: ${au(n.args.slice(1), " ") || "console.assert"}`, r.data.arguments = n.args.slice(1);
      else
        return;
    Fn(r, {
      input: n.args,
      level: n.level
    });
  };
}
function lb(e) {
  return function(n) {
    if (De() !== e)
      return;
    const { startTimestamp: r, endTimestamp: s } = n, o = n.xhr[Jr];
    if (!r || !s || !o)
      return;
    const { method: i, url: a, status_code: c, body: u } = o, f = {
      method: i,
      url: a,
      status_code: c
    }, l = {
      xhr: n.xhr,
      input: u,
      startTimestamp: r,
      endTimestamp: s
    }, d = jd(c);
    Fn(
      {
        category: "xhr",
        data: f,
        type: "http",
        level: d
      },
      l
    );
  };
}
function db(e) {
  return function(n) {
    if (De() !== e)
      return;
    const { startTimestamp: r, endTimestamp: s } = n;
    if (s && !(n.fetchData.url.match(/sentry_key/) && n.fetchData.method === "POST"))
      if (n.error) {
        const o = n.fetchData, i = {
          data: n.error,
          input: n.args,
          startTimestamp: r,
          endTimestamp: s
        };
        Fn(
          {
            category: "fetch",
            data: o,
            level: "error",
            type: "http"
          },
          i
        );
      } else {
        const o = n.response, i = {
          ...n.fetchData,
          status_code: o && o.status
        }, a = {
          input: n.args,
          response: o,
          startTimestamp: r,
          endTimestamp: s
        }, c = jd(i.status_code);
        Fn(
          {
            category: "fetch",
            data: i,
            type: "http",
            level: c
          },
          a
        );
      }
  };
}
function fb(e) {
  return function(n) {
    if (De() !== e)
      return;
    let r = n.from, s = n.to;
    const o = vi(pe.location.href);
    let i = r ? vi(r) : void 0;
    const a = vi(s);
    (!i || !i.path) && (i = o), o.protocol === a.protocol && o.host === a.host && (s = a.relative), o.protocol === i.protocol && o.host === i.host && (r = i.relative), Fn({
      category: "navigation",
      data: {
        from: r,
        to: s
      }
    });
  };
}
function pb(e) {
  return !!e && !!e.target;
}
const hb = [
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
  "XMLHttpRequestUpload"
], mb = "BrowserApiErrors", gb = ((e = {}) => {
  const t = {
    XMLHttpRequest: !0,
    eventTarget: !0,
    requestAnimationFrame: !0,
    setInterval: !0,
    setTimeout: !0,
    ...e
  };
  return {
    name: mb,
    // TODO: This currently only works for the first client this is setup
    // We may want to adjust this to check for client etc.
    setupOnce() {
      t.setTimeout && Je(pe, "setTimeout", Fu), t.setInterval && Je(pe, "setInterval", Fu), t.requestAnimationFrame && Je(pe, "requestAnimationFrame", _b), t.XMLHttpRequest && "XMLHttpRequest" in pe && Je(XMLHttpRequest.prototype, "send", bb);
      const n = t.eventTarget;
      n && (Array.isArray(n) ? n : hb).forEach(wb);
    }
  };
}), yb = gb;
function Fu(e) {
  return function(...t) {
    const n = t[0];
    return t[0] = Ir(n, {
      mechanism: {
        data: { function: cn(e) },
        handled: !1,
        type: "instrument"
      }
    }), e.apply(this, t);
  };
}
function _b(e) {
  return function(t) {
    return e.apply(this, [
      Ir(t, {
        mechanism: {
          data: {
            function: "requestAnimationFrame",
            handler: cn(e)
          },
          handled: !1,
          type: "instrument"
        }
      })
    ]);
  };
}
function bb(e) {
  return function(...t) {
    const n = this;
    return ["onload", "onerror", "onprogress", "onreadystatechange"].forEach((s) => {
      s in n && typeof n[s] == "function" && Je(n, s, function(o) {
        const i = {
          mechanism: {
            data: {
              function: s,
              handler: cn(o)
            },
            handled: !1,
            type: "instrument"
          }
        }, a = sc(o);
        return a && (i.mechanism.data.handler = cn(a)), Ir(o, i);
      });
    }), e.apply(this, t);
  };
}
function wb(e) {
  const n = pe[e], r = n && n.prototype;
  !r || !r.hasOwnProperty || !r.hasOwnProperty("addEventListener") || (Je(r, "addEventListener", function(s) {
    return function(o, i, a) {
      try {
        Eb(i) && (i.handleEvent = Ir(i.handleEvent, {
          mechanism: {
            data: {
              function: "handleEvent",
              handler: cn(i),
              target: e
            },
            handled: !1,
            type: "instrument"
          }
        }));
      } catch {
      }
      return s.apply(this, [
        o,
        Ir(i, {
          mechanism: {
            data: {
              function: "addEventListener",
              handler: cn(i),
              target: e
            },
            handled: !1,
            type: "instrument"
          }
        }),
        a
      ]);
    };
  }), Je(r, "removeEventListener", function(s) {
    return function(o, i, a) {
      try {
        const c = i.__sentry_wrapped__;
        c && s.call(this, o, c, a);
      } catch {
      }
      return s.call(this, o, i, a);
    };
  }));
}
function Eb(e) {
  return typeof e.handleEvent == "function";
}
const Sb = () => ({
  name: "BrowserSession",
  setupOnce() {
    if (typeof pe.document > "u") {
      Es && V.warn("Using the `browserSessionIntegration` in non-browser environments is not supported.");
      return;
    }
    Tu({ ignoreDuration: !0 }), vu(), Jd(({ from: e, to: t }) => {
      e !== void 0 && e !== t && (Tu({ ignoreDuration: !0 }), vu());
    });
  }
}), Tb = "GlobalHandlers", vb = ((e = {}) => {
  const t = {
    onerror: !0,
    onunhandledrejection: !0,
    ...e
  };
  return {
    name: Tb,
    setupOnce() {
      Error.stackTraceLimit = 50;
    },
    setup(n) {
      t.onerror && (kb(n), $u("onerror")), t.onunhandledrejection && (Cb(n), $u("onunhandledrejection"));
    }
  };
}), Ib = vb;
function kb(e) {
  Rm((t) => {
    const { stackParser: n, attachStacktrace: r } = Qd();
    if (De() !== e || Xd())
      return;
    const { msg: s, url: o, line: i, column: a, error: c } = t, u = xb(
      dc(n, c || s, void 0, r, !1),
      o,
      i,
      a
    );
    u.level = "error", $d(u, {
      originalException: c,
      mechanism: {
        handled: !1,
        type: "onerror"
      }
    });
  });
}
function Cb(e) {
  Om((t) => {
    const { stackParser: n, attachStacktrace: r } = Qd();
    if (De() !== e || Xd())
      return;
    const s = Ab(t), o = nc(s) ? Rb(s) : dc(n, s, void 0, r, !0);
    o.level = "error", $d(o, {
      originalException: s,
      mechanism: {
        handled: !1,
        type: "onunhandledrejection"
      }
    });
  });
}
function Ab(e) {
  if (nc(e))
    return e;
  try {
    if ("reason" in e)
      return e.reason;
    if ("detail" in e && "reason" in e.detail)
      return e.detail.reason;
  } catch {
  }
  return e;
}
function Rb(e) {
  return {
    exception: {
      values: [
        {
          type: "UnhandledRejection",
          // String() is needed because the Primitive type includes symbols (which can't be automatically stringified)
          value: `Non-Error promise rejection captured with value: ${String(e)}`
        }
      ]
    }
  };
}
function xb(e, t, n, r) {
  const s = e.exception = e.exception || {}, o = s.values = s.values || [], i = o[0] = o[0] || {}, a = i.stacktrace = i.stacktrace || {}, c = a.frames = a.frames || [], u = r, f = n, l = Ft(t) && t.length > 0 ? t : $m();
  return c.length === 0 && c.push({
    colno: u,
    filename: l,
    function: Mn,
    in_app: !0,
    lineno: f
  }), e;
}
function $u(e) {
  Es && V.log(`Global Handler attached: ${e}`);
}
function Qd() {
  const e = De();
  return e && e.getOptions() || {
    stackParser: () => [],
    attachStacktrace: !1
  };
}
const Ob = () => ({
  name: "HttpContext",
  preprocessEvent(e) {
    if (!pe.navigator && !pe.location && !pe.document)
      return;
    const t = e.request && e.request.url || pe.location && pe.location.href, { referrer: n } = pe.document || {}, { userAgent: r } = pe.navigator || {}, s = {
      ...e.request && e.request.headers,
      ...n && { Referer: n },
      ...r && { "User-Agent": r }
    }, o = { ...e.request, ...t && { url: t }, headers: s };
    e.request = o;
  }
}), Lb = "cause", Nb = 5, Mb = "LinkedErrors", Pb = ((e = {}) => {
  const t = e.limit || Nb, n = e.key || Lb;
  return {
    name: Mb,
    preprocessEvent(r, s, o) {
      const i = o.getOptions();
      e_(
        // This differs from the LinkedErrors integration in core by using a different exceptionFromError function
        uc,
        i.stackParser,
        i.maxValueLength,
        n,
        t,
        r,
        s
      );
    }
  };
}), Db = Pb;
function Ub(e) {
  const t = [
    Hy(),
    $y(),
    yb(),
    ib(),
    Ib(),
    Db(),
    a_(),
    Ob()
  ];
  return e.autoSessionTracking !== !1 && t.push(Sb()), t;
}
function Fb(e = {}) {
  const t = {
    defaultIntegrations: Ub(e),
    release: typeof __SENTRY_RELEASE__ == "string" ? __SENTRY_RELEASE__ : pe.SENTRY_RELEASE && pe.SENTRY_RELEASE.id ? pe.SENTRY_RELEASE.id : void 0,
    autoSessionTracking: !0,
    sendClientReports: !0
  };
  return e.defaultIntegrations == null && delete e.defaultIntegrations, { ...t, ...e };
}
function $b() {
  const e = typeof pe.window < "u" && pe;
  if (!e)
    return !1;
  const t = e.chrome ? "chrome" : "browser", n = e[t], r = n && n.runtime && n.runtime.id, s = pe.location && pe.location.href || "", o = ["chrome-extension:", "moz-extension:", "ms-browser-extension:", "safari-web-extension:"], i = !!r && pe === pe.top && o.some((c) => s.startsWith(`${c}//`)), a = typeof e.nw < "u";
  return !!r && !i && !a;
}
function Bb(e = {}) {
  const t = Fb(e);
  if (!t.skipBrowserExtensionCheck && $b()) {
    Kn(() => {
      console.error(
        "[Sentry] You cannot run Sentry this way in a browser extension, check: https://docs.sentry.io/platforms/javascript/best-practices/browser-extensions/"
      );
    });
    return;
  }
  Es && (qd() || V.warn(
    "No Fetch API detected. The Sentry SDK requires a Fetch API compatible environment to send events. Please add a Fetch API polyfill."
  ));
  const n = {
    ...t,
    stackParser: Cm(t.stackParser || rb),
    integrations: by(t),
    transport: t.transport || G_
  };
  return Iy(O_, n);
}
const Vb = () => {
  Bb({
    dsn: "https://fb12ea0c434aa20ad37bf9cc9cff7e31@o4504136533147648.ingest.us.sentry.io/4508600749064192",
    integrations: [],
    release: chrome.runtime.getManifest?.().version ?? "offscreen",
    environment: "production"
  });
};
class Ae extends Error {
  constructor(t, n) {
    super(t, n), this.name = "ToolError";
  }
}
const Me = typeof chrome < "u" && !!chrome && "perplexity" in chrome, fc = typeof chrome < "u" && !!chrome.perplexity?.system, Ss = Me && !!chrome.perplexity.mcp, ef = Me && !!chrome.perplexity.dxt, Wb = Ss && !!chrome.perplexity.mcp.onStdioServerChanged, Hb = Ss && !!chrome.perplexity.mcp.onPersistedStdioServersLoaded, Gb = Ss && !!chrome.perplexity.mcp.onStdioServerAdded, zb = Ss && !!chrome.perplexity.mcp.onStdioServerRemoved, Kb = ef && !!chrome.perplexity.dxt.Permission;
fc && chrome.perplexity.system.getCurrentTheme;
const So = "comet", pc = (async () => !Me || typeof chrome > "u" ? navigator.userAgent.match(/Chrome\/([\d.]+)/)?.[1] ?? "0.0.0.0" : chrome.perplexity.system.getProductVersion())(), Bu = pc.then(
  (e) => Number(e.split(".").at(0))
), jb = pc.then(
  (e) => Number(e.split(".").at(-1))
), hc = (async () => Me && typeof chrome < "u" && !!chrome.perplexity?.views?.createWebOverlay ? await Bu > 141 || await Bu === 141 && await jb >= 23205 : !1)(), qb = Me && !!chrome.perplexity.pdf;
function Xb(e) {
  return !!"perplexity.ai,localhost".split(",").some(
    (t) => e === t || e.endsWith("." + t)
  );
}
const Le = ({
  error: e,
  logger: t,
  context: n = void 0
}) => {
  t.error(e, n), Fd(e, n);
}, To = (e) => async (...t) => {
  try {
    await e(...t);
  } catch (n) {
    throw Le({ error: n, logger: G }), n;
  }
}, ve = {
  log: "log",
  debug: "debug",
  info: "info",
  warn: "warn",
  error: "error"
}, Tt = console, bn = {};
Object.keys(ve).forEach((e) => {
  bn[e] = Tt[e];
});
const Vr = "Datadog Browser SDK:", W = {
  debug: bn.debug.bind(Tt, Vr),
  log: bn.log.bind(Tt, Vr),
  info: bn.info.bind(Tt, Vr),
  warn: bn.warn.bind(Tt, Vr),
  error: bn.error.bind(Tt, Vr)
}, qo = "https://docs.datadoghq.com", Yb = `${qo}/real_user_monitoring/browser/troubleshooting`, mc = "More details:";
function tf(e, t) {
  return (...n) => {
    try {
      return e(...n);
    } catch (r) {
      W.error(t, r);
    }
  };
}
function tn(e) {
  return e !== 0 && Math.random() * 100 <= e;
}
function ns(e, t) {
  return +e.toFixed(t);
}
function Jb(e) {
  return Ts(e) && e >= 0 && e <= 100;
}
function Ts(e) {
  return typeof e == "number";
}
const Oe = 1e3, He = 60 * Oe, nf = 60 * He, Zb = 24 * nf, rf = 365 * Zb;
function vs(e) {
  return { relative: e, timeStamp: ew(e) };
}
function Qb(e) {
  return { relative: Xo(e), timeStamp: e };
}
function ew(e) {
  const t = We() - performance.now();
  return t > Is() ? Math.round(Or(t, e)) : tw(e);
}
function sf() {
  return Math.round(We() - Or(Is(), performance.now()));
}
function q(e) {
  return Ts(e) ? ns(e * 1e6, 0) : e;
}
function We() {
  return (/* @__PURE__ */ new Date()).getTime();
}
function oe() {
  return We();
}
function Ze() {
  return performance.now();
}
function Ee() {
  return { relative: Ze(), timeStamp: oe() };
}
function gc() {
  return { relative: 0, timeStamp: Is() };
}
function _e(e, t) {
  return t - e;
}
function Or(e, t) {
  return e + t;
}
function Xo(e) {
  return e - Is();
}
function tw(e) {
  return Math.round(Or(Is(), e));
}
function nw(e) {
  return e < rf;
}
let ki;
function Is() {
  var e, t;
  return ki === void 0 && (ki = (t = (e = performance.timing) === null || e === void 0 ? void 0 : e.navigationStart) !== null && t !== void 0 ? t : performance.timeOrigin), ki;
}
const $n = 1024, of = 1024 * $n, rw = /[^\u0000-\u007F]/;
function af(e) {
  return rw.test(e) ? window.TextEncoder !== void 0 ? new TextEncoder().encode(e).length : new Blob([e]).size : e.length;
}
function sw(e) {
  const t = e.reduce((s, o) => s + o.length, 0), n = new Uint8Array(t);
  let r = 0;
  for (const s of e)
    n.set(s, r), r += s.length;
  return n;
}
function ds(e) {
  return { ...e };
}
function vo(e, t) {
  return Object.keys(e).some((n) => e[n] === t);
}
function Xn(e) {
  return Object.keys(e).length === 0;
}
function cf(e, t) {
  const n = {};
  for (const r of Object.keys(e))
    n[r] = t(e[r]);
  return n;
}
function Xe() {
  if (typeof globalThis == "object")
    return globalThis;
  Object.defineProperty(Object.prototype, "_dd_temp_", {
    get() {
      return this;
    },
    configurable: !0
  });
  let e = _dd_temp_;
  return delete Object.prototype._dd_temp_, typeof e != "object" && (typeof self == "object" ? e = self : typeof window == "object" ? e = window : e = {}), e;
}
const ht = Xe(), Bn = "WorkerGlobalScope" in ht;
function ln(e, t) {
  const n = Xe();
  let r;
  return n.Zone && typeof n.Zone.__symbol__ == "function" && (r = e[n.Zone.__symbol__(t)]), r || (r = e[t]), r;
}
let Io, uf = !1;
function ow(e) {
  Io = e;
}
function iw(e) {
  uf = e;
}
function aw(e, t, n) {
  const r = n.value;
  n.value = function(...s) {
    return (Io ? D(r) : r).apply(this, s);
  };
}
function D(e) {
  return function() {
    return Bt(e, this, arguments);
  };
}
function Bt(e, t, n) {
  try {
    return e.apply(t, n);
  } catch (r) {
    dt(r);
  }
}
function dt(e) {
  if (ba(e), Io)
    try {
      Io(e);
    } catch (t) {
      ba(t);
    }
}
function ba(...e) {
  uf && W.error("[MONITOR]", ...e);
}
function Re(e, t) {
  return ln(Xe(), "setTimeout")(D(e), t);
}
function ze(e) {
  ln(Xe(), "clearTimeout")(e);
}
function Lr(e, t) {
  return ln(Xe(), "setInterval")(D(e), t);
}
function Yo(e) {
  ln(Xe(), "clearInterval")(e);
}
function Vu(e) {
  var t;
  const n = (t = ht.queueMicrotask) === null || t === void 0 ? void 0 : t.bind(ht);
  typeof n == "function" ? n(D(e)) : Promise.resolve().then(D(e));
}
class Z {
  constructor(t) {
    this.onFirstSubscribe = t, this.observers = [];
  }
  subscribe(t) {
    return this.addObserver(t), {
      unsubscribe: () => this.removeObserver(t)
    };
  }
  notify(t) {
    this.observers.forEach((n) => n(t));
  }
  addObserver(t) {
    this.observers.push(t), this.observers.length === 1 && this.onFirstSubscribe && (this.onLastUnsubscribe = this.onFirstSubscribe(this) || void 0);
  }
  removeObserver(t) {
    this.observers = this.observers.filter((n) => t !== n), !this.observers.length && this.onLastUnsubscribe && this.onLastUnsubscribe();
  }
}
function lf(...e) {
  return new Z((t) => {
    const n = e.map((r) => r.subscribe((s) => t.notify(s)));
    return () => n.forEach((r) => r.unsubscribe());
  });
}
class df extends Z {
  constructor(t) {
    super(), this.maxBufferSize = t, this.buffer = [];
  }
  notify(t) {
    this.buffer.push(t), this.buffer.length > this.maxBufferSize && this.buffer.shift(), super.notify(t);
  }
  subscribe(t) {
    let n = !1;
    const r = {
      unsubscribe: () => {
        n = !0, this.removeObserver(t);
      }
    };
    return Vu(() => {
      for (const s of this.buffer) {
        if (n)
          return;
        t(s);
      }
      n || this.addObserver(t);
    }), r;
  }
  /**
   * Drop buffered data and don't buffer future data. This is to avoid leaking memory when it's not
   * needed anymore. This can be seen as a performance optimization, and things will work probably
   * even if this method isn't called, but still useful to clarify our intent and lowering our
   * memory impact.
   */
  unbuffer() {
    Vu(() => {
      this.maxBufferSize = this.buffer.length = 0;
    });
  }
}
function pn(e, t, n) {
  const r = n && n.leading !== void 0 ? n.leading : !0, s = n && n.trailing !== void 0 ? n.trailing : !0;
  let o = !1, i, a;
  return {
    throttled: (...c) => {
      if (o) {
        i = c;
        return;
      }
      r ? e(...c) : i = c, o = !0, a = Re(() => {
        s && i && e(...i), o = !1, i = void 0;
      }, t);
    },
    cancel: () => {
      ze(a), o = !1, i = void 0;
    }
  };
}
function Y() {
}
function Ue(e) {
  return e ? (
    // eslint-disable-next-line  no-bitwise
    (parseInt(e, 10) ^ Math.random() * 16 >> parseInt(e, 10) / 4).toString(16)
  ) : `10000000-1000-4000-8000-${1e11}`.replace(/[018]/g, Ue);
}
const ko = /([\w-]+)\s*=\s*([^;]+)/g;
function fs(e, t) {
  for (ko.lastIndex = 0; ; ) {
    const n = ko.exec(e);
    if (n) {
      if (n[1] === t)
        return n[2];
    } else
      break;
  }
}
function cw(e) {
  const t = /* @__PURE__ */ new Map();
  for (ko.lastIndex = 0; ; ) {
    const n = ko.exec(e);
    if (n)
      t.set(n[1], n[2]);
    else
      break;
  }
  return t;
}
function yc(e, t, n = "") {
  const r = e.charCodeAt(t - 1), o = r >= 55296 && r <= 56319 ? t + 1 : t;
  return e.length <= o ? e : `${e.slice(0, o)}${n}`;
}
function uw() {
  return ff() === 0;
}
function lw() {
  return ff() === 1;
}
let zs;
function ff() {
  return zs ?? (zs = dw());
}
function dw(e = window) {
  var t;
  const n = e.navigator.userAgent;
  return e.chrome || /HeadlessChrome/.test(n) ? 0 : (
    // navigator.vendor is deprecated, but it is the most resilient way we found to detect
    // "Apple maintained browsers" (AKA Safari). If one day it gets removed, we still have the
    // useragent test as a semi-working fallback.
    ((t = e.navigator.vendor) === null || t === void 0 ? void 0 : t.indexOf("Apple")) === 0 || /safari/i.test(n) && !/chrome|android/i.test(n) ? 1 : 2
  );
}
function _c(e) {
  return ks(e, location.href).href;
}
function fw(e) {
  try {
    return !!ks(e);
  } catch {
    return !1;
  }
}
function pw(e) {
  const t = ks(e).pathname;
  return t[0] === "/" ? t : `/${t}`;
}
function ks(e, t) {
  const { URL: n } = hw();
  try {
    return t !== void 0 ? new n(e, t) : new n(e);
  } catch (r) {
    throw new Error(`Failed to construct URL: ${String(r)}`);
  }
}
let Ci;
function hw() {
  if (!Ci) {
    let e, t;
    try {
      e = document.createElement("iframe"), e.style.display = "none", document.body.appendChild(e), t = e.contentWindow;
    } catch {
      t = ht;
    }
    Ci = {
      URL: t.URL
    }, e?.remove();
  }
  return Ci;
}
function Jo(e, t, n = 0, r) {
  const s = /* @__PURE__ */ new Date();
  s.setTime(s.getTime() + n);
  const o = `expires=${s.toUTCString()}`, i = r && r.crossSite ? "none" : "strict", a = r && r.domain ? `;domain=${r.domain}` : "", c = r && r.secure ? ";secure" : "", u = r && r.partitioned ? ";partitioned" : "";
  document.cookie = `${e}=${t};${o};path=/;samesite=${i}${a}${c}${u}`;
}
function Zo(e) {
  return fs(document.cookie, e);
}
let Ai;
function nn(e) {
  return Ai || (Ai = cw(document.cookie)), Ai.get(e);
}
function pf(e, t) {
  Jo(e, "", 0, t);
}
function mw(e) {
  if (document.cookie === void 0 || document.cookie === null)
    return !1;
  try {
    const t = `dd_cookie_test_${Ue()}`, n = "test";
    Jo(t, n, He, e);
    const r = Zo(t) === n;
    return pf(t, e), r;
  } catch (t) {
    return W.error(t), !1;
  }
}
let Ri;
function hf(e = location.hostname, t = document.referrer) {
  if (Ri === void 0) {
    const n = gw(e, t);
    if (n) {
      const r = `dd_site_test_${Ue()}`, s = "test", o = n.split(".");
      let i = o.pop();
      for (; o.length && !Zo(r); )
        i = `${o.pop()}.${i}`, Jo(r, s, Oe, { domain: i });
      pf(r, { domain: i }), Ri = i;
    }
  }
  return Ri;
}
function gw(e, t) {
  try {
    return e || ks(t).hostname;
  } catch {
  }
}
const dn = "_dd_s";
function mf(e, t) {
  for (let n = e.length - 1; n >= 0; n -= 1) {
    const r = e[n];
    if (t(r, n, e))
      return r;
  }
}
function Co(e) {
  return Object.values(e);
}
function bc(e) {
  return Object.entries(e);
}
const Yn = 4 * nf, gf = 15 * He, yw = rf, yf = "0", ps = {
  COOKIE: "cookie",
  LOCAL_STORAGE: "local-storage"
}, _f = /^([a-zA-Z]+)=([a-z0-9-]+)$/, wc = "&";
function _w(e) {
  return !!e && (e.indexOf(wc) !== -1 || _f.test(e));
}
const bw = "1";
function wn(e, t) {
  const n = {
    isExpired: bw
  };
  return t.trackAnonymousUser && (e?.anonymousId ? n.anonymousId = e?.anonymousId : n.anonymousId = Ue()), n;
}
function io(e) {
  return Xn(e);
}
function bf(e) {
  return !io(e);
}
function rs(e) {
  return e.isExpired !== void 0 || !ww(e);
}
function ww(e) {
  return (e.created === void 0 || We() - Number(e.created) < Yn) && (e.expire === void 0 || We() < Number(e.expire));
}
function wf(e) {
  e.expire = String(We() + gf);
}
function Ef(e) {
  return bc(e).map(([t, n]) => t === "anonymousId" ? `aid=${n}` : `${t}=${n}`).join(wc);
}
function Ec(e) {
  const t = {};
  return _w(e) && e.split(wc).forEach((n) => {
    const r = _f.exec(n);
    if (r !== null) {
      const [, s, o] = r;
      s === "aid" ? t.anonymousId = o : t[s] = o;
    }
  }), t;
}
const Ew = "_dd", Sw = "_dd_r", Tw = "_dd_l", vw = "rum", Iw = "logs";
function kw(e) {
  if (!nn(dn)) {
    const n = nn(Ew), r = nn(Sw), s = nn(Tw), o = {};
    n && (o.id = n), s && /^[01]$/.test(s) && (o[Iw] = s), r && /^[012]$/.test(r) && (o[vw] = r), bf(o) && (wf(o), e.persistSession(o));
  }
}
function Wu(e) {
  const t = Aw(e);
  return t && mw(t) ? { type: ps.COOKIE, cookieOptions: t } : void 0;
}
function Cw(e, t) {
  const n = {
    /**
     * Lock strategy allows mitigating issues due to concurrent access to cookie.
     * This issue concerns only chromium browsers and enabling this on firefox increases cookie write failures.
     */
    isLockEnabled: uw(),
    persistSession: (r) => Hu(t, e, r, gf),
    retrieveSession: Sf,
    expireSession: (r) => Hu(t, e, wn(r, e), Yn)
  };
  return kw(n), n;
}
function Hu(e, t, n, r) {
  Jo(dn, Ef(n), t.trackAnonymousUser ? yw : r, e);
}
function Sf() {
  const e = Zo(dn);
  return Ec(e);
}
function Aw(e) {
  const t = {};
  if (t.secure = !!e.useSecureSessionCookie || !!e.usePartitionedCrossSiteSessionCookie, t.crossSite = !!e.usePartitionedCrossSiteSessionCookie, t.partitioned = !!e.usePartitionedCrossSiteSessionCookie, e.trackSessionAcrossSubdomains) {
    const n = hf();
    if (!n)
      return;
    t.domain = n;
  }
  return t;
}
const Rw = "_dd_test_";
function Gu() {
  try {
    const e = Ue(), t = `${Rw}${e}`;
    localStorage.setItem(t, e);
    const n = localStorage.getItem(t);
    return localStorage.removeItem(t), e === n ? { type: ps.LOCAL_STORAGE } : void 0;
  } catch {
    return;
  }
}
function xw(e) {
  return {
    isLockEnabled: !1,
    persistSession: Tf,
    retrieveSession: Ow,
    expireSession: (t) => Lw(t, e)
  };
}
function Tf(e) {
  localStorage.setItem(dn, Ef(e));
}
function Ow() {
  const e = localStorage.getItem(dn);
  return Ec(e);
}
function Lw(e, t) {
  Tf(wn(e, t));
}
const Nw = 10, Mw = 100, Pw = Oe, vf = "--", If = [];
let ao;
function En(e, t, n = 0) {
  var r;
  const { isLockEnabled: s, persistSession: o, expireSession: i } = t, a = (d) => o({ ...d, lock: u }), c = () => {
    const { lock: d, ...p } = t.retrieveSession();
    return {
      session: p,
      lock: d && !Uw(d) ? d : void 0
    };
  };
  if (ao || (ao = e), e !== ao) {
    If.push(e);
    return;
  }
  if (s && n >= Mw) {
    zu(t);
    return;
  }
  let u, f = c();
  if (s) {
    if (f.lock) {
      Ks(e, t, n);
      return;
    }
    if (u = Dw(), a(f.session), f = c(), f.lock !== u) {
      Ks(e, t, n);
      return;
    }
  }
  let l = e.process(f.session);
  if (s && (f = c(), f.lock !== u)) {
    Ks(e, t, n);
    return;
  }
  if (l && (rs(l) ? i(l) : (wf(l), s ? a(l) : o(l))), s && !(l && rs(l))) {
    if (f = c(), f.lock !== u) {
      Ks(e, t, n);
      return;
    }
    o(f.session), l = f.session;
  }
  (r = e.after) === null || r === void 0 || r.call(e, l || f.session), zu(t);
}
function Ks(e, t, n) {
  Re(() => {
    En(e, t, n + 1);
  }, Nw);
}
function zu(e) {
  ao = void 0;
  const t = If.shift();
  t && En(t, e);
}
function Dw() {
  return Ue() + vf + oe();
}
function Uw(e) {
  const [, t] = e.split(vf);
  return !t || _e(Number(t), oe()) > Pw;
}
const Ku = Oe;
function Fw(e) {
  switch (e.sessionPersistence) {
    case ps.COOKIE:
      return Wu(e);
    case ps.LOCAL_STORAGE:
      return Gu();
    case void 0: {
      let t = Wu(e);
      return !t && e.allowFallbackToLocalStorage && (t = Gu()), t;
    }
    default:
      W.error(`Invalid session persistence '${String(e.sessionPersistence)}'`);
  }
}
function $w(e, t) {
  return e.type === ps.COOKIE ? Cw(t, e.cookieOptions) : xw(t);
}
function Bw(e, t, n, r, s = $w(e, t)) {
  const o = new Z(), i = new Z(), a = new Z(), c = Lr(p, Ku);
  let u;
  m();
  const { throttled: f, cancel: l } = pn(() => {
    En({
      process: (w) => {
        if (io(w))
          return;
        const T = h(w);
        return g(T), T;
      },
      after: (w) => {
        bf(w) && !_() && E(w), u = w;
      }
    }, s);
  }, Ku);
  function d() {
    En({
      process: (w) => _() ? h(w) : void 0
    }, s);
  }
  function p() {
    const w = s.retrieveSession();
    rs(w) ? En({
      process: (T) => rs(T) ? wn(T, t) : void 0,
      after: h
    }, s) : h(w);
  }
  function h(w) {
    return rs(w) && (w = wn(w, t)), _() && (y(w) ? b() : (a.notify({ previousState: u, newState: w }), u = w)), w;
  }
  function m() {
    En({
      process: (w) => {
        if (io(w))
          return wn(w, t);
      },
      after: (w) => {
        u = w;
      }
    }, s);
  }
  function g(w) {
    if (io(w))
      return !1;
    const T = r(w[n]);
    w[n] = T, delete w.isExpired, T !== yf && !w.id && (w.id = Ue(), w.created = String(We()));
  }
  function _() {
    return u?.[n] !== void 0;
  }
  function y(w) {
    return u.id !== w.id || u[n] !== w[n];
  }
  function b() {
    u = wn(u, t), i.notify();
  }
  function E(w) {
    u = w, o.notify();
  }
  function S(w) {
    En({
      process: (T) => ({ ...T, ...w }),
      after: h
    }, s);
  }
  return {
    expandOrRenewSession: f,
    expandSession: d,
    getSession: () => u,
    renewObservable: o,
    expireObservable: i,
    sessionStateUpdateObservable: a,
    restartSession: m,
    expire: () => {
      l(), s.expireSession(u), h(wn(u, t));
    },
    stop: () => {
      Yo(c);
    },
    updateSessionState: S
  };
}
const wa = {
  GRANTED: "granted",
  NOT_GRANTED: "not-granted"
};
function kf(e) {
  const t = new Z();
  return {
    tryToInit(n) {
      e || (e = n);
    },
    update(n) {
      e = n, t.notify();
    },
    isGranted() {
      return e === wa.GRANTED;
    },
    observable: t
  };
}
function Jn(e) {
  return e === null ? "null" : Array.isArray(e) ? "array" : typeof e;
}
function hs(e) {
  const t = Jn(e);
  return t === "string" || t === "function" || e instanceof RegExp;
}
function Qo(e, t, n = !1) {
  return e.some((r) => {
    try {
      if (typeof r == "function")
        return r(t);
      if (r instanceof RegExp)
        return r.test(t);
      if (typeof r == "string")
        return n ? t.startsWith(r) : r === t;
    } catch (s) {
      W.error(s);
    }
    return !1;
  });
}
const Cf = ["chrome-extension://", "moz-extension://"];
function ju(e) {
  return Cf.some((t) => e.includes(t));
}
function Vw(e, t = "") {
  if (ju(e))
    return !1;
  const r = t.split(`
`).filter((s) => {
    const o = s.trim();
    return o.length && /^at\s+|@/.test(o);
  })[1] || "";
  return ju(r);
}
function Ww(e = "") {
  for (const t of Cf) {
    const n = e.match(new RegExp(`${t}[^/]+`));
    if (n)
      return n[0];
  }
}
function Cs(e, t, n) {
  if (typeof e != "object" || e === null)
    return JSON.stringify(e);
  const r = fr(Object.prototype), s = fr(Array.prototype), o = fr(Object.getPrototypeOf(e)), i = fr(e);
  try {
    return JSON.stringify(e, t, n);
  } catch {
    return "<error: unable to serialize object>";
  } finally {
    r(), s(), o(), i();
  }
}
function fr(e) {
  const t = e, n = t.toJSON;
  return n ? (delete t.toJSON, () => {
    t.toJSON = n;
  }) : Y;
}
const Hw = 220 * $n, Gw = "$", zw = 3;
function de(e, t = Hw) {
  const n = fr(Object.prototype), r = fr(Array.prototype), s = [], o = /* @__PURE__ */ new WeakMap(), i = xi(e, Gw, void 0, s, o), a = JSON.stringify(i);
  let c = a ? a.length : 0;
  if (c > t) {
    Oi(t, "discarded", e);
    return;
  }
  for (; s.length > 0 && c < t; ) {
    const u = s.shift();
    let f = 0;
    if (Array.isArray(u.source))
      for (let l = 0; l < u.source.length; l++) {
        const d = xi(u.source[l], u.path, l, s, o);
        if (d !== void 0 ? c += JSON.stringify(d).length : c += 4, c += f, f = 1, c > t) {
          Oi(t, "truncated", e);
          break;
        }
        u.target[l] = d;
      }
    else
      for (const l in u.source)
        if (Object.prototype.hasOwnProperty.call(u.source, l)) {
          const d = xi(u.source[l], u.path, l, s, o);
          if (d !== void 0 && (c += JSON.stringify(d).length + f + l.length + zw, f = 1), c > t) {
            Oi(t, "truncated", e);
            break;
          }
          u.target[l] = d;
        }
  }
  return n(), r(), i;
}
function xi(e, t, n, r, s) {
  const o = qw(e);
  if (!o || typeof o != "object")
    return Kw(o);
  const i = Ea(o);
  if (i !== "[Object]" && i !== "[Array]" && i !== "[Error]")
    return i;
  const a = e;
  if (s.has(a))
    return `[Reference seen at ${s.get(a)}]`;
  const c = n !== void 0 ? `${t}.${n}` : t, u = Array.isArray(o) ? [] : {};
  return s.set(a, c), r.push({ source: o, target: u, path: c }), u;
}
function Kw(e) {
  return typeof e == "bigint" ? `[BigInt] ${e.toString()}` : typeof e == "function" ? `[Function] ${e.name || "unknown"}` : typeof e == "symbol" ? `[Symbol] ${e.description || e.toString()}` : e;
}
function Ea(e) {
  try {
    if (e instanceof Event)
      return jw(e);
    if (e instanceof RegExp)
      return `[RegExp] ${e.toString()}`;
    const n = Object.prototype.toString.call(e).match(/\[object (.*)\]/);
    if (n && n[1])
      return `[${n[1]}]`;
  } catch {
  }
  return "[Unserializable]";
}
function jw(e) {
  return {
    type: e.type,
    isTrusted: e.isTrusted,
    currentTarget: e.currentTarget ? Ea(e.currentTarget) : null,
    target: e.target ? Ea(e.target) : null
  };
}
function qw(e) {
  const t = e;
  if (t && typeof t.toJSON == "function")
    try {
      return t.toJSON();
    } catch {
    }
  return e;
}
function Oi(e, t, n) {
  W.warn(`The data provided has been ${t} as it is over the limit of ${e} characters:`, n);
}
const kr = "?";
function Nr(e) {
  var t, n;
  const r = [];
  let s = Li(e, "stack");
  const o = String(e);
  if (s && s.startsWith(o) && (s = s.slice(o.length)), s && s.split(`
`).forEach((i) => {
    const a = Jw(i) || Qw(i) || tE(i) || sE(i);
    a && (!a.func && a.line && (a.func = kr), r.push(a));
  }), r.length > 0 && cE() && e instanceof Error) {
    const i = [];
    let a = e;
    for (; (a = Object.getPrototypeOf(a)) && Rf(a); ) {
      const c = ((t = a.constructor) === null || t === void 0 ? void 0 : t.name) || kr;
      i.push(c);
    }
    for (let c = i.length - 1; c >= 0 && ((n = r[0]) === null || n === void 0 ? void 0 : n.func) === i[c]; c--)
      r.shift();
  }
  return {
    message: Li(e, "message"),
    name: Li(e, "name"),
    stack: r
  };
}
const Af = "((?:file|https?|blob|chrome-extension|electron|native|eval|webpack|snippet|<anonymous>|\\w+\\.|\\/).*?)", Cr = "(?::(\\d+))", Xw = new RegExp(`^\\s*at (.*?) ?\\(${Af}${Cr}?${Cr}?\\)?\\s*$`, "i"), Yw = new RegExp(`\\((\\S*)${Cr}${Cr}\\)`);
function Jw(e) {
  const t = Xw.exec(e);
  if (!t)
    return;
  const n = t[2] && t[2].indexOf("native") === 0, r = t[2] && t[2].indexOf("eval") === 0, s = Yw.exec(t[2]);
  return r && s && (t[2] = s[1], t[3] = s[2], t[4] = s[3]), {
    args: n ? [t[2]] : [],
    column: t[4] ? +t[4] : void 0,
    func: t[1] || kr,
    line: t[3] ? +t[3] : void 0,
    url: n ? void 0 : t[2]
  };
}
const Zw = new RegExp(`^\\s*at ?${Af}${Cr}?${Cr}??\\s*$`, "i");
function Qw(e) {
  const t = Zw.exec(e);
  if (t)
    return {
      args: [],
      column: t[3] ? +t[3] : void 0,
      func: kr,
      line: t[2] ? +t[2] : void 0,
      url: t[1]
    };
}
const eE = /^\s*at (?:((?:\[object object\])?.+) )?\(?((?:file|ms-appx|https?|webpack|blob):.*?):(\d+)(?::(\d+))?\)?\s*$/i;
function tE(e) {
  const t = eE.exec(e);
  if (t)
    return {
      args: [],
      column: t[4] ? +t[4] : void 0,
      func: t[1] || kr,
      line: +t[3],
      url: t[2]
    };
}
const nE = /^\s*(.*?)(?:\((.*?)\))?(?:(?:(?:^|@)((?:file|https?|blob|chrome|webpack|resource|capacitor|\[native).*?|[^@]*bundle|\[wasm code\])(?::(\d+))?(?::(\d+))?)|@)\s*$/i, rE = /(\S+) line (\d+)(?: > eval line \d+)* > eval/i;
function sE(e) {
  const t = nE.exec(e);
  if (!t)
    return;
  const n = t[3] && t[3].indexOf(" > eval") > -1, r = rE.exec(t[3]);
  return n && r && (t[3] = r[1], t[4] = r[2], t[5] = void 0), {
    args: t[2] ? t[2].split(",") : [],
    column: t[5] ? +t[5] : void 0,
    func: t[1] || kr,
    line: t[4] ? +t[4] : void 0,
    url: t[3]
  };
}
function Li(e, t) {
  if (typeof e != "object" || !e || !(t in e))
    return;
  const n = e[t];
  return typeof n == "string" ? n : void 0;
}
function oE(e, t, n, r) {
  if (t === void 0)
    return;
  const { name: s, message: o } = aE(e);
  return {
    name: s,
    message: o,
    stack: [{ url: t, column: r, line: n }]
  };
}
const iE = /^(?:[Uu]ncaught (?:exception: )?)?(?:((?:Eval|Internal|Range|Reference|Syntax|Type|URI|)Error): )?([\s\S]*)$/;
function aE(e) {
  let t, n;
  return {}.toString.call(e) === "[object String]" && ([, t, n] = iE.exec(e)), { name: t, message: n };
}
function Rf(e) {
  return String(e.constructor).startsWith("class ");
}
let js;
function cE() {
  if (js !== void 0)
    return js;
  class e extends Error {
    constructor() {
      super(), this.name = "Error";
    }
  }
  const [t, n] = [e, Error].map((r) => new r());
  return js = // If customError is not a class, it means that this was built with ES5 as target, converting the class to a normal object.
  // Thus, error constructors will be reported on all browsers, which is the expected behavior.
  Rf(Object.getPrototypeOf(t)) && // If the browser is correctly reporting the stacktrace, the normal error stacktrace should be the same as the custom error stacktrace
  n.stack !== t.stack, js;
}
function Ar(e) {
  const n = new Error(e);
  n.name = "HandlingStack";
  let r;
  return Bt(() => {
    const s = Nr(n);
    s.stack = s.stack.slice(2), r = Mr(s);
  }), r;
}
function Mr(e) {
  let t = xf(e);
  return e.stack.forEach((n) => {
    const r = n.func === "?" ? "<anonymous>" : n.func, s = n.args && n.args.length > 0 ? `(${n.args.join(", ")})` : "", o = n.line ? `:${n.line}` : "", i = n.line && n.column ? `:${n.column}` : "";
    t += `
  at ${r}${s} @ ${n.url}${o}${i}`;
  }), t;
}
function xf(e) {
  return `${e.name || "Error"}: ${e.message}`;
}
const Of = "No stack, consider using an instance of Error";
function ei({ stackTrace: e, originalError: t, handlingStack: n, componentStack: r, startClocks: s, nonErrorPrefix: o, useFallbackStack: i = !0, source: a, handling: c }) {
  const u = Zn(t);
  return !e && u && (e = Nr(t)), {
    startClocks: s,
    source: a,
    handling: c,
    handlingStack: n,
    componentStack: r,
    originalError: t,
    type: e ? e.name : void 0,
    message: uE(e, u, o, t),
    stack: e ? Mr(e) : i ? Of : void 0,
    causes: u ? pE(t, a) : void 0,
    fingerprint: lE(t),
    context: dE(t)
  };
}
function uE(e, t, n, r) {
  return e?.message && e?.name ? e.message : t ? "Empty message" : `${n} ${Cs(de(r))}`;
}
function lE(e) {
  return Zn(e) && "dd_fingerprint" in e ? String(e.dd_fingerprint) : void 0;
}
function dE(e) {
  if (e !== null && typeof e == "object" && "dd_context" in e)
    return e.dd_context;
}
function fE(e) {
  var t;
  return (t = /@ (.+)/.exec(e)) === null || t === void 0 ? void 0 : t[1];
}
function Zn(e) {
  return e instanceof Error || Object.prototype.toString.call(e) === "[object Error]";
}
function pE(e, t) {
  let n = e;
  const r = [];
  for (; Zn(n?.cause) && r.length < 10; ) {
    const s = Nr(n.cause);
    r.push({
      message: n.cause.message,
      source: t,
      type: s?.name,
      stack: s && Mr(s)
    }), n = n.cause;
  }
  return r.length ? r : void 0;
}
var Wt;
(function(e) {
  e.TRACK_INTAKE_REQUESTS = "track_intake_requests", e.WRITABLE_RESOURCE_GRAPHQL = "writable_resource_graphql", e.USE_TREE_WALKER_FOR_ACTION_NAME = "use_tree_walker_for_action_name", e.GRAPHQL_TRACKING = "graphql_tracking", e.FEATURE_OPERATION_VITAL = "feature_operation_vital", e.SHORT_SESSION_INVESTIGATION = "short_session_investigation";
})(Wt || (Wt = {}));
const Sc = /* @__PURE__ */ new Set();
function Lf(e) {
  Array.isArray(e) && hE(e.filter((t) => vo(Wt, t)));
}
function hE(e) {
  e.forEach((t) => {
    Sc.add(t);
  });
}
function Pr(e) {
  return Sc.has(e);
}
function mE() {
  return Sc;
}
const gE = 200;
function ti(e) {
  const { env: t, service: n, version: r, datacenter: s, sdkVersion: o, variant: i } = e, a = [gn("sdk_version", o ?? "6.21.2")];
  return t && a.push(gn("env", t)), n && a.push(gn("service", n)), r && a.push(gn("version", r)), s && a.push(gn("datacenter", s)), i && a.push(gn("variant", i)), a;
}
function gn(e, t) {
  const n = t ? `${e}:${t}` : e;
  return (n.length > gE || yE(n)) && W.warn(`Tag ${n} doesn't meet tag requirements and will be sanitized. ${mc} ${qo}/getting_started/tagging/#defining-tags`), Nf(n);
}
function Nf(e) {
  return e.replace(/,/g, "_");
}
function yE(e) {
  return _E() ? new RegExp("[^\\p{Ll}\\p{Lo}0-9_:./-]", "u").test(e) : !1;
}
function _E() {
  try {
    return new RegExp("[\\p{Ll}]", "u"), !0;
  } catch {
    return !1;
  }
}
const Mf = "datad0g.com", bE = "dd0g-gov.com", An = "datadoghq.com", wE = "datadoghq.eu", EE = "ddog-gov.com", SE = "pci.browser-intake-datadoghq.com", TE = ["ddsource", "dd-api-key", "dd-request-id"];
function ni(e, t) {
  const n = ht.__ddBrowserSdkExtensionCallback;
  n && n({ type: e, payload: t });
}
function Ao(e, t, n = vE()) {
  if (t === void 0)
    return e;
  if (typeof t != "object" || t === null)
    return t;
  if (t instanceof Date)
    return new Date(t.getTime());
  if (t instanceof RegExp) {
    const s = t.flags || // old browsers compatibility
    [
      t.global ? "g" : "",
      t.ignoreCase ? "i" : "",
      t.multiline ? "m" : "",
      t.sticky ? "y" : "",
      t.unicode ? "u" : ""
    ].join("");
    return new RegExp(t.source, s);
  }
  if (n.hasAlreadyBeenSeen(t))
    return;
  if (Array.isArray(t)) {
    const s = Array.isArray(e) ? e : [];
    for (let o = 0; o < t.length; ++o)
      s[o] = Ao(s[o], t[o], n);
    return s;
  }
  const r = Jn(e) === "object" ? e : {};
  for (const s in t)
    Object.prototype.hasOwnProperty.call(t, s) && (r[s] = Ao(r[s], t[s], n));
  return r;
}
function ri(e) {
  return Ao(void 0, e);
}
function ot(...e) {
  let t;
  for (const n of e)
    n != null && (t = Ao(t, n));
  return t;
}
function vE() {
  if (typeof WeakSet < "u") {
    const t = /* @__PURE__ */ new WeakSet();
    return {
      hasAlreadyBeenSeen(n) {
        const r = t.has(n);
        return r || t.add(n), r;
      }
    };
  }
  const e = [];
  return {
    hasAlreadyBeenSeen(t) {
      const n = e.indexOf(t) >= 0;
      return n || e.push(t), n;
    }
  };
}
function Pf() {
  var e;
  const t = ht.navigator;
  return {
    status: t.onLine ? "connected" : "not_connected",
    interfaces: t.connection && t.connection.type ? [t.connection.type] : void 0,
    effective_type: (e = t.connection) === null || e === void 0 ? void 0 : e.effectiveType
  };
}
function Df(e) {
  return e >= 500;
}
function Uf(e) {
  try {
    return e.clone();
  } catch {
    return;
  }
}
const Ye = {
  AGENT: "agent",
  CONSOLE: "console",
  CUSTOM: "custom",
  LOGGER: "logger",
  NETWORK: "network",
  SOURCE: "source",
  REPORT: "report"
}, IE = 80 * $n, kE = 32, Ff = 20 * of, CE = He, $f = Oe;
function Bf(e, t, n, r, s, o) {
  t.transportStatus === 0 && t.queuedPayloads.size() === 0 && t.bandwidthMonitor.canHandle(e) ? Wf(e, t, n, o, {
    onSuccess: () => Hf(0, t, n, r, s, o),
    onFailure: () => {
      t.queuedPayloads.enqueue(e) || o.notify({ type: "queue-full", bandwidth: t.bandwidthMonitor.stats(), payload: e }), Vf(t, n, r, s, o);
    }
  }) : t.queuedPayloads.enqueue(e) || o.notify({ type: "queue-full", bandwidth: t.bandwidthMonitor.stats(), payload: e });
}
function Vf(e, t, n, r, s) {
  e.transportStatus === 2 && Re(() => {
    const o = e.queuedPayloads.first();
    Wf(o, e, t, s, {
      onSuccess: () => {
        e.queuedPayloads.dequeue(), e.currentBackoffTime = $f, Hf(1, e, t, n, r, s);
      },
      onFailure: () => {
        e.currentBackoffTime = Math.min(CE, e.currentBackoffTime * 2), Vf(e, t, n, r, s);
      }
    });
  }, e.currentBackoffTime);
}
function Wf(e, t, n, r, { onSuccess: s, onFailure: o }) {
  t.bandwidthMonitor.add(e), n(e, (i) => {
    t.bandwidthMonitor.remove(e), AE(i) ? (t.transportStatus = t.bandwidthMonitor.ongoingRequestCount > 0 ? 1 : 2, e.retry = {
      count: e.retry ? e.retry.count + 1 : 1,
      lastFailureStatus: i.status
    }, r.notify({ type: "failure", bandwidth: t.bandwidthMonitor.stats(), payload: e }), o()) : (t.transportStatus = 0, r.notify({ type: "success", bandwidth: t.bandwidthMonitor.stats(), payload: e }), s());
  });
}
function Hf(e, t, n, r, s, o) {
  e === 0 && t.queuedPayloads.isFull() && !t.queueFullReported && (s({
    message: `Reached max ${r} events size queued for upload: ${Ff / of}MiB`,
    source: Ye.AGENT,
    startClocks: Ee()
  }), t.queueFullReported = !0);
  const i = t.queuedPayloads;
  for (t.queuedPayloads = Gf(); i.size() > 0; )
    Bf(i.dequeue(), t, n, r, s, o);
}
function AE(e) {
  return e.type !== "opaque" && (e.status === 0 && !navigator.onLine || e.status === 408 || e.status === 429 || Df(e.status));
}
function RE() {
  return {
    transportStatus: 0,
    currentBackoffTime: $f,
    bandwidthMonitor: xE(),
    queuedPayloads: Gf(),
    queueFullReported: !1
  };
}
function Gf() {
  const e = [];
  return {
    bytesCount: 0,
    enqueue(t) {
      return this.isFull() ? !1 : (e.push(t), this.bytesCount += t.bytesCount, !0);
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
      return this.bytesCount >= Ff;
    }
  };
}
function xE() {
  return {
    ongoingRequestCount: 0,
    ongoingByteCount: 0,
    canHandle(e) {
      return this.ongoingRequestCount === 0 || this.ongoingByteCount + e.bytesCount <= IE && this.ongoingRequestCount < kE;
    },
    add(e) {
      this.ongoingRequestCount += 1, this.ongoingByteCount += e.bytesCount;
    },
    remove(e) {
      this.ongoingRequestCount -= 1, this.ongoingByteCount -= e.bytesCount;
    },
    stats() {
      return {
        ongoingByteCount: this.ongoingByteCount,
        ongoingRequestCount: this.ongoingRequestCount
      };
    }
  };
}
function si(e, t, n) {
  const r = new Z(), s = RE();
  return {
    observable: r,
    send: (o) => {
      for (const i of e)
        Bf(o, s, (a, c) => NE(i, t, a, c), i.trackType, n, r);
    },
    /**
     * Since fetch keepalive behaves like regular fetch on Firefox,
     * keep using sendBeaconStrategy on exit
     */
    sendOnExit: (o) => {
      for (const i of e)
        OE(i, t, o);
    }
  };
}
function OE(e, t, n) {
  if (!!navigator.sendBeacon && n.bytesCount < t)
    try {
      const s = e.build("beacon", n);
      if (navigator.sendBeacon(s, n.data))
        return;
    } catch (s) {
      LE(s);
    }
  Sa(e, n);
}
let qu = !1;
function LE(e) {
  qu || (qu = !0, dt(e));
}
function NE(e, t, n, r) {
  if (ME() && n.bytesCount < t) {
    const o = e.build("fetch-keepalive", n);
    fetch(o, { method: "POST", body: n.data, keepalive: !0, mode: "cors" }).then(D((i) => r?.({ status: i.status, type: i.type }))).catch(D(() => Sa(e, n, r)));
  } else
    Sa(e, n, r);
}
function Sa(e, t, n) {
  const r = e.build("fetch", t);
  fetch(r, { method: "POST", body: t.data, mode: "cors" }).then(D((s) => n?.({ status: s.status, type: s.type }))).catch(D(() => n?.({ status: 0 })));
}
function ME() {
  try {
    return window.Request && "keepalive" in new Request("http://a");
  } catch {
    return !1;
  }
}
function Qn() {
  const e = PE();
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
        const s = r ? { id: r } : void 0;
        e.send(JSON.stringify({ eventType: t, event: n, view: s }));
      }
    };
}
function zf(e) {
  const t = Qn();
  return !!t && t.getCapabilities().includes(e);
}
function xt(e) {
  var t;
  e === void 0 && (e = (t = Xe().location) === null || t === void 0 ? void 0 : t.hostname);
  const n = Qn();
  return !!n && n.getAllowedWebViewHosts().some((r) => e === r || e.endsWith(`.${r}`));
}
function PE() {
  return Xe().DatadogEventBridge;
}
function me(e, t, n, r, s) {
  return qe(e, t, [n], r, s);
}
function qe(e, t, n, r, { once: s, capture: o, passive: i } = {}) {
  const a = D((d) => {
    !d.isTrusted && !d.__ddIsTrusted && !e.allowUntrustedEvents || (s && l(), r(d));
  }), c = i ? { capture: o, passive: i } : o, u = window.EventTarget && t instanceof EventTarget ? window.EventTarget.prototype : t, f = ln(u, "addEventListener");
  n.forEach((d) => f.call(t, d, a, c));
  function l() {
    const d = ln(u, "removeEventListener");
    n.forEach((p) => d.call(t, p, a, c));
  }
  return {
    stop: l
  };
}
const yr = {
  HIDDEN: "visibility_hidden",
  UNLOADING: "before_unload",
  PAGEHIDE: "page_hide",
  FROZEN: "page_frozen"
};
function Kf(e) {
  return new Z((t) => {
    const { stop: n } = qe(e, window, [
      "visibilitychange",
      "freeze"
      /* DOM_EVENT.FREEZE */
    ], (s) => {
      s.type === "visibilitychange" && document.visibilityState === "hidden" ? t.notify({ reason: yr.HIDDEN }) : s.type === "freeze" && t.notify({ reason: yr.FROZEN });
    }, { capture: !0 }), r = me(e, window, "beforeunload", () => {
      t.notify({ reason: yr.UNLOADING });
    }).stop;
    return () => {
      n(), r();
    };
  });
}
function jf(e) {
  return Co(yr).includes(e);
}
function Tc({ encoder: e, request: t, flushController: n, messageBytesLimit: r }) {
  let s = {};
  const o = n.flushObservable.subscribe((l) => f(l));
  function i(l, d, p) {
    n.notifyBeforeAddMessage(d), p !== void 0 ? (s[p] = l, n.notifyAfterAddMessage()) : e.write(e.isEmpty ? l : `
${l}`, (h) => {
      n.notifyAfterAddMessage(h - d);
    });
  }
  function a(l) {
    return l !== void 0 && s[l] !== void 0;
  }
  function c(l) {
    const d = s[l];
    delete s[l];
    const p = e.estimateEncodedBytesCount(d);
    n.notifyAfterRemoveMessage(p);
  }
  function u(l, d) {
    const p = Cs(l), h = e.estimateEncodedBytesCount(p);
    if (h >= r) {
      W.warn(`Discarded a message whose size was bigger than the maximum allowed size ${r}KB. ${mc} ${Yb}/#technical-limitations`);
      return;
    }
    a(d) && c(d), i(p, h, d);
  }
  function f(l) {
    const d = Co(s).join(`
`);
    s = {};
    const p = jf(l.reason), h = p ? t.sendOnExit : t.send;
    if (p && // Note: checking that the encoder is async is not strictly needed, but it's an optimization:
    // if the encoder is async we need to send two requests in some cases (one for encoded data
    // and the other for non-encoded data). But if it's not async, we don't have to worry about
    // it and always send a single request.
    e.isAsync) {
      const m = e.finishSync();
      m.outputBytesCount && h(Xu(m));
      const g = [m.pendingData, d].filter(Boolean).join(`
`);
      g && h({
        data: g,
        bytesCount: af(g)
      });
    } else
      d && e.write(e.isEmpty ? d : `
${d}`), e.finish((m) => {
        h(Xu(m));
      });
  }
  return {
    flushController: n,
    add: u,
    upsert: u,
    stop: o.unsubscribe
  };
}
function Xu(e) {
  let t;
  return typeof e.output == "string" ? t = e.output : t = new Blob([e.output], {
    // This will set the 'Content-Type: text/plain' header. Reasoning:
    // * The intake rejects the request if there is no content type.
    // * The browser will issue CORS preflight requests if we set it to 'application/json', which
    // could induce higher intake load (and maybe has other impacts).
    // * Also it's not quite JSON, since we are concatenating multiple JSON objects separated by
    // new lines.
    type: "text/plain"
  }), {
    data: t,
    bytesCount: e.outputBytesCount,
    encoding: e.encoding
  };
}
function vc({ messagesLimit: e, bytesLimit: t, durationLimit: n, pageMayExitObservable: r, sessionExpireObservable: s }) {
  const o = r.subscribe((h) => f(h.reason)), i = s.subscribe(() => f("session_expire")), a = new Z(() => () => {
    o.unsubscribe(), i.unsubscribe();
  });
  let c = 0, u = 0;
  function f(h) {
    if (u === 0)
      return;
    const m = u, g = c;
    u = 0, c = 0, p(), a.notify({
      reason: h,
      messagesCount: m,
      bytesCount: g
    });
  }
  let l;
  function d() {
    l === void 0 && (l = Re(() => {
      f("duration_limit");
    }, n));
  }
  function p() {
    ze(l), l = void 0;
  }
  return {
    flushObservable: a,
    get messagesCount() {
      return u;
    },
    /**
     * Notifies that a message will be added to a pool of pending messages waiting to be flushed.
     *
     * This function needs to be called synchronously, right before adding the message, so no flush
     * event can happen after `notifyBeforeAddMessage` and before adding the message.
     *
     * @param estimatedMessageBytesCount - an estimation of the message bytes count once it is
     * actually added.
     */
    notifyBeforeAddMessage(h) {
      c + h >= t && f("bytes_limit"), u += 1, c += h, d();
    },
    /**
     * Notifies that a message *was* added to a pool of pending messages waiting to be flushed.
     *
     * This function can be called asynchronously after the message was added, but in this case it
     * should not be called if a flush event occurred in between.
     *
     * @param messageBytesCountDiff - the difference between the estimated message bytes count and
     * its actual bytes count once added to the pool.
     */
    notifyAfterAddMessage(h = 0) {
      c += h, u >= e ? f("messages_limit") : c >= t && f("bytes_limit");
    },
    /**
     * Notifies that a message was removed from a pool of pending messages waiting to be flushed.
     *
     * This function needs to be called synchronously, right after removing the message, so no flush
     * event can happen after removing the message and before `notifyAfterRemoveMessage`.
     *
     * @param messageBytesCount - the message bytes count that was added to the pool. Should
     * correspond to the sum of bytes counts passed to `notifyBeforeAddMessage` and
     * `notifyAfterAddMessage`.
     */
    notifyAfterRemoveMessage(h) {
      c -= h, u -= 1, u === 0 && p();
    }
  };
}
const mt = "DISCARDED", xe = "SKIPPED";
function qf() {
  const e = {};
  return {
    register(t, n) {
      return e[t] || (e[t] = []), e[t].push(n), {
        unregister: () => {
          e[t] = e[t].filter((r) => r !== n);
        }
      };
    },
    triggerHook(t, n) {
      const r = e[t] || [], s = [];
      for (const o of r) {
        const i = o(n);
        if (i === mt)
          return mt;
        i !== xe && s.push(i);
      }
      return ot(...s);
    }
  };
}
const an = {
  LOG: "log",
  CONFIGURATION: "configuration",
  USAGE: "usage"
}, DE = [
  "https://www.datadoghq-browser-agent.com",
  "https://www.datad0g-browser-agent.com",
  "https://d3uc069fcn7uxw.cloudfront.net",
  "https://d20xtzwzcl0ceb.cloudfront.net",
  "http://localhost",
  "<anonymous>"
], UE = 1, FE = [EE];
let Ni;
function Dr() {
  return Ni || (Ni = new df(100)), Ni;
}
function Xf(e, t, n, r, s, o) {
  const i = new Z(), { stop: a } = BE(t, r, s, o, i), { enabled: c, metricsEnabled: u } = $E(e, t, n, i);
  return {
    stop: a,
    enabled: c,
    metricsEnabled: u
  };
}
function $E(e, t, n, r, s = UE) {
  const o = {}, i = !FE.includes(t.site) && tn(t.telemetrySampleRate), a = {
    [an.LOG]: i,
    [an.CONFIGURATION]: i && tn(t.telemetryConfigurationSampleRate),
    [an.USAGE]: i && tn(t.telemetryUsageSampleRate),
    // not an actual "type" but using a single draw for all metrics
    metric: i && tn(s)
  }, c = VE(), u = Dr();
  return u.subscribe(({ rawEvent: l, metricName: d }) => {
    if (d && !a.metric || !a[l.type])
      return;
    const p = d || l.status || l.type;
    let h = o[p];
    if (h || (h = o[p] = /* @__PURE__ */ new Set()), h.size >= t.maxTelemetryEventsPerPage)
      return;
    const m = Cs(l);
    if (h.has(m))
      return;
    const g = n.triggerHook(1, {
      startTime: Ee().relative
    });
    if (g === mt)
      return;
    const _ = f(g, e, l, c);
    r.notify(_), ni("telemetry", _), h.add(m);
  }), u.unbuffer(), ow(Ic), {
    enabled: i,
    metricsEnabled: a.metric
  };
  function f(l, d, p, h) {
    const g = {
      type: "telemetry",
      date: Ee().timeStamp,
      service: d,
      version: "6.21.2",
      source: "browser",
      _dd: {
        format_version: 2
      },
      telemetry: ot(p, {
        runtime_env: h,
        connectivity: Pf(),
        sdk_setup: "npm"
      }),
      ddtags: ti(t).join(","),
      experimental_features: Array.from(mE())
    };
    return ot(g, l);
  }
}
function BE(e, t, n, r, s) {
  const o = [];
  if (xt()) {
    const i = Qn(), a = s.subscribe((c) => i.send("internal_telemetry", c));
    o.push(a.unsubscribe);
  } else {
    const i = [e.rumEndpointBuilder];
    e.replica && WE(e) && i.push(e.replica.rumEndpointBuilder);
    const a = Tc({
      encoder: r(
        4
        /* DeflateEncoderStreamId.TELEMETRY */
      ),
      request: si(i, e.batchBytesLimit, t),
      flushController: vc({
        messagesLimit: e.batchMessagesLimit,
        bytesLimit: e.batchBytesLimit,
        durationLimit: e.flushTimeout,
        pageMayExitObservable: n,
        // We don't use an actual session expire observable here, to make telemetry collection
        // independent of the session. This allows to start and send telemetry events earlier.
        sessionExpireObservable: new Z()
      }),
      messageBytesLimit: e.messageBytesLimit
    });
    o.push(a.stop);
    const c = s.subscribe(a.add);
    o.push(c.unsubscribe);
  }
  return {
    stop: () => o.forEach((i) => i())
  };
}
function VE() {
  var e;
  return {
    is_local_file: ((e = ht.location) === null || e === void 0 ? void 0 : e.protocol) === "file:",
    is_worker: Bn
  };
}
function WE(e) {
  return e.site === Mf;
}
function Kt(e, t) {
  ba(ve.debug, e, t), Dr().notify({
    rawEvent: {
      type: an.LOG,
      message: e,
      status: "debug",
      ...t
    }
  });
}
function Ic(e, t) {
  Dr().notify({
    rawEvent: {
      type: an.LOG,
      status: "error",
      ...HE(e),
      ...t
    }
  });
}
function Yf(e) {
  Dr().notify({
    rawEvent: {
      type: an.CONFIGURATION,
      configuration: e
    }
  });
}
function As(e, t) {
  Dr().notify({
    rawEvent: {
      type: an.LOG,
      message: e,
      status: "debug",
      ...t
    },
    metricName: e
  });
}
function Ce(e) {
  Dr().notify({
    rawEvent: {
      type: an.USAGE,
      usage: e
    }
  });
}
function HE(e) {
  if (Zn(e)) {
    const t = Nr(e);
    return {
      error: {
        kind: t.name,
        stack: Mr(GE(t))
      },
      message: t.message
    };
  }
  return {
    error: {
      stack: Of
    },
    message: `Uncaught ${Cs(e)}`
  };
}
function GE(e) {
  return e.stack = e.stack.filter((t) => !t.url || DE.some((n) => t.url.startsWith(n))), e;
}
const Yu = "Running the Browser SDK in a Web extension content script is discouraged and will be forbidden in a future major release unless the `allowedTrackingOrigins` option is provided.", zE = "SDK initialized on a non-allowed domain.";
function KE(e, t, n = typeof location < "u" ? location.origin : "") {
  const r = e.allowedTrackingOrigins;
  if (!r) {
    if (Vw(n, t)) {
      W.warn(Yu);
      const o = Ww(t);
      Kt(Yu, {
        extensionUrl: o || "unknown"
      });
    }
    return !0;
  }
  const s = Qo(r, n);
  return s || W.error(zE), s;
}
function Sn(e, t, n) {
  const r = jE(e, t);
  return {
    build(s, o) {
      const i = qE(e, t, s, o, n);
      return r(i);
    },
    trackType: t
  };
}
function jE(e, t) {
  const n = `/api/v2/${t}`, r = e.proxy;
  if (typeof r == "string") {
    const o = _c(r);
    return (i) => `${o}?ddforward=${encodeURIComponent(`${n}?${i}`)}`;
  }
  if (typeof r == "function")
    return (o) => r({ path: n, parameters: o });
  const s = Jf(t, e);
  return (o) => `https://${s}${n}?${o}`;
}
function Jf(e, t) {
  const { site: n = An, internalAnalyticsSubdomain: r } = t;
  if (e === "logs" && t.usePciIntake && n === An)
    return SE;
  if (r && n === An)
    return `${r}.${An}`;
  if (n === bE)
    return `http-intake.logs.${n}`;
  const s = n.split("."), o = s.pop();
  return `browser-intake-${s.join("-")}.${o}`;
}
function qE({ clientToken: e, internalAnalyticsSubdomain: t, source: n = "browser" }, r, s, { retry: o, encoding: i }, a = []) {
  const c = [
    `ddsource=${n}`,
    `dd-api-key=${e}`,
    `dd-evp-origin-version=${encodeURIComponent("6.21.2")}`,
    "dd-evp-origin=browser",
    `dd-request-id=${Ue()}`
  ].concat(a);
  return i && c.push(`dd-evp-encoding=${i}`), r === "rum" && (c.push(`batch_time=${oe()}`, `_dd.api=${s}`), o && c.push(`_dd.retry_count=${o.count}`, `_dd.retry_after=${o.lastFailureStatus}`)), t && c.reverse(), c.join("&");
}
function XE(e) {
  const t = e.site || An, n = YE(e.source), r = JE({ ...e, site: t, source: n });
  return {
    replica: ZE({ ...e, site: t, source: n }),
    site: t,
    source: n,
    ...r
  };
}
function YE(e) {
  return e === "flutter" || e === "unity" ? e : "browser";
}
function JE(e) {
  return {
    logsEndpointBuilder: Sn(e, "logs"),
    rumEndpointBuilder: Sn(e, "rum"),
    profilingEndpointBuilder: Sn(e, "profile"),
    sessionReplayEndpointBuilder: Sn(e, "replay"),
    exposuresEndpointBuilder: Sn(e, "exposures")
  };
}
function ZE(e) {
  if (!e.replica)
    return;
  const t = {
    ...e,
    site: An,
    clientToken: e.replica.clientToken
  };
  return {
    logsEndpointBuilder: Sn(t, "logs"),
    rumEndpointBuilder: Sn(t, "rum", [
      `application.id=${e.replica.applicationId}`
    ])
  };
}
function Zf(e) {
  return TE.every((t) => e.includes(t));
}
const pr = {
  ALLOW: "allow",
  MASK: "mask",
  MASK_USER_INPUT: "mask-user-input",
  MASK_UNLESS_ALLOWLISTED: "mask-unless-allowlisted"
}, Ta = {
  ALL: "all",
  SAMPLED: "sampled"
};
function Mi(e, t) {
  return e != null && typeof e != "string" ? (W.error(`${t} must be defined as a string`), !1) : !0;
}
function QE(e) {
  return e && typeof e == "string" && !/(datadog|ddog|datad0g|dd0g)/.test(e) ? (W.error(`Site should be a valid Datadog site. ${mc} ${qo}/getting_started/site/.`), !1) : !0;
}
function hr(e, t) {
  return e !== void 0 && !Jb(e) ? (W.error(`${t} Sample Rate should be a number between 0 and 100`), !1) : !0;
}
function Qf(e, t) {
  var n, r, s, o, i, a, c, u, f, l;
  if (!e || !e.clientToken) {
    W.error("Client Token is not configured, we will not send any data.");
    return;
  }
  if (e.allowedTrackingOrigins !== void 0 && !Array.isArray(e.allowedTrackingOrigins)) {
    W.error("Allowed Tracking Origins must be an array");
    return;
  }
  if (!(!QE(e.site) || !hr(e.sessionSampleRate, "Session") || !hr(e.telemetrySampleRate, "Telemetry") || !hr(e.telemetryConfigurationSampleRate, "Telemetry Configuration") || !hr(e.telemetryUsageSampleRate, "Telemetry Usage") || !Mi(e.version, "Version") || !Mi(e.env, "Env") || !Mi(e.service, "Service") || !KE(e, t ?? ""))) {
    if (e.trackingConsent !== void 0 && !vo(wa, e.trackingConsent)) {
      W.error('Tracking Consent should be either "granted" or "not-granted"');
      return;
    }
    return {
      beforeSend: e.beforeSend && tf(e.beforeSend, "beforeSend threw an error:"),
      sessionStoreStrategyType: Bn ? void 0 : Fw(e),
      sessionSampleRate: (n = e.sessionSampleRate) !== null && n !== void 0 ? n : 100,
      telemetrySampleRate: (r = e.telemetrySampleRate) !== null && r !== void 0 ? r : 20,
      telemetryConfigurationSampleRate: (s = e.telemetryConfigurationSampleRate) !== null && s !== void 0 ? s : 5,
      telemetryUsageSampleRate: (o = e.telemetryUsageSampleRate) !== null && o !== void 0 ? o : 5,
      service: (i = e.service) !== null && i !== void 0 ? i : void 0,
      env: (a = e.env) !== null && a !== void 0 ? a : void 0,
      version: (c = e.version) !== null && c !== void 0 ? c : void 0,
      datacenter: (u = e.datacenter) !== null && u !== void 0 ? u : void 0,
      silentMultipleInit: !!e.silentMultipleInit,
      allowUntrustedEvents: !!e.allowUntrustedEvents,
      trackingConsent: (f = e.trackingConsent) !== null && f !== void 0 ? f : wa.GRANTED,
      trackAnonymousUser: (l = e.trackAnonymousUser) !== null && l !== void 0 ? l : !0,
      storeContextsAcrossPages: !!e.storeContextsAcrossPages,
      /**
       * beacon payload max queue size implementation is 64kb
       * ensure that we leave room for logs, rum and potential other users
       */
      batchBytesLimit: 16 * $n,
      eventRateLimiterThreshold: 3e3,
      maxTelemetryEventsPerPage: 15,
      /**
       * flush automatically, aim to be lower than ALB connection timeout
       * to maximize connection reuse.
       */
      flushTimeout: 30 * Oe,
      /**
       * Logs intake limit. When using the SDK in a Worker Environment, we
       * limit the batch size to 1 to ensure it can be sent in a single event.
       */
      batchMessagesLimit: Bn ? 1 : 50,
      messageBytesLimit: 256 * $n,
      /**
       * The source of the SDK, used for support plugins purposes.
       */
      variant: e.variant,
      sdkVersion: e.sdkVersion,
      ...XE(e)
    };
  }
}
function ep(e) {
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
    variant: e.variant
  };
}
function je(e, t, n, { computeHandlingStack: r } = {}) {
  let s = e[t];
  if (typeof s != "function")
    if (t in e && t.startsWith("on"))
      s = Y;
    else
      return { stop: Y };
  let o = !1;
  const i = function() {
    if (o)
      return s.apply(this, arguments);
    const a = Array.from(arguments);
    let c;
    Bt(n, null, [
      {
        target: this,
        parameters: a,
        onPostCall: (f) => {
          c = f;
        },
        handlingStack: r ? Ar("instrumented method") : void 0
      }
    ]);
    const u = s.apply(this, a);
    return c && Bt(c, null, [u]), u;
  };
  return e[t] = i, {
    stop: () => {
      o = !0, e[t] === i && (e[t] = s);
    }
  };
}
function Wr(e, t, n) {
  const r = Object.getOwnPropertyDescriptor(e, t);
  if (!r || !r.set || !r.configurable)
    return { stop: Y };
  const s = Y;
  let o = (a, c) => {
    Re(() => {
      o !== s && n(a, c);
    }, 0);
  };
  const i = function(a) {
    r.set.call(this, a), o(this, a);
  };
  return Object.defineProperty(e, t, {
    set: i
  }), {
    stop: () => {
      var a;
      ((a = Object.getOwnPropertyDescriptor(e, t)) === null || a === void 0 ? void 0 : a.set) === i && Object.defineProperty(e, t, r), o = s;
    }
  };
}
function eS() {
  return new Z((e) => {
    const t = (s, o) => {
      const i = ei({
        stackTrace: o,
        originalError: s,
        startClocks: Ee(),
        nonErrorPrefix: "Uncaught",
        source: Ye.SOURCE,
        handling: "unhandled"
      });
      e.notify(i);
    }, { stop: n } = tS(t), { stop: r } = nS(t);
    return () => {
      n(), r();
    };
  });
}
function tS(e) {
  return je(Xe(), "onerror", ({ parameters: [t, n, r, s, o] }) => {
    let i;
    Zn(o) || (i = oE(t, n, r, s)), e(o ?? t, i);
  });
}
function nS(e) {
  return je(Xe(), "onunhandledrejection", ({ parameters: [t] }) => {
    e(t.reason || "Empty reason");
  });
}
function tp(e) {
  const t = {
    version: "6.21.2",
    // This API method is intentionally not monitored, since the only thing executed is the
    // user-provided 'callback'.  All SDK usages executed in the callback should be monitored, and
    // we don't want to interfere with the user uncaught exceptions.
    onReady(n) {
      n();
    },
    ...e
  };
  return Object.defineProperty(t, "_setDebug", {
    get() {
      return iw;
    },
    enumerable: !1
  }), t;
}
function np(e, t, n) {
  const r = e[t];
  r && !r.q && r.version && W.warn("SDK is loaded more than once. This is unsupported and might have unexpected behavior."), e[t] = n, r && r.q && r.q.forEach((s) => tf(s, "onReady callback threw an error:")());
}
function oi(e, t) {
  t.silentMultipleInit || W.error(`${e} is already initialized.`);
}
const Rr = {
  intervention: "intervention",
  deprecation: "deprecation",
  cspViolation: "csp_violation"
};
function rp(e, t) {
  const n = [];
  t.includes(Rr.cspViolation) && n.push(sS(e));
  const r = t.filter((s) => s !== Rr.cspViolation);
  return r.length && n.push(rS(r)), lf(...n);
}
function rS(e) {
  return new Z((t) => {
    if (!window.ReportingObserver)
      return;
    const n = D((s, o) => s.forEach((i) => t.notify(oS(i)))), r = new window.ReportingObserver(n, {
      types: e,
      buffered: !0
    });
    return r.observe(), () => {
      r.disconnect();
    };
  });
}
function sS(e) {
  return new Z((t) => {
    const { stop: n } = me(e, document, "securitypolicyviolation", (r) => {
      t.notify(iS(r));
    });
    return n;
  });
}
function oS(e) {
  const { type: t, body: n } = e;
  return sp({
    type: n.id,
    message: `${t}: ${n.message}`,
    originalError: e,
    stack: op(n.id, n.message, n.sourceFile, n.lineNumber, n.columnNumber)
  });
}
function iS(e) {
  const t = `'${e.blockedURI}' blocked by '${e.effectiveDirective}' directive`;
  return sp({
    type: e.effectiveDirective,
    message: `${Rr.cspViolation}: ${t}`,
    originalError: e,
    csp: {
      disposition: e.disposition
    },
    stack: op(e.effectiveDirective, e.originalPolicy ? `${t} of the policy "${yc(e.originalPolicy, 100, "...")}"` : "no policy", e.sourceFile, e.lineNumber, e.columnNumber)
  });
}
function sp(e) {
  return {
    startClocks: Ee(),
    source: Ye.REPORT,
    handling: "unhandled",
    ...e
  };
}
function op(e, t, n, r, s) {
  return n ? Mr({
    name: e,
    message: t,
    stack: [
      {
        func: "?",
        url: n,
        line: r ?? void 0,
        column: s ?? void 0
      }
    ]
  }) : void 0;
}
function aS(e) {
  const t = /* @__PURE__ */ new Set();
  return e.forEach((n) => t.add(n)), Array.from(t);
}
function ip(e, t) {
  const n = e.indexOf(t);
  n >= 0 && e.splice(n, 1);
}
function ss(e) {
  return Array.isArray(e) && e.length > 0;
}
const qs = 1 / 0, cS = He;
let Hr = null;
const co = /* @__PURE__ */ new Set();
function uS() {
  co.forEach((e) => e());
}
function Ur({ expireDelay: e, maxEntries: t }) {
  let n = [];
  Hr || (Hr = Lr(() => uS(), cS));
  const r = () => {
    const f = Ze() - e;
    for (; n.length > 0 && n[n.length - 1].endTime < f; )
      n.pop();
  };
  co.add(r);
  function s(f, l) {
    const d = {
      value: f,
      startTime: l,
      endTime: qs,
      remove: () => {
        ip(n, d);
      },
      close: (p) => {
        d.endTime = p;
      }
    };
    return t && n.length >= t && n.pop(), n.unshift(d), d;
  }
  function o(f = qs, l = { returnInactive: !1 }) {
    for (const d of n)
      if (d.startTime <= f) {
        if (l.returnInactive || f <= d.endTime)
          return d.value;
        break;
      }
  }
  function i(f) {
    const l = n[0];
    l && l.endTime === qs && l.close(f);
  }
  function a(f = qs, l = 0) {
    const d = Or(f, l);
    return n.filter((p) => p.startTime <= d && f <= p.endTime).map((p) => p.value);
  }
  function c() {
    n = [];
  }
  function u() {
    co.delete(r), co.size === 0 && Hr && (Yo(Hr), Hr = null);
  }
  return { add: s, find: o, closeActive: i, findAll: a, reset: c, stop: u };
}
const lS = "datadog-synthetics-public-id", dS = "datadog-synthetics-result-id", fS = "datadog-synthetics-injects-rum";
function ii() {
  return Bn ? !1 : !!(ht._DATADOG_SYNTHETICS_INJECTS_RUM || nn(fS));
}
function ap() {
  const e = window._DATADOG_SYNTHETICS_PUBLIC_ID || nn(lS);
  return typeof e == "string" ? e : void 0;
}
function cp() {
  const e = window._DATADOG_SYNTHETICS_RESULT_ID || nn(dS);
  return typeof e == "string" ? e : void 0;
}
function up() {
  return !!(ap() && cp());
}
const pS = He, hS = Yn;
function lp(e, t, n, r) {
  const s = new Z(), o = new Z(), i = Bw(e.sessionStoreStrategyType, e, t, n), a = Ur({
    expireDelay: hS
  });
  if (i.renewObservable.subscribe(() => {
    a.add(c(), Ze()), s.notify();
  }), i.expireObservable.subscribe(() => {
    o.notify(), a.closeActive(Ze());
  }), i.expandOrRenewSession(), a.add(c(), gc().relative), Pr(Wt.SHORT_SESSION_INVESTIGATION)) {
    const u = i.getSession();
    u && bS(e, u);
  }
  r.observable.subscribe(() => {
    r.isGranted() ? i.expandOrRenewSession() : i.expire();
  }), mS(e, () => {
    r.isGranted() && i.expandOrRenewSession();
  }), gS(e, () => i.expandSession()), yS(e, () => i.restartSession());
  function c() {
    const u = i.getSession();
    return u ? {
      id: u.id,
      trackingType: u[t],
      isReplayForced: !!u.forcedReplay,
      anonymousId: u.anonymousId
    } : (_S().catch(() => {
    }), {
      id: "invalid",
      trackingType: yf,
      isReplayForced: !1,
      anonymousId: void 0
    });
  }
  return {
    findSession: (u, f) => a.find(u, f),
    renewObservable: s,
    expireObservable: o,
    sessionStateUpdateObservable: i.sessionStateUpdateObservable,
    expire: i.expire,
    updateSessionState: i.updateSessionState
  };
}
function mS(e, t) {
  const { stop: n } = qe(e, window, [
    "click",
    "touchstart",
    "keydown",
    "scroll"
    /* DOM_EVENT.SCROLL */
  ], t, { capture: !0, passive: !0 });
}
function gS(e, t) {
  const n = () => {
    document.visibilityState === "visible" && t();
  }, { stop: r } = me(e, document, "visibilitychange", n);
  Lr(n, pS);
}
function yS(e, t) {
  const { stop: n } = me(e, window, "resume", t, { capture: !0 });
}
async function _S() {
  const e = Sf();
  Kt("Unexpected session state", {
    session: e,
    isSyntheticsTest: up(),
    createdTimestamp: e?.created,
    expireTimestamp: e?.expire,
    cookie: await dp(),
    currentDomain: `${window.location.protocol}//${window.location.hostname}`
  });
}
function bS(e, t) {
  if (!window.cookieStore || !t.created)
    return;
  const n = Number(t.created), r = We(), { stop: s } = me(e, cookieStore, "change", o);
  function o(i) {
    const a = mf(i.changed, (u) => u.name === dn);
    if (!a)
      return;
    const c = We() - n;
    if (c > 14 * He)
      s();
    else {
      const u = Ec(a.value);
      if (u.id && u.id !== t.id) {
        s();
        const f = We() - r;
        dp().then((l) => {
          Kt("Session cookie changed", {
            time: f,
            session_age: c,
            old: t,
            new: u,
            cookie: l
          });
        }).catch(dt);
      }
    }
  }
}
async function dp() {
  let e;
  return "cookieStore" in window ? e = await window.cookieStore.getAll(dn) : e = document.cookie.split(/\s*;\s*/).filter((t) => t.startsWith(dn)), {
    count: e.length,
    domain: hf() || "undefined",
    ...e
  };
}
function kc() {
  let e = "", t = 0;
  return {
    isAsync: !1,
    get isEmpty() {
      return !e;
    },
    write(n, r) {
      const s = af(n);
      t += s, e += n, r && r(s);
    },
    finish(n) {
      n(this.finishSync());
    },
    finishSync() {
      const n = {
        output: e,
        outputBytesCount: t,
        rawBytesCount: t,
        pendingData: ""
      };
      return e = "", t = 0, n;
    },
    estimateEncodedBytesCount(n) {
      return n.length;
    }
  };
}
class fp {
  constructor() {
    this.callbacks = {};
  }
  notify(t, n) {
    const r = this.callbacks[t];
    r && r.forEach((s) => s(n));
  }
  subscribe(t, n) {
    return this.callbacks[t] || (this.callbacks[t] = []), this.callbacks[t].push(n), {
      unsubscribe: () => {
        this.callbacks[t] = this.callbacks[t].filter((r) => n !== r);
      }
    };
  }
}
function uo(e, t, n) {
  let r = 0, s = !1;
  return {
    isLimitReached() {
      if (r === 0 && Re(() => {
        r = 0;
      }, He), r += 1, r <= t || s)
        return s = !1, !1;
      if (r === t + 1) {
        s = !0;
        try {
          n({
            message: `Reached max number of ${e}s by minute: ${t}`,
            source: Ye.AGENT,
            startClocks: Ee()
          });
        } finally {
          s = !1;
        }
      }
      return !0;
    }
  };
}
function Cc(e, t, n) {
  return document.readyState === t || document.readyState === "complete" ? (n(), { stop: Y }) : me(e, window, t === "complete" ? "load" : "DOMContentLoaded", n, { once: !0 });
}
function wS(e, t) {
  return new Promise((n) => {
    Cc(e, t, n);
  });
}
let Pi;
const Ac = /* @__PURE__ */ new WeakMap();
function pp(e) {
  return Pi || (Pi = ES(e)), Pi;
}
function ES(e) {
  return new Z((t) => {
    const { stop: n } = je(XMLHttpRequest.prototype, "open", SS), { stop: r } = je(XMLHttpRequest.prototype, "send", (o) => {
      TS(o, e, t);
    }, { computeHandlingStack: !0 }), { stop: s } = je(XMLHttpRequest.prototype, "abort", vS);
    return () => {
      n(), r(), s();
    };
  });
}
function SS({ target: e, parameters: [t, n] }) {
  Ac.set(e, {
    state: "open",
    method: String(t).toUpperCase(),
    url: _c(String(n))
  });
}
function TS({ target: e, parameters: [t], handlingStack: n }, r, s) {
  const o = Ac.get(e);
  if (!o)
    return;
  const i = o;
  i.state = "start", i.startClocks = Ee(), i.isAborted = !1, i.xhr = e, i.handlingStack = n, i.body = t;
  let a = !1;
  const { stop: c } = je(e, "onreadystatechange", () => {
    e.readyState === XMLHttpRequest.DONE && u();
  }), u = () => {
    if (f(), c(), a)
      return;
    a = !0;
    const l = o;
    l.state = "complete", l.duration = _e(i.startClocks.timeStamp, oe()), l.status = e.status, s.notify(ds(l));
  }, { stop: f } = me(r, e, "loadend", u);
  s.notify(i);
}
function vS({ target: e }) {
  const t = Ac.get(e);
  t && (t.isAborted = !0);
}
let Di;
function ai() {
  return Di || (Di = IS()), Di;
}
function IS() {
  return new Z((e) => {
    if (!ht.fetch)
      return;
    const { stop: t } = je(ht, "fetch", (n) => kS(n, e), {
      computeHandlingStack: !0
    });
    return t;
  });
}
function kS({ parameters: e, onPostCall: t, handlingStack: n }, r) {
  const [s, o] = e;
  let i = o && o.method;
  i === void 0 && s instanceof Request && (i = s.method);
  const a = i !== void 0 ? String(i).toUpperCase() : "GET", c = s instanceof Request ? s.url : _c(String(s)), u = Ee(), f = {
    state: "start",
    init: o,
    input: s,
    method: a,
    startClocks: u,
    url: c,
    handlingStack: n
  };
  r.notify(f), e[0] = f.input, e[1] = f.init, t((l) => CS(r, l, f));
}
function CS(e, t, n) {
  const r = n;
  function s(o) {
    r.state = "resolve", Object.assign(r, o), e.notify(r);
  }
  t.then(D((o) => {
    s({
      response: o,
      responseType: o.type,
      status: o.status,
      isAborted: !1
    });
  }), D((o) => {
    var i, a;
    s({
      status: 0,
      isAborted: ((a = (i = r.init) === null || i === void 0 ? void 0 : i.signal) === null || a === void 0 ? void 0 : a.aborted) || o instanceof DOMException && o.code === DOMException.ABORT_ERR,
      error: o
    });
  }));
}
function hp(e, t) {
  if (window.requestIdleCallback && window.cancelIdleCallback) {
    const n = window.requestIdleCallback(D(e), t);
    return () => window.cancelIdleCallback(n);
  }
  return RS(e);
}
const AS = 50;
function RS(e) {
  const t = We(), n = Re(() => {
    e({
      didTimeout: !1,
      timeRemaining: () => Math.max(0, AS - (We() - t))
    });
  }, 0);
  return () => ze(n);
}
const xS = Oe, OS = 30;
function LS() {
  const e = [];
  function t(r) {
    let s;
    if (r.didTimeout) {
      const o = performance.now();
      s = () => OS - (performance.now() - o);
    } else
      s = r.timeRemaining.bind(r);
    for (; s() > 0 && e.length; )
      e.shift()();
    e.length && n();
  }
  function n() {
    hp(t, { timeout: xS });
  }
  return {
    push(r) {
      e.push(r) === 1 && n();
    },
    stop() {
      e.length = 0;
    }
  };
}
let Ui = {};
function mp(e) {
  const t = e.map((n) => (Ui[n] || (Ui[n] = NS(n)), Ui[n]));
  return lf(...t);
}
function NS(e) {
  return new Z((t) => {
    const n = Tt[e];
    return Tt[e] = (...r) => {
      n.apply(console, r);
      const s = Ar("console error");
      Bt(() => {
        t.notify(MS(r, e, s));
      });
    }, () => {
      Tt[e] = n;
    };
  });
}
function MS(e, t, n) {
  const r = e.map((s) => PS(s)).join(" ");
  if (t === ve.error) {
    const s = e.find(Zn), o = ei({
      originalError: s,
      handlingStack: n,
      startClocks: Ee(),
      source: Ye.CONSOLE,
      handling: "handled",
      nonErrorPrefix: "Provided",
      // if no good stack is computed from the error, let's not use the fallback stack message
      // advising the user to use an instance of Error, as console.error is commonly used without an
      // Error instance.
      useFallbackStack: !1
    });
    return o.message = r, {
      api: t,
      message: r,
      handlingStack: n,
      error: o
    };
  }
  return {
    api: t,
    message: r,
    error: void 0,
    handlingStack: n
  };
}
function PS(e) {
  return typeof e == "string" ? de(e) : Zn(e) ? xf(Nr(e)) : Cs(de(e), void 0, 2);
}
const DS = 500;
function gp() {
  const e = [];
  return {
    add: (s) => {
      e.push(s) > DS && e.splice(0, 1);
    },
    remove: (s) => {
      ip(e, s);
    },
    drain: (s) => {
      e.forEach((o) => o(s)), e.length = 0;
    }
  };
}
function US(e) {
  const t = Jn(e) === "object";
  return t || W.error("Unsupported context:", e), t;
}
function Fi(e, t, n) {
  const r = { ...e };
  for (const [s, { required: o, type: i }] of Object.entries(t))
    i === "string" && !Ju(r[s]) && (r[s] = String(r[s])), o && Ju(r[s]) && W.warn(`The property ${s} of ${n} is required; context will not be sent to the intake.`);
  return r;
}
function Ju(e) {
  return e == null || e === "";
}
function Rs(e = "", { propertiesConfig: t = {} } = {}) {
  let n = {};
  const r = new Z(), s = {
    getContext: () => ri(n),
    setContext: (o) => {
      US(o) ? n = de(Fi(o, t, e)) : s.clearContext(), r.notify();
    },
    setContextProperty: (o, i) => {
      n = de(Fi({ ...n, [o]: i }, t, e)), r.notify();
    },
    removeContextProperty: (o) => {
      delete n[o], Fi(n, t, e), r.notify();
    },
    clearContext: () => {
      n = {}, r.notify();
    },
    changeObservable: r
  };
  return s;
}
function ae(e, t, n, r) {
  return D((...s) => (r && Ce({ feature: r }), e()[t][n](...s)));
}
function $i(e, t, n) {
  e.changeObservable.subscribe(() => {
    const r = e.getContext();
    n.add((s) => s[t].setContext(r));
  });
}
const FS = "_dd_c", $S = [];
function Rc(e, t, n, r) {
  const s = BS(n, r);
  $S.push(me(e, window, "storage", ({ key: u }) => {
    s === u && i();
  })), t.changeObservable.subscribe(a);
  const o = ot(c(), t.getContext());
  Xn(o) || t.setContext(o);
  function i() {
    t.setContext(c());
  }
  function a() {
    localStorage.setItem(s, JSON.stringify(t.getContext()));
  }
  function c() {
    const u = localStorage.getItem(s);
    return u ? JSON.parse(u) : {};
  }
}
function BS(e, t) {
  return `${FS}_${e}_${t}`;
}
function yp(e, t, n) {
  const r = xc();
  return t.storeContextsAcrossPages && Rc(
    t,
    r,
    n,
    4
    /* CustomerDataType.Account */
  ), e.register(0, () => {
    const s = r.getContext();
    return Xn(s) || !s.id ? xe : {
      account: s
    };
  }), r;
}
function xc() {
  return Rs("account", {
    propertiesConfig: {
      id: { type: "string", required: !0 },
      name: { type: "string" }
    }
  });
}
function _p(e, t, n, r) {
  const s = Oc();
  return t.storeContextsAcrossPages && Rc(
    t,
    s,
    n,
    2
    /* CustomerDataType.GlobalContext */
  ), e.register(0, () => {
    const o = s.getContext();
    return r ? { context: o } : o;
  }), s;
}
function Oc() {
  return Rs("global context");
}
function bp(e, t, n, r) {
  const s = Lc();
  return t.storeContextsAcrossPages && Rc(
    t,
    s,
    r,
    1
    /* CustomerDataType.User */
  ), e.register(0, ({ eventType: o, startTime: i }) => {
    const a = s.getContext(), c = n.findTrackedSession(i);
    return c && c.anonymousId && !a.anonymous_id && t.trackAnonymousUser && (a.anonymous_id = c.anonymousId), Xn(a) ? xe : {
      type: o,
      usr: a
    };
  }), e.register(1, ({ startTime: o }) => {
    var i;
    return {
      anonymous_id: (i = n.findTrackedSession(o)) === null || i === void 0 ? void 0 : i.anonymousId
    };
  }), s;
}
function Lc() {
  return Rs("user", {
    propertiesConfig: {
      id: { type: "string" },
      name: { type: "string" },
      email: { type: "string" }
    }
  });
}
const Q = {
  userContext: "userContext",
  globalContext: "globalContext",
  accountContext: "accountContext"
}, ce = {
  getContext: "getContext",
  setContext: "setContext",
  setContextProperty: "setContextProperty",
  removeContextProperty: "removeContextProperty",
  clearContext: "clearContext"
};
function wp(e, t, n) {
  const r = e.getReader(), s = [];
  let o = 0;
  i();
  function i() {
    r.read().then(D((c) => {
      if (c.done) {
        a();
        return;
      }
      n.collectStreamBody && s.push(c.value), o += c.value.length, o > n.bytesLimit ? a() : i();
    }), D((c) => t(c)));
  }
  function a() {
    r.cancel().catch(
      // we don't care if cancel fails, but we still need to catch the error to avoid reporting it
      // as an unhandled rejection
      Y
    );
    let c, u;
    if (n.collectStreamBody) {
      let f;
      if (s.length === 1)
        f = s[0];
      else {
        f = new Uint8Array(o);
        let l = 0;
        s.forEach((d) => {
          f.set(d, l), l += d.length;
        });
      }
      c = f.slice(0, n.bytesLimit), u = f.length > n.bytesLimit;
    }
    t(void 0, c, u);
  }
}
const Fe = {
  DOCUMENT: "document",
  XHR: "xhr",
  BEACON: "beacon",
  FETCH: "fetch",
  CSS: "css",
  JS: "js",
  IMAGE: "image",
  FONT: "font",
  MEDIA: "media",
  OTHER: "other"
}, Vn = {
  FETCH: Fe.FETCH,
  XHR: Fe.XHR
}, VS = 500;
function Ep(e = eS) {
  const t = new df(VS), n = e().subscribe((r) => {
    t.notify({
      type: 0,
      error: r
    });
  });
  return {
    observable: t,
    stop: () => {
      n.unsubscribe();
    }
  };
}
function WS() {
  try {
    return new Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return;
  }
}
function Ro(e, t, n) {
  const r = n.getHandler(), s = Array.isArray(r) ? r : [r];
  return Zu[e] >= Zu[n.getLevel()] && s.includes(t);
}
const j = {
  ok: "ok",
  debug: "debug",
  info: "info",
  notice: "notice",
  warn: "warn",
  error: "error",
  critical: "critical",
  alert: "alert",
  emerg: "emerg"
}, Zu = {
  [j.ok]: 0,
  [j.debug]: 1,
  [j.info]: 2,
  [j.notice]: 4,
  [j.warn]: 5,
  [j.error]: 6,
  [j.critical]: 7,
  [j.alert]: 8,
  [j.emerg]: 9
};
function ci(e, {
  /**
   * Set this to `true` to include the error message in the error field. In most cases, the error
   * message is already included in the log message, so we don't need to include it again.
   */
  includeMessage: t = !1
} = {}) {
  return {
    stack: e.stack,
    kind: e.type,
    message: t ? e.message : void 0,
    causes: e.causes,
    fingerprint: e.fingerprint,
    handling: e.handling
  };
}
var HS = function(e, t, n, r) {
  var s = arguments.length, o = s < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, n) : r, i;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") o = Reflect.decorate(e, t, n, r);
  else for (var a = e.length - 1; a >= 0; a--) (i = e[a]) && (o = (s < 3 ? i(o) : s > 3 ? i(t, n, o) : i(t, n)) || o);
  return s > 3 && o && Object.defineProperty(t, n, o), o;
};
const ms = {
  console: "console",
  http: "http"
}, GS = Object.keys(j);
class it {
  constructor(t, n, r = ms.http, s = j.debug, o = {}) {
    this.handleLogStrategy = t, this.handlerType = r, this.level = s, this.contextManager = Rs("logger"), this.tags = [], this.contextManager.setContext(o), n && this.contextManager.setContextProperty("logger", { name: n });
  }
  logImplementation(t, n, r = j.info, s, o) {
    const i = de(n);
    let a;
    if (s != null) {
      const c = ei({
        originalError: s,
        nonErrorPrefix: "Provided",
        source: Ye.LOGGER,
        handling: "handled",
        startClocks: Ee()
      });
      a = ot({
        error: ci(c, { includeMessage: !0 })
      }, c.context, i);
    } else
      a = i;
    this.handleLogStrategy({
      message: de(t),
      context: a,
      status: r
    }, this, o);
  }
  log(t, n, r = j.info, s) {
    let o;
    Ro(r, ms.http, this) && (o = Ar("log")), this.logImplementation(t, n, r, s, o);
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
    this.tags.push(gn(t, n));
  }
  removeTagsWithKey(t) {
    const n = Nf(t);
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
HS([
  aw
], it.prototype, "logImplementation", null);
it.prototype.ok = jt(j.ok);
it.prototype.debug = jt(j.debug);
it.prototype.info = jt(j.info);
it.prototype.notice = jt(j.notice);
it.prototype.warn = jt(j.warn);
it.prototype.error = jt(j.error);
it.prototype.critical = jt(j.critical);
it.prototype.alert = jt(j.alert);
it.prototype.emerg = jt(j.emerg);
function jt(e) {
  return function(t, n, r) {
    let s;
    Ro(e, ms.http, this) && (s = Ar("log")), this.logImplementation(t, n, e, r, s);
  };
}
function Qu() {
  return Bn ? {} : {
    view: {
      referrer: document.referrer,
      url: window.location.href
    }
  };
}
const zS = 32 * $n;
function KS(e, t) {
  e.usePciIntake === !0 && e.site && e.site !== "datadoghq.com" && W.warn("PCI compliance for Logs is only available for Datadog organizations in the US1 site. Default intake will be used.");
  const n = Qf(e, t), r = el(e.forwardConsoleLogs, Co(ve), "Forward Console Logs"), s = el(e.forwardReports, Co(Rr), "Forward Reports");
  if (!(!n || !r || !s))
    return e.forwardErrorsToLogs && !r.includes(ve.error) && r.push(ve.error), {
      forwardErrorsToLogs: e.forwardErrorsToLogs !== !1,
      forwardConsoleLogs: r,
      forwardReports: s,
      requestErrorResponseLengthLimit: zS,
      ...n
    };
}
function el(e, t, n) {
  if (e === void 0)
    return [];
  if (!(e === "all" || Array.isArray(e) && e.every((r) => t.includes(r)))) {
    W.error(`${n} should be "all" or an array with allowed values "${t.join('", "')}"`);
    return;
  }
  return e === "all" ? t : aS(e);
}
function jS(e) {
  const t = ep(e);
  return {
    forward_errors_to_logs: e.forwardErrorsToLogs,
    forward_console_logs: e.forwardConsoleLogs,
    forward_reports: e.forwardReports,
    use_pci_intake: e.usePciIntake,
    ...t
  };
}
function qS(e, t, n) {
  const r = gp(), s = Oc();
  $i(s, Q.globalContext, r);
  const o = xc();
  $i(o, Q.accountContext, r);
  const i = Lc();
  $i(i, Q.userContext, r);
  let a, c;
  const u = t.observable.subscribe(f);
  function f() {
    if (!c || !a || !t.isGranted())
      return;
    u.unsubscribe();
    const l = n(a, c);
    r.drain(l);
  }
  return {
    init(l, d) {
      if (!l) {
        W.error("Missing configuration");
        return;
      }
      if (Lf(l.enableExperimentalFeatures), xt() && (l = XS(l)), a = l, Yf(jS(l)), c) {
        oi("DD_LOGS", l);
        return;
      }
      const p = KS(l, d);
      p && (c = p, ai().subscribe(Y), t.tryToInit(p.trackingConsent), f());
    },
    get initConfiguration() {
      return a;
    },
    globalContext: s,
    accountContext: o,
    userContext: i,
    getInternalContext: Y,
    handleLog(l, d, p, h = e(), m = oe()) {
      r.add((g) => g.handleLog(l, d, p, h, m));
    }
  };
}
function XS(e) {
  return { ...e, clientToken: "empty" };
}
function YS(e) {
  const t = kf(), n = Ep().observable;
  let r = qS(Qu, t, (a, c) => {
    const u = e(c, Qu, t, n);
    return r = JS(a, u), u;
  });
  const s = () => r, o = {}, i = new it((...a) => r.handleLog(...a));
  return tp({
    logger: i,
    init: (a) => {
      const c = new Error().stack;
      Bt(() => r.init(a, c));
    },
    setTrackingConsent: D((a) => {
      t.update(a), Ce({ feature: "set-tracking-consent", tracking_consent: a });
    }),
    getGlobalContext: ae(s, Q.globalContext, ce.getContext),
    setGlobalContext: ae(s, Q.globalContext, ce.setContext),
    setGlobalContextProperty: ae(s, Q.globalContext, ce.setContextProperty),
    removeGlobalContextProperty: ae(s, Q.globalContext, ce.removeContextProperty),
    clearGlobalContext: ae(s, Q.globalContext, ce.clearContext),
    createLogger: D((a, c = {}) => (o[a] = new it((...u) => r.handleLog(...u), de(a), c.handler, c.level, de(c.context)), o[a])),
    getLogger: D((a) => o[a]),
    getInitConfiguration: D(() => ri(r.initConfiguration)),
    getInternalContext: D((a) => r.getInternalContext(a)),
    setUser: ae(s, Q.userContext, ce.setContext),
    getUser: ae(s, Q.userContext, ce.getContext),
    setUserProperty: ae(s, Q.userContext, ce.setContextProperty),
    removeUserProperty: ae(s, Q.userContext, ce.removeContextProperty),
    clearUser: ae(s, Q.userContext, ce.clearContext),
    setAccount: ae(s, Q.accountContext, ce.setContext),
    getAccount: ae(s, Q.accountContext, ce.getContext),
    setAccountProperty: ae(s, Q.accountContext, ce.setContextProperty),
    removeAccountProperty: ae(s, Q.accountContext, ce.removeContextProperty),
    clearAccount: ae(s, Q.accountContext, ce.clearContext)
  });
}
function JS(e, t) {
  return {
    init: (n) => {
      oi("DD_LOGS", n);
    },
    initConfiguration: e,
    ...t
  };
}
const ZS = "logs";
function QS(e, t) {
  const n = lp(e, ZS, (r) => Sp(e, r), t);
  return {
    findTrackedSession: (r, s = { returnInactive: !1 }) => {
      const o = n.findSession(r, s);
      return o && o.trackingType === "1" ? {
        id: o.id,
        anonymousId: o.anonymousId
      } : void 0;
    },
    expireObservable: n.expireObservable
  };
}
function eT(e) {
  const n = Sp(e) === "1" ? {} : void 0;
  return {
    findTrackedSession: () => n,
    expireObservable: new Z()
  };
}
function Sp(e, t) {
  return tT(t) ? t : tn(e.sessionSampleRate) ? "1" : "0";
}
function tT(e) {
  return e === "0" || e === "1";
}
function nT(e, t, n, r, s) {
  const o = GS.concat(["custom"]), i = {};
  o.forEach((a) => {
    i[a] = uo(a, e.eventRateLimiterThreshold, s);
  }), t.subscribe(0, ({ rawLogsEvent: a, messageContext: c = void 0, savedCommonContext: u = void 0, domainContext: f, ddtags: l = [] }) => {
    var d, p;
    const h = Xo(a.date), m = u || r(), g = n.triggerHook(0, {
      startTime: h
    });
    if (g === mt)
      return;
    const _ = ti(e), y = ot({
      view: m.view
    }, g, a, c, {
      ddtags: _.concat(l).join(",")
    });
    ((d = e.beforeSend) === null || d === void 0 ? void 0 : d.call(e, y, f)) === !1 || y.origin !== Ye.AGENT && ((p = i[y.status]) !== null && p !== void 0 ? p : i.custom).isLimitReached() || t.notify(1, y);
  });
}
const rT = {
  [ve.log]: j.info,
  [ve.debug]: j.debug,
  [ve.info]: j.info,
  [ve.warn]: j.warn,
  [ve.error]: j.error
};
function sT(e, t) {
  const n = mp(e.forwardConsoleLogs).subscribe((r) => {
    var s;
    const o = {
      rawLogsEvent: {
        date: oe(),
        message: r.message,
        origin: Ye.CONSOLE,
        error: r.error && ci(r.error),
        status: rT[r.api]
      },
      messageContext: (s = r.error) === null || s === void 0 ? void 0 : s.context,
      domainContext: {
        handlingStack: r.handlingStack
      }
    };
    t.notify(0, o);
  });
  return {
    stop: () => {
      n.unsubscribe();
    }
  };
}
function oT(e, t) {
  const n = rp(e, e.forwardReports).subscribe((r) => {
    let s = r.message, o;
    const i = r.originalError.type === "deprecation" ? j.warn : j.error;
    i === j.error ? o = ci(r) : r.stack && (s += ` Found in ${fE(r.stack)}`), t.notify(0, {
      rawLogsEvent: {
        date: oe(),
        message: s,
        origin: Ye.REPORT,
        error: o,
        status: i
      }
    });
  });
  return {
    stop: () => {
      n.unsubscribe();
    }
  };
}
function iT(e, t) {
  if (!e.forwardErrorsToLogs)
    return { stop: Y };
  const n = (Bn ? new Z() : pp(e)).subscribe((o) => {
    o.state === "complete" && s(Vn.XHR, o);
  }), r = ai().subscribe((o) => {
    o.state === "resolve" && s(Vn.FETCH, o);
  });
  function s(o, i) {
    !Zf(i.url) && (lT(i) || Df(i.status)) && ("xhr" in i ? aT(i.xhr, e, a) : i.response ? uT(i.response, e, a) : i.error && cT(i.error, e, a));
    function a(c) {
      const u = {
        isAborted: i.isAborted,
        handlingStack: i.handlingStack
      };
      t.notify(0, {
        rawLogsEvent: {
          message: `${dT(o)} error ${i.method} ${i.url}`,
          date: i.startClocks.timeStamp,
          error: {
            stack: c || "Failed to load",
            // We don't know if the error was handled or not, so we set it to undefined
            handling: void 0
          },
          http: {
            method: i.method,
            // Cast resource method because of case mismatch cf issue RUMF-1152
            status_code: i.status,
            url: i.url
          },
          status: j.error,
          origin: Ye.NETWORK
        },
        domainContext: u
      });
    }
  }
  return {
    stop: () => {
      n.unsubscribe(), r.unsubscribe();
    }
  };
}
function aT(e, t, n) {
  typeof e.response == "string" ? n(Nc(e.response, t)) : n(e.response);
}
function cT(e, t, n) {
  n(Nc(Mr(Nr(e)), t));
}
function uT(e, t, n) {
  const r = Uf(e);
  !r || !r.body ? n() : window.TextDecoder ? fT(r.body, t.requestErrorResponseLengthLimit, (s, o) => {
    n(s ? `Unable to retrieve response: ${s}` : o);
  }) : r.text().then(D((s) => n(Nc(s, t))), D((s) => n(`Unable to retrieve response: ${s}`)));
}
function lT(e) {
  return e.status === 0 && e.responseType !== "opaque";
}
function Nc(e, t) {
  return e.length > t.requestErrorResponseLengthLimit ? `${e.substring(0, t.requestErrorResponseLengthLimit)}...` : e;
}
function dT(e) {
  return Vn.XHR === e ? "XHR" : "Fetch";
}
function fT(e, t, n) {
  wp(e, (r, s, o) => {
    if (r)
      n(r);
    else {
      let i = new TextDecoder().decode(s);
      o && (i += "..."), n(void 0, i);
    }
  }, {
    bytesLimit: t,
    collectStreamBody: !0
  });
}
function pT(e, t, n) {
  if (!e.forwardErrorsToLogs)
    return { stop: Y };
  const r = n.subscribe((s) => {
    if (s.type === 0) {
      const o = s.error;
      t.notify(0, {
        rawLogsEvent: {
          message: o.message,
          date: o.startClocks.timeStamp,
          error: ci(o),
          origin: Ye.SOURCE,
          status: j.error
        },
        messageContext: o.context
      });
    }
  });
  return {
    stop: () => {
      r.unsubscribe();
    }
  };
}
const hT = fp;
function mT(e) {
  function t(n, r, s, o, i) {
    const a = ot(r.getContext(), n.context);
    if (Ro(n.status, ms.console, r) && yT(n, a), Ro(n.status, ms.http, r)) {
      const c = {
        rawLogsEvent: {
          date: i || oe(),
          message: n.message,
          status: n.status,
          origin: Ye.LOGGER
        },
        messageContext: a,
        savedCommonContext: o,
        ddtags: r.getTags()
      };
      s && (c.domainContext = { handlingStack: s }), e.notify(0, c);
    }
  }
  return {
    handleLog: t
  };
}
const gT = {
  [j.ok]: ve.debug,
  [j.debug]: ve.debug,
  [j.info]: ve.info,
  [j.notice]: ve.info,
  [j.warn]: ve.warn,
  [j.error]: ve.error,
  [j.critical]: ve.error,
  [j.alert]: ve.error,
  [j.emerg]: ve.error
};
function yT({ status: e, message: t }, n) {
  bn[gT[e]].call(Tt, t, n);
}
function _T(e, t, n, r, s) {
  const o = [e.logsEndpointBuilder];
  e.replica && o.push(e.replica.logsEndpointBuilder);
  const i = Tc({
    encoder: kc(),
    request: si(o, e.batchBytesLimit, n),
    flushController: vc({
      messagesLimit: e.batchMessagesLimit,
      bytesLimit: e.batchBytesLimit,
      durationLimit: e.flushTimeout,
      pageMayExitObservable: r,
      sessionExpireObservable: s.expireObservable
    }),
    messageBytesLimit: e.messageBytesLimit
  });
  return t.subscribe(1, (a) => {
    i.add(a);
  }), i;
}
function bT(e) {
  const t = Qn();
  e.subscribe(1, (n) => {
    t.send("log", n);
  });
}
function wT(e) {
  return {
    get: (t) => {
      const n = e.findTrackedSession(t);
      if (n)
        return {
          session_id: n.id
        };
    }
  };
}
function ET(e) {
  return (t) => {
    e.notify(0, {
      rawLogsEvent: {
        message: t.message,
        date: t.startClocks.timeStamp,
        origin: Ye.AGENT,
        status: j.error
      }
    }), Kt("Error reported to customer", { "error.message": t.message });
  };
}
const ST = qf;
function TT(e) {
  const t = ht;
  e.register(0, ({ startTime: s }) => {
    const o = n(s);
    return o || xe;
  }), e.register(1, ({ startTime: s }) => {
    var o, i;
    const a = n(s);
    return a ? {
      application: { id: a.application_id },
      view: { id: (o = a.view) === null || o === void 0 ? void 0 : o.id },
      action: { id: (i = a.user_action) === null || i === void 0 ? void 0 : i.id }
    } : xe;
  });
  function n(s) {
    const i = ii() ? t.DD_RUM_SYNTHETICS : t.DD_RUM, a = r(s, i);
    if (a)
      return a;
  }
  function r(s, o) {
    if (o && o.getInternalContext)
      return o.getInternalContext(s);
  }
}
function vT(e, t, n) {
  e.register(0, ({ startTime: r }) => {
    const s = n.findTrackedSession(r);
    return n.findTrackedSession(r, { returnInactive: !0 }) ? {
      service: t.service,
      session_id: s ? s.id : void 0,
      session: s ? { id: s.id } : void 0
    } : mt;
  }), e.register(1, ({ startTime: r }) => {
    const s = n.findTrackedSession(r);
    return !s || !s.id ? xe : {
      session: { id: s.id }
    };
  });
}
function IT(e, t) {
  function n() {
    return t.isGranted() ? xe : mt;
  }
  e.register(0, n), e.register(1, n);
}
const Bi = "logs";
function kT(e, t, n, r) {
  const s = new hT(), o = ST(), i = [];
  s.subscribe(1, (g) => ni("logs", g));
  const a = ET(s), c = Bn ? new Z() : Kf(e), u = Xf("browser-logs-sdk", e, o, a, c, kc);
  i.push(u.stop);
  const f = e.sessionStoreStrategyType && !xt() && !ii() ? QS(e, n) : eT(e);
  IT(o, n), vT(o, e, f);
  const l = yp(o, e, Bi), d = bp(o, e, f, Bi), p = _p(o, e, Bi, !1);
  TT(o), iT(e, s), pT(e, s, r), r.unbuffer(), sT(e, s), oT(e, s);
  const { handleLog: h } = mT(s);
  if (nT(e, s, o, t, a), xt())
    bT(s);
  else {
    const { stop: g } = _T(e, s, a, c, f);
    i.push(() => g());
  }
  const m = wT(f);
  return {
    handleLog: h,
    getInternalContext: m.get,
    accountContext: l,
    globalContext: p,
    userContext: d,
    stop: () => {
      i.forEach((g) => g());
    }
  };
}
const Tn = YS(kT);
np(Xe(), "DD_LOGS", Tn);
const z = {
  ACTION: "action",
  ERROR: "error",
  LONG_TASK: "long_task",
  VIEW: "view",
  RESOURCE: "resource",
  VITAL: "vital"
}, Tp = {
  LONG_TASK: "long-task",
  LONG_ANIMATION_FRAME: "long-animation-frame"
}, Dt = {
  INITIAL_LOAD: "initial_load",
  ROUTE_CHANGE: "route_change",
  BF_CACHE: "bf_cache"
}, ui = {
  CLICK: "click",
  CUSTOM: "custom"
}, Gr = {
  RAGE_CLICK: "rage_click",
  ERROR_CLICK: "error_click",
  DEAD_CLICK: "dead_click"
}, gs = {
  DURATION: "duration",
  OPERATION_STEP: "operation_step"
};
function CT() {
  return { vitalsByName: /* @__PURE__ */ new Map(), vitalsByReference: /* @__PURE__ */ new WeakMap() };
}
function AT(e, t, n) {
  function r(i) {
    return !t.wasInPageStateDuringPeriod("frozen", i.startClocks.relative, i.duration);
  }
  function s(i) {
    r(i) && e.notify(12, tl(i));
  }
  function o(i, a, c, u) {
    if (!Pr(Wt.FEATURE_OPERATION_VITAL))
      return;
    const { operationKey: f, context: l, description: d } = c || {}, p = {
      name: i,
      type: gs.OPERATION_STEP,
      operationKey: f,
      failureReason: u,
      stepType: a,
      startClocks: Ee(),
      context: de(l),
      description: d
    };
    e.notify(12, tl(p));
  }
  return {
    addOperationStepVital: o,
    addDurationVital: s,
    startDurationVital: (i, a = {}) => vp(n, i, a),
    stopDurationVital: (i, a = {}) => {
      Ip(s, n, i, a);
    }
  };
}
function vp({ vitalsByName: e, vitalsByReference: t }, n, r = {}) {
  const s = {
    name: n,
    startClocks: Ee(),
    ...r
  }, o = { __dd_vital_reference: !0 };
  return e.set(n, s), t.set(o, s), o;
}
function Ip(e, { vitalsByName: t, vitalsByReference: n }, r, s = {}) {
  const o = typeof r == "string" ? t.get(r) : n.get(r);
  o && (e(RT(o, o.startClocks, s, Ee())), typeof r == "string" ? t.delete(r) : n.delete(r));
}
function RT(e, t, n, r) {
  var s;
  return {
    name: e.name,
    type: gs.DURATION,
    startClocks: t,
    duration: _e(t.timeStamp, r.timeStamp),
    context: ot(e.context, n.context),
    description: (s = n.description) !== null && s !== void 0 ? s : e.description
  };
}
function tl(e) {
  const { startClocks: t, type: n, name: r, description: s, context: o } = e, i = {
    id: Ue(),
    type: n,
    name: r,
    description: s,
    ...n === gs.DURATION ? { duration: q(e.duration) } : {
      step_type: e.stepType,
      operation_key: e.operationKey,
      failure_reason: e.failureReason
    }
  };
  return {
    rawRumEvent: {
      date: t.timeStamp,
      vital: i,
      type: z.VITAL,
      context: o
    },
    startTime: t.relative,
    duration: n === gs.DURATION ? e.duration : void 0,
    domainContext: {}
  };
}
function kp(e, t, n) {
  if (e)
    for (const r of e) {
      const s = r[t];
      s && s(n);
    }
}
const nl = /* @__PURE__ */ new Map();
function Cp(e, t) {
  if (t === 100)
    return !0;
  if (t === 0)
    return !1;
  const n = nl.get(t);
  if (n && e === n.sessionId)
    return n.decision;
  let r;
  return window.BigInt ? r = xT(BigInt(`0x${e.split("-")[4]}`), t) : r = tn(t), nl.set(t, { sessionId: e, decision: r }), r;
}
function xT(e, t) {
  const n = BigInt("1111111111111111111"), r = BigInt("0x10000000000000000"), s = e * n % r;
  return Number(s) <= t / 100 * Number(r);
}
function OT() {
  return Rp(64);
}
function Ap() {
  return Rp(63);
}
function Rp(e) {
  const t = crypto.getRandomValues(new Uint32Array(2));
  return e === 63 && (t[t.length - 1] >>>= 1), {
    toString(n = 10) {
      let r = t[1], s = t[0], o = "";
      do {
        const i = r % n * 4294967296 + s;
        r = Math.floor(r / n), s = Math.floor(i / n), o = (i % n).toString(n) + o;
      } while (r || s);
      return o;
    }
  };
}
function nr(e) {
  return e.toString(16).padStart(16, "0");
}
function LT(e) {
  const t = e;
  return Jn(t) === "object" && hs(t.match) && Array.isArray(t.propagatorTypes);
}
function NT(e) {
  e.status === 0 && !e.isAborted && (e.traceId = void 0, e.spanId = void 0, e.traceSampled = void 0);
}
function MT(e, t, n, r) {
  return {
    clearTracingIfNeeded: NT,
    traceFetch: (s) => rl(e, s, t, n, r, (o) => {
      var i;
      if (s.input instanceof Request && !(!((i = s.init) === null || i === void 0) && i.headers))
        s.input = new Request(s.input), Object.keys(o).forEach((a) => {
          s.input.headers.append(a, o[a]);
        });
      else {
        s.init = ds(s.init);
        const a = [];
        s.init.headers instanceof Headers ? s.init.headers.forEach((c, u) => {
          a.push([u, c]);
        }) : Array.isArray(s.init.headers) ? s.init.headers.forEach((c) => {
          a.push(c);
        }) : s.init.headers && Object.keys(s.init.headers).forEach((c) => {
          a.push([c, s.init.headers[c]]);
        }), s.init.headers = a.concat(bc(o));
      }
    }),
    traceXhr: (s, o) => rl(e, s, t, n, r, (i) => {
      Object.keys(i).forEach((a) => {
        o.setRequestHeader(a, i[a]);
      });
    })
  };
}
function rl(e, t, n, r, s, o) {
  const i = n.findTrackedSession();
  if (!i)
    return;
  const a = e.allowedTracingUrls.find((f) => Qo([f.match], t.url, !0));
  if (!a)
    return;
  const c = Cp(i.id, e.traceSampleRate);
  (c || e.traceContextInjection === Ta.ALL) && (t.traceSampled = c, t.traceId = OT(), t.spanId = Ap(), o(PT(t.traceId, t.spanId, t.traceSampled, i.id, a.propagatorTypes, r, s, e)));
}
function PT(e, t, n, r, s, o, i, a) {
  const c = {};
  if (s.forEach((u) => {
    switch (u) {
      case "datadog": {
        Object.assign(c, {
          "x-datadog-origin": "rum",
          "x-datadog-parent-id": t.toString(),
          "x-datadog-sampling-priority": n ? "1" : "0",
          "x-datadog-trace-id": e.toString()
        });
        break;
      }
      // https://www.w3.org/TR/trace-context/
      case "tracecontext": {
        Object.assign(c, {
          traceparent: `00-0000000000000000${nr(e)}-${nr(t)}-0${n ? "1" : "0"}`,
          tracestate: `dd=s:${n ? "1" : "0"};o:rum`
        });
        break;
      }
      // https://github.com/openzipkin/b3-propagation
      case "b3": {
        Object.assign(c, {
          b3: `${nr(e)}-${nr(t)}-${n ? "1" : "0"}`
        });
        break;
      }
      case "b3multi": {
        Object.assign(c, {
          "X-B3-TraceId": nr(e),
          "X-B3-SpanId": nr(t),
          "X-B3-Sampled": n ? "1" : "0"
        });
        break;
      }
    }
  }), a.propagateTraceBaggage) {
    const u = {
      "session.id": r
    }, f = o.getContext().id;
    typeof f == "string" && (u["user.id"] = f);
    const l = i.getContext().id;
    typeof l == "string" && (u["account.id"] = l);
    const d = Object.entries(u).map(([p, h]) => `${p}=${encodeURIComponent(h)}`).join(",");
    d && (c.baggage = d);
  }
  return c;
}
const xp = ["tracecontext", "datadog"];
function DT(e, t) {
  var n, r, s, o, i, a, c;
  if (e.trackFeatureFlagsForEvents !== void 0 && !Array.isArray(e.trackFeatureFlagsForEvents) && W.warn("trackFeatureFlagsForEvents should be an array"), !e.applicationId) {
    W.error("Application ID is not configured, no RUM data will be collected.");
    return;
  }
  if (!hr(e.sessionReplaySampleRate, "Session Replay") || !hr(e.traceSampleRate, "Trace"))
    return;
  if (e.excludedActivityUrls !== void 0 && !Array.isArray(e.excludedActivityUrls)) {
    W.error("Excluded Activity Urls should be an array");
    return;
  }
  const u = UT(e);
  if (!u)
    return;
  const f = Qf(e, t), l = $T(e);
  if (!f)
    return;
  const d = (n = e.sessionReplaySampleRate) !== null && n !== void 0 ? n : 0;
  return {
    applicationId: e.applicationId,
    actionNameAttribute: e.actionNameAttribute,
    sessionReplaySampleRate: d,
    startSessionReplayRecordingManually: e.startSessionReplayRecordingManually !== void 0 ? !!e.startSessionReplayRecordingManually : d === 0,
    traceSampleRate: (r = e.traceSampleRate) !== null && r !== void 0 ? r : 100,
    rulePsr: Ts(e.traceSampleRate) ? e.traceSampleRate / 100 : void 0,
    allowedTracingUrls: u,
    excludedActivityUrls: (s = e.excludedActivityUrls) !== null && s !== void 0 ? s : [],
    workerUrl: e.workerUrl,
    compressIntakeRequests: !!e.compressIntakeRequests,
    trackUserInteractions: !!(!((o = e.trackUserInteractions) !== null && o !== void 0) || o),
    trackViewsManually: !!e.trackViewsManually,
    trackResources: !!(!((i = e.trackResources) !== null && i !== void 0) || i),
    trackLongTasks: !!(!((a = e.trackLongTasks) !== null && a !== void 0) || a),
    trackBfcacheViews: !!e.trackBfcacheViews,
    trackEarlyRequests: !!e.trackEarlyRequests,
    subdomain: e.subdomain,
    defaultPrivacyLevel: vo(pr, e.defaultPrivacyLevel) ? e.defaultPrivacyLevel : pr.MASK,
    enablePrivacyForActionName: !!e.enablePrivacyForActionName,
    traceContextInjection: vo(Ta, e.traceContextInjection) ? e.traceContextInjection : Ta.SAMPLED,
    plugins: e.plugins || [],
    trackFeatureFlagsForEvents: e.trackFeatureFlagsForEvents || [],
    profilingSampleRate: (c = e.profilingSampleRate) !== null && c !== void 0 ? c : 0,
    propagateTraceBaggage: !!e.propagateTraceBaggage,
    allowedGraphQlUrls: l,
    ...f
  };
}
function UT(e) {
  if (e.allowedTracingUrls === void 0)
    return [];
  if (!Array.isArray(e.allowedTracingUrls)) {
    W.error("Allowed Tracing URLs should be an array");
    return;
  }
  if (e.allowedTracingUrls.length !== 0 && e.service === void 0) {
    W.error("Service needs to be configured when tracing is enabled");
    return;
  }
  const t = [];
  return e.allowedTracingUrls.forEach((n) => {
    hs(n) ? t.push({ match: n, propagatorTypes: xp }) : LT(n) ? t.push(n) : W.warn("Allowed Tracing Urls parameters should be a string, RegExp, function, or an object. Ignoring parameter", n);
  }), t;
}
function FT(e) {
  const t = /* @__PURE__ */ new Set();
  return ss(e.allowedTracingUrls) && e.allowedTracingUrls.forEach((n) => {
    hs(n) ? xp.forEach((r) => t.add(r)) : Jn(n) === "object" && Array.isArray(n.propagatorTypes) && n.propagatorTypes.forEach((r) => t.add(r));
  }), Array.from(t);
}
function $T(e) {
  if (!e.allowedGraphQlUrls)
    return [];
  if (!Array.isArray(e.allowedGraphQlUrls))
    return W.warn("allowedGraphQlUrls should be an array"), [];
  const t = [];
  return e.allowedGraphQlUrls.forEach((n) => {
    hs(n) ? t.push({ match: n, trackPayload: !1 }) : n && typeof n == "object" && "match" in n && hs(n.match) && t.push({
      match: n.match,
      trackPayload: !!n.trackPayload
    });
  }), t;
}
function BT(e) {
  return ss(e) && e.some((t) => typeof t == "object" && "trackPayload" in t ? !!t.trackPayload : !1);
}
function VT(e) {
  var t;
  const n = ep(e);
  return {
    session_replay_sample_rate: e.sessionReplaySampleRate,
    start_session_replay_recording_manually: e.startSessionReplayRecordingManually,
    trace_sample_rate: e.traceSampleRate,
    trace_context_injection: e.traceContextInjection,
    propagate_trace_baggage: e.propagateTraceBaggage,
    action_name_attribute: e.actionNameAttribute,
    use_allowed_tracing_urls: ss(e.allowedTracingUrls),
    use_allowed_graph_ql_urls: ss(e.allowedGraphQlUrls),
    use_track_graph_ql_payload: BT(e.allowedGraphQlUrls),
    selected_tracing_propagators: FT(e),
    default_privacy_level: e.defaultPrivacyLevel,
    enable_privacy_for_action_name: e.enablePrivacyForActionName,
    use_excluded_activity_urls: ss(e.excludedActivityUrls),
    use_worker_url: !!e.workerUrl,
    compress_intake_requests: e.compressIntakeRequests,
    track_views_manually: e.trackViewsManually,
    track_user_interactions: e.trackUserInteractions,
    track_resources: e.trackResources,
    track_long_task: e.trackLongTasks,
    track_bfcache_views: e.trackBfcacheViews,
    track_early_requests: e.trackEarlyRequests,
    plugins: (t = e.plugins) === null || t === void 0 ? void 0 : t.map((r) => {
      var s;
      return {
        name: r.name,
        ...(s = r.getConfigurationTelemetry) === null || s === void 0 ? void 0 : s.call(r)
      };
    }),
    track_feature_flags_for_events: e.trackFeatureFlagsForEvents,
    remote_configuration_id: e.remoteConfigurationId,
    profiling_sample_rate: e.profilingSampleRate,
    use_remote_configuration_proxy: !!e.remoteConfigurationProxy,
    ...n
  };
}
function WT(e) {
  const t = [];
  let n = 0, r;
  const s = { quote: void 0, escapeSequence: void 0 };
  let o = "";
  for (const i of e) {
    if (r = sl[n].find((a) => qT[a](i, s)), !r)
      return [];
    if (s.escapeSequence !== void 0 && r !== 12) {
      if (!JT(s.escapeSequence))
        return [];
      o += QT(s.escapeSequence), s.escapeSequence = void 0;
    }
    XT.includes(r) ? o += i : YT.includes(r) && o !== "" ? (t.push(o), o = "") : r === 12 ? s.escapeSequence = s.escapeSequence ? `${s.escapeSequence}${i}` : i : r === 8 ? s.quote = i : r === 9 && (s.quote = void 0), n = r;
  }
  return sl[n].includes(
    1
    /* Token.END */
  ) ? (o !== "" && t.push(o), t) : [];
}
const HT = /[a-zA-Z_$]/, GT = /[a-zA-Z0-9_$]/, zT = /[0-9]/, KT = /[a-fA-F0-9]/, jT = `'"`, qT = {
  // no char should match to START or END
  0: () => !1,
  1: () => !1,
  2: (e) => HT.test(e),
  3: (e) => GT.test(e),
  4: (e) => e === ".",
  5: (e) => e === "[",
  6: (e) => e === "]",
  7: (e) => zT.test(e),
  8: (e) => jT.includes(e),
  9: (e, t) => e === t.quote,
  10: () => !0,
  // any char can be used in name selector
  11: (e) => e === "\\",
  12: (e, t) => t.escapeSequence === void 0 ? `${t.quote}/\\bfnrtu`.includes(e) : t.escapeSequence.startsWith("u") && t.escapeSequence.length < 5 ? KT.test(e) : !1
}, sl = {
  0: [
    2,
    5
    /* Token.BRACKET_START */
  ],
  1: [],
  2: [
    3,
    4,
    5,
    1
    /* Token.END */
  ],
  3: [
    3,
    4,
    5,
    1
    /* Token.END */
  ],
  4: [
    2
    /* Token.NAME_SHORTHAND_FIRST_CHAR */
  ],
  5: [
    8,
    7
    /* Token.DIGIT */
  ],
  6: [
    4,
    5,
    1
    /* Token.END */
  ],
  7: [
    7,
    6
    /* Token.BRACKET_END */
  ],
  8: [
    11,
    9,
    10
    /* Token.NAME_SELECTOR_CHAR */
  ],
  9: [
    6
    /* Token.BRACKET_END */
  ],
  10: [
    11,
    9,
    10
    /* Token.NAME_SELECTOR_CHAR */
  ],
  11: [
    12
    /* Token.ESCAPE_SEQUENCE_CHAR */
  ],
  12: [
    12,
    11,
    9,
    10
    /* Token.NAME_SELECTOR_CHAR */
  ]
}, XT = [
  2,
  3,
  7,
  10
], YT = [
  4,
  5,
  6
  /* Token.BRACKET_END */
];
function JT(e) {
  return `"'/\\bfnrt`.includes(e) || e.startsWith("u") && e.length === 5;
}
const ZT = {
  '"': '"',
  "'": "'",
  "/": "/",
  "\\": "\\",
  b: "\b",
  f: "\f",
  n: `
`,
  r: "\r",
  t: "	"
};
function QT(e) {
  return e.startsWith("u") ? String.fromCharCode(parseInt(e.slice(1), 16)) : ZT[e];
}
const ev = "v1", tv = [
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
  "allowedTrackingOrigins"
];
async function nv(e, t) {
  let n;
  const r = sv(), s = await cv(e);
  return s.ok ? (r.increment("fetch", "success"), n = rv(e, s.value, t, r)) : (r.increment("fetch", "failure"), W.error(s.error)), As("remote configuration metrics", { metrics: r.get() }), n;
}
function rv(e, t, n, r) {
  const s = { ...e };
  return tv.forEach((d) => {
    d in t && (s[d] = o(t[d]));
  }), Object.keys(n).forEach((d) => {
    t[d] !== void 0 && i(n[d], t[d]);
  }), s;
  function o(d) {
    if (Array.isArray(d))
      return d.map(o);
    if (ov(d)) {
      if (iv(d)) {
        const p = d.rcSerializedType;
        switch (p) {
          case "string":
            return d.value;
          case "regex":
            return Op(d.value);
          case "dynamic":
            return a(d);
          default:
            W.error(`Unsupported remote configuration: "rcSerializedType": "${p}"`);
            return;
        }
      }
      return cf(d, o);
    }
    return d;
  }
  function i(d, p) {
    p.forEach(({ key: h, value: m }) => {
      d.setContextProperty(h, o(m));
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
        W.error(`Unsupported remote configuration: "strategy": "${p}"`);
        return;
    }
    const m = d.extractor;
    return m !== void 0 && typeof h == "string" ? av(m, h) : h;
  }
  function c({ name: d }) {
    const p = Zo(d);
    return r.increment("cookie", p !== void 0 ? "success" : "missing"), p;
  }
  function u({ selector: d, attribute: p }) {
    let h;
    try {
      h = document.querySelector(d);
    } catch {
      W.error(`Invalid selector in the remote configuration: '${d}'`), r.increment("dom", "failure");
      return;
    }
    if (!h) {
      r.increment("dom", "missing");
      return;
    }
    if (f(h, p)) {
      W.error(`Forbidden element selected by the remote configuration: '${d}'`), r.increment("dom", "failure");
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
    const h = WT(d);
    if (h.length === 0) {
      W.error(`Invalid JSON path in the remote configuration: '${d}'`), r.increment("js", "failure");
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
        W.error(`Error accessing: '${d}'`, g), r.increment("js", "failure");
        return;
      }
    }
    return r.increment("js", "success"), p;
  }
}
function sv() {
  const e = { fetch: {} };
  return {
    get: () => e,
    increment: (t, n) => {
      e[t] || (e[t] = {}), e[t][n] || (e[t][n] = 0), e[t][n] = e[t][n] + 1;
    }
  };
}
function ov(e) {
  return typeof e == "object" && e !== null;
}
function iv(e) {
  return "rcSerializedType" in e;
}
function Op(e) {
  try {
    return new RegExp(e);
  } catch {
    W.error(`Invalid regex in the remote configuration: '${e}'`);
  }
}
function av(e, t) {
  const n = Op(e.value);
  if (n === void 0)
    return;
  const r = n.exec(t);
  if (r === null)
    return;
  const [s, o] = r;
  return o || s;
}
async function cv(e) {
  let t;
  try {
    t = await fetch(uv(e));
  } catch {
    t = void 0;
  }
  if (!t || !t.ok)
    return {
      ok: !1,
      error: new Error("Error fetching the remote configuration.")
    };
  const n = await t.json();
  return n.rum ? {
    ok: !0,
    value: n.rum
  } : {
    ok: !1,
    error: new Error("No remote configuration for RUM.")
  };
}
function uv(e) {
  return e.remoteConfigurationProxy ? e.remoteConfigurationProxy : `https://sdk-configuration.${Jf("rum", e)}/${ev}/${encodeURIComponent(e.remoteConfigurationId)}.json`;
}
function lv({ ignoreInitIfSyntheticsWillInjectRum: e = !0, startDeflateWorker: t }, n, r, s) {
  const o = gp(), i = Oc();
  Vi(i, Q.globalContext, o);
  const a = Lc();
  Vi(a, Q.userContext, o);
  const c = xc();
  Vi(c, Q.accountContext, o);
  let u, f, l, d;
  const p = n.observable.subscribe(m), h = {};
  function m() {
    if (!l || !d || !n.isGranted())
      return;
    p.unsubscribe();
    let E;
    if (d.trackViewsManually) {
      if (!u)
        return;
      o.remove(u.callback), E = u.options;
    }
    const S = s(d, f, E);
    o.drain(S);
  }
  function g(E, S) {
    const w = xt();
    if (w && (E = dv(E)), l = E, Yf(VT(E)), d) {
      oi("DD_RUM", E);
      return;
    }
    const T = DT(E, S);
    if (T) {
      if (!w && !T.sessionStoreStrategyType) {
        W.warn("No storage available for session. We will not send any data.");
        return;
      }
      T.compressIntakeRequests && !w && t && (f = t(
        T,
        "Datadog RUM",
        // Worker initialization can fail asynchronously, especially in Firefox where even CSP
        // issues are reported asynchronously. For now, the SDK will continue its execution even if
        // data won't be sent to Datadog. We could improve this behavior in the future.
        Y
      ), !f) || (d = T, ai().subscribe(Y), n.tryToInit(T.trackingConsent), m());
    }
  }
  const _ = (E) => {
    o.add((S) => S.addDurationVital(E));
  };
  return {
    init(E, S, w) {
      if (!E) {
        W.error("Missing configuration");
        return;
      }
      Lf(E.enableExperimentalFeatures), l = E, !(e && ii()) && (kp(E.plugins, "onInit", { initConfiguration: E, publicApi: S }), E.remoteConfigurationId ? nv(E, { user: a, context: i }).then((T) => {
        T && g(T, w);
      }).catch(dt) : g(E, w));
    },
    get initConfiguration() {
      return l;
    },
    getInternalContext: Y,
    stopSession: Y,
    addTiming(E, S = oe()) {
      o.add((w) => w.addTiming(E, S));
    },
    startView(E, S = Ee()) {
      const w = (T) => {
        T.startView(E, S);
      };
      o.add(w), u || (u = { options: E, callback: w }, m());
    },
    setViewName(E) {
      o.add((S) => S.setViewName(E));
    },
    // View context APIs
    setViewContext(E) {
      o.add((S) => S.setViewContext(E));
    },
    setViewContextProperty(E, S) {
      o.add((w) => w.setViewContextProperty(E, S));
    },
    getViewContext: () => h,
    globalContext: i,
    userContext: a,
    accountContext: c,
    addAction(E) {
      o.add((S) => S.addAction(E));
    },
    addError(E) {
      o.add((S) => S.addError(E));
    },
    addFeatureFlagEvaluation(E, S) {
      o.add((w) => w.addFeatureFlagEvaluation(E, S));
    },
    startDurationVital(E, S) {
      return vp(r, E, S);
    },
    stopDurationVital(E, S) {
      Ip(_, r, E, S);
    },
    addDurationVital: _,
    addOperationStepVital: (E, S, w, T) => {
      o.add((N) => N.addOperationStepVital(de(E), S, de(w), de(T)));
    }
  };
}
function dv(e) {
  var t, n;
  return {
    ...e,
    applicationId: "00000000-aaaa-0000-aaaa-000000000000",
    clientToken: "empty",
    sessionSampleRate: 100,
    defaultPrivacyLevel: (t = e.defaultPrivacyLevel) !== null && t !== void 0 ? t : (n = Qn()) === null || n === void 0 ? void 0 : n.getPrivacyLevel()
  };
}
function Vi(e, t, n) {
  e.changeObservable.subscribe(() => {
    const r = e.getContext();
    n.add((s) => s[t].setContext(r));
  });
}
function fv(e, t, n, r = {}) {
  const s = kf(), o = CT(), i = Ep().observable;
  let a = lv(r, s, o, (l, d, p) => {
    const h = e(l, t, n, p, d && r.createDeflateEncoder ? (m) => r.createDeflateEncoder(l, d, m) : kc, s, o, i, r.sdkName);
    return t.onRumStart(h.lifeCycle, l, h.session, h.viewHistory, d, h.telemetry), n.onRumStart(h.lifeCycle, h.hooks, l, h.session, h.viewHistory), a = pv(a, h), kp(l.plugins, "onRumStart", {
      strategy: a,
      // TODO: remove this in the next major release
      addEvent: h.addEvent
    }), h;
  });
  const c = () => a, u = D((l) => {
    const d = typeof l == "object" ? l : { name: l };
    a.startView(d), Ce({ feature: "start-view" });
  }), f = tp({
    init: (l) => {
      const d = new Error().stack;
      Bt(() => a.init(l, f, d));
    },
    setTrackingConsent: D((l) => {
      s.update(l), Ce({ feature: "set-tracking-consent", tracking_consent: l });
    }),
    setViewName: D((l) => {
      a.setViewName(l), Ce({ feature: "set-view-name" });
    }),
    setViewContext: D((l) => {
      a.setViewContext(l), Ce({ feature: "set-view-context" });
    }),
    setViewContextProperty: D((l, d) => {
      a.setViewContextProperty(l, d), Ce({ feature: "set-view-context-property" });
    }),
    getViewContext: D(() => (Ce({ feature: "set-view-context-property" }), a.getViewContext())),
    getInternalContext: D((l) => a.getInternalContext(l)),
    getInitConfiguration: D(() => ri(a.initConfiguration)),
    addAction: (l, d) => {
      const p = Ar("action");
      Bt(() => {
        a.addAction({
          name: de(l),
          context: de(d),
          startClocks: Ee(),
          type: ui.CUSTOM,
          handlingStack: p
        }), Ce({ feature: "add-action" });
      });
    },
    addError: (l, d) => {
      const p = Ar("error");
      Bt(() => {
        a.addError({
          error: l,
          // Do not sanitize error here, it is needed unserialized by computeRawError()
          handlingStack: p,
          context: de(d),
          startClocks: Ee()
        }), Ce({ feature: "add-error" });
      });
    },
    addTiming: D((l, d) => {
      a.addTiming(de(l), d);
    }),
    setGlobalContext: ae(c, Q.globalContext, ce.setContext, "set-global-context"),
    getGlobalContext: ae(c, Q.globalContext, ce.getContext, "get-global-context"),
    setGlobalContextProperty: ae(c, Q.globalContext, ce.setContextProperty, "set-global-context-property"),
    removeGlobalContextProperty: ae(c, Q.globalContext, ce.removeContextProperty, "remove-global-context-property"),
    clearGlobalContext: ae(c, Q.globalContext, ce.clearContext, "clear-global-context"),
    setUser: ae(c, Q.userContext, ce.setContext, "set-user"),
    getUser: ae(c, Q.userContext, ce.getContext, "get-user"),
    setUserProperty: ae(c, Q.userContext, ce.setContextProperty, "set-user-property"),
    removeUserProperty: ae(c, Q.userContext, ce.removeContextProperty, "remove-user-property"),
    clearUser: ae(c, Q.userContext, ce.clearContext, "clear-user"),
    setAccount: ae(c, Q.accountContext, ce.setContext, "set-account"),
    getAccount: ae(c, Q.accountContext, ce.getContext, "get-account"),
    setAccountProperty: ae(c, Q.accountContext, ce.setContextProperty, "set-account-property"),
    removeAccountProperty: ae(c, Q.accountContext, ce.removeContextProperty, "remove-account-property"),
    clearAccount: ae(c, Q.accountContext, ce.clearContext, "clear-account"),
    startView: u,
    stopSession: D(() => {
      a.stopSession(), Ce({ feature: "stop-session" });
    }),
    addFeatureFlagEvaluation: D((l, d) => {
      a.addFeatureFlagEvaluation(de(l), de(d)), Ce({ feature: "add-feature-flag-evaluation" });
    }),
    getSessionReplayLink: D(() => t.getSessionReplayLink()),
    startSessionReplayRecording: D((l) => {
      t.start(l), Ce({ feature: "start-session-replay-recording", force: l && l.force });
    }),
    stopSessionReplayRecording: D(() => t.stop()),
    addDurationVital: D((l, d) => {
      Ce({ feature: "add-duration-vital" }), a.addDurationVital({
        name: de(l),
        type: gs.DURATION,
        startClocks: Qb(d.startTime),
        duration: d.duration,
        context: de(d && d.context),
        description: de(d && d.description)
      });
    }),
    startDurationVital: D((l, d) => (Ce({ feature: "start-duration-vital" }), a.startDurationVital(de(l), {
      context: de(d && d.context),
      description: de(d && d.description)
    }))),
    stopDurationVital: D((l, d) => {
      Ce({ feature: "stop-duration-vital" }), a.stopDurationVital(typeof l == "string" ? de(l) : l, {
        context: de(d && d.context),
        description: de(d && d.description)
      });
    }),
    startFeatureOperation: D((l, d) => {
      Ce({ feature: "add-operation-step-vital", action_type: "start" }), a.addOperationStepVital(l, "start", d);
    }),
    succeedFeatureOperation: D((l, d) => {
      Ce({ feature: "add-operation-step-vital", action_type: "succeed" }), a.addOperationStepVital(l, "end", d);
    }),
    failFeatureOperation: D((l, d, p) => {
      Ce({ feature: "add-operation-step-vital", action_type: "fail" }), a.addOperationStepVital(l, "end", p, d);
    })
  });
  return f;
}
function pv(e, t) {
  return {
    init: (n) => {
      oi("DD_RUM", n);
    },
    initConfiguration: e.initConfiguration,
    ...t
  };
}
function hv() {
  const e = Lp();
  return new Z((t) => {
    if (!e)
      return;
    const n = new e(D((r) => t.notify(r)));
    return n.observe(document, {
      attributes: !0,
      characterData: !0,
      childList: !0,
      subtree: !0
    }), () => n.disconnect();
  });
}
function Lp() {
  let e;
  const t = window;
  if (t.Zone && (e = ln(t, "MutationObserver"), t.MutationObserver && e === t.MutationObserver)) {
    const n = new t.MutationObserver(Y), r = ln(n, "originalInstance");
    e = r && r.constructor;
  }
  return e || (e = t.MutationObserver), e;
}
function mv() {
  const e = new Z(), { stop: t } = je(window, "open", () => e.notify());
  return { observable: e, stop: t };
}
function gv(e, t, n, r, s) {
  return {
    get: (o) => {
      const i = n.findView(o), a = s.findUrl(o), c = t.findTrackedSession(o);
      if (c && i && a) {
        const u = r.findActionId(o);
        return {
          application_id: e,
          session_id: c.id,
          user_action: u ? { id: u } : void 0,
          view: { id: i.id, name: i.name, referrer: a.referrer, url: a.url }
        };
      }
    }
  };
}
const yv = fp, _v = Yn;
function bv(e) {
  const t = Ur({ expireDelay: _v });
  e.subscribe(1, (r) => {
    t.add(n(r), r.startClocks.relative);
  }), e.subscribe(6, ({ endClocks: r }) => {
    t.closeActive(r.relative);
  }), e.subscribe(3, (r) => {
    const s = t.find(r.startClocks.relative);
    s && (r.name && (s.name = r.name), r.context && (s.context = r.context), s.sessionIsActive = r.sessionIsActive);
  }), e.subscribe(10, () => {
    t.reset();
  });
  function n(r) {
    return {
      service: r.service,
      version: r.version,
      context: r.context,
      id: r.id,
      name: r.name,
      startClocks: r.startClocks
    };
  }
  return {
    findView: (r) => t.find(r),
    stop: () => {
      t.stop();
    }
  };
}
const Np = "initial_document", wv = [
  [Fe.DOCUMENT, (e) => Np === e],
  [Fe.XHR, (e) => e === "xmlhttprequest"],
  [Fe.FETCH, (e) => e === "fetch"],
  [Fe.BEACON, (e) => e === "beacon"],
  [Fe.CSS, (e, t) => /\.css$/i.test(t)],
  [Fe.JS, (e, t) => /\.js$/i.test(t)],
  [
    Fe.IMAGE,
    (e, t) => ["image", "img", "icon"].includes(e) || /\.(gif|jpg|jpeg|tiff|png|svg|ico)$/i.exec(t) !== null
  ],
  [Fe.FONT, (e, t) => /\.(woff|eot|woff2|ttf)$/i.exec(t) !== null],
  [
    Fe.MEDIA,
    (e, t) => ["audio", "video"].includes(e) || /\.(mp3|mp4)$/i.exec(t) !== null
  ]
];
function Ev(e) {
  const t = e.name;
  if (!fw(t))
    return Fe.OTHER;
  const n = pw(t);
  for (const [r, s] of wv)
    if (s(e.initiatorType, n))
      return r;
  return Fe.OTHER;
}
function ol(...e) {
  for (let t = 1; t < e.length; t += 1)
    if (e[t - 1] > e[t])
      return !1;
  return !0;
}
function Mp(e) {
  return e.initiatorType === "xmlhttprequest" || e.initiatorType === "fetch";
}
function Sv(e) {
  const { duration: t, startTime: n, responseEnd: r } = e;
  return t === 0 && n < r ? _e(n, r) : t;
}
function Tv(e) {
  if (!Dp(e))
    return;
  const { startTime: t, fetchStart: n, workerStart: r, redirectStart: s, redirectEnd: o, domainLookupStart: i, domainLookupEnd: a, connectStart: c, secureConnectionStart: u, connectEnd: f, requestStart: l, responseStart: d, responseEnd: p } = e, h = {
    download: mn(t, d, p),
    first_byte: mn(t, l, d)
  };
  return 0 < r && r < n && (h.worker = mn(t, r, n)), n < f && (h.connect = mn(t, c, f), c <= u && u <= f && (h.ssl = mn(t, u, f))), n < a && (h.dns = mn(t, i, a)), t < o && (h.redirect = mn(t, s, o)), h;
}
function Pp(e) {
  return e.duration >= 0;
}
function Dp(e) {
  const t = ol(e.startTime, e.fetchStart, e.domainLookupStart, e.domainLookupEnd, e.connectStart, e.connectEnd, e.requestStart, e.responseStart, e.responseEnd), n = vv(e) ? ol(e.startTime, e.redirectStart, e.redirectEnd, e.fetchStart) : !0;
  return t && n;
}
function vv(e) {
  return e.redirectEnd > e.startTime;
}
function mn(e, t, n) {
  if (e <= t && t <= n)
    return {
      duration: q(_e(t, n)),
      start: q(_e(e, t))
    };
}
function Iv(e) {
  return e.nextHopProtocol === "" ? void 0 : e.nextHopProtocol;
}
function kv(e) {
  return e.deliveryType === "" ? "other" : e.deliveryType;
}
function Cv(e) {
  if (e.startTime < e.responseStart) {
    const { encodedBodySize: t, decodedBodySize: n, transferSize: r } = e;
    return {
      size: n,
      encoded_body_size: t,
      decoded_body_size: n,
      transfer_size: r
    };
  }
  return {
    size: void 0,
    encoded_body_size: void 0,
    decoded_body_size: void 0,
    transfer_size: void 0
  };
}
function Mc(e) {
  return e && (!Zf(e) || Pr(Wt.TRACK_INTAKE_REQUESTS));
}
const Av = /data:(.+)?(;base64)?,/g, Rv = 24e3;
function Up(e, t = Rv) {
  if (e.length <= t || !e.startsWith("data:"))
    return e;
  const n = e.substring(0, 100).match(Av);
  return n ? `${n[0]}[...]` : e;
}
let il = 1;
function xv(e, t, n, r, s) {
  const o = MT(t, n, r, s);
  Ov(e, t, o), Lv(e, o);
}
function Ov(e, t, n) {
  const r = pp(t).subscribe((s) => {
    const o = s;
    if (Mc(o.url))
      switch (o.state) {
        case "start":
          n.traceXhr(o, o.xhr), o.requestIndex = Fp(), e.notify(7, {
            requestIndex: o.requestIndex,
            url: o.url
          });
          break;
        case "complete":
          n.clearTracingIfNeeded(o), e.notify(8, {
            duration: o.duration,
            method: o.method,
            requestIndex: o.requestIndex,
            spanId: o.spanId,
            startClocks: o.startClocks,
            status: o.status,
            traceId: o.traceId,
            traceSampled: o.traceSampled,
            type: Vn.XHR,
            url: o.url,
            xhr: o.xhr,
            isAborted: o.isAborted,
            handlingStack: o.handlingStack,
            body: o.body
          });
          break;
      }
  });
  return { stop: () => r.unsubscribe() };
}
function Lv(e, t) {
  const n = ai().subscribe((r) => {
    const s = r;
    if (Mc(s.url))
      switch (s.state) {
        case "start":
          t.traceFetch(s), s.requestIndex = Fp(), e.notify(7, {
            requestIndex: s.requestIndex,
            url: s.url
          });
          break;
        case "resolve":
          Nv(s, (o) => {
            var i;
            t.clearTracingIfNeeded(s), e.notify(8, {
              duration: o,
              method: s.method,
              requestIndex: s.requestIndex,
              responseType: s.responseType,
              spanId: s.spanId,
              startClocks: s.startClocks,
              status: s.status,
              traceId: s.traceId,
              traceSampled: s.traceSampled,
              type: Vn.FETCH,
              url: s.url,
              response: s.response,
              init: s.init,
              input: s.input,
              isAborted: s.isAborted,
              handlingStack: s.handlingStack,
              body: (i = s.init) === null || i === void 0 ? void 0 : i.body
            });
          });
          break;
      }
  });
  return { stop: () => n.unsubscribe() };
}
function Fp() {
  const e = il;
  return il += 1, e;
}
function Nv(e, t) {
  const n = e.response && Uf(e.response);
  !n || !n.body ? t(_e(e.startClocks.timeStamp, oe())) : wp(n.body, () => {
    t(_e(e.startClocks.timeStamp, oe()));
  }, {
    bytesLimit: Number.POSITIVE_INFINITY,
    collectStreamBody: !1
  });
}
function $p(e) {
  return Ts(e) && e < 0 ? void 0 : e;
}
function Bp({ lifeCycle: e, isChildEvent: t, onChange: n = Y }) {
  const r = {
    errorCount: 0,
    longTaskCount: 0,
    resourceCount: 0,
    actionCount: 0,
    frustrationCount: 0
  }, s = e.subscribe(13, (o) => {
    var i;
    if (!(o.type === "view" || o.type === "vital" || !t(o)))
      switch (o.type) {
        case z.ERROR:
          r.errorCount += 1, n();
          break;
        case z.ACTION:
          r.actionCount += 1, o.action.frustration && (r.frustrationCount += o.action.frustration.type.length), n();
          break;
        case z.LONG_TASK:
          r.longTaskCount += 1, n();
          break;
        case z.RESOURCE:
          !((i = o._dd) === null || i === void 0) && i.discarded || (r.resourceCount += 1, n());
          break;
      }
  });
  return {
    stop: () => {
      s.unsubscribe();
    },
    eventCounts: r
  };
}
function Mv(e, t) {
  const n = We();
  let r = !1;
  const { stop: s } = qe(e, window, [
    "click",
    "mousedown",
    "keydown",
    "touchstart",
    "pointerdown"
    /* DOM_EVENT.POINTER_DOWN */
  ], (a) => {
    if (!a.cancelable)
      return;
    const c = {
      entryType: "first-input",
      processingStart: Ze(),
      processingEnd: Ze(),
      startTime: a.timeStamp,
      duration: 0,
      // arbitrary value to avoid nullable duration and simplify INP logic
      name: "",
      cancelable: !1,
      target: null,
      toJSON: () => ({})
    };
    a.type === "pointerdown" ? o(e, c) : i(c);
  }, { passive: !0, capture: !0 });
  return { stop: s };
  function o(a, c) {
    qe(a, window, [
      "pointerup",
      "pointercancel"
      /* DOM_EVENT.POINTER_CANCEL */
    ], (u) => {
      u.type === "pointerup" && i(c);
    }, { once: !0 });
  }
  function i(a) {
    if (!r) {
      r = !0, s();
      const c = a.processingStart - a.startTime;
      c >= 0 && c < We() - n && t(a);
    }
  }
}
var te;
(function(e) {
  e.EVENT = "event", e.FIRST_INPUT = "first-input", e.LARGEST_CONTENTFUL_PAINT = "largest-contentful-paint", e.LAYOUT_SHIFT = "layout-shift", e.LONG_TASK = "longtask", e.LONG_ANIMATION_FRAME = "long-animation-frame", e.NAVIGATION = "navigation", e.PAINT = "paint", e.RESOURCE = "resource", e.VISIBILITY_STATE = "visibility-state";
})(te || (te = {}));
function Ot(e, t) {
  return new Z((n) => {
    if (!window.PerformanceObserver)
      return;
    const r = (c) => {
      const u = Uv(c);
      u.length > 0 && n.notify(u);
    };
    let s, o = !0;
    const i = new PerformanceObserver(D((c) => {
      o ? s = Re(() => r(c.getEntries())) : r(c.getEntries());
    }));
    try {
      i.observe(t);
    } catch {
      if ([
        te.RESOURCE,
        te.NAVIGATION,
        te.LONG_TASK,
        te.PAINT
      ].includes(t.type)) {
        t.buffered && (s = Re(() => r(performance.getEntriesByType(t.type))));
        try {
          i.observe({ entryTypes: [t.type] });
        } catch {
          return;
        }
      }
    }
    o = !1, Pv(e);
    let a;
    return !hn(te.FIRST_INPUT) && t.type === te.FIRST_INPUT && ({ stop: a } = Mv(e, (c) => {
      r([c]);
    })), () => {
      i.disconnect(), a && a(), ze(s);
    };
  });
}
let zr;
function Pv(e) {
  return !zr && Dv() && "addEventListener" in performance && (zr = me(e, performance, "resourcetimingbufferfull", () => {
    performance.clearResourceTimings();
  })), () => {
    zr?.stop();
  };
}
function Dv() {
  return window.performance !== void 0 && "getEntries" in performance;
}
function hn(e) {
  return window.PerformanceObserver && PerformanceObserver.supportedEntryTypes !== void 0 && PerformanceObserver.supportedEntryTypes.includes(e);
}
function Uv(e) {
  return e.filter((t) => !Fv(t));
}
function Fv(e) {
  return e.entryType === te.RESOURCE && (!Mc(e.name) || !Pp(e));
}
function va(e) {
  return e.nodeType === Node.TEXT_NODE;
}
function $v(e) {
  return e.nodeType === Node.COMMENT_NODE;
}
function Ht(e) {
  return e.nodeType === Node.ELEMENT_NODE;
}
function li(e) {
  return Ht(e) && !!e.shadowRoot;
}
function Pc(e) {
  const t = e;
  return !!t.host && t.nodeType === Node.DOCUMENT_FRAGMENT_NODE && Ht(t.host);
}
function Bv(e) {
  return e.childNodes.length > 0 || li(e);
}
function Vp(e, t) {
  let n = e.firstChild;
  for (; n; )
    t(n), n = n.nextSibling;
  li(e) && t(e.shadowRoot);
}
function di(e) {
  return Pc(e) ? e.host : e.parentNode;
}
const Wp = 100, Vv = 100, al = "data-dd-excluded-activity-mutations";
function Dc(e, t, n, r, s, o) {
  const i = Hv(e, t, n, r);
  return Wv(i, s, o);
}
function Wv(e, t, n) {
  let r, s = !1;
  const o = Re(D(() => u({ hadActivity: !1 })), Wp), i = n !== void 0 ? Re(D(() => u({ hadActivity: !0, end: oe() })), n) : void 0, a = e.subscribe(({ isBusy: f }) => {
    ze(o), ze(r);
    const l = oe();
    f || (r = Re(D(() => u({ hadActivity: !0, end: l })), Vv));
  }), c = () => {
    s = !0, ze(o), ze(r), ze(i), a.unsubscribe();
  };
  function u(f) {
    s || (c(), t(f));
  }
  return { stop: c };
}
function Hv(e, t, n, r) {
  return new Z((s) => {
    const o = [];
    let i, a = 0;
    return o.push(t.subscribe((u) => {
      u.every(Gv) || c();
    }), n.subscribe(c), Ot(r, { type: te.RESOURCE }).subscribe((u) => {
      u.some((f) => !Wi(r, f.name)) && c();
    }), e.subscribe(7, (u) => {
      Wi(r, u.url) || (i === void 0 && (i = u.requestIndex), a += 1, c());
    }), e.subscribe(8, (u) => {
      Wi(r, u.url) || i === void 0 || // If the request started before the tracking start, ignore it
      u.requestIndex < i || (a -= 1, c());
    })), () => {
      o.forEach((u) => u.unsubscribe());
    };
    function c() {
      s.notify({ isBusy: a > 0 });
    }
  });
}
function Wi(e, t) {
  return Qo(e.excludedActivityUrls, t);
}
function Gv(e) {
  const t = e.type === "characterData" ? e.target.parentElement : e.target;
  return !!(t && Ht(t) && t.matches(`[${al}], [${al}] *`));
}
const fi = "data-dd-action-name", zv = "Masked Element", Hp = [
  fi,
  // Common test attributes (list provided by google recorder)
  "data-testid",
  "data-test",
  "data-qa",
  "data-cy",
  "data-test-id",
  "data-qa-id",
  "data-testing",
  // FullStory decorator attributes:
  "data-component",
  "data-element",
  "data-source-file"
], Kv = [zp, qv], jv = [
  zp,
  Xv,
  Yv
];
function xs(e, t) {
  if (!e.isConnected)
    return;
  let n, r = e;
  for (; r && r.nodeName !== "HTML"; ) {
    const s = cl(r, Kv, Zv, t, n);
    if (s)
      return s;
    n = cl(r, jv, Qv, t, n) || pi(Jv(r), n), r = r.parentElement;
  }
  return n;
}
function Gp(e) {
  return /[0-9]/.test(e);
}
function qv(e) {
  if (e.id && !Gp(e.id))
    return `#${CSS.escape(e.id)}`;
}
function Xv(e) {
  if (e.tagName === "BODY")
    return;
  const t = e.classList;
  for (let n = 0; n < t.length; n += 1) {
    const r = t[n];
    if (!Gp(r))
      return `${CSS.escape(e.tagName)}.${CSS.escape(r)}`;
  }
}
function Yv(e) {
  return CSS.escape(e.tagName);
}
function zp(e, t) {
  if (t) {
    const r = n(t);
    if (r)
      return r;
  }
  for (const r of Hp) {
    const s = n(r);
    if (s)
      return s;
  }
  function n(r) {
    if (e.hasAttribute(r))
      return `${CSS.escape(e.tagName)}[${r}="${CSS.escape(e.getAttribute(r))}"]`;
  }
}
function Jv(e) {
  let t = e.parentElement.firstElementChild, n = 1;
  for (; t && t !== e; )
    t.tagName === e.tagName && (n += 1), t = t.nextElementSibling;
  return `${CSS.escape(e.tagName)}:nth-of-type(${n})`;
}
function cl(e, t, n, r, s) {
  for (const o of t) {
    const i = o(e, r);
    if (i && n(e, i, s))
      return pi(i, s);
  }
}
function Zv(e, t, n) {
  return e.ownerDocument.querySelectorAll(pi(t, n)).length === 1;
}
function Qv(e, t, n) {
  let r;
  if (n === void 0)
    r = (i) => i.matches(t);
  else {
    const i = pi(`${t}:scope`, n);
    r = (a) => a.querySelector(i) !== null;
  }
  let o = e.parentElement.firstElementChild;
  for (; o; ) {
    if (o !== e && r(o))
      return !1;
    o = o.nextElementSibling;
  }
  return !0;
}
function pi(e, t) {
  return t ? `${e}>${t}` : e;
}
const U = {
  IGNORE: "ignore",
  HIDDEN: "hidden",
  ALLOW: pr.ALLOW,
  MASK: pr.MASK,
  MASK_USER_INPUT: pr.MASK_USER_INPUT,
  MASK_UNLESS_ALLOWLISTED: pr.MASK_UNLESS_ALLOWLISTED
}, Uc = "data-dd-privacy", eI = "hidden", tI = "dd-privacy-", rn = "***", ul = "data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==", nI = {
  INPUT: !0,
  OUTPUT: !0,
  TEXTAREA: !0,
  SELECT: !0,
  OPTION: !0,
  DATALIST: !0,
  OPTGROUP: !0
}, rI = "x";
function vn(e) {
  return `[${Uc}="${e}"], .${tI}${e}`;
}
function gt(e, t, n) {
  if (n && n.has(e))
    return n.get(e);
  const r = di(e), s = r ? gt(r, t, n) : t, o = jp(e), i = Kp(o, s);
  return n && n.set(e, i), i;
}
function Kp(e, t) {
  switch (t) {
    // These values cannot be overridden
    case U.HIDDEN:
    case U.IGNORE:
      return t;
  }
  switch (e) {
    case U.ALLOW:
    case U.MASK:
    case U.MASK_USER_INPUT:
    case U.MASK_UNLESS_ALLOWLISTED:
    case U.HIDDEN:
    case U.IGNORE:
      return e;
    default:
      return t;
  }
}
function jp(e) {
  if (Ht(e)) {
    if (e.tagName === "BASE")
      return U.ALLOW;
    if (e.tagName === "INPUT") {
      const t = e;
      if (t.type === "password" || t.type === "email" || t.type === "tel" || t.type === "hidden")
        return U.MASK;
      const n = t.getAttribute("autocomplete");
      if (n && (n.startsWith("cc-") || n.endsWith("-password")))
        return U.MASK;
    }
    if (e.matches(vn(U.HIDDEN)))
      return U.HIDDEN;
    if (e.matches(vn(U.MASK)))
      return U.MASK;
    if (e.matches(vn(U.MASK_UNLESS_ALLOWLISTED)))
      return U.MASK_UNLESS_ALLOWLISTED;
    if (e.matches(vn(U.MASK_USER_INPUT)))
      return U.MASK_USER_INPUT;
    if (e.matches(vn(U.ALLOW)))
      return U.ALLOW;
    if (sI(e))
      return U.IGNORE;
  }
}
function Os(e, t) {
  switch (t) {
    case U.MASK:
    case U.HIDDEN:
    case U.IGNORE:
      return !0;
    case U.MASK_UNLESS_ALLOWLISTED:
      return va(e) ? Xs(e.parentNode) ? !0 : !Yp(e.textContent || "") : Xs(e);
    case U.MASK_USER_INPUT:
      return va(e) ? Xs(e.parentNode) : Xs(e);
    default:
      return !1;
  }
}
function Xs(e) {
  if (!e || e.nodeType !== e.ELEMENT_NODE)
    return !1;
  const t = e;
  if (t.tagName === "INPUT")
    switch (t.type) {
      case "button":
      case "color":
      case "reset":
      case "submit":
        return !1;
    }
  return !!nI[t.tagName];
}
const qp = (e) => e.replace(/\S/g, rI);
function Xp(e, t, n) {
  var r;
  const s = (r = e.parentElement) === null || r === void 0 ? void 0 : r.tagName;
  let o = e.textContent || "";
  if (t && !o.trim())
    return;
  const i = n;
  if (s === "SCRIPT")
    o = rn;
  else if (i === U.HIDDEN)
    o = rn;
  else if (Os(e, i))
    if (
      // Scrambling the child list breaks text nodes for DATALIST/SELECT/OPTGROUP
      s === "DATALIST" || s === "SELECT" || s === "OPTGROUP"
    ) {
      if (!o.trim())
        return;
    } else s === "OPTION" ? o = rn : i === U.MASK_UNLESS_ALLOWLISTED ? o = oI(o) : o = qp(o);
  return o;
}
function sI(e) {
  if (e.nodeName === "SCRIPT")
    return !0;
  if (e.nodeName === "LINK") {
    const n = t("rel");
    return (
      // Link as script - Ignore only when rel=preload, modulepreload or prefetch
      /preload|prefetch/i.test(n) && t("as") === "script" || // Favicons
      n === "shortcut icon" || n === "icon"
    );
  }
  if (e.nodeName === "META") {
    const n = t("name"), r = t("rel"), s = t("property");
    return (
      // Favicons
      /^msapplication-tile(image|color)$/.test(n) || n === "application-name" || r === "icon" || r === "apple-touch-icon" || r === "shortcut icon" || // Description
      n === "keywords" || n === "description" || // Social
      /^(og|twitter|fb):/.test(s) || /^(og|twitter):/.test(n) || n === "pinterest" || // Robots
      n === "robots" || n === "googlebot" || n === "bingbot" || // Http headers. Ex: X-UA-Compatible, Content-Type, Content-Language, cache-control,
      // X-Translated-By
      e.hasAttribute("http-equiv") || // Authorship
      n === "author" || n === "generator" || n === "framework" || n === "publisher" || n === "progid" || /^article:/.test(s) || /^product:/.test(s) || // Verification
      n === "google-site-verification" || n === "yandex-verification" || n === "csrf-token" || n === "p:domain_verify" || n === "verify-v1" || n === "verification" || n === "shopify-checkout-api-token"
    );
  }
  function t(n) {
    return (e.getAttribute(n) || "").toLowerCase();
  }
  return !1;
}
function Yp(e) {
  var t;
  return !e || !e.trim() ? !0 : ((t = window.$DD_ALLOW) === null || t === void 0 ? void 0 : t.has(e.toLocaleLowerCase())) || !1;
}
function oI(e, t) {
  return Yp(e) ? e : t || qp(e);
}
const Jp = Oe, iI = 100;
function aI(e, t) {
  const n = [];
  let r = 0, s;
  o(e);
  function o(c) {
    c.stopObservable.subscribe(i), n.push(c), ze(s), s = Re(a, Jp);
  }
  function i() {
    r === 1 && n.every((c) => c.isStopped()) && (r = 2, t(n));
  }
  function a() {
    ze(s), r === 0 && (r = 1, i());
  }
  return {
    tryAppend: (c) => r !== 0 ? !1 : n.length > 0 && !cI(n[n.length - 1].event, c.event) ? (a(), !1) : (o(c), !0),
    stop: () => {
      a();
    }
  };
}
function cI(e, t) {
  return e.target === t.target && uI(e, t) <= iI && e.timeStamp - t.timeStamp <= Jp;
}
function uI(e, t) {
  return Math.sqrt(Math.pow(e.clientX - t.clientX, 2) + Math.pow(e.clientY - t.clientY, 2));
}
function lI(e, t, n = U.ALLOW) {
  const { actionNameAttribute: r } = t, s = ll(e, fi) || r && ll(e, r);
  return s ? {
    name: s,
    nameSource: "custom_attribute"
    /* ActionNameSource.CUSTOM_ATTRIBUTE */
  } : n === U.MASK ? {
    name: zv,
    nameSource: "mask_placeholder"
    /* ActionNameSource.MASK_PLACEHOLDER */
  } : dl(e, dI, t) || dl(e, fI, t) || {
    name: "",
    nameSource: "blank"
  };
}
function ll(e, t) {
  const n = e.closest(`[${t}]`);
  if (!n)
    return;
  const r = n.getAttribute(t);
  return Qp(Zp(r.trim()));
}
const dI = [
  // associated LABEL text
  (e, t) => {
    if ("labels" in e && e.labels && e.labels.length > 0)
      return lo(e.labels[0], t);
  },
  // INPUT button (and associated) value
  (e) => {
    if (e.nodeName === "INPUT") {
      const t = e, n = t.getAttribute("type");
      if (n === "button" || n === "submit" || n === "reset")
        return {
          name: t.value,
          nameSource: "text_content"
          /* ActionNameSource.TEXT_CONTENT */
        };
    }
  },
  // BUTTON, LABEL or button-like element text
  (e, t) => {
    if (e.nodeName === "BUTTON" || e.nodeName === "LABEL" || e.getAttribute("role") === "button")
      return lo(e, t);
  },
  (e) => Kr(e, "aria-label"),
  // associated element text designated by the aria-labelledby attribute
  (e, t) => {
    const n = e.getAttribute("aria-labelledby");
    if (n)
      return {
        name: n.split(/\s+/).map((r) => hI(e, r)).filter((r) => !!r).map((r) => eh(r, t)).join(" "),
        nameSource: "text_content"
      };
  },
  (e) => Kr(e, "alt"),
  (e) => Kr(e, "name"),
  (e) => Kr(e, "title"),
  (e) => Kr(e, "placeholder"),
  // SELECT first OPTION text
  (e, t) => {
    if ("options" in e && e.options.length > 0)
      return lo(e.options[0], t);
  }
], fI = [
  (e, t) => lo(e, t)
], pI = 10;
function dl(e, t, n) {
  let r = e, s = 0;
  for (; s <= pI && r && r.nodeName !== "BODY" && r.nodeName !== "HTML" && r.nodeName !== "HEAD"; ) {
    for (const o of t) {
      const i = o(r, n);
      if (i) {
        const { name: a, nameSource: c } = i, u = a && a.trim();
        if (u)
          return { name: Qp(Zp(u)), nameSource: c };
      }
    }
    if (r.nodeName === "FORM")
      break;
    r = r.parentElement, s += 1;
  }
}
function Zp(e) {
  return e.replace(/\s+/g, " ");
}
function Qp(e) {
  return e.length > 100 ? `${yc(e, 100)} [...]` : e;
}
function hI(e, t) {
  return e.ownerDocument ? e.ownerDocument.getElementById(t) : null;
}
function Kr(e, t) {
  return {
    name: e.getAttribute(t) || "",
    nameSource: "standard_attribute"
  };
}
function lo(e, t) {
  return {
    name: eh(e, t) || "",
    nameSource: "text_content"
  };
}
function eh(e, t) {
  if (e.isContentEditable)
    return;
  const { enablePrivacyForActionName: n, actionNameAttribute: r, defaultPrivacyLevel: s } = t;
  if (Pr(Wt.USE_TREE_WALKER_FOR_ACTION_NAME))
    return mI(e, r, n, s);
  if ("innerText" in e) {
    let o = e.innerText;
    const i = (a) => {
      const c = e.querySelectorAll(a);
      for (let u = 0; u < c.length; u += 1) {
        const f = c[u];
        if ("innerText" in f) {
          const l = f.innerText;
          l && l.trim().length > 0 && (o = o.replace(l, ""));
        }
      }
    };
    return i(`[${fi}]`), r && i(`[${r}]`), n && i(`${vn(U.HIDDEN)}, ${vn(U.MASK)}`), o;
  }
  return e.textContent;
}
function mI(e, t, n, r) {
  const s = /* @__PURE__ */ new Map(), o = document.createTreeWalker(
    e,
    // eslint-disable-next-line no-bitwise
    NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
    a
  );
  let i = "";
  for (; o.nextNode(); ) {
    const c = o.currentNode;
    if (Ht(c)) {
      // Following InnerText rendering spec https://html.spec.whatwg.org/multipage/dom.html#rendered-text-collection-steps
      (c.nodeName === "BR" || c.nodeName === "P" || ["block", "flex", "grid", "list-item", "table", "table-caption"].includes(getComputedStyle(c).display)) && (i += " ");
      continue;
    }
    i += c.textContent || "";
  }
  return i.replace(/\s+/g, " ").trim();
  function a(c) {
    const u = gt(c, r, s);
    if (n && u && Os(c, u))
      return NodeFilter.FILTER_REJECT;
    if (Ht(c)) {
      if (c.hasAttribute(fi) || t && c.hasAttribute(t))
        return NodeFilter.FILTER_REJECT;
      const f = getComputedStyle(c);
      if (f.visibility !== "visible" || f.display === "none" || f.contentVisibility && f.contentVisibility !== "visible")
        return NodeFilter.FILTER_REJECT;
    }
    return NodeFilter.FILTER_ACCEPT;
  }
}
function gI(e, { onPointerDown: t, onPointerUp: n }) {
  let r, s = {
    selection: !1,
    input: !1,
    scroll: !1
  }, o;
  const i = [
    me(e, window, "pointerdown", (a) => {
      pl(a) && (r = fl(), s = {
        selection: !1,
        input: !1,
        scroll: !1
      }, o = t(a));
    }, { capture: !0 }),
    me(e, window, "selectionchange", () => {
      (!r || !fl()) && (s.selection = !0);
    }, { capture: !0 }),
    me(e, window, "scroll", () => {
      s.scroll = !0;
    }, { capture: !0, passive: !0 }),
    me(e, window, "pointerup", (a) => {
      if (pl(a) && o) {
        const c = s;
        n(o, a, () => c), o = void 0;
      }
    }, { capture: !0 }),
    me(e, window, "input", () => {
      s.input = !0;
    }, { capture: !0 })
  ];
  return {
    stop: () => {
      i.forEach((a) => a.stop());
    }
  };
}
function fl() {
  const e = window.getSelection();
  return !e || e.isCollapsed;
}
function pl(e) {
  return e.target instanceof Element && // Only consider 'primary' pointer events for now. Multi-touch support could be implemented in
  // the future.
  e.isPrimary !== !1;
}
const hl = 3;
function yI(e, t) {
  if (_I(e))
    return t.addFrustration(Gr.RAGE_CLICK), e.some(ml) && t.addFrustration(Gr.DEAD_CLICK), t.hasError && t.addFrustration(Gr.ERROR_CLICK), { isRage: !0 };
  const n = e.some((r) => r.getUserActivity().selection);
  return e.forEach((r) => {
    r.hasError && r.addFrustration(Gr.ERROR_CLICK), ml(r) && // Avoid considering clicks part of a double-click or triple-click selections as dead clicks
    !n && r.addFrustration(Gr.DEAD_CLICK);
  }), { isRage: !1 };
}
function _I(e) {
  if (e.some((t) => t.getUserActivity().selection || t.getUserActivity().scroll))
    return !1;
  for (let t = 0; t < e.length - (hl - 1); t += 1)
    if (e[t + hl - 1].event.timeStamp - e[t].event.timeStamp <= Oe)
      return !0;
  return !1;
}
const bI = (
  // inputs that don't trigger a meaningful event like "input" when clicked, including textual
  // inputs (using a negative selector is shorter here)
  'input:not([type="checkbox"]):not([type="radio"]):not([type="button"]):not([type="submit"]):not([type="reset"]):not([type="range"]),textarea,select,[contenteditable],[contenteditable] *,canvas,a[href],a[href] *'
);
function ml(e) {
  if (e.hasPageActivity || e.getUserActivity().input || e.getUserActivity().scroll)
    return !1;
  let t = e.event.target;
  return t.tagName === "LABEL" && t.hasAttribute("for") && (t = document.getElementById(t.getAttribute("for"))), !t || !t.matches(bI);
}
const th = 10 * Oe, os = /* @__PURE__ */ new Map();
function wI(e) {
  const t = os.get(e);
  return os.delete(e), t;
}
function nh(e, t) {
  os.set(e, t), os.forEach((n, r) => {
    _e(r, Ze()) > th && os.delete(r);
  });
}
const EI = 5 * He;
function SI(e, t, n, r) {
  const s = Ur({ expireDelay: EI }), o = new Z();
  let i;
  e.subscribe(10, () => {
    s.reset();
  }), e.subscribe(5, f), e.subscribe(11, (l) => {
    l.reason === yr.UNLOADING && f();
  });
  const { stop: a } = gI(r, {
    onPointerDown: (l) => TI(r, e, t, l, n),
    onPointerUp: ({ clickActionBase: l, hadActivityOnPointerDown: d }, p, h) => {
      vI(r, e, t, n, s, o, u, l, p, h, d);
    }
  });
  return {
    stop: () => {
      f(), o.notify(), a();
    },
    actionContexts: {
      findActionId: (l) => s.findAll(l)
    }
  };
  function u(l) {
    if (!i || !i.tryAppend(l)) {
      const d = l.clone();
      i = aI(l, (p) => {
        kI(p, d);
      });
    }
  }
  function f() {
    i && i.stop();
  }
}
function TI(e, t, n, r, s) {
  let o;
  if (e.enablePrivacyForActionName ? o = gt(r.target, e.defaultPrivacyLevel) : o = U.ALLOW, o === U.HIDDEN)
    return;
  const i = II(r, o, e);
  let a = !1;
  return Dc(
    t,
    n,
    s,
    e,
    (c) => {
      a = c.hadActivity;
    },
    // We don't care about the activity duration, we just want to know whether an activity did happen
    // within the "validation delay" or not. Limit the duration so the callback is called sooner.
    Wp
  ), { clickActionBase: i, hadActivityOnPointerDown: () => a };
}
function vI(e, t, n, r, s, o, i, a, c, u, f) {
  var l;
  const d = rh(t, s, u, a, c);
  i(d);
  const p = (l = a?.target) === null || l === void 0 ? void 0 : l.selector;
  p && nh(c.timeStamp, p);
  const { stop: h } = Dc(t, n, r, e, (_) => {
    _.hadActivity && _.end < d.startClocks.timeStamp ? d.discard() : _.hadActivity ? d.stop(_.end) : f() ? d.stop(
      // using the click start as activity end, so the click will have some activity but its
      // duration will be 0 (as the activity started before the click start)
      d.startClocks.timeStamp
    ) : d.stop();
  }, th), m = t.subscribe(5, ({ endClocks: _ }) => {
    d.stop(_.timeStamp);
  }), g = o.subscribe(() => {
    d.stop();
  });
  d.stopObservable.subscribe(() => {
    m.unsubscribe(), h(), g.unsubscribe();
  });
}
function II(e, t, n) {
  const r = e.target.getBoundingClientRect(), s = xs(e.target, n.actionNameAttribute);
  s && nh(e.timeStamp, s);
  const { name: o, nameSource: i } = lI(e.target, n, t);
  return {
    type: ui.CLICK,
    target: {
      width: Math.round(r.width),
      height: Math.round(r.height),
      selector: s
    },
    position: {
      // Use clientX and Y because for SVG element offsetX and Y are relatives to the <svg> element
      x: Math.round(e.clientX - r.left),
      y: Math.round(e.clientY - r.top)
    },
    name: o,
    nameSource: i
  };
}
function rh(e, t, n, r, s) {
  const o = Ue(), i = Ee(), a = t.add(o, i.relative), c = Bp({
    lifeCycle: e,
    isChildEvent: (h) => h.action !== void 0 && (Array.isArray(h.action.id) ? h.action.id.includes(o) : h.action.id === o)
  });
  let u = 0, f;
  const l = [], d = new Z();
  function p(h) {
    u === 0 && (f = h, u = 1, f ? a.close(Xo(f)) : a.remove(), c.stop(), d.notify());
  }
  return {
    event: s,
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
    startClocks: i,
    isStopped: () => u === 1 || u === 2,
    clone: () => rh(e, t, n, r, s),
    validate: (h) => {
      if (p(), u !== 1)
        return;
      const { resourceCount: m, errorCount: g, longTaskCount: _ } = c.eventCounts, y = {
        duration: f && _e(i.timeStamp, f),
        startClocks: i,
        id: o,
        frustrationTypes: l,
        counts: {
          resourceCount: m,
          errorCount: g,
          longTaskCount: _
        },
        events: h ?? [s],
        event: s,
        ...r
      };
      e.notify(0, y), u = 2;
    },
    discard: () => {
      p(), u = 2;
    }
  };
}
function kI(e, t) {
  const { isRage: n } = yI(e, t);
  n ? (e.forEach((r) => r.discard()), t.stop(oe()), t.validate(e.map((r) => r.event))) : (t.discard(), e.forEach((r) => r.validate()));
}
function CI(e, t, n, r, s) {
  const { unsubscribe: o } = e.subscribe(0, (c) => {
    e.notify(12, gl(c));
  });
  t.register(0, ({ startTime: c, eventType: u }) => {
    if (u !== z.ERROR && u !== z.RESOURCE && u !== z.LONG_TASK)
      return xe;
    const f = i.findActionId(c);
    return f ? {
      type: u,
      action: { id: f }
    } : xe;
  }), t.register(1, ({ startTime: c }) => ({
    action: { id: i.findActionId(c) }
  }));
  let i = { findActionId: Y }, a = Y;
  return s.trackUserInteractions && ({ actionContexts: i, stop: a } = SI(e, n, r, s)), {
    addAction: (c) => {
      e.notify(12, gl(c));
    },
    actionContexts: i,
    stop: () => {
      o(), a();
    }
  };
}
function gl(e) {
  const t = Hi(e) ? {
    action: {
      id: e.id,
      loading_time: $p(q(e.duration)),
      frustration: {
        type: e.frustrationTypes
      },
      error: {
        count: e.counts.errorCount
      },
      long_task: {
        count: e.counts.longTaskCount
      },
      resource: {
        count: e.counts.resourceCount
      }
    },
    _dd: {
      action: {
        target: e.target,
        position: e.position,
        name_source: e.nameSource
      }
    }
  } : {
    context: e.context
  }, n = ot({
    action: { id: Ue(), target: { name: e.name }, type: e.type },
    date: e.startClocks.timeStamp,
    type: z.ACTION
  }, t), r = Hi(e) ? e.duration : void 0, s = Hi(e) ? { events: e.events } : { handlingStack: e.handlingStack };
  return {
    rawRumEvent: n,
    duration: r,
    startTime: e.startClocks.relative,
    domainContext: s
  };
}
function Hi(e) {
  return e.type !== ui.CUSTOM;
}
function AI(e) {
  const t = mp([ve.error]).subscribe((n) => e.notify(n.error));
  return {
    stop: () => {
      t.unsubscribe();
    }
  };
}
function RI(e, t) {
  const n = rp(e, [
    Rr.cspViolation,
    Rr.intervention
  ]).subscribe((r) => t.notify(r));
  return {
    stop: () => {
      n.unsubscribe();
    }
  };
}
function xI(e, t, n) {
  const r = new Z();
  return n.subscribe((s) => {
    s.type === 0 && r.notify(s.error);
  }), AI(r), RI(t, r), r.subscribe((s) => e.notify(14, { error: s })), OI(e);
}
function OI(e) {
  return e.subscribe(14, ({ error: t }) => {
    e.notify(12, LI(t));
  }), {
    addError: ({ error: t, handlingStack: n, componentStack: r, startClocks: s, context: o }) => {
      const i = ei({
        originalError: t,
        handlingStack: n,
        componentStack: r,
        startClocks: s,
        nonErrorPrefix: "Provided",
        source: Ye.CUSTOM,
        handling: "handled"
      });
      i.context = ot(i.context, o), e.notify(14, { error: i });
    }
  };
}
function LI(e) {
  const t = {
    date: e.startClocks.timeStamp,
    error: {
      id: Ue(),
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
      csp: e.csp
    },
    type: z.ERROR,
    context: e.context
  }, n = {
    error: e.originalError,
    handlingStack: e.handlingStack
  };
  return {
    rawRumEvent: t,
    startTime: e.startClocks.relative,
    domainContext: n
  };
}
const yl = /* @__PURE__ */ new WeakSet();
function NI(e) {
  if (!performance || !("getEntriesByName" in performance))
    return;
  const t = performance.getEntriesByName(e.url, "resource");
  if (!t.length || !("toJSON" in t[0]))
    return;
  const n = t.filter((r) => !yl.has(r)).filter((r) => Pp(r) && Dp(r)).filter((r) => MI(r, e.startClocks.relative, sh({ startTime: e.startClocks.relative, duration: e.duration })));
  if (n.length === 1)
    return yl.add(n[0]), n[0].toJSON();
}
function sh(e) {
  return Or(e.startTime, e.duration);
}
function MI(e, t, n) {
  return e.startTime >= t - 1 && sh(e) <= Or(n, 1);
}
const PI = 2 * He;
function DI(e) {
  const t = UI(e) || FI(e);
  if (!(!t || t.traceTime <= We() - PI))
    return t.traceId;
}
function UI(e) {
  const t = e.querySelector("meta[name=dd-trace-id]"), n = e.querySelector("meta[name=dd-trace-time]");
  return oh(t && t.content, n && n.content);
}
function FI(e) {
  const t = $I(e);
  if (t)
    return oh(fs(t, "trace-id"), fs(t, "trace-time"));
}
function oh(e, t) {
  const n = t && Number(t);
  if (!(!e || !n))
    return {
      traceId: e,
      traceTime: n
    };
}
function $I(e) {
  for (let t = 0; t < e.childNodes.length; t += 1) {
    const n = _l(e.childNodes[t]);
    if (n)
      return n;
  }
  if (e.body)
    for (let t = e.body.childNodes.length - 1; t >= 0; t -= 1) {
      const n = e.body.childNodes[t], r = _l(n);
      if (r)
        return r;
      if (!va(n))
        break;
    }
}
function _l(e) {
  if (e && $v(e)) {
    const t = /^\s*DATADOG;(.*?)\s*$/.exec(e.data);
    if (t)
      return t[1];
  }
}
function ih() {
  if (hn(te.NAVIGATION)) {
    const n = performance.getEntriesByType(te.NAVIGATION)[0];
    if (n)
      return n;
  }
  const e = BI(), t = {
    entryType: te.NAVIGATION,
    initiatorType: "navigation",
    name: window.location.href,
    startTime: 0,
    duration: e.loadEventEnd,
    decodedBodySize: 0,
    encodedBodySize: 0,
    transferSize: 0,
    workerStart: 0,
    toJSON: () => ({ ...t, toJSON: void 0 }),
    ...e
  };
  return t;
}
function BI() {
  const e = {}, t = performance.timing;
  for (const n in t)
    if (Ts(t[n])) {
      const r = n, s = t[r];
      e[r] = s === 0 ? 0 : Xo(s);
    }
  return e;
}
function VI(e, t, n = ih) {
  Cc(e, "interactive", () => {
    const r = n(), s = Object.assign(r.toJSON(), {
      entryType: te.RESOURCE,
      initiatorType: Np,
      // The ResourceTiming duration entry should be `responseEnd - startTime`. With
      // NavigationTiming entries, `startTime` is always 0, so set it to `responseEnd`.
      duration: r.responseEnd,
      traceId: DI(document),
      toJSON: () => ({ ...s, toJSON: void 0 })
    });
    t(s);
  });
}
const WI = 1e3;
function HI(e) {
  const t = /* @__PURE__ */ new Set(), n = e.subscribe(8, (r) => {
    t.add(r), t.size > WI && (Kt("Too many requests"), t.delete(t.values().next().value));
  });
  return {
    getMatchingRequest(r) {
      let s = 1 / 0, o;
      for (const i of t) {
        const a = r.startTime - i.startClocks.relative;
        0 <= a && a < s && i.url === r.name && (s = Math.abs(a), o = i);
      }
      return o && t.delete(o), o;
    },
    stop() {
      n.unsubscribe();
    }
  };
}
const GI = 32 * $n;
function zI(e, t) {
  return t.allowedGraphQlUrls.find((n) => Qo([n.match], e));
}
function KI(e, t = !1) {
  if (!e || typeof e != "string")
    return;
  let n;
  try {
    n = JSON.parse(e);
  } catch {
    return;
  }
  if (!n || !n.query)
    return;
  const r = n.query.trim(), s = jI(r), o = n.operationName;
  if (!s)
    return;
  let i;
  return n.variables && (i = JSON.stringify(n.variables)), {
    operationType: s,
    operationName: o,
    variables: i,
    payload: t ? yc(r, GI, "...") : void 0
  };
}
function jI(e) {
  var t;
  return (t = e.match(/^\s*(query|mutation|subscription)\b/i)) === null || t === void 0 ? void 0 : t[1];
}
function qI(e, t, n, r = LS(), s = VI) {
  let o;
  const i = t.trackEarlyRequests;
  i ? o = HI(e) : e.subscribe(8, (u) => {
    c(() => XI(u, t, n));
  });
  const a = Ot(t, {
    type: te.RESOURCE,
    buffered: !0
  }).subscribe((u) => {
    for (const f of u)
      (i || !Mp(f)) && c(() => bl(f, t, n, o));
  });
  s(t, (u) => {
    c(() => bl(u, t, n, o));
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
    }
  };
}
function XI(e, t, n) {
  const r = NI(e);
  return ah(r, e, n, t);
}
function bl(e, t, n, r) {
  const s = Mp(e) && r ? r.getMatchingRequest(e) : void 0;
  return ah(e, s, n, t);
}
function ah(e, t, n, r) {
  if (!e && !t)
    return;
  const s = t ? QI(t, r) : ek(e, r);
  if (!r.trackResources && !s)
    return;
  const o = e ? vs(e.startTime) : t.startClocks, i = e ? Sv(e) : tk(n, o, t.duration), a = t && YI(t, r), c = ot({
    date: o.timeStamp,
    resource: {
      id: Ue(),
      duration: q(i),
      // TODO: in the future when `entry` is required, we can probably only rely on `computeResourceEntryType`
      type: t ? t.type === Vn.XHR ? Fe.XHR : Fe.FETCH : Ev(e),
      method: t ? t.method : void 0,
      status_code: t ? t.status : nk(e.responseStatus),
      url: t ? Up(t.url) : e.name,
      protocol: e && Iv(e),
      delivery_type: e && kv(e),
      graphql: a
    },
    type: z.RESOURCE,
    _dd: {
      discarded: !r.trackResources
    }
  }, s, e && ZI(e));
  return {
    startTime: o.relative,
    duration: i,
    rawRumEvent: c,
    domainContext: JI(e, t)
  };
}
function YI(e, t) {
  if (!Pr(Wt.GRAPHQL_TRACKING))
    return;
  const n = zI(e.url, t);
  if (n)
    return KI(e.body, n.trackPayload);
}
function JI(e, t) {
  if (t) {
    const n = {
      performanceEntry: e,
      isAborted: t.isAborted,
      handlingStack: t.handlingStack
    };
    return t.type === Vn.XHR ? {
      xhr: t.xhr,
      ...n
    } : {
      requestInput: t.input,
      requestInit: t.init,
      response: t.response,
      error: t.error,
      ...n
    };
  }
  return {
    // Currently, at least one of `entry` or `request` must be defined when calling this function.
    // So `entry` is guaranteed to be defined here. In the future, when `entry` is required, we can
    // remove the `!` assertion.
    performanceEntry: e
  };
}
function ZI(e) {
  const { renderBlockingStatus: t } = e;
  return {
    resource: {
      render_blocking_status: t,
      ...Cv(e),
      ...Tv(e)
    }
  };
}
function QI(e, t) {
  if (e.traceSampled && e.traceId && e.spanId)
    return {
      _dd: {
        span_id: e.spanId.toString(),
        trace_id: e.traceId.toString(),
        rule_psr: t.rulePsr
      }
    };
}
function ek(e, t) {
  if (e.traceId)
    return {
      _dd: {
        trace_id: e.traceId,
        span_id: Ap().toString(),
        rule_psr: t.rulePsr
      }
    };
}
function tk(e, t, n) {
  return e.wasInPageStateDuringPeriod("frozen", t.relative, n) ? void 0 : n;
}
function nk(e) {
  return e === 0 ? void 0 : e;
}
function rk(e, t, n) {
  const { stop: r, eventCounts: s } = Bp({
    lifeCycle: e,
    isChildEvent: (o) => o.view.id === t,
    onChange: n
  });
  return {
    stop: r,
    eventCounts: s
  };
}
const sk = 10 * He;
function ok(e, t, n) {
  return {
    stop: Ot(e, {
      type: te.PAINT,
      buffered: !0
    }).subscribe((s) => {
      const o = s.find((i) => i.name === "first-contentful-paint" && i.startTime < t.timeStamp && i.startTime < sk);
      o && n(o.startTime);
    }).unsubscribe
  };
}
function ik(e, t) {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      t(_e(e, Ze()));
    });
  });
}
function ak(e, t, n) {
  const r = Ot(e, {
    type: te.FIRST_INPUT,
    buffered: !0
  }).subscribe((s) => {
    const o = s.find((i) => i.startTime < t.timeStamp);
    if (o) {
      const i = _e(o.startTime, o.processingStart);
      let a;
      o.target && Ht(o.target) && (a = xs(o.target, e.actionNameAttribute)), n({
        // Ensure firstInputDelay to be positive, see
        // https://bugs.chromium.org/p/chromium/issues/detail?id=1185815
        delay: i >= 0 ? i : 0,
        time: o.startTime,
        targetSelector: a
      });
    }
  });
  return {
    stop: () => {
      r.unsubscribe();
    }
  };
}
function ck(e, t, n = ih) {
  return dk(e, () => {
    const r = n();
    lk(r) || t(uk(r));
  });
}
function uk(e) {
  return {
    domComplete: e.domComplete,
    domContentLoaded: e.domContentLoadedEventEnd,
    domInteractive: e.domInteractive,
    loadEvent: e.loadEventEnd,
    // In some cases the value reported is negative or is larger
    // than the current page time. Ignore these cases:
    // https://github.com/GoogleChrome/web-vitals/issues/137
    // https://github.com/GoogleChrome/web-vitals/issues/162
    firstByte: e.responseStart >= 0 && e.responseStart <= Ze() ? e.responseStart : void 0
  };
}
function lk(e) {
  return e.loadEventEnd <= 0;
}
function dk(e, t) {
  let n;
  const { stop: r } = Cc(e, "complete", () => {
    n = Re(() => t());
  });
  return {
    stop: () => {
      r(), ze(n);
    }
  };
}
const fk = 10 * He;
function pk(e, t, n, r) {
  let s = 1 / 0;
  const { stop: o } = qe(e, n, [
    "pointerdown",
    "keydown"
    /* DOM_EVENT.KEY_DOWN */
  ], (c) => {
    s = c.timeStamp;
  }, { capture: !0, once: !0 });
  let i = 0;
  const a = Ot(e, {
    type: te.LARGEST_CONTENTFUL_PAINT,
    buffered: !0
  }).subscribe((c) => {
    const u = mf(c, (f) => f.entryType === te.LARGEST_CONTENTFUL_PAINT && f.startTime < s && f.startTime < t.timeStamp && f.startTime < fk && // Ensure to get the LCP entry with the biggest size, see
    // https://bugs.chromium.org/p/chromium/issues/detail?id=1516655
    f.size > i);
    if (u) {
      let f;
      u.element && (f = xs(u.element, e.actionNameAttribute)), r({
        value: u.startTime,
        targetSelector: f,
        resourceUrl: hk(u)
      }), i = u.size;
    }
  });
  return {
    stop: () => {
      o(), a.unsubscribe();
    }
  };
}
function hk(e) {
  return e.url === "" ? void 0 : e.url;
}
function ch(e, t, n = window) {
  if (document.visibilityState === "hidden")
    return { timeStamp: 0, stop: Y };
  if (hn(te.VISIBILITY_STATE)) {
    const o = performance.getEntriesByType(te.VISIBILITY_STATE).filter((i) => i.name === "hidden").find((i) => i.startTime >= t.relative);
    if (o)
      return { timeStamp: o.startTime, stop: Y };
  }
  let r = 1 / 0;
  const { stop: s } = qe(e, n, [
    "pagehide",
    "visibilitychange"
    /* DOM_EVENT.VISIBILITY_CHANGE */
  ], (o) => {
    (o.type === "pagehide" || document.visibilityState === "hidden") && (r = o.timeStamp, s());
  }, { capture: !0 });
  return {
    get timeStamp() {
      return r;
    },
    stop: s
  };
}
function mk(e, t, n, r) {
  const s = {}, { stop: o } = ck(e, (l) => {
    n(l.loadEvent), s.navigationTimings = l, r();
  }), i = ch(e, t), { stop: a } = ok(e, i, (l) => {
    s.firstContentfulPaint = l, r();
  }), { stop: c } = pk(e, i, window, (l) => {
    s.largestContentfulPaint = l, r();
  }), { stop: u } = ak(e, i, (l) => {
    s.firstInput = l, r();
  });
  function f() {
    o(), a(), c(), u(), i.stop();
  }
  return {
    stop: f,
    initialViewMetrics: s
  };
}
const Ia = (e, t) => e * t, gk = (e, t) => {
  const n = Math.max(e.left, t.left), r = Math.max(e.top, t.top), s = Math.min(e.right, t.right), o = Math.min(e.bottom, t.bottom);
  return n >= s || r >= o ? 0 : Ia(s - n, o - r);
}, wl = (e) => {
  const t = Ia(e.previousRect.width, e.previousRect.height), n = Ia(e.currentRect.width, e.currentRect.height), r = gk(e.previousRect, e.currentRect);
  return t + n - r;
};
function yk(e, t, n) {
  if (!Sk())
    return {
      stop: Y
    };
  let r = 0, s;
  n({
    value: 0
  });
  const o = Ek(), i = Ot(e, {
    type: te.LAYOUT_SHIFT,
    buffered: !0
  }).subscribe((a) => {
    var c;
    for (const u of a) {
      if (u.hadRecentInput || u.startTime < t)
        continue;
      const { cumulatedValue: f, isMaxValue: l } = o.update(u);
      if (l) {
        const d = _k(u.sources);
        s = {
          target: d?.node ? new WeakRef(d.node) : void 0,
          time: _e(t, u.startTime),
          previousRect: d?.previousRect,
          currentRect: d?.currentRect,
          devicePixelRatio: window.devicePixelRatio
        };
      }
      if (f > r) {
        r = f;
        const d = (c = s?.target) === null || c === void 0 ? void 0 : c.deref();
        n({
          value: ns(r, 4),
          targetSelector: d && xs(d, e.actionNameAttribute),
          time: s?.time,
          previousRect: s?.previousRect ? El(s.previousRect) : void 0,
          currentRect: s?.currentRect ? El(s.currentRect) : void 0,
          devicePixelRatio: s?.devicePixelRatio
        });
      }
    }
  });
  return {
    stop: () => {
      i.unsubscribe();
    }
  };
}
function _k(e) {
  let t;
  for (const n of e)
    if (n.node && Ht(n.node)) {
      const r = wl(n);
      (!t || wl(t) < r) && (t = n);
    }
  return t;
}
function El({ x: e, y: t, width: n, height: r }) {
  return { x: e, y: t, width: n, height: r };
}
const bk = 5 * Oe, wk = Oe;
function Ek() {
  let e = 0, t, n, r = 0;
  return {
    update: (s) => {
      const o = t === void 0 || s.startTime - n >= wk || s.startTime - t >= bk;
      let i;
      return o ? (t = n = s.startTime, r = e = s.value, i = !0) : (e += s.value, n = s.startTime, i = s.value > r, i && (r = s.value)), {
        cumulatedValue: e,
        isMaxValue: i
      };
    }
  };
}
function Sk() {
  return hn(te.LAYOUT_SHIFT) && "WeakRef" in window;
}
let fo, uh = 0, Gi = 1 / 0, zi = 0;
function Tk() {
  "interactionCount" in performance || fo || (fo = new window.PerformanceObserver(D((e) => {
    e.getEntries().forEach((t) => {
      const n = t;
      n.interactionId && (Gi = Math.min(Gi, n.interactionId), zi = Math.max(zi, n.interactionId), uh = (zi - Gi) / 7 + 1);
    });
  })), fo.observe({ type: "event", buffered: !0, durationThreshold: 0 }));
}
const Sl = () => fo ? uh : window.performance.interactionCount || 0, Tl = 10, vk = 1 * He;
function Ik(e, t, n) {
  if (!Ak())
    return {
      getInteractionToNextPaint: () => {
      },
      setViewEnd: Y,
      stop: Y
    };
  const { getViewInteractionCount: r, stopViewInteractionCount: s } = Ck(n);
  let o = 1 / 0;
  const i = kk(r);
  let a = -1, c, u;
  function f(p) {
    for (const m of p)
      m.interactionId && // Check the entry start time is inside the view bounds because some view interactions can be reported after the view end (if long duration).
      m.startTime >= t && m.startTime <= o && i.process(m);
    const h = i.estimateP98Interaction();
    h && h.duration !== a && (a = h.duration, u = _e(t, h.startTime), c = wI(h.startTime), !c && h.target && Ht(h.target) && (c = xs(h.target, e.actionNameAttribute)));
  }
  const l = Ot(e, {
    type: te.FIRST_INPUT,
    buffered: !0
  }).subscribe(f), d = Ot(e, {
    type: te.EVENT,
    // durationThreshold only impact PerformanceEventTiming entries used for INP computation which requires a threshold at 40 (default is 104ms)
    // cf: https://github.com/GoogleChrome/web-vitals/blob/3806160ffbc93c3c4abf210a167b81228172b31c/src/onINP.ts#L202-L210
    durationThreshold: 40,
    buffered: !0
  }).subscribe(f);
  return {
    getInteractionToNextPaint: () => {
      if (a >= 0)
        return {
          value: Math.min(a, vk),
          targetSelector: c,
          time: u
        };
      if (r())
        return {
          value: 0
        };
    },
    setViewEnd: (p) => {
      o = p, s();
    },
    stop: () => {
      d.unsubscribe(), l.unsubscribe();
    }
  };
}
function kk(e) {
  const t = [];
  function n() {
    t.sort((r, s) => s.duration - r.duration).splice(Tl);
  }
  return {
    /**
     * Process the performance entry:
     * - if its duration is long enough, add the performance entry to the list of worst interactions
     * - if an entry with the same interaction id exists and its duration is lower than the new one, then replace it in the list of worst interactions
     */
    process(r) {
      const s = t.findIndex((i) => r.interactionId === i.interactionId), o = t[t.length - 1];
      s !== -1 ? r.duration > t[s].duration && (t[s] = r, n()) : (t.length < Tl || r.duration > o.duration) && (t.push(r), n());
    },
    /**
     * Compute the p98 longest interaction.
     * For better performance the computation is based on 10 longest interactions and the interaction count of the current view.
     */
    estimateP98Interaction() {
      const r = Math.min(t.length - 1, Math.floor(e() / 50));
      return t[r];
    }
  };
}
function Ck(e) {
  Tk();
  const t = e === Dt.INITIAL_LOAD ? 0 : Sl();
  let n = { stopped: !1 };
  function r() {
    return Sl() - t;
  }
  return {
    getViewInteractionCount: () => n.stopped ? n.interactionCount : r(),
    stopViewInteractionCount: () => {
      n = { stopped: !0, interactionCount: r() };
    }
  };
}
function Ak() {
  return hn(te.EVENT) && window.PerformanceEventTiming && "interactionId" in PerformanceEventTiming.prototype;
}
function Rk(e, t, n, r, s, o, i) {
  let a = s === Dt.INITIAL_LOAD, c = !0;
  const u = [], f = ch(r, o);
  function l() {
    if (!c && !a && u.length > 0) {
      const p = Math.max(...u);
      p < f.timeStamp - o.relative && i(p);
    }
  }
  const { stop: d } = Dc(e, t, n, r, (p) => {
    c && (c = !1, p.hadActivity && u.push(_e(o.timeStamp, p.end)), l());
  });
  return {
    stop: () => {
      d(), f.stop();
    },
    setLoadEvent: (p) => {
      a && (a = !1, u.push(p), l());
    }
  };
}
function lh() {
  let e;
  const t = window.visualViewport;
  return t ? e = t.pageLeft - t.offsetLeft : window.scrollX !== void 0 ? e = window.scrollX : e = window.pageXOffset || 0, Math.round(e);
}
function Fc() {
  let e;
  const t = window.visualViewport;
  return t ? e = t.pageTop - t.offsetTop : window.scrollY !== void 0 ? e = window.scrollY : e = window.pageYOffset || 0, Math.round(e);
}
let Ki;
function dh(e) {
  return Ki || (Ki = xk(e)), Ki;
}
function xk(e) {
  return new Z((t) => {
    const { throttled: n } = pn(() => {
      t.notify(hi());
    }, 200);
    return me(e, window, "resize", n, { capture: !0, passive: !0 }).stop;
  });
}
function hi() {
  const e = window.visualViewport;
  return e ? {
    width: Number(e.width * e.scale),
    height: Number(e.height * e.scale)
  } : {
    width: Number(window.innerWidth || 0),
    height: Number(window.innerHeight || 0)
  };
}
const Ok = Oe;
function Lk(e, t, n, r = Mk(e)) {
  let s = 0, o = 0, i = 0;
  const a = r.subscribe(({ scrollDepth: c, scrollTop: u, scrollHeight: f }) => {
    let l = !1;
    if (c > s && (s = c, l = !0), f > o) {
      o = f;
      const d = Ze();
      i = _e(t.relative, d), l = !0;
    }
    l && n({
      maxDepth: Math.min(s, o),
      maxDepthScrollTop: u,
      maxScrollHeight: o,
      maxScrollHeightTime: i
    });
  });
  return {
    stop: () => a.unsubscribe()
  };
}
function Nk() {
  const e = Fc(), { height: t } = hi(), n = Math.round((document.scrollingElement || document.documentElement).scrollHeight), r = Math.round(t + e);
  return {
    scrollHeight: n,
    scrollDepth: r,
    scrollTop: e
  };
}
function Mk(e, t = Ok) {
  return new Z((n) => {
    function r() {
      n.notify(Nk());
    }
    if (window.ResizeObserver) {
      const s = pn(r, t, {
        leading: !1,
        trailing: !0
      }), o = document.scrollingElement || document.documentElement, i = new ResizeObserver(D(s.throttled));
      o && i.observe(o);
      const a = me(e, window, "scroll", s.throttled, {
        passive: !0
      });
      return () => {
        s.cancel(), i.disconnect(), a.stop();
      };
    }
  });
}
function Pk(e, t, n, r, s, o, i) {
  const a = {}, { stop: c, setLoadEvent: u } = Rk(e, t, n, r, o, i, (m) => {
    a.loadingTime = m, s();
  }), { stop: f } = Lk(r, i, (m) => {
    a.scroll = m;
  }), { stop: l } = yk(r, i.relative, (m) => {
    a.cumulativeLayoutShift = m, s();
  }), { stop: d, getInteractionToNextPaint: p, setViewEnd: h } = Ik(r, i.relative, o);
  return {
    stop: () => {
      c(), l(), f();
    },
    stopINPTracking: d,
    setLoadEvent: u,
    setViewEnd: h,
    getCommonViewMetrics: () => (a.interactionToNextPaint = p(), a)
  };
}
function Dk(e, t) {
  const { stop: n } = me(e, window, "pageshow", (r) => {
    r.persisted && t(r);
  }, { capture: !0 });
  return n;
}
function Uk(e, t, n) {
  ik(e.relative, (r) => {
    t.firstContentfulPaint = r, t.largestContentfulPaint = { value: r }, n();
  });
}
const Fk = 3e3, $k = 5 * He, Bk = 5 * He;
function Vk(e, t, n, r, s, o, i, a) {
  const c = /* @__PURE__ */ new Set();
  let u = d(Dt.INITIAL_LOAD, gc(), a), f;
  p();
  let l;
  i && (l = h(o), s.trackBfcacheViews && (f = Dk(s, (m) => {
    u.end();
    const g = vs(m.timeStamp);
    u = d(Dt.BF_CACHE, g, void 0);
  })));
  function d(m, g, _) {
    const y = Wk(t, n, r, s, e, m, g, _);
    return c.add(y), y.stopObservable.subscribe(() => {
      c.delete(y);
    }), y;
  }
  function p() {
    t.subscribe(10, () => {
      u = d(Dt.ROUTE_CHANGE, void 0, {
        name: u.name,
        service: u.service,
        version: u.version,
        context: u.contextManager.getContext()
      });
    }), t.subscribe(9, () => {
      u.end({ sessionIsActive: !1 });
    });
  }
  function h(m) {
    return m.subscribe(({ oldLocation: g, newLocation: _ }) => {
      Gk(g, _) && (u.end(), u = d(Dt.ROUTE_CHANGE));
    });
  }
  return {
    addTiming: (m, g = oe()) => {
      u.addTiming(m, g);
    },
    startView: (m, g) => {
      u.end({ endClocks: g }), u = d(Dt.ROUTE_CHANGE, g, m);
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
    }
  };
}
function Wk(e, t, n, r, s, o, i = Ee(), a) {
  const c = Ue(), u = new Z(), f = {};
  let l = 0, d;
  const p = ds(s), h = Rs();
  let m = !0, g = a?.name;
  const _ = a?.service || r.service, y = a?.version || r.version, b = a?.context;
  b && h.setContext(b);
  const E = {
    id: c,
    name: g,
    startClocks: i,
    service: _,
    version: y,
    context: b
  };
  e.notify(1, E), e.notify(2, E);
  const { throttled: S, cancel: w } = pn(x, Fk, {
    leading: !1
  }), { setLoadEvent: T, setViewEnd: N, stop: k, stopINPTracking: v, getCommonViewMetrics: M } = Pk(e, t, n, r, ue, o, i), { stop: P, initialViewMetrics: C } = o === Dt.INITIAL_LOAD ? mk(r, i, T, ue) : { stop: Y, initialViewMetrics: {} };
  o === Dt.BF_CACHE && Uk(i, C, ue);
  const { stop: I, eventCounts: O } = rk(e, c, ue), R = Lr(x, $k), X = e.subscribe(11, (A) => {
    A.reason === yr.UNLOADING && x();
  });
  x(), h.changeObservable.subscribe(ue);
  function F() {
    e.notify(3, {
      id: c,
      name: g,
      context: h.getContext(),
      startClocks: i,
      sessionIsActive: m
    });
  }
  function ue() {
    F(), S();
  }
  function x() {
    w(), F(), l += 1;
    const A = d === void 0 ? oe() : d.timeStamp;
    e.notify(4, {
      customTimings: f,
      documentVersion: l,
      id: c,
      name: g,
      service: _,
      version: y,
      context: h.getContext(),
      loadingType: o,
      location: p,
      startClocks: i,
      commonViewMetrics: M(),
      initialViewMetrics: C,
      duration: _e(i.timeStamp, A),
      isActive: d === void 0,
      sessionIsActive: m,
      eventCounts: O
    });
  }
  return {
    get name() {
      return g;
    },
    service: _,
    version: y,
    contextManager: h,
    stopObservable: u,
    end(A = {}) {
      var B, Te;
      d || (d = (B = A.endClocks) !== null && B !== void 0 ? B : Ee(), m = (Te = A.sessionIsActive) !== null && Te !== void 0 ? Te : !0, e.notify(5, { endClocks: d }), e.notify(6, { endClocks: d }), Yo(R), N(d.relative), k(), X.unsubscribe(), x(), Re(() => {
        this.stop();
      }, Bk));
    },
    stop() {
      P(), I(), v(), u.notify();
    },
    addTiming(A, B) {
      if (d)
        return;
      const Te = nw(B) ? B : _e(i.timeStamp, B);
      f[Hk(A)] = Te, ue();
    },
    setViewName(A) {
      g = A, x();
    }
  };
}
function Hk(e) {
  const t = e.replace(/[^a-zA-Z0-9-_.@$]/g, "_");
  return t !== e && W.warn(`Invalid timing name: ${e}, sanitized to: ${t}`), t;
}
function Gk(e, t) {
  return e.pathname !== t.pathname || !zk(t.hash) && vl(t.hash) !== vl(e.hash);
}
function zk(e) {
  const t = e.substring(1);
  return t !== "" && !!document.getElementById(t);
}
function vl(e) {
  const t = e.indexOf("?");
  return t < 0 ? e : e.slice(0, t);
}
function Kk(e, t, n, r, s, o, i, a, c, u) {
  return e.subscribe(4, (f) => e.notify(12, jk(f, n, a))), t.register(0, ({ startTime: f, eventType: l }) => {
    const d = c.findView(f);
    return d ? {
      type: l,
      service: d.service,
      version: d.version,
      context: d.context,
      view: {
        id: d.id,
        name: d.name
      }
    } : mt;
  }), t.register(1, ({ startTime: f }) => {
    var l;
    return {
      view: {
        id: (l = c.findView(f)) === null || l === void 0 ? void 0 : l.id
      }
    };
  }), Vk(r, e, s, o, n, i, !n.trackViewsManually, u);
}
function jk(e, t, n) {
  var r, s, o, i, a, c, u, f, l, d, p, h, m, g, _, y, b, E;
  const S = n.getReplayStats(e.id), w = (s = (r = e.commonViewMetrics) === null || r === void 0 ? void 0 : r.cumulativeLayoutShift) === null || s === void 0 ? void 0 : s.devicePixelRatio, T = {
    _dd: {
      document_version: e.documentVersion,
      replay_stats: S,
      cls: w ? {
        device_pixel_ratio: w
      } : void 0,
      configuration: {
        start_session_replay_recording_manually: t.startSessionReplayRecordingManually
      }
    },
    date: e.startClocks.timeStamp,
    type: z.VIEW,
    view: {
      action: {
        count: e.eventCounts.actionCount
      },
      frustration: {
        count: e.eventCounts.frustrationCount
      },
      cumulative_layout_shift: (o = e.commonViewMetrics.cumulativeLayoutShift) === null || o === void 0 ? void 0 : o.value,
      cumulative_layout_shift_time: q((i = e.commonViewMetrics.cumulativeLayoutShift) === null || i === void 0 ? void 0 : i.time),
      cumulative_layout_shift_target_selector: (a = e.commonViewMetrics.cumulativeLayoutShift) === null || a === void 0 ? void 0 : a.targetSelector,
      first_byte: q((c = e.initialViewMetrics.navigationTimings) === null || c === void 0 ? void 0 : c.firstByte),
      dom_complete: q((u = e.initialViewMetrics.navigationTimings) === null || u === void 0 ? void 0 : u.domComplete),
      dom_content_loaded: q((f = e.initialViewMetrics.navigationTimings) === null || f === void 0 ? void 0 : f.domContentLoaded),
      dom_interactive: q((l = e.initialViewMetrics.navigationTimings) === null || l === void 0 ? void 0 : l.domInteractive),
      error: {
        count: e.eventCounts.errorCount
      },
      first_contentful_paint: q(e.initialViewMetrics.firstContentfulPaint),
      first_input_delay: q((d = e.initialViewMetrics.firstInput) === null || d === void 0 ? void 0 : d.delay),
      first_input_time: q((p = e.initialViewMetrics.firstInput) === null || p === void 0 ? void 0 : p.time),
      first_input_target_selector: (h = e.initialViewMetrics.firstInput) === null || h === void 0 ? void 0 : h.targetSelector,
      interaction_to_next_paint: q((m = e.commonViewMetrics.interactionToNextPaint) === null || m === void 0 ? void 0 : m.value),
      interaction_to_next_paint_time: q((g = e.commonViewMetrics.interactionToNextPaint) === null || g === void 0 ? void 0 : g.time),
      interaction_to_next_paint_target_selector: (_ = e.commonViewMetrics.interactionToNextPaint) === null || _ === void 0 ? void 0 : _.targetSelector,
      is_active: e.isActive,
      name: e.name,
      largest_contentful_paint: q((y = e.initialViewMetrics.largestContentfulPaint) === null || y === void 0 ? void 0 : y.value),
      largest_contentful_paint_target_selector: (b = e.initialViewMetrics.largestContentfulPaint) === null || b === void 0 ? void 0 : b.targetSelector,
      load_event: q((E = e.initialViewMetrics.navigationTimings) === null || E === void 0 ? void 0 : E.loadEvent),
      loading_time: $p(q(e.commonViewMetrics.loadingTime)),
      loading_type: e.loadingType,
      long_task: {
        count: e.eventCounts.longTaskCount
      },
      performance: qk(e.commonViewMetrics, e.initialViewMetrics),
      resource: {
        count: e.eventCounts.resourceCount
      },
      time_spent: q(e.duration)
    },
    display: e.commonViewMetrics.scroll ? {
      scroll: {
        max_depth: e.commonViewMetrics.scroll.maxDepth,
        max_depth_scroll_top: e.commonViewMetrics.scroll.maxDepthScrollTop,
        max_scroll_height: e.commonViewMetrics.scroll.maxScrollHeight,
        max_scroll_height_time: q(e.commonViewMetrics.scroll.maxScrollHeightTime)
      }
    } : void 0,
    privacy: {
      replay_level: t.defaultPrivacyLevel
    },
    device: {
      locale: navigator.language,
      locales: navigator.languages,
      time_zone: WS()
    }
  };
  return Xn(e.customTimings) || (T.view.custom_timings = cf(e.customTimings, q)), {
    rawRumEvent: T,
    startTime: e.startClocks.relative,
    duration: e.duration,
    domainContext: {
      location: e.location
    }
  };
}
function qk({ cumulativeLayoutShift: e, interactionToNextPaint: t }, { firstContentfulPaint: n, firstInput: r, largestContentfulPaint: s }) {
  return {
    cls: e && {
      score: e.value,
      timestamp: q(e.time),
      target_selector: e.targetSelector,
      previous_rect: e.previousRect,
      current_rect: e.currentRect
    },
    fcp: n && { timestamp: q(n) },
    fid: r && {
      duration: q(r.delay),
      timestamp: q(r.time),
      target_selector: r.targetSelector
    },
    inp: t && {
      duration: q(t.value),
      timestamp: q(t.time),
      target_selector: t.targetSelector
    },
    lcp: s && {
      timestamp: q(s.value),
      target_selector: s.targetSelector,
      resource_url: s.resourceUrl
    }
  };
}
const Xk = "rum";
function Yk(e, t, n) {
  const r = lp(e, Xk, (s) => Zk(e, s), n);
  return r.expireObservable.subscribe(() => {
    t.notify(
      9
      /* LifeCycleEventType.SESSION_EXPIRED */
    );
  }), r.renewObservable.subscribe(() => {
    t.notify(
      10
      /* LifeCycleEventType.SESSION_RENEWED */
    );
  }), r.sessionStateUpdateObservable.subscribe(({ previousState: s, newState: o }) => {
    if (!s.forcedReplay && o.forcedReplay) {
      const i = r.findSession();
      i && (i.isReplayForced = !0);
    }
  }), {
    findTrackedSession: (s) => {
      const o = r.findSession(s);
      if (!(!o || o.trackingType === "0"))
        return {
          id: o.id,
          sessionReplay: o.trackingType === "1" ? 1 : o.isReplayForced ? 2 : 0,
          anonymousId: o.anonymousId
        };
    },
    expire: r.expire,
    expireObservable: r.expireObservable,
    setForcedReplay: () => r.updateSessionState({ forcedReplay: "1" })
  };
}
function Jk() {
  const e = {
    id: "00000000-aaaa-0000-aaaa-000000000000",
    sessionReplay: zf(
      "records"
      /* BridgeCapability.RECORDS */
    ) ? 1 : 0
  };
  return {
    findTrackedSession: () => e,
    expire: Y,
    expireObservable: new Z(),
    setForcedReplay: Y
  };
}
function Zk(e, t) {
  return Qk(t) ? t : tn(e.sessionSampleRate) ? tn(e.sessionReplaySampleRate) ? "1" : "2" : "0";
}
function Qk(e) {
  return e === "0" || e === "1" || e === "2";
}
function eC(e, t, n, r, s, o) {
  const i = [e.rumEndpointBuilder];
  e.replica && i.push(e.replica.rumEndpointBuilder);
  const a = Tc({
    encoder: o(
      2
      /* DeflateEncoderStreamId.RUM */
    ),
    request: si(i, e.batchBytesLimit, n),
    flushController: vc({
      messagesLimit: e.batchMessagesLimit,
      bytesLimit: e.batchBytesLimit,
      durationLimit: e.flushTimeout,
      pageMayExitObservable: r,
      sessionExpireObservable: s
    }),
    messageBytesLimit: e.messageBytesLimit
  });
  return t.subscribe(13, (c) => {
    c.type === z.VIEW ? a.upsert(c, c.view.id) : a.add(c);
  }), a;
}
function tC(e) {
  const t = Qn();
  e.subscribe(13, (n) => {
    t.send("rum", n);
  });
}
const nC = Yn;
function rC(e, t, n, r) {
  const s = Ur({ expireDelay: nC });
  let o;
  e.subscribe(1, ({ startClocks: c }) => {
    const u = r.href;
    s.add(a({
      url: u,
      referrer: o || document.referrer
    }), c.relative), o = u;
  }), e.subscribe(6, ({ endClocks: c }) => {
    s.closeActive(c.relative);
  });
  const i = n.subscribe(({ newLocation: c }) => {
    const u = s.find();
    if (u) {
      const f = Ze();
      s.closeActive(f), s.add(a({
        url: c.href,
        referrer: u.referrer
      }), f);
    }
  });
  function a({ url: c, referrer: u }) {
    return {
      url: c,
      referrer: u
    };
  }
  return t.register(0, ({ startTime: c, eventType: u }) => {
    const f = s.find(c);
    return f ? {
      type: u,
      view: {
        url: f.url,
        referrer: f.referrer
      }
    } : mt;
  }), {
    findUrl: (c) => s.find(c),
    stop: () => {
      i.unsubscribe(), s.stop();
    }
  };
}
function sC(e, t) {
  let n = ds(t);
  return new Z((r) => {
    const { stop: s } = oC(e, i), { stop: o } = iC(e, i);
    function i() {
      if (n.href === t.href)
        return;
      const a = ds(t);
      r.notify({
        newLocation: a,
        oldLocation: n
      }), n = a;
    }
    return () => {
      s(), o();
    };
  });
}
function oC(e, t) {
  const { stop: n } = je(Il("pushState"), "pushState", ({ onPostCall: o }) => {
    o(t);
  }), { stop: r } = je(Il("replaceState"), "replaceState", ({ onPostCall: o }) => {
    o(t);
  }), { stop: s } = me(e, window, "popstate", t);
  return {
    stop: () => {
      n(), r(), s();
    }
  };
}
function iC(e, t) {
  return me(e, window, "hashchange", t);
}
function Il(e) {
  return Object.prototype.hasOwnProperty.call(history, e) ? history : History.prototype;
}
const aC = Yn;
function cC(e, t, n) {
  const r = Ur({
    expireDelay: aC
  });
  return e.subscribe(1, ({ startClocks: s }) => {
    r.add({}, s.relative);
  }), e.subscribe(6, ({ endClocks: s }) => {
    r.closeActive(s.relative);
  }), t.register(0, ({ startTime: s, eventType: o }) => {
    if (!n.trackFeatureFlagsForEvents.concat([
      z.VIEW,
      z.ERROR
    ]).includes(o))
      return xe;
    const a = r.find(s);
    return !a || Xn(a) ? xe : {
      type: o,
      feature_flags: a
    };
  }), {
    addFeatureFlagEvaluation: (s, o) => {
      const i = r.find();
      i && (i[s] = o);
    }
  };
}
const uC = 10 * Oe;
let _r, Ys;
function lC(e, t, n) {
  e.metricsEnabled && (fh(), Ys = !1, t.subscribe(13, () => {
    Ys = !0;
  }), n.subscribe(({ bytesCount: r, messagesCount: s }) => {
    Ys && (Ys = !1, _r.batchCount += 1, Cl(_r.batchBytesCount, r), Cl(_r.batchMessagesCount, s));
  }), Lr(dC, uC));
}
function dC() {
  _r.batchCount !== 0 && (As("Customer data measures", _r), fh());
}
function kl() {
  return { min: 1 / 0, max: 0, sum: 0 };
}
function Cl(e, t) {
  e.sum += t, e.min = Math.min(e.min, t), e.max = Math.max(e.max, t);
}
function fh() {
  _r = {
    batchCount: 0,
    batchBytesCount: kl(),
    batchMessagesCount: kl()
  };
}
const fC = 4e3, pC = 500, hC = Yn;
function mC(e, t, n = pC) {
  const r = Ur({
    expireDelay: hC,
    maxEntries: fC
  });
  let s;
  hn(te.VISIBILITY_STATE) && performance.getEntriesByType(te.VISIBILITY_STATE).forEach((u) => {
    const f = u.name === "hidden" ? "hidden" : "active";
    i(f, u.startTime);
  }), i(ph(), Ze());
  const { stop: o } = qe(t, window, [
    "pageshow",
    "focus",
    "blur",
    "visibilitychange",
    "resume",
    "freeze",
    "pagehide"
  ], (c) => {
    i(yC(c), c.timeStamp);
  }, { capture: !0 });
  function i(c, u = Ze()) {
    c !== s && (s = c, r.closeActive(u), r.add({ state: s, startTime: u }, u));
  }
  function a(c, u, f) {
    return r.findAll(u, f).some((l) => l.state === c);
  }
  return e.register(0, ({ startTime: c, duration: u = 0, eventType: f }) => {
    if (f === z.VIEW) {
      const l = r.findAll(c, u);
      return {
        type: f,
        _dd: { page_states: gC(l, c, n) }
      };
    }
    return f === z.ACTION || f === z.ERROR ? {
      type: f,
      view: { in_foreground: a("active", c, 0) }
    } : xe;
  }), {
    wasInPageStateDuringPeriod: a,
    addPageState: i,
    stop: () => {
      o(), r.stop();
    }
  };
}
function gC(e, t, n) {
  if (e.length !== 0)
    return e.slice(-n).reverse().map(({ state: r, startTime: s }) => ({
      state: r,
      start: q(_e(t, s))
    }));
}
function yC(e) {
  return e.type === "freeze" ? "frozen" : e.type === "pagehide" ? e.persisted ? "frozen" : "terminated" : ph();
}
function ph() {
  return document.visibilityState === "hidden" ? "hidden" : document.hasFocus() ? "active" : "passive";
}
function _C(e, t) {
  let n;
  const r = requestAnimationFrame(D(() => {
    n = hi();
  })), s = dh(t).subscribe((o) => {
    n = o;
  }).unsubscribe;
  return e.register(0, ({ eventType: o }) => ({
    type: o,
    display: n ? { viewport: n } : void 0
  })), {
    stop: () => {
      s(), r && cancelAnimationFrame(r);
    }
  };
}
function bC(e, t) {
  const n = window.cookieStore ? wC(e) : SC;
  return new Z((r) => n(t, (s) => r.notify(s)));
}
function wC(e) {
  return (t, n) => me(e, window.cookieStore, "change", (s) => {
    const o = s.changed.find((i) => i.name === t) || s.deleted.find((i) => i.name === t);
    o && n(o.value);
  }).stop;
}
const EC = Oe;
function SC(e, t) {
  const n = fs(document.cookie, e), r = Lr(() => {
    const s = fs(document.cookie, e);
    s !== n && t(s);
  }, EC);
  return () => {
    Yo(r);
  };
}
const Al = "datadog-ci-visibility-test-execution-id";
function TC(e, t, n = bC(e, Al)) {
  var r;
  let s = nn(Al) || ((r = window.Cypress) === null || r === void 0 ? void 0 : r.env("traceId"));
  const o = n.subscribe((i) => {
    s = i;
  });
  return t.register(0, ({ eventType: i }) => typeof s != "string" ? xe : {
    type: i,
    session: {
      type: "ci_test"
    },
    ci_test: {
      test_execution_id: s
    }
  }), {
    stop: () => {
      o.unsubscribe();
    }
  };
}
function vC(e, t) {
  const n = Ot(t, {
    type: te.LONG_ANIMATION_FRAME,
    buffered: !0
  }).subscribe((r) => {
    for (const s of r) {
      const o = vs(s.startTime), i = {
        date: o.timeStamp,
        long_task: {
          id: Ue(),
          entry_type: Tp.LONG_ANIMATION_FRAME,
          duration: q(s.duration),
          blocking_duration: q(s.blockingDuration),
          first_ui_event_timestamp: q(s.firstUIEventTimestamp),
          render_start: q(s.renderStart),
          style_and_layout_start: q(s.styleAndLayoutStart),
          start_time: q(s.startTime),
          scripts: s.scripts.map((a) => ({
            duration: q(a.duration),
            pause_duration: q(a.pauseDuration),
            forced_style_and_layout_duration: q(a.forcedStyleAndLayoutDuration),
            start_time: q(a.startTime),
            execution_start: q(a.executionStart),
            source_url: a.sourceURL,
            source_function_name: a.sourceFunctionName,
            source_char_position: a.sourceCharPosition,
            invoker: a.invoker,
            invoker_type: a.invokerType,
            window_attribution: a.windowAttribution
          }))
        },
        type: z.LONG_TASK,
        _dd: {
          discarded: !1
        }
      };
      e.notify(12, {
        rawRumEvent: i,
        startTime: o.relative,
        duration: s.duration,
        domainContext: { performanceEntry: s }
      });
    }
  });
  return { stop: () => n.unsubscribe() };
}
function IC(e, t) {
  const n = Ot(t, {
    type: te.LONG_TASK,
    buffered: !0
  }).subscribe((r) => {
    for (const s of r) {
      if (s.entryType !== te.LONG_TASK || !t.trackLongTasks)
        break;
      const o = vs(s.startTime), i = {
        date: o.timeStamp,
        long_task: {
          id: Ue(),
          entry_type: Tp.LONG_TASK,
          duration: q(s.duration)
        },
        type: z.LONG_TASK,
        _dd: {
          discarded: !1
        }
      };
      e.notify(12, {
        rawRumEvent: i,
        startTime: o.relative,
        duration: s.duration,
        domainContext: { performanceEntry: s }
      });
    }
  });
  return {
    stop() {
      n.unsubscribe();
    }
  };
}
function kC(e) {
  e.register(0, ({ eventType: t }) => {
    if (!up())
      return xe;
    const n = ap(), r = cp();
    return {
      type: t,
      session: {
        type: "synthetics"
      },
      synthetics: {
        test_id: n,
        result_id: r,
        injected: ii()
      }
    };
  });
}
function CC(e, t, n) {
  const r = ri(e), s = n(r);
  return bc(t).forEach(([o, i]) => (
    // Traverse both object and clone simultaneously up to the path and apply the modification from the clone to the original object when the type is valid
    ka(e, r, o.split(/\.|(?=\[\])/), i)
  )), s;
}
function ka(e, t, n, r) {
  const [s, ...o] = n;
  if (s === "[]") {
    Array.isArray(e) && Array.isArray(t) && e.forEach((i, a) => ka(i, t[a], o, r));
    return;
  }
  if (!(!Rl(e) || !Rl(t))) {
    if (o.length > 0)
      return ka(e[s], t[s], o, r);
    AC(e, s, t[s], r);
  }
}
function AC(e, t, n, r) {
  const s = Jn(n);
  s === r ? e[t] = de(n) : r === "object" && (s === "undefined" || s === "null") && (e[t] = {});
}
function Rl(e) {
  return Jn(e) === "object";
}
const rr = {
  "view.name": "string",
  "view.url": "string",
  "view.referrer": "string"
}, sr = {
  context: "object"
}, or = {
  service: "string",
  version: "string"
};
let hh;
function RC(e, t, n, r) {
  hh = {
    [z.VIEW]: {
      "view.performance.lcp.resource_url": "string",
      ...sr,
      ...rr,
      ...or
    },
    [z.ERROR]: {
      "error.message": "string",
      "error.stack": "string",
      "error.resource.url": "string",
      "error.fingerprint": "string",
      ...sr,
      ...rr,
      ...or
    },
    [z.RESOURCE]: {
      "resource.url": "string",
      ...Pr(Wt.WRITABLE_RESOURCE_GRAPHQL) ? { "resource.graphql": "object" } : {},
      ...sr,
      ...rr,
      ...or
    },
    [z.ACTION]: {
      "action.target.name": "string",
      ...sr,
      ...rr,
      ...or
    },
    [z.LONG_TASK]: {
      "long_task.scripts[].source_url": "string",
      "long_task.scripts[].invoker": "string",
      ...sr,
      ...rr,
      ...or
    },
    [z.VITAL]: {
      ...sr,
      ...rr,
      ...or
    }
  };
  const s = {
    [z.ERROR]: uo(z.ERROR, e.eventRateLimiterThreshold, r),
    [z.ACTION]: uo(z.ACTION, e.eventRateLimiterThreshold, r),
    [z.VITAL]: uo(z.VITAL, e.eventRateLimiterThreshold, r)
  };
  t.subscribe(12, ({ startTime: o, duration: i, rawRumEvent: a, domainContext: c }) => {
    const u = n.triggerHook(0, {
      eventType: a.type,
      startTime: o,
      duration: i
    });
    if (u === mt)
      return;
    const f = ot(u, a, {
      ddtags: ti(e).join(",")
    });
    xC(f, e.beforeSend, c, s) && (Xn(f.context) && delete f.context, t.notify(13, f));
  });
}
function xC(e, t, n, r) {
  var s;
  if (t) {
    const i = CC(e, hh[e.type], (a) => t(a, n));
    if (i === !1 && e.type !== z.VIEW)
      return !1;
    i === !1 && W.warn("Can't dismiss view events using beforeSend!");
  }
  return !((s = r[e.type]) === null || s === void 0 ? void 0 : s.isLimitReached());
}
function OC(e, t, n, r) {
  e.register(0, ({ eventType: s, startTime: o }) => {
    const i = t.findTrackedSession(o), a = r.findView(o);
    if (!i || !a)
      return mt;
    let c, u, f;
    return s === z.VIEW ? (c = n.getReplayStats(a.id) ? !0 : void 0, u = i.sessionReplay === 1, f = a.sessionIsActive ? void 0 : !1) : c = n.isRecording() ? !0 : void 0, {
      type: s,
      session: {
        id: i.id,
        type: "user",
        has_replay: c,
        sampled_for_replay: u,
        is_active: f
      }
    };
  }), e.register(1, ({ startTime: s }) => {
    const o = t.findTrackedSession(s);
    return o ? {
      session: {
        id: o.id
      }
    } : xe;
  });
}
function LC(e) {
  e.register(0, ({ eventType: t }) => ({
    type: t,
    connectivity: Pf()
  }));
}
function NC(e, t, n) {
  e.register(0, ({ eventType: r }) => {
    const s = t.source;
    return {
      type: r,
      _dd: {
        format_version: 2,
        drift: sf(),
        configuration: {
          session_sample_rate: ns(t.sessionSampleRate, 3),
          session_replay_sample_rate: ns(t.sessionReplaySampleRate, 3),
          profiling_sample_rate: ns(t.profilingSampleRate, 3)
        },
        browser_sdk_version: xt() ? "6.21.2" : void 0,
        sdk_name: n
      },
      application: {
        id: t.applicationId
      },
      date: oe(),
      source: s
    };
  }), e.register(1, () => ({
    application: { id: t.applicationId }
  }));
}
function MC(e, t) {
  e.register(1, () => t.isGranted() ? xe : mt);
}
const PC = qf, DC = [
  z.ACTION,
  z.ERROR,
  z.LONG_TASK,
  z.RESOURCE,
  z.VITAL
];
function UC(e) {
  return {
    addEvent: (t, n, r, s) => {
      DC.includes(n.type) && e.notify(12, {
        startTime: t,
        rawRumEvent: n,
        domainContext: r,
        duration: s
      });
    }
  };
}
function FC(e, t) {
  if (!t.metricsEnabled)
    return { stop: Y };
  const { unsubscribe: n } = e.subscribe(4, ({ initialViewMetrics: r }) => {
    !r.largestContentfulPaint || !r.navigationTimings || (As("Initial view metrics", {
      metrics: $C(r.largestContentfulPaint, r.navigationTimings)
    }), n());
  });
  return {
    stop: n
  };
}
function $C(e, t) {
  return {
    lcp: {
      value: e.value
    },
    navigation: {
      domComplete: t.domComplete,
      domContentLoaded: t.domContentLoaded,
      domInteractive: t.domInteractive,
      firstByte: t.firstByte,
      loadEvent: t.loadEvent
    }
  };
}
function BC(e, t, n, r, s, o, i, a, c) {
  const u = [], f = new yv(), l = PC();
  f.subscribe(13, (ye) => ni("rum", ye));
  const d = (ye) => {
    f.notify(14, { error: ye }), Kt("Error reported to customer", { "error.message": ye.message });
  }, p = Kf(e), h = p.subscribe((ye) => {
    f.notify(11, ye);
  });
  u.push(() => h.unsubscribe());
  const m = Xf("browser-rum-sdk", e, l, d, p, s);
  u.push(m.stop);
  const g = xt() ? Jk() : Yk(e, f, o);
  if (xt())
    tC(f);
  else {
    const ye = eC(e, f, d, p, g.expireObservable, s);
    u.push(() => ye.stop()), lC(m, f, ye.flushController.flushObservable);
  }
  const _ = hv(), y = sC(e, location), { observable: b, stop: E } = mv();
  u.push(E), NC(l, e, c);
  const S = mC(l, e), w = bv(f);
  u.push(() => w.stop());
  const T = rC(f, l, y, location);
  u.push(() => T.stop());
  const N = cC(f, l, e);
  OC(l, g, t, w), LC(l), MC(l, o);
  const k = _p(l, e, "rum", !0), v = bp(l, e, g, "rum"), M = yp(l, e, "rum"), { actionContexts: P, addAction: C, addEvent: I, stop: O } = VC(f, l, e, S, _, b, d);
  u.push(O);
  const { addTiming: R, startView: X, setViewName: F, setViewContext: ue, setViewContextProperty: x, getViewContext: A, stop: B } = Kk(f, l, e, location, _, b, y, t, w, r);
  u.push(B);
  const { stop: Te } = FC(f, m);
  u.push(Te);
  const { stop: Se } = qI(f, e, S);
  if (u.push(Se), e.trackLongTasks)
    if (hn(te.LONG_ANIMATION_FRAME)) {
      const { stop: ye } = vC(f, e);
      u.push(ye);
    } else
      IC(f, e);
  const { addError: L } = xI(f, e, a);
  a.unbuffer(), xv(f, e, g, v, M);
  const ge = AT(f, S, i), ne = gv(e.applicationId, g, w, P, T);
  return u.push(() => n.stop()), {
    addAction: C,
    addEvent: I,
    addError: L,
    addTiming: R,
    addFeatureFlagEvaluation: N.addFeatureFlagEvaluation,
    startView: X,
    setViewContext: ue,
    setViewContextProperty: x,
    getViewContext: A,
    setViewName: F,
    lifeCycle: f,
    viewHistory: w,
    session: g,
    stopSession: () => g.expire(),
    getInternalContext: ne.get,
    startDurationVital: ge.startDurationVital,
    stopDurationVital: ge.stopDurationVital,
    addDurationVital: ge.addDurationVital,
    addOperationStepVital: ge.addOperationStepVital,
    globalContext: k,
    userContext: v,
    accountContext: M,
    telemetry: m,
    stop: () => {
      u.forEach((ye) => ye());
    },
    hooks: l
  };
}
function VC(e, t, n, r, s, o, i) {
  const a = CI(e, t, s, o, n), c = UC(e), u = _C(t, n), f = TC(n, t);
  return kC(t), RC(n, e, t, i), {
    pageStateHistory: r,
    addAction: a.addAction,
    addEvent: c.addEvent,
    actionContexts: a.actionContexts,
    stop: () => {
      a.stop(), f.stop(), u.stop(), r.stop();
    }
  };
}
function WC(e, { session: t, viewContext: n, errorType: r }) {
  const s = t ? t.id : "no-session-id", o = [];
  r !== void 0 && o.push(`error-type=${r}`), n && (o.push(`seed=${n.id}`), o.push(`from=${n.startClocks.timeStamp}`));
  const i = HC(e), a = `/rum/replay/sessions/${s}`;
  return `${i}${a}?${o.join("&")}`;
}
function HC(e) {
  const t = e.site, n = e.subdomain || GC(e);
  return `https://${n ? `${n}.` : ""}${t}`;
}
function GC(e) {
  switch (e.site) {
    case An:
    case wE:
      return "app";
    case Mf:
      return "dd";
    default:
      return;
  }
}
const zC = 1e3;
let et;
function KC(e) {
  return mi(e).segments_count;
}
function jC(e) {
  mi(e).segments_count += 1;
}
function qC(e) {
  mi(e).records_count += 1;
}
function XC(e, t) {
  mi(e).segments_total_raw_size += t;
}
function YC(e) {
  return et?.get(e);
}
function mi(e) {
  et || (et = /* @__PURE__ */ new Map());
  let t;
  return et.has(e) ? t = et.get(e) : (t = {
    records_count: 0,
    segments_count: 0,
    segments_total_raw_size: 0
  }, et.set(e, t), et.size > zC && JC()), t;
}
function JC() {
  if (!et)
    return;
  const e = et.keys().next().value;
  e && et.delete(e);
}
function mh(e, t, n) {
  let r = 0, s = [], o, i = !0, a = 0;
  const c = [], { stop: u } = me(e, t, "message", ({ data: d }) => {
    if (d.type !== "wrote" || d.streamId !== n)
      return;
    const p = c[0];
    p && (p.id === d.id ? (c.shift(), r += d.additionalBytesCount, s.push(d.result), o = d.trailer, p.writeCallback ? p.writeCallback(d.result.byteLength) : p.finishCallback && p.finishCallback()) : p.id < d.id && u());
  });
  function f() {
    const d = s.length === 0 ? new Uint8Array(0) : sw(s.concat(o)), p = {
      rawBytesCount: r,
      output: d,
      outputBytesCount: d.byteLength,
      encoding: "deflate"
    };
    return r = 0, s = [], p;
  }
  function l() {
    i || (t.postMessage({
      action: "reset",
      streamId: n
    }), i = !0);
  }
  return {
    isAsync: !0,
    get isEmpty() {
      return i;
    },
    write(d, p) {
      t.postMessage({
        action: "write",
        id: a,
        data: d,
        streamId: n
      }), c.push({
        id: a,
        writeCallback: p,
        data: d
      }), i = !1, a += 1;
    },
    finish(d) {
      l(), c.length ? (c.forEach((p) => {
        delete p.writeCallback;
      }), c[c.length - 1].finishCallback = () => d(f())) : d(f());
    },
    finishSync() {
      l();
      const d = c.map((p) => p.data).join("");
      return c.length = 0, { ...f(), pendingData: d };
    },
    estimateEncodedBytesCount(d) {
      return d.length / 8;
    },
    stop() {
      u();
    }
  };
}
function $c({ configuredUrl: e, error: t, source: n, scriptType: r }) {
  if (W.error(`${n} failed to start: an error occurred while initializing the ${r}:`, t), t instanceof Event || t instanceof Error && ZC(t.message)) {
    let s;
    e ? s = `Please make sure the ${r} URL ${e} is correct and CSP is correctly configured.` : s = "Please make sure CSP is correctly configured.", W.error(`${s} See documentation at ${qo}/integrations/content_security_policy_logs/#use-csp-with-real-user-monitoring-and-session-replay`);
  } else r === "worker" && Ic(t);
}
function ZC(e) {
  return e.includes("Content Security Policy") || // Related to `require-trusted-types-for` CSP: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/require-trusted-types-for
  e.includes("requires 'TrustedScriptURL'");
}
const QC = 30 * Oe;
function gh(e) {
  return new Worker(e.workerUrl || URL.createObjectURL(new Blob(['(()=>{function t(t){const e=t.reduce((t,e)=>t+e.length,0),a=new Uint8Array(e);let n=0;for(const e of t)a.set(e,n),n+=e.length;return a}function e(t){for(var e=t.length;--e>=0;)t[e]=0}var a=new Uint8Array([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0]),n=new Uint8Array([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13]),r=new Uint8Array([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7]),i=new Uint8Array([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),s=Array(576);e(s);var h=Array(60);e(h);var l=Array(512);e(l);var _=Array(256);e(_);var o=Array(29);e(o);var d,u,f,c=Array(30);function p(t,e,a,n,r){this.static_tree=t,this.extra_bits=e,this.extra_base=a,this.elems=n,this.max_length=r,this.has_stree=t&&t.length}function g(t,e){this.dyn_tree=t,this.max_code=0,this.stat_desc=e}e(c);var v=function(t){return t<256?l[t]:l[256+(t>>>7)]},w=function(t,e){t.pending_buf[t.pending++]=255&e,t.pending_buf[t.pending++]=e>>>8&255},m=function(t,e,a){t.bi_valid>16-a?(t.bi_buf|=e<<t.bi_valid&65535,w(t,t.bi_buf),t.bi_buf=e>>16-t.bi_valid,t.bi_valid+=a-16):(t.bi_buf|=e<<t.bi_valid&65535,t.bi_valid+=a)},b=function(t,e,a){m(t,a[2*e],a[2*e+1])},y=function(t,e){var a=0;do{a|=1&t,t>>>=1,a<<=1}while(--e>0);return a>>>1},z=function(t,e,a){var n,r,i=Array(16),s=0;for(n=1;n<=15;n++)i[n]=s=s+a[n-1]<<1;for(r=0;r<=e;r++){var h=t[2*r+1];0!==h&&(t[2*r]=y(i[h]++,h))}},k=function(t){var e;for(e=0;e<286;e++)t.dyn_ltree[2*e]=0;for(e=0;e<30;e++)t.dyn_dtree[2*e]=0;for(e=0;e<19;e++)t.bl_tree[2*e]=0;t.dyn_ltree[512]=1,t.opt_len=t.static_len=0,t.last_lit=t.matches=0},x=function(t){t.bi_valid>8?w(t,t.bi_buf):t.bi_valid>0&&(t.pending_buf[t.pending++]=t.bi_buf),t.bi_buf=0,t.bi_valid=0},A=function(t,e,a,n){var r=2*e,i=2*a;return t[r]<t[i]||t[r]===t[i]&&n[e]<=n[a]},U=function(t,e,a){for(var n=t.heap[a],r=a<<1;r<=t.heap_len&&(r<t.heap_len&&A(e,t.heap[r+1],t.heap[r],t.depth)&&r++,!A(e,n,t.heap[r],t.depth));)t.heap[a]=t.heap[r],a=r,r<<=1;t.heap[a]=n},B=function(t,e,r){var i,s,h,l,d=0;if(0!==t.last_lit)do{i=t.pending_buf[t.d_buf+2*d]<<8|t.pending_buf[t.d_buf+2*d+1],s=t.pending_buf[t.l_buf+d],d++,0===i?b(t,s,e):(h=_[s],b(t,h+256+1,e),0!==(l=a[h])&&(s-=o[h],m(t,s,l)),i--,h=v(i),b(t,h,r),0!==(l=n[h])&&(i-=c[h],m(t,i,l)))}while(d<t.last_lit);b(t,256,e)},I=function(t,e){var a,n,r,i=e.dyn_tree,s=e.stat_desc.static_tree,h=e.stat_desc.has_stree,l=e.stat_desc.elems,_=-1;for(t.heap_len=0,t.heap_max=573,a=0;a<l;a++)0!==i[2*a]?(t.heap[++t.heap_len]=_=a,t.depth[a]=0):i[2*a+1]=0;for(;t.heap_len<2;)i[2*(r=t.heap[++t.heap_len]=_<2?++_:0)]=1,t.depth[r]=0,t.opt_len--,h&&(t.static_len-=s[2*r+1]);for(e.max_code=_,a=t.heap_len>>1;a>=1;a--)U(t,i,a);r=l;do{a=t.heap[1],t.heap[1]=t.heap[t.heap_len--],U(t,i,1),n=t.heap[1],t.heap[--t.heap_max]=a,t.heap[--t.heap_max]=n,i[2*r]=i[2*a]+i[2*n],t.depth[r]=(t.depth[a]>=t.depth[n]?t.depth[a]:t.depth[n])+1,i[2*a+1]=i[2*n+1]=r,t.heap[1]=r++,U(t,i,1)}while(t.heap_len>=2);t.heap[--t.heap_max]=t.heap[1],function(t,e){var a,n,r,i,s,h,l=e.dyn_tree,_=e.max_code,o=e.stat_desc.static_tree,d=e.stat_desc.has_stree,u=e.stat_desc.extra_bits,f=e.stat_desc.extra_base,c=e.stat_desc.max_length,p=0;for(i=0;i<=15;i++)t.bl_count[i]=0;for(l[2*t.heap[t.heap_max]+1]=0,a=t.heap_max+1;a<573;a++)(i=l[2*l[2*(n=t.heap[a])+1]+1]+1)>c&&(i=c,p++),l[2*n+1]=i,n>_||(t.bl_count[i]++,s=0,n>=f&&(s=u[n-f]),h=l[2*n],t.opt_len+=h*(i+s),d&&(t.static_len+=h*(o[2*n+1]+s)));if(0!==p){do{for(i=c-1;0===t.bl_count[i];)i--;t.bl_count[i]--,t.bl_count[i+1]+=2,t.bl_count[c]--,p-=2}while(p>0);for(i=c;0!==i;i--)for(n=t.bl_count[i];0!==n;)(r=t.heap[--a])>_||(l[2*r+1]!==i&&(t.opt_len+=(i-l[2*r+1])*l[2*r],l[2*r+1]=i),n--)}}(t,e),z(i,_,t.bl_count)},E=function(t,e,a){var n,r,i=-1,s=e[1],h=0,l=7,_=4;for(0===s&&(l=138,_=3),e[2*(a+1)+1]=65535,n=0;n<=a;n++)r=s,s=e[2*(n+1)+1],++h<l&&r===s||(h<_?t.bl_tree[2*r]+=h:0!==r?(r!==i&&t.bl_tree[2*r]++,t.bl_tree[32]++):h<=10?t.bl_tree[34]++:t.bl_tree[36]++,h=0,i=r,0===s?(l=138,_=3):r===s?(l=6,_=3):(l=7,_=4))},C=function(t,e,a){var n,r,i=-1,s=e[1],h=0,l=7,_=4;for(0===s&&(l=138,_=3),n=0;n<=a;n++)if(r=s,s=e[2*(n+1)+1],!(++h<l&&r===s)){if(h<_)do{b(t,r,t.bl_tree)}while(0!==--h);else 0!==r?(r!==i&&(b(t,r,t.bl_tree),h--),b(t,16,t.bl_tree),m(t,h-3,2)):h<=10?(b(t,17,t.bl_tree),m(t,h-3,3)):(b(t,18,t.bl_tree),m(t,h-11,7));h=0,i=r,0===s?(l=138,_=3):r===s?(l=6,_=3):(l=7,_=4)}},D=!1,M=function(t,e,a,n){m(t,0+(n?1:0),3),function(t,e,a){x(t),w(t,a),w(t,~a),t.pending_buf.set(t.window.subarray(e,e+a),t.pending),t.pending+=a}(t,e,a)},j=M,L=function(t,e,a,n){for(var r=65535&t,i=t>>>16&65535,s=0;0!==a;){a-=s=a>2e3?2e3:a;do{i=i+(r=r+e[n++]|0)|0}while(--s);r%=65521,i%=65521}return r|i<<16},S=new Uint32Array(function(){for(var t,e=[],a=0;a<256;a++){t=a;for(var n=0;n<8;n++)t=1&t?3988292384^t>>>1:t>>>1;e[a]=t}return e}()),T=function(t,e,a,n){var r=S,i=n+a;t^=-1;for(var s=n;s<i;s++)t=t>>>8^r[255&(t^e[s])];return-1^t},O={2:"need dictionary",1:"stream end",0:"","-1":"file error","-2":"stream error","-3":"data error","-4":"insufficient memory","-5":"buffer error","-6":"incompatible version"},q=j,F=function(t,e,a){return t.pending_buf[t.d_buf+2*t.last_lit]=e>>>8&255,t.pending_buf[t.d_buf+2*t.last_lit+1]=255&e,t.pending_buf[t.l_buf+t.last_lit]=255&a,t.last_lit++,0===e?t.dyn_ltree[2*a]++:(t.matches++,e--,t.dyn_ltree[2*(_[a]+256+1)]++,t.dyn_dtree[2*v(e)]++),t.last_lit===t.lit_bufsize-1},G=-2,H=258,J=262,K=103,N=113,P=666,Q=function(t,e){return t.msg=O[e],e},R=function(t){return(t<<1)-(t>4?9:0)},V=function(t){for(var e=t.length;--e>=0;)t[e]=0},W=function(t,e,a){return(e<<t.hash_shift^a)&t.hash_mask},X=function(t){var e=t.state,a=e.pending;a>t.avail_out&&(a=t.avail_out),0!==a&&(t.output.set(e.pending_buf.subarray(e.pending_out,e.pending_out+a),t.next_out),t.next_out+=a,e.pending_out+=a,t.total_out+=a,t.avail_out-=a,e.pending-=a,0===e.pending&&(e.pending_out=0))},Y=function(t,e){(function(t,e,a,n){var r,l,_=0;t.level>0?(2===t.strm.data_type&&(t.strm.data_type=function(t){var e,a=4093624447;for(e=0;e<=31;e++,a>>>=1)if(1&a&&0!==t.dyn_ltree[2*e])return 0;if(0!==t.dyn_ltree[18]||0!==t.dyn_ltree[20]||0!==t.dyn_ltree[26])return 1;for(e=32;e<256;e++)if(0!==t.dyn_ltree[2*e])return 1;return 0}(t)),I(t,t.l_desc),I(t,t.d_desc),_=function(t){var e;for(E(t,t.dyn_ltree,t.l_desc.max_code),E(t,t.dyn_dtree,t.d_desc.max_code),I(t,t.bl_desc),e=18;e>=3&&0===t.bl_tree[2*i[e]+1];e--);return t.opt_len+=3*(e+1)+5+5+4,e}(t),r=t.opt_len+3+7>>>3,(l=t.static_len+3+7>>>3)<=r&&(r=l)):r=l=a+5,a+4<=r&&-1!==e?M(t,e,a,n):4===t.strategy||l===r?(m(t,2+(n?1:0),3),B(t,s,h)):(m(t,4+(n?1:0),3),function(t,e,a,n){var r;for(m(t,e-257,5),m(t,a-1,5),m(t,n-4,4),r=0;r<n;r++)m(t,t.bl_tree[2*i[r]+1],3);C(t,t.dyn_ltree,e-1),C(t,t.dyn_dtree,a-1)}(t,t.l_desc.max_code+1,t.d_desc.max_code+1,_+1),B(t,t.dyn_ltree,t.dyn_dtree)),k(t),n&&x(t)})(t,t.block_start>=0?t.block_start:-1,t.strstart-t.block_start,e),t.block_start=t.strstart,X(t.strm)},Z=function(t,e){t.pending_buf[t.pending++]=e},$=function(t,e){t.pending_buf[t.pending++]=e>>>8&255,t.pending_buf[t.pending++]=255&e},tt=function(t,e,a,n){var r=t.avail_in;return r>n&&(r=n),0===r?0:(t.avail_in-=r,e.set(t.input.subarray(t.next_in,t.next_in+r),a),1===t.state.wrap?t.adler=L(t.adler,e,r,a):2===t.state.wrap&&(t.adler=T(t.adler,e,r,a)),t.next_in+=r,t.total_in+=r,r)},et=function(t,e){var a,n,r=t.max_chain_length,i=t.strstart,s=t.prev_length,h=t.nice_match,l=t.strstart>t.w_size-J?t.strstart-(t.w_size-J):0,_=t.window,o=t.w_mask,d=t.prev,u=t.strstart+H,f=_[i+s-1],c=_[i+s];t.prev_length>=t.good_match&&(r>>=2),h>t.lookahead&&(h=t.lookahead);do{if(_[(a=e)+s]===c&&_[a+s-1]===f&&_[a]===_[i]&&_[++a]===_[i+1]){i+=2,a++;do{}while(_[++i]===_[++a]&&_[++i]===_[++a]&&_[++i]===_[++a]&&_[++i]===_[++a]&&_[++i]===_[++a]&&_[++i]===_[++a]&&_[++i]===_[++a]&&_[++i]===_[++a]&&i<u);if(n=H-(u-i),i=u-H,n>s){if(t.match_start=e,s=n,n>=h)break;f=_[i+s-1],c=_[i+s]}}}while((e=d[e&o])>l&&0!==--r);return s<=t.lookahead?s:t.lookahead},at=function(t){var e,a,n,r,i,s=t.w_size;do{if(r=t.window_size-t.lookahead-t.strstart,t.strstart>=s+(s-J)){t.window.set(t.window.subarray(s,s+s),0),t.match_start-=s,t.strstart-=s,t.block_start-=s,e=a=t.hash_size;do{n=t.head[--e],t.head[e]=n>=s?n-s:0}while(--a);e=a=s;do{n=t.prev[--e],t.prev[e]=n>=s?n-s:0}while(--a);r+=s}if(0===t.strm.avail_in)break;if(a=tt(t.strm,t.window,t.strstart+t.lookahead,r),t.lookahead+=a,t.lookahead+t.insert>=3)for(i=t.strstart-t.insert,t.ins_h=t.window[i],t.ins_h=W(t,t.ins_h,t.window[i+1]);t.insert&&(t.ins_h=W(t,t.ins_h,t.window[i+3-1]),t.prev[i&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=i,i++,t.insert--,!(t.lookahead+t.insert<3)););}while(t.lookahead<J&&0!==t.strm.avail_in)},nt=function(t,e){for(var a,n;;){if(t.lookahead<J){if(at(t),t.lookahead<J&&0===e)return 1;if(0===t.lookahead)break}if(a=0,t.lookahead>=3&&(t.ins_h=W(t,t.ins_h,t.window[t.strstart+3-1]),a=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart),0!==a&&t.strstart-a<=t.w_size-J&&(t.match_length=et(t,a)),t.match_length>=3)if(n=F(t,t.strstart-t.match_start,t.match_length-3),t.lookahead-=t.match_length,t.match_length<=t.max_lazy_match&&t.lookahead>=3){t.match_length--;do{t.strstart++,t.ins_h=W(t,t.ins_h,t.window[t.strstart+3-1]),a=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart}while(0!==--t.match_length);t.strstart++}else t.strstart+=t.match_length,t.match_length=0,t.ins_h=t.window[t.strstart],t.ins_h=W(t,t.ins_h,t.window[t.strstart+1]);else n=F(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++;if(n&&(Y(t,!1),0===t.strm.avail_out))return 1}return t.insert=t.strstart<2?t.strstart:2,4===e?(Y(t,!0),0===t.strm.avail_out?3:4):t.last_lit&&(Y(t,!1),0===t.strm.avail_out)?1:2},rt=function(t,e){for(var a,n,r;;){if(t.lookahead<J){if(at(t),t.lookahead<J&&0===e)return 1;if(0===t.lookahead)break}if(a=0,t.lookahead>=3&&(t.ins_h=W(t,t.ins_h,t.window[t.strstart+3-1]),a=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart),t.prev_length=t.match_length,t.prev_match=t.match_start,t.match_length=2,0!==a&&t.prev_length<t.max_lazy_match&&t.strstart-a<=t.w_size-J&&(t.match_length=et(t,a),t.match_length<=5&&(1===t.strategy||3===t.match_length&&t.strstart-t.match_start>4096)&&(t.match_length=2)),t.prev_length>=3&&t.match_length<=t.prev_length){r=t.strstart+t.lookahead-3,n=F(t,t.strstart-1-t.prev_match,t.prev_length-3),t.lookahead-=t.prev_length-1,t.prev_length-=2;do{++t.strstart<=r&&(t.ins_h=W(t,t.ins_h,t.window[t.strstart+3-1]),a=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart)}while(0!==--t.prev_length);if(t.match_available=0,t.match_length=2,t.strstart++,n&&(Y(t,!1),0===t.strm.avail_out))return 1}else if(t.match_available){if((n=F(t,0,t.window[t.strstart-1]))&&Y(t,!1),t.strstart++,t.lookahead--,0===t.strm.avail_out)return 1}else t.match_available=1,t.strstart++,t.lookahead--}return t.match_available&&(n=F(t,0,t.window[t.strstart-1]),t.match_available=0),t.insert=t.strstart<2?t.strstart:2,4===e?(Y(t,!0),0===t.strm.avail_out?3:4):t.last_lit&&(Y(t,!1),0===t.strm.avail_out)?1:2};function it(t,e,a,n,r){this.good_length=t,this.max_lazy=e,this.nice_length=a,this.max_chain=n,this.func=r}var st=[new it(0,0,0,0,function(t,e){var a=65535;for(a>t.pending_buf_size-5&&(a=t.pending_buf_size-5);;){if(t.lookahead<=1){if(at(t),0===t.lookahead&&0===e)return 1;if(0===t.lookahead)break}t.strstart+=t.lookahead,t.lookahead=0;var n=t.block_start+a;if((0===t.strstart||t.strstart>=n)&&(t.lookahead=t.strstart-n,t.strstart=n,Y(t,!1),0===t.strm.avail_out))return 1;if(t.strstart-t.block_start>=t.w_size-J&&(Y(t,!1),0===t.strm.avail_out))return 1}return t.insert=0,4===e?(Y(t,!0),0===t.strm.avail_out?3:4):(t.strstart>t.block_start&&(Y(t,!1),t.strm.avail_out),1)}),new it(4,4,8,4,nt),new it(4,5,16,8,nt),new it(4,6,32,32,nt),new it(4,4,16,16,rt),new it(8,16,32,32,rt),new it(8,16,128,128,rt),new it(8,32,128,256,rt),new it(32,128,258,1024,rt),new it(32,258,258,4096,rt)];function ht(){this.strm=null,this.status=0,this.pending_buf=null,this.pending_buf_size=0,this.pending_out=0,this.pending=0,this.wrap=0,this.gzhead=null,this.gzindex=0,this.method=8,this.last_flush=-1,this.w_size=0,this.w_bits=0,this.w_mask=0,this.window=null,this.window_size=0,this.prev=null,this.head=null,this.ins_h=0,this.hash_size=0,this.hash_bits=0,this.hash_mask=0,this.hash_shift=0,this.block_start=0,this.match_length=0,this.prev_match=0,this.match_available=0,this.strstart=0,this.match_start=0,this.lookahead=0,this.prev_length=0,this.max_chain_length=0,this.max_lazy_match=0,this.level=0,this.strategy=0,this.good_match=0,this.nice_match=0,this.dyn_ltree=new Uint16Array(1146),this.dyn_dtree=new Uint16Array(122),this.bl_tree=new Uint16Array(78),V(this.dyn_ltree),V(this.dyn_dtree),V(this.bl_tree),this.l_desc=null,this.d_desc=null,this.bl_desc=null,this.bl_count=new Uint16Array(16),this.heap=new Uint16Array(573),V(this.heap),this.heap_len=0,this.heap_max=0,this.depth=new Uint16Array(573),V(this.depth),this.l_buf=0,this.lit_bufsize=0,this.last_lit=0,this.d_buf=0,this.opt_len=0,this.static_len=0,this.matches=0,this.insert=0,this.bi_buf=0,this.bi_valid=0}for(var lt=function(t){var e,i=function(t){if(!t||!t.state)return Q(t,G);t.total_in=t.total_out=0,t.data_type=2;var e=t.state;return e.pending=0,e.pending_out=0,e.wrap<0&&(e.wrap=-e.wrap),e.status=e.wrap?42:N,t.adler=2===e.wrap?0:1,e.last_flush=0,function(t){D||(function(){var t,e,i,g,v,w=Array(16);for(i=0,g=0;g<28;g++)for(o[g]=i,t=0;t<1<<a[g];t++)_[i++]=g;for(_[i-1]=g,v=0,g=0;g<16;g++)for(c[g]=v,t=0;t<1<<n[g];t++)l[v++]=g;for(v>>=7;g<30;g++)for(c[g]=v<<7,t=0;t<1<<n[g]-7;t++)l[256+v++]=g;for(e=0;e<=15;e++)w[e]=0;for(t=0;t<=143;)s[2*t+1]=8,t++,w[8]++;for(;t<=255;)s[2*t+1]=9,t++,w[9]++;for(;t<=279;)s[2*t+1]=7,t++,w[7]++;for(;t<=287;)s[2*t+1]=8,t++,w[8]++;for(z(s,287,w),t=0;t<30;t++)h[2*t+1]=5,h[2*t]=y(t,5);d=new p(s,a,257,286,15),u=new p(h,n,0,30,15),f=new p([],r,0,19,7)}(),D=!0),t.l_desc=new g(t.dyn_ltree,d),t.d_desc=new g(t.dyn_dtree,u),t.bl_desc=new g(t.bl_tree,f),t.bi_buf=0,t.bi_valid=0,k(t)}(e),0}(t);return 0===i&&((e=t.state).window_size=2*e.w_size,V(e.head),e.max_lazy_match=st[e.level].max_lazy,e.good_match=st[e.level].good_length,e.nice_match=st[e.level].nice_length,e.max_chain_length=st[e.level].max_chain,e.strstart=0,e.block_start=0,e.lookahead=0,e.insert=0,e.match_length=e.prev_length=2,e.match_available=0,e.ins_h=0),i},_t=function(t,e){var a,n;if(!t||!t.state||e>5||e<0)return t?Q(t,G):G;var r=t.state;if(!t.output||!t.input&&0!==t.avail_in||r.status===P&&4!==e)return Q(t,0===t.avail_out?-5:G);r.strm=t;var i=r.last_flush;if(r.last_flush=e,42===r.status)if(2===r.wrap)t.adler=0,Z(r,31),Z(r,139),Z(r,8),r.gzhead?(Z(r,(r.gzhead.text?1:0)+(r.gzhead.hcrc?2:0)+(r.gzhead.extra?4:0)+(r.gzhead.name?8:0)+(r.gzhead.comment?16:0)),Z(r,255&r.gzhead.time),Z(r,r.gzhead.time>>8&255),Z(r,r.gzhead.time>>16&255),Z(r,r.gzhead.time>>24&255),Z(r,9===r.level?2:r.strategy>=2||r.level<2?4:0),Z(r,255&r.gzhead.os),r.gzhead.extra&&r.gzhead.extra.length&&(Z(r,255&r.gzhead.extra.length),Z(r,r.gzhead.extra.length>>8&255)),r.gzhead.hcrc&&(t.adler=T(t.adler,r.pending_buf,r.pending,0)),r.gzindex=0,r.status=69):(Z(r,0),Z(r,0),Z(r,0),Z(r,0),Z(r,0),Z(r,9===r.level?2:r.strategy>=2||r.level<2?4:0),Z(r,3),r.status=N);else{var h=8+(r.w_bits-8<<4)<<8;h|=(r.strategy>=2||r.level<2?0:r.level<6?1:6===r.level?2:3)<<6,0!==r.strstart&&(h|=32),h+=31-h%31,r.status=N,$(r,h),0!==r.strstart&&($(r,t.adler>>>16),$(r,65535&t.adler)),t.adler=1}if(69===r.status)if(r.gzhead.extra){for(a=r.pending;r.gzindex<(65535&r.gzhead.extra.length)&&(r.pending!==r.pending_buf_size||(r.gzhead.hcrc&&r.pending>a&&(t.adler=T(t.adler,r.pending_buf,r.pending-a,a)),X(t),a=r.pending,r.pending!==r.pending_buf_size));)Z(r,255&r.gzhead.extra[r.gzindex]),r.gzindex++;r.gzhead.hcrc&&r.pending>a&&(t.adler=T(t.adler,r.pending_buf,r.pending-a,a)),r.gzindex===r.gzhead.extra.length&&(r.gzindex=0,r.status=73)}else r.status=73;if(73===r.status)if(r.gzhead.name){a=r.pending;do{if(r.pending===r.pending_buf_size&&(r.gzhead.hcrc&&r.pending>a&&(t.adler=T(t.adler,r.pending_buf,r.pending-a,a)),X(t),a=r.pending,r.pending===r.pending_buf_size)){n=1;break}n=r.gzindex<r.gzhead.name.length?255&r.gzhead.name.charCodeAt(r.gzindex++):0,Z(r,n)}while(0!==n);r.gzhead.hcrc&&r.pending>a&&(t.adler=T(t.adler,r.pending_buf,r.pending-a,a)),0===n&&(r.gzindex=0,r.status=91)}else r.status=91;if(91===r.status)if(r.gzhead.comment){a=r.pending;do{if(r.pending===r.pending_buf_size&&(r.gzhead.hcrc&&r.pending>a&&(t.adler=T(t.adler,r.pending_buf,r.pending-a,a)),X(t),a=r.pending,r.pending===r.pending_buf_size)){n=1;break}n=r.gzindex<r.gzhead.comment.length?255&r.gzhead.comment.charCodeAt(r.gzindex++):0,Z(r,n)}while(0!==n);r.gzhead.hcrc&&r.pending>a&&(t.adler=T(t.adler,r.pending_buf,r.pending-a,a)),0===n&&(r.status=K)}else r.status=K;if(r.status===K&&(r.gzhead.hcrc?(r.pending+2>r.pending_buf_size&&X(t),r.pending+2<=r.pending_buf_size&&(Z(r,255&t.adler),Z(r,t.adler>>8&255),t.adler=0,r.status=N)):r.status=N),0!==r.pending){if(X(t),0===t.avail_out)return r.last_flush=-1,0}else if(0===t.avail_in&&R(e)<=R(i)&&4!==e)return Q(t,-5);if(r.status===P&&0!==t.avail_in)return Q(t,-5);if(0!==t.avail_in||0!==r.lookahead||0!==e&&r.status!==P){var l=2===r.strategy?function(t,e){for(var a;;){if(0===t.lookahead&&(at(t),0===t.lookahead)){if(0===e)return 1;break}if(t.match_length=0,a=F(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++,a&&(Y(t,!1),0===t.strm.avail_out))return 1}return t.insert=0,4===e?(Y(t,!0),0===t.strm.avail_out?3:4):t.last_lit&&(Y(t,!1),0===t.strm.avail_out)?1:2}(r,e):3===r.strategy?function(t,e){for(var a,n,r,i,s=t.window;;){if(t.lookahead<=H){if(at(t),t.lookahead<=H&&0===e)return 1;if(0===t.lookahead)break}if(t.match_length=0,t.lookahead>=3&&t.strstart>0&&(n=s[r=t.strstart-1])===s[++r]&&n===s[++r]&&n===s[++r]){i=t.strstart+H;do{}while(n===s[++r]&&n===s[++r]&&n===s[++r]&&n===s[++r]&&n===s[++r]&&n===s[++r]&&n===s[++r]&&n===s[++r]&&r<i);t.match_length=H-(i-r),t.match_length>t.lookahead&&(t.match_length=t.lookahead)}if(t.match_length>=3?(a=F(t,1,t.match_length-3),t.lookahead-=t.match_length,t.strstart+=t.match_length,t.match_length=0):(a=F(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++),a&&(Y(t,!1),0===t.strm.avail_out))return 1}return t.insert=0,4===e?(Y(t,!0),0===t.strm.avail_out?3:4):t.last_lit&&(Y(t,!1),0===t.strm.avail_out)?1:2}(r,e):st[r.level].func(r,e);if(3!==l&&4!==l||(r.status=P),1===l||3===l)return 0===t.avail_out&&(r.last_flush=-1),0;if(2===l&&(1===e?function(t){m(t,2,3),b(t,256,s),function(t){16===t.bi_valid?(w(t,t.bi_buf),t.bi_buf=0,t.bi_valid=0):t.bi_valid>=8&&(t.pending_buf[t.pending++]=255&t.bi_buf,t.bi_buf>>=8,t.bi_valid-=8)}(t)}(r):5!==e&&(q(r,0,0,!1),3===e&&(V(r.head),0===r.lookahead&&(r.strstart=0,r.block_start=0,r.insert=0))),X(t),0===t.avail_out))return r.last_flush=-1,0}return 4!==e?0:r.wrap<=0?1:(2===r.wrap?(Z(r,255&t.adler),Z(r,t.adler>>8&255),Z(r,t.adler>>16&255),Z(r,t.adler>>24&255),Z(r,255&t.total_in),Z(r,t.total_in>>8&255),Z(r,t.total_in>>16&255),Z(r,t.total_in>>24&255)):($(r,t.adler>>>16),$(r,65535&t.adler)),X(t),r.wrap>0&&(r.wrap=-r.wrap),0!==r.pending?0:1)},ot=function(t){if(!t||!t.state)return G;var e=t.state.status;return 42!==e&&69!==e&&73!==e&&91!==e&&e!==K&&e!==N&&e!==P?Q(t,G):(t.state=null,e===N?Q(t,-3):0)},dt=new Uint8Array(256),ut=0;ut<256;ut++)dt[ut]=ut>=252?6:ut>=248?5:ut>=240?4:ut>=224?3:ut>=192?2:1;dt[254]=dt[254]=1;var ft=function(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg="",this.state=null,this.data_type=2,this.adler=0},ct=Object.prototype.toString;function pt(){this.options={level:-1,method:8,chunkSize:16384,windowBits:15,memLevel:8,strategy:0};var t=this.options;t.raw&&t.windowBits>0?t.windowBits=-t.windowBits:t.gzip&&t.windowBits>0&&t.windowBits<16&&(t.windowBits+=16),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new ft,this.strm.avail_out=0;var e,a,n=function(t,e,a,n,r,i){if(!t)return G;var s=1;if(-1===e&&(e=6),n<0?(s=0,n=-n):n>15&&(s=2,n-=16),r<1||r>9||8!==a||n<8||n>15||e<0||e>9||i<0||i>4)return Q(t,G);8===n&&(n=9);var h=new ht;return t.state=h,h.strm=t,h.wrap=s,h.gzhead=null,h.w_bits=n,h.w_size=1<<h.w_bits,h.w_mask=h.w_size-1,h.hash_bits=r+7,h.hash_size=1<<h.hash_bits,h.hash_mask=h.hash_size-1,h.hash_shift=~~((h.hash_bits+3-1)/3),h.window=new Uint8Array(2*h.w_size),h.head=new Uint16Array(h.hash_size),h.prev=new Uint16Array(h.w_size),h.lit_bufsize=1<<r+6,h.pending_buf_size=4*h.lit_bufsize,h.pending_buf=new Uint8Array(h.pending_buf_size),h.d_buf=1*h.lit_bufsize,h.l_buf=3*h.lit_bufsize,h.level=e,h.strategy=i,h.method=a,lt(t)}(this.strm,t.level,t.method,t.windowBits,t.memLevel,t.strategy);if(0!==n)throw Error(O[n]);if(t.header&&(e=this.strm,a=t.header,e&&e.state&&(2!==e.state.wrap||(e.state.gzhead=a))),t.dictionary){var r;if(r="[object ArrayBuffer]"===ct.call(t.dictionary)?new Uint8Array(t.dictionary):t.dictionary,0!==(n=function(t,e){var a=e.length;if(!t||!t.state)return G;var n=t.state,r=n.wrap;if(2===r||1===r&&42!==n.status||n.lookahead)return G;if(1===r&&(t.adler=L(t.adler,e,a,0)),n.wrap=0,a>=n.w_size){0===r&&(V(n.head),n.strstart=0,n.block_start=0,n.insert=0);var i=new Uint8Array(n.w_size);i.set(e.subarray(a-n.w_size,a),0),e=i,a=n.w_size}var s=t.avail_in,h=t.next_in,l=t.input;for(t.avail_in=a,t.next_in=0,t.input=e,at(n);n.lookahead>=3;){var _=n.strstart,o=n.lookahead-2;do{n.ins_h=W(n,n.ins_h,n.window[_+3-1]),n.prev[_&n.w_mask]=n.head[n.ins_h],n.head[n.ins_h]=_,_++}while(--o);n.strstart=_,n.lookahead=2,at(n)}return n.strstart+=n.lookahead,n.block_start=n.strstart,n.insert=n.lookahead,n.lookahead=0,n.match_length=n.prev_length=2,n.match_available=0,t.next_in=h,t.input=l,t.avail_in=s,n.wrap=r,0}(this.strm,r)))throw Error(O[n]);this._dict_set=!0}}function gt(t,e,a){try{t.postMessage({type:"errored",error:e,streamId:a})}catch(n){t.postMessage({type:"errored",error:e+"",streamId:a})}}function vt(t){const e=t.strm.adler;return new Uint8Array([3,0,e>>>24&255,e>>>16&255,e>>>8&255,255&e])}pt.prototype.push=function(t,e){var a,n,r=this.strm,i=this.options.chunkSize;if(this.ended)return!1;for(n=e===~~e?e:!0===e?4:0,"[object ArrayBuffer]"===ct.call(t)?r.input=new Uint8Array(t):r.input=t,r.next_in=0,r.avail_in=r.input.length;;)if(0===r.avail_out&&(r.output=new Uint8Array(i),r.next_out=0,r.avail_out=i),(2===n||3===n)&&r.avail_out<=6)this.onData(r.output.subarray(0,r.next_out)),r.avail_out=0;else{if(1===(a=_t(r,n)))return r.next_out>0&&this.onData(r.output.subarray(0,r.next_out)),a=ot(this.strm),this.onEnd(a),this.ended=!0,0===a;if(0!==r.avail_out){if(n>0&&r.next_out>0)this.onData(r.output.subarray(0,r.next_out)),r.avail_out=0;else if(0===r.avail_in)break}else this.onData(r.output)}return!0},pt.prototype.onData=function(t){this.chunks.push(t)},pt.prototype.onEnd=function(t){0===t&&(this.result=function(t){for(var e=0,a=0,n=t.length;a<n;a++)e+=t[a].length;for(var r=new Uint8Array(e),i=0,s=0,h=t.length;i<h;i++){var l=t[i];r.set(l,s),s+=l.length}return r}(this.chunks)),this.chunks=[],this.err=t,this.msg=this.strm.msg},function(e=self){try{const a=new Map;e.addEventListener("message",n=>{try{const r=function(e,a){switch(a.action){case"init":return{type:"initialized",version:"6.21.2"};case"write":{let n=e.get(a.streamId);n||(n=new pt,e.set(a.streamId,n));const r=n.chunks.length,i=function(t){if("function"==typeof TextEncoder&&TextEncoder.prototype.encode)return(new TextEncoder).encode(t);let e,a,n,r,i,s=t.length,h=0;for(r=0;r<s;r++)a=t.charCodeAt(r),55296==(64512&a)&&r+1<s&&(n=t.charCodeAt(r+1),56320==(64512&n)&&(a=65536+(a-55296<<10)+(n-56320),r++)),h+=a<128?1:a<2048?2:a<65536?3:4;for(e=new Uint8Array(h),i=0,r=0;i<h;r++)a=t.charCodeAt(r),55296==(64512&a)&&r+1<s&&(n=t.charCodeAt(r+1),56320==(64512&n)&&(a=65536+(a-55296<<10)+(n-56320),r++)),a<128?e[i++]=a:a<2048?(e[i++]=192|a>>>6,e[i++]=128|63&a):a<65536?(e[i++]=224|a>>>12,e[i++]=128|a>>>6&63,e[i++]=128|63&a):(e[i++]=240|a>>>18,e[i++]=128|a>>>12&63,e[i++]=128|a>>>6&63,e[i++]=128|63&a);return e}(a.data);return n.push(i,2),{type:"wrote",id:a.id,streamId:a.streamId,result:t(n.chunks.slice(r)),trailer:vt(n),additionalBytesCount:i.length}}case"reset":e.delete(a.streamId)}}(a,n.data);r&&e.postMessage(r)}catch(t){gt(e,t,n.data&&"streamId"in n.data?n.data.streamId:void 0)}})}catch(t){gt(e,t)}}()})();'])));
}
let Ie = {
  status: 0
  /* DeflateWorkerStatus.Nil */
};
function yh(e, t, n, r = gh) {
  switch (Ie.status === 0 && e0(e, t, r), Ie.status) {
    case 1:
      return Ie.initializationFailureCallbacks.push(n), Ie.worker;
    case 3:
      return Ie.worker;
  }
}
function xl() {
  return Ie.status;
}
function e0(e, t, n = gh) {
  try {
    const r = n(e), { stop: s } = me(e, r, "error", (a) => {
      ji(e, t, a);
    }), { stop: o } = me(e, r, "message", ({ data: a }) => {
      a.type === "errored" ? ji(e, t, a.error, a.streamId) : a.type === "initialized" && n0(a.version);
    });
    r.postMessage({ action: "init" }), Re(() => t0(t), QC), Ie = { status: 1, worker: r, stop: () => {
      s(), o();
    }, initializationFailureCallbacks: [] };
  } catch (r) {
    ji(e, t, r);
  }
}
function t0(e) {
  Ie.status === 1 && (W.error(`${e} failed to start: a timeout occurred while initializing the Worker`), Ie.initializationFailureCallbacks.forEach((t) => t()), Ie = {
    status: 2
    /* DeflateWorkerStatus.Error */
  });
}
function n0(e) {
  Ie.status === 1 && (Ie = { status: 3, worker: Ie.worker, stop: Ie.stop, version: e });
}
function ji(e, t, n, r) {
  Ie.status === 1 || Ie.status === 0 ? ($c({
    configuredUrl: e.workerUrl,
    error: n,
    source: t,
    scriptType: "worker"
  }), Ie.status === 1 && Ie.initializationFailureCallbacks.forEach((s) => s()), Ie = {
    status: 2
    /* DeflateWorkerStatus.Error */
  }) : Ic(n, {
    worker_version: Ie.status === 3 && Ie.version,
    stream_id: r
  });
}
function _h() {
  return (
    // Array.from is a bit less supported by browsers than CSSSupportsRule, but has higher chances
    // to be polyfilled. Test for both to be more confident. We could add more things if we find out
    // this test is not sufficient.
    typeof Array.from == "function" && typeof CSSSupportsRule == "function" && typeof URL.createObjectURL == "function" && "forEach" in NodeList.prototype
  );
}
function r0(e, t, n, r) {
  const s = t.findTrackedSession(), o = s0(s, r), i = n.findView();
  return WC(e, {
    viewContext: i,
    errorType: o,
    session: s
  });
}
function s0(e, t) {
  if (!_h())
    return "browser-not-supported";
  if (!e)
    return "rum-not-tracked";
  if (e.sessionReplay === 0)
    return "incorrect-session-plan";
  if (!t)
    return "replay-not-started";
}
function o0(e, t) {
  if (!e.metricsEnabled)
    return { stop: Y };
  let n, r, s;
  const { unsubscribe: o } = t.subscribe((i) => {
    switch (i.type) {
      case "start":
        n = { forced: i.forced, timestamp: oe() }, r = void 0, s = void 0;
        break;
      case "document-ready":
        n && (r = _e(n.timestamp, oe()));
        break;
      case "recorder-settled":
        n && (s = _e(n.timestamp, oe()));
        break;
      case "aborted":
      case "deflate-encoder-load-failed":
      case "recorder-load-failed":
      case "succeeded":
        o(), n && As("Recorder init metrics", {
          metrics: i0(n.forced, s, _e(n.timestamp, oe()), i.type, r)
        });
        break;
    }
  });
  return { stop: o };
}
function i0(e, t, n, r, s) {
  return {
    forced: e,
    loadRecorderModuleDuration: t,
    recorderInitDuration: n,
    result: r,
    waitForDocReadyDuration: s
  };
}
function a0(e, t, n, r, s, o, i) {
  let a = 0, c;
  t.subscribe(9, () => {
    (a === 2 || a === 3) && (d(), a = 1);
  }), t.subscribe(10, () => {
    a === 1 && l();
  });
  const u = new Z();
  o0(i, u);
  const f = async (p) => {
    u.notify({ type: "start", forced: p });
    const [h] = await Promise.all([
      Ol(u, { type: "recorder-settled" }, s()),
      Ol(u, { type: "document-ready" }, wS(e, "interactive"))
    ]);
    if (a !== 2) {
      u.notify({ type: "aborted" });
      return;
    }
    if (!h) {
      a = 0, u.notify({ type: "recorder-load-failed" });
      return;
    }
    const m = o();
    if (!m) {
      a = 0, u.notify({ type: "deflate-encoder-load-failed" });
      return;
    }
    ({ stop: c } = h(t, e, n, r, m, i)), a = 3, u.notify({ type: "succeeded" });
  };
  function l(p) {
    const h = n.findTrackedSession();
    if (c0(h, p)) {
      a = 1;
      return;
    }
    if (u0(a))
      return;
    a = 2;
    const m = l0(h, p) || !1;
    f(m).catch(dt), m && n.setForcedReplay();
  }
  function d() {
    a === 3 && c?.(), a = 0;
  }
  return {
    start: l,
    stop: d,
    getSessionReplayLink() {
      return r0(
        e,
        n,
        r,
        a !== 0
        /* RecorderStatus.Stopped */
      );
    },
    isRecording: () => a === 3
  };
}
function c0(e, t) {
  return !e || e.sessionReplay === 0 && (!t || !t.force);
}
function u0(e) {
  return e === 2 || e === 3;
}
function l0(e, t) {
  return t && t.force && e.sessionReplay === 0;
}
async function Ol(e, t, n) {
  try {
    return await n;
  } finally {
    e.notify(t);
  }
}
function d0() {
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
      getSessionReplayLink: Y
    },
    shouldStartImmediately(t) {
      return e === 1 || e === 0 && !t.startSessionReplayRecordingManually;
    }
  };
}
function f0(e, t) {
  if (xt() && !zf(
    "records"
    /* BridgeCapability.RECORDS */
  ) || !_h())
    return {
      start: Y,
      stop: Y,
      getReplayStats: () => {
      },
      onRumStart: Y,
      isRecording: () => !1,
      getSessionReplayLink: () => {
      }
    };
  let { strategy: n, shouldStartImmediately: r } = d0();
  return {
    start: (o) => n.start(o),
    stop: () => n.stop(),
    getSessionReplayLink: () => n.getSessionReplayLink(),
    onRumStart: s,
    isRecording: () => (
      // The worker is started optimistically, meaning we could have started to record but its
      // initialization fails a bit later. This could happen when:
      // * the worker URL (blob or plain URL) is blocked by CSP in Firefox only (Chromium and Safari
      // throw an exception when instantiating the worker, and IE doesn't care about CSP)
      // * the browser fails to load the worker in case the workerUrl is used
      // * an unexpected error occurs in the Worker before initialization, ex:
      //   * a runtime exception collected by monitor()
      //   * a syntax error notified by the browser via an error event
      // * the worker is unresponsive for some reason and timeouts
      //
      // It is not expected to happen often. Nonetheless, the "replayable" status on RUM events is
      // an important part of the Datadog App:
      // * If we have a false positive (we set has_replay: true even if no replay data is present),
      // we might display broken links to the Session Replay player.
      // * If we have a false negative (we don't set has_replay: true even if replay data is
      // available), it is less noticeable because no link will be displayed.
      //
      // Thus, it is better to have false negative, so let's make sure the worker is correctly
      // initialized before advertizing that we are recording.
      //
      // In the future, when the compression worker will also be used for RUM data, this will be
      // less important since no RUM event will be sent when the worker fails to initialize.
      xl() === 3 && n.isRecording()
    ),
    getReplayStats: (o) => xl() === 3 ? YC(o) : void 0
  };
  function s(o, i, a, c, u, f) {
    let l;
    function d() {
      return l || (u ?? (u = yh(i, "Datadog Session Replay", () => {
        n.stop();
      }, t)), u && (l = mh(
        i,
        u,
        1
        /* DeflateEncoderStreamId.REPLAY */
      ))), l;
    }
    n = a0(i, o, a, c, e, d, f), r(i) && n.start();
  }
}
async function p0(e = h0) {
  try {
    return await e();
  } catch (t) {
    $c({
      error: t,
      source: "Recorder",
      scriptType: "module"
    });
  }
}
async function h0() {
  return (await Promise.resolve().then(() => fL)).startRecording;
}
function m0() {
  return Xe().Profiler !== void 0;
}
const g0 = (e) => {
  let t = {
    status: "starting"
  };
  return e.register(0, ({ eventType: n }) => n !== z.VIEW && n !== z.LONG_TASK ? xe : {
    type: n,
    _dd: {
      profiling: t
    }
  }), {
    get: () => t,
    set: (n) => {
      t = n;
    }
  };
};
async function y0(e = _0) {
  try {
    return await e();
  } catch (t) {
    $c({
      error: t,
      source: "Profiler",
      scriptType: "module"
    });
  }
}
async function _0() {
  return (await Promise.resolve().then(() => CL)).createRumProfiler;
}
function b0() {
  let e;
  function t(n, r, s, o, i) {
    const a = o.findTrackedSession();
    if (!a || !Cp(a.id, s.profilingSampleRate))
      return;
    const c = g0(r);
    if (!m0()) {
      c.set({
        status: "error",
        error_reason: "not-supported-by-browser"
      });
      return;
    }
    y0().then((u) => {
      if (!u) {
        Kt("[DD_RUM] Failed to lazy load the RUM Profiler"), c.set({ status: "error", error_reason: "failed-to-lazy-load" });
        return;
      }
      e = u(s, n, o, c), e.start(i.findView());
    }).catch(dt);
  }
  return {
    onRumStart: t,
    stop: () => {
      e?.stop().catch(dt);
    }
  };
}
const w0 = f0(p0), E0 = b0(), Bc = fv(BC, w0, E0, {
  startDeflateWorker: yh,
  createDeflateEncoder: mh,
  sdkName: "rum"
});
np(Xe(), "DD_RUM", Bc);
function S0(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Zr = { exports: {} }, T0 = Zr.exports, Ll;
function v0() {
  return Ll || (Ll = 1, (function(e, t) {
    (function(n, r) {
      var s = "", o = "?", i = "function", a = "undefined", c = "object", u = "string", f = "major", l = "model", d = "name", p = "type", h = "vendor", m = "version", g = "architecture", _ = "console", y = "mobile", b = "tablet", E = "smarttv", S = "wearable", w = "embedded", T = 500, N = "Amazon", k = "Apple", v = "ASUS", M = "BlackBerry", P = "Browser", C = "Chrome", I = "Edge", O = "Firefox", R = "Google", X = "Huawei", F = "LG", ue = "Microsoft", x = "Motorola", A = "Opera", B = "Samsung", Te = "Sharp", Se = "Sony", L = "Xiaomi", ge = "Zebra", ne = "Facebook", ye = "Chromium OS", Ps = "Mac OS", wm = function(ee, le) {
        var K = {};
        for (var he in ee)
          le[he] && le[he].length % 2 === 0 ? K[he] = le[he].concat(ee[he]) : K[he] = ee[he];
        return K;
      }, Ds = function(ee) {
        for (var le = {}, K = 0; K < ee.length; K++)
          le[ee[K].toUpperCase()] = ee[K];
        return le;
      }, Zc = function(ee, le) {
        return typeof ee === u ? $r(le).indexOf($r(ee)) !== -1 : !1;
      }, $r = function(ee) {
        return ee.toLowerCase();
      }, Em = function(ee) {
        return typeof ee === u ? ee.replace(/[^\d\.]/g, s).split(".")[0] : r;
      }, _i = function(ee, le) {
        if (typeof ee === u)
          return ee = ee.replace(/^\s\s*/, s), typeof le === a ? ee : ee.substring(0, T);
      }, Br = function(ee, le) {
        for (var K = 0, he, Lt, _t, ie, H, bt; K < le.length && !H; ) {
          var wi = le[K], tu = le[K + 1];
          for (he = Lt = 0; he < wi.length && !H && wi[he]; )
            if (H = wi[he++].exec(ee), H)
              for (_t = 0; _t < tu.length; _t++)
                bt = H[++Lt], ie = tu[_t], typeof ie === c && ie.length > 0 ? ie.length === 2 ? typeof ie[1] == i ? this[ie[0]] = ie[1].call(this, bt) : this[ie[0]] = ie[1] : ie.length === 3 ? typeof ie[1] === i && !(ie[1].exec && ie[1].test) ? this[ie[0]] = bt ? ie[1].call(this, bt, ie[2]) : r : this[ie[0]] = bt ? bt.replace(ie[1], ie[2]) : r : ie.length === 4 && (this[ie[0]] = bt ? ie[3].call(this, bt.replace(ie[1], ie[2])) : r) : this[ie] = bt || r;
          K += 2;
        }
      }, bi = function(ee, le) {
        for (var K in le)
          if (typeof le[K] === c && le[K].length > 0) {
            for (var he = 0; he < le[K].length; he++)
              if (Zc(le[K][he], ee))
                return K === o ? r : K;
          } else if (Zc(le[K], ee))
            return K === o ? r : K;
        return ee;
      }, Sm = {
        "1.0": "/8",
        "1.2": "/1",
        "1.3": "/3",
        "2.0": "/412",
        "2.0.2": "/416",
        "2.0.3": "/417",
        "2.0.4": "/419",
        "?": "/"
      }, Qc = {
        ME: "4.90",
        "NT 3.11": "NT3.51",
        "NT 4.0": "NT4.0",
        2e3: "NT 5.0",
        XP: ["NT 5.1", "NT 5.2"],
        Vista: "NT 6.0",
        7: "NT 6.1",
        8: "NT 6.2",
        "8.1": "NT 6.3",
        10: ["NT 6.4", "NT 10.0"],
        RT: "ARM"
      }, eu = {
        browser: [
          [
            /\b(?:crmo|crios)\/([\w\.]+)/i
            // Chrome for Android/iOS
          ],
          [m, [d, "Chrome"]],
          [
            /edg(?:e|ios|a)?\/([\w\.]+)/i
            // Microsoft Edge
          ],
          [m, [d, "Edge"]],
          [
            // Presto based
            /(opera mini)\/([-\w\.]+)/i,
            // Opera Mini
            /(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i,
            // Opera Mobi/Tablet
            /(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i
            // Opera
          ],
          [d, m],
          [
            /opios[\/ ]+([\w\.]+)/i
            // Opera mini on iphone >= 8.0
          ],
          [m, [d, A + " Mini"]],
          [
            /\bop(?:rg)?x\/([\w\.]+)/i
            // Opera GX
          ],
          [m, [d, A + " GX"]],
          [
            /\bopr\/([\w\.]+)/i
            // Opera Webkit
          ],
          [m, [d, A]],
          [
            // Mixed
            /\bb[ai]*d(?:uhd|[ub]*[aekoprswx]{5,6})[\/ ]?([\w\.]+)/i
            // Baidu
          ],
          [m, [d, "Baidu"]],
          [
            /(kindle)\/([\w\.]+)/i,
            // Kindle
            /(lunascape|maxthon|netfront|jasmine|blazer)[\/ ]?([\w\.]*)/i,
            // Lunascape/Maxthon/Netfront/Jasmine/Blazer
            // Trident based
            /(avant|iemobile|slim)\s?(?:browser)?[\/ ]?([\w\.]*)/i,
            // Avant/IEMobile/SlimBrowser
            /(?:ms|\()(ie) ([\w\.]+)/i,
            // Internet Explorer
            // Webkit/KHTML based                                               // Flock/RockMelt/Midori/Epiphany/Silk/Skyfire/Bolt/Iron/Iridium/PhantomJS/Bowser/QupZilla/Falkon
            /(flock|rockmelt|midori|epiphany|silk|skyfire|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon|rekonq|puffin|brave|whale(?!.+naver)|qqbrowserlite|qq|duckduckgo)\/([-\w\.]+)/i,
            // Rekonq/Puffin/Brave/Whale/QQBrowserLite/QQ, aka ShouQ
            /(heytap|ovi)browser\/([\d\.]+)/i,
            // Heytap/Ovi
            /(weibo)__([\d\.]+)/i
            // Weibo
          ],
          [d, m],
          [
            /\bddg\/([\w\.]+)/i
            // DuckDuckGo
          ],
          [m, [d, "DuckDuckGo"]],
          [
            /(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i
            // UCBrowser
          ],
          [m, [d, "UC" + P]],
          [
            /microm.+\bqbcore\/([\w\.]+)/i,
            // WeChat Desktop for Windows Built-in Browser
            /\bqbcore\/([\w\.]+).+microm/i,
            /micromessenger\/([\w\.]+)/i
            // WeChat
          ],
          [m, [d, "WeChat"]],
          [
            /konqueror\/([\w\.]+)/i
            // Konqueror
          ],
          [m, [d, "Konqueror"]],
          [
            /trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i
            // IE11
          ],
          [m, [d, "IE"]],
          [
            /ya(?:search)?browser\/([\w\.]+)/i
            // Yandex
          ],
          [m, [d, "Yandex"]],
          [
            /slbrowser\/([\w\.]+)/i
            // Smart Lenovo Browser
          ],
          [m, [d, "Smart Lenovo " + P]],
          [
            /(avast|avg)\/([\w\.]+)/i
            // Avast/AVG Secure Browser
          ],
          [[d, /(.+)/, "$1 Secure " + P], m],
          [
            /\bfocus\/([\w\.]+)/i
            // Firefox Focus
          ],
          [m, [d, O + " Focus"]],
          [
            /\bopt\/([\w\.]+)/i
            // Opera Touch
          ],
          [m, [d, A + " Touch"]],
          [
            /coc_coc\w+\/([\w\.]+)/i
            // Coc Coc Browser
          ],
          [m, [d, "Coc Coc"]],
          [
            /dolfin\/([\w\.]+)/i
            // Dolphin
          ],
          [m, [d, "Dolphin"]],
          [
            /coast\/([\w\.]+)/i
            // Opera Coast
          ],
          [m, [d, A + " Coast"]],
          [
            /miuibrowser\/([\w\.]+)/i
            // MIUI Browser
          ],
          [m, [d, "MIUI " + P]],
          [
            /fxios\/([-\w\.]+)/i
            // Firefox for iOS
          ],
          [m, [d, O]],
          [
            /\bqihu|(qi?ho?o?|360)browser/i
            // 360
          ],
          [[d, "360 " + P]],
          [
            /(oculus|sailfish|huawei|vivo)browser\/([\w\.]+)/i
          ],
          [[d, /(.+)/, "$1 " + P], m],
          [
            // Oculus/Sailfish/HuaweiBrowser/VivoBrowser
            /samsungbrowser\/([\w\.]+)/i
            // Samsung Internet
          ],
          [m, [d, B + " Internet"]],
          [
            /(comodo_dragon)\/([\w\.]+)/i
            // Comodo Dragon
          ],
          [[d, /_/g, " "], m],
          [
            /metasr[\/ ]?([\d\.]+)/i
            // Sogou Explorer
          ],
          [m, [d, "Sogou Explorer"]],
          [
            /(sogou)mo\w+\/([\d\.]+)/i
            // Sogou Mobile
          ],
          [[d, "Sogou Mobile"], m],
          [
            /(electron)\/([\w\.]+) safari/i,
            // Electron-based App
            /(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i,
            // Tesla
            /m?(qqbrowser|2345Explorer)[\/ ]?([\w\.]+)/i
            // QQBrowser/2345 Browser
          ],
          [d, m],
          [
            /(lbbrowser)/i,
            // LieBao Browser
            /\[(linkedin)app\]/i
            // LinkedIn App for iOS & Android
          ],
          [d],
          [
            // WebView
            /((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i
            // Facebook App for iOS & Android
          ],
          [[d, ne], m],
          [
            /(Klarna)\/([\w\.]+)/i,
            // Klarna Shopping Browser for iOS & Android
            /(kakao(?:talk|story))[\/ ]([\w\.]+)/i,
            // Kakao App
            /(naver)\(.*?(\d+\.[\w\.]+).*\)/i,
            // Naver InApp
            /safari (line)\/([\w\.]+)/i,
            // Line App for iOS
            /\b(line)\/([\w\.]+)\/iab/i,
            // Line App for Android
            /(alipay)client\/([\w\.]+)/i,
            // Alipay
            /(twitter)(?:and| f.+e\/([\w\.]+))/i,
            // Twitter
            /(chromium|instagram|snapchat)[\/ ]([-\w\.]+)/i
            // Chromium/Instagram/Snapchat
          ],
          [d, m],
          [
            /\bgsa\/([\w\.]+) .*safari\//i
            // Google Search Appliance on iOS
          ],
          [m, [d, "GSA"]],
          [
            /musical_ly(?:.+app_?version\/|_)([\w\.]+)/i
            // TikTok
          ],
          [m, [d, "TikTok"]],
          [
            /headlesschrome(?:\/([\w\.]+)| )/i
            // Chrome Headless
          ],
          [m, [d, C + " Headless"]],
          [
            / wv\).+(chrome)\/([\w\.]+)/i
            // Chrome WebView
          ],
          [[d, C + " WebView"], m],
          [
            /droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i
            // Android Browser
          ],
          [m, [d, "Android " + P]],
          [
            /(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i
            // Chrome/OmniWeb/Arora/Tizen/Nokia
          ],
          [d, m],
          [
            /version\/([\w\.\,]+) .*mobile\/\w+ (safari)/i
            // Mobile Safari
          ],
          [m, [d, "Mobile Safari"]],
          [
            /version\/([\w(\.|\,)]+) .*(mobile ?safari|safari)/i
            // Safari & Safari Mobile
          ],
          [m, d],
          [
            /webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i
            // Safari < 3.0
          ],
          [d, [m, bi, Sm]],
          [
            /(webkit|khtml)\/([\w\.]+)/i
          ],
          [d, m],
          [
            // Gecko based
            /(navigator|netscape\d?)\/([-\w\.]+)/i
            // Netscape
          ],
          [[d, "Netscape"], m],
          [
            /mobile vr; rv:([\w\.]+)\).+firefox/i
            // Firefox Reality
          ],
          [m, [d, O + " Reality"]],
          [
            /ekiohf.+(flow)\/([\w\.]+)/i,
            // Flow
            /(swiftfox)/i,
            // Swiftfox
            /(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror|klar)[\/ ]?([\w\.\+]+)/i,
            // IceDragon/Iceweasel/Camino/Chimera/Fennec/Maemo/Minimo/Conkeror/Klar
            /(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([-\w\.]+)$/i,
            // Firefox/SeaMonkey/K-Meleon/IceCat/IceApe/Firebird/Phoenix
            /(firefox)\/([\w\.]+)/i,
            // Other Firefox-based
            /(mozilla)\/([\w\.]+) .+rv\:.+gecko\/\d+/i,
            // Mozilla
            // Other
            /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir|obigo|mosaic|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i,
            // Polaris/Lynx/Dillo/iCab/Doris/Amaya/w3m/NetSurf/Sleipnir/Obigo/Mosaic/Go/ICE/UP.Browser
            /(links) \(([\w\.]+)/i,
            // Links
            /panasonic;(viera)/i
            // Panasonic Viera
          ],
          [d, m],
          [
            /(cobalt)\/([\w\.]+)/i
            // Cobalt
          ],
          [d, [m, /master.|lts./, ""]]
        ],
        cpu: [
          [
            /(?:(amd|x(?:(?:86|64)[-_])?|wow|win)64)[;\)]/i
            // AMD64 (x64)
          ],
          [[g, "amd64"]],
          [
            /(ia32(?=;))/i
            // IA32 (quicktime)
          ],
          [[g, $r]],
          [
            /((?:i[346]|x)86)[;\)]/i
            // IA32 (x86)
          ],
          [[g, "ia32"]],
          [
            /\b(aarch64|arm(v?8e?l?|_?64))\b/i
            // ARM64
          ],
          [[g, "arm64"]],
          [
            /\b(arm(?:v[67])?ht?n?[fl]p?)\b/i
            // ARMHF
          ],
          [[g, "armhf"]],
          [
            // PocketPC mistakenly identified as PowerPC
            /windows (ce|mobile); ppc;/i
          ],
          [[g, "arm"]],
          [
            /((?:ppc|powerpc)(?:64)?)(?: mac|;|\))/i
            // PowerPC
          ],
          [[g, /ower/, s, $r]],
          [
            /(sun4\w)[;\)]/i
            // SPARC
          ],
          [[g, "sparc"]],
          [
            /((?:avr32|ia64(?=;))|68k(?=\))|\barm(?=v(?:[1-7]|[5-7]1)l?|;|eabi)|(?=atmel )avr|(?:irix|mips|sparc)(?:64)?\b|pa-risc)/i
            // IA64, 68K, ARM/64, AVR/32, IRIX/64, MIPS/64, SPARC/64, PA-RISC
          ],
          [[g, $r]]
        ],
        device: [
          [
            //////////////////////////
            // MOBILES & TABLETS
            /////////////////////////
            // Samsung
            /\b(sch-i[89]0\d|shw-m380s|sm-[ptx]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i
          ],
          [l, [h, B], [p, b]],
          [
            /\b((?:s[cgp]h|gt|sm)-\w+|sc[g-]?[\d]+a?|galaxy nexus)/i,
            /samsung[- ]([-\w]+)/i,
            /sec-(sgh\w+)/i
          ],
          [l, [h, B], [p, y]],
          [
            // Apple
            /(?:\/|\()(ip(?:hone|od)[\w, ]*)(?:\/|;)/i
            // iPod/iPhone
          ],
          [l, [h, k], [p, y]],
          [
            /\((ipad);[-\w\),; ]+apple/i,
            // iPad
            /applecoremedia\/[\w\.]+ \((ipad)/i,
            /\b(ipad)\d\d?,\d\d?[;\]].+ios/i
          ],
          [l, [h, k], [p, b]],
          [
            /(macintosh);/i
          ],
          [l, [h, k]],
          [
            // Sharp
            /\b(sh-?[altvz]?\d\d[a-ekm]?)/i
          ],
          [l, [h, Te], [p, y]],
          [
            // Huawei
            /\b((?:ag[rs][23]?|bah2?|sht?|btv)-a?[lw]\d{2})\b(?!.+d\/s)/i
          ],
          [l, [h, X], [p, b]],
          [
            /(?:huawei|honor)([-\w ]+)[;\)]/i,
            /\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i
          ],
          [l, [h, X], [p, y]],
          [
            // Xiaomi
            /\b(poco[\w ]+|m2\d{3}j\d\d[a-z]{2})(?: bui|\))/i,
            // Xiaomi POCO
            /\b; (\w+) build\/hm\1/i,
            // Xiaomi Hongmi 'numeric' models
            /\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i,
            // Xiaomi Hongmi
            /\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i,
            // Xiaomi Redmi
            /oid[^\)]+; (m?[12][0-389][01]\w{3,6}[c-y])( bui|; wv|\))/i,
            // Xiaomi Redmi 'numeric' models
            /\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max|cc)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite)?)(?: bui|\))/i
            // Xiaomi Mi
          ],
          [[l, /_/g, " "], [h, L], [p, y]],
          [
            /oid[^\)]+; (2\d{4}(283|rpbf)[cgl])( bui|\))/i,
            // Redmi Pad
            /\b(mi[-_ ]?(?:pad)(?:[\w_ ]+))(?: bui|\))/i
            // Mi Pad tablets
          ],
          [[l, /_/g, " "], [h, L], [p, b]],
          [
            // OPPO
            /; (\w+) bui.+ oppo/i,
            /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i
          ],
          [l, [h, "OPPO"], [p, y]],
          [
            /\b(opd2\d{3}a?) bui/i
          ],
          [l, [h, "OPPO"], [p, b]],
          [
            // Vivo
            /vivo (\w+)(?: bui|\))/i,
            /\b(v[12]\d{3}\w?[at])(?: bui|;)/i
          ],
          [l, [h, "Vivo"], [p, y]],
          [
            // Realme
            /\b(rmx[1-3]\d{3})(?: bui|;|\))/i
          ],
          [l, [h, "Realme"], [p, y]],
          [
            // Motorola
            /\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i,
            /\bmot(?:orola)?[- ](\w*)/i,
            /((?:moto[\w\(\) ]+|xt\d{3,4}|nexus 6)(?= bui|\)))/i
          ],
          [l, [h, x], [p, y]],
          [
            /\b(mz60\d|xoom[2 ]{0,2}) build\//i
          ],
          [l, [h, x], [p, b]],
          [
            // LG
            /((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i
          ],
          [l, [h, F], [p, b]],
          [
            /(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i,
            /\blg[-e;\/ ]+((?!browser|netcast|android tv)\w+)/i,
            /\blg-?([\d\w]+) bui/i
          ],
          [l, [h, F], [p, y]],
          [
            // Lenovo
            /(ideatab[-\w ]+)/i,
            /lenovo ?(s[56]000[-\w]+|tab(?:[\w ]+)|yt[-\d\w]{6}|tb[-\d\w]{6})/i
          ],
          [l, [h, "Lenovo"], [p, b]],
          [
            // Nokia
            /(?:maemo|nokia).*(n900|lumia \d+)/i,
            /nokia[-_ ]?([-\w\.]*)/i
          ],
          [[l, /_/g, " "], [h, "Nokia"], [p, y]],
          [
            // Google
            /(pixel c)\b/i
            // Google Pixel C
          ],
          [l, [h, R], [p, b]],
          [
            /droid.+; (pixel[\daxl ]{0,6})(?: bui|\))/i
            // Google Pixel
          ],
          [l, [h, R], [p, y]],
          [
            // Sony
            /droid.+ (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-a\w[4-7][12])(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i
          ],
          [l, [h, Se], [p, y]],
          [
            /sony tablet [ps]/i,
            /\b(?:sony)?sgp\w+(?: bui|\))/i
          ],
          [[l, "Xperia Tablet"], [h, Se], [p, b]],
          [
            // OnePlus
            / (kb2005|in20[12]5|be20[12][59])\b/i,
            /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i
          ],
          [l, [h, "OnePlus"], [p, y]],
          [
            // Amazon
            /(alexa)webm/i,
            /(kf[a-z]{2}wi|aeo[c-r]{2})( bui|\))/i,
            // Kindle Fire without Silk / Echo Show
            /(kf[a-z]+)( bui|\)).+silk\//i
            // Kindle Fire HD
          ],
          [l, [h, N], [p, b]],
          [
            /((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i
            // Fire Phone
          ],
          [[l, /(.+)/g, "Fire Phone $1"], [h, N], [p, y]],
          [
            // BlackBerry
            /(playbook);[-\w\),; ]+(rim)/i
            // BlackBerry PlayBook
          ],
          [l, h, [p, b]],
          [
            /\b((?:bb[a-f]|st[hv])100-\d)/i,
            /\(bb10; (\w+)/i
            // BlackBerry 10
          ],
          [l, [h, M], [p, y]],
          [
            // Asus
            /(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i
          ],
          [l, [h, v], [p, b]],
          [
            / (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i
          ],
          [l, [h, v], [p, y]],
          [
            // HTC
            /(nexus 9)/i
            // HTC Nexus 9
          ],
          [l, [h, "HTC"], [p, b]],
          [
            /(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i,
            // HTC
            // ZTE
            /(zte)[- ]([\w ]+?)(?: bui|\/|\))/i,
            /(alcatel|geeksphone|nexian|panasonic(?!(?:;|\.))|sony(?!-bra))[-_ ]?([-\w]*)/i
            // Alcatel/GeeksPhone/Nexian/Panasonic/Sony
          ],
          [h, [l, /_/g, " "], [p, y]],
          [
            // Acer
            /droid.+; ([ab][1-7]-?[0178a]\d\d?)/i
          ],
          [l, [h, "Acer"], [p, b]],
          [
            // Meizu
            /droid.+; (m[1-5] note) bui/i,
            /\bmz-([-\w]{2,})/i
          ],
          [l, [h, "Meizu"], [p, y]],
          [
            // Ulefone
            /; ((?:power )?armor(?:[\w ]{0,8}))(?: bui|\))/i
          ],
          [l, [h, "Ulefone"], [p, y]],
          [
            // MIXED
            /(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron|infinix|tecno)[-_ ]?([-\w]*)/i,
            // BlackBerry/BenQ/Palm/Sony-Ericsson/Acer/Asus/Dell/Meizu/Motorola/Polytron
            /(hp) ([\w ]+\w)/i,
            // HP iPAQ
            /(asus)-?(\w+)/i,
            // Asus
            /(microsoft); (lumia[\w ]+)/i,
            // Microsoft Lumia
            /(lenovo)[-_ ]?([-\w]+)/i,
            // Lenovo
            /(jolla)/i,
            // Jolla
            /(oppo) ?([\w ]+) bui/i
            // OPPO
          ],
          [h, l, [p, y]],
          [
            /(kobo)\s(ereader|touch)/i,
            // Kobo
            /(archos) (gamepad2?)/i,
            // Archos
            /(hp).+(touchpad(?!.+tablet)|tablet)/i,
            // HP TouchPad
            /(kindle)\/([\w\.]+)/i,
            // Kindle
            /(nook)[\w ]+build\/(\w+)/i,
            // Nook
            /(dell) (strea[kpr\d ]*[\dko])/i,
            // Dell Streak
            /(le[- ]+pan)[- ]+(\w{1,9}) bui/i,
            // Le Pan Tablets
            /(trinity)[- ]*(t\d{3}) bui/i,
            // Trinity Tablets
            /(gigaset)[- ]+(q\w{1,9}) bui/i,
            // Gigaset Tablets
            /(vodafone) ([\w ]+)(?:\)| bui)/i
            // Vodafone
          ],
          [h, l, [p, b]],
          [
            /(surface duo)/i
            // Surface Duo
          ],
          [l, [h, ue], [p, b]],
          [
            /droid [\d\.]+; (fp\du?)(?: b|\))/i
            // Fairphone
          ],
          [l, [h, "Fairphone"], [p, y]],
          [
            /(u304aa)/i
            // AT&T
          ],
          [l, [h, "AT&T"], [p, y]],
          [
            /\bsie-(\w*)/i
            // Siemens
          ],
          [l, [h, "Siemens"], [p, y]],
          [
            /\b(rct\w+) b/i
            // RCA Tablets
          ],
          [l, [h, "RCA"], [p, b]],
          [
            /\b(venue[\d ]{2,7}) b/i
            // Dell Venue Tablets
          ],
          [l, [h, "Dell"], [p, b]],
          [
            /\b(q(?:mv|ta)\w+) b/i
            // Verizon Tablet
          ],
          [l, [h, "Verizon"], [p, b]],
          [
            /\b(?:barnes[& ]+noble |bn[rt])([\w\+ ]*) b/i
            // Barnes & Noble Tablet
          ],
          [l, [h, "Barnes & Noble"], [p, b]],
          [
            /\b(tm\d{3}\w+) b/i
          ],
          [l, [h, "NuVision"], [p, b]],
          [
            /\b(k88) b/i
            // ZTE K Series Tablet
          ],
          [l, [h, "ZTE"], [p, b]],
          [
            /\b(nx\d{3}j) b/i
            // ZTE Nubia
          ],
          [l, [h, "ZTE"], [p, y]],
          [
            /\b(gen\d{3}) b.+49h/i
            // Swiss GEN Mobile
          ],
          [l, [h, "Swiss"], [p, y]],
          [
            /\b(zur\d{3}) b/i
            // Swiss ZUR Tablet
          ],
          [l, [h, "Swiss"], [p, b]],
          [
            /\b((zeki)?tb.*\b) b/i
            // Zeki Tablets
          ],
          [l, [h, "Zeki"], [p, b]],
          [
            /\b([yr]\d{2}) b/i,
            /\b(dragon[- ]+touch |dt)(\w{5}) b/i
            // Dragon Touch Tablet
          ],
          [[h, "Dragon Touch"], l, [p, b]],
          [
            /\b(ns-?\w{0,9}) b/i
            // Insignia Tablets
          ],
          [l, [h, "Insignia"], [p, b]],
          [
            /\b((nxa|next)-?\w{0,9}) b/i
            // NextBook Tablets
          ],
          [l, [h, "NextBook"], [p, b]],
          [
            /\b(xtreme\_)?(v(1[045]|2[015]|[3469]0|7[05])) b/i
            // Voice Xtreme Phones
          ],
          [[h, "Voice"], l, [p, y]],
          [
            /\b(lvtel\-)?(v1[12]) b/i
            // LvTel Phones
          ],
          [[h, "LvTel"], l, [p, y]],
          [
            /\b(ph-1) /i
            // Essential PH-1
          ],
          [l, [h, "Essential"], [p, y]],
          [
            /\b(v(100md|700na|7011|917g).*\b) b/i
            // Envizen Tablets
          ],
          [l, [h, "Envizen"], [p, b]],
          [
            /\b(trio[-\w\. ]+) b/i
            // MachSpeed Tablets
          ],
          [l, [h, "MachSpeed"], [p, b]],
          [
            /\btu_(1491) b/i
            // Rotor Tablets
          ],
          [l, [h, "Rotor"], [p, b]],
          [
            /(shield[\w ]+) b/i
            // Nvidia Shield Tablets
          ],
          [l, [h, "Nvidia"], [p, b]],
          [
            /(sprint) (\w+)/i
            // Sprint Phones
          ],
          [h, l, [p, y]],
          [
            /(kin\.[onetw]{3})/i
            // Microsoft Kin
          ],
          [[l, /\./g, " "], [h, ue], [p, y]],
          [
            /droid.+; (cc6666?|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i
            // Zebra
          ],
          [l, [h, ge], [p, b]],
          [
            /droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i
          ],
          [l, [h, ge], [p, y]],
          [
            ///////////////////
            // SMARTTVS
            ///////////////////
            /smart-tv.+(samsung)/i
            // Samsung
          ],
          [h, [p, E]],
          [
            /hbbtv.+maple;(\d+)/i
          ],
          [[l, /^/, "SmartTV"], [h, B], [p, E]],
          [
            /(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i
            // LG SmartTV
          ],
          [[h, F], [p, E]],
          [
            /(apple) ?tv/i
            // Apple TV
          ],
          [h, [l, k + " TV"], [p, E]],
          [
            /crkey/i
            // Google Chromecast
          ],
          [[l, C + "cast"], [h, R], [p, E]],
          [
            /droid.+aft(\w+)( bui|\))/i
            // Fire TV
          ],
          [l, [h, N], [p, E]],
          [
            /\(dtv[\);].+(aquos)/i,
            /(aquos-tv[\w ]+)\)/i
            // Sharp
          ],
          [l, [h, Te], [p, E]],
          [
            /(bravia[\w ]+)( bui|\))/i
            // Sony
          ],
          [l, [h, Se], [p, E]],
          [
            /(mitv-\w{5}) bui/i
            // Xiaomi
          ],
          [l, [h, L], [p, E]],
          [
            /Hbbtv.*(technisat) (.*);/i
            // TechniSAT
          ],
          [h, l, [p, E]],
          [
            /\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i,
            // Roku
            /hbbtv\/\d+\.\d+\.\d+ +\([\w\+ ]*; *([\w\d][^;]*);([^;]*)/i
            // HbbTV devices
          ],
          [[h, _i], [l, _i], [p, E]],
          [
            /\b(android tv|smart[- ]?tv|opera tv|tv; rv:)\b/i
            // SmartTV from Unidentified Vendors
          ],
          [[p, E]],
          [
            ///////////////////
            // CONSOLES
            ///////////////////
            /(ouya)/i,
            // Ouya
            /(nintendo) ([wids3utch]+)/i
            // Nintendo
          ],
          [h, l, [p, _]],
          [
            /droid.+; (shield) bui/i
            // Nvidia
          ],
          [l, [h, "Nvidia"], [p, _]],
          [
            /(playstation [345portablevi]+)/i
            // Playstation
          ],
          [l, [h, Se], [p, _]],
          [
            /\b(xbox(?: one)?(?!; xbox))[\); ]/i
            // Microsoft Xbox
          ],
          [l, [h, ue], [p, _]],
          [
            ///////////////////
            // WEARABLES
            ///////////////////
            /((pebble))app/i
            // Pebble
          ],
          [h, l, [p, S]],
          [
            /(watch)(?: ?os[,\/]|\d,\d\/)[\d\.]+/i
            // Apple Watch
          ],
          [l, [h, k], [p, S]],
          [
            /droid.+; (glass) \d/i
            // Google Glass
          ],
          [l, [h, R], [p, S]],
          [
            /droid.+; (wt63?0{2,3})\)/i
          ],
          [l, [h, ge], [p, S]],
          [
            /(quest( \d| pro)?)/i
            // Oculus Quest
          ],
          [l, [h, ne], [p, S]],
          [
            ///////////////////
            // EMBEDDED
            ///////////////////
            /(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i
            // Tesla
          ],
          [h, [p, w]],
          [
            /(aeobc)\b/i
            // Echo Dot
          ],
          [l, [h, N], [p, w]],
          [
            ////////////////////
            // MIXED (GENERIC)
            ///////////////////
            /droid .+?; ([^;]+?)(?: bui|; wv\)|\) applew).+? mobile safari/i
            // Android Phones from Unidentified Vendors
          ],
          [l, [p, y]],
          [
            /droid .+?; ([^;]+?)(?: bui|\) applew).+?(?! mobile) safari/i
            // Android Tablets from Unidentified Vendors
          ],
          [l, [p, b]],
          [
            /\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i
            // Unidentifiable Tablet
          ],
          [[p, b]],
          [
            /(phone|mobile(?:[;\/]| [ \w\/\.]*safari)|pda(?=.+windows ce))/i
            // Unidentifiable Mobile
          ],
          [[p, y]],
          [
            /(android[-\w\. ]{0,9});.+buil/i
            // Generic Android Device
          ],
          [l, [h, "Generic"]]
        ],
        engine: [
          [
            /windows.+ edge\/([\w\.]+)/i
            // EdgeHTML
          ],
          [m, [d, I + "HTML"]],
          [
            /webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i
            // Blink
          ],
          [m, [d, "Blink"]],
          [
            /(presto)\/([\w\.]+)/i,
            // Presto
            /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i,
            // WebKit/Trident/NetFront/NetSurf/Amaya/Lynx/w3m/Goanna
            /ekioh(flow)\/([\w\.]+)/i,
            // Flow
            /(khtml|tasman|links)[\/ ]\(?([\w\.]+)/i,
            // KHTML/Tasman/Links
            /(icab)[\/ ]([23]\.[\d\.]+)/i,
            // iCab
            /\b(libweb)/i
          ],
          [d, m],
          [
            /rv\:([\w\.]{1,9})\b.+(gecko)/i
            // Gecko
          ],
          [m, d]
        ],
        os: [
          [
            // Windows
            /microsoft (windows) (vista|xp)/i
            // Windows (iTunes)
          ],
          [d, m],
          [
            /(windows (?:phone(?: os)?|mobile))[\/ ]?([\d\.\w ]*)/i
            // Windows Phone
          ],
          [d, [m, bi, Qc]],
          [
            /windows nt 6\.2; (arm)/i,
            // Windows RT
            /windows[\/ ]?([ntce\d\. ]+\w)(?!.+xbox)/i,
            /(?:win(?=3|9|n)|win 9x )([nt\d\.]+)/i
          ],
          [[m, bi, Qc], [d, "Windows"]],
          [
            // iOS/macOS
            /ip[honead]{2,4}\b(?:.*os ([\w]+) like mac|; opera)/i,
            // iOS
            /(?:ios;fbsv\/|iphone.+ios[\/ ])([\d\.]+)/i,
            /cfnetwork\/.+darwin/i
          ],
          [[m, /_/g, "."], [d, "iOS"]],
          [
            /(mac os x) ?([\w\. ]*)/i,
            /(macintosh|mac_powerpc\b)(?!.+haiku)/i
            // Mac OS
          ],
          [[d, Ps], [m, /_/g, "."]],
          [
            // Mobile OSes
            /droid ([\w\.]+)\b.+(android[- ]x86|harmonyos)/i
            // Android-x86/HarmonyOS
          ],
          [m, d],
          [
            // Android/WebOS/QNX/Bada/RIM/Maemo/MeeGo/Sailfish OS
            /(android|webos|qnx|bada|rim tablet os|maemo|meego|sailfish)[-\/ ]?([\w\.]*)/i,
            /(blackberry)\w*\/([\w\.]*)/i,
            // Blackberry
            /(tizen|kaios)[\/ ]([\w\.]+)/i,
            // Tizen/KaiOS
            /\((series40);/i
            // Series 40
          ],
          [d, m],
          [
            /\(bb(10);/i
            // BlackBerry 10
          ],
          [m, [d, M]],
          [
            /(?:symbian ?os|symbos|s60(?=;)|series60)[-\/ ]?([\w\.]*)/i
            // Symbian
          ],
          [m, [d, "Symbian"]],
          [
            /mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i
            // Firefox OS
          ],
          [m, [d, O + " OS"]],
          [
            /web0s;.+rt(tv)/i,
            /\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i
            // WebOS
          ],
          [m, [d, "webOS"]],
          [
            /watch(?: ?os[,\/]|\d,\d\/)([\d\.]+)/i
            // watchOS
          ],
          [m, [d, "watchOS"]],
          [
            // Google Chromecast
            /crkey\/([\d\.]+)/i
            // Google Chromecast
          ],
          [m, [d, C + "cast"]],
          [
            /(cros) [\w]+(?:\)| ([\w\.]+)\b)/i
            // Chromium OS
          ],
          [[d, ye], m],
          [
            // Smart TVs
            /panasonic;(viera)/i,
            // Panasonic Viera
            /(netrange)mmh/i,
            // Netrange
            /(nettv)\/(\d+\.[\w\.]+)/i,
            // NetTV
            // Console
            /(nintendo|playstation) ([wids345portablevuch]+)/i,
            // Nintendo/Playstation
            /(xbox); +xbox ([^\);]+)/i,
            // Microsoft Xbox (360, One, X, S, Series X, Series S)
            // Other
            /\b(joli|palm)\b ?(?:os)?\/?([\w\.]*)/i,
            // Joli/Palm
            /(mint)[\/\(\) ]?(\w*)/i,
            // Mint
            /(mageia|vectorlinux)[; ]/i,
            // Mageia/VectorLinux
            /([kxln]?ubuntu|debian|suse|opensuse|gentoo|arch(?= linux)|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire)(?: gnu\/linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\/ ]?(?!chrom|package)([-\w\.]*)/i,
            // Ubuntu/Debian/SUSE/Gentoo/Arch/Slackware/Fedora/Mandriva/CentOS/PCLinuxOS/RedHat/Zenwalk/Linpus/Raspbian/Plan9/Minix/RISCOS/Contiki/Deepin/Manjaro/elementary/Sabayon/Linspire
            /(hurd|linux) ?([\w\.]*)/i,
            // Hurd/Linux
            /(gnu) ?([\w\.]*)/i,
            // GNU
            /\b([-frentopcghs]{0,5}bsd|dragonfly)[\/ ]?(?!amd|[ix346]{1,2}86)([\w\.]*)/i,
            // FreeBSD/NetBSD/OpenBSD/PC-BSD/GhostBSD/DragonFly
            /(haiku) (\w+)/i
            // Haiku
          ],
          [d, m],
          [
            /(sunos) ?([\w\.\d]*)/i
            // Solaris
          ],
          [[d, "Solaris"], m],
          [
            /((?:open)?solaris)[-\/ ]?([\w\.]*)/i,
            // Solaris
            /(aix) ((\d)(?=\.|\)| )[\w\.])*/i,
            // AIX
            /\b(beos|os\/2|amigaos|morphos|openvms|fuchsia|hp-ux|serenityos)/i,
            // BeOS/OS2/AmigaOS/MorphOS/OpenVMS/Fuchsia/HP-UX/SerenityOS
            /(unix) ?([\w\.]*)/i
            // UNIX
          ],
          [d, m]
        ]
      }, yt = function(ee, le) {
        if (typeof ee === c && (le = ee, ee = r), !(this instanceof yt))
          return new yt(ee, le).getResult();
        var K = typeof n !== a && n.navigator ? n.navigator : r, he = ee || (K && K.userAgent ? K.userAgent : s), Lt = K && K.userAgentData ? K.userAgentData : r, _t = le ? wm(eu, le) : eu, ie = K && K.userAgent == he;
        return this.getBrowser = function() {
          var H = {};
          return H[d] = r, H[m] = r, Br.call(H, he, _t.browser), H[f] = Em(H[m]), ie && K && K.brave && typeof K.brave.isBrave == i && (H[d] = "Brave"), H;
        }, this.getCPU = function() {
          var H = {};
          return H[g] = r, Br.call(H, he, _t.cpu), H;
        }, this.getDevice = function() {
          var H = {};
          return H[h] = r, H[l] = r, H[p] = r, Br.call(H, he, _t.device), ie && !H[p] && Lt && Lt.mobile && (H[p] = y), ie && H[l] == "Macintosh" && K && typeof K.standalone !== a && K.maxTouchPoints && K.maxTouchPoints > 2 && (H[l] = "iPad", H[p] = b), H;
        }, this.getEngine = function() {
          var H = {};
          return H[d] = r, H[m] = r, Br.call(H, he, _t.engine), H;
        }, this.getOS = function() {
          var H = {};
          return H[d] = r, H[m] = r, Br.call(H, he, _t.os), ie && !H[d] && Lt && Lt.platform && Lt.platform != "Unknown" && (H[d] = Lt.platform.replace(/chrome os/i, ye).replace(/macos/i, Ps)), H;
        }, this.getResult = function() {
          return {
            ua: this.getUA(),
            browser: this.getBrowser(),
            engine: this.getEngine(),
            os: this.getOS(),
            device: this.getDevice(),
            cpu: this.getCPU()
          };
        }, this.getUA = function() {
          return he;
        }, this.setUA = function(H) {
          return he = typeof H === u && H.length > T ? _i(H, T) : H, this;
        }, this.setUA(he), this;
      };
      yt.BROWSER = Ds([d, m, f]), yt.CPU = Ds([g]), yt.DEVICE = Ds([l, h, p, _, y, E, b, S, w]), yt.ENGINE = yt.OS = Ds([d, m]), e.exports && (t = e.exports = yt), t.UAParser = yt;
      var tr = typeof n !== a && (n.jQuery || n.Zepto);
      if (tr && !tr.ua) {
        var Us = new yt();
        tr.ua = Us.getResult(), tr.ua.get = function() {
          return Us.getUA();
        }, tr.ua.set = function(ee) {
          Us.setUA(ee);
          var le = Us.getResult();
          for (var K in le)
            tr.ua[K] = le[K];
        };
      }
    })(typeof window == "object" ? window : T0);
  })(Zr, Zr.exports)), Zr.exports;
}
var I0 = v0();
const k0 = /* @__PURE__ */ S0(I0), C0 = [
  "chrome122",
  "safari16",
  "edge132",
  "firefox135",
  "ios16"
], A0 = /([a-zA-Z]+)(\d+)/, R0 = C0.reduce((e, t) => {
  const n = t.match(A0);
  return n && (e[n[1]] = +n[2]), e;
}, {});
function x0(e) {
  const t = e.toLowerCase();
  if (t === "chrome" || t === "chromium" || t === "chrome webview")
    return "chrome";
  if (t === "safari")
    return "safari";
  if (t === "mobile safari")
    return "ios";
  if (t === "edge")
    return "edge";
  if (t === "firefox")
    return "firefox";
}
function O0(e) {
  try {
    const n = new k0(e).getBrowser(), r = n.version;
    if (!n.name)
      return !0;
    const s = x0(n.name);
    if (!s)
      return !0;
    const o = R0[s];
    if (!o || !r)
      return !0;
    const i = r.split(".")[0];
    if (!i)
      return !0;
    const a = parseInt(i);
    return isNaN(a) ? !0 : a >= o;
  } catch {
    return !0;
  }
}
const Gt = Symbol.for("@ts-pattern/matcher"), L0 = Symbol.for("@ts-pattern/isVariadic"), xo = "@ts-pattern/anonymous-select-key", Ca = (e) => !!(e && typeof e == "object"), po = (e) => e && !!e[Gt], vt = (e, t, n) => {
  if (po(e)) {
    const r = e[Gt](), { matched: s, selections: o } = r.match(t);
    return s && o && Object.keys(o).forEach((i) => n(i, o[i])), s;
  }
  if (Ca(e)) {
    if (!Ca(t)) return !1;
    if (Array.isArray(e)) {
      if (!Array.isArray(t)) return !1;
      let r = [], s = [], o = [];
      for (const i of e.keys()) {
        const a = e[i];
        po(a) && a[L0] ? o.push(a) : o.length ? s.push(a) : r.push(a);
      }
      if (o.length) {
        if (o.length > 1) throw new Error("Pattern error: Using `...P.array(...)` several times in a single pattern is not allowed.");
        if (t.length < r.length + s.length) return !1;
        const i = t.slice(0, r.length), a = s.length === 0 ? [] : t.slice(-s.length), c = t.slice(r.length, s.length === 0 ? 1 / 0 : -s.length);
        return r.every((u, f) => vt(u, i[f], n)) && s.every((u, f) => vt(u, a[f], n)) && (o.length === 0 || vt(o[0], c, n));
      }
      return e.length === t.length && e.every((i, a) => vt(i, t[a], n));
    }
    return Object.keys(e).every((r) => {
      const s = e[r];
      return (r in t || po(o = s) && o[Gt]().matcherType === "optional") && vt(s, t[r], n);
      var o;
    });
  }
  return Object.is(t, e);
}, fn = (e) => {
  var t, n, r;
  return Ca(e) ? po(e) ? (t = (n = (r = e[Gt]()).getSelectionKeys) == null ? void 0 : n.call(r)) != null ? t : [] : Array.isArray(e) ? ys(e, fn) : ys(Object.values(e), fn) : [];
}, ys = (e, t) => e.reduce((n, r) => n.concat(t(r)), []);
function at(e) {
  return Object.assign(e, { optional: () => N0(e), and: (t) => we(e, t), or: (t) => M0(e, t), select: (t) => t === void 0 ? Nl(e) : Nl(t, e) });
}
function N0(e) {
  return at({ [Gt]: () => ({ match: (t) => {
    let n = {};
    const r = (s, o) => {
      n[s] = o;
    };
    return t === void 0 ? (fn(e).forEach((s) => r(s, void 0)), { matched: !0, selections: n }) : { matched: vt(e, t, r), selections: n };
  }, getSelectionKeys: () => fn(e), matcherType: "optional" }) });
}
function we(...e) {
  return at({ [Gt]: () => ({ match: (t) => {
    let n = {};
    const r = (s, o) => {
      n[s] = o;
    };
    return { matched: e.every((s) => vt(s, t, r)), selections: n };
  }, getSelectionKeys: () => ys(e, fn), matcherType: "and" }) });
}
function M0(...e) {
  return at({ [Gt]: () => ({ match: (t) => {
    let n = {};
    const r = (s, o) => {
      n[s] = o;
    };
    return ys(e, fn).forEach((s) => r(s, void 0)), { matched: e.some((s) => vt(s, t, r)), selections: n };
  }, getSelectionKeys: () => ys(e, fn), matcherType: "or" }) });
}
function re(e) {
  return { [Gt]: () => ({ match: (t) => ({ matched: !!e(t) }) }) };
}
function Nl(...e) {
  const t = typeof e[0] == "string" ? e[0] : void 0, n = e.length === 2 ? e[1] : typeof e[0] == "string" ? void 0 : e[0];
  return at({ [Gt]: () => ({ match: (r) => {
    let s = { [t ?? xo]: r };
    return { matched: n === void 0 || vt(n, r, (o, i) => {
      s[o] = i;
    }), selections: s };
  }, getSelectionKeys: () => [t ?? xo].concat(n === void 0 ? [] : fn(n)) }) });
}
function wt(e) {
  return typeof e == "number";
}
function qt(e) {
  return typeof e == "string";
}
function Xt(e) {
  return typeof e == "bigint";
}
at(re(function(e) {
  return !0;
}));
const Yt = (e) => Object.assign(at(e), { startsWith: (t) => {
  return Yt(we(e, (n = t, re((r) => qt(r) && r.startsWith(n)))));
  var n;
}, endsWith: (t) => {
  return Yt(we(e, (n = t, re((r) => qt(r) && r.endsWith(n)))));
  var n;
}, minLength: (t) => Yt(we(e, ((n) => re((r) => qt(r) && r.length >= n))(t))), length: (t) => Yt(we(e, ((n) => re((r) => qt(r) && r.length === n))(t))), maxLength: (t) => Yt(we(e, ((n) => re((r) => qt(r) && r.length <= n))(t))), includes: (t) => {
  return Yt(we(e, (n = t, re((r) => qt(r) && r.includes(n)))));
  var n;
}, regex: (t) => {
  return Yt(we(e, (n = t, re((r) => qt(r) && !!r.match(n)))));
  var n;
} });
Yt(re(qt));
const Et = (e) => Object.assign(at(e), { between: (t, n) => Et(we(e, ((r, s) => re((o) => wt(o) && r <= o && s >= o))(t, n))), lt: (t) => Et(we(e, ((n) => re((r) => wt(r) && r < n))(t))), gt: (t) => Et(we(e, ((n) => re((r) => wt(r) && r > n))(t))), lte: (t) => Et(we(e, ((n) => re((r) => wt(r) && r <= n))(t))), gte: (t) => Et(we(e, ((n) => re((r) => wt(r) && r >= n))(t))), int: () => Et(we(e, re((t) => wt(t) && Number.isInteger(t)))), finite: () => Et(we(e, re((t) => wt(t) && Number.isFinite(t)))), positive: () => Et(we(e, re((t) => wt(t) && t > 0))), negative: () => Et(we(e, re((t) => wt(t) && t < 0))) });
Et(re(wt));
const Jt = (e) => Object.assign(at(e), { between: (t, n) => Jt(we(e, ((r, s) => re((o) => Xt(o) && r <= o && s >= o))(t, n))), lt: (t) => Jt(we(e, ((n) => re((r) => Xt(r) && r < n))(t))), gt: (t) => Jt(we(e, ((n) => re((r) => Xt(r) && r > n))(t))), lte: (t) => Jt(we(e, ((n) => re((r) => Xt(r) && r <= n))(t))), gte: (t) => Jt(we(e, ((n) => re((r) => Xt(r) && r >= n))(t))), positive: () => Jt(we(e, re((t) => Xt(t) && t > 0))), negative: () => Jt(we(e, re((t) => Xt(t) && t < 0))) });
Jt(re(Xt));
at(re(function(e) {
  return typeof e == "boolean";
}));
at(re(function(e) {
  return typeof e == "symbol";
}));
at(re(function(e) {
  return e == null;
}));
at(re(function(e) {
  return e != null;
}));
const Aa = { matched: !1, value: void 0 };
function bh(e) {
  return new Oo(e, Aa);
}
class Oo {
  constructor(t, n) {
    this.input = void 0, this.state = void 0, this.input = t, this.state = n;
  }
  with(...t) {
    if (this.state.matched) return this;
    const n = t[t.length - 1], r = [t[0]];
    let s;
    t.length === 3 && typeof t[1] == "function" ? s = t[1] : t.length > 2 && r.push(...t.slice(1, t.length - 1));
    let o = !1, i = {};
    const a = (u, f) => {
      o = !0, i[u] = f;
    }, c = !r.some((u) => vt(u, this.input, a)) || s && !s(this.input) ? Aa : { matched: !0, value: n(o ? xo in i ? i[xo] : i : this.input, this.input) };
    return new Oo(this.input, c);
  }
  when(t, n) {
    if (this.state.matched) return this;
    const r = !!t(this.input);
    return new Oo(this.input, r ? { matched: !0, value: n(this.input, this.input) } : Aa);
  }
  otherwise(t) {
    return this.state.matched ? this.state.value : t(this.input);
  }
  exhaustive() {
    if (this.state.matched) return this.state.value;
    let t;
    try {
      t = JSON.stringify(this.input);
    } catch {
      t = this.input;
    }
    throw new Error(`Pattern matching error: no pattern matches value ${t}`);
  }
  run() {
    return this.exhaustive();
  }
  returnType() {
    return this;
  }
}
class gi extends Error {
  code;
  details;
  constructor(t, { message: n, cause: r, details: s = {} } = {}) {
    super(n ? `[${t}] ${n}` : `[${t}]`, { cause: r }), this.code = t, this.code = t, this.details = s, this.name = "PplxError", "captureStackTrace" in Error && typeof Error.captureStackTrace == "function" && Error.captureStackTrace(this, gi);
  }
}
function jr(...e) {
  let t;
  const n = {}, r = [];
  e.filter(Boolean).forEach((o) => {
    o instanceof gi ? (t = o, r.push(o.message), o.details && Object.assign(n, {
      pplx_error_code: o.code,
      ...o.details
    })) : o instanceof Error ? (t = o, r.push(o.message)) : typeof o == "object" ? Object.assign(n, o) : r.push(o);
  });
  const s = r.join(" ");
  return t ? {
    message: s,
    error: t,
    extra: n
  } : {
    message: s,
    extra: n
  };
}
function qr(e, { message: t, error: n, extra: r }) {
  const s = [t, r, n];
  bh(e).with("error", () => {
    Tn.logger.error(...s);
    try {
      Bc.addError(n, { message: t, extra: r });
    } catch {
    }
  }).with("warn", () => Tn.logger.warn(...s)).with("log", () => Tn.logger.info(...s)).with("debug", () => Tn.logger.debug(...s)).with("info", () => Tn.logger.info(...s)).exhaustive();
}
const Wn = {
  log: (...e) => {
    qr("debug", jr(...e));
  },
  error: (...e) => {
    qr("error", jr(...e));
  },
  warn: (...e) => {
    qr("warn", jr(...e));
  },
  debug: (...e) => {
    qr("debug", jr(...e));
  },
  info: (...e) => {
    qr("info", jr(...e));
  }
};
function P0({ clientToken: e, version: t, env: n, debug: r, sessionSampleRate: s, service: o = "web-nextjs" }) {
  const i = O0(navigator.userAgent);
  Tn.init({
    clientToken: e,
    // `site` refers to the Datadog site parameter of your organization
    // see https://docs.datadoghq.com/getting_started/site/
    site: "datadoghq.com",
    service: o,
    env: n,
    version: t,
    sessionSampleRate: s,
    forwardErrorsToLogs: !0,
    forwardConsoleLogs: ["warn", "error", "info"],
    silentMultipleInit: r,
    beforeSend: (a) => !i || a.http?.url.includes("reddit.com") || (a.http?.status_code === 0 && (a.status = "warn"), a.error?.handling === "unhandled" && a.message?.includes("Script error.") && !a.error?.cause) ? !1 : a.status === "error" || a.status === "warn" || a.status === "info"
  });
}
const Lo = {
  version: typeof chrome < "u" ? chrome.runtime.getManifest().version : "0.0.0",
  is_comet: Me,
  device_id: void 0,
  browser_version: void 0,
  partner_build: !1
};
function wh(e, ...t) {
  const n = [...t, Lo];
  Wn[e](...n);
}
function Eh(e = wh) {
  return {
    error: (...t) => e("error", ...t),
    warn: (...t) => e("warn", ...t),
    info: (...t) => e("info", ...t),
    debug: (...t) => e("debug", ...t),
    exception: (t, n, ...r) => (e("error", t, n, ...r), new Error(t, { cause: n }))
  };
}
const G = Eh();
Me && (typeof chrome < "u" && !!chrome.perplexity?.system?.getMachineId ? chrome.perplexity.system.getMachineId().then((t) => {
  Lo.device_id = t;
}).catch((t) => {
  Le({
    error: "Failed to get Machine ID",
    logger: G,
    context: {
      err: t instanceof Error ? t.message : String(t)
    }
  });
}) : Le({
  error: "Machine ID API not available",
  logger: G
}), pc.then((t) => {
  Lo.browser_version = t;
}).catch((t) => {
  Le({
    error: "Failed to get Browser Version",
    logger: G,
    context: {
      err: t instanceof Error ? t.message : String(t)
    }
  });
}));
function nt(e) {
  return Eh((...n) => {
    const r = {
      ...e,
      request_id: e.request_id ?? e.requestId ?? e["X-Request-ID"],
      step_uuid: e.step_uuid,
      "dd.trace_id": e["x-datadog-trace-id"],
      "dd.parent_id": e["x-datadog-parent-id"],
      "dd.origin": e["x-datadog-origin"],
      "dd.tags": e["x-datadog-tags"]
    };
    return wh.apply(null, [...n, r]);
  });
}
const D0 = "agent.custom_metrics";
function Nn(e, t = {}) {
  Wn.info(D0, {
    metricName: e,
    ...t,
    ...Lo
    // not all of this will be in tags
  });
}
const Sh = "2.18", Th = "default", U0 = "server", F0 = "mweb", $0 = "windowsapp", B0 = "X-Perplexity-Request-Reason";
var V0 = Object.defineProperty, W0 = (e, t, n) => t in e ? V0(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, Js = (e, t, n) => W0(e, typeof t != "symbol" ? t + "" : t, n);
class Ml extends Error {
  constructor(t, n) {
    super(t), Js(this, "type"), Js(this, "field"), Js(this, "value"), Js(this, "line"), this.name = "ParseError", this.type = n.type, this.field = n.field, this.value = n.value, this.line = n.line;
  }
}
function qi(e) {
}
function H0(e) {
  const { onEvent: t = qi, onError: n = qi, onRetry: r = qi, onComment: s } = e;
  let o = "", i = !0, a, c = "", u = "";
  function f(m) {
    const g = i ? m.replace(/^\xEF\xBB\xBF/, "") : m, [_, y] = G0(`${o}${g}`);
    for (const b of _)
      l(b);
    o = y, i = !1;
  }
  function l(m) {
    if (m === "") {
      p();
      return;
    }
    if (m.startsWith(":")) {
      s && s(m.slice(m.startsWith(": ") ? 2 : 1));
      return;
    }
    const g = m.indexOf(":");
    if (g !== -1) {
      const _ = m.slice(0, g), y = m[g + 1] === " " ? 2 : 1, b = m.slice(g + y);
      d(_, b, m);
      return;
    }
    d(m, "", m);
  }
  function d(m, g, _) {
    switch (m) {
      case "event":
        u = g;
        break;
      case "data":
        c = `${c}${g}
`;
        break;
      case "id":
        a = g.includes("\0") ? void 0 : g;
        break;
      case "retry":
        /^\d+$/.test(g) ? r(parseInt(g, 10)) : n(
          new Ml(`Invalid \`retry\` value: "${g}"`, {
            type: "invalid-retry",
            value: g,
            line: _
          })
        );
        break;
      default:
        n(
          new Ml(
            `Unknown field "${m.length > 20 ? `${m.slice(0, 20)}…` : m}"`,
            { type: "unknown-field", field: m, value: g, line: _ }
          )
        );
        break;
    }
  }
  function p() {
    c.length > 0 && t({
      id: a,
      event: u || void 0,
      // If the data buffer's last character is a U+000A LINE FEED (LF) character,
      // then remove the last character from the data buffer.
      data: c.endsWith(`
`) ? c.slice(0, -1) : c
    }), a = void 0, c = "", u = "";
  }
  function h(m = {}) {
    o && m.consume && l(o), a = void 0, c = "", u = "", o = "";
  }
  return { feed: f, reset: h };
}
function G0(e) {
  const t = [];
  let n = "";
  const r = e.length;
  for (let s = 0; s < r; s++) {
    const o = e[s];
    o === "\r" && e[s + 1] === `
` ? (t.push(n), n = "", s++) : o === "\r" || o === `
` ? (t.push(n), n = "") : n += o;
  }
  return [t, n];
}
class Pl extends Event {
  /**
   * Constructs a new `ErrorEvent` instance. This is typically not called directly,
   * but rather emitted by the `EventSource` object when an error occurs.
   *
   * @param type - The type of the event (should be "error")
   * @param errorEventInitDict - Optional properties to include in the error event
   */
  constructor(t, n) {
    var r, s;
    super(t), this.code = (r = n?.code) != null ? r : void 0, this.message = (s = n?.message) != null ? s : void 0;
  }
  /**
   * Node.js "hides" the `message` and `code` properties of the `ErrorEvent` instance,
   * when it is `console.log`'ed. This makes it harder to debug errors. To ease debugging,
   * we explicitly include the properties in the `inspect` method.
   *
   * This is automatically called by Node.js when you `console.log` an instance of this class.
   *
   * @param _depth - The current depth
   * @param options - The options passed to `util.inspect`
   * @param inspect - The inspect function to use (prevents having to import it from `util`)
   * @returns A string representation of the error
   */
  [Symbol.for("nodejs.util.inspect.custom")](t, n, r) {
    return r(Dl(this), n);
  }
  /**
   * Deno "hides" the `message` and `code` properties of the `ErrorEvent` instance,
   * when it is `console.log`'ed. This makes it harder to debug errors. To ease debugging,
   * we explicitly include the properties in the `inspect` method.
   *
   * This is automatically called by Deno when you `console.log` an instance of this class.
   *
   * @param inspect - The inspect function to use (prevents having to import it from `util`)
   * @param options - The options passed to `Deno.inspect`
   * @returns A string representation of the error
   */
  [Symbol.for("Deno.customInspect")](t, n) {
    return t(Dl(this), n);
  }
}
function z0(e) {
  const t = globalThis.DOMException;
  return typeof t == "function" ? new t(e, "SyntaxError") : new SyntaxError(e);
}
function Ra(e) {
  return e instanceof Error ? "errors" in e && Array.isArray(e.errors) ? e.errors.map(Ra).join(", ") : "cause" in e && e.cause instanceof Error ? `${e}: ${Ra(e.cause)}` : e.message : `${e}`;
}
function Dl(e) {
  return {
    type: e.type,
    message: e.message,
    code: e.code,
    defaultPrevented: e.defaultPrevented,
    cancelable: e.cancelable,
    timeStamp: e.timeStamp
  };
}
var vh = (e) => {
  throw TypeError(e);
}, Vc = (e, t, n) => t.has(e) || vh("Cannot " + n), J = (e, t, n) => (Vc(e, t, "read from private field"), n ? n.call(e) : t.get(e)), ke = (e, t, n) => t.has(e) ? vh("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, n), be = (e, t, n, r) => (Vc(e, t, "write to private field"), t.set(e, n), n), Nt = (e, t, n) => (Vc(e, t, "access private method"), n), Ge, In, ar, ho, No, is, mr, as, en, cr, br, ur, Qr, ct, xa, Oa, La, Ul, Na, Ma, es, Pa, Da;
class mo extends EventTarget {
  constructor(t, n) {
    var r, s;
    super(), ke(this, ct), this.CONNECTING = 0, this.OPEN = 1, this.CLOSED = 2, ke(this, Ge), ke(this, In), ke(this, ar), ke(this, ho), ke(this, No), ke(this, is), ke(this, mr), ke(this, as, null), ke(this, en), ke(this, cr), ke(this, br, null), ke(this, ur, null), ke(this, Qr, null), ke(this, Oa, async (o) => {
      var i;
      J(this, cr).reset();
      const { body: a, redirected: c, status: u, headers: f } = o;
      if (u === 204) {
        Nt(this, ct, es).call(this, "Server sent HTTP 204, not reconnecting", 204), this.close();
        return;
      }
      if (c ? be(this, ar, new URL(o.url)) : be(this, ar, void 0), u !== 200) {
        Nt(this, ct, es).call(this, `Non-200 status code (${u})`, u);
        return;
      }
      if (!(f.get("content-type") || "").startsWith("text/event-stream")) {
        Nt(this, ct, es).call(this, 'Invalid content type, expected "text/event-stream"', u);
        return;
      }
      if (J(this, Ge) === this.CLOSED)
        return;
      be(this, Ge, this.OPEN);
      const l = new Event("open");
      if ((i = J(this, Qr)) == null || i.call(this, l), this.dispatchEvent(l), typeof a != "object" || !a || !("getReader" in a)) {
        Nt(this, ct, es).call(this, "Invalid response body, expected a web ReadableStream", u), this.close();
        return;
      }
      const d = new TextDecoder(), p = a.getReader();
      let h = !0;
      do {
        const { done: m, value: g } = await p.read();
        g && J(this, cr).feed(d.decode(g, { stream: !m })), m && (h = !1, J(this, cr).reset(), Nt(this, ct, Pa).call(this));
      } while (h);
    }), ke(this, La, (o) => {
      be(this, en, void 0), !(o.name === "AbortError" || o.type === "aborted") && Nt(this, ct, Pa).call(this, Ra(o));
    }), ke(this, Na, (o) => {
      typeof o.id == "string" && be(this, as, o.id);
      const i = new MessageEvent(o.event || "message", {
        data: o.data,
        origin: J(this, ar) ? J(this, ar).origin : J(this, In).origin,
        lastEventId: o.id || ""
      });
      J(this, ur) && (!o.event || o.event === "message") && J(this, ur).call(this, i), this.dispatchEvent(i);
    }), ke(this, Ma, (o) => {
      be(this, is, o);
    }), ke(this, Da, () => {
      be(this, mr, void 0), J(this, Ge) === this.CONNECTING && Nt(this, ct, xa).call(this);
    });
    try {
      if (t instanceof URL)
        be(this, In, t);
      else if (typeof t == "string")
        be(this, In, new URL(t, K0()));
      else
        throw new Error("Invalid URL");
    } catch {
      throw z0("An invalid or illegal string was specified");
    }
    be(this, cr, H0({
      onEvent: J(this, Na),
      onRetry: J(this, Ma)
    })), be(this, Ge, this.CONNECTING), be(this, is, 3e3), be(this, No, (r = n?.fetch) != null ? r : globalThis.fetch), be(this, ho, (s = n?.withCredentials) != null ? s : !1), Nt(this, ct, xa).call(this);
  }
  /**
   * Returns the state of this EventSource object's connection. It can have the values described below.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/EventSource/readyState)
   *
   * Note: typed as `number` instead of `0 | 1 | 2` for compatibility with the `EventSource` interface,
   * defined in the TypeScript `dom` library.
   *
   * @public
   */
  get readyState() {
    return J(this, Ge);
  }
  /**
   * Returns the URL providing the event stream.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/EventSource/url)
   *
   * @public
   */
  get url() {
    return J(this, In).href;
  }
  /**
   * Returns true if the credentials mode for connection requests to the URL providing the event stream is set to "include", and false otherwise.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/EventSource/withCredentials)
   */
  get withCredentials() {
    return J(this, ho);
  }
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/EventSource/error_event) */
  get onerror() {
    return J(this, br);
  }
  set onerror(t) {
    be(this, br, t);
  }
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/EventSource/message_event) */
  get onmessage() {
    return J(this, ur);
  }
  set onmessage(t) {
    be(this, ur, t);
  }
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/EventSource/open_event) */
  get onopen() {
    return J(this, Qr);
  }
  set onopen(t) {
    be(this, Qr, t);
  }
  addEventListener(t, n, r) {
    const s = n;
    super.addEventListener(t, s, r);
  }
  removeEventListener(t, n, r) {
    const s = n;
    super.removeEventListener(t, s, r);
  }
  /**
   * Aborts any instances of the fetch algorithm started for this EventSource object, and sets the readyState attribute to CLOSED.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/EventSource/close)
   *
   * @public
   */
  close() {
    J(this, mr) && clearTimeout(J(this, mr)), J(this, Ge) !== this.CLOSED && (J(this, en) && J(this, en).abort(), be(this, Ge, this.CLOSED), be(this, en, void 0));
  }
}
Ge = /* @__PURE__ */ new WeakMap(), In = /* @__PURE__ */ new WeakMap(), ar = /* @__PURE__ */ new WeakMap(), ho = /* @__PURE__ */ new WeakMap(), No = /* @__PURE__ */ new WeakMap(), is = /* @__PURE__ */ new WeakMap(), mr = /* @__PURE__ */ new WeakMap(), as = /* @__PURE__ */ new WeakMap(), en = /* @__PURE__ */ new WeakMap(), cr = /* @__PURE__ */ new WeakMap(), br = /* @__PURE__ */ new WeakMap(), ur = /* @__PURE__ */ new WeakMap(), Qr = /* @__PURE__ */ new WeakMap(), ct = /* @__PURE__ */ new WeakSet(), /**
* Connect to the given URL and start receiving events
*
* @internal
*/
xa = function() {
  be(this, Ge, this.CONNECTING), be(this, en, new AbortController()), J(this, No)(J(this, In), Nt(this, ct, Ul).call(this)).then(J(this, Oa)).catch(J(this, La));
}, Oa = /* @__PURE__ */ new WeakMap(), La = /* @__PURE__ */ new WeakMap(), /**
* Get request options for the `fetch()` request
*
* @returns The request options
* @internal
*/
Ul = function() {
  var e;
  const t = {
    // [spec] Let `corsAttributeState` be `Anonymous`…
    // [spec] …will have their mode set to "cors"…
    mode: "cors",
    redirect: "follow",
    headers: { Accept: "text/event-stream", ...J(this, as) ? { "Last-Event-ID": J(this, as) } : void 0 },
    cache: "no-store",
    signal: (e = J(this, en)) == null ? void 0 : e.signal
  };
  return "window" in globalThis && (t.credentials = this.withCredentials ? "include" : "same-origin"), t;
}, Na = /* @__PURE__ */ new WeakMap(), Ma = /* @__PURE__ */ new WeakMap(), /**
* Handles the process referred to in the EventSource specification as "failing a connection".
*
* @param error - The error causing the connection to fail
* @param code - The HTTP status code, if available
* @internal
*/
es = function(e, t) {
  var n;
  J(this, Ge) !== this.CLOSED && be(this, Ge, this.CLOSED);
  const r = new Pl("error", { code: t, message: e });
  (n = J(this, br)) == null || n.call(this, r), this.dispatchEvent(r);
}, /**
* Schedules a reconnection attempt against the EventSource endpoint.
*
* @param message - The error causing the connection to fail
* @param code - The HTTP status code, if available
* @internal
*/
Pa = function(e, t) {
  var n;
  if (J(this, Ge) === this.CLOSED)
    return;
  be(this, Ge, this.CONNECTING);
  const r = new Pl("error", { code: t, message: e });
  (n = J(this, br)) == null || n.call(this, r), this.dispatchEvent(r), be(this, mr, setTimeout(J(this, Da), J(this, is)));
}, Da = /* @__PURE__ */ new WeakMap(), /**
* ReadyState representing an EventSource currently trying to connect
*
* @public
*/
mo.CONNECTING = 0, /**
* ReadyState representing an EventSource connection that is open (eg connected)
*
* @public
*/
mo.OPEN = 1, /**
* ReadyState representing an EventSource connection that is closed (eg disconnected)
*
* @public
*/
mo.CLOSED = 2;
function K0() {
  const e = "document" in globalThis ? globalThis.document : void 0;
  return e && typeof e == "object" && "baseURI" in e && typeof e.baseURI == "string" ? e.baseURI : void 0;
}
const Ih = "web.custom_metrics";
function j0(e, t, n) {
  Wn.info(Ih, {
    metricName: e,
    duration: t,
    ...n
  });
}
function q0(e = {}, { transport: t = j0, nowFromTimeOrigin: n = performance.now(), getTimeOrigin: r = () => performance.timeOrigin } = {}) {
  const s = { ...e }, o = /* @__PURE__ */ new Set(), i = [];
  function a(u, f = {}) {
    const l = performance.now() - n, d = {
      metricName: u,
      duration: l
    };
    return i.push(d), t(u, l, {
      ...s,
      ...f,
      // Store the start time of the timer
      startTime: n + r()
    }), d;
  }
  function c(u, f) {
    return o.has(u) ? i.find((l) => l.metricName === u) : (o.add(u), a(u, f));
  }
  return {
    addTimingOnce: c,
    addTiming: a,
    getEvents() {
      return i;
    },
    setGlobalContext(u) {
      Object.assign(s, u);
    },
    getStartTimeFromTimeOrigin() {
      return n;
    },
    getAbsoluteStartTime() {
      return n + r();
    }
  };
}
function Fl(e = {}, t = {}) {
  const n = (t.nowFromTimeOrigin ?? performance.now()) + $l();
  return q0(e, {
    ...t,
    transport: (r, s, o) => {
      performance.mark(r), Bc.addDurationVital(r, {
        startTime: n,
        duration: s,
        context: o
      });
    },
    getTimeOrigin: $l
  });
}
function lr(e, t = {}) {
  Wn.info(Ih, {
    metricName: e,
    ...t
  });
}
function $l() {
  return performance.timeOrigin;
}
class lt extends gi {
  name = "FetcherError";
  constructor(t, n = {}) {
    super(t, n);
  }
}
const kh = /* @__PURE__ */ new WeakMap(), X0 = "TimeoutError", Bl = 2, Ch = 1250, Ah = 1e4, Rh = 15e3, Y0 = (e) => {
  const t = typeof window > "u", n = new URL(e), r = n.searchParams;
  return r.get("version") || r.set("version", Sh), r.get("source") || r.set("source", t ? U0 : Th), n;
};
function J0(e, t) {
  const n = Math.max(typeof window < "u" ? t === "GET" ? Ah : Rh : Ch, e);
  try {
    const r = globalThis.navigator.userAgent.includes("Mobile") && !globalThis.navigator.userAgent.includes("iPad");
    let s = "unknown", o = 10;
    return globalThis.navigator.connection && (s = globalThis.navigator.connection.type, o = globalThis.navigator.connection.downlink), r || o < 1 || s === "cellular" ? n * 2 : n;
  } catch {
    return n;
  }
}
const Z0 = (e) => {
  switch (e) {
    // Our Python Client Error Codes we CANNOT retry
    case 400:
    // Bad Request - Used for invalid request parameters or malformed requests
    case 403:
    // Forbidden - Used when access is denied
    case 404:
      return !1;
    // Our Python Client Error Codes we CAN retry
    /**
     * 401 Unauthorized - This can happen if we cannot look up the user in our
     * backend DB, possibly due to a read replica delay or just the DB being
     * unresponsive.
     */
    case 401:
    case 409:
      return !0;
    // Our Python Server Error Codes we CAN retry
    case 500:
    // Internal Server Error - Used for unexpected server errors
    case 502:
    // Bad Gateway - Used for unexpected server errors
    case 429:
      return !0;
    default:
      return !1;
  }
}, Q0 = (e) => {
  if (!e)
    return 0;
  const t = parseInt(e, 10);
  if (!isNaN(t))
    return Math.max(0, t * 1e3);
  const r = new Date(e).getTime();
  return isNaN(r) ? 0 : Math.max(0, r - Date.now());
}, eA = (e, t, n) => n + e * Math.pow(2, t), tA = async ({ resource: e, options: t = {}, method: n = "GET", timeoutMs: r = typeof window < "u" ? n === "GET" ? Ah : Rh : Ch, body: s, numRetries: o = 0, backOffTime: i = 1e3, normalizedPath: a, reason: c }) => {
  const u = {
    ...t,
    method: n,
    body: s
  }, f = new Headers(u.headers);
  f.set(B0, c);
  let l = () => null;
  if (r) {
    const _ = J0(r, n);
    l = () => {
      const y = new DOMException(`fetch ${e} timed out (${_}ms)`, X0), b = new AbortController();
      return u.signal = b.signal, setTimeout(() => b.abort(y), _);
    };
  }
  if (o > Bl) {
    const _ = new lt("FETCHER_MAX_RETRIES_EXCEEDED", {
      details: {
        resource: e,
        numRetries: o,
        maxRetries: Bl
      }
    });
    Wn.error(_);
  }
  let d = null, p, h = i, m = 0, g = 0;
  do {
    o > 0 && g > 0 && await new Promise((y) => setTimeout(y, h));
    const _ = l();
    m = 0, p = void 0;
    try {
      if (f.set("X-Perplexity-Request-Try-Number", String(g + 1)), f.set("X-Perplexity-Request-Endpoint", String(e)), d = await fetch(e, {
        ...u,
        headers: f
      }), clearTimeout(_), !d.ok && Z0(d.status))
        m = Q0(d.headers.get("Retry-After"));
      else
        break;
    } catch (y) {
      p = new lt("FETCHER_NO_STATUS_CODE_ERROR", {
        message: y?.message,
        cause: y?.cause
      });
    }
    clearTimeout(_), h = eA(i, g, m), ++g;
  } while (g <= o);
  try {
    d && kh.set(d, a);
  } catch {
  }
  if (!p && !d.ok)
    if (d.status === 403 && d.headers.get("cf-mitigated")?.includes("challenge"))
      p = new lt("FETCHER_CLOUDFLARE_403_ERROR");
    else {
      const _ = (await d.clone().text()).trimStart();
      (_.startsWith("<!DOCTYPE html") || _.startsWith("<html")) && (p = new lt("FETCHER_HTML_STATUS_CODE_ERROR"));
    }
  if (p)
    throw Wn.log(`${u.method} ${e} exception`, p), p._fetchMethod = u.method, p._fetchResource = e, p;
  return d;
}, nA = 600 * 1e3;
async function rA({ url: e, normalizedPath: t, params: n, handlers: r, legacyEvents: s = {}, headers: o = {}, signal: i, metrics: a = {}, timer: c }) {
  const u = s.message ?? "message", f = s.endOfStream ?? "end_of_stream", l = s.message && s.endOfStream, { now: d, ...p } = a;
  c ? c.setGlobalContext({
    normalizedPath: t,
    ...p
  }) : c = Fl({
    normalizedPath: t,
    ...p
  }, { nowFromTimeOrigin: performance.now() });
  const { addTiming: h, addTimingOnce: m } = c;
  return h("web.sse.start"), new Promise((g, _) => {
    const y = new mo(e, {
      withCredentials: !0,
      fetch: (I, O) => fetch(I, {
        ...O,
        method: "POST",
        body: n ? JSON.stringify(n) : void 0,
        credentials: "include",
        signal: i,
        headers: {
          "content-type": "application/json",
          ...O?.headers ?? {},
          ...o
        }
      }).then((R) => {
        try {
          R && kh.set(R, t);
        } catch {
        }
        return R;
      })
    });
    let b, E;
    function S() {
      E ? E = void 0 : E = Fl({
        normalizedPath: t,
        ...p
      });
    }
    function w() {
      clearTimeout(b), b = setTimeout(() => {
        try {
          y.close();
        } catch {
        } finally {
          C();
        }
        _(new lt("FETCHER_SSE_CHUNK_TIMEOUT", {
          details: {
            submitParams: n
          }
        }));
      }, nA);
    }
    function T(I) {
      clearTimeout(b);
      try {
        y.close();
      } catch {
      } finally {
        C();
      }
      I instanceof lt ? _(I) : _(new lt("FETCHER_SSE_ERROR", {
        cause: I,
        message: "An error occurred while streaming",
        details: {
          submitParams: n
        }
      }));
    }
    const N = (I) => {
      const O = () => !navigator.onLine || I.message === "network error";
      let R = "FETCHER_SSE_ERROR";
      O() ? R = "FETCHER_SSE_OFFLINE_ERROR" : I.code ? I.code === 403 && (R = "FETCHER_SSE_CLOUDFLARE_403_ERROR") : R = "FETCHER_SSE_NO_STATUS_CODE_ERROR", T(new lt(R, {
        cause: I,
        details: {
          code: R,
          message: I.message,
          type: I.type,
          submitParams: n
        }
      }));
    }, k = () => {
      w(), h("web.sse.connection_opened"), r.open?.();
    }, v = (I) => {
      let O;
      try {
        m("web.sse.first_message_seen"), S(), w(), O = JSON.parse(I.data);
      } catch (R) {
        return T(new lt("FETCHER_SSE_CHUNK_PROCESSING_ERROR", {
          cause: R,
          details: {
            submitParams: n
          }
        }));
      }
      r.message(O);
    }, M = (I) => {
      let O;
      try {
        m("web.sse.first_message_seen"), S(), clearTimeout(b);
        try {
          y.close();
        } catch {
        } finally {
          C();
        }
        O = JSON.parse(I.data);
      } catch (R) {
        return T(new lt("FETCHER_SSE_EOS_ERROR", {
          cause: R,
          details: {
            submitParams: n
          }
        }));
      }
      l && r.message(O), h("web.sse.end_of_stream"), g();
    }, P = (I) => {
      let O;
      try {
        O = JSON.parse(I.data);
      } catch (R) {
        return T(new lt("FETCHER_SSE_INFO_CHUNK_PARSE_ERROR", {
          cause: R,
          details: {
            submitParams: n
          }
        }));
      }
      r.info?.(O);
    };
    y.addEventListener("error", N), y.addEventListener("open", k), y.addEventListener(u, v), y.addEventListener(f, M), y.addEventListener("info", P);
    const C = () => {
      y.removeEventListener("error", N), y.removeEventListener("open", k), y.removeEventListener(u, v), y.removeEventListener(f, M), y.removeEventListener("info", P);
    };
    w();
  }).catch((g) => {
    throw g instanceof Error && (g.cause?.code ?? 0) > 0 || Wn.error("SSE error", g, {
      normalizedPath: t
    }), g;
  });
}
const Vl = (e, t) => {
  const n = e.replace(/\/+$/, ""), r = t.replace(/^\/+/, "");
  return new URL(r, n).toString();
}, sA = (e, t) => e ? F0 : t ? $0 : Th, oA = ({ clientHeaders: e, isMobile: t, isWindowsApp: n }) => {
  const r = sA(t, n), s = e instanceof Headers ? new Headers(e) : new Headers(Object.entries(e ?? {}).filter((i) => i[1] !== void 0).map(([i, a]) => [
    i,
    Array.isArray(a) ? a.join(", ") : a
  ])), o = new Headers({
    "X-App-ApiClient": r,
    "X-App-ApiVersion": Sh
  });
  return s.forEach((i, a) => {
    o.set(a, i);
  }), o;
};
async function iA({ urlPath: e, timeoutMs: t, method: n, body: r, headers: s, baseUrlOverride: o, redirect: i, numRetries: a, backOffTime: c, reason: u, normalizedPath: f, shouldNotAddSourceVersionQueryParams: l }) {
  const d = navigator.userAgent.includes("Mobile"), p = navigator.userAgent.includes("WindowsApp"), m = {
    headers: oA({
      clientHeaders: s,
      isMobile: d,
      isWindowsApp: p
    }),
    redirect: i,
    credentials: "same-origin"
  }, g = o ?? window.location.origin, _ = l ? Vl(g, e) : Y0(Vl(g, e));
  return tA({
    resource: _,
    options: m,
    timeoutMs: t,
    method: n,
    body: r,
    numRetries: a,
    backOffTime: c,
    reason: u,
    normalizedPath: f
  });
}
async function aA({ url: e, headers: t, ...n }) {
  const r = new URL(e, window.location.origin);
  return rA({
    url: r,
    headers: t,
    ...n
  });
}
const yn = "X-Perplexity-Request-Reason", cA = (e) => {
  const t = e({
    baseUrl: `https://${crypto.randomUUID()}.com`,
    // We will throw this away for whatever restAsyncServerFetch uses
    fetch: async (n) => {
      const r = new URL(n.url), s = r.pathname, o = r.searchParams, i = await n.text(), a = n.headers.get(yn) ?? "typedRestAsyncClient";
      return iA({
        urlPath: o.size > 0 ? `${s}?${o.toString()}` : s,
        method: n.method,
        body: i || void 0,
        headers: n.headers,
        timeoutMs: n.timeoutMs,
        numRetries: n.numRetries,
        backOffTime: n.backOffTime,
        reason: a,
        normalizedPath: n.normalizedPath ?? s,
        baseUrlOverride: n.baseUrlOverride,
        includeCredentials: n.includeCredentials,
        shouldNotAddSourceVersionQueryParams: n.shouldNotAddSourceVersionQueryParams,
        redirect: n.redirect
      });
    }
  });
  return {
    GET: ((n, r, s) => t.GET(n, {
      ...s || {},
      normalizedPath: n,
      ...s || {},
      headers: {
        ...s?.headers || {},
        [yn]: r
      }
    })),
    POST: ((n, r, s) => t.POST(n, {
      ...s || {},
      normalizedPath: n,
      headers: {
        ...s?.headers || {},
        [yn]: r
      }
    })),
    PUT: ((n, r, s) => t.PUT(n, {
      ...s || {},
      normalizedPath: n,
      headers: {
        ...s?.headers || {},
        [yn]: r
      }
    })),
    PATCH: ((n, r, s) => t.PATCH(n, {
      ...s || {},
      normalizedPath: n,
      headers: {
        ...s?.headers || {},
        [yn]: r
      }
    })),
    DELETE: ((n, r, s) => t.DELETE(n, {
      ...s || {},
      normalizedPath: n,
      headers: {
        ...s?.headers || {},
        [yn]: r
      }
    })),
    SSE: uA
  };
};
function uA(e, t, { path: n, ...r }) {
  return aA({
    url: Object.entries(n ?? {}).reduce((s, [o, i]) => s.replace(`{${o}}`, String(i)), e),
    normalizedPath: e,
    ...r || {},
    headers: {
      ...r?.headers || {},
      [yn]: t
    }
  });
}
const lA = /\{[^{}]+\}/g, dA = () => typeof process == "object" && Number.parseInt(process?.versions?.node?.substring(0, 2)) >= 18 && process.versions.undici;
function fA() {
  return Math.random().toString(36).slice(2, 11);
}
function pA(e) {
  let {
    baseUrl: t = "",
    Request: n = globalThis.Request,
    fetch: r = globalThis.fetch,
    querySerializer: s,
    bodySerializer: o,
    headers: i,
    requestInitExt: a = void 0,
    ...c
  } = { ...e };
  a = dA() ? a : void 0, t = Hl(t);
  const u = [];
  async function f(l, d) {
    const {
      baseUrl: p,
      fetch: h = r,
      Request: m = n,
      headers: g,
      params: _ = {},
      parseAs: y = "json",
      querySerializer: b,
      bodySerializer: E = o ?? mA,
      body: S,
      ...w
    } = d || {};
    p && (t = Hl(p));
    let T = typeof s == "function" ? s : Wl(s);
    b && (T = typeof b == "function" ? b : Wl({
      ...typeof s == "object" ? s : {},
      ...b
    }));
    const N = S === void 0 ? void 0 : E(S), k = (
      // with no body, we should not to set Content-Type
      N === void 0 || // if serialized body is FormData; browser will correctly set Content-Type & boundary expression
      N instanceof FormData ? {} : {
        "Content-Type": "application/json"
      }
    ), v = {
      redirect: "follow",
      ...c,
      ...w,
      body: N,
      headers: yA(k, i, g, _.header)
    };
    let M, P, C = new n(gA(l, { baseUrl: t, params: _, querySerializer: T }), v), I;
    for (const R in w)
      R in C || (C[R] = w[R]);
    if (u.length) {
      M = fA(), P = Object.freeze({
        baseUrl: t,
        fetch: h,
        parseAs: y,
        querySerializer: T,
        bodySerializer: E
      });
      for (const R of u)
        if (R && typeof R == "object" && typeof R.onRequest == "function") {
          const X = await R.onRequest({
            request: C,
            schemaPath: l,
            params: _,
            options: P,
            id: M
          });
          if (X)
            if (X instanceof n)
              C = X;
            else if (X instanceof Response) {
              I = X;
              break;
            } else
              throw new Error("onRequest: must return new Request() or Response() when modifying the request");
        }
    }
    if (!I) {
      try {
        I = await h(C, a);
      } catch (R) {
        let X = R;
        if (u.length)
          for (let F = u.length - 1; F >= 0; F--) {
            const ue = u[F];
            if (ue && typeof ue == "object" && typeof ue.onError == "function") {
              const x = await ue.onError({
                request: C,
                error: X,
                schemaPath: l,
                params: _,
                options: P,
                id: M
              });
              if (x) {
                if (x instanceof Response) {
                  X = void 0, I = x;
                  break;
                }
                if (x instanceof Error) {
                  X = x;
                  continue;
                }
                throw new Error("onError: must return new Response() or instance of Error");
              }
            }
          }
        if (X)
          throw X;
      }
      if (u.length)
        for (let R = u.length - 1; R >= 0; R--) {
          const X = u[R];
          if (X && typeof X == "object" && typeof X.onResponse == "function") {
            const F = await X.onResponse({
              request: C,
              response: I,
              schemaPath: l,
              params: _,
              options: P,
              id: M
            });
            if (F) {
              if (!(F instanceof Response))
                throw new Error("onResponse: must return new Response() when modifying the response");
              I = F;
            }
          }
        }
    }
    if (I.status === 204 || I.headers.get("Content-Length") === "0")
      return I.ok ? { data: void 0, response: I } : { error: void 0, response: I };
    if (I.ok)
      return y === "stream" ? { data: I.body, response: I } : { data: await I[y](), response: I };
    let O = await I.text();
    try {
      O = JSON.parse(O);
    } catch {
    }
    return { error: O, response: I };
  }
  return {
    request(l, d, p) {
      return f(d, { ...p, method: l.toUpperCase() });
    },
    /** Call a GET endpoint */
    GET(l, d) {
      return f(l, { ...d, method: "GET" });
    },
    /** Call a PUT endpoint */
    PUT(l, d) {
      return f(l, { ...d, method: "PUT" });
    },
    /** Call a POST endpoint */
    POST(l, d) {
      return f(l, { ...d, method: "POST" });
    },
    /** Call a DELETE endpoint */
    DELETE(l, d) {
      return f(l, { ...d, method: "DELETE" });
    },
    /** Call a OPTIONS endpoint */
    OPTIONS(l, d) {
      return f(l, { ...d, method: "OPTIONS" });
    },
    /** Call a HEAD endpoint */
    HEAD(l, d) {
      return f(l, { ...d, method: "HEAD" });
    },
    /** Call a PATCH endpoint */
    PATCH(l, d) {
      return f(l, { ...d, method: "PATCH" });
    },
    /** Call a TRACE endpoint */
    TRACE(l, d) {
      return f(l, { ...d, method: "TRACE" });
    },
    /** Register middleware */
    use(...l) {
      for (const d of l)
        if (d) {
          if (typeof d != "object" || !("onRequest" in d || "onResponse" in d || "onError" in d))
            throw new Error("Middleware must be an object with one of `onRequest()`, `onResponse() or `onError()`");
          u.push(d);
        }
    },
    /** Unregister middleware */
    eject(...l) {
      for (const d of l) {
        const p = u.indexOf(d);
        p !== -1 && u.splice(p, 1);
      }
    }
  };
}
function yi(e, t, n) {
  if (t == null)
    return "";
  if (typeof t == "object")
    throw new Error(
      "Deeply-nested arrays/objects aren’t supported. Provide your own `querySerializer()` to handle these."
    );
  return `${e}=${n?.allowReserved === !0 ? t : encodeURIComponent(t)}`;
}
function xh(e, t, n) {
  if (!t || typeof t != "object")
    return "";
  const r = [], s = {
    simple: ",",
    label: ".",
    matrix: ";"
  }[n.style] || "&";
  if (n.style !== "deepObject" && n.explode === !1) {
    for (const a in t)
      r.push(a, n.allowReserved === !0 ? t[a] : encodeURIComponent(t[a]));
    const i = r.join(",");
    switch (n.style) {
      case "form":
        return `${e}=${i}`;
      case "label":
        return `.${i}`;
      case "matrix":
        return `;${e}=${i}`;
      default:
        return i;
    }
  }
  for (const i in t) {
    const a = n.style === "deepObject" ? `${e}[${i}]` : i;
    r.push(yi(a, t[i], n));
  }
  const o = r.join(s);
  return n.style === "label" || n.style === "matrix" ? `${s}${o}` : o;
}
function Oh(e, t, n) {
  if (!Array.isArray(t))
    return "";
  if (n.explode === !1) {
    const o = { form: ",", spaceDelimited: "%20", pipeDelimited: "|" }[n.style] || ",", i = (n.allowReserved === !0 ? t : t.map((a) => encodeURIComponent(a))).join(o);
    switch (n.style) {
      case "simple":
        return i;
      case "label":
        return `.${i}`;
      case "matrix":
        return `;${e}=${i}`;
      // case "spaceDelimited":
      // case "pipeDelimited":
      default:
        return `${e}=${i}`;
    }
  }
  const r = { simple: ",", label: ".", matrix: ";" }[n.style] || "&", s = [];
  for (const o of t)
    n.style === "simple" || n.style === "label" ? s.push(n.allowReserved === !0 ? o : encodeURIComponent(o)) : s.push(yi(e, o, n));
  return n.style === "label" || n.style === "matrix" ? `${r}${s.join(r)}` : s.join(r);
}
function Wl(e) {
  return function(n) {
    const r = [];
    if (n && typeof n == "object")
      for (const s in n) {
        const o = n[s];
        if (o != null) {
          if (Array.isArray(o)) {
            if (o.length === 0)
              continue;
            r.push(
              Oh(s, o, {
                style: "form",
                explode: !0,
                ...e?.array,
                allowReserved: e?.allowReserved || !1
              })
            );
            continue;
          }
          if (typeof o == "object") {
            r.push(
              xh(s, o, {
                style: "deepObject",
                explode: !0,
                ...e?.object,
                allowReserved: e?.allowReserved || !1
              })
            );
            continue;
          }
          r.push(yi(s, o, e));
        }
      }
    return r.join("&");
  };
}
function hA(e, t) {
  let n = e;
  for (const r of e.match(lA) ?? []) {
    let s = r.substring(1, r.length - 1), o = !1, i = "simple";
    if (s.endsWith("*") && (o = !0, s = s.substring(0, s.length - 1)), s.startsWith(".") ? (i = "label", s = s.substring(1)) : s.startsWith(";") && (i = "matrix", s = s.substring(1)), !t || t[s] === void 0 || t[s] === null)
      continue;
    const a = t[s];
    if (Array.isArray(a)) {
      n = n.replace(r, Oh(s, a, { style: i, explode: o }));
      continue;
    }
    if (typeof a == "object") {
      n = n.replace(r, xh(s, a, { style: i, explode: o }));
      continue;
    }
    if (i === "matrix") {
      n = n.replace(r, `;${yi(s, a)}`);
      continue;
    }
    n = n.replace(r, i === "label" ? `.${encodeURIComponent(a)}` : encodeURIComponent(a));
  }
  return n;
}
function mA(e) {
  return e instanceof FormData ? e : JSON.stringify(e);
}
function gA(e, t) {
  let n = `${t.baseUrl}${e}`;
  t.params?.path && (n = hA(n, t.params.path));
  let r = t.querySerializer(t.params.query ?? {});
  return r.startsWith("?") && (r = r.substring(1)), r && (n += `?${r}`), n;
}
function yA(...e) {
  const t = new Headers();
  for (const n of e) {
    if (!n || typeof n != "object")
      continue;
    const r = n instanceof Headers ? n.entries() : Object.entries(n);
    for (const [s, o] of r)
      if (o === null)
        t.delete(s);
      else if (Array.isArray(o))
        for (const i of o)
          t.append(s, i);
      else o !== void 0 && t.set(s, o);
  }
  return t;
}
function Hl(e) {
  return e.endsWith("/") ? e.substring(0, e.length - 1) : e;
}
function _A(e) {
  return pA(e);
}
const bA = cA(_A), wA = {
  MEDIUM: 5e3
}, _n = "mission_control_status", Lh = async (e, t, n, r = !1) => {
  const s = await za(
    {
      url: "about:blank",
      active: !1,
      windowId: n
    },
    {
      hidden: !0,
      historical: !1,
      payload: JSON.stringify({
        type: "agents",
        task_uuid: e
      })
    }
  );
  return chrome.tabs.update(s.id, { muted: !0 }).catch((o) => Le({ error: o, logger: t })), await $A(s.id, r).catch(
    (o) => Le({ error: o, logger: t })
  ), s;
};
function Ua(e, t) {
  if (!e)
    throw new EA(t);
}
let EA = class extends Error {
  constructor(t) {
    super(t), this.name = "AssertionError";
  }
};
const Mo = async (e) => {
  const t = e?.tab?.windowId ?? chrome.windows.WINDOW_ID_CURRENT, n = t === -1 ? chrome.windows.WINDOW_ID_CURRENT : t, [r] = await Ls({
    active: !0,
    windowId: n
  });
  if (!r)
    throw new Error("No active tab found in window");
  return r;
}, Wc = (e = 5e3) => (t) => function(...n) {
  const r = new er(`Timed out after ${e}ms`), s = It(e, r, !0), o = t.apply(this, n);
  return Promise.race([o, s]);
}, It = (e, t, n = !1) => new Promise((r, s) => setTimeout(n ? s : r, e, t));
class er extends Error {
  constructor(t) {
    super(t), this.name = "TimeoutError";
  }
}
let Zs;
const Nh = async () => {
  if (Zs) return Zs;
  const { os: e } = await chrome.runtime.getPlatformInfo();
  return Zs = e, Zs;
}, SA = ["YW1hem9u", "LmNvbSxh", "bWF6b24u", "Y28udWss", "YW1hem9u"], TA = ["LmRlLGFt", "YXpvbi5m", "cixhbWF6", "b24uaXQs", "YW1hem9u"], vA = ["LmVzLGFt", "YXpvbi5j", "YSxhbWF6", "b24uY29t", "LmF1LGFt"], IA = ["YXpvbi5j", "by5qcCxh", "bWF6b24u", "aW4sYW1h", "em9uLmNv"], kA = ["bS5icixh", "bWF6b24u", "Y29tLm14", "LGFtYXpv", "bi5ubCxh"], CA = ["bWF6b24u", "c2UsYW1h", "em9uLnBs", "LGFtYXpv", "bi5jb20u"], AA = ["dHIsYW1h", "em9uLmFl", "LGFtYXpv", "bi5zYQ=="], Fa = atob(
  [
    ...SA,
    ...TA,
    ...vA,
    ...IA,
    ...kA,
    ...CA,
    ...AA
  ].join("")
).split(","), RA = async (e) => {
  const t = await Ve(e), n = t?.pendingUrl ?? t?.url;
  if (!n) return !1;
  try {
    const s = new URL(n).hostname.toLowerCase();
    return Fa.some((o) => s.includes(o));
  } catch {
    return !1;
  }
}, xA = [
  // amzn-ctxv-id
  atob("YW16bi1jdHh2LWlk"),
  // _bvstr
  atob("X2J2c3Ry")
];
async function OA() {
  try {
    let e = !1;
    for (const t of Fa) {
      const n = [`https://${t}`, `https://www.${t}`];
      for (const r of n)
        for (const s of xA)
          try {
            const o = await chrome.cookies.get({
              url: r,
              name: s
            });
            o && (await chrome.cookies.remove({
              url: r,
              name: s,
              storeId: o.storeId
            }), e = !0);
          } catch {
          }
    }
    if (e)
      try {
        const n = (await chrome.tabs.query({})).filter((r) => {
          if (!r.url) return !1;
          try {
            const s = new URL(r.url).hostname.toLowerCase();
            return Fa.some((o) => s?.includes(o));
          } catch {
            return !1;
          }
        });
        for (const r of n)
          if (r.id)
            try {
              await chrome.tabs.reload(r.id);
            } catch {
            }
      } catch {
      }
  } catch {
  }
}
class $a {
  [Symbol.toStringTag] = "[object Future]";
  resolve;
  reject;
  promise;
  constructor() {
    let t = () => {
    }, n = () => {
    };
    this.promise = new Promise((r, s) => {
      t = r, n = s;
    }), this.resolve = t, this.reject = n;
  }
  then = (t, n) => this.promise.then(t, n);
  catch = (t) => this.promise.catch(t);
  finally = (t) => this.promise.finally(t);
}
const Ba = async (e) => {
  const r = (await chrome.tabs.query({ windowId: e })).filter(
    (l) => l && l.id && (l.url?.includes("/b/mission-control") || l.url?.includes("/b/assistants"))
  )[0];
  if (r === void 0) {
    chrome.perplexity.mission_control.hideBadge(e), chrome.perplexity.mission_control.setAgentWorking(e, !1);
    return;
  }
  const s = await chrome.storage.local.get(
    _n
  );
  if (!s[_n] || typeof s[_n].numThreadsActive != "number" || typeof s[_n].numThreadsBlocked != "number" || typeof s[_n].numThreadsForReview != "number")
    return;
  const { numThreadsActive: o, numThreadsBlocked: i, numThreadsForReview: a } = s[_n], c = o > 0, u = i > 0;
  let f;
  if (i > 0 ? f = `${i}` : a > 0 && (f = `${a}`), r.id)
    try {
      chrome.perplexity.mission_control.setAgentWorking(
        r.windowId,
        c
      ), chrome.perplexity.mission_control.setBadgeNeedsAttention(
        r.windowId,
        u
      ), f === void 0 ? chrome.perplexity.mission_control.hideBadge(r.windowId) : chrome.perplexity.mission_control.setBadgeText(
        r.windowId,
        f
      );
    } catch {
    }
}, Mh = async (e, t) => fc ? $(
  e,
  "Input.pasteFromString",
  {
    text: t
  },
  "tryPasteFromString"
).then(() => !0).catch(() => !1) : !1, LA = [
  "http:",
  "https:",
  // So we're not blocking our own extensions
  "chrome-extension:",
  // WebSockets are fine
  "ws:",
  "wss:",
  // Files & inline data are fine
  "file:",
  "data:"
], Va = /* @__PURE__ */ new Map(), Hn = async (e) => {
  const t = { tabId: e };
  async function n(s, o, i) {
    if (s.tabId === e && o === "Fetch.requestPaused" && i) {
      const a = i, { requestId: c, request: u } = a, f = new URL(u.url);
      try {
        LA.includes(f.protocol) ? await $(
          s,
          "Fetch.continueRequest",
          {
            requestId: c
          },
          "attachDebugger"
        ) : await $(
          s,
          "Fetch.failRequest",
          {
            requestId: c,
            errorReason: "BlockedByClient"
          },
          "attachDebugger"
        );
      } catch {
      }
    }
  }
  try {
    await chrome.debugger.attach(t, "1.3"), await Promise.all([
      $(
        t,
        "DOM.enable",
        void 0,
        "attachDebugger"
      ),
      $(
        t,
        "Page.enable",
        void 0,
        "attachDebugger"
      ),
      $(
        t,
        "Network.enable",
        void 0,
        "attachDebugger"
      ),
      $(
        t,
        "DOMSnapshot.enable",
        void 0,
        "attachDebugger"
      ),
      $(
        t,
        "Accessibility.enable",
        void 0,
        "attachDebugger"
      ),
      $(
        t,
        "Page.setLifecycleEventsEnabled",
        {
          enabled: !0
        },
        "attachDebugger"
      ),
      $(
        t,
        "Emulation.setFocusEmulationEnabled",
        {
          enabled: !0
        },
        "attachDebugger"
      ),
      $(
        t,
        "Fetch.enable",
        {
          patterns: [{ urlPattern: "*://*/*" }]
        },
        "attachDebugger"
      ),
      $(
        t,
        "Page.setInterceptFileChooserDialog",
        {
          enabled: !0
        },
        "attachDebugger"
      )
    ]), chrome.debugger.onEvent.addListener(n);
  } catch (s) {
    if (!(s instanceof Error) || !(s.message.includes("Already attached") || s.message.includes("Another debugger")))
      throw s;
  }
  const r = async () => {
    Va.delete(e), chrome.debugger.onEvent.removeListener(n);
    try {
      await chrome.debugger.detach({ tabId: e });
    } catch (s) {
      if (s instanceof Error && s.message.includes("No tab with given id"))
        return;
      throw s;
    }
  };
  return Va.set(e, r), r;
}, Gl = async (e) => {
  const t = Va.get(e);
  if (!t)
    throw new Error("Debugger not attached");
  await t();
};
async function NA(e) {
  try {
    return (await chrome.debugger.sendCommand(
      e,
      "Runtime.evaluate",
      {
        expression: "document.readyState",
        returnByValue: !0
      }
    )).result?.value;
  } catch {
    return null;
  }
}
async function MA(e, t) {
  const n = performance.now(), r = 200;
  for (; performance.now() - n < t; )
    if (await Promise.race([
      new Promise((o) => {
        NA(e).then((i) => {
          i && i !== "loading" && o(!0);
        });
      }),
      new Promise(
        (o) => setTimeout(() => o(!1), r)
      )
    ]))
      return;
  throw new er(`Document ready timeout after ${t}ms`);
}
async function $(e, t, n, r, s = 1e4, o = G) {
  const i = performance.now();
  return t === "Page.captureScreenshot" && (await MA(e, s), s = s - (performance.now() - i)), new Promise((a, c) => {
    let u = !1;
    const f = setTimeout(() => {
      if (u) return;
      u = !0;
      const l = t.startsWith("Fetch."), d = performance.now() - i;
      l || o.error("[Debugger] Command timed out", {
        method: t,
        reason: r,
        ...e,
        duration: `${d.toFixed(2)}ms`
      }), c(new er(`Debugger command timed out: ${t}`));
    }, s);
    chrome.debugger.sendCommand(e, t, n).then((l) => {
      u || (u = !0, clearTimeout(f), a(l));
    }).catch((l) => {
      u || (u = !0, clearTimeout(f), c(l));
    });
  });
}
class PA {
  isSearchEnabled = () => this.#e("perplexity.history_search_enabled", !0);
  async getManagedBlockedDomains() {
    try {
      return (await chrome.storage.managed.get(
        "BlockedDomains"
        /* BlockedDomains */
      )).BlockedDomains ?? [];
    } catch {
      return [];
    }
  }
  async isUrlBlockedByAdmin(t) {
    const n = await this.getManagedBlockedDomains();
    if (n.length === 0)
      return !1;
    const r = zl(t);
    return n.some(
      (s) => r === s || r.endsWith(`.${s}`)
    );
  }
  /**
   * Extension cannot scrape or manipulate internal pages
   */
  isInternalPage(t) {
    return !!(t.startsWith("chrome://") || t.startsWith(`${So}://`) || t.startsWith("chrome-extension://") || t.startsWith(`${So}-extension://`));
  }
  async isUrlBlocked(t) {
    if (this.isInternalPage(t))
      return !0;
    const n = [
      // Documents
      ".pdf",
      ".docx",
      ".xlsx",
      ".pptx",
      // Images
      ".png",
      ".jpg",
      ".jpeg",
      ".webp",
      ".svg",
      ".gif",
      ".bmp",
      ".ico",
      // Web/Markdown
      ".html",
      ".htm",
      ".md",
      ".markdown",
      // Media
      ".mp4",
      ".mov",
      ".avi",
      ".mp3",
      ".wav"
    ];
    if (t.startsWith("file://") && !n.some((o) => t.endsWith(o)) || await this.isUrlBlockedByAdmin(t))
      return !0;
    if (!Me)
      return !1;
    if (chrome.perplexity.blacklist) {
      const o = zl(t);
      return chrome.perplexity.blacklist.isDomainInBlacklist(
        o,
        chrome.perplexity.blacklist.BlacklistSource.ALL
      );
    }
    const r = await chrome.settingsPrivate.getPref(
      "perplexity.client_context_domains_blacklist"
    );
    return Ua(
      r.type === chrome.settingsPrivate.PrefType.LIST,
      "client_context_domains_blacklist is not a list."
    ), r.value.some((o) => t.startsWith(o));
  }
  async getBackendUrl() {
    if (!Me && !process.env.NEXT_PUBLIC_REST_ASYNC_SERVER_URL)
      throw new Error("NEXT_PUBLIC_REST_ASYNC_SERVER_URL is not set");
    return chrome.settingsPrivate.getPerplexityBackendUrl() || process.env.NEXT_PUBLIC_REST_ASYNC_SERVER_URL;
  }
  async getRestAsyncServerUrl() {
    const t = await this.getBackendUrl();
    return t.includes("localhost") ? "http://localhost:5056" : t;
  }
  async #e(t, n) {
    if (!Me)
      return n;
    try {
      const r = await chrome.settingsPrivate.getPref(t);
      return Ua(
        r.type === chrome.settingsPrivate.PrefType.BOOLEAN,
        `${t} is not a boolean.`
      ), r.value;
    } catch {
      return n;
    }
  }
}
const $e = new PA(), zl = (e) => {
  try {
    return new URL(e).hostname;
  } catch {
    return e;
  }
}, Ne = /* @__PURE__ */ new Map(), Ph = /* @__PURE__ */ new Set(), At = /* @__PURE__ */ new Map(), Kl = [
  "blue",
  "cyan",
  "green",
  "grey",
  "orange",
  "pink",
  "purple",
  "red",
  "yellow"
];
let Qs = -1;
const DA = () => (Qs++, Qs >= Kl.length && (Qs = 0), Kl[Qs] ?? "blue"), Xi = /* @__PURE__ */ new Set();
function UA(e, t, n = !1) {
  let r;
  return function(...s) {
    const o = n && !r;
    r && clearTimeout(r), r = setTimeout(() => {
      r = null, n || e(...s);
    }, t), o && e(...s);
  };
}
function FA(e, t) {
  return new Promise((n) => {
    setTimeout(() => n(t), e);
  });
}
const kn = (e = "") => {
  let t = e, n = "";
  try {
    const r = new URL(e);
    t = e && r.hostname, n = r.protocol;
  } catch {
  }
  return {
    domain: t,
    protocol: n,
    url: e
  };
}, $A = (e, t = !1) => {
  const n = [
    {
      id: jl(),
      priority: 1,
      action: {
        type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
        responseHeaders: [
          {
            header: "Content-Disposition",
            operation: chrome.declarativeNetRequest.HeaderOperation.REMOVE
          }
        ]
      },
      condition: {
        tabIds: [e],
        urlFilter: "*",
        resourceTypes: [chrome.declarativeNetRequest.ResourceType.MAIN_FRAME]
      }
    }
  ];
  return t && n.push({
    id: jl(),
    priority: 1,
    action: {
      type: chrome.declarativeNetRequest.RuleActionType.BLOCK
    },
    condition: {
      tabIds: [e],
      urlFilter: "*",
      resourceTypes: [
        chrome.declarativeNetRequest.ResourceType.OBJECT,
        chrome.declarativeNetRequest.ResourceType.MEDIA,
        chrome.declarativeNetRequest.ResourceType.FONT,
        chrome.declarativeNetRequest.ResourceType.IMAGE
      ]
    }
  }), chrome.declarativeNetRequest.updateSessionRules({
    addRules: n
  });
}, BA = async (e, t) => {
  const { tabId: n, scopedLogger: r } = e;
  let s = t;
  try {
    s = new URL(s).toString();
  } catch (o) {
    const i = await Ve(n);
    if (!i) {
      r.error(`Failed to navigate to removed tab: ${n}`);
      return;
    }
    const a = new URL(i.pendingUrl ?? i.url ?? "");
    s = new URL(t, a.origin).toString(), r.warn(
      `Trying to execute relative URL: ${t}, replaced with ${s}, ${o}`
    );
  }
  await chrome.tabs.update(n, {
    url: s
  });
}, Dh = 100, VA = 2 ** 31 - 1 - Dh, WA = Math.floor(Date.now() / 1e3);
let HA = Dh + WA % VA;
const jl = () => HA++, GA = (e) => e instanceof Error ? e.message.match(/Unexpected property: '([^']+)'/)?.[1] ?? null : null, Uh = async (e, t) => {
  const r = (await chrome.debugger.getTargets()).find((o) => o.id === e);
  if (!r)
    throw new Error("Target not found for frame ID: " + e);
  const s = {
    targetId: r.id
  };
  try {
    await chrome.debugger.attach(s, "1.3");
  } catch (o) {
    o instanceof Error && o.message.includes("Another debugger is already attached") || t?.warn("Failed to attach debugger to iframe", {
      error: o instanceof Error ? o.message : o
    });
  }
  try {
    await $(
      s,
      "Accessibility.enable",
      void 0,
      "attachDebuggerIframe"
    );
  } catch (o) {
    t?.warn("Failed to enable Accessibility or DOM for iframe", {
      error: o instanceof Error ? o.message : o
    });
  }
  return s;
};
async function Wa(e, t, n, r, s) {
  return (await $(
    t,
    "Runtime.callFunctionOn",
    {
      objectId: n,
      functionDeclaration: `function (...args) {return (${r.toString()}).apply(this, [this, ...args]);}`,
      returnByValue: !0,
      awaitPromise: !0,
      arguments: s?.map((i) => ({ value: i })) ?? []
    },
    e
  )).result?.value;
}
async function cs(e, t, n, r) {
  const s = r ? r.map((i) => JSON.stringify(i)).join(", ") : "", o = await $(
    t,
    "Runtime.evaluate",
    {
      expression: `(${n.toString()})(${s})`,
      returnByValue: !0,
      awaitPromise: !0
    },
    e
  );
  if (o.exceptionDetails)
    throw new Error(
      `Failed to evaluate function: ${JSON.stringify(o.exceptionDetails)}`
    );
  return o.result.value;
}
const zA = async (e, t, n, r) => {
  const o = (e ? await chrome.windows.get(e) : void 0)?.sidecarTabId ?? t.sidecarTabId;
  if (!o)
    return r.error(
      "[BROWSER_TASK_STOP] No sidecarTabId found to send stop message",
      { payload: t }
    ), !1;
  const i = Ne.get(o), a = {
    ...t,
    reason: n
  };
  return i ? (i?.postMessage({
    type: "BROWSER_TASK_STOP",
    payload: t
  }), r.info("[BROWSER_TASK_STOP] Browser task stop sent", a), !0) : (r.warn(
    "[BROWSER_TASK_STOP] Sidecar port not found, cannot send stop message",
    a
  ), !1);
}, Fh = "ref_", Ha = ":", Ga = (e) => {
  const t = e.replace(Fh, "");
  if (t.includes(Ha)) {
    const [r, s] = t.split(Ha), o = Number(s);
    return {
      targetId: r,
      backendNodeId: o
    };
  }
  return {
    backendNodeId: Number(t)
  };
}, KA = (e) => `[ref=${Fh}${e.targetId ? e.targetId + Ha : ""}${e.backendNodeId}]`, jA = async (e) => {
  if (e && !(!("inlineAssistant" in chrome.perplexity) || !("getBubbleInfoForTab" in chrome.perplexity.inlineAssistant)))
    try {
      return await chrome.perplexity.inlineAssistant.getBubbleInfoForTab(e);
    } catch {
      return;
    }
}, qA = (e) => {
  if (!e) return e;
  try {
    return new URL(e), e;
  } catch {
    return `https://${e}`;
  }
}, za = (e, t = {}) => {
  const n = {
    ...e,
    url: qA(e.url)
  };
  return Me ? chrome.tabs.create({
    ...n,
    ...t
  }) : chrome.tabs.create(n);
}, Ls = (e, t = {}) => Me ? chrome.tabs.query({
  ...e,
  ...t
}) : chrome.tabs.query(e), kt = (e) => (
  // eslint-disable-next-line no-restricted-syntax
  chrome.tabs.get(e)
), Ve = async (e) => {
  try {
    return await chrome.tabs.get(e);
  } catch (t) {
    if (t instanceof Error && t.message.includes("No tab with id"))
      return;
    throw t;
  }
}, Yi = async (e, t) => {
  if (Me)
    try {
      await chrome.tabs.update(e, t);
    } catch {
    }
}, Vt = async (e, t, n = {}) => {
  if (!Me)
    return chrome.tabs.update(e, t);
  try {
    return await chrome.tabs.update(e, {
      ...t,
      ...n
    });
  } catch (r) {
    const s = GA(r);
    if (s && s in n) {
      const {
        [s]: o,
        ...i
      } = n;
      return Vt(e, t, i);
    }
    throw r;
  }
}, dr = async (e, t) => {
  if (!Me) return;
  const n = await Ve(e);
  if (!n) return;
  const r = n.payload ? JSON.parse(n.payload) : {}, s = JSON.stringify({
    ...r,
    ...t.opened !== void 0 && {
      wasSidecarOpened: t.opened === "opened"
    },
    ...t.autoOpened !== void 0 && { auto_opened: t.autoOpened }
  });
  await Vt(
    n.id,
    {},
    {
      payload: s
    }
  );
}, Po = async (e) => e.splitId ? (await chrome.tabs.query({
  windowId: e.windowId
})).filter(
  (r) => r.id !== e.id && r.splitId === e.splitId
)[0] : void 0, XA = 5e3, YA = [
  "injectEventsScript",
  "injectContentScript",
  "injectGoogleDocsScript"
];
async function Pe(e, t, n = XA, r = G) {
  const s = performance.now(), o = e.target.tabId;
  try {
    return await Wc(n)(
      () => (
        // eslint-disable-next-line no-restricted-syntax
        chrome.scripting.executeScript(e)
      )
    )();
  } catch (i) {
    const a = performance.now() - s;
    throw i instanceof er && !YA.includes(t) && r.error("[executeScript] Script execution timed out", {
      reason: t,
      tabId: o,
      tab: await Ve(o).catch(() => {
      }),
      duration: `${a.toFixed(2)}ms`
    }), i;
  }
}
const eo = {
  ELEMENT_NODE: 1,
  TEXT_NODE: 3,
  DOCUMENT_FRAGMENT_NODE: 11
}, JA = (e, t, n, r, s, o, i, a, c, u) => {
  const f = t.nodes.nodeType?.[e];
  if (!(f === eo.ELEMENT_NODE || f === eo.TEXT_NODE || f === eo.DOCUMENT_FRAGMENT_NODE))
    return;
  const l = t.nodes.nodeName?.[e], d = t.nodes.nodeValue?.[e], p = t.nodes.backendNodeId?.[e], h = t.nodes.parentIndex?.[e], m = t.nodes.attributes?.[e];
  let g = n.get(e) ?? -1;
  if (f === eo.TEXT_NODE && g === -1 && (g = t.textBoxes.layoutIndex[e], g === void 0))
    return;
  const _ = a.has(e), y = c.has(e), b = u.has(e), E = r.get(e), S = s.get(e), w = o.get(e), T = i.get(e);
  return {
    attributes: m,
    nodeType: f,
    nodeName: l,
    nodeValue: d,
    backendNodeId: p,
    parentIndex: h,
    optionSelected: _,
    isClickable: y,
    inputChecked: b,
    shadowRootType: T,
    inputValue: S,
    textValue: E,
    contentDocumentIndex: w,
    layoutIndex: g
  };
}, $h = (e) => {
  const t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map();
  e.nodes.textValue?.index.forEach((l, d) => {
    r.set(l, e.nodes.textValue.value[d]);
  });
  const s = /* @__PURE__ */ new Map();
  e.nodes.inputValue?.index.forEach((l, d) => {
    s.set(l, e.nodes.inputValue.value[d]);
  });
  const o = /* @__PURE__ */ new Map();
  e.nodes.contentDocumentIndex?.index.forEach((l, d) => {
    o.set(l, e.nodes.contentDocumentIndex.value[d]);
  });
  const i = /* @__PURE__ */ new Map();
  e.nodes.shadowRootType?.index.forEach((l, d) => {
    i.set(l, e.nodes.shadowRootType.value[d]);
  });
  const a = new Set(e.nodes.optionSelected?.index), c = new Set(e.nodes.isClickable?.index), u = new Set(e.nodes.inputChecked?.index), f = /* @__PURE__ */ new Map();
  return e.layout.nodeIndex.forEach((l, d) => {
    f.set(l, d);
  }), e.nodes.parentIndex?.forEach((l, d) => {
    const p = JA(
      d,
      e,
      f,
      r,
      s,
      o,
      i,
      a,
      c,
      u
    );
    if (!p || (t.set(d, p), l < 0)) return;
    const h = n.get(l) ?? [];
    h.push(d), n.set(l, h);
  }), { nodeMap: t, childrenMap: n };
}, Ka = (e, t) => {
  const n = /* @__PURE__ */ new Map(), r = t?.attributes ?? [];
  for (let s = 0; s < r.length; s += 2) {
    const o = r[s], i = r[s + 1], a = e.strings[o]?.toLowerCase() ?? "", c = e.strings[i] ?? "";
    n.set(a, c);
  }
  return n;
}, ZA = (e, t) => {
  if (!e)
    return {
      meta: {},
      isPdf: t.mimeType === "application/pdf",
      nodesMetadata: /* @__PURE__ */ new Map()
    };
  const n = (l) => l === void 0 ? "" : e.strings[l] || "", r = e.documents[0];
  if (!r)
    return {
      meta: {},
      isPdf: t.mimeType === "application/pdf",
      nodesMetadata: /* @__PURE__ */ new Map()
    };
  const { nodeMap: s, childrenMap: o } = $h(r), i = () => {
    const l = o.get(0)?.[0];
    if (!l) return !1;
    const d = o.get(l)?.[1];
    if (!d) return !1;
    const p = o.get(d)?.[0];
    if (!p) return !1;
    const h = s.get(p);
    if (!h) return !1;
    const m = h.attributes?.map(n);
    return m?.includes("application/pdf") || m?.includes("application/x-pdf") || m?.includes("application/x-google-chrome-pdf");
  }, a = () => {
    const l = {}, d = o.get(0)?.[0];
    if (!d) return l;
    const p = o.get(d)?.[0];
    if (!p) return l;
    const h = o.get(p);
    if (!h?.length) return l;
    for (const m of h) {
      const g = s.get(m);
      if (!g || n(g.nodeName).toUpperCase() !== "META") continue;
      const y = Ka(e, g), b = y.get("property")?.toLowerCase(), E = y.get("name")?.toLowerCase(), S = y.get("content");
      if ((b?.startsWith("og:") || E === "description") && S) {
        const T = b?.replace("og:", "") ?? E;
        T && (l[T] = S);
      }
    }
    return l;
  }, c = i(), u = a(), f = /* @__PURE__ */ new Map();
  return e.documents.forEach(({ nodes: l, layout: d }) => {
    const p = /* @__PURE__ */ new Set();
    d.nodeIndex.forEach((h, m) => {
      const g = l.backendNodeId?.[h], _ = (e.strings[l.nodeName[h]] ?? "div").toLocaleLowerCase(), y = s.get(h), b = Ka(e, y), E = b.get("type") === "submit" && _ === "button", S = b.get("id")?.startsWith(Ed);
      E && f.set(g, {
        tag: _,
        isSubmitButton: E,
        isPartOfOverlay: S
      });
      const w = d.styles[m][0];
      if (e.strings[w] !== "pointer")
        return;
      p.add(g);
      const N = l.parentIndex[h] !== void 0 ? l.backendNodeId?.[l.parentIndex[h]] : void 0;
      p.has(N) || f.set(g, {
        cursorPointer: !0,
        tag: _,
        isSubmitButton: E,
        isPartOfOverlay: S
      });
    });
  }), {
    meta: u,
    isPdf: c ?? !1,
    nodesMetadata: f
  };
}, QA = "node", ja = {
  // Interactive
  link: "a",
  checkbox: "input",
  radio: "input",
  textbox: "input",
  searchbox: "input",
  combobox: "select",
  switch: "input",
  slider: "input",
  spinbutton: "input",
  // Structure
  heading: "h2",
  paragraph: "p",
  list: "ul",
  listitem: "li",
  row: "tr",
  cell: "td",
  columnheader: "th",
  rowheader: "th",
  default: "div",
  WebRoot: "body",
  RootWebArea: "body",
  MenuListPopup: "menu",
  dialog: "div",
  radiogroup: "fieldset",
  WebArea: "iframe",
  Iframe: "iframe",
  generic: "div",
  // Landmarks
  banner: "header",
  navigation: "nav",
  contentinfo: "footer",
  complementary: "aside",
  // Content
  region: "section",
  search: "div",
  image: "img",
  separator: "hr",
  LabelText: "label",
  strong: "b",
  DisclosureTriangle: "details"
}, qa = /* @__PURE__ */ new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr"
]), eR = async (e, t = {}) => {
  const { tabId: n } = e, r = performance.now(), s = await $(
    { tabId: n },
    "Accessibility.getRootAXNode",
    {},
    "getHtmlAXTree"
  ), o = [
    "StaticText",
    "link"
    //  'button', 'heading' // disabled for now
  ], i = await Promise.all(
    o.map(
      (d) => $(
        { tabId: n },
        "Accessibility.queryAXTree",
        {
          role: d,
          backendNodeId: s.node.backendDOMNodeId
        },
        "getHtmlAXTree"
      )
    )
  ), a = [
    s.node,
    ...i.flatMap((d) => d.nodes).sort((d, p) => d.backendDOMNodeId - p.backendDOMNodeId)
    // we need to sort everything to have parents before children
  ], c = performance.now() - r, u = performance.now(), f = await Do(
    e,
    t,
    a,
    /* @__PURE__ */ new Map()
  ), l = performance.now() - u;
  return {
    html: f,
    snapshot: a,
    meta: {},
    fetchTime: c,
    parseTime: l
  };
}, Bh = async (e, t = {}) => {
  const { tabId: n } = e, r = performance.now(), [s, o] = await Promise.all([
    // We only need this for cursor pointer nodes
    t.excludeDomMeta ? void 0 : $(
      { tabId: n },
      "DOMSnapshot.captureSnapshot",
      {
        computedStyles: ["cursor"],
        includePaintOrder: !1,
        includeDOMRects: !1,
        includeBlendedBackgroundColors: !1,
        includeTextColorOpacities: !1
      },
      "getHtmlAXTree"
    ),
    $(
      { tabId: n },
      "Accessibility.getFullAXTree",
      {},
      "getHtmlAXTree"
    )
  ]), { isPdf: i, meta: a, nodesMetadata: c } = ZA(s, t), u = performance.now() - r, f = performance.now(), l = await Do(
    e,
    t,
    o.nodes,
    c
  ), d = performance.now() - f;
  return { html: l, fetchTime: u, parseTime: d, snapshot: o.nodes, meta: a, isPdf: i };
};
async function Do(e, t, n, r, s) {
  const o = n.find((l) => !l.parentId);
  if (!o) return "";
  const i = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Map();
  for (const l of n) {
    const d = l.parentId;
    if (d && !a.get(d)) {
      i.add(l.nodeId), a.set(l.nodeId, {
        ...l,
        parentId: o.nodeId
      });
      continue;
    }
    a.set(l.nodeId, l);
  }
  a.get(o.nodeId)?.childIds?.push(...i);
  const c = /* @__PURE__ */ new Map();
  async function u(l) {
    if (c.has(l.nodeId)) return "";
    c.set(l.nodeId, l);
    const d = Qt(l.role);
    if (d === "StaticText")
      return Qt(l.name) || "";
    const p = r.get(l.backendDOMNodeId);
    if (p?.isPartOfOverlay)
      return "";
    const h = p?.cursorPointer ? p.tag : void 0, g = [
      "LayoutTable",
      "LayoutTableRow",
      "LayoutTableCell",
      "LineBreak",
      "InlineTextBox",
      "presentation",
      "none"
    ].includes(d);
    if (Rn(l, "hidden") === "true")
      return "";
    if (!h && (g || l.ignored))
      return await f(l);
    if (["ListMarker"].includes(d))
      return Qt(l.name);
    const _ = l.parentId ? c.get(l.parentId) : void 0, y = [];
    rR(l, y, _);
    const b = d === "generic" || d === "group";
    if (b && y.length === 0 && !Qt(l.name))
      return await f(l);
    const E = h ?? (g ? "div" : tR(d, l, _));
    if (E === "input" && (d === "checkbox" || d === "switch" ? y.push('type="checkbox"') : d === "radio" ? y.push('type="radio"') : d === "searchbox" ? y.push('type="search"') : d === "slider" ? y.push('type="range"') : d === "spinbutton" && y.push('type="number"')), l.value !== void 0 && E !== "textarea" && E !== "div") {
      const v = Qt(l.value);
      v && y.push(`value="${us(v)}"`);
    }
    !g && !b && d && nR(E, d) && y.push(`role="${d}"`);
    let S = "";
    E === "iframe" ? S = await oR(e, t, l, r) || "" : S = await f(l);
    const w = Qt(l.name);
    w && (!S && !qa.has(E) ? S = w : sR(E, w, S) && (E === "img" ? y.push(`alt="${us(w)}"`) : y.push(`aria-label="${us(w)}"`)));
    const T = p?.isSubmitButton;
    if (T && y.push('type="submit"'), Rn(l, "focusable") === "true" || h || T) {
      const v = s ? `${s}:${l.nodeId}` : l.nodeId;
      y.push(`${QA}="${v}"`);
    }
    if (!S && !y.length) return "";
    const N = y.length ? ` ${y.join(" ")}` : "";
    return qa.has(E) ? `<${E}${N}/>` : E === "iframe" && S ? S : `<${E}${N}>${S}</${E}>`;
  }
  async function f(l) {
    if (!l.childIds?.length) return "";
    const d = [];
    let p = !1;
    for (const h of l.childIds) {
      const m = a.get(h);
      if (m) {
        const g = await u(m);
        if (g) {
          const _ = !g.startsWith("<");
          _ && p && d.length > 0 && d.push("<br>"), d.push(g), p = _;
        }
      }
    }
    return d.join("");
  }
  return await u(o);
}
function Qt(e) {
  return !e || e.type === "valueUndefined" ? "" : String(e.value || "");
}
function Rn(e, t) {
  if (!e.properties) return "";
  const n = e.properties.find((r) => r.name === t);
  return n ? Qt(n.value) : "";
}
function tR(e, t, n) {
  if (ja[e]) {
    let r = ja[e];
    if (e === "heading") {
      const i = Rn(t, "level"), a = parseInt(i) || 2;
      a >= 1 && a <= 6 && (r = `h${a}`);
    }
    const s = n && Rn(n, "editable"), o = Rn(t, "editable");
    return !s && o ? o === "richtext" ? "div" : Rn(t, "multiline") ? "textarea" : "input" : r;
  }
  return e || "div";
}
function nR(e, t) {
  return !(t === e || ja[t] === e || e === "select" && t === "combobox" || e === "textarea" && t === "textbox" || ["h1", "h2", "h3", "h4", "h5", "h6"].includes(e) && t === "heading");
}
function rR(e, t, n) {
  if (e.properties)
    for (const r of e.properties) {
      const s = r.name, o = Qt(r.value);
      switch (s) {
        // Html boolean attributes
        case "disabled":
        case "readonly":
        case "required":
        case "checked":
        case "selected":
          o === "true" && t.push(s);
          break;
        // Aria boolean attributes
        case "busy":
        case "invalid":
        case "atomic":
        case "multiselectable":
        case "expanded":
        case "modal":
        case "pressed":
          o === "true" && t.push(`aria-${s}="true"`);
          break;
        // Aria literal values
        // @ts-expect-error - placeholder not listed in the protocol
        case "placeholder":
        case "keyshortcuts":
        case "roledescription":
        case "live":
        case "relevant":
        case "autocomplete":
        case "hasPopup":
        case "valuemin":
        case "valuemax":
        case "valuetext":
        case "errormessage":
          o && t.push(`aria-${s.toLowerCase()}="${o}"`);
          break;
        // Special cases
        case "focused":
          o === "true" && t.push('aria-current="true"');
          break;
        case "url":
          if (o && !o.startsWith("data:") && // too big to be referenced
          !o.startsWith("blob:") && // cannot be referenced
          !o.startsWith("file:")) {
            let i = o;
            i.startsWith("javascript:") && (i = "#"), e.role?.value === "image" ? t.push(`src="${us(i)}"`) : t.push(`href="${us(i)}"`);
          }
          break;
        case "editable":
          o === "richtext" && (n && Rn(n, "editable") || t.push('contenteditable="true"'));
          break;
        case "hiddenRoot":
          o === "true" && t.push('aria-hidden="true"');
          break;
        // No-op - handled elsewhere or ignored
        case "focusable":
        case "root":
        case "level":
        case "hidden":
        case "multiline":
        case "settable":
        // Implied
        case "orientation":
          break;
        // Refer to element ids which we don't keep
        case "actions":
        case "describedby":
        case "activedescendant":
        case "controls":
        case "details":
        case "labelledby":
        case "owns":
        case "flowto":
          break;
        default:
          throw new Error(`Unknown AXNode property: ${s}`);
      }
    }
}
function sR(e, t, n) {
  if (qa.has(e))
    return !0;
  const r = n.replace(/<[^>]*>/g, "").replace(/\s+/g, "").toLowerCase(), s = /(aria-label|alt)="([^"]*)"/g, o = (n.match(s) || []).map((a) => a.replace(s, "$2")).join("").replace(/\s+/g, "").toLowerCase(), i = t.replace(/\s+/g, "").toLowerCase();
  return !r.includes(i) && !o.includes(i);
}
function us(e) {
  return e.replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
async function oR(e, t, n, r) {
  if (!n.backendDOMNodeId)
    return null;
  try {
    const s = await $(
      { tabId: e.tabId },
      "DOM.describeNode",
      {
        backendNodeId: n.backendDOMNodeId,
        depth: -1
      },
      "getHtmlAXTree"
    );
    if (!s.node.frameId)
      return e.scopedLogger.info(
        "Skipping iframe without frameId to prevent recursion",
        s
      ), null;
    try {
      const o = await $(
        { tabId: e.tabId },
        "Accessibility.getFullAXTree",
        {
          frameId: s.node.frameId
        },
        "getHtmlAXTree"
      );
      return await Do(
        e,
        t,
        o.nodes,
        r
      );
    } catch (o) {
      const i = s.node.attributes?.findIndex(
        (f) => f === "src"
      ), a = i !== void 0 && i !== -1 ? s.node.attributes?.[i + 1] : void 0;
      if (a?.startsWith("chrome-extension://"))
        return "";
      e.scopedLogger.info(
        "Switched to new target for iframe:",
        o,
        a,
        s.node
      );
      const c = await Uh(
        s.node.frameId,
        e.scopedLogger
      ), u = await $(
        c,
        "Accessibility.getFullAXTree",
        {},
        "getHtmlAXTree"
      );
      return await Do(
        e,
        t,
        u.nodes,
        r,
        c.targetId
      );
    }
  } catch (s) {
    e.scopedLogger.error("Error describing iframe node:", s, n);
  }
  return null;
}
const iR = 350, Vh = 15e3;
function wr(e) {
  return aR(e, {
    idleTimeout: 500,
    concurrency: 0
  });
}
function aR({ tabContext: e, config: t, onFirstPaint: n }, r) {
  const s = performance.now();
  let o = () => {
  }, i = () => {
  }, a = null, c = !1;
  const u = [], f = /* @__PURE__ */ new Set();
  let l;
  const d = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Map();
  let h = !1, m = null, g = "text/html", _ = null, y = null;
  const b = () => {
    y && clearTimeout(y);
  }, E = (x = 500) => {
    b(), y = setTimeout(() => {
      p.size || o(!0);
    }, x);
  };
  let S = null;
  const w = () => {
    S && clearTimeout(S);
  }, T = (x = 500) => {
    w(), S = setTimeout(() => {
      i();
    }, x);
  };
  let N = !1;
  const k = (x, A) => {
    const B = t.waitForFCP ? N : !0;
    A === "Accessibility.loadComplete" ? (N = !0, T(350)) : A === "Accessibility.nodesUpdated" && B && T(250);
  };
  function v(x) {
    const A = [], B = [
      "https://mail.google.com/",
      "https://www.amazon.com/",
      "https://music.amazon.com/"
    ];
    return A.some(
      (L) => x.startsWith(L)
    ) ? null : B.some(
      (L) => x.startsWith(L)
    ) ? k : null;
  }
  chrome.debugger.onEvent.addListener(M);
  function M(x, A, B) {
    if (!(!(p.has(x.targetId ?? "") || x.tabId === e.tabId) || !B)) {
      if (a?.(x, A, B), A === "Page.frameAttached" && p.set(B.frameId, void 0), A === "Page.frameDetached") {
        const L = B.frameId, ge = p.get(L);
        p.delete(L), ge && (f.delete(ge), o());
      }
      if (A === "Page.navigatedWithinDocument" && B.navigationType === "historyApi" && t.useExperimentalEvents && (m = !0, u.push(A), b()), A === "Page.domContentEventFired" && (m = m || !1), A === "Page.lifecycleEvent" && ["networkAlmostIdle", "networkIdle"].includes(B.name) && t.useExperimentalEvents && b(), m === !1 && ["Accessibility.loadComplete", "Accessibility.nodesUpdated"].includes(
        A
      ) && t.useExperimentalEvents && E(A === "Accessibility.nodesUpdated" ? 250 : 350), A.startsWith("Accessibility.") && u.push(A), (A === "Page.lifecycleEvent" || A === "Page.navigatedWithinDocument") && (u.push(B.name), B.name === "firstContentfulPaint" && (h = !0, n?.(), o())), A === "Network.requestWillBeSent") {
        const L = B, ge = L.request.method, ne = [
          "Fetch",
          "XHR",
          "WebSocket",
          "EventSource",
          "Document"
        ].includes(L.type ?? ""), ye = [
          "GET",
          "OPTIONS",
          "HEAD",
          "POST"
        ].includes(ge);
        if (!ne || !ye || L.request.initialPriority === "VeryLow" || L.request.initialPriority === "Low")
          return;
        if (L.type === "Document")
          !c && L.initiator.type === "other" ? (c = !0, f.add(L.requestId), _ = L.requestId, a || (a = v(L.documentURL))) : (L.frameId && p.has(L.frameId) && p.set(L.frameId, L.requestId), f.add(L.requestId));
        else {
          if (ge !== "POST") {
            P(L.requestId);
            return;
          }
          if (L.request.url.includes("browser-intake-datadoghq.com"))
            return;
          // custom amazon protocol for music.amazon.com
          L.request.headers?.["Content-Type"]?.includes(
            "text/plain"
          ) || L.request.postData?.includes('"query":"{') || // Graphql
          L.request.postData?.includes('"jsonrpc"') || // JSON-RPC
          L.request.postData?.includes('"persistedquery"') ? f.add(L.requestId) : P(L.requestId);
          return;
        }
      }
      if (f.has(B.requestId)) {
        if (["Network.loadingFailed", "Network.loadingFinished"].includes(A)) {
          const L = B;
          [...p.entries()].find(([ge, ne]) => ne !== L.requestId ? !1 : (p.delete(ge), !0)), C(B.requestId);
          return;
        }
        if (A === "Network.responseReceived") {
          const L = B;
          if (L.requestId === _ && (g = L.response.mimeType, ["text/html", "application/xhtml+xml"].includes(
            g
          ) || (h = !0, o(), u.push("OverrideFCP:" + g))), L.response.mimeType === "text/css") {
            C(B.requestId);
            return;
          }
        }
        if ([
          "Network.dataReceived",
          "Network.responseReceived",
          "Network.responseReceivedExtraInfo",
          "Network.requestWillBeSentExtraInfo"
        ].includes(A)) {
          d.get(B.requestId)?.();
          return;
        }
      }
    }
  }
  function P(x) {
    f.add(x), d.set(
      x,
      UA(() => C(x), 250)
    ), setTimeout(() => {
      d.get(x)?.();
    }, 500);
  }
  function C(x) {
    f.delete(x), d.delete(x), o();
  }
  function I(x, A, B) {
    !O(A) || t.waitForFCP && !h || (l && clearTimeout(l), l = setTimeout(() => {
      O(A) && R(B);
    }, x));
  }
  function O(x) {
    return f.size <= x;
  }
  function R(x) {
    X(), x();
  }
  function X() {
    chrome.debugger.onEvent.removeListener(M);
  }
  const F = (x) => {
    const A = performance.now() - s;
    kt(e.tabId).then((B) => {
      const Te = B.pendingUrl || B.url, Se = kn(Te);
      e.scopedLogger.info("networkIdle", {
        result: x,
        time: A,
        ...t,
        ...Se,
        mainDocumentMimeType: g,
        lifecycleEventItems: u,
        inprogressRequests: f.size,
        inprogressFrames: p.size
      });
    }).catch(
      (B) => Le({ error: B, logger: e.scopedLogger })
    );
  };
  return {
    wait: async () => {
      const x = new Promise(
        (Se) => {
          const L = () => {
            Se("defaultIdle");
          };
          o = (ge) => {
            if (ge) {
              R(L);
              return;
            }
            I(
              r.idleTimeout,
              r.concurrency,
              L
            );
          }, I(iR, 0, () => {
            Se("initialCheckIdle");
          });
        }
      ), A = new Promise((Se) => {
        i = () => {
          R(() => {
            Se("customIdle");
          });
        }, kt(e.tabId).then((L) => {
          if (a) return;
          const ge = L.pendingUrl || L.url;
          ge && (a = v(ge));
        }).catch(
          (L) => Le({ error: L, logger: e.scopedLogger })
        );
      }), B = FA(
        t.maxWaitingTimeoutMs ?? Vh,
        "timeout"
      ), Te = await Promise.race([
        x,
        A,
        B
      ]);
      return F(Te), {
        result: Te,
        mimeType: g
      };
    }
  };
}
const ql = 250, cR = async (e, t) => {
  const n = performance.now();
  for (; performance.now() - n < t; ) {
    const { result: r } = await $(
      { tabId: e.tabId },
      "Runtime.evaluate",
      {
        expression: "document.readyState",
        returnByValue: !0
      },
      "waitForDocumentReady"
    );
    if (r.value === "complete")
      return !0;
    await It(200);
  }
  return !1;
}, uR = async (e, t, n) => {
  const { tabId: r, scopedLogger: s } = e, o = await n(e, t);
  if (!o)
    throw s.exception("Failed to get HTML");
  if (o.isPdf || t.mimeType && !["text/html", "application/xhtml+xml"].includes(t.mimeType) || o.html && o.html.length >= ql)
    return o;
  const a = o.html.length <= ql, c = await Ve(r);
  if (!c)
    throw s.exception("Failed to get tab");
  const u = c.pendingUrl || c.url, f = kn(u);
  s.warn(
    `${a ? "Short HTML" : "Empty HTML"} for url ${u}, retrying...`,
    f
  );
  const l = Vh / 2, d = performance.now(), p = wr({
    tabContext: e,
    config: {
      action: "GET_HTML_RETRY",
      waitForFCP: !1,
      maxWaitingTimeoutMs: l
    }
  }), h = await cR(e, l);
  return s.info(
    `Wait for document ready finished in ${performance.now() - d}ms, timeout: ${!h}`,
    f
  ), await p.wait(), n(e, t);
};
async function Hc(e, t = {}) {
  return uR(e, t, Bh);
}
const to = 100, lR = (e, t, n) => {
  const r = e.documents[0];
  if (!r) throw new Error("No documents in snapshot");
  const { nodeMap: s } = $h(r), o = /* @__PURE__ */ new Map(), i = r.layout.bounds?.[0]?.[2] || 1920, a = r.layout.bounds?.[0]?.[3] || 1080;
  return e.documents.forEach(
    ({ nodes: c, layout: u, scrollOffsetX: f, scrollOffsetY: l }) => {
      const d = f || 0, p = l || 0;
      u.nodeIndex.forEach((h, m) => {
        const g = c.backendNodeId?.[h], _ = (e.strings[c.nodeName[h]] ?? "div").toLocaleLowerCase(), y = s.get(h), b = Ka(e, y), E = b.get("type") === "submit" && _ === "button", S = b.get("id"), w = S?.startsWith(Ed);
        let T, N, k = !1;
        const v = u.bounds?.[m];
        if (v && Array.isArray(v) && v.length >= 4 && // bounds has [x, y, width, height]
        typeof v[0] == "number" && typeof v[1] == "number") {
          const C = v[2], I = v[3], O = (v[0] - d) / t * n, R = (v[1] - p) / t * n, X = C / t * n, F = I / t * n, ue = Math.round(O + X / 2), x = Math.round(R + F / 2);
          T = [ue, x], N = [O, R], k = R < a && // top < window.innerHeight
          R + F > 0 && // bottom > 0
          O < i && // left < window.innerWidth
          O + X > 0;
        }
        const M = u.styles[m][0], P = e.strings[M] === "pointer";
        o.set(g, {
          cursorPointer: P,
          tag: _,
          attr_id: S,
          isSubmitButton: E,
          isPartOfOverlay: w,
          isInViewport: k,
          coords: T,
          offset: N
        });
      });
    }
  ), o;
}, dR = (e, t) => `(x=${Math.round(e)},y=${Math.round(t)})`, fR = {
  // Interactive
  link: "a",
  checkbox: "input",
  radio: "input",
  textbox: "input",
  searchbox: "input",
  combobox: "select",
  switch: "input",
  slider: "input",
  spinbutton: "input",
  // Structure
  heading: "h2",
  paragraph: "p",
  list: "ul",
  listitem: "li",
  row: "tr",
  cell: "td",
  columnheader: "th",
  rowheader: "th",
  default: "div",
  WebRoot: "body",
  RootWebArea: "body",
  MenuListPopup: "menu",
  dialog: "div",
  radiogroup: "fieldset",
  WebArea: "iframe",
  Iframe: "iframe",
  generic: "div",
  // Landmarks
  banner: "header",
  navigation: "nav",
  contentinfo: "footer",
  complementary: "aside",
  // Content
  region: "section",
  search: "div",
  image: "img",
  separator: "hr",
  LabelText: "label",
  strong: "b",
  DisclosureTriangle: "details"
}, Wh = async (e) => {
  const { debuggee: t, scaleMultiplier: n } = e, [r, s, o, i] = await Promise.all([
    $(
      t,
      "Runtime.evaluate",
      {
        expression: "window.devicePixelRatio || 1"
      },
      "getPageStructure"
    ),
    $(
      t,
      "DOMSnapshot.captureSnapshot",
      {
        computedStyles: ["cursor"],
        includePaintOrder: !1,
        includeDOMRects: !1,
        includeBlendedBackgroundColors: !1,
        includeTextColorOpacities: !1
      },
      "getPageStructure"
    ),
    $(
      t,
      "Accessibility.getFullAXTree",
      {},
      "getPageStructure"
    ),
    $(
      t,
      "Runtime.evaluate",
      {
        expression: "window.location.origin"
      },
      "getPageStructure"
    )
  ]), a = r.result?.value || 1, c = i.result?.value || "", u = lR(
    s,
    a,
    n
  );
  return { output: await Hh(
    e,
    o.nodes,
    u,
    e.debuggee.targetId ?? void 0,
    0,
    c
  ) };
}, Hh = async (e, t, n, r, s = 0, o) => {
  let i = t.find((p) => !p.parentId);
  if (!i) return "";
  if (e.ref) {
    const { backendNodeId: p, targetId: h } = e.ref;
    if (h ? r === h : !r) {
      const g = t.find(
        (_) => _.backendDOMNodeId === p
      );
      if (!g) {
        const _ = h ? ` in target '${h}'` : "";
        throw new Ae(
          `Element with ref '${p}'${_} not found. It may have been removed from the page. Use without ref to get the current page state.`
        );
      }
      i = g;
    } else if (r)
      return "";
  }
  const a = /* @__PURE__ */ new Set(), c = /* @__PURE__ */ new Map();
  for (const p of t) {
    const h = p.parentId;
    if (h && !c.get(h)) {
      a.add(p.nodeId), c.set(p.nodeId, {
        ...p,
        parentId: i.nodeId
      });
      continue;
    }
    c.set(p.nodeId, p);
  }
  c.get(i.nodeId)?.childIds?.push(...a);
  const u = /* @__PURE__ */ new Map();
  async function f(p, h = 0, m = !1) {
    if (u.has(p.nodeId)) return "";
    u.set(p.nodeId, p);
    const g = e.depth ?? 15;
    if (h > g) return "";
    const _ = Cn(p.role), y = n.get(p.backendDOMNodeId), b = y?.tag === "select" || m;
    if (y?.isPartOfOverlay)
      return "";
    const E = y?.tag, S = e.ref !== void 0 && h === 0;
    if (e.ref?.targetId && !r && !S && E !== "iframe")
      return await l(p, h, b);
    const N = [
      "LayoutTable",
      "LayoutTableRow",
      "LayoutTableCell",
      "LineBreak",
      "InlineTextBox",
      "presentation",
      "sectionheader",
      "ListMarker",
      "none"
    ].includes(_), k = sn(p, "hidden") === "true", v = sn(p, "focusable") === "true", M = y?.cursorPointer, P = [
      "textbox",
      "checkbox",
      "radio",
      "button",
      "combobox",
      "searchbox",
      "slider",
      "spinbutton",
      "switch",
      "option"
    ].includes(_), C = _ === "link", I = sn(p, "actions")?.includes("click"), O = y?.isSubmitButton, R = v || M || P || C || I || O;
    if (!S) {
      if (e.filter === "VIEWPORT" && (!y?.isInViewport && !m || k))
        return "";
      if (e.filter === "INTERACTIVE" && !R)
        return y?.tag !== "iframe" ? l(p, h, b) : await Xl(e, p, n, o) || "";
      if (N || p.ignored || k || !y?.coords && !m)
        return await l(p, h, b);
    }
    const X = p.parentId ? c.get(p.parentId) : void 0, F = [];
    if (_ === "StaticText") {
      const ne = Cn(p.name).trim();
      if (!ne || X && ne === Cn(X.name).trim())
        return "";
      const ye = ne.length > to ? ne.substring(0, to) + "..." : ne;
      F.push(`"${ye}"`);
    }
    if ((R || e.filter === "ALL") && _ !== "option" && F.push(
      KA({
        targetId: r,
        // we assume that nodeId is equal to backendNodeId, which is true for all local tests
        backendNodeId: p.backendDOMNodeId ?? p.nodeId
      })
    ), y?.coords && y.isInViewport) {
      const [ne, ye] = e.offset ?? [0, 0];
      F.push(
        dR(
          y.coords[0] + ne,
          y.coords[1] + ye
        )
      );
    }
    O && F.push('type="submit"'), y?.attr_id && F.push(`id="${y.attr_id}"`), hR(p, F, X, o);
    const ue = "  ".repeat(h);
    if (_ === "StaticText") {
      const ne = F.length ? ` ${F.join(" ")}` : "";
      return `${ue}- generic${ne}
`;
    }
    const x = E ?? (N ? "div" : pR(_, p, X));
    if (x === "input" && (_ === "checkbox" || _ === "switch" ? F.push('type="checkbox"') : _ === "radio" ? F.push('type="radio"') : _ === "searchbox" ? F.push('type="search"') : _ === "slider" ? F.push('type="range"') : _ === "spinbutton" && F.push('type="number"')), p.value !== void 0 && x !== "textarea" && x !== "div") {
      const ne = Cn(p.value);
      if (ne) {
        const ye = ne.length > 50 ? ne.substring(0, 50) + "..." : ne;
        F.push(`value="${ye}"`);
      }
    }
    let A = Cn(p.name).trim();
    if (_ === "image" && !A) {
      const ne = sn(p, "url");
      ne && !ne.startsWith("data:") && !ne.startsWith("blob:") && (A = `Image: ${ne.split("/").pop()?.split("?")[0] || "image"}`);
    }
    A && (A.length > to && (A = A.substring(0, to) + "..."), F.unshift(`"${A}"`));
    const B = F.length > 2, Te = (
      // isGenericNode && // not sure about this condition
      !A.length && !B
    );
    let Se = "";
    if (x === "iframe")
      Se = await Xl(e, p, n, o) || "";
    else {
      const ne = Te ? h : h + 1;
      Se = await l(p, ne, b);
    }
    if (Te) return Se;
    const L = F.length ? ` ${F.join(" ")}` : "", ge = _ === "none" || _ === "RootWebArea" ? "generic" : _;
    return Se ? `${ue}- ${ge}${L}
${Se}` : `${ue}- ${ge}${L}
`;
  }
  async function l(p, h, m) {
    if (!p.childIds?.length) return "";
    const g = [];
    for (const _ of p.childIds) {
      const y = c.get(_);
      if (!y) continue;
      const b = await f(
        y,
        h,
        m
      );
      b && g.push(b);
    }
    return g.join("");
  }
  return await f(i, 0);
};
function Cn(e) {
  return !e || e.type === "valueUndefined" ? "" : String(e.value || "");
}
function sn(e, t) {
  if (!e.properties) return "";
  const n = e.properties.find((r) => r.name === t);
  return n ? Cn(n.value) : "";
}
function pR(e, t, n) {
  const r = fR[e];
  if (!r) return e || "div";
  const s = n && sn(n, "editable"), o = sn(t, "editable");
  return !s && o ? o === "richtext" ? "div" : sn(t, "multiline") ? "textarea" : "input" : r;
}
function hR(e, t, n, r) {
  if (e.properties)
    for (const s of e.properties) {
      const o = s.name, i = Cn(s.value);
      switch (o) {
        // Html boolean attributes
        case "disabled":
        case "readonly":
        case "required":
        case "checked":
        case "selected":
          i === "true" && t.push(o);
          break;
        // Aria boolean attributes
        case "busy":
        case "invalid":
        case "atomic":
        case "multiselectable":
        case "expanded":
        case "modal":
        case "pressed":
          i === "true" && t.push(`aria-${o}="true"`);
          break;
        // Aria literal values
        // @ts-expect-error - placeholder not listed in the protocol
        case "placeholder":
        case "keyshortcuts":
        case "roledescription":
        case "live":
        case "relevant":
        case "autocomplete":
        case "hasPopup":
        case "valuemin":
        case "valuemax":
        case "valuetext":
        case "errormessage":
          i && t.push(`aria-${o.toLowerCase()}="${i}"`);
          break;
        // Special cases
        case "focused":
          i === "true" && t.push('aria-current="true"');
          break;
        case "url":
          if (i && !i.startsWith("data:") && // too big to be referenced
          !i.startsWith("blob:") && // cannot be referenced
          !i.startsWith("file:")) {
            let a = i;
            a.startsWith("javascript:") && (a = "#"), r && a.startsWith(r) && (a = a.substring(r.length)), e.role?.value === "image" || t.push(`href="${a}"`);
          }
          break;
        case "editable":
          i === "richtext" && (n && sn(n, "editable") || t.push('contenteditable="true"'));
          break;
        case "hiddenRoot":
          i === "true" && t.push('aria-hidden="true"');
          break;
        // No-op - handled elsewhere or ignored
        case "focusable":
        case "root":
        case "level":
        case "hidden":
        case "multiline":
        case "settable":
        // Implied
        case "orientation":
          break;
        // Refer to element ids which we don't keep
        case "actions":
        case "describedby":
        case "activedescendant":
        case "controls":
        case "details":
        case "labelledby":
        case "owns":
        case "flowto":
          break;
        default:
          throw new Error(`Unknown AXNode property: ${o}`);
      }
    }
}
async function Xl(e, t, n, r) {
  if (!t.backendDOMNodeId)
    return null;
  let s = n.get(
    t.backendDOMNodeId
  )?.offset;
  e.offset && (s = [
    (s?.[0] ?? 0) + e.offset[0],
    (s?.[1] ?? 0) + e.offset[1]
  ]);
  const o = {
    ...e,
    offset: s
  };
  e.ref?.backendNodeId === t.backendDOMNodeId && (o.ref = void 0);
  const { debuggee: i } = e;
  try {
    const a = await $(
      i,
      "DOM.describeNode",
      {
        backendNodeId: t.backendDOMNodeId,
        depth: -1
      },
      "getIframeHtml"
    );
    if (!a.node.frameId)
      return null;
    try {
      const c = await $(
        i,
        "Accessibility.getFullAXTree",
        {
          frameId: a.node.frameId
        },
        "getIframeHtml"
      );
      return await Hh(
        o,
        c.nodes,
        n,
        void 0,
        0,
        r
      );
    } catch {
      const c = a.node.attributes?.findIndex(
        (l) => l === "src"
      );
      if ((c !== void 0 && c !== -1 ? a.node.attributes?.[c + 1] : void 0)?.startsWith("chrome-extension://"))
        return "";
      const f = await Uh(
        a.node.frameId
      );
      return (await Wh({
        ...o,
        debuggee: f
      })).output;
    }
  } catch {
  }
  return null;
}
let Xr;
async function mR() {
  const e = chrome.runtime.getURL("offscreen.html");
  (await chrome.runtime.getContexts({
    contextTypes: [chrome.runtime.ContextType.OFFSCREEN_DOCUMENT],
    documentUrls: [e]
  })).length > 0 || (Xr ? await Xr : (Xr = chrome.offscreen.createDocument({
    url: e,
    // TODO: This might not be the best reason since we use it for more generic tasks like logging
    reasons: [chrome.offscreen.Reason.DOM_SCRAPING],
    justification: "parse pdfs"
  }), await Xr, Xr = void 0));
}
const on = new Proxy(
  {},
  {
    get(e, t) {
      return async (...n) => {
        await mR();
        const r = crypto.randomUUID(), s = {
          type: "OFFSCREEN_REQUEST",
          requestId: r,
          method: t,
          args: n
        }, o = new Promise((a) => {
          const c = (u) => {
            u.requestId === r && (chrome.runtime.onMessage.removeListener(c), a(u));
          };
          chrome.runtime.onMessage.addListener(c);
        });
        await chrome.runtime.sendMessage(s);
        const i = await o;
        if ("error" in i) {
          const { type: a, message: c, stack: u } = i.error;
          throw new gR(a, c, u);
        }
        return i.result;
      };
    }
  }
);
class gR extends Error {
  constructor(t, n, r) {
    super(n), this.type = t, this.stack = r, this.name = "OffscreenError";
  }
}
const ls = async ({
  tab: e,
  html: t,
  isPdf: n,
  logger: r,
  overrideUrl: s
}) => {
  const o = e.id ?? -1, i = new URL(s ?? e.pendingUrl ?? e.url ?? "");
  if (n) {
    try {
      if (qb) {
        const c = await chrome.perplexity.pdf.getPageCount(e.id), u = new Array(c).fill("");
        return {
          markdown: (await Promise.all(
            u.map(async (d, p) => {
              const h = p + 1, m = await chrome.perplexity.pdf.getText(o, p);
              return `# Page: ${h}
` + m + `
`;
            })
          )).join(""),
          type: "pdf-fast"
        };
      }
    } catch (c) {
      r.error(
        "[parseMarkdown] Error while parsing PDF with new API, fallback to fetch",
        c
      );
    }
    const a = await on.parsePdf(i.toString());
    return a.length === 0 && r.warn("Empty content from PDF", {
      htmlLength: t.length,
      url: i.toString()
    }), {
      markdown: a,
      type: "pdf"
    };
  }
  if (Gc(i))
    return yR(o, i, t, r);
  if (Gh(i)) {
    const a = (await on.parseGoogleSheets(i.toString())).trim();
    if (a.length > 0)
      return {
        markdown: a,
        type: "google_sheets_fetch"
      };
    const c = await on.transformToMarkdown(t);
    return (c.length > 1e3 ? r.info : r.warn)("Empty content from Google Sheets", {
      markdownFromHtmlLength: c.length,
      url: i.toString()
    }), {
      markdown: c,
      type: "google_sheets_html"
    };
  }
  return {
    markdown: await on.transformToMarkdown(t),
    type: "html"
  };
}, yR = async (e, t, n, r) => {
  if (t.pathname.endsWith(Sd))
    try {
      return {
        markdown: await on.parseGoogleDocs(t.toString()),
        type: "google_docs_basic"
      };
    } catch (u) {
      r.warn("Failed to parse GoogleDocs mobile basic version", {
        url: t,
        error: u instanceof Error ? u.message : String(u)
      });
    }
  const [s] = await Pe(
    {
      target: { tabId: e },
      func: () => Array.from(
        document.querySelectorAll("div.kix-canvas-tile-content > svg > g")
      ).map(
        (f) => Array.from(f.querySelectorAll("rect:not(:has(*))")).map((l) => l.ariaLabel).join(" ")
      ).join(`
`)
    },
    "parseMarkdown",
    5e3
  ), o = (s?.result ?? "").trim();
  if (o.length)
    return {
      markdown: o,
      type: "google_docs_svg"
    };
  const i = (await on.parseGoogleDocs(t.toString())).trim();
  if (i.length)
    return {
      markdown: i,
      type: "google_docs_state"
    };
  const a = await on.transformToMarkdown(n);
  return (a.length > 1e3 ? r.info : r.warn)("Empty content from Google Docs", {
    markdownFromHtmlLength: a.length,
    url: t.toString()
  }), {
    markdown: a,
    type: "google_docs_html"
  };
}, Gc = (e) => e.hostname === "docs.google.com" && e.pathname.startsWith(zh), Gh = (e) => e.hostname === "docs.google.com" && e.pathname.startsWith("/spreadsheets/d/"), zh = "/document/d/", Kh = (e, t) => {
  try {
    const n = new URL(e);
    if (!Gc(n))
      return e;
    const r = n.pathname.split("/"), s = r.indexOf("d") + 1;
    if (s > 0 && s < r.length) {
      const o = r[s];
      return `https://${n.hostname}${zh}${o}${Sd}`;
    }
  } catch (n) {
    t.error(
      "Failed to convert Google Docs URL to mobile basic version",
      {
        url: e
      },
      n
    );
  }
  return e;
};
var Uo;
((e) => {
  e.keypadLocation = 3, e.USKeyboardLayout = {
    // Functions row
    Escape: { keyCode: 27, key: "Escape" },
    F1: { keyCode: 112, key: "F1" },
    F2: { keyCode: 113, key: "F2" },
    F3: { keyCode: 114, key: "F3" },
    F4: { keyCode: 115, key: "F4" },
    F5: { keyCode: 116, key: "F5" },
    F6: { keyCode: 117, key: "F6" },
    F7: { keyCode: 118, key: "F7" },
    F8: { keyCode: 119, key: "F8" },
    F9: { keyCode: 120, key: "F9" },
    F10: { keyCode: 121, key: "F10" },
    F11: { keyCode: 122, key: "F11" },
    F12: { keyCode: 123, key: "F12" },
    // Numbers row
    Backquote: { keyCode: 192, shiftKey: "~", key: "`" },
    Digit1: { keyCode: 49, shiftKey: "!", key: "1" },
    Digit2: { keyCode: 50, shiftKey: "@", key: "2" },
    Digit3: { keyCode: 51, shiftKey: "#", key: "3" },
    Digit4: { keyCode: 52, shiftKey: "$", key: "4" },
    Digit5: { keyCode: 53, shiftKey: "%", key: "5" },
    Digit6: { keyCode: 54, shiftKey: "^", key: "6" },
    Digit7: { keyCode: 55, shiftKey: "&", key: "7" },
    Digit8: { keyCode: 56, shiftKey: "*", key: "8" },
    Digit9: { keyCode: 57, shiftKey: "(", key: "9" },
    Digit0: { keyCode: 48, shiftKey: ")", key: "0" },
    Minus: { keyCode: 189, shiftKey: "_", key: "-" },
    Equal: { keyCode: 187, shiftKey: "+", key: "=" },
    Backslash: { keyCode: 220, shiftKey: "|", key: "\\" },
    Backspace: { keyCode: 8, key: "Backspace" },
    // First row
    Tab: { keyCode: 9, key: "Tab" },
    KeyQ: { keyCode: 81, shiftKey: "Q", key: "q" },
    KeyW: { keyCode: 87, shiftKey: "W", key: "w" },
    KeyE: { keyCode: 69, shiftKey: "E", key: "e" },
    KeyR: { keyCode: 82, shiftKey: "R", key: "r" },
    KeyT: { keyCode: 84, shiftKey: "T", key: "t" },
    KeyY: { keyCode: 89, shiftKey: "Y", key: "y" },
    KeyU: { keyCode: 85, shiftKey: "U", key: "u" },
    KeyI: { keyCode: 73, shiftKey: "I", key: "i" },
    KeyO: { keyCode: 79, shiftKey: "O", key: "o" },
    KeyP: { keyCode: 80, shiftKey: "P", key: "p" },
    BracketLeft: { keyCode: 219, shiftKey: "{", key: "[" },
    BracketRight: { keyCode: 221, shiftKey: "}", key: "]" },
    // Second row
    CapsLock: { keyCode: 20, key: "CapsLock" },
    KeyA: { keyCode: 65, shiftKey: "A", key: "a" },
    KeyS: { keyCode: 83, shiftKey: "S", key: "s" },
    KeyD: { keyCode: 68, shiftKey: "D", key: "d" },
    KeyF: { keyCode: 70, shiftKey: "F", key: "f" },
    KeyG: { keyCode: 71, shiftKey: "G", key: "g" },
    KeyH: { keyCode: 72, shiftKey: "H", key: "h" },
    KeyJ: { keyCode: 74, shiftKey: "J", key: "j" },
    KeyK: { keyCode: 75, shiftKey: "K", key: "k" },
    KeyL: { keyCode: 76, shiftKey: "L", key: "l" },
    Semicolon: { keyCode: 186, shiftKey: ":", key: ";" },
    Quote: { keyCode: 222, shiftKey: '"', key: "'" },
    Enter: { keyCode: 13, key: "Enter", text: "\r" },
    // Third row
    ShiftLeft: { keyCode: 160, keyCodeWithoutLocation: 16, key: "Shift", location: 1 },
    KeyZ: { keyCode: 90, shiftKey: "Z", key: "z" },
    KeyX: { keyCode: 88, shiftKey: "X", key: "x" },
    KeyC: { keyCode: 67, shiftKey: "C", key: "c" },
    KeyV: { keyCode: 86, shiftKey: "V", key: "v" },
    KeyB: { keyCode: 66, shiftKey: "B", key: "b" },
    KeyN: { keyCode: 78, shiftKey: "N", key: "n" },
    KeyM: { keyCode: 77, shiftKey: "M", key: "m" },
    Comma: { keyCode: 188, shiftKey: "<", key: "," },
    Period: { keyCode: 190, shiftKey: ">", key: "." },
    Slash: { keyCode: 191, shiftKey: "?", key: "/" },
    ShiftRight: { keyCode: 161, keyCodeWithoutLocation: 16, key: "Shift", location: 2 },
    // Last row
    ControlLeft: { keyCode: 162, keyCodeWithoutLocation: 17, key: "Control", location: 1 },
    MetaLeft: { keyCode: 91, key: "Meta", location: 1 },
    AltLeft: { keyCode: 164, keyCodeWithoutLocation: 18, key: "Alt", location: 1 },
    Space: { keyCode: 32, key: " " },
    AltRight: { keyCode: 165, keyCodeWithoutLocation: 18, key: "Alt", location: 2 },
    AltGraph: { keyCode: 225, key: "AltGraph" },
    MetaRight: { keyCode: 92, key: "Meta", location: 2 },
    ContextMenu: { keyCode: 93, key: "ContextMenu" },
    ControlRight: { keyCode: 163, keyCodeWithoutLocation: 17, key: "Control", location: 2 },
    // Center block
    PrintScreen: { keyCode: 44, key: "PrintScreen" },
    ScrollLock: { keyCode: 145, key: "ScrollLock" },
    Pause: { keyCode: 19, key: "Pause" },
    PageUp: { keyCode: 33, key: "PageUp" },
    PageDown: { keyCode: 34, key: "PageDown" },
    Insert: { keyCode: 45, key: "Insert" },
    Delete: { keyCode: 46, key: "Delete" },
    Home: { keyCode: 36, key: "Home" },
    End: { keyCode: 35, key: "End" },
    ArrowLeft: { keyCode: 37, key: "ArrowLeft" },
    ArrowUp: { keyCode: 38, key: "ArrowUp" },
    ArrowRight: { keyCode: 39, key: "ArrowRight" },
    ArrowDown: { keyCode: 40, key: "ArrowDown" },
    // Numpad
    NumLock: { keyCode: 144, key: "NumLock" },
    NumpadDivide: { keyCode: 111, key: "/", location: 3 },
    NumpadMultiply: { keyCode: 106, key: "*", location: 3 },
    NumpadSubtract: { keyCode: 109, key: "-", location: 3 },
    Numpad7: { keyCode: 36, shiftKeyCode: 103, key: "Home", shiftKey: "7", location: 3 },
    Numpad8: { keyCode: 38, shiftKeyCode: 104, key: "ArrowUp", shiftKey: "8", location: 3 },
    Numpad9: { keyCode: 33, shiftKeyCode: 105, key: "PageUp", shiftKey: "9", location: 3 },
    Numpad4: { keyCode: 37, shiftKeyCode: 100, key: "ArrowLeft", shiftKey: "4", location: 3 },
    Numpad5: { keyCode: 12, shiftKeyCode: 101, key: "Clear", shiftKey: "5", location: 3 },
    Numpad6: { keyCode: 39, shiftKeyCode: 102, key: "ArrowRight", shiftKey: "6", location: 3 },
    NumpadAdd: { keyCode: 107, key: "+", location: 3 },
    Numpad1: { keyCode: 35, shiftKeyCode: 97, key: "End", shiftKey: "1", location: 3 },
    Numpad2: { keyCode: 40, shiftKeyCode: 98, key: "ArrowDown", shiftKey: "2", location: 3 },
    Numpad3: { keyCode: 34, shiftKeyCode: 99, key: "PageDown", shiftKey: "3", location: 3 },
    Numpad0: { keyCode: 45, shiftKeyCode: 96, key: "Insert", shiftKey: "0", location: 3 },
    NumpadDecimal: { keyCode: 46, shiftKeyCode: 110, key: "\0", shiftKey: ".", location: 3 },
    NumpadEnter: { keyCode: 13, key: "Enter", text: "\r", location: 3 }
  };
})(Uo || (Uo = {}));
const Yl = ["Alt", "Control", "Meta", "Shift"];
class _R {
  // @pplx-start — added os param
  constructor(t, n) {
    this._os = n, this._raw = t;
  }
  _pressedModifiers = /* @__PURE__ */ new Set();
  _pressedKeys = /* @__PURE__ */ new Set();
  _raw;
  // @pplx-start — added return type
  async down(t) {
    const n = this._keyDescriptionForString(t), r = this._pressedKeys.has(n.code);
    this._pressedKeys.add(n.code), Yl.includes(n.key) && this._pressedModifiers.add(n.key), await this._raw.keydown(this._pressedModifiers, t, n, r);
  }
  _keyDescriptionForString(t) {
    const n = bR(t, this._os);
    let r = Zl.get(n);
    return jh(r, `Unknown key: "${n}"`), r = this._pressedModifiers.has("Shift") && r.shifted ? r.shifted : r, this._pressedModifiers.size > 1 || !this._pressedModifiers.has("Shift") && this._pressedModifiers.size === 1 ? { ...r, text: "" } : r;
  }
  // @pplx-start — added return type
  async up(t) {
    const n = this._keyDescriptionForString(t);
    Yl.includes(n.key) && this._pressedModifiers.delete(n.key), this._pressedKeys.delete(n.code), await this._raw.keyup(this._pressedModifiers, t, n);
  }
  // @pplx-start — added return type
  async insertText(t) {
    await this._raw.sendText(t);
  }
  // @pplx-start — added return type
  async type(t, n) {
    const r = n && n.delay || void 0;
    for (const s of t)
      Zl.has(s) ? await this.press(s, { delay: r }) : (r && await new Promise((o) => setTimeout(o, r)), await this.insertText(s));
  }
  // @pplx-start — added return type
  async press(t, n = {}) {
    function r(o) {
      const i = [];
      let a = "";
      for (const c of o)
        c === "+" && a ? (i.push(a), a = "") : a += c;
      return i.push(a), i;
    }
    const s = r(t);
    t = s[s.length - 1];
    for (let o = 0; o < s.length - 1; ++o)
      await this.down(s[o]);
    await this.down(t), n.delay && await new Promise((o) => setTimeout(o, n.delay)), await this.up(t);
    for (let o = s.length - 2; o >= 0; --o)
      await this.up(s[o]);
  }
  // @pplx-start
  // Removed ensureModifiers
  // @pplx-end
  _modifiers() {
    return this._pressedModifiers;
  }
}
function bR(e, t) {
  return e === "ControlOrMeta" ? t === "mac" ? "Meta" : "Control" : e;
}
class wR {
  _keyboard;
  _x = 0;
  _y = 0;
  _lastButton = "none";
  _buttons = /* @__PURE__ */ new Set();
  _raw;
  // @pplx-start
  // private _page: Page;
  // constructor(raw: RawMouse, page: Page) {
  constructor(t, n) {
    this._raw = t, this._keyboard = n;
  }
  // @pplx-start
  // async move(x: number, y: number, options: { steps?: number, forClick?: boolean } = {}, metadata?: CallMetadata) {
  //   if (metadata)
  //     metadata.point = { x, y };
  async move(t, n, r = {}) {
    const { steps: s = 1 } = r, o = this._x, i = this._y;
    this._x = t, this._y = n;
    for (let a = 1; a <= s; a++) {
      const c = o + (t - o) * (a / s), u = i + (n - i) * (a / s);
      await this._raw.move(c, u, this._lastButton, this._buttons, this._keyboard._modifiers(), !!r.forClick);
    }
  }
  // @pplx-start
  // async down(options: { button?: types.MouseButton, clickCount?: number } = {}, metadata?: CallMetadata) {
  //   if (metadata)
  //     metadata.point = { x: this._x, y: this._y };
  async down(t = {}) {
    const { button: n = "left", clickCount: r = 1 } = t;
    this._lastButton = n, this._buttons.add(n), await this._raw.down(this._x, this._y, this._lastButton, this._buttons, this._keyboard._modifiers(), r);
  }
  // @pplx-start
  // async up(options: { button?: types.MouseButton, clickCount?: number } = {}, metadata?: CallMetadata) {
  //   if (metadata)
  //     metadata.point = { x: this._x, y: this._y };
  async up(t = {}) {
    const { button: n = "left", clickCount: r = 1 } = t;
    this._lastButton = "none", this._buttons.delete(n), await this._raw.up(this._x, this._y, n, this._buttons, this._keyboard._modifiers(), r);
  }
  // @pplx-start
  // async click(x: number, y: number, options: { delay?: number, button?: types.MouseButton, clickCount?: number } = {}, metadata?: CallMetadata) {
  //   if (metadata)
  //     metadata.point = { x, y };
  async click(t, n, r = {}) {
    const { delay: s = null, clickCount: o = 1 } = r;
    if (s) {
      this.move(t, n, { forClick: !0 });
      for (let i = 1; i <= o; ++i)
        await this.down({ ...r, clickCount: i }), await new Promise((a) => setTimeout(a, s)), await this.up({ ...r, clickCount: i }), i < o && await new Promise((a) => setTimeout(a, s));
    } else {
      const i = [];
      i.push(this.move(t, n, { forClick: !0 }));
      for (let a = 1; a <= o; ++a)
        i.push(this.down({ ...r, clickCount: a })), i.push(this.up({ ...r, clickCount: a }));
      await Promise.all(i);
    }
  }
  // @pplx-start — added return type
  async dblclick(t, n, r = {}) {
    await this.click(t, n, { ...r, clickCount: 2 });
  }
  // @pplx-start — added return type
  async wheel(t, n) {
    await this._raw.wheel(this._x, this._y, this._buttons, this._keyboard._modifiers(), t, n);
  }
}
const Jl = /* @__PURE__ */ new Map([
  ["ShiftLeft", ["Shift"]],
  ["ControlLeft", ["Control"]],
  ["AltLeft", ["Alt"]],
  ["MetaLeft", ["Meta"]],
  ["Enter", [`
`, "\r"]]
]), Zl = ER(Uo.USKeyboardLayout);
function ER(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n in e) {
    const r = e[n], s = {
      key: r.key || "",
      keyCode: r.keyCode || 0,
      keyCodeWithoutLocation: r.keyCodeWithoutLocation || r.keyCode || 0,
      code: n,
      text: r.text || "",
      location: r.location || 0
    };
    r.key.length === 1 && (s.text = s.key);
    let o;
    if (r.shiftKey && (jh(r.shiftKey.length === 1), o = { ...s }, o.key = r.shiftKey, o.text = r.shiftKey, r.shiftKeyCode && (o.keyCode = r.shiftKeyCode)), t.set(n, { ...s, shifted: o }), Jl.has(n))
      for (const i of Jl.get(n))
        t.set(i, s);
    r.location || (s.key.length === 1 && t.set(s.key, s), o && t.set(o.key, { ...o, shifted: void 0 }));
  }
  return t;
}
function jh(e, t) {
  if (!e)
    throw new SR(t || "Assertion failed");
}
class SR extends Error {
  constructor(t) {
    super(t), this.name = "AssertionError";
  }
}
const Ut = (e) => {
  let t = 0;
  return e.has("Alt") && (t |= 1), e.has("Control") && (t |= 2), e.has("Meta") && (t |= 4), e.has("Shift") && (t |= 8), t;
}, Ji = (e) => {
  let t = 0;
  return e.has("left") && (t |= 1), e.has("right") && (t |= 2), e.has("middle") && (t |= 4), t;
}, go = (e, t) => {
  const n = new TR(e, t);
  return new _R(n, t);
};
class TR {
  constructor(t, n) {
    this.debuggee = t, this.os = n;
  }
  async keydown(t, n, r, s) {
    const { code: o, key: i, location: a, text: c } = r;
    let u = [];
    this.os === "mac" && (u = this.commandsForCode(o, t)), await $(
      this.debuggee,
      "Input.dispatchKeyEvent",
      {
        type: c ? "keyDown" : "rawKeyDown",
        modifiers: Ut(t),
        windowsVirtualKeyCode: r.keyCodeWithoutLocation,
        code: o,
        commands: u,
        key: i,
        text: c,
        unmodifiedText: c,
        autoRepeat: s,
        location: a,
        isKeypad: a === Uo.keypadLocation
      },
      "keydown"
    );
  }
  async keyup(t, n, r) {
    const { code: s, key: o, location: i } = r;
    await $(
      this.debuggee,
      "Input.dispatchKeyEvent",
      {
        type: "keyUp",
        modifiers: Ut(t),
        key: o,
        windowsVirtualKeyCode: r.keyCodeWithoutLocation,
        code: s,
        location: i
      },
      "keyup"
    );
  }
  async sendText(t) {
    await $(
      this.debuggee,
      "Input.insertText",
      {
        text: t
      },
      "sendText"
    );
  }
  commandsForCode(t, n) {
    const r = [];
    for (const i of [
      "Shift",
      "Control",
      "Alt",
      "Meta"
    ])
      n.has(i) && r.push(i);
    r.push(t);
    const s = r.join("+");
    let o = vR[s] || [];
    return typeof o == "string" && (o = [o]), o = o.filter((i) => !i.startsWith("insert")), o.map((i) => i.substring(0, i.length - 1));
  }
}
const vR = {
  Backspace: "deleteBackward:",
  Enter: "insertNewline:",
  NumpadEnter: "insertNewline:",
  Escape: "cancelOperation:",
  ArrowUp: "moveUp:",
  ArrowDown: "moveDown:",
  ArrowLeft: "moveLeft:",
  ArrowRight: "moveRight:",
  F5: "complete:",
  Delete: "deleteForward:",
  Home: "scrollToBeginningOfDocument:",
  End: "scrollToEndOfDocument:",
  PageUp: "scrollPageUp:",
  PageDown: "scrollPageDown:",
  "Shift+Backspace": "deleteBackward:",
  "Shift+Enter": "insertNewline:",
  "Shift+NumpadEnter": "insertNewline:",
  "Shift+Escape": "cancelOperation:",
  "Shift+ArrowUp": "moveUpAndModifySelection:",
  "Shift+ArrowDown": "moveDownAndModifySelection:",
  "Shift+ArrowLeft": "moveLeftAndModifySelection:",
  "Shift+ArrowRight": "moveRightAndModifySelection:",
  "Shift+F5": "complete:",
  "Shift+Delete": "deleteForward:",
  "Shift+Home": "moveToBeginningOfDocumentAndModifySelection:",
  "Shift+End": "moveToEndOfDocumentAndModifySelection:",
  "Shift+PageUp": "pageUpAndModifySelection:",
  "Shift+PageDown": "pageDownAndModifySelection:",
  "Shift+Numpad5": "delete:",
  "Control+Tab": "selectNextKeyView:",
  "Control+Enter": "insertLineBreak:",
  "Control+NumpadEnter": "insertLineBreak:",
  "Control+Quote": "insertSingleQuoteIgnoringSubstitution:",
  "Control+KeyA": "moveToBeginningOfParagraph:",
  "Control+KeyB": "moveBackward:",
  "Control+KeyD": "deleteForward:",
  "Control+KeyE": "moveToEndOfParagraph:",
  "Control+KeyF": "moveForward:",
  "Control+KeyH": "deleteBackward:",
  "Control+KeyK": "deleteToEndOfParagraph:",
  "Control+KeyL": "centerSelectionInVisibleArea:",
  "Control+KeyN": "moveDown:",
  "Control+KeyO": ["insertNewlineIgnoringFieldEditor:", "moveBackward:"],
  "Control+KeyP": "moveUp:",
  "Control+KeyT": "transpose:",
  "Control+KeyV": "pageDown:",
  "Control+KeyY": "yank:",
  "Control+Backspace": "deleteBackwardByDecomposingPreviousCharacter:",
  "Control+ArrowUp": "scrollPageUp:",
  "Control+ArrowDown": "scrollPageDown:",
  "Control+ArrowLeft": "moveToLeftEndOfLine:",
  "Control+ArrowRight": "moveToRightEndOfLine:",
  "Shift+Control+Enter": "insertLineBreak:",
  "Shift+Control+NumpadEnter": "insertLineBreak:",
  "Shift+Control+Tab": "selectPreviousKeyView:",
  "Shift+Control+Quote": "insertDoubleQuoteIgnoringSubstitution:",
  "Shift+Control+KeyA": "moveToBeginningOfParagraphAndModifySelection:",
  "Shift+Control+KeyB": "moveBackwardAndModifySelection:",
  "Shift+Control+KeyE": "moveToEndOfParagraphAndModifySelection:",
  "Shift+Control+KeyF": "moveForwardAndModifySelection:",
  "Shift+Control+KeyN": "moveDownAndModifySelection:",
  "Shift+Control+KeyP": "moveUpAndModifySelection:",
  "Shift+Control+KeyV": "pageDownAndModifySelection:",
  "Shift+Control+Backspace": "deleteBackwardByDecomposingPreviousCharacter:",
  "Shift+Control+ArrowUp": "scrollPageUp:",
  "Shift+Control+ArrowDown": "scrollPageDown:",
  "Shift+Control+ArrowLeft": "moveToLeftEndOfLineAndModifySelection:",
  "Shift+Control+ArrowRight": "moveToRightEndOfLineAndModifySelection:",
  "Alt+Backspace": "deleteWordBackward:",
  "Alt+Enter": "insertNewlineIgnoringFieldEditor:",
  "Alt+NumpadEnter": "insertNewlineIgnoringFieldEditor:",
  "Alt+Escape": "complete:",
  "Alt+ArrowUp": ["moveBackward:", "moveToBeginningOfParagraph:"],
  "Alt+ArrowDown": ["moveForward:", "moveToEndOfParagraph:"],
  "Alt+ArrowLeft": "moveWordLeft:",
  "Alt+ArrowRight": "moveWordRight:",
  "Alt+Delete": "deleteWordForward:",
  "Alt+PageUp": "pageUp:",
  "Alt+PageDown": "pageDown:",
  "Shift+Alt+Backspace": "deleteWordBackward:",
  "Shift+Alt+Enter": "insertNewlineIgnoringFieldEditor:",
  "Shift+Alt+NumpadEnter": "insertNewlineIgnoringFieldEditor:",
  "Shift+Alt+Escape": "complete:",
  "Shift+Alt+ArrowUp": "moveParagraphBackwardAndModifySelection:",
  "Shift+Alt+ArrowDown": "moveParagraphForwardAndModifySelection:",
  "Shift+Alt+ArrowLeft": "moveWordLeftAndModifySelection:",
  "Shift+Alt+ArrowRight": "moveWordRightAndModifySelection:",
  "Shift+Alt+Delete": "deleteWordForward:",
  "Shift+Alt+PageUp": "pageUp:",
  "Shift+Alt+PageDown": "pageDown:",
  "Control+Alt+KeyB": "moveWordBackward:",
  "Control+Alt+KeyF": "moveWordForward:",
  "Control+Alt+Backspace": "deleteWordBackward:",
  "Shift+Control+Alt+KeyB": "moveWordBackwardAndModifySelection:",
  "Shift+Control+Alt+KeyF": "moveWordForwardAndModifySelection:",
  "Shift+Control+Alt+Backspace": "deleteWordBackward:",
  "Meta+NumpadSubtract": "cancel:",
  "Meta+Backspace": "deleteToBeginningOfLine:",
  "Meta+ArrowUp": "moveToBeginningOfDocument:",
  "Meta+ArrowDown": "moveToEndOfDocument:",
  "Meta+ArrowLeft": "moveToLeftEndOfLine:",
  "Meta+ArrowRight": "moveToRightEndOfLine:",
  "Shift+Meta+NumpadSubtract": "cancel:",
  "Shift+Meta+Backspace": "deleteToBeginningOfLine:",
  "Shift+Meta+ArrowUp": "moveToBeginningOfDocumentAndModifySelection:",
  "Shift+Meta+ArrowDown": "moveToEndOfDocumentAndModifySelection:",
  "Shift+Meta+ArrowLeft": "moveToLeftEndOfLineAndModifySelection:",
  "Shift+Meta+ArrowRight": "moveToRightEndOfLineAndModifySelection:",
  "Meta+KeyA": "selectAll:",
  "Meta+KeyC": "copy:",
  "Meta+KeyX": "cut:",
  "Meta+KeyV": "paste:",
  "Meta+KeyZ": "undo:",
  "Shift+Meta+KeyZ": "redo:"
}, Ql = (e, t) => {
  const n = new IR(e);
  return new wR(n, t);
};
class IR {
  constructor(t) {
    this.debuggee = t, this._dragManager = new kR(t);
  }
  _dragManager;
  async move(t, n, r, s, o, i) {
    const a = async () => {
      await $(
        this.debuggee,
        "Input.dispatchMouseEvent",
        {
          type: "mouseMoved",
          button: r,
          buttons: Ji(s),
          x: t,
          y: n,
          modifiers: Ut(o)
        },
        "move"
      );
    };
    if (i)
      return a();
    await this._dragManager.interceptDragCausedByMove(
      t,
      n,
      r,
      s,
      o,
      a
    );
  }
  async down(t, n, r, s, o, i) {
    this._dragManager.isDragging() || await $(
      this.debuggee,
      "Input.dispatchMouseEvent",
      {
        type: "mousePressed",
        button: r,
        buttons: Ji(s),
        x: t,
        y: n,
        modifiers: Ut(o),
        clickCount: i
      },
      "down"
    );
  }
  async up(t, n, r, s, o, i) {
    if (this._dragManager.isDragging()) {
      await this._dragManager.drop(t, n, o);
      return;
    }
    await $(
      this.debuggee,
      "Input.dispatchMouseEvent",
      {
        type: "mouseReleased",
        button: r,
        buttons: Ji(s),
        x: t,
        y: n,
        modifiers: Ut(o),
        clickCount: i
      },
      "up"
    );
  }
  async wheel(t, n, r, s, o, i) {
    await $(
      this.debuggee,
      "Input.dispatchMouseEvent",
      {
        type: "mouseWheel",
        x: t,
        y: n,
        modifiers: Ut(s),
        deltaX: o,
        deltaY: i
      },
      "wheel"
    );
  }
}
class kR {
  constructor(t) {
    this.debuggee = t;
  }
  _dragState = null;
  _lastPosition = { x: 0, y: 0 };
  async cancelDrag() {
    return this._dragState ? (await $(
      this.debuggee,
      "Input.dispatchDragEvent",
      {
        type: "dragCancel",
        x: this._lastPosition.x,
        y: this._lastPosition.y,
        data: {
          items: [],
          dragOperationsMask: 65535
        }
      },
      "cancelDrag"
    ), this._dragState = null, !0) : !1;
  }
  async interceptDragCausedByMove(t, n, r, s, o, i) {
    if (this._lastPosition = { x: t, y: n }, this._dragState) {
      await $(
        this.debuggee,
        "Input.dispatchDragEvent",
        {
          type: "dragOver",
          x: t,
          y: n,
          data: this._dragState,
          modifiers: Ut(o)
        },
        "interceptDragCausedByMove"
      );
      return;
    }
    if (r !== "left") return i();
    if (!("tabId" in this.debuggee)) return;
    let a;
    const c = new Promise(
      (p) => a = p
    ), u = (p, h, m) => {
      if (!("tabId" in this.debuggee)) return;
      p.tabId === this.debuggee.tabId && h === "Input.dragIntercepted" && a(m);
    };
    function f() {
      let p = Promise.resolve(!1), h = null;
      const m = (_) => h = _, g = () => {
        p = new Promise((_) => {
          window.addEventListener("dragstart", m, {
            once: !0,
            capture: !0
          }), setTimeout(
            () => _(h ? !h.defaultPrevented : !1),
            0
          );
        });
      };
      window.addEventListener("mousemove", g, {
        once: !0,
        capture: !0
      }), window.__cleanupDrag = async () => {
        const _ = await p;
        return window.removeEventListener("mousemove", g, {
          capture: !0
        }), window.removeEventListener("dragstart", m, {
          capture: !0
        }), delete window.__cleanupDrag, _;
      };
    }
    await Pe(
      {
        target: { tabId: this.debuggee.tabId, allFrames: !0 },
        func: f,
        world: "MAIN"
      },
      "setupDragListeners",
      1e3
    ), chrome.debugger.onEvent.addListener(u), await $(
      this.debuggee,
      "Input.setInterceptDrags",
      {
        enabled: !0
      },
      "dragListener"
    ), await i();
    const d = (await Pe(
      {
        target: { tabId: this.debuggee.tabId, allFrames: !0 },
        func: () => window.__cleanupDrag?.(),
        world: "MAIN"
      },
      "cleanupDragListeners",
      1e3
    )).some((p) => p.result === !0);
    this._dragState = d ? (await c).data : null, chrome.debugger.onEvent.removeListener(u), await $(
      this.debuggee,
      "Input.setInterceptDrags",
      {
        enabled: !1
      },
      "dragListener"
    ), this._dragState && await $(
      this.debuggee,
      "Input.dispatchDragEvent",
      {
        type: "dragEnter",
        x: t,
        y: n,
        data: this._dragState,
        modifiers: Ut(o)
      },
      "dragListener"
    );
  }
  isDragging() {
    return !!this._dragState;
  }
  async drop(t, n, r) {
    Ua(this._dragState, "missing drag state"), await $(
      this.debuggee,
      "Input.dispatchDragEvent",
      {
        type: "drop",
        x: t,
        y: n,
        data: this._dragState,
        modifiers: Ut(r)
      },
      "drop"
    ), this._dragState = null;
  }
}
const qh = /* @__PURE__ */ new Set([
  "fetch_opened_tabs",
  "explore-assistant-check",
  "initial-history-summary"
]);
async function CR(e) {
  const t = Array.isArray(e.queries) && e.queries.length > 0 ? e.queries : [""], n = {
    startTime: void 0,
    endTime: void 0
  };
  e.start_time !== void 0 && (n.startTime = Date.now() - e.start_time), e.end_time !== void 0 && (n.endTime = Date.now() - e.end_time);
  const r = t.map(
    (c) => chrome.history.search({
      text: c,
      maxResults: e.history_max_results,
      ...n
    })
  ), s = (await Promise.all(r)).flat(), o = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Set(), a = s.map(async (c) => {
    if (i.has(c.id) || (i.add(c.id), await $e.isUrlBlocked(c.url ?? ""))) return;
    let u = xn(c.url ?? "");
    if (u.endsWith("/") && (u = u.slice(0, -1)), !u) return;
    const f = o.get(u);
    o.set(u, {
      url: u,
      title: f?.title ?? c.title ?? "",
      is_current_tab: !1,
      last_accessed: Math.max(
        f?.last_accessed ?? 0,
        c.lastVisitTime ?? Date.now()
      ),
      visit_count: (f?.visit_count ?? 0) + (c?.visitCount ?? 1)
    });
  });
  return await Promise.all(a), [...o.values()];
}
async function AR(e, t) {
  const n = t.tab?.windowId ?? (await chrome.windows.getLastFocused({
    windowTypes: ["normal"]
  })).id, r = await Ls(
    {
      windowId: n,
      windowType: "normal"
    },
    {
      hidden: !1
    }
  ), s = e.queries?.map((c) => c.toLowerCase()) ?? [], o = r.map(
    (c) => zc(c, s, e)
  ), i = (await Promise.all(o)).filter((c) => c !== void 0).sort((c, u) => u.last_accessed - c.last_accessed);
  return e.open_tabs_max_results ? i.slice(0, e.open_tabs_max_results) : i;
}
async function RR(e) {
  const t = await chrome.sessions.getRecentlyClosed({
    maxResults: Math.min(
      e.closed_tabs_max_results ?? chrome.sessions.MAX_SESSION_RESULTS,
      chrome.sessions.MAX_SESSION_RESULTS
    )
  }), n = e.queries?.map((s) => s.toLowerCase()) ?? [], r = t.map((s) => {
    if (s.tab)
      return zc(s.tab, n, e);
  });
  return (await Promise.all(r)).filter((s) => s !== void 0);
}
async function zc(e, t, n, r) {
  const s = (e.url ?? e.pendingUrl ?? "").toLowerCase(), o = (e.title ?? "").toLowerCase();
  if (await $e.isUrlBlocked(s) || !(t.length === 0 || t.some((c) => o.includes(c) || s.includes(c)))) return;
  const a = e.lastAccessed;
  if (!(a !== void 0 && (n?.start_time !== void 0 && a < Date.now() - n.start_time || n?.end_time !== void 0 && a > Date.now() - n.end_time)))
    return Fo(e);
}
const xn = (e) => e.replace("chrome://", `${So}://`), Xh = (e) => e.replace(`${So}://`, "chrome://"), xR = [
  "efaidnbmnnnibpcajpcglclefindmkaj",
  "kdpelmjpfafjppnhbloffcjpeomlnpah",
  "oemmndcbldboiebfnladdacbdfmadadm"
], Yh = (e) => {
  try {
    const t = new URL(e);
    if (t.protocol !== "chrome-extension:")
      return e;
    const n = t.hostname;
    return xR.includes(n) ? t.pathname.match(/^\/([\w-]+:\/\/.+)$/)?.[1] ?? e : e;
  } catch {
    return e;
  }
}, Fo = (e) => ({
  tab_id: e.id,
  url: xn(e.pendingUrl ?? e.url ?? ""),
  title: e.title ?? "",
  is_current_tab: e.active ?? !1,
  last_accessed: e.lastAccessed ?? Date.now(),
  visit_count: 1,
  group_id: e.groupId === -1 ? void 0 : e.groupId
}), Zi = async (e) => (await Ls(
  {
    windowId: e
  },
  {
    hidden: !1
  }
)).reduce(
  (r, s) => r.set(s.id ?? -1, Fo(s)),
  /* @__PURE__ */ new Map()
), ed = 100, OR = 200, LR = 1e3, td = 45e3, nd = "Failed to execute action", NR = "Unexpected client error";
class MR {
  constructor(t) {
    this.deps = t;
  }
  lastViewport;
  async dispatchRpcRequest({
    request_id: t,
    method: n,
    request: r
  }) {
    const s = this.deps.logger.exception.bind(this.deps.logger);
    if (!t)
      throw s("[dispatch rpc] request_id field is required", r);
    if (!r)
      throw s("[dispatch rpc] request field is required", r);
    if (!n || !(n in this))
      throw s(`[dispatch rpc] unknown method: ${n}`, r);
    this.deps.logger.info("[dispatch rpc] request received", {
      method: n,
      request: r
    });
    const o = (h) => typeof h == "object" && h !== null && "tab_id" in h && typeof h.tab_id == "number", i = performance.now();
    let a, c = !1;
    const u = async (h = !1) => {
      try {
        const m = n, g = JSON.parse(r);
        if (o(g)) {
          a = g.tab_id;
          const _ = await Ve(a);
          if (!_?.id) throw new Ae("No tab with provided ID");
          await this.deps.agentTabsManager.maybeFocusTab(_).catch((w) => {
            this.deps.logger.warn(
              "[agent/maybeFocusTab] Error while focusing",
              w
            );
          });
          const y = _.pendingUrl ?? _.url ?? "", b = m === "Navigate";
          if (!b && $e.isInternalPage(y))
            throw new Ae(
              "This tab is an internal page, you cannot see or manipulate with it. You must navigate to another url or stop the task"
            );
          if (!b && await $e.isUrlBlocked(y))
            throw new Ae(
              "Url on this tab is restricted by user or system. You must navigate to another url or stop the task"
            );
        }
        return await this[m](g);
      } catch (m) {
        try {
          const g = a && await Ve(a);
          if (!(g && !h && !c && !this.deps.abortController?.signal.aborted)) return this.handleRpcError(m, a);
          if (m instanceof Error && [
            "Debugger is not attached to the tab with id",
            "Detached while handling command"
          ].some((E) => m.message.includes(E)))
            return this.deps.logger.warn(
              "[dispatch rpc] Trying to retry after debugger error",
              m,
              {
                tabId: a,
                tab: g
              }
            ), await Hn(a), u(!0);
          if (m instanceof er && m.message.startsWith("Debugger command timed out:"))
            return this.deps.logger.warn(
              "[dispatch rpc] Trying to retry after debugger timeout",
              m,
              {
                tabId: a,
                tab: g
              }
            ), await chrome.tabs.reload(a), await Hn(a), u(!0);
        } catch (g) {
          this.deps.logger.warn(
            "[dispatch rpc] Unsuccessful retry on action",
            g,
            {
              tabId: a
            }
          );
        }
        return this.handleRpcError(m, a);
      }
    };
    let f;
    try {
      f = await Wc(td)(u)();
    } catch {
      c = !0, f = await this.handleRpcError(
        new Ae(
          `Request timed out after ${td / 1e3} seconds`
        ),
        a
      );
    }
    const l = Math.round(performance.now() - i), d = JSON.stringify(f), p = {
      method: n,
      request: r,
      response: {
        message: "message" in f ? f.message : void 0,
        error: f.error,
        tab_context: f.tab_context
      },
      duration: l,
      size_mb: Number((d.length / (1024 * 1024)).toFixed(2))
    };
    if (!this.deps.abortController?.signal.aborted) {
      this.deps.logger.info("[dispatch rpc] request processed", p);
      const h = f.error ? c ? "timeout" : f.error.startsWith(nd) ? "tool_error" : "unexpected_tool_error" : "success";
      Nn("agent.client_loop.action_duration_ms", {
        duration: l,
        method: n,
        result: h
      });
    }
    return { request_id: t, response: d };
  }
  async ComputerBatch(t) {
    const n = t.tab_id, r = t.actions, s = this.deps.externalMessagesManager, o = await yo(n, this.deps.logger), i = [
      "LEFT_CLICK",
      "RIGHT_CLICK",
      "DOUBLE_CLICK",
      "TRIPLE_CLICK"
    ], a = [
      ...i,
      "SCROLL",
      "LEFT_CLICK_DRAG"
    ], c = WR(this.lastViewport, o);
    if (r.some(
      ({ action: N }) => a.includes(N)
    ) && c) {
      const { screenshotUuid: N, base64_image: k, newViewportInfo: v } = await this.takeScreenshot(n);
      return {
        tab_context: await this.getTabContext(n, v),
        error: "Actions were not executed as viewport dimensions have been changed. Previous screenshots and coordinates are no longer valid. Use the new screenshot provided to continue.",
        base64_image: k,
        screenshot_uuid: N
      };
    }
    const f = { tabId: n }, l = await Nh(), d = r.map(({ action: N }) => N).join(", "), p = wr({
      tabContext: { tabId: n, scopedLogger: this.deps.logger, mainTabId: -1 },
      config: {
        action: `ComputerBatch(${d})`,
        waitForFCP: !1,
        maxWaitingTimeoutMs: 2500
      }
    }), h = [], m = crypto.randomUUID(), g = r.findLast(
      (N) => i.includes(N.action)
    ), _ = g && r.indexOf(g);
    let y, b, E;
    for (const [N, k] of r.entries()) {
      if (this.deps.abortController?.signal.aborted) break;
      const v = performance.now();
      t.uuid && s?.onActionStarted(t.uuid, k), this.deps.overlayManager?.onAction(n, k.action.toLowerCase());
      const M = await bh(k.action).with("SCREENSHOT", async () => "Successfully captured screenshot scaled to viewport dimensions").with("WAIT", async () => (DR(k), await It(k.duration * 1e3), `Waited for ${k.duration} second(s)`)).with(
        "LEFT_CLICK",
        "RIGHT_CLICK",
        "DOUBLE_CLICK",
        "TRIPLE_CLICK",
        async () => {
          const C = await HR(n, o, k);
          Qi(C), await zR(n).catch((L) => {
            this.deps.logger.warn(
              "[ComputerBatch] Error while expecting select open",
              {
                error: L,
                tabId: n
              }
            );
          });
          const I = { DOUBLE_CLICK: 2, TRIPLE_CLICK: 3 }, [O, R] = no(C.coordinate, o), X = C.action === "RIGHT_CLICK" ? "right" : "left", F = I[C.action] ?? 1;
          this.deps.overlayManager?.onClickAction(n, O, R).catch(() => {
          }), N === _ && (y = C.coordinate, b = performance.now());
          const ue = k.ref ? Ga(k.ref).targetId : void 0, x = ue ? { targetId: ue } : { tabId: n }, A = go(x, l);
          return await Ql(x, A).click(O, R, { button: X, clickCount: F }), ((await KR(n).catch((L) => (this.deps.logger.warn(
            "[ComputerBatch] Error while clearing select open",
            {
              error: L,
              tabId: n
            }
          ), !1)) || "") && `<system-reminder>Native select picker was opened. Screenshot may not include the picker. To interact use "ref" attribute with "form_input" action.</system-reminder>
`) + `${C.action === "LEFT_CLICK" || C.action === "RIGHT_CLICK" ? "Clicked" : C.action === "DOUBLE_CLICK" ? "Double-clicked" : "Triple-clicked"} on tab ${n}`;
        }
      ).with("TYPE", async () => (rd(k), await sd(f, k.text, !1), `Typed "${k.text}" on tab ${n}`)).with("KEY", async () => (rd(k), await go(f, l).press(k.text), `Pressed ${k.text.split("+").length} key(s): ${k.text}`)).with("SCROLL", async () => {
        Qi(k);
        const [C, I] = no(k.coordinate, o), O = k.scroll_parameters;
        if (!O)
          throw new Ae(
            "Cannot scroll, scroll_parameters are not provided"
          );
        return `Scrolled in the ${(await this.doScroll({
          tabId: n,
          scrollParams: O,
          x: C,
          y: I
        })).toLowerCase()} direction`;
      }).with("LEFT_CLICK_DRAG", async () => {
        PR(k), Qi(k);
        const [C, I] = no(
          k.start_coordinate,
          o
        ), [O, R] = no(k.coordinate, o), X = go(f, l), F = Ql(f, X);
        return await F.move(C, I), await F.down(), await F.move(O, R), await F.up(), "Dragged from the start coordinate to the end coordinate.";
      }).with("SCROLL_TO", async () => {
        UR(k);
        const { object: C, debuggee: I } = await Xa(
          n,
          k.ref
        ).catch((O) => {
          throw new Ae(
            `[SCROLL_TO] No element found with reference: "${k.ref}". The element may have been removed from the page`,
            { cause: O }
          );
        });
        return await Jh(I, C.objectId), `Scrolled to element with reference: ${k.ref}`;
      }).otherwise(() => {
        throw new Ae(
          `Unsupported action ${k.action.toLowerCase()}, valid actions are: "left_click", "right_click", "double_click", "triple_click", "type", "key", "screenshot", "wait", "scroll", "left_click_drag"`
        );
      }).catch((C) => {
        const I = `Successful action results: ${JSON.stringify(h)}.
Failed action: ${k.action.toLowerCase()}, index: ${N}.
Error: ${C.message ?? String(C)}`, O = C instanceof Error ? C : new Error();
        throw O.message = I, O;
      }).finally(() => {
        Nn("agent.client_loop.batch_action_duration", {
          duration: Math.round(performance.now() - v),
          action: k.action
        });
      });
      if (h.push(M), N === _)
        try {
          ({ base64_image: E } = await this.takeScreenshot(
            n,
            {
              screenshotUuid: m,
              clickCoordinate: y,
              timeout: 1e3
              // fast screenshot before click
            }
          ));
        } catch {
        }
      const P = Math.floor(Math.random() * (OR - ed + 1)) + ed;
      N !== r.length - 1 && await It(P);
    }
    await p.wait();
    const S = !!E && !!b && performance.now() - b < LR, { base64_image: w, newViewportInfo: T } = await this.takeScreenshot(n, {
      screenshotUuid: m,
      dontSaveToStorage: S,
      clickCoordinate: S ? y : void 0,
      timeout: 1e4
    });
    return {
      tab_context: await this.getTabContext(n, T),
      message: JSON.stringify(h),
      base64_image: w,
      screenshot_uuid: m,
      click_screenshot: E,
      hide_final_screenshot: S
    };
  }
  /**
   * @deprecated Use ComputerBatch instead
   */
  async Computer(t) {
    return {
      tab_context: await this.getTabContext(t.tab_id),
      error: "Computer is deprecated, use ComputerBatch instead"
    };
  }
  async FormInput(t) {
    const n = t.tab_id;
    this.deps.overlayManager?.onAction(n, "form_input");
    const { object: r, debuggee: s } = await Xa(n, t.ref).catch(
      (u) => {
        throw new Ae(
          `No element found with reference: "${t.ref}". The element may have been removed from the page`,
          { cause: u }
        );
      }
    ), o = await Wa(
      "FormInput",
      s,
      r.objectId,
      FR
    );
    if (["hidden", "readonly"].includes(o)) {
      const u = o;
      throw new Ae(
        `Element type "${u}" is not a supported form input`
      );
    }
    if (o && BR.includes(o)) {
      const u = await Wa(
        "FormInput",
        s,
        r.objectId,
        $R,
        [o, t.value]
      );
      if (!u) throw new Error("Syntheticall input execution failed");
      return {
        tab_context: await this.getTabContext(n),
        error: "error" in u ? u.error : void 0,
        message: "message" in u ? u.message : void 0
      };
    }
    await sd({ tabId: n }, t.value, !0);
    const { screenshotUuid: i, base64_image: a, newViewportInfo: c } = await this.takeScreenshot(n);
    return {
      tab_context: await this.getTabContext(n, c),
      message: `Input set to "${t.value}"`,
      base64_image: a,
      screenshot_uuid: i
    };
  }
  async GetPageText(t) {
    const n = t.tab_id;
    this.deps.overlayManager?.onAction(n, "get_page_text");
    const r = {
      tabId: n,
      scopedLogger: this.deps.logger,
      mainTabId: -1
    }, s = await kt(n), o = await Hc(r), i = await ls({
      tab: s,
      html: o.html,
      isPdf: o.isPdf,
      logger: this.deps.logger
    });
    return {
      tab_context: await this.getTabContext(n),
      markdown: i.markdown
    };
  }
  async Navigate(t) {
    const n = t.tab_id;
    this.deps.overlayManager?.onAction(n, "navigate");
    const r = t.url, s = wr({
      tabContext: { tabId: n, scopedLogger: this.deps.logger, mainTabId: -1 },
      config: {
        action: "Navigate",
        waitForFCP: !1,
        maxWaitingTimeoutMs: 5e3
      }
    });
    let o = "";
    if (r === "forward") {
      await chrome.tabs.goForward(n);
      const u = await kt(n);
      o = `Navigated forward to ${u.pendingUrl ?? u.url}`;
    } else if (r === "back") {
      await chrome.tabs.goBack(n);
      const u = await kt(n);
      o = `Navigated back to ${u.pendingUrl ?? u.url}`;
    } else {
      const u = Xh(
        r.includes("://") ? r : `https://${r}`
      );
      if (await $e.isUrlBlocked(u))
        throw new Ae(
          "This url is restricted by user or system. You cannot navigate to this url."
        );
      await chrome.tabs.update(n, { url: u });
      const l = await kt(n);
      o = `Navigated to ${l.pendingUrl ?? l.url}`;
    }
    await s.wait();
    const { screenshotUuid: i, base64_image: a, newViewportInfo: c } = await this.takeScreenshot(n);
    return {
      tab_context: await this.getTabContext(n, c),
      message: o,
      base64_image: a,
      screenshot_uuid: i
    };
  }
  async ReadPage(t) {
    const n = t.tab_id;
    this.deps.overlayManager?.onAction(n, "read_page");
    const r = await yo(n, this.deps.logger), s = r.screenshotWidth / r.viewportWidth, o = {
      interactive: "INTERACTIVE",
      all: "ALL",
      viewport: "VIEWPORT"
    }, a = (await Wh({
      debuggee: { tabId: n },
      filter: o[t.filter ?? "unknown"] ?? o.viewport,
      mode: "YAML",
      scaleMultiplier: s,
      ref: t.ref_id ? Ga(t.ref_id) : void 0,
      depth: t.depth
    })).output.replace(
      /\\u[dD][89a-fA-F][0-9a-fA-F]{2}(?!\\u[dD][89a-fA-F][0-9a-fA-F]{2})/g,
      ""
    );
    return {
      tab_context: await this.getTabContext(n, r),
      result: a
    };
  }
  async TabsCreate(t) {
    const n = await this.deps.agentTabsManager.addTabToTask();
    if (await this.deps.agentTabsManager.maybeFocusTab(n).catch((i) => {
      this.deps.logger.warn(
        "[agent/maybeFocusTab] Error while focusing",
        i
      );
    }), t.url) {
      const i = wr({
        tabContext: {
          tabId: n.id,
          scopedLogger: this.deps.logger,
          mainTabId: -1
        },
        config: {
          action: "TabsCreate",
          waitForFCP: !0,
          maxWaitingTimeoutMs: 5e3
        }
      });
      await Vt(n.id, {
        url: t.url
      }), await i.wait();
    }
    const { screenshotUuid: r, base64_image: s, newViewportInfo: o } = await this.takeScreenshot(n.id);
    return {
      tab_context: await this.getTabContext(n.id, o),
      message: `Created new tab. Tab ID: ${n.id}`,
      tab_id: n.id,
      base64_image: s,
      screenshot_uuid: r
    };
  }
  async CreateSubagent(t) {
    if (!this.deps.initialPayload)
      throw new Error("Initial payload is not set");
    let n = {};
    try {
      n = JSON.parse(t.extra_headers ?? "{}");
    } catch {
      return {
        tab_context: void 0,
        error: "Invalid request parameters."
      };
    }
    try {
      await Zh(
        {
          query: t.prompt || "",
          taskId: t.task_uuid || "",
          start_url: t.start_url || "",
          source: "create_subagent_tool",
          extra_headers: n,
          mainPort: Ne.get(
            this.deps.initialPayload.senderTabId ?? -1
          ),
          entryId: this.deps.initialPayload.entryId,
          base_url: this.deps.initialPayload.base_url,
          senderTabId: this.deps.initialPayload.senderTabId,
          senderWindowId: this.deps.initialPayload.senderWindowId,
          is_subagent: !0
        },
        {
          windowId: this.deps.initialPayload.senderWindowId ?? chrome.windows.WINDOW_ID_CURRENT
        }
      );
    } catch (r) {
      return {
        tab_context: void 0,
        error: `Failed to start subagent: ${r instanceof Error ? r.message : String(r)}`
      };
    }
    return {
      tab_context: void 0
    };
  }
  async handleRpcError(t, n) {
    const r = await this.getTabContext(n);
    return t instanceof Ae ? (this.deps.abortController?.signal.aborted || this.deps.logger.warn("[handleRpcError] ToolError", t), {
      tab_context: r,
      error: `${nd}: ${t.message}`
    }) : (this.deps.abortController?.signal.aborted || this.deps.logger.error("[handleRpcError] Unexpected error", t), {
      tab_context: r,
      error: `${NR}: ${t instanceof Error ? t.message : String(t)}`
    });
  }
  async getTabContext(t, n) {
    try {
      n && (this.lastViewport = n);
      const r = await this.deps.agentTabsManager.getTaskTabs();
      let s = r[0]?.id ?? -1;
      const o = r.map((a) => (a.active && (s = a.id), {
        tab_id: a.id,
        title: a.title ?? "",
        url: xn(a.pendingUrl ?? a.url ?? "")
      })), i = t ?? s;
      return {
        current_tab_id: i,
        executed_on_tab_id: i,
        available_tabs: o,
        tab_count: r.length
      };
    } catch (r) {
      return this.deps.logger.error("[getTabContext] Failed to get tab context", r), {
        current_tab_id: t ?? -1,
        executed_on_tab_id: t ?? -1,
        available_tabs: [],
        tab_count: 0
      };
    }
  }
  async dispatchScrollFallback({
    debuggee: t,
    x: n,
    y: r,
    deltaX: s,
    deltaY: o
  }) {
    await $(
      t,
      "Input.dispatchMouseEvent",
      {
        type: "mouseWheel",
        x: n,
        y: r,
        deltaX: s,
        deltaY: o
      },
      "dispatchScrollFallback",
      5e3,
      this.deps.logger
    ), await It(250);
  }
  async doScroll({
    tabId: t,
    scrollParams: n,
    x: r,
    y: s
  }) {
    const o = { UP: -1, LEFT: -1 }, i = { RIGHT: "x", LEFT: "x" }, a = n?.scroll_direction ?? "DOWN", c = o[a] ?? 1, u = i[a] ?? "y";
    let f = !1, l;
    n?.scroll_maximum || n?.viewports_to_scroll ? l = n?.viewports_to_scroll ?? 99 : (l = (n?.scroll_amount || 3) * 100, f = !0);
    const d = await yo(t, this.deps.logger), p = { tabId: t };
    try {
      await Pe(
        {
          target: { tabId: t, allFrames: !0 },
          args: [u, l * c, f],
          func: (h, m, g) => {
            window.__pplxScrollTriggered = !1;
            const _ = (y) => {
              if (!y.target) return;
              window.removeEventListener("scroll", _, !0);
              const b = y.target;
              if (b === document || b === document.documentElement || b === document.body) {
                const S = h === "y" ? window.innerHeight : window.innerWidth, w = g ? m - Math.sign(m) : S * m - Math.sign(m);
                window.scrollBy({
                  top: h === "y" ? w : 0,
                  left: h === "x" ? w : 0
                }), window.__pplxScrollTriggered = !0;
              } else if ("scrollBy" in b) {
                const S = b, w = h === "y" ? S.clientHeight : S.clientWidth, T = g ? m - Math.sign(m) : w * m - Math.sign(m);
                S.scrollBy({
                  top: h === "y" ? T : 0,
                  left: h === "x" ? T : 0
                }), window.__pplxScrollTriggered = !0;
              }
            };
            window.addEventListener("scroll", _, !0), window.__pplxScrollListener = _;
          }
        },
        "doScroll",
        1e3
      ), await $(
        p,
        "Input.dispatchMouseEvent",
        {
          type: "mouseWheel",
          x: r,
          y: s,
          deltaX: u === "x" ? c : 0,
          deltaY: u === "y" ? c : 0
        },
        "doScroll",
        5e3,
        this.deps.logger
      ), await It(250);
    } finally {
      if (!(await Pe(
        {
          target: { tabId: t, allFrames: !0 },
          func: () => {
            const g = window.__pplxScrollTriggered, _ = window.__pplxScrollListener;
            return delete window.__pplxScrollListener, delete window.__pplxScrollTriggered, _ && window.removeEventListener("scroll", _, !0), g;
          }
        },
        "doScroll",
        1e3
      )).some((g) => g?.result)) {
        this.deps.logger.warn(
          "[doScroll] Listener did not trigger, applying fallback dispatch"
        );
        const g = u === "y" ? d.viewportHeight : d.viewportWidth, _ = f ? l * c : g * l * c;
        await this.dispatchScrollFallback({
          debuggee: p,
          x: r,
          y: s,
          deltaX: u === "x" ? _ : 0,
          deltaY: u === "y" ? _ : 0
        });
      }
    }
    return a;
  }
  async takeScreenshot(t, n) {
    const r = n?.screenshotUuid ?? crypto.randomUUID(), [s, o, i] = await Ya(
      t,
      this.deps.logger,
      n?.clickCoordinate ?? void 0,
      n?.timeout ?? 1e4
    );
    return n?.dontSaveToStorage || this.deps.externalMessagesManager?.onScreenshotCaptured(
      `data:image/${o};base64,${s}`,
      r,
      t
    ), {
      screenshotUuid: r,
      base64_image: s,
      newViewportInfo: i
    };
  }
}
function Qi(e) {
  const t = ["LEFT_CLICK", "RIGHT_CLICK"];
  if (!e.coordinate || e.coordinate.length < 2)
    throw new Ae(
      t.includes(e.action) ? `Either coordinate or ref parameter is required for ${e.action.toLowerCase()} action` : `coordinate parameter is required for ${e.action.toLowerCase()} action`
    );
}
function PR(e) {
  if (!e.start_coordinate || e.start_coordinate.length < 2)
    throw new Ae(
      `start_coordinate parameter is required for ${e.action.toLowerCase()} action`
    );
}
function rd(e) {
  if (!e.text)
    throw new Ae(
      `text parameter is required for ${e.action.toLowerCase()} action`
    );
}
function DR(e) {
  if (!e.duration || e.duration < 0)
    throw new Ae("duration parameter is required and must be positive");
  if (e.duration > 30)
    throw new Ae(
      "duration parameter must be positive int between 0 and 30"
    );
}
function UR(e) {
  if (!e.ref)
    throw new Ae(
      `ref parameter is required for ${e.action.toLowerCase()} action`
    );
}
const sd = async (e, t, n, r = null) => {
  const s = await Nh(), o = go(e, s);
  if (n && await o.press("ControlOrMeta+KeyA"), t === "") {
    await o.press("Backspace");
    return;
  }
  !r && await Mh(e, t) || (await cs("paste", e, async () => {
    try {
      window._savedClipboard = await navigator.clipboard.read();
    } catch {
    }
  }), await cs(
    "paste",
    e,
    async (a, c) => {
      const u = new ClipboardItem({
        "text/plain": a,
        ...c && { [c]: a }
      });
      await navigator.clipboard.write([u]);
    },
    [t, r]
  ), await o.press("ControlOrMeta+KeyV"), await cs("paste", e, async () => {
    const a = window._savedClipboard;
    if (a)
      try {
        await navigator.clipboard.write(a);
      } finally {
        delete window._savedClipboard;
      }
  }));
}, Xa = async (e, t) => {
  const { targetId: n, backendNodeId: r } = Ga(t), s = n ? { targetId: n } : { tabId: e };
  await $(
    s,
    "DOM.getDocument",
    {
      depth: 1,
      pierce: !0
    },
    "resolveRef"
  );
  const { object: o } = await $(
    s,
    "DOM.resolveNode",
    {
      backendNodeId: r
    },
    "resolveRef"
  ), { nodeId: i } = await $(
    s,
    "DOM.requestNode",
    {
      objectId: o.objectId
    },
    "resolveRef"
  );
  return { nodeId: i, object: o, debuggee: s };
}, FR = (e) => {
  const t = (i) => {
    const a = i.nodeName.toLowerCase();
    if (a === "select") return "select";
    if (a !== "input") return null;
    const c = i;
    return c.readOnly ? "readonly" : c.type.toLowerCase();
  }, r = !e.matches("input, textarea, select") && !e.isContentEditable && e.closest("button, [role=button], [role=checkbox], [role=radio]") || e;
  if (!r.matches("a, input, textarea, button, select, [role=link], [role=button], [role=checkbox], [role=radio]") && !r.isContentEditable) {
    const i = e.closest("label"), a = i?.control;
    if (a)
      return a.focus(), a.scrollIntoView({ behavior: "smooth", block: "center" }), t(i.control);
  }
  return r?.focus(), r.scrollIntoView({ behavior: "smooth", block: "center" }), t(r);
}, $R = (e, t, n) => {
  const r = (i) => {
    i.dispatchEvent(new Event("input", { bubbles: !0, composed: !0 })), i.dispatchEvent(new Event("change", { bubbles: !0 }));
  };
  if (t === "select") {
    const i = n.split(",").map((d) => d.trim()), a = document.activeElement, c = a.value, u = [...a.options];
    let f = !1;
    if (u.forEach((d) => {
      if (!i.includes(d.value) && !i.includes(d.text)) {
        d.selected = !1;
        return;
      }
      f || (a.value = ""), f = !0, d.selected = !0;
    }), r(a), f)
      return {
        message: `Selected option(s) "${n}" (previous: "${c}")`
      };
    const l = u.map((d) => `"${d.text}" (value: "${d.value}")`).join(", ");
    return {
      error: `Option(s) "${n}" not found. Available options: ${l}`
    };
  }
  if (t === "checkbox") {
    if (!["true", "false"].includes(n.toLowerCase()))
      return {
        error: `Checkbox requires a boolean value (true/false), got "${n.toLowerCase()}"`
      };
    const i = n.toLowerCase() === "true", a = document.activeElement, c = a.checked;
    return a.checked = i, r(a), { message: `Checkbox ${n} (previous: "${c}")` };
  }
  if (t === "radio") {
    const i = document.activeElement;
    return i.checked = !0, r(i), { message: `Radio button selected in group "${i.name}"` };
  }
  if (t === "range") {
    if (isNaN(Number(n)))
      return { error: `Range input requires a numeric value, got "${n}"` };
    const i = document.activeElement;
    return i.value = n, r(i), {
      message: `Range set to "${n}" (min: ${i.min}, max: ${i.max})`
    };
  }
  const s = document.activeElement, o = s.value;
  return s.value = n, r(s), {
    message: `Input "${t}" set to "${n}" (previous: "${o}")`
  };
}, BR = [
  "color",
  "date",
  "time",
  "datetime-local",
  "month",
  "range",
  "week",
  "select",
  "checkbox",
  "radio"
], VR = (e) => e.viewportWidth / e.screenshotWidth, no = (e, t) => {
  const n = VR(t);
  return [e[0] * n, e[1] * n];
}, Ya = async (e, t, n, r = 1e4) => {
  const s = await kt(e), o = s?.pendingUrl ?? s?.url ?? "";
  if (await $e.isUrlBlocked(o))
    throw new Error(
      "Screenshot of this page is blocked by the user's settings or their organization's settings."
    );
  const a = performance.now(), c = { tabId: e }, u = "jpeg", f = await $(
    c,
    "Page.captureScreenshot",
    {
      format: u,
      quality: 75,
      fromSurface: !0,
      optimizeForSpeed: !0,
      screenshotNewSurface: !0
    },
    "screenshotAndResize",
    r,
    t
  );
  Nn("agent.screenshot.capture_time_ms", {
    duration: performance.now() - a
  });
  const l = performance.now(), d = await yo(e, t), p = (m, g, _, y) => new Promise((b, E) => {
    const S = new Image();
    S.onerror = () => E(new Error("Failed to load screenshot image")), S.onload = () => {
      const { screenshotWidth: w, screenshotHeight: T, viewportWidth: N } = g, k = document.createElement("canvas");
      k.width = w, k.height = T;
      const v = k.getContext("2d");
      v?.drawImage(S, 0, 0, k.width, k.height);
      const [M, P] = _;
      if (typeof M == "number" && typeof P == "number" && v) {
        const I = Math.round(20 * (w / N));
        v.fillStyle = "oklch(71.92% 0.112 205.51)", v.beginPath(), v.arc(M, P, I, 0, 2 * Math.PI), v.fill();
      }
      const C = k.toDataURL("image/png").split(",")[1];
      b(C);
    }, S.src = `data:image/${y};base64,${m}`, setTimeout(() => E(new Error("Screenshot timed out")), 5e3);
  });
  let h;
  try {
    h = (await Pe(
      {
        target: { tabId: e },
        func: p,
        args: [
          f.data,
          d,
          n ?? [],
          u
        ]
      },
      "screenshotAndResize",
      5e3
    ))[0]?.result;
  } catch {
    h = await cs(
      "screenshotAndResize",
      c,
      p,
      [f.data, d, n ?? [], u]
    );
  }
  if (Nn("agent.screenshot.resize_time_ms", {
    duration: performance.now() - l
  }), !h)
    throw new Error("Failed to resize screenshot");
  return [h, "png", d];
}, od = 1.15 * 10 ** 6, ro = 1568, yo = async (e, t) => {
  const r = await cs("getViewportInfo", { tabId: e }, () => {
    if (!window.visualViewport) return null;
    let f = 0, l = 0, d = null;
    try {
      const m = document.createElement("div"), g = -2147483647 + Math.floor(Math.random() * 1e3), _ = (1e-3 + Math.random() * 1e-3).toFixed(6), y = [
        "position: fixed",
        "top: 0",
        "right: 0",
        "bottom: 0",
        "left: 0",
        `z-index: ${g}`,
        "pointer-events: none",
        `opacity: ${_}`
      ];
      for (let S = y.length - 1; S > 0; S--) {
        const w = Math.floor(Math.random() * (S + 1)), T = y[S];
        y[S] = y[w], y[w] = T;
      }
      m.style.cssText = y.join("; "), document.documentElement.appendChild(m);
      const b = m.clientWidth, E = m.clientHeight;
      f = window.innerWidth - b, l = window.innerHeight - E, m.remove();
    } catch (m) {
      d = {
        error_message: m instanceof Error ? m.message : String(m),
        document_ready_state: document.readyState
      };
    }
    const p = window.visualViewport.width, h = window.visualViewport.height;
    return {
      viewportWidth: Math.round(p + f),
      viewportHeight: Math.round(h + l),
      error: d
    };
  });
  if (!r)
    throw new Error(
      "Failed to get viewport info: visualViewport not available"
    );
  r.error && t.warn("[getViewportInfo] Error while calculating offset", {
    ...r.error,
    tabId: e
  });
  let { viewportWidth: s, viewportHeight: o } = r;
  const i = s * o, a = i > od ? Math.sqrt(od / i) : s > ro ? ro / s : o > ro ? ro / o : 1, c = Math.round(s * a), u = Math.round(o * a);
  return { viewportWidth: s, viewportHeight: o, screenshotWidth: c, screenshotHeight: u };
}, WR = (e, t) => !!e && (e.viewportWidth !== t.viewportWidth || e.viewportHeight !== t.viewportHeight), HR = async (e, t, n) => {
  if (!["LEFT_CLICK", "RIGHT_CLICK"].includes(n.action) || !n.ref) return n;
  const { object: s, debuggee: o, nodeId: i } = await Xa(
    e,
    n.ref
  ).catch((c) => {
    throw new Ae(
      `[normalizeAction] No element found with reference: "${n.ref}". The element may have been removed from the page`,
      { cause: c }
    );
  });
  await Jh(o, s.objectId);
  const a = await GR(o, i);
  return {
    ...n,
    // We need to "scale" coordinates down to match LLM scaled output
    // After this we can scale it back to normal for ref_id similar to [x,y] from model
    coordinate: [
      Math.round(
        t.screenshotWidth / t.viewportWidth * a[0]
      ),
      Math.round(
        t.screenshotHeight / t.viewportHeight * a[1]
      )
    ]
  };
}, Jh = async (e, t) => {
  await Wa("scrollTo", e, t, (n) => {
    let r;
    n.nodeType === Node.ELEMENT_NODE ? r = n : n.parentElement && (r = n.parentElement), r?.scrollIntoView({
      behavior: "instant",
      block: "center",
      inline: "center"
    });
  });
}, GR = async (e, t) => {
  const n = await $(
    e,
    "DOM.getBoxModel",
    {
      nodeId: t
    },
    "getCoordinate"
  ), { model: r } = n;
  if (!r?.content)
    throw new Error("Failed to get box model");
  const s = r.content, o = (s[0] + s[2]) / 2, i = (s[1] + s[5]) / 2;
  return [o, i];
}, zR = async (e) => {
  await Pe(
    {
      target: { tabId: e, allFrames: !0 },
      func: () => {
        const t = "_selectOpen", n = document.createElement("style");
        n.textContent = `
        @keyframes ${t} { from {opacity:1} to {opacity:1} }
        select:open { animation: ${t} 1ms linear; }
      `;
        const r = (a) => {
          a.animationName === "_selectOpen" && (o.wasOpened = !0);
        }, o = {
          style: n,
          wasOpened: !1,
          listener: r,
          clean: () => {
            n.remove(), document.removeEventListener("animationstart", r, !0), i._selectMeta === o && delete i._selectMeta;
          }
        }, i = window;
        i._selectMeta = o, document.documentElement.append(n), document.addEventListener("animationstart", r, !0), setTimeout(o.clean, 2e3);
      }
    },
    "expectSelectOpen",
    2500
  );
}, KR = async (e) => (await Pe(
  {
    target: { tabId: e, allFrames: !0 },
    func: () => {
      const n = window._selectMeta;
      return n ? (n.clean(), n.wasOpened) : !1;
    }
  },
  "clearSelectOpen",
  1e3
)).some((n) => n?.result);
class jR {
  constructor(t) {
    this.deps = t;
  }
  sidecarTabId;
  async onScreenshotCaptured(t, n, r) {
    const s = await this.getSidecarBroadcastingPorts();
    if (!s.length) return;
    const o = {
      type: "BROWSER_TASK_PROGRESS_SCREENSHOT",
      payload: {
        taskUuid: n,
        screenshot: t,
        entryId: this.deps.payload.entryId,
        tabId: r
      }
    };
    for (const i of s)
      try {
        i.postMessage(o);
      } catch (a) {
        this.deps.logger.error("[task/loop] Failed to send screenshot", a);
      }
  }
  async onTabAdded(t) {
    const n = await this.getSidecarBroadcastingPorts();
    if (!n.length) return;
    const r = {
      type: "MOVE_THREAD_TO_SIDECAR",
      payload: {
        entry_id: this.deps.payload.entryId,
        task_tab_ids: [t.id],
        url: "/search/" + this.deps.payload.thread_url_slug,
        reason: "agent-task-tab-added",
        thread_url_slug: this.deps.payload.thread_url_slug
      }
    };
    for (const s of n)
      s.postMessage(r);
    await dr(t.id, { opened: "opened" }), t?.active && await chrome.perplexity.sidecar.open({
      windowId: this.deps.taskContextPayload.windowId,
      animate: !0,
      takeFocus: !0
      // if tab is active - we want to focus sidecar instead of omnibox url which is default focus
    });
  }
  async shouldCloseInitialSenderTab() {
    const t = await this.getSidecarPort();
    return t ? t.sender?.tab?.id !== this.deps.payload.mainPort?.sender?.tab?.id : !1;
  }
  async onTaskFailure(t) {
    const n = await this.getSidecarBroadcastingPorts();
    if (!n.length) return;
    const r = {
      type: "AGENT_TASK_FAILURE",
      payload: {
        taskUuid: this.deps.payload.taskId,
        error: t,
        extraHeaders: this.deps.payload.extra_headers
      }
    };
    for (const s of n)
      s.postMessage(r);
  }
  async onTaskStop() {
    const t = await this.getSidecarBroadcastingPorts();
    if (!t.length) return;
    const n = {
      type: "BROWSER_TASK_STOP",
      payload: {
        entryId: this.deps.payload.entryId,
        taskUuid: this.deps.payload.taskId
      }
    };
    for (const r of t)
      r.postMessage(n);
  }
  async onActionStarted(t, n) {
    const r = await this.getSidecarBroadcastingPorts();
    if (!r.length) return;
    const s = {
      type: "ACTION_STARTED",
      payload: { uuid: t, action: n }
    };
    for (const o of r)
      try {
        o.postMessage(s);
      } catch (i) {
        this.deps.logger.error(
          "[task/loop] Failed to send action to ui",
          i
        );
      }
  }
  async getSidecarBroadcastingPorts() {
    const t = await this.getSidecarPort();
    return t ? [t] : [];
  }
  async getSidecarPort() {
    const t = await this.tryGetSidecarTabId();
    if (!t) {
      this.deps.logger.warn("[task/external] No sidecar tab id found");
      return;
    }
    const n = Ne.get(t);
    return n || this.deps.logger.warn(
      "[task/external] No sidecar port found for tab id",
      t
    ), n;
  }
  async tryGetSidecarTabId() {
    if (this.sidecarTabId) return this.sidecarTabId;
    const t = await chrome.windows.get(
      this.deps.taskContextPayload.windowId
    );
    if (t.sidecarTabId)
      return this.sidecarTabId = t.sidecarTabId, this.sidecarTabId;
  }
}
const On = {}, qR = async ({
  tabId: e,
  sidecarId: t,
  taskId: n = "",
  isPaused: r = !1,
  simpleMode: s = !1
}) => {
  if (await hc) {
    if (!(await chrome.perplexity.views.listWebOverlays(e)).length && On[e] && delete On[e], On[e]) return;
    const c = `?params=${encodeURIComponent(JSON.stringify({
      sidecarId: t,
      isPaused: r,
      simpleMode: s,
      tabId: e,
      taskId: n
    }))}`, u = chrome.runtime.getURL("overlay.html" + c), f = await chrome.perplexity.views.createWebOverlay(e, {
      visible: !0,
      mode: chrome.perplexity.views.WebOverlayMode.FULLSCREEN
    });
    chrome.perplexity.views.loadUrlInWebOverlay(f, u), On[e] = { id: f, enabled: !r };
    return;
  }
  await chrome.tabs.sendMessage(e, {
    type: "START_OVERLAY",
    payload: { sidecarTabId: t, isPaused: r, simpleMode: !0 }
  });
}, XR = async (e) => {
  if (await hc) {
    (await chrome.perplexity.views.listWebOverlays(e)).forEach(({ id: t }) => {
      try {
        chrome.perplexity.views.disableWebOverlayForwardEventsToTab(t);
      } catch {
      }
      chrome.perplexity.views.destroyWebOverlay(t);
    }), delete On[e];
    return;
  }
  await chrome.tabs.sendMessage(e, {
    type: "STOP_OVERLAY"
  });
}, YR = (e) => {
  if (e.type !== "BUTTON_RECT_CHANGE") return !1;
  const t = e.payload, n = On[e.payload.tabId];
  if (!n)
    return G.warn("Overlay state is not found", t), !0;
  if (n.buttonRect = t.rect, n.enabled) return !0;
  try {
    chrome.perplexity.views.enableWebOverlayForwardEventsToTab(
      n.id,
      !1,
      [t.rect]
    );
  } catch (r) {
    G.warn("Failed to enable overlay", { error: r, payload: t });
  }
  return !0;
}, JR = (e) => {
  delete On[e];
};
class ZR {
  constructor(t) {
    this.deps = t;
  }
  async onTabAttach(t, n) {
    const r = await hc, s = !r && await RA(t);
    (!n || r) && !s && await qR({
      tabId: t,
      sidecarId: -1,
      taskId: this.deps.taskId,
      isPaused: !1,
      simpleMode: !0
    }).catch((i) => {
      this.deps.logger.warn(
        "[overlayManager#onTabAttach] Failed to start overlay",
        i,
        { tabId: t }
      );
    }), await Yi(t, {
      agent_is_working: !0
    });
  }
  async onTabDetach(t) {
    await XR(t).catch((n) => {
      this.deps.logger.warn(
        "[overlayManager#onTabDetach] Failed to stop overlay",
        n,
        { tabId: t }
      );
    }), await Yi(t, {
      agent_is_working: !1
    }), await Yi(t, {
      has_badge: !0
    });
  }
  async onAction(t, n) {
    const r = {
      type: "OVERLAY_TASK_STATUS_UPDATE",
      payload: {
        status: n,
        tabId: t
      }
    };
    await chrome.runtime.sendMessage(r);
  }
  async onClickAction(t, n, r) {
    const s = {
      type: "OVERLAY_CLICK_FEEDBACK",
      payload: {
        tabId: t,
        x: n,
        y: r
      }
    };
    await chrome.runtime.sendMessage(s);
  }
}
const ea = "about:blank";
class QR {
  constructor(t) {
    this.deps = t;
    const n = t.initialPayload?.query ?? "", r = n.split(" ").filter((s) => s.length > 0);
    this.groupTitle = r.length > 2 ? `${r.slice(0, 2).join(" ")}...` : n, (this.deps.initialPayload?.is_subagent || this.deps.initialPayload?.is_mission_control) && (this.isHidden = !0), this.windowId = this.deps.taskContextPayload?.windowId ?? chrome.windows.WINDOW_ID_CURRENT;
  }
  tabRegistry = /* @__PURE__ */ new Set();
  tabGroupId;
  lastUsedTabId;
  windowId;
  retryTabGroupsTimeout;
  minTabsSizeToGroup = 2;
  // by default we want to group tabs after second tab creation
  initialTabContainsTabGroup = !1;
  unsubscribeFns = [];
  groupTitle;
  isHidden = !1;
  setupListeners() {
    this.unsubscribeFns.length && (this.unsubscribeFns.forEach((a) => a()), this.unsubscribeFns = []);
    const t = (a, c, u) => {
      if (!(!a.tabId || !this.tabRegistry.has(a.tabId)) && c === "Page.javascriptDialogOpening") {
        const f = u;
        this.deps.logger.info("[tabsManager] Dialog opened, accepting", {
          params: f,
          tabId: a.tabId
        }), $(
          a,
          "Page.handleJavaScriptDialog",
          {
            accept: !0
          },
          "handleDialog",
          1e3,
          this.deps.logger
        ).catch((l) => {
          this.deps.logger.error(
            "[tabsManager] Error while handling JS dialog",
            {
              params: f
            },
            l
          );
        });
      }
    }, n = this.handleTabUpdate.bind(this), r = this.handleTabRemove.bind(this), s = this.handleTabCreated.bind(this), o = this.handleTabGroupClose.bind(this), i = this.handleWindowRemoved.bind(this);
    chrome.tabs.onUpdated.addListener(n), chrome.tabs.onRemoved.addListener(r), chrome.tabs.onCreated.addListener(s), chrome.tabGroups.onRemoved.addListener(o), chrome.windows.onRemoved.addListener(i), chrome.debugger.onEvent.addListener(t), this.unsubscribeFns.push(
      () => chrome.tabs.onUpdated.removeListener(n),
      () => chrome.tabs.onRemoved.removeListener(r),
      () => chrome.tabs.onCreated.removeListener(s),
      () => chrome.tabGroups.onRemoved.removeListener(o),
      () => chrome.windows.onRemoved.removeListener(i),
      () => chrome.debugger.onEvent.removeListener(t)
    );
  }
  async getTaskTabs() {
    return (await Promise.all([...this.tabRegistry].map(Ve))).filter(
      (t) => t !== void 0
    );
  }
  async addTabToTask(t = ea) {
    const n = await za(
      {
        url: t,
        active: !1,
        windowId: this.windowId
      },
      {
        hidden: this.isHidden
      }
    );
    if (await this.addTabToState(n), this.tabRegistry.size === 1)
      try {
        await this.tryCloseInitialTab(n.id);
      } catch (r) {
        this.deps.logger.warn("[tabsManager] Error while closing initial tab", {
          error: r
        });
      }
    return n;
  }
  async init(t) {
    this.setupListeners();
    const n = t ?? this.deps.initialPayload?.tab_id, r = this.deps.initialPayload?.mainPort?.sender?.tab;
    if (n && n > 0) {
      const s = await Ve(n);
      if (s?.id) {
        await this.addTabToState(s), s.groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE && (this.tabGroupId = s.groupId, this.initialTabContainsTabGroup = !0);
        const o = await Po(s);
        o?.id && (this.minTabsSizeToGroup = 3, await this.addTabToState(o));
      }
    } else r?.groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE && (this.tabGroupId = r?.groupId, this.initialTabContainsTabGroup = !0);
    if (this.tabGroupId !== void 0 && this.tabGroupId !== chrome.tabGroups.TAB_GROUP_ID_NONE) {
      const s = await chrome.tabs.query({ groupId: this.tabGroupId });
      await Promise.all(
        s.map((o) => {
          if (!this.tabRegistry.has(o.id))
            return this.addTabToState(o);
        })
      );
    } else
      this.tabGroupId = void 0;
    this.tabRegistry.size === 0 && this.deps.initialPayload?.start_url && await this.addTabToTask(this.deps.initialPayload.start_url);
  }
  makeVisible() {
    this.isHidden = !1;
  }
  async destroy() {
    this.retryTabGroupsTimeout && clearTimeout(this.retryTabGroupsTimeout), this.unsubscribeFns.forEach((t) => t()), this.unsubscribeFns = [], await Promise.allSettled(
      [...this.tabRegistry].map(async (t) => {
        this.tabRegistry.delete(t), Xi.delete(t), this.deps.overlayManager?.onTabDetach(t);
        try {
          await Gl(t);
        } catch {
        }
        this.isHidden && this.deps.initialPayload?.is_subagent && chrome.tabs.remove(t);
      })
    );
  }
  async maybeFocusTab(t) {
    if (!t.id) return;
    const n = this.lastUsedTabId;
    if (this.lastUsedTabId = t.id, n !== t.id) {
      if (n) {
        if ((await Ve(n))?.active !== !0) return;
      } else {
        const [r] = await Ls({
          windowId: t.windowId,
          active: !0
        });
        if (!r?.id || !this.tabRegistry.has(r?.id)) return;
      }
      t.hidden || await Vt(t.id, {
        active: !0
      });
    }
  }
  async addTabToState(t) {
    const n = t.id;
    if (n === this.deps.initialPayload?.mainPort?.sender?.tab?.id)
      return;
    if (Xi.has(n)) {
      this.tabRegistry.has(n) ? this.deps.logger.warn(
        "[tabsManager] Trying to add tab while its already in context, ignoring",
        {
          tabId: n
        }
      ) : this.deps.logger.warn(
        "[tabsManager] Trying to add tab from another task into context, ignoring",
        {
          tabId: n
        }
      );
      return;
    }
    if (t.discarded || t.height === 0 && t.width === 0 && t.status === "complete") {
      const [i] = await Promise.all([
        za(
          {
            windowId: t.windowId,
            url: t.pendingUrl ?? t.url ?? ea,
            active: t.active,
            openerTabId: t.id,
            index: t.index,
            pinned: t.pinned
          },
          {
            hidden: this.isHidden
          }
        ),
        chrome.tabs.remove(n)
      ]);
      this.deps.logger.info(
        "[tabsManager] Recreating the tab, because discarded or empty size",
        {
          oldTabId: t.id,
          newTabId: i.id,
          tab: t
        }
      );
      return;
    }
    const s = t.pendingUrl ?? t.url ?? "", o = s === ea;
    Xi.add(n);
    try {
      await Hn(n);
    } catch (i) {
      $e.isInternalPage(s) || this.deps.logger.warn(
        "[TabsManager#addTabToState] Error while attaching debugger",
        {
          error: i
        }
      );
    }
    this.tabRegistry.add(n), this.deps.externalMessagesManager?.onTabAdded(t).finally(() => {
      this.deps.overlayManager?.onTabAttach(n, o);
    }), await this.tryGroupTabs();
  }
  handleTabUpdate(t, n, r) {
    if (!this.tabRegistry.has(t)) {
      this.tabGroupId && n.groupId === this.tabGroupId && (this.deps.logger.info("[tabsManager] External tab added to tab group", {
        tabId: t
      }), this.addTabToState(r));
      return;
    }
    n.status === "complete" && this.deps.overlayManager?.onTabAttach(t), n.groupId === chrome.tabGroups.TAB_GROUP_ID_NONE && (this.deps.logger.info("[tabsManager] Tab removed from tab group", {
      tabId: t
    }), this.tabRegistry.delete(t), Gl(t), this.deps.overlayManager?.onTabDetach(t));
  }
  handleTabRemove(t, n) {
    this.tabRegistry.has(t) && (this.tabRegistry.delete(t), this.deps.logger.info("[tabsManager] Tab closed", {
      tabId: t
    }), this.tabRegistry.size === 0 && (this.deps.logger.warn("[tabsManager] Last agent tab was closed"), this.deps.abortController?.abort("AGENT_TAB_CLOSED")));
  }
  async handleTabCreated(t) {
    !t.id || this.tabRegistry.has(t.id) || !(t.openerTabId && this.tabRegistry.has(t.openerTabId)) || t.pendingUrl === "chrome://newtab/" || t.url === "chrome://newtab/" || (t.windowId !== this.windowId && await chrome.tabs.move(t.id, {
      windowId: this.windowId,
      index: ((await Ve(t.openerTabId))?.index ?? 0) + 1
    }), this.isHidden && await Vt(t.id, { active: !1 }, { hidden: !0 }), await this.addTabToState(t), this.deps.logger.info("[tabsManager] New tab added because of opener", {
      openerId: t.openerTabId,
      tabId: t.id
    }));
  }
  async handleTabGroupClose(t) {
    t.id === this.tabGroupId && (this.tabGroupId = void 0, this.deps.logger.warn("[tabsManager] Tab group with agent tabs was closed"), this.deps.abortController?.abort("TAB_GROUP_CLOSED"));
  }
  handleWindowRemoved(t) {
    t === this.windowId && (this.deps.logger.warn("[tabsManager] Window with agent tabs was closed"), this.deps.abortController?.abort("WINDOW_CLOSED"));
  }
  async tryGroupTabs() {
    if (!(this.tabRegistry.size < this.minTabsSizeToGroup))
      try {
        this.tabGroupId === void 0 ? (this.tabGroupId = await chrome.tabs.group({
          tabIds: [...this.tabRegistry],
          groupId: this.tabGroupId,
          createProperties: {
            windowId: this.windowId
          }
        }), await chrome.tabGroups.update(this.tabGroupId, {
          collapsed: !1,
          color: DA(),
          title: this.groupTitle
        })) : this.tabGroupId = await chrome.tabs.group({
          tabIds: [...this.tabRegistry],
          groupId: this.tabGroupId
        });
      } catch (t) {
        if (t instanceof Error && t.message.includes(
          "Tabs cannot be edited right now (user may be dragging a tab)"
        )) {
          this.retryTabGroupsTimeout || (this.retryTabGroupsTimeout = setTimeout(() => {
            this.deps.logger.warn(
              "[tabsManager] Cannot group because of DnD inprogress, retrying"
            ), this.tryGroupTabs(), this.retryTabGroupsTimeout = void 0;
          }, 250));
          return;
        }
        throw t;
      }
  }
  async tryCloseInitialTab(t) {
    this.initialTabContainsTabGroup || this.deps.initialPayload?.is_mission_control || this.deps.initialPayload?.is_subagent || !this.deps.initialPayload?.mainPort?.sender?.tab?.id || !await this.deps.externalMessagesManager?.shouldCloseInitialSenderTab() || (await chrome.tabs.remove(this.deps.initialPayload.mainPort.sender.tab.id), await chrome.tabs.update(t, {
      active: !0
    }));
  }
}
const id = 15e3, ex = 2e4;
class tx {
  constructor(t, n) {
    this.baseUrl = t, this.agentSocketMetrics = n;
  }
  socket;
  reconnectPromise = null;
  isClosed = !1;
  // ! For now it handles only one task at a time
  tasksMap = /* @__PURE__ */ new Map();
  logger = G;
  async connect() {
    if (this.socket?.readyState !== WebSocket.OPEN) {
      if (this.socket?.readyState === WebSocket.CLOSED || this.socket?.readyState === WebSocket.CLOSING)
        throw new Error("Socket already closed");
      return this.reconnectPromise ? this.reconnectPromise : (this.reconnectPromise = To(async () => {
        if (this.socket?.readyState === WebSocket.OPEN)
          throw new Error("Socket already connected");
        const t = this.getSocketUrl();
        this.logger.info(`[socket] Connecting to ${t}`), await this.setupSocketConnection(t), this.logger.info(`[socket] Connected to ${t}`), this.tryCloseSocket(!0);
      })().finally(() => {
        this.reconnectPromise = null;
      }), this.reconnectPromise);
    }
  }
  getSocketUrl() {
    return this.baseUrl + "/agent";
  }
  async setupSocketConnection(t, n = Date.now()) {
    if (Date.now() - n >= id) {
      const r = "timeout";
      throw await Promise.allSettled(
        [...this.tasksMap.values()].map((s) => s.onClose(r))
      ), new Error(`WebSocket connection failed after ${id}ms`);
    }
    this.socket = new WebSocket(t);
    try {
      await new Promise((r, s) => {
        this.socket.onclose = (o) => {
          const i = o.reason || "empty reason";
          Promise.allSettled(
            [...this.tasksMap.values()].map((a) => a.onClose(i))
          ), s(new Error(`[${o.code}]: ${i}`));
        }, this.socket.onopen = () => {
          this.setupKeepAlive(), r();
        };
      });
    } catch (r) {
      return this.isClosed ? void 0 : (this.logger.warn("[socket] Websocket connection failed, retrying", r), await new Promise((s) => setTimeout(s, 100)), this.setupSocketConnection(t, n));
    }
    this.socket.onclose = (r) => {
      const s = r.reason || "empty reason";
      this.logger.info(`[socket] WebSocket closed. [${r.code}] ${s}`), Promise.allSettled(
        [...this.tasksMap.values()].map((o) => o.onClose(s))
      );
    }, this.socket.onmessage = To(this.handleRpcMessage);
  }
  handleRpcMessage = async (t) => {
    const n = JSON.parse(t.data);
    await Promise.allSettled(
      [...this.tasksMap.values()].map((r) => r.onMessage(n))
    );
  };
  setupKeepAlive() {
    const t = { keep_alive: {} }, n = setInterval(
      () => this.send({ message: t }),
      ex
    );
    this.socket.addEventListener("close", () => clearInterval(n));
  }
  send({ message: t, abortSignal: n, onSend: r }) {
    const s = JSON.stringify(t);
    this.connect().then(() => {
      if (n?.aborted || this.isClosed) {
        r?.({ aborted: !0 });
        return;
      }
      this.socket.send(s), r?.({ aborted: !1 });
    });
  }
  async recordSpan({
    name: t,
    traceHeaders: n,
    wrappedFn: r,
    extraTags: s = {}
  }) {
    const o = crypto.randomUUID(), i = chrome.runtime.getManifest().version;
    this.send({
      message: {
        start_span: {
          trace_headers: n,
          resource_name: "extension." + t,
          uuid: o,
          tags_json: JSON.stringify({
            agent_version: i,
            ...s
          })
        }
      }
    });
    try {
      return await r();
    } finally {
      this.send({
        message: {
          stop_span: { uuid: o }
        }
      });
    }
  }
  registerTask({
    taskId: t,
    onMessage: n,
    onClose: r
  }) {
    this.tasksMap.set(t, { onMessage: n, onClose: r }), this.agentSocketMetrics.onTaskStart(t, { enableReconnect: !1 });
  }
  unregisterTask({ taskId: t }) {
    this.agentSocketMetrics.onTaskEnd(t), this.tasksMap.delete(t), this.tryCloseSocket();
  }
  tryCloseSocket(t = !1) {
    this.tasksMap.size || (this.isClosed = !0, this.socket?.close(
      1e3,
      t ? "Task canceled before connection" : "No more tasks"
    ), this.socket = void 0, this.agentSocketMetrics.destroy());
  }
}
const nx = 5e3, rx = [
  { value: 36e5, metric: "activity_gap_60min" },
  { value: 12e5, metric: "activity_gap_20min" },
  { value: 6e5, metric: "activity_gap_10min" },
  { value: 3e5, metric: "activity_gap_5min" },
  { value: 6e4, metric: "activity_gap_1min" },
  { value: 2e4, metric: "activity_gap_20s" },
  { value: 15e3, metric: "activity_gap_15s" },
  { value: 1e4, metric: "activity_gap_10s" }
];
class sx {
  constructor(t, n) {
    this.reportMetric = t, this.logger = n, this.watchPendingTasks();
  }
  pendingTasks = /* @__PURE__ */ new Map();
  pendingRequests = /* @__PURE__ */ new Map();
  watchInterval;
  metricPrefix = "agent_engine.extension.";
  taskScopedLoggers = /* @__PURE__ */ new Map();
  getMetricName(t) {
    return this.metricPrefix + t;
  }
  watchPendingTasks() {
    this.watchInterval = setInterval(() => {
      const t = performance.now();
      for (const [n, r] of this.pendingTasks) {
        if (r.isPaused) continue;
        const s = t - r.latestActivity.time;
        for (const { value: o, metric: i } of rx)
          if (s > o) {
            this.checkAndReportThreshold(
              r,
              n,
              s,
              o,
              i
            );
            break;
          }
      }
    }, nx);
  }
  checkAndReportThreshold(t, n, r, s, o) {
    r > s && !t.reportedThresholds.has(s) && (t.reportedThresholds.add(s), this.reportMetric(this.getMetricName(o), {
      task_id: n,
      agent_engine: t.useAgentEngine,
      enable_reconnect: t.enableReconnect
    }));
  }
  onRpcRequestReceived(t, n, r = {}) {
    const s = performance.now(), o = this.pendingTasks.get(n);
    if (!o) {
      this.logger.warn(
        `[AgentSocketMetrics] Skip RPC request for unknown task: ${n}`
      );
      return;
    }
    if (typeof r.useAgentEngine == "boolean" && (o.useAgentEngine = r.useAgentEngine), o.firstRpcRequestTime === null) {
      const i = s - o.startTime;
      this.reportMetric(this.getMetricName("first_rpc_request"), {
        task_id: n,
        duration: i,
        agent_engine: o.useAgentEngine,
        enable_reconnect: o.enableReconnect
      }), o.firstRpcRequestTime = s;
    }
    o.pendingRequestIds.add(t), this.pendingRequests.set(t, { startTime: s, taskId: n }), o.latestActivity.time = s, o.reportedThresholds.clear();
  }
  onRpcResponseSent(t) {
    const n = performance.now(), r = this.pendingRequests.get(t);
    if (!r) {
      this.logger.warn(
        `[AgentSocketMetrics] Skip RPC response for unknown request: ${t}`
      );
      return;
    }
    const s = this.pendingTasks.get(r.taskId);
    if (!s) {
      this.logger.warn(
        `[AgentSocketMetrics] Skip RPC response for unknown task: ${r.taskId}`
      );
      return;
    }
    const o = n - r.startTime;
    this.reportMetric(this.getMetricName("request_latency"), {
      task_id: r.taskId,
      request_id: t,
      duration: o,
      agent_engine: s.useAgentEngine,
      enable_reconnect: s.enableReconnect
    }), s.latestActivity.time = n, s.reportedThresholds.clear(), s.pendingRequestIds.delete(t), this.pendingRequests.delete(t);
  }
  onTaskStart(t, { enableReconnect: n }) {
    if (this.pendingTasks.has(t)) return;
    const s = performance.now();
    this.pendingTasks.set(t, {
      startTime: s,
      pendingRequestIds: /* @__PURE__ */ new Set(),
      latestActivity: { time: s },
      isPaused: !1,
      reportedThresholds: /* @__PURE__ */ new Set(),
      useAgentEngine: void 0,
      enableReconnect: n,
      firstRpcRequestTime: null
    }), this.reportMetric(this.getMetricName("agent_start"), {
      task_id: t,
      enable_reconnect: n
    });
  }
  onTaskEnd(t) {
    const n = performance.now(), r = this.pendingTasks.get(t);
    if (!r) {
      this.logger.warn(
        `[AgentSocketMetrics] Skip agent end for unknown task: ${t}`
      );
      return;
    }
    this.pendingTasks.delete(t);
    const s = n - r.startTime;
    this.reportMetric(this.getMetricName("agent_end"), {
      task_id: t,
      duration: s,
      agent_engine: r.useAgentEngine,
      enable_reconnect: r.enableReconnect
    });
    const o = this.taskScopedLoggers.get(t);
    this.taskScopedLoggers.delete(t);
    const i = Array.from(r.pendingRequestIds);
    for (const a of i) {
      const c = this.pendingRequests.get(a);
      if (c) {
        this.pendingRequests.delete(a);
        const u = n - c.startTime;
        o && o.info(
          `[AgentSocketMetrics] Unfinished request ${a} running for ${u}ms (agent_engine: ${r.useAgentEngine})`
        );
      }
    }
  }
  onTaskPause(t) {
    const n = performance.now(), r = this.pendingTasks.get(t);
    if (!r) {
      this.logger.warn(
        `[AgentSocketMetrics] Skip task pause for unknown task: ${t}`
      );
      return;
    }
    r.isPaused = !0, r.latestActivity.time = n, this.reportMetric(this.getMetricName("task_paused"), {
      task_id: t,
      agent_engine: r.useAgentEngine,
      enable_reconnect: r.enableReconnect
    });
    const s = this.taskScopedLoggers.get(t);
    s && s.info(
      `[AgentSocketMetrics] Task paused with ${r.pendingRequestIds.size} pending requests.`
    );
  }
  onTaskResume(t) {
    const n = performance.now(), r = this.pendingTasks.get(t);
    if (!r) {
      this.logger.warn(
        `[AgentSocketMetrics] Skip task resume for unknown task: ${t}`
      );
      return;
    }
    r.isPaused = !1, r.latestActivity.time = n, r.reportedThresholds.clear(), this.reportMetric(this.getMetricName("task_resumed"), {
      task_id: t,
      agent_engine: r.useAgentEngine,
      enable_reconnect: r.enableReconnect
    });
    const s = this.taskScopedLoggers.get(t);
    s && s.info(
      `[AgentSocketMetrics] Task resumed with ${r.pendingRequestIds.size} pending requests.`
    );
  }
  destroy() {
    this.watchInterval && (clearInterval(this.watchInterval), this.watchInterval = void 0);
  }
  setTaskLogger(t, n) {
    this.taskScopedLoggers.set(t, n);
  }
}
const ox = { keep_alive: {} }, ix = (e) => new Promise((t) => setTimeout(t, e));
class ax {
  sharedLogger;
  socketUrl;
  keepAliveInterval;
  maxReconnectRetries;
  agentSocketMetrics;
  socket = null;
  keepAliveIntervalId = null;
  logPrefix = "ReconnectingAgentSocket";
  generateUuid;
  pendingTasks;
  connectPromise = null;
  retryAttempt;
  constructor(t) {
    this.sharedLogger = t.sharedLogger, this.pendingTasks = /* @__PURE__ */ new Map(), this.socketUrl = `${t.baseUrl}${t.endpoint}`, this.keepAliveInterval = t.keepAliveInterval, this.maxReconnectRetries = t.maxReconnectRetries, this.agentSocketMetrics = t.agentSocketMetrics, this.retryAttempt = 0, this.generateUuid = t.generateUuid, this.log("debug", "Initialized");
  }
  /**
   * Connect to the WebSocket with automatic retry and exponential backoff.
   * - If already connected, this is a no-op.
   * - If already connecting, returns the existing connection promise.
   * - If not connected the socket will attempt to connect
   * - After successfully connecting, automatic reconnect is enabled if the
   *   socket closes while there are pending tasks.
   * - If there are no pending tasks when the socket closes, it will not
   *   attempt to reconnect.
   */
  async connect({ reconnect: t }) {
    if (this.getSocketState() !== WebSocket.OPEN) {
      if (this.connectPromise)
        return this.connectPromise;
      this.connectPromise = new $a();
      try {
        this.log(
          "info",
          t ? `Reconnecting to ${this.socketUrl}` : `Connecting to ${this.socketUrl}`
        ), await this.establishConnection(), this.log(
          "info",
          t ? `Reconnected to ${this.socketUrl}` : `Connected to ${this.socketUrl}`
        ), t && (await this.sendTaskReconnectMessages(), this.onReconnectSuccess()), this.connectPromise.resolve();
      } catch (n) {
        this.notifyPendingTasksOfConnectionFailure(n), this.connectPromise.reject(n);
      } finally {
        this.connectPromise = null;
      }
    }
  }
  /**
   * When reconnecting, send a reconnect message for each pending task
   * so the backend can re-associate the task with this socket
   */
  async sendTaskReconnectMessages() {
    if (!this.socket) {
      this.log("warn", "Cannot send reconnect messages: socket is null");
      return;
    }
    for (const t of this.pendingTasks.values()) {
      let n = {};
      if (t.getReconnectData)
        try {
          n = await t.getReconnectData();
        } catch (s) {
          this.log("warn", "Failed to get reconnect data", {
            error: s,
            task_id: t.taskId
          });
        }
      const r = {
        reconnect_agent: {
          task_uuid: t.taskId,
          extra_headers: t.extraHeaders,
          ...n
        }
      };
      this.socket.send(JSON.stringify(r));
    }
  }
  /**
   * If we can't reconnect after the max attempts, notify all tasks of
   * the failure so they can handle it appropriately
   * @param error
   */
  notifyPendingTasksOfConnectionFailure(t) {
    for (const n of this.pendingTasks.values())
      n.onClose(t instanceof Error ? t.message : "Unknown error");
  }
  /**
   * Recursively attempt to establish a WebSocket connection with
   * exponential backoff until successful or max retries reached.
   * Each attempt creates a new WebSocket instance.
   * On successful connection, sets up event handlers and starts
   * the keep-alive ping interval.
   * If the connection fails, waits for a backoff period and retries.
   * If max retries are reached, throws an error.
   */
  async establishConnection() {
    if (this.retryAttempt > this.maxReconnectRetries) {
      const n = `Max reconnect attempts reached (${this.retryAttempt})`;
      throw this.log("warn", n), this.onMaxRetriesExceeded(), new Error(n);
    }
    const t = new $a();
    this.socket = new WebSocket(this.socketUrl), this.socket.onopen = () => t.resolve(), this.socket.onclose = () => t.reject(
      new Error("Socket closed before connection was established")
    );
    try {
      await t, this.socket.onclose = (n) => this.onSocketClose(n), this.socket.onmessage = (n) => this.onReceiveMessage(n), this.startKeepAlive(), this.retryAttempt = 0;
    } catch (n) {
      this.retryAttempt++;
      const r = this.getReconnectBackoffTime(this.retryAttempt);
      return this.log("warn", `Connection failed, retrying in ${r}ms`, {
        error: n
      }), this.onBeforeReconnect({
        attempt: this.retryAttempt,
        backoffMs: r
      }), await ix(r), this.establishConnection();
    }
  }
  /**
   * Socket close handler added after an initial successful connection.
   * If there are pending tasks, attempt to reconnect.
   * If there are no pending tasks, do not reconnect and clean up the socket.
   */
  onSocketClose(t) {
    this.stopKeepAlive(), this.pendingTasks.size ? (this.log(
      "info",
      `Socket closed with ${this.pendingTasks.size} task${this.pendingTasks.size === 1 ? "" : "s"} pending, attempting to reconnect…`,
      { reason: t.reason, code: t.code }
    ), this.connect({ reconnect: !0 })) : (this.socket = null, this.log(
      "info",
      "Socket closed with no pending tasks, not reconnecting.",
      { reason: t.reason, code: t.code }
    ));
  }
  /**
   * Calculate exponential backoff time in milliseconds based on the
   * number of retry attempts, capped at 30 seconds.
   */
  getReconnectBackoffTime(t) {
    return Math.min(100 * 2 ** t, 3e4);
  }
  /**
   * Get the current WebSocket readyState, or null if no socket exists.
   */
  getSocketState() {
    return this.socket ? this.socket.readyState : null;
  }
  /**
   * Event handler for incoming WebSocket messages.
   * Parses the message and broadcasts it to all registered tasks.
   * Catches and logs any errors during message handling.
   */
  async onReceiveMessage(t) {
    try {
      const n = JSON.parse(t.data), r = [...this.pendingTasks.values()].map((s) => s.onMessage(n));
      await Promise.allSettled(r);
    } catch (n) {
      this.log("error", "Error handling incoming message", n);
    }
  }
  /**
   * Start the keep-alive ping interval to send periodic
   * keep-alive messages to maintain the WebSocket connection.
   */
  startKeepAlive() {
    this.stopKeepAlive(), this.keepAliveIntervalId = setInterval(
      () => this.send({ message: ox }),
      this.keepAliveInterval
    );
  }
  /**
   * Stop the keep-alive ping interval if it is running.
   */
  stopKeepAlive() {
    this.keepAliveIntervalId && (clearInterval(this.keepAliveIntervalId), this.keepAliveIntervalId = null);
  }
  /**
   * Wait for any ongoing connection attempt and then close
   * the socket if there are no pending tasks… No tasks will
   * prevent automatic reconnect attempts.
   */
  async closeConnectionIfAllTasksComplete() {
    this.connectPromise && await this.connectPromise, !(this.pendingTasks.size > 0) && this.socket && this.socket.close();
  }
  /** Logging util */
  log(t, n, r = {}) {
    this.sharedLogger[t](`[${this.logPrefix}] ${n}`, r);
  }
  /**
   * Synchronous wrapper to send a message via the WebSocket.
   * Ensure the socket is connected before send
   * If the socket cannot connect and it throws, capture and
   * log the error but do not throw
   */
  send({ message: t, abortSignal: n, onSend: r }) {
    this.connect({ reconnect: !1 }).then(() => {
      if (n?.aborted)
        r?.({ aborted: !0 });
      else if (this.socket) {
        const s = JSON.stringify(t);
        this.socket.send(s), r?.({ aborted: !1 });
      } else
        this.log("warn", "Attempted to send message but socket is null"), r?.({ aborted: !0 });
    }).catch((s) => {
      this.log("error", "Failed to send message", s);
    });
  }
  /**
   * Add a task to be managed by this socket.
   */
  registerTask({
    taskId: t,
    onMessage: n,
    onClose: r,
    extraHeaders: s,
    getReconnectData: o
  }) {
    this.pendingTasks.set(t, {
      taskId: t,
      onMessage: n,
      onClose: r,
      extraHeaders: s,
      getReconnectData: o
    }), this.agentSocketMetrics.onTaskStart(t, { enableReconnect: !0 }), this.log("debug", `Registering task ${t}`);
  }
  /**
   * Dissociate a task from this socket and check if
   * we should close the connection if there are none
   */
  unregisterTask({ taskId: t }) {
    this.pendingTasks.delete(t), this.agentSocketMetrics.onTaskEnd(t), this.log("debug", `Unregistering task ${t}`), this.closeConnectionIfAllTasksComplete();
  }
  /**
   * Wrapper around send to capture timings of async
   * operations (wrappedFn) for performance monitoring
   */
  async recordSpan({
    name: t,
    traceHeaders: n,
    wrappedFn: r,
    extraTags: s = {}
  }) {
    const o = this.generateUuid(), i = chrome.runtime.getManifest().version;
    this.send({
      message: {
        start_span: {
          trace_headers: n,
          resource_name: "extension." + t,
          uuid: o,
          tags_json: JSON.stringify({
            agent_version: i,
            ...s
          })
        }
      }
    });
    try {
      return await r();
    } finally {
      this.send({
        message: {
          stop_span: { uuid: o }
        }
      });
    }
  }
  /**
   * Lifecycle hooks for testing/monitoring.
   * Override these in subclasses to observe connection events.
   */
  onBeforeReconnect(t) {
  }
  onReconnectSuccess() {
  }
  onMaxRetriesExceeded() {
  }
}
const Zh = async (e, t) => {
  const n = nt({
    taskId: e.taskId,
    entryId: e.entryId,
    ...e.extra_headers,
    // @ts-expect-error OMIT fields
    secret_headers: void 0,
    baggage: void 0
  });
  if (Ph.has(e.taskId)) {
    n.warn("Task with given uuid already exists, ignoring");
    return;
  }
  const r = new sx(
    lr,
    G
  );
  r.setTaskLogger(e.taskId, n);
  const s = new AbortController();
  let o;
  e.enable_reconnect ? o = new ax({
    baseUrl: e.base_url,
    endpoint: "/agent",
    agentSocketMetrics: r,
    sharedLogger: G,
    keepAliveInterval: 2e4,
    maxReconnectRetries: 4,
    captureError: Le,
    generateUuid: () => crypto.randomUUID()
  }) : o = new tx(e.base_url, r);
  const i = new jR({
    logger: n,
    payload: e,
    taskContextPayload: t
  }), a = new ZR({
    logger: n,
    taskId: e.taskId
  }), c = new QR({
    initialPayload: e,
    overlayManager: a,
    externalMessagesManager: i,
    logger: n,
    taskContextPayload: t,
    abortController: s
  }), u = new MR({
    logger: n,
    agentTabsManager: c,
    initialPayload: e,
    overlayManager: a,
    externalMessagesManager: i,
    abortController: s
  });
  return new cx({
    initialPayload: e,
    logger: n,
    socket: o,
    tabManager: c,
    externalMessagesManager: i,
    rpcService: u,
    abortController: s
  }).startTaskWrapper();
};
class cx {
  constructor(t) {
    this.deps = t, At.set(this.deps.initialPayload.taskId, this), Ph.add(this.deps.initialPayload.taskId);
  }
  isCleanedUp = !1;
  startTime = 0;
  cleanAbortHandler = void 0;
  get entryId() {
    return this.deps.initialPayload.entryId;
  }
  get taskId() {
    return this.deps.initialPayload.taskId;
  }
  async getTaskTabs() {
    return this.deps.tabManager.getTaskTabs();
  }
  makeVisible() {
    return this.deps.tabManager.makeVisible();
  }
  async startTaskWrapper() {
    this.startTask().catch((t) => {
      this.deps.logger.error("[task] Failed to start agent task", t), this.cleanup("AGENT_TASK_FAILED_TO_START"), this.deps.externalMessagesManager.onTaskFailure("unhandled");
    });
  }
  async startTask() {
    Nn("agent.client_loop.start", {
      duration: 0
    }), this.startTime = performance.now();
    const t = JSON.stringify({
      ...this.deps.initialPayload.extra_headers,
      unified_flag: !0
    }), n = this.handleAbortController.bind(this);
    if (this.deps.abortController.signal.addEventListener(
      "abort",
      n
    ), this.cleanAbortHandler = () => {
      this.deps.abortController.signal.removeEventListener(
        "abort",
        n
      );
    }, this.deps.socket.registerTask({
      extraHeaders: t,
      taskId: this.deps.initialPayload.taskId,
      onClose: (u) => {
        this.cleanup(`AGENT_SOCKET_FAILED_${u}`);
      },
      onMessage: async (u) => {
        if (u.task_uuid !== this.deps.initialPayload.taskId) return;
        if (u.method === "ReportTaskComplete") {
          this.cleanup("AGENT_TASK_COMPLETED");
          return;
        }
        const f = await this.deps.rpcService.dispatchRpcRequest(u);
        this.isCleanedUp || this.deps.socket.send({
          message: { rpc_response: f },
          onSend: () => {
          }
        });
      },
      getReconnectData: async () => {
        const u = await this.deps.rpcService.getTabContext();
        let f;
        if (u.current_tab_id)
          try {
            f = (await Ya(
              u.current_tab_id,
              this.deps.logger
            ))[0];
          } catch (l) {
            this.deps.logger.warn(
              "[reconnect] Failed to capture screenshot",
              l,
              {
                tab_id: this.deps.initialPayload.tab_id
              }
            );
          }
        return {
          tabs_context: u,
          current_tab_base64_image: f
        };
      }
    }), this.isCleanedUp) return;
    try {
      await this.deps.tabManager.init();
    } catch (u) {
      this.deps.logger.warn("[tabsManager/init] Failed to init tabs", u);
    }
    const r = await this.deps.rpcService.getTabContext(), s = r.current_tab_id;
    let o;
    if (s > 0)
      try {
        o = (await Ya(s, this.deps.logger, null, 2e3))[0];
      } catch (u) {
        this.deps.logger.warn(
          "[task] Failed to capture initial sidecar screenshot",
          u,
          {
            tab_id: s
          }
        );
      }
    if (this.isCleanedUp) return;
    const i = Math.round(performance.now() - this.startTime), a = !!o, c = {
      start_agent: {
        task: this.deps.initialPayload.query,
        task_uuid: this.deps.initialPayload.taskId,
        extension_version: chrome.runtime.getManifest().version,
        url: this.deps.initialPayload.url,
        tabs_context: r,
        extra_headers: t,
        client_start_time_ms: i,
        supported_features: [
          "computer_batch",
          "computer_ref",
          "create_subagent"
        ],
        current_tab_base64_image: o
      }
    };
    this.deps.socket.send({
      onSend: () => {
        const u = JSON.stringify(c);
        this.deps.logger.info("[task] Agent task started", {
          duration: i,
          entryId: this.deps.initialPayload.entryId,
          enable_reconnect: this.deps.initialPayload.enable_reconnect,
          is_mission_control: this.deps.initialPayload.is_mission_control,
          is_subagent: this.deps.initialPayload.is_subagent,
          query: this.deps.initialPayload.query,
          start_url: this.deps.initialPayload.start_url,
          tabs_context: r,
          has_initial_screenshot: a,
          size_mb: Number((u.length / (1024 * 1024)).toFixed(2))
        }), Nn("agent.client_loop.start_duration", {
          duration: i,
          has_initial_screenshot: a
        });
      },
      message: c
    });
  }
  handleAbortController() {
    this.cleanup(`ABORTED_BY_${this.deps.abortController.signal.reason}`);
  }
  /**
   * Determines if a stop_agent message should be sent based on the cleanup reason.
   * For reconnect-enabled tasks, avoid sending stop for socket failures (transient disconnections).
   */
  shouldSendStopAgent(t) {
    return !t.startsWith("AGENT_SOCKET_FAILED_");
  }
  async cleanup(t) {
    if (this.isCleanedUp) return;
    this.isCleanedUp = !0, At.delete(this.deps.initialPayload.taskId), Nn("agent.client_loop.total_duration_ms", {
      duration: performance.now() - this.startTime,
      reason: t
    }), this.cleanAbortHandler?.(), this.deps.abortController.abort("cleanup_" + t);
    const n = this.deps.initialPayload.enable_reconnect && this.shouldSendStopAgent(t);
    if (this.deps.logger.debug("[task/cleanup] Cleanup initiated", {
      reason: t,
      enable_reconnect: this.deps.initialPayload.enable_reconnect,
      shouldSendStop: n
    }), n) {
      const r = new $a();
      this.deps.socket.send({
        message: { stop_agent: { task_uuid: this.deps.initialPayload.taskId } },
        onSend: ({ aborted: s }) => s ? r.reject() : r.resolve()
      });
      try {
        await r;
      } catch (s) {
        this.deps.logger.error(
          "[task/cleanup] Failed to send stop_agent",
          s
        );
      }
    } else
      this.deps.logger.info(
        "[task/cleanup] Skipping stop_agent for transient disconnection",
        { reason: t }
      );
    this.deps.socket.unregisterTask({
      taskId: this.deps.initialPayload.taskId
    }), this.deps.tabManager.destroy().catch((r) => {
      this.deps.logger.warn("[task/cleanup] Failed to destroy tabManager", {
        error: r
      });
    }), this.deps.logger.info("[task/cleanup] Agent task cleanup done", {
      reason: t,
      is_new_agent: !0,
      duration: performance.now() - this.startTime
    });
  }
  stopTask(t, n = !1) {
    n && this.deps.externalMessagesManager.onTaskStop(), this.cleanup(t).catch((r) => {
      this.deps.logger.error(
        "[task#stopTask] Error on stopTask cleanup",
        {
          reason: t
        },
        r
      );
    });
  }
}
const ux = async (e, t) => {
  await Pe(
    {
      target: { tabId: e },
      func: (n) => {
        window.__PPLX_CONTENT_SCRIPT__.setupScreenshotTool(n);
      },
      args: [t]
    },
    "captureVisibleScreenshot",
    1e3
  );
}, lx = async (e) => {
  await Pe(
    {
      target: { tabId: e },
      func: () => {
        window.__PPLX_CONTENT_SCRIPT__.deactivateScreenshotTool();
      }
    },
    "deactivateScreenshotTool",
    1e3
  );
}, ad = async (e) => await chrome.tabs.captureVisibleTab(e, {
  format: "png"
}), Qh = (e) => {
  try {
    const t = new URL(e);
    return Xb(t.hostname);
  } catch {
    return !1;
  }
}, cd = (e) => {
  try {
    const n = new URL(e).pathname.startsWith("/sidecar");
    return Qh(e) && n;
  } catch {
    return !1;
  }
}, dx = (e) => {
  try {
    const n = new URL(e).pathname.startsWith("/inline-assistant");
    return Qh(e) && n;
  } catch {
    return !1;
  }
};
async function fx(e, t, n) {
  switch (e.type) {
    case "CAPTURE_FULL_SCREENSHOT": {
      const r = t.tab?.windowId, s = t.tab?.id, i = (r ? await chrome.windows.get(r) : void 0)?.sidecarTabId ?? e.payload.sidecarTabId;
      if (!r || !s || !i)
        return n({
          error: "Tab not found"
        });
      const a = nt({ tabId: s });
      a.info("Capturing fullscreen screenshot", s);
      const c = await ad(r);
      a.debug("Sending screenshot to sidecar", i);
      const u = Ne.get(i);
      return u ? (u.postMessage({
        type: "SCREENSHOT_CAPTURED",
        payload: {
          screenshot: c
        }
      }), n({ success: !0 })) : (a.error("Sidecar port not found", i), n({
        error: "Sidecar port not found"
      }));
    }
    case "CAPTURE_VISIBLE_TAB": {
      const r = t.tab?.windowId, s = t.tab?.id, i = (r ? await chrome.windows.get(r) : void 0)?.sidecarTabId ?? e.payload.sidecarTabId;
      if (!r || !s || !i)
        return n({
          error: "Tab not found"
        });
      const a = nt({ tabId: s });
      a.info("Capturing visible tab screenshot", s);
      const c = await ad(r);
      return a.debug("Sending screenshot back to content script"), n({
        success: !0,
        response: {
          screenshot: c
        }
      });
    }
    case "CAPTURE_PARTIAL_SCREENSHOT": {
      const r = t.tab?.windowId, s = t.tab?.id, i = (r ? await chrome.windows.get(r) : void 0)?.sidecarTabId ?? e.payload.sidecarTabId;
      if (!r || !s || !i)
        return n({
          error: "Tab not found"
        });
      const a = nt({ tabId: s });
      a.debug("Sending screenshot to sidecar", i);
      const c = Ne.get(i);
      return c ? (c.postMessage({
        type: "SCREENSHOT_CAPTURED",
        payload: {
          screenshot: e.payload.screenshot
        }
      }), n({ success: !0 })) : (a.error("Sidecar port not found", i), n({
        error: "Sidecar port not found"
      }));
    }
    case "BROWSER_TASK_STOP": {
      const r = t.tab?.windowId, s = t.tab?.id, o = nt({ tabId: s });
      o.info("[BROWSER_TASK_STOP] Stopping browser task", { tabId: s });
      const i = await zA(
        r ?? chrome.windows.WINDOW_ID_CURRENT,
        {
          sidecarTabId: e.payload.sidecarTabId,
          taskUuid: e.payload.taskUuid,
          entryId: e.payload.entryId
        },
        "user-action",
        o
      );
      return n({
        success: i
      });
    }
    case "USER_SELECTION_CAPTURED": {
      if (t && t.tab && t.tab.url && (cd(t.tab.url) || dx(t.tab.url)))
        return;
      const r = t.tab?.windowId;
      if (!r || r === chrome.windows.WINDOW_ID_NONE)
        return n({
          error: "Window not found"
        });
      const o = (await chrome.windows.get(r)).sidecarTabId, i = (await jA(t.tab?.id))?.bubbleTabId, a = e.payload?.selection, c = [o, i].filter(Boolean);
      let u = c.map((f) => Ne.get(f ?? -1)).filter(Boolean);
      if (u.length !== c.length) {
        const f = Array.from(Ne.values()).filter(
          (l) => l && l.sender && l.sender.url && cd(l.sender.url)
        );
        if (!u.length)
          return n({
            error: "No ports found"
          });
        u = [...u, ...f];
      }
      return u.forEach((f) => {
        f && f.postMessage({
          type: "USER_SELECTION_CAPTURED",
          payload: {
            selection: a
          }
        });
      }), n({ success: !0 });
    }
    case "OVERLAY_TASK_STOP": {
      const r = e.payload.taskId, s = At.get(r);
      if (!s) {
        G.error("[OVERLAY_TASK_STOP] Task not found for stop", {
          taskId: r
        });
        return;
      }
      s.stopTask("EXTERNAL_AGENT_STOP_overlay_stop_btn", !0);
      return;
    }
  }
}
const px = async (e) => {
  const t = nt({}), r = (await Lh(
    "test-idle",
    t,
    chrome.windows.WINDOW_ID_CURRENT
  )).id, s = await Hn(r), o = {
    tabId: r,
    isVisibleAgent: !1,
    scopedLogger: t,
    mainTabId: -1
  }, i = wr({
    config: {
      action: "DOM_SNAPSHOT_TEST",
      waitForFCP: !0
    },
    tabContext: o
  }), a = performance.now();
  await BA(o, e), await i.wait();
  const c = performance.now() - a, u = await Hc(o), f = performance.now(), l = await ls({
    tab: await kt(r),
    html: u.html,
    isPdf: u.isPdf,
    logger: o.scopedLogger
  }), d = performance.now() - f;
  return await s(), await chrome.tabs.remove(r), {
    snapshotAxTree: {
      html: u.html,
      meta: u.meta,
      fetchTime: u.fetchTime,
      parseTime: u.parseTime,
      isPdf: u.isPdf
    },
    idleTime: c,
    markdown: {
      time: d,
      content: l.markdown,
      type: l.type
    }
  };
}, ud = async (e) => {
  if (e) {
    const n = At.get(e);
    return n ? await n.getTaskTabs() : [];
  }
  const t = [];
  for (const n of At.values()) {
    const r = await n.getTaskTabs();
    t.push(...r);
  }
  return t;
}, hx = async (e) => {
  const t = [];
  for (const n of e) {
    const r = Date.now() - 6048e5;
    if (!n.payload) continue;
    const s = JSON.parse(n.payload).task_uuid;
    if (n.lastAccessed && r > n.lastAccessed && n.hidden && s) {
      G.debug(
        "Removing completed, hidden tab that is older than 7 days",
        {
          tabId: n.id,
          taskUuid: s
        }
      );
      try {
        await chrome.tabs.remove(n.id);
      } catch (o) {
        G.error(
          "Error removing completed, hidden tab",
          {
            tabId: n.id,
            taskUuid: s
          },
          o
        );
      }
    } else
      t.push(n);
  }
  return t;
}, mx = "MCP is not supported", gx = "DXT is not supported", yx = [
  "Local MCP is not enabled",
  "DXT is not enabled"
], em = async ({
  type: e,
  tag: t,
  payload: n,
  context: r,
  handler: s
}) => {
  const o = performance.now(), i = nt(r ?? {});
  i.debug(`${t}(${e}): request`, { _payload: n });
  try {
    const a = await s(n);
    return i.debug(`${t}(${e}): response`, {
      _payload: a,
      duration: performance.now() - o
    }), { success: !0, response: a };
  } catch (a) {
    return a instanceof Error && yx.includes(a.message) ? (i.debug(`${t}(${e}): feature is disabled`), { success: !1, error: a.message }) : (i.error(
      `${t}(${e}): error`,
      {
        duration: performance.now() - o
      },
      a
    ), {
      success: !1,
      error: a instanceof Error ? a.message : "Unknown error"
    });
  }
}, Fr = async ({
  type: e,
  payload: t,
  context: n,
  handler: r
}) => Ss ? em({
  type: e,
  tag: "MCP",
  payload: t,
  context: n,
  handler: r
}) : { success: !1, error: mx }, Ns = async ({
  type: e,
  payload: t,
  context: n,
  handler: r
}) => ef ? em({
  type: e,
  tag: "DXT",
  payload: t,
  context: n,
  handler: r
}) : { success: !1, error: gx }, _x = async (e, t) => Fr({
  type: e.type,
  payload: e.payload,
  context: {},
  handler: async (n) => (await chrome.perplexity.mcp.getTools(n.serverName)).map((s) => ({
    id: `${e.payload.serverName}${vm}${s.name}`,
    tool: {
      name: s.name,
      description: s.description,
      input_schema: s.schema
      // annotations: {},
      // server_provided_metadata: {},
    }
  }))
}), bx = async (e, t) => Fr({
  type: e.type,
  payload: e.payload,
  context: e.context,
  handler: async ({ mcpServerName: n, toolName: r, toolArgs: s }) => await chrome.perplexity.mcp.callTool(
    n,
    r,
    s
  )
}), wx = async (e, t) => Fr({
  type: e.type,
  payload: void 0,
  context: {},
  handler: () => chrome.perplexity.mcp.getStdioServers()
}), Ex = async (e, t) => Fr({
  type: e.type,
  payload: e.payload,
  context: {},
  handler: ({ name: n, command: r, env: s }) => chrome.perplexity.mcp.addStdioServer(n, r, s)
}), Sx = async (e, t) => Fr({
  type: e.type,
  payload: e.payload,
  context: {},
  handler: ({ existingServerName: n, updates: r }) => chrome.perplexity.mcp.updateStdioServer(
    n,
    r
  )
}), Tx = async (e, t) => Fr({
  type: e.type,
  payload: e.payload,
  context: {},
  handler: ({ name: n }) => chrome.perplexity.mcp.removeStdioServer(n)
}), vx = async (e, t) => Ns({
  type: e.type,
  payload: e.payload,
  context: {},
  handler: ({ url: n }) => chrome.perplexity.dxt.install(n)
}), Ix = async (e, t) => Ns({
  type: e.type,
  payload: e.payload,
  context: {},
  handler: ({ name: n }) => chrome.perplexity.dxt.uninstall(n)
}), kx = async (e, t) => Ns({
  type: e.type,
  payload: void 0,
  context: {},
  handler: () => chrome.perplexity.dxt.getInstalledPackages()
}), tm = (e) => {
  if (!Kb)
    return null;
  const t = e;
  return Object.values(chrome.perplexity.dxt.Permission).includes(t) ? t : null;
}, Cx = async (e, t) => Ns({
  type: e.type,
  payload: e.payload,
  context: {},
  handler: async ({ permission: n }) => {
    const r = tm(n);
    return r ? chrome.perplexity.dxt.hasPermission(r) : null;
  }
}), Ax = async (e, t) => Ns({
  type: e.type,
  payload: e.payload,
  context: {},
  handler: async ({ permission: n }) => {
    const r = tm(n);
    return r ? chrome.perplexity.dxt.requestPermission(r) : null;
  }
});
function Rx() {
  const e = () => {
    const s = document.contentType;
    if (s && (s.includes("application/pdf") || s.includes("application/x-pdf") || s.includes("application/x-google-chrome-pdf")))
      return { isPDF: !0, method: "mimeType", value: s };
    function o() {
      return [
        'embed[type="application/pdf"]',
        'object[type="application/pdf"]',
        'iframe[src*=".pdf"]',
        'embed[src*=".pdf"]',
        'object[data*=".pdf"]'
      ].some(
        (c) => document.querySelector(c) !== null
      );
    }
    return /\.pdf(\?|#|$)/i.test(window.location.href) ? { isPDF: !0, method: "url", value: window.location.href } : document.querySelector("#viewer") && document.querySelector(".pdfViewer") ? { isPDF: !0, method: "pdfjs" } : document.querySelector('embed[type="application/pdf"]') && document.body.children.length === 1 ? { isPDF: !0, method: "chrome-viewer" } : o() ? { isPDF: !0, method: "embedded" } : { isPDF: !1 };
  }, t = () => {
    const s = {}, o = document.head || document.querySelector("head");
    return o && o.querySelectorAll('meta[property^="og:"]').forEach((a) => {
      const c = a.getAttribute("property")?.toLowerCase(), u = a.getAttribute("content");
      if (c && u && c.startsWith("og:")) {
        const f = c.replace("og:", "");
        s[f] = u;
      }
    }), s;
  }, { isPDF: n } = e(), r = t();
  return { isPDF: n, meta: r };
}
const nm = "__pplxAbortExtraction", _o = /* @__PURE__ */ new Map();
async function xx(e, t, n, r) {
  try {
    const s = `${nm}_${t}`, o = await Pe(
      {
        target: { tabId: e },
        func: (a, c) => {
          const u = ({
            selector: h,
            attribute: m = "textContent",
            textExtractionRegex: g
          }) => {
            if (!h)
              return null;
            try {
              const _ = document.querySelector(h);
              if (!_)
                return null;
              let y = null;
              if (m === "textContent")
                y = _.textContent?.trim() ?? null;
              else {
                const b = _.getAttribute(m);
                b && (y = new URL(b, window.location.href).href);
              }
              if (y && g)
                try {
                  const E = new RegExp(g).exec(y);
                  E && (y = E.slice(1).find((w) => w !== void 0) ?? E[0]);
                } catch {
                }
              return y;
            } catch {
              return null;
            }
          }, f = (h) => Array.isArray(h), l = async () => {
            const h = {};
            for (const [m, g] of Object.entries(c)) {
              let _;
              if (f(g)) {
                _ = [];
                for (const y of g) {
                  const b = u(y);
                  if (b === null && !y.optional)
                    return null;
                  _.push(b);
                }
              } else if (_ = u(g), _ === null && !g.optional)
                return null;
              h[m] = _;
            }
            return h;
          }, d = new Promise((h, m) => {
            globalThis[a] = () => {
              m(new Error("Extraction aborted"));
            };
          }), p = Promise.race([l(), d]).catch(
            () => null
          );
          return p.finally(() => {
            delete globalThis[a];
          }), p;
        },
        args: [s, r]
      },
      "startExtractionTask",
      1e3
    );
    if (!o.length)
      return null;
    const i = o[0]?.result;
    return i || null;
  } catch (s) {
    return G.error("Error extracting data from DOM", { tabId: e, url: n }, s), null;
  }
}
function Ox(e) {
  _o.delete(e.tabId);
  const t = `${nm}_${e.taskId}`;
  Pe(
    {
      target: { tabId: e.tabId },
      func: (n) => {
        globalThis[n]?.();
      },
      args: [t]
    },
    "stopExtractionTask",
    1e3
  );
}
function Lx({
  tabId: e,
  url: t,
  config: n
}) {
  const r = _o.get(e);
  if (r) {
    if (r.url === t)
      return r.promise;
    Ox(r);
  }
  const s = crypto.randomUUID(), o = {
    taskId: s,
    tabId: e,
    url: t,
    promise: xx(e, s, t, n)
  };
  return _o.set(e, o), o.promise.finally(() => {
    _o.delete(e);
  }), o.promise;
}
const ld = /^www\./, Nx = {
  brand_name: "product_brand",
  image: "product_image_url",
  product_name: "product_name",
  price: "product_price",
  compare_at_price: "compare_at_price",
  additional_search_filters: "additional_search_filters"
}, dd = ["brand_name", "compare_at_price", "price"], fd = ["image"];
async function Mx() {
  const e = await bA.GET(
    "/rest/shopping/assistant/browser-config",
    "browser_agent",
    {
      timeoutMs: wA.MEDIUM,
      retries: 2,
      includeCredentials: !0,
      baseUrlOverride: await $e.getRestAsyncServerUrl()
    }
  );
  if (e.error || !e.data)
    throw new Error(
      `Failed to get shopping assistant config: ${JSON.stringify(e)}`
    );
  return e.data;
}
let Yr = null;
async function Px() {
  return Yr || (Yr = Mx(), Yr.catch(() => {
    Yr = null;
  })), Yr;
}
async function Dx(e) {
  const t = await Px();
  if (!t) return null;
  let n = null;
  try {
    n = new URL(e);
  } catch {
    return null;
  }
  if (!n.protocol.startsWith("http")) return null;
  const r = n.hostname.replace(ld, ""), s = n.pathname, o = t.sites.find((i) => {
    const a = i.merchant_domain.replace(ld, "");
    return r === a || r.endsWith(`.${a}`);
  });
  if (!o) return null;
  for (const i of o.product_details_extraction_patterns)
    try {
      if (new RegExp(i.path).test(s))
        return i;
    } catch (a) {
      G.error(
        "Error matching URL pattern",
        {
          path: i.path
        },
        a
      );
    }
  return null;
}
function Ux(e) {
  return Nx[e];
}
function rm(e, ...t) {
  return Object.fromEntries(
    Object.entries(e).filter(
      ([n]) => !t.includes(n)
    )
  );
}
function Fx(e, t) {
  const n = Object.entries(e).map(([r, s]) => [t(r), s]).filter(([r]) => r !== void 0);
  return Object.fromEntries(n);
}
function $x(e) {
  const t = {}, n = rm(e, "path");
  return Object.entries(n).forEach(([r, s]) => {
    if (s.static) return;
    let o;
    s.css_selector && (o = {
      selector: s.css_selector,
      ...dd.includes(r) ? { optional: !0 } : {},
      ...fd.includes(r) ? { attribute: "src" } : {},
      ...s.text_extraction_regex ? { textExtractionRegex: s.text_extraction_regex } : {}
    }), s.css_selectors && (o = s.css_selectors.map((i) => ({
      selector: i,
      ...dd.includes(r) ? { optional: !0 } : {},
      ...fd.includes(r) ? { attribute: "src" } : {},
      ...s.text_extraction_regex ? { textExtractionRegex: s.text_extraction_regex } : {}
    }))), o && (t[r] = o);
  }), t;
}
function Bx(e) {
  const t = {}, n = rm(e, "path");
  return Object.entries(n).forEach(([r, s]) => {
    s.static && (t[r] = s.static);
  }), t;
}
async function Vx({
  tabId: e,
  url: t
}) {
  const n = await Dx(t);
  if (!n) return;
  const r = $x(n), s = await Lx({ tabId: e, url: t, config: r });
  if (!s) return;
  const o = {
    path: t,
    ...s,
    ...Bx(n)
  };
  return Fx(
    o,
    (a) => Ux(
      a
    )
  );
}
const ir = {
  HISTORY: "HISTORY",
  OPEN_TABS: "OPEN_TABS",
  RECENTLY_CLOSED_TABS: "RECENTLY_CLOSED_TABS"
}, sm = 11e3, Kc = sm - 1e3, Wx = 6500, pd = 1e4, Hx = Kc - 1e3;
class Gx {
  constructor(t, n) {
    this.scopedLogger = t, this.sender = n, this.GetContent = Wc(sm)(this.GetContent);
  }
  getWindowId() {
    return this.sender.tab?.windowId === chrome.windows.WINDOW_ID_NONE ? chrome.windows.WINDOW_ID_CURRENT : this.sender.tab?.windowId ?? chrome.windows.WINDOW_ID_CURRENT;
  }
  async GetContent(t) {
    if (!await $e.isSearchEnabled())
      throw new ts("Personal search is disabled.");
    const r = {
      contents: new Array()
    }, s = t.pages.map(async (a) => {
      const c = performance.now();
      if (await $e.isUrlBlocked(a.url)) {
        this.scopedLogger.info(
          `[ToolService.GetContent.GetContent] Blocked by user or system: ${a.url}`
        );
        return;
      }
      const f = await zx(a, this.scopedLogger, this.sender), l = await Hn(f.id), d = {
        tabId: f.id,
        scopedLogger: this.scopedLogger,
        mainTabId: this.sender.tab?.id ?? -1
      }, p = performance.now() - c;
      try {
        const h = performance.now();
        f.type === "HIDDEN" && await Kx(d, f);
        const m = performance.now() - h, g = await kt(f.id), _ = `${g.title}`, y = this.extractProductDataSafely({
          tabId: f.id,
          url: f.url
        }), { html: b, meta: E, isPdf: S, fetchTime: w, parseTime: T } = await Hc(d), N = performance.now(), { markdown: k, type: v } = await ls({
          tab: g,
          html: b,
          isPdf: S,
          logger: this.scopedLogger
        }), M = performance.now() - N, { result: P, parseTime: C } = await y, I = {
          ...a,
          title: _,
          html: "",
          markdown: k,
          og_meta: E,
          pdp_data: P
        };
        return r.contents.push({
          ...kn(a.url),
          tabType: f.type,
          htmlLength: b.length,
          markdownLength: k.length,
          markdownParserType: v,
          tabReadyTime: p,
          idleTime: m,
          fetchTime: w,
          parseTime: T,
          parseMdTime: M,
          parsePdpTime: C,
          isSplitView: !!g?.splitId,
          wasTimeout: !1
        }), I;
      } finally {
        l().catch(
          (h) => Le({ error: h, logger: this.scopedLogger })
        ), f.type === "HIDDEN" && chrome.tabs.remove(f.id).catch(
          (h) => Le({ error: h, logger: this.scopedLogger })
        );
      }
    }).map((a) => Promise.race([a, It(Kc)]).catch(
      (u) => Le({ error: u, logger: this.scopedLogger })
    )), o = (a) => !!a;
    return { contents: (await Promise.all(s)).filter(o), _dataToLog: r };
  }
  async GetSidecarContext() {
    const t = performance.now(), n = await Mo(this.sender), r = [n];
    if (n.splitId) {
      const c = await Po(n);
      c && r.push(c);
    }
    const s = performance.now() - t, [o, i] = await Promise.all(
      r.map((c) => Promise.race([
        this.GetSidecarPageContent({
          url: c?.pendingUrl ?? c.url ?? "",
          id: c?.id
        }),
        It(Wx, void 0)
      ]))
    );
    return {
      _dataToLog: {
        contents: [o?.metadata, i?.metadata].filter((c) => !!c),
        timeToGetTabs: s
      },
      content: o?.content,
      contents: [o?.content, i?.content].filter((c) => !!c)
    };
  }
  async SearchBrowser(t) {
    if (!await $e.isSearchEnabled())
      throw new ts("Personal search is disabled.");
    const r = performance.now(), s = !qh.has(t.key), o = t.sources?.length ? t.sources : [
      ir.RECENTLY_CLOSED_TABS,
      ir.HISTORY,
      ir.OPEN_TABS
    ], i = {
      open_tabs_results: [],
      history_results: [],
      closed_tabs_results: [],
      _dataToLog: {}
    }, a = {
      open_tabs_results_ms: 0,
      history_results_ms: 0,
      closed_tabs_results_ms: 0
    }, c = [...new Set(o)].map(
      async (d) => {
        const p = performance.now();
        try {
          if (d === ir.HISTORY) {
            i.history_results = await CR(t), a.history_results_ms = performance.now() - p, s && lr("search_browser.history", {
              request_id: t.request_id,
              duration: a.history_results_ms ?? 0,
              results: i.history_results.length
            });
            return;
          }
          if (d === ir.OPEN_TABS) {
            i.open_tabs_results = await AR(
              t,
              this.sender
            ), a.open_tabs_results_ms = performance.now() - p, s && lr("search_browser.open_tabs", {
              request_id: t.request_id,
              duration: a.open_tabs_results_ms ?? 0,
              results: i.open_tabs_results.length
            });
            return;
          }
          if (d === ir.RECENTLY_CLOSED_TABS) {
            i.closed_tabs_results = await RR(t), a.closed_tabs_results_ms = performance.now() - p, s && lr("search_browser.recently_closed_tabs", {
              request_id: t.request_id,
              duration: a.closed_tabs_results_ms ?? 0,
              results: i.closed_tabs_results.length
            });
            return;
          }
        } catch (h) {
          const m = h;
          throw lr("search_browser.source_fail", {
            request_id: t.request_id,
            source: d,
            duration: performance.now() - p,
            error: m.message
          }), Le({
            error: `[ToolService.SearchBrowser][${d}] Error: ${m.message}`,
            logger: this.scopedLogger,
            context: {
              request_id: t.request_id,
              key: t.key,
              source: d,
              time: performance.now() - p,
              error: {
                message: m.message,
                stack: m.stack,
                name: m.name
              }
            }
          }), h;
        }
      }
    ), u = await Promise.race([
      Promise.allSettled(c),
      It(pd, "timeout")
    ]), f = Array.isArray(u) && u.every((d) => d.status === "rejected"), l = u === "timeout" && Object.values(a).every((d) => d === 0);
    if (f)
      throw lr("search_browser.all_sources_failed", {
        request_id: t.request_id,
        duration: performance.now() - r
      }), Error("All sources failed to search");
    if (l)
      throw this.scopedLogger.error(
        "[ToolService.SearchBrowser] Search browser timed out",
        { request_id: t.request_id, key: t.key, ...a }
      ), new er(`Timed out after ${pd}ms`);
    return i._dataToLog = {
      open_tabs_results: i.open_tabs_results.length,
      closed_tabs_results: i.closed_tabs_results.length,
      history_results: i.history_results.length,
      ...a
    }, i;
  }
  async GetVisibleTabScreenshot(t) {
    const n = await Mo(this.sender), r = n.pendingUrl ?? n.url ?? "";
    if (await $e.isUrlBlocked(r))
      throw this.scopedLogger.info(
        `[ToolService.GetVisibleTabScreenshot] Blocked by user: ${r}`
      ), new ts(
        "Screenshot of this page is blocked by the user's settings or their organization's settings."
      );
    return {
      data_url: await chrome.tabs.captureVisibleTab(
        this.sender.tab?.windowId ?? chrome.windows.WINDOW_ID_CURRENT,
        {
          format: t.format ?? "png",
          quality: t.quality ?? 100
        }
      ),
      _dataToLog: {
        format: t.format ?? "png",
        quality: t.quality ?? 100
      }
    };
  }
  async OpenTab(t) {
    const n = this.getWindowId(), r = t.tab_id ? await Ve(t.tab_id) : void 0, s = r?.id, o = Xh(t.url), i = (l, d) => {
      const p = (h) => h.replace(/\/+$/, "");
      return p(l) === p(d);
    }, a = s;
    let c = r;
    a || (c = (await Ls(
      {
        windowId: n
      },
      {
        hidden: !1
      }
    )).find((d) => i(d.url ?? "", o)));
    const u = c?.id;
    if (u) {
      const d = {
        active: !0,
        ...!i(c?.url ?? "", o) ? { url: o } : {}
      }, p = {
        ...t.navigation_history !== void 0 && {
          navigation_history: t.navigation_history
        }
      }, h = await Vt(u, d, p);
      return { tab: Fo(h) };
    }
    const f = await chrome.tabs.create({
      url: o,
      active: !0,
      windowId: n
    });
    return { tab: Fo(f) };
  }
  async CloseTabs(t) {
    const n = this.getWindowId(), r = await Zi(n);
    return { tabs: (await Promise.all(
      t.tab_ids.map(async (o) => {
        const i = r.get(o);
        if (!i)
          return this.scopedLogger.info("[ToolService.CloseTabs] Tab not found", {
            tabId: o
          }), null;
        if (i.is_current_tab)
          return {
            ...i,
            error: "Cannot close current tab"
          };
        try {
          await chrome.tabs.remove(o);
        } catch (a) {
          return this.scopedLogger.warn(
            "[ToolService.CloseTabs] Failed to remove tab",
            {
              tabId: o,
              error: a instanceof Error ? a.message : String(a)
            }
          ), null;
        }
        return i;
      })
    )).filter((o) => o !== null) };
  }
  async GroupTabs(t) {
    const n = this.getWindowId(), r = await Zi(n), s = t.tab_ids.filter((c) => r.has(c)), o = t.group_id ? { groupId: t.group_id } : { createProperties: { windowId: n } }, i = await chrome.tabs.group({
      ...o,
      tabIds: s
    });
    return {
      tab_group: {
        ...await chrome.tabGroups.update(i, {
          collapsed: t.collapsed,
          color: t.color,
          title: t.title
        }),
        tabs: s.map((c) => r.get(c)).filter((c) => c !== void 0)
      }
    };
  }
  async UngroupTabs(t) {
    const n = this.getWindowId(), r = await Zi(n), s = [];
    return await Promise.allSettled(
      [...r.values()].map(async (o) => {
        const i = t.tab_ids.includes(o.tab_id), a = t.group_ids.includes(o.group_id);
        !i && !a || (await chrome.tabs.ungroup(o.tab_id), s.push(o));
      })
    ), {
      ungrouped_tabs: s
    };
  }
  async SearchTabGroups(t) {
    if (!await $e.isSearchEnabled())
      throw new ts("Personal search is disabled.");
    const r = t.queries.map((a) => a.toLowerCase()), s = await chrome.tabGroups.query({}), o = r.length ? s.filter((a) => {
      const c = (a.title ?? "").toLowerCase();
      return r.some((u) => c.includes(u));
    }) : s, i = [];
    for (const a of o) {
      const c = await chrome.tabs.query({ groupId: a.id });
      i.push({
        id: a.id,
        title: a.title,
        color: a.color,
        collapsed: a.collapsed,
        tabs: (await Promise.all(c.map((u) => zc(u, [])))).filter((u) => u !== void 0)
      });
    }
    return { tab_groups: i };
  }
  async GetSidecarPageContent(t) {
    let n = performance.now();
    const r = {
      ...kn(t.url),
      tabReadyTime: 0,
      fetchTime: 0,
      parseTime: 0,
      debuggerTime: 0,
      parseMdTime: 0,
      parsePdpTime: 0,
      markdownParserType: "",
      isSplitView: !1,
      htmlLength: 0,
      htmlNodes: 0,
      markdownLength: 0,
      mode: "regular",
      lowQualityHtml: !1
    };
    if (await $e.isUrlBlocked(t.url))
      return this.scopedLogger.info(
        `[ToolService.GetSidecarPageContent] Blocked by system preferences: ${t.url}`
      ), {
        metadata: { ...r, blockedByUser: !0 },
        content: {
          html: "",
          markdown: "Content blocked by the user's settings or their organization's settings.",
          og_meta: {},
          id: t.id,
          title: "",
          url: t.url
        }
      };
    let o = Kh(
      t.url,
      this.scopedLogger
    );
    const i = Yh(o);
    if (i !== o) {
      const g = kn(i);
      this.scopedLogger.info(
        "[GetSidecarPageContent] Detected PDF extension URL, overriding",
        {
          newUrl: g,
          oldUrl: kn(o)
        }
      ), o = i;
      const { contents: _ } = await this.GetContent({
        pages: [{ url: o }],
        key: "get-sidecar-context"
      }), y = _[0];
      if (!y)
        throw new Error("Failed to scrape content from PDF extension URL");
      return {
        metadata: {
          ...r,
          ...g,
          mode: "overridden-pdf-extension-scrape",
          markdownLength: y.markdown.length,
          parseMdTime: performance.now() - n,
          markdownParserType: "get-content-markdown"
        },
        content: {
          html: y.html ?? "",
          markdown: y.markdown ?? "",
          title: y.title ?? "",
          id: t.id,
          url: xn(o),
          og_meta: y.og_meta ?? {}
        }
      };
    }
    const c = new URL(o), u = t.id, f = await kt(u);
    if ($e.isInternalPage(o))
      return this.scopedLogger.warn(
        "[GetSidecarPageContent] Trying to fetch internal page",
        kn(t.url)
      ), {
        metadata: r,
        content: {
          html: "",
          markdown: "Content of internal pages is not available.",
          og_meta: {},
          id: f.id,
          title: f.title ?? "",
          url: xn(f?.url ?? "")
        }
      };
    let d = !1, p = {};
    try {
      const g = await Pe(
        {
          target: { tabId: u },
          func: Rx
        },
        "getMetadata",
        1e3
      );
      d = g[0]?.result?.isPDF ?? !1, p = g[0]?.result?.meta ?? {};
    } catch (g) {
      this.scopedLogger.warn(
        "[GetSidecarPageContent] Error while getting metadata",
        {
          error: g
        }
      );
    }
    const h = `${f.title}`;
    if (r.tabReadyTime = performance.now() - n, r.isSplitView = !!f?.splitId, n = performance.now(), Gc(c) || Gh(c) || o.endsWith(".pdf") || d) {
      r.mode = "markdown_only";
      const g = "<empty>", { markdown: _, type: y } = await ls({
        tab: f,
        html: g,
        isPdf: d,
        logger: this.scopedLogger,
        overrideUrl: o
      });
      return r.parseMdTime = performance.now() - n, r.markdownParserType = y, r.markdownLength = _.length, {
        metadata: r,
        content: {
          html: g,
          markdown: _,
          title: h,
          id: u,
          url: xn(f.url ?? ""),
          og_meta: p
        }
      };
    }
    n = performance.now();
    const m = await Hn(u);
    try {
      r.debuggerTime = performance.now() - n, n = performance.now();
      const g = c.toString(), _ = ["https://www.youtube.com/watch"].some(
        (C) => g.startsWith(C)
      );
      _ && (r.mode = "optimized_html", r.lowQualityHtml = !0);
      const y = {
        tabId: u,
        isVisibleAgent: !1,
        scopedLogger: this.scopedLogger,
        mainTabId: this.sender.tab?.id ?? -1
      }, b = _ ? eR : Bh, E = this.extractProductDataSafely({
        tabId: u,
        url: g
      }), { html: S, fetchTime: w, parseTime: T, snapshot: N } = await b(
        y,
        {
          excludeDomMeta: !0
          // we have meta from injection
        }
      );
      r.fetchTime = w, r.parseTime = T, r.htmlNodes = N?.length ?? 0, r.htmlLength = S.length, n = performance.now();
      const { markdown: k, type: v } = await ls({
        tab: f,
        html: S,
        isPdf: d,
        logger: this.scopedLogger,
        overrideUrl: o
      });
      r.parseMdTime = performance.now() - n, r.markdownParserType = v, r.markdownLength = k.length;
      const { result: M, parseTime: P } = await E;
      return r.parsePdpTime = P, {
        content: {
          title: h,
          html: "",
          markdown: k,
          og_meta: p,
          id: u,
          url: xn(f.url ?? ""),
          pdp_data: M
        },
        metadata: r
      };
    } finally {
      m().catch(
        (g) => Le({ error: g, logger: this.scopedLogger })
      );
    }
  }
  async extractProductDataSafely({
    tabId: t,
    url: n
  }) {
    const r = Hx, s = performance.now(), o = new Error("Timeout while extracting product data");
    try {
      return await Promise.race([
        It(r).then(() => {
          throw o;
        }),
        Vx({ tabId: t, url: n }).then((i) => ({
          result: i,
          parseTime: performance.now() - s
        }))
      ]);
    } catch (i) {
      return i === o ? this.scopedLogger.warn(
        "[GetSidecarPageContent] Timeout while extracting product data",
        { url: n, timeout: r }
      ) : this.scopedLogger.error(
        "[GetSidecarPageContent] Failed to extract product data",
        { url: n },
        i
      ), {
        result: void 0,
        parseTime: performance.now() - s
      };
    }
  }
}
const zx = async ({ id: e, url: t }, n, r) => {
  let s = Kh(t, n);
  const o = Yh(s), i = o !== s;
  if (s = o, e && !i)
    try {
      if ((await Ve(e))?.status !== "unloaded" && s === t)
        return { type: "OPEN", id: e, url: s };
    } catch (c) {
      n.warn(`[ToolService.getTab] Error getting tab ${e}: ${c}`);
    }
  return { type: "HIDDEN", id: (await Lh(
    "tool-call",
    n,
    r.tab?.windowId ?? chrome.windows.WINDOW_ID_CURRENT,
    !0
  )).id, url: s };
}, Kx = async (e, { id: t, url: n }) => {
  const r = wr({
    tabContext: e,
    config: {
      action: "GET_CONTENT",
      waitForFCP: !0,
      useExperimentalEvents: !0,
      maxWaitingTimeoutMs: Kc - 1e3
    }
  });
  await chrome.tabs.update(t, { url: n }), await r.wait();
};
class ts extends Error {
  constructor(t) {
    super(t), this.name = "BlockedByUserError";
  }
}
class om extends Error {
  constructor(t) {
    super(t), this.name = "SchemaError";
  }
}
const Ja = "CALL_TOOL", jx = async (e, t) => {
  const n = performance.now(), r = nt({
    request_id: e.request.request_id,
    step_uuid: e.request.key
  }), s = new Gx(r, t), { method: o, request: i } = e;
  try {
    if (!o || !s[o] || !i)
      throw new om("Schema error.");
    const a = await s[o](i);
    return qh.has(i.key) || (r.info(`${Ja}(${o}): response`, {
      _payload: a?._dataToLog ?? a,
      request: {
        request_id: i.request_id,
        key: i.key
      },
      duration: performance.now() - n
    }), delete a?._dataToLog), { success: !0, response: a };
  } catch (a) {
    return r.error(
      `${Ja}(${o}): error`,
      {
        request: {
          request_id: i.request_id,
          key: i.key
        },
        duration: performance.now() - n
      },
      a
    ), { success: !1, response: qx(a) };
  }
}, qx = (e) => e instanceof er ? { errorType: "timeout", errorMsg: "Action timeout" } : e instanceof ts ? {
  errorType: "blocked-by-user",
  errorMsg: "Search is blocked by user"
} : e instanceof om ? {
  errorType: "schema-error",
  errorMsg: "Something wrong while parse a message"
} : { errorType: "unhandled", errorMsg: "Unhandled error" };
let im = performance.now();
const Xx = async (e, t, n) => {
  if (im = performance.now(), e.type === Ja)
    return n(await jx(e, t));
  if (e.type === "CLEANUP_AGENT_TASKS") {
    const r = e.payload.entryId, s = e.payload.reason ?? "undefined";
    return At.forEach((o) => {
      o.entryId === r && o.stopTask(`EXTERNAL_AGENT_STOP_${s}`);
    }), n({
      success: !0
    });
  }
  if (e.type === "START_AGENT") {
    const r = e;
    let s, o = !1;
    try {
      const c = JSON.parse(r.extra_headers);
      s = c.source, o = c.enable_reconnect;
    } catch {
    }
    const i = t?.tab?.id ?? -1, a = t?.tab?.windowId ?? chrome.windows.WINDOW_ID_CURRENT;
    return Zh(
      {
        query: r.task,
        taskId: r.uuid,
        ...r,
        extra_headers: JSON.parse(r.extra_headers),
        mainPort: Ne.get(t?.tab?.id ?? -1),
        senderTabId: i,
        senderWindowId: a,
        source: s,
        enable_reconnect: o
      },
      {
        windowId: t.tab?.windowId ?? chrome.windows.WINDOW_ID_CURRENT
      }
    ), n({ success: !0 });
  }
  if (e.type === "RUN_IDLE_TEST") {
    const r = e.message, s = await px(r.url);
    return n({
      response: s
    });
  }
  if (e.type === "COMET_OPEN_SIDECAR")
    return await chrome.perplexity.sidecar.open(), n({ success: !0 });
  if (e.type === "COMET_CLOSE_SIDECAR")
    return await chrome.perplexity.sidecar.close(), n({ success: !0 });
  if (e.type === "CAPTURE_SCREENSHOT_V2") {
    let r = e.payload.tabId;
    const s = t.tab?.id;
    if (!s)
      return n({ error: "Sidecar tab not found" });
    if (e.payload.tabId === void 0) {
      const i = (await Mo(t))?.id;
      if (!i)
        return n({ error: "Tab not found" });
      r = i;
    }
    return nt({ tabId: r }).info("Capturing screenshot", r), await ux(r, s), n({ success: !0 });
  }
  if (e.type == "DEACTIVATE_SCREENSHOT_TOOL") {
    let r = e.payload.tabId;
    if (e.payload.tabId === void 0) {
      const o = (await Mo(t))?.id;
      if (!o)
        return n({ error: "Tab not found" });
      r = o;
    }
    return nt({ tabId: r }).info("Canceling screenshot", r), await lx(r), n({ success: !0 });
  }
  if (e.type === "MOVE_THREAD_TO_SIDECAR") {
    const r = t.tab?.id, {
      active_task_uuid: s,
      is_mission_control: o,
      is_subagent: i,
      entry_id: a,
      thread_url_slug: c,
      reason: u,
      animate: f,
      take_focus: l,
      auto_opened: d = !0
      // TODO: Refactor in favor of match and general typecast by message type
    } = e.payload;
    G.info("[MOVE_THREAD_TO_SIDECAR] Request received", {
      tabId: r,
      activeTaskUuid: s,
      entryId: a,
      threadUrlSlug: c,
      reason: u,
      windowId: t.tab?.windowId,
      isSubagent: i
    });
    const p = (await chrome.windows.get(t.tab?.windowId ?? -1)).sidecarTabId, h = t.tab;
    if (!h)
      return G.warn(
        "[MOVE_THREAD_TO_SIDECAR] Sender tab not found, cannot move thread",
        { tabId: r, activeTaskUuid: s, reason: u }
      ), n({
        success: !1,
        error: "No sender tab found"
      });
    const {
      index: m,
      splitId: g,
      tabType: _ = "normal"
    } = h, y = Ne.get(p);
    if (!y)
      return G.warn(
        "[MOVE_THREAD_TO_SIDECAR] Sidecar port not found, cannot move thread",
        { tabId: r, activeTaskUuid: s, reason: u }
      ), n({
        success: !1,
        error: "No sidecar port found"
      });
    const b = await ud(s);
    if (s && b.length === 0)
      return G.warn(
        "[MOVE_THREAD_TO_SIDECAR] No task tabs found, cannot move thread",
        { tabId: r, activeTaskUuid: s, reason: u }
      ), n({
        success: !1,
        error: "No task tabs found"
      });
    const E = b.map((w) => w.id);
    await Promise.all(
      E.map((w) => dr(w, { opened: "opened" }))
    );
    let S = t.tab?.url;
    o && (S = new URL(
      `/search/${c}`,
      t.tab?.url || "https://www.perplexity.ai"
    ).toString());
    try {
      if (!o && (await chrome.perplexity.sidecar.open({
        windowId: t.tab?.windowId,
        animate: f,
        takeFocus: l
      }), r && _ === "normal")) {
        const w = await Ve(r), T = w ? await Po(w) : void 0;
        await dr(r, { opened: "opened", autoOpened: d }), T?.id && await dr(T.id, {
          opened: "opened",
          autoOpened: d
        });
      }
      y?.postMessage({
        type: "MOVE_THREAD_TO_SIDECAR",
        payload: {
          url: S,
          task_tab_ids: E,
          sidecar_url: e.payload.sidecar_url,
          auto_opened: d,
          thread_id: r?.toString(),
          thread_url_slug: c
        }
      });
    } catch (w) {
      return G.error(
        "[MOVE_THREAD_TO_SIDECAR] Failed to open sidecar",
        w,
        { tabId: r, activeTaskUuid: s, reason: u }
      ), n({
        success: !1,
        error: "Failed to open sidecar"
      });
    }
    return await Promise.all(
      b.map(async (w) => {
        const T = t.tab?.windowId;
        o || i ? await Vt(
          w.id,
          {
            active: !0,
            muted: !1
          },
          {
            hidden: !1
          }
        ) : (g || await Vt(
          r,
          {
            active: !1
          },
          {
            hidden: !0
          }
        ), chrome.tabs.move(w.id, {
          index: m,
          windowId: T
        }).then(() => {
          g && chrome.tabs.update(r, {
            hidden: !0,
            active: !1
          });
        }));
      })
    ), s && At.get(s)?.makeVisible(), G.info("[MOVE_THREAD_TO_SIDECAR] Request processed", {
      tabId: r,
      activeTaskUuid: s,
      reason: u
    }), n({
      success: !0
    });
  }
  if (e.type === "MOVE_SIDECAR_TO_THREAD") {
    const r = t.tab?.id, { tab_id: s } = e.payload, o = nt({ tabId: r });
    o.info("[MOVE_SIDECAR_TO_THREAD] Request received", {
      targetTabId: s
    });
    try {
      const i = t.tab?.url ?? "", c = new URL(i).pathname.replace(/^\/sidecar/, ""), u = new URL(i);
      u.pathname = c;
      const f = await Ve(s);
      if (f) {
        await dr(s, {
          opened: "closed",
          autoOpened: !1
        });
        const l = await Po(f);
        l?.id && await dr(l.id, {
          opened: "closed",
          autoOpened: !1
        });
      }
      await Vt(
        s,
        {
          url: u.toString(),
          active: !0,
          muted: !1
        },
        { hidden: !1, navigation_history: !0 }
      );
      try {
        await chrome.perplexity.sidecar.close();
      } catch (l) {
        o.warn(
          "[MOVE_SIDECAR_TO_THREAD] Failed to close sidecar",
          l
        );
      }
      return o.info("[MOVE_SIDECAR_TO_THREAD] Request processed", {
        targetTabId: s
      }), n({ success: !0 });
    } catch (i) {
      return o.error("[MOVE_SIDECAR_TO_THREAD] Failed", i, {
        targetTabId: s
      }), n({
        success: !1,
        error: "Failed to move sidecar to thread"
      });
    }
  }
  if (e.type === "GET_SIDECAR_AUTO_OPENED") {
    const r = nt({ tabId: t.tab?.id });
    let s = !1, o;
    if (t.tab?.windowId) {
      const i = await chrome.tabs.query({
        windowId: t.tab.windowId
      });
      for (const a of i)
        if (!(!a.id || !a.payload))
          try {
            const c = JSON.parse(a.payload);
            if (c.auto_opened !== void 0) {
              o = a.id, s = c.auto_opened ?? !1;
              break;
            }
          } catch {
          }
    }
    return r.info(
      "[GET_SIDECAR_AUTO_OPENED] Read from source tab payload",
      {
        sidecarTabId: t.tab?.id,
        sourceTabId: o,
        autoOpened: s
      }
    ), n({
      success: !0,
      auto_opened: s
    });
  }
  if (e.type === "GET_TASK_TABS") {
    try {
      const r = await ud(), o = (await hx(r)).map((i) => {
        try {
          const a = i.payload ? JSON.parse(i.payload) : {};
          return i.id && i.url && i.lastAccessed && a.task_uuid ? {
            tabId: i.id,
            taskUuid: a.task_uuid,
            url: i.url,
            timestamp: i.lastAccessed
          } : null;
        } catch (a) {
          return G.debug("Failed to parse task tab payload", {
            tabId: i.id,
            error: a instanceof Error ? a.message : String(a)
          }), null;
        }
      }).filter((i) => i !== null);
      G.debug("Sending task tabs to frontend", {
        tabId: t.tab?.id,
        count: o.length
      }), t.tab?.id && Ne.get(t.tab?.id)?.postMessage({
        type: "GET_TASK_TABS",
        payload: {
          tabs: o
        }
      });
    } catch (r) {
      return G.debug("Failed to send task tabs", {
        tabId: t.tab?.id,
        error: r instanceof Error ? r.message : String(r)
      }), n({
        success: !1,
        error: "Failed to send task tabs"
      });
    }
    return n({
      success: !0
    });
  }
  if (e.type === "MISSION_CONTROL_STATUS") {
    try {
      const r = e.payload;
      G.debug("[MISSION_CONTROL_STATUS] Processing request", {
        castedPayload: r
      }), await chrome.storage.local.set({
        [_n]: {
          numThreadsActive: r.num_threads_active,
          numThreadsBlocked: r.num_threads_blocked,
          numThreadsForReview: r.num_threads_for_review
        }
      }), t.tab?.windowId && Ba(t.tab?.windowId);
    } catch (r) {
      return G.debug("Failed to update mission control status", {
        error: r instanceof Error ? r.message : String(r)
      }), n({
        success: !1,
        error: "Failed to update mission control status"
      });
    }
    return n({
      success: !0
    });
  }
  if (e.type === "GET_MCP_TOOLS")
    return n(await _x(e));
  if (e.type === "CALL_MCP_TOOL")
    return n(await bx(e));
  if (e.type === "GET_STDIO_MCP_SERVERS")
    return n(await wx(e));
  if (e.type === "ADD_STDIO_MCP_SERVER")
    return n(await Ex(e));
  if (e.type === "UPDATE_STDIO_MCP_SERVER")
    return n(await Sx(e));
  if (e.type === "REMOVE_STDIO_MCP_SERVER")
    return n(await Tx(e));
  if (e.type === "INSTALL_DXT")
    return n(await vx(e));
  if (e.type === "UNINSTALL_DXT")
    return n(await Ix(e));
  if (e.type === "GET_INSTALLED_DXT")
    return n(await kx(e));
  if (e.type === "HAS_PERMISSION")
    return n(await Cx(e));
  if (e.type === "REQUEST_PERMISSION")
    return n(await Ax(e));
  if (e.type === "INSERT_INLINE_TEXT") {
    if (!t.tab?.id)
      return n({
        success: !1,
        error: "No sender tab found"
      });
    const { text: s } = e.payload, o = (await chrome.tabs.query({ active: !0, windowId: t.tab?.windowId }))[0]?.id;
    if (!o)
      return n({ success: !0, error: "No active tab id" });
    const i = await Hn(o);
    try {
      const c = await Mh({ tabId: o }, s);
      return n({ success: c });
    } catch (a) {
      return G.error("[INSERT_INLINE_TEXT] Failed to insert text", a), n({ success: !1, error: a });
    } finally {
      await i();
    }
  }
  return Le({
    error: new Error(`Unknown request type: ${e.type}`),
    logger: G
  }), n({
    success: !1,
    response: {
      errorType: "unhandled",
      errorMessage: `Unknown request type: ${e.type}`
    }
  });
}, Yx = "0.0.169", Jx = "pub4ecf63e3fd1ad28de1a9027c01181601", Zx = 100;
function Qx() {
  P0({
    clientToken: Jx,
    version: Yx,
    env: "production",
    debug: !1,
    sessionSampleRate: Zx,
    service: "agent-extension"
  });
}
const eO = 5 * 1024 * 1024, ta = "screenshot_";
class tO {
  /**
   * Get storage key for a specific task
   */
  getStorageKey(t) {
    return `${ta}${t}`;
  }
  /**
   * Store a screenshot for a task (appends to existing array)
   */
  async storeScreenshot({
    taskUuid: t,
    screenshot: n,
    targetWidth: r
  }) {
    try {
      const s = await on.resizeImage(
        n,
        r
      );
      if (!s) {
        G.warn(
          "[screenshot_storage] Failed to resize screenshot: received null/undefined result from offscreen service",
          {
            taskUuid: t
          }
        );
        return;
      }
      let o = s;
      o.startsWith("data:image/png;base64,") && (o = o.substring(
        22
      ));
      const a = (await this.getScreenshot(t))?.screenshots || [];
      a.push(o);
      const c = this.getStorageKey(t), u = {
        taskUuid: t,
        screenshots: a,
        timestamp: Date.now()
      };
      await this.evictOldScreenshots(), await chrome.storage.local.set({ [c]: u });
    } catch (s) {
      throw G.error("[screenshot_storage] Failed to store screenshot", {
        taskUuid: t,
        error: s instanceof Error ? s.message : String(s)
      }), s;
    }
  }
  async evictOldScreenshots() {
    const t = await chrome.storage.local.get(null), n = [];
    for (const [o, i] of Object.entries(t))
      o.startsWith(ta) && i && n.push([o, i]);
    let r = await chrome.storage.local.getBytesInUse(
      n.map(([o]) => o)
    ), s = 0;
    for (; r > eO && n.length > 0 && s < 3; ) {
      n.sort((i, a) => i[1].timestamp - a[1].timestamp);
      const o = n[0]?.[0];
      await chrome.storage.local.remove([o]), n.shift(), r = await chrome.storage.local.getBytesInUse(
        n.map(([i]) => i)
      ), s++;
    }
  }
  /**
   * Get all stored screenshots
   */
  async getAllScreenshots() {
    try {
      const t = await chrome.storage.local.get(null), n = [];
      for (const [r, s] of Object.entries(t))
        if (r.startsWith(ta) && s) {
          if (s.screenshot) {
            n.push({
              taskUuid: s.taskUuid,
              screenshots: [s.screenshot],
              timestamp: s.timestamp
            });
            continue;
          }
          n.push(s);
        }
      return n;
    } catch (t) {
      return G.error("[screenshot_storage] Failed to get all screenshots", {
        error: t instanceof Error ? t.message : String(t)
      }), [];
    }
  }
  async getScreenshot(t) {
    const n = this.getStorageKey(t), s = (await chrome.storage.local.get(n))[n];
    if (s)
      return s.screenshot ? {
        taskUuid: s.taskUuid,
        screenshots: [s.screenshot],
        timestamp: s.timestamp
      } : s;
  }
}
const nO = new tO();
Vb();
Qx();
chrome.runtime.onMessageExternal.addListener(
  // Called from Perplexity Ask page
  To(Xx)
);
chrome.runtime.onMessage.addListener((e, t, n) => {
  if ([
    "CAPTURE_FULL_SCREENSHOT",
    "CAPTURE_VISIBLE_TAB",
    "CAPTURE_PARTIAL_SCREENSHOT",
    "BROWSER_TASK_STOP",
    "USER_SELECTION_CAPTURED",
    "OVERLAY_TASK_STOP",
    "BUTTON_RECT_CHANGE"
  ].includes(e.type) && !YR(e))
    return fx(e, t, n).catch((r) => {
      Le({ error: r, logger: G }), n({
        error: r instanceof Error ? r.message : "Unknown error"
      });
    }), !0;
});
async function rO(e) {
  if (!e.sender || !e.sender.url || !e.sender.tab?.id || e.name !== Tm)
    return !1;
  const t = e.sender.tab?.id;
  return Ne.set(t, e), e.onDisconnect.addListener(() => {
    Ne.delete(t);
  }), !0;
}
chrome.runtime.onConnectExternal.addListener(
  To(async (e) => {
    if (await rO(e))
      try {
        const t = await nO.getAllScreenshots();
        t.length > 0 && (G.debug("Sending cached screenshots to frontend", {
          tabId: e.sender.tab?.id,
          count: t.length
        }), t.forEach(
          (n) => n.screenshots?.forEach((r) => {
            e.postMessage({
              type: "BROWSER_TASK_PROGRESS_SCREENSHOT",
              payload: {
                taskUuid: n.taskUuid,
                screenshot: r
              }
            });
          })
        ));
      } catch (t) {
        G.debug("Failed to send cached screenshots", {
          tabId: e.sender.tab?.id,
          error: t instanceof Error ? t.message : String(t)
        });
      }
  })
);
if (Me) {
  if (chrome.runtime.onInstalled.addListener(async (t) => {
    G.info("[Update] Extension installed/updated", t);
    const n = t.reason === "update";
    if (t.reason, !n) return;
    OA(), (await chrome.tabs.query({})).filter(
      (s) => (
        // If tab's discarded, we can't inject
        !s.discarded && // Only inject in web pages and not internal pages or file:// or random urls
        (s.url?.startsWith("http://") || s.url?.startsWith("https://"))
      )
    ).forEach((s) => {
      const o = s.url, i = o.match(/https:\/\/(.*\.)?perplexity\.ai\/sidecar.*/) || o.match(/http:\/\/localhost:.*\/sidecar.*/), a = o.startsWith(
        "https://docs.google.com/document"
      ), c = (u) => {
        u instanceof Error && u.message.includes("Cannot access contents of the page") || G.warn("[content-script] Re-injection failed", u, {
          tabId: s.id,
          url: s.url
        });
      };
      i || (Pe(
        {
          target: { tabId: s.id },
          files: ["content.js"],
          injectImmediately: !0
        },
        "injectContentScript"
      ).catch(c), chrome.scripting.insertCSS({
        target: { tabId: s.id },
        files: ["content.css"]
      }).catch(c), Pe(
        {
          target: { tabId: s.id, allFrames: !0 },
          files: ["events.js"],
          injectImmediately: !0
        },
        "injectEventsScript"
      ).catch(c)), a && Pe(
        {
          target: { tabId: s.id, allFrames: !0 },
          files: ["google_docs_cs.js"],
          injectImmediately: !0
        },
        "injectGoogleDocsScript"
      ).catch(c);
    });
  }), fc)
    try {
      chrome.perplexity.system.onPing.addListener(() => {
        chrome.perplexity.system.pong().catch(() => {
          G.warn("[comet] Failed to send pong response");
        });
      });
    } catch (t) {
      G.error(
        "[comet] Failed to register system ping listener",
        t
      );
    }
  Wb && chrome.perplexity.mcp.onStdioServerChanged.addListener(
    (t, n, r) => {
      const s = {
        type: "MCP_STDIO_SERVER_CHANGED",
        payload: { serverName: t, changes: n, server: r }
      };
      Ne.forEach((o) => o.postMessage(s));
    }
  ), Hb && chrome.perplexity.mcp.onPersistedStdioServersLoaded.addListener(() => {
    const t = {
      type: "MCP_PERSISTED_STDIO_SERVERS_LOADED",
      payload: void 0
    };
    Ne.forEach((n) => n.postMessage(t));
  }), Gb && chrome.perplexity.mcp.onStdioServerAdded.addListener((t) => {
    const n = {
      type: "MCP_STDIO_SERVER_ADDED",
      payload: { server: t }
    };
    Ne.forEach((r) => r.postMessage(n));
  }), zb && chrome.perplexity.mcp.onStdioServerRemoved.addListener((t) => {
    const n = {
      type: "MCP_STDIO_SERVER_REMOVED",
      payload: { serverName: t }
    };
    Ne.forEach((r) => r.postMessage(n));
  }), chrome.runtime.onSuspend.addListener(() => {
    G.info("[Update] Extension suspend");
  }), chrome.runtime.onSuspendCanceled.addListener(() => {
    G.info("[Update] Extension suspend canceled");
  });
  let e = !1;
  chrome.runtime.onUpdateAvailable.addListener((t) => {
    G.info("[Update] Extension update available", t), e = !0, At.size === 0 && chrome.runtime.reload();
  }), setInterval(() => {
    if (e && At.size === 0) {
      chrome.runtime.reload();
      return;
    }
    const t = performance.now() - im, n = 1800 * 1e3;
    if (t >= n && At.size === 0) {
      setTimeout(() => {
        chrome.runtime.reload();
      }, 1e3);
      return;
    }
    chrome.runtime.getPlatformInfo().catch((r) => G.error("Failed to ping platform info", r));
  }, 25e3), chrome.tabs.onActivated.addListener(async (t) => {
    try {
      Ba(t.windowId);
    } catch (n) {
      G.error(
        "[Mission Control] Failed to update badge on tab switch",
        n
      );
    }
  }), chrome.tabs.onRemoved.addListener(async (t, n) => {
    JR(t);
    try {
      Ba(n.windowId);
    } catch (r) {
      G.error(
        "[Mission Control] Failed to update badge on tab close",
        r
      );
    }
  });
}
const jc = /* @__PURE__ */ new WeakMap();
function Rt(e) {
  return jc.has(e);
}
function sO(e) {
  let t = e;
  for (; t; ) {
    if (!Rt(t) && !Pc(t))
      return !1;
    t = di(t);
  }
  return !0;
}
function Ke(e) {
  return jc.get(e);
}
function oO(e, t) {
  jc.set(e, t);
}
function qc(e, t) {
  const n = e.tagName, r = e.value;
  if (Os(e, t)) {
    const s = e.type;
    return n === "INPUT" && (s === "button" || s === "submit" || s === "reset") ? r : !r || n === "OPTION" ? void 0 : rn;
  }
  if (n === "OPTION" || n === "SELECT")
    return e.value;
  if (!(n !== "INPUT" && n !== "TEXTAREA"))
    return r;
}
const iO = /url\((?:(')([^']*)'|(")([^"]*)"|([^)]*))\)/gm, aO = /^[A-Za-z]+:|^\/\//, cO = /^["']?data:.*,/i;
function uO(e, t) {
  return e.replace(iO, (n, r, s, o, i, a) => {
    const c = s || i || a;
    if (!t || !c || aO.test(c) || cO.test(c))
      return n;
    const u = r || o || "";
    return `url(${u}${lO(c, t)}${u})`;
  });
}
function lO(e, t) {
  try {
    return ks(e, t).href;
  } catch {
    return e;
  }
}
const dO = /[^a-z1-6-_]/;
function am(e) {
  const t = e.toLowerCase().trim();
  return dO.test(t) ? "div" : t;
}
function hd(e, t) {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${e}' height='${t}' style='background-color:silver'%3E%3C/svg%3E`;
}
const Ct = {
  FullSnapshot: 2,
  IncrementalSnapshot: 3,
  Meta: 4,
  Focus: 6,
  ViewEnd: 7,
  VisualViewport: 8,
  FrustrationRecord: 9
}, Gn = {
  Document: 0,
  DocumentType: 1,
  Element: 2,
  Text: 3,
  CDATA: 4,
  DocumentFragment: 11
}, rt = {
  Mutation: 0,
  MouseMove: 1,
  MouseInteraction: 2,
  Scroll: 3,
  ViewportResize: 4,
  Input: 5,
  TouchMove: 6,
  MediaInteraction: 7,
  StyleSheetRule: 8
  // CanvasMutation : 9,
  // Font : 10,
}, ut = {
  MouseUp: 0,
  MouseDown: 1,
  Click: 2,
  ContextMenu: 3,
  DblClick: 4,
  Focus: 5,
  Blur: 6,
  TouchStart: 7,
  TouchEnd: 9
}, md = {
  Play: 0,
  Pause: 1
};
function cm(e) {
  if (!(e === void 0 || e.length === 0))
    return e.map((t) => {
      const n = t.cssRules || t.rules;
      return {
        cssRules: Array.from(n, (o) => o.cssText),
        disabled: t.disabled || void 0,
        media: t.media.length > 0 ? Array.from(t.media) : void 0
      };
    });
}
const fO = 1e6;
function um(e, t, n, r) {
  if (t === U.HIDDEN)
    return null;
  const s = e.getAttribute(n);
  if (t === U.MASK && n !== Uc && !Hp.includes(n) && n !== r.actionNameAttribute) {
    const o = e.tagName;
    switch (n) {
      // Mask Attribute text content
      case "title":
      case "alt":
      case "placeholder":
        return rn;
    }
    if (o === "IMG" && (n === "src" || n === "srcset")) {
      const i = e;
      if (i.naturalWidth > 0)
        return hd(i.naturalWidth, i.naturalHeight);
      const { width: a, height: c } = e.getBoundingClientRect();
      return a > 0 || c > 0 ? hd(a, c) : ul;
    }
    if (o === "SOURCE" && (n === "src" || n === "srcset"))
      return ul;
    if (o === "A" && n === "href" || s && n.startsWith("data-") || o === "IFRAME" && n === "srcdoc")
      return rn;
  }
  return !s || typeof s != "string" ? s : Up(s, fO);
}
function Xc() {
  return {
    cssText: {
      count: 0,
      max: 0,
      sum: 0
    },
    serializationDuration: {
      count: 0,
      max: 0,
      sum: 0
    }
  };
}
function $o(e, t, n) {
  e[t].count += 1, e[t].max = Math.max(e[t].max, n), e[t].sum += n;
}
function pO(e, t) {
  for (const n of ["cssText", "serializationDuration"])
    e[n].count += t[n].count, e[n].max = Math.max(e[n].max, t[n].max), e[n].sum += t[n].sum;
}
function hO(e, t, n) {
  if (t === U.HIDDEN)
    return {};
  const r = {}, s = am(e.tagName), o = e.ownerDocument;
  for (let f = 0; f < e.attributes.length; f += 1) {
    const d = e.attributes.item(f).name, p = um(e, t, d, n.configuration);
    p !== null && (r[d] = p);
  }
  if (e.value && (s === "textarea" || s === "select" || s === "option" || s === "input")) {
    const f = qc(e, t);
    f !== void 0 && (r.value = f);
  }
  if (s === "option" && t === U.ALLOW) {
    const f = e;
    f.selected && (r.selected = f.selected);
  }
  if (s === "link") {
    const f = Array.from(o.styleSheets).find((d) => d.href === e.href), l = Za(f);
    l && f && ($o(n.serializationContext.serializationStats, "cssText", l.length), r._cssText = l);
  }
  if (s === "style" && e.sheet) {
    const f = Za(e.sheet);
    f && ($o(n.serializationContext.serializationStats, "cssText", f.length), r._cssText = f);
  }
  const i = e;
  if (s === "input" && (i.type === "radio" || i.type === "checkbox") && (t === U.ALLOW ? r.checked = !!i.checked : Os(i, t) && delete r.checked), s === "audio" || s === "video") {
    const f = e;
    r.rr_mediaState = f.paused ? "paused" : "played";
  }
  let a, c;
  const u = n.serializationContext;
  switch (u.status) {
    case 0:
      a = Math.round(e.scrollTop), c = Math.round(e.scrollLeft), (a || c) && u.elementsScrollPositions.set(e, { scrollTop: a, scrollLeft: c });
      break;
    case 1:
      u.elementsScrollPositions.has(e) && ({ scrollTop: a, scrollLeft: c } = u.elementsScrollPositions.get(e));
      break;
  }
  return c && (r.rr_scrollLeft = c), a && (r.rr_scrollTop = a), r;
}
function Za(e) {
  if (!e)
    return null;
  let t;
  try {
    t = e.rules || e.cssRules;
  } catch {
  }
  if (!t)
    return null;
  const n = Array.from(t, lw() ? mO : lm).join("");
  return uO(n, e.href);
}
function mO(e) {
  if (yO(e) && e.selectorText.includes(":")) {
    const t = /(\[[\w-]+[^\\])(:[^\]]+\])/g;
    return e.cssText.replace(t, "$1\\$2");
  }
  return lm(e);
}
function lm(e) {
  return gO(e) && Za(e.styleSheet) || e.cssText;
}
function gO(e) {
  return "styleSheet" in e;
}
function yO(e) {
  return "selectorText" in e;
}
function Yc(e, t) {
  const n = wO(e, t);
  if (!n)
    return null;
  const r = Ke(e) || bO(), s = n;
  return s.id = r, oO(e, r), t.serializedNodeIds && t.serializedNodeIds.add(r), s;
}
let _O = 1;
function bO() {
  return _O++;
}
function Jc(e, t) {
  const n = [];
  return Vp(e, (r) => {
    const s = Yc(r, t);
    s && n.push(s);
  }), n;
}
function wO(e, t) {
  switch (e.nodeType) {
    case e.DOCUMENT_NODE:
      return EO(e, t);
    case e.DOCUMENT_FRAGMENT_NODE:
      return SO(e, t);
    case e.DOCUMENT_TYPE_NODE:
      return TO(e);
    case e.ELEMENT_NODE:
      return vO(e, t);
    case e.TEXT_NODE:
      return kO(e, t);
    case e.CDATA_SECTION_NODE:
      return CO();
  }
}
function EO(e, t) {
  return {
    type: Gn.Document,
    childNodes: Jc(e, t),
    adoptedStyleSheets: cm(e.adoptedStyleSheets)
  };
}
function SO(e, t) {
  const n = Pc(e);
  return n && t.serializationContext.shadowRootsController.addShadowRoot(e), {
    type: Gn.DocumentFragment,
    childNodes: Jc(e, t),
    isShadowRoot: n,
    adoptedStyleSheets: n ? cm(e.adoptedStyleSheets) : void 0
  };
}
function TO(e) {
  return {
    type: Gn.DocumentType,
    name: e.name,
    publicId: e.publicId,
    systemId: e.systemId
  };
}
function vO(e, t) {
  const n = am(e.tagName), r = IO(e) || void 0, s = Kp(jp(e), t.parentNodePrivacyLevel);
  if (s === U.HIDDEN) {
    const { width: a, height: c } = e.getBoundingClientRect();
    return {
      type: Gn.Element,
      tagName: n,
      attributes: {
        rr_width: `${a}px`,
        rr_height: `${c}px`,
        [Uc]: eI
      },
      childNodes: [],
      isSVG: r
    };
  }
  if (s === U.IGNORE)
    return;
  const o = hO(e, s, t);
  let i = [];
  if (Bv(e) && // Do not serialize style children as the css rules are already in the _cssText attribute
  n !== "style") {
    let a;
    t.parentNodePrivacyLevel === s && t.ignoreWhiteSpace === (n === "head") ? a = t : a = {
      ...t,
      parentNodePrivacyLevel: s,
      ignoreWhiteSpace: n === "head"
    }, i = Jc(e, a);
  }
  return {
    type: Gn.Element,
    tagName: n,
    attributes: o,
    childNodes: i,
    isSVG: r
  };
}
function IO(e) {
  return e.tagName === "svg" || e instanceof SVGElement;
}
function kO(e, t) {
  const n = Xp(e, t.ignoreWhiteSpace || !1, t.parentNodePrivacyLevel);
  if (n !== void 0)
    return {
      type: Gn.Text,
      textContent: n
    };
}
function CO() {
  return {
    type: Gn.CDATA,
    textContent: ""
  };
}
function AO(e, t, n) {
  const r = oe(), s = Yc(e, {
    serializationContext: n,
    parentNodePrivacyLevel: t.defaultPrivacyLevel,
    configuration: t
  });
  return $o(n.serializationStats, "serializationDuration", _e(r, oe())), s;
}
function dm(e) {
  return !!e.changedTouches;
}
function Ms(e) {
  return e.composed === !0 && li(e.target) ? e.composedPath()[0] : e.target;
}
const gd = 25;
function RO(e) {
  return Math.abs(e.pageTop - e.offsetTop - window.scrollY) > gd || Math.abs(e.pageLeft - e.offsetLeft - window.scrollX) > gd;
}
const xO = (e, t) => {
  const n = window.visualViewport, r = {
    layoutViewportX: e,
    layoutViewportY: t,
    visualViewportX: e,
    visualViewportY: t
  };
  if (n)
    RO(n) ? (r.layoutViewportX = Math.round(e + n.offsetLeft), r.layoutViewportY = Math.round(t + n.offsetTop)) : (r.visualViewportX = Math.round(e - n.offsetLeft), r.visualViewportY = Math.round(t - n.offsetTop));
  else return r;
  return r;
}, fm = (e) => ({
  scale: e.scale,
  offsetLeft: e.offsetLeft,
  offsetTop: e.offsetTop,
  pageLeft: e.pageLeft,
  pageTop: e.pageTop,
  height: e.height,
  width: e.width
});
function ft(e, t) {
  return {
    data: {
      source: e,
      ...t
    },
    type: Ct.IncrementalSnapshot,
    timestamp: oe()
  };
}
const OO = 50;
function LO(e, t) {
  const { throttled: n, cancel: r } = pn((o) => {
    const i = Ms(o);
    if (Rt(i)) {
      const a = pm(o);
      if (!a)
        return;
      const c = {
        id: Ke(i),
        timeOffset: 0,
        x: a.x,
        y: a.y
      };
      t(ft(dm(o) ? rt.TouchMove : rt.MouseMove, { positions: [c] }));
    }
  }, OO, {
    trailing: !1
  }), { stop: s } = qe(e, document, [
    "mousemove",
    "touchmove"
    /* DOM_EVENT.TOUCH_MOVE */
  ], n, {
    capture: !0,
    passive: !0
  });
  return {
    stop: () => {
      s(), r();
    }
  };
}
function pm(e) {
  let { clientX: t, clientY: n } = dm(e) ? e.changedTouches[0] : e;
  if (window.visualViewport) {
    const { visualViewportX: r, visualViewportY: s } = xO(t, n);
    t = r, n = s;
  }
  if (!(!Number.isFinite(t) || !Number.isFinite(n)))
    return { x: t, y: n };
}
const yd = {
  // Listen for pointerup DOM events instead of mouseup for MouseInteraction/MouseUp records. This
  // allows to reference such records from Frustration records.
  //
  // In the context of supporting Mobile Session Replay, we introduced `PointerInteraction` records
  // used by the Mobile SDKs in place of `MouseInteraction`. In the future, we should replace
  // `MouseInteraction` by `PointerInteraction` in the Browser SDK so we have an uniform way to
  // convey such interaction. This would cleanly solve the issue since we would have
  // `PointerInteraction/Up` records that we could reference from `Frustration` records.
  pointerup: ut.MouseUp,
  mousedown: ut.MouseDown,
  click: ut.Click,
  contextmenu: ut.ContextMenu,
  dblclick: ut.DblClick,
  focus: ut.Focus,
  blur: ut.Blur,
  touchstart: ut.TouchStart,
  touchend: ut.TouchEnd
};
function NO(e, t, n) {
  const r = (s) => {
    const o = Ms(s);
    if (gt(o, e.defaultPrivacyLevel) === U.HIDDEN || !Rt(o))
      return;
    const i = Ke(o), a = yd[s.type];
    let c;
    if (a !== ut.Blur && a !== ut.Focus) {
      const f = pm(s);
      if (!f)
        return;
      c = { id: i, type: a, x: f.x, y: f.y };
    } else
      c = { id: i, type: a };
    const u = {
      id: n.getIdForEvent(s),
      ...ft(rt.MouseInteraction, c)
    };
    t(u);
  };
  return qe(e, document, Object.keys(yd), r, {
    capture: !0,
    passive: !0
  });
}
const MO = 100;
function hm(e, t, n, r = document) {
  const { throttled: s, cancel: o } = pn((a) => {
    const c = Ms(a);
    if (!c || gt(c, e.defaultPrivacyLevel) === U.HIDDEN || !Rt(c))
      return;
    const u = Ke(c), f = c === document ? {
      scrollTop: Fc(),
      scrollLeft: lh()
    } : {
      scrollTop: Math.round(c.scrollTop),
      scrollLeft: Math.round(c.scrollLeft)
    };
    n.set(c, f), t(ft(rt.Scroll, {
      id: u,
      x: f.scrollLeft,
      y: f.scrollTop
    }));
  }, MO), { stop: i } = me(e, r, "scroll", s, {
    capture: !0,
    passive: !0
  });
  return {
    stop: () => {
      i(), o();
    }
  };
}
const PO = 200;
function DO(e, t) {
  const n = dh(e).subscribe((r) => {
    t(ft(rt.ViewportResize, r));
  });
  return {
    stop: () => {
      n.unsubscribe();
    }
  };
}
function UO(e, t) {
  const n = window.visualViewport;
  if (!n)
    return { stop: Y };
  const { throttled: r, cancel: s } = pn(() => {
    t({
      data: fm(n),
      type: Ct.VisualViewport,
      timestamp: oe()
    });
  }, PO, {
    trailing: !1
  }), { stop: o } = qe(e, n, [
    "resize",
    "scroll"
    /* DOM_EVENT.SCROLL */
  ], r, {
    capture: !0,
    passive: !0
  });
  return {
    stop: () => {
      o(), s();
    }
  };
}
function FO(e, t) {
  return qe(e, document, [
    "play",
    "pause"
    /* DOM_EVENT.PAUSE */
  ], (n) => {
    const r = Ms(n);
    !r || gt(r, e.defaultPrivacyLevel) === U.HIDDEN || !Rt(r) || t(ft(rt.MediaInteraction, {
      id: Ke(r),
      type: n.type === "play" ? md.Play : md.Pause
    }));
  }, {
    capture: !0,
    passive: !0
  });
}
function $O(e) {
  function t(s, o) {
    s && Rt(s.ownerNode) && o(Ke(s.ownerNode));
  }
  const n = [
    je(CSSStyleSheet.prototype, "insertRule", ({ target: s, parameters: [o, i] }) => {
      t(s, (a) => e(ft(rt.StyleSheetRule, {
        id: a,
        adds: [{ rule: o, index: i }]
      })));
    }),
    je(CSSStyleSheet.prototype, "deleteRule", ({ target: s, parameters: [o] }) => {
      t(s, (i) => e(ft(rt.StyleSheetRule, {
        id: i,
        removes: [{ index: o }]
      })));
    })
  ];
  typeof CSSGroupingRule < "u" ? r(CSSGroupingRule) : (r(CSSMediaRule), r(CSSSupportsRule));
  function r(s) {
    n.push(je(s.prototype, "insertRule", ({ target: o, parameters: [i, a] }) => {
      t(o.parentStyleSheet, (c) => {
        const u = _d(o);
        u && (u.push(a || 0), e(ft(rt.StyleSheetRule, {
          id: c,
          adds: [{ rule: i, index: u }]
        })));
      });
    }), je(s.prototype, "deleteRule", ({ target: o, parameters: [i] }) => {
      t(o.parentStyleSheet, (a) => {
        const c = _d(o);
        c && (c.push(i), e(ft(rt.StyleSheetRule, {
          id: a,
          removes: [{ index: c }]
        })));
      });
    }));
  }
  return {
    stop: () => {
      n.forEach((s) => s.stop());
    }
  };
}
function _d(e) {
  const t = [];
  let n = e;
  for (; n.parentRule; ) {
    const i = Array.from(n.parentRule.cssRules).indexOf(n);
    t.unshift(i), n = n.parentRule;
  }
  if (!n.parentStyleSheet)
    return;
  const s = Array.from(n.parentStyleSheet.cssRules).indexOf(n);
  return t.unshift(s), t;
}
function BO(e, t) {
  return qe(e, window, [
    "focus",
    "blur"
    /* DOM_EVENT.BLUR */
  ], () => {
    t({
      data: { has_focus: document.hasFocus() },
      type: Ct.Focus,
      timestamp: oe()
    });
  });
}
function VO(e, t, n) {
  const r = e.subscribe(12, (s) => {
    var o, i;
    s.rawRumEvent.type === z.ACTION && s.rawRumEvent.action.type === ui.CLICK && (!((i = (o = s.rawRumEvent.action.frustration) === null || o === void 0 ? void 0 : o.type) === null || i === void 0) && i.length) && "events" in s.domainContext && s.domainContext.events && s.domainContext.events.length && t({
      timestamp: s.rawRumEvent.date,
      type: Ct.FrustrationRecord,
      data: {
        frustrationTypes: s.rawRumEvent.action.frustration.type,
        recordIds: s.domainContext.events.map((a) => n.getIdForEvent(a))
      }
    });
  });
  return {
    stop: () => {
      r.unsubscribe();
    }
  };
}
function WO(e, t) {
  const n = e.subscribe(5, () => {
    t({
      timestamp: oe(),
      type: Ct.ViewEnd
    });
  });
  return {
    stop: () => {
      n.unsubscribe();
    }
  };
}
function mm(e, t, n = document) {
  const r = e.defaultPrivacyLevel, s = /* @__PURE__ */ new WeakMap(), o = n !== document, { stop: i } = qe(
    e,
    n,
    // The 'input' event bubbles across shadow roots, so we don't have to listen for it on shadow
    // roots since it will be handled by the event listener that we did add to the document. Only
    // the 'change' event is blocked and needs to be handled on shadow roots.
    o ? [
      "change"
      /* DOM_EVENT.CHANGE */
    ] : [
      "input",
      "change"
      /* DOM_EVENT.CHANGE */
    ],
    (f) => {
      const l = Ms(f);
      (l instanceof HTMLInputElement || l instanceof HTMLTextAreaElement || l instanceof HTMLSelectElement) && c(l);
    },
    {
      capture: !0,
      passive: !0
    }
  );
  let a;
  if (o)
    a = Y;
  else {
    const f = [
      Wr(HTMLInputElement.prototype, "value", c),
      Wr(HTMLInputElement.prototype, "checked", c),
      Wr(HTMLSelectElement.prototype, "value", c),
      Wr(HTMLTextAreaElement.prototype, "value", c),
      Wr(HTMLSelectElement.prototype, "selectedIndex", c)
    ];
    a = () => {
      f.forEach((l) => l.stop());
    };
  }
  return {
    stop: () => {
      a(), i();
    }
  };
  function c(f) {
    const l = gt(f, r);
    if (l === U.HIDDEN)
      return;
    const d = f.type;
    let p;
    if (d === "radio" || d === "checkbox") {
      if (Os(f, l))
        return;
      p = { isChecked: f.checked };
    } else {
      const m = qc(f, l);
      if (m === void 0)
        return;
      p = { text: m };
    }
    u(f, p);
    const h = f.name;
    d === "radio" && h && f.checked && document.querySelectorAll(`input[type="radio"][name="${CSS.escape(h)}"]`).forEach((m) => {
      m !== f && u(m, { isChecked: !1 });
    });
  }
  function u(f, l) {
    if (!Rt(f))
      return;
    const d = s.get(f);
    (!d || d.text !== l.text || d.isChecked !== l.isChecked) && (s.set(f, l), t(ft(rt.Input, {
      id: Ke(f),
      ...l
    })));
  }
}
const HO = 100, GO = 16;
function zO(e) {
  let t = Y, n = [];
  function r() {
    t(), e(n), n = [];
  }
  const { throttled: s, cancel: o } = pn(r, GO, {
    leading: !1
  });
  return {
    addMutations: (i) => {
      n.length === 0 && (t = hp(s, { timeout: HO })), n.push(...i);
    },
    flush: r,
    stop: () => {
      t(), o();
    }
  };
}
function gm(e, t, n, r) {
  const s = Lp();
  if (!s)
    return { stop: Y, flush: Y };
  const o = zO((a) => {
    KO(a.concat(i.takeRecords()), e, t, n);
  }), i = new s(D(o.addMutations));
  return i.observe(r, {
    attributeOldValue: !0,
    attributes: !0,
    characterData: !0,
    characterDataOldValue: !0,
    childList: !0,
    subtree: !0
  }), {
    stop: () => {
      i.disconnect(), o.stop();
    },
    flush: () => {
      o.flush();
    }
  };
}
function KO(e, t, n, r) {
  const s = /* @__PURE__ */ new Map();
  e.filter((d) => d.type === "childList").forEach((d) => {
    d.removedNodes.forEach((p) => {
      ym(p, r.removeShadowRoot);
    });
  });
  const o = e.filter((d) => d.target.isConnected && sO(d.target) && gt(d.target, n.defaultPrivacyLevel, s) !== U.HIDDEN), i = Xc(), { adds: a, removes: c, hasBeenSerialized: u } = jO(o.filter((d) => d.type === "childList"), n, i, r, s), f = qO(o.filter((d) => d.type === "characterData" && !u(d.target)), n, s), l = XO(o.filter((d) => d.type === "attributes" && !u(d.target)), n, s);
  !f.length && !l.length && !c.length && !a.length || t(ft(rt.Mutation, { adds: a, removes: c, texts: f, attributes: l }), i);
}
function jO(e, t, n, r, s) {
  const o = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Map();
  for (const h of e)
    h.addedNodes.forEach((m) => {
      o.add(m);
    }), h.removedNodes.forEach((m) => {
      o.has(m) || i.set(m, h.target), o.delete(m);
    });
  const a = Array.from(o);
  YO(a);
  const c = /* @__PURE__ */ new Set(), u = {
    status: 2,
    serializationStats: n,
    shadowRootsController: r
  }, f = [];
  for (const h of a) {
    if (d(h))
      continue;
    const m = gt(h.parentNode, t.defaultPrivacyLevel, s);
    if (m === U.HIDDEN || m === U.IGNORE)
      continue;
    const g = oe(), _ = Yc(h, {
      serializedNodeIds: c,
      parentNodePrivacyLevel: m,
      serializationContext: u,
      configuration: t
    });
    if ($o(n, "serializationDuration", _e(g, oe())), !_)
      continue;
    const y = di(h);
    f.push({
      nextId: p(h),
      parentId: Ke(y),
      node: _
    });
  }
  const l = [];
  return i.forEach((h, m) => {
    Rt(m) && l.push({
      parentId: Ke(h),
      id: Ke(m)
    });
  }), { adds: f, removes: l, hasBeenSerialized: d };
  function d(h) {
    return Rt(h) && c.has(Ke(h));
  }
  function p(h) {
    let m = h.nextSibling;
    for (; m; ) {
      if (Rt(m))
        return Ke(m);
      m = m.nextSibling;
    }
    return null;
  }
}
function qO(e, t, n) {
  var r;
  const s = [], o = /* @__PURE__ */ new Set(), i = e.filter((a) => o.has(a.target) ? !1 : (o.add(a.target), !0));
  for (const a of i) {
    if (a.target.textContent === a.oldValue)
      continue;
    const u = gt(di(a.target), t.defaultPrivacyLevel, n);
    u === U.HIDDEN || u === U.IGNORE || s.push({
      id: Ke(a.target),
      // TODO: pass a valid "ignoreWhiteSpace" argument
      value: (r = Xp(a.target, !1, u)) !== null && r !== void 0 ? r : null
    });
  }
  return s;
}
function XO(e, t, n) {
  const r = [], s = /* @__PURE__ */ new Map(), o = e.filter((a) => {
    const c = s.get(a.target);
    return c && c.has(a.attributeName) ? !1 : (c ? c.add(a.attributeName) : s.set(a.target, /* @__PURE__ */ new Set([a.attributeName])), !0);
  }), i = /* @__PURE__ */ new Map();
  for (const a of o) {
    if (a.target.getAttribute(a.attributeName) === a.oldValue)
      continue;
    const u = gt(a.target, t.defaultPrivacyLevel, n), f = um(a.target, u, a.attributeName, t);
    let l;
    if (a.attributeName === "value") {
      const p = qc(a.target, u);
      if (p === void 0)
        continue;
      l = p;
    } else typeof f == "string" ? l = f : l = null;
    let d = i.get(a.target);
    d || (d = {
      id: Ke(a.target),
      attributes: {}
    }, r.push(d), i.set(a.target, d)), d.attributes[a.attributeName] = l;
  }
  return r;
}
function YO(e) {
  e.sort((t, n) => {
    const r = t.compareDocumentPosition(n);
    return r & Node.DOCUMENT_POSITION_CONTAINED_BY ? -1 : r & Node.DOCUMENT_POSITION_CONTAINS || r & Node.DOCUMENT_POSITION_FOLLOWING ? 1 : r & Node.DOCUMENT_POSITION_PRECEDING ? -1 : 0;
  });
}
function ym(e, t) {
  li(e) && t(e.shadowRoot), Vp(e, (n) => ym(n, t));
}
function JO() {
  const e = /* @__PURE__ */ new WeakMap();
  return {
    set(t, n) {
      t === document && !document.scrollingElement || e.set(t === document ? document.scrollingElement : t, n);
    },
    get(t) {
      return e.get(t);
    },
    has(t) {
      return e.has(t);
    }
  };
}
const ZO = (e, t, n) => {
  const r = /* @__PURE__ */ new Map(), s = {
    addShadowRoot: (o) => {
      if (r.has(o))
        return;
      const i = gm(t, e, s, o), a = mm(e, t, o), c = hm(e, t, n, o);
      r.set(o, {
        flush: () => i.flush(),
        stop: () => {
          i.stop(), a.stop(), c.stop();
        }
      });
    },
    removeShadowRoot: (o) => {
      const i = r.get(o);
      i && (i.stop(), r.delete(o));
    },
    stop: () => {
      r.forEach(({ stop: o }) => o());
    },
    flush: () => {
      r.forEach(({ flush: o }) => o());
    }
  };
  return s;
};
function QO(e, t, n, r, s, o) {
  const i = (c, u) => {
    const { width: f, height: l } = hi();
    o({
      data: {
        height: l,
        href: window.location.href,
        width: f
      },
      type: Ct.Meta,
      timestamp: c
    }), o({
      data: {
        has_focus: document.hasFocus()
      },
      type: Ct.Focus,
      timestamp: c
    });
    const d = Xc();
    o({
      data: {
        node: AO(document, r, {
          status: u,
          elementsScrollPositions: e,
          serializationStats: d,
          shadowRootsController: t
        }),
        initialOffset: {
          left: lh(),
          top: Fc()
        }
      },
      type: Ct.FullSnapshot,
      timestamp: c
    }, d), window.visualViewport && o({
      data: fm(window.visualViewport),
      type: Ct.VisualViewport,
      timestamp: c
    });
  };
  i(
    oe(),
    0
    /* SerializationContextStatus.INITIAL_FULL_SNAPSHOT */
  );
  const { unsubscribe: a } = n.subscribe(2, (c) => {
    s(), i(
      c.startClocks.timeStamp,
      1
      /* SerializationContextStatus.SUBSEQUENT_FULL_SNAPSHOT */
    );
  });
  return {
    stop: a
  };
}
function eL() {
  const e = /* @__PURE__ */ new WeakMap();
  let t = 1;
  return {
    getIdForEvent(n) {
      return e.has(n) || e.set(n, t++), e.get(n);
    }
  };
}
function tL(e) {
  const { emit: t, configuration: n, lifeCycle: r } = e;
  if (!t)
    throw new Error("emit function is required");
  const s = (d, p) => {
    t(d, p), ni("record", { record: d });
    const h = e.viewHistory.findView();
    qC(h.id);
  }, o = JO(), i = ZO(n, s, o), { stop: a } = QO(o, i, r, n, c, s);
  function c() {
    i.flush(), f.flush();
  }
  const u = eL(), f = gm(s, n, i, document), l = [
    f,
    LO(n, s),
    NO(n, s, u),
    hm(n, s, o, document),
    DO(n, s),
    mm(n, s),
    FO(n, s),
    $O(s),
    BO(n, s),
    UO(n, s),
    VO(r, s, u),
    WO(r, (d) => {
      c(), s(d);
    })
  ];
  return {
    stop: () => {
      i.stop(), l.forEach((d) => d.stop()), a();
    },
    flushMutations: c,
    shadowRootsController: i
  };
}
function nL(e, t, n, r) {
  const s = new FormData();
  s.append("segment", new Blob([e], {
    type: "application/octet-stream"
  }), `${t.session.id}-${t.start}`);
  const o = {
    raw_segment_size: r,
    compressed_segment_size: e.byteLength,
    ...t
  }, i = JSON.stringify(o);
  return s.append("event", new Blob([i], { type: "application/json" })), {
    data: s,
    bytesCount: e.byteLength,
    cssText: n.cssText,
    isFullSnapshot: t.index_in_view === 0,
    rawSize: r,
    recordCount: t.records_count,
    serializationDuration: n.serializationDuration
  };
}
function rL({ context: e, creationReason: t, encoder: n }) {
  let r = 0;
  const s = e.view.id, o = KC(s), i = {
    start: 1 / 0,
    end: -1 / 0,
    creation_reason: t,
    records_count: 0,
    has_full_snapshot: !1,
    index_in_view: o,
    source: "browser",
    ...e
  }, a = Xc();
  jC(s);
  function c(f, l, d) {
    i.start = Math.min(i.start, f.timestamp), i.end = Math.max(i.end, f.timestamp), i.records_count += 1, i.has_full_snapshot || (i.has_full_snapshot = f.type === Ct.FullSnapshot), l && pO(a, l);
    const p = n.isEmpty ? '{"records":[' : ",";
    n.write(p + JSON.stringify(f), (h) => {
      r += h, d(r);
    });
  }
  function u(f) {
    if (n.isEmpty)
      throw new Error("Empty segment flushed");
    n.write(`],${JSON.stringify(i).slice(1)}
`), n.finish((l) => {
      XC(i.view.id, l.rawBytesCount), f(i, a, l);
    });
  }
  return { addRecord: c, flush: u };
}
const sL = 5 * Oe;
let _m = 6e4;
function oL(e, t, n, r, s, o) {
  return iL(e, () => aL(t.applicationId, n, r), s, o);
}
function iL(e, t, n, r) {
  let s = {
    status: 0,
    nextSegmentCreationReason: "init"
  };
  const { unsubscribe: o } = e.subscribe(2, () => {
    a("view_change");
  }), { unsubscribe: i } = e.subscribe(11, (c) => {
    a(c.reason);
  });
  function a(c) {
    s.status === 1 && (s.segment.flush((u, f, l) => {
      const d = nL(l.output, u, f, l.rawBytesCount);
      jf(c) ? n.sendOnExit(d) : n.send(d);
    }), ze(s.expirationTimeoutId)), c !== "stop" ? s = {
      status: 0,
      nextSegmentCreationReason: c
    } : s = {
      status: 2
    };
  }
  return {
    addRecord: (c, u) => {
      if (s.status !== 2) {
        if (s.status === 0) {
          const f = t();
          if (!f)
            return;
          s = {
            status: 1,
            segment: rL({ encoder: r, context: f, creationReason: s.nextSegmentCreationReason }),
            expirationTimeoutId: Re(() => {
              a("segment_duration_limit");
            }, sL)
          };
        }
        s.segment.addRecord(c, u, (f) => {
          f > _m && a("segment_bytes_limit");
        });
      }
    },
    stop: () => {
      a("stop"), o(), i();
    }
  };
}
function aL(e, t, n) {
  const r = t.findTrackedSession(), s = n.findView();
  if (!(!r || !s))
    return {
      application: {
        id: e
      },
      session: {
        id: r.id
      },
      view: {
        id: s.id
      }
    };
}
function cL(e, t) {
  if (!e.metricsEnabled)
    return { stop: Y };
  const { unsubscribe: n } = t.subscribe((r) => {
    if (r.type === "failure" || r.type === "queue-full" || r.type === "success" && r.payload.isFullSnapshot) {
      const s = uL(r.type, r.bandwidth, r.payload);
      As("Segment network request metrics", { metrics: s });
    }
  });
  return {
    stop: n
  };
}
function uL(e, t, n) {
  return {
    cssText: {
      count: n.cssText.count,
      max: n.cssText.max,
      sum: n.cssText.sum
    },
    isFullSnapshot: n.isFullSnapshot,
    ongoingRequests: {
      count: t.ongoingRequestCount,
      totalSize: t.ongoingByteCount
    },
    recordCount: n.recordCount,
    result: e,
    serializationDuration: {
      count: n.serializationDuration.count,
      max: n.serializationDuration.max,
      sum: n.serializationDuration.sum
    },
    size: {
      compressed: n.bytesCount,
      raw: n.rawSize
    }
  };
}
function lL(e) {
  const t = Qn();
  return {
    addRecord: (n) => {
      const r = e.findView();
      t.send("record", n, r.id);
    }
  };
}
function dL(e, t, n, r, s, o, i) {
  const a = [], c = (d) => {
    e.notify(14, { error: d }), Kt("Error reported to customer", { "error.message": d.message });
  }, u = i || si([t.sessionReplayEndpointBuilder], _m, c);
  let f;
  if (xt())
    ({ addRecord: f } = lL(r));
  else {
    const d = oL(e, t, n, r, u, s);
    f = d.addRecord, a.push(d.stop);
    const p = cL(o, u.observable);
    a.push(p.stop);
  }
  const { stop: l } = tL({
    emit: f,
    configuration: t,
    lifeCycle: e,
    viewHistory: r
  });
  return a.push(l), {
    stop: () => {
      a.forEach((d) => d());
    }
  };
}
const fL = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  startRecording: dL
}, Symbol.toStringTag, { value: "Module" }));
function pL(e) {
  let t = 0;
  for (const n of e)
    n.stackId !== void 0 && t++;
  return t;
}
const Bo = /* @__PURE__ */ new Map();
function hL(e, t) {
  Bo.set(t, e);
}
function mL(e) {
  return Bo.get(e);
}
function bd(e) {
  for (const t of Bo.keys())
    t < e && Bo.delete(t);
}
function gL({ rawRumEvent: e, startTime: t }) {
  if (e.type !== z.LONG_TASK)
    return;
  const n = e.long_task.id;
  hL(n, t);
}
function yL(e, t, n) {
  const r = {
    application: {
      id: t
    }
  };
  n && (r.session = {
    id: n
  });
  const { ids: s, names: o } = _L(e.views);
  s.length && (r.view = {
    id: s,
    name: o
  });
  const i = e.longTasks.map((a) => a.id).filter((a) => a !== void 0);
  return i.length && (r.long_task = { id: i }), r;
}
function _L(e) {
  const t = { ids: [], names: [] };
  for (const n of e)
    t.ids.push(n.viewId), n.viewName && t.names.push(n.viewName);
  return t.names = Array.from(new Set(t.names)), t;
}
const bL = (e, t, n) => {
  const { profilingEndpointBuilder: r, applicationId: s } = t, o = wL(e, t, n), i = SL(e, o), a = r.build("fetch", i);
  return Kt("Sending profile to public profiling intake", { profilingIntakeURL: a, applicationId: s, sessionId: n }), fetch(a, {
    body: i.data,
    method: "POST"
  });
};
function wL(e, t, n) {
  const r = ti(t), s = yL(e, t.applicationId, n), o = EL(r);
  return {
    ...s,
    attachments: ["wall-time.json"],
    start: new Date(e.startClocks.timeStamp).toISOString(),
    end: new Date(e.endClocks.timeStamp).toISOString(),
    family: "chrome",
    runtime: "chrome",
    format: "json",
    version: 4,
    // Ingestion event version (not the version application tag)
    tags_profiler: o.join(","),
    _dd: {
      clock_drift: sf()
    }
  };
}
function EL(e) {
  return e.concat(["language:javascript", "runtime:chrome", "family:chrome", "host:browser"]);
}
function SL(e, t) {
  const n = new Blob([JSON.stringify(e)], {
    type: "application/json"
  }), r = new FormData();
  return r.append("event", new Blob([JSON.stringify(t)], { type: "application/json" }), "event.json"), r.append("wall-time.json", n, "wall-time.json"), { data: r, bytesCount: 0 };
}
const TL = {
  sendProfile: bL
}, vL = /\/(?![vV]\d{1,2}\/)([^/\d?]*\d+[^/?]*)/g;
function IL(e) {
  return e ? e.replace(vL, "/?") : "/";
}
const wd = (e, t) => e || IL(t), bm = {
  sampleIntervalMs: 10,
  // Sample stack trace every 10ms
  collectIntervalMs: 6e4,
  // Collect data every minute
  minProfileDurationMs: 5e3,
  // Require at least 5 seconds of profile data to reduce noise and cost
  minNumberOfSamples: 50
  // Require at least 50 samples (~500 ms) to report a profile to reduce noise and cost
};
function kL(e, t, n, r, s = bm) {
  const o = hn(te.LONG_ANIMATION_FRAME);
  let i;
  const a = [];
  let c = { state: "stopped" };
  function u(v) {
    c.state !== "running" && (i = v ? {
      startClocks: v.startClocks,
      viewId: v.id,
      viewName: wd(v.name, document.location.pathname)
    } : void 0, a.push(me(e, window, "visibilitychange", E).stop, me(e, window, "beforeunload", S).stop), d());
  }
  async function f() {
    await h("stopped"), a.forEach((v) => v()), bd(Ee().relative), r.set({ status: "stopped", error_reason: void 0 });
  }
  function l(v) {
    if (v.state === "running")
      return {
        cleanupTasks: v.cleanupTasks,
        observer: v.observer
      };
    const M = [];
    let P;
    if (e.trackLongTasks) {
      P = new PerformanceObserver(y), P.observe({
        entryTypes: [w()]
      });
      const I = t.subscribe(12, (O) => {
        gL(O);
      });
      M.push(() => P?.disconnect()), M.push(I.unsubscribe);
    }
    const C = t.subscribe(2, (I) => {
      const O = {
        viewId: I.id,
        // Note: `viewName` is only filled when users use manual view creation via `startView` method.
        viewName: wd(I.name, document.location.pathname),
        startClocks: I.startClocks
      };
      m(O), i = O;
    });
    return M.push(C.unsubscribe), {
      cleanupTasks: M,
      observer: P
    };
  }
  function d() {
    const v = Xe().Profiler;
    if (!v)
      throw r.set({ status: "error", error_reason: "not-supported-by-browser" }), new Error("RUM Profiler is not supported in this browser.");
    p(c).catch(dt);
    const { cleanupTasks: M, observer: P } = l(c);
    let C;
    try {
      C = new v({
        sampleInterval: s.sampleIntervalMs,
        // Keep buffer size at 1.5 times of minimum required to collect data for a profiling instance
        maxBufferSize: Math.round(s.collectIntervalMs * 1.5 / s.sampleIntervalMs)
      });
    } catch (I) {
      I instanceof Error && I.message.includes("disabled by Document Policy") ? (W.warn("[DD_RUM] Profiler startup failed. Ensure your server includes the `Document-Policy: js-profiling` response header when serving HTML pages.", I), r.set({ status: "error", error_reason: "missing-document-policy-header" })) : r.set({ status: "error", error_reason: "unexpected-exception" });
      return;
    }
    r.set({ status: "running", error_reason: void 0 }), c = {
      state: "running",
      startClocks: Ee(),
      profiler: C,
      timeoutId: Re(d, s.collectIntervalMs),
      longTasks: [],
      views: [],
      cleanupTasks: M,
      observer: P
    }, m(i), C.addEventListener("samplebufferfull", _);
  }
  async function p(v) {
    var M, P;
    if (v.state !== "running")
      return;
    b((P = (M = v.observer) === null || M === void 0 ? void 0 : M.takeRecords()) !== null && P !== void 0 ? P : []), ze(v.timeoutId), v.profiler.removeEventListener("samplebufferfull", _);
    const { startClocks: C, longTasks: I, views: O } = v, R = Ee();
    await v.profiler.stop().then((X) => {
      const F = Ee(), ue = I.length > 0, x = _e(C.timeStamp, F.timeStamp) < s.minProfileDurationMs, A = pL(X.samples) < s.minNumberOfSamples;
      !ue && (x || A) || (g(
        // Enrich trace with time and instance data
        Object.assign(X, {
          startClocks: C,
          endClocks: F,
          clocksOrigin: gc(),
          longTasks: I,
          views: O,
          sampleInterval: s.sampleIntervalMs
        })
      ), bd(R.relative));
    }).catch(dt);
  }
  async function h(v) {
    c.state === "running" && (c.cleanupTasks.forEach((M) => M()), await p(c), c = { state: v });
  }
  function m(v) {
    c.state !== "running" || !v || c.views.push(v);
  }
  function g(v) {
    var M;
    const P = (M = n.findTrackedSession()) === null || M === void 0 ? void 0 : M.id;
    TL.sendProfile(v, e, P).catch(dt);
  }
  function _() {
    d();
  }
  function y(v) {
    b(v.getEntries());
  }
  function b(v) {
    if (c.state === "running")
      for (const M of v) {
        if (M.duration < s.sampleIntervalMs)
          continue;
        const P = vs(M.startTime), C = mL(P.relative);
        c.longTasks.push({
          id: C,
          duration: M.duration,
          entryType: M.entryType,
          startClocks: P
        });
      }
  }
  function E() {
    document.visibilityState === "hidden" && c.state === "running" ? h("paused").catch(dt) : document.visibilityState === "visible" && c.state === "paused" && d();
  }
  function S() {
    d();
  }
  function w() {
    return o ? "long-animation-frame" : "longtask";
  }
  function T() {
    return c.state === "stopped";
  }
  function N() {
    return c.state === "running";
  }
  function k() {
    return c.state === "paused";
  }
  return { start: u, stop: f, isStopped: T, isRunning: N, isPaused: k };
}
const CL = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DEFAULT_RUM_PROFILER_CONFIGURATION: bm,
  createRumProfiler: kL
}, Symbol.toStringTag, { value: "Module" }));
//# sourceMappingURL=background.js.map
