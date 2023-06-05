// Taken from https://github.com/posva/mande/blob/b3358a06d4057cbbd953967284287ef7a10c69a5/src/index.ts#LL178C46-L178C46
function stringifyQuery(query: any): string {
  if (!query)
    return ''

  const searchParams = Object.keys(query)
    .map(k => [k, query[k]].map(encodeURIComponent).join('='))
    .join('&')
  return searchParams ? `?${searchParams}` : ''
}

interface EruConfig extends RequestInit {
  rootPath?: string
  authTokenKey?: string
  // TODO:  Figure out a nice ergonomic way for event listeners
  //        These would be specifically useful when working with vue without having to supply a specific vue version
  // onError?: (type: Request['method'], e: Error) => void
  // onLoading?: (isLoading: boolean) => void
}

export const cfg: EruConfig = {
  mode: 'cors',
  rootPath: '',
  authTokenKey: undefined,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
}

export function setupEru(config: EruConfig) {
  Object.assign(cfg, config)
}

async function handle<T>(path: string, options: any): Promise<T | Error> {
  if (cfg.authTokenKey)
    options.headers.Authorization = `Bearer ${localStorage.getItem(cfg?.authTokenKey)}`

  // if (cfg.onLoading)
  //   cfg.onLoading(true)

  if (options.body)
    options.body = JSON.stringify(options.body)

  return fetch(options.rootPath + path, options)
    .then(async (res) => {
      return res.text().then((text: string) => {
        if (!res.ok) {
          let message = null
          try {
            const parsed = JSON.parse(text)
            message = parsed.message
          }
          catch (e) {
            message = text
          }
          return Promise.reject(new Error(
            message || `An unexpected error occured: ${res.statusText}`,
          ))
        }

        return res as T
      })
    })
}

interface RequestConfig<OptionalBodyType = string | object> extends Omit<EruConfig, 'body'> {
  query?: string | Record<string, string | number>
  body: OptionalBodyType
}

// Helper method for seting up PUT, PATCH and POST requests as their functionality is exactly the same
function _patchBody<T>(method: 'PUT' | 'PATCH' | 'POST', path: string, id: string | number, options: any, instanceOptions: any) {
  const patchOptions = Object.assign(cfg, instanceOptions, {
    method,
    body: JSON.stringify(options.body),
  }, options)

  return handle<T>(`${path}/${id}${stringifyQuery(options?.query)}`, patchOptions)
}

function _patchBodyless<T>(method: 'GET' | 'DELETE' | 'POST', path: string, id: string | number, options: any, instanceOptions: any) {
  const GET_CONFIG = Object.assign(cfg, instanceOptions, {
    method,
  }, options)
  return handle<T>(path + id + stringifyQuery(options?.query), GET_CONFIG)
}

/**
 * Creates an API enxpoint instance with the provided path. Exposing all the fetching methods.
 *
 * @param path Endpoint path partial
 * @param options Additional options
 * @returns
 */
export function eru(path: string, options?: EruConfig) {
  const instanceOptions = options ?? {}

  return {
    get: <T>(id?: string | number | Omit<RequestConfig, 'body'>, options?: RequestConfig) => {
      const patchedId = (typeof id === 'number' || typeof id === 'string') ? `/${id}` : ''
      const parsedOptions = (typeof id === 'number' || typeof id === 'string') ? options : id
      return _patchBodyless<T>('GET', path, patchedId, parsedOptions, instanceOptions)
    },
    delete: <T>(id: number, options?: Omit<RequestConfig, 'body'>) => _patchBodyless<T>('DELETE', path, id, options, instanceOptions),
    post: <T>(options: RequestConfig<T>) => _patchBodyless<T>('POST', path, '', options, instanceOptions),
    put: <T>(id: string | number, options: RequestConfig<T>) => _patchBody<T>('PUT', path, id, options, instanceOptions),
    patch: <T>(id: string | number, options: RequestConfig<T>) => _patchBody<T>('PATCH', path, id, options, instanceOptions),
  }
}
