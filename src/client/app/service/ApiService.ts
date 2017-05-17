import {Err} from "vesta-lib/Err";
import {AuthService} from "./AuthService";
import {ConfigService} from "./ConfigService";
declare let param: (any) => string;

export interface IFileKeyValue {
    [key: string]: File | Blob | Array<File | Blob>;
}

export class ApiService {
    private static instance: ApiService;
    private endPoint: string = '';
    private enableCache: boolean;
    private isDev = ConfigService.getInstance().get<string>('env') != 'production';

    public static getInstance(): ApiService {
        if (!ApiService.instance) {
            return new ApiService(AuthService.getInstance());
        }
        return ApiService.instance;
    }

    constructor(private authService: AuthService) {
        let cfg: ConfigService = ConfigService.getInstance();
        this.endPoint = cfg.get<string>('api');
        this.enableCache = !!cfg.get<{ api: string }>('cache').api;
        this.endPoint += '/';
        ApiService.instance = this;
    }

    private errorHandler(error): Err {
        if (!error) {
            error = new Err(Err.Code.NoDataConnection);
        }
        error.message = error.message || 'Something goes wrong!';
        error.code = error.code || Err.Code.Unknown;
        if (this.isDev) {
            console.error('ApiServer', error);
        }
        return error;
    }

    private requestHandler<T>(req: Request): Promise<T> {
        // fetch method won't reject even if status code is 5xx
        return fetch(req)
            .then((response: Response) => {
                if (!response) throw null;
                this.extractToken(response.headers);
                return <Promise<T>>response.json();
            })
            .then((response) => {
                if (response['error']) {
                    throw response['error'];
                }
                return response;
            })
            .catch(response => {
                // for reject handlers inside caller method
                throw this.errorHandler(response);
            });
    }

    private onBeforeSend(request: Request) {
        // token
        let token = this.authService.getToken();
        if (token) {
            request.headers.set('X-Auth-Token', token);
        }
    }

    private extractToken(headers: Headers) {
        let tkn = headers.get('X-Auth-Token');
        if (tkn) {
            this.authService.setToken(tkn);
        }
    }

    public get<T, U>(edge: string, data?: T): Promise<U> {
        let urlData = data ? `?${param(data)}` : '';
        let request = new Request(`${this.endPoint}${edge}${urlData}`);
        this.onBeforeSend(request);
        return this.requestHandler<U>(request);
    }

    public post<T, U>(edge: string, data?: T): Promise<U> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let request = new Request(`${this.endPoint}${edge}`, {
            method: 'post',
            body: JSON.stringify(data) || '',
            headers
        });
        this.onBeforeSend(request);
        return this.requestHandler<U>(request);
    }

    public upload<T, U>(edge: string, files: IFileKeyValue, data?: T): Promise<U> {
        let fd = new FormData();
        data && fd.append('data', JSON.stringify(data));
        for (let i = 0, keys = Object.keys(files), il = keys.length; i < il; i++) {
            let fileName = keys[i];
            if (files[fileName] instanceof Array) {
                let fileList = <Array<File>> files[fileName];
                for (let j = fileList.length; j--;) {
                    fd.append(fileName, fileList[j]);
                }
            } else {
                fd.append(fileName, files[fileName]);
            }
        }
        let request = new Request(`${this.endPoint}${edge}`, {method: 'post', body: fd});
        this.onBeforeSend(request);
        // config.reqConfig.transformRequest = angular.identity;
        // config.reqConfig.headers['content-type'] = undefined;
        return this.requestHandler<U>(request);
    }

    public put<T, U>(edge: string, data?: T): Promise<U> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let request = new Request(`${this.endPoint}${edge}`, {
            method: 'put',
            body: JSON.stringify(data) || '',
            headers
        });
        this.onBeforeSend(request);
        return this.requestHandler<U>(request);
    }

    public delete<T, U>(edge: string, data?: T): Promise<U> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let request = new Request(`${this.endPoint}${edge}`, {
            method: 'delete',
            body: JSON.stringify(data) || '',
            headers
        });
        this.onBeforeSend(request);
        return this.requestHandler<U>(request);
    }
}
