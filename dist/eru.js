var m = Object.defineProperty;
var o = (c, r, e) => r in c ? m(c, r, { enumerable: !0, configurable: !0, writable: !0, value: e }) : c[r] = e;
var h = (c, r, e) => (o(c, typeof r != "symbol" ? r + "" : r, e), e);
function l(c) {
  if (!c)
    return "";
  const r = Object.keys(c).map((e) => {
    let f = c[e];
    return Array.isArray(c[e]) && (f = c[e].join(",")), [e, f].map(encodeURIComponent).join("=");
  }).join("&");
  return r ? `?${r}` : "";
}
function g(c) {
  return typeof c == "function" || typeof c == "object" && !!c;
}
function b(c) {
  const r = String(c);
  return r ? r.replace(/^\/+/, "") : "";
}
function d(c, r) {
  const e = String(c ?? ""), f = b(r), n = e.replace(/\/+$/, ""), t = String(f ?? "").replace(/^\/+/, "");
  return t ? n ? `${n}/${t}` : `/${t}` : n;
}
class j {
  constructor(r, e = {}) {
    h(this, "cfg");
    h(this, "basePath");
    this.cfg = Object.assign({
      mode: "cors",
      authTokenKey: void 0,
      headers: {
        Accept: "application/json"
      }
    }, e), this.basePath = r;
  }
  // Helper method for seting up PUT, PATCH and POST requests as their functionality is exactly the same
  patchBody(r, e, f, n, t) {
    const a = Object.assign({}, this.cfg, t, {
      method: r,
      body: JSON.stringify((n == null ? void 0 : n.body) ?? {})
    }, n), s = `${d(e, f)}${l(n == null ? void 0 : n.query)}`;
    return this.runRequest(s, a);
  }
  patchBodyless(r, e, f, n, t) {
    const a = Object.assign({}, this.cfg, t, {
      method: r
    }, n);
    delete a.body;
    const s = `${d(e, f)}${l(n == null ? void 0 : n.query)}`;
    return this.runRequest(s, a);
  }
  runRequest(r, e) {
    return this.cfg.authTokenKey && (e.headers.Authorization = `Bearer ${localStorage.getItem(this.cfg.authTokenKey)}`), e.onLoading && e.onLoading(!0, e.method), e.body && (e.body = JSON.stringify(e.body)), new Promise((f, n) => fetch(this.basePath + r, e).then((t) => {
      t.text().then((a) => {
        if (!t.ok) {
          let u = null;
          try {
            u = JSON.parse(a).message;
          } catch {
            u = a;
          }
          const i = new Error(u || `[${t.status}] ${t.statusText}`);
          e != null && e.onError && e.onError(i, e.method), this.cfg.rejectReturn ? f(this.cfg.rejectReturn) : n(i);
        }
        let s;
        try {
          s = JSON.parse(a);
        } catch {
          s = a;
        }
        f(s);
      });
    }).catch((t) => {
      e != null && e.onError && e.onError(t, e.method), this.cfg.rejectReturn ? f(this.cfg.rejectReturn) : n(t);
    }).finally(() => {
      e.onLoading && e.onLoading(!1, e.method), e.onDone && e.onDone(e.method);
    }));
  }
  route(r, e) {
    const f = e ?? {};
    let n = new AbortController();
    return f.signal = n.signal, {
      get: (t, a) => {
        const s = typeof t == "number" || typeof t == "string" ? String(t) : "", u = typeof t == "number" || typeof t == "string" ? a : t;
        return this.patchBodyless("GET", r, s, u, f);
      },
      delete: (t, a) => this.patchBodyless("DELETE", r, t, a, f),
      post: (t, a) => (g(t) && (a = t, t = ""), this.patchBody("POST", r, String(t), { body: a }, f)),
      put: (t, a) => (g(t) && (a = t, t = ""), this.patchBody("PUT", r, String(t), { body: a }, f)),
      patch: (t, a) => (g(t) && (a = t, t = ""), this.patchBody("PATCH", r, String(t), { body: a }, f)),
      cancel: () => {
        n.abort(), n = new AbortController(), f.signal = n.signal;
      }
    };
  }
}
function $(c, r) {
  return new j(c, r);
}
export {
  j as Eru,
  $ as eru
};
