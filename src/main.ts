

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

function noop() {

}


interface EruConfig extends RequestInit {
  rootPath?: string
  onError?: (type?: RequestInfo['method'], e: Error) => void
}

export const cfg: EruConfig = {
  rootPath: '',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
}

function setupEru(config: EruConfig) {
  Object.assign(cfg, config)
}

function handle<T>(path: string, options: any): Promise<T> {
  return fetch(path, options)
    .then((res) => res as T)
    .catch(cfg.onError ?? noop)
}

interface RequestOptions extends RequestInit {
  query?: any
}

export function eru(path: string) {
  return {
    get: <T>(options: RequestOptions) => {
      const getOptions = Object.assign(cfg, {
        method: 'POST',
      }, options)

      return handle<T>(cfg.rootPath + path + stringifyQuery(options.query), getOptions)
    }
  }

}