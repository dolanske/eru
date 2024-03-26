export declare class Eru {
    cfg: EruConfig;
    basePath: string;
    constructor(path: string, options?: EruConfig);
    private patchBody;
    private patchBodyless;
    private runRequest;
    route(path: string, options?: EruConfig): EruRoute;
}

export declare function eru(path: string, options?: EruConfig): Eru;

declare interface EruConfig extends RequestInit, EruListeners {
    authTokenKey?: string;
    rejectReturn?: any;
}

declare interface EruListeners {
    onError?: (error: Error, type: Request['method']) => void;
    onLoading?: (isLoading: boolean, type: Request['method']) => void;
    onDone?: (type: Request['method']) => void;
}

export declare interface EruRoute {
    get: <T>(id?: string | number | Omit<RequestConfig, 'body'>, options?: RequestConfig) => Promise<T>;
    post: <T>(id: string | number | object, body?: string | object) => Promise<T>;
    put: <T>(id: string | number, options: RequestConfig) => Promise<T>;
    patch: <T>(id: string | number, options: RequestConfig) => Promise<T>;
    delete: <T>(id: number, options?: Omit<RequestConfig, 'body'>) => Promise<T>;
    cancel(): void;
}

declare interface RequestConfig {
    query?: string | Record<string, string | number>;
    body: any;
}

export { }
