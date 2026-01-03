const __vite__mapDeps = (
    i,
    m = __vite__mapDeps,
    d = m.f || (m.f = ["assets/index-C4MT8w_j.js", "assets/permissions-DQjjgS8V.js"])
) => i.map((i) => d[i]);
import {
    i as e,
    S as t,
    T as r,
    a as o,
    s as n,
    F as i,
    v as a,
    q as s,
    w as c,
    t as u,
    x as l,
    u as d,
    y as h,
    z as p,
    _ as f,
    d as m,
    f as g,
    G as b,
    g as w,
    H as y,
} from "./permissions-DQjjgS8V.js";
import { g as v, a as I } from "./client-BsbSyIlx.js";
import { w as k, P as T } from "./SentryService-JiT06VPa.js";
var _,
    E = {},
    x = {};
var C,
    S,
    A = {};
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */ var D =
    (S ||
        ((S = 1),
        (function (e) {
            const t = (function () {
                    if (_) return x;
                    (_ = 1),
                        (x.byteLength = function (e) {
                            var t = i(e),
                                r = t[0],
                                o = t[1];
                            return (3 * (r + o)) / 4 - o;
                        }),
                        (x.toByteArray = function (e) {
                            var o,
                                n,
                                a = i(e),
                                s = a[0],
                                c = a[1],
                                u = new r(
                                    (function (e, t, r) {
                                        return (3 * (t + r)) / 4 - r;
                                    })(0, s, c)
                                ),
                                l = 0,
                                d = c > 0 ? s - 4 : s;
                            for (n = 0; n < d; n += 4)
                                (o =
                                    (t[e.charCodeAt(n)] << 18) |
                                    (t[e.charCodeAt(n + 1)] << 12) |
                                    (t[e.charCodeAt(n + 2)] << 6) |
                                    t[e.charCodeAt(n + 3)]),
                                    (u[l++] = (o >> 16) & 255),
                                    (u[l++] = (o >> 8) & 255),
                                    (u[l++] = 255 & o);
                            return (
                                2 === c &&
                                    ((o = (t[e.charCodeAt(n)] << 2) | (t[e.charCodeAt(n + 1)] >> 4)),
                                    (u[l++] = 255 & o)),
                                1 === c &&
                                    ((o =
                                        (t[e.charCodeAt(n)] << 10) |
                                        (t[e.charCodeAt(n + 1)] << 4) |
                                        (t[e.charCodeAt(n + 2)] >> 2)),
                                    (u[l++] = (o >> 8) & 255),
                                    (u[l++] = 255 & o)),
                                u
                            );
                        }),
                        (x.fromByteArray = function (t) {
                            for (var r, o = t.length, n = o % 3, i = [], a = 16383, c = 0, u = o - n; c < u; c += a)
                                i.push(s(t, c, c + a > u ? u : c + a));
                            return (
                                1 === n
                                    ? ((r = t[o - 1]), i.push(e[r >> 2] + e[(r << 4) & 63] + "=="))
                                    : 2 === n &&
                                      ((r = (t[o - 2] << 8) + t[o - 1]),
                                      i.push(e[r >> 10] + e[(r >> 4) & 63] + e[(r << 2) & 63] + "=")),
                                i.join("")
                            );
                        });
                    for (
                        var e = [],
                            t = [],
                            r = "undefined" != typeof Uint8Array ? Uint8Array : Array,
                            o = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
                            n = 0;
                        n < 64;
                        ++n
                    )
                        (e[n] = o[n]), (t[o.charCodeAt(n)] = n);
                    function i(e) {
                        var t = e.length;
                        if (t % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
                        var r = e.indexOf("=");
                        return -1 === r && (r = t), [r, r === t ? 0 : 4 - (r % 4)];
                    }
                    function a(t) {
                        return e[(t >> 18) & 63] + e[(t >> 12) & 63] + e[(t >> 6) & 63] + e[63 & t];
                    }
                    function s(e, t, r) {
                        for (var o, n = [], i = t; i < r; i += 3)
                            (o = ((e[i] << 16) & 16711680) + ((e[i + 1] << 8) & 65280) + (255 & e[i + 2])),
                                n.push(a(o));
                        return n.join("");
                    }
                    return (t["-".charCodeAt(0)] = 62), (t["_".charCodeAt(0)] = 63), x;
                })(),
                r =
                    (C ||
                        ((C = 1),
                        (A.read = function (e, t, r, o, n) {
                            var i,
                                a,
                                s = 8 * n - o - 1,
                                c = (1 << s) - 1,
                                u = c >> 1,
                                l = -7,
                                d = r ? n - 1 : 0,
                                h = r ? -1 : 1,
                                p = e[t + d];
                            for (
                                d += h, i = p & ((1 << -l) - 1), p >>= -l, l += s;
                                l > 0;
                                i = 256 * i + e[t + d], d += h, l -= 8
                            );
                            for (
                                a = i & ((1 << -l) - 1), i >>= -l, l += o;
                                l > 0;
                                a = 256 * a + e[t + d], d += h, l -= 8
                            );
                            if (0 === i) i = 1 - u;
                            else {
                                if (i === c) return a ? NaN : (1 / 0) * (p ? -1 : 1);
                                (a += Math.pow(2, o)), (i -= u);
                            }
                            return (p ? -1 : 1) * a * Math.pow(2, i - o);
                        }),
                        (A.write = function (e, t, r, o, n, i) {
                            var a,
                                s,
                                c,
                                u = 8 * i - n - 1,
                                l = (1 << u) - 1,
                                d = l >> 1,
                                h = 23 === n ? Math.pow(2, -24) - Math.pow(2, -77) : 0,
                                p = o ? 0 : i - 1,
                                f = o ? 1 : -1,
                                m = t < 0 || (0 === t && 1 / t < 0) ? 1 : 0;
                            for (
                                t = Math.abs(t),
                                    isNaN(t) || t === 1 / 0
                                        ? ((s = isNaN(t) ? 1 : 0), (a = l))
                                        : ((a = Math.floor(Math.log(t) / Math.LN2)),
                                          t * (c = Math.pow(2, -a)) < 1 && (a--, (c *= 2)),
                                          (t += a + d >= 1 ? h / c : h * Math.pow(2, 1 - d)) * c >= 2 &&
                                              (a++, (c /= 2)),
                                          a + d >= l
                                              ? ((s = 0), (a = l))
                                              : a + d >= 1
                                                ? ((s = (t * c - 1) * Math.pow(2, n)), (a += d))
                                                : ((s = t * Math.pow(2, d - 1) * Math.pow(2, n)), (a = 0)));
                                n >= 8;
                                e[r + p] = 255 & s, p += f, s /= 256, n -= 8
                            );
                            for (a = (a << n) | s, u += n; u > 0; e[r + p] = 255 & a, p += f, a /= 256, u -= 8);
                            e[r + p - f] |= 128 * m;
                        })),
                    A),
                o =
                    "function" == typeof Symbol && "function" == typeof Symbol.for
                        ? Symbol.for("nodejs.util.inspect.custom")
                        : null;
            (e.Buffer = a),
                (e.SlowBuffer = function (e) {
                    return +e != e && (e = 0), a.alloc(+e);
                }),
                (e.INSPECT_MAX_BYTES = 50);
            const n = 2147483647;
            function i(e) {
                if (e > n) throw new RangeError('The value "' + e + '" is invalid for option "size"');
                const t = new Uint8Array(e);
                return Object.setPrototypeOf(t, a.prototype), t;
            }
            function a(e, t, r) {
                if ("number" == typeof e) {
                    if ("string" == typeof t)
                        throw new TypeError('The "string" argument must be of type string. Received type number');
                    return u(e);
                }
                return s(e, t, r);
            }
            function s(e, t, r) {
                if ("string" == typeof e)
                    return (function (e, t) {
                        if ((("string" == typeof t && "" !== t) || (t = "utf8"), !a.isEncoding(t)))
                            throw new TypeError("Unknown encoding: " + t);
                        const r = 0 | p(e, t);
                        let o = i(r);
                        const n = o.write(e, t);
                        return n !== r && (o = o.slice(0, n)), o;
                    })(e, t);
                if (ArrayBuffer.isView(e))
                    return (function (e) {
                        if (X(e, Uint8Array)) {
                            const t = new Uint8Array(e);
                            return d(t.buffer, t.byteOffset, t.byteLength);
                        }
                        return l(e);
                    })(e);
                if (null == e)
                    throw new TypeError(
                        "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " +
                            typeof e
                    );
                if (X(e, ArrayBuffer) || (e && X(e.buffer, ArrayBuffer))) return d(e, t, r);
                if (
                    "undefined" != typeof SharedArrayBuffer &&
                    (X(e, SharedArrayBuffer) || (e && X(e.buffer, SharedArrayBuffer)))
                )
                    return d(e, t, r);
                if ("number" == typeof e)
                    throw new TypeError('The "value" argument must not be of type number. Received type number');
                const o = e.valueOf && e.valueOf();
                if (null != o && o !== e) return a.from(o, t, r);
                const n = (function (e) {
                    if (a.isBuffer(e)) {
                        const t = 0 | h(e.length),
                            r = i(t);
                        return 0 === r.length || e.copy(r, 0, 0, t), r;
                    }
                    return void 0 !== e.length
                        ? "number" != typeof e.length || Q(e.length)
                            ? i(0)
                            : l(e)
                        : "Buffer" === e.type && Array.isArray(e.data)
                          ? l(e.data)
                          : void 0;
                })(e);
                if (n) return n;
                if (
                    "undefined" != typeof Symbol &&
                    null != Symbol.toPrimitive &&
                    "function" == typeof e[Symbol.toPrimitive]
                )
                    return a.from(e[Symbol.toPrimitive]("string"), t, r);
                throw new TypeError(
                    "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " +
                        typeof e
                );
            }
            function c(e) {
                if ("number" != typeof e) throw new TypeError('"size" argument must be of type number');
                if (e < 0) throw new RangeError('The value "' + e + '" is invalid for option "size"');
            }
            function u(e) {
                return c(e), i(e < 0 ? 0 : 0 | h(e));
            }
            function l(e) {
                const t = e.length < 0 ? 0 : 0 | h(e.length),
                    r = i(t);
                for (let o = 0; o < t; o += 1) r[o] = 255 & e[o];
                return r;
            }
            function d(e, t, r) {
                if (t < 0 || e.byteLength < t) throw new RangeError('"offset" is outside of buffer bounds');
                if (e.byteLength < t + (r || 0)) throw new RangeError('"length" is outside of buffer bounds');
                let o;
                return (
                    (o =
                        void 0 === t && void 0 === r
                            ? new Uint8Array(e)
                            : void 0 === r
                              ? new Uint8Array(e, t)
                              : new Uint8Array(e, t, r)),
                    Object.setPrototypeOf(o, a.prototype),
                    o
                );
            }
            function h(e) {
                if (e >= n)
                    throw new RangeError(
                        "Attempt to allocate Buffer larger than maximum size: 0x" + n.toString(16) + " bytes"
                    );
                return 0 | e;
            }
            function p(e, t) {
                if (a.isBuffer(e)) return e.length;
                if (ArrayBuffer.isView(e) || X(e, ArrayBuffer)) return e.byteLength;
                if ("string" != typeof e)
                    throw new TypeError(
                        'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' +
                            typeof e
                    );
                const r = e.length,
                    o = arguments.length > 2 && !0 === arguments[2];
                if (!o && 0 === r) return 0;
                let n = !1;
                for (;;)
                    switch (t) {
                        case "ascii":
                        case "latin1":
                        case "binary":
                            return r;
                        case "utf8":
                        case "utf-8":
                            return Y(e).length;
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return 2 * r;
                        case "hex":
                            return r >>> 1;
                        case "base64":
                            return V(e).length;
                        default:
                            if (n) return o ? -1 : Y(e).length;
                            (t = ("" + t).toLowerCase()), (n = !0);
                    }
            }
            function f(e, t, r) {
                let o = !1;
                if (((void 0 === t || t < 0) && (t = 0), t > this.length)) return "";
                if (((void 0 === r || r > this.length) && (r = this.length), r <= 0)) return "";
                if ((r >>>= 0) <= (t >>>= 0)) return "";
                for (e || (e = "utf8"); ; )
                    switch (e) {
                        case "hex":
                            return R(this, t, r);
                        case "utf8":
                        case "utf-8":
                            return E(this, t, r);
                        case "ascii":
                            return D(this, t, r);
                        case "latin1":
                        case "binary":
                            return M(this, t, r);
                        case "base64":
                            return T(this, t, r);
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return U(this, t, r);
                        default:
                            if (o) throw new TypeError("Unknown encoding: " + e);
                            (e = (e + "").toLowerCase()), (o = !0);
                    }
            }
            function m(e, t, r) {
                const o = e[t];
                (e[t] = e[r]), (e[r] = o);
            }
            function g(e, t, r, o, n) {
                if (0 === e.length) return -1;
                if (
                    ("string" == typeof r
                        ? ((o = r), (r = 0))
                        : r > 2147483647
                          ? (r = 2147483647)
                          : r < -2147483648 && (r = -2147483648),
                    Q((r = +r)) && (r = n ? 0 : e.length - 1),
                    r < 0 && (r = e.length + r),
                    r >= e.length)
                ) {
                    if (n) return -1;
                    r = e.length - 1;
                } else if (r < 0) {
                    if (!n) return -1;
                    r = 0;
                }
                if (("string" == typeof t && (t = a.from(t, o)), a.isBuffer(t)))
                    return 0 === t.length ? -1 : b(e, t, r, o, n);
                if ("number" == typeof t)
                    return (
                        (t &= 255),
                        "function" == typeof Uint8Array.prototype.indexOf
                            ? n
                                ? Uint8Array.prototype.indexOf.call(e, t, r)
                                : Uint8Array.prototype.lastIndexOf.call(e, t, r)
                            : b(e, [t], r, o, n)
                    );
                throw new TypeError("val must be string, number or Buffer");
            }
            function b(e, t, r, o, n) {
                let i,
                    a = 1,
                    s = e.length,
                    c = t.length;
                if (
                    void 0 !== o &&
                    ("ucs2" === (o = String(o).toLowerCase()) || "ucs-2" === o || "utf16le" === o || "utf-16le" === o)
                ) {
                    if (e.length < 2 || t.length < 2) return -1;
                    (a = 2), (s /= 2), (c /= 2), (r /= 2);
                }
                function u(e, t) {
                    return 1 === a ? e[t] : e.readUInt16BE(t * a);
                }
                if (n) {
                    let o = -1;
                    for (i = r; i < s; i++)
                        if (u(e, i) === u(t, -1 === o ? 0 : i - o)) {
                            if ((-1 === o && (o = i), i - o + 1 === c)) return o * a;
                        } else -1 !== o && (i -= i - o), (o = -1);
                } else
                    for (r + c > s && (r = s - c), i = r; i >= 0; i--) {
                        let r = !0;
                        for (let o = 0; o < c; o++)
                            if (u(e, i + o) !== u(t, o)) {
                                r = !1;
                                break;
                            }
                        if (r) return i;
                    }
                return -1;
            }
            function w(e, t, r, o) {
                r = Number(r) || 0;
                const n = e.length - r;
                o ? (o = Number(o)) > n && (o = n) : (o = n);
                const i = t.length;
                let a;
                for (o > i / 2 && (o = i / 2), a = 0; a < o; ++a) {
                    const o = parseInt(t.substr(2 * a, 2), 16);
                    if (Q(o)) return a;
                    e[r + a] = o;
                }
                return a;
            }
            function y(e, t, r, o) {
                return J(Y(t, e.length - r), e, r, o);
            }
            function v(e, t, r, o) {
                return J(
                    (function (e) {
                        const t = [];
                        for (let r = 0; r < e.length; ++r) t.push(255 & e.charCodeAt(r));
                        return t;
                    })(t),
                    e,
                    r,
                    o
                );
            }
            function I(e, t, r, o) {
                return J(V(t), e, r, o);
            }
            function k(e, t, r, o) {
                return J(
                    (function (e, t) {
                        let r, o, n;
                        const i = [];
                        for (let a = 0; a < e.length && !((t -= 2) < 0); ++a)
                            (r = e.charCodeAt(a)), (o = r >> 8), (n = r % 256), i.push(n), i.push(o);
                        return i;
                    })(t, e.length - r),
                    e,
                    r,
                    o
                );
            }
            function T(e, r, o) {
                return 0 === r && o === e.length ? t.fromByteArray(e) : t.fromByteArray(e.slice(r, o));
            }
            function E(e, t, r) {
                r = Math.min(e.length, r);
                const o = [];
                let n = t;
                for (; n < r; ) {
                    const t = e[n];
                    let i = null,
                        a = t > 239 ? 4 : t > 223 ? 3 : t > 191 ? 2 : 1;
                    if (n + a <= r) {
                        let r, o, s, c;
                        switch (a) {
                            case 1:
                                t < 128 && (i = t);
                                break;
                            case 2:
                                (r = e[n + 1]),
                                    128 == (192 & r) && ((c = ((31 & t) << 6) | (63 & r)), c > 127 && (i = c));
                                break;
                            case 3:
                                (r = e[n + 1]),
                                    (o = e[n + 2]),
                                    128 == (192 & r) &&
                                        128 == (192 & o) &&
                                        ((c = ((15 & t) << 12) | ((63 & r) << 6) | (63 & o)),
                                        c > 2047 && (c < 55296 || c > 57343) && (i = c));
                                break;
                            case 4:
                                (r = e[n + 1]),
                                    (o = e[n + 2]),
                                    (s = e[n + 3]),
                                    128 == (192 & r) &&
                                        128 == (192 & o) &&
                                        128 == (192 & s) &&
                                        ((c = ((15 & t) << 18) | ((63 & r) << 12) | ((63 & o) << 6) | (63 & s)),
                                        c > 65535 && c < 1114112 && (i = c));
                        }
                    }
                    null === i
                        ? ((i = 65533), (a = 1))
                        : i > 65535 && ((i -= 65536), o.push(((i >>> 10) & 1023) | 55296), (i = 56320 | (1023 & i))),
                        o.push(i),
                        (n += a);
                }
                return (function (e) {
                    const t = e.length;
                    if (t <= S) return String.fromCharCode.apply(String, e);
                    let r = "",
                        o = 0;
                    for (; o < t; ) r += String.fromCharCode.apply(String, e.slice(o, (o += S)));
                    return r;
                })(o);
            }
            (e.kMaxLength = n),
                (a.TYPED_ARRAY_SUPPORT = (function () {
                    try {
                        const e = new Uint8Array(1),
                            t = {
                                foo: function () {
                                    return 42;
                                },
                            };
                        return (
                            Object.setPrototypeOf(t, Uint8Array.prototype), Object.setPrototypeOf(e, t), 42 === e.foo()
                        );
                    } catch (e) {
                        return !1;
                    }
                })()),
                !a.TYPED_ARRAY_SUPPORT && "undefined" != typeof console && console.error,
                Object.defineProperty(a.prototype, "parent", {
                    enumerable: !0,
                    get: function () {
                        if (a.isBuffer(this)) return this.buffer;
                    },
                }),
                Object.defineProperty(a.prototype, "offset", {
                    enumerable: !0,
                    get: function () {
                        if (a.isBuffer(this)) return this.byteOffset;
                    },
                }),
                (a.poolSize = 8192),
                (a.from = function (e, t, r) {
                    return s(e, t, r);
                }),
                Object.setPrototypeOf(a.prototype, Uint8Array.prototype),
                Object.setPrototypeOf(a, Uint8Array),
                (a.alloc = function (e, t, r) {
                    return (function (e, t, r) {
                        return (
                            c(e),
                            e <= 0
                                ? i(e)
                                : void 0 !== t
                                  ? "string" == typeof r
                                      ? i(e).fill(t, r)
                                      : i(e).fill(t)
                                  : i(e)
                        );
                    })(e, t, r);
                }),
                (a.allocUnsafe = function (e) {
                    return u(e);
                }),
                (a.allocUnsafeSlow = function (e) {
                    return u(e);
                }),
                (a.isBuffer = function (e) {
                    return null != e && !0 === e._isBuffer && e !== a.prototype;
                }),
                (a.compare = function (e, t) {
                    if (
                        (X(e, Uint8Array) && (e = a.from(e, e.offset, e.byteLength)),
                        X(t, Uint8Array) && (t = a.from(t, t.offset, t.byteLength)),
                        !a.isBuffer(e) || !a.isBuffer(t))
                    )
                        throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
                    if (e === t) return 0;
                    let r = e.length,
                        o = t.length;
                    for (let n = 0, i = Math.min(r, o); n < i; ++n)
                        if (e[n] !== t[n]) {
                            (r = e[n]), (o = t[n]);
                            break;
                        }
                    return r < o ? -1 : o < r ? 1 : 0;
                }),
                (a.isEncoding = function (e) {
                    switch (String(e).toLowerCase()) {
                        case "hex":
                        case "utf8":
                        case "utf-8":
                        case "ascii":
                        case "latin1":
                        case "binary":
                        case "base64":
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return !0;
                        default:
                            return !1;
                    }
                }),
                (a.concat = function (e, t) {
                    if (!Array.isArray(e)) throw new TypeError('"list" argument must be an Array of Buffers');
                    if (0 === e.length) return a.alloc(0);
                    let r;
                    if (void 0 === t) for (t = 0, r = 0; r < e.length; ++r) t += e[r].length;
                    const o = a.allocUnsafe(t);
                    let n = 0;
                    for (r = 0; r < e.length; ++r) {
                        let t = e[r];
                        if (X(t, Uint8Array))
                            n + t.length > o.length
                                ? (a.isBuffer(t) || (t = a.from(t)), t.copy(o, n))
                                : Uint8Array.prototype.set.call(o, t, n);
                        else {
                            if (!a.isBuffer(t)) throw new TypeError('"list" argument must be an Array of Buffers');
                            t.copy(o, n);
                        }
                        n += t.length;
                    }
                    return o;
                }),
                (a.byteLength = p),
                (a.prototype._isBuffer = !0),
                (a.prototype.swap16 = function () {
                    const e = this.length;
                    if (e % 2 != 0) throw new RangeError("Buffer size must be a multiple of 16-bits");
                    for (let t = 0; t < e; t += 2) m(this, t, t + 1);
                    return this;
                }),
                (a.prototype.swap32 = function () {
                    const e = this.length;
                    if (e % 4 != 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
                    for (let t = 0; t < e; t += 4) m(this, t, t + 3), m(this, t + 1, t + 2);
                    return this;
                }),
                (a.prototype.swap64 = function () {
                    const e = this.length;
                    if (e % 8 != 0) throw new RangeError("Buffer size must be a multiple of 64-bits");
                    for (let t = 0; t < e; t += 8)
                        m(this, t, t + 7), m(this, t + 1, t + 6), m(this, t + 2, t + 5), m(this, t + 3, t + 4);
                    return this;
                }),
                (a.prototype.toString = function () {
                    const e = this.length;
                    return 0 === e ? "" : 0 === arguments.length ? E(this, 0, e) : f.apply(this, arguments);
                }),
                (a.prototype.toLocaleString = a.prototype.toString),
                (a.prototype.equals = function (e) {
                    if (!a.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
                    return this === e || 0 === a.compare(this, e);
                }),
                (a.prototype.inspect = function () {
                    let t = "";
                    const r = e.INSPECT_MAX_BYTES;
                    return (
                        (t = this.toString("hex", 0, r)
                            .replace(/(.{2})/g, "$1 ")
                            .trim()),
                        this.length > r && (t += " ... "),
                        "<Buffer " + t + ">"
                    );
                }),
                o && (a.prototype[o] = a.prototype.inspect),
                (a.prototype.compare = function (e, t, r, o, n) {
                    if ((X(e, Uint8Array) && (e = a.from(e, e.offset, e.byteLength)), !a.isBuffer(e)))
                        throw new TypeError(
                            'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof e
                        );
                    if (
                        (void 0 === t && (t = 0),
                        void 0 === r && (r = e ? e.length : 0),
                        void 0 === o && (o = 0),
                        void 0 === n && (n = this.length),
                        t < 0 || r > e.length || o < 0 || n > this.length)
                    )
                        throw new RangeError("out of range index");
                    if (o >= n && t >= r) return 0;
                    if (o >= n) return -1;
                    if (t >= r) return 1;
                    if (this === e) return 0;
                    let i = (n >>>= 0) - (o >>>= 0),
                        s = (r >>>= 0) - (t >>>= 0);
                    const c = Math.min(i, s),
                        u = this.slice(o, n),
                        l = e.slice(t, r);
                    for (let a = 0; a < c; ++a)
                        if (u[a] !== l[a]) {
                            (i = u[a]), (s = l[a]);
                            break;
                        }
                    return i < s ? -1 : s < i ? 1 : 0;
                }),
                (a.prototype.includes = function (e, t, r) {
                    return -1 !== this.indexOf(e, t, r);
                }),
                (a.prototype.indexOf = function (e, t, r) {
                    return g(this, e, t, r, !0);
                }),
                (a.prototype.lastIndexOf = function (e, t, r) {
                    return g(this, e, t, r, !1);
                }),
                (a.prototype.write = function (e, t, r, o) {
                    if (void 0 === t) (o = "utf8"), (r = this.length), (t = 0);
                    else if (void 0 === r && "string" == typeof t) (o = t), (r = this.length), (t = 0);
                    else {
                        if (!isFinite(t))
                            throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
                        (t >>>= 0), isFinite(r) ? ((r >>>= 0), void 0 === o && (o = "utf8")) : ((o = r), (r = void 0));
                    }
                    const n = this.length - t;
                    if (((void 0 === r || r > n) && (r = n), (e.length > 0 && (r < 0 || t < 0)) || t > this.length))
                        throw new RangeError("Attempt to write outside buffer bounds");
                    o || (o = "utf8");
                    let i = !1;
                    for (;;)
                        switch (o) {
                            case "hex":
                                return w(this, e, t, r);
                            case "utf8":
                            case "utf-8":
                                return y(this, e, t, r);
                            case "ascii":
                            case "latin1":
                            case "binary":
                                return v(this, e, t, r);
                            case "base64":
                                return I(this, e, t, r);
                            case "ucs2":
                            case "ucs-2":
                            case "utf16le":
                            case "utf-16le":
                                return k(this, e, t, r);
                            default:
                                if (i) throw new TypeError("Unknown encoding: " + o);
                                (o = ("" + o).toLowerCase()), (i = !0);
                        }
                }),
                (a.prototype.toJSON = function () {
                    return { type: "Buffer", data: Array.prototype.slice.call(this._arr || this, 0) };
                });
            const S = 4096;
            function D(e, t, r) {
                let o = "";
                r = Math.min(e.length, r);
                for (let n = t; n < r; ++n) o += String.fromCharCode(127 & e[n]);
                return o;
            }
            function M(e, t, r) {
                let o = "";
                r = Math.min(e.length, r);
                for (let n = t; n < r; ++n) o += String.fromCharCode(e[n]);
                return o;
            }
            function R(e, t, r) {
                const o = e.length;
                (!t || t < 0) && (t = 0), (!r || r < 0 || r > o) && (r = o);
                let n = "";
                for (let i = t; i < r; ++i) n += Z[e[i]];
                return n;
            }
            function U(e, t, r) {
                const o = e.slice(t, r);
                let n = "";
                for (let i = 0; i < o.length - 1; i += 2) n += String.fromCharCode(o[i] + 256 * o[i + 1]);
                return n;
            }
            function P(e, t, r) {
                if (e % 1 != 0 || e < 0) throw new RangeError("offset is not uint");
                if (e + t > r) throw new RangeError("Trying to access beyond buffer length");
            }
            function B(e, t, r, o, n, i) {
                if (!a.isBuffer(e)) throw new TypeError('"buffer" argument must be a Buffer instance');
                if (t > n || t < i) throw new RangeError('"value" argument is out of bounds');
                if (r + o > e.length) throw new RangeError("Index out of range");
            }
            function G(e, t, r, o, n) {
                j(t, o, n, e, r, 7);
                let i = Number(t & BigInt(4294967295));
                (e[r++] = i), (i >>= 8), (e[r++] = i), (i >>= 8), (e[r++] = i), (i >>= 8), (e[r++] = i);
                let a = Number((t >> BigInt(32)) & BigInt(4294967295));
                return (e[r++] = a), (a >>= 8), (e[r++] = a), (a >>= 8), (e[r++] = a), (a >>= 8), (e[r++] = a), r;
            }
            function $(e, t, r, o, n) {
                j(t, o, n, e, r, 7);
                let i = Number(t & BigInt(4294967295));
                (e[r + 7] = i), (i >>= 8), (e[r + 6] = i), (i >>= 8), (e[r + 5] = i), (i >>= 8), (e[r + 4] = i);
                let a = Number((t >> BigInt(32)) & BigInt(4294967295));
                return (
                    (e[r + 3] = a), (a >>= 8), (e[r + 2] = a), (a >>= 8), (e[r + 1] = a), (a >>= 8), (e[r] = a), r + 8
                );
            }
            function O(e, t, r, o, n, i) {
                if (r + o > e.length) throw new RangeError("Index out of range");
                if (r < 0) throw new RangeError("Index out of range");
            }
            function L(e, t, o, n, i) {
                return (t = +t), (o >>>= 0), i || O(e, 0, o, 4), r.write(e, t, o, n, 23, 4), o + 4;
            }
            function N(e, t, o, n, i) {
                return (t = +t), (o >>>= 0), i || O(e, 0, o, 8), r.write(e, t, o, n, 52, 8), o + 8;
            }
            (a.prototype.slice = function (e, t) {
                const r = this.length;
                (e = ~~e) < 0 ? (e += r) < 0 && (e = 0) : e > r && (e = r),
                    (t = void 0 === t ? r : ~~t) < 0 ? (t += r) < 0 && (t = 0) : t > r && (t = r),
                    t < e && (t = e);
                const o = this.subarray(e, t);
                return Object.setPrototypeOf(o, a.prototype), o;
            }),
                (a.prototype.readUintLE = a.prototype.readUIntLE =
                    function (e, t, r) {
                        (e >>>= 0), (t >>>= 0), r || P(e, t, this.length);
                        let o = this[e],
                            n = 1,
                            i = 0;
                        for (; ++i < t && (n *= 256); ) o += this[e + i] * n;
                        return o;
                    }),
                (a.prototype.readUintBE = a.prototype.readUIntBE =
                    function (e, t, r) {
                        (e >>>= 0), (t >>>= 0), r || P(e, t, this.length);
                        let o = this[e + --t],
                            n = 1;
                        for (; t > 0 && (n *= 256); ) o += this[e + --t] * n;
                        return o;
                    }),
                (a.prototype.readUint8 = a.prototype.readUInt8 =
                    function (e, t) {
                        return (e >>>= 0), t || P(e, 1, this.length), this[e];
                    }),
                (a.prototype.readUint16LE = a.prototype.readUInt16LE =
                    function (e, t) {
                        return (e >>>= 0), t || P(e, 2, this.length), this[e] | (this[e + 1] << 8);
                    }),
                (a.prototype.readUint16BE = a.prototype.readUInt16BE =
                    function (e, t) {
                        return (e >>>= 0), t || P(e, 2, this.length), (this[e] << 8) | this[e + 1];
                    }),
                (a.prototype.readUint32LE = a.prototype.readUInt32LE =
                    function (e, t) {
                        return (
                            (e >>>= 0),
                            t || P(e, 4, this.length),
                            (this[e] | (this[e + 1] << 8) | (this[e + 2] << 16)) + 16777216 * this[e + 3]
                        );
                    }),
                (a.prototype.readUint32BE = a.prototype.readUInt32BE =
                    function (e, t) {
                        return (
                            (e >>>= 0),
                            t || P(e, 4, this.length),
                            16777216 * this[e] + ((this[e + 1] << 16) | (this[e + 2] << 8) | this[e + 3])
                        );
                    }),
                (a.prototype.readBigUInt64LE = ee(function (e) {
                    z((e >>>= 0), "offset");
                    const t = this[e],
                        r = this[e + 7];
                    (void 0 !== t && void 0 !== r) || H(e, this.length - 8);
                    const o = t + 256 * this[++e] + 65536 * this[++e] + this[++e] * 2 ** 24,
                        n = this[++e] + 256 * this[++e] + 65536 * this[++e] + r * 2 ** 24;
                    return BigInt(o) + (BigInt(n) << BigInt(32));
                })),
                (a.prototype.readBigUInt64BE = ee(function (e) {
                    z((e >>>= 0), "offset");
                    const t = this[e],
                        r = this[e + 7];
                    (void 0 !== t && void 0 !== r) || H(e, this.length - 8);
                    const o = t * 2 ** 24 + 65536 * this[++e] + 256 * this[++e] + this[++e],
                        n = this[++e] * 2 ** 24 + 65536 * this[++e] + 256 * this[++e] + r;
                    return (BigInt(o) << BigInt(32)) + BigInt(n);
                })),
                (a.prototype.readIntLE = function (e, t, r) {
                    (e >>>= 0), (t >>>= 0), r || P(e, t, this.length);
                    let o = this[e],
                        n = 1,
                        i = 0;
                    for (; ++i < t && (n *= 256); ) o += this[e + i] * n;
                    return (n *= 128), o >= n && (o -= Math.pow(2, 8 * t)), o;
                }),
                (a.prototype.readIntBE = function (e, t, r) {
                    (e >>>= 0), (t >>>= 0), r || P(e, t, this.length);
                    let o = t,
                        n = 1,
                        i = this[e + --o];
                    for (; o > 0 && (n *= 256); ) i += this[e + --o] * n;
                    return (n *= 128), i >= n && (i -= Math.pow(2, 8 * t)), i;
                }),
                (a.prototype.readInt8 = function (e, t) {
                    return (e >>>= 0), t || P(e, 1, this.length), 128 & this[e] ? -1 * (255 - this[e] + 1) : this[e];
                }),
                (a.prototype.readInt16LE = function (e, t) {
                    (e >>>= 0), t || P(e, 2, this.length);
                    const r = this[e] | (this[e + 1] << 8);
                    return 32768 & r ? 4294901760 | r : r;
                }),
                (a.prototype.readInt16BE = function (e, t) {
                    (e >>>= 0), t || P(e, 2, this.length);
                    const r = this[e + 1] | (this[e] << 8);
                    return 32768 & r ? 4294901760 | r : r;
                }),
                (a.prototype.readInt32LE = function (e, t) {
                    return (
                        (e >>>= 0),
                        t || P(e, 4, this.length),
                        this[e] | (this[e + 1] << 8) | (this[e + 2] << 16) | (this[e + 3] << 24)
                    );
                }),
                (a.prototype.readInt32BE = function (e, t) {
                    return (
                        (e >>>= 0),
                        t || P(e, 4, this.length),
                        (this[e] << 24) | (this[e + 1] << 16) | (this[e + 2] << 8) | this[e + 3]
                    );
                }),
                (a.prototype.readBigInt64LE = ee(function (e) {
                    z((e >>>= 0), "offset");
                    const t = this[e],
                        r = this[e + 7];
                    (void 0 !== t && void 0 !== r) || H(e, this.length - 8);
                    const o = this[e + 4] + 256 * this[e + 5] + 65536 * this[e + 6] + (r << 24);
                    return (
                        (BigInt(o) << BigInt(32)) +
                        BigInt(t + 256 * this[++e] + 65536 * this[++e] + this[++e] * 2 ** 24)
                    );
                })),
                (a.prototype.readBigInt64BE = ee(function (e) {
                    z((e >>>= 0), "offset");
                    const t = this[e],
                        r = this[e + 7];
                    (void 0 !== t && void 0 !== r) || H(e, this.length - 8);
                    const o = (t << 24) + 65536 * this[++e] + 256 * this[++e] + this[++e];
                    return (
                        (BigInt(o) << BigInt(32)) +
                        BigInt(this[++e] * 2 ** 24 + 65536 * this[++e] + 256 * this[++e] + r)
                    );
                })),
                (a.prototype.readFloatLE = function (e, t) {
                    return (e >>>= 0), t || P(e, 4, this.length), r.read(this, e, !0, 23, 4);
                }),
                (a.prototype.readFloatBE = function (e, t) {
                    return (e >>>= 0), t || P(e, 4, this.length), r.read(this, e, !1, 23, 4);
                }),
                (a.prototype.readDoubleLE = function (e, t) {
                    return (e >>>= 0), t || P(e, 8, this.length), r.read(this, e, !0, 52, 8);
                }),
                (a.prototype.readDoubleBE = function (e, t) {
                    return (e >>>= 0), t || P(e, 8, this.length), r.read(this, e, !1, 52, 8);
                }),
                (a.prototype.writeUintLE = a.prototype.writeUIntLE =
                    function (e, t, r, o) {
                        (e = +e), (t >>>= 0), (r >>>= 0), o || B(this, e, t, r, Math.pow(2, 8 * r) - 1, 0);
                        let n = 1,
                            i = 0;
                        for (this[t] = 255 & e; ++i < r && (n *= 256); ) this[t + i] = (e / n) & 255;
                        return t + r;
                    }),
                (a.prototype.writeUintBE = a.prototype.writeUIntBE =
                    function (e, t, r, o) {
                        (e = +e), (t >>>= 0), (r >>>= 0), o || B(this, e, t, r, Math.pow(2, 8 * r) - 1, 0);
                        let n = r - 1,
                            i = 1;
                        for (this[t + n] = 255 & e; --n >= 0 && (i *= 256); ) this[t + n] = (e / i) & 255;
                        return t + r;
                    }),
                (a.prototype.writeUint8 = a.prototype.writeUInt8 =
                    function (e, t, r) {
                        return (e = +e), (t >>>= 0), r || B(this, e, t, 1, 255, 0), (this[t] = 255 & e), t + 1;
                    }),
                (a.prototype.writeUint16LE = a.prototype.writeUInt16LE =
                    function (e, t, r) {
                        return (
                            (e = +e),
                            (t >>>= 0),
                            r || B(this, e, t, 2, 65535, 0),
                            (this[t] = 255 & e),
                            (this[t + 1] = e >>> 8),
                            t + 2
                        );
                    }),
                (a.prototype.writeUint16BE = a.prototype.writeUInt16BE =
                    function (e, t, r) {
                        return (
                            (e = +e),
                            (t >>>= 0),
                            r || B(this, e, t, 2, 65535, 0),
                            (this[t] = e >>> 8),
                            (this[t + 1] = 255 & e),
                            t + 2
                        );
                    }),
                (a.prototype.writeUint32LE = a.prototype.writeUInt32LE =
                    function (e, t, r) {
                        return (
                            (e = +e),
                            (t >>>= 0),
                            r || B(this, e, t, 4, 4294967295, 0),
                            (this[t + 3] = e >>> 24),
                            (this[t + 2] = e >>> 16),
                            (this[t + 1] = e >>> 8),
                            (this[t] = 255 & e),
                            t + 4
                        );
                    }),
                (a.prototype.writeUint32BE = a.prototype.writeUInt32BE =
                    function (e, t, r) {
                        return (
                            (e = +e),
                            (t >>>= 0),
                            r || B(this, e, t, 4, 4294967295, 0),
                            (this[t] = e >>> 24),
                            (this[t + 1] = e >>> 16),
                            (this[t + 2] = e >>> 8),
                            (this[t + 3] = 255 & e),
                            t + 4
                        );
                    }),
                (a.prototype.writeBigUInt64LE = ee(function (e, t = 0) {
                    return G(this, e, t, BigInt(0), BigInt("0xffffffffffffffff"));
                })),
                (a.prototype.writeBigUInt64BE = ee(function (e, t = 0) {
                    return $(this, e, t, BigInt(0), BigInt("0xffffffffffffffff"));
                })),
                (a.prototype.writeIntLE = function (e, t, r, o) {
                    if (((e = +e), (t >>>= 0), !o)) {
                        const o = Math.pow(2, 8 * r - 1);
                        B(this, e, t, r, o - 1, -o);
                    }
                    let n = 0,
                        i = 1,
                        a = 0;
                    for (this[t] = 255 & e; ++n < r && (i *= 256); )
                        e < 0 && 0 === a && 0 !== this[t + n - 1] && (a = 1), (this[t + n] = (((e / i) | 0) - a) & 255);
                    return t + r;
                }),
                (a.prototype.writeIntBE = function (e, t, r, o) {
                    if (((e = +e), (t >>>= 0), !o)) {
                        const o = Math.pow(2, 8 * r - 1);
                        B(this, e, t, r, o - 1, -o);
                    }
                    let n = r - 1,
                        i = 1,
                        a = 0;
                    for (this[t + n] = 255 & e; --n >= 0 && (i *= 256); )
                        e < 0 && 0 === a && 0 !== this[t + n + 1] && (a = 1), (this[t + n] = (((e / i) | 0) - a) & 255);
                    return t + r;
                }),
                (a.prototype.writeInt8 = function (e, t, r) {
                    return (
                        (e = +e),
                        (t >>>= 0),
                        r || B(this, e, t, 1, 127, -128),
                        e < 0 && (e = 255 + e + 1),
                        (this[t] = 255 & e),
                        t + 1
                    );
                }),
                (a.prototype.writeInt16LE = function (e, t, r) {
                    return (
                        (e = +e),
                        (t >>>= 0),
                        r || B(this, e, t, 2, 32767, -32768),
                        (this[t] = 255 & e),
                        (this[t + 1] = e >>> 8),
                        t + 2
                    );
                }),
                (a.prototype.writeInt16BE = function (e, t, r) {
                    return (
                        (e = +e),
                        (t >>>= 0),
                        r || B(this, e, t, 2, 32767, -32768),
                        (this[t] = e >>> 8),
                        (this[t + 1] = 255 & e),
                        t + 2
                    );
                }),
                (a.prototype.writeInt32LE = function (e, t, r) {
                    return (
                        (e = +e),
                        (t >>>= 0),
                        r || B(this, e, t, 4, 2147483647, -2147483648),
                        (this[t] = 255 & e),
                        (this[t + 1] = e >>> 8),
                        (this[t + 2] = e >>> 16),
                        (this[t + 3] = e >>> 24),
                        t + 4
                    );
                }),
                (a.prototype.writeInt32BE = function (e, t, r) {
                    return (
                        (e = +e),
                        (t >>>= 0),
                        r || B(this, e, t, 4, 2147483647, -2147483648),
                        e < 0 && (e = 4294967295 + e + 1),
                        (this[t] = e >>> 24),
                        (this[t + 1] = e >>> 16),
                        (this[t + 2] = e >>> 8),
                        (this[t + 3] = 255 & e),
                        t + 4
                    );
                }),
                (a.prototype.writeBigInt64LE = ee(function (e, t = 0) {
                    return G(this, e, t, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
                })),
                (a.prototype.writeBigInt64BE = ee(function (e, t = 0) {
                    return $(this, e, t, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
                })),
                (a.prototype.writeFloatLE = function (e, t, r) {
                    return L(this, e, t, !0, r);
                }),
                (a.prototype.writeFloatBE = function (e, t, r) {
                    return L(this, e, t, !1, r);
                }),
                (a.prototype.writeDoubleLE = function (e, t, r) {
                    return N(this, e, t, !0, r);
                }),
                (a.prototype.writeDoubleBE = function (e, t, r) {
                    return N(this, e, t, !1, r);
                }),
                (a.prototype.copy = function (e, t, r, o) {
                    if (!a.isBuffer(e)) throw new TypeError("argument should be a Buffer");
                    if (
                        (r || (r = 0),
                        o || 0 === o || (o = this.length),
                        t >= e.length && (t = e.length),
                        t || (t = 0),
                        o > 0 && o < r && (o = r),
                        o === r)
                    )
                        return 0;
                    if (0 === e.length || 0 === this.length) return 0;
                    if (t < 0) throw new RangeError("targetStart out of bounds");
                    if (r < 0 || r >= this.length) throw new RangeError("Index out of range");
                    if (o < 0) throw new RangeError("sourceEnd out of bounds");
                    o > this.length && (o = this.length), e.length - t < o - r && (o = e.length - t + r);
                    const n = o - r;
                    return (
                        this === e && "function" == typeof Uint8Array.prototype.copyWithin
                            ? this.copyWithin(t, r, o)
                            : Uint8Array.prototype.set.call(e, this.subarray(r, o), t),
                        n
                    );
                }),
                (a.prototype.fill = function (e, t, r, o) {
                    if ("string" == typeof e) {
                        if (
                            ("string" == typeof t
                                ? ((o = t), (t = 0), (r = this.length))
                                : "string" == typeof r && ((o = r), (r = this.length)),
                            void 0 !== o && "string" != typeof o)
                        )
                            throw new TypeError("encoding must be a string");
                        if ("string" == typeof o && !a.isEncoding(o)) throw new TypeError("Unknown encoding: " + o);
                        if (1 === e.length) {
                            const t = e.charCodeAt(0);
                            (("utf8" === o && t < 128) || "latin1" === o) && (e = t);
                        }
                    } else "number" == typeof e ? (e &= 255) : "boolean" == typeof e && (e = Number(e));
                    if (t < 0 || this.length < t || this.length < r) throw new RangeError("Out of range index");
                    if (r <= t) return this;
                    let n;
                    if (((t >>>= 0), (r = void 0 === r ? this.length : r >>> 0), e || (e = 0), "number" == typeof e))
                        for (n = t; n < r; ++n) this[n] = e;
                    else {
                        const i = a.isBuffer(e) ? e : a.from(e, o),
                            s = i.length;
                        if (0 === s) throw new TypeError('The value "' + e + '" is invalid for argument "value"');
                        for (n = 0; n < r - t; ++n) this[n + t] = i[n % s];
                    }
                    return this;
                });
            const F = {};
            function q(e, t, r) {
                F[e] = class extends r {
                    constructor() {
                        super(),
                            Object.defineProperty(this, "message", {
                                value: t.apply(this, arguments),
                                writable: !0,
                                configurable: !0,
                            }),
                            (this.name = `${this.name} [${e}]`),
                            this.stack,
                            delete this.name;
                    }
                    get code() {
                        return e;
                    }
                    set code(e) {
                        Object.defineProperty(this, "code", {
                            configurable: !0,
                            enumerable: !0,
                            value: e,
                            writable: !0,
                        });
                    }
                    toString() {
                        return `${this.name} [${e}]: ${this.message}`;
                    }
                };
            }
            function W(e) {
                let t = "",
                    r = e.length;
                const o = "-" === e[0] ? 1 : 0;
                for (; r >= o + 4; r -= 3) t = `_${e.slice(r - 3, r)}${t}`;
                return `${e.slice(0, r)}${t}`;
            }
            function j(e, t, r, o, n, i) {
                if (e > r || e < t) {
                    const r = "bigint" == typeof t ? "n" : "";
                    let o;
                    throw (
                        ((o =
                            0 === t || t === BigInt(0)
                                ? `>= 0${r} and < 2${r} ** ${8 * (i + 1)}${r}`
                                : `>= -(2${r} ** ${8 * (i + 1) - 1}${r}) and < 2 ** ${8 * (i + 1) - 1}${r}`),
                        new F.ERR_OUT_OF_RANGE("value", o, e))
                    );
                }
                !(function (e, t, r) {
                    z(t, "offset"), (void 0 !== e[t] && void 0 !== e[t + r]) || H(t, e.length - (r + 1));
                })(o, n, i);
            }
            function z(e, t) {
                if ("number" != typeof e) throw new F.ERR_INVALID_ARG_TYPE(t, "number", e);
            }
            function H(e, t, r) {
                if (Math.floor(e) !== e) throw (z(e, r), new F.ERR_OUT_OF_RANGE("offset", "an integer", e));
                if (t < 0) throw new F.ERR_BUFFER_OUT_OF_BOUNDS();
                throw new F.ERR_OUT_OF_RANGE("offset", `>= 0 and <= ${t}`, e);
            }
            q(
                "ERR_BUFFER_OUT_OF_BOUNDS",
                function (e) {
                    return e ? `${e} is outside of buffer bounds` : "Attempt to access memory outside buffer bounds";
                },
                RangeError
            ),
                q(
                    "ERR_INVALID_ARG_TYPE",
                    function (e, t) {
                        return `The "${e}" argument must be of type number. Received type ${typeof t}`;
                    },
                    TypeError
                ),
                q(
                    "ERR_OUT_OF_RANGE",
                    function (e, t, r) {
                        let o = `The value of "${e}" is out of range.`,
                            n = r;
                        return (
                            Number.isInteger(r) && Math.abs(r) > 2 ** 32
                                ? (n = W(String(r)))
                                : "bigint" == typeof r &&
                                  ((n = String(r)),
                                  (r > BigInt(2) ** BigInt(32) || r < -(BigInt(2) ** BigInt(32))) && (n = W(n)),
                                  (n += "n")),
                            (o += ` It must be ${t}. Received ${n}`),
                            o
                        );
                    },
                    RangeError
                );
            const K = /[^+/0-9A-Za-z-_]/g;
            function Y(e, t) {
                let r;
                t = t || 1 / 0;
                const o = e.length;
                let n = null;
                const i = [];
                for (let a = 0; a < o; ++a) {
                    if (((r = e.charCodeAt(a)), r > 55295 && r < 57344)) {
                        if (!n) {
                            if (r > 56319) {
                                (t -= 3) > -1 && i.push(239, 191, 189);
                                continue;
                            }
                            if (a + 1 === o) {
                                (t -= 3) > -1 && i.push(239, 191, 189);
                                continue;
                            }
                            n = r;
                            continue;
                        }
                        if (r < 56320) {
                            (t -= 3) > -1 && i.push(239, 191, 189), (n = r);
                            continue;
                        }
                        r = 65536 + (((n - 55296) << 10) | (r - 56320));
                    } else n && (t -= 3) > -1 && i.push(239, 191, 189);
                    if (((n = null), r < 128)) {
                        if ((t -= 1) < 0) break;
                        i.push(r);
                    } else if (r < 2048) {
                        if ((t -= 2) < 0) break;
                        i.push((r >> 6) | 192, (63 & r) | 128);
                    } else if (r < 65536) {
                        if ((t -= 3) < 0) break;
                        i.push((r >> 12) | 224, ((r >> 6) & 63) | 128, (63 & r) | 128);
                    } else {
                        if (!(r < 1114112)) throw new Error("Invalid code point");
                        if ((t -= 4) < 0) break;
                        i.push((r >> 18) | 240, ((r >> 12) & 63) | 128, ((r >> 6) & 63) | 128, (63 & r) | 128);
                    }
                }
                return i;
            }
            function V(e) {
                return t.toByteArray(
                    (function (e) {
                        if ((e = (e = e.split("=")[0]).trim().replace(K, "")).length < 2) return "";
                        for (; e.length % 4 != 0; ) e += "=";
                        return e;
                    })(e)
                );
            }
            function J(e, t, r, o) {
                let n;
                for (n = 0; n < o && !(n + r >= t.length || n >= e.length); ++n) t[n + r] = e[n];
                return n;
            }
            function X(e, t) {
                return (
                    e instanceof t ||
                    (null != e && null != e.constructor && null != e.constructor.name && e.constructor.name === t.name)
                );
            }
            function Q(e) {
                return e != e;
            }
            const Z = (function () {
                const e = "0123456789abcdef",
                    t = new Array(256);
                for (let r = 0; r < 16; ++r) {
                    const o = 16 * r;
                    for (let n = 0; n < 16; ++n) t[o + n] = e[r] + e[n];
                }
                return t;
            })();
            function ee(e) {
                return "undefined" == typeof BigInt ? te : e;
            }
            function te() {
                throw new Error("BigInt not supported");
            }
        })(E)),
    E);
class M {
    static instance = null;
    subscriptions = new Map();
    chromeUpdateListener = null;
    chromeActivatedListener = null;
    chromeRemovedListener = null;
    relevantTabIds = new Set();
    nextSubscriptionId = 1;
    constructor() {}
    static getInstance() {
        return M.instance || (M.instance = new M()), M.instance;
    }
    subscribe(e, t, r) {
        const o = "sub_" + this.nextSubscriptionId++;
        return (
            this.subscriptions.set(o, { tabId: e, eventTypes: t, callback: r }),
            "all" !== e && this.relevantTabIds.add(e),
            1 === this.subscriptions.size && this.startListeners(),
            o
        );
    }
    unsubscribe(e) {
        const t = this.subscriptions.get(e);
        if (t) {
            if ((this.subscriptions.delete(e), "all" !== t.tabId)) {
                let e = !1;
                for (const [, r] of this.subscriptions)
                    if (r.tabId === t.tabId) {
                        e = !0;
                        break;
                    }
                e || this.relevantTabIds.delete(t.tabId);
            }
            0 === this.subscriptions.size && this.stopListeners();
        }
    }
    startListeners() {
        (this.chromeUpdateListener = (e, t, r) => {
            if (this.relevantTabIds.size > 0 && !this.relevantTabIds.has(e)) {
                let e = !1;
                for (const [, t] of this.subscriptions)
                    if ("all" === t.tabId) {
                        e = !0;
                        break;
                    }
                if (!e) return;
            }
            const o = {};
            let n = !1;
            if (
                (void 0 !== t.url && ((o.url = t.url), (n = !0)),
                void 0 !== t.status && ((o.status = t.status), (n = !0)),
                "groupId" in t && ((o.groupId = t.groupId), (n = !0)),
                void 0 !== t.title && ((o.title = t.title), (n = !0)),
                n)
            )
                for (const [, a] of this.subscriptions) {
                    if ("all" !== a.tabId && a.tabId !== e) continue;
                    let t = !1;
                    for (const e of a.eventTypes)
                        if (void 0 !== o[e]) {
                            t = !0;
                            break;
                        }
                    if (t)
                        try {
                            a.callback(e, o, r);
                        } catch (i) {}
                }
        }),
            (this.chromeActivatedListener = (e) => {
                const t = e.tabId;
                if (this.relevantTabIds.size > 0 && !this.relevantTabIds.has(t)) {
                    let e = !1;
                    for (const [, t] of this.subscriptions)
                        if ("all" === t.tabId) {
                            e = !0;
                            break;
                        }
                    if (!e) return;
                }
                const r = { active: !0 };
                for (const [, n] of this.subscriptions)
                    if (("all" === n.tabId || n.tabId === t) && n.eventTypes.includes("active"))
                        try {
                            n.callback(t, r);
                        } catch (o) {}
            }),
            chrome.tabs.onUpdated.addListener(this.chromeUpdateListener),
            chrome.tabs.onActivated.addListener(this.chromeActivatedListener),
            (this.chromeRemovedListener = (e) => {
                if (this.relevantTabIds.size > 0 && !this.relevantTabIds.has(e)) {
                    let e = !1;
                    for (const [, t] of this.subscriptions)
                        if ("all" === t.tabId) {
                            e = !0;
                            break;
                        }
                    if (!e) return;
                }
                const t = { removed: !0 };
                for (const [, o] of this.subscriptions)
                    if (("all" === o.tabId || o.tabId === e) && o.eventTypes.includes("removed"))
                        try {
                            o.callback(e, t);
                        } catch (r) {}
            }),
            chrome.tabs.onRemoved.addListener(this.chromeRemovedListener);
    }
    stopListeners() {
        this.chromeUpdateListener &&
            (chrome.tabs.onUpdated.removeListener(this.chromeUpdateListener), (this.chromeUpdateListener = null)),
            this.chromeActivatedListener &&
                (chrome.tabs.onActivated.removeListener(this.chromeActivatedListener),
                (this.chromeActivatedListener = null)),
            this.chromeRemovedListener &&
                (chrome.tabs.onRemoved.removeListener(this.chromeRemovedListener), (this.chromeRemovedListener = null)),
            this.relevantTabIds.clear();
    }
    getSubscriptionCount() {
        return this.subscriptions.size;
    }
    hasActiveListeners() {
        return (
            null !== this.chromeUpdateListener ||
            null !== this.chromeActivatedListener ||
            null !== this.chromeRemovedListener
        );
    }
}
const R = () => M.getInstance();
function U(e, t) {
    const r = { availableTabs: e.map((e) => ({ tabId: e.id, title: e.title, url: e.url })) };
    return void 0 !== t && (r.tabGroupId = t), JSON.stringify(r);
}
function P(e) {
    const t = {};
    return (
        e.availableTabs &&
            (t.availableTabs = e.availableTabs.map((e) => ({ tabId: e.id, title: e.title, url: e.url }))),
        e.domainSkills && e.domainSkills.length > 0 && (t.domainSkills = e.domainSkills),
        void 0 !== e.initialTabId && (t.initialTabId = e.initialTabId),
        JSON.stringify(t)
    );
}
function B(e) {
    return e.replace(/<system-reminder>[\s\S]*?<\/system-reminder>/gi, "").trim();
}
const G = async (e, t) => await Promise.all(e.map((e) => e.toAnthropicSchema(t))),
    $ = (e, t, r) => {
        const o = r.find((t) => t.name === e);
        if (!o || !o.parameters || "object" != typeof t || !t) return t;
        const n = { ...t };
        for (const [i, a] of Object.entries(o.parameters))
            if (i in n && a && "object" == typeof a) {
                const e = n[i],
                    t = a;
                if ("number" === t.type && "string" == typeof e) {
                    const t = Number(e);
                    isNaN(t) || (n[i] = t);
                } else "boolean" === t.type && "string" == typeof e && (n[i] = "true" === e);
            }
        return n;
    },
    O = (e, t) => {
        if (Array.isArray(e)) return e;
        if ("string" == typeof e)
            try {
                const t = JSON.parse(e);
                return Array.isArray(t) ? t : [];
            } catch {
                return [];
            }
        return [];
    };
function L(e, t) {
    console.info(`[imageUtils] Looking for image with ID: ${t}`),
        console.info(`[imageUtils] Total messages to search: ${e.length}`);
    for (let r = e.length - 1; r >= 0; r--) {
        const o = e[r];
        if ("user" === o.role && Array.isArray(o.content)) {
            for (const r of o.content)
                if ("tool_result" === r.type) {
                    const e = r;
                    if (e.content) {
                        const r = Array.isArray(e.content) ? e.content : [{ type: "text", text: e.content }];
                        let o = !1,
                            n = "";
                        for (const e of r)
                            if ("text" === e.type && e.text && e.text.includes(t)) {
                                (o = !0),
                                    (n = e.text),
                                    console.info("[imageUtils] ✅ Found image ID in tool_result text");
                                break;
                            }
                        if (o)
                            for (const e of r)
                                if ("image" === e.type) {
                                    const r = e;
                                    if (r.source && "data" in r.source && r.source.data)
                                        return (
                                            console.info(`[imageUtils] ✅ Found image data for ID ${t}`),
                                            { base64: r.source.data, width: N(n, "width"), height: N(n, "height") }
                                        );
                                }
                    }
                }
            const e = o.content.findIndex((e) => "text" === e.type && e.text?.includes(t));
            if (-1 !== e) {
                console.info(`[imageUtils] Found image ID in user text at index ${e}, looking for next adjacent image`);
                for (let r = e + 1; r < o.content.length; r++) {
                    const e = o.content[r];
                    if ("image" === e.type) {
                        const o = e;
                        if (o.source && "data" in o.source && o.source.data)
                            return (
                                console.info(`[imageUtils] ✅ Found user-uploaded image for ID ${t} at index ${r}`),
                                { base64: o.source.data }
                            );
                    }
                    if ("text" === e.type) {
                        console.info("[imageUtils] Hit another text block, stopping search");
                        break;
                    }
                }
            }
        }
    }
    console.info(`[imageUtils] ❌ Image not found with ID: ${t}`);
}
function N(e, t) {
    if (!e) return;
    const r = e.match(/\((\d+)x(\d+)/);
    return r ? ("width" === t ? parseInt(r[1], 10) : parseInt(r[2], 10)) : void 0;
}
function F(e) {
    e.startsWith("http") || (e = `https://${e}`);
    try {
        return new URL(e).hostname;
    } catch {
        return "";
    }
}
function q(e) {
    return e
        .toLowerCase()
        .replace(/^(https?:\/\/)?(www\.)?/, "")
        .replace(/\/.*$/, "");
}
async function W(e, t, r) {
    if (!t) return null;
    const o = await chrome.tabs.get(e);
    if (!o.url) return { error: "Unable to verify current URL for security check" };
    const n = F(t),
        i = F(o.url);
    return n !== i ? { error: `Security check failed: Domain changed from ${n} to ${i} during ${r}` } : null;
}
class j {
    static cache = new Map();
    static CACHE_TTL_MS = 3e5;
    static pendingRequests = new Map();
    static async getCategory(e) {
        const t = q(F(e)),
            r = this.cache.get(t);
        if (r) {
            if (!(Date.now() - r.timestamp > this.CACHE_TTL_MS)) return r.category;
            this.cache.delete(t);
        }
        const o = this.pendingRequests.get(t);
        if (o) return o;
        const n = this.fetchCategoryFromAPI(t);
        this.pendingRequests.set(t, n);
        try {
            return await n;
        } finally {
            this.pendingRequests.delete(t);
        }
    }
    static async fetchCategoryFromAPI(t) {
        const r = await e();
        if (r)
            try {
                const e = new URL("/api/web/domain_info/browser_extension", "https://api.anthropic.com");
                e.searchParams.append("domain", t);
                const o = await fetch(e.toString(), {
                    method: "GET",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${r}` },
                });
                if (!o.ok) return;
                const n = await o.json(),
                    i = this.getEffectiveCategory(n);
                return this.cache.set(t, { category: i, timestamp: Date.now() }), i;
            } catch (o) {
                return;
            }
    }
    static getEffectiveCategory(e) {
        return "block" === e.org_policy ? "category_org_blocked" : e.category;
    }
    static clearCache() {
        this.cache.clear();
    }
    static evictFromCache(e) {
        const t = q(e);
        this.cache.delete(t);
    }
    static getCacheSize() {
        return this.cache.size;
    }
}
const z = "Claude";
class H {
    static instance;
    groupMetadata = new Map();
    initialized = !1;
    STORAGE_KEY = t.TAB_GROUPS;
    groupBlocklistStatuses = new Map();
    blocklistListeners = new Set();
    indicatorUpdateTimer = null;
    INDICATOR_UPDATE_DELAY = 100;
    pendingRegroups = new Map();
    processingMainTabRemoval = new Set();
    mcpTabGroupId = null;
    MCP_TAB_GROUP_KEY = t.MCP_TAB_GROUP_ID;
    tabGroupListenerSubscriptionId = null;
    isTabGroupListenerStarted = !1;
    DISMISSED_GROUPS_KEY = t.DISMISSED_TAB_GROUPS;
    constructor() {
        this.startTabRemovalListener();
    }
    startTabRemovalListener() {
        chrome.tabs.onRemoved.addListener(async (e) => {
            for (const [t, r] of this.groupBlocklistStatuses.entries())
                r.categoriesByTab.has(e) && (await this.removeTabFromBlocklistTracking(t, e));
        });
    }
    static getInstance() {
        return H.instance || (H.instance = new H()), H.instance;
    }
    async dismissStaticIndicatorsForGroup(e) {
        const t = (await chrome.storage.local.get(this.DISMISSED_GROUPS_KEY))[this.DISMISSED_GROUPS_KEY] || [];
        t.includes(e) || t.push(e), await chrome.storage.local.set({ [this.DISMISSED_GROUPS_KEY]: t });
        try {
            const t = await chrome.tabs.query({ groupId: e });
            for (const e of t)
                if (e.id)
                    try {
                        await chrome.tabs.sendMessage(e.id, { type: "HIDE_STATIC_INDICATOR" });
                    } catch (r) {}
        } catch (r) {}
    }
    async isGroupDismissed(e) {
        try {
            const t = (await chrome.storage.local.get(this.DISMISSED_GROUPS_KEY))[this.DISMISSED_GROUPS_KEY];
            return !!Array.isArray(t) && t.includes(e);
        } catch (t) {
            return !1;
        }
    }
    async initialize(e = !1) {
        (this.initialized && !e) ||
            (await this.loadFromStorage(), await this.reconcileWithChrome(), (this.initialized = !0));
    }
    startTabGroupChangeListener() {
        if (this.isTabGroupListenerStarted) return;
        const e = R();
        (this.tabGroupListenerSubscriptionId = e.subscribe("all", ["groupId"], async (e, t) => {
            "groupId" in t && (await this.handleTabGroupChange(e, t.groupId));
        })),
            (this.isTabGroupListenerStarted = !0);
    }
    stopTabGroupChangeListener() {
        if (!this.isTabGroupListenerStarted || !this.tabGroupListenerSubscriptionId) return;
        R().unsubscribe(this.tabGroupListenerSubscriptionId),
            (this.tabGroupListenerSubscriptionId = null),
            (this.isTabGroupListenerStarted = !1);
    }
    async handleTabGroupChange(e, t) {
        for (const [n, i] of this.groupMetadata.entries())
            if (i.memberStates.has(e)) {
                if (t === chrome.tabGroups.TAB_GROUP_ID_NONE || t !== i.chromeGroupId) {
                    const t = i.memberStates.get(e),
                        a = t?.indicatorState || "none";
                    try {
                        let t = "HIDE_AGENT_INDICATORS";
                        "static" === a && (t = "HIDE_STATIC_INDICATOR"), await this.sendIndicatorMessage(e, t);
                    } catch (r) {}
                    if ((i.memberStates.delete(e), e === n)) {
                        if (this.processingMainTabRemoval.has(n)) return;
                        if (this.pendingRegroups.has(n)) return;
                        this.processingMainTabRemoval.add(n);
                        const e = i.memberStates.get(n)?.indicatorState || "none",
                            t = i.chromeGroupId;
                        try {
                            const r = await chrome.tabs.group({ tabIds: [n] });
                            if (
                                (await chrome.tabGroups.update(r, {
                                    title: z,
                                    color: chrome.tabGroups.Color.ORANGE,
                                    collapsed: !1,
                                }),
                                (i.chromeGroupId = r),
                                i.memberStates.clear(),
                                i.memberStates.set(n, { indicatorState: e }),
                                t !== r && this.groupBlocklistStatuses.delete(t),
                                "pulsing" === e)
                            )
                                try {
                                    await this.sendIndicatorMessage(n, "SHOW_AGENT_INDICATORS");
                                } catch (o) {}
                            return (
                                this.groupMetadata.set(n, i),
                                await this.saveToStorage(),
                                await this.cleanupOldGroup(t, n),
                                void this.processingMainTabRemoval.delete(n)
                            );
                        } catch (r) {
                            return r instanceof Error && r.message && r.message.includes("dragging")
                                ? (this.pendingRegroups.set(n, {
                                      tabId: n,
                                      originalGroupId: t,
                                      indicatorState: e,
                                      metadata: i,
                                      attemptCount: 0,
                                  }),
                                  void this.scheduleRegroupRetry(n))
                                : (this.groupMetadata.delete(n),
                                  this.groupBlocklistStatuses.delete(t),
                                  await this.saveToStorage(),
                                  void this.processingMainTabRemoval.delete(n));
                        }
                    }
                    await this.saveToStorage();
                    break;
                }
            }
        if (t && t !== chrome.tabGroups.TAB_GROUP_ID_NONE)
            for (const [n, i] of this.groupMetadata.entries())
                if (i.chromeGroupId === t) {
                    if (!i.memberStates.has(e)) {
                        const t = e !== n;
                        i.memberStates.set(e, { indicatorState: t ? "static" : "none" });
                        try {
                            const t = await chrome.tabs.get(e);
                            t.url && (await this.updateTabBlocklistStatus(e, t.url));
                        } catch (r) {}
                        const o = await this.isGroupDismissed(i.chromeGroupId);
                        if (t && !o) {
                            let t = 0;
                            const o = 3,
                                n = 500,
                                i = async () => {
                                    try {
                                        return await this.sendIndicatorMessage(e, "SHOW_STATIC_INDICATOR"), !0;
                                    } catch (r) {
                                        return t++, t < o && setTimeout(i, n), !1;
                                    }
                                };
                            await i();
                        }
                        await this.saveToStorage();
                    }
                    break;
                }
    }
    async cleanupOldGroup(e, t) {
        try {
            const r = await chrome.tabs.query({ groupId: e });
            for (const e of r)
                if (e.id && e.id !== t)
                    try {
                        await this.sendIndicatorMessage(e.id, "HIDE_STATIC_INDICATOR");
                    } catch {}
            const o = r.filter((e) => e.id && e.id !== t).map((e) => e.id);
            o.length > 0 && (await chrome.tabs.ungroup(o));
        } catch (r) {}
    }
    scheduleRegroupRetry(e) {
        const t = this.pendingRegroups.get(e);
        t &&
            (t.timeoutId && clearTimeout(t.timeoutId),
            (t.timeoutId = setTimeout(() => {
                this.attemptRegroup(e);
            }, 1e3)));
    }
    async attemptRegroup(e) {
        const t = this.pendingRegroups.get(e);
        if (t) {
            t.attemptCount++;
            try {
                if ((await chrome.tabs.get(e)).groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE)
                    return void this.pendingRegroups.delete(e);
                const o = await chrome.tabs.group({ tabIds: [e] });
                if (
                    (await chrome.tabGroups.update(o, {
                        title: z,
                        color: chrome.tabGroups.Color.ORANGE,
                        collapsed: !1,
                    }),
                    (t.metadata.chromeGroupId = o),
                    t.metadata.memberStates.clear(),
                    t.metadata.memberStates.set(e, { indicatorState: t.indicatorState }),
                    t.originalGroupId !== o && this.groupBlocklistStatuses.delete(t.originalGroupId),
                    "pulsing" === t.indicatorState)
                )
                    try {
                        await this.sendIndicatorMessage(e, "SHOW_AGENT_INDICATORS");
                    } catch (r) {}
                this.groupMetadata.set(e, t.metadata),
                    await this.saveToStorage(),
                    await this.cleanupOldGroup(t.originalGroupId, e),
                    this.pendingRegroups.delete(e),
                    this.processingMainTabRemoval.delete(e);
            } catch {
                if (t.attemptCount < 5) this.scheduleRegroupRetry(e);
                else {
                    try {
                        const o = await chrome.tabs.group({ tabIds: [e] });
                        if (
                            (await chrome.tabGroups.update(o, {
                                title: z,
                                color: chrome.tabGroups.Color.ORANGE,
                                collapsed: !1,
                            }),
                            (t.metadata.chromeGroupId = o),
                            t.metadata.memberStates.clear(),
                            t.metadata.memberStates.set(e, { indicatorState: t.indicatorState }),
                            t.originalGroupId !== o && this.groupBlocklistStatuses.delete(t.originalGroupId),
                            "pulsing" === t.indicatorState)
                        )
                            try {
                                await this.sendIndicatorMessage(e, "SHOW_AGENT_INDICATORS");
                            } catch (r) {}
                        this.groupMetadata.set(e, t.metadata),
                            await this.saveToStorage(),
                            await this.cleanupOldGroup(t.originalGroupId, e);
                    } catch (o) {
                        this.groupMetadata.delete(e),
                            this.groupBlocklistStatuses.delete(t.originalGroupId),
                            await this.saveToStorage();
                    }
                    this.pendingRegroups.delete(e), this.processingMainTabRemoval.delete(e);
                }
            }
        }
    }
    async loadFromStorage() {
        try {
            const e = (await chrome.storage.local.get(this.STORAGE_KEY))[this.STORAGE_KEY];
            e &&
                "object" == typeof e &&
                (this.groupMetadata = new Map(
                    Object.entries(e).map(([e, t]) => {
                        const r = t;
                        return (
                            r.memberStates && "object" == typeof r.memberStates
                                ? (r.memberStates = new Map(
                                      Object.entries(r.memberStates).map(([e, t]) => [parseInt(e), t])
                                  ))
                                : (r.memberStates = new Map()),
                            [parseInt(e), r]
                        );
                    })
                ));
        } catch (e) {}
    }
    async saveToStorage() {
        try {
            const e = Object.fromEntries(
                Array.from(this.groupMetadata.entries()).map(([e, t]) => [
                    e,
                    { ...t, memberStates: Object.fromEntries(t.memberStates || new Map()) },
                ])
            );
            await chrome.storage.local.set({ [this.STORAGE_KEY]: e });
        } catch (e) {}
    }
    findMainTabInChromeGroup(e) {
        for (const [t, r] of this.groupMetadata.entries()) if (r.chromeGroupId === e) return t;
        return null;
    }
    async createGroup(e) {
        const t = await this.findGroupByMainTab(e);
        if (t) return t;
        const r = await chrome.tabs.get(e);
        let o,
            n = "blank";
        if (r.url && "" !== r.url && !r.url.startsWith("chrome://"))
            try {
                n = new URL(r.url).hostname || "blank";
            } catch {
                n = "blank";
            }
        if (r.groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE) {
            this.findMainTabInChromeGroup(r.groupId) || (await chrome.tabs.ungroup([e]));
        }
        let i = 3;
        for (; i > 0; )
            try {
                o = await chrome.tabs.group({ tabIds: [e] });
                break;
            } catch (c) {
                if ((i--, 0 === i)) throw c;
                await new Promise((e) => setTimeout(e, 100));
            }
        if (!o) throw new Error("Failed to create Chrome tab group");
        await chrome.tabGroups.update(o, { title: z, color: chrome.tabGroups.Color.ORANGE, collapsed: !1 });
        const a = { mainTabId: e, createdAt: Date.now(), domain: n, chromeGroupId: o, memberStates: new Map() };
        a.memberStates.set(e, { indicatorState: "none" }), this.groupMetadata.set(e, a), await this.saveToStorage();
        const s = await this.getGroupMembers(o);
        return { ...a, memberTabs: s };
    }
    async adoptOrphanedGroup(e, t) {
        const r = await this.findGroupByMainTab(e);
        if (r) return r;
        const o = await chrome.tabs.get(e);
        if (!o.url) throw new Error("Tab has no URL");
        const n = new URL(o.url).hostname;
        if (o.groupId !== t) throw new Error(`Tab ${e} is not in Chrome group ${t}`);
        const i = { mainTabId: e, createdAt: Date.now(), domain: n, chromeGroupId: t, memberStates: new Map() };
        i.memberStates.set(e, { indicatorState: "none" });
        const a = await chrome.tabs.query({ groupId: t });
        for (const c of a) c.id && c.id !== e && i.memberStates.set(c.id, { indicatorState: "static" });
        this.groupMetadata.set(e, i), await this.saveToStorage();
        const s = await this.getGroupMembers(t);
        return { ...i, memberTabs: s };
    }
    async addTabToGroup(e, t) {
        const r = this.groupMetadata.get(e);
        if (r) {
            try {
                await chrome.tabs.group({ tabIds: [t], groupId: r.chromeGroupId }),
                    r.memberStates.has(t) || r.memberStates.set(t, { indicatorState: t === e ? "none" : "static" });
                try {
                    const e = await chrome.tabs.get(t);
                    e.url && (await this.updateTabBlocklistStatus(t, e.url));
                } catch (o) {}
                const n = await this.isGroupDismissed(r.chromeGroupId);
                if (t !== e && !n)
                    try {
                        await chrome.tabs.sendMessage(t, { type: "SHOW_STATIC_INDICATOR" });
                    } catch {}
            } catch (o) {}
            await this.saveToStorage();
        }
    }
    async getGroupMembers(e) {
        const t = await chrome.tabs.query({ groupId: e });
        let r;
        for (const [, o] of this.groupMetadata.entries())
            if (o.chromeGroupId === e) {
                r = o;
                break;
            }
        return t
            .filter((e) => void 0 !== e.id)
            .map((e) => {
                const t = e.id,
                    o = r?.memberStates.get(t);
                return {
                    tabId: t,
                    url: e.url || "",
                    title: e.title || "",
                    joinedAt: Date.now(),
                    indicatorState: o?.indicatorState || "none",
                };
            });
    }
    async getGroupDetails(e) {
        const t = this.groupMetadata.get(e);
        if (!t) throw new Error(`No group found for main tab ${e}`);
        const r = await this.getGroupMembers(t.chromeGroupId);
        return { ...t, memberTabs: r };
    }
    async findOrphanedTabs() {
        const e = [],
            t = new Set(),
            r = await chrome.tabs.query({ groupId: chrome.tabGroups.TAB_GROUP_ID_NONE }),
            o = new Set();
        for (const [n] of this.groupMetadata.entries()) {
            o.add(n);
            const e = await this.findGroupByMainTab(n);
            e && e.memberTabs.forEach((e) => o.add(e.tabId));
        }
        for (const n of r) {
            if (!n.id || t.has(n.id) || o.has(n.id)) continue;
            t.add(n.id);
            n.openerTabId &&
                o.has(n.openerTabId) &&
                n.url &&
                !n.url.startsWith("chrome://") &&
                !n.url.startsWith("chrome-extension://") &&
                !("about:blank" === n.url) &&
                e.push({
                    tabId: n.id,
                    url: n.url || "",
                    title: n.title || "",
                    openerTabId: n.openerTabId,
                    detectedAt: Date.now(),
                });
        }
        return e;
    }
    async reconcileWithChrome() {
        const e = await chrome.tabs.query({}),
            t = new Set();
        for (const n of e) n.groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE && t.add(n.groupId);
        const r = [];
        let o = !1;
        for (const [n, i] of this.groupMetadata.entries())
            try {
                const e = await chrome.tabs.get(n);
                if (t.has(i.chromeGroupId))
                    if (e.groupId !== i.chromeGroupId) r.push(n);
                    else {
                        const e = await chrome.tabs.query({ groupId: i.chromeGroupId }),
                            t = new Set(e.map((e) => e.id).filter((e) => void 0 !== e)),
                            r = [];
                        for (const [o] of i.memberStates) t.has(o) || r.push(o);
                        if (r.length > 0) {
                            for (const e of r) {
                                i.memberStates.delete(e);
                                try {
                                    await this.sendIndicatorMessage(e, "HIDE_AGENT_INDICATORS");
                                } catch {}
                            }
                            o = !0;
                        }
                    }
                else r.push(n);
            } catch {
                r.push(n);
            }
        for (const n of r) this.groupMetadata.delete(n);
        (r.length > 0 || o) && (await this.saveToStorage());
    }
    async getAllGroups() {
        await this.initialize();
        const e = [];
        for (const [r, o] of this.groupMetadata.entries())
            try {
                const t = await this.getGroupMembers(o.chromeGroupId);
                e.push({ ...o, memberTabs: t });
            } catch (t) {}
        return e;
    }
    async findGroupByTab(e) {
        await this.initialize();
        const t = this.groupMetadata.get(e);
        if (t) {
            const e = await this.getGroupMembers(t.chromeGroupId);
            return { ...t, memberTabs: e };
        }
        const r = await chrome.tabs.get(e);
        if (r.groupId === chrome.tabGroups.TAB_GROUP_ID_NONE) return null;
        for (const [, i] of this.groupMetadata.entries())
            if (i.chromeGroupId === r.groupId) {
                const e = await this.getGroupMembers(i.chromeGroupId);
                return { ...i, memberTabs: e };
            }
        const o = await chrome.tabs.query({ groupId: r.groupId });
        if (0 === o.length) return null;
        o.sort((e, t) => e.index - t.index);
        const n = o[0];
        if (!n.id || !n.url) return null;
        return {
            mainTabId: n.id,
            createdAt: Date.now(),
            domain: new URL(n.url).hostname,
            chromeGroupId: r.groupId,
            memberStates: new Map(),
            memberTabs: o
                .filter((e) => void 0 !== e.id)
                .map((e) => ({ tabId: e.id, url: e.url || "", title: e.title || "", joinedAt: Date.now() })),
            isUnmanaged: !0,
        };
    }
    async findGroupByMainTab(e) {
        await this.initialize();
        const t = this.groupMetadata.get(e);
        if (!t) return null;
        try {
            const e = await this.getGroupMembers(t.chromeGroupId);
            return { ...t, memberTabs: e };
        } catch (r) {
            return null;
        }
    }
    async isInGroup(e) {
        return null !== (await this.findGroupByTab(e));
    }
    isMainTab(e) {
        return this.groupMetadata.has(e);
    }
    async getMainTabId(e) {
        const t = await this.findGroupByTab(e);
        return t?.mainTabId || null;
    }
    async promoteToMainTab(e, t) {
        const r = this.groupMetadata.get(e);
        if (!r) throw new Error(`No group found for main tab ${e}`);
        if ((await chrome.tabs.get(t)).groupId !== r.chromeGroupId)
            throw new Error(`Tab ${t} is not in the same group as ${e}`);
        const o = r.memberStates.get(e) || { indicatorState: "none" };
        try {
            await chrome.tabs.get(e),
                "pulsing" === o.indicatorState && (await this.sendIndicatorMessage(e, "HIDE_AGENT_INDICATORS"));
        } catch {}
        r.memberStates.get(t);
        r.mainTabId = t;
        try {
            await this.sendIndicatorMessage(t, "HIDE_STATIC_INDICATOR"), r.memberStates.delete(t);
        } catch (n) {}
        "pulsing" === o.indicatorState
            ? (r.memberStates.set(t, { indicatorState: "pulsing" }),
              await this.sendIndicatorMessage(t, "SHOW_AGENT_INDICATORS"))
            : r.memberStates.set(t, { indicatorState: "none" }),
            this.groupMetadata.delete(e),
            this.groupMetadata.set(t, r),
            await this.saveToStorage();
    }
    async deleteGroup(e) {
        const t = this.groupMetadata.get(e);
        if (t) {
            try {
                const e = await chrome.tabs.query({ groupId: t.chromeGroupId }),
                    o = e.map((e) => e.id).filter((e) => void 0 !== e);
                if (o.length > 0)
                    try {
                        for (const t of e)
                            if (t.id)
                                try {
                                    await chrome.tabs.sendMessage(t.id, { type: "HIDE_AGENT_INDICATORS" }),
                                        await chrome.tabs.sendMessage(t.id, { type: "HIDE_STATIC_INDICATOR" });
                                } catch {}
                    } catch (r) {}
                await new Promise((e) => setTimeout(e, 100)), o.length > 0 && (await chrome.tabs.ungroup(o));
            } catch (r) {}
            this.groupMetadata.delete(e), await this.saveToStorage();
        }
    }
    async clearAllGroups() {
        const e = Array.from(this.groupMetadata.keys());
        for (const t of e) await this.deleteGroup(t);
        this.groupMetadata.clear(), await this.saveToStorage();
    }
    async clearAll() {
        await this.clearAllGroups(), (this.initialized = !1);
    }
    async handleTabClosed(e) {
        this.groupMetadata.has(e) && (await this.deleteGroup(e));
    }
    async getGroup(e) {
        return (await this.findGroupByMainTab(e)) || void 0;
    }
    async updateTabBlocklistStatus(e, t) {
        const r = await this.findGroupByTab(e);
        if (!r) return;
        const o = t.includes("blocked.html"),
            n = o ? "category1" : await j.getCategory(t);
        await this.updateGroupBlocklistStatus(r.chromeGroupId, e, n, o);
    }
    async removeTabFromBlocklistTracking(e, t) {
        const r = this.groupBlocklistStatuses.get(e);
        r && (r.categoriesByTab.delete(t), r.blockedHtmlTabs.delete(t), await this.recalculateGroupBlocklistStatus(e));
    }
    async updateGroupBlocklistStatus(e, t, r, o = !1) {
        let n = this.groupBlocklistStatuses.get(e);
        n ||
            ((n = {
                groupId: e,
                mostRestrictiveCategory: void 0,
                categoriesByTab: new Map(),
                blockedHtmlTabs: new Set(),
                lastChecked: Date.now(),
            }),
            this.groupBlocklistStatuses.set(e, n)),
            n.categoriesByTab.set(t, r),
            o ? n.blockedHtmlTabs.add(t) : n.blockedHtmlTabs.delete(t),
            await this.recalculateGroupBlocklistStatus(e);
    }
    async recalculateGroupBlocklistStatus(e) {
        const t = this.groupBlocklistStatuses.get(e);
        if (!t) return;
        const r = t.mostRestrictiveCategory,
            o = Array.from(t.categoriesByTab.values());
        (t.mostRestrictiveCategory = this.getMostRestrictiveCategory(o)),
            (t.lastChecked = Date.now()),
            r !== t.mostRestrictiveCategory && this.notifyBlocklistListeners(e, t.mostRestrictiveCategory);
    }
    getMostRestrictiveCategory(e) {
        const t = { category3: 2, category2: 3, category_org_blocked: 3, category1: 4, category0: 1 };
        let r,
            o = 0;
        for (const n of e) n && t[n] > o && ((o = t[n]), (r = n));
        return r;
    }
    async getGroupBlocklistStatus(e) {
        await this.initialize();
        const t = await this.findGroupByMainTab(e);
        if (!t) {
            const t = await chrome.tabs.get(e);
            return await j.getCategory(t.url || "");
        }
        const r = this.groupBlocklistStatuses.get(t.chromeGroupId);
        return (
            (!r || Date.now() - r.lastChecked > 5e3) && (await this.checkAllTabsInGroupForBlocklist(t.chromeGroupId)),
            this.groupBlocklistStatuses.get(t.chromeGroupId)?.mostRestrictiveCategory
        );
    }
    async getBlockedTabsInfo(e) {
        await this.initialize();
        const t = await this.findGroupByMainTab(e),
            r = [];
        let o = !1;
        if (!t) {
            const t = await chrome.tabs.get(e);
            if (t.url?.includes("blocked.html"))
                (o = !0), r.push({ tabId: e, title: t.title || "Untitled", url: t.url || "", category: "category1" });
            else {
                const n = await j.getCategory(t.url || "");
                n &&
                    "category0" !== n &&
                    ((o = !0), r.push({ tabId: e, title: t.title || "Untitled", url: t.url || "", category: n }));
            }
            return { isMainTabBlocked: o, blockedTabs: r };
        }
        const n = this.groupBlocklistStatuses.get(t.chromeGroupId);
        (!n || Date.now() - n.lastChecked > 5e3) && (await this.checkAllTabsInGroupForBlocklist(t.chromeGroupId));
        const i = this.groupBlocklistStatuses.get(t.chromeGroupId);
        if (!i) return { isMainTabBlocked: o, blockedTabs: r };
        for (const a of i.blockedHtmlTabs)
            try {
                const t = await chrome.tabs.get(a);
                r.push({ tabId: a, title: t.title || "Untitled", url: t.url || "", category: "category1" }),
                    a === e && (o = !0);
            } catch {}
        for (const [a, s] of i.categoriesByTab.entries())
            if (
                s &&
                ("category1" === s || "category2" === s || "category_org_blocked" === s) &&
                !i.blockedHtmlTabs.has(a)
            )
                try {
                    const t = await chrome.tabs.get(a);
                    r.push({ tabId: a, title: t.title || "Untitled", url: t.url || "", category: s }),
                        a === e && (o = !0);
                } catch {}
        return { isMainTabBlocked: o, blockedTabs: r };
    }
    async checkAllTabsInGroupForBlocklist(e) {
        const t = await chrome.tabs.query({ groupId: e }),
            r = {
                groupId: e,
                mostRestrictiveCategory: void 0,
                categoriesByTab: new Map(),
                blockedHtmlTabs: new Set(),
                lastChecked: Date.now(),
            };
        for (const o of t)
            if (o.id && o.url)
                if (o.url.includes("blocked.html"))
                    r.blockedHtmlTabs.add(o.id), r.categoriesByTab.set(o.id, "category1");
                else {
                    const e = await j.getCategory(o.url);
                    r.categoriesByTab.set(o.id, e);
                }
        (r.mostRestrictiveCategory = this.getMostRestrictiveCategory(Array.from(r.categoriesByTab.values()))),
            this.groupBlocklistStatuses.set(e, r),
            this.notifyBlocklistListeners(e, r.mostRestrictiveCategory);
    }
    addBlocklistListener(e) {
        this.blocklistListeners.add(e);
    }
    removeBlocklistListener(e) {
        this.blocklistListeners.delete(e);
    }
    notifyBlocklistListeners(e, t) {
        for (const o of this.blocklistListeners)
            try {
                o(e, t);
            } catch (r) {}
    }
    clearBlocklistCache() {
        this.groupBlocklistStatuses.clear();
    }
    async isTabInSameGroup(e, t) {
        try {
            await this.initialize();
            const r = await this.getMainTabId(e);
            if (!r) return e === t;
            return r === (await this.getMainTabId(t));
        } catch (r) {
            return !1;
        }
    }
    async getValidTabIds(e) {
        try {
            await this.initialize();
            const t = await this.getMainTabId(e);
            if (!t) return [e];
            return (await this.getGroupDetails(t)).memberTabs.map((e) => e.tabId);
        } catch (t) {
            return [e];
        }
    }
    async getValidTabsWithMetadata(e) {
        try {
            const t = await this.getValidTabIds(e);
            return await Promise.all(
                t.map(async (e) => {
                    try {
                        const t = await chrome.tabs.get(e);
                        return { id: e, title: t.title || "Untitled", url: t.url || "" };
                    } catch (t) {
                        return { id: e, title: "Error loading tab", url: "" };
                    }
                })
            );
        } catch (t) {
            try {
                const t = await chrome.tabs.get(e);
                return [{ id: e, title: t.title || "Untitled", url: t.url || "" }];
            } catch {
                return [{ id: e, title: "Error loading tab", url: "" }];
            }
        }
    }
    async getEffectiveTabId(e, t) {
        if (void 0 === e) return t;
        if (!(await this.isTabInSameGroup(t, e))) {
            const r = await this.getValidTabIds(t);
            throw new Error(`Tab ${e} is not in the same group as the current tab. Valid tab IDs are: ${r.join(", ")}`);
        }
        return e;
    }
    async setTabIndicatorState(e, t, r) {
        let o,
            n = !1;
        for (const [, i] of this.groupMetadata.entries()) {
            if ((await this.getGroupMembers(i.chromeGroupId)).some((t) => t.tabId === e)) {
                if (((o = i.chromeGroupId), "static" === t && (await this.isGroupDismissed(o)))) return;
                const a = i.memberStates.get(e);
                i.memberStates.set(e, {
                    indicatorState: t,
                    previousIndicatorState: a?.indicatorState,
                    isMcp: r ?? a?.isMcp,
                }),
                    (n = !0);
                break;
            }
        }
        this.queueIndicatorUpdate(e, t);
    }
    async setGroupIndicatorState(e, t) {
        const r = await this.getGroupDetails(e);
        "pulsing" === t ? await this.setTabIndicatorState(e, "pulsing") : await this.setTabIndicatorState(e, t);
        for (const o of r.memberTabs)
            if (o.tabId !== e) {
                const e = "none" === t ? "none" : "static";
                await this.setTabIndicatorState(o.tabId, e);
            }
    }
    getTabIndicatorState(e) {
        for (const [, t] of this.groupMetadata.entries()) {
            const r = t.memberStates.get(e);
            if (r) return r.indicatorState;
        }
        return "none";
    }
    async showSecondaryTabIndicators(e) {
        const t = await this.getGroupDetails(e);
        if (!(await this.isGroupDismissed(t.chromeGroupId))) {
            for (const r of t.memberTabs) r.tabId !== e && (await this.setTabIndicatorState(r.tabId, "static"));
            await this.processIndicatorQueue();
        }
    }
    async showStaticIndicatorsForChromeGroup(e) {
        if (await this.isGroupDismissed(e)) return;
        const t = await chrome.tabs.query({ groupId: e });
        if (0 === t.length) return;
        let r;
        for (const [n, i] of this.groupMetadata.entries())
            if (i.chromeGroupId === e) {
                r = n;
                break;
            }
        r || (t.sort((e, t) => e.index - t.index), (r = t[0].id));
        for (const n of t)
            if (n.id && n.id !== r)
                try {
                    await chrome.tabs.sendMessage(n.id, { type: "SHOW_STATIC_INDICATOR" });
                } catch (o) {}
    }
    async hideSecondaryTabIndicators(e) {
        try {
            const t = await this.getGroupDetails(e);
            for (const r of t.memberTabs) r.tabId !== e && (await this.setTabIndicatorState(r.tabId, "none"));
            await this.processIndicatorQueue();
        } catch (t) {}
    }
    async hideIndicatorForToolUse(e) {
        try {
            const t = this.getTabIndicatorState(e);
            for (const [, r] of this.groupMetadata.entries()) {
                const o = r.memberStates.get(e);
                if (o) {
                    (o.previousIndicatorState = t), (o.indicatorState = "hidden_for_screenshot");
                    break;
                }
            }
            await this.sendIndicatorMessage(e, "HIDE_FOR_TOOL_USE");
        } catch (t) {}
    }
    async restoreIndicatorAfterToolUse(e) {
        try {
            for (const [, t] of this.groupMetadata.entries()) {
                const r = t.memberStates.get(e);
                if (r && void 0 !== r.previousIndicatorState) {
                    const o = r.previousIndicatorState;
                    if (((r.indicatorState = o), delete r.previousIndicatorState, "static" === o)) {
                        if (await this.isGroupDismissed(t.chromeGroupId)) return;
                    }
                    let n;
                    switch (o) {
                        case "pulsing":
                            n = "SHOW_AGENT_INDICATORS";
                            break;
                        case "static":
                            n = "SHOW_STATIC_INDICATOR";
                            break;
                        case "none":
                            return;
                        default:
                            n = "SHOW_AFTER_TOOL_USE";
                    }
                    await this.sendIndicatorMessage(e, n);
                    break;
                }
            }
        } catch (t) {}
    }
    async startRunning(e) {
        await this.setGroupIndicatorState(e, "pulsing");
    }
    async stopRunning() {
        for (const [, e] of this.groupMetadata.entries())
            for (const [t] of e.memberStates) await this.setTabIndicatorState(t, "none");
        await this.processIndicatorQueue();
    }
    async updateGroupTitle(e, t, r = !1) {
        if (!t || "" === t.trim()) return;
        const o = this.groupMetadata.get(e);
        if (o)
            try {
                if ((await chrome.tabGroups.get(o.chromeGroupId)).title !== z) return;
                const e = (await chrome.tabGroups.query({}))
                        .filter((e) => e.id !== o.chromeGroupId)
                        .map((e) => e.color),
                    n = [
                        chrome.tabGroups.Color.GREY,
                        chrome.tabGroups.Color.BLUE,
                        chrome.tabGroups.Color.RED,
                        chrome.tabGroups.Color.YELLOW,
                        chrome.tabGroups.Color.GREEN,
                        chrome.tabGroups.Color.PINK,
                        chrome.tabGroups.Color.PURPLE,
                        chrome.tabGroups.Color.CYAN,
                        chrome.tabGroups.Color.ORANGE,
                    ],
                    i = n.filter((t) => !e.includes(t));
                let a;
                if (i.length > 0) a = i[0];
                else {
                    const t = new Map();
                    n.forEach((e) => t.set(e, 0)),
                        e.forEach((e) => {
                            t.set(e, (t.get(e) || 0) + 1);
                        });
                    let r = 1 / 0;
                    a = chrome.tabGroups.Color.ORANGE;
                    for (const [e, o] of t.entries()) o < r && ((r = o), (a = e));
                }
                const s = r ? `⌛${t.trim()}` : t.trim();
                await chrome.tabGroups.update(o.chromeGroupId, { title: s, color: a });
            } catch (n) {}
    }
    async updateTabGroupPrefix(e, t, r) {
        const o = this.groupMetadata.get(e);
        if (!o) return;
        let n = 0;
        const i = /^(⌛|🔔|✅)/,
            a = async () => {
                try {
                    const e = (await chrome.tabGroups.get(o.chromeGroupId)).title || "";
                    if (r && !e.startsWith(r)) return;
                    if (t && e.startsWith(t)) return;
                    if (!t && !e.match(i)) return;
                    const n = e.replace(i, "").trim(),
                        a = t ? `${t}${n}` : n;
                    await chrome.tabGroups.update(o.chromeGroupId, { title: a });
                } catch (e) {
                    if ((n++, n <= 3)) {
                        return await new Promise((e) => setTimeout(e, 500)), a();
                    }
                }
            };
        await a();
    }
    async addCompletionPrefix(e) {
        await this.updateTabGroupPrefix(e, "✅");
    }
    async addLoadingPrefix(e) {
        await this.updateTabGroupPrefix(e, "⌛");
    }
    async addPermissionPrefix(e) {
        await this.updateTabGroupPrefix(e, "🔔");
    }
    async removeCompletionPrefix(e) {
        await this.updateTabGroupPrefix(e, null, "✅");
    }
    async removePrefix(e) {
        await this.updateTabGroupPrefix(e, null);
    }
    async addTabToIndicatorGroup(e) {
        const { tabId: t, isRunning: r, isMcp: o } = e;
        let n;
        (n = this.isMainTab(t) && r ? "pulsing" : "static"), await this.setTabIndicatorState(t, n, o);
    }
    async getTabForMcp(e, t) {
        if ((await this.initialize(), await this.loadMcpTabGroupId(), void 0 !== e))
            try {
                if (await chrome.tabs.get(e)) {
                    const t = await this.findGroupByTab(e);
                    return t && ((this.mcpTabGroupId = t.chromeGroupId), await this.saveMcpTabGroupId()), e;
                }
            } catch {
                throw new Error(`Tab ${e} does not exist`);
            }
        if (void 0 !== t) {
            for (const [e, r] of this.groupMetadata.entries())
                if (r.chromeGroupId === t)
                    try {
                        if (await chrome.tabs.get(e)) return e;
                    } catch {
                        break;
                    }
            try {
                const e = await chrome.tabs.query({ groupId: t });
                if (e.length > 0 && e[0].id) return e[0].id;
            } catch (r) {}
            throw new Error(`Could not find tab group ${t}`);
        }
    }
    async isTabMcp(e) {
        if ((await this.loadMcpTabGroupId(), null === this.mcpTabGroupId)) return !1;
        for (const [, t] of this.groupMetadata.entries())
            if (t.chromeGroupId === this.mcpTabGroupId && t.memberStates.has(e)) return !0;
        return !1;
    }
    async getOrCreateMcpTabContext(e) {
        const { createIfEmpty: t = !1 } = e || {};
        if ((await this.loadMcpTabGroupId(), null !== this.mcpTabGroupId))
            try {
                await chrome.tabGroups.get(this.mcpTabGroupId);
                const e = (await chrome.tabs.query({ groupId: this.mcpTabGroupId }))
                    .filter((e) => void 0 !== e.id)
                    .map((e) => ({ id: e.id, title: e.title || "", url: e.url || "" }));
                if (e.length > 0)
                    return {
                        currentTabId: e[0].id,
                        availableTabs: e,
                        tabCount: e.length,
                        tabGroupId: this.mcpTabGroupId,
                    };
            } catch {
                (this.mcpTabGroupId = null), await this.saveMcpTabGroupId();
            }
        if (t) {
            const e = await chrome.windows.create({ url: "chrome://newtab", focused: !0, type: "normal" }),
                t = e?.tabs?.[0]?.id;
            if (!t) throw new Error("Failed to create window with new tab");
            const r = await this.createGroup(t);
            return (
                await chrome.tabGroups.update(r.chromeGroupId, { color: chrome.tabGroups.Color.YELLOW }),
                (this.mcpTabGroupId = r.chromeGroupId),
                await this.saveMcpTabGroupId(),
                {
                    currentTabId: t,
                    availableTabs: [{ id: t, title: "New Tab", url: "chrome://newtab" }],
                    tabCount: 1,
                    tabGroupId: r.chromeGroupId,
                }
            );
        }
    }
    async saveMcpTabGroupId() {
        await chrome.storage.local.set({ [this.MCP_TAB_GROUP_KEY]: this.mcpTabGroupId });
    }
    async loadMcpTabGroupId() {
        try {
            const e = (await chrome.storage.local.get(this.MCP_TAB_GROUP_KEY))[this.MCP_TAB_GROUP_KEY];
            this.mcpTabGroupId = "number" == typeof e ? e : null;
        } catch (e) {
            this.mcpTabGroupId = null;
        }
    }
    queueIndicatorUpdate(e, t) {
        for (const [, r] of this.groupMetadata.entries()) {
            const o = r.memberStates.get(e);
            if (o) {
                o.pendingUpdate = t;
                break;
            }
        }
        this.indicatorUpdateTimer && clearTimeout(this.indicatorUpdateTimer),
            (this.indicatorUpdateTimer = setTimeout(() => {
                this.processIndicatorQueue();
            }, this.INDICATOR_UPDATE_DELAY));
    }
    async processIndicatorQueue() {
        for (const [, e] of this.groupMetadata.entries())
            for (const [t, r] of e.memberStates)
                if (r.pendingUpdate) {
                    let e;
                    switch (r.pendingUpdate) {
                        case "pulsing":
                            e = "SHOW_AGENT_INDICATORS";
                            break;
                        case "static":
                            e = "SHOW_STATIC_INDICATOR";
                            break;
                        case "none":
                            e = "HIDE_AGENT_INDICATORS";
                            break;
                        default:
                            continue;
                    }
                    await this.sendIndicatorMessage(t, e, r.isMcp), delete r.pendingUpdate;
                }
    }
    async sendIndicatorMessage(e, t, r) {
        try {
            await chrome.tabs.sendMessage(e, { type: t, isMcp: r });
        } catch (o) {
            throw o;
        }
    }
}
const K = H.getInstance(),
    Y = {
        name: "navigate",
        description:
            "Navigate to a URL, or go forward/back in browser history. If you don't have a valid tab ID, use tabs_context first to get available tabs.",
        parameters: {
            url: {
                type: "string",
                description:
                    'The URL to navigate to. Can be provided with or without protocol (defaults to https://). Use "forward" to go forward in history or "back" to go back in history.',
            },
            tabId: {
                type: "number",
                description:
                    "Tab ID to navigate. Must be a tab in the current group. Use tabs_context first if you don't have a valid tab ID.",
            },
        },
        execute: async (e, t) => {
            try {
                const { url: n, tabId: i } = e;
                if (!n) throw new Error("URL parameter is required");
                if (!t?.tabId) throw new Error("No active tab found");
                const a = await K.getEffectiveTabId(i, t.tabId);
                if (n && !["back", "forward"].includes(n.toLowerCase()))
                    try {
                        const e = await j.getCategory(n);
                        if (e && ("category1" === e || "category2" === e || "category_org_blocked" === e)) {
                            return {
                                error:
                                    "category_org_blocked" === e
                                        ? "This site is blocked by your organization's policy."
                                        : "This site is not allowed due to safety restrictions.",
                            };
                        }
                    } catch {}
                const s = await chrome.tabs.get(a);
                if (!s.id) throw new Error("Active tab has no ID");
                if ("back" === n.toLowerCase()) {
                    await chrome.tabs.goBack(s.id), await new Promise((e) => setTimeout(e, 100));
                    const e = await chrome.tabs.get(s.id),
                        r = await K.getValidTabsWithMetadata(t.tabId);
                    return {
                        output: `Navigated back to ${e.url}`,
                        tabContext: { currentTabId: t.tabId, executedOnTabId: a, availableTabs: r, tabCount: r.length },
                    };
                }
                if ("forward" === n.toLowerCase()) {
                    await chrome.tabs.goForward(s.id), await new Promise((e) => setTimeout(e, 100));
                    const e = await chrome.tabs.get(s.id),
                        r = await K.getValidTabsWithMetadata(t.tabId);
                    return {
                        output: `Navigated forward to ${e.url}`,
                        tabContext: { currentTabId: t.tabId, executedOnTabId: a, availableTabs: r, tabCount: r.length },
                    };
                }
                let c = n;
                c.match(/^https?:\/\//) || (c = `https://${c}`);
                try {
                    new URL(c);
                } catch (o) {
                    throw new Error(`Invalid URL: ${n}`);
                }
                const u = t?.toolUseId,
                    l = await t.permissionManager.checkPermission(c, u);
                if (!l.allowed)
                    return l.needsPrompt
                        ? { type: "permission_required", tool: r.NAVIGATE, url: c, toolUseId: u }
                        : { error: "Navigation to this domain is not allowed" };
                await chrome.tabs.update(a, { url: c }), await new Promise((e) => setTimeout(e, 100));
                const d = await K.getValidTabsWithMetadata(t.tabId);
                return {
                    output: `Navigated to ${c}`,
                    tabContext: { currentTabId: t.tabId, executedOnTabId: a, availableTabs: d, tabCount: d.length },
                };
            } catch (n) {
                return { error: `Failed to navigate: ${n instanceof Error ? n.message : "Unknown error"}` };
            }
        },
        toAnthropicSchema: async () => ({
            name: "navigate",
            description:
                "Navigate to a URL, or go forward/back in browser history. If you don't have a valid tab ID, use tabs_context first to get available tabs.",
            input_schema: {
                type: "object",
                properties: {
                    url: {
                        type: "string",
                        description:
                            'The URL to navigate to. Can be provided with or without protocol (defaults to https://). Use "forward" to go forward in history or "back" to go back in history.',
                    },
                    tabId: {
                        type: "number",
                        description:
                            "Tab ID to navigate. Must be a tab in the current group. Use tabs_context first if you don't have a valid tab ID.",
                    },
                },
                required: ["url", "tabId"],
            },
        }),
    };
function V(e, t) {
    return Math.floor((e - 1) / t) + 1;
}
function J(e, t, r) {
    return V(e, r) * V(t, r);
}
function X(e, t, r) {
    const { pxPerToken: o, maxTargetPx: n, maxTargetTokens: i } = r;
    if (e <= n && t <= n && J(e, t, o) <= i) return [e, t];
    if (t > e) {
        const [o, n] = X(t, e, r);
        return [n, o];
    }
    const a = e / t;
    let s = e,
        c = 1;
    for (;;) {
        if (c + 1 === s) return [c, Math.max(Math.round(c / a), 1)];
        const e = Math.floor((c + s) / 2),
            t = Math.max(Math.round(e / a), 1);
        e <= n && J(e, t, o) <= i ? (c = e) : (s = e);
    }
}
const Q = new (class {
    contexts = new Map();
    setContext(e, t) {
        if (t.viewportWidth && t.viewportHeight) {
            const r = {
                viewportWidth: t.viewportWidth,
                viewportHeight: t.viewportHeight,
                screenshotWidth: t.width,
                screenshotHeight: t.height,
            };
            this.contexts.set(e, r);
        }
    }
    getContext(e) {
        return this.contexts.get(e);
    }
    clearContext(e) {
        this.contexts.delete(e);
    }
    clearAllContexts() {
        this.contexts.clear();
    }
})();
globalThis.__cdpDebuggerListenerRegistered || (globalThis.__cdpDebuggerListenerRegistered = !1),
    globalThis.__cdpConsoleMessagesByTab || (globalThis.__cdpConsoleMessagesByTab = new Map()),
    globalThis.__cdpNetworkRequestsByTab || (globalThis.__cdpNetworkRequestsByTab = new Map()),
    globalThis.__cdpNetworkTrackingEnabled || (globalThis.__cdpNetworkTrackingEnabled = new Set()),
    globalThis.__cdpConsoleTrackingEnabled || (globalThis.__cdpConsoleTrackingEnabled = new Set());
const Z = {
        backspace: "deleteBackward",
        enter: "insertNewline",
        numpadenter: "insertNewline",
        kp_enter: "insertNewline",
        escape: "cancelOperation",
        arrowup: "moveUp",
        arrowdown: "moveDown",
        arrowleft: "moveLeft",
        arrowRight: "moveRight",
        up: "moveUp",
        down: "moveDown",
        left: "moveLeft",
        right: "moveRight",
        f5: "complete",
        delete: "deleteForward",
        home: "scrollToBeginningOfDocument",
        end: "scrollToEndOfDocument",
        pageup: "scrollPageUp",
        pagedown: "scrollPageDown",
        "shift+backspace": "deleteBackward",
        "shift+enter": "insertNewline",
        "shift+escape": "cancelOperation",
        "shift+arrowup": "moveUpAndModifySelection",
        "shift+arrowdown": "moveDownAndModifySelection",
        "shift+arrowleft": "moveLeftAndModifySelection",
        "shift+arrowright": "moveRightAndModifySelection",
        "shift+up": "moveUpAndModifySelection",
        "shift+down": "moveDownAndModifySelection",
        "shift+left": "moveLeftAndModifySelection",
        "shift+right": "moveRightAndModifySelection",
        "shift+f5": "complete",
        "shift+delete": "deleteForward",
        "shift+home": "moveToBeginningOfDocumentAndModifySelection",
        "shift+end": "moveToEndOfDocumentAndModifySelection",
        "shift+pageup": "pageUpAndModifySelection",
        "shift+pagedown": "pageDownAndModifySelection",
        "shift+numpad5": "delete",
        "ctrl+tab": "selectNextKeyView",
        "ctrl+enter": "insertLineBreak",
        "ctrl+numpadenter": "insertLineBreak",
        "ctrl+kp_enter": "insertLineBreak",
        "ctrl+quote": "insertSingleQuoteIgnoringSubstitution",
        "ctrl+'": "insertSingleQuoteIgnoringSubstitution",
        "ctrl+a": "moveToBeginningOfParagraph",
        "ctrl+b": "moveBackward",
        "ctrl+d": "deleteForward",
        "ctrl+e": "moveToEndOfParagraph",
        "ctrl+f": "moveForward",
        "ctrl+h": "deleteBackward",
        "ctrl+k": "deleteToEndOfParagraph",
        "ctrl+l": "centerSelectionInVisibleArea",
        "ctrl+n": "moveDown",
        "ctrl+p": "moveUp",
        "ctrl+t": "transpose",
        "ctrl+v": "moveUp",
        "ctrl+y": "yank",
        "ctrl+o": ["insertNewlineIgnoringFieldEditor", "moveBackward"],
        "ctrl+backspace": "deleteBackwardByDecomposingPreviousCharacter",
        "ctrl+arrowup": "scrollPageUp",
        "ctrl+arrowdown": "scrollPageDown",
        "ctrl+arrowleft": "moveToLeftEndOfLine",
        "ctrl+arrowright": "moveToRightEndOfLine",
        "ctrl+up": "scrollPageUp",
        "ctrl+down": "scrollPageDown",
        "ctrl+left": "moveToLeftEndOfLine",
        "ctrl+right": "moveToRightEndOfLine",
        "shift+ctrl+enter": "insertLineBreak",
        "shift+control+numpadenter": "insertLineBreak",
        "shift+control+kp_enter": "insertLineBreak",
        "shift+ctrl+tab": "selectPreviousKeyView",
        "shift+ctrl+quote": "insertDoubleQuoteIgnoringSubstitution",
        "shift+ctrl+'": "insertDoubleQuoteIgnoringSubstitution",
        'ctrl+"': "insertDoubleQuoteIgnoringSubstitution",
        "shift+ctrl+a": "moveToBeginningOfParagraphAndModifySelection",
        "shift+ctrl+b": "moveBackwardAndModifySelection",
        "shift+ctrl+e": "moveToEndOfParagraphAndModifySelection",
        "shift+ctrl+f": "moveForwardAndModifySelection",
        "shift+ctrl+n": "moveDownAndModifySelection",
        "shift+ctrl+p": "moveUpAndModifySelection",
        "shift+ctrl+v": "pageDownAndModifySelection",
        "shift+ctrl+backspace": "deleteBackwardByDecomposingPreviousCharacter",
        "shift+ctrl+arrowup": "scrollPageUp",
        "shift+ctrl+arrowdown": "scrollPageDown",
        "shift+ctrl+arrowleft": "moveToLeftEndOfLineAndModifySelection",
        "shift+ctrl+arrowright": "moveToRightEndOfLineAndModifySelection",
        "shift+ctrl+up": "scrollPageUp",
        "shift+ctrl+down": "scrollPageDown",
        "shift+ctrl+left": "moveToLeftEndOfLineAndModifySelection",
        "shift+ctrl+right": "moveToRightEndOfLineAndModifySelection",
        "alt+backspace": "deleteWordBackward",
        "alt+enter": "insertNewlineIgnoringFieldEditor",
        "alt+numpadenter": "insertNewlineIgnoringFieldEditor",
        "alt+kp_enter": "insertNewlineIgnoringFieldEditor",
        "alt+escape": "complete",
        "alt+arrowup": ["moveBackward", "moveToBeginningOfParagraph"],
        "alt+arrowdown": ["moveForward", "moveToEndOfParagraph"],
        "alt+arrowleft": "moveWordLeft",
        "alt+arrowright": "moveWordRight",
        "alt+up": ["moveBackward", "moveToBeginningOfParagraph"],
        "alt+down": ["moveForward", "moveToEndOfParagraph"],
        "alt+left": "moveWordLeft",
        "alt+right": "moveWordRight",
        "alt+delete": "deleteWordForward",
        "alt+pageup": "pageUp",
        "alt+pagedown": "pageDown",
        "shift+alt+backspace": "deleteWordBackward",
        "shift+alt+enter": "insertNewlineIgnoringFieldEditor",
        "shift+alt+numpadenter": "insertNewlineIgnoringFieldEditor",
        "shift+alt+kp_enter": "insertNewlineIgnoringFieldEditor",
        "shift+alt+escape": "complete",
        "shift+alt+arrowup": "moveParagraphBackwardAndModifySelection",
        "shift+alt+arrowdown": "moveParagraphForwardAndModifySelection",
        "shift+alt+arrowleft": "moveWordLeftAndModifySelection",
        "shift+alt+arrowright": "moveWordRightAndModifySelection",
        "shift+alt+up": "moveParagraphBackwardAndModifySelection",
        "shift+alt+down": "moveParagraphForwardAndModifySelection",
        "shift+alt+left": "moveWordLeftAndModifySelection",
        "shift+alt+right": "moveWordRightAndModifySelection",
        "shift+alt+delete": "deleteWordForward",
        "shift+alt+pageup": "pageUp",
        "shift+alt+pagedown": "pageDown",
        "ctrl+alt+b": "moveWordBackward",
        "ctrl+alt+f": "moveWordForward",
        "ctrl+alt+backspace": "deleteWordBackward",
        "shift+ctrl+alt+b": "moveWordBackwardAndModifySelection",
        "shift+ctrl+alt+f": "moveWordForwardAndModifySelection",
        "shift+ctrl+alt+backspace": "deleteWordBackward",
        "cmd+numpadsubtract": "cancel",
        "cmd+backspace": "deleteToBeginningOfLine",
        "cmd+arrowup": "moveToBeginningOfDocument",
        "cmd+arrowdown": "moveToEndOfDocument",
        "cmd+arrowleft": "moveToLeftEndOfLine",
        "cmd+arrowright": "moveToRightEndOfLine",
        "cmd+home": "moveToBeginningOfDocument",
        "cmd+up": "moveToBeginningOfDocument",
        "cmd+down": "moveToEndOfDocument",
        "cmd+left": "moveToLeftEndOfLine",
        "cmd+right": "moveToRightEndOfLine",
        "shift+cmd+numpadsubtract": "cancel",
        "shift+cmd+backspace": "deleteToBeginningOfLine",
        "shift+cmd+arrowup": "moveToBeginningOfDocumentAndModifySelection",
        "shift+cmd+arrowdown": "moveToEndOfDocumentAndModifySelection",
        "shift+cmd+arrowleft": "moveToLeftEndOfLineAndModifySelection",
        "shift+cmd+arrowright": "moveToRightEndOfLineAndModifySelection",
        "cmd+a": "selectAll",
        "cmd+c": "copy",
        "cmd+x": "cut",
        "cmd+v": "paste",
        "cmd+z": "undo",
        "shift+cmd+z": "redo",
    },
    ee = {
        enter: { key: "Enter", code: "Enter", keyCode: 13, text: "\r" },
        return: { key: "Enter", code: "Enter", keyCode: 13, text: "\r" },
        kp_enter: { key: "Enter", code: "Enter", keyCode: 13, text: "\r", isKeypad: !0 },
        tab: { key: "Tab", code: "Tab", keyCode: 9 },
        delete: { key: "Delete", code: "Delete", keyCode: 46 },
        backspace: { key: "Backspace", code: "Backspace", keyCode: 8 },
        escape: { key: "Escape", code: "Escape", keyCode: 27 },
        esc: { key: "Escape", code: "Escape", keyCode: 27 },
        space: { key: " ", code: "Space", keyCode: 32, text: " " },
        " ": { key: " ", code: "Space", keyCode: 32, text: " " },
        arrowup: { key: "ArrowUp", code: "ArrowUp", keyCode: 38 },
        arrowdown: { key: "ArrowDown", code: "ArrowDown", keyCode: 40 },
        arrowleft: { key: "ArrowLeft", code: "ArrowLeft", keyCode: 37 },
        arrowright: { key: "ArrowRight", code: "ArrowRight", keyCode: 39 },
        up: { key: "ArrowUp", code: "ArrowUp", keyCode: 38 },
        down: { key: "ArrowDown", code: "ArrowDown", keyCode: 40 },
        left: { key: "ArrowLeft", code: "ArrowLeft", keyCode: 37 },
        right: { key: "ArrowRight", code: "ArrowRight", keyCode: 39 },
        home: { key: "Home", code: "Home", keyCode: 36 },
        end: { key: "End", code: "End", keyCode: 35 },
        pageup: { key: "PageUp", code: "PageUp", keyCode: 33 },
        pagedown: { key: "PageDown", code: "PageDown", keyCode: 34 },
        f1: { key: "F1", code: "F1", keyCode: 112 },
        f2: { key: "F2", code: "F2", keyCode: 113 },
        f3: { key: "F3", code: "F3", keyCode: 114 },
        f4: { key: "F4", code: "F4", keyCode: 115 },
        f5: { key: "F5", code: "F5", keyCode: 116 },
        f6: { key: "F6", code: "F6", keyCode: 117 },
        f7: { key: "F7", code: "F7", keyCode: 118 },
        f8: { key: "F8", code: "F8", keyCode: 119 },
        f9: { key: "F9", code: "F9", keyCode: 120 },
        f10: { key: "F10", code: "F10", keyCode: 121 },
        f11: { key: "F11", code: "F11", keyCode: 122 },
        f12: { key: "F12", code: "F12", keyCode: 123 },
        ";": { key: ";", code: "Semicolon", keyCode: 186, text: ";" },
        "=": { key: "=", code: "Equal", keyCode: 187, text: "=" },
        ",": { key: ",", code: "Comma", keyCode: 188, text: "," },
        "-": { key: "-", code: "Minus", keyCode: 189, text: "-" },
        ".": { key: ".", code: "Period", keyCode: 190, text: "." },
        "/": { key: "/", code: "Slash", keyCode: 191, text: "/" },
        "`": { key: "`", code: "Backquote", keyCode: 192, text: "`" },
        "[": { key: "[", code: "BracketLeft", keyCode: 219, text: "[" },
        "\\": { key: "\\", code: "Backslash", keyCode: 220, text: "\\" },
        "]": { key: "]", code: "BracketRight", keyCode: 221, text: "]" },
        "'": { key: "'", code: "Quote", keyCode: 222, text: "'" },
        "!": { key: "!", code: "Digit1", keyCode: 49, text: "!" },
        "@": { key: "@", code: "Digit2", keyCode: 50, text: "@" },
        "#": { key: "#", code: "Digit3", keyCode: 51, text: "#" },
        $: { key: "$", code: "Digit4", keyCode: 52, text: "$" },
        "%": { key: "%", code: "Digit5", keyCode: 53, text: "%" },
        "^": { key: "^", code: "Digit6", keyCode: 54, text: "^" },
        "&": { key: "&", code: "Digit7", keyCode: 55, text: "&" },
        "*": { key: "*", code: "Digit8", keyCode: 56, text: "*" },
        "(": { key: "(", code: "Digit9", keyCode: 57, text: "(" },
        ")": { key: ")", code: "Digit0", keyCode: 48, text: ")" },
        _: { key: "_", code: "Minus", keyCode: 189, text: "_" },
        "+": { key: "+", code: "Equal", keyCode: 187, text: "+" },
        "{": { key: "{", code: "BracketLeft", keyCode: 219, text: "{" },
        "}": { key: "}", code: "BracketRight", keyCode: 221, text: "}" },
        "|": { key: "|", code: "Backslash", keyCode: 220, text: "|" },
        ":": { key: ":", code: "Semicolon", keyCode: 186, text: ":" },
        '"': { key: '"', code: "Quote", keyCode: 222, text: '"' },
        "<": { key: "<", code: "Comma", keyCode: 188, text: "<" },
        ">": { key: ">", code: "Period", keyCode: 190, text: ">" },
        "?": { key: "?", code: "Slash", keyCode: 191, text: "?" },
        "~": { key: "~", code: "Backquote", keyCode: 192, text: "~" },
        capslock: { key: "CapsLock", code: "CapsLock", keyCode: 20 },
        numlock: { key: "NumLock", code: "NumLock", keyCode: 144 },
        scrolllock: { key: "ScrollLock", code: "ScrollLock", keyCode: 145 },
        pause: { key: "Pause", code: "Pause", keyCode: 19 },
        insert: { key: "Insert", code: "Insert", keyCode: 45 },
        printscreen: { key: "PrintScreen", code: "PrintScreen", keyCode: 44 },
        numpad0: { key: "0", code: "Numpad0", keyCode: 96, isKeypad: !0 },
        numpad1: { key: "1", code: "Numpad1", keyCode: 97, isKeypad: !0 },
        numpad2: { key: "2", code: "Numpad2", keyCode: 98, isKeypad: !0 },
        numpad3: { key: "3", code: "Numpad3", keyCode: 99, isKeypad: !0 },
        numpad4: { key: "4", code: "Numpad4", keyCode: 100, isKeypad: !0 },
        numpad5: { key: "5", code: "Numpad5", keyCode: 101, isKeypad: !0 },
        numpad6: { key: "6", code: "Numpad6", keyCode: 102, isKeypad: !0 },
        numpad7: { key: "7", code: "Numpad7", keyCode: 103, isKeypad: !0 },
        numpad8: { key: "8", code: "Numpad8", keyCode: 104, isKeypad: !0 },
        numpad9: { key: "9", code: "Numpad9", keyCode: 105, isKeypad: !0 },
        numpadmultiply: { key: "*", code: "NumpadMultiply", keyCode: 106, isKeypad: !0 },
        numpadadd: { key: "+", code: "NumpadAdd", keyCode: 107, isKeypad: !0 },
        numpadsubtract: { key: "-", code: "NumpadSubtract", keyCode: 109, isKeypad: !0 },
        numpaddecimal: { key: ".", code: "NumpadDecimal", keyCode: 110, isKeypad: !0 },
        numpaddivide: { key: "/", code: "NumpadDivide", keyCode: 111, isKeypad: !0 },
    };
class te {
    static MAX_LOGS_PER_TAB = 1e4;
    static MAX_REQUESTS_PER_TAB = 1e3;
    static get debuggerListenerRegistered() {
        return globalThis.__cdpDebuggerListenerRegistered;
    }
    static set debuggerListenerRegistered(e) {
        globalThis.__cdpDebuggerListenerRegistered = e;
    }
    static get consoleMessagesByTab() {
        return globalThis.__cdpConsoleMessagesByTab;
    }
    static get networkRequestsByTab() {
        return globalThis.__cdpNetworkRequestsByTab;
    }
    static get networkTrackingEnabled() {
        return globalThis.__cdpNetworkTrackingEnabled;
    }
    static get consoleTrackingEnabled() {
        return globalThis.__cdpConsoleTrackingEnabled;
    }
    isMac = !1;
    constructor() {
        (this.isMac =
            navigator.platform.toUpperCase().indexOf("MAC") >= 0 ||
            navigator.userAgent.toUpperCase().indexOf("MAC") >= 0),
            this.initializeDebuggerEventListener();
    }
    registerDebuggerEventHandlers() {
        globalThis.__cdpDebuggerEventHandler ||
            ((globalThis.__cdpDebuggerEventHandler = (e, t, r) => {
                const o = e.tabId;
                if (o) {
                    if ("Runtime.consoleAPICalled" === t) {
                        const e = {
                                type: r.type || "log",
                                text: r.args
                                    ?.map((e) => (void 0 !== e.value ? String(e.value) : e.description || ""))
                                    .join(" "),
                                timestamp: r.timestamp || Date.now(),
                                url: r.stackTrace?.callFrames?.[0]?.url,
                                lineNumber: r.stackTrace?.callFrames?.[0]?.lineNumber,
                                columnNumber: r.stackTrace?.callFrames?.[0]?.columnNumber,
                                args: r.args,
                            },
                            t = this.extractDomain(e.url);
                        this.addConsoleMessage(o, t, e);
                    }
                    if ("Runtime.exceptionThrown" === t) {
                        const e = r.exceptionDetails,
                            t = {
                                type: "exception",
                                text: e?.exception?.description || e?.text || "Unknown exception",
                                timestamp: e?.timestamp || Date.now(),
                                url: e?.url,
                                lineNumber: e?.lineNumber,
                                columnNumber: e?.columnNumber,
                                stackTrace: e?.stackTrace?.callFrames
                                    ?.map(
                                        (e) =>
                                            `    at ${e.functionName || "<anonymous>"} (${e.url}:${e.lineNumber}:${e.columnNumber})`
                                    )
                                    .join("\n"),
                            },
                            n = this.extractDomain(t.url);
                        this.addConsoleMessage(o, n, t);
                    }
                    if ("Network.requestWillBeSent" === t) {
                        const e = r.requestId,
                            t = r.request,
                            n = r.documentURL,
                            i = { requestId: e, url: t.url, method: t.method },
                            a = n || t.url,
                            s = this.extractDomain(a);
                        this.addNetworkRequest(o, s, i);
                    }
                    if ("Network.responseReceived" === t) {
                        const e = r.requestId,
                            t = r.response,
                            n = te.networkRequestsByTab.get(o);
                        if (n) {
                            const r = n.requests.find((t) => t.requestId === e);
                            r && (r.status = t.status);
                        }
                    }
                    if ("Network.loadingFailed" === t) {
                        const e = r.requestId,
                            t = te.networkRequestsByTab.get(o);
                        if (t) {
                            const r = t.requests.find((t) => t.requestId === e);
                            r && (r.status = 503);
                        }
                    }
                }
            }),
            chrome.debugger.onEvent.addListener(globalThis.__cdpDebuggerEventHandler));
    }
    initializeDebuggerEventListener() {
        te.debuggerListenerRegistered || ((te.debuggerListenerRegistered = !0), this.registerDebuggerEventHandlers());
    }
    defaultResizeParams = { pxPerToken: 28, maxTargetPx: 1568, maxTargetTokens: 1568 };
    static MAX_BASE64_CHARS = 1398100;
    static INITIAL_JPEG_QUALITY = 0.85;
    static JPEG_QUALITY_STEP = 0.05;
    static MIN_JPEG_QUALITY = 0.1;
    async attachDebugger(e) {
        const t = { tabId: e },
            r = te.networkTrackingEnabled.has(e),
            o = te.consoleTrackingEnabled.has(e);
        try {
            await this.detachDebugger(e);
        } catch {}
        if (
            (await new Promise((e, r) => {
                chrome.debugger.attach(t, "1.3", () => {
                    chrome.runtime.lastError ? r(new Error(chrome.runtime.lastError.message)) : e();
                });
            }),
            this.registerDebuggerEventHandlers(),
            o)
        )
            try {
                await this.sendCommand(e, "Runtime.enable");
            } catch (n) {}
        if (r)
            try {
                await this.sendCommand(e, "Network.enable", { maxPostDataSize: 65536 });
            } catch (n) {}
    }
    async detachDebugger(e) {
        return new Promise((t) => {
            chrome.debugger.detach({ tabId: e }, () => {
                t();
            });
        });
    }
    async isDebuggerAttached(e) {
        return new Promise((t) => {
            chrome.debugger.getTargets((r) => {
                const o = r.find((t) => t.tabId === e);
                t(o?.attached ?? !1);
            });
        });
    }
    async sendCommand(e, t, r) {
        try {
            return await new Promise((o, n) => {
                chrome.debugger.sendCommand({ tabId: e }, t, r, (e) => {
                    chrome.runtime.lastError ? n(new Error(chrome.runtime.lastError.message)) : o(e);
                });
            });
        } catch (o) {
            if ((o instanceof Error ? o.message : String(o)).toLowerCase().includes("debugger is not attached"))
                return (
                    await this.attachDebugger(e),
                    new Promise((o, n) => {
                        chrome.debugger.sendCommand({ tabId: e }, t, r, (e) => {
                            chrome.runtime.lastError ? n(new Error(chrome.runtime.lastError.message)) : o(e);
                        });
                    })
                );
            throw o;
        }
    }
    async dispatchMouseEvent(e, t) {
        const r = { type: t.type, x: Math.round(t.x), y: Math.round(t.y), modifiers: t.modifiers || 0 };
        ("mousePressed" !== t.type && "mouseReleased" !== t.type && "mouseMoved" !== t.type) ||
            ((r.button = t.button || "none"),
            ("mousePressed" !== t.type && "mouseReleased" !== t.type) || (r.clickCount = t.clickCount || 1)),
            "mouseWheel" !== t.type && (r.buttons = void 0 !== t.buttons ? t.buttons : 0),
            "mouseWheel" !== t.type ||
                (void 0 === t.deltaX && void 0 === t.deltaY) ||
                Object.assign(r, { deltaX: t.deltaX || 0, deltaY: t.deltaY || 0 }),
            await this.sendCommand(e, "Input.dispatchMouseEvent", r);
    }
    async dispatchKeyEvent(e, t) {
        const r = { modifiers: 0, ...t };
        await this.sendCommand(e, "Input.dispatchKeyEvent", r);
    }
    async insertText(e, t) {
        await this.sendCommand(e, "Input.insertText", { text: t });
    }
    async click(e, t, r, o = "left", n = 1, i = 0) {
        await K.hideIndicatorForToolUse(e), await new Promise((e) => setTimeout(e, 50));
        try {
            let a = 0;
            "left" === o ? (a = 1) : "right" === o ? (a = 2) : "middle" === o && (a = 4),
                await this.dispatchMouseEvent(e, {
                    type: "mouseMoved",
                    x: t,
                    y: r,
                    button: "none",
                    buttons: 0,
                    modifiers: i,
                }),
                await new Promise((e) => setTimeout(e, 100));
            for (let s = 1; s <= n; s++)
                await this.dispatchMouseEvent(e, {
                    type: "mousePressed",
                    x: t,
                    y: r,
                    button: o,
                    buttons: a,
                    clickCount: s,
                    modifiers: i,
                }),
                    await new Promise((e) => setTimeout(e, 12)),
                    await this.dispatchMouseEvent(e, {
                        type: "mouseReleased",
                        x: t,
                        y: r,
                        button: o,
                        buttons: 0,
                        modifiers: i,
                        clickCount: s,
                    }),
                    s < n && (await new Promise((e) => setTimeout(e, 100)));
        } finally {
            await K.restoreIndicatorAfterToolUse(e);
        }
    }
    async type(e, t) {
        for (const r of t) {
            let t = r;
            ("\n" !== r && "\r" !== r) || (t = "Enter");
            const o = this.getKeyCode(t);
            if (o) {
                const t = this.requiresShift(r) ? 8 : 0;
                await this.pressKey(e, o, t);
            } else await this.insertText(e, r);
        }
    }
    async keyDown(e, t, r = 0, o) {
        await this.dispatchKeyEvent(e, {
            type: t.text ? "keyDown" : "rawKeyDown",
            key: t.key,
            code: t.code,
            windowsVirtualKeyCode: t.windowsVirtualKeyCode || t.keyCode,
            modifiers: r,
            text: t.text ?? "",
            unmodifiedText: t.text ?? "",
            location: t.location ?? 0,
            commands: o ?? [],
            isKeypad: t.isKeypad ?? !1,
        });
    }
    async keyUp(e, t, r = 0) {
        await this.dispatchKeyEvent(e, {
            type: "keyUp",
            key: t.key,
            modifiers: r,
            windowsVirtualKeyCode: t.windowsVirtualKeyCode || t.keyCode,
            code: t.code,
            location: t.location ?? 0,
        });
    }
    async pressKey(e, t, r = 0, o) {
        await this.keyDown(e, t, r, o), await this.keyUp(e, t, r);
    }
    async pressKeyChord(e, t) {
        const r = t.toLowerCase().split("+"),
            o = [];
        let n = "";
        for (const c of r)
            ["ctrl", "control", "alt", "shift", "cmd", "meta", "command", "win", "windows"].includes(c)
                ? o.push(c)
                : (n = c);
        let i = 0;
        const a = { alt: 1, ctrl: 2, control: 2, meta: 4, cmd: 4, command: 4, win: 4, windows: 4, shift: 8 };
        for (const c of o) i |= a[c] || 0;
        const s = [];
        if (this.isMac) {
            const e = Z[t.toLowerCase()];
            e && Array.isArray(e) ? s.push(...e) : e && s.push(e);
        }
        if (n) {
            const r = this.getKeyCode(n);
            if (!r) throw new Error(`Unknown key: ${t}`);
            await this.pressKey(e, r, i, s);
        }
    }
    async scrollWheel(e, t, r, o, n) {
        await this.dispatchMouseEvent(e, { type: "mouseWheel", x: t, y: r, deltaX: o, deltaY: n });
    }
    getKeyCode(e) {
        const t = e.toLowerCase(),
            r = ee[t];
        if (r) return r;
        if (1 === e.length) {
            const t = e.toUpperCase();
            let r;
            if (t >= "A" && t <= "Z") r = `Key${t}`;
            else {
                if (!(e >= "0" && e <= "9")) return;
                r = `Digit${e}`;
            }
            return { key: e, code: r, keyCode: t.charCodeAt(0), text: e };
        }
    }
    requiresShift(e) {
        return '~!@#$%^&*()_+{}|:"<>?'.includes(e) || (e >= "A" && e <= "Z");
    }
    extractDomain(e) {
        if (!e) return "unknown";
        try {
            return new URL(e).hostname || "unknown";
        } catch {
            return "unknown";
        }
    }
    addConsoleMessage(e, t, r) {
        let o = te.consoleMessagesByTab.get(e);
        if (
            (o && o.domain !== t
                ? ((o = { domain: t, messages: [] }), te.consoleMessagesByTab.set(e, o))
                : o || ((o = { domain: t, messages: [] }), te.consoleMessagesByTab.set(e, o)),
            o.messages.length > 0)
        ) {
            const e = o.messages[o.messages.length - 1].timestamp;
            r.timestamp < e && (r.timestamp = e);
        }
        if ((o.messages.push(r), o.messages.length > te.MAX_LOGS_PER_TAB)) {
            const e = o.messages.length - te.MAX_LOGS_PER_TAB;
            o.messages.splice(0, e);
        }
    }
    async enableConsoleTracking(e) {
        try {
            await this.sendCommand(e, "Runtime.enable"), te.consoleTrackingEnabled.add(e);
        } catch (t) {
            throw t;
        }
    }
    getConsoleMessages(e, t = !1, r) {
        const o = te.consoleMessagesByTab.get(e);
        if (!o) return [];
        let n = o.messages;
        if ((t && (n = n.filter((e) => "error" === e.type || "exception" === e.type)), r))
            try {
                const e = new RegExp(r, "i");
                n = n.filter((t) => e.test(t.text));
            } catch {
                n = n.filter((e) => e.text.toLowerCase().includes(r.toLowerCase()));
            }
        return n;
    }
    clearConsoleMessages(e) {
        te.consoleMessagesByTab.delete(e);
    }
    addNetworkRequest(e, t, r) {
        let o = te.networkRequestsByTab.get(e);
        if (
            (o
                ? o.domain !== t && ((o.domain = t), (o.requests = []))
                : ((o = { domain: t, requests: [] }), te.networkRequestsByTab.set(e, o)),
            o.requests.push(r),
            o.requests.length > te.MAX_REQUESTS_PER_TAB)
        ) {
            const e = o.requests.length - te.MAX_REQUESTS_PER_TAB;
            o.requests.splice(0, e);
        }
    }
    async enableNetworkTracking(e) {
        try {
            te.debuggerListenerRegistered || this.initializeDebuggerEventListener();
            try {
                await this.sendCommand(e, "Network.disable"), await new Promise((e) => setTimeout(e, 50));
            } catch {}
            await this.sendCommand(e, "Network.enable", { maxPostDataSize: 65536 }), te.networkTrackingEnabled.add(e);
        } catch (t) {
            throw t;
        }
    }
    getNetworkRequests(e, t) {
        const r = te.networkRequestsByTab.get(e);
        if (!r) return [];
        let o = r.requests;
        return t && (o = o.filter((e) => e.url.includes(t))), o;
    }
    clearNetworkRequests(e) {
        te.networkRequestsByTab.delete(e);
    }
    isNetworkTrackingEnabled(e) {
        return te.networkTrackingEnabled.has(e);
    }
    async screenshot(e, t) {
        const r = t || this.defaultResizeParams;
        await K.hideIndicatorForToolUse(e), await new Promise((e) => setTimeout(e, 50));
        try {
            const t = await chrome.scripting.executeScript({
                target: { tabId: e },
                func: () => ({
                    width: window.innerWidth,
                    height: window.innerHeight,
                    devicePixelRatio: window.devicePixelRatio,
                }),
            });
            if (!t || !t[0]?.result) throw new Error("Failed to get viewport information");
            const { width: o, height: n, devicePixelRatio: i } = t[0].result,
                a = await this.sendCommand(e, "Page.captureScreenshot", {
                    format: "png",
                    captureBeyondViewport: !1,
                    fromSurface: !0,
                });
            if (!a || !a.data) throw new Error("Failed to capture screenshot via CDP");
            const s = a.data;
            if ("undefined" == typeof Image) return await this.processScreenshotInContentScript(e, s, o, n, i, r);
            const c = `data:image/png;base64,${s}`,
                u = await new Promise((e, t) => {
                    const a = new Image();
                    (a.onload = () => {
                        let s = a.width,
                            c = a.height;
                        const u = document.createElement("canvas"),
                            l = u.getContext("2d");
                        if (!l) return void t(new Error("Failed to create 2D context for screenshot processing"));
                        i > 1
                            ? ((s = Math.round(a.width / i)),
                              (c = Math.round(a.height / i)),
                              (u.width = s),
                              (u.height = c),
                              l.drawImage(a, 0, 0, a.width, a.height, 0, 0, s, c))
                            : ((u.width = s), (u.height = c), l.drawImage(a, 0, 0));
                        const [d, h] = X(s, c, r);
                        if (!(s !== d || c !== h)) {
                            const t = u.toDataURL("image/png").split(",")[1];
                            return void e({
                                base64: t,
                                width: s,
                                height: c,
                                format: "png",
                                viewportWidth: o,
                                viewportHeight: n,
                            });
                        }
                        const p = document.createElement("canvas"),
                            f = p.getContext("2d");
                        if (!f) return void t(new Error("Failed to create 2D context for target resizing"));
                        (p.width = d), (p.height = h), f.drawImage(u, 0, 0, s, c, 0, 0, d, h);
                        const m = p.toDataURL("image/png").split(",")[1];
                        e({ base64: m, width: d, height: h, format: "png", viewportWidth: o, viewportHeight: n });
                    }),
                        (a.onerror = () => {
                            t(new Error("Failed to load screenshot image"));
                        }),
                        (a.src = c);
                });
            return Q.setContext(e, u), u;
        } finally {
            await K.restoreIndicatorAfterToolUse(e);
        }
    }
    async processScreenshotInContentScript(e, t, r, o, n, i) {
        const a = await chrome.scripting.executeScript({
            target: { tabId: e },
            func: (e, t, r, o, n, i, a, s, c) => {
                const u = `data:image/png;base64,${e}`;
                return new Promise((e, l) => {
                    const d = new Image();
                    (d.onload = () => {
                        let u = d.width,
                            h = d.height;
                        o > 1 && ((u = Math.round(d.width / o)), (h = Math.round(d.height / o)));
                        const p = document.createElement("canvas");
                        (p.width = u), (p.height = h);
                        const f = p.getContext("2d");
                        if (!f) return void l(new Error("Failed to get canvas context"));
                        o > 1 ? f.drawImage(d, 0, 0, d.width, d.height, 0, 0, u, h) : f.drawImage(d, 0, 0);
                        const m = u / h,
                            g = n.pxPerToken || 28,
                            b = n.maxTargetTokens || 1568,
                            w = Math.ceil((u / g) * (h / g));
                        let y = u,
                            v = h;
                        if (w > b) {
                            const e = Math.sqrt(b / w);
                            (y = Math.round(u * e)), (v = Math.round(y / m));
                        }
                        const I = (e) => {
                            let t = a,
                                r = e.toDataURL("image/jpeg", t).split(",")[1];
                            for (; r.length > i && t > c; ) (t -= s), (r = e.toDataURL("image/jpeg", t).split(",")[1]);
                            return r;
                        };
                        if (y >= u && v >= h) {
                            const o = I(p);
                            return void e({
                                base64: o,
                                width: u,
                                height: h,
                                format: "jpeg",
                                viewportWidth: t,
                                viewportHeight: r,
                            });
                        }
                        const k = document.createElement("canvas");
                        (k.width = y), (k.height = v);
                        const T = k.getContext("2d");
                        if (!T) return void l(new Error("Failed to get target canvas context"));
                        T.drawImage(p, 0, 0, u, h, 0, 0, y, v);
                        const _ = I(k);
                        e({ base64: _, width: y, height: v, format: "jpeg", viewportWidth: t, viewportHeight: r });
                    }),
                        (d.onerror = () => {
                            l(new Error("Failed to load screenshot image"));
                        }),
                        (d.src = u);
                });
            },
            args: [
                t,
                r,
                o,
                n,
                i,
                te.MAX_BASE64_CHARS,
                te.INITIAL_JPEG_QUALITY,
                te.JPEG_QUALITY_STEP,
                te.MIN_JPEG_QUALITY,
            ],
        });
        if (!a || !a[0]?.result) throw new Error("Failed to process screenshot in content script");
        const s = a[0].result;
        return Q.setContext(e, s), s;
    }
}
const re = new te();
function oe(e, t, r) {
    const o = r.viewportWidth / r.screenshotWidth,
        n = r.viewportHeight / r.screenshotHeight;
    return [Math.round(e * o), Math.round(t * n)];
}
async function ne(e, t, r, o, n) {
    await chrome.scripting.executeScript({
        target: { tabId: e },
        func: (e, t, r, o) => {
            const n = document.elementFromPoint(r, o);
            if (n && n !== document.body && n !== document.documentElement) {
                const r = (e) => {
                    const t = window.getComputedStyle(e),
                        r = t.overflowY,
                        o = t.overflowX;
                    return (
                        ("auto" === r || "scroll" === r || "auto" === o || "scroll" === o) &&
                        (e.scrollHeight > e.clientHeight || e.scrollWidth > e.clientWidth)
                    );
                };
                let o = n;
                for (; o && !r(o); ) o = o.parentElement;
                if (o && r(o)) return void o.scrollBy({ left: e, top: t, behavior: "instant" });
            }
            window.scrollBy({ left: e, top: t, behavior: "instant" });
        },
        args: [o, n, t, r],
    });
}
const ie = {
    name: "computer",
    description:
        "Use a mouse and keyboard to interact with a web browser, and take screenshots. If you don't have a valid tab ID, use tabs_context first to get available tabs.\n* The screen's resolution is {self.display_width_px}x{self.display_height_px}.\n* Whenever you intend to click on an element like an icon, you should consult a screenshot to determine the coordinates of the element before moving the cursor.\n* If you tried clicking on a program or link but it failed to load, even after waiting, try adjusting your click location so that the tip of the cursor visually falls on the element that you want to click.\n* Make sure to click any buttons, links, icons, etc with the cursor tip in the center of the element. Don't click boxes on their edges unless asked.",
    parameters: {
        action: {
            type: "string",
            enum: [
                "left_click",
                "right_click",
                "type",
                "screenshot",
                "wait",
                "scroll",
                "key",
                "left_click_drag",
                "double_click",
                "triple_click",
                "zoom",
                "scroll_to",
                "hover",
            ],
            description:
                "The action to perform:\n* `left_click`: Click the left mouse button at the specified coordinates.\n* `right_click`: Click the right mouse button at the specified coordinates to open context menus.\n* `double_click`: Double-click the left mouse button at the specified coordinates.\n* `triple_click`: Triple-click the left mouse button at the specified coordinates.\n* `type`: Type a string of text.\n* `screenshot`: Take a screenshot of the screen.\n* `wait`: Wait for a specified number of seconds.\n* `scroll`: Scroll up, down, left, or right at the specified coordinates.\n* `key`: Press a specific keyboard key.\n* `left_click_drag`: Drag from start_coordinate to coordinate.\n* `zoom`: Take a screenshot of a specific region and scale it to fill the viewport.\n* `scroll_to`: Scroll an element into view using its element reference ID from read_page or find tools.\n* `hover`: Move the mouse cursor to the specified coordinates or element without clicking. Useful for revealing tooltips, dropdown menus, or triggering hover states.",
        },
        coordinate: {
            type: "array",
            items: { type: "number" },
            minItems: 2,
            maxItems: 2,
            description:
                "(x, y): The x (pixels from the left edge) and y (pixels from the top edge) coordinates. Required for `scroll` and `left_click_drag`. For click actions (left_click, right_click, double_click, triple_click), either `coordinate` or `ref` must be provided (not both).",
        },
        text: {
            type: "string",
            description:
                'The text to type (for `type` action) or the key(s) to press (for `key` action). For `key` action: Provide space-separated keys (e.g., "Backspace Backspace Delete"). Supports keyboard shortcuts using the platform\'s modifier key (use "cmd" on Mac, "ctrl" on Windows/Linux, e.g., "cmd+a" or "ctrl+a" for select all).',
        },
        duration: {
            type: "number",
            minimum: 0,
            maximum: 30,
            description: "The number of seconds to wait. Required for `wait`. Maximum 30 seconds.",
        },
        scroll_direction: {
            type: "string",
            enum: ["up", "down", "left", "right"],
            description: "The direction to scroll. Required for `scroll`.",
        },
        scroll_amount: {
            type: "number",
            minimum: 1,
            maximum: 10,
            description: "The number of scroll wheel ticks. Optional for `scroll`, defaults to 3.",
        },
        start_coordinate: {
            type: "array",
            items: { type: "number" },
            minItems: 2,
            maxItems: 2,
            description: "(x, y): The starting coordinates for `left_click_drag`.",
        },
        region: {
            type: "array",
            items: { type: "number" },
            minItems: 4,
            maxItems: 4,
            description:
                "(x0, y0, x1, y1): The rectangular region to capture for `zoom`. Coordinates are in pixels from the top-left corner of the viewport. Required for `zoom` action.",
        },
        repeat: {
            type: "number",
            minimum: 1,
            maximum: 100,
            description:
                "Number of times to repeat the key sequence. Only applicable for `key` action. Must be a positive integer between 1 and 100. Default is 1.",
        },
        ref: {
            type: "string",
            description:
                'Element reference ID from read_page or find tools (e.g., "ref_1", "ref_2"). Required for `scroll_to` action. Can be used as alternative to `coordinate` for click actions (left_click, right_click, double_click, triple_click).',
        },
        modifiers: {
            type: "string",
            description:
                'Modifier keys for click actions (left_click, right_click, double_click, triple_click). Supports: "ctrl", "shift", "alt", "cmd" (or "meta"), "win" (or "windows"). Can be combined with "+" (e.g., "ctrl+shift", "cmd+alt"). Optional.',
        },
        tabId: {
            type: "number",
            description:
                "Tab ID to execute the action on. Must be a tab in the current group. Use tabs_context first if you don't have a valid tab ID.",
        },
    },
    execute: async (e, t) => {
        try {
            const n = e || {};
            if (!n.action) throw new Error("Action parameter is required");
            if (!t?.tabId) throw new Error("No active tab found in context");
            const i = await K.getEffectiveTabId(n.tabId, t.tabId),
                a = await chrome.tabs.get(i);
            if (!a.id) throw new Error("Active tab has no ID");
            if (!["wait"].includes(n.action)) {
                const e = a.url;
                if (!e) throw new Error("No URL available for active tab");
                const s = (function (e) {
                        const t = {
                            screenshot: r.READ_PAGE_CONTENT,
                            scroll: r.READ_PAGE_CONTENT,
                            scroll_to: r.READ_PAGE_CONTENT,
                            zoom: r.READ_PAGE_CONTENT,
                            hover: r.READ_PAGE_CONTENT,
                            left_click: r.CLICK,
                            right_click: r.CLICK,
                            double_click: r.CLICK,
                            triple_click: r.CLICK,
                            left_click_drag: r.CLICK,
                            type: r.TYPE,
                            key: r.TYPE,
                        };
                        if (!t[e]) throw new Error(`Unsupported action: ${e}`);
                        return t[e];
                    })(n.action),
                    c = t?.toolUseId,
                    u = await t.permissionManager.checkPermission(e, c);
                if (!u.allowed) {
                    if (u.needsPrompt) {
                        const t = { type: "permission_required", tool: s, url: e, toolUseId: c };
                        if (
                            "left_click" === n.action ||
                            "right_click" === n.action ||
                            "double_click" === n.action ||
                            "triple_click" === n.action
                        )
                            try {
                                const e = await re.screenshot(i);
                                (t.actionData = { screenshot: `data:image/${e.format};base64,${e.base64}` }),
                                    n.coordinate && (t.actionData.coordinate = n.coordinate);
                            } catch (o) {
                                (t.actionData = {}), n.coordinate && (t.actionData.coordinate = n.coordinate);
                            }
                        else
                            "type" === n.action && n.text
                                ? (t.actionData = { text: n.text })
                                : "left_click_drag" === n.action &&
                                  n.start_coordinate &&
                                  n.coordinate &&
                                  (t.actionData = { start_coordinate: n.start_coordinate, coordinate: n.coordinate });
                        return t;
                    }
                    return { error: "Permission denied for this action on this domain" };
                }
            }
            const s = a.url;
            let c;
            switch (n.action) {
                case "left_click":
                case "right_click":
                    c = await se(i, n, 1, s);
                    break;
                case "type":
                    c = await (async function (e, t, r) {
                        if (!t.text) throw new Error("Text parameter is required for type action");
                        try {
                            const o = await W(e, r, "type action");
                            return o || (await re.type(e, t.text), { output: `Typed "${t.text}"` });
                        } catch (o) {
                            return { error: `Failed to type: ${o instanceof Error ? o.message : "Unknown error"}` };
                        }
                    })(i, n, s);
                    break;
                case "screenshot":
                    c = await ce(i);
                    break;
                case "wait":
                    c = await (async function (e) {
                        if (!e.duration || e.duration <= 0)
                            throw new Error("Duration parameter is required and must be positive");
                        if (e.duration > 30) throw new Error("Duration cannot exceed 30 seconds");
                        const t = Math.round(1e3 * e.duration);
                        return (
                            await new Promise((e) => setTimeout(e, t)),
                            { output: `Waited for ${e.duration} second${1 === e.duration ? "" : "s"}` }
                        );
                    })(n);
                    break;
                case "scroll":
                    c = await (async function (e, t, r) {
                        if (!t.coordinate || 2 !== t.coordinate.length)
                            throw new Error("Coordinate parameter is required for scroll action");
                        let [n, i] = t.coordinate;
                        const a = Q.getContext(e);
                        if (a) {
                            const [e, t] = oe(n, i, a);
                            (n = e), (i = t);
                        }
                        const s = t.scroll_direction || "down",
                            c = t.scroll_amount || 3;
                        try {
                            let t = 0,
                                a = 0;
                            const u = 100;
                            switch (s) {
                                case "up":
                                    a = -c * u;
                                    break;
                                case "down":
                                    a = c * u;
                                    break;
                                case "left":
                                    t = -c * u;
                                    break;
                                case "right":
                                    t = c * u;
                                    break;
                                default:
                                    throw new Error(`Invalid scroll direction: ${s}`);
                            }
                            const l = await ue(e),
                                d = await chrome.tabs.get(e);
                            if (d.active ?? !1)
                                try {
                                    const r = re.scrollWheel(e, n, i, t, a),
                                        o = new Promise((e, t) => {
                                            setTimeout(() => t(new Error("Scroll timeout")), 5e3);
                                        });
                                    await Promise.race([r, o]), await new Promise((e) => setTimeout(e, 200));
                                    const s = await ue(e);
                                    if (!(Math.abs(s.x - l.x) > 5 || Math.abs(s.y - l.y) > 5))
                                        throw new Error("CDP scroll ineffective");
                                } catch (o) {
                                    await ne(e, n, i, t, a), await new Promise((e) => setTimeout(e, 200));
                                }
                            else await ne(e, n, i, t, a), await new Promise((e) => setTimeout(e, 200));
                            const h = await (async function (e, t) {
                                try {
                                    const o = await chrome.tabs.get(e);
                                    if (!o?.url) return;
                                    if ((await t.checkPermission(o.url, void 0)).allowed)
                                        try {
                                            const t = await ce(e);
                                            return { base64Image: t.base64Image, imageFormat: t.imageFormat || "png" };
                                        } catch (r) {
                                            return;
                                        }
                                    return;
                                } catch (o) {
                                    return;
                                }
                            })(e, r);
                            return {
                                output: `Scrolled ${s} by ${c} ticks at (${n}, ${i})`,
                                ...(h && { base64Image: h.base64Image, imageFormat: h.imageFormat }),
                            };
                        } catch (o) {
                            return { error: `Error scrolling: ${o instanceof Error ? o.message : "Unknown error"}` };
                        }
                    })(i, n, t.permissionManager);
                    break;
                case "key":
                    c = await (async function (e, t, r) {
                        if (!t.text) throw new Error("Text parameter is required for key action");
                        const n = t.repeat ?? 1;
                        if (!Number.isInteger(n) || n < 1)
                            throw new Error("Repeat parameter must be a positive integer");
                        if (n > 100) throw new Error("Repeat parameter cannot exceed 100");
                        try {
                            const o = await W(e, r, "key action");
                            if (o) return o;
                            const i = t.text
                                .trim()
                                .split(/\s+/)
                                .filter((e) => e.length > 0);
                            if ((console.info({ keyInputs: i }), 1 === i.length)) {
                                const t = i[0].toLowerCase();
                                if (
                                    "cmd+r" === t ||
                                    "cmd+shift+r" === t ||
                                    "ctrl+r" === t ||
                                    "ctrl+shift+r" === t ||
                                    "f5" === t ||
                                    "ctrl+f5" === t ||
                                    "shift+f5" === t
                                ) {
                                    const r =
                                        "cmd+shift+r" === t ||
                                        "ctrl+shift+r" === t ||
                                        "ctrl+f5" === t ||
                                        "shift+f5" === t;
                                    await chrome.tabs.reload(e, { bypassCache: r });
                                    const o = r ? "hard reload" : "reload";
                                    return { output: `Executed ${i[0]} (${o} page)` };
                                }
                            }
                            for (let t = 0; t < n; t++)
                                for (const r of i)
                                    if (r.includes("+")) await re.pressKeyChord(e, r);
                                    else {
                                        const t = re.getKeyCode(r);
                                        t ? await re.pressKey(e, t) : await re.insertText(e, r);
                                    }
                            const a = n > 1 ? ` (repeated ${n} times)` : "";
                            return {
                                output: `Pressed ${i.length} key${1 === i.length ? "" : "s"}: ${i.join(" ")}${a}`,
                            };
                        } catch (o) {
                            return { error: `Error pressing key: ${o instanceof Error ? o.message : "Unknown error"}` };
                        }
                    })(i, n, s);
                    break;
                case "left_click_drag":
                    c = await (async function (e, t, r) {
                        if (!t.start_coordinate || 2 !== t.start_coordinate.length)
                            throw new Error("start_coordinate parameter is required for left_click_drag action");
                        if (!t.coordinate || 2 !== t.coordinate.length)
                            throw new Error(
                                "coordinate parameter (end position) is required for left_click_drag action"
                            );
                        let [n, i] = t.start_coordinate,
                            [a, s] = t.coordinate;
                        const c = Q.getContext(e);
                        if (c) {
                            const [e, t] = oe(n, i, c),
                                [r, o] = oe(a, s, c);
                            (n = e), (i = t), (a = r), (s = o);
                        }
                        try {
                            const t = await W(e, r, "drag action");
                            return (
                                t ||
                                (await re.dispatchMouseEvent(e, {
                                    type: "mouseMoved",
                                    x: n,
                                    y: i,
                                    button: "none",
                                    buttons: 0,
                                    modifiers: 0,
                                }),
                                await re.dispatchMouseEvent(e, {
                                    type: "mousePressed",
                                    x: n,
                                    y: i,
                                    button: "left",
                                    buttons: 1,
                                    clickCount: 1,
                                    modifiers: 0,
                                }),
                                await re.dispatchMouseEvent(e, {
                                    type: "mouseMoved",
                                    x: a,
                                    y: s,
                                    button: "left",
                                    buttons: 1,
                                    modifiers: 0,
                                }),
                                await re.dispatchMouseEvent(e, {
                                    type: "mouseReleased",
                                    x: a,
                                    y: s,
                                    button: "left",
                                    buttons: 0,
                                    clickCount: 1,
                                    modifiers: 0,
                                }),
                                { output: `Dragged from (${n}, ${i}) to (${a}, ${s})` })
                            );
                        } catch (o) {
                            return {
                                error: `Error performing drag: ${o instanceof Error ? o.message : "Unknown error"}`,
                            };
                        }
                    })(i, n, s);
                    break;
                case "double_click":
                    c = await se(i, n, 2, s);
                    break;
                case "triple_click":
                    c = await se(i, n, 3, s);
                    break;
                case "zoom":
                    c = await (async function (e, t) {
                        if (!t.region || 4 !== t.region.length)
                            throw new Error(
                                "Region parameter is required for zoom action and must be [x0, y0, x1, y1]"
                            );
                        let [r, n, i, a] = t.region;
                        if (r < 0 || n < 0 || i <= r || a <= n)
                            throw new Error(
                                "Invalid region coordinates: x0 and y0 must be non-negative, and x1 > x0, y1 > y0"
                            );
                        try {
                            const t = Q.getContext(e);
                            if (t) {
                                const [e, o] = oe(r, n, t),
                                    [s, c] = oe(i, a, t);
                                (r = e), (n = o), (i = s), (a = c);
                            }
                            const o = await chrome.scripting.executeScript({
                                target: { tabId: e },
                                func: () => ({ width: window.innerWidth, height: window.innerHeight }),
                            });
                            if (!o || !o[0]?.result) throw new Error("Failed to get viewport dimensions");
                            const { width: s, height: c } = o[0].result;
                            if (i > s || a > c)
                                throw new Error(
                                    `Region exceeds viewport boundaries (${s}x${c}). Please choose a region within the visible viewport.`
                                );
                            const u = i - r,
                                l = a - n,
                                d = await re.sendCommand(e, "Page.captureScreenshot", {
                                    format: "png",
                                    captureBeyondViewport: !1,
                                    fromSurface: !0,
                                    clip: { x: r, y: n, width: u, height: l, scale: 1 },
                                });
                            if (!d || !d.data) throw new Error("Failed to capture zoomed screenshot via CDP");
                            return {
                                output: `Successfully captured zoomed screenshot of region (${r},${n}) to (${i},${a}) - ${u}x${l} pixels`,
                                base64Image: d.data,
                                imageFormat: "png",
                            };
                        } catch (o) {
                            return {
                                error: `Error capturing zoomed screenshot: ${o instanceof Error ? o.message : "Unknown error"}`,
                            };
                        }
                    })(i, n);
                    break;
                case "scroll_to":
                    c = await (async function (e, t, r) {
                        if (!t.ref) throw new Error("ref parameter is required for scroll_to action");
                        try {
                            const o = await W(e, r, "scroll_to action");
                            if (o) return o;
                            const n = await ae(e, t.ref);
                            return n.success
                                ? { output: `Scrolled to element with reference: ${t.ref}` }
                                : { error: n.error };
                        } catch (o) {
                            return {
                                error: `Failed to scroll to element: ${o instanceof Error ? o.message : "Unknown error"}`,
                            };
                        }
                    })(i, n, s);
                    break;
                case "hover":
                    c = await (async function (e, t, r) {
                        let n, i;
                        if (t.ref) {
                            const r = await ae(e, t.ref);
                            if (!r.success) return { error: r.error };
                            [n, i] = r.coordinates;
                        } else {
                            if (!t.coordinate)
                                throw new Error("Either ref or coordinate parameter is required for hover action");
                            {
                                [n, i] = t.coordinate;
                                const r = Q.getContext(e);
                                if (r) {
                                    const [e, t] = oe(n, i, r);
                                    (n = e), (i = t);
                                }
                            }
                        }
                        try {
                            const o = await W(e, r, "hover action");
                            return (
                                o ||
                                (await re.dispatchMouseEvent(e, {
                                    type: "mouseMoved",
                                    x: n,
                                    y: i,
                                    button: "none",
                                    buttons: 0,
                                    modifiers: 0,
                                }),
                                t.ref
                                    ? { output: `Hovered over element ${t.ref}` }
                                    : {
                                          output: `Hovered at (${Math.round(t.coordinate[0])}, ${Math.round(t.coordinate[1])})`,
                                      })
                            );
                        } catch (o) {
                            return { error: `Error hovering: ${o instanceof Error ? o.message : "Unknown error"}` };
                        }
                    })(i, n, s);
                    break;
                default:
                    throw new Error(`Unsupported action: ${n.action}`);
            }
            const u = await K.getValidTabsWithMetadata(t.tabId);
            return {
                ...c,
                tabContext: { currentTabId: t.tabId, executedOnTabId: i, availableTabs: u, tabCount: u.length },
            };
        } catch (o) {
            return { error: `Failed to execute action: ${o instanceof Error ? o.message : "Unknown error"}` };
        }
    },
    toAnthropicSchema: async () => ({
        name: "computer",
        description:
            "Use a mouse and keyboard to interact with a web browser, and take screenshots. If you don't have a valid tab ID, use tabs_context first to get available tabs.\n* Whenever you intend to click on an element like an icon, you should consult a screenshot to determine the coordinates of the element before moving the cursor.\n* If you tried clicking on a program or link but it failed to load, even after waiting, try adjusting your click location so that the tip of the cursor visually falls on the element that you want to click.\n* Make sure to click any buttons, links, icons, etc with the cursor tip in the center of the element. Don't click boxes on their edges unless asked.",
        input_schema: {
            type: "object",
            properties: {
                action: {
                    type: "string",
                    enum: [
                        "left_click",
                        "right_click",
                        "type",
                        "screenshot",
                        "wait",
                        "scroll",
                        "key",
                        "left_click_drag",
                        "double_click",
                        "triple_click",
                        "zoom",
                        "scroll_to",
                        "hover",
                    ],
                    description:
                        "The action to perform:\n* `left_click`: Click the left mouse button at the specified coordinates.\n* `right_click`: Click the right mouse button at the specified coordinates to open context menus.\n* `double_click`: Double-click the left mouse button at the specified coordinates.\n* `triple_click`: Triple-click the left mouse button at the specified coordinates.\n* `type`: Type a string of text.\n* `screenshot`: Take a screenshot of the screen.\n* `wait`: Wait for a specified number of seconds.\n* `scroll`: Scroll up, down, left, or right at the specified coordinates.\n* `key`: Press a specific keyboard key.\n* `left_click_drag`: Drag from start_coordinate to coordinate.\n* `zoom`: Take a screenshot of a specific region for closer inspection.\n* `scroll_to`: Scroll an element into view using its element reference ID from read_page or find tools.\n* `hover`: Move the mouse cursor to the specified coordinates or element without clicking. Useful for revealing tooltips, dropdown menus, or triggering hover states.",
                },
                coordinate: {
                    type: "array",
                    items: { type: "number" },
                    minItems: 2,
                    maxItems: 2,
                    description:
                        "(x, y): The x (pixels from the left edge) and y (pixels from the top edge) coordinates. Required for `left_click`, `right_click`, `double_click`, `triple_click`, and `scroll`. For `left_click_drag`, this is the end position.",
                },
                text: {
                    type: "string",
                    description:
                        'The text to type (for `type` action) or the key(s) to press (for `key` action). For `key` action: Provide space-separated keys (e.g., "Backspace Backspace Delete"). Supports keyboard shortcuts using the platform\'s modifier key (use "cmd" on Mac, "ctrl" on Windows/Linux, e.g., "cmd+a" or "ctrl+a" for select all).',
                },
                duration: {
                    type: "number",
                    minimum: 0,
                    maximum: 30,
                    description: "The number of seconds to wait. Required for `wait`. Maximum 30 seconds.",
                },
                scroll_direction: {
                    type: "string",
                    enum: ["up", "down", "left", "right"],
                    description: "The direction to scroll. Required for `scroll`.",
                },
                scroll_amount: {
                    type: "number",
                    minimum: 1,
                    maximum: 10,
                    description: "The number of scroll wheel ticks. Optional for `scroll`, defaults to 3.",
                },
                start_coordinate: {
                    type: "array",
                    items: { type: "number" },
                    minItems: 2,
                    maxItems: 2,
                    description: "(x, y): The starting coordinates for `left_click_drag`.",
                },
                region: {
                    type: "array",
                    items: { type: "number" },
                    minItems: 4,
                    maxItems: 4,
                    description:
                        "(x0, y0, x1, y1): The rectangular region to capture for `zoom`. Coordinates define a rectangle from top-left (x0, y0) to bottom-right (x1, y1) in pixels from the viewport origin. Required for `zoom` action. Useful for inspecting small UI elements like icons, buttons, or text.",
                },
                repeat: {
                    type: "number",
                    minimum: 1,
                    maximum: 100,
                    description:
                        "Number of times to repeat the key sequence. Only applicable for `key` action. Must be a positive integer between 1 and 100. Default is 1. Useful for navigation tasks like pressing arrow keys multiple times.",
                },
                ref: {
                    type: "string",
                    description:
                        'Element reference ID from read_page or find tools (e.g., "ref_1", "ref_2"). Required for `scroll_to` action. Can be used as alternative to `coordinate` for click actions.',
                },
                modifiers: {
                    type: "string",
                    description:
                        'Modifier keys for click actions. Supports: "ctrl", "shift", "alt", "cmd" (or "meta"), "win" (or "windows"). Can be combined with "+" (e.g., "ctrl+shift", "cmd+alt"). Optional.',
                },
                tabId: {
                    type: "number",
                    description:
                        "Tab ID to execute the action on. Must be a tab in the current group. Use tabs_context first if you don't have a valid tab ID.",
                },
            },
            required: ["action", "tabId"],
        },
    }),
};
async function ae(e, t) {
    try {
        const r = await chrome.scripting.executeScript({
            target: { tabId: e },
            func: (e) => {
                try {
                    let t = null;
                    if (window.__claudeElementMap && window.__claudeElementMap[e]) {
                        (t = window.__claudeElementMap[e].deref() || null),
                            (t && document.contains(t)) || (delete window.__claudeElementMap[e], (t = null));
                    }
                    if (!t)
                        return {
                            success: !1,
                            error: `No element found with reference: "${e}". The element may have been removed from the page.`,
                        };
                    t.scrollIntoView({ behavior: "instant", block: "center", inline: "center" }),
                        t instanceof HTMLElement && t.offsetHeight;
                    const r = t.getBoundingClientRect(),
                        o = r.left + r.width / 2;
                    return { success: !0, coordinates: [o, r.top + r.height / 2] };
                } catch (t) {
                    return {
                        success: !1,
                        error: `Error getting element coordinates: ${t instanceof Error ? t.message : "Unknown error"}`,
                    };
                }
            },
            args: [t],
        });
        return r && 0 !== r.length
            ? r[0].result
            : { success: !1, error: "Failed to execute script to get element coordinates" };
    } catch (r) {
        return {
            success: !1,
            error: `Failed to get element coordinates from ref: ${r instanceof Error ? r.message : "Unknown error"}`,
        };
    }
}
async function se(e, t, r = 1, o) {
    let n, i;
    if (t.ref) {
        const r = await ae(e, t.ref);
        if (!r.success) return { error: r.error };
        [n, i] = r.coordinates;
    } else {
        if (!t.coordinate) throw new Error("Either ref or coordinate parameter is required for click action");
        {
            [n, i] = t.coordinate;
            const r = Q.getContext(e);
            if (r) {
                const [e, t] = oe(n, i, r);
                (n = e), (i = t);
            }
        }
    }
    const a = "right_click" === t.action ? "right" : "left";
    let s = 0;
    if (t.modifiers) {
        s = (function (e) {
            const t = { alt: 1, ctrl: 2, control: 2, meta: 4, cmd: 4, command: 4, win: 4, windows: 4, shift: 8 };
            let r = 0;
            for (const o of e) r |= t[o] || 0;
            return r;
        })(
            (function (e) {
                const t = e.toLowerCase().split("+"),
                    r = ["ctrl", "control", "alt", "shift", "cmd", "meta", "command", "win", "windows"];
                return t.filter((e) => r.includes(e.trim()));
            })(t.modifiers)
        );
    }
    try {
        const c = await W(e, o, "click action");
        if (c) return c;
        await re.click(e, n, i, a, r, s);
        const u = 1 === r ? "Clicked" : 2 === r ? "Double-clicked" : "Triple-clicked";
        return t.ref
            ? { output: `${u} on element ${t.ref}` }
            : { output: `${u} at (${Math.round(t.coordinate[0])}, ${Math.round(t.coordinate[1])})` };
    } catch (c) {
        return { error: `Error clicking: ${c instanceof Error ? c.message : "Unknown error"}` };
    }
}
async function ce(e) {
    try {
        const t = await re.screenshot(e),
            r = v();
        return (
            console.info(`[Computer Tool] Generated screenshot ID: ${r}`),
            console.info(`[Computer Tool] Screenshot dimensions: ${t.width}x${t.height}`),
            {
                output: `Successfully captured screenshot (${t.width}x${t.height}, ${t.format}) - ID: ${r}`,
                base64Image: t.base64,
                imageFormat: t.format,
                imageId: r,
            }
        );
    } catch (t) {
        return { error: `Error capturing screenshot: ${t instanceof Error ? t.message : "Unknown error"}` };
    }
}
async function ue(e) {
    const t = await chrome.scripting.executeScript({
        target: { tabId: e },
        func: () => ({
            x: window.pageXOffset || document.documentElement.scrollLeft,
            y: window.pageYOffset || document.documentElement.scrollTop,
        }),
    });
    if (!t || !t[0]?.result) throw new Error("Failed to get scroll position");
    return t[0].result;
}
const le = {
        name: "read_page",
        description:
            "Get an accessibility tree representation of elements on the page. By default returns all elements including non-visible ones. Can optionally filter for only interactive elements, limit tree depth, or focus on a specific element. Returns a structured tree that represents how screen readers see the page content. If you don't have a valid tab ID, use tabs_context first to get available tabs. Output is limited to 50000 characters - if exceeded, specify a depth limit or ref_id to focus on a specific element.",
        parameters: {
            filter: {
                type: "string",
                enum: ["interactive", "all"],
                description:
                    'Filter elements: "interactive" for buttons/links/inputs only, "all" for all elements including non-visible ones (default: all elements)',
            },
            tabId: {
                type: "number",
                description:
                    "Tab ID to read from. Must be a tab in the current group. Use tabs_context first if you don't have a valid tab ID.",
            },
            depth: {
                type: "number",
                description:
                    "Maximum depth of the tree to traverse (default: 15). Use a smaller depth if output is too large.",
            },
            ref_id: {
                type: "string",
                description:
                    "Reference ID of a parent element to read. Will return the specified element and all its children. Use this to focus on a specific part of the page when output is too large.",
            },
        },
        execute: async (e, t) => {
            const { filter: o, tabId: n, depth: i, ref_id: a } = e || {};
            if (!t?.tabId) throw new Error("No active tab found");
            const s = await K.getEffectiveTabId(n, t.tabId),
                c = await chrome.tabs.get(s);
            if (!c.id) throw new Error("Active tab has no ID");
            const u = c.url;
            if (!u) throw new Error("No URL available for active tab");
            const l = t?.toolUseId,
                d = await t.permissionManager.checkPermission(u, l);
            if (!d.allowed) {
                if (d.needsPrompt) {
                    return { type: "permission_required", tool: r.READ_PAGE_CONTENT, url: u, toolUseId: l };
                }
                return { error: "Permission denied for reading pages on this domain" };
            }
            await K.hideIndicatorForToolUse(s), await new Promise((e) => setTimeout(e, 50));
            try {
                const e = await chrome.scripting.executeScript({
                    target: { tabId: c.id },
                    func: (e, t, r) => {
                        if ("function" != typeof window.__generateAccessibilityTree)
                            throw new Error("Accessibility tree function not found. Please refresh the page.");
                        return window.__generateAccessibilityTree(e, t, r);
                    },
                    args: [o || null, i ?? null, a ?? null],
                });
                if (!e || 0 === e.length) throw new Error("No results returned from page script");
                if ("error" in e[0] && e[0].error)
                    throw new Error(`Script execution failed: ${e[0].error.message || "Unknown error"}`);
                if (!e[0].result) throw new Error("Page script returned empty result");
                const r = e[0].result;
                if (r.error) return { error: r.error };
                if (!e[0].result) throw new Error("Page script returned empty result");
                const n = `Viewport: ${r.viewport.width}x${r.viewport.height}`,
                    u = await K.getValidTabsWithMetadata(t.tabId);
                return {
                    output: `${r.pageContent}\n\n${n}`,
                    tabContext: { currentTabId: t.tabId, executedOnTabId: s, availableTabs: u, tabCount: u.length },
                };
            } catch (h) {
                return { error: `Failed to read page: ${h instanceof Error ? h.message : "Unknown error"}` };
            } finally {
                await K.restoreIndicatorAfterToolUse(s);
            }
        },
        toAnthropicSchema: async () => ({
            name: "read_page",
            description:
                "Get an accessibility tree representation of elements on the page. By default returns all elements including non-visible ones. Output is limited to 50000 characters. If the output exceeds this limit, you will receive an error asking you to specify a smaller depth or focus on a specific element using ref_id. Optionally filter for only interactive elements. If you don't have a valid tab ID, use tabs_context first to get available tabs.",
            input_schema: {
                type: "object",
                properties: {
                    filter: {
                        type: "string",
                        enum: ["interactive", "all"],
                        description:
                            'Filter elements: "interactive" for buttons/links/inputs only, "all" for all elements including non-visible ones (default: all elements)',
                    },
                    tabId: {
                        type: "number",
                        description:
                            "Tab ID to read from. Must be a tab in the current group. Use tabs_context first if you don't have a valid tab ID.",
                    },
                    depth: {
                        type: "number",
                        description:
                            "Maximum depth of the tree to traverse (default: 15). Use a smaller depth if output is too large.",
                    },
                    ref_id: {
                        type: "string",
                        description:
                            "Reference ID of a parent element to read. Will return the specified element and all its children. Use this to focus on a specific part of the page when output is too large.",
                    },
                },
                required: ["tabId"],
            },
        }),
    },
    de = {
        name: "form_input",
        description:
            "Set values in form elements using element reference ID from the read_page or find tools. If you don't have a valid tab ID, use tabs_context first to get available tabs.",
        parameters: {
            ref: {
                type: "string",
                description: 'Element reference ID from the read_page or find tools (e.g., "ref_1", "ref_2")',
            },
            value: {
                type: ["string", "boolean", "number"],
                description:
                    "The value to set. For checkboxes use boolean, for selects use option value or text, for other inputs use appropriate string/number",
            },
            tabId: {
                type: "number",
                description:
                    "Tab ID to set form value in. Must be a tab in the current group. Use tabs_context first if you don't have a valid tab ID.",
            },
        },
        execute: async (e, t) => {
            try {
                const o = e;
                if (!o?.ref) throw new Error("ref parameter is required");
                if (void 0 === o.value || null === o.value) throw new Error("Value parameter is required");
                if (!t?.tabId) throw new Error("No active tab found");
                const n = await K.getEffectiveTabId(o.tabId, t.tabId),
                    i = await chrome.tabs.get(n);
                if (!i.id) throw new Error("Active tab has no ID");
                const a = i.url;
                if (!a) throw new Error("No URL available for active tab");
                const s = t?.toolUseId,
                    c = await t.permissionManager.checkPermission(a, s);
                if (!c.allowed) {
                    if (c.needsPrompt) {
                        return {
                            type: "permission_required",
                            tool: r.TYPE,
                            url: a,
                            toolUseId: s,
                            actionData: { ref: o.ref, value: o.value },
                        };
                    }
                    return { error: "Permission denied for form input on this domain" };
                }
                const u = i.url;
                if (!u) return { error: "Unable to get original URL for security check" };
                const l = await W(i.id, u, "form input action");
                if (l) return l;
                const d = await chrome.scripting.executeScript({
                    target: { tabId: i.id },
                    func: (e, t) => {
                        try {
                            let r = null;
                            if (window.__claudeElementMap && window.__claudeElementMap[e]) {
                                (r = window.__claudeElementMap[e].deref() || null),
                                    (r && document.contains(r)) || (delete window.__claudeElementMap[e], (r = null));
                            }
                            if (!r)
                                return {
                                    error: `No element found with reference: "${e}". The element may have been removed from the page.`,
                                };
                            if (
                                (r.scrollIntoView({ behavior: "smooth", block: "center" }),
                                r instanceof HTMLSelectElement)
                            ) {
                                const e = r.value,
                                    o = Array.from(r.options);
                                let n = !1;
                                const i = String(t);
                                for (let t = 0; t < o.length; t++)
                                    if (o[t].value === i || o[t].text === i) {
                                        (r.selectedIndex = t), (n = !0);
                                        break;
                                    }
                                return n
                                    ? (r.focus(),
                                      r.dispatchEvent(new Event("change", { bubbles: !0 })),
                                      r.dispatchEvent(new Event("input", { bubbles: !0 })),
                                      { output: `Selected option "${i}" in dropdown (previous: "${e}")` })
                                    : {
                                          error: `Option "${i}" not found. Available options: ${o.map((e) => `"${e.text}" (value: "${e.value}")`).join(", ")}`,
                                      };
                            }
                            if (r instanceof HTMLInputElement && "checkbox" === r.type) {
                                const e = r.checked;
                                return "boolean" != typeof t
                                    ? { error: "Checkbox requires a boolean value (true/false)" }
                                    : ((r.checked = t),
                                      r.focus(),
                                      r.dispatchEvent(new Event("change", { bubbles: !0 })),
                                      r.dispatchEvent(new Event("input", { bubbles: !0 })),
                                      { output: `Checkbox ${r.checked ? "checked" : "unchecked"} (previous: ${e})` });
                            }
                            if (r instanceof HTMLInputElement && "radio" === r.type) {
                                const t = r.checked,
                                    o = r.name;
                                return (
                                    (r.checked = !0),
                                    r.focus(),
                                    r.dispatchEvent(new Event("change", { bubbles: !0 })),
                                    r.dispatchEvent(new Event("input", { bubbles: !0 })),
                                    {
                                        success: !0,
                                        action: "form_input",
                                        ref: e,
                                        element_type: "radio",
                                        previous_value: t,
                                        new_value: r.checked,
                                        message: "Radio button selected" + (o ? ` in group "${o}"` : ""),
                                    }
                                );
                            }
                            if (
                                r instanceof HTMLInputElement &&
                                ("date" === r.type ||
                                    "time" === r.type ||
                                    "datetime-local" === r.type ||
                                    "month" === r.type ||
                                    "week" === r.type)
                            ) {
                                const e = r.value;
                                return (
                                    (r.value = String(t)),
                                    r.focus(),
                                    r.dispatchEvent(new Event("change", { bubbles: !0 })),
                                    r.dispatchEvent(new Event("input", { bubbles: !0 })),
                                    { output: `Set ${r.type} to "${r.value}" (previous: ${e})` }
                                );
                            }
                            if (r instanceof HTMLInputElement && "range" === r.type) {
                                const o = r.value,
                                    n = Number(t);
                                return isNaN(n)
                                    ? { error: "Range input requires a numeric value" }
                                    : ((r.value = String(n)),
                                      r.focus(),
                                      r.dispatchEvent(new Event("change", { bubbles: !0 })),
                                      r.dispatchEvent(new Event("input", { bubbles: !0 })),
                                      {
                                          success: !0,
                                          action: "form_input",
                                          ref: e,
                                          element_type: "range",
                                          previous_value: o,
                                          new_value: r.value,
                                          message: `Set range to ${r.value} (min: ${r.min}, max: ${r.max})`,
                                      });
                            }
                            if (r instanceof HTMLInputElement && "number" === r.type) {
                                const e = r.value,
                                    o = Number(t);
                                return isNaN(o) && "" !== t
                                    ? { error: "Number input requires a numeric value" }
                                    : ((r.value = String(t)),
                                      r.focus(),
                                      r.dispatchEvent(new Event("change", { bubbles: !0 })),
                                      r.dispatchEvent(new Event("input", { bubbles: !0 })),
                                      { output: `Set number input to ${r.value} (previous: ${e})` });
                            }
                            if (r instanceof HTMLInputElement || r instanceof HTMLTextAreaElement) {
                                const e = r.value;
                                (r.value = String(t)), r.focus();
                                (r instanceof HTMLTextAreaElement ||
                                    (r instanceof HTMLInputElement &&
                                        ["text", "search", "url", "tel", "password"].includes(r.type))) &&
                                    r.setSelectionRange(r.value.length, r.value.length),
                                    r.dispatchEvent(new Event("change", { bubbles: !0 })),
                                    r.dispatchEvent(new Event("input", { bubbles: !0 }));
                                return {
                                    output: `Set ${r instanceof HTMLTextAreaElement ? "textarea" : r.type || "text"} value to "${r.value}" (previous: "${e}")`,
                                };
                            }
                            return { error: `Element type "${r.tagName}" is not a supported form input` };
                        } catch (r) {
                            return {
                                error: `Error setting form value: ${r instanceof Error ? r.message : "Unknown error"}`,
                            };
                        }
                    },
                    args: [o.ref, o.value],
                });
                if (!d || 0 === d.length) throw new Error("Failed to execute form input");
                const h = await K.getValidTabsWithMetadata(t.tabId);
                return {
                    ...d[0].result,
                    tabContext: { currentTabId: t.tabId, executedOnTabId: n, availableTabs: h, tabCount: h.length },
                };
            } catch (o) {
                return { error: `Failed to execute form input: ${o instanceof Error ? o.message : "Unknown error"}` };
            }
        },
        toAnthropicSchema: async () => ({
            name: "form_input",
            description:
                "Set values in form elements using element reference ID from the read_page tool. If you don't have a valid tab ID, use tabs_context first to get available tabs.",
            input_schema: {
                type: "object",
                properties: {
                    ref: {
                        type: "string",
                        description: 'Element reference ID from the read_page tool (e.g., "ref_1", "ref_2")',
                    },
                    value: {
                        type: ["string", "boolean", "number"],
                        description:
                            "The value to set. For checkboxes use boolean, for selects use option value or text, for other inputs use appropriate string/number",
                    },
                    tabId: {
                        type: "number",
                        description:
                            "Tab ID to set form value in. Must be a tab in the current group. Use tabs_context first if you don't have a valid tab ID.",
                    },
                },
                required: ["ref", "value", "tabId"],
            },
        }),
    },
    he = {
        name: "get_page_text",
        description:
            "Extract raw text content from the page, prioritizing article content. Ideal for reading articles, blog posts, or other text-heavy pages. Returns plain text without HTML formatting. If you don't have a valid tab ID, use tabs_context first to get available tabs.",
        parameters: {
            tabId: {
                type: "number",
                description:
                    "Tab ID to extract text from. Must be a tab in the current group. Use tabs_context first if you don't have a valid tab ID.",
            },
        },
        execute: async (e, t) => {
            const { tabId: o } = e || {};
            if (!t?.tabId) throw new Error("No active tab found");
            const n = await K.getEffectiveTabId(o, t.tabId),
                i = (await chrome.tabs.get(n)).url;
            if (!i) throw new Error("No URL available for active tab");
            const a = t?.toolUseId,
                s = await t.permissionManager.checkPermission(i, a);
            if (!s.allowed) {
                if (s.needsPrompt) {
                    return { type: "permission_required", tool: r.READ_PAGE_CONTENT, url: i, toolUseId: a };
                }
                return { error: "Permission denied for reading page content on this domain" };
            }
            await K.hideIndicatorForToolUse(n), await new Promise((e) => setTimeout(e, 50));
            try {
                const e = await chrome.scripting.executeScript({
                    target: { tabId: n },
                    func: () =>
                        (function () {
                            const e = [
                                "article",
                                "main",
                                '[class*="articleBody"]',
                                '[class*="article-body"]',
                                '[class*="post-content"]',
                                '[class*="entry-content"]',
                                '[class*="content-body"]',
                                '[role="main"]',
                                ".content",
                                "#content",
                            ];
                            let t = null;
                            for (const o of e) {
                                const e = document.querySelectorAll(o);
                                if (e.length > 0) {
                                    let r = e[0],
                                        o = 0;
                                    e.forEach((e) => {
                                        const t = e.textContent?.length || 0;
                                        t > o && ((o = t), (r = e));
                                    }),
                                        (t = r);
                                    break;
                                }
                            }
                            if (!t) {
                                const e = 5e4;
                                if ((document.body.textContent || "").length > e)
                                    return {
                                        text: "",
                                        source: "none",
                                        title: document.title,
                                        url: window.location.href,
                                        error: "No semantic content element found and page body is too large (likely contains CSS/scripts). Try using read_page_content (screenshot) instead.",
                                    };
                                t = document.body;
                            }
                            const r = (t.textContent || "")
                                .replace(/\s+/g, " ")
                                .replace(/\n{3,}/g, "\n\n")
                                .trim();
                            return !r || r.length < 10
                                ? {
                                      text: "",
                                      source: "none",
                                      title: document.title,
                                      url: window.location.href,
                                      error: "No text content found. Page may contain only images, videos, or canvas-based content.",
                                  }
                                : {
                                      text: r,
                                      source: t.tagName.toLowerCase(),
                                      title: document.title,
                                      url: window.location.href,
                                  };
                        })(),
                });
                if (!e || 0 === e.length)
                    throw new Error(
                        "No main text content found. The content might be visual content only, or rendered in a canvas element."
                    );
                if ("error" in e[0] && e[0].error)
                    throw new Error(`Script execution failed: ${e[0].error.message || "Unknown error"}`);
                if (!e[0].result) throw new Error("Page script returned empty result");
                const r = e[0].result,
                    o = await K.getValidTabsWithMetadata(t.tabId);
                return r.error
                    ? {
                          error: r.error,
                          tabContext: {
                              currentTabId: t.tabId,
                              executedOnTabId: n,
                              availableTabs: o,
                              tabCount: o.length,
                          },
                      }
                    : {
                          output: `Title: ${r.title}\nURL: ${r.url}\nSource element: <${r.source}>\n---\n${r.text}`,
                          tabContext: {
                              currentTabId: t.tabId,
                              executedOnTabId: n,
                              availableTabs: o,
                              tabCount: o.length,
                          },
                      };
            } catch (c) {
                return { error: `Failed to extract page text: ${c instanceof Error ? c.message : "Unknown error"}` };
            } finally {
                await K.restoreIndicatorAfterToolUse(n);
            }
        },
        toAnthropicSchema: async () => ({
            name: "get_page_text",
            description:
                "Extract raw text content from the page, prioritizing article content. Ideal for reading articles, blog posts, or other text-heavy pages. Returns plain text without HTML formatting. If you don't have a valid tab ID, use tabs_context first to get available tabs.",
            input_schema: {
                type: "object",
                properties: {
                    tabId: {
                        type: "number",
                        description:
                            "Tab ID to extract text from. Must be a tab in the current group. Use tabs_context first if you don't have a valid tab ID.",
                    },
                },
                required: ["tabId"],
            },
        }),
    },
    pe = {
        name: "find",
        description:
            'Find elements on the page using natural language. Can search for elements by their purpose (e.g., "search bar", "login button") or by text content (e.g., "organic mango product"). Returns up to 20 matching elements with references that can be used with other tools. If more than 20 matches exist, you\'ll be notified to use a more specific query. If you don\'t have a valid tab ID, use tabs_context first to get available tabs.',
        parameters: {
            query: {
                type: "string",
                description:
                    'Natural language description of what to find (e.g., "search bar", "add to cart button", "product title containing organic")',
                required: !0,
            },
            tabId: {
                type: "number",
                description:
                    "Tab ID to search in. Must be a tab in the current group. Use tabs_context first if you don't have a valid tab ID.",
            },
        },
        execute: async (e, t) => {
            try {
                const { query: o, tabId: n } = e;
                if (!o) throw new Error("Query parameter is required");
                if (!t?.tabId) throw new Error("No active tab found");
                const i = await K.getEffectiveTabId(n, t.tabId),
                    a = await chrome.tabs.get(i);
                if (!a.id) throw new Error("Active tab has no ID");
                const s = a.url;
                if (!s) throw new Error("No URL available for active tab");
                const c = t?.toolUseId,
                    u = await t.permissionManager.checkPermission(s, c);
                if (!u.allowed) {
                    if (u.needsPrompt) {
                        return { type: "permission_required", tool: r.READ_PAGE_CONTENT, url: s, toolUseId: c };
                    }
                    return { error: "Permission denied for reading pages on this domain" };
                }
                const l = await chrome.scripting.executeScript({
                    target: { tabId: a.id },
                    func: () => {
                        if ("function" != typeof window.__generateAccessibilityTree)
                            throw new Error("Accessibility tree function not found. Please refresh the page.");
                        return window.__generateAccessibilityTree("all");
                    },
                    args: [],
                });
                if (!l || 0 === l.length) throw new Error("No results returned from page script");
                if ("error" in l[0] && l[0].error)
                    throw new Error(`Script execution failed: ${l[0].error.message || "Unknown error"}`);
                if (!l[0].result) throw new Error("Page script returned empty result");
                const d = l[0].result,
                    h = t?.createAnthropicMessage;
                if (!h) throw new Error("Anthropic client not available. Please check your API configuration.");
                d.pageContent.length;
                const p = await h(
                    {
                        maxTokens: 800,
                        modelClass: "small_fast",
                        messages: [
                            {
                                role: "user",
                                content: `You are helping find elements on a web page. The user wants to find: "${o}"\n\nHere is the accessibility tree of the page:\n${d.pageContent}\n\nFind ALL elements that match the user's query. Return up to 20 most relevant matches, ordered by relevance.\n\nReturn your findings in this exact format (one line per matching element):\n\nFOUND: <total_number_of_matching_elements>\nSHOWING: <number_shown_up_to_20>\n---\nref_X | role | name | type | reason why this matches\nref_Y | role | name | type | reason why this matches\n...\n\nIf there are more than 20 matches, add this line at the end:\nMORE: Use a more specific query to see additional results\n\nIf no matching elements are found, return only:\nFOUND: 0\nERROR: explanation of why no elements were found`,
                            },
                        ],
                    },
                    "sampling_find_tool"
                );
                p.content;
                const f = p.content[0];
                if ("text" !== f.type) throw new Error("Unexpected response type from API");
                const m = f.text
                    .trim()
                    .split("\n")
                    .map((e) => e.trim())
                    .filter((e) => e);
                let g = 0;
                const b = [];
                let w,
                    y = !1;
                for (const e of m)
                    if (e.startsWith("FOUND:")) g = parseInt(e.split(":")[1].trim()) || 0;
                    else if (e.startsWith("SHOWING:"));
                    else if (e.startsWith("ERROR:")) w = e.substring(6).trim();
                    else if (e.startsWith("MORE:")) y = !0;
                    else if (e.includes("|") && e.startsWith("ref_")) {
                        const t = e.split("|").map((e) => e.trim());
                        t.length >= 4 &&
                            b.push({
                                ref: t[0],
                                role: t[1],
                                name: t[2],
                                type: t[3] || void 0,
                                description: t[4] || void 0,
                            });
                    }
                if (0 === g || 0 === b.length) return { error: w || "No matching elements found" };
                let v = `Found ${g} matching element${1 === g ? "" : "s"}`;
                y && (v += ` (showing first ${b.length}, use a more specific query to narrow results)`);
                const I = b
                    .map(
                        (e) =>
                            `- ${e.ref}: ${e.role}${e.name ? ` "${e.name}"` : ""}${e.type ? ` (${e.type})` : ""}${e.description ? ` - ${e.description}` : ""}`
                    )
                    .join("\n");
                b.length;
                const k = await K.getValidTabsWithMetadata(t.tabId);
                return {
                    output: `${v}\n\n${I}`,
                    tabContext: { currentTabId: t.tabId, executedOnTabId: i, availableTabs: k, tabCount: k.length },
                };
            } catch (o) {
                return { error: `Failed to find element: ${o instanceof Error ? o.message : "Unknown error"}` };
            }
        },
        toAnthropicSchema: async () => ({
            name: "find",
            description:
                'Find elements on the page using natural language. Can search for elements by their purpose (e.g., "search bar", "login button") or by text content (e.g., "organic mango product"). Returns up to 20 matching elements with references that can be used with other tools. If more than 20 matches exist, you\'ll be notified to use a more specific query. If you don\'t have a valid tab ID, use tabs_context first to get available tabs.',
            input_schema: {
                type: "object",
                properties: {
                    query: {
                        type: "string",
                        description:
                            'Natural language description of what to find (e.g., "search bar", "add to cart button", "product title containing organic")',
                    },
                    tabId: {
                        type: "number",
                        description:
                            "Tab ID to search in. Must be a tab in the current group. Use tabs_context first if you don't have a valid tab ID.",
                    },
                },
                required: ["query", "tabId"],
            },
        }),
    },
    fe = "mcp-native-session";
const me = {
        name: "tabs_context",
        description: "Get context information about all tabs in the current tab group",
        parameters: {},
        execute: async (e, t) => {
            try {
                if (!t?.tabId) throw new Error("No active tab found");
                const e = t.sessionId === fe,
                    r = await K.getValidTabsWithMetadata(t.tabId),
                    o = { currentTabId: t.tabId, availableTabs: r, tabCount: r.length };
                let n;
                e &&
                    (n = await (async function (e) {
                        try {
                            const t = await chrome.tabs.get(e);
                            if (t.groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE) return t.groupId;
                        } catch (t) {}
                    })(t.tabId));
                const i = U(r, n);
                return void 0 !== n ? { output: i, tabContext: { ...o, tabGroupId: n } } : { output: i, tabContext: o };
            } catch (r) {
                return { error: `Failed to query tabs: ${r instanceof Error ? r.message : "Unknown error"}` };
            }
        },
        toAnthropicSchema: async () => ({
            name: "tabs_context",
            description: "Get context information about all tabs in the current tab group",
            input_schema: { type: "object", properties: {}, required: [] },
        }),
    },
    ge = {
        name: "tabs_create",
        description: "Creates a new empty tab in the current tab group",
        parameters: {},
        execute: async (e, t) => {
            try {
                if (!t?.tabId) throw new Error("No active tab found");
                const e = await chrome.tabs.get(t.tabId),
                    r = await chrome.tabs.create({ url: "chrome://newtab", active: !1 });
                if (!r.id) throw new Error("Failed to create tab - no tab ID returned");
                e.groupId &&
                    e.groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE &&
                    (await chrome.tabs.group({ tabIds: r.id, groupId: e.groupId }));
                const o = await K.getValidTabsWithMetadata(t.tabId);
                return {
                    output: `Created new tab. Tab ID: ${r.id}`,
                    tabContext: { currentTabId: t.tabId, executedOnTabId: r.id, availableTabs: o, tabCount: o.length },
                };
            } catch (r) {
                return { error: `Failed to create tab: ${r instanceof Error ? r.message : "Unknown error"}` };
            }
        },
        toAnthropicSchema: async () => ({
            name: "tabs_create",
            description: "Creates a new empty tab in the current tab group",
            input_schema: { type: "object", properties: {}, required: [] },
        }),
    };
function be(e, t) {
    return "follow_a_plan" === e && !t;
}
function we() {
    return "<system-reminder>You are in planning mode. Before executing any tools, you must first present a plan to the user using the update_plan tool. The plan should include: domains (list of domains you will visit) and approach (high-level steps you will take).</system-reminder>";
}
async function ye(e, t) {
    if (!e || 0 === e.length) return [];
    const { approved: r, filtered: o } = await (async function (e) {
        const t = [],
            r = [];
        for (const n of e)
            try {
                const e = n.startsWith("http") ? n : `https://${n}`,
                    o = await j.getCategory(e);
                !o || ("category1" !== o && "category2" !== o && "category_org_blocked" !== o) ? t.push(n) : r.push(n);
            } catch (o) {
                t.push(n);
            }
        return { approved: t, filtered: r };
    })(e);
    return o.length, t.setTurnApprovedDomains(r), r;
}
const ve = {
    type: "object",
    properties: {
        domains: {
            type: "array",
            items: { type: "string" },
            description:
                "List of domains you will visit (e.g., ['github.com', 'stackoverflow.com']). These domains will be approved for the session when the user accepts the plan.",
        },
        approach: {
            type: "array",
            items: { type: "string" },
            description:
                "High-level description of what you will do. Focus on outcomes and key actions, not implementation details. Be concise - aim for 3-7 items.",
        },
    },
    required: ["domains", "approach"],
};
const Ie = {
        name: "update_plan",
        description:
            "Present a plan to the user for approval before taking actions. The user will see the domains you intend to visit and your approach. Once approved, you can proceed with actions on the approved domains without additional permission prompts.",
        parameters: ve,
        async execute(e, t) {
            const o = (function (e) {
                const t = e,
                    r = {};
                return (
                    (t.domains && Array.isArray(t.domains)) || (r.domains = "Required field missing or not an array"),
                    (t.approach && Array.isArray(t.approach)) ||
                        (r.approach = "Required field missing or not an array"),
                    Object.keys(r).length > 0
                        ? {
                              error: {
                                  type: "validation_error",
                                  message: "Invalid plan format. Both 'domains' and 'approach' are required arrays.",
                                  fields: r,
                              },
                          }
                        : null
                );
            })(e);
            if (o) return { error: JSON.stringify(o.error) };
            const { domains: n, approach: i } = e,
                a = await (async function (e) {
                    const t = [];
                    for (const o of e)
                        try {
                            const e = o.startsWith("http") ? o : `https://${o}`,
                                r = await j.getCategory(e);
                            t.push({ domain: o, category: r });
                        } catch (r) {
                            t.push({ domain: o });
                        }
                    return t;
                })(n);
            return {
                type: "permission_required",
                tool: r.PLAN_APPROVAL,
                url: "",
                toolUseId: t?.toolUseId,
                actionData: { plan: { domains: a, approach: i } },
            };
        },
        setPromptsConfig(e) {
            if ((e.toolDescription && (this.description = e.toolDescription), e.inputPropertyDescriptions)) {
                const t = ve.properties;
                e.inputPropertyDescriptions.domains && (t.domains.description = e.inputPropertyDescriptions.domains),
                    e.inputPropertyDescriptions.approach &&
                        (t.approach.description = e.inputPropertyDescriptions.approach);
            }
        },
        toAnthropicSchema() {
            return { type: "custom", name: this.name, description: this.description, input_schema: ve };
        },
    },
    ke = {
        name: "upload_image",
        description:
            "Upload a previously captured screenshot or user-uploaded image to a file input or drag & drop target. Supports two approaches: (1) ref - for targeting specific elements, especially hidden file inputs, (2) coordinate - for drag & drop to visible locations like Google Docs. Provide either ref or coordinate, not both.",
        parameters: {
            imageId: {
                type: "string",
                description:
                    "ID of a previously captured screenshot (from the computer tool's screenshot action) or a user-uploaded image",
            },
            ref: {
                type: "string",
                description:
                    'Element reference ID from read_page or find tools (e.g., "ref_1", "ref_2"). Use this for file inputs (especially hidden ones) or specific elements. Provide either ref or coordinate, not both.',
            },
            coordinate: {
                type: "array",
                description:
                    "Viewport coordinates [x, y] for drag & drop to a visible location. Use this for drag & drop targets like Google Docs. Provide either ref or coordinate, not both.",
            },
            tabId: {
                type: "number",
                description: "Tab ID where the target element is located. This is where the image will be uploaded to.",
            },
            filename: { type: "string", description: 'Optional filename for the uploaded file (default: "image.png")' },
        },
        execute: async (e, t) => {
            try {
                const o = e;
                if (!o?.imageId) throw new Error("imageId parameter is required");
                if (!o?.ref && !o?.coordinate)
                    throw new Error(
                        "Either ref or coordinate parameter is required. Provide ref for targeting specific elements or coordinate for drag & drop to a location."
                    );
                if (o?.ref && o?.coordinate)
                    throw new Error(
                        "Provide either ref or coordinate, not both. Use ref for specific elements or coordinate for drag & drop."
                    );
                if (!t?.tabId) throw new Error("No active tab found");
                const n = await K.getEffectiveTabId(o.tabId, t.tabId),
                    i = await chrome.tabs.get(n);
                if (!i.id) throw new Error("Upload tab has no ID");
                const a = i.url;
                if (!a) throw new Error("No URL available for upload tab");
                const s = t?.toolUseId,
                    c = await t.permissionManager.checkPermission(a, s);
                if (!c.allowed) {
                    if (c.needsPrompt) {
                        return {
                            type: "permission_required",
                            tool: r.UPLOAD_IMAGE,
                            url: a,
                            toolUseId: s,
                            actionData: { ref: o.ref, coordinate: o.coordinate, imageId: o.imageId },
                        };
                    }
                    return { error: "Permission denied for uploading to this domain" };
                }
                const u = i.url;
                if (!u) return { error: "Unable to get original URL for security check" };
                if (!t.messages) return { error: "Unable to access message history to retrieve image" };
                console.info(`[Upload-Image] Looking for image with ID: ${o.imageId}`),
                    console.info(`[Upload-Image] Messages available: ${t.messages.length}`);
                const l = L(t.messages, o.imageId);
                if (!l)
                    return {
                        error: `Image not found with ID: ${o.imageId}. Please ensure the image was captured or uploaded earlier in this conversation.`,
                    };
                const d = l.base64,
                    h = await W(i.id, u, "upload image action");
                if (h) return h;
                const p = await chrome.scripting.executeScript({
                    target: { tabId: i.id },
                    func: (e, t, r, o) => {
                        try {
                            let n = null;
                            if (t) {
                                if (((n = document.elementFromPoint(t[0], t[1])), !n))
                                    return { error: `No element found at coordinates (${t[0]}, ${t[1]})` };
                                if ("IFRAME" === n.tagName)
                                    try {
                                        const e = n,
                                            r =
                                                e.contentDocument ||
                                                (e.contentWindow ? e.contentWindow.document : null);
                                        if (r) {
                                            const o = e.getBoundingClientRect(),
                                                i = t[0] - o.left,
                                                a = t[1] - o.top,
                                                s = r.elementFromPoint(i, a);
                                            s && (n = s);
                                        }
                                    } catch {}
                            } else {
                                if (!e) return { error: "Neither coordinate nor elementRef provided" };
                                if (window.__claudeElementMap && window.__claudeElementMap[e]) {
                                    (n = window.__claudeElementMap[e].deref() || null),
                                        (n && document.contains(n)) ||
                                            (delete window.__claudeElementMap[e], (n = null));
                                }
                                if (!n)
                                    return {
                                        error: `No element found with reference: "${e}". The element may have been removed from the page.`,
                                    };
                            }
                            n.scrollIntoView({ behavior: "smooth", block: "center" });
                            const i = atob(r),
                                a = new Array(i.length);
                            for (let e = 0; e < i.length; e++) a[e] = i.charCodeAt(e);
                            const s = new Uint8Array(a),
                                c = new Blob([s], { type: "image/png" }),
                                u = new File([c], o, { type: "image/png", lastModified: Date.now() }),
                                l = new DataTransfer();
                            l.items.add(u);
                            if ("INPUT" === n.tagName && "file" === n.type) {
                                const e = n;
                                (e.files = l.files),
                                    e.focus(),
                                    e.dispatchEvent(new Event("change", { bubbles: !0 })),
                                    e.dispatchEvent(new Event("input", { bubbles: !0 }));
                                const t = new CustomEvent("filechange", { bubbles: !0, detail: { files: l.files } });
                                return (
                                    e.dispatchEvent(t),
                                    {
                                        output: `Successfully uploaded image "${o}" (${Math.round(c.size / 1024)}KB) to file input`,
                                    }
                                );
                            }
                            {
                                let e, r;
                                if ((n.focus(), t)) (e = t[0]), (r = t[1]);
                                else {
                                    const t = n.getBoundingClientRect();
                                    (e = t.left + t.width / 2), (r = t.top + t.height / 2);
                                }
                                const i = new DragEvent("dragenter", {
                                    bubbles: !0,
                                    cancelable: !0,
                                    dataTransfer: l,
                                    clientX: e,
                                    clientY: r,
                                    screenX: e + window.screenX,
                                    screenY: r + window.screenY,
                                });
                                n.dispatchEvent(i);
                                const a = new DragEvent("dragover", {
                                    bubbles: !0,
                                    cancelable: !0,
                                    dataTransfer: l,
                                    clientX: e,
                                    clientY: r,
                                    screenX: e + window.screenX,
                                    screenY: r + window.screenY,
                                });
                                n.dispatchEvent(a);
                                const s = new DragEvent("drop", {
                                    bubbles: !0,
                                    cancelable: !0,
                                    dataTransfer: l,
                                    clientX: e,
                                    clientY: r,
                                    screenX: e + window.screenX,
                                    screenY: r + window.screenY,
                                });
                                return (
                                    n.dispatchEvent(s),
                                    {
                                        output: `Successfully dropped image "${o}" (${Math.round(c.size / 1024)}KB) onto element at (${Math.round(e)}, ${Math.round(r)})`,
                                    }
                                );
                            }
                        } catch (n) {
                            return {
                                error: `Error uploading image: ${n instanceof Error ? n.message : "Unknown error"}`,
                            };
                        }
                    },
                    args: [o.ref || null, o.coordinate || null, d, o.filename || "image.png"],
                });
                if (!p || 0 === p.length) throw new Error("Failed to execute upload image");
                const f = await K.getValidTabsWithMetadata(t.tabId);
                return {
                    ...p[0].result,
                    tabContext: { currentTabId: t.tabId, executedOnTabId: n, availableTabs: f, tabCount: f.length },
                };
            } catch (o) {
                return { error: `Failed to upload image: ${o instanceof Error ? o.message : "Unknown error"}` };
            }
        },
        toAnthropicSchema: async () => ({
            name: "upload_image",
            description:
                "Upload a previously captured screenshot or user-uploaded image to a file input or drag & drop target. Supports two approaches: (1) ref - for targeting specific elements, especially hidden file inputs, (2) coordinate - for drag & drop to visible locations like Google Docs. Provide either ref or coordinate, not both.",
            input_schema: {
                type: "object",
                properties: {
                    imageId: {
                        type: "string",
                        description:
                            "ID of a previously captured screenshot (from the computer tool's screenshot action) or a user-uploaded image",
                    },
                    ref: {
                        type: "string",
                        description:
                            'Element reference ID from read_page or find tools (e.g., "ref_1", "ref_2"). Use this for file inputs (especially hidden ones) or specific elements. Provide either ref or coordinate, not both.',
                    },
                    coordinate: {
                        type: "array",
                        items: { type: "number" },
                        description:
                            "Viewport coordinates [x, y] for drag & drop to a visible location. Use this for drag & drop targets like Google Docs. Provide either ref or coordinate, not both.",
                    },
                    tabId: {
                        type: "number",
                        description:
                            "Tab ID where the target element is located. This is where the image will be uploaded to.",
                    },
                    filename: {
                        type: "string",
                        description: 'Optional filename for the uploaded file (default: "image.png")',
                    },
                },
                required: ["imageId", "tabId"],
            },
        }),
    },
    Te = {
        name: "read_console_messages",
        description:
            "Read browser console messages (console.log, console.error, console.warn, etc.) from a specific tab. Useful for debugging JavaScript errors, viewing application logs, or understanding what's happening in the browser console. Returns console messages from the current domain only. If you don't have a valid tab ID, use tabs_context first to get available tabs. IMPORTANT: Always provide a pattern to filter messages - without a pattern, you may get too many irrelevant messages.",
        parameters: {
            tabId: {
                type: "number",
                description:
                    "Tab ID to read console messages from. Must be a tab in the current group. Use tabs_context first if you don't have a valid tab ID.",
                required: !0,
            },
            onlyErrors: {
                type: "boolean",
                description:
                    "If true, only return error and exception messages. Default is false (return all message types).",
                required: !1,
            },
            clear: {
                type: "boolean",
                description:
                    "If true, clear the console messages after reading to avoid duplicates on subsequent calls. Default is false.",
                required: !1,
            },
            pattern: {
                type: "string",
                description:
                    "Regex pattern to filter console messages. Only messages matching this pattern will be returned (e.g., 'error|warning' to find errors and warnings, 'MyApp' to filter app-specific logs). You should always provide a pattern to avoid getting too many irrelevant messages.",
                required: !1,
            },
        },
        execute: async (e, t) => {
            try {
                const { tabId: n, onlyErrors: i = !1, clear: a = !1, pattern: s, limit: c = 100 } = e;
                if (!t?.tabId) throw new Error("No active tab found");
                const u = await K.getEffectiveTabId(n, t.tabId),
                    l = await chrome.tabs.get(u);
                if (!l.id) throw new Error("Active tab has no ID");
                const d = l.url;
                if (!d) throw new Error("No URL available for active tab");
                const h = t?.toolUseId,
                    p = await t.permissionManager.checkPermission(d, h);
                if (!p.allowed) {
                    if (p.needsPrompt) {
                        return { type: "permission_required", tool: r.READ_CONSOLE_MESSAGES, url: d, toolUseId: h };
                    }
                    return { error: "Permission denied for reading console messages on this domain" };
                }
                try {
                    await re.enableConsoleTracking(l.id);
                } catch (o) {}
                const f = re.getConsoleMessages(l.id, i, s);
                if ((a && re.clearConsoleMessages(l.id), 0 === f.length)) {
                    return {
                        output: `No console ${i ? "errors or exceptions" : "messages"} found for this tab.\n\nNote: Console tracking starts when this tool is first called. If the page loaded before calling this tool, you may need to refresh the page to capture console messages from page load.`,
                        tabContext: {
                            currentTabId: t.tabId,
                            executedOnTabId: u,
                            availableTabs: await K.getValidTabsWithMetadata(t.tabId),
                            tabCount: (await K.getValidTabsWithMetadata(t.tabId)).length,
                        },
                    };
                }
                const m = f.slice(0, c),
                    g = f.length > c,
                    b = m
                        .map((e, t) => {
                            const r = new Date(e.timestamp).toLocaleTimeString(),
                                o =
                                    e.url && void 0 !== e.lineNumber
                                        ? ` (${e.url}:${e.lineNumber}${void 0 !== e.columnNumber ? `:${e.columnNumber}` : ""})`
                                        : "";
                            let n = `[${t + 1}] [${r}] [${e.type.toUpperCase()}]${o}\n${e.text}`;
                            return e.stackTrace && (n += `\nStack trace:\n${e.stackTrace}`), n;
                        })
                        .join("\n\n"),
                    w = i ? "error/exception messages" : "console messages",
                    y = g ? ` (showing first ${c} of ${f.length})` : "",
                    v = `Found ${f.length} ${w}${y}:`,
                    I = await K.getValidTabsWithMetadata(t.tabId);
                return {
                    output: `${v}\n\n${b}`,
                    tabContext: { currentTabId: t.tabId, executedOnTabId: u, availableTabs: I, tabCount: I.length },
                };
            } catch (o) {
                return {
                    error: `Failed to read console messages: ${o instanceof Error ? o.message : "Unknown error"}`,
                };
            }
        },
        toAnthropicSchema: async () => ({
            name: "read_console_messages",
            description:
                "Read browser console messages (console.log, console.error, console.warn, etc.) from a specific tab. Useful for debugging JavaScript errors, viewing application logs, or understanding what's happening in the browser console. Returns console messages from the current domain only. If you don't have a valid tab ID, use tabs_context first to get available tabs. IMPORTANT: Always provide a pattern to filter messages - without a pattern, you may get too many irrelevant messages.",
            input_schema: {
                type: "object",
                properties: {
                    tabId: {
                        type: "number",
                        description:
                            "Tab ID to read console messages from. Must be a tab in the current group. Use tabs_context first if you don't have a valid tab ID.",
                    },
                    onlyErrors: {
                        type: "boolean",
                        description:
                            "If true, only return error and exception messages. Default is false (return all message types).",
                    },
                    clear: {
                        type: "boolean",
                        description:
                            "If true, clear the console messages after reading to avoid duplicates on subsequent calls. Default is false.",
                    },
                    pattern: {
                        type: "string",
                        description:
                            "Regex pattern to filter console messages. Only messages matching this pattern will be returned (e.g., 'error|warning' to find errors and warnings, 'MyApp' to filter app-specific logs). You should always provide a pattern to avoid getting too many irrelevant messages.",
                    },
                    limit: {
                        type: "number",
                        description:
                            "Maximum number of messages to return. Defaults to 100. Increase only if you need more results.",
                    },
                },
                required: ["tabId"],
            },
        }),
    },
    _e = {
        name: "read_network_requests",
        description:
            "Read HTTP network requests (XHR, Fetch, documents, images, etc.) from a specific tab. Useful for debugging API calls, monitoring network activity, or understanding what requests a page is making. Returns all network requests made by the current page, including cross-origin requests. Requests are automatically cleared when the page navigates to a different domain. If you don't have a valid tab ID, use tabs_context first to get available tabs.",
        parameters: {
            tabId: {
                type: "number",
                description:
                    "Tab ID to read network requests from. Must be a tab in the current group. Use tabs_context first if you don't have a valid tab ID.",
                required: !0,
            },
            urlPattern: {
                type: "string",
                description:
                    "Optional URL pattern to filter requests. Only requests whose URL contains this string will be returned (e.g., '/api/' to filter API calls, 'example.com' to filter by domain).",
                required: !1,
            },
            clear: {
                type: "boolean",
                description:
                    "If true, clear the network requests after reading to avoid duplicates on subsequent calls. Default is false.",
                required: !1,
            },
            limit: {
                type: "number",
                description:
                    "Maximum number of requests to return. Defaults to 100. Increase only if you need more results.",
                required: !1,
            },
        },
        execute: async (e, t) => {
            try {
                const { tabId: n, urlPattern: i, clear: a = !1, limit: s = 100 } = e;
                if (!t?.tabId) throw new Error("No active tab found");
                const c = await K.getEffectiveTabId(n, t.tabId),
                    u = await chrome.tabs.get(c);
                if (!u.id) throw new Error("Active tab has no ID");
                const l = u.url;
                if (!l) throw new Error("No URL available for active tab");
                const d = t?.toolUseId,
                    h = await t.permissionManager.checkPermission(l, d);
                if (!h.allowed) {
                    if (h.needsPrompt) {
                        return { type: "permission_required", tool: r.READ_NETWORK_REQUESTS, url: l, toolUseId: d };
                    }
                    return { error: "Permission denied for reading network requests on this domain" };
                }
                try {
                    await re.enableNetworkTracking(u.id);
                } catch (o) {}
                const p = re.getNetworkRequests(u.id, i);
                if ((a && re.clearNetworkRequests(u.id), 0 === p.length)) {
                    let e = "network requests";
                    return (
                        i && (e = `requests matching "${i}"`),
                        {
                            output: `No ${e} found for this tab.\n\nNote: Network tracking starts when this tool is first called. If the page loaded before calling this tool, you may need to refresh the page or perform actions that trigger network requests.`,
                            tabContext: {
                                currentTabId: t.tabId,
                                executedOnTabId: c,
                                availableTabs: await K.getValidTabsWithMetadata(t.tabId),
                                tabCount: (await K.getValidTabsWithMetadata(t.tabId)).length,
                            },
                        }
                    );
                }
                const f = p.slice(0, s),
                    m = p.length > s,
                    g = f
                        .map((e, t) => {
                            const r = e.status || "pending";
                            return `${t + 1}. url: ${e.url}\n   method: ${e.method}\n   statusCode: ${r}`;
                        })
                        .join("\n\n"),
                    b = [];
                i && b.push(`URL pattern: "${i}"`);
                const w = b.length > 0 ? ` (filtered by ${b.join(", ")})` : "",
                    y = m ? ` (showing first ${s} of ${p.length})` : "",
                    v = `Found ${p.length} network request${1 === p.length ? "" : "s"}${w}${y}:`,
                    I = await K.getValidTabsWithMetadata(t.tabId);
                return {
                    output: `${v}\n\n${g}`,
                    tabContext: { currentTabId: t.tabId, executedOnTabId: c, availableTabs: I, tabCount: I.length },
                };
            } catch (o) {
                return {
                    error: `Failed to read network requests: ${o instanceof Error ? o.message : "Unknown error"}`,
                };
            }
        },
        toAnthropicSchema: async () => ({
            name: "read_network_requests",
            description:
                "Read HTTP network requests (XHR, Fetch, documents, images, etc.) from a specific tab. Useful for debugging API calls, monitoring network activity, or understanding what requests a page is making. Returns all network requests made by the current page, including cross-origin requests. Requests are automatically cleared when the page navigates to a different domain. If you don't have a valid tab ID, use tabs_context first to get available tabs.",
            input_schema: {
                type: "object",
                properties: {
                    tabId: {
                        type: "number",
                        description:
                            "Tab ID to read network requests from. Must be a tab in the current group. Use tabs_context first if you don't have a valid tab ID.",
                    },
                    urlPattern: {
                        type: "string",
                        description:
                            "Optional URL pattern to filter requests. Only requests whose URL contains this string will be returned (e.g., '/api/' to filter API calls, 'example.com' to filter by domain).",
                    },
                    clear: {
                        type: "boolean",
                        description:
                            "If true, clear the network requests after reading to avoid duplicates on subsequent calls. Default is false.",
                    },
                    limit: {
                        type: "number",
                        description:
                            "Maximum number of requests to return. Defaults to 100. Increase only if you need more results.",
                    },
                },
                required: ["tabId"],
            },
        }),
    },
    Ee = {
        name: "resize_window",
        description:
            "Resize the current browser window to specified dimensions. Useful for testing responsive designs or setting up specific screen sizes. If you don't have a valid tab ID, use tabs_context first to get available tabs.",
        parameters: {
            width: { type: "number", description: "Target window width in pixels" },
            height: { type: "number", description: "Target window height in pixels" },
            tabId: {
                type: "number",
                description:
                    "Tab ID to get the window for. Must be a tab in the current group. Use tabs_context first if you don't have a valid tab ID.",
            },
        },
        execute: async (e, t) => {
            try {
                const { width: r, height: o, tabId: n } = e;
                if (!r || !o) throw new Error("Both width and height parameters are required");
                if (!n) throw new Error("tabId parameter is required");
                if (!t?.tabId) throw new Error("No active tab found");
                if ("number" != typeof r || "number" != typeof o) throw new Error("Width and height must be numbers");
                if (r <= 0 || o <= 0) throw new Error("Width and height must be positive numbers");
                if (r > 7680 || o > 4320)
                    throw new Error("Dimensions exceed 8K resolution limit. Maximum dimensions are 7680x4320");
                const i = await K.getEffectiveTabId(n, t.tabId),
                    a = await chrome.tabs.get(i);
                if (!a.windowId) throw new Error("Tab does not have an associated window");
                return (
                    await chrome.windows.update(a.windowId, { width: Math.floor(r), height: Math.floor(o) }),
                    {
                        output: `Successfully resized window containing tab ${i} to ${Math.floor(r)}x${Math.floor(o)} pixels`,
                    }
                );
            } catch (r) {
                return { error: `Failed to resize window: ${r instanceof Error ? r.message : "Unknown error"}` };
            }
        },
        toAnthropicSchema: async () => ({
            name: "resize_window",
            description:
                "Resize the current browser window to specified dimensions. Useful for testing responsive designs or setting up specific screen sizes. If you don't have a valid tab ID, use tabs_context first to get available tabs.",
            input_schema: {
                type: "object",
                properties: {
                    width: { type: "number", description: "Target window width in pixels" },
                    height: { type: "number", description: "Target window height in pixels" },
                    tabId: {
                        type: "number",
                        description:
                            "Tab ID to get the window for. Must be a tab in the current group. Use tabs_context first if you don't have a valid tab ID.",
                    },
                },
                required: ["width", "height", "tabId"],
            },
        }),
    };
const xe = new (class {
        storage = new Map();
        recordingGroups = new Set();
        addFrame(e, t) {
            this.storage.has(e) || this.storage.set(e, { frames: [], lastUpdated: Date.now() });
            const r = this.storage.get(e);
            if ((r.frames.push(t), (r.lastUpdated = Date.now()), r.frames.length > 50)) {
                r.frames.shift();
            }
        }
        getFrames(e) {
            return this.storage.get(e)?.frames ?? [];
        }
        clearFrames(e) {
            this.storage.get(e)?.frames.length;
            this.storage.delete(e), this.recordingGroups.delete(e);
        }
        getFrameCount(e) {
            return this.storage.get(e)?.frames.length ?? 0;
        }
        getActiveGroupIds() {
            return Array.from(this.storage.keys());
        }
        startRecording(e) {
            this.recordingGroups.add(e);
        }
        stopRecording(e) {
            this.recordingGroups.delete(e);
        }
        isRecording(e) {
            return this.recordingGroups.has(e);
        }
        getRecordingGroupIds() {
            return Array.from(this.recordingGroups);
        }
        clearAll() {
            Array.from(this.storage.values()).reduce((e, t) => e + t.frames.length, 0);
            this.storage.clear(), this.recordingGroups.clear();
        }
    })(),
    Ce = {
        name: "gif_creator",
        description:
            "Manage GIF recording and export for browser automation sessions. Control when to start/stop recording browser actions (clicks, scrolls, navigation), then export as an animated GIF with visual overlays (click indicators, action labels, progress bar, watermark). All operations are scoped to the tab's group. When starting recording, take a screenshot immediately after to capture the initial state as the first frame. When stopping recording, take a screenshot immediately before to capture the final state as the last frame. For export, either provide 'coordinate' to drag/drop upload to a page element, or set 'download: true' to download the GIF.",
        parameters: {
            action: {
                type: "string",
                description:
                    "Action to perform: 'start_recording' (begin capturing), 'stop_recording' (stop capturing but keep frames), 'export' (generate and export GIF), 'clear' (discard frames)",
            },
            tabId: { type: "number", description: "Tab ID to identify which tab group this operation applies to" },
            coordinate: {
                type: "array",
                description:
                    "Viewport coordinates [x, y] for drag & drop upload. Required for 'export' action unless 'download' is true.",
            },
            download: {
                type: "boolean",
                description: "If true, download the GIF instead of drag/drop upload. For 'export' action only.",
            },
            filename: {
                type: "string",
                description:
                    "Optional filename for exported GIF (default: 'recording-[timestamp].gif'). For 'export' action only.",
            },
            options: {
                type: "object",
                description: "Optional GIF enhancement options for 'export' action. All default to true.",
            },
        },
        execute: async (e, o) => {
            try {
                const n = e;
                if (!n?.action) throw new Error("action parameter is required");
                if (!o?.tabId) throw new Error("No active tab found in context");
                const i = await chrome.tabs.get(n.tabId);
                if (!i) throw new Error(`Tab ${n.tabId} not found`);
                const a = i.groupId ?? -1;
                if (o.sessionId === fe) {
                    const e = await chrome.storage.local.get(t.MCP_TAB_GROUP_ID);
                    if (a !== e[t.MCP_TAB_GROUP_ID])
                        return {
                            error: `Tab ${n.tabId} is not in the MCP tab group. GIF recording only works for tabs within the MCP tab group.`,
                        };
                }
                switch (n.action) {
                    case "start_recording":
                        return await (async function (e) {
                            const t = xe.isRecording(e);
                            if (t)
                                return {
                                    output: "Recording is already active for this tab group. Use 'stop_recording' to stop or 'export' to generate GIF.",
                                };
                            return (
                                xe.clearFrames(e),
                                xe.startRecording(e),
                                {
                                    output: "Started recording browser actions for this tab group. All computer and navigate tool actions will now be captured (max 50 frames). Previous frames cleared.",
                                }
                            );
                        })(a);
                    case "stop_recording":
                        return await (async function (e) {
                            const t = xe.isRecording(e);
                            if (!t)
                                return {
                                    output: "Recording is not active for this tab group. Use 'start_recording' to begin capturing.",
                                };
                            xe.stopRecording(e);
                            const r = xe.getFrameCount(e);
                            return {
                                output: `Stopped recording for this tab group. Captured ${r} frame${1 === r ? "" : "s"}. Use 'export' to generate GIF or 'clear' to discard.`,
                            };
                        })(a);
                    case "export":
                        return await (async function (e, t, o, n) {
                            const i = !0 === e.download;
                            if (!(i || (e.coordinate && 2 === e.coordinate.length)))
                                throw new Error(
                                    "coordinate parameter is required for export action (or set download: true to download the GIF)"
                                );
                            if (!t.id || !t.url) throw new Error("Tab has no ID or URL");
                            const a = xe.getFrames(o);
                            if (0 === a.length)
                                return {
                                    error: "No frames recorded for this tab group. Use 'start_recording' and perform browser actions first.",
                                };
                            if (!i) {
                                const o = t.url,
                                    i = n?.toolUseId,
                                    a = await n.permissionManager.checkPermission(o, i);
                                if (!a.allowed) {
                                    if (a.needsPrompt) {
                                        return {
                                            type: "permission_required",
                                            tool: r.UPLOAD_IMAGE,
                                            url: o,
                                            toolUseId: i,
                                            actionData: { coordinate: e.coordinate },
                                        };
                                    }
                                    return { error: "Permission denied for uploading to this domain" };
                                }
                            }
                            const s = t.url;
                            0 === (await chrome.runtime.getContexts({ contextTypes: ["OFFSCREEN_DOCUMENT"] })).length &&
                                (await chrome.offscreen.createDocument({
                                    url: "offscreen.html",
                                    reasons: ["BLOBS"],
                                    justification: "Generate animated GIF from screenshots",
                                }),
                                await new Promise((e) => setTimeout(e, 200)));
                            const c = a.map((e) => ({
                                    base64: e.base64,
                                    format: "png",
                                    action: e.action,
                                    delay: e.action ? Se(e.action.type) : 800,
                                    viewportWidth: e.viewportWidth,
                                    viewportHeight: e.viewportHeight,
                                    devicePixelRatio: e.devicePixelRatio,
                                })),
                                u = {
                                    showClickIndicators: e.options?.showClickIndicators ?? !0,
                                    showDragPaths: e.options?.showDragPaths ?? !0,
                                    showActionLabels: e.options?.showActionLabels ?? !0,
                                    showProgressBar: e.options?.showProgressBar ?? !0,
                                    showWatermark: e.options?.showWatermark ?? !0,
                                    quality: e.options?.quality ?? 10,
                                };
                            const l = await new Promise((e, t) => {
                                chrome.runtime.sendMessage({ type: "GENERATE_GIF", frames: c, options: u }, (r) => {
                                    chrome.runtime.lastError
                                        ? t(new Error(chrome.runtime.lastError.message))
                                        : r && r.success
                                          ? e(r.result)
                                          : t(new Error(r?.error || "Unknown error from offscreen"));
                                });
                            });
                            const d = new Date().toISOString().replace(/[:.]/g, "-"),
                                h = e.filename || `recording-${d}.gif`;
                            let p;
                            if (i) {
                                await chrome.downloads.download({ url: l.blobUrl, filename: h, saveAs: !1 });
                                p = `Successfully exported GIF with ${a.length} frames. Downloaded "${h}" (${Math.round(l.size / 1024)}KB). Dimensions: ${l.width}x${l.height}. Recording cleared.`;
                            } else {
                                const r = await W(t.id, s, "GIF export upload action");
                                if (r) return r;
                                const o = await chrome.scripting.executeScript({
                                    target: { tabId: t.id },
                                    func: (e, t, r, o) => {
                                        const n = atob(e),
                                            i = new Array(n.length);
                                        for (let d = 0; d < n.length; d++) i[d] = n.charCodeAt(d);
                                        const a = new Uint8Array(i),
                                            s = new Blob([a], { type: "image/gif" }),
                                            c = new File([s], t, { type: "image/gif", lastModified: Date.now() }),
                                            u = new DataTransfer();
                                        u.items.add(c);
                                        const l = document.elementFromPoint(r, o);
                                        if (!l) throw new Error(`No element found at coordinates (${r}, ${o})`);
                                        return (
                                            l.dispatchEvent(
                                                new DragEvent("dragenter", {
                                                    bubbles: !0,
                                                    cancelable: !0,
                                                    dataTransfer: u,
                                                    clientX: r,
                                                    clientY: o,
                                                })
                                            ),
                                            l.dispatchEvent(
                                                new DragEvent("dragover", {
                                                    bubbles: !0,
                                                    cancelable: !0,
                                                    dataTransfer: u,
                                                    clientX: r,
                                                    clientY: o,
                                                })
                                            ),
                                            l.dispatchEvent(
                                                new DragEvent("drop", {
                                                    bubbles: !0,
                                                    cancelable: !0,
                                                    dataTransfer: u,
                                                    clientX: r,
                                                    clientY: o,
                                                })
                                            ),
                                            {
                                                output: `Successfully dropped ${t} (${Math.round(s.size / 1024)}KB) at (${r}, ${o})`,
                                            }
                                        );
                                    },
                                    args: [l.base64, h, e.coordinate[0], e.coordinate[1]],
                                });
                                if (!o || !o[0]?.result) throw new Error("Failed to upload GIF to page");
                                p = `Successfully exported GIF with ${a.length} frames. ${o[0].result.output}. Dimensions: ${l.width}x${l.height}. Recording cleared.`;
                            }
                            xe.clearFrames(o);
                            const f = await K.getValidTabsWithMetadata(n.tabId);
                            return {
                                output: p,
                                tabContext: {
                                    currentTabId: n.tabId,
                                    executedOnTabId: t.id,
                                    availableTabs: f,
                                    tabCount: f.length,
                                },
                            };
                        })(n, i, a, o);
                    case "clear":
                        return await (async function (e) {
                            const t = xe.getFrameCount(e);
                            if (0 === t) return { output: "No frames to clear for this tab group." };
                            return (
                                xe.clearFrames(e),
                                {
                                    output: `Cleared ${t} frame${1 === t ? "" : "s"} for this tab group. Recording stopped.`,
                                }
                            );
                        })(a);
                    default:
                        throw new Error(
                            `Unknown action: ${n.action}. Must be one of: start_recording, stop_recording, export, clear`
                        );
                }
            } catch (n) {
                return { error: `Failed to execute gif_creator: ${n instanceof Error ? n.message : "Unknown error"}` };
            }
        },
        toAnthropicSchema: async () => ({
            name: "gif_creator",
            description:
                "Manage GIF recording and export for browser automation sessions. Control when to start/stop recording browser actions (clicks, scrolls, navigation), then export as an animated GIF with visual overlays (click indicators, action labels, progress bar, watermark). All operations are scoped to the tab's group. When starting recording, take a screenshot immediately after to capture the initial state as the first frame. When stopping recording, take a screenshot immediately before to capture the final state as the last frame. For export, either provide 'coordinate' to drag/drop upload to a page element, or set 'download: true' to download the GIF.",
            input_schema: {
                type: "object",
                properties: {
                    action: {
                        type: "string",
                        enum: ["start_recording", "stop_recording", "export", "clear"],
                        description:
                            "Action to perform: 'start_recording' (begin capturing), 'stop_recording' (stop capturing but keep frames), 'export' (generate and export GIF), 'clear' (discard frames)",
                    },
                    tabId: {
                        type: "number",
                        description: "Tab ID to identify which tab group this operation applies to",
                    },
                    coordinate: {
                        type: "array",
                        items: { type: "number" },
                        description:
                            "Viewport coordinates [x, y] for drag & drop upload. Required for 'export' action unless 'download' is true.",
                    },
                    download: {
                        type: "boolean",
                        description: "If true, download the GIF instead of drag/drop upload. For 'export' action only.",
                    },
                    filename: {
                        type: "string",
                        description:
                            "Optional filename for exported GIF (default: 'recording-[timestamp].gif'). For 'export' action only.",
                    },
                    options: {
                        type: "object",
                        description:
                            "Optional GIF enhancement options for 'export' action. Properties: showClickIndicators (bool), showDragPaths (bool), showActionLabels (bool), showProgressBar (bool), showWatermark (bool), quality (number 1-30). All default to true except quality (default: 10).",
                        properties: {
                            showClickIndicators: {
                                type: "boolean",
                                description: "Show orange circles at click locations (default: true)",
                            },
                            showDragPaths: {
                                type: "boolean",
                                description: "Show red arrows for drag actions (default: true)",
                            },
                            showActionLabels: {
                                type: "boolean",
                                description: "Show black labels describing actions (default: true)",
                            },
                            showProgressBar: {
                                type: "boolean",
                                description: "Show orange progress bar at bottom (default: true)",
                            },
                            showWatermark: {
                                type: "boolean",
                                description: "Show Claude logo watermark (default: true)",
                            },
                            quality: {
                                type: "number",
                                description:
                                    "GIF compression quality, 1-30 (lower = better quality, slower encoding). Default: 10",
                            },
                        },
                    },
                },
                required: ["action", "tabId"],
            },
        }),
    };
function Se(e) {
    return (
        {
            wait: 300,
            screenshot: 300,
            navigate: 800,
            scroll: 800,
            scroll_to: 800,
            type: 800,
            key: 800,
            zoom: 800,
            left_click: 1500,
            right_click: 1500,
            double_click: 1500,
            triple_click: 1500,
            left_click_drag: 1500,
        }[e] ?? 800
    );
}
const Ae = { type: "object", properties: {}, required: [] },
    De = {
        name: "turn_answer_start",
        description:
            "Call this immediately before your text response to the user for this turn. Required every turn - whether or not you made tool calls. After calling, write your response. No more tools after this.",
        parameters: Ae,
        execute: async () => ({ output: "Proceed with your response." }),
        toAnthropicSchema() {
            return { type: "custom", name: this.name, description: this.description, input_schema: Ae };
        },
    },
    Me = {
        name: "javascript_tool",
        description:
            "Execute JavaScript code in the context of the current page. The code runs in the page's context and can interact with the DOM, window object, and page variables. Returns the result of the last expression or any thrown errors. If you don't have a valid tab ID, use tabs_context first to get available tabs.",
        parameters: {
            action: { type: "string", description: "Must be set to 'javascript_exec'" },
            text: {
                type: "string",
                description:
                    "The JavaScript code to execute. The code will be evaluated in the page context. The result of the last expression will be returned automatically. Do NOT use 'return' statements - just write the expression you want to evaluate (e.g., 'window.myData.value' not 'return window.myData.value'). You can access and modify the DOM, call page functions, and interact with page variables.",
            },
            tabId: {
                type: "number",
                description:
                    "Tab ID to execute the code in. Must be a tab in the current group. Use tabs_context first if you don't have a valid tab ID.",
            },
        },
        execute: async (e, t) => {
            try {
                const { action: o, text: n, tabId: i } = e;
                if ("javascript_exec" !== o) throw new Error("'javascript_exec' is the only supported action");
                if (!n) throw new Error("Code parameter is required");
                if (!t?.tabId) throw new Error("No active tab found");
                const a = await K.getEffectiveTabId(i, t.tabId),
                    s = (await chrome.tabs.get(a)).url;
                if (!s) throw new Error("No URL available for active tab");
                const c = t?.toolUseId,
                    u = await t.permissionManager.checkPermission(s, c);
                if (!u.allowed) {
                    if (u.needsPrompt) {
                        return {
                            type: "permission_required",
                            tool: r.EXECUTE_JAVASCRIPT,
                            url: s,
                            toolUseId: c,
                            actionData: { text: n },
                        };
                    }
                    return { error: "Permission denied for JavaScript execution on this domain" };
                }
                const l = await W(a, s, "JavaScript execution");
                if (l) return l;
                const d = `\n        (function() {\n          'use strict';\n          try {\n            return eval(\`${n.replace(/`/g, "\\`").replace(/\$/g, "\\$")}\`);\n          } catch (e) {\n            throw e;\n          }\n        })()\n      `,
                    h = await re.sendCommand(a, "Runtime.evaluate", {
                        expression: d,
                        returnByValue: !0,
                        awaitPromise: !0,
                        timeout: 1e4,
                    });
                let p = "",
                    f = !1,
                    m = "";
                const g = (e, t = 0) => {
                        if (t > 5) return "[TRUNCATED: Max depth exceeded]";
                        const r = [
                            /password/i,
                            /token/i,
                            /secret/i,
                            /api[_-]?key/i,
                            /auth/i,
                            /credential/i,
                            /private[_-]?key/i,
                            /access[_-]?key/i,
                            /bearer/i,
                            /oauth/i,
                            /session/i,
                        ];
                        if ("string" == typeof e) {
                            if (e.includes("=") && (e.includes(";") || e.includes("&")))
                                return "[BLOCKED: Cookie/query string data]";
                            if (e.match(/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/))
                                return "[BLOCKED: JWT token]";
                            if (/^[A-Za-z0-9+/]{20,}={0,2}$/.test(e)) return "[BLOCKED: Base64 encoded data]";
                            if (/^[a-f0-9]{32,}$/i.test(e)) return "[BLOCKED: Hex credential]";
                            if (e.length > 1e3) return e.substring(0, 1e3) + "[TRUNCATED]";
                        }
                        if (e && "object" == typeof e && !Array.isArray(e)) {
                            const o = {};
                            for (const [n, i] of Object.entries(e)) {
                                const e = r.some((e) => e.test(n));
                                o[n] = e
                                    ? "[BLOCKED: Sensitive key]"
                                    : "cookie" === n || "cookies" === n
                                      ? "[BLOCKED: Cookie access]"
                                      : g(i, t + 1);
                            }
                            return o;
                        }
                        if (Array.isArray(e)) {
                            const r = e.slice(0, 100).map((e) => g(e, t + 1));
                            return e.length > 100 && r.push(`[TRUNCATED: ${e.length - 100} more items]`), r;
                        }
                        return e;
                    },
                    b = 51200;
                if (h.exceptionDetails) {
                    f = !0;
                    const e = h.exceptionDetails.exception,
                        t = e?.description?.includes("execution was terminated");
                    m = t
                        ? "Execution timeout: Code exceeded 10-second limit"
                        : e?.description || e?.value || "Unknown error";
                } else if (h.result) {
                    const e = h.result;
                    if ("undefined" === e.type) p = "undefined";
                    else if ("object" === e.type && "null" === e.subtype) p = "null";
                    else if ("function" === e.type) p = e.description || "[Function]";
                    else if ("object" === e.type)
                        if ("node" === e.subtype) p = e.description || "[DOM Node]";
                        else if ("array" === e.subtype) p = e.description || "[Array]";
                        else {
                            const t = g(e.value || {});
                            p = e.description || JSON.stringify(t, null, 2);
                        }
                    else if (void 0 !== e.value) {
                        const t = g(e.value);
                        p = "string" == typeof t ? t : JSON.stringify(t, null, 2);
                    } else p = e.description || String(e.value);
                } else p = "undefined";
                const w = await K.getValidTabsWithMetadata(t.tabId);
                return f
                    ? {
                          error: `JavaScript execution error: ${m}`,
                          tabContext: {
                              currentTabId: t.tabId,
                              executedOnTabId: a,
                              availableTabs: w,
                              tabCount: w.length,
                          },
                      }
                    : (p.length > b && (p = p.substring(0, b) + "\n[OUTPUT TRUNCATED: Exceeded 50KB limit]"),
                      {
                          output: p,
                          tabContext: {
                              currentTabId: t.tabId,
                              executedOnTabId: a,
                              availableTabs: w,
                              tabCount: w.length,
                          },
                      });
            } catch (o) {
                return { error: `Failed to execute JavaScript: ${o instanceof Error ? o.message : "Unknown error"}` };
            }
        },
        toAnthropicSchema: async () => ({
            name: "javascript_tool",
            description:
                "Execute JavaScript code in the context of the current page. The code runs in the page's context and can interact with the DOM, window object, and page variables. Returns the result of the last expression or any thrown errors. If you don't have a valid tab ID, use tabs_context first to get available tabs.",
            input_schema: {
                type: "object",
                properties: {
                    action: { type: "string", description: "Must be set to 'javascript_exec'" },
                    text: {
                        type: "string",
                        description:
                            "The JavaScript code to execute. The code will be evaluated in the page context. The result of the last expression will be returned automatically. Do NOT use 'return' statements - just write the expression you want to evaluate (e.g., 'window.myData.value' not 'return window.myData.value'). You can access and modify the DOM, call page functions, and interact with page variables.",
                    },
                    tabId: {
                        type: "number",
                        description:
                            "Tab ID to execute the code in. Must be a tab in the current group. Use tabs_context first if you don't have a valid tab ID.",
                    },
                },
                required: ["action", "text", "tabId"],
            },
        }),
    };
async function Re(e, t) {
    const r = t === e;
    await K.initialize();
    const o = await K.findGroupByTab(t);
    return { isMainTab: r, isSecondaryTab: !!o && o.mainTabId === e && t !== e, group: o };
}
function Ue(e) {
    return "category1" === e || "category2" === e;
}
function Pe(e) {
    try {
        return new URL(e).hostname;
    } catch {
        return null;
    }
}
function Be(e, t) {
    if (
        !e ||
        (r = e).startsWith("chrome://") ||
        r.startsWith("chrome-extension://") ||
        r.startsWith("about:") ||
        "" === r
    )
        return null;
    var r;
    const o = Pe(e),
        n = Pe(t);
    return o && n && o !== n && "newtab" !== o ? { oldDomain: o, newDomain: n } : null;
}
async function Ge(e, t) {
    const r = await j.getCategory(t);
    return await K.updateTabBlocklistStatus(e, t), r ?? null;
}
function $e(e) {
    return chrome.runtime.getURL(`blocked.html?url=${encodeURIComponent(e)}`);
}
function Oe(e, t, o, n, i) {
    return {
        type: "permission_required",
        tool: r.DOMAIN_TRANSITION,
        url: o,
        toolUseId: crypto.randomUUID(),
        actionData: { fromDomain: e, toDomain: t, sourceTabId: n, isSecondaryTab: i },
    };
}
async function Le(e) {
    const { tabId: r, prompt: o, taskName: i, skipPermissions: a, model: s } = e,
        c = `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
        u = `shortcut_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    return (
        await n(t.TARGET_TAB_ID, r),
        await (async function (e) {
            const { sessionId: t, skipPermissions: r, model: o } = e,
                n = chrome.runtime.getURL(
                    `sidepanel.html?mode=window&sessionId=${t}${r ? "&skipPermissions=true" : ""}${o ? `&model=${encodeURIComponent(o)}` : ""}`
                ),
                i = await chrome.windows.create({
                    url: n,
                    type: "popup",
                    width: 500,
                    height: 768,
                    left: 100,
                    top: 100,
                    focused: !0,
                });
            if (!i) throw new Error("Failed to create sidepanel window");
            return i;
        })({ sessionId: c, skipPermissions: a, model: s }),
        await (async function (e) {
            const { tabId: t, prompt: r, taskName: o, runLogId: n, sessionId: i, isScheduledTask: a } = e;
            return new Promise((e, s) => {
                const c = Date.now();
                let u = !1;
                const l = async () => {
                    try {
                        if (Date.now() - c > 3e4)
                            return void s(new Error("Timeout waiting for tab to load for task execution"));
                        "complete" === (await chrome.tabs.get(t)).status
                            ? setTimeout(() => {
                                  u ||
                                      ((u = !0),
                                      chrome.runtime.sendMessage(
                                          {
                                              type: "EXECUTE_TASK",
                                              prompt: r,
                                              taskName: o,
                                              runLogId: n,
                                              windowSessionId: i,
                                              isScheduledTask: a,
                                          },
                                          () => {
                                              chrome.runtime.lastError
                                                  ? s(
                                                        new Error(
                                                            `Failed to send prompt: ${chrome.runtime.lastError.message}`
                                                        )
                                                    )
                                                  : e();
                                          }
                                      ));
                              }, 3e3)
                            : setTimeout(l, 500);
                    } catch (d) {
                        s(d);
                    }
                };
                setTimeout(l, 1e3);
            });
        })({ tabId: r, prompt: o, taskName: i, runLogId: u, sessionId: c, isScheduledTask: !1 }),
        { success: !0 }
    );
}
const Ne = [
        le,
        pe,
        de,
        ie,
        Y,
        he,
        me,
        {
            name: "tabs_context_mcp",
            description:
                "Get context information about the current MCP tab group. Returns all tab IDs inside the group if it exists. CRITICAL: You must get the context at least once before using other browser automation tools so you know what tabs exist. Each new conversation should create its own new tab (using tabs_create) rather than reusing existing tabs, unless the user explicitly asks to use an existing tab.",
            parameters: {
                createIfEmpty: {
                    type: "boolean",
                    description:
                        "Creates a new MCP tab group if none exists, creates a new Window with a new tab group containing an empty tab (which can be used for this conversation). If a MCP tab group already exists, this parameter has no effect.",
                },
            },
            execute: async (e) => {
                try {
                    const { createIfEmpty: t } = e || {};
                    await K.initialize();
                    const r = await K.getOrCreateMcpTabContext({ createIfEmpty: t });
                    if (!r) return { output: "No MCP tab groups found. Use createIfEmpty: true to create one." };
                    const o = r.tabGroupId,
                        n = r.availableTabs;
                    return { output: U(n, o), tabContext: { ...r, tabGroupId: o } };
                } catch (t) {
                    return { error: `Failed to query tabs: ${t instanceof Error ? t.message : "Unknown error"}` };
                }
            },
            toAnthropicSchema: async () => ({
                name: "tabs_context_mcp",
                description:
                    "Get context information about the current MCP tab group. Returns all tab IDs inside the group if it exists. CRITICAL: You must get the context at least once before using other browser automation tools so you know what tabs exist. Each new conversation should create its own new tab (using tabs_create) rather than reusing existing tabs, unless the user explicitly asks to use an existing tab.",
                input_schema: {
                    type: "object",
                    properties: {
                        createIfEmpty: {
                            type: "boolean",
                            description:
                                "Creates a new MCP tab group if none exists, creates a new Window with a new tab group containing an empty tab (which can be used for this conversation). If a MCP tab group already exists, this parameter has no effect.",
                        },
                    },
                    required: [],
                },
            }),
        },
        ge,
        {
            name: "tabs_create_mcp",
            description: "Creates a new empty tab in the MCP tab group.",
            parameters: {},
            execute: async () => {
                try {
                    await K.initialize();
                    const e = await K.getOrCreateMcpTabContext({ createIfEmpty: !1 });
                    if (!e?.tabGroupId)
                        return {
                            error: "No MCP tab group exists. Use tabs_context_mcp with createIfEmpty: true first to create one.",
                        };
                    const t = e.tabGroupId,
                        r = await chrome.tabs.create({ url: "chrome://newtab", active: !0 });
                    if (!r.id) throw new Error("Failed to create tab - no tab ID returned");
                    await chrome.tabs.group({ tabIds: r.id, groupId: t });
                    const o = (await chrome.tabs.query({ groupId: t }))
                        .filter((e) => void 0 !== e.id)
                        .map((e) => ({ id: e.id, title: e.title || "", url: e.url || "" }));
                    return {
                        output: `Created new tab. Tab ID: ${r.id}`,
                        tabContext: {
                            currentTabId: r.id,
                            executedOnTabId: r.id,
                            availableTabs: o,
                            tabCount: o.length,
                            tabGroupId: t,
                        },
                    };
                } catch (e) {
                    return { error: `Failed to create tab: ${e instanceof Error ? e.message : "Unknown error"}` };
                }
            },
            toAnthropicSchema: async () => ({
                name: "tabs_create_mcp",
                description: "Creates a new empty tab in the MCP tab group.",
                input_schema: { type: "object", properties: {}, required: [] },
            }),
        },
        Ie,
        ke,
        Te,
        _e,
        Ee,
        Ce,
        De,
        Me,
        {
            name: "shortcuts_list",
            description:
                "List all available shortcuts and workflows (shortcuts and workflows are interchangeable). Returns shortcuts with their commands, descriptions, and whether they are workflows. Use shortcuts_execute to run a shortcut or workflow.",
            parameters: {},
            execute: async () => {
                try {
                    const e = (await o.getAllPrompts()).map((e) => ({
                        id: e.id,
                        ...(e.command && { command: e.command }),
                    }));
                    return 0 === e.length
                        ? { output: JSON.stringify({ message: "No shortcuts found", shortcuts: [] }, null, 2) }
                        : {
                              output: JSON.stringify(
                                  { message: `Found ${e.length} shortcut(s)`, shortcuts: e },
                                  null,
                                  2
                              ),
                          };
                } catch (e) {
                    return { error: `Failed to list shortcuts: ${e instanceof Error ? e.message : "Unknown error"}` };
                }
            },
            toAnthropicSchema: async () => ({
                name: "shortcuts_list",
                description:
                    "List all available shortcuts and workflows (shortcuts and workflows are interchangeable). Returns shortcuts with their commands, descriptions, and whether they are workflows. Use shortcuts_execute to run a shortcut or workflow.",
                input_schema: { type: "object", properties: {}, required: [] },
            }),
        },
        {
            name: "shortcuts_execute",
            description:
                "Execute a shortcut or workflow by running it in a new sidepanel window using the current tab (shortcuts and workflows are interchangeable). Use shortcuts_list first to see available shortcuts. This starts the execution and returns immediately - it does not wait for completion.",
            parameters: {
                shortcutId: { type: "string", description: "The ID of the shortcut to execute" },
                command: {
                    type: "string",
                    description:
                        "The command name of the shortcut to execute (e.g., 'debug', 'summarize'). Do not include the leading slash.",
                },
            },
            execute: async (e, t) => {
                try {
                    const { shortcutId: r, command: n } = e;
                    if (!r && !n)
                        return {
                            error: "Either shortcutId or command is required. Use shortcuts_list to see available shortcuts.",
                        };
                    const i = t?.tabId;
                    if (!i) return { error: "No tab context available. Cannot execute shortcut without a target tab." };
                    let a;
                    if (r) a = await o.getPromptById(r);
                    else if (n) {
                        const e = n.startsWith("/") ? n.slice(1) : n;
                        a = await o.getPromptByCommand(e);
                    }
                    if (!a)
                        return {
                            error: `Shortcut not found. ${r ? `No shortcut with ID "${r}"` : `No shortcut with command "/${n}"`}. Use shortcuts_list to see available shortcuts.`,
                        };
                    await o.recordPromptUsage(a.id);
                    const s = a.command || a.id,
                        c = `[[shortcut:${a.id}:${s}]]`,
                        u = await Le({
                            tabId: i,
                            tabGroupId: t?.tabGroupId,
                            prompt: c,
                            taskName: a.command || a.id,
                            skipPermissions: a.skipPermissions,
                            model: a.model,
                        });
                    return u.success
                        ? {
                              output: JSON.stringify(
                                  {
                                      success: !0,
                                      message: `Shortcut "${a.command || a.id}" started. Execution is running in a separate sidepanel window.`,
                                      shortcut: { id: a.id, command: a.command },
                                  },
                                  null,
                                  2
                              ),
                          }
                        : { error: u.error || "Shortcut execution failed" };
                } catch (r) {
                    return { error: `Failed to execute shortcut: ${r instanceof Error ? r.message : "Unknown error"}` };
                }
            },
            toAnthropicSchema: async () => ({
                name: "shortcuts_execute",
                description:
                    "Execute a shortcut or workflow by running it in a new sidepanel window using the current tab (shortcuts and workflows are interchangeable). Use shortcuts_list first to see available shortcuts. This starts the execution and returns immediately - it does not wait for completion.",
                input_schema: {
                    type: "object",
                    properties: {
                        shortcutId: { type: "string", description: "The ID of the shortcut to execute" },
                        command: {
                            type: "string",
                            description:
                                "The command name of the shortcut to execute (e.g., 'debug', 'summarize'). Do not include the leading slash.",
                        },
                    },
                    required: [],
                },
            }),
        },
    ],
    Fe = ["tabs_context_mcp", "tabs_create_mcp"];
class qe {
    constructor(e) {
        this.context = e;
    }
    async handleToolCall(e, t, r, o, n, i) {
        const a = t.action;
        return await k(
            `tool_execution_${e}${a ? "_" + a : ""}`,
            async (i) => {
                if (!this.context.tabId && !Fe.includes(e)) throw new Error("No tab available");
                i.setAttribute("session_id", this.context.sessionId),
                    i.setAttribute("tool_name", e),
                    o && i.setAttribute("permissions", o),
                    a && i.setAttribute("action", a);
                const s = {
                        toolUseId: r,
                        tabId: this.context.tabId,
                        tabGroupId: this.context.tabGroupId,
                        model: this.context.model,
                        sessionId: this.context.sessionId,
                        anthropicClient: this.context.anthropicClient,
                        permissionManager: this.context.permissionManager,
                        createAnthropicMessage: this.createAnthropicMessage(),
                    },
                    c = Ne.find((t) => t.name === e);
                if (!c) throw new Error(`Unknown tool: ${e}`);
                const u = { name: e, sessionId: this.context.sessionId, permissions: o };
                "computer" === e && a && (u.action = a), n && (u.domain = n);
                try {
                    const r = $(e, t, Ne),
                        o = await c.execute(r, s);
                    return (
                        "type" in o
                            ? ((u.success = !1),
                              i.setAttribute("success", !1),
                              i.setAttribute("failure_reason", "needs_permission"))
                            : ((u.success = !o.error), i.setAttribute("success", !o.error)),
                        "type" in o ||
                            o.error ||
                            !s.tabId ||
                            (await (async function (e, t, r) {
                                try {
                                    if (!["computer", "navigate"].includes(e)) return;
                                    const n = await chrome.tabs.get(r);
                                    if (!n) return;
                                    const i = n.groupId ?? -1;
                                    if (!xe.isRecording(i)) return;
                                    let a, s;
                                    if ("computer" === e && t.action) {
                                        const e = t.action;
                                        if ("screenshot" === e) return;
                                        (a = {
                                            type: e,
                                            coordinate: t.coordinate,
                                            start_coordinate: t.start_coordinate,
                                            text: t.text,
                                            timestamp: Date.now(),
                                        }),
                                            e.includes("click")
                                                ? (a.description = "Clicked")
                                                : "type" === e && t.text
                                                  ? (a.description = `Typed: "${t.text}"`)
                                                  : "key" === e && t.text
                                                    ? (a.description = `Pressed key: ${t.text}`)
                                                    : (a.description =
                                                          "scroll" === e
                                                              ? "Scrolled"
                                                              : "left_click_drag" === e
                                                                ? "Dragged"
                                                                : e);
                                    } else
                                        "navigate" === e &&
                                            t.url &&
                                            (a = {
                                                type: "navigate",
                                                timestamp: Date.now(),
                                                description: `Navigated to ${t.url}`,
                                            });
                                    if (a && (a.type.includes("click") || "left_click_drag" === a.type)) {
                                        const e = xe.getFrames(i);
                                        if (e.length > 0) {
                                            const t = e[e.length - 1],
                                                r = {
                                                    base64: t.base64,
                                                    action: a,
                                                    frameNumber: e.length,
                                                    timestamp: Date.now(),
                                                    viewportWidth: t.viewportWidth,
                                                    viewportHeight: t.viewportHeight,
                                                    devicePixelRatio: t.devicePixelRatio,
                                                };
                                            xe.addFrame(i, r);
                                        }
                                    }
                                    await new Promise((e) => setTimeout(e, 100));
                                    try {
                                        s = await re.screenshot(r);
                                    } catch (o) {
                                        return;
                                    }
                                    let c = 1;
                                    try {
                                        const e = await chrome.scripting.executeScript({
                                            target: { tabId: r },
                                            func: () => window.devicePixelRatio,
                                        });
                                        e && e[0]?.result && (c = e[0].result);
                                    } catch (o) {}
                                    const u = xe.getFrames(i).length,
                                        l = {
                                            base64: s.base64,
                                            action: a,
                                            frameNumber: u,
                                            timestamp: Date.now(),
                                            viewportWidth: s.viewportWidth || s.width,
                                            viewportHeight: s.viewportHeight || s.height,
                                            devicePixelRatio: c,
                                        };
                                    xe.addFrame(i, l);
                                } catch (o) {}
                            })(e, r, s.tabId)),
                        this.context.analytics?.track("claude_chrome.chat.tool_called", u),
                        o
                    );
                } catch (l) {
                    throw (
                        (this.context.analytics?.track("claude_chrome.chat.tool_called", {
                            ...u,
                            success: !1,
                            failureReason: "exception",
                        }),
                        l)
                    );
                }
            },
            i
        );
    }
    createAnthropicMessage() {
        return this.context.anthropicClient
            ? async (e) => {
                  if (!this.context.anthropicClient) throw new Error("Anthropic client not available");
                  const { modelClass: t, maxTokens: r, ...o } = e;
                  let n = this.context.model;
                  if ("small_fast" === t) {
                      const e = await i("chrome_ext_models");
                      n = e?.small_fast_model || "claude-haiku-4-5-20251001";
                  }
                  return await this.context.anthropicClient.beta.messages.create({
                      ...o,
                      max_tokens: r,
                      model: n,
                      betas: ["oauth-2025-04-20"],
                  });
              }
            : void 0;
    }
    async processToolResults(e) {
        const t = [],
            r = (e) => {
                if (e.error) return e.error;
                const t = [];
                if ((e.output && t.push({ type: "text", text: e.output }), e.tabContext)) {
                    const r = `\n\nTab Context:${e.tabContext.executedOnTabId ? `\n- Executed on tabId: ${e.tabContext.executedOnTabId}` : ""}\n- Available tabs:\n${e.tabContext.availableTabs.map((e) => `  • tabId ${e.id}: "${e.title}" (${e.url})`).join("\n")}`;
                    t.push({ type: "text", text: r });
                }
                if (e.base64Image) {
                    const r = e.imageFormat ? `image/${e.imageFormat}` : "image/png";
                    t.push({ type: "image", source: { type: "base64", media_type: r, data: e.base64Image } });
                }
                return t.length > 0 ? t : "";
            },
            o = (e, t) => {
                const o = !!t.error;
                return { type: "tool_result", tool_use_id: e, content: r(t), ...(o && { is_error: !0 }) };
            };
        for (const i of e)
            try {
                const e = await this.handleToolCall(i.name, i.input, i.id);
                if ("type" in e && "permission_required" === e.type) {
                    if (!this.context.onPermissionRequired || !this.context.tabId) {
                        t.push(o(i.id, { error: "Permission required but no handler or tab id available" }));
                        continue;
                    }
                    if (!(await this.context.onPermissionRequired(e, this.context.tabId))) {
                        t.push(
                            o(i.id, {
                                error:
                                    "update_plan" === i.name
                                        ? "Plan rejected by user. Ask the user how they would like to change the plan."
                                        : "Permission denied by user",
                            })
                        );
                        continue;
                    }
                    if ("update_plan" === i.name) {
                        t.push(
                            o(i.id, {
                                output: "User has approved your plan. You can now start executing the plan. Start with updating your todo list if applicable.",
                            })
                        );
                        continue;
                    }
                    const r = await this.handleToolCall(i.name, i.input, i.id);
                    if ("type" in r && "permission_required" === r.type)
                        throw new Error("Permission still required after granting");
                    t.push(o(i.id, r));
                } else t.push(o(i.id, e));
            } catch (n) {
                t.push(o(i.id, { error: n instanceof Error ? n.message : "Unknown error" }));
            }
        return t;
    }
}
var We = (function (e) {
    function t(t, r) {
        var o = e.call(this, "".concat(t, " ").concat(r)) || this;
        return (o.field = t), o;
    }
    return a(t, e), t;
})(Error);
function je(e) {
    return "string" == typeof e;
}
function ze(e) {
    return null != e;
}
function He(e) {
    return "object" === Object.prototype.toString.call(e).slice(8, -1).toLowerCase();
}
var Ke = "is not a string",
    Ye = "is not an object",
    Ve = "is nil";
function Je(e) {
    !(function (e) {
        if (!ze(e)) throw new We("Event", Ve);
        if ("object" != typeof e) throw new We("Event", Ye);
    })(e),
        (function (e) {
            if (!je(e.type)) throw new We(".type", Ke);
        })(e),
        "track" === e.type &&
            ((function (e) {
                if (!je(e.event)) throw new We(".event", Ke);
            })(e),
            (function (e) {
                if (!He(e.properties)) throw new We(".properties", Ye);
            })(e)),
        ["group", "identify"].includes(e.type) &&
            (function (e) {
                if (!He(e.traits)) throw new We(".traits", Ye);
            })(e),
        (function (e) {
            var t,
                r,
                o,
                n,
                i = ".userId/anonymousId/previousId/groupId",
                a =
                    null !==
                        (n =
                            null !== (o = null !== (r = (t = e).userId) && void 0 !== r ? r : t.anonymousId) &&
                            void 0 !== o
                                ? o
                                : t.groupId) && void 0 !== n
                        ? n
                        : t.previousId;
            if (!ze(a)) throw new We(i, Ve);
            if (!je(a)) throw new We(i, Ke);
        })(e);
}
var Xe = (function () {
    function e(e) {
        (this.user = e.user), (this.createMessageId = e.createMessageId);
    }
    return (
        (e.prototype.track = function (e, t, r, o) {
            return this.normalize(
                s(s({}, this.baseEvent()), {
                    event: e,
                    type: "track",
                    properties: null != t ? t : {},
                    options: s({}, r),
                    integrations: s({}, o),
                })
            );
        }),
        (e.prototype.page = function (e, t, r, o, n) {
            var i,
                a = { type: "page", properties: s({}, r), options: s({}, o), integrations: s({}, n) };
            return (
                null !== e &&
                    ((a.category = e),
                    (a.properties = null !== (i = a.properties) && void 0 !== i ? i : {}),
                    (a.properties.category = e)),
                null !== t && (a.name = t),
                this.normalize(s(s({}, this.baseEvent()), a))
            );
        }),
        (e.prototype.screen = function (e, t, r, o, n) {
            var i = { type: "screen", properties: s({}, r), options: s({}, o), integrations: s({}, n) };
            return (
                null !== e && (i.category = e),
                null !== t && (i.name = t),
                this.normalize(s(s({}, this.baseEvent()), i))
            );
        }),
        (e.prototype.identify = function (e, t, r, o) {
            return this.normalize(
                s(s({}, this.baseEvent()), {
                    type: "identify",
                    userId: e,
                    traits: null != t ? t : {},
                    options: s({}, r),
                    integrations: o,
                })
            );
        }),
        (e.prototype.group = function (e, t, r, o) {
            return this.normalize(
                s(s({}, this.baseEvent()), {
                    type: "group",
                    traits: null != t ? t : {},
                    options: s({}, r),
                    integrations: s({}, o),
                    groupId: e,
                })
            );
        }),
        (e.prototype.alias = function (e, t, r, o) {
            var n = { userId: e, type: "alias", options: s({}, r), integrations: s({}, o) };
            return (
                null !== t && (n.previousId = t),
                void 0 === e
                    ? this.normalize(s(s({}, n), this.baseEvent()))
                    : this.normalize(s(s({}, this.baseEvent()), n))
            );
        }),
        (e.prototype.baseEvent = function () {
            var e = { integrations: {}, options: {} };
            if (!this.user) return e;
            var t = this.user;
            return t.id() && (e.userId = t.id()), t.anonymousId() && (e.anonymousId = t.anonymousId()), e;
        }),
        (e.prototype.context = function (e) {
            var t,
                r = ["userId", "anonymousId", "timestamp"];
            delete e.integrations;
            var o = Object.keys(e),
                n = null !== (t = e.context) && void 0 !== t ? t : {},
                i = {};
            return (
                o.forEach(function (t) {
                    "context" !== t && (r.includes(t) ? c(i, t, e[t]) : c(n, t, e[t]));
                }),
                [n, i]
            );
        }),
        (e.prototype.normalize = function (e) {
            var t,
                r,
                o,
                n,
                i = Object.keys(null !== (t = e.integrations) && void 0 !== t ? t : {}).reduce(function (t, r) {
                    var o, n;
                    return s(
                        s({}, t),
                        (((o = {})[r] = Boolean(null === (n = e.integrations) || void 0 === n ? void 0 : n[r])), o)
                    );
                }, {});
            e.options =
                ((o = e.options || {}),
                (n = function (e, t) {
                    return void 0 !== t;
                }),
                Object.keys(o)
                    .filter(function (e) {
                        return n(e, o[e]);
                    })
                    .reduce(function (e, t) {
                        return (e[t] = o[t]), e;
                    }, {}));
            var a = s(s({}, i), null === (r = e.options) || void 0 === r ? void 0 : r.integrations),
                c = e.options ? this.context(e.options) : [],
                l = c[0],
                d = c[1];
            e.options;
            var h = u(e, ["options"]),
                p = s(s(s({ timestamp: new Date() }, h), { integrations: a, context: l }), d),
                f = s(s({}, p), { messageId: this.createMessageId() });
            return Je(f), f;
        }),
        e
    );
})();
function Qe(e, t) {
    return new Promise(function (r, o) {
        var n = setTimeout(function () {
            o(Error("Promise timed out"));
        }, t);
        e.then(function (e) {
            return clearTimeout(n), r(e);
        }).catch(o);
    });
}
function Ze(e, t, r) {
    var o;
    return ((o = r),
    new Promise(function (e) {
        return setTimeout(e, o);
    }))
        .then(function () {
            return Qe(
                (function () {
                    try {
                        return Promise.resolve(t(e));
                    } catch (r) {
                        return Promise.reject(r);
                    }
                })(),
                1e3
            );
        })
        .catch(function (t) {
            null == e || e.log("warn", "Callback Error", { error: t }),
                null == e || e.stats.increment("callback_error");
        })
        .then(function () {
            return e;
        });
}
var et = (function () {
    function e(e) {
        var t;
        (this.callbacks = {}),
            (this.warned = !1),
            (this.maxListeners = null !== (t = null == e ? void 0 : e.maxListeners) && void 0 !== t ? t : 10);
    }
    return (
        (e.prototype.warnIfPossibleMemoryLeak = function (e) {
            this.warned || (this.maxListeners && this.callbacks[e].length > this.maxListeners && (this.warned = !0));
        }),
        (e.prototype.on = function (e, t) {
            return (
                this.callbacks[e]
                    ? (this.callbacks[e].push(t), this.warnIfPossibleMemoryLeak(e))
                    : (this.callbacks[e] = [t]),
                this
            );
        }),
        (e.prototype.once = function (e, t) {
            var r = this,
                o = function () {
                    for (var n = [], i = 0; i < arguments.length; i++) n[i] = arguments[i];
                    r.off(e, o), t.apply(r, n);
                };
            return this.on(e, o), this;
        }),
        (e.prototype.off = function (e, t) {
            var r,
                o = (null !== (r = this.callbacks[e]) && void 0 !== r ? r : []).filter(function (e) {
                    return e !== t;
                });
            return (this.callbacks[e] = o), this;
        }),
        (e.prototype.emit = function (e) {
            for (var t, r = this, o = [], n = 1; n < arguments.length; n++) o[n - 1] = arguments[n];
            return (
                (null !== (t = this.callbacks[e]) && void 0 !== t ? t : []).forEach(function (e) {
                    e.apply(r, o);
                }),
                this
            );
        }),
        e
    );
})();
function tt(e) {
    var t = Math.random() + 1,
        r = e.minTimeout,
        o = void 0 === r ? 500 : r,
        n = e.factor,
        i = void 0 === n ? 2 : n,
        a = e.attempt,
        s = e.maxTimeout,
        c = void 0 === s ? 1 / 0 : s;
    return Math.min(t * o * Math.pow(i, a), c);
}
var rt = "onRemoveFromFuture",
    ot = (function (e) {
        function t(t, r, o) {
            var n = e.call(this) || this;
            return (n.future = []), (n.maxAttempts = t), (n.queue = r), (n.seen = null != o ? o : {}), n;
        }
        return (
            a(t, e),
            (t.prototype.push = function () {
                for (var e = this, t = [], r = 0; r < arguments.length; r++) t[r] = arguments[r];
                var o = t.map(function (t) {
                    return !(e.updateAttempts(t) > e.maxAttempts || e.includes(t)) && (e.queue.push(t), !0);
                });
                return (
                    (this.queue = this.queue.sort(function (t, r) {
                        return e.getAttempts(t) - e.getAttempts(r);
                    })),
                    o
                );
            }),
            (t.prototype.pushWithBackoff = function (e) {
                var t = this;
                if (0 === this.getAttempts(e)) return this.push(e)[0];
                var r = this.updateAttempts(e);
                if (r > this.maxAttempts || this.includes(e)) return !1;
                var o = tt({ attempt: r - 1 });
                return (
                    setTimeout(function () {
                        t.queue.push(e),
                            (t.future = t.future.filter(function (t) {
                                return t.id !== e.id;
                            })),
                            t.emit(rt);
                    }, o),
                    this.future.push(e),
                    !0
                );
            }),
            (t.prototype.getAttempts = function (e) {
                var t;
                return null !== (t = this.seen[e.id]) && void 0 !== t ? t : 0;
            }),
            (t.prototype.updateAttempts = function (e) {
                return (this.seen[e.id] = this.getAttempts(e) + 1), this.getAttempts(e);
            }),
            (t.prototype.includes = function (e) {
                return (
                    this.queue.includes(e) ||
                    this.future.includes(e) ||
                    Boolean(
                        this.queue.find(function (t) {
                            return t.id === e.id;
                        })
                    ) ||
                    Boolean(
                        this.future.find(function (t) {
                            return t.id === e.id;
                        })
                    )
                );
            }),
            (t.prototype.pop = function () {
                return this.queue.shift();
            }),
            Object.defineProperty(t.prototype, "length", {
                get: function () {
                    return this.queue.length;
                },
                enumerable: !1,
                configurable: !0,
            }),
            Object.defineProperty(t.prototype, "todo", {
                get: function () {
                    return this.queue.length + this.future.length;
                },
                enumerable: !1,
                configurable: !0,
            }),
            t
        );
    })(et),
    nt = (function () {
        function e() {
            this._logs = [];
        }
        return (
            (e.prototype.log = function (e, t, r) {
                var o = new Date();
                this._logs.push({ level: e, message: t, time: o, extras: r });
            }),
            Object.defineProperty(e.prototype, "logs", {
                get: function () {
                    return this._logs;
                },
                enumerable: !1,
                configurable: !0,
            }),
            (e.prototype.flush = function () {
                if (this.logs.length > 1) {
                    var e = this._logs.reduce(function (e, t) {
                        var r,
                            o,
                            n,
                            i = s(s({}, t), { json: JSON.stringify(t.extras, null, " "), extras: t.extras });
                        delete i.time;
                        var a =
                            null !== (n = null === (o = t.time) || void 0 === o ? void 0 : o.toISOString()) &&
                            void 0 !== n
                                ? n
                                : "";
                        return (
                            e[a] && (a = "".concat(a, "-").concat(Math.random())), s(s({}, e), (((r = {})[a] = i), r))
                        );
                    }, {});
                    console.table && console.table(e);
                } else
                    this.logs.forEach(function (e) {
                        var t = e.level,
                            r = e.message,
                            o = e.extras;
                        "info" === t || "debug" === t || console[t](r, null != o ? o : "");
                    });
                this._logs = [];
            }),
            e
        );
    })(),
    it = (function (e) {
        function t() {
            return (null !== e && e.apply(this, arguments)) || this;
        }
        return (
            a(t, e),
            (t.prototype.gauge = function () {}),
            (t.prototype.increment = function () {}),
            (t.prototype.flush = function () {}),
            (t.prototype.serialize = function () {
                return [];
            }),
            t
        );
    })(
        (function () {
            function e() {
                this.metrics = [];
            }
            return (
                (e.prototype.increment = function (e, t, r) {
                    void 0 === t && (t = 1),
                        this.metrics.push({
                            metric: e,
                            value: t,
                            tags: null != r ? r : [],
                            type: "counter",
                            timestamp: Date.now(),
                        });
                }),
                (e.prototype.gauge = function (e, t, r) {
                    this.metrics.push({
                        metric: e,
                        value: t,
                        tags: null != r ? r : [],
                        type: "gauge",
                        timestamp: Date.now(),
                    });
                }),
                (e.prototype.flush = function () {
                    var e = this.metrics.map(function (e) {
                        return s(s({}, e), { tags: e.tags.join(",") });
                    });
                    console.table && console.table(e), (this.metrics = []);
                }),
                (e.prototype.serialize = function () {
                    return this.metrics.map(function (e) {
                        return {
                            m: e.metric,
                            v: e.value,
                            t: e.tags,
                            k: ((t = e.type), { gauge: "g", counter: "c" }[t]),
                            e: e.timestamp,
                        };
                        var t;
                    });
                }),
                e
            );
        })()
    ),
    at = (function () {
        return function (e) {
            var t, r, o;
            (this.retry = null === (t = e.retry) || void 0 === t || t),
                (this.type = null !== (r = e.type) && void 0 !== r ? r : "plugin Error"),
                (this.reason = null !== (o = e.reason) && void 0 !== o ? o : "");
        };
    })(),
    st = (function () {
        function e(e, t, r, o) {
            void 0 === t && (t = l()),
                void 0 === r && (r = new it()),
                void 0 === o && (o = new nt()),
                (this.attempts = 0),
                (this.event = e),
                (this._id = t),
                (this.logger = o),
                (this.stats = r);
        }
        return (
            (e.system = function () {}),
            (e.prototype.isSame = function (e) {
                return e.id === this.id;
            }),
            (e.prototype.cancel = function (e) {
                if (e) throw e;
                throw new at({ reason: "Context Cancel" });
            }),
            (e.prototype.log = function (e, t, r) {
                this.logger.log(e, t, r);
            }),
            Object.defineProperty(e.prototype, "id", {
                get: function () {
                    return this._id;
                },
                enumerable: !1,
                configurable: !0,
            }),
            (e.prototype.updateEvent = function (e, t) {
                var r;
                if ("integrations" === e.split(".")[0]) {
                    var o = e.split(".")[1];
                    if (!1 === (null === (r = this.event.integrations) || void 0 === r ? void 0 : r[o]))
                        return this.event;
                }
                return c(this.event, e, t), this.event;
            }),
            (e.prototype.failedDelivery = function () {
                return this._failedDelivery;
            }),
            (e.prototype.setFailedDelivery = function (e) {
                this._failedDelivery = e;
            }),
            (e.prototype.logs = function () {
                return this.logger.logs;
            }),
            (e.prototype.flush = function () {
                this.logger.flush(), this.stats.flush();
            }),
            (e.prototype.toJSON = function () {
                return { id: this._id, event: this.event, logs: this.logger.logs, metrics: this.stats.metrics };
            }),
            e
        );
    })();
function ct(e, t) {
    e.log("debug", "plugin", { plugin: t.name });
    var r = new Date().getTime(),
        o = t[e.event.type];
    return void 0 === o
        ? Promise.resolve(e)
        : (function (e) {
              return h(this, void 0, void 0, function () {
                  var t;
                  return p(this, function (r) {
                      switch (r.label) {
                          case 0:
                              return r.trys.push([0, 2, , 3]), [4, e()];
                          case 1:
                              return [2, r.sent()];
                          case 2:
                              return (t = r.sent()), [2, Promise.reject(t)];
                          case 3:
                              return [2];
                      }
                  });
              });
          })(function () {
              return o.apply(t, [e]);
          })
              .then(function (e) {
                  var o = new Date().getTime() - r;
                  return e.stats.gauge("plugin_time", o, ["plugin:".concat(t.name)]), e;
              })
              .catch(function (r) {
                  if (r instanceof at && "middleware_cancellation" === r.type) throw r;
                  return r instanceof at
                      ? (e.log("warn", r.type, { plugin: t.name, error: r }), r)
                      : (e.log("error", "plugin Error", { plugin: t.name, error: r }),
                        e.stats.increment("plugin_error", 1, ["plugin:".concat(t.name)]),
                        r);
              });
}
function ut(e, t) {
    return ct(e, t).then(function (t) {
        if (t instanceof st) return t;
        e.log("debug", "Context canceled"), e.stats.increment("context_canceled"), e.cancel(t);
    });
}
var lt = (function (e) {
    function t(t) {
        var r,
            o,
            n,
            i = e.call(this) || this;
        return (
            (i.criticalTasks =
                ((n = 0),
                {
                    done: function () {
                        return r;
                    },
                    run: function (e) {
                        var t,
                            i = e();
                        return (
                            "object" == typeof (t = i) &&
                                null !== t &&
                                "then" in t &&
                                "function" == typeof t.then &&
                                (1 === ++n &&
                                    (r = new Promise(function (e) {
                                        return (o = e);
                                    })),
                                i.finally(function () {
                                    return 0 === --n && o();
                                })),
                            i
                        );
                    },
                })),
            (i.plugins = []),
            (i.failedInitializations = []),
            (i.flushing = !1),
            (i.queue = t),
            i.queue.on(rt, function () {
                i.scheduleFlush(0);
            }),
            i
        );
    }
    return (
        a(t, e),
        (t.prototype.register = function (e, t, r) {
            return h(this, void 0, void 0, function () {
                var o = this;
                return p(this, function (n) {
                    switch (n.label) {
                        case 0:
                            return [
                                4,
                                Promise.resolve(t.load(e, r))
                                    .then(function () {
                                        o.plugins.push(t);
                                    })
                                    .catch(function (r) {
                                        if ("destination" === t.type)
                                            return (
                                                o.failedInitializations.push(t.name),
                                                void e.log("warn", "Failed to load destination", {
                                                    plugin: t.name,
                                                    error: r,
                                                })
                                            );
                                        throw r;
                                    }),
                            ];
                        case 1:
                            return n.sent(), [2];
                    }
                });
            });
        }),
        (t.prototype.deregister = function (e, t, r) {
            return h(this, void 0, void 0, function () {
                var o;
                return p(this, function (n) {
                    switch (n.label) {
                        case 0:
                            return n.trys.push([0, 3, , 4]), t.unload ? [4, Promise.resolve(t.unload(e, r))] : [3, 2];
                        case 1:
                            n.sent(), (n.label = 2);
                        case 2:
                            return (
                                (this.plugins = this.plugins.filter(function (e) {
                                    return e.name !== t.name;
                                })),
                                [3, 4]
                            );
                        case 3:
                            return (
                                (o = n.sent()),
                                e.log("warn", "Failed to unload destination", { plugin: t.name, error: o }),
                                [3, 4]
                            );
                        case 4:
                            return [2];
                    }
                });
            });
        }),
        (t.prototype.dispatch = function (e) {
            return h(this, void 0, void 0, function () {
                var t;
                return p(this, function (r) {
                    return (
                        e.log("debug", "Dispatching"),
                        e.stats.increment("message_dispatched"),
                        this.queue.push(e),
                        (t = this.subscribeToDelivery(e)),
                        this.scheduleFlush(0),
                        [2, t]
                    );
                });
            });
        }),
        (t.prototype.subscribeToDelivery = function (e) {
            return h(this, void 0, void 0, function () {
                var t = this;
                return p(this, function (r) {
                    return [
                        2,
                        new Promise(function (r) {
                            var o = function (n, i) {
                                n.isSame(e) && (t.off("flush", o), r(n));
                            };
                            t.on("flush", o);
                        }),
                    ];
                });
            });
        }),
        (t.prototype.dispatchSingle = function (e) {
            return h(this, void 0, void 0, function () {
                var t = this;
                return p(this, function (r) {
                    return (
                        e.log("debug", "Dispatching"),
                        e.stats.increment("message_dispatched"),
                        this.queue.updateAttempts(e),
                        (e.attempts = 1),
                        [
                            2,
                            this.deliver(e).catch(function (r) {
                                return t.enqueuRetry(r, e)
                                    ? t.subscribeToDelivery(e)
                                    : (e.setFailedDelivery({ reason: r }), e);
                            }),
                        ]
                    );
                });
            });
        }),
        (t.prototype.isEmpty = function () {
            return 0 === this.queue.length;
        }),
        (t.prototype.scheduleFlush = function (e) {
            var t = this;
            void 0 === e && (e = 500),
                this.flushing ||
                    ((this.flushing = !0),
                    setTimeout(function () {
                        t.flush().then(function () {
                            setTimeout(function () {
                                (t.flushing = !1), t.queue.length && t.scheduleFlush(0);
                            }, 0);
                        });
                    }, e));
        }),
        (t.prototype.deliver = function (e) {
            return h(this, void 0, void 0, function () {
                var t, r, o, n;
                return p(this, function (i) {
                    switch (i.label) {
                        case 0:
                            return [4, this.criticalTasks.done()];
                        case 1:
                            i.sent(), (t = Date.now()), (i.label = 2);
                        case 2:
                            return i.trys.push([2, 4, , 5]), [4, this.flushOne(e)];
                        case 3:
                            return (
                                (e = i.sent()),
                                (r = Date.now() - t),
                                this.emit("delivery_success", e),
                                e.stats.gauge("delivered", r),
                                e.log("debug", "Delivered", e.event),
                                [2, e]
                            );
                        case 4:
                            throw (
                                ((o = i.sent()),
                                (n = o),
                                e.log("error", "Failed to deliver", n),
                                this.emit("delivery_failure", e, n),
                                e.stats.increment("delivery_failed"),
                                o)
                            );
                        case 5:
                            return [2];
                    }
                });
            });
        }),
        (t.prototype.enqueuRetry = function (e, t) {
            return !(e instanceof at && !e.retry) && this.queue.pushWithBackoff(t);
        }),
        (t.prototype.flush = function () {
            return h(this, void 0, void 0, function () {
                var e, t;
                return p(this, function (r) {
                    switch (r.label) {
                        case 0:
                            if (0 === this.queue.length) return [2, []];
                            if (!(e = this.queue.pop())) return [2, []];
                            (e.attempts = this.queue.getAttempts(e)), (r.label = 1);
                        case 1:
                            return r.trys.push([1, 3, , 4]), [4, this.deliver(e)];
                        case 2:
                            return (e = r.sent()), this.emit("flush", e, !0), [3, 4];
                        case 3:
                            return (
                                (t = r.sent()),
                                this.enqueuRetry(t, e) ||
                                    (e.setFailedDelivery({ reason: t }), this.emit("flush", e, !1)),
                                [2, []]
                            );
                        case 4:
                            return [2, [e]];
                    }
                });
            });
        }),
        (t.prototype.isReady = function () {
            return !0;
        }),
        (t.prototype.availableExtensions = function (e) {
            var t,
                r,
                o = this.plugins.filter(function (t) {
                    var r, o, n;
                    if ("destination" !== t.type && "Segment.io" !== t.name) return !0;
                    var i = void 0;
                    return (
                        null === (r = t.alternativeNames) ||
                            void 0 === r ||
                            r.forEach(function (t) {
                                void 0 !== e[t] && (i = e[t]);
                            }),
                        null !== (n = null !== (o = e[t.name]) && void 0 !== o ? o : i) && void 0 !== n
                            ? n
                            : !1 !== ("Segment.io" === t.name || e.All)
                    );
                }),
                n =
                    ((t = "type"),
                    (r = {}),
                    o.forEach(function (e) {
                        var o,
                            n,
                            i = e[t];
                        void 0 !== (n = "string" != typeof i ? JSON.stringify(i) : i) &&
                            (r[n] = d(d([], null !== (o = r[n]) && void 0 !== o ? o : [], !0), [e], !1));
                    }),
                    r),
                i = n.before,
                a = void 0 === i ? [] : i,
                s = n.enrichment,
                c = void 0 === s ? [] : s,
                u = n.destination,
                l = void 0 === u ? [] : u,
                h = n.after;
            return { before: a, enrichment: c, destinations: l, after: void 0 === h ? [] : h };
        }),
        (t.prototype.flushOne = function (e) {
            var t, r;
            return h(this, void 0, void 0, function () {
                var o, n, i, a, s, c, u, l, d, h, f, m, g, b;
                return p(this, function (p) {
                    switch (p.label) {
                        case 0:
                            if (!this.isReady()) throw new Error("Not ready");
                            e.attempts > 1 && this.emit("delivery_retry", e),
                                (o = this.availableExtensions(
                                    null !== (t = e.event.integrations) && void 0 !== t ? t : {}
                                )),
                                (n = o.before),
                                (i = o.enrichment),
                                (a = 0),
                                (s = n),
                                (p.label = 1);
                        case 1:
                            return a < s.length ? ((c = s[a]), [4, ut(e, c)]) : [3, 4];
                        case 2:
                            (h = p.sent()) instanceof st && (e = h), this.emit("message_enriched", e, c), (p.label = 3);
                        case 3:
                            return a++, [3, 1];
                        case 4:
                            (u = 0), (l = i), (p.label = 5);
                        case 5:
                            return u < l.length ? ((d = l[u]), [4, ct(e, d)]) : [3, 8];
                        case 6:
                            (h = p.sent()) instanceof st && (e = h), this.emit("message_enriched", e, d), (p.label = 7);
                        case 7:
                            return u++, [3, 5];
                        case 8:
                            return (
                                (f = this.availableExtensions(
                                    null !== (r = e.event.integrations) && void 0 !== r ? r : {}
                                )),
                                (m = f.destinations),
                                (g = f.after),
                                [
                                    4,
                                    new Promise(function (t, r) {
                                        setTimeout(function () {
                                            var o = m.map(function (t) {
                                                return ct(e, t);
                                            });
                                            Promise.all(o).then(t).catch(r);
                                        }, 0);
                                    }),
                                ]
                            );
                        case 9:
                            return (
                                p.sent(),
                                e.stats.increment("message_delivered"),
                                this.emit("message_delivered", e),
                                (b = g.map(function (t) {
                                    return ct(e, t);
                                })),
                                [4, Promise.all(b)]
                            );
                        case 10:
                            return p.sent(), [2, e];
                    }
                });
            });
        }),
        t
    );
})(et);
const dt = "1.3.0";
class ht {
    constructor(e) {
        (this.id = l()), (this.items = []), (this.sizeInBytes = 0), (this.maxEventCount = Math.max(1, e));
    }
    tryAdd(e) {
        if (this.length === this.maxEventCount)
            return { success: !1, message: `Event limit of ${this.maxEventCount} has been exceeded.` };
        const t = this.calculateSize(e.context);
        return t > 32768
            ? { success: !1, message: "Event exceeds maximum event size of 32 KB" }
            : this.sizeInBytes + t > 491520
              ? { success: !1, message: "Event has caused batch size to exceed 480 KB" }
              : (this.items.push(e), (this.sizeInBytes += t), { success: !0 });
    }
    get length() {
        return this.items.length;
    }
    calculateSize(e) {
        return encodeURI(JSON.stringify(e.event)).split(/%..|i/).length;
    }
    getEvents() {
        return this.items.map(({ context: e }) => e.event);
    }
    getContexts() {
        return this.items.map((e) => e.context);
    }
    resolveEvents() {
        this.items.forEach(({ resolver: e, context: t }) => e(t));
    }
}
function pt(e) {
    return new Promise((t) => setTimeout(t, e));
}
function ft() {}
class mt {
    constructor(
        {
            host: e,
            path: t,
            maxRetries: r,
            flushAt: o,
            flushInterval: n,
            writeKey: i,
            httpRequestTimeout: a,
            httpClient: s,
            disable: c,
        },
        u
    ) {
        var l;
        (this._emitter = u),
            (this._maxRetries = r),
            (this._flushAt = Math.max(o, 1)),
            (this._flushInterval = n),
            (this._auth = ((l = `${i}:`), D.Buffer.from(l).toString("base64"))),
            (this._url = ((e, t) => new URL(t || "", e).href.replace(/\/$/, ""))(
                e ?? "https://api.segment.io",
                t ?? "/v1/batch"
            )),
            (this._httpRequestTimeout = a ?? 1e4),
            (this._disable = Boolean(c)),
            (this._httpClient = s);
    }
    createBatch() {
        this.pendingFlushTimeout && clearTimeout(this.pendingFlushTimeout);
        const e = new ht(this._flushAt);
        return (
            (this._batch = e),
            (this.pendingFlushTimeout = setTimeout(() => {
                e === this._batch && (this._batch = void 0),
                    (this.pendingFlushTimeout = void 0),
                    e.length && this.send(e).catch(ft);
            }, this._flushInterval)),
            e
        );
    }
    clearBatch() {
        this.pendingFlushTimeout && clearTimeout(this.pendingFlushTimeout), (this._batch = void 0);
    }
    flush(e) {
        if (!e) return;
        if (((this._flushPendingItemsCount = e), !this._batch)) return;
        this._batch.length === e && (this.send(this._batch).catch(ft), this.clearBatch());
    }
    enqueue(e) {
        const t = this._batch ?? this.createBatch(),
            { promise: r, resolve: o } = (function () {
                var e,
                    t,
                    r = new Promise(function (r, o) {
                        (e = r), (t = o);
                    });
                return { resolve: e, reject: t, promise: r };
            })(),
            n = { context: e, resolver: o };
        if (t.tryAdd(n).success) {
            const e = t.length === this._flushPendingItemsCount;
            return (t.length === this._flushAt || e) && (this.send(t).catch(ft), this.clearBatch()), r;
        }
        t.length && (this.send(t).catch(ft), this.clearBatch());
        const i = this.createBatch(),
            a = i.tryAdd(n);
        if (a.success) {
            return i.length === this._flushPendingItemsCount && (this.send(i).catch(ft), this.clearBatch()), r;
        }
        return e.setFailedDelivery({ reason: new Error(a.message) }), Promise.resolve(e);
    }
    async send(e) {
        this._flushPendingItemsCount && (this._flushPendingItemsCount -= e.length);
        const t = e.getEvents(),
            r = this._maxRetries + 1;
        let o = 0;
        for (; o < r; ) {
            let i;
            o++;
            try {
                if (this._disable) return e.resolveEvents();
                const r = {
                    url: this._url,
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Basic ${this._auth}`,
                        "User-Agent": "analytics-node-next/latest",
                    },
                    data: { batch: t, sentAt: new Date() },
                    httpRequestTimeout: this._httpRequestTimeout,
                };
                this._emitter.emit("http_request", { body: r.data, method: r.method, url: r.url, headers: r.headers });
                const o = await this._httpClient.makeRequest(r);
                if (o.status >= 200 && o.status < 300) return void e.resolveEvents();
                if (400 === o.status) return void gt(e, new Error(`[${o.status}] ${o.statusText}`));
                i = new Error(`[${o.status}] ${o.statusText}`);
            } catch (n) {
                i = n;
            }
            if (o === r) return void gt(e, i);
            await pt(tt({ attempt: o, minTimeout: 25, maxTimeout: 1e3 }));
        }
    }
}
function gt(e, t) {
    e.getContexts().forEach((e) => e.setFailedDelivery({ reason: t })), e.resolveEvents();
}
var bt = {};
const wt = () =>
    "object" == typeof process && process && bt && "string" == typeof process.version
        ? "node"
        : "object" == typeof window
          ? "browser"
          : "undefined" != typeof WebSocketPair
            ? "cloudflare-worker"
            : "string" == typeof EdgeRuntime
              ? "vercel-edge"
              : "undefined" != typeof WorkerGlobalScope && "function" == typeof importScripts
                ? "web-worker"
                : "unknown";
function yt(e) {
    function t(t) {
        return (
            (function (e) {
                e.updateEvent("context.library.name", "@segment/analytics-node"),
                    e.updateEvent("context.library.version", dt);
                const t = wt();
                "node" === t && e.updateEvent("_metadata.nodeVersion", process.version),
                    e.updateEvent("_metadata.jsRuntime", t);
            })(t),
            e.enqueue(t)
        );
    }
    return {
        name: "Segment.io",
        type: "destination",
        version: "1.0.0",
        isLoaded: () => !0,
        load: () => Promise.resolve(),
        alias: t,
        group: t,
        identify: t,
        page: t,
        screen: t,
        track: t,
    };
}
const vt = () => `node-next-${Date.now()}-${l()}`;
class It extends Xe {
    constructor() {
        super({ createMessageId: vt });
    }
}
class kt extends st {
    static system() {
        return new this({ type: "track", event: "system" });
    }
}
const Tt = async (e, t, r, o) => {
    try {
        const i = new kt(e),
            a = await (function (e, t, r, o) {
                return h(this, void 0, void 0, function () {
                    var n, i;
                    return p(this, function (a) {
                        switch (a.label) {
                            case 0:
                                return (
                                    r.emit("dispatch_start", e),
                                    (n = Date.now()),
                                    t.isEmpty() ? [4, t.dispatchSingle(e)] : [3, 2]
                                );
                            case 1:
                                return (i = a.sent()), [3, 4];
                            case 2:
                                return [4, t.dispatch(e)];
                            case 3:
                                (i = a.sent()), (a.label = 4);
                            case 4:
                                return (null == o ? void 0 : o.callback)
                                    ? [
                                          4,
                                          Ze(
                                              i,
                                              o.callback,
                                              ((s = n),
                                              (c = o.timeout),
                                              (u = Date.now() - s),
                                              Math.max((null != c ? c : 300) - u, 0))
                                          ),
                                      ]
                                    : [3, 6];
                            case 5:
                                (i = a.sent()), (a.label = 6);
                            case 6:
                                return (null == o ? void 0 : o.debug) && i.flush(), [2, i];
                        }
                        var s, c, u;
                    });
                });
            })(i, t, r, {
                ...(o
                    ? {
                          callback:
                              ((n = o),
                              (e) => {
                                  const t = e.failedDelivery();
                                  return n(t ? t.reason : void 0, e);
                              }),
                      }
                    : {}),
            }),
            s = a.failedDelivery();
        s ? r.emit("error", { code: "delivery_failure", reason: s.reason, ctx: a }) : r.emit(e.type, a);
    } catch (i) {
        r.emit("error", { code: "unknown", reason: i });
    }
    var n;
};
class _t extends et {}
class Et extends ot {
    constructor() {
        super(1, []);
    }
    getAttempts(e) {
        return e.attempts ?? 0;
    }
    updateAttempts(e) {
        return (e.attempts = this.getAttempts(e) + 1), this.getAttempts(e);
    }
}
class xt extends lt {
    constructor() {
        super(new Et());
    }
}
class Ct {
    constructor() {
        (this.onabort = null), (this.aborted = !1), (this.eventEmitter = new et());
    }
    toString() {
        return "[object AbortSignal]";
    }
    get [Symbol.toStringTag]() {
        return "AbortSignal";
    }
    removeEventListener(...e) {
        this.eventEmitter.off(...e);
    }
    addEventListener(...e) {
        this.eventEmitter.on(...e);
    }
    dispatchEvent(e) {
        const t = { type: e, target: this },
            r = `on${e}`;
        "function" == typeof this[r] && this[r](t), this.eventEmitter.emit(e, t);
    }
}
class St {
    constructor() {
        this.signal = new Ct();
    }
    abort() {
        this.signal.aborted || ((this.signal.aborted = !0), this.signal.dispatchEvent("abort"));
    }
    toString() {
        return "[object AbortController]";
    }
    get [Symbol.toStringTag]() {
        return "AbortController";
    }
}
const At = async (...e) => {
    if (globalThis.fetch) return globalThis.fetch(...e);
    if ("string" != typeof EdgeRuntime)
        return (
            await f(
                async () => {
                    const { default: e } = await import("./index-C4MT8w_j.js");
                    return { default: e };
                },
                __vite__mapDeps([0, 1])
            )
        ).default(...e);
    throw new Error("Invariant: an edge runtime that does not support fetch should not exist");
};
class Dt {
    constructor(e) {
        this._fetch = e ?? At;
    }
    async makeRequest(e) {
        const [t, r] = ((e) => {
                if ("cloudflare-worker" === wt()) return [];
                const t = new (globalThis.AbortController || St)(),
                    r = setTimeout(() => {
                        t.abort();
                    }, e);
                return r?.unref?.(), [t.signal, r];
            })(e.httpRequestTimeout),
            o = { url: e.url, method: e.method, headers: e.headers, body: JSON.stringify(e.data), signal: t };
        return this._fetch(e.url, o).finally(() => clearTimeout(r));
    }
}
class Mt extends _t {
    constructor(e) {
        super(),
            (this._isClosed = !1),
            (this._pendingEvents = 0),
            (this._isFlushing = !1),
            ((e) => {
                if (!e.writeKey) throw new We("writeKey", "writeKey is missing.");
            })(e),
            (this._eventFactory = new It()),
            (this._queue = new xt());
        const t = e.flushInterval ?? 1e4;
        this._closeAndFlushDefaultTimeout = 1.25 * t;
        const { plugin: r, publisher: o } = ((e, t) => {
            const r = new mt(e, t);
            return { publisher: r, plugin: yt(r) };
        })(
            {
                writeKey: e.writeKey,
                host: e.host,
                path: e.path,
                maxRetries: e.maxRetries ?? 3,
                flushAt: e.flushAt ?? e.maxEventsInBatch ?? 15,
                httpRequestTimeout: e.httpRequestTimeout,
                disable: e.disable,
                flushInterval: t,
                httpClient: "function" == typeof e.httpClient ? new Dt(e.httpClient) : (e.httpClient ?? new Dt()),
            },
            this
        );
        (this._publisher = o),
            (this.ready = this.register(r).then(() => {})),
            this.emit("initialize", e),
            (function (e) {
                for (var t = e.constructor.prototype, r = 0, o = Object.getOwnPropertyNames(t); r < o.length; r++) {
                    var n = o[r];
                    if ("constructor" !== n) {
                        var i = Object.getOwnPropertyDescriptor(e.constructor.prototype, n);
                        i && "function" == typeof i.value && (e[n] = e[n].bind(e));
                    }
                }
            })(this);
    }
    get VERSION() {
        return dt;
    }
    closeAndFlush({ timeout: e = this._closeAndFlushDefaultTimeout } = {}) {
        return this.flush({ timeout: e, close: !0 });
    }
    async flush({ timeout: e, close: t = !1 } = {}) {
        if (this._isFlushing) return;
        (this._isFlushing = !0), t && (this._isClosed = !0), this._publisher.flush(this._pendingEvents);
        const r = new Promise((e) => {
            this._pendingEvents
                ? this.once("drained", () => {
                      e();
                  })
                : e();
        }).finally(() => {
            this._isFlushing = !1;
        });
        return e ? Qe(r, e).catch(() => {}) : r;
    }
    _dispatch(e, t) {
        this._isClosed
            ? this.emit("call_after_close", e)
            : (this._pendingEvents++,
              Tt(e, this._queue, this, t)
                  .catch((e) => e)
                  .finally(() => {
                      this._pendingEvents--, this._pendingEvents || this.emit("drained");
                  }));
    }
    alias({ userId: e, previousId: t, context: r, timestamp: o, integrations: n }, i) {
        const a = this._eventFactory.alias(e, t, { context: r, integrations: n, timestamp: o });
        this._dispatch(a, i);
    }
    group({ timestamp: e, groupId: t, userId: r, anonymousId: o, traits: n = {}, context: i, integrations: a }, s) {
        const c = this._eventFactory.group(t, n, {
            context: i,
            anonymousId: o,
            userId: r,
            timestamp: e,
            integrations: a,
        });
        this._dispatch(c, s);
    }
    identify({ userId: e, anonymousId: t, traits: r = {}, context: o, timestamp: n, integrations: i }, a) {
        const s = this._eventFactory.identify(e, r, {
            context: o,
            anonymousId: t,
            userId: e,
            timestamp: n,
            integrations: i,
        });
        this._dispatch(s, a);
    }
    page(
        { userId: e, anonymousId: t, category: r, name: o, properties: n, context: i, timestamp: a, integrations: s },
        c
    ) {
        const u = this._eventFactory.page(r ?? null, o ?? null, n, {
            context: i,
            anonymousId: t,
            userId: e,
            timestamp: a,
            integrations: s,
        });
        this._dispatch(u, c);
    }
    screen(
        { userId: e, anonymousId: t, category: r, name: o, properties: n, context: i, timestamp: a, integrations: s },
        c
    ) {
        const u = this._eventFactory.screen(r ?? null, o ?? null, n, {
            context: i,
            anonymousId: t,
            userId: e,
            timestamp: a,
            integrations: s,
        });
        this._dispatch(u, c);
    }
    track({ userId: e, anonymousId: t, event: r, properties: o, context: n, timestamp: i, integrations: a }, s) {
        const c = this._eventFactory.track(r, o, {
            context: n,
            userId: e,
            anonymousId: t,
            timestamp: i,
            integrations: a,
        });
        this._dispatch(c, s);
    }
    register(...e) {
        return this._queue.criticalTasks.run(async () => {
            const t = kt.system(),
                r = e.map((e) => this._queue.register(t, e, this));
            await Promise.all(r),
                this.emit(
                    "register",
                    e.map((e) => e.name)
                );
        });
    }
    async deregister(...e) {
        const t = kt.system(),
            r = e.map((e) => {
                const r = this._queue.plugins.find((t) => t.name === e);
                if (r) return this._queue.deregister(t, r, this);
                t.log("warn", `plugin ${e} not found`);
            });
        await Promise.all(r), this.emit("deregister", e);
    }
}
let Rt = null,
    Ut = null,
    Pt = null;
const Bt = async (e, t) => {
        const r = await fetch(e, t);
        return {
            status: r.status,
            statusText: r.statusText,
            headers: Object.fromEntries(r.headers.entries()),
            json: () => r.json(),
            text: () => r.text(),
        };
    },
    Gt = async () => {
        if (Ut) return Ut;
        Rt ||
            ((Ut = (async () => {
                try {
                    const e = g();
                    e.segmentWriteKey,
                        (Rt = new Mt({ writeKey: e.segmentWriteKey, flushAt: 1, flushInterval: 1e4, httpClient: Bt })),
                        await $t();
                } catch (e) {}
            })()),
            await Ut);
    },
    $t = async () => {
        if (Rt)
            try {
                const t = await (async () => {
                        try {
                            const t = await e();
                            if (!t) return null;
                            const r = `${g().apiBaseUrl}/api/oauth/profile`,
                                o = await fetch(r, {
                                    headers: { Authorization: `Bearer ${t}`, "Content-Type": "application/json" },
                                });
                            return o.ok ? await o.json() : null;
                        } catch {
                            return null;
                        }
                    })(),
                    r = await m(),
                    o = chrome.runtime.getManifest().version;
                t
                    ? ((Pt = t.account.uuid),
                      Rt.identify({ userId: Pt, anonymousId: r, traits: { ...b(t), extensionVersion: o } }))
                    : (Pt = null);
            } catch (t) {}
    },
    Ot = async (e, t = {}) => {
        try {
            if ((Rt || (await Gt()), !Rt)) return;
            const r = await m(),
                o = chrome.runtime.getManifest().version,
                n = { anonymousId: r, event: e, properties: { ...t, extension_version: o } };
            Pt && (n.userId = Pt), Rt.track(n);
        } catch (r) {}
    };
let Lt, Nt, Ft, qt, Wt, jt;
async function zt() {
    const [e, r] = await Promise.all([w(t.SELECTED_MODEL), i("chrome_ext_models")]);
    return e || r?.default || "claude-3-5-sonnet-20241022";
}
async function Ht(e, t) {
    if (qt) return (qt.context.tabId = e), (qt.context.tabGroupId = t), qt;
    const [r, o] = await Promise.all([Kt(), zt()]);
    return (
        (qt = new qe({
            anthropicClient: r,
            permissionManager: new T(() => !1, {}),
            sessionId: fe,
            tabId: e,
            tabGroupId: t,
            model: o,
            onPermissionRequired: async (e, t) => await or(e, t),
        })),
        qt
    );
}
async function Kt() {
    const [t, { anthropicApiKey: r }] = await Promise.all([e(), chrome.storage.local.get("anthropicApiKey")]),
        o = r || void 0;
    if (((Nt !== t || Ft !== o) && ((Lt = void 0), (Nt = t), (Ft = o)), Lt)) return Lt;
    if (!t && !o) return;
    const n = g();
    return (
        (Lt = new I({ baseURL: n.apiBaseUrl, dangerouslyAllowBrowser: !0, ...(t ? { authToken: t } : { apiKey: o }) })),
        Lt
    );
}
const Yt = (e) => ({ content: [{ type: "text", text: e }], is_error: !0 });
async function Vt(e) {
    const t = crypto.randomUUID(),
        r = e.clientId,
        o = Date.now();
    if (Wt && jt) {
        if (Date.now() - jt < 6e4) {
            const t = Wt;
            return (
                (Wt = void 0),
                (jt = void 0),
                Ot("claude_chrome.mcp.tool_called", {
                    tool_name: e.toolName,
                    client_id: r,
                    success: !1,
                    error_type: "navigation_blocked",
                    duration_ms: Date.now() - o,
                }),
                Yt(t)
            );
        }
        (Wt = void 0), (jt = void 0);
    }
    let n, i;
    try {
        n = await K.getTabForMcp(e.tabId, e.tabGroupId);
    } catch {
        return (
            Ot("claude_chrome.mcp.tool_called", {
                tool_name: e.toolName,
                client_id: r,
                success: !1,
                error_type: "no_tabs_available",
                duration_ms: Date.now() - o,
            }),
            Yt("No tabs available. Please open a new tab or window in Chrome.")
        );
    }
    if (void 0 !== n)
        try {
            const e = await re.isDebuggerAttached(n);
            await re.attachDebugger(n), e || (await new Promise((e) => setTimeout(e, 500)));
        } catch (c) {}
    let a,
        s = !1;
    try {
        void 0 !== n &&
            (await (async function (e, t, r, o) {
                if (
                    (Jt.set(e, { toolName: t, requestId: r, startTime: Date.now(), errorCallback: o }),
                    await K.addTabToIndicatorGroup({ tabId: e, isRunning: !0, isMcp: !0 }),
                    Xt.has(e))
                ) {
                    const t = Xt.get(e);
                    t && clearTimeout(t), K.addLoadingPrefix(e).catch(() => {}), Xt.set(e, null);
                } else K.addLoadingPrefix(e).catch(() => {}), Xt.set(e, null);
            })(n, e.toolName, t, (e) => {
                (Wt = e), (jt = Date.now());
            }));
        const r = await Ht(n, e.tabGroupId);
        ([i] = await r.processToolResults([{ type: "tool_use", id: t, name: e.toolName, input: e.args }])),
            (s = !0 === i?.is_error);
    } catch (c) {
        (s = !0),
            c instanceof Error &&
            (c.message.includes("401") ||
                c.message.includes("authentication") ||
                c.message.includes("invalid x-api-key"))
                ? ((Lt = void 0),
                  (Nt = void 0),
                  (Ft = void 0),
                  (a = "authentication_failed"),
                  (i = Yt(
                      "Authentication failed. The extension may need to be re-authenticated. Please check your login status in the extension or configure an API key in settings."
                  )))
                : ((a = "execution_error"), (i = Yt(c instanceof Error ? c.message : String(c))));
    }
    return (
        void 0 !== n && Zt(n, r),
        Ot("claude_chrome.mcp.tool_called", {
            tool_name: e.toolName,
            client_id: r,
            success: !s,
            tab_id: n,
            tab_group_id: e.tabGroupId,
            duration_ms: Date.now() - o,
            ...(a && { error_type: a }),
        }),
        i
    );
}
const Jt = new Map(),
    Xt = new Map(),
    Qt = 2e4;
function Zt(e, t) {
    if (Jt.has(e)) {
        Jt.get(e);
        Jt.delete(e);
        const t = setTimeout(async () => {
            if (!Jt.has(e) && Xt.has(e)) {
                K.addCompletionPrefix(e).catch(() => {}), Xt.set(e, null);
                try {
                    await re.detachDebugger(e);
                } catch (t) {}
            }
        }, Qt);
        Xt.set(e, t);
    }
}
function er(e) {
    const t = Xt.get(e);
    t && clearTimeout(t), Xt.delete(e), K.removePrefix(e).catch(() => {});
}
async function tr() {
    try {
        const e = await K.getAllGroups();
        for (const t of e) er(t.mainTabId);
    } catch (e) {}
}
let rr = Promise.resolve(!0);
async function or(e, t) {
    const r = rr.then(() =>
        (async function (e, t) {
            const r = crypto.randomUUID(),
                o = Date.now(),
                n = Xt.get(t);
            n && clearTimeout(n);
            return (
                await K.addPermissionPrefix(t),
                Xt.set(t, null),
                await chrome.storage.local.set({ [`mcp_prompt_${r}`]: { prompt: e, tabId: t, timestamp: Date.now() } }),
                Ot("claude_chrome.permission.prompted", { permission_type: e.type, tool_type: e.tool, tab_id: t }),
                new Promise((n) => {
                    let i,
                        a = !1;
                    const s = async (s = !1) => {
                            a ||
                                ((a = !0),
                                chrome.runtime.onMessage.removeListener(c),
                                Ot("claude_chrome.permission.responded", {
                                    permission_type: e.type,
                                    tool_type: e.tool,
                                    tab_id: t,
                                    allowed: s,
                                    response_time_ms: Date.now() - o,
                                }),
                                await chrome.storage.local.remove(`mcp_prompt_${r}`),
                                i && chrome.windows.remove(i).catch(() => {}),
                                await K.addLoadingPrefix(t),
                                Xt.set(t, null),
                                n(s));
                        },
                        c = (e) => {
                            "MCP_PERMISSION_RESPONSE" === e.type && e.requestId === r && s(e.allowed);
                        };
                    chrome.runtime.onMessage.addListener(c),
                        chrome.windows.create(
                            {
                                url: chrome.runtime.getURL(
                                    `sidepanel.html?tabId=${t}&mcpPermissionOnly=true&requestId=${r}`
                                ),
                                type: "popup",
                                width: 600,
                                height: 600,
                                focused: !0,
                            },
                            (e) => {
                                e ? (i = e.id) : s(!1);
                            }
                        ),
                        setTimeout(() => {
                            s(!1);
                        }, 3e4);
                })
            );
        })(e, t)
    );
    return (rr = r.catch(() => !1)), r;
}
chrome.webNavigation.onBeforeNavigate.addListener(async (e) => {
    if (0 !== e.frameId || ((t = e.tabId), !Jt.has(t))) return;
    var t;
    const r = Jt.get(e.tabId);
    if (!r) return;
    const { isMainTab: o, isSecondaryTab: n } = await Re(e.tabId, e.tabId);
    if (!o && !n) return;
    const i = (await y("chrome_ext_domain_transition_prompts")) || !1,
        a = (await Ht(e.tabId)).context.permissionManager;
    try {
        const t = await Ge(e.tabId, e.url);
        if ("category1" === t) {
            const t = $e(e.url);
            return (
                await chrome.tabs.update(e.tabId, { url: t }),
                r?.errorCallback &&
                    r.errorCallback("Cannot access this page. Claude cannot assist with the content on this page."),
                void Zt(e.tabId)
            );
        }
        const o = await chrome.tabs.get(e.tabId);
        if (!i) return;
        const s = await (async function (e, t, r, o) {
            const n = t;
            "category3" === o && r.setForcePrompt
                ? r.setForcePrompt(!0)
                : "category3" !== o && r.setForcePrompt && r.setForcePrompt(!1);
            const i = Be(e, t);
            if (!i) return { shouldPrompt: !1, transition: null, finalUrl: n };
            const { oldDomain: a, newDomain: s } = i;
            return {
                shouldPrompt: (await r.checkDomainTransition(a, s)).needsPrompt ?? !1,
                transition: i,
                finalUrl: n,
            };
        })(o.url, e.url, a, t);
        if (!s.shouldPrompt || !s.transition) return;
        const { oldDomain: c, newDomain: u } = s.transition;
        chrome.tabs.update(e.tabId, { url: o.url });
        const l = Oe(c, u, s.finalUrl, e.tabId, !!n);
        (await or(l, e.tabId))
            ? chrome.tabs.update(e.tabId, { url: s.finalUrl })
            : r?.errorCallback &&
              r.errorCallback(
                  `Permission denied by user. Domain transition denied: Navigation from ${c} to ${u} was not permitted`
              );
    } catch (s) {}
});
export {
    De as A,
    j as B,
    Me as C,
    $ as D,
    P as E,
    ye as F,
    we as G,
    G as H,
    re as I,
    L as J,
    tr as K,
    Yt as L,
    Vt as M,
    Ot as N,
    Gt as O,
    $t as P,
    Re as a,
    D as b,
    Ue as c,
    $e as d,
    Be as e,
    Oe as f,
    R as g,
    pe as h,
    de as i,
    ie as j,
    Y as k,
    he as l,
    Ie as m,
    be as n,
    ge as o,
    O as p,
    me as q,
    le as r,
    B as s,
    K as t,
    Ge as u,
    ke as v,
    Te as w,
    _e as x,
    Ee as y,
    Ce as z,
};
