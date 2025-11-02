export interface EruListeners {
  onError?: (error: Error, type: Request['method']) => void
  onLoading?: (isLoading: boolean, type: Request['method']) => void
  onDone?: (type: Request['method']) => void
}

export interface EruConfig extends RequestInit, EruListeners {
  authTokenKey?: string
  rejectReturn?: any
}

export interface RequestConfig {
  query?: string | Record<string, string | number>
  body?: any
  headers?: HeadersInit
}

export interface SerializedEruOptions extends EruConfig {
  method: Request['method']
}

export interface EruRoute {
  get: <T>(idOrPath?: string | number | Omit<RequestConfig, 'body'>, options?: RequestConfig) => Promise<T>
  post: <T>(idOrPath: string | number | object, body?: string | object) => Promise<T>
  put: <T>(idOrPath: string | number | object, body?: string | object) => Promise<T>
  patch: <T>(idOrPath: string | number | object, body?: string | object) => Promise<T>
  delete: <T>(idOrPath: string | number, options?: Omit<RequestConfig, 'body'>) => Promise<T>
  cancel: () => void
}
