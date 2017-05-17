import {IClientAppSetting} from "../config/setting";

export class ConfigService {
    private static instance: ConfigService;

    constructor(private setting: IClientAppSetting) {
        ConfigService.instance = this;
    }

    static init(setting: IClientAppSetting) {
        new ConfigService(setting);
    }

    public get<T>(key: string, defaultValue: T = null): T {
        return key in this.setting ? this.setting[key] : defaultValue;
    }

    static getInstance(): ConfigService {
        return ConfigService.instance;
    }
}