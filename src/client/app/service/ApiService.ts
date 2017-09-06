import {AuthService} from "./AuthService";
import {ConfigService, IClientAppConfig} from "./ConfigService";
import {IModelValues} from "../medium";

declare let param: (data: any) => string;

type PostData = string | ArrayBuffer | Blob | Document | FormData | IModelValues;

export interface IFileKeyValue {
    [key: string]: File | Blob | Array<File | Blob>;
}

export interface ApiServiceRequest<T> extends Promise<T> {
    xhr?: XMLHttpRequest;
    abort?: () => void;
}

export class ApiService {
    private static instance: ApiService;
    private endPoint: string = '';
    private enableCache: boolean;
    private tokenHeaderKeyName = 'X-Auth-Token';

    constructor(private authService: AuthService) {
        let cfg: IClientAppConfig = ConfigService.getConfig();
        this.endPoint = cfg.api;
        this.enableCache = !!cfg.cache.api;
    }

    private onBeforeSend(xhr: XMLHttpRequest) {
        let token = this.authService.getToken();
        if (token) {
            xhr.setRequestHeader(this.tokenHeaderKeyName, token);
        }
    }

    private onAfterReceive(xhr: XMLHttpRequest) {
        let token = xhr.getResponseHeader(this.tokenHeaderKeyName);
        if (token) {
            this.authService.setToken(token);
                }
    }

    private xhr<T>(method: string, edge: string, data: PostData, headers: any): ApiServiceRequest<T> {
        let xhr = new XMLHttpRequest();
        let promise: ApiServiceRequest<T> = new Promise<T>((resolve, reject) => {
            xhr.open(method, `${this.endPoint}/${edge}`, true);
            this.onBeforeSend(xhr);
            if (headers) {
                for (let headerKeys = Object.keys(headers), i = headerKeys.length; i--;) {
                    let header = headerKeys[i];
                    xhr.setRequestHeader(header, headers[header]);
                }
        }
            xhr.onreadystatechange = () => {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                        this.onAfterReceive(xhr);
        }
                        try {
                            let data = JSON.parse(xhr.responseText);
                        data && data.error ? reject(data.error) : resolve(<T>data);
                        } catch (e) {
                        reject(new Error(`${xhr.responseText} [${e.message}]`));
    }
                }
            };
            xhr.send(data);
            });
        promise.xhr = xhr;
        promise.abort = () => {
            xhr.abort();
        };
        return promise;
    }

    public get<T>(edge: string): ApiServiceRequest<T> {
        return this.xhr<T>('GET', edge, null, null);
    }

    public post<T>(edge: string, data: PostData): ApiServiceRequest<T> {
        let headers = {};
        if (typeof data === 'string') {
            headers['Content-Type'] = 'application/json';
        }
        return this.xhr<T>('POST', edge, data, headers);
    }

    public put<T>(edge: string, data: PostData): ApiServiceRequest<T> {
        let headers = {};
        if (typeof data === 'string') {
            headers['Content-Type'] = 'application/json';
    }
        return this.xhr<T>('PUT', edge, data, headers);
    }

    public static toFormData(data: Object): FormData {
        let fd = new FormData();
        for (let keys = Object.keys(data), i = keys.length; i--;) {
            fd.append(keys[i], data[keys[i]]);
        }
        return fd;
    }

    public static getInstance(authService: AuthService = AuthService.getInstance()): ApiService {
        if (!ApiService.instance) {
            ApiService.instance = new ApiService(authService);
    }
        return ApiService.instance;
    }
}
