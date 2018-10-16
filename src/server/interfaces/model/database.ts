import {ClusterNode, RedisOptions} from 'ioredis';
import {Document} from 'mongoose';
import {ConnectionConfig} from 'mysql';

import {ConnectionType} from '../../types/database';

/**
 * Connection model
 */
export interface IConnectionModel extends Document {
    name: string;
    type: ConnectionType;
    config: ConnectionConfig | RedisOptions | ClusterNode[];
}

/**
 * Search database Model
 */
export interface IConnectionSearchModel {
    name?: string;
    type?: ConnectionType;
}
