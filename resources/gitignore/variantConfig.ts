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
    api: "http://192.168.99.100:3000",
    env: "production",
    sw: "service-worker",
    viewport: {
        Large: 1024,
        Medium: 768,
        Small: 425,
    },
};
