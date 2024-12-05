// SWR
// 1. fetch data, cache them with a key
// 2. fetch again with same key? return cache, make request
// 3. replace data with new data when request comes in, voila

import { isObject } from './util'

// TODO: could implement through proxies
// TODO: rewrite whole thing tbh

interface EruEvents {
  request: () => void
  resolve: () => void
  reject: () => void
  loading: () => void
}

type EruQuery = Record<string, string | number>

interface EruConfig extends RequestInit {
  // rootPath?: string
  authTokenKey?: string
  // In case the promise is rejected, instead of reject(err),
  // it'll use reject(cfg.rejectReturn) which for instance can be an empty array
  rejectReturn?: any  x
}

interface RequestConfig {
  query: EruQuery | string
  body: any
}

export class Eru {
  basePath: string
  rootConfig: EruConfig

  constructor(basePath: string, rootConfig: EruConfig = {}) {
    this.basePath = basePath
    this.rootConfig = rootConfig
  }

  private request(path: string, options: RequestConfig) {
    return new Promise((resolve, reject) => {
      const fetchReq = fetch(path, options)
    })
  }

  get(pathOrId: string | number | Omit<RequestConfig, 'body'>, config: Omit<RequestConfig, 'body'>) {
    // We know it is a query if its an object as the first param
    if (isObject(pathOrId) && 'query' in pathOrId) {
      config.query = pathOrId.query
      pathOrId = ''
    }

    this.request(typeof pathOrId === 'string' ? pathOrId : `/${pathOrId}`, config)
  }
}

export class Route {
  parentInstance: Eru

  constructor(path) {

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
