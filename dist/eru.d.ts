import { EruConfig, EruRoute } from "./types";
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
