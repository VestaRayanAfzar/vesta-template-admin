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
    port: process.env.PORT || 80,
    env: process.env.NODE_ENV
};