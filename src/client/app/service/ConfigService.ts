export interface IVariantClientAppConfig {
    env: string;
    api: string;
    asset: string;
    cache: {
        api: number;
    };
    viewport: {
        Small: number;
        Medium: number;
        Large: number;
    }
}

export interface IPaginationConfig {
    itemsPerPage: number;
}

export interface ITransitionConfig {
    enter: number;
    leave: number;
}

export interface IClientAppConfig extends IVariantClientAppConfig {
    name: string;
    version: { app: string, api: string };
    locale: string;
    pagination: IPaginationConfig;
    transition: ITransitionConfig;
}


export class ConfigService {
    private static config: IClientAppConfig;
    private static storage: any = {};

    static init(config: IClientAppConfig) {
        ConfigService.config = config;
    }

    public static getConfig(): IClientAppConfig {
        return ConfigService.config;
    }

    public static set<T>(key: string, value: T) {
        ConfigService.storage[key] = value;
    }

    public static get<T>(key: string, defaultValue?: T): T {
        if (key in ConfigService.storage) {
            return ConfigService.storage[key];
        }
        if (key in ConfigService.config) {
            return ConfigService.config as any as T;
        }
        return defaultValue;
    }
}