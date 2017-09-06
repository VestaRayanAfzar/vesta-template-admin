import {VariantConfig} from "./config.var";
import {IClientAppConfig} from "../service/ConfigService";

export const Config: IClientAppConfig = {
    name: 'materialCPanelTemplate',
    version: {
        app: '0.1.0',
        api: 'v1'
    },
    locale: 'en-US',
    api: VariantConfig.api,
    asset: VariantConfig.asset,
    env: VariantConfig.env,
    cache: VariantConfig.cache,
    viewport: VariantConfig.viewport
};
