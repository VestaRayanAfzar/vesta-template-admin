import { IAppConfig } from "../config/appConfig";

export class Config {

    public static get<T>(key: string, defaultValue?: T): T {
        if (key in Config.storage) {
            return Config.storage[key];
        }
        if (key in Config.config) {
            return Config.config[key];
        }
        return defaultValue;
    }

    public static getConfig(): IAppConfig {
        return Config.config;
    }

    public static init(config: IAppConfig) {
        Config.config = config;
    }

    public static set<T>(key: string, value: T) {
        Config.storage[key] = value;
    }

    private static config: IAppConfig;
    private static storage: any = {};
}
