import { IVariantClientAppConfig } from "../service/ConfigService";

export const VariantConfig: IVariantClientAppConfig = {
    api: "https://api.vesta.bz",
    env: "production",
    sw: "service-worker",
    viewport: {
        Large: 1024,
        Medium: 768,
        Small: 425,
    },
};
