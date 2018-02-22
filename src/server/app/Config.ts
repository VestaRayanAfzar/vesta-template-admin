const env: any = process.env;

export interface IServerConfig {
    dir: {
        html: string;
    };
    http2?: boolean;
    ssl?: {
        key: string;
        cert: string;
    };
    port: number;
    env: string;
}

export const Config: IServerConfig = {
    dir: {
        html: "/app/www",
    },
    env: env.NODE_ENV,
    http2: false,
    port: +env.PORT || 3000,
    ssl: {
        cert: "/app/ssl/fullchain.pem",
        key: "/app/ssl/privkey.pem",
    },
};