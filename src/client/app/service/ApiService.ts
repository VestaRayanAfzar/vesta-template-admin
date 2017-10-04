import {AuthService} from "./AuthService";
import {ConfigService, IClientAppConfig} from "./ConfigService";
import {IModelValues, IQueryRequest, IQueryResult} from "../medium";

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

    private xhr<T, U>(method: string, edge: string, data: U, headers: any): ApiServiceRequest<T> {
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
            xhr.send(data ? JSON.stringify(data) : null);
        });
        promise.xhr = xhr;
        promise.abort = () => {
            xhr.abort();
        };
        return promise;
    }

    public get<T>(edge: string, data?: IQueryRequest<T>) {
        let queryString = data ? `?${this.param(data)}` : '';
        return this.xhr<IQueryResult<T>, T>('GET', `${edge}${queryString}`, null, null);
    }

    public post<T>(edge: string, data: T) {
        let headers = {'Content-Type': 'application/json'};
        return this.xhr<IQueryResult<T>, T>('POST', edge, data, headers);
        }

    public put<T>(edge: string, data: T) {
        let headers = {'Content-Type': 'application/json'};
        return this.xhr<IQueryResult<T>, T>('PUT', edge, data, headers);
    }

    public del<T>(edge: string, id: number) {
        return this.xhr<IQueryResult<T>, T>('DELETE', `${edge}/${id}`, null, null);
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

    /**
     * jquery-param
     */
    private param(data) {
        let s = [];
        let rbracket = /\[\]$/;

        return buildParams('', data).join('&').replace(/%20/g, '+');

        function isArray(obj) {
            return Object.prototype.toString.call(obj) === '[object Array]';
        }

        function add(k: string, v) {
            v = typeof v === 'function' ? v() : v === null ? '' : v === undefined ? '' : v;
            s[s.length] = `${encodeURIComponent(k)}=${encodeURIComponent(v)}`;
        }

        function buildParams(prefix: string, obj) {
            if (prefix) {
                if (isArray(obj)) {
                    for (let i = 0, len = obj.length; i < len; i++) {
                        if (rbracket.test(prefix)) {
                            add(prefix, obj[i]);
                        } else {
                            buildParams(`${prefix}[${typeof obj[i] === 'object' ? i : ''}]`, obj[i]);
                        }
                    }
                } else if (obj && String(obj) === '[object Object]') {
                    for (let keys = Object.keys(obj), i = keys.length; --i;) {
                        buildParams(`${prefix}[${keys[i]}]`, obj[keys[i]]);
                    }
                } else {
                    add(prefix, obj);
                }
            } else {
                for (let keys = Object.keys(obj), i = keys.length; --i;) {
                    buildParams(keys[i], obj[keys[i]]);
                }
            }
            return s;
        }
    }
}
