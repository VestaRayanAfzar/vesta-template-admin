import {AuthService} from "./AuthService";
import {ConfigService, IClientAppConfig} from "./ConfigService";
import {IQueryRequest, IQueryResult} from "../cmn/core/ICRUDResult";

export interface ApiServiceRequest<T> extends Promise<T> {
    xhr?: XMLHttpRequest;
    abort?: () => void;
}

export class ApiService {
    private static instance: ApiService;
    private endPoint: string = '';
    private enableCache: boolean;
    private tokenHeaderKeyName = 'X-Auth-Token';
    private sourceApp;

    private constructor(private authService: AuthService) {
        const cfg: IClientAppConfig = ConfigService.getConfig();
        this.endPoint = `${cfg.api}/api/${cfg.version.api}`;
        this.enableCache = !!cfg.cache.api;
        this.sourceApp = ConfigService.get('sourceApp');
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

    private xhr<T>(method: string, edge: string, data: any, headers: any): ApiServiceRequest<T> {
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

    public get<T>(edge: string, data?: IQueryRequest<T>) {
        let queryString = data ? `?${this.param(data)}&s=${this.sourceApp}` : `?s=${this.sourceApp}`;
        return this.xhr<IQueryResult<T>>('GET', `${edge}${queryString}`, null, null);
    }

    public post<T>(edge: string, data: T) {
        let headers = {'Content-Type': 'application/json'};
        data['s'] = this.sourceApp;
        return this.xhr<IQueryResult<T>>('POST', edge, JSON.stringify(data), headers);
    }

    public put<T>(edge: string, data: T) {
        let headers = {'Content-Type': 'application/json'};
        data['s'] = this.sourceApp;
        return this.xhr<IQueryResult<T>>('PUT', edge, JSON.stringify(data), headers);
    }

    public del<T>(edge: string, id: number | string) {
        return this.xhr<IQueryResult<T>>('DELETE', `${edge}/${id}?s=${this.sourceApp}`, null, null);
    }

    public upload<T>(edge: string, id: number, files: T) {
        return this.xhr<IQueryResult<T>>('POST', `${edge}/${id}?s=${this.sourceApp}`, this.toFormData(files), null);
    }

    public toFormData(data: Object): FormData {
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
        let queryStringParts = [];
        let rbracket = /\[\]$/;

        return buildParams('', data).join('&').replace(/%20/g, '+');

        function isArray(obj) {
            return Object.prototype.toString.call(obj) === '[object Array]';
        }

        function add(k: string, v) {
            if (typeof v === 'function') return;
            if (v === null || v === undefined) return;
            queryStringParts.push(`${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
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
                    for (let keys = Object.keys(obj), i = keys.length; i--;) {
                        buildParams(`${prefix}[${keys[i]}]`, obj[keys[i]]);
                    }
                } else {
                    add(prefix, obj);
                }
            } else {
                for (let keys = Object.keys(obj), i = keys.length; i--;) {
                    buildParams(keys[i], obj[keys[i]]);
                }
            }
            return queryStringParts;
        }
    }
}
