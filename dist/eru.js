function g(a) {
  if (!a)
    return "";
  const e = Object.keys(a).map((t) => [t, a[t]].map(encodeURIComponent).join("=")).join("&");
  return e ? `?${e}` : "";
}
const u = {
  mode: "cors",
  rootPath: "",
  authTokenKey: void 0,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
};
function O(a) {
  Object.assign(u, a);
}
async function m(a, e) {
  return u.authTokenKey && (e.headers.Authorization = `Bearer ${localStorage.getItem(u == null ? void 0 : u.authTokenKey)}`), e.onLoading && e.onLoading(!0, e.method), e.body && (e.body = JSON.stringify(e.body)), new Promise((t, n) => {
    fetch(e.rootPath + a, e).then((r) => {
      r.text().then((c) => {
        if (!r.ok) {
          let l = null;
          try {
            l = JSON.parse(c).message;
          } catch {
            l = c;
          }
          const y = new Error(l || `[${r.status}] ${r.statusText}`);
          e != null && e.onError && e.onError(y, e.method), u.rejectReturn ? t(u.rejectReturn) : n(y);
        }
        let f;
        try {
          f = JSON.parse(c);
        } catch {
          f = c;
        }
        t(f);
      });
    }).catch((r) => {
      e != null && e.onError && e.onError(r, e.method), u.rejectReturn ? t(u.rejectReturn) : n(r);
    }).finally(() => {
      e.onLoading && e.onLoading(!1, e.method), e.onDone && e.onDone(e.method);
    });
  });
}
function d(a, e, t, n, r) {
  const c = Object.assign(u, r, {
    method: a,
    body: JSON.stringify((n == null ? void 0 : n.body) ?? {})
  }, n);
  return m(`${e}/${t}${g(n == null ? void 0 : n.query)}`, c);
}
function h(a, e, t, n, r) {
  const c = Object.assign(u, r, {
    method: a
  }, n);
  return m(e + t + g(n == null ? void 0 : n.query), c);
}
function s(a, e) {
  const t = e ?? {};
  let n = new AbortController();
  return t.signal = n.signal, {
    get: (r, c) => {
      const f = typeof r == "number" || typeof r == "string" ? `/${r}` : "";
      return h("GET", a, f, typeof r == "number" || typeof r == "string" ? c : r, t);
    },
    post: (r) => d("POST", a, "", r, t),
    put: (r, c) => d("PUT", a, r, c, t),
    patch: (r, c) => d("PATCH", a, r, c, t),
    delete: (r, c) => h("DELETE", a, r, c, t),
    cancel: () => {
      n.abort(), n = new AbortController(), t.signal = n.signal;
    }
  };
}
export {
  u as cfg,
  s as eru,
  O as setupEru
};
