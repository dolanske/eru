import type { EruConfig, EruRoute, RequestConfig, SerializedEruOptions } from './types'
import { isObject, stringifyQuery } from './util'


export class Eru {
  cfg: EruConfig
  basePath: string

  constructor(path: string, options: EruConfig = {}) {
    this.cfg = Object.assign({
      mode: 'cors',
      authTokenKey: undefined,
      headers: {
        Accept: 'application/json',
      },
    }, options)
    this.basePath = path
  }

  // Helper method for seting up PUT, PATCH and POST requests as their functionality is exactly the same
  private patchBody<T>(method: 'PUT' | 'PATCH' | 'POST', path: string, id: string | number, options: any, instanceOptions: any) {
    const patchOptions: SerializedEruOptions = Object.assign(this.cfg, instanceOptions, {
      method,
      body: JSON.stringify(options?.body ?? {}),
    }, options)

    return this.runRequest<T>(`${path}${id ? `/${id}` : ''}${stringifyQuery(options?.query)}`, patchOptions)
  }

  private patchBodyless<T>(method: 'GET' | 'DELETE', path: string, id: string | number, options: any, instanceOptions: any) {
    const patchOptions: SerializedEruOptions = Object.assign(this.cfg, instanceOptions, {
      method,
    }, options)
    // In case idiots pass a body
    delete patchOptions.body
    return this.runRequest<T>(`${path}${id ? `/${id}` : ''}${stringifyQuery(options?.query)}`, patchOptions)
  }

  private runRequest<T>(path: string, options: SerializedEruOptions): Promise<T> {
    if (this.cfg.authTokenKey)
      // @ts-expect-error options.headers are defined in the `cfg` defaults, which indeed are merged together in the patch functions
      options.headers.Authorization = `Bearer ${localStorage.getItem(this.cfg.authTokenKey)}`

    if (options.onLoading)
      options.onLoading(true, options.method)

    if (options.body)
      options.body = JSON.stringify(options.body)

    return new Promise<T>((resolve, reject) => {
      fetch(this.basePath + path, options)
        .then((res) => {
          res.text().then((text: string) => {
            // If something went wrong, we want to either get the error message from the request
            // Or we add a generic error message if it is missing
            if (!res.ok) {
              let message = null

              try {
                const parsed = JSON.parse(text)
                message = parsed.message
              }
              catch (e) {
                message = text
              }

              const err = new Error(message || `[${res.status}] ${res.statusText}`)

              if (options?.onError)
                options.onError(err, options.method)

              if (this.cfg.rejectReturn)
                resolve(this.cfg.rejectReturn)
              else
                reject(err)
            }

            // If everything went fine, we still want to check what type was returned
            // API does not always return JSON
            let okRes

            try {
              okRes = JSON.parse(text)
            }
            catch (e) {
              // This will only catch if the response is not a JSON, meaning we are returning a string
              okRes = text
            }

            resolve(okRes)
          })
        })
        .catch((err) => {
          if (options?.onError)
            options.onError(err, options.method)

          if (this.cfg.rejectReturn)
            resolve(this.cfg.rejectReturn as T)
          else
            reject(err)
        })
        .finally(() => {
          if (options.onLoading)
            options.onLoading(false, options.method)

          if (options.onDone)
            options.onDone(options.method)
        })
    })
  }

  route(path: string, options?: EruConfig): EruRoute {
    const instanceOptions = options ?? {}
    let controller = new AbortController()
    instanceOptions.signal = controller.signal

    let cache = {}

    return {
      get: <T>(id?: string | number | Omit<RequestConfig, 'body'>, options?: RequestConfig) => {
        const patchedId = (typeof id === 'number' || typeof id === 'string') ? String(id) : ''
        const parsedOptions = (typeof id === 'number' || typeof id === 'string') ? options : id
        return this.patchBodyless<T>('GET', path, patchedId, parsedOptions, instanceOptions)
      },
      delete: <T>(id: number, options?: Omit<RequestConfig, 'body'>) => this.patchBodyless<T>('DELETE', path, id, options, instanceOptions),
      post: <T>(id: string | number | object, body?: string | object) => {
        if (isObject(id)) {
          body = id as object
          id = ''
        }
        return this.patchBody<T>('POST', path, String(id), { body }, instanceOptions)
      },
      put: <T>(id: string | number | object, body?: string | object) => {
        if (isObject(id)) {
          body = id as object
          id = ''
        }
        return this.patchBody<T>('PUT', path, String(id), { body }, instanceOptions)
      },
      patch: <T>(id: string | number | object, body?: string | object) => {
        if (isObject(id)) {
          body = id as object
          id = ''
        }
        return this.patchBody<T>('PATCH', path, String(id), { body }, instanceOptions)
      },
      cancel: () => {
        // Abort all requests and assign a new abort controller instance
        controller.abort()
        controller = new AbortController()
        instanceOptions.signal = controller.signal
      },
      flushCache: () => {
        cache = {}
      },
    }
  }
}

export function eru(path: string, options?: EruConfig) {
  return new Eru(path, options)
}

export {
  type EruRoute,
}
