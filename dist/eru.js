function s(t) {
  if (!t)
    return "";
  const r = Object.keys(t).map((a) => [a, t[a]].map(encodeURIComponent).join("=")).join("&");
  return r ? `?${r}` : "";
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
function b(t) {
  Object.assign(u, t);
}
async function m(t, r) {
  var a;
  return u.authTokenKey && (r.headers.Authorization = `Bearer ${localStorage.getItem(u == null ? void 0 : u.authTokenKey)}`), (a = r.on) != null && a.loading && r.on.loading(r.method, !0), r.body && (r.body = JSON.stringify(r.body)), fetch(r.rootPath + t, r).then(async (e) => e.text().then((n) => {
    var y, h;
    if (!e.ok) {
      let d = null;
      try {
        d = JSON.parse(n).message;
      } catch {
        d = n;
      }
      const l = new Error(d || `An unexpected error occured: ${e.statusText}`);
      return (y = r == null ? void 0 : r.on) != null && y.error && ((h = r.on) == null || h.error(r.method, l)), Promise.reject(l);
    }
    let c;
    try {
      c = JSON.parse(n);
    } catch {
      c = n;
    }
    return c;
  })).catch((e) => {
    var n, c;
    return (n = r == null ? void 0 : r.on) != null && n.error && ((c = r.on) == null || c.error(r.method, e)), e;
  }).finally(() => {
    var e, n;
    (e = r.on) != null && e.loading && ((n = r.on) == null || n.loading(r.method, !1));
  });
}
function g(t, r, a, e, n) {
  const c = Object.assign(u, n, {
    method: t,
    body: JSON.stringify(e.body)
  }, e);
  return m(`${r}/${a}${s(e == null ? void 0 : e.query)}`, c);
}
function f(t, r, a, e, n) {
  const c = Object.assign(u, n, {
    method: t
  }, e);
  return m(r + a + s(e == null ? void 0 : e.query), c);
}
function T(t, r) {
  const a = r ?? {};
  return {
    get: (e, n) => {
      const c = typeof e == "number" || typeof e == "string" ? `/${e}` : "";
      return f("GET", t, c, typeof e == "number" || typeof e == "string" ? n : e, a);
    },
    delete: (e, n) => f("DELETE", t, e, n, a),
    post: (e) => f("POST", t, "", e, a),
    put: (e, n) => g("PUT", t, e, n, a),
    patch: (e, n) => g("PATCH", t, e, n, a)
  };
}
export {
  u as cfg,
  T as eru,
  b as setupEru
};
