interface EruListeners {
    onError?: (error: Error, type: Request['method']) => void;
    onLoading?: (isLoading: boolean, type: Request['method']) => void;
    onDone?: (type: Request['method']) => void;
}
interface EruConfig extends RequestInit, EruListeners {
    rootPath?: string;
    authTokenKey?: string;
    rejectReturn?: any;
}
export declare const cfg: EruConfig;
export declare function setupEru(config: EruConfig): void;
interface RequestConfig {
    query?: string | Record<string, string | number>;
    body: any;
}
interface EruInstance {
    get: <T>(id?: string | number | Omit<RequestConfig, 'body'>, options?: RequestConfig) => Promise<T>;
    post: <T>(id: string | number | RequestConfig, options?: RequestConfig) => Promise<T>;
    put: <T>(id: string | number, options: RequestConfig) => Promise<T>;
    patch: <T>(id: string | number, options: RequestConfig) => Promise<T>;
    delete: <T>(id: number, options?: Omit<RequestConfig, 'body'>) => Promise<T>;
    /**
     * Cancel all running requests for this Eru instance
     */
    cancel(): void;
}
/**
 * Creates an API enxpoint instance with the provided path. Exposing all the fetching methods.
 *
 * @param path Endpoint path partial
 * @param options Additional options
 * @returns
 */
export declare function eru(path: string, options?: EruConfig): EruInstance;
export {};
