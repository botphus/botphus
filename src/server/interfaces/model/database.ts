import {ClusterOptions, RedisOptions} from 'ioredis';
import {Document} from 'mongoose';
import {ConnectionConfig} from 'mysql';

import {DatabaseType} from '../../types/database';

/**
 * Database model
 */
export interface IDatabaseModel extends Document {
    name: string;
    type: DatabaseType;
}

/**
 * Mysql database model
 */
export interface IDatabaseMysqlModel extends IDatabaseModel {
    type: DatabaseType.MYSQL;
    config: ConnectionConfig;
}

/**
 * Redis database model
 */
export interface IDatabaseRedisModel extends IDatabaseModel {
    type: DatabaseType.MYSQL;
    config: RedisOptions | ClusterOptions;
}
