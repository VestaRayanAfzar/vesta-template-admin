import {VariantConfig} from "./config.var";
import {IClientAppConfig} from "../service/ConfigService";

export const Config: IClientAppConfig = {
    name: 'vestaTemplateCpanel',
    version: {
        app: '0.1.0',
        api: 'v1'
    },
    locale: 'fa-IR',
    api: VariantConfig.api,
    sw: VariantConfig.sw,
    env: VariantConfig.env,
    cache: VariantConfig.cache,
    viewport: VariantConfig.viewport,
    pagination: {
        itemsPerPage: 20
    },
    transition: {
        enter: 150,
        leave: 100
    }
};
