import { Promise } from "es6-promise";
import { Err, IQueryRequest, IQueryResult } from "../medium";
import { AuthService } from "./AuthService";
import { Config } from "./Config";

export interface IApiServiceRequest<T> extends Promise<T> {
    abort?: () => void;
    xhr?: XMLHttpRequest;
}

export class ApiService {

    public static getInstance(authService: AuthService = AuthService.getInstance()): ApiService {
        if (!ApiService.instance) {
            ApiService.instance = new ApiService(authService);
        }
        return ApiService.instance;
    }

    private static instance: ApiService;
    private endPoint: string = "";
    private sourceApp;
    // private enableCache: boolean;
    private tokenHeaderKeyName = "X-Auth-Token";

    private constructor(private authService: AuthService) {
        const cfg = Config.getConfig();
        this.endPoint = `${cfg.api}/api/${cfg.version.api}`;
        // this.enableCache = !!cfg.cache.api;
        this.sourceApp = Config.get("sourceApp");
    }

    public del<T>(edge: string, data?: IQueryRequest<T>) {
        const queryString = data ? `?${this.param(data)}&s=${this.sourceApp}` : `?s=${this.sourceApp}`;
        return this.xhr<IQueryResult<T>>("DELETE", `${edge}${queryString}`, null, null);
    }

    public get<T>(edge: string, data?: IQueryRequest<T>) {
        const queryString = data ? `?${this.param(data)}&s=${this.sourceApp}` : `?s=${this.sourceApp}`;
        return this.xhr<IQueryResult<T>>("GET", `${edge}${queryString}`, null, null);
    }

    public post<T>(edge: string, data: any) {
        const headers = { "Content-Type": "application/json" };
        data.s = this.sourceApp;
        return this.xhr<IQueryResult<T>>("POST", edge, JSON.stringify(data), headers);
    }

    public put<T>(edge: string, data: any) {
        const headers = { "Content-Type": "application/json" };
        data.s = this.sourceApp;
        return this.xhr<IQueryResult<T>>("PUT", edge, JSON.stringify(data), headers);
    }

    public upload<T>(edge: string, files: T) {
        const formData = new FormData();
        for (let fields = Object.keys(files), i = 0, il = fields.length; i < il; ++i) {
            const value = files[fields[i]];
            const fieldName = fields[i];
            // in order to upload the files properly, we should flattern the uploaded files
            if (value instanceof File) {
                formData.append(fields[i], value);
            } else if (Array.isArray(value)) {
                for (let j = 0, jl = value.length; j < jl; ++j) {
                    formData.append(`${fieldName}_${j}`, value[j]);
                }
            } else if ("object" === typeof value) {
                for (let subFields = Object.keys(value), j = 0, jl = subFields.length; j < jl; ++j) {
                    const subFieldName = subFields[j];
                    formData.append(`${fieldName}_${subFieldName}`, value[subFieldName]);
                }
            }
        }
        return this.xhr<IQueryResult<T>>("POST", `${edge}?s=${this.sourceApp}`, formData, null);
    }

    private onAfterReceive(xhr: XMLHttpRequest) {
        const token = xhr.getResponseHeader(this.tokenHeaderKeyName);
        if (token) {
            this.authService.setToken(token);
        }
    }

    private onBeforeSend(xhr: XMLHttpRequest) {
        const token = this.authService.getToken();
        if (token) {
            xhr.setRequestHeader(this.tokenHeaderKeyName, token);
        }
    }

    /**
     * jquery-param
     */
    private param(data) {
        const queryStringParts = [];
        const rBracket = /\[\]$/;

        return buildParams("", data).join("&").replace(/%20/g, "+");

        function isArray(obj) {
            return Object.prototype.toString.call(obj) === "[object Array]";
        }

        function add(k: string, v) {
            if (typeof v === "function") { return; }
            if (v === null || v === undefined) { return; }
            queryStringParts.push(`${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
        }

        function buildParams(prefix: string, obj) {
            if (prefix) {
                if (isArray(obj)) {
                    for (let i = 0, len = obj.length; i < len; i++) {
                        if (rBracket.test(prefix)) {
                            add(prefix, obj[i]);
                        } else {
                            buildParams(`${prefix}[${typeof obj[i] === "object" ? i : ""}]`, obj[i]);
                        }
                    }
                } else if (obj && String(obj) === "[object Object]") {
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

    private xhr<T>(method: string, edge: string, data: any, headers: any): IApiServiceRequest<T> {
        const xhr = new XMLHttpRequest();
        const promise: IApiServiceRequest<T> = new Promise<T>((resolve, reject) => {
            xhr.open(method, `${this.endPoint}/${edge}`, true);
            this.onBeforeSend(xhr);
            if (headers) {
                for (let headerKeys = Object.keys(headers), i = headerKeys.length; i--;) {
                    const header = headerKeys[i];
                    xhr.setRequestHeader(header, headers[header]);
                }
            }
            xhr.onreadystatechange = () => {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (!xhr.status) {
                        return reject(Err.Code.NoDataConnection);
                    }
                    if (xhr.status === 200) {
                        this.onAfterReceive(xhr);
                    }
                    const contentType = xhr.getResponseHeader("Content-Type");
                    if (contentType && contentType.indexOf("application/json") >= 0) {
                        try {
                            const response: any = JSON.parse(xhr.responseText);
                            response && response.error ? reject(response.error) : resolve(response as T);
                        } catch (e) {
                            reject(new Error(e.message));
                        }
                    } else {
                        resolve(xhr.responseText as any as T);
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
}
