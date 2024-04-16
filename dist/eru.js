var b = Object.defineProperty;
var d = (h, t, e) => t in h ? b(h, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : h[t] = e;
var u = (h, t, e) => (d(h, typeof t != "symbol" ? t + "" : t, e), e);
function y(h) {
  if (!h)
    return "";
  const t = Object.keys(h).map((e) => {
    let n = h[e];
    return Array.isArray(h[e]) && (n = h[e].join(",")), [e, n].map(encodeURIComponent).join("=");
  }).join("&");
  return t ? `?${t}` : "";
}
function g(h) {
  return typeof h == "function" || typeof h == "object" && !!h;
}
class m {
  constructor(t, e = {}) {
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
  patchBody(t, e, n, a, r) {
    const c = Object.assign(this.cfg, r, {
      method: t,
      body: JSON.stringify((a == null ? void 0 : a.body) ?? {})
    }, a);
    return this.runRequest(`${e}${n ? `/${n}` : ""}${y(a == null ? void 0 : a.query)}`, c);
  }
  patchBodyless(t, e, n, a, r) {
    const c = Object.assign(this.cfg, r, {
      method: t
    }, a);
    return delete c.body, this.runRequest(`${e}${n ? `/${n}` : ""}${y(a == null ? void 0 : a.query)}`, c);
  }
  runRequest(t, e) {
    return this.cfg.authTokenKey && (e.headers.Authorization = `Bearer ${localStorage.getItem(this.cfg.authTokenKey)}`), e.onLoading && e.onLoading(!0, e.method), e.body && (e.body = JSON.stringify(e.body)), new Promise((n, a) => {
      fetch(this.basePath + t, e).then((r) => {
        r.text().then((c) => {
          if (!r.ok) {
            let s = null;
            try {
              s = JSON.parse(c).message;
            } catch {
              s = c;
            }
            const l = new Error(s || `[${r.status}] ${r.statusText}`);
            e != null && e.onError && e.onError(l, e.method), this.cfg.rejectReturn ? n(this.cfg.rejectReturn) : a(l);
          }
          let f;
          try {
            f = JSON.parse(c);
          } catch {
            f = c;
          }
          n(f);
        });
      }).catch((r) => {
        e != null && e.onError && e.onError(r, e.method), this.cfg.rejectReturn ? n(this.cfg.rejectReturn) : a(r);
      }).finally(() => {
        e.onLoading && e.onLoading(!1, e.method), e.onDone && e.onDone(e.method);
      });
    });
  }
  route(t, e) {
    const n = e ?? {};
    let a = new AbortController();
    return n.signal = a.signal, {
      get: (r, c) => {
        const f = typeof r == "number" || typeof r == "string" ? String(r) : "", s = typeof r == "number" || typeof r == "string" ? c : r;
        return this.patchBodyless("GET", t, f, s, n);
      },
      delete: (r, c) => this.patchBodyless("DELETE", t, r, c, n),
      post: (r, c) => (g(r) && (c = r, r = ""), this.patchBody("POST", t, String(r), { body: c }, n)),
      put: (r, c) => (g(r) && (c = r, r = ""), this.patchBody("PUT", t, String(r), { body: c }, n)),
      patch: (r, c) => (g(r) && (c = r, r = ""), this.patchBody("PATCH", t, String(r), { body: c }, n)),
      cancel: () => {
        a.abort(), a = new AbortController(), n.signal = a.signal;
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
