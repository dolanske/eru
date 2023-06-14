interface EruListeners {
    onError?: (error: Error, type: Request['method']) => void;
    onLoading?: (isLoading: boolean, type: Request['method']) => void;
}
interface EruConfig extends RequestInit, EruListeners {
    rootPath?: string;
    authTokenKey?: string;
    rejectDefault?: any;
}
export declare const cfg: EruConfig;
export declare function setupEru(config: EruConfig): void;
interface RequestConfig<OptionalBodyType = string | object> extends Omit<EruConfig, 'body'> {
    query?: string | Record<string, string | number>;
    body: OptionalBodyType;
}
/**
 * Creates an API enxpoint instance with the provided path. Exposing all the fetching methods.
 *
 * @param path Endpoint path partial
 * @param options Additional options
 * @returns
 */
export declare function eru(path: string, options?: EruConfig): {
    get: <T>(id?: string | number | Omit<RequestConfig, 'body'>, options?: RequestConfig) => Promise<T>;
    delete: <T_1>(id: number, options?: Omit<RequestConfig, 'body'>) => Promise<T_1>;
    post: <T_2>(options: RequestConfig<T_2>) => Promise<T_2>;
    put: <T_3>(id: string | number, options: RequestConfig<T_3>) => Promise<T_3>;
    patch: <T_4>(id: string | number, options: RequestConfig<T_4>) => Promise<T_4>;
};
export {};
