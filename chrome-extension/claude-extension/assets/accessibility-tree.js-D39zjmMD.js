(function () {
    window.__claudeElementMap || (window.__claudeElementMap = {}),
        window.__claudeRefCounter || (window.__claudeRefCounter = 0),
        (window.__generateAccessibilityTree = function (e, t, r) {
            try {
                let f = function (e) {
                        var t = e.getAttribute("role");
                        if (t) return t;
                        var r = e.tagName.toLowerCase(),
                            i = e.getAttribute("type");
                        return (
                            {
                                a: "link",
                                button: "button",
                                input:
                                    "submit" === i || "button" === i
                                        ? "button"
                                        : "checkbox" === i
                                          ? "checkbox"
                                          : "radio" === i
                                            ? "radio"
                                            : "file" === i
                                              ? "button"
                                              : "textbox",
                                select: "combobox",
                                textarea: "textbox",
                                h1: "heading",
                                h2: "heading",
                                h3: "heading",
                                h4: "heading",
                                h5: "heading",
                                h6: "heading",
                                img: "image",
                                nav: "navigation",
                                main: "main",
                                header: "banner",
                                footer: "contentinfo",
                                section: "region",
                                article: "article",
                                aside: "complementary",
                                form: "form",
                                table: "table",
                                ul: "list",
                                ol: "list",
                                li: "listitem",
                                label: "label",
                            }[r] || "generic"
                        );
                    },
                    h = function (e) {
                        var t = e.tagName.toLowerCase();
                        if ("select" === t) {
                            var r = e,
                                i = r.querySelector("option[selected]") || r.options[r.selectedIndex];
                            if (i && i.textContent) return i.textContent.trim();
                        }
                        var n = e.getAttribute("aria-label");
                        if (n && n.trim()) return n.trim();
                        var a = e.getAttribute("placeholder");
                        if (a && a.trim()) return a.trim();
                        var o = e.getAttribute("title");
                        if (o && o.trim()) return o.trim();
                        var l = e.getAttribute("alt");
                        if (l && l.trim()) return l.trim();
                        if (e.id) {
                            var u = document.querySelector('label[for="' + e.id + '"]');
                            if (u && u.textContent && u.textContent.trim()) return u.textContent.trim();
                        }
                        if ("input" === t) {
                            var d = e,
                                c = e.getAttribute("type") || "",
                                f = e.getAttribute("value");
                            if ("submit" === c && f && f.trim()) return f.trim();
                            if (d.value && d.value.length < 50 && d.value.trim()) return d.value.trim();
                        }
                        if (["button", "a", "summary"].includes(t)) {
                            for (var h = "", g = 0; g < e.childNodes.length; g++) {
                                var m = e.childNodes[g];
                                m.nodeType === Node.TEXT_NODE && (h += m.textContent);
                            }
                            if (h.trim()) return h.trim();
                        }
                        if (t.match(/^h[1-6]$/)) {
                            var s = e.textContent;
                            if (s && s.trim()) return s.trim().substring(0, 100);
                        }
                        if ("img" === t) return "";
                        for (var w = "", p = 0; p < e.childNodes.length; p++) {
                            var b = e.childNodes[p];
                            b.nodeType === Node.TEXT_NODE && (w += b.textContent);
                        }
                        if (w && w.trim() && w.trim().length >= 3) {
                            var v = w.trim();
                            return v.length > 100 ? v.substring(0, 100) + "..." : v;
                        }
                        return "";
                    },
                    g = function (e) {
                        var t = window.getComputedStyle(e);
                        return (
                            "none" !== t.display &&
                            "hidden" !== t.visibility &&
                            "0" !== t.opacity &&
                            e.offsetWidth > 0 &&
                            e.offsetHeight > 0
                        );
                    },
                    m = function (e) {
                        var t = e.tagName.toLowerCase();
                        return (
                            ["a", "button", "input", "select", "textarea", "details", "summary"].includes(t) ||
                            null !== e.getAttribute("onclick") ||
                            null !== e.getAttribute("tabindex") ||
                            "button" === e.getAttribute("role") ||
                            "link" === e.getAttribute("role") ||
                            "true" === e.getAttribute("contenteditable")
                        );
                    },
                    s = function (e) {
                        var t = e.tagName.toLowerCase();
                        return (
                            [
                                "h1",
                                "h2",
                                "h3",
                                "h4",
                                "h5",
                                "h6",
                                "nav",
                                "main",
                                "header",
                                "footer",
                                "section",
                                "article",
                                "aside",
                            ].includes(t) || null !== e.getAttribute("role")
                        );
                    },
                    w = function (e, t) {
                        var r = e.tagName.toLowerCase();
                        if (["script", "style", "meta", "link", "title", "noscript"].includes(r)) return !1;
                        if ("all" !== t.filter && "true" === e.getAttribute("aria-hidden")) return !1;
                        if ("all" !== t.filter && !g(e)) return !1;
                        if ("all" !== t.filter && !t.refId) {
                            var i = e.getBoundingClientRect();
                            if (
                                !(
                                    i.top < window.innerHeight &&
                                    i.bottom > 0 &&
                                    i.left < window.innerWidth &&
                                    i.right > 0
                                )
                            )
                                return !1;
                        }
                        if ("interactive" === t.filter) return m(e);
                        if (m(e)) return !0;
                        if (s(e)) return !0;
                        if (h(e).length > 0) return !0;
                        var n = f(e);
                        return null !== n && "generic" !== n && "image" !== n;
                    },
                    p = function (e, t, r) {
                        if (!(t > n) && e && e.tagName) {
                            var a = w(e, r) || (null !== r.refId && 0 === t);
                            if (a) {
                                var o = f(e),
                                    l = h(e),
                                    u = null;
                                for (var d in window.__claudeElementMap)
                                    if (window.__claudeElementMap[d].deref() === e) {
                                        u = d;
                                        break;
                                    }
                                u ||
                                    ((u = "ref_" + ++window.__claudeRefCounter),
                                    (window.__claudeElementMap[u] = new WeakRef(e)));
                                var c = " ".repeat(t) + o;
                                l &&
                                    (c +=
                                        ' "' +
                                        (l = l.replace(/\s+/g, " ").substring(0, 100)).replace(/"/g, '\\"') +
                                        '"'),
                                    (c += " [" + u + "]"),
                                    e.getAttribute("href") && (c += ' href="' + e.getAttribute("href") + '"'),
                                    e.getAttribute("type") && (c += ' type="' + e.getAttribute("type") + '"'),
                                    e.getAttribute("placeholder") &&
                                        (c += ' placeholder="' + e.getAttribute("placeholder") + '"'),
                                    i.push(c);
                            }
                            if (e.children && t < n)
                                for (var g = 0; g < e.children.length; g++) p(e.children[g], a ? t + 1 : t, r);
                        }
                    };
                var i = [],
                    n = null != t ? t : 15,
                    a = { filter: e || "all", refId: r };
                if (r) {
                    var o = window.__claudeElementMap[r];
                    if (!o)
                        return {
                            error:
                                "Element with ref_id '" +
                                r +
                                "' not found. It may have been removed from the page. Use read_page without ref_id to get the current page state.",
                            pageContent: "",
                            viewport: { width: window.innerWidth, height: window.innerHeight },
                        };
                    var l = o.deref();
                    if (!l)
                        return {
                            error:
                                "Element with ref_id '" +
                                r +
                                "' no longer exists. It may have been removed from the page. Use read_page without ref_id to get the current page state.",
                            pageContent: "",
                            viewport: { width: window.innerWidth, height: window.innerHeight },
                        };
                    p(l, 0, a);
                } else document.body && p(document.body, 0, a);
                for (var u in window.__claudeElementMap)
                    window.__claudeElementMap[u].deref() || delete window.__claudeElementMap[u];
                var d = i.join("\n");
                if (d.length > 5e4) {
                    var c = "Output exceeds 50000 character limit (" + d.length + " characters). ";
                    return {
                        error: (c += r
                            ? "The specified element has too much content. Try specifying a smaller depth parameter or focus on a more specific child element."
                            : void 0 !== t
                              ? "Try specifying an even smaller depth parameter or use ref_id to focus on a specific element."
                              : "Try specifying a depth parameter (e.g., depth: 5) or use ref_id to focus on a specific element from the page."),
                        pageContent: "",
                        viewport: { width: window.innerWidth, height: window.innerHeight },
                    };
                }
                return { pageContent: d, viewport: { width: window.innerWidth, height: window.innerHeight } };
            } catch (f) {
                throw new Error("Error generating accessibility tree: " + (f.message || "Unknown error"));
            }
        });
})();
