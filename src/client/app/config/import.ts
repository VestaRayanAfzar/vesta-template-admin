import {NetworkService} from "../service/NetworkService";
import {StorageService} from "../service/StorageService";
import {AuthService} from "../service/AuthService";
import {ApiService} from "../service/ApiService";
import {TranslateService} from "../service/TranslateService";
import {I18nService} from "../service/I18nService";
import {LogService} from "../service/LogService";
///<vesta:import/>

interface IExporter {
    controller: any;
    service: any;
    filter: any;
    directive: any;
}

export const exporter: IExporter = {
    service: {
        i18nService: I18nService,
        translateService: TranslateService,
        apiService: ApiService,
        authService: AuthService,
        logService: LogService,
        storageService: StorageService,
        networkService: NetworkService,
        ///<vesta:ngService/>
    },
    filter: {
        ///<vesta:ngFilter/>
    },
    directive: {
        ///<vesta:ngDirective/>
    },
    controller: {
        ///<vesta:ngController/>
    }
};
