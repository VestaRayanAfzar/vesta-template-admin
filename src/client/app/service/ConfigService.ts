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

export interface IClientAppConfig extends IVariantClientAppConfig {
    name: string;
    version: { app: string, api: string };
    locale: string;
}


export class ConfigService {
    private static instance: ConfigService;
    private static config: IClientAppConfig;

    static init(config: IClientAppConfig) {
        ConfigService.config = config;
    }

    public static getConfig(): IClientAppConfig {
        return ConfigService.config;
    }
}