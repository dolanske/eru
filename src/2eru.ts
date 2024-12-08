// SWR
// 1. fetch data, cache them with a key
// 2. fetch again with same key? return cache, make request
// 3. replace data with new data when request comes in, voila

import { createEminem } from '@dolanske/eminem'
import { isObject } from './util'

// TODO: could implement through proxies
// TODO: rewrite whole thing tbh

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

type EruQuery = Record<string, string | number>

interface EruConfig extends RequestInit {
  // rootPath?: string
  // authTokenKey?: string
  // In case the promise is rejected, instead of reject(err),
  // it'll use reject(cfg.rejectReturn) which for instance can be an empty array
  // rejectReturn?: any
}

interface EruOptions {
  query: EruQuery | string
  body: any
}

export const defaults = {
  // custom eru options
  cache: false,
  cacheInvalidate: 6000,
  responseType: 'json',

  // Actual request options
  headers: {
    Accept: 'application/json',
  },
}

interface EruEvents {
  request: () => void
  resolve: () => void
  reject: () => void
}

function eru2(path: string, rootOptions: EruConfig = {}) {
  // const rootEmitter = createEminem<EruEvents>()

  const options = {
    ...defaults,
    ...rootOptions,
  }

  return {
    route: route.bind(null, path),
    // on: rootEmitter.on,
  }
}

function request(method: string, baseUrl: string, urlOrDataOrOptions?: string | number | EruOptions | any, dataOrOptions?: EruOptions | any, requestOptions?: EruOptions) {

}

function route(base: string, pathOptions: string | EruConfig, options?: EruConfig) {
  // const base
  // const routeEmitter = createEminem<EruEvents>()

  return {
    // on: routeEmitter.on,
    get: () => { },
    delete: () => { },

    post: request.bind(null, 'POST'),
    patch: request.bind(null, 'PATCH'),
    put: request.bind(null, 'PUT'),
  }
}
