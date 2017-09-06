import {IVariantClientAppConfig} from "../service/ConfigService";

export const VariantConfig: IVariantClientAppConfig = {
    env: 'development',
    api: 'http://192.168.99.100:3000/api/v1',
    asset: '',
    cache: {
        api: 0
    },
    viewport: {
        Small: 425,
        Medium: 768,
        Large: 1024
    }
};