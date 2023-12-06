function d(c) {
  if (!c)
    return "";
  const e = Object.keys(c).map((a) => [a, c[a]].map(encodeURIComponent).join("=")).join("&");
  return e ? `?${e}` : "";
}
const u = {
  mode: "cors",
  rootPath: "",
  authTokenKey: void 0,
  headers: {
    Accept: "application/json"
    // 'Content-Type': 'application/json',
  }
};
function O(c) {
  Object.assign(u, c);
}
async function m(c, e) {
  return u.authTokenKey && (e.headers.Authorization = `Bearer ${localStorage.getItem(u == null ? void 0 : u.authTokenKey)}`), e.onLoading && e.onLoading(!0, e.method), e.body && (e.body = JSON.stringify(e.body)), new Promise((a, t) => {
    fetch(e.rootPath + c, e).then((r) => {
      r.text().then((n) => {
        if (!r.ok) {
          let l = null;
          try {
            l = JSON.parse(n).message;
          } catch {
            l = n;
          }
          const h = new Error(l || `[${r.status}] ${r.statusText}`);
          e != null && e.onError && e.onError(h, e.method), u.rejectReturn ? a(u.rejectReturn) : t(h);
        }
        let f;
        try {
          f = JSON.parse(n);
        } catch {
          f = n;
        }
        a(f);
      });
    }).catch((r) => {
      e != null && e.onError && e.onError(r, e.method), u.rejectReturn ? a(u.rejectReturn) : t(r);
    }).finally(() => {
      e.onLoading && e.onLoading(!1, e.method), e.onDone && e.onDone(e.method);
    });
  });
}
function y(c, e, a, t, r) {
  const n = Object.assign(u, r, {
    method: c,
    body: JSON.stringify((t == null ? void 0 : t.body) ?? {})
  }, t);
  return m(`${e}/${a}${d(t == null ? void 0 : t.query)}`, n);
}
function g(c, e, a, t, r) {
  const n = Object.assign(u, r, {
    method: c
  }, t);
  return m(e + a + d(t == null ? void 0 : t.query), n);
}
function s(c, e) {
  const a = e ?? {};
  let t = new AbortController();
  return a.signal = t.signal, {
    get: (r, n) => {
      const f = typeof r == "number" || typeof r == "string" ? `/${r}` : "";
      return g("GET", c, f, typeof r == "number" || typeof r == "string" ? n : r, a);
    },
    post: (r, n) => (typeof r != "number" && typeof r != "string" && (n = r, r = ""), y("POST", c, r, n, a)),
    put: (r, n) => y("PUT", c, r, n, a),
    patch: (r, n) => y("PATCH", c, r, n, a),
    delete: (r, n) => g("DELETE", c, r, n, a),
    cancel: () => {
      t.abort(), t = new AbortController(), a.signal = t.signal;
    }
  };
}
export {
  u as cfg,
  s as eru,
  O as setupEru
};
