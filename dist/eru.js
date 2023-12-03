function g(t) {
  if (!t)
    return "";
  const e = Object.keys(t).map((n) => [n, t[n]].map(encodeURIComponent).join("=")).join("&");
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
function O(t) {
  Object.assign(u, t);
}
async function m(t, e) {
  return u.authTokenKey && (e.headers.Authorization = `Bearer ${localStorage.getItem(u == null ? void 0 : u.authTokenKey)}`), e.onLoading && e.onLoading(!0, e.method), e.body && (e.body = JSON.stringify(e.body)), new Promise((n, a) => {
    fetch(e.rootPath + t, e).then((r) => {
      r.text().then((c) => {
        if (!r.ok) {
          let l = null;
          try {
            l = JSON.parse(c).message;
          } catch {
            l = c;
          }
          const y = new Error(l || `[${r.status}] ${r.statusText}`);
          e != null && e.onError && e.onError(y, e.method), u.rejectReturn ? n(u.rejectReturn) : a(y);
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
      e != null && e.onError && e.onError(r, e.method), u.rejectReturn ? n(u.rejectReturn) : a(r);
    }).finally(() => {
      e.onLoading && e.onLoading(!1, e.method), e.onDone && e.onDone(e.method);
    });
  });
}
function d(t, e, n, a, r) {
  const c = Object.assign(u, r, {
    method: t,
    body: JSON.stringify((a == null ? void 0 : a.body) ?? {})
  }, a);
  return m(`${e}/${n}${g(a == null ? void 0 : a.query)}`, c);
}
function h(t, e, n, a, r) {
  const c = Object.assign(u, r, {
    method: t
  }, a);
  return m(e + n + g(a == null ? void 0 : a.query), c);
}
function s(t, e) {
  const n = e ?? {};
  let a = new AbortController();
  return n.signal = a.signal, {
    get: (r, c) => {
      const f = typeof r == "number" || typeof r == "string" ? `/${r}` : "";
      return h("GET", t, f, typeof r == "number" || typeof r == "string" ? c : r, n);
    },
    post: (r) => d("POST", t, "", r, n),
    put: (r, c) => d("PUT", t, r, c, n),
    patch: (r, c) => d("PATCH", t, r, c, n),
    delete: (r, c) => h("DELETE", t, r, c, n),
    cancel: () => {
      a.abort(), a = new AbortController(), n.signal = a.signal;
    }
  };
}
export {
  u as cfg,
  s as eru,
  O as setupEru
};
