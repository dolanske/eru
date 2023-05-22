

type Query = 'string' | Record<string, string | number>

// interface Eru {
//   get: <T>(query?: Query) => Promise<T>,
//   put: <T>(id: string | number, obj: unknown) => Promise<T>
//   post: <T>(obj: unknown) => Promise<T>
//   delete: <T>(id?: string | number) => Promise<T>
// }

// Taken from https://github.com/posva/mande/blob/b3358a06d4057cbbd953967284287ef7a10c69a5/src/index.ts#LL178C46-L178C46
function stringifyQuery(query: any): string {
  if (!query)
    return ''

  let searchParams = Object.keys(query)
    .map((k) => [k, query[k]].map(encodeURIComponent).join('='))
    .join('&')
  return searchParams ? '?' + searchParams : ''
}

interface EruConfig extends RequestInit {
  tokenKey?: string
  rootPath?: string
  useAuth?: boolean
  onError?: (type: Request['method'], e: Error) => void
  onLoading?: (isLoading: boolean) => void
}

export const cfg: EruConfig = {
  mode: 'cors',
  rootPath: '',
  useAuth: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
}

export function setupEru(config: EruConfig) {
  Object.assign(cfg, config)
}

async function handle<T>(path: string, options: any): Promise<T> {
  const token = localStorage.getItem(cfg?.tokenKey ?? '')

  if (token)
    options.headers.Authorization = `Bearer ${token}`

  if (cfg.onLoading)
    cfg.onLoading(true)

  options.body = JSON.stringify(options.body ?? '')

  return fetch(path, options)
    .then((res) => {
      return res.json().then(parsed => {

      })
    })
    .catch((err) => {
      if (cfg.onError)
        cfg.onError(options.method, err)

      return Promise.reject()
    })
    .finally(() => {
      if (cfg.onLoading)
      cfg.onLoading(false)
    })
}

interface RequestOptions extends RequestInit {
  query?: any,
  body?: any
}

export function eru(path: string) {
  return {
    get: <T>(id?: number | RequestOptions, options?: RequestOptions) => {
      const idStringPart = typeof id === 'number' ? `/${options}` : ''
      const parsedOptions = typeof id === 'number' ? options : id

      const GET_CONFIG = Object.assign(cfg, parsedOptions)
      return handle<T>(cfg.rootPath + path + idStringPart + stringifyQuery(parsedOptions?.query), GET_CONFIG)
    },
    post: <T>(id: string | number, options?: RequestOptions) => {
      const getOptions = Object.assign(cfg, {
        method: 'POST',
      }, options)

      return handle<T>(cfg.rootPath + path + `/${id}` + stringifyQuery(options?.query), getOptions)
    }
  }
}

// usage

// setupEru({
//   rootPath: 'https://api.test.com'
// })

// const users = eru('/user')
// const test = users.get<{test: number}>()