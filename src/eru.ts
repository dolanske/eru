function stringifyQuery(query: any): string {
  if (!query)
    return ''

  const searchParams = Object.keys(query)
    .map(k => [k, query[k]].map(encodeURIComponent).join('='))
    .join('&')
  return searchParams ? `?${searchParams}` : ''
}

interface EruListeners {
  onError?: (error: Error, type: Request['method'],) => void
  onLoading?: (isLoading: boolean, type: Request['method']) => void
  onDone?: (type: Request['method']) => void
}

interface EruConfig extends RequestInit, EruListeners {
  rootPath?: string
  authTokenKey?: string
  // In case the promise is rejected, instead of reject(err),
  // it'll use reject(cfg.rejectReturn) which for instance can be an empty array
  rejectReturn?: any
}

export const cfg: EruConfig = {
  mode: 'cors',
  rootPath: '',
  authTokenKey: undefined,
  headers: {
    Accept: 'application/json',
    // 'Content-Type': 'application/json',
  },
}

export function setupEru(config: EruConfig) {
  Object.assign(cfg, config)
}

interface RequestConfig {
  query?: string | Record<string, string | number>
  body: any
}

// This is the final options object used within the handle function
interface SerializedEruOptions extends EruConfig {
  method: Request['method']
}

async function handle<T>(path: string, options: SerializedEruOptions): Promise<T> {
  if (cfg.authTokenKey)
    // @ts-expect-error options.headers are defined in the `cfg` defaults, which indeed are merged together in the patch functions
    options.headers.Authorization = `Bearer ${localStorage.getItem(cfg?.authTokenKey)}`

  if (options.onLoading)
    options.onLoading(true, options.method)

  if (options.body)
    options.body = JSON.stringify(options.body)

  return new Promise<T>((resolve, reject) => {
    fetch(options.rootPath + path, options)
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

            if (cfg.rejectReturn)
              resolve(cfg.rejectReturn)
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

        if (cfg.rejectReturn)
          resolve(cfg.rejectReturn as T)
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

// Helper method for seting up PUT, PATCH and POST requests as their functionality is exactly the same
function _patchBody<T>(method: 'PUT' | 'PATCH' | 'POST', path: string, id: string | number, options: any, instanceOptions: any) {
  const patchOptions: SerializedEruOptions = Object.assign(cfg, instanceOptions, {
    method,
    body: JSON.stringify(options?.body ?? {}),
  }, options)

  return handle<T>(`${path}${id ? `/${id}` : ''}${stringifyQuery(options?.query)}`, patchOptions)
}

function _patchBodyless<T>(method: 'GET' | 'DELETE' | 'POST', path: string, id: string | number, options: any, instanceOptions: any) {
  const GET_CONFIG: SerializedEruOptions = Object.assign(cfg, instanceOptions, {
    method,
  }, options)
  return handle<T>(`${path}${id ? `/${id}` : ''}${stringifyQuery(options?.query)}`, GET_CONFIG)
}

interface EruInstance {
  get: <T>(id?: string | number | Omit<RequestConfig, 'body'>, options?: RequestConfig) => Promise<T>
  post: <T>(id: string | number | RequestConfig, options?: RequestConfig) => Promise<T>
  put: <T>(id: string | number, options: RequestConfig) => Promise<T>
  patch: <T>(id: string | number, options: RequestConfig) => Promise<T>
  delete: <T>(id: number, options?: Omit<RequestConfig, 'body'>) => Promise<T>

  /**
   * Cancel all running requests for this Eru instance
   */
  cancel(): void
}

/**
 * Creates an API enxpoint instance with the provided path. Exposing all the fetching methods.
 *
 * @param path Endpoint path partial
 * @param options Additional options
 * @returns
 */
export function eru(path: string, options?: EruConfig): EruInstance {
  const instanceOptions = options ?? {}
  let controller = new AbortController()
  instanceOptions.signal = controller.signal

  return {
    get: <T>(id?: string | number | Omit<RequestConfig, 'body'>, options?: RequestConfig) => {
      const patchedId = (typeof id === 'number' || typeof id === 'string') ? `/${id}` : ''
      const parsedOptions = (typeof id === 'number' || typeof id === 'string') ? options : id
      return _patchBodyless<T>('GET', path, patchedId, parsedOptions, instanceOptions)
    },
    post: <T>(id: string | number | RequestConfig, options?: RequestConfig) => {
      // If no options were provided, we can assume that
      if (typeof id !== 'number' && typeof id !== 'string') {
        options = id
        id = ''
      }

      return _patchBody<T>('POST', path, id, options, instanceOptions)
    },
    put: <T>(id: string | number, options: RequestConfig) => _patchBody<T>('PUT', path, id, options, instanceOptions),
    patch: <T>(id: string | number, options: RequestConfig) => _patchBody<T>('PATCH', path, id, options, instanceOptions),
    delete: <T>(id: number, options?: Omit<RequestConfig, 'body'>) => _patchBodyless<T>('DELETE', path, id, options, instanceOptions),
    cancel: () => {
      // Abort all requests and assign a new abort controller instance
      controller.abort()
      controller = new AbortController()
      instanceOptions.signal = controller.signal
    },
  }
}
