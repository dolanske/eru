var d = Object.defineProperty;
var i = (h, t, e) => t in h ? d(h, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : h[t] = e;
var u = (h, t, e) => (i(h, typeof t != "symbol" ? t + "" : t, e), e);
function l(h) {
  if (!h)
    return "";
  const t = Object.keys(h).map((e) => {
    let c = h[e];
    return Array.isArray(h[e]) && (c = h[e].join(",")), [e, c].map(encodeURIComponent).join("=");
  }).join("&");
  return t ? `?${t}` : "";
}
function b(h) {
  return typeof h == "function" || typeof h == "object" && !!h;
}
class m {
  constructor(t, e) {
    u(this, "cfg");
    u(this, "basePath");
    this.cfg = Object.assign({
      mode: "cors",
      authTokenKey: void 0,
      headers: {
        Accept: "application/json"
      }
    }, e), this.basePath = t;
  }
  // Helper method for seting up PUT, PATCH and POST requests as their functionality is exactly the same
  patchBody(t, e, c, a, r) {
    const n = Object.assign(this.cfg, r, {
      method: t,
      body: JSON.stringify((a == null ? void 0 : a.body) ?? {})
    }, a);
    return this.runRequest(`${e}${c ? `/${c}` : ""}${l(a == null ? void 0 : a.query)}`, n);
  }
  patchBodyless(t, e, c, a, r) {
    const n = Object.assign(this.cfg, r, {
      method: t
    }, a);
    return this.runRequest(`${e}${c ? `/${c}` : ""}${l(a == null ? void 0 : a.query)}`, n);
  }
  runRequest(t, e) {
    return this.cfg.authTokenKey && (e.headers.Authorization = `Bearer ${localStorage.getItem(cfg == null ? void 0 : cfg.authTokenKey)}`), e.onLoading && e.onLoading(!0, e.method), e.body && (e.body = JSON.stringify(e.body)), new Promise((c, a) => {
      fetch(this.basePath + t, e).then((r) => {
        r.text().then((n) => {
          if (!r.ok) {
            let s = null;
            try {
              s = JSON.parse(n).message;
            } catch {
              s = n;
            }
            const g = new Error(s || `[${r.status}] ${r.statusText}`);
            e != null && e.onError && e.onError(g, e.method), this.cfg.rejectReturn ? c(this.cfg.rejectReturn) : a(g);
          }
          let f;
          try {
            f = JSON.parse(n);
          } catch {
            f = n;
          }
          c(f);
        });
      }).catch((r) => {
        e != null && e.onError && e.onError(r, e.method), this.cfg.rejectReturn ? c(this.cfg.rejectReturn) : a(r);
      }).finally(() => {
        e.onLoading && e.onLoading(!1, e.method), e.onDone && e.onDone(e.method);
      });
    });
  }
  route(t, e) {
    const c = e ?? {};
    let a = new AbortController();
    return c.signal = a.signal, {
      get: (r, n) => {
        const f = typeof r == "number" || typeof r == "string" ? `/${r}` : "", s = typeof r == "number" || typeof r == "string" ? n : r;
        return this.patchBodyless("GET", t, f, s, c);
      },
      post: (r, n) => (b(r) && (n = String(r), r = ""), this.patchBody("POST", t, String(r), { body: n }, c)),
      put: (r, n) => this.patchBody("PUT", t, r, n, c),
      patch: (r, n) => this.patchBody("PATCH", t, r, n, c),
      delete: (r, n) => this.patchBodyless("DELETE", t, r, n, c),
      cancel: () => {
        a.abort(), a = new AbortController(), c.signal = a.signal;
      }
    };
  }
}
function j(h, t) {
  return new m(h, t);
}
export {
  m as Eru,
  j as eru
};
