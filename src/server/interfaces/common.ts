import * as cookie from 'cookie';
import * as fastify from 'fastify';
import * as http from 'http';
import * as http2 from 'http2';
import {ClusterNode, RedisOptions} from 'ioredis';
import {Schema} from 'mongoose';

import {SystemCode} from '../types/common';
import {UserPermissionCode} from '../types/user';

interface ISchemaErrorData {
    keyword: string;
    dataPath: string;
    schemaPath: string;
    params: any[];
    message: string;
}

/**
 * System Error
 */
export interface ISystemError extends Error {
    code?: SystemCode;
    errors?: any;
    type?: string; // Mongo field
    validation?: ISchemaErrorData[]; // JSON-schema field
}

/**
 * Botphus system config
 */
export interface ISystemConfig {
    port: number; // Server listen port;
    locale: string; // Locale package name for site & antd, check detail: https://ant.design/docs/react/i18n-cn & locale dir: "/src/server/locale"
    // Logger
    logPath: string; // If not set, will be show in console. Like: /var/log/botphus/
    logType: 'console' | 'file' | 'close';
    logLevel: 'fatal'| 'error' | 'warn' | 'info' | 'debug' | 'trace'; // Log level, check detail: https://www.npmjs.com/package/abstract-logging
    logPretty: boolean; // Open pretty log or default json
    // Connection & cache
    redis: RedisOptions | ClusterNode[]; // Ioredis setting, check detail: https://github.com/luin/ioredis/blob/master/API.md
    redisNamespace: string; // redis key namespace
    db: string; // Mongoose setting, check detail: https://mongoosejs.com/docs/api.html#mongoose_Mongoose-connect
    // Socket
    socket: string; // Socket url
    socketPort: number; // Socket port, will use when socket is "local"
    // Salt
    serverSalt: string; // Password salt for server sign
    clientSalt: string; // Password salt for client login & register
    // Session cookie key
    sessionCookieKey: string;
    sessionRedisExpire: number; // Hours
    // Page
    pageSize: number;
    maxPageSize: number;
}

/**
 * Http response message
 */
export interface IHttpResponseMessage {
    code: SystemCode;
    message: string;
    // Request ID
    rid: string;
    data: {
        content: any[];
        page: number;
        pageSize: number;
        total: number;
    } | any;
}

/**
 * App request
 */
export interface IAppRequest extends fastify.FastifyRequest<http.IncomingMessage | http2.Http2ServerRequest> {
    cookies?: {
        [index: string]: any
    };
    session?: ISessionConfig;
    initSession?: ISessionConfig;
    originalUrl?: string;
    method?: fastify.HTTPMethod;
}

/**
 * App replay
 */
export interface IAppReply extends fastify.FastifyReply<http.ServerResponse | http2.Http2ServerResponse> {
    setCookie?: (name: string, value: string, options?: cookie.CookieSerializeOptions) => fastify.FastifyReply<http.ServerResponse | http2.Http2ServerResponse>;
}

/**
 * Route config
 */
export interface IAppRouterConfig {
    [index: string]: UserPermissionCode;
}

export interface ISessionConfig {
    [index: string]: any;
    user?: {
        id: Schema.Types.ObjectId;
        email: string;
        nickname: string;
        permission: number;
    };
}
