function y(t) {
  if (!t)
    return "";
  const c = Object.keys(t).map((n) => [n, t[n]].map(encodeURIComponent).join("=")).join("&");
  return c ? `?${c}` : "";
}
const a = {
  mode: "cors",
  rootPath: "",
  authTokenKey: void 0,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
};
function h(t) {
  Object.assign(a, t);
}
async function d(t, c) {
  return a.authTokenKey && (c.headers.Authorization = `Bearer ${localStorage.getItem(a == null ? void 0 : a.authTokenKey)}`), c.body && (c.body = JSON.stringify(c.body)), fetch(t, c).then(async (n) => n.text().then((e) => {
    if (!n.ok) {
      let r = null;
      try {
        r = JSON.parse(e).message;
      } catch {
        r = e;
      }
      return Promise.reject(new Error(
        r || `An unexpected error occured: ${n.statusText}`
      ));
    }
    return n;
  }));
}
function u(t, c, n, e, r) {
  const o = Object.assign(a, r, {
    method: t,
    body: JSON.stringify(e.body)
  }, e);
  return d(`${a.rootPath + c}/${n}${y(e == null ? void 0 : e.query)}`, o);
}
function s(t, c, n, e, r) {
  const o = Object.assign(a, r, {
    method: t
  }, e);
  return d(a.rootPath + c + n + y(e == null ? void 0 : e.query), o);
}
function i(t, c) {
  const n = c ?? {};
  return {
    get: (e, r) => {
      const o = typeof e == "number" || typeof e == "string" ? `/${e}` : "";
      return s("GET", t, o, typeof e == "number" || typeof e == "string" ? r : e, n);
    },
    delete: (e, r) => s("DELETE", t, e, r, n),
    post: (e) => s("POST", t, "", e, n),
    put: (e, r) => u("PUT", t, e, r, n),
    patch: (e, r) => u("PATCH", t, e, r, n)
  };
}
export {
  a as cfg,
  i as eru,
  h as setupEru
};
