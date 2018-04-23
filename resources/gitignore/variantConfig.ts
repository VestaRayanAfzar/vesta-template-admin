export interface IVariantConfig {
    api: string;
    env: string;
    sw: string;
    viewport: {
        Large: number;
        Medium: number;
        Small: number;
    };
}

export const variantConfig: IVariantConfig = {
    api: "https://api.vesta.bz",
    env: "production",
    sw: "service-worker",
    viewport: {
        Large: 1024,
        Medium: 768,
        Small: 425,
    },
};
