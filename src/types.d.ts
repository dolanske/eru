export interface EruListeners {
  onError?: (error: Error, type: Request['method'],) => void
  onLoading?: (isLoading: boolean, type: Request['method']) => void
  onDone?: (type: Request['method']) => void
}

export interface EruConfig extends RequestInit, EruListeners {
  // rootPath?: string
  authTokenKey?: string
  // In case the promise is rejected, instead of reject(err),
  // it'll use reject(cfg.rejectReturn) which for instance can be an empty array
  rejectReturn?: any
}

export interface RequestConfig {
  query?: string | Record<string, string | number>
  body: any
}

// This is the final options object used within the handle function
export interface SerializedEruOptions extends EruConfig {
  method: Request['method']
}

export interface EruRoute {
  get: <T>(id?: string | number | Omit<RequestConfig, 'body'>, options?: RequestConfig) => Promise<T>
  post: <T>(id: object) => Promise<T>
  post: <T>(id: string | number | object, body?: string | object) => Promise<T>
  put: <T>(id: string | number, options: RequestConfig) => Promise<T>
  patch: <T>(id: string | number, options: RequestConfig) => Promise<T>
  delete: <T>(id: number, options?: Omit<RequestConfig, 'body'>) => Promise<T>

  // Cancel all running requests for this Eru instance
  cancel(): void
}