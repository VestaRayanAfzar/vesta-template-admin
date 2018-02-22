import { IClientAppConfig } from "../service/ConfigService";
import { VariantConfig } from "./config.var";

export const Config: IClientAppConfig = {
    api: VariantConfig.api,
    env: VariantConfig.env,
    locale: "fa-IR",
    name: "vesta",
    pagination: {
        itemsPerPage: 20,
    },
    sw: VariantConfig.sw,
    transition: {
        enter: 150,
        leave: 100,
    },
    version: {
        api: "v1",
        app: "0.8.1",
    },
    viewport: VariantConfig.viewport,
};
