var epic_social_social_modules;
(() => {
    "use strict";
    var e,
        a,
        r,
        t,
        o,
        i,
        c,
        n,
        l,
        d,
        f,
        s,
        u,
        b,
        p,
        h,
        m,
        v,
        g = {
            35791: (e, a, r) => {
                var t = {
                    "./LauncherOverlay": () =>
                        Promise.all([
                            r.e(7094),
                            r.e(5586),
                            r.e(7614),
                            r.e(9075),
                            r.e(2007),
                            r.e(9863),
                            r.e(102),
                            r.e(5601),
                            r.e(2871),
                            r.e(5558),
                            r.e(113),
                            r.e(8767),
                            r.e(4024),
                            r.e(2086),
                            r.e(9493),
                            r.e(9321),
                            r.e(7066),
                            r.e(4730),
                            r.e(4366),
                            r.e(8626),
                        ]).then(() => () => r(48626)),
                    "./LauncherSocialProvider": () =>
                        Promise.all([
                            r.e(2871),
                            r.e(4024),
                            r.e(9493),
                            r.e(4730),
                            r.e(6738),
                        ]).then(() => () => r(86738)),
                },
                    o = (e, a) => (
                        (r.R = a),
                        (a = r.o(t, e)
                            ? t[e]()
                            : Promise.resolve().then(() => {
                                throw new Error(
                                    'Module "' + e + '" does not exist in container.'
                                );
                            })),
                        (r.R = void 0),
                        a
                    ),
                    i = (e, a) => {
                        if (r.S) {
                            var t = "default",
                                o = r.S[t];
                            if (o && o !== e)
                                throw new Error(
                                    "Container initialization failed as it has already been initialized with a different share scope"
                                );
                            return (r.S[t] = e), r.I(t, a);
                        }
                    };
                r.d(a, { get: () => o, init: () => i });
            },
        },
        y = {};
    function P(e) {
        var a = y[e];
        if (void 0 !== a) return a.exports;
        var r = (y[e] = { id: e, loaded: !1, exports: {} });
        return g[e].call(r.exports, r, r.exports, P), (r.loaded = !0), r.exports;
    }
    (P.m = g),
        (P.c = y),
        (P.n = (e) => {
            var a = e && e.__esModule ? () => e.default : () => e;
            return P.d(a, { a }), a;
        }),
        (P.d = (e, a) => {
            for (var r in a)
                P.o(a, r) &&
                    !P.o(e, r) &&
                    Object.defineProperty(e, r, { enumerable: !0, get: a[r] });
        }),
        (P.f = {}),
        (P.e = (e) =>
            Promise.all(Object.keys(P.f).reduce((a, r) => (P.f[r](e, a), a), []))),
        (P.u = (e) =>
            e +
            "." +
            {
                22: "9591ee218dc5cd2959e9",
                102: "cfb71a0f54acca009f83",
                113: "514d2601f1d63fe45f59",
                211: "10730701196523143d75",
                324: "3fcc956824ecc2344746",
                366: "436b72211192d8840840",
                446: "3f15c2f64305ef01aac2",
                664: "bf9cafad27f3a83fce5a",
                739: "b4df62c67ab063fc9769",
                1989: "cfd252a07ed0330a9bf6",
                2007: "90447950d0874e22bb57",
                2048: "4357da2742126114b709",
                2086: "568f4cbbbb1b95bd4990",
                2221: "9d211be9e7b7026fba41",
                2481: "a12087772a71032e0b6d",
                2482: "2861eea9a0cd3ffce50a",
                2495: "0d328e905c47ccaa92a8",
                2555: "171fb12ce3660f026494",
                2814: "091305299fc3e34f63d2",
                2871: "62941c3a28d2c037b359",
                3185: "44e5820c51d2db1586f7",
                3332: "b0c29c017c80bbbe8d20",
                3483: "efcee3978a0db0441bd2",
                3859: "7a69d1beb95539bb3fbb",
                3925: "4fe3fa71870696de8045",
                4024: "9154e22b0c779c25a8b3",
                4151: "a9bd585db432ce39602e",
                4222: "e19724bc9ccade245148",
                4366: "c720a19dffb1e323884a",
                4545: "bff7209c573331fd0e7c",
                4730: "877f849582475e588285",
                4731: "b2393a178bfb9531f961",
                5183: "07af139092bb4e2e26e7",
                5242: "fac87eed9dad8adc62a2",
                5284: "06c5903bc39592fb853a",
                5529: "bfae62f7b0e8649510af",
                5558: "94ef85c856e6cae52a25",
                5561: "834f7577b042e14381aa",
                5586: "02a03a1f729485ea77ab",
                5601: "0ae9a9503019276e0fee",
                5640: "e7cf3ff65a90e85fcf9f",
                5746: "662bc91485a9a0a3fc52",
                6204: "b49073f651fe8d73a9bf",
                6738: "dd582aafeaf81699e9f0",
                6742: "97ed6efec2d4a7cd493e",
                7066: "918d7ac361327c4a75a2",
                7094: "61620e70add9cf7544ed",
                7331: "e3bd9e3ce043b5118f57",
                7614: "e7fbe08d95b12b7d202d",
                8213: "bbe21b5dd94df936710e",
                8247: "8743da45719b459933ef",
                8318: "e81c7b4f16b80afaae74",
                8508: "c4521e0eb58c3f99bf2a",
                8626: "5d170690c98e24c7c09c",
                8767: "873b15264b4a81fc61e9",
                8816: "334165e22cdc4250646a",
                9075: "6995e3acad578e3ddac2",
                9102: "7bfb53410cec14d09686",
                9231: "1e35783530732fb44c4e",
                9321: "91726d583f416247e162",
                9427: "731b84f93419b07a4c19",
                9493: "e44cf69752b732a8a0bd",
                9541: "d616b00ab3c45308db81",
                9589: "2be9168e0125fd27261a",
                9737: "bc33a1e60273297b70fb",
                9863: "431ab1e57cf87bfba14b",
            }[e] +
            ".js"),
        (P.g = (function () {
            if ("object" == typeof globalThis) return globalThis;
            try {
                return this || new Function("return this")();
            } catch (e) {
                if ("object" == typeof window) return window;
            }
        })()),
        (P.hmd = (e) => (
            (e = Object.create(e)).children || (e.children = []),
            Object.defineProperty(e, "exports", {
                enumerable: !0,
                set: () => {
                    throw new Error(
                        "ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead: " +
                        e.id
                    );
                },
            }),
            e
        )),
        (P.o = (e, a) => Object.prototype.hasOwnProperty.call(e, a)),
        (e = {}),
        (a = "@epic-social/social-modules:"),
        (P.l = (r, t, o, i) => {
            if (e[r]) e[r].push(t);
            else {
                var c, n;
                if (void 0 !== o)
                    for (
                        var l = document.getElementsByTagName("script"), d = 0;
                        d < l.length;
                        d++
                    ) {
                        var f = l[d];
                        if (
                            f.getAttribute("src") == r ||
                            f.getAttribute("data-webpack") == a + o
                        ) {
                            c = f;
                            break;
                        }
                    }
                c ||
                    ((n = !0),
                        ((c = document.createElement("script")).charset = "utf-8"),
                        (c.timeout = 120),
                        P.nc && c.setAttribute("nonce", P.nc),
                        c.setAttribute("data-webpack", a + o),
                        (c.src = r)),
                    (e[r] = [t]);
                var s = (a, t) => {
                    (c.onerror = c.onload = null), clearTimeout(u);
                    var o = e[r];
                    if (
                        (delete e[r],
                            c.parentNode && c.parentNode.removeChild(c),
                            o && o.forEach((e) => e(t)),
                            a)
                    )
                        return a(t);
                },
                    u = setTimeout(
                        s.bind(null, void 0, { type: "timeout", target: c }),
                        12e4
                    );
                (c.onerror = s.bind(null, c.onerror)),
                    (c.onload = s.bind(null, c.onload)),
                    n && document.head.appendChild(c);
            }
        }),
        (P.r = (e) => {
            "undefined" != typeof Symbol &&
                Symbol.toStringTag &&
                Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
                Object.defineProperty(e, "__esModule", { value: !0 });
        }),
        (P.nmd = (e) => ((e.paths = []), e.children || (e.children = []), e)),
        (() => {
            P.S = {};
            var e = {},
                a = {};
            P.I = (r, t) => {
                t || (t = []);
                var o = a[r];
                if ((o || (o = a[r] = {}), !(t.indexOf(o) >= 0))) {
                    if ((t.push(o), e[r])) return e[r];
                    P.o(P.S, r) || (P.S[r] = {});
                    var i = P.S[r],
                        c = "@epic-social/social-modules",
                        n = (e, a, r, t) => {
                            var o = (i[e] = i[e] || {}),
                                n = o[a];
                            (!n || (!n.loaded && (!t != !n.eager ? t : c > n.from))) &&
                                (o[a] = { get: r, from: c, eager: !!t });
                        },
                        l = [];
                    return (
                        "default" === r &&
                        (n("@emotion/react", "11.11.0", () =>
                            Promise.all([P.e(3332), P.e(2871), P.e(5640)]).then(
                                () => () => P(63332)
                            )
                        ),
                            n("@epic-debug/performance", "1.0.2", () =>
                                P.e(211).then(() => () => P(211))
                            ),
                            n("@epic-social/broker", "0.0.0", () =>
                                Promise.all([
                                    P.e(7094),
                                    P.e(446),
                                    P.e(8213),
                                    P.e(739),
                                    P.e(2871),
                                    P.e(5558),
                                    P.e(113),
                                    P.e(5746),
                                    P.e(5242),
                                ]).then(() => () => P(35242))
                            ),
                            n("@epic-social/common-ui", "0.0.0", () =>
                                Promise.all([
                                    P.e(7094),
                                    P.e(5586),
                                    P.e(7614),
                                    P.e(8508),
                                    P.e(2007),
                                    P.e(9737),
                                    P.e(102),
                                    P.e(324),
                                    P.e(6204),
                                    P.e(2871),
                                    P.e(5558),
                                    P.e(113),
                                    P.e(8767),
                                    P.e(4024),
                                    P.e(9493),
                                    P.e(9321),
                                    P.e(3859),
                                    P.e(5561),
                                ]).then(() => () => P(53859))
                            ),
                            n("@epic-social/i18n", "0.0.0", () =>
                                Promise.all([P.e(2871), P.e(113), P.e(5284)]).then(
                                    () => () => P(55284)
                                )
                            ),
                            n("@epic-social/shared", "0.0.0", () =>
                                Promise.all([
                                    P.e(7094),
                                    P.e(5586),
                                    P.e(8508),
                                    P.e(9075),
                                    P.e(2007),
                                    P.e(3925),
                                    P.e(2871),
                                    P.e(5558),
                                    P.e(113),
                                    P.e(8767),
                                    P.e(4024),
                                    P.e(2086),
                                    P.e(9493),
                                    P.e(9321),
                                    P.e(7066),
                                    P.e(2048),
                                    P.e(5529),
                                ]).then(() => () => P(5529))
                            ),
                            n("@epic-social/store", "0.0.0", () =>
                                Promise.all([
                                    P.e(7094),
                                    P.e(9075),
                                    P.e(446),
                                    P.e(8213),
                                    P.e(9863),
                                    P.e(1989),
                                    P.e(2871),
                                    P.e(5558),
                                    P.e(113),
                                    P.e(4024),
                                    P.e(2086),
                                    P.e(5746),
                                    P.e(2495),
                                ]).then(() => () => P(72495))
                            ),
                            n("@epic-social/theme", "0.0.0", () =>
                                Promise.all([
                                    P.e(5586),
                                    P.e(7614),
                                    P.e(9737),
                                    P.e(9541),
                                    P.e(4545),
                                    P.e(2871),
                                    P.e(5558),
                                    P.e(113),
                                    P.e(8767),
                                    P.e(2555),
                                ]).then(() => () => P(48816))
                            ),
                            n("@epic-social/utils", "0.0.0", () =>
                                Promise.all([P.e(446), P.e(6742), P.e(2086), P.e(2221)]).then(
                                    () => () => P(32221)
                                )
                            ),
                            n("@material-ui/core", "4.12.4", () =>
                                Promise.all([
                                    P.e(5586),
                                    P.e(8508),
                                    P.e(324),
                                    P.e(9541),
                                    P.e(664),
                                    P.e(2871),
                                    P.e(5558),
                                ]).then(() => () => P(40664))
                            ),
                            n("react-dom", "17.0.2", () =>
                                Promise.all([P.e(4151), P.e(2871)]).then(() => () => P(64151))
                            ),
                            n("react", "17.0.2", () => P.e(9231).then(() => () => P(49231)))),
                        (e[r] = l.length ? Promise.all(l).then(() => (e[r] = 1)) : 1)
                    );
                }
            };
        })(),
        (P.p = "https://epic-social-social-modules-prod.ol.epicgames.com/"),
        (r = (e) => {
            var a = (e) => e.split(".").map((e) => (+e == e ? +e : e)),
                r = /^([^-+]+)?(?:-([^+]+))?(?:\+(.+))?$/.exec(e),
                t = r[1] ? a(r[1]) : [];
            return (
                r[2] && (t.length++, t.push.apply(t, a(r[2]))),
                r[3] && (t.push([]), t.push.apply(t, a(r[3]))),
                t
            );
        }),
        (t = (e, a) => {
            (e = r(e)), (a = r(a));
            for (var t = 0; ;) {
                if (t >= e.length) return t < a.length && "u" != (typeof a[t])[0];
                var o = e[t],
                    i = (typeof o)[0];
                if (t >= a.length) return "u" == i;
                var c = a[t],
                    n = (typeof c)[0];
                if (i != n) return ("o" == i && "n" == n) || "s" == n || "u" == i;
                if ("o" != i && "u" != i && o != c) return o < c;
                t++;
            }
        }),
        (o = (e) => {
            var a = e[0],
                r = "";
            if (1 === e.length) return "*";
            if (a + 0.5) {
                r +=
                    0 == a
                        ? ">="
                        : -1 == a
                            ? "<"
                            : 1 == a
                                ? "^"
                                : 2 == a
                                    ? "~"
                                    : a > 0
                                        ? "="
                                        : "!=";
                for (var t = 1, i = 1; i < e.length; i++)
                    t--,
                        (r +=
                            "u" == (typeof (n = e[i]))[0]
                                ? "-"
                                : (t > 0 ? "." : "") + ((t = 2), n));
                return r;
            }
            var c = [];
            for (i = 1; i < e.length; i++) {
                var n = e[i];
                c.push(
                    0 === n
                        ? "not(" + l() + ")"
                        : 1 === n
                            ? "(" + l() + " || " + l() + ")"
                            : 2 === n
                                ? c.pop() + " " + c.pop()
                                : o(n)
                );
            }
            return l();
            function l() {
                return c.pop().replace(/^\((.+)\)$/, "$1");
            }
        }),
        (i = (e, a) => {
            if (0 in e) {
                a = r(a);
                var t = e[0],
                    o = t < 0;
                o && (t = -t - 1);
                for (var c = 0, n = 1, l = !0; ; n++, c++) {
                    var d,
                        f,
                        s = n < e.length ? (typeof e[n])[0] : "";
                    if (c >= a.length || "o" == (f = (typeof (d = a[c]))[0]))
                        return !l || ("u" == s ? n > t && !o : ("" == s) != o);
                    if ("u" == f) {
                        if (!l || "u" != s) return !1;
                    } else if (l)
                        if (s == f)
                            if (n <= t) {
                                if (d != e[n]) return !1;
                            } else {
                                if (o ? d > e[n] : d < e[n]) return !1;
                                d != e[n] && (l = !1);
                            }
                        else if ("s" != s && "n" != s) {
                            if (o || n <= t) return !1;
                            (l = !1), n--;
                        } else {
                            if (n <= t || f < s != o) return !1;
                            l = !1;
                        }
                    else "s" != s && "n" != s && ((l = !1), n--);
                }
            }
            var u = [],
                b = u.pop.bind(u);
            for (c = 1; c < e.length; c++) {
                var p = e[c];
                u.push(1 == p ? b() | b() : 2 == p ? b() & b() : p ? i(p, a) : !b());
            }
            return !!b();
        }),
        (c = (e, a) => {
            var r = e[a];
            return Object.keys(r).reduce(
                (e, a) => (!e || (!r[e].loaded && t(e, a)) ? a : e),
                0
            );
        }),
        (n = (e, a, r, t) =>
            "Unsatisfied version " +
            r +
            " from " +
            (r && e[a][r].from) +
            " of shared singleton module " +
            a +
            " (required " +
            o(t) +
            ")"),
        (l = (e, a, r, t) => {
            var o = c(e, r);
            return i(t, o) || f(n(e, r, o, t)), s(e[r][o]);
        }),
        (d = (e, a, r) => {
            var o = e[a];
            return (
                (a = Object.keys(o).reduce(
                    (e, a) => (!i(r, a) || (e && !t(e, a)) ? e : a),
                    0
                )) && o[a]
            );
        }),
        (f = (e) => {
            "undefined" != typeof console && console.warn && console.warn(e);
        }),
        (s = (e) => ((e.loaded = 1), e.get())),
        (b = (u = (e) =>
            function (a, r, t, o) {
                var i = P.I(a);
                return i && i.then
                    ? i.then(e.bind(e, a, P.S[a], r, t, o))
                    : e(a, P.S[a], r, t, o);
            })((e, a, r, t, o) => (a && P.o(a, r) ? l(a, 0, r, t) : o()))),
        (p = u((e, a, r, t, o) => {
            var i = a && P.o(a, r) && d(a, r, t);
            return i ? s(i) : o();
        })),
        (h = {}),
        (m = {
            52871: () =>
                b("default", "react", [4, 17, 0, 2], () =>
                    P.e(9231).then(() => () => P(49231))
                ),
            55558: () =>
                b("default", "react-dom", [4, 17, 0, 2], () =>
                    P.e(4151).then(() => () => P(64151))
                ),
            90113: () =>
                p("default", "@epic-social/utils", [0], () =>
                    Promise.all([P.e(446), P.e(6742), P.e(2086), P.e(2221)]).then(
                        () => () => P(32221)
                    )
                ),
            87510: () =>
                p("default", "@material-ui/core", [4, 4, 12, 4], () =>
                    Promise.all([P.e(8508), P.e(324), P.e(9541), P.e(664)]).then(
                        () => () => P(40664)
                    )
                ),
            97121: () =>
                p("default", "@emotion/react", [4, 11, 11, 0], () =>
                    P.e(3332).then(() => () => P(63332))
                ),
            24024: () =>
                p("default", "@epic-social/broker", [0], () =>
                    Promise.all([
                        P.e(7094),
                        P.e(446),
                        P.e(8213),
                        P.e(739),
                        P.e(5558),
                        P.e(113),
                        P.e(5746),
                        P.e(5242),
                    ]).then(() => () => P(35242))
                ),
            69493: () =>
                p("default", "@epic-social/store", [0], () =>
                    Promise.all([
                        P.e(7094),
                        P.e(9075),
                        P.e(446),
                        P.e(8213),
                        P.e(9863),
                        P.e(1989),
                        P.e(5558),
                        P.e(113),
                        P.e(2086),
                        P.e(5746),
                        P.e(2495),
                    ]).then(() => () => P(72495))
                ),
            49321: () =>
                p("default", "@epic-social/i18n", [0], () =>
                    P.e(5284).then(() => () => P(55284))
                ),
            2086: () =>
                p("default", "@epic-debug/performance", [4, 1, 0, 2], () =>
                    P.e(211).then(() => () => P(211))
                ),
            64580: () =>
                p("default", "@epic-social/common-ui", [0], () =>
                    Promise.all([
                        P.e(7614),
                        P.e(8508),
                        P.e(9737),
                        P.e(102),
                        P.e(324),
                        P.e(6204),
                        P.e(3859),
                    ]).then(() => () => P(53859))
                ),
            92048: () =>
                p("default", "@epic-social/theme", [0], () =>
                    Promise.all([
                        P.e(7614),
                        P.e(9737),
                        P.e(9541),
                        P.e(4545),
                        P.e(8816),
                    ]).then(() => () => P(48816))
                ),
            14730: () =>
                p("default", "@epic-social/shared", [0], () =>
                    Promise.all([
                        P.e(7094),
                        P.e(5586),
                        P.e(8508),
                        P.e(9075),
                        P.e(2007),
                        P.e(3925),
                        P.e(5558),
                        P.e(113),
                        P.e(8767),
                        P.e(2086),
                        P.e(9321),
                        P.e(7066),
                        P.e(2048),
                        P.e(5529),
                    ]).then(() => () => P(5529))
                ),
        }),
        (v = {
            113: [90113],
            2048: [92048],
            2086: [2086],
            2871: [52871],
            4024: [24024],
            4730: [14730],
            5558: [55558],
            7066: [64580],
            8767: [87510, 97121],
            9321: [49321],
            9493: [69493],
        }),
        (P.f.consumes = (e, a) => {
            P.o(v, e) &&
                v[e].forEach((e) => {
                    if (P.o(h, e)) return a.push(h[e]);
                    var r = (a) => {
                        (h[e] = 0),
                            (P.m[e] = (r) => {
                                delete P.c[e], (r.exports = a());
                            });
                    },
                        t = (a) => {
                            delete h[e],
                                (P.m[e] = (r) => {
                                    throw (delete P.c[e], a);
                                });
                        };
                    try {
                        var o = m[e]();
                        o.then ? a.push((h[e] = o.then(r).catch(t))) : r(o);
                    } catch (e) {
                        t(e);
                    }
                });
        }),
        (() => {
            var e = { 9461: 0 };
            P.f.j = (a, r) => {
                var t = P.o(e, a) ? e[a] : void 0;
                if (0 !== t)
                    if (t) r.push(t[2]);
                    else if (
                        /^(2(048|086|871)|113|4024|4730|5558|8767|9321|9493)$/.test(a)
                    )
                        e[a] = 0;
                    else {
                        var o = new Promise((r, o) => (t = e[a] = [r, o]));
                        r.push((t[2] = o));
                        var i = P.p + P.u(a),
                            c = new Error();
                        P.l(
                            i,
                            (r) => {
                                if (P.o(e, a) && (0 !== (t = e[a]) && (e[a] = void 0), t)) {
                                    var o = r && ("load" === r.type ? "missing" : r.type),
                                        i = r && r.target && r.target.src;
                                    (c.message =
                                        "Loading chunk " + a + " failed.\n(" + o + ": " + i + ")"),
                                        (c.name = "ChunkLoadError"),
                                        (c.type = o),
                                        (c.request = i),
                                        t[1](c);
                                }
                            },
                            "chunk-" + a,
                            a
                        );
                    }
            };
            var a = (a, r) => {
                var t,
                    o,
                    [i, c, n] = r,
                    l = 0;
                if (i.some((a) => 0 !== e[a])) {
                    for (t in c) P.o(c, t) && (P.m[t] = c[t]);
                    n && n(P);
                }
                for (a && a(r); l < i.length; l++)
                    (o = i[l]), P.o(e, o) && e[o] && e[o][0](), (e[o] = 0);
            },
                r = (self.webpackChunk_epic_social_social_modules =
                    self.webpackChunk_epic_social_social_modules || []);
            r.forEach(a.bind(null, 0)), (r.push = a.bind(null, r.push.bind(r)));
        })(),
        (P.nc = void 0);
    var w = P(35791);
    epic_social_social_modules = w;
})();
