// SWR
// 1. fetch data, cache them with a key
// 2. fetch again with same key? return cache, make request
// 3. replace data with new data when request comes in, voila

// TODO: could implement through proxies
// TODO: rewrite whole thing tbh

// class Eru {
//   constructor()
// }

function $get(this: Eru) {

}

function $post(this: Eru) {}
function $put(this: Eru) {}
function $patch(this: Eru) {}
function $delete(this: Eru) {}

// function runFetchRequest<ReturnType>(path, options) {
//   return fetch(path, options)
//     .then((res) => {
//       if (!res.ok) {

//       }
//     })
// }

class Eru {
  get = $get.bind(this)
  post = $post.bind(this)
  put = $put.bind(this)
  patch = $patch.bind(this)
  delete = $delete.bind(this)

  constructor() {

  }

  private request(path, options) {
    return new Promise((resolve, reject) => {
      const fetchReq = fetch()
    })
  }
}

export function proxyResult() {

}

export function getStuff() {
  const res = {
    data: 10,
  }

  // setTimeout(() => {
  //   data.value = 100
  // }, 400)

  const proxy = new Proxy(res, {
    get(target, key, receiver) {
      return Reflect.get(target, key, receiver)
    },
    set() {
      console.error('Object is readonly')
      return false
    },
  })

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(proxy)
    }, 200)
  })
}
