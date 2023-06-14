function g(a) {
  if (!a)
    return "";
  const e = Object.keys(a).map((c) => [c, a[c]].map(encodeURIComponent).join("=")).join("&");
  return e ? `?${e}` : "";
}
const n = {
  mode: "cors",
  rootPath: "",
  authTokenKey: void 0,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
};
function O(a) {
  Object.assign(n, a);
}
async function m(a, e) {
  return n.authTokenKey && (e.headers.Authorization = `Bearer ${localStorage.getItem(n == null ? void 0 : n.authTokenKey)}`), e.onLoading && e.onLoading(!0, e.method), e.body && (e.body = JSON.stringify(e.body)), new Promise((c, r) => {
    fetch(e.rootPath + a, e).then((t) => {
      t.text().then((u) => {
        if (!t.ok) {
          n.rejectDefault && c(n.rejectDefault);
          let y = null;
          try {
            y = JSON.parse(u).message;
          } catch {
            y = u;
          }
          const h = new Error(y || `[${t.status}] ${t.statusText}`);
          e != null && e.onError && e.onError(h, e.method), r(h);
        }
        let f;
        try {
          f = JSON.parse(u);
        } catch {
          f = u;
        }
        c(f);
      });
    }).catch((t) => {
      e != null && e.onError && e.onError(t, e.method), n.rejectDefault ? c(n.rejectDefault) : r(t);
    }).finally(() => {
      e.onLoading && e.onLoading(!1, e.method);
    });
  });
}
function l(a, e, c, r, t) {
  const u = Object.assign(n, t, {
    method: a,
    body: JSON.stringify(r.body)
  }, r);
  return m(`${e}/${c}${g(r == null ? void 0 : r.query)}`, u);
}
function d(a, e, c, r, t) {
  const u = Object.assign(n, t, {
    method: a
  }, r);
  return m(e + c + g(r == null ? void 0 : r.query), u);
}
function b(a, e) {
  const c = e ?? {};
  return {
    get: (r, t) => {
      const u = typeof r == "number" || typeof r == "string" ? `/${r}` : "";
      return d("GET", a, u, typeof r == "number" || typeof r == "string" ? t : r, c);
    },
    delete: (r, t) => d("DELETE", a, r, t, c),
    post: (r) => d("POST", a, "", r, c),
    put: (r, t) => l("PUT", a, r, t, c),
    patch: (r, t) => l("PATCH", a, r, t, c)
  };
}
export {
  n as cfg,
  b as eru,
  O as setupEru
};
