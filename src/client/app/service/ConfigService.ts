export interface IVariantClientAppConfig {
    api: string;
    env: string;
    sw: string;
    viewport: {
        Large: number;
        Medium: number;
        Small: number;
    };
}

export interface IVersion {
    api: string;
    app: string;
}

export interface IPaginationConfig {
    itemsPerPage: number;
}

export interface ITransitionConfig {
    enter: number;
    leave: number;
}

export interface IClientAppConfig extends IVariantClientAppConfig {
    locale: string;
    name: string;
    pagination: IPaginationConfig;
    transition: ITransitionConfig;
    version: IVersion;
}

export class ConfigService {
    private static config: IClientAppConfig;
    private static storage: any = {};

    public static get<T>(key: string, defaultValue?: T): T {
        if (key in ConfigService.storage) {
            return ConfigService.storage[key];
        }
        if (key in ConfigService.config) {
            return ConfigService.config[key];
        }
        return defaultValue;
    }

    public static getConfig(): IClientAppConfig {
        return ConfigService.config;
    }

    public static init(config: IClientAppConfig) {
        ConfigService.config = config;
    }

    public static set<T>(key: string, value: T) {
        ConfigService.storage[key] = value;
    }
}
