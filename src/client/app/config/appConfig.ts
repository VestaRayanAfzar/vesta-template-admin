import { cmnConfig, ICmnConfig } from "../cmn/config/cmnConfig";
import { IVariantConfig, variantConfig } from "./variantConfig";

export interface IPaginationConfig {
    itemsPerPage: number;
}

export interface ITransitionConfig {
    enter: number;
    leave: number;
}

export interface IAppConfig extends IVariantConfig, ICmnConfig {
    pagination: IPaginationConfig;
    transition: ITransitionConfig;
}

export const appConfig: IAppConfig = {
    api: variantConfig.api,
    env: variantConfig.env,
    locale: cmnConfig.locale,
    name: cmnConfig.name,
    pagination: {
        itemsPerPage: 20,
    },
    sw: variantConfig.sw,
    transition: {
        enter: 150,
        leave: 100,
    },
    version: cmnConfig.version,
    viewport: variantConfig.viewport,
};
