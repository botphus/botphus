import {ClusterOptions, RedisOptions} from 'ioredis';

import {SystemCode} from '../types/common';

export interface ISystemError extends Error {
    code?: SystemCode;
    errors?: any;
}

/**
 * Botphus system config
 */
export interface ISystemConfig {
    port: number; // Server listen port;
    locale: string; // Locale package name for site & antd, check detail: https://ant.design/docs/react/i18n-cn & locale dir: "/src/server/locale"
    // Logger
    logPath: string; // If not set, will be show in console. Like: /var/log/botphus/
    logType: 'console' | 'file';
    logLevel: 'fatal'| 'error' | 'warn' | 'info' | 'debug' | 'trace'; // Log level, check detail: https://www.npmjs.com/package/abstract-logging
    logPretty: boolean; // Open pretty log or default json
    // Database & cache
    redis: RedisOptions | ClusterOptions; // Ioredis setting, check detail: https://github.com/luin/ioredis/blob/master/API.md
    db: string; // Mongoose setting, check detail: https://mongoosejs.com/docs/api.html#mongoose_Mongoose-connect
    // Socket
    socket: string; // Socket url
    socketPort: number; // Socket port, will use when socket is "local"
    // Salt
    serverSalt: string; // Password salt for server sign
    clientSalt: string; // Password salt for client login & register
}

/**
 * Http response message
 */
export interface IHttpErrorMessage {
    code: SystemCode;
    message: string;
}
