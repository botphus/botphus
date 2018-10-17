import {NodeConfiguration, RedisOptions} from 'ioredis';
import {Document} from 'mongoose';
import {ConnectionConfig} from 'mysql';

import {ConnectionType} from '../../types/connection';

/**
 * Connection base model
 */
export interface IConnectionBaseModel extends Document {
    name: string;
    type: ConnectionType;
    config: ConnectionConfig | RedisOptions | NodeConfiguration[];
}

/**
 * Mysql connection model
 */
export interface IMysqlConnectionModel extends IConnectionBaseModel {
    type: ConnectionType.MYSQL;
    config: ConnectionConfig;
}

/**
 * Redis connection model
 */
export interface IRedisConnectionModel extends IConnectionBaseModel {
    type: ConnectionType.REDIS;
    config: RedisOptions | NodeConfiguration[];
}

/**
 * Connection model
 */
export type IConnectionModel = IMysqlConnectionModel | IRedisConnectionModel;

/**
 * Search connection Model
 */
export interface IConnectionSearchModel {
    name?: string;
    type?: ConnectionType;
}
