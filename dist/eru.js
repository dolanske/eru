var m = Object.defineProperty;
var b = (a, r, e) => r in a ? m(a, r, { enumerable: !0, configurable: !0, writable: !0, value: e }) : a[r] = e;
var h = (a, r, e) => (b(a, typeof r != "symbol" ? r + "" : r, e), e);
function i(a) {
  if (!a)
    return "";
  const r = Object.keys(a).map((e) => {
    let f = a[e];
    return Array.isArray(a[e]) && (f = a[e].join(",")), [e, f].map(encodeURIComponent).join("=");
  }).join("&");
  return r ? `?${r}` : "";
}
function g(a) {
  return typeof a == "function" || typeof a == "object" && !!a;
}
function y(a, r) {
  const e = String(a ?? ""), f = String(r ?? ""), n = e.replace(/\/+$/, ""), t = f.replace(/^\/+/, "");
  return t ? n ? `${n}/${t}` : `/${t}` : n;
}
class o {
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
    const c = Object.assign({}, this.cfg, t, {
      method: r,
      body: JSON.stringify((n == null ? void 0 : n.body) ?? {})
    }, n), s = `${y(e, f)}${i(n == null ? void 0 : n.query)}`;
    return this.runRequest(s, c);
  }
  patchBodyless(r, e, f, n, t) {
    const c = Object.assign({}, this.cfg, t, {
      method: r
    }, n);
    delete c.body;
    const s = `${y(e, f)}${i(n == null ? void 0 : n.query)}`;
    return this.runRequest(s, c);
  }
  runRequest(r, e) {
    return this.cfg.authTokenKey && (e.headers.Authorization = `Bearer ${localStorage.getItem(this.cfg.authTokenKey)}`), e.onLoading && e.onLoading(!0, e.method), e.body && (e.body = JSON.stringify(e.body)), new Promise((f, n) => fetch(this.basePath + r, e).then((t) => {
      t.text().then((c) => {
        if (!t.ok) {
          let u = null;
          try {
            u = JSON.parse(c).message;
          } catch {
            u = c;
          }
          const l = new Error(u || `[${t.status}] ${t.statusText}`);
          e != null && e.onError && e.onError(l, e.method), this.cfg.rejectReturn ? f(this.cfg.rejectReturn) : n(l);
        }
        let s;
        try {
          s = JSON.parse(c);
        } catch {
          s = c;
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
      get: (t, c) => {
        const s = typeof t == "number" || typeof t == "string" ? String(t) : "", u = typeof t == "number" || typeof t == "string" ? c : t;
        return this.patchBodyless("GET", r, s, u, f);
      },
      delete: (t, c) => this.patchBodyless("DELETE", r, t, c, f),
      post: (t, c) => (g(t) && (c = t, t = ""), this.patchBody("POST", r, String(t), { body: c }, f)),
      put: (t, c) => (g(t) && (c = t, t = ""), this.patchBody("PUT", r, String(t), { body: c }, f)),
      patch: (t, c) => (g(t) && (c = t, t = ""), this.patchBody("PATCH", r, String(t), { body: c }, f)),
      cancel: () => {
        n.abort(), n = new AbortController(), f.signal = n.signal;
      }
    };
  }
}
function S(a, r) {
  return new o(a, r);
}
export {
  o as Eru,
  S as eru
};
