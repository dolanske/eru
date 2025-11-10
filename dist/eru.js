var o = Object.defineProperty;
var m = (s, r, e) => r in s ? o(s, r, { enumerable: !0, configurable: !0, writable: !0, value: e }) : s[r] = e;
var u = (s, r, e) => (m(s, typeof r != "symbol" ? r + "" : r, e), e);
function l(s) {
  if (!s)
    return "";
  const r = Object.keys(s).map((e) => {
    let a = s[e];
    return Array.isArray(s[e]) && (a = s[e].join(",")), [e, a].map(encodeURIComponent).join("=");
  }).join("&");
  return r ? `?${r}` : "";
}
function i(s) {
  return typeof s == "function" || typeof s == "object" && !!s;
}
function y(s, r) {
  const e = String(s ?? ""), a = String(r ?? ""), c = (h) => h.split(/[\\/]+/).filter(Boolean), t = c(e), n = c(a), f = /^[\\/]/.test(e);
  if (n.length === 0)
    return t.length === 0 ? "" : f ? `/${t.join("/")}` : t.join("/");
  if (t.length === 0)
    return `/${n.join("/")}`;
  const g = `${t.join("/")}/${n.join("/")}`;
  return f ? `/${g}` : g;
}
class j {
  constructor(r, e = {}) {
    u(this, "cfg");
    u(this, "basePath");
    this.cfg = Object.assign({
      mode: "cors",
      authTokenKey: void 0,
      headers: {
        Accept: "application/json"
      }
    }, e), this.basePath = r;
  }
  // Helper method for seting up PUT, PATCH and POST requests as their functionality is exactly the same
  patchBody(r, e, a, c, t) {
    const n = Object.assign({}, this.cfg, t, {
      method: r,
      body: JSON.stringify((c == null ? void 0 : c.body) ?? {})
    }, c), f = `${y(e, a)}${l(c == null ? void 0 : c.query)}`;
    return this.runRequest(f, n);
  }
  patchBodyless(r, e, a, c, t) {
    const n = Object.assign({}, this.cfg, t, {
      method: r
    }, c);
    delete n.body;
    const f = `${y(e, a)}${l(c == null ? void 0 : c.query)}`;
    return this.runRequest(f, n);
  }
  runRequest(r, e) {
    return this.cfg.authTokenKey && (e.headers.Authorization = `Bearer ${localStorage.getItem(this.cfg.authTokenKey)}`), e.onLoading && e.onLoading(!0, e.method), e.body && (e.body = JSON.stringify(e.body)), new Promise((a, c) => fetch(this.basePath + r, e).then((t) => {
      t.text().then((n) => {
        if (!t.ok) {
          let g = null;
          try {
            g = JSON.parse(n).message;
          } catch {
            g = n;
          }
          const h = new Error(g || `[${t.status}] ${t.statusText}`);
          e != null && e.onError && e.onError(h, e.method), this.cfg.rejectReturn ? a(this.cfg.rejectReturn) : c(h);
        }
        let f;
        try {
          f = JSON.parse(n);
        } catch {
          f = n;
        }
        a(f);
      });
    }).catch((t) => {
      e != null && e.onError && e.onError(t, e.method), this.cfg.rejectReturn ? a(this.cfg.rejectReturn) : c(t);
    }).finally(() => {
      e.onLoading && e.onLoading(!1, e.method), e.onDone && e.onDone(e.method);
    }));
  }
  route(r, e) {
    const a = e ?? {};
    let c = new AbortController();
    return a.signal = c.signal, {
      get: (t, n) => {
        const f = typeof t == "number" || typeof t == "string" ? String(t) : "", g = typeof t == "number" || typeof t == "string" ? n : {};
        return this.patchBodyless("GET", r, f, g, a);
      },
      delete: (t, n) => this.patchBodyless("DELETE", r, t, n, a),
      post: (t, n) => (i(t) && (n = t, t = ""), this.patchBody("POST", r, String(t), { body: n }, a)),
      put: (t, n) => (i(t) && (n = t, t = ""), this.patchBody("PUT", r, String(t), { body: n }, a)),
      patch: (t, n) => (i(t) && (n = t, t = ""), this.patchBody("PATCH", r, String(t), { body: n }, a)),
      cancel: () => {
        c.abort(), c = new AbortController(), a.signal = c.signal;
      }
    };
  }
}
function S(s, r) {
  return new j(s, r);
}
export {
  j as Eru,
  S as eru
};
