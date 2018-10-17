import {ClusterNode, RedisOptions} from 'ioredis';
import {Document} from 'mongoose';
import {ConnectionConfig} from 'mysql';

import {ConnectionType} from '../../types/connection';

/**
 * Connection model
 */
export interface IConnectionModel extends Document {
    name: string;
    type: ConnectionType;
    config: ConnectionConfig | RedisOptions | ClusterNode[];
}

/**
 * Search connection Model
 */
export interface IConnectionSearchModel {
    name?: string;
    type?: ConnectionType;
}
