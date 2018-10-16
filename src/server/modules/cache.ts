import * as Redis from 'ioredis';

import config from './config';

let redisClient: Redis.Redis;

if (Array.isArray(config.redis)) {
    redisClient = new Redis.Cluster(config.redis);
} else {
    redisClient = new Redis(config.redis);
}

export default redisClient;

/**
 * get Redis key with namespace
 * @param  {string} key Redis key
 * @return {string}     Redis key with namespace
 */
export function getRedisKey(key: string): string {
    return `${config.redisNamespace}:${key}`;
}
