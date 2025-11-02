var d = Object.defineProperty;
var b = (s, r, e) => r in s ? d(s, r, { enumerable: !0, configurable: !0, writable: !0, value: e }) : s[r] = e;
var h = (s, r, e) => (b(s, typeof r != "symbol" ? r + "" : r, e), e);
function l(s) {
  if (!s)
    return "";
  const r = Object.keys(s).map((e) => {
    let a = s[e];
    return Array.isArray(s[e]) && (a = s[e].join(",")), [e, a].map(encodeURIComponent).join("=");
  }).join("&");
  return r ? `?${r}` : "";
}
function g(s) {
  return typeof s == "function" || typeof s == "object" && !!s;
}
class m {
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
  patchBody(r, e, a, n, t) {
    const c = Object.assign(this.cfg, t, {
      method: r,
      body: JSON.stringify((n == null ? void 0 : n.body) ?? {})
    }, n);
    return this.runRequest(`${e}${a ? `/${a}` : ""}${l(n == null ? void 0 : n.query)}`, c);
  }
  patchBodyless(r, e, a, n, t) {
    const c = Object.assign(this.cfg, t, {
      method: r
    }, n);
    delete c.body;
    const f = String(a), u = f ? f.startsWith("/") ? f.slice(1) : f : "";
    return this.runRequest(`${e}${u}${l(n == null ? void 0 : n.query)}`, c);
  }
  runRequest(r, e) {
    return this.cfg.authTokenKey && (e.headers.Authorization = `Bearer ${localStorage.getItem(this.cfg.authTokenKey)}`), e.onLoading && e.onLoading(!0, e.method), e.body && (e.body = JSON.stringify(e.body)), new Promise((a, n) => {
      fetch(this.basePath + r, e).then((t) => {
        t.text().then((c) => {
          if (!t.ok) {
            let u = null;
            try {
              u = JSON.parse(c).message;
            } catch {
              u = c;
            }
            const i = new Error(u || `[${t.status}] ${t.statusText}`);
            e != null && e.onError && e.onError(i, e.method), this.cfg.rejectReturn ? a(this.cfg.rejectReturn) : n(i);
          }
          let f;
          try {
            f = JSON.parse(c);
          } catch {
            f = c;
          }
          a(f);
        });
      }).catch((t) => {
        e != null && e.onError && e.onError(t, e.method), this.cfg.rejectReturn ? a(this.cfg.rejectReturn) : n(t);
      }).finally(() => {
        e.onLoading && e.onLoading(!1, e.method), e.onDone && e.onDone(e.method);
      });
    });
  }
  route(r, e) {
    const a = e ?? {};
    let n = new AbortController();
    return a.signal = n.signal, {
      get: (t, c) => {
        const f = typeof t == "number" || typeof t == "string" ? String(t) : "", u = typeof t == "number" || typeof t == "string" ? c : t;
        return this.patchBodyless("GET", r, f, u, a);
      },
      delete: (t, c) => this.patchBodyless("DELETE", r, t, c, a),
      post: (t, c) => (g(t) && (c = t, t = ""), this.patchBody("POST", r, String(t), { body: c }, a)),
      put: (t, c) => (g(t) && (c = t, t = ""), this.patchBody("PUT", r, String(t), { body: c }, a)),
      patch: (t, c) => (g(t) && (c = t, t = ""), this.patchBody("PATCH", r, String(t), { body: c }, a)),
      cancel: () => {
        n.abort(), n = new AbortController(), a.signal = n.signal;
      }
    };
  }
}
function S(s, r) {
  return new m(s, r);
}
export {
  m as Eru,
  S as eru
};
