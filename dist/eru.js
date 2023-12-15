var d = Object.defineProperty;
var b = (h, t, e) => t in h ? d(h, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : h[t] = e;
var f = (h, t, e) => (b(h, typeof t != "symbol" ? t + "" : t, e), e);
function y(h) {
  if (!h)
    return "";
  const t = Object.keys(h).map((e) => [e, h[e]].map(encodeURIComponent).join("=")).join("&");
  return t ? `?${t}` : "";
}
function i(h) {
  return typeof h == "function" || typeof h == "object" && !!h;
}
class m {
  constructor(t, e) {
    f(this, "cfg");
    f(this, "basePath");
    this.cfg = Object.assign({
      mode: "cors",
      authTokenKey: void 0,
      headers: {
        Accept: "application/json"
      }
    }, e), this.basePath = t;
  }
  // Helper method for seting up PUT, PATCH and POST requests as their functionality is exactly the same
  patchBody(t, e, n, c, r) {
    const a = Object.assign(this.cfg, r, {
      method: t,
      body: JSON.stringify((c == null ? void 0 : c.body) ?? {})
    }, c);
    return this.runRequest(`${e}${n ? `/${n}` : ""}${y(c == null ? void 0 : c.query)}`, a);
  }
  patchBodyless(t, e, n, c, r) {
    const a = Object.assign(this.cfg, r, {
      method: t
    }, c);
    return this.runRequest(`${e}${n ? `/${n}` : ""}${y(c == null ? void 0 : c.query)}`, a);
  }
  runRequest(t, e) {
    return this.cfg.authTokenKey && (e.headers.Authorization = `Bearer ${localStorage.getItem(cfg == null ? void 0 : cfg.authTokenKey)}`), e.onLoading && e.onLoading(!0, e.method), e.body && (e.body = JSON.stringify(e.body)), new Promise((n, c) => {
      fetch(this.basePath + t, e).then((r) => {
        r.text().then((a) => {
          if (!r.ok) {
            let u = null;
            try {
              u = JSON.parse(a).message;
            } catch {
              u = a;
            }
            const g = new Error(u || `[${r.status}] ${r.statusText}`);
            e != null && e.onError && e.onError(g, e.method), this.cfg.rejectReturn ? n(this.cfg.rejectReturn) : c(g);
          }
          let s;
          try {
            s = JSON.parse(a);
          } catch {
            s = a;
          }
          n(s);
        });
      }).catch((r) => {
        e != null && e.onError && e.onError(r, e.method), this.cfg.rejectReturn ? n(this.cfg.rejectReturn) : c(r);
      }).finally(() => {
        e.onLoading && e.onLoading(!1, e.method), e.onDone && e.onDone(e.method);
      });
    });
  }
  route(t, e) {
    const n = e ?? {};
    let c = new AbortController();
    return n.signal = c.signal, {
      get: (r, a) => {
        const s = typeof r == "number" || typeof r == "string" ? `/${r}` : "", u = typeof r == "number" || typeof r == "string" ? a : r;
        return this.patchBodyless("GET", t, s, u, n);
      },
      post: (r, a) => (i(r) && (a = String(r), r = ""), this.patchBody("POST", t, String(r), { body: a }, n)),
      put: (r, a) => this.patchBody("PUT", t, r, a, n),
      patch: (r, a) => this.patchBody("PATCH", t, r, a, n),
      delete: (r, a) => this.patchBodyless("DELETE", t, r, a, n),
      cancel: () => {
        c.abort(), c = new AbortController(), n.signal = c.signal;
      }
    };
  }
}
function $(h, t) {
  return new m(h, t);
}
export {
  m as Eru,
  $ as eru
};
