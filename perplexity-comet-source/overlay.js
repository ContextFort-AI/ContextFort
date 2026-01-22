function _6(a, i) {
    for (var o = 0; o < i.length; o++) {
        const r = i[o];
        if (typeof r != "string" && !Array.isArray(r)) {
            for (const c in r)
                if (c !== "default" && !(c in a)) {
                    const f = Object.getOwnPropertyDescriptor(r, c);
                    f && Object.defineProperty(a, c, f.get ? f : { enumerable: !0, get: () => r[c] });
                }
        }
    }
    return Object.freeze(Object.defineProperty(a, Symbol.toStringTag, { value: "Module" }));
}
(function () {
    const i = document.createElement("link").relList;
    if (i && i.supports && i.supports("modulepreload")) return;
    for (const c of document.querySelectorAll('link[rel="modulepreload"]')) r(c);
    new MutationObserver((c) => {
        for (const f of c)
            if (f.type === "childList")
                for (const h of f.addedNodes) h.tagName === "LINK" && h.rel === "modulepreload" && r(h);
    }).observe(document, { childList: !0, subtree: !0 });
    function o(c) {
        const f = {};
        return (
            c.integrity && (f.integrity = c.integrity),
            c.referrerPolicy && (f.referrerPolicy = c.referrerPolicy),
            c.crossOrigin === "use-credentials"
                ? (f.credentials = "include")
                : c.crossOrigin === "anonymous"
                  ? (f.credentials = "omit")
                  : (f.credentials = "same-origin"),
            f
        );
    }
    function r(c) {
        if (c.ep) return;
        c.ep = !0;
        const f = o(c);
        fetch(c.href, f);
    }
})();
function fc(a) {
    return a && a.__esModule && Object.prototype.hasOwnProperty.call(a, "default") ? a.default : a;
}
var Rs = { exports: {} },
    vi = {};
var E0;
function N6() {
    if (E0) return vi;
    E0 = 1;
    var a = Symbol.for("react.transitional.element"),
        i = Symbol.for("react.fragment");
    function o(r, c, f) {
        var h = null;
        if ((f !== void 0 && (h = "" + f), c.key !== void 0 && (h = "" + c.key), "key" in c)) {
            f = {};
            for (var m in c) m !== "key" && (f[m] = c[m]);
        } else f = c;
        return (c = f.ref), { $$typeof: a, type: r, key: h, ref: c !== void 0 ? c : null, props: f };
    }
    return (vi.Fragment = i), (vi.jsx = o), (vi.jsxs = o), vi;
}
var S0;
function L6() {
    return S0 || ((S0 = 1), (Rs.exports = N6())), Rs.exports;
}
var z = L6(),
    ws = { exports: {} },
    gi = {},
    Os = { exports: {} },
    Hs = {};
var C0;
function U6() {
    return (
        C0 ||
            ((C0 = 1),
            (function (a) {
                function i(F, J) {
                    var I = F.length;
                    F.push(J);
                    t: for (; 0 < I; ) {
                        var rt = (I - 1) >>> 1,
                            S = F[rt];
                        if (0 < c(S, J)) (F[rt] = J), (F[I] = S), (I = rt);
                        else break t;
                    }
                }
                function o(F) {
                    return F.length === 0 ? null : F[0];
                }
                function r(F) {
                    if (F.length === 0) return null;
                    var J = F[0],
                        I = F.pop();
                    if (I !== J) {
                        F[0] = I;
                        t: for (var rt = 0, S = F.length, j = S >>> 1; rt < j; ) {
                            var at = 2 * (rt + 1) - 1,
                                nt = F[at],
                                q = at + 1,
                                dt = F[q];
                            if (0 > c(nt, I))
                                q < S && 0 > c(dt, nt)
                                    ? ((F[rt] = dt), (F[q] = I), (rt = q))
                                    : ((F[rt] = nt), (F[at] = I), (rt = at));
                            else if (q < S && 0 > c(dt, I)) (F[rt] = dt), (F[q] = I), (rt = q);
                            else break t;
                        }
                    }
                    return J;
                }
                function c(F, J) {
                    var I = F.sortIndex - J.sortIndex;
                    return I !== 0 ? I : F.id - J.id;
                }
                if (
                    ((a.unstable_now = void 0), typeof performance == "object" && typeof performance.now == "function")
                ) {
                    var f = performance;
                    a.unstable_now = function () {
                        return f.now();
                    };
                } else {
                    var h = Date,
                        m = h.now();
                    a.unstable_now = function () {
                        return h.now() - m;
                    };
                }
                var g = [],
                    v = [],
                    p = 1,
                    A = null,
                    E = 3,
                    x = !1,
                    H = !1,
                    D = !1,
                    _ = typeof setTimeout == "function" ? setTimeout : null,
                    V = typeof clearTimeout == "function" ? clearTimeout : null,
                    U = typeof setImmediate < "u" ? setImmediate : null;
                function Q(F) {
                    for (var J = o(v); J !== null; ) {
                        if (J.callback === null) r(v);
                        else if (J.startTime <= F) r(v), (J.sortIndex = J.expirationTime), i(g, J);
                        else break;
                        J = o(v);
                    }
                }
                function Y(F) {
                    if (((D = !1), Q(F), !H))
                        if (o(g) !== null) (H = !0), At();
                        else {
                            var J = o(v);
                            J !== null && Tt(Y, J.startTime - F);
                        }
                }
                var R = !1,
                    k = -1,
                    X = 5,
                    st = -1;
                function P() {
                    return !(a.unstable_now() - st < X);
                }
                function K() {
                    if (R) {
                        var F = a.unstable_now();
                        st = F;
                        var J = !0;
                        try {
                            t: {
                                (H = !1), D && ((D = !1), V(k), (k = -1)), (x = !0);
                                var I = E;
                                try {
                                    e: {
                                        for (Q(F), A = o(g); A !== null && !(A.expirationTime > F && P()); ) {
                                            var rt = A.callback;
                                            if (typeof rt == "function") {
                                                (A.callback = null), (E = A.priorityLevel);
                                                var S = rt(A.expirationTime <= F);
                                                if (((F = a.unstable_now()), typeof S == "function")) {
                                                    (A.callback = S), Q(F), (J = !0);
                                                    break e;
                                                }
                                                A === o(g) && r(g), Q(F);
                                            } else r(g);
                                            A = o(g);
                                        }
                                        if (A !== null) J = !0;
                                        else {
                                            var j = o(v);
                                            j !== null && Tt(Y, j.startTime - F), (J = !1);
                                        }
                                    }
                                    break t;
                                } finally {
                                    (A = null), (E = I), (x = !1);
                                }
                                J = void 0;
                            }
                        } finally {
                            J ? gt() : (R = !1);
                        }
                    }
                }
                var gt;
                if (typeof U == "function")
                    gt = function () {
                        U(K);
                    };
                else if (typeof MessageChannel < "u") {
                    var Mt = new MessageChannel(),
                        Et = Mt.port2;
                    (Mt.port1.onmessage = K),
                        (gt = function () {
                            Et.postMessage(null);
                        });
                } else
                    gt = function () {
                        _(K, 0);
                    };
                function At() {
                    R || ((R = !0), gt());
                }
                function Tt(F, J) {
                    k = _(function () {
                        F(a.unstable_now());
                    }, J);
                }
                (a.unstable_IdlePriority = 5),
                    (a.unstable_ImmediatePriority = 1),
                    (a.unstable_LowPriority = 4),
                    (a.unstable_NormalPriority = 3),
                    (a.unstable_Profiling = null),
                    (a.unstable_UserBlockingPriority = 2),
                    (a.unstable_cancelCallback = function (F) {
                        F.callback = null;
                    }),
                    (a.unstable_continueExecution = function () {
                        H || x || ((H = !0), At());
                    }),
                    (a.unstable_forceFrameRate = function (F) {
                        0 > F || 125 < F
                            ? console.error(
                                  "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
                              )
                            : (X = 0 < F ? Math.floor(1e3 / F) : 5);
                    }),
                    (a.unstable_getCurrentPriorityLevel = function () {
                        return E;
                    }),
                    (a.unstable_getFirstCallbackNode = function () {
                        return o(g);
                    }),
                    (a.unstable_next = function (F) {
                        switch (E) {
                            case 1:
                            case 2:
                            case 3:
                                var J = 3;
                                break;
                            default:
                                J = E;
                        }
                        var I = E;
                        E = J;
                        try {
                            return F();
                        } finally {
                            E = I;
                        }
                    }),
                    (a.unstable_pauseExecution = function () {}),
                    (a.unstable_requestPaint = function () {}),
                    (a.unstable_runWithPriority = function (F, J) {
                        switch (F) {
                            case 1:
                            case 2:
                            case 3:
                            case 4:
                            case 5:
                                break;
                            default:
                                F = 3;
                        }
                        var I = E;
                        E = F;
                        try {
                            return J();
                        } finally {
                            E = I;
                        }
                    }),
                    (a.unstable_scheduleCallback = function (F, J, I) {
                        var rt = a.unstable_now();
                        switch (
                            (typeof I == "object" && I !== null
                                ? ((I = I.delay), (I = typeof I == "number" && 0 < I ? rt + I : rt))
                                : (I = rt),
                            F)
                        ) {
                            case 1:
                                var S = -1;
                                break;
                            case 2:
                                S = 250;
                                break;
                            case 5:
                                S = 1073741823;
                                break;
                            case 4:
                                S = 1e4;
                                break;
                            default:
                                S = 5e3;
                        }
                        return (
                            (S = I + S),
                            (F = {
                                id: p++,
                                callback: J,
                                priorityLevel: F,
                                startTime: I,
                                expirationTime: S,
                                sortIndex: -1,
                            }),
                            I > rt
                                ? ((F.sortIndex = I),
                                  i(v, F),
                                  o(g) === null && F === o(v) && (D ? (V(k), (k = -1)) : (D = !0), Tt(Y, I - rt)))
                                : ((F.sortIndex = S), i(g, F), H || x || ((H = !0), At())),
                            F
                        );
                    }),
                    (a.unstable_shouldYield = P),
                    (a.unstable_wrapCallback = function (F) {
                        var J = E;
                        return function () {
                            var I = E;
                            E = J;
                            try {
                                return F.apply(this, arguments);
                            } finally {
                                E = I;
                            }
                        };
                    });
            })(Hs)),
        Hs
    );
}
var T0;
function V6() {
    return T0 || ((T0 = 1), (Os.exports = U6())), Os.exports;
}
var Bs = { exports: {} },
    ot = {};
var x0;
function z6() {
    if (x0) return ot;
    x0 = 1;
    var a = Symbol.for("react.transitional.element"),
        i = Symbol.for("react.portal"),
        o = Symbol.for("react.fragment"),
        r = Symbol.for("react.strict_mode"),
        c = Symbol.for("react.profiler"),
        f = Symbol.for("react.consumer"),
        h = Symbol.for("react.context"),
        m = Symbol.for("react.forward_ref"),
        g = Symbol.for("react.suspense"),
        v = Symbol.for("react.memo"),
        p = Symbol.for("react.lazy"),
        A = Symbol.iterator;
    function E(S) {
        return S === null || typeof S != "object"
            ? null
            : ((S = (A && S[A]) || S["@@iterator"]), typeof S == "function" ? S : null);
    }
    var x = {
            isMounted: function () {
                return !1;
            },
            enqueueForceUpdate: function () {},
            enqueueReplaceState: function () {},
            enqueueSetState: function () {},
        },
        H = Object.assign,
        D = {};
    function _(S, j, at) {
        (this.props = S), (this.context = j), (this.refs = D), (this.updater = at || x);
    }
    (_.prototype.isReactComponent = {}),
        (_.prototype.setState = function (S, j) {
            if (typeof S != "object" && typeof S != "function" && S != null)
                throw Error(
                    "takes an object of state variables to update or a function which returns an object of state variables."
                );
            this.updater.enqueueSetState(this, S, j, "setState");
        }),
        (_.prototype.forceUpdate = function (S) {
            this.updater.enqueueForceUpdate(this, S, "forceUpdate");
        });
    function V() {}
    V.prototype = _.prototype;
    function U(S, j, at) {
        (this.props = S), (this.context = j), (this.refs = D), (this.updater = at || x);
    }
    var Q = (U.prototype = new V());
    (Q.constructor = U), H(Q, _.prototype), (Q.isPureReactComponent = !0);
    var Y = Array.isArray,
        R = { H: null, A: null, T: null, S: null },
        k = Object.prototype.hasOwnProperty;
    function X(S, j, at, nt, q, dt) {
        return (at = dt.ref), { $$typeof: a, type: S, key: j, ref: at !== void 0 ? at : null, props: dt };
    }
    function st(S, j) {
        return X(S.type, j, void 0, void 0, void 0, S.props);
    }
    function P(S) {
        return typeof S == "object" && S !== null && S.$$typeof === a;
    }
    function K(S) {
        var j = { "=": "=0", ":": "=2" };
        return (
            "$" +
            S.replace(/[=:]/g, function (at) {
                return j[at];
            })
        );
    }
    var gt = /\/+/g;
    function Mt(S, j) {
        return typeof S == "object" && S !== null && S.key != null ? K("" + S.key) : j.toString(36);
    }
    function Et() {}
    function At(S) {
        switch (S.status) {
            case "fulfilled":
                return S.value;
            case "rejected":
                throw S.reason;
            default:
                switch (
                    (typeof S.status == "string"
                        ? S.then(Et, Et)
                        : ((S.status = "pending"),
                          S.then(
                              function (j) {
                                  S.status === "pending" && ((S.status = "fulfilled"), (S.value = j));
                              },
                              function (j) {
                                  S.status === "pending" && ((S.status = "rejected"), (S.reason = j));
                              }
                          )),
                    S.status)
                ) {
                    case "fulfilled":
                        return S.value;
                    case "rejected":
                        throw S.reason;
                }
        }
        throw S;
    }
    function Tt(S, j, at, nt, q) {
        var dt = typeof S;
        (dt === "undefined" || dt === "boolean") && (S = null);
        var ut = !1;
        if (S === null) ut = !0;
        else
            switch (dt) {
                case "bigint":
                case "string":
                case "number":
                    ut = !0;
                    break;
                case "object":
                    switch (S.$$typeof) {
                        case a:
                        case i:
                            ut = !0;
                            break;
                        case p:
                            return (ut = S._init), Tt(ut(S._payload), j, at, nt, q);
                    }
            }
        if (ut)
            return (
                (q = q(S)),
                (ut = nt === "" ? "." + Mt(S, 0) : nt),
                Y(q)
                    ? ((at = ""),
                      ut != null && (at = ut.replace(gt, "$&/") + "/"),
                      Tt(q, j, at, "", function (Vt) {
                          return Vt;
                      }))
                    : q != null &&
                      (P(q) &&
                          (q = st(
                              q,
                              at +
                                  (q.key == null || (S && S.key === q.key)
                                      ? ""
                                      : ("" + q.key).replace(gt, "$&/") + "/") +
                                  ut
                          )),
                      j.push(q)),
                1
            );
        ut = 0;
        var Zt = nt === "" ? "." : nt + ":";
        if (Y(S))
            for (var bt = 0; bt < S.length; bt++) (nt = S[bt]), (dt = Zt + Mt(nt, bt)), (ut += Tt(nt, j, at, dt, q));
        else if (((bt = E(S)), typeof bt == "function"))
            for (S = bt.call(S), bt = 0; !(nt = S.next()).done; )
                (nt = nt.value), (dt = Zt + Mt(nt, bt++)), (ut += Tt(nt, j, at, dt, q));
        else if (dt === "object") {
            if (typeof S.then == "function") return Tt(At(S), j, at, nt, q);
            throw (
                ((j = String(S)),
                Error(
                    "Objects are not valid as a React child (found: " +
                        (j === "[object Object]" ? "object with keys {" + Object.keys(S).join(", ") + "}" : j) +
                        "). If you meant to render a collection of children, use an array instead."
                ))
            );
        }
        return ut;
    }
    function F(S, j, at) {
        if (S == null) return S;
        var nt = [],
            q = 0;
        return (
            Tt(S, nt, "", "", function (dt) {
                return j.call(at, dt, q++);
            }),
            nt
        );
    }
    function J(S) {
        if (S._status === -1) {
            var j = S._result;
            (j = j()),
                j.then(
                    function (at) {
                        (S._status === 0 || S._status === -1) && ((S._status = 1), (S._result = at));
                    },
                    function (at) {
                        (S._status === 0 || S._status === -1) && ((S._status = 2), (S._result = at));
                    }
                ),
                S._status === -1 && ((S._status = 0), (S._result = j));
        }
        if (S._status === 1) return S._result.default;
        throw S._result;
    }
    var I =
        typeof reportError == "function"
            ? reportError
            : function (S) {
                  if (typeof window == "object" && typeof window.ErrorEvent == "function") {
                      var j = new window.ErrorEvent("error", {
                          bubbles: !0,
                          cancelable: !0,
                          message:
                              typeof S == "object" && S !== null && typeof S.message == "string"
                                  ? String(S.message)
                                  : String(S),
                          error: S,
                      });
                      if (!window.dispatchEvent(j)) return;
                  } else if (typeof process == "object" && typeof process.emit == "function") {
                      process.emit("uncaughtException", S);
                      return;
                  }
                  console.error(S);
              };
    function rt() {}
    return (
        (ot.Children = {
            map: F,
            forEach: function (S, j, at) {
                F(
                    S,
                    function () {
                        j.apply(this, arguments);
                    },
                    at
                );
            },
            count: function (S) {
                var j = 0;
                return (
                    F(S, function () {
                        j++;
                    }),
                    j
                );
            },
            toArray: function (S) {
                return (
                    F(S, function (j) {
                        return j;
                    }) || []
                );
            },
            only: function (S) {
                if (!P(S)) throw Error("React.Children.only expected to receive a single React element child.");
                return S;
            },
        }),
        (ot.Component = _),
        (ot.Fragment = o),
        (ot.Profiler = c),
        (ot.PureComponent = U),
        (ot.StrictMode = r),
        (ot.Suspense = g),
        (ot.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = R),
        (ot.act = function () {
            throw Error("act(...) is not supported in production builds of React.");
        }),
        (ot.cache = function (S) {
            return function () {
                return S.apply(null, arguments);
            };
        }),
        (ot.cloneElement = function (S, j, at) {
            if (S == null) throw Error("The argument must be a React element, but you passed " + S + ".");
            var nt = H({}, S.props),
                q = S.key,
                dt = void 0;
            if (j != null)
                for (ut in (j.ref !== void 0 && (dt = void 0), j.key !== void 0 && (q = "" + j.key), j))
                    !k.call(j, ut) ||
                        ut === "key" ||
                        ut === "__self" ||
                        ut === "__source" ||
                        (ut === "ref" && j.ref === void 0) ||
                        (nt[ut] = j[ut]);
            var ut = arguments.length - 2;
            if (ut === 1) nt.children = at;
            else if (1 < ut) {
                for (var Zt = Array(ut), bt = 0; bt < ut; bt++) Zt[bt] = arguments[bt + 2];
                nt.children = Zt;
            }
            return X(S.type, q, void 0, void 0, dt, nt);
        }),
        (ot.createContext = function (S) {
            return (
                (S = {
                    $$typeof: h,
                    _currentValue: S,
                    _currentValue2: S,
                    _threadCount: 0,
                    Provider: null,
                    Consumer: null,
                }),
                (S.Provider = S),
                (S.Consumer = { $$typeof: f, _context: S }),
                S
            );
        }),
        (ot.createElement = function (S, j, at) {
            var nt,
                q = {},
                dt = null;
            if (j != null)
                for (nt in (j.key !== void 0 && (dt = "" + j.key), j))
                    k.call(j, nt) && nt !== "key" && nt !== "__self" && nt !== "__source" && (q[nt] = j[nt]);
            var ut = arguments.length - 2;
            if (ut === 1) q.children = at;
            else if (1 < ut) {
                for (var Zt = Array(ut), bt = 0; bt < ut; bt++) Zt[bt] = arguments[bt + 2];
                q.children = Zt;
            }
            if (S && S.defaultProps) for (nt in ((ut = S.defaultProps), ut)) q[nt] === void 0 && (q[nt] = ut[nt]);
            return X(S, dt, void 0, void 0, null, q);
        }),
        (ot.createRef = function () {
            return { current: null };
        }),
        (ot.forwardRef = function (S) {
            return { $$typeof: m, render: S };
        }),
        (ot.isValidElement = P),
        (ot.lazy = function (S) {
            return { $$typeof: p, _payload: { _status: -1, _result: S }, _init: J };
        }),
        (ot.memo = function (S, j) {
            return { $$typeof: v, type: S, compare: j === void 0 ? null : j };
        }),
        (ot.startTransition = function (S) {
            var j = R.T,
                at = {};
            R.T = at;
            try {
                var nt = S(),
                    q = R.S;
                q !== null && q(at, nt),
                    typeof nt == "object" && nt !== null && typeof nt.then == "function" && nt.then(rt, I);
            } catch (dt) {
                I(dt);
            } finally {
                R.T = j;
            }
        }),
        (ot.unstable_useCacheRefresh = function () {
            return R.H.useCacheRefresh();
        }),
        (ot.use = function (S) {
            return R.H.use(S);
        }),
        (ot.useActionState = function (S, j, at) {
            return R.H.useActionState(S, j, at);
        }),
        (ot.useCallback = function (S, j) {
            return R.H.useCallback(S, j);
        }),
        (ot.useContext = function (S) {
            return R.H.useContext(S);
        }),
        (ot.useDebugValue = function () {}),
        (ot.useDeferredValue = function (S, j) {
            return R.H.useDeferredValue(S, j);
        }),
        (ot.useEffect = function (S, j) {
            return R.H.useEffect(S, j);
        }),
        (ot.useId = function () {
            return R.H.useId();
        }),
        (ot.useImperativeHandle = function (S, j, at) {
            return R.H.useImperativeHandle(S, j, at);
        }),
        (ot.useInsertionEffect = function (S, j) {
            return R.H.useInsertionEffect(S, j);
        }),
        (ot.useLayoutEffect = function (S, j) {
            return R.H.useLayoutEffect(S, j);
        }),
        (ot.useMemo = function (S, j) {
            return R.H.useMemo(S, j);
        }),
        (ot.useOptimistic = function (S, j) {
            return R.H.useOptimistic(S, j);
        }),
        (ot.useReducer = function (S, j, at) {
            return R.H.useReducer(S, j, at);
        }),
        (ot.useRef = function (S) {
            return R.H.useRef(S);
        }),
        (ot.useState = function (S) {
            return R.H.useState(S);
        }),
        (ot.useSyncExternalStore = function (S, j, at) {
            return R.H.useSyncExternalStore(S, j, at);
        }),
        (ot.useTransition = function () {
            return R.H.useTransition();
        }),
        (ot.version = "19.0.2"),
        ot
    );
}
var M0;
function hc() {
    return M0 || ((M0 = 1), (Bs.exports = z6())), Bs.exports;
}
var Ds = { exports: {} },
    ae = {};
var R0;
function G6() {
    if (R0) return ae;
    R0 = 1;
    var a = hc();
    function i(g) {
        var v = "https://react.dev/errors/" + g;
        if (1 < arguments.length) {
            v += "?args[]=" + encodeURIComponent(arguments[1]);
            for (var p = 2; p < arguments.length; p++) v += "&args[]=" + encodeURIComponent(arguments[p]);
        }
        return (
            "Minified React error #" +
            g +
            "; visit " +
            v +
            " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
        );
    }
    function o() {}
    var r = {
            d: {
                f: o,
                r: function () {
                    throw Error(i(522));
                },
                D: o,
                C: o,
                L: o,
                m: o,
                X: o,
                S: o,
                M: o,
            },
            p: 0,
            findDOMNode: null,
        },
        c = Symbol.for("react.portal");
    function f(g, v, p) {
        var A = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
        return { $$typeof: c, key: A == null ? null : "" + A, children: g, containerInfo: v, implementation: p };
    }
    var h = a.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
    function m(g, v) {
        if (g === "font") return "";
        if (typeof v == "string") return v === "use-credentials" ? v : "";
    }
    return (
        (ae.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = r),
        (ae.createPortal = function (g, v) {
            var p = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
            if (!v || (v.nodeType !== 1 && v.nodeType !== 9 && v.nodeType !== 11)) throw Error(i(299));
            return f(g, v, null, p);
        }),
        (ae.flushSync = function (g) {
            var v = h.T,
                p = r.p;
            try {
                if (((h.T = null), (r.p = 2), g)) return g();
            } finally {
                (h.T = v), (r.p = p), r.d.f();
            }
        }),
        (ae.preconnect = function (g, v) {
            typeof g == "string" &&
                (v
                    ? ((v = v.crossOrigin), (v = typeof v == "string" ? (v === "use-credentials" ? v : "") : void 0))
                    : (v = null),
                r.d.C(g, v));
        }),
        (ae.prefetchDNS = function (g) {
            typeof g == "string" && r.d.D(g);
        }),
        (ae.preinit = function (g, v) {
            if (typeof g == "string" && v && typeof v.as == "string") {
                var p = v.as,
                    A = m(p, v.crossOrigin),
                    E = typeof v.integrity == "string" ? v.integrity : void 0,
                    x = typeof v.fetchPriority == "string" ? v.fetchPriority : void 0;
                p === "style"
                    ? r.d.S(g, typeof v.precedence == "string" ? v.precedence : void 0, {
                          crossOrigin: A,
                          integrity: E,
                          fetchPriority: x,
                      })
                    : p === "script" &&
                      r.d.X(g, {
                          crossOrigin: A,
                          integrity: E,
                          fetchPriority: x,
                          nonce: typeof v.nonce == "string" ? v.nonce : void 0,
                      });
            }
        }),
        (ae.preinitModule = function (g, v) {
            if (typeof g == "string")
                if (typeof v == "object" && v !== null) {
                    if (v.as == null || v.as === "script") {
                        var p = m(v.as, v.crossOrigin);
                        r.d.M(g, {
                            crossOrigin: p,
                            integrity: typeof v.integrity == "string" ? v.integrity : void 0,
                            nonce: typeof v.nonce == "string" ? v.nonce : void 0,
                        });
                    }
                } else v == null && r.d.M(g);
        }),
        (ae.preload = function (g, v) {
            if (typeof g == "string" && typeof v == "object" && v !== null && typeof v.as == "string") {
                var p = v.as,
                    A = m(p, v.crossOrigin);
                r.d.L(g, p, {
                    crossOrigin: A,
                    integrity: typeof v.integrity == "string" ? v.integrity : void 0,
                    nonce: typeof v.nonce == "string" ? v.nonce : void 0,
                    type: typeof v.type == "string" ? v.type : void 0,
                    fetchPriority: typeof v.fetchPriority == "string" ? v.fetchPriority : void 0,
                    referrerPolicy: typeof v.referrerPolicy == "string" ? v.referrerPolicy : void 0,
                    imageSrcSet: typeof v.imageSrcSet == "string" ? v.imageSrcSet : void 0,
                    imageSizes: typeof v.imageSizes == "string" ? v.imageSizes : void 0,
                    media: typeof v.media == "string" ? v.media : void 0,
                });
            }
        }),
        (ae.preloadModule = function (g, v) {
            if (typeof g == "string")
                if (v) {
                    var p = m(v.as, v.crossOrigin);
                    r.d.m(g, {
                        as: typeof v.as == "string" && v.as !== "script" ? v.as : void 0,
                        crossOrigin: p,
                        integrity: typeof v.integrity == "string" ? v.integrity : void 0,
                    });
                } else r.d.m(g);
        }),
        (ae.requestFormReset = function (g) {
            r.d.r(g);
        }),
        (ae.unstable_batchedUpdates = function (g, v) {
            return g(v);
        }),
        (ae.useFormState = function (g, v, p) {
            return h.H.useFormState(g, v, p);
        }),
        (ae.useFormStatus = function () {
            return h.H.useHostTransitionStatus();
        }),
        (ae.version = "19.0.2"),
        ae
    );
}
var w0;
function U3() {
    if (w0) return Ds.exports;
    w0 = 1;
    function a() {
        if (
            !(
                typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" ||
                typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"
            )
        )
            try {
                __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(a);
            } catch (i) {
                console.error(i);
            }
    }
    return a(), (Ds.exports = G6()), Ds.exports;
}
var O0;
function Q6() {
    if (O0) return gi;
    O0 = 1;
    var a = V6(),
        i = hc(),
        o = U3();
    function r(t) {
        var e = "https://react.dev/errors/" + t;
        if (1 < arguments.length) {
            e += "?args[]=" + encodeURIComponent(arguments[1]);
            for (var n = 2; n < arguments.length; n++) e += "&args[]=" + encodeURIComponent(arguments[n]);
        }
        return (
            "Minified React error #" +
            t +
            "; visit " +
            e +
            " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
        );
    }
    function c(t) {
        return !(!t || (t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11));
    }
    var f = Symbol.for("react.element"),
        h = Symbol.for("react.transitional.element"),
        m = Symbol.for("react.portal"),
        g = Symbol.for("react.fragment"),
        v = Symbol.for("react.strict_mode"),
        p = Symbol.for("react.profiler"),
        A = Symbol.for("react.provider"),
        E = Symbol.for("react.consumer"),
        x = Symbol.for("react.context"),
        H = Symbol.for("react.forward_ref"),
        D = Symbol.for("react.suspense"),
        _ = Symbol.for("react.suspense_list"),
        V = Symbol.for("react.memo"),
        U = Symbol.for("react.lazy"),
        Q = Symbol.for("react.offscreen"),
        Y = Symbol.for("react.memo_cache_sentinel"),
        R = Symbol.iterator;
    function k(t) {
        return t === null || typeof t != "object"
            ? null
            : ((t = (R && t[R]) || t["@@iterator"]), typeof t == "function" ? t : null);
    }
    var X = Symbol.for("react.client.reference");
    function st(t) {
        if (t == null) return null;
        if (typeof t == "function") return t.$$typeof === X ? null : t.displayName || t.name || null;
        if (typeof t == "string") return t;
        switch (t) {
            case g:
                return "Fragment";
            case m:
                return "Portal";
            case p:
                return "Profiler";
            case v:
                return "StrictMode";
            case D:
                return "Suspense";
            case _:
                return "SuspenseList";
        }
        if (typeof t == "object")
            switch (t.$$typeof) {
                case x:
                    return (t.displayName || "Context") + ".Provider";
                case E:
                    return (t._context.displayName || "Context") + ".Consumer";
                case H:
                    var e = t.render;
                    return (
                        (t = t.displayName),
                        t ||
                            ((t = e.displayName || e.name || ""),
                            (t = t !== "" ? "ForwardRef(" + t + ")" : "ForwardRef")),
                        t
                    );
                case V:
                    return (e = t.displayName || null), e !== null ? e : st(t.type) || "Memo";
                case U:
                    (e = t._payload), (t = t._init);
                    try {
                        return st(t(e));
                    } catch {}
            }
        return null;
    }
    var P = i.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
        K = Object.assign,
        gt,
        Mt;
    function Et(t) {
        if (gt === void 0)
            try {
                throw Error();
            } catch (n) {
                var e = n.stack.trim().match(/\n( *(at )?)/);
                (gt = (e && e[1]) || ""),
                    (Mt =
                        -1 <
                        n.stack.indexOf(`
    at`)
                            ? " (<anonymous>)"
                            : -1 < n.stack.indexOf("@")
                              ? "@unknown:0:0"
                              : "");
            }
        return (
            `
` +
            gt +
            t +
            Mt
        );
    }
    var At = !1;
    function Tt(t, e) {
        if (!t || At) return "";
        At = !0;
        var n = Error.prepareStackTrace;
        Error.prepareStackTrace = void 0;
        try {
            var l = {
                DetermineComponentFrameRoot: function () {
                    try {
                        if (e) {
                            var Z = function () {
                                throw Error();
                            };
                            if (
                                (Object.defineProperty(Z.prototype, "props", {
                                    set: function () {
                                        throw Error();
                                    },
                                }),
                                typeof Reflect == "object" && Reflect.construct)
                            ) {
                                try {
                                    Reflect.construct(Z, []);
                                } catch (N) {
                                    var B = N;
                                }
                                Reflect.construct(t, [], Z);
                            } else {
                                try {
                                    Z.call();
                                } catch (N) {
                                    B = N;
                                }
                                t.call(Z.prototype);
                            }
                        } else {
                            try {
                                throw Error();
                            } catch (N) {
                                B = N;
                            }
                            (Z = t()) && typeof Z.catch == "function" && Z.catch(function () {});
                        }
                    } catch (N) {
                        if (N && B && typeof N.stack == "string") return [N.stack, B.stack];
                    }
                    return [null, null];
                },
            };
            l.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
            var u = Object.getOwnPropertyDescriptor(l.DetermineComponentFrameRoot, "name");
            u &&
                u.configurable &&
                Object.defineProperty(l.DetermineComponentFrameRoot, "name", { value: "DetermineComponentFrameRoot" });
            var s = l.DetermineComponentFrameRoot(),
                d = s[0],
                y = s[1];
            if (d && y) {
                var b = d.split(`
`),
                    M = y.split(`
`);
                for (u = l = 0; l < b.length && !b[l].includes("DetermineComponentFrameRoot"); ) l++;
                for (; u < M.length && !M[u].includes("DetermineComponentFrameRoot"); ) u++;
                if (l === b.length || u === M.length)
                    for (l = b.length - 1, u = M.length - 1; 1 <= l && 0 <= u && b[l] !== M[u]; ) u--;
                for (; 1 <= l && 0 <= u; l--, u--)
                    if (b[l] !== M[u]) {
                        if (l !== 1 || u !== 1)
                            do
                                if ((l--, u--, 0 > u || b[l] !== M[u])) {
                                    var L =
                                        `
` + b[l].replace(" at new ", " at ");
                                    return (
                                        t.displayName &&
                                            L.includes("<anonymous>") &&
                                            (L = L.replace("<anonymous>", t.displayName)),
                                        L
                                    );
                                }
                            while (1 <= l && 0 <= u);
                        break;
                    }
            }
        } finally {
            (At = !1), (Error.prepareStackTrace = n);
        }
        return (n = t ? t.displayName || t.name : "") ? Et(n) : "";
    }
    function F(t) {
        switch (t.tag) {
            case 26:
            case 27:
            case 5:
                return Et(t.type);
            case 16:
                return Et("Lazy");
            case 13:
                return Et("Suspense");
            case 19:
                return Et("SuspenseList");
            case 0:
            case 15:
                return (t = Tt(t.type, !1)), t;
            case 11:
                return (t = Tt(t.type.render, !1)), t;
            case 1:
                return (t = Tt(t.type, !0)), t;
            default:
                return "";
        }
    }
    function J(t) {
        try {
            var e = "";
            do (e += F(t)), (t = t.return);
            while (t);
            return e;
        } catch (n) {
            return (
                `
Error generating stack: ` +
                n.message +
                `
` +
                n.stack
            );
        }
    }
    function I(t) {
        var e = t,
            n = t;
        if (t.alternate) for (; e.return; ) e = e.return;
        else {
            t = e;
            do (e = t), (e.flags & 4098) !== 0 && (n = e.return), (t = e.return);
            while (t);
        }
        return e.tag === 3 ? n : null;
    }
    function rt(t) {
        if (t.tag === 13) {
            var e = t.memoizedState;
            if ((e === null && ((t = t.alternate), t !== null && (e = t.memoizedState)), e !== null))
                return e.dehydrated;
        }
        return null;
    }
    function S(t) {
        if (I(t) !== t) throw Error(r(188));
    }
    function j(t) {
        var e = t.alternate;
        if (!e) {
            if (((e = I(t)), e === null)) throw Error(r(188));
            return e !== t ? null : t;
        }
        for (var n = t, l = e; ; ) {
            var u = n.return;
            if (u === null) break;
            var s = u.alternate;
            if (s === null) {
                if (((l = u.return), l !== null)) {
                    n = l;
                    continue;
                }
                break;
            }
            if (u.child === s.child) {
                for (s = u.child; s; ) {
                    if (s === n) return S(u), t;
                    if (s === l) return S(u), e;
                    s = s.sibling;
                }
                throw Error(r(188));
            }
            if (n.return !== l.return) (n = u), (l = s);
            else {
                for (var d = !1, y = u.child; y; ) {
                    if (y === n) {
                        (d = !0), (n = u), (l = s);
                        break;
                    }
                    if (y === l) {
                        (d = !0), (l = u), (n = s);
                        break;
                    }
                    y = y.sibling;
                }
                if (!d) {
                    for (y = s.child; y; ) {
                        if (y === n) {
                            (d = !0), (n = s), (l = u);
                            break;
                        }
                        if (y === l) {
                            (d = !0), (l = s), (n = u);
                            break;
                        }
                        y = y.sibling;
                    }
                    if (!d) throw Error(r(189));
                }
            }
            if (n.alternate !== l) throw Error(r(190));
        }
        if (n.tag !== 3) throw Error(r(188));
        return n.stateNode.current === n ? t : e;
    }
    function at(t) {
        var e = t.tag;
        if (e === 5 || e === 26 || e === 27 || e === 6) return t;
        for (t = t.child; t !== null; ) {
            if (((e = at(t)), e !== null)) return e;
            t = t.sibling;
        }
        return null;
    }
    var nt = Array.isArray,
        q = o.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
        dt = { pending: !1, data: null, method: null, action: null },
        ut = [],
        Zt = -1;
    function bt(t) {
        return { current: t };
    }
    function Vt(t) {
        0 > Zt || ((t.current = ut[Zt]), (ut[Zt] = null), Zt--);
    }
    function Bt(t, e) {
        Zt++, (ut[Zt] = t.current), (t.current = e);
    }
    var be = bt(null),
        Wn = bt(null),
        ce = bt(null),
        Di = bt(null);
    function _i(t, e) {
        switch ((Bt(ce, e), Bt(Wn, t), Bt(be, null), (t = e.nodeType), t)) {
            case 9:
            case 11:
                e = (e = e.documentElement) && (e = e.namespaceURI) ? K2(e) : 0;
                break;
            default:
                if (((t = t === 8 ? e.parentNode : e), (e = t.tagName), (t = t.namespaceURI)))
                    (t = K2(t)), (e = W2(t, e));
                else
                    switch (e) {
                        case "svg":
                            e = 1;
                            break;
                        case "math":
                            e = 2;
                            break;
                        default:
                            e = 0;
                    }
        }
        Vt(be), Bt(be, e);
    }
    function Oa() {
        Vt(be), Vt(Wn), Vt(ce);
    }
    function pu(t) {
        t.memoizedState !== null && Bt(Di, t);
        var e = be.current,
            n = W2(e, t.type);
        e !== n && (Bt(Wn, t), Bt(be, n));
    }
    function Ni(t) {
        Wn.current === t && (Vt(be), Vt(Wn)), Di.current === t && (Vt(Di), (ci._currentValue = dt));
    }
    var yu = Object.prototype.hasOwnProperty,
        Au = a.unstable_scheduleCallback,
        bu = a.unstable_cancelCallback,
        f4 = a.unstable_shouldYield,
        h4 = a.unstable_requestPaint,
        Ze = a.unstable_now,
        d4 = a.unstable_getCurrentPriorityLevel,
        zc = a.unstable_ImmediatePriority,
        Gc = a.unstable_UserBlockingPriority,
        Li = a.unstable_NormalPriority,
        m4 = a.unstable_LowPriority,
        Qc = a.unstable_IdlePriority,
        v4 = a.log,
        g4 = a.unstable_setDisableYieldValue,
        Al = null,
        fe = null;
    function p4(t) {
        if (fe && typeof fe.onCommitFiberRoot == "function")
            try {
                fe.onCommitFiberRoot(Al, t, void 0, (t.current.flags & 128) === 128);
            } catch {}
    }
    function Sn(t) {
        if ((typeof v4 == "function" && g4(t), fe && typeof fe.setStrictMode == "function"))
            try {
                fe.setStrictMode(Al, t);
            } catch {}
    }
    var he = Math.clz32 ? Math.clz32 : b4,
        y4 = Math.log,
        A4 = Math.LN2;
    function b4(t) {
        return (t >>>= 0), t === 0 ? 32 : (31 - ((y4(t) / A4) | 0)) | 0;
    }
    var Ui = 128,
        Vi = 4194304;
    function Jn(t) {
        var e = t & 42;
        if (e !== 0) return e;
        switch (t & -t) {
            case 1:
                return 1;
            case 2:
                return 2;
            case 4:
                return 4;
            case 8:
                return 8;
            case 16:
                return 16;
            case 32:
                return 32;
            case 64:
                return 64;
            case 128:
            case 256:
            case 512:
            case 1024:
            case 2048:
            case 4096:
            case 8192:
            case 16384:
            case 32768:
            case 65536:
            case 131072:
            case 262144:
            case 524288:
            case 1048576:
            case 2097152:
                return t & 4194176;
            case 4194304:
            case 8388608:
            case 16777216:
            case 33554432:
                return t & 62914560;
            case 67108864:
                return 67108864;
            case 134217728:
                return 134217728;
            case 268435456:
                return 268435456;
            case 536870912:
                return 536870912;
            case 1073741824:
                return 0;
            default:
                return t;
        }
    }
    function zi(t, e) {
        var n = t.pendingLanes;
        if (n === 0) return 0;
        var l = 0,
            u = t.suspendedLanes,
            s = t.pingedLanes,
            d = t.warmLanes;
        t = t.finishedLanes !== 0;
        var y = n & 134217727;
        return (
            y !== 0
                ? ((n = y & ~u),
                  n !== 0
                      ? (l = Jn(n))
                      : ((s &= y), s !== 0 ? (l = Jn(s)) : t || ((d = y & ~d), d !== 0 && (l = Jn(d)))))
                : ((y = n & ~u),
                  y !== 0 ? (l = Jn(y)) : s !== 0 ? (l = Jn(s)) : t || ((d = n & ~d), d !== 0 && (l = Jn(d)))),
            l === 0
                ? 0
                : e !== 0 &&
                    e !== l &&
                    (e & u) === 0 &&
                    ((u = l & -l), (d = e & -e), u >= d || (u === 32 && (d & 4194176) !== 0))
                  ? e
                  : l
        );
    }
    function bl(t, e) {
        return (t.pendingLanes & ~(t.suspendedLanes & ~t.pingedLanes) & e) === 0;
    }
    function E4(t, e) {
        switch (t) {
            case 1:
            case 2:
            case 4:
            case 8:
                return e + 250;
            case 16:
            case 32:
            case 64:
            case 128:
            case 256:
            case 512:
            case 1024:
            case 2048:
            case 4096:
            case 8192:
            case 16384:
            case 32768:
            case 65536:
            case 131072:
            case 262144:
            case 524288:
            case 1048576:
            case 2097152:
                return e + 5e3;
            case 4194304:
            case 8388608:
            case 16777216:
            case 33554432:
                return -1;
            case 67108864:
            case 134217728:
            case 268435456:
            case 536870912:
            case 1073741824:
                return -1;
            default:
                return -1;
        }
    }
    function Zc() {
        var t = Ui;
        return (Ui <<= 1), (Ui & 4194176) === 0 && (Ui = 128), t;
    }
    function jc() {
        var t = Vi;
        return (Vi <<= 1), (Vi & 62914560) === 0 && (Vi = 4194304), t;
    }
    function Eu(t) {
        for (var e = [], n = 0; 31 > n; n++) e.push(t);
        return e;
    }
    function El(t, e) {
        (t.pendingLanes |= e), e !== 268435456 && ((t.suspendedLanes = 0), (t.pingedLanes = 0), (t.warmLanes = 0));
    }
    function S4(t, e, n, l, u, s) {
        var d = t.pendingLanes;
        (t.pendingLanes = n),
            (t.suspendedLanes = 0),
            (t.pingedLanes = 0),
            (t.warmLanes = 0),
            (t.expiredLanes &= n),
            (t.entangledLanes &= n),
            (t.errorRecoveryDisabledLanes &= n),
            (t.shellSuspendCounter = 0);
        var y = t.entanglements,
            b = t.expirationTimes,
            M = t.hiddenUpdates;
        for (n = d & ~n; 0 < n; ) {
            var L = 31 - he(n),
                Z = 1 << L;
            (y[L] = 0), (b[L] = -1);
            var B = M[L];
            if (B !== null)
                for (M[L] = null, L = 0; L < B.length; L++) {
                    var N = B[L];
                    N !== null && (N.lane &= -536870913);
                }
            n &= ~Z;
        }
        l !== 0 && Fc(t, l, 0), s !== 0 && u === 0 && t.tag !== 0 && (t.suspendedLanes |= s & ~(d & ~e));
    }
    function Fc(t, e, n) {
        (t.pendingLanes |= e), (t.suspendedLanes &= ~e);
        var l = 31 - he(e);
        (t.entangledLanes |= e), (t.entanglements[l] = t.entanglements[l] | 1073741824 | (n & 4194218));
    }
    function Yc(t, e) {
        var n = (t.entangledLanes |= e);
        for (t = t.entanglements; n; ) {
            var l = 31 - he(n),
                u = 1 << l;
            (u & e) | (t[l] & e) && (t[l] |= e), (n &= ~u);
        }
    }
    function Ic(t) {
        return (t &= -t), 2 < t ? (8 < t ? ((t & 134217727) !== 0 ? 32 : 268435456) : 8) : 2;
    }
    function Pc() {
        var t = q.p;
        return t !== 0 ? t : ((t = window.event), t === void 0 ? 32 : v0(t.type));
    }
    function C4(t, e) {
        var n = q.p;
        try {
            return (q.p = t), e();
        } finally {
            q.p = n;
        }
    }
    var Cn = Math.random().toString(36).slice(2),
        ee = "__reactFiber$" + Cn,
        ue = "__reactProps$" + Cn,
        Ha = "__reactContainer$" + Cn,
        Su = "__reactEvents$" + Cn,
        T4 = "__reactListeners$" + Cn,
        x4 = "__reactHandles$" + Cn,
        kc = "__reactResources$" + Cn,
        Sl = "__reactMarker$" + Cn;
    function Cu(t) {
        delete t[ee], delete t[ue], delete t[Su], delete t[T4], delete t[x4];
    }
    function $n(t) {
        var e = t[ee];
        if (e) return e;
        for (var n = t.parentNode; n; ) {
            if ((e = n[Ha] || n[ee])) {
                if (((n = e.alternate), e.child !== null || (n !== null && n.child !== null)))
                    for (t = t0(t); t !== null; ) {
                        if ((n = t[ee])) return n;
                        t = t0(t);
                    }
                return e;
            }
            (t = n), (n = t.parentNode);
        }
        return null;
    }
    function Ba(t) {
        if ((t = t[ee] || t[Ha])) {
            var e = t.tag;
            if (e === 5 || e === 6 || e === 13 || e === 26 || e === 27 || e === 3) return t;
        }
        return null;
    }
    function Cl(t) {
        var e = t.tag;
        if (e === 5 || e === 26 || e === 27 || e === 6) return t.stateNode;
        throw Error(r(33));
    }
    function Da(t) {
        var e = t[kc];
        return e || (e = t[kc] = { hoistableStyles: new Map(), hoistableScripts: new Map() }), e;
    }
    function Xt(t) {
        t[Sl] = !0;
    }
    var Xc = new Set(),
        qc = {};
    function ta(t, e) {
        _a(t, e), _a(t + "Capture", e);
    }
    function _a(t, e) {
        for (qc[t] = e, t = 0; t < e.length; t++) Xc.add(e[t]);
    }
    var en = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"),
        M4 = RegExp(
            "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
        ),
        Kc = {},
        Wc = {};
    function R4(t) {
        return yu.call(Wc, t) ? !0 : yu.call(Kc, t) ? !1 : M4.test(t) ? (Wc[t] = !0) : ((Kc[t] = !0), !1);
    }
    function Gi(t, e, n) {
        if (R4(e))
            if (n === null) t.removeAttribute(e);
            else {
                switch (typeof n) {
                    case "undefined":
                    case "function":
                    case "symbol":
                        t.removeAttribute(e);
                        return;
                    case "boolean":
                        var l = e.toLowerCase().slice(0, 5);
                        if (l !== "data-" && l !== "aria-") {
                            t.removeAttribute(e);
                            return;
                        }
                }
                t.setAttribute(e, "" + n);
            }
    }
    function Qi(t, e, n) {
        if (n === null) t.removeAttribute(e);
        else {
            switch (typeof n) {
                case "undefined":
                case "function":
                case "symbol":
                case "boolean":
                    t.removeAttribute(e);
                    return;
            }
            t.setAttribute(e, "" + n);
        }
    }
    function nn(t, e, n, l) {
        if (l === null) t.removeAttribute(n);
        else {
            switch (typeof l) {
                case "undefined":
                case "function":
                case "symbol":
                case "boolean":
                    t.removeAttribute(n);
                    return;
            }
            t.setAttributeNS(e, n, "" + l);
        }
    }
    function Ee(t) {
        switch (typeof t) {
            case "bigint":
            case "boolean":
            case "number":
            case "string":
            case "undefined":
                return t;
            case "object":
                return t;
            default:
                return "";
        }
    }
    function Jc(t) {
        var e = t.type;
        return (t = t.nodeName) && t.toLowerCase() === "input" && (e === "checkbox" || e === "radio");
    }
    function w4(t) {
        var e = Jc(t) ? "checked" : "value",
            n = Object.getOwnPropertyDescriptor(t.constructor.prototype, e),
            l = "" + t[e];
        if (!t.hasOwnProperty(e) && typeof n < "u" && typeof n.get == "function" && typeof n.set == "function") {
            var u = n.get,
                s = n.set;
            return (
                Object.defineProperty(t, e, {
                    configurable: !0,
                    get: function () {
                        return u.call(this);
                    },
                    set: function (d) {
                        (l = "" + d), s.call(this, d);
                    },
                }),
                Object.defineProperty(t, e, { enumerable: n.enumerable }),
                {
                    getValue: function () {
                        return l;
                    },
                    setValue: function (d) {
                        l = "" + d;
                    },
                    stopTracking: function () {
                        (t._valueTracker = null), delete t[e];
                    },
                }
            );
        }
    }
    function Zi(t) {
        t._valueTracker || (t._valueTracker = w4(t));
    }
    function $c(t) {
        if (!t) return !1;
        var e = t._valueTracker;
        if (!e) return !0;
        var n = e.getValue(),
            l = "";
        return t && (l = Jc(t) ? (t.checked ? "true" : "false") : t.value), (t = l), t !== n ? (e.setValue(t), !0) : !1;
    }
    function ji(t) {
        if (((t = t || (typeof document < "u" ? document : void 0)), typeof t > "u")) return null;
        try {
            return t.activeElement || t.body;
        } catch {
            return t.body;
        }
    }
    var O4 = /[\n"\\]/g;
    function Se(t) {
        return t.replace(O4, function (e) {
            return "\\" + e.charCodeAt(0).toString(16) + " ";
        });
    }
    function Tu(t, e, n, l, u, s, d, y) {
        (t.name = ""),
            d != null && typeof d != "function" && typeof d != "symbol" && typeof d != "boolean"
                ? (t.type = d)
                : t.removeAttribute("type"),
            e != null
                ? d === "number"
                    ? ((e === 0 && t.value === "") || t.value != e) && (t.value = "" + Ee(e))
                    : t.value !== "" + Ee(e) && (t.value = "" + Ee(e))
                : (d !== "submit" && d !== "reset") || t.removeAttribute("value"),
            e != null ? xu(t, d, Ee(e)) : n != null ? xu(t, d, Ee(n)) : l != null && t.removeAttribute("value"),
            u == null && s != null && (t.defaultChecked = !!s),
            u != null && (t.checked = u && typeof u != "function" && typeof u != "symbol"),
            y != null && typeof y != "function" && typeof y != "symbol" && typeof y != "boolean"
                ? (t.name = "" + Ee(y))
                : t.removeAttribute("name");
    }
    function t1(t, e, n, l, u, s, d, y) {
        if (
            (s != null && typeof s != "function" && typeof s != "symbol" && typeof s != "boolean" && (t.type = s),
            e != null || n != null)
        ) {
            if (!((s !== "submit" && s !== "reset") || e != null)) return;
            (n = n != null ? "" + Ee(n) : ""),
                (e = e != null ? "" + Ee(e) : n),
                y || e === t.value || (t.value = e),
                (t.defaultValue = e);
        }
        (l = l ?? u),
            (l = typeof l != "function" && typeof l != "symbol" && !!l),
            (t.checked = y ? t.checked : !!l),
            (t.defaultChecked = !!l),
            d != null && typeof d != "function" && typeof d != "symbol" && typeof d != "boolean" && (t.name = d);
    }
    function xu(t, e, n) {
        (e === "number" && ji(t.ownerDocument) === t) || t.defaultValue === "" + n || (t.defaultValue = "" + n);
    }
    function Na(t, e, n, l) {
        if (((t = t.options), e)) {
            e = {};
            for (var u = 0; u < n.length; u++) e["$" + n[u]] = !0;
            for (n = 0; n < t.length; n++)
                (u = e.hasOwnProperty("$" + t[n].value)),
                    t[n].selected !== u && (t[n].selected = u),
                    u && l && (t[n].defaultSelected = !0);
        } else {
            for (n = "" + Ee(n), e = null, u = 0; u < t.length; u++) {
                if (t[u].value === n) {
                    (t[u].selected = !0), l && (t[u].defaultSelected = !0);
                    return;
                }
                e !== null || t[u].disabled || (e = t[u]);
            }
            e !== null && (e.selected = !0);
        }
    }
    function e1(t, e, n) {
        if (e != null && ((e = "" + Ee(e)), e !== t.value && (t.value = e), n == null)) {
            t.defaultValue !== e && (t.defaultValue = e);
            return;
        }
        t.defaultValue = n != null ? "" + Ee(n) : "";
    }
    function n1(t, e, n, l) {
        if (e == null) {
            if (l != null) {
                if (n != null) throw Error(r(92));
                if (nt(l)) {
                    if (1 < l.length) throw Error(r(93));
                    l = l[0];
                }
                n = l;
            }
            n == null && (n = ""), (e = n);
        }
        (n = Ee(e)), (t.defaultValue = n), (l = t.textContent), l === n && l !== "" && l !== null && (t.value = l);
    }
    function La(t, e) {
        if (e) {
            var n = t.firstChild;
            if (n && n === t.lastChild && n.nodeType === 3) {
                n.nodeValue = e;
                return;
            }
        }
        t.textContent = e;
    }
    var H4 = new Set(
        "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
            " "
        )
    );
    function a1(t, e, n) {
        var l = e.indexOf("--") === 0;
        n == null || typeof n == "boolean" || n === ""
            ? l
                ? t.setProperty(e, "")
                : e === "float"
                  ? (t.cssFloat = "")
                  : (t[e] = "")
            : l
              ? t.setProperty(e, n)
              : typeof n != "number" || n === 0 || H4.has(e)
                ? e === "float"
                    ? (t.cssFloat = n)
                    : (t[e] = ("" + n).trim())
                : (t[e] = n + "px");
    }
    function l1(t, e, n) {
        if (e != null && typeof e != "object") throw Error(r(62));
        if (((t = t.style), n != null)) {
            for (var l in n)
                !n.hasOwnProperty(l) ||
                    (e != null && e.hasOwnProperty(l)) ||
                    (l.indexOf("--") === 0 ? t.setProperty(l, "") : l === "float" ? (t.cssFloat = "") : (t[l] = ""));
            for (var u in e) (l = e[u]), e.hasOwnProperty(u) && n[u] !== l && a1(t, u, l);
        } else for (var s in e) e.hasOwnProperty(s) && a1(t, s, e[s]);
    }
    function Mu(t) {
        if (t.indexOf("-") === -1) return !1;
        switch (t) {
            case "annotation-xml":
            case "color-profile":
            case "font-face":
            case "font-face-src":
            case "font-face-uri":
            case "font-face-format":
            case "font-face-name":
            case "missing-glyph":
                return !1;
            default:
                return !0;
        }
    }
    var B4 = new Map([
            ["acceptCharset", "accept-charset"],
            ["htmlFor", "for"],
            ["httpEquiv", "http-equiv"],
            ["crossOrigin", "crossorigin"],
            ["accentHeight", "accent-height"],
            ["alignmentBaseline", "alignment-baseline"],
            ["arabicForm", "arabic-form"],
            ["baselineShift", "baseline-shift"],
            ["capHeight", "cap-height"],
            ["clipPath", "clip-path"],
            ["clipRule", "clip-rule"],
            ["colorInterpolation", "color-interpolation"],
            ["colorInterpolationFilters", "color-interpolation-filters"],
            ["colorProfile", "color-profile"],
            ["colorRendering", "color-rendering"],
            ["dominantBaseline", "dominant-baseline"],
            ["enableBackground", "enable-background"],
            ["fillOpacity", "fill-opacity"],
            ["fillRule", "fill-rule"],
            ["floodColor", "flood-color"],
            ["floodOpacity", "flood-opacity"],
            ["fontFamily", "font-family"],
            ["fontSize", "font-size"],
            ["fontSizeAdjust", "font-size-adjust"],
            ["fontStretch", "font-stretch"],
            ["fontStyle", "font-style"],
            ["fontVariant", "font-variant"],
            ["fontWeight", "font-weight"],
            ["glyphName", "glyph-name"],
            ["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
            ["glyphOrientationVertical", "glyph-orientation-vertical"],
            ["horizAdvX", "horiz-adv-x"],
            ["horizOriginX", "horiz-origin-x"],
            ["imageRendering", "image-rendering"],
            ["letterSpacing", "letter-spacing"],
            ["lightingColor", "lighting-color"],
            ["markerEnd", "marker-end"],
            ["markerMid", "marker-mid"],
            ["markerStart", "marker-start"],
            ["overlinePosition", "overline-position"],
            ["overlineThickness", "overline-thickness"],
            ["paintOrder", "paint-order"],
            ["panose-1", "panose-1"],
            ["pointerEvents", "pointer-events"],
            ["renderingIntent", "rendering-intent"],
            ["shapeRendering", "shape-rendering"],
            ["stopColor", "stop-color"],
            ["stopOpacity", "stop-opacity"],
            ["strikethroughPosition", "strikethrough-position"],
            ["strikethroughThickness", "strikethrough-thickness"],
            ["strokeDasharray", "stroke-dasharray"],
            ["strokeDashoffset", "stroke-dashoffset"],
            ["strokeLinecap", "stroke-linecap"],
            ["strokeLinejoin", "stroke-linejoin"],
            ["strokeMiterlimit", "stroke-miterlimit"],
            ["strokeOpacity", "stroke-opacity"],
            ["strokeWidth", "stroke-width"],
            ["textAnchor", "text-anchor"],
            ["textDecoration", "text-decoration"],
            ["textRendering", "text-rendering"],
            ["transformOrigin", "transform-origin"],
            ["underlinePosition", "underline-position"],
            ["underlineThickness", "underline-thickness"],
            ["unicodeBidi", "unicode-bidi"],
            ["unicodeRange", "unicode-range"],
            ["unitsPerEm", "units-per-em"],
            ["vAlphabetic", "v-alphabetic"],
            ["vHanging", "v-hanging"],
            ["vIdeographic", "v-ideographic"],
            ["vMathematical", "v-mathematical"],
            ["vectorEffect", "vector-effect"],
            ["vertAdvY", "vert-adv-y"],
            ["vertOriginX", "vert-origin-x"],
            ["vertOriginY", "vert-origin-y"],
            ["wordSpacing", "word-spacing"],
            ["writingMode", "writing-mode"],
            ["xmlnsXlink", "xmlns:xlink"],
            ["xHeight", "x-height"],
        ]),
        D4 =
            /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
    function Fi(t) {
        return D4.test("" + t)
            ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')"
            : t;
    }
    var Ru = null;
    function wu(t) {
        return (
            (t = t.target || t.srcElement || window),
            t.correspondingUseElement && (t = t.correspondingUseElement),
            t.nodeType === 3 ? t.parentNode : t
        );
    }
    var Ua = null,
        Va = null;
    function i1(t) {
        var e = Ba(t);
        if (e && (t = e.stateNode)) {
            var n = t[ue] || null;
            t: switch (((t = e.stateNode), e.type)) {
                case "input":
                    if (
                        (Tu(t, n.value, n.defaultValue, n.defaultValue, n.checked, n.defaultChecked, n.type, n.name),
                        (e = n.name),
                        n.type === "radio" && e != null)
                    ) {
                        for (n = t; n.parentNode; ) n = n.parentNode;
                        for (
                            n = n.querySelectorAll('input[name="' + Se("" + e) + '"][type="radio"]'), e = 0;
                            e < n.length;
                            e++
                        ) {
                            var l = n[e];
                            if (l !== t && l.form === t.form) {
                                var u = l[ue] || null;
                                if (!u) throw Error(r(90));
                                Tu(
                                    l,
                                    u.value,
                                    u.defaultValue,
                                    u.defaultValue,
                                    u.checked,
                                    u.defaultChecked,
                                    u.type,
                                    u.name
                                );
                            }
                        }
                        for (e = 0; e < n.length; e++) (l = n[e]), l.form === t.form && $c(l);
                    }
                    break t;
                case "textarea":
                    e1(t, n.value, n.defaultValue);
                    break t;
                case "select":
                    (e = n.value), e != null && Na(t, !!n.multiple, e, !1);
            }
        }
    }
    var Ou = !1;
    function r1(t, e, n) {
        if (Ou) return t(e, n);
        Ou = !0;
        try {
            var l = t(e);
            return l;
        } finally {
            if (
                ((Ou = !1),
                (Ua !== null || Va !== null) && (Mr(), Ua && ((e = Ua), (t = Va), (Va = Ua = null), i1(e), t)))
            )
                for (e = 0; e < t.length; e++) i1(t[e]);
        }
    }
    function Tl(t, e) {
        var n = t.stateNode;
        if (n === null) return null;
        var l = n[ue] || null;
        if (l === null) return null;
        n = l[e];
        t: switch (e) {
            case "onClick":
            case "onClickCapture":
            case "onDoubleClick":
            case "onDoubleClickCapture":
            case "onMouseDown":
            case "onMouseDownCapture":
            case "onMouseMove":
            case "onMouseMoveCapture":
            case "onMouseUp":
            case "onMouseUpCapture":
            case "onMouseEnter":
                (l = !l.disabled) ||
                    ((t = t.type), (l = !(t === "button" || t === "input" || t === "select" || t === "textarea"))),
                    (t = !l);
                break t;
            default:
                t = !1;
        }
        if (t) return null;
        if (n && typeof n != "function") throw Error(r(231, e, typeof n));
        return n;
    }
    var Hu = !1;
    if (en)
        try {
            var xl = {};
            Object.defineProperty(xl, "passive", {
                get: function () {
                    Hu = !0;
                },
            }),
                window.addEventListener("test", xl, xl),
                window.removeEventListener("test", xl, xl);
        } catch {
            Hu = !1;
        }
    var Tn = null,
        Bu = null,
        Yi = null;
    function u1() {
        if (Yi) return Yi;
        var t,
            e = Bu,
            n = e.length,
            l,
            u = "value" in Tn ? Tn.value : Tn.textContent,
            s = u.length;
        for (t = 0; t < n && e[t] === u[t]; t++);
        var d = n - t;
        for (l = 1; l <= d && e[n - l] === u[s - l]; l++);
        return (Yi = u.slice(t, 1 < l ? 1 - l : void 0));
    }
    function Ii(t) {
        var e = t.keyCode;
        return (
            "charCode" in t ? ((t = t.charCode), t === 0 && e === 13 && (t = 13)) : (t = e),
            t === 10 && (t = 13),
            32 <= t || t === 13 ? t : 0
        );
    }
    function Pi() {
        return !0;
    }
    function o1() {
        return !1;
    }
    function oe(t) {
        function e(n, l, u, s, d) {
            (this._reactName = n),
                (this._targetInst = u),
                (this.type = l),
                (this.nativeEvent = s),
                (this.target = d),
                (this.currentTarget = null);
            for (var y in t) t.hasOwnProperty(y) && ((n = t[y]), (this[y] = n ? n(s) : s[y]));
            return (
                (this.isDefaultPrevented = (s.defaultPrevented != null ? s.defaultPrevented : s.returnValue === !1)
                    ? Pi
                    : o1),
                (this.isPropagationStopped = o1),
                this
            );
        }
        return (
            K(e.prototype, {
                preventDefault: function () {
                    this.defaultPrevented = !0;
                    var n = this.nativeEvent;
                    n &&
                        (n.preventDefault
                            ? n.preventDefault()
                            : typeof n.returnValue != "unknown" && (n.returnValue = !1),
                        (this.isDefaultPrevented = Pi));
                },
                stopPropagation: function () {
                    var n = this.nativeEvent;
                    n &&
                        (n.stopPropagation
                            ? n.stopPropagation()
                            : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0),
                        (this.isPropagationStopped = Pi));
                },
                persist: function () {},
                isPersistent: Pi,
            }),
            e
        );
    }
    var ea = {
            eventPhase: 0,
            bubbles: 0,
            cancelable: 0,
            timeStamp: function (t) {
                return t.timeStamp || Date.now();
            },
            defaultPrevented: 0,
            isTrusted: 0,
        },
        ki = oe(ea),
        Ml = K({}, ea, { view: 0, detail: 0 }),
        _4 = oe(Ml),
        Du,
        _u,
        Rl,
        Xi = K({}, Ml, {
            screenX: 0,
            screenY: 0,
            clientX: 0,
            clientY: 0,
            pageX: 0,
            pageY: 0,
            ctrlKey: 0,
            shiftKey: 0,
            altKey: 0,
            metaKey: 0,
            getModifierState: Lu,
            button: 0,
            buttons: 0,
            relatedTarget: function (t) {
                return t.relatedTarget === void 0
                    ? t.fromElement === t.srcElement
                        ? t.toElement
                        : t.fromElement
                    : t.relatedTarget;
            },
            movementX: function (t) {
                return "movementX" in t
                    ? t.movementX
                    : (t !== Rl &&
                          (Rl && t.type === "mousemove"
                              ? ((Du = t.screenX - Rl.screenX), (_u = t.screenY - Rl.screenY))
                              : (_u = Du = 0),
                          (Rl = t)),
                      Du);
            },
            movementY: function (t) {
                return "movementY" in t ? t.movementY : _u;
            },
        }),
        s1 = oe(Xi),
        N4 = K({}, Xi, { dataTransfer: 0 }),
        L4 = oe(N4),
        U4 = K({}, Ml, { relatedTarget: 0 }),
        Nu = oe(U4),
        V4 = K({}, ea, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
        z4 = oe(V4),
        G4 = K({}, ea, {
            clipboardData: function (t) {
                return "clipboardData" in t ? t.clipboardData : window.clipboardData;
            },
        }),
        Q4 = oe(G4),
        Z4 = K({}, ea, { data: 0 }),
        c1 = oe(Z4),
        j4 = {
            Esc: "Escape",
            Spacebar: " ",
            Left: "ArrowLeft",
            Up: "ArrowUp",
            Right: "ArrowRight",
            Down: "ArrowDown",
            Del: "Delete",
            Win: "OS",
            Menu: "ContextMenu",
            Apps: "ContextMenu",
            Scroll: "ScrollLock",
            MozPrintableKey: "Unidentified",
        },
        F4 = {
            8: "Backspace",
            9: "Tab",
            12: "Clear",
            13: "Enter",
            16: "Shift",
            17: "Control",
            18: "Alt",
            19: "Pause",
            20: "CapsLock",
            27: "Escape",
            32: " ",
            33: "PageUp",
            34: "PageDown",
            35: "End",
            36: "Home",
            37: "ArrowLeft",
            38: "ArrowUp",
            39: "ArrowRight",
            40: "ArrowDown",
            45: "Insert",
            46: "Delete",
            112: "F1",
            113: "F2",
            114: "F3",
            115: "F4",
            116: "F5",
            117: "F6",
            118: "F7",
            119: "F8",
            120: "F9",
            121: "F10",
            122: "F11",
            123: "F12",
            144: "NumLock",
            145: "ScrollLock",
            224: "Meta",
        },
        Y4 = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
    function I4(t) {
        var e = this.nativeEvent;
        return e.getModifierState ? e.getModifierState(t) : (t = Y4[t]) ? !!e[t] : !1;
    }
    function Lu() {
        return I4;
    }
    var P4 = K({}, Ml, {
            key: function (t) {
                if (t.key) {
                    var e = j4[t.key] || t.key;
                    if (e !== "Unidentified") return e;
                }
                return t.type === "keypress"
                    ? ((t = Ii(t)), t === 13 ? "Enter" : String.fromCharCode(t))
                    : t.type === "keydown" || t.type === "keyup"
                      ? F4[t.keyCode] || "Unidentified"
                      : "";
            },
            code: 0,
            location: 0,
            ctrlKey: 0,
            shiftKey: 0,
            altKey: 0,
            metaKey: 0,
            repeat: 0,
            locale: 0,
            getModifierState: Lu,
            charCode: function (t) {
                return t.type === "keypress" ? Ii(t) : 0;
            },
            keyCode: function (t) {
                return t.type === "keydown" || t.type === "keyup" ? t.keyCode : 0;
            },
            which: function (t) {
                return t.type === "keypress" ? Ii(t) : t.type === "keydown" || t.type === "keyup" ? t.keyCode : 0;
            },
        }),
        k4 = oe(P4),
        X4 = K({}, Xi, {
            pointerId: 0,
            width: 0,
            height: 0,
            pressure: 0,
            tangentialPressure: 0,
            tiltX: 0,
            tiltY: 0,
            twist: 0,
            pointerType: 0,
            isPrimary: 0,
        }),
        f1 = oe(X4),
        q4 = K({}, Ml, {
            touches: 0,
            targetTouches: 0,
            changedTouches: 0,
            altKey: 0,
            metaKey: 0,
            ctrlKey: 0,
            shiftKey: 0,
            getModifierState: Lu,
        }),
        K4 = oe(q4),
        W4 = K({}, ea, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }),
        J4 = oe(W4),
        $4 = K({}, Xi, {
            deltaX: function (t) {
                return "deltaX" in t ? t.deltaX : "wheelDeltaX" in t ? -t.wheelDeltaX : 0;
            },
            deltaY: function (t) {
                return "deltaY" in t
                    ? t.deltaY
                    : "wheelDeltaY" in t
                      ? -t.wheelDeltaY
                      : "wheelDelta" in t
                        ? -t.wheelDelta
                        : 0;
            },
            deltaZ: 0,
            deltaMode: 0,
        }),
        t8 = oe($4),
        e8 = K({}, ea, { newState: 0, oldState: 0 }),
        n8 = oe(e8),
        a8 = [9, 13, 27, 32],
        Uu = en && "CompositionEvent" in window,
        wl = null;
    en && "documentMode" in document && (wl = document.documentMode);
    var l8 = en && "TextEvent" in window && !wl,
        h1 = en && (!Uu || (wl && 8 < wl && 11 >= wl)),
        d1 = " ",
        m1 = !1;
    function v1(t, e) {
        switch (t) {
            case "keyup":
                return a8.indexOf(e.keyCode) !== -1;
            case "keydown":
                return e.keyCode !== 229;
            case "keypress":
            case "mousedown":
            case "focusout":
                return !0;
            default:
                return !1;
        }
    }
    function g1(t) {
        return (t = t.detail), typeof t == "object" && "data" in t ? t.data : null;
    }
    var za = !1;
    function i8(t, e) {
        switch (t) {
            case "compositionend":
                return g1(e);
            case "keypress":
                return e.which !== 32 ? null : ((m1 = !0), d1);
            case "textInput":
                return (t = e.data), t === d1 && m1 ? null : t;
            default:
                return null;
        }
    }
    function r8(t, e) {
        if (za)
            return t === "compositionend" || (!Uu && v1(t, e))
                ? ((t = u1()), (Yi = Bu = Tn = null), (za = !1), t)
                : null;
        switch (t) {
            case "paste":
                return null;
            case "keypress":
                if (!(e.ctrlKey || e.altKey || e.metaKey) || (e.ctrlKey && e.altKey)) {
                    if (e.char && 1 < e.char.length) return e.char;
                    if (e.which) return String.fromCharCode(e.which);
                }
                return null;
            case "compositionend":
                return h1 && e.locale !== "ko" ? null : e.data;
            default:
                return null;
        }
    }
    var u8 = {
        color: !0,
        date: !0,
        datetime: !0,
        "datetime-local": !0,
        email: !0,
        month: !0,
        number: !0,
        password: !0,
        range: !0,
        search: !0,
        tel: !0,
        text: !0,
        time: !0,
        url: !0,
        week: !0,
    };
    function p1(t) {
        var e = t && t.nodeName && t.nodeName.toLowerCase();
        return e === "input" ? !!u8[t.type] : e === "textarea";
    }
    function y1(t, e, n, l) {
        Ua ? (Va ? Va.push(l) : (Va = [l])) : (Ua = l),
            (e = Br(e, "onChange")),
            0 < e.length && ((n = new ki("onChange", "change", null, n, l)), t.push({ event: n, listeners: e }));
    }
    var Ol = null,
        Hl = null;
    function o8(t) {
        I2(t, 0);
    }
    function qi(t) {
        var e = Cl(t);
        if ($c(e)) return t;
    }
    function A1(t, e) {
        if (t === "change") return e;
    }
    var b1 = !1;
    if (en) {
        var Vu;
        if (en) {
            var zu = "oninput" in document;
            if (!zu) {
                var E1 = document.createElement("div");
                E1.setAttribute("oninput", "return;"), (zu = typeof E1.oninput == "function");
            }
            Vu = zu;
        } else Vu = !1;
        b1 = Vu && (!document.documentMode || 9 < document.documentMode);
    }
    function S1() {
        Ol && (Ol.detachEvent("onpropertychange", C1), (Hl = Ol = null));
    }
    function C1(t) {
        if (t.propertyName === "value" && qi(Hl)) {
            var e = [];
            y1(e, Hl, t, wu(t)), r1(o8, e);
        }
    }
    function s8(t, e, n) {
        t === "focusin" ? (S1(), (Ol = e), (Hl = n), Ol.attachEvent("onpropertychange", C1)) : t === "focusout" && S1();
    }
    function c8(t) {
        if (t === "selectionchange" || t === "keyup" || t === "keydown") return qi(Hl);
    }
    function f8(t, e) {
        if (t === "click") return qi(e);
    }
    function h8(t, e) {
        if (t === "input" || t === "change") return qi(e);
    }
    function d8(t, e) {
        return (t === e && (t !== 0 || 1 / t === 1 / e)) || (t !== t && e !== e);
    }
    var de = typeof Object.is == "function" ? Object.is : d8;
    function Bl(t, e) {
        if (de(t, e)) return !0;
        if (typeof t != "object" || t === null || typeof e != "object" || e === null) return !1;
        var n = Object.keys(t),
            l = Object.keys(e);
        if (n.length !== l.length) return !1;
        for (l = 0; l < n.length; l++) {
            var u = n[l];
            if (!yu.call(e, u) || !de(t[u], e[u])) return !1;
        }
        return !0;
    }
    function T1(t) {
        for (; t && t.firstChild; ) t = t.firstChild;
        return t;
    }
    function x1(t, e) {
        var n = T1(t);
        t = 0;
        for (var l; n; ) {
            if (n.nodeType === 3) {
                if (((l = t + n.textContent.length), t <= e && l >= e)) return { node: n, offset: e - t };
                t = l;
            }
            t: {
                for (; n; ) {
                    if (n.nextSibling) {
                        n = n.nextSibling;
                        break t;
                    }
                    n = n.parentNode;
                }
                n = void 0;
            }
            n = T1(n);
        }
    }
    function M1(t, e) {
        return t && e
            ? t === e
                ? !0
                : t && t.nodeType === 3
                  ? !1
                  : e && e.nodeType === 3
                    ? M1(t, e.parentNode)
                    : "contains" in t
                      ? t.contains(e)
                      : t.compareDocumentPosition
                        ? !!(t.compareDocumentPosition(e) & 16)
                        : !1
            : !1;
    }
    function R1(t) {
        t =
            t != null && t.ownerDocument != null && t.ownerDocument.defaultView != null
                ? t.ownerDocument.defaultView
                : window;
        for (var e = ji(t.document); e instanceof t.HTMLIFrameElement; ) {
            try {
                var n = typeof e.contentWindow.location.href == "string";
            } catch {
                n = !1;
            }
            if (n) t = e.contentWindow;
            else break;
            e = ji(t.document);
        }
        return e;
    }
    function Gu(t) {
        var e = t && t.nodeName && t.nodeName.toLowerCase();
        return (
            e &&
            ((e === "input" &&
                (t.type === "text" ||
                    t.type === "search" ||
                    t.type === "tel" ||
                    t.type === "url" ||
                    t.type === "password")) ||
                e === "textarea" ||
                t.contentEditable === "true")
        );
    }
    function m8(t, e) {
        var n = R1(e);
        e = t.focusedElem;
        var l = t.selectionRange;
        if (n !== e && e && e.ownerDocument && M1(e.ownerDocument.documentElement, e)) {
            if (l !== null && Gu(e)) {
                if (((t = l.start), (n = l.end), n === void 0 && (n = t), "selectionStart" in e))
                    (e.selectionStart = t), (e.selectionEnd = Math.min(n, e.value.length));
                else if (((n = ((t = e.ownerDocument || document) && t.defaultView) || window), n.getSelection)) {
                    n = n.getSelection();
                    var u = e.textContent.length,
                        s = Math.min(l.start, u);
                    (l = l.end === void 0 ? s : Math.min(l.end, u)),
                        !n.extend && s > l && ((u = l), (l = s), (s = u)),
                        (u = x1(e, s));
                    var d = x1(e, l);
                    u &&
                        d &&
                        (n.rangeCount !== 1 ||
                            n.anchorNode !== u.node ||
                            n.anchorOffset !== u.offset ||
                            n.focusNode !== d.node ||
                            n.focusOffset !== d.offset) &&
                        ((t = t.createRange()),
                        t.setStart(u.node, u.offset),
                        n.removeAllRanges(),
                        s > l
                            ? (n.addRange(t), n.extend(d.node, d.offset))
                            : (t.setEnd(d.node, d.offset), n.addRange(t)));
                }
            }
            for (t = [], n = e; (n = n.parentNode); )
                n.nodeType === 1 && t.push({ element: n, left: n.scrollLeft, top: n.scrollTop });
            for (typeof e.focus == "function" && e.focus(), e = 0; e < t.length; e++)
                (n = t[e]), (n.element.scrollLeft = n.left), (n.element.scrollTop = n.top);
        }
    }
    var v8 = en && "documentMode" in document && 11 >= document.documentMode,
        Ga = null,
        Qu = null,
        Dl = null,
        Zu = !1;
    function w1(t, e, n) {
        var l = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
        Zu ||
            Ga == null ||
            Ga !== ji(l) ||
            ((l = Ga),
            "selectionStart" in l && Gu(l)
                ? (l = { start: l.selectionStart, end: l.selectionEnd })
                : ((l = ((l.ownerDocument && l.ownerDocument.defaultView) || window).getSelection()),
                  (l = {
                      anchorNode: l.anchorNode,
                      anchorOffset: l.anchorOffset,
                      focusNode: l.focusNode,
                      focusOffset: l.focusOffset,
                  })),
            (Dl && Bl(Dl, l)) ||
                ((Dl = l),
                (l = Br(Qu, "onSelect")),
                0 < l.length &&
                    ((e = new ki("onSelect", "select", null, e, n)),
                    t.push({ event: e, listeners: l }),
                    (e.target = Ga))));
    }
    function na(t, e) {
        var n = {};
        return (n[t.toLowerCase()] = e.toLowerCase()), (n["Webkit" + t] = "webkit" + e), (n["Moz" + t] = "moz" + e), n;
    }
    var Qa = {
            animationend: na("Animation", "AnimationEnd"),
            animationiteration: na("Animation", "AnimationIteration"),
            animationstart: na("Animation", "AnimationStart"),
            transitionrun: na("Transition", "TransitionRun"),
            transitionstart: na("Transition", "TransitionStart"),
            transitioncancel: na("Transition", "TransitionCancel"),
            transitionend: na("Transition", "TransitionEnd"),
        },
        ju = {},
        O1 = {};
    en &&
        ((O1 = document.createElement("div").style),
        "AnimationEvent" in window ||
            (delete Qa.animationend.animation,
            delete Qa.animationiteration.animation,
            delete Qa.animationstart.animation),
        "TransitionEvent" in window || delete Qa.transitionend.transition);
    function aa(t) {
        if (ju[t]) return ju[t];
        if (!Qa[t]) return t;
        var e = Qa[t],
            n;
        for (n in e) if (e.hasOwnProperty(n) && n in O1) return (ju[t] = e[n]);
        return t;
    }
    var H1 = aa("animationend"),
        B1 = aa("animationiteration"),
        D1 = aa("animationstart"),
        g8 = aa("transitionrun"),
        p8 = aa("transitionstart"),
        y8 = aa("transitioncancel"),
        _1 = aa("transitionend"),
        N1 = new Map(),
        L1 =
            "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll scrollEnd toggle touchMove waiting wheel".split(
                " "
            );
    function Le(t, e) {
        N1.set(t, e), ta(e, [t]);
    }
    var Ce = [],
        Za = 0,
        Fu = 0;
    function Ki() {
        for (var t = Za, e = (Fu = Za = 0); e < t; ) {
            var n = Ce[e];
            Ce[e++] = null;
            var l = Ce[e];
            Ce[e++] = null;
            var u = Ce[e];
            Ce[e++] = null;
            var s = Ce[e];
            if (((Ce[e++] = null), l !== null && u !== null)) {
                var d = l.pending;
                d === null ? (u.next = u) : ((u.next = d.next), (d.next = u)), (l.pending = u);
            }
            s !== 0 && U1(n, u, s);
        }
    }
    function Wi(t, e, n, l) {
        (Ce[Za++] = t),
            (Ce[Za++] = e),
            (Ce[Za++] = n),
            (Ce[Za++] = l),
            (Fu |= l),
            (t.lanes |= l),
            (t = t.alternate),
            t !== null && (t.lanes |= l);
    }
    function Yu(t, e, n, l) {
        return Wi(t, e, n, l), Ji(t);
    }
    function xn(t, e) {
        return Wi(t, null, null, e), Ji(t);
    }
    function U1(t, e, n) {
        t.lanes |= n;
        var l = t.alternate;
        l !== null && (l.lanes |= n);
        for (var u = !1, s = t.return; s !== null; )
            (s.childLanes |= n),
                (l = s.alternate),
                l !== null && (l.childLanes |= n),
                s.tag === 22 && ((t = s.stateNode), t === null || t._visibility & 1 || (u = !0)),
                (t = s),
                (s = s.return);
        u &&
            e !== null &&
            t.tag === 3 &&
            ((s = t.stateNode),
            (u = 31 - he(n)),
            (s = s.hiddenUpdates),
            (t = s[u]),
            t === null ? (s[u] = [e]) : t.push(e),
            (e.lane = n | 536870912));
    }
    function Ji(t) {
        if (50 < ai) throw ((ai = 0), (Wo = null), Error(r(185)));
        for (var e = t.return; e !== null; ) (t = e), (e = t.return);
        return t.tag === 3 ? t.stateNode : null;
    }
    var ja = {},
        V1 = new WeakMap();
    function Te(t, e) {
        if (typeof t == "object" && t !== null) {
            var n = V1.get(t);
            return n !== void 0 ? n : ((e = { value: t, source: e, stack: J(e) }), V1.set(t, e), e);
        }
        return { value: t, source: e, stack: J(e) };
    }
    var Fa = [],
        Ya = 0,
        $i = null,
        tr = 0,
        xe = [],
        Me = 0,
        la = null,
        an = 1,
        ln = "";
    function ia(t, e) {
        (Fa[Ya++] = tr), (Fa[Ya++] = $i), ($i = t), (tr = e);
    }
    function z1(t, e, n) {
        (xe[Me++] = an), (xe[Me++] = ln), (xe[Me++] = la), (la = t);
        var l = an;
        t = ln;
        var u = 32 - he(l) - 1;
        (l &= ~(1 << u)), (n += 1);
        var s = 32 - he(e) + u;
        if (30 < s) {
            var d = u - (u % 5);
            (s = (l & ((1 << d) - 1)).toString(32)),
                (l >>= d),
                (u -= d),
                (an = (1 << (32 - he(e) + u)) | (n << u) | l),
                (ln = s + t);
        } else (an = (1 << s) | (n << u) | l), (ln = t);
    }
    function Iu(t) {
        t.return !== null && (ia(t, 1), z1(t, 1, 0));
    }
    function Pu(t) {
        for (; t === $i; ) ($i = Fa[--Ya]), (Fa[Ya] = null), (tr = Fa[--Ya]), (Fa[Ya] = null);
        for (; t === la; )
            (la = xe[--Me]), (xe[Me] = null), (ln = xe[--Me]), (xe[Me] = null), (an = xe[--Me]), (xe[Me] = null);
    }
    var le = null,
        Jt = null,
        St = !1,
        Ue = null,
        je = !1,
        ku = Error(r(519));
    function ra(t) {
        var e = Error(r(418, ""));
        throw (Ll(Te(e, t)), ku);
    }
    function G1(t) {
        var e = t.stateNode,
            n = t.type,
            l = t.memoizedProps;
        switch (((e[ee] = t), (e[ue] = l), n)) {
            case "dialog":
                mt("cancel", e), mt("close", e);
                break;
            case "iframe":
            case "object":
            case "embed":
                mt("load", e);
                break;
            case "video":
            case "audio":
                for (n = 0; n < ii.length; n++) mt(ii[n], e);
                break;
            case "source":
                mt("error", e);
                break;
            case "img":
            case "image":
            case "link":
                mt("error", e), mt("load", e);
                break;
            case "details":
                mt("toggle", e);
                break;
            case "input":
                mt("invalid", e),
                    t1(e, l.value, l.defaultValue, l.checked, l.defaultChecked, l.type, l.name, !0),
                    Zi(e);
                break;
            case "select":
                mt("invalid", e);
                break;
            case "textarea":
                mt("invalid", e), n1(e, l.value, l.defaultValue, l.children), Zi(e);
        }
        (n = l.children),
            (typeof n != "string" && typeof n != "number" && typeof n != "bigint") ||
            e.textContent === "" + n ||
            l.suppressHydrationWarning === !0 ||
            q2(e.textContent, n)
                ? (l.popover != null && (mt("beforetoggle", e), mt("toggle", e)),
                  l.onScroll != null && mt("scroll", e),
                  l.onScrollEnd != null && mt("scrollend", e),
                  l.onClick != null && (e.onclick = Dr),
                  (e = !0))
                : (e = !1),
            e || ra(t);
    }
    function Q1(t) {
        for (le = t.return; le; )
            switch (le.tag) {
                case 3:
                case 27:
                    je = !0;
                    return;
                case 5:
                case 13:
                    je = !1;
                    return;
                default:
                    le = le.return;
            }
    }
    function _l(t) {
        if (t !== le) return !1;
        if (!St) return Q1(t), (St = !0), !1;
        var e = !1,
            n;
        if (
            ((n = t.tag !== 3 && t.tag !== 27) &&
                ((n = t.tag === 5) &&
                    ((n = t.type), (n = !(n !== "form" && n !== "button") || ms(t.type, t.memoizedProps))),
                (n = !n)),
            n && (e = !0),
            e && Jt && ra(t),
            Q1(t),
            t.tag === 13)
        ) {
            if (((t = t.memoizedState), (t = t !== null ? t.dehydrated : null), !t)) throw Error(r(317));
            t: {
                for (t = t.nextSibling, e = 0; t; ) {
                    if (t.nodeType === 8)
                        if (((n = t.data), n === "/$")) {
                            if (e === 0) {
                                Jt = ze(t.nextSibling);
                                break t;
                            }
                            e--;
                        } else (n !== "$" && n !== "$!" && n !== "$?") || e++;
                    t = t.nextSibling;
                }
                Jt = null;
            }
        } else Jt = le ? ze(t.stateNode.nextSibling) : null;
        return !0;
    }
    function Nl() {
        (Jt = le = null), (St = !1);
    }
    function Ll(t) {
        Ue === null ? (Ue = [t]) : Ue.push(t);
    }
    var Ul = Error(r(460)),
        Z1 = Error(r(474)),
        Xu = { then: function () {} };
    function j1(t) {
        return (t = t.status), t === "fulfilled" || t === "rejected";
    }
    function er() {}
    function F1(t, e, n) {
        switch (((n = t[n]), n === void 0 ? t.push(e) : n !== e && (e.then(er, er), (e = n)), e.status)) {
            case "fulfilled":
                return e.value;
            case "rejected":
                throw ((t = e.reason), t === Ul ? Error(r(483)) : t);
            default:
                if (typeof e.status == "string") e.then(er, er);
                else {
                    if (((t = Dt), t !== null && 100 < t.shellSuspendCounter)) throw Error(r(482));
                    (t = e),
                        (t.status = "pending"),
                        t.then(
                            function (l) {
                                if (e.status === "pending") {
                                    var u = e;
                                    (u.status = "fulfilled"), (u.value = l);
                                }
                            },
                            function (l) {
                                if (e.status === "pending") {
                                    var u = e;
                                    (u.status = "rejected"), (u.reason = l);
                                }
                            }
                        );
                }
                switch (e.status) {
                    case "fulfilled":
                        return e.value;
                    case "rejected":
                        throw ((t = e.reason), t === Ul ? Error(r(483)) : t);
                }
                throw ((Vl = e), Ul);
        }
    }
    var Vl = null;
    function Y1() {
        if (Vl === null) throw Error(r(459));
        var t = Vl;
        return (Vl = null), t;
    }
    var Ia = null,
        zl = 0;
    function nr(t) {
        var e = zl;
        return (zl += 1), Ia === null && (Ia = []), F1(Ia, t, e);
    }
    function Gl(t, e) {
        (e = e.props.ref), (t.ref = e !== void 0 ? e : null);
    }
    function ar(t, e) {
        throw e.$$typeof === f
            ? Error(r(525))
            : ((t = Object.prototype.toString.call(e)),
              Error(r(31, t === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : t)));
    }
    function I1(t) {
        var e = t._init;
        return e(t._payload);
    }
    function P1(t) {
        function e(w, T) {
            if (t) {
                var O = w.deletions;
                O === null ? ((w.deletions = [T]), (w.flags |= 16)) : O.push(T);
            }
        }
        function n(w, T) {
            if (!t) return null;
            for (; T !== null; ) e(w, T), (T = T.sibling);
            return null;
        }
        function l(w) {
            for (var T = new Map(); w !== null; ) w.key !== null ? T.set(w.key, w) : T.set(w.index, w), (w = w.sibling);
            return T;
        }
        function u(w, T) {
            return (w = Vn(w, T)), (w.index = 0), (w.sibling = null), w;
        }
        function s(w, T, O) {
            return (
                (w.index = O),
                t
                    ? ((O = w.alternate),
                      O !== null ? ((O = O.index), O < T ? ((w.flags |= 33554434), T) : O) : ((w.flags |= 33554434), T))
                    : ((w.flags |= 1048576), T)
            );
        }
        function d(w) {
            return t && w.alternate === null && (w.flags |= 33554434), w;
        }
        function y(w, T, O, G) {
            return T === null || T.tag !== 6
                ? ((T = Fo(O, w.mode, G)), (T.return = w), T)
                : ((T = u(T, O)), (T.return = w), T);
        }
        function b(w, T, O, G) {
            var W = O.type;
            return W === g
                ? L(w, T, O.props.children, G, O.key)
                : T !== null &&
                    (T.elementType === W ||
                        (typeof W == "object" && W !== null && W.$$typeof === U && I1(W) === T.type))
                  ? ((T = u(T, O.props)), Gl(T, O), (T.return = w), T)
                  : ((T = Er(O.type, O.key, O.props, null, w.mode, G)), Gl(T, O), (T.return = w), T);
        }
        function M(w, T, O, G) {
            return T === null ||
                T.tag !== 4 ||
                T.stateNode.containerInfo !== O.containerInfo ||
                T.stateNode.implementation !== O.implementation
                ? ((T = Yo(O, w.mode, G)), (T.return = w), T)
                : ((T = u(T, O.children || [])), (T.return = w), T);
        }
        function L(w, T, O, G, W) {
            return T === null || T.tag !== 7
                ? ((T = ga(O, w.mode, G, W)), (T.return = w), T)
                : ((T = u(T, O)), (T.return = w), T);
        }
        function Z(w, T, O) {
            if ((typeof T == "string" && T !== "") || typeof T == "number" || typeof T == "bigint")
                return (T = Fo("" + T, w.mode, O)), (T.return = w), T;
            if (typeof T == "object" && T !== null) {
                switch (T.$$typeof) {
                    case h:
                        return (O = Er(T.type, T.key, T.props, null, w.mode, O)), Gl(O, T), (O.return = w), O;
                    case m:
                        return (T = Yo(T, w.mode, O)), (T.return = w), T;
                    case U:
                        var G = T._init;
                        return (T = G(T._payload)), Z(w, T, O);
                }
                if (nt(T) || k(T)) return (T = ga(T, w.mode, O, null)), (T.return = w), T;
                if (typeof T.then == "function") return Z(w, nr(T), O);
                if (T.$$typeof === x) return Z(w, yr(w, T), O);
                ar(w, T);
            }
            return null;
        }
        function B(w, T, O, G) {
            var W = T !== null ? T.key : null;
            if ((typeof O == "string" && O !== "") || typeof O == "number" || typeof O == "bigint")
                return W !== null ? null : y(w, T, "" + O, G);
            if (typeof O == "object" && O !== null) {
                switch (O.$$typeof) {
                    case h:
                        return O.key === W ? b(w, T, O, G) : null;
                    case m:
                        return O.key === W ? M(w, T, O, G) : null;
                    case U:
                        return (W = O._init), (O = W(O._payload)), B(w, T, O, G);
                }
                if (nt(O) || k(O)) return W !== null ? null : L(w, T, O, G, null);
                if (typeof O.then == "function") return B(w, T, nr(O), G);
                if (O.$$typeof === x) return B(w, T, yr(w, O), G);
                ar(w, O);
            }
            return null;
        }
        function N(w, T, O, G, W) {
            if ((typeof G == "string" && G !== "") || typeof G == "number" || typeof G == "bigint")
                return (w = w.get(O) || null), y(T, w, "" + G, W);
            if (typeof G == "object" && G !== null) {
                switch (G.$$typeof) {
                    case h:
                        return (w = w.get(G.key === null ? O : G.key) || null), b(T, w, G, W);
                    case m:
                        return (w = w.get(G.key === null ? O : G.key) || null), M(T, w, G, W);
                    case U:
                        var ft = G._init;
                        return (G = ft(G._payload)), N(w, T, O, G, W);
                }
                if (nt(G) || k(G)) return (w = w.get(O) || null), L(T, w, G, W, null);
                if (typeof G.then == "function") return N(w, T, O, nr(G), W);
                if (G.$$typeof === x) return N(w, T, O, yr(T, G), W);
                ar(T, G);
            }
            return null;
        }
        function tt(w, T, O, G) {
            for (var W = null, ft = null, et = T, lt = (T = 0), Wt = null; et !== null && lt < O.length; lt++) {
                et.index > lt ? ((Wt = et), (et = null)) : (Wt = et.sibling);
                var Ct = B(w, et, O[lt], G);
                if (Ct === null) {
                    et === null && (et = Wt);
                    break;
                }
                t && et && Ct.alternate === null && e(w, et),
                    (T = s(Ct, T, lt)),
                    ft === null ? (W = Ct) : (ft.sibling = Ct),
                    (ft = Ct),
                    (et = Wt);
            }
            if (lt === O.length) return n(w, et), St && ia(w, lt), W;
            if (et === null) {
                for (; lt < O.length; lt++)
                    (et = Z(w, O[lt], G)),
                        et !== null && ((T = s(et, T, lt)), ft === null ? (W = et) : (ft.sibling = et), (ft = et));
                return St && ia(w, lt), W;
            }
            for (et = l(et); lt < O.length; lt++)
                (Wt = N(et, w, lt, O[lt], G)),
                    Wt !== null &&
                        (t && Wt.alternate !== null && et.delete(Wt.key === null ? lt : Wt.key),
                        (T = s(Wt, T, lt)),
                        ft === null ? (W = Wt) : (ft.sibling = Wt),
                        (ft = Wt));
            return (
                t &&
                    et.forEach(function (Yn) {
                        return e(w, Yn);
                    }),
                St && ia(w, lt),
                W
            );
        }
        function it(w, T, O, G) {
            if (O == null) throw Error(r(151));
            for (
                var W = null, ft = null, et = T, lt = (T = 0), Wt = null, Ct = O.next();
                et !== null && !Ct.done;
                lt++, Ct = O.next()
            ) {
                et.index > lt ? ((Wt = et), (et = null)) : (Wt = et.sibling);
                var Yn = B(w, et, Ct.value, G);
                if (Yn === null) {
                    et === null && (et = Wt);
                    break;
                }
                t && et && Yn.alternate === null && e(w, et),
                    (T = s(Yn, T, lt)),
                    ft === null ? (W = Yn) : (ft.sibling = Yn),
                    (ft = Yn),
                    (et = Wt);
            }
            if (Ct.done) return n(w, et), St && ia(w, lt), W;
            if (et === null) {
                for (; !Ct.done; lt++, Ct = O.next())
                    (Ct = Z(w, Ct.value, G)),
                        Ct !== null && ((T = s(Ct, T, lt)), ft === null ? (W = Ct) : (ft.sibling = Ct), (ft = Ct));
                return St && ia(w, lt), W;
            }
            for (et = l(et); !Ct.done; lt++, Ct = O.next())
                (Ct = N(et, w, lt, Ct.value, G)),
                    Ct !== null &&
                        (t && Ct.alternate !== null && et.delete(Ct.key === null ? lt : Ct.key),
                        (T = s(Ct, T, lt)),
                        ft === null ? (W = Ct) : (ft.sibling = Ct),
                        (ft = Ct));
            return (
                t &&
                    et.forEach(function (D6) {
                        return e(w, D6);
                    }),
                St && ia(w, lt),
                W
            );
        }
        function Qt(w, T, O, G) {
            if (
                (typeof O == "object" && O !== null && O.type === g && O.key === null && (O = O.props.children),
                typeof O == "object" && O !== null)
            ) {
                switch (O.$$typeof) {
                    case h:
                        t: {
                            for (var W = O.key; T !== null; ) {
                                if (T.key === W) {
                                    if (((W = O.type), W === g)) {
                                        if (T.tag === 7) {
                                            n(w, T.sibling), (G = u(T, O.props.children)), (G.return = w), (w = G);
                                            break t;
                                        }
                                    } else if (
                                        T.elementType === W ||
                                        (typeof W == "object" && W !== null && W.$$typeof === U && I1(W) === T.type)
                                    ) {
                                        n(w, T.sibling), (G = u(T, O.props)), Gl(G, O), (G.return = w), (w = G);
                                        break t;
                                    }
                                    n(w, T);
                                    break;
                                } else e(w, T);
                                T = T.sibling;
                            }
                            O.type === g
                                ? ((G = ga(O.props.children, w.mode, G, O.key)), (G.return = w), (w = G))
                                : ((G = Er(O.type, O.key, O.props, null, w.mode, G)),
                                  Gl(G, O),
                                  (G.return = w),
                                  (w = G));
                        }
                        return d(w);
                    case m:
                        t: {
                            for (W = O.key; T !== null; ) {
                                if (T.key === W)
                                    if (
                                        T.tag === 4 &&
                                        T.stateNode.containerInfo === O.containerInfo &&
                                        T.stateNode.implementation === O.implementation
                                    ) {
                                        n(w, T.sibling), (G = u(T, O.children || [])), (G.return = w), (w = G);
                                        break t;
                                    } else {
                                        n(w, T);
                                        break;
                                    }
                                else e(w, T);
                                T = T.sibling;
                            }
                            (G = Yo(O, w.mode, G)), (G.return = w), (w = G);
                        }
                        return d(w);
                    case U:
                        return (W = O._init), (O = W(O._payload)), Qt(w, T, O, G);
                }
                if (nt(O)) return tt(w, T, O, G);
                if (k(O)) {
                    if (((W = k(O)), typeof W != "function")) throw Error(r(150));
                    return (O = W.call(O)), it(w, T, O, G);
                }
                if (typeof O.then == "function") return Qt(w, T, nr(O), G);
                if (O.$$typeof === x) return Qt(w, T, yr(w, O), G);
                ar(w, O);
            }
            return (typeof O == "string" && O !== "") || typeof O == "number" || typeof O == "bigint"
                ? ((O = "" + O),
                  T !== null && T.tag === 6
                      ? (n(w, T.sibling), (G = u(T, O)), (G.return = w), (w = G))
                      : (n(w, T), (G = Fo(O, w.mode, G)), (G.return = w), (w = G)),
                  d(w))
                : n(w, T);
        }
        return function (w, T, O, G) {
            try {
                zl = 0;
                var W = Qt(w, T, O, G);
                return (Ia = null), W;
            } catch (et) {
                if (et === Ul) throw et;
                var ft = He(29, et, null, w.mode);
                return (ft.lanes = G), (ft.return = w), ft;
            } finally {
            }
        };
    }
    var ua = P1(!0),
        k1 = P1(!1),
        Pa = bt(null),
        lr = bt(0);
    function X1(t, e) {
        (t = gn), Bt(lr, t), Bt(Pa, e), (gn = t | e.baseLanes);
    }
    function qu() {
        Bt(lr, gn), Bt(Pa, Pa.current);
    }
    function Ku() {
        (gn = lr.current), Vt(Pa), Vt(lr);
    }
    var Re = bt(null),
        Fe = null;
    function Mn(t) {
        var e = t.alternate;
        Bt(Pt, Pt.current & 1),
            Bt(Re, t),
            Fe === null && (e === null || Pa.current !== null || e.memoizedState !== null) && (Fe = t);
    }
    function q1(t) {
        if (t.tag === 22) {
            if ((Bt(Pt, Pt.current), Bt(Re, t), Fe === null)) {
                var e = t.alternate;
                e !== null && e.memoizedState !== null && (Fe = t);
            }
        } else Rn();
    }
    function Rn() {
        Bt(Pt, Pt.current), Bt(Re, Re.current);
    }
    function rn(t) {
        Vt(Re), Fe === t && (Fe = null), Vt(Pt);
    }
    var Pt = bt(0);
    function ir(t) {
        for (var e = t; e !== null; ) {
            if (e.tag === 13) {
                var n = e.memoizedState;
                if (n !== null && ((n = n.dehydrated), n === null || n.data === "$?" || n.data === "$!")) return e;
            } else if (e.tag === 19 && e.memoizedProps.revealOrder !== void 0) {
                if ((e.flags & 128) !== 0) return e;
            } else if (e.child !== null) {
                (e.child.return = e), (e = e.child);
                continue;
            }
            if (e === t) break;
            for (; e.sibling === null; ) {
                if (e.return === null || e.return === t) return null;
                e = e.return;
            }
            (e.sibling.return = e.return), (e = e.sibling);
        }
        return null;
    }
    var A8 =
            typeof AbortController < "u"
                ? AbortController
                : function () {
                      var t = [],
                          e = (this.signal = {
                              aborted: !1,
                              addEventListener: function (n, l) {
                                  t.push(l);
                              },
                          });
                      this.abort = function () {
                          (e.aborted = !0),
                              t.forEach(function (n) {
                                  return n();
                              });
                      };
                  },
        b8 = a.unstable_scheduleCallback,
        E8 = a.unstable_NormalPriority,
        kt = {
            $$typeof: x,
            Consumer: null,
            Provider: null,
            _currentValue: null,
            _currentValue2: null,
            _threadCount: 0,
        };
    function Wu() {
        return { controller: new A8(), data: new Map(), refCount: 0 };
    }
    function Ql(t) {
        t.refCount--,
            t.refCount === 0 &&
                b8(E8, function () {
                    t.controller.abort();
                });
    }
    var Zl = null,
        Ju = 0,
        ka = 0,
        Xa = null;
    function S8(t, e) {
        if (Zl === null) {
            var n = (Zl = []);
            (Ju = 0),
                (ka = is()),
                (Xa = {
                    status: "pending",
                    value: void 0,
                    then: function (l) {
                        n.push(l);
                    },
                });
        }
        return Ju++, e.then(K1, K1), e;
    }
    function K1() {
        if (--Ju === 0 && Zl !== null) {
            Xa !== null && (Xa.status = "fulfilled");
            var t = Zl;
            (Zl = null), (ka = 0), (Xa = null);
            for (var e = 0; e < t.length; e++) (0, t[e])();
        }
    }
    function C8(t, e) {
        var n = [],
            l = {
                status: "pending",
                value: null,
                reason: null,
                then: function (u) {
                    n.push(u);
                },
            };
        return (
            t.then(
                function () {
                    (l.status = "fulfilled"), (l.value = e);
                    for (var u = 0; u < n.length; u++) (0, n[u])(e);
                },
                function (u) {
                    for (l.status = "rejected", l.reason = u, u = 0; u < n.length; u++) (0, n[u])(void 0);
                }
            ),
            l
        );
    }
    var W1 = P.S;
    P.S = function (t, e) {
        typeof e == "object" && e !== null && typeof e.then == "function" && S8(t, e), W1 !== null && W1(t, e);
    };
    var oa = bt(null);
    function $u() {
        var t = oa.current;
        return t !== null ? t : Dt.pooledCache;
    }
    function rr(t, e) {
        e === null ? Bt(oa, oa.current) : Bt(oa, e.pool);
    }
    function J1() {
        var t = $u();
        return t === null ? null : { parent: kt._currentValue, pool: t };
    }
    var wn = 0,
        ct = null,
        Rt = null,
        Ft = null,
        ur = !1,
        qa = !1,
        sa = !1,
        or = 0,
        jl = 0,
        Ka = null,
        T8 = 0;
    function jt() {
        throw Error(r(321));
    }
    function to(t, e) {
        if (e === null) return !1;
        for (var n = 0; n < e.length && n < t.length; n++) if (!de(t[n], e[n])) return !1;
        return !0;
    }
    function eo(t, e, n, l, u, s) {
        return (
            (wn = s),
            (ct = e),
            (e.memoizedState = null),
            (e.updateQueue = null),
            (e.lanes = 0),
            (P.H = t === null || t.memoizedState === null ? ca : On),
            (sa = !1),
            (s = n(l, u)),
            (sa = !1),
            qa && (s = tf(e, n, l, u)),
            $1(t),
            s
        );
    }
    function $1(t) {
        P.H = Ye;
        var e = Rt !== null && Rt.next !== null;
        if (((wn = 0), (Ft = Rt = ct = null), (ur = !1), (jl = 0), (Ka = null), e)) throw Error(r(300));
        t === null || qt || ((t = t.dependencies), t !== null && pr(t) && (qt = !0));
    }
    function tf(t, e, n, l) {
        ct = t;
        var u = 0;
        do {
            if ((qa && (Ka = null), (jl = 0), (qa = !1), 25 <= u)) throw Error(r(301));
            if (((u += 1), (Ft = Rt = null), t.updateQueue != null)) {
                var s = t.updateQueue;
                (s.lastEffect = null),
                    (s.events = null),
                    (s.stores = null),
                    s.memoCache != null && (s.memoCache.index = 0);
            }
            (P.H = fa), (s = e(n, l));
        } while (qa);
        return s;
    }
    function x8() {
        var t = P.H,
            e = t.useState()[0];
        return (
            (e = typeof e.then == "function" ? Fl(e) : e),
            (t = t.useState()[0]),
            (Rt !== null ? Rt.memoizedState : null) !== t && (ct.flags |= 1024),
            e
        );
    }
    function no() {
        var t = or !== 0;
        return (or = 0), t;
    }
    function ao(t, e, n) {
        (e.updateQueue = t.updateQueue), (e.flags &= -2053), (t.lanes &= ~n);
    }
    function lo(t) {
        if (ur) {
            for (t = t.memoizedState; t !== null; ) {
                var e = t.queue;
                e !== null && (e.pending = null), (t = t.next);
            }
            ur = !1;
        }
        (wn = 0), (Ft = Rt = ct = null), (qa = !1), (jl = or = 0), (Ka = null);
    }
    function se() {
        var t = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
        return Ft === null ? (ct.memoizedState = Ft = t) : (Ft = Ft.next = t), Ft;
    }
    function Yt() {
        if (Rt === null) {
            var t = ct.alternate;
            t = t !== null ? t.memoizedState : null;
        } else t = Rt.next;
        var e = Ft === null ? ct.memoizedState : Ft.next;
        if (e !== null) (Ft = e), (Rt = t);
        else {
            if (t === null) throw ct.alternate === null ? Error(r(467)) : Error(r(310));
            (Rt = t),
                (t = {
                    memoizedState: Rt.memoizedState,
                    baseState: Rt.baseState,
                    baseQueue: Rt.baseQueue,
                    queue: Rt.queue,
                    next: null,
                }),
                Ft === null ? (ct.memoizedState = Ft = t) : (Ft = Ft.next = t);
        }
        return Ft;
    }
    var sr;
    sr = function () {
        return { lastEffect: null, events: null, stores: null, memoCache: null };
    };
    function Fl(t) {
        var e = jl;
        return (
            (jl += 1),
            Ka === null && (Ka = []),
            (t = F1(Ka, t, e)),
            (e = ct),
            (Ft === null ? e.memoizedState : Ft.next) === null &&
                ((e = e.alternate), (P.H = e === null || e.memoizedState === null ? ca : On)),
            t
        );
    }
    function cr(t) {
        if (t !== null && typeof t == "object") {
            if (typeof t.then == "function") return Fl(t);
            if (t.$$typeof === x) return ne(t);
        }
        throw Error(r(438, String(t)));
    }
    function io(t) {
        var e = null,
            n = ct.updateQueue;
        if ((n !== null && (e = n.memoCache), e == null)) {
            var l = ct.alternate;
            l !== null &&
                ((l = l.updateQueue),
                l !== null &&
                    ((l = l.memoCache),
                    l != null &&
                        (e = {
                            data: l.data.map(function (u) {
                                return u.slice();
                            }),
                            index: 0,
                        })));
        }
        if (
            (e == null && (e = { data: [], index: 0 }),
            n === null && ((n = sr()), (ct.updateQueue = n)),
            (n.memoCache = e),
            (n = e.data[e.index]),
            n === void 0)
        )
            for (n = e.data[e.index] = Array(t), l = 0; l < t; l++) n[l] = Y;
        return e.index++, n;
    }
    function un(t, e) {
        return typeof e == "function" ? e(t) : e;
    }
    function fr(t) {
        var e = Yt();
        return ro(e, Rt, t);
    }
    function ro(t, e, n) {
        var l = t.queue;
        if (l === null) throw Error(r(311));
        l.lastRenderedReducer = n;
        var u = t.baseQueue,
            s = l.pending;
        if (s !== null) {
            if (u !== null) {
                var d = u.next;
                (u.next = s.next), (s.next = d);
            }
            (e.baseQueue = u = s), (l.pending = null);
        }
        if (((s = t.baseState), u === null)) t.memoizedState = s;
        else {
            e = u.next;
            var y = (d = null),
                b = null,
                M = e,
                L = !1;
            do {
                var Z = M.lane & -536870913;
                if (Z !== M.lane ? (pt & Z) === Z : (wn & Z) === Z) {
                    var B = M.revertLane;
                    if (B === 0)
                        b !== null &&
                            (b = b.next =
                                {
                                    lane: 0,
                                    revertLane: 0,
                                    action: M.action,
                                    hasEagerState: M.hasEagerState,
                                    eagerState: M.eagerState,
                                    next: null,
                                }),
                            Z === ka && (L = !0);
                    else if ((wn & B) === B) {
                        (M = M.next), B === ka && (L = !0);
                        continue;
                    } else
                        (Z = {
                            lane: 0,
                            revertLane: M.revertLane,
                            action: M.action,
                            hasEagerState: M.hasEagerState,
                            eagerState: M.eagerState,
                            next: null,
                        }),
                            b === null ? ((y = b = Z), (d = s)) : (b = b.next = Z),
                            (ct.lanes |= B),
                            (zn |= B);
                    (Z = M.action), sa && n(s, Z), (s = M.hasEagerState ? M.eagerState : n(s, Z));
                } else
                    (B = {
                        lane: Z,
                        revertLane: M.revertLane,
                        action: M.action,
                        hasEagerState: M.hasEagerState,
                        eagerState: M.eagerState,
                        next: null,
                    }),
                        b === null ? ((y = b = B), (d = s)) : (b = b.next = B),
                        (ct.lanes |= Z),
                        (zn |= Z);
                M = M.next;
            } while (M !== null && M !== e);
            if (
                (b === null ? (d = s) : (b.next = y),
                !de(s, t.memoizedState) && ((qt = !0), L && ((n = Xa), n !== null)))
            )
                throw n;
            (t.memoizedState = s), (t.baseState = d), (t.baseQueue = b), (l.lastRenderedState = s);
        }
        return u === null && (l.lanes = 0), [t.memoizedState, l.dispatch];
    }
    function uo(t) {
        var e = Yt(),
            n = e.queue;
        if (n === null) throw Error(r(311));
        n.lastRenderedReducer = t;
        var l = n.dispatch,
            u = n.pending,
            s = e.memoizedState;
        if (u !== null) {
            n.pending = null;
            var d = (u = u.next);
            do (s = t(s, d.action)), (d = d.next);
            while (d !== u);
            de(s, e.memoizedState) || (qt = !0),
                (e.memoizedState = s),
                e.baseQueue === null && (e.baseState = s),
                (n.lastRenderedState = s);
        }
        return [s, l];
    }
    function ef(t, e, n) {
        var l = ct,
            u = Yt(),
            s = St;
        if (s) {
            if (n === void 0) throw Error(r(407));
            n = n();
        } else n = e();
        var d = !de((Rt || u).memoizedState, n);
        if (
            (d && ((u.memoizedState = n), (qt = !0)),
            (u = u.queue),
            co(lf.bind(null, l, u, t), [t]),
            u.getSnapshot !== e || d || (Ft !== null && Ft.memoizedState.tag & 1))
        ) {
            if (((l.flags |= 2048), Wa(9, af.bind(null, l, u, n, e), { destroy: void 0 }, null), Dt === null))
                throw Error(r(349));
            s || (wn & 60) !== 0 || nf(l, e, n);
        }
        return n;
    }
    function nf(t, e, n) {
        (t.flags |= 16384),
            (t = { getSnapshot: e, value: n }),
            (e = ct.updateQueue),
            e === null
                ? ((e = sr()), (ct.updateQueue = e), (e.stores = [t]))
                : ((n = e.stores), n === null ? (e.stores = [t]) : n.push(t));
    }
    function af(t, e, n, l) {
        (e.value = n), (e.getSnapshot = l), rf(e) && uf(t);
    }
    function lf(t, e, n) {
        return n(function () {
            rf(e) && uf(t);
        });
    }
    function rf(t) {
        var e = t.getSnapshot;
        t = t.value;
        try {
            var n = e();
            return !de(t, n);
        } catch {
            return !0;
        }
    }
    function uf(t) {
        var e = xn(t, 2);
        e !== null && ie(e, t, 2);
    }
    function oo(t) {
        var e = se();
        if (typeof t == "function") {
            var n = t;
            if (((t = n()), sa)) {
                Sn(!0);
                try {
                    n();
                } finally {
                    Sn(!1);
                }
            }
        }
        return (
            (e.memoizedState = e.baseState = t),
            (e.queue = { pending: null, lanes: 0, dispatch: null, lastRenderedReducer: un, lastRenderedState: t }),
            e
        );
    }
    function of(t, e, n, l) {
        return (t.baseState = n), ro(t, Rt, typeof l == "function" ? l : un);
    }
    function M8(t, e, n, l, u) {
        if (mr(t)) throw Error(r(485));
        if (((t = e.action), t !== null)) {
            var s = {
                payload: u,
                action: t,
                next: null,
                isTransition: !0,
                status: "pending",
                value: null,
                reason: null,
                listeners: [],
                then: function (d) {
                    s.listeners.push(d);
                },
            };
            P.T !== null ? n(!0) : (s.isTransition = !1),
                l(s),
                (n = e.pending),
                n === null ? ((s.next = e.pending = s), sf(e, s)) : ((s.next = n.next), (e.pending = n.next = s));
        }
    }
    function sf(t, e) {
        var n = e.action,
            l = e.payload,
            u = t.state;
        if (e.isTransition) {
            var s = P.T,
                d = {};
            P.T = d;
            try {
                var y = n(u, l),
                    b = P.S;
                b !== null && b(d, y), cf(t, e, y);
            } catch (M) {
                so(t, e, M);
            } finally {
                P.T = s;
            }
        } else
            try {
                (s = n(u, l)), cf(t, e, s);
            } catch (M) {
                so(t, e, M);
            }
    }
    function cf(t, e, n) {
        n !== null && typeof n == "object" && typeof n.then == "function"
            ? n.then(
                  function (l) {
                      ff(t, e, l);
                  },
                  function (l) {
                      return so(t, e, l);
                  }
              )
            : ff(t, e, n);
    }
    function ff(t, e, n) {
        (e.status = "fulfilled"),
            (e.value = n),
            hf(e),
            (t.state = n),
            (e = t.pending),
            e !== null && ((n = e.next), n === e ? (t.pending = null) : ((n = n.next), (e.next = n), sf(t, n)));
    }
    function so(t, e, n) {
        var l = t.pending;
        if (((t.pending = null), l !== null)) {
            l = l.next;
            do (e.status = "rejected"), (e.reason = n), hf(e), (e = e.next);
            while (e !== l);
        }
        t.action = null;
    }
    function hf(t) {
        t = t.listeners;
        for (var e = 0; e < t.length; e++) (0, t[e])();
    }
    function df(t, e) {
        return e;
    }
    function mf(t, e) {
        if (St) {
            var n = Dt.formState;
            if (n !== null) {
                t: {
                    var l = ct;
                    if (St) {
                        if (Jt) {
                            e: {
                                for (var u = Jt, s = je; u.nodeType !== 8; ) {
                                    if (!s) {
                                        u = null;
                                        break e;
                                    }
                                    if (((u = ze(u.nextSibling)), u === null)) {
                                        u = null;
                                        break e;
                                    }
                                }
                                (s = u.data), (u = s === "F!" || s === "F" ? u : null);
                            }
                            if (u) {
                                (Jt = ze(u.nextSibling)), (l = u.data === "F!");
                                break t;
                            }
                        }
                        ra(l);
                    }
                    l = !1;
                }
                l && (e = n[0]);
            }
        }
        return (
            (n = se()),
            (n.memoizedState = n.baseState = e),
            (l = { pending: null, lanes: 0, dispatch: null, lastRenderedReducer: df, lastRenderedState: e }),
            (n.queue = l),
            (n = Df.bind(null, ct, l)),
            (l.dispatch = n),
            (l = oo(!1)),
            (s = go.bind(null, ct, !1, l.queue)),
            (l = se()),
            (u = { state: e, dispatch: null, action: t, pending: null }),
            (l.queue = u),
            (n = M8.bind(null, ct, u, s, n)),
            (u.dispatch = n),
            (l.memoizedState = t),
            [e, n, !1]
        );
    }
    function vf(t) {
        var e = Yt();
        return gf(e, Rt, t);
    }
    function gf(t, e, n) {
        (e = ro(t, e, df)[0]),
            (t = fr(un)[0]),
            (e = typeof e == "object" && e !== null && typeof e.then == "function" ? Fl(e) : e);
        var l = Yt(),
            u = l.queue,
            s = u.dispatch;
        return (
            n !== l.memoizedState && ((ct.flags |= 2048), Wa(9, R8.bind(null, u, n), { destroy: void 0 }, null)),
            [e, s, t]
        );
    }
    function R8(t, e) {
        t.action = e;
    }
    function pf(t) {
        var e = Yt(),
            n = Rt;
        if (n !== null) return gf(e, n, t);
        Yt(), (e = e.memoizedState), (n = Yt());
        var l = n.queue.dispatch;
        return (n.memoizedState = t), [e, l, !1];
    }
    function Wa(t, e, n, l) {
        return (
            (t = { tag: t, create: e, inst: n, deps: l, next: null }),
            (e = ct.updateQueue),
            e === null && ((e = sr()), (ct.updateQueue = e)),
            (n = e.lastEffect),
            n === null ? (e.lastEffect = t.next = t) : ((l = n.next), (n.next = t), (t.next = l), (e.lastEffect = t)),
            t
        );
    }
    function yf() {
        return Yt().memoizedState;
    }
    function hr(t, e, n, l) {
        var u = se();
        (ct.flags |= t), (u.memoizedState = Wa(1 | e, n, { destroy: void 0 }, l === void 0 ? null : l));
    }
    function dr(t, e, n, l) {
        var u = Yt();
        l = l === void 0 ? null : l;
        var s = u.memoizedState.inst;
        Rt !== null && l !== null && to(l, Rt.memoizedState.deps)
            ? (u.memoizedState = Wa(e, n, s, l))
            : ((ct.flags |= t), (u.memoizedState = Wa(1 | e, n, s, l)));
    }
    function Af(t, e) {
        hr(8390656, 8, t, e);
    }
    function co(t, e) {
        dr(2048, 8, t, e);
    }
    function bf(t, e) {
        return dr(4, 2, t, e);
    }
    function Ef(t, e) {
        return dr(4, 4, t, e);
    }
    function Sf(t, e) {
        if (typeof e == "function") {
            t = t();
            var n = e(t);
            return function () {
                typeof n == "function" ? n() : e(null);
            };
        }
        if (e != null)
            return (
                (t = t()),
                (e.current = t),
                function () {
                    e.current = null;
                }
            );
    }
    function Cf(t, e, n) {
        (n = n != null ? n.concat([t]) : null), dr(4, 4, Sf.bind(null, e, t), n);
    }
    function fo() {}
    function Tf(t, e) {
        var n = Yt();
        e = e === void 0 ? null : e;
        var l = n.memoizedState;
        return e !== null && to(e, l[1]) ? l[0] : ((n.memoizedState = [t, e]), t);
    }
    function xf(t, e) {
        var n = Yt();
        e = e === void 0 ? null : e;
        var l = n.memoizedState;
        if (e !== null && to(e, l[1])) return l[0];
        if (((l = t()), sa)) {
            Sn(!0);
            try {
                t();
            } finally {
                Sn(!1);
            }
        }
        return (n.memoizedState = [l, e]), l;
    }
    function ho(t, e, n) {
        return n === void 0 || (wn & 1073741824) !== 0
            ? (t.memoizedState = e)
            : ((t.memoizedState = n), (t = R2()), (ct.lanes |= t), (zn |= t), n);
    }
    function Mf(t, e, n, l) {
        return de(n, e)
            ? n
            : Pa.current !== null
              ? ((t = ho(t, n, l)), de(t, e) || (qt = !0), t)
              : (wn & 42) === 0
                ? ((qt = !0), (t.memoizedState = n))
                : ((t = R2()), (ct.lanes |= t), (zn |= t), e);
    }
    function Rf(t, e, n, l, u) {
        var s = q.p;
        q.p = s !== 0 && 8 > s ? s : 8;
        var d = P.T,
            y = {};
        (P.T = y), go(t, !1, e, n);
        try {
            var b = u(),
                M = P.S;
            if ((M !== null && M(y, b), b !== null && typeof b == "object" && typeof b.then == "function")) {
                var L = C8(b, l);
                Yl(t, e, L, pe(t));
            } else Yl(t, e, l, pe(t));
        } catch (Z) {
            Yl(t, e, { then: function () {}, status: "rejected", reason: Z }, pe());
        } finally {
            (q.p = s), (P.T = d);
        }
    }
    function w8() {}
    function mo(t, e, n, l) {
        if (t.tag !== 5) throw Error(r(476));
        var u = wf(t).queue;
        Rf(
            t,
            u,
            e,
            dt,
            n === null
                ? w8
                : function () {
                      return Of(t), n(l);
                  }
        );
    }
    function wf(t) {
        var e = t.memoizedState;
        if (e !== null) return e;
        e = {
            memoizedState: dt,
            baseState: dt,
            baseQueue: null,
            queue: { pending: null, lanes: 0, dispatch: null, lastRenderedReducer: un, lastRenderedState: dt },
            next: null,
        };
        var n = {};
        return (
            (e.next = {
                memoizedState: n,
                baseState: n,
                baseQueue: null,
                queue: { pending: null, lanes: 0, dispatch: null, lastRenderedReducer: un, lastRenderedState: n },
                next: null,
            }),
            (t.memoizedState = e),
            (t = t.alternate),
            t !== null && (t.memoizedState = e),
            e
        );
    }
    function Of(t) {
        var e = wf(t).next.queue;
        Yl(t, e, {}, pe());
    }
    function vo() {
        return ne(ci);
    }
    function Hf() {
        return Yt().memoizedState;
    }
    function Bf() {
        return Yt().memoizedState;
    }
    function O8(t) {
        for (var e = t.return; e !== null; ) {
            switch (e.tag) {
                case 24:
                case 3:
                    var n = pe();
                    t = Dn(n);
                    var l = _n(e, t, n);
                    l !== null && (ie(l, e, n), kl(l, e, n)), (e = { cache: Wu() }), (t.payload = e);
                    return;
            }
            e = e.return;
        }
    }
    function H8(t, e, n) {
        var l = pe();
        (n = { lane: l, revertLane: 0, action: n, hasEagerState: !1, eagerState: null, next: null }),
            mr(t) ? _f(e, n) : ((n = Yu(t, e, n, l)), n !== null && (ie(n, t, l), Nf(n, e, l)));
    }
    function Df(t, e, n) {
        var l = pe();
        Yl(t, e, n, l);
    }
    function Yl(t, e, n, l) {
        var u = { lane: l, revertLane: 0, action: n, hasEagerState: !1, eagerState: null, next: null };
        if (mr(t)) _f(e, u);
        else {
            var s = t.alternate;
            if (t.lanes === 0 && (s === null || s.lanes === 0) && ((s = e.lastRenderedReducer), s !== null))
                try {
                    var d = e.lastRenderedState,
                        y = s(d, n);
                    if (((u.hasEagerState = !0), (u.eagerState = y), de(y, d)))
                        return Wi(t, e, u, 0), Dt === null && Ki(), !1;
                } catch {
                } finally {
                }
            if (((n = Yu(t, e, u, l)), n !== null)) return ie(n, t, l), Nf(n, e, l), !0;
        }
        return !1;
    }
    function go(t, e, n, l) {
        if (((l = { lane: 2, revertLane: is(), action: l, hasEagerState: !1, eagerState: null, next: null }), mr(t))) {
            if (e) throw Error(r(479));
        } else (e = Yu(t, n, l, 2)), e !== null && ie(e, t, 2);
    }
    function mr(t) {
        var e = t.alternate;
        return t === ct || (e !== null && e === ct);
    }
    function _f(t, e) {
        qa = ur = !0;
        var n = t.pending;
        n === null ? (e.next = e) : ((e.next = n.next), (n.next = e)), (t.pending = e);
    }
    function Nf(t, e, n) {
        if ((n & 4194176) !== 0) {
            var l = e.lanes;
            (l &= t.pendingLanes), (n |= l), (e.lanes = n), Yc(t, n);
        }
    }
    var Ye = {
        readContext: ne,
        use: cr,
        useCallback: jt,
        useContext: jt,
        useEffect: jt,
        useImperativeHandle: jt,
        useLayoutEffect: jt,
        useInsertionEffect: jt,
        useMemo: jt,
        useReducer: jt,
        useRef: jt,
        useState: jt,
        useDebugValue: jt,
        useDeferredValue: jt,
        useTransition: jt,
        useSyncExternalStore: jt,
        useId: jt,
    };
    (Ye.useCacheRefresh = jt),
        (Ye.useMemoCache = jt),
        (Ye.useHostTransitionStatus = jt),
        (Ye.useFormState = jt),
        (Ye.useActionState = jt),
        (Ye.useOptimistic = jt);
    var ca = {
        readContext: ne,
        use: cr,
        useCallback: function (t, e) {
            return (se().memoizedState = [t, e === void 0 ? null : e]), t;
        },
        useContext: ne,
        useEffect: Af,
        useImperativeHandle: function (t, e, n) {
            (n = n != null ? n.concat([t]) : null), hr(4194308, 4, Sf.bind(null, e, t), n);
        },
        useLayoutEffect: function (t, e) {
            return hr(4194308, 4, t, e);
        },
        useInsertionEffect: function (t, e) {
            hr(4, 2, t, e);
        },
        useMemo: function (t, e) {
            var n = se();
            e = e === void 0 ? null : e;
            var l = t();
            if (sa) {
                Sn(!0);
                try {
                    t();
                } finally {
                    Sn(!1);
                }
            }
            return (n.memoizedState = [l, e]), l;
        },
        useReducer: function (t, e, n) {
            var l = se();
            if (n !== void 0) {
                var u = n(e);
                if (sa) {
                    Sn(!0);
                    try {
                        n(e);
                    } finally {
                        Sn(!1);
                    }
                }
            } else u = e;
            return (
                (l.memoizedState = l.baseState = u),
                (t = { pending: null, lanes: 0, dispatch: null, lastRenderedReducer: t, lastRenderedState: u }),
                (l.queue = t),
                (t = t.dispatch = H8.bind(null, ct, t)),
                [l.memoizedState, t]
            );
        },
        useRef: function (t) {
            var e = se();
            return (t = { current: t }), (e.memoizedState = t);
        },
        useState: function (t) {
            t = oo(t);
            var e = t.queue,
                n = Df.bind(null, ct, e);
            return (e.dispatch = n), [t.memoizedState, n];
        },
        useDebugValue: fo,
        useDeferredValue: function (t, e) {
            var n = se();
            return ho(n, t, e);
        },
        useTransition: function () {
            var t = oo(!1);
            return (t = Rf.bind(null, ct, t.queue, !0, !1)), (se().memoizedState = t), [!1, t];
        },
        useSyncExternalStore: function (t, e, n) {
            var l = ct,
                u = se();
            if (St) {
                if (n === void 0) throw Error(r(407));
                n = n();
            } else {
                if (((n = e()), Dt === null)) throw Error(r(349));
                (pt & 60) !== 0 || nf(l, e, n);
            }
            u.memoizedState = n;
            var s = { value: n, getSnapshot: e };
            return (
                (u.queue = s),
                Af(lf.bind(null, l, s, t), [t]),
                (l.flags |= 2048),
                Wa(9, af.bind(null, l, s, n, e), { destroy: void 0 }, null),
                n
            );
        },
        useId: function () {
            var t = se(),
                e = Dt.identifierPrefix;
            if (St) {
                var n = ln,
                    l = an;
                (n = (l & ~(1 << (32 - he(l) - 1))).toString(32) + n),
                    (e = ":" + e + "R" + n),
                    (n = or++),
                    0 < n && (e += "H" + n.toString(32)),
                    (e += ":");
            } else (n = T8++), (e = ":" + e + "r" + n.toString(32) + ":");
            return (t.memoizedState = e);
        },
        useCacheRefresh: function () {
            return (se().memoizedState = O8.bind(null, ct));
        },
    };
    (ca.useMemoCache = io),
        (ca.useHostTransitionStatus = vo),
        (ca.useFormState = mf),
        (ca.useActionState = mf),
        (ca.useOptimistic = function (t) {
            var e = se();
            e.memoizedState = e.baseState = t;
            var n = { pending: null, lanes: 0, dispatch: null, lastRenderedReducer: null, lastRenderedState: null };
            return (e.queue = n), (e = go.bind(null, ct, !0, n)), (n.dispatch = e), [t, e];
        });
    var On = {
        readContext: ne,
        use: cr,
        useCallback: Tf,
        useContext: ne,
        useEffect: co,
        useImperativeHandle: Cf,
        useInsertionEffect: bf,
        useLayoutEffect: Ef,
        useMemo: xf,
        useReducer: fr,
        useRef: yf,
        useState: function () {
            return fr(un);
        },
        useDebugValue: fo,
        useDeferredValue: function (t, e) {
            var n = Yt();
            return Mf(n, Rt.memoizedState, t, e);
        },
        useTransition: function () {
            var t = fr(un)[0],
                e = Yt().memoizedState;
            return [typeof t == "boolean" ? t : Fl(t), e];
        },
        useSyncExternalStore: ef,
        useId: Hf,
    };
    (On.useCacheRefresh = Bf),
        (On.useMemoCache = io),
        (On.useHostTransitionStatus = vo),
        (On.useFormState = vf),
        (On.useActionState = vf),
        (On.useOptimistic = function (t, e) {
            var n = Yt();
            return of(n, Rt, t, e);
        });
    var fa = {
        readContext: ne,
        use: cr,
        useCallback: Tf,
        useContext: ne,
        useEffect: co,
        useImperativeHandle: Cf,
        useInsertionEffect: bf,
        useLayoutEffect: Ef,
        useMemo: xf,
        useReducer: uo,
        useRef: yf,
        useState: function () {
            return uo(un);
        },
        useDebugValue: fo,
        useDeferredValue: function (t, e) {
            var n = Yt();
            return Rt === null ? ho(n, t, e) : Mf(n, Rt.memoizedState, t, e);
        },
        useTransition: function () {
            var t = uo(un)[0],
                e = Yt().memoizedState;
            return [typeof t == "boolean" ? t : Fl(t), e];
        },
        useSyncExternalStore: ef,
        useId: Hf,
    };
    (fa.useCacheRefresh = Bf),
        (fa.useMemoCache = io),
        (fa.useHostTransitionStatus = vo),
        (fa.useFormState = pf),
        (fa.useActionState = pf),
        (fa.useOptimistic = function (t, e) {
            var n = Yt();
            return Rt !== null ? of(n, Rt, t, e) : ((n.baseState = t), [t, n.queue.dispatch]);
        });
    function po(t, e, n, l) {
        (e = t.memoizedState),
            (n = n(l, e)),
            (n = n == null ? e : K({}, e, n)),
            (t.memoizedState = n),
            t.lanes === 0 && (t.updateQueue.baseState = n);
    }
    var yo = {
        isMounted: function (t) {
            return (t = t._reactInternals) ? I(t) === t : !1;
        },
        enqueueSetState: function (t, e, n) {
            t = t._reactInternals;
            var l = pe(),
                u = Dn(l);
            (u.payload = e), n != null && (u.callback = n), (e = _n(t, u, l)), e !== null && (ie(e, t, l), kl(e, t, l));
        },
        enqueueReplaceState: function (t, e, n) {
            t = t._reactInternals;
            var l = pe(),
                u = Dn(l);
            (u.tag = 1),
                (u.payload = e),
                n != null && (u.callback = n),
                (e = _n(t, u, l)),
                e !== null && (ie(e, t, l), kl(e, t, l));
        },
        enqueueForceUpdate: function (t, e) {
            t = t._reactInternals;
            var n = pe(),
                l = Dn(n);
            (l.tag = 2), e != null && (l.callback = e), (e = _n(t, l, n)), e !== null && (ie(e, t, n), kl(e, t, n));
        },
    };
    function Lf(t, e, n, l, u, s, d) {
        return (
            (t = t.stateNode),
            typeof t.shouldComponentUpdate == "function"
                ? t.shouldComponentUpdate(l, s, d)
                : e.prototype && e.prototype.isPureReactComponent
                  ? !Bl(n, l) || !Bl(u, s)
                  : !0
        );
    }
    function Uf(t, e, n, l) {
        (t = e.state),
            typeof e.componentWillReceiveProps == "function" && e.componentWillReceiveProps(n, l),
            typeof e.UNSAFE_componentWillReceiveProps == "function" && e.UNSAFE_componentWillReceiveProps(n, l),
            e.state !== t && yo.enqueueReplaceState(e, e.state, null);
    }
    function ha(t, e) {
        var n = e;
        if ("ref" in e) {
            n = {};
            for (var l in e) l !== "ref" && (n[l] = e[l]);
        }
        if ((t = t.defaultProps)) {
            n === e && (n = K({}, n));
            for (var u in t) n[u] === void 0 && (n[u] = t[u]);
        }
        return n;
    }
    var vr =
        typeof reportError == "function"
            ? reportError
            : function (t) {
                  if (typeof window == "object" && typeof window.ErrorEvent == "function") {
                      var e = new window.ErrorEvent("error", {
                          bubbles: !0,
                          cancelable: !0,
                          message:
                              typeof t == "object" && t !== null && typeof t.message == "string"
                                  ? String(t.message)
                                  : String(t),
                          error: t,
                      });
                      if (!window.dispatchEvent(e)) return;
                  } else if (typeof process == "object" && typeof process.emit == "function") {
                      process.emit("uncaughtException", t);
                      return;
                  }
                  console.error(t);
              };
    function Vf(t) {
        vr(t);
    }
    function zf(t) {
        console.error(t);
    }
    function Gf(t) {
        vr(t);
    }
    function gr(t, e) {
        try {
            var n = t.onUncaughtError;
            n(e.value, { componentStack: e.stack });
        } catch (l) {
            setTimeout(function () {
                throw l;
            });
        }
    }
    function Qf(t, e, n) {
        try {
            var l = t.onCaughtError;
            l(n.value, { componentStack: n.stack, errorBoundary: e.tag === 1 ? e.stateNode : null });
        } catch (u) {
            setTimeout(function () {
                throw u;
            });
        }
    }
    function Ao(t, e, n) {
        return (
            (n = Dn(n)),
            (n.tag = 3),
            (n.payload = { element: null }),
            (n.callback = function () {
                gr(t, e);
            }),
            n
        );
    }
    function Zf(t) {
        return (t = Dn(t)), (t.tag = 3), t;
    }
    function jf(t, e, n, l) {
        var u = n.type.getDerivedStateFromError;
        if (typeof u == "function") {
            var s = l.value;
            (t.payload = function () {
                return u(s);
            }),
                (t.callback = function () {
                    Qf(e, n, l);
                });
        }
        var d = n.stateNode;
        d !== null &&
            typeof d.componentDidCatch == "function" &&
            (t.callback = function () {
                Qf(e, n, l), typeof u != "function" && (Gn === null ? (Gn = new Set([this])) : Gn.add(this));
                var y = l.stack;
                this.componentDidCatch(l.value, { componentStack: y !== null ? y : "" });
            });
    }
    function B8(t, e, n, l, u) {
        if (((n.flags |= 32768), l !== null && typeof l == "object" && typeof l.then == "function")) {
            if (((e = n.alternate), e !== null && Pl(e, n, u, !0), (n = Re.current), n !== null)) {
                switch (n.tag) {
                    case 13:
                        return (
                            Fe === null ? ts() : n.alternate === null && Gt === 0 && (Gt = 3),
                            (n.flags &= -257),
                            (n.flags |= 65536),
                            (n.lanes = u),
                            l === Xu
                                ? (n.flags |= 16384)
                                : ((e = n.updateQueue),
                                  e === null ? (n.updateQueue = new Set([l])) : e.add(l),
                                  ns(t, l, u)),
                            !1
                        );
                    case 22:
                        return (
                            (n.flags |= 65536),
                            l === Xu
                                ? (n.flags |= 16384)
                                : ((e = n.updateQueue),
                                  e === null
                                      ? ((e = { transitions: null, markerInstances: null, retryQueue: new Set([l]) }),
                                        (n.updateQueue = e))
                                      : ((n = e.retryQueue), n === null ? (e.retryQueue = new Set([l])) : n.add(l)),
                                  ns(t, l, u)),
                            !1
                        );
                }
                throw Error(r(435, n.tag));
            }
            return ns(t, l, u), ts(), !1;
        }
        if (St)
            return (
                (e = Re.current),
                e !== null
                    ? ((e.flags & 65536) === 0 && (e.flags |= 256),
                      (e.flags |= 65536),
                      (e.lanes = u),
                      l !== ku && ((t = Error(r(422), { cause: l })), Ll(Te(t, n))))
                    : (l !== ku && ((e = Error(r(423), { cause: l })), Ll(Te(e, n))),
                      (t = t.current.alternate),
                      (t.flags |= 65536),
                      (u &= -u),
                      (t.lanes |= u),
                      (l = Te(l, n)),
                      (u = Ao(t.stateNode, l, u)),
                      No(t, u),
                      Gt !== 4 && (Gt = 2)),
                !1
            );
        var s = Error(r(520), { cause: l });
        if (((s = Te(s, n)), ei === null ? (ei = [s]) : ei.push(s), Gt !== 4 && (Gt = 2), e === null)) return !0;
        (l = Te(l, n)), (n = e);
        do {
            switch (n.tag) {
                case 3:
                    return (n.flags |= 65536), (t = u & -u), (n.lanes |= t), (t = Ao(n.stateNode, l, t)), No(n, t), !1;
                case 1:
                    if (
                        ((e = n.type),
                        (s = n.stateNode),
                        (n.flags & 128) === 0 &&
                            (typeof e.getDerivedStateFromError == "function" ||
                                (s !== null &&
                                    typeof s.componentDidCatch == "function" &&
                                    (Gn === null || !Gn.has(s)))))
                    )
                        return (n.flags |= 65536), (u &= -u), (n.lanes |= u), (u = Zf(u)), jf(u, t, n, l), No(n, u), !1;
            }
            n = n.return;
        } while (n !== null);
        return !1;
    }
    var Ff = Error(r(461)),
        qt = !1;
    function $t(t, e, n, l) {
        e.child = t === null ? k1(e, null, n, l) : ua(e, t.child, n, l);
    }
    function Yf(t, e, n, l, u) {
        n = n.render;
        var s = e.ref;
        if ("ref" in l) {
            var d = {};
            for (var y in l) y !== "ref" && (d[y] = l[y]);
        } else d = l;
        return (
            ma(e),
            (l = eo(t, e, n, d, s, u)),
            (y = no()),
            t !== null && !qt ? (ao(t, e, u), on(t, e, u)) : (St && y && Iu(e), (e.flags |= 1), $t(t, e, l, u), e.child)
        );
    }
    function If(t, e, n, l, u) {
        if (t === null) {
            var s = n.type;
            return typeof s == "function" && !jo(s) && s.defaultProps === void 0 && n.compare === null
                ? ((e.tag = 15), (e.type = s), Pf(t, e, s, l, u))
                : ((t = Er(n.type, null, l, e, e.mode, u)), (t.ref = e.ref), (t.return = e), (e.child = t));
        }
        if (((s = t.child), !wo(t, u))) {
            var d = s.memoizedProps;
            if (((n = n.compare), (n = n !== null ? n : Bl), n(d, l) && t.ref === e.ref)) return on(t, e, u);
        }
        return (e.flags |= 1), (t = Vn(s, l)), (t.ref = e.ref), (t.return = e), (e.child = t);
    }
    function Pf(t, e, n, l, u) {
        if (t !== null) {
            var s = t.memoizedProps;
            if (Bl(s, l) && t.ref === e.ref)
                if (((qt = !1), (e.pendingProps = l = s), wo(t, u))) (t.flags & 131072) !== 0 && (qt = !0);
                else return (e.lanes = t.lanes), on(t, e, u);
        }
        return bo(t, e, n, l, u);
    }
    function kf(t, e, n) {
        var l = e.pendingProps,
            u = l.children,
            s = (e.stateNode._pendingVisibility & 2) !== 0,
            d = t !== null ? t.memoizedState : null;
        if ((Il(t, e), l.mode === "hidden" || s)) {
            if ((e.flags & 128) !== 0) {
                if (((l = d !== null ? d.baseLanes | n : n), t !== null)) {
                    for (u = e.child = t.child, s = 0; u !== null; ) (s = s | u.lanes | u.childLanes), (u = u.sibling);
                    e.childLanes = s & ~l;
                } else (e.childLanes = 0), (e.child = null);
                return Xf(t, e, l, n);
            }
            if ((n & 536870912) !== 0)
                (e.memoizedState = { baseLanes: 0, cachePool: null }),
                    t !== null && rr(e, d !== null ? d.cachePool : null),
                    d !== null ? X1(e, d) : qu(),
                    q1(e);
            else return (e.lanes = e.childLanes = 536870912), Xf(t, e, d !== null ? d.baseLanes | n : n, n);
        } else
            d !== null
                ? (rr(e, d.cachePool), X1(e, d), Rn(), (e.memoizedState = null))
                : (t !== null && rr(e, null), qu(), Rn());
        return $t(t, e, u, n), e.child;
    }
    function Xf(t, e, n, l) {
        var u = $u();
        return (
            (u = u === null ? null : { parent: kt._currentValue, pool: u }),
            (e.memoizedState = { baseLanes: n, cachePool: u }),
            t !== null && rr(e, null),
            qu(),
            q1(e),
            t !== null && Pl(t, e, l, !0),
            null
        );
    }
    function Il(t, e) {
        var n = e.ref;
        if (n === null) t !== null && t.ref !== null && (e.flags |= 2097664);
        else {
            if (typeof n != "function" && typeof n != "object") throw Error(r(284));
            (t === null || t.ref !== n) && (e.flags |= 2097664);
        }
    }
    function bo(t, e, n, l, u) {
        return (
            ma(e),
            (n = eo(t, e, n, l, void 0, u)),
            (l = no()),
            t !== null && !qt ? (ao(t, e, u), on(t, e, u)) : (St && l && Iu(e), (e.flags |= 1), $t(t, e, n, u), e.child)
        );
    }
    function qf(t, e, n, l, u, s) {
        return (
            ma(e),
            (e.updateQueue = null),
            (n = tf(e, l, n, u)),
            $1(t),
            (l = no()),
            t !== null && !qt ? (ao(t, e, s), on(t, e, s)) : (St && l && Iu(e), (e.flags |= 1), $t(t, e, n, s), e.child)
        );
    }
    function Kf(t, e, n, l, u) {
        if ((ma(e), e.stateNode === null)) {
            var s = ja,
                d = n.contextType;
            typeof d == "object" && d !== null && (s = ne(d)),
                (s = new n(l, s)),
                (e.memoizedState = s.state !== null && s.state !== void 0 ? s.state : null),
                (s.updater = yo),
                (e.stateNode = s),
                (s._reactInternals = e),
                (s = e.stateNode),
                (s.props = l),
                (s.state = e.memoizedState),
                (s.refs = {}),
                Do(e),
                (d = n.contextType),
                (s.context = typeof d == "object" && d !== null ? ne(d) : ja),
                (s.state = e.memoizedState),
                (d = n.getDerivedStateFromProps),
                typeof d == "function" && (po(e, n, d, l), (s.state = e.memoizedState)),
                typeof n.getDerivedStateFromProps == "function" ||
                    typeof s.getSnapshotBeforeUpdate == "function" ||
                    (typeof s.UNSAFE_componentWillMount != "function" && typeof s.componentWillMount != "function") ||
                    ((d = s.state),
                    typeof s.componentWillMount == "function" && s.componentWillMount(),
                    typeof s.UNSAFE_componentWillMount == "function" && s.UNSAFE_componentWillMount(),
                    d !== s.state && yo.enqueueReplaceState(s, s.state, null),
                    ql(e, l, s, u),
                    Xl(),
                    (s.state = e.memoizedState)),
                typeof s.componentDidMount == "function" && (e.flags |= 4194308),
                (l = !0);
        } else if (t === null) {
            s = e.stateNode;
            var y = e.memoizedProps,
                b = ha(n, y);
            s.props = b;
            var M = s.context,
                L = n.contextType;
            (d = ja), typeof L == "object" && L !== null && (d = ne(L));
            var Z = n.getDerivedStateFromProps;
            (L = typeof Z == "function" || typeof s.getSnapshotBeforeUpdate == "function"),
                (y = e.pendingProps !== y),
                L ||
                    (typeof s.UNSAFE_componentWillReceiveProps != "function" &&
                        typeof s.componentWillReceiveProps != "function") ||
                    ((y || M !== d) && Uf(e, s, l, d)),
                (Bn = !1);
            var B = e.memoizedState;
            (s.state = B),
                ql(e, l, s, u),
                Xl(),
                (M = e.memoizedState),
                y || B !== M || Bn
                    ? (typeof Z == "function" && (po(e, n, Z, l), (M = e.memoizedState)),
                      (b = Bn || Lf(e, n, b, l, B, M, d))
                          ? (L ||
                                (typeof s.UNSAFE_componentWillMount != "function" &&
                                    typeof s.componentWillMount != "function") ||
                                (typeof s.componentWillMount == "function" && s.componentWillMount(),
                                typeof s.UNSAFE_componentWillMount == "function" && s.UNSAFE_componentWillMount()),
                            typeof s.componentDidMount == "function" && (e.flags |= 4194308))
                          : (typeof s.componentDidMount == "function" && (e.flags |= 4194308),
                            (e.memoizedProps = l),
                            (e.memoizedState = M)),
                      (s.props = l),
                      (s.state = M),
                      (s.context = d),
                      (l = b))
                    : (typeof s.componentDidMount == "function" && (e.flags |= 4194308), (l = !1));
        } else {
            (s = e.stateNode),
                _o(t, e),
                (d = e.memoizedProps),
                (L = ha(n, d)),
                (s.props = L),
                (Z = e.pendingProps),
                (B = s.context),
                (M = n.contextType),
                (b = ja),
                typeof M == "object" && M !== null && (b = ne(M)),
                (y = n.getDerivedStateFromProps),
                (M = typeof y == "function" || typeof s.getSnapshotBeforeUpdate == "function") ||
                    (typeof s.UNSAFE_componentWillReceiveProps != "function" &&
                        typeof s.componentWillReceiveProps != "function") ||
                    ((d !== Z || B !== b) && Uf(e, s, l, b)),
                (Bn = !1),
                (B = e.memoizedState),
                (s.state = B),
                ql(e, l, s, u),
                Xl();
            var N = e.memoizedState;
            d !== Z || B !== N || Bn || (t !== null && t.dependencies !== null && pr(t.dependencies))
                ? (typeof y == "function" && (po(e, n, y, l), (N = e.memoizedState)),
                  (L = Bn || Lf(e, n, L, l, B, N, b) || (t !== null && t.dependencies !== null && pr(t.dependencies)))
                      ? (M ||
                            (typeof s.UNSAFE_componentWillUpdate != "function" &&
                                typeof s.componentWillUpdate != "function") ||
                            (typeof s.componentWillUpdate == "function" && s.componentWillUpdate(l, N, b),
                            typeof s.UNSAFE_componentWillUpdate == "function" && s.UNSAFE_componentWillUpdate(l, N, b)),
                        typeof s.componentDidUpdate == "function" && (e.flags |= 4),
                        typeof s.getSnapshotBeforeUpdate == "function" && (e.flags |= 1024))
                      : (typeof s.componentDidUpdate != "function" ||
                            (d === t.memoizedProps && B === t.memoizedState) ||
                            (e.flags |= 4),
                        typeof s.getSnapshotBeforeUpdate != "function" ||
                            (d === t.memoizedProps && B === t.memoizedState) ||
                            (e.flags |= 1024),
                        (e.memoizedProps = l),
                        (e.memoizedState = N)),
                  (s.props = l),
                  (s.state = N),
                  (s.context = b),
                  (l = L))
                : (typeof s.componentDidUpdate != "function" ||
                      (d === t.memoizedProps && B === t.memoizedState) ||
                      (e.flags |= 4),
                  typeof s.getSnapshotBeforeUpdate != "function" ||
                      (d === t.memoizedProps && B === t.memoizedState) ||
                      (e.flags |= 1024),
                  (l = !1));
        }
        return (
            (s = l),
            Il(t, e),
            (l = (e.flags & 128) !== 0),
            s || l
                ? ((s = e.stateNode),
                  (n = l && typeof n.getDerivedStateFromError != "function" ? null : s.render()),
                  (e.flags |= 1),
                  t !== null && l
                      ? ((e.child = ua(e, t.child, null, u)), (e.child = ua(e, null, n, u)))
                      : $t(t, e, n, u),
                  (e.memoizedState = s.state),
                  (t = e.child))
                : (t = on(t, e, u)),
            t
        );
    }
    function Wf(t, e, n, l) {
        return Nl(), (e.flags |= 256), $t(t, e, n, l), e.child;
    }
    var Eo = { dehydrated: null, treeContext: null, retryLane: 0 };
    function So(t) {
        return { baseLanes: t, cachePool: J1() };
    }
    function Co(t, e, n) {
        return (t = t !== null ? t.childLanes & ~n : 0), e && (t |= Be), t;
    }
    function Jf(t, e, n) {
        var l = e.pendingProps,
            u = !1,
            s = (e.flags & 128) !== 0,
            d;
        if (
            ((d = s) || (d = t !== null && t.memoizedState === null ? !1 : (Pt.current & 2) !== 0),
            d && ((u = !0), (e.flags &= -129)),
            (d = (e.flags & 32) !== 0),
            (e.flags &= -33),
            t === null)
        ) {
            if (St) {
                if ((u ? Mn(e) : Rn(), St)) {
                    var y = Jt,
                        b;
                    if ((b = y)) {
                        t: {
                            for (b = y, y = je; b.nodeType !== 8; ) {
                                if (!y) {
                                    y = null;
                                    break t;
                                }
                                if (((b = ze(b.nextSibling)), b === null)) {
                                    y = null;
                                    break t;
                                }
                            }
                            y = b;
                        }
                        y !== null
                            ? ((e.memoizedState = {
                                  dehydrated: y,
                                  treeContext: la !== null ? { id: an, overflow: ln } : null,
                                  retryLane: 536870912,
                              }),
                              (b = He(18, null, null, 0)),
                              (b.stateNode = y),
                              (b.return = e),
                              (e.child = b),
                              (le = e),
                              (Jt = null),
                              (b = !0))
                            : (b = !1);
                    }
                    b || ra(e);
                }
                if (((y = e.memoizedState), y !== null && ((y = y.dehydrated), y !== null)))
                    return y.data === "$!" ? (e.lanes = 16) : (e.lanes = 536870912), null;
                rn(e);
            }
            return (
                (y = l.children),
                (l = l.fallback),
                u
                    ? (Rn(),
                      (u = e.mode),
                      (y = xo({ mode: "hidden", children: y }, u)),
                      (l = ga(l, u, n, null)),
                      (y.return = e),
                      (l.return = e),
                      (y.sibling = l),
                      (e.child = y),
                      (u = e.child),
                      (u.memoizedState = So(n)),
                      (u.childLanes = Co(t, d, n)),
                      (e.memoizedState = Eo),
                      l)
                    : (Mn(e), To(e, y))
            );
        }
        if (((b = t.memoizedState), b !== null && ((y = b.dehydrated), y !== null))) {
            if (s)
                e.flags & 256
                    ? (Mn(e), (e.flags &= -257), (e = Mo(t, e, n)))
                    : e.memoizedState !== null
                      ? (Rn(), (e.child = t.child), (e.flags |= 128), (e = null))
                      : (Rn(),
                        (u = l.fallback),
                        (y = e.mode),
                        (l = xo({ mode: "visible", children: l.children }, y)),
                        (u = ga(u, y, n, null)),
                        (u.flags |= 2),
                        (l.return = e),
                        (u.return = e),
                        (l.sibling = u),
                        (e.child = l),
                        ua(e, t.child, null, n),
                        (l = e.child),
                        (l.memoizedState = So(n)),
                        (l.childLanes = Co(t, d, n)),
                        (e.memoizedState = Eo),
                        (e = u));
            else if ((Mn(e), y.data === "$!")) {
                if (((d = y.nextSibling && y.nextSibling.dataset), d)) var M = d.dgst;
                (d = M),
                    (l = Error(r(419))),
                    (l.stack = ""),
                    (l.digest = d),
                    Ll({ value: l, source: null, stack: null }),
                    (e = Mo(t, e, n));
            } else if ((qt || Pl(t, e, n, !1), (d = (n & t.childLanes) !== 0), qt || d)) {
                if (((d = Dt), d !== null)) {
                    if (((l = n & -n), (l & 42) !== 0)) l = 1;
                    else
                        switch (l) {
                            case 2:
                                l = 1;
                                break;
                            case 8:
                                l = 4;
                                break;
                            case 32:
                                l = 16;
                                break;
                            case 128:
                            case 256:
                            case 512:
                            case 1024:
                            case 2048:
                            case 4096:
                            case 8192:
                            case 16384:
                            case 32768:
                            case 65536:
                            case 131072:
                            case 262144:
                            case 524288:
                            case 1048576:
                            case 2097152:
                            case 4194304:
                            case 8388608:
                            case 16777216:
                            case 33554432:
                                l = 64;
                                break;
                            case 268435456:
                                l = 134217728;
                                break;
                            default:
                                l = 0;
                        }
                    if (((l = (l & (d.suspendedLanes | n)) !== 0 ? 0 : l), l !== 0 && l !== b.retryLane))
                        throw ((b.retryLane = l), xn(t, l), ie(d, t, l), Ff);
                }
                y.data === "$?" || ts(), (e = Mo(t, e, n));
            } else
                y.data === "$?"
                    ? ((e.flags |= 128), (e.child = t.child), (e = P8.bind(null, t)), (y._reactRetry = e), (e = null))
                    : ((t = b.treeContext),
                      (Jt = ze(y.nextSibling)),
                      (le = e),
                      (St = !0),
                      (Ue = null),
                      (je = !1),
                      t !== null &&
                          ((xe[Me++] = an), (xe[Me++] = ln), (xe[Me++] = la), (an = t.id), (ln = t.overflow), (la = e)),
                      (e = To(e, l.children)),
                      (e.flags |= 4096));
            return e;
        }
        return u
            ? (Rn(),
              (u = l.fallback),
              (y = e.mode),
              (b = t.child),
              (M = b.sibling),
              (l = Vn(b, { mode: "hidden", children: l.children })),
              (l.subtreeFlags = b.subtreeFlags & 31457280),
              M !== null ? (u = Vn(M, u)) : ((u = ga(u, y, n, null)), (u.flags |= 2)),
              (u.return = e),
              (l.return = e),
              (l.sibling = u),
              (e.child = l),
              (l = u),
              (u = e.child),
              (y = t.child.memoizedState),
              y === null
                  ? (y = So(n))
                  : ((b = y.cachePool),
                    b !== null
                        ? ((M = kt._currentValue), (b = b.parent !== M ? { parent: M, pool: M } : b))
                        : (b = J1()),
                    (y = { baseLanes: y.baseLanes | n, cachePool: b })),
              (u.memoizedState = y),
              (u.childLanes = Co(t, d, n)),
              (e.memoizedState = Eo),
              l)
            : (Mn(e),
              (n = t.child),
              (t = n.sibling),
              (n = Vn(n, { mode: "visible", children: l.children })),
              (n.return = e),
              (n.sibling = null),
              t !== null && ((d = e.deletions), d === null ? ((e.deletions = [t]), (e.flags |= 16)) : d.push(t)),
              (e.child = n),
              (e.memoizedState = null),
              n);
    }
    function To(t, e) {
        return (e = xo({ mode: "visible", children: e }, t.mode)), (e.return = t), (t.child = e);
    }
    function xo(t, e) {
        return T2(t, e, 0, null);
    }
    function Mo(t, e, n) {
        return (
            ua(e, t.child, null, n), (t = To(e, e.pendingProps.children)), (t.flags |= 2), (e.memoizedState = null), t
        );
    }
    function $f(t, e, n) {
        t.lanes |= e;
        var l = t.alternate;
        l !== null && (l.lanes |= e), Ho(t.return, e, n);
    }
    function Ro(t, e, n, l, u) {
        var s = t.memoizedState;
        s === null
            ? (t.memoizedState = {
                  isBackwards: e,
                  rendering: null,
                  renderingStartTime: 0,
                  last: l,
                  tail: n,
                  tailMode: u,
              })
            : ((s.isBackwards = e),
              (s.rendering = null),
              (s.renderingStartTime = 0),
              (s.last = l),
              (s.tail = n),
              (s.tailMode = u));
    }
    function t2(t, e, n) {
        var l = e.pendingProps,
            u = l.revealOrder,
            s = l.tail;
        if (($t(t, e, l.children, n), (l = Pt.current), (l & 2) !== 0)) (l = (l & 1) | 2), (e.flags |= 128);
        else {
            if (t !== null && (t.flags & 128) !== 0)
                t: for (t = e.child; t !== null; ) {
                    if (t.tag === 13) t.memoizedState !== null && $f(t, n, e);
                    else if (t.tag === 19) $f(t, n, e);
                    else if (t.child !== null) {
                        (t.child.return = t), (t = t.child);
                        continue;
                    }
                    if (t === e) break t;
                    for (; t.sibling === null; ) {
                        if (t.return === null || t.return === e) break t;
                        t = t.return;
                    }
                    (t.sibling.return = t.return), (t = t.sibling);
                }
            l &= 1;
        }
        switch ((Bt(Pt, l), u)) {
            case "forwards":
                for (n = e.child, u = null; n !== null; )
                    (t = n.alternate), t !== null && ir(t) === null && (u = n), (n = n.sibling);
                (n = u),
                    n === null ? ((u = e.child), (e.child = null)) : ((u = n.sibling), (n.sibling = null)),
                    Ro(e, !1, u, n, s);
                break;
            case "backwards":
                for (n = null, u = e.child, e.child = null; u !== null; ) {
                    if (((t = u.alternate), t !== null && ir(t) === null)) {
                        e.child = u;
                        break;
                    }
                    (t = u.sibling), (u.sibling = n), (n = u), (u = t);
                }
                Ro(e, !0, n, null, s);
                break;
            case "together":
                Ro(e, !1, null, null, void 0);
                break;
            default:
                e.memoizedState = null;
        }
        return e.child;
    }
    function on(t, e, n) {
        if ((t !== null && (e.dependencies = t.dependencies), (zn |= e.lanes), (n & e.childLanes) === 0))
            if (t !== null) {
                if ((Pl(t, e, n, !1), (n & e.childLanes) === 0)) return null;
            } else return null;
        if (t !== null && e.child !== t.child) throw Error(r(153));
        if (e.child !== null) {
            for (t = e.child, n = Vn(t, t.pendingProps), e.child = n, n.return = e; t.sibling !== null; )
                (t = t.sibling), (n = n.sibling = Vn(t, t.pendingProps)), (n.return = e);
            n.sibling = null;
        }
        return e.child;
    }
    function wo(t, e) {
        return (t.lanes & e) !== 0 ? !0 : ((t = t.dependencies), !!(t !== null && pr(t)));
    }
    function D8(t, e, n) {
        switch (e.tag) {
            case 3:
                _i(e, e.stateNode.containerInfo), Hn(e, kt, t.memoizedState.cache), Nl();
                break;
            case 27:
            case 5:
                pu(e);
                break;
            case 4:
                _i(e, e.stateNode.containerInfo);
                break;
            case 10:
                Hn(e, e.type, e.memoizedProps.value);
                break;
            case 13:
                var l = e.memoizedState;
                if (l !== null)
                    return l.dehydrated !== null
                        ? (Mn(e), (e.flags |= 128), null)
                        : (n & e.child.childLanes) !== 0
                          ? Jf(t, e, n)
                          : (Mn(e), (t = on(t, e, n)), t !== null ? t.sibling : null);
                Mn(e);
                break;
            case 19:
                var u = (t.flags & 128) !== 0;
                if (((l = (n & e.childLanes) !== 0), l || (Pl(t, e, n, !1), (l = (n & e.childLanes) !== 0)), u)) {
                    if (l) return t2(t, e, n);
                    e.flags |= 128;
                }
                if (
                    ((u = e.memoizedState),
                    u !== null && ((u.rendering = null), (u.tail = null), (u.lastEffect = null)),
                    Bt(Pt, Pt.current),
                    l)
                )
                    break;
                return null;
            case 22:
            case 23:
                return (e.lanes = 0), kf(t, e, n);
            case 24:
                Hn(e, kt, t.memoizedState.cache);
        }
        return on(t, e, n);
    }
    function e2(t, e, n) {
        if (t !== null)
            if (t.memoizedProps !== e.pendingProps) qt = !0;
            else {
                if (!wo(t, n) && (e.flags & 128) === 0) return (qt = !1), D8(t, e, n);
                qt = (t.flags & 131072) !== 0;
            }
        else (qt = !1), St && (e.flags & 1048576) !== 0 && z1(e, tr, e.index);
        switch (((e.lanes = 0), e.tag)) {
            case 16:
                t: {
                    t = e.pendingProps;
                    var l = e.elementType,
                        u = l._init;
                    if (((l = u(l._payload)), (e.type = l), typeof l == "function"))
                        jo(l)
                            ? ((t = ha(l, t)), (e.tag = 1), (e = Kf(null, e, l, t, n)))
                            : ((e.tag = 0), (e = bo(null, e, l, t, n)));
                    else {
                        if (l != null) {
                            if (((u = l.$$typeof), u === H)) {
                                (e.tag = 11), (e = Yf(null, e, l, t, n));
                                break t;
                            } else if (u === V) {
                                (e.tag = 14), (e = If(null, e, l, t, n));
                                break t;
                            }
                        }
                        throw ((e = st(l) || l), Error(r(306, e, "")));
                    }
                }
                return e;
            case 0:
                return bo(t, e, e.type, e.pendingProps, n);
            case 1:
                return (l = e.type), (u = ha(l, e.pendingProps)), Kf(t, e, l, u, n);
            case 3:
                t: {
                    if ((_i(e, e.stateNode.containerInfo), t === null)) throw Error(r(387));
                    var s = e.pendingProps;
                    (u = e.memoizedState), (l = u.element), _o(t, e), ql(e, s, null, n);
                    var d = e.memoizedState;
                    if (
                        ((s = d.cache),
                        Hn(e, kt, s),
                        s !== u.cache && Bo(e, [kt], n, !0),
                        Xl(),
                        (s = d.element),
                        u.isDehydrated)
                    )
                        if (
                            ((u = { element: s, isDehydrated: !1, cache: d.cache }),
                            (e.updateQueue.baseState = u),
                            (e.memoizedState = u),
                            e.flags & 256)
                        ) {
                            e = Wf(t, e, s, n);
                            break t;
                        } else if (s !== l) {
                            (l = Te(Error(r(424)), e)), Ll(l), (e = Wf(t, e, s, n));
                            break t;
                        } else
                            for (
                                Jt = ze(e.stateNode.containerInfo.firstChild),
                                    le = e,
                                    St = !0,
                                    Ue = null,
                                    je = !0,
                                    n = k1(e, null, s, n),
                                    e.child = n;
                                n;

                            )
                                (n.flags = (n.flags & -3) | 4096), (n = n.sibling);
                    else {
                        if ((Nl(), s === l)) {
                            e = on(t, e, n);
                            break t;
                        }
                        $t(t, e, s, n);
                    }
                    e = e.child;
                }
                return e;
            case 26:
                return (
                    Il(t, e),
                    t === null
                        ? (n = l0(e.type, null, e.pendingProps, null))
                            ? (e.memoizedState = n)
                            : St ||
                              ((n = e.type),
                              (t = e.pendingProps),
                              (l = _r(ce.current).createElement(n)),
                              (l[ee] = e),
                              (l[ue] = t),
                              te(l, n, t),
                              Xt(l),
                              (e.stateNode = l))
                        : (e.memoizedState = l0(e.type, t.memoizedProps, e.pendingProps, t.memoizedState)),
                    null
                );
            case 27:
                return (
                    pu(e),
                    t === null &&
                        St &&
                        ((l = e.stateNode = e0(e.type, e.pendingProps, ce.current)),
                        (le = e),
                        (je = !0),
                        (Jt = ze(l.firstChild))),
                    (l = e.pendingProps.children),
                    t !== null || St ? $t(t, e, l, n) : (e.child = ua(e, null, l, n)),
                    Il(t, e),
                    e.child
                );
            case 5:
                return (
                    t === null &&
                        St &&
                        ((u = l = Jt) &&
                            ((l = o6(l, e.type, e.pendingProps, je)),
                            l !== null
                                ? ((e.stateNode = l), (le = e), (Jt = ze(l.firstChild)), (je = !1), (u = !0))
                                : (u = !1)),
                        u || ra(e)),
                    pu(e),
                    (u = e.type),
                    (s = e.pendingProps),
                    (d = t !== null ? t.memoizedProps : null),
                    (l = s.children),
                    ms(u, s) ? (l = null) : d !== null && ms(u, d) && (e.flags |= 32),
                    e.memoizedState !== null && ((u = eo(t, e, x8, null, null, n)), (ci._currentValue = u)),
                    Il(t, e),
                    $t(t, e, l, n),
                    e.child
                );
            case 6:
                return (
                    t === null &&
                        St &&
                        ((t = n = Jt) &&
                            ((n = s6(n, e.pendingProps, je)),
                            n !== null ? ((e.stateNode = n), (le = e), (Jt = null), (t = !0)) : (t = !1)),
                        t || ra(e)),
                    null
                );
            case 13:
                return Jf(t, e, n);
            case 4:
                return (
                    _i(e, e.stateNode.containerInfo),
                    (l = e.pendingProps),
                    t === null ? (e.child = ua(e, null, l, n)) : $t(t, e, l, n),
                    e.child
                );
            case 11:
                return Yf(t, e, e.type, e.pendingProps, n);
            case 7:
                return $t(t, e, e.pendingProps, n), e.child;
            case 8:
                return $t(t, e, e.pendingProps.children, n), e.child;
            case 12:
                return $t(t, e, e.pendingProps.children, n), e.child;
            case 10:
                return (l = e.pendingProps), Hn(e, e.type, l.value), $t(t, e, l.children, n), e.child;
            case 9:
                return (
                    (u = e.type._context),
                    (l = e.pendingProps.children),
                    ma(e),
                    (u = ne(u)),
                    (l = l(u)),
                    (e.flags |= 1),
                    $t(t, e, l, n),
                    e.child
                );
            case 14:
                return If(t, e, e.type, e.pendingProps, n);
            case 15:
                return Pf(t, e, e.type, e.pendingProps, n);
            case 19:
                return t2(t, e, n);
            case 22:
                return kf(t, e, n);
            case 24:
                return (
                    ma(e),
                    (l = ne(kt)),
                    t === null
                        ? ((u = $u()),
                          u === null &&
                              ((u = Dt),
                              (s = Wu()),
                              (u.pooledCache = s),
                              s.refCount++,
                              s !== null && (u.pooledCacheLanes |= n),
                              (u = s)),
                          (e.memoizedState = { parent: l, cache: u }),
                          Do(e),
                          Hn(e, kt, u))
                        : ((t.lanes & n) !== 0 && (_o(t, e), ql(e, null, null, n), Xl()),
                          (u = t.memoizedState),
                          (s = e.memoizedState),
                          u.parent !== l
                              ? ((u = { parent: l, cache: l }),
                                (e.memoizedState = u),
                                e.lanes === 0 && (e.memoizedState = e.updateQueue.baseState = u),
                                Hn(e, kt, l))
                              : ((l = s.cache), Hn(e, kt, l), l !== u.cache && Bo(e, [kt], n, !0))),
                    $t(t, e, e.pendingProps.children, n),
                    e.child
                );
            case 29:
                throw e.pendingProps;
        }
        throw Error(r(156, e.tag));
    }
    var Oo = bt(null),
        da = null,
        sn = null;
    function Hn(t, e, n) {
        Bt(Oo, e._currentValue), (e._currentValue = n);
    }
    function cn(t) {
        (t._currentValue = Oo.current), Vt(Oo);
    }
    function Ho(t, e, n) {
        for (; t !== null; ) {
            var l = t.alternate;
            if (
                ((t.childLanes & e) !== e
                    ? ((t.childLanes |= e), l !== null && (l.childLanes |= e))
                    : l !== null && (l.childLanes & e) !== e && (l.childLanes |= e),
                t === n)
            )
                break;
            t = t.return;
        }
    }
    function Bo(t, e, n, l) {
        var u = t.child;
        for (u !== null && (u.return = t); u !== null; ) {
            var s = u.dependencies;
            if (s !== null) {
                var d = u.child;
                s = s.firstContext;
                t: for (; s !== null; ) {
                    var y = s;
                    s = u;
                    for (var b = 0; b < e.length; b++)
                        if (y.context === e[b]) {
                            (s.lanes |= n),
                                (y = s.alternate),
                                y !== null && (y.lanes |= n),
                                Ho(s.return, n, t),
                                l || (d = null);
                            break t;
                        }
                    s = y.next;
                }
            } else if (u.tag === 18) {
                if (((d = u.return), d === null)) throw Error(r(341));
                (d.lanes |= n), (s = d.alternate), s !== null && (s.lanes |= n), Ho(d, n, t), (d = null);
            } else d = u.child;
            if (d !== null) d.return = u;
            else
                for (d = u; d !== null; ) {
                    if (d === t) {
                        d = null;
                        break;
                    }
                    if (((u = d.sibling), u !== null)) {
                        (u.return = d.return), (d = u);
                        break;
                    }
                    d = d.return;
                }
            u = d;
        }
    }
    function Pl(t, e, n, l) {
        t = null;
        for (var u = e, s = !1; u !== null; ) {
            if (!s) {
                if ((u.flags & 524288) !== 0) s = !0;
                else if ((u.flags & 262144) !== 0) break;
            }
            if (u.tag === 10) {
                var d = u.alternate;
                if (d === null) throw Error(r(387));
                if (((d = d.memoizedProps), d !== null)) {
                    var y = u.type;
                    de(u.pendingProps.value, d.value) || (t !== null ? t.push(y) : (t = [y]));
                }
            } else if (u === Di.current) {
                if (((d = u.alternate), d === null)) throw Error(r(387));
                d.memoizedState.memoizedState !== u.memoizedState.memoizedState &&
                    (t !== null ? t.push(ci) : (t = [ci]));
            }
            u = u.return;
        }
        t !== null && Bo(e, t, n, l), (e.flags |= 262144);
    }
    function pr(t) {
        for (t = t.firstContext; t !== null; ) {
            if (!de(t.context._currentValue, t.memoizedValue)) return !0;
            t = t.next;
        }
        return !1;
    }
    function ma(t) {
        (da = t), (sn = null), (t = t.dependencies), t !== null && (t.firstContext = null);
    }
    function ne(t) {
        return n2(da, t);
    }
    function yr(t, e) {
        return da === null && ma(t), n2(t, e);
    }
    function n2(t, e) {
        var n = e._currentValue;
        if (((e = { context: e, memoizedValue: n, next: null }), sn === null)) {
            if (t === null) throw Error(r(308));
            (sn = e), (t.dependencies = { lanes: 0, firstContext: e }), (t.flags |= 524288);
        } else sn = sn.next = e;
        return n;
    }
    var Bn = !1;
    function Do(t) {
        t.updateQueue = {
            baseState: t.memoizedState,
            firstBaseUpdate: null,
            lastBaseUpdate: null,
            shared: { pending: null, lanes: 0, hiddenCallbacks: null },
            callbacks: null,
        };
    }
    function _o(t, e) {
        (t = t.updateQueue),
            e.updateQueue === t &&
                (e.updateQueue = {
                    baseState: t.baseState,
                    firstBaseUpdate: t.firstBaseUpdate,
                    lastBaseUpdate: t.lastBaseUpdate,
                    shared: t.shared,
                    callbacks: null,
                });
    }
    function Dn(t) {
        return { lane: t, tag: 0, payload: null, callback: null, next: null };
    }
    function _n(t, e, n) {
        var l = t.updateQueue;
        if (l === null) return null;
        if (((l = l.shared), (Ut & 2) !== 0)) {
            var u = l.pending;
            return (
                u === null ? (e.next = e) : ((e.next = u.next), (u.next = e)),
                (l.pending = e),
                (e = Ji(t)),
                U1(t, null, n),
                e
            );
        }
        return Wi(t, l, e, n), Ji(t);
    }
    function kl(t, e, n) {
        if (((e = e.updateQueue), e !== null && ((e = e.shared), (n & 4194176) !== 0))) {
            var l = e.lanes;
            (l &= t.pendingLanes), (n |= l), (e.lanes = n), Yc(t, n);
        }
    }
    function No(t, e) {
        var n = t.updateQueue,
            l = t.alternate;
        if (l !== null && ((l = l.updateQueue), n === l)) {
            var u = null,
                s = null;
            if (((n = n.firstBaseUpdate), n !== null)) {
                do {
                    var d = { lane: n.lane, tag: n.tag, payload: n.payload, callback: null, next: null };
                    s === null ? (u = s = d) : (s = s.next = d), (n = n.next);
                } while (n !== null);
                s === null ? (u = s = e) : (s = s.next = e);
            } else u = s = e;
            (n = {
                baseState: l.baseState,
                firstBaseUpdate: u,
                lastBaseUpdate: s,
                shared: l.shared,
                callbacks: l.callbacks,
            }),
                (t.updateQueue = n);
            return;
        }
        (t = n.lastBaseUpdate), t === null ? (n.firstBaseUpdate = e) : (t.next = e), (n.lastBaseUpdate = e);
    }
    var Lo = !1;
    function Xl() {
        if (Lo) {
            var t = Xa;
            if (t !== null) throw t;
        }
    }
    function ql(t, e, n, l) {
        Lo = !1;
        var u = t.updateQueue;
        Bn = !1;
        var s = u.firstBaseUpdate,
            d = u.lastBaseUpdate,
            y = u.shared.pending;
        if (y !== null) {
            u.shared.pending = null;
            var b = y,
                M = b.next;
            (b.next = null), d === null ? (s = M) : (d.next = M), (d = b);
            var L = t.alternate;
            L !== null &&
                ((L = L.updateQueue),
                (y = L.lastBaseUpdate),
                y !== d && (y === null ? (L.firstBaseUpdate = M) : (y.next = M), (L.lastBaseUpdate = b)));
        }
        if (s !== null) {
            var Z = u.baseState;
            (d = 0), (L = M = b = null), (y = s);
            do {
                var B = y.lane & -536870913,
                    N = B !== y.lane;
                if (N ? (pt & B) === B : (l & B) === B) {
                    B !== 0 && B === ka && (Lo = !0),
                        L !== null &&
                            (L = L.next = { lane: 0, tag: y.tag, payload: y.payload, callback: null, next: null });
                    t: {
                        var tt = t,
                            it = y;
                        B = e;
                        var Qt = n;
                        switch (it.tag) {
                            case 1:
                                if (((tt = it.payload), typeof tt == "function")) {
                                    Z = tt.call(Qt, Z, B);
                                    break t;
                                }
                                Z = tt;
                                break t;
                            case 3:
                                tt.flags = (tt.flags & -65537) | 128;
                            case 0:
                                if (
                                    ((tt = it.payload),
                                    (B = typeof tt == "function" ? tt.call(Qt, Z, B) : tt),
                                    B == null)
                                )
                                    break t;
                                Z = K({}, Z, B);
                                break t;
                            case 2:
                                Bn = !0;
                        }
                    }
                    (B = y.callback),
                        B !== null &&
                            ((t.flags |= 64),
                            N && (t.flags |= 8192),
                            (N = u.callbacks),
                            N === null ? (u.callbacks = [B]) : N.push(B));
                } else
                    (N = { lane: B, tag: y.tag, payload: y.payload, callback: y.callback, next: null }),
                        L === null ? ((M = L = N), (b = Z)) : (L = L.next = N),
                        (d |= B);
                if (((y = y.next), y === null)) {
                    if (((y = u.shared.pending), y === null)) break;
                    (N = y), (y = N.next), (N.next = null), (u.lastBaseUpdate = N), (u.shared.pending = null);
                }
            } while (!0);
            L === null && (b = Z),
                (u.baseState = b),
                (u.firstBaseUpdate = M),
                (u.lastBaseUpdate = L),
                s === null && (u.shared.lanes = 0),
                (zn |= d),
                (t.lanes = d),
                (t.memoizedState = Z);
        }
    }
    function a2(t, e) {
        if (typeof t != "function") throw Error(r(191, t));
        t.call(e);
    }
    function l2(t, e) {
        var n = t.callbacks;
        if (n !== null) for (t.callbacks = null, t = 0; t < n.length; t++) a2(n[t], e);
    }
    function Kl(t, e) {
        try {
            var n = e.updateQueue,
                l = n !== null ? n.lastEffect : null;
            if (l !== null) {
                var u = l.next;
                n = u;
                do {
                    if ((n.tag & t) === t) {
                        l = void 0;
                        var s = n.create,
                            d = n.inst;
                        (l = s()), (d.destroy = l);
                    }
                    n = n.next;
                } while (n !== u);
            }
        } catch (y) {
            Ht(e, e.return, y);
        }
    }
    function Nn(t, e, n) {
        try {
            var l = e.updateQueue,
                u = l !== null ? l.lastEffect : null;
            if (u !== null) {
                var s = u.next;
                l = s;
                do {
                    if ((l.tag & t) === t) {
                        var d = l.inst,
                            y = d.destroy;
                        if (y !== void 0) {
                            (d.destroy = void 0), (u = e);
                            var b = n;
                            try {
                                y();
                            } catch (M) {
                                Ht(u, b, M);
                            }
                        }
                    }
                    l = l.next;
                } while (l !== s);
            }
        } catch (M) {
            Ht(e, e.return, M);
        }
    }
    function i2(t) {
        var e = t.updateQueue;
        if (e !== null) {
            var n = t.stateNode;
            try {
                l2(e, n);
            } catch (l) {
                Ht(t, t.return, l);
            }
        }
    }
    function r2(t, e, n) {
        (n.props = ha(t.type, t.memoizedProps)), (n.state = t.memoizedState);
        try {
            n.componentWillUnmount();
        } catch (l) {
            Ht(t, e, l);
        }
    }
    function va(t, e) {
        try {
            var n = t.ref;
            if (n !== null) {
                var l = t.stateNode;
                switch (t.tag) {
                    case 26:
                    case 27:
                    case 5:
                        var u = l;
                        break;
                    default:
                        u = l;
                }
                typeof n == "function" ? (t.refCleanup = n(u)) : (n.current = u);
            }
        } catch (s) {
            Ht(t, e, s);
        }
    }
    function me(t, e) {
        var n = t.ref,
            l = t.refCleanup;
        if (n !== null)
            if (typeof l == "function")
                try {
                    l();
                } catch (u) {
                    Ht(t, e, u);
                } finally {
                    (t.refCleanup = null), (t = t.alternate), t != null && (t.refCleanup = null);
                }
            else if (typeof n == "function")
                try {
                    n(null);
                } catch (u) {
                    Ht(t, e, u);
                }
            else n.current = null;
    }
    function u2(t) {
        var e = t.type,
            n = t.memoizedProps,
            l = t.stateNode;
        try {
            t: switch (e) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                    n.autoFocus && l.focus();
                    break t;
                case "img":
                    n.src ? (l.src = n.src) : n.srcSet && (l.srcset = n.srcSet);
            }
        } catch (u) {
            Ht(t, t.return, u);
        }
    }
    function o2(t, e, n) {
        try {
            var l = t.stateNode;
            a6(l, t.type, n, e), (l[ue] = e);
        } catch (u) {
            Ht(t, t.return, u);
        }
    }
    function s2(t) {
        return t.tag === 5 || t.tag === 3 || t.tag === 26 || t.tag === 27 || t.tag === 4;
    }
    function Uo(t) {
        t: for (;;) {
            for (; t.sibling === null; ) {
                if (t.return === null || s2(t.return)) return null;
                t = t.return;
            }
            for (
                t.sibling.return = t.return, t = t.sibling;
                t.tag !== 5 && t.tag !== 6 && t.tag !== 27 && t.tag !== 18;

            ) {
                if (t.flags & 2 || t.child === null || t.tag === 4) continue t;
                (t.child.return = t), (t = t.child);
            }
            if (!(t.flags & 2)) return t.stateNode;
        }
    }
    function Vo(t, e, n) {
        var l = t.tag;
        if (l === 5 || l === 6)
            (t = t.stateNode),
                e
                    ? n.nodeType === 8
                        ? n.parentNode.insertBefore(t, e)
                        : n.insertBefore(t, e)
                    : (n.nodeType === 8 ? ((e = n.parentNode), e.insertBefore(t, n)) : ((e = n), e.appendChild(t)),
                      (n = n._reactRootContainer),
                      n != null || e.onclick !== null || (e.onclick = Dr));
        else if (l !== 4 && l !== 27 && ((t = t.child), t !== null))
            for (Vo(t, e, n), t = t.sibling; t !== null; ) Vo(t, e, n), (t = t.sibling);
    }
    function Ar(t, e, n) {
        var l = t.tag;
        if (l === 5 || l === 6) (t = t.stateNode), e ? n.insertBefore(t, e) : n.appendChild(t);
        else if (l !== 4 && l !== 27 && ((t = t.child), t !== null))
            for (Ar(t, e, n), t = t.sibling; t !== null; ) Ar(t, e, n), (t = t.sibling);
    }
    var fn = !1,
        zt = !1,
        zo = !1,
        c2 = typeof WeakSet == "function" ? WeakSet : Set,
        Kt = null,
        f2 = !1;
    function _8(t, e) {
        if (((t = t.containerInfo), (hs = Gr), (t = R1(t)), Gu(t))) {
            if ("selectionStart" in t) var n = { start: t.selectionStart, end: t.selectionEnd };
            else
                t: {
                    n = ((n = t.ownerDocument) && n.defaultView) || window;
                    var l = n.getSelection && n.getSelection();
                    if (l && l.rangeCount !== 0) {
                        n = l.anchorNode;
                        var u = l.anchorOffset,
                            s = l.focusNode;
                        l = l.focusOffset;
                        try {
                            n.nodeType, s.nodeType;
                        } catch {
                            n = null;
                            break t;
                        }
                        var d = 0,
                            y = -1,
                            b = -1,
                            M = 0,
                            L = 0,
                            Z = t,
                            B = null;
                        e: for (;;) {
                            for (
                                var N;
                                Z !== n || (u !== 0 && Z.nodeType !== 3) || (y = d + u),
                                    Z !== s || (l !== 0 && Z.nodeType !== 3) || (b = d + l),
                                    Z.nodeType === 3 && (d += Z.nodeValue.length),
                                    (N = Z.firstChild) !== null;

                            )
                                (B = Z), (Z = N);
                            for (;;) {
                                if (Z === t) break e;
                                if (
                                    (B === n && ++M === u && (y = d),
                                    B === s && ++L === l && (b = d),
                                    (N = Z.nextSibling) !== null)
                                )
                                    break;
                                (Z = B), (B = Z.parentNode);
                            }
                            Z = N;
                        }
                        n = y === -1 || b === -1 ? null : { start: y, end: b };
                    } else n = null;
                }
            n = n || { start: 0, end: 0 };
        } else n = null;
        for (ds = { focusedElem: t, selectionRange: n }, Gr = !1, Kt = e; Kt !== null; )
            if (((e = Kt), (t = e.child), (e.subtreeFlags & 1028) !== 0 && t !== null)) (t.return = e), (Kt = t);
            else
                for (; Kt !== null; ) {
                    switch (((e = Kt), (s = e.alternate), (t = e.flags), e.tag)) {
                        case 0:
                            break;
                        case 11:
                        case 15:
                            break;
                        case 1:
                            if ((t & 1024) !== 0 && s !== null) {
                                (t = void 0), (n = e), (u = s.memoizedProps), (s = s.memoizedState), (l = n.stateNode);
                                try {
                                    var tt = ha(n.type, u, n.elementType === n.type);
                                    (t = l.getSnapshotBeforeUpdate(tt, s)), (l.__reactInternalSnapshotBeforeUpdate = t);
                                } catch (it) {
                                    Ht(n, n.return, it);
                                }
                            }
                            break;
                        case 3:
                            if ((t & 1024) !== 0) {
                                if (((t = e.stateNode.containerInfo), (n = t.nodeType), n === 9)) ps(t);
                                else if (n === 1)
                                    switch (t.nodeName) {
                                        case "HEAD":
                                        case "HTML":
                                        case "BODY":
                                            ps(t);
                                            break;
                                        default:
                                            t.textContent = "";
                                    }
                            }
                            break;
                        case 5:
                        case 26:
                        case 27:
                        case 6:
                        case 4:
                        case 17:
                            break;
                        default:
                            if ((t & 1024) !== 0) throw Error(r(163));
                    }
                    if (((t = e.sibling), t !== null)) {
                        (t.return = e.return), (Kt = t);
                        break;
                    }
                    Kt = e.return;
                }
        return (tt = f2), (f2 = !1), tt;
    }
    function h2(t, e, n) {
        var l = n.flags;
        switch (n.tag) {
            case 0:
            case 11:
            case 15:
                dn(t, n), l & 4 && Kl(5, n);
                break;
            case 1:
                if ((dn(t, n), l & 4))
                    if (((t = n.stateNode), e === null))
                        try {
                            t.componentDidMount();
                        } catch (y) {
                            Ht(n, n.return, y);
                        }
                    else {
                        var u = ha(n.type, e.memoizedProps);
                        e = e.memoizedState;
                        try {
                            t.componentDidUpdate(u, e, t.__reactInternalSnapshotBeforeUpdate);
                        } catch (y) {
                            Ht(n, n.return, y);
                        }
                    }
                l & 64 && i2(n), l & 512 && va(n, n.return);
                break;
            case 3:
                if ((dn(t, n), l & 64 && ((l = n.updateQueue), l !== null))) {
                    if (((t = null), n.child !== null))
                        switch (n.child.tag) {
                            case 27:
                            case 5:
                                t = n.child.stateNode;
                                break;
                            case 1:
                                t = n.child.stateNode;
                        }
                    try {
                        l2(l, t);
                    } catch (y) {
                        Ht(n, n.return, y);
                    }
                }
                break;
            case 26:
                dn(t, n), l & 512 && va(n, n.return);
                break;
            case 27:
            case 5:
                dn(t, n), e === null && l & 4 && u2(n), l & 512 && va(n, n.return);
                break;
            case 12:
                dn(t, n);
                break;
            case 13:
                dn(t, n), l & 4 && v2(t, n);
                break;
            case 22:
                if (((u = n.memoizedState !== null || fn), !u)) {
                    e = (e !== null && e.memoizedState !== null) || zt;
                    var s = fn,
                        d = zt;
                    (fn = u), (zt = e) && !d ? Ln(t, n, (n.subtreeFlags & 8772) !== 0) : dn(t, n), (fn = s), (zt = d);
                }
                l & 512 && (n.memoizedProps.mode === "manual" ? va(n, n.return) : me(n, n.return));
                break;
            default:
                dn(t, n);
        }
    }
    function d2(t) {
        var e = t.alternate;
        e !== null && ((t.alternate = null), d2(e)),
            (t.child = null),
            (t.deletions = null),
            (t.sibling = null),
            t.tag === 5 && ((e = t.stateNode), e !== null && Cu(e)),
            (t.stateNode = null),
            (t.return = null),
            (t.dependencies = null),
            (t.memoizedProps = null),
            (t.memoizedState = null),
            (t.pendingProps = null),
            (t.stateNode = null),
            (t.updateQueue = null);
    }
    var It = null,
        ve = !1;
    function hn(t, e, n) {
        for (n = n.child; n !== null; ) m2(t, e, n), (n = n.sibling);
    }
    function m2(t, e, n) {
        if (fe && typeof fe.onCommitFiberUnmount == "function")
            try {
                fe.onCommitFiberUnmount(Al, n);
            } catch {}
        switch (n.tag) {
            case 26:
                zt || me(n, e),
                    hn(t, e, n),
                    n.memoizedState
                        ? n.memoizedState.count--
                        : n.stateNode && ((n = n.stateNode), n.parentNode.removeChild(n));
                break;
            case 27:
                zt || me(n, e);
                var l = It,
                    u = ve;
                for (It = n.stateNode, hn(t, e, n), n = n.stateNode, e = n.attributes; e.length; )
                    n.removeAttributeNode(e[0]);
                Cu(n), (It = l), (ve = u);
                break;
            case 5:
                zt || me(n, e);
            case 6:
                u = It;
                var s = ve;
                if (((It = null), hn(t, e, n), (It = u), (ve = s), It !== null))
                    if (ve)
                        try {
                            (t = It),
                                (l = n.stateNode),
                                t.nodeType === 8 ? t.parentNode.removeChild(l) : t.removeChild(l);
                        } catch (d) {
                            Ht(n, e, d);
                        }
                    else
                        try {
                            It.removeChild(n.stateNode);
                        } catch (d) {
                            Ht(n, e, d);
                        }
                break;
            case 18:
                It !== null &&
                    (ve
                        ? ((e = It),
                          (n = n.stateNode),
                          e.nodeType === 8 ? gs(e.parentNode, n) : e.nodeType === 1 && gs(e, n),
                          mi(e))
                        : gs(It, n.stateNode));
                break;
            case 4:
                (l = It), (u = ve), (It = n.stateNode.containerInfo), (ve = !0), hn(t, e, n), (It = l), (ve = u);
                break;
            case 0:
            case 11:
            case 14:
            case 15:
                zt || Nn(2, n, e), zt || Nn(4, n, e), hn(t, e, n);
                break;
            case 1:
                zt || (me(n, e), (l = n.stateNode), typeof l.componentWillUnmount == "function" && r2(n, e, l)),
                    hn(t, e, n);
                break;
            case 21:
                hn(t, e, n);
                break;
            case 22:
                zt || me(n, e), (zt = (l = zt) || n.memoizedState !== null), hn(t, e, n), (zt = l);
                break;
            default:
                hn(t, e, n);
        }
    }
    function v2(t, e) {
        if (
            e.memoizedState === null &&
            ((t = e.alternate), t !== null && ((t = t.memoizedState), t !== null && ((t = t.dehydrated), t !== null)))
        )
            try {
                mi(t);
            } catch (n) {
                Ht(e, e.return, n);
            }
    }
    function N8(t) {
        switch (t.tag) {
            case 13:
            case 19:
                var e = t.stateNode;
                return e === null && (e = t.stateNode = new c2()), e;
            case 22:
                return (t = t.stateNode), (e = t._retryCache), e === null && (e = t._retryCache = new c2()), e;
            default:
                throw Error(r(435, t.tag));
        }
    }
    function Go(t, e) {
        var n = N8(t);
        e.forEach(function (l) {
            var u = k8.bind(null, t, l);
            n.has(l) || (n.add(l), l.then(u, u));
        });
    }
    function we(t, e) {
        var n = e.deletions;
        if (n !== null)
            for (var l = 0; l < n.length; l++) {
                var u = n[l],
                    s = t,
                    d = e,
                    y = d;
                t: for (; y !== null; ) {
                    switch (y.tag) {
                        case 27:
                        case 5:
                            (It = y.stateNode), (ve = !1);
                            break t;
                        case 3:
                            (It = y.stateNode.containerInfo), (ve = !0);
                            break t;
                        case 4:
                            (It = y.stateNode.containerInfo), (ve = !0);
                            break t;
                    }
                    y = y.return;
                }
                if (It === null) throw Error(r(160));
                m2(s, d, u),
                    (It = null),
                    (ve = !1),
                    (s = u.alternate),
                    s !== null && (s.return = null),
                    (u.return = null);
            }
        if (e.subtreeFlags & 13878) for (e = e.child; e !== null; ) g2(e, t), (e = e.sibling);
    }
    var Ve = null;
    function g2(t, e) {
        var n = t.alternate,
            l = t.flags;
        switch (t.tag) {
            case 0:
            case 11:
            case 14:
            case 15:
                we(e, t), Oe(t), l & 4 && (Nn(3, t, t.return), Kl(3, t), Nn(5, t, t.return));
                break;
            case 1:
                we(e, t),
                    Oe(t),
                    l & 512 && (zt || n === null || me(n, n.return)),
                    l & 64 &&
                        fn &&
                        ((t = t.updateQueue),
                        t !== null &&
                            ((l = t.callbacks),
                            l !== null &&
                                ((n = t.shared.hiddenCallbacks),
                                (t.shared.hiddenCallbacks = n === null ? l : n.concat(l)))));
                break;
            case 26:
                var u = Ve;
                if ((we(e, t), Oe(t), l & 512 && (zt || n === null || me(n, n.return)), l & 4)) {
                    var s = n !== null ? n.memoizedState : null;
                    if (((l = t.memoizedState), n === null))
                        if (l === null)
                            if (t.stateNode === null) {
                                t: {
                                    (l = t.type), (n = t.memoizedProps), (u = u.ownerDocument || u);
                                    e: switch (l) {
                                        case "title":
                                            (s = u.getElementsByTagName("title")[0]),
                                                (!s ||
                                                    s[Sl] ||
                                                    s[ee] ||
                                                    s.namespaceURI === "http://www.w3.org/2000/svg" ||
                                                    s.hasAttribute("itemprop")) &&
                                                    ((s = u.createElement(l)),
                                                    u.head.insertBefore(s, u.querySelector("head > title"))),
                                                te(s, l, n),
                                                (s[ee] = t),
                                                Xt(s),
                                                (l = s);
                                            break t;
                                        case "link":
                                            var d = u0("link", "href", u).get(l + (n.href || ""));
                                            if (d) {
                                                for (var y = 0; y < d.length; y++)
                                                    if (
                                                        ((s = d[y]),
                                                        s.getAttribute("href") === (n.href == null ? null : n.href) &&
                                                            s.getAttribute("rel") === (n.rel == null ? null : n.rel) &&
                                                            s.getAttribute("title") ===
                                                                (n.title == null ? null : n.title) &&
                                                            s.getAttribute("crossorigin") ===
                                                                (n.crossOrigin == null ? null : n.crossOrigin))
                                                    ) {
                                                        d.splice(y, 1);
                                                        break e;
                                                    }
                                            }
                                            (s = u.createElement(l)), te(s, l, n), u.head.appendChild(s);
                                            break;
                                        case "meta":
                                            if ((d = u0("meta", "content", u).get(l + (n.content || "")))) {
                                                for (y = 0; y < d.length; y++)
                                                    if (
                                                        ((s = d[y]),
                                                        s.getAttribute("content") ===
                                                            (n.content == null ? null : "" + n.content) &&
                                                            s.getAttribute("name") ===
                                                                (n.name == null ? null : n.name) &&
                                                            s.getAttribute("property") ===
                                                                (n.property == null ? null : n.property) &&
                                                            s.getAttribute("http-equiv") ===
                                                                (n.httpEquiv == null ? null : n.httpEquiv) &&
                                                            s.getAttribute("charset") ===
                                                                (n.charSet == null ? null : n.charSet))
                                                    ) {
                                                        d.splice(y, 1);
                                                        break e;
                                                    }
                                            }
                                            (s = u.createElement(l)), te(s, l, n), u.head.appendChild(s);
                                            break;
                                        default:
                                            throw Error(r(468, l));
                                    }
                                    (s[ee] = t), Xt(s), (l = s);
                                }
                                t.stateNode = l;
                            } else o0(u, t.type, t.stateNode);
                        else t.stateNode = r0(u, l, t.memoizedProps);
                    else
                        s !== l
                            ? (s === null
                                  ? n.stateNode !== null && ((n = n.stateNode), n.parentNode.removeChild(n))
                                  : s.count--,
                              l === null ? o0(u, t.type, t.stateNode) : r0(u, l, t.memoizedProps))
                            : l === null && t.stateNode !== null && o2(t, t.memoizedProps, n.memoizedProps);
                }
                break;
            case 27:
                if (l & 4 && t.alternate === null) {
                    (u = t.stateNode), (s = t.memoizedProps);
                    try {
                        for (var b = u.firstChild; b; ) {
                            var M = b.nextSibling,
                                L = b.nodeName;
                            b[Sl] ||
                                L === "HEAD" ||
                                L === "BODY" ||
                                L === "SCRIPT" ||
                                L === "STYLE" ||
                                (L === "LINK" && b.rel.toLowerCase() === "stylesheet") ||
                                u.removeChild(b),
                                (b = M);
                        }
                        for (var Z = t.type, B = u.attributes; B.length; ) u.removeAttributeNode(B[0]);
                        te(u, Z, s), (u[ee] = t), (u[ue] = s);
                    } catch (tt) {
                        Ht(t, t.return, tt);
                    }
                }
            case 5:
                if ((we(e, t), Oe(t), l & 512 && (zt || n === null || me(n, n.return)), t.flags & 32)) {
                    u = t.stateNode;
                    try {
                        La(u, "");
                    } catch (tt) {
                        Ht(t, t.return, tt);
                    }
                }
                l & 4 && t.stateNode != null && ((u = t.memoizedProps), o2(t, u, n !== null ? n.memoizedProps : u)),
                    l & 1024 && (zo = !0);
                break;
            case 6:
                if ((we(e, t), Oe(t), l & 4)) {
                    if (t.stateNode === null) throw Error(r(162));
                    (l = t.memoizedProps), (n = t.stateNode);
                    try {
                        n.nodeValue = l;
                    } catch (tt) {
                        Ht(t, t.return, tt);
                    }
                }
                break;
            case 3:
                if (
                    ((Ur = null),
                    (u = Ve),
                    (Ve = Nr(e.containerInfo)),
                    we(e, t),
                    (Ve = u),
                    Oe(t),
                    l & 4 && n !== null && n.memoizedState.isDehydrated)
                )
                    try {
                        mi(e.containerInfo);
                    } catch (tt) {
                        Ht(t, t.return, tt);
                    }
                zo && ((zo = !1), p2(t));
                break;
            case 4:
                (l = Ve), (Ve = Nr(t.stateNode.containerInfo)), we(e, t), Oe(t), (Ve = l);
                break;
            case 12:
                we(e, t), Oe(t);
                break;
            case 13:
                we(e, t),
                    Oe(t),
                    t.child.flags & 8192 &&
                        (t.memoizedState !== null) != (n !== null && n.memoizedState !== null) &&
                        (Xo = Ze()),
                    l & 4 && ((l = t.updateQueue), l !== null && ((t.updateQueue = null), Go(t, l)));
                break;
            case 22:
                if (
                    (l & 512 && (zt || n === null || me(n, n.return)),
                    (b = t.memoizedState !== null),
                    (M = n !== null && n.memoizedState !== null),
                    (L = fn),
                    (Z = zt),
                    (fn = L || b),
                    (zt = Z || M),
                    we(e, t),
                    (zt = Z),
                    (fn = L),
                    Oe(t),
                    (e = t.stateNode),
                    (e._current = t),
                    (e._visibility &= -3),
                    (e._visibility |= e._pendingVisibility & 2),
                    l & 8192 &&
                        ((e._visibility = b ? e._visibility & -2 : e._visibility | 1),
                        b && ((e = fn || zt), n === null || M || e || Ja(t)),
                        t.memoizedProps === null || t.memoizedProps.mode !== "manual"))
                )
                    t: for (n = null, e = t; ; ) {
                        if (e.tag === 5 || e.tag === 26 || e.tag === 27) {
                            if (n === null) {
                                M = n = e;
                                try {
                                    if (((u = M.stateNode), b))
                                        (s = u.style),
                                            typeof s.setProperty == "function"
                                                ? s.setProperty("display", "none", "important")
                                                : (s.display = "none");
                                    else {
                                        (d = M.stateNode), (y = M.memoizedProps.style);
                                        var N = y != null && y.hasOwnProperty("display") ? y.display : null;
                                        d.style.display = N == null || typeof N == "boolean" ? "" : ("" + N).trim();
                                    }
                                } catch (tt) {
                                    Ht(M, M.return, tt);
                                }
                            }
                        } else if (e.tag === 6) {
                            if (n === null) {
                                M = e;
                                try {
                                    M.stateNode.nodeValue = b ? "" : M.memoizedProps;
                                } catch (tt) {
                                    Ht(M, M.return, tt);
                                }
                            }
                        } else if (
                            ((e.tag !== 22 && e.tag !== 23) || e.memoizedState === null || e === t) &&
                            e.child !== null
                        ) {
                            (e.child.return = e), (e = e.child);
                            continue;
                        }
                        if (e === t) break t;
                        for (; e.sibling === null; ) {
                            if (e.return === null || e.return === t) break t;
                            n === e && (n = null), (e = e.return);
                        }
                        n === e && (n = null), (e.sibling.return = e.return), (e = e.sibling);
                    }
                l & 4 &&
                    ((l = t.updateQueue),
                    l !== null && ((n = l.retryQueue), n !== null && ((l.retryQueue = null), Go(t, n))));
                break;
            case 19:
                we(e, t), Oe(t), l & 4 && ((l = t.updateQueue), l !== null && ((t.updateQueue = null), Go(t, l)));
                break;
            case 21:
                break;
            default:
                we(e, t), Oe(t);
        }
    }
    function Oe(t) {
        var e = t.flags;
        if (e & 2) {
            try {
                if (t.tag !== 27) {
                    t: {
                        for (var n = t.return; n !== null; ) {
                            if (s2(n)) {
                                var l = n;
                                break t;
                            }
                            n = n.return;
                        }
                        throw Error(r(160));
                    }
                    switch (l.tag) {
                        case 27:
                            var u = l.stateNode,
                                s = Uo(t);
                            Ar(t, s, u);
                            break;
                        case 5:
                            var d = l.stateNode;
                            l.flags & 32 && (La(d, ""), (l.flags &= -33));
                            var y = Uo(t);
                            Ar(t, y, d);
                            break;
                        case 3:
                        case 4:
                            var b = l.stateNode.containerInfo,
                                M = Uo(t);
                            Vo(t, M, b);
                            break;
                        default:
                            throw Error(r(161));
                    }
                }
            } catch (L) {
                Ht(t, t.return, L);
            }
            t.flags &= -3;
        }
        e & 4096 && (t.flags &= -4097);
    }
    function p2(t) {
        if (t.subtreeFlags & 1024)
            for (t = t.child; t !== null; ) {
                var e = t;
                p2(e), e.tag === 5 && e.flags & 1024 && e.stateNode.reset(), (t = t.sibling);
            }
    }
    function dn(t, e) {
        if (e.subtreeFlags & 8772) for (e = e.child; e !== null; ) h2(t, e.alternate, e), (e = e.sibling);
    }
    function Ja(t) {
        for (t = t.child; t !== null; ) {
            var e = t;
            switch (e.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                    Nn(4, e, e.return), Ja(e);
                    break;
                case 1:
                    me(e, e.return);
                    var n = e.stateNode;
                    typeof n.componentWillUnmount == "function" && r2(e, e.return, n), Ja(e);
                    break;
                case 26:
                case 27:
                case 5:
                    me(e, e.return), Ja(e);
                    break;
                case 22:
                    me(e, e.return), e.memoizedState === null && Ja(e);
                    break;
                default:
                    Ja(e);
            }
            t = t.sibling;
        }
    }
    function Ln(t, e, n) {
        for (n = n && (e.subtreeFlags & 8772) !== 0, e = e.child; e !== null; ) {
            var l = e.alternate,
                u = t,
                s = e,
                d = s.flags;
            switch (s.tag) {
                case 0:
                case 11:
                case 15:
                    Ln(u, s, n), Kl(4, s);
                    break;
                case 1:
                    if ((Ln(u, s, n), (l = s), (u = l.stateNode), typeof u.componentDidMount == "function"))
                        try {
                            u.componentDidMount();
                        } catch (M) {
                            Ht(l, l.return, M);
                        }
                    if (((l = s), (u = l.updateQueue), u !== null)) {
                        var y = l.stateNode;
                        try {
                            var b = u.shared.hiddenCallbacks;
                            if (b !== null) for (u.shared.hiddenCallbacks = null, u = 0; u < b.length; u++) a2(b[u], y);
                        } catch (M) {
                            Ht(l, l.return, M);
                        }
                    }
                    n && d & 64 && i2(s), va(s, s.return);
                    break;
                case 26:
                case 27:
                case 5:
                    Ln(u, s, n), n && l === null && d & 4 && u2(s), va(s, s.return);
                    break;
                case 12:
                    Ln(u, s, n);
                    break;
                case 13:
                    Ln(u, s, n), n && d & 4 && v2(u, s);
                    break;
                case 22:
                    s.memoizedState === null && Ln(u, s, n), va(s, s.return);
                    break;
                default:
                    Ln(u, s, n);
            }
            e = e.sibling;
        }
    }
    function Qo(t, e) {
        var n = null;
        t !== null &&
            t.memoizedState !== null &&
            t.memoizedState.cachePool !== null &&
            (n = t.memoizedState.cachePool.pool),
            (t = null),
            e.memoizedState !== null && e.memoizedState.cachePool !== null && (t = e.memoizedState.cachePool.pool),
            t !== n && (t != null && t.refCount++, n != null && Ql(n));
    }
    function Zo(t, e) {
        (t = null),
            e.alternate !== null && (t = e.alternate.memoizedState.cache),
            (e = e.memoizedState.cache),
            e !== t && (e.refCount++, t != null && Ql(t));
    }
    function Un(t, e, n, l) {
        if (e.subtreeFlags & 10256) for (e = e.child; e !== null; ) y2(t, e, n, l), (e = e.sibling);
    }
    function y2(t, e, n, l) {
        var u = e.flags;
        switch (e.tag) {
            case 0:
            case 11:
            case 15:
                Un(t, e, n, l), u & 2048 && Kl(9, e);
                break;
            case 3:
                Un(t, e, n, l),
                    u & 2048 &&
                        ((t = null),
                        e.alternate !== null && (t = e.alternate.memoizedState.cache),
                        (e = e.memoizedState.cache),
                        e !== t && (e.refCount++, t != null && Ql(t)));
                break;
            case 12:
                if (u & 2048) {
                    Un(t, e, n, l), (t = e.stateNode);
                    try {
                        var s = e.memoizedProps,
                            d = s.id,
                            y = s.onPostCommit;
                        typeof y == "function" &&
                            y(d, e.alternate === null ? "mount" : "update", t.passiveEffectDuration, -0);
                    } catch (b) {
                        Ht(e, e.return, b);
                    }
                } else Un(t, e, n, l);
                break;
            case 23:
                break;
            case 22:
                (s = e.stateNode),
                    e.memoizedState !== null
                        ? s._visibility & 4
                            ? Un(t, e, n, l)
                            : Wl(t, e)
                        : s._visibility & 4
                          ? Un(t, e, n, l)
                          : ((s._visibility |= 4), $a(t, e, n, l, (e.subtreeFlags & 10256) !== 0)),
                    u & 2048 && Qo(e.alternate, e);
                break;
            case 24:
                Un(t, e, n, l), u & 2048 && Zo(e.alternate, e);
                break;
            default:
                Un(t, e, n, l);
        }
    }
    function $a(t, e, n, l, u) {
        for (u = u && (e.subtreeFlags & 10256) !== 0, e = e.child; e !== null; ) {
            var s = t,
                d = e,
                y = n,
                b = l,
                M = d.flags;
            switch (d.tag) {
                case 0:
                case 11:
                case 15:
                    $a(s, d, y, b, u), Kl(8, d);
                    break;
                case 23:
                    break;
                case 22:
                    var L = d.stateNode;
                    d.memoizedState !== null
                        ? L._visibility & 4
                            ? $a(s, d, y, b, u)
                            : Wl(s, d)
                        : ((L._visibility |= 4), $a(s, d, y, b, u)),
                        u && M & 2048 && Qo(d.alternate, d);
                    break;
                case 24:
                    $a(s, d, y, b, u), u && M & 2048 && Zo(d.alternate, d);
                    break;
                default:
                    $a(s, d, y, b, u);
            }
            e = e.sibling;
        }
    }
    function Wl(t, e) {
        if (e.subtreeFlags & 10256)
            for (e = e.child; e !== null; ) {
                var n = t,
                    l = e,
                    u = l.flags;
                switch (l.tag) {
                    case 22:
                        Wl(n, l), u & 2048 && Qo(l.alternate, l);
                        break;
                    case 24:
                        Wl(n, l), u & 2048 && Zo(l.alternate, l);
                        break;
                    default:
                        Wl(n, l);
                }
                e = e.sibling;
            }
    }
    var Jl = 8192;
    function tl(t) {
        if (t.subtreeFlags & Jl) for (t = t.child; t !== null; ) A2(t), (t = t.sibling);
    }
    function A2(t) {
        switch (t.tag) {
            case 26:
                tl(t), t.flags & Jl && t.memoizedState !== null && S6(Ve, t.memoizedState, t.memoizedProps);
                break;
            case 5:
                tl(t);
                break;
            case 3:
            case 4:
                var e = Ve;
                (Ve = Nr(t.stateNode.containerInfo)), tl(t), (Ve = e);
                break;
            case 22:
                t.memoizedState === null &&
                    ((e = t.alternate),
                    e !== null && e.memoizedState !== null ? ((e = Jl), (Jl = 16777216), tl(t), (Jl = e)) : tl(t));
                break;
            default:
                tl(t);
        }
    }
    function b2(t) {
        var e = t.alternate;
        if (e !== null && ((t = e.child), t !== null)) {
            e.child = null;
            do (e = t.sibling), (t.sibling = null), (t = e);
            while (t !== null);
        }
    }
    function $l(t) {
        var e = t.deletions;
        if ((t.flags & 16) !== 0) {
            if (e !== null)
                for (var n = 0; n < e.length; n++) {
                    var l = e[n];
                    (Kt = l), S2(l, t);
                }
            b2(t);
        }
        if (t.subtreeFlags & 10256) for (t = t.child; t !== null; ) E2(t), (t = t.sibling);
    }
    function E2(t) {
        switch (t.tag) {
            case 0:
            case 11:
            case 15:
                $l(t), t.flags & 2048 && Nn(9, t, t.return);
                break;
            case 3:
                $l(t);
                break;
            case 12:
                $l(t);
                break;
            case 22:
                var e = t.stateNode;
                t.memoizedState !== null && e._visibility & 4 && (t.return === null || t.return.tag !== 13)
                    ? ((e._visibility &= -5), br(t))
                    : $l(t);
                break;
            default:
                $l(t);
        }
    }
    function br(t) {
        var e = t.deletions;
        if ((t.flags & 16) !== 0) {
            if (e !== null)
                for (var n = 0; n < e.length; n++) {
                    var l = e[n];
                    (Kt = l), S2(l, t);
                }
            b2(t);
        }
        for (t = t.child; t !== null; ) {
            switch (((e = t), e.tag)) {
                case 0:
                case 11:
                case 15:
                    Nn(8, e, e.return), br(e);
                    break;
                case 22:
                    (n = e.stateNode), n._visibility & 4 && ((n._visibility &= -5), br(e));
                    break;
                default:
                    br(e);
            }
            t = t.sibling;
        }
    }
    function S2(t, e) {
        for (; Kt !== null; ) {
            var n = Kt;
            switch (n.tag) {
                case 0:
                case 11:
                case 15:
                    Nn(8, n, e);
                    break;
                case 23:
                case 22:
                    if (n.memoizedState !== null && n.memoizedState.cachePool !== null) {
                        var l = n.memoizedState.cachePool.pool;
                        l != null && l.refCount++;
                    }
                    break;
                case 24:
                    Ql(n.memoizedState.cache);
            }
            if (((l = n.child), l !== null)) (l.return = n), (Kt = l);
            else
                t: for (n = t; Kt !== null; ) {
                    l = Kt;
                    var u = l.sibling,
                        s = l.return;
                    if ((d2(l), l === n)) {
                        Kt = null;
                        break t;
                    }
                    if (u !== null) {
                        (u.return = s), (Kt = u);
                        break t;
                    }
                    Kt = s;
                }
        }
    }
    function L8(t, e, n, l) {
        (this.tag = t),
            (this.key = n),
            (this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null),
            (this.index = 0),
            (this.refCleanup = this.ref = null),
            (this.pendingProps = e),
            (this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null),
            (this.mode = l),
            (this.subtreeFlags = this.flags = 0),
            (this.deletions = null),
            (this.childLanes = this.lanes = 0),
            (this.alternate = null);
    }
    function He(t, e, n, l) {
        return new L8(t, e, n, l);
    }
    function jo(t) {
        return (t = t.prototype), !(!t || !t.isReactComponent);
    }
    function Vn(t, e) {
        var n = t.alternate;
        return (
            n === null
                ? ((n = He(t.tag, e, t.key, t.mode)),
                  (n.elementType = t.elementType),
                  (n.type = t.type),
                  (n.stateNode = t.stateNode),
                  (n.alternate = t),
                  (t.alternate = n))
                : ((n.pendingProps = e), (n.type = t.type), (n.flags = 0), (n.subtreeFlags = 0), (n.deletions = null)),
            (n.flags = t.flags & 31457280),
            (n.childLanes = t.childLanes),
            (n.lanes = t.lanes),
            (n.child = t.child),
            (n.memoizedProps = t.memoizedProps),
            (n.memoizedState = t.memoizedState),
            (n.updateQueue = t.updateQueue),
            (e = t.dependencies),
            (n.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }),
            (n.sibling = t.sibling),
            (n.index = t.index),
            (n.ref = t.ref),
            (n.refCleanup = t.refCleanup),
            n
        );
    }
    function C2(t, e) {
        t.flags &= 31457282;
        var n = t.alternate;
        return (
            n === null
                ? ((t.childLanes = 0),
                  (t.lanes = e),
                  (t.child = null),
                  (t.subtreeFlags = 0),
                  (t.memoizedProps = null),
                  (t.memoizedState = null),
                  (t.updateQueue = null),
                  (t.dependencies = null),
                  (t.stateNode = null))
                : ((t.childLanes = n.childLanes),
                  (t.lanes = n.lanes),
                  (t.child = n.child),
                  (t.subtreeFlags = 0),
                  (t.deletions = null),
                  (t.memoizedProps = n.memoizedProps),
                  (t.memoizedState = n.memoizedState),
                  (t.updateQueue = n.updateQueue),
                  (t.type = n.type),
                  (e = n.dependencies),
                  (t.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext })),
            t
        );
    }
    function Er(t, e, n, l, u, s) {
        var d = 0;
        if (((l = t), typeof t == "function")) jo(t) && (d = 1);
        else if (typeof t == "string")
            d = b6(t, n, be.current) ? 26 : t === "html" || t === "head" || t === "body" ? 27 : 5;
        else
            t: switch (t) {
                case g:
                    return ga(n.children, u, s, e);
                case v:
                    (d = 8), (u |= 24);
                    break;
                case p:
                    return (t = He(12, n, e, u | 2)), (t.elementType = p), (t.lanes = s), t;
                case D:
                    return (t = He(13, n, e, u)), (t.elementType = D), (t.lanes = s), t;
                case _:
                    return (t = He(19, n, e, u)), (t.elementType = _), (t.lanes = s), t;
                case Q:
                    return T2(n, u, s, e);
                default:
                    if (typeof t == "object" && t !== null)
                        switch (t.$$typeof) {
                            case A:
                            case x:
                                d = 10;
                                break t;
                            case E:
                                d = 9;
                                break t;
                            case H:
                                d = 11;
                                break t;
                            case V:
                                d = 14;
                                break t;
                            case U:
                                (d = 16), (l = null);
                                break t;
                        }
                    (d = 29), (n = Error(r(130, t === null ? "null" : typeof t, ""))), (l = null);
            }
        return (e = He(d, n, e, u)), (e.elementType = t), (e.type = l), (e.lanes = s), e;
    }
    function ga(t, e, n, l) {
        return (t = He(7, t, l, e)), (t.lanes = n), t;
    }
    function T2(t, e, n, l) {
        (t = He(22, t, l, e)), (t.elementType = Q), (t.lanes = n);
        var u = {
            _visibility: 1,
            _pendingVisibility: 1,
            _pendingMarkers: null,
            _retryCache: null,
            _transitions: null,
            _current: null,
            detach: function () {
                var s = u._current;
                if (s === null) throw Error(r(456));
                if ((u._pendingVisibility & 2) === 0) {
                    var d = xn(s, 2);
                    d !== null && ((u._pendingVisibility |= 2), ie(d, s, 2));
                }
            },
            attach: function () {
                var s = u._current;
                if (s === null) throw Error(r(456));
                if ((u._pendingVisibility & 2) !== 0) {
                    var d = xn(s, 2);
                    d !== null && ((u._pendingVisibility &= -3), ie(d, s, 2));
                }
            },
        };
        return (t.stateNode = u), t;
    }
    function Fo(t, e, n) {
        return (t = He(6, t, null, e)), (t.lanes = n), t;
    }
    function Yo(t, e, n) {
        return (
            (e = He(4, t.children !== null ? t.children : [], t.key, e)),
            (e.lanes = n),
            (e.stateNode = { containerInfo: t.containerInfo, pendingChildren: null, implementation: t.implementation }),
            e
        );
    }
    function mn(t) {
        t.flags |= 4;
    }
    function x2(t, e) {
        if (e.type !== "stylesheet" || (e.state.loading & 4) !== 0) t.flags &= -16777217;
        else if (((t.flags |= 16777216), !s0(e))) {
            if (
                ((e = Re.current),
                e !== null &&
                    ((pt & 4194176) === pt
                        ? Fe !== null
                        : ((pt & 62914560) !== pt && (pt & 536870912) === 0) || e !== Fe))
            )
                throw ((Vl = Xu), Z1);
            t.flags |= 8192;
        }
    }
    function Sr(t, e) {
        e !== null && (t.flags |= 4),
            t.flags & 16384 && ((e = t.tag !== 22 ? jc() : 536870912), (t.lanes |= e), (nl |= e));
    }
    function ti(t, e) {
        if (!St)
            switch (t.tailMode) {
                case "hidden":
                    e = t.tail;
                    for (var n = null; e !== null; ) e.alternate !== null && (n = e), (e = e.sibling);
                    n === null ? (t.tail = null) : (n.sibling = null);
                    break;
                case "collapsed":
                    n = t.tail;
                    for (var l = null; n !== null; ) n.alternate !== null && (l = n), (n = n.sibling);
                    l === null
                        ? e || t.tail === null
                            ? (t.tail = null)
                            : (t.tail.sibling = null)
                        : (l.sibling = null);
            }
    }
    function Lt(t) {
        var e = t.alternate !== null && t.alternate.child === t.child,
            n = 0,
            l = 0;
        if (e)
            for (var u = t.child; u !== null; )
                (n |= u.lanes | u.childLanes),
                    (l |= u.subtreeFlags & 31457280),
                    (l |= u.flags & 31457280),
                    (u.return = t),
                    (u = u.sibling);
        else
            for (u = t.child; u !== null; )
                (n |= u.lanes | u.childLanes), (l |= u.subtreeFlags), (l |= u.flags), (u.return = t), (u = u.sibling);
        return (t.subtreeFlags |= l), (t.childLanes = n), e;
    }
    function U8(t, e, n) {
        var l = e.pendingProps;
        switch ((Pu(e), e.tag)) {
            case 16:
            case 15:
            case 0:
            case 11:
            case 7:
            case 8:
            case 12:
            case 9:
            case 14:
                return Lt(e), null;
            case 1:
                return Lt(e), null;
            case 3:
                return (
                    (n = e.stateNode),
                    (l = null),
                    t !== null && (l = t.memoizedState.cache),
                    e.memoizedState.cache !== l && (e.flags |= 2048),
                    cn(kt),
                    Oa(),
                    n.pendingContext && ((n.context = n.pendingContext), (n.pendingContext = null)),
                    (t === null || t.child === null) &&
                        (_l(e)
                            ? mn(e)
                            : t === null ||
                              (t.memoizedState.isDehydrated && (e.flags & 256) === 0) ||
                              ((e.flags |= 1024), Ue !== null && (Jo(Ue), (Ue = null)))),
                    Lt(e),
                    null
                );
            case 26:
                return (
                    (n = e.memoizedState),
                    t === null
                        ? (mn(e), n !== null ? (Lt(e), x2(e, n)) : (Lt(e), (e.flags &= -16777217)))
                        : n
                          ? n !== t.memoizedState
                              ? (mn(e), Lt(e), x2(e, n))
                              : (Lt(e), (e.flags &= -16777217))
                          : (t.memoizedProps !== l && mn(e), Lt(e), (e.flags &= -16777217)),
                    null
                );
            case 27:
                Ni(e), (n = ce.current);
                var u = e.type;
                if (t !== null && e.stateNode != null) t.memoizedProps !== l && mn(e);
                else {
                    if (!l) {
                        if (e.stateNode === null) throw Error(r(166));
                        return Lt(e), null;
                    }
                    (t = be.current), _l(e) ? G1(e) : ((t = e0(u, l, n)), (e.stateNode = t), mn(e));
                }
                return Lt(e), null;
            case 5:
                if ((Ni(e), (n = e.type), t !== null && e.stateNode != null)) t.memoizedProps !== l && mn(e);
                else {
                    if (!l) {
                        if (e.stateNode === null) throw Error(r(166));
                        return Lt(e), null;
                    }
                    if (((t = be.current), _l(e))) G1(e);
                    else {
                        switch (((u = _r(ce.current)), t)) {
                            case 1:
                                t = u.createElementNS("http://www.w3.org/2000/svg", n);
                                break;
                            case 2:
                                t = u.createElementNS("http://www.w3.org/1998/Math/MathML", n);
                                break;
                            default:
                                switch (n) {
                                    case "svg":
                                        t = u.createElementNS("http://www.w3.org/2000/svg", n);
                                        break;
                                    case "math":
                                        t = u.createElementNS("http://www.w3.org/1998/Math/MathML", n);
                                        break;
                                    case "script":
                                        (t = u.createElement("div")),
                                            (t.innerHTML = "<script></script>"),
                                            (t = t.removeChild(t.firstChild));
                                        break;
                                    case "select":
                                        (t =
                                            typeof l.is == "string"
                                                ? u.createElement("select", { is: l.is })
                                                : u.createElement("select")),
                                            l.multiple ? (t.multiple = !0) : l.size && (t.size = l.size);
                                        break;
                                    default:
                                        t =
                                            typeof l.is == "string"
                                                ? u.createElement(n, { is: l.is })
                                                : u.createElement(n);
                                }
                        }
                        (t[ee] = e), (t[ue] = l);
                        t: for (u = e.child; u !== null; ) {
                            if (u.tag === 5 || u.tag === 6) t.appendChild(u.stateNode);
                            else if (u.tag !== 4 && u.tag !== 27 && u.child !== null) {
                                (u.child.return = u), (u = u.child);
                                continue;
                            }
                            if (u === e) break t;
                            for (; u.sibling === null; ) {
                                if (u.return === null || u.return === e) break t;
                                u = u.return;
                            }
                            (u.sibling.return = u.return), (u = u.sibling);
                        }
                        e.stateNode = t;
                        t: switch ((te(t, n, l), n)) {
                            case "button":
                            case "input":
                            case "select":
                            case "textarea":
                                t = !!l.autoFocus;
                                break t;
                            case "img":
                                t = !0;
                                break t;
                            default:
                                t = !1;
                        }
                        t && mn(e);
                    }
                }
                return Lt(e), (e.flags &= -16777217), null;
            case 6:
                if (t && e.stateNode != null) t.memoizedProps !== l && mn(e);
                else {
                    if (typeof l != "string" && e.stateNode === null) throw Error(r(166));
                    if (((t = ce.current), _l(e))) {
                        if (((t = e.stateNode), (n = e.memoizedProps), (l = null), (u = le), u !== null))
                            switch (u.tag) {
                                case 27:
                                case 5:
                                    l = u.memoizedProps;
                            }
                        (t[ee] = e),
                            (t = !!(
                                t.nodeValue === n ||
                                (l !== null && l.suppressHydrationWarning === !0) ||
                                q2(t.nodeValue, n)
                            )),
                            t || ra(e);
                    } else (t = _r(t).createTextNode(l)), (t[ee] = e), (e.stateNode = t);
                }
                return Lt(e), null;
            case 13:
                if (
                    ((l = e.memoizedState),
                    t === null || (t.memoizedState !== null && t.memoizedState.dehydrated !== null))
                ) {
                    if (((u = _l(e)), l !== null && l.dehydrated !== null)) {
                        if (t === null) {
                            if (!u) throw Error(r(318));
                            if (((u = e.memoizedState), (u = u !== null ? u.dehydrated : null), !u))
                                throw Error(r(317));
                            u[ee] = e;
                        } else Nl(), (e.flags & 128) === 0 && (e.memoizedState = null), (e.flags |= 4);
                        Lt(e), (u = !1);
                    } else Ue !== null && (Jo(Ue), (Ue = null)), (u = !0);
                    if (!u) return e.flags & 256 ? (rn(e), e) : (rn(e), null);
                }
                if ((rn(e), (e.flags & 128) !== 0)) return (e.lanes = n), e;
                if (((n = l !== null), (t = t !== null && t.memoizedState !== null), n)) {
                    (l = e.child),
                        (u = null),
                        l.alternate !== null &&
                            l.alternate.memoizedState !== null &&
                            l.alternate.memoizedState.cachePool !== null &&
                            (u = l.alternate.memoizedState.cachePool.pool);
                    var s = null;
                    l.memoizedState !== null &&
                        l.memoizedState.cachePool !== null &&
                        (s = l.memoizedState.cachePool.pool),
                        s !== u && (l.flags |= 2048);
                }
                return n !== t && n && (e.child.flags |= 8192), Sr(e, e.updateQueue), Lt(e), null;
            case 4:
                return Oa(), t === null && ss(e.stateNode.containerInfo), Lt(e), null;
            case 10:
                return cn(e.type), Lt(e), null;
            case 19:
                if ((Vt(Pt), (u = e.memoizedState), u === null)) return Lt(e), null;
                if (((l = (e.flags & 128) !== 0), (s = u.rendering), s === null))
                    if (l) ti(u, !1);
                    else {
                        if (Gt !== 0 || (t !== null && (t.flags & 128) !== 0))
                            for (t = e.child; t !== null; ) {
                                if (((s = ir(t)), s !== null)) {
                                    for (
                                        e.flags |= 128,
                                            ti(u, !1),
                                            t = s.updateQueue,
                                            e.updateQueue = t,
                                            Sr(e, t),
                                            e.subtreeFlags = 0,
                                            t = n,
                                            n = e.child;
                                        n !== null;

                                    )
                                        C2(n, t), (n = n.sibling);
                                    return Bt(Pt, (Pt.current & 1) | 2), e.child;
                                }
                                t = t.sibling;
                            }
                        u.tail !== null && Ze() > Cr && ((e.flags |= 128), (l = !0), ti(u, !1), (e.lanes = 4194304));
                    }
                else {
                    if (!l)
                        if (((t = ir(s)), t !== null)) {
                            if (
                                ((e.flags |= 128),
                                (l = !0),
                                (t = t.updateQueue),
                                (e.updateQueue = t),
                                Sr(e, t),
                                ti(u, !0),
                                u.tail === null && u.tailMode === "hidden" && !s.alternate && !St)
                            )
                                return Lt(e), null;
                        } else
                            2 * Ze() - u.renderingStartTime > Cr &&
                                n !== 536870912 &&
                                ((e.flags |= 128), (l = !0), ti(u, !1), (e.lanes = 4194304));
                    u.isBackwards
                        ? ((s.sibling = e.child), (e.child = s))
                        : ((t = u.last), t !== null ? (t.sibling = s) : (e.child = s), (u.last = s));
                }
                return u.tail !== null
                    ? ((e = u.tail),
                      (u.rendering = e),
                      (u.tail = e.sibling),
                      (u.renderingStartTime = Ze()),
                      (e.sibling = null),
                      (t = Pt.current),
                      Bt(Pt, l ? (t & 1) | 2 : t & 1),
                      e)
                    : (Lt(e), null);
            case 22:
            case 23:
                return (
                    rn(e),
                    Ku(),
                    (l = e.memoizedState !== null),
                    t !== null ? (t.memoizedState !== null) !== l && (e.flags |= 8192) : l && (e.flags |= 8192),
                    l
                        ? (n & 536870912) !== 0 &&
                          (e.flags & 128) === 0 &&
                          (Lt(e), e.subtreeFlags & 6 && (e.flags |= 8192))
                        : Lt(e),
                    (n = e.updateQueue),
                    n !== null && Sr(e, n.retryQueue),
                    (n = null),
                    t !== null &&
                        t.memoizedState !== null &&
                        t.memoizedState.cachePool !== null &&
                        (n = t.memoizedState.cachePool.pool),
                    (l = null),
                    e.memoizedState !== null &&
                        e.memoizedState.cachePool !== null &&
                        (l = e.memoizedState.cachePool.pool),
                    l !== n && (e.flags |= 2048),
                    t !== null && Vt(oa),
                    null
                );
            case 24:
                return (
                    (n = null),
                    t !== null && (n = t.memoizedState.cache),
                    e.memoizedState.cache !== n && (e.flags |= 2048),
                    cn(kt),
                    Lt(e),
                    null
                );
            case 25:
                return null;
        }
        throw Error(r(156, e.tag));
    }
    function V8(t, e) {
        switch ((Pu(e), e.tag)) {
            case 1:
                return (t = e.flags), t & 65536 ? ((e.flags = (t & -65537) | 128), e) : null;
            case 3:
                return (
                    cn(kt),
                    Oa(),
                    (t = e.flags),
                    (t & 65536) !== 0 && (t & 128) === 0 ? ((e.flags = (t & -65537) | 128), e) : null
                );
            case 26:
            case 27:
            case 5:
                return Ni(e), null;
            case 13:
                if ((rn(e), (t = e.memoizedState), t !== null && t.dehydrated !== null)) {
                    if (e.alternate === null) throw Error(r(340));
                    Nl();
                }
                return (t = e.flags), t & 65536 ? ((e.flags = (t & -65537) | 128), e) : null;
            case 19:
                return Vt(Pt), null;
            case 4:
                return Oa(), null;
            case 10:
                return cn(e.type), null;
            case 22:
            case 23:
                return (
                    rn(e),
                    Ku(),
                    t !== null && Vt(oa),
                    (t = e.flags),
                    t & 65536 ? ((e.flags = (t & -65537) | 128), e) : null
                );
            case 24:
                return cn(kt), null;
            case 25:
                return null;
            default:
                return null;
        }
    }
    function M2(t, e) {
        switch ((Pu(e), e.tag)) {
            case 3:
                cn(kt), Oa();
                break;
            case 26:
            case 27:
            case 5:
                Ni(e);
                break;
            case 4:
                Oa();
                break;
            case 13:
                rn(e);
                break;
            case 19:
                Vt(Pt);
                break;
            case 10:
                cn(e.type);
                break;
            case 22:
            case 23:
                rn(e), Ku(), t !== null && Vt(oa);
                break;
            case 24:
                cn(kt);
        }
    }
    var z8 = {
            getCacheForType: function (t) {
                var e = ne(kt),
                    n = e.data.get(t);
                return n === void 0 && ((n = t()), e.data.set(t, n)), n;
            },
        },
        G8 = typeof WeakMap == "function" ? WeakMap : Map,
        Ut = 0,
        Dt = null,
        ht = null,
        pt = 0,
        _t = 0,
        ge = null,
        vn = !1,
        el = !1,
        Io = !1,
        gn = 0,
        Gt = 0,
        zn = 0,
        pa = 0,
        Po = 0,
        Be = 0,
        nl = 0,
        ei = null,
        Ie = null,
        ko = !1,
        Xo = 0,
        Cr = 1 / 0,
        Tr = null,
        Gn = null,
        xr = !1,
        ya = null,
        ni = 0,
        qo = 0,
        Ko = null,
        ai = 0,
        Wo = null;
    function pe() {
        if ((Ut & 2) !== 0 && pt !== 0) return pt & -pt;
        if (P.T !== null) {
            var t = ka;
            return t !== 0 ? t : is();
        }
        return Pc();
    }
    function R2() {
        Be === 0 && (Be = (pt & 536870912) === 0 || St ? Zc() : 536870912);
        var t = Re.current;
        return t !== null && (t.flags |= 32), Be;
    }
    function ie(t, e, n) {
        ((t === Dt && _t === 2) || t.cancelPendingCommit !== null) && (al(t, 0), pn(t, pt, Be, !1)),
            El(t, n),
            ((Ut & 2) === 0 || t !== Dt) &&
                (t === Dt && ((Ut & 2) === 0 && (pa |= n), Gt === 4 && pn(t, pt, Be, !1)), Pe(t));
    }
    function w2(t, e, n) {
        if ((Ut & 6) !== 0) throw Error(r(327));
        var l = (!n && (e & 60) === 0 && (e & t.expiredLanes) === 0) || bl(t, e),
            u = l ? j8(t, e) : es(t, e, !0),
            s = l;
        do {
            if (u === 0) {
                el && !l && pn(t, e, 0, !1);
                break;
            } else if (u === 6) pn(t, e, 0, !vn);
            else {
                if (((n = t.current.alternate), s && !Q8(n))) {
                    (u = es(t, e, !1)), (s = !1);
                    continue;
                }
                if (u === 2) {
                    if (((s = e), t.errorRecoveryDisabledLanes & s)) var d = 0;
                    else (d = t.pendingLanes & -536870913), (d = d !== 0 ? d : d & 536870912 ? 536870912 : 0);
                    if (d !== 0) {
                        e = d;
                        t: {
                            var y = t;
                            u = ei;
                            var b = y.current.memoizedState.isDehydrated;
                            if ((b && (al(y, d).flags |= 256), (d = es(y, d, !1)), d !== 2)) {
                                if (Io && !b) {
                                    (y.errorRecoveryDisabledLanes |= s), (pa |= s), (u = 4);
                                    break t;
                                }
                                (s = Ie), (Ie = u), s !== null && Jo(s);
                            }
                            u = d;
                        }
                        if (((s = !1), u !== 2)) continue;
                    }
                }
                if (u === 1) {
                    al(t, 0), pn(t, e, 0, !0);
                    break;
                }
                t: {
                    switch (((l = t), u)) {
                        case 0:
                        case 1:
                            throw Error(r(345));
                        case 4:
                            if ((e & 4194176) === e) {
                                pn(l, e, Be, !vn);
                                break t;
                            }
                            break;
                        case 2:
                            Ie = null;
                            break;
                        case 3:
                        case 5:
                            break;
                        default:
                            throw Error(r(329));
                    }
                    if (
                        ((l.finishedWork = n),
                        (l.finishedLanes = e),
                        (e & 62914560) === e && ((s = Xo + 300 - Ze()), 10 < s))
                    ) {
                        if ((pn(l, e, Be, !vn), zi(l, 0) !== 0)) break t;
                        l.timeoutHandle = J2(O2.bind(null, l, n, Ie, Tr, ko, e, Be, pa, nl, vn, 2, -0, 0), s);
                        break t;
                    }
                    O2(l, n, Ie, Tr, ko, e, Be, pa, nl, vn, 0, -0, 0);
                }
            }
            break;
        } while (!0);
        Pe(t);
    }
    function Jo(t) {
        Ie === null ? (Ie = t) : Ie.push.apply(Ie, t);
    }
    function O2(t, e, n, l, u, s, d, y, b, M, L, Z, B) {
        var N = e.subtreeFlags;
        if (
            (N & 8192 || (N & 16785408) === 16785408) &&
            ((si = { stylesheets: null, count: 0, unsuspend: E6 }), A2(e), (e = C6()), e !== null)
        ) {
            (t.cancelPendingCommit = e(U2.bind(null, t, n, l, u, d, y, b, 1, Z, B))), pn(t, s, d, !M);
            return;
        }
        U2(t, n, l, u, d, y, b, L, Z, B);
    }
    function Q8(t) {
        for (var e = t; ; ) {
            var n = e.tag;
            if (
                (n === 0 || n === 11 || n === 15) &&
                e.flags & 16384 &&
                ((n = e.updateQueue), n !== null && ((n = n.stores), n !== null))
            )
                for (var l = 0; l < n.length; l++) {
                    var u = n[l],
                        s = u.getSnapshot;
                    u = u.value;
                    try {
                        if (!de(s(), u)) return !1;
                    } catch {
                        return !1;
                    }
                }
            if (((n = e.child), e.subtreeFlags & 16384 && n !== null)) (n.return = e), (e = n);
            else {
                if (e === t) break;
                for (; e.sibling === null; ) {
                    if (e.return === null || e.return === t) return !0;
                    e = e.return;
                }
                (e.sibling.return = e.return), (e = e.sibling);
            }
        }
        return !0;
    }
    function pn(t, e, n, l) {
        (e &= ~Po),
            (e &= ~pa),
            (t.suspendedLanes |= e),
            (t.pingedLanes &= ~e),
            l && (t.warmLanes |= e),
            (l = t.expirationTimes);
        for (var u = e; 0 < u; ) {
            var s = 31 - he(u),
                d = 1 << s;
            (l[s] = -1), (u &= ~d);
        }
        n !== 0 && Fc(t, n, e);
    }
    function Mr() {
        return (Ut & 6) === 0 ? (li(0), !1) : !0;
    }
    function $o() {
        if (ht !== null) {
            if (_t === 0) var t = ht.return;
            else (t = ht), (sn = da = null), lo(t), (Ia = null), (zl = 0), (t = ht);
            for (; t !== null; ) M2(t.alternate, t), (t = t.return);
            ht = null;
        }
    }
    function al(t, e) {
        (t.finishedWork = null), (t.finishedLanes = 0);
        var n = t.timeoutHandle;
        n !== -1 && ((t.timeoutHandle = -1), i6(n)),
            (n = t.cancelPendingCommit),
            n !== null && ((t.cancelPendingCommit = null), n()),
            $o(),
            (Dt = t),
            (ht = n = Vn(t.current, null)),
            (pt = e),
            (_t = 0),
            (ge = null),
            (vn = !1),
            (el = bl(t, e)),
            (Io = !1),
            (nl = Be = Po = pa = zn = Gt = 0),
            (Ie = ei = null),
            (ko = !1),
            (e & 8) !== 0 && (e |= e & 32);
        var l = t.entangledLanes;
        if (l !== 0)
            for (t = t.entanglements, l &= e; 0 < l; ) {
                var u = 31 - he(l),
                    s = 1 << u;
                (e |= t[u]), (l &= ~s);
            }
        return (gn = e), Ki(), n;
    }
    function H2(t, e) {
        (ct = null),
            (P.H = Ye),
            e === Ul
                ? ((e = Y1()), (_t = 3))
                : e === Z1
                  ? ((e = Y1()), (_t = 4))
                  : (_t = e === Ff ? 8 : e !== null && typeof e == "object" && typeof e.then == "function" ? 6 : 1),
            (ge = e),
            ht === null && ((Gt = 1), gr(t, Te(e, t.current)));
    }
    function B2() {
        var t = P.H;
        return (P.H = Ye), t === null ? Ye : t;
    }
    function D2() {
        var t = P.A;
        return (P.A = z8), t;
    }
    function ts() {
        (Gt = 4),
            vn || ((pt & 4194176) !== pt && Re.current !== null) || (el = !0),
            ((zn & 134217727) === 0 && (pa & 134217727) === 0) || Dt === null || pn(Dt, pt, Be, !1);
    }
    function es(t, e, n) {
        var l = Ut;
        Ut |= 2;
        var u = B2(),
            s = D2();
        (Dt !== t || pt !== e) && ((Tr = null), al(t, e)), (e = !1);
        var d = Gt;
        t: do
            try {
                if (_t !== 0 && ht !== null) {
                    var y = ht,
                        b = ge;
                    switch (_t) {
                        case 8:
                            $o(), (d = 6);
                            break t;
                        case 3:
                        case 2:
                        case 6:
                            Re.current === null && (e = !0);
                            var M = _t;
                            if (((_t = 0), (ge = null), ll(t, y, b, M), n && el)) {
                                d = 0;
                                break t;
                            }
                            break;
                        default:
                            (M = _t), (_t = 0), (ge = null), ll(t, y, b, M);
                    }
                }
                Z8(), (d = Gt);
                break;
            } catch (L) {
                H2(t, L);
            }
        while (!0);
        return (
            e && t.shellSuspendCounter++,
            (sn = da = null),
            (Ut = l),
            (P.H = u),
            (P.A = s),
            ht === null && ((Dt = null), (pt = 0), Ki()),
            d
        );
    }
    function Z8() {
        for (; ht !== null; ) _2(ht);
    }
    function j8(t, e) {
        var n = Ut;
        Ut |= 2;
        var l = B2(),
            u = D2();
        Dt !== t || pt !== e ? ((Tr = null), (Cr = Ze() + 500), al(t, e)) : (el = bl(t, e));
        t: do
            try {
                if (_t !== 0 && ht !== null) {
                    e = ht;
                    var s = ge;
                    e: switch (_t) {
                        case 1:
                            (_t = 0), (ge = null), ll(t, e, s, 1);
                            break;
                        case 2:
                            if (j1(s)) {
                                (_t = 0), (ge = null), N2(e);
                                break;
                            }
                            (e = function () {
                                _t === 2 && Dt === t && (_t = 7), Pe(t);
                            }),
                                s.then(e, e);
                            break t;
                        case 3:
                            _t = 7;
                            break t;
                        case 4:
                            _t = 5;
                            break t;
                        case 7:
                            j1(s) ? ((_t = 0), (ge = null), N2(e)) : ((_t = 0), (ge = null), ll(t, e, s, 7));
                            break;
                        case 5:
                            var d = null;
                            switch (ht.tag) {
                                case 26:
                                    d = ht.memoizedState;
                                case 5:
                                case 27:
                                    var y = ht;
                                    if (!d || s0(d)) {
                                        (_t = 0), (ge = null);
                                        var b = y.sibling;
                                        if (b !== null) ht = b;
                                        else {
                                            var M = y.return;
                                            M !== null ? ((ht = M), Rr(M)) : (ht = null);
                                        }
                                        break e;
                                    }
                            }
                            (_t = 0), (ge = null), ll(t, e, s, 5);
                            break;
                        case 6:
                            (_t = 0), (ge = null), ll(t, e, s, 6);
                            break;
                        case 8:
                            $o(), (Gt = 6);
                            break t;
                        default:
                            throw Error(r(462));
                    }
                }
                F8();
                break;
            } catch (L) {
                H2(t, L);
            }
        while (!0);
        return (sn = da = null), (P.H = l), (P.A = u), (Ut = n), ht !== null ? 0 : ((Dt = null), (pt = 0), Ki(), Gt);
    }
    function F8() {
        for (; ht !== null && !f4(); ) _2(ht);
    }
    function _2(t) {
        var e = e2(t.alternate, t, gn);
        (t.memoizedProps = t.pendingProps), e === null ? Rr(t) : (ht = e);
    }
    function N2(t) {
        var e = t,
            n = e.alternate;
        switch (e.tag) {
            case 15:
            case 0:
                e = qf(n, e, e.pendingProps, e.type, void 0, pt);
                break;
            case 11:
                e = qf(n, e, e.pendingProps, e.type.render, e.ref, pt);
                break;
            case 5:
                lo(e);
            default:
                M2(n, e), (e = ht = C2(e, gn)), (e = e2(n, e, gn));
        }
        (t.memoizedProps = t.pendingProps), e === null ? Rr(t) : (ht = e);
    }
    function ll(t, e, n, l) {
        (sn = da = null), lo(e), (Ia = null), (zl = 0);
        var u = e.return;
        try {
            if (B8(t, u, e, n, pt)) {
                (Gt = 1), gr(t, Te(n, t.current)), (ht = null);
                return;
            }
        } catch (s) {
            if (u !== null) throw ((ht = u), s);
            (Gt = 1), gr(t, Te(n, t.current)), (ht = null);
            return;
        }
        e.flags & 32768
            ? (St || l === 1
                  ? (t = !0)
                  : el || (pt & 536870912) !== 0
                    ? (t = !1)
                    : ((vn = t = !0),
                      (l === 2 || l === 3 || l === 6) &&
                          ((l = Re.current), l !== null && l.tag === 13 && (l.flags |= 16384))),
              L2(e, t))
            : Rr(e);
    }
    function Rr(t) {
        var e = t;
        do {
            if ((e.flags & 32768) !== 0) {
                L2(e, vn);
                return;
            }
            t = e.return;
            var n = U8(e.alternate, e, gn);
            if (n !== null) {
                ht = n;
                return;
            }
            if (((e = e.sibling), e !== null)) {
                ht = e;
                return;
            }
            ht = e = t;
        } while (e !== null);
        Gt === 0 && (Gt = 5);
    }
    function L2(t, e) {
        do {
            var n = V8(t.alternate, t);
            if (n !== null) {
                (n.flags &= 32767), (ht = n);
                return;
            }
            if (
                ((n = t.return),
                n !== null && ((n.flags |= 32768), (n.subtreeFlags = 0), (n.deletions = null)),
                !e && ((t = t.sibling), t !== null))
            ) {
                ht = t;
                return;
            }
            ht = t = n;
        } while (t !== null);
        (Gt = 6), (ht = null);
    }
    function U2(t, e, n, l, u, s, d, y, b, M) {
        var L = P.T,
            Z = q.p;
        try {
            (q.p = 2), (P.T = null), Y8(t, e, n, l, Z, u, s, d, y, b, M);
        } finally {
            (P.T = L), (q.p = Z);
        }
    }
    function Y8(t, e, n, l, u, s, d, y) {
        do il();
        while (ya !== null);
        if ((Ut & 6) !== 0) throw Error(r(327));
        var b = t.finishedWork;
        if (((l = t.finishedLanes), b === null)) return null;
        if (((t.finishedWork = null), (t.finishedLanes = 0), b === t.current)) throw Error(r(177));
        (t.callbackNode = null), (t.callbackPriority = 0), (t.cancelPendingCommit = null);
        var M = b.lanes | b.childLanes;
        if (
            ((M |= Fu),
            S4(t, l, M, s, d, y),
            t === Dt && ((ht = Dt = null), (pt = 0)),
            ((b.subtreeFlags & 10256) === 0 && (b.flags & 10256) === 0) ||
                xr ||
                ((xr = !0),
                (qo = M),
                (Ko = n),
                X8(Li, function () {
                    return il(), null;
                })),
            (n = (b.flags & 15990) !== 0),
            (b.subtreeFlags & 15990) !== 0 || n
                ? ((n = P.T),
                  (P.T = null),
                  (s = q.p),
                  (q.p = 2),
                  (d = Ut),
                  (Ut |= 4),
                  _8(t, b),
                  g2(b, t),
                  m8(ds, t.containerInfo),
                  (Gr = !!hs),
                  (ds = hs = null),
                  (t.current = b),
                  h2(t, b.alternate, b),
                  h4(),
                  (Ut = d),
                  (q.p = s),
                  (P.T = n))
                : (t.current = b),
            xr ? ((xr = !1), (ya = t), (ni = l)) : V2(t, M),
            (M = t.pendingLanes),
            M === 0 && (Gn = null),
            p4(b.stateNode),
            Pe(t),
            e !== null)
        )
            for (u = t.onRecoverableError, b = 0; b < e.length; b++)
                (M = e[b]), u(M.value, { componentStack: M.stack });
        return (
            (ni & 3) !== 0 && il(),
            (M = t.pendingLanes),
            (l & 4194218) !== 0 && (M & 42) !== 0 ? (t === Wo ? ai++ : ((ai = 0), (Wo = t))) : (ai = 0),
            li(0),
            null
        );
    }
    function V2(t, e) {
        (t.pooledCacheLanes &= e) === 0 && ((e = t.pooledCache), e != null && ((t.pooledCache = null), Ql(e)));
    }
    function il() {
        if (ya !== null) {
            var t = ya,
                e = qo;
            qo = 0;
            var n = Ic(ni),
                l = P.T,
                u = q.p;
            try {
                if (((q.p = 32 > n ? 32 : n), (P.T = null), ya === null)) var s = !1;
                else {
                    (n = Ko), (Ko = null);
                    var d = ya,
                        y = ni;
                    if (((ya = null), (ni = 0), (Ut & 6) !== 0)) throw Error(r(331));
                    var b = Ut;
                    if (
                        ((Ut |= 4),
                        E2(d.current),
                        y2(d, d.current, y, n),
                        (Ut = b),
                        li(0, !1),
                        fe && typeof fe.onPostCommitFiberRoot == "function")
                    )
                        try {
                            fe.onPostCommitFiberRoot(Al, d);
                        } catch {}
                    s = !0;
                }
                return s;
            } finally {
                (q.p = u), (P.T = l), V2(t, e);
            }
        }
        return !1;
    }
    function z2(t, e, n) {
        (e = Te(n, e)), (e = Ao(t.stateNode, e, 2)), (t = _n(t, e, 2)), t !== null && (El(t, 2), Pe(t));
    }
    function Ht(t, e, n) {
        if (t.tag === 3) z2(t, t, n);
        else
            for (; e !== null; ) {
                if (e.tag === 3) {
                    z2(e, t, n);
                    break;
                } else if (e.tag === 1) {
                    var l = e.stateNode;
                    if (
                        typeof e.type.getDerivedStateFromError == "function" ||
                        (typeof l.componentDidCatch == "function" && (Gn === null || !Gn.has(l)))
                    ) {
                        (t = Te(n, t)), (n = Zf(2)), (l = _n(e, n, 2)), l !== null && (jf(n, l, e, t), El(l, 2), Pe(l));
                        break;
                    }
                }
                e = e.return;
            }
    }
    function ns(t, e, n) {
        var l = t.pingCache;
        if (l === null) {
            l = t.pingCache = new G8();
            var u = new Set();
            l.set(e, u);
        } else (u = l.get(e)), u === void 0 && ((u = new Set()), l.set(e, u));
        u.has(n) || ((Io = !0), u.add(n), (t = I8.bind(null, t, e, n)), e.then(t, t));
    }
    function I8(t, e, n) {
        var l = t.pingCache;
        l !== null && l.delete(e),
            (t.pingedLanes |= t.suspendedLanes & n),
            (t.warmLanes &= ~n),
            Dt === t &&
                (pt & n) === n &&
                (Gt === 4 || (Gt === 3 && (pt & 62914560) === pt && 300 > Ze() - Xo)
                    ? (Ut & 2) === 0 && al(t, 0)
                    : (Po |= n),
                nl === pt && (nl = 0)),
            Pe(t);
    }
    function G2(t, e) {
        e === 0 && (e = jc()), (t = xn(t, e)), t !== null && (El(t, e), Pe(t));
    }
    function P8(t) {
        var e = t.memoizedState,
            n = 0;
        e !== null && (n = e.retryLane), G2(t, n);
    }
    function k8(t, e) {
        var n = 0;
        switch (t.tag) {
            case 13:
                var l = t.stateNode,
                    u = t.memoizedState;
                u !== null && (n = u.retryLane);
                break;
            case 19:
                l = t.stateNode;
                break;
            case 22:
                l = t.stateNode._retryCache;
                break;
            default:
                throw Error(r(314));
        }
        l !== null && l.delete(e), G2(t, n);
    }
    function X8(t, e) {
        return Au(t, e);
    }
    var wr = null,
        rl = null,
        as = !1,
        Or = !1,
        ls = !1,
        Aa = 0;
    function Pe(t) {
        t !== rl && t.next === null && (rl === null ? (wr = rl = t) : (rl = rl.next = t)),
            (Or = !0),
            as || ((as = !0), K8(q8));
    }
    function li(t, e) {
        if (!ls && Or) {
            ls = !0;
            do
                for (var n = !1, l = wr; l !== null; ) {
                    if (t !== 0) {
                        var u = l.pendingLanes;
                        if (u === 0) var s = 0;
                        else {
                            var d = l.suspendedLanes,
                                y = l.pingedLanes;
                            (s = (1 << (31 - he(42 | t) + 1)) - 1),
                                (s &= u & ~(d & ~y)),
                                (s = s & 201326677 ? (s & 201326677) | 1 : s ? s | 2 : 0);
                        }
                        s !== 0 && ((n = !0), j2(l, s));
                    } else (s = pt), (s = zi(l, l === Dt ? s : 0)), (s & 3) === 0 || bl(l, s) || ((n = !0), j2(l, s));
                    l = l.next;
                }
            while (n);
            ls = !1;
        }
    }
    function q8() {
        Or = as = !1;
        var t = 0;
        Aa !== 0 && (l6() && (t = Aa), (Aa = 0));
        for (var e = Ze(), n = null, l = wr; l !== null; ) {
            var u = l.next,
                s = Q2(l, e);
            s === 0
                ? ((l.next = null), n === null ? (wr = u) : (n.next = u), u === null && (rl = n))
                : ((n = l), (t !== 0 || (s & 3) !== 0) && (Or = !0)),
                (l = u);
        }
        li(t);
    }
    function Q2(t, e) {
        for (
            var n = t.suspendedLanes, l = t.pingedLanes, u = t.expirationTimes, s = t.pendingLanes & -62914561;
            0 < s;

        ) {
            var d = 31 - he(s),
                y = 1 << d,
                b = u[d];
            b === -1 ? ((y & n) === 0 || (y & l) !== 0) && (u[d] = E4(y, e)) : b <= e && (t.expiredLanes |= y),
                (s &= ~y);
        }
        if (
            ((e = Dt),
            (n = pt),
            (n = zi(t, t === e ? n : 0)),
            (l = t.callbackNode),
            n === 0 || (t === e && _t === 2) || t.cancelPendingCommit !== null)
        )
            return l !== null && l !== null && bu(l), (t.callbackNode = null), (t.callbackPriority = 0);
        if ((n & 3) === 0 || bl(t, n)) {
            if (((e = n & -n), e === t.callbackPriority)) return e;
            switch ((l !== null && bu(l), Ic(n))) {
                case 2:
                case 8:
                    n = Gc;
                    break;
                case 32:
                    n = Li;
                    break;
                case 268435456:
                    n = Qc;
                    break;
                default:
                    n = Li;
            }
            return (l = Z2.bind(null, t)), (n = Au(n, l)), (t.callbackPriority = e), (t.callbackNode = n), e;
        }
        return l !== null && l !== null && bu(l), (t.callbackPriority = 2), (t.callbackNode = null), 2;
    }
    function Z2(t, e) {
        var n = t.callbackNode;
        if (il() && t.callbackNode !== n) return null;
        var l = pt;
        return (
            (l = zi(t, t === Dt ? l : 0)),
            l === 0
                ? null
                : (w2(t, l, e), Q2(t, Ze()), t.callbackNode != null && t.callbackNode === n ? Z2.bind(null, t) : null)
        );
    }
    function j2(t, e) {
        if (il()) return null;
        w2(t, e, !0);
    }
    function K8(t) {
        r6(function () {
            (Ut & 6) !== 0 ? Au(zc, t) : t();
        });
    }
    function is() {
        return Aa === 0 && (Aa = Zc()), Aa;
    }
    function F2(t) {
        return t == null || typeof t == "symbol" || typeof t == "boolean"
            ? null
            : typeof t == "function"
              ? t
              : Fi("" + t);
    }
    function Y2(t, e) {
        var n = e.ownerDocument.createElement("input");
        return (
            (n.name = e.name),
            (n.value = e.value),
            t.id && n.setAttribute("form", t.id),
            e.parentNode.insertBefore(n, e),
            (t = new FormData(t)),
            n.parentNode.removeChild(n),
            t
        );
    }
    function W8(t, e, n, l, u) {
        if (e === "submit" && n && n.stateNode === u) {
            var s = F2((u[ue] || null).action),
                d = l.submitter;
            d &&
                ((e = (e = d[ue] || null) ? F2(e.formAction) : d.getAttribute("formAction")),
                e !== null && ((s = e), (d = null)));
            var y = new ki("action", "action", null, l, u);
            t.push({
                event: y,
                listeners: [
                    {
                        instance: null,
                        listener: function () {
                            if (l.defaultPrevented) {
                                if (Aa !== 0) {
                                    var b = d ? Y2(u, d) : new FormData(u);
                                    mo(n, { pending: !0, data: b, method: u.method, action: s }, null, b);
                                }
                            } else
                                typeof s == "function" &&
                                    (y.preventDefault(),
                                    (b = d ? Y2(u, d) : new FormData(u)),
                                    mo(n, { pending: !0, data: b, method: u.method, action: s }, s, b));
                        },
                        currentTarget: u,
                    },
                ],
            });
        }
    }
    for (var rs = 0; rs < L1.length; rs++) {
        var us = L1[rs],
            J8 = us.toLowerCase(),
            $8 = us[0].toUpperCase() + us.slice(1);
        Le(J8, "on" + $8);
    }
    Le(H1, "onAnimationEnd"),
        Le(B1, "onAnimationIteration"),
        Le(D1, "onAnimationStart"),
        Le("dblclick", "onDoubleClick"),
        Le("focusin", "onFocus"),
        Le("focusout", "onBlur"),
        Le(g8, "onTransitionRun"),
        Le(p8, "onTransitionStart"),
        Le(y8, "onTransitionCancel"),
        Le(_1, "onTransitionEnd"),
        _a("onMouseEnter", ["mouseout", "mouseover"]),
        _a("onMouseLeave", ["mouseout", "mouseover"]),
        _a("onPointerEnter", ["pointerout", "pointerover"]),
        _a("onPointerLeave", ["pointerout", "pointerover"]),
        ta("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")),
        ta(
            "onSelect",
            "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")
        ),
        ta("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]),
        ta("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")),
        ta("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")),
        ta("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
    var ii =
            "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
                " "
            ),
        t6 = new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(ii));
    function I2(t, e) {
        e = (e & 4) !== 0;
        for (var n = 0; n < t.length; n++) {
            var l = t[n],
                u = l.event;
            l = l.listeners;
            t: {
                var s = void 0;
                if (e)
                    for (var d = l.length - 1; 0 <= d; d--) {
                        var y = l[d],
                            b = y.instance,
                            M = y.currentTarget;
                        if (((y = y.listener), b !== s && u.isPropagationStopped())) break t;
                        (s = y), (u.currentTarget = M);
                        try {
                            s(u);
                        } catch (L) {
                            vr(L);
                        }
                        (u.currentTarget = null), (s = b);
                    }
                else
                    for (d = 0; d < l.length; d++) {
                        if (
                            ((y = l[d]),
                            (b = y.instance),
                            (M = y.currentTarget),
                            (y = y.listener),
                            b !== s && u.isPropagationStopped())
                        )
                            break t;
                        (s = y), (u.currentTarget = M);
                        try {
                            s(u);
                        } catch (L) {
                            vr(L);
                        }
                        (u.currentTarget = null), (s = b);
                    }
            }
        }
    }
    function mt(t, e) {
        var n = e[Su];
        n === void 0 && (n = e[Su] = new Set());
        var l = t + "__bubble";
        n.has(l) || (P2(e, t, 2, !1), n.add(l));
    }
    function os(t, e, n) {
        var l = 0;
        e && (l |= 4), P2(n, t, l, e);
    }
    var Hr = "_reactListening" + Math.random().toString(36).slice(2);
    function ss(t) {
        if (!t[Hr]) {
            (t[Hr] = !0),
                Xc.forEach(function (n) {
                    n !== "selectionchange" && (t6.has(n) || os(n, !1, t), os(n, !0, t));
                });
            var e = t.nodeType === 9 ? t : t.ownerDocument;
            e === null || e[Hr] || ((e[Hr] = !0), os("selectionchange", !1, e));
        }
    }
    function P2(t, e, n, l) {
        switch (v0(e)) {
            case 2:
                var u = M6;
                break;
            case 8:
                u = R6;
                break;
            default:
                u = Ss;
        }
        (n = u.bind(null, e, n, t)),
            (u = void 0),
            !Hu || (e !== "touchstart" && e !== "touchmove" && e !== "wheel") || (u = !0),
            l
                ? u !== void 0
                    ? t.addEventListener(e, n, { capture: !0, passive: u })
                    : t.addEventListener(e, n, !0)
                : u !== void 0
                  ? t.addEventListener(e, n, { passive: u })
                  : t.addEventListener(e, n, !1);
    }
    function cs(t, e, n, l, u) {
        var s = l;
        if ((e & 1) === 0 && (e & 2) === 0 && l !== null)
            t: for (;;) {
                if (l === null) return;
                var d = l.tag;
                if (d === 3 || d === 4) {
                    var y = l.stateNode.containerInfo;
                    if (y === u || (y.nodeType === 8 && y.parentNode === u)) break;
                    if (d === 4)
                        for (d = l.return; d !== null; ) {
                            var b = d.tag;
                            if (
                                (b === 3 || b === 4) &&
                                ((b = d.stateNode.containerInfo), b === u || (b.nodeType === 8 && b.parentNode === u))
                            )
                                return;
                            d = d.return;
                        }
                    for (; y !== null; ) {
                        if (((d = $n(y)), d === null)) return;
                        if (((b = d.tag), b === 5 || b === 6 || b === 26 || b === 27)) {
                            l = s = d;
                            continue t;
                        }
                        y = y.parentNode;
                    }
                }
                l = l.return;
            }
        r1(function () {
            var M = s,
                L = wu(n),
                Z = [];
            t: {
                var B = N1.get(t);
                if (B !== void 0) {
                    var N = ki,
                        tt = t;
                    switch (t) {
                        case "keypress":
                            if (Ii(n) === 0) break t;
                        case "keydown":
                        case "keyup":
                            N = k4;
                            break;
                        case "focusin":
                            (tt = "focus"), (N = Nu);
                            break;
                        case "focusout":
                            (tt = "blur"), (N = Nu);
                            break;
                        case "beforeblur":
                        case "afterblur":
                            N = Nu;
                            break;
                        case "click":
                            if (n.button === 2) break t;
                        case "auxclick":
                        case "dblclick":
                        case "mousedown":
                        case "mousemove":
                        case "mouseup":
                        case "mouseout":
                        case "mouseover":
                        case "contextmenu":
                            N = s1;
                            break;
                        case "drag":
                        case "dragend":
                        case "dragenter":
                        case "dragexit":
                        case "dragleave":
                        case "dragover":
                        case "dragstart":
                        case "drop":
                            N = L4;
                            break;
                        case "touchcancel":
                        case "touchend":
                        case "touchmove":
                        case "touchstart":
                            N = K4;
                            break;
                        case H1:
                        case B1:
                        case D1:
                            N = z4;
                            break;
                        case _1:
                            N = J4;
                            break;
                        case "scroll":
                        case "scrollend":
                            N = _4;
                            break;
                        case "wheel":
                            N = t8;
                            break;
                        case "copy":
                        case "cut":
                        case "paste":
                            N = Q4;
                            break;
                        case "gotpointercapture":
                        case "lostpointercapture":
                        case "pointercancel":
                        case "pointerdown":
                        case "pointermove":
                        case "pointerout":
                        case "pointerover":
                        case "pointerup":
                            N = f1;
                            break;
                        case "toggle":
                        case "beforetoggle":
                            N = n8;
                    }
                    var it = (e & 4) !== 0,
                        Qt = !it && (t === "scroll" || t === "scrollend"),
                        w = it ? (B !== null ? B + "Capture" : null) : B;
                    it = [];
                    for (var T = M, O; T !== null; ) {
                        var G = T;
                        if (
                            ((O = G.stateNode),
                            (G = G.tag),
                            (G !== 5 && G !== 26 && G !== 27) ||
                                O === null ||
                                w === null ||
                                ((G = Tl(T, w)), G != null && it.push(ri(T, G, O))),
                            Qt)
                        )
                            break;
                        T = T.return;
                    }
                    0 < it.length && ((B = new N(B, tt, null, n, L)), Z.push({ event: B, listeners: it }));
                }
            }
            if ((e & 7) === 0) {
                t: {
                    if (
                        ((B = t === "mouseover" || t === "pointerover"),
                        (N = t === "mouseout" || t === "pointerout"),
                        B && n !== Ru && (tt = n.relatedTarget || n.fromElement) && ($n(tt) || tt[Ha]))
                    )
                        break t;
                    if (
                        (N || B) &&
                        ((B = L.window === L ? L : (B = L.ownerDocument) ? B.defaultView || B.parentWindow : window),
                        N
                            ? ((tt = n.relatedTarget || n.toElement),
                              (N = M),
                              (tt = tt ? $n(tt) : null),
                              tt !== null &&
                                  ((Qt = I(tt)), (it = tt.tag), tt !== Qt || (it !== 5 && it !== 27 && it !== 6)) &&
                                  (tt = null))
                            : ((N = null), (tt = M)),
                        N !== tt)
                    ) {
                        if (
                            ((it = s1),
                            (G = "onMouseLeave"),
                            (w = "onMouseEnter"),
                            (T = "mouse"),
                            (t === "pointerout" || t === "pointerover") &&
                                ((it = f1), (G = "onPointerLeave"), (w = "onPointerEnter"), (T = "pointer")),
                            (Qt = N == null ? B : Cl(N)),
                            (O = tt == null ? B : Cl(tt)),
                            (B = new it(G, T + "leave", N, n, L)),
                            (B.target = Qt),
                            (B.relatedTarget = O),
                            (G = null),
                            $n(L) === M &&
                                ((it = new it(w, T + "enter", tt, n, L)),
                                (it.target = O),
                                (it.relatedTarget = Qt),
                                (G = it)),
                            (Qt = G),
                            N && tt)
                        )
                            e: {
                                for (it = N, w = tt, T = 0, O = it; O; O = ul(O)) T++;
                                for (O = 0, G = w; G; G = ul(G)) O++;
                                for (; 0 < T - O; ) (it = ul(it)), T--;
                                for (; 0 < O - T; ) (w = ul(w)), O--;
                                for (; T--; ) {
                                    if (it === w || (w !== null && it === w.alternate)) break e;
                                    (it = ul(it)), (w = ul(w));
                                }
                                it = null;
                            }
                        else it = null;
                        N !== null && k2(Z, B, N, it, !1), tt !== null && Qt !== null && k2(Z, Qt, tt, it, !0);
                    }
                }
                t: {
                    if (
                        ((B = M ? Cl(M) : window),
                        (N = B.nodeName && B.nodeName.toLowerCase()),
                        N === "select" || (N === "input" && B.type === "file"))
                    )
                        var W = A1;
                    else if (p1(B))
                        if (b1) W = h8;
                        else {
                            W = c8;
                            var ft = s8;
                        }
                    else
                        (N = B.nodeName),
                            !N || N.toLowerCase() !== "input" || (B.type !== "checkbox" && B.type !== "radio")
                                ? M && Mu(M.elementType) && (W = A1)
                                : (W = f8);
                    if (W && (W = W(t, M))) {
                        y1(Z, W, n, L);
                        break t;
                    }
                    ft && ft(t, B, M),
                        t === "focusout" &&
                            M &&
                            B.type === "number" &&
                            M.memoizedProps.value != null &&
                            xu(B, "number", B.value);
                }
                switch (((ft = M ? Cl(M) : window), t)) {
                    case "focusin":
                        (p1(ft) || ft.contentEditable === "true") && ((Ga = ft), (Qu = M), (Dl = null));
                        break;
                    case "focusout":
                        Dl = Qu = Ga = null;
                        break;
                    case "mousedown":
                        Zu = !0;
                        break;
                    case "contextmenu":
                    case "mouseup":
                    case "dragend":
                        (Zu = !1), w1(Z, n, L);
                        break;
                    case "selectionchange":
                        if (v8) break;
                    case "keydown":
                    case "keyup":
                        w1(Z, n, L);
                }
                var et;
                if (Uu)
                    t: {
                        switch (t) {
                            case "compositionstart":
                                var lt = "onCompositionStart";
                                break t;
                            case "compositionend":
                                lt = "onCompositionEnd";
                                break t;
                            case "compositionupdate":
                                lt = "onCompositionUpdate";
                                break t;
                        }
                        lt = void 0;
                    }
                else
                    za
                        ? v1(t, n) && (lt = "onCompositionEnd")
                        : t === "keydown" && n.keyCode === 229 && (lt = "onCompositionStart");
                lt &&
                    (h1 &&
                        n.locale !== "ko" &&
                        (za || lt !== "onCompositionStart"
                            ? lt === "onCompositionEnd" && za && (et = u1())
                            : ((Tn = L), (Bu = "value" in Tn ? Tn.value : Tn.textContent), (za = !0))),
                    (ft = Br(M, lt)),
                    0 < ft.length &&
                        ((lt = new c1(lt, t, null, n, L)),
                        Z.push({ event: lt, listeners: ft }),
                        et ? (lt.data = et) : ((et = g1(n)), et !== null && (lt.data = et)))),
                    (et = l8 ? i8(t, n) : r8(t, n)) &&
                        ((lt = Br(M, "onBeforeInput")),
                        0 < lt.length &&
                            ((ft = new c1("onBeforeInput", "beforeinput", null, n, L)),
                            Z.push({ event: ft, listeners: lt }),
                            (ft.data = et))),
                    W8(Z, t, M, n, L);
            }
            I2(Z, e);
        });
    }
    function ri(t, e, n) {
        return { instance: t, listener: e, currentTarget: n };
    }
    function Br(t, e) {
        for (var n = e + "Capture", l = []; t !== null; ) {
            var u = t,
                s = u.stateNode;
            (u = u.tag),
                (u !== 5 && u !== 26 && u !== 27) ||
                    s === null ||
                    ((u = Tl(t, n)),
                    u != null && l.unshift(ri(t, u, s)),
                    (u = Tl(t, e)),
                    u != null && l.push(ri(t, u, s))),
                (t = t.return);
        }
        return l;
    }
    function ul(t) {
        if (t === null) return null;
        do t = t.return;
        while (t && t.tag !== 5 && t.tag !== 27);
        return t || null;
    }
    function k2(t, e, n, l, u) {
        for (var s = e._reactName, d = []; n !== null && n !== l; ) {
            var y = n,
                b = y.alternate,
                M = y.stateNode;
            if (((y = y.tag), b !== null && b === l)) break;
            (y !== 5 && y !== 26 && y !== 27) ||
                M === null ||
                ((b = M),
                u
                    ? ((M = Tl(n, s)), M != null && d.unshift(ri(n, M, b)))
                    : u || ((M = Tl(n, s)), M != null && d.push(ri(n, M, b)))),
                (n = n.return);
        }
        d.length !== 0 && t.push({ event: e, listeners: d });
    }
    var e6 = /\r\n?/g,
        n6 = /\u0000|\uFFFD/g;
    function X2(t) {
        return (typeof t == "string" ? t : "" + t)
            .replace(
                e6,
                `
`
            )
            .replace(n6, "");
    }
    function q2(t, e) {
        return (e = X2(e)), X2(t) === e;
    }
    function Dr() {}
    function wt(t, e, n, l, u, s) {
        switch (n) {
            case "children":
                typeof l == "string"
                    ? e === "body" || (e === "textarea" && l === "") || La(t, l)
                    : (typeof l == "number" || typeof l == "bigint") && e !== "body" && La(t, "" + l);
                break;
            case "className":
                Qi(t, "class", l);
                break;
            case "tabIndex":
                Qi(t, "tabindex", l);
                break;
            case "dir":
            case "role":
            case "viewBox":
            case "width":
            case "height":
                Qi(t, n, l);
                break;
            case "style":
                l1(t, l, s);
                break;
            case "data":
                if (e !== "object") {
                    Qi(t, "data", l);
                    break;
                }
            case "src":
            case "href":
                if (l === "" && (e !== "a" || n !== "href")) {
                    t.removeAttribute(n);
                    break;
                }
                if (l == null || typeof l == "function" || typeof l == "symbol" || typeof l == "boolean") {
                    t.removeAttribute(n);
                    break;
                }
                (l = Fi("" + l)), t.setAttribute(n, l);
                break;
            case "action":
            case "formAction":
                if (typeof l == "function") {
                    t.setAttribute(
                        n,
                        "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')"
                    );
                    break;
                } else
                    typeof s == "function" &&
                        (n === "formAction"
                            ? (e !== "input" && wt(t, e, "name", u.name, u, null),
                              wt(t, e, "formEncType", u.formEncType, u, null),
                              wt(t, e, "formMethod", u.formMethod, u, null),
                              wt(t, e, "formTarget", u.formTarget, u, null))
                            : (wt(t, e, "encType", u.encType, u, null),
                              wt(t, e, "method", u.method, u, null),
                              wt(t, e, "target", u.target, u, null)));
                if (l == null || typeof l == "symbol" || typeof l == "boolean") {
                    t.removeAttribute(n);
                    break;
                }
                (l = Fi("" + l)), t.setAttribute(n, l);
                break;
            case "onClick":
                l != null && (t.onclick = Dr);
                break;
            case "onScroll":
                l != null && mt("scroll", t);
                break;
            case "onScrollEnd":
                l != null && mt("scrollend", t);
                break;
            case "dangerouslySetInnerHTML":
                if (l != null) {
                    if (typeof l != "object" || !("__html" in l)) throw Error(r(61));
                    if (((n = l.__html), n != null)) {
                        if (u.children != null) throw Error(r(60));
                        t.innerHTML = n;
                    }
                }
                break;
            case "multiple":
                t.multiple = l && typeof l != "function" && typeof l != "symbol";
                break;
            case "muted":
                t.muted = l && typeof l != "function" && typeof l != "symbol";
                break;
            case "suppressContentEditableWarning":
            case "suppressHydrationWarning":
            case "defaultValue":
            case "defaultChecked":
            case "innerHTML":
            case "ref":
                break;
            case "autoFocus":
                break;
            case "xlinkHref":
                if (l == null || typeof l == "function" || typeof l == "boolean" || typeof l == "symbol") {
                    t.removeAttribute("xlink:href");
                    break;
                }
                (n = Fi("" + l)), t.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", n);
                break;
            case "contentEditable":
            case "spellCheck":
            case "draggable":
            case "value":
            case "autoReverse":
            case "externalResourcesRequired":
            case "focusable":
            case "preserveAlpha":
                l != null && typeof l != "function" && typeof l != "symbol"
                    ? t.setAttribute(n, "" + l)
                    : t.removeAttribute(n);
                break;
            case "inert":
            case "allowFullScreen":
            case "async":
            case "autoPlay":
            case "controls":
            case "default":
            case "defer":
            case "disabled":
            case "disablePictureInPicture":
            case "disableRemotePlayback":
            case "formNoValidate":
            case "hidden":
            case "loop":
            case "noModule":
            case "noValidate":
            case "open":
            case "playsInline":
            case "readOnly":
            case "required":
            case "reversed":
            case "scoped":
            case "seamless":
            case "itemScope":
                l && typeof l != "function" && typeof l != "symbol" ? t.setAttribute(n, "") : t.removeAttribute(n);
                break;
            case "capture":
            case "download":
                l === !0
                    ? t.setAttribute(n, "")
                    : l !== !1 && l != null && typeof l != "function" && typeof l != "symbol"
                      ? t.setAttribute(n, l)
                      : t.removeAttribute(n);
                break;
            case "cols":
            case "rows":
            case "size":
            case "span":
                l != null && typeof l != "function" && typeof l != "symbol" && !isNaN(l) && 1 <= l
                    ? t.setAttribute(n, l)
                    : t.removeAttribute(n);
                break;
            case "rowSpan":
            case "start":
                l == null || typeof l == "function" || typeof l == "symbol" || isNaN(l)
                    ? t.removeAttribute(n)
                    : t.setAttribute(n, l);
                break;
            case "popover":
                mt("beforetoggle", t), mt("toggle", t), Gi(t, "popover", l);
                break;
            case "xlinkActuate":
                nn(t, "http://www.w3.org/1999/xlink", "xlink:actuate", l);
                break;
            case "xlinkArcrole":
                nn(t, "http://www.w3.org/1999/xlink", "xlink:arcrole", l);
                break;
            case "xlinkRole":
                nn(t, "http://www.w3.org/1999/xlink", "xlink:role", l);
                break;
            case "xlinkShow":
                nn(t, "http://www.w3.org/1999/xlink", "xlink:show", l);
                break;
            case "xlinkTitle":
                nn(t, "http://www.w3.org/1999/xlink", "xlink:title", l);
                break;
            case "xlinkType":
                nn(t, "http://www.w3.org/1999/xlink", "xlink:type", l);
                break;
            case "xmlBase":
                nn(t, "http://www.w3.org/XML/1998/namespace", "xml:base", l);
                break;
            case "xmlLang":
                nn(t, "http://www.w3.org/XML/1998/namespace", "xml:lang", l);
                break;
            case "xmlSpace":
                nn(t, "http://www.w3.org/XML/1998/namespace", "xml:space", l);
                break;
            case "is":
                Gi(t, "is", l);
                break;
            case "innerText":
            case "textContent":
                break;
            default:
                (!(2 < n.length) || (n[0] !== "o" && n[0] !== "O") || (n[1] !== "n" && n[1] !== "N")) &&
                    ((n = B4.get(n) || n), Gi(t, n, l));
        }
    }
    function fs(t, e, n, l, u, s) {
        switch (n) {
            case "style":
                l1(t, l, s);
                break;
            case "dangerouslySetInnerHTML":
                if (l != null) {
                    if (typeof l != "object" || !("__html" in l)) throw Error(r(61));
                    if (((n = l.__html), n != null)) {
                        if (u.children != null) throw Error(r(60));
                        t.innerHTML = n;
                    }
                }
                break;
            case "children":
                typeof l == "string" ? La(t, l) : (typeof l == "number" || typeof l == "bigint") && La(t, "" + l);
                break;
            case "onScroll":
                l != null && mt("scroll", t);
                break;
            case "onScrollEnd":
                l != null && mt("scrollend", t);
                break;
            case "onClick":
                l != null && (t.onclick = Dr);
                break;
            case "suppressContentEditableWarning":
            case "suppressHydrationWarning":
            case "innerHTML":
            case "ref":
                break;
            case "innerText":
            case "textContent":
                break;
            default:
                if (!qc.hasOwnProperty(n))
                    t: {
                        if (
                            n[0] === "o" &&
                            n[1] === "n" &&
                            ((u = n.endsWith("Capture")),
                            (e = n.slice(2, u ? n.length - 7 : void 0)),
                            (s = t[ue] || null),
                            (s = s != null ? s[n] : null),
                            typeof s == "function" && t.removeEventListener(e, s, u),
                            typeof l == "function")
                        ) {
                            typeof s != "function" &&
                                s !== null &&
                                (n in t ? (t[n] = null) : t.hasAttribute(n) && t.removeAttribute(n)),
                                t.addEventListener(e, l, u);
                            break t;
                        }
                        n in t ? (t[n] = l) : l === !0 ? t.setAttribute(n, "") : Gi(t, n, l);
                    }
        }
    }
    function te(t, e, n) {
        switch (e) {
            case "div":
            case "span":
            case "svg":
            case "path":
            case "a":
            case "g":
            case "p":
            case "li":
                break;
            case "img":
                mt("error", t), mt("load", t);
                var l = !1,
                    u = !1,
                    s;
                for (s in n)
                    if (n.hasOwnProperty(s)) {
                        var d = n[s];
                        if (d != null)
                            switch (s) {
                                case "src":
                                    l = !0;
                                    break;
                                case "srcSet":
                                    u = !0;
                                    break;
                                case "children":
                                case "dangerouslySetInnerHTML":
                                    throw Error(r(137, e));
                                default:
                                    wt(t, e, s, d, n, null);
                            }
                    }
                u && wt(t, e, "srcSet", n.srcSet, n, null), l && wt(t, e, "src", n.src, n, null);
                return;
            case "input":
                mt("invalid", t);
                var y = (s = d = u = null),
                    b = null,
                    M = null;
                for (l in n)
                    if (n.hasOwnProperty(l)) {
                        var L = n[l];
                        if (L != null)
                            switch (l) {
                                case "name":
                                    u = L;
                                    break;
                                case "type":
                                    d = L;
                                    break;
                                case "checked":
                                    b = L;
                                    break;
                                case "defaultChecked":
                                    M = L;
                                    break;
                                case "value":
                                    s = L;
                                    break;
                                case "defaultValue":
                                    y = L;
                                    break;
                                case "children":
                                case "dangerouslySetInnerHTML":
                                    if (L != null) throw Error(r(137, e));
                                    break;
                                default:
                                    wt(t, e, l, L, n, null);
                            }
                    }
                t1(t, s, y, b, M, d, u, !1), Zi(t);
                return;
            case "select":
                mt("invalid", t), (l = d = s = null);
                for (u in n)
                    if (n.hasOwnProperty(u) && ((y = n[u]), y != null))
                        switch (u) {
                            case "value":
                                s = y;
                                break;
                            case "defaultValue":
                                d = y;
                                break;
                            case "multiple":
                                l = y;
                            default:
                                wt(t, e, u, y, n, null);
                        }
                (e = s), (n = d), (t.multiple = !!l), e != null ? Na(t, !!l, e, !1) : n != null && Na(t, !!l, n, !0);
                return;
            case "textarea":
                mt("invalid", t), (s = u = l = null);
                for (d in n)
                    if (n.hasOwnProperty(d) && ((y = n[d]), y != null))
                        switch (d) {
                            case "value":
                                l = y;
                                break;
                            case "defaultValue":
                                u = y;
                                break;
                            case "children":
                                s = y;
                                break;
                            case "dangerouslySetInnerHTML":
                                if (y != null) throw Error(r(91));
                                break;
                            default:
                                wt(t, e, d, y, n, null);
                        }
                n1(t, l, u, s), Zi(t);
                return;
            case "option":
                for (b in n)
                    if (n.hasOwnProperty(b) && ((l = n[b]), l != null))
                        switch (b) {
                            case "selected":
                                t.selected = l && typeof l != "function" && typeof l != "symbol";
                                break;
                            default:
                                wt(t, e, b, l, n, null);
                        }
                return;
            case "dialog":
                mt("cancel", t), mt("close", t);
                break;
            case "iframe":
            case "object":
                mt("load", t);
                break;
            case "video":
            case "audio":
                for (l = 0; l < ii.length; l++) mt(ii[l], t);
                break;
            case "image":
                mt("error", t), mt("load", t);
                break;
            case "details":
                mt("toggle", t);
                break;
            case "embed":
            case "source":
            case "link":
                mt("error", t), mt("load", t);
            case "area":
            case "base":
            case "br":
            case "col":
            case "hr":
            case "keygen":
            case "meta":
            case "param":
            case "track":
            case "wbr":
            case "menuitem":
                for (M in n)
                    if (n.hasOwnProperty(M) && ((l = n[M]), l != null))
                        switch (M) {
                            case "children":
                            case "dangerouslySetInnerHTML":
                                throw Error(r(137, e));
                            default:
                                wt(t, e, M, l, n, null);
                        }
                return;
            default:
                if (Mu(e)) {
                    for (L in n) n.hasOwnProperty(L) && ((l = n[L]), l !== void 0 && fs(t, e, L, l, n, void 0));
                    return;
                }
        }
        for (y in n) n.hasOwnProperty(y) && ((l = n[y]), l != null && wt(t, e, y, l, n, null));
    }
    function a6(t, e, n, l) {
        switch (e) {
            case "div":
            case "span":
            case "svg":
            case "path":
            case "a":
            case "g":
            case "p":
            case "li":
                break;
            case "input":
                var u = null,
                    s = null,
                    d = null,
                    y = null,
                    b = null,
                    M = null,
                    L = null;
                for (N in n) {
                    var Z = n[N];
                    if (n.hasOwnProperty(N) && Z != null)
                        switch (N) {
                            case "checked":
                                break;
                            case "value":
                                break;
                            case "defaultValue":
                                b = Z;
                            default:
                                l.hasOwnProperty(N) || wt(t, e, N, null, l, Z);
                        }
                }
                for (var B in l) {
                    var N = l[B];
                    if (((Z = n[B]), l.hasOwnProperty(B) && (N != null || Z != null)))
                        switch (B) {
                            case "type":
                                s = N;
                                break;
                            case "name":
                                u = N;
                                break;
                            case "checked":
                                M = N;
                                break;
                            case "defaultChecked":
                                L = N;
                                break;
                            case "value":
                                d = N;
                                break;
                            case "defaultValue":
                                y = N;
                                break;
                            case "children":
                            case "dangerouslySetInnerHTML":
                                if (N != null) throw Error(r(137, e));
                                break;
                            default:
                                N !== Z && wt(t, e, B, N, l, Z);
                        }
                }
                Tu(t, d, y, b, M, L, s, u);
                return;
            case "select":
                N = d = y = B = null;
                for (s in n)
                    if (((b = n[s]), n.hasOwnProperty(s) && b != null))
                        switch (s) {
                            case "value":
                                break;
                            case "multiple":
                                N = b;
                            default:
                                l.hasOwnProperty(s) || wt(t, e, s, null, l, b);
                        }
                for (u in l)
                    if (((s = l[u]), (b = n[u]), l.hasOwnProperty(u) && (s != null || b != null)))
                        switch (u) {
                            case "value":
                                B = s;
                                break;
                            case "defaultValue":
                                y = s;
                                break;
                            case "multiple":
                                d = s;
                            default:
                                s !== b && wt(t, e, u, s, l, b);
                        }
                (e = y),
                    (n = d),
                    (l = N),
                    B != null
                        ? Na(t, !!n, B, !1)
                        : !!l != !!n && (e != null ? Na(t, !!n, e, !0) : Na(t, !!n, n ? [] : "", !1));
                return;
            case "textarea":
                N = B = null;
                for (y in n)
                    if (((u = n[y]), n.hasOwnProperty(y) && u != null && !l.hasOwnProperty(y)))
                        switch (y) {
                            case "value":
                                break;
                            case "children":
                                break;
                            default:
                                wt(t, e, y, null, l, u);
                        }
                for (d in l)
                    if (((u = l[d]), (s = n[d]), l.hasOwnProperty(d) && (u != null || s != null)))
                        switch (d) {
                            case "value":
                                B = u;
                                break;
                            case "defaultValue":
                                N = u;
                                break;
                            case "children":
                                break;
                            case "dangerouslySetInnerHTML":
                                if (u != null) throw Error(r(91));
                                break;
                            default:
                                u !== s && wt(t, e, d, u, l, s);
                        }
                e1(t, B, N);
                return;
            case "option":
                for (var tt in n)
                    if (((B = n[tt]), n.hasOwnProperty(tt) && B != null && !l.hasOwnProperty(tt)))
                        switch (tt) {
                            case "selected":
                                t.selected = !1;
                                break;
                            default:
                                wt(t, e, tt, null, l, B);
                        }
                for (b in l)
                    if (((B = l[b]), (N = n[b]), l.hasOwnProperty(b) && B !== N && (B != null || N != null)))
                        switch (b) {
                            case "selected":
                                t.selected = B && typeof B != "function" && typeof B != "symbol";
                                break;
                            default:
                                wt(t, e, b, B, l, N);
                        }
                return;
            case "img":
            case "link":
            case "area":
            case "base":
            case "br":
            case "col":
            case "embed":
            case "hr":
            case "keygen":
            case "meta":
            case "param":
            case "source":
            case "track":
            case "wbr":
            case "menuitem":
                for (var it in n)
                    (B = n[it]), n.hasOwnProperty(it) && B != null && !l.hasOwnProperty(it) && wt(t, e, it, null, l, B);
                for (M in l)
                    if (((B = l[M]), (N = n[M]), l.hasOwnProperty(M) && B !== N && (B != null || N != null)))
                        switch (M) {
                            case "children":
                            case "dangerouslySetInnerHTML":
                                if (B != null) throw Error(r(137, e));
                                break;
                            default:
                                wt(t, e, M, B, l, N);
                        }
                return;
            default:
                if (Mu(e)) {
                    for (var Qt in n)
                        (B = n[Qt]),
                            n.hasOwnProperty(Qt) && B !== void 0 && !l.hasOwnProperty(Qt) && fs(t, e, Qt, void 0, l, B);
                    for (L in l)
                        (B = l[L]),
                            (N = n[L]),
                            !l.hasOwnProperty(L) || B === N || (B === void 0 && N === void 0) || fs(t, e, L, B, l, N);
                    return;
                }
        }
        for (var w in n)
            (B = n[w]), n.hasOwnProperty(w) && B != null && !l.hasOwnProperty(w) && wt(t, e, w, null, l, B);
        for (Z in l)
            (B = l[Z]), (N = n[Z]), !l.hasOwnProperty(Z) || B === N || (B == null && N == null) || wt(t, e, Z, B, l, N);
    }
    var hs = null,
        ds = null;
    function _r(t) {
        return t.nodeType === 9 ? t : t.ownerDocument;
    }
    function K2(t) {
        switch (t) {
            case "http://www.w3.org/2000/svg":
                return 1;
            case "http://www.w3.org/1998/Math/MathML":
                return 2;
            default:
                return 0;
        }
    }
    function W2(t, e) {
        if (t === 0)
            switch (e) {
                case "svg":
                    return 1;
                case "math":
                    return 2;
                default:
                    return 0;
            }
        return t === 1 && e === "foreignObject" ? 0 : t;
    }
    function ms(t, e) {
        return (
            t === "textarea" ||
            t === "noscript" ||
            typeof e.children == "string" ||
            typeof e.children == "number" ||
            typeof e.children == "bigint" ||
            (typeof e.dangerouslySetInnerHTML == "object" &&
                e.dangerouslySetInnerHTML !== null &&
                e.dangerouslySetInnerHTML.__html != null)
        );
    }
    var vs = null;
    function l6() {
        var t = window.event;
        return t && t.type === "popstate" ? (t === vs ? !1 : ((vs = t), !0)) : ((vs = null), !1);
    }
    var J2 = typeof setTimeout == "function" ? setTimeout : void 0,
        i6 = typeof clearTimeout == "function" ? clearTimeout : void 0,
        $2 = typeof Promise == "function" ? Promise : void 0,
        r6 =
            typeof queueMicrotask == "function"
                ? queueMicrotask
                : typeof $2 < "u"
                  ? function (t) {
                        return $2.resolve(null).then(t).catch(u6);
                    }
                  : J2;
    function u6(t) {
        setTimeout(function () {
            throw t;
        });
    }
    function gs(t, e) {
        var n = e,
            l = 0;
        do {
            var u = n.nextSibling;
            if ((t.removeChild(n), u && u.nodeType === 8))
                if (((n = u.data), n === "/$")) {
                    if (l === 0) {
                        t.removeChild(u), mi(e);
                        return;
                    }
                    l--;
                } else (n !== "$" && n !== "$?" && n !== "$!") || l++;
            n = u;
        } while (n);
        mi(e);
    }
    function ps(t) {
        var e = t.firstChild;
        for (e && e.nodeType === 10 && (e = e.nextSibling); e; ) {
            var n = e;
            switch (((e = e.nextSibling), n.nodeName)) {
                case "HTML":
                case "HEAD":
                case "BODY":
                    ps(n), Cu(n);
                    continue;
                case "SCRIPT":
                case "STYLE":
                    continue;
                case "LINK":
                    if (n.rel.toLowerCase() === "stylesheet") continue;
            }
            t.removeChild(n);
        }
    }
    function o6(t, e, n, l) {
        for (; t.nodeType === 1; ) {
            var u = n;
            if (t.nodeName.toLowerCase() !== e.toLowerCase()) {
                if (!l && (t.nodeName !== "INPUT" || t.type !== "hidden")) break;
            } else if (l) {
                if (!t[Sl])
                    switch (e) {
                        case "meta":
                            if (!t.hasAttribute("itemprop")) break;
                            return t;
                        case "link":
                            if (((s = t.getAttribute("rel")), s === "stylesheet" && t.hasAttribute("data-precedence")))
                                break;
                            if (
                                s !== u.rel ||
                                t.getAttribute("href") !== (u.href == null ? null : u.href) ||
                                t.getAttribute("crossorigin") !== (u.crossOrigin == null ? null : u.crossOrigin) ||
                                t.getAttribute("title") !== (u.title == null ? null : u.title)
                            )
                                break;
                            return t;
                        case "style":
                            if (t.hasAttribute("data-precedence")) break;
                            return t;
                        case "script":
                            if (
                                ((s = t.getAttribute("src")),
                                (s !== (u.src == null ? null : u.src) ||
                                    t.getAttribute("type") !== (u.type == null ? null : u.type) ||
                                    t.getAttribute("crossorigin") !== (u.crossOrigin == null ? null : u.crossOrigin)) &&
                                    s &&
                                    t.hasAttribute("async") &&
                                    !t.hasAttribute("itemprop"))
                            )
                                break;
                            return t;
                        default:
                            return t;
                    }
            } else if (e === "input" && t.type === "hidden") {
                var s = u.name == null ? null : "" + u.name;
                if (u.type === "hidden" && t.getAttribute("name") === s) return t;
            } else return t;
            if (((t = ze(t.nextSibling)), t === null)) break;
        }
        return null;
    }
    function s6(t, e, n) {
        if (e === "") return null;
        for (; t.nodeType !== 3; )
            if (
                ((t.nodeType !== 1 || t.nodeName !== "INPUT" || t.type !== "hidden") && !n) ||
                ((t = ze(t.nextSibling)), t === null)
            )
                return null;
        return t;
    }
    function ze(t) {
        for (; t != null; t = t.nextSibling) {
            var e = t.nodeType;
            if (e === 1 || e === 3) break;
            if (e === 8) {
                if (((e = t.data), e === "$" || e === "$!" || e === "$?" || e === "F!" || e === "F")) break;
                if (e === "/$") return null;
            }
        }
        return t;
    }
    function t0(t) {
        t = t.previousSibling;
        for (var e = 0; t; ) {
            if (t.nodeType === 8) {
                var n = t.data;
                if (n === "$" || n === "$!" || n === "$?") {
                    if (e === 0) return t;
                    e--;
                } else n === "/$" && e++;
            }
            t = t.previousSibling;
        }
        return null;
    }
    function e0(t, e, n) {
        switch (((e = _r(n)), t)) {
            case "html":
                if (((t = e.documentElement), !t)) throw Error(r(452));
                return t;
            case "head":
                if (((t = e.head), !t)) throw Error(r(453));
                return t;
            case "body":
                if (((t = e.body), !t)) throw Error(r(454));
                return t;
            default:
                throw Error(r(451));
        }
    }
    var De = new Map(),
        n0 = new Set();
    function Nr(t) {
        return typeof t.getRootNode == "function" ? t.getRootNode() : t.ownerDocument;
    }
    var yn = q.d;
    q.d = { f: c6, r: f6, D: h6, C: d6, L: m6, m: v6, X: p6, S: g6, M: y6 };
    function c6() {
        var t = yn.f(),
            e = Mr();
        return t || e;
    }
    function f6(t) {
        var e = Ba(t);
        e !== null && e.tag === 5 && e.type === "form" ? Of(e) : yn.r(t);
    }
    var ol = typeof document > "u" ? null : document;
    function a0(t, e, n) {
        var l = ol;
        if (l && typeof e == "string" && e) {
            var u = Se(e);
            (u = 'link[rel="' + t + '"][href="' + u + '"]'),
                typeof n == "string" && (u += '[crossorigin="' + n + '"]'),
                n0.has(u) ||
                    (n0.add(u),
                    (t = { rel: t, crossOrigin: n, href: e }),
                    l.querySelector(u) === null &&
                        ((e = l.createElement("link")), te(e, "link", t), Xt(e), l.head.appendChild(e)));
        }
    }
    function h6(t) {
        yn.D(t), a0("dns-prefetch", t, null);
    }
    function d6(t, e) {
        yn.C(t, e), a0("preconnect", t, e);
    }
    function m6(t, e, n) {
        yn.L(t, e, n);
        var l = ol;
        if (l && t && e) {
            var u = 'link[rel="preload"][as="' + Se(e) + '"]';
            e === "image" && n && n.imageSrcSet
                ? ((u += '[imagesrcset="' + Se(n.imageSrcSet) + '"]'),
                  typeof n.imageSizes == "string" && (u += '[imagesizes="' + Se(n.imageSizes) + '"]'))
                : (u += '[href="' + Se(t) + '"]');
            var s = u;
            switch (e) {
                case "style":
                    s = sl(t);
                    break;
                case "script":
                    s = cl(t);
            }
            De.has(s) ||
                ((t = K({ rel: "preload", href: e === "image" && n && n.imageSrcSet ? void 0 : t, as: e }, n)),
                De.set(s, t),
                l.querySelector(u) !== null ||
                    (e === "style" && l.querySelector(ui(s))) ||
                    (e === "script" && l.querySelector(oi(s))) ||
                    ((e = l.createElement("link")), te(e, "link", t), Xt(e), l.head.appendChild(e)));
        }
    }
    function v6(t, e) {
        yn.m(t, e);
        var n = ol;
        if (n && t) {
            var l = e && typeof e.as == "string" ? e.as : "script",
                u = 'link[rel="modulepreload"][as="' + Se(l) + '"][href="' + Se(t) + '"]',
                s = u;
            switch (l) {
                case "audioworklet":
                case "paintworklet":
                case "serviceworker":
                case "sharedworker":
                case "worker":
                case "script":
                    s = cl(t);
            }
            if (
                !De.has(s) &&
                ((t = K({ rel: "modulepreload", href: t }, e)), De.set(s, t), n.querySelector(u) === null)
            ) {
                switch (l) {
                    case "audioworklet":
                    case "paintworklet":
                    case "serviceworker":
                    case "sharedworker":
                    case "worker":
                    case "script":
                        if (n.querySelector(oi(s))) return;
                }
                (l = n.createElement("link")), te(l, "link", t), Xt(l), n.head.appendChild(l);
            }
        }
    }
    function g6(t, e, n) {
        yn.S(t, e, n);
        var l = ol;
        if (l && t) {
            var u = Da(l).hoistableStyles,
                s = sl(t);
            e = e || "default";
            var d = u.get(s);
            if (!d) {
                var y = { loading: 0, preload: null };
                if ((d = l.querySelector(ui(s)))) y.loading = 5;
                else {
                    (t = K({ rel: "stylesheet", href: t, "data-precedence": e }, n)), (n = De.get(s)) && ys(t, n);
                    var b = (d = l.createElement("link"));
                    Xt(b),
                        te(b, "link", t),
                        (b._p = new Promise(function (M, L) {
                            (b.onload = M), (b.onerror = L);
                        })),
                        b.addEventListener("load", function () {
                            y.loading |= 1;
                        }),
                        b.addEventListener("error", function () {
                            y.loading |= 2;
                        }),
                        (y.loading |= 4),
                        Lr(d, e, l);
                }
                (d = { type: "stylesheet", instance: d, count: 1, state: y }), u.set(s, d);
            }
        }
    }
    function p6(t, e) {
        yn.X(t, e);
        var n = ol;
        if (n && t) {
            var l = Da(n).hoistableScripts,
                u = cl(t),
                s = l.get(u);
            s ||
                ((s = n.querySelector(oi(u))),
                s ||
                    ((t = K({ src: t, async: !0 }, e)),
                    (e = De.get(u)) && As(t, e),
                    (s = n.createElement("script")),
                    Xt(s),
                    te(s, "link", t),
                    n.head.appendChild(s)),
                (s = { type: "script", instance: s, count: 1, state: null }),
                l.set(u, s));
        }
    }
    function y6(t, e) {
        yn.M(t, e);
        var n = ol;
        if (n && t) {
            var l = Da(n).hoistableScripts,
                u = cl(t),
                s = l.get(u);
            s ||
                ((s = n.querySelector(oi(u))),
                s ||
                    ((t = K({ src: t, async: !0, type: "module" }, e)),
                    (e = De.get(u)) && As(t, e),
                    (s = n.createElement("script")),
                    Xt(s),
                    te(s, "link", t),
                    n.head.appendChild(s)),
                (s = { type: "script", instance: s, count: 1, state: null }),
                l.set(u, s));
        }
    }
    function l0(t, e, n, l) {
        var u = (u = ce.current) ? Nr(u) : null;
        if (!u) throw Error(r(446));
        switch (t) {
            case "meta":
            case "title":
                return null;
            case "style":
                return typeof n.precedence == "string" && typeof n.href == "string"
                    ? ((e = sl(n.href)),
                      (n = Da(u).hoistableStyles),
                      (l = n.get(e)),
                      l || ((l = { type: "style", instance: null, count: 0, state: null }), n.set(e, l)),
                      l)
                    : { type: "void", instance: null, count: 0, state: null };
            case "link":
                if (n.rel === "stylesheet" && typeof n.href == "string" && typeof n.precedence == "string") {
                    t = sl(n.href);
                    var s = Da(u).hoistableStyles,
                        d = s.get(t);
                    if (
                        (d ||
                            ((u = u.ownerDocument || u),
                            (d = {
                                type: "stylesheet",
                                instance: null,
                                count: 0,
                                state: { loading: 0, preload: null },
                            }),
                            s.set(t, d),
                            (s = u.querySelector(ui(t))) && !s._p && ((d.instance = s), (d.state.loading = 5)),
                            De.has(t) ||
                                ((n = {
                                    rel: "preload",
                                    as: "style",
                                    href: n.href,
                                    crossOrigin: n.crossOrigin,
                                    integrity: n.integrity,
                                    media: n.media,
                                    hrefLang: n.hrefLang,
                                    referrerPolicy: n.referrerPolicy,
                                }),
                                De.set(t, n),
                                s || A6(u, t, n, d.state))),
                        e && l === null)
                    )
                        throw Error(r(528, ""));
                    return d;
                }
                if (e && l !== null) throw Error(r(529, ""));
                return null;
            case "script":
                return (
                    (e = n.async),
                    (n = n.src),
                    typeof n == "string" && e && typeof e != "function" && typeof e != "symbol"
                        ? ((e = cl(n)),
                          (n = Da(u).hoistableScripts),
                          (l = n.get(e)),
                          l || ((l = { type: "script", instance: null, count: 0, state: null }), n.set(e, l)),
                          l)
                        : { type: "void", instance: null, count: 0, state: null }
                );
            default:
                throw Error(r(444, t));
        }
    }
    function sl(t) {
        return 'href="' + Se(t) + '"';
    }
    function ui(t) {
        return 'link[rel="stylesheet"][' + t + "]";
    }
    function i0(t) {
        return K({}, t, { "data-precedence": t.precedence, precedence: null });
    }
    function A6(t, e, n, l) {
        t.querySelector('link[rel="preload"][as="style"][' + e + "]")
            ? (l.loading = 1)
            : ((e = t.createElement("link")),
              (l.preload = e),
              e.addEventListener("load", function () {
                  return (l.loading |= 1);
              }),
              e.addEventListener("error", function () {
                  return (l.loading |= 2);
              }),
              te(e, "link", n),
              Xt(e),
              t.head.appendChild(e));
    }
    function cl(t) {
        return '[src="' + Se(t) + '"]';
    }
    function oi(t) {
        return "script[async]" + t;
    }
    function r0(t, e, n) {
        if ((e.count++, e.instance === null))
            switch (e.type) {
                case "style":
                    var l = t.querySelector('style[data-href~="' + Se(n.href) + '"]');
                    if (l) return (e.instance = l), Xt(l), l;
                    var u = K({}, n, {
                        "data-href": n.href,
                        "data-precedence": n.precedence,
                        href: null,
                        precedence: null,
                    });
                    return (
                        (l = (t.ownerDocument || t).createElement("style")),
                        Xt(l),
                        te(l, "style", u),
                        Lr(l, n.precedence, t),
                        (e.instance = l)
                    );
                case "stylesheet":
                    u = sl(n.href);
                    var s = t.querySelector(ui(u));
                    if (s) return (e.state.loading |= 4), (e.instance = s), Xt(s), s;
                    (l = i0(n)), (u = De.get(u)) && ys(l, u), (s = (t.ownerDocument || t).createElement("link")), Xt(s);
                    var d = s;
                    return (
                        (d._p = new Promise(function (y, b) {
                            (d.onload = y), (d.onerror = b);
                        })),
                        te(s, "link", l),
                        (e.state.loading |= 4),
                        Lr(s, n.precedence, t),
                        (e.instance = s)
                    );
                case "script":
                    return (
                        (s = cl(n.src)),
                        (u = t.querySelector(oi(s)))
                            ? ((e.instance = u), Xt(u), u)
                            : ((l = n),
                              (u = De.get(s)) && ((l = K({}, n)), As(l, u)),
                              (t = t.ownerDocument || t),
                              (u = t.createElement("script")),
                              Xt(u),
                              te(u, "link", l),
                              t.head.appendChild(u),
                              (e.instance = u))
                    );
                case "void":
                    return null;
                default:
                    throw Error(r(443, e.type));
            }
        else
            e.type === "stylesheet" &&
                (e.state.loading & 4) === 0 &&
                ((l = e.instance), (e.state.loading |= 4), Lr(l, n.precedence, t));
        return e.instance;
    }
    function Lr(t, e, n) {
        for (
            var l = n.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),
                u = l.length ? l[l.length - 1] : null,
                s = u,
                d = 0;
            d < l.length;
            d++
        ) {
            var y = l[d];
            if (y.dataset.precedence === e) s = y;
            else if (s !== u) break;
        }
        s
            ? s.parentNode.insertBefore(t, s.nextSibling)
            : ((e = n.nodeType === 9 ? n.head : n), e.insertBefore(t, e.firstChild));
    }
    function ys(t, e) {
        t.crossOrigin == null && (t.crossOrigin = e.crossOrigin),
            t.referrerPolicy == null && (t.referrerPolicy = e.referrerPolicy),
            t.title == null && (t.title = e.title);
    }
    function As(t, e) {
        t.crossOrigin == null && (t.crossOrigin = e.crossOrigin),
            t.referrerPolicy == null && (t.referrerPolicy = e.referrerPolicy),
            t.integrity == null && (t.integrity = e.integrity);
    }
    var Ur = null;
    function u0(t, e, n) {
        if (Ur === null) {
            var l = new Map(),
                u = (Ur = new Map());
            u.set(n, l);
        } else (u = Ur), (l = u.get(n)), l || ((l = new Map()), u.set(n, l));
        if (l.has(t)) return l;
        for (l.set(t, null), n = n.getElementsByTagName(t), u = 0; u < n.length; u++) {
            var s = n[u];
            if (
                !(s[Sl] || s[ee] || (t === "link" && s.getAttribute("rel") === "stylesheet")) &&
                s.namespaceURI !== "http://www.w3.org/2000/svg"
            ) {
                var d = s.getAttribute(e) || "";
                d = t + d;
                var y = l.get(d);
                y ? y.push(s) : l.set(d, [s]);
            }
        }
        return l;
    }
    function o0(t, e, n) {
        (t = t.ownerDocument || t), t.head.insertBefore(n, e === "title" ? t.querySelector("head > title") : null);
    }
    function b6(t, e, n) {
        if (n === 1 || e.itemProp != null) return !1;
        switch (t) {
            case "meta":
            case "title":
                return !0;
            case "style":
                if (typeof e.precedence != "string" || typeof e.href != "string" || e.href === "") break;
                return !0;
            case "link":
                if (typeof e.rel != "string" || typeof e.href != "string" || e.href === "" || e.onLoad || e.onError)
                    break;
                switch (e.rel) {
                    case "stylesheet":
                        return (t = e.disabled), typeof e.precedence == "string" && t == null;
                    default:
                        return !0;
                }
            case "script":
                if (
                    e.async &&
                    typeof e.async != "function" &&
                    typeof e.async != "symbol" &&
                    !e.onLoad &&
                    !e.onError &&
                    e.src &&
                    typeof e.src == "string"
                )
                    return !0;
        }
        return !1;
    }
    function s0(t) {
        return !(t.type === "stylesheet" && (t.state.loading & 3) === 0);
    }
    var si = null;
    function E6() {}
    function S6(t, e, n) {
        if (si === null) throw Error(r(475));
        var l = si;
        if (
            e.type === "stylesheet" &&
            (typeof n.media != "string" || matchMedia(n.media).matches !== !1) &&
            (e.state.loading & 4) === 0
        ) {
            if (e.instance === null) {
                var u = sl(n.href),
                    s = t.querySelector(ui(u));
                if (s) {
                    (t = s._p),
                        t !== null &&
                            typeof t == "object" &&
                            typeof t.then == "function" &&
                            (l.count++, (l = Vr.bind(l)), t.then(l, l)),
                        (e.state.loading |= 4),
                        (e.instance = s),
                        Xt(s);
                    return;
                }
                (s = t.ownerDocument || t),
                    (n = i0(n)),
                    (u = De.get(u)) && ys(n, u),
                    (s = s.createElement("link")),
                    Xt(s);
                var d = s;
                (d._p = new Promise(function (y, b) {
                    (d.onload = y), (d.onerror = b);
                })),
                    te(s, "link", n),
                    (e.instance = s);
            }
            l.stylesheets === null && (l.stylesheets = new Map()),
                l.stylesheets.set(e, t),
                (t = e.state.preload) &&
                    (e.state.loading & 3) === 0 &&
                    (l.count++, (e = Vr.bind(l)), t.addEventListener("load", e), t.addEventListener("error", e));
        }
    }
    function C6() {
        if (si === null) throw Error(r(475));
        var t = si;
        return (
            t.stylesheets && t.count === 0 && bs(t, t.stylesheets),
            0 < t.count
                ? function (e) {
                      var n = setTimeout(function () {
                          if ((t.stylesheets && bs(t, t.stylesheets), t.unsuspend)) {
                              var l = t.unsuspend;
                              (t.unsuspend = null), l();
                          }
                      }, 6e4);
                      return (
                          (t.unsuspend = e),
                          function () {
                              (t.unsuspend = null), clearTimeout(n);
                          }
                      );
                  }
                : null
        );
    }
    function Vr() {
        if ((this.count--, this.count === 0)) {
            if (this.stylesheets) bs(this, this.stylesheets);
            else if (this.unsuspend) {
                var t = this.unsuspend;
                (this.unsuspend = null), t();
            }
        }
    }
    var zr = null;
    function bs(t, e) {
        (t.stylesheets = null),
            t.unsuspend !== null && (t.count++, (zr = new Map()), e.forEach(T6, t), (zr = null), Vr.call(t));
    }
    function T6(t, e) {
        if (!(e.state.loading & 4)) {
            var n = zr.get(t);
            if (n) var l = n.get(null);
            else {
                (n = new Map()), zr.set(t, n);
                for (
                    var u = t.querySelectorAll("link[data-precedence],style[data-precedence]"), s = 0;
                    s < u.length;
                    s++
                ) {
                    var d = u[s];
                    (d.nodeName === "LINK" || d.getAttribute("media") !== "not all") &&
                        (n.set(d.dataset.precedence, d), (l = d));
                }
                l && n.set(null, l);
            }
            (u = e.instance),
                (d = u.getAttribute("data-precedence")),
                (s = n.get(d) || l),
                s === l && n.set(null, u),
                n.set(d, u),
                this.count++,
                (l = Vr.bind(this)),
                u.addEventListener("load", l),
                u.addEventListener("error", l),
                s
                    ? s.parentNode.insertBefore(u, s.nextSibling)
                    : ((t = t.nodeType === 9 ? t.head : t), t.insertBefore(u, t.firstChild)),
                (e.state.loading |= 4);
        }
    }
    var ci = { $$typeof: x, Provider: null, Consumer: null, _currentValue: dt, _currentValue2: dt, _threadCount: 0 };
    function x6(t, e, n, l, u, s, d, y) {
        (this.tag = 1),
            (this.containerInfo = t),
            (this.finishedWork = this.pingCache = this.current = this.pendingChildren = null),
            (this.timeoutHandle = -1),
            (this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null),
            (this.callbackPriority = 0),
            (this.expirationTimes = Eu(-1)),
            (this.entangledLanes =
                this.shellSuspendCounter =
                this.errorRecoveryDisabledLanes =
                this.finishedLanes =
                this.expiredLanes =
                this.warmLanes =
                this.pingedLanes =
                this.suspendedLanes =
                this.pendingLanes =
                    0),
            (this.entanglements = Eu(0)),
            (this.hiddenUpdates = Eu(null)),
            (this.identifierPrefix = l),
            (this.onUncaughtError = u),
            (this.onCaughtError = s),
            (this.onRecoverableError = d),
            (this.pooledCache = null),
            (this.pooledCacheLanes = 0),
            (this.formState = y),
            (this.incompleteTransitions = new Map());
    }
    function c0(t, e, n, l, u, s, d, y, b, M, L, Z) {
        return (
            (t = new x6(t, e, n, d, y, b, M, Z)),
            (e = 1),
            s === !0 && (e |= 24),
            (s = He(3, null, null, e)),
            (t.current = s),
            (s.stateNode = t),
            (e = Wu()),
            e.refCount++,
            (t.pooledCache = e),
            e.refCount++,
            (s.memoizedState = { element: l, isDehydrated: n, cache: e }),
            Do(s),
            t
        );
    }
    function f0(t) {
        return t ? ((t = ja), t) : ja;
    }
    function h0(t, e, n, l, u, s) {
        (u = f0(u)),
            l.context === null ? (l.context = u) : (l.pendingContext = u),
            (l = Dn(e)),
            (l.payload = { element: n }),
            (s = s === void 0 ? null : s),
            s !== null && (l.callback = s),
            (n = _n(t, l, e)),
            n !== null && (ie(n, t, e), kl(n, t, e));
    }
    function d0(t, e) {
        if (((t = t.memoizedState), t !== null && t.dehydrated !== null)) {
            var n = t.retryLane;
            t.retryLane = n !== 0 && n < e ? n : e;
        }
    }
    function Es(t, e) {
        d0(t, e), (t = t.alternate) && d0(t, e);
    }
    function m0(t) {
        if (t.tag === 13) {
            var e = xn(t, 67108864);
            e !== null && ie(e, t, 67108864), Es(t, 67108864);
        }
    }
    var Gr = !0;
    function M6(t, e, n, l) {
        var u = P.T;
        P.T = null;
        var s = q.p;
        try {
            (q.p = 2), Ss(t, e, n, l);
        } finally {
            (q.p = s), (P.T = u);
        }
    }
    function R6(t, e, n, l) {
        var u = P.T;
        P.T = null;
        var s = q.p;
        try {
            (q.p = 8), Ss(t, e, n, l);
        } finally {
            (q.p = s), (P.T = u);
        }
    }
    function Ss(t, e, n, l) {
        if (Gr) {
            var u = Cs(l);
            if (u === null) cs(t, e, l, Qr, n), g0(t, l);
            else if (O6(u, t, e, n, l)) l.stopPropagation();
            else if ((g0(t, l), e & 4 && -1 < w6.indexOf(t))) {
                for (; u !== null; ) {
                    var s = Ba(u);
                    if (s !== null)
                        switch (s.tag) {
                            case 3:
                                if (((s = s.stateNode), s.current.memoizedState.isDehydrated)) {
                                    var d = Jn(s.pendingLanes);
                                    if (d !== 0) {
                                        var y = s;
                                        for (y.pendingLanes |= 2, y.entangledLanes |= 2; d; ) {
                                            var b = 1 << (31 - he(d));
                                            (y.entanglements[1] |= b), (d &= ~b);
                                        }
                                        Pe(s), (Ut & 6) === 0 && ((Cr = Ze() + 500), li(0));
                                    }
                                }
                                break;
                            case 13:
                                (y = xn(s, 2)), y !== null && ie(y, s, 2), Mr(), Es(s, 2);
                        }
                    if (((s = Cs(l)), s === null && cs(t, e, l, Qr, n), s === u)) break;
                    u = s;
                }
                u !== null && l.stopPropagation();
            } else cs(t, e, l, null, n);
        }
    }
    function Cs(t) {
        return (t = wu(t)), Ts(t);
    }
    var Qr = null;
    function Ts(t) {
        if (((Qr = null), (t = $n(t)), t !== null)) {
            var e = I(t);
            if (e === null) t = null;
            else {
                var n = e.tag;
                if (n === 13) {
                    if (((t = rt(e)), t !== null)) return t;
                    t = null;
                } else if (n === 3) {
                    if (e.stateNode.current.memoizedState.isDehydrated)
                        return e.tag === 3 ? e.stateNode.containerInfo : null;
                    t = null;
                } else e !== t && (t = null);
            }
        }
        return (Qr = t), null;
    }
    function v0(t) {
        switch (t) {
            case "beforetoggle":
            case "cancel":
            case "click":
            case "close":
            case "contextmenu":
            case "copy":
            case "cut":
            case "auxclick":
            case "dblclick":
            case "dragend":
            case "dragstart":
            case "drop":
            case "focusin":
            case "focusout":
            case "input":
            case "invalid":
            case "keydown":
            case "keypress":
            case "keyup":
            case "mousedown":
            case "mouseup":
            case "paste":
            case "pause":
            case "play":
            case "pointercancel":
            case "pointerdown":
            case "pointerup":
            case "ratechange":
            case "reset":
            case "resize":
            case "seeked":
            case "submit":
            case "toggle":
            case "touchcancel":
            case "touchend":
            case "touchstart":
            case "volumechange":
            case "change":
            case "selectionchange":
            case "textInput":
            case "compositionstart":
            case "compositionend":
            case "compositionupdate":
            case "beforeblur":
            case "afterblur":
            case "beforeinput":
            case "blur":
            case "fullscreenchange":
            case "focus":
            case "hashchange":
            case "popstate":
            case "select":
            case "selectstart":
                return 2;
            case "drag":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "mousemove":
            case "mouseout":
            case "mouseover":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "scroll":
            case "touchmove":
            case "wheel":
            case "mouseenter":
            case "mouseleave":
            case "pointerenter":
            case "pointerleave":
                return 8;
            case "message":
                switch (d4()) {
                    case zc:
                        return 2;
                    case Gc:
                        return 8;
                    case Li:
                    case m4:
                        return 32;
                    case Qc:
                        return 268435456;
                    default:
                        return 32;
                }
            default:
                return 32;
        }
    }
    var xs = !1,
        Qn = null,
        Zn = null,
        jn = null,
        fi = new Map(),
        hi = new Map(),
        Fn = [],
        w6 =
            "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
                " "
            );
    function g0(t, e) {
        switch (t) {
            case "focusin":
            case "focusout":
                Qn = null;
                break;
            case "dragenter":
            case "dragleave":
                Zn = null;
                break;
            case "mouseover":
            case "mouseout":
                jn = null;
                break;
            case "pointerover":
            case "pointerout":
                fi.delete(e.pointerId);
                break;
            case "gotpointercapture":
            case "lostpointercapture":
                hi.delete(e.pointerId);
        }
    }
    function di(t, e, n, l, u, s) {
        return t === null || t.nativeEvent !== s
            ? ((t = { blockedOn: e, domEventName: n, eventSystemFlags: l, nativeEvent: s, targetContainers: [u] }),
              e !== null && ((e = Ba(e)), e !== null && m0(e)),
              t)
            : ((t.eventSystemFlags |= l), (e = t.targetContainers), u !== null && e.indexOf(u) === -1 && e.push(u), t);
    }
    function O6(t, e, n, l, u) {
        switch (e) {
            case "focusin":
                return (Qn = di(Qn, t, e, n, l, u)), !0;
            case "dragenter":
                return (Zn = di(Zn, t, e, n, l, u)), !0;
            case "mouseover":
                return (jn = di(jn, t, e, n, l, u)), !0;
            case "pointerover":
                var s = u.pointerId;
                return fi.set(s, di(fi.get(s) || null, t, e, n, l, u)), !0;
            case "gotpointercapture":
                return (s = u.pointerId), hi.set(s, di(hi.get(s) || null, t, e, n, l, u)), !0;
        }
        return !1;
    }
    function p0(t) {
        var e = $n(t.target);
        if (e !== null) {
            var n = I(e);
            if (n !== null) {
                if (((e = n.tag), e === 13)) {
                    if (((e = rt(n)), e !== null)) {
                        (t.blockedOn = e),
                            C4(t.priority, function () {
                                if (n.tag === 13) {
                                    var l = pe(),
                                        u = xn(n, l);
                                    u !== null && ie(u, n, l), Es(n, l);
                                }
                            });
                        return;
                    }
                } else if (e === 3 && n.stateNode.current.memoizedState.isDehydrated) {
                    t.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
                    return;
                }
            }
        }
        t.blockedOn = null;
    }
    function Zr(t) {
        if (t.blockedOn !== null) return !1;
        for (var e = t.targetContainers; 0 < e.length; ) {
            var n = Cs(t.nativeEvent);
            if (n === null) {
                n = t.nativeEvent;
                var l = new n.constructor(n.type, n);
                (Ru = l), n.target.dispatchEvent(l), (Ru = null);
            } else return (e = Ba(n)), e !== null && m0(e), (t.blockedOn = n), !1;
            e.shift();
        }
        return !0;
    }
    function y0(t, e, n) {
        Zr(t) && n.delete(e);
    }
    function H6() {
        (xs = !1),
            Qn !== null && Zr(Qn) && (Qn = null),
            Zn !== null && Zr(Zn) && (Zn = null),
            jn !== null && Zr(jn) && (jn = null),
            fi.forEach(y0),
            hi.forEach(y0);
    }
    function jr(t, e) {
        t.blockedOn === e &&
            ((t.blockedOn = null), xs || ((xs = !0), a.unstable_scheduleCallback(a.unstable_NormalPriority, H6)));
    }
    var Fr = null;
    function A0(t) {
        Fr !== t &&
            ((Fr = t),
            a.unstable_scheduleCallback(a.unstable_NormalPriority, function () {
                Fr === t && (Fr = null);
                for (var e = 0; e < t.length; e += 3) {
                    var n = t[e],
                        l = t[e + 1],
                        u = t[e + 2];
                    if (typeof l != "function") {
                        if (Ts(l || n) === null) continue;
                        break;
                    }
                    var s = Ba(n);
                    s !== null &&
                        (t.splice(e, 3), (e -= 3), mo(s, { pending: !0, data: u, method: n.method, action: l }, l, u));
                }
            }));
    }
    function mi(t) {
        function e(b) {
            return jr(b, t);
        }
        Qn !== null && jr(Qn, t), Zn !== null && jr(Zn, t), jn !== null && jr(jn, t), fi.forEach(e), hi.forEach(e);
        for (var n = 0; n < Fn.length; n++) {
            var l = Fn[n];
            l.blockedOn === t && (l.blockedOn = null);
        }
        for (; 0 < Fn.length && ((n = Fn[0]), n.blockedOn === null); ) p0(n), n.blockedOn === null && Fn.shift();
        if (((n = (t.ownerDocument || t).$$reactFormReplay), n != null))
            for (l = 0; l < n.length; l += 3) {
                var u = n[l],
                    s = n[l + 1],
                    d = u[ue] || null;
                if (typeof s == "function") d || A0(n);
                else if (d) {
                    var y = null;
                    if (s && s.hasAttribute("formAction")) {
                        if (((u = s), (d = s[ue] || null))) y = d.formAction;
                        else if (Ts(u) !== null) continue;
                    } else y = d.action;
                    typeof y == "function" ? (n[l + 1] = y) : (n.splice(l, 3), (l -= 3)), A0(n);
                }
            }
    }
    function Ms(t) {
        this._internalRoot = t;
    }
    (Yr.prototype.render = Ms.prototype.render =
        function (t) {
            var e = this._internalRoot;
            if (e === null) throw Error(r(409));
            var n = e.current,
                l = pe();
            h0(n, l, t, e, null, null);
        }),
        (Yr.prototype.unmount = Ms.prototype.unmount =
            function () {
                var t = this._internalRoot;
                if (t !== null) {
                    this._internalRoot = null;
                    var e = t.containerInfo;
                    t.tag === 0 && il(), h0(t.current, 2, null, t, null, null), Mr(), (e[Ha] = null);
                }
            });
    function Yr(t) {
        this._internalRoot = t;
    }
    Yr.prototype.unstable_scheduleHydration = function (t) {
        if (t) {
            var e = Pc();
            t = { blockedOn: null, target: t, priority: e };
            for (var n = 0; n < Fn.length && e !== 0 && e < Fn[n].priority; n++);
            Fn.splice(n, 0, t), n === 0 && p0(t);
        }
    };
    var b0 = i.version;
    if (b0 !== "19.0.2") throw Error(r(527, b0, "19.0.2"));
    q.findDOMNode = function (t) {
        var e = t._reactInternals;
        if (e === void 0)
            throw typeof t.render == "function" ? Error(r(188)) : ((t = Object.keys(t).join(",")), Error(r(268, t)));
        return (t = j(e)), (t = t !== null ? at(t) : null), (t = t === null ? null : t.stateNode), t;
    };
    var B6 = {
        bundleType: 0,
        version: "19.0.2",
        rendererPackageName: "react-dom",
        currentDispatcherRef: P,
        findFiberByHostInstance: $n,
        reconcilerVersion: "19.0.2",
    };
    if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
        var Ir = __REACT_DEVTOOLS_GLOBAL_HOOK__;
        if (!Ir.isDisabled && Ir.supportsFiber)
            try {
                (Al = Ir.inject(B6)), (fe = Ir);
            } catch {}
    }
    return (
        (gi.createRoot = function (t, e) {
            if (!c(t)) throw Error(r(299));
            var n = !1,
                l = "",
                u = Vf,
                s = zf,
                d = Gf,
                y = null;
            return (
                e != null &&
                    (e.unstable_strictMode === !0 && (n = !0),
                    e.identifierPrefix !== void 0 && (l = e.identifierPrefix),
                    e.onUncaughtError !== void 0 && (u = e.onUncaughtError),
                    e.onCaughtError !== void 0 && (s = e.onCaughtError),
                    e.onRecoverableError !== void 0 && (d = e.onRecoverableError),
                    e.unstable_transitionCallbacks !== void 0 && (y = e.unstable_transitionCallbacks)),
                (e = c0(t, 1, !1, null, null, n, l, u, s, d, y, null)),
                (t[Ha] = e.current),
                ss(t.nodeType === 8 ? t.parentNode : t),
                new Ms(e)
            );
        }),
        (gi.hydrateRoot = function (t, e, n) {
            if (!c(t)) throw Error(r(299));
            var l = !1,
                u = "",
                s = Vf,
                d = zf,
                y = Gf,
                b = null,
                M = null;
            return (
                n != null &&
                    (n.unstable_strictMode === !0 && (l = !0),
                    n.identifierPrefix !== void 0 && (u = n.identifierPrefix),
                    n.onUncaughtError !== void 0 && (s = n.onUncaughtError),
                    n.onCaughtError !== void 0 && (d = n.onCaughtError),
                    n.onRecoverableError !== void 0 && (y = n.onRecoverableError),
                    n.unstable_transitionCallbacks !== void 0 && (b = n.unstable_transitionCallbacks),
                    n.formState !== void 0 && (M = n.formState)),
                (e = c0(t, 1, !0, e, n ?? null, l, u, s, d, y, b, M)),
                (e.context = f0(null)),
                (n = e.current),
                (l = pe()),
                (u = Dn(l)),
                (u.callback = null),
                _n(n, u, l),
                (e.current.lanes = l),
                El(e, l),
                Pe(e),
                (t[Ha] = e.current),
                ss(t),
                new Yr(e)
            );
        }),
        (gi.version = "19.0.2"),
        gi
    );
}
var H0;
function Z6() {
    if (H0) return ws.exports;
    H0 = 1;
    function a() {
        if (
            !(
                typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" ||
                typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"
            )
        )
            try {
                __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(a);
            } catch (i) {
                console.error(i);
            }
    }
    return a(), (ws.exports = Q6()), ws.exports;
}
var j6 = Z6(),
    qs = function (a, i) {
        return (
            (qs =
                Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array &&
                    function (o, r) {
                        o.__proto__ = r;
                    }) ||
                function (o, r) {
                    for (var c in r) Object.prototype.hasOwnProperty.call(r, c) && (o[c] = r[c]);
                }),
            qs(a, i)
        );
    };
function _e(a, i) {
    if (typeof i != "function" && i !== null)
        throw new TypeError("Class extends value " + String(i) + " is not a constructor or null");
    qs(a, i);
    function o() {
        this.constructor = a;
    }
    a.prototype = i === null ? Object.create(i) : ((o.prototype = i.prototype), new o());
}
var $ = function () {
    return (
        ($ =
            Object.assign ||
            function (i) {
                for (var o, r = 1, c = arguments.length; r < c; r++) {
                    o = arguments[r];
                    for (var f in o) Object.prototype.hasOwnProperty.call(o, f) && (i[f] = o[f]);
                }
                return i;
            }),
        $.apply(this, arguments)
    );
};
function ru(a, i) {
    var o = {};
    for (var r in a) Object.prototype.hasOwnProperty.call(a, r) && i.indexOf(r) < 0 && (o[r] = a[r]);
    if (a != null && typeof Object.getOwnPropertySymbols == "function")
        for (var c = 0, r = Object.getOwnPropertySymbols(a); c < r.length; c++)
            i.indexOf(r[c]) < 0 && Object.prototype.propertyIsEnumerable.call(a, r[c]) && (o[r[c]] = a[r[c]]);
    return o;
}
function qe(a, i, o) {
    if (o || arguments.length === 2)
        for (var r = 0, c = i.length, f; r < c; r++)
            (f || !(r in i)) && (f || (f = Array.prototype.slice.call(i, 0, r)), (f[r] = i[r]));
    return a.concat(f || Array.prototype.slice.call(i));
}
var C = hc();
const Ca = fc(C),
    V3 = _6({ __proto__: null, default: Ca }, [C]);
function ke(a, i) {
    var o = i && i.cache ? i.cache : q6,
        r = i && i.serializer ? i.serializer : k6,
        c = i && i.strategy ? i.strategy : I6;
    return c(a, { cache: o, serializer: r });
}
function F6(a) {
    return a == null || typeof a == "number" || typeof a == "boolean";
}
function Y6(a, i, o, r) {
    var c = F6(r) ? r : o(r),
        f = i.get(c);
    return typeof f > "u" && ((f = a.call(this, r)), i.set(c, f)), f;
}
function z3(a, i, o) {
    var r = Array.prototype.slice.call(arguments, 3),
        c = o(r),
        f = i.get(c);
    return typeof f > "u" && ((f = a.apply(this, r)), i.set(c, f)), f;
}
function G3(a, i, o, r, c) {
    return o.bind(i, a, r, c);
}
function I6(a, i) {
    var o = a.length === 1 ? Y6 : z3;
    return G3(a, this, o, i.cache.create(), i.serializer);
}
function P6(a, i) {
    return G3(a, this, z3, i.cache.create(), i.serializer);
}
var k6 = function () {
        return JSON.stringify(arguments);
    },
    X6 = (function () {
        function a() {
            this.cache = Object.create(null);
        }
        return (
            (a.prototype.get = function (i) {
                return this.cache[i];
            }),
            (a.prototype.set = function (i, o) {
                this.cache[i] = o;
            }),
            a
        );
    })(),
    q6 = {
        create: function () {
            return new X6();
        },
    },
    Xe = { variadic: P6 },
    vt;
(function (a) {
    (a[(a.EXPECT_ARGUMENT_CLOSING_BRACE = 1)] = "EXPECT_ARGUMENT_CLOSING_BRACE"),
        (a[(a.EMPTY_ARGUMENT = 2)] = "EMPTY_ARGUMENT"),
        (a[(a.MALFORMED_ARGUMENT = 3)] = "MALFORMED_ARGUMENT"),
        (a[(a.EXPECT_ARGUMENT_TYPE = 4)] = "EXPECT_ARGUMENT_TYPE"),
        (a[(a.INVALID_ARGUMENT_TYPE = 5)] = "INVALID_ARGUMENT_TYPE"),
        (a[(a.EXPECT_ARGUMENT_STYLE = 6)] = "EXPECT_ARGUMENT_STYLE"),
        (a[(a.INVALID_NUMBER_SKELETON = 7)] = "INVALID_NUMBER_SKELETON"),
        (a[(a.INVALID_DATE_TIME_SKELETON = 8)] = "INVALID_DATE_TIME_SKELETON"),
        (a[(a.EXPECT_NUMBER_SKELETON = 9)] = "EXPECT_NUMBER_SKELETON"),
        (a[(a.EXPECT_DATE_TIME_SKELETON = 10)] = "EXPECT_DATE_TIME_SKELETON"),
        (a[(a.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE = 11)] = "UNCLOSED_QUOTE_IN_ARGUMENT_STYLE"),
        (a[(a.EXPECT_SELECT_ARGUMENT_OPTIONS = 12)] = "EXPECT_SELECT_ARGUMENT_OPTIONS"),
        (a[(a.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE = 13)] = "EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE"),
        (a[(a.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE = 14)] = "INVALID_PLURAL_ARGUMENT_OFFSET_VALUE"),
        (a[(a.EXPECT_SELECT_ARGUMENT_SELECTOR = 15)] = "EXPECT_SELECT_ARGUMENT_SELECTOR"),
        (a[(a.EXPECT_PLURAL_ARGUMENT_SELECTOR = 16)] = "EXPECT_PLURAL_ARGUMENT_SELECTOR"),
        (a[(a.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT = 17)] = "EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT"),
        (a[(a.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT = 18)] = "EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT"),
        (a[(a.INVALID_PLURAL_ARGUMENT_SELECTOR = 19)] = "INVALID_PLURAL_ARGUMENT_SELECTOR"),
        (a[(a.DUPLICATE_PLURAL_ARGUMENT_SELECTOR = 20)] = "DUPLICATE_PLURAL_ARGUMENT_SELECTOR"),
        (a[(a.DUPLICATE_SELECT_ARGUMENT_SELECTOR = 21)] = "DUPLICATE_SELECT_ARGUMENT_SELECTOR"),
        (a[(a.MISSING_OTHER_CLAUSE = 22)] = "MISSING_OTHER_CLAUSE"),
        (a[(a.INVALID_TAG = 23)] = "INVALID_TAG"),
        (a[(a.INVALID_TAG_NAME = 25)] = "INVALID_TAG_NAME"),
        (a[(a.UNMATCHED_CLOSING_TAG = 26)] = "UNMATCHED_CLOSING_TAG"),
        (a[(a.UNCLOSED_TAG = 27)] = "UNCLOSED_TAG");
})(vt || (vt = {}));
var Nt;
(function (a) {
    (a[(a.literal = 0)] = "literal"),
        (a[(a.argument = 1)] = "argument"),
        (a[(a.number = 2)] = "number"),
        (a[(a.date = 3)] = "date"),
        (a[(a.time = 4)] = "time"),
        (a[(a.select = 5)] = "select"),
        (a[(a.plural = 6)] = "plural"),
        (a[(a.pound = 7)] = "pound"),
        (a[(a.tag = 8)] = "tag");
})(Nt || (Nt = {}));
var hl;
(function (a) {
    (a[(a.number = 0)] = "number"), (a[(a.dateTime = 1)] = "dateTime");
})(hl || (hl = {}));
function B0(a) {
    return a.type === Nt.literal;
}
function K6(a) {
    return a.type === Nt.argument;
}
function Q3(a) {
    return a.type === Nt.number;
}
function Z3(a) {
    return a.type === Nt.date;
}
function j3(a) {
    return a.type === Nt.time;
}
function F3(a) {
    return a.type === Nt.select;
}
function Y3(a) {
    return a.type === Nt.plural;
}
function W6(a) {
    return a.type === Nt.pound;
}
function I3(a) {
    return a.type === Nt.tag;
}
function P3(a) {
    return !!(a && typeof a == "object" && a.type === hl.number);
}
function Ks(a) {
    return !!(a && typeof a == "object" && a.type === hl.dateTime);
}
var k3 = /[ \xA0\u1680\u2000-\u200A\u202F\u205F\u3000]/,
    J6 =
        /(?:[Eec]{1,6}|G{1,5}|[Qq]{1,5}|(?:[yYur]+|U{1,5})|[ML]{1,5}|d{1,2}|D{1,3}|F{1}|[abB]{1,5}|[hkHK]{1,2}|w{1,2}|W{1}|m{1,2}|s{1,2}|[zZOvVxX]{1,4})(?=([^']*'[^']*')*[^']*$)/g;
function $6(a) {
    var i = {};
    return (
        a.replace(J6, function (o) {
            var r = o.length;
            switch (o[0]) {
                case "G":
                    i.era = r === 4 ? "long" : r === 5 ? "narrow" : "short";
                    break;
                case "y":
                    i.year = r === 2 ? "2-digit" : "numeric";
                    break;
                case "Y":
                case "u":
                case "U":
                case "r":
                    throw new RangeError("`Y/u/U/r` (year) patterns are not supported, use `y` instead");
                case "q":
                case "Q":
                    throw new RangeError("`q/Q` (quarter) patterns are not supported");
                case "M":
                case "L":
                    i.month = ["numeric", "2-digit", "short", "long", "narrow"][r - 1];
                    break;
                case "w":
                case "W":
                    throw new RangeError("`w/W` (week) patterns are not supported");
                case "d":
                    i.day = ["numeric", "2-digit"][r - 1];
                    break;
                case "D":
                case "F":
                case "g":
                    throw new RangeError("`D/F/g` (day) patterns are not supported, use `d` instead");
                case "E":
                    i.weekday = r === 4 ? "long" : r === 5 ? "narrow" : "short";
                    break;
                case "e":
                    if (r < 4) throw new RangeError("`e..eee` (weekday) patterns are not supported");
                    i.weekday = ["short", "long", "narrow", "short"][r - 4];
                    break;
                case "c":
                    if (r < 4) throw new RangeError("`c..ccc` (weekday) patterns are not supported");
                    i.weekday = ["short", "long", "narrow", "short"][r - 4];
                    break;
                case "a":
                    i.hour12 = !0;
                    break;
                case "b":
                case "B":
                    throw new RangeError("`b/B` (period) patterns are not supported, use `a` instead");
                case "h":
                    (i.hourCycle = "h12"), (i.hour = ["numeric", "2-digit"][r - 1]);
                    break;
                case "H":
                    (i.hourCycle = "h23"), (i.hour = ["numeric", "2-digit"][r - 1]);
                    break;
                case "K":
                    (i.hourCycle = "h11"), (i.hour = ["numeric", "2-digit"][r - 1]);
                    break;
                case "k":
                    (i.hourCycle = "h24"), (i.hour = ["numeric", "2-digit"][r - 1]);
                    break;
                case "j":
                case "J":
                case "C":
                    throw new RangeError("`j/J/C` (hour) patterns are not supported, use `h/H/K/k` instead");
                case "m":
                    i.minute = ["numeric", "2-digit"][r - 1];
                    break;
                case "s":
                    i.second = ["numeric", "2-digit"][r - 1];
                    break;
                case "S":
                case "A":
                    throw new RangeError("`S/A` (second) patterns are not supported, use `s` instead");
                case "z":
                    i.timeZoneName = r < 4 ? "short" : "long";
                    break;
                case "Z":
                case "O":
                case "v":
                case "V":
                case "X":
                case "x":
                    throw new RangeError("`Z/O/v/V/X/x` (timeZone) patterns are not supported, use `z` instead");
            }
            return "";
        }),
        i
    );
}
var t7 = /[\t-\r \x85\u200E\u200F\u2028\u2029]/i;
function e7(a) {
    if (a.length === 0) throw new Error("Number skeleton cannot be empty");
    for (
        var i = a.split(t7).filter(function (E) {
                return E.length > 0;
            }),
            o = [],
            r = 0,
            c = i;
        r < c.length;
        r++
    ) {
        var f = c[r],
            h = f.split("/");
        if (h.length === 0) throw new Error("Invalid number skeleton");
        for (var m = h[0], g = h.slice(1), v = 0, p = g; v < p.length; v++) {
            var A = p[v];
            if (A.length === 0) throw new Error("Invalid number skeleton");
        }
        o.push({ stem: m, options: g });
    }
    return o;
}
function n7(a) {
    return a.replace(/^(.*?)-/, "");
}
var D0 = /^\.(?:(0+)(\*)?|(#+)|(0+)(#+))$/g,
    X3 = /^(@+)?(\+|#+)?[rs]?$/g,
    a7 = /(\*)(0+)|(#+)(0+)|(0+)/g,
    q3 = /^(0+)$/;
function _0(a) {
    var i = {};
    return (
        a[a.length - 1] === "r"
            ? (i.roundingPriority = "morePrecision")
            : a[a.length - 1] === "s" && (i.roundingPriority = "lessPrecision"),
        a.replace(X3, function (o, r, c) {
            return (
                typeof c != "string"
                    ? ((i.minimumSignificantDigits = r.length), (i.maximumSignificantDigits = r.length))
                    : c === "+"
                      ? (i.minimumSignificantDigits = r.length)
                      : r[0] === "#"
                        ? (i.maximumSignificantDigits = r.length)
                        : ((i.minimumSignificantDigits = r.length),
                          (i.maximumSignificantDigits = r.length + (typeof c == "string" ? c.length : 0))),
                ""
            );
        }),
        i
    );
}
function K3(a) {
    switch (a) {
        case "sign-auto":
            return { signDisplay: "auto" };
        case "sign-accounting":
        case "()":
            return { currencySign: "accounting" };
        case "sign-always":
        case "+!":
            return { signDisplay: "always" };
        case "sign-accounting-always":
        case "()!":
            return { signDisplay: "always", currencySign: "accounting" };
        case "sign-except-zero":
        case "+?":
            return { signDisplay: "exceptZero" };
        case "sign-accounting-except-zero":
        case "()?":
            return { signDisplay: "exceptZero", currencySign: "accounting" };
        case "sign-never":
        case "+_":
            return { signDisplay: "never" };
    }
}
function l7(a) {
    var i;
    if (
        (a[0] === "E" && a[1] === "E"
            ? ((i = { notation: "engineering" }), (a = a.slice(2)))
            : a[0] === "E" && ((i = { notation: "scientific" }), (a = a.slice(1))),
        i)
    ) {
        var o = a.slice(0, 2);
        if (
            (o === "+!"
                ? ((i.signDisplay = "always"), (a = a.slice(2)))
                : o === "+?" && ((i.signDisplay = "exceptZero"), (a = a.slice(2))),
            !q3.test(a))
        )
            throw new Error("Malformed concise eng/scientific notation");
        i.minimumIntegerDigits = a.length;
    }
    return i;
}
function N0(a) {
    var i = {},
        o = K3(a);
    return o || i;
}
function i7(a) {
    for (var i = {}, o = 0, r = a; o < r.length; o++) {
        var c = r[o];
        switch (c.stem) {
            case "percent":
            case "%":
                i.style = "percent";
                continue;
            case "%x100":
                (i.style = "percent"), (i.scale = 100);
                continue;
            case "currency":
                (i.style = "currency"), (i.currency = c.options[0]);
                continue;
            case "group-off":
            case ",_":
                i.useGrouping = !1;
                continue;
            case "precision-integer":
            case ".":
                i.maximumFractionDigits = 0;
                continue;
            case "measure-unit":
            case "unit":
                (i.style = "unit"), (i.unit = n7(c.options[0]));
                continue;
            case "compact-short":
            case "K":
                (i.notation = "compact"), (i.compactDisplay = "short");
                continue;
            case "compact-long":
            case "KK":
                (i.notation = "compact"), (i.compactDisplay = "long");
                continue;
            case "scientific":
                i = $(
                    $($({}, i), { notation: "scientific" }),
                    c.options.reduce(function (g, v) {
                        return $($({}, g), N0(v));
                    }, {})
                );
                continue;
            case "engineering":
                i = $(
                    $($({}, i), { notation: "engineering" }),
                    c.options.reduce(function (g, v) {
                        return $($({}, g), N0(v));
                    }, {})
                );
                continue;
            case "notation-simple":
                i.notation = "standard";
                continue;
            case "unit-width-narrow":
                (i.currencyDisplay = "narrowSymbol"), (i.unitDisplay = "narrow");
                continue;
            case "unit-width-short":
                (i.currencyDisplay = "code"), (i.unitDisplay = "short");
                continue;
            case "unit-width-full-name":
                (i.currencyDisplay = "name"), (i.unitDisplay = "long");
                continue;
            case "unit-width-iso-code":
                i.currencyDisplay = "symbol";
                continue;
            case "scale":
                i.scale = parseFloat(c.options[0]);
                continue;
            case "rounding-mode-floor":
                i.roundingMode = "floor";
                continue;
            case "rounding-mode-ceiling":
                i.roundingMode = "ceil";
                continue;
            case "rounding-mode-down":
                i.roundingMode = "trunc";
                continue;
            case "rounding-mode-up":
                i.roundingMode = "expand";
                continue;
            case "rounding-mode-half-even":
                i.roundingMode = "halfEven";
                continue;
            case "rounding-mode-half-down":
                i.roundingMode = "halfTrunc";
                continue;
            case "rounding-mode-half-up":
                i.roundingMode = "halfExpand";
                continue;
            case "integer-width":
                if (c.options.length > 1)
                    throw new RangeError("integer-width stems only accept a single optional option");
                c.options[0].replace(a7, function (g, v, p, A, E, x) {
                    if (v) i.minimumIntegerDigits = p.length;
                    else {
                        if (A && E) throw new Error("We currently do not support maximum integer digits");
                        if (x) throw new Error("We currently do not support exact integer digits");
                    }
                    return "";
                });
                continue;
        }
        if (q3.test(c.stem)) {
            i.minimumIntegerDigits = c.stem.length;
            continue;
        }
        if (D0.test(c.stem)) {
            if (c.options.length > 1)
                throw new RangeError("Fraction-precision stems only accept a single optional option");
            c.stem.replace(D0, function (g, v, p, A, E, x) {
                return (
                    p === "*"
                        ? (i.minimumFractionDigits = v.length)
                        : A && A[0] === "#"
                          ? (i.maximumFractionDigits = A.length)
                          : E && x
                            ? ((i.minimumFractionDigits = E.length), (i.maximumFractionDigits = E.length + x.length))
                            : ((i.minimumFractionDigits = v.length), (i.maximumFractionDigits = v.length)),
                    ""
                );
            });
            var f = c.options[0];
            f === "w" ? (i = $($({}, i), { trailingZeroDisplay: "stripIfInteger" })) : f && (i = $($({}, i), _0(f)));
            continue;
        }
        if (X3.test(c.stem)) {
            i = $($({}, i), _0(c.stem));
            continue;
        }
        var h = K3(c.stem);
        h && (i = $($({}, i), h));
        var m = l7(c.stem);
        m && (i = $($({}, i), m));
    }
    return i;
}
var Pr = {
    "001": ["H", "h"],
    419: ["h", "H", "hB", "hb"],
    AC: ["H", "h", "hb", "hB"],
    AD: ["H", "hB"],
    AE: ["h", "hB", "hb", "H"],
    AF: ["H", "hb", "hB", "h"],
    AG: ["h", "hb", "H", "hB"],
    AI: ["H", "h", "hb", "hB"],
    AL: ["h", "H", "hB"],
    AM: ["H", "hB"],
    AO: ["H", "hB"],
    AR: ["h", "H", "hB", "hb"],
    AS: ["h", "H"],
    AT: ["H", "hB"],
    AU: ["h", "hb", "H", "hB"],
    AW: ["H", "hB"],
    AX: ["H"],
    AZ: ["H", "hB", "h"],
    BA: ["H", "hB", "h"],
    BB: ["h", "hb", "H", "hB"],
    BD: ["h", "hB", "H"],
    BE: ["H", "hB"],
    BF: ["H", "hB"],
    BG: ["H", "hB", "h"],
    BH: ["h", "hB", "hb", "H"],
    BI: ["H", "h"],
    BJ: ["H", "hB"],
    BL: ["H", "hB"],
    BM: ["h", "hb", "H", "hB"],
    BN: ["hb", "hB", "h", "H"],
    BO: ["h", "H", "hB", "hb"],
    BQ: ["H"],
    BR: ["H", "hB"],
    BS: ["h", "hb", "H", "hB"],
    BT: ["h", "H"],
    BW: ["H", "h", "hb", "hB"],
    BY: ["H", "h"],
    BZ: ["H", "h", "hb", "hB"],
    CA: ["h", "hb", "H", "hB"],
    CC: ["H", "h", "hb", "hB"],
    CD: ["hB", "H"],
    CF: ["H", "h", "hB"],
    CG: ["H", "hB"],
    CH: ["H", "hB", "h"],
    CI: ["H", "hB"],
    CK: ["H", "h", "hb", "hB"],
    CL: ["h", "H", "hB", "hb"],
    CM: ["H", "h", "hB"],
    CN: ["H", "hB", "hb", "h"],
    CO: ["h", "H", "hB", "hb"],
    CP: ["H"],
    CR: ["h", "H", "hB", "hb"],
    CU: ["h", "H", "hB", "hb"],
    CV: ["H", "hB"],
    CW: ["H", "hB"],
    CX: ["H", "h", "hb", "hB"],
    CY: ["h", "H", "hb", "hB"],
    CZ: ["H"],
    DE: ["H", "hB"],
    DG: ["H", "h", "hb", "hB"],
    DJ: ["h", "H"],
    DK: ["H"],
    DM: ["h", "hb", "H", "hB"],
    DO: ["h", "H", "hB", "hb"],
    DZ: ["h", "hB", "hb", "H"],
    EA: ["H", "h", "hB", "hb"],
    EC: ["h", "H", "hB", "hb"],
    EE: ["H", "hB"],
    EG: ["h", "hB", "hb", "H"],
    EH: ["h", "hB", "hb", "H"],
    ER: ["h", "H"],
    ES: ["H", "hB", "h", "hb"],
    ET: ["hB", "hb", "h", "H"],
    FI: ["H"],
    FJ: ["h", "hb", "H", "hB"],
    FK: ["H", "h", "hb", "hB"],
    FM: ["h", "hb", "H", "hB"],
    FO: ["H", "h"],
    FR: ["H", "hB"],
    GA: ["H", "hB"],
    GB: ["H", "h", "hb", "hB"],
    GD: ["h", "hb", "H", "hB"],
    GE: ["H", "hB", "h"],
    GF: ["H", "hB"],
    GG: ["H", "h", "hb", "hB"],
    GH: ["h", "H"],
    GI: ["H", "h", "hb", "hB"],
    GL: ["H", "h"],
    GM: ["h", "hb", "H", "hB"],
    GN: ["H", "hB"],
    GP: ["H", "hB"],
    GQ: ["H", "hB", "h", "hb"],
    GR: ["h", "H", "hb", "hB"],
    GS: ["H", "h", "hb", "hB"],
    GT: ["h", "H", "hB", "hb"],
    GU: ["h", "hb", "H", "hB"],
    GW: ["H", "hB"],
    GY: ["h", "hb", "H", "hB"],
    HK: ["h", "hB", "hb", "H"],
    HN: ["h", "H", "hB", "hb"],
    HR: ["H", "hB"],
    HU: ["H", "h"],
    IC: ["H", "h", "hB", "hb"],
    ID: ["H"],
    IE: ["H", "h", "hb", "hB"],
    IL: ["H", "hB"],
    IM: ["H", "h", "hb", "hB"],
    IN: ["h", "H"],
    IO: ["H", "h", "hb", "hB"],
    IQ: ["h", "hB", "hb", "H"],
    IR: ["hB", "H"],
    IS: ["H"],
    IT: ["H", "hB"],
    JE: ["H", "h", "hb", "hB"],
    JM: ["h", "hb", "H", "hB"],
    JO: ["h", "hB", "hb", "H"],
    JP: ["H", "K", "h"],
    KE: ["hB", "hb", "H", "h"],
    KG: ["H", "h", "hB", "hb"],
    KH: ["hB", "h", "H", "hb"],
    KI: ["h", "hb", "H", "hB"],
    KM: ["H", "h", "hB", "hb"],
    KN: ["h", "hb", "H", "hB"],
    KP: ["h", "H", "hB", "hb"],
    KR: ["h", "H", "hB", "hb"],
    KW: ["h", "hB", "hb", "H"],
    KY: ["h", "hb", "H", "hB"],
    KZ: ["H", "hB"],
    LA: ["H", "hb", "hB", "h"],
    LB: ["h", "hB", "hb", "H"],
    LC: ["h", "hb", "H", "hB"],
    LI: ["H", "hB", "h"],
    LK: ["H", "h", "hB", "hb"],
    LR: ["h", "hb", "H", "hB"],
    LS: ["h", "H"],
    LT: ["H", "h", "hb", "hB"],
    LU: ["H", "h", "hB"],
    LV: ["H", "hB", "hb", "h"],
    LY: ["h", "hB", "hb", "H"],
    MA: ["H", "h", "hB", "hb"],
    MC: ["H", "hB"],
    MD: ["H", "hB"],
    ME: ["H", "hB", "h"],
    MF: ["H", "hB"],
    MG: ["H", "h"],
    MH: ["h", "hb", "H", "hB"],
    MK: ["H", "h", "hb", "hB"],
    ML: ["H"],
    MM: ["hB", "hb", "H", "h"],
    MN: ["H", "h", "hb", "hB"],
    MO: ["h", "hB", "hb", "H"],
    MP: ["h", "hb", "H", "hB"],
    MQ: ["H", "hB"],
    MR: ["h", "hB", "hb", "H"],
    MS: ["H", "h", "hb", "hB"],
    MT: ["H", "h"],
    MU: ["H", "h"],
    MV: ["H", "h"],
    MW: ["h", "hb", "H", "hB"],
    MX: ["h", "H", "hB", "hb"],
    MY: ["hb", "hB", "h", "H"],
    MZ: ["H", "hB"],
    NA: ["h", "H", "hB", "hb"],
    NC: ["H", "hB"],
    NE: ["H"],
    NF: ["H", "h", "hb", "hB"],
    NG: ["H", "h", "hb", "hB"],
    NI: ["h", "H", "hB", "hb"],
    NL: ["H", "hB"],
    NO: ["H", "h"],
    NP: ["H", "h", "hB"],
    NR: ["H", "h", "hb", "hB"],
    NU: ["H", "h", "hb", "hB"],
    NZ: ["h", "hb", "H", "hB"],
    OM: ["h", "hB", "hb", "H"],
    PA: ["h", "H", "hB", "hb"],
    PE: ["h", "H", "hB", "hb"],
    PF: ["H", "h", "hB"],
    PG: ["h", "H"],
    PH: ["h", "hB", "hb", "H"],
    PK: ["h", "hB", "H"],
    PL: ["H", "h"],
    PM: ["H", "hB"],
    PN: ["H", "h", "hb", "hB"],
    PR: ["h", "H", "hB", "hb"],
    PS: ["h", "hB", "hb", "H"],
    PT: ["H", "hB"],
    PW: ["h", "H"],
    PY: ["h", "H", "hB", "hb"],
    QA: ["h", "hB", "hb", "H"],
    RE: ["H", "hB"],
    RO: ["H", "hB"],
    RS: ["H", "hB", "h"],
    RU: ["H"],
    RW: ["H", "h"],
    SA: ["h", "hB", "hb", "H"],
    SB: ["h", "hb", "H", "hB"],
    SC: ["H", "h", "hB"],
    SD: ["h", "hB", "hb", "H"],
    SE: ["H"],
    SG: ["h", "hb", "H", "hB"],
    SH: ["H", "h", "hb", "hB"],
    SI: ["H", "hB"],
    SJ: ["H"],
    SK: ["H"],
    SL: ["h", "hb", "H", "hB"],
    SM: ["H", "h", "hB"],
    SN: ["H", "h", "hB"],
    SO: ["h", "H"],
    SR: ["H", "hB"],
    SS: ["h", "hb", "H", "hB"],
    ST: ["H", "hB"],
    SV: ["h", "H", "hB", "hb"],
    SX: ["H", "h", "hb", "hB"],
    SY: ["h", "hB", "hb", "H"],
    SZ: ["h", "hb", "H", "hB"],
    TA: ["H", "h", "hb", "hB"],
    TC: ["h", "hb", "H", "hB"],
    TD: ["h", "H", "hB"],
    TF: ["H", "h", "hB"],
    TG: ["H", "hB"],
    TH: ["H", "h"],
    TJ: ["H", "h"],
    TL: ["H", "hB", "hb", "h"],
    TM: ["H", "h"],
    TN: ["h", "hB", "hb", "H"],
    TO: ["h", "H"],
    TR: ["H", "hB"],
    TT: ["h", "hb", "H", "hB"],
    TW: ["hB", "hb", "h", "H"],
    TZ: ["hB", "hb", "H", "h"],
    UA: ["H", "hB", "h"],
    UG: ["hB", "hb", "H", "h"],
    UM: ["h", "hb", "H", "hB"],
    US: ["h", "hb", "H", "hB"],
    UY: ["h", "H", "hB", "hb"],
    UZ: ["H", "hB", "h"],
    VA: ["H", "h", "hB"],
    VC: ["h", "hb", "H", "hB"],
    VE: ["h", "H", "hB", "hb"],
    VG: ["h", "hb", "H", "hB"],
    VI: ["h", "hb", "H", "hB"],
    VN: ["H", "h"],
    VU: ["h", "H"],
    WF: ["H", "hB"],
    WS: ["h", "H"],
    XK: ["H", "hB", "h"],
    YE: ["h", "hB", "hb", "H"],
    YT: ["H", "hB"],
    ZA: ["H", "h", "hb", "hB"],
    ZM: ["h", "hb", "H", "hB"],
    ZW: ["H", "h"],
    "af-ZA": ["H", "h", "hB", "hb"],
    "ar-001": ["h", "hB", "hb", "H"],
    "ca-ES": ["H", "h", "hB"],
    "en-001": ["h", "hb", "H", "hB"],
    "en-HK": ["h", "hb", "H", "hB"],
    "en-IL": ["H", "h", "hb", "hB"],
    "en-MY": ["h", "hb", "H", "hB"],
    "es-BR": ["H", "h", "hB", "hb"],
    "es-ES": ["H", "h", "hB", "hb"],
    "es-GQ": ["H", "h", "hB", "hb"],
    "fr-CA": ["H", "h", "hB"],
    "gl-ES": ["H", "h", "hB"],
    "gu-IN": ["hB", "hb", "h", "H"],
    "hi-IN": ["hB", "h", "H"],
    "it-CH": ["H", "h", "hB"],
    "it-IT": ["H", "h", "hB"],
    "kn-IN": ["hB", "h", "H"],
    "ku-SY": ["H", "hB"],
    "ml-IN": ["hB", "h", "H"],
    "mr-IN": ["hB", "hb", "h", "H"],
    "pa-IN": ["hB", "hb", "h", "H"],
    "ta-IN": ["hB", "h", "hb", "H"],
    "te-IN": ["hB", "h", "H"],
    "zu-ZA": ["H", "hB", "hb", "h"],
};
function r7(a, i) {
    for (var o = "", r = 0; r < a.length; r++) {
        var c = a.charAt(r);
        if (c === "j") {
            for (var f = 0; r + 1 < a.length && a.charAt(r + 1) === c; ) f++, r++;
            var h = 1 + (f & 1),
                m = f < 2 ? 1 : 3 + (f >> 1),
                g = "a",
                v = u7(i);
            for ((v == "H" || v == "k") && (m = 0); m-- > 0; ) o += g;
            for (; h-- > 0; ) o = v + o;
        } else c === "J" ? (o += "H") : (o += c);
    }
    return o;
}
function u7(a) {
    var i = a.hourCycle;
    if ((i === void 0 && a.hourCycles && a.hourCycles.length && (i = a.hourCycles[0]), i))
        switch (i) {
            case "h24":
                return "k";
            case "h23":
                return "H";
            case "h12":
                return "h";
            case "h11":
                return "K";
            default:
                throw new Error("Invalid hourCycle");
        }
    var o = a.language,
        r;
    o !== "root" && (r = a.maximize().region);
    var c = Pr[r || ""] || Pr[o || ""] || Pr["".concat(o, "-001")] || Pr["001"];
    return c[0];
}
var o7 = new RegExp("^".concat(k3.source, "*")),
    s7 = new RegExp("".concat(k3.source, "*$"));
function yt(a, i) {
    return { start: a, end: i };
}
var c7 = !!Object.fromEntries,
    f7 = !!String.prototype.trimStart,
    h7 = !!String.prototype.trimEnd,
    L0 = c7
        ? Object.fromEntries
        : function (i) {
              for (var o = {}, r = 0, c = i; r < c.length; r++) {
                  var f = c[r],
                      h = f[0],
                      m = f[1];
                  o[h] = m;
              }
              return o;
          },
    d7 = f7
        ? function (i) {
              return i.trimStart();
          }
        : function (i) {
              return i.replace(o7, "");
          },
    m7 = h7
        ? function (i) {
              return i.trimEnd();
          }
        : function (i) {
              return i.replace(s7, "");
          },
    U0 = new RegExp("([^\\p{White_Space}\\p{Pattern_Syntax}]*)", "yu");
function v7(a, i) {
    var o;
    U0.lastIndex = i;
    var r = U0.exec(a);
    return (o = r[1]) !== null && o !== void 0 ? o : "";
}
var g7 = (function () {
    function a(i, o) {
        o === void 0 && (o = {}),
            (this.message = i),
            (this.position = { offset: 0, line: 1, column: 1 }),
            (this.ignoreTag = !!o.ignoreTag),
            (this.locale = o.locale),
            (this.requiresOtherClause = !!o.requiresOtherClause),
            (this.shouldParseSkeletons = !!o.shouldParseSkeletons);
    }
    return (
        (a.prototype.parse = function () {
            if (this.offset() !== 0) throw Error("parser can only be used once");
            return this.parseMessage(0, "", !1);
        }),
        (a.prototype.parseMessage = function (i, o, r) {
            for (var c = []; !this.isEOF(); ) {
                var f = this.char();
                if (f === 123) {
                    var h = this.parseArgument(i, r);
                    if (h.err) return h;
                    c.push(h.val);
                } else {
                    if (f === 125 && i > 0) break;
                    if (f === 35 && (o === "plural" || o === "selectordinal")) {
                        var m = this.clonePosition();
                        this.bump(), c.push({ type: Nt.pound, location: yt(m, this.clonePosition()) });
                    } else if (f === 60 && !this.ignoreTag && this.peek() === 47) {
                        if (r) break;
                        return this.error(vt.UNMATCHED_CLOSING_TAG, yt(this.clonePosition(), this.clonePosition()));
                    } else if (f === 60 && !this.ignoreTag && Ws(this.peek() || 0)) {
                        var h = this.parseTag(i, o);
                        if (h.err) return h;
                        c.push(h.val);
                    } else {
                        var h = this.parseLiteral(i, o);
                        if (h.err) return h;
                        c.push(h.val);
                    }
                }
            }
            return { val: c, err: null };
        }),
        (a.prototype.parseTag = function (i, o) {
            var r = this.clonePosition();
            this.bump();
            var c = this.parseTagName();
            if ((this.bumpSpace(), this.bumpIf("/>")))
                return {
                    val: { type: Nt.literal, value: "<".concat(c, "/>"), location: yt(r, this.clonePosition()) },
                    err: null,
                };
            if (this.bumpIf(">")) {
                var f = this.parseMessage(i + 1, o, !0);
                if (f.err) return f;
                var h = f.val,
                    m = this.clonePosition();
                if (this.bumpIf("</")) {
                    if (this.isEOF() || !Ws(this.char()))
                        return this.error(vt.INVALID_TAG, yt(m, this.clonePosition()));
                    var g = this.clonePosition(),
                        v = this.parseTagName();
                    return c !== v
                        ? this.error(vt.UNMATCHED_CLOSING_TAG, yt(g, this.clonePosition()))
                        : (this.bumpSpace(),
                          this.bumpIf(">")
                              ? {
                                    val: { type: Nt.tag, value: c, children: h, location: yt(r, this.clonePosition()) },
                                    err: null,
                                }
                              : this.error(vt.INVALID_TAG, yt(m, this.clonePosition())));
                } else return this.error(vt.UNCLOSED_TAG, yt(r, this.clonePosition()));
            } else return this.error(vt.INVALID_TAG, yt(r, this.clonePosition()));
        }),
        (a.prototype.parseTagName = function () {
            var i = this.offset();
            for (this.bump(); !this.isEOF() && y7(this.char()); ) this.bump();
            return this.message.slice(i, this.offset());
        }),
        (a.prototype.parseLiteral = function (i, o) {
            for (var r = this.clonePosition(), c = ""; ; ) {
                var f = this.tryParseQuote(o);
                if (f) {
                    c += f;
                    continue;
                }
                var h = this.tryParseUnquoted(i, o);
                if (h) {
                    c += h;
                    continue;
                }
                var m = this.tryParseLeftAngleBracket();
                if (m) {
                    c += m;
                    continue;
                }
                break;
            }
            var g = yt(r, this.clonePosition());
            return { val: { type: Nt.literal, value: c, location: g }, err: null };
        }),
        (a.prototype.tryParseLeftAngleBracket = function () {
            return !this.isEOF() && this.char() === 60 && (this.ignoreTag || !p7(this.peek() || 0))
                ? (this.bump(), "<")
                : null;
        }),
        (a.prototype.tryParseQuote = function (i) {
            if (this.isEOF() || this.char() !== 39) return null;
            switch (this.peek()) {
                case 39:
                    return this.bump(), this.bump(), "'";
                case 123:
                case 60:
                case 62:
                case 125:
                    break;
                case 35:
                    if (i === "plural" || i === "selectordinal") break;
                    return null;
                default:
                    return null;
            }
            this.bump();
            var o = [this.char()];
            for (this.bump(); !this.isEOF(); ) {
                var r = this.char();
                if (r === 39)
                    if (this.peek() === 39) o.push(39), this.bump();
                    else {
                        this.bump();
                        break;
                    }
                else o.push(r);
                this.bump();
            }
            return String.fromCodePoint.apply(String, o);
        }),
        (a.prototype.tryParseUnquoted = function (i, o) {
            if (this.isEOF()) return null;
            var r = this.char();
            return r === 60 ||
                r === 123 ||
                (r === 35 && (o === "plural" || o === "selectordinal")) ||
                (r === 125 && i > 0)
                ? null
                : (this.bump(), String.fromCodePoint(r));
        }),
        (a.prototype.parseArgument = function (i, o) {
            var r = this.clonePosition();
            if ((this.bump(), this.bumpSpace(), this.isEOF()))
                return this.error(vt.EXPECT_ARGUMENT_CLOSING_BRACE, yt(r, this.clonePosition()));
            if (this.char() === 125) return this.bump(), this.error(vt.EMPTY_ARGUMENT, yt(r, this.clonePosition()));
            var c = this.parseIdentifierIfPossible().value;
            if (!c) return this.error(vt.MALFORMED_ARGUMENT, yt(r, this.clonePosition()));
            if ((this.bumpSpace(), this.isEOF()))
                return this.error(vt.EXPECT_ARGUMENT_CLOSING_BRACE, yt(r, this.clonePosition()));
            switch (this.char()) {
                case 125:
                    return (
                        this.bump(),
                        { val: { type: Nt.argument, value: c, location: yt(r, this.clonePosition()) }, err: null }
                    );
                case 44:
                    return (
                        this.bump(),
                        this.bumpSpace(),
                        this.isEOF()
                            ? this.error(vt.EXPECT_ARGUMENT_CLOSING_BRACE, yt(r, this.clonePosition()))
                            : this.parseArgumentOptions(i, o, c, r)
                    );
                default:
                    return this.error(vt.MALFORMED_ARGUMENT, yt(r, this.clonePosition()));
            }
        }),
        (a.prototype.parseIdentifierIfPossible = function () {
            var i = this.clonePosition(),
                o = this.offset(),
                r = v7(this.message, o),
                c = o + r.length;
            this.bumpTo(c);
            var f = this.clonePosition(),
                h = yt(i, f);
            return { value: r, location: h };
        }),
        (a.prototype.parseArgumentOptions = function (i, o, r, c) {
            var f,
                h = this.clonePosition(),
                m = this.parseIdentifierIfPossible().value,
                g = this.clonePosition();
            switch (m) {
                case "":
                    return this.error(vt.EXPECT_ARGUMENT_TYPE, yt(h, g));
                case "number":
                case "date":
                case "time": {
                    this.bumpSpace();
                    var v = null;
                    if (this.bumpIf(",")) {
                        this.bumpSpace();
                        var p = this.clonePosition(),
                            A = this.parseSimpleArgStyleIfPossible();
                        if (A.err) return A;
                        var E = m7(A.val);
                        if (E.length === 0)
                            return this.error(vt.EXPECT_ARGUMENT_STYLE, yt(this.clonePosition(), this.clonePosition()));
                        var x = yt(p, this.clonePosition());
                        v = { style: E, styleLocation: x };
                    }
                    var H = this.tryParseArgumentClose(c);
                    if (H.err) return H;
                    var D = yt(c, this.clonePosition());
                    if (v && v.style.startsWith("::")) {
                        var _ = d7(v.style.slice(2));
                        if (m === "number") {
                            var A = this.parseNumberSkeletonFromString(_, v.styleLocation);
                            return A.err
                                ? A
                                : { val: { type: Nt.number, value: r, location: D, style: A.val }, err: null };
                        } else {
                            if (_.length === 0) return this.error(vt.EXPECT_DATE_TIME_SKELETON, D);
                            var V = _;
                            this.locale && (V = r7(_, this.locale));
                            var E = {
                                    type: hl.dateTime,
                                    pattern: V,
                                    location: v.styleLocation,
                                    parsedOptions: this.shouldParseSkeletons ? $6(V) : {},
                                },
                                U = m === "date" ? Nt.date : Nt.time;
                            return { val: { type: U, value: r, location: D, style: E }, err: null };
                        }
                    }
                    return {
                        val: {
                            type: m === "number" ? Nt.number : m === "date" ? Nt.date : Nt.time,
                            value: r,
                            location: D,
                            style: (f = v?.style) !== null && f !== void 0 ? f : null,
                        },
                        err: null,
                    };
                }
                case "plural":
                case "selectordinal":
                case "select": {
                    var Q = this.clonePosition();
                    if ((this.bumpSpace(), !this.bumpIf(",")))
                        return this.error(vt.EXPECT_SELECT_ARGUMENT_OPTIONS, yt(Q, $({}, Q)));
                    this.bumpSpace();
                    var Y = this.parseIdentifierIfPossible(),
                        R = 0;
                    if (m !== "select" && Y.value === "offset") {
                        if (!this.bumpIf(":"))
                            return this.error(
                                vt.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE,
                                yt(this.clonePosition(), this.clonePosition())
                            );
                        this.bumpSpace();
                        var A = this.tryParseDecimalInteger(
                            vt.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE,
                            vt.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE
                        );
                        if (A.err) return A;
                        this.bumpSpace(), (Y = this.parseIdentifierIfPossible()), (R = A.val);
                    }
                    var k = this.tryParsePluralOrSelectOptions(i, m, o, Y);
                    if (k.err) return k;
                    var H = this.tryParseArgumentClose(c);
                    if (H.err) return H;
                    var X = yt(c, this.clonePosition());
                    return m === "select"
                        ? { val: { type: Nt.select, value: r, options: L0(k.val), location: X }, err: null }
                        : {
                              val: {
                                  type: Nt.plural,
                                  value: r,
                                  options: L0(k.val),
                                  offset: R,
                                  pluralType: m === "plural" ? "cardinal" : "ordinal",
                                  location: X,
                              },
                              err: null,
                          };
                }
                default:
                    return this.error(vt.INVALID_ARGUMENT_TYPE, yt(h, g));
            }
        }),
        (a.prototype.tryParseArgumentClose = function (i) {
            return this.isEOF() || this.char() !== 125
                ? this.error(vt.EXPECT_ARGUMENT_CLOSING_BRACE, yt(i, this.clonePosition()))
                : (this.bump(), { val: !0, err: null });
        }),
        (a.prototype.parseSimpleArgStyleIfPossible = function () {
            for (var i = 0, o = this.clonePosition(); !this.isEOF(); ) {
                var r = this.char();
                switch (r) {
                    case 39: {
                        this.bump();
                        var c = this.clonePosition();
                        if (!this.bumpUntil("'"))
                            return this.error(vt.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE, yt(c, this.clonePosition()));
                        this.bump();
                        break;
                    }
                    case 123: {
                        (i += 1), this.bump();
                        break;
                    }
                    case 125: {
                        if (i > 0) i -= 1;
                        else return { val: this.message.slice(o.offset, this.offset()), err: null };
                        break;
                    }
                    default:
                        this.bump();
                        break;
                }
            }
            return { val: this.message.slice(o.offset, this.offset()), err: null };
        }),
        (a.prototype.parseNumberSkeletonFromString = function (i, o) {
            var r = [];
            try {
                r = e7(i);
            } catch {
                return this.error(vt.INVALID_NUMBER_SKELETON, o);
            }
            return {
                val: { type: hl.number, tokens: r, location: o, parsedOptions: this.shouldParseSkeletons ? i7(r) : {} },
                err: null,
            };
        }),
        (a.prototype.tryParsePluralOrSelectOptions = function (i, o, r, c) {
            for (var f, h = !1, m = [], g = new Set(), v = c.value, p = c.location; ; ) {
                if (v.length === 0) {
                    var A = this.clonePosition();
                    if (o !== "select" && this.bumpIf("=")) {
                        var E = this.tryParseDecimalInteger(
                            vt.EXPECT_PLURAL_ARGUMENT_SELECTOR,
                            vt.INVALID_PLURAL_ARGUMENT_SELECTOR
                        );
                        if (E.err) return E;
                        (p = yt(A, this.clonePosition())), (v = this.message.slice(A.offset, this.offset()));
                    } else break;
                }
                if (g.has(v))
                    return this.error(
                        o === "select" ? vt.DUPLICATE_SELECT_ARGUMENT_SELECTOR : vt.DUPLICATE_PLURAL_ARGUMENT_SELECTOR,
                        p
                    );
                v === "other" && (h = !0), this.bumpSpace();
                var x = this.clonePosition();
                if (!this.bumpIf("{"))
                    return this.error(
                        o === "select"
                            ? vt.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT
                            : vt.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT,
                        yt(this.clonePosition(), this.clonePosition())
                    );
                var H = this.parseMessage(i + 1, o, r);
                if (H.err) return H;
                var D = this.tryParseArgumentClose(x);
                if (D.err) return D;
                m.push([v, { value: H.val, location: yt(x, this.clonePosition()) }]),
                    g.add(v),
                    this.bumpSpace(),
                    (f = this.parseIdentifierIfPossible()),
                    (v = f.value),
                    (p = f.location);
            }
            return m.length === 0
                ? this.error(
                      o === "select" ? vt.EXPECT_SELECT_ARGUMENT_SELECTOR : vt.EXPECT_PLURAL_ARGUMENT_SELECTOR,
                      yt(this.clonePosition(), this.clonePosition())
                  )
                : this.requiresOtherClause && !h
                  ? this.error(vt.MISSING_OTHER_CLAUSE, yt(this.clonePosition(), this.clonePosition()))
                  : { val: m, err: null };
        }),
        (a.prototype.tryParseDecimalInteger = function (i, o) {
            var r = 1,
                c = this.clonePosition();
            this.bumpIf("+") || (this.bumpIf("-") && (r = -1));
            for (var f = !1, h = 0; !this.isEOF(); ) {
                var m = this.char();
                if (m >= 48 && m <= 57) (f = !0), (h = h * 10 + (m - 48)), this.bump();
                else break;
            }
            var g = yt(c, this.clonePosition());
            return f
                ? ((h *= r), Number.isSafeInteger(h) ? { val: h, err: null } : this.error(o, g))
                : this.error(i, g);
        }),
        (a.prototype.offset = function () {
            return this.position.offset;
        }),
        (a.prototype.isEOF = function () {
            return this.offset() === this.message.length;
        }),
        (a.prototype.clonePosition = function () {
            return { offset: this.position.offset, line: this.position.line, column: this.position.column };
        }),
        (a.prototype.char = function () {
            var i = this.position.offset;
            if (i >= this.message.length) throw Error("out of bound");
            var o = this.message.codePointAt(i);
            if (o === void 0) throw Error("Offset ".concat(i, " is at invalid UTF-16 code unit boundary"));
            return o;
        }),
        (a.prototype.error = function (i, o) {
            return { val: null, err: { kind: i, message: this.message, location: o } };
        }),
        (a.prototype.bump = function () {
            if (!this.isEOF()) {
                var i = this.char();
                i === 10
                    ? ((this.position.line += 1), (this.position.column = 1), (this.position.offset += 1))
                    : ((this.position.column += 1), (this.position.offset += i < 65536 ? 1 : 2));
            }
        }),
        (a.prototype.bumpIf = function (i) {
            if (this.message.startsWith(i, this.offset())) {
                for (var o = 0; o < i.length; o++) this.bump();
                return !0;
            }
            return !1;
        }),
        (a.prototype.bumpUntil = function (i) {
            var o = this.offset(),
                r = this.message.indexOf(i, o);
            return r >= 0 ? (this.bumpTo(r), !0) : (this.bumpTo(this.message.length), !1);
        }),
        (a.prototype.bumpTo = function (i) {
            if (this.offset() > i)
                throw Error(
                    "targetOffset "
                        .concat(i, " must be greater than or equal to the current offset ")
                        .concat(this.offset())
                );
            for (i = Math.min(i, this.message.length); ; ) {
                var o = this.offset();
                if (o === i) break;
                if (o > i) throw Error("targetOffset ".concat(i, " is at invalid UTF-16 code unit boundary"));
                if ((this.bump(), this.isEOF())) break;
            }
        }),
        (a.prototype.bumpSpace = function () {
            for (; !this.isEOF() && A7(this.char()); ) this.bump();
        }),
        (a.prototype.peek = function () {
            if (this.isEOF()) return null;
            var i = this.char(),
                o = this.offset(),
                r = this.message.charCodeAt(o + (i >= 65536 ? 2 : 1));
            return r ?? null;
        }),
        a
    );
})();
function Ws(a) {
    return (a >= 97 && a <= 122) || (a >= 65 && a <= 90);
}
function p7(a) {
    return Ws(a) || a === 47;
}
function y7(a) {
    return (
        a === 45 ||
        a === 46 ||
        (a >= 48 && a <= 57) ||
        a === 95 ||
        (a >= 97 && a <= 122) ||
        (a >= 65 && a <= 90) ||
        a == 183 ||
        (a >= 192 && a <= 214) ||
        (a >= 216 && a <= 246) ||
        (a >= 248 && a <= 893) ||
        (a >= 895 && a <= 8191) ||
        (a >= 8204 && a <= 8205) ||
        (a >= 8255 && a <= 8256) ||
        (a >= 8304 && a <= 8591) ||
        (a >= 11264 && a <= 12271) ||
        (a >= 12289 && a <= 55295) ||
        (a >= 63744 && a <= 64975) ||
        (a >= 65008 && a <= 65533) ||
        (a >= 65536 && a <= 983039)
    );
}
function A7(a) {
    return (a >= 9 && a <= 13) || a === 32 || a === 133 || (a >= 8206 && a <= 8207) || a === 8232 || a === 8233;
}
function Js(a) {
    a.forEach(function (i) {
        if ((delete i.location, F3(i) || Y3(i)))
            for (var o in i.options) delete i.options[o].location, Js(i.options[o].value);
        else
            (Q3(i) && P3(i.style)) || ((Z3(i) || j3(i)) && Ks(i.style))
                ? delete i.style.location
                : I3(i) && Js(i.children);
    });
}
function b7(a, i) {
    i === void 0 && (i = {}), (i = $({ shouldParseSkeletons: !0, requiresOtherClause: !0 }, i));
    var o = new g7(a, i).parse();
    if (o.err) {
        var r = SyntaxError(vt[o.err.kind]);
        throw ((r.location = o.err.location), (r.originalMessage = o.err.message), r);
    }
    return i?.captureLocation || Js(o.val), o.val;
}
var Je;
(function (a) {
    (a.MISSING_VALUE = "MISSING_VALUE"), (a.INVALID_VALUE = "INVALID_VALUE"), (a.MISSING_INTL_API = "MISSING_INTL_API");
})(Je || (Je = {}));
var qn = (function (a) {
        _e(i, a);
        function i(o, r, c) {
            var f = a.call(this, o) || this;
            return (f.code = r), (f.originalMessage = c), f;
        }
        return (
            (i.prototype.toString = function () {
                return "[formatjs Error: ".concat(this.code, "] ").concat(this.message);
            }),
            i
        );
    })(Error),
    V0 = (function (a) {
        _e(i, a);
        function i(o, r, c, f) {
            return (
                a.call(
                    this,
                    'Invalid values for "'
                        .concat(o, '": "')
                        .concat(r, '". Options are "')
                        .concat(Object.keys(c).join('", "'), '"'),
                    Je.INVALID_VALUE,
                    f
                ) || this
            );
        }
        return i;
    })(qn),
    E7 = (function (a) {
        _e(i, a);
        function i(o, r, c) {
            return a.call(this, 'Value for "'.concat(o, '" must be of type ').concat(r), Je.INVALID_VALUE, c) || this;
        }
        return i;
    })(qn),
    S7 = (function (a) {
        _e(i, a);
        function i(o, r) {
            return (
                a.call(
                    this,
                    'The intl string context variable "'.concat(o, '" was not provided to the string "').concat(r, '"'),
                    Je.MISSING_VALUE,
                    r
                ) || this
            );
        }
        return i;
    })(qn),
    re;
(function (a) {
    (a[(a.literal = 0)] = "literal"), (a[(a.object = 1)] = "object");
})(re || (re = {}));
function C7(a) {
    return a.length < 2
        ? a
        : a.reduce(function (i, o) {
              var r = i[i.length - 1];
              return !r || r.type !== re.literal || o.type !== re.literal ? i.push(o) : (r.value += o.value), i;
          }, []);
}
function W3(a) {
    return typeof a == "function";
}
function Wr(a, i, o, r, c, f, h) {
    if (a.length === 1 && B0(a[0])) return [{ type: re.literal, value: a[0].value }];
    for (var m = [], g = 0, v = a; g < v.length; g++) {
        var p = v[g];
        if (B0(p)) {
            m.push({ type: re.literal, value: p.value });
            continue;
        }
        if (W6(p)) {
            typeof f == "number" && m.push({ type: re.literal, value: o.getNumberFormat(i).format(f) });
            continue;
        }
        var A = p.value;
        if (!(c && A in c)) throw new S7(A, h);
        var E = c[A];
        if (K6(p)) {
            (!E || typeof E == "string" || typeof E == "number" || typeof E == "bigint") &&
                (E = typeof E == "string" || typeof E == "number" || typeof E == "bigint" ? String(E) : ""),
                m.push({ type: typeof E == "string" ? re.literal : re.object, value: E });
            continue;
        }
        if (Z3(p)) {
            var x = typeof p.style == "string" ? r.date[p.style] : Ks(p.style) ? p.style.parsedOptions : void 0;
            m.push({ type: re.literal, value: o.getDateTimeFormat(i, x).format(E) });
            continue;
        }
        if (j3(p)) {
            var x = typeof p.style == "string" ? r.time[p.style] : Ks(p.style) ? p.style.parsedOptions : r.time.medium;
            m.push({ type: re.literal, value: o.getDateTimeFormat(i, x).format(E) });
            continue;
        }
        if (Q3(p)) {
            var x = typeof p.style == "string" ? r.number[p.style] : P3(p.style) ? p.style.parsedOptions : void 0;
            if (x && x.scale) {
                var H = x.scale || 1;
                if (typeof E == "bigint") {
                    if (!Number.isInteger(H))
                        throw new TypeError(
                            "Cannot apply fractional scale ".concat(
                                H,
                                " to bigint value. Scale must be an integer when formatting bigint."
                            )
                        );
                    E = E * BigInt(H);
                } else E = E * H;
            }
            m.push({ type: re.literal, value: o.getNumberFormat(i, x).format(E) });
            continue;
        }
        if (I3(p)) {
            var D = p.children,
                _ = p.value,
                V = c[_];
            if (!W3(V)) throw new E7(_, "function", h);
            var U = Wr(D, i, o, r, c, f),
                Q = V(
                    U.map(function (K) {
                        return K.value;
                    })
                );
            Array.isArray(Q) || (Q = [Q]),
                m.push.apply(
                    m,
                    Q.map(function (K) {
                        return { type: typeof K == "string" ? re.literal : re.object, value: K };
                    })
                );
        }
        if (F3(p)) {
            var Y = E,
                R = (Object.prototype.hasOwnProperty.call(p.options, Y) ? p.options[Y] : void 0) || p.options.other;
            if (!R) throw new V0(p.value, E, Object.keys(p.options), h);
            m.push.apply(m, Wr(R.value, i, o, r, c));
            continue;
        }
        if (Y3(p)) {
            var k = "=".concat(E),
                R = Object.prototype.hasOwnProperty.call(p.options, k) ? p.options[k] : void 0;
            if (!R) {
                if (!Intl.PluralRules)
                    throw new qn(
                        `Intl.PluralRules is not available in this environment.
Try polyfilling it using "@formatjs/intl-pluralrules"
`,
                        Je.MISSING_INTL_API,
                        h
                    );
                var X = typeof E == "bigint" ? Number(E) : E,
                    st = o.getPluralRules(i, { type: p.pluralType }).select(X - (p.offset || 0));
                R = (Object.prototype.hasOwnProperty.call(p.options, st) ? p.options[st] : void 0) || p.options.other;
            }
            if (!R) throw new V0(p.value, E, Object.keys(p.options), h);
            var P = typeof E == "bigint" ? Number(E) : E;
            m.push.apply(m, Wr(R.value, i, o, r, c, P - (p.offset || 0)));
            continue;
        }
    }
    return C7(m);
}
function T7(a, i) {
    return i
        ? $(
              $($({}, a), i),
              Object.keys(a).reduce(function (o, r) {
                  return (o[r] = $($({}, a[r]), i[r])), o;
              }, {})
          )
        : a;
}
function x7(a, i) {
    return i
        ? Object.keys(a).reduce(
              function (o, r) {
                  return (o[r] = T7(a[r], i[r])), o;
              },
              $({}, a)
          )
        : a;
}
function _s(a) {
    return {
        create: function () {
            return {
                get: function (i) {
                    return a[i];
                },
                set: function (i, o) {
                    a[i] = o;
                },
            };
        },
    };
}
function M7(a) {
    return (
        a === void 0 && (a = { number: {}, dateTime: {}, pluralRules: {} }),
        {
            getNumberFormat: ke(
                function () {
                    for (var i, o = [], r = 0; r < arguments.length; r++) o[r] = arguments[r];
                    return new ((i = Intl.NumberFormat).bind.apply(i, qe([void 0], o, !1)))();
                },
                { cache: _s(a.number), strategy: Xe.variadic }
            ),
            getDateTimeFormat: ke(
                function () {
                    for (var i, o = [], r = 0; r < arguments.length; r++) o[r] = arguments[r];
                    return new ((i = Intl.DateTimeFormat).bind.apply(i, qe([void 0], o, !1)))();
                },
                { cache: _s(a.dateTime), strategy: Xe.variadic }
            ),
            getPluralRules: ke(
                function () {
                    for (var i, o = [], r = 0; r < arguments.length; r++) o[r] = arguments[r];
                    return new ((i = Intl.PluralRules).bind.apply(i, qe([void 0], o, !1)))();
                },
                { cache: _s(a.pluralRules), strategy: Xe.variadic }
            ),
        }
    );
}
var J3 = (function () {
        function a(i, o, r, c) {
            o === void 0 && (o = a.defaultLocale);
            var f = this;
            if (
                ((this.formatterCache = { number: {}, dateTime: {}, pluralRules: {} }),
                (this.format = function (m) {
                    var g = f.formatToParts(m);
                    if (g.length === 1) return g[0].value;
                    var v = g.reduce(function (p, A) {
                        return (
                            !p.length || A.type !== re.literal || typeof p[p.length - 1] != "string"
                                ? p.push(A.value)
                                : (p[p.length - 1] += A.value),
                            p
                        );
                    }, []);
                    return v.length <= 1 ? v[0] || "" : v;
                }),
                (this.formatToParts = function (m) {
                    return Wr(f.ast, f.locales, f.formatters, f.formats, m, void 0, f.message);
                }),
                (this.resolvedOptions = function () {
                    var m;
                    return {
                        locale:
                            ((m = f.resolvedLocale) === null || m === void 0 ? void 0 : m.toString()) ||
                            Intl.NumberFormat.supportedLocalesOf(f.locales)[0],
                    };
                }),
                (this.getAst = function () {
                    return f.ast;
                }),
                (this.locales = o),
                (this.resolvedLocale = a.resolveLocale(o)),
                typeof i == "string")
            ) {
                if (((this.message = i), !a.__parse))
                    throw new TypeError("IntlMessageFormat.__parse must be set to process `message` of type `string`");
                var h = ru(c || {}, []);
                this.ast = a.__parse(i, $($({}, h), { locale: this.resolvedLocale }));
            } else this.ast = i;
            if (!Array.isArray(this.ast)) throw new TypeError("A message must be provided as a String or AST.");
            (this.formats = x7(a.formats, r)), (this.formatters = (c && c.formatters) || M7(this.formatterCache));
        }
        return (
            Object.defineProperty(a, "defaultLocale", {
                get: function () {
                    return (
                        a.memoizedDefaultLocale ||
                            (a.memoizedDefaultLocale = new Intl.NumberFormat().resolvedOptions().locale),
                        a.memoizedDefaultLocale
                    );
                },
                enumerable: !1,
                configurable: !0,
            }),
            (a.memoizedDefaultLocale = null),
            (a.resolveLocale = function (i) {
                if (!(typeof Intl.Locale > "u")) {
                    var o = Intl.NumberFormat.supportedLocalesOf(i);
                    return o.length > 0 ? new Intl.Locale(o[0]) : new Intl.Locale(typeof i == "string" ? i : i[0]);
                }
            }),
            (a.__parse = b7),
            (a.formats = {
                number: {
                    integer: { maximumFractionDigits: 0 },
                    currency: { style: "currency" },
                    percent: { style: "percent" },
                },
                date: {
                    short: { month: "numeric", day: "numeric", year: "2-digit" },
                    medium: { month: "short", day: "numeric", year: "numeric" },
                    long: { month: "long", day: "numeric", year: "numeric" },
                    full: { weekday: "long", month: "long", day: "numeric", year: "numeric" },
                },
                time: {
                    short: { hour: "numeric", minute: "numeric" },
                    medium: { hour: "numeric", minute: "numeric", second: "numeric" },
                    long: { hour: "numeric", minute: "numeric", second: "numeric", timeZoneName: "short" },
                    full: { hour: "numeric", minute: "numeric", second: "numeric", timeZoneName: "short" },
                },
            }),
            a
        );
    })(),
    Ta;
(function (a) {
    (a.FORMAT_ERROR = "FORMAT_ERROR"),
        (a.UNSUPPORTED_FORMATTER = "UNSUPPORTED_FORMATTER"),
        (a.INVALID_CONFIG = "INVALID_CONFIG"),
        (a.MISSING_DATA = "MISSING_DATA"),
        (a.MISSING_TRANSLATION = "MISSING_TRANSLATION");
})(Ta || (Ta = {}));
var xi = (function (a) {
        _e(i, a);
        function i(o, r, c) {
            var f = this,
                h = c ? (c instanceof Error ? c : new Error(String(c))) : void 0;
            return (
                (f =
                    a.call(
                        this,
                        "[@formatjs/intl Error "
                            .concat(o, "] ")
                            .concat(
                                r,
                                `
`
                            )
                            .concat(
                                h
                                    ? `
`
                                          .concat(
                                              h.message,
                                              `
`
                                          )
                                          .concat(h.stack)
                                    : ""
                            )
                    ) || this),
                (f.code = o),
                typeof Error.captureStackTrace == "function" && Error.captureStackTrace(f, i),
                f
            );
        }
        return i;
    })(Error),
    R7 = (function (a) {
        _e(i, a);
        function i(o, r) {
            return a.call(this, Ta.UNSUPPORTED_FORMATTER, o, r) || this;
        }
        return i;
    })(xi),
    w7 = (function (a) {
        _e(i, a);
        function i(o, r) {
            return a.call(this, Ta.INVALID_CONFIG, o, r) || this;
        }
        return i;
    })(xi),
    z0 = (function (a) {
        _e(i, a);
        function i(o, r) {
            return a.call(this, Ta.MISSING_DATA, o, r) || this;
        }
        return i;
    })(xi),
    Ne = (function (a) {
        _e(i, a);
        function i(o, r, c) {
            var f =
                a.call(
                    this,
                    Ta.FORMAT_ERROR,
                    ""
                        .concat(
                            o,
                            `
Locale: `
                        )
                        .concat(
                            r,
                            `
`
                        ),
                    c
                ) || this;
            return (f.locale = r), f;
        }
        return i;
    })(xi),
    Ns = (function (a) {
        _e(i, a);
        function i(o, r, c, f) {
            var h =
                a.call(
                    this,
                    ""
                        .concat(
                            o,
                            `
MessageID: `
                        )
                        .concat(
                            c?.id,
                            `
Default Message: `
                        )
                        .concat(
                            c?.defaultMessage,
                            `
Description: `
                        )
                        .concat(
                            c?.description,
                            `
`
                        ),
                    r,
                    f
                ) || this;
            return (h.descriptor = c), (h.locale = r), h;
        }
        return i;
    })(Ne),
    O7 = (function (a) {
        _e(i, a);
        function i(o, r) {
            var c =
                a.call(
                    this,
                    Ta.MISSING_TRANSLATION,
                    'Missing message: "'
                        .concat(o.id, '" for locale "')
                        .concat(r, '", using ')
                        .concat(
                            o.defaultMessage
                                ? "default message (".concat(
                                      typeof o.defaultMessage == "string"
                                          ? o.defaultMessage
                                          : o.defaultMessage
                                                .map(function (f) {
                                                    var h;
                                                    return (h = f.value) !== null && h !== void 0
                                                        ? h
                                                        : JSON.stringify(f);
                                                })
                                                .join(),
                                      ")"
                                  )
                                : "id",
                            " as fallback."
                        )
                ) || this;
            return (c.descriptor = o), c;
        }
        return i;
    })(xi);
function H7(a, i, o) {
    if ((o === void 0 && (o = Error), !a)) throw new o(i);
}
function vl(a, i, o) {
    return (
        o === void 0 && (o = {}),
        i.reduce(function (r, c) {
            return c in a ? (r[c] = a[c]) : c in o && (r[c] = o[c]), r;
        }, {})
    );
}
var B7 = function (a) {},
    D7 = function (a) {},
    $3 = {
        formats: {},
        messages: {},
        timeZone: void 0,
        defaultLocale: "en",
        defaultFormats: {},
        fallbackOnEmptyString: !0,
        onError: B7,
        onWarn: D7,
    };
function t5() {
    return { dateTime: {}, number: {}, message: {}, relativeTime: {}, pluralRules: {}, list: {}, displayNames: {} };
}
function ba(a) {
    return {
        create: function () {
            return {
                get: function (i) {
                    return a[i];
                },
                set: function (i, o) {
                    a[i] = o;
                },
            };
        },
    };
}
function _7(a) {
    a === void 0 && (a = t5());
    var i = Intl.RelativeTimeFormat,
        o = Intl.ListFormat,
        r = Intl.DisplayNames,
        c = ke(
            function () {
                for (var m, g = [], v = 0; v < arguments.length; v++) g[v] = arguments[v];
                return new ((m = Intl.DateTimeFormat).bind.apply(m, qe([void 0], g, !1)))();
            },
            { cache: ba(a.dateTime), strategy: Xe.variadic }
        ),
        f = ke(
            function () {
                for (var m, g = [], v = 0; v < arguments.length; v++) g[v] = arguments[v];
                return new ((m = Intl.NumberFormat).bind.apply(m, qe([void 0], g, !1)))();
            },
            { cache: ba(a.number), strategy: Xe.variadic }
        ),
        h = ke(
            function () {
                for (var m, g = [], v = 0; v < arguments.length; v++) g[v] = arguments[v];
                return new ((m = Intl.PluralRules).bind.apply(m, qe([void 0], g, !1)))();
            },
            { cache: ba(a.pluralRules), strategy: Xe.variadic }
        );
    return {
        getDateTimeFormat: c,
        getNumberFormat: f,
        getMessageFormat: ke(
            function (m, g, v, p) {
                return new J3(
                    m,
                    g,
                    v,
                    $({ formatters: { getNumberFormat: f, getDateTimeFormat: c, getPluralRules: h } }, p)
                );
            },
            { cache: ba(a.message), strategy: Xe.variadic }
        ),
        getRelativeTimeFormat: ke(
            function () {
                for (var m = [], g = 0; g < arguments.length; g++) m[g] = arguments[g];
                return new (i.bind.apply(i, qe([void 0], m, !1)))();
            },
            { cache: ba(a.relativeTime), strategy: Xe.variadic }
        ),
        getPluralRules: h,
        getListFormat: ke(
            function () {
                for (var m = [], g = 0; g < arguments.length; g++) m[g] = arguments[g];
                return new (o.bind.apply(o, qe([void 0], m, !1)))();
            },
            { cache: ba(a.list), strategy: Xe.variadic }
        ),
        getDisplayNames: ke(
            function () {
                for (var m = [], g = 0; g < arguments.length; g++) m[g] = arguments[g];
                return new (r.bind.apply(r, qe([void 0], m, !1)))();
            },
            { cache: ba(a.displayNames), strategy: Xe.variadic }
        ),
    };
}
function dc(a, i, o, r) {
    var c = a && a[i],
        f;
    if ((c && (f = c[o]), f)) return f;
    r(new R7("No ".concat(i, " format named: ").concat(o)));
}
function kr(a, i) {
    return Object.keys(a).reduce(function (o, r) {
        return (o[r] = $({ timeZone: i }, a[r])), o;
    }, {});
}
function G0(a, i) {
    var o = Object.keys($($({}, a), i));
    return o.reduce(function (r, c) {
        return (r[c] = $($({}, a[c]), i[c])), r;
    }, {});
}
function Q0(a, i) {
    if (!i) return a;
    var o = J3.formats;
    return $($($({}, o), a), {
        date: G0(kr(o.date, i), kr(a.date || {}, i)),
        time: G0(kr(o.time, i), kr(a.time || {}, i)),
    });
}
var $s = function (a, i, o, r, c) {
        var f = a.locale,
            h = a.formats,
            m = a.messages,
            g = a.defaultLocale,
            v = a.defaultFormats,
            p = a.fallbackOnEmptyString,
            A = a.onError,
            E = a.timeZone,
            x = a.defaultRichTextElements;
        o === void 0 && (o = { id: "" });
        var H = o.id,
            D = o.defaultMessage;
        H7(
            !!H,
            "[@formatjs/intl] An `id` must be provided to format a message. You can either:\n1. Configure your build toolchain with [babel-plugin-formatjs](https://formatjs.github.io/docs/tooling/babel-plugin)\nor [@formatjs/ts-transformer](https://formatjs.github.io/docs/tooling/ts-transformer) OR\n2. Configure your `eslint` config to include [eslint-plugin-formatjs](https://formatjs.github.io/docs/tooling/linter#enforce-id)\nto autofix this issue"
        );
        var _ = String(H),
            V = m && Object.prototype.hasOwnProperty.call(m, _) && m[_];
        if (Array.isArray(V) && V.length === 1 && V[0].type === Nt.literal) return V[0].value;
        if (!r && V && typeof V == "string" && !x) return V.replace(/'\{(.*?)\}'/gi, "{$1}");
        if (((r = $($({}, x), r)), (h = Q0(h, E)), (v = Q0(v, E)), !V)) {
            if (p === !1 && V === "") return V;
            if (((!D || (f && f.toLowerCase() !== g.toLowerCase())) && A(new O7(o, f)), D))
                try {
                    var U = i.getMessageFormat(D, g, v, c);
                    return U.format(r);
                } catch (Q) {
                    return (
                        A(
                            new Ns(
                                'Error formatting default message for: "'.concat(
                                    _,
                                    '", rendering default message verbatim'
                                ),
                                f,
                                o,
                                Q
                            )
                        ),
                        typeof D == "string" ? D : _
                    );
                }
            return _;
        }
        try {
            var U = i.getMessageFormat(V, f, h, $({ formatters: i }, c));
            return U.format(r);
        } catch (Q) {
            A(
                new Ns(
                    'Error formatting message: "'
                        .concat(_, '", using ')
                        .concat(D ? "default message" : "id", " as fallback."),
                    f,
                    o,
                    Q
                )
            );
        }
        if (D)
            try {
                var U = i.getMessageFormat(D, g, v, c);
                return U.format(r);
            } catch (Q) {
                A(
                    new Ns(
                        'Error formatting the default message for: "'.concat(_, '", rendering message verbatim'),
                        f,
                        o,
                        Q
                    )
                );
            }
        return typeof V == "string" ? V : typeof D == "string" ? D : _;
    },
    N7 = [
        "formatMatcher",
        "timeZone",
        "hour12",
        "weekday",
        "era",
        "year",
        "month",
        "day",
        "hour",
        "minute",
        "second",
        "timeZoneName",
        "hourCycle",
        "dateStyle",
        "timeStyle",
        "calendar",
        "numberingSystem",
        "fractionalSecondDigits",
    ];
function Mi(a, i, o, r) {
    var c = a.locale,
        f = a.formats,
        h = a.onError,
        m = a.timeZone;
    r === void 0 && (r = {});
    var g = r.format,
        v = $($({}, m && { timeZone: m }), g && dc(f, i, g, h)),
        p = vl(r, N7, v);
    return (
        i === "time" &&
            !p.hour &&
            !p.minute &&
            !p.second &&
            !p.timeStyle &&
            !p.dateStyle &&
            (p = $($({}, p), { hour: "numeric", minute: "numeric" })),
        o(c, p)
    );
}
function L7(a, i) {
    for (var o = [], r = 2; r < arguments.length; r++) o[r - 2] = arguments[r];
    var c = o[0],
        f = o[1],
        h = f === void 0 ? {} : f,
        m = typeof c == "string" ? new Date(c || 0) : c;
    try {
        return Mi(a, "date", i, h).format(m);
    } catch (g) {
        a.onError(new Ne("Error formatting date.", a.locale, g));
    }
    return String(m);
}
function U7(a, i) {
    for (var o = [], r = 2; r < arguments.length; r++) o[r - 2] = arguments[r];
    var c = o[0],
        f = o[1],
        h = f === void 0 ? {} : f,
        m = typeof c == "string" ? new Date(c || 0) : c;
    try {
        return Mi(a, "time", i, h).format(m);
    } catch (g) {
        a.onError(new Ne("Error formatting time.", a.locale, g));
    }
    return String(m);
}
function V7(a, i) {
    for (var o = [], r = 2; r < arguments.length; r++) o[r - 2] = arguments[r];
    var c = o[0],
        f = o[1],
        h = o[2],
        m = h === void 0 ? {} : h,
        g = typeof c == "string" ? new Date(c || 0) : c,
        v = typeof f == "string" ? new Date(f || 0) : f;
    try {
        return Mi(a, "dateTimeRange", i, m).formatRange(g, v);
    } catch (p) {
        a.onError(new Ne("Error formatting date time range.", a.locale, p));
    }
    return String(g);
}
function z7(a, i) {
    for (var o = [], r = 2; r < arguments.length; r++) o[r - 2] = arguments[r];
    var c = o[0],
        f = o[1],
        h = f === void 0 ? {} : f,
        m = typeof c == "string" ? new Date(c || 0) : c;
    try {
        return Mi(a, "date", i, h).formatToParts(m);
    } catch (g) {
        a.onError(new Ne("Error formatting date.", a.locale, g));
    }
    return [];
}
function G7(a, i) {
    for (var o = [], r = 2; r < arguments.length; r++) o[r - 2] = arguments[r];
    var c = o[0],
        f = o[1],
        h = f === void 0 ? {} : f,
        m = typeof c == "string" ? new Date(c || 0) : c;
    try {
        return Mi(a, "time", i, h).formatToParts(m);
    } catch (g) {
        a.onError(new Ne("Error formatting time.", a.locale, g));
    }
    return [];
}
var Q7 = ["style", "type", "fallback", "languageDisplay"];
function Z7(a, i, o, r) {
    var c = a.locale,
        f = a.onError,
        h = Intl.DisplayNames;
    h ||
        f(
            new qn(
                `Intl.DisplayNames is not available in this environment.
Try polyfilling it using "@formatjs/intl-displaynames"
`,
                Je.MISSING_INTL_API
            )
        );
    var m = vl(r, Q7);
    try {
        return i(c, m).of(o);
    } catch (g) {
        f(new Ne("Error formatting display name.", c, g));
    }
}
var j7 = ["type", "style"],
    Z0 = Date.now();
function F7(a) {
    return "".concat(Z0, "_").concat(a, "_").concat(Z0);
}
function Y7(a, i, o, r) {
    r === void 0 && (r = {});
    var c = e5(a, i, o, r).reduce(function (f, h) {
        var m = h.value;
        return (
            typeof m != "string" ? f.push(m) : typeof f[f.length - 1] == "string" ? (f[f.length - 1] += m) : f.push(m),
            f
        );
    }, []);
    return c.length === 1 ? c[0] : c.length === 0 ? "" : c;
}
function e5(a, i, o, r) {
    var c = a.locale,
        f = a.onError;
    r === void 0 && (r = {});
    var h = Intl.ListFormat;
    h ||
        f(
            new qn(
                `Intl.ListFormat is not available in this environment.
Try polyfilling it using "@formatjs/intl-listformat"
`,
                Je.MISSING_INTL_API
            )
        );
    var m = vl(r, j7);
    try {
        var g = {},
            v = Array.from(o).map(function (p, A) {
                if (typeof p == "object" && p !== null) {
                    var E = F7(A);
                    return (g[E] = p), E;
                }
                return String(p);
            });
        return i(c, m)
            .formatToParts(v)
            .map(function (p) {
                return p.type === "literal" ? p : $($({}, p), { value: g[p.value] || p.value });
            });
    } catch (p) {
        f(new Ne("Error formatting list.", c, p));
    }
    return o;
}
var I7 = ["type"];
function P7(a, i, o, r) {
    var c = a.locale,
        f = a.onError;
    r === void 0 && (r = {}),
        Intl.PluralRules ||
            f(
                new qn(
                    `Intl.PluralRules is not available in this environment.
Try polyfilling it using "@formatjs/intl-pluralrules"
`,
                    Je.MISSING_INTL_API
                )
            );
    var h = vl(r, I7);
    try {
        return i(c, h).select(o);
    } catch (m) {
        f(new Ne("Error formatting plural.", c, m));
    }
    return "other";
}
var k7 = ["numeric", "style"];
function X7(a, i, o) {
    var r = a.locale,
        c = a.formats,
        f = a.onError;
    o === void 0 && (o = {});
    var h = o.format,
        m = (!!h && dc(c, "relative", h, f)) || {},
        g = vl(o, k7, m);
    return i(r, g);
}
function q7(a, i, o, r, c) {
    c === void 0 && (c = {}), r || (r = "second");
    var f = Intl.RelativeTimeFormat;
    f ||
        a.onError(
            new qn(
                `Intl.RelativeTimeFormat is not available in this environment.
Try polyfilling it using "@formatjs/intl-relativetimeformat"
`,
                Je.MISSING_INTL_API
            )
        );
    try {
        return X7(a, i, c).format(o, r);
    } catch (h) {
        a.onError(new Ne("Error formatting relative time.", a.locale, h));
    }
    return String(o);
}
var K7 = [
    "style",
    "currency",
    "unit",
    "unitDisplay",
    "useGrouping",
    "minimumIntegerDigits",
    "minimumFractionDigits",
    "maximumFractionDigits",
    "minimumSignificantDigits",
    "maximumSignificantDigits",
    "compactDisplay",
    "currencyDisplay",
    "currencySign",
    "notation",
    "signDisplay",
    "unit",
    "unitDisplay",
    "numberingSystem",
    "trailingZeroDisplay",
    "roundingPriority",
    "roundingIncrement",
    "roundingMode",
];
function n5(a, i, o) {
    var r = a.locale,
        c = a.formats,
        f = a.onError;
    o === void 0 && (o = {});
    var h = o.format,
        m = (h && dc(c, "number", h, f)) || {},
        g = vl(o, K7, m);
    return i(r, g);
}
function W7(a, i, o, r) {
    r === void 0 && (r = {});
    try {
        return n5(a, i, r).format(o);
    } catch (c) {
        a.onError(new Ne("Error formatting number.", a.locale, c));
    }
    return String(o);
}
function J7(a, i, o, r) {
    r === void 0 && (r = {});
    try {
        return n5(a, i, r).formatToParts(o);
    } catch (c) {
        a.onError(new Ne("Error formatting number.", a.locale, c));
    }
    return [];
}
function $7(a) {
    var i = a ? a[Object.keys(a)[0]] : void 0;
    return typeof i == "string";
}
function th(a) {
    a.onWarn &&
        a.defaultRichTextElements &&
        $7(a.messages || {}) &&
        a.onWarn(`[@formatjs/intl] "defaultRichTextElements" was specified but "message" was not pre-compiled. 
Please consider using "@formatjs/cli" to pre-compile your messages for performance.
For more details see https://formatjs.github.io/docs/getting-started/message-distribution`);
}
function eh(a, i) {
    var o = _7(i),
        r = $($({}, $3), a),
        c = r.locale,
        f = r.defaultLocale,
        h = r.onError;
    return (
        c
            ? !Intl.NumberFormat.supportedLocalesOf(c).length && h
                ? h(
                      new z0(
                          'Missing locale data for locale: "'
                              .concat(c, '" in Intl.NumberFormat. Using default locale: "')
                              .concat(
                                  f,
                                  '" as fallback. See https://formatjs.github.io/docs/react-intl#runtime-requirements for more details'
                              )
                      )
                  )
                : !Intl.DateTimeFormat.supportedLocalesOf(c).length &&
                  h &&
                  h(
                      new z0(
                          'Missing locale data for locale: "'
                              .concat(c, '" in Intl.DateTimeFormat. Using default locale: "')
                              .concat(
                                  f,
                                  '" as fallback. See https://formatjs.github.io/docs/react-intl#runtime-requirements for more details'
                              )
                      )
                  )
            : (h &&
                  h(
                      new w7(
                          '"locale" was not configured, using "'.concat(
                              f,
                              '" as fallback. See https://formatjs.github.io/docs/react-intl/api#intlshape for more details'
                          )
                      )
                  ),
              (r.locale = r.defaultLocale || "en")),
        th(r),
        $($({}, r), {
            formatters: o,
            formatNumber: W7.bind(null, r, o.getNumberFormat),
            formatNumberToParts: J7.bind(null, r, o.getNumberFormat),
            formatRelativeTime: q7.bind(null, r, o.getRelativeTimeFormat),
            formatDate: L7.bind(null, r, o.getDateTimeFormat),
            formatDateToParts: z7.bind(null, r, o.getDateTimeFormat),
            formatTime: U7.bind(null, r, o.getDateTimeFormat),
            formatDateTimeRange: V7.bind(null, r, o.getDateTimeFormat),
            formatTimeToParts: G7.bind(null, r, o.getDateTimeFormat),
            formatPlural: P7.bind(null, r, o.getPluralRules),
            formatMessage: $s.bind(null, r, o),
            $t: $s.bind(null, r, o),
            formatList: Y7.bind(null, r, o.getListFormat),
            formatListToParts: e5.bind(null, r, o.getListFormat),
            formatDisplayName: Z7.bind(null, r, o.getDisplayNames),
        })
    );
}
function nh(a, i, o) {
    if ((o === void 0 && (o = Error), !a)) throw new o(i);
}
function a5(a) {
    nh(
        a,
        "[React Intl] Could not find required `intl` object. <IntlProvider> needs to exist in the component ancestry."
    );
}
var l5 = $($({}, $3), { textComponent: C.Fragment }),
    i5 = function (a) {
        var i = C.Children.toArray(a);
        return i.map(function (o, r) {
            return C.isValidElement(o) ? z.jsx(C.Fragment, { children: o }, r) : o;
        });
    };
function ah(a) {
    return function (i) {
        return a(i5(i));
    };
}
function lh(a, i) {
    if (a === i) return !0;
    if (!a || !i) return !1;
    var o = Object.keys(a),
        r = Object.keys(i),
        c = o.length;
    if (r.length !== c) return !1;
    for (var f = 0; f < c; f++) {
        var h = o[f];
        if (a[h] !== i[h] || !Object.prototype.hasOwnProperty.call(i, h)) return !1;
    }
    return !0;
}
var Ls = { exports: {} },
    xt = {};
var j0;
function ih() {
    if (j0) return xt;
    j0 = 1;
    var a = typeof Symbol == "function" && Symbol.for,
        i = a ? Symbol.for("react.element") : 60103,
        o = a ? Symbol.for("react.portal") : 60106,
        r = a ? Symbol.for("react.fragment") : 60107,
        c = a ? Symbol.for("react.strict_mode") : 60108,
        f = a ? Symbol.for("react.profiler") : 60114,
        h = a ? Symbol.for("react.provider") : 60109,
        m = a ? Symbol.for("react.context") : 60110,
        g = a ? Symbol.for("react.async_mode") : 60111,
        v = a ? Symbol.for("react.concurrent_mode") : 60111,
        p = a ? Symbol.for("react.forward_ref") : 60112,
        A = a ? Symbol.for("react.suspense") : 60113,
        E = a ? Symbol.for("react.suspense_list") : 60120,
        x = a ? Symbol.for("react.memo") : 60115,
        H = a ? Symbol.for("react.lazy") : 60116,
        D = a ? Symbol.for("react.block") : 60121,
        _ = a ? Symbol.for("react.fundamental") : 60117,
        V = a ? Symbol.for("react.responder") : 60118,
        U = a ? Symbol.for("react.scope") : 60119;
    function Q(R) {
        if (typeof R == "object" && R !== null) {
            var k = R.$$typeof;
            switch (k) {
                case i:
                    switch (((R = R.type), R)) {
                        case g:
                        case v:
                        case r:
                        case f:
                        case c:
                        case A:
                            return R;
                        default:
                            switch (((R = R && R.$$typeof), R)) {
                                case m:
                                case p:
                                case H:
                                case x:
                                case h:
                                    return R;
                                default:
                                    return k;
                            }
                    }
                case o:
                    return k;
            }
        }
    }
    function Y(R) {
        return Q(R) === v;
    }
    return (
        (xt.AsyncMode = g),
        (xt.ConcurrentMode = v),
        (xt.ContextConsumer = m),
        (xt.ContextProvider = h),
        (xt.Element = i),
        (xt.ForwardRef = p),
        (xt.Fragment = r),
        (xt.Lazy = H),
        (xt.Memo = x),
        (xt.Portal = o),
        (xt.Profiler = f),
        (xt.StrictMode = c),
        (xt.Suspense = A),
        (xt.isAsyncMode = function (R) {
            return Y(R) || Q(R) === g;
        }),
        (xt.isConcurrentMode = Y),
        (xt.isContextConsumer = function (R) {
            return Q(R) === m;
        }),
        (xt.isContextProvider = function (R) {
            return Q(R) === h;
        }),
        (xt.isElement = function (R) {
            return typeof R == "object" && R !== null && R.$$typeof === i;
        }),
        (xt.isForwardRef = function (R) {
            return Q(R) === p;
        }),
        (xt.isFragment = function (R) {
            return Q(R) === r;
        }),
        (xt.isLazy = function (R) {
            return Q(R) === H;
        }),
        (xt.isMemo = function (R) {
            return Q(R) === x;
        }),
        (xt.isPortal = function (R) {
            return Q(R) === o;
        }),
        (xt.isProfiler = function (R) {
            return Q(R) === f;
        }),
        (xt.isStrictMode = function (R) {
            return Q(R) === c;
        }),
        (xt.isSuspense = function (R) {
            return Q(R) === A;
        }),
        (xt.isValidElementType = function (R) {
            return (
                typeof R == "string" ||
                typeof R == "function" ||
                R === r ||
                R === v ||
                R === f ||
                R === c ||
                R === A ||
                R === E ||
                (typeof R == "object" &&
                    R !== null &&
                    (R.$$typeof === H ||
                        R.$$typeof === x ||
                        R.$$typeof === h ||
                        R.$$typeof === m ||
                        R.$$typeof === p ||
                        R.$$typeof === _ ||
                        R.$$typeof === V ||
                        R.$$typeof === U ||
                        R.$$typeof === D))
            );
        }),
        (xt.typeOf = Q),
        xt
    );
}
var F0;
function rh() {
    return F0 || ((F0 = 1), (Ls.exports = ih())), Ls.exports;
}
var Us, Y0;
function uh() {
    if (Y0) return Us;
    Y0 = 1;
    var a = rh(),
        i = {
            childContextTypes: !0,
            contextType: !0,
            contextTypes: !0,
            defaultProps: !0,
            displayName: !0,
            getDefaultProps: !0,
            getDerivedStateFromError: !0,
            getDerivedStateFromProps: !0,
            mixins: !0,
            propTypes: !0,
            type: !0,
        },
        o = { name: !0, length: !0, prototype: !0, caller: !0, callee: !0, arguments: !0, arity: !0 },
        r = { $$typeof: !0, render: !0, defaultProps: !0, displayName: !0, propTypes: !0 },
        c = { $$typeof: !0, compare: !0, defaultProps: !0, displayName: !0, propTypes: !0, type: !0 },
        f = {};
    (f[a.ForwardRef] = r), (f[a.Memo] = c);
    function h(H) {
        return a.isMemo(H) ? c : f[H.$$typeof] || i;
    }
    var m = Object.defineProperty,
        g = Object.getOwnPropertyNames,
        v = Object.getOwnPropertySymbols,
        p = Object.getOwnPropertyDescriptor,
        A = Object.getPrototypeOf,
        E = Object.prototype;
    function x(H, D, _) {
        if (typeof D != "string") {
            if (E) {
                var V = A(D);
                V && V !== E && x(H, V, _);
            }
            var U = g(D);
            v && (U = U.concat(v(D)));
            for (var Q = h(H), Y = h(D), R = 0; R < U.length; ++R) {
                var k = U[R];
                if (!o[k] && !(_ && _[k]) && !(Y && Y[k]) && !(Q && Q[k])) {
                    var X = p(D, k);
                    try {
                        m(H, k, X);
                    } catch {}
                }
            }
        }
        return H;
    }
    return (Us = x), Us;
}
uh();
var mc =
    typeof window < "u" && !window.__REACT_INTL_BYPASS_GLOBAL_CONTEXT__
        ? window.__REACT_INTL_CONTEXT__ || (window.__REACT_INTL_CONTEXT__ = C.createContext(null))
        : C.createContext(null);
mc.Consumer;
var oh = mc.Provider,
    sh = oh,
    ch = mc;
function vc() {
    var a = C.useContext(ch);
    return a5(a), a;
}
var tc;
(function (a) {
    (a.formatDate = "FormattedDate"),
        (a.formatTime = "FormattedTime"),
        (a.formatNumber = "FormattedNumber"),
        (a.formatList = "FormattedList"),
        (a.formatDisplayName = "FormattedDisplayName");
})(tc || (tc = {}));
var ec;
(function (a) {
    (a.formatDate = "FormattedDateParts"),
        (a.formatTime = "FormattedTimeParts"),
        (a.formatNumber = "FormattedNumberParts"),
        (a.formatList = "FormattedListParts");
})(ec || (ec = {}));
function r5(a) {
    var i = function (o) {
        var r = vc(),
            c = o.value,
            f = o.children,
            h = ru(o, ["value", "children"]),
            m = typeof c == "string" ? new Date(c || 0) : c,
            g = a === "formatDate" ? r.formatDateToParts(m, h) : r.formatTimeToParts(m, h);
        return f(g);
    };
    return (i.displayName = ec[a]), i;
}
function Ri(a) {
    var i = function (o) {
        var r = vc(),
            c = o.value,
            f = o.children,
            h = ru(o, ["value", "children"]),
            m = r[a](c, h);
        if (typeof f == "function") return f(m);
        var g = r.textComponent || C.Fragment;
        return z.jsx(g, { children: m });
    };
    return (i.displayName = tc[a]), i;
}
function u5(a) {
    return (
        a &&
        Object.keys(a).reduce(function (i, o) {
            var r = a[o];
            return (i[o] = W3(r) ? ah(r) : r), i;
        }, {})
    );
}
var I0 = function (a, i, o, r) {
        for (var c = [], f = 4; f < arguments.length; f++) c[f - 4] = arguments[f];
        var h = u5(r),
            m = $s.apply(void 0, qe([a, i, o, h], c, !1));
        return Array.isArray(m) ? i5(m) : m;
    },
    P0 = function (a, i) {
        var o = a.defaultRichTextElements,
            r = ru(a, ["defaultRichTextElements"]),
            c = u5(o),
            f = eh($($($({}, l5), r), { defaultRichTextElements: c }), i),
            h = {
                locale: f.locale,
                timeZone: f.timeZone,
                fallbackOnEmptyString: f.fallbackOnEmptyString,
                formats: f.formats,
                defaultLocale: f.defaultLocale,
                defaultFormats: f.defaultFormats,
                messages: f.messages,
                onError: f.onError,
                defaultRichTextElements: c,
            };
        return $($({}, f), { formatMessage: I0.bind(null, h, f.formatters), $t: I0.bind(null, h, f.formatters) });
    };
function Vs(a) {
    return {
        locale: a.locale,
        timeZone: a.timeZone,
        fallbackOnEmptyString: a.fallbackOnEmptyString,
        formats: a.formats,
        textComponent: a.textComponent,
        messages: a.messages,
        defaultLocale: a.defaultLocale,
        defaultFormats: a.defaultFormats,
        onError: a.onError,
        onWarn: a.onWarn,
        wrapRichTextChunksInFragment: a.wrapRichTextChunksInFragment,
        defaultRichTextElements: a.defaultRichTextElements,
    };
}
var fh = (function (a) {
    _e(i, a);
    function i() {
        var o = (a !== null && a.apply(this, arguments)) || this;
        return (
            (o.cache = t5()), (o.state = { cache: o.cache, intl: P0(Vs(o.props), o.cache), prevConfig: Vs(o.props) }), o
        );
    }
    return (
        (i.getDerivedStateFromProps = function (o, r) {
            var c = r.prevConfig,
                f = r.cache,
                h = Vs(o);
            return lh(c, h) ? null : { intl: P0(h, f), prevConfig: h };
        }),
        (i.prototype.render = function () {
            return a5(this.state.intl), z.jsx(sh, { value: this.state.intl, children: this.props.children });
        }),
        (i.displayName = "IntlProvider"),
        (i.defaultProps = l5),
        i
    );
})(C.PureComponent);
Ri("formatDate");
Ri("formatTime");
Ri("formatNumber");
Ri("formatList");
Ri("formatDisplayName");
r5("formatDate");
r5("formatTime");
const hh = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">
  <!-- Mark Logo -->
  <symbol id="pplx-logo-mark">
    <path
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15 0.124727C15.4832 0.124727 15.8748 0.516607 15.875 0.999727V8.88645L24.3809 0.380586C24.6311 0.130476 25.0081 0.0557816 25.335 0.191133C25.6618 0.326537 25.8749 0.645944 25.875 0.999727V10.1003H28.75L28.8398 10.1052C29.2809 10.1502 29.625 10.5224 29.625 10.9753V23.5007C29.6246 23.9836 29.233 24.3757 28.75 24.3757H25.875V30.9997C25.875 31.3536 25.6619 31.6729 25.335 31.8083C25.008 31.9438 24.6311 31.8691 24.3809 31.6189L15.875 23.113V30.9997C15.875 31.483 15.4832 31.8747 15 31.8747C14.5168 31.8747 14.125 31.483 14.125 30.9997V23.113L5.61914 31.6189C5.36889 31.8691 4.992 31.9438 4.66504 31.8083C4.33815 31.6729 4.125 31.3536 4.125 30.9997V24.3757H1.25C0.76699 24.3757 0.375388 23.9836 0.375 23.5007V10.9753C0.375 10.4921 0.766751 10.1003 1.25 10.1003H4.125V0.999727C4.12511 0.645944 4.33818 0.326537 4.66504 0.191133C4.99192 0.0557816 5.36892 0.130476 5.61914 0.380586L14.125 8.88645V0.999727C14.1252 0.516607 14.5168 0.124727 15 0.124727ZM5.875 20.1462V28.8864L14.125 20.6364V12.9275L5.875 20.1462ZM15.875 20.6364L24.125 28.8864V20.1462L15.875 12.9275V20.6364ZM2.125 22.6257H4.125V19.7497L4.12988 19.656C4.15334 19.4388 4.25778 19.2369 4.42383 19.0915L12.6992 11.8503H5.20312C5.13787 11.8658 5.07001 11.8747 5 11.8747C4.92999 11.8747 4.86213 11.8658 4.79688 11.8503H2.125V22.6257ZM25.5762 19.0915C25.7659 19.2576 25.8749 19.4976 25.875 19.7497V22.6257H27.875V11.8503H25.2031C25.1379 11.8658 25.07 11.8747 25 11.8747C24.93 11.8747 24.8621 11.8658 24.7969 11.8503H17.3008L25.5762 19.0915ZM5.875 10.1003H12.8623L5.875 3.11301V10.1003ZM17.1377 10.1003H24.125V3.11301L17.1377 10.1003Z"
    />
  </symbol>

  <!-- Full Logo -->
  <symbol id="pplx-logo-full">
    <path
      fill="var(--logo-fill, currentColor)"
      d="M196.978 27.8931H200.033V34.1872H196.079C192.979 34.1872 190.669 34.9333 189.14 36.4254C187.615 37.9176 186.85 40.3662 186.85 43.7711V64.401H180.606V28.0333H186.85V33.8367C186.85 34.1622 187.014 34.3274 187.337 34.3274C187.52 34.3274 187.659 34.2823 187.754 34.1872C187.848 34.0921 187.938 33.9068 188.032 33.6264C189.234 29.8058 192.219 27.8931 196.983 27.8931H196.978ZM237.763 35.6894C239.402 38.6036 240.227 42.1137 240.227 46.2146C240.227 50.3156 239.407 53.8257 237.763 56.7399C236.119 59.6541 233.993 61.8323 231.38 63.2794C228.767 64.7265 225.956 65.4476 222.951 65.4476C217.03 65.4476 212.868 63.0691 210.464 58.3122C210.28 57.9417 210.046 57.7514 209.768 57.7514C209.49 57.7514 209.351 57.8916 209.351 58.172V77.6853H203.107V28.0333H209.351V34.2573C209.351 34.5377 209.49 34.6779 209.768 34.6779C210.046 34.6779 210.275 34.4926 210.464 34.1171C212.868 29.3602 217.03 26.9817 222.951 26.9817C225.956 26.9817 228.767 27.7028 231.38 29.1499C233.993 30.597 236.119 32.7751 237.763 35.6894ZM233.983 46.2146C233.983 41.9234 232.841 38.5786 230.551 36.1801C228.261 33.7816 225.246 32.5799 221.496 32.5799C217.745 32.5799 214.73 33.7816 212.44 36.1801C210.151 38.5836 209.311 41.9284 209.311 46.2146C209.311 50.5009 210.151 53.8507 212.44 56.2492C214.73 58.6527 217.75 59.8494 221.496 59.8494C225.241 59.8494 228.261 58.6477 230.551 56.2492C232.841 53.8507 233.983 50.5009 233.983 46.2146ZM134.595 35.7445C136.235 38.6587 137.059 42.1688 137.059 46.2697C137.059 50.3707 136.24 53.8808 134.595 56.795C132.951 59.7092 130.825 61.8874 128.213 63.3345C125.6 64.7816 122.788 65.5026 119.783 65.5026C113.863 65.5026 109.7 63.1242 107.296 58.3673C107.112 57.9967 106.879 57.8065 106.601 57.8065C106.322 57.8065 106.183 57.9467 106.183 58.2271V77.7404H99.9446V28.0883H106.188V34.3124C106.188 34.5928 106.327 34.733 106.606 34.733C106.884 34.733 107.112 34.5477 107.301 34.1722C109.705 29.4153 113.867 27.0368 119.788 27.0368C122.793 27.0368 125.605 27.7579 128.218 29.205C130.83 30.6521 132.956 32.8302 134.6 35.7445H134.595ZM130.815 46.2697C130.815 41.9785 129.673 38.6336 127.383 36.2352C125.093 33.8367 122.078 32.6349 118.328 32.6349C114.578 32.6349 111.563 33.8367 109.273 36.2352C106.983 38.6387 106.144 41.9835 106.144 46.2697C106.144 50.5559 106.983 53.9058 109.273 56.3043C111.563 58.7078 114.578 59.9045 118.328 59.9045C122.078 59.9045 125.093 58.7028 127.383 56.3043C129.673 53.9058 130.815 50.5559 130.815 46.2697ZM169.112 52.8543H175.703C174.824 56.2592 173.031 59.2085 170.329 61.7021C167.622 64.1957 163.748 65.4425 158.706 65.4425C154.911 65.4425 151.573 64.6614 148.682 63.0991C145.791 61.5369 143.561 59.3137 141.986 56.4195C140.412 53.5303 139.627 50.1253 139.627 46.2096C139.627 42.294 140.392 38.889 141.917 35.9998C143.442 33.1106 145.583 30.8824 148.335 29.3201C151.086 27.7579 154.31 26.9767 158.011 26.9767C161.711 26.9767 164.776 27.7479 167.344 29.2851C169.912 30.8223 171.829 32.8653 173.101 35.404C174.372 37.9477 175.008 40.7317 175.008 43.7611V47.9572H146.219C146.447 51.5925 147.664 54.4867 149.859 56.6298C152.055 58.7729 155.005 59.8494 158.706 59.8494C161.711 59.8494 164.016 59.2335 165.61 57.9967C167.205 56.7599 168.372 55.0475 169.112 52.8543ZM146.288 42.7146H168.074C168.074 39.545 167.264 37.0614 165.645 35.2638C164.026 33.4712 161.483 32.5699 158.015 32.5699C154.777 32.5699 152.129 33.4461 150.073 35.1937C148.017 36.9412 146.755 39.4498 146.293 42.7096L146.288 42.7146ZM245.169 64.396H251.413V14.043H245.169V64.401V64.396ZM331.801 24.0625H339.093V16.1911H331.801V24.0625ZM357.526 58.9782C356.393 59.0933 355.708 59.1534 355.479 59.1534C355.156 59.1534 354.898 59.0583 354.714 58.873C354.531 58.6877 354.436 58.4324 354.436 58.1019C354.436 57.8716 354.496 57.1806 354.61 56.0389C354.724 54.8972 354.784 53.1347 354.784 50.7612V33.361H363.69L361.937 28.0333H354.789V18.2391H348.545V28.0283H341.755V33.356H348.545V52.5038C348.545 56.5146 349.519 59.4989 351.461 61.4568C353.403 63.4146 356.363 64.396 360.342 64.396H365.2V58.8029H362.771C360.412 58.8029 358.663 58.863 357.531 58.9782H357.526ZM394.059 28.0283L383.723 58.5425C383.583 58.9181 383.365 59.4088 382.655 59.4088C381.944 59.4088 381.726 58.9181 381.587 58.5425L371.25 28.0283H364.882L376.853 64.396H381.085C381.363 64.396 381.572 64.4211 381.711 64.4661C381.85 64.5112 381.964 64.6264 382.059 64.8166C382.242 65.097 382.217 65.5177 381.989 66.0735L380.047 71.3862C379.769 72.0872 379.237 72.4377 378.452 72.4377C378.174 72.4377 377.529 72.3776 376.51 72.2624C375.492 72.1473 374.176 72.0872 372.556 72.0872H367.49V77.6803H374.151C378.035 77.6803 380.375 77.0143 382.386 75.6874C384.398 74.3605 385.958 72.0171 387.07 68.6572L400 29.4203V28.0233H394.059V28.0283ZM311.406 41.5979L301.626 28.0283H294.756V29.4253L306.478 45.1631L292.188 62.999V64.396H299.197L310.576 49.7798L321.191 64.396H327.922V62.999L315.504 46.2146L328.965 29.5004V28.0333H321.956L311.411 41.603L311.406 41.5979ZM332.467 64.396H338.71V28.0333H332.467V64.401V64.396ZM292.471 52.8543C291.592 56.2592 289.799 59.2085 287.097 61.7021C284.39 64.1957 280.515 65.4425 275.474 65.4425C271.679 65.4425 268.341 64.6614 265.45 63.0991C262.559 61.5369 260.329 59.3137 258.754 56.4195C257.18 53.5303 256.395 50.1253 256.395 46.2096C256.395 42.294 257.16 38.889 258.685 35.9998C260.21 33.1106 262.35 30.8824 265.102 29.3201C267.854 27.7579 271.078 26.9767 274.778 26.9767C278.479 26.9767 281.543 27.7479 284.111 29.2851C286.679 30.8223 288.597 32.8653 289.868 35.404C291.14 37.9477 291.776 40.7317 291.776 43.7611V47.9572H262.986C263.215 51.5925 264.432 54.4867 266.627 56.6298C268.823 58.7729 271.773 59.8494 275.474 59.8494C278.479 59.8494 280.783 59.2335 282.378 57.9967C283.972 56.7599 285.14 55.0475 285.88 52.8543H292.471ZM263.056 42.7146H284.842C284.842 39.545 284.032 37.0614 282.413 35.2638C280.793 33.4712 278.25 32.5699 274.783 32.5699C271.545 32.5699 268.897 33.4461 266.841 35.1937C264.784 36.9412 263.523 39.4498 263.061 42.7096L263.056 42.7146Z"
    />
    <path
      fill="none"
      stroke="var(--logo-stroke, currentColor)"
      class="transition-all duration-300"
      stroke-width="4.30504"
      stroke-miterlimit="10"
      d="M38.6936 29.9832L12.8633 5.88983V29.9832H38.6936Z M39.5005 29.9832L65.3308 5.88983V29.9832H39.5005Z M38.7227 2L38.7227 90.2534 M64.5246 53.7584L38.6943 30.0068V62.9404L64.5246 85.9724V53.7584Z M12.8924 53.7584L38.7227 30.0068V62.9404L12.8924 85.9724V53.7584Z M2.28711 29.9832V64.4236H12.8863V53.7348L38.7226 29.9832H2.28711Z M38.6943 30.3L64.5246 54.0515V64.7403H75.2872V30.3L38.6943 30.3Z"
    />
  </symbol>

  <!-- Labs Logo -->
  <symbol id="pplx-logo-labs">
    <path
      fill="currentColor"
      d="M311.555 34.9571C330.01 34.9571 344.672 45.7532 344.672 65.084C344.672 84.4148 330.01 95.3568 311.555 95.3568H279.094V140H265.817V34.9571H311.555ZM279.094 84.0501H309.585C322.643 84.0501 331.396 77.1931 331.396 65.157C331.396 53.0478 322.643 46.2638 309.585 46.2638H279.094V84.0501ZM353.444 102.797C353.444 77.7037 367.669 63.9169 390.209 63.9169C412.823 63.9169 425.151 77.8496 425.151 99.5877V105.934H365.918C366.137 121.399 375.255 131.465 390.209 131.465C404.434 131.465 410.926 123.587 412.093 116.73H423.619V118.918C421.868 128.037 413.187 141.751 390.355 141.751C367.815 141.751 353.444 127.964 353.444 102.797ZM366.064 95.8674H412.896C412.75 83.2477 405.09 74.1294 390.136 74.1294C375.474 74.1294 367.085 83.3936 366.064 95.8674ZM447.732 65.6676H460.133V76.1719H461.3C464.218 69.8985 469.908 65.4487 483.257 65.4487H500.691V76.3907H483.549C467.501 76.3907 460.571 84.7795 460.571 101.849V140H447.732V65.6676ZM517.092 169.179V65.6676H529.638V75.8801H530.805C536.349 67.3453 545.322 63.9898 555.826 63.9898C575.157 63.9898 589.965 77.1202 589.965 102.87C589.965 128.547 575.157 141.678 555.826 141.678C545.541 141.678 536.641 138.395 531.097 130.152H529.93V169.179H517.092ZM529.492 102.87C529.492 120.888 539.121 131.028 553.2 131.028C567.425 131.028 576.981 120.888 576.981 102.87C576.981 84.7795 567.425 74.64 553.2 74.64C539.121 74.64 529.492 84.7795 529.492 102.87ZM637.266 34.9571V129.642H651.272V140H605.899V129.642H624.428V45.2426H610.276V34.9571H637.266ZM665.9 102.797C665.9 77.7037 680.125 63.9169 702.665 63.9169C725.278 63.9169 737.606 77.8496 737.606 99.5877V105.934H678.374C678.593 121.399 687.711 131.465 702.665 131.465C716.89 131.465 723.382 123.587 724.549 116.73H736.074V118.918C734.324 128.037 725.643 141.751 702.811 141.751C680.27 141.751 665.9 127.964 665.9 102.797ZM678.52 95.8674H725.351C725.205 83.2477 717.546 74.1294 702.592 74.1294C687.93 74.1294 679.541 83.3936 678.52 95.8674ZM752.566 65.6676H765.696L786.851 93.3143H788.018L810.85 65.6676H823.762V67.856L795.313 102.36L822.522 137.812V140H809.391L787.289 111.186H786.121L762.414 140H749.502V137.812L778.827 102.214L752.566 67.856V65.6676ZM871.43 65.6676V129.642H885.436V140H840.063V129.642H858.591V75.953H844.44V65.6676H871.43ZM857.205 52.9749V38.8962H872.087V52.9749H857.205ZM896.344 65.6676H919.613V43.8566H932.452V65.6676H962.068V76.0989H932.452V127.745L933.619 128.912H961.849V140H938.725C926.543 140 919.613 133.945 919.613 121.836V76.0989H896.344V65.6676ZM973.245 65.6676H986.302L1010.01 124.681H1011.18L1034.81 65.6676H1047.5V67.856L1004.76 169.179H991.992V166.99L1003.66 139.927L973.245 67.856V65.6676ZM1116.67 34.9571H1130.09V128.256H1189.03V140H1116.67V34.9571ZM1205.12 86.3114C1206.66 72.5245 1218.55 63.9169 1237.95 63.9169C1257.21 63.9169 1268.59 72.5245 1268.59 91.0529V140H1256.62V129.787H1255.46C1252.25 135.477 1244.66 141.605 1229.05 141.605C1212.78 141.605 1201.55 133.508 1201.55 119.648C1201.55 104.913 1212.78 98.4205 1227.96 96.5239L1256.19 93.0225V90.3235C1256.19 78.725 1249.84 74.1294 1237.66 74.1294C1225.4 74.1294 1218.18 78.725 1217.16 88.4998H1205.12V86.3114ZM1214.31 119.064C1214.31 126.797 1220.88 131.246 1231.17 131.246C1244.88 131.246 1256.19 123.952 1256.19 107.539V102.943L1230.51 106.299C1220.52 107.612 1214.31 111.259 1214.31 119.064ZM1291.61 34.9571H1304.44V75.5153H1305.61C1311.16 67.1995 1320.06 63.9898 1330.34 63.9898C1349.67 63.9898 1364.48 77.1202 1364.48 102.87C1364.48 128.547 1349.67 141.678 1330.34 141.678C1319.84 141.678 1310.86 138.322 1305.32 129.787H1304.15V140H1291.61V34.9571ZM1304.01 102.87C1304.01 120.888 1313.64 131.028 1327.71 131.028C1341.94 131.028 1351.49 120.888 1351.49 102.87C1351.49 84.7795 1341.94 74.64 1327.71 74.64C1313.64 74.64 1304.01 84.7795 1304.01 102.87ZM1381.07 85.1443C1381.07 71.941 1392.52 63.9898 1411.78 63.9898C1431.18 63.9898 1443 71.941 1444.17 86.0926V88.281H1432.42C1431.91 77.9955 1423.74 74.1294 1411.85 74.1294C1400.04 74.1294 1393.4 77.9226 1393.4 84.8525C1393.4 91.7824 1399.09 94.4085 1407.19 95.3568L1419.95 96.9616C1434.98 98.7853 1445.41 105.132 1445.41 118.773C1445.41 132.487 1434.54 141.678 1413.9 141.678C1393.25 141.678 1380.34 132.559 1379.39 119.064V116.876H1391.36C1392.09 126.943 1401.28 131.538 1413.9 131.538C1426.59 131.538 1433.01 126.87 1433.01 119.429C1433.01 112.134 1426.95 108.852 1417.18 107.612L1404.41 106.007C1390.41 104.329 1381.07 98.2017 1381.07 85.1443Z"
    />
    <path
      fill="currentColor"
      d="M59.4967 39.8367C30.9654 39.8367 7.83624 62.9671 7.83624 91.5C7.83624 120.033 30.9654 143.163 59.4967 143.163C83.9985 143.163 104.516 126.105 109.823 103.216H117.84C112.399 130.466 88.3457 151 59.4967 151C26.6376 151 0 124.361 0 91.5C0 58.639 26.6376 32 59.4967 32C91.0393 32 116.849 56.5473 118.866 87.5817H155.879L123.292 54.9276L128.838 49.3918L161.428 82.0483L161.387 35.9218L169.223 35.9149L169.264 82.0641L201.87 49.3918L207.416 54.9276L174.829 87.5817H221V95.4183H174.771L207.416 128.131L201.87 133.667L169.281 101.011L169.321 147.157L161.485 147.163L161.444 100.993L128.838 133.667L123.292 128.131L155.937 95.4183H129.748V95.3791H84.6892V95.4183H59.495V87.5817H111.011C109.008 60.8792 86.7098 39.8367 59.4967 39.8367Z"
    />
  </symbol>

  <!-- Pro Logo (regular) -->
  <symbol id="pplx-logo-pro">
    <path
      fill="currentColor"
      d="M558.95,126.72c-27.44,27.72-27.17,101.45,0,129.38,25.44,28.65,83.99,28.94,109.2,0h0c13.9-14.68,20.94-38.51,20.94-64.92,0-26.44-7.04-50.1-20.98-64.5-25.23-29.51-83.73-29.21-109.17.04Z"
    />
    <path
      fill="currentColor"
      d="M780.18,91.05l-.13-.24c-16.48-29.44-40.65-53.13-69.89-68.52l-.17-.09c-27.73-14.73-58.76-22.2-92.21-22.2H30.68C14.13,0,.71,13.4.68,29.94l-.68,352.42h61.16V69.44h51.68v20.46c0,2.11,2.57,3.13,4.03,1.6,47.58-52.18,144.58-36.94,178.65,27.45,11.54,19.66,17.39,43.96,17.39,72.23,1.63,73.04-48.06,131.68-120.25,131.21-32.37,0-57.81-12.59-75.79-31.52-1.45-1.53-4.03-.51-4.03,1.6v89.9h504.93c33.45,0,64.43-7.45,92.09-22.14l.17-.09c29.33-15.43,53.53-39.13,69.99-68.53l.14-.25c16.31-28.74,24.58-62.44,24.58-100.17s-8.27-71.4-24.57-100.13ZM479.99,118.23c-23.81.5-56.08-3.74-72.26,13-8.74,8.61-13.17,23.4-13.17,43.96v140.34h-51.67V69.44h51.67v20.46c0,2.35,3.08,3.22,4.32,1.22,5.01-8.06,10.34-13.58,16.12-16.74,9.81-5.62,23.28-8.48,40.05-8.48h24.94v52.31ZM613.77,322.39c-75.99.52-128.52-54.09-127-131.21,0-27.33,5.53-51.14,16.45-70.78,43.24-80.65,177.73-80.74,220.65-.03,11.22,19.65,16.91,43.48,16.91,70.8,1.27,76.58-51.1,131.74-127,131.21Z"
    />
    <path
      fill="currentColor"
      d="M240.29,256.1h0c13.9-14.68,20.94-38.51,20.94-64.92,0-26.44-7.04-50.1-20.98-64.5-25.23-29.51-83.73-29.21-109.17.04-27.44,27.72-27.18,101.45,0,129.38,25.44,28.65,83.99,28.94,109.20,0Z"
    />
  </symbol>

  <!-- Pro Logo (small) -->
  <symbol id="pplx-logo-pro-small">
    <path
      fill="currentColor"
      d="M1068.23,126.49c-23.5-41.68-58.35-75.11-100.77-96.67C928.5,10.04,884.37,0,836.29,0H66.16C29.56,0-.08,29.71,0,66.3l1,463.16h109.72V107.9h78.16v24.37c0,2.66,3.19,3.99,5.1,2.13,20.89-20.25,50.62-30.5,88.64-30.5,26.8,0,51.2,6.11,72.52,18.17,21.44,12.13,38.59,30.51,50.96,54.66h0c12.27,23.95,18.49,53.6,18.49,88.14s-6.22,63.91-18.49,87.85c-12.37,24.14-29.52,42.53-50.96,54.66-21.33,12.06-45.73,18.17-72.52,18.17-16.55,0-55.7-2.68-87.27-25.54-1.98-1.43-4.75-.01-4.75,2.43v127.02h645.68c48.09,0,92.22-10.03,131.18-29.83,42.41-21.55,77.26-54.98,100.78-96.69,22.41-39.76,33.78-86.22,33.78-138.07s-11.37-98.6-33.79-138.39ZM650.3,177.46h-33.53c-23.25,0-40.37,6.1-50.86,18.14-10.7,12.27-16.12,32.09-16.12,58.91v164.71h-79.89V107.9h77.01v20.91c0,2.68,3.28,4.04,5.13,2.11,4.56-4.76,9.87-8.79,15.89-12.06,11.94-6.49,28.27-9.77,48.55-9.77h33.81v68.37ZM967.21,352.21c-13.66,24.23-33.03,42.83-57.56,55.29-24.32,12.36-52.71,18.62-84.38,18.62s-60.35-6.27-84.67-18.62c-24.54-12.46-43.9-31.07-57.56-55.29-13.58-24.09-20.47-53.47-20.47-87.34s6.89-63.54,20.47-87.63c13.65-24.22,33.02-42.82,57.56-55.29,24.33-12.36,52.81-18.62,84.67-18.62s60.06,6.27,84.38,18.62c24.53,12.47,43.9,31.07,57.56,55.29,13.58,24.1,20.47,53.58,20.47,87.63s-6.89,63.25-20.47,87.34Z"
    />
    <path
      fill="currentColor"
      d="M868.46,179.51c-12.16-7.28-26.7-10.97-43.2-10.97s-31.32,3.69-43.48,10.97c-12.07,7.23-21.57,18.05-28.23,32.16-6.79,14.4-10.23,32.3-10.23,53.2s3.45,38.57,10.24,53.07c6.66,14.2,16.19,25.06,28.35,32.28,12.26,7.29,26.85,10.98,43.36,10.98s31.04-3.69,43.2-10.97c12.07-7.23,21.56-18.09,28.22-32.29,6.79-14.5,10.24-32.35,10.24-53.07s-3.45-38.57-10.24-53.07c-6.66-14.2-16.15-25.07-28.22-32.29Z"
    />
    <path
      fill="currentColor"
      d="M221.1,351.54c12.26,7.29,26.85,10.98,43.36,10.98s31.04-3.69,43.2-10.97c12.07-7.23,21.56-18.09,28.22-32.29,6.79-14.5,10.24-32.35,10.24-53.07s-3.45-38.57-10.24-53.07c-6.66-14.2-16.15-25.06-28.22-32.29-12.16-7.28-26.7-10.97-43.19-10.97s-31.32,3.69-43.48,10.97c-12.07,7.23-21.57,18.05-28.23,32.16-6.79,14.4-10.23,32.3-10.23,53.2s3.45,38.57,10.24,53.07c6.66,14.2,16.19,25.06,28.35,32.28Z"
    />
  </symbol>

  <!-- Max Logo -->
  <symbol id="pplx-logo-max">
    <path
      fill="currentColor"
      d="M50.0858 22.3525C50.0858 23.9034 51.4144 24.8675 53.5527 24.8675C55.1684 24.8675 56.5468 24.3911 57.5393 23.4903C58.5991 22.5277 59.1595 21.1074 59.1595 19.3821V19.3262L53.1962 19.956C51.1311 20.147 50.0858 20.9534 50.0858 22.3525Z"
    />
    <path
      fill="currentColor"
      d="M96.7015 8.60077C95.1033 5.76707 92.7331 3.49361 89.8477 2.02806C87.198 0.682565 84.1956 0 80.925 0H4.46551C1.9767 0.000755049 -0.00527674 2.02051 1.0554e-05 4.5084V36H80.925C83.8489 36 86.556 35.4503 88.9904 34.3736L78.7837 21.1444H78.5571L72.8105 28.5922H67.2136V27.4883L75.0795 17.6697L67.2136 7.851V6.74712H72.8105L78.5571 14.1949H78.7837L84.5302 6.74712H90.1264V7.851L82.2612 17.6697L93.3728 31.5407C94.6878 30.3568 95.8171 28.9675 96.7023 27.3977C98.2266 24.6946 99 21.5355 99 18.0102C99 14.4849 98.2266 11.3054 96.7015 8.60077ZM40.5936 28.593H35.122V14.6268C35.122 13.5886 34.8214 12.7392 34.2518 12.1699C33.6612 11.5794 32.8009 11.2804 31.6951 11.2804C30.0009 11.2804 27.1586 11.926 27.1586 16.2517V28.593H21.687V14.6268C21.687 13.5886 21.3863 12.7392 20.8168 12.1699C20.2262 11.5794 19.3658 11.2804 18.26 11.2804C16.5658 11.2804 13.7228 11.926 13.7228 16.2517V28.593H8.29124V7.35569H13.5649V9.06814C13.5649 9.20934 13.7402 9.27276 13.8308 9.16479C14.25 8.66721 14.7236 8.2693 15.2788 7.94236C16.3883 7.29 17.8182 6.96005 19.5275 6.96005C21.2368 6.96005 22.8419 7.38212 24.0602 8.21418C24.9538 8.82426 25.5248 9.54835 25.8828 10.1554C25.938 10.2498 26.0739 10.2543 26.1358 10.1645C27.5997 8.0375 29.88 6.9608 32.9232 6.9608C35.1363 6.9608 37.0239 7.60184 38.3812 8.81445C39.8277 10.1063 40.5928 11.9932 40.5928 14.2704L40.5936 28.593ZM64.5518 28.593H59.2781V26.5407C59.2781 26.4033 59.1074 26.3361 59.016 26.4388C57.5076 28.1316 55.3406 28.9894 52.5625 28.9894C47.7344 28.9894 44.6149 26.5083 44.6149 22.6696C44.6149 20.7261 45.3718 19.1699 46.8658 18.0449C48.1733 17.0596 49.9838 16.4503 52.249 16.2321L59.1603 15.5148V14.8647C59.1603 12.2658 57.806 11.0033 55.0203 11.0033C53.1093 11.0033 50.6885 11.6119 50.366 14.5105L50.3282 14.8458H45.1097C45.1097 14.8458 45.0863 14.4154 45.1746 13.8129C45.7978 9.61102 49.7542 6.91927 55.0989 6.91927C60.93 6.91927 64.5525 10.0852 64.5525 15.181L64.5518 28.593Z"
    />
  </symbol>

  <!-- Word Enterprise Pro -->
  <symbol id="pplx-logo-word-ent-pro">
    <path
      style="fill: var(--logo-brand-fill, currentColor)"
      d="M602.964 18.07h3.899v8.053h-5.047c-3.955 0-6.904.953-8.86 2.866-1.944 1.906-2.92 5.044-2.92 9.404V64.8h-7.967V18.253h7.967v7.427c0 .42.21.626.619.626.233 0 .409-.058.534-.178.125-.122.232-.356.357-.719 1.534-4.889 5.348-7.336 11.423-7.336h-.005v-.005.001ZM684.483 18.07h3.899v8.053h-5.047c-3.955 0-6.904.953-8.86 2.866-1.944 1.906-2.92 5.044-2.92 9.404V64.8h-7.967V18.253h7.967v7.427c0 .42.21.626.619.626.233 0 .409-.058.534-.178.125-.122.232-.356.357-.719 1.534-4.889 5.348-7.336 11.423-7.336h-.005v-.005.001ZM655.961 28.046c-2.103-3.728-4.814-6.52-8.15-8.37-3.336-1.85-6.922-2.774-10.757-2.774-7.558 0-12.872 3.044-15.94 9.134-.239.482-.529.718-.887.718-.357 0-.534-.184-.534-.54v-7.968h-7.968v63.552h7.968V56.82c0-.363.182-.54.534-.54.352 0 .653.24.887.718 3.068 6.089 8.382 9.134 15.94 9.134 3.835 0 7.421-.925 10.757-2.775 3.336-1.85 6.052-4.64 8.15-8.369 2.096-3.728 3.142-8.221 3.142-13.471s-1.051-9.743-3.142-13.471Zm-9.202 26.315c-2.92 3.068-6.773 4.608-11.558 4.608-4.784 0-8.637-1.527-11.559-4.608-2.921-3.073-3.994-7.358-3.994-12.844s1.068-9.772 3.994-12.845c2.922-3.067 6.768-4.607 11.559-4.607 4.791 0 8.638 1.534 11.558 4.607 2.922 3.073 4.382 7.353 4.382 12.845 0 5.491-1.46 9.776-4.382 12.844ZM567.986 50.015l-.005-.012c-.949 2.81-2.438 4.998-4.472 6.583-2.035 1.585-4.978 2.372-8.815 2.372-4.722 0-8.49-1.372-11.292-4.119-2.802-2.74-4.359-6.444-4.648-11.099h36.745V38.37c0-3.878-.808-7.44-2.432-10.697-1.625-3.245-4.068-5.859-7.347-7.83-3.274-1.964-7.189-2.953-11.911-2.953-4.721 0-8.836 1-12.349 3-3.511 1.998-6.244 4.847-8.188 8.547-1.944 3.7-2.921 8.053-2.921 13.069 0 5.015 1 9.369 3.012 13.069 2.013 3.704 4.86 6.549 8.548 8.548 3.688 2 7.95 2.998 12.791 2.998 6.438 0 11.383-1.59 14.837-4.785 3.45-3.188 5.739-6.962 6.859-11.322h-8.411l-.001.002Zm-24.573-22.6c2.626-2.24 6.007-3.36 10.138-3.36 4.427 0 7.672 1.155 9.741 3.447 2.069 2.297 3.102 5.48 3.102 9.536h-27.805c.591-4.176 2.199-7.388 4.824-9.622ZM443.533 50.015l-.005-.012c-.949 2.81-2.438 4.998-4.472 6.583-2.034 1.585-4.978 2.372-8.814 2.372-4.723 0-8.491-1.372-11.293-4.119-2.802-2.74-4.359-6.444-4.648-11.099h36.745V38.37c0-3.878-.807-7.44-2.431-10.697-1.626-3.245-4.069-5.859-7.348-7.83-3.274-1.964-7.189-2.953-11.91-2.953-4.722 0-8.837 1-12.349 3-3.512 1.998-6.245 4.847-8.189 8.547s-2.92 8.053-2.92 13.069c0 5.015.999 9.369 3.012 13.069 2.012 3.704 4.859 6.549 8.547 8.548 3.688 2 7.95 2.998 12.791 2.998 6.439 0 11.383-1.59 14.838-4.785 3.449-3.188 5.739-6.962 6.858-11.322h-8.41l-.002.002Zm-24.572-22.6c2.625-2.24 6.006-3.36 10.138-3.36 4.427 0 7.671 1.155 9.74 3.447 2.069 2.297 3.103 5.48 3.103 9.536h-27.806c.591-4.176 2.2-7.388 4.825-9.622ZM788.588 50.015l-.005-.012c-.95 2.81-2.438 4.998-4.473 6.583-2.034 1.585-4.978 2.372-8.814 2.372-4.723 0-8.491-1.372-11.292-4.119-2.802-2.74-4.359-6.444-4.648-11.099h36.745V38.37c0-3.878-.808-7.44-2.432-10.697-1.625-3.245-4.069-5.859-7.348-7.83-3.274-1.964-7.189-2.953-11.91-2.953s-8.836 1-12.349 3c-3.511 1.998-6.245 4.847-8.189 8.547s-2.92 8.053-2.92 13.069c0 5.015 1 9.369 3.012 13.069 2.012 3.704 4.859 6.549 8.547 8.548 3.688 2 7.95 2.998 12.792 2.998 6.438 0 11.382-1.59 14.837-4.785 3.449-3.188 5.739-6.962 6.859-11.322h-8.411l-.001.002Zm-24.573-22.6c2.625-2.24 6.006-3.36 10.138-3.36 4.427 0 7.671 1.155 9.741 3.447 2.069 2.297 3.102 5.48 3.102 9.536h-27.805c.59-4.176 2.199-7.388 4.824-9.622ZM520.476 57.857c-1.447.15-2.323.224-2.61.224-.411 0-.747-.12-.978-.362-.235-.236-.358-.563-.358-.988 0-.293.076-1.178.227-2.642.141-1.459.221-3.716.221-6.756V25.062h11.099v-6.819h-11.095V5.708h-7.964v12.53h-8.669v6.819h8.669v24.505c0 5.136 1.244 8.957 3.719 11.46 2.478 2.506 6.257 3.763 11.34 3.763h6.198v-7.158h-3.102c-3.011 0-5.242.075-6.689.225l-.008.006v-.001ZM701.809 3.087H692.5v10.076h9.309V3.087ZM701.319 18.245h-7.972v46.543h7.972V18.245ZM498.872 36.41V64.8h-7.861V37.72c0-8.299-4.281-12.665-12.229-12.665-8.997 0-13.976 5.415-13.976 16.16V64.8h-7.861V19.379h7.861v5.065c0 .438.174.612.611.612.438 0 .874-.7.962-.786 3.057-4.104 7.773-6.202 14.15-6.202 11.443 0 18.344 6.726 18.344 18.343h-.001ZM747.71 33.002h-8.503c-.448-5.997-4.654-8.95-12.531-8.95-6.803 0-10.742 2.953-10.742 6.98 0 3.491 2.328 4.566 8.504 5.909l8.503 1.79c9.22 1.88 14.322 4.834 14.322 12.621 0 8.593-7.886 14.77-19.701 14.77-14.232 0-19.979-6.982-21.501-17.455h8.504c1.163 6.892 4.526 10.294 13.387 10.294 7.787 0 11.255-3.223 11.255-7.161 0-2.595-1.432-3.85-3.849-4.565-1.164-.359-3.223-.806-5.998-1.432l-8.503-1.79c-8.235-1.7-12.978-5.282-12.978-12.801 0-4.386 1.79-7.877 5.37-10.473 3.581-2.596 8.235-3.85 13.873-3.85 11.637 0 20.23 6.356 20.588 16.112v.002Z"
    />
    <path
      fill="currentColor"
      d="M125.928 17.801h3.916v8.087h-5.069c-3.971 0-6.932.957-8.896 2.878-1.952 1.914-2.932 5.064-2.932 9.442v26.516h-8V17.985h8v7.458c0 .421.211.628.622.628.234 0 .41-.058.536-.178.126-.122.233-.358.359-.722 1.54-4.909 5.37-7.366 11.469-7.366h-.005V17.8v.001Zm53.217 10.02c2.099 3.742 3.155 8.254 3.155 13.526 0 5.271-1.051 9.783-3.155 13.526-2.106 3.744-4.834 6.547-8.184 8.404-3.35 1.858-6.95 2.786-10.801 2.786-7.589 0-12.925-3.057-16.006-9.172-.234-.479-.536-.721-.89-.721-.353 0-.536.179-.536.543v25.08h-8.001V17.98h8.001v8c0 .358.176.543.536.543.36 0 .65-.236.89-.721 3.081-6.114 8.417-9.172 16.006-9.172 3.851 0 7.451.929 10.801 2.786 3.35 1.858 6.072 4.66 8.184 8.404Zm-4.84 13.526c0-5.514-1.466-9.812-4.4-12.897-2.932-3.087-6.795-4.627-11.605-4.627-4.811 0-8.673 1.545-11.607 4.627-2.938 3.085-4.01 7.388-4.01 12.897 0 5.508 1.077 9.811 4.01 12.897 2.934 3.092 6.801 4.627 11.607 4.627 4.805 0 8.673-1.546 11.605-4.627 2.934-3.08 4.4-7.389 4.4-12.897ZM44.411 27.889c2.1 3.743 3.155 8.255 3.155 13.526 0 5.272-1.05 9.784-3.155 13.527-2.106 3.743-4.833 6.548-8.182 8.404-3.35 1.857-6.95 2.786-10.801 2.786-7.59 0-12.925-3.057-16.006-9.172-.233-.48-.536-.721-.89-.721s-.536.178-.536.541v25.08H0V18.05h8v8c0 .357.176.542.536.542.36 0 .65-.237.89-.722 3.081-6.113 8.416-9.171 16.005-9.171 3.853 0 7.452.928 10.802 2.786 3.35 1.857 6.07 4.66 8.182 8.403h-.006l.002.002Zm-4.846 13.526c0-5.514-1.466-9.811-4.398-12.897-2.934-3.08-6.802-4.627-11.607-4.627-4.806 0-8.673 1.546-11.606 4.627-2.932 3.092-4.011 7.39-4.011 12.897 0 5.508 1.079 9.812 4.011 12.899 2.933 3.092 6.796 4.625 11.606 4.625s8.673-1.545 11.607-4.625c2.932-3.08 4.398-7.39 4.398-12.899Zm51.243 8.462h8.445c-1.124 4.378-3.423 8.167-6.887 11.37-3.47 3.206-8.433 4.805-14.898 4.805-4.861 0-9.14-1.004-12.844-3.012-3.703-2.008-6.562-4.862-8.582-8.582-2.02-3.715-3.025-8.087-3.025-13.123s.982-9.408 2.932-13.123c1.953-3.714 4.697-6.576 8.223-8.582 3.527-2.008 7.658-3.011 12.4-3.011s8.673.992 11.959 2.964c3.292 1.978 5.746 4.604 7.378 7.863 1.632 3.27 2.441 6.847 2.441 10.74v5.394H61.454c.29 4.672 1.855 8.393 4.667 11.144 2.814 2.758 6.596 4.136 11.34 4.136 3.85 0 6.806-.79 8.85-2.382 2.042-1.592 3.537-3.79 4.49-6.61l.006.012.001-.003ZM61.29 36.847h27.92c0-4.072-1.04-7.268-3.115-9.575-2.077-2.302-5.336-3.46-9.781-3.46-4.149 0-7.544 1.123-10.18 3.373-2.636 2.244-4.25 5.47-4.844 9.662Zm127.463 27.867h8.006V0h-8.006v64.719-.005Zm112.513-51.839h9.348V2.758h-9.348v10.117Zm34.515 44.876c-1.453.15-2.333.226-2.621.226-.412 0-.75-.12-.982-.364-.236-.237-.359-.565-.359-.992 0-.294.076-1.183.228-2.653.141-1.465.221-3.732.221-6.784V24.823h11.412l-2.249-6.847h-9.159V5.387h-7.997v12.581h-8.704v6.847h8.704v24.607c0 5.156 1.25 8.993 3.735 11.507 2.488 2.515 6.283 3.778 11.386 3.778h6.224V57.52h-3.115c-3.023 0-5.263.075-6.716.225l-.008.006Zm48.361-39.783-13.25 39.224c-.175.484-.457 1.114-1.361 1.114-.904 0-1.193-.628-1.373-1.114l-13.249-39.217h-8.159l15.344 46.74h5.427c.352 0 .623.035.805.092.177.058.324.207.445.45.232.357.203.9-.092 1.614l-2.489 6.83c-.358.9-1.038 1.35-2.041 1.35-.359 0-1.186-.075-2.489-.225-1.306-.15-2.989-.224-5.065-.224h-6.494v7.186h8.535c4.981 0 7.977-.854 10.557-2.56 2.58-1.708 4.576-4.72 6.001-9.033l16.572-50.425v-1.8l-7.614.006-.01-.007ZM274.187 35.41l-12.538-17.437h-8.803v1.794l15.023 20.223-18.318 22.923v1.794h8.982l14.584-18.787 13.604 18.787h8.628v-1.794L279.428 41.34l17.258-21.48v-1.887h-8.983L274.191 35.41h-.004Zm27.93 29.304h8.005V17.98h-8.005v46.739-.005Zm-52.675-14.837c-1.13 4.378-3.421 8.167-6.884 11.37-3.472 3.206-8.435 4.805-14.901 4.805-4.86 0-9.141-1.004-12.844-3.012-3.71-2.008-6.561-4.862-8.582-8.582-2.014-3.715-3.019-8.087-3.019-13.123s.982-9.408 2.934-13.123c1.958-3.714 4.697-6.576 8.224-8.582 3.523-2.008 7.655-3.011 12.403-3.011 4.749 0 8.673.992 11.965 2.964 3.287 1.978 5.748 4.604 7.378 7.863 1.633 3.27 2.443 6.847 2.443 10.74v5.394h-36.9c.296 4.672 1.852 8.393 4.668 11.144 2.812 2.758 6.595 4.136 11.337 4.136 3.851 0 6.808-.79 8.85-2.382 2.041-1.592 3.537-3.79 4.484-6.61h8.45l-.006.012v-.003Zm-37.761-13.03H239.6c0-4.072-1.038-7.268-3.108-9.575-2.08-2.302-5.335-3.46-9.782-3.46-4.15 0-7.543 1.123-10.18 3.373-2.636 2.244-4.255 5.47-4.843 9.662h-.006Z"
    />
  </symbol>

  <!-- Word Enterprise Max -->
  <symbol id="pplx-logo-word-ent-max">
    <path
      style="fill: var(--logo-brand-fill, currentColor)"
      d="M602.964 18.07h3.899v8.053h-5.047c-3.955 0-6.904.953-8.86 2.866-1.944 1.906-2.92 5.044-2.92 9.404V64.8h-7.967V18.253h7.967v7.427c0 .42.21.626.619.626.233 0 .409-.058.534-.178.125-.122.232-.356.357-.719 1.534-4.889 5.348-7.336 11.423-7.336h-.005v-.005.001ZM684.483 18.07h3.899v8.053h-5.047c-3.955 0-6.904.953-8.86 2.866-1.944 1.906-2.92 5.044-2.92 9.404V64.8h-7.967V18.253h7.967v7.427c0 .42.21.626.619.626.233 0 .409-.058.534-.178.125-.122.232-.356.357-.719 1.534-4.889 5.348-7.336 11.423-7.336h-.005v-.005.001ZM655.961 28.046c-2.103-3.728-4.814-6.52-8.15-8.37-3.336-1.85-6.922-2.774-10.757-2.774-7.558 0-12.872 3.044-15.94 9.134-.239.482-.529.718-.887.718-.357 0-.534-.184-.534-.54v-7.968h-7.968v63.552h7.968V56.82c0-.363.182-.54.534-.54.352 0 .653.24.887.718 3.068 6.089 8.382 9.134 15.94 9.134 3.835 0 7.421-.925 10.757-2.775 3.336-1.85 6.052-4.64 8.15-8.369 2.096-3.728 3.142-8.221 3.142-13.471s-1.051-9.743-3.142-13.471Zm-9.202 26.315c-2.92 3.068-6.773 4.608-11.558 4.608-4.784 0-8.637-1.527-11.559-4.608-2.921-3.073-3.994-7.358-3.994-12.844s1.068-9.772 3.994-12.845c2.922-3.067 6.768-4.607 11.559-4.607 4.791 0 8.638 1.534 11.558 4.607 2.922 3.073 4.382 7.353 4.382 12.845 0 5.491-1.46 9.776-4.382 12.844ZM567.986 50.015l-.005-.012c-.949 2.81-2.438 4.998-4.472 6.583-2.035 1.585-4.978 2.372-8.815 2.372-4.722 0-8.49-1.372-11.292-4.119-2.802-2.74-4.359-6.444-4.648-11.099h36.745V38.37c0-3.878-.808-7.44-2.432-10.697-1.625-3.245-4.068-5.859-7.347-7.83-3.274-1.964-7.189-2.953-11.911-2.953-4.721 0-8.836 1-12.349 3-3.511 1.998-6.244 4.847-8.188 8.547-1.944 3.7-2.921 8.053-2.921 13.069 0 5.015 1 9.369 3.012 13.069 2.013 3.704 4.86 6.549 8.548 8.548 3.688 2 7.95 2.998 12.791 2.998 6.438 0 11.383-1.59 14.837-4.785 3.45-3.188 5.739-6.962 6.859-11.322h-8.411l-.001.002Zm-24.573-22.6c2.626-2.24 6.007-3.36 10.138-3.36 4.427 0 7.672 1.155 9.741 3.447 2.069 2.297 3.102 5.48 3.102 9.536h-27.805c.591-4.176 2.199-7.388 4.824-9.622ZM443.533 50.015l-.005-.012c-.949 2.81-2.438 4.998-4.472 6.583-2.034 1.585-4.978 2.372-8.814 2.372-4.723 0-8.491-1.372-11.293-4.119-2.802-2.74-4.359-6.444-4.648-11.099h36.745V38.37c0-3.878-.807-7.44-2.431-10.697-1.626-3.245-4.069-5.859-7.348-7.83-3.274-1.964-7.189-2.953-11.91-2.953-4.722 0-8.837 1-12.349 3-3.512 1.998-6.245 4.847-8.189 8.547s-2.92 8.053-2.92 13.069c0 5.015.999 9.369 3.012 13.069 2.012 3.704 4.859 6.549 8.547 8.548 3.688 2 7.95 2.998 12.791 2.998 6.439 0 11.383-1.59 14.838-4.785 3.449-3.188 5.739-6.962 6.858-11.322h-8.41l-.002.002Zm-24.572-22.6c2.625-2.24 6.006-3.36 10.138-3.36 4.427 0 7.671 1.155 9.74 3.447 2.069 2.297 3.103 5.48 3.103 9.536h-27.806c.591-4.176 2.2-7.388 4.825-9.622ZM788.588 50.015l-.005-.012c-.95 2.81-2.438 4.998-4.473 6.583-2.034 1.585-4.978 2.372-8.814 2.372-4.723 0-8.491-1.372-11.292-4.119-2.802-2.74-4.359-6.444-4.648-11.099h36.745V38.37c0-3.878-.808-7.44-2.432-10.697-1.625-3.245-4.069-5.859-7.348-7.83-3.274-1.964-7.189-2.953-11.91-2.953s-8.836 1-12.349 3c-3.511 1.998-6.245 4.847-8.189 8.547s-2.92 8.053-2.92 13.069c0 5.015 1 9.369 3.012 13.069 2.012 3.704 4.859 6.549 8.547 8.548 3.688 2 7.95 2.998 12.792 2.998 6.438 0 11.382-1.59 14.837-4.785 3.449-3.188 5.739-6.962 6.859-11.322h-8.411l-.001.002Zm-24.573-22.6c2.625-2.24 6.006-3.36 10.138-3.36 4.427 0 7.671 1.155 9.741 3.447 2.069 2.297 3.102 5.48 3.102 9.536h-27.805c.59-4.176 2.199-7.388 4.824-9.622ZM520.476 57.857c-1.447.15-2.323.224-2.61.224-.411 0-.747-.12-.978-.362-.235-.236-.358-.563-.358-.988 0-.293.076-1.178.227-2.642.141-1.459.221-3.716.221-6.756V25.062h11.099v-6.819h-11.095V5.708h-7.964v12.53h-8.669v6.819h8.669v24.505c0 5.136 1.244 8.957 3.719 11.46 2.478 2.506 6.257 3.763 11.34 3.763h6.198v-7.158h-3.102c-3.011 0-5.242.075-6.689.225l-.008.006v-.001ZM701.809 3.087H692.5v10.076h9.309V3.087ZM701.319 18.245h-7.972v46.543h7.972V18.245ZM498.872 36.41V64.8h-7.861V37.72c0-8.299-4.281-12.665-12.229-12.665-8.997 0-13.976 5.415-13.976 16.16V64.8h-7.861V19.379h7.861v5.065c0 .438.174.612.611.612.438 0 .874-.7.962-.786 3.057-4.104 7.773-6.202 14.15-6.202 11.443 0 18.344 6.726 18.344 18.343h-.001ZM747.71 33.002h-8.503c-.448-5.997-4.654-8.95-12.531-8.95-6.803 0-10.742 2.953-10.742 6.98 0 3.491 2.328 4.566 8.504 5.909l8.503 1.79c9.22 1.88 14.322 4.834 14.322 12.621 0 8.593-7.886 14.77-19.701 14.77-14.232 0-19.979-6.982-21.501-17.455h8.504c1.163 6.892 4.526 10.294 13.387 10.294 7.787 0 11.255-3.223 11.255-7.161 0-2.595-1.432-3.85-3.849-4.565-1.164-.359-3.223-.806-5.998-1.432l-8.503-1.79c-8.235-1.7-12.978-5.282-12.978-12.801 0-4.386 1.79-7.877 5.37-10.473 3.581-2.596 8.235-3.85 13.873-3.85 11.637 0 20.23 6.356 20.588 16.112v.002Z"
    />
    <path
      fill="currentColor"
      d="M125.928 17.801h3.916v8.087h-5.069c-3.971 0-6.932.957-8.896 2.878-1.952 1.914-2.932 5.064-2.932 9.442v26.516h-8V17.985h8v7.458c0 .421.211.628.622.628.234 0 .41-.058.536-.178.126-.122.233-.358.359-.722 1.54-4.909 5.37-7.366 11.469-7.366h-.005V17.8v.001Zm53.217 10.02c2.099 3.742 3.155 8.254 3.155 13.526 0 5.271-1.051 9.783-3.155 13.526-2.106 3.744-4.834 6.547-8.184 8.404-3.35 1.858-6.95 2.786-10.801 2.786-7.589 0-12.925-3.057-16.006-9.172-.234-.479-.536-.721-.89-.721-.353 0-.536.179-.536.543v25.08h-8.001V17.98h8.001v8c0 .358.176.543.536.543.36 0 .65-.236.89-.721 3.081-6.114 8.417-9.172 16.006-9.172 3.851 0 7.451.929 10.801 2.786 3.35 1.858 6.072 4.66 8.184 8.404Zm-4.84 13.526c0-5.514-1.466-9.812-4.4-12.897-2.932-3.087-6.795-4.627-11.605-4.627-4.811 0-8.673 1.545-11.607 4.627-2.938 3.085-4.01 7.388-4.01 12.897 0 5.508 1.077 9.811 4.01 12.897 2.934 3.092 6.801 4.627 11.607 4.627 4.805 0 8.673-1.546 11.605-4.627 2.934-3.08 4.4-7.389 4.4-12.897ZM44.411 27.889c2.1 3.743 3.155 8.255 3.155 13.526 0 5.272-1.05 9.784-3.155 13.527-2.106 3.743-4.833 6.548-8.182 8.404-3.35 1.857-6.95 2.786-10.801 2.786-7.59 0-12.925-3.057-16.006-9.172-.233-.48-.536-.721-.89-.721s-.536.178-.536.541v25.08H0V18.05h8v8c0 .357.176.542.536.542.36 0 .65-.237.89-.722 3.081-6.113 8.416-9.171 16.005-9.171 3.853 0 7.452.928 10.802 2.786 3.35 1.857 6.07 4.66 8.182 8.403h-.006l.002.002Zm-4.846 13.526c0-5.514-1.466-9.811-4.398-12.897-2.934-3.08-6.802-4.627-11.607-4.627-4.806 0-8.673 1.546-11.606 4.627-2.932 3.092-4.011 7.39-4.011 12.897 0 5.508 1.079 9.812 4.011 12.899 2.933 3.092 6.796 4.625 11.606 4.625s8.673-1.545 11.607-4.625c2.932-3.08 4.398-7.39 4.398-12.899Zm51.243 8.462h8.445c-1.124 4.378-3.423 8.167-6.887 11.37-3.47 3.206-8.433 4.805-14.898 4.805-4.861 0-9.14-1.004-12.844-3.012-3.703-2.008-6.562-4.862-8.582-8.582-2.02-3.715-3.025-8.087-3.025-13.123s.982-9.408 2.932-13.123c1.953-3.714 4.697-6.576 8.223-8.582 3.527-2.008 7.658-3.011 12.4-3.011s8.673.992 11.959 2.964c3.292 1.978 5.746 4.604 7.378 7.863 1.632 3.27 2.441 6.847 2.441 10.74v5.394H61.454c.29 4.672 1.855 8.393 4.667 11.144 2.814 2.758 6.596 4.136 11.34 4.136 3.85 0 6.806-.79 8.85-2.382 2.042-1.592 3.537-3.79 4.49-6.61l.006.012.001-.003ZM61.29 36.847h27.92c0-4.072-1.04-7.268-3.115-9.575-2.077-2.302-5.336-3.46-9.781-3.46-4.149 0-7.544 1.123-10.18 3.373-2.636 2.244-4.25 5.47-4.844 9.662Zm127.463 27.867h8.006V0h-8.006v64.719-.005Zm112.513-51.839h9.348V2.758h-9.348v10.117Zm34.515 44.876c-1.453.15-2.333.226-2.621.226-.412 0-.75-.12-.982-.364-.236-.237-.359-.565-.359-.992 0-.294.076-1.183.228-2.653.141-1.465.221-3.732.221-6.784V24.823h11.412l-2.249-6.847h-9.159V5.387h-7.997v12.581h-8.704v6.847h8.704v24.607c0 5.156 1.25 8.993 3.735 11.507 2.488 2.515 6.283 3.778 11.386 3.778h6.224V57.52h-3.115c-3.023 0-5.263.075-6.716.225l-.008.006Zm48.361-39.783-13.25 39.224c-.175.484-.457 1.114-1.361 1.114-.904 0-1.193-.628-1.373-1.114l-13.249-39.217h-8.159l15.344 46.74h5.427c.352 0 .623.035.805.092.177.058.324.207.445.45.232.357.203.9-.092 1.614l-2.489 6.83c-.358.9-1.038 1.35-2.041 1.35-.359 0-1.186-.075-2.489-.225-1.306-.15-2.989-.224-5.065-.224h-6.494v7.186h8.535c4.981 0 7.977-.854 10.557-2.56 2.58-1.708 4.576-4.72 6.001-9.033l16.572-50.425v-1.8l-7.614.006-.01-.007ZM274.187 35.41l-12.538-17.437h-8.803v1.794l15.023 20.223-18.318 22.923v1.794h8.982l14.584-18.787 13.604 18.787h8.628v-1.794L279.428 41.34l17.258-21.48v-1.887h-8.983L274.191 35.41h-.004Zm27.93 29.304h8.005V17.98h-8.005v46.739-.005Zm-52.675-14.837c-1.13 4.378-3.421 8.167-6.884 11.37-3.472 3.206-8.435 4.805-14.901 4.805-4.86 0-9.141-1.004-12.844-3.012-3.71-2.008-6.561-4.862-8.582-8.582-2.014-3.715-3.019-8.087-3.019-13.123s.982-9.408 2.934-13.123c1.958-3.714 4.697-6.576 8.224-8.582 3.523-2.008 7.655-3.011 12.403-3.011 4.749 0 8.673.992 11.965 2.964 3.287 1.978 5.748 4.604 7.378 7.863 1.633 3.27 2.443 6.847 2.443 10.74v5.394h-36.9c.296 4.672 1.852 8.393 4.668 11.144 2.812 2.758 6.595 4.136 11.337 4.136 3.851 0 6.808-.79 8.85-2.382 2.041-1.592 3.537-3.79 4.484-6.61h8.45l-.006.012v-.003Zm-37.761-13.03H239.6c0-4.072-1.038-7.268-3.108-9.575-2.08-2.302-5.335-3.46-9.782-3.46-4.15 0-7.543 1.123-10.18 3.373-2.636 2.244-4.255 5.47-4.843 9.662h-.006Z"
    />
  </symbol>

  <!-- Word Pro -->
  <symbol id="pplx-logo-word-pro">
    <path
      fill="currentColor"
      d="M972.21,137.43h30.23v62.43h-39.13c-30.66,0-53.52,7.39-68.68,22.22-15.07,14.78-22.64,39.1-22.64,72.9v204.71h-61.76V138.85h61.76v57.58c0,3.25,1.63,4.85,4.8,4.85,1.81,0,3.17-.45,4.14-1.38.97-.94,1.8-2.76,2.77-5.57,11.89-37.9,41.46-56.87,88.55-56.87h-.04v-.04ZM1383.06,214.78c16.21,28.9,24.36,63.73,24.36,104.43s-8.11,75.53-24.36,104.43c-16.26,28.9-37.32,50.54-63.18,64.88-25.86,14.34-53.66,21.51-83.39,21.51-58.59,0-99.78-23.6-123.57-70.81-1.81-3.7-4.14-5.57-6.87-5.57s-4.14,1.38-4.14,4.19v193.63h-61.77V138.81h61.77v61.77c0,2.76,1.36,4.19,4.14,4.19s5.02-1.83,6.87-5.57c23.79-47.2,64.98-70.81,123.57-70.81,29.73,0,57.53,7.17,83.39,21.51,25.86,14.34,46.88,35.98,63.18,64.88ZM1345.7,319.21c0-42.57-11.32-75.75-33.97-99.57-22.64-23.83-52.46-35.72-89.6-35.72s-66.96,11.93-89.61,35.72c-22.68,23.82-30.96,57.04-30.96,99.57s8.32,75.75,30.96,99.57c22.65,23.87,52.51,35.72,89.61,35.72s66.96-11.93,89.6-35.72c22.65-23.78,33.97-57.04,33.97-99.57ZM342.87,215.31c16.21,28.9,24.36,63.73,24.36,104.43s-8.11,75.53-24.36,104.43c-16.26,28.9-37.31,50.55-63.17,64.88-25.86,14.34-53.66,21.51-83.39,21.51-58.59,0-99.78-23.6-123.57-70.81-1.8-3.7-4.14-5.57-6.87-5.57s-4.14,1.38-4.14,4.18v193.63H0V139.34h61.76v61.76c0,2.76,1.36,4.19,4.14,4.19s5.02-1.83,6.87-5.57c23.79-47.2,64.98-70.81,123.57-70.81,29.74,0,57.53,7.17,83.39,21.51,25.86,14.34,46.87,35.98,63.17,64.88h-.05ZM305.46,319.74c0-42.57-11.32-75.75-33.96-99.57-22.65-23.78-52.51-35.72-89.61-35.72s-66.96,11.93-89.6,35.72c-22.64,23.87-30.97,57.05-30.97,99.57s8.33,75.75,30.97,99.58c22.64,23.87,52.47,35.71,89.6,35.71s66.96-11.93,89.61-35.71c22.64-23.78,33.96-57.05,33.96-99.58ZM701.07,385.07h65.2c-8.68,33.8-26.43,63.05-53.17,87.77-26.79,24.76-65.11,37.1-115.02,37.1-37.53,0-70.57-7.75-99.16-23.25-28.59-15.5-50.66-37.54-66.26-66.26-15.59-28.68-23.35-62.43-23.35-101.31s7.58-72.63,22.64-101.31c15.07-28.68,36.26-50.77,63.48-66.26,27.23-15.5,59.12-23.25,95.73-23.25s66.96,7.66,92.33,22.89c25.42,15.27,44.36,35.54,56.96,60.7,12.6,25.25,18.85,52.86,18.85,82.92v41.64h-284.85c2.24,36.07,14.32,64.8,36.03,86.04,21.72,21.29,50.92,31.93,87.54,31.93,29.73,0,52.55-6.1,68.33-18.39,15.77-12.29,27.31-29.26,34.67-51.03l.04.09ZM473.18,284.47h215.55c0-31.44-8.02-56.11-24.05-73.92-16.03-17.77-41.19-26.72-75.51-26.72-32.03,0-58.24,8.68-78.59,26.05-20.35,17.32-32.82,42.22-37.4,74.59ZM1457.24,499.61h61.81V0h-61.81v499.65-.04ZM2325.88,99.4h72.17V21.24h-72.17v78.15ZM2592.35,445.86c-11.22,1.16-18.01,1.74-20.24,1.74-3.18,0-5.79-.93-7.58-2.81-1.82-1.83-2.77-4.36-2.77-7.66,0-2.27.59-9.13,1.76-20.48,1.09-11.31,1.71-28.81,1.71-52.37v-172.65h88.1l-17.36-52.86h-70.71V41.59h-61.74v97.13h-67.2v52.86h67.2v189.97c0,39.81,9.65,69.43,28.83,88.84,19.21,19.42,48.51,29.17,87.91,29.17h48.05v-55.49h-24.05c-23.34,0-40.63.58-51.85,1.74l-.06.05ZM2965.71,138.76l-102.29,302.77c-1.35,3.74-3.53,8.6-10.51,8.6s-9.21-4.85-10.6-8.6l-102.29-302.77h-62.99l118.46,360.85h41.9c2.72,0,4.81.27,6.22.71,1.36.45,2.5,1.6,3.43,3.47,1.79,2.76,1.57,6.95-.71,12.47l-19.21,52.73c-2.77,6.95-8.02,10.42-15.76,10.42-2.77,0-9.16-.58-19.22-1.74-10.08-1.16-23.07-1.73-39.1-1.73h-50.14v55.48h65.9c38.45,0,61.58-6.59,81.5-19.77,19.92-13.18,35.33-36.43,46.33-69.73l127.94-389.3v-13.85h-58.86ZM2116.82,273.38l-96.8-134.62h-67.96v13.85l115.98,156.13-141.42,176.97v13.85h69.35l112.59-145.04,105.03,145.04h66.61v-13.85l-122.92-166.55,133.24-165.84v-14.56h-69.35l-104.32,134.62h-.03ZM2332.45,499.61h61.8V138.81h-61.8v360.84-.04ZM1925.78,385.07c-8.72,33.8-26.41,63.05-53.15,87.77-26.8,24.76-65.12,37.1-115.04,37.1-37.52,0-70.57-7.75-99.16-23.25-28.64-15.5-50.65-37.54-66.25-66.26-15.55-28.68-23.31-62.43-23.31-101.31s7.58-72.63,22.65-101.31c15.12-28.68,36.26-50.77,63.49-66.26,27.2-15.5,59.1-23.25,95.76-23.25s66.96,7.66,92.37,22.89c25.38,15.27,44.38,35.54,56.96,60.7,12.61,25.25,18.86,52.86,18.86,82.92v41.64h-284.88c2.29,36.07,14.3,64.8,36.04,86.04,21.71,21.29,50.92,31.93,87.53,31.93,29.73,0,52.56-6.1,68.32-18.39,15.76-12.29,27.31-29.26,34.62-51.03h65.24l-.05.09ZM1634.25,284.47h215.55c0-31.44-8.02-56.11-24-73.92-16.06-17.77-41.19-26.72-75.52-26.72-32.04,0-58.23,8.68-78.59,26.05-20.35,17.32-32.85,42.22-37.39,74.59h-.05Z"
    />
    <g>
      <path
        style="fill: var(--logo-brand-fill, currentColor)"
        d="M3355.84,188.2c-34.07-64.39-131.07-79.63-178.65-27.45-1.45,1.53-4.03.51-4.03-1.6v-20.46s-51.68,0-51.68,0v360.92h51.68v-137.9c0-2.11,2.57-3.13,4.03-1.6,17.98,18.93,43.42,31.52,75.79,31.52,72.2.47,121.88-58.16,120.25-131.21,0-28.27-5.85-52.57-17.39-72.23ZM3321.56,260.43c0,26.4-7.05,50.24-20.94,64.92h0c-25.21,28.94-83.76,28.65-109.2,0-27.18-27.93-27.44-101.65,0-129.38,25.44-29.25,83.94-29.55,109.17-.04,13.94,14.4,20.97,38.06,20.98,64.5Z"
      />
      <path
        style="fill: var(--logo-brand-fill, currentColor)"
        d="M3678.1,499.61h-438.05v-48.22h438.05c33.41,0,64.39-7.45,92.07-22.16,29.4-15.46,53.58-39.15,70.02-68.56l.08-.14c16.31-28.72,24.58-62.4,24.58-100.11s-8.26-71.36-24.56-100.07l-.08-.13c-16.46-29.43-40.64-53.13-69.93-68.54-27.79-14.76-58.78-22.22-92.19-22.22h-555.91V21.24h555.91c41.39,0,79.99,9.36,114.73,27.81,37.45,19.7,68.41,49.99,89.43,87.55,20.45,36.05,30.82,77.7,30.82,123.82s-10.38,87.81-30.84,123.86c-21,37.53-51.96,67.81-89.53,87.57-34.63,18.4-73.22,27.75-114.61,27.75Z"
      />
      <path
        style="fill: var(--logo-brand-fill, currentColor)"
        d="M3784.19,189.62c-42.92-80.72-177.41-80.62-220.65.03-10.91,19.63-16.45,43.44-16.45,70.78-1.52,77.12,51.01,131.73,127,131.21,75.9.53,128.27-54.63,127-131.21,0-27.33-5.69-51.15-16.91-70.8ZM3749.42,260.43c0,26.4-7.05,50.24-20.94,64.92h0c-25.21,28.94-83.76,28.65-109.2,0-27.17-27.93-27.44-101.65,0-129.38,25.44-29.25,83.94-29.55,109.17-.04,13.94,14.4,20.97,38.06,20.98,64.5Z"
      />
      <path
        style="fill: var(--logo-brand-fill, currentColor)"
        d="M3515.38,135.16c-16.77,0-30.24,2.85-40.05,8.48-5.78,3.15-11.11,8.68-16.12,16.74-1.24,2-4.32,1.13-4.32-1.22v-20.46s-51.67,0-51.67,0v246.1h51.67v-140.34c0-20.57,4.43-35.36,13.17-43.97,16.17-16.75,48.45-12.5,72.26-13v-52.31h-24.94Z"
      />
    </g>
  </symbol>

  <!-- Word Max -->
  <symbol id="pplx-logo-word-max">
    <path
      fill="currentColor"
      d="M972.21,137.43h30.23v62.43h-39.13c-30.66,0-53.52,7.39-68.68,22.22-15.07,14.78-22.64,39.1-22.64,72.9v204.71h-61.76V138.85h61.76v57.58c0,3.25,1.63,4.85,4.8,4.85,1.81,0,3.17-.45,4.14-1.38.97-.94,1.8-2.76,2.77-5.57,11.89-37.9,41.46-56.87,88.55-56.87h-.04v-.04ZM1383.06,214.78c16.21,28.9,24.36,63.73,24.36,104.43s-8.11,75.53-24.36,104.43c-16.26,28.9-37.32,50.54-63.18,64.88-25.86,14.34-53.66,21.51-83.39,21.51-58.59,0-99.78-23.6-123.57-70.81-1.81-3.7-4.14-5.57-6.87-5.57s-4.14,1.38-4.14,4.19v193.63h-61.77V138.81h61.77v61.77c0,2.76,1.36,4.19,4.14,4.19s5.02-1.83,6.87-5.57c23.79-47.2,64.98-70.81,123.57-70.81,29.73,0,57.53,7.17,83.39,21.51,25.86,14.34,46.88,35.98,63.18,64.88ZM1345.7,319.21c0-42.57-11.32-75.75-33.97-99.57-22.64-23.83-52.46-35.72-89.6-35.72s-66.96,11.93-89.61,35.72c-22.68,23.82-30.96,57.04-30.96,99.57s8.32,75.75,30.96,99.57c22.65,23.87,52.51,35.72,89.61,35.72s66.96-11.93,89.6-35.72c22.65-23.78,33.97-57.04,33.97-99.57ZM342.87,215.31c16.21,28.9,24.36,63.73,24.36,104.43s-8.11,75.53-24.36,104.43c-16.26,28.9-37.31,50.55-63.17,64.88-25.86,14.34-53.66,21.51-83.39,21.51-58.59,0-99.78-23.6-123.57-70.81-1.8-3.7-4.14-5.57-6.87-5.57s-4.14,1.38-4.14,4.18v193.63H0V139.34h61.76v61.76c0,2.76,1.36,4.19,4.14,4.19s5.02-1.83,6.87-5.57c23.79-47.2,64.98-70.81,123.57-70.81,29.74,0,57.53,7.17,83.39,21.51,25.86,14.34,46.87,35.98,63.17,64.88h-.05ZM305.46,319.74c0-42.57-11.32-75.75-33.96-99.57-22.65-23.78-52.51-35.72-89.61-35.72s-66.96,11.93-89.6,35.72c-22.64,23.87-30.97,57.05-30.97,99.57s8.33,75.75,30.97,99.58c22.64,23.87,52.47,35.71,89.6,35.71s66.96-11.93,89.61-35.71c22.64-23.78,33.96-57.05,33.96-99.58ZM701.07,385.07h65.2c-8.68,33.8-26.43,63.05-53.17,87.77-26.79,24.76-65.11,37.1-115.02,37.1-37.53,0-70.57-7.75-99.16-23.25-28.59-15.5-50.66-37.54-66.26-66.26-15.59-28.68-23.35-62.43-23.35-101.31s7.58-72.63,22.64-101.31c15.07-28.68,36.26-50.77,63.48-66.26,27.23-15.5,59.12-23.25,95.73-23.25s66.96,7.66,92.33,22.89c25.42,15.27,44.36,35.54,56.96,60.7,12.6,25.25,18.85,52.86,18.85,82.92v41.64h-284.85c2.24,36.07,14.32,64.8,36.03,86.04,21.72,21.29,50.92,31.93,87.54,31.93,29.73,0,52.55-6.1,68.33-18.39,15.77-12.29,27.31-29.26,34.67-51.03l.04.09ZM473.18,284.47h215.55c0-31.44-8.02-56.11-24.05-73.92-16.03-17.77-41.19-26.72-75.51-26.72-32.03,0-58.24,8.68-78.59,26.05-20.35,17.32-32.82,42.22-37.4,74.59ZM1457.24,499.61h61.81V0h-61.81v499.65-.04ZM2325.88,99.4h72.17V21.24h-72.17v78.15ZM2592.35,445.86c-11.22,1.16-18.01,1.74-20.24,1.74-3.18,0-5.79-.93-7.58-2.81-1.82-1.83-2.77-4.36-2.77-7.66,0-2.27.59-9.13,1.76-20.48,1.09-11.31,1.71-28.81,1.71-52.37v-172.65h88.1l-17.36-52.86h-70.71V41.59h-61.74v97.13h-67.2v52.86h67.2v189.97c0,39.81,9.65,69.43,28.83,88.84,19.21,19.42,48.51,29.17,87.91,29.17h48.05v-55.49h-24.05c-23.34,0-40.63.58-51.85,1.74l-.06.05ZM2965.71,138.76l-102.29,302.77c-1.35,3.74-3.53,8.6-10.51,8.6s-9.21-4.85-10.6-8.6l-102.29-302.77h-62.99l118.46,360.85h41.9c2.72,0,4.81.27,6.22.71,1.36.45,2.5,1.6,3.43,3.47,1.79,2.76,1.57,6.95-.71,12.47l-19.21,52.73c-2.77,6.95-8.02,10.42-15.76,10.42-2.77,0-9.16-.58-19.22-1.74-10.08-1.16-23.07-1.73-39.1-1.73h-50.14v55.48h65.9c38.45,0,61.58-6.59,81.5-19.77,19.92-13.18,35.33-36.43,46.33-69.73l127.94-389.3v-13.85h-58.86ZM2116.82,273.38l-96.8-134.62h-67.96v13.85l115.98,156.13-141.42,176.97v13.85h69.35l112.59-145.04,105.03,145.04h66.61v-13.85l-122.92-166.55,133.24-165.84v-14.56h-69.35l-104.32,134.62h-.03ZM2332.45,499.61h61.8V138.81h-61.8v360.84-.04ZM1925.78,385.07c-8.72,33.8-26.41,63.05-53.15,87.77-26.8,24.76-65.12,37.1-115.04,37.1-37.52,0-70.57-7.75-99.16-23.25-28.64-15.5-50.65-37.54-66.25-66.26-15.55-28.68-23.31-62.43-23.31-101.31s7.58-72.63,22.65-101.31c15.12-28.68,36.26-50.77,63.49-66.26,27.2-15.5,59.1-23.25,95.76-23.25s66.96,7.66,92.37,22.89c25.38,15.27,44.38,35.54,56.96,60.7,12.61,25.25,18.86,52.86,18.86,82.92v41.64h-284.88c2.29,36.07,14.3,64.8,36.04,86.04,21.71,21.29,50.92,31.93,87.53,31.93,29.73,0,52.56-6.1,68.32-18.39,15.76-12.29,27.31-29.26,34.62-51.03h65.24l-.05.09ZM1634.25,284.47h215.55c0-31.44-8.02-56.11-24-73.92-16.06-17.77-41.19-26.72-75.52-26.72-32.04,0-58.23,8.68-78.59,26.05-20.35,17.32-32.85,42.22-37.39,74.59h-.05Z"
    />
    <path
      d="M113.78 16.0915H117.318V23.4013H112.739C109.15 23.4013 106.475 24.2666 104.701 26.003C102.937 27.7336 102.051 30.5812 102.051 34.5388V58.508H94.8233V16.2578H102.051V22.9997C102.051 23.3803 102.242 23.5676 102.613 23.5676C102.825 23.5676 102.984 23.5149 103.098 23.406C103.211 23.2959 103.308 23.0828 103.422 22.7538C104.813 18.3162 108.274 16.095 113.785 16.095H113.78V16.0903V16.0915ZM161.863 25.1483C163.76 28.5322 164.714 32.6103 164.714 37.3759C164.714 42.1414 163.765 46.2196 161.863 49.6034C159.96 52.9873 157.495 55.5211 154.469 57.2001C151.443 58.8792 148.189 59.7187 144.71 59.7187C137.853 59.7187 133.032 56.9554 130.248 51.4277C130.036 50.9944 129.763 50.7755 129.444 50.7755C129.124 50.7755 128.959 50.9371 128.959 51.2661V73.9379H121.73V16.2531H128.959V23.4856C128.959 23.8088 129.119 23.9762 129.444 23.9762C129.769 23.9762 130.031 23.762 130.248 23.324C133.032 17.7975 137.853 15.033 144.71 15.033C148.189 15.033 151.443 15.8725 154.469 17.5516C157.495 19.2306 159.955 21.7644 161.863 25.1483ZM157.491 37.3759C157.491 32.3914 156.166 28.5064 153.515 25.7173C150.866 22.9271 147.376 21.5349 143.029 21.5349C138.682 21.5349 135.193 22.9318 132.542 25.7173C129.887 28.5064 128.918 32.3961 128.918 37.3759C128.918 42.3556 129.892 46.2453 132.542 49.0344C135.193 51.8293 138.687 53.2168 143.029 53.2168C147.371 53.2168 150.866 51.8199 153.515 49.0344C156.166 46.25 157.491 42.3556 157.491 37.3759ZM40.127 25.2103C42.0241 28.5942 42.9779 32.6724 42.9779 37.4379C42.9779 42.2034 42.0287 46.2816 40.127 49.6655C38.224 53.0493 35.7605 55.5843 32.734 57.2622C29.7076 58.9412 26.454 59.7808 22.9747 59.7808C16.1177 59.7808 11.2972 57.0175 8.51295 51.4897C8.30229 51.0565 8.02844 50.8375 7.70894 50.8375C7.38944 50.8375 7.22442 50.9991 7.22442 51.327V73.9988H0V16.3151H7.22793V23.5465C7.22793 23.8697 7.3871 24.0371 7.71245 24.0371C8.0378 24.0371 8.29995 23.8228 8.51646 23.3849C11.3007 17.8584 16.1212 15.0939 22.9782 15.0939C26.4587 15.0939 29.7111 15.9334 32.7375 17.6125C35.764 19.2915 38.2228 21.8253 40.1305 25.2092H40.1246L40.127 25.2103ZM35.7488 37.4379C35.7488 32.4534 34.424 28.5684 31.7743 25.7794C29.1236 22.995 25.629 21.597 21.2871 21.597C16.9451 21.597 13.4506 22.9939 10.8009 25.7794C8.15132 28.5743 7.17644 32.4593 7.17644 37.4379C7.17644 42.4165 8.15132 46.3074 10.8009 49.0976C13.4506 51.8925 16.9416 53.2788 21.2871 53.2788C25.6325 53.2788 29.1236 51.882 31.7743 49.0976C34.424 46.3132 35.7488 42.4177 35.7488 37.4379ZM82.048 45.0873H89.6786C88.6627 49.0449 86.5854 52.4697 83.4559 55.3642C80.3206 58.2633 75.8359 59.7082 69.9949 59.7082C65.6026 59.7082 61.7359 58.8007 58.3899 56.9859C55.0439 55.171 52.461 52.5903 50.6353 49.2276C48.8108 45.8695 47.9026 41.9177 47.9026 37.3653C47.9026 32.8129 48.7897 28.8612 50.5522 25.5031C52.3159 22.145 54.7958 19.5585 57.9815 17.7448C61.1683 15.9299 64.9004 15.0225 69.185 15.0225C73.4695 15.0225 77.0215 15.9194 79.9906 17.7026C82.9656 19.4906 85.1822 21.864 86.6568 24.8099C88.1314 27.7664 88.8628 30.9992 88.8628 34.5189V39.3945H55.5261C55.7883 43.6178 57.202 46.9818 59.7428 49.4688C62.2847 51.9616 65.7021 53.2074 69.9878 53.2074C73.4672 53.2074 76.1379 52.4932 77.9847 51.0541C79.8303 49.6151 81.1808 47.6281 82.0422 45.0791L82.0469 45.0896L82.048 45.0873ZM55.3775 33.3082H80.6039C80.6039 29.6269 79.6653 26.7384 77.7892 24.653C75.9132 22.5723 72.9686 21.5244 68.9521 21.5244C65.2035 21.5244 62.1361 22.5407 59.7545 24.5746C57.3729 26.6025 55.9135 29.518 55.3775 33.3082ZM170.545 58.4986H177.778V0H170.545V58.5033V58.4986ZM272.204 11.6386H280.65V2.49282H272.204V11.6386ZM303.389 52.2051C302.076 52.3409 301.282 52.4089 301.021 52.4089C300.649 52.4089 300.343 52.3 300.134 52.0798C299.921 51.8656 299.809 51.5693 299.809 51.1829C299.809 50.9171 299.878 50.1139 300.015 48.785C300.143 47.4607 300.216 45.4116 300.216 42.653V22.4377H310.526L308.494 16.2484H300.219V4.86971H292.993V16.2425H285.129V22.4318H292.993V44.6752C292.993 49.3365 294.123 52.8046 296.367 55.0773C298.616 57.3512 302.045 58.4928 306.656 58.4928H312.279V51.9955H309.465C306.733 51.9955 304.71 52.0634 303.396 52.1993L303.389 52.2051ZM347.085 16.2425L335.113 51.6993C334.955 52.1372 334.7 52.7063 333.883 52.7063C333.067 52.7063 332.806 52.1384 332.643 51.6993L320.672 16.2484H313.3L327.163 58.4998H332.067C332.385 58.4998 332.63 58.5314 332.795 58.5829C332.954 58.6356 333.088 58.7703 333.196 58.9892C333.406 59.3124 333.38 59.803 333.113 60.4493L330.865 66.6234C330.541 67.4372 329.927 67.8435 329.021 67.8435C328.697 67.8435 327.949 67.7756 326.771 67.6397C325.592 67.5039 324.071 67.4372 322.195 67.4372H316.327V73.9333H324.04C328.54 73.9333 331.247 73.1616 333.578 71.6184C335.909 70.0752 337.713 67.3529 339 63.4538L353.973 17.8712V16.2437L347.094 16.2496L347.085 16.2437V16.2425ZM247.737 32.0097L236.408 16.2472H228.455V17.8689L242.028 36.1499L225.477 56.8711V58.4928H233.594L246.77 41.5103L259.062 58.4928H266.858V56.8711L252.472 37.37L268.065 17.952V16.2472H259.949L247.74 32.0097H247.737ZM272.973 58.4986H280.205V16.2531H272.973V58.5033V58.4986ZM225.379 45.0873C224.358 49.0449 222.288 52.4697 219.159 55.3642C216.022 58.2633 211.538 59.7082 205.695 59.7082C201.304 59.7082 197.436 58.8007 194.09 56.9859C190.739 55.171 188.163 52.5903 186.337 49.2276C184.517 45.8695 183.609 41.9177 183.609 37.3653C183.609 32.8129 184.496 28.8612 186.26 25.5031C188.029 22.145 190.503 19.5585 193.69 17.7448C196.873 15.9299 200.607 15.0225 204.897 15.0225C209.188 15.0225 212.734 15.9194 215.707 17.7026C218.678 19.4906 220.901 21.864 222.374 24.8099C223.849 27.7664 224.581 30.9992 224.581 34.5189V39.3945H191.241C191.509 43.6178 192.914 46.9818 195.458 49.4688C197.999 51.9616 201.418 53.2074 205.702 53.2074C209.182 53.2074 211.854 52.4932 213.698 51.0541C215.542 49.6151 216.894 47.6281 217.75 45.0791H225.385L225.379 45.0896V45.0873ZM191.261 33.3082H216.487C216.487 29.6269 215.548 26.7384 213.678 24.653C211.799 22.5723 208.858 21.5244 204.84 21.5244C201.09 21.5244 198.025 22.5407 195.642 24.5746C193.261 26.6025 191.798 29.518 191.266 33.3082H191.261Z"
      fill="currentColor"
    />
    <g>
      <path
        d="M369.705 16.0751V19.7517H370.279C371.485 17.7413 373.552 15.3866 379.007 15.3866C384.461 15.3866 386.93 18.2588 387.906 20.7282H388.48C389.915 18.1429 392.499 15.3866 398.241 15.3866C403.982 15.3866 408.345 18.5457 408.345 25.2666V45.3133H403.293V25.612C403.293 21.7633 401.169 19.4086 397.035 19.4086C392.385 19.4086 389.112 22.2234 389.112 28.0825V45.3145H384.06V25.6131C384.06 21.7644 381.936 19.4098 377.802 19.4098C373.151 19.4098 369.879 22.2246 369.879 28.0837V45.3156H364.827V16.0786H369.707L369.705 16.0751Z"
        style="fill: var(--logo-brand-fill, currentColor)"
      />
      <path
        d="M412.837 24.5758C413.813 19.1194 418.693 15.3855 425.985 15.3855C433.276 15.3855 438.328 19.1194 438.328 26.2419V45.3121H433.448V41.0045H432.873C431.61 43.0722 428.797 45.9444 422.711 45.9444C416.626 45.9444 412.032 42.7854 412.032 37.5585C412.032 32.3317 416.452 29.5169 422.423 28.9432L433.332 27.9093V26.1283C433.332 21.3605 430.518 19.178 425.869 19.178C421.219 19.178 418.232 21.3605 417.716 25.4387H412.836V24.5769L412.837 24.5758ZM423.573 42.1519C428.912 42.1519 433.333 39.0502 433.333 32.4441V31.6397L423.114 32.6162C419.324 32.9605 417.085 34.3971 417.085 37.3267C417.085 40.2563 419.612 42.1519 423.573 42.1519Z"
        style="fill: var(--logo-brand-fill, currentColor)"
      />
      <path
        d="M456.8 2.49283C461.595 2.49283 466.06 3.61337 470.071 5.74672C474.452 8.0522 477.928 11.4606 480.394 15.8725C482.786 20.0889 483.999 24.9855 483.999 30.4255C483.999 35.8654 482.786 40.7632 480.394 44.9796C479.086 47.319 477.492 49.3739 475.629 51.1349C474.431 52.2672 473.125 53.2788 471.71 54.1617L468.776 50.4617L455.493 33.7133H455.001L445.815 45.3156H440.418V44.4539L451.985 30.3037L440.418 16.1536V15.2918H445.815L455.001 26.8941H455.493L464.679 15.2918H470.075V16.1536L458.509 30.3037L472.647 47.5052C474.071 46.1142 475.295 44.5054 476.312 42.6858L476.32 42.6718C478.31 39.1685 479.319 35.0481 479.319 30.4255C479.319 25.8028 478.31 21.6837 476.321 18.1792L476.313 18.1651C474.297 14.5541 471.46 11.7686 467.883 9.88697C464.547 8.11308 460.821 7.21618 456.8 7.21618H364.861V2.49283H456.8Z"
        style="fill: var(--logo-brand-fill, currentColor)"
      />
      <path
        d="M462.359 55.5562L460.611 53.3526C459.374 53.5399 458.103 53.6348 456.8 53.6348H364.861V58.3183H456.8C459.252 58.3183 461.616 58.0326 463.877 57.4706L462.358 55.5562H462.359Z"
        style="fill: var(--logo-brand-fill, currentColor)"
      />
    </g>
  </symbol>

  <!-- Word -->
  <symbol id="pplx-logo-word">
    <path
      d="M310.846 43.922H320.632V63.8822H307.966C298.037 63.8822 290.638 66.2483 285.737 70.9803C280.852 75.7123 278.401 83.4772 278.401 94.2751V159.698H258.4V44.3666H278.401V62.7707C278.401 63.8028 278.926 64.3269 279.961 64.3269C280.549 64.3269 280.995 64.1839 281.297 63.8822C281.6 63.5805 281.886 62.993 282.188 62.1038C286.039 49.9879 295.602 43.922 310.862 43.922H310.846ZM441.502 68.646C446.753 77.8877 449.395 89.0191 449.395 102.024C449.395 115.029 446.769 126.161 441.502 135.402C436.235 144.644 429.425 151.552 421.055 156.141C412.685 160.73 403.679 163.016 394.052 163.016C375.084 163.016 361.75 155.474 354.048 140.388C353.459 139.213 352.712 138.61 351.82 138.61C350.929 138.61 350.484 139.055 350.484 139.944V201.825H330.482V44.3666H350.484V64.1045C350.484 64.9938 350.929 65.4384 351.82 65.4384C352.712 65.4384 353.444 64.8509 354.048 63.6599C361.75 48.5746 375.084 41.032 394.052 41.032C403.679 41.032 412.685 43.3186 421.055 47.9077C429.425 52.4968 436.235 59.4043 441.502 68.646ZM429.393 102.024C429.393 88.4157 425.733 77.8083 418.397 70.2022C411.062 62.596 401.403 58.785 389.389 58.785C377.376 58.785 367.717 62.596 360.381 70.2022C353.046 77.8242 350.357 88.4316 350.357 102.024C350.357 115.617 353.046 126.24 360.381 133.846C367.717 141.468 377.392 145.263 389.389 145.263C401.387 145.263 411.062 141.452 418.397 133.846C425.733 126.24 429.393 115.617 429.393 102.024ZM111.004 68.8207C116.255 78.0624 118.897 89.1938 118.897 102.199C118.897 115.204 116.271 126.335 111.004 135.577C105.737 144.819 98.9266 151.726 90.5568 156.315C82.1869 160.904 73.1806 163.191 63.5536 163.191C44.5862 163.191 31.2517 155.648 23.5502 140.563C22.9614 139.388 22.2135 138.785 21.3225 138.785C20.4314 138.785 19.9858 139.229 19.9858 140.119V202H0V44.5413H20.0017V64.2792C20.0017 65.1685 20.4473 65.6131 21.3384 65.6131C22.2295 65.6131 22.9614 65.0256 23.5661 63.8346C31.2676 48.7493 44.6021 41.2067 63.5696 41.2067C73.1965 41.2067 82.2028 43.4933 90.5727 48.0824C98.9426 52.6715 105.753 59.579 111.02 68.8207H111.004ZM98.8948 102.199C98.8948 88.5904 95.235 77.983 87.8994 70.3769C80.5639 62.7707 70.9051 58.9597 58.8913 58.9597C46.8776 58.9597 37.2188 62.7707 29.8833 70.3769C22.5477 77.9989 19.8585 88.6062 19.8585 102.199C19.8585 115.792 22.5477 126.415 29.8833 134.021C37.2188 141.643 46.8776 145.438 58.8913 145.438C70.9051 145.438 80.5639 141.627 87.8994 134.021C95.235 126.415 98.8948 115.792 98.8948 102.199ZM221.578 123.08H242.694C239.878 133.878 234.133 143.231 225.477 151.139C216.805 159.047 204.393 163.001 188.242 163.001C176.085 163.001 165.392 160.523 156.131 155.569C146.87 150.615 139.726 143.564 134.682 134.386C129.637 125.224 127.123 114.426 127.123 102.008C127.123 89.5908 129.574 78.7929 134.459 69.6305C139.344 60.4682 146.202 53.4019 155.017 48.4476C163.833 43.4933 174.16 41.0161 186.015 41.0161C197.869 41.0161 207.687 43.4615 215.914 48.3365C224.14 53.2114 230.283 59.6901 234.356 67.7409C238.43 75.8076 240.466 84.6364 240.466 94.2434V107.55H148.239C148.971 119.079 152.869 128.257 159.902 135.053C166.936 141.849 176.388 145.263 188.242 145.263C197.869 145.263 205.252 143.31 210.36 139.388C215.468 135.466 219.208 130.035 221.578 123.08ZM148.462 90.9246H218.253C218.253 80.873 215.659 72.9969 210.472 67.2963C205.284 61.6115 197.137 58.7532 186.03 58.7532C175.656 58.7532 167.174 61.5321 160.587 67.074C153.999 72.6158 149.957 80.5713 148.477 90.9087L148.462 90.9246ZM465.227 159.682H485.229V0H465.227V159.698V159.682ZM742.753 31.7744H766.113V6.8122H742.753V31.7744ZM825.163 142.5C821.535 142.866 819.339 143.056 818.607 143.056C817.573 143.056 816.745 142.755 816.157 142.167C815.568 141.579 815.266 140.77 815.266 139.722C815.266 138.991 815.457 136.8 815.823 133.179C816.189 129.559 816.379 123.969 816.379 116.443V61.2622H844.91L839.293 44.3666H816.395V13.3068H796.394V44.3508H774.642V61.2463H796.394V121.969C796.394 134.688 799.512 144.152 805.734 150.361C811.956 156.569 821.44 159.682 834.185 159.682H849.748V141.945H841.966C834.408 141.945 828.807 142.135 825.179 142.5H825.163ZM942.198 44.3508L909.084 141.119C908.639 142.31 907.939 143.866 905.663 143.866C903.388 143.866 902.688 142.31 902.242 141.119L869.129 44.3508H848.729L887.078 159.682H900.635C901.526 159.682 902.194 159.761 902.64 159.904C903.086 160.047 903.451 160.412 903.754 161.016C904.343 161.905 904.263 163.239 903.531 165.001L897.309 181.849C896.418 184.072 894.716 185.184 892.201 185.184C891.31 185.184 889.242 184.993 885.98 184.628C882.718 184.263 878.501 184.072 873.314 184.072H857.083V201.809H878.421C890.865 201.809 898.359 199.698 904.804 195.49C911.248 191.281 916.245 183.85 919.809 173.195L961.229 48.7652V44.3349H942.198V44.3508ZM677.418 87.3835L646.086 44.3508H624.08V48.7811L661.633 98.6896L615.853 155.251V159.682H638.305L674.76 113.33L708.765 159.682H730.326V155.251L690.545 102.024L733.667 49.0193V44.3666H711.215L677.433 87.3994L677.418 87.3835ZM744.886 159.682H764.887V44.3666H744.886V159.698V159.682ZM616.76 123.08C613.943 133.878 608.199 143.231 599.543 151.139C590.871 159.047 578.459 163.001 562.308 163.001C550.151 163.001 539.458 160.523 530.197 155.569C520.936 150.615 513.792 143.564 508.747 134.386C503.703 125.224 501.189 114.426 501.189 102.008C501.189 89.5908 503.64 78.7929 508.525 69.6305C513.41 60.4682 520.268 53.4019 529.083 48.4476C537.899 43.4933 548.226 41.0161 560.08 41.0161C571.935 41.0161 581.753 43.4615 589.98 48.3365C598.206 53.2114 604.348 59.6901 608.422 67.7409C612.495 75.8076 614.532 84.6364 614.532 94.2434V107.55H522.305C523.037 119.079 526.935 128.257 533.968 135.053C541.002 141.849 550.453 145.263 562.308 145.263C571.935 145.263 579.318 143.31 584.426 139.388C589.534 135.466 593.273 130.035 595.644 123.08H616.76ZM522.527 90.9246H592.319C592.319 80.873 589.725 72.9969 584.538 67.2963C579.35 61.6115 571.203 58.7532 560.096 58.7532C549.721 58.7532 541.24 61.5321 534.653 67.074C528.065 72.6158 524.023 80.5713 522.543 90.9087L522.527 90.9246Z"
      fill="currentColor"
    />
  </symbol>
</svg>
`;
function An(a, i, { checkForDefaultPrevented: o = !0 } = {}) {
    return function (c) {
        if ((a?.(c), o === !1 || !c.defaultPrevented)) return i?.(c);
    };
}
function k0(a, i) {
    if (typeof a == "function") return a(i);
    a != null && (a.current = i);
}
function o5(...a) {
    return (i) => {
        let o = !1;
        const r = a.map((c) => {
            const f = k0(c, i);
            return !o && typeof f == "function" && (o = !0), f;
        });
        if (o)
            return () => {
                for (let c = 0; c < r.length; c++) {
                    const f = r[c];
                    typeof f == "function" ? f() : k0(a[c], null);
                }
            };
    };
}
function Ra(...a) {
    return C.useCallback(o5(...a), a);
}
function s5(a, i = []) {
    let o = [];
    function r(f, h) {
        const m = C.createContext(h),
            g = o.length;
        o = [...o, h];
        const v = (A) => {
            const { scope: E, children: x, ...H } = A,
                D = E?.[a]?.[g] || m,
                _ = C.useMemo(() => H, Object.values(H));
            return z.jsx(D.Provider, { value: _, children: x });
        };
        v.displayName = f + "Provider";
        function p(A, E) {
            const x = E?.[a]?.[g] || m,
                H = C.useContext(x);
            if (H) return H;
            if (h !== void 0) return h;
            throw new Error(`\`${A}\` must be used within \`${f}\``);
        }
        return [v, p];
    }
    const c = () => {
        const f = o.map((h) => C.createContext(h));
        return function (m) {
            const g = m?.[a] || f;
            return C.useMemo(() => ({ [`__scope${a}`]: { ...m, [a]: g } }), [m, g]);
        };
    };
    return (c.scopeName = a), [r, dh(c, ...i)];
}
function dh(...a) {
    const i = a[0];
    if (a.length === 1) return i;
    const o = () => {
        const r = a.map((c) => ({ useScope: c(), scopeName: c.scopeName }));
        return function (f) {
            const h = r.reduce((m, { useScope: g, scopeName: v }) => {
                const A = g(f)[`__scope${v}`];
                return { ...m, ...A };
            }, {});
            return C.useMemo(() => ({ [`__scope${i.scopeName}`]: h }), [h]);
        };
    };
    return (o.scopeName = i.scopeName), o;
}
var gc = U3();
const mh = fc(gc);
function vh(a) {
    const i = gh(a),
        o = C.forwardRef((r, c) => {
            const { children: f, ...h } = r,
                m = C.Children.toArray(f),
                g = m.find(yh);
            if (g) {
                const v = g.props.children,
                    p = m.map((A) =>
                        A === g
                            ? C.Children.count(v) > 1
                                ? C.Children.only(null)
                                : C.isValidElement(v)
                                  ? v.props.children
                                  : null
                            : A
                    );
                return z.jsx(i, { ...h, ref: c, children: C.isValidElement(v) ? C.cloneElement(v, void 0, p) : null });
            }
            return z.jsx(i, { ...h, ref: c, children: f });
        });
    return (o.displayName = `${a}.Slot`), o;
}
function gh(a) {
    const i = C.forwardRef((o, r) => {
        const { children: c, ...f } = o;
        if (C.isValidElement(c)) {
            const h = bh(c),
                m = Ah(f, c.props);
            return c.type !== C.Fragment && (m.ref = r ? o5(r, h) : h), C.cloneElement(c, m);
        }
        return C.Children.count(c) > 1 ? C.Children.only(null) : null;
    });
    return (i.displayName = `${a}.SlotClone`), i;
}
var c5 = Symbol("radix.slottable");
function ph(a) {
    const i = ({ children: o }) => z.jsx(z.Fragment, { children: o });
    return (i.displayName = `${a}.Slottable`), (i.__radixId = c5), i;
}
function yh(a) {
    return C.isValidElement(a) && typeof a.type == "function" && "__radixId" in a.type && a.type.__radixId === c5;
}
function Ah(a, i) {
    const o = { ...i };
    for (const r in i) {
        const c = a[r],
            f = i[r];
        /^on[A-Z]/.test(r)
            ? c && f
                ? (o[r] = (...m) => {
                      const g = f(...m);
                      return c(...m), g;
                  })
                : c && (o[r] = c)
            : r === "style"
              ? (o[r] = { ...c, ...f })
              : r === "className" && (o[r] = [c, f].filter(Boolean).join(" "));
    }
    return { ...a, ...o };
}
function bh(a) {
    let i = Object.getOwnPropertyDescriptor(a.props, "ref")?.get,
        o = i && "isReactWarning" in i && i.isReactWarning;
    return o
        ? a.ref
        : ((i = Object.getOwnPropertyDescriptor(a, "ref")?.get),
          (o = i && "isReactWarning" in i && i.isReactWarning),
          o ? a.props.ref : a.props.ref || a.ref);
}
var Eh = [
        "a",
        "button",
        "div",
        "form",
        "h2",
        "h3",
        "img",
        "input",
        "label",
        "li",
        "nav",
        "ol",
        "p",
        "select",
        "span",
        "svg",
        "ul",
    ],
    Kn = Eh.reduce((a, i) => {
        const o = vh(`Primitive.${i}`),
            r = C.forwardRef((c, f) => {
                const { asChild: h, ...m } = c,
                    g = h ? o : i;
                return typeof window < "u" && (window[Symbol.for("radix-ui")] = !0), z.jsx(g, { ...m, ref: f });
            });
        return (r.displayName = `Primitive.${i}`), { ...a, [i]: r };
    }, {});
function Sh(a, i) {
    a && gc.flushSync(() => a.dispatchEvent(i));
}
function uu(a) {
    const i = C.useRef(a);
    return (
        C.useEffect(() => {
            i.current = a;
        }),
        C.useMemo(
            () =>
                (...o) =>
                    i.current?.(...o),
            []
        )
    );
}
function Ch(a, i = globalThis?.document) {
    const o = uu(a);
    C.useEffect(() => {
        const r = (c) => {
            c.key === "Escape" && o(c);
        };
        return (
            i.addEventListener("keydown", r, { capture: !0 }),
            () => i.removeEventListener("keydown", r, { capture: !0 })
        );
    }, [o, i]);
}
var Th = "DismissableLayer",
    nc = "dismissableLayer.update",
    xh = "dismissableLayer.pointerDownOutside",
    Mh = "dismissableLayer.focusOutside",
    X0,
    f5 = C.createContext({ layers: new Set(), layersWithOutsidePointerEventsDisabled: new Set(), branches: new Set() }),
    h5 = C.forwardRef((a, i) => {
        const {
                disableOutsidePointerEvents: o = !1,
                onEscapeKeyDown: r,
                onPointerDownOutside: c,
                onFocusOutside: f,
                onInteractOutside: h,
                onDismiss: m,
                ...g
            } = a,
            v = C.useContext(f5),
            [p, A] = C.useState(null),
            E = p?.ownerDocument ?? globalThis?.document,
            [, x] = C.useState({}),
            H = Ra(i, (X) => A(X)),
            D = Array.from(v.layers),
            [_] = [...v.layersWithOutsidePointerEventsDisabled].slice(-1),
            V = D.indexOf(_),
            U = p ? D.indexOf(p) : -1,
            Q = v.layersWithOutsidePointerEventsDisabled.size > 0,
            Y = U >= V,
            R = Oh((X) => {
                const st = X.target,
                    P = [...v.branches].some((K) => K.contains(st));
                !Y || P || (c?.(X), h?.(X), X.defaultPrevented || m?.());
            }, E),
            k = Hh((X) => {
                const st = X.target;
                [...v.branches].some((K) => K.contains(st)) || (f?.(X), h?.(X), X.defaultPrevented || m?.());
            }, E);
        return (
            Ch((X) => {
                U === v.layers.size - 1 && (r?.(X), !X.defaultPrevented && m && (X.preventDefault(), m()));
            }, E),
            C.useEffect(() => {
                if (p)
                    return (
                        o &&
                            (v.layersWithOutsidePointerEventsDisabled.size === 0 &&
                                ((X0 = E.body.style.pointerEvents), (E.body.style.pointerEvents = "none")),
                            v.layersWithOutsidePointerEventsDisabled.add(p)),
                        v.layers.add(p),
                        q0(),
                        () => {
                            o &&
                                v.layersWithOutsidePointerEventsDisabled.size === 1 &&
                                (E.body.style.pointerEvents = X0);
                        }
                    );
            }, [p, E, o, v]),
            C.useEffect(
                () => () => {
                    p && (v.layers.delete(p), v.layersWithOutsidePointerEventsDisabled.delete(p), q0());
                },
                [p, v]
            ),
            C.useEffect(() => {
                const X = () => x({});
                return document.addEventListener(nc, X), () => document.removeEventListener(nc, X);
            }, []),
            z.jsx(Kn.div, {
                ...g,
                ref: H,
                style: { pointerEvents: Q ? (Y ? "auto" : "none") : void 0, ...a.style },
                onFocusCapture: An(a.onFocusCapture, k.onFocusCapture),
                onBlurCapture: An(a.onBlurCapture, k.onBlurCapture),
                onPointerDownCapture: An(a.onPointerDownCapture, R.onPointerDownCapture),
            })
        );
    });
h5.displayName = Th;
var Rh = "DismissableLayerBranch",
    wh = C.forwardRef((a, i) => {
        const o = C.useContext(f5),
            r = C.useRef(null),
            c = Ra(i, r);
        return (
            C.useEffect(() => {
                const f = r.current;
                if (f)
                    return (
                        o.branches.add(f),
                        () => {
                            o.branches.delete(f);
                        }
                    );
            }, [o.branches]),
            z.jsx(Kn.div, { ...a, ref: c })
        );
    });
wh.displayName = Rh;
function Oh(a, i = globalThis?.document) {
    const o = uu(a),
        r = C.useRef(!1),
        c = C.useRef(() => {});
    return (
        C.useEffect(() => {
            const f = (m) => {
                    if (m.target && !r.current) {
                        let g = function () {
                            d5(xh, o, v, { discrete: !0 });
                        };
                        const v = { originalEvent: m };
                        m.pointerType === "touch"
                            ? (i.removeEventListener("click", c.current),
                              (c.current = g),
                              i.addEventListener("click", c.current, { once: !0 }))
                            : g();
                    } else i.removeEventListener("click", c.current);
                    r.current = !1;
                },
                h = window.setTimeout(() => {
                    i.addEventListener("pointerdown", f);
                }, 0);
            return () => {
                window.clearTimeout(h),
                    i.removeEventListener("pointerdown", f),
                    i.removeEventListener("click", c.current);
            };
        }, [i, o]),
        { onPointerDownCapture: () => (r.current = !0) }
    );
}
function Hh(a, i = globalThis?.document) {
    const o = uu(a),
        r = C.useRef(!1);
    return (
        C.useEffect(() => {
            const c = (f) => {
                f.target && !r.current && d5(Mh, o, { originalEvent: f }, { discrete: !1 });
            };
            return i.addEventListener("focusin", c), () => i.removeEventListener("focusin", c);
        }, [i, o]),
        { onFocusCapture: () => (r.current = !0), onBlurCapture: () => (r.current = !1) }
    );
}
function q0() {
    const a = new CustomEvent(nc);
    document.dispatchEvent(a);
}
function d5(a, i, o, { discrete: r }) {
    const c = o.originalEvent.target,
        f = new CustomEvent(a, { bubbles: !1, cancelable: !0, detail: o });
    i && c.addEventListener(a, i, { once: !0 }), r ? Sh(c, f) : c.dispatchEvent(f);
}
var In = globalThis?.document ? C.useLayoutEffect : () => {},
    Bh = V3[" useId ".trim().toString()] || (() => {}),
    Dh = 0;
function _h(a) {
    const [i, o] = C.useState(Bh());
    return (
        In(() => {
            o((r) => r ?? String(Dh++));
        }, [a]),
        i ? `radix-${i}` : ""
    );
}
const Nh = ["top", "right", "bottom", "left"],
    Pn = Math.min,
    ye = Math.max,
    tu = Math.round,
    Xr = Math.floor,
    We = (a) => ({ x: a, y: a }),
    Lh = { left: "right", right: "left", bottom: "top", top: "bottom" },
    Uh = { start: "end", end: "start" };
function ac(a, i, o) {
    return ye(a, Pn(i, o));
}
function bn(a, i) {
    return typeof a == "function" ? a(i) : a;
}
function En(a) {
    return a.split("-")[0];
}
function gl(a) {
    return a.split("-")[1];
}
function pc(a) {
    return a === "x" ? "y" : "x";
}
function yc(a) {
    return a === "y" ? "height" : "width";
}
const Vh = new Set(["top", "bottom"]);
function Ke(a) {
    return Vh.has(En(a)) ? "y" : "x";
}
function Ac(a) {
    return pc(Ke(a));
}
function zh(a, i, o) {
    o === void 0 && (o = !1);
    const r = gl(a),
        c = Ac(a),
        f = yc(c);
    let h = c === "x" ? (r === (o ? "end" : "start") ? "right" : "left") : r === "start" ? "bottom" : "top";
    return i.reference[f] > i.floating[f] && (h = eu(h)), [h, eu(h)];
}
function Gh(a) {
    const i = eu(a);
    return [lc(a), i, lc(i)];
}
function lc(a) {
    return a.replace(/start|end/g, (i) => Uh[i]);
}
const K0 = ["left", "right"],
    W0 = ["right", "left"],
    Qh = ["top", "bottom"],
    Zh = ["bottom", "top"];
function jh(a, i, o) {
    switch (a) {
        case "top":
        case "bottom":
            return o ? (i ? W0 : K0) : i ? K0 : W0;
        case "left":
        case "right":
            return i ? Qh : Zh;
        default:
            return [];
    }
}
function Fh(a, i, o, r) {
    const c = gl(a);
    let f = jh(En(a), o === "start", r);
    return c && ((f = f.map((h) => h + "-" + c)), i && (f = f.concat(f.map(lc)))), f;
}
function eu(a) {
    return a.replace(/left|right|bottom|top/g, (i) => Lh[i]);
}
function Yh(a) {
    return { top: 0, right: 0, bottom: 0, left: 0, ...a };
}
function m5(a) {
    return typeof a != "number" ? Yh(a) : { top: a, right: a, bottom: a, left: a };
}
function nu(a) {
    const { x: i, y: o, width: r, height: c } = a;
    return { width: r, height: c, top: o, left: i, right: i + r, bottom: o + c, x: i, y: o };
}
function J0(a, i, o) {
    let { reference: r, floating: c } = a;
    const f = Ke(i),
        h = Ac(i),
        m = yc(h),
        g = En(i),
        v = f === "y",
        p = r.x + r.width / 2 - c.width / 2,
        A = r.y + r.height / 2 - c.height / 2,
        E = r[m] / 2 - c[m] / 2;
    let x;
    switch (g) {
        case "top":
            x = { x: p, y: r.y - c.height };
            break;
        case "bottom":
            x = { x: p, y: r.y + r.height };
            break;
        case "right":
            x = { x: r.x + r.width, y: A };
            break;
        case "left":
            x = { x: r.x - c.width, y: A };
            break;
        default:
            x = { x: r.x, y: r.y };
    }
    switch (gl(i)) {
        case "start":
            x[h] -= E * (o && v ? -1 : 1);
            break;
        case "end":
            x[h] += E * (o && v ? -1 : 1);
            break;
    }
    return x;
}
const Ih = async (a, i, o) => {
    const { placement: r = "bottom", strategy: c = "absolute", middleware: f = [], platform: h } = o,
        m = f.filter(Boolean),
        g = await (h.isRTL == null ? void 0 : h.isRTL(i));
    let v = await h.getElementRects({ reference: a, floating: i, strategy: c }),
        { x: p, y: A } = J0(v, r, g),
        E = r,
        x = {},
        H = 0;
    for (let D = 0; D < m.length; D++) {
        const { name: _, fn: V } = m[D],
            {
                x: U,
                y: Q,
                data: Y,
                reset: R,
            } = await V({
                x: p,
                y: A,
                initialPlacement: r,
                placement: E,
                strategy: c,
                middlewareData: x,
                rects: v,
                platform: h,
                elements: { reference: a, floating: i },
            });
        (p = U ?? p),
            (A = Q ?? A),
            (x = { ...x, [_]: { ...x[_], ...Y } }),
            R &&
                H <= 50 &&
                (H++,
                typeof R == "object" &&
                    (R.placement && (E = R.placement),
                    R.rects &&
                        (v =
                            R.rects === !0
                                ? await h.getElementRects({ reference: a, floating: i, strategy: c })
                                : R.rects),
                    ({ x: p, y: A } = J0(v, E, g))),
                (D = -1));
    }
    return { x: p, y: A, placement: E, strategy: c, middlewareData: x };
};
async function Ei(a, i) {
    var o;
    i === void 0 && (i = {});
    const { x: r, y: c, platform: f, rects: h, elements: m, strategy: g } = a,
        {
            boundary: v = "clippingAncestors",
            rootBoundary: p = "viewport",
            elementContext: A = "floating",
            altBoundary: E = !1,
            padding: x = 0,
        } = bn(i, a),
        H = m5(x),
        _ = m[E ? (A === "floating" ? "reference" : "floating") : A],
        V = nu(
            await f.getClippingRect({
                element:
                    (o = await (f.isElement == null ? void 0 : f.isElement(_))) == null || o
                        ? _
                        : _.contextElement ||
                          (await (f.getDocumentElement == null ? void 0 : f.getDocumentElement(m.floating))),
                boundary: v,
                rootBoundary: p,
                strategy: g,
            })
        ),
        U = A === "floating" ? { x: r, y: c, width: h.floating.width, height: h.floating.height } : h.reference,
        Q = await (f.getOffsetParent == null ? void 0 : f.getOffsetParent(m.floating)),
        Y = (await (f.isElement == null ? void 0 : f.isElement(Q)))
            ? (await (f.getScale == null ? void 0 : f.getScale(Q))) || { x: 1, y: 1 }
            : { x: 1, y: 1 },
        R = nu(
            f.convertOffsetParentRelativeRectToViewportRelativeRect
                ? await f.convertOffsetParentRelativeRectToViewportRelativeRect({
                      elements: m,
                      rect: U,
                      offsetParent: Q,
                      strategy: g,
                  })
                : U
        );
    return {
        top: (V.top - R.top + H.top) / Y.y,
        bottom: (R.bottom - V.bottom + H.bottom) / Y.y,
        left: (V.left - R.left + H.left) / Y.x,
        right: (R.right - V.right + H.right) / Y.x,
    };
}
const Ph = (a) => ({
        name: "arrow",
        options: a,
        async fn(i) {
            const { x: o, y: r, placement: c, rects: f, platform: h, elements: m, middlewareData: g } = i,
                { element: v, padding: p = 0 } = bn(a, i) || {};
            if (v == null) return {};
            const A = m5(p),
                E = { x: o, y: r },
                x = Ac(c),
                H = yc(x),
                D = await h.getDimensions(v),
                _ = x === "y",
                V = _ ? "top" : "left",
                U = _ ? "bottom" : "right",
                Q = _ ? "clientHeight" : "clientWidth",
                Y = f.reference[H] + f.reference[x] - E[x] - f.floating[H],
                R = E[x] - f.reference[x],
                k = await (h.getOffsetParent == null ? void 0 : h.getOffsetParent(v));
            let X = k ? k[Q] : 0;
            (!X || !(await (h.isElement == null ? void 0 : h.isElement(k)))) && (X = m.floating[Q] || f.floating[H]);
            const st = Y / 2 - R / 2,
                P = X / 2 - D[H] / 2 - 1,
                K = Pn(A[V], P),
                gt = Pn(A[U], P),
                Mt = K,
                Et = X - D[H] - gt,
                At = X / 2 - D[H] / 2 + st,
                Tt = ac(Mt, At, Et),
                F = !g.arrow && gl(c) != null && At !== Tt && f.reference[H] / 2 - (At < Mt ? K : gt) - D[H] / 2 < 0,
                J = F ? (At < Mt ? At - Mt : At - Et) : 0;
            return {
                [x]: E[x] + J,
                data: { [x]: Tt, centerOffset: At - Tt - J, ...(F && { alignmentOffset: J }) },
                reset: F,
            };
        },
    }),
    kh = function (a) {
        return (
            a === void 0 && (a = {}),
            {
                name: "flip",
                options: a,
                async fn(i) {
                    var o, r;
                    const {
                            placement: c,
                            middlewareData: f,
                            rects: h,
                            initialPlacement: m,
                            platform: g,
                            elements: v,
                        } = i,
                        {
                            mainAxis: p = !0,
                            crossAxis: A = !0,
                            fallbackPlacements: E,
                            fallbackStrategy: x = "bestFit",
                            fallbackAxisSideDirection: H = "none",
                            flipAlignment: D = !0,
                            ..._
                        } = bn(a, i);
                    if ((o = f.arrow) != null && o.alignmentOffset) return {};
                    const V = En(c),
                        U = Ke(m),
                        Q = En(m) === m,
                        Y = await (g.isRTL == null ? void 0 : g.isRTL(v.floating)),
                        R = E || (Q || !D ? [eu(m)] : Gh(m)),
                        k = H !== "none";
                    !E && k && R.push(...Fh(m, D, H, Y));
                    const X = [m, ...R],
                        st = await Ei(i, _),
                        P = [];
                    let K = ((r = f.flip) == null ? void 0 : r.overflows) || [];
                    if ((p && P.push(st[V]), A)) {
                        const At = zh(c, h, Y);
                        P.push(st[At[0]], st[At[1]]);
                    }
                    if (((K = [...K, { placement: c, overflows: P }]), !P.every((At) => At <= 0))) {
                        var gt, Mt;
                        const At = (((gt = f.flip) == null ? void 0 : gt.index) || 0) + 1,
                            Tt = X[At];
                        if (
                            Tt &&
                            (!(A === "alignment" ? U !== Ke(Tt) : !1) ||
                                K.every((I) => (Ke(I.placement) === U ? I.overflows[0] > 0 : !0)))
                        )
                            return { data: { index: At, overflows: K }, reset: { placement: Tt } };
                        let F =
                            (Mt = K.filter((J) => J.overflows[0] <= 0).sort(
                                (J, I) => J.overflows[1] - I.overflows[1]
                            )[0]) == null
                                ? void 0
                                : Mt.placement;
                        if (!F)
                            switch (x) {
                                case "bestFit": {
                                    var Et;
                                    const J =
                                        (Et = K.filter((I) => {
                                            if (k) {
                                                const rt = Ke(I.placement);
                                                return rt === U || rt === "y";
                                            }
                                            return !0;
                                        })
                                            .map((I) => [
                                                I.placement,
                                                I.overflows.filter((rt) => rt > 0).reduce((rt, S) => rt + S, 0),
                                            ])
                                            .sort((I, rt) => I[1] - rt[1])[0]) == null
                                            ? void 0
                                            : Et[0];
                                    J && (F = J);
                                    break;
                                }
                                case "initialPlacement":
                                    F = m;
                                    break;
                            }
                        if (c !== F) return { reset: { placement: F } };
                    }
                    return {};
                },
            }
        );
    };
function $0(a, i) {
    return { top: a.top - i.height, right: a.right - i.width, bottom: a.bottom - i.height, left: a.left - i.width };
}
function t3(a) {
    return Nh.some((i) => a[i] >= 0);
}
const Xh = function (a) {
        return (
            a === void 0 && (a = {}),
            {
                name: "hide",
                options: a,
                async fn(i) {
                    const { rects: o } = i,
                        { strategy: r = "referenceHidden", ...c } = bn(a, i);
                    switch (r) {
                        case "referenceHidden": {
                            const f = await Ei(i, { ...c, elementContext: "reference" }),
                                h = $0(f, o.reference);
                            return { data: { referenceHiddenOffsets: h, referenceHidden: t3(h) } };
                        }
                        case "escaped": {
                            const f = await Ei(i, { ...c, altBoundary: !0 }),
                                h = $0(f, o.floating);
                            return { data: { escapedOffsets: h, escaped: t3(h) } };
                        }
                        default:
                            return {};
                    }
                },
            }
        );
    },
    v5 = new Set(["left", "top"]);
async function qh(a, i) {
    const { placement: o, platform: r, elements: c } = a,
        f = await (r.isRTL == null ? void 0 : r.isRTL(c.floating)),
        h = En(o),
        m = gl(o),
        g = Ke(o) === "y",
        v = v5.has(h) ? -1 : 1,
        p = f && g ? -1 : 1,
        A = bn(i, a);
    let {
        mainAxis: E,
        crossAxis: x,
        alignmentAxis: H,
    } = typeof A == "number"
        ? { mainAxis: A, crossAxis: 0, alignmentAxis: null }
        : { mainAxis: A.mainAxis || 0, crossAxis: A.crossAxis || 0, alignmentAxis: A.alignmentAxis };
    return (
        m && typeof H == "number" && (x = m === "end" ? H * -1 : H), g ? { x: x * p, y: E * v } : { x: E * v, y: x * p }
    );
}
const Kh = function (a) {
        return (
            a === void 0 && (a = 0),
            {
                name: "offset",
                options: a,
                async fn(i) {
                    var o, r;
                    const { x: c, y: f, placement: h, middlewareData: m } = i,
                        g = await qh(i, a);
                    return h === ((o = m.offset) == null ? void 0 : o.placement) &&
                        (r = m.arrow) != null &&
                        r.alignmentOffset
                        ? {}
                        : { x: c + g.x, y: f + g.y, data: { ...g, placement: h } };
                },
            }
        );
    },
    Wh = function (a) {
        return (
            a === void 0 && (a = {}),
            {
                name: "shift",
                options: a,
                async fn(i) {
                    const { x: o, y: r, placement: c } = i,
                        {
                            mainAxis: f = !0,
                            crossAxis: h = !1,
                            limiter: m = {
                                fn: (_) => {
                                    let { x: V, y: U } = _;
                                    return { x: V, y: U };
                                },
                            },
                            ...g
                        } = bn(a, i),
                        v = { x: o, y: r },
                        p = await Ei(i, g),
                        A = Ke(En(c)),
                        E = pc(A);
                    let x = v[E],
                        H = v[A];
                    if (f) {
                        const _ = E === "y" ? "top" : "left",
                            V = E === "y" ? "bottom" : "right",
                            U = x + p[_],
                            Q = x - p[V];
                        x = ac(U, x, Q);
                    }
                    if (h) {
                        const _ = A === "y" ? "top" : "left",
                            V = A === "y" ? "bottom" : "right",
                            U = H + p[_],
                            Q = H - p[V];
                        H = ac(U, H, Q);
                    }
                    const D = m.fn({ ...i, [E]: x, [A]: H });
                    return { ...D, data: { x: D.x - o, y: D.y - r, enabled: { [E]: f, [A]: h } } };
                },
            }
        );
    },
    Jh = function (a) {
        return (
            a === void 0 && (a = {}),
            {
                options: a,
                fn(i) {
                    const { x: o, y: r, placement: c, rects: f, middlewareData: h } = i,
                        { offset: m = 0, mainAxis: g = !0, crossAxis: v = !0 } = bn(a, i),
                        p = { x: o, y: r },
                        A = Ke(c),
                        E = pc(A);
                    let x = p[E],
                        H = p[A];
                    const D = bn(m, i),
                        _ = typeof D == "number" ? { mainAxis: D, crossAxis: 0 } : { mainAxis: 0, crossAxis: 0, ...D };
                    if (g) {
                        const Q = E === "y" ? "height" : "width",
                            Y = f.reference[E] - f.floating[Q] + _.mainAxis,
                            R = f.reference[E] + f.reference[Q] - _.mainAxis;
                        x < Y ? (x = Y) : x > R && (x = R);
                    }
                    if (v) {
                        var V, U;
                        const Q = E === "y" ? "width" : "height",
                            Y = v5.has(En(c)),
                            R =
                                f.reference[A] -
                                f.floating[Q] +
                                ((Y && ((V = h.offset) == null ? void 0 : V[A])) || 0) +
                                (Y ? 0 : _.crossAxis),
                            k =
                                f.reference[A] +
                                f.reference[Q] +
                                (Y ? 0 : ((U = h.offset) == null ? void 0 : U[A]) || 0) -
                                (Y ? _.crossAxis : 0);
                        H < R ? (H = R) : H > k && (H = k);
                    }
                    return { [E]: x, [A]: H };
                },
            }
        );
    },
    $h = function (a) {
        return (
            a === void 0 && (a = {}),
            {
                name: "size",
                options: a,
                async fn(i) {
                    var o, r;
                    const { placement: c, rects: f, platform: h, elements: m } = i,
                        { apply: g = () => {}, ...v } = bn(a, i),
                        p = await Ei(i, v),
                        A = En(c),
                        E = gl(c),
                        x = Ke(c) === "y",
                        { width: H, height: D } = f.floating;
                    let _, V;
                    A === "top" || A === "bottom"
                        ? ((_ = A),
                          (V =
                              E === ((await (h.isRTL == null ? void 0 : h.isRTL(m.floating))) ? "start" : "end")
                                  ? "left"
                                  : "right"))
                        : ((V = A), (_ = E === "end" ? "top" : "bottom"));
                    const U = D - p.top - p.bottom,
                        Q = H - p.left - p.right,
                        Y = Pn(D - p[_], U),
                        R = Pn(H - p[V], Q),
                        k = !i.middlewareData.shift;
                    let X = Y,
                        st = R;
                    if (
                        ((o = i.middlewareData.shift) != null && o.enabled.x && (st = Q),
                        (r = i.middlewareData.shift) != null && r.enabled.y && (X = U),
                        k && !E)
                    ) {
                        const K = ye(p.left, 0),
                            gt = ye(p.right, 0),
                            Mt = ye(p.top, 0),
                            Et = ye(p.bottom, 0);
                        x
                            ? (st = H - 2 * (K !== 0 || gt !== 0 ? K + gt : ye(p.left, p.right)))
                            : (X = D - 2 * (Mt !== 0 || Et !== 0 ? Mt + Et : ye(p.top, p.bottom)));
                    }
                    await g({ ...i, availableWidth: st, availableHeight: X });
                    const P = await h.getDimensions(m.floating);
                    return H !== P.width || D !== P.height ? { reset: { rects: !0 } } : {};
                },
            }
        );
    };
function ou() {
    return typeof window < "u";
}
function pl(a) {
    return g5(a) ? (a.nodeName || "").toLowerCase() : "#document";
}
function Ae(a) {
    var i;
    return (a == null || (i = a.ownerDocument) == null ? void 0 : i.defaultView) || window;
}
function tn(a) {
    var i;
    return (i = (g5(a) ? a.ownerDocument : a.document) || window.document) == null ? void 0 : i.documentElement;
}
function g5(a) {
    return ou() ? a instanceof Node || a instanceof Ae(a).Node : !1;
}
function Ge(a) {
    return ou() ? a instanceof Element || a instanceof Ae(a).Element : !1;
}
function $e(a) {
    return ou() ? a instanceof HTMLElement || a instanceof Ae(a).HTMLElement : !1;
}
function e3(a) {
    return !ou() || typeof ShadowRoot > "u" ? !1 : a instanceof ShadowRoot || a instanceof Ae(a).ShadowRoot;
}
const t9 = new Set(["inline", "contents"]);
function wi(a) {
    const { overflow: i, overflowX: o, overflowY: r, display: c } = Qe(a);
    return /auto|scroll|overlay|hidden|clip/.test(i + r + o) && !t9.has(c);
}
const e9 = new Set(["table", "td", "th"]);
function n9(a) {
    return e9.has(pl(a));
}
const a9 = [":popover-open", ":modal"];
function su(a) {
    return a9.some((i) => {
        try {
            return a.matches(i);
        } catch {
            return !1;
        }
    });
}
const l9 = ["transform", "translate", "scale", "rotate", "perspective"],
    i9 = ["transform", "translate", "scale", "rotate", "perspective", "filter"],
    r9 = ["paint", "layout", "strict", "content"];
function bc(a) {
    const i = Ec(),
        o = Ge(a) ? Qe(a) : a;
    return (
        l9.some((r) => (o[r] ? o[r] !== "none" : !1)) ||
        (o.containerType ? o.containerType !== "normal" : !1) ||
        (!i && (o.backdropFilter ? o.backdropFilter !== "none" : !1)) ||
        (!i && (o.filter ? o.filter !== "none" : !1)) ||
        i9.some((r) => (o.willChange || "").includes(r)) ||
        r9.some((r) => (o.contain || "").includes(r))
    );
}
function u9(a) {
    let i = kn(a);
    for (; $e(i) && !dl(i); ) {
        if (bc(i)) return i;
        if (su(i)) return null;
        i = kn(i);
    }
    return null;
}
function Ec() {
    return typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter", "none");
}
const o9 = new Set(["html", "body", "#document"]);
function dl(a) {
    return o9.has(pl(a));
}
function Qe(a) {
    return Ae(a).getComputedStyle(a);
}
function cu(a) {
    return Ge(a)
        ? { scrollLeft: a.scrollLeft, scrollTop: a.scrollTop }
        : { scrollLeft: a.scrollX, scrollTop: a.scrollY };
}
function kn(a) {
    if (pl(a) === "html") return a;
    const i = a.assignedSlot || a.parentNode || (e3(a) && a.host) || tn(a);
    return e3(i) ? i.host : i;
}
function p5(a) {
    const i = kn(a);
    return dl(i) ? (a.ownerDocument ? a.ownerDocument.body : a.body) : $e(i) && wi(i) ? i : p5(i);
}
function Si(a, i, o) {
    var r;
    i === void 0 && (i = []), o === void 0 && (o = !0);
    const c = p5(a),
        f = c === ((r = a.ownerDocument) == null ? void 0 : r.body),
        h = Ae(c);
    if (f) {
        const m = ic(h);
        return i.concat(h, h.visualViewport || [], wi(c) ? c : [], m && o ? Si(m) : []);
    }
    return i.concat(c, Si(c, [], o));
}
function ic(a) {
    return a.parent && Object.getPrototypeOf(a.parent) ? a.frameElement : null;
}
function y5(a) {
    const i = Qe(a);
    let o = parseFloat(i.width) || 0,
        r = parseFloat(i.height) || 0;
    const c = $e(a),
        f = c ? a.offsetWidth : o,
        h = c ? a.offsetHeight : r,
        m = tu(o) !== f || tu(r) !== h;
    return m && ((o = f), (r = h)), { width: o, height: r, $: m };
}
function Sc(a) {
    return Ge(a) ? a : a.contextElement;
}
function fl(a) {
    const i = Sc(a);
    if (!$e(i)) return We(1);
    const o = i.getBoundingClientRect(),
        { width: r, height: c, $: f } = y5(i);
    let h = (f ? tu(o.width) : o.width) / r,
        m = (f ? tu(o.height) : o.height) / c;
    return (!h || !Number.isFinite(h)) && (h = 1), (!m || !Number.isFinite(m)) && (m = 1), { x: h, y: m };
}
const s9 = We(0);
function A5(a) {
    const i = Ae(a);
    return !Ec() || !i.visualViewport ? s9 : { x: i.visualViewport.offsetLeft, y: i.visualViewport.offsetTop };
}
function c9(a, i, o) {
    return i === void 0 && (i = !1), !o || (i && o !== Ae(a)) ? !1 : i;
}
function xa(a, i, o, r) {
    i === void 0 && (i = !1), o === void 0 && (o = !1);
    const c = a.getBoundingClientRect(),
        f = Sc(a);
    let h = We(1);
    i && (r ? Ge(r) && (h = fl(r)) : (h = fl(a)));
    const m = c9(f, o, r) ? A5(f) : We(0);
    let g = (c.left + m.x) / h.x,
        v = (c.top + m.y) / h.y,
        p = c.width / h.x,
        A = c.height / h.y;
    if (f) {
        const E = Ae(f),
            x = r && Ge(r) ? Ae(r) : r;
        let H = E,
            D = ic(H);
        for (; D && r && x !== H; ) {
            const _ = fl(D),
                V = D.getBoundingClientRect(),
                U = Qe(D),
                Q = V.left + (D.clientLeft + parseFloat(U.paddingLeft)) * _.x,
                Y = V.top + (D.clientTop + parseFloat(U.paddingTop)) * _.y;
            (g *= _.x), (v *= _.y), (p *= _.x), (A *= _.y), (g += Q), (v += Y), (H = Ae(D)), (D = ic(H));
        }
    }
    return nu({ width: p, height: A, x: g, y: v });
}
function fu(a, i) {
    const o = cu(a).scrollLeft;
    return i ? i.left + o : xa(tn(a)).left + o;
}
function b5(a, i) {
    const o = a.getBoundingClientRect(),
        r = o.left + i.scrollLeft - fu(a, o),
        c = o.top + i.scrollTop;
    return { x: r, y: c };
}
function f9(a) {
    let { elements: i, rect: o, offsetParent: r, strategy: c } = a;
    const f = c === "fixed",
        h = tn(r),
        m = i ? su(i.floating) : !1;
    if (r === h || (m && f)) return o;
    let g = { scrollLeft: 0, scrollTop: 0 },
        v = We(1);
    const p = We(0),
        A = $e(r);
    if ((A || (!A && !f)) && ((pl(r) !== "body" || wi(h)) && (g = cu(r)), $e(r))) {
        const x = xa(r);
        (v = fl(r)), (p.x = x.x + r.clientLeft), (p.y = x.y + r.clientTop);
    }
    const E = h && !A && !f ? b5(h, g) : We(0);
    return {
        width: o.width * v.x,
        height: o.height * v.y,
        x: o.x * v.x - g.scrollLeft * v.x + p.x + E.x,
        y: o.y * v.y - g.scrollTop * v.y + p.y + E.y,
    };
}
function h9(a) {
    return Array.from(a.getClientRects());
}
function d9(a) {
    const i = tn(a),
        o = cu(a),
        r = a.ownerDocument.body,
        c = ye(i.scrollWidth, i.clientWidth, r.scrollWidth, r.clientWidth),
        f = ye(i.scrollHeight, i.clientHeight, r.scrollHeight, r.clientHeight);
    let h = -o.scrollLeft + fu(a);
    const m = -o.scrollTop;
    return (
        Qe(r).direction === "rtl" && (h += ye(i.clientWidth, r.clientWidth) - c), { width: c, height: f, x: h, y: m }
    );
}
const n3 = 25;
function m9(a, i) {
    const o = Ae(a),
        r = tn(a),
        c = o.visualViewport;
    let f = r.clientWidth,
        h = r.clientHeight,
        m = 0,
        g = 0;
    if (c) {
        (f = c.width), (h = c.height);
        const p = Ec();
        (!p || (p && i === "fixed")) && ((m = c.offsetLeft), (g = c.offsetTop));
    }
    const v = fu(r);
    if (v <= 0) {
        const p = r.ownerDocument,
            A = p.body,
            E = getComputedStyle(A),
            x = (p.compatMode === "CSS1Compat" && parseFloat(E.marginLeft) + parseFloat(E.marginRight)) || 0,
            H = Math.abs(r.clientWidth - A.clientWidth - x);
        H <= n3 && (f -= H);
    } else v <= n3 && (f += v);
    return { width: f, height: h, x: m, y: g };
}
const v9 = new Set(["absolute", "fixed"]);
function g9(a, i) {
    const o = xa(a, !0, i === "fixed"),
        r = o.top + a.clientTop,
        c = o.left + a.clientLeft,
        f = $e(a) ? fl(a) : We(1),
        h = a.clientWidth * f.x,
        m = a.clientHeight * f.y,
        g = c * f.x,
        v = r * f.y;
    return { width: h, height: m, x: g, y: v };
}
function a3(a, i, o) {
    let r;
    if (i === "viewport") r = m9(a, o);
    else if (i === "document") r = d9(tn(a));
    else if (Ge(i)) r = g9(i, o);
    else {
        const c = A5(a);
        r = { x: i.x - c.x, y: i.y - c.y, width: i.width, height: i.height };
    }
    return nu(r);
}
function E5(a, i) {
    const o = kn(a);
    return o === i || !Ge(o) || dl(o) ? !1 : Qe(o).position === "fixed" || E5(o, i);
}
function p9(a, i) {
    const o = i.get(a);
    if (o) return o;
    let r = Si(a, [], !1).filter((m) => Ge(m) && pl(m) !== "body"),
        c = null;
    const f = Qe(a).position === "fixed";
    let h = f ? kn(a) : a;
    for (; Ge(h) && !dl(h); ) {
        const m = Qe(h),
            g = bc(h);
        !g && m.position === "fixed" && (c = null),
            (f ? !g && !c : (!g && m.position === "static" && !!c && v9.has(c.position)) || (wi(h) && !g && E5(a, h)))
                ? (r = r.filter((p) => p !== h))
                : (c = m),
            (h = kn(h));
    }
    return i.set(a, r), r;
}
function y9(a) {
    let { element: i, boundary: o, rootBoundary: r, strategy: c } = a;
    const h = [...(o === "clippingAncestors" ? (su(i) ? [] : p9(i, this._c)) : [].concat(o)), r],
        m = h[0],
        g = h.reduce(
            (v, p) => {
                const A = a3(i, p, c);
                return (
                    (v.top = ye(A.top, v.top)),
                    (v.right = Pn(A.right, v.right)),
                    (v.bottom = Pn(A.bottom, v.bottom)),
                    (v.left = ye(A.left, v.left)),
                    v
                );
            },
            a3(i, m, c)
        );
    return { width: g.right - g.left, height: g.bottom - g.top, x: g.left, y: g.top };
}
function A9(a) {
    const { width: i, height: o } = y5(a);
    return { width: i, height: o };
}
function b9(a, i, o) {
    const r = $e(i),
        c = tn(i),
        f = o === "fixed",
        h = xa(a, !0, f, i);
    let m = { scrollLeft: 0, scrollTop: 0 };
    const g = We(0);
    function v() {
        g.x = fu(c);
    }
    if (r || (!r && !f))
        if (((pl(i) !== "body" || wi(c)) && (m = cu(i)), r)) {
            const x = xa(i, !0, f, i);
            (g.x = x.x + i.clientLeft), (g.y = x.y + i.clientTop);
        } else c && v();
    f && !r && c && v();
    const p = c && !r && !f ? b5(c, m) : We(0),
        A = h.left + m.scrollLeft - g.x - p.x,
        E = h.top + m.scrollTop - g.y - p.y;
    return { x: A, y: E, width: h.width, height: h.height };
}
function zs(a) {
    return Qe(a).position === "static";
}
function l3(a, i) {
    if (!$e(a) || Qe(a).position === "fixed") return null;
    if (i) return i(a);
    let o = a.offsetParent;
    return tn(a) === o && (o = o.ownerDocument.body), o;
}
function S5(a, i) {
    const o = Ae(a);
    if (su(a)) return o;
    if (!$e(a)) {
        let c = kn(a);
        for (; c && !dl(c); ) {
            if (Ge(c) && !zs(c)) return c;
            c = kn(c);
        }
        return o;
    }
    let r = l3(a, i);
    for (; r && n9(r) && zs(r); ) r = l3(r, i);
    return r && dl(r) && zs(r) && !bc(r) ? o : r || u9(a) || o;
}
const E9 = async function (a) {
    const i = this.getOffsetParent || S5,
        o = this.getDimensions,
        r = await o(a.floating);
    return {
        reference: b9(a.reference, await i(a.floating), a.strategy),
        floating: { x: 0, y: 0, width: r.width, height: r.height },
    };
};
function S9(a) {
    return Qe(a).direction === "rtl";
}
const C9 = {
    convertOffsetParentRelativeRectToViewportRelativeRect: f9,
    getDocumentElement: tn,
    getClippingRect: y9,
    getOffsetParent: S5,
    getElementRects: E9,
    getClientRects: h9,
    getDimensions: A9,
    getScale: fl,
    isElement: Ge,
    isRTL: S9,
};
function C5(a, i) {
    return a.x === i.x && a.y === i.y && a.width === i.width && a.height === i.height;
}
function T9(a, i) {
    let o = null,
        r;
    const c = tn(a);
    function f() {
        var m;
        clearTimeout(r), (m = o) == null || m.disconnect(), (o = null);
    }
    function h(m, g) {
        m === void 0 && (m = !1), g === void 0 && (g = 1), f();
        const v = a.getBoundingClientRect(),
            { left: p, top: A, width: E, height: x } = v;
        if ((m || i(), !E || !x)) return;
        const H = Xr(A),
            D = Xr(c.clientWidth - (p + E)),
            _ = Xr(c.clientHeight - (A + x)),
            V = Xr(p),
            Q = { rootMargin: -H + "px " + -D + "px " + -_ + "px " + -V + "px", threshold: ye(0, Pn(1, g)) || 1 };
        let Y = !0;
        function R(k) {
            const X = k[0].intersectionRatio;
            if (X !== g) {
                if (!Y) return h();
                X
                    ? h(!1, X)
                    : (r = setTimeout(() => {
                          h(!1, 1e-7);
                      }, 1e3));
            }
            X === 1 && !C5(v, a.getBoundingClientRect()) && h(), (Y = !1);
        }
        try {
            o = new IntersectionObserver(R, { ...Q, root: c.ownerDocument });
        } catch {
            o = new IntersectionObserver(R, Q);
        }
        o.observe(a);
    }
    return h(!0), f;
}
function x9(a, i, o, r) {
    r === void 0 && (r = {});
    const {
            ancestorScroll: c = !0,
            ancestorResize: f = !0,
            elementResize: h = typeof ResizeObserver == "function",
            layoutShift: m = typeof IntersectionObserver == "function",
            animationFrame: g = !1,
        } = r,
        v = Sc(a),
        p = c || f ? [...(v ? Si(v) : []), ...Si(i)] : [];
    p.forEach((V) => {
        c && V.addEventListener("scroll", o, { passive: !0 }), f && V.addEventListener("resize", o);
    });
    const A = v && m ? T9(v, o) : null;
    let E = -1,
        x = null;
    h &&
        ((x = new ResizeObserver((V) => {
            let [U] = V;
            U &&
                U.target === v &&
                x &&
                (x.unobserve(i),
                cancelAnimationFrame(E),
                (E = requestAnimationFrame(() => {
                    var Q;
                    (Q = x) == null || Q.observe(i);
                }))),
                o();
        })),
        v && !g && x.observe(v),
        x.observe(i));
    let H,
        D = g ? xa(a) : null;
    g && _();
    function _() {
        const V = xa(a);
        D && !C5(D, V) && o(), (D = V), (H = requestAnimationFrame(_));
    }
    return (
        o(),
        () => {
            var V;
            p.forEach((U) => {
                c && U.removeEventListener("scroll", o), f && U.removeEventListener("resize", o);
            }),
                A?.(),
                (V = x) == null || V.disconnect(),
                (x = null),
                g && cancelAnimationFrame(H);
        }
    );
}
const M9 = Kh,
    R9 = Wh,
    w9 = kh,
    O9 = $h,
    H9 = Xh,
    i3 = Ph,
    B9 = Jh,
    D9 = (a, i, o) => {
        const r = new Map(),
            c = { platform: C9, ...o },
            f = { ...c.platform, _c: r };
        return Ih(a, i, { ...c, platform: f });
    };
var _9 = typeof document < "u",
    N9 = function () {},
    Jr = _9 ? C.useLayoutEffect : N9;
function au(a, i) {
    if (a === i) return !0;
    if (typeof a != typeof i) return !1;
    if (typeof a == "function" && a.toString() === i.toString()) return !0;
    let o, r, c;
    if (a && i && typeof a == "object") {
        if (Array.isArray(a)) {
            if (((o = a.length), o !== i.length)) return !1;
            for (r = o; r-- !== 0; ) if (!au(a[r], i[r])) return !1;
            return !0;
        }
        if (((c = Object.keys(a)), (o = c.length), o !== Object.keys(i).length)) return !1;
        for (r = o; r-- !== 0; ) if (!{}.hasOwnProperty.call(i, c[r])) return !1;
        for (r = o; r-- !== 0; ) {
            const f = c[r];
            if (!(f === "_owner" && a.$$typeof) && !au(a[f], i[f])) return !1;
        }
        return !0;
    }
    return a !== a && i !== i;
}
function T5(a) {
    return typeof window > "u" ? 1 : (a.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function r3(a, i) {
    const o = T5(a);
    return Math.round(i * o) / o;
}
function Gs(a) {
    const i = C.useRef(a);
    return (
        Jr(() => {
            i.current = a;
        }),
        i
    );
}
function L9(a) {
    a === void 0 && (a = {});
    const {
            placement: i = "bottom",
            strategy: o = "absolute",
            middleware: r = [],
            platform: c,
            elements: { reference: f, floating: h } = {},
            transform: m = !0,
            whileElementsMounted: g,
            open: v,
        } = a,
        [p, A] = C.useState({ x: 0, y: 0, strategy: o, placement: i, middlewareData: {}, isPositioned: !1 }),
        [E, x] = C.useState(r);
    au(E, r) || x(r);
    const [H, D] = C.useState(null),
        [_, V] = C.useState(null),
        U = C.useCallback((I) => {
            I !== k.current && ((k.current = I), D(I));
        }, []),
        Q = C.useCallback((I) => {
            I !== X.current && ((X.current = I), V(I));
        }, []),
        Y = f || H,
        R = h || _,
        k = C.useRef(null),
        X = C.useRef(null),
        st = C.useRef(p),
        P = g != null,
        K = Gs(g),
        gt = Gs(c),
        Mt = Gs(v),
        Et = C.useCallback(() => {
            if (!k.current || !X.current) return;
            const I = { placement: i, strategy: o, middleware: E };
            gt.current && (I.platform = gt.current),
                D9(k.current, X.current, I).then((rt) => {
                    const S = { ...rt, isPositioned: Mt.current !== !1 };
                    At.current &&
                        !au(st.current, S) &&
                        ((st.current = S),
                        gc.flushSync(() => {
                            A(S);
                        }));
                });
        }, [E, i, o, gt, Mt]);
    Jr(() => {
        v === !1 && st.current.isPositioned && ((st.current.isPositioned = !1), A((I) => ({ ...I, isPositioned: !1 })));
    }, [v]);
    const At = C.useRef(!1);
    Jr(
        () => (
            (At.current = !0),
            () => {
                At.current = !1;
            }
        ),
        []
    ),
        Jr(() => {
            if ((Y && (k.current = Y), R && (X.current = R), Y && R)) {
                if (K.current) return K.current(Y, R, Et);
                Et();
            }
        }, [Y, R, Et, K, P]);
    const Tt = C.useMemo(() => ({ reference: k, floating: X, setReference: U, setFloating: Q }), [U, Q]),
        F = C.useMemo(() => ({ reference: Y, floating: R }), [Y, R]),
        J = C.useMemo(() => {
            const I = { position: o, left: 0, top: 0 };
            if (!F.floating) return I;
            const rt = r3(F.floating, p.x),
                S = r3(F.floating, p.y);
            return m
                ? {
                      ...I,
                      transform: "translate(" + rt + "px, " + S + "px)",
                      ...(T5(F.floating) >= 1.5 && { willChange: "transform" }),
                  }
                : { position: o, left: rt, top: S };
        }, [o, m, F.floating, p.x, p.y]);
    return C.useMemo(() => ({ ...p, update: Et, refs: Tt, elements: F, floatingStyles: J }), [p, Et, Tt, F, J]);
}
const U9 = (a) => {
        function i(o) {
            return {}.hasOwnProperty.call(o, "current");
        }
        return {
            name: "arrow",
            options: a,
            fn(o) {
                const { element: r, padding: c } = typeof a == "function" ? a(o) : a;
                return r && i(r)
                    ? r.current != null
                        ? i3({ element: r.current, padding: c }).fn(o)
                        : {}
                    : r
                      ? i3({ element: r, padding: c }).fn(o)
                      : {};
            },
        };
    },
    V9 = (a, i) => ({ ...M9(a), options: [a, i] }),
    z9 = (a, i) => ({ ...R9(a), options: [a, i] }),
    G9 = (a, i) => ({ ...B9(a), options: [a, i] }),
    Q9 = (a, i) => ({ ...w9(a), options: [a, i] }),
    Z9 = (a, i) => ({ ...O9(a), options: [a, i] }),
    j9 = (a, i) => ({ ...H9(a), options: [a, i] }),
    F9 = (a, i) => ({ ...U9(a), options: [a, i] });
var Y9 = "Arrow",
    x5 = C.forwardRef((a, i) => {
        const { children: o, width: r = 10, height: c = 5, ...f } = a;
        return z.jsx(Kn.svg, {
            ...f,
            ref: i,
            width: r,
            height: c,
            viewBox: "0 0 30 10",
            preserveAspectRatio: "none",
            children: a.asChild ? o : z.jsx("polygon", { points: "0,0 30,0 15,10" }),
        });
    });
x5.displayName = Y9;
var I9 = x5;
function P9(a) {
    const [i, o] = C.useState(void 0);
    return (
        In(() => {
            if (a) {
                o({ width: a.offsetWidth, height: a.offsetHeight });
                const r = new ResizeObserver((c) => {
                    if (!Array.isArray(c) || !c.length) return;
                    const f = c[0];
                    let h, m;
                    if ("borderBoxSize" in f) {
                        const g = f.borderBoxSize,
                            v = Array.isArray(g) ? g[0] : g;
                        (h = v.inlineSize), (m = v.blockSize);
                    } else (h = a.offsetWidth), (m = a.offsetHeight);
                    o({ width: h, height: m });
                });
                return r.observe(a, { box: "border-box" }), () => r.unobserve(a);
            } else o(void 0);
        }, [a]),
        i
    );
}
var Cc = "Popper",
    [M5, R5] = s5(Cc),
    [k9, w5] = M5(Cc),
    O5 = (a) => {
        const { __scopePopper: i, children: o } = a,
            [r, c] = C.useState(null);
        return z.jsx(k9, { scope: i, anchor: r, onAnchorChange: c, children: o });
    };
O5.displayName = Cc;
var H5 = "PopperAnchor",
    B5 = C.forwardRef((a, i) => {
        const { __scopePopper: o, virtualRef: r, ...c } = a,
            f = w5(H5, o),
            h = C.useRef(null),
            m = Ra(i, h),
            g = C.useRef(null);
        return (
            C.useEffect(() => {
                const v = g.current;
                (g.current = r?.current || h.current), v !== g.current && f.onAnchorChange(g.current);
            }),
            r ? null : z.jsx(Kn.div, { ...c, ref: m })
        );
    });
B5.displayName = H5;
var Tc = "PopperContent",
    [X9, q9] = M5(Tc),
    D5 = C.forwardRef((a, i) => {
        const {
                __scopePopper: o,
                side: r = "bottom",
                sideOffset: c = 0,
                align: f = "center",
                alignOffset: h = 0,
                arrowPadding: m = 0,
                avoidCollisions: g = !0,
                collisionBoundary: v = [],
                collisionPadding: p = 0,
                sticky: A = "partial",
                hideWhenDetached: E = !1,
                updatePositionStrategy: x = "optimized",
                onPlaced: H,
                ...D
            } = a,
            _ = w5(Tc, o),
            [V, U] = C.useState(null),
            Q = Ra(i, (Zt) => U(Zt)),
            [Y, R] = C.useState(null),
            k = P9(Y),
            X = k?.width ?? 0,
            st = k?.height ?? 0,
            P = r + (f !== "center" ? "-" + f : ""),
            K = typeof p == "number" ? p : { top: 0, right: 0, bottom: 0, left: 0, ...p },
            gt = Array.isArray(v) ? v : [v],
            Mt = gt.length > 0,
            Et = { padding: K, boundary: gt.filter(W9), altBoundary: Mt },
            {
                refs: At,
                floatingStyles: Tt,
                placement: F,
                isPositioned: J,
                middlewareData: I,
            } = L9({
                strategy: "absolute",
                placement: P,
                whileElementsMounted: (...Zt) => x9(...Zt, { animationFrame: x === "always" }),
                elements: { reference: _.anchor },
                middleware: [
                    V9({ mainAxis: c + st, alignmentAxis: h }),
                    g && z9({ mainAxis: !0, crossAxis: !1, limiter: A === "partial" ? G9() : void 0, ...Et }),
                    g && Q9({ ...Et }),
                    Z9({
                        ...Et,
                        apply: ({ elements: Zt, rects: bt, availableWidth: Vt, availableHeight: Bt }) => {
                            const { width: be, height: Wn } = bt.reference,
                                ce = Zt.floating.style;
                            ce.setProperty("--radix-popper-available-width", `${Vt}px`),
                                ce.setProperty("--radix-popper-available-height", `${Bt}px`),
                                ce.setProperty("--radix-popper-anchor-width", `${be}px`),
                                ce.setProperty("--radix-popper-anchor-height", `${Wn}px`);
                        },
                    }),
                    Y && F9({ element: Y, padding: m }),
                    J9({ arrowWidth: X, arrowHeight: st }),
                    E && j9({ strategy: "referenceHidden", ...Et }),
                ],
            }),
            [rt, S] = L5(F),
            j = uu(H);
        In(() => {
            J && j?.();
        }, [J, j]);
        const at = I.arrow?.x,
            nt = I.arrow?.y,
            q = I.arrow?.centerOffset !== 0,
            [dt, ut] = C.useState();
        return (
            In(() => {
                V && ut(window.getComputedStyle(V).zIndex);
            }, [V]),
            z.jsx("div", {
                ref: At.setFloating,
                "data-radix-popper-content-wrapper": "",
                style: {
                    ...Tt,
                    transform: J ? Tt.transform : "translate(0, -200%)",
                    minWidth: "max-content",
                    zIndex: dt,
                    "--radix-popper-transform-origin": [I.transformOrigin?.x, I.transformOrigin?.y].join(" "),
                    ...(I.hide?.referenceHidden && { visibility: "hidden", pointerEvents: "none" }),
                },
                dir: a.dir,
                children: z.jsx(X9, {
                    scope: o,
                    placedSide: rt,
                    onArrowChange: R,
                    arrowX: at,
                    arrowY: nt,
                    shouldHideArrow: q,
                    children: z.jsx(Kn.div, {
                        "data-side": rt,
                        "data-align": S,
                        ...D,
                        ref: Q,
                        style: { ...D.style, animation: J ? void 0 : "none" },
                    }),
                }),
            })
        );
    });
D5.displayName = Tc;
var _5 = "PopperArrow",
    K9 = { top: "bottom", right: "left", bottom: "top", left: "right" },
    N5 = C.forwardRef(function (i, o) {
        const { __scopePopper: r, ...c } = i,
            f = q9(_5, r),
            h = K9[f.placedSide];
        return z.jsx("span", {
            ref: f.onArrowChange,
            style: {
                position: "absolute",
                left: f.arrowX,
                top: f.arrowY,
                [h]: 0,
                transformOrigin: { top: "", right: "0 0", bottom: "center 0", left: "100% 0" }[f.placedSide],
                transform: {
                    top: "translateY(100%)",
                    right: "translateY(50%) rotate(90deg) translateX(-50%)",
                    bottom: "rotate(180deg)",
                    left: "translateY(50%) rotate(-90deg) translateX(50%)",
                }[f.placedSide],
                visibility: f.shouldHideArrow ? "hidden" : void 0,
            },
            children: z.jsx(I9, { ...c, ref: o, style: { ...c.style, display: "block" } }),
        });
    });
N5.displayName = _5;
function W9(a) {
    return a !== null;
}
var J9 = (a) => ({
    name: "transformOrigin",
    options: a,
    fn(i) {
        const { placement: o, rects: r, middlewareData: c } = i,
            h = c.arrow?.centerOffset !== 0,
            m = h ? 0 : a.arrowWidth,
            g = h ? 0 : a.arrowHeight,
            [v, p] = L5(o),
            A = { start: "0%", center: "50%", end: "100%" }[p],
            E = (c.arrow?.x ?? 0) + m / 2,
            x = (c.arrow?.y ?? 0) + g / 2;
        let H = "",
            D = "";
        return (
            v === "bottom"
                ? ((H = h ? A : `${E}px`), (D = `${-g}px`))
                : v === "top"
                  ? ((H = h ? A : `${E}px`), (D = `${r.floating.height + g}px`))
                  : v === "right"
                    ? ((H = `${-g}px`), (D = h ? A : `${x}px`))
                    : v === "left" && ((H = `${r.floating.width + g}px`), (D = h ? A : `${x}px`)),
            { data: { x: H, y: D } }
        );
    },
});
function L5(a) {
    const [i, o = "center"] = a.split("-");
    return [i, o];
}
var $9 = O5,
    td = B5,
    ed = D5,
    nd = N5,
    ad = "Portal",
    U5 = C.forwardRef((a, i) => {
        const { container: o, ...r } = a,
            [c, f] = C.useState(!1);
        In(() => f(!0), []);
        const h = o || (c && globalThis?.document?.body);
        return h ? mh.createPortal(z.jsx(Kn.div, { ...r, ref: i }), h) : null;
    });
U5.displayName = ad;
function ld(a, i) {
    return C.useReducer((o, r) => i[o][r] ?? o, a);
}
var xc = (a) => {
    const { present: i, children: o } = a,
        r = id(i),
        c = typeof o == "function" ? o({ present: r.isPresent }) : C.Children.only(o),
        f = Ra(r.ref, rd(c));
    return typeof o == "function" || r.isPresent ? C.cloneElement(c, { ref: f }) : null;
};
xc.displayName = "Presence";
function id(a) {
    const [i, o] = C.useState(),
        r = C.useRef(null),
        c = C.useRef(a),
        f = C.useRef("none"),
        h = a ? "mounted" : "unmounted",
        [m, g] = ld(h, {
            mounted: { UNMOUNT: "unmounted", ANIMATION_OUT: "unmountSuspended" },
            unmountSuspended: { MOUNT: "mounted", ANIMATION_END: "unmounted" },
            unmounted: { MOUNT: "mounted" },
        });
    return (
        C.useEffect(() => {
            const v = qr(r.current);
            f.current = m === "mounted" ? v : "none";
        }, [m]),
        In(() => {
            const v = r.current,
                p = c.current;
            if (p !== a) {
                const E = f.current,
                    x = qr(v);
                a
                    ? g("MOUNT")
                    : x === "none" || v?.display === "none"
                      ? g("UNMOUNT")
                      : g(p && E !== x ? "ANIMATION_OUT" : "UNMOUNT"),
                    (c.current = a);
            }
        }, [a, g]),
        In(() => {
            if (i) {
                let v;
                const p = i.ownerDocument.defaultView ?? window,
                    A = (x) => {
                        const D = qr(r.current).includes(CSS.escape(x.animationName));
                        if (x.target === i && D && (g("ANIMATION_END"), !c.current)) {
                            const _ = i.style.animationFillMode;
                            (i.style.animationFillMode = "forwards"),
                                (v = p.setTimeout(() => {
                                    i.style.animationFillMode === "forwards" && (i.style.animationFillMode = _);
                                }));
                        }
                    },
                    E = (x) => {
                        x.target === i && (f.current = qr(r.current));
                    };
                return (
                    i.addEventListener("animationstart", E),
                    i.addEventListener("animationcancel", A),
                    i.addEventListener("animationend", A),
                    () => {
                        p.clearTimeout(v),
                            i.removeEventListener("animationstart", E),
                            i.removeEventListener("animationcancel", A),
                            i.removeEventListener("animationend", A);
                    }
                );
            } else g("ANIMATION_END");
        }, [i, g]),
        {
            isPresent: ["mounted", "unmountSuspended"].includes(m),
            ref: C.useCallback((v) => {
                (r.current = v ? getComputedStyle(v) : null), o(v);
            }, []),
        }
    );
}
function qr(a) {
    return a?.animationName || "none";
}
function rd(a) {
    let i = Object.getOwnPropertyDescriptor(a.props, "ref")?.get,
        o = i && "isReactWarning" in i && i.isReactWarning;
    return o
        ? a.ref
        : ((i = Object.getOwnPropertyDescriptor(a, "ref")?.get),
          (o = i && "isReactWarning" in i && i.isReactWarning),
          o ? a.props.ref : a.props.ref || a.ref);
}
var ud = V3[" useInsertionEffect ".trim().toString()] || In;
function od({ prop: a, defaultProp: i, onChange: o = () => {}, caller: r }) {
    const [c, f, h] = sd({ defaultProp: i, onChange: o }),
        m = a !== void 0,
        g = m ? a : c;
    {
        const p = C.useRef(a !== void 0);
        C.useEffect(() => {
            const A = p.current;
            A !== m &&
                console.warn(
                    `${r} is changing from ${A ? "controlled" : "uncontrolled"} to ${m ? "controlled" : "uncontrolled"}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`
                ),
                (p.current = m);
        }, [m, r]);
    }
    const v = C.useCallback(
        (p) => {
            if (m) {
                const A = cd(p) ? p(a) : p;
                A !== a && h.current?.(A);
            } else f(p);
        },
        [m, a, f, h]
    );
    return [g, v];
}
function sd({ defaultProp: a, onChange: i }) {
    const [o, r] = C.useState(a),
        c = C.useRef(o),
        f = C.useRef(i);
    return (
        ud(() => {
            f.current = i;
        }, [i]),
        C.useEffect(() => {
            c.current !== o && (f.current?.(o), (c.current = o));
        }, [o, c]),
        [o, r, f]
    );
}
function cd(a) {
    return typeof a == "function";
}
var fd = Object.freeze({
        position: "absolute",
        border: 0,
        width: 1,
        height: 1,
        padding: 0,
        margin: -1,
        overflow: "hidden",
        clip: "rect(0, 0, 0, 0)",
        whiteSpace: "nowrap",
        wordWrap: "normal",
    }),
    hd = "VisuallyHidden",
    V5 = C.forwardRef((a, i) => z.jsx(Kn.span, { ...a, ref: i, style: { ...fd, ...a.style } }));
V5.displayName = hd;
var dd = V5,
    [hu] = s5("Tooltip", [R5]),
    du = R5(),
    z5 = "TooltipProvider",
    md = 700,
    rc = "tooltip.open",
    [vd, Mc] = hu(z5),
    G5 = (a) => {
        const {
                __scopeTooltip: i,
                delayDuration: o = md,
                skipDelayDuration: r = 300,
                disableHoverableContent: c = !1,
                children: f,
            } = a,
            h = C.useRef(!0),
            m = C.useRef(!1),
            g = C.useRef(0);
        return (
            C.useEffect(() => {
                const v = g.current;
                return () => window.clearTimeout(v);
            }, []),
            z.jsx(vd, {
                scope: i,
                isOpenDelayedRef: h,
                delayDuration: o,
                onOpen: C.useCallback(() => {
                    window.clearTimeout(g.current), (h.current = !1);
                }, []),
                onClose: C.useCallback(() => {
                    window.clearTimeout(g.current), (g.current = window.setTimeout(() => (h.current = !0), r));
                }, [r]),
                isPointerInTransitRef: m,
                onPointerInTransitChange: C.useCallback((v) => {
                    m.current = v;
                }, []),
                disableHoverableContent: c,
                children: f,
            })
        );
    };
G5.displayName = z5;
var Ci = "Tooltip",
    [gd, Oi] = hu(Ci),
    Q5 = (a) => {
        const {
                __scopeTooltip: i,
                children: o,
                open: r,
                defaultOpen: c,
                onOpenChange: f,
                disableHoverableContent: h,
                delayDuration: m,
            } = a,
            g = Mc(Ci, a.__scopeTooltip),
            v = du(i),
            [p, A] = C.useState(null),
            E = _h(),
            x = C.useRef(0),
            H = h ?? g.disableHoverableContent,
            D = m ?? g.delayDuration,
            _ = C.useRef(!1),
            [V, U] = od({
                prop: r,
                defaultProp: c ?? !1,
                onChange: (X) => {
                    X ? (g.onOpen(), document.dispatchEvent(new CustomEvent(rc))) : g.onClose(), f?.(X);
                },
                caller: Ci,
            }),
            Q = C.useMemo(() => (V ? (_.current ? "delayed-open" : "instant-open") : "closed"), [V]),
            Y = C.useCallback(() => {
                window.clearTimeout(x.current), (x.current = 0), (_.current = !1), U(!0);
            }, [U]),
            R = C.useCallback(() => {
                window.clearTimeout(x.current), (x.current = 0), U(!1);
            }, [U]),
            k = C.useCallback(() => {
                window.clearTimeout(x.current),
                    (x.current = window.setTimeout(() => {
                        (_.current = !0), U(!0), (x.current = 0);
                    }, D));
            }, [D, U]);
        return (
            C.useEffect(
                () => () => {
                    x.current && (window.clearTimeout(x.current), (x.current = 0));
                },
                []
            ),
            z.jsx($9, {
                ...v,
                children: z.jsx(gd, {
                    scope: i,
                    contentId: E,
                    open: V,
                    stateAttribute: Q,
                    trigger: p,
                    onTriggerChange: A,
                    onTriggerEnter: C.useCallback(() => {
                        g.isOpenDelayedRef.current ? k() : Y();
                    }, [g.isOpenDelayedRef, k, Y]),
                    onTriggerLeave: C.useCallback(() => {
                        H ? R() : (window.clearTimeout(x.current), (x.current = 0));
                    }, [R, H]),
                    onOpen: Y,
                    onClose: R,
                    disableHoverableContent: H,
                    children: o,
                }),
            })
        );
    };
Q5.displayName = Ci;
var uc = "TooltipTrigger",
    Z5 = C.forwardRef((a, i) => {
        const { __scopeTooltip: o, ...r } = a,
            c = Oi(uc, o),
            f = Mc(uc, o),
            h = du(o),
            m = C.useRef(null),
            g = Ra(i, m, c.onTriggerChange),
            v = C.useRef(!1),
            p = C.useRef(!1),
            A = C.useCallback(() => (v.current = !1), []);
        return (
            C.useEffect(() => () => document.removeEventListener("pointerup", A), [A]),
            z.jsx(td, {
                asChild: !0,
                ...h,
                children: z.jsx(Kn.button, {
                    "aria-describedby": c.open ? c.contentId : void 0,
                    "data-state": c.stateAttribute,
                    ...r,
                    ref: g,
                    onPointerMove: An(a.onPointerMove, (E) => {
                        E.pointerType !== "touch" &&
                            !p.current &&
                            !f.isPointerInTransitRef.current &&
                            (c.onTriggerEnter(), (p.current = !0));
                    }),
                    onPointerLeave: An(a.onPointerLeave, () => {
                        c.onTriggerLeave(), (p.current = !1);
                    }),
                    onPointerDown: An(a.onPointerDown, () => {
                        c.open && c.onClose(),
                            (v.current = !0),
                            document.addEventListener("pointerup", A, { once: !0 });
                    }),
                    onFocus: An(a.onFocus, () => {
                        v.current || c.onOpen();
                    }),
                    onBlur: An(a.onBlur, c.onClose),
                    onClick: An(a.onClick, c.onClose),
                }),
            })
        );
    });
Z5.displayName = uc;
var Rc = "TooltipPortal",
    [pd, yd] = hu(Rc, { forceMount: void 0 }),
    j5 = (a) => {
        const { __scopeTooltip: i, forceMount: o, children: r, container: c } = a,
            f = Oi(Rc, i);
        return z.jsx(pd, {
            scope: i,
            forceMount: o,
            children: z.jsx(xc, {
                present: o || f.open,
                children: z.jsx(U5, { asChild: !0, container: c, children: r }),
            }),
        });
    };
j5.displayName = Rc;
var ml = "TooltipContent",
    F5 = C.forwardRef((a, i) => {
        const o = yd(ml, a.__scopeTooltip),
            { forceMount: r = o.forceMount, side: c = "top", ...f } = a,
            h = Oi(ml, a.__scopeTooltip);
        return z.jsx(xc, {
            present: r || h.open,
            children: h.disableHoverableContent
                ? z.jsx(Y5, { side: c, ...f, ref: i })
                : z.jsx(Ad, { side: c, ...f, ref: i }),
        });
    }),
    Ad = C.forwardRef((a, i) => {
        const o = Oi(ml, a.__scopeTooltip),
            r = Mc(ml, a.__scopeTooltip),
            c = C.useRef(null),
            f = Ra(i, c),
            [h, m] = C.useState(null),
            { trigger: g, onClose: v } = o,
            p = c.current,
            { onPointerInTransitChange: A } = r,
            E = C.useCallback(() => {
                m(null), A(!1);
            }, [A]),
            x = C.useCallback(
                (H, D) => {
                    const _ = H.currentTarget,
                        V = { x: H.clientX, y: H.clientY },
                        U = Cd(V, _.getBoundingClientRect()),
                        Q = Td(V, U),
                        Y = xd(D.getBoundingClientRect()),
                        R = Rd([...Q, ...Y]);
                    m(R), A(!0);
                },
                [A]
            );
        return (
            C.useEffect(() => () => E(), [E]),
            C.useEffect(() => {
                if (g && p) {
                    const H = (_) => x(_, p),
                        D = (_) => x(_, g);
                    return (
                        g.addEventListener("pointerleave", H),
                        p.addEventListener("pointerleave", D),
                        () => {
                            g.removeEventListener("pointerleave", H), p.removeEventListener("pointerleave", D);
                        }
                    );
                }
            }, [g, p, x, E]),
            C.useEffect(() => {
                if (h) {
                    const H = (D) => {
                        const _ = D.target,
                            V = { x: D.clientX, y: D.clientY },
                            U = g?.contains(_) || p?.contains(_),
                            Q = !Md(V, h);
                        U ? E() : Q && (E(), v());
                    };
                    return (
                        document.addEventListener("pointermove", H),
                        () => document.removeEventListener("pointermove", H)
                    );
                }
            }, [g, p, h, v, E]),
            z.jsx(Y5, { ...a, ref: f })
        );
    }),
    [bd, Ed] = hu(Ci, { isInside: !1 }),
    Sd = ph("TooltipContent"),
    Y5 = C.forwardRef((a, i) => {
        const {
                __scopeTooltip: o,
                children: r,
                "aria-label": c,
                onEscapeKeyDown: f,
                onPointerDownOutside: h,
                ...m
            } = a,
            g = Oi(ml, o),
            v = du(o),
            { onClose: p } = g;
        return (
            C.useEffect(() => (document.addEventListener(rc, p), () => document.removeEventListener(rc, p)), [p]),
            C.useEffect(() => {
                if (g.trigger) {
                    const A = (E) => {
                        E.target?.contains(g.trigger) && p();
                    };
                    return (
                        window.addEventListener("scroll", A, { capture: !0 }),
                        () => window.removeEventListener("scroll", A, { capture: !0 })
                    );
                }
            }, [g.trigger, p]),
            z.jsx(h5, {
                asChild: !0,
                disableOutsidePointerEvents: !1,
                onEscapeKeyDown: f,
                onPointerDownOutside: h,
                onFocusOutside: (A) => A.preventDefault(),
                onDismiss: p,
                children: z.jsxs(ed, {
                    "data-state": g.stateAttribute,
                    ...v,
                    ...m,
                    ref: i,
                    style: {
                        ...m.style,
                        "--radix-tooltip-content-transform-origin": "var(--radix-popper-transform-origin)",
                        "--radix-tooltip-content-available-width": "var(--radix-popper-available-width)",
                        "--radix-tooltip-content-available-height": "var(--radix-popper-available-height)",
                        "--radix-tooltip-trigger-width": "var(--radix-popper-anchor-width)",
                        "--radix-tooltip-trigger-height": "var(--radix-popper-anchor-height)",
                    },
                    children: [
                        z.jsx(Sd, { children: r }),
                        z.jsx(bd, {
                            scope: o,
                            isInside: !0,
                            children: z.jsx(dd, { id: g.contentId, role: "tooltip", children: c || r }),
                        }),
                    ],
                }),
            })
        );
    });
F5.displayName = ml;
var I5 = "TooltipArrow",
    P5 = C.forwardRef((a, i) => {
        const { __scopeTooltip: o, ...r } = a,
            c = du(o);
        return Ed(I5, o).isInside ? null : z.jsx(nd, { ...c, ...r, ref: i });
    });
P5.displayName = I5;
function Cd(a, i) {
    const o = Math.abs(i.top - a.y),
        r = Math.abs(i.bottom - a.y),
        c = Math.abs(i.right - a.x),
        f = Math.abs(i.left - a.x);
    switch (Math.min(o, r, c, f)) {
        case f:
            return "left";
        case c:
            return "right";
        case o:
            return "top";
        case r:
            return "bottom";
        default:
            throw new Error("unreachable");
    }
}
function Td(a, i, o = 5) {
    const r = [];
    switch (i) {
        case "top":
            r.push({ x: a.x - o, y: a.y + o }, { x: a.x + o, y: a.y + o });
            break;
        case "bottom":
            r.push({ x: a.x - o, y: a.y - o }, { x: a.x + o, y: a.y - o });
            break;
        case "left":
            r.push({ x: a.x + o, y: a.y - o }, { x: a.x + o, y: a.y + o });
            break;
        case "right":
            r.push({ x: a.x - o, y: a.y - o }, { x: a.x - o, y: a.y + o });
            break;
    }
    return r;
}
function xd(a) {
    const { top: i, right: o, bottom: r, left: c } = a;
    return [
        { x: c, y: i },
        { x: o, y: i },
        { x: o, y: r },
        { x: c, y: r },
    ];
}
function Md(a, i) {
    const { x: o, y: r } = a;
    let c = !1;
    for (let f = 0, h = i.length - 1; f < i.length; h = f++) {
        const m = i[f],
            g = i[h],
            v = m.x,
            p = m.y,
            A = g.x,
            E = g.y;
        p > r != E > r && o < ((A - v) * (r - p)) / (E - p) + v && (c = !c);
    }
    return c;
}
function Rd(a) {
    const i = a.slice();
    return i.sort((o, r) => (o.x < r.x ? -1 : o.x > r.x ? 1 : o.y < r.y ? -1 : o.y > r.y ? 1 : 0)), wd(i);
}
function wd(a) {
    if (a.length <= 1) return a.slice();
    const i = [];
    for (let r = 0; r < a.length; r++) {
        const c = a[r];
        for (; i.length >= 2; ) {
            const f = i[i.length - 1],
                h = i[i.length - 2];
            if ((f.x - h.x) * (c.y - h.y) >= (f.y - h.y) * (c.x - h.x)) i.pop();
            else break;
        }
        i.push(c);
    }
    i.pop();
    const o = [];
    for (let r = a.length - 1; r >= 0; r--) {
        const c = a[r];
        for (; o.length >= 2; ) {
            const f = o[o.length - 1],
                h = o[o.length - 2];
            if ((f.x - h.x) * (c.y - h.y) >= (f.y - h.y) * (c.x - h.x)) o.pop();
            else break;
        }
        o.push(c);
    }
    return o.pop(), i.length === 1 && o.length === 1 && i[0].x === o[0].x && i[0].y === o[0].y ? i : i.concat(o);
}
var Od = G5,
    Hd = Q5,
    Bd = Z5,
    Dd = j5,
    _d = F5,
    Nd = P5;
const Qs = globalThis.__CONTEXT_REGISTRY__ || (globalThis.__CONTEXT_REGISTRY__ = {});
function wc(a, i) {
    if (Qs[a]) return Qs[a];
    const o = Ca.createContext(i);
    return (o.displayName = a), (Qs[a] = o), o;
}
const Ld = wc("ModalContext", void 0),
    u3 = (a) => {
        let i;
        const o = new Set(),
            r = (v, p) => {
                const A = typeof v == "function" ? v(i) : v;
                if (!Object.is(A, i)) {
                    const E = i;
                    (i = (p ?? (typeof A != "object" || A === null)) ? A : Object.assign({}, i, A)),
                        o.forEach((x) => x(i, E));
                }
            },
            c = () => i,
            m = { setState: r, getState: c, getInitialState: () => g, subscribe: (v) => (o.add(v), () => o.delete(v)) },
            g = (i = a(r, c, m));
        return m;
    },
    Ud = (a) => (a ? u3(a) : u3),
    o3 = { modals: new Map(), stack: new Set() },
    Vd = (a) => {
        const i = (o, r) => ({
            ...o3,
            resetStore: () => {
                o((c) => ({ ...c, ...o3 }));
            },
            resetModals: () => o((c) => ({ ...c, modals: new Map(), stack: new Set() })),
            generateId: a.generateId,
            addModal: (c) => {
                const f = r().generateId(),
                    h = () => r().removeModal({ id: f }),
                    m = { id: f, modal: c.modal, userClose: c.props.onClose, props: { ...c.props, onClose: h } },
                    g = new Map(r().modals);
                g.set(f, m);
                const v = new Set(r().stack);
                return v.add(f), o((p) => ({ ...p, modals: g, stack: v })), m;
            },
            getModalById: (c) => r().modals.get(c.id) || null,
            getModalIds: () => Array.from(r().modals.keys()),
            updateModal: (c) => {
                const f = r().modals.get(c.id);
                if (!f) return null;
                const h = {
                        ...f,
                        userClose: c.props.onClose ?? f.userClose,
                        props: { ...f.props, ...c.props, onClose: f.props.onClose },
                    },
                    m = new Map(r().modals);
                return m.set(c.id, h), o((g) => ({ ...g, modals: m })), h;
            },
            removeModal: (c) => {
                const f = r().modals.get(c.id);
                if (!f) return null;
                const h = new Map(r().modals);
                h.delete(c.id);
                const m = new Set(r().stack);
                return m.delete(c.id), o((g) => ({ ...g, modals: h, stack: m })), f.userClose?.(), f;
            },
        });
        return Ud()(i);
    },
    k5 = wc("ModalStoreContext", void 0);
function zd(a, i) {
    if (a === void 0) throw new Error(i);
}
const Gd = (a) => a;
function Qd(a, i = Gd) {
    const o = Ca.useSyncExternalStore(
        a.subscribe,
        () => i(a.getState()),
        () => i(a.getInitialState())
    );
    return Ca.useDebugValue(o), o;
}
const s3 = (a) => Symbol.iterator in a,
    c3 = (a) => "entries" in a,
    f3 = (a, i) => {
        const o = a instanceof Map ? a : new Map(a.entries()),
            r = i instanceof Map ? i : new Map(i.entries());
        if (o.size !== r.size) return !1;
        for (const [c, f] of o) if (!Object.is(f, r.get(c))) return !1;
        return !0;
    },
    Zd = (a, i) => {
        const o = a[Symbol.iterator](),
            r = i[Symbol.iterator]();
        let c = o.next(),
            f = r.next();
        for (; !c.done && !f.done; ) {
            if (!Object.is(c.value, f.value)) return !1;
            (c = o.next()), (f = r.next());
        }
        return !!c.done && !!f.done;
    };
function jd(a, i) {
    return Object.is(a, i)
        ? !0
        : typeof a != "object" || a === null || typeof i != "object" || i === null
          ? !1
          : !s3(a) || !s3(i)
            ? f3({ entries: () => Object.entries(a) }, { entries: () => Object.entries(i) })
            : c3(a) && c3(i)
              ? f3(a, i)
              : Zd(a, i);
}
function Fd(a) {
    const i = Ca.useRef(void 0);
    return (o) => {
        const r = a(o);
        return jd(i.current, r) ? i.current : (i.current = r);
    };
}
const Yd = "ModalStoreContext must be used within a ModalStoreProvider",
    X5 = (a) => {
        const i = C.useContext(k5);
        return zd(i, Yd), Qd(i, Fd(a));
    };
function h3(a) {
    return "displayName" in a && typeof a.displayName == "string" ? a.displayName : a.name;
}
function Id({ openIds: a, modalStates: i }) {
    return C.useMemo(() => {
        let o;
        const r = new Set();
        for (const c of a) {
            const f = i.get(c);
            if (!f) continue;
            const h = f.props.legacyIdentifier;
            r.add(h), (o = h);
        }
        return { currentOpenModal: o, currentOpenModals: r };
    }, [a, i]);
}
const Pd = (a) => ({
        add: a.addModal,
        remove: a.removeModal,
        update: a.updateModal,
        reset: a.resetModals,
        openIds: a.stack,
        modalStates: a.modals,
    }),
    kd = C.memo(function ({ children: i, logger: o }) {
        const { add: r, remove: c, update: f, reset: h, openIds: m, modalStates: g } = X5(Pd),
            { warn: v } = o,
            p = Id({ openIds: m, modalStates: g }),
            A = C.useMemo(
                () => (H, D) => {
                    const _ = r({ modal: H, props: D });
                    return {
                        updateModal: (Q) => {
                            f({ id: _.id, props: Q }) === null &&
                                v("Attempted to update a modal that does not exist", { id: _.id, name: h3(_.modal) });
                        },
                        closeModal: () => {
                            c({ id: _.id }) === null &&
                                v("Attempted to close a modal that does not exist", { id: _.id, name: h3(_.modal) });
                        },
                    };
                },
                [r, c, f, v]
            ),
            E = C.useMemo(() => (H, D) => (h(), A(H, D)), [h, A]),
            x = C.useMemo(() => ({ openStackedModal: A, openModal: E, legacyIdentifiers: p }), [A, E, p]);
        return z.jsx(Ld.Provider, { value: x, children: i });
    }),
    Xd = C.memo(function ({ modalState: i }) {
        return z.jsx(C.Suspense, { children: z.jsx(i.modal, { ...i.props }) });
    }),
    qd = (a) => ({ modalIds: a.stack, modalMap: a.modals }),
    Kd = C.memo(function ({ logger: i }) {
        const { modalIds: o, modalMap: r } = X5(qd);
        return C.useMemo(
            () =>
                Array.from(o)
                    .map((h) => {
                        const m = r.get(h);
                        return m || (i.warn(`Modal with id ${h} not found in store.`), null);
                    })
                    .filter((h) => !!h),
            [o, r, i]
        ).map((f) => z.jsx(Xd, { modalState: f }, f.id));
    });
function Wd() {
    return typeof crypto < "u" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}
const Jd = C.memo(function ({ children: i }) {
        const o = C.useRef(null);
        return (
            o.current === null && (o.current = Vd({ generateId: Wd })),
            z.jsx(k5.Provider, { value: o.current, children: i })
        );
    }),
    $d = C.memo(function ({ children: i, logger: o, render: r }) {
        return z.jsx(Jd, { children: z.jsxs(kd, { logger: o, children: [i, r && z.jsx(Kd, { logger: o })] }) });
    }),
    q5 = wc("AetherContext", {
        isMobileStyle: !1,
        isMobileUserAgent: !1,
        openOverlayId: null,
        setOpenOverlayId: () => {},
    }),
    tm = { warn: () => {} },
    K5 = C.memo(
        ({ children: a, isMobileStyle: i = !1, isMobileUserAgent: o = !1, renderModals: r = !0, logger: c = tm }) => {
            const [f, h] = C.useState(null);
            return z.jsx(q5.Provider, {
                value: { isMobileStyle: i, isMobileUserAgent: o, openOverlayId: f, setOpenOverlayId: h },
                children: z.jsx(Od, { children: z.jsx($d, { logger: c, render: r, children: a }) }),
            });
        }
    );
function em() {
    return C.useContext(q5);
}
K5.displayName = "AetherProvider";
function W5(a) {
    var i,
        o,
        r = "";
    if (typeof a == "string" || typeof a == "number") r += a;
    else if (typeof a == "object")
        if (Array.isArray(a)) {
            var c = a.length;
            for (i = 0; i < c; i++) a[i] && (o = W5(a[i])) && (r && (r += " "), (r += o));
        } else for (o in a) a[o] && (r && (r += " "), (r += o));
    return r;
}
function nm() {
    for (var a, i, o = 0, r = "", c = arguments.length; o < c; o++)
        (a = arguments[o]) && (i = W5(a)) && (r && (r += " "), (r += i));
    return r;
}
const d3 = (a) => (typeof a == "boolean" ? `${a}` : a === 0 ? "0" : a),
    oc = nm,
    Oc = (a, i) => (o) => {
        var r;
        if (i?.variants == null) return oc(a, o?.class, o?.className);
        const { variants: c, defaultVariants: f } = i,
            h = Object.keys(c).map((v) => {
                const p = o?.[v],
                    A = f?.[v];
                if (p === null) return null;
                const E = d3(p) || d3(A);
                return c[v][E];
            }),
            m =
                o &&
                Object.entries(o).reduce((v, p) => {
                    let [A, E] = p;
                    return E === void 0 || (v[A] = E), v;
                }, {}),
            g =
                i == null || (r = i.compoundVariants) === null || r === void 0
                    ? void 0
                    : r.reduce((v, p) => {
                          let { class: A, className: E, ...x } = p;
                          return Object.entries(x).every((H) => {
                              let [D, _] = H;
                              return Array.isArray(_) ? _.includes({ ...f, ...m }[D]) : { ...f, ...m }[D] === _;
                          })
                              ? [...v, A, E]
                              : v;
                      }, []);
        return oc(a, h, g, o?.class, o?.className);
    };
var Zs = { exports: {} };
var m3;
function am() {
    return (
        m3 ||
            ((m3 = 1),
            (function (a) {
                (function () {
                    var i = {}.hasOwnProperty;
                    function o() {
                        for (var r = [], c = 0; c < arguments.length; c++) {
                            var f = arguments[c];
                            if (f) {
                                var h = typeof f;
                                if (h === "string" || h === "number") r.push(f);
                                else if (Array.isArray(f)) {
                                    if (f.length) {
                                        var m = o.apply(null, f);
                                        m && r.push(m);
                                    }
                                } else if (h === "object") {
                                    if (
                                        f.toString !== Object.prototype.toString &&
                                        !f.toString.toString().includes("[native code]")
                                    ) {
                                        r.push(f.toString());
                                        continue;
                                    }
                                    for (var g in f) i.call(f, g) && f[g] && r.push(g);
                                }
                            }
                        }
                        return r.join(" ");
                    }
                    a.exports ? ((o.default = o), (a.exports = o)) : (window.classNames = o);
                })();
            })(Zs)),
        Zs.exports
    );
}
var lm = am();
const Ea = fc(lm),
    im = "pplx-icon-",
    rm = { src: ({ id: a }) => `#${im}${a}`, version: "0", defaultSize: 20 },
    um = C.createContext(rm),
    om = () => C.useContext(um);
const pi = { xs: 14, sm: 16, md: 18, base: 20, lg: 24 },
    sc = C.memo(function ({
        name: i,
        size: o = "default",
        title: r,
        description: c,
        className: f,
        "aria-label": h,
        "aria-hidden": m,
    }) {
        const g = om(),
            v = o === "default" ? g.defaultSize : o === "inherit" ? "1em" : o;
        return z.jsxs("svg", {
            role: "img",
            className: oc("inline-flex fill-current shrink-0", f),
            width: v,
            height: v,
            "aria-label": h,
            "aria-hidden": m,
            children: [
                r && z.jsx("title", { children: r }),
                c && z.jsx("desc", { children: c }),
                z.jsx("use", { xlinkHref: g.src({ id: i, version: g.version }) }),
            ],
        });
    }),
    sm = { "2xs": 12, xs: 14, sm: 16, md: 18, base: 20, lg: 24, xl: 28, "2xl": 32, "3xl": 48, "4xl": 64 },
    Hc = Ca.memo(
        ({
            icon: a,
            size: i = "base",
            color: o = "currentColor",
            className: r,
            style: c,
            "aria-label": f,
            opacity: h,
            badge: m,
        }) => {
            const g = typeof i == "number" ? i : sm[i],
                v = g * 0.65,
                p = C.useMemo(() => ({ ...c, color: o, opacity: h }), [c, o, h]),
                A = C.useMemo(() => Ea("tabler-icon shrink-0", r), [r]);
            return m
                ? z.jsxs("div", {
                      className: "relative inline-flex",
                      children: [
                          typeof a == "string"
                              ? z.jsx(sc, { name: a, size: g, className: A, style: p, "aria-label": f })
                              : z.jsx(a, { size: g, color: o, className: A, style: c, "aria-label": f, opacity: h }),
                          z.jsx("div", {
                              className: "absolute -bottom-0.5 -right-0.5 overflow-hidden",
                              style: { width: `${v}px`, height: `${v}px` },
                              children:
                                  typeof m == "string"
                                      ? z.jsx("img", { src: m, alt: "Badge", style: { width: "100%", height: "100%" } })
                                      : m,
                          }),
                      ],
                  })
                : typeof a == "string"
                  ? z.jsx(sc, { name: a, size: g, className: A, style: p, "aria-label": f })
                  : z.jsx(a, { size: g, color: o, className: A, style: c, "aria-label": f, opacity: h });
        }
    );
Hc.displayName = "TablerIcon";
const cm = { tiny: "xs", small: "sm", medium: "md", default: "base", large: "lg" },
    fm = { tiny: pi.xs, small: pi.sm, medium: pi.md, default: pi.base, large: pi.lg };
function js({ icon: a, size: i = "default" }) {
    return typeof a == "string" ? z.jsx(sc, { name: a, size: fm[i] }) : z.jsx(Hc, { icon: a, size: cm[i] });
}
function J5(a) {
    const i = C.useRef(null),
        o = C.useMemo(
            () => ({
                getBoundingClientRect: () => i.current?.getBoundingClientRect() ?? DOMRect.fromRect({}),
                focus: () => {
                    i.current?.focus();
                },
                addEventListener: (r, c, f) => {
                    i.current?.addEventListener(r, c, f);
                },
                removeEventListener: (r, c, f) => {
                    i.current?.removeEventListener(r, c, f);
                },
                contains: (r) => i.current?.contains(r) ?? !1,
            }),
            []
        );
    return C.useImperativeHandle(a, () => o, [o]), i;
}
const hm = Oc("aspect-square shrink-0 animate-spin rounded-full p-two", {
    variants: { color: { default: "opacity-100", quiet: "opacity-60", quietest: "opacity-40", super: "text-super" } },
    defaultVariants: { color: "default" },
});
function dm({ ref: a, size: i = 16, color: o = "default" }) {
    const r = J5(a);
    return z.jsx("div", {
        ref: r,
        className: hm({ color: o }),
        style: {
            width: i,
            backgroundImage: "conic-gradient(from 270deg, transparent 0%, currentColor 99%)",
            mask: `radial-gradient(transparent 0%, transparent ${i / 2 - 2}px, black ${i / 2 - 2}px, black) center center`,
        },
    });
}
const mm = { large: 24, default: 20, small: 16, tiny: 14 };
function vm(a) {
    return a === "primary" ? void 0 : "default";
}
function Ai(a) {
    return { opacity: a ? 1 : 0, transition: "opacity 150ms", transitionDelay: a ? "150ms" : "0ms" };
}
function v3({ size: a, variant: i, isVisible: o }) {
    const r = vm(i);
    return z.jsx("div", {
        style: Ai(o),
        className: "absolute inset-0 flex items-center justify-center",
        children: o && z.jsx(dm, { size: mm[a], color: r }),
    });
}
function gm({ open: a, onOpenChange: i }) {
    const o = C.useId(),
        { openOverlayId: r, setOpenOverlayId: c } = em(),
        [f, h] = C.useState(!1),
        m = a !== void 0,
        g = m ? a : f;
    return (
        C.useEffect(() => {
            !m && f && r !== o && h(!1);
        }, [r, o, f, m]),
        {
            isOpen: g,
            handleOpenChange: (p) => {
                m ? i && i(p) : (c(p ? o : (A) => (A === o ? null : A)), h(p));
            },
        }
    );
}
var pm = typeof global == "object" && global && global.Object === Object && global,
    ym = typeof self == "object" && self && self.Object === Object && self,
    Bc = pm || ym || Function("return this")(),
    Xn = Bc.Symbol,
    $5 = Object.prototype,
    Am = $5.hasOwnProperty,
    bm = $5.toString,
    yi = Xn ? Xn.toStringTag : void 0;
function Em(a) {
    var i = Am.call(a, yi),
        o = a[yi];
    try {
        a[yi] = void 0;
        var r = !0;
    } catch {}
    var c = bm.call(a);
    return r && (i ? (a[yi] = o) : delete a[yi]), c;
}
var Sm = Object.prototype,
    Cm = Sm.toString;
function Tm(a) {
    return Cm.call(a);
}
var xm = "[object Null]",
    Mm = "[object Undefined]",
    g3 = Xn ? Xn.toStringTag : void 0;
function Dc(a) {
    return a == null ? (a === void 0 ? Mm : xm) : g3 && g3 in Object(a) ? Em(a) : Tm(a);
}
function _c(a) {
    return a != null && typeof a == "object";
}
var Rm = "[object Symbol]";
function Nc(a) {
    return typeof a == "symbol" || (_c(a) && Dc(a) == Rm);
}
function wm(a, i) {
    for (var o = -1, r = a == null ? 0 : a.length, c = Array(r); ++o < r; ) c[o] = i(a[o], o, a);
    return c;
}
var Hi = Array.isArray,
    p3 = Xn ? Xn.prototype : void 0,
    y3 = p3 ? p3.toString : void 0;
function t4(a) {
    if (typeof a == "string") return a;
    if (Hi(a)) return wm(a, t4) + "";
    if (Nc(a)) return y3 ? y3.call(a) : "";
    var i = a + "";
    return i == "0" && 1 / a == -1 / 0 ? "-0" : i;
}
function lu(a) {
    var i = typeof a;
    return a != null && (i == "object" || i == "function");
}
function Om(a) {
    return a;
}
var Hm = "[object AsyncFunction]",
    Bm = "[object Function]",
    Dm = "[object GeneratorFunction]",
    _m = "[object Proxy]";
function Nm(a) {
    if (!lu(a)) return !1;
    var i = Dc(a);
    return i == Bm || i == Dm || i == Hm || i == _m;
}
var Fs = Bc["__core-js_shared__"],
    A3 = (function () {
        var a = /[^.]+$/.exec((Fs && Fs.keys && Fs.keys.IE_PROTO) || "");
        return a ? "Symbol(src)_1." + a : "";
    })();
function Lm(a) {
    return !!A3 && A3 in a;
}
var Um = Function.prototype,
    Vm = Um.toString;
function zm(a) {
    if (a != null) {
        try {
            return Vm.call(a);
        } catch {}
        try {
            return a + "";
        } catch {}
    }
    return "";
}
var Gm = /[\\^$.*+?()[\]{}|]/g,
    Qm = /^\[object .+?Constructor\]$/,
    Zm = Function.prototype,
    jm = Object.prototype,
    Fm = Zm.toString,
    Ym = jm.hasOwnProperty,
    Im = RegExp(
        "^" +
            Fm.call(Ym)
                .replace(Gm, "\\$&")
                .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") +
            "$"
    );
function Pm(a) {
    if (!lu(a) || Lm(a)) return !1;
    var i = Nm(a) ? Im : Qm;
    return i.test(zm(a));
}
function km(a, i) {
    return a?.[i];
}
function Lc(a, i) {
    var o = km(a, i);
    return Pm(o) ? o : void 0;
}
function Xm(a, i, o) {
    switch (o.length) {
        case 0:
            return a.call(i);
        case 1:
            return a.call(i, o[0]);
        case 2:
            return a.call(i, o[0], o[1]);
        case 3:
            return a.call(i, o[0], o[1], o[2]);
    }
    return a.apply(i, o);
}
var qm = 800,
    Km = 16,
    Wm = Date.now;
function Jm(a) {
    var i = 0,
        o = 0;
    return function () {
        var r = Wm(),
            c = Km - (r - o);
        if (((o = r), c > 0)) {
            if (++i >= qm) return arguments[0];
        } else i = 0;
        return a.apply(void 0, arguments);
    };
}
function $m(a) {
    return function () {
        return a;
    };
}
var iu = (function () {
        try {
            var a = Lc(Object, "defineProperty");
            return a({}, "", {}), a;
        } catch {}
    })(),
    tv = iu
        ? function (a, i) {
              return iu(a, "toString", { configurable: !0, enumerable: !1, value: $m(i), writable: !0 });
          }
        : Om,
    ev = Jm(tv),
    nv = 9007199254740991,
    av = /^(?:0|[1-9]\d*)$/;
function e4(a, i) {
    var o = typeof a;
    return (i = i ?? nv), !!i && (o == "number" || (o != "symbol" && av.test(a))) && a > -1 && a % 1 == 0 && a < i;
}
function lv(a, i, o) {
    i == "__proto__" && iu ? iu(a, i, { configurable: !0, enumerable: !0, value: o, writable: !0 }) : (a[i] = o);
}
function n4(a, i) {
    return a === i || (a !== a && i !== i);
}
var iv = Object.prototype,
    rv = iv.hasOwnProperty;
function uv(a, i, o) {
    var r = a[i];
    (!(rv.call(a, i) && n4(r, o)) || (o === void 0 && !(i in a))) && lv(a, i, o);
}
var b3 = Math.max;
function ov(a, i, o) {
    return (
        (i = b3(i === void 0 ? a.length - 1 : i, 0)),
        function () {
            for (var r = arguments, c = -1, f = b3(r.length - i, 0), h = Array(f); ++c < f; ) h[c] = r[i + c];
            c = -1;
            for (var m = Array(i + 1); ++c < i; ) m[c] = r[c];
            return (m[i] = o(h)), Xm(a, this, m);
        }
    );
}
var sv = 9007199254740991;
function cv(a) {
    return typeof a == "number" && a > -1 && a % 1 == 0 && a <= sv;
}
var fv = "[object Arguments]";
function E3(a) {
    return _c(a) && Dc(a) == fv;
}
var a4 = Object.prototype,
    hv = a4.hasOwnProperty,
    dv = a4.propertyIsEnumerable,
    l4 = E3(
        (function () {
            return arguments;
        })()
    )
        ? E3
        : function (a) {
              return _c(a) && hv.call(a, "callee") && !dv.call(a, "callee");
          },
    mv = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    vv = /^\w*$/;
function gv(a, i) {
    if (Hi(a)) return !1;
    var o = typeof a;
    return o == "number" || o == "symbol" || o == "boolean" || a == null || Nc(a)
        ? !0
        : vv.test(a) || !mv.test(a) || (i != null && a in Object(i));
}
var Ti = Lc(Object, "create");
function pv() {
    (this.__data__ = Ti ? Ti(null) : {}), (this.size = 0);
}
function yv(a) {
    var i = this.has(a) && delete this.__data__[a];
    return (this.size -= i ? 1 : 0), i;
}
var Av = "__lodash_hash_undefined__",
    bv = Object.prototype,
    Ev = bv.hasOwnProperty;
function Sv(a) {
    var i = this.__data__;
    if (Ti) {
        var o = i[a];
        return o === Av ? void 0 : o;
    }
    return Ev.call(i, a) ? i[a] : void 0;
}
var Cv = Object.prototype,
    Tv = Cv.hasOwnProperty;
function xv(a) {
    var i = this.__data__;
    return Ti ? i[a] !== void 0 : Tv.call(i, a);
}
var Mv = "__lodash_hash_undefined__";
function Rv(a, i) {
    var o = this.__data__;
    return (this.size += this.has(a) ? 0 : 1), (o[a] = Ti && i === void 0 ? Mv : i), this;
}
function Ma(a) {
    var i = -1,
        o = a == null ? 0 : a.length;
    for (this.clear(); ++i < o; ) {
        var r = a[i];
        this.set(r[0], r[1]);
    }
}
Ma.prototype.clear = pv;
Ma.prototype.delete = yv;
Ma.prototype.get = Sv;
Ma.prototype.has = xv;
Ma.prototype.set = Rv;
function wv() {
    (this.__data__ = []), (this.size = 0);
}
function mu(a, i) {
    for (var o = a.length; o--; ) if (n4(a[o][0], i)) return o;
    return -1;
}
var Ov = Array.prototype,
    Hv = Ov.splice;
function Bv(a) {
    var i = this.__data__,
        o = mu(i, a);
    if (o < 0) return !1;
    var r = i.length - 1;
    return o == r ? i.pop() : Hv.call(i, o, 1), --this.size, !0;
}
function Dv(a) {
    var i = this.__data__,
        o = mu(i, a);
    return o < 0 ? void 0 : i[o][1];
}
function _v(a) {
    return mu(this.__data__, a) > -1;
}
function Nv(a, i) {
    var o = this.__data__,
        r = mu(o, a);
    return r < 0 ? (++this.size, o.push([a, i])) : (o[r][1] = i), this;
}
function yl(a) {
    var i = -1,
        o = a == null ? 0 : a.length;
    for (this.clear(); ++i < o; ) {
        var r = a[i];
        this.set(r[0], r[1]);
    }
}
yl.prototype.clear = wv;
yl.prototype.delete = Bv;
yl.prototype.get = Dv;
yl.prototype.has = _v;
yl.prototype.set = Nv;
var Lv = Lc(Bc, "Map");
function Uv() {
    (this.size = 0), (this.__data__ = { hash: new Ma(), map: new (Lv || yl)(), string: new Ma() });
}
function Vv(a) {
    var i = typeof a;
    return i == "string" || i == "number" || i == "symbol" || i == "boolean" ? a !== "__proto__" : a === null;
}
function vu(a, i) {
    var o = a.__data__;
    return Vv(i) ? o[typeof i == "string" ? "string" : "hash"] : o.map;
}
function zv(a) {
    var i = vu(this, a).delete(a);
    return (this.size -= i ? 1 : 0), i;
}
function Gv(a) {
    return vu(this, a).get(a);
}
function Qv(a) {
    return vu(this, a).has(a);
}
function Zv(a, i) {
    var o = vu(this, a),
        r = o.size;
    return o.set(a, i), (this.size += o.size == r ? 0 : 1), this;
}
function wa(a) {
    var i = -1,
        o = a == null ? 0 : a.length;
    for (this.clear(); ++i < o; ) {
        var r = a[i];
        this.set(r[0], r[1]);
    }
}
wa.prototype.clear = Uv;
wa.prototype.delete = zv;
wa.prototype.get = Gv;
wa.prototype.has = Qv;
wa.prototype.set = Zv;
var jv = "Expected a function";
function Uc(a, i) {
    if (typeof a != "function" || (i != null && typeof i != "function")) throw new TypeError(jv);
    var o = function () {
        var r = arguments,
            c = i ? i.apply(this, r) : r[0],
            f = o.cache;
        if (f.has(c)) return f.get(c);
        var h = a.apply(this, r);
        return (o.cache = f.set(c, h) || f), h;
    };
    return (o.cache = new (Uc.Cache || wa)()), o;
}
Uc.Cache = wa;
var Fv = 500;
function Yv(a) {
    var i = Uc(a, function (r) {
            return o.size === Fv && o.clear(), r;
        }),
        o = i.cache;
    return i;
}
var Iv = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,
    Pv = /\\(\\)?/g,
    kv = Yv(function (a) {
        var i = [];
        return (
            a.charCodeAt(0) === 46 && i.push(""),
            a.replace(Iv, function (o, r, c, f) {
                i.push(c ? f.replace(Pv, "$1") : r || o);
            }),
            i
        );
    });
function Xv(a) {
    return a == null ? "" : t4(a);
}
function gu(a, i) {
    return Hi(a) ? a : gv(a, i) ? [a] : kv(Xv(a));
}
function Vc(a) {
    if (typeof a == "string" || Nc(a)) return a;
    var i = a + "";
    return i == "0" && 1 / a == -1 / 0 ? "-0" : i;
}
function qv(a, i) {
    i = gu(i, a);
    for (var o = 0, r = i.length; a != null && o < r; ) a = a[Vc(i[o++])];
    return o && o == r ? a : void 0;
}
function Kv(a, i) {
    for (var o = -1, r = i.length, c = a.length; ++o < r; ) a[c + o] = i[o];
    return a;
}
var S3 = Xn ? Xn.isConcatSpreadable : void 0;
function Wv(a) {
    return Hi(a) || l4(a) || !!(S3 && a && a[S3]);
}
function Jv(a, i, o, r, c) {
    var f = -1,
        h = a.length;
    for (o || (o = Wv), c || (c = []); ++f < h; ) {
        var m = a[f];
        o(m) ? Kv(c, m) : (c[c.length] = m);
    }
    return c;
}
function $v(a) {
    var i = a == null ? 0 : a.length;
    return i ? Jv(a) : [];
}
function tg(a) {
    return ev(ov(a, void 0, $v), a + "");
}
function eg(a, i) {
    return a != null && i in Object(a);
}
function ng(a, i, o) {
    i = gu(i, a);
    for (var r = -1, c = i.length, f = !1; ++r < c; ) {
        var h = Vc(i[r]);
        if (!(f = a != null && o(a, h))) break;
        a = a[h];
    }
    return f || ++r != c ? f : ((c = a == null ? 0 : a.length), !!c && cv(c) && e4(h, c) && (Hi(a) || l4(a)));
}
function ag(a, i) {
    return a != null && ng(a, i, eg);
}
function lg(a, i, o, r) {
    if (!lu(a)) return a;
    i = gu(i, a);
    for (var c = -1, f = i.length, h = f - 1, m = a; m != null && ++c < f; ) {
        var g = Vc(i[c]),
            v = o;
        if (g === "__proto__" || g === "constructor" || g === "prototype") return a;
        if (c != h) {
            var p = m[g];
            (v = void 0), v === void 0 && (v = lu(p) ? p : e4(i[c + 1]) ? [] : {});
        }
        uv(m, g, v), (m = m[g]);
    }
    return a;
}
function ig(a, i, o) {
    for (var r = -1, c = i.length, f = {}; ++r < c; ) {
        var h = i[r],
            m = qv(a, h);
        o(m, h) && lg(f, gu(h, a), m);
    }
    return f;
}
function rg(a, i) {
    return ig(a, i, function (o, r) {
        return ag(a, r);
    });
}
var ug = tg(function (a, i) {
    return a == null ? {} : rg(a, i);
});
function i4(a) {
    return ug(a, [
        "aria-checked",
        "aria-controls",
        "aria-describedby",
        "aria-disabled",
        "aria-expanded",
        "aria-haspopup",
        "data-disabled",
        "data-highlighted",
        "data-orientation",
        "data-radix-collection-item",
        "data-state",
        "onBlur",
        "onBlurCapture",
        "onClick",
        "onFocus",
        "onFocusCapture",
        "onKeyDown",
        "onMouseDown",
        "onPointerDown",
        "onPointerDownCapture",
        "onPointerEnter",
        "onPointerLeave",
        "onPointerMove",
        "onPointerUp",
        "onPointerUpCapture",
        "onTouchStart",
        "tabIndex",
    ]);
}
const og = 8,
    sg = 10,
    cg = Oc(["max-w-[280px]", "bg-dark dark:border dark:border-subtler", "px-2 py-1.5", "rounded-md", "shadow-sm"], {
        variants: {
            side: {
                top: "data-[state=closed]:animate-slideDownAndFadeOut data-[state=delayed-open]:animate-slideUpAndFadeIn",
                bottom: "data-[state=closed]:animate-slideUpAndFadeOut data-[state=delayed-open]:animate-slideDownAndFadeIn",
                left: "data-[state=closed]:animate-slideRightAndFadeOut data-[state=delayed-open]:animate-slideLeftAndFadeIn",
                right: "data-[state=closed]:animate-slideLeftAndFadeOut data-[state=delayed-open]:animate-slideRightAndFadeIn",
            },
        },
        defaultVariants: { side: "top" },
    });
function C3({
    content: a,
    side: i = "top",
    align: o = "center",
    open: r,
    onOpenChange: c,
    children: f,
    shouldShowArrow: h = !1,
    delayDurationMs: m = 700,
    disabled: g = !1,
    offsetPx: v = og,
    portalTargetElement: p,
    shouldStayOpenOnClick: A = !1,
    ...E
}) {
    const { isOpen: x, handleOpenChange: H } = gm({ open: r, onOpenChange: c }),
        D = i4(E),
        _ =
            "overflow-hidden -translate-y-two [clip-path:inset(1px_1px_0px_1px)] fill-[oklch(var(--dark-background-base-color))] dark:stroke-[1.5px] dark:stroke-subtler";
    return g
        ? f
        : z.jsxs(Hd, {
              open: x,
              onOpenChange: H,
              delayDuration: m,
              children: [
                  z.jsx(Bd, {
                      asChild: !0,
                      onPointerDown: A ? (V) => V.preventDefault() : void 0,
                      onClick: A ? (V) => V.preventDefault() : void 0,
                      ...D,
                      children: f,
                  }),
                  z.jsx(Dd, {
                      container: p,
                      children: z.jsxs(_d, {
                          side: i,
                          align: o,
                          sideOffset: v,
                          avoidCollisions: !0,
                          collisionPadding: sg,
                          onPointerDownOutside: A
                              ? (V) => {
                                    V.preventDefault();
                                }
                              : void 0,
                          className: cg({ side: i }),
                          children: [
                              z.jsx("div", { className: "text-xs font-medium text-white break-words", children: a }),
                              h && z.jsx(Nd, { width: 12, height: 6, className: _ }),
                          ],
                      }),
                  }),
              ],
          });
}
function T3({ ref: a, className: i, children: o, interactableVariant: r = "default", type: c = "button", ...f }) {
    return z.jsx("button", {
        ...f,
        type: c,
        ref: a,
        className: Ea(
            "reset",
            r === "alt" ? "interactable-alt" : "interactable",
            { "pointer-events-none": f.disabled },
            i
        ),
        children: o,
    });
}
function fg(a) {
    throw new Error(a);
}
function x3(a) {
    return Oc(
        Ea(
            "select-none [-webkit-user-drag:none] outline-none font-semimedium transition-[background-color,border-color,transform,color,opacity] duration-300 ease-out font-sans text-center items-center justify-center leading-loose whitespace-nowrap",
            hg({ variant: a.variant })
        ),
        {
            variants: {
                variant: {
                    primary: "bg-super border border-transparent text-inverse",
                    secondary: "text-quiet border border-solid border-subtler bg-base",
                    tonal: "bg-subtle border border-transparent text-foreground",
                    text: "text-quiet",
                },
                size: { large: "h-14 text-lg", default: "h-10 text-base", small: "h-8 text-sm", tiny: "h-6 text-xs" },
                disabled: {
                    false: "cursor-pointer origin-center active:scale-[0.97] active:duration-150 active:ease-outExpo",
                    true: "cursor-default opacity-50",
                },
                isLoading: { false: "", true: "cursor-wait" },
                fullWidth: { true: "flex w-full", false: "inline-flex" },
                rounded: { true: "rounded-full aspect-square p-0", false: "" },
                pill: { true: "rounded-full", false: "" },
                inline: { true: "px-0", false: "" },
                iconOnly: { true: "aspect-[9/8]", false: "" },
            },
            compoundVariants: [
                { variant: "text", disabled: !1, isLoading: !1, class: "hover:text-foreground" },
                { variant: "text", disabled: !1, isLoading: !1, inline: !1, class: "hover:bg-subtle" },
                { variant: ["tonal", "secondary"], disabled: !1, isLoading: !1, class: "hover:bg-subtler" },
                { variant: "primary", disabled: !1, isLoading: !1, class: "hover:opacity-80" },
                { variant: "secondary", disabled: !1, isLoading: !1, class: "hover:border-subtle" },
                { rounded: !1, inline: !1, size: "large", iconOnly: !1, class: "px-6" },
                { rounded: !1, inline: !1, size: "default", iconOnly: !1, class: "px-4" },
                { rounded: !1, inline: !1, size: "small", iconOnly: !1, class: "px-3" },
                { rounded: !1, inline: !1, size: "tiny", iconOnly: !1, class: "px-2" },
                { rounded: !1, pill: !1, size: "large", class: "rounded-xl" },
                { rounded: !1, pill: !1, size: "default", class: "rounded-lg" },
                { rounded: !1, pill: !1, size: "small", class: "rounded-lg" },
                { rounded: !1, pill: !1, size: "tiny", class: "rounded-md" },
            ],
            defaultVariants: {
                variant: "primary",
                size: "default",
                disabled: !1,
                isLoading: !1,
                fullWidth: !1,
                rounded: !1,
                pill: !1,
                inline: !1,
                iconOnly: !1,
            },
        }
    )(a);
}
const hg = ({ variant: a = "primary" }) => {
    switch (a) {
        case "primary":
            return "data-[state=open]:opacity-80";
        case "secondary":
            return "data-[state=open]:bg-subtler data-[state=open]:border-subtle";
        case "tonal":
            return "data-[state=open]:bg-subtler";
        case "text":
            return "data-[state=open]:text-foreground data-[state=open]:bg-subtle";
        default:
            fg(a);
    }
};
function dg({
    ref: a,
    children: i,
    icon: o,
    "aria-label": r,
    variant: c = "primary",
    size: f = "default",
    disabled: h = !1,
    isLoading: m = !1,
    fullWidth: g = !1,
    onClick: v,
    leadingIcon: p,
    trailingIcon: A,
    pill: E = !1,
    rounded: x = !1,
    inline: H = !1,
    tooltipSide: D = "top",
    tooltipAlign: _ = "center",
    tooltipOffsetPx: V,
    tooltipShouldShowArrow: U = !1,
    tooltipShouldStayOpenOnClick: Q = !1,
    tooltipOpen: Y,
    tooltipOnOpenChange: R,
    interactableVariant: k = "default",
    __dangerousHtmlProps: X = {},
    ...st
}) {
    const P = J5(a),
        K = i4(st);
    if (o) {
        const gt = z.jsx(T3, {
            ref: P,
            ...K,
            disabled: h,
            "aria-busy": m || void 0,
            className: x3({
                variant: c,
                size: f,
                disabled: h,
                isLoading: m,
                fullWidth: !1,
                rounded: x,
                pill: !1,
                inline: !1,
                iconOnly: !0,
            }),
            onClick: m ? void 0 : v,
            "aria-label": r,
            interactableVariant: k,
            ...X,
            children: z.jsxs("div", {
                className: "relative flex items-center justify-center",
                children: [
                    z.jsx("div", {
                        style: Ai(!m),
                        className: "inline-flex",
                        children: z.jsx(js, { icon: o, size: f }),
                    }),
                    z.jsx(v3, { size: f, variant: c, isVisible: m }),
                ],
            }),
        });
        return h
            ? gt
            : Y !== void 0 && R !== void 0
              ? z.jsx(C3, {
                    open: Y,
                    onOpenChange: R,
                    content: r,
                    side: D,
                    align: _,
                    offsetPx: V,
                    shouldShowArrow: U,
                    shouldStayOpenOnClick: Q,
                    children: gt,
                })
              : z.jsx(C3, {
                    content: r,
                    side: D,
                    align: _,
                    offsetPx: V,
                    shouldShowArrow: U,
                    shouldStayOpenOnClick: Q,
                    children: gt,
                });
    }
    return z.jsxs(T3, {
        ref: P,
        ...K,
        disabled: h,
        "aria-busy": m || void 0,
        className: Ea(
            x3({ variant: c, size: f, disabled: h, isLoading: m, fullWidth: g, rounded: !1, pill: E, inline: H }),
            "relative"
        ),
        onClick: m ? void 0 : v,
        "aria-label": r,
        interactableVariant: k,
        ...X,
        children: [
            p &&
                z.jsx("div", {
                    style: Ai(!m),
                    className: Ea("flex items-center", "-ml-1"),
                    children: z.jsx(js, { icon: p, size: f }),
                }),
            z.jsx("span", {
                style: Ai(!m),
                className: Ea("text-box-trim-both", { "pl-1": p, "pr-1": A }),
                children: i,
            }),
            A &&
                z.jsx("div", {
                    style: Ai(!m),
                    className: Ea("flex items-center", "-mr-1"),
                    children: z.jsx(js, { icon: A, size: f }),
                }),
            z.jsx(v3, { size: f, variant: c, isVisible: m }),
        ],
    });
}
const M3 = {
        click: { message: { defaultMessage: "Clicking", id: "n43/KMHgLD" }, icon: "click" },
        fill: { message: { defaultMessage: "Filling out a form", id: "5i0X5DesMM" }, icon: "forms" },
        search: { message: { defaultMessage: "Searching", id: "IfE0if3ytt" }, icon: "search" },
        search_images: { message: { defaultMessage: "Searching for images", id: "NaBAkNUPuD" }, icon: "search" },
        navigate: { message: { defaultMessage: "Navigating", id: "3O6LMNhb0M" }, icon: "location" },
        press_key: { message: { defaultMessage: "Pressing key", id: "R6bmgzv6Xs" }, icon: "keyboard" },
        key: { message: { defaultMessage: "Pressing key", id: "R6bmgzv6Xs" }, icon: "keyboard" },
        scroll_page: { message: { defaultMessage: "Scrolling", id: "/UUUqdefcb" }, icon: "square-rounded-arrow-down" },
        scroll_to: { message: { defaultMessage: "Scrolling", id: "/UUUqdefcb" }, icon: "square-rounded-arrow-down" },
        scroll: { message: { defaultMessage: "Scrolling", id: "/UUUqdefcb" }, icon: "square-rounded-arrow-down" },
        reasoning: { message: { defaultMessage: "Reasoning", id: "Aw3qRf7hyO" }, icon: "bubble-text" },
        working: { message: { defaultMessage: "Working", id: "gAR0atqpRn" }, icon: "access-point" },
        finished: { message: { defaultMessage: "Done", id: "JXdbo8Vnlw" }, icon: "check" },
        reading: { message: { defaultMessage: "Reading", id: "MOK/yKIpYX" }, icon: "file-text" },
        thinking: { message: { defaultMessage: "Thinking", id: "AHQWDTo4+e" }, icon: "bubble-text" },
        read_page: { message: { defaultMessage: "Reading page", id: "eEZaxWqt5u" }, icon: "file-text" },
        get_page_text: { message: { defaultMessage: "Getting page text", id: "rZqPh2Mfgi" }, icon: "file-text" },
        tabs_create: { message: { defaultMessage: "Creating tab", id: "NprxDW5RAN" }, icon: "browser-plus" },
        form_input: { message: { defaultMessage: "Filling form", id: "+gn8Qfhxa/" }, icon: "forms" },
        find: { message: { defaultMessage: "Finding elements", id: "PicRTL+DUk" }, icon: "search" },
        find_elements: { message: { defaultMessage: "Finding elements", id: "PicRTL+DUk" }, icon: "search" },
        search_web: { message: { defaultMessage: "Searching", id: "IfE0if3ytt" }, icon: "search" },
        left_click: { message: { defaultMessage: "Clicking", id: "n43/KMHgLD" }, icon: "click" },
        right_click: { message: { defaultMessage: "Right clicking", id: "YAxezKzj4p" }, icon: "click" },
        double_click: { message: { defaultMessage: "Double clicking", id: "anyjKtRL4p" }, icon: "click" },
        triple_click: { message: { defaultMessage: "Triple clicking", id: "aqH53Ke8R4" }, icon: "click" },
        left_click_drag: { message: { defaultMessage: "Dragging", id: "A/Bht8akH/" }, icon: "click" },
        type: { message: { defaultMessage: "Typing", id: "N2bqd9kL1X" }, icon: "keyboard" },
        screenshot: { message: { defaultMessage: "Taking screenshot", id: "IwRaId+4hv" }, icon: "camera" },
        wait: { message: { defaultMessage: "Waiting", id: "dZd8H/KE0T" }, icon: "access-point" },
    },
    Bi = 1,
    bi = 135 * Bi,
    mg = 4720 * Bi,
    R3 = 49.2,
    vg = 0.5,
    gg = 0.4,
    pg = 0.34 * Bi,
    yg = 15 * Bi,
    Ag = 0.5,
    bg = "#47D9E7",
    w3 = 0,
    Eg = 0.05,
    Sg = 8,
    Ys = 0.1,
    Is = 14,
    Cg = 0.14 * 4 * Bi,
    O3 = 60,
    cc = bi * 0.8,
    Tg = bi - cc,
    xg = 25;
class Mg {
    canvas = null;
    ctx = null;
    dots = [];
    waves = [];
    intervalId = null;
    cellSize = 0;
    resizeHandler = null;
    frameInterval = 1e3 / xg;
    init() {
        this.canvas ||
            ((this.canvas = document.createElement("canvas")),
            (this.canvas.style.position = "fixed"),
            (this.canvas.style.top = "0"),
            (this.canvas.style.left = "0"),
            (this.canvas.style.width = "100%"),
            (this.canvas.style.height = "100%"),
            (this.canvas.style.pointerEvents = "none"),
            (this.canvas.style.zIndex = "2147483646"),
            (this.canvas.style.mixBlendMode = "screen"),
            document.body.appendChild(this.canvas),
            (this.ctx = this.canvas.getContext("2d")),
            this.ctx &&
                (this.resize(),
                (this.resizeHandler = () => this.resize()),
                window.addEventListener("resize", this.resizeHandler)));
    }
    resize() {
        if (!this.canvas || !this.ctx) return;
        (this.canvas.width = window.innerWidth),
            (this.canvas.height = window.innerHeight),
            (this.dots = []),
            (this.cellSize = yg * Ag);
        let i = 0,
            o = 0;
        for (; o < this.canvas.width; ) {
            let r = 0;
            for (; r < this.canvas.height; ) this.dots.push({ x: o, y: r, id: i }), (r += this.cellSize), i++;
            o += this.cellSize;
        }
    }
    startAnimationLoop() {
        this.intervalId === null &&
            (this.draw(performance.now()),
            (this.intervalId = setInterval(() => {
                if (this.waves.length === 0) {
                    this.stopAnimationLoop();
                    return;
                }
                this.draw(performance.now());
            }, this.frameInterval)));
    }
    stopAnimationLoop() {
        this.intervalId !== null && (clearInterval(this.intervalId), (this.intervalId = null));
    }
    draw(i) {
        if (!(!this.canvas || !this.ctx)) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            for (let o = this.waves.length - 1; o >= 0; o--) {
                const r = this.waves[o];
                this.updateWave(r, i), r.isDead && this.waves.splice(o, 1);
            }
            if (this.waves.length !== 0) {
                this.ctx.fillStyle = bg;
                for (let o = 0; o < this.dots.length; o++) {
                    const r = this.dots[o],
                        c = this.calculateDotState(r, i);
                    if (!c.isAffected) continue;
                    let f = !1;
                    for (const m of this.waves) {
                        const g = m.dists[r.id];
                        if (g !== void 0 && g < bi) {
                            f = !0;
                            break;
                        }
                    }
                    if (!f) continue;
                    let h = w3;
                    (h += c.amp * Cg),
                        (h += c.waveSize),
                        (h = Math.max(h, w3)),
                        this.ctx.beginPath(),
                        this.ctx.arc(r.x + c.diffX, r.y + c.diffY, h / 2, 0, 2 * Math.PI),
                        this.ctx.fill();
                }
            }
        }
    }
    updateWave(i, o) {
        const r = o - i.startTime;
        if (r < i.durationMs) {
            const c = r / i.durationMs;
            i.radiusUpdate = -i.radius * c * (c - 2);
        } else i.isDead = !0;
    }
    calculateDotState(i, o) {
        const r = { amp: 0, waveSize: 0, diffX: 0, diffY: 0, isAffected: !1 };
        for (const c of this.waves) {
            if (c.dists[i.id] === void 0) {
                const m = i.x - c.x,
                    g = i.y - c.y;
                c.dists[i.id] = Math.sqrt(m * m + g * g);
            }
            const f = c.dists[i.id],
                h = f - c.radiusUpdate;
            if (h < 0 && h > -Is * 2) {
                if (((r.isAffected = !0), c.angles[i.id] === void 0)) {
                    const Y = i.x - c.x,
                        R = i.y - c.y;
                    c.angles[i.id] = Math.atan2(R, Y);
                }
                const m = c.angles[i.id],
                    v = (-Math.abs(Is + h) + Is) / (R3 * O3);
                let p = 0;
                if (v <= 0) p = 0;
                else if (v >= 1) p = Ys;
                else if (v < 0.5) p = Ys * 2 * v * v;
                else {
                    const Y = 1 - v;
                    p = Ys * (1 - 2 * Y * Y);
                }
                p *= c.scale;
                let A = 1;
                if (f >= bi) A = 0;
                else if (f > cc) {
                    const Y = f - cc,
                        R = Math.min(1, Y / Tg);
                    A = 1 - -1 * R * (R - 2);
                }
                const E = Math.pow(gg, f / bi),
                    H = ((o - c.startTime) * O3) / 1e3,
                    D = f * Eg - H * pg,
                    U = ((Math.sin(D) + 1) / 2) * Sg * E * A;
                (r.amp += p * E * A), (r.waveSize += U);
                const Q = p * E * A;
                (r.diffX += Math.cos(m) * Q), (r.diffY += Math.sin(m) * Q);
            }
        }
        return r;
    }
    triggerClick(i, o) {
        const r = {
            x: i,
            y: o,
            radius: mg,
            radiusUpdate: 0,
            scale: vg,
            startTime: performance.now(),
            durationMs: R3 * 1e3,
            isDead: !1,
            dists: {},
            angles: {},
        };
        this.waves.push(r), this.startAnimationLoop();
    }
    destroy() {
        this.stopAnimationLoop(),
            this.resizeHandler &&
                (window.removeEventListener("resize", this.resizeHandler), (this.resizeHandler = null)),
            this.canvas && (this.canvas.remove(), (this.canvas = null)),
            (this.ctx = null),
            (this.dots = []),
            (this.waves = []);
    }
}
let Sa = null;
function r4() {
    Sa || ((Sa = new Mg()), Sa.init());
}
function Rg(a, i) {
    Sa || r4(), Sa?.triggerClick(a, i);
}
function wg() {
    Sa?.destroy(), (Sa = null);
}
function Og(a, i) {
    for (const o in a) {
        if (o === "colors") {
            const r = Array.isArray(a.colors),
                c = Array.isArray(i.colors);
            if (!r || !c) {
                if (Object.is(a.colors, i.colors) === !1) return !1;
                continue;
            }
            if (a.colors?.length !== i.colors?.length || !a.colors?.every((f, h) => f === i.colors?.[h])) return !1;
            continue;
        }
        if (Object.is(a[o], i[o]) === !1) return !1;
    }
    return !0;
}
function H3(a) {
    if (Array.isArray(a)) return a.length === 4 ? a : a.length === 3 ? [...a, 1] : Ps;
    if (typeof a != "string") return Ps;
    let i,
        o,
        r,
        c = 1;
    if (a.startsWith("#")) [i, o, r, c] = Hg(a);
    else if (a.startsWith("rgb")) [i, o, r, c] = Bg(a);
    else if (a.startsWith("hsl")) [i, o, r, c] = _g(Dg(a));
    else return console.error("Unsupported color format", a), Ps;
    return [Kr(i, 0, 1), Kr(o, 0, 1), Kr(r, 0, 1), Kr(c, 0, 1)];
}
function Hg(a) {
    (a = a.replace(/^#/, "")),
        a.length === 3 &&
            (a = a
                .split("")
                .map((f) => f + f)
                .join("")),
        a.length === 6 && (a = a + "ff");
    const i = parseInt(a.slice(0, 2), 16) / 255,
        o = parseInt(a.slice(2, 4), 16) / 255,
        r = parseInt(a.slice(4, 6), 16) / 255,
        c = parseInt(a.slice(6, 8), 16) / 255;
    return [i, o, r, c];
}
function Bg(a) {
    const i = a.match(/^rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([0-9.]+))?\s*\)$/i);
    return i
        ? [
              parseInt(i[1] ?? "0") / 255,
              parseInt(i[2] ?? "0") / 255,
              parseInt(i[3] ?? "0") / 255,
              i[4] === void 0 ? 1 : parseFloat(i[4]),
          ]
        : [0, 0, 0, 1];
}
function Dg(a) {
    const i = a.match(/^hsla?\s*\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*(?:,\s*([0-9.]+))?\s*\)$/i);
    return i
        ? [parseInt(i[1] ?? "0"), parseInt(i[2] ?? "0"), parseInt(i[3] ?? "0"), i[4] === void 0 ? 1 : parseFloat(i[4])]
        : [0, 0, 0, 1];
}
function _g(a) {
    const [i, o, r, c] = a,
        f = i / 360,
        h = o / 100,
        m = r / 100;
    let g, v, p;
    if (o === 0) g = v = p = m;
    else {
        const A = (H, D, _) => (
                _ < 0 && (_ += 1),
                _ > 1 && (_ -= 1),
                _ < 0.16666666666666666
                    ? H + (D - H) * 6 * _
                    : _ < 0.5
                      ? D
                      : _ < 0.6666666666666666
                        ? H + (D - H) * (0.6666666666666666 - _) * 6
                        : H
            ),
            E = m < 0.5 ? m * (1 + h) : m + h - m * h,
            x = 2 * m - E;
        (g = A(x, E, f + 1 / 3)), (v = A(x, E, f)), (p = A(x, E, f - 1 / 3));
    }
    return [g, v, p, c];
}
const Kr = (a, i, o) => Math.min(Math.max(a, i), o),
    Ps = [0, 0, 0, 1];
function Ng() {
    if (typeof window > "u") return;
    const a = new Image();
    return (a.src = Lg), a;
}
const Lg =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAADAFBMVEUCAQMBAf7/AgMD/wID//7+/wT+A/4FAmYIAqIKnw7+//4EAisEAUgGBIYIewkFVhEJjAoFAuEFA8GWAv6T/gz+AzER/25z/wu1/w1nAggL/049BQUC/y39BrckAQQp/wr+AZYNOvx9AQkN/pELUvMFaAZTBAgIRgsO/7cJNQT+YgkLwRELIf5O/wlP/v79/q4IGAYLK4+kAQ1tAv4IdMpc/4xNMBF2/lQN2vTFAws9BLf9/3kJJgsMRF3+HwkLxfv9BVL8BHEN/9gMsg7cA/13/vv9OAqWA0sOofP9TAsIe/4FQqoF4Q/aAgsQwnKQAwa5BP0JW21NqgmY/f3Z/wkI7whGjAr7oAkLrGGf/JH8jg4zAj4R0Qr+xQ8VZv1Y/8O6//wfA/5bAT79/lQ1AGn8egkKdom0BgYOsfjtBAVDBoz9/zG0A238P/tsbQ/+A9rIig/HCEtvIgrM/1lwBWgIlmr62Q5qA5FndnEIXa+PthUMrqiRfw6SAodE/0cQm6UOirP5swuMCrEOjvo/dBVSA/79KvCgSBL9M1E/TwjUag/e//2WdPZ2TQ9ZMvfPxRD7aPpmOFqXSPu3pww5B/wR00wTgVf3y6dXW137ffv3c7GNj/icJG+4xvYQ61++CZOVll8p//uXzgyTKg6m/1L47w3cAY8EI1T7xvgKbkr7UsGBJPNsB7xL2wuvd5z3svmDmgipcGT8jez8oP0R6bNYuVpUxRn9LZVkqIijYxK7K/dZBtjH/71ZT/1myfz52fVm2WBfk0vxUFj+Vfv9/9plbfz3yl6VUl+flbNijrpfpfz5TZSGRKAI15X14pSt4vwQKMHOTQlKifz1sKW6A9u2A7R65waprffGcfeY/8iyUsFh3rn4lGERMUHJolveAs+PBdb5iZFuX8S8SH7Ekfe8Lwy0t5cLwsD3s2TzbHXa/478nLtNQ6NtstW15QvaKgr25FJm4vyXwFlPInIPId79dUr77fmr18BGdLHIS/mGx6dKw64L7v6k32XMJrWl8ELA3C70AAAgAElEQVR42gTBCTyUeQMA4P97zIx3ZjDvHGaMYQxjhhm33BGTY8h95sodkaNkXVGhKGdUri+SIxQ6nG36VUhS0rnZ6tsVfR2ibKlta7/d5wH7kMaTxlOVozEoHgU29/ayNC9YlrZdyVT+Lf/dAsDDc/xfzX+MLBa2LK23goK0aXhCxZ8qIAdXYj+c8zviDOtRkhEtRxNajHWLuCtdcfQqV2mgRlpDD6wJpKpBrGON27qa4nNeQOU8ViU0pZ2eCMN5mWO7bfR17Q9ItpsqgZJNJcJSq6cSWiV4q1zIDMmkqzAdpqT8gI5G3qm3YEyliPPG9kiwF7P99ghNn7zLs9EXFvFdLmlOdKBAp2ZyGTcI4JuBPYrWyGCYwgFwOhTmHeYC0zEDSp1iX3W71cqoW332M++OAYJUrEySVX0c5lzmDgLcAQ1yFVVOgQ5l+j1k6TEBidTUek7OF4T2kDYo2eVGwOrglKyGBXYyBrxFv9ptR16B+BJ0IFCsryJve0ZEuzNjLeEcw/0aK/kyku6JW0BiicnCBFptKAQRRNRrtmUV/YOn6GNMHXddsFf1YZCHMnFWgcyp2gnLOWTTBcVQVvM/FTgJAHl0NWHHzL0eqzuRXTDCEO03DoThV3kezhrtpNqKW0Bb3MSSAJMmmVnLEpexS8JrmYOr4KXz1cUmByty3N/sbEzBSP8tfGSCJ3caYDhymsPdGbwO4HAl/+PYDCZNf+H6kofkNk4N4Zn6NM4y1lJD7Tt2gyklnrR48dgbfHXgd9uzHvpamm3wKhcaLcawXWxL5T97dL7MeW3aZ7NDWksVZyZv8VQyjm94CDU7UjtbedqOCvB2DdE+wFC6a5JcEIgkKRJ8cfTGmW/2jMS5LEWWKiGY0BFaDNQ++2+sOifPMQ7CcHeFx+PPpcbzRoy4IKmVwHg/1842BwoGc2qlRVoNjCF59oXsrcBgVEP4u1GIX7jshIMqqPdbGTRJzMXcyyyiNG5fr5qFrUVntrktt4QdJugkr1kzNJCK1roWpTraix9JVMpZcsxGYsJlGiSyEgOFZzHy6YVlilnicmxUVkdX/PetzMBk92PNJNkIaLhmA30XPCrMuncWxOZK9kpLnqpYOOsLFFmaf2Mk8OH+BbwPH7HBX2KGI0Ns80gleH+Y6k0YZcF0sWgpoJA30BBbG59XaKyBHoxFtc2p9sFvyXqo2v2aRKN+1HLPshCibfZESAESYsLXmz3tT4wNMp0Wali+VPN93JIJaQ0AcXGrNMnSS0YASPcaNh32NhO0sWHKPhrNVpCBzyk4EWR/PnmKE+3s2cDO+YF6OddPNx7G4AIrZBPldw6tcss4bqzb6hBy6ccf3YaBSNRBFELueRFp7DXWNMFVAT9J1LNTntEyEI2gJS64oyKMKvSRrbpPQGE0rEEmHyqCl2oQravq51FwJXG0m/pPdRA6Xp3sSLdwGwNytaLg3g3VEE2eFESy/GijQPwmYPjwJT+bH/ax0dNT0NZAFQxyIqKzET00vUDuJ+T25QGCclaGZiJBxsjtz3YMZ0PPsq751h0ldwbZstMgHfnauk/7n1eZxEmYIPf5wPt0KJvg2V9bcYWGgua/Lvn/xG5q98tPLcGzHaac2+Cbs3niyPtGgfYgBT2OHgxvhGxzApoPxPoCOtUNCXX+ojW0ug7DOuyrOOG5GkWhaAzx6ZyGE8qbCPS1oxzPjcWSrG/ICNaNMKsra8bIlQVvmRQ/FY4WiHhnrVz/VfdOiOu6u66gG3NKogJ/0rGdbC+iPN1pbZ4HQAZODS+mC2z9dNBqSzd6mTQWKq+EI3fXgJQdqfqz6jY6Fbs4sWT/QkaLUOBnMhWRmSdrpTy769BcCql1UOmaqtFbDA9d7qEox8Lpa+TPXX+xm40jrB7EBK1lwu6IMud9xh7NBZCbq6PNN/QdTu0BVa2neF+s8b1dGns5tMGxQIP/+fiY60jZNp9n5D9MLm4NLWO2gXVG4xwDXHeHXMFEAITOVUGJRoBUwOV3miiTEPPzLrwDm74zFsW9zkfCASQvPi2RaF9qJ2HHWMJNxCHzDym6tNfXiEe28ZnjmHVGwlSvfgBo4afqcoTh4NNq7QQ1KrPJW+1uHEK1VvTghGa0DAePo8D6D1NCYgEPY239D/RQSUMxWJsAIi5KEp/3/9LH1wSTwl8/mfekwWyIhAwMPErzWxVSL7sFnFT1NqJ+Zb8hX4cqwyucXdUVkaqNeVL7abNtJV++aASn/d+Fw9qlVwplz4SqpVw5CBK7nq483nxbZ8p/8TtFwr8oD5uhq+lxfovd0x4+MHo1Wv14SJzqBo9Un1KCZ8NWfbA7jLeoMjnCcS8bjtKuxii0+0RPZlLS6NdhNKHeN2NSdCswa+K+aGFUTD9MLW9R7mhPT5i88TZvV5rWtuek07W/vBev9eJznPGkM8FrCZ53AB8+Ig7vKms99yRb5fpyoQssijTwz0i22O+HvjsjyGXpqseb4t4j6YW86PfJF2cnjmy8EKVF8sIomGUdVGBquOIDIlHsrgPkJEzw7KovqHB/kS+NPgs9nG9FkG1MJiA0GNwTyj5dRS0uiWTfSLf7jpL0ioLExajL/OJPkUbA6CIdKjpU6XrSY/6mE5Z1IDBoHX7tGx9fFkJZQPrPIW49pj9oUEykkiolzaein8mBh/C/0eAzYoFXHWJxYZWrv/ayPmcWsjfWyDy8ndnmPTldcJ05MaxOoIHWPcND2SOan44Wc1Oxyk59KHbiXwbrxB3qvAEA+Pd3zc3MkDFmxjG3K4ZxjHHfFXKNI691kyRLjmRCUmTQWnQo6XS8JNFBsTkqiRQpijalraTe1VPbpa1394/4PM+naUIl5jb9OQw4tXHsFyAoD/x8vmlYJu23hfowcTnJOXSMUdKum4IqKUd4HJguRiprd/Etw9K/NJ+UKE+T2v39ms2JRGhtNDxShw6kmZEdsr6fwVSzZUCgj/xK8CaD46MMqjtVmEE0DTPS7yo7so402lkAAr5A9TA8YbapYO+4tLHK+uBAqCsdrmkNB/tSNQxgrZRiBjhVSt904TQbBmEDW36UhZEwZN9TbWh1vtrLVYdkQKayJHgjO5aVftyaOhbtIVFjq0gImWcFJbXqPp+aGTaOzHzPptvWbli/tEz5BHs2WdU4y01sOWIdG+CPWbxSDnQ/KbYgddG1ggtPPUFvXeLdNH2EoslAveJl8GUVaLs6WWsoo3G2Q8KnvSkrNV13rJm4fF2jG2NKE3FMgjWPyCyVVZXDxk0WKQyzIcdGvhovfXwvS237WZN3PvX9Dh50V1CMuemc5AkPWBJzzlg8giqz/M3mICBajNsO3PSuByw3zV51gCTybHlfu/R+zXwVekhzN1C0gZCgqc3x8EUR5Mt8LndPRv3AbLnf2ZMLJ2TZBapthY8hSsIET5/vpH1T7/l1IKZl4pTp2eMVFT8J+1JyElnizM32GmBQTaTDJOwuvPCV3QDonD/6xjwgR6SA92MF+v+Xlo/BDyOZJpkM7QFh73uKxzX9hlDol/x5HVESyPM/HNyF6MwCg866UWXm9Jd2xsjrXyEKgjl11K41nEwzFzjyP0V9T87dStAustB/MkOwBaQoOCNG0+6dfSw2YIL2d+aAFbtewoPIATWJC+6il2nDFDx8Vlxg2a22oZG4My48gnrQEcDxOuE71wz51mkfvC3B8gjF04baNRpg6SGoHIAc+zB2Qqqn9yEzCXfpmpdN2kxdkiMQ/W/X7iT/RzkpBGvlGrx2Bs4pl3s8Akl3mRTsubk3x+CQH47r1ZNgECzf7IP0nV8lRUj1XqsW9+wNI0+oAx/lOGVsHcmalqdAqT/Rb+rp3wthEPxjXI6irxhTZc9U20OHSbYAJCX6MKHYW/P8XRlyam7KHfk5VTu8Tmebd889NmQ7hiuPb6bQu8inM/FOXkO7iEWd9hgyBVEErR+8P+Om2lFcXGp8DGe734LHfS2Pk7/pzSwPvdrkd7/NgVo0V8s5ir4NYME0CzGbOVoiygQKh+vexBN5PkUBa1bYInKhFqBi7f3FP9xdy5wmH5ByEL6YmlsN4H+lvQJBG8TSvwBmhcGUafV9uPlIYlkx7S81YuG+rzfC3Eb07PGLSnvKO1ujlkiGMoliWkYJ6XYpHzhP4z5odeImZqKxZT1hFN+arPz5Dw2e00ODXsBCGrf4jB+45ZT7UrN7VBRUYgrUJx0WkxNyMCSxRCIYwgyqxP8Zv9VC+6aiUgB0eIt08YI0fh2ZFRqSilUuRRvmt5jejdoSCjfaRFSca6RXh9kVAjX/OeC8Fbgdo+Ffx9K0zF8p4sLEk27kG2vWNThL82M/h1BScI2Kr8fOKkYdh+WXxAYVPhsD11sx5SDIEyx5CGwE1cQ3osdYdlEP3/AZPwvH8oc1WdqXU/OM6fdPELtY9JRSNHEepmC3ZWgsLZss2H2qwq00xxA81SAexVdwbL1ektQlJeVMZAGObIMXLK5lkb95dhjMzkc/Lq17iiAPa1uAovfIZZLe/kaNzRCUCr39gjN5YW18DwBEKdQkVriaJc5BKEHi5s3DEMukQIe9bStXDHyciJ0Xv84FSgb6OW6WuhFqtyjdjWTw/jt87MnpqzC9LTP5d6vqhMo3Y4u6dwfNAzL++6ah0G8ahltlcWiZPeGtcG104UJ67f4QMwOqq/jMIFw8leQ9VsbOhuOtjYqx9cXIaiBcng3fueAQPIz7hl+NJ2ltWAECQIyl81LAaRwlbECUyuuxtH/i/nb25kFilIsdm9q0qzIVxbO2/dyBPwsOdwI/A1NIhXctIgDDfKCMOLIhEHXE0TYiDRDEMkzWtQ9aBbO3WRIhTdI8MGpPh+xE3SEvZM3TsaSkSwo8aIp7vcBPSpNIUWc9dx2ihGIUfcCMA6h6H0sgzlYo2LzwzsSBG/vPLUKBRAIDClNo2hylJMPNHUF6/FyCi7vsPpUBU5f1Zryco/9dyqeIEYzdzRL4fhRqyDTW1lv0jlQjuBtfaUaKBPI7Hr/G7RcawKWd8xytCCHq0tGrABFlLf+tFnXvcFRUS9SdsaU+DOI67yy47KiS86yVHnkbvbnhw7R5+QMX6efQ0ueOVdVkKZ5o+0GzRYPc72WXnZ220/EEPvQ2mJs9umccvaJ9JQDlWujkWdH+bCuOl6OBriPwtt/6D57aofIHy0JVbraWRZDo7xiUeThF4JL+APjur4ftrBDOoDbMmJGGRvnl0iv71YPgcPgMSa8PT1ZvFkRgx3zPM6BFff0dTJbRNIHNd92hlQTTuYNVd2W6Pu7Myx+NgVOiFPeih7aHHc/Dn2tVtPIQZTLWhr1BSVJzNpZo72uzoDQW1D6KG7aCPz+193FdMxFtZ/hYE8idJqfsq7jHo6USnTep5tp8D4LWtSPqIJS9+U4cc8Ym8lJ94wuv8uj5DlIsflhtItJUoeNhAnkdEmUMIsLbGt6thjaw5suLGIwXg96aII8ttrigpcKpcdmqmOegLraj5h8AAQj+90zF3YhqscELTAFaWZuUAQMThYiUb/FNHAlDUttdbQAyP0iCmwvBlXj3bwwGkEZxh7Y8fY1TB+UUdVfjDXKAaoLYaWGWCmVzzxQxUQK7wSFq7btNyjcmKx2vXgKNSocDI3W0q3gacABoST1YfO0NC0OZ3VJ2PUAwXIcsOj7fJ6GGGw3hkT0GAMOIASUuHGB1NI2BNAAuhQtFj2vT4FWOBwA8AZQCJQw8v+fPYq97G8tFNng/7Ieg+y8KHAcI5wACkQOUMBG9bgUsiYNGzPHqgpWonRw8Fzw7aDForw4oGUkSvQQ4H18ev2sHhEVc+aMCAykFFh8LmGKQVJKhIlOdALmkAKIDBkf5txoCxwKdUAz0ToWOJaUGAeneA3pOjwFyZwApO7V3akpwjkl8oyOFoQqEjYfUC0cBHVCoAzuMMH42EggBKSJqxhsQWwBEu1doBqQKAktnbzMzwTSck8w4yPZwGjYeKiAjDxSHIz0HE3EjHAUOAk5RLXQHqIsOrysqUAHM8BmGZRVNw6Mi1QOeAQRaLLABABIkQAM0yABTbYCxYAC+HWBJ00xdN0r3YZU7ubbjAi0CrjFHxLMzaNEjFLz+4ScStCg4r358a5kbAtifbaHcTY18qVrMIdEEISdanHgWFdkBnM8/SEkTKfoHaS1aNTmZvNwAflsqqgZLAjBXyAMFyrIpbAVGV6oAKrCcPqAr45KYS/sfi9mObGiSlB0D+wALckOOCGOriDK83ywNfxUfTw5tHzwDGiJaJ4SU9holF5fx3X6qZhsRAQeNjT8E/kvHIKvUY1sAUZAea4Onlj9sE68EoEUB458HLCDmAB8MIw6JSiQAN73SPLEOfGU31KMYEYrTousmiyRtBTQ7ClaT3ANP6uFYKL84ahsIP6ssogAAK2ks+AYESgB6V3UYAypGWgKVqngClwwJ4MMim9fqCAHJWh0U5DQ7OVAdSk8dtdOMDCrNkgSBo/c0qyIuBDEFbkh0SUHxE+47GQEo0sga4YD6zesDkgAXwjKzLArVShiyFFWSYXkS3iSlNQsBUb4kAQKUESNv4bFLCMoBtfxJAAAACsmEpW4PjIM0DDK2ZbpZmBCz6FoZBgXsbtnLKab9EAxgAVmSeUimBgihp8IvMSfWAwTyz2AE0IhEJxVzmmrwNT0PncoCGQXQtXwua50xk3uPDI1DfqKHdklTBVYAioGcInu/CGIX1GcrkE1cTAHQHxBAprY2Ib/AxT4WBxZveQAd5CwBQsaMPgkdmgYbVQpqCW6JAP29BmFQDW+aDAMuXCMvfT9WrGXn00cmaaaXZvgDOV/4nwXQKgfTiEmisC6eemBCMrpfiElpnHRef3auBiVEA0qLWeFLEAUBBa5BCblqmQV/CgAZ1UEFS2EgCvpyuAMpGyc9BVooZsCBADmIoACXkboDAEwGNNmnABevAQcGNhceIVFDux3uWIIEPQAsjr5l1g8ClQpMAwJsOVsOFi0Uvq4cDl8PEVl0AAdaC6mFaVQiDNeeA9ECv47hpTZ7Qk1VRRwbdRax8vFXryTiYolAIwprBlZ0pa+KKl5wBU1lQRMCjFIw0l0YdXYDC6i9MgDUC6kp3+A48fLH86hBDQILLQBhZJ5hWwInm3QIHgYZEWvbV70xWqoFLAPERDLK4HM5/cWVKbX8bAMEE7o/Am2aue5ZF6OcLqqvVu8EC6f8aJbYBZOWXW5xKyBANEqjA6AskyIoAf5MBQGnKBpoPTABR+0/oFUHAU1VAKsOqV5NYgBBHwZZh1rUncwDCp7sSWwDQTYKBQdpCzmIrMgNN5QDEbEvW2QFgmmkKFOns0WDQamWLPHDNVGTniIfRQ5HqfKsg8Uue/ER8pZHd+ebUSOm7KgF63WiTIhrWg6oJYgEMYc0LhWELTvncXdcgScC3S+BnrjLYYsZK1PXQ4GJZugCuQAClGncjGcMCJwGMHx8c7mRwoVCQAMJPQO/MQBbcs68Zz2lDQgs/R85PVvPAzRJwGkC7MYIF/UDBRoHd1GhwYuAEoXDO6sFqIIUr3wOHGmZFK1zH11Bh8iGFWc8HgEoQwXvQRxHJDEUBTF/AplEfWUmWSMJpiEUvAcghlFGEQtETwA/BxQAeDBBt1IYKa4cADo6WpUuAAMg0w4DBroB1hgTiAJ/RN9REX0qcIM3Fb7b2AEEm+mOawIEXgFg1ne8ByE6fvMKVpI3IjdsAQETBiWUmjZGDQhjQTF8FgldAgNRNiACM16kCBXhkWoUp+4SP+hEEghL9k9wZjlmc6scT6cUqAASj5U5aTAbAwOEl3ICCG25JR4ffsEKYfUNKIkoY2UMcAkXDqEhrGQ2b2RrqaXjAx81CAUWeXVrAI4mGDm6bXtoAwYVMi4GSk5PUVtclscH8gIhvXQ9UiUA1unQH3gHBwkwq/5SRAaUD0GYbE0QL2MAiQbzlasuGxcYAwE0vhmvfgAe3CW/9BQfAiZ8Tnxx5COM3BRtf6U+K/tpYA+lJQO+LQPteW4WmCHRYyCQALcpWAIX8w0S5CQPI1seMBmCcEAegczCb/8FJpCzbAWD3H5NorMaMENXbcyM+SqnzMa1KAA9KRESUQB+C5mbhqFe5lVYhRtCGAK/a7AxcRIgu2O0PwDuLixjUViaEgz3FA0zqDci2tBRCSARPgRBM/NkGRlZeCFnHlEiyaQrgIgQyl66REcXNJslVzwimlyANCOKfrhClEyKOdFL7hiibMlFBQQg1jaLPAADCPz3BFXbRsbE1+oiTTkKCl8XnvRMQbUbRUgqR+ICSw/lJnACx3kIAhaIfB8W/BnkAGo4MoPAYEEA7RTnB5Sg3RinVnQRBQYS8wR+CaYzXT07BdYMDs8Gu44ABtULIyJHDl9wejIEAGo6jg0VoCpEOI0/YewzCgIzcEmGYDY8+rhtRfEyZQblSwUeDSI/X7sFhPM8FQbc4nCqKe0BtEIkeVqJcscyajxYOUfpyk2ANDYfAOmZD6zJTRSBDpgL/N5wnUqyClKcYB05MI1UBooALCvUhuAcyf9sJiv8GyJRzX/IQQCyC3ZBSzwcO9sXB4AIlRE2vh0HBpcF5grsAQPnqAA7obcALildiZ92TM224bdMmAwPQINWrPd+RCgHJxgDfwMv0YKRlEBHJnpxkJytDXXpANUtIEdWWmUSBAcJCSPkZZ0GEy8MDKof72cdh+oTQjqaLH0McSmDa3cQnJ6lQ0N/+aitLGabIwgrEzCvmmp/o49p5V0GNlRLPRbu2UehI31oa8rgCQhEB6mYuZpU0KMCA2URBW47L4EFCEEgFz8IC8xlQBN3t0iRJY+oxFKsIMEPAMBxbQZ5ChYjF24zfKVBA5UGcHmAAsQ3Zgwn9mMueQ53L9/rahkcB2PJEpl5AIasYhP/UBsSETYp00xgawArAIQDBEgPegICAY7xP353eEuT/Ty9fCWnKMRFNQQACMlLA661MINMsM2jlS7bJr8GyFo0bmasanYGCDqsgIONKQqkAGeBYAkHowDYzhhEM59lCAFQLOH9SCzwQAl9AQZI8AdUPFsoFXJbAAEoFp1vvyL6CQ8nDsdymYQNX0B+FM0EBi+IBmIX5R0i5ed+S0/eRBB2EQBmGBUDWLTLNyEHJKJOPiJaTmkSDpwQNgYCGQqA1LUHqtAwOYMi/of0CMIHTBipAIYEO2MKkkC1BQPDFD4Ax8nmll9bNkZ7bmwv1wIH6qkQQndEHQYPeXxUrLUnE28cVsctUWoZGjYVKWe9VAI7RFHZnmsoBWVmYD4xTWNtGZ9wFawr+wAASdAIf6sAjAbfucWuRAx4jNliQHDSAII30QYUYqZ4xSGTct2+WT1bCnw+AJcbNXKKSE8ZFR+fPATWLFkeHQcVH4CxT9sDtA1cAFADBk8ZBBaRRpJovyFHBAEoMwPaXYvvOh8bfQxDvxShtHKe4KQeeg/AXhcIJKBkjxwgXgB+PCAtPifdTwusJGdXJibqGQzCPyySkBZJpz9En7iGYiCX83wDeQbt1TdkV6IAAGxhL0wERTmBBzESBRUdFRMctnmVblQLazgBAsJXtHhcHCclXRoeywgpDynhVqyFWAZBYTWCEviIXzaHwMxdN05xDT5FAwDkBC0TbBYFo2ssKCNOTQkodAEG0uYMXix5sMvSBZxfQ3Egc5k+AjwvJQOEN9rFpuYXv4oFPCULWRr5AKprOYWuCATtAAlKBrcGkIICAd6cnwxqtl0lfz/5+hUR6q/mHdbFA68Qz8syO8Gibp8LetHFNF8tRAV0bEYORkJhTRQFxAMdPwUJMicmXlQKBmMsZwKoAMA1DGAAEQEnMhcBtQZgNggLxcHiAoCFFYEMAd91E7K+4vHKXBbOfJrOAG1E1YEkqxGsNwUr0w0pR2MitIQ5BlqXAA1atwMCSgBYnTuUtAxxNg0ApC4fgrhL7D5sQQM+pLcGg2RmHwIZNZPGC/cI+3Dbb8WlBSCJ/uO2txmjCBULLyHgqeRjEBLnACxYAkBvBQE2owNsMXy0kzWqADm6Oh7HbSK2kQ53AIoKAFWwN02IAuhiBIQgP30OBTUCcpQr5T2fJjB+bUd/2g5Go9sMv5CrnFlpfAWsi+mamCLtIz5VFsBrbb4AM42rGna4cyoQ2eMO3z8NN8BeNKCKBQp3jFrOL+zqP9WWCQukQGBjmPsTAChybv4zgnVctaQ+ynQlaFQJtTPSxEAsRLwRAK0pStgs2M0EBQtIBmKomNWHKHU1uDIsAg2kEHvlUc5/AgICJ34VcpskFZHSgGFydLhFCo6nCXFfWXgIGgY6R9CKIkFdswK6euK1SRkYAxdXV1Z+9UWpQQOzIqloZy0FIoAZfxX7FAEasEKHC04pAAbnGP4CkFFkEZniWC3xBD13ADNArAFjkW8nICQKAOvmzBI8y+QwMBUgcrY0WJdtSxl0hFiiptgP3hDTlmpdVwDTCwZ0BDrZS0eTQt5GALQLQQJcPsQNOkguZZwCIMTEeadTAyR+ijoz4Qo4VzZZAAAlkSVs6VUcZJepUq0Svzx14BNIbWLpMC7XFJGvfVpoWr+cAI4twmWi2I9wqgwAaiwDPtB9E7z2SlYSA4hvaKQ1nAZ/MnZ2kRZ5P60FIq16lCYDVwVsKAx1BqPRgzsOZvKTPIoBn9kCKTDuDtMFqtp2nRYWNRw6ZBc0MvZ2DYu0CLhiWBeCK9jSZwBQ2CySAafnVwKo3rdJXGWGUQv5gHlWsQQUAFUmWXi4AQNX/oqvEnkEUKG6tlZ9QkzDT1jLpmR9fWCg4wByAi0AWeNCBgYJ12ItvmMCNwrVZkYzcU5GBs8aT0XcqZ04IN6FTgQuL9dZDbIa1W0ER64dUb07oB0eE80fZ8/do84xBFGBcwGbppkJq530TW9GuGMsjLJLNAWrBU0KAKYedUoDH3QB0iGTAE7OOxuOVL8BIAMPUxKLA7HUBjHBHEQvFD87HYE40ZqAAXEF3+EI/FQAACAASURBVAA5VAcYSqwlTR4TFY8AFHwtHQXQhYMABwj490xjbrxCQRY1FA0MBmQdfy8KK5JQK5jIhiNb0AgjOAP7zB0TqcsihQUwRXSdVE4CD0RhWQx6EEYLhhYAeoE3P05iEwbgIiTEHEUiq1SOJcmGFl7Xv0dlavCgAliw5QDiemOUAuaucf5lhTXGhc5AoiqoZFu0WZDr+oQYAoJy3YAB2FsNETiWuCXLoc1tIQasfWYAMgQUTgYARFslHwpiRDUs1hBRoB0bQ7+s0NKTRd1E/RCeHiCeUK9JN5EAdJfznAEq8htHb5ADuUQCf8tY/UgQKaRCDSYrhAiA7UateS9WPksK2cYTfUrVpCTmA0SUrFBkXh0Am/veTf7P7Lb4DU8aKbKXz0zdwW3XchzRimAwkx59hHaKO2GnMbYaFW0YBYkNxWp1SEXiNNCm5g3DNIMgtw+ShZNpOpYq/Q8AswmkIiOEHX99N+JMMAC+JKYI7yrXvJWhZgcNbtz2wQA+bk7APAHTMxnOjSWcrcbzX+OZWahITJEaSlVq6X0QGs2kD7jsDlU8ixd3KQOKAgHdAVMANmNMOIuMjEusSjd7Aw4HHBUmlmJgCkxWYk4Veq5jVQ9CFDiuddoVjHF4dDYARDwtTkEhkSROFdWSdDsWaCj4BExuaA8OTiCxBNJIORyAAoMOTk1iT5wDLiZJBrs7VV4uAKKQCxESEKAfymPGhzOP0pVhBGA8ol5iCxpyOoZZFCJJRRXFTm8sA7PfEnuAEgFx0kBskwNQZhyzMLaesB4SdgBuQAKmhMetRhYAICQAP7EL9S9J8rk7xDAYgIxMIlDWBG0DAW8BYAdGkayHGwwrAi4b/r5sA0rCezgdXjtnijaFR5eSBAz/aVQ+mggCDxmYem6hDQtN369pqjuUEgAYD0BSUCT2CaA0BkkSSiDM6jOEQDOFjTDiIQAVX1TPI7bMwK6hF1sFT16bBoFTnVAAFcgndTYODzc/52xpHRZyNxDDkQBPhGMNhklGAbYDJLs3NFGGnC8lCpbuAl06ZWbRM0QQJgfnBAVVCyqR6L9SLIHQDAVNGpYiAIc1AJk8AIAA0TfDOzNArLrhf7hEtVMnMAEBCT81VCmAL7wJ+AKFpQS0Xx0tbQDcQgEJZzcdBW4AOQB2yAAFEeGWwhWAatIHABBbsCfCPlQAikYBjxdYEHgjNAUNL8OWdGkAXgMfOQDJ05gDZyTItT4pIibKF7+xXSp4Shfkxy9Vylsra8P4h50uKHAGw0KZJbkH2GZs1xvMPI3ddzg1sNxcsWHdA6IsCN0GeRJtVDCuDUWwaQAlQj0Ad2Ca6wMJA8+cfEoKOwP0EoXGHg6EdQUZaed7cUveOVMeswMfGy++GDwFsSsb6S9ehSIqVZF71JbZh6LBFLIRDiAACUrQGh3yN1sIIYIkUOeTKl1MTeQYCiMBFATQgh+ynTsCSAOav9AxNUF/AClE0gY7BIsUJiVNABBFJRT2FwgAslkF4mtM9lMDI6AGHrsDBEMhcPQBAnwmdg8o7YkIzxJYkJ77A35vQ2M8AOfeGivv6N1CumQj+RUGPQOXLeEAqgIp1Ig6o3nGdRl8PTUJyQFDEAJ/KNdr3gkIBywcNHDoiAfNW0CHClyw+AbbsU+ruOwbBAncmpU0WePmFgtJd4UAHD+zLgBSQQAugirUKWA8ERwyAjfDPLchDh3EdJRQgbHANWS4bDX2QWzJ2mJZh18YFTBxVgJsBe9gFSoE7VZXKLlzBo5G6q7l1hLxmQMMA6MLWH9PJUb3QgGZC4SBAx0BINreFj822QBjNwMgk00EK/kAtPUvcwxhc8cPRQBSsLgAbRwSGiMBLa5gDN0OekNWCnc1aV9sqeReuiznCC+PLMjJAh4xhq9iAwgOI3IvvyBg2TibaC5IlpM0Lkp8BdcGL9/LB3D9u3oJVwBZDSkkPQIITsjVS5NtqzukBoSUItLaLUeGQlRph9bxmRwAOCK8upGsTd/aP9AhFkwjBnErDQYAAT28k+5LG8IaPTLcvCciEHIbDW8PS3F7ZABuCV2xjgQ+9MHk5jktIvwbTCddCpWOGVBD4QIOfa+MURkdX70FKoRNAA08ttApUKfTq7tHm6YZAJYNRtEWHxgn4AKWIzQrKipAgSK8tk9aOQpky24DUkQGZnVQoRUBP0NDRI/UwgIAMfAoEBSLZDEgLRO1Br6SV38EF7rXIx/JAQ8E3EALBQcSgN0AFFDXMM+Lcw4EFpWDb2knRW/mRYYdfAUdfQLwWhkUCJQyms1ksgTMpHhbAHil+gEBS7anHDTwiRpCrmULHlgkaWl2VL1GDsrg1apysgeLQcKytiGpZUOcDMqz7zAAQwIiuAc+MjjuBK+JmoanK95NcXD4JyZd2Nh5dmU8IRLLDQdeCTYLvtBn6g+P6dw9JTYeVpoGi4ogu1N/K1HYkQC/YBpZAtrEZABeIfY1qIPPzFLFqQ4DDANRwxLNOQFjDca2WfiWsYh/pDePNz8H8AwduiJsSFkTWQRoen8WGw4Ahh81nyQBP5AGhR0E26ZwQ6DHcrwHTrJhA8yogTgLH9PiAFsgFGUJZgB2SLsyWzN9ASa5CB0yXwEJCam2WKEPNT54YlMBn+0OZwAdDwgEA9SnqxNDFoEDQT0NGaOFEHRADFm8F23JWUQQGhMCArWvLhNCfHChBBcNC6QNK40boQEAO+lRHA2CUxLhZyStpJ7pkDc/Cj5S9VMYHgC1PkR/KyVZmwEdKqJACDEcjSYbdxq+AKHVJUhxUMLPdHUdbAACCP33H9UAA8AELkYySGs1NZFvoAsnLu86CBTGMDtrpS3xOIHVHOVVSwUjxA3XFS3diDMPLbOzB9k7Wc9QwVJ5rhsB6E8S1AAGLXom2BIGMhblrl1bFXIYjQSmRiUtBVEKRbNsx4GKS0NiJC+HPpi9LQ76mjyf6OVwqBcGUmYEXgMTd2A6HWqzv7eGEQxBjkcBU/NVLCeshKpDLHJlq2tKGXeSSwFCJS0yAwEd0QEQYULiWW5o1uMgCv2UbVQVInoFKCv7FzYEEgB+31t4HjUs6mheCcGtRwxkMsMlBBHf1b0ADh8dZLtXOJM2kDUSjgxbWZmpAjISVgRbC4sCJugEjdR31gAp7hMAnkgTM5YXSQOZPGsHOAKwefkwknwPEBMqfn0NhJUI15ICbM0TWmmseAWuYeBQiaoWCRAA1AKbxAo92wPXEUQw7wDfnSIrnG4CGV3YXaBnPavwW4OXApQBfZxDwQ1iC6MENCEJAOKZqDFUARg48iFDTDLhNwWjqH4WHAE7PALJFQV7EwMBmYl4Mx4WDqsCAVgA3AQC/Ncp2LMA2aotBnxeNApPDKe9EVSiGS9JMEtKwJUIlwMUDac5oIEPRnapEikLMwAhzQUgJ3QiA/CiOgqWe23hYA0ZAglKDSQZOAEOC72KBJoavjfOPF3IWRciaEYtEzhLKwC2bklkNZgpRwI6WBtPAw+npsDsD6wU0TJ18JCbBy4aNIHPCstFAhRbFzkDOiYSlyULWoWJuUmHMaMPQhe5B3kbXkVL5bZfW0cOMzb+WAAAkGLfDwBkZAAVpGI4umrpsOchSIGKAzcBIjSXoBNokAlDLAFxFpsCbPTQTw5xswgtiyR9QVUGBDzWTAaVDqEAbCsATiO9za1IUezkU2NfcW/LHFaJ0Z8ACSpJVAV9AnL57hOjBs+jBFaPVyvne8dqLUfbF8GOEKVCDVsBLgxdJgBoClkAqUMmZS9cZrUUCgko/DTSHhYGPC75Dm1CIhnzGV44TgJ57DncEMTOEBWMAIEzFCASqi8BMQDtz2WwAChwVFEFYF5qEVJU837Uyx7fUGxE1YBGgu1N0nEsGiYBARCJGiv7nw4CCctmfyoGrnruhwzdwJUyHQMCWypq8T6caAAE20uVHZAlymbvOgSEAwDthEIcfAVjEQBvBRkXkhxrAm2ikI8RNt45FNuOoFokRRdegaaQOtexKJK1HiUAJWEDJgZz22IINjqFaReWG/QEzfsCRBPGyDdYRgcCrzIksE9ZRSXiAdKtH2VYAuzuqgMa3rADi5QGUH9vDzLeOQIEWwAJV4ubXVPDh5EkEzIVBjBkdMcxmAdVxQcDjxzkZr7HeTUzAQ3p9AaLaZGNHWb007EKkvOzc+9NfzgpIllL5myLFbQLygM4XgYF1J2Tvk0uFwIOEtlkSmFFA/yLJ80NAoMAXcbeHgxwl1jcouxbixCh2lPHTFx3qtaG2fp20wrwOgAL5yMrCgRJvQQtg38vXwf6doIW284PZBpHpsBJPzedw5AHCAEMS7YabRQzbkW6L7ndADPqNCkhAZiLdAMYfiZIPOYjGAwGD9Y6vGuiItqzLShPPJ6nT1V7ZoqepyOwL/dvFVxifBwAiHaMARYTQUxgAgACKxRvBh4kjk4AAwUq3gAAEeZC8yAMw5i22C0+GDtgBDwBXg98AwkROUA8S8YCBF903leViZjUa90cdTEOBrwDXHw1Bg8SIAD9EsSgIQwFDEcasGfBcl/3AGhtMD6YjLVaO7gLSl0BA32wU8o5AecqKYOtbh4BdQNIjo0geknWgXWS7wGzHxZ0A3NqHQEBcwCtNqlyt+c0AOkASngGAApBSYNSsGARwxoqz0NA/ggLh2AmkXEAlkauySUDu3QbBNpQUzkdYm+uYokbAjUmTZkCjHh5Zg4uAQ1OY2Z3mUl9vCwNoKYnFjSlbmiP4RmPUKK7eZ0DPgnn0ZqDmJDuA98yAQ+aL1PCSm9NBjcyE3BMmwCmEOyvBOilD8z03gZJS04dEK5yxwBKUnLULgA795xy0+1MXWEPe0MSTWdOSllnH4JfHofxViJmgMVAnbIMYSY+wAUMGScQ1g8AYqARnwEBAwBI5pMFeFOj84MHBNMeuweIjvkDExPKh9omslGCSVgAiN7YEB44Qpp2LiBjPdarEADOBIQdaOdMeA1XMJ8TpvwQ2tGMe61kiAcdEAoCrtBNJ2/Rhs5WfILCBiM/lIG64B5EVH5MfuQS8x03Za2ACu7cEw7NMQ8fIgA9EhYzJYmjV4svwhdqDI+guRTTWvBAXB1UdpDG1QI4DIY3NMjq48cHAg/PbAeQEFlY8rE5ClIACwBx5RxSJp0jQxFhGENVSjUQBQw2iMOKTHxkGjWS9SnbArELcrY0rwyMZT8ShykQV+FwUJMuUgaIWSeyRBZdbRACRCCiiSAml2AEGGImDUh7HGwsHG5KaxaGKsADQ18qC6KJsaYtDUsAATMPnDFfNa8EAH09YH2HsN5GykhFWAxNkwAGCSh0Vh/nMSOlhmUY7RVMBADQmDc6QPpXOVQoBbAMOyECuunUyxPgsQ0ETnBwRXQBAD4Z9IYX3tRMpbUBBbEOtydiCAIYue+9ssJjHgR/2AeVIIGbAmlLYUymQyRwZQTXBlCWmgNl48hVM7QSIL0CdJNSu2lFnk8fiZUZPRFODQCEH0ExjxJKSHJHTWlhSvJmIZZqczI+ADBfRQ6D4Q78UtkAAwsBw2I4MWsZlxhDLwD/BwD4WAUGCne4shiGGyeronSUAQXP5UkAOZ+BfwIRRANQS2eyNSEDcP67cPQAAA5dPwTl5Eg5FHSFGiQZF6BZBxttv2GoyEQFB0xSNBUW/EssG1aRABX0L0oXTk9w9P/nm+ZVMmhBQhcIGxhYOHHoHwNzJldxFQB0KHapYgBDkY+WKIQBBS3cJQYOvmYAR0qKAE8GApuhVQDTKawrE0mPBQG0gt28GoU0YHBDwfqHHhjbkDpoSWVWA6kEs0e1jAIvmkyegpM6G1IBXUzELwUOM2kAISwmADRsQ0MwYxeYL/A6RQABzliwKBgSK4MIxgogDTzGA86dDMa+XUMCLkazOuVDGApvbCfg4CQac2iJU8SvkQMoMrD+PQICV+oinEEdBm0iJT4MyAhTZgFYEnkWnG9xn0y74ilvXe25Jbli4UIJQAJDDjXiA4QDDSiVdiMi/rXIbh7VAPAPxA4UU/bFj9kDQwQKkZtHAlmRGwAt1n4c5uKmg4kORgd5WBq/V17bNiFuAu4AXIauVmwyb1tJ3gLMkljMvYJpCGEM79RBkhofAX06o1gaLwLwTDaMDQEFuzw6UlE9ASVc4VhyijlwMBC8q5TXBwY+MsgHe0VJoAJjlgAUvh8zAAcyNgUYl0e7u2JdGR5GbEOPBQRZBIQBZnrZAvJGzYKVQg8nTwskXgRp1hvgBRwEizz0V35fMqtosBADNwJ5EsGJBAriES8rADV+1ohgBwcBL3YBFAiISgIAAaiaHtpdDgh2Oj1Dg8G1gzdxdGkYQwW7CQCTNDW1GGtT5qJptqfhAAM2bhqP/YwZCWvDU8wVZmt9qQ2yMo6+KHLZ/dslAgWy5BanAIcBnb5hcjI7WBZ6AqTuASP9LHZRiHh0WQ1dJzgqMXGNqSWF7duSohXEqt3EAck4ZwUVVX45ChZEIBYeFnpOC5wPIwA/Gt0cIcKsoqTJPZ1UTRMBWA9OMqWcK8/YAIvfnzBhEwXifwgthgYgEecXBAsQZSVfVQ0ER3w4TgE8iE6ZEIwoFTYzUwGwt2El03Wp4Q2IALsOJnVYBGZdKCUBwQAqAFqlQEZJRbtrwqcgXlIIUx2NcEShuvIBbgq0XVCNBAKhUT4JQB/OBgqIf3FzY6V7OyKAOAoBASg2GU9GAA4AfSMKojG0m5gyqAe3MXWTUgDAAgxFtBcbx3gCmAYBRCEIaWdBmXYDgQdPhQMSeVkjt+IFTuC6Ij8N8+cIOhMxFvN0DJU7rf6eCTpJ9QNR1LoQQQMgEY26fApxVC5HOGr9sKU9GORpdSRjAW4rUEs3GgRFo9IJvYmKIxn3EuAwADMMjc+dCqyePSGpQbkhEXoVHwb9SJ5eMR3zbXZ4JW2BqZVw2l7pIXRrAhSAEAVRS84yK4rNO2l2wNVcCFW7FQwbADpohDhH+ALV5AgD4rQpGReMQ9tkmLIzbxPPHStlIdXCbS1hCEj4yktcH8cO9QspuSFFc2sfFMjhw8WBfwH4AL00SwUDOthSQB54xEsG0i0ACE7WuddaHtLJZxcCSUEYrDRF7xRceFE3AC2x0k8HnShj+8mn1AICDQvHh7yrNLLpdSMBOF7XG0MIKTpg3XePZSgxj4EUDQW6ERczAmkHACMqRzp7jwLBHE1J+9rgGE0jMKR9eAC3iUeONakBJAvMALJ5jyVnHDpo4HcqIQQqJDKFNBhoGQpAAb6m34tpMCwA0p2et1pv9wIkr2yOkSgpxQLKc1IqDDsWJgQWiFnICOdG5B2pQ1FQEqBk2k0FSQ8oLkFGe38tCE61lDAABt0AMaACES7m5uDMWkOQJp0/Hg41dp5mhRNyv+xrYjkRExpXAACXB7ToUYIOVBcRGpltVbe8OYgfXFsByY4hGhkpkyoB7hcF6K0uvEqfZ3griUwBA1c/lD66CQFPcuK8UwRxQHrjeyZEa4w1vRQqYTgxzxgQEhpdGRUUHRNnf4vqR4ObYGCWlrtDMwhWI0ZhExohPDYcfbYDowruYrcukRU+j0IGABZOTatOWA6DbwRHWnODFRc4PImVa24k7ATGb0kbQpcSsL4YFbkgARWhBHl6vFpBPRSyVmOdTmIXefPQCLgLUWUpNV+MAwdW3p10p0eu5BxC504BVIXy9c4JWFeJA2BjBxPZAnIBVQAZhQU1ADH4DjnMGeNHLOhzGY0L6yQtbYoXAJyb6u1PF7UZ5yAt4JwGYldYBd0VembYLQBnVTpvhSA/ckID5KwqDCHKBp0YAiR0oOcfXFD5GQY+oUJH5JqHAR8UBB9QqIcTPwQDE/cukJsaOVIbAuUBaxEVKvd3i2+Q8BAfV8nGOwKY/DtMAgkLMOnoHpCTARcGXgIUhPyYDnVrAExDQSJ1gGIMGgtYAytm5mAuUxtoB58TXTtv6wUAa0NdRSmbkMUEc15QPzEmWRQCSiw5cA1VoRQfWtxc+T0F03kr1T9b7QirrbwAXiw9TpIQLwMRz1BPIlLVz2C9KLQez0US9jMGnUkwCDWWKKWkjQlmXDZjQFxL7nsoey5VQwonAARTHV+7T2o2FlIjAghKc4pLVFWlP5YBH+iWBrccMUpWvxfLgF2Uc3GlpxBgKSA1C26DD6lECOuPBZ1vBhzxaoJkOfOGBXEfH4SpqLmcqQgHLqpA2FJvoLGFBTTtEVwPgIAWD5czgF1YKwbKK0omhid9pnsG3sdBFgMCnWEwrAt/AAxsDcl3PWYuBXYZt/VAEHZFRyu9ERMlZA7aGdcCBgAJCPb3D2AtAxKrHCcRQEh3PMxxSgZzhpKkABTYngRSabRPLwAEwOdIZ7q4CXUDSQBW4y0NAs3GAJEzApI+A3ch8L5wJxDHl31utHwtomsfuOkYFHczQFQ9YpEkspI90XQaQREGQDYArfYUTT1n+WnEVRlkMK0YFEehewNFXB9Qf7NnPPRJozTB8ggFWhokACEeqsVTFD4NFOtfQSlGkYutE1BndA5zBjM1zCAsKWfDYBYCKsZanqqU8mgF3ANrEAI/HOsHDjgi8oycUYmlahbDEym+E2RZoJ7CuZQvFIZ+Jo+CNsk+dvgAXSsCovgCRS0tyH+aFYaA2V8ApQLIFAW2ZfgiAlIEuwIO4Ap2I1xnL9wAdig3UgIGf6YE6DbBBHsBdxUYPHjSAHNWkIRV4yToTJo9fHKeIa32X0luKS0KMxP3Ko1eRBJCWkIMxCT0QmGFVau4JCE8fyjMBrtGXRFQD0ey3ylvRggAFQMds0jrARM9SsnGPBPwES6Nxm00yQBywllTABaqCdwPMUoO5Qd85Skqddq+OgvwnB0cAXVO92EWHA4IdbRkNjHKtgz1P9igRVKWJTcjwZrR8wLfBG0HCOFOoHq8bxdTQkAxKg8nE1DGHtA3kQgro0sY9PUYwjnZqgN5FQeHiEMAFRkElNIELGVYpCzs7psuagceOx6VnFMNPy/MDQe9BwEqPVUNBAhc0tpXAFewAxZ+AKsGSriss+52JIsIOj6JVHuNtiQnblFpaV8ED8LHvw4EmBgHL1UP5gNrBQ0SQdz+AxUBqnMDNuBtmgbCMweoGxIq9AbOQIyvOd0DVEUOXzQAcJCuFF52j5Jz5aHRQ5YwMny8QQJcFYgAF1sGkRMQBTDDzDdfK4SKytaorCm44gSOswA1lc1IVWqFuh+6x3LnBSUAE2QIWigFHb3YC1BVDwWdb4eIFzrNRimjqSKpwzltIIWEdI49Mh06XQYKBw41oWjUAHwgEoKXEKItKQEDAAsANWhxAN8K2QR2g1UjAts3mDkh2jA/LHK7BM5OEQ6oBqLLHj0aA3U3MX2Kb1wEBNIHNul/ogAnOGEERQWVVxvZA01dshtiBA9sUJqjJEs0APzrxA5TLhld+ImbOIIBSAJ5CsWQ9nwDE4EAmwYAFsoF28p6D1uFMYMFfgYtE6qkNwAATiwqvE9QADoAAQBqF4wG3QAumBeeN0klpFMCJGmFA9QrBAiYUiAsAFvNnm/HCXOBHKIZXyFlQikDC34xeT4IqQES+kh8NAMYAUEAvgB0HiVoCiMIbI4DGSYNQndiOymW01MRHDwWzs/FkmNBosBbZlMJj0LSAQJUiguvPQAHSxcATgAEbkceKlAmA966PQGGvYaul2NcZG64cOS55stIjxIVAZyuYlwBAVoJLrV6cSQeOwLpDQQb3gMFBUOMOKCAHgTAJd/0fsZGRCZz9eoBhQZ9Lx+BmQgjUNWgNZEbkzIzJz7Kn22XMHV5p49UihqXk6EAeqS6kDqzQcAcjElhAwsAIw4bkjXuBXHmkwJFAT8NLgCQSA9fAmoWAII8yBinKIFM5qNFDVITCBY3q1P2BKNnIPIJoA1wSGtOVkMVL0wuW3qGmRItFEJdIwMNRwI4VlZyFA5ntqYu3bk8FuzvX73m+0e8MiSObrkfXIS3PqwgW30csgKb+sNWNAqkAUAHHBcAHisPF8KyNVwdjib4CQEEqB8BBk3RmxoOcAYqEdnBQnikHk+GCzazSTmuSQXIjV1IPVWWBJEz61wSEA0AQA89r+DVIWexHfEtWzwaxWhXkAxh4jFolqsEVsMROEk9ijfAAR5jTmj6exsBtYRyIiMoZ/4tVhPlPMTKWBfLMQIxUwEAmQxJGCMFSwPjJwj2GUxYFhcWg5u0ntEASB9dCwNnhlcp7wADVo2t9ZEqG8wJWw3bW4IBpoWxDiGWcPxTjgYaN78JGGW0oA4BFsFpqTAKAAQ80REueg8DlcPFnx1jXTAK5NnxwgEb60cNmUb1gDo4IDUGyQgCAW8uBE8AClg+kQEACiJyVT5uW8RBG87AFApFlOwHAicmhoIYJ5YKAQzVZCfCeuuSnEUSeZckEiordDgJUX3LlPazKnfNjiIeqMxVZAZZADTEEkZ8EXGL+gFGwrjaTHyCEb//H6AY7NQKJgsWLAEZPFuLZnZGRnQtp1EuJRVuJTGdca2pHwCthB51+ZgAuXp+lRMyJ2SAgrYB6m0Q+/4YDM6aKGi/fSuVCQVuWtMBKztbqWEoa85PVdo7zihmsFxiXjnaYQAUn5bbKOh6s08RBhjdaU82QD8htgUalV8OGmIHAFTgUJyiMgTgxg8fON4ZAaBIgnxJeaqd1gRvBBMITAdGJWRKWx0lAVHR0j4AdvYAdQNaQJUDRHlHml5cSLMjaYxAqHmbAaTZAZcZ5s6JLJGip7sCXaw2LCRnK1YMO4sFRAgVWgfXMfc+zt038JeI6lkCDQU5yCGeZRBOA9aMG3e0AZ7cmQmKjgeCWvmJnn7yAwY8uoEEL1wLBADizps1VFIzm5UYtBHFT5Qy46UAsQTBZCwPgljNPekNGEwdic0FR1JmP5AAhShTl4MCWwq2By1NKlUqzQQGAidkywDoSgYGtQ8JRdefJLqPjw5YsD85GiBWlRsDZ2GzVDkCvRSyUzIq16YUXEBLd2kGn+rLIwAAAK1JREFUf54DD3C0WwmGPi9OSjpCA0A7fFwUZTm0ktDZLl5VXmbFDDQACl7+QSry5QCM2bfNC+WAFj1LAzLsiwEBaQCW/1EGcMN/tG8OViQtylulBUxRADYm5SEBRAcAARkeMC5iRNgZhOoxnz4oHApa6gD3ASdbmF188wxpDZVKUL4RUhTSSRvrQAZLDcgauImabgJzkXIaALePAXot1j6Bdwe3AXoQAnXMFVuCApGWbjuRvTu7AAAAAElFTkSuQmCC",
    Ug = `
#define TWO_PI 6.28318530718
#define PI 3.14159265358979323846
`,
    Vg = `
  vec2 randomGB(vec2 p) {
    vec2 uv = floor(p) / 100. + .5;
    return texture(u_noiseTexture, fract(uv)).gb;
  }
`,
    zg = `
  color += 1. / 256. * (fract(sin(dot(.014 * gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453123) - .5);
`,
    ks = { maxColorCount: 3, maxSpots: 5 },
    Gg = `#version 300 es
precision lowp float;

uniform float u_time;

uniform vec4 u_colorBack;
uniform vec4 u_colors[${ks.maxColorCount}];
uniform float u_colorsCount;
uniform float u_roundness;
uniform float u_thickness;
uniform float u_marginLeft;
uniform float u_marginRight;
uniform float u_marginTop;
uniform float u_marginBottom;
uniform float u_aspectRatio;
uniform float u_softness;
uniform float u_intensity;
uniform float u_bloom;
uniform float u_spotSize;
uniform float u_spots;
uniform float u_pulse;
uniform float u_smoke;
uniform float u_smokeSize;

uniform sampler2D u_noiseTexture;

in vec2 v_responsiveUV;
in vec2 v_responsiveBoxGivenSize;
in vec2 v_patternUV;

out vec4 fragColor;

${Ug}

float beat(float time) {
  float first = pow(abs(sin(time * TWO_PI)), 10.);
  float second = pow(abs(sin((time - .15) * TWO_PI)), 10.);

  return clamp(first + 0.6 * second, 0.0, 1.0);
}

float sst(float edge0, float edge1, float x) {
  return smoothstep(edge0, edge1, x);
}

float roundedBox(vec2 uv, vec2 halfSize, float distance, float cornerDistance, float thickness, float softness) {
  float borderDistance = abs(distance);
  float aa = 2. * fwidth(distance);
  float border = 1. - sst(min(mix(thickness, -thickness, softness), thickness + aa), max(mix(thickness, -thickness, softness), thickness + aa), borderDistance);
  float cornerFadeCircles = 0.;
  cornerFadeCircles = mix(1., cornerFadeCircles, sst(0., 1., length((uv + halfSize) / thickness)));
  cornerFadeCircles = mix(1., cornerFadeCircles, sst(0., 1., length((uv - vec2(-halfSize.x, halfSize.y)) / thickness)));
  cornerFadeCircles = mix(1., cornerFadeCircles, sst(0., 1., length((uv - vec2(halfSize.x, -halfSize.y)) / thickness)));
  cornerFadeCircles = mix(1., cornerFadeCircles, sst(0., 1., length((uv - halfSize) / thickness)));
  aa = fwidth(cornerDistance);
  float cornerFade = sst(0., mix(aa, thickness, softness), cornerDistance);
  cornerFade *= cornerFadeCircles;
  border += cornerFade;
  return border;
}

${Vg}

float randomG(vec2 p) {
  vec2 uv = floor(p) / 100. + .5;
  return texture(u_noiseTexture, fract(uv)).g;
}
float valueNoise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  float a = randomG(i);
  float b = randomG(i + vec2(1.0, 0.0));
  float c = randomG(i + vec2(0.0, 1.0));
  float d = randomG(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  float x1 = mix(a, b, u.x);
  float x2 = mix(c, d, u.x);
  return mix(x1, x2, u.y);
}

void main() {
  const float firstFrameOffset = 109.;
  float t = 1.2 * (u_time + firstFrameOffset);

  vec2 borderUV = v_responsiveUV;

  // Optimized: only compute pulse beat when pulse is enabled
  float pulse = u_pulse > 0. ? u_pulse * beat(.18 * u_time) : 0.;

  float canvasRatio = v_responsiveBoxGivenSize.x / v_responsiveBoxGivenSize.y;

  // Optimized: cache repeated ratio calculations
  float maxRatio = max(canvasRatio, 1.);
  float minRatio = min(canvasRatio, 1.);

  vec2 halfSize = vec2(.5);
  borderUV.x *= maxRatio;
  borderUV.y /= minRatio;
  halfSize.x *= maxRatio;
  halfSize.y /= minRatio;

  float mL = u_marginLeft;
  float mR = u_marginRight;
  float mT = u_marginTop;
  float mB = u_marginBottom;
  float mX = mL + mR;
  float mY = mT + mB;

  if (u_aspectRatio > 0.) {
    float oneMinusMX = 1. - mX;
    float oneMinusMY = 1. - mY;
    float shapeRatio = canvasRatio * oneMinusMX / max(oneMinusMY, 1e-6);
    float freeX = shapeRatio > 1. ? oneMinusMX * (1. - 1. / max(abs(shapeRatio), 1e-6)) : 0.;
    float freeY = shapeRatio < 1. ? oneMinusMY * (1. - shapeRatio) : 0.;
    mL += freeX * 0.5;
    mR += freeX * 0.5;
    mT += freeY * 0.5;
    mB += freeY * 0.5;
    mX = mL + mR;
    mY = mT + mB;
  }

  float thickness = .5 * u_thickness * min(halfSize.x, halfSize.y);

  halfSize.x *= (1. - mX);
  halfSize.y *= (1. - mY);

  vec2 centerShift = vec2(
  (mL - mR) * maxRatio * 0.5,
  (mB - mT) / minRatio * 0.5
  );

  borderUV -= centerShift;
  halfSize -= mix(thickness, 0., u_softness);

  float radius = mix(0., min(halfSize.x, halfSize.y), u_roundness);
  vec2 d = abs(borderUV) - halfSize + radius;
  float outsideDistance = length(max(d, .0001)) - radius;
  float insideDistance = min(max(d.x, d.y), .0001);
  float cornerDistance = abs(min(max(d.x, d.y) - .45 * radius, .0));
  float distance = outsideDistance + insideDistance;

  float borderThickness = mix(thickness, 3. * thickness, u_softness);
  float border = roundedBox(borderUV, halfSize, distance, cornerDistance, borderThickness, u_softness);
  border = pow(border, 1. + u_softness);

  vec2 smokeUV = .3 * u_smokeSize * v_patternUV;
  float smoke = clamp(3. * valueNoise(2.7 * smokeUV + .5 * t), 0., 1.);
  smoke -= valueNoise(3.4 * smokeUV - .5 * t);
  float smokeThickness = thickness + .2;
  smokeThickness = min(.4, max(smokeThickness, .1));
  smoke *= roundedBox(borderUV, halfSize, distance, cornerDistance, smokeThickness, 1.);
  smoke = 30. * smoke * smoke;
  smoke *= mix(0., .5, pow(u_smoke, 2.));
  smoke *= mix(1., pulse, u_pulse);
  smoke = clamp(smoke, 0., 1.);
  border += smoke;

  border = clamp(border, 0., 1.);

  vec3 blendColor = vec3(0.);
  float blendAlpha = 0.;

  // Optimized: only track additive colors when bloom > 0
  float bloom = 4. * u_bloom;
  bool useBloom = bloom > 0.;
  vec3 addColor = vec3(0.);
  float addAlpha = 0.;

  float intensity = 1. + (1. + 4. * u_softness) * u_intensity;

  float angle = atan(borderUV.y, borderUV.x) / TWO_PI;

  for (int colorIdx = 0; colorIdx < ${ks.maxColorCount}; colorIdx++) {
    if (colorIdx >= int(u_colorsCount)) break;
    float colorIdxF = float(colorIdx);

    vec3 c = u_colors[colorIdx].rgb * u_colors[colorIdx].a;
    float a = u_colors[colorIdx].a;

    for (int spotIdx = 0; spotIdx < ${ks.maxSpots}; spotIdx++) {
      if (spotIdx >= int(u_spots)) break;
      float spotIdxF = float(spotIdx);

      vec2 randVal = randomGB(vec2(spotIdxF * 10. + 2., 40. + colorIdxF));

      float time = (.1 + .15 * abs(sin(spotIdxF * (2. + colorIdxF)) * cos(spotIdxF * (2. + 2.5 * colorIdxF)))) * t + randVal.x * 3.;
      time *= mix(1., -1., step(.5, randVal.y));

      float mask = .5 + .5 * mix(
      sin(t + spotIdxF * (5. - 1.5 * colorIdxF)),
      cos(t + spotIdxF * (3. + 1.3 * colorIdxF)),
      step(mod(colorIdxF, 2.), .5)
      );

      float p = clamp(2. * u_pulse - randVal.x, 0., 1.);
      mask = mix(mask, pulse, p);

      float atg1 = fract(angle + time);
      float spotSize = .05 + .6 * pow(u_spotSize, 2.) + .05 * randVal.x;
      spotSize = mix(spotSize, .1, p);
      float sector = sst(.5 - spotSize, .5, atg1) * (1. - sst(.5, .5 + spotSize, atg1));

      sector *= mask;
      sector *= border;
      sector *= intensity;
      sector = clamp(sector, 0., 1.);

      vec3 srcColor = c * sector;
      float srcAlpha = a * sector;

      blendColor += ((1. - blendAlpha) * srcColor);
      blendAlpha = blendAlpha + (1. - blendAlpha) * srcAlpha;

      // Optimized: skip additive accumulation when bloom=0
      if (useBloom) {
        addColor += srcColor;
        addAlpha += srcAlpha;
      }
    }
  }

  // Optimized: skip mix when bloom=0
  vec3 accumColor = useBloom ? mix(blendColor, addColor, bloom) : blendColor;
  float accumAlpha = useBloom ? clamp(mix(blendAlpha, addAlpha, bloom), 0., 1.) : clamp(blendAlpha, 0., 1.);

  // Optimized: simplified background blending for transparent backgrounds
  vec3 bgColor = u_colorBack.rgb * u_colorBack.a;
  vec3 color = accumColor + (1. - accumAlpha) * bgColor;
  float opacity = accumAlpha + (1. - accumAlpha) * u_colorBack.a;

  ${zg}

  fragColor = vec4(color, opacity);
}`,
    Qg = { auto: 0, square: 1 },
    Zg = {
        fit: "contain",
        scale: 1,
        rotation: 0,
        offsetX: 0,
        offsetY: 0,
        originX: 0.5,
        originY: 0.5,
        worldWidth: 0,
        worldHeight: 0,
    },
    jg = { none: 0, contain: 1, cover: 2 };
function Fg() {
    if (typeof window > "u") return;
    const a = new Image();
    return (a.src = Yg), a;
}
const Yg = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",
    Ig = `#version 300 es
precision mediump float;

layout(location = 0) in vec4 a_position;

uniform vec2 u_resolution;
uniform float u_pixelRatio;
uniform float u_imageAspectRatio;
uniform float u_originX;
uniform float u_originY;
uniform float u_worldWidth;
uniform float u_worldHeight;
uniform float u_fit;
uniform float u_scale;
uniform float u_rotation;
uniform float u_offsetX;
uniform float u_offsetY;

out vec2 v_objectUV;
out vec2 v_objectBoxSize;
out vec2 v_responsiveUV;
out vec2 v_responsiveBoxGivenSize;
out vec2 v_patternUV;
out vec2 v_patternBoxSize;
out vec2 v_imageUV;

vec3 getBoxSize(float boxRatio, vec2 givenBoxSize) {
  vec2 box = vec2(0.);
  // fit = none
  box.x = boxRatio * min(givenBoxSize.x / boxRatio, givenBoxSize.y);
  float noFitBoxWidth = box.x;
  if (u_fit == 1.) { // fit = contain
    box.x = boxRatio * min(u_resolution.x / boxRatio, u_resolution.y);
  } else if (u_fit == 2.) { // fit = cover
    box.x = boxRatio * max(u_resolution.x / boxRatio, u_resolution.y);
  }
  box.y = box.x / boxRatio;
  return vec3(box, noFitBoxWidth);
}

void main() {
  gl_Position = a_position;

  vec2 uv = gl_Position.xy * .5;
  vec2 boxOrigin = vec2(.5 - u_originX, u_originY - .5);
  vec2 givenBoxSize = vec2(u_worldWidth, u_worldHeight);
  givenBoxSize = max(givenBoxSize, vec2(1.)) * u_pixelRatio;
  float r = u_rotation * 3.14159265358979323846 / 180.;
  mat2 graphicRotation = mat2(cos(r), sin(r), -sin(r), cos(r));
  vec2 graphicOffset = vec2(-u_offsetX, u_offsetY);


  // ===================================================

  float fixedRatio = 1.;
  vec2 fixedRatioBoxGivenSize = vec2(
  (u_worldWidth == 0.) ? u_resolution.x : givenBoxSize.x,
  (u_worldHeight == 0.) ? u_resolution.y : givenBoxSize.y
  );

  v_objectBoxSize = getBoxSize(fixedRatio, fixedRatioBoxGivenSize).xy;
  vec2 objectWorldScale = u_resolution.xy / v_objectBoxSize;

  v_objectUV = uv;
  v_objectUV *= objectWorldScale;
  v_objectUV += boxOrigin * (objectWorldScale - 1.);
  v_objectUV += graphicOffset;
  v_objectUV /= u_scale;
  v_objectUV = graphicRotation * v_objectUV;

  // ===================================================

  v_responsiveBoxGivenSize = vec2(
  (u_worldWidth == 0.) ? u_resolution.x : givenBoxSize.x,
  (u_worldHeight == 0.) ? u_resolution.y : givenBoxSize.y
  );
  float responsiveRatio = v_responsiveBoxGivenSize.x / v_responsiveBoxGivenSize.y;
  vec2 responsiveBoxSize = getBoxSize(responsiveRatio, v_responsiveBoxGivenSize).xy;
  vec2 responsiveBoxScale = u_resolution.xy / responsiveBoxSize;

  #ifdef ADD_HELPERS
  v_responsiveHelperBox = uv;
  v_responsiveHelperBox *= responsiveBoxScale;
  v_responsiveHelperBox += boxOrigin * (responsiveBoxScale - 1.);
  #endif

  v_responsiveUV = uv;
  v_responsiveUV *= responsiveBoxScale;
  v_responsiveUV += boxOrigin * (responsiveBoxScale - 1.);
  v_responsiveUV += graphicOffset;
  v_responsiveUV /= u_scale;
  v_responsiveUV.x *= responsiveRatio;
  v_responsiveUV = graphicRotation * v_responsiveUV;
  v_responsiveUV.x /= responsiveRatio;

  // ===================================================

  float patternBoxRatio = givenBoxSize.x / givenBoxSize.y;
  vec2 patternBoxGivenSize = vec2(
  (u_worldWidth == 0.) ? u_resolution.x : givenBoxSize.x,
  (u_worldHeight == 0.) ? u_resolution.y : givenBoxSize.y
  );
  patternBoxRatio = patternBoxGivenSize.x / patternBoxGivenSize.y;

  vec3 boxSizeData = getBoxSize(patternBoxRatio, patternBoxGivenSize);
  v_patternBoxSize = boxSizeData.xy;
  float patternBoxNoFitBoxWidth = boxSizeData.z;
  vec2 patternBoxScale = u_resolution.xy / v_patternBoxSize;

  v_patternUV = uv;
  v_patternUV += graphicOffset / patternBoxScale;
  v_patternUV += boxOrigin;
  v_patternUV -= boxOrigin / patternBoxScale;
  v_patternUV *= u_resolution.xy;
  v_patternUV /= u_pixelRatio;
  if (u_fit > 0.) {
    v_patternUV *= (patternBoxNoFitBoxWidth / v_patternBoxSize.x);
  }
  v_patternUV /= u_scale;
  v_patternUV = graphicRotation * v_patternUV;
  v_patternUV += boxOrigin / patternBoxScale;
  v_patternUV -= boxOrigin;
  // x100 is a default multiplier between vertex and fragmant shaders
  // we use it to avoid UV presision issues
  v_patternUV *= .01;

  // ===================================================

  vec2 imageBoxSize;
  if (u_fit == 1.) { // contain
    imageBoxSize.x = min(u_resolution.x / u_imageAspectRatio, u_resolution.y) * u_imageAspectRatio;
  } else if (u_fit == 2.) { // cover
    imageBoxSize.x = max(u_resolution.x / u_imageAspectRatio, u_resolution.y) * u_imageAspectRatio;
  } else {
    imageBoxSize.x = min(10.0, 10.0 / u_imageAspectRatio * u_imageAspectRatio);
  }
  imageBoxSize.y = imageBoxSize.x / u_imageAspectRatio;
  vec2 imageBoxScale = u_resolution.xy / imageBoxSize;

  v_imageUV = uv;
  v_imageUV *= imageBoxScale;
  v_imageUV += boxOrigin * (imageBoxScale - 1.);
  v_imageUV += graphicOffset;
  v_imageUV /= u_scale;
  v_imageUV.x *= u_imageAspectRatio;
  v_imageUV = graphicRotation * v_imageUV;
  v_imageUV.x /= u_imageAspectRatio;

  v_imageUV += .5;
  v_imageUV.y = 1. - v_imageUV.y;
}`,
    B3 = 1920 * 1080 * 4,
    $r = 25;
class Pg {
    parentElement;
    canvasElement;
    gl;
    program = null;
    uniformLocations = {};
    fragmentShader;
    rafId = null;
    intervalId = null;
    lastRenderTime = 0;
    frameInterval = 1e3 / $r;
    currentFrame = 0;
    speed = 0;
    currentSpeed = 0;
    providedUniforms;
    mipmaps = [];
    hasBeenDisposed = !1;
    resolutionChanged = !0;
    textures = new Map();
    minPixelRatio;
    maxPixelCount;
    isSafari = qg();
    uniformCache = {};
    textureUnitMap = new Map();
    constructor(i, o, r, c, f = 0, h = 0, m = 2, g = B3, v = [], p = $r) {
        if (i instanceof HTMLElement) this.parentElement = i;
        else throw new Error("Paper Shaders: parent element must be an HTMLElement");
        if (!document.querySelector("style[data-paper-shader]")) {
            const x = document.createElement("style");
            (x.innerHTML = Xg), x.setAttribute("data-paper-shader", ""), document.head.prepend(x);
        }
        const A = document.createElement("canvas");
        (this.canvasElement = A),
            this.parentElement.prepend(A),
            (this.fragmentShader = o),
            (this.providedUniforms = r),
            (this.mipmaps = v),
            (this.currentFrame = h),
            (this.minPixelRatio = m),
            (this.maxPixelCount = g),
            (this.frameInterval = p > 0 ? 1e3 / p : 0);
        const E = A.getContext("webgl2", c);
        if (!E) throw new Error("Paper Shaders: WebGL is not supported in this browser");
        (this.gl = E),
            this.initProgram(),
            this.setupPositionAttribute(),
            this.setupUniforms(),
            this.setUniformValues(this.providedUniforms),
            this.setupResizeObserver(),
            visualViewport?.addEventListener("resize", this.handleVisualViewportChange),
            this.setSpeed(f),
            this.parentElement.setAttribute("data-paper-shader", ""),
            (this.parentElement.paperShaderMount = this),
            document.addEventListener("visibilitychange", this.handleDocumentVisibilityChange);
    }
    initProgram = () => {
        const i = kg(this.gl, Ig, this.fragmentShader);
        i && (this.program = i);
    };
    setupPositionAttribute = () => {
        const i = this.gl.getAttribLocation(this.program, "a_position"),
            o = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, o);
        const r = [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1];
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(r), this.gl.STATIC_DRAW),
            this.gl.enableVertexAttribArray(i),
            this.gl.vertexAttribPointer(i, 2, this.gl.FLOAT, !1, 0, 0);
    };
    setupUniforms = () => {
        const i = {
            u_time: this.gl.getUniformLocation(this.program, "u_time"),
            u_pixelRatio: this.gl.getUniformLocation(this.program, "u_pixelRatio"),
            u_resolution: this.gl.getUniformLocation(this.program, "u_resolution"),
        };
        Object.entries(this.providedUniforms).forEach(([o, r]) => {
            if (((i[o] = this.gl.getUniformLocation(this.program, o)), r instanceof HTMLImageElement)) {
                const c = `${o}AspectRatio`;
                i[c] = this.gl.getUniformLocation(this.program, c);
            }
        }),
            (this.uniformLocations = i);
    };
    renderScale = 1;
    parentWidth = 0;
    parentHeight = 0;
    parentDevicePixelWidth = 0;
    parentDevicePixelHeight = 0;
    devicePixelsSupported = !1;
    resizeObserver = null;
    setupResizeObserver = () => {
        (this.resizeObserver = new ResizeObserver(([i]) => {
            if (i?.borderBoxSize[0]) {
                const o = i.devicePixelContentBoxSize?.[0];
                o !== void 0 &&
                    ((this.devicePixelsSupported = !0),
                    (this.parentDevicePixelWidth = o.inlineSize),
                    (this.parentDevicePixelHeight = o.blockSize)),
                    (this.parentWidth = i.borderBoxSize[0].inlineSize),
                    (this.parentHeight = i.borderBoxSize[0].blockSize);
            }
            this.handleResize();
        })),
            this.resizeObserver.observe(this.parentElement);
    };
    handleVisualViewportChange = () => {
        this.resizeObserver?.disconnect(), this.setupResizeObserver();
    };
    handleResize = () => {
        let i = 0,
            o = 0;
        const r = Math.max(1, window.devicePixelRatio),
            c = visualViewport?.scale ?? 1;
        if (this.devicePixelsSupported) {
            const p = Math.max(1, this.minPixelRatio / r);
            (i = this.parentDevicePixelWidth * p * c), (o = this.parentDevicePixelHeight * p * c);
        } else {
            let p = Math.max(r, this.minPixelRatio) * c;
            if (this.isSafari) {
                const A = Kg();
                p *= Math.max(1, A);
            }
            (i = Math.round(this.parentWidth) * p), (o = Math.round(this.parentHeight) * p);
        }
        const f = Math.sqrt(this.maxPixelCount) / Math.sqrt(i * o),
            h = Math.min(1, f),
            m = Math.round(i * h),
            g = Math.round(o * h),
            v = m / Math.round(this.parentWidth);
        (this.canvasElement.width !== m || this.canvasElement.height !== g || this.renderScale !== v) &&
            ((this.renderScale = v),
            (this.canvasElement.width = m),
            (this.canvasElement.height = g),
            (this.resolutionChanged = !0),
            this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height),
            this.render(performance.now()));
    };
    render = (i) => {
        if (this.hasBeenDisposed || this.program === null) return;
        const o = i - this.lastRenderTime;
        (this.lastRenderTime = i),
            this.currentSpeed !== 0 && (this.currentFrame += o * this.currentSpeed),
            this.gl.clear(this.gl.COLOR_BUFFER_BIT),
            this.gl.useProgram(this.program),
            this.gl.uniform1f(this.uniformLocations.u_time, this.currentFrame * 0.001),
            this.resolutionChanged &&
                (this.gl.uniform2f(this.uniformLocations.u_resolution, this.gl.canvas.width, this.gl.canvas.height),
                this.gl.uniform1f(this.uniformLocations.u_pixelRatio, this.renderScale),
                (this.resolutionChanged = !1)),
            this.gl.drawArrays(this.gl.TRIANGLES, 0, 6),
            this.currentSpeed !== 0 && this.frameInterval === 0 && (this.rafId = requestAnimationFrame(this.render));
    };
    startAnimationLoop = () => {
        if ((this.stopAnimationLoop(), this.frameInterval === 0))
            (this.lastRenderTime = performance.now()), (this.rafId = requestAnimationFrame(this.render));
        else {
            this.lastRenderTime = performance.now();
            const i = () => {
                this.hasBeenDisposed || (this.rafId = requestAnimationFrame(this.render));
            };
            i(), (this.intervalId = setInterval(i, this.frameInterval));
        }
    };
    stopAnimationLoop = () => {
        this.rafId !== null && (cancelAnimationFrame(this.rafId), (this.rafId = null)),
            this.intervalId !== null && (clearInterval(this.intervalId), (this.intervalId = null));
    };
    setTextureUniform = (i, o) => {
        if (!o.complete || o.naturalWidth === 0)
            throw new Error(`Paper Shaders: image for uniform ${i} must be fully loaded`);
        const r = this.textures.get(i);
        r && this.gl.deleteTexture(r),
            this.textureUnitMap.has(i) || this.textureUnitMap.set(i, this.textureUnitMap.size);
        const c = this.textureUnitMap.get(i);
        this.gl.activeTexture(this.gl.TEXTURE0 + c);
        const f = this.gl.createTexture();
        if (
            (this.gl.bindTexture(this.gl.TEXTURE_2D, f),
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE),
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE),
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR),
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR),
            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, o),
            this.mipmaps.includes(i) &&
                (this.gl.generateMipmap(this.gl.TEXTURE_2D),
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_LINEAR)),
            this.gl.getError() !== this.gl.NO_ERROR || f === null)
        )
            return;
        this.textures.set(i, f);
        const m = this.uniformLocations[i];
        if (m) {
            this.gl.uniform1i(m, c);
            const g = `${i}AspectRatio`,
                v = this.uniformLocations[g];
            if (v) {
                const p = o.naturalWidth / o.naturalHeight;
                this.gl.uniform1f(v, p);
            }
        }
    };
    areUniformValuesEqual = (i, o) =>
        i === o
            ? !0
            : Array.isArray(i) && Array.isArray(o) && i.length === o.length
              ? i.every((r, c) => this.areUniformValuesEqual(r, o[c]))
              : !1;
    setUniformValues = (i) => {
        this.gl.useProgram(this.program),
            Object.entries(i).forEach(([o, r]) => {
                let c = r;
                if (
                    (r instanceof HTMLImageElement &&
                        (c = `${r.src.slice(0, 200)}|${r.naturalWidth}x${r.naturalHeight}`),
                    this.areUniformValuesEqual(this.uniformCache[o], c))
                )
                    return;
                this.uniformCache[o] = c;
                const f = this.uniformLocations[o];
                if (f)
                    if (r instanceof HTMLImageElement) this.setTextureUniform(o, r);
                    else if (Array.isArray(r)) {
                        let h = null,
                            m = null;
                        if (r[0] !== void 0 && Array.isArray(r[0])) {
                            const g = r[0].length;
                            if (r.every((v) => v.length === g)) (h = r.flat()), (m = g);
                            else return;
                        } else (h = r), (m = h.length);
                        switch (m) {
                            case 2:
                                this.gl.uniform2fv(f, h);
                                break;
                            case 3:
                                this.gl.uniform3fv(f, h);
                                break;
                            case 4:
                                this.gl.uniform4fv(f, h);
                                break;
                            case 9:
                                this.gl.uniformMatrix3fv(f, !1, h);
                                break;
                            case 16:
                                this.gl.uniformMatrix4fv(f, !1, h);
                                break;
                        }
                    } else
                        typeof r == "number"
                            ? this.gl.uniform1f(f, r)
                            : typeof r == "boolean" && this.gl.uniform1i(f, r ? 1 : 0);
            });
    };
    getCurrentFrame = () => this.currentFrame;
    setFrame = (i) => {
        (this.currentFrame = i), (this.lastRenderTime = performance.now()), this.render(performance.now());
    };
    setSpeed = (i = 1) => {
        (this.speed = i), this.setCurrentSpeed(document.hidden ? 0 : i);
    };
    setCurrentSpeed = (i) => {
        const o = this.currentSpeed !== 0,
            r = i !== 0;
        (this.currentSpeed = i), !o && r && this.startAnimationLoop(), o && !r && this.stopAnimationLoop();
    };
    setMaxPixelCount = (i = B3) => {
        (this.maxPixelCount = i), this.handleResize();
    };
    setMinPixelRatio = (i = 2) => {
        (this.minPixelRatio = i), this.handleResize();
    };
    setFps = (i = $r) => {
        const o = this.currentSpeed !== 0;
        (this.frameInterval = i > 0 ? 1e3 / i : 0), o && this.startAnimationLoop();
    };
    setUniforms = (i) => {
        this.setUniformValues(i),
            (this.providedUniforms = { ...this.providedUniforms, ...i }),
            this.render(performance.now());
    };
    handleDocumentVisibilityChange = () => {
        this.setCurrentSpeed(document.hidden ? 0 : this.speed);
    };
    dispose = () => {
        (this.hasBeenDisposed = !0),
            this.stopAnimationLoop(),
            this.gl &&
                this.program &&
                (this.textures.forEach((i) => {
                    this.gl.deleteTexture(i);
                }),
                this.textures.clear(),
                this.gl.deleteProgram(this.program),
                (this.program = null),
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null),
                this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null),
                this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, null),
                this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null),
                this.gl.getError()),
            this.resizeObserver && (this.resizeObserver.disconnect(), (this.resizeObserver = null)),
            visualViewport?.removeEventListener("resize", this.handleVisualViewportChange),
            document.removeEventListener("visibilitychange", this.handleDocumentVisibilityChange),
            (this.uniformLocations = {}),
            this.canvasElement.remove(),
            delete this.parentElement.paperShaderMount;
    };
}
function D3(a, i, o) {
    const r = a.createShader(i);
    return r
        ? (a.shaderSource(r, o),
          a.compileShader(r),
          a.getShaderParameter(r, a.COMPILE_STATUS) ? r : (a.deleteShader(r), null))
        : null;
}
function kg(a, i, o) {
    const r = a.getShaderPrecisionFormat(a.FRAGMENT_SHADER, a.MEDIUM_FLOAT),
        c = r ? r.precision : null;
    c &&
        c < 23 &&
        ((i = i.replace(/precision\s+(lowp|mediump)\s+float;/g, "precision highp float;")),
        (o = o
            .replace(/precision\s+(lowp|mediump)\s+float/g, "precision highp float")
            .replace(/\b(uniform|varying|attribute)\s+(lowp|mediump)\s+(\w+)/g, "$1 highp $3")));
    const f = D3(a, a.VERTEX_SHADER, i),
        h = D3(a, a.FRAGMENT_SHADER, o);
    if (!f || !h) return null;
    const m = a.createProgram();
    return m
        ? (a.attachShader(m, f),
          a.attachShader(m, h),
          a.linkProgram(m),
          a.getProgramParameter(m, a.LINK_STATUS)
              ? (a.detachShader(m, f), a.detachShader(m, h), a.deleteShader(f), a.deleteShader(h), m)
              : (a.deleteProgram(m), a.deleteShader(f), a.deleteShader(h), null))
        : null;
}
const Xg = `@layer paper-shaders {
  :where([data-paper-shader]) {
    isolation: isolate;
    position: relative;

    & canvas {
      contain: strict;
      display: block;
      position: absolute;
      inset: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      border-radius: inherit;
      corner-shape: inherit;
    }
  }
}`;
function qg() {
    const a = navigator.userAgent.toLowerCase();
    return a.includes("safari") && !a.includes("chrome") && !a.includes("android");
}
function Kg() {
    const a = visualViewport?.scale ?? 1,
        i = visualViewport?.width ?? window.innerWidth,
        o = window.innerWidth - document.documentElement.clientWidth,
        r = a * i + o,
        c = outerWidth / r,
        f = Math.round(100 * c);
    return f % 5 === 0 ? f / 100 : f === 33 ? 1 / 3 : f === 67 ? 2 / 3 : f === 133 ? 4 / 3 : c;
}
function Wg(a) {
    const i = C.useRef(void 0),
        o = C.useCallback((r) => {
            const c = a.map((f) => {
                if (f != null) {
                    if (typeof f == "function") {
                        const h = f,
                            m = h(r);
                        return typeof m == "function"
                            ? m
                            : () => {
                                  h(null);
                              };
                    }
                    return (
                        (f.current = r),
                        () => {
                            f.current = null;
                        }
                    );
                }
            });
            return () => {
                c.forEach((f) => f?.());
            };
        }, a);
    return C.useMemo(
        () =>
            a.every((r) => r == null)
                ? null
                : (r) => {
                      i.current && (i.current(), (i.current = void 0)), r != null && (i.current = o(r));
                  },
        a
    );
}
async function _3(a) {
    const i = {},
        o = [],
        r = (f) => {
            try {
                return f.startsWith("/") || new URL(f), !0;
            } catch {
                return !1;
            }
        },
        c = (f) => {
            try {
                return f.startsWith("/") ? !1 : new URL(f, window.location.origin).origin !== window.location.origin;
            } catch {
                return !1;
            }
        };
    return (
        Object.entries(a).forEach(([f, h]) => {
            if (typeof h == "string") {
                if (!h) {
                    i[f] = Fg();
                    return;
                }
                if (!r(h)) return;
                const m = new Promise((g, v) => {
                    const p = new Image();
                    c(h) && (p.crossOrigin = "anonymous"),
                        (p.onload = () => {
                            (i[f] = p), g();
                        }),
                        (p.onerror = () => {
                            v();
                        }),
                        (p.src = h);
                });
                o.push(m);
            } else i[f] = h;
        }),
        await Promise.all(o),
        i
    );
}
const u4 = C.forwardRef(function (
    {
        fragmentShader: i,
        uniforms: o,
        webGlContextAttributes: r,
        speed: c = 0,
        frame: f = 0,
        fps: h = $r,
        width: m,
        height: g,
        minPixelRatio: v,
        maxPixelCount: p,
        mipmaps: A,
        style: E,
        ...x
    },
    H
) {
    const [D, _] = C.useState(!1),
        V = C.useRef(null),
        U = C.useRef(null),
        Q = C.useRef(r);
    C.useEffect(
        () => (
            (async () => {
                const k = await _3(o);
                V.current && !U.current && ((U.current = new Pg(V.current, i, k, Q.current, c, f, v, p, A, h)), _(!0));
            })(),
            () => {
                U.current?.dispose(), (U.current = null);
            }
        ),
        [i, h, f, p, v, A, c, o]
    ),
        C.useEffect(() => {
            let R = !1;
            return (
                (async () => {
                    const X = await _3(o);
                    R || U.current?.setUniforms(X);
                })(),
                () => {
                    R = !0;
                }
            );
        }, [o, D]),
        C.useEffect(() => {
            U.current?.setSpeed(c);
        }, [c, D]),
        C.useEffect(() => {
            U.current?.setMaxPixelCount(p);
        }, [p, D]),
        C.useEffect(() => {
            U.current?.setMinPixelRatio(v);
        }, [v, D]),
        C.useEffect(() => {
            U.current?.setFps(h);
        }, [h, D]),
        C.useEffect(() => {
            U.current?.setFrame(f);
        }, [f, D]);
    const Y = Wg([V, H]);
    return z.jsx("div", {
        ref: Y,
        style:
            m !== void 0 || g !== void 0
                ? {
                      width: typeof m == "string" && isNaN(+m) === !1 ? +m : m,
                      height: typeof g == "string" && isNaN(+g) === !1 ? +g : g,
                      ...E,
                  }
                : E,
        ...x,
    });
});
u4.displayName = "ShaderMount";
const Ot = {
        params: {
            ...Zg,
            speed: 1,
            frame: 0,
            scale: 0.6,
            colorBack: "#000000",
            colors: ["#0dc1fd", "#d915ef", "#ff3f2ecc"],
            roundness: 0.25,
            thickness: 0.1,
            marginLeft: 0,
            marginRight: 0,
            marginTop: 0,
            marginBottom: 0,
            aspectRatio: "auto",
            softness: 0.75,
            intensity: 0.2,
            bloom: 0.25,
            spots: 5,
            spotSize: 0.6,
            pulse: 0.25,
            smoke: 0.3,
            smokeSize: 0.6,
        },
    },
    Jg = C.memo(function ({
        speed: i = Ot.params.speed,
        frame: o = Ot.params.frame,
        fps: r,
        colors: c = Ot.params.colors,
        colorBack: f = Ot.params.colorBack,
        roundness: h = Ot.params.roundness,
        thickness: m = Ot.params.thickness,
        aspectRatio: g = Ot.params.aspectRatio,
        softness: v = Ot.params.softness,
        bloom: p = Ot.params.bloom,
        intensity: A = Ot.params.intensity,
        spots: E = Ot.params.spots,
        spotSize: x = Ot.params.spotSize,
        pulse: H = Ot.params.pulse,
        smoke: D = Ot.params.smoke,
        smokeSize: _ = Ot.params.smokeSize,
        margin: V,
        marginLeft: U = V ?? Ot.params.marginLeft,
        marginRight: Q = V ?? Ot.params.marginRight,
        marginTop: Y = V ?? Ot.params.marginTop,
        marginBottom: R = V ?? Ot.params.marginBottom,
        fit: k = Ot.params.fit,
        rotation: X = Ot.params.rotation,
        scale: st = Ot.params.scale,
        originX: P = Ot.params.originX,
        originY: K = Ot.params.originY,
        offsetX: gt = Ot.params.offsetX,
        offsetY: Mt = Ot.params.offsetY,
        worldWidth: Et = Ot.params.worldWidth,
        worldHeight: At = Ot.params.worldHeight,
        ...Tt
    }) {
        const F = {
            u_colorBack: H3(f),
            u_colors: c.map(H3),
            u_colorsCount: c.length,
            u_roundness: h,
            u_thickness: m,
            u_marginLeft: U,
            u_marginRight: Q,
            u_marginTop: Y,
            u_marginBottom: R,
            u_aspectRatio: Qg[g],
            u_softness: v,
            u_intensity: A,
            u_bloom: p,
            u_spots: E,
            u_spotSize: x,
            u_pulse: H,
            u_smoke: D,
            u_smokeSize: _,
            u_noiseTexture: Ng(),
            u_fit: jg[k],
            u_rotation: X,
            u_scale: st,
            u_offsetX: gt,
            u_offsetY: Mt,
            u_originX: P,
            u_originY: K,
            u_worldWidth: Et,
            u_worldHeight: At,
        };
        return z.jsx(u4, { ...Tt, speed: i, frame: o, fps: r, fragmentShader: Gg, uniforms: F });
    }, Og),
    $g = ["#69F3FF4D", "#00DFFF4D", "#00B7FB4D"],
    N3 = 200,
    o4 = Ca.memo(({ isPaused: a, fps: i }) => {
        const [o, r] = C.useState(!0),
            c = !a && o;
        return (
            C.useEffect(() => {
                const f = () => {
                    r(!document.hidden);
                };
                return (
                    document.addEventListener("visibilitychange", f),
                    () => {
                        document.removeEventListener("visibilitychange", f);
                    }
                );
            }, []),
            z.jsx("div", {
                className: `pointer-events-none fixed left-0 top-0 isolate z-0 h-screen w-screen transition-opacity duration-300 ease-in-out ${c ? "opacity-100" : "opacity-0"}`,
                children: z.jsx("div", {
                    className: "absolute left-0 top-0 size-full origin-top-left",
                    children: z.jsx(Jg, {
                        fps: i,
                        colors: $g,
                        colorBack: "#00000000",
                        speed: c ? 1.75 : 0,
                        roundness: 1,
                        thickness: 0.48,
                        softness: 0.89,
                        intensity: 1,
                        bloom: 0,
                        spots: 5,
                        spotSize: 0.43,
                        pulse: 0.25,
                        smoke: 0.14,
                        smokeSize: 1,
                        scale: 1.23,
                        rotation: 0,
                        marginLeft: 0.02,
                        marginRight: 0.02,
                        marginTop: 0.02,
                        marginBottom: 0.02,
                        aspectRatio: "auto",
                        minPixelRatio: 1,
                        maxPixelCount: N3 * N3,
                        className:
                            "absolute left-0 top-0 size-full rotate-0 bg-transparent opacity-100 [translate:0.0001px_0px]",
                    }),
                }),
            })
        );
    });
o4.displayName = "ShaderEffects";
const tp = 25,
    ep = 0;
function np(a = {}) {
    const { fps: i = tp, isPaused: o = !1 } = a,
        [r, c] = C.useState({ shimmerPhase: 0, gradientPhase: 0 }),
        f = C.useRef(null),
        h = C.useRef(null),
        m = C.useRef(null);
    return (
        C.useEffect(() => {
            if (o) {
                f.current !== null && (cancelAnimationFrame(f.current), (f.current = null)),
                    h.current !== null && (clearInterval(h.current), (h.current = null));
                return;
            }
            const g = i === ep,
                v = (p) => {
                    m.current === null && (m.current = p);
                    const A = p - m.current,
                        E = 5400,
                        x = ((A % E) / E) * 100,
                        D = A % 8e3,
                        _ = D < 4e3 ? (D / 4e3) * 100 : ((8e3 - D) / 4e3) * 100;
                    c({ shimmerPhase: x, gradientPhase: _ });
                };
            if (g) {
                const p = (A) => {
                    v(A), (f.current = requestAnimationFrame(p));
                };
                f.current = requestAnimationFrame(p);
            } else {
                const p = 1e3 / i,
                    A = () => {
                        f.current = requestAnimationFrame(v);
                    };
                A(), (h.current = setInterval(A, p));
            }
            return () => {
                f.current !== null && (cancelAnimationFrame(f.current), (f.current = null)),
                    h.current !== null && (clearInterval(h.current), (h.current = null));
            };
        }, [i, o]),
        r
    );
}
const ap = "npclhjbddhklpbnacpjloidibaggcgon";
function Xs(a) {
    return chrome.runtime.sendMessage(ap, a);
}
const L3 = 25;
function lp({ tabId: a, isPausedParam: i = !1, taskId: o, simpleMode: r = !1 }) {
    const { $t: c } = vc(),
        [f, h] = C.useState(i),
        [m, g] = C.useState("working"),
        v = C.useRef(null),
        p = M3[m] ?? M3.working,
        A = async () => {
            const _ = await Xs({ type: "BROWSER_TASK_PAUSE_RESUME", payload: { tabId: a, sidecarTabId: -1 } });
            _?.success && h(_.response?.is_paused ?? !1);
        },
        E = async () => {
            await Xs({ type: "OVERLAY_TASK_STOP", payload: { tabId: a, taskId: o } });
        };
    C.useLayoutEffect(() => {
        const _ = v.current;
        if (!_) return;
        const V = () => {
            const R = _.getBoundingClientRect();
            Xs({
                type: "BUTTON_RECT_CHANGE",
                payload: {
                    tabId: a,
                    rect: {
                        position: { x: Math.round(R.left), y: Math.round(R.top) },
                        size: { width: Math.round(R.width), height: Math.round(R.height) },
                    },
                },
            });
        };
        let U = 0;
        const Q = () => {
            const R = performance.now();
            R - U >= 250 && (V(), (U = R));
        };
        setTimeout(V, 100);
        const Y = new ResizeObserver(() => {
            Q();
        });
        return (
            Y.observe(_),
            () => {
                Y.disconnect();
            }
        );
    }, [a]),
        C.useLayoutEffect(
            () => (
                r4(),
                () => {
                    wg();
                }
            ),
            []
        ),
        C.useLayoutEffect(() => {
            const _ = (U) =>
                    typeof U == "object" &&
                    U !== null &&
                    "type" in U &&
                    typeof U.type == "string" &&
                    ["OVERLAY_TASK_STATUS_UPDATE", "OVERLAY_CLICK_FEEDBACK"].includes(U.type),
                V = (U) => {
                    if (_(U) && U.payload.tabId === a)
                        switch (U.type) {
                            case "OVERLAY_TASK_STATUS_UPDATE":
                                g(U.payload.status);
                                break;
                            case "OVERLAY_CLICK_FEEDBACK":
                                document.hidden || Rg(U.payload.x, U.payload.y);
                                break;
                        }
                };
            return (
                chrome.runtime.onMessage.addListener(V),
                () => {
                    chrome.runtime.onMessage.removeListener(V);
                }
            );
        }, [a]);
    const x = C.useMemo(
            () => ({
                backgroundSize: "200% 200%",
                backgroundImage: f
                    ? "linear-gradient(135deg, rgba(255, 197, 126, 0.8) 0%, transparent 50%, rgba(255, 197, 126, 0.4) 100%)"
                    : "linear-gradient(135deg, rgba(110, 231, 244, 0.8) 0%, transparent 50%, rgba(110, 231, 244, 0.4) 100%)",
            }),
            [f]
        ),
        { shimmerPhase: H, gradientPhase: D } = np({ fps: L3, isPaused: f });
    return z.jsxs(z.Fragment, {
        children: [
            z.jsx(o4, { isPaused: f, fps: L3 }),
            z.jsxs("div", {
                ref: v,
                className: `border-dynamic fixed bottom-7 left-1/2 z-50 flex min-w-10 -translate-x-1/2 flex-col items-center overflow-hidden rounded-xl border-[0.5px] px-2 py-1 shadow-2xl backdrop-blur-sm transition-colors duration-300 ${f ? "bg-[#3b0f00]" : "bg-[#13343b]"}`,
                children: [
                    z.jsx("div", {
                        className: "pointer-events-none absolute inset-0 z-0 rounded-xl",
                        children: z.jsx("div", {
                            className: `absolute inset-0 rounded-xl opacity-40 gradient-animation ${f ? "gradient-animation-paused" : ""}`,
                            style: { ...x, "--gradient-phase": D },
                        }),
                    }),
                    z.jsxs("div", {
                        className: "relative z-10 flex items-center gap-1",
                        children: [
                            !f &&
                                z.jsxs("div", {
                                    className: "flex shrink-0 items-center gap-1",
                                    children: [
                                        z.jsxs("div", {
                                            className: "flex min-w-52 shrink-0 items-center gap-1 rounded-md px-1.5",
                                            children: [
                                                p?.icon &&
                                                    z.jsx(Hc, {
                                                        icon: p?.icon,
                                                        size: "sm",
                                                        className: "text-[#8BF1FC]",
                                                    }),
                                                z.jsxs("span", {
                                                    className:
                                                        "shimmer-gradient cursor-default select-none whitespace-nowrap text-[13px] font-medium leading-[18px]",
                                                    style: { "--shimmer-phase": H },
                                                    children: [c(p.message), "..."],
                                                }),
                                            ],
                                        }),
                                        z.jsx("div", { className: "h-5 w-px shrink-0 bg-white/20 opacity-30" }),
                                    ],
                                }),
                            !r &&
                                z.jsxs(z.Fragment, {
                                    children: [
                                        z.jsx("div", {
                                            className: f
                                                ? "[&_button:hover]:!text-[#ffc57e] [&_button]:!text-[#ffc57e]"
                                                : "[&_button:hover]:!text-[#8bf1fc] [&_button]:!text-[#8bf1fc]",
                                            children: z.jsx(dg, {
                                                leadingIcon: f ? "player-play" : "player-pause",
                                                variant: "text",
                                                size: "small",
                                                onClick: A,
                                                children: c(
                                                    f
                                                        ? { defaultMessage: "Resume", id: "3y9DGgura7" }
                                                        : { defaultMessage: "Take control", id: "snStu0guTX" }
                                                ),
                                            }),
                                        }),
                                        z.jsx("div", { className: "mr-1 h-5 w-px shrink-0 bg-white/20 opacity-30" }),
                                    ],
                                }),
                            z.jsxs("button", {
                                className: `relative flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-lg transition-colors ${f ? "bg-[#3b0f00] hover:bg-[#4d1400]" : "bg-[#115058] hover:bg-[#21808d]"}`,
                                onClick: E,
                                "aria-label": "Stop",
                                children: [
                                    z.jsx("div", {
                                        className: "pointer-events-none absolute inset-0 rounded-lg",
                                        children: z.jsx("div", {
                                            className: "absolute inset-0 rounded-lg opacity-60 mix-blend-screen",
                                            style: {
                                                backgroundImage: f
                                                    ? "linear-gradient(135deg, rgba(255, 197, 126, 0.8) 0%, transparent 50%, rgba(255, 197, 126, 0.4) 100%)"
                                                    : "linear-gradient(135deg, rgba(110, 231, 244, 0.8) 0%, transparent 50%, rgba(110, 231, 244, 0.4) 100%)",
                                            },
                                        }),
                                    }),
                                    z.jsx("div", {
                                        className: `relative z-10 size-2.5 rounded-sm ${f ? "bg-[#ffc57e]" : "bg-[#6EE7F4]"}`,
                                    }),
                                ],
                            }),
                        ],
                    }),
                ],
            }),
        ],
    });
}
const ip = `<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
<symbol id="pplx-icon-access-point" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 12l0 .01 M14.828 9.172a4 4 0 0 1 0 5.656 M17.657 6.343a8 8 0 0 1 0 11.314 M9.168 14.828a4 4 0 0 1 0 -5.656 M6.337 17.657a8 8 0 0 1 0 -11.314"></path></symbol>
<symbol id="pplx-icon-browser-plus" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h16 M12 20h-6a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v6 M8 4v4 M16 19h6 M19 16v6"></path></symbol>
<symbol id="pplx-icon-bubble-text" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M7 10h10 M9 14h5 M12.4 3a5.34 5.34 0 0 1 4.906 3.239a5.333 5.333 0 0 1 -1.195 10.6a4.26 4.26 0 0 1 -5.28 1.863l-3.831 2.298v-3.134a2.668 2.668 0 0 1 -1.795 -3.773a4.8 4.8 0 0 1 2.908 -8.933a5.33 5.33 0 0 1 4.287 -2.16"></path></symbol>
<symbol id="pplx-icon-camera" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M5 7h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2 M9 13a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"></path></symbol>
<symbol id="pplx-icon-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5l10 -10"></path></symbol>
<symbol id="pplx-icon-click" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12l3 0 M12 3l0 3 M7.8 7.8l-2.2 -2.2 M16.2 7.8l2.2 -2.2 M7.8 16.2l-2.2 2.2 M12 12l9 3l-4 2l-2 4l-3 -9"></path></symbol>
<symbol id="pplx-icon-file-text" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3v4a1 1 0 0 0 1 1h4 M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z M9 9l1 0 M9 13l6 0 M9 17l6 0"></path></symbol>
<symbol id="pplx-icon-forms" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a3 3 0 0 0 -3 3v12a3 3 0 0 0 3 3 M6 3a3 3 0 0 1 3 3v12a3 3 0 0 1 -3 3 M13 7h7a1 1 0 0 1 1 1v8a1 1 0 0 1 -1 1h-7 M5 7h-1a1 1 0 0 0 -1 1v8a1 1 0 0 0 1 1h1 M17 12h.01 M13 12h.01"></path></symbol>
<symbol id="pplx-icon-keyboard" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6m0 2a2 2 0 0 1 2 -2h16a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-16a2 2 0 0 1 -2 -2z M6 10l0 .01 M10 10l0 .01 M14 10l0 .01 M18 10l0 .01 M6 14l0 .01 M18 14l0 .01 M10 14l4 .01"></path></symbol>
<symbol id="pplx-icon-location" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5"></path></symbol>
<symbol id="pplx-icon-player-pause" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M6 5m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z M14 5m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z"></path></symbol>
<symbol id="pplx-icon-player-play" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4v16l13 -8z"></path></symbol>
<symbol id="pplx-icon-search" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0 M21 21l-6 -6"></path></symbol>
<symbol id="pplx-icon-square-rounded-arrow-down" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M8 12l4 4l4 -4 M12 8v8 M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z"></path></symbol>
</svg>
`,
    rp = "pplx-icon-sprites";
function s4(a, i = rp) {
    if (document.getElementById(i)) return;
    const o = document.createElement("div");
    (o.id = i), (o.innerHTML = a), (o.style.display = "none"), document.body.appendChild(o);
}
s4(ip);
s4(hh, "pplx-logo-sprites");
const up = new URLSearchParams(window.location.search),
    { isPaused: op, tabId: sp, simpleMode: cp, taskId: fp } = JSON.parse(decodeURIComponent(up.get("params"))),
    c4 = document.getElementById("root");
if (!c4) throw new Error("Root element not found");
const hp = j6.createRoot(c4);
hp.render(
    z.jsx(fh, {
        locale: "en",
        children: z.jsx(K5, {
            renderModals: !1,
            children: z.jsx(lp, { tabId: sp, isPausedParam: op, simpleMode: cp, taskId: fp }),
        }),
    })
);
//# sourceMappingURL=overlay.js.map
