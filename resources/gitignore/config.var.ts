import {IVariantClientAppConfig} from "../service/ConfigService";

export const VariantConfig: IVariantClientAppConfig = {
    env: 'production',
    api: 'https://api.vesta.bz',
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