const env: any = process.env;

export interface IServerConfig {
    dir: {
        html: string;
    };
    http2?: boolean;
    ssl?: {
        key: string;
        cert: string;
    }
    port: number;
    env: string;
}

export const Config: IServerConfig = {
    dir: {
        html: '/app/www'
    },
    http2: false,
    ssl: {
        key: '/app/ssl/privkey.pem',
        cert: '/app/ssl/fullchain.pem'
    },
    port: +env.PORT || 3000,
    env: env.NODE_ENV
};