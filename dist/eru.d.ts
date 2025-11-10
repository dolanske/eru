export declare class Eru {
    cfg: EruConfig;
    basePath: string;
    constructor(basePath: string, options?: EruConfig);
    private patchBody;
    private patchBodyless;
    private runRequest;
    route(routePath: string, options?: EruConfig): EruRoute;
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
    get: <T>(idOrPath?: string | number | Omit<EruConfig, 'body'>, options?: EruConfig) => Promise<T>;
    post: <T>(idOrPath: string | number | object, body?: string | object) => Promise<T>;
    put: <T>(idOrPath: string | number | object, body?: string | object) => Promise<T>;
    patch: <T>(idOrPath: string | number | object, body?: string | object) => Promise<T>;
    delete: <T>(idOrPath: string | number, options?: Omit<EruConfig, 'body'>) => Promise<T>;
    cancel: () => void;
}

export { }
