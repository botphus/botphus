import {ClusterNode, RedisOptions} from 'ioredis';
import {Document} from 'mongoose';
import {ConnectionConfig} from 'mysql';

import {DatabaseType} from '../../types/database';

/**
 * Database model
 */
export interface IDatabaseModel extends Document {
    name: string;
    type: DatabaseType;
    config: ConnectionConfig | RedisOptions | ClusterNode[];
}

/**
 * Search database Model
 */
export interface IDatabaseSearchModel {
    name?: string;
    type?: DatabaseType;
}
