import {NodeConfiguration, RedisOptions} from 'ioredis';
import {Document} from 'mongoose';
import {ConnectionConfig} from 'mysql';

import {ConnectionType} from '../../types/connection';

/**
 * Return data
 */
/**
 * Connection list item
 */
export interface IConnectionListItem {
    _id?: string;
    name?: string;
    type?: ConnectionType;
}

/**
 * Mysql
 */
interface IConnectionDetailMysqlItem extends IConnectionListItem {
    type?: ConnectionType.MYSQL;
    config?: ConnectionConfig;
}

/**
 * Redis
 */
interface IConnectionDetailRedisItem extends IConnectionListItem {
    type?: ConnectionType.REDIS;
    config?: RedisOptions | NodeConfiguration[];
}

/**
 * Connection detail item
 */
export type IConnectionDetailItem = IConnectionDetailMysqlItem | IConnectionDetailRedisItem;

/**
 * Connection base model
 */
export interface IConnectionBaseModel extends Document {
    name?: string;
    type: ConnectionType;
    config?: ConnectionConfig | RedisOptions | NodeConfiguration[];
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
